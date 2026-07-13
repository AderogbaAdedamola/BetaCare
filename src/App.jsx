import { useState } from "react";
import { AnimatePresence } from "motion/react";
import { BrowserRouter, Routes, Route, useLocation, Navigate, Outlet } from "react-router";

import LandingPage from "./pages/landing";
import ContactPage from "./pages/contact";
import TermsPage from "./pages/terms";

import PatientLogin from "./pages/patient/login";
import PatientRegister from "./pages/patient/register";
import PatientDashboard from "./pages/patient/dashboard";
import PatientRecords from "./pages/patient/records";
import PatientConsent from "./pages/patient/consent";
import PatientNotifications from "./pages/patient/notifications";
import PatientHealthTracker from "./pages/patient/health-tracker";
import PatientAIChat from "./pages/patient/care-connect";
import PatientSettings from "./pages/patient/settings";
import { PatientProvider } from "./context/PatientContext";
import { PatientLayout } from "./components/layout/PatientLayout";
import { isAuthenticated, getRole } from "./lib/api";
import { Toaster } from "sonner";

import DoctorLogin from "./pages/doctor/login";
import DoctorRegister from "./pages/doctor/register";
import DoctorDashboard from "./pages/doctor/dashboard";
import DoctorPatients from "./pages/doctor/patients";
import DoctorPatientDetails from "./pages/doctor/patients/details";
import DoctorAddNote from "./pages/doctor/patients/add-note";
import DoctorAnomalies from "./pages/doctor/anomalies";
import DoctorSettings from "./pages/doctor/settings";

import HospitalLogin from "./pages/hospital/login";
import HospitalRegister from "./pages/hospital/register";
import HospitalDashboard from "./pages/hospital/dashboard";
import HospitalPatients from "./pages/hospital/patients";
import HospitalPatientDetails from "./pages/hospital/patients/details";
import HospitalSettings from "./pages/hospital/settings";
import HospitalAuditLog from "./pages/hospital/audit-log";
import HospitalStaff from "./pages/hospital/staff";

import { DoctorLayout } from "./components/layout/DoctorLayout";
import { HospitalLayout } from "./components/layout/HospitalLayout";

import NotFoundPages from "./pages/NotFoundPage";

import { Navbar } from "./pages/landing/components/Navbar";
import { PortalModal } from "./pages/landing/components/PortalModal";


const fontStyle = `
  body { font-family: 'DM Sans', sans-serif; }
  h1,h2,h3,h4,h5 { font-family: 'Plus Jakarta Sans', sans-serif; }
`;

// Auth pages manage their own layout — no public navbar
const AUTH_PREFIXES = [
  "/patient",
  "/doctor",
  "/hospital"
];

function PatientProtectedRoute() {
  if (!isAuthenticated() || getRole() !== "patient") {
    return <Navigate to="/patient/login" replace />;
  }
  return (
    <PatientProvider>
      <PatientLayout>
        <Outlet />
      </PatientLayout>
    </PatientProvider>
  );
}

function DoctorProtectedRoute() {
  if (!isAuthenticated() || getRole() !== "doctor") {
    return <Navigate to="/doctor/login" replace />;
  }
  return (
    <DoctorLayout>
      <Outlet />
    </DoctorLayout>
  );
}

function HospitalProtectedRoute() {
  if (!isAuthenticated() || (getRole() !== "hospital_staff" && getRole() !== "admin")) {
    return <Navigate to="/hospital/login" replace />;
  }
  return (
    <HospitalLayout>
      <Outlet />
    </HospitalLayout>
  );
}

function AnimatedRoutes({ onGetStarted }) {
  const location = useLocation();
  const isAuthRoute = AUTH_PREFIXES.some(prefix => location.pathname.startsWith(prefix));

  return (
    <>
      {!isAuthRoute && <Navbar onGetStarted={onGetStarted} />}

      <div>
        <Routes location={location}>
          {/* Public */}
          <Route path="/" element={<LandingPage onGetStarted={onGetStarted} />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/terms" element={<TermsPage />} />

          {/* Patient auth */}
          <Route path="/patient/login" element={<PatientLogin />} />
          <Route path="/patient/register" element={<PatientRegister />} />

          {/* Patient Protected Portal */}
          <Route element={<PatientProtectedRoute />}>
            <Route path="/patient/dashboard" element={<PatientDashboard />} />
            <Route path="/patient/records" element={<PatientRecords />} />
            <Route path="/patient/health-tracker" element={<PatientHealthTracker />} />
            <Route path="/patient/notifications" element={<PatientNotifications />} />
            <Route path="/patient/consent" element={<PatientConsent />} />
            <Route path="/patient/care-connect" element={<PatientAIChat />} />
            <Route path="/patient/settings" element={<PatientSettings />} />
          </Route>

          {/* Doctor auth */}
          <Route path="/doctor/login" element={<DoctorLogin />} />
          <Route path="/doctor/register" element={<DoctorRegister />} />

          {/* Doctor Protected Portal */}
          <Route element={<DoctorProtectedRoute />}>
            <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
            <Route path="/doctor/patients" element={<DoctorPatients />} />
            <Route path="/doctor/patients/:id" element={<DoctorPatientDetails />} />
            <Route path="/doctor/patients/add-note" element={<DoctorAddNote />} />
            <Route path="/doctor/anomalies" element={<DoctorAnomalies />} />
            <Route path="/doctor/settings" element={<DoctorSettings />} />
          </Route>

          {/* Hospital auth */}
          <Route path="/hospital/login" element={<HospitalLogin />} />
          <Route path="/hospital/register" element={<HospitalRegister />} />

          {/* Hospital Protected Portal */}
          <Route element={<HospitalProtectedRoute />}>
            <Route path="/hospital/dashboard" element={<HospitalDashboard />} />
            <Route path="/hospital/patients" element={<HospitalPatients />} />
            <Route path="/hospital/patients/:id" element={<HospitalPatientDetails />} />
            <Route path="/hospital/settings" element={<HospitalSettings />} />
            <Route path="/hospital/audit-log" element={<HospitalAuditLog />} />
            <Route path="/hospital/staff" element={<HospitalStaff />} />
          </Route>

          {/* catch non exixting routes */}
          <Route path="*" element={<NotFoundPages />} />
        </Routes>
      </div>
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