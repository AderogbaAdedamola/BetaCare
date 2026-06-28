import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { motion } from "motion/react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { AuthLayout } from "../../components/auth/AuthLayout";
import { MagneticButton } from "../../components/common/MagneticButton";
import { api, setSession } from "../../lib/api";

export default function PatientLogin() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ phone: "", password: "" });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const update = f => e => setForm(p => ({ ...p, [f]: e.target.value }));

  async function handleSubmit(e) {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const data = await api.post("/auth/patient/login", form);
      setSession(data.token, data.role);
      navigate("/patient/dashboard");
    } catch (err) {
      setError(err.message || "Incorrect phone number or password.");
    } finally { setLoading(false); }
  }

  return (
    <AuthLayout>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1
          className="text-2xl font-extrabold text-foreground mb-1"
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        >
          Welcome back
        </h1>
        <p className="text-sm text-muted-foreground mb-8">Sign in to your patient account</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">Phone number</label>
            <input
              type="tel" required placeholder="0803 000 0000"
              value={form.phone} onChange={update("phone")}
              className="w-full px-4 py-3 bg-muted rounded-xl border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">Password</label>
            <div className="relative">
              <input
                type={showPw ? "text" : "password"} required placeholder="••••••••"
                value={form.password} onChange={update("password")}
                className="w-full px-4 py-3 bg-muted rounded-xl border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all pr-11"
              />
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
            className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-1">
            {loading ? <><Loader2 size={16} className="animate-spin" /> Signing in…</> : "Sign in"}
          </MagneticButton>
        </form>

        <p className="text-sm text-muted-foreground mt-6 text-center">
          Don't have an account?{" "}
          <Link to="/patient/register" className="text-primary font-medium hover:underline">Create one free</Link>
        </p>
        <div className="flex items-center gap-3 mt-5">
          <div className="flex-1 h-px bg-border" />
          <span className="text-xs text-muted-foreground">or sign in as</span>
          <div className="flex-1 h-px bg-border" />
        </div>
        <div className="flex gap-2 mt-3">
          <Link to="/doctor/login" className="flex-1 text-center py-2.5 text-xs font-medium border border-border rounded-xl text-muted-foreground hover:border-primary/30 hover:text-foreground transition-all">
            Doctor
          </Link>
          <Link to="/hospital/login" className="flex-1 text-center py-2.5 text-xs font-medium border border-border rounded-xl text-muted-foreground hover:border-primary/30 hover:text-foreground transition-all">
            Hospital
          </Link>
        </div>
      </motion.div>
    </AuthLayout>
  );
}