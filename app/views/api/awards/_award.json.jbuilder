json.id award.id
json.amount award.amount
json.purpose award.purpose

# TODO: we don't always need this data depending on what the front end needs, maybe conditionally include it
json.recipient do
  json.partial! 'api/organizations/organization', organization: award.recipient
end

# TODO: we don't always need this data depending on what the front end needs, maybe conditionally include it
json.filing do
  json.partial! 'api/filings/filing', filing: award.filing
end
