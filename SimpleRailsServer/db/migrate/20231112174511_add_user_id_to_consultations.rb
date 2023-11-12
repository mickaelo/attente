class AddUserIdToConsultations < ActiveRecord::Migration[6.0]
  def change
    add_reference :consultations, :user, foreign_key: true
  end
end
