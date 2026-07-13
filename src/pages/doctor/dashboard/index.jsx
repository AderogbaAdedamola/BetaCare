import { motion } from "motion/react";
import { Link } from "react-router";
import { Users, AlertCircle, MessageSquare, Search, FileText, Activity } from "lucide-react";

const STATS = [
  { label: "Assigned Patients", value: "145", icon: Users, color: "text-blue-500", bg: "bg-blue-500/10" },
  { label: "Pending Flags", value: "3", icon: AlertCircle, color: "text-destructive", bg: "bg-destructive/10" },
  { label: "Unread Messages", value: "8", icon: MessageSquare, color: "text-emerald-500", bg: "bg-emerald-500/10" },
];

const URGENT_ANOMALIES = [
  { id: "PAT-001", name: "Ahmed Musa", desc: "Missed anti-hypertensive medication for 3 days." },
  { id: "PAT-012", name: "Bisi Adeyemi", desc: "Blood sugar trending upwards (130 mg/dL fasting)." },
];

const RECENT_PATIENTS = [
  { id: "PAT-005", name: "Fatima Bello", lastVisit: "2 hours ago" },
  { id: "PAT-001", name: "Ahmed Musa", lastVisit: "Yesterday" },
  { id: "PAT-042", name: "Chinedu Okeke", lastVisit: "3 days ago" },
];

export default function DoctorDashboard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Welcome back, Dr. Johnson</h1>
        <p className="text-muted-foreground mt-1">Here is a summary of your patients and tasks for today.</p>
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Urgent Flags */}
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                <AlertCircle className="text-destructive" size={20} /> Urgent AI Flags
              </h3>
              <Link to="/doctor/anomalies" className="text-sm font-medium text-primary hover:underline">View All</Link>
            </div>
            <div className="space-y-3">
              {URGENT_ANOMALIES.map((anomaly, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div>
                    <h4 className="font-semibold text-foreground">{anomaly.name} <span className="text-muted-foreground text-sm font-normal">({anomaly.id})</span></h4>
                    <p className="text-sm text-muted-foreground mt-0.5">{anomaly.desc}</p>
                  </div>
                  <Link to={`/doctor/patients/${anomaly.id}`} className="shrink-0 px-3 py-1.5 bg-background border border-border hover:bg-muted text-sm font-medium rounded-md transition-colors">
                    Review
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-card border border-border rounded-xl p-6">
             <h3 className="text-lg font-bold text-foreground mb-4">Quick Actions</h3>
             <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Link to="/doctor/patients" className="flex flex-col items-center justify-center gap-2 p-4 bg-muted hover:bg-muted/80 rounded-xl transition-colors border border-border">
                  <Search className="text-primary" size={24} />
                  <span className="font-medium text-sm">Search Patient</span>
                </Link>
                <Link to="/doctor/patients/add-note" className="flex flex-col items-center justify-center gap-2 p-4 bg-muted hover:bg-muted/80 rounded-xl transition-colors border border-border">
                  <FileText className="text-emerald-500" size={24} />
                  <span className="font-medium text-sm">Add Visit Note</span>
                </Link>
                <Link to="/doctor/anomalies" className="flex flex-col items-center justify-center gap-2 p-4 bg-muted hover:bg-muted/80 rounded-xl transition-colors border border-border">
                  <Activity className="text-destructive" size={24} />
                  <span className="font-medium text-sm">Review Anomalies</span>
                </Link>
             </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          <div className="bg-card border border-border rounded-xl p-6 h-full">
            <h3 className="text-lg font-bold text-foreground mb-4">Recently Viewed</h3>
            <div className="space-y-4">
              {RECENT_PATIENTS.map((patient, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div>
                    <Link to={`/doctor/patients/${patient.id}`} className="font-medium text-foreground hover:text-primary transition-colors">
                      {patient.name}
                    </Link>
                    <p className="text-xs text-muted-foreground">{patient.id} • {patient.lastVisit}</p>
                  </div>
                </div>
              ))}
            </div>
            <Link to="/doctor/patients" className="block text-center mt-6 text-sm font-medium text-primary hover:underline">
              View all patients
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
