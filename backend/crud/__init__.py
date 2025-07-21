from sqlalchemy.orm import Session
from .. import models, schemas
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_password_hash(password):
    return pwd_context.hash(password)

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def create_user(db: Session, user: schemas.UserCreate):
    hashed_password = get_password_hash(user.password)
    db_user = models.User(email=user.email, hashed_password=hashed_password, name=user.name, role=user.role)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def create_event(db: Session, event: schemas.EventCreate, user_id: int, ai_suggestion=None, ai_savings_kg=None, ai_savings_rupees=None):
    db_event = models.Event(
        user_id=user_id,
        event_type=event.event_type,
        guest_count=event.guest_count,
        food_types=event.food_types,
        ai_suggestion=ai_suggestion,
        ai_savings_kg=ai_savings_kg,
        ai_savings_rupees=ai_savings_rupees
    )
    db.add(db_event)
    db.commit()
    db.refresh(db_event)
    return db_event

def create_surplus_listing(db: Session, listing: schemas.SurplusListingCreate, user_id: int, ai_optimized=False):
    db_listing = models.SurplusListing(
        user_id=user_id,
        event_id=listing.event_id,
        description=listing.description,
        quantity_kg=listing.quantity_kg,
        photo_url=listing.photo_url,
        ai_optimized=ai_optimized
    )
    db.add(db_listing)
    db.commit()
    db.refresh(db_listing)
    return db_listing

def create_feedback(db: Session, feedback: schemas.FeedbackCreate, user_id: int):
    db_feedback = models.Feedback(
        user_id=user_id,
        listing_id=feedback.listing_id,
        event_id=feedback.event_id,
        rating=feedback.rating,
        comment=feedback.comment
    )
    db.add(db_feedback)
    db.commit()
    db.refresh(db_feedback)
    return db_feedback
