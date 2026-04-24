import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { 
  Briefcase, 
  Code, 
  MapPin, 
  ExternalLink, 
  Send, 
  Loader2, 
  Search,
  Sparkles 
} from "lucide-react";

function CareerOpportunities() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applyingId, setApplyingId] = useState(null);

  const loadJobs = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:5000/all_jobs");
      setJobs(res.data);
    } catch (err) {
      console.error("Error loading jobs", err);
    } finally {
      setLoading(false);
    }
  };

  const applyJob = async (job) => {
    setApplyingId(job.job_id);
    try {
      await axios.post("http://127.0.0.1:5000/apply", {
        student_id: 1,
        job_id: job.job_id,
        match_score: 0,
      });
      // Small delay for better UX feel
      setTimeout(() => alert("Applied Successfully! 🚀"), 200);
    } catch (err) {
      alert("Failed to apply. Please try again.");
    } finally {
      setApplyingId(null);
    }
  };

  useEffect(() => {
    loadJobs();
  }, []);

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar />
      <div className="flex">
        <Sidebar />

        <main className="flex-1 p-6 lg:p-10">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                Career Opportunities
              </h1>
              <p className="text-slate-500 mt-1 flex items-center gap-2">
                <Sparkles size={16} className="text-amber-500" />
                Tailored job recommendations for your skill set.
              </p>
            </div>
            
            {/* Search Bar - Visual only for now */}
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="Search roles..." 
                className="pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm"
              />
            </div>
          </div>

          {/* Jobs Content */}
          {loading ? (
            <div className="flex flex-col items-center justify-center h-64 text-slate-400">
              <Loader2 className="animate-spin mb-4" size={40} />
              <p className="font-medium">Curating the best roles for you...</p>
            </div>
          ) : jobs.length > 0 ? (
            <div className="grid grid-cols-1 gap-6">
              {jobs.map((job) => (
                <div 
                  key={job.job_id} 
                  className="bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-xl hover:shadow-blue-500/5 hover:border-blue-200 transition-all group relative"
                >
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                    <div className="flex-1">
                      {/* Job Header */}
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-blue-50 text-blue-600 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
                          <Briefcase size={24} />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                            {job.title}
                          </h3>
                          <div className="flex items-center gap-3 mt-1 text-slate-500 text-sm">
                            <span className="flex items-center gap-1 font-medium italic text-blue-600/80">
                              Top Company
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <MapPin size={14} /> Remote / Flexible
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="mt-4 text-slate-600 leading-relaxed max-w-3xl">
                        {job.description}
                      </p>

                      {/* Skills Tags */}
                      <div className="flex flex-wrap gap-2 mt-5">
                        {job.skills.split(",").map((skill, i) => (
                          <span 
                            key={i}
                            className="px-3 py-1 bg-slate-50 text-slate-600 text-xs font-semibold rounded-full border border-slate-100 flex items-center gap-1.5"
                          >
                            <Code size={12} className="text-slate-400" />
                            {skill.trim()}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Action Side */}
                    <div className="flex flex-row md:flex-col items-center justify-end gap-3 min-w-[140px]">
                      <button
                        onClick={() => applyJob(job)}
                        disabled={applyingId === job.job_id}
                        className="w-full inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-blue-600 text-white px-6 py-3 rounded-xl text-sm font-bold shadow-sm transition-all transform active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                      >
                        {applyingId === job.job_id ? (
                          <Loader2 size={16} className="animate-spin" />
                        ) : (
                          <Send size={16} />
                        )}
                        {applyingId === job.job_id ? "Applying..." : "Apply Now"}
                      </button>
                      <button className="p-3 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-xl transition-all">
                        <ExternalLink size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white border-2 border-dashed border-slate-200 rounded-3xl p-20 text-center">
              <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                <Briefcase size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-800">No vacancies found</h3>
              <p className="text-slate-500 mt-1">Check back later for new opportunities!</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default CareerOpportunities;