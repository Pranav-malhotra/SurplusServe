#!/usr/bin/env python3
"""
Simple script to start the SurplusServe backend server
"""
import sys
import os
import uvicorn
from pathlib import Path

# Add the project root to Python path
project_root = Path(__file__).parent
sys.path.insert(0, str(project_root))

def main():
    try:
        print("🚀 Starting SurplusServe Backend...")
        print(f"📁 Project root: {project_root}")
        print(f"🐍 Python path: {sys.path[0]}")
        
        # Import the app
        from backend.main import app
        print("✅ App imported successfully!")
        
        # Start the server
        print("🌐 Starting server on http://127.0.0.1:8000")
        uvicorn.run(
            "backend.main:app",
            host="127.0.0.1",
            port=8000,
            reload=True,
            log_level="info"
        )
        
    except ImportError as e:
        print(f"❌ Import Error: {e}")
        print("💡 Make sure all dependencies are installed:")
        print("   pip install fastapi uvicorn sqlalchemy mysql-connector-python python-multipart python-jose passlib bcrypt pandas scikit-learn joblib")
        return 1
        
    except Exception as e:
        print(f"❌ Error starting server: {e}")
        import traceback
        traceback.print_exc()
        return 1

if __name__ == "__main__":
    exit(main()) 