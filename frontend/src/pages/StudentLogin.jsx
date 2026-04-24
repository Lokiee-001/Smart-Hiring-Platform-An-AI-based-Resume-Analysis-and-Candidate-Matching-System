import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { GraduationCap, Mail, Lock, LogIn, Eye, EyeOff, Sparkles, ChevronRight, ShieldCheck } from "lucide-react";

function StudentLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await axios.post("http://127.0.0.1:5000/login", {
        email,
        password
      });

      console.log(res.data);

      if (res.data.role === "student") {
        localStorage.setItem("role", "student");
        localStorage.setItem("user_id", res.data.user_id);
        localStorage.setItem("isLoggedIn", "true");
        navigate("/student-dashboard");
      }
    } catch (error) {
      alert("Invalid login credentials");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-[#0a0a0c] selection:bg-indigo-500/30">
      
      {/* --- PREMIUM MESH BACKGROUND --- */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 40, 0],
            y: [0, 20, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-[10%] -left-[10%] w-[60%] h-[60%] rounded-full bg-indigo-900/20 blur-[120px]"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            x: [0, -50, 0],
            y: [0, 40, 0],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-purple-900/20 blur-[120px]"
        />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-30 pointer-events-none"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-[440px] px-6"
      >
        {/* TOP BRANDING */}
        <div className="flex flex-col items-center mb-10">
          <motion.div 
            whileHover={{ scale: 1.05, rotate: 5 }}
            className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(79,70,229,0.4)] mb-6 border border-white/10"
          >
            <GraduationCap className="w-8 h-8 text-white" />
          </motion.div>
          <h1 className="text-3xl font-black text-white tracking-tight mb-2">Welcome Back</h1>
          <p className="text-slate-400 text-sm">Secure access to your student career portal</p>
        </div>

        {/* LOGIN CARD */}
        <div className="bg-white/[0.03] backdrop-blur-2xl border border-white/[0.08] rounded-[2.5rem] p-8 md:p-10 shadow-2xl shadow-black/50">
          <form onSubmit={handleLogin} className="space-y-5">
            
            {/* EMAIL INPUT */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                <input
                  type="email"
                  required
                  placeholder="name@university.edu"
                  className="w-full bg-white/[0.03] border border-white/[0.1] text-white pl-12 pr-4 py-4 rounded-2xl focus:outline-none focus:border-indigo-500/50 focus:bg-white/[0.06] transition-all placeholder:text-slate-600"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* PASSWORD INPUT */}
            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Password</label>
                <button type="button" className="text-[10px] font-bold text-indigo-400 hover:text-indigo-300 transition-colors">Forgot Password?</button>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  className="w-full bg-white/[0.03] border border-white/[0.1] text-white pl-12 pr-12 py-4 rounded-2xl focus:outline-none focus:border-indigo-500/50 focus:bg-white/[0.06] transition-all placeholder:text-slate-600"
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* SUBMIT BUTTON */}
            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-4 rounded-2xl font-bold transition-all shadow-[0_10px_25px_-5px_rgba(79,70,229,0.4)] flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed mt-4"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Sign In</span>
                  <ChevronRight size={18} />
                </>
              )}
            </motion.button>
          </form>

          {/* EXTRA FOOTER ACTIONS */}
          <div className="mt-8 pt-8 border-t border-white/5 flex flex-col items-center gap-4">
            <button className="text-slate-400 text-sm hover:text-white transition-colors">
              New here? <span className="text-indigo-400 font-bold underline underline-offset-4">Request Access</span>
            </button>
            
            <div className="flex items-center gap-2 text-[10px] text-slate-600 font-bold uppercase tracking-tighter">
              <ShieldCheck size={12} className="text-emerald-500/50" />
              AES-256 Multi-layer Encryption Active
            </div>
          </div>
        </div>

        {/* SUBTLE COPYRIGHT */}
        <p className="text-center mt-10 text-slate-600 text-[10px] uppercase tracking-[0.3em]">
          © 2026 SMART HIRING ECOSYSTEM
        </p>
      </motion.div>
    </div>
  );
}

export default StudentLogin;