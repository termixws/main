from fastapi import APIRouter, HTTPException, Depends
from sqlmodel import Session, select
from ..models import Appointment
from ..schemas import AppointmentCreate, AppointmentRead, AppointmentUpdate
from ..database import get_session
from datetime import datetime
import logging

router = APIRouter()
logger = logging.getLogger(__name__)


@router.post("/", response_model=AppointmentRead, status_code=201)
def create_appointment(
    appointment: AppointmentCreate,
    session: Session = Depends(get_session)
):
    statement = select(Appointment).where(
        Appointment.master_id == appointment.master_id,
        Appointment.date_time == appointment.date_time
    )
    existing_appointment = session.exec(statement).first()

    if existing_appointment:
        raise HTTPException(
            status_code=400,
            detail="Master already has an appointment at this time"
        )

    new_appointment = Appointment(
        date_time=appointment.date_time,
        user_id=appointment.user_id,
        master_id=appointment.master_id,
        service_id=appointment.service_id,
        status="pending"
    )

    session.add(new_appointment)
    session.commit()
    session.refresh(new_appointment)

    logger.info(f"Appointment created: {new_appointment.id}")
    return new_appointment


@router.get("/", response_model=list[AppointmentRead])
def get_appointments(session: Session = Depends(get_session)):
    statement = select(Appointment)
    appointments = session.exec(statement).all()
    return appointments


@router.get("/{appointment_id}", response_model=AppointmentRead)
def get_appointment(appointment_id: str, session: Session = Depends(get_session)):
    statement = select(Appointment).where(Appointment.id == appointment_id)
    appointment = session.exec(statement).first()

    if not appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")

    return appointment


@router.put("/{appointment_id}", response_model=AppointmentRead)
def update_appointment(
    appointment_id: str,
    appointment_update: AppointmentUpdate,
    session: Session = Depends(get_session)
):
    statement = select(Appointment).where(Appointment.id == appointment_id)
    appointment = session.exec(statement).first()

    if not appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")

    update_data = appointment_update.model_dump(exclude_unset=True)

    for key, value in update_data.items():
        setattr(appointment, key, value)

    session.add(appointment)
    session.commit()
    session.refresh(appointment)

    logger.info(f"Appointment updated: {appointment.id}")
    return appointment


@router.delete("/{appointment_id}")
def delete_appointment(appointment_id: str, session: Session = Depends(get_session)):
    statement = select(Appointment).where(Appointment.id == appointment_id)
    appointment = session.exec(statement).first()

    if not appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")

    session.delete(appointment)
    session.commit()

    logger.info(f"Appointment deleted: {appointment.id}")
    return {"message": "Appointment deleted successfully"}
