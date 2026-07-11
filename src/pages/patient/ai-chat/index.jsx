import { useState, useEffect, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router";
import { Bot, User, Send, Trash2, Sparkles, ArrowLeft } from "lucide-react";
import { usePatient } from "../../../context/PatientContext";

// AI response engine — keyword-matched health replies
function generateAIReply(message) {
  const lower = message.toLowerCase();

  if (lower.includes("fever") || lower.includes("feverish") || lower.includes("temperature")) {
    return "A fever may indicate an infection or an inflammatory response. Monitor your temperature closely. Since you have Hypertension on record, avoid NSAIDs like Ibuprofen without consulting your doctor — they can raise blood pressure. If your temperature exceeds 39.5°C or persists beyond 48 hours, please seek emergency care or contact your clinician.";
  }
  if (lower.includes("nausea") || lower.includes("vomit") || lower.includes("stomach")) {
    return "Nausea can be triggered by many factors — medication side effects, dietary issues, or minor infections. Sip small amounts of water frequently to stay hydrated. Try to avoid heavy or oily meals. If nausea is persistent, paired with vomiting for more than 12 hours, or accompanied by severe abdominal pain, please consult a physician promptly.";
  }
  if (lower.includes("headache") || lower.includes("migraine") || lower.includes("head pain")) {
    return "Headaches in hypertensive patients can sometimes be a blood pressure warning sign. I recommend checking your BP now if you have a monitor at home. Your last recorded reading was stable (118/76 mmHg), but sudden or severe headaches — especially at the back of the head — should be evaluated by a doctor immediately. Rest, hydrate, and avoid bright screens if possible.";
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
  if (lower.includes("sleep") || lower.includes("insomnia") || lower.includes("tired") || lower.includes("fatigue")) {
    return "Poor sleep can significantly affect blood pressure regulation and metabolic health. I recommend maintaining a consistent sleep schedule (same bedtime/wake time), avoiding screens 1 hour before bed, and limiting caffeine after 2 PM. If fatigue is persistent and unexplained, it may be worth checking for anaemia or thyroid dysfunction during your next lab visit.";
  }
  if (lower.includes("exercise") || lower.includes("workout") || lower.includes("gym") || lower.includes("walk")) {
    return "Regular exercise is one of the best lifestyle interventions for both hypertension and blood sugar control. Aim for at least 150 minutes of moderate aerobic activity per week (e.g., brisk walking, cycling). Avoid intense, sudden bursts of high-intensity exercise without warm-up — this can transiently spike blood pressure. Always check your BP before and after workouts when starting a new routine.";
  }
  if (lower.includes("diet") || lower.includes("food") || lower.includes("eat") || lower.includes("nutrition")) {
    return "For your conditions, I recommend: the DASH diet (Dietary Approaches to Stop Hypertension) which emphasizes fruits, vegetables, low-fat dairy, and lean proteins. Reduce sodium intake, processed foods, and simple carbohydrates. Increase potassium-rich foods (bananas, sweet potatoes, spinach) as they naturally help lower blood pressure. Avoid skipping meals to keep blood sugar stable.";
  }
  if (lower.includes("chest") || lower.includes("pain") || lower.includes("breathe") || lower.includes("breathing")) {
    return "⚠️ **Important**: Chest pain, tightness, or difficulty breathing are potential cardiac warning signs — especially given your hypertension history. **Please call emergency services (112 in Nigeria) immediately or go to the nearest emergency room.** Do not drive yourself. While waiting for help, sit or lie down in a comfortable position and do not eat or drink anything. I'm an AI and cannot diagnose, but please treat this as an emergency.";
  }
  if (lower.includes("allerg") || lower.includes("penicillin") || lower.includes("peanut")) {
    return "Your health profile flags two allergies: **Penicillin** and **Peanuts**. Always inform any clinician or pharmacist about these before receiving any antibiotic or medication. Penicillin-class antibiotics include Amoxicillin, Ampicillin, and others — request non-penicillin alternatives when treating infections. For peanut allergy, always read food labels carefully and carry an antihistamine if prescribed by your doctor.";
  }

  return "Thank you for reaching out! As your BetaCare AI assistant, I can provide health guidance based on your medical profile. For best results, describe your specific symptom or question (e.g., 'I have a headache', 'I missed my Metformin dose', or 'my blood pressure reading is high'). Remember, I'm here to assist and inform — for urgent or emergency situations, always contact a healthcare professional or emergency services directly.";
}

const INITIAL_MESSAGE = {
  role: "assistant",
  content: "👋 Hello! I'm your BetaCare AI Health Assistant. I can help you with health queries, medication questions, symptom guidance, and general wellness advice based on your medical profile.\n\nWhat would you like to discuss today?",
  timestamp: new Date(),
};

const QUICK_SUGGESTIONS = [
  "My blood pressure is high today",
  "I feel feverish and unwell",
  "I missed my Metformin dose",
  "I have a persistent headache",
  "Tips for better blood sugar control",
  "Advice on my diet and exercise",
];

export default function PatientAIChat() {
  const { patient } = usePatient();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  const [messages, setMessages] = useState(() => {
    const saved = sessionStorage.getItem("betacare_chat_history");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.map((m) => ({ ...m, timestamp: new Date(m.timestamp) }));
      } catch (e) {
        console.warn("Failed to load chat history", e);
      }
    }
    return [INITIAL_MESSAGE];
  });
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [hasSentInitial, setHasSentInitial] = useState(false);

  const getFirstName = () => {
    if (patient?.full_name) return patient.full_name.split(" ")[0];
    return "there";
  };

  // Sync messages to sessionStorage
  useEffect(() => {
    sessionStorage.setItem("betacare_chat_history", JSON.stringify(messages));
  }, [messages]);

  // Auto-send if message is in the URL query param
  useEffect(() => {
    const presetMessage = searchParams.get("message");
    if (presetMessage && !hasSentInitial) {
      setHasSentInitial(true);
      // Slight delay so page renders before the message is sent
      setTimeout(() => {
        sendMessage(decodeURIComponent(presetMessage));
        // Clear search params so refreshing doesn't send it again
        navigate("/patient/ai-chat", { replace: true });
      }, 400);
    }
  }, [searchParams, hasSentInitial, navigate]);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const sendMessage = (text) => {
    const content = text || inputText.trim();
    if (!content) return;

    const userMessage = { role: "user", content, timestamp: new Date() };
    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setIsTyping(true);

    // Simulate AI thinking delay
    const delay = 800 + Math.random() * 800;
    setTimeout(() => {
      const reply = generateAIReply(content);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: reply, timestamp: new Date() },
      ]);
      setIsTyping(false);
    }, delay);
  };

  const clearChat = () => {
    setMessages([INITIAL_MESSAGE]);
    sessionStorage.removeItem("betacare_chat_history");
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString("en-NG", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-76px-4rem)] max-h-[800px] min-h-[500px]">

      {/* ── Chat Header ── */}
      <div className="flex items-center justify-between pb-4 border-b border-border mb-0 shrink-0">
        <div>
          <h1
            className="text-2xl font-extrabold text-foreground tracking-tight"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            AI Health Assistant
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
            BetaCare Clinical Agent · Active &amp; Monitoring
          </p>
        </div>
        <div className="flex items-center gap-2">
          {messages.length > 1 && (
            <button
              onClick={clearChat}
              title="Clear conversation"
              className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl transition-colors cursor-pointer"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
      </div>

      {/* ── Chat Message Area ── */}
      <div className="flex-1 overflow-y-auto py-6 space-y-4 scrollbar-thin">

        {/* Welcome card when fresh */}
        {messages.length === 1 && (
          <div className="mx-auto max-w-lg bg-primary/5 border border-primary/15 rounded-2xl p-5 text-center space-y-3 mb-2">
            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto">
              <Bot size={24} className="text-primary" />
            </div>
            <div>
              <p className="text-sm font-bold text-foreground">
                Hi {getFirstName()}! Ready to help
              </p>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                Ask me anything about your health, symptoms, medications, or lifestyle guidance based on your medical profile.
              </p>
            </div>
          </div>
        )}

        {/* Messages */}
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
          >
            {/* Avatar */}
            <div
              className={`w-8 h-8 rounded-xl shrink-0 flex items-center justify-center text-xs font-bold mt-0.5 ${
                msg.role === "user"
                  ? "bg-primary/15 text-primary"
                  : "bg-muted border border-border text-muted-foreground"
              }`}
            >
              {msg.role === "user" ? <User size={14} /> : <Bot size={14} />}
            </div>

            {/* Bubble */}
            <div className={`max-w-[75%] ${msg.role === "user" ? "items-end" : "items-start"} flex flex-col gap-1`}>
              <div
                className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-primary text-primary-foreground rounded-tr-sm"
                    : "bg-card border border-border text-foreground rounded-tl-sm shadow-sm"
                }`}
              >
                {msg.content.split("\n").map((line, i) => (
                  <span key={i}>
                    {line}
                    {i < msg.content.split("\n").length - 1 && <br />}
                  </span>
                ))}
              </div>
              <span className="text-[10px] text-muted-foreground px-1">
                {formatTime(msg.timestamp)}
              </span>
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex gap-3 flex-row">
            <div className="w-8 h-8 rounded-xl shrink-0 flex items-center justify-center bg-muted border border-border text-muted-foreground mt-0.5">
              <Bot size={14} />
            </div>
            <div className="bg-card border border-border px-4 py-3 rounded-2xl rounded-tl-sm shadow-sm flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-muted-foreground/60 animate-bounce" style={{ animationDelay: "0ms" }} />
              <span className="w-2 h-2 rounded-full bg-muted-foreground/60 animate-bounce" style={{ animationDelay: "160ms" }} />
              <span className="w-2 h-2 rounded-full bg-muted-foreground/60 animate-bounce" style={{ animationDelay: "320ms" }} />
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* ── Quick Suggestion Chips (only at start) ── */}
      {messages.length === 1 && !isTyping && (
        <div className="py-3 shrink-0">
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2 flex items-center gap-1.5">
            <Sparkles size={10} /> Suggested topics
          </p>
          <div className="flex flex-wrap gap-2">
            {QUICK_SUGGESTIONS.map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => sendMessage(suggestion)}
                className="text-xs font-semibold bg-secondary text-primary hover:bg-primary hover:text-primary-foreground px-3 py-1.5 rounded-full border border-primary/10 transition-all cursor-pointer"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Input Bar ── */}
      <div className="pt-3 border-t border-border shrink-0">
        <form
          onSubmit={(e) => { e.preventDefault(); sendMessage(); }}
          className="flex items-center gap-3 bg-card border border-border rounded-2xl px-4 py-3 focus-within:border-primary/40 transition-colors shadow-sm"
        >
          <input
            ref={inputRef}
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={isTyping}
            placeholder="Type your health question…"
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isTyping}
            className="w-9 h-9 bg-primary text-primary-foreground rounded-xl flex items-center justify-center hover:bg-primary/90 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shrink-0"
          >
            <Send size={14} />
          </button>
        </form>
        <p className="text-[10px] text-muted-foreground text-center mt-2">
          BetaCare AI provides health guidance only — not medical diagnosis. Consult a licensed physician for emergencies.
        </p>
      </div>
    </div>
  );
}
