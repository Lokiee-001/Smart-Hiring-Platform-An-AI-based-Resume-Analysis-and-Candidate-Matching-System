import React, { useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { 
  FaUser, FaGraduationCap, FaProjectDiagram, FaTools, 
  FaFileDownload, FaEye, FaCloudUploadAlt, FaCheckCircle,
  FaArrowRight, FaStar, FaRegGem, FaPalette,
  FaSave, FaPlus, FaSpinner, FaRegFileAlt, FaUserCircle,
  FaEnvelope, FaPhone, FaLinkedin, FaGithub, FaBriefcase,
  FaLaptopCode, FaAward, FaChartLine, FaMagic, FaTrash,
  FaEdit, FaExternalLinkAlt
} from "react-icons/fa";

function ResumeBuilder() {
  const [profile, setProfile] = useState({
    first_name: "", last_name: "", email: "", phone: "", linkedin: "", github: "", objective: ""
  });
  const [resumeId, setResumeId] = useState(null);
  const [template, setTemplate] = useState(1);
  const [preview, setPreview] = useState(null);
  const [education, setEducation] = useState({ level: "", institution: "", percentage: "", year: "" });
  const [project, setProject] = useState({ project_name: "", description: "", technologies: "", project_link: "" });
  const [skill, setSkill] = useState("");
  const [activity, setActivity] = useState("");
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState({});
  const [activeNav, setActiveNav] = useState("profile");
  const [completion, setCompletion] = useState({ profile: false, education: false, projects: false, skills: false });
  const [educationList, setEducationList] = useState([]);
  const [projectList, setProjectList] = useState([]);
  const [skillList, setSkillList] = useState([]);
  const [activityList, setActivityList] = useState([]);

  const setButtonLoading = (key, isLoading) => {
    setLoading(prev => ({ ...prev, [key]: isLoading }));
  };

  // API calls
  const saveProfile = async () => {
    setButtonLoading("saveProfile", true);
    try {
      const res = await axios.post("http://127.0.0.1:5000/save_resume_profile", { user_id: 1, ...profile });
      setResumeId(res.data.resume_id);
      setCompletion(prev => ({ ...prev, profile: true }));
      alert("✨ Profile saved successfully!");
    } catch (error) {
      alert("Error saving profile");
    } finally {
      setButtonLoading("saveProfile", false);
    }
  };

  const uploadPhoto = async () => {
    if (!resumeId) { alert("Please save profile first"); return; }
    setButtonLoading("uploadPhoto", true);
    try {
      const formData = new FormData();
      formData.append("resume_id", resumeId);
      formData.append("photo", photo);
      await axios.post("http://127.0.0.1:5000/upload_profile_photo", formData);
      alert("📸 Photo uploaded!");
    } catch (error) {
      alert("Error uploading photo");
    } finally {
      setButtonLoading("uploadPhoto", false);
    }
  };

  const addEducation = async () => {
    if (!resumeId) { alert("Please save profile first"); return; }
    if (!education.level || !education.institution) { alert("Please fill required fields"); return; }
    setButtonLoading("addEducation", true);
    try {
      const res = await axios.post("http://127.0.0.1:5000/add_education", { resume_id: resumeId, ...education });
      setEducationList([...educationList, { id: res.data.id, ...education }]);
      setCompletion(prev => ({ ...prev, education: true }));
      alert("🎓 Education added!");
      setEducation({ level: "", institution: "", percentage: "", year: "" });
    } catch (error) {
      alert("Error adding education");
    } finally {
      setButtonLoading("addEducation", false);
    }
  };

  const addProject = async () => {
    if (!resumeId) { alert("Please save profile first"); return; }
    if (!project.project_name) { alert("Please enter project name"); return; }
    setButtonLoading("addProject", true);
    try {
      const res = await axios.post("http://127.0.0.1:5000/add_project", { resume_id: resumeId, ...project });
      setProjectList([...projectList, { id: res.data.id, ...project }]);
      setCompletion(prev => ({ ...prev, projects: true }));
      alert("🚀 Project added!");
      setProject({ project_name: "", description: "", technologies: "", project_link: "" });
    } catch (error) {
      alert("Error adding project");
    } finally {
      setButtonLoading("addProject", false);
    }
  };

  const addSkill = async () => {
    if (!resumeId) { alert("Please save profile first"); return; }
    if (!skill.trim()) { alert("Please enter a skill"); return; }
    setButtonLoading("addSkill", true);
    try {
      const res = await axios.post("http://127.0.0.1:5000/add_skill", { resume_id: resumeId, skill: skill });
      setSkillList([...skillList, { id: res.data.id, name: skill }]);
      alert("⚡ Skill added!");
      setSkill("");
    } catch (error) {
      alert("Error adding skill");
    } finally {
      setButtonLoading("addSkill", false);
    }
  };

  const addActivity = async () => {
    if (!resumeId) { alert("Please save profile first"); return; }
    if (!activity.trim()) { alert("Please enter an activity"); return; }
    setButtonLoading("addActivity", true);
    try {
      const res = await axios.post("http://127.0.0.1:5000/add_activity", { resume_id: resumeId, activity: activity });
      setActivityList([...activityList, { id: res.data.id, name: activity }]);
      setCompletion(prev => ({ ...prev, skills: true }));
      alert("🌟 Activity added!");
      setActivity("");
    } finally {
      setButtonLoading("addActivity", false);
    }
  };

  const previewResume = async () => {
    if (!resumeId) { alert("Please save profile first"); return; }
    setButtonLoading("preview", true);
    try {
      const res = await axios.get("http://127.0.0.1:5000/preview_resume/" + resumeId);
      setPreview(res.data);
    } catch (error) {
      alert("Error loading preview");
    } finally {
      setButtonLoading("preview", false);
    }
  };

  const downloadResume = () => {
    if (!resumeId) { alert("Please save profile first"); return; }
    window.open(`http://127.0.0.1:5000/generate_resume/${resumeId}/${template}`);
  };

  const removeEducation = (index) => {
    setEducationList(educationList.filter((_, i) => i !== index));
  };

  const removeProject = (index) => {
    setProjectList(projectList.filter((_, i) => i !== index));
  };

  const removeSkill = (index) => {
    setSkillList(skillList.filter((_, i) => i !== index));
  };

  const removeActivity = (index) => {
    setActivityList(activityList.filter((_, i) => i !== index));
  };

  const navItems = [
    { id: "profile", label: "Personal Info", icon: FaUser, color: "indigo", description: "Basic details & photo" },
    { id: "education", label: "Education", icon: FaGraduationCap, color: "emerald", description: "Academic background" },
    { id: "projects", label: "Projects", icon: FaProjectDiagram, color: "amber", description: "Key work samples" },
    { id: "skills", label: "Skills & Awards", icon: FaTools, color: "rose", description: "Technical & achievements" },
    { id: "preview", label: "Preview", icon: FaEye, color: "purple", description: "Final review" },
  ];

  const getNavItemClass = (id, color) => {
    const isActive = activeNav === id;
    const colorClasses = {
      indigo: isActive ? "bg-indigo-50 border-indigo-200 text-indigo-700" : "hover:bg-indigo-50/50 border-transparent text-slate-600",
      emerald: isActive ? "bg-emerald-50 border-emerald-200 text-emerald-700" : "hover:bg-emerald-50/50 border-transparent text-slate-600",
      amber: isActive ? "bg-amber-50 border-amber-200 text-amber-700" : "hover:bg-amber-50/50 border-transparent text-slate-600",
      rose: isActive ? "bg-rose-50 border-rose-200 text-rose-700" : "hover:bg-rose-50/50 border-transparent text-slate-600",
      purple: isActive ? "bg-purple-50 border-purple-200 text-purple-700" : "hover:bg-purple-50/50 border-transparent text-slate-600",
    };
    return `${colorClasses[color]} flex items-center gap-4 px-5 py-4 rounded-2xl border transition-all duration-200 cursor-pointer group mb-2`;
  };

  const getProgressWidth = () => {
    const completed = Object.values(completion).filter(Boolean).length;
    return (completed / 4) * 100;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <Navbar />
      <div className="flex">
        <Sidebar />

        <div className="flex-1 flex flex-col lg:flex-row h-[calc(100vh-64px)] overflow-hidden">
          
          {/* LEFT: DASHBOARD NAVIGATION */}
          <div className="w-full lg:w-80 bg-white/90 backdrop-blur-sm border-r border-slate-200 overflow-y-auto shadow-xl z-10">
            <div className="p-6 border-b border-slate-100 bg-gradient-to-br from-indigo-50/50 to-white">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-200">
                  <FaRegGem className="text-white text-xl" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-800">Resume Studio</h2>
                  <p className="text-xs text-slate-500">Build your professional brand</p>
                </div>
              </div>
              
              <div className="mt-4 mb-2">
                <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                  <span>Profile Completion</span>
                  <span className="font-semibold text-indigo-600">{Math.round(getProgressWidth())}%</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full transition-all duration-500"
                    style={{ width: `${getProgressWidth()}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="p-4">
              {navItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setActiveNav(item.id)}
                  className={getNavItemClass(item.id, item.color)}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                    activeNav === item.id 
                      ? `bg-${item.color}-100 shadow-sm` 
                      : `bg-slate-100 group-hover:bg-${item.color}-50`
                  }`}>
                    <item.icon className={`text-${
                      activeNav === item.id ? item.color : "slate-500"
                    }-500 text-lg`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className={`font-semibold ${
                        activeNav === item.id ? `text-${item.color}-700` : "text-slate-700"
                      }`}>
                        {item.label}
                      </h3>
                      {completion[item.id === "skills" ? "skills" : item.id] && (
                        <FaCheckCircle className={`text-${item.color}-400 text-xs`} />
                      )}
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">{item.description}</p>
                  </div>
                  <FaArrowRight className={`text-xs transition-all ${
                    activeNav === item.id ? `text-${item.color}-400 opacity-100` : "opacity-0 group-hover:opacity-100 text-slate-300"
                  }`} />
                </div>
              ))}
            </div>

            {resumeId && (
              <div className="mx-4 mt-4 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl border border-indigo-100">
                <div className="flex items-center gap-2 mb-2">
                  <FaMagic className="text-indigo-500 text-sm" />
                  <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">Active Session</span>
                </div>
                <p className="text-sm font-mono text-slate-700">ID: {resumeId}</p>
                <p className="text-xs text-slate-500 mt-1">Ready to export</p>
              </div>
            )}
          </div>

          {/* CENTER: FORM CONTENT */}
          <div className="flex-1 overflow-y-auto bg-gradient-to-br from-slate-50 to-white p-6 md:p-8">
            <div className="max-w-3xl mx-auto">
              {/* Profile Section */}
              {activeNav === "profile" && (
                <div className="space-y-6">
                  <div className="mb-2">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center">
                        <FaUserCircle className="text-indigo-600 text-xl" />
                      </div>
                      <h2 className="text-2xl font-bold text-slate-800">Personal Information</h2>
                    </div>
                    <p className="text-slate-500 text-sm ml-13">Tell us about yourself — this forms the foundation of your resume</p>
                  </div>

                  <div className="bg-white rounded-2xl border border-slate-100 shadow-lg shadow-slate-200/30 overflow-hidden">
                    <div className="p-6 space-y-5">
                      <div className="grid grid-cols-2 gap-5">
                        <div>
                          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">First Name</label>
                          <input 
                            className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all bg-slate-50/50"
                            placeholder="John"
                            value={profile.first_name}
                            onChange={(e)=>setProfile({...profile,first_name:e.target.value})}
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Last Name</label>
                          <input 
                            className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all bg-slate-50/50"
                            placeholder="Doe"
                            value={profile.last_name}
                            onChange={(e)=>setProfile({...profile,last_name:e.target.value})}
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-5">
                        <div>
                          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5 flex items-center gap-1">
                            <FaEnvelope className="text-xs" /> Email
                          </label>
                          <input 
                            type="email"
                            className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all bg-slate-50/50"
                            placeholder="john@example.com"
                            value={profile.email}
                            onChange={(e)=>setProfile({...profile,email:e.target.value})}
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5 flex items-center gap-1">
                            <FaPhone className="text-xs" /> Phone
                          </label>
                          <input 
                            className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all bg-slate-50/50"
                            placeholder="+1 234 567 8900"
                            value={profile.phone}
                            onChange={(e)=>setProfile({...profile,phone:e.target.value})}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-5">
                        <div>
                          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5 flex items-center gap-1">
                            <FaLinkedin className="text-xs" /> LinkedIn
                          </label>
                          <input 
                            className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all bg-slate-50/50"
                            placeholder="linkedin.com/in/johndoe"
                            value={profile.linkedin}
                            onChange={(e)=>setProfile({...profile,linkedin:e.target.value})}
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5 flex items-center gap-1">
                            <FaGithub className="text-xs" /> GitHub
                          </label>
                          <input 
                            className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all bg-slate-50/50"
                            placeholder="github.com/johndoe"
                            value={profile.github}
                            onChange={(e)=>setProfile({...profile,github:e.target.value})}
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5 flex items-center gap-1">
                          <FaBriefcase className="text-xs" /> Professional Objective
                        </label>
                        <textarea 
                          className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all bg-slate-50/50 h-28 resize-none"
                          placeholder="Passionate software engineer seeking to leverage technical expertise in building scalable solutions..."
                          value={profile.objective}
                          onChange={(e)=>setProfile({...profile,objective:e.target.value})}
                        />
                      </div>
                      
                      <div className="border-t border-slate-100 pt-5">
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Profile Photo</label>
                        <div className="flex items-center gap-4">
                          <label className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-500 cursor-pointer hover:bg-slate-100 transition-colors">
                            <input type="file" className="hidden" onChange={(e)=>setPhoto(e.target.files[0])}/>
                            <span className="flex items-center gap-2">
                              <FaCloudUploadAlt className="text-indigo-500" />
                              {photo ? photo.name : "Choose a photo..."}
                            </span>
                          </label>
                          <button 
                            onClick={uploadPhoto} 
                            disabled={!photo || loading.uploadPhoto}
                            className="px-5 py-2.5 bg-indigo-50 rounded-xl text-indigo-600 font-medium hover:bg-indigo-100 transition-colors disabled:opacity-50 text-sm"
                          >
                            {loading.uploadPhoto ? <FaSpinner className="animate-spin" /> : "Upload"}
                          </button>
                        </div>
                      </div>
                      
                      <button 
                        onClick={saveProfile} 
                        disabled={loading.saveProfile}
                        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-semibold py-3 rounded-xl transition-all shadow-md shadow-indigo-200 disabled:opacity-50"
                      >
                        {loading.saveProfile ? <FaSpinner className="animate-spin" /> : <FaSave />}
                        Save Profile Information
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Education Section */}
              {activeNav === "education" && (
                <div className="space-y-6">
                  <div className="mb-2">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                        <FaGraduationCap className="text-emerald-600 text-xl" />
                      </div>
                      <h2 className="text-2xl font-bold text-slate-800">Education History</h2>
                    </div>
                    <p className="text-slate-500 text-sm ml-13">Add your academic qualifications and achievements</p>
                  </div>

                  {/* Education List */}
                  {educationList.length > 0 && (
                    <div className="space-y-3">
                      <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                        <FaCheckCircle className="text-emerald-500 text-xs" />
                        Added Education ({educationList.length})
                      </h3>
                      {educationList.map((edu, idx) => (
                        <div key={idx} className="bg-emerald-50/30 border border-emerald-100 rounded-xl p-4 flex justify-between items-start">
                          <div>
                            <p className="font-semibold text-slate-800">{edu.level}</p>
                            <p className="text-sm text-slate-600">{edu.institution}</p>
                            <p className="text-xs text-slate-500">{edu.year} • {edu.percentage}</p>
                          </div>
                          <button onClick={() => removeEducation(idx)} className="text-slate-400 hover:text-red-500 transition-colors">
                            <FaTrash size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="bg-white rounded-2xl border border-slate-100 shadow-lg shadow-slate-200/30 overflow-hidden">
                    <div className="p-6 space-y-5">
                      <input 
                        placeholder="Degree Level (e.g., B.Tech in Computer Science)"
                        className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all bg-slate-50/50"
                        value={education.level}
                        onChange={(e)=>setEducation({...education,level:e.target.value})}
                      />
                      <input 
                        placeholder="Institution Name"
                        className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all bg-slate-50/50"
                        value={education.institution}
                        onChange={(e)=>setEducation({...education,institution:e.target.value})}
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <input 
                          placeholder="Percentage / CGPA"
                          className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all bg-slate-50/50"
                          value={education.percentage}
                          onChange={(e)=>setEducation({...education,percentage:e.target.value})}
                        />
                        <input 
                          placeholder="Year of Completion"
                          className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all bg-slate-50/50"
                          value={education.year}
                          onChange={(e)=>setEducation({...education,year:e.target.value})}
                        />
                      </div>
                      <button 
                        onClick={addEducation} 
                        disabled={loading.addEducation}
                        className="w-full flex items-center justify-center gap-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-semibold py-3 rounded-xl transition-colors disabled:opacity-50"
                      >
                        {loading.addEducation ? <FaSpinner className="animate-spin" /> : <FaPlus />}
                        Add Education Record
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Projects Section */}
              {activeNav === "projects" && (
                <div className="space-y-6">
                  <div className="mb-2">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                        <FaLaptopCode className="text-amber-600 text-xl" />
                      </div>
                      <h2 className="text-2xl font-bold text-slate-800">Key Projects</h2>
                    </div>
                    <p className="text-slate-500 text-sm ml-13">Showcase your best work and technical contributions</p>
                  </div>

                  {/* Projects List */}
                  {projectList.length > 0 && (
                    <div className="space-y-3">
                      <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                        <FaCheckCircle className="text-amber-500 text-xs" />
                        Added Projects ({projectList.length})
                      </h3>
                      {projectList.map((proj, idx) => (
                        <div key={idx} className="bg-amber-50/30 border border-amber-100 rounded-xl p-4">
                          <div className="flex justify-between items-start mb-2">
                            <p className="font-semibold text-slate-800">{proj.project_name}</p>
                            <button onClick={() => removeProject(idx)} className="text-slate-400 hover:text-red-500 transition-colors">
                              <FaTrash size={14} />
                            </button>
                          </div>
                          {proj.technologies && (
                            <p className="text-xs text-amber-600 mb-2">Tech: {proj.technologies}</p>
                          )}
                          {proj.description && (
                            <p className="text-sm text-slate-600">{proj.description}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="bg-white rounded-2xl border border-slate-100 shadow-lg shadow-slate-200/30 overflow-hidden">
                    <div className="p-6 space-y-5">
                      <input 
                        placeholder="Project Name"
                        className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all bg-slate-50/50"
                        value={project.project_name}
                        onChange={(e)=>setProject({...project,project_name:e.target.value})}
                      />
                      <input 
                        placeholder="Technologies Used (e.g., React, Flask, PostgreSQL)"
                        className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all bg-slate-50/50"
                        value={project.technologies}
                        onChange={(e)=>setProject({...project,technologies:e.target.value})}
                      />
                      <textarea 
                        placeholder="Project description and your key contributions..."
                        className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all bg-slate-50/50 h-24 resize-none"
                        value={project.description}
                        onChange={(e)=>setProject({...project,description:e.target.value})}
                      />
                      <button 
                        onClick={addProject} 
                        disabled={loading.addProject}
                        className="w-full flex items-center justify-center gap-2 bg-amber-50 hover:bg-amber-100 text-amber-700 font-semibold py-3 rounded-xl transition-colors disabled:opacity-50"
                      >
                        {loading.addProject ? <FaSpinner className="animate-spin" /> : <FaPlus />}
                        Add Project
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Skills & Awards Section */}
              {activeNav === "skills" && (
                <div className="space-y-6">
                  <div className="mb-2">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center">
                        <FaAward className="text-rose-600 text-xl" />
                      </div>
                      <h2 className="text-2xl font-bold text-slate-800">Skills & Achievements</h2>
                    </div>
                    <p className="text-slate-500 text-sm ml-13">Highlight your technical expertise and accomplishments</p>
                  </div>

                  {/* Skills List */}
                  {skillList.length > 0 && (
                    <div className="space-y-3">
                      <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                        <FaCheckCircle className="text-rose-500 text-xs" />
                        Your Skills ({skillList.length})
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {skillList.map((sk, idx) => (
                          <div key={idx} className="flex items-center gap-2 bg-rose-50 border border-rose-100 rounded-full px-3 py-1.5">
                            <span className="text-sm text-rose-700">{sk.name}</span>
                            <button onClick={() => removeSkill(idx)} className="text-rose-300 hover:text-rose-600 transition-colors">
                              <FaTrash size={10} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Activities List */}
                  {activityList.length > 0 && (
                    <div className="space-y-3">
                      <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                        <FaStar className="text-amber-500 text-xs" />
                        Activities & Awards ({activityList.length})
                      </h3>
                      <div className="space-y-2">
                        {activityList.map((act, idx) => (
                          <div key={idx} className="flex justify-between items-center bg-amber-50/30 border border-amber-100 rounded-xl p-3">
                            <span className="text-sm text-slate-700">{act.name}</span>
                            <button onClick={() => removeActivity(idx)} className="text-slate-400 hover:text-red-500 transition-colors">
                              <FaTrash size={12} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-lg shadow-slate-200/30 overflow-hidden">
                      <div className="p-6">
                        <div className="flex items-center gap-2 mb-4">
                          <FaTools className="text-rose-500" />
                          <h3 className="font-semibold text-slate-800">Add New Skill</h3>
                        </div>
                        <input 
                          placeholder="e.g., Python, React, Node.js"
                          className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none transition-all bg-slate-50/50 mb-4"
                          value={skill}
                          onChange={(e)=>setSkill(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                        />
                        <button 
                          onClick={addSkill} 
                          disabled={loading.addSkill}
                          className="w-full flex items-center justify-center gap-2 bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold py-2.5 rounded-xl transition-colors disabled:opacity-50"
                        >
                          {loading.addSkill ? <FaSpinner className="animate-spin" /> : <FaPlus />}
                          Add Skill
                        </button>
                      </div>
                    </div>
                    
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-lg shadow-slate-200/30 overflow-hidden">
                      <div className="p-6">
                        <div className="flex items-center gap-2 mb-4">
                          <FaStar className="text-amber-500" />
                          <h3 className="font-semibold text-slate-800">Add Activity/Award</h3>
                        </div>
                        <input 
                          placeholder="e.g., Open Source Contributor, Hackathon Winner"
                          className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all bg-slate-50/50 mb-4"
                          value={activity}
                          onChange={(e)=>setActivity(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && addActivity()}
                        />
                        <button 
                          onClick={addActivity} 
                          disabled={loading.addActivity}
                          className="w-full flex items-center justify-center gap-2 bg-amber-50 hover:bg-amber-100 text-amber-700 font-semibold py-2.5 rounded-xl transition-colors disabled:opacity-50"
                        >
                          {loading.addActivity ? <FaSpinner className="animate-spin" /> : <FaPlus />}
                          Add Activity
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Preview Section */}
              {activeNav === "preview" && (
                <div className="space-y-6">
                  <div className="mb-2">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                        <FaEye className="text-purple-600 text-xl" />
                      </div>
                      <h2 className="text-2xl font-bold text-slate-800">Resume Preview</h2>
                    </div>
                    <p className="text-slate-500 text-sm ml-13">Review and export your professional resume</p>
                  </div>

                  <div className="bg-white rounded-2xl border border-slate-100 shadow-lg shadow-slate-200/30 overflow-hidden">
                    <div className="p-6 space-y-5">
                      <div className="flex items-center justify-between gap-4 flex-wrap">
                        <div className="flex items-center gap-3 bg-slate-50 rounded-xl p-2">
                          <FaPalette className="text-purple-500 text-sm ml-2" />
                          <select 
                            className="bg-transparent border-none text-sm text-slate-700 focus:ring-0 outline-none cursor-pointer py-1"
                            onChange={(e)=>setTemplate(e.target.value)}
                            value={template}
                          >
                            {[...Array(10)].map((_, i) => (
                              <option key={i+1} value={i+1}>Template Style {i+1}</option>
                            ))}
                          </select>
                        </div>
                        <div className="flex gap-3">
                          <button 
                            onClick={previewResume} 
                            disabled={loading.preview}
                            className="flex items-center gap-2 px-5 py-2 bg-purple-50 hover:bg-purple-100 text-purple-700 font-medium rounded-xl transition-colors disabled:opacity-50"
                          >
                            {loading.preview ? <FaSpinner className="animate-spin" /> : <FaEye />}
                            Refresh Preview
                          </button>
                          <button 
                            onClick={downloadResume} 
                            className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold rounded-xl shadow-md transition-all"
                          >
                            <FaFileDownload /> Export PDF
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT: LIVE PREVIEW PANEL */}
          <div className="hidden lg:block w-96 bg-gradient-to-br from-slate-900 to-slate-800 overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-slate-800/95 backdrop-blur-sm px-5 py-4 border-b border-slate-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FaChartLine className="text-indigo-400 text-sm" />
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Live Preview</span>
                </div>
                {preview && (
                  <span className="text-xs text-emerald-400 flex items-center gap-1">
                    <FaCheckCircle size={10} /> Loaded
                  </span>
                )}
              </div>
            </div>
            
            <div className="p-5">
              <div className="bg-white rounded-xl shadow-2xl overflow-hidden transform scale-90 origin-top transition-all">
                {preview ? (
                  <div className="p-6 font-serif">
                    <h1 className="text-2xl font-bold text-slate-800 border-b-2 border-indigo-200 pb-2 mb-3">
                      {preview.profile.name || "Your Name"}
                    </h1>
                    <div className="flex flex-wrap gap-2 text-xs text-slate-500 mb-5">
                      <span>{preview.profile.email || "email@example.com"}</span>
                      <span>•</span>
                      <span>{preview.profile.phone || "+1 234 567 8900"}</span>
                    </div>
                    
                    <section className="mb-4">
                      <h4 className="font-bold uppercase tracking-wider text-[10px] text-indigo-600 border-b border-slate-200 pb-1 mb-2">Summary</h4>
                      <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">{preview.profile.objective || "No objective added"}</p>
                    </section>

                    <section className="mb-4">
                      <h4 className="font-bold uppercase tracking-wider text-[10px] text-indigo-600 border-b border-slate-200 pb-1 mb-2">Education</h4>
                      {preview.education?.slice(0, 2).map((e, i) => (
                        <div key={i} className="mb-2">
                          <p className="font-semibold text-xs">{e.level}</p>
                          <p className="text-[10px] text-slate-500">{e.institution}</p>
                        </div>
                      ))}
                      {preview.education?.length > 2 && (
                        <p className="text-[10px] text-slate-400">+{preview.education.length - 2} more</p>
                      )}
                    </section>

                    <div className="grid grid-cols-2 gap-3">
                      <section>
                        <h4 className="font-bold uppercase tracking-wider text-[10px] text-indigo-600 border-b border-slate-200 pb-1 mb-2">Skills</h4>
                        <div className="flex flex-wrap gap-1">
                          {preview.skills?.slice(0, 4).map((s, i) => (
                            <span key={i} className="text-[9px] bg-slate-100 px-1.5 py-0.5 rounded">{s}</span>
                          ))}
                        </div>
                      </section>
                    </div>
                  </div>
                ) : (
                  <div className="p-8 text-center">
                    <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3">
                      <FaRegFileAlt className="text-indigo-400 text-2xl" />
                    </div>
                    <p className="text-xs text-slate-500">Click "Refresh Preview"<br />to see your resume</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        .ml-13 {
          margin-left: 3.25rem;
        }
      `}</style>
    </div>
  );
}

export default ResumeBuilder;