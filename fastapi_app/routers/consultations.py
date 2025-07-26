from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import models, schemas, database

router = APIRouter(
    prefix="/consultations",
    tags=["consultations"]
)

def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/", response_model=List[schemas.Consultation])
def read_consultations(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return db.query(models.Consultation).offset(skip).limit(limit).all()

@router.get("/{consultation_id}", response_model=schemas.Consultation)
def read_consultation(consultation_id: int, db: Session = Depends(get_db)):
    consultation = db.query(models.Consultation).filter(models.Consultation.user_id == consultation_id).first()
    if consultation is None:
        raise HTTPException(status_code=404, detail="Consultation not found")
    return consultation

@router.post("/", response_model=schemas.Consultation)
def create_consultation(consultation: schemas.ConsultationCreate, db: Session = Depends(get_db)):
    db_consultation = models.Consultation(**consultation.dict())
    db.add(db_consultation)
    db.commit()
    db.refresh(db_consultation)
    return db_consultation

@router.put("/{consultation_id}", response_model=schemas.Consultation)
def update_consultation(consultation_id: int, consultation: schemas.ConsultationCreate, db: Session = Depends(get_db)):
    db_consultation = db.query(models.Consultation).filter(models.Consultation.id == consultation_id).first()
    if db_consultation is None:
        raise HTTPException(status_code=404, detail="Consultation not found")
    for key, value in consultation.dict(exclude_unset=True).items():
        setattr(db_consultation, key, value)
    db.commit()
    db.refresh(db_consultation)
    return db_consultation

@router.delete("/{consultation_id}", status_code=204)
def delete_consultation(consultation_id: int, db: Session = Depends(get_db)):
    db_consultation = db.query(models.Consultation).filter(models.Consultation.id == consultation_id).first()
    if db_consultation is None:
        raise HTTPException(status_code=404, detail="Consultation not found")
    db.delete(db_consultation)
    db.commit()
    return None 