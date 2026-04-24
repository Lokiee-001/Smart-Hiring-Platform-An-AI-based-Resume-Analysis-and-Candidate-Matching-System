import React, { useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  Users, 
  Target, 
  ChevronRight, 
  Trophy, 
  Filter,
  ArrowRightCircle
} from "lucide-react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

function CandidateMatches() {
  const [jobId, setJobId] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchMatches = async () => {
    if (!jobId) return;
    setLoading(true);
    try {
      const res = await axios.get(`http://127.0.0.1:5000/match_candidates/${jobId}`);
      setResults(res.data);
    } catch (err) {
      console.error("Error fetching matches", err);
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
          <div className="max-w-6xl mx-auto">
            
            {/* Header Section */}
            <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
                  <span className="p-2.5 bg-green-600 text-white rounded-xl shadow-lg shadow-green-200">
                    <Target size={24} />
                  </span>
                  Smart Match Engine
                </h2>
                <p className="text-slate-500 mt-2 font-medium">Identify top talent based on AI-driven job requirements matching.</p>
              </div>

              {/* Enhanced Search Bar */}
              <div className="flex items-center gap-3 bg-white p-2 rounded-2xl shadow-sm border border-slate-200 w-full md:w-96 transition-all focus-within:ring-4 focus-within:ring-green-500/10 focus-within:border-green-500">
                <Search className="text-slate-400 ml-2" size={20} />
                <input
                  placeholder="Enter Job ID (e.g. 101)..."
                  className="bg-transparent border-none outline-none w-full text-slate-700 font-medium placeholder:text-slate-400"
                  onChange={(e) => setJobId(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && fetchMatches()}
                />
                <button
                  onClick={fetchMatches}
                  disabled={loading}
                  className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-xl font-bold transition-all flex items-center gap-2 whitespace-nowrap disabled:opacity-50"
                >
                  {loading ? "Matching..." : "Find Matches"}
                </button>
              </div>
            </header>

            {/* Results Section */}
            <AnimatePresence mode="wait">
              {results.length > 0 ? (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden"
                >
                  <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                    <h3 className="font-bold text-slate-800 flex items-center gap-2">
                      <Users size={18} className="text-green-600" />
                      Matched Candidates ({results.length})
                    </h3>
                    <button className="text-slate-400 hover:text-slate-600">
                      <Filter size={18} />
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="text-slate-400 uppercase text-[11px] font-bold tracking-widest border-b border-slate-50">
                          <th className="px-8 py-5">Rank & Candidate</th>
                          <th className="px-8 py-5">Technical Skills</th>
                          <th className="px-8 py-5 text-center">Match Confidence</th>
                          <th className="px-8 py-5 text-right">Profile</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {results.map((r, index) => (
                          <motion.tr 
                            key={index}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: index * 0.05 }}
                            className="hover:bg-slate-50/80 transition-colors group"
                          >
                            <td className="px-8 py-5">
                              <div className="flex items-center gap-4">
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                                  index === 0 ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-500"
                                }`}>
                                  #{index + 1}
                                </div>
                                <div>
                                  <p className="font-bold text-slate-800 tracking-tight">Student ID: {r.student_id}</p>
                                  <p className="text-xs text-slate-400 uppercase font-bold tracking-tighter">Verified Candidate</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-8 py-5">
                              <div className="flex flex-wrap gap-1.5 max-w-xs">
                                {r.skills.split(',').map((skill, i) => (
                                  <span key={i} className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-600 border border-blue-100 uppercase">
                                    {skill.trim()}
                                  </span>
                                ))}
                              </div>
                            </td>
                            <td className="px-8 py-5">
                              <div className="flex flex-col items-center gap-1">
                                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden max-w-[100px]">
                                  <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: `${r.match_score}%` }}
                                    className={`h-full ${getScoreColor(r.match_score)}`}
                                  />
                                </div>
                                <span className={`text-sm font-black ${getScoreTextColor(r.match_score)}`}>
                                  {r.match_score}%
                                </span>
                              </div>
                            </td>
                            <td className="px-8 py-5 text-right">
                              <button className="p-2 text-slate-300 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all">
                                <ArrowRightCircle size={22} />
                              </button>
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              ) : (
                <div className="flex flex-col items-center justify-center py-24 bg-white rounded-3xl border-2 border-dashed border-slate-200">
                  <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                    <Trophy size={40} className="text-slate-200" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800">Ready to Match?</h3>
                  <p className="text-slate-500 max-w-sm text-center mt-2">
                    Enter a Job ID above to see which candidates best fit the required technical stack.
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

// Helper functions for dynamic UI coloring
const getScoreColor = (score) => {
  if (score >= 80) return "bg-green-500";
  if (score >= 50) return "bg-amber-500";
  return "bg-rose-500";
};

const getScoreTextColor = (score) => {
  if (score >= 80) return "text-green-600";
  if (score >= 50) return "text-amber-600";
  return "text-rose-600";
};

export default CandidateMatches;