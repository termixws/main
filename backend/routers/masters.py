from fastapi import APIRouter, HTTPException
from schemas import MasterCreate, MasterRead, MasterUpdate
from database import masters_collection
import uuid

router = APIRouter(prefix="/master", tags=["Masters"])

@router.post("/", response_model=MasterRead)
async def create_master(master: MasterCreate):
    # Check if master with phone exists
    existing_master = await masters_collection.find_one({"phone": master.phone})
    if existing_master:
        raise HTTPException(status_code=400, detail="Master with this phone already exists")
    
    new_master = {
        "id": str(uuid.uuid4()),
        **master.model_dump()
    }
    
    await masters_collection.insert_one(new_master)
    return MasterRead(**new_master)

@router.get("/", response_model=list[MasterRead])
async def read_masters():
    masters = await masters_collection.find({}, {"_id": 0}).to_list(1000)
    return [MasterRead(**master) for master in masters]

@router.get("/{master_id}", response_model=MasterRead)
async def read_master(master_id: str):
    master = await masters_collection.find_one({"id": master_id}, {"_id": 0})
    if not master:
        raise HTTPException(status_code=404, detail="Master not found")
    return MasterRead(**master)

@router.put("/{master_id}", response_model=MasterRead)
async def update_master(master_id: str, update_data: MasterUpdate):
    master = await masters_collection.find_one({"id": master_id})
    if not master:
        raise HTTPException(status_code=404, detail="Master not found")
    
    update_dict = update_data.model_dump(exclude_unset=True)
    if update_dict:
        await masters_collection.update_one({"id": master_id}, {"$set": update_dict})
    
    updated_master = await masters_collection.find_one({"id": master_id}, {"_id": 0})
    return MasterRead(**updated_master)

@router.delete("/{master_id}")
async def delete_master(master_id: str):
    result = await masters_collection.delete_one({"id": master_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Master not found")
    return {"message": "Master deleted"}
