import { motion } from "motion/react";
import { Link } from "react-router";
import { Building2, ShieldCheck, UserCheck, Webhook, Users, History } from "lucide-react";

const STATS = [
  { label: "Consented Patients", value: "2,450", icon: ShieldCheck, color: "text-emerald-500", bg: "bg-emerald-500/10" },
  { label: "Active Staff", value: "84", icon: UserCheck, color: "text-blue-500", bg: "bg-blue-500/10" },
  { label: "API Integrations", value: "Active", icon: Webhook, color: "text-indigo-500", bg: "bg-indigo-500/10" },
];

const RECENT_STAFF = [
  { id: "usr-101", name: "Dr. Sarah Lee", role: "doctor" },
  { id: "usr-105", name: "Dr. Ahmed Musa", role: "doctor" },
  { id: "usr-102", name: "Mark Okafor", role: "hospital_staff" },
];

const RECENT_AUDIT_LOGS = [
  { timestamp: "2 mins ago", action: "READ", entity: "medical_records", actor: "dr_johnson" },
  { timestamp: "15 mins ago", action: "CREATE", entity: "medical_records", actor: "dr_johnson" },
  { timestamp: "1 hour ago", action: "UPDATE", entity: "consent_grants", actor: "hospital_admin_1" },
];

export default function HospitalDashboard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-3">
           <Building2 className="text-primary" /> Hospital Administration
        </h1>
        <p className="text-muted-foreground mt-1">Overview of your institution's BetaCare integration and activity.</p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {STATS.map((stat, i) => (
          <div key={i} className="bg-card border border-border rounded-xl p-6 flex items-center gap-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${stat.bg} ${stat.color}`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">{stat.label}</p>
              <h2 className="text-3xl font-bold text-foreground mt-1">{stat.value}</h2>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Recent Staff Directory */}
        <div className="bg-card border border-border rounded-xl flex flex-col">
          <div className="p-6 border-b border-border flex items-center justify-between">
            <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
              <Users className="text-blue-500" size={20} /> Staff Roster
            </h3>
            <Link to="/hospital/staff" className="text-sm font-medium text-primary hover:underline">
              Add Staff
            </Link>
          </div>
          <div className="p-6 flex-1">
            <div className="space-y-4">
              {RECENT_STAFF.map((user, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div>
                    <h4 className="font-semibold text-foreground">{user.name}</h4>
                    <p className="text-sm text-muted-foreground capitalize">Role: {user.role.replace("_", " ")}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="p-4 bg-muted/30 border-t border-border text-center">
             <Link to="/hospital/staff" className="text-sm font-medium text-primary hover:underline">Manage All Staff</Link>
          </div>
        </div>

        {/* Recent Audit Logs */}
        <div className="bg-card border border-border rounded-xl flex flex-col">
          <div className="p-6 border-b border-border flex items-center justify-between">
            <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
              <History className="text-muted-foreground" size={20} /> Recent Access Logs
            </h3>
          </div>
          <div className="p-6 flex-1">
            <div className="space-y-4">
              {RECENT_AUDIT_LOGS.map((log, i) => (
                <div key={i} className="flex items-center justify-between border-b border-border last:border-0 pb-4 last:pb-0">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 text-[10px] font-bold bg-secondary text-foreground rounded-full uppercase tracking-wider">{log.action}</span>
                      <span className="text-sm font-medium text-foreground">{log.entity}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">By {log.actor} • {log.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="p-4 bg-muted/30 border-t border-border text-center">
             <Link to="/hospital/audit-log" className="text-sm font-medium text-primary hover:underline">View Full Audit Log</Link>
          </div>
        </div>

      </div>
    </motion.div>
  );
}