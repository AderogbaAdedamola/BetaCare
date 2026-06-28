import { Link } from "react-router";
import { motion } from "motion/react";
import { ArrowLeft } from "lucide-react";
import { BetaCareLogo } from "../common/BetaCareLogo";

/**
 * Auth layout wrapper.
 * sidePanel     — JSX to render in the left panel (desktop only)
 * panelVisible  — controls the slide-in/out animation (false = collapsed to 0)
 * steps         — array of step label strings for progress bar
 * currentStep   — index of the current active step
 */
export function AuthLayout({
  children,
  sidePanel = null,
  panelVisible = false,
  steps = null,
  currentStep = 0,
}) {
  return (
    <div className="min-h-screen flex overflow-hidden">

      {/* ── Left panel: animates width 440 → 0 when panelVisible changes ── */}
      {sidePanel && (
        <motion.div
          className="hidden lg:block shrink-0 overflow-hidden"
          animate={{ width: panelVisible ? 440 : 0, opacity: panelVisible ? 1 : 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Fixed-width inner so content doesn't squish — outer clips it */}
          <div style={{ width: 440 }} className="h-full min-h-screen">
            {sidePanel}
          </div>
        </motion.div>
      )}

      {/* ── Right panel: flex-1 expands naturally as left collapses ── */}
      <div className="flex-1 flex flex-col bg-background min-h-screen">

        {/* Top bar */}
        <div className="flex items-center justify-between px-6 sm:px-10 h-[68px] border-b border-border shrink-0">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-7 h-7 flex items-center justify-center">{BetaCareLogo()}</div>
            <span
              className="font-bold text-base text-foreground"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              Beta<span className="text-primary">Care</span>
            </span>
          </Link>
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft size={14} /> Home
          </Link>
        </div>

        {/* Step progress */}
        {steps && steps.length > 0 && (
          <div className="px-6 sm:px-10 pt-6 max-w-[520px] shrink-0">
            <div className="flex items-center gap-1.5">
              {steps.map((_, i) => (
                <div
                  key={i}
                  className={`h-1 flex-1 rounded-full transition-all duration-500 ${
                    i < currentStep
                      ? "bg-primary"
                      : i === currentStep
                      ? "bg-primary/40"
                      : "bg-border"
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

        {/* Form content */}
        <div className="flex-1 flex items-start justify-center px-6 sm:px-10 py-10 overflow-y-auto">
          <div className="w-full max-w-[480px]">{children}</div>
        </div>
      </div>
    </div>
  );
}