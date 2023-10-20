json.pagination @pagination
json.data do
  json.array! @awards, partial: 'award', as: :award
end
