class Award < ApplicationRecord
  belongs_to :filing
  belongs_to :recipient, class_name: 'Organization'

  validates :amount, numericality: { only_integer: true }
  validates :filing, :recipient, presence: true
end
