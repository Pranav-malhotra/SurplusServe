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
    event_id: Optional[int]

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
