import { useState } from "react";
import { PatientSearch } from "./components/PatientSearch";
import { PatientList } from "./components/PatientList";
import { motion } from "motion/react";

const MOCK_HOSPITAL_PATIENTS = [
  { id: "PAT-001", name: "Ahmed Musa", phone: "08012345678" },
  { id: "PAT-005", name: "Fatima Bello", phone: "08055554444" },
];

export default function HospitalPatients() {
  const [patients, setPatients] = useState(MOCK_HOSPITAL_PATIENTS);

  const handleSearch = (query) => {
    if (!query) {
      setPatients(MOCK_HOSPITAL_PATIENTS);
      return;
    }
    const lowerQuery = query.toLowerCase();
    const filtered = MOCK_HOSPITAL_PATIENTS.filter(
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
            Consented Patients
          </h1>
          <p className="text-muted-foreground mt-1">
            Search and view records for patients who have granted your hospital access.
          </p>
        </div>
        <PatientSearch onSearch={handleSearch} />
      </div>

      <PatientList patients={patients} />
    </motion.div>
  );
}
