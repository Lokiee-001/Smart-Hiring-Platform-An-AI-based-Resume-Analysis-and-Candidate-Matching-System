import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Users, 
  UserCheck, 
  Activity, 
  Search, 
  MoreVertical, 
  ArrowUpRight, 
  Filter 
} from "lucide-react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

function RecruiterDashboard() {
  const [users, setUsers] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [usersRes, candidatesRes] = await Promise.all([
        axios.get("http://127.0.0.1:5000/all_users"),
        axios.get("http://127.0.0.1:5000/candidate_details")
      ]);
      setUsers(usersRes.data);
      setCandidates(candidatesRes.data);
    } catch (err) {
      console.error("Data fetch error", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredUsers = users.filter(u => 
    u.username.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-[#f8fafc] min-h-screen font-sans text-slate-900">
      <Navbar />
      
      <div className="flex">
        <Sidebar />

        <main className="p-8 flex-1 max-w-[1600px] mx-auto">
          {/* Header Area */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div>
              <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
                Recruiter Overview
              </h2>
              <p className="text-slate-500 mt-1 font-medium">Manage users and track candidate performance.</p>
            </div>
            <button 
              onClick={loadData}
              className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-all shadow-sm"
            >
              <Activity size={16} className="text-blue-500" />
              Refresh Data
            </button>
          </div>

          {/* 📊 METRIC CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <MetricCard 
              title="Total Users" 
              value={users.length} 
              icon={<Users className="text-blue-600" />} 
              color="bg-blue-600" 
            />
            <MetricCard 
              title="Active Candidates" 
              value={candidates.length} 
              icon={<UserCheck className="text-emerald-600" />} 
              color="bg-emerald-600" 
            />
            <MetricCard 
              title="System Status" 
              value="Operational" 
              icon={<Activity className="text-purple-600" />} 
              color="bg-purple-600" 
              isStatus
            />
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            
            {/* 👤 USERS TABLE SECTION */}
            <section className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-white">
                <h3 className="font-bold text-lg text-slate-800">Platform Users</h3>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                  <input 
                    type="text" 
                    placeholder="Search users..."
                    className="pl-9 pr-4 py-2 bg-slate-50 border-none rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 outline-none w-48 transition-all"
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="text-slate-400 uppercase text-[11px] font-bold tracking-widest bg-slate-50/50">
                      <th className="px-6 py-4">User Details</th>
                      <th className="px-6 py-4">Role</th>
                      <th className="px-6 py-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {filteredUsers.map((u, i) => (
                      <motion.tr 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }}
                        key={i} 
                        className="hover:bg-blue-50/30 transition-colors group"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-xs">
                              {u.username.charAt(0)}
                            </div>
                            <div>
                              <p className="font-semibold text-slate-800 text-sm">{u.username}</p>
                              <p className="text-xs text-slate-400">{u.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                            u.role === 'recruiter' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                          }`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button className="text-slate-300 hover:text-slate-600 transition-colors">
                            <MoreVertical size={18} />
                          </button>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* 🎯 CANDIDATE PERFORMANCE SECTION */}
            <section className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="p-6 border-b border-slate-50 flex items-center justify-between">
                <h3 className="font-bold text-lg text-slate-800">Candidate Insights</h3>
                <Filter size={16} className="text-slate-400 cursor-pointer" />
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="text-slate-400 uppercase text-[11px] font-bold tracking-widest bg-slate-50/50">
                      <th className="px-6 py-4">Candidate</th>
                      <th className="px-6 py-4 text-center">ATS Match</th>
                      <th className="px-6 py-4 text-center">Exam Score</th>
                      <th className="px-6 py-4">Target Roles</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {candidates.map((c, i) => (
                      <tr key={i} className="hover:bg-emerald-50/30 transition-colors">
                        <td className="px-6 py-4">
                          <p className="font-semibold text-slate-800 text-sm">{c.name}</p>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center">
                            <div className={`text-xs font-bold w-12 h-12 rounded-full border-4 flex items-center justify-center ${getAtsColor(c.ats)}`}>
                              {c.ats}%
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="font-mono font-bold text-slate-700 bg-slate-100 px-3 py-1 rounded-md">
                            {c.exam_score}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-1">
                            {c.applied_jobs.slice(0, 2).map((job, idx) => (
                              <span key={idx} className="text-[10px] bg-slate-50 text-slate-500 border border-slate-200 px-2 py-0.5 rounded">
                                {job}
                              </span>
                            ))}
                            {c.applied_jobs.length > 2 && <span className="text-[10px] text-slate-400">+{c.applied_jobs.length - 2}</span>}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}

// Reusable Metric Card Component
function MetricCard({ title, value, icon, color, isStatus = false }) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-5 transition-transform hover:-translate-y-1">
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center bg-opacity-10 ${color.replace('bg-', 'bg-opacity-10 text-')}`}>
        {React.cloneElement(icon, { size: 28 })}
      </div>
      <div>
        <p className="text-slate-500 text-sm font-semibold uppercase tracking-wider">{title}</p>
        <div className="flex items-baseline gap-2">
          <h4 className="text-2xl font-bold text-slate-900">{value}</h4>
          {!isStatus && <span className="text-emerald-500 text-xs font-bold flex items-center"><ArrowUpRight size={12}/> 12%</span>}
        </div>
      </div>
    </div>
  );
}

// Logic for ATS semantic coloring
const getAtsColor = (score) => {
  if (score >= 80) return "border-emerald-500 text-emerald-600 bg-emerald-50";
  if (score >= 50) return "border-amber-500 text-amber-600 bg-amber-50";
  return "border-rose-500 text-rose-600 bg-rose-50";
};

export default RecruiterDashboard;