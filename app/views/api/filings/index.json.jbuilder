json.pagination @pagination
json.data do
  json.array! @filings, partial: 'filing', as: :filing
end
