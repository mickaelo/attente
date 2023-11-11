# db/seeds.rb

# ... Autres seed data

# Liste de médicaments
medications = [
#   { name: 'AZYTER', posology: '1 goutte matin et soir pendant 3 jours' },
#   { name: 'VISMED', posology: '1 goutte 1 à 6 fois par jour selon la gêne, QSP 6 mois' },
#   { name: 'LACRIFLUID', posology: '1 goutte 1 à 6 fois par jour selon la gêne, QSP 6 mois' },
#   { name: 'HYLOVIS LIPO', posology: '1 goutte 1 à 6 fois par jour selon la gêne, QSP 6 mois' },
#   { name: 'HYLOCONFORT', posology: '1 goutte 1 à 6 fois par jour selon la gêne, QSP 6 mois' },
#   { name: 'CATIONORM', posology: '1 goutte 1 à 6 fois par jour selon la gêne, QSP 6 mois' },
#   { name: 'CELLUVISC', posology: '1 goutte 1 à 6 fois par jour selon la gêne, QSP 6 mois' },
#   { name: 'OPTIVE FUSION', posology: '1 goutte 1 à 6 fois par jour selon la gêne, QSP 6 mois' },
#   { name: 'THEALOSE', posology: '15mL 1 goutte 1 à 6 fois par jour selon la gêne, QSP 6 mois' },
#   { name: 'RIFAMYCINE', posology: '1 goutte 4 fois par jour pendant 7 jours' },
#   { name: 'TOBREX', posology: '1 goutte 4 fois par jour pendant 7 jours' },
#   { name: 'VITABACT', posology: '1 goutte 4 fois par jour pendant 7 jours' },
#   { name: 'DEXAFREE', posology: '1 goutte horaire pendant 48h puis 1 goutte 8 fois par jour pendant 3 jours puis 1 goutte 6 fois par jour pendant 3 jours puis 1 goutte 4 fois par jour pendant 3 jours puis 1 goutte 3 fois par jour pendant 5 jours puis 1 goutte 2 fois par jour pendant 5 jours puis 1 goutte 1 fois par jour pendant 7 jours puis arrêt' },
#   { name: 'SOFTACORT', posology: '1 goutte 3 fois par jour pendant 10 jours' },
#   { name: 'FLUCON', posology: '1 goutte 3 fois par jour pendant 10 jours' },
#   { name: 'GANFORT', posology: 'QSP 6 mois' },
#   { name: 'COSOPT', posology: 'QSP 6 mois' },
#   { name: 'MONOPROST', posology: 'QSP 6 mois' },
#   { name: 'CARTEOL', posology: 'QSP 6 mois' },
#   { name: 'IOPIDINE', posology: 'QSP 6 mois' },
#   { name: 'DOLIPRANE', posology: '1000mg 1 cp si besoin, max 4 par jour, 1 boîte' },
#   { name: 'ACUPAN', posology: 'QSP 6 mois' },
#   { name: 'STERDEX', posology: 'pommade 1 application 3 fois par jour dans l’œil et sur la paupière QSP 15 jours' },
#   { name: 'VITAMINE A', posology: 'pommade 1 application 1 à 3 fois par jour QSP 15 jours' },
#   { name: 'DIAMOX', posology: '500mg 1 cp 3 fois par jour pendant 1 mois' },
#   { name: 'DIFFU-K', posology: '600mg gelule 1 matin et soir pendant 1 mois' },
#   { name: 'INDOCOLLYRE', posology: '1 goutte 3 fois par jour pendant 1 mois' },
#   { name: 'OCUFEN', posology: '1 goutte 3 fois par jour pendant 1 mois' },
#   { name: 'NAABAK', posology: '1 goutte 3 fois par jour pendant 1 mois' },
#   { name: 'ZALERG', posology: '1 goutte matin et soir pendant 6 mois' },
#   { name: 'DACUDOSE', posology: 'lavage 4 fois par jour pendant 15 jours' },
#   { name: 'SÉRUM PHYSIOLOGIQUE', posology: 'lavage 4 fois par jour pendant 15 jours' },
#   { name: 'CHIBROCADRON', posology: '1 goutte 4 fois par jour pendant 15 jours' },
#   { name: 'TOBRADEX', posology: '1 goutte 4 fois par jour pendant 15 jours' },
#   { name: 'GELTIM', posology: 'une goutte le matin QSP 12 mois' },
#   { name: 'TIMOLOL', posology: 'une goutte deux fois par jour QSP 12 mois' },
#   { name: 'BIMATOPROST', posology: 'une goutte le soir QSP 12 mois' },
#   { name: 'LATANOPROST', posology: 'une goutte le soir QSP 12 mois' },
#   { name: 'LUMIGAN', posology: 'une goutte le soir QSP 12 mois' },
#   { name: 'MONOPROST', posology: 'une goutte le soir QSP 12 mois' },
#   { name: 'TRAVATAN', posology: 'une goutte le soir QSP 12 mois' },
#   { name: 'XALATAN', posology: 'une goutte le soir QSP 12 mois' },
#   { name: 'XIOP', posology: 'une goutte le soir QSP 12 mois' },
#   { name: 'AZOPT', posology: 'une goutte deux fois par jour QSP 12 mois' },
#   { name: 'TRUSOPT', posology: 'une goutte deux fois par jour QSP 12 mois' },
#   { name: 'DORZOLAMIDE', posology: 'une goutte deux fois par jour QSP 12 mois' },
#   { name: 'BRINZOLAMIDE', posology: 'une goutte deux fois par jour QSP 12 mois' },
#   { name: 'AZARGA', posology: 'une goutte deux fois par jour QSP 12 mois' },
#   { name: 'COMBIGAN', posology: 'une goutte deux fois par jour QSP 12 mois' },
#   { name: 'COSIDIME', posology: 'une goutte deux fois par jour QSP 12 mois' },
#   { name: 'COSOPT', posology: 'une goutte deux fois par jour QSP 12 mois' },
#   { name: 'COSTEC', posology: 'une goutte deux fois par jour QSP 12 mois' },
#   { name: 'GANFORT', posology: 'une goutte par jour QSP 12 mois' },
#   { name: 'DUOTRAV', posology: 'une goutte par jour QSP 12 mois' },
#   { name: 'DUALKOPT', posology: 'une goutte deux fois par jour QSP 12 mois' },
#   { name: 'XALACOM', posology: 'une goutte par jour QSP 12 mois' },
#   { name: 'SIMBRINZA', posology: 'une goutte deux fois par jour QSP 12 mois' },
#   { name: 'ALPHAGAN', posology: 'une goutte deux fois par jour QSP 12 mois' },
#   { name: 'BRIMAZED', posology: 'une goutte deux fois par jour QSP 12 mois' },
#   { name: 'BRIMONIDINE', posology: 'une goutte deux fois par jour QSP 12 mois' },
#   { name: 'PILOCARPINE', posology: 'une goutte deux fois par jour QSP 12 mois' },
#   { name: 'ATROPINE 0.3%', posology: 'matin et soir pendant 5 jours avant la consultation dans les deux yeux' },
#   { name: 'ATROPINE 0.5%', posology: 'matin et soir pendant 5 jours avant la consultation dans les deux yeux' },
#   { name: 'ATROPINE 1%', posology: 'matin et soir pendant 7 jours' },
#   { name: 'IOPIDINE 0.5%', posology: 'une goutte 3 fois par jour pendant 7 jours' }
#   { name: 'Compresses stériles non tissées 1 boîte', posology: '' }
]

# Création des médicaments
# medications.each do |medication|
#   Medication.find_or_create_by(name: medication[:name]) do |med|
#     med.posology = medication[:posology]
#   end
# end
diseases = [
  { name: 'Corps étranger', treatments: ['Vitabact, 1 goutte 4 fois par jour pendant 7 jours', 'Lacrifluid, 1 goutte 1 à 6 fois par jour selon la gêne pendant 7 jours', 'VITAMINE A, pommade 1 application 1 à 3 fois par jour pendant 7 jours'] },
  { name: 'Conjonctivite virale', treatments: ['Dacudose, lavage 4 fois par jour pendant 15 jours', 'Vitabact, 1 goutte 4 fois par jour pendant 15 jours', 'Lacrifluid, 1 goutte 4 fois par jour pendant 15 jours'] },
  { name: 'Conjonctivite bactérienne', treatments: ['Dacudose, lavage 4 fois par jour pendant 15 jours', 'Tobrex, 1 goutte 4 fois par jour pendant 15 jours', 'Lacrifluid, 1 goutte 4 fois par jour pendant 15 jours'] },
  { name: 'Conjonctivite allergique', treatments: ['Dacudose, lavage 4 fois par jour pendant 15 jours', 'Zalerg, 1 goutte 2 fois par jour pendant 15 jours', 'Lacrifluid, 1 goutte 4 fois par jour pendant 15 jours'] },
  { name: 'Uvéite antérieure', treatments: ['Dexafree, 1 goutte horaire pendant 48h puis 1 goutte 8 fois par jour pendant 3 jours puis 1 goutte 6 fois par jour pendant 3 jours puis 1 goutte 4 fois par jour pendant 3 jours puis 1 goutte 3 fois par jour pendant 5 jours puis 1 goutte 2 fois par jour pendant 5 jours puis 1 goutte 1 fois par jour pendant 7 jours puis arrêt', 'STERDEX, pommade 1 application le soir QSP 15 jours', 'Atropine 1% 1 goutte 2 fois par jour pendant 7 jours', 'Lacrifluid, 1 goutte 1 à 6 fois par jour selon la gêne pendant 7 jours'] },
  { name: 'Blépharite', treatments: ['Compresses stériles non tissées 1 boîte, QSP 6 mois', 'Softacort, 1 goutte 3 fois par jour pendant 10 jours à renouveler chaque mois, QSP 6 mois', 'Lacrifluid, 1 goutte 1 à 6 fois par jour selon la gêne, QSP 6 mois', 'Azyter 1 goutte matin et soir pendant trois jours, à renouveler tous les mois, QSP 6 mois'] },
  { name: 'Post-opératoire', treatments: ['Dacudose 1 lavage matin et soir pendant 5 jours', 'Compresses stériles non tissées 1 boîte', 'Chibrocadron 1 goutte 4 fois par jour pendant 15 jours puis relais par Dexafree 1 goutte 4 fois par jour pendant 15 jours', 'Indocollyre 1 goutte 4 fois par jour pendant 1 mois', 'Lacrifluid, 1 goutte 1 à 6 fois par jour selon la gêne pendant 1 mois'] }
]

# Création des maladies
diseases.each do |disease|
  Malady.find_or_create_by(name: disease[:name]) do |malady|
    malady.treatments = disease[:treatments]
  end
end
