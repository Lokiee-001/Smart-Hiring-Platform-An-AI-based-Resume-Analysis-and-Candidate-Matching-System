import React from "react"
import { BrowserRouter,Routes,Route } from "react-router-dom"

import Home from "./pages/Home"
import StudentLogin from "./pages/StudentLogin"
import RecruiterLogin from "./pages/RecruiterLogin"
import Register from "./pages/Register"

import StudentDashboard from "./pages/StudentDashboard"
import RecruiterDashboard from "./pages/RecruiterDashboard"
import PostJob from "./pages/PostJob"
import CandidateMatches from "./pages/CandidateMatches"
import Applicants from "./pages/Applicants"

import AppliedJobs from "./pages/AppliedJobs"
import CareerOpportunities from "./pages/CareerOpportunities"

import ResumeBuilder from "./pages/ResumeBuilder"

import ATSChecker from "./pages/ATSChecker"

import Roadmaps from "./pages/Roadmaps"


import AdminPanel from "./pages/AdminPanal"
import Practice from "./pages/Practice"
import Exam from "./pages/Exam"

import Profile from "./pages/Profile";
import Participants from "./pages/Participants";




function App(){

return(

<BrowserRouter>

<Routes>

<Route path="/" element={<Home/>} />

<Route path="/student-login" element={<StudentLogin/>} />

<Route path="/recruiter-login" element={<RecruiterLogin/>} />

<Route path="/register" element={<Register/>} />

<Route path="/student-dashboard" element={<StudentDashboard/>} />

<Route path="/recruiter-dashboard" element={<RecruiterDashboard/>} />

<Route path="/post-job" element={<PostJob/>} />

<Route path="/candidate-matches" element={<CandidateMatches/>} />

<Route path="/applicants" element={<Applicants/>} />
<Route path="/applied-jobs" element={<AppliedJobs/>} />

<Route path="/career-opportunities" element={<CareerOpportunities/>}/>
<Route path="/resume-builder" element={<ResumeBuilder/>} />

<Route path="/ats-checker" element={<ATSChecker/>} />

<Route path="/roadmaps" element={<Roadmaps/>} />
<Route path="/admin-panel" element={<AdminPanel/>} />
<Route path="/practice" element={<Practice/>} />
<Route path="/exam" element={<Exam/>} />
<Route path="/profile" element={<Profile />} />
<Route path="/participants" element={<Participants />} />


</Routes>

</BrowserRouter>

)

}

export default App
