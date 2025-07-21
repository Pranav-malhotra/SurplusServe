from fastapi import APIRouter
from .auth import router as auth_router

router = APIRouter()
router.include_router(auth_router)

# Auth endpoints (register, login)
# Predictive shorting endpoint
# Surplus listing endpoints
# NGO endpoints
# Feedback endpoints

# These will be implemented in detail in their own modules or here as needed.
