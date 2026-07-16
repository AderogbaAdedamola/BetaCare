import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import { motion } from "motion/react";
import { Eye, EyeOff, Loader2, KeyRound, ArrowRight } from "lucide-react";
import { AuthLayout } from "../../components/auth/AuthLayout";
import { MagneticButton } from "../../components/common/MagneticButton";
import { api } from "../../lib/api";

export default function PasswordReset() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const role = searchParams.get("role") || "doctor";
  
  const [step, setStep] = useState(0); // 0 = request, 1 = confirm
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [showPw, setShowPw] = useState(false);
  
  const [form, setForm] = useState({
    identifier: "",
    otp: "",
    newPassword: ""
  });
  const [resetId, setResetId] = useState("");

  const update = f => e => setForm(p => ({ ...p, [f]: e.target.value }));

  async function handleRequestSubmit(e) {
    e.preventDefault();
    if (!form.identifier) return;
    
    setError("");
    setLoading(true);
    try {
      const data = await api.post("/auth/password/reset-request", {
        identifier: form.identifier,
        role
      });
      setResetId(data.reset_id || "mock_reset_id");
      setStep(1);
    } catch (err) {
      setError(err.message || "Failed to initiate reset.");
    } finally {
      setLoading(false);
    }
  }

  async function handleConfirmSubmit(e) {
    e.preventDefault();
    if (!form.otp || !form.newPassword) return;

    setError("");
    setLoading(true);
    try {
      await api.post("/auth/password/reset-confirm", {
        reset_id: resetId,
        otp: form.otp,
        new_password: form.newPassword
      });
      setSuccess(true);
      setTimeout(() => {
        navigate(`/${role}/login`);
      }, 2000);
    } catch (err) {
      setError(err.message || "Invalid OTP or request failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout panelVisible={false}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-semibold mb-5">
          <KeyRound size={12} /> Password Recovery
        </div>
        <h1 className="text-2xl font-extrabold text-foreground mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          Reset your password
        </h1>
        <p className="text-sm text-muted-foreground mb-8">
          {step === 0 
            ? "Enter your email address or username to receive a recovery code." 
            : "Enter the 6-digit code sent to your email and set a new password."}
        </p>

        {success ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6 bg-green-500/10 border border-green-500/20 rounded-xl text-center">
            <h3 className="text-green-600 font-bold mb-2">Password Reset Successful!</h3>
            <p className="text-sm text-green-700/80 mb-4">Redirecting you to login...</p>
            <Loader2 className="animate-spin text-green-600 mx-auto" size={24} />
          </motion.div>
        ) : step === 0 ? (
          <form onSubmit={handleRequestSubmit} className="flex flex-col gap-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Email address or Username</label>
              <input type="text" required placeholder="you@example.com" value={form.identifier} onChange={update("identifier")}
                className="w-full px-4 py-3 bg-muted rounded-xl border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all" />
            </div>

            {error && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="text-sm text-red-500 bg-red-50 dark:bg-red-950/20 px-3 py-2 rounded-lg border border-red-200 dark:border-red-800/30">
                {error}
              </motion.p>
            )}

            <MagneticButton type="submit" disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50 mt-1">
              {loading ? <><Loader2 size={16} className="animate-spin" /> Sending...</> : <>Send Code <ArrowRight size={16} /></>}
            </MagneticButton>
          </form>
        ) : (
          <form onSubmit={handleConfirmSubmit} className="flex flex-col gap-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">6-Digit Code</label>
              <input type="text" required placeholder="123456" maxLength={6} value={form.otp} onChange={update("otp")}
                className="w-full px-4 py-3 bg-muted rounded-xl border border-border text-foreground placeholder:text-muted-foreground text-center tracking-[0.5em] text-lg font-mono focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all" />
            </div>
            
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">New Password</label>
              <div className="relative">
                <input type={showPw ? "text" : "password"} required placeholder="••••••••" value={form.newPassword} onChange={update("newPassword")}
                  className="w-full px-4 py-3 bg-muted rounded-xl border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all pr-11" />
                <button type="button" onClick={() => setShowPw(p => !p)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="text-sm text-red-500 bg-red-50 dark:bg-red-950/20 px-3 py-2 rounded-lg border border-red-200 dark:border-red-800/30">
                {error}
              </motion.p>
            )}

            <MagneticButton type="submit" disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50 mt-1">
              {loading ? <><Loader2 size={16} className="animate-spin" /> Resetting...</> : "Reset Password"}
            </MagneticButton>
          </form>
        )}

        {!success && (
          <div className="mt-6 flex justify-center">
            <Link to={`/${role}/login`} className="text-sm font-medium text-muted-foreground hover:text-foreground hover:underline transition-colors">
              Return to login
            </Link>
          </div>
        )}
      </motion.div>
    </AuthLayout>
  );
}
