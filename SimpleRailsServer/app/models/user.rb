class User < ApplicationRecord
    store_accessor :firstName
    # has_many :medications
    # validates :firstName, presence: true
end
