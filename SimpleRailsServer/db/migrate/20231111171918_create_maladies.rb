# db/migrate/YYYYMMDDHHMMSS_create_maladies.rb

class CreateMaladies < ActiveRecord::Migration[6.0]
  def change
    create_table :maladies do |t|
      t.string :name
      t.text :treatments, array: true, default: []
      
      t.timestamps
    end
  end
end
