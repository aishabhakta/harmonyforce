from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_bcrypt import Bcrypt 

# Initialize database and bcrypt
db = SQLAlchemy()
migrate = Migrate()
bcrypt = Bcrypt() 
