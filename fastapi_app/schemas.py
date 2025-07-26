from pydantic import BaseModel
from typing import Optional, List, Any
from datetime import date, datetime

class UserBase(BaseModel):
    firstName: Optional[str]
    lastName: Optional[str]
    birthDate: Optional[date]
    idNumber: Optional[str]
    occupation: Optional[str]
    personalPhone: Optional[str]
    address: Optional[str]
    gender: Optional[str]
    maritalStatus: Optional[str]
    insurance: Optional[str]
    email: Optional[str]
    homePhone: Optional[str]
    notes: Optional[str]

class UserCreate(UserBase):
    pass

class User(UserBase):
    id: int
    class Config:
        orm_mode = True

class ConsultationBase(BaseModel):
    prescription: Optional[str]
    antecedents: Optional[str]
    allergies: Optional[str]
    name: Optional[str]
    status: Optional[str]
    diagnosis: Optional[str]
    measurements: Optional[Any]
    description: Optional[Any]
    rating: Optional[str]
    date: Optional[datetime]
    end_date: Optional[datetime]
    exams: Optional[Any]
    user_id: Optional[int]
    owner_id: Optional[int]

class ConsultationCreate(ConsultationBase):
    pass

class Consultation(ConsultationBase):
    id: int
    class Config:
        orm_mode = True

class MedicationBase(BaseModel):
    name: str
    posology: Optional[str]

class MedicationCreate(MedicationBase):
    pass

class Medication(MedicationBase):
    id: int
    class Config:
        orm_mode = True

class MaladyBase(BaseModel):
    name: str
    treatments: Optional[Any]

class MaladyCreate(MaladyBase):
    pass

class Malady(MaladyBase):
    id: int
    class Config:
        orm_mode = True 

class InvoiceBase(BaseModel):
    patient_id: int
    date: date
    amount: int  # en centimes d'euro
    description: Optional[str] = None
    status: Optional[str] = "unpaid"
    type: Optional[str] = None

class InvoiceCreate(InvoiceBase):
    pass

class InvoiceUpdate(BaseModel):
    date: Optional[date]
    amount: Optional[int]
    description: Optional[str]
    status: Optional[str]
    type: Optional[str]

class Invoice(InvoiceBase):
    id: int
    class Config:
        from_attributes = True

class PaymentBase(BaseModel):
    invoice_id: int
    date: date
    amount: int  # en centimes d'euro
    method: Optional[str] = None

class PaymentCreate(PaymentBase):
    pass

class PaymentUpdate(BaseModel):
    date: Optional[date]
    amount: Optional[int]
    method: Optional[str]

class Payment(PaymentBase):
    id: int
    class Config:
        from_attributes = True

class ExpenseBase(BaseModel):
    date: date
    amount: int  # en centimes d'euro
    category: Optional[str] = None
    description: Optional[str] = None

class ExpenseCreate(ExpenseBase):
    pass

class ExpenseUpdate(BaseModel):
    date: Optional[date]
    amount: Optional[int]
    category: Optional[str]
    description: Optional[str]

class Expense(ExpenseBase):
    id: int
    class Config:
        from_attributes = True 