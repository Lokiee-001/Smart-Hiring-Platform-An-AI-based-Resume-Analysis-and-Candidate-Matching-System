from flask import Blueprint, request, jsonify
from models import Resume, Job, Application
from database import db
import pdfplumber
import spacy

from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity

student = Blueprint("student", __name__)

nlp = spacy.load("en_core_web_sm")
model = SentenceTransformer("all-MiniLM-L6-v2")

skills_db = [
    "python","java","react","sql","machine learning",
    "data analysis","flask","django","html","css",
    "javascript","tensorflow","pandas","numpy"
]


# ---------------- RESUME FUNCTIONS ---------------- #

def extract_text(file):
    text = ""
    with pdfplumber.open(file) as pdf:
        for page in pdf.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text
    return text


def extract_skills(text):
    found_skills = []
    doc = nlp(text.lower())

    for token in doc:
        if token.text in skills_db:
            found_skills.append(token.text)

    return list(set(found_skills))


def calculate_ats(skills):
    return min(len(skills) * 10, 100)


# ---------------- ATS + RESUME ---------------- #

@student.route("/upload_resume", methods=["POST"])
def upload_resume():

    user_id = request.form["user_id"]
    file = request.files["resume"]

    text = extract_text(file)
    skills = extract_skills(text)
    ats_score = calculate_ats(skills)

    suggested_skills = [s for s in skills_db if s not in skills]

    resume = Resume(
        user_id=user_id,
        resume_text=text,
        skills=",".join(skills),
        ats_score=ats_score
    )

    db.session.add(resume)
    db.session.commit()

    return jsonify({
        "skills": skills,
        "ats_score": ats_score,
        "suggested_skills": suggested_skills
    })


# ---------------- JOB RECOMMENDATION ---------------- #

@student.route("/recommended_jobs/<student_id>")
def recommended_jobs(student_id):

    resume = Resume.query.filter_by(
        user_id=student_id
    ).first()

    # ⭐ IMPORTANT FIX
    if not resume:
        return jsonify([])

    jobs = Job.query.all()

    if not jobs:
        return jsonify([])

    results=[]

    try:

        resume_embedding = model.encode(
            [resume.resume_text]
        )

        for job in jobs:

            job_text = (
                (job.description or "") +
                " " +
                (job.skills or "")
            )

            job_embedding = model.encode(
                [job_text]
            )

            similarity = cosine_similarity(
                resume_embedding,
                job_embedding
            )[0][0]


            results.append({
                "job_id":job.id,
                "title":job.title,
                "skills":job.skills or "",
                "match_score":
                    float(
                        round(
                            similarity*100,
                            2
                        )
                    )
            })

        results=sorted(
            results,
            key=lambda x:x["match_score"],
            reverse=True
        )

        return jsonify(results)

    except Exception as e:

        print("Recommended jobs error:",e)

        return jsonify([])
    
# ---------------- APPLY JOB ---------------- #

@student.route("/apply", methods=["POST"])
def apply_job():

    data = request.json

    student_id = data.get("student_id")
    job_id = data.get("job_id")
    match_score = data.get("match_score", 0)

    # 🔴 CHECK DUPLICATE
    existing = Application.query.filter_by(
        student_id=student_id,
        job_id=job_id
    ).first()

    if existing:
        return jsonify({"message": "Already Applied"}), 200

    # ✅ SAVE
    new_app = Application(
        student_id=student_id,
        job_id=job_id,
        match_score=match_score
    )

    db.session.add(new_app)
    db.session.commit()

    # ---------------- MAIL SECTION ---------------- #
    from flask import current_app
    from flask_mail import Message

    mail = current_app.extensions['mail']
    job = Job.query.get(job_id)

    print("MAIL STEP STARTED")
    print("JOB:", job)
    print("EMAIL:", job.recruiter_email if job else "NO JOB")

    if job and job.recruiter_email:
        try:
            msg = Message(
                subject="New Job Application",
                sender=current_app.config['MAIL_USERNAME'],
                recipients=[job.recruiter_email]
            )

            msg.body = f"""
A student has applied for your job.

Job Title: {job.title}
Student ID: {student_id}
Match Score: {match_score}
"""

            mail.send(msg)
            print("MAIL SENT SUCCESSFULLY")

        except Exception as e:
            print("MAIL ERROR:", e)

    else:
        print("NO EMAIL FOUND")

    return jsonify({"message": "Applied Successfully"})

@student.route("/applied_jobs/<int:student_id>")
def applied_jobs(student_id):

    apps = Application.query.filter_by(student_id=student_id).all()

    results = []

    for app in apps:
        job = Job.query.get(app.job_id)
        if job:
            results.append({
                "job_id": job.id,
                "title": job.title,
                "skills": job.skills,
                "match_score": float(app.match_score)
            })

    return jsonify(results)


# ---------------- ADVANCED ROADMAP (5+ LAYERS) ---------------- #
@student.route("/roadmap/<role>")
def roadmap(role):

    data = {

        "ai": [
            {"title":"Python","topics":["Variables","Loops","Functions","OOP"],
             "links":["https://www.w3schools.com/python/"]},

            {"title":"Data Structures","topics":["Arrays","Stack","Queue","Trees"],
             "links":["https://www.geeksforgeeks.org/data-structures/"]},

            {"title":"Math","topics":["Linear Algebra","Statistics"],
             "links":["https://www.khanacademy.org/math"]},

            {"title":"ML","topics":["Regression","Classification"],
             "links":["https://scikit-learn.org/"]},

            {"title":"DL","topics":["CNN","RNN"],
             "links":["https://www.tensorflow.org/"]},

            {"title":"Projects","topics":["Build AI Apps"],
             "links":["https://github.com/"]}
        ],

        "frontend": [
            {"title":"HTML","topics":["Tags","Forms"],"links":["https://www.w3schools.com/html/"]},
            {"title":"CSS","topics":["Flexbox","Grid"],"links":["https://www.w3schools.com/css/"]},
            {"title":"JavaScript","topics":["DOM","Events"],"links":["https://www.geeksforgeeks.org/javascript/"]},
            {"title":"React","topics":["Hooks","Routing"],"links":["https://react.dev/"]},
            {"title":"Projects","topics":["Portfolio"],"links":["https://github.com/"]}
        ],

        "backend": [
            {"title":"Python/Node","topics":["Basics","OOP"],"links":["https://www.w3schools.com/"]},
            {"title":"DB","topics":["SQL","Joins"],"links":["https://www.geeksforgeeks.org/sql/"]},
            {"title":"API","topics":["REST","JSON"],"links":["https://developer.mozilla.org/"]},
            {"title":"Framework","topics":["Flask","Django"],"links":["https://flask.palletsprojects.com/"]},
            {"title":"Deploy","topics":["Hosting"],"links":["https://render.com/"]}
        ],

        "fullstack": [
            {"title":"Frontend","topics":["HTML","CSS","JS"],"links":["https://www.w3schools.com/"]},
            {"title":"Backend","topics":["Node","Flask"],"links":["https://nodejs.org/"]},
            {"title":"DB","topics":["SQL","MongoDB"],"links":["https://www.mongodb.com/"]},
            {"title":"Auth","topics":["JWT"],"links":["https://jwt.io/"]},
            {"title":"Deploy","topics":["Cloud"],"links":["https://render.com/"]}
        ],

        "data_science": [
            {"title":"Python","topics":["NumPy","Pandas"],"links":["https://pandas.pydata.org/"]},
            {"title":"Visualization","topics":["Matplotlib"],"links":["https://matplotlib.org/"]},
            {"title":"ML","topics":["Regression"],"links":["https://scikit-learn.org/"]},
            {"title":"Projects","topics":["Analysis"],"links":["https://kaggle.com/"]}
        ],

        "cybersecurity": [
            {"title":"Networking","topics":["TCP/IP"],"links":["https://www.geeksforgeeks.org/"]},
            {"title":"Linux","topics":["Commands"],"links":["https://linux.org/"]},
            {"title":"Security","topics":["Encryption"],"links":["https://owasp.org/"]},
            {"title":"Tools","topics":["Kali"],"links":["https://kali.org/"]}
        ]

    }

    return jsonify(data.get(role, []))
