# Salon Natasha Backend API

Backend API for Salon Natasha management system, migrated from MongoDB to PostgreSQL with SQLModel.

## Technology Stack

- **Framework**: FastAPI
- **Database**: PostgreSQL (Supabase)
- **ORM**: SQLModel
- **Authentication**: JWT with bcrypt password hashing

## Database Schema

### Tables

1. **users** - User accounts with authentication
   - id (UUID)
   - email (unique)
   - hashed_password
   - name
   - created_at

2. **masters** - Salon professionals/specialists
   - id (UUID)
   - name
   - sex
   - phone (unique)
   - experience
   - specialty
   - created_at

3. **services** - Available salon services
   - id (UUID)
   - name (unique)
   - description
   - price
   - duration
   - created_at

4. **appointments** - Client bookings
   - id (UUID)
   - date_time
   - status
   - user_id (FK to users)
   - master_id (FK to masters)
   - service_id (FK to services)
   - created_at

## Setup

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Configure environment variables:
```bash
cp .env.example .env
# Edit .env with your Supabase credentials
```

3. The database schema is already created in Supabase. No manual migrations needed.

4. Run the server:
```bash
python -m uvicorn server:app --reload
```

## API Endpoints

### Users
- `POST /api/users/` - Create new user
- `POST /api/users/login/` - Login and get JWT token
- `GET /api/users/` - List all users
- `GET /api/users/{user_id}` - Get user by ID
- `DELETE /api/users/{user_id}` - Delete user

### Masters
- `POST /api/masters/` - Create master
- `GET /api/masters/` - List all masters
- `GET /api/masters/{master_id}` - Get master by ID
- `PUT /api/masters/{master_id}` - Update master
- `DELETE /api/masters/{master_id}` - Delete master

### Services
- `POST /api/services/` - Create service
- `GET /api/services/` - List all services
- `GET /api/services/{service_id}` - Get service by ID
- `PUT /api/services/{service_id}` - Update service
- `DELETE /api/services/{service_id}` - Delete service

### Appointments
- `POST /api/appointments/` - Create appointment
- `GET /api/appointments/` - List all appointments
- `GET /api/appointments/{appointment_id}` - Get appointment by ID
- `PUT /api/appointments/{appointment_id}` - Update appointment
- `DELETE /api/appointments/{appointment_id}` - Delete appointment

## Migration from MongoDB

The application has been successfully migrated from MongoDB to PostgreSQL:

- Replaced Motor (async MongoDB) with SQLModel (PostgreSQL ORM)
- All MongoDB queries converted to SQL queries
- Maintained API compatibility
- Added proper foreign key relationships
- Implemented Row Level Security (RLS) in Supabase

### Key Changes

1. **Database Layer**:
   - `database.py` now uses SQLModel engine instead of MongoDB client
   - Session-based dependency injection instead of direct collection access

2. **Models**:
   - Created SQLModel models in `models.py`
   - Proper relationships between tables
   - UUID primary keys

3. **Routers**:
   - All routers updated to use SQLModel queries
   - `select()`, `where()`, `exec()` instead of MongoDB queries
   - Proper session management with dependency injection

4. **Dependencies**:
   - Removed: `motor`, `pymongo`
   - Added: `sqlmodel`, `psycopg2-binary`, `asyncpg`
