from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
import os

from models import ResumeProfile, Education, Project, Skill, Activity


def generate_resume(resume_id, template=1):

    profile = ResumeProfile.query.get(resume_id)

    education = Education.query.filter_by(resume_id=resume_id).all()
    projects = Project.query.filter_by(resume_id=resume_id).all()
    skills = Skill.query.filter_by(resume_id=resume_id).all()
    activities = Activity.query.filter_by(resume_id=resume_id).all()

    filename = f"resume_{resume_id}.pdf"
    path = os.path.join("uploads", filename)

    c = canvas.Canvas(path, pagesize=letter)

    # different templates
    if template == 1:
        x = 50
    elif template == 2:
        x = 70
    elif template == 3:
        x = 90
    elif template == 4:
        x = 110
    elif template == 5:
        x = 130
    elif template == 6:
        x = 150
    elif template == 7:
        x = 170
    elif template == 8:
        x = 190
    elif template == 9:
        x = 210
    else:
        x = 50

    y = 750

    c.setFont("Helvetica-Bold",16)
    c.drawString(x,y,f"{profile.first_name} {profile.last_name}")
    y -= 20

    c.setFont("Helvetica",11)
    c.drawString(x,y,f"Email: {profile.email}")
    y -= 15
    c.drawString(x,y,f"Phone: {profile.phone}")
    y -= 15

    if profile.linkedin:
        c.drawString(x,y,f"LinkedIn: {profile.linkedin}")
        y -= 15

    if profile.github:
        c.drawString(x,y,f"GitHub: {profile.github}")
        y -= 15

    y -= 10

    c.setFont("Helvetica-Bold",13)
    c.drawString(x,y,"Objective")
    y -= 15

    c.setFont("Helvetica",11)
    c.drawString(x,y,profile.objective)
    y -= 30

    c.setFont("Helvetica-Bold",13)
    c.drawString(x,y,"Education")
    y -= 20

    for edu in education:
        c.setFont("Helvetica",11)
        c.drawString(x,y,f"{edu.level} - {edu.institution} ({edu.percentage}) {edu.year}")
        y -= 15

    y -= 10

    c.setFont("Helvetica-Bold",13)
    c.drawString(x,y,"Projects")
    y -= 20

    for proj in projects:

        c.setFont("Helvetica-Bold",11)
        c.drawString(x,y,proj.project_name)
        y -= 15

        c.setFont("Helvetica",10)
        c.drawString(x,y,proj.description)
        y -= 15

        c.drawString(x,y,f"Technologies: {proj.technologies}")
        y -= 15

        if proj.project_link:
            c.drawString(x,y,f"Link: {proj.project_link}")
            y -= 15

        y -= 10

    c.setFont("Helvetica-Bold",13)
    c.drawString(x,y,"Skills")
    y -= 20

    skill_list = [s.skill for s in skills]
    c.setFont("Helvetica",11)
    c.drawString(x,y,", ".join(skill_list))
    y -= 30

    c.setFont("Helvetica-Bold",13)
    c.drawString(x,y,"Activities")
    y -= 20

    for act in activities:
        c.setFont("Helvetica",11)
        c.drawString(x,y,act.activity)
        y -= 15

    c.save()

    return path