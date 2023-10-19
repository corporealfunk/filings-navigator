class AddIsCanonicalToFilings < ActiveRecord::Migration[7.0]
  def change
    add_column :filings, :is_canonical, :boolean, default: false
  end
end
