from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import Response
from sqlalchemy.orm import Session
from typing import Optional
from pydantic import BaseModel
import models, database
from utils.pdf_generator import generate_courrier_pdf

router = APIRouter(
    prefix="/pdf_generator",
    tags=["pdf"]
)

def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

class PDFRequest(BaseModel):
    user_id: int
    consultation_id: Optional[int] = None

@router.post("/generate_courrier_pdf")
def generate_courrier_pdf_endpoint(request: PDFRequest, db: Session = Depends(get_db)):
    """
    Génère un PDF de courrier médical pour un patient
    """
    # Récupérer les données du patient
    user = db.query(models.User).filter(models.User.id == request.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Patient not found")
    
    # Convertir les données du patient en dict
    user_data = {
        'firstName': user.firstName,
        'lastName': user.lastName,
        'birthDate': user.birthDate.isoformat() if user.birthDate else None,
        'address': user.address,
        'personalPhone': user.personalPhone,
        'email': user.email,
        'insurance': user.insurance
    }
    
    consultation_data = None
    if request.consultation_id:
        # Récupérer les données de consultation si spécifiées
        consultation = db.query(models.Consultation).filter(
            models.Consultation.id == request.consultation_id
        ).first()
        
        if consultation:
            consultation_data = {
                'date': consultation.date.isoformat() if consultation.date else None,
                'diagnosis': consultation.diagnosis,
                'prescription': consultation.prescription,
                'allergies': consultation.allergies,
                'measurements': consultation.measurements,
                'exams': consultation.exams
            }
    
    # Générer le PDF
    try:
        pdf_content = generate_courrier_pdf(user_data, consultation_data)
        
        # Retourner le PDF comme réponse
        return Response(
            content=pdf_content,
            media_type="application/pdf",
            headers={
                "Content-Disposition": f"attachment; filename=courrier_{user.firstName}_{user.lastName}.pdf"
            }
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur lors de la génération du PDF: {str(e)}") 