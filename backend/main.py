from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import Base, engine
from .config import settings
from .api import router as api_router
import os

app = FastAPI(title="SurplusServe API", version="1.0.0")

# Initialize database tables
@app.on_event("startup")
async def startup_event():
    try:
        # Create all tables
        Base.metadata.create_all(bind=engine)
        print("✅ Database tables initialized successfully")
    except Exception as e:
        print(f"❌ Error initializing database: {e}")

# Allow CORS for frontend (production and development)
origins = [
    "http://localhost:3000",
    "http://localhost:5173", 
    "http://localhost:8080",
    "https://surplus-serve-ms7664x92-pranavs-projects-a623ece8.vercel.app",
    "https://surplus-serve.vercel.app",
    "*"  # Allow all origins for now (you can restrict this later)
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix="/api")

@app.get("/")
def read_root():
    return {"message": "SurplusServe FastAPI backend is running."}

@app.get("/health")
def health_check():
    return {"status": "healthy", "message": "API is running"}
