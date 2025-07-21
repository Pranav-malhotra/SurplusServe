from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Float, Boolean, Text
from sqlalchemy.orm import relationship
from ..database import Base
import datetime

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    role = Column(String(50), nullable=False)  # 'restaurant', 'store', 'ngo', 'admin'
    name = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    events = relationship("Event", back_populates="owner")
    surplus_listings = relationship("SurplusListing", back_populates="owner")
    feedbacks = relationship("Feedback", back_populates="user")

class Event(Base):
    __tablename__ = "events"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    event_type = Column(String(100))
    guest_count = Column(Integer)
    food_types = Column(String(255))  # Comma-separated
    date = Column(DateTime, default=datetime.datetime.utcnow)
    ai_suggestion = Column(Text)
    ai_savings_kg = Column(Float)
    ai_savings_rupees = Column(Float)

    owner = relationship("User", back_populates="events")

class SurplusListing(Base):
    __tablename__ = "surplus_listings"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    event_id = Column(Integer, ForeignKey("events.id"), nullable=True)
    description = Column(Text)
    quantity_kg = Column(Float)
    photo_url = Column(String(255), nullable=True)
    status = Column(String(50), default="available")  # available, claimed, collected, expired
    ai_optimized = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    claimed_by_id = Column(Integer, ForeignKey("users.id"), nullable=True)

    owner = relationship("User", foreign_keys=[user_id], back_populates="surplus_listings")
    event = relationship("Event")
    claimed_by = relationship("User", foreign_keys=[claimed_by_id])

class Feedback(Base):
    __tablename__ = "feedbacks"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    listing_id = Column(Integer, ForeignKey("surplus_listings.id"), nullable=True)
    event_id = Column(Integer, ForeignKey("events.id"), nullable=True)
    rating = Column(Integer)
    comment = Column(Text)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="feedbacks")
