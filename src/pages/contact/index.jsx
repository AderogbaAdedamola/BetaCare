import { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { ArrowLeft, Mail, Phone, MapPin, MessageSquare, Send, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router";
import { MagneticButton } from "../../components/common/MagneticButton";

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

const stagger = { visible: { transition: { staggerChildren: 0.1 } } };

export default function ContactPage() {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

  const [submitted, setSubmitted] = useState(false);
  const [role, setRole] = useState("Patient / Individual");

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const contactInfo = [
    { icon: Mail, label: "Email us", value: "hello@betacare.ng", sub: "We respond within 24 hours" },
    { icon: Phone, label: "Call us", value: "+234 800 000 0000", sub: "Mon – Fri, 8am – 6pm WAT" },
    { icon: MapPin, label: "Find us", value: "Victoria Island, Lagos", sub: "Nigeria" },
    { icon: MessageSquare, label: "WhatsApp", value: "+234 800 000 0001", sub: "Message us anytime" },
  ];

  return (
    <div ref={containerRef} className="min-h-screen bg-background">
      {/* Scroll progress */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-0.5 bg-primary z-50 origin-left"
        style={{ scaleX: scrollYProgress }}
      />

      {/* Parallax header */}
      <div className="relative overflow-hidden bg-foreground" style={{ minHeight: "340px" }}>
        <motion.div
          className="absolute inset-0 opacity-20"
          style={{
            y: bgY,
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.2) 1px, transparent 0)",
            backgroundSize: "36px 36px",
          }}
        />
        <motion.div
          className="absolute top-10 right-10 w-64 h-64 rounded-full bg-accent/10 blur-3xl"
          animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-0 left-1/4 w-80 h-40 rounded-full bg-primary/20 blur-3xl"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />

        <div className="relative max-w-7xl mx-auto px-6 pt-24 pb-16">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-card/60 hover:text-card text-sm font-medium mb-8 transition-colors group cursor-pointer"
          >
            <motion.span
              className="inline-flex"
              whileHover={{ x: -4 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <ArrowLeft size={16} />
            </motion.span>
            Back to home
          </button>

          <motion.div
            variants={stagger}
            initial="hidden"
            animate="visible"
          >
            <motion.span
              variants={fadeUp}
              className="inline-block px-3 py-1 bg-accent/20 text-accent rounded-full text-sm font-semibold mb-4"
            >
              Contact BetaCare
            </motion.span>
            <motion.h1
              variants={fadeUp}
              className="text-5xl font-extrabold text-card leading-tight mb-4"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              Let&apos;s talk
            </motion.h1>
            <motion.p variants={fadeUp} className="text-card/65 text-xl max-w-lg">
              Whether you&apos;re a patient, a doctor, or a hospital — we&apos;d love to
              hear from you. Pick the fastest channel that works for you.
            </motion.p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-5 gap-12">
          {/* Contact methods — left */}
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="lg:col-span-2 flex flex-col gap-5"
          >
            <motion.p
              variants={fadeUp}
              className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2"
            >
              Get in touch
            </motion.p>
            {contactInfo.map((item) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.label}
                  variants={fadeUp}
                  whileHover={{ x: 4 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="flex items-start gap-4 p-5 bg-card border border-border rounded-2xl hover:border-primary/30 hover:shadow-md transition-shadow cursor-default"
                >
                  <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    <Icon size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      {item.label}
                    </p>
                    <p className="font-semibold text-foreground mt-0.5" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                      {item.value}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">{item.sub}</p>
                  </div>
                </motion.div>
              );
            })}

            {/* Map placeholder */}
            <motion.div
              variants={fadeUp}
              className="rounded-2xl overflow-hidden border border-border bg-muted h-48 relative flex items-center justify-center"
            >
              <div
                className="absolute inset-0 opacity-40"
                style={{
                  backgroundImage:
                    "linear-gradient(rgba(11,107,64,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(11,107,64,0.1) 1px, transparent 1px)",
                  backgroundSize: "24px 24px",
                }}
              />
              <div className="relative text-center">
                <div className="w-10 h-10 rounded-full bg-primary mx-auto flex items-center justify-center mb-2">
                  <MapPin size={18} className="text-primary-foreground" />
                </div>
                <p className="text-sm font-semibold text-foreground">Victoria Island</p>
                <p className="text-xs text-muted-foreground">Lagos, Nigeria</p>
              </div>
            </motion.div>
          </motion.div>

          {/* Form — right */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-3"
          >
            <div className="bg-card border border-border rounded-3xl p-8 lg:p-10 shadow-xl">
              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                  className="flex flex-col items-center text-center py-12"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 250, delay: 0.1 }}
                    className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-5"
                  >
                    <CheckCircle2 size={32} />
                  </motion.div>
                  <h2
                    className="text-2xl font-bold text-foreground mb-3"
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                  >
                    Message received!
                  </h2>
                  <p className="text-muted-foreground max-w-sm mb-6">
                    We&apos;ll get back to you within 24 hours. In the meantime, feel
                    free to explore BetaCare on WhatsApp.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="text-sm text-primary hover:underline font-medium cursor-pointer"
                  >
                    Send another message
                  </button>
                </motion.div>
              ) : (
                <>
                  <div className="mb-8">
                    <h2
                      className="text-2xl font-bold text-foreground mb-1"
                      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                    >
                      Send us a message
                    </h2>
                    <p className="text-muted-foreground text-sm">
                      Fill in the form below and we&apos;ll be in touch.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <motion.div
                        className="flex flex-col gap-1.5"
                        whileFocusWithin={{ scale: 1.01 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <label className="text-sm font-medium text-foreground">Full Name</label>
                        <input
                          required
                          type="text"
                          placeholder="Amaka Osei"
                          className="px-4 py-3 bg-input-background border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
                        />
                      </motion.div>
                      <motion.div
                        className="flex flex-col gap-1.5"
                        whileFocusWithin={{ scale: 1.01 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <label className="text-sm font-medium text-foreground">Email Address</label>
                        <input
                          required
                          type="email"
                          placeholder="amaka@example.com"
                          className="px-4 py-3 bg-input-background border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
                        />
                      </motion.div>
                    </div>

                    <motion.div
                      className="flex flex-col gap-1.5"
                      whileFocusWithin={{ scale: 1.005 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <label className="text-sm font-medium text-foreground">Phone Number (optional)</label>
                      <input
                        type="tel"
                        placeholder="+234 803 000 0000"
                        className="px-4 py-3 bg-input-background border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
                      />
                    </motion.div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-medium text-foreground">I am a...</label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {["Patient / Individual", "Doctor", "Hospital", "Other"].map((r) => (
                          <button
                            key={r}
                            type="button"
                            onClick={() => setRole(r)}
                            className={`px-3 py-2.5 text-xs font-semibold rounded-xl border-2 transition-all cursor-pointer ${
                              role === r
                                ? "bg-primary text-primary-foreground border-primary"
                                : "bg-transparent text-foreground border-border hover:border-primary/40"
                            }`}
                          >
                            {r}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-medium text-foreground">Subject</label>
                      <input
                        required
                        type="text"
                        placeholder="What can we help you with?"
                        className="px-4 py-3 bg-input-background border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
                      />
                    </div>

                    <motion.div
                      className="flex flex-col gap-1.5"
                      whileFocusWithin={{ scale: 1.005 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <label className="text-sm font-medium text-foreground">Message</label>
                      <textarea
                        required
                        rows={5}
                        placeholder="Tell us what you need..."
                        className="px-4 py-3 bg-input-background border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all resize-none"
                      />
                    </motion.div>

                    <MagneticButton
                      type="submit"
                      className="flex items-center justify-center gap-2 w-full py-4 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 transition-colors text-sm cursor-pointer"
                    >
                      Send Message
                      <Send size={15} />
                    </MagneticButton>
                  </form>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
