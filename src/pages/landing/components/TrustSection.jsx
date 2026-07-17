import { motion } from "motion/react";
import { Lock, Shield, Users, Zap } from "lucide-react";
import { useTranslation } from "react-i18next";

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

const stagger = { visible: { transition: { staggerChildren: 0.1 } } };

export function TrustSection() {
  const { t } = useTranslation();

  const pillars = [
    {
      icon: Lock,
      title: t('trust.pillars.0.title'),
      desc: t('trust.pillars.0.desc'),
    },
    {
      icon: Shield,
      title: t('trust.pillars.1.title'),
      desc: t('trust.pillars.1.desc'),
    },
    {
      icon: Users,
      title: t('trust.pillars.2.title'),
      desc: t('trust.pillars.2.desc'),
    },
    {
      icon: Zap,
      title: t('trust.pillars.3.title'),
      desc: t('trust.pillars.3.desc'),
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
            {t('trust.title')}
          </h2>
          <p className="text-muted-foreground">{t('trust.desc')}</p>
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
