class Filing < ApplicationRecord
  has_many :awards
  belongs_to :filer, class_name: 'Organization'
end
