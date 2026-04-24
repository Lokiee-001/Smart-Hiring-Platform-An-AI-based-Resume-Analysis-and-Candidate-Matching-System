import React, { useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Briefcase, 
  AlignLeft, 
  Cpu, 
  Send, 
  Info, 
  Eye, 
  Sparkles 
} from "lucide-react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

function PostJob() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [skills, setSkills] = useState("");
  const [loading, setLoading] = useState(false);

  const postJob = async () => {
    if (!title || !description) return alert("Please fill in the details");
    setLoading(true);
    try {
      await axios.post("http://127.0.0.1:5000/post_job", {
        recruiter_id: 1,
        title: title,
        description: description,
        skills: skills,
        recruiter_email: localStorage.getItem("email") 
      });
      alert("Job Posted Successfully!");
    } catch (err) {
      alert("Error posting job.");
    } finally {
      setLoading(false);
    }
  };

  const inputClasses = "w-full border border-slate-200 rounded-xl p-4 text-slate-800 bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400 shadow-sm";

  return (
    <div className="bg-[#f8fafc] min-h-screen">
      <Navbar />
      
      <div className="flex">
        <Sidebar />

        <main className="flex-1 p-8">
          <div className="max-w-6xl mx-auto">
            
            {/* Header Section */}
            <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
                  <span className="p-2 bg-blue-600 text-white rounded-lg shadow-lg shadow-blue-200">
                    <Briefcase size={24} />
                  </span>
                  Post an Opening
                </h1>
                <p className="text-slate-500 mt-2 font-medium">Create a job listing that attracts top talent.</p>
              </motion.div>
              
              <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest bg-white px-4 py-2 rounded-full border border-slate-200 shadow-sm">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                Draft Mode
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              
              {/* FORM AREA */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="xl:col-span-2 space-y-6"
              >
                <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50">
                  
                  <div className="space-y-6">
                    {/* Job Title */}
                    <div className="group">
                      <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2">
                        <Sparkles size={16} className="text-blue-500" />
                        Professional Title
                      </label>
                      <input
                        placeholder="e.g. Senior Software Architect"
                        className={inputClasses}
                        onChange={(e) => setTitle(e.target.value)}
                        value={title}
                      />
                    </div>

                    {/* Skills Selection */}
                    <div className="group">
                      <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2">
                        <Cpu size={16} className="text-blue-500" />
                        Tech Stack / Skills
                      </label>
                      <input
                        placeholder="React, AWS, Node.js..."
                        className={inputClasses}
                        onChange={(e) => setSkills(e.target.value)}
                        value={skills}
                      />
                      <div className="flex flex-wrap gap-2 mt-3">
                        {skills.split(',').map((skill, idx) => skill.trim() && (
                          <span key={idx} className="bg-blue-50 text-blue-700 text-[11px] font-bold px-3 py-1 rounded-full border border-blue-100">
                            {skill.trim()}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Job Description */}
                    <div className="group">
                      <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2">
                        <AlignLeft size={16} className="text-blue-500" />
                        Job Description
                      </label>
                      <textarea
                        placeholder="Tell the story of the role..."
                        rows="8"
                        className={`${inputClasses} resize-none`}
                        onChange={(e) => setDescription(e.target.value)}
                        value={description}
                      />
                    </div>
                  </div>

                  <div className="mt-10 pt-6 border-t border-slate-100 flex items-center justify-between">
                    <p className="text-slate-400 text-sm flex items-center gap-2">
                      <Info size={16} />
                      Posting as <span className="font-bold text-slate-600">{localStorage.getItem("email") || "Recruiter"}</span>
                    </p>
                    <button
                      onClick={postJob}
                      disabled={loading}
                      className="group bg-slate-900 hover:bg-blue-600 text-white font-bold px-8 py-4 rounded-2xl transition-all shadow-lg shadow-slate-200 active:scale-95 disabled:opacity-50 flex items-center gap-3"
                    >
                      {loading ? "Publishing..." : "Publish Opportunity"}
                      <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </motion.div>

              {/* LIVE PREVIEW SIDEBAR */}
              <div className="space-y-6">
                <div className="sticky top-8">
                  <div className="bg-slate-900 rounded-3xl p-6 text-white mb-6">
                    <div className="flex items-center gap-2 mb-4 text-blue-400 text-xs font-bold uppercase tracking-tighter">
                      <Eye size={14} /> Live Candidate Preview
                    </div>
                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/10">
                      <h3 className="text-xl font-bold mb-2 break-words">
                        {title || "Untitled Position"}
                      </h3>
                      <div className="flex flex-wrap gap-2 mb-4">
                        <div className="bg-white/10 px-2 py-1 rounded text-[10px] font-medium">Remote</div>
                        <div className="bg-white/10 px-2 py-1 rounded text-[10px] font-medium">Full-time</div>
                      </div>
                      <p className="text-sm text-slate-300 line-clamp-4 leading-relaxed mb-4">
                        {description || "Start typing your description to see how candidates see this job..."}
                      </p>
                      <div className="h-[1px] bg-white/10 mb-4" />
                      <div className="flex justify-between items-center">
                        <div className="w-20 h-8 bg-blue-500 rounded-lg animate-pulse" />
                        <div className="w-8 h-8 rounded-full bg-slate-700" />
                      </div>
                    </div>
                  </div>

                  {/* Tips Card */}
                  <div className="bg-blue-50 p-6 rounded-3xl border border-blue-100">
                    <h4 className="font-bold text-blue-900 flex items-center gap-2 mb-2">
                      <Sparkles size={16} /> Pro Tip
                    </h4>
                    <p className="text-sm text-blue-700 leading-relaxed">
                      Jobs with clearly listed skills attract 40% more qualified applicants. Use commas to separate key technologies.
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default PostJob;