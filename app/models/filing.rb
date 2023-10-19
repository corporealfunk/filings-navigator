class Filing < ApplicationRecord
  has_many :awards
  belongs_to :filer, class_name: 'Organization'

  # TODO: maybe we need an index here if we had a lot of data
  scope :sorted, -> { order(return_timestamp: :desc) }
end
