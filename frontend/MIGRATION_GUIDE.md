# Database Migration Guide: MongoDB to SQLModel/PostgreSQL

## Overview

Successfully migrated the Salon Natasha application from MongoDB to PostgreSQL using SQLModel and Supabase.

## What Changed

### Database Layer
- **Before**: MongoDB with Motor (async driver)
- **After**: PostgreSQL with SQLModel and Supabase

### Key Files Modified

#### 1. `backend/database.py`
- Removed MongoDB connection (`AsyncIOMotorClient`)
- Added SQLModel engine with PostgreSQL connection
- Implemented session-based dependency injection
- Added database initialization function

#### 2. `backend/models.py` (NEW)
- Created SQLModel models for all entities
- Defined relationships between tables
- UUID primary keys
- Proper foreign key constraints

#### 3. `backend/schemas.py`
- Updated to use UUID types
- Added proper Pydantic v2 configurations
- Maintained API contract compatibility

#### 4. All Routers (`backend/routers/*.py`)
- Converted MongoDB queries to SQLModel queries
- Changed from collection operations to session-based queries
- Maintained same API endpoints and response formats

#### 5. `backend/requirements.txt`
- Removed: `motor`, `pymongo`
- Added: `sqlmodel`, `psycopg2-binary`, `asyncpg`

#### 6. `backend/server.py`
- Added database initialization on startup
- Updated imports for SQLModel compatibility

## Database Schema

### Tables Created in Supabase

1. **users** - Authentication and user management
2. **masters** - Salon professionals
3. **services** - Available services
4. **appointments** - Booking system with foreign keys

### Security Features
- Row Level Security (RLS) enabled on all tables
- Proper access policies for authenticated users
- Foreign key constraints for data integrity
- Unique constraints on critical fields

## API Compatibility

**Important**: The API endpoints remain unchanged. Frontend applications require NO modifications.

- All endpoints use the same paths
- Request/response formats are identical
- Authentication flow unchanged
- Error handling consistent

## Setup Instructions

### 1. Environment Configuration

Create `.env` file in the backend directory:

```bash
SUPABASE_DB_URL=postgresql://postgres:[password]@[host]:[port]/postgres
CORS_ORIGINS=http://localhost:3000,http://localhost:5173
JWT_SECRET_KEY=your-secret-key
JWT_ALGORITHM=HS256
JWT_EXPIRATION_MINUTES=30
```

### 2. Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 3. Database Setup

The database schema is already created in Supabase via migrations. No manual setup needed.

### 4. Run Application

```bash
python -m uvicorn server:app --reload --host 0.0.0.0 --port 8000
```

## Query Conversion Examples

### Create Operation
**Before (MongoDB)**:
```python
result = await collection.insert_one(document)
```

**After (SQLModel)**:
```python
session.add(model)
session.commit()
session.refresh(model)
```

### Read Operation
**Before (MongoDB)**:
```python
document = await collection.find_one({"id": item_id})
```

**After (SQLModel)**:
```python
statement = select(Model).where(Model.id == item_id)
item = session.exec(statement).first()
```

### Update Operation
**Before (MongoDB)**:
```python
await collection.update_one(
    {"id": item_id},
    {"$set": update_dict}
)
```

**After (SQLModel)**:
```python
for key, value in update_dict.items():
    setattr(item, key, value)
session.add(item)
session.commit()
```

### Delete Operation
**Before (MongoDB)**:
```python
result = await collection.delete_one({"id": item_id})
```

**After (SQLModel)**:
```python
session.delete(item)
session.commit()
```

## Benefits of Migration

1. **Strong Data Integrity**: Foreign key constraints and ACID compliance
2. **Better Performance**: Indexed queries and optimized joins
3. **Security**: Row Level Security policies in Supabase
4. **Type Safety**: SQLModel provides better type checking
5. **Relationships**: Proper relational data modeling
6. **Scalability**: PostgreSQL's proven scalability
7. **Standard SQL**: Industry-standard query language

## Frontend Impact

**No changes required** - The REST API interface is fully compatible. Frontend applications will work without modifications.

## Testing Checklist

- [ ] User registration and login
- [ ] Create/read/update/delete masters
- [ ] Create/read/update/delete services
- [ ] Create/read/update/delete appointments
- [ ] Appointment conflict detection
- [ ] Foreign key constraints
- [ ] Unique constraints (email, phone, service name)
- [ ] Authentication flow
- [ ] CORS configuration

## Rollback Plan

If rollback is needed:
1. Restore MongoDB connection in `database.py`
2. Revert routers to use Motor queries
3. Restore original `requirements.txt`
4. The original MongoDB data should be backed up before migration

## Support

For issues or questions about the migration, refer to:
- SQLModel documentation: https://sqlmodel.tiangolo.com
- FastAPI documentation: https://fastapi.tiangolo.com
- Supabase documentation: https://supabase.com/docs
