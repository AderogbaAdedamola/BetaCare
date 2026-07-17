import { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import { Plus, Minus } from "lucide-react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "../../../components/ui/accordion";
import { useTranslation } from "react-i18next";

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

const stagger = { visible: { transition: { staggerChildren: 0.1 } } };

export function FAQSection() {
  const { t } = useTranslation();
  const [openItem, setOpenItem] = useState("");
  const [openedAngle, setOpenedAngle] = useState(0);

  const faqs = t('faq.items', { returnObjects: true });

  useEffect(() => {
    if (openItem) {
      setOpenedAngle(45);
      setTimeout(() => {
        setOpenedAngle(0);
      }, 300);
    }
  }, [openItem]);

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
            {t('faq.badge')}
          </motion.span>
          <h2
            className="text-4xl font-extrabold text-foreground mb-4"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            {t('faq.title')}
          </h2>
          <p className="text-muted-foreground">
            {t('faq.desc')}{" "}
            <a href="/contact" className="text-primary font-medium hover:underline">
              {t('faq.contactLink')}
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
          {Array.isArray(faqs) && faqs.map((faq, i) => {
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
