import os
from dotenv import load_dotenv

# Explicitly set the path to `.env`
dotenv_path = os.path.join(os.path.dirname(__file__), '.env')
load_dotenv(dotenv_path)  # This forces Flask to load `.env`

class Config:
    SQLALCHEMY_DATABASE_URI = os.getenv('SQLALCHEMY_DATABASE_URI') 
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECRET_KEY = os.getenv('SECRET_KEY') 
    GOOGLE_CLIENT_ID = os.getenv('GOOGLE_CLIENT_ID')
