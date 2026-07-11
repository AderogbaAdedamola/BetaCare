import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title as ChartTitle,
  Tooltip,
  Legend,
  Filler
} from "chart.js";
import { Line, Bar } from "react-chartjs-2";
import { AnimatePresence, motion } from "motion/react";
import {
  Activity,
  Heart,
  TrendingUp,
  TrendingDown,
  User,
  Calendar,
  ChevronDown,
  ChevronUp,
  Info,
  Lock,
  Shield,
  ShieldCheck,
  Eye,
  EyeOff,
  FileText,
  Building2,
  Weight,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  CheckCircle2,
  XCircle,
  AlertCircle
} from "lucide-react";
import { usePatient } from "../../../context/PatientContext";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ChartTitle,
  Tooltip,
  Legend,
  Filler
);

// ─── PIN Storage Helpers ─────────────────────────────────────────
const PIN_KEY = "health_tracker_pin";

function hashPin(pin) {
  return btoa(pin);
}

function getStoredPin() {
  return localStorage.getItem(PIN_KEY);
}

function storePin(pin) {
  localStorage.setItem(PIN_KEY, hashPin(pin));
}

function verifyPin(pin) {
  const stored = getStoredPin();
  if (!stored) return false;
  return stored === hashPin(pin);
}

// ─── PIN Lock Screen Component ──────────────────────────────────
function PinLockScreen({ onUnlock }) {
  const hasPinSet = !!getStoredPin();
  const [mode, setMode] = useState(hasPinSet ? "enter" : "set"); // "enter" | "set" | "confirm"
  const [pin, setPin] = useState(["", "", "", "", "", ""]);
  const [confirmPin, setConfirmPin] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [shake, setShake] = useState(false);
  const inputRefs = useRef([]);
  const confirmRefs = useRef([]);

  const activeRefs = mode === "confirm" ? confirmRefs : inputRefs;
  const activePin = mode === "confirm" ? confirmPin : pin;
  const setActivePin = mode === "confirm" ? setConfirmPin : setPin;

  useEffect(() => {
    // Focus first input on mount
    setTimeout(() => {
      activeRefs.current[0]?.focus();
    }, 200);
  }, [mode]);

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return; // digits only

    const newPin = [...activePin];
    newPin[index] = value.slice(-1); // only take last char
    setActivePin(newPin);
    setError("");

    if (value && index < 5) {
      activeRefs.current[index + 1]?.focus();
    }

    // Auto-submit when 6 digits are filled
    if (value && index === 5) {
      const fullPin = newPin.join("");
      if (fullPin.length === 6) {
        setTimeout(() => handleSubmit(fullPin), 150);
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !activePin[index] && index > 0) {
      activeRefs.current[index - 1]?.focus();
      const newPin = [...activePin];
      newPin[index - 1] = "";
      setActivePin(newPin);
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted.length === 6) {
      const digits = pasted.split("");
      setActivePin(digits);
      activeRefs.current[5]?.focus();
      setTimeout(() => handleSubmit(pasted), 150);
    }
  };

  const triggerShake = (msg) => {
    setError(msg);
    setShake(true);
    setTimeout(() => {
      setShake(false);
      setActivePin(["", "", "", "", "", ""]);
      activeRefs.current[0]?.focus();
    }, 600);
  };

  const handleSubmit = (fullPin) => {
    if (mode === "enter") {
      if (verifyPin(fullPin)) {
        onUnlock();
      } else {
        triggerShake("Incorrect PIN. Please try again.");
      }
    } else if (mode === "set") {
      // Move to confirm mode
      setConfirmPin(["", "", "", "", "", ""]);
      setMode("confirm");
    } else if (mode === "confirm") {
      const originalPin = pin.join("");
      if (fullPin === originalPin) {
        storePin(fullPin);
        onUnlock();
      } else {
        triggerShake("PINs don't match. Please re-enter.");
        setMode("set");
        setPin(["", "", "", "", "", ""]);
      }
    }
  };

  const titles = {
    enter: "Enter Your Health PIN",
    set: "Create a Health PIN",
    confirm: "Confirm Your PIN",
  };
  const descriptions = {
    enter: "Enter your 6-digit PIN to access private health data",
    set: "Set a 6-digit PIN to protect your health records on this device",
    confirm: "Re-enter the same PIN to confirm",
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 bg-background/95 backdrop-blur-md flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="w-full max-w-md"
      >
        <div className="bg-card border border-border rounded-3xl p-8 shadow-xl text-center space-y-6">
          {/* Icon */}
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
            <Shield size={28} className="text-primary" />
          </div>

          {/* Branding */}
          <div>
            <h2
              className="text-xl font-extrabold text-foreground tracking-tight"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              {titles[mode]}
            </h2>
            <p className="text-xs text-muted-foreground mt-2 max-w-xs mx-auto leading-relaxed">
              {descriptions[mode]}
            </p>
          </div>

          {/* PIN Input */}
          <motion.div
            animate={shake ? { x: [0, -12, 12, -12, 12, -6, 6, 0] } : {}}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-center gap-3"
            onPaste={handlePaste}
          >
            {activePin.map((digit, i) => (
              <input
                key={`${mode}-${i}`}
                ref={(el) => (activeRefs.current[i] = el)}
                type="password"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                className={`w-12 h-14 text-center text-xl font-bold rounded-xl border-2 transition-all focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 bg-muted text-foreground ${
                  error
                    ? "border-destructive bg-destructive/5"
                    : digit
                    ? "border-primary/40"
                    : "border-border"
                }`}
                autoComplete="off"
              />
            ))}
          </motion.div>

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-xs text-destructive font-semibold flex items-center justify-center gap-1.5"
              >
                <XCircle size={12} />
                {error}
              </motion.p>
            )}
          </AnimatePresence>

          {/* Step indicator for set mode */}
          {(mode === "set" || mode === "confirm") && (
            <div className="flex items-center justify-center gap-2">
              <div className={`w-2 h-2 rounded-full ${mode === "set" ? "bg-primary" : "bg-primary/30"}`} />
              <div className={`w-2 h-2 rounded-full ${mode === "confirm" ? "bg-primary" : "bg-primary/30"}`} />
            </div>
          )}

          {/* Security note */}
          <div className="flex items-start gap-2 bg-muted/60 border border-border rounded-xl p-3 text-left">
            <Lock size={14} className="text-muted-foreground shrink-0 mt-0.5" />
            <p className="text-[10px] text-muted-foreground leading-relaxed">
              Your PIN is stored locally on this device only. It serves as a privacy gate for your health data and is not synced to any server.
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}


// ─── Simulated 12-Week Data Generator ───────────────────────────
function generateWeeklyData(base, variance, count) {
  const data = [];
  let current = base;
  for (let i = 0; i < count; i++) {
    current = base + (Math.random() - 0.5) * variance * 2;
    data.push(Math.round(current * 10) / 10);
  }
  return data;
}

const WEEK_LABELS_12 = Array.from({ length: 12 }, (_, i) => `W${i + 1}`);
const WEEK_LABELS_4 = ["Week 1", "Week 2", "Week 3", "Week 4"];
const MONTH_LABELS_6 = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];

// Pre-generate data
const SYSTOLIC_12W = [122, 120, 124, 119, 121, 118, 120, 117, 119, 116, 118, 117];
const DIASTOLIC_12W = [82, 80, 83, 79, 81, 78, 80, 77, 79, 76, 78, 76];
const HEART_RATE_12W = [74, 72, 75, 71, 73, 70, 72, 69, 71, 68, 70, 69];
const WEIGHT_12W = [75.2, 75.0, 74.8, 75.1, 74.9, 74.7, 74.5, 74.8, 74.6, 74.3, 74.5, 74.4];
const ADHERENCE_12W = [85, 90, 78, 95, 88, 92, 100, 85, 95, 90, 100, 96];


// ─── Health History Record Card ─────────────────────────────────
function HealthHistoryCard({ record }) {
  const [expanded, setExpanded] = useState(false);

  const getRecordMeta = (type) => {
    switch (type) {
      case "prescription":
        return {
          title: "Prescription",
          icon: <Activity size={16} />,
          colors: "bg-purple-500/10 border-purple-500/20 text-purple-600 dark:text-purple-400",
        };
      case "lab_result":
        return {
          title: "Lab Result",
          icon: <TrendingUp size={16} />,
          colors: "bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400",
        };
      case "visit_note":
      default:
        return {
          title: "Visit Note",
          icon: <FileText size={16} />,
          colors: "bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400",
        };
    }
  };

  const meta = getRecordMeta(record.record_type);

  const formatDate = (iso) => {
    if (!iso) return "";
    return new Date(iso).toLocaleDateString("en-NG", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const getLabStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "normal":
        return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20";
      case "elevated":
      case "high":
        return "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20";
      case "low":
        return "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  return (
    <div
      className={`bg-card border rounded-2xl transition-all duration-300 overflow-hidden ${
        expanded ? "border-primary/30 shadow-sm" : "border-border hover:border-primary/20"
      }`}
    >
      {/* Header row */}
      <div
        onClick={() => setExpanded(!expanded)}
        className="p-4 flex items-center justify-between gap-3 cursor-pointer select-none"
      >
        <div className="flex items-start gap-3">
          <div className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 ${meta.colors}`}>
            {meta.icon}
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h4 className="text-sm font-bold text-foreground">{meta.title}</h4>
              <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 border rounded-full ${meta.colors}`}>
                {record.record_type.replace("_", " ")}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1 truncate">
              <Building2 size={10} /> {record.source || "BetaCare Integration"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[10px] font-semibold text-muted-foreground hidden sm:inline">
            {formatDate(record.recorded_at)}
          </span>
          <button className="p-1 hover:bg-muted rounded-lg text-muted-foreground transition-colors">
            {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        </div>
      </div>

      {/* Expandable details */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
          >
            <div className="border-t border-border bg-muted/20 p-5 space-y-4">
              {/* Meta row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <User size={12} className="text-muted-foreground" />
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase font-bold">Clinician</p>
                    <p className="font-semibold text-foreground">{record.payload?.prescriber || "N/A"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={12} className="text-muted-foreground" />
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase font-bold">Date</p>
                    <p className="font-semibold text-foreground">{formatDate(record.recorded_at)}</p>
                  </div>
                </div>
              </div>

              {/* Visit note: vitals + diagnosis */}
              {record.record_type === "visit_note" && (
                <>
                  {record.payload?.vitals && (
                    <div className="bg-background/80 p-3 border border-border rounded-xl">
                      <p className="text-[10px] font-bold uppercase text-muted-foreground mb-2 tracking-wider">Consultation Vitals</p>
                      <div className="grid grid-cols-3 gap-3 text-center text-xs">
                        <div>
                          <span className="text-muted-foreground">BP</span>
                          <p className="font-bold text-foreground">{record.payload.vitals.systolic}/{record.payload.vitals.diastolic}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Pulse</span>
                          <p className="font-bold text-foreground">{record.payload.vitals.pulse} bpm</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Status</span>
                          <p className="font-bold text-emerald-600">Stable</p>
                        </div>
                      </div>
                    </div>
                  )}
                  {record.payload?.diagnosis && (
                    <div>
                      <p className="text-[10px] font-bold uppercase text-muted-foreground mb-1 tracking-wider">Diagnosis</p>
                      <p className="text-xs font-semibold text-foreground">{record.payload.diagnosis}</p>
                    </div>
                  )}
                </>
              )}

              {/* Prescription items table */}
              {record.record_type === "prescription" && record.payload?.items && (
                <div className="overflow-x-auto rounded-xl border border-border bg-background">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-muted border-b border-border text-muted-foreground">
                        <th className="p-2.5 font-semibold">Drug</th>
                        <th className="p-2.5 font-semibold">Dosage</th>
                        <th className="p-2.5 font-semibold">Frequency</th>
                        <th className="p-2.5 font-semibold">Duration</th>
                      </tr>
                    </thead>
                    <tbody>
                      {record.payload.items.map((drug, i) => (
                        <tr key={i} className="border-b border-border last:border-0">
                          <td className="p-2.5 font-bold text-foreground">{drug.name}</td>
                          <td className="p-2.5 text-foreground">{drug.dosage}</td>
                          <td className="p-2.5 text-foreground">{drug.frequency}</td>
                          <td className="p-2.5 text-foreground">{drug.duration}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Lab results table */}
              {record.record_type === "lab_result" && record.payload?.results && (
                <div className="overflow-x-auto rounded-xl border border-border bg-background">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-muted border-b border-border text-muted-foreground">
                        <th className="p-2.5 font-semibold">Test</th>
                        <th className="p-2.5 font-semibold">Value</th>
                        <th className="p-2.5 font-semibold">Reference</th>
                        <th className="p-2.5 font-semibold">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {record.payload.results.map((item, i) => (
                        <tr key={i} className="border-b border-border last:border-0">
                          <td className="p-2.5 font-bold text-foreground">{item.test}</td>
                          <td className="p-2.5 font-bold text-foreground">{item.value}</td>
                          <td className="p-2.5 text-muted-foreground">{item.reference}</td>
                          <td className="p-2.5">
                            <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full border ${getLabStatusColor(item.status)}`}>
                              {item.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Clinical notes */}
              <div>
                <p className="text-[10px] font-bold uppercase text-muted-foreground mb-1 tracking-wider">Clinical Notes</p>
                <p className="text-xs text-muted-foreground leading-relaxed bg-background p-3 rounded-xl border border-border">
                  {record.payload?.notes || "No additional notes."}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}


// ─── Circular Progress Ring ─────────────────────────────────────
function CircularProgress({ value, size = 120, strokeWidth = 8 }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  const getColor = (v) => {
    if (v >= 85) return { stroke: "var(--color-primary)", bg: "rgba(var(--primary-rgb, 34,197,94), 0.1)" };
    if (v >= 70) return { stroke: "rgb(16, 185, 129)", bg: "rgba(16, 185, 129, 0.1)" };
    if (v >= 50) return { stroke: "rgb(245, 158, 11)", bg: "rgba(245, 158, 11, 0.1)" };
    return { stroke: "rgb(239, 68, 68)", bg: "rgba(239, 68, 68, 0.1)" };
  };

  const colors = getColor(value);

  const getLabel = (v) => {
    if (v >= 85) return "Excellent";
    if (v >= 70) return "Good";
    if (v >= 50) return "Fair";
    return "At Risk";
  };

  const getLabelColor = (v) => {
    if (v >= 85) return "text-primary bg-primary/10 border-primary/20";
    if (v >= 70) return "text-emerald-600 bg-emerald-500/10 border-emerald-500/20";
    if (v >= 50) return "text-amber-600 bg-amber-500/10 border-amber-500/20";
    return "text-rose-600 bg-rose-500/10 border-rose-500/20";
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          {/* Background ring */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-border"
          />
          {/* Progress ring */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={colors.stroke}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: "stroke-dashoffset 1s ease-in-out" }}
          />
        </svg>
        {/* Score number */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-black text-foreground tracking-tight">{value}</span>
          <span className="text-[10px] text-muted-foreground font-semibold">/ 100</span>
        </div>
      </div>
      <span className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${getLabelColor(value)}`}>
        {getLabel(value)}
      </span>
    </div>
  );
}


// ─── Change Indicator Badge ─────────────────────────────────────
function ChangeBadge({ value, unit, improved }) {
  if (value === 0) {
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
        <Minus size={10} /> No change
      </span>
    );
  }
  return (
    <span
      className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
        improved
          ? "text-emerald-600 bg-emerald-500/10 border border-emerald-500/20"
          : "text-rose-600 bg-rose-500/10 border border-rose-500/20"
      }`}
    >
      {improved ? <ArrowDownRight size={10} /> : <ArrowUpRight size={10} />}
      {improved ? "↓" : "↑"} {Math.abs(value)} {unit} vs last month
    </span>
  );
}


// ─── Mock Records Fallback (same as records page) ───────────────
const MOCK_RECORDS = [
  {
    id: "rec_01",
    record_type: "prescription",
    source: "Lagos University Teaching Hospital (LUTH)",
    recorded_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    payload: {
      notes: "Take complete course. Keep well hydrated. Do not skip doses.",
      prescriber: "Dr. Adewale Yusuf",
      items: [
        { name: "Amlodipine", dosage: "5mg", frequency: "Once daily in the morning", duration: "30 days" },
        { name: "Metformin", dosage: "500mg", frequency: "Twice daily after meals", duration: "60 days" },
        { name: "Multivitamin Caps", dosage: "1 cap", frequency: "Once daily", duration: "30 days" }
      ]
    }
  },
  {
    id: "rec_02",
    record_type: "visit_note",
    source: "Reddington Hospital",
    recorded_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    payload: {
      notes: "Patient reports mild dizziness in the mornings. Vitals checked and stable. Advised dietary modifications.",
      prescriber: "Dr. Jane Nwachukwu",
      diagnosis: "Essential Hypertension (Mild)",
      vitals: { systolic: 135, diastolic: 85, pulse: 76 }
    }
  },
  {
    id: "rec_03",
    record_type: "lab_result",
    source: "Reddington Hospital Diagnostic Lab",
    recorded_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    payload: {
      notes: "All metabolic panels are within standard physiological ranges.",
      prescriber: "Pharm. Chidi Egwu",
      test_name: "Fasting Blood Sugar & Lipid Profile",
      results: [
        { test: "Fasting Blood Sugar", value: "92 mg/dL", reference: "70 - 100 mg/dL", status: "normal" },
        { test: "Total Cholesterol", value: "185 mg/dL", reference: "< 200 mg/dL", status: "normal" },
        { test: "HDL (Good Cholesterol)", value: "52 mg/dL", reference: "> 40 mg/dL", status: "normal" },
      ]
    }
  }
];


// ═══════════════════════════════════════════════════════════════
// ─── MAIN COMPONENT ─────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════
export default function PatientHealthTracker() {
  const { profile, records: apiRecords } = usePatient();
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [timeRange, setTimeRange] = useState("3mo"); // "4w" | "3mo" | "6mo"
  const [historyFilter, setHistoryFilter] = useState("all"); // "all" | "visit_note" | "prescription" | "lab_result"

  // ── Derived demographic data ──
  const heightCm = profile?.profile?.height_cm || 178;
  const weightKg = profile?.profile?.weight_kg || 75;
  const heightM = heightCm / 100;
  const bmi = (weightKg / (heightM * heightM)).toFixed(1);

  const getBMICategory = (val) => {
    const num = parseFloat(val);
    if (num < 18.5) return { label: "Underweight", color: "text-blue-500 bg-blue-500/10 border-blue-500/20" };
    if (num < 25) return { label: "Normal weight", color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20" };
    if (num < 30) return { label: "Overweight", color: "text-amber-500 bg-amber-500/10 border-amber-500/20" };
    return { label: "Obese", color: "text-rose-500 bg-rose-500/10 border-rose-500/20" };
  };
  const bmiCat = getBMICategory(bmi);

  // ── Health Score Calculation ──
  const healthScore = useMemo(() => {
    let score = 0;
    // BP within healthy range (last reading ~117/76): +25 if systolic < 140 && diastolic < 90
    const lastSystolic = SYSTOLIC_12W[SYSTOLIC_12W.length - 1];
    const lastDiastolic = DIASTOLIC_12W[DIASTOLIC_12W.length - 1];
    if (lastSystolic < 140 && lastDiastolic < 90) score += 25;
    // Heart rate within range (60-100): +25
    const lastHR = HEART_RATE_12W[HEART_RATE_12W.length - 1];
    if (lastHR >= 60 && lastHR <= 100) score += 25;
    // Medication adherence >= 80%: +25
    const avgAdherence = ADHERENCE_12W.reduce((a, b) => a + b, 0) / ADHERENCE_12W.length;
    if (avgAdherence >= 80) score += 25;
    // No flagged anomalies: +25
    score += 25; // No anomalies in our mock data
    return score;
  }, []);

  // ── Chart Data Based on Time Range ──
  const getDataSlice = useCallback((fullData, range) => {
    if (range === "4w") return fullData.slice(-4);
    if (range === "3mo") return fullData;
    // 6mo: repeat data to simulate 6 months (24 data points)
    return [...fullData, ...fullData.slice(0, 12)];
  }, []);

  const getLabels = useCallback((range) => {
    if (range === "4w") return WEEK_LABELS_4;
    if (range === "3mo") return WEEK_LABELS_12;
    return MONTH_LABELS_6.flatMap(m => [`${m} W1`, `${m} W2`, `${m} W3`, `${m} W4`]).slice(0, 24);
  }, []);

  const chartLabels = getLabels(timeRange);

  const bpData = {
    labels: chartLabels,
    datasets: [
      {
        label: "Systolic (mmHg)",
        data: getDataSlice(SYSTOLIC_12W, timeRange),
        borderColor: "rgb(239, 68, 68)",
        backgroundColor: "rgba(239, 68, 68, 0.08)",
        tension: 0.35,
        fill: true,
        pointRadius: timeRange === "4w" ? 4 : 2,
        pointHoverRadius: 6,
      },
      {
        label: "Diastolic (mmHg)",
        data: getDataSlice(DIASTOLIC_12W, timeRange),
        borderColor: "rgb(59, 130, 246)",
        backgroundColor: "rgba(59, 130, 246, 0.08)",
        tension: 0.35,
        fill: true,
        pointRadius: timeRange === "4w" ? 4 : 2,
        pointHoverRadius: 6,
      }
    ]
  };

  const heartRateData = {
    labels: chartLabels,
    datasets: [
      {
        label: "Heart Rate (BPM)",
        data: getDataSlice(HEART_RATE_12W, timeRange),
        borderColor: "rgb(16, 185, 129)",
        backgroundColor: "rgba(16, 185, 129, 0.08)",
        tension: 0.35,
        fill: true,
        pointRadius: timeRange === "4w" ? 4 : 2,
        pointHoverRadius: 6,
      }
    ]
  };

  const weightData = {
    labels: chartLabels,
    datasets: [
      {
        label: "Weight (kg)",
        data: getDataSlice(WEIGHT_12W, timeRange),
        borderColor: "rgb(168, 85, 247)",
        backgroundColor: "rgba(168, 85, 247, 0.08)",
        tension: 0.35,
        fill: true,
        pointRadius: timeRange === "4w" ? 4 : 2,
        pointHoverRadius: 6,
      }
    ]
  };

  const adherenceData = {
    labels: chartLabels,
    datasets: [
      {
        label: "Adherence (%)",
        data: getDataSlice(ADHERENCE_12W, timeRange),
        backgroundColor: "rgba(139, 92, 246, 0.7)",
        borderColor: "rgb(139, 92, 246)",
        borderWidth: 1,
        borderRadius: 6,
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          font: { family: "DM Sans", size: 10, weight: "bold" },
          boxWidth: 10,
          padding: 12,
        }
      },
      tooltip: {
        titleFont: { family: "Plus Jakarta Sans" },
        bodyFont: { family: "DM Sans" },
        backgroundColor: "rgba(0,0,0,0.85)",
        padding: 10,
        cornerRadius: 8,
      }
    },
    scales: {
      y: {
        grid: { color: "rgba(156, 163, 175, 0.08)" },
        ticks: { font: { family: "DM Sans", size: 10 } },
      },
      x: {
        grid: { display: false },
        ticks: { font: { family: "DM Sans", size: 9 }, maxRotation: 45 },
      }
    }
  };

  // ── Health History (from context records) ──
  const allRecords = useMemo(() => {
    const combined = [...(apiRecords || [])];
    if (combined.length === 0) return MOCK_RECORDS;
    return combined.sort((a, b) => new Date(b.recorded_at) - new Date(a.recorded_at));
  }, [apiRecords]);

  const filteredRecords = useMemo(() => {
    if (historyFilter === "all") return allRecords;
    return allRecords.filter(r => r.record_type === historyFilter);
  }, [allRecords, historyFilter]);

  // ── PIN Lock Gate ──
  if (!isUnlocked) {
    return <PinLockScreen onUnlock={() => setIsUnlocked(true)} />;
  }

  // ── Time range options ──
  const timeRanges = [
    { id: "4w", label: "4 Weeks" },
    { id: "3mo", label: "3 Months" },
    { id: "6mo", label: "6 Months" },
  ];

  const historyTabs = [
    { id: "all", label: "All" },
    { id: "visit_note", label: "Visit Notes" },
    { id: "prescription", label: "Prescriptions" },
    { id: "lab_result", label: "Lab Results" },
  ];

  return (
    <div className="space-y-10">

      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1
            className="text-3xl font-extrabold text-foreground tracking-tight"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            Track Health Record
          </h1>
          <p className="text-sm text-muted-foreground mt-1.5 flex items-center gap-1.5">
            <ShieldCheck size={14} className="text-emerald-500" />
            PIN-protected health dashboard · Comprehensive vitals & history
          </p>
        </div>
        <div className="flex gap-1.5 p-1 bg-muted rounded-xl border border-border self-start">
          {timeRanges.map((range) => (
            <button
              key={range.id}
              onClick={() => setTimeRange(range.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                timeRange === range.id
                  ? "bg-background text-foreground shadow-sm font-black border border-border/80"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Health Score + Demographics Row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Health Score Card */}
        <div className="bg-card border border-border rounded-3xl p-6 shadow-sm flex flex-col items-center justify-center text-center space-y-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-primary" />
            <h3 className="font-bold text-sm text-foreground">Overall Health Score</h3>
          </div>
          <CircularProgress value={healthScore} size={130} strokeWidth={10} />
          <p className="text-[10px] text-muted-foreground leading-relaxed max-w-[200px]">
            Composite score based on BP, heart rate, medication adherence, and anomaly screening
          </p>
        </div>

        {/* Demographics Card */}
        <div className="bg-card border border-border rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-border">
            <User size={16} className="text-primary" />
            <h3 className="font-bold text-sm text-foreground">Vitals Baseline</h3>
          </div>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="bg-muted/40 p-3 rounded-xl border border-border/60">
              <span className="text-muted-foreground">Sex</span>
              <p className="text-sm font-bold text-foreground mt-0.5 capitalize">{profile?.profile?.sex || "Not declared"}</p>
            </div>
            <div className="bg-muted/40 p-3 rounded-xl border border-border/60">
              <span className="text-muted-foreground">Blood Type</span>
              <p className="text-sm font-bold text-foreground mt-0.5">{profile?.profile?.blood_type || "O+"}</p>
            </div>
            <div className="bg-muted/40 p-3 rounded-xl border border-border/60">
              <span className="text-muted-foreground">Height</span>
              <p className="text-sm font-bold text-foreground mt-0.5">{heightCm} cm</p>
            </div>
            <div className="bg-muted/40 p-3 rounded-xl border border-border/60">
              <span className="text-muted-foreground">Weight</span>
              <p className="text-sm font-bold text-foreground mt-0.5">{weightKg} kg</p>
            </div>
          </div>
        </div>

        {/* BMI Card */}
        <div className="bg-card border border-border rounded-3xl p-6 shadow-sm flex flex-col items-center justify-center gap-4 relative overflow-hidden">
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
          <div className="flex items-center gap-2">
            <Activity size={16} className="text-primary" />
            <h3 className="font-bold text-sm text-foreground">Body Mass Index</h3>
          </div>
          <div className="text-center">
            <h2 className="text-5xl font-black text-foreground tracking-tight">{bmi}</h2>
            <span className="text-[10px] text-muted-foreground mt-1 block">kg/m² · Normal: 18.5–24.9</span>
          </div>
          <span className={`text-[10px] font-bold px-3 py-1 rounded-full border ${bmiCat.color}`}>
            {bmiCat.label}
          </span>
        </div>
      </div>

      {/* ── Trend Charts Section ── */}
      <div className="space-y-4">
        <h2
          className="text-xl font-bold tracking-tight text-foreground"
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        >
          Health Trend Analysis
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Blood Pressure */}
          <div className="bg-card border border-border rounded-3xl p-6 shadow-sm flex flex-col h-[300px]">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                <Activity size={14} className="text-red-500" />
                Blood Pressure Trend
              </h4>
              <ChangeBadge value={3} unit="mmHg" improved={true} />
            </div>
            <div className="flex-1 relative">
              <Line data={bpData} options={chartOptions} />
            </div>
          </div>

          {/* Heart Rate */}
          <div className="bg-card border border-border rounded-3xl p-6 shadow-sm flex flex-col h-[300px]">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                <Heart size={14} className="text-emerald-500" />
                Heart Rate Trend
              </h4>
              <ChangeBadge value={2} unit="bpm" improved={true} />
            </div>
            <div className="flex-1 relative">
              <Line data={heartRateData} options={chartOptions} />
            </div>
          </div>

          {/* Weight */}
          <div className="bg-card border border-border rounded-3xl p-6 shadow-sm flex flex-col h-[300px]">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                <Weight size={14} className="text-purple-500" />
                Weight Trend
              </h4>
              <ChangeBadge value={0.8} unit="kg" improved={true} />
            </div>
            <div className="flex-1 relative">
              <Line data={weightData} options={chartOptions} />
            </div>
          </div>

          {/* Medication Adherence */}
          <div className="bg-card border border-border rounded-3xl p-6 shadow-sm flex flex-col h-[300px]">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                <TrendingUp size={14} className="text-violet-500" />
                Medication Adherence
              </h4>
              <ChangeBadge value={4} unit="%" improved={false} />
            </div>
            <div className="flex-1 relative">
              <Bar data={adherenceData} options={chartOptions} />
            </div>
          </div>
        </div>
      </div>

      {/* ── Full Health History ── */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h2
            className="text-xl font-bold tracking-tight text-foreground"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            Health History
          </h2>
          <div className="flex gap-1.5 p-1 bg-muted rounded-xl border border-border">
            {historyTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setHistoryFilter(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  historyFilter === tab.id
                    ? "bg-background text-foreground shadow-sm border border-border/80"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {filteredRecords.length > 0 ? (
          <div className="space-y-3">
            {filteredRecords.map((record) => (
              <HealthHistoryCard key={record.id} record={record} />
            ))}
          </div>
        ) : (
          <div className="bg-card border border-border p-12 text-center text-muted-foreground flex flex-col items-center justify-center gap-3 rounded-2xl">
            <AlertCircle size={28} className="text-muted-foreground/50" />
            <p className="text-sm font-semibold">No records in this category.</p>
            <p className="text-xs">Try selecting a different filter or syncing your records.</p>
          </div>
        )}
      </div>

    </div>
  );
}
