import { motion } from "motion/react";

export function Marquee({ items }) {
  const doubled = [...items, ...items];
  return (
    <div className="overflow-hidden border-y border-border bg-card/40 py-3">
      <motion.div
        className="flex gap-10 w-max"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      >
        {doubled.map((item, i) => (
          <span key={i} className="text-xs font-semibold text-muted-foreground uppercase tracking-widest whitespace-nowrap flex items-center gap-3">
            <span className="w-1 h-1 rounded-full bg-primary inline-block" />
            {item}
          </span>
        ))}
      </motion.div>
    </div>
  );
}
