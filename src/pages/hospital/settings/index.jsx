import { motion } from "motion/react";
import { IntegrationForm } from "./components/IntegrationForm";

export default function HospitalSettings() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 max-w-3xl"
    >
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Integration Settings
        </h1>
        <p className="text-muted-foreground mt-1">
          Configure API keys and webhooks for syncing BetaCare with your existing hospital systems.
        </p>
      </div>

      <IntegrationForm />
    </motion.div>
  );
}
