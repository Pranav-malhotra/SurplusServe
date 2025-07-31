import os
import joblib
import numpy as np

# Load model, encoder, scaler from backend directory
MODEL_DIR = os.path.join(os.path.dirname(__file__), '..')
try:
    rf_model = joblib.load(os.path.join(MODEL_DIR, 'rf_model.pkl'))
    encoder = joblib.load(os.path.join(MODEL_DIR, 'encoder.pkl'))
    scaler = joblib.load(os.path.join(MODEL_DIR, 'scaler.pkl'))
    print("✅ ML models loaded successfully")
except Exception as e:
    print(f"❌ Error loading models: {e}")
    # Fallback to dummy models for now
    rf_model = None
    encoder = None
    scaler = None

# Helper function for prediction
def predict_wastage(input_dict):
    if rf_model is None or encoder is None or scaler is None:
        # Fallback to dummy prediction
        return 5.0  # Dummy wastage prediction
    
    cat_features = ['Type of Food', 'Event Type', 'Seasonality', 'Geographical Location']
    num_features = ['Number of Guests', 'Quantity of Food']
    # 1. Encode categoricals
    X_cat = encoder.transform([[input_dict[feat] for feat in cat_features]])
    # 2. Scale numerics
    X_num = scaler.transform([[input_dict[feat] for feat in num_features]])
    # 3. Combine
    X_full = np.concatenate([X_cat, X_num], axis=1)
    # 4. Predict
    pred = rf_model.predict(X_full)
    return float(pred[0])

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from .auth import router as auth_router
from .. import schemas, crud, models
from ..database import SessionLocal

router = APIRouter()
router.include_router(auth_router)

# Dependency for DB

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# --- Surplus Listing Endpoints ---

@router.post("/surplus-listings", response_model=schemas.SurplusListingResponse)
def create_surplus_listing(listing: schemas.SurplusListingCreate, user_id: int, db: Session = Depends(get_db)):
    try:
        # Validate user exists
        user = db.query(models.User).filter(models.User.id == user_id).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        # Validate listing data
        if listing.quantity_kg <= 0:
            raise HTTPException(status_code=400, detail="Quantity must be greater than 0")
        
        if not listing.description or len(listing.description.strip()) < 5:
            raise HTTPException(status_code=400, detail="Description must be at least 5 characters long")
        
        result = crud.create_surplus_listing(db, listing, user_id=user_id)
        return result
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating listing: {str(e)}")

@router.get("/surplus-listings", response_model=list[schemas.SurplusListingResponse])
def list_surplus_listings(db: Session = Depends(get_db)):
    try:
        listings = db.query(models.SurplusListing).all()
        return listings
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching listings: {str(e)}")

@router.get("/surplus-listings/mine", response_model=list[schemas.SurplusListingResponse])
def list_my_surplus_listings(user_id: int, db: Session = Depends(get_db)):
    try:
        # Validate user exists
        user = db.query(models.User).filter(models.User.id == user_id).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        listings = db.query(models.SurplusListing).filter(
            models.SurplusListing.user_id == user_id
        ).all()
        return listings
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching user listings: {str(e)}")

@router.patch("/surplus-listings/{listing_id}/claim", response_model=schemas.SurplusListingResponse)
def claim_surplus_listing(listing_id: int, ngo_id: int, db: Session = Depends(get_db)):
    try:
        # Validate NGO exists
        ngo = db.query(models.User).filter(models.User.id == ngo_id).first()
        if not ngo or ngo.role != "ngo":
            raise HTTPException(status_code=400, detail="Invalid NGO user")
        
        listing = db.query(models.SurplusListing).filter(models.SurplusListing.id == listing_id).first()
        if not listing:
            raise HTTPException(status_code=404, detail="Listing not found")
        if listing.status != "available":
            raise HTTPException(status_code=400, detail="Listing not available")
        
        listing.status = "claimed"
        listing.claimed_by_id = ngo_id
        db.commit()
        db.refresh(listing)
        return listing
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error claiming listing: {str(e)}")

@router.patch("/surplus-listings/{listing_id}/collect", response_model=schemas.SurplusListingResponse)
def collect_surplus_listing(listing_id: int, db: Session = Depends(get_db)):
    listing = db.query(models.SurplusListing).filter(models.SurplusListing.id == listing_id).first()
    if not listing:
        raise HTTPException(status_code=404, detail="Listing not found")
    if listing.status != "claimed":
        raise HTTPException(status_code=400, detail="Listing not claimed yet")
    listing.status = "collected"
    db.commit()
    db.refresh(listing)
    return listing

# Real ML model predictive logic

def run_predictive_shorting(request: schemas.PredictiveShortingRequest) -> schemas.PredictiveShortingResponse:
    # Prepare input for the model
    input_dict = {
        'Type of Food': request.food_types.split(',')[0],  # Use first food type
        'Event Type': request.event_type,
        'Seasonality': request.seasonality,
        'Geographical Location': request.location,
        'Number of Guests': request.guest_count,
        'Quantity of Food': request.quantity_of_food
    }
    
    # Get prediction from ML model
    predicted_wastage_kg = predict_wastage(input_dict)
    
    # Calculate suggested shorting (reduce by predicted wastage)
    suggested_shorting_kg = max(0, predicted_wastage_kg * 0.8)  # Suggest reducing by 80% of predicted wastage
    
    # Generate AI suggestion with more detailed insights
    ai_suggestion = f"Based on your event data, we predict {predicted_wastage_kg:.1f}kg of food waste. Consider preparing {suggested_shorting_kg:.1f}kg less to minimize waste while ensuring adequate supply. This could save you approximately ₹{suggested_shorting_kg * 100:.0f} in costs."
    
    # Calculate estimated savings (assuming Rs.100/kg average cost)
    estimated_savings_rupees = suggested_shorting_kg * 100
    
    # Determine risk level based on shorting amount and guest count
    risk_factor = suggested_shorting_kg / max(1, request.guest_count) * 100  # Percentage of shorting per guest
    
    if risk_factor < 0.5:
        risk_level = "Low"
    elif risk_factor < 1.0:
        risk_level = "Medium"
    else:
        risk_level = "High"
    
    return schemas.PredictiveShortingResponse(
        predicted_wastage_kg=predicted_wastage_kg,
        suggested_shorting_kg=suggested_shorting_kg,
        ai_suggestion=ai_suggestion,
        estimated_savings_rupees=estimated_savings_rupees,
        risk_level=risk_level
    )

@router.post("/predictive-shorting", response_model=schemas.PredictiveShortingResponse)
def predictive_shorting(request: schemas.PredictiveShortingRequest):
    """Run predictive shorting for food waste minimization."""
    return run_predictive_shorting(request)

# Dashboard Statistics Endpoints
@router.get("/dashboard/stats/{user_id}")
def get_dashboard_stats(user_id: int, db: Session = Depends(get_db)):
    """Get dashboard statistics for a user."""
    try:
        # Get user's surplus listings
        user_listings = db.query(models.SurplusListing).filter(
            models.SurplusListing.user_id == user_id
        ).all()
        
        # Calculate statistics
        total_listings = len(user_listings)
        active_listings = len([l for l in user_listings if l.status == "available"])
        claimed_listings = len([l for l in user_listings if l.status == "claimed"])
        collected_listings = len([l for l in user_listings if l.status == "collected"])
        
        total_quantity = sum(l.quantity_kg for l in user_listings)
        ai_optimized_count = len([l for l in user_listings if l.ai_optimized])
        
        # Calculate estimated impact (assuming each kg feeds 4 people)
        estimated_meals = total_quantity * 4
        
        # Calculate savings from AI optimization
        ai_savings = ai_optimized_count * 50  # Assume ₹50 savings per AI-optimized listing
        
        return {
            "total_donations": total_listings,
            "active_listings": active_listings,
            "claimed_listings": claimed_listings,
            "collected_listings": collected_listings,
            "total_quantity_kg": total_quantity,
            "estimated_meals_provided": estimated_meals,
            "ai_optimized_count": ai_optimized_count,
            "estimated_savings_rupees": ai_savings,
            "success_rate": (collected_listings / max(1, total_listings)) * 100
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error calculating statistics: {str(e)}")

@router.get("/dashboard/recent-activity/{user_id}")
def get_recent_activity(user_id: int, db: Session = Depends(get_db)):
    """Get recent activity for a user."""
    try:
        # Get recent listings (last 5)
        recent_listings = db.query(models.SurplusListing).filter(
            models.SurplusListing.user_id == user_id
        ).order_by(models.SurplusListing.created_at.desc()).limit(5).all()
        
        return [
            {
                "id": listing.id,
                "description": listing.description,
                "quantity_kg": listing.quantity_kg,
                "status": listing.status,
                "created_at": listing.created_at,
                "ai_optimized": listing.ai_optimized
            }
            for listing in recent_listings
        ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching recent activity: {str(e)}")

# Analytics Endpoints
@router.get("/analytics/user/{user_id}")
def get_user_analytics(user_id: int, db: Session = Depends(get_db)):
    """Get detailed analytics for a specific user."""
    try:
        # Get user's listings
        user_listings = db.query(models.SurplusListing).filter(
            models.SurplusListing.user_id == user_id
        ).all()
        
        if not user_listings:
            return {
                "user_id": user_id,
                "total_listings": 0,
                "total_quantity_kg": 0,
                "success_rate": 0,
                "ai_optimization_rate": 0,
                "avg_listing_size": 0,
                "most_common_food_types": [],
                "peak_activity_hours": [],
                "total_savings_rupees": 0,
                "impact_score": 0
            }
        
        # Calculate metrics
        total_listings = len(user_listings)
        total_quantity = sum(l.quantity_kg for l in user_listings)
        collected_listings = len([l for l in user_listings if l.status == "collected"])
        ai_optimized_listings = len([l for l in user_listings if l.ai_optimized])
        
        success_rate = (collected_listings / total_listings) * 100 if total_listings > 0 else 0
        ai_optimization_rate = (ai_optimized_listings / total_listings) * 100 if total_listings > 0 else 0
        avg_listing_size = total_quantity / total_listings if total_listings > 0 else 0
        
        # Calculate impact score (0-100)
        impact_score = min(100, (
            success_rate * 0.3 +  # Success rate weight
            ai_optimization_rate * 0.3 +  # AI usage weight
            min(total_quantity / 100, 1) * 40  # Quantity weight (max 40 points)
        ))
        
        # Estimate savings (₹50 per AI-optimized listing + ₹10 per kg)
        total_savings = (ai_optimized_listings * 50) + (total_quantity * 10)
        
        return {
            "user_id": user_id,
            "total_listings": total_listings,
            "total_quantity_kg": total_quantity,
            "success_rate": success_rate,
            "ai_optimization_rate": ai_optimization_rate,
            "avg_listing_size": avg_listing_size,
            "most_common_food_types": ["Mixed", "Vegetables", "Grains"],  # Placeholder
            "peak_activity_hours": [10, 14, 18],  # Placeholder
            "total_savings_rupees": total_savings,
            "impact_score": impact_score
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error calculating user analytics: {str(e)}")

@router.get("/analytics/platform")
def get_platform_analytics(db: Session = Depends(get_db)):
    """Get platform-wide analytics."""
    try:
        # Get all data
        all_users = db.query(models.User).all()
        all_listings = db.query(models.SurplusListing).all()
        
        # Calculate platform metrics
        total_users = len(all_users)
        total_listings = len(all_listings)
        total_quantity = sum(l.quantity_kg for l in all_listings)
        active_listings = len([l for l in all_listings if l.status == "available"])
        claimed_listings = len([l for l in all_listings if l.status == "claimed"])
        collected_listings = len([l for l in all_listings if l.status == "collected"])
        ai_optimized_listings = len([l for l in all_listings if l.ai_optimized])
        
        # Calculate rates
        platform_success_rate = (collected_listings / total_listings) * 100 if total_listings > 0 else 0
        ai_optimization_rate = (ai_optimized_listings / total_listings) * 100 if total_listings > 0 else 0
        
        # Calculate total impact
        total_meals_provided = total_quantity * 4  # 4 meals per kg
        total_savings = (ai_optimized_listings * 50) + (total_quantity * 10)
        food_waste_reduction = total_quantity * 0.8  # Assume 80% waste reduction
        
        # Get top performing users (by impact score)
        top_users = []
        for user in all_users[:5]:  # Top 5 users
            user_listings = [l for l in all_listings if l.user_id == user.id]
            if user_listings:
                user_quantity = sum(l.quantity_kg for l in user_listings)
                user_success = len([l for l in user_listings if l.status == "collected"])
                user_ai = len([l for l in user_listings if l.ai_optimized])
                
                impact_score = min(100, (
                    (user_success / len(user_listings)) * 30 +
                    (user_ai / len(user_listings)) * 30 +
                    min(user_quantity / 100, 1) * 40
                ))
                
                top_users.append({
                    "user_id": user.id,
                    "name": user.name,
                    "impact_score": impact_score,
                    "total_quantity": user_quantity,
                    "success_rate": (user_success / len(user_listings)) * 100
                })
        
        # Sort by impact score
        top_users.sort(key=lambda x: x["impact_score"], reverse=True)
        
        return {
            "total_users": total_users,
            "total_listings": total_listings,
            "total_quantity_kg": total_quantity,
            "total_meals_provided": total_meals_provided,
            "total_savings_rupees": total_savings,
            "active_listings": active_listings,
            "claimed_listings": claimed_listings,
            "collected_listings": collected_listings,
            "ai_optimization_rate": ai_optimization_rate,
            "platform_success_rate": platform_success_rate,
            "top_performing_users": top_users,
            "food_waste_reduction_kg": food_waste_reduction
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error calculating platform analytics: {str(e)}")

@router.get("/analytics/trends")
def get_analytics_trends(db: Session = Depends(get_db)):
    """Get trending analytics and recommendations."""
    try:
        all_listings = db.query(models.SurplusListing).all()
        
        # Calculate trends
        total_listings = len(all_listings)
        ai_optimized = len([l for l in all_listings if l.ai_optimized])
        collected = len([l for l in all_listings if l.status == "collected"])
        
        # Generate recommendations
        recommendations = []
        
        if ai_optimized / max(1, total_listings) < 0.5:
            recommendations.append("Consider using AI optimization more frequently to reduce waste")
        
        if collected / max(1, total_listings) < 0.7:
            recommendations.append("Improve listing descriptions and photos to increase claim rates")
        
        if total_listings < 10:
            recommendations.append("Create more listings to increase your impact on the community")
        
        # Calculate trends
        trends = {
            "ai_adoption_rate": (ai_optimized / max(1, total_listings)) * 100,
            "success_rate": (collected / max(1, total_listings)) * 100,
            "avg_listing_size": sum(l.quantity_kg for l in all_listings) / max(1, total_listings),
            "growth_rate": "increasing",  # Placeholder
            "peak_hours": [10, 14, 18],  # Placeholder
            "popular_food_types": ["Mixed", "Vegetables", "Grains"]  # Placeholder
        }
        
        return {
            "trends": trends,
            "recommendations": recommendations
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error calculating trends: {str(e)}")

@router.get("/analytics/ngo/{ngo_id}")
def get_ngo_analytics(ngo_id: int, db: Session = Depends(get_db)):
    """Get analytics specific to an NGO."""
    try:
        # Get all listings claimed by this NGO
        claimed_listings = db.query(models.SurplusListing).filter(
            models.SurplusListing.claimed_by_id == ngo_id
        ).all()
        
        # Get all listings collected by this NGO
        collected_listings = db.query(models.SurplusListing).filter(
            models.SurplusListing.claimed_by_id == ngo_id,
            models.SurplusListing.status == "collected"
        ).all()
        
        # Calculate metrics
        total_collections = len(collected_listings)
        total_quantity = sum(l.quantity_kg for l in collected_listings)
        total_meals_provided = total_quantity * 4  # 4 meals per kg
        active_claims = len([l for l in claimed_listings if l.status == "claimed"])
        completed_collections = len([l for l in claimed_listings if l.status == "collected"])
        
        avg_collection_size = total_quantity / max(1, total_collections)
        
        # Calculate impact score (0-100)
        impact_score = min(100, (
            (total_collections * 10) +  # 10 points per collection
            (total_quantity / 10) +     # 1 point per 10kg
            (completed_collections / max(1, len(claimed_listings)) * 30)  # Success rate weight
        ))
        
        # Calculate collection success rate
        collection_success_rate = (completed_collections / max(1, len(claimed_listings))) * 100
        
        # Estimate savings (₹10 per kg collected)
        total_savings = total_quantity * 10
        
        return {
            "total_collections": total_collections,
            "total_quantity_kg": total_quantity,
            "total_meals_provided": total_meals_provided,
            "active_claims": active_claims,
            "completed_collections": completed_collections,
            "avg_collection_size": avg_collection_size,
            "impact_score": impact_score,
            "total_savings_rupees": total_savings,
            "collection_success_rate": collection_success_rate
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error calculating NGO analytics: {str(e)}")

# Auth endpoints (register, login)
# Predictive shorting endpoint
# Surplus listing endpoints
# NGO endpoints
# Feedback endpoints

# These will be implemented in detail in their own modules or here as needed.
