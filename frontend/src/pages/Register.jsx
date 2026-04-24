import React, { useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { User, Mail, Lock, ShieldCheck, Eye, EyeOff, GraduationCap, Briefcase } from "lucide-react";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post("http://127.0.0.1:5000/register", {
        username: name,
        email: email,
        password: password,
        role: role,
      });
      alert("Registration successful");
    } catch (err) {
      alert("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] p-6 selection:bg-blue-100">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-blue-50 blur-3xl opacity-50" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] rounded-full bg-indigo-50 blur-3xl opacity-50" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        {/* Header Section */}
        <div className="text-center mb-8">
          <motion.div 
            whileHover={{ rotate: 10 }}
            className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 text-white rounded-2xl mb-6 shadow-xl shadow-blue-200"
          >
            <ShieldCheck size={32} />
          </motion.div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Create Account</h2>
          <p className="text-slate-500 mt-2 font-medium">Join our community of professionals</p>
        </div>

        {/* Form Card */}
        <div className="bg-white p-8 rounded-3xl shadow-2xl shadow-slate-200/60 border border-slate-100">
          <form onSubmit={handleRegister} className="space-y-5">
            
            {/* Full Name */}
            <div className="group">
              <label className="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                <input
                  placeholder="John Doe"
                  className="w-full pl-11 pr-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white outline-none transition-all"
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Email Address */}
            <div className="group">
              <label className="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                <input
                  type="email"
                  placeholder="name@example.com"
                  className="w-full pl-11 pr-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white outline-none transition-all"
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="group">
              <label className="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-12 py-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white outline-none transition-all"
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Professional Role Selection (Modern Alternative to Select) */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-3 ml-1">I am a...</label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setRole("student")}
                  className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all ${
                    role === "student" 
                    ? "border-blue-500 bg-blue-50/50 text-blue-700 shadow-sm" 
                    : "border-slate-100 bg-slate-50 text-slate-500 hover:border-slate-200"
                  }`}
                >
                  <GraduationCap size={20} />
                  <span className="text-xs font-bold uppercase tracking-wider">Student</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRole("recruiter")}
                  className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all ${
                    role === "recruiter" 
                    ? "border-blue-500 bg-blue-50/50 text-blue-700 shadow-sm" 
                    : "border-slate-100 bg-slate-50 text-slate-500 hover:border-slate-200"
                  }`}
                >
                  <Briefcase size={20} />
                  <span className="text-xs font-bold uppercase tracking-wider">Recruiter</span>
                </button>
              </div>
            </div>

            {/* Register Button */}
            <motion.button 
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
              className="relative w-full bg-slate-900 hover:bg-black text-white py-3.5 rounded-xl font-bold shadow-lg shadow-slate-200 transition-all disabled:opacity-70 mt-4 overflow-hidden"
            >
              <AnimatePresence mode="wait">
                {loading ? (
                  <motion.span
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center justify-center gap-2"
                  >
                    <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating account...
                  </motion.span>
                ) : (
                  <motion.span key="normal">Register Now</motion.span>
                )}
              </AnimatePresence>
            </motion.button>

          </form>

          <p className="text-center text-sm text-slate-500 mt-8 font-medium">
            Already have an account? <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-700 underline-offset-4 hover:underline transition-all">Log in</span>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default Register;