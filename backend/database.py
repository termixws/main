from motor.motor_asyncio import AsyncIOMotorClient
import os

mongo_url = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
db_name = os.environ.get('DB_NAME', 'salon_natasha')

client = AsyncIOMotorClient(mongo_url)
db = client[db_name]

# Collections
users_collection = db.users
masters_collection = db.masters
services_collection = db.services
appointments_collection = db.appointments

def get_db():
    return db
