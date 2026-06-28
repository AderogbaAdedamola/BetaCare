import { motion } from "motion/react";

export function RevealWords({ text, className }) {
  const words = text.split(" ");
  return (
    <motion.span
      className={className}
      variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
      initial="hidden"
      animate="visible"
    >
      {words.map((word, i) => (
        <motion.span
          key={i}
          className="inline-block mr-[0.3em]"
          variants={{
            hidden: { opacity: 0, y: "60%", rotate: 3 },
            visible: { opacity: 1, y: "0%", rotate: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
          }}
        >
          {word}
        </motion.span>
      ))}
    </motion.span>
  );
}
