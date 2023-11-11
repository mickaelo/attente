# app/controllers/medications_controller.rb

class MedicationsController < ApplicationController
  protect_from_forgery with: :null_session

  def index
    @medications = Medication.all
    render json: @medications

  end
end
