import React, { useState, useEffect, useRef } from "react";
import {
  BookOpen,
  FileText,
  Search,
  BarChart3,
  Settings as SettingsIcon,
  Upload,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Download,
  RotateCw,
  Plus,
  Trash2,
  Bot,
  User as UserIcon,
  FileDown,
  ChevronRight,
  Database,
  ShieldCheck,
  Send,
  Eye,
  Sliders,
  Building,
  Clock
} from "lucide-react";
import { motion } from "framer-motion";

// Types for application state
interface Question {
  id: string;
  text: string;
  type: "MCQ" | "Short" | "Long";
  bloom: "Remember" | "Understand" | "Apply" | "Analyze" | "Evaluate" | "Create";
  difficulty: "Easy" | "Medium" | "Hard";
  marks: number;
  co: string;
  po: string;
  options?: string[];
  answer: string;
  rubric?: string;
}

interface SyllabusFile {
  name: string;
  size: string;
  parsedUnits: string[];
}

export default function App() {
  // Navigation & UI States
  const [activeTab, setActiveTab] = useState<"workspace" | "bank" | "assistant" | "analytics" | "admin">("workspace");
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  const [activeTenant, setActiveTenant] = useState<string>("National Institute of Technology");
  
  // Workspace Flow States
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1); // 1: Ingestion, 2: Blueprint, 3: Generation Pipeline, 4: Review & Export
  const [syllabusFile, setSyllabusFile] = useState<SyllabusFile | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [ocrLog, setOcrLog] = useState<string[]>([]);
  
  // Blueprint Parameters
  const [examTitle, setExamTitle] = useState<string>("End Semester Assessment - Software Architecture");
  const [duration, setDuration] = useState<number>(180);
  const [totalMarks, setTotalMarks] = useState<number>(100);
  const [difficultyConfig, setDifficultyConfig] = useState({ easy: 30, medium: 50, hard: 20 });
  const [bloomConfig, setBloomConfig] = useState({ remember: 20, understand: 30, apply: 30, analyze: 10, evaluate: 10 });
  
  // Pipeline Simulation States
  const [pipelineProgress, setPipelineProgress] = useState<number>(0);
  const [activeAgent, setActiveAgent] = useState<string>("");
  const [pipelineLogs, setPipelineLogs] = useState<string[]>([]);
  const [generationComplete, setGenerationComplete] = useState<boolean>(false);

  // Generated Exam Paper State
  const [questions, setQuestions] = useState<Question[]>([]);
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<{ text: string; answer: string }>({ text: "", answer: "" });
  const [showAnswerKey, setShowAnswerKey] = useState<boolean>(false);
  
  // AI Assistant States
  const [assistantModel, setAssistantModel] = useState<"flash" | "pro">("pro");
  const [chatInput, setChatInput] = useState<string>("");
  const [chatHistory, setChatHistory] = useState<Array<{ sender: "user" | "ai"; text: string; timestamp: string; tools?: string[] }>>([
    {
      sender: "ai",
      text: "Hello, I am your EXAMFORGE Teaching Assistant. I am linked to the institutional knowledge base. You can switch models or ask me to search syllabi, format rubrics, or check regulation documents.",
      timestamp: "08:30 AM"
    }
  ]);
  const [isChatTyping, setIsChatTyping] = useState<boolean>(false);

  // Question Bank Filter States
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [bankDifficulty, setBankDifficulty] = useState<string>("All");
  const [duplicateScanOutput, setDuplicateScanOutput] = useState<{ score: number; status: string } | null>(null);

  // Auto-scroll for chat
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatHistory, isChatTyping]);

  // Handle Mock File Ingestion
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];
    
    setIsUploading(true);
    setUploadProgress(10);
    setOcrLog(["[OCR Ingress] Starting page analysis...", `[File] Name: ${file.name}, Size: ${(file.size / 1024 / 1024).toFixed(2)} MB`]);
    
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsUploading(false);
            setSyllabusFile({
              name: file.name,
              size: `${(file.size / 1024).toFixed(0)} KB`,
              parsedUnits: [
                "Unit I: Introduction to Software Architecture & Design Patterns",
                "Unit II: Shared Information Systems & Repository Architectures",
                "Unit III: Microservices and Component-Based Engineering",
                "Unit IV: Performance Metrics, Scalability & Resource Allocation",
                "Unit V: Security Architectures & Identity Management"
              ]
            });
            setStep(2); // Jump to Blueprint setup
          }, 600);
          return 100;
        }
        const next = prev + 30;
        
        // Mocking OCR logs
        if (next === 40) {
          setOcrLog((logs) => [...logs, "[OCR Vision] Executing layout structure scanning...", "[Multilingual] Identified Character Encoding: UTF-8"]);
        } else if (next === 70) {
          setOcrLog((logs) => [...logs, "[Parsing Engine] Mapping Units & Syllabus bounds...", "[Metadata] Discovered Course Code: CS-801, Title: Software Architecture"]);
        } else if (next === 100) {
          setOcrLog((logs) => [...logs, "[RAG Compiler] Embedded 14 paragraphs into vector space successfully."]);
        }
        return next;
      });
    }, 500);
  };

  // Run AI Generation Pipeline Simulation
  const triggerGenerationPipeline = () => {
    setStep(3);
    setPipelineProgress(0);
    setGenerationComplete(false);
    setPipelineLogs(["[Pipeline Coordinator] Constructing compilation manifest..."]);
    
    const steps = [
      { name: "Syllabus Parser Agent", log: "Analysing syllabus structure. Extracted 5 units, 14 topics." },
      { name: "Blueprint Generator Agent", log: "Mapping target difficulty profile: 30% Easy, 50% Medium, 20% Hard." },
      { name: "Question Generator Agent", log: "Executing generative model. Constructing 12 structured items." },
      { name: "Bloom Validator Agent", log: "Evaluating cognitive weights against Bloom's taxonomy. Standardized distribution verified." },
      { name: "Difficulty Validator Agent", log: "Performing structural analysis. 2 questions re-weighted to match Medium criteria." },
      { name: "Semantic Duplicate Detector", log: "Querying pgvector db. Average similarity score < 0.23 (Threshold: 0.87). Uniqueness check passed!" },
      { name: "Answer Key Generator Agent", log: "Creating sample answers, calculations, and solution templates." },
      { name: "Quality Reviewer Agent", log: "Verifying formatting constraints. Institutional stamp and page layouts calculated." }
    ];

    let currentStepIdx = 0;
    
    const interval = setInterval(() => {
      if (currentStepIdx < steps.length) {
        const agent = steps[currentStepIdx];
        setActiveAgent(agent.name);
        setPipelineLogs((prev) => [...prev, `[${agent.name}] ${agent.log}`]);
        setPipelineProgress((prev) => prev + 12);
        currentStepIdx++;
      } else {
        clearInterval(interval);
        setPipelineProgress(100);
        setGenerationComplete(true);
        setActiveAgent("");
        setPipelineLogs((prev) => [...prev, "[Pipeline Coordinator] Generation completed successfully! Paper draft rendered."]);
        
        // Seed default generated questions
        setQuestions([
          {
            id: "q-1",
            text: "Explain the difference between monolith and modular monolith architectural styles. Under what scenario would you recommend a modular monolith over microservices? Justify with structural parameters.",
            type: "Long",
            bloom: "Analyze",
            difficulty: "Medium",
            marks: 10,
            co: "CO-1",
            po: "PO-3",
            answer: "A monolith contains all codebase domains in a single executable but often suffers from coupled imports. A modular monolith enforces boundary limits programmatically (e.g. isolated packages in Python) sharing a unified database schema. Microservices run separate container boundaries and databases. Modular monolith is recommended when teams are small (less than 15 devs) to avoid transaction overhead, distributed query latency, and deployment complexity while maintaining clear logical module isolation."
          },
          {
            id: "q-2",
            text: "Explain how Hierarchical Navigable Small World (HNSW) index improves vector similarity queries in pgvector compared to Inverted File Flat (IVFFlat) indexes.",
            type: "Long",
            bloom: "Understand",
            difficulty: "Medium",
            marks: 10,
            co: "CO-3",
            po: "PO-2",
            answer: "HNSW builds a multi-layer graph index that enables logarithmic search scaling. Each layer has skip connections to lower layers, functioning similarly to skip lists. IVFFlat clusters vectors into lists and query-checks closest clusters. While IVFFlat builds faster and consumes less memory, HNSW provides significantly higher recall at high query volumes."
          },
          {
            id: "q-3",
            text: "Which of the following is the most suitable method to handle session persistence in a multi-tenant cloud application seeking horizontal scalability?",
            type: "MCQ",
            bloom: "Remember",
            difficulty: "Easy",
            marks: 2,
            co: "CO-2",
            po: "PO-1",
            options: [
              "A) Storing sessions inside server memory (sticky sessions)",
              "B) Utilizing a shared Redis cache storage database",
              "C) Writing session states to local client cookies",
              "D) Replicating server local memory tables periodically"
            ],
            answer: "B) Utilizing a shared Redis cache storage database"
          },
          {
            id: "q-4",
            text: "Design a relational schema using SQL DDL that enables row-level isolation using a tenant_id identifier. Write the policy command to enforce Row Level Security (RLS).",
            type: "Long",
            bloom: "Create",
            difficulty: "Hard",
            marks: 15,
            co: "CO-4",
            po: "PO-5",
            answer: "DDL Structure:\nCREATE TABLE items (id UUID PRIMARY KEY, tenant_id UUID NOT NULL, name VARCHAR(100));\nEnforce RLS:\nALTER TABLE items ENABLE ROW LEVEL SECURITY;\nCREATE POLICY tenant_isolation_policy ON items USING (tenant_id = current_setting('app.current_tenant_id'));"
          },
          {
            id: "q-5",
            text: "What is the primary trade-off when configuring a high 'ef_construction' value during pgvector HNSW index generation?",
            type: "Short",
            bloom: "Evaluate",
            difficulty: "Hard",
            marks: 5,
            co: "CO-3",
            po: "PO-3",
            answer: "Increasing ef_construction makes the index construction build time slower but yields higher query accuracy (recall) and graph connectivity quality."
          }
        ]);
        
        setTimeout(() => {
          setStep(4);
        }, 1200);
      }
    }, 800);
  };

  // Edit / Update Question State
  const startEditQuestion = (q: Question) => {
    setEditingQuestionId(q.id);
    setEditForm({ text: q.text, answer: q.answer });
  };

  const saveEditQuestion = (id: string) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, text: editForm.text, answer: editForm.answer } : q))
    );
    setEditingQuestionId(null);
  };

  const deleteQuestion = (id: string) => {
    setQuestions((prev) => prev.filter((q) => q.id !== id));
  };

  const regenerateQuestion = (id: string) => {
    // Simulated regeneration
    setQuestions((prev) =>
      prev.map((q) => {
        if (q.id === id) {
          return {
            ...q,
            text: `[REGENERATED] Define the concepts of loose coupling and high cohesion. Detail how these principles impact microservices and modular monolith layout patterns.`,
            answer: `Regenerated model answer: Coupling refers to external inter-dependencies, cohesion to inner focus. Microservices require absolute loose coupling to enable deployment independence.`
          };
        }
        return q;
      })
    );
  };

  const addQuestionManual = () => {
    const newQ: Question = {
      id: `q-${Date.now()}`,
      text: "Write a short question text here...",
      type: "Short",
      bloom: "Understand",
      difficulty: "Easy",
      marks: 5,
      co: "CO-1",
      po: "PO-1",
      answer: "Write solution model guidelines here."
    };
    setQuestions([...questions, newQ]);
  };

  // Simulated AI Chat
  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMessage = chatInput;
    setChatInput("");
    setChatHistory((prev) => [...prev, { sender: "user", text: userMessage, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
    setIsChatTyping(true);

    // Simulate response based on keywords
    setTimeout(() => {
      let aiResponseText = "";
      let toolsCalled: string[] = [];

      const query = userMessage.toLowerCase();
      if (query.includes("syllabus") || query.includes("unit")) {
        aiResponseText = "According to Unit I of the parsed CS-801 syllabus, the key topics are Software Architecture styles, repository architectures, and modular monolith configurations. Would you like me to generate 3 practice MCQs covering this unit?";
        toolsCalled = ["RAG_Search(CS-801_Syllabus)"];
      } else if (query.includes("duplicate") || query.includes("search")) {
        aiResponseText = "Executing semantic search in the question bank. I found 1 question with 84% similarity: 'Explain monolithic systems vs microservices'. I recommend writing a different prompt or using the anti-repetition filter.";
        toolsCalled = ["pgvector_CosineSearch(query)", "anti_repetition_scanner()"];
      } else if (query.includes("regulation") || query.includes("rule")) {
        aiResponseText = "Under Institutional Regulation Clause 4.2: Final examinations must contain at least 20% Bloom Level IV (Analysis) or higher, and the duration must be exactly 3 hours (180 minutes). Your current configuration conforms to these parameters.";
        toolsCalled = ["RAG_RegulationsLookup(clause_4)"];
      } else if (query.includes("generate")) {
        aiResponseText = "I have invoked the Question Generator Agent. I generated the following short question: 'What is the function of a reverse proxy in Docker containerization?'. Let me know if you would like me to add it directly to the active exam session.";
        toolsCalled = ["Invoke_Agent(QuestionGenerator)"];
      } else {
        aiResponseText = `I have searched the knowledge database using model: Gemini 2.5 ${assistantModel === "pro" ? "Pro" : "Flash"}. I recommend structuring the questions around course outcomes (COs) to ensure full curriculum coverage. Let me know how I can assist with generating keys or formatting the PDF copy.`;
      }

      setChatHistory((prev) => [
        ...prev,
        {
          sender: "ai",
          text: aiResponseText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          tools: toolsCalled.length > 0 ? toolsCalled : undefined
        }
      ]);
      setIsChatTyping(false);
    }, 1500);
  };

  // Simulated Semantic Search in Question Bank
  const triggerSemanticSearch = () => {
    if (!searchQuery) return;
    setDuplicateScanOutput({ score: 0.91, status: "High similarity detected! Reusing this question might lead to repetition." });
  };

  // Mock Question Bank Seeds
  const seededBankQuestions = [
    { text: "What is the primary difference between a monolith and modular architecture?", similarity: "91% (Semantic Match)" },
    { text: "Explain MVC architecture layout patterns.", similarity: "67% (Moderate Match)" },
    { text: "Describe database horizontal scaling methods.", similarity: "45% (Low Match)" }
  ];

  return (
    <div className={`${isDarkMode ? "dark bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-900"} min-h-screen flex flex-col transition-colors duration-300 font-sans`}>
      {/* Top Banner & Multi-Tenant Control Header */}
      <header className="border-b border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md sticky top-0 z-50 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-tr from-violet-600 to-indigo-500 p-2.5 rounded-xl shadow-lg shadow-violet-500/20">
            <Sparkles className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">
              EXAMFORGE <span className="gradient-text font-black">AI</span>
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Enterprise Assessment OS</p>
          </div>
        </div>

        {/* Tenant Switcher & Settings */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 bg-slate-100 dark:bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700">
            <Building className="h-4 w-4 text-violet-500" />
            <select
              value={activeTenant}
              onChange={(e) => setActiveTenant(e.target.value)}
              className="bg-transparent text-xs font-semibold focus:outline-none cursor-pointer"
            >
              <option value="National Institute of Technology">National Institute of Tech (NIT)</option>
              <option value="Harvard Professional Studies">Harvard Professional Studies</option>
              <option value="Global Corporate Training Board">Global Corporate Training</option>
            </select>
          </div>

          {/* Light/Dark Toggle */}
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-slate-900 dark:hover:text-white transition"
          >
            {isDarkMode ? "☀️" : "🌙"}
          </button>

          <div className="h-8 w-[1px] bg-slate-200 dark:bg-slate-800" />

          {/* User Status Profile */}
          <div className="flex items-center space-x-2.5">
            <div className="h-9 w-9 rounded-full bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center">
              <UserIcon className="h-4 w-4 text-indigo-500" />
            </div>
            <div className="hidden md:block">
              <p className="text-xs font-bold leading-none">Prof. Sarah Jenkins</p>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Faculty Module</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex flex-1 overflow-hidden">
        {/* Navigation Sidebar */}
        <nav className="w-64 border-r border-slate-200 dark:border-slate-800 bg-white/30 dark:bg-slate-900/30 p-4 flex flex-col justify-between">
          <div className="space-y-1.5">
            <p className="px-3 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3">Core Modules</p>
            
            <button
              onClick={() => setActiveTab("workspace")}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition ${
                activeTab === "workspace"
                  ? "bg-violet-500 text-white shadow-md shadow-violet-500/15"
                  : "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white"
              }`}
            >
              <BookOpen className="h-4.5 w-4.5" />
              <span>Faculty Workspace</span>
            </button>

            <button
              onClick={() => setActiveTab("bank")}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition ${
                activeTab === "bank"
                  ? "bg-violet-500 text-white shadow-md shadow-violet-500/15"
                  : "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white"
              }`}
            >
              <Database className="h-4.5 w-4.5" />
              <span>Question Bank</span>
            </button>

            <button
              onClick={() => setActiveTab("assistant")}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition ${
                activeTab === "assistant"
                  ? "bg-violet-500 text-white shadow-md shadow-violet-500/15"
                  : "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white"
              }`}
            >
              <Bot className="h-4.5 w-4.5" />
              <span>Teaching Assistant</span>
            </button>

            <button
              onClick={() => setActiveTab("analytics")}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition ${
                activeTab === "analytics"
                  ? "bg-violet-500 text-white shadow-md shadow-violet-500/15"
                  : "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white"
              }`}
            >
              <BarChart3 className="h-4.5 w-4.5" />
              <span>Paper Analytics</span>
            </button>

            <button
              onClick={() => setActiveTab("admin")}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition ${
                activeTab === "admin"
                  ? "bg-violet-500 text-white shadow-md shadow-violet-500/15"
                  : "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white"
              }`}
            >
              <SettingsIcon className="h-4.5 w-4.5" />
              <span>Administration</span>
            </button>
          </div>

          {/* Secure Audit Status Indicator */}
          <div className="bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 p-3.5 rounded-xl text-[11px] text-slate-500 dark:text-slate-400 space-y-2">
            <div className="flex items-center space-x-2 text-emerald-500 font-bold">
              <ShieldCheck className="h-4 w-4" />
              <span>Tenant Encrypted</span>
            </div>
            <p className="leading-normal">All question generation tasks are signed using HMAC-SHA256, mapped to tenant keys, and logged to audit trails.</p>
          </div>
        </nav>

        {/* Dynamic Workspace Container */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          {activeTab === "workspace" && (
            <div className="max-w-5xl mx-auto space-y-8">
              {/* Workspace Setup Steps Banner */}
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-5">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight">Faculty Generation Studio</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Design blueprints, configure agents, and compile validated examination sheets.</p>
                </div>
                {/* Horizontal Progress Timeline */}
                <div className="flex items-center space-x-2 text-xs font-bold text-slate-500">
                  <span className={`px-2.5 py-1 rounded-full ${step >= 1 ? "bg-violet-500 text-white" : "bg-slate-200 dark:bg-slate-800"}`}>1. Parse</span>
                  <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
                  <span className={`px-2.5 py-1 rounded-full ${step >= 2 ? "bg-violet-500 text-white" : "bg-slate-200 dark:bg-slate-800"}`}>2. Model</span>
                  <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
                  <span className={`px-2.5 py-1 rounded-full ${step >= 3 ? "bg-violet-500 text-white" : "bg-slate-200 dark:bg-slate-800"}`}>3. Process</span>
                  <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
                  <span className={`px-2.5 py-1 rounded-full ${step >= 4 ? "bg-violet-500 text-white" : "bg-slate-200 dark:bg-slate-800"}`}>4. Export</span>
                </div>
              </div>

              {/* Step 1: Syllabus Upload Ingest */}
              {step === 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 shadow-sm space-y-6"
                >
                  <div className="text-center max-w-lg mx-auto space-y-3">
                    <div className="h-14 w-14 bg-violet-500/10 border border-violet-500/20 text-violet-500 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Upload className="h-6 w-6" />
                    </div>
                    <h3 className="text-lg font-bold">Ingest Syllabus or Reference Document</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                      Upload your PDF, DOCX, scanned notes, or curriculum syllabus. Our layout parser extracts structure, modules, and objectives to guide the question builder.
                    </p>
                  </div>

                  {/* Drag-n-Drop Container */}
                  <div className="border-2 border-dashed border-slate-200 dark:border-slate-800 hover:border-violet-500 dark:hover:border-violet-500 rounded-xl p-8 text-center transition cursor-pointer relative">
                    <input
                      type="file"
                      onChange={handleFileUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      disabled={isUploading}
                    />
                    {isUploading ? (
                      <div className="space-y-4">
                        <div className="flex items-center justify-center space-x-2 text-violet-500 font-bold">
                          <RotateCw className="h-5 w-5 animate-spin" />
                          <span>Running OCR Extraction ({uploadProgress}%)</span>
                        </div>
                        <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden max-w-xs mx-auto">
                          <div className="bg-violet-500 h-full transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
                        </div>
                        {/* Interactive logs */}
                        <div className="text-left bg-slate-50 dark:bg-slate-950 p-4 rounded-lg font-mono text-[10px] text-slate-500 max-w-md mx-auto border border-slate-200 dark:border-slate-800 space-y-1">
                          {ocrLog.map((log, i) => (
                            <div key={i}>{log}</div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <p className="text-sm font-semibold">Click to browse or drag your syllabus file here</p>
                        <p className="text-xs text-slate-400">PDF, Scanned PDF, JPG, PNG, DOCX, TXT (Max 15MB)</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Step 2: Exam Blueprint & Configuration Setup */}
              {step === 2 && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="grid grid-cols-1 lg:grid-cols-3 gap-8"
                >
                  {/* Left Parameter Panel */}
                  <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
                      <h3 className="text-lg font-bold flex items-center space-x-2">
                        <Sliders className="h-5 w-5 text-violet-500" />
                        <span>Examination Parameters</span>
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Exam Title</label>
                          <input
                            type="text"
                            value={examTitle}
                            onChange={(e) => setExamTitle(e.target.value)}
                            className="w-full px-3.5 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent text-sm focus:ring-1 focus:ring-violet-500 focus:outline-none"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Subject Mapping</label>
                          <input
                            type="text"
                            value="CS-801: Software Architecture & Quality Metrics"
                            disabled
                            className="w-full px-3.5 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-sm cursor-not-allowed"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Duration (Minutes)</label>
                          <input
                            type="number"
                            value={duration}
                            onChange={(e) => setDuration(Number(e.target.value))}
                            className="w-full px-3.5 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent text-sm focus:ring-1 focus:ring-violet-500 focus:outline-none"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Marks</label>
                          <input
                            type="number"
                            value={totalMarks}
                            onChange={(e) => setTotalMarks(Number(e.target.value))}
                            className="w-full px-3.5 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent text-sm focus:ring-1 focus:ring-violet-500 focus:outline-none"
                          />
                        </div>
                      </div>

                      {/* Difficulty Distribution Sliders */}
                      <div className="space-y-4">
                        <h4 className="text-sm font-bold border-b border-slate-100 dark:border-slate-800 pb-2">Target Difficulty Distribution</h4>
                        <div className="space-y-3">
                          <div>
                            <div className="flex justify-between text-xs font-semibold mb-1">
                              <span>Easy</span>
                              <span>{difficultyConfig.easy}%</span>
                            </div>
                            <input
                              type="range"
                              min="0"
                              max="100"
                              value={difficultyConfig.easy}
                              onChange={(e) => setDifficultyConfig({ ...difficultyConfig, easy: Number(e.target.value) })}
                              className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-violet-500"
                            />
                          </div>
                          <div>
                            <div className="flex justify-between text-xs font-semibold mb-1">
                              <span>Medium</span>
                              <span>{difficultyConfig.medium}%</span>
                            </div>
                            <input
                              type="range"
                              min="0"
                              max="100"
                              value={difficultyConfig.medium}
                              onChange={(e) => setDifficultyConfig({ ...difficultyConfig, medium: Number(e.target.value) })}
                              className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-violet-500"
                            />
                          </div>
                          <div>
                            <div className="flex justify-between text-xs font-semibold mb-1">
                              <span>Hard</span>
                              <span>{difficultyConfig.hard}%</span>
                            </div>
                            <input
                              type="range"
                              min="0"
                              max="100"
                              value={difficultyConfig.hard}
                              onChange={(e) => setDifficultyConfig({ ...difficultyConfig, hard: Number(e.target.value) })}
                              className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-violet-500"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Bloom Taxonomy Targets */}
                      <div className="space-y-4">
                        <h4 className="text-sm font-bold border-b border-slate-100 dark:border-slate-800 pb-2">Bloom's Cognitive Taxonomy Profile</h4>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                          {Object.entries(bloomConfig).map(([key, val]) => (
                            <div key={key} className="bg-slate-50 dark:bg-slate-850 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-center">
                              <span className="text-[10px] font-bold text-slate-400 capitalize">{key}</span>
                              <input
                                type="number"
                                value={val}
                                onChange={(e) => setBloomConfig({ ...bloomConfig, [key]: Number(e.target.value) })}
                                className="w-full text-center font-bold text-sm bg-transparent border-0 focus:ring-0 mt-1"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Sidebar Syllabus Overview */}
                  <div className="space-y-6">
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
                      <h3 className="text-md font-bold flex items-center space-x-2">
                        <BookOpen className="h-4.5 w-4.5 text-indigo-500" />
                        <span>Parsed Syllabus Content</span>
                      </h3>
                      <p className="text-xs text-slate-400">These modules have been indexed into our knowledge cache layer for retrieval grounding.</p>

                      <div className="space-y-2">
                        {syllabusFile?.parsedUnits.map((unit, index) => (
                          <div
                            key={index}
                            className="p-3 bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-xl flex items-start space-x-2.5 text-xs"
                          >
                            <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                            <span className="font-semibold leading-relaxed">{unit}</span>
                          </div>
                        ))}
                      </div>

                      <button
                        onClick={triggerGenerationPipeline}
                        className="w-full bg-violet-600 hover:bg-violet-700 text-white font-bold text-sm py-3 rounded-xl shadow-lg shadow-violet-500/10 flex items-center justify-center space-x-2 transition"
                      >
                        <Sparkles className="h-4 w-4" />
                        <span>Generate Examination Paper</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Agentic Generation Pipeline Progress */}
              {step === 3 && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 shadow-sm space-y-6 max-w-2xl mx-auto"
                >
                  <div className="text-center space-y-2">
                    <h3 className="text-lg font-bold flex items-center justify-center space-x-2">
                      <RotateCw className="h-5 w-5 text-violet-500 animate-spin" />
                      <span>Orchestrating Generative AI Agents</span>
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Processing end-to-end evaluation rules. Creating blueprints, parsing questions, checking plagiarism.
                    </p>
                  </div>

                  {/* Horizontal Bar */}
                  <div className="w-full bg-slate-200 dark:bg-slate-800 h-3 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-violet-500 to-indigo-500 h-full transition-all duration-300"
                      style={{ width: `${pipelineProgress}%` }}
                    />
                  </div>

                  {/* Logging Panel */}
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs text-emerald-400 space-y-2 max-h-64 overflow-y-auto">
                    {pipelineLogs.map((log, i) => (
                      <div key={i} className="flex items-start space-x-2">
                        <span className="text-slate-600 font-bold shrink-0">{`[${new Date().toLocaleTimeString()}]`}</span>
                        <span>{log}</span>
                      </div>
                    ))}
                    {activeAgent && (
                      <div className="flex items-center space-x-2 text-violet-400 font-semibold animate-pulse">
                        <Bot className="h-4 w-4" />
                        <span>{activeAgent} executing tasks...</span>
                      </div>
                    )}
                    {generationComplete && (
                      <div className="flex items-center space-x-2 text-emerald-400 font-semibold">
                        <span>✓ Generation process complete. Finalizing review schemas.</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Step 4: Review and Institutional PDF Export */}
              {step === 4 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="grid grid-cols-1 xl:grid-cols-3 gap-8"
                >
                  {/* Left Column: Visual Exam Editor */}
                  <div className="xl:col-span-2 space-y-6">
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
                      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                        <div>
                          <h3 className="text-lg font-bold">Exam Paper Draft Workspace</h3>
                          <p className="text-xs text-slate-400">Review questions below. Edit content, regenerate, or configure options.</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={addQuestionManual}
                            className="bg-slate-100 dark:bg-slate-850 hover:bg-slate-200 border border-slate-200 dark:border-slate-700 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition"
                          >
                            <Plus className="h-3.5 w-3.5" />
                            <span>Add Question</span>
                          </button>
                          <button
                            onClick={() => setShowAnswerKey(!showAnswerKey)}
                            className={`border px-3 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition ${
                              showAnswerKey
                                ? "bg-indigo-500/10 text-indigo-500 border-indigo-500/30"
                                : "bg-slate-100 dark:bg-slate-850 border-slate-200 dark:border-slate-700"
                            }`}
                          >
                            <Eye className="h-3.5 w-3.5" />
                            <span>{showAnswerKey ? "Hide Answer Key" : "View Answers & Rubrics"}</span>
                          </button>
                        </div>
                      </div>

                      {/* Question List */}
                      <div className="space-y-6">
                        {questions.map((q, idx) => (
                          <div
                            key={q.id}
                            className="p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500/30 rounded-xl space-y-3 transition relative group"
                          >
                            {/* Question Header Metadata */}
                            <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 border-b border-slate-100 dark:border-slate-800/85 pb-2">
                              <div className="flex items-center space-x-3">
                                <span className="bg-indigo-500/10 text-indigo-500 px-2 py-0.5 rounded-md">Q {idx + 1} ({q.type})</span>
                                <span className="bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded-md">Bloom: {q.bloom}</span>
                                <span className="bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded-md">Difficulty: {q.difficulty}</span>
                              </div>
                              <div className="flex items-center space-x-3">
                                <span>Marks: {q.marks}</span>
                                <span className="text-violet-500">{q.co} / {q.po}</span>
                              </div>
                            </div>

                            {/* Question Body */}
                            {editingQuestionId === q.id ? (
                              <div className="space-y-3">
                                <textarea
                                  value={editForm.text}
                                  onChange={(e) => setEditForm({ ...editForm, text: e.target.value })}
                                  className="w-full p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent text-sm font-medium focus:ring-1 focus:ring-violet-500 focus:outline-none"
                                  rows={3}
                                />
                                <div className="space-y-1">
                                  <label className="text-[10px] font-bold text-slate-400 uppercase">Answer Key/Guidelines</label>
                                  <textarea
                                    value={editForm.answer}
                                    onChange={(e) => setEditForm({ ...editForm, answer: e.target.value })}
                                    className="w-full p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent text-xs text-slate-300 focus:ring-1 focus:ring-violet-500 focus:outline-none"
                                    rows={2}
                                  />
                                </div>
                                <div className="flex justify-end space-x-2">
                                  <button
                                    onClick={() => setEditingQuestionId(null)}
                                    className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-bold"
                                  >
                                    Cancel
                                  </button>
                                  <button
                                    onClick={() => saveEditQuestion(q.id)}
                                    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold"
                                  >
                                    Save
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div className="space-y-2">
                                <p className="text-sm font-semibold leading-relaxed">{q.text}</p>
                                {q.options && (
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pl-2">
                                    {q.options.map((opt, i) => (
                                      <div key={i} className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                                        {opt}
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            )}

                            {/* Show Answer Key */}
                            {showAnswerKey && !editingQuestionId && (
                              <div className="bg-emerald-500/5 border border-emerald-500/20 p-3 rounded-lg text-xs space-y-1.5 mt-2">
                                <p className="font-bold text-emerald-500">Correct Answer / Marking Rubric Guidelines:</p>
                                <p className="text-slate-400 leading-relaxed whitespace-pre-line">{q.answer}</p>
                              </div>
                            )}

                            {/* Question Actions overlay */}
                            <div className="absolute right-3 bottom-3 hidden group-hover:flex items-center space-x-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-1.5 rounded-lg shadow-md">
                              <button
                                onClick={() => startEditQuestion(q)}
                                className="p-1 text-slate-400 hover:text-slate-900 dark:hover:text-white transition"
                                title="Edit Question"
                              >
                                📝
                              </button>
                              <button
                                onClick={() => regenerateQuestion(q.id)}
                                className="p-1 text-slate-400 hover:text-violet-500 transition"
                                title="Regenerate Question"
                              >
                                🔄
                              </button>
                              <button
                                onClick={() => deleteQuestion(q.id)}
                                className="p-1 text-slate-400 hover:text-red-500 transition"
                                title="Delete Question"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Institutional Export Canvas Previews */}
                  <div className="space-y-6">
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
                      <h3 className="text-md font-bold flex items-center space-x-2">
                        <FileDown className="h-4.5 w-4.5 text-violet-500" />
                        <span>Export Center</span>
                      </h3>
                      <p className="text-xs text-slate-400">Configure watermarks, confidentiality banners, and export options.</p>

                      <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-4 bg-slate-50 dark:bg-slate-950 font-mono text-[10px] text-slate-400 space-y-2 relative overflow-hidden">
                        {/* Simulated Watermark */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none opacity-[0.03] rotate-[-30deg] text-3xl font-black text-slate-400">
                          CONFIDENTIAL
                        </div>

                        {/* Document Mock Preview Header */}
                        <div className="text-center border-b border-slate-200 dark:border-slate-800 pb-2 space-y-1">
                          <p className="font-bold text-[9px] uppercase tracking-wider">{activeTenant}</p>
                          <p className="text-[8px] text-slate-500">{examTitle}</p>
                          <div className="flex justify-between text-[7px] text-slate-500 pt-1">
                            <span>Code: CS-801</span>
                            <span>Time: 3 Hours</span>
                            <span>Marks: 100</span>
                          </div>
                        </div>

                        {/* Questions preview details */}
                        <div className="space-y-2 text-[8px] leading-relaxed pt-2">
                          <p className="font-bold uppercase text-[7px] border-b border-slate-800 pb-0.5">Section A (MCQs & Short Questions)</p>
                          <p>1. Which of the following is the most suitable method to handle session...</p>
                          <p>2. What is the primary trade-off when configuring a high ef_construction...</p>
                          <p className="font-bold uppercase text-[7px] border-b border-slate-800 pb-0.5 pt-1">Section B (Design & Analysis)</p>
                          <p>3. Explain the difference between monolith and modular monolith architectural...</p>
                          <p>4. Design a relational schema using SQL DDL that enables row-level...</p>
                        </div>

                        {/* Confidential stamps / QR details */}
                        <div className="flex items-center justify-between border-t border-slate-200 dark:border-slate-800 pt-3 text-[7px] text-slate-500">
                          <div className="flex items-center space-x-1">
                            <span>🔒 Signed via SHA256</span>
                          </div>
                          <span>Page 1 of 2</span>
                        </div>
                      </div>

                      {/* Download configurations */}
                      <div className="space-y-2.5">
                        <button
                          onClick={() => alert("Simulating Institutional PDF Download with headers, footers, QR and Watermarks.")}
                          className="w-full bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs py-3 rounded-xl flex items-center justify-center space-x-2 transition"
                        >
                          <Download className="h-4 w-4" />
                          <span>Download Student Copy (PDF)</span>
                        </button>
                        <button
                          onClick={() => alert("Simulating Faculty Key/Rubrics Export.")}
                          className="w-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-white font-bold text-xs py-3 rounded-xl flex items-center justify-center space-x-2 border border-slate-200 dark:border-slate-700 transition"
                        >
                          <FileText className="h-4 w-4 text-emerald-500" />
                          <span>Download Answer Key & Rubrics</span>
                        </button>
                      </div>

                      <button
                        onClick={() => setStep(1)}
                        className="w-full text-slate-400 hover:text-slate-200 text-xs font-semibold py-1.5 flex items-center justify-center space-x-1 transition"
                      >
                        <RotateCw className="h-3 w-3" />
                        <span>Start New Generation Session</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          )}

          {/* Question Bank Interface Tab */}
          {activeTab === "bank" && (
            <div className="max-w-5xl mx-auto space-y-6 animate-fadeIn">
              <div className="border-b border-slate-200 dark:border-slate-800 pb-5">
                <h2 className="text-2xl font-bold tracking-tight">Institutional Question Repository</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">Search and fetch vetted questions from our semantic vector index.</p>
              </div>

              {/* Search parameters */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-2 relative">
                  <Search className="absolute left-3 top-2.5 h-4.5 w-4.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search by topic, keyword, or vector similarity..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 text-sm focus:ring-1 focus:ring-violet-500 focus:outline-none"
                  />
                </div>
                <div>
                  <select
                    value={bankDifficulty}
                    onChange={(e) => setBankDifficulty(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 text-sm focus:outline-none focus:ring-1 focus:ring-violet-500"
                  >
                    <option value="All">All Difficulty</option>
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
                <div>
                  <button
                    onClick={triggerSemanticSearch}
                    className="w-full bg-violet-600 hover:bg-violet-700 text-white font-bold text-sm py-2 rounded-lg transition"
                  >
                    Run Search Scan
                  </button>
                </div>
              </div>

              {/* Duplicate check visualization alerts */}
              {duplicateScanOutput && (
                <div className="p-4 bg-amber-500/10 border border-amber-500/20 text-amber-500 rounded-xl flex items-start space-x-3 text-xs">
                  <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="font-bold">{duplicateScanOutput.status}</p>
                    <p className="text-slate-400">Cosine proximity score: {duplicateScanOutput.score} (pgvector index matches high-density nodes).</p>
                  </div>
                </div>
              )}

              {/* List of matched items */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
                <h3 className="text-md font-bold">Vector Similarity Search Results</h3>
                <div className="space-y-3">
                  {seededBankQuestions.map((item, i) => (
                    <div key={i} className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl flex items-center justify-between text-xs">
                      <div>
                        <p className="font-semibold text-slate-300">{item.text}</p>
                        <span className="text-[10px] text-amber-500 font-bold mt-1 inline-block">Score proximity: {item.similarity}</span>
                      </div>
                      <button
                        onClick={() => alert("Question imported to draft session.")}
                        className="bg-slate-200 hover:bg-slate-350 dark:bg-slate-800 dark:hover:bg-slate-750 px-3 py-1.5 rounded-lg font-bold"
                      >
                        Add to Session
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Teaching Assistant Tab */}
          {activeTab === "assistant" && (
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="border-b border-slate-200 dark:border-slate-800 pb-5 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight">AI Teaching Assistant</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Consult institution regulations, search syllabi or draft specific prompts.</p>
                </div>

                {/* Model switch */}
                <div className="flex items-center space-x-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg border border-slate-200 dark:border-slate-700">
                  <button
                    onClick={() => setAssistantModel("flash")}
                    className={`px-3 py-1 rounded text-xs font-bold transition ${
                      assistantModel === "flash" ? "bg-violet-500 text-white" : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    Gemini 2.5 Flash
                  </button>
                  <button
                    onClick={() => setAssistantModel("pro")}
                    className={`px-3 py-1 rounded text-xs font-bold transition ${
                      assistantModel === "pro" ? "bg-violet-500 text-white" : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    Gemini 2.5 Pro
                  </button>
                </div>
              </div>

              {/* Chat Canvas */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm h-[480px] flex flex-col justify-between">
                {/* Messages Box */}
                <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                  {chatHistory.map((msg, i) => (
                    <div
                      key={i}
                      className={`flex space-x-3 max-w-lg ${
                        msg.sender === "user" ? "ml-auto flex-row-reverse space-x-reverse" : ""
                      }`}
                    >
                      <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${
                        msg.sender === "user" ? "bg-indigo-500" : "bg-violet-500/10 border border-violet-500/20 text-violet-500"
                      }`}>
                        {msg.sender === "user" ? <UserIcon className="h-4 w-4 text-white" /> : <Bot className="h-4 w-4" />}
                      </div>
                      <div className="space-y-1">
                        <div className={`p-3 rounded-2xl text-xs leading-relaxed ${
                          msg.sender === "user"
                            ? "bg-violet-600 text-white"
                            : "bg-slate-550 dark:bg-slate-850 text-slate-350 dark:text-slate-300 border border-slate-200 dark:border-slate-800"
                        }`}>
                          <p className="whitespace-pre-line">{msg.text}</p>
                          {/* Executed Tools Details */}
                          {msg.tools && (
                            <div className="mt-2.5 pt-2 border-t border-slate-200 dark:border-slate-800 space-y-1">
                              <span className="text-[9px] font-bold text-violet-400 uppercase tracking-widest block">System Tool Actions Invoked:</span>
                              {msg.tools.map((t, idx) => (
                                <span key={idx} className="inline-block bg-slate-900 text-emerald-400 border border-slate-800 font-mono text-[9px] px-1.5 py-0.5 rounded mr-1.5">
                                  🔧 {t}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        <span className="text-[9px] text-slate-500 block px-1">{msg.timestamp}</span>
                      </div>
                    </div>
                  ))}
                  {isChatTyping && (
                    <div className="flex space-x-3 items-center">
                      <div className="h-8 w-8 rounded-full bg-violet-500/10 text-violet-500 flex items-center justify-center shrink-0 border border-violet-500/20">
                        <Bot className="h-4 w-4" />
                      </div>
                      <div className="flex items-center space-x-1.5 p-3 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800">
                        <span className="h-2 w-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                        <span className="h-2 w-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                        <span className="h-2 w-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                      </div>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>

                {/* Input form */}
                <form onSubmit={handleChatSubmit} className="mt-4 border-t border-slate-200 dark:border-slate-800 pt-4 flex space-x-2">
                  <input
                    type="text"
                    placeholder="Ask about syllabus objectives, exam guidelines, or check duplicate questions..."
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-850 text-xs focus:ring-1 focus:ring-violet-500 focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="bg-violet-600 hover:bg-violet-700 text-white p-2.5 rounded-xl transition"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* Paper Analytics Tab */}
          {activeTab === "analytics" && (
            <div className="max-w-5xl mx-auto space-y-6">
              <div className="border-b border-slate-200 dark:border-slate-800 pb-5">
                <h2 className="text-2xl font-bold tracking-tight">Rigor & Attainment Analytics</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">Evaluate exam blueprints metrics prior to final printing approval.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Bloom taxonomy coverage card */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
                  <h3 className="text-sm font-bold border-b border-slate-100 dark:border-slate-800 pb-2">Bloom Cognitive Levels</h3>
                  <div className="space-y-2 text-xs">
                    <div>
                      <div className="flex justify-between mb-1 font-semibold">
                        <span>Remember / Recall</span>
                        <span>20%</span>
                      </div>
                      <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-indigo-500 h-full" style={{ width: "20%" }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1 font-semibold">
                        <span>Understand / Explain</span>
                        <span>30%</span>
                      </div>
                      <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-indigo-500 h-full" style={{ width: "30%" }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1 font-semibold">
                        <span>Apply / Calculate</span>
                        <span>30%</span>
                      </div>
                      <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-indigo-500 h-full" style={{ width: "30%" }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1 font-semibold">
                        <span>Analyze / Evaluate</span>
                        <span>20%</span>
                      </div>
                      <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-violet-500 h-full" style={{ width: "20%" }} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Difficulty attainment curves card */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
                  <h3 className="text-sm font-bold border-b border-slate-100 dark:border-slate-800 pb-2">Difficulty Distribution Profile</h3>
                  <div className="space-y-2 text-xs">
                    <div>
                      <div className="flex justify-between mb-1 font-semibold">
                        <span>Easy Questions</span>
                        <span>30%</span>
                      </div>
                      <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-emerald-500 h-full" style={{ width: "30%" }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1 font-semibold">
                        <span>Medium Questions</span>
                        <span>50%</span>
                      </div>
                      <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-amber-500 h-full" style={{ width: "50%" }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1 font-semibold">
                        <span>Hard Questions</span>
                        <span>20%</span>
                      </div>
                      <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-rose-500 h-full" style={{ width: "20%" }} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Unit/CO outcomes mapping card */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
                  <h3 className="text-sm font-bold border-b border-slate-100 dark:border-slate-800 pb-2">Curriculum Outcomes Coverage</h3>
                  <div className="space-y-3 text-xs font-semibold">
                    <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-850 p-2 rounded-lg border border-slate-200 dark:border-slate-800">
                      <span>Course Outcome 1 (CO-1)</span>
                      <span className="text-emerald-500">100% Coverage</span>
                    </div>
                    <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-850 p-2 rounded-lg border border-slate-200 dark:border-slate-800">
                      <span>Course Outcome 2 (CO-2)</span>
                      <span className="text-emerald-500">100% Coverage</span>
                    </div>
                    <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-850 p-2 rounded-lg border border-slate-200 dark:border-slate-800">
                      <span>Course Outcome 3 (CO-3)</span>
                      <span className="text-amber-500">80% Coverage</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Admin settings */}
          {activeTab === "admin" && (
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="border-b border-slate-200 dark:border-slate-800 pb-5">
                <h2 className="text-2xl font-bold tracking-tight">Institutional Administration</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">Manage departments, templates, keys, and approve pending exam papers.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Paper Approval Queues */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
                  <h3 className="text-sm font-bold border-b border-slate-100 dark:border-slate-800 pb-2">Pending Moderator Approval Queue</h3>
                  <div className="space-y-3">
                    <div className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl flex items-center justify-between text-xs">
                      <div>
                        <p className="font-semibold text-slate-350">CS-603: Computer Networks</p>
                        <span className="text-[10px] text-slate-500 font-bold block mt-1">Submitted by: Prof. Andrew K.</span>
                      </div>
                      <button
                        onClick={() => alert("Exam paper has been approved.")}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-1.5 rounded-lg font-bold"
                      >
                        Approve
                      </button>
                    </div>
                  </div>
                </div>

                {/* Templates and System rules */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
                  <h3 className="text-sm font-bold border-b border-slate-100 dark:border-slate-800 pb-2">Institutional Layout Templates</h3>
                  <div className="space-y-2 text-xs">
                    <div className="p-3 bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-850 rounded-lg flex items-center justify-between">
                      <span className="font-semibold">NIT Semester Assessment Standard</span>
                      <span className="text-[10px] text-violet-500 font-bold">Active</span>
                    </div>
                    <div className="p-3 bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-850 rounded-lg flex items-center justify-between opacity-60">
                      <span>General MCQ Study Guide Pattern</span>
                      <span className="text-[10px] text-slate-500">Draft</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Footer System Status Banner */}
      <footer className="border-t border-slate-200 dark:border-slate-800 py-3 px-6 bg-slate-100/50 dark:bg-slate-950/50 flex flex-col md:flex-row items-center justify-between text-[11px] text-slate-500">
        <div className="flex items-center space-x-2">
          <Clock className="h-3.5 w-3.5" />
          <span>System active. Active generation jobs: 0. Database pool utilization: 8%</span>
        </div>
        <div className="flex items-center space-x-4 mt-2 md:mt-0 font-semibold">
          <a href="#" className="hover:text-slate-800 dark:hover:text-white transition">API Status</a>
          <a href="#" className="hover:text-slate-800 dark:hover:text-white transition">Security Guidelines</a>
          <span>v1.0.0 (Production Blueprint release)</span>
        </div>
      </footer>
    </div>
  );
}
