import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { Loader2, ArrowRight, CheckCircle2, Phone, Mail } from "lucide-react";
import { AuthLayout } from "../../components/auth/AuthLayout";
import { MagneticButton } from "../../components/common/MagneticButton";
import { BetaCareLogo } from "../../components/common/BetaCareLogo";
import { api, setSession } from "../../lib/api";

// ── Left panel ──────────────────────────────────────────────────────────────
function LoginSidePanel() {
  return (
    <div className="relative h-full min-h-screen w-full bg-foreground overflow-hidden">
      <img
        src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=900&q=80&fit=crop"
        alt=""
        className="absolute inset-0 w-full h-full object-cover opacity-30"
      />
      <div className="absolute inset-0 bg-gradient-to-br from-foreground/95 via-foreground/80 to-foreground/50" />

      <div className="relative flex flex-col h-full min-h-screen p-10">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 flex items-center justify-center">{BetaCareLogo()}</div>
          <span
            className="font-bold text-lg text-card"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            Beta<span className="text-primary">Care</span>
          </span>
        </div>

        {/* Center */}
        <div className="flex-1 flex items-center">
          <div>
            <h2
              className="text-3xl font-extrabold text-card leading-tight mb-4"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              Welcome back.
              <br />
              <span className="text-primary">Your records are waiting.</span>
            </h2>
            <p className="text-card/50 text-sm leading-relaxed mb-8 max-w-[260px]">
              Your complete medical history — accessible wherever care takes you.
            </p>
            <ul className="flex flex-col gap-3">
              {[
                "No app download needed",
                "Works on WhatsApp & SMS",
                "Secure, encrypted records",
              ].map((p) => (
                <li key={p} className="flex items-center gap-3">
                  <CheckCircle2 size={14} className="text-primary shrink-0" />
                  <span className="text-card/60 text-sm">{p}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom stat */}
        <div className="bg-white/8 backdrop-blur-sm border border-white/10 rounded-2xl p-5">
          <p className="text-xl font-bold text-card mb-0.5">1 in 3,474</p>
          <p className="text-xs text-card/40 leading-relaxed">
            Nigerians per doctor. BetaCare makes every one count further.
          </p>
        </div>
      </div>
    </div>
  );
}

// ── Page ────────────────────────────────────────────────────────────────────

export default function PatientLogin() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [panelVisible, setPanelVisible] = useState(true);
  const [identifierType, setIdentifierType] = useState("phone");
  const [identifier, setIdentifier] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const inputClass =
    "w-full px-4 py-3 bg-muted rounded-xl border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all";

  async function handleRequestOTP(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      // NOTE: confirm exact endpoint with backend — patient OTP-based login initiation
      await api.post("/auth/login/request-otp", {
        identifier,
        identifier_type: identifierType,
      });
      setPanelVisible(false); // ← side panel collapses after first API call
      setStep(1);
    } catch (err) {
      setError(err.message || "We couldn't find that account. Check and try again.");
    } finally {
      setLoading(false);
    }
  }

  // Step 1 — verify OTP and sign in
  async function handleLogin(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await api.post("/auth/login", {
        identifier,
        otp_code: otp,
      });
      setSession(data.access_token, data.role);
      navigate("/patient/dashboard");
    } catch (err) {
      setError(err.message || "Invalid code. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout
      sidePanel={<LoginSidePanel />}
      panelVisible={panelVisible}
      currentStep={step}
    >
      <AnimatePresence mode="wait">
        {/* ── Step 0: Identifier ── */}
        {step === 0 && (
          <motion.div
            key="identifier"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.35 }}
          >
            <h1
              className="text-2xl font-extrabold text-foreground mb-1"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              Sign in to BetaCare
            </h1>
            <p className="text-sm text-muted-foreground mb-8">
              We'll send a quick code to verify it's you — no password needed
            </p>

            <form onSubmit={handleRequestOTP} className="flex flex-col gap-4">
              {/* Phone / Email toggle */}
              <div className="flex gap-1 p-1 bg-muted rounded-xl border border-border">
                {[
                  { id: "phone", label: "Phone", Icon: Phone },
                  { id: "email", label: "Email", Icon: Mail },
                ].map(({ id, label, Icon }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => {
                      setIdentifierType(id);
                      setIdentifier("");
                      setError("");
                    }}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                      identifierType === id
                        ? "bg-background shadow-sm text-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Icon size={14} />
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
                disabled={loading || !identifier}
                className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50 mt-1"
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" /> Sending code…
                  </>
                ) : (
                  <>
                    Send verification code <ArrowRight size={16} />
                  </>
                )}
              </MagneticButton>
            </form>

            <p className="text-sm text-muted-foreground mt-6 text-center">
              New to BetaCare?{" "}
              <Link
                to="/patient/register"
                className="text-primary font-medium hover:underline"
              >
                Create a free account
              </Link>
            </p>

            <div className="flex items-center gap-3 mt-5">
              <div className="flex-1 h-px bg-border" />
              <span className="text-xs text-muted-foreground">sign in as</span>
              <div className="flex-1 h-px bg-border" />
            </div>
            <div className="flex gap-2 mt-3">
              <Link
                to="/doctor/login"
                className="flex-1 text-center py-2.5 text-xs font-medium border border-border rounded-xl text-muted-foreground hover:border-primary/30 hover:text-foreground transition-all"
              >
                Doctor
              </Link>
              <Link
                to="/hospital/login"
                className="flex-1 text-center py-2.5 text-xs font-medium border border-border rounded-xl text-muted-foreground hover:border-primary/30 hover:text-foreground transition-all"
              >
                Hospital
              </Link>
            </div>
          </motion.div>
        )}

        {/* ── Step 1: OTP ── */}
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
              Enter your code
            </h1>
            <p className="text-sm text-muted-foreground mb-8">
              We sent a 6-digit code to{" "}
              <span className="text-foreground font-medium">{identifier}</span>
            </p>

            <form onSubmit={handleLogin} className="flex flex-col gap-4">
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
                    <Loader2 size={16} className="animate-spin" /> Signing in…
                  </>
                ) : (
                  "Sign in"
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
                  api.post("/auth/login/request-otp", {
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
      </AnimatePresence>
    </AuthLayout>
  );
}