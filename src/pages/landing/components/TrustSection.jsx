import { motion } from "motion/react";
import { Lock, Shield, Users, Zap } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

const stagger = { visible: { transition: { staggerChildren: 0.1 } } };

export function TrustSection() {
  const pillars = [
    {
      icon: Lock,
      title: "End-to-End Encrypted",
      desc: "Your health data is encrypted at rest and in transit. Nobody reads it without your explicit consent.",
    },
    {
      icon: Shield,
      title: "NDPR Compliant",
      desc: "Full compliance with the Nigeria Data Protection Regulation and global health data standards.",
    },
    {
      icon: Users,
      title: "Patient-First Consent",
      desc: "You decide who sees your records. Every access request is logged and visible to you.",
    },
    {
      icon: Zap,
      title: "Always Available",
      desc: "Your records are accessible even during outages via WhatsApp and SMS. No single point of failure.",
    },
  ];

  return (
    <section className="py-20 bg-muted/50 border-y border-border overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2
            className="text-3xl font-extrabold text-foreground mb-3"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            Built on trust
          </h2>
          <p className="text-muted-foreground">Security and privacy are foundational, not afterthoughts.</p>
        </motion.div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                whileHover={{ y: -5 }}
                className="flex flex-col items-center text-center p-6 rounded-2xl bg-card border border-border hover:border-primary/20 hover:shadow-lg transition-all cursor-default"
              >
                <motion.div
                  className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4"
                  whileHover={{ rotate: 8, scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Icon size={22} />
                </motion.div>
                <h3 className="font-bold text-foreground mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  {item.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
