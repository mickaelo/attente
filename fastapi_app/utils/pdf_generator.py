from fpdf import FPDF
from datetime import datetime
import json

class CourrierPDF(FPDF):
    def __init__(self):
        super().__init__()
        self.set_auto_page_break(auto=True, margin=15)
        self.add_page()
        
    def header(self):
        # En-tête du document
        self.set_font('Arial', 'B', 16)
        self.cell(0, 10, 'COURRIER MEDICAL', 0, 1, 'C')
        self.ln(10)
        
    def footer(self):
        # Pied de page
        self.set_y(-15)
        self.set_font('Arial', 'I', 8)
        self.cell(0, 10, f'Page {self.page_no()}/{{nb}}', 0, 0, 'C')
        
    def add_patient_info(self, user_data):
        """Ajoute les informations du patient"""
        self.set_font('Arial', 'B', 12)
        self.cell(0, 10, 'INFORMATIONS PATIENT:', 0, 1)
        self.set_font('Arial', '', 10)
        
        if user_data.get('firstName') and user_data.get('lastName'):
            self.cell(0, 8, f"Nom: {user_data['firstName']} {user_data['lastName']}", 0, 1)
        
        if user_data.get('birthDate'):
            self.cell(0, 8, f"Date de naissance: {user_data['birthDate']}", 0, 1)
            
        if user_data.get('address'):
            self.cell(0, 8, f"Adresse: {user_data['address']}", 0, 1)
            
        if user_data.get('personalPhone'):
            self.cell(0, 8, f"Téléphone: {user_data['personalPhone']}", 0, 1)
            
        self.ln(5)
        
    def add_consultation_info(self, consultation_data):
        """Ajoute les informations de consultation"""
        self.set_font('Arial', 'B', 12)
        self.cell(0, 10, 'DETAILS DE LA CONSULTATION:', 0, 1)
        self.set_font('Arial', '', 10)
        
        if consultation_data.get('date'):
            self.cell(0, 8, f"Date: {consultation_data['date']}", 0, 1)
            
        if consultation_data.get('diagnosis'):
            self.cell(0, 8, f"Diagnostic: {consultation_data['diagnosis']}", 0, 1)
            
        if consultation_data.get('prescription'):
            self.cell(0, 8, f"Prescription: {consultation_data['prescription']}", 0, 1)
            
        if consultation_data.get('allergies'):
            self.cell(0, 8, f"Allergies: {consultation_data['allergies']}", 0, 1)
            
        self.ln(5)
        
    def add_measurements(self, measurements):
        """Ajoute les mesures si disponibles"""
        if measurements:
            self.set_font('Arial', 'B', 12)
            self.cell(0, 10, 'MESURES:', 0, 1)
            self.set_font('Arial', '', 10)
            
            if isinstance(measurements, dict):
                for key, value in measurements.items():
                    self.cell(0, 8, f"{key}: {value}", 0, 1)
            elif isinstance(measurements, str):
                try:
                    data = json.loads(measurements)
                    for key, value in data.items():
                        self.cell(0, 8, f"{key}: {value}", 0, 1)
                except:
                    self.cell(0, 8, f"Mesures: {measurements}", 0, 1)
                    
            self.ln(5)

def generate_courrier_pdf(user_data, consultation_data=None):
    """
    Génère un PDF de courrier médical
    
    Args:
        user_data (dict): Données du patient
        consultation_data (dict, optional): Données de consultation
        
    Returns:
        bytes: Contenu du PDF
    """
    pdf = CourrierPDF()
    
    # Ajouter les informations du patient
    pdf.add_patient_info(user_data)
    
    # Ajouter les informations de consultation si disponibles
    if consultation_data:
        pdf.add_consultation_info(consultation_data)
        
        # Ajouter les mesures si disponibles
        if consultation_data.get('measurements'):
            pdf.add_measurements(consultation_data['measurements'])
    
    # Ajouter la date de génération
    pdf.set_font('Arial', 'I', 10)
    pdf.cell(0, 10, f"Document généré le: {datetime.now().strftime('%d/%m/%Y à %H:%M')}", 0, 1)
    
    return pdf.output(dest='S').encode('latin-1') 