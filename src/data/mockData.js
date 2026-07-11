// Mock Data Module for Offline Development

const mockPatientToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoibW9jay1wYXRpZW50LTEyMyIsInJvbGUiOiJwYXRpZW50In0.mockSignature";

export const mockUsers = {
  "mock-patient-123": {
    id: "mock-patient-123",
    full_name: "Aderogba Adedamola",
    email: "damola@example.com",
    contact: { phone: "+2348012345678", email: "damola@example.com" },
    status: "active"
  }
};

export const mockProfiles = {
  "mock-patient-123": {
    profile: {
      conditions: ["Hypertension", "Type 2 Diabetes"],
      medications: ["Lisinopril 10mg daily", "Metformin 500mg twice daily"],
      recent_vitals: { systolic: 118, diastolic: 76, pulse: 68 },
      adherence_stats: { adherence_rate: 0.85 }
    },
    last_updated: new Date().toISOString(),
    open_anomalies: []
  }
};

export const mockRecords = {
  "mock-patient-123": [
    {
      id: "rec_01",
      record_type: "visit_note",
      source: "Lagos University Teaching Hospital (LUTH)",
      recorded_at: "2026-06-15T10:00:00Z",
      payload: {
        notes: "Patient reports feeling well. Blood pressure is stable under current medication.",
        doctor_name: "Dr. Olanrewaju"
      }
    },
    {
      id: "rec_02",
      record_type: "lab_result",
      source: "Reddington Hospital",
      recorded_at: "2026-05-20T14:30:00Z",
      payload: {
        notes: "HbA1c test results. Level is 6.4%, showing good glycemic control.",
        doctor_name: "Dr. Adebayo",
        test_name: "HbA1c",
        value: "6.4%"
      }
    },
    {
      id: "rec_03",
      record_type: "prescription",
      source: "National Hospital Abuja",
      recorded_at: "2026-04-10T11:15:00Z",
      payload: {
        notes: "Refill prescription for Metformin.",
        doctor_name: "Dr. Ibrahim",
        medication: "Metformin 500mg",
        duration: "90 days"
      }
    }
  ]
};

export function handleMockRequest(path, method, body) {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;

  // Log mock API requests to console for developer visibility
  console.log(`[MOCK API] ${method} ${cleanPath}`, body || "");

  // Authentication routes
  if (cleanPath === "/auth/login/request-otp" && method === "POST") {
    return { success: true, message: "OTP sent successfully" };
  }

  if (cleanPath === "/auth/login" && method === "POST") {
    return {
      access_token: mockPatientToken,
      role: "patient"
    };
  }

  if (cleanPath === "/auth/doctor/login" && method === "POST") {
    return {
      token: "mock_doctor_token",
      role: "doctor"
    };
  }

  if (cleanPath === "/auth/hospital/login" && method === "POST") {
    return {
      token: "mock_hospital_token",
      role: "hospital"
    };
  }

  if (cleanPath === "/auth/register/initiate" && method === "POST") {
    return { registration_id: "reg_mock_123" };
  }

  if (cleanPath === "/auth/register/verify-identifier" && method === "POST") {
    return { success: true, message: "Identifier verified" };
  }

  if (cleanPath === "/auth/doctor/verify-mdcn" && method === "POST") {
    return { success: true, message: "MDCN verified" };
  }

  if (cleanPath === "/auth/register/verify-nin" && method === "POST") {
    return { user_id: "mock-patient-123" };
  }

  if (cleanPath === "/profile/initialize" && method === "POST") {
    return { success: true, message: "Profile initialized" };
  }

  if (cleanPath === "/auth/hospital/register" && method === "POST") {
    return { success: true, message: "Hospital registered successfully" };
  }

  // Patient data routes
  if (cleanPath.startsWith("/data/users/") && method === "GET") {
    const userId = cleanPath.split("/").pop();
    return {
      user: mockUsers[userId] || {
        id: userId,
        full_name: "BetaCare User",
        email: "user@example.com",
        contact: { phone: "", email: "" },
        status: "active"
      }
    };
  }

  if (cleanPath.startsWith("/profile/") && method === "GET") {
    const userId = cleanPath.split("/").pop();
    return mockProfiles[userId] || {
      profile: {
        conditions: [],
        medications: [],
        recent_vitals: { systolic: 120, diastolic: 80, pulse: 72 },
        adherence_stats: { adherence_rate: 1.0 }
      },
      last_updated: new Date().toISOString(),
      open_anomalies: []
    };
  }

  if (cleanPath.startsWith("/data/records/") && method === "GET") {
    const userId = cleanPath.split("/").pop();
    return {
      records: mockRecords[userId] || []
    };
  }

  if (cleanPath === "/data/consent" && method === "POST") {
    return { consent_id: `consent_${Math.random().toString(36).substr(2, 9)}` };
  }

  if (cleanPath.startsWith("/data/consent/") && method === "DELETE") {
    return { success: true };
  }

  // Fallback / default handler
  return { success: true };
}
