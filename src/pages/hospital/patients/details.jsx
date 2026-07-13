import { useParams, Link } from "react-router";
import { motion } from "motion/react";
import { ArrowLeft } from "lucide-react";
import { PatientHeader } from "../../doctor/patients/components/PatientHeader";
import { VisitSummary } from "../../doctor/patients/components/VisitSummary";
import { RecordTimeline } from "../../doctor/patients/components/RecordTimeline";

// Mock data
const MOCK_PATIENT_DETAILS = {
  id: "PAT-001",
  name: "Ahmed Musa",
  dob: "1980-05-15",
  age: 46,
  phone: "08012345678",
  bloodType: "O+",
  genotype: "AA",
  summary: "Patient presents with persistent headaches and elevated blood pressure over the last two weeks. Adherence to prescribed anti-hypertensives has been inconsistent according to Agent logs. Recommend adjusting dosage and stressing importance of adherence.",
  records: [
    {
      id: "rec-1",
      type: "visit_note",
      date: "2026-07-10",
      description: "Follow-up for hypertension. BP 150/95. Advised strict adherence to medication.",
      provider: "Dr. Johnson",
    },
    {
      id: "rec-2",
      type: "prescription",
      date: "2026-07-10",
      description: "Amlodipine 5mg daily for 30 days.",
      provider: "Dr. Johnson",
    },
    {
      id: "rec-3",
      type: "lab_result",
      date: "2026-06-25",
      description: "Fasting Blood Sugar: 95 mg/dL (Normal). Lipid profile within normal limits.",
      provider: "BetaCare Labs",
    },
  ]
};

export default function HospitalPatientDetails() {
  const { id } = useParams();
  
  // In a real app, fetch patient details by ID within hospital's consent scope
  const patient = MOCK_PATIENT_DETAILS;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 max-w-4xl"
    >
      <div className="flex items-center justify-between">
        <Link
          to="/hospital/patients"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft size={16} /> Back to Patients
        </Link>
      </div>

      <PatientHeader patient={patient} />
      
      <div className="bg-card border border-border rounded-xl p-6">
        <VisitSummary summary={patient.summary} />
        <RecordTimeline records={patient.records} />
      </div>
    </motion.div>
  );
}
