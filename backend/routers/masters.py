from fastapi import APIRouter, HTTPException, Depends
from sqlmodel import Session, select
from ..models import Master
from ..schemas import MasterCreate, MasterRead, MasterUpdate
from ..database import get_session
import logging

router = APIRouter()
logger = logging.getLogger(__name__)


@router.post("/", response_model=MasterRead, status_code=201)
def create_master(master: MasterCreate, session: Session = Depends(get_session)):
    statement = select(Master).where(Master.phone == master.phone)
    existing_master = session.exec(statement).first()

    if existing_master:
        raise HTTPException(status_code=400, detail="Phone already registered")

    new_master = Master(
        name=master.name,
        sex=master.sex,
        phone=master.phone,
        experience=master.experience,
        specialty=master.specialty
    )

    session.add(new_master)
    session.commit()
    session.refresh(new_master)

    logger.info(f"Master created: {new_master.name}")
    return new_master


@router.get("/", response_model=list[MasterRead])
def get_masters(session: Session = Depends(get_session)):
    statement = select(Master)
    masters = session.exec(statement).all()
    return masters


@router.get("/{master_id}", response_model=MasterRead)
def get_master(master_id: str, session: Session = Depends(get_session)):
    statement = select(Master).where(Master.id == master_id)
    master = session.exec(statement).first()

    if not master:
        raise HTTPException(status_code=404, detail="Master not found")

    return master


@router.put("/{master_id}", response_model=MasterRead)
def update_master(
    master_id: str,
    master_update: MasterUpdate,
    session: Session = Depends(get_session)
):
    statement = select(Master).where(Master.id == master_id)
    master = session.exec(statement).first()

    if not master:
        raise HTTPException(status_code=404, detail="Master not found")

    update_data = master_update.model_dump(exclude_unset=True)

    for key, value in update_data.items():
        setattr(master, key, value)

    session.add(master)
    session.commit()
    session.refresh(master)

    logger.info(f"Master updated: {master.name}")
    return master


@router.delete("/{master_id}")
def delete_master(master_id: str, session: Session = Depends(get_session)):
    statement = select(Master).where(Master.id == master_id)
    master = session.exec(statement).first()

    if not master:
        raise HTTPException(status_code=404, detail="Master not found")

    session.delete(master)
    session.commit()

    logger.info(f"Master deleted: {master.name}")
    return {"message": "Master deleted successfully"}
