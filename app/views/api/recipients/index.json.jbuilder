json.pagination @pagination
json.data do
  json.array! @recipients, partial: 'api/organizations/organization', as: :organization
end
