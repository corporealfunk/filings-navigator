class CreateAwards < ActiveRecord::Migration[7.0]
  def change
    create_table :awards do |t|
      t.bigint :filing_id
      t.integer :amount
      t.string :purpose
      t.bigint :recipient_id

      t.timestamps
    end
  end
end
