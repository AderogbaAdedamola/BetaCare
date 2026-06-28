import { motion } from "motion/react";
import { Database, Smartphone, Brain, CheckCircle2 } from "lucide-react";
import { TiltCard } from "../../../components/common/TiltCard";

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

const stagger = { visible: { transition: { staggerChildren: 0.1 } } };

export function FeaturesSection() {
  const features = [
    {
      icon: Database,
      label: "Core Feature",
      title: "Digitized Medical Records",
      description:
        "A secure, cloud-backed database preserving your complete medical history — diagnoses, prescriptions, lab results, and doctor notes.",
      points: ["End-to-end encrypted storage", "Compliant with Nigeria data privacy laws", "Lifetime record retention"],
    },
    {
      icon: Smartphone,
      label: "Core Feature",
      title: "Nigerian-Friendly Interface",
      description:
        "BetaCare meets Nigerians on WhatsApp and SMS. No app download. No confusing dashboards. Just the tools they already use.",
      points: ["WhatsApp integration", "SMS for low-connectivity areas", "Available in English & Pidgin"],
    },
    {
      icon: Brain,
      label: "AI-Powered",
      title: "Context-Aware Health Agent",
      description:
        "Our AI builds a health profile for each user — monitoring drug usage, reminding about appointments, and flagging health risks early.",
      points: ["Drug adherence monitoring", "Personalised health tips", "Smart appointment reminders"],
    },
  ];

  return (
    <section id="features" className="py-24 bg-background overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <motion.span
            variants={fadeUp}
            className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-semibold mb-4"
          >
            What BetaCare Does
          </motion.span>
          <h2
            className="text-4xl font-extrabold text-foreground mb-4"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            Everything you need, one platform
          </h2>
          <p className="text-muted-foreground text-lg">
            Built specifically for the Nigerian healthcare context — reliable, secure, and genuinely easy to use.
          </p>
        </motion.div>
        <div className="grid md:grid-cols-3 gap-6">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ delay: i * 0.12, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              >
                <TiltCard className="bg-card rounded-2xl p-7 border border-border hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 flex flex-col h-full cursor-default">
                  <motion.div
                    className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-5"
                    whileHover={{ rotate: 10, scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Icon size={22} />
                  </motion.div>
                  <span className="text-xs font-semibold text-accent uppercase tracking-wide mb-2">
                    {feature.label}
                  </span>
                  <h3
                    className="text-xl font-bold text-foreground mb-3"
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                  >
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-5 flex-1">{feature.description}</p>
                  <ul className="flex flex-col gap-2">
                    {feature.points.map((point) => (
                      <li key={point} className="flex items-start gap-2.5 text-sm text-foreground">
                        <CheckCircle2 size={15} className="text-primary mt-0.5 shrink-0" />
                        {point}
                      </li>
                    ))}
                  </ul>
                </TiltCard>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
