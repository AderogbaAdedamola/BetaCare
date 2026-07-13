import { useState, useEffect, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router";
import {
  Bot,
  User,
  Send,
  Trash2,
  Sparkles,
  Shield,
  Building2,
  CheckCircle2,
  MessageSquare,
  Check,
  X,
  Pencil,
  Info,
  ChevronLeft,
  MoreVertical,
  Play,
  Pause,
  Volume2,
  Mic,
  FileText
} from "lucide-react";
import { usePatient } from "../../../context/PatientContext";
import { toast } from "sonner";

// AI response engine for direct AI Assistant thread
function generateAIReply(message) {
  const lower = message.toLowerCase();

  if (lower.includes("fever") || lower.includes("feverish") || lower.includes("temperature")) {
    return "A fever may indicate an infection or an inflammatory response. Monitor your temperature closely. Since you have Hypertension on record, avoid NSAIDs like Ibuprofen without consulting your doctor — they can raise blood pressure. If your temperature exceeds 39.5°C or persists beyond 48 hours, please seek emergency care or contact your clinician.";
  }
  if (lower.includes("nausea") || lower.includes("vomit") || lower.includes("stomach")) {
    return "Nausea can be triggered by many factors — medication side effects, dietary issues, or minor infections. Sip small amounts of water frequently to stay hydrated. Try to avoid heavy or oily meals. If nausea is persistent, paired with vomiting for more than 12 hours, or accompanied by severe abdominal pain, please consult a physician promptly.";
  }
  if (lower.includes("headache") || lower.includes("migraine") || lower.includes("head pain")) {
    return "Headaches in hypertensive patients can sometimes be a blood pressure warning sign. I recommend checking your BP now if you have a monitor at home. Your last recorded reading was stable, but sudden or severe headaches — especially at the back of the head — should be evaluated by a doctor immediately. Rest, hydrate, and avoid bright screens if possible.";
  }
  if (lower.includes("medication") || lower.includes("pill") || lower.includes("dose") || lower.includes("lisinopril") || lower.includes("metformin") || lower.includes("amlodipine")) {
    return "Consistent medication adherence is critical for managing your conditions. Lisinopril should be taken at the same time each day, and Metformin is best taken with meals to minimize stomach discomfort. If you missed a dose, take it as soon as you remember — unless it's nearly time for your next dose, in which case skip it. Never double-dose. If side effects are persistent, please report them to your prescribing doctor.";
  }
  if (lower.includes("blood pressure") || lower.includes("bp") || lower.includes("hypertension")) {
    return "Your BP has been trending well this week based on your logs. To keep it stable: limit salt to under 2g/day, maintain at least 30 minutes of moderate exercise most days, avoid alcohol and smoking, and ensure you're taking your antihypertensive medications consistently. Stress management also plays a key role. I recommend logging your BP morning and evening for the next 7 days for a cleaner trend.";
  }
  if (lower.includes("blood sugar") || lower.includes("glucose") || lower.includes("diabetes") || lower.includes("diabetic")) {
    return "Your last fasting blood sugar reading was 92 mg/dL — well within normal range (70–100 mg/dL). To keep it stable, focus on a low-GI diet, regular walking, and consistent timing of your Metformin doses. Avoid skipping meals as this can cause hypoglycemic episodes. If you experience dizziness, sweating, or confusion, check your sugar immediately and have a fast-acting glucose source (like juice or candy) on hand.";
  }
  if (lower.includes("sleep") || lower.includes("insomnia") || lower.includes("insomniac")) {
    return "Poor sleep can significantly affect blood pressure regulation and metabolic health. I recommend maintaining a consistent sleep schedule (same bedtime/wake time), avoiding screens 1 hour before bed, and limiting caffeine after 2 PM. If fatigue is persistent and unexplained, it may be worth checking for anaemia or thyroid dysfunction during your next lab visit.";
  }
  if (lower.includes("exercise") || lower.includes("workout") || lower.includes("gym") || lower.includes("walk")) {
    return "Regular exercise is one of the best lifestyle interventions for both hypertension and blood sugar control. Aim for at least 150 minutes of moderate aerobic activity per week (e.g., brisk walking, cycling). Avoid intense, sudden bursts of high-intensity exercise without warm-up — this can transiently spike blood pressure. Always check your BP before and after workouts when starting a new routine.";
  }
  if (lower.includes("diet") || lower.includes("food") || lower.includes("eat") || lower.includes("nutrition")) {
    return "For your conditions, I recommend: the DASH diet (Dietary Approaches to Stop Hypertension) which emphasizes fruits, vegetables, low-fat dairy, and lean proteins. Reduce sodium intake, processed foods, and simple carbohydrates. Increase potassium-rich foods (bananas, spinach) as they naturally help lower blood pressure. Avoid skipping meals to keep blood sugar stable.";
  }
  if (lower.includes("chest") || lower.includes("pain") || lower.includes("breathe") || lower.includes("breathing")) {
    return "⚠️ **Important**: Chest pain, tightness, or difficulty breathing are potential cardiac warning signs — especially given your hypertension history. **Please call emergency services (112 in Nigeria) immediately or go to the nearest emergency room.** Do not drive yourself. While waiting for help, sit or lie down in a comfortable position and do not eat or drink anything. I'm an AI and cannot diagnose, but please treat this as an emergency.";
  }
  if (lower.includes("allerg") || lower.includes("penicillin") || lower.includes("peanut")) {
    return "Your health profile flags two allergies: **Penicillin** and **Peanuts**. Always inform any clinician or pharmacist about these before receiving any antibiotic or medication. Penicillin-class antibiotics include Amoxicillin, Ampicillin, and others — request non-penicillin alternatives when treating infections. For peanut allergy, always read food labels carefully and carry an antihistamine if prescribed by your doctor.";
  }

  return "Thank you for reaching out! As your BetaCare AI assistant, I can provide health guidance based on your medical profile. For best results, describe your specific symptom or question (e.g., 'I have a headache', 'I missed my Metformin dose', or 'my blood pressure reading is high'). Remember, I'm here to assist and inform — for urgent or emergency situations, always contact a healthcare professional or emergency services directly.";
}

// AI response engine for clinicians (Simulating doctor auto-replies)
function generateClinicianReply(message, coPilotEnabled) {
  const lower = message.toLowerCase();
  
  if (!coPilotEnabled) {
    return "Thank you for reaching out. I have received your message and will review it alongside your recent logs when I get back to my desk.";
  }

  const prefix = "*(AI Co-Pilot Assisted)* ";
  if (lower.includes("chest") || lower.includes("pain") || lower.includes("breath")) {
    return prefix + "Chest tightness or breathing issues are serious health flags given your Hypertension. Please seek emergency medical care at LUTH or Reddington Hospital immediately. Do not wait.";
  }
  if (lower.includes("headache") || lower.includes("migraine") || lower.includes("head pain")) {
    return prefix + "Persistent headaches can be related to spikes in blood pressure. Please monitor and log your BP right now. Rest in a dark, quiet room.";
  }
  if (lower.includes("insulin") || lower.includes("sugar") || lower.includes("glucose") || lower.includes("diabetes")) {
    return prefix + "Maintaining a tight blood sugar log is essential. I see your recent glucose was stable (92 mg/dL). Ensure you take your Metformin doses on schedule.";
  }
  if (lower.includes("exercise") || lower.includes("walk") || lower.includes("gym")) {
    return prefix + "Regular physical activity helps lower insulin resistance and BP. Keep it to moderate walking or cycling, and avoid heavy weightlifting without a proper warm-up.";
  }
  if (lower.includes("diet") || lower.includes("food") || lower.includes("salt")) {
    return prefix + "Limiting sodium is key for blood pressure control. Focus on high-fiber, low-sodium meals and ensure you stay well-hydrated throughout the day.";
  }
  if (lower.includes("lisinopril") || lower.includes("metformin") || lower.includes("medication")) {
    return prefix + "Ensure you do not skip your Lisinopril doses. If you experience persistent dry cough or dizziness, please let me know so we can review the dosage.";
  }

  return prefix + "I've reviewed your query. Your recent vitals are stable. Let's make sure we schedule a routine checkup next week to monitor your progress.";
}

const INITIAL_AI_CHAT = [
  {
    role: "assistant",
    content: "👋 Hello! I'm your BetaCare AI Health Assistant. I can help you with health queries, medication questions, symptom guidance, and general wellness advice based on your medical profile.\n\nWhat would you like to discuss today?",
    timestamp: new Date(Date.now() - 3600000)
  }
];

const INITIAL_DOC_CHAT = [
  {
    role: "assistant",
    content: "Hi Damola, I saw your recent BP logs. They look quite stable. Are you experiencing any side effects from Lisinopril, or having any headache issues?",
    timestamp: new Date(Date.now() - 7200000)
  }
];

const INITIAL_HOSP_CHAT = [
  {
    role: "assistant",
    content: "Hello Damola, this is LUTH administration. Your next cardiology follow-up consultation is tentatively scheduled for next Thursday at 10:00 AM. Please confirm if you will attend.",
    timestamp: new Date(Date.now() - 86400000)
  }
];

export default function PatientAIChat() {
  const { patient, profile, updateProfile } = usePatient();
  const [searchParams] = useSearchParams();
  const navigate = useSearchParams()[1] ? useNavigate() : useNavigate();
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  // Active chat state
  const [activeThread, setActiveThread] = useState("ai"); // "ai" | "doc_001" | "hosp_luth" | "hosp_reddington"
  const [coPilotEnabled, setCoPilotEnabled] = useState(true);
  const [mobileView, setMobileView] = useState("threads"); // "threads" | "chat" | "insights"

  // Dropdown menu state
  const [menuOpen, setMenuOpen] = useState(false);

  // Search/Filter state
  const [searchQuery, setSearchQuery] = useState("");

  // Messaging state
  const [threadHistory, setThreadHistory] = useState(() => {
    const saved = sessionStorage.getItem("betacare_threads_history");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        Object.keys(parsed).forEach(k => {
          parsed[k] = parsed[k].map(m => ({ ...m, timestamp: new Date(m.timestamp) }));
        });
        return parsed;
      } catch (e) {}
    }
    return {
      ai: INITIAL_AI_CHAT,
      doc_001: INITIAL_DOC_CHAT,
      hosp_luth: INITIAL_HOSP_CHAT,
      hosp_reddington: [
        {
          role: "assistant",
          content: "Welcome to the Reddington Hospital patient communications channel. Let us know if you need to schedule lab checkups or sync health records.",
          timestamp: new Date(Date.now() - 172800000)
        }
      ]
    };
  });

  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  // Audio recording state
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const timerRef = useRef(null);
  const [playingAudioId, setPlayingAudioId] = useState(null);

  // AI Health Insights state
  const [pendingInsights, setPendingInsights] = useState(() => {
    const saved = localStorage.getItem("betacare_pending_insights");
    return saved ? JSON.parse(saved) : [];
  });

  const [editingInsightId, setEditingInsightId] = useState(null);
  const [editingValue, setEditingValue] = useState("");

  // Sync state
  useEffect(() => {
    sessionStorage.setItem("betacare_threads_history", JSON.stringify(threadHistory));
  }, [threadHistory]);

  useEffect(() => {
    localStorage.setItem("betacare_pending_insights", JSON.stringify(pendingInsights));
  }, [pendingInsights]);

  // Monitor voice checkin query param
  useEffect(() => {
    const voiceCheck = searchParams.get("voicecheckin");
    if (voiceCheck === "true") {
      setActiveThread("ai");
      setIsRecording(true);
      const nextParams = new URLSearchParams(searchParams);
      nextParams.delete("voicecheckin");
      navigate(`/patient/care-connect?${nextParams.toString()}`, { replace: true });
    }
  }, [searchParams, navigate]);

  // Handle timer inside recording modal
  useEffect(() => {
    if (isRecording) {
      setRecordingSeconds(0);
      timerRef.current = setInterval(() => {
        setRecordingSeconds(prev => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRecording]);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [threadHistory, activeThread, isTyping]);

  const activeMessages = threadHistory[activeThread] || [];

  const handleToggleCoPilot = () => {
    setCoPilotEnabled(!coPilotEnabled);
    if (!coPilotEnabled) {
      toast.success("AI Co-Pilot Assist Enabled! AI is now monitoring conversations for clinical insights.", {
        icon: "🤖",
      });
    } else {
      toast.info("AI Co-Pilot Assist Disabled.");
    }
  };

  // Real-time AI Insight Parser
  const extractInsight = (text) => {
    if (!coPilotEnabled) return;
    const lower = text.toLowerCase();
    let newInsight = null;

    if (lower.includes("chest pain") || lower.includes("tightness") || lower.includes("chest tight")) {
      newInsight = { id: `ins_${Date.now()}`, type: "condition", value: "Suspected Angina / Chest Tightness" };
    } else if (lower.includes("headache") || lower.includes("migraine") || lower.includes("head pain")) {
      newInsight = { id: `ins_${Date.now()}`, type: "condition", value: "Recurrent Migraines" };
    } else if (lower.includes("asthma") || lower.includes("wheez")) {
      newInsight = { id: `ins_${Date.now()}`, type: "condition", value: "Bronchial Asthma" };
    } else if (lower.includes("fever") || lower.includes("feverish")) {
      newInsight = { id: `ins_${Date.now()}`, type: "condition", value: "Acute Fever" };
    } else if (lower.includes("cough")) {
      newInsight = { id: `ins_${Date.now()}`, type: "condition", value: "Persistent Cough" };
    } else if (lower.includes("ibuprofen")) {
      newInsight = { id: `ins_${Date.now()}`, type: "medication", value: "Ibuprofen 400mg as needed" };
    } else if (lower.includes("aspirin")) {
      newInsight = { id: `ins_${Date.now()}`, type: "medication", value: "Aspirin 81mg daily" };
    } else if (lower.includes("insulin")) {
      newInsight = { id: `ins_${Date.now()}`, type: "medication", value: "Insulin Glargine daily" };
    }

    if (newInsight) {
      setPendingInsights(prev => {
        if (prev.some(p => p.value === newInsight.value)) return prev;
        
        toast.info("🤖 AI Co-Pilot extracted a new health insight!", {
          description: `Detected: ${newInsight.value}. Review in the Co-Pilot panel.`,
          duration: 5000,
        });

        // Add a mock notification to alerts center
        const newNotif = {
          id: `notif_${Date.now()}`,
          type: "checkin",
          title: "AI Co-Pilot Health Flag",
          message: `AI has flagged a potential health update: "${newInsight.value}" based on your recent messages. Click to review and add to history.`,
          time: "Just now",
          read: false
        };
        const savedNotifs = localStorage.getItem("betacare_notifications");
        const currentNotifs = savedNotifs ? JSON.parse(savedNotifs) : [];
        localStorage.setItem("betacare_notifications", JSON.stringify([newNotif, ...currentNotifs]));

        return [newInsight, ...prev];
      });
    }
  };

  const handleApproveInsight = (insight) => {
    if (!profile) return;
    
    const updatedProfile = { ...profile };
    if (!updatedProfile.profile) {
      updatedProfile.profile = { conditions: [], medications: [] };
    }
    
    if (insight.type === "condition") {
      if (!updatedProfile.profile.conditions.includes(insight.value)) {
        updatedProfile.profile.conditions = [...updatedProfile.profile.conditions, insight.value];
      }
    } else {
      if (!updatedProfile.profile.medications.includes(insight.value)) {
        updatedProfile.profile.medications = [...updatedProfile.profile.medications, insight.value];
      }
    }
    
    updateProfile(updatedProfile);
    setPendingInsights(prev => prev.filter(p => p.id !== insight.id));
    toast.success(`Success! Added "${insight.value}" to your EHR Health History.`);
  };

  const startEdit = (insight) => {
    setEditingInsightId(insight.id);
    setEditingValue(insight.value);
  };

  const saveEdit = (insightId) => {
    setPendingInsights(prev => prev.map(p => {
      if (p.id === insightId) {
        return { ...p, value: editingValue };
      }
      return p;
    }));
    setEditingInsightId(null);
    toast.success("Insight description updated.");
  };

  const handleSendMessage = (text) => {
    const content = text || inputText.trim();
    if (!content) return;

    const userMessage = { id: `msg_${Date.now()}`, role: "user", content, timestamp: new Date() };
    
    setThreadHistory(prev => ({
      ...prev,
      [activeThread]: [...(prev[activeThread] || []), userMessage]
    }));
    setInputText("");
    setIsTyping(true);

    // AI Insight parsing in background
    setTimeout(() => {
      extractInsight(content);
    }, 400);

    const delay = 800 + Math.random() * 800;
    setTimeout(() => {
      let replyContent = "";
      if (activeThread === "ai") {
        replyContent = generateAIReply(content);
      } else {
        replyContent = generateClinicianReply(content, coPilotEnabled);
      }

      const reply = { id: `msg_${Date.now()}`, role: "assistant", content: replyContent, timestamp: new Date() };
      setThreadHistory(prev => ({
        ...prev,
        [activeThread]: [...(prev[activeThread] || []), reply]
      }));
      setIsTyping(false);
    }, delay);
  };

  const handleSendVoiceNote = () => {
    setIsRecording(false);
    
    // Choose a voice note message text based on a random index
    const mockTranscripts = [
      "I have been feeling chest pain and tightness since yesterday morning",
      "I missed my Metformin dose this evening, is it okay to take it now?",
      "I have a persistent headache and feeling slightly dizzy",
      "Experiencing slight fever and stomach nausea after taking my pills"
    ];
    const transcript = mockTranscripts[Math.floor(Math.random() * mockTranscripts.length)];
    const duration = `0:${recordingSeconds < 10 ? "0" + recordingSeconds : recordingSeconds}`;
    
    const msgId = `audio_${Date.now()}`;
    const userMessage = {
      id: msgId,
      role: "user",
      type: "audio",
      duration,
      transcript,
      timestamp: new Date()
    };
    
    setThreadHistory(prev => ({
      ...prev,
      [activeThread]: [...(prev[activeThread] || []), userMessage]
    }));
    setIsTyping(true);

    // Trigger AI Insight extraction on the voice transcript
    setTimeout(() => {
      extractInsight(transcript);
    }, 400);

    // AI/Clinician response
    const delay = 1000 + Math.random() * 800;
    setTimeout(() => {
      let replyContent = "";
      if (activeThread === "ai") {
        replyContent = generateAIReply(transcript);
      } else {
        replyContent = generateClinicianReply(transcript, coPilotEnabled);
      }

      const reply = { role: "assistant", content: replyContent, timestamp: new Date() };
      setThreadHistory(prev => ({
        ...prev,
        [activeThread]: [...(prev[activeThread] || []), reply]
      }));
      setIsTyping(false);
    }, delay);
  };

  const toggleAudioPlayback = (msgId) => {
    if (playingAudioId === msgId) {
      setPlayingAudioId(null);
    } else {
      setPlayingAudioId(msgId);
      // Simulate playback finishing after 3.5 seconds
      setTimeout(() => {
        setPlayingAudioId(prev => prev === msgId ? null : prev);
      }, 3500);
    }
  };

  const clearChat = () => {
    setThreadHistory(prev => ({
      ...prev,
      [activeThread]: activeThread === "ai" ? INITIAL_AI_CHAT : activeThread === "doc_001" ? INITIAL_DOC_CHAT : INITIAL_HOSP_CHAT
    }));
    toast.success("Conversation history cleared.");
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString("en-NG", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Pre-configured suggestions based on active thread
  const getSuggestions = () => {
    if (activeThread === "ai") {
      return [
        "My blood pressure is high today",
        "I feel feverish and unwell",
        "I missed my Metformin dose",
        "I have a persistent headache"
      ];
    }
    if (activeThread === "doc_001") {
      return [
        "I'm checking my BP logs now",
        "Experiencing slight dizziness",
        "Need advice on sodium intake"
      ];
    }
    return [
      "Confirming follow-up appointment",
      "Need refilling on my drugs",
      "How can I download lab records?"
    ];
  };

  const handleSelectThread = (threadId) => {
    setActiveThread(threadId);
    setMobileView("chat");
  };

  // Define Thread details
  const threads = [
    { id: "ai", type: "ai", name: "AI Co-Pilot Health Assistant", subtitle: "Clinical AI Agent", status: "Active Now", online: true },
    { id: "doc_001", type: "doctor", name: "Dr. Adewale Yusuf", subtitle: "Cardiologist", status: "Online", online: true },
    { id: "hosp_luth", type: "facility", name: "LUTH teaching hospital", subtitle: "Lagos University Hospital", status: "Active 10m ago", online: false },
    { id: "hosp_reddington", type: "facility", name: "Reddington Hospital", subtitle: "Private Healthcare facility", status: "Online", online: true }
  ];

  const filteredThreads = threads.filter(t => 
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    t.subtitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentThreadInfo = threads.find(t => t.id === activeThread) || threads[0];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-12 gap-6 h-[calc(100vh-140px)] md:h-[calc(100vh-76px-4.5rem)] min-h-[500px] md:min-h-[600px] overflow-hidden text-foreground">
      
      {/* ── Left Pane: Active Chat Threads ── */}
      <div className={`md:col-span-1 lg:col-span-3 bg-card border border-border rounded-3xl p-4 flex-col h-full overflow-hidden shadow-sm ${
        mobileView === "threads" ? "flex" : "hidden md:flex"
      }`}>
        <div className="pb-3 border-b border-border/80 space-y-3 shrink-0">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-lg" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Care Channels</h3>
            <span className="text-[10px] font-black tracking-wider uppercase bg-primary/10 text-primary px-2.5 py-0.5 rounded-full border border-primary/25">Connect</span>
          </div>
          <input
            type="text"
            placeholder="Search channels & doctors..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3.5 py-2 bg-muted rounded-xl border border-border text-xs focus:outline-none focus:ring-1 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-muted-foreground/80"
          />
        </div>

        {/* Channels List */}
        <div className="flex-1 overflow-y-auto pt-3 space-y-1.5 scrollbar-thin">
          
          <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/80 pl-2 mb-1.5 block">AI Assistant</div>
          {filteredThreads.filter(t => t.type === "ai").map(t => (
            <button
              key={t.id}
              onClick={() => handleSelectThread(t.id)}
              className={`w-full flex items-start gap-3 p-3 rounded-2xl text-left transition-all duration-200 cursor-pointer ${
                activeThread === t.id
                  ? "bg-primary text-primary-foreground shadow-sm shadow-primary/10"
                  : "hover:bg-secondary border border-transparent hover:border-border/50"
              }`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${
                activeThread === t.id ? "bg-white/20 text-white" : "bg-primary/10 text-primary border border-primary/15"
              }`}>
                <Sparkles size={18} className={activeThread === t.id ? "" : "animate-pulse"} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline">
                  <p className="text-xs font-bold truncate leading-snug">{t.name}</p>
                </div>
                <p className={`text-[10px] truncate mt-0.5 ${activeThread === t.id ? "text-primary-foreground/80" : "text-muted-foreground"}`}>{t.subtitle}</p>
              </div>
            </button>
          ))}

          <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/80 pl-2 mt-4 mb-1.5 block">Clinicians (Doctors)</div>
          {filteredThreads.filter(t => t.type === "doctor").map(t => (
            <button
              key={t.id}
              onClick={() => handleSelectThread(t.id)}
              className={`w-full flex items-start gap-3 p-3 rounded-2xl text-left transition-all duration-200 cursor-pointer ${
                activeThread === t.id
                  ? "bg-primary text-primary-foreground shadow-sm shadow-primary/10"
                  : "hover:bg-secondary border border-transparent hover:border-border/50"
              }`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black shrink-0 shadow-sm text-sm relative ${
                activeThread === t.id ? "bg-white/20 text-white" : "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20"
              }`}>
                {t.name.split(" ").slice(1).map(n => n[0]).join("")}
                {t.online && (
                  <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-card" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline">
                  <p className="text-xs font-bold truncate leading-snug">{t.name}</p>
                </div>
                <p className={`text-[10px] truncate mt-0.5 ${activeThread === t.id ? "text-primary-foreground/80" : "text-muted-foreground"}`}>{t.subtitle}</p>
              </div>
            </button>
          ))}

          <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/80 pl-2 mt-4 mb-1.5 block">Connected Facilities</div>
          {filteredThreads.filter(t => t.type === "facility").map(t => (
            <button
              key={t.id}
              onClick={() => handleSelectThread(t.id)}
              className={`w-full flex items-start gap-3 p-3 rounded-2xl text-left transition-all duration-200 cursor-pointer ${
                activeThread === t.id
                  ? "bg-primary text-primary-foreground shadow-sm shadow-primary/10"
                  : "hover:bg-secondary border border-transparent hover:border-border/50"
              }`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${
                activeThread === t.id ? "bg-white/20 text-white" : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
              }`}>
                <Building2 size={16} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline">
                  <p className="text-xs font-bold truncate leading-snug">{t.name}</p>
                </div>
                <p className={`text-[10px] truncate mt-0.5 ${activeThread === t.id ? "text-primary-foreground/80" : "text-muted-foreground"}`}>{t.subtitle}</p>
              </div>
            </button>
          ))}

        </div>
      </div>

      {/* ── Center Pane: Chat Box ── */}
      <div className={`md:col-span-2 lg:col-span-6 bg-card border border-border rounded-3xl p-5 flex-col h-full overflow-hidden shadow-sm ${
        mobileView === "chat" ? "flex" : "hidden md:flex"
      }`}>
        
        {/* Chat header */}
        <div className="flex items-center justify-between pb-4 border-b border-border/80 shrink-0">
          <div className="flex items-center gap-2">
            {/* Mobile Back Button */}
            <button
              onClick={() => setMobileView("threads")}
              className="p-1.5 hover:bg-secondary border border-transparent hover:border-border rounded-xl md:hidden transition-colors cursor-pointer mr-0.5 text-muted-foreground hover:text-foreground"
            >
              <ChevronLeft size={20} />
            </button>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs ${
              currentThreadInfo.type === "ai" 
                ? "bg-primary/10 text-primary border border-primary/20" 
                : currentThreadInfo.type === "doctor" 
                  ? "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/25" 
                  : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25"
            }`}>
              {currentThreadInfo.type === "ai" ? <Sparkles size={16} /> : currentThreadInfo.type === "doctor" ? currentThreadInfo.name.split(" ").slice(1).map(n => n[0]).join("") : <Building2 size={16} />}
            </div>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base text-foreground leading-snug">{currentThreadInfo.name}</h3>
              <p className="text-[10px] text-muted-foreground mt-0.5 flex items-center gap-1.5">
                {currentThreadInfo.online && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse" />}
                {currentThreadInfo.status}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 relative">
            {/* Mobile Insights Toggle Indicator */}
            <button
              onClick={() => setMobileView("insights")}
              className="relative p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-xl md:hidden transition-colors cursor-pointer mr-0.5"
              title="View Insights"
            >
              <Sparkles size={16} className={pendingInsights.length > 0 ? "text-primary animate-pulse" : ""} />
              {pendingInsights.length > 0 && (
                <span className="absolute top-0.5 right-0.5 min-w-4 h-4 bg-primary text-primary-foreground text-[8px] font-black rounded-full flex items-center justify-center px-1 shadow border border-card animate-bounce">
                  {pendingInsights.length}
                </span>
              )}
            </button>

            {/* Co-Pilot Toggle Switch (Desktop only, mobile moves it inside 3-dot) */}
            {currentThreadInfo.type !== "ai" && (
              <div className="hidden sm:flex items-center gap-2 bg-muted/65 border border-border px-3 py-1.5 rounded-full shadow-inner select-none transition-all hover:bg-muted duration-200">
                <span className="text-[9px] font-black uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                  <Sparkles size={10} className={coPilotEnabled ? "text-primary animate-pulse" : ""} />
                  Co-Pilot Assist
                </span>
                <button
                  type="button"
                  onClick={handleToggleCoPilot}
                  className={`relative inline-flex h-4.5 w-8.5 shrink-0 cursor-pointer rounded-full border border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    coPilotEnabled ? "bg-primary" : "bg-muted-foreground/30"
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-3.5 w-3.5 transform rounded-full bg-background shadow-lg ring-0 transition duration-200 ease-in-out ${
                      coPilotEnabled ? "translate-x-4" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            )}

            {/* 3-Dot Action Header Menu */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className={`p-2 rounded-xl transition-colors cursor-pointer text-muted-foreground hover:text-foreground hover:bg-secondary ${
                menuOpen ? "bg-secondary text-foreground" : ""
              }`}
            >
              <MoreVertical size={16} />
            </button>

            {menuOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                <div className="absolute right-0 top-11 bg-card border border-border rounded-2xl p-2 w-52 shadow-xl z-20 animate-fadeIn">
                  
                  {/* Co-Pilot Switch inside mobile dropdown menu */}
                  {currentThreadInfo.type !== "ai" && (
                    <div className="flex items-center justify-between px-3 py-2 border-b border-border/80 text-xs select-none sm:hidden">
                      <span className="font-bold text-muted-foreground">Co-Pilot Assist</span>
                      <button
                        type="button"
                        onClick={() => {
                          handleToggleCoPilot();
                          setMenuOpen(false);
                        }}
                        className={`relative inline-flex h-4.5 w-8.5 shrink-0 cursor-pointer rounded-full border border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                          coPilotEnabled ? "bg-primary" : "bg-muted-foreground/30"
                        }`}
                      >
                        <span className={`pointer-events-none inline-block h-3.5 w-3.5 transform rounded-full bg-background shadow-md transition duration-200 ${
                          coPilotEnabled ? "translate-x-4" : "translate-x-0"
                        }`} />
                      </button>
                    </div>
                  )}

                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      clearChat();
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 hover:bg-secondary hover:text-primary rounded-xl text-left text-xs font-bold transition-all text-foreground cursor-pointer"
                  >
                    <Trash2 size={13} className="text-muted-foreground" /> Clear Conversation
                  </button>

                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      toast.success("Transcript exported successfully!", {
                        description: `Transcripts for ${currentThreadInfo.name} saved as PDF.`,
                        icon: "📄"
                      });
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 hover:bg-secondary hover:text-primary rounded-xl text-left text-xs font-bold transition-all text-foreground cursor-pointer"
                  >
                    <FileText size={13} className="text-muted-foreground" /> Export Transcript
                  </button>

                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      toast.info("AI Analysis Summary", {
                        description: `Clinical assessment for ${currentThreadInfo.name}: Patient conditions are well-managed and logs demonstrate stable parameters.`,
                        icon: "📊"
                      });
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 hover:bg-secondary hover:text-primary rounded-xl text-left text-xs font-bold transition-all text-foreground cursor-pointer"
                  >
                    <Sparkles size={13} className="text-muted-foreground" /> Co-Pilot Analytics
                  </button>

                </div>
              </>
            )}

          </div>
        </div>

        {/* Message bubble pane */}
        <div className="flex-1 overflow-y-auto py-5 space-y-4 scrollbar-thin">
          
          {activeMessages.map((msg, idx) => (
            <div
              key={msg.id || idx}
              className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
            >
              <div className={`w-8 h-8 rounded-xl shrink-0 flex items-center justify-center text-xs font-bold mt-0.5 ${
                msg.role === "user"
                  ? "bg-primary/10 text-primary border border-primary/20"
                  : "bg-muted border border-border text-muted-foreground shadow-sm"
              }`}>
                {msg.role === "user" ? <User size={13} /> : currentThreadInfo.type === "ai" ? <Bot size={13} /> : <User size={13} />}
              </div>

              <div className={`max-w-[78%] ${msg.role === "user" ? "items-end" : "items-start"} flex flex-col gap-1`}>
                
                {/* Render Audio Player Bubble if msg.type is audio */}
                {msg.type === "audio" ? (
                  <div className={`px-4 py-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-sm w-64 ${
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground rounded-tr-sm"
                      : "bg-card border border-border text-foreground rounded-tl-sm"
                  }`}>
                    {/* Audio Player Controls */}
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => toggleAudioPlayback(msg.id)}
                        className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 cursor-pointer ${
                          msg.role === "user" ? "bg-white/20 text-white hover:bg-white/30" : "bg-primary/10 text-primary hover:bg-primary/15"
                        }`}
                      >
                        {playingAudioId === msg.id ? <Pause size={14} /> : <Play size={14} className="ml-0.5" />}
                      </button>
                      
                      {/* Waveform Visualizer */}
                      <div className="flex-1 flex items-end gap-0.5 h-6">
                        {[40, 60, 30, 80, 50, 70, 45, 90, 35, 60, 55, 75, 40, 85, 50].map((h, i) => (
                          <span
                            key={i}
                            className={`w-0.5 rounded-full transition-all duration-300 ${
                              playingAudioId === msg.id ? "animate-pulse" : ""
                            } ${
                              msg.role === "user"
                                ? playingAudioId === msg.id ? "bg-white" : "bg-white/50"
                                : playingAudioId === msg.id ? "bg-primary" : "bg-primary/40"
                            }`}
                            style={{ height: `${h}%`, animationDelay: `${i * 60}ms` }}
                          />
                        ))}
                      </div>
                      
                      <span className={`text-[10px] shrink-0 font-mono ${msg.role === "user" ? "text-white/80" : "text-muted-foreground"}`}>
                        {msg.duration || "0:14"}
                      </span>
                    </div>
                    
                    {/* Transcript divider & box */}
                    {msg.transcript && (
                      <div className={`mt-3 pt-2.5 border-t border-dashed text-[10px] leading-relaxed ${
                        msg.role === "user" ? "border-white/25 text-white/90" : "border-border text-muted-foreground/90"
                      }`}>
                        <div className="font-bold flex items-center gap-1 mb-1">
                          <Volume2 size={10} /> AI Transcribed:
                        </div>
                        <p className="italic font-medium">"{msg.transcript}"</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className={`px-4 py-3 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground rounded-tr-sm shadow-sm"
                      : "bg-card border border-border text-foreground rounded-tl-sm shadow-sm shadow-border/10"
                  }`}>
                    {msg.content.split("\n").map((line, i) => (
                      <span key={i}>
                        {line}
                        {i < msg.content.split("\n").length - 1 && <br />}
                      </span>
                    ))}
                  </div>
                )}

                <span className="text-[9px] text-muted-foreground px-1">
                  {formatTime(msg.timestamp)}
                </span>
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex gap-3 flex-row animate-fadeIn">
              <div className="w-8 h-8 rounded-xl shrink-0 flex items-center justify-center bg-muted border border-border text-muted-foreground mt-0.5 shadow-sm">
                {currentThreadInfo.type === "ai" ? <Bot size={13} /> : <User size={13} />}
              </div>
              <div className="bg-card border border-border px-4 py-3 rounded-2xl rounded-tl-sm shadow-sm flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/60 animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/60 animate-bounce" style={{ animationDelay: "160ms" }} />
                <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/60 animate-bounce" style={{ animationDelay: "320ms" }} />
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Suggestions chips */}
        {!isTyping && activeMessages.length === 1 && (
          <div className="py-2 shrink-0 border-t border-border/50">
            <div className="flex flex-wrap gap-1.5 pt-1">
              {getSuggestions().map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => handleSendMessage(suggestion)}
                  className="text-[11px] font-bold bg-secondary text-primary hover:bg-primary hover:text-primary-foreground px-3 py-1.5 rounded-full border border-primary/10 transition-all cursor-pointer hover:scale-[1.01]"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Message Input composer */}
        <div className="pt-3 border-t border-border/80 shrink-0">
          <form
            onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
            className="flex items-center gap-3 bg-muted/50 border border-border/80 focus-within:border-primary/45 rounded-2xl px-4 py-2.5 transition-all shadow-inner"
          >
            {/* Mic / Audio Record Trigger */}
            <button
              type="button"
              onClick={() => setIsRecording(true)}
              disabled={isTyping}
              className="w-8 h-8 rounded-xl flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all cursor-pointer shrink-0"
              title="Record Voice Note"
            >
              <Mic size={15} />
            </button>

            <input
              ref={inputRef}
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              disabled={isTyping}
              placeholder={currentThreadInfo.type === "ai" ? "Ask AI Co-Pilot a wellness question..." : `Message ${currentThreadInfo.name}...`}
              className="flex-1 bg-transparent text-xs sm:text-sm text-foreground placeholder:text-muted-foreground/75 focus:outline-none"
            />
            <button
              type="submit"
              disabled={!inputText.trim() || isTyping}
              className="w-9 h-9 bg-primary text-primary-foreground rounded-xl flex items-center justify-center hover:bg-primary/95 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shrink-0 shadow-sm"
            >
              <Send size={13} />
            </button>
          </form>
          <p className="text-[9px] text-muted-foreground/80 text-center mt-2 pr-2">
            BetaCare AI Co-Pilot monitors clinical discussions. Logged inputs synchronize to your clinical profile.
          </p>
        </div>

      </div>

      {/* ── Right Pane: AI Co-Pilot Health Insights Summary ── */}
      <div className={`md:col-span-1 lg:col-span-3 bg-card border border-border rounded-3xl p-4 flex-col h-full overflow-hidden shadow-sm ${
        mobileView === "insights" ? "flex" : "hidden md:flex"
      }`}>
        
        <div className="pb-3 border-b border-border/80 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            {/* Mobile Back to Chat Button */}
            <button
              onClick={() => setMobileView("chat")}
              className="p-1.5 hover:bg-secondary border border-transparent hover:border-border rounded-xl md:hidden transition-colors cursor-pointer text-muted-foreground hover:text-foreground"
            >
              <ChevronLeft size={18} />
            </button>
            <h3 className="font-extrabold text-sm sm:text-base flex items-center gap-1.5" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              <Sparkles size={16} className="text-primary animate-pulse" />
              AI Health Insights
            </h3>
          </div>
          <span className="text-[9px] font-bold bg-primary/10 text-primary px-2 py-0.5 rounded border border-primary/20">Active</span>
        </div>

        {/* Insights list panel */}
        <div className="flex-1 overflow-y-auto pt-4 space-y-4 scrollbar-thin">
          
          <div className="bg-gradient-to-r from-primary/[0.03] to-cyan-500/[0.03] border border-primary/10 p-3 rounded-2xl text-[10px] sm:text-xs text-muted-foreground/85 leading-relaxed">
            AI runs in the background analyzing your symptoms and medications. Approved entries automatically save to your EHR record.
          </div>

          <div className="space-y-3 pt-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/80 pl-1 block mb-1">Extracted Insights</span>
            
            {pendingInsights.length > 0 ? (
              pendingInsights.map((insight) => (
                <div
                  key={insight.id}
                  className="bg-card border border-border/80 p-3.5 rounded-2xl relative overflow-hidden hover:border-primary/20 hover:shadow-md transition-all duration-200 space-y-3"
                >
                  {/* Glowing side color band */}
                  <div className={`absolute top-0 left-0 w-1 h-full ${insight.type === "condition" ? "bg-amber-500" : "bg-purple-500"}`} />
                  
                  <div className="pl-1.5 space-y-1">
                    <div className="flex items-center gap-1.5">
                      <span className={`text-[8px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-full ${
                        insight.type === "condition" 
                          ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20" 
                          : "bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20"
                      }`}>
                        {insight.type}
                      </span>
                      <span className="text-[8px] font-semibold text-muted-foreground">Extracted Just Now</span>
                    </div>
                    
                    {editingInsightId === insight.id ? (
                      <div className="pt-1.5 flex items-center gap-1.5">
                        <input
                          type="text"
                          value={editingValue}
                          onChange={(e) => setEditingValue(e.target.value)}
                          className="bg-muted px-2 py-1 border border-border rounded-lg text-xs flex-1 text-foreground focus:outline-none focus:ring-1 focus:ring-primary/20"
                        />
                        <button
                          onClick={() => saveEdit(insight.id)}
                          className="p-1 text-emerald-500 hover:bg-emerald-500/10 rounded-md transition-colors"
                        >
                          <Check size={12} />
                        </button>
                      </div>
                    ) : (
                      <p className="text-xs font-bold text-foreground leading-snug break-words pt-1">{insight.value}</p>
                    )}
                  </div>

                  <div className="flex gap-1.5 justify-end pl-1.5 shrink-0">
                    {editingInsightId !== insight.id && (
                      <button
                        type="button"
                        onClick={() => startEdit(insight)}
                        className="px-2 py-1 text-[10px] font-bold border border-border hover:bg-muted text-muted-foreground rounded-lg transition-colors cursor-pointer"
                      >
                        <Pencil size={10} className="inline mr-1" /> Edit
                      </button>
                    )}
                    
                    <button
                      type="button"
                      onClick={() => handleApproveInsight(insight)}
                      className="px-2.5 py-1 text-[10px] font-black bg-primary text-primary-foreground hover:bg-primary/95 rounded-lg shadow-sm transition-colors cursor-pointer"
                    >
                      <CheckCircle2 size={10} className="inline mr-1" /> Approve & Log
                    </button>
                    <button
                      type="button"
                      onClick={() => setPendingInsights(prev => prev.filter(p => p.id !== insight.id))}
                      className="p-1 hover:bg-destructive/10 text-destructive/70 hover:text-destructive rounded-lg transition-colors cursor-pointer"
                      title="Dismiss"
                    >
                      <X size={10} />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-muted/30 border border-dashed border-border/80 p-8 rounded-2xl text-center space-y-3 text-muted-foreground/60">
                <div className="w-10 h-10 bg-muted border border-border rounded-full flex items-center justify-center mx-auto text-muted-foreground/60 shadow-inner">
                  <Info size={18} />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-foreground">Listening for updates</p>
                  <p className="text-[10px] text-muted-foreground mt-1 leading-relaxed">
                    AI Co-Pilot is listening. Chat about any health symptoms, issues, or drugs to populate log summaries.
                  </p>
                </div>
              </div>
            )}

          </div>

        </div>

      </div>

      {/* ── Voice recording simulation overlay modal ── */}
      {isRecording && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-md flex items-center justify-center z-50 animate-fadeIn p-4">
          <div className="bg-card border border-border p-8 rounded-3xl max-w-sm w-full text-center space-y-6 shadow-2xl relative overflow-hidden">
            {/* Glowing gradient back accent */}
            <div className="absolute inset-0 bg-gradient-to-b from-primary/[0.03] to-transparent pointer-events-none" />
            
            <div className="space-y-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-primary">BetaCare AI Voice Check-in</span>
              <h3 className="text-lg font-extrabold text-foreground">Listening to Wellness Voice Log</h3>
              <p className="text-xs text-muted-foreground">Describe how you are feeling, your symptoms, or meds logs.</p>
            </div>

            {/* Pulsing microphone block */}
            <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
              <span className="absolute inset-0 rounded-full bg-primary/10 animate-ping animate-duration-1000" />
              <span className="absolute inset-2 rounded-full bg-primary/20 animate-pulse" />
              <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center shadow-lg shadow-primary/25 z-10">
                <Mic size={24} className="animate-pulse" />
              </div>
            </div>

            {/* Visualizer bars */}
            <div className="flex items-center justify-center gap-1 h-6">
              {[4, 8, 3, 7, 5, 9, 4, 8, 3, 6].map((h, i) => (
                <span
                  key={i}
                  className="w-1 bg-primary/70 rounded-full animate-bounce"
                  style={{ height: `${h * 2.5}px`, animationDelay: `${i * 120}ms` }}
                />
              ))}
            </div>

            <div className="space-y-1">
              <span className="text-2xl font-mono font-black text-foreground">
                0:{recordingSeconds < 10 ? "0" + recordingSeconds : recordingSeconds}
              </span>
              <p className="text-[10px] text-muted-foreground">Pulsing audio logs locked & encrypted</p>
            </div>

            <div className="flex gap-3 justify-center pt-2">
              <button
                type="button"
                onClick={() => setIsRecording(false)}
                className="px-5 py-2.5 border border-border hover:bg-muted text-muted-foreground rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSendVoiceNote}
                className="px-6 py-2.5 bg-primary text-primary-foreground hover:bg-primary/95 rounded-xl text-xs font-black shadow-md transition-all cursor-pointer hover:scale-[1.02]"
              >
                Stop &amp; Send Log
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
