class Organization < ApplicationRecord
  has_many :awards_received, class_name: 'Award', foreign_key: :recipient_id
  has_many :filings, foreign_key: :filer_id

  validates :name, presence: true

  scope :recipients, -> { self.joins(:awards_received).distinct }
  scope :filers, -> { self.joins(:filings).distinct }
end
