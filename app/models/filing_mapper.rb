class FilingMapper

  # TODO: this takes in a whole XML string. Maybe we should just pass an IO
  # object and figure out here how to read these XML files a little more
  # efficiently instead of reading them into memory
  def initialize(xml_string)
    @doc = Ox.load(xml_string)
  end

  # This method is idempotent. You can import any xml file
  # multiple times at it will not just keep adding new records,
  # it does this by assuming the organizational EIN/Name combos
  # are unique. That may not be the case in a wider data set,
  # but I'm making that assumption here. I had hoped to make this
  # idempotent by linking everything to a filer or recipient's EIN,
  # but EIN numbers can be blank! so.. EIN/name combo it is
  def map_to_db!
    filer_attrs = self.get_filer_attributes

    filing_attrs = self.get_filing_attributes

    award_and_receipient_attrs = self.get_all_award_and_receipient_attributes

    # wrap it in a transaction, so it will rollback if we hit a snag
    Organization.transaction do
      # assume EIN / name combinations are unique
      # should we have a unique DB key on those?
      filer = Organization.find_or_create_by(
        ein: filer_attrs[:ein],
        name: filer_attrs[:name]
      )

      filer.update!(filer_attrs)

      # Assumes that all XML filings/returns have a unique timestamp per Filer (EIN/name combo)
      filing = Filing.find_or_create_by(
        filer: filer,
        return_timestamp: filing_attrs[:return_timestamp]
      )

      filing.update!(filing_attrs)

      award_and_receipient_attrs.each_with_index do |recipient_award|
        recipient_attrs = recipient_award[:recipient_attrs]
        award_attrs = recipient_award[:award_attrs]

        # assume EIN / name combinations are unique
        # should we have a unique DB key on those?
        recipient = Organization.find_or_create_by(
          ein: recipient_attrs[:ein],
          name: recipient_attrs[:name]
        )

        award = Award.find_or_create_by(
          filing: filing,
          amount: award_attrs[:amount],
          purpose: award_attrs[:purpose],
          recipient: recipient
        )
      end
    end
  end

  def get_filer_attributes
    ox_paths = {
      name: 'Return/ReturnHeader/Filer/BusinessName/BusinessNameLine1Txt',
      ein: 'Return/ReturnHeader/Filer/EIN',
      address_line_1: 'Return/ReturnHeader/Filer/USAddress/AddressLine1Txt',
      address_city: 'Return/ReturnHeader/Filer/USAddress/CityNm',
      address_state: 'Return/ReturnHeader/Filer/USAddress/StateAbbreviationCd',
      address_zip: 'Return/ReturnHeader/Filer/USAddress/ZIPCd'
    }

    self.map_ox_paths_to_attributes(ox_paths, @doc)
  end

  def get_filing_attributes
    ox_paths = {
      return_timestamp: 'Return/ReturnHeader/ReturnTs',
      tax_period_end_date: 'Return/ReturnHeader/TaxPeriodEndDt',
      is_ammended: 'Return/ReturnData/IRS990/AmendedReturnInd'
    }

    attrs = self.map_ox_paths_to_attributes(ox_paths, @doc)

    attrs[:is_ammended] = attrs[:is_ammended] == 'X'
    attrs
  end

  # array of awards and nested receipient attributes
  # returns array of hashes wiht keys:
  # :recipient_attrs
  # :award_attrs
  def get_all_award_and_receipient_attributes
    ox_paths_recipient = {
      name: 'RecipientBusinessName/BusinessNameLine1Txt',
      ein: 'RecipientEIN',
      address_line_1: 'USAddress/AddressLine1Txt',
      address_city: 'USAddress/CityNm',
      address_state: 'USAddress/StateAbbreviationCd',
      address_zip: 'USAddress/ZIPCd',
    }

    ox_paths_award = {
      amount: 'CashGrantAmt',
      purpose: 'PurposeOfGrantTxt'
    }

    # recipient nodes with
    results = @doc.locate('Return/ReturnData/IRS990ScheduleI/RecipientTable').map do |recipient_node|
      {
        recipient_attrs: self.map_ox_paths_to_attributes(
          ox_paths_recipient,
          recipient_node
        ),
        award_attrs: self.map_ox_paths_to_attributes(
          ox_paths_award,
          recipient_node
        )
      }
    end

    # If name && EIN are blank, we are going to purge those:
    results.select do |recipient_award|
      recipient_attrs = recipient_award[:recipient_attrs]
      recipient_attrs[:name].present? && recipient_attrs[:ein].present?
    end
  end

  private
  def map_ox_paths_to_attributes(ox_paths, node)
    attrs = {}

    ox_paths.each do |key, path|
      attrs[key] = node.locate(path).first&.nodes&.first
    end

    attrs
  end
end
