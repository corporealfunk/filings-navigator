# TODO: a prod app should have UUIDs not exposing sequential ids:
json.id filing.id
json.return_timestamp filing.return_timestamp
json.tax_period_end_date filing.tax_period_end_date
json.is_ammended filing.is_ammended?
json.is_canonical filing.is_canonical?
json.awards_count filing.awards.count

json.filer do
  json.partial! 'api/organizations/organization', organization: filing.filer
end
