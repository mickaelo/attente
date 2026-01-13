# FastAPI Migration de SimpleRailsServer

Ce projet est une migration de l'application Ruby on Rails `SimpleRailsServer` vers FastAPI (Python).

## Installation

1. **Installer les dépendances Python :**
```bash
pip install -r requirements.txt
```

2. **Configuration de la base de données :**
   - **Base de données :** PostgreSQL (même que Rails)
   - **Nom :** `myapp_development`
   - **Utilisateur :** `postgres`
   - **Mot de passe :** `mickottmann`
   - **Hôte :** `localhost`
   - **Port :** `5432`
   
   La configuration est automatiquement chargée depuis `database.py`
   
   **Alternative :** Vous pouvez définir la variable d'environnement `DATABASE_URL` pour surcharger la configuration par défaut.

3. **Lancer l'application :**
```bash
# Depuis le répertoire fastapi_app/
cd fastapi_app
uvicorn main:app --reload
```

## Endpoints disponibles

### Users (Patients)
- `GET /users/` - Liste tous les patients
- `GET /users/{user_id}` - Récupère un patient spécifique
- `POST /users/` - Crée un nouveau patient
- `PUT /users/{user_id}` - Met à jour un patient
- `DELETE /users/{user_id}` - Supprime un patient

### Consultations
- `GET /consultations/` - Liste toutes les consultations
- `GET /consultations/{consultation_id}` - Récupère une consultation spécifique
- `POST /consultations/` - Crée une nouvelle consultation
- `PUT /consultations/{consultation_id}` - Met à jour une consultation
- `DELETE /consultations/{consultation_id}` - Supprime une consultation

### Medications
- `GET /medications/` - Liste tous les médicaments
- `GET /medications/{medication_id}` - Récupère un médicament spécifique
- `POST /medications/` - Crée un nouveau médicament
- `PUT /medications/{medication_id}` - Met à jour un médicament
- `DELETE /medications/{medication_id}` - Supprime un médicament

### PDF Generation
- `POST /pdf_generator/generate_courrier_pdf` - Génère un PDF de courrier médical

## Documentation API

Une fois l'application lancée, accédez à :
- **Swagger UI :** `http://localhost:8000/docs`
- **ReDoc :** `http://localhost:8000/redoc`

## Structure du projet

```
fastapi_app/
├── main.py              # Application principale
├── database.py          # Configuration de la base de données
├── models.py            # Modèles SQLAlchemy
├── schemas.py           # Schémas Pydantic
├── requirements.txt     # Dépendances Python
├── README.md           # Ce fichier
├── routers/            # Routers FastAPI
│   ├── users.py
│   ├── consultations.py
│   ├── medications.py
│   └── pdf.py
└── utils/              # Utilitaires
    └── pdf_generator.py
``` 