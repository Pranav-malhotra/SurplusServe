#!/usr/bin/env python3
"""
Simple script to check database tables and connection
Run this to diagnose database issues
"""

import os
import sys
from dotenv import load_dotenv

# Add backend to path
sys.path.append('backend')

try:
    from sqlalchemy import inspect, create_engine
    from backend.database import engine
    
    print("🔍 Checking database tables...")
    print("=" * 50)
    
    # Test connection
    try:
        with engine.connect() as conn:
            print("✅ Database connection successful!")
            
            # Get table inspector
            inspector = inspect(engine)
            tables = inspector.get_table_names()
            
            print(f"\n📊 Found {len(tables)} tables:")
            for table in tables:
                print(f"  - {table}")
            
            # Check expected tables
            expected_tables = ['users', 'events', 'surplus_listings', 'feedbacks']
            print(f"\n🎯 Expected tables: {expected_tables}")
            
            missing_tables = [table for table in expected_tables if table not in tables]
            if missing_tables:
                print(f"❌ Missing tables: {missing_tables}")
            else:
                print("✅ All expected tables found!")
            
            # Check table schemas
            print(f"\n🔍 Table details:")
            for table in expected_tables:
                if table in tables:
                    columns = inspector.get_columns(table)
                    print(f"  {table}: {len(columns)} columns")
                    for col in columns:
                        print(f"    - {col['name']}: {col['type']}")
                else:
                    print(f"  {table}: ❌ NOT FOUND")
                    
        except Exception as e:
            print(f"❌ Database connection failed: {e}")
            print(f"Error type: {type(e).__name__}")
            
except ImportError as e:
    print(f"❌ Import error: {e}")
    print("Make sure you're in the project root directory")
except Exception as e:
    print(f"❌ Unexpected error: {e}") 