from database import db


# ---------------- USER ---------------- #

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(100))
    email = db.Column(db.String(100), unique=True)
    password = db.Column(db.String(100))
    role = db.Column(db.String(50))


# ---------------- RESUME (OLD ATS) ---------------- #

class Resume(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer)
    resume_text = db.Column(db.Text)
    skills = db.Column(db.Text)
    ats_score = db.Column(db.Integer)


# ---------------- JOB ---------------- #

class Job(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200))
    description = db.Column(db.Text)
    skills = db.Column(db.Text)
    recruiter_email = db.Column(db.String(120))

# ---------------- APPLICATION ---------------- #

class Application(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer)
    job_id = db.Column(db.Integer)
    match_score = db.Column(db.Float)


# ================= RESUME BUILDER ================= #

class ResumeProfile(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer)

    first_name = db.Column(db.String(100))
    last_name = db.Column(db.String(100))
    email = db.Column(db.String(100))
    phone = db.Column(db.String(20))

    linkedin = db.Column(db.String(200))
    github = db.Column(db.String(200))

    objective = db.Column(db.Text)
    profile_pic = db.Column(db.String(200))


class Education(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    resume_id = db.Column(db.Integer)

    degree = db.Column(db.String(200))
    college = db.Column(db.String(200))
    percentage = db.Column(db.String(50))


class Project(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    resume_id = db.Column(db.Integer)

    title = db.Column(db.String(200))
    description = db.Column(db.Text)
    tech = db.Column(db.String(200))
    link = db.Column(db.String(200))


class Skill(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    resume_id = db.Column(db.Integer)

    name = db.Column(db.String(100))


class Activity(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    resume_id = db.Column(db.Integer)

    description = db.Column(db.Text)


# ================= APTITUDE SYSTEM ================= #

class Question(db.Model):
    id = db.Column(db.Integer, primary_key=True)

    category = db.Column(db.String(50))
    topic_id = db.Column(db.Integer)

    question = db.Column(db.Text)

    option1 = db.Column(db.String(200))
    option2 = db.Column(db.String(200))
    option3 = db.Column(db.String(200))
    option4 = db.Column(db.String(200))

    answer = db.Column(db.String(200))
    explanation = db.Column(db.Text)

    difficulty = db.Column(db.String(20))


class Exam(db.Model):
    id = db.Column(db.Integer, primary_key=True)

    name = db.Column(db.String(200))
    category = db.Column(db.String(50))

    time_limit = db.Column(db.Integer)
    total_questions = db.Column(db.Integer)


class ExamQuestion(db.Model):
    id = db.Column(db.Integer, primary_key=True)

    exam_id = db.Column(db.Integer)
    question_id = db.Column(db.Integer)


class Result(db.Model):
    id = db.Column(db.Integer, primary_key=True)

    student_id = db.Column(db.Integer)
    category = db.Column(db.String(50))   # aptitude / verbal

    score = db.Column(db.Integer)
    total = db.Column(db.Integer)

    attempts = db.Column(db.Integer)   # track attempts

class Topic(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100))
    category = db.Column(db.String(50))  # aptitude / verbal

class StudentProfile(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer)

    full_name = db.Column(db.String(200))
    phone = db.Column(db.String(20))
    location = db.Column(db.String(200))

    # Education
    tenth_percent = db.Column(db.Float)
    tenth_board = db.Column(db.String(50))

    twelfth_percent = db.Column(db.Float)
    twelfth_board = db.Column(db.String(50))

    degree = db.Column(db.String(100))
    degree_percent = db.Column(db.Float)

    # Skills & Links
    skills = db.Column(db.Text)
    linkedin = db.Column(db.String(200))
    github = db.Column(db.String(200))

    # Extra
    activities = db.Column(db.Text)
