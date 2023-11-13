class User < ApplicationRecord
    store_accessor :firstName
    has_many :consultations
    # validates :firstName, presence: true
end
