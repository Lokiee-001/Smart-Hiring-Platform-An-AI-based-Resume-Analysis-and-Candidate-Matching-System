import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { 
  Clock, 
  Send, 
  ChevronLeft, 
  ChevronRight, 
  AlertCircle, 
  Trophy,
  CheckCircle2,
  Timer
} from "lucide-react";

function Exam() {
  const [category, setCategory] = useState("aptitude");
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(1800);
  const [result, setResult] = useState(null);
  const [isExamStarted, setIsExamStarted] = useState(false);

  const startExam = async () => {
    try {
      const res = await axios.get(`http://127.0.0.1:5000/start_exam/${category}`);
      setQuestions(res.data);
      setCurrent(0);
      setAnswers({});
      setResult(null);
      setTimeLeft(1800);
      setIsExamStarted(true);
    } catch (err) {
      alert("Failed to fetch questions. Please check your connection.");
    }
  };

  useEffect(() => {
    if (questions.length === 0 || result) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          submitExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [questions, result]);

  const selectAnswer = (option) => {
    setAnswers({
      ...answers,
      [questions[current].id]: option
    });
  };

  const submitExam = async () => {
    if (window.confirm("Are you sure you want to submit your exam?")) {
      try {
        const res = await axios.post("http://127.0.0.1:5000/submit_exam", {
          student_id: 1,
          category: category,
          answers: answers
        });
        setResult(res.data);
        setIsExamStarted(false);
      } catch (err) {
        alert("Submission failed. Please try again.");
      }
    }
  };

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar />
      <div className="flex">
        <Sidebar />
        
        <main className="flex-1 p-6 lg:p-10">
          <div className="max-w-6xl mx-auto">
            
            {/* INITIAL CONFIGURATION VIEW */}
            {!isExamStarted && !result && (
              <div className="max-w-xl mx-auto bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden mt-12">
                <div className="bg-slate-900 p-8 text-white text-center">
                  <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/20">
                    <Timer size={40} className="text-indigo-400" />
                  </div>
                  <h2 className="text-2xl font-bold">Certification Assessment</h2>
                  <p className="text-slate-400 mt-2 italic text-sm">Professional Exam Environment</p>
                </div>
                
                <div className="p-8">
                  <div className="space-y-6">
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Select Domain</label>
                      <select
                        className="w-full rounded-2xl border-slate-200 bg-slate-50 p-4 text-sm font-bold text-slate-700 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none"
                        onChange={(e) => setCategory(e.target.value)}
                      >
                        <option value="aptitude">Aptitude & Logical Reasoning</option>
                        <option value="verbal">Verbal Ability & English</option>
                      </select>
                    </div>

                    <div className="bg-indigo-50 rounded-2xl p-4 border border-indigo-100 space-y-3">
                      <div className="flex items-center gap-3 text-indigo-700 text-sm font-bold">
                        <AlertCircle size={18} /> Important Instructions:
                      </div>
                      <ul className="text-xs text-indigo-600/80 space-y-1.5 list-disc ml-5 font-medium">
                        <li>30 minutes total duration.</li>
                        <li>Auto-submit on timer expiry.</li>
                        <li>Do not refresh the page during assessment.</li>
                      </ul>
                    </div>

                    <button
                      onClick={startExam}
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-4 rounded-2xl transition-all shadow-lg shadow-indigo-100 flex items-center justify-center gap-2 text-lg"
                    >
                      Initialize Exam Session
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ACTIVE EXAM INTERFACE */}
            {isExamStarted && questions.length > 0 && !result && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Main Content: Question Area */}
                <div className="lg:col-span-8 space-y-6">
                  <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200 overflow-hidden">
                    <div className="p-8 lg:p-12">
                      <div className="flex items-center justify-between mb-10">
                        <span className="px-4 py-1.5 bg-slate-100 text-slate-600 rounded-full text-xs font-black tracking-tighter uppercase">
                          Question {current + 1} of {questions.length}
                        </span>
                        <div className={`flex items-center gap-2 font-black ${timeLeft < 300 ? 'text-rose-500 animate-pulse' : 'text-slate-700'}`}>
                          <Clock size={20} />
                          <span className="text-xl tabular-nums">{formatTime(timeLeft)}</span>
                        </div>
                      </div>

                      <h3 className="text-2xl font-bold text-slate-800 mb-10 leading-relaxed">
                        {questions[current].question}
                      </h3>

                      <div className="grid grid-cols-1 gap-4">
                        {["option1", "option2", "option3", "option4"].map((opt, idx) => {
                          const value = questions[current][opt];
                          const isSelected = answers[questions[current].id] === value;

                          return (
                            <button
                              key={opt}
                              onClick={() => selectAnswer(value)}
                              className={`flex items-center justify-between p-5 rounded-2xl border-2 text-left transition-all group
                                ${isSelected 
                                  ? "border-indigo-600 bg-indigo-50/50 ring-1 ring-indigo-600" 
                                  : "border-slate-100 hover:border-slate-300 hover:bg-slate-50"}`}
                            >
                              <div className="flex items-center gap-4">
                                <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black transition-colors
                                  ${isSelected ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-400 group-hover:bg-slate-200"}`}>
                                  {String.fromCharCode(65 + idx)}
                                </span>
                                <span className={`font-semibold ${isSelected ? "text-indigo-900" : "text-slate-600"}`}>
                                  {value}
                                </span>
                              </div>
                              {isSelected && <CheckCircle2 className="text-indigo-600" size={20} />}
                            </button>
                          );
                        })}
                      </div>

                      {/* NAVIGATION */}
                      <div className="mt-12 pt-8 border-t border-slate-100 flex items-center justify-between">
                        <div className="flex gap-3">
                          <button
                            onClick={() => setCurrent(current - 1)}
                            disabled={current === 0}
                            className="p-3 rounded-xl border border-slate-200 text-slate-400 hover:bg-slate-50 hover:text-slate-600 disabled:opacity-30 transition-all"
                          >
                            <ChevronLeft size={24} />
                          </button>
                          <button
                            onClick={() => setCurrent(current + 1)}
                            disabled={current === questions.length - 1}
                            className="p-3 rounded-xl border border-slate-200 text-slate-400 hover:bg-slate-50 hover:text-slate-600 disabled:opacity-30 transition-all"
                          >
                            <ChevronRight size={24} />
                          </button>
                        </div>

                        <button
                          onClick={submitExam}
                          className="bg-slate-900 hover:bg-emerald-600 text-white px-8 py-3.5 rounded-2xl font-bold transition-all flex items-center gap-2 shadow-xl shadow-slate-200"
                        >
                          <Send size={18} />
                          Finish & Submit
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Question Sidebar Grid */}
                <div className="lg:col-span-4">
                  <div className="bg-white rounded-3xl border border-slate-200 p-6 sticky top-8">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6 flex items-center gap-2">
                      Question Navigation
                    </h4>
                    <div className="grid grid-cols-5 gap-3">
                      {questions.map((q, idx) => (
                        <button
                          key={idx}
                          onClick={() => setCurrent(idx)}
                          className={`h-11 rounded-xl text-sm font-black transition-all border-2
                            ${current === idx ? "border-indigo-600 bg-indigo-50 text-indigo-700" : 
                              answers[q.id] ? "border-emerald-500 bg-emerald-50 text-emerald-700" : 
                              "border-slate-100 bg-slate-50 text-slate-400 hover:border-slate-200"}`}
                        >
                          {idx + 1}
                        </button>
                      ))}
                    </div>
                    
                    <div className="mt-8 space-y-3 pt-6 border-t border-slate-100">
                       <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase">
                          <div className="w-3 h-3 bg-indigo-600 rounded-full" /> Currently Viewing
                       </div>
                       <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase">
                          <div className="w-3 h-3 bg-emerald-500 rounded-full" /> Attempted
                       </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* RESULT VIEW */}
            {result && (
              <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden text-center mt-12 animate-in fade-in zoom-in-95 duration-500">
                <div className="bg-emerald-500 p-12 text-white">
                  <Trophy size={80} className="mx-auto mb-6 text-emerald-200" />
                  <h2 className="text-4xl font-black">Examination Complete</h2>
                </div>
                
                <div className="p-12 space-y-8">
                  <div className="flex justify-around gap-4">
                    <div>
                      <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Final Score</p>
                      <p className="text-5xl font-black text-slate-900">{result.score}<span className="text-slate-300 text-2xl"> / {result.total}</span></p>
                    </div>
                    <div className="w-px bg-slate-100" />
                    <div>
                      <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Efficiency</p>
                      <p className="text-5xl font-black text-emerald-500">{Math.round((result.score / result.total) * 100)}%</p>
                    </div>
                  </div>

                  <button 
                    onClick={() => window.location.reload()}
                    className="inline-flex items-center gap-2 font-bold text-indigo-600 hover:bg-indigo-50 px-6 py-3 rounded-xl transition-all"
                  >
                    Return to Dashboard <ChevronRight size={20} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default Exam;