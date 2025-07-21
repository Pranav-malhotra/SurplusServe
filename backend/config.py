from pydantic_settings import BaseSettings
from dotenv import load_dotenv
import os

load_dotenv(os.path.join(os.path.dirname(__file__), ".env"))

class Settings(BaseSettings):
       DATABASE_URL: str
       SECRET_KEY: str
       ALGORITHM: str = "HS256"
       ACCESS_TOKEN_EXPIRE_MINUTES: int = 60

       class Config:
           env_file = ".env"

settings = Settings()