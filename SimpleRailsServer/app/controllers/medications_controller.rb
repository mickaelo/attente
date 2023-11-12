class MedicationsController < ApplicationController
  before_action :set_medication, only: [:show, :edit, :update, :destroy]
  protect_from_forgery with: :null_session

  def index
    @medications = Medication.all
    render json: @medications
  end

  def show
    render json: @medication
  end

  def new
    @medication = Medication.new
    render json: @medication
  end

  def create
    @medication = Medication.new(medication_params)

    if @medication.save
      render json: @medication, status: :created
    else
      render json: @medication.errors, status: :unprocessable_entity
    end
  end

  def edit
    render json: @medication
  end

  def update
    if @medication.update(medication_params)
      render json: @medication
    else
      render json: @medication.errors, status: :unprocessable_entity
    end
  end

  def destroy
    @medication.destroy
    head :no_content
  end

  private

  def set_medication
    @medication = Medication.find(params[:id])
  end

  def medication_params
    params.require(:medication).permit(:name, :dosage)
  end
end
