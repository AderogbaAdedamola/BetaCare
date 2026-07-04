import { useState, useEffect } from "react";
import { Link } from "react-router";
import { motion } from "motion/react";
import { ArrowLeft } from "lucide-react";
import { BetaCareLogo } from "../common/BetaCareLogo";

const PANEL_W = 440;

/**
 * Auth layout wrapper.
 * sidePanel     — JSX to render in the left panel (desktop only, fixed)
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
  const [isLargeScreen, setIsLargeScreen] = useState(() => {
    if (typeof window !== "undefined") {
      return window.matchMedia("(min-width: 1024px)").matches;
    }
    return false;
  });

  useEffect(() => {
    const media = window.matchMedia("(min-width: 1024px)");
    const listener = (e) => setIsLargeScreen(e.matches);
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, []);

  return (
    <div className="min-h-screen bg-background">

      {/* ── Left panel: FIXED to viewport, never scrolls ── */}
      {sidePanel && (
        <motion.div
          className="hidden lg:block fixed top-0 left-0 h-screen overflow-hidden z-20"
          animate={{ width: panelVisible && isLargeScreen ? PANEL_W : 0, opacity: panelVisible && isLargeScreen ? 1 : 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          style={{ pointerEvents: panelVisible && isLargeScreen ? "auto" : "none" }}
        >
          <div style={{ width: PANEL_W }} className="h-full">
            {sidePanel}
          </div>
        </motion.div>
      )}

      {/* ── Right panel: offset by panel width, scrolls normally ── */}
      <motion.div
        className="flex flex-col min-h-screen"
        animate={{ marginLeft: sidePanel && panelVisible && isLargeScreen ? PANEL_W : 0 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      >
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


        {/* Form content */}
        <div className="flex-1 flex items-start justify-center px-6 sm:px-10 py-10">
          <div className="w-full max-w-[480px]">{children}</div>
        </div>
      </motion.div>
    </div>
  );
}