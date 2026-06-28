import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { Eye, EyeOff, Loader2, ArrowRight } from "lucide-react";
import { AuthLayout } from "../../components/auth/AuthLayout";
import { MagneticButton } from "../../components/common/MagneticButton";
import { api, setSession } from "../../lib/api";

const STEPS = ["Your details", "Verify email"];

export default function PatientRegister() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({ name: "", phone: "", email: "", password: "" });
  const [otp, setOtp] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const update = f => e => setForm(p => ({ ...p, [f]: e.target.value }));

  async function handleRegister(e) {
    e.preventDefault();
    if (!agreed) { setError("You must agree to the Terms of Service to continue."); return; }
    setError(""); setLoading(true);
    try {
      await api.post("/auth/patient/signup", form);
      setStep(1);
    } catch (err) {
      setError(err.message || "Something went wrong. Try again.");
    } finally { setLoading(false); }
  }

  async function handleOTP(e) {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const data = await api.post("/auth/patient/verify-email", { email: form.email, otp });
      setSession(data.token, data.role);
      navigate("/patient/dashboard");
    } catch (err) {
      setError(err.message || "Invalid code. Check your email and try again.");
    } finally { setLoading(false); }
  }

  return (
    <AuthLayout steps={STEPS} currentStep={step}>
      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.div key="details"
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}>
            <h1 className="text-2xl font-extrabold text-foreground mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Create your account
            </h1>
            <p className="text-sm text-muted-foreground mb-8">Free forever — no credit card required</p>

            <form onSubmit={handleRegister} className="flex flex-col gap-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Full name</label>
                <input type="text" required placeholder="Adaeze Okonkwo" value={form.name} onChange={update("name")}
                  className="w-full px-4 py-3 bg-muted rounded-xl border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all" />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Phone number</label>
                <input type="tel" required placeholder="0803 000 0000" value={form.phone} onChange={update("phone")}
                  className="w-full px-4 py-3 bg-muted rounded-xl border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all" />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Email address</label>
                <input type="email" required placeholder="you@email.com" value={form.email} onChange={update("email")}
                  className="w-full px-4 py-3 bg-muted rounded-xl border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all" />
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
                  className="mt-0.5 h-4 w-4 cursor-pointer accent-primary rounded" />
                <label htmlFor="terms" className="text-sm text-muted-foreground cursor-pointer leading-relaxed">
                  I agree to the{" "}
                  <Link to="/terms" target="_blank" className="text-primary hover:underline font-medium">Terms of Service</Link>
                  {" "}and confirm I am at least 13 years old
                </label>
              </div>

              {error && (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="text-sm text-red-500 bg-red-50 dark:bg-red-950/20 px-3 py-2 rounded-lg border border-red-200 dark:border-red-800/30">
                  {error}
                </motion.p>
              )}

              <MagneticButton type="submit" disabled={loading || !agreed}
                className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-1">
                {loading ? <><Loader2 size={16} className="animate-spin" /> Creating account…</> : <>Continue <ArrowRight size={16} /></>}
              </MagneticButton>
            </form>

            <p className="text-sm text-muted-foreground mt-6 text-center">
              Already have an account?{" "}
              <Link to="/patient/login" className="text-primary font-medium hover:underline">Sign in</Link>
            </p>
          </motion.div>
        )}

        {step === 1 && (
          <motion.div key="otp"
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}>
            <h1 className="text-2xl font-extrabold text-foreground mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Check your email
            </h1>
            <p className="text-sm text-muted-foreground mb-8">
              We sent a 6-digit code to{" "}
              <span className="text-foreground font-medium">{form.email}</span>
            </p>

            <form onSubmit={handleOTP} className="flex flex-col gap-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Verification code</label>
                <input
                  type="text" required maxLength={6} placeholder="000000"
                  value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g, ""))}
                  className="w-full px-4 py-3 bg-muted rounded-xl border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all text-center tracking-[0.5em] text-xl font-bold"
                />
              </div>

              {error && (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="text-sm text-red-500 bg-red-50 dark:bg-red-950/20 px-3 py-2 rounded-lg border border-red-200 dark:border-red-800/30">
                  {error}
                </motion.p>
              )}

              <MagneticButton type="submit" disabled={loading || otp.length < 6}
                className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50 mt-1">
                {loading ? <><Loader2 size={16} className="animate-spin" /> Verifying…</> : "Verify & continue"}
              </MagneticButton>
            </form>

            <p className="text-sm text-muted-foreground mt-4 text-center">
              Didn't receive it?{" "}
              <button onClick={() => api.post("/auth/patient/resend-otp", { email: form.email })}
                className="text-primary font-medium hover:underline cursor-pointer">
                Resend code
              </button>
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </AuthLayout>
  );
}