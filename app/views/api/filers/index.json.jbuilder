json.pagination @pagination
json.data do
  json.array! @filers, partial: 'api/organizations/organization', as: :organization
end
