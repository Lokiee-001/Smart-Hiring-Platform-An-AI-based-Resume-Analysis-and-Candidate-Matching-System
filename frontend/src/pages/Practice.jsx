import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { 
  Trophy, 
  ChevronRight, 
  BookOpen, 
  Target, 
  RefreshCcw, 
  CheckCircle2, 
  XCircle,
  BrainCircuit,
  Loader2
} from "lucide-react";

function Practice() {
  const [category, setCategory] = useState("aptitude");
  const [topics, setTopics] = useState([]);
  const [topicId, setTopicId] = useState("");

  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState("");
  const [showAnswer, setShowAnswer] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadTopics();
  }, [category]);

  const loadTopics = async () => {
    try {
      const res = await axios.get(`http://127.0.0.1:5000/get_topics/${category}`);
      setTopics(res.data);
      setTopicId("");
    } catch (err) {
      console.error("Error loading topics", err);
    }
  };

  const loadQuestions = async () => {
    if (!topicId) {
      alert("Please select a topic first.");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.get(`http://127.0.0.1:5000/get_questions/${topicId}`);
      setQuestions(res.data);
      setCurrent(0);
      setSelected("");
      setShowAnswer(false);
    } catch (err) {
      console.error("Error loading questions", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (option) => {
    setSelected(option);
    setShowAnswer(true);
  };

  const nextQuestion = () => {
    setCurrent(current + 1);
    setSelected("");
    setShowAnswer(false);
  };

  const progress = questions.length > 0 ? ((current + 1) / questions.length) * 100 : 0;

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar />
      <div className="flex">
        <Sidebar />
        
        <main className="flex-1 p-6 lg:p-10">
          <div className="max-w-5xl mx-auto">
            
            {/* PAGE HEADER */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
              <div>
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
                  <BrainCircuit className="text-indigo-600" size={32} />
                  Practice Excellence
                </h1>
                <p className="text-slate-500 mt-1">Master your core concepts through focused repetition.</p>
              </div>
              
              {questions.length > 0 && (
                <button 
                  onClick={() => setQuestions([])}
                  className="flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-indigo-600 transition-colors"
                >
                  <RefreshCcw size={16} /> Reset Session
                </button>
              )}
            </div>

            {/* CONFIGURATION BAR */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.1em] text-slate-400 ml-1">Category</label>
                  <select
                    className="w-full rounded-2xl border-slate-200 bg-slate-50 p-3 text-sm font-semibold text-slate-700 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    <option value="aptitude">Aptitude</option>
                    <option value="verbal">Verbal</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.1em] text-slate-400 ml-1">Focus Topic</label>
                  <select
                    className="w-full rounded-2xl border-slate-200 bg-slate-50 p-3 text-sm font-semibold text-slate-700 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all"
                    value={topicId}
                    onChange={(e) => setTopicId(e.target.value)}
                  >
                    <option value="">Select a Topic...</option>
                    {topics.map((t) => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={loadQuestions}
                  disabled={loading || !topicId}
                  className="bg-slate-900 hover:bg-indigo-600 disabled:bg-slate-200 text-white font-bold py-3 px-6 rounded-2xl transition-all shadow-lg shadow-slate-200 active:scale-95 flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 className="animate-spin" size={20} /> : <Target size={20} />}
                  {loading ? "Preparing..." : "Start Practice"}
                </button>
              </div>
            </div>

            {/* QUIZ INTERFACE */}
            {questions.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                
                {/* Main Question Area */}
                <div className="lg:col-span-3 space-y-6">
                  <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200 overflow-hidden">
                    {/* Visual Progress Bar */}
                    <div className="w-full bg-slate-100 h-1.5">
                      <div 
                        className="bg-indigo-500 h-full transition-all duration-700 ease-out" 
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>

                    <div className="p-8 lg:p-12">
                      <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs font-bold uppercase tracking-wider mb-6">
                        <BookOpen size={14} />
                        Question {current + 1} of {questions.length}
                      </div>

                      <h3 className="text-2xl font-bold text-slate-800 mb-10 leading-snug">
                        {questions[current].question}
                      </h3>

                      {/* OPTIONS */}
                      <div className="grid grid-cols-1 gap-4">
                        {["option1", "option2", "option3", "option4"].map((opt, idx) => {
                          const value = questions[current][opt];
                          const isCorrect = value === questions[current].answer;
                          const isSelected = value === selected;

                          let containerStyle = "border-slate-200 hover:border-indigo-400 hover:bg-slate-50";
                          let icon = <div className="w-6 h-6 rounded-full border-2 border-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-400">{String.fromCharCode(65 + idx)}</div>;

                          if (showAnswer) {
                            if (isCorrect) {
                              containerStyle = "border-emerald-500 bg-emerald-50 ring-1 ring-emerald-500 shadow-sm shadow-emerald-100";
                              icon = <CheckCircle2 className="text-emerald-500" size={24} />;
                            } else if (isSelected) {
                              containerStyle = "border-rose-500 bg-rose-50 ring-1 ring-rose-500";
                              icon = <XCircle className="text-rose-500" size={24} />;
                            } else {
                              containerStyle = "border-slate-100 opacity-40 grayscale-[0.5]";
                            }
                          }

                          return (
                            <button
                              key={opt}
                              disabled={showAnswer}
                              onClick={() => handleAnswer(value)}
                              className={`group relative flex items-center justify-between p-5 rounded-2xl border-2 text-left transition-all duration-200 ${containerStyle}`}
                            >
                              <span className={`font-semibold transition-colors ${showAnswer && isCorrect ? 'text-emerald-900' : 'text-slate-700'}`}>
                                {value}
                              </span>
                              {icon}
                            </button>
                          );
                        })}
                      </div>

                      {/* EXPLANATION */}
                      {showAnswer && (
                        <div className="mt-10 rounded-2xl bg-indigo-50/50 border border-indigo-100 p-6 animate-in fade-in slide-in-from-top-4 duration-500">
                          <div className="flex items-center gap-2 mb-3 text-indigo-900 font-bold">
                            <Lightbulb size={18} className="text-amber-500" />
                            Solution Breakdown
                          </div>
                          <p className="text-slate-600 leading-relaxed text-sm">
                            {questions[current].explanation}
                          </p>
                        </div>
                      )}

                      {/* NAV BUTTONS */}
                      <div className="mt-10 pt-8 border-t border-slate-100 flex items-center justify-between">
                         <div className="text-slate-400 text-sm italic">
                            {!showAnswer ? "Select an option to see the result" : "Review the solution before proceeding"}
                         </div>
                         
                        {showAnswer && current < questions.length - 1 && (
                          <button
                            onClick={nextQuestion}
                            className="flex items-center gap-2 bg-slate-900 hover:bg-indigo-600 text-white px-8 py-3.5 rounded-2xl font-bold transition-all shadow-xl shadow-indigo-100"
                          >
                            Next Question
                            <ChevronRight size={18} />
                          </button>
                        )}
                        
                        {showAnswer && current === questions.length - 1 && (
                            <div className="flex items-center gap-2 text-emerald-600 font-black text-lg animate-bounce">
                                <Trophy size={24} />
                                DONE!
                            </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sidebar Session Stats */}
                <div className="lg:col-span-1 space-y-6">
                  <div className="bg-white rounded-3xl border border-slate-200 p-6 sticky top-10">
                    <h4 className="font-black text-[10px] uppercase tracking-widest text-slate-400 mb-4">Session Stats</h4>
                    <div className="space-y-4">
                      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                        <p className="text-xs text-slate-500 font-bold mb-1">COMPLETION</p>
                        <p className="text-2xl font-black text-slate-800">{Math.round(progress)}%</p>
                      </div>
                      <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100">
                        <p className="text-xs text-indigo-400 font-bold mb-1">DIFFICULTY</p>
                        <p className="text-xl font-black text-indigo-900 capitalize">{category}</p>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            ) : (
              <div className="bg-white border-2 border-dashed border-slate-200 rounded-[3rem] py-24 text-center">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <BookOpen className="text-slate-300" size={40} />
                </div>
                <h3 className="text-xl font-bold text-slate-800">Ready to start?</h3>
                <p className="text-slate-500 mt-2">Select a topic above to generate your practice set.</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

const Lightbulb = ({ size, className }) => (
    <svg 
        width={size} 
        height={size} 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className={className}
    >
        <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A4.5 4.5 0 0 0 13.5 3.5c-1.3 0-2.6.5-3.5 1.5C9.2 5.8 8.5 6.5 8.3 7.5" />
        <path d="M9 18h6" /><path d="M10 22h4" />
    </svg>
)

export default Practice;