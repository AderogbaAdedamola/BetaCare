import { useRef } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

export function TiltCard({ children, className }) {
  const ref = useRef(null);
  const rotX = useMotionValue(0);
  const rotY = useMotionValue(0);
  const springRotX = useSpring(rotX, { stiffness: 200, damping: 25 });
  const springRotY = useSpring(rotY, { stiffness: 200, damping: 25 });

  const handleMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    rotX.set(((e.clientY - rect.top - rect.height / 2) / (rect.height / 2)) * -7);
    rotY.set(((e.clientX - rect.left - rect.width / 2) / (rect.width / 2)) * 7);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={() => {
        rotX.set(0);
        rotY.set(0);
      }}
      style={{ rotateX: springRotX, rotateY: springRotY, transformStyle: "preserve-3d" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
