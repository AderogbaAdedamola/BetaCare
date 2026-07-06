import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Search,
  Activity,
  FileText,
  TrendingUp,
  User,
  Calendar,
  Building2,
  ChevronDown,
  ChevronUp,
  AlertCircle
} from "lucide-react";
import { usePatient } from "../../../context/PatientContext";

const MOCK_RECORDS = [
  {
    id: "rec_01",
    record_type: "prescription",
    source: "Lagos University Teaching Hospital (LUTH)",
    recorded_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    payload: {
      notes: "Take complete course. Keep well hydrated. Do not skip doses.",
      prescriber: "Dr. Adewale Yusuf",
      items: [
        { name: "Amlodipine", dosage: "5mg", frequency: "Once daily in the morning", duration: "30 days" },
        { name: "Metformin", dosage: "500mg", frequency: "Twice daily after meals", duration: "60 days" },
        { name: "Multivitamin Caps", dosage: "1 cap", frequency: "Once daily", duration: "30 days" }
      ]
    }
  },
  {
    id: "rec_02",
    record_type: "visit_note",
    source: "Reddington Hospital",
    recorded_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    payload: {
      notes: "Patient reports mild dizziness in the mornings. Vitals checked and stable. Advised dietary modifications (reducing salt intake), routine exercise, and compliance checks on medications.",
      prescriber: "Dr. Jane Nwachukwu",
      diagnosis: "Essential Hypertension (Mild)",
      vitals: { systolic: 135, diastolic: 85, pulse: 76 }
    }
  },
  {
    id: "rec_03",
    record_type: "lab_result",
    source: "Reddington Hospital Diagnostic Lab",
    recorded_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    payload: {
      notes: "All metabolic panels are within standard physiological ranges.",
      prescriber: "Pharm. Chidi Egwu",
      test_name: "Fasting Blood Sugar & Lipid Profile",
      results: [
        { test: "Fasting Blood Sugar", value: "92 mg/dL", reference: "70 - 100 mg/dL", status: "normal" },
        { test: "Total Cholesterol", value: "185 mg/dL", reference: "< 200 mg/dL", status: "normal" },
        { test: "HDL (Good Cholesterol)", value: "52 mg/dL", reference: "> 40 mg/dL", status: "normal" }
      ]
    }
  }
];

export default function PatientRecords() {
  const { records: apiRecords } = usePatient();
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [expandedRecordId, setExpandedRecordId] = useState(null);

  // Combine API and mock records, sorting newest first
  const allRecords = useMemo(() => {
    const combined = [...apiRecords];
    // If API returns empty, use MOCK_RECORDS as seed data so UI is beautiful
    if (combined.length === 0) {
      return MOCK_RECORDS;
    }
    return combined.sort((a, b) => new Date(b.recorded_at) - new Date(a.recorded_at));
  }, [apiRecords]);

  // Filtered records
  const filteredRecords = useMemo(() => {
    return allRecords.filter((record) => {
      // Tab filter
      if (activeTab !== "all" && record.record_type !== activeTab) {
        return false;
      }
      // Search filter
      if (search) {
        const query = search.toLowerCase();
        const matchesSource = record.source?.toLowerCase().includes(query);
        const matchesPrescriber = record.payload?.prescriber?.toLowerCase().includes(query);
        const matchesNotes = record.payload?.notes?.toLowerCase().includes(query);
        const matchesDiagnosis = record.payload?.diagnosis?.toLowerCase().includes(query);
        return matchesSource || matchesPrescriber || matchesNotes || matchesDiagnosis;
      }
      return true;
    });
  }, [allRecords, activeTab, search]);

  const toggleExpand = (id) => {
    setExpandedRecordId((prev) => (prev === id ? null : id));
  };

  const getRecordIcon = (type) => {
    switch (type) {
      case "prescription":
        return <Activity size={18} />;
      case "lab_result":
        return <TrendingUp size={18} />;
      case "visit_note":
      default:
        return <FileText size={18} />;
    }
  };

  const getRecordMeta = (record) => {
    switch (record.record_type) {
      case "prescription":
        return {
          title: "Prescription Order",
          badgeColor: "bg-purple-500/10 border-purple-500/20 text-purple-600 dark:text-purple-400",
          summary: `${record.payload?.items?.length || 0} drugs prescribed`
        };
      case "lab_result":
        return {
          title: "Lab Results Report",
          badgeColor: "bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400",
          summary: record.payload?.test_name || "Diagnostic scan uploaded"
        };
      case "visit_note":
      default:
        return {
          title: "Outpatient Consultation",
          badgeColor: "bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400",
          summary: record.payload?.diagnosis || "Routine general checkup"
        };
    }
  };

  const formatDate = (isoString) => {
    if (!isoString) return "";
    return new Date(isoString).toLocaleDateString("en-NG", {
      weekday: "long",
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const tabs = [
    { id: "all", label: "All Records" },
    { id: "visit_note", label: "Consultations" },
    { id: "prescription", label: "Prescriptions" },
    { id: "lab_result", label: "Lab Investigations" },
  ];

  return (
    <div className="space-y-8">
      
      {/* ── Page Header ── */}
      <div>
        <h1
          className="text-3xl font-extrabold text-foreground tracking-tight"
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        >
          Medical Records History
        </h1>
        <p className="text-sm text-muted-foreground mt-1.5">
          Your complete case file follows you. Search, filter, and review details of consultations, drugs, and lab reports.
        </p>
      </div>

      {/* ── Search & Filters ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card border border-border p-4 rounded-2xl">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by hospital, doctor, diagnosis, or keyword…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-muted rounded-xl border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />
        </div>
        
        {/* Responsive tabs */}
        <div className="flex flex-wrap gap-1.5 p-1 bg-muted rounded-xl border border-border">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === tab.id
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Timeline of Records ── */}
      <div className="space-y-4">
        {filteredRecords.length > 0 ? (
          filteredRecords.map((record) => {
            const meta = getRecordMeta(record);
            const isExpanded = expandedRecordId === record.id;
            
            return (
              <div
                key={record.id}
                className={`bg-card border rounded-2xl transition-all duration-300 overflow-hidden ${
                  isExpanded ? "border-primary/30 shadow-sm" : "border-border hover:border-primary/20"
                }`}
              >
                {/* Collapsed Header */}
                <div
                  onClick={() => toggleExpand(record.id)}
                  className="p-5 flex items-center justify-between gap-4 cursor-pointer select-none"
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-11 h-11 rounded-xl border flex items-center justify-center shrink-0 mt-0.5 ${meta.badgeColor}`}>
                      {getRecordIcon(record.record_type)}
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="text-sm font-bold text-foreground">{meta.title}</h4>
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 border rounded-full ${meta.badgeColor}`}>
                          {record.record_type}
                        </span>
                      </div>
                      <p className="text-xs font-medium text-muted-foreground mt-1 flex items-center gap-1">
                        <Building2 size={12} /> {record.source}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1 truncate max-w-sm sm:max-w-md md:max-w-lg">
                        {meta.summary}
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-right flex items-center gap-3 shrink-0">
                    <div className="hidden sm:block">
                      <p className="text-xs font-bold text-foreground">
                        {new Date(record.recorded_at).toLocaleDateString("en-NG", { day: "numeric", month: "short" })}
                      </p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">
                        {new Date(record.recorded_at).getFullYear()}
                      </p>
                    </div>
                    <button className="p-1.5 hover:bg-muted rounded-lg text-muted-foreground transition-colors">
                      {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                  </div>
                </div>

                {/* Expanded Details Pane */}
                <AnimatePresence initial={false}>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: "auto" }}
                      exit={{ height: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                    >
                      <div className="border-t border-border bg-muted/20 p-6 space-y-6">
                        
                        {/* Meta Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="flex items-center gap-3 text-sm">
                            <User size={16} className="text-muted-foreground" />
                            <div>
                              <p className="text-[10px] text-muted-foreground uppercase font-bold">Prescribing Clinician</p>
                              <p className="font-semibold text-foreground">{record.payload?.prescriber || "N/A"}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 text-sm">
                            <Calendar size={16} className="text-muted-foreground" />
                            <div>
                              <p className="text-[10px] text-muted-foreground uppercase font-bold">Uploaded On</p>
                              <p className="font-semibold text-foreground">{formatDate(record.recorded_at)}</p>
                            </div>
                          </div>
                        </div>

                        {/* Consultation Note specific details */}
                        {record.record_type === "visit_note" && (
                          <div className="space-y-4">
                            {record.payload?.vitals && (
                              <div className="bg-background/80 p-4 border border-border rounded-xl">
                                <h5 className="text-xs font-bold uppercase text-muted-foreground mb-3 tracking-wider">Vitals During Consultation</h5>
                                <div className="grid grid-cols-3 gap-4 text-center">
                                  <div>
                                    <span className="text-[10px] text-muted-foreground">Blood Pressure</span>
                                    <p className="font-bold text-foreground text-sm mt-0.5">{record.payload.vitals.systolic}/{record.payload.vitals.diastolic} mmHg</p>
                                  </div>
                                  <div>
                                    <span className="text-[10px] text-muted-foreground">Heart Rate</span>
                                    <p className="font-bold text-foreground text-sm mt-0.5">{record.payload.vitals.pulse} bpm</p>
                                  </div>
                                  <div>
                                    <span className="text-[10px] text-muted-foreground">Status</span>
                                    <p className="font-bold text-emerald-600 text-sm mt-0.5">Stable</p>
                                  </div>
                                </div>
                              </div>
                            )}

                            <div>
                              <h5 className="text-xs font-bold uppercase text-muted-foreground mb-1 tracking-wider">Clinical Impression / Diagnosis</h5>
                              <p className="text-sm font-semibold text-foreground">{record.payload?.diagnosis || "Routine evaluation"}</p>
                            </div>
                          </div>
                        )}

                        {/* Prescription specific table */}
                        {record.record_type === "prescription" && record.payload?.items && (
                          <div>
                            <h5 className="text-xs font-bold uppercase text-muted-foreground mb-3 tracking-wider">Prescribed Medication Routine</h5>
                            <div className="overflow-x-auto rounded-xl border border-border bg-background">
                              <table className="w-full text-left border-collapse text-xs">
                                <thead>
                                  <tr className="bg-muted border-b border-border text-muted-foreground">
                                    <th className="p-3 font-semibold">Medication Name</th>
                                    <th className="p-3 font-semibold">Dosage</th>
                                    <th className="p-3 font-semibold">Frequency</th>
                                    <th className="p-3 font-semibold">Duration</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {record.payload.items.map((drug, i) => (
                                    <tr key={i} className="border-b border-border last:border-0 hover:bg-muted/10">
                                      <td className="p-3 font-bold text-foreground">{drug.name}</td>
                                      <td className="p-3 font-medium text-foreground">{drug.dosage}</td>
                                      <td className="p-3 font-medium text-foreground">{drug.frequency}</td>
                                      <td className="p-3 font-medium text-foreground">{drug.duration}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        )}

                        {/* Lab results specific view */}
                        {record.record_type === "lab_result" && record.payload?.results && (
                          <div>
                            <h5 className="text-xs font-bold uppercase text-muted-foreground mb-3 tracking-wider">Investigative Results panel</h5>
                            <div className="overflow-x-auto rounded-xl border border-border bg-background">
                              <table className="w-full text-left border-collapse text-xs">
                                <thead>
                                  <tr className="bg-muted border-b border-border text-muted-foreground">
                                    <th className="p-3 font-semibold">Test Parameter</th>
                                    <th className="p-3 font-semibold">Observed Value</th>
                                    <th className="p-3 font-semibold">Standard Reference Range</th>
                                    <th className="p-3 font-semibold">Status</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {record.payload.results.map((item, i) => (
                                    <tr key={i} className="border-b border-border last:border-0 hover:bg-muted/10">
                                      <td className="p-3 font-bold text-foreground">{item.test}</td>
                                      <td className="p-3 font-bold text-emerald-600 dark:text-emerald-400">{item.value}</td>
                                      <td className="p-3 font-medium text-muted-foreground">{item.reference}</td>
                                      <td className="p-3">
                                        <span className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full font-bold text-[10px] uppercase">
                                          {item.status}
                                        </span>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        )}

                        {/* Global Clinical Notes Block */}
                        <div>
                          <h5 className="text-xs font-bold uppercase text-muted-foreground mb-1.5 tracking-wider">Clinician's Advice & Summary</h5>
                          <p className="text-xs text-muted-foreground leading-relaxed bg-background p-4 rounded-xl border border-border">
                            {record.payload?.notes || "No clinical advisory comments appended to this upload."}
                          </p>
                        </div>

                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })
        ) : (
          <div className="bg-card border border-border p-12 text-center text-muted-foreground flex flex-col items-center justify-center gap-3 rounded-2xl">
            <AlertCircle size={32} className="text-muted-foreground/50" />
            <p className="text-sm font-semibold">No records match your query.</p>
            <p className="text-xs text-muted-foreground">Try clearing your filters or testing with a different search term.</p>
          </div>
        )}
      </div>

    </div>
  );
}
