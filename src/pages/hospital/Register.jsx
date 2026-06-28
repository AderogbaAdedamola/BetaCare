import { useState } from "react";
import { Link } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { Eye, EyeOff, Loader2, ArrowRight, Building2, Clock } from "lucide-react";
import { AuthLayout } from "../../components/auth/AuthLayout";
import { MagneticButton } from "../../components/common/MagneticButton";
import { api } from "../../lib/api";

const STEPS = ["Hospital details", "Admin account", "Verification", "Submitted"];

const HOSPITAL_TYPES = [
  "General Hospital", "Teaching Hospital", "Specialist Hospital",
  "Private Clinic", "Primary Health Centre", "Diagnostic Centre", "Other",
];

const STATES = [
  "Abia","Adamawa","Akwa Ibom","Anambra","Bauchi","Bayelsa","Benue","Borno",
  "Cross River","Delta","Ebonyi","Edo","Ekiti","Enugu","FCT","Gombe","Imo",
  "Jigawa","Kaduna","Kano","Katsina","Kebbi","Kogi","Kwara","Lagos","Nasarawa",
  "Niger","Ogun","Ondo","Osun","Oyo","Plateau","Rivers","Sokoto","Taraba","Yobe","Zamfara",
];

export default function HospitalRegister() {
  const [step, setStep] = useState(0);
  const [hospital, setHospital] = useState({ name: "", type: "", state: "", address: "", phone: "" });
  const [admin, setAdmin] = useState({ name: "", email: "", password: "" });
  const [cac, setCac] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const updateH = f => e => setHospital(p => ({ ...p, [f]: e.target.value }));
  const updateA = f => e => setAdmin(p => ({ ...p, [f]: e.target.value }));

  function nextStep(e) { e.preventDefault(); setError(""); setStep(s => s + 1); }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!agreed) { setError("You must agree to the Terms of Service."); return; }
    setError(""); setLoading(true);
    try {
      await api.post("/auth/hospital/register", { ...hospital, ...admin, cac });
      setStep(3);
    } catch (err) {
      setError(err.message || "Something went wrong. Try again.");
    } finally { setLoading(false); }
  }

  const inputClass = "w-full px-4 py-3 bg-muted rounded-xl border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all";
  const selectClass = `${inputClass} appearance-none cursor-pointer`;

  return (
    <AuthLayout steps={STEPS} currentStep={step}>
      <AnimatePresence mode="wait">

        {/* STEP 0 — Hospital details */}
        {step === 0 && (
          <motion.div key="hosp" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-semibold mb-5">
              <Building2 size={12} /> Hospital Portal
            </div>
            <h1 className="text-2xl font-extrabold text-foreground mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Apply for integration
            </h1>
            <p className="text-sm text-muted-foreground mb-8">Tell us about your healthcare facility</p>

            <form onSubmit={nextStep} className="flex flex-col gap-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Hospital name</label>
                <input type="text" required placeholder="University College Hospital" value={hospital.name} onChange={updateH("name")} className={inputClass} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Type</label>
                  <select required value={hospital.type} onChange={updateH("type")} className={selectClass}>
                    <option value="" disabled>Select type</option>
                    {HOSPITAL_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">State</label>
                  <select required value={hospital.state} onChange={updateH("state")} className={selectClass}>
                    <option value="" disabled>Select state</option>
                    {STATES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Address</label>
                <input type="text" required placeholder="Full hospital address" value={hospital.address} onChange={updateH("address")} className={inputClass} />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Phone number</label>
                <input type="tel" required placeholder="Hospital main line" value={hospital.phone} onChange={updateH("phone")} className={inputClass} />
              </div>
              <MagneticButton type="submit"
                className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 transition-colors mt-1">
                Continue <ArrowRight size={16} />
              </MagneticButton>
            </form>

            <p className="text-sm text-muted-foreground mt-6 text-center">
              Already registered?{" "}
              <Link to="/hospital/login" className="text-primary font-medium hover:underline">Sign in</Link>
            </p>
          </motion.div>
        )}

        {/* STEP 1 — Admin account */}
        {step === 1 && (
          <motion.div key="admin" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
            <h1 className="text-2xl font-extrabold text-foreground mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Create admin account
            </h1>
            <p className="text-sm text-muted-foreground mb-8">
              This account will manage{" "}
              <span className="text-foreground font-medium">{hospital.name}</span>'s portal
            </p>

            <form onSubmit={nextStep} className="flex flex-col gap-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Admin full name</label>
                <input type="text" required placeholder="Dr. Aisha Mohammed" value={admin.name} onChange={updateA("name")} className={inputClass} />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Admin email</label>
                <input type="email" required placeholder="admin@hospital.ng" value={admin.email} onChange={updateA("email")} className={inputClass} />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Password</label>
                <div className="relative">
                  <input type={showPw ? "text" : "password"} required minLength={8} placeholder="Min. 8 characters"
                    value={admin.password} onChange={updateA("password")}
                    className={`${inputClass} pr-11`} />
                  <button type="button" onClick={() => setShowPw(p => !p)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                    {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <MagneticButton type="submit"
                className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 transition-colors mt-1">
                Continue <ArrowRight size={16} />
              </MagneticButton>
            </form>
          </motion.div>
        )}

        {/* STEP 2 — CAC + T&C */}
        {step === 2 && (
          <motion.div key="verify" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
            <h1 className="text-2xl font-extrabold text-foreground mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Verification
            </h1>
            <p className="text-sm text-muted-foreground mb-8">
              We'll verify your CAC number before activating. This takes 1–2 business days.
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">CAC registration number</label>
                <input type="text" required placeholder="RC123456 or BN123456"
                  value={cac} onChange={e => setCac(e.target.value.toUpperCase())}
                  className={`${inputClass} font-mono tracking-wide`} />
                <p className="text-xs text-muted-foreground mt-2">
                  Found on your CAC certificate or the CAC public search portal
                </p>
              </div>

              <div className="bg-muted/50 rounded-xl border border-border p-4 text-xs text-muted-foreground leading-relaxed">
                <p className="font-semibold text-foreground mb-1">What happens next</p>
                Our team verifies your CAC number and emails <span className="text-foreground font-medium">{admin.email}</span> within 1–2 business days. The account activates once confirmed.
              </div>

              {/* T&C — required */}
              <div className="flex items-start gap-3">
                <input type="checkbox" id="terms" checked={agreed} onChange={e => setAgreed(e.target.checked)}
                  className="mt-0.5 h-4 w-4 cursor-pointer accent-primary" />
                <label htmlFor="terms" className="text-sm text-muted-foreground cursor-pointer leading-relaxed">
                  I agree to the{" "}
                  <Link to="/terms" target="_blank" className="text-primary hover:underline font-medium">Terms of Service</Link>
                  {" "}and confirm this is a legitimate registered healthcare facility
                </label>
              </div>

              {error && (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="text-sm text-red-500 bg-red-50 dark:bg-red-950/20 px-3 py-2 rounded-lg border border-red-200 dark:border-red-800/30">
                  {error}
                </motion.p>
              )}

              <MagneticButton type="submit" disabled={loading || !agreed || cac.length < 6}
                className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50 mt-1">
                {loading ? <><Loader2 size={16} className="animate-spin" /> Submitting…</> : <>Submit application <ArrowRight size={16} /></>}
              </MagneticButton>
            </form>
          </motion.div>
        )}

        {/* STEP 3 — Submitted */}
        {step === 3 && (
          <motion.div key="submitted" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }} className="text-center">
            <motion.div
              initial={{ scale: 0 }} animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 16, delay: 0.1 }}
              className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-primary mx-auto mb-6"
            >
              <Clock size={36} />
            </motion.div>
            <h1 className="text-2xl font-extrabold text-foreground mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Application received
            </h1>
            <p className="text-sm text-muted-foreground mb-6">
              We'll review{" "}
              <span className="text-foreground font-medium">{hospital.name}</span>'s credentials and email{" "}
              <span className="text-foreground font-medium">{admin.email}</span> within 1–2 business days.
            </p>
            <div className="bg-muted rounded-2xl border border-border p-5 text-left mb-6">
              {[
                { label: "Status", value: "Under review" },
                { label: "Hospital", value: hospital.name },
                { label: "Contact email", value: admin.email },
                { label: "Expected response", value: "1–2 business days" },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between py-2.5 border-b border-border last:border-0">
                  <span className="text-xs text-muted-foreground">{label}</span>
                  <span className="text-xs font-semibold text-foreground">{value}</span>
                </div>
              ))}
            </div>
            <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-primary font-medium hover:underline">
              ← Back to BetaCare
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </AuthLayout>
  );
}