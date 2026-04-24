import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Users, 
  ExternalLink, 
  Search, 
  GraduationCap, 
  Award,
  Filter
} from "lucide-react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

function Participants() {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    loadParticipants();
  }, []);

  const loadParticipants = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:5000/all_participants");
      setData(res.data);
    } catch (err) {
      console.error("Error loading participants:", err);
    }
  };

  const filteredData = data.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.degree.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-[#f8fafc] min-h-screen font-sans">
      <Navbar />

      <div className="flex">
        <Sidebar />

        <main className="p-8 flex-1 max-w-[1400px] mx-auto">
          {/* Header & Stats Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div>
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
                <Users className="text-blue-600" size={28} />
                Participants Directory
              </h2>
              <p className="text-slate-500 mt-1 font-medium">
                Manage and review all registered candidates in the system.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text"
                  placeholder="Search by name or degree..."
                  className="pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none w-64 transition-all shadow-sm"
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
                <Filter size={20} />
              </button>
            </div>
          </div>

          {/* Table Container */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100 text-slate-400 uppercase text-[11px] font-bold tracking-widest">
                    <th className="px-8 py-5">Participant Details</th>
                    <th className="px-8 py-5">Academic Background</th>
                    <th className="px-8 py-5">Performance</th>
                    <th className="px-8 py-5 text-right">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-50">
                  {filteredData.length > 0 ? (
                    filteredData.map((p, i) => (
                      <motion.tr 
                        key={i} 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.03 }}
                        className="hover:bg-blue-50/30 transition-colors group cursor-default"
                      >
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-100 to-indigo-100 flex items-center justify-center text-blue-700 font-bold text-sm border border-blue-200">
                              {p.name.charAt(0)}
                            </div>
                            <div>
                              <p className="font-bold text-slate-800 text-sm">{p.name}</p>
                              <p className="text-xs text-slate-400">ID: #{p.id || i + 101}</p>
                            </div>
                          </div>
                        </td>
                        
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-2">
                            <GraduationCap size={16} className="text-slate-400" />
                            <span className="text-sm font-semibold text-slate-600">{p.degree}</span>
                          </div>
                        </td>

                        <td className="px-8 py-5">
                          <div className="flex items-center gap-3">
                            <div className="w-full max-w-[100px] bg-slate-100 h-2 rounded-full overflow-hidden">
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${p.percent}%` }}
                                className={`h-full rounded-full ${getScoreColor(p.percent)}`}
                              />
                            </div>
                            <span className={`text-xs font-black ${getScoreTextColor(p.percent)}`}>
                              {p.percent}%
                            </span>
                          </div>
                        </td>

                        <td className="px-8 py-5 text-right">
                          <button
                            onClick={() => navigate(`/participant/${p.id}`)}
                            className="inline-flex items-center gap-2 bg-slate-900 hover:bg-blue-600 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-lg shadow-slate-200 transform active:scale-95 group-hover:bg-blue-600"
                          >
                            View Profile
                            <ExternalLink size={14} />
                          </button>
                        </td>
                      </motion.tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="py-20 text-center">
                        <div className="flex flex-col items-center">
                          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                            <Users className="text-slate-300" size={32} />
                          </div>
                          <h3 className="text-slate-800 font-bold">No participants found</h3>
                          <p className="text-slate-400 text-sm">Try adjusting your search criteria</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
}

// Helper functions for dynamic UI coloring
const getScoreColor = (score) => {
  if (score >= 80) return "bg-emerald-500";
  if (score >= 60) return "bg-blue-500";
  if (score >= 40) return "bg-amber-500";
  return "bg-rose-500";
};

const getScoreTextColor = (score) => {
  if (score >= 80) return "text-emerald-600";
  if (score >= 60) return "text-blue-600";
  if (score >= 40) return "text-amber-600";
  return "text-rose-600";
};

export default Participants;