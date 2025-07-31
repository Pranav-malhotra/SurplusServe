from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="SurplusServe Backend")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "SurplusServe Backend is running!"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}

@app.post("/predictive-shorting")
def predictive_shorting():
    return {
        "predicted_wastage_kg": 5.0,
        "suggested_shorting_kg": 4.0,
        "ai_suggestion": "Test suggestion",
        "estimated_savings_rupees": 400.0,
        "risk_level": "Low"
    }

if __name__ == "__main__":
    import uvicorn
    print("🚀 Starting minimal backend...")
    uvicorn.run(app, host="127.0.0.1", port=8000) 