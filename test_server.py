import sys
import os
sys.path.append('backend')

try:
    from backend.main import app
    print("✅ App imported successfully")
    
    import uvicorn
    print("✅ Uvicorn imported successfully")
    
    print("🚀 Starting server...")
    uvicorn.run(app, host="0.0.0.0", port=8000)
    
except Exception as e:
    print(f"❌ Error: {e}")
    import traceback
    traceback.print_exc() 