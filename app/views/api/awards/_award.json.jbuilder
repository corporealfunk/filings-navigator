json.id award.id
json.amount award.amount
json.purpose award.purpose

json.recipient do
  json.partial! 'api/organizations/organization', organization: award.recipient
end
