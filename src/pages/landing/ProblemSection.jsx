import { motion } from "framer-motion";

export default function ProblemSection() {
  return (
    <section className="max-w-5xl mx-auto px-6 py-24">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="text-xs font-mono uppercase tracking-widest text-clay mb-5">
            The real problem
          </p>
          <h2 className="text-3xl sm:text-4xl font-display font-semibold text-ink leading-snug mb-6">
            Training more doctors takes years we don't have.
          </h2>
          <div className="border-l-2 border-teal-900 pl-5">
            <p className="text-base text-ink/70 leading-relaxed italic">
              "The gap won't close by training doctors faster. It closes by making the ones we already have reach further."
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
          className="space-y-6"
        >
          {[
            {
              heading: "The shortage is structural.",
              body: "Nigeria has roughly one health facility per 5,475 people. A patient can spend a day traveling for a fifteen-minute consult that could have been a symptom check.",
            },
            {
              heading: "The technology already works.",
              body: "AI models detect tuberculosis from X-rays at over 98% accuracy, outperforming specialists at volume. This isn't hype — it's a clinical category that's been validated.",
            },
            {
              heading: "BetaCare doesn't replace doctors.",
              body: "It filters who actually needs one. The doctor's attention lands where it's needed, not spread thin across a queue full of cases that didn't need a hospital bed.",
            },
          ].map((item, i) => (
            <motion.div
              key={item.heading}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 + i * 0.1 }}
              className="flex gap-4"
            >
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-900" />
              <div>
                <p className="text-sm font-semibold text-ink mb-1">{item.heading}</p>
                <p className="text-sm text-ink/60 leading-relaxed">{item.body}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}