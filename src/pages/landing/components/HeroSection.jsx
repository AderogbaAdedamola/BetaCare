import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { useNavigate } from "react-router";
import { ArrowRight, Heart, MessageSquare, Shield, Zap } from "lucide-react";
import { MagneticButton } from "../../../components/common/MagneticButton";
import { TiltCard } from "../../../components/common/TiltCard";
import { RevealWords } from "./RevealWords";
import { Marquee } from "./Marquee";

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

const stagger = { visible: { transition: { staggerChildren: 0.1 } } };

export function HeroSection({ onGetStarted }) {
  const heroRef = useRef(null);
  const { scrollY } = useScroll();
  const bgY = useTransform(scrollY, [0, 600], [0, -100]);
  const contentY = useTransform(scrollY, [0, 600], [0, -60]);
  const cardY = useTransform(scrollY, [0, 600], [0, -40]);
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0]);
  const navigate = useNavigate();

  const valuePillars = [
    { icon: "🆓", label: "Free for Patients", sub: "Always" },
    { icon: "📱", label: "No App Download", sub: "Works on WhatsApp & SMS" },
    { icon: "🇳🇬", label: "Built for Nigeria", sub: "NDPR Compliant" },
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
              Nigeria&apos;s Healthcare Record Platform
            </motion.span>
          </motion.div>

          <h1
            className="text-5xl lg:text-6xl font-extrabold text-foreground leading-[1.1] tracking-tight overflow-hidden"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            <RevealWords text="Your Health Records," />{" "}
            <span className="text-primary">
              <RevealWords text="Always Within Reach." />
            </span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="text-lg text-muted-foreground leading-relaxed"
          >
            BetaCare digitizes your medical history so it follows you wherever healthcare takes you — across hospitals,
            across cities, across Nigeria. No more missing case notes. No more starting over.
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
              Get Started Free <ArrowRight size={16} />
            </MagneticButton>
            <MagneticButton
              href="#how-it-works"
              className="flex items-center gap-2 px-6 py-3.5 border-2 border-border text-foreground font-semibold rounded-xl hover:border-primary/40 hover:bg-secondary transition-all"
            >
              See How It Works
            </MagneticButton>
          </motion.div>

          {/* Value pillars */}
          {/* <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.05, duration: 0.5 }}
            className="grid grid-cols-3 gap-3"
          >
            {valuePillars.map((p) => (
              <motion.div
                key={p.label}
                whileHover={{ y: -3 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="flex flex-col items-center text-center p-3 rounded-xl bg-card border border-border"
              >
                <span className="text-xl mb-1">{p.icon}</span>
                <p
                  className="text-xs font-bold text-foreground leading-tight"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                >
                  {p.label}
                </p>
                <p className="text-[10px] text-muted-foreground mt-0.5">{p.sub}</p>
              </motion.div>
            ))}
          </motion.div> */}
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
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Patient Record</p>
                    <p
                      className="font-bold text-foreground mt-0.5"
                      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                    >
                      Adaeze Okonkwo
                    </p>
                  </div>
                  <motion.div
                    className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm"
                    whileHover={{ scale: 1.1 }}
                  >
                    AO
                  </motion.div>
                </div>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  {[
                    { label: "Blood Type", value: "O+" },
                    { label: "Age", value: "34 yrs" },
                    { label: "Last Visit", value: "Jun 18, 2026" },
                    { label: "Next Appt.", value: "Jul 02, 2026" },
                  ].map((item) => (
                    <div key={item.label} className="bg-muted rounded-lg p-3">
                      <p className="text-xs text-muted-foreground">{item.label}</p>
                      <p className="text-sm font-semibold text-foreground mt-0.5">{item.value}</p>
                    </div>
                  ))}
                </div>
                <div className="border-t border-border pt-4">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                    Recent Diagnoses
                  </p>
                  {[
                    { name: "Malaria", date: "Jun 18", status: "Treated" },
                    { name: "Hypertension", date: "Mar 04", status: "Ongoing" },
                  ].map((item) => (
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
              <div>
                <p className="text-xs font-semibold text-foreground">AI Health Agent</p>
                <p className="text-xs text-muted-foreground mt-0.5">Time for your BP check!</p>
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
              <span className="text-xs font-semibold">Encrypted</span>
            </motion.div>
          </div>
        </motion.div>
      </div>

      <Marquee
        items={[
          "Free for patients",
          "No app download needed",
          "Works on WhatsApp",
          "Works on SMS",
          "NDPR compliant",
          "End-to-end encrypted",
          "Built for Nigeria",
          "AI health monitoring",
          "Instant hospital access",
          "Your records, your control",
        ]}
      />
    </section>
  );
}
