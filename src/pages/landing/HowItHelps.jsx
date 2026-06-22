import { motion } from "framer-motion";
import { Filter, ClipboardCheck, Radio } from "lucide-react";

const PILLARS = [
  {
    icon: Filter,
    label: "01",
    title: "AI triage, before the queue",
    body: "Patients describe symptoms in plain language. BetaCare decides what needs a clinic, what needs a hospital, and what just needs rest — instantly, on any channel.",
  },
  {
    icon: ClipboardCheck,
    label: "02",
    title: "Structured history for doctors",
    body: "By the time a patient reaches a doctor, their symptom history, channel interactions, and AI notes are already there. No starting from scratch. Every minute counts.",
  },
  {
    icon: Radio,
    label: "03",
    title: "Built for real constraints",
    body: "WhatsApp, USSD, voice, and web — because data is expensive and power cuts happen. Not a Silicon Valley product dropped into a different market. Designed for it.",
  },
];

export default function HowItHelps() {
  return (
    <section className="bg-teal-900 text-white">
      <div className="max-w-5xl mx-auto px-6 py-24">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mb-14"
        >
          <p className="text-xs font-mono uppercase tracking-widest text-white/40 mb-3">
            How it works
          </p>
          <h2 className="text-3xl sm:text-4xl font-display font-semibold text-white max-w-xl leading-snug">
            Three things that make the difference.
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {PILLARS.map((p, i) => {
            const Icon = p.icon;
            return (
              <motion.div
                key={p.label}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                className="rounded-2xl border border-white/10 bg-white/5 p-6 flex flex-col gap-5 hover:bg-white/8 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center text-white/70">
                    <Icon size={20} strokeWidth={1.75} />
                  </div>
                  <span className="text-xs font-mono text-white/25">{p.label}</span>
                </div>
                <div>
                  <h3 className="text-base font-display font-semibold text-white mb-2">{p.title}</h3>
                  <p className="text-sm text-white/55 leading-relaxed">{p.body}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}