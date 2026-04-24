import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Sidebar() {

const navigate = useNavigate();
const [isOpen,setIsOpen]=useState(false);

const role = localStorage.getItem("role") || "student";

const studentMenu = [
{name:"Dashboard",path:"/student-dashboard",icon:"🏠"},
{name:"Career Opportunities",path:"/career-opportunities",icon:"💼"},
{name:"Resume Builder",path:"/resume-builder",icon:"📄"},
{name:"ATS Checker",path:"/ats-checker",icon:"📊"},
{name:"Roadmaps",path:"/roadmaps",icon:"🗺️"},
{name:"Practice",path:"/practice",icon:"🧠"},
{name:"Exam",path:"/exam",icon:"📝"},
{name:"Applied Jobs",path:"/applied-jobs",icon:"📌"},
{name:"Profile",path:"/profile",icon:"👤"},
];

const recruiterMenu = [
{name:"Dashboard",path:"/recruiter-dashboard",icon:"🏠"},
{name:"Post Job",path:"/post-job",icon:"➕"},
{name:"Candidates",path:"/candidate-matches",icon:"👥"},
{name:"Applicants",path:"/applicants",icon:"📥"},
{name:"Participants",path:"/participants",icon:"📋"},
{name:"Admin Panel",path:"/admin-panel",icon:"⚙️"},
];

const menu =
role==="recruiter"
? recruiterMenu
: studentMenu;


return(

<div
className={`h-screen bg-gray-100 shadow-md p-4 transition-all duration-300 ${
isOpen ? "w-64" : "w-16"
}`}
onMouseEnter={()=>setIsOpen(true)}
onMouseLeave={()=>setIsOpen(false)}
>

<ul className="space-y-5">

{menu.map((item,index)=>(

<li
key={index}
onClick={()=>navigate(item.path)}
className="
cursor-pointer
hover:text-blue-600
font-medium
flex
items-center
gap-3
"
>

<span>
{item.icon}
</span>

{isOpen && (
<span>
{item.name}
</span>
)}

</li>

))}

</ul>

</div>

)

}

export default Sidebar;