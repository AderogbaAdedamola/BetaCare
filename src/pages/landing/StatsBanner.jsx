import { motion } from "framer-motion";

const STATS = [
  { value: "1 : 3,474", label: "Doctor-to-patient ratio in Nigeria", sub: "WHO recommends 1 : 600" },
  { value: "74.7%", label: "Pay for healthcare fully out of pocket", sub: "No insurance safety net" },
  { value: "< 18%", label: "Hospitals using electronic records", sub: "Most history exists nowhere" },
  { value: "98%+", label: "AI accuracy on TB detection", sub: "This category of tech works" },
];

export default function StatsBanner() {
  return (
    <section className="bg-white border-b border-line">
      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-10">
          {STATS.map((s, i) => (
            <motion.div
              key={s.value}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="text-3xl font-display font-semibold text-teal-900 mb-1">{s.value}</p>
              <p className="text-sm font-medium text-ink leading-snug mb-0.5">{s.label}</p>
              <p className="text-xs text-ink/40">{s.sub}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}