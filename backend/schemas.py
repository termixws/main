from pydantic import BaseModel, EmailStr, ConfigDict, Field
from typing import Optional, List
from datetime import datetime
import uuid

# User schemas
class UserCreate(BaseModel):
    email: EmailStr
    password: str
    name: str

class UserRead(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    email: EmailStr
    name: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

# Master schemas
class MasterCreate(BaseModel):
    name: str
    sex: str
    phone: str
    experience: int
    specialty: str

class MasterRead(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    name: str
    sex: str
    phone: str
    experience: int
    specialty: str

class MasterUpdate(BaseModel):
    name: Optional[str] = None
    sex: Optional[str] = None
    phone: Optional[str] = None
    experience: Optional[int] = None
    specialty: Optional[str] = None

# Service schemas
class ServiceCreate(BaseModel):
    name: str
    description: str
    price: float
    duration: int

class ServiceRead(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    name: str
    description: str
    price: float
    duration: int

class ServiceUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    duration: Optional[int] = None

# Appointment schemas
class AppointmentCreate(BaseModel):
    date_time: datetime
    user_id: int
    master_id: int
    service_id: int

class AppointmentRead(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    date_time: datetime
    status: str
    user_id: int
    master_id: int
    service_id: int

class AppointmentUpdate(BaseModel):
    date_time: Optional[datetime] = None
    status: Optional[str] = None
    user_id: Optional[int] = None
    master_id: Optional[int] = None
    service_id: Optional[int] = None
