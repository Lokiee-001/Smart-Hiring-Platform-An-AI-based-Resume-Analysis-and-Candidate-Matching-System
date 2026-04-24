from flask import Blueprint, request, jsonify, send_file
from models import ResumeProfile, Education, Project, Skill, Activity
from database import db
from resume_generator import generate_resume
import os
from werkzeug.utils import secure_filename


resume_builder = Blueprint("resume_builder", __name__)

UPLOAD_FOLDER = "uploads/profile_photos"


@resume_builder.route("/save_resume_profile", methods=["POST"])
def save_resume_profile():

    data = request.json

    profile = ResumeProfile(

        user_id=data["user_id"],
        first_name=data["first_name"],
        last_name=data["last_name"],
        email=data["email"],
        phone=data["phone"],
        linkedin=data.get("linkedin"),
        github=data.get("github"),
        objective=data["objective"]

    )

    db.session.add(profile)
    db.session.commit()

    return jsonify({"resume_id":profile.id})


@resume_builder.route("/upload_profile_photo", methods=["POST"])
def upload_profile_photo():

    resume_id = request.form["resume_id"]
    file = request.files["photo"]

    filename = secure_filename(file.filename)
    path = os.path.join(UPLOAD_FOLDER, filename)

    file.save(path)

    profile = ResumeProfile.query.get(resume_id)
    profile.profile_photo = path

    db.session.commit()

    return jsonify({"message":"photo uploaded"})


@resume_builder.route("/add_education", methods=["POST"])
def add_education():

    data = request.json

    edu = Education(

        resume_id=data["resume_id"],
        level=data["level"],
        institution=data["institution"],
        percentage=data["percentage"],
        year=data["year"]

    )

    db.session.add(edu)
    db.session.commit()

    return jsonify({"message":"education added"})


@resume_builder.route("/add_project", methods=["POST"])
def add_project():

    data = request.json

    proj = Project(

        resume_id=data["resume_id"],
        project_name=data["project_name"],
        description=data["description"],
        technologies=data["technologies"],
        project_link=data.get("project_link")

    )

    db.session.add(proj)
    db.session.commit()

    return jsonify({"message":"project added"})


@resume_builder.route("/preview_resume/<int:resume_id>", methods=["GET"])
def preview_resume(resume_id):

    profile = ResumeProfile.query.get(resume_id)
    education = Education.query.filter_by(resume_id=resume_id).all()
    projects = Project.query.filter_by(resume_id=resume_id).all()
    skills = Skill.query.filter_by(resume_id=resume_id).all()
    activities = Activity.query.filter_by(resume_id=resume_id).all()

    return jsonify({

        "profile":{
            "name":profile.first_name + " " + profile.last_name,
            "email":profile.email,
            "phone":profile.phone,
            "linkedin":profile.linkedin,
            "github":profile.github,
            "objective":profile.objective
        },

        "education":[
            {
                "level":e.level,
                "institution":e.institution,
                "percentage":e.percentage,
                "year":e.year
            }
            for e in education
        ],

        "projects":[
            {
                "name":p.project_name,
                "description":p.description,
                "technologies":p.technologies
            }
            for p in projects
        ],

        "skills":[s.skill for s in skills],

        "activities":[a.activity for a in activities]

    })
@resume_builder.route("/generate_resume/<int:resume_id>/<int:template>", methods=["GET"])
def generate_resume_pdf(resume_id,template):

    path = generate_resume(resume_id,template)

    return send_file(path, as_attachment=True)
@resume_builder.route("/add_skill", methods=["POST"])
def add_skill():

    data = request.json

    skill = Skill(

        resume_id=data["resume_id"],
        skill=data["skill"]

    )

    db.session.add(skill)
    db.session.commit()

    return jsonify({"message":"skill added"})


@resume_builder.route("/add_activity", methods=["POST"])
def add_activity():

    data = request.json

    act = Activity(

        resume_id=data["resume_id"],
        activity=data["activity"]

    )

    db.session.add(act)
    db.session.commit()

    return jsonify({"message":"activity added"})


