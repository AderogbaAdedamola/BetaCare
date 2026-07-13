import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import { ArrowLeft } from "lucide-react";
import { motion } from "motion/react";
import { NoteForm } from "./components/NoteForm";

export default function DoctorAddNote() {
  const [searchParams] = useSearchParams();
  const patientId = searchParams.get("patientId") || "Unknown Patient";
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data) => {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise((res) => setTimeout(res, 800));
    setIsSubmitting(false);
    navigate(`/doctor/patients/${patientId}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 max-w-2xl mx-auto"
    >
      <div className="flex items-center gap-4">
        <Link
          to={`/doctor/patients/${patientId !== "Unknown Patient" ? patientId : ""}`}
          className="p-2 -ml-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-xl transition-colors"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Add New Record
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Patient ID: {patientId}
          </p>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl p-6 md:p-8">
        <NoteForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
      </div>
    </motion.div>
  );
}
