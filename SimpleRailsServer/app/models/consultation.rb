# app/models/consultation.rb

class Consultation < ApplicationRecord
    validates :prescription, :antecedents, :allergies, :name, :status, :diagnosis, :date, presence: true
  
    # Ajoutez d'autres validations au besoin
  end
  