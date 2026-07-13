import { useState } from "react";
import { motion } from "motion/react";
import { AnomalyList } from "./components/AnomalyList";
import { toast } from "sonner";

const MOCK_ANOMALIES = [
  {
    id: "ANOM-001",
    patientId: "PAT-001",
    patientName: "Ahmed Musa",
    date: "2026-07-13T08:30:00Z",
    severity: "High",
    description: "Patient has missed their prescribed anti-hypertensive medication for 3 consecutive days based on Agent logs.",
    recommendedAction: "Call patient to confirm supply and adherence."
  },
  {
    id: "ANOM-002",
    patientId: "PAT-012",
    patientName: "Bisi Adeyemi",
    date: "2026-07-12T14:15:00Z",
    severity: "Medium",
    description: "Self-reported blood sugar level is trending upwards (130 mg/dL fasting) over the last two check-ins.",
    recommendedAction: "Review diet and schedule follow-up lab test."
  }
];

export default function DoctorAnomalies() {
  const [anomalies, setAnomalies] = useState(MOCK_ANOMALIES);

  const handleResolve = (anomalyId, notes) => {
    // In a real app, send API request to resolve anomaly
    setAnomalies(prev => prev.filter(a => a.id !== anomalyId));
    toast.success("Anomaly marked as resolved.");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 max-w-5xl mx-auto"
    >
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Anomaly Review Queue
        </h1>
        <p className="text-muted-foreground mt-1">
          Review and resolve AI-flagged irregularities in patient health data.
        </p>
      </div>

      <AnomalyList anomalies={anomalies} onResolve={handleResolve} />
    </motion.div>
  );
}
