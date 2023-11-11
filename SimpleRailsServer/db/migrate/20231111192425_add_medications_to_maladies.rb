# db/migrate/xxxxxx_add_medications_to_maladies.rb
class AddMedicationsToMaladies < ActiveRecord::Migration[6.1]
  def change
    add_medications_to_maladies('Conjonctivite bactérienne', ['Dacudose', 'Tobrex', 'Lacrifluid'])
    add_medications_to_maladies('Conjonctivite allergique', ['Dacudose', 'Zalerg', 'Lacrifluid'])
    add_medications_to_maladies('Uvéite antérieure', ['Dexafree', 'STERDEX', 'Atropine 1%', 'Lacrifluid'])
    add_medications_to_maladies('Blépharite', ['Compresses stériles non tissées', 'Softacort', 'Lacrifluid', 'Azyter'])
    add_medications_to_maladies('Post-opératoire', ['Dacudose', 'Compresses stériles non tissées', 'Chibrocadron', 'Indocollyre', 'Lacrifluid'])
  end

  private

  def add_medications_to_maladies(maladie_name, medications)
    maladie = Malady.find_by(name: maladie_name)

    medications.each do |medication_name|
      medication = Medication.find_by(name: medication_name)
      maladie.medications << medication if maladie && medication
    end
  end
end
