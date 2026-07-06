import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router";

import LandingPage from "./pages/landing";
import ContactPage from "./pages/contact";
import TermsPage from "./pages/terms";

import PatientLogin from "./pages/patient/login";
import PatientRegister from "./pages/patient/register";
import PatientDashboard from "./pages/patient/dashboard";
import PatientRecords from "./pages/patient/records";
import PatientConsent from "./pages/patient/consent";
import { PatientProvider } from "./context/PatientContext";
import { PatientLayout } from "./components/layout/PatientLayout";
import { isAuthenticated, getRole } from "./lib/api";
import { Toaster } from "sonner";

import DoctorLogin from "./pages/doctor/login";
import DoctorRegister from "./pages/doctor/register";

import HospitalLogin from "./pages/hospital/login";
import HospitalRegister from "./pages/hospital/register";
import HospitalDashboard from "./pages/hospital/dashboard";

import NotFoundPages from "./pages/NotFoundPage";

import { ScrollProgressBar } from "./components/common/ScrollProgressBar";
import { Navbar } from "./pages/landing/components/Navbar";
import { PortalModal } from "./pages/landing/components/PortalModal";


const fontStyle = `
  body { font-family: 'DM Sans', sans-serif; }
  h1,h2,h3,h4,h5 { font-family: 'Plus Jakarta Sans', sans-serif; }
`;

// Auth pages manage their own layout — no public navbar
const AUTH_ROUTES = [
  "/patient/login", "/patient/register",
  "/patient/dashboard", "/patient/records", "/patient/consent",
  "/doctor/login", "/doctor/register",
  "/hospital/login", "/hospital/register",
  "/hospital/dashboard", "*"
];

function PatientProtectedRoute({ children }) {
  if (!isAuthenticated() || getRole() !== "patient") {
    return <Navigate to="/patient/login" replace />;
  }
  return <PatientProvider>{children}</PatientProvider>;
}

function AnimatedRoutes({ onGetStarted }) {
  const location = useLocation();
  const isAuthRoute = AUTH_ROUTES.includes(location.pathname);

  return (
    <>
      {!isAuthRoute && <Navbar onGetStarted={onGetStarted} />}

      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          <Routes location={location}>
            {/* Public */}
            <Route path="/" element={<LandingPage onGetStarted={onGetStarted} />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/terms" element={<TermsPage />} />

            {/* Patient auth */}
            <Route path="/patient/login" element={<PatientLogin />} />
            <Route path="/patient/register" element={<PatientRegister />} />

            {/* Patient Protected Portal */}
            <Route
              path="/patient/dashboard"
              element={
                <PatientProtectedRoute>
                  <PatientLayout>
                    <PatientDashboard />
                  </PatientLayout>
                </PatientProtectedRoute>
              }
            />
            <Route
              path="/patient/records"
              element={
                <PatientProtectedRoute>
                  <PatientLayout>
                    <PatientRecords />
                  </PatientLayout>
                </PatientProtectedRoute>
              }
            />
            <Route
              path="/patient/consent"
              element={
                <PatientProtectedRoute>
                  <PatientLayout>
                    <PatientConsent />
                  </PatientLayout>
                </PatientProtectedRoute>
              }
            />

            {/* Doctor auth */}
            <Route path="/doctor/login" element={<DoctorLogin />} />
            <Route path="/doctor/register" element={<DoctorRegister />} />

            {/* Hospital auth + dashboard */}
            <Route path="/hospital/login" element={<HospitalLogin />} />
            <Route path="/hospital/register" element={<HospitalRegister />} />
            <Route path="/hospital/dashboard" element={<HospitalDashboard />} />

            {/* catch non exixting routes */}
            <Route path="*" element={<NotFoundPages/>}/>
          </Routes>
        </motion.div>
      </AnimatePresence>
    </>
  );
}

export default function App() {
  const [portalOpen, setPortalOpen] = useState(false);

  return (
    <BrowserRouter>
      <style>{fontStyle}</style>
      <div className="min-h-screen bg-background">
        <Toaster position="top-right" richColors />
        <ScrollProgressBar />
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