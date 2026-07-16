import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { motion } from "motion/react";
import { Eye, EyeOff, Loader2, Building2 } from "lucide-react";
import { AuthLayout } from "../../../components/auth/AuthLayout";
import { MagneticButton } from "../../../components/common/MagneticButton";
import { HospitalLoginPanel } from "../../../components/auth/AuthSidePanel";
import { api, setSession } from "../../../lib/api";

export default function HospitalLogin() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const update = f => e => setForm(p => ({ ...p, [f]: e.target.value }));

  async function handleSubmit(e) {
    e.preventDefault();
    setError(""); setLoading(true);
    
    // Simulate slight network delay
    setTimeout(async () => {
      try {
        // Commenting out the real API call
        // const data = await api.post("/auth/hospital/login", form);
        
        // Mock pending state if user types 'pending'
        if (form.email.toLowerCase().includes("pending")) {
          setError("Your hospital account is not approved yet. Please contact us if it has been more than 2 working days.");
          setLoading(false);
          return;
        }

        // Allow any other input to successfully log in
        setSession("mock_hospital_token", "admin");
        navigate("/hospital/dashboard");
      } catch (err) {
        setError(err.message || "Incorrect credentials.");
      } finally { 
        setLoading(false); 
      }
    }, 500);
  }

  return (
    <AuthLayout sidePanel={<HospitalLoginPanel />} panelVisible={true}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-semibold mb-5">
          <Building2 size={12} /> Hospital Portal
        </div>
        <h1 className="text-2xl font-extrabold text-foreground mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          Hospital sign in
        </h1>
        <p className="text-sm text-muted-foreground mb-8">
          Sign in to manage your hospital's BetaCare integration
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">Admin email</label>
            <input type="email" required placeholder="admin@yourhospital.ng" value={form.email} onChange={update("email")}
              className="w-full px-4 py-3 bg-muted rounded-xl border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all" />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">Password</label>
            <div className="relative">
              <input type={showPw ? "text" : "password"} required placeholder="••••••••" value={form.password} onChange={update("password")}
                className="w-full px-4 py-3 bg-muted rounded-xl border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all pr-11" />
              <button type="button" onClick={() => setShowPw(p => !p)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <div className="flex justify-end mt-1.5">
              <Link to="/password-reset?role=hospital" className="text-xs text-primary font-medium hover:underline">Forgot password?</Link>
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
            {loading ? <><Loader2 size={16} className="animate-spin" /> Signing in…</> : "Sign in"}
          </MagneticButton>
        </form>

        <p className="text-sm text-muted-foreground mt-6 text-center">
          Not registered?{" "}
          <Link to="/hospital/register" className="text-primary font-medium hover:underline">Apply for integration</Link>
        </p>
        <div className="flex items-center gap-3 mt-5">
          <div className="flex-1 h-px bg-border" />
          <span className="text-xs text-muted-foreground">or sign in as</span>
          <div className="flex-1 h-px bg-border" />
        </div>
        <div className="flex gap-2 mt-3">
          <Link to="/patient/login" className="flex-1 text-center py-2.5 text-xs font-medium border border-border rounded-xl text-muted-foreground hover:border-primary/30 hover:text-foreground transition-all">
            Patient
          </Link>
          <Link to="/doctor/login" className="flex-1 text-center py-2.5 text-xs font-medium border border-border rounded-xl text-muted-foreground hover:border-primary/30 hover:text-foreground transition-all">
            Doctor
          </Link>
        </div>
      </motion.div>
    </AuthLayout>
  );
}
