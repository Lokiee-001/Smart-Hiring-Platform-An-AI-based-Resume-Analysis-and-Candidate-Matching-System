import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { 
  PlusCircle, 
  BookOpen, 
  HelpCircle, 
  Save, 
  Settings2, 
  Layers, 
  CheckCircle2,
  Info
} from "lucide-react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

function AdminPanel() {
  const [category, setCategory] = useState("aptitude");
  const [topics, setTopics] = useState([]);
  const [topicName, setTopicName] = useState("");
  const [topicId, setTopicId] = useState("");
  const [question, setQuestion] = useState("");
  const [option1, setOption1] = useState("");
  const [option2, setOption2] = useState("");
  const [option3, setOption3] = useState("");
  const [option4, setOption4] = useState("");
  const [answer, setAnswer] = useState("");
  const [explanation, setExplanation] = useState("");
  const [difficulty, setDifficulty] = useState("easy");

  const labelStyle = "block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1";
  const inputStyle = "w-full border border-slate-200 rounded-xl p-3.5 text-slate-800 bg-slate-50/50 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white outline-none transition-all placeholder:text-slate-400";

  useEffect(() => {
    loadTopics();
  }, [category]);

  const loadTopics = async () => {
    try {
      const res = await axios.get(`http://127.0.0.1:5000/get_topics/${category}`);
      setTopics(res.data);
    } catch (err) {
      console.error("Error loading topics", err);
    }
  };

  const addTopic = async () => {
    if (!topicName) return alert("Please enter a topic name");
    await axios.post("http://127.0.0.1:5000/add_topic", { name: topicName, category: category });
    alert("Topic added successfully!");
    setTopicName("");
    loadTopics();
  };

  const addQuestion = async () => {
    if (!topicId) {
      alert("Please select a topic first");
      return;
    }
    await axios.post("http://127.0.0.1:5000/add_question", {
      category, topic_id: topicId, question, option1, option2, option3, option4, answer, explanation, difficulty
    });
    alert("Question added successfully!");
    setQuestion(""); setOption1(""); setOption2(""); setOption3(""); setOption4(""); setAnswer(""); setExplanation("");
  };

  return (
    <div className="bg-[#f8fafc] min-h-screen">
      <Navbar />
      <div className="flex">
        <Sidebar />

        <main className="flex-1 p-8">
          <div className="max-w-5xl mx-auto">
            
            {/* 🛠️ TOP HEADER SECTION */}
            <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
                  <span className="p-2.5 bg-indigo-600 text-white rounded-2xl shadow-lg shadow-indigo-100">
                    <Settings2 size={24} />
                  </span>
                  Content Management
                </h2>
                <p className="text-slate-500 mt-2 font-medium">Build and maintain your assessment question bank.</p>
              </motion.div>

              <div className="bg-white p-2 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-2">
                <button 
                  onClick={() => setCategory("aptitude")}
                  className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${category === "aptitude" ? "bg-indigo-600 text-white shadow-md shadow-indigo-100" : "text-slate-500 hover:bg-slate-50"}`}
                >
                  Aptitude
                </button>
                <button 
                  onClick={() => setCategory("verbal")}
                  className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${category === "verbal" ? "bg-indigo-600 text-white shadow-md shadow-indigo-100" : "text-slate-500 hover:bg-slate-50"}`}
                >
                  Verbal
                </button>
              </div>
            </header>

            <div className="grid grid-cols-1 gap-8">
              
              {/* 📂 ADD TOPIC SECTION */}
              <motion.section 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-3xl p-8 border border-slate-100 shadow-xl shadow-slate-200/40"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                    <PlusCircle size={20} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-800">New Topic Registration</h3>
                </div>
                
                <div className="flex flex-col md:flex-row items-end gap-4">
                  <div className="flex-1 w-full">
                    <label className={labelStyle}>Topic Name</label>
                    <div className="relative">
                      <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input
                        placeholder="e.g. Data Interpretation or Grammar"
                        className={`${inputStyle} pl-12`}
                        value={topicName}
                        onChange={(e) => setTopicName(e.target.value)}
                      />
                    </div>
                  </div>
                  <button
                    onClick={addTopic}
                    className="w-full md:w-auto bg-slate-900 hover:bg-black text-white font-bold px-8 py-4 rounded-xl transition-all active:scale-95 shadow-lg shadow-slate-200"
                  >
                    Add Topic
                  </button>
                </div>
              </motion.section>

              {/* 📝 QUESTION BUILDER SECTION */}
              <motion.section 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden"
              >
                <div className="px-8 py-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
                  <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                    <HelpCircle className="text-indigo-600" size={20} />
                    Question Constructor
                  </h3>
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
                    <Layers size={14} />
                    Bank: {category}
                  </div>
                </div>
                
                <div className="p-8 space-y-8">
                  {/* Setup Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-slate-50/50 rounded-2xl border border-slate-100">
                    <div>
                      <label className={labelStyle}>Assign Topic</label>
                      <select className={inputStyle} value={topicId} onChange={(e) => setTopicId(e.target.value)}>
                        <option value="">Select a topic...</option>
                        {topics.map((t) => (<option key={t.id} value={t.id}>{t.name}</option>))}
                      </select>
                    </div>
                    <div>
                      <label className={labelStyle}>Complexity</label>
                      <div className="grid grid-cols-3 gap-2">
                        {['easy', 'medium', 'hard'].map((lvl) => (
                          <button
                            key={lvl}
                            onClick={() => setDifficulty(lvl)}
                            className={`py-3 rounded-xl text-xs font-black uppercase tracking-tighter border-2 transition-all ${
                              difficulty === lvl 
                              ? "bg-white border-indigo-600 text-indigo-600 shadow-sm" 
                              : "bg-white border-slate-100 text-slate-400 hover:border-slate-200"
                            }`}
                          >
                            {lvl}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Question Content */}
                  <div>
                    <label className={labelStyle}>Main Question Text</label>
                    <textarea
                      placeholder="Type the question content here..."
                      className={`${inputStyle} min-h-[120px] resize-none`}
                      value={question}
                      onChange={(e) => setQuestion(e.target.value)}
                    />
                  </div>

                  {/* Options Grid */}
                  <div>
                    <label className={labelStyle}>Response Options</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <OptionInput label="Option A" value={option1} onChange={setOption1} />
                      <OptionInput label="Option B" value={option2} onChange={setOption2} />
                      <OptionInput label="Option C" value={option3} onChange={setOption3} />
                      <OptionInput label="Option D" value={option4} onChange={setOption4} />
                    </div>
                  </div>

                  {/* Logic & Answers */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className={labelStyle}>Designated Correct Answer</label>
                      <div className="relative">
                        <CheckCircle2 className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500" size={18} />
                        <input 
                          placeholder="Paste the correct text option here" 
                          className={`${inputStyle} pl-12 border-emerald-100 focus:ring-emerald-500/10 focus:border-emerald-500`} 
                          value={answer} 
                          onChange={(e) => setAnswer(e.target.value)} 
                        />
                      </div>
                    </div>
                    <div>
                      <label className={labelStyle}>Solution Explanation</label>
                      <div className="relative">
                        <Info className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input 
                          placeholder="Add helpful context for the student" 
                          className={`${inputStyle} pl-12`} 
                          value={explanation} 
                          onChange={(e) => setExplanation(e.target.value)} 
                        />
                      </div>
                    </div>
                  </div>

                  {/* Submit Area */}
                  <div className="pt-8 border-t border-slate-100 flex justify-end">
                    <button
                      onClick={addQuestion}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white font-black px-10 py-4 rounded-2xl transition-all shadow-xl shadow-indigo-200 flex items-center gap-3 active:scale-95"
                    >
                      <Save size={20} />
                      Save Question
                    </button>
                  </div>
                </div>
              </motion.section>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

// Sub-component for options to keep code clean
function OptionInput({ label, value, onChange }) {
  return (
    <div className="relative group">
      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-300 group-focus-within:text-indigo-400 uppercase">
        {label.split(' ')[1]}
      </span>
      <input 
        placeholder={label} 
        className="w-full border border-slate-200 rounded-xl py-3.5 pl-10 pr-4 text-slate-800 bg-white focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-300 text-sm font-medium" 
        value={value} 
        onChange={(e) => onChange(e.target.value)} 
      />
    </div>
  );
}

export default AdminPanel;