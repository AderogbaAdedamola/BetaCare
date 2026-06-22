import { motion } from "framer-motion";

const POINTS = [
  {
    label: "Not a replacement",
    body: "BetaCare filters and extends. The doctor remains the decision-maker — AI handles the queue before it forms.",
  },
  {
    label: "Inclusion is infrastructure",
    body: "Every channel (USSD, voice, WhatsApp) exists because a smartphone with stable data isn't a guarantee. That's a design constraint, not a feature.",
  },
  {
    label: "Evidence-led, not hype-led",
    body: "We cite numbers because the numbers are compelling enough. 98% TB detection accuracy. 74.7% out-of-pocket. These speak for themselves.",
  },
];

export default function Approach() {
  return (
    <section className="max-w-5xl mx-auto px-6 py-24">
      <div className="rounded-3xl border border-line bg-white overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="px-8 py-12 border-b lg:border-b-0 lg:border-r border-line"
          >
            <p className="text-xs font-mono uppercase tracking-widest text-clay mb-5">
              Our approach
            </p>
            <h2 className="text-2xl sm:text-3xl font-display font-semibold text-ink leading-snug mb-5">
              Inclusion as a design constraint, not an afterthought.
            </h2>
            <p className="text-sm text-ink/60 leading-relaxed">
              Solutions can't be Silicon Valley designs dropped into a market where power is
              intermittent and internet is a luxury. Every architectural decision in BetaCare
              reflects that reality — because the patients who need this most are the ones
              a standard app would miss.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            className="px-8 py-12 space-y-8"
          >
            {POINTS.map((pt, i) => (
              <motion.div
                key={pt.label}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.15 + i * 0.08 }}
                className="flex gap-4"
              >
                <span className="mt-1 h-5 w-5 shrink-0 rounded-full bg-teal-100 flex items-center justify-center">
                  <span className="h-1.5 w-1.5 rounded-full bg-teal-900" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-ink mb-1">{pt.label}</p>
                  <p className="text-sm text-ink/55 leading-relaxed">{pt.body}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}