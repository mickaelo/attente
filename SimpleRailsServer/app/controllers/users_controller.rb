class UsersController < ApplicationController
    before_action :set_user, only: [:show, :edit, :update, :destroy]
    protect_from_forgery with: :null_session

    def index
      @users = User.all
      render json: @users
    end
  
    def show
      @user = User.find(params[:id])
      render json: @user
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
      if @user.update(user_params)
        render json: @user
      else
        render json: @user.errors, status: :unprocessable_entity
      end
    end
  
    def update
      if @user.update(user_params)
        render json: @user
      else
        render json: @user.errors, status: :unprocessable_entity
      end
    end
  
    def destroy
      @user.destroy
      render json: @users
    end
  
    private
  
    def set_user
      @user = User.find(params[:id])
    end
  
    def user_params
      params.require(:user).permit(:firstName, :lastName, :birthDate, :personalPhone, :address, :gender)
    end
  end
  