import React, { useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Users, 
  Search, 
  FileText, 
  ChevronRight, 
  UserCheck, 
  AlertCircle 
} from "lucide-react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

function Applicants() {
  const [jobId, setJobId] = useState("");
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadApplicants = async () => {
    if (!jobId) return;
    setLoading(true);
    try {
      const res = await axios.get(`http://127.0.0.1:5000/applicants/${jobId}`);
      setApps(res.data);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#f8fafc] min-h-screen">
      <Navbar />
      <div className="flex">
        <Sidebar />

        <main className="flex-1 p-8">
          <div className="max-w-5xl mx-auto">
            
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
              <div>
                <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
                  <span className="p-2 bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-100">
                    <Users size={24} />
                  </span>
                  Job Applicants
                </h2>
                <p className="text-slate-500 mt-2 font-medium">Review and manage candidate submissions by Job ID.</p>
              </div>

              {/* Enhanced Search Control */}
              <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl shadow-sm border border-slate-200 focus-within:ring-4 focus-within:ring-blue-500/10 transition-all">
                <div className="flex items-center gap-2 px-3">
                  <Search size={18} className="text-slate-400" />
                  <input
                    placeholder="Enter Job ID..."
                    className="bg-transparent border-none outline-none text-slate-700 font-semibold placeholder:text-slate-400 w-40"
                    onChange={(e) => setJobId(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && loadApplicants()}
                  />
                </div>
                <button
                  onClick={loadApplicants}
                  disabled={loading}
                  className="bg-slate-900 hover:bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  {loading ? "Loading..." : "Filter"}
                </button>
              </div>
            </div>

            {/* Results Table Section */}
            <AnimatePresence mode="wait">
              {apps.length > 0 ? (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden"
                >
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50/50 border-b border-slate-100 text-slate-400 uppercase text-[11px] font-bold tracking-widest">
                        <th className="px-8 py-5">Applicant Reference</th>
                        <th className="px-8 py-5">Compatibility Score</th>
                        <th className="px-8 py-5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {apps.map((app, index) => (
                        <tr key={index} className="hover:bg-blue-50/30 transition-colors group">
                          <td className="px-8 py-5">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                                <UserCheck size={20} />
                              </div>
                              <div>
                                <p className="font-bold text-slate-800">Student #{app.student_id}</p>
                                <p className="text-xs text-slate-400">Application ID: {Math.random().toString(36).substr(2, 6).toUpperCase()}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-8 py-5">
                            <div className="flex items-center gap-3">
                              <div className="w-full max-w-[120px] bg-slate-100 h-2 rounded-full overflow-hidden">
                                <motion.div 
                                  initial={{ width: 0 }}
                                  animate={{ width: `${app.match_score}%` }}
                                  className={`h-full rounded-full ${getScoreColor(app.match_score)}`}
                                />
                              </div>
                              <span className={`text-sm font-black ${getScoreTextColor(app.match_score)}`}>
                                {Math.round(app.match_score)}%
                              </span>
                            </div>
                          </td>
                          <td className="px-8 py-5 text-right">
                            <button className="inline-flex items-center gap-2 text-slate-400 hover:text-blue-600 font-bold text-sm transition-all">
                              View Profile
                              <ChevronRight size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </motion.div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
                  <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 text-slate-300">
                    <FileText size={32} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-800">No applicants to display</h3>
                  <p className="text-slate-500 text-sm max-w-xs text-center mt-1">
                    Enter a valid Job ID above to retrieve the list of qualified candidates.
                  </p>
                </div>
              )}
            </AnimatePresence>

          </div>
        </main>
      </div>
    </div>
  );
}

// Logic for color-coding scores
const getScoreColor = (score) => {
  if (score >= 80) return "bg-emerald-500";
  if (score >= 50) return "bg-blue-500";
  return "bg-rose-500";
};

const getScoreTextColor = (score) => {
  if (score >= 80) return "text-emerald-600";
  if (score >= 50) return "text-blue-600";
  return "text-rose-600";
};

export default Applicants;