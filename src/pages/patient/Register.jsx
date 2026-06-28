import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  Loader2, ArrowRight, CheckCircle2,
  Plus, X, Stethoscope,
} from "lucide-react";
import { AuthLayout } from "../../components/auth/AuthLayout";
import { MagneticButton } from "../../components/common/MagneticButton";
import { BetaCareLogo } from "../../components/common/BetaCareLogo";
import { api } from "../../lib/api";

// ── Left panel ───────────────────────────────────────────────────────────────
function RegisterSidePanel() {
  return (
    <div className="relative h-full min-h-screen w-full bg-foreground overflow-hidden">
      <img
        src="https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=900&q=80&fit=crop"
        alt=""
        className="absolute inset-0 w-full h-full object-cover opacity-25"
      />
      <div className="absolute inset-0 bg-gradient-to-br from-foreground/97 via-foreground/85 to-foreground/60" />

      <div className="relative flex flex-col h-full min-h-screen p-10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 flex items-center justify-center">{BetaCareLogo()}</div>
          <span
            className="font-bold text-lg text-card"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            Beta<span className="text-primary">Care</span>
          </span>
        </div>

        <div className="flex-1 flex items-center">
          <div>
            <h2
              className="text-3xl font-extrabold text-card leading-tight mb-4"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              Your health story,
              <br />
              <span className="text-primary">finally organised.</span>
            </h2>
            <p className="text-card/50 text-sm leading-relaxed mb-8 max-w-[270px]">
              Create once. Your records follow you — not the hospital.
            </p>
            <ul className="flex flex-col gap-3">
              {[
                "Free forever — no credit card needed",
                "Works on WhatsApp, SMS & web",
                "NDPR compliant & end-to-end encrypted",
                "AI health agent keeps you on track",
              ].map((p) => (
                <li key={p} className="flex items-center gap-3">
                  <CheckCircle2 size={14} className="text-primary shrink-0" />
                  <span className="text-card/60 text-sm">{p}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="bg-white/8 backdrop-blur-sm border border-white/10 rounded-2xl p-5">
          <p className="text-xl font-bold text-card mb-0.5">Secure by design.</p>
          <p className="text-xs text-card/40 leading-relaxed">
            Encrypted at rest and in transit. Your data belongs to you — always.
          </p>
        </div>
      </div>
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function TagInput({ tags, onAdd, onRemove, placeholder }) {
  const [input, setInput] = useState("");
  function add() {
    const val = input.trim();
    if (val && !tags.includes(val)) {
      onAdd(val);
      setInput("");
    }
  }
  return (
    <div>
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-2.5">
          {tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 px-2.5 py-1 bg-primary/10 text-primary text-xs rounded-full font-medium"
            >
              {tag}
              <button
                type="button"
                onClick={() => onRemove(tag)}
                className="hover:text-red-500 transition-colors ml-0.5"
              >
                <X size={10} />
              </button>
            </span>
          ))}
        </div>
      )}
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add();
            }
          }}
          placeholder={placeholder}
          className="flex-1 px-3 py-2.5 bg-muted rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all text-foreground placeholder:text-muted-foreground"
        />
        <button
          type="button"
          onClick={add}
          className="px-3 py-2.5 bg-primary/10 text-primary text-sm rounded-xl font-medium hover:bg-primary/20 transition-colors border border-primary/20"
        >
          Add
        </button>
      </div>
    </div>
  );
}

function PillSelect({ label, value, onChange, options }) {
  return (
    <div>
      {label && (
        <p className="text-sm font-medium text-foreground mb-2">{label}</p>
      )}
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
              value === opt.value
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-muted text-muted-foreground border-border hover:border-primary/40 hover:text-foreground"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function TriSelect({ label, value, onChange }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-border last:border-0">
      <span className="text-sm text-foreground">{label}</span>
      <div className="flex gap-1">
        {[
          { v: "yes", l: "Yes" },
          { v: "no", l: "No" },
          { v: "unknown", l: "?" },
        ].map(({ v, l }) => (
          <button
            key={v}
            type="button"
            onClick={() => onChange(v)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              value === v
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/70"
            }`}
          >
            {l}
          </button>
        ))}
      </div>
    </div>
  );
}

function ConditionToggle({ label, checked, onChange }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`flex items-center gap-2.5 px-3.5 py-3 rounded-xl border text-sm font-medium text-left transition-all w-full ${
        checked
          ? "bg-primary/10 border-primary/40 text-primary"
          : "bg-muted border-border text-muted-foreground hover:border-primary/20 hover:text-foreground"
      }`}
    >
      <div
        className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-all ${
          checked ? "bg-primary border-primary" : "border-current"
        }`}
      >
        {checked && <CheckCircle2 size={10} className="text-primary-foreground" />}
      </div>
      {label}
    </button>
  );
}

function MedicationList({ medications, onChange }) {
  const FREQS = [
    { value: "once_daily", label: "Once daily" },
    { value: "twice_daily", label: "Twice daily" },
    { value: "three_daily", label: "3× daily" },
    { value: "as_needed", label: "As needed" },
    { value: "weekly", label: "Weekly" },
  ];
  const inputCls =
    "w-full px-3 py-2.5 bg-muted rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all text-foreground placeholder:text-muted-foreground";

  function add() {
    onChange([...medications, { name: "", dosage: "", frequency: "once_daily" }]);
  }
  function update(i, field, val) {
    const next = [...medications];
    next[i] = { ...next[i], [field]: val };
    onChange(next);
  }
  function remove(i) {
    onChange(medications.filter((_, idx) => idx !== i));
  }

  return (
    <div className="flex flex-col gap-3">
      {medications.map((med, i) => (
        <div
          key={i}
          className="bg-muted/50 border border-border rounded-xl p-4"
        >
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Medication {i + 1}
            </p>
            <button
              type="button"
              onClick={() => remove(i)}
              className="text-muted-foreground hover:text-red-500 transition-colors"
            >
              <X size={15} />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2 mb-2">
            <input
              value={med.name}
              onChange={(e) => update(i, "name", e.target.value)}
              placeholder="Drug name"
              className={inputCls}
            />
            <input
              value={med.dosage}
              onChange={(e) => update(i, "dosage", e.target.value)}
              placeholder="e.g. 500mg"
              className={inputCls}
            />
          </div>
          <select
            value={med.frequency}
            onChange={(e) => update(i, "frequency", e.target.value)}
            className={`${inputCls} appearance-none cursor-pointer`}
          >
            {FREQS.map((f) => (
              <option key={f.value} value={f.value}>
                {f.label}
              </option>
            ))}
          </select>
        </div>
      ))}
      {medications.length < 8 && (
        <button
          type="button"
          onClick={add}
          className="flex items-center justify-center gap-2 py-3.5 border-2 border-dashed border-border rounded-xl text-sm text-muted-foreground hover:border-primary/40 hover:text-primary transition-colors"
        >
          <Plus size={16} /> Add medication
        </button>
      )}
    </div>
  );
}

//  Constants
// const MAIN_STEPS = ["Contact", "Verify", "Identity", "Health Profile"];

const HEALTH_SUB_STEPS = [
  "Basic info",
  "Existing conditions",
  "Allergies",
  "Medications",
  "Family history",
  "Lifestyle",
  "Emergency contact",
];

const CONDITIONS = [
  { key: "hypertension", label: "Hypertension (High BP)" },
  { key: "diabetes", label: "Diabetes" },
  { key: "asthma", label: "Asthma" },
  { key: "sickle_cell", label: "Sickle Cell" },
  { key: "heart_disease", label: "Heart Disease" },
  { key: "hiv_aids", label: "HIV/AIDS" },
  { key: "cancer", label: "Cancer" },
  { key: "kidney_disease", label: "Kidney Disease" },
  { key: "thyroid", label: "Thyroid Disorder" },
  { key: "mental_health", label: "Mental Health" },
];

const FAMILY_CONDITIONS = [
  { key: "family_hypertension", label: "Hypertension (High BP)" },
  { key: "family_diabetes", label: "Diabetes" },
  { key: "family_heart", label: "Heart Disease" },
  { key: "family_cancer", label: "Cancer" },
  { key: "family_sickle", label: "Sickle Cell Disease" },
];

// ── Page ──────────────────────────────────────────────────────────────────────
export default function PatientRegister() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [subStep, setSubStep] = useState(0);
  const [panelVisible, setPanelVisible] = useState(true);
  const [agreed, setAgreed] = useState(false);

  // Accumulated across steps
  const [registrationId, setRegistrationId] = useState("");
  const [userId, setUserId] = useState("");

  // Step 0
  const [identifierType, setIdentifierType] = useState("phone");
  const [identifier, setIdentifier] = useState("");

  // Step 1
  const [otp, setOtp] = useState("");

  // Step 2
  const [nin, setNin] = useState({
    nin: "",
    full_name: "",
    date_of_birth: "",
  });

  // Step 3 — health intake
  const [health, setHealth] = useState({
    // Sub 0
    sex: "",
    blood_type: "",
    height_cm: "",
    weight_kg: "",
    // Sub 1 — conditions
    hypertension: false,
    diabetes: false,
    asthma: false,
    sickle_cell: false,
    heart_disease: false,
    hiv_aids: false,
    cancer: false,
    kidney_disease: false,
    thyroid: false,
    mental_health: false,
    other_conditions: "",
    // Sub 2 — allergies
    drug_allergies: [],
    food_allergies: [],
    env_allergies: [],
    // Sub 3 — medications
    no_medications: false,
    medications: [],
    // Sub 4 — family history
    family_hypertension: "unknown",
    family_diabetes: "unknown",
    family_heart: "unknown",
    family_cancer: "unknown",
    family_sickle: "unknown",
    // Sub 5 — lifestyle
    smoking: "never",
    alcohol: "never",
    exercise: "rarely",
    // Sub 6 — emergency contact
    emergency_name: "",
    emergency_phone: "",
    emergency_relationship: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function updateHealth(field, value) {
    setHealth((h) => ({ ...h, [field]: value }));
  }

  const inputClass =
    "w-full px-4 py-3 bg-muted rounded-xl border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all";

  // Handlers 

  async function handleContact(e) {
    e.preventDefault();
    if (!agreed) {
      setError("Please agree to the Terms of Service to continue.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const data = await api.post("/auth/register/initiate", {
        identifier,
        identifier_type: identifierType,
      });
      setRegistrationId(data.registration_id);
      setPanelVisible(false); // ← panel collapses after first API call
      setStep(1);
    } catch (err) {
      setError(err.message || "Couldn't send a verification code. Try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleOTP(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.post("/auth/register/verify-identifier", {
        registration_id: registrationId,
        otp_code: otp,
      });
      setStep(2);
    } catch (err) {
      setError(err.message || "Invalid code. Check and try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleNIN(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await api.post("/auth/register/verify-nin", {
        registration_id: registrationId,
        nin: nin.nin,
        full_name: nin.full_name,
        date_of_birth: nin.date_of_birth,
      });
      setUserId(data.user_id);
      setStep(3);
      setSubStep(0);
    } catch (err) {
      setError(
        err.message ||
          "Could not verify your NIN. Make sure the details match your NIN record."
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleHealthNext(e) {
    if (e) e.preventDefault();

    if (subStep < HEALTH_SUB_STEPS.length - 1) {
      setSubStep((s) => s + 1);
      setError("");
      return;
    }

    // Final sub-step — submit profile
    setError("");
    setLoading(true);
    try {
      const onboarding_data = {
        sex: health.sex || undefined,
        blood_type: health.blood_type || undefined,
        height_cm: health.height_cm ? Number(health.height_cm) : undefined,
        weight_kg: health.weight_kg ? Number(health.weight_kg) : undefined,
        date_of_birth: nin.date_of_birth,
        conditions: CONDITIONS.filter((c) => health[c.key]).map((c) => c.label),
        other_conditions: health.other_conditions || undefined,
        allergies: {
          drug: health.drug_allergies,
          food: health.food_allergies,
          environmental: health.env_allergies,
        },
        medications: health.no_medications ? [] : health.medications,
        family_history: {
          hypertension: health.family_hypertension,
          diabetes: health.family_diabetes,
          heart_disease: health.family_heart,
          cancer: health.family_cancer,
          sickle_cell: health.family_sickle,
        },
        lifestyle: {
          smoking: health.smoking,
          alcohol: health.alcohol,
          exercise: health.exercise,
        },
        emergency_contact:
          health.emergency_name
            ? {
                name: health.emergency_name,
                phone: health.emergency_phone,
                relationship: health.emergency_relationship,
              }
            : undefined,
      };
      await api.post("/profile/initialize", {
        user_id: userId,
        onboarding_data,
        source: "self_reported",
      });
      setStep(4);
    } catch (err) {
      setError(err.message || "Could not save your health profile. Try again.");
    } finally {
      setLoading(false);
    }
  }

  function skipSubStep() {
    setError("");
    if (subStep < HEALTH_SUB_STEPS.length - 1) {
      setSubStep((s) => s + 1);
    } else {
      handleHealthNext();
    }
  }

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <AuthLayout
      sidePanel={<RegisterSidePanel />}
      panelVisible={panelVisible}
      currentStep={step}
    >
      <AnimatePresence mode="wait">

        {/* ════ STEP 0 — Contact ════ */}
        {step === 0 && (
          <motion.div
            key="contact"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.35 }}
          >
            <h1
              className="text-2xl font-extrabold text-foreground mb-1"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              Create your account
            </h1>
            <p className="text-sm text-muted-foreground mb-8">
              Free forever. No app download required.
            </p>

            <form onSubmit={handleContact} className="flex flex-col gap-4">
              {/* Phone / Email toggle */}
              <div className="flex gap-1 p-1 bg-muted rounded-xl border border-border">
                {[
                  { id: "phone", label: "Phone" },
                  { id: "email", label: "Email" },
                ].map(({ id, label }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => {
                      setIdentifierType(id);
                      setIdentifier("");
                      setError("");
                    }}
                    className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
                      identifierType === id
                        ? "bg-background shadow-sm text-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">
                  {identifierType === "phone" ? "Phone number" : "Email address"}
                </label>
                <input
                  type={identifierType === "phone" ? "tel" : "email"}
                  required
                  autoFocus
                  placeholder={
                    identifierType === "phone" ? "0803 000 0000" : "you@email.com"
                  }
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className={inputClass}
                />
              </div>

              {/* T&C — required checkbox */}
              <div className="flex items-start gap-3 py-1">
                <input
                  type="checkbox"
                  id="terms"
                  checked={agreed}
                  onChange={(e) => {
                    setAgreed(e.target.checked);
                    if (error.includes("Terms")) setError("");
                  }}
                  className="mt-0.5 h-4 w-4 cursor-pointer accent-primary rounded"
                />
                <label
                  htmlFor="terms"
                  className="text-sm text-muted-foreground cursor-pointer leading-relaxed"
                >
                  I agree to BetaCare's{" "}
                  <Link
                    to="/terms"
                    target="_blank"
                    className="text-primary hover:underline font-medium"
                  >
                    Terms of Service
                  </Link>{" "}
                  and understand this platform assists — it does not diagnose or prescribe
                </label>
              </div>

              {error && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-sm text-red-500 bg-red-50 dark:bg-red-950/20 px-3 py-2.5 rounded-lg border border-red-200 dark:border-red-800/30"
                >
                  {error}
                </motion.p>
              )}

              <MagneticButton
                type="submit"
                disabled={loading || !identifier || !agreed}
                className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50 mt-1"
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" /> Sending code…
                  </>
                ) : (
                  <>
                    Continue <ArrowRight size={16} />
                  </>
                )}
              </MagneticButton>
            </form>

            <p className="text-sm text-muted-foreground mt-6 text-center">
              Already have an account?{" "}
              <Link
                to="/patient/login"
                className="text-primary font-medium hover:underline"
              >
                Sign in
              </Link>
            </p>
          </motion.div>
        )}

        {/* ════ STEP 1 — OTP ════ */}
        {step === 1 && (
          <motion.div
            key="otp"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.35 }}
          >
            <h1
              className="text-2xl font-extrabold text-foreground mb-1"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              Verify your {identifierType}
            </h1>
            <p className="text-sm text-muted-foreground mb-8">
              We sent a 6-digit code to{" "}
              <span className="text-foreground font-medium">{identifier}</span>
            </p>

            <form onSubmit={handleOTP} className="flex flex-col gap-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">
                  Verification code
                </label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  autoFocus
                  placeholder="000000"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  className={`${inputClass} text-center tracking-[0.6em] text-2xl font-bold`}
                />
              </div>

              {error && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-sm text-red-500 bg-red-50 dark:bg-red-950/20 px-3 py-2.5 rounded-lg border border-red-200 dark:border-red-800/30"
                >
                  {error}
                </motion.p>
              )}

              <MagneticButton
                type="submit"
                disabled={loading || otp.length < 6}
                className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50 mt-1"
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" /> Verifying…
                  </>
                ) : (
                  <>
                    Verify <ArrowRight size={16} />
                  </>
                )}
              </MagneticButton>
            </form>

            <div className="flex items-center justify-between mt-4 text-sm">
              <button
                type="button"
                onClick={() => {
                  setStep(0);
                  setPanelVisible(true);
                  setOtp("");
                  setError("");
                }}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                ← Change {identifierType}
              </button>
              <button
                type="button"
                onClick={() =>
                  api.post("/auth/register/initiate", {
                    identifier,
                    identifier_type: identifierType,
                  })
                }
                className="text-primary font-medium hover:underline"
              >
                Resend code
              </button>
            </div>
          </motion.div>
        )}

        {/* ════ STEP 2 — NIN ════ */}
        {step === 2 && (
          <motion.div
            key="nin"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.35 }}
          >
            <h1
              className="text-2xl font-extrabold text-foreground mb-1"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              Verify your identity
            </h1>
            <p className="text-sm text-muted-foreground mb-2">
              Your NIN confirms you're a real person. Details must match your NIN record exactly.
            </p>
            <div className="inline-flex items-center gap-2 bg-primary/6 border border-primary/15 rounded-lg px-3 py-2 mb-8">
              <Stethoscope size={12} className="text-primary shrink-0" />
              <p className="text-xs text-muted-foreground">
                Your NIN is hashed and never stored as plain text.
              </p>
            </div>

            <form onSubmit={handleNIN} className="flex flex-col gap-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">
                  Full legal name
                </label>
                <input
                  type="text"
                  required
                  autoFocus
                  placeholder="As it appears on your NIN slip"
                  value={nin.full_name}
                  onChange={(e) =>
                    setNin((n) => ({ ...n, full_name: e.target.value }))
                  }
                  className={inputClass}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">
                  Date of birth
                </label>
                <input
                  type="date"
                  required
                  max={new Date().toISOString().split("T")[0]}
                  value={nin.date_of_birth}
                  onChange={(e) =>
                    setNin((n) => ({ ...n, date_of_birth: e.target.value }))
                  }
                  className={inputClass}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">
                  National Identification Number (NIN)
                </label>
                <input
                  type="text"
                  required
                  maxLength={11}
                  placeholder="11-digit NIN"
                  value={nin.nin}
                  onChange={(e) =>
                    setNin((n) => ({
                      ...n,
                      nin: e.target.value.replace(/\D/g, ""),
                    }))
                  }
                  className={`${inputClass} font-mono tracking-widest`}
                />
                <p className="text-xs text-muted-foreground mt-1.5">
                  Dial{" "}
                  <span className="font-mono bg-muted px-1.5 py-0.5 rounded text-foreground">
                    *346#
                  </span>{" "}
                  on any Nigerian network to retrieve your NIN
                </p>
              </div>

              {error && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-sm text-red-500 bg-red-50 dark:bg-red-950/20 px-3 py-2.5 rounded-lg border border-red-200 dark:border-red-800/30"
                >
                  {error}
                </motion.p>
              )}

              <MagneticButton
                type="submit"
                disabled={
                  loading ||
                  !nin.nin ||
                  !nin.full_name ||
                  !nin.date_of_birth ||
                  nin.nin.length < 11
                }
                className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50 mt-1"
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" /> Verifying NIN…
                  </>
                ) : (
                  <>
                    Verify identity <ArrowRight size={16} />
                  </>
                )}
              </MagneticButton>
            </form>
          </motion.div>
        )}

        {/* ════ STEP 3 — Health Intake ════ */}
        {step === 3 && (
          <motion.div
            key="health-wrapper"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.35 }}
          >
            {/* Sub-step progress */}
            <div className="flex gap-1.5 mb-3">
              {HEALTH_SUB_STEPS.map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 flex-1 rounded-full transition-all duration-400 ${
                    i < subStep
                      ? "bg-primary"
                      : i === subStep
                      ? "bg-primary/45"
                      : "bg-border"
                  }`}
                />
              ))}
            </div>
            <p className="text-[11px] uppercase tracking-widest font-semibold text-muted-foreground mb-6">
              {subStep + 1} of {HEALTH_SUB_STEPS.length} — {HEALTH_SUB_STEPS[subStep]}
            </p>

            <form onSubmit={handleHealthNext}>
              {/* ── Sub-step animated content ── */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={`sub-${subStep}`}
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                  transition={{ duration: 0.25 }}
                >

                  {/* Sub 0 — Basic info */}
                  {subStep === 0 && (
                    <div className="flex flex-col gap-5">
                      <div>
                        <h2
                          className="text-xl font-extrabold text-foreground mb-1"
                          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                        >
                          Let's start with the basics
                        </h2>
                        <p className="text-sm text-muted-foreground">
                          Helps calibrate your health profile from day one.
                        </p>
                      </div>
                      <PillSelect
                        label="Biological sex"
                        value={health.sex}
                        onChange={(v) => updateHealth("sex", v)}
                        options={[
                          { value: "male", label: "Male" },
                          { value: "female", label: "Female" },
                          { value: "prefer_not", label: "Prefer not to say" },
                        ]}
                      />
                      <div>
                        <label className="text-sm font-medium text-foreground mb-1.5 block">
                          Blood type
                        </label>
                        <select
                          value={health.blood_type}
                          onChange={(e) => updateHealth("blood_type", e.target.value)}
                          className={`${inputClass} appearance-none cursor-pointer`}
                        >
                          <option value="">Select blood type (if known)</option>
                          {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(
                            (t) => (
                              <option key={t} value={t}>
                                {t}
                              </option>
                            )
                          )}
                          <option value="unknown">Don't know</option>
                        </select>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-sm font-medium text-foreground mb-1.5 block">
                            Height (cm)
                          </label>
                          <input
                            type="number"
                            min="50"
                            max="250"
                            placeholder="e.g. 172"
                            value={health.height_cm}
                            onChange={(e) => updateHealth("height_cm", e.target.value)}
                            className={inputClass}
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-foreground mb-1.5 block">
                            Weight (kg)
                          </label>
                          <input
                            type="number"
                            min="10"
                            max="300"
                            placeholder="e.g. 70"
                            value={health.weight_kg}
                            onChange={(e) => updateHealth("weight_kg", e.target.value)}
                            className={inputClass}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Sub 1 — Conditions */}
                  {subStep === 1 && (
                    <div className="flex flex-col gap-4">
                      <div>
                        <h2
                          className="text-xl font-extrabold text-foreground mb-1"
                          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                        >
                          Any existing conditions?
                        </h2>
                        <p className="text-sm text-muted-foreground">
                          Select all that apply — gives the AI more to work with.
                        </p>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {CONDITIONS.map(({ key, label }) => (
                          <ConditionToggle
                            key={key}
                            label={label}
                            checked={health[key]}
                            onChange={(v) => updateHealth(key, v)}
                          />
                        ))}
                      </div>
                      <div>
                        <label className="text-sm font-medium text-foreground mb-1.5 block">
                          Other conditions
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Epilepsy, Arthritis, Ulcer…"
                          value={health.other_conditions}
                          onChange={(e) =>
                            updateHealth("other_conditions", e.target.value)
                          }
                          className={inputClass}
                        />
                      </div>
                    </div>
                  )}

                  {/* Sub 2 — Allergies */}
                  {subStep === 2 && (
                    <div className="flex flex-col gap-5">
                      <div>
                        <h2
                          className="text-xl font-extrabold text-foreground mb-1"
                          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                        >
                          Any allergies we should know?
                        </h2>
                        <p className="text-sm text-muted-foreground">
                          Type each one and press Enter or tap Add.
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">
                          Drug allergies
                        </label>
                        <TagInput
                          tags={health.drug_allergies}
                          onAdd={(v) =>
                            updateHealth("drug_allergies", [
                              ...health.drug_allergies,
                              v,
                            ])
                          }
                          onRemove={(v) =>
                            updateHealth(
                              "drug_allergies",
                              health.drug_allergies.filter((t) => t !== v)
                            )
                          }
                          placeholder="e.g. Penicillin, Aspirin…"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">
                          Food allergies
                        </label>
                        <TagInput
                          tags={health.food_allergies}
                          onAdd={(v) =>
                            updateHealth("food_allergies", [
                              ...health.food_allergies,
                              v,
                            ])
                          }
                          onRemove={(v) =>
                            updateHealth(
                              "food_allergies",
                              health.food_allergies.filter((t) => t !== v)
                            )
                          }
                          placeholder="e.g. Peanuts, Shellfish…"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">
                          Environmental allergies
                        </label>
                        <TagInput
                          tags={health.env_allergies}
                          onAdd={(v) =>
                            updateHealth("env_allergies", [
                              ...health.env_allergies,
                              v,
                            ])
                          }
                          onRemove={(v) =>
                            updateHealth(
                              "env_allergies",
                              health.env_allergies.filter((t) => t !== v)
                            )
                          }
                          placeholder="e.g. Dust, Pollen, Latex…"
                        />
                      </div>
                    </div>
                  )}

                  {/* Sub 3 — Medications */}
                  {subStep === 3 && (
                    <div className="flex flex-col gap-4">
                      <div>
                        <h2
                          className="text-xl font-extrabold text-foreground mb-1"
                          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                        >
                          Currently taking any medications?
                        </h2>
                        <p className="text-sm text-muted-foreground">
                          Only include medications from a licensed doctor or pharmacist.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          updateHealth("no_medications", !health.no_medications)
                        }
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-sm font-medium transition-all ${
                          health.no_medications
                            ? "bg-primary/10 border-primary/40 text-primary"
                            : "bg-muted border-border text-muted-foreground hover:border-primary/20"
                        }`}
                      >
                        <div
                          className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-all ${
                            health.no_medications
                              ? "bg-primary border-primary"
                              : "border-current"
                          }`}
                        >
                          {health.no_medications && (
                            <X size={9} className="text-primary-foreground" />
                          )}
                        </div>
                        I'm not currently taking any medications
                      </button>
                      {!health.no_medications && (
                        <MedicationList
                          medications={health.medications}
                          onChange={(v) => updateHealth("medications", v)}
                        />
                      )}
                    </div>
                  )}

                  {/* Sub 4 — Family history */}
                  {subStep === 4 && (
                    <div className="flex flex-col gap-4">
                      <div>
                        <h2
                          className="text-xl font-extrabold text-foreground mb-1"
                          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                        >
                          Family health history
                        </h2>
                        <p className="text-sm text-muted-foreground">
                          Have parents or siblings been diagnosed with these? Your best
                          guess is fine.
                        </p>
                      </div>
                      <div className="bg-muted rounded-2xl border border-border overflow-hidden">
                        {FAMILY_CONDITIONS.map(({ key, label }) => (
                          <div key={key} className="px-4">
                            <TriSelect
                              label={label}
                              value={health[key]}
                              onChange={(v) => updateHealth(key, v)}
                            />
                          </div>
                        ))}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Yes / No / ? (Unknown) — helps identify inherited risk factors
                      </p>
                    </div>
                  )}

                  {/* Sub 5 — Lifestyle */}
                  {subStep === 5 && (
                    <div className="flex flex-col gap-5">
                      <div>
                        <h2
                          className="text-xl font-extrabold text-foreground mb-1"
                          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                        >
                          A few lifestyle questions
                        </h2>
                        <p className="text-sm text-muted-foreground">
                          No judgement — personalises your health nudges.
                        </p>
                      </div>
                      <PillSelect
                        label="Smoking"
                        value={health.smoking}
                        onChange={(v) => updateHealth("smoking", v)}
                        options={[
                          { value: "never", label: "Never" },
                          { value: "former", label: "Former" },
                          { value: "current", label: "Current" },
                        ]}
                      />
                      <PillSelect
                        label="Alcohol"
                        value={health.alcohol}
                        onChange={(v) => updateHealth("alcohol", v)}
                        options={[
                          { value: "never", label: "Never" },
                          { value: "occasionally", label: "Occasionally" },
                          { value: "regularly", label: "Regularly" },
                        ]}
                      />
                      <PillSelect
                        label="Exercise frequency"
                        value={health.exercise}
                        onChange={(v) => updateHealth("exercise", v)}
                        options={[
                          { value: "rarely", label: "Rarely" },
                          { value: "1_2_week", label: "1–2× /week" },
                          { value: "3_4_week", label: "3–4× /week" },
                          { value: "daily", label: "Daily" },
                        ]}
                      />
                    </div>
                  )}

                  {/* Sub 6 — Emergency contact */}
                  {subStep === 6 && (
                    <div className="flex flex-col gap-4">
                      <div>
                        <h2
                          className="text-xl font-extrabold text-foreground mb-1"
                          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                        >
                          Emergency contact
                        </h2>
                        <p className="text-sm text-muted-foreground">
                          Who should be contacted in a medical emergency? This stays private.
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-foreground mb-1.5 block">
                          Full name
                        </label>
                        <input
                          type="text"
                          placeholder="Contact's full name"
                          value={health.emergency_name}
                          onChange={(e) =>
                            updateHealth("emergency_name", e.target.value)
                          }
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-foreground mb-1.5 block">
                          Phone number
                        </label>
                        <input
                          type="tel"
                          placeholder="Contact's phone number"
                          value={health.emergency_phone}
                          onChange={(e) =>
                            updateHealth("emergency_phone", e.target.value)
                          }
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-foreground mb-1.5 block">
                          Relationship
                        </label>
                        <select
                          value={health.emergency_relationship}
                          onChange={(e) =>
                            updateHealth("emergency_relationship", e.target.value)
                          }
                          className={`${inputClass} appearance-none cursor-pointer`}
                        >
                          <option value="">Select relationship</option>
                          {["Spouse", "Parent", "Sibling", "Child", "Friend", "Other"].map(
                            (r) => (
                              <option key={r} value={r.toLowerCase()}>
                                {r}
                              </option>
                            )
                          )}
                        </select>
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Error */}
              {error && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-sm text-red-500 bg-red-50 dark:bg-red-950/20 px-3 py-2.5 rounded-lg border border-red-200 dark:border-red-800/30 mt-4"
                >
                  {error}
                </motion.p>
              )}

              {/* Buttons */}
              <div className="flex flex-col gap-2 mt-6">
                <MagneticButton
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      {subStep === HEALTH_SUB_STEPS.length - 1
                        ? "Finishing…"
                        : "Saving…"}
                    </>
                  ) : subStep === HEALTH_SUB_STEPS.length - 1 ? (
                    "Finish setup"
                  ) : (
                    <>
                      Continue <ArrowRight size={16} />
                    </>
                  )}
                </MagneticButton>
                {subStep < HEALTH_SUB_STEPS.length - 1 && (
                  <button
                    type="button"
                    onClick={skipSubStep}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors py-2"
                  >
                    Skip for now
                  </button>
                )}
              </div>
            </form>
          </motion.div>
        )}

        {/* ════ STEP 4 — Done ════ */}
        {step === 4 && (
          <motion.div
            key="done"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 16,
                delay: 0.1,
              }}
              className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-primary mx-auto mb-6"
            >
              <CheckCircle2 size={38} />
            </motion.div>

            <h1
              className="text-2xl font-extrabold text-foreground mb-2"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              You're all set!
            </h1>
            <p className="text-sm text-muted-foreground mb-8 max-w-sm mx-auto">
              Your health profile has been created. BetaCare will keep it updated and
              remind you when it matters.
            </p>

            <div className="bg-muted rounded-2xl border border-border p-5 text-left mb-8">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                What happens next
              </p>
              {[
                "You'll receive a WhatsApp confirmation message",
                "Your AI health agent is now active",
                "Your records are ready to share with any BetaCare-integrated hospital",
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 py-2.5 border-b border-border last:border-0"
                >
                  <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-[10px] font-bold text-primary">{i + 1}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">{item}</span>
                </div>
              ))}
            </div>

            <MagneticButton
              onClick={() => navigate("/patient/dashboard")}
              className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 transition-colors"
            >
              Go to your dashboard <ArrowRight size={16} />
            </MagneticButton>
          </motion.div>
        )}
      </AnimatePresence>
    </AuthLayout>
  );
}