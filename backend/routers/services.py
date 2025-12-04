from fastapi import APIRouter, HTTPException
from schemas import ServiceCreate, ServiceRead, ServiceUpdate
from database import services_collection
import uuid

router = APIRouter(prefix="/service", tags=["Services"])

@router.post("/", response_model=ServiceRead)
async def create_service(service: ServiceCreate):
    # Check if service with name exists
    existing_service = await services_collection.find_one({"name": service.name})
    if existing_service:
        raise HTTPException(status_code=400, detail="Service with this name already exists")
    
    new_service = {
        "id": str(uuid.uuid4()),
        **service.model_dump()
    }
    
    await services_collection.insert_one(new_service)
    return ServiceRead(**new_service)

@router.get("/", response_model=list[ServiceRead])
async def read_services():
    services = await services_collection.find({}, {"_id": 0}).to_list(1000)
    return [ServiceRead(**service) for service in services]

@router.get("/{service_id}", response_model=ServiceRead)
async def read_service(service_id: str):
    service = await services_collection.find_one({"id": service_id}, {"_id": 0})
    if not service:
        raise HTTPException(status_code=404, detail="Service not found")
    return ServiceRead(**service)

@router.put("/{service_id}", response_model=ServiceRead)
async def update_service(service_id: str, update_data: ServiceUpdate):
    service = await services_collection.find_one({"id": service_id})
    if not service:
        raise HTTPException(status_code=404, detail="Service not found")
    
    update_dict = update_data.model_dump(exclude_unset=True)
    if update_dict:
        await services_collection.update_one({"id": service_id}, {"$set": update_dict})
    
    updated_service = await services_collection.find_one({"id": service_id}, {"_id": 0})
    return ServiceRead(**updated_service)

@router.delete("/{service_id}")
async def delete_service(service_id: str):
    result = await services_collection.delete_one({"id": service_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Service not found")
    return {"message": "Service deleted"}
