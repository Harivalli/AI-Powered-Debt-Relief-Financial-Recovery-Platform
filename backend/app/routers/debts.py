from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app import models, schemas
from app.auth import get_current_user

router = APIRouter(prefix="/api/debts", tags=["Debt Management"])


@router.get("", response_model=List[schemas.DebtOut])
def list_debts(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    return db.query(models.Debt).filter(models.Debt.user_id == current_user.id).order_by(models.Debt.created_at.desc()).all()


@router.post("", response_model=schemas.DebtOut, status_code=201)
def create_debt(
    debt_in: schemas.DebtCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    debt = models.Debt(user_id=current_user.id, **debt_in.model_dump())
    db.add(debt)
    db.commit()
    db.refresh(debt)
    return debt


@router.put("/{debt_id}", response_model=schemas.DebtOut)
def update_debt(
    debt_id: int,
    debt_in: schemas.DebtUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    debt = db.query(models.Debt).filter(models.Debt.id == debt_id, models.Debt.user_id == current_user.id).first()
    if not debt:
        raise HTTPException(status_code=404, detail="Debt not found")

    for field, value in debt_in.model_dump(exclude_unset=True).items():
        setattr(debt, field, value)

    db.commit()
    db.refresh(debt)
    return debt


@router.delete("/{debt_id}", status_code=204)
def delete_debt(
    debt_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    debt = db.query(models.Debt).filter(models.Debt.id == debt_id, models.Debt.user_id == current_user.id).first()
    if not debt:
        raise HTTPException(status_code=404, detail="Debt not found")
    db.delete(debt)
    db.commit()
    return None
