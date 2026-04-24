from flask import Blueprint, request, jsonify
from models import Question
from database import db

bulk = Blueprint("bulk", __name__)


@bulk.route("/bulk_add_questions", methods=["POST"])
def bulk_add_questions():

    data = request.json   # list of questions

    for q in data:
        question = Question(
            category=q["category"],
            topic=q["topic"],
            question=q["question"],
            option1=q["option1"],
            option2=q["option2"],
            option3=q["option3"],
            option4=q["option4"],
            answer=q["answer"],
            explanation=q["explanation"],
            difficulty=q["difficulty"]
        )

        db.session.add(question)

    db.session.commit()

    return jsonify({"message": "Bulk questions added successfully"})