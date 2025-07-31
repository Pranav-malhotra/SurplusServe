from pydantic import BaseModel, EmailStr
from typing import Optional, List
import datetime

class UserBase(BaseModel):
    email: EmailStr
    name: str
    role: str

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: int
    created_at: datetime.datetime
    class Config:
        orm_mode = True

class EventBase(BaseModel):
    event_type: str
    guest_count: int
    food_types: str

class EventCreate(EventBase):
    pass

class EventResponse(EventBase):
    id: int
    user_id: int
    date: datetime.datetime
    ai_suggestion: Optional[str]
    ai_savings_kg: Optional[float]
    ai_savings_rupees: Optional[float]
    class Config:
        orm_mode = True

class SurplusListingBase(BaseModel):
    description: str
    quantity_kg: float
    photo_url: Optional[str]
    ai_optimized: Optional[bool] = False

class SurplusListingCreate(SurplusListingBase):
    event_id: Optional[int] = None

class SurplusListingResponse(SurplusListingBase):
    id: int
    user_id: int
    event_id: Optional[int]
    status: str
    created_at: datetime.datetime
    claimed_by_id: Optional[int]
    class Config:
        orm_mode = True

class FeedbackBase(BaseModel):
    rating: int
    comment: Optional[str]

class FeedbackCreate(FeedbackBase):
    listing_id: Optional[int]
    event_id: Optional[int]

class FeedbackResponse(FeedbackBase):
    id: int
    user_id: int
    listing_id: Optional[int]
    event_id: Optional[int]
    created_at: datetime.datetime
    class Config:
        orm_mode = True

# Predictive Shorting Schemas
class PredictiveShortingRequest(BaseModel):
    event_type: str
    guest_count: int
    food_types: str  # Comma-separated
    seasonality: str
    location: str
    quantity_of_food: float  # Planned quantity in kg

class PredictiveShortingResponse(BaseModel):
    predicted_wastage_kg: float
    suggested_shorting_kg: float
    ai_suggestion: str
    estimated_savings_rupees: float
    risk_level: str  # e.g., 'Low', 'Medium', 'High'

# Analytics Schemas
class UserAnalytics(BaseModel):
    user_id: int
    total_listings: int
    total_quantity_kg: float
    success_rate: float
    ai_optimization_rate: float
    avg_listing_size: float
    most_common_food_types: List[str]
    peak_activity_hours: List[int]
    total_savings_rupees: float
    impact_score: float  # 0-100 score based on various metrics

class PlatformAnalytics(BaseModel):
    total_users: int
    total_listings: int
    total_quantity_kg: float
    total_meals_provided: int
    total_savings_rupees: float
    active_listings: int
    claimed_listings: int
    collected_listings: int
    ai_optimization_rate: float
    platform_success_rate: float
    top_performing_users: List[dict]
    food_waste_reduction_kg: float

class EventAnalytics(BaseModel):
    event_type: str
    avg_guest_count: float
    avg_wastage_kg: float
    success_rate: float
    common_food_types: List[str]
    seasonal_trends: dict
    location_performance: dict

class AnalyticsRequest(BaseModel):
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    user_id: Optional[int] = None
    event_type: Optional[str] = None
    location: Optional[str] = None

class AnalyticsResponse(BaseModel):
    user_analytics: Optional[UserAnalytics] = None
    platform_analytics: Optional[PlatformAnalytics] = None
    event_analytics: Optional[List[EventAnalytics]] = None
    trends: dict
    recommendations: List[str]
