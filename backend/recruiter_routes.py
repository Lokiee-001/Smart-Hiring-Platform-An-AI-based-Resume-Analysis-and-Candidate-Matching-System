from flask import Blueprint, request, jsonify
from models import Job, Resume, Application
from database import db

from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity

recruiter = Blueprint("recruiter", __name__)

model = SentenceTransformer("all-MiniLM-L6-v2")


# ---------------- POST JOB ---------------- #

@recruiter.route("/post_job", methods=["POST"])
def post_job():

    data = request.json
    print(data)

    job = Job(
        title=data["title"],
        description=data["description"],
        skills=data["skills"],
        recruiter_email=data["recruiter_email"]   # ✅ FIXED
    )

    db.session.add(job)
    db.session.commit()

    return jsonify({"message": "Job posted"})


# ---------------- VIEW ALL JOBS ---------------- #

@recruiter.route("/all_jobs", methods=["GET"])
def all_jobs():

    jobs = Job.query.all()

    results = []

    for job in jobs:
        results.append({
            "job_id": job.id,
            "title": job.title,
            "skills": job.skills,
            "description": job.description
        })

    return jsonify(results)


# ---------------- MATCH CANDIDATES ---------------- #

@recruiter.route("/match_candidates/<int:job_id>")
def match_candidates(job_id):

    job = Job.query.get(job_id)

    if not job:
        return jsonify({"error": "Job not found"}), 404

    resumes = Resume.query.all()
    results = []

    job_text = job.description + " " + job.skills
    job_embedding = model.encode([job_text])

    for resume in resumes:

        resume_embedding = model.encode([resume.resume_text])

        similarity = cosine_similarity(job_embedding, resume_embedding)[0][0]
        score = float(round(similarity * 100, 2))

        results.append({
            "student_id": int(resume.user_id),
            "skills": resume.skills,
            "match_score": score
        })

    results = sorted(results, key=lambda x: x["match_score"], reverse=True)

    return jsonify(results)


# ---------------- VIEW APPLICANTS ---------------- #

@recruiter.route("/applicants/<int:job_id>")
def applicants(job_id):

    apps = Application.query.filter_by(job_id=job_id).all()

    results = []

    for app in apps:
        results.append({
            "student_id": app.student_id,
            "match_score": app.match_score
        })

    return jsonify(results)


# ---------------- OPTIONAL: ELIGIBILITY CHECK ---------------- #

def check_eligibility(profile, job):

    if job.required_degree and profile.degree != job.required_degree:
        return False

    if job.min_degree_percent and profile.degree_percent < job.min_degree_percent:
        return False

    return True