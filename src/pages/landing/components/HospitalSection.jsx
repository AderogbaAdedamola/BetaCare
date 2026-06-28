import { motion } from "motion/react";
import { Check, ArrowRight } from "lucide-react";
import { MagneticButton } from "../../../components/common/MagneticButton";

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

const stagger = { visible: { transition: { staggerChildren: 0.1 } } };

export function HospitalSection() {
  const benefits = [
    "Instant access to patient records at point of care",
    "Reduce consultation time and duplicate testing",
    "Real-time updates across departments and wards",
    "Compliant with Nigerian health data regulations",
    "Dedicated onboarding and 24/7 technical support",
  ];

  return (
    <section id="hospitals" className="py-24 bg-background overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="bg-primary rounded-3xl overflow-hidden"
        >
          <div className="grid lg:grid-cols-2">
            <div className="p-10 lg:p-14 flex flex-col justify-center">
              <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                <motion.span
                  variants={fadeUp}
                  className="inline-block px-3 py-1 bg-primary-foreground/15 text-primary-foreground rounded-full text-sm font-semibold mb-5"
                >
                  For Healthcare Centres
                </motion.span>
                <h2
                  className="text-4xl font-extrabold text-primary-foreground mb-5 leading-tight"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                >
                  Integrate BetaCare into your hospital today
                </h2>
                <p className="text-primary-foreground/75 text-lg leading-relaxed mb-8">
                  Give your clinical team instant access to complete patient histories. Reduce paperwork, improve care
                  quality.
                </p>
                <motion.ul variants={stagger} className="flex flex-col gap-3 mb-8">
                  {benefits.map((b) => (
                    <motion.li key={b} variants={fadeUp} className="flex items-start gap-3 text-primary-foreground/85 text-sm">
                      <Check size={16} className="text-accent mt-0.5 shrink-0" /> {b}
                    </motion.li>
                  ))}
                </motion.ul>
                <motion.div variants={fadeUp}>
                  <MagneticButton
                    href="/hospital/register"
                    className="inline-flex items-center gap-2 px-6 py-3.5 bg-accent text-accent-foreground font-semibold rounded-xl hover:bg-accent/90 transition-colors"
                  >
                    Apply for Integration <ArrowRight size={16} />
                  </MagneticButton>
                </motion.div>
              </motion.div>
            </div>

            <div className="hidden lg:flex items-center justify-center bg-primary/80 p-10">
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="w-full max-w-sm"
              >
                <div className="bg-card/10 backdrop-blur-sm border border-primary-foreground/20 rounded-2xl p-6">
                  <p
                    className="text-primary-foreground font-bold text-lg mb-4"
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                  >
                    Hospital Dashboard
                  </p>
                  <div className="flex flex-col gap-3">
                    {[
                      { name: "Emeka Chukwu", id: "#UCH-4412", status: "Admitted" },
                      { name: "Bisi Adeyemi", id: "#UCH-3891", status: "Outpatient" },
                      { name: "Ngozi Okafor", id: "#UCH-5022", status: "Discharged" },
                      { name: "Tunde Bello", id: "#UCH-4987", status: "Outpatient" },
                    ].map((patient, i) => (
                      <motion.div
                        key={patient.id}
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.08 + 0.3 }}
                        className="flex items-center justify-between bg-primary-foreground/10 rounded-xl p-3"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold text-xs">
                            {patient.name[0]}
                          </div>
                          <div>
                            <p className="text-primary-foreground text-sm font-medium">{patient.name}</p>
                            <p className="text-primary-foreground/50 text-xs">{patient.id}</p>
                          </div>
                        </div>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                            patient.status === "Admitted"
                              ? "bg-accent/20 text-accent"
                              : patient.status === "Discharged"
                              ? "bg-primary-foreground/10 text-primary-foreground/60"
                              : "bg-primary-foreground/15 text-primary-foreground/80"
                          }`}
                        >
                          {patient.status}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                  <div className="mt-4 pt-4 border-t border-primary-foreground/15 flex justify-between text-xs text-primary-foreground/60">
                    <span>Active: 127</span>
                    <span>Today&apos;s Appts: 43</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
