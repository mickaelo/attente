import moment from 'moment';

const generateRandomConsultations = (count) => {
  const consultations = [];

  for (let i = 0; i < count; i++) {
    const startTime = moment().add(Math.floor(Math.random() * 24), 'hours').startOf('hour');
    const endTime = startTime.clone().add(Math.floor(Math.random() * 4 + 1) * 15, 'minutes'); // Ajoute une durée aléatoire entre 15 et 60 minutes

    const consultation = {
      id: i + 1,
      date: moment().subtract(Math.floor(Math.random() * 365), 'days'), // Consultation dans les 365 derniers jours
      reason: getRandomReason(),
      symptoms: getRandomSymptoms(),
      diagnosis: getRandomDiagnosis(),
      prescription: getRandomPrescription(),
      recommendations: getRandomRecommendations(),
      startTime: startTime,
      endTime: endTime,
      notes: getRandomNotes(),
    };

    consultations.push(consultation);
  }

  return consultations;
};

const getRandomReason = () => {
  const reasons = ['Examen de routine', 'Douleurs abdominales', 'Problèmes respiratoires', 'Fièvre inexpliquée', 'Autre'];
  return getRandomItemFromArray(reasons);
};

const getRandomSymptoms = () => {
  const symptoms = ['Douleur, gonflement ou rougeur', 'Toux persistante', 'Essoufflement', 'Fatigue excessive'];
  return getRandomItemsFromArray(symptoms);
};

const getRandomDiagnosis = () => {
  const diagnoses = ['Grippe', 'Infection respiratoire', 'Hypertension', 'Diabète', 'Autre'];
  return getRandomItemFromArray(diagnoses);
};

const getRandomPrescription = () => {
  const medications = ['Paracétamol', 'Amoxicilline', 'Ibuprofène', 'Aspirine', 'Autre'];
  return getRandomItemsFromArray(medications);
};

const getRandomRecommendations = () => {
  const recommendations = ['Repos au lit', 'Boire beaucoup de liquides', 'Exercice régulier', 'Alimentation équilibrée'];
  return getRandomItemsFromArray(recommendations);
};

const getRandomNotes = () => {
  const notes = ['Aucune préoccupation particulière', 'Suivi nécessaire', 'Référence à un spécialiste'];
  return getRandomItemFromArray(notes);
};

const getRandomItemFromArray = (array) => {
  return array[Math.floor(Math.random() * array.length)];
};

const getRandomItemsFromArray = (array) => {
  const randomItems = [];
  const itemCount = Math.floor(Math.random() * array.length) + 1; // Au moins un élément
  for (let i = 0; i < itemCount; i++) {
    randomItems.push(getRandomItemFromArray(array));
  }
  return randomItems;
};

export default generateRandomConsultations;
