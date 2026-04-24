from flask import Blueprint, request, jsonify
from models import User
from database import db

auth = Blueprint("auth", __name__)


# ---------------- REGISTER ---------------- #

@auth.route("/register", methods=["POST"])
def register():

    data = request.json

    user = User(
        username=data["username"],
        email=data["email"],
        password=data["password"],
        role=data["role"]
    )

    db.session.add(user)
    db.session.commit()

    return jsonify({"message": "User registered successfully"})


# ---------------- LOGIN ---------------- #

@auth.route("/login", methods=["POST"])
def login():

    data = request.json

    user = User.query.filter_by(email=data["email"]).first()

    if user and user.password == data["password"]:
        return jsonify({
        "role": user.role,
        "email": user.email,      # ⭐ ADD THIS
        "user_id": user.id        # ⭐ ALSO ADD THIS (needed later)
   })

    return jsonify({"message": "Invalid credentials"}), 401