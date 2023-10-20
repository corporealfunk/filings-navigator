json.partial! @filing, partial: 'filing', as: :filing

json.awards do
  json.array! @filing.awards, partial: 'api/awards/award', as: :award
end
