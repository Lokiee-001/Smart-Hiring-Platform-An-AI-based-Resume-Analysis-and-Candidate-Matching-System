from flask import Flask
from flask_cors import CORS
from database import db

from auth_routes import auth
from student_routes import student
from recruiter_routes import recruiter
from resume_builder_routes import resume_builder
import os
from bulk_upload import bulk

from admin_routes import admin

from exam_routes import exam
from flask_mail import Mail, Message    

if not os.path.exists("uploads/profile_photos"):
    os.makedirs("uploads/profile_photos")
app = Flask(__name__)
CORS(app)

# ✅ ADD HERE (after app is created)
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = 'lamlokeshwar001@gmail.com'
app.config['MAIL_PASSWORD'] = 'ofqzkaoaxydigpjq'

mail = Mail()
mail.init_app(app)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///smart_hiring.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = 'secret123'

db.init_app(app)

app.register_blueprint(auth)
app.register_blueprint(student)
app.register_blueprint(recruiter)
app.register_blueprint(resume_builder)
app.register_blueprint(admin)
app.register_blueprint(bulk)
app.register_blueprint(exam)

with app.app_context():
    db.create_all()


@app.route("/")
def home():
    return {"message": "Smart Hiring Platform Backend Running"}


if __name__ == "__main__":
    app.run(debug=True)
