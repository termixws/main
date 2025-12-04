from fastapi import FastAPI, APIRouter
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os
import logging
from pathlib import Path

# Load environment
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Create the main app
app = FastAPI(title="Salon Natasha API")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Import routers
from routers import users, masters, services, appointments

# Include routers in api_router
api_router.include_router(users.router)
api_router.include_router(masters.router)
api_router.include_router(services.router)
api_router.include_router(appointments.router)

# Root endpoint
@api_router.get("/")
async def root():
    return {"message": "Welcome to Salon Natasha API"}

# Include the api_router in the main app
app.include_router(api_router)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

logger.info("Salon Natasha API started successfully")
