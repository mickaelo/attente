# app/models/consultation.rb

class Consultation < ApplicationRecord
    store_accessor :measurements, :key, :type, :OD_measure, :OD_AVL, :OD_AVP, :OD_ADD, :OG_measure, :OG_AVL, :OG_AVP, :OG_ADD
    store_accessor :exams, :laf, :fo, :external, :conclusion
    store_accessor :description, :prescription, :courrier
    validates :prescription, :antecedents, :allergies, :name, :status, :diagnosis, :date, presence: true
  
    # Ajoutez d'autres validations au besoin
  end
  