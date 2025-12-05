from pydantic import BaseModel, EmailStr, ConfigDict
from typing import Optional
from datetime import datetime
import uuid


class UserCreate(BaseModel):
    email: EmailStr
    password: str
    name: Optional[str] = None


class UserRead(BaseModel):
    id: uuid.UUID
    email: str
    name: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str


class MasterCreate(BaseModel):
    name: str
    sex: str
    phone: str
    experience: int
    specialty: str


class MasterRead(BaseModel):
    id: uuid.UUID
    name: str
    sex: str
    phone: str
    experience: int
    specialty: str

    model_config = ConfigDict(from_attributes=True)


class MasterUpdate(BaseModel):
    name: Optional[str] = None
    sex: Optional[str] = None
    phone: Optional[str] = None
    experience: Optional[int] = None
    specialty: Optional[str] = None


class ServiceCreate(BaseModel):
    name: str
    description: str
    price: float
    duration: int


class ServiceRead(BaseModel):
    id: uuid.UUID
    name: str
    description: str
    price: float
    duration: int

    model_config = ConfigDict(from_attributes=True)


class ServiceUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    duration: Optional[int] = None


class AppointmentCreate(BaseModel):
    date_time: datetime
    user_id: uuid.UUID
    master_id: uuid.UUID
    service_id: uuid.UUID


class AppointmentRead(BaseModel):
    id: uuid.UUID
    date_time: datetime
    status: str
    user_id: uuid.UUID
    master_id: uuid.UUID
    service_id: uuid.UUID

    model_config = ConfigDict(from_attributes=True)


class AppointmentUpdate(BaseModel):
    date_time: Optional[datetime] = None
    status: Optional[str] = None
    user_id: Optional[uuid.UUID] = None
    master_id: Optional[uuid.UUID] = None
    service_id: Optional[uuid.UUID] = None
