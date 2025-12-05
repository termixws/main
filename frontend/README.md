# Salon Natasha - PostgreSQL Migration

## Overview

This project has been successfully migrated from **MongoDB** to **PostgreSQL** using **SQLModel** and **Supabase** as the database provider.

## Documentation Index

### Quick Start
1. **[MIGRATION_SUMMARY.md](MIGRATION_SUMMARY.md)** - Quick overview of what changed
2. **[backend/README.md](backend/README.md)** - Backend API documentation

### Detailed Documentation
3. **[MIGRATION_GUIDE.md](MIGRATION_GUIDE.md)** - Complete migration guide with setup instructions
4. **[CODE_COMPARISON.md](CODE_COMPARISON.md)** - Side-by-side comparison of MongoDB vs SQLModel code
5. **[DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md)** - Comprehensive deployment checklist

### Code Examples
6. **[frontend/api-example.ts](frontend/api-example.ts)** - TypeScript API client example
7. **[backend/.env.example](backend/.env.example)** - Environment variables template

## Project Structure

```
salon_natasha/
├── backend/
│   ├── __init__.py
│   ├── server.py              # FastAPI application
│   ├── database.py            # SQLModel database connection
│   ├── models.py              # Database models
│   ├── schemas.py             # Pydantic schemas
│   ├── requirements.txt       # Python dependencies
│   ├── setup.sh              # Setup script
│   ├── .env.example          # Environment template
│   └── routers/
│       ├── __init__.py
│       ├── users.py          # User endpoints
│       ├── masters.py        # Master endpoints
│       ├── services.py       # Service endpoints
│       └── appointments.py   # Appointment endpoints
│
├── frontend/
│   └── api-example.ts        # Frontend API client
│
├── README.md                 # This file
├── MIGRATION_SUMMARY.md      # Quick migration overview
├── MIGRATION_GUIDE.md        # Detailed migration guide
├── CODE_COMPARISON.md        # Code comparison
└── DEPLOYMENT_CHECKLIST.md   # Deployment checklist
```

## Quick Start

### 1. Install Dependencies
```bash
cd backend
pip install -r requirements.txt
```

### 2. Configure Environment
```bash
cp .env.example .env
# Edit .env with your Supabase credentials
```

### 3. Run the Server
```bash
python -m uvicorn server:app --reload
```

### 4. Access API Documentation
Open your browser to http://localhost:8000/docs

## Technology Stack

### Backend
- **Framework**: FastAPI
- **Database**: PostgreSQL (Supabase)
- **ORM**: SQLModel
- **Authentication**: JWT with bcrypt
- **Server**: Uvicorn

### Database
- **Provider**: Supabase
- **Type**: PostgreSQL 15+
- **Features**:
  - Row Level Security (RLS)
  - Foreign key constraints
  - UUID primary keys
  - Automatic timestamps

## API Endpoints

### Users
- `POST /api/users/` - Register new user
- `POST /api/users/login/` - Login and get JWT token
- `GET /api/users/` - List all users
- `GET /api/users/{id}` - Get user by ID
- `DELETE /api/users/{id}` - Delete user

### Masters
- `POST /api/masters/` - Create master
- `GET /api/masters/` - List all masters
- `GET /api/masters/{id}` - Get master by ID
- `PUT /api/masters/{id}` - Update master
- `DELETE /api/masters/{id}` - Delete master

### Services
- `POST /api/services/` - Create service
- `GET /api/services/` - List all services
- `GET /api/services/{id}` - Get service by ID
- `PUT /api/services/{id}` - Update service
- `DELETE /api/services/{id}` - Delete service

### Appointments
- `POST /api/appointments/` - Create appointment
- `GET /api/appointments/` - List all appointments
- `GET /api/appointments/{id}` - Get appointment by ID
- `PUT /api/appointments/{id}` - Update appointment
- `DELETE /api/appointments/{id}` - Delete appointment

## Database Schema

### Tables
1. **users** - User accounts and authentication
2. **masters** - Salon professionals/specialists
3. **services** - Available salon services
4. **appointments** - Client bookings with foreign keys

### Relationships
- Appointments → Users (many-to-one)
- Appointments → Masters (many-to-one)
- Appointments → Services (many-to-one)

## Migration Status

✅ Database schema created in Supabase
✅ All models converted to SQLModel
✅ All routers updated with SQL queries
✅ Dependencies updated
✅ API compatibility maintained
✅ Row Level Security configured
✅ Foreign key constraints implemented
✅ Indexes created for performance

## Frontend Compatibility

**No changes required!** The REST API interface is fully compatible with existing frontend code. All endpoints maintain the same request/response formats.

## Key Benefits

1. **Data Integrity** - ACID transactions and foreign key constraints
2. **Performance** - Optimized queries with proper indexing
3. **Security** - Row Level Security policies in Supabase
4. **Type Safety** - SQLModel provides excellent type checking
5. **Scalability** - PostgreSQL's proven scalability
6. **Standard SQL** - Industry-standard query language
7. **Better Tooling** - Rich ecosystem for PostgreSQL

## Environment Variables

Required variables in `.env`:

```env
SUPABASE_DB_URL=postgresql://user:password@host:port/database
CORS_ORIGINS=http://localhost:3000,http://localhost:5173
JWT_SECRET_KEY=your-secret-key-here
JWT_ALGORITHM=HS256
JWT_EXPIRATION_MINUTES=30
```

## Development

### Running Tests
```bash
pytest
```

### Code Formatting
```bash
black .
isort .
```

### Type Checking
```bash
mypy .
```

### Linting
```bash
flake8 .
```

## Support

For issues or questions, refer to:
- [SQLModel Documentation](https://sqlmodel.tiangolo.com)
- [FastAPI Documentation](https://fastapi.tiangolo.com)
- [Supabase Documentation](https://supabase.com/docs)

## License

[Your License Here]

---

**Version**: 2.0.0 (PostgreSQL Migration)
**Migration Date**: 2025-12-05
**Status**: ✅ Production Ready
