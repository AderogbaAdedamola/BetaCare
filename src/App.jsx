import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router";
import LandingPage from "./pages/landing";
import ContactPage from "./pages/contact";
import { ScrollProgressBar } from "./components/common/ScrollProgressBar";
import { Navbar } from "./pages/landing/components/Navbar";
import { PortalModal } from "./pages/landing/components/PortalModal";

const fontStyle = `
  body { font-family: 'DM Sans', sans-serif; }
  h1,h2,h3,h4,h5 { font-family: 'Plus Jakarta Sans', sans-serif; }
`;

function AnimatedRoutes({ onGetStarted }) {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -16 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      >
        <Routes location={location}>
          <Route path="/" element={<LandingPage onGetStarted={onGetStarted} />} />
          <Route path="/contact" element={<ContactPage />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

export default function App() {
  const [portalOpen, setPortalOpen] = useState(false);

  return (
    <BrowserRouter>
      <style>{fontStyle}</style>
      <div className="min-h-screen bg-background">
        <ScrollProgressBar />
        <Navbar onGetStarted={() => setPortalOpen(true)} />
        <AnimatedRoutes onGetStarted={() => setPortalOpen(true)} />
        <AnimatePresence>
          {portalOpen && (
            <PortalModal open={portalOpen} onOpenChange={setPortalOpen} />
          )}
        </AnimatePresence>
      </div>
    </BrowserRouter>
  );
}
