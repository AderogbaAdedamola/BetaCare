import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { useNavigate } from "react-router";
import { ArrowRight, Heart, MessageSquare, Shield, Zap } from "lucide-react";
import { MagneticButton } from "../../../components/common/MagneticButton";
import { TiltCard } from "../../../components/common/TiltCard";
import { RevealWords } from "./RevealWords";
import { Marquee } from "./Marquee";
import { useTranslation } from "react-i18next";

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

const stagger = { visible: { transition: { staggerChildren: 0.1 } } };

export function HeroSection({ onGetStarted }) {
  const { t } = useTranslation();
  const heroRef = useRef(null);
  const { scrollY } = useScroll();
  const bgY = useTransform(scrollY, [0, 600], [0, -100]);
  const contentY = useTransform(scrollY, [0, 600], [0, -60]);
  const cardY = useTransform(scrollY, [0, 600], [0, -40]);
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0]);
  const navigate = useNavigate();

  const cardFields = [
    { label: t("hero.bloodType", { defaultValue: "Blood Type" }), value: "O+" },
    { label: t("hero.age", { defaultValue: "Age" }), value: "34 yrs" },
    { label: t("hero.lastVisit", { defaultValue: "Last Visit" }), value: "Jun 18, 2026" },
    { label: t("hero.nextAppt", { defaultValue: "Next Appt." }), value: "Jul 02, 2026" },
  ];
  const diagnoses = [
    { name: "Malaria", date: "Jun 18", status: t("hero.statusTreated", { defaultValue: "Treated" }) },
    { name: "Hypertension", date: "Mar 04", status: t("hero.statusOngoing", { defaultValue: "Ongoing" }) },
  ];

  return (
    <section ref={heroRef} className="relative min-h-screen flex flex-col items-center overflow-hidden pt-16">
      {/* Parallax background */}
      <motion.div style={{ y: bgY }} className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-0 opacity-25"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, rgba(11,107,64,0.15) 1px, transparent 0)",
            backgroundSize: "40px 40px",
          }}
        />
        <motion.div
          className="absolute top-1/4 right-0 w-[700px] h-[700px] rounded-full bg-primary/5 blur-3xl"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full bg-accent/6 blur-3xl"
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 13, repeat: Infinity, ease: "easeInOut", delay: 3 }}
        />
      </motion.div>

      <div className="relative max-w-7xl mx-auto px-6 w-full grid lg:grid-cols-2 gap-12 items-center pt-16 pb-8 flex-1">
        {/* Left copy */}
        <motion.div style={{ y: contentY, opacity: heroOpacity }} className="flex flex-col gap-6 max-w-xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <motion.span
              className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-semibold"
              animate={{
                boxShadow: [
                  "0 0 0 0 rgba(11,107,64,0)",
                  "0 0 0 6px rgba(11,107,64,0.08)",
                  "0 0 0 0 rgba(11,107,64,0)",
                ],
              }}
              transition={{ duration: 2.5, repeat: Infinity }}
            >
              <Zap size={13} className="fill-current" />
              {t("hero.badge")}
            </motion.span>
          </motion.div>

          <h1
            className="text-5xl lg:text-6xl font-extrabold text-foreground leading-[1.1] tracking-tight overflow-hidden"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            <RevealWords text={t("hero.titlePart1")} />{" "}
            <span className="text-primary">
              <RevealWords text={t("hero.titleHighlight")} />
            </span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="text-lg text-muted-foreground leading-relaxed"
          >
            {t("hero.desc")}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.85, duration: 0.5 }}
            className="flex flex-wrap gap-3"
          >
            <MagneticButton
              onClick={onGetStarted}
              className="flex items-center gap-2 px-6 py-3.5 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 transition-colors hover:shadow-lg hover:shadow-primary/20"
            >
              {t("hero.ctaPrimary")} <ArrowRight size={16} />
            </MagneticButton>
            <MagneticButton
              href="#how-it-works"
              className="flex items-center gap-2 px-6 py-3.5 border-2 border-border text-foreground font-semibold rounded-xl hover:border-primary/40 hover:bg-secondary transition-all"
            >
              {t("hero.ctaSecondary")}
            </MagneticButton>
          </motion.div>
        </motion.div>

        {/* Right — floating mockup */}
        <motion.div
          style={{ y: cardY }}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative flex justify-center lg:justify-end"
        >
          <div className="relative w-full max-w-md">
            <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}>
              <TiltCard className="bg-card rounded-2xl shadow-2xl border border-border p-6">
                <div className="absolute top-4 left-4 flex items-center gap-2 bg-background/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-border shadow-sm text-xs font-semibold">
                  <Shield size={12} className="text-primary" />
                  {t("hero.patientBadge", { defaultValue: "Patient Record" })}
                </div>
                <div className="flex items-center justify-between mb-4 pt-8">
                  <div>
                    <h3 className="font-bold text-foreground text-lg">
                      {t("hero.patientName", { defaultValue: "Adaeze Okonkwo" })}
                    </h3>
                  </div>
                  <motion.div
                    className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm"
                    whileHover={{ scale: 1.1 }}
                  >
                    AO
                  </motion.div>
                </div>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  {cardFields.map((item) => (
                    <div key={item.label} className="bg-muted rounded-lg p-3">
                      <p className="text-xs text-muted-foreground">{item.label}</p>
                      <p className="text-sm font-semibold text-foreground mt-0.5">{item.value}</p>
                    </div>
                  ))}
                </div>
                <div className="border-t border-border pt-4">
                  <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                    <Heart size={14} className="text-destructive" />
                    {t("hero.diagnoses", { defaultValue: "Recent Diagnoses" })}
                  </h4>
                  {diagnoses.map((item) => (
                    <div key={item.name} className="flex items-center justify-between py-1.5">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-2 h-2 rounded-full ${item.status === "Treated" ? "bg-primary" : "bg-accent"}`}
                        />
                        <span className="text-sm text-foreground">{item.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">{item.date}</span>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                            item.status === "Treated"
                              ? "bg-primary/10 text-primary"
                              : "bg-accent/15 text-accent-foreground"
                          }`}
                        >
                          {item.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </TiltCard>
            </motion.div>

            {/* Floating AI badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.7, x: 20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ delay: 1.1, type: "spring", stiffness: 180 }}
              className="absolute -bottom-5 -left-5 bg-card border border-border rounded-xl shadow-lg p-3.5 flex items-center gap-3 max-w-[230px]"
              style={{ y: useTransform(scrollY, [0, 600], [0, 20]) }}
            >
              <motion.div
                className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0"
                animate={{ scale: [1, 1.08, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <MessageSquare size={16} />
              </motion.div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-primary">{t("hero.aiBadge", { defaultValue: "AI Health Agent" })}</span>
                  <span className="text-xs text-muted-foreground">{t("hero.aiDesc", { defaultValue: "Time for your BP check!" })}</span>
                </div>
            </motion.div>

            {/* Encrypted badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.3, type: "spring", stiffness: 180 }}
              className="absolute -top-4 -right-4 bg-primary text-primary-foreground rounded-xl shadow-lg p-3 flex items-center gap-2"
            >
              <Shield size={14} />
              <span className="text-xs font-semibold">{t("hero.encryptedBadge", { defaultValue: "Encrypted" })}</span>
            </motion.div>
          </div>
        </motion.div>
      </div>

        <Marquee items={t("hero.marquee", { returnObjects: true }) || []} />
    </section>
  );
}
