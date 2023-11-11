# db/migrate/YYYYMMDDHHMMSS_add_malady_to_medicaments.rb

class AddMaladyToMedications < ActiveRecord::Migration[6.0]
  def change
    add_reference :medications, :malady, foreign_key: true
  end
end
