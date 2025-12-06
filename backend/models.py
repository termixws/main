from sqlmodel import SQLModel, Field, Relationship
from typing import Optional
from datetime import datetime
import uuid

class User(SQLModel, table=True):
    __tablename__ = "users"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    email: str = Field(unique=True, index=True)
    hashed_password: str
    name: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

    appointments: list["Appointment"] = Relationship(back_populates="user")

class Master(SQLModel, table=True):
    __tablename__ = "masters"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    name: str
    sex: str
    phone: str = Field(unique=True, index=True)
    experience: int = Field(default=0)
    specialty: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

    appointments: list["Appointment"] = Relationship(back_populates="master")

class Service(SQLModel, table=True):
    __tablename__ = "services"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    name: str = Field(unique=True)
    description: str
    price: float
    duration: int
    created_at: datetime = Field(default_factory=datetime.utcnow)

    appointments: list["Appointment"] = Relationship(back_populates="service")

class Appointment(SQLModel, table=True):
    __tablename__ = "appointments"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    date_time: datetime
    status: str = Field(default="pending")
    user_id: uuid.UUID = Field(foreign_key="users.id", index=True)
    master_id: uuid.UUID = Field(foreign_key="masters.id", index=True)
    service_id: uuid.UUID = Field(foreign_key="services.id", index=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)

    user: User = Relationship(back_populates="appointments")
    master: Master = Relationship(back_populates="appointments")
    service: Service = Relationship(back_populates="appointments")
