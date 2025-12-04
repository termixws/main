from fastapi import APIRouter, HTTPException
from schemas import AppointmentCreate, AppointmentRead, AppointmentUpdate
from database import appointments_collection, masters_collection
from datetime import datetime
import uuid

router = APIRouter(prefix="/appointment", tags=["Appointments"])

@router.post("/", response_model=AppointmentRead)
async def create_appointment(appointment: AppointmentCreate):
    # Check if time slot is available for the master
    existing_appointment = await appointments_collection.find_one({
        "master_id": appointment.master_id,
        "date_time": appointment.date_time.isoformat()
    })
    if existing_appointment:
        raise HTTPException(status_code=400, detail="Time slot is already booked")
    
    new_appointment = {
        "id": str(uuid.uuid4()),
        "date_time": appointment.date_time.isoformat(),
        "status": "scheduled",
        "user_id": appointment.user_id,
        "master_id": appointment.master_id,
        "service_id": appointment.service_id
    }
    
    await appointments_collection.insert_one(new_appointment)
    
    # Convert back for response
    return AppointmentRead(
        id=new_appointment["id"],
        date_time=appointment.date_time,
        status=new_appointment["status"],
        user_id=new_appointment["user_id"],
        master_id=new_appointment["master_id"],
        service_id=new_appointment["service_id"]
    )

@router.get("/", response_model=list[AppointmentRead])
async def read_appointments():
    appointments = await appointments_collection.find({}, {"_id": 0}).to_list(1000)
    result = []
    for appt in appointments:
        result.append(AppointmentRead(
            id=appt["id"],
            date_time=datetime.fromisoformat(appt["date_time"]) if isinstance(appt["date_time"], str) else appt["date_time"],
            status=appt["status"],
            user_id=appt["user_id"],
            master_id=appt["master_id"],
            service_id=appt["service_id"]
        ))
    return result

@router.get("/{appointment_id}", response_model=AppointmentRead)
async def read_appointment(appointment_id: str):
    appointment = await appointments_collection.find_one({"id": appointment_id}, {"_id": 0})
    if not appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")
    return AppointmentRead(
        id=appointment["id"],
        date_time=datetime.fromisoformat(appointment["date_time"]) if isinstance(appointment["date_time"], str) else appointment["date_time"],
        status=appointment["status"],
        user_id=appointment["user_id"],
        master_id=appointment["master_id"],
        service_id=appointment["service_id"]
    )

@router.put("/{appointment_id}", response_model=AppointmentRead)
async def update_appointment(appointment_id: str, update_data: AppointmentUpdate):
    appointment = await appointments_collection.find_one({"id": appointment_id})
    if not appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")
    
    update_dict = update_data.model_dump(exclude_unset=True)
    if "date_time" in update_dict and update_dict["date_time"]:
        update_dict["date_time"] = update_dict["date_time"].isoformat()
    
    if update_dict:
        await appointments_collection.update_one({"id": appointment_id}, {"$set": update_dict})
    
    updated = await appointments_collection.find_one({"id": appointment_id}, {"_id": 0})
    return AppointmentRead(
        id=updated["id"],
        date_time=datetime.fromisoformat(updated["date_time"]) if isinstance(updated["date_time"], str) else updated["date_time"],
        status=updated["status"],
        user_id=updated["user_id"],
        master_id=updated["master_id"],
        service_id=updated["service_id"]
    )

@router.delete("/{appointment_id}")
async def delete_appointment(appointment_id: str):
    result = await appointments_collection.delete_one({"id": appointment_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Appointment not found")
    return {"message": "Appointment deleted"}
