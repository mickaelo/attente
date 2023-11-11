# db/migrate/TIMESTAMP_create_medications.rb

class CreateMedications < ActiveRecord::Migration[6.1]
  def change
    create_table :medications do |t|
      t.string :name
      t.string :posology

      t.timestamps
    end
  end
end
