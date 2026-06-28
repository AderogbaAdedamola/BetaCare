import { Link } from "react-router";
import { motion } from "motion/react";
import { ArrowLeft, FileText } from "lucide-react";
import { Navbar } from "../landing/components/Navbar";
import { Footer } from "../landing/components/Footer";

const SECTIONS = [
  {
    title: "1. Who we are",
    content: "BetaCare is a digital health companion platform operated by BetaCare Technologies Ltd., incorporated in Nigeria. We help patients store health records, receive medication reminders, and connect with verified healthcare providers.",
  },
  {
    title: "2. What BetaCare is not",
    content: "BetaCare is not a medical diagnostic tool. Nothing on this platform constitutes medical advice, diagnosis, or treatment. Always seek the advice of a qualified healthcare provider with any questions regarding a medical condition.",
  },
  {
    title: "3. Your data",
    content: "Your health data belongs to you. We process it only to provide the service you signed up for. We will never sell your data to third parties. You have the right to export your data and delete your account at any time.",
  },
  {
    title: "4. Eligibility",
    content: "You must be at least 13 years old to use BetaCare. By creating an account, you confirm that the information you provide is accurate and that you have authority to share any health information you submit.",
  },
  {
    title: "5. Healthcare providers",
    content: "Doctors must hold valid MDCN registration to use BetaCare. Hospitals must hold valid CAC registration. BetaCare verifies these credentials but is not responsible for clinical decisions made by verified providers.",
  },
  {
    title: "6. Emergency situations",
    content: "BetaCare is not an emergency service. If you or someone else is in immediate danger, call Nigeria Emergency Service (112) or go to the nearest hospital immediately. Do not rely on BetaCare in an emergency.",
  },
  {
    title: "7. Changes",
    content: "We may update these terms. We'll notify you via email at least 14 days before significant changes take effect. Continued use of BetaCare after that date constitutes acceptance.",
  },
  {
    title: "8. Contact",
    content: "Questions about these terms? Reach us through the contact page or email legal@betacare.ng.",
  },
];

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar onGetStarted={() => {}} />

      <main className="flex-1 max-w-3xl mx-auto px-6 pt-32 pb-24 w-full">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8">
            <ArrowLeft size={14} /> Back to home
          </Link>

          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <FileText size={20} />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-foreground" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Terms of Service
              </h1>
              <p className="text-xs text-muted-foreground">Last updated: June 2026 — Placeholder</p>
            </div>
          </div>

          <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40 rounded-xl px-4 py-3.5 mb-10">
            <p className="text-sm font-semibold text-amber-800 dark:text-amber-300">Draft document</p>
            <p className="text-xs text-amber-700 dark:text-amber-400 mt-0.5 leading-relaxed">
              Full legal terms will be added before public launch in consultation with a Nigerian technology law firm. This placeholder covers the key principles only.
            </p>
          </div>

          <div className="space-y-8">
            {SECTIONS.map((section, i) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05, duration: 0.4 }}
                className="border-b border-border pb-8 last:border-0"
              >
                <h2 className="text-sm font-bold text-foreground mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  {section.title}
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed">{section.content}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}