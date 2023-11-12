class UsersController < ApplicationController
    before_action :set_medication, only: [:show, :edit, :update, :destroy]
    protect_from_forgery with: :null_session

    def index
      @users = User.all
      render json: @users
    end
  
    def show
      render json: @users
    end
  
    def new
      @user = User.new
      render json: @users
    end
  
    def create
      @user = User.new(user_params)
      if @user.save
        render json: @users
      else
        render json: @users
      end
    end
  
    def edit
      render json: @users
    end
  
    def update
      if @user.update(user_params)
        render json: @users
      else
        render json: @users
      end
    end
  
    def destroy
      @user.destroy
      render json: @users
    end
  
    private
  
    def set_user
      render json: @users
    end
  
    def user_params
      params.require(:user).permit(:firstName, :lastName, :birthDate, :personalPhone, :address, :gender)
    end
  end
  