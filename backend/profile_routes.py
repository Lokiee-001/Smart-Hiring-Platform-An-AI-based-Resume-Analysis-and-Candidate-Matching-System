from flask import Blueprint, request, jsonify
from models import StudentProfile
from database import db

profile = Blueprint("profile", __name__)


# CREATE / UPDATE PROFILE
@profile.route("/save_profile", methods=["POST"])
def save_profile():

    data = request.json

    profile = StudentProfile.query.filter_by(user_id=data["user_id"]).first()

    if not profile:
        profile = StudentProfile(user_id=data["user_id"])
        db.session.add(profile)

    profile.full_name = data["full_name"]
    profile.phone = data["phone"]
    profile.location = data["location"]

    profile.tenth_percent = data["tenth_percent"]
    profile.tenth_board = data["tenth_board"]

    profile.twelfth_percent = data["twelfth_percent"]
    profile.twelfth_board = data["twelfth_board"]

    profile.degree = data["degree"]
    profile.degree_percent = data["degree_percent"]

    profile.skills = data["skills"]
    profile.linkedin = data["linkedin"]
    profile.github = data["github"]

    profile.activities = data["activities"]

    db.session.commit()

    return jsonify({"message": "Profile saved"})