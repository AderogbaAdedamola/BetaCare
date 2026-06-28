import { Link } from "react-router";
import { motion } from "motion/react";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { BetaCareLogo } from "../common/BetaCareLogo";

const trustPoints = [
  "Free forever for patients",
  "NDPR & data protection compliant",
  "End-to-end encrypted records",
  "Works on WhatsApp & SMS",
];

export function AuthLayout({ children, backHref = "/", backLabel = "Back to home", steps, currentStep = 0 }) {
  return (
    <div className="min-h-screen flex">
      {/* LEFT — branding panel, desktop only */}
      <div className="hidden lg:flex lg:w-[42%] xl:w-[38%] bg-foreground flex-col justify-between p-12 relative overflow-hidden shrink-0">
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.6) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.6) 1px,transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        <div
          className="absolute top-1/4 right-0 w-[400px] h-[400px] rounded-full bg-primary/8 blur-3xl pointer-events-none"
        />

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 relative z-10">
          <div className="w-8 h-8 flex items-center justify-center">{BetaCareLogo()}</div>
          <span className="font-bold text-lg text-card" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Beta<span className="text-primary">Care</span>
          </span>
        </Link>

        {/* Center */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10"
        >
          <h2
            className="text-3xl font-extrabold text-card leading-tight mb-8"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            Your health records,
            <br />
            <span className="text-primary">always within reach.</span>
          </h2>
          <ul className="flex flex-col gap-3">
            {trustPoints.map((point, i) => (
              <motion.li
                key={point}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + i * 0.08, duration: 0.5 }}
                className="flex items-center gap-3 text-card/65 text-sm"
              >
                <CheckCircle2 size={15} className="text-primary shrink-0" />
                {point}
              </motion.li>
            ))}
          </ul>
        </motion.div>

        <p className="text-xs text-card/25 relative z-10">© 2026 BetaCare Technologies Ltd.</p>
      </div>

      {/* RIGHT — form panel */}
      <div className="flex-1 flex flex-col bg-background min-h-screen">
        {/* Top bar */}
        <div className="flex items-center justify-between px-6 sm:px-10 py-6">
          {/* Mobile logo */}
          <Link to="/" className="flex items-center gap-2 lg:hidden">
            <div className="w-7 h-7 flex items-center justify-center">{BetaCareLogo()}</div>
            <span className="font-bold text-base text-foreground" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Beta<span className="text-primary">Care</span>
            </span>
          </Link>
          {/* Desktop back link */}
          <Link
            to={backHref}
            className="hidden lg:inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft size={14} /> {backLabel}
          </Link>
          <div className="hidden lg:block" />
        </div>

        {/* Step indicator */}
        {steps && steps.length > 1 && (
          <div className="px-6 sm:px-10 pb-0">
            <div className="flex items-center gap-1.5 max-w-sm">
              {steps.map((_, i) => (
                <div
                  key={i}
                  className={`h-1 flex-1 rounded-full transition-all duration-400 ${
                    i < currentStep ? "bg-primary" : i === currentStep ? "bg-primary/40" : "bg-border"
                  }`}
                />
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Step {currentStep + 1} of {steps.length} —{" "}
              <span className="text-foreground font-medium">{steps[currentStep]}</span>
            </p>
          </div>
        )}

        {/* Form */}
        <div className="flex-1 flex items-center justify-center px-6 sm:px-10 py-8">
          <div className="w-full max-w-[440px]">{children}</div>
        </div>
      </div>
    </div>
  );
}