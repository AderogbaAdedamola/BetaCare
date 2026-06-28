import { motion } from "motion/react";
import { Link } from "react-router";
import { Building2, Clock, ArrowLeft } from "lucide-react";

export default function HospitalDashboard() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-sm"
      >
        <motion.div
          className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mx-auto mb-6"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <Building2 size={28} />
        </motion.div>
        <h1 className="text-2xl font-extrabold text-foreground mb-3" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          Hospital Dashboard
        </h1>
        <p className="text-muted-foreground text-sm leading-relaxed mb-6">
          Your hospital portal is being built. Once your account is verified, you'll manage patients, doctors, and departments here.
        </p>
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-muted rounded-full text-sm text-muted-foreground mb-8">
          <Clock size={14} /> Coming soon
        </div>
        <div className="block">
          <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-primary font-medium hover:underline">
            <ArrowLeft size={14} /> Back to home
          </Link>
        </div>
      </motion.div>
    </div>
  );
}