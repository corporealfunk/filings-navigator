class CreateFilings < ActiveRecord::Migration[7.0]
  def change
    create_table :filings do |t|
      t.bigint :filer_id
      t.timestamp :return_timestamp
      t.timestamp :tax_period_end_date
      t.boolean :is_ammended

      t.timestamps
    end
  end
end
