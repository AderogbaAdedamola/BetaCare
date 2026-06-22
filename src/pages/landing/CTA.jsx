import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function CTA() {
  return (
    <section className="bg-white border-t border-line">
      <div className="max-w-5xl mx-auto px-6 py-24 flex flex-col items-center text-center">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-xs font-mono uppercase tracking-widest text-clay mb-5"
        >
          Try it now
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
          className="text-3xl sm:text-4xl font-display font-semibold text-ink max-w-xl leading-snug mb-4"
        >
          The line doesn't have to stay this long.
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-base text-ink/55 max-w-md leading-relaxed mb-10"
        >
          Check your symptoms, get a clear next step, and let doctors focus
          on the patients who truly need them.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="flex flex-col sm:flex-row items-center gap-3"
        >
          <Link
            to="/signup"
            className="inline-flex items-center gap-2 rounded-xl bg-teal-900 px-6 py-3 text-sm font-semibold text-white hover:bg-teal-700 transition-colors"
          >
            Get started <ArrowRight size={16} />
          </Link>
          <Link
            to="/doctor/login"
            className="inline-flex items-center rounded-xl border border-line px-6 py-3 text-sm font-medium text-ink hover:border-teal-700 transition-colors"
          >
            Doctor log in
          </Link>
        </motion.div>
      </div>
    </section>
  );
}