json.partial! @filing, partial: 'filing', as: :filing

# TODO: maybe dry this view out
json.awards do
  json.pagination @pagination
  json.data do
    json.array! @awards, partial: 'api/awards/award', as: :award
  end
end
