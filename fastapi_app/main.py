from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import Base, engine
from routers import users, consultations, medications, pdf, accounting

app = FastAPI()

# Configuration CORS pour permettre les requêtes depuis le frontend React
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3001"
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# Crée les tables si elles n'existent pas
def create_tables():
    Base.metadata.create_all(bind=engine)

create_tables()

app.include_router(users.router)
app.include_router(consultations.router)
app.include_router(medications.router)
app.include_router(pdf.router)
app.include_router(accounting.router) 