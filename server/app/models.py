from .database import db
from datetime import datetime
from sqlalchemy import LargeBinary

class Team(db.Model):
    __tablename__ = 'teams'
    __table_args__ = {'schema': 'aardvark'}

    team_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    team_name = db.Column(db.String(45))
    captain_id = db.Column(db.Integer, nullable=False)
    university_id = db.Column(db.Integer, nullable=False)
    profile_image = db.Column(db.String(255))
    registration_date = db.Column(db.Date, default=datetime.utcnow)
    created_at = db.Column(db.Date, default=datetime.utcnow)
    updated_at = db.Column(db.Date, default=datetime.utcnow, onupdate=datetime.utcnow)
    status = db.Column(db.Integer, default=1)
    blacklisted = db.Column(db.Integer, default=0)
    description = db.Column(db.String(45)) # luke merge

class User(db.Model):
    __tablename__ = 'users'
    __table_args__ = {'schema': 'aardvark'}
    
    user_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    team_id = db.Column(db.Integer, db.ForeignKey('aardvark.teams.team_id'), nullable=False)
    username = db.Column(db.String(45), unique=True, nullable=False)
    first_name = db.Column(db.String(100))
    last_name = db.Column(db.String(100))
    email = db.Column(db.String(45), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=True)
    user_type = db.Column(db.String(45), nullable=False, default="regular")
    game_role = db.Column(db.String(45)) # luke merge
    profile_image = db.Column(db.String(255)) # luke merge
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.Date, default=datetime.utcnow, onupdate=datetime.utcnow)
    status = db.Column(db.Integer, default=1)
    blacklisted = db.Column(db.Integer, default=0)
    university_id = db.Column(db.Integer, db.ForeignKey('aardvark.universities.university_id'), nullable=True)
    team = db.relationship('Team', backref='members', lazy=True)
    
class TeamRequest(db.Model):
    __tablename__ = 'team_requests'
    __table_args__ = {'schema': 'aardvark'}
    request_id = db.Column(db.Integer, primary_key=True, autoincrement=True)  # Primary key
    user_id = db.Column(db.Integer, db.ForeignKey('aardvark.users.user_id'), nullable=False)  # Requesting user
    team_id = db.Column(db.Integer, db.ForeignKey('aardvark.teams.team_id'), nullable=False)  # Requested team
    status = db.Column(db.String(20), default='pending')  # Request status
    created_at = db.Column(db.DateTime, default=datetime.utcnow)  # Timestamp of request

class University(db.Model):
    __tablename__ = 'universities'
    __table_args__ = {'schema': 'aardvark'}

    university_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    university_name = db.Column(db.String(45))
    country = db.Column(db.String(45))
    status = db.Column(db.SmallInteger)
    description = db.Column(db.String(255))
    universitylink = db.Column(db.String(255))
    university_image = db.Column(db.String(255))    # change from binary
    image_mime_type = db.Column(db.String(255))  # store content-type like 'image/png'
    created_at = db.Column(db.Date, default=datetime.utcnow)
    updated_at = db.Column(db.Date, default=datetime.utcnow, onupdate=datetime.utcnow)

    tournymod_id = db.Column(
        db.Integer,
        db.ForeignKey('aardvark.users.user_id')  # schema-qualified FK
    )
    tournymod = db.relationship('User', foreign_keys=[tournymod_id])

    users = db.relationship(
        'User',
        backref='university',
        lazy=True,
        foreign_keys='User.university_id' 
    )

# luke merge v
class Tournament(db.Model):
    __tablename__ = 'tournaments'
    __table_args__ = {'schema': 'aardvark'}

    tournament_id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text)
    start_date = db.Column(db.Date, nullable=False)
    end_date = db.Column(db.Date, nullable=False)
    university_id = db.Column(db.Integer, db.ForeignKey('aardvark.universities.university_id'), nullable=False) 
    created_at = db.Column(db.Date, nullable=False)
# luke merge ^

# luke merge v
class Match(db.Model):
    __tablename__ = 'matches'
    __table_args__ = {'schema': 'aardvark'}
    
    match_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    tournament_id = db.Column(db.Integer, nullable=False)
    team1_id = db.Column(db.Integer, db.ForeignKey('aardvark.teams.team_id'), nullable=False)
    team2_id = db.Column(db.Integer, db.ForeignKey('aardvark.teams.team_id'), nullable=False)
    start_time = db.Column(db.Date)
    end_time = db.Column(db.Date)
    winner_id = db.Column(db.Integer, db.ForeignKey('aardvark.teams.team_id'))  # Winner team ID
    status = db.Column(db.SmallInteger, default=0)  # 0 = Not played, 1 = Completed
    score_team1 = db.Column(db.Integer, default=0)
    score_team2 = db.Column(db.Integer, default=0)
# luke merge ^ 

class BlacklistedToken(db.Model):
    __tablename__ = 'blacklisted_tokens'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    token = db.Column(db.String(500), nullable=False, unique=True)
    blacklisted_at = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f"<BlacklistedToken {self.token}>"


class Payment(db.Model):
    __tablename__ = 'payments'
    __table_args__ = {'schema': 'aardvark'}

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    email = db.Column(db.String(120), nullable=False)  # Stores user email
    amount = db.Column(db.Integer, nullable=False)  # Amount in cents
    currency = db.Column(db.String(10), default="usd", nullable=False)
    status = db.Column(db.String(50), nullable=False)  # "succeeded", "requires_payment_method"
    payment_intent_id = db.Column(db.String(120), unique=True, nullable=False)  # Stripe Payment Intent ID
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f"<Payment {self.email} - {self.status}>"

# models.py
class PendingRegistration(db.Model):
    __tablename__ = 'pending_registrations'
    __table_args__ = {'schema': 'aardvark'}

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, nullable=False)
    team_id = db.Column(db.Integer, default=0)
    username = db.Column(db.String(45))
    email = db.Column(db.String(45), unique=True)
    password_hash = db.Column(db.String(255))
    role = db.Column(db.String(45))
    university = db.Column(db.String(255))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    first_name = db.Column(db.String(100))
    last_name = db.Column(db.String(100))
    bio = db.Column(db.Text)
    profile_image = db.Column(db.String(255))

# models.py
class PendingTeamMember(db.Model):
    __tablename__ = 'pending_team_members'
    __table_args__ = {'schema': 'aardvark'}

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(100), nullable=False)  # Optional, or remove if pulling from User
    team_id = db.Column(db.Integer, db.ForeignKey('aardvark.teams.team_id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('aardvark.users.user_id'), nullable=False)
    game_role = db.Column(db.String(100))
    status = db.Column(db.String(50), default='pending')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    team = db.relationship("Team", backref="pending_members", lazy="joined")
    user = db.relationship("User", backref="pending_requests", lazy="joined")  # 👈 add this

class PendingTeamRegistration(db.Model):
    __tablename__ = 'pending_team_registrations'
    __table_args__ = {'schema': 'aardvark'}

    id = db.Column(db.Integer, primary_key=True)
    team_name = db.Column(db.String(45))
    captain_name = db.Column(db.String(100))
    captain_email = db.Column(db.String(100))
    university_id = db.Column(db.Integer, nullable=False)
    profile_image = db.Column(db.String(255))
    members = db.Column(db.JSON)  # list of emails
    status = db.Column(db.String(20), default='pending')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

