import { useState } from "react";
import { motion } from "motion/react";
import { AuditTable } from "./components/AuditTable";

const MOCK_LOGS = [
  {
    id: "log-1",
    timestamp: "2026-07-13T10:15:30Z",
    actor_id: "dr_johnson",
    action: "READ",
    target_entity: "medical_records",
    target_id: "PAT-001"
  },
  {
    id: "log-2",
    timestamp: "2026-07-13T11:05:00Z",
    actor_id: "dr_johnson",
    action: "CREATE",
    target_entity: "medical_records",
    target_id: "rec-4"
  },
  {
    id: "log-3",
    timestamp: "2026-07-12T14:22:10Z",
    actor_id: "hospital_admin_1",
    action: "UPDATE",
    target_entity: "consent_grants",
    target_id: "cg-098"
  }
];

export default function HospitalAuditLog() {
  const [logs] = useState(MOCK_LOGS);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Audit Logs
        </h1>
        <p className="text-muted-foreground mt-1">
          Review access history for compliance and security auditing.
        </p>
      </div>

      <AuditTable logs={logs} />
    </motion.div>
  );
}
