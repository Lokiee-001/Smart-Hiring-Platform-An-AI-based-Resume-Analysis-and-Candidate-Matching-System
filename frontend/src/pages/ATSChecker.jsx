import React, { useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { 
  UploadCloud, 
  CheckCircle2, 
  AlertCircle, 
  FileText, 
  Search, 
  ChevronRight,
  Loader2,
  Sparkles
} from "lucide-react";

function ATSChecker() {
  const [file, setFile] = useState(null);
  const [score, setScore] = useState(null);
  const [skills, setSkills] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [fileName, setFileName] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const uploadResume = async () => {
    if (!file) return;
    setIsUploading(true);
    const formData = new FormData();
    formData.append("resume", file);
    formData.append("user_id", 1);

    try {
      const res = await axios.post(
        "http://127.0.0.1:5000/upload_resume",
        formData
      );
      setScore(res.data.ats_score);
      setSkills(res.data.skills);
      setSuggestions(res.data.suggested_skills);
    } catch (error) {
      console.error("Upload failed", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileName(selectedFile.name);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6 lg:p-10">
          <div className="max-w-5xl mx-auto">
            
            {/* Header Section */}
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-indigo-600 rounded-lg text-white">
                  <Search size={24} />
                </div>
                <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                  ATS Score Analysis
                </h2>
              </div>
              <p className="text-slate-500 text-lg ml-11">
                Optimize your resume for Applicant Tracking Systems using our AI-driven scanner.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Left Column: Upload & Info */}
              <div className="lg:col-span-2 space-y-6">
                
                {/* Upload Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
                  <label className="block text-sm font-semibold text-slate-700 mb-4 uppercase tracking-wider">
                    Upload Document
                  </label>
                  
                  <div className={`relative group border-2 border-dashed rounded-2xl p-10 transition-all duration-300 flex flex-col items-center justify-center
                    ${file ? 'border-indigo-400 bg-indigo-50/30' : 'border-slate-300 hover:border-indigo-400 bg-slate-50/50 hover:bg-white'}`}>
                    
                    <input
                      type="file"
                      onChange={handleFileChange}
                      accept=".pdf,.doc,.docx"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    
                    <div className={`p-4 rounded-full mb-4 transition-transform group-hover:scale-110 ${file ? 'bg-indigo-100 text-indigo-600' : 'bg-white text-slate-400 shadow-sm'}`}>
                      <UploadCloud size={32} />
                    </div>
                    
                    <div className="text-center">
                      <p className="text-slate-900 font-bold text-lg">
                        {fileName || "Drop your resume here"}
                      </p>
                      <p className="text-slate-500 text-sm mt-1">
                        Supports PDF, DOCX (Max 5MB)
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={uploadResume}
                    disabled={!file || isUploading}
                    className={`w-full mt-6 py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all transform active:scale-[0.98]
                      ${file && !isUploading
                        ? "bg-slate-900 text-white shadow-xl shadow-slate-200 hover:bg-indigo-600" 
                        : "bg-slate-100 text-slate-400 cursor-not-allowed"}`}
                  >
                    {isUploading ? (
                      <Loader2 className="animate-spin" size={20} />
                    ) : (
                      <Sparkles size={20} />
                    )}
                    {isUploading ? "Processing Analysis..." : "Analyze Resume"}
                  </button>
                </div>

                {/* Skills Analysis */}
                {(skills.length > 0 || suggestions.length > 0) && (
                  <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="border-b border-slate-100 p-6 bg-slate-50/50">
                      <h3 className="font-bold text-slate-800 flex items-center gap-2">
                        <FileText size={18} className="text-indigo-500" />
                        Detailed Keyword Analysis
                      </h3>
                    </div>
                    
                    <div className="p-8 space-y-8">
                      {/* Detected */}
                      <div>
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                          <CheckCircle2 size={14} className="text-emerald-500" />
                          Identified Competencies
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {skills.map((skill, i) => (
                            <span key={i} className="px-4 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-lg text-sm font-semibold">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Missing */}
                      <div>
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                          <AlertCircle size={14} className="text-amber-500" />
                          Recommended Additions
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {suggestions.map((skill, i) => (
                            <span key={i} className="px-4 py-1.5 bg-amber-50 text-amber-700 border border-amber-100 rounded-lg text-sm font-semibold flex items-center gap-1.5">
                              <ChevronRight size={14} className="opacity-50" />
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column: Score & Performance */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 sticky top-8">
                  <h3 className="text-center font-bold text-slate-800 mb-8 uppercase text-xs tracking-widest">
                    Overall Compatibility
                  </h3>
                  
                  <div className="relative flex items-center justify-center mb-8">
                    {/* Radial Progress Simulation */}
                    <svg className="w-48 h-48 transform -rotate-90">
                      <circle
                        cx="96" cy="96" r="88"
                        stroke="currentColor" strokeWidth="12"
                        fill="transparent" className="text-slate-100"
                      />
                      <circle
                        cx="96" cy="96" r="88"
                        stroke="currentColor" strokeWidth="12"
                        fill="transparent"
                        strokeDasharray={552.9}
                        strokeDashoffset={score ? 552.9 - (552.9 * score) / 100 : 552.9}
                        strokeLinecap="round"
                        className={`transition-all duration-1000 ease-out ${
                          score > 70 ? "text-emerald-500" : score > 40 ? "text-amber-500" : "text-slate-300"
                        }`}
                      />
                    </svg>
                    <div className="absolute flex flex-col items-center">
                      <span className="text-5xl font-black text-slate-900 leading-none">
                        {score || "0"}
                      </span>
                      <span className="text-slate-400 font-bold text-sm uppercase">Score</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                      <p className="text-sm text-slate-600 leading-relaxed">
                        {score > 75 
                          ? "Excellent! Your resume is highly optimized for modern ATS filters." 
                          : score > 0 
                          ? "Room for improvement. Consider adding the missing skills highlighted to the left."
                          : "Upload a file to begin your professional assessment."}
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-between px-2 text-xs font-bold text-slate-400 uppercase">
                      <span>Critique</span>
                      <span>{score ? "Completed" : "Pending"}</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default ATSChecker;