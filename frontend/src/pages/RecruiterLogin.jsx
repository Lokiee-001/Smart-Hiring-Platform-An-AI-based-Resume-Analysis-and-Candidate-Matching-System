import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LockKeyhole, 
  Mail, 
  ChevronRight, 
  ShieldCheck,
  Building2,
  Sparkles,
  Command
} from "lucide-react";

function RecruiterLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post("http://127.0.0.1:5000/login", {
        email: email,
        password: password,
      });
      if (res.data.role === "recruiter") {
        localStorage.setItem("role", "recruiter");
        localStorage.setItem("email", res.data.email);
        localStorage.setItem("user_id", res.data.user_id);
        navigate("/recruiter-dashboard");
      }
    } catch (err) {
      alert("Invalid login credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050505] relative overflow-hidden font-sans selection:bg-emerald-500/30">
      
      {/* --- CINEMATIC BACKGROUND --- */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Subtle Mesh Gradient */}
        <motion.div 
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3] 
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-[20%] -right-[10%] w-[600px] h-[600px] bg-emerald-900/20 rounded-full blur-[120px]" 
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.4, 0.2] 
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute -bottom-[20%] -left-[10%] w-[500px] h-[500px] bg-blue-900/10 rounded-full blur-[100px]" 
        />
        {/* Grid Overlay */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] brightness-100 contrast-150" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-[440px] w-full px-6 relative z-10"
      >
        {/* BRANDING */}
        <div className="flex flex-col items-center mb-12">
          <motion.div 
            whileHover={{ rotate: 90 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="w-14 h-14 bg-white/[0.03] border border-white/10 text-emerald-500 rounded-2xl flex items-center justify-center mb-6 shadow-2xl backdrop-blur-md"
          >
            <Command size={28} />
          </motion.div>
          <h1 className="text-4xl font-bold text-white tracking-tight mb-2">
            Recruiter <span className="text-emerald-500">Hub</span>
          </h1>
          <p className="text-slate-500 text-sm font-medium tracking-wide">
            Enterprise Talent Management System
          </p>
        </div>

        {/* GLASS CARD */}
        <div className="bg-[#0f0f11]/80 backdrop-blur-3xl p-8 md:p-10 rounded-[2.5rem] border border-white/[0.08] shadow-[0_22px_70px_-10px_rgba(0,0,0,0.7)]">
          <form onSubmit={handleLogin} className="space-y-6">
            
            {/* EMAIL */}
            <div className="space-y-2.5">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">
                Corporate Identity
              </label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-emerald-500 transition-colors">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  placeholder="name@enterprise.com"
                  className="w-full pl-12 pr-4 py-4 bg-white/[0.02] border border-white/[0.05] rounded-2xl focus:bg-white/[0.04] focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all text-white placeholder:text-slate-700"
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div className="space-y-2.5">
              <div className="flex justify-between items-center px-1">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
                  Security Key
                </label>
                <button type="button" className="text-[10px] font-bold text-emerald-500 hover:text-emerald-400 transition-colors">
                  Recovery
                </button>
              </div>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-emerald-500 transition-colors">
                  <LockKeyhole size={18} />
                </div>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-4 bg-white/[0.02] border border-white/[0.05] rounded-2xl focus:bg-white/[0.04] focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all text-white placeholder:text-slate-700"
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* ACTION */}
            <motion.button
              whileHover={{ scale: 1.01, backgroundColor: "#10b981" }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
              className="w-full bg-emerald-600 text-white font-bold py-4 rounded-2xl shadow-2xl shadow-emerald-900/20 transition-all flex items-center justify-center gap-3 mt-4 disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span className="tracking-tight">Authorize Access</span>
                  <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </motion.button>
          </form>

          {/* TRUST FOOTER */}
          <div className="mt-10 pt-8 border-t border-white/5 flex flex-col items-center gap-5">
            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-600 uppercase tracking-widest">
              <ShieldCheck size={14} className="text-emerald-500/50" />
              AES-256 Cloud Infrastructure
            </div>
          </div>
        </div>

        {/* LOGOUT / REDIRECT */}
        <div className="mt-12 text-center flex items-center justify-center gap-3">
            <div className="h-[1px] w-8 bg-white/5" />
            <p className="text-[10px] text-slate-600 uppercase tracking-[0.4em] font-black">
                Smart Hiring Platform
            </p>
            <div className="h-[1px] w-8 bg-white/5" />
        </div>
      </motion.div>
    </div>
  );
}

export default RecruiterLogin;