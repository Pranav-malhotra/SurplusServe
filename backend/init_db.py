from database import engine, Base
from models import User, Event, SurplusListing, Feedback

def init_db():
    """Initialize the database by creating all tables."""
    try:
        # Create all tables
        Base.metadata.create_all(bind=engine)
        print("✅ Database tables created successfully")
    except Exception as e:
        print(f"❌ Error creating database tables: {e}")
        raise e

if __name__ == "__main__":
    init_db() 