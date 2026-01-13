from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from datetime import date

import models, schemas, database

router = APIRouter(prefix="/accounting", tags=["accounting"])
def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()
# ===== INVOICES =====
@router.get("/invoices/", response_model=List[schemas.Invoice])
def read_invoices(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    invoices = db.query(models.Invoice).offset(skip).limit(limit).all()
    return invoices

@router.get("/invoices/{invoice_id}", response_model=schemas.Invoice)
def read_invoice(invoice_id: int, db: Session = Depends(get_db)):
    invoice = db.query(models.Invoice).filter(models.Invoice.id == invoice_id).first()
    if invoice is None:
        raise HTTPException(status_code=404, detail="Facture non trouvée")
    return invoice

@router.post("/invoices/", response_model=schemas.Invoice)
def create_invoice(invoice: schemas.InvoiceCreate, db: Session = Depends(get_db)):
    db_invoice = models.Invoice(**invoice.dict())
    db.add(db_invoice)
    db.commit()
    db.refresh(db_invoice)
    return db_invoice

@router.put("/invoices/{invoice_id}", response_model=schemas.Invoice)
def update_invoice(invoice_id: int, invoice: schemas.InvoiceUpdate, db: Session = Depends(get_db)):
    db_invoice = db.query(models.Invoice).filter(models.Invoice.id == invoice_id).first()
    if db_invoice is None:
        raise HTTPException(status_code=404, detail="Facture non trouvée")
    
    update_data = invoice.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_invoice, field, value)
    
    db.commit()
    db.refresh(db_invoice)
    return db_invoice

@router.delete("/invoices/{invoice_id}")
def delete_invoice(invoice_id: int, db: Session = Depends(get_db)):
    db_invoice = db.query(models.Invoice).filter(models.Invoice.id == invoice_id).first()
    if db_invoice is None:
        raise HTTPException(status_code=404, detail="Facture non trouvée")
    
    db.delete(db_invoice)
    db.commit()
    return {"message": "Facture supprimée"}

# ===== PAYMENTS =====
@router.get("/payments/", response_model=List[schemas.Payment])
def read_payments(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    payments = db.query(models.Payment).offset(skip).limit(limit).all()
    return payments

@router.get("/payments/{payment_id}", response_model=schemas.Payment)
def read_payment(payment_id: int, db: Session = Depends(get_db)):
    payment = db.query(models.Payment).filter(models.Payment.id == payment_id).first()
    if payment is None:
        raise HTTPException(status_code=404, detail="Paiement non trouvé")
    return payment

@router.post("/payments/", response_model=schemas.Payment)
def create_payment(payment: schemas.PaymentCreate, db: Session = Depends(get_db)):
    db_payment = models.Payment(**payment.dict())
    db.add(db_payment)
    db.commit()
    db.refresh(db_payment)
    return db_payment

@router.put("/payments/{payment_id}", response_model=schemas.Payment)
def update_payment(payment_id: int, payment: schemas.PaymentUpdate, db: Session = Depends(get_db)):
    db_payment = db.query(models.Payment).filter(models.Payment.id == payment_id).first()
    if db_payment is None:
        raise HTTPException(status_code=404, detail="Paiement non trouvé")
    
    update_data = payment.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_payment, field, value)
    
    db.commit()
    db.refresh(db_payment)
    return db_payment

@router.delete("/payments/{payment_id}")
def delete_payment(payment_id: int, db: Session = Depends(get_db)):
    db_payment = db.query(models.Payment).filter(models.Payment.id == payment_id).first()
    if db_payment is None:
        raise HTTPException(status_code=404, detail="Paiement non trouvé")
    
    db.delete(db_payment)
    db.commit()
    return {"message": "Paiement supprimé"}

# ===== EXPENSES =====
@router.get("/expenses/", response_model=List[schemas.Expense])
def read_expenses(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    expenses = db.query(models.Expense).offset(skip).limit(limit).all()
    return expenses

@router.get("/expenses/{expense_id}", response_model=schemas.Expense)
def read_expense(expense_id: int, db: Session = Depends(get_db)):
    expense = db.query(models.Expense).filter(models.Expense.id == expense_id).first()
    if expense is None:
        raise HTTPException(status_code=404, detail="Dépense non trouvée")
    return expense

@router.post("/expenses/", response_model=schemas.Expense)
def create_expense(expense: schemas.ExpenseCreate, db: Session = Depends(get_db)):
    db_expense = models.Expense(**expense.dict())
    db.add(db_expense)
    db.commit()
    db.refresh(db_expense)
    return db_expense

@router.put("/expenses/{expense_id}", response_model=schemas.Expense)
def update_expense(expense_id: int, expense: schemas.ExpenseUpdate, db: Session = Depends(get_db)):
    db_expense = db.query(models.Expense).filter(models.Expense.id == expense_id).first()
    if db_expense is None:
        raise HTTPException(status_code=404, detail="Dépense non trouvée")
    
    update_data = expense.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_expense, field, value)
    
    db.commit()
    db.refresh(db_expense)
    return db_expense

@router.delete("/expenses/{expense_id}")
def delete_expense(expense_id: int, db: Session = Depends(get_db)):
    db_expense = db.query(models.Expense).filter(models.Expense.id == expense_id).first()
    if db_expense is None:
        raise HTTPException(status_code=404, detail="Dépense non trouvée")
    
    db.delete(db_expense)
    db.commit()
    return {"message": "Dépense supprimée"}

# ===== DASHBOARD STATISTICS =====
@router.get("/dashboard/")
def get_dashboard_stats(db: Session = Depends(get_db)):
    # Total des factures
    total_invoices = db.query(models.Invoice).count()
    total_invoices_amount = db.query(models.Invoice.amount).all()
    total_invoices_amount = sum([inv[0] for inv in total_invoices_amount]) if total_invoices_amount else 0
    
    # Factures payées
    paid_invoices = db.query(models.Invoice).filter(models.Invoice.status == "paid").count()
    paid_invoices_amount = db.query(models.Invoice.amount).filter(models.Invoice.status == "paid").all()
    paid_invoices_amount = sum([inv[0] for inv in paid_invoices_amount]) if paid_invoices_amount else 0
    
    # Factures impayées
    unpaid_invoices = db.query(models.Invoice).filter(models.Invoice.status == "unpaid").count()
    unpaid_invoices_amount = db.query(models.Invoice.amount).filter(models.Invoice.status == "unpaid").all()
    unpaid_invoices_amount = sum([inv[0] for inv in unpaid_invoices_amount]) if unpaid_invoices_amount else 0
    
    # Total des dépenses
    total_expenses = db.query(models.Expense).count()
    total_expenses_amount = db.query(models.Expense.amount).all()
    total_expenses_amount = sum([exp[0] for exp in total_expenses_amount]) if total_expenses_amount else 0
    
    # Bénéfice (factures payées - dépenses)
    profit = paid_invoices_amount - total_expenses_amount
    
    return {
        "total_invoices": total_invoices,
        "total_invoices_amount": total_invoices_amount,
        "paid_invoices": paid_invoices,
        "paid_invoices_amount": paid_invoices_amount,
        "unpaid_invoices": unpaid_invoices,
        "unpaid_invoices_amount": unpaid_invoices_amount,
        "total_expenses": total_expenses,
        "total_expenses_amount": total_expenses_amount,
        "profit": profit
    } 