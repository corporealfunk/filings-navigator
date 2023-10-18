class FilingMapper
  def initialize(xml_string)
    @doc = Ox.load(xml_string)
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
      grant_amount: 'CashGrantAmt'
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
