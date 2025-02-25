from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:adminpass@localhost/postgres'
CORS(app)
db = SQLAlchemy(app)

# Define University model
class University(db.Model):
    __tablename__ = 'universities'
    __table_args__ = {'schema': 'aardvark'}
    university_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    university_name = db.Column(db.String(45))
    description = db.Column(db.String(255))
    university_image = db.Column(db.String(255))
    created_at = db.Column(db.Date, default=datetime.utcnow)

# Define Team model
class Team(db.Model):
    __tablename__ = 'teams'
    __table_args__ = {'schema': 'aardvark'}
    team_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    team_name = db.Column(db.String(45))
    university_id = db.Column(db.Integer, db.ForeignKey('aardvark.universities.university_id'))
    profile_image = db.Column(db.String(255))
    created_at = db.Column(db.Date, default=datetime.utcnow)

# Function to register a university
@app.route('/university/register', methods=['POST'])
def register_university():
    data = request.get_json()
    new_university = University(
        university_name=data['university_name'],
        description=data.get('description', ''),
        university_image=data.get('university_image', ''),
        created_at=datetime.utcnow()
    )
    db.session.add(new_university)
    db.session.commit()
    return jsonify({"message": "University registered successfully!"}), 201

# Function to update university details
@app.route('/university/update', methods=['POST'])
def update_university():
    data = request.get_json()
    university = University.query.get(data['university_id'])
    if not university:
        return jsonify({"error": "University not found"}), 404
    university.university_name = data.get('university_name', university.university_name)
    university.description = data.get('description', university.description)
    university.university_image = data.get('university_image', university.university_image)
    db.session.commit()
    return jsonify({"message": "University updated successfully!"}), 200

# Function to get all teams for a given university
@app.route('/university/<int:university_id>/teams', methods=['GET'])
def get_university_teams(university_id):
    teams = Team.query.filter_by(university_id=university_id).all()
    teams_data = [{
        "team_id": team.team_id,
        "team_name": team.team_name,
        "profile_image": team.profile_image
    } for team in teams]
    return jsonify(teams_data), 200

if __name__ == '__main__':
    app.run(debug=True)
