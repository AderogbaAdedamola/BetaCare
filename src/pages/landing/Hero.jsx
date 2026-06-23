import { Link } from "react-router-dom";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useEffect, useRef } from "react";

const COLS = 4;
const ROWS = 5;
const TILES = Array.from({ length: COLS * ROWS }, (_, i) => i);

function DicedImage({ src }) {
  return (
    <div
      className="relative w-full h-full"
      style={{ display: "grid", gridTemplateColumns: `repeat(${COLS}, 1fr)`, gridTemplateRows: `repeat(${ROWS}, 1fr)` }}
    >
      {TILES.map((i) => {
        const col = i % COLS;
        const row = Math.floor(i / COLS);
        const delay = (row + col) * 0.055;
        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 1.08 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
            style={{
              backgroundImage: `url(${src})`,
              backgroundSize: `${COLS * 100}% ${ROWS * 100}%`,
              backgroundPosition: `${(col / (COLS - 1)) * 100}% ${(row / (ROWS - 1)) * 100}%`,
              overflow: "hidden",
            }}
          />
        );
      })}
    </div>
  );
}

function ParallaxPhoto({ src }) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 60, damping: 20 });
  const sy = useSpring(y, { stiffness: 60, damping: 20 });

  useEffect(() => {
    function onMove(e) {
      const { innerWidth, innerHeight } = window;
      x.set(((e.clientX / innerWidth) - 0.5) * 18);
      y.set(((e.clientY / innerHeight) - 0.5) * 12);
    }
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [x, y]);

  return (
    <motion.div ref={ref} style={{ x: sx, y: sy }} className="absolute inset-0 will-change-transform">
      <DicedImage src={src} />
    </motion.div>
  );
}

const PHOTO = "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=900&q=80&fit=crop";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col lg:flex-row overflow-hidden bg-ink">

      {/* LEFT: text */}
      <div className="relative z-10 flex flex-col justify-center px-8 sm:px-12 lg:px-16 pt-28 pb-16 lg:py-0 lg:w-[52%] xl:w-[48%]">

        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="inline-flex items-center self-start gap-2 rounded-full border border-white/15 bg-white/8 px-3.5 py-1.5 text-[10px] font-mono uppercase tracking-[0.15em] text-white/50 mb-10"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-clay animate-pulse" />
          AI in Medicine · Oyo State, 2026
        </motion.div>

        <div className="overflow-hidden mb-3">
          <motion.p
            initial={{ y: "105%" }}
            animate={{ y: 0 }}
            transition={{ duration: 0.75, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="text-[11px] font-mono uppercase tracking-[0.2em] text-white/35 mb-4"
          >
            The waiting room problem
          </motion.p>
        </div>

        {["One doctor.", "3,474 people.", "One line."].map((line, i) => (
          <div key={line} className="overflow-hidden">
            <motion.h1
              initial={{ y: "105%" }}
              animate={{ y: 0 }}
              transition={{ duration: 0.75, delay: 0.25 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className={`font-display font-semibold leading-[1.0] tracking-tight text-white ${
                i === 1 ? "text-clay" : ""
              } text-5xl sm:text-6xl xl:text-7xl`}
            >
              {line}
            </motion.h1>
          </div>
        ))}

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.6, delay: 0.62, ease: [0.22, 1, 0.36, 1] }}
          style={{ originX: 0 }}
          className="h-px w-16 bg-white/20 my-8"
        />

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="text-base text-white/50 leading-relaxed max-w-sm mb-10"
        >
          The WHO says 1 doctor per 600. Nigeria sits at 1 per 3,474.
          BetaCare extends every doctor's reach — across WhatsApp, USSD, voice, and web.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.82 }}
          className="flex flex-col sm:flex-row gap-3"
        >
          <Link
            to="/signup"
            className="group inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-ink hover:bg-teal-100 transition-colors"
          >
            Get started
            <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
          <Link
            to="/doctor/login"
            className="inline-flex items-center justify-center rounded-xl border border-white/15 px-6 py-3 text-sm font-medium text-white/70 hover:bg-white/8 transition-colors"
          >
            Doctor portal
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.1 }}
          className="flex items-center gap-8 mt-16 pt-8 border-t border-white/10"
        >
          {[
            { n: "1:3,474", l: "Doctor ratio" },
            { n: "74.7%", l: "Out of pocket" },
            { n: "98%+", l: "AI diagnostic accuracy" },
          ].map((s) => (
            <div key={s.n}>
              <p className="text-lg font-display font-semibold text-white">{s.n}</p>
              <p className="text-[11px] text-white/35 font-mono mt-0.5">{s.l}</p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* RIGHT: diced photo */}
      <div className="relative lg:w-[48%] xl:w-[52%] h-[55vw] lg:h-auto">
        <div className="absolute inset-0 overflow-hidden">
          <ParallaxPhoto src={PHOTO} />
          <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/30 to-transparent lg:block hidden" />
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-ink to-transparent" />
          <div className="absolute inset-0 bg-ink/25" />
        </div>

        {/* floating stat card */}
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.65, delay: 1.3, ease: [0.22, 1, 0.36, 1] }}
          className="absolute bottom-10 right-8 z-10 rounded-2xl border border-white/10 bg-ink/70 backdrop-blur-md px-5 py-4 max-w-[200px]"
        >
          <p className="text-2xl font-display font-semibold text-white mb-0.5">5× below</p>
          <p className="text-xs text-white/45 leading-relaxed">the WHO-recommended doctor ratio</p>
          <div className="mt-3 flex gap-1">
            {[1,2,3,4,5].map((i) => (
              <div
                key={i}
                className={`h-1.5 flex-1 rounded-full ${i === 1 ? "bg-teal-500" : "bg-white/15"}`}
              />
            ))}
          </div>
        </motion.div>
      </div>

      {/* mobile bg */}
      <div className="absolute inset-0 lg:hidden -z-0 opacity-30">
        <img src={PHOTO} alt="Hospital waiting room" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/60 via-ink/80 to-ink" />
      </div>
    </section>
  );
}