import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { 
  Briefcase, 
  Code, 
  CheckCircle2, 
  TrendingUp, 
  Search,
  ArrowUpRight
} from "lucide-react";

function AppliedJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:5000/applied_jobs/1");
      setJobs(res.data);
    } catch (err) {
      console.error("Error loading applied jobs", err);
    } finally {
      setLoading(false);
    }
  };

  // Helper to determine match score color
  const getScoreColor = (score) => {
    if (score >= 80) return "text-emerald-600 bg-emerald-50 border-emerald-100";
    if (score >= 50) return "text-amber-600 bg-amber-50 border-amber-100";
    return "text-slate-600 bg-slate-50 border-slate-100";
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar />
      <div className="flex">
        <Sidebar />

        <main className="flex-1 p-6 lg:p-10">
          <div className="max-w-6xl mx-auto">
            
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
              <div>
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
                  <CheckCircle2 className="text-indigo-600" size={32} />
                  Application History
                </h1>
                <p className="text-slate-500 mt-1">Track the status and match compatibility of your submissions.</p>
              </div>
              
              <div className="bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
                <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">Total Applications:</span>
                <span className="text-lg font-black text-indigo-600">{jobs.length}</span>
              </div>
            </div>

            {/* Main Content Area */}
            {loading ? (
              <div className="flex justify-center py-20">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
              </div>
            ) : jobs.length > 0 ? (
              <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200 overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/50 border-b border-slate-200">
                      <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-[0.1em]">
                        <div className="flex items-center gap-2"><Briefcase size={14}/> Job Role</div>
                      </th>
                      <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-[0.1em]">
                        <div className="flex items-center gap-2"><Code size={14}/> Core Skills</div>
                      </th>
                      <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-[0.1em] text-right">
                        <div className="flex items-center gap-2 justify-end"><TrendingUp size={14}/> Match Score</div>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {jobs.map((job, index) => (
                      <tr key={index} className="group hover:bg-indigo-50/30 transition-all duration-200">
                        <td className="px-8 py-6">
                          <div className="flex flex-col">
                            <span className="font-bold text-slate-800 text-lg group-hover:text-indigo-600 transition-colors flex items-center gap-2">
                              {job.title}
                              <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity text-indigo-400" />
                            </span>
                            <span className="text-xs text-slate-400 font-medium">Applied on platform</span>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex flex-wrap gap-1.5">
                            {job.skills.split(',').map((skill, i) => (
                              <span key={i} className="px-2.5 py-1 bg-white border border-slate-200 text-slate-600 text-[11px] font-bold rounded-lg shadow-sm">
                                {skill.trim()}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-8 py-6 text-right">
                          <div className={`inline-flex items-center px-4 py-1.5 rounded-full border text-sm font-black transition-all shadow-sm ${getScoreColor(job.match_score)}`}>
                            {Math.round(job.match_score)}%
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              /* Empty State */
              <div className="bg-white border-2 border-dashed border-slate-200 rounded-[3rem] py-20 text-center">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="text-slate-300" size={40} />
                </div>
                <h3 className="text-xl font-bold text-slate-800">No applications yet</h3>
                <p className="text-slate-500 mt-2 max-w-xs mx-auto">You haven't applied to any roles. Head over to the Career page to get started!</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default AppliedJobs;