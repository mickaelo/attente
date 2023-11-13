class AddUserToConsultation < ActiveRecord::Migration[7.1]
  def change
    add_column :consultations, :end_date, :datetime, null: true
  end
end
