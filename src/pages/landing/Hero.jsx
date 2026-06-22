import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Stethoscope } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: i * 0.1 },
  }),
};

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-teal-900 text-white">
      {/* subtle radial glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(27,107,97,0.7) 0%, transparent 70%)",
        }}
      />
      {/* grid texture */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.6) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.6) 1px,transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative max-w-5xl mx-auto px-6 pt-28 pb-24 flex flex-col items-center text-center">
        {/* badge */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={0}
          className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-xs font-mono uppercase tracking-widest text-white/70 mb-8 backdrop-blur-sm"
        >
          <Stethoscope size={12} />
          AI in Medicine · Oyo State, July 2026
        </motion.div>

        {/* headline */}
        <motion.h1
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={1}
          className="text-4xl sm:text-5xl lg:text-6xl font-display font-semibold leading-tight max-w-3xl mb-6"
        >
          One doctor per{" "}
          <span className="relative inline-block">
            <span className="relative z-10 text-clay">3,474 people.</span>
            <span
              aria-hidden
              className="absolute inset-x-0 bottom-1 h-3 bg-clay/20 rounded-sm -z-0"
            />
          </span>
          <br />
          We're making every one count.
        </motion.h1>

        {/* sub */}
        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={2}
          className="text-base sm:text-lg text-white/60 max-w-xl leading-relaxed mb-10"
        >
          BetaCare puts AI-powered triage in the hands of patients across WhatsApp,
          USSD, voice, and web — so the doctors we have can reach further than ever before.
        </motion.p>

        {/* CTAs */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={3}
          className="flex flex-col sm:flex-row items-center gap-3"
        >
          <Link
            to="/signup"
            className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-teal-900 hover:bg-teal-100 transition-colors"
          >
            Get started free <ArrowRight size={16} />
          </Link>
          <Link
            to="/doctor/login"
            className="inline-flex items-center gap-2 rounded-xl border border-white/20 px-6 py-3 text-sm font-medium text-white/80 hover:bg-white/10 transition-colors"
          >
            Doctor log in
          </Link>
        </motion.div>

        {/* app mockup */}
        <motion.div
          initial={{ opacity: 0, y: 48 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.5 }}
          className="mt-20 w-full max-w-2xl mx-auto"
        >
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden shadow-2xl">
            {/* fake browser bar */}
            <div className="flex items-center gap-1.5 px-4 py-3 border-b border-white/10 bg-white/5">
              <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
              <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
              <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
              <span className="ml-3 flex-1 rounded-md bg-white/10 h-5 max-w-xs text-[10px] font-mono text-white/30 flex items-center px-2">
                betacare.app/patient/dashboard
              </span>
            </div>
            {/* mock dashboard content */}
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-8 w-8 rounded-lg bg-teal-700/60 flex items-center justify-center">
                  <Stethoscope size={14} className="text-white/70" />
                </div>
                <div className="h-4 w-28 rounded bg-white/15" />
              </div>

              <div className="rounded-xl bg-white/8 border border-white/10 p-4">
                <div className="h-3 w-24 rounded bg-white/20 mb-3" />
                <div className="rounded-lg bg-white/10 p-3 space-y-1.5">
                  <div className="h-2.5 w-full rounded bg-white/15" />
                  <div className="h-2.5 w-4/5 rounded bg-white/15" />
                  <div className="h-2.5 w-3/5 rounded bg-white/10" />
                </div>
                <div className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-teal-700/70 px-4 py-2">
                  <div className="h-2.5 w-20 rounded bg-white/40" />
                </div>
              </div>

              <div className="rounded-xl bg-amber-100/10 border border-amber/20 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="h-2 w-2 rounded-full bg-amber" />
                  <div className="h-3 w-24 rounded bg-white/25" />
                </div>
                <div className="space-y-1.5">
                  <div className="h-2.5 w-full rounded bg-white/10" />
                  <div className="h-2.5 w-3/4 rounded bg-white/10" />
                </div>
                <div className="mt-3 h-2.5 w-10 rounded bg-clay/30" />
              </div>

              <div className="flex gap-2 pt-1">
                {["WhatsApp", "USSD", "Voice", "Web"].map((ch) => (
                  <span
                    key={ch}
                    className="rounded-full border border-white/10 bg-white/8 px-2.5 py-1 text-[10px] font-mono text-white/40"
                  >
                    {ch}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}