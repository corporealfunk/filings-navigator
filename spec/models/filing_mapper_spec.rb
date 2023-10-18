require 'rails_helper'
require 'open-uri'

describe FilingMapper do
  describe "#get_filer_attributes" do
    before(:each) do
      path = Rails.root.join('test', 'fixtures', 'files', '201612429349300846_public.xml')
      @filing_mapper = FilingMapper.new(File.read(path))
    end

    it "returns filer/org attributes" do
      expect(@filing_mapper.get_filer_attributes).to include(
        name: 'Pasadena Community Foundation',
        ein: '200253310',
        address_line_1: '301 E Colorado Blvd No 810',
        address_city: 'Pasadena',
        address_state: 'CA',
        address_zip: '91101'
      )
    end
  end

  describe "#get_filing_attributes" do
    context "when it is an ammended return" do
      before(:each) do
        path = Rails.root.join('test', 'fixtures', 'files', '201612429349300846_public.xml')
        @filing_mapper = FilingMapper.new(File.read(path))
      end

      it "returns filing attributes" do
        expect(@filing_mapper.get_filing_attributes).to include(
          return_timestamp: '2016-08-29T15:59:11-05:00',
          tax_period_end_date: '2015-12-31',
          is_ammended: true
        )
      end
    end

    context "when it is not an ammended return" do
      before(:each) do
        path = Rails.root.join('test', 'fixtures', 'files', '202141799349300234_public.xml')
        @filing_mapper = FilingMapper.new(File.read(path))
      end

      it "returns filing attributes" do
        expect(@filing_mapper.get_filing_attributes).to include(
          return_timestamp: '2021-06-28T11:43:19-05:00',
          tax_period_end_date: '2020-12-31',
          is_ammended: false
        )
      end
    end
  end

  describe "#get_all_award_and_receipient_attributes" do
    before(:each) do
      path = Rails.root.join('test', 'fixtures', 'files', '201612429349300846_public.xml')
      @filing_mapper = FilingMapper.new(File.read(path))
    end

    it "returns filing attributes" do
      expect(@filing_mapper.get_all_award_and_receipient_attributes).to include(
        {
          :address_city=>"Pasadena",
          :address_line_1=>"PO Box 93397",
          :address_state=>"CA",
          :address_zip=>"911093397",
          :ein=>"954527969",
          :grant_amount=>"52064",
          :name=>"Young & Healthy"
        }
      )
    end
  end
end
