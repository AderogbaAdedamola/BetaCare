import { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import { Plus, Minus } from "lucide-react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "../../../components/ui/accordion";

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

const stagger = { visible: { transition: { staggerChildren: 0.1 } } };

const faqs = [
  {
    q: "Is BetaCare free to use?",
    a: "Yes. BetaCare is completely free for patients — always. We charge hospitals and healthcare centres a subscription fee for integration. Patients will never pay.",
  },
  {
    q: "How do I access my health records?",
    a: "You can access your records via our web dashboard, WhatsApp, or SMS. No app download required. Register once and your records are available wherever you are.",
  },
  {
    q: "Is my health data safe?",
    a: "Absolutely. All data is end-to-end encrypted and stored on NDPR-compliant servers. We will never sell your data to third parties. You have full visibility of every access request.",
  },
  {
    q: "Which hospitals support BetaCare?",
    a: "We are in active onboarding with hospitals across Lagos, Abuja, and Port Harcourt. Any hospital can apply for integration through our Hospital portal — the network grows every week.",
  },
  {
    q: "How does doctor verification work?",
    a: "Doctors go through a three-step process: email OTP verification, MDCN licence number validation, and a liveness check via Smile Identity. Only licensed practitioners get access.",
  },
  {
    q: "Can I use BetaCare without a smartphone?",
    a: "Yes. BetaCare works entirely over SMS for users without smartphones or internet access. Any phone with a working SIM card and airtime is enough.",
  },
  {
    q: "What happens to my records if I switch hospitals?",
    a: "Your records belong to you, not the hospital. When you visit a new facility, you authorise them to view your BetaCare profile — your complete history is instantly available.",
  },
  {
    q: "How does the AI health agent work?",
    a: "The AI builds a health profile from your records and interactions. It proactively sends reminders (drug schedules, upcoming appointments), flags unusual patterns, and answers basic health questions via WhatsApp.",
  },
];

export function FAQSection() {
  const [openItem, setOpenItem] = useState("");
  const [openedAngle, setOpenedAngle] = useState(0);
  // const [closedAngle, setClosedAngle] = useState(0);

  useEffect(() => {
    if (openItem) {
      setOpenedAngle(45);
      setTimeout(() => {
        setOpenedAngle(0);
      }, 300);
    }
  }, [openItem]);
  // useEffect(() => {
  //   if (!openItem) {
  //     setClosedAngle(-45);
  //     setTimeout(() => {
  //       setClosedAngle(0);
  //     }, 300);
  //   }
  // }, [closedAngle]);
  

  return (
    <section id="faq" className="py-24 bg-background overflow-hidden">
      <div className="max-w-3xl mx-auto px-6">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <motion.span
            variants={fadeUp}
            className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-semibold mb-4"
          >
            FAQ
          </motion.span>
          <h2
            className="text-4xl font-extrabold text-foreground mb-4"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            Frequently asked questions
          </h2>
          <p className="text-muted-foreground">
            Everything you need to know about BetaCare. Can&apos;t find your answer?{" "}
            <a href="/contact" className="text-primary font-medium hover:underline">
              Reach out to us.
            </a>
          </p>
        </motion.div>

        <Accordion
          type="single"
          collapsible
          value={openItem}
          onValueChange={setOpenItem}
          className="flex flex-col gap-3"
        >
          {faqs.map((faq, i) => {
            const isOpened = openItem === `item-${i}`;
            return (
              <motion.div
                key={faq.q}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05, duration: 0.45 }}
              >
                <AccordionItem
                  value={`item-${i}`}
                  className="bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/25 transition-colors border-b-0"
                >
                  <AccordionTrigger 
                    className="w-full flex items-center justify-between px-6 py-5 text-left group focus:outline-none hover:no-underline cursor-pointer"
                      icon={
                      <motion.div
                        animate={{ rotate: isOpened ? openedAngle : 0 }}
                        transition={{ type: "spring", stiffness: 300, damping: 24 }}
                        className="shrink-0 w-7 h-7 rounded-full bg-muted flex items-center justify-center text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                        {isOpened ? <Minus size={16} /> : <Plus size={16} />}
                      </motion.div>}
                    >
                    <span
                      className="font-semibold text-foreground pr-4 text-sm sm:text-base"
                      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                    >
                      {faq.q}
                    </span>
                    
                  </AccordionTrigger>
                  <AccordionContent className="overflow-hidden p-0 border-t border-border">
                    <p className="px-6 py-5 text-sm text-muted-foreground leading-relaxed">
                      {faq.a}
                    </p>
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            );
          })}
        </Accordion>
      </div>
    </section>
  );
}
