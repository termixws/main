# Deployment Checklist

## Pre-Deployment

### 1. Environment Setup
- [ ] Supabase project created
- [ ] Database connection string obtained
- [ ] `.env` file created in backend directory
- [ ] All environment variables configured:
  - [ ] `SUPABASE_DB_URL`
  - [ ] `CORS_ORIGINS`
  - [ ] `JWT_SECRET_KEY`
  - [ ] `JWT_ALGORITHM`
  - [ ] `JWT_EXPIRATION_MINUTES`

### 2. Dependencies
- [ ] Python 3.9+ installed
- [ ] Run `pip install -r backend/requirements.txt`
- [ ] All dependencies installed successfully
- [ ] No version conflicts

### 3. Database
- [ ] Supabase database schema created (via migration)
- [ ] All tables exist:
  - [ ] users
  - [ ] masters
  - [ ] services
  - [ ] appointments
- [ ] Row Level Security policies active
- [ ] Indexes created
- [ ] Foreign key constraints in place

## Testing

### 4. Backend API Tests
- [ ] Server starts without errors: `python -m uvicorn backend.server:app`
- [ ] API documentation accessible at `/docs`
- [ ] Health check endpoint works

### 5. User Endpoints
- [ ] POST `/api/users/` - User registration works
- [ ] POST `/api/users/login/` - Login returns JWT token
- [ ] GET `/api/users/` - List users works
- [ ] GET `/api/users/{id}` - Get single user works
- [ ] DELETE `/api/users/{id}` - Delete user works
- [ ] Duplicate email validation works
- [ ] Password hashing works correctly

### 6. Masters Endpoints
- [ ] POST `/api/masters/` - Create master works
- [ ] GET `/api/masters/` - List all masters works
- [ ] GET `/api/masters/{id}` - Get single master works
- [ ] PUT `/api/masters/{id}` - Update master works
- [ ] DELETE `/api/masters/{id}` - Delete master works
- [ ] Duplicate phone validation works

### 7. Services Endpoints
- [ ] POST `/api/services/` - Create service works
- [ ] GET `/api/services/` - List all services works
- [ ] GET `/api/services/{id}` - Get single service works
- [ ] PUT `/api/services/{id}` - Update service works
- [ ] DELETE `/api/services/{id}` - Delete service works
- [ ] Duplicate name validation works

### 8. Appointments Endpoints
- [ ] POST `/api/appointments/` - Create appointment works
- [ ] GET `/api/appointments/` - List all appointments works
- [ ] GET `/api/appointments/{id}` - Get single appointment works
- [ ] PUT `/api/appointments/{id}` - Update appointment works
- [ ] DELETE `/api/appointments/{id}` - Delete appointment works
- [ ] Time conflict detection works
- [ ] Foreign key constraints enforced

### 9. Security Tests
- [ ] CORS configured correctly
- [ ] JWT authentication works
- [ ] Password hashing verified
- [ ] SQL injection protection verified
- [ ] RLS policies enforced in Supabase
- [ ] Sensitive data not exposed in logs

### 10. Data Integrity
- [ ] Foreign key relationships work
- [ ] Cascade deletes work correctly
- [ ] Unique constraints enforced
- [ ] UUID generation works
- [ ] Timestamps created correctly

## Performance

### 11. Query Optimization
- [ ] Database indexes created
- [ ] Connection pooling configured
- [ ] Query performance acceptable
- [ ] No N+1 query issues

## Frontend

### 12. Frontend Integration
- [ ] Frontend connects to backend
- [ ] API base URL configured
- [ ] CORS allows frontend origin
- [ ] All API calls work
- [ ] Error handling works
- [ ] JWT token storage works

## Production Deployment

### 13. Server Configuration
- [ ] Production server configured
- [ ] Environment variables set
- [ ] HTTPS/SSL configured
- [ ] Domain/subdomain configured
- [ ] Firewall rules set

### 14. Monitoring
- [ ] Logging configured
- [ ] Error tracking set up
- [ ] Performance monitoring active
- [ ] Database backups configured

### 15. Documentation
- [ ] API documentation accessible
- [ ] Environment variables documented
- [ ] Deployment process documented
- [ ] Migration guide reviewed

## Post-Deployment

### 16. Verification
- [ ] Production API accessible
- [ ] All endpoints working
- [ ] Database connections stable
- [ ] No errors in logs
- [ ] Performance acceptable

### 17. Rollback Plan
- [ ] Backup of previous version
- [ ] Rollback procedure documented
- [ ] Database backup created
- [ ] Rollback tested

## Notes

**Critical Issues to Watch:**
- Connection pool exhaustion
- JWT token expiration handling
- Database connection failures
- CORS policy mismatches
- Foreign key constraint violations

**Performance Benchmarks:**
- User registration: < 500ms
- Login: < 300ms
- List queries: < 200ms
- Single item queries: < 100ms
- Updates/Deletes: < 200ms

**Support Contacts:**
- Database: Supabase Support
- Backend: Development Team
- Frontend: Development Team

---

**Deployment Date**: _______________
**Deployed By**: _______________
**Version**: 2.0.0 (PostgreSQL Migration)
**Status**: ⬜ Not Started | ⬜ In Progress | ⬜ Complete
