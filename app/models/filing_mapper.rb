class FilingMapper
  def initialize(xml_string)
    @doc = Ox.load(xml_string)
  end

  # TODO: EIN numbers can be blank!
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

      # Assumes that all XML filings/returns have a unique timestamp per Filer/EIN
      filing = Filing.find_or_create_by(
        filer: filer,
        return_timestamp: filing_attrs[:return_timestamp]
      )

      filing.update!(filing_attrs)

      award_and_receipient_attrs.each do |ar_attrs|
        # assume EIN / name combinations are unique
        # should we have a unique DB key on those?
        recipient = Organization.find_or_create_by(
          ein: ar_attrs[:ein],
          name: ar_attrs[:name]
        )

        # this is a little messy to have shoved the amount into
        # the rest of the receipient attributes :(
        amount = ar_attrs[:amount]

        ar_attrs.delete(:amount)

        recipient.update!(ar_attrs)

        award = Award.find_or_create_by(
          filing: filing,
          amount: amount,
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
  def get_all_award_and_receipient_attributes
    ox_paths = {
      name: 'RecipientBusinessName/BusinessNameLine1Txt',
      ein: 'RecipientEIN',
      address_line_1: 'USAddress/AddressLine1Txt',
      address_city: 'USAddress/CityNm',
      address_state: 'USAddress/StateAbbreviationCd',
      address_zip: 'USAddress/ZIPCd',
      amount: 'CashGrantAmt'
    }

    # recipient nodes with
    @doc.locate('Return/ReturnData/IRS990ScheduleI/RecipientTable').map do |recipient_node|
      self.map_ox_paths_to_attributes(ox_paths, recipient_node)
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
