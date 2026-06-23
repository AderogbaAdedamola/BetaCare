import { motion } from "framer-motion";

export default function Approach() {
  return (
    <section className="bg-paper">
      <div className="max-w-5xl mx-auto px-8 py-28">

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <p className="text-[11px] font-mono uppercase tracking-[0.18em] text-clay mb-4">
            Our approach
          </p>
          <h2 className="text-4xl font-display font-semibold text-ink max-w-xl leading-snug">
            Inclusion as infrastructure, not an afterthought.
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative rounded-2xl overflow-hidden h-64 sm:h-80 mb-16"
        >
          <img
            src="https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=1200&q=80&fit=crop"
            alt="Healthcare workers"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-teal-900/80 to-transparent" />
          <div className="absolute inset-0 flex items-center px-10">
            <p className="text-2xl sm:text-3xl font-display font-semibold text-white max-w-sm leading-snug">
              "Solutions can't be Silicon Valley designs dropped into a different reality."
            </p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {[
            {
              label: "Not a replacement",
              body: "AI handles the filtering. The doctor remains the decision-maker — their time just reaches more people.",
            },
            {
              label: "Channels as access",
              body: "USSD and voice aren't fallbacks — they're the primary channel for millions who don't have reliable data or smartphones.",
            },
            {
              label: "Evidence-led",
              body: "98% TB detection accuracy. 74.7% out-of-pocket. 1:3,474 doctors. The numbers make the case — not adjectives.",
            },
          ].map((pt, i) => (
            <motion.div
              key={pt.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="border-t-2 border-teal-900 pt-5"
            >
              <p className="text-sm font-semibold text-ink mb-2">{pt.label}</p>
              <p className="text-sm text-ink/55 leading-relaxed">{pt.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}