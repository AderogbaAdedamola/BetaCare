import { motion } from "framer-motion";

const STATS = [
  { value: "1 : 3,474", label: "Doctor-to-patient ratio", sub: "WHO recommends 1 : 600" },
  { value: "74.7%", label: "Pay fully out of pocket", sub: "No insurance safety net" },
  { value: "< 18%", label: "Hospitals on EMR", sub: "Most history exists nowhere" },
  { value: "98%+", label: "AI TB detection accuracy", sub: "Clinical validation, not hype" },
];

export default function StatsBanner() {
  return (
    <section className="border-y border-white/8 bg-ink/95">
      <div className="max-w-5xl mx-auto px-8 py-12">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {STATS.map((s, i) => (
            <motion.div
              key={s.value}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.07 }}
              className="border-l border-white/10 pl-5 first:border-l-0 first:pl-0"
            >
              <p className="text-2xl font-display font-semibold text-white mb-0.5">{s.value}</p>
              <p className="text-xs font-medium text-white/50 leading-snug">{s.label}</p>
              <p className="text-[11px] text-white/25 mt-0.5">{s.sub}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}