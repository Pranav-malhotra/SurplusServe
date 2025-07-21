# SurplusServe Backend (FastAPI)

## Setup

1. **Create a virtual environment and activate it:**
   ```
   python -m venv venv
   venv\Scripts\activate  # On Windows
   source venv/bin/activate  # On Mac/Linux
   ```
2. **Install dependencies:**
   ```
   pip install -r ../requirements.txt
   ```
3. **Create a `.env` file in this directory:**
   Example:
   ```env
   DATABASE_URL=postgresql://user:password@localhost:5432/surplusserve
   SECRET_KEY=your_secret_key_here
   ```
4. **Run the server:**
   ```
   uvicorn backend.main:app --reload
   ```

## Project Structure
- `main.py`: FastAPI app entry point
- `database.py`: SQLAlchemy setup
- `config.py`: Environment/config management
- `models/`: SQLAlchemy models
- `schemas/`: Pydantic schemas
- `crud/`: CRUD logic
- `api/`: API route definitions

## Next Steps
- Implement authentication, predictive shorting, surplus management, and NGO endpoints. 