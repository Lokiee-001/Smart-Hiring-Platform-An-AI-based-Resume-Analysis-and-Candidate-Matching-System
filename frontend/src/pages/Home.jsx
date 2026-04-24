import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

function Home() {
  const navigate = useNavigate();
  const [showIntro, setShowIntro] = useState(true);

  // Auto-transition from Intro to Content after 2.5 seconds
  useEffect(() => {
    const timer = setTimeout(() => setShowIntro(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative h-screen w-full overflow-hidden font-sans selection:bg-blue-100">
      
      {/* --- LIVE WALLPAPER BACKGROUND --- */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-slate-50" />
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 10, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] rounded-full bg-blue-100/50 blur-[120px]"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, -15, 0],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-indigo-100/40 blur-[120px]"
        />
      </div>

      <AnimatePresence mode="wait">
        {showIntro ? (
          /* --- PROFESSIONAL INTRO SECTION --- */
          <motion.div
            key="intro"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex h-full items-center justify-center text-center px-4"
          >
            <div className="space-y-4">
              <motion.span
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="block text-sm uppercase tracking-[0.3em] text-blue-500 font-semibold"
              >
                Welcome to
              </motion.span>
              <motion.h1
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="text-5xl md:text-7xl font-light text-slate-800"
              >
                The Future of <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Hiring</span>
              </motion.h1>
            </div>
          </motion.div>
        ) : (
          /* --- MAIN CONTENT SECTION --- */
          <motion.div
            key="content"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col items-center justify-center h-full px-6 text-center"
          >
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 tracking-tight">
                Smart Hiring Platform
              </h2>
              <p className="text-lg text-slate-500 mb-12 max-w-md mx-auto leading-relaxed">
                Empowering recruiters and candidates with 
                <span className="text-blue-600 font-medium"> AI-driven intelligence.</span>
              </p>
            </motion.div>

            {/* Login Options */}
            <div className="flex flex-col sm:flex-row gap-5 mb-12">
              <motion.button
                whileHover={{ y: -4, boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)" }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate("/student-login")}
                className="group relative bg-blue-600 text-white px-10 py-4 rounded-2xl font-semibold overflow-hidden transition-all shadow-lg"
              >
                <div className="absolute inset-0 bg-white/10 group-hover:bg-transparent transition-colors" />
                Student Login
              </motion.button>

              <motion.button
                whileHover={{ y: -4, boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)" }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate("/recruiter-login")}
                className="bg-white border-2 border-slate-200 text-slate-700 px-10 py-4 rounded-2xl font-semibold hover:border-blue-400 hover:text-blue-600 transition-all shadow-sm"
              >
                Recruiter Login
              </motion.button>
            </div>

            {/* Register Footer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="space-y-3"
            >
              <p className="text-slate-400 text-sm">New to our ecosystem?</p>
              <button
                onClick={() => navigate("/register")}
                className="text-blue-600 font-bold hover:underline underline-offset-4 decoration-2"
              >
                Join the platform today →
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Decorative Branding */}
      <div className="absolute bottom-8 w-full text-center text-[10px] uppercase tracking-widest text-slate-400 opacity-50">
        Secure • AI-Powered • Professional
      </div>
    </div>
  );
}

export default Home;