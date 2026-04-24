import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { 
  CheckCircle2, 
  ChevronRight, 
  BookOpen, 
  Lightbulb, 
  Target, 
  Zap,
  ExternalLink,
  Circle
} from "lucide-react";

function Roadmaps() {
  const [role, setRole] = useState("");
  const [data, setData] = useState([]);
  const [expanded, setExpanded] = useState(null);
  const [checked, setChecked] = useState({});
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);

  // Load initial state
  useEffect(() => {
    const lastRole = localStorage.getItem("last_role");
    if (lastRole) {
      setRole(lastRole);
      loadRoadmap(lastRole);
    }
  }, []);

  // Sync checkboxes with localStorage
  useEffect(() => {
    if (role) {
      const saved = JSON.parse(localStorage.getItem("progress_" + role)) || {};
      setChecked(saved);
    }
  }, [role]);

  // Calculate progress and save to dashboard
  useEffect(() => {
    if (role && data.length > 0) {
      localStorage.setItem("progress_" + role, JSON.stringify(checked));
      calculateProgress();
    }
  }, [checked, data]);

  const loadRoadmap = async (selectedRole) => {
    const r = selectedRole || role;
    if (!r) return;
    
    setLoading(true);
    try {
      localStorage.setItem("last_role", r);
      const res = await axios.get(`http://127.0.0.1:5000/roadmap/${r}`);
      setData(res.data);
      setExpanded(null);
    } catch (err) {
      console.error("Failed to load roadmap", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleTopic = (key) => {
    setChecked(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const calculateProgress = () => {
    let total = 0, done = 0;
    data.forEach((module, mIdx) => {
      module.topics.forEach((_, tIdx) => {
        total++;
        if (checked[`${mIdx}-${tIdx}`]) done++;
      });
    });
    const result = total === 0 ? 0 : Math.round((done / total) * 100);
    setProgress(result);
    
    // Save to global dashboard progress
    let dashboard = JSON.parse(localStorage.getItem("dashboard_progress")) || {};
    dashboard[role] = result;
    localStorage.setItem("dashboard_progress", JSON.stringify(dashboard));
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-900">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6 lg:p-10">
          
          <div className="max-w-5xl mx-auto">
            {/* TOP HEADER & SELECTOR */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">Career Roadmap</h1>
                <p className="text-slate-500 mt-1 flex items-center gap-2">
                  <Target size={16} className="text-indigo-500" />
                  Your personalized path to technical mastery.
                </p>
              </div>

              <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl shadow-sm border border-slate-200">
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="bg-transparent font-medium text-slate-700 outline-none px-4 py-2 cursor-pointer min-w-[200px]"
                >
                  <option value="">Choose Career Path</option>
                  <option value="ai">AI Engineer</option>
                  <option value="frontend">Frontend Developer</option>
                  <option value="backend">Backend Developer</option>
                  <option value="fullstack">Fullstack Developer</option>
                  <option value="data_science">Data Scientist</option>
                  <option value="cybersecurity">Cybersecurity</option>
                </select>
                <button
                  onClick={() => loadRoadmap()}
                  className="bg-slate-900 hover:bg-indigo-600 text-white font-bold px-6 py-2.5 rounded-xl transition-all flex items-center gap-2"
                >
                  <Zap size={18} />
                  Start
                </button>
              </div>
            </div>

            {/* PROGRESS OVERVIEW */}
            {role && (
              <div className="mb-12 bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600 font-bold">
                      {progress}%
                    </div>
                    <span className="font-bold text-slate-700 uppercase tracking-widest text-xs">Curriculum Mastery</span>
                  </div>
                  <span className="text-xs font-bold text-slate-400">Step {data.length > 0 ? "1" : "0"} of {data.length} Modules</span>
                </div>
                <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                  <div
                    className="bg-indigo-600 h-full rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}

            {/* ROADMAP GRID */}
            {loading ? (
              <div className="flex justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-20">
                {data.map((module, mIdx) => (
                  <div 
                    key={mIdx}
                    className={`group relative bg-white rounded-3xl border transition-all duration-300 ${
                      expanded === mIdx 
                      ? 'border-indigo-400 shadow-xl ring-4 ring-indigo-50' 
                      : 'border-slate-200 hover:border-indigo-300 shadow-sm'
                    }`}
                  >
                    {/* Module Summary Area */}
                    <div 
                      onClick={() => setExpanded(expanded === mIdx ? null : mIdx)}
                      className="p-6 cursor-pointer flex items-center justify-between"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg transition-colors
                          ${expanded === mIdx ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500 group-hover:bg-indigo-50 group-hover:text-indigo-600'}`}>
                          {mIdx + 1}
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-800 text-lg leading-tight">{module.title}</h3>
                          <p className="text-xs text-slate-400 mt-1 uppercase font-bold tracking-tighter">
                            {module.topics.length} Key Topics
                          </p>
                        </div>
                      </div>
                      <ChevronRight className={`transition-transform duration-300 ${expanded === mIdx ? 'rotate-90 text-indigo-600' : 'text-slate-300'}`} />
                    </div>

                    {/* Detailed Curriculum Section */}
                    {expanded === mIdx && (
                      <div className="px-6 pb-8 pt-2 animate-in fade-in slide-in-from-top-2 duration-300">
                        <div className="h-px bg-slate-100 mb-6 w-full" />
                        
                        <div className="space-y-4 mb-8">
                          <h4 className="flex items-center gap-2 text-xs font-bold text-indigo-600 uppercase tracking-widest mb-4">
                            <Lightbulb size={14} /> Core Topics
                          </h4>
                          {module.topics.map((topic, tIdx) => (
                            <div 
                              key={tIdx}
                              onClick={() => toggleTopic(`${mIdx}-${tIdx}`)}
                              className="flex items-center gap-3 cursor-pointer group/item"
                            >
                              {checked[`${mIdx}-${tIdx}`] ? (
                                <CheckCircle2 className="text-emerald-500 transition-all scale-110" size={20} />
                              ) : (
                                <Circle className="text-slate-300 group-hover/item:text-indigo-400 transition-colors" size={20} />
                              )}
                              <span className={`text-sm transition-all ${checked[`${mIdx}-${tIdx}`] ? 'text-slate-400 line-through' : 'text-slate-700 font-medium'}`}>
                                {topic}
                              </span>
                            </div>
                          ))}
                        </div>

                        {/* Resources */}
                        <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                          <h4 className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">
                            <BookOpen size={14} /> Learning Assets
                          </h4>
                          <div className="space-y-2">
                            {module.links.map((link, lIdx) => (
                              <a 
                                key={lIdx} 
                                href={link} 
                                target="_blank" 
                                rel="noreferrer" 
                                className="flex items-center justify-between text-indigo-600 hover:text-indigo-800 text-sm font-bold bg-white p-3 rounded-xl border border-slate-200 transition-all hover:shadow-md"
                              >
                                <span>Official Guide</span>
                                <ExternalLink size={14} />
                              </a>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

        </main>
      </div>
    </div>
  );
}

export default Roadmaps;