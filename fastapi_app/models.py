from sqlalchemy import Column, Integer, String, Date, Text, ForeignKey, DateTime, Table
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    firstName = Column(String)
    lastName = Column(String)
    birthDate = Column(Date)
    idNumber = Column(String)
    occupation = Column(String)
    personalPhone = Column(String)
    address = Column(String)
    gender = Column(String)
    maritalStatus = Column(String)
    insurance = Column(String)
    email = Column(String)
    homePhone = Column(String)
    notes = Column(Text)
    consultations = relationship("Consultation", back_populates="user", foreign_keys="Consultation.user_id")
    invoices = relationship("Invoice", back_populates="patient")

class Consultation(Base):
    __tablename__ = "consultations"
    id = Column(Integer, primary_key=True, index=True)
    prescription = Column(Text, nullable=True)
    antecedents = Column(Text, nullable=True)
    allergies = Column(Text, nullable=True)
    name = Column(String, nullable=True)
    status = Column(String, nullable=True)
    diagnosis = Column(Text, nullable=True)
    measurements = Column(Text, nullable=True)  # Changed from JSON to Text for SQLite
    description = Column(Text, nullable=True)   # Changed from JSON to Text for SQLite
    rating = Column(String, nullable=True)
    date = Column(DateTime, nullable=True)
    end_date = Column(DateTime, nullable=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    exams = Column(Text, nullable=True)         # Changed from JSON to Text for SQLite
    user = relationship("User", back_populates="consultations", foreign_keys=[user_id])

class Medication(Base):
    __tablename__ = "medications"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    posology = Column(String)

class Malady(Base):
    __tablename__ = "maladies"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    treatments = Column(Text)    # Changed from JSON to Text for SQLite 

class Invoice(Base):
    __tablename__ = "invoices"
    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    date = Column(Date, nullable=False)
    amount = Column(Integer, nullable=False)  # Amount in cents (EUR)
    description = Column(String)
    status = Column(String, default="unpaid")  # unpaid, paid, partial
    type = Column(String)  # consultation, acte, etc.
    payments = relationship("Payment", back_populates="invoice")
    patient = relationship("User", back_populates="invoices")

class Payment(Base):
    __tablename__ = "payments"
    id = Column(Integer, primary_key=True, index=True)
    invoice_id = Column(Integer, ForeignKey("invoices.id"), nullable=False)
    date = Column(Date, nullable=False)
    amount = Column(Integer, nullable=False)  # Amount in cents (EUR)
    method = Column(String)  # cash, card, cheque, virement
    invoice = relationship("Invoice", back_populates="payments")

class Expense(Base):
    __tablename__ = "expenses"
    id = Column(Integer, primary_key=True, index=True)
    date = Column(Date, nullable=False)
    amount = Column(Integer, nullable=False)  # Amount in cents (EUR)
    category = Column(String)  # loyer, matériel, salaires, etc.
    description = Column(String) 