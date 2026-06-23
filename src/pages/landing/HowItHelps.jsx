import { motion } from "framer-motion";
import { Filter, ClipboardCheck, Radio } from "lucide-react";

const PILLARS = [
  {
    icon: Filter,
    n: "01",
    title: "AI triage, before the queue",
    body: "Patients describe symptoms in plain language across any channel. BetaCare classifies urgency instantly — clinic, hospital, or just rest. The queue shrinks before it forms.",
  },
  {
    icon: ClipboardCheck,
    n: "02",
    title: "Structured history, ready on arrival",
    body: "When a patient finally reaches a doctor, their full symptom history is already there — cross-channel, structured, searchable. No starting from scratch. Every minute counts.",
  },
  {
    icon: Radio,
    n: "03",
    title: "Built for real infrastructure",
    body: "WhatsApp, USSD, voice call, and web. Not because it's clever — because data is expensive, power cuts happen, and the patients who need this most are the ones a standard app misses.",
  },
];

export default function HowItHelps() {
  return (
    <section className="bg-ink overflow-hidden">
      <div className="max-w-5xl mx-auto px-8 py-28">

        <div className="flex items-end justify-between mb-16">
          <div>
            <p className="text-[11px] font-mono uppercase tracking-[0.18em] text-white/30 mb-4">
              How it works
            </p>
            <h2 className="text-4xl font-display font-semibold text-white leading-tight max-w-sm">
              Three moves. Real impact.
            </h2>
          </div>
          <p className="hidden lg:block text-sm text-white/35 max-w-xs text-right leading-relaxed">
            Each one addresses a specific failure point in the current system.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/8 rounded-2xl overflow-hidden">
          {PILLARS.map((p, i) => {
            const Icon = p.icon;
            return (
              <motion.div
                key={p.n}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-ink p-8 flex flex-col gap-8 group hover:bg-teal-900/40 transition-colors duration-300"
              >
                <div className="flex items-start justify-between">
                  <div className="h-11 w-11 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center text-white/60 group-hover:border-teal-700/50 group-hover:text-white/90 transition-colors">
                    <Icon size={20} strokeWidth={1.6} />
                  </div>
                  <span className="text-[11px] font-mono text-white/20">{p.n}</span>
                </div>
                <div>
                  <h3 className="text-base font-display font-semibold text-white mb-3 leading-snug">
                    {p.title}
                  </h3>
                  <p className="text-sm text-white/45 leading-relaxed">{p.body}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}