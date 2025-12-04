from fastapi import APIRouter, HTTPException
from schemas import UserCreate, UserRead, UserLogin, Token
from database import users_collection
from auth import get_password_hash, verify_password
from jwt_utils import create_access_token
import uuid

router = APIRouter(prefix="/users", tags=["Users"])

@router.post("/", response_model=UserRead)
async def create_user(user: UserCreate):
    # Check if user exists
    existing_user = await users_collection.find_one({"email": user.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create new user
    hashed_password = get_password_hash(user.password)
    new_user = {
        "id": str(uuid.uuid4()),
        "email": user.email,
        "name": user.name,
        "hashed_password": hashed_password
    }
    
    await users_collection.insert_one(new_user)
    return UserRead(id=new_user["id"], email=new_user["email"], name=new_user["name"])

@router.post("/login/", response_model=Token)
async def login(user: UserLogin):
    db_user = await users_collection.find_one({"email": user.email})
    if not db_user or not verify_password(user.password, db_user["hashed_password"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    access_token = create_access_token({"sub": db_user["email"], "user_id": db_user["id"]})
    return Token(access_token=access_token)

@router.get("/", response_model=list[UserRead])
async def read_users():
    users = await users_collection.find({}, {"_id": 0, "hashed_password": 0}).to_list(1000)
    return [UserRead(**user) for user in users]

@router.get("/{user_id}", response_model=UserRead)
async def read_user(user_id: str):
    user = await users_collection.find_one({"id": user_id}, {"_id": 0, "hashed_password": 0})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return UserRead(**user)

@router.delete("/{user_id}")
async def delete_user(user_id: str):
    result = await users_collection.delete_one({"id": user_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="User not found")
    return {"message": "User deleted"}
