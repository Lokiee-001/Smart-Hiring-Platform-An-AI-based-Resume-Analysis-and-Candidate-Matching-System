from flask import Blueprint, request, jsonify
from models import Question, Result
from database import db
import random

exam = Blueprint("exam", __name__)


# ---------------- GET RANDOM QUESTIONS ---------------- #

@exam.route("/start_exam/<category>", methods=["GET"])
def start_exam(category):

    questions = Question.query.filter_by(category=category).all()

    random.shuffle(questions)

    selected = questions[:30]   # 30 questions

    results = []

    for q in selected:
        results.append({
            "id": q.id,
            "question": q.question,
            "option1": q.option1,
            "option2": q.option2,
            "option3": q.option3,
            "option4": q.option4,
            "answer": q.answer   # needed for evaluation
        })

    return jsonify(results)


# ---------------- SUBMIT EXAM ---------------- #

@exam.route("/submit_exam", methods=["POST"])
def submit_exam():

    data = request.json

    student_id = data["student_id"]
    category = data["category"]
    answers = data["answers"]   # {question_id: selected_option}

    score = 0

    for q_id, ans in answers.items():
        q = Question.query.get(int(q_id))
        if q and q.answer == ans:
            score += 1

    total = len(answers)

    # check existing attempts
    existing = Result.query.filter_by(
        student_id=student_id,
        category=category
    ).first()

    if existing:
        existing.score = score
        existing.total = total
        existing.attempts += 1
    else:
        result = Result(
            student_id=student_id,
            category=category,
            score=score,
            total=total,
            attempts=1
        )
        db.session.add(result)

    db.session.commit()

    return jsonify({
        "score": score,
        "total": total
    })


# ---------------- DASHBOARD STATS ---------------- #

@exam.route("/dashboard_stats/<int:student_id>", methods=["GET"])
def dashboard_stats(student_id):

    results = Result.query.filter_by(student_id=student_id).all()

    total_exams = len(results)
    total_attempts = sum(r.attempts for r in results)

    avg_score = 0

    if total_exams > 0:
        avg_score = sum((r.score / r.total)*100 for r in results) / total_exams

    return jsonify({
        "total_exams": total_exams,
        "total_attempts": total_attempts,
        "average_score": round(avg_score, 2)
    })