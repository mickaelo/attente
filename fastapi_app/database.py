from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os

# Configuration de base de données identique à Rails
# Utilise les mêmes paramètres que dans config/database.yml
SQLALCHEMY_DATABASE_URL = os.getenv('DATABASE_URL', 'postgresql://postgres:mickottmann@localhost:5432/myapp_development')

engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base() 