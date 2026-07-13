import { useState } from "react";
import { PatientSearch } from "./components/PatientSearch";
import { PatientList } from "./components/PatientList";
import { motion } from "motion/react";

const MOCK_PATIENTS = [
  { id: "PAT-001", name: "Ahmed Musa", phone: "08012345678", lastVisit: "2026-07-10" },
  { id: "PAT-002", name: "Ngozi Eze", phone: "08087654321", lastVisit: "2026-07-12" },
  { id: "PAT-003", name: "Samuel Ojo", phone: "08123456789", lastVisit: "2026-06-25" },
];

export default function DoctorPatients() {
  const [patients, setPatients] = useState(MOCK_PATIENTS);

  const handleSearch = (query) => {
    if (!query) {
      setPatients(MOCK_PATIENTS);
      return;
    }
    const lowerQuery = query.toLowerCase();
    const filtered = MOCK_PATIENTS.filter(
      (p) =>
        p.name.toLowerCase().includes(lowerQuery) ||
        p.id.toLowerCase().includes(lowerQuery) ||
        p.phone.includes(query)
    );
    setPatients(filtered);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            My Patients
          </h1>
          <p className="text-muted-foreground mt-1">
            Search and view records of patients under your care.
          </p>
        </div>
        <PatientSearch onSearch={handleSearch} />
      </div>

      <PatientList patients={patients} />
    </motion.div>
  );
}
