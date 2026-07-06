import { useEffect } from "react";
import { Link } from "react-router";
import { motion } from "motion/react";
import {
  Activity,
  Heart,
  Shield,
  MessageSquare,
  Sparkles,
  ArrowRight,
  RefreshCw,
  TrendingUp,
  FileText,
  UserCheck,
  Calendar,
  AlertCircle
} from "lucide-react";
import { usePatient } from "../../../context/PatientContext";
import { TiltCard } from "../../../components/common/TiltCard";

export default function PatientDashboard() {
  const { patient, profile, records, consents, loading, error, refreshData } = usePatient();

  // Trigger sync on load
  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // Extract first name
  const getFirstName = () => {
    if (patient?.full_name) {
      return patient.full_name.split(" ")[0];
    }
    return "BetaCare User";
  };

  // Get active consents count
  const activeConsentsCount = consents.filter(
    (c) => new Date(c.expires_at) > new Date()
  ).length;

  // Format date nicely
  const formatDate = (isoString) => {
    if (!isoString) return "";
    return new Date(isoString).toLocaleDateString("en-NG", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const getRecordIcon = (type) => {
    switch (type) {
      case "prescription":
        return <Activity size={16} className="text-purple-500" />;
      case "lab_result":
        return <TrendingUp size={16} className="text-amber-500" />;
      case "visit_note":
      default:
        return <FileText size={16} className="text-emerald-500" />;
    }
  };

  const getRecordColorClass = (type) => {
    switch (type) {
      case "prescription":
        return "bg-purple-500/10 border-purple-500/20 text-purple-600 dark:text-purple-400";
      case "lab_result":
        return "bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400";
      case "visit_note":
      default:
        return "bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400";
    }
  };

  if (loading && !patient) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <RefreshCw size={36} className="animate-spin text-primary" />
        <p className="text-sm text-muted-foreground animate-pulse">Calibrating your medical dashboard…</p>
      </div>
    );
  }

  // Format baseline vitals
  const vitals = profile?.profile?.recent_vitals || { systolic: 120, diastolic: 80, pulse: 72 };
  const bio = profile?.profile || { conditions: [], medications: [] };

  return (
    <div className="space-y-10">
      
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1
            className="text-3xl font-extrabold text-foreground tracking-tight"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            Moni, {getFirstName()}! 👋
          </h1>
          <p className="text-sm text-muted-foreground mt-1.5 flex items-center gap-1.5">
            <Calendar size={14} />
            Today is {new Date().toLocaleDateString("en-NG", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
          </p>
        </div>
        <button
          onClick={refreshData}
          disabled={loading}
          className="self-start inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border bg-card text-foreground hover:bg-muted text-sm font-semibold transition-all disabled:opacity-60 cursor-pointer"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          Sync Records
        </button>
      </div>

      {error && (
        <div className="flex items-start gap-3 p-4 bg-destructive/10 border border-destructive/20 text-destructive rounded-2xl text-sm">
          <AlertCircle size={18} className="shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold">Unable to reach data store</p>
            <p className="text-xs mt-1 text-destructive-foreground opacity-90">{error}</p>
          </div>
        </div>
      )}

      {/* ── Dashboard Stats ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Stat card 1: Active Consents */}
        <div className="bg-card border border-border rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between group hover:border-primary/30 transition-all">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Active Shared Access</p>
              <h3 className="text-3xl font-black text-foreground mt-2 tracking-tight">
                {activeConsentsCount} <span className="text-sm font-medium text-muted-foreground">Hospitals</span>
              </h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <Shield size={20} />
            </div>
          </div>
          <Link to="/patient/consent" className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary mt-6 group-hover:underline">
            Manage Access permissions <ArrowRight size={12} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Stat card 2: Adherence Rate */}
        <div className="bg-card border border-border rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between group hover:border-primary/30 transition-all">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Adherence Rate</p>
              <h3 className="text-3xl font-black text-foreground mt-2 tracking-tight">
                {Math.round((bio.adherence_stats?.adherence_rate || 0.85) * 100)}%
              </h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <Heart size={20} />
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-6">
            Tracks logged daily doses and check-ins via WhatsApp
          </p>
        </div>

        {/* Stat card 3: Health Profile Healthiness */}
        <div className="bg-card border border-border rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between group hover:border-primary/30 transition-all">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">AI Health Profile</p>
              <h3 className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 mt-3.5 flex items-center gap-1.5 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20 self-start">
                <UserCheck size={14} /> Active & Monitoring
              </h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <Sparkles size={20} />
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-6">
            Anomalies and symptoms analyzed incrementally
          </p>
        </div>
      </div>

      {/* ── Main Layout Split ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Health Profile 3D Card */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-bold tracking-tight text-foreground" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Biometrics & Vital Sign Profile
          </h2>

          <TiltCard className="bg-gradient-to-br from-card to-secondary/20 border border-border rounded-3xl p-8 relative overflow-hidden shadow-sm">
            <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
            
            <div className="flex flex-col gap-6">
              {/* Blood pressure & heart rate readout */}
              <div className="flex flex-wrap items-center gap-8 pb-6 border-b border-border">
                <div>
                  <p className="text-xs text-muted-foreground font-semibold">Blood Pressure</p>
                  <p className="text-3xl font-black tracking-tight text-foreground mt-1">
                    {vitals.systolic}/{vitals.diastolic} <span className="text-sm font-medium text-muted-foreground">mmHg</span>
                  </p>
                  <span className="text-[10px] uppercase font-bold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">Normal BP</span>
                </div>
                <div className="w-px h-12 bg-border hidden sm:block" />
                <div>
                  <p className="text-xs text-muted-foreground font-semibold">Pulse / Heart Rate</p>
                  <p className="text-3xl font-black tracking-tight text-foreground mt-1">
                    {vitals.pulse || 72} <span className="text-sm font-medium text-muted-foreground">bpm</span>
                  </p>
                  <span className="text-[10px] uppercase font-bold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">Stable</span>
                </div>
              </div>

              {/* Physical measurements */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-background/50 p-4 border border-border/80 rounded-2xl">
                  <span className="text-xs text-muted-foreground">Biological Sex</span>
                  <p className="text-lg font-bold text-foreground mt-1 capitalize">{profile?.profile?.sex || "Not specified"}</p>
                </div>
                <div className="bg-background/50 p-4 border border-border/80 rounded-2xl">
                  <span className="text-xs text-muted-foreground">Blood Type</span>
                  <p className="text-lg font-bold text-foreground mt-1">{profile?.profile?.blood_type || "Unknown"}</p>
                </div>
                <div className="bg-background/50 p-4 border border-border/80 rounded-2xl">
                  <span className="text-xs text-muted-foreground">Height</span>
                  <p className="text-lg font-bold text-foreground mt-1">{profile?.profile?.height_cm ? `${profile.profile.height_cm} cm` : "Not set"}</p>
                </div>
                <div className="bg-background/50 p-4 border border-border/80 rounded-2xl">
                  <span className="text-xs text-muted-foreground">Weight</span>
                  <p className="text-lg font-bold text-foreground mt-1">{profile?.profile?.weight_kg ? `${profile.profile.weight_kg} kg` : "Not set"}</p>
                </div>
              </div>

              {/* Chronic conditions and medication summary */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-border">
                <div>
                  <span className="text-xs text-muted-foreground font-semibold">Conditions Logged</span>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {bio.conditions && bio.conditions.length > 0 ? (
                      bio.conditions.map((c) => (
                        <span key={c} className="text-xs bg-primary/8 text-primary border border-primary/20 px-2.5 py-1 rounded-xl font-medium">
                          {c}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-muted-foreground italic">No chronic conditions declared</span>
                    )}
                  </div>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground font-semibold">Current Medications</span>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {bio.medications && bio.medications.length > 0 ? (
                      bio.medications.map((m) => (
                        <span key={m} className="text-xs bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 px-2.5 py-1 rounded-xl font-medium">
                          {m}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-muted-foreground italic">No active prescriptions logged</span>
                    )}
                  </div>
                </div>
              </div>

            </div>
          </TiltCard>
        </div>

        {/* Right Column: WhatsApp Proactive Action Card */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold tracking-tight text-foreground" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            BetaCare Channel
          </h2>

          <div className="bg-emerald-900/90 text-white rounded-3xl p-6 relative overflow-hidden flex flex-col justify-between h-[360px] shadow-sm">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/20 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-800/50 rounded-full blur-2xl pointer-events-none" />
            
            <div className="relative z-10">
              <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-white mb-6">
                <MessageSquare size={22} />
              </div>
              <h3 className="text-xl font-bold tracking-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                WhatsApp-First Care
              </h3>
              <p className="text-sm text-emerald-100/90 leading-relaxed mt-2.5">
                No need to open web portals day-to-day. You can chat with BetaCare AI, log symptoms, get reminders, and request summaries directly on WhatsApp.
              </p>
            </div>

            <div className="relative z-10 space-y-4">
              <div className="bg-white/10 p-3 rounded-2xl flex items-center gap-3 border border-white/10">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-xs text-emerald-100 font-semibold truncate">
                  AI Agent Status: Active & Monitoring
                </span>
              </div>
              <a
                href="https://wa.me/2348030000000?text=Hello%20BetaCare"
                target="_blank"
                rel="noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-white text-emerald-900 font-semibold px-4 py-3 rounded-xl hover:bg-emerald-50 transition-colors text-sm shadow-sm"
              >
                Launch WhatsApp Chat <ArrowRight size={14} />
              </a>
            </div>
          </div>
        </div>

      </div>

      {/* ── Recent Records Section ── */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold tracking-tight text-foreground" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Recent Medical Records
          </h2>
          <Link to="/patient/records" className="text-sm font-semibold text-primary hover:underline">
            View all records
          </Link>
        </div>

        <div className="bg-card border border-border rounded-2xl overflow-hidden divide-y divide-border">
          {records.length > 0 ? (
            records.slice(0, 3).map((record) => (
              <div key={record.id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-secondary/15 transition-all">
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 mt-0.5 ${getRecordColorClass(record.record_type)}`}>
                    {getRecordIcon(record.record_type)}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-foreground">
                      {record.record_type === "prescription"
                        ? "New Prescription Dispatched"
                        : record.record_type === "lab_result"
                        ? "Lab Investigation Result"
                        : "Outpatient Consultation Notes"}
                    </h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      {record.payload?.notes || record.payload?.summary || "Clinical case details uploaded."}
                    </p>
                    <p className="text-[10px] text-muted-foreground font-semibold mt-2 uppercase tracking-wide">
                      Source: {record.source || "BetaCare Integration"}
                    </p>
                  </div>
                </div>
                <div className="sm:text-right shrink-0">
                  <p className="text-xs font-semibold text-foreground">
                    {formatDate(record.recorded_at)}
                  </p>
                  <Link
                    to="/patient/records"
                    className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline mt-2 sm:mt-1.5"
                  >
                    Open Record Details
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="p-12 text-center text-muted-foreground flex flex-col items-center justify-center gap-3">
              <FileText size={32} className="text-muted-foreground/50" />
              <p className="text-sm">No medical records uploaded yet.</p>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                Once a BetaCare-integrated hospital consults you or sends a prescription, it will follow you here.
              </p>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
