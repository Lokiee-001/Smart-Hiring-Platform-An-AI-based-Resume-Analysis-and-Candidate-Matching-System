import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

import {
  Upload,
  Briefcase,
  Target,
  Zap,
  Cpu,
  Layout,
  Database,
  Globe
} from "lucide-react";

function StudentDashboard() {

  const navigate = useNavigate();

  const [file, setFile] = useState(null);
  const [score, setScore] = useState(0);
  const [jobs, setJobs] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState([]);

  const [progress, setProgress] = useState({
    ai:0,
    frontend:0,
    backend:0,
    fullstack:0
  });

  const [isUploading,setIsUploading] = useState(false);

  const studentId = localStorage.getItem("user_id");


  /* ---------------- INIT ---------------- */

  useEffect(()=>{

    if(!studentId){
      navigate("/student-login");
      return;
    }

    loadProgress();
    loadJobs();
    loadAppliedJobs();

  },[]);



/* ---------------- PROGRESS ---------------- */

const loadProgress = ()=>{

try{

const dashboard =
JSON.parse(
localStorage.getItem("dashboard_progress")
) || {};

setProgress({
ai: dashboard.ai || 0,
frontend: dashboard.frontend || 0,
backend: dashboard.backend || 0,
fullstack: dashboard.fullstack || 0
});

}catch{

setProgress({
ai:0,
frontend:0,
backend:0,
fullstack:0
});

}

};



/* ---------------- JOBS ---------------- */

const loadJobs = async()=>{

try{

const res = await axios.get(
`http://127.0.0.1:5000/recommended_jobs/${studentId}`
);

setJobs(res.data || []);

}
catch(error){
console.error("Job loading failed",error);
setJobs([]);
}

};



/* ---------------- APPLIED JOBS ---------------- */

const loadAppliedJobs = async()=>{

try{

const res = await axios.get(
`http://127.0.0.1:5000/applied_jobs/${studentId}`
);

const ids = res.data.map(item=>item.job_id);

setAppliedJobs(ids);

}catch(err){

console.error(err);

}

};



/* ---------------- RESUME UPLOAD ---------------- */

const uploadResume = async()=>{

if(!file){
alert("Please select resume");
return;
}

setIsUploading(true);

const formData = new FormData();

formData.append("resume",file);
formData.append("user_id",studentId);

try{

const res = await axios.post(
"http://127.0.0.1:5000/upload_resume",
formData
);

setScore(res.data.ats_score || 0);

loadJobs();

}
catch(err){
console.error(err);
alert("Upload failed");
}
finally{
setIsUploading(false);
}

};



/* ---------------- APPLY ---------------- */

const applyJob = async(job)=>{

if(appliedJobs.includes(job.job_id)){
alert("Already Applied");
return;
}

try{

const res = await axios.post(
"http://127.0.0.1:5000/apply",
{
student_id: studentId,
job_id: job.job_id,
match_score: job.match_score
}
);

if(res.data.message==="Already Applied"){
alert("Already Applied");
return;
}

setAppliedJobs(prev=>[
...prev,
job.job_id
]);

alert("Application Submitted");

}
catch(err){
console.error(err);
alert("Apply failed");
}

};



return(
<div className="min-h-screen bg-slate-50">

<Navbar/>

<div className="flex">

<Sidebar/>

<main className="flex-1 p-8">

{/* HEADER */}

<div className="mb-8">

<h1 className="text-3xl font-black text-slate-800">
Student Dashboard
</h1>

<p className="text-slate-500">
Smart Hiring Platform
</p>

</div>



{/* TOP CARDS */}

<div className="grid md:grid-cols-4 gap-6 mb-10">

<StatCard
label="ATS Score"
value={score}
icon={<Target/>}
/>

<StatCard
label="AI"
value={progress.ai}
icon={<Cpu/>}
/>

<StatCard
label="Frontend"
value={progress.frontend}
icon={<Layout/>}
/>

<StatCard
label="Backend"
value={progress.backend}
icon={<Database/>}
/>

</div>



<div className="grid lg:grid-cols-3 gap-8">


{/* LEFT PANEL */}

<div className="space-y-8">

<div className="bg-white rounded-3xl p-6 shadow">

<h3 className="font-bold mb-5 flex items-center gap-2">
<Zap size={18}/>
Progress
</h3>

<ProgressBar
label="AI"
value={progress.ai}
color="bg-emerald-500"
/>

<ProgressBar
label="Frontend"
value={progress.frontend}
color="bg-orange-500"
/>

<ProgressBar
label="Backend"
value={progress.backend}
color="bg-purple-500"
/>

<ProgressBar
label="Fullstack"
value={progress.fullstack}
color="bg-blue-500"
/>

</div>



<div className="bg-slate-900 text-white rounded-3xl p-6">

<h3 className="font-bold mb-4">
Resume Analyzer
</h3>

<label className="
border-2
border-dashed
rounded-2xl
h-24
flex
items-center
justify-center
cursor-pointer
mb-4
">

<div className="text-center">

<Upload className="mx-auto mb-2"/>

<p className="text-xs">
{file ? file.name : "Select Resume"}
</p>

</div>

<input
type="file"
className="hidden"
onChange={(e)=>setFile(e.target.files[0])}
/>

</label>


<button
onClick={uploadResume}
disabled={isUploading}
className="
w-full
bg-blue-600
py-3
rounded-xl
font-bold
"
>
{isUploading ? "Processing..." : "Upload Resume"}
</button>

</div>

</div>



{/* JOBS */}

<div className="lg:col-span-2">

<div className="bg-white rounded-3xl shadow overflow-hidden">

<div className="p-6 border-b">

<h3 className="font-bold flex items-center gap-2">
<Briefcase size={18}/>
Recommended Jobs
</h3>

</div>



<table className="w-full">

<thead>

<tr className="bg-slate-50 text-left text-xs uppercase">

<th className="px-6 py-4">
Title
</th>

<th className="px-6 py-4">
Skills
</th>

<th className="px-6 py-4">
Match
</th>

<th className="px-6 py-4">
Apply
</th>

</tr>

</thead>


<tbody>

{jobs.length===0 ? (

<tr>
<td
colSpan="4"
className="p-8 text-center text-slate-500"
>
No jobs available
</td>
</tr>

) : (

jobs.map((job,index)=>(

<tr
key={index}
className="border-b"
>

<td className="px-6 py-5 font-semibold">
{job.title || "Untitled Job"}
</td>



<td className="px-6 py-5">

{(job.skills || "")
.split(",")
.filter(Boolean)
.slice(0,2)
.map((skill,i)=>(

<span
key={i}
className="
mr-2
bg-slate-100
px-2
py-1
rounded
text-xs
"
>
{skill.trim()}
</span>

))}

</td>


<td className="px-6 py-5">
{Math.round(job.match_score || 0)}%
</td>


<td className="px-6 py-5">

<button
onClick={()=>applyJob(job)}
disabled={appliedJobs.includes(job.job_id)}
className={
appliedJobs.includes(job.job_id)
?
"bg-gray-300 px-4 py-2 rounded font-bold"
:
"bg-blue-600 text-white px-4 py-2 rounded font-bold"
}
>

{
appliedJobs.includes(job.job_id)
?
"Applied"
:
"Apply"
}

</button>

</td>

</tr>

))

)}

</tbody>

</table>

</div>

</div>

</div>

</main>
</div>
</div>
);

}



/* ---------- HELPERS ---------- */

const StatCard=({label,value,icon})=>(

<div className="
bg-white
p-6
rounded-3xl
shadow
flex
gap-4
">

<div>
{icon}
</div>

<div>
<p className="text-xs text-slate-500">
{label}
</p>

<h3 className="text-2xl font-black">
{value}%
</h3>
</div>

</div>

);



const ProgressBar=({label,value,color})=>(

<div className="mb-5">

<div className="flex justify-between mb-2 text-sm">
<span>{label}</span>
<span>{value}%</span>
</div>

<div className="bg-slate-100 h-2 rounded-full">

<div
className={`${color} h-2 rounded-full`}
style={{
width:`${value}%`
}}
></div>

</div>

</div>

);



export default StudentDashboard;