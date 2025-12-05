from fastapi import APIRouter, HTTPException, Depends
from sqlmodel import Session, select
from ..models import Service
from ..schemas import ServiceCreate, ServiceRead, ServiceUpdate
from ..database import get_session
import logging

router = APIRouter()
logger = logging.getLogger(__name__)


@router.post("/", response_model=ServiceRead, status_code=201)
def create_service(service: ServiceCreate, session: Session = Depends(get_session)):
    statement = select(Service).where(Service.name == service.name)
    existing_service = session.exec(statement).first()

    if existing_service:
        raise HTTPException(status_code=400, detail="Service already exists")

    new_service = Service(
        name=service.name,
        description=service.description,
        price=service.price,
        duration=service.duration
    )

    session.add(new_service)
    session.commit()
    session.refresh(new_service)

    logger.info(f"Service created: {new_service.name}")
    return new_service


@router.get("/", response_model=list[ServiceRead])
def get_services(session: Session = Depends(get_session)):
    statement = select(Service)
    services = session.exec(statement).all()
    return services


@router.get("/{service_id}", response_model=ServiceRead)
def get_service(service_id: str, session: Session = Depends(get_session)):
    statement = select(Service).where(Service.id == service_id)
    service = session.exec(statement).first()

    if not service:
        raise HTTPException(status_code=404, detail="Service not found")

    return service


@router.put("/{service_id}", response_model=ServiceRead)
def update_service(
    service_id: str,
    service_update: ServiceUpdate,
    session: Session = Depends(get_session)
):
    statement = select(Service).where(Service.id == service_id)
    service = session.exec(statement).first()

    if not service:
        raise HTTPException(status_code=404, detail="Service not found")

    update_data = service_update.model_dump(exclude_unset=True)

    for key, value in update_data.items():
        setattr(service, key, value)

    session.add(service)
    session.commit()
    session.refresh(service)

    logger.info(f"Service updated: {service.name}")
    return service


@router.delete("/{service_id}")
def delete_service(service_id: str, session: Session = Depends(get_session)):
    statement = select(Service).where(Service.id == service_id)
    service = session.exec(statement).first()

    if not service:
        raise HTTPException(status_code=404, detail="Service not found")

    session.delete(service)
    session.commit()

    logger.info(f"Service deleted: {service.name}")
    return {"message": "Service deleted successfully"}
