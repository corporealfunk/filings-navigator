json.return_timestamp filing.return_timestamp
json.tax_period_end_date filing.tax_period_end_date
json.is_ammended filing.is_ammended?
json.is_canonical filing.is_canonical?
json.awards_count filing.awards.count

json.filer do
  json.partial! 'api/organizations/organization', organization: filing.filer
end

# TODO: we're exposing sequential db IDs all over the place, let's not do that in production
json.awards_path api_filing_awards_path(filing)
