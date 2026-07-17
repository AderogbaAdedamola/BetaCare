import { motion } from "motion/react";
import { User, Stethoscope, Building2 } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../../../components/ui/tabs";
import { useTranslation } from "react-i18next";

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

const stagger = { visible: { transition: { staggerChildren: 0.1 } } };

export function HowItWorksSection() {
  const { t } = useTranslation();

  const tabs = [
    {
      id: "patient",
      label: t('howItWorks.tabs.patient.label'),
      icon: User,
      steps: [
        { step: "01", title: t('howItWorks.tabs.patient.steps.0.title'), desc: t('howItWorks.tabs.patient.steps.0.desc') },
        { step: "02", title: t('howItWorks.tabs.patient.steps.1.title'), desc: t('howItWorks.tabs.patient.steps.1.desc') },
        { step: "03", title: t('howItWorks.tabs.patient.steps.2.title'), desc: t('howItWorks.tabs.patient.steps.2.desc') },
      ],
    },
    {
      id: "doctor",
      label: t('howItWorks.tabs.doctor.label'),
      icon: Stethoscope,
      steps: [
        { step: "01", title: t('howItWorks.tabs.doctor.steps.0.title'), desc: t('howItWorks.tabs.doctor.steps.0.desc') },
        { step: "02", title: t('howItWorks.tabs.doctor.steps.1.title'), desc: t('howItWorks.tabs.doctor.steps.1.desc') },
        { step: "03", title: t('howItWorks.tabs.doctor.steps.2.title'), desc: t('howItWorks.tabs.doctor.steps.2.desc') },
      ],
    },
    {
      id: "hospital",
      label: t('howItWorks.tabs.hospital.label'),
      icon: Building2,
      steps: [
        { step: "01", title: t('howItWorks.tabs.hospital.steps.0.title'), desc: t('howItWorks.tabs.hospital.steps.0.desc') },
        { step: "02", title: t('howItWorks.tabs.hospital.steps.1.title'), desc: t('howItWorks.tabs.hospital.steps.1.desc') },
        { step: "03", title: t('howItWorks.tabs.hospital.steps.2.title'), desc: t('howItWorks.tabs.hospital.steps.2.desc') },
      ],
    },
  ];

  return (
    <section id="how-it-works" className="py-24 bg-secondary/40 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="text-center max-w-2xl mx-auto mb-14"
        >
          <motion.span
            variants={fadeUp}
            className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-semibold mb-4"
          >
            {t('howItWorks.badge')}
          </motion.span>
          <h2
            className="text-4xl font-extrabold text-foreground mb-4"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            {t('howItWorks.title')}
          </h2>
          <p className="text-muted-foreground text-lg">
            {t('howItWorks.desc')}
          </p>
        </motion.div>

        <Tabs defaultValue="patient" className="gap-0">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            <TabsList className="flex gap-2 p-1.5 bg-card border border-border rounded-xl w-fit h-auto mx-auto mb-10">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <TabsTrigger
                    key={tab.id}
                    value={tab.id}
                    className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-lg text-muted-foreground data-[state=active]:bg-primary data-[state=active]:text-primary-foreground border-transparent data-[state=active]:border-transparent transition-all duration-200 cursor-pointer"
                  >
                    <Icon size={15} /> {tab.label}
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </motion.div>
          {tabs.map((tab) => (
            <TabsContent key={tab.id} value={tab.id} className="outline-none">
              <div className="grid md:grid-cols-3 gap-6">
                {tab.steps.map((item, i) => (
                  <motion.div
                    key={item.step}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                    whileHover={{ y: -4 }}
                    className="bg-card rounded-2xl p-7 border border-border relative overflow-hidden"
                  >
                    <span
                      className="absolute top-4 right-5 text-7xl font-extrabold text-foreground/4 select-none pointer-events-none"
                      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                    >
                      {item.step}
                    </span>
                    <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold mb-5">
                      {i + 1}
                    </div>
                    <h3
                      className="text-lg font-bold text-foreground mb-2"
                      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                    >
                      {item.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
                  </motion.div>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
}
