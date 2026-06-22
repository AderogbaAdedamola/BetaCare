import { BrowserRouter, Routes, Route } from "react-router-dom";

import Landing from "./pages/landing/index";
import Signup from "./pages/signup";
import Login from "./pages/login";
import PatientDashboard from "./pages/patient/dashboard";
import PatientHistory from "./pages/patient/history";
import DoctorLogin from "./pages/doctor/login";
import PatientList from "./pages/doctor/patients/index";
import PatientDetail from "./pages/doctor/patients/[id]";
import AuthGuard from "./components/shared/AuthGuard";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/doctor/login" element={<DoctorLogin />} />

        <Route
          path="/patient/dashboard"
          element={
            <AuthGuard role="patient">
              <PatientDashboard />
            </AuthGuard>
          }
        />
        <Route
          path="/patient/history"
          element={
            <AuthGuard role="patient">
              <PatientHistory />
            </AuthGuard>
          }
        />

        <Route
          path="/doctor/patients"
          element={
            <AuthGuard role="doctor">
              <PatientList />
            </AuthGuard>
          }
        />
        <Route
          path="/doctor/patients/:id"
          element={
            <AuthGuard role="doctor">
              <PatientDetail />
            </AuthGuard>
          }
        />

        <Route path="*" element={<Landing />} />
      </Routes>
    </BrowserRouter>
  );
}
