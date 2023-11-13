# app/models/consultation.rb

class Consultation < ApplicationRecord
    validates :prescription, :antecedents, :allergies, :name, :status, :diagnosis, :date, presence: true
    belongs_to :user
    # Ajoutez d'autres validations au besoin
  end
  