import { motion } from "framer-motion";

export default function ProblemSection() {
  return (
    <section className="bg-paper">
      <div className="max-w-5xl mx-auto px-8 py-28">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-20 items-start">

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="lg:sticky lg:top-24"
          >
            <p className="text-[11px] font-mono uppercase tracking-[0.18em] text-clay mb-6">
              The argument
            </p>
            <h2 className="text-4xl font-display font-semibold text-ink leading-snug mb-8">
              Training more doctors takes years we don't have.
            </h2>
            <blockquote className="border-l-2 border-teal-900 pl-5">
              <p className="text-base text-ink/65 leading-relaxed italic">
                "The gap won't close by training doctors faster. It closes by making the ones we already have reach further."
              </p>
            </blockquote>
          </motion.div>

          <div className="space-y-10">
            {[
              {
                n: "01",
                heading: "The shortage is structural.",
                body: "Nigeria has roughly one health facility per 5,475 people. Patients travel hours for a fifteen-minute consultation that could have been a symptom check.",
              },
              {
                n: "02",
                heading: "The technology already works.",
                body: "AI models detect tuberculosis from X-rays at over 98% accuracy, outperforming specialists at volume. This isn't hype — it's a category that's been clinically validated.",
              },
              {
                n: "03",
                heading: "BetaCare doesn't replace doctors.",
                body: "It filters who actually needs one. The doctor's attention lands where it's needed — not spread across a queue full of cases that didn't need a hospital bed.",
              },
            ].map((item, i) => (
              <motion.div
                key={item.n}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                className="flex gap-6 items-start"
              >
                <span className="shrink-0 text-[11px] font-mono text-ink/25 pt-1">{item.n}</span>
                <div className="border-t border-line pt-5 flex-1">
                  <p className="text-base font-semibold text-ink mb-2">{item.heading}</p>
                  <p className="text-sm text-ink/60 leading-relaxed">{item.body}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}