import { motion } from "motion/react";
import { FileText, AlertTriangle, Activity } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

const stagger = { visible: { transition: { staggerChildren: 0.1 } } };

export function ProblemSection() {
  const problems = [
    {
      icon: FileText,
      title: "Paper records get lost",
      description: "Thousands arrive at hospital only to find their case notes missing — forcing them to restart consultations entirely.",
    },
    {
      icon: AlertTriangle,
      title: "Physical damage is irreversible",
      description: "Fires, floods, and daily wear destroy medical history. No backup, no recovery, no continuity of care.",
    },
    {
      icon: Activity,
      title: "No continuity across hospitals",
      description: "Different hospitals have no visibility into prior treatment — leading to duplicate tests and dangerous care gaps.",
    },
  ];

  return (
    <section className="py-24 bg-foreground text-card overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid lg:grid-cols-2 gap-16 items-center"
        >
          <motion.div variants={fadeUp}>
            <span className="inline-block px-3 py-1 bg-accent/20 text-accent rounded-full text-sm font-semibold mb-4">
              The Problem
            </span>
            <h2
              className="text-4xl lg:text-5xl font-extrabold leading-tight mb-6"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              Nigeria&apos;s healthcare records are <span className="text-accent">broken.</span>
            </h2>
            <p className="text-card/70 text-lg leading-relaxed">
              Hospitals like UCH still rely on paper to track patient history. The consequences range from inconvenient
              to life-threatening.
            </p>
          </motion.div>
          <div className="flex flex-col gap-5">
            {problems.map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, x: 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.12, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                  whileHover={{ x: 6 }}
                  className="flex gap-4 p-5 rounded-xl bg-card/5 border border-card/10 hover:bg-card/8 transition-colors cursor-default"
                >
                  <div className="w-11 h-11 rounded-lg bg-accent/15 flex items-center justify-center text-accent shrink-0">
                    <Icon size={20} />
                  </div>
                  <div>
                    <p
                      className="font-semibold text-card mb-1"
                      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                    >
                      {item.title}
                    </p>
                    <p className="text-sm text-card/65 leading-relaxed">{item.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
