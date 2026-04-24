from flask import Blueprint, request, jsonify
from models import Question, Topic, User, Resume, Application, Result
from database import db
from models import StudentProfile

admin = Blueprint("admin", __name__)


# ================= TOPIC SYSTEM ================= #

# -------- ADD TOPIC -------- #
@admin.route("/add_topic", methods=["POST"])
def add_topic():

    data = request.json

    topic = Topic(
        name=data["name"],
        category=data["category"]
    )

    db.session.add(topic)
    db.session.commit()

    return jsonify({"message": "Topic added successfully"})


# -------- GET TOPICS -------- #
@admin.route("/get_topics/<category>", methods=["GET"])
def get_topics(category):

    topics = Topic.query.filter_by(category=category).all()

    result = []
    for t in topics:
        result.append({
            "id": t.id,
            "name": t.name
        })

    return jsonify(result)


# ================= QUESTION SYSTEM ================= #

# -------- ADD QUESTION -------- #
@admin.route("/add_question", methods=["POST"])
def add_question():

    data = request.json

    question = Question(
        category=data["category"],
        topic_id=data["topic_id"],
        question=data["question"],
        option1=data["option1"],
        option2=data["option2"],
        option3=data["option3"],
        option4=data["option4"],
        answer=data["answer"],
        explanation=data["explanation"],
        difficulty=data["difficulty"]
    )

    db.session.add(question)
    db.session.commit()

    return jsonify({"message": "Question added successfully"})


# -------- GET QUESTIONS BY TOPIC -------- #
@admin.route("/get_questions/<int:topic_id>", methods=["GET"])
def get_questions(topic_id):

    questions = Question.query.filter_by(topic_id=topic_id).limit(30).all()

    results = []

    for q in questions:
        results.append({
            "id": q.id,
            "question": q.question,
            "option1": q.option1,
            "option2": q.option2,
            "option3": q.option3,
            "option4": q.option4,
            "answer": q.answer,
            "explanation": q.explanation,
            "difficulty": q.difficulty
        })

    return jsonify(results)


# -------- DELETE QUESTION -------- #
@admin.route("/delete_question/<int:id>", methods=["DELETE"])
def delete_question(id):

    q = Question.query.get(id)

    if q:
        db.session.delete(q)
        db.session.commit()

    return jsonify({"message": "Question deleted"})


# -------- UPDATE QUESTION -------- #
@admin.route("/update_question/<int:id>", methods=["PUT"])
def update_question(id):

    data = request.json

    q = Question.query.get(id)

    if q:
        q.question = data["question"]
        q.option1 = data["option1"]
        q.option2 = data["option2"]
        q.option3 = data["option3"]
        q.option4 = data["option4"]
        q.answer = data["answer"]
        q.explanation = data["explanation"]
        q.difficulty = data["difficulty"]

        db.session.commit()

    return jsonify({"message": "Question updated"})


# ================= EXAM SYSTEM ================= #

# -------- GET RANDOM QUESTIONS -------- #
@admin.route("/get_exam_questions/<category>", methods=["GET"])
def get_exam_questions(category):

    questions = Question.query.filter_by(category=category).all()

    import random
    random.shuffle(questions)

    selected = questions[:30]

    results = []

    for q in selected:
        results.append({
            "id": q.id,
            "question": q.question,
            "option1": q.option1,
            "option2": q.option2,
            "option3": q.option3,
            "option4": q.option4
        })

    return jsonify(results)


# ================= RECRUITER FEATURES ================= #

# -------- GET ALL USERS -------- #
@admin.route("/all_users", methods=["GET"])
def all_users():

    users = User.query.all()

    result = []

    for u in users:
        result.append({
            "id": u.id,
            "username": u.username,
            "email": u.email,
            "role": u.role
        })

    return jsonify(result)


# -------- GET CANDIDATE DETAILS -------- #
@admin.route("/candidate_details", methods=["GET"])
def candidate_details():

    resumes = Resume.query.all()
    results = Result.query.all()
    applications = Application.query.all()

    data = []

    for r in resumes:

        user = User.query.get(r.user_id)

        exam = next(
            (res for res in results if res.student_id == r.user_id),
            None
        )

        applied_jobs = [
            a.job_id for a in applications if a.student_id == r.user_id
        ]

        data.append({
            "name": user.username if user else "N/A",
            "ats": r.ats_score,
            "exam_score": exam.score if exam else 0,
            "applied_jobs": applied_jobs
        })

    return jsonify(data)




@admin.route("/all_participants", methods=["GET"])
def all_participants():

    profiles = StudentProfile.query.all()

    data = []

    for p in profiles:
        data.append({
            "id": p.user_id,
            "name": p.full_name,
            "degree": p.degree,
            "percent": p.degree_percent
        })

    return jsonify(data)


@admin.route("/participant/<int:user_id>", methods=["GET"])
def participant_details(user_id):

    p = StudentProfile.query.filter_by(user_id=user_id).first()

    return jsonify({
        "name": p.full_name,
        "phone": p.phone,
        "location": p.location,
        "10th": p.tenth_percent,
        "12th": p.twelfth_percent,
        "degree": p.degree,
        "skills": p.skills,
        "linkedin": p.linkedin,
        "github": p.github,
        "activities": p.activities
    })