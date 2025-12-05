# MongoDB vs SQLModel Code Comparison

## Database Connection

### MongoDB (Before)
```python
from motor.motor_asyncio import AsyncIOMotorClient
import os

mongo_url = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
db_name = os.environ.get('DB_NAME', 'salon_natasha')

client = AsyncIOMotorClient(mongo_url)
db = client[db_name]

users_collection = db.users
masters_collection = db.masters
services_collection = db.services
appointments_collection = db.appointments
```

### SQLModel (After)
```python
from sqlmodel import create_engine, Session, SQLModel
from typing import Generator
import os

SUPABASE_DB_URL = os.environ.get('SUPABASE_DB_URL')

engine = create_engine(
    SUPABASE_DB_URL,
    echo=False,
    pool_pre_ping=True,
    pool_size=10,
    max_overflow=20
)

def get_session() -> Generator[Session, None, None]:
    with Session(engine) as session:
        yield session
```

## Create Operation

### MongoDB (Before)
```python
@router.post("/")
async def create_user(user: UserCreate):
    existing_user = await users_collection.find_one({"email": user.email})

    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed_password = pwd_context.hash(user.password)

    new_user = {
        "id": str(uuid.uuid4()),
        "email": user.email,
        "hashed_password": hashed_password,
        "name": user.name
    }

    await users_collection.insert_one(new_user)
    return new_user
```

### SQLModel (After)
```python
@router.post("/")
def create_user(user: UserCreate, session: Session = Depends(get_session)):
    statement = select(User).where(User.email == user.email)
    existing_user = session.exec(statement).first()

    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed_password = pwd_context.hash(user.password)

    new_user = User(
        email=user.email,
        hashed_password=hashed_password,
        name=user.name
    )

    session.add(new_user)
    session.commit()
    session.refresh(new_user)
    return new_user
```

## Read Operation

### MongoDB (Before)
```python
@router.get("/")
async def get_users():
    users = await users_collection.find({}, {"_id": 0}).to_list(1000)
    return users

@router.get("/{user_id}")
async def get_user(user_id: str):
    user = await users_collection.find_one({"id": user_id}, {"_id": 0})

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return user
```

### SQLModel (After)
```python
@router.get("/")
def get_users(session: Session = Depends(get_session)):
    statement = select(User)
    users = session.exec(statement).all()
    return users

@router.get("/{user_id}")
def get_user(user_id: str, session: Session = Depends(get_session)):
    statement = select(User).where(User.id == user_id)
    user = session.exec(statement).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return user
```

## Update Operation

### MongoDB (Before)
```python
@router.put("/{master_id}")
async def update_master(master_id: str, master_update: MasterUpdate):
    master = await masters_collection.find_one({"id": master_id})

    if not master:
        raise HTTPException(status_code=404, detail="Master not found")

    update_dict = master_update.model_dump(exclude_unset=True)

    await masters_collection.update_one(
        {"id": master_id},
        {"$set": update_dict}
    )

    updated_master = await masters_collection.find_one(
        {"id": master_id},
        {"_id": 0}
    )

    return updated_master
```

### SQLModel (After)
```python
@router.put("/{master_id}")
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

    return master
```

## Delete Operation

### MongoDB (Before)
```python
@router.delete("/{user_id}")
async def delete_user(user_id: str):
    result = await users_collection.delete_one({"id": user_id})

    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="User not found")

    return {"message": "User deleted successfully"}
```

### SQLModel (After)
```python
@router.delete("/{user_id}")
def delete_user(user_id: str, session: Session = Depends(get_session)):
    statement = select(User).where(User.id == user_id)
    user = session.exec(statement).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    session.delete(user)
    session.commit()

    return {"message": "User deleted successfully"}
```

## Complex Query (Conflict Detection)

### MongoDB (Before)
```python
@router.post("/")
async def create_appointment(appointment: AppointmentCreate):
    existing = await appointments_collection.find_one({
        "master_id": appointment.master_id,
        "date_time": appointment.date_time
    })

    if existing:
        raise HTTPException(status_code=400, detail="Conflict")

    new_appointment = {
        "id": str(uuid.uuid4()),
        "date_time": appointment.date_time,
        "status": "pending",
        "user_id": appointment.user_id,
        "master_id": appointment.master_id,
        "service_id": appointment.service_id
    }

    await appointments_collection.insert_one(new_appointment)
    return new_appointment
```

### SQLModel (After)
```python
@router.post("/")
def create_appointment(
    appointment: AppointmentCreate,
    session: Session = Depends(get_session)
):
    statement = select(Appointment).where(
        Appointment.master_id == appointment.master_id,
        Appointment.date_time == appointment.date_time
    )
    existing = session.exec(statement).first()

    if existing:
        raise HTTPException(status_code=400, detail="Conflict")

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
    return new_appointment
```

## Key Differences

| Aspect | MongoDB | SQLModel |
|--------|---------|----------|
| **Async** | Required (motor) | Optional (synchronous) |
| **Type Safety** | Dictionary-based | Model-based with types |
| **Relationships** | Manual references | Built-in relationships |
| **Queries** | NoSQL query syntax | SQL-like select/where |
| **Constraints** | Application-level | Database-level |
| **Transactions** | Limited | Full ACID support |
| **Schema** | Schema-less | Strongly typed schema |

## Benefits of SQLModel

1. **Type Safety**: Compile-time type checking with Python types
2. **Data Integrity**: Foreign keys enforced at database level
3. **IDE Support**: Better autocomplete and refactoring
4. **Relationships**: Automatic handling of joins and relationships
5. **Standard SQL**: Industry-standard query patterns
6. **Validation**: Both Pydantic and database validation
7. **Performance**: Optimized queries with proper indexes
