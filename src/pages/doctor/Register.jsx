import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { Eye, EyeOff, Loader2, ArrowRight, CheckCircle2, Camera, ShieldCheck, Stethoscope } from "lucide-react";
import { AuthLayout } from "../../components/auth/AuthLayout";
import { MagneticButton } from "../../components/common/MagneticButton";
import { api, setSession } from "../../lib/api";

const STEPS = ["Your details", "Verify email", "MDCN number", "Identity check", "All done"];

const SPECIALTIES = [
  "General Practice", "Internal Medicine", "Paediatrics",
  "Obstetrics & Gynaecology", "Surgery", "Cardiology",
  "Neurology", "Psychiatry", "Radiology", "Dermatology", "Other",
];

export default function DoctorRegister() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({ name: "", email: "", specialty: "", password: "" });
  const [otp, setOtp] = useState("");
  const [mdcn, setMdcn] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const update = f => e => setForm(p => ({ ...p, [f]: e.target.value }));

  async function handleDetails(e) {
    e.preventDefault();
    if (!agreed) { setError("You must agree to the Terms of Service."); return; }
    setError(""); setLoading(true);
    try {
      await api.post("/auth/doctor/register", form);
      setStep(1);
    } catch (err) {
      setError(err.message || "Something went wrong. Try again.");
    } finally { setLoading(false); }
  }

  async function handleOTP(e) {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      await api.post("/auth/doctor/verify-email", { email: form.email, otp });
      setStep(2);
    } catch (err) {
      setError(err.message || "Invalid code.");
    } finally { setLoading(false); }
  }

  async function handleMDCN(e) {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      await api.post("/auth/doctor/verify-mdcn", { mdcn });
      setStep(3);
    } catch (err) {
      setError(err.message || "Could not verify that MDCN number. Check and try again.");
    } finally { setLoading(false); }
  }

  function handleLiveness() {
    setLoading(true);
    // TODO: trigger Smile Identity SDK here
    // For now: simulate completion
    setTimeout(() => { setLoading(false); setStep(4); }, 2000);
  }

  return (
    <AuthLayout steps={STEPS} currentStep={step}>
      <AnimatePresence mode="wait">

        {/* STEP 0 — Details */}
        {step === 0 && (
          <motion.div key="details" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-semibold mb-5">
              <Stethoscope size={12} /> Doctor Portal
            </div>
            <h1 className="text-2xl font-extrabold text-foreground mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Register as a doctor
            </h1>
            <p className="text-sm text-muted-foreground mb-8">Your MDCN credentials will be verified in the next steps</p>

            <form onSubmit={handleDetails} className="flex flex-col gap-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Full name</label>
                <input type="text" required placeholder="Dr. Chukwuemeka Obi" value={form.name} onChange={update("name")}
                  className="w-full px-4 py-3 bg-muted rounded-xl border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all" />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Email address</label>
                <input type="email" required placeholder="dr.you@email.com" value={form.email} onChange={update("email")}
                  className="w-full px-4 py-3 bg-muted rounded-xl border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all" />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Specialty</label>
                <select required value={form.specialty} onChange={update("specialty")}
                  className="w-full px-4 py-3 bg-muted rounded-xl border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all appearance-none cursor-pointer">
                  <option value="" disabled>Select your specialty</option>
                  {SPECIALTIES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Password</label>
                <div className="relative">
                  <input type={showPw ? "text" : "password"} required minLength={8} placeholder="Min. 8 characters"
                    value={form.password} onChange={update("password")}
                    className="w-full px-4 py-3 bg-muted rounded-xl border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all pr-11" />
                  <button type="button" onClick={() => setShowPw(p => !p)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                    {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* T&C — required */}
              <div className="flex items-start gap-3 mt-1">
                <input type="checkbox" id="terms" checked={agreed} onChange={e => setAgreed(e.target.checked)}
                  className="mt-0.5 h-4 w-4 cursor-pointer accent-primary" />
                <label htmlFor="terms" className="text-sm text-muted-foreground cursor-pointer leading-relaxed">
                  I agree to the{" "}
                  <Link to="/terms" target="_blank" className="text-primary hover:underline font-medium">Terms of Service</Link>
                  {" "}and the BetaCare Doctor Code of Conduct
                </label>
              </div>

              {error && (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="text-sm text-red-500 bg-red-50 dark:bg-red-950/20 px-3 py-2 rounded-lg border border-red-200 dark:border-red-800/30">
                  {error}
                </motion.p>
              )}

              <MagneticButton type="submit" disabled={loading || !agreed}
                className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50 mt-1">
                {loading ? <><Loader2 size={16} className="animate-spin" /> Submitting…</> : <>Continue <ArrowRight size={16} /></>}
              </MagneticButton>
            </form>

            <p className="text-sm text-muted-foreground mt-6 text-center">
              Already registered? <Link to="/doctor/login" className="text-primary font-medium hover:underline">Sign in</Link>
            </p>
          </motion.div>
        )}

        {/* STEP 1 — Email OTP */}
        {step === 1 && (
          <motion.div key="otp" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
            <h1 className="text-2xl font-extrabold text-foreground mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Check your email
            </h1>
            <p className="text-sm text-muted-foreground mb-8">
              We sent a 6-digit code to <span className="text-foreground font-medium">{form.email}</span>
            </p>
            <form onSubmit={handleOTP} className="flex flex-col gap-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Verification code</label>
                <input type="text" required maxLength={6} placeholder="000000"
                  value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g, ""))}
                  className="w-full px-4 py-3 bg-muted rounded-xl border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all text-center tracking-[0.5em] text-xl font-bold" />
              </div>
              {error && (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="text-sm text-red-500 bg-red-50 dark:bg-red-950/20 px-3 py-2 rounded-lg border border-red-200 dark:border-red-800/30">
                  {error}
                </motion.p>
              )}
              <MagneticButton type="submit" disabled={loading || otp.length < 6}
                className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50 mt-1">
                {loading ? <><Loader2 size={16} className="animate-spin" /> Verifying…</> : <>Verify email <ArrowRight size={16} /></>}
              </MagneticButton>
            </form>
            <p className="text-sm text-muted-foreground mt-4 text-center">
              Didn't get it?{" "}
              <button onClick={() => api.post("/auth/doctor/resend-otp", { email: form.email })}
                className="text-primary font-medium hover:underline cursor-pointer">
                Resend code
              </button>
            </p>
          </motion.div>
        )}

        {/* STEP 2 — MDCN */}
        {step === 2 && (
          <motion.div key="mdcn" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
            <h1 className="text-2xl font-extrabold text-foreground mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Enter your MDCN number
            </h1>
            <p className="text-sm text-muted-foreground mb-8">
              Your Medical and Dental Council of Nigeria registration number. We'll verify it automatically via Prembly.
            </p>
            <form onSubmit={handleMDCN} className="flex flex-col gap-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">MDCN registration number</label>
                <input type="text" required placeholder="e.g. MD/12345/A"
                  value={mdcn} onChange={e => setMdcn(e.target.value.toUpperCase())}
                  className="w-full px-4 py-3 bg-muted rounded-xl border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all font-mono tracking-wide" />
                <p className="text-xs text-muted-foreground mt-2">
                  Found on your MDCN certificate or the MDCN practitioners' register
                </p>
              </div>
              {error && (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="text-sm text-red-500 bg-red-50 dark:bg-red-950/20 px-3 py-2 rounded-lg border border-red-200 dark:border-red-800/30">
                  {error}
                </motion.p>
              )}
              <MagneticButton type="submit" disabled={loading || mdcn.length < 5}
                className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50 mt-1">
                {loading ? <><Loader2 size={16} className="animate-spin" /> Verifying…</> : <>Verify number <ArrowRight size={16} /></>}
              </MagneticButton>
            </form>
          </motion.div>
        )}

        {/* STEP 3 — Liveness */}
        {step === 3 && (
          <motion.div key="liveness" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
            <h1 className="text-2xl font-extrabold text-foreground mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Identity check
            </h1>
            <p className="text-sm text-muted-foreground mb-6">
              A quick liveness check to confirm you are who your MDCN number says. Powered by{" "}
              <a href="https://smileidentity.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                Smile Identity
              </a>.
            </p>

            <div className="bg-muted rounded-2xl border border-border p-8 text-center mb-5">
              <motion.div
                className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-primary mx-auto mb-4"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              >
                <Camera size={32} />
              </motion.div>
              <p className="text-sm font-semibold text-foreground mb-2">Ready for your liveness check?</p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                You'll need your camera. We'll ask you to blink and briefly turn your head — takes under 30 seconds.
              </p>
            </div>

            <div className="flex flex-col gap-2.5 mb-6">
              {[
                "Your image is used only for verification and not stored permanently",
                "Matched against your MDCN records via Prembly API",
              ].map(point => (
                <div key={point} className="flex items-start gap-2.5">
                  <ShieldCheck size={14} className="text-primary mt-0.5 shrink-0" />
                  <span className="text-xs text-muted-foreground">{point}</span>
                </div>
              ))}
            </div>

            <MagneticButton onClick={handleLiveness} disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50">
              {loading ? <><Loader2 size={16} className="animate-spin" /> Connecting…</> : <><Camera size={16} /> Start identity check</>}
            </MagneticButton>
          </motion.div>
        )}

        {/* STEP 4 — Done */}
        {step === 4 && (
          <motion.div key="done" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }} className="text-center">
            <motion.div
              initial={{ scale: 0 }} animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 16, delay: 0.1 }}
              className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-primary mx-auto mb-6"
            >
              <CheckCircle2 size={36} />
            </motion.div>
            <h1 className="text-2xl font-extrabold text-foreground mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              You're verified, Doctor
            </h1>
            <p className="text-sm text-muted-foreground mb-8">
              Your MDCN credentials have been confirmed. Welcome to BetaCare.
            </p>
            <MagneticButton onClick={() => navigate("/doctor/patients")}
              className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 transition-colors">
              Go to your dashboard <ArrowRight size={16} />
            </MagneticButton>
          </motion.div>
        )}
      </AnimatePresence>
    </AuthLayout>
  );
}