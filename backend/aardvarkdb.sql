-- PostgreSQL Script
-- Luke Doherty

-- Schema creation
CREATE SCHEMA IF NOT EXISTS aardvark;
SET search_path TO aardvark;

-- Table: teams
CREATE TABLE IF NOT EXISTS teams (
  team_id SERIAL NOT NULL,
  team_name VARCHAR(45),
  captain_id INT NOT NULL,
  registration_date DATE,
  status SMALLINT,
  blacklisted SMALLINT,
  profile_image VARCHAR(255),
  created_at DATE,
  updated_at DATE,
  university_id INT NOT NULL,
  PRIMARY KEY (team_id)
);

-- Table: permissions
CREATE TABLE IF NOT EXISTS permissions (
  permission_id SERIAL NOT NULL,
  role_name VARCHAR(45),
  description VARCHAR(45),
  PRIMARY KEY (permission_id)
);

-- Table: userroles
CREATE TABLE IF NOT EXISTS userroles (
  user_role_id SERIAL NOT NULL,
  user_id INT NOT NULL,
  role_id INT NOT NULL,
  PRIMARY KEY (user_role_id)
);

-- Table: notifications
CREATE TABLE IF NOT EXISTS notifications (
  notification_id SERIAL NOT NULL,
  user_id INT NOT NULL,
  title VARCHAR(45),
  content VARCHAR(45),
  sent_at DATE,
  status SMALLINT,
  PRIMARY KEY (notification_id)
);

-- Table: reports
CREATE TABLE IF NOT EXISTS reports (
  report_id SERIAL NOT NULL,
  report_name VARCHAR(45),
  generation_date DATE,
  report_type VARCHAR(45),
  created_by INT NOT NULL,
  content TEXT,
  PRIMARY KEY (report_id)
);

-- Table: tournaments
CREATE TABLE IF NOT EXISTS tournaments (
  tournament_id SERIAL NOT NULL,
  name VARCHAR(45),
  description VARCHAR(255),
  start_date DATE,
  end_date DATE,
  location VARCHAR(45),
  status SMALLINT,
  created_at DATE,
  updated_at DATE,
  university_id INT NOT NULL,
  PRIMARY KEY (tournament_id)
);

-- Table: universities
CREATE TABLE IF NOT EXISTS universities (
  university_id SERIAL NOT NULL,
  universityname VARCHAR(45),
  description VARCHAR(45),
  university_image VARCHAR(255),
  status SMALLINT,
  created_at DATE,
  updated_at DATE,
  PRIMARY KEY (university_id)
  -- potentially : universitylink
);

-- Table: users
CREATE TABLE IF NOT EXISTS users (
  user_id SERIAL NOT NULL,
  team_id INT NOT NULL,
  username VARCHAR(45),
  password_hash VARCHAR(45),
  email VARCHAR(45),
  user_type VARCHAR(45),
  created_at DATE,
  updated_at DATE,
  status SMALLINT,
  blacklisted SMALLINT,
  university_id INT,
  PRIMARY KEY (user_id)
);

-- Table: tournamentparticipation
CREATE TABLE IF NOT EXISTS tournamentparticipation (
  participation_id SERIAL NOT NULL,
  tournament_id INT NOT NULL,
  team_id INT NOT NULL,
  registration_date DATE,
  status SMALLINT,
  PRIMARY KEY (participation_id)
);

-- Table: matches
CREATE TABLE IF NOT EXISTS matches (
  match_id SERIAL NOT NULL,
  tournament_id INT NOT NULL,
  team1_id INT NOT NULL,
  team2_id INT NOT NULL,
  start_time DATE,
  end_time DATE,
  winner_id INT,
  status SMALLINT,
  score_team1 INT,
  score_team2 INT,
  PRIMARY KEY (match_id)
);

-- Table: payments
CREATE TABLE IF NOT EXISTS payments (
  payment_id SERIAL NOT NULL,
  user_id INT NOT NULL,
  amount DOUBLE PRECISION,
  payment_date DATE,
  status SMALLINT,
  payment_method VARCHAR(45),
  PRIMARY KEY (payment_id)
);

-- Table: team_requests
CREATE TABLE IF NOT EXISTS team_requests (
  request_id SERIAL PRIMARY KEY,
  user_id INT NOT NULL,
  team_id INT NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',  -- 'pending', 'approved', 'denied'
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Adding foreign key constraints
ALTER TABLE teams
  ADD CONSTRAINT fk_teams_users FOREIGN KEY (captain_id) REFERENCES users (user_id) ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE userroles
  ADD CONSTRAINT fk_userroles_permissions FOREIGN KEY (role_id) REFERENCES permissions (permission_id) ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE tournamentparticipation
  ADD CONSTRAINT fk_tournamentparticipation_tournaments FOREIGN KEY (tournament_id) REFERENCES tournaments (tournament_id) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT fk_tournamentparticipation_teams FOREIGN KEY (team_id) REFERENCES teams (team_id) ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE matches
  ADD CONSTRAINT fk_matches_tournaments FOREIGN KEY (tournament_id) REFERENCES tournaments (tournament_id) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT fk_matches_team1 FOREIGN KEY (team1_id) REFERENCES teams (team_id) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT fk_matches_team2 FOREIGN KEY (team2_id) REFERENCES teams (team_id) ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE users
  ADD CONSTRAINT fk_users_teams FOREIGN KEY (team_id) REFERENCES teams (team_id) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT fk_users_universities FOREIGN KEY (university_id) REFERENCES universities (university_id) ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE payments
  ADD CONSTRAINT fk_payments_users FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE NO ACTION ON UPDATE NO ACTION;
