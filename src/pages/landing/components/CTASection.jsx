import { motion } from "motion/react";
import { useNavigate } from "react-router";
import { Heart, ArrowRight } from "lucide-react";
import { MagneticButton } from "../../../components/common/MagneticButton";
import { BetaCareLogo } from "../../../components/icons/BetaCareLogo";

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

const stagger = { visible: { transition: { staggerChildren: 0.1 } } };

export function CTASection({ onGetStarted }) {
  const navigate = useNavigate();
  return (
    <section className="py-24 bg-muted/30 border-t border-border overflow-hidden">
      <div className="max-w-3xl mx-auto px-6 text-center">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
        >
          <motion.div
            variants={fadeUp}
            className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mx-auto mb-6"
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            {BetaCareLogo("size-12 m-2")}
          </motion.div>
          <motion.h2
            variants={fadeUp}
            className="text-4xl lg:text-5xl font-extrabold text-foreground mb-5 leading-tight"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            Your health story deserves to be remembered
          </motion.h2>
          <motion.p variants={fadeUp} className="text-muted-foreground text-lg mb-8">
            Join Nigerians who have taken control of their health records. Sign up free — no credit card, no app download
            required.
          </motion.p>
          <motion.div variants={fadeUp} className="flex flex-wrap gap-3 justify-center">
            <MagneticButton
              onClick={onGetStarted}
              className="flex items-center gap-2 px-7 py-4 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 transition-colors hover:shadow-lg hover:shadow-primary/20"
            >
              Get Started Free <ArrowRight size={16} />
            </MagneticButton>
            <MagneticButton
              onClick={() => navigate("/contact")}
              className="flex items-center gap-2 px-7 py-4 border-2 border-border text-foreground font-semibold rounded-xl hover:border-primary/40 hover:bg-secondary transition-all"
            >
              Talk to the Team
            </MagneticButton>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
