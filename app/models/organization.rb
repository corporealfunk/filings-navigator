class Organization < ApplicationRecord
  has_many :awards_received, foreign_key: :recipient_id
  has_many :filings, foreign_key: :filer_id

  validates :name, presence: true
end
