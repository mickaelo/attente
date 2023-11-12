class AddExamsToTableName < ActiveRecord::Migration[6.0]
  def change
    change_column :consultations, :exams, :jsonb, default: {}
  end
end
