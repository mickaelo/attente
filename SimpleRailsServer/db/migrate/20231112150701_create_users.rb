class CreateUsers < ActiveRecord::Migration[7.1]
  def change
    create_table :users do |t|
      t.string :firstName
      t.string :lastName
      t.date :birthDate
      t.string :idNumber
      t.string :occupation
      t.string :personalPhone
      t.string :address
      t.string :gender
      t.string :maritalStatus
      t.string :insurance
      t.string :email
      t.string :homePhone
      t.text :notes

      t.timestamps
    end
  end
end
