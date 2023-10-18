class Organization < ApplicationRecord
  has_many :awards, foreign_key: :recipient_id
  has_many :filings, foreign_key: :filer_id
end
