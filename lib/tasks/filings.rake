require 'open-uri'

namespace :filings do
  desc "Import all filings from URLs. Idempotent"
  task import_xml: :environment do
    puts "Mapping XML files into DB:"
    urls = [
      'https://filing-service.s3-us-west-2.amazonaws.com/990-xmls/201612429349300846_public.xml',
      'https://filing-service.s3-us-west-2.amazonaws.com/990-xmls/201831309349303578_public.xml',
      'https://filing-service.s3-us-west-2.amazonaws.com/990-xmls/201641949349301259_public.xml',
      'https://filing-service.s3-us-west-2.amazonaws.com/990-xmls/201921719349301032_public.xml',
      'https://filing-service.s3-us-west-2.amazonaws.com/990-xmls/202141799349300234_public.xml',
      'https://filing-service.s3-us-west-2.amazonaws.com/990-xmls/201823309349300127_public.xml',
      'https://filing-service.s3-us-west-2.amazonaws.com/990-xmls/202122439349100302_public.xml',
      'https://filing-service.s3-us-west-2.amazonaws.com/990-xmls/201831359349101003_public.xml'
    ]

    urls.each do |url|
      puts "  -> #{url}"
      filing_mapper = FilingMapper.new(URI(url).read)

      filing_mapper.map_to_db!
    end
  end
end
