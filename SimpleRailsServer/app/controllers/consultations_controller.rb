# app/controllers/consultations_controller.rb
class ConsultationsController < ApplicationController
    before_action :set_consultation, only: [:show, :edit, :update, :destroy]
    protect_from_forgery with: :null_session

    def index
      @consultations = Consultation.all
      render json: @consultations

    end
  
    def show
      @consultation = Consultation.find(params[:id])
      render json: @consultation

    end

    def edit
      # Logique de l'action d'édition
    end
  
    def update
      if @consultation.update(consultation_params)
        render json: @consultation
      else
        render json: @consultation.errors, status: :unprocessable_entity
      end
    end

    
    def destroy
      @consultation.destroy
      head :no_content
    end
  
    def new
      @consultation = Consultation.new
    end
  
    def create
      @consultation = Consultation.new(consultation_params)
  
      if @consultation.save
        # Gestion de la création réussie (par exemple, redirection vers la page de consultation)
        render json: @consultation
      else
        render json: @consultation.errors, status: :unprocessable_entity
      end
    end
  
    private
  
    def set_consultation
      @consultation = Consultation.find(params[:id])
    end
  
    def consultation_params
      params.require(:consultation).permit(:prescription, :antecedents, :allergies, :name, :status, :diagnosis, :date, :presence, :measurements, :description, :owner_id, :user_id, :exams => [:conclusion, :motif, :external => [:od, :og], :fo => [:od, :og], :laf => [:od, :og]])
    end
  end
  