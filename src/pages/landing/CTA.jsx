import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function CTA() {
  return (
    <section className="bg-ink relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background: "radial-gradient(ellipse 70% 80% at 50% 110%, rgba(15,76,69,0.6) 0%, transparent 65%)",
        }}
      />
      <div className="relative max-w-5xl mx-auto px-8 py-32 flex flex-col items-center text-center">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-[11px] font-mono uppercase tracking-[0.2em] text-white/30 mb-6"
        >
          The line doesn't have to stay this long
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          className="text-4xl sm:text-5xl font-display font-semibold text-white leading-tight max-w-xl mb-6"
        >
          Every doctor should reach further.
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="text-base text-white/45 max-w-md leading-relaxed mb-12"
        >
          Check your symptoms and get a clear next step — or log in as a doctor to see your patients' full cross-channel history.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.22 }}
          className="flex flex-col sm:flex-row gap-3"
        >
          <Link
            to="/signup"
            className="group inline-flex items-center gap-2 rounded-xl bg-white px-7 py-3.5 text-sm font-semibold text-ink hover:bg-teal-100 transition-colors"
          >
            Get started
            <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
          <Link
            to="/doctor/login"
            className="inline-flex items-center justify-center rounded-xl border border-white/15 px-7 py-3.5 text-sm font-medium text-white/65 hover:bg-white/8 transition-colors"
          >
            Doctor portal
          </Link>
        </motion.div>
      </div>
    </section>
  );
}