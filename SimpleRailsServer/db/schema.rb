# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.1].define(version: 2023_11_13_124673) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "consultations", force: :cascade do |t|
    t.text "prescription"
    t.text "antecedents"
    t.text "allergies"
    t.string "name"
    t.string "status"
    t.text "diagnosis"
    t.jsonb "measurements"
    t.jsonb "description"
    t.string "rating"
    t.datetime "date", precision: nil
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "user_id"
    t.jsonb "exams", default: {}
    t.bigint "owner_id"
    t.bigint "users_id"
    t.datetime "end_date"
    t.index ["owner_id"], name: "index_consultations_on_owner_id"
    t.index ["user_id"], name: "index_consultations_on_user_id"
    t.index ["users_id"], name: "index_consultations_on_users_id"
  end

  create_table "maladies", force: :cascade do |t|
    t.string "name"
    t.text "treatments", default: [], array: true
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "medications", force: :cascade do |t|
    t.string "name"
    t.string "posology"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "malady_id"
    t.index ["malady_id"], name: "index_medications_on_malady_id"
  end

  create_table "medications_maladies", id: false, force: :cascade do |t|
    t.bigint "medication_id"
    t.bigint "maladie_id"
    t.index ["maladie_id"], name: "index_medications_maladies_on_maladie_id"
    t.index ["medication_id"], name: "index_medications_maladies_on_medication_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "firstName"
    t.string "lastName"
    t.date "birthDate"
    t.string "idNumber"
    t.string "occupation"
    t.string "personalPhone"
    t.string "address"
    t.string "gender"
    t.string "maritalStatus"
    t.string "insurance"
    t.string "email"
    t.string "homePhone"
    t.text "notes"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  add_foreign_key "consultations", "users"
  add_foreign_key "consultations", "users", column: "owner_id"
  add_foreign_key "consultations", "users", column: "users_id"
  add_foreign_key "medications", "maladies"
end
