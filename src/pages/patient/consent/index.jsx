import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ShieldAlert,
  ShieldCheck,
  Building2,
  Calendar,
  Clock,
  Trash2,
  Plus,
  Loader2,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { usePatient, INTEGRATED_HOSPITALS } from "../../../context/PatientContext";
import { toast } from "sonner";

export default function PatientConsent() {
  const { consents, grantConsent, revokeConsent } = usePatient();
  const [selectedHospital, setSelectedHospital] = useState("");
  const [scopes, setScopes] = useState(["visit_note", "prescription"]); // defaults
  const [duration, setDuration] = useState("7"); // days default
  const [loading, setLoading] = useState(false);
  const [revokingId, setRevokingId] = useState(null);

  const scopeLabels = {
    visit_note: "Consultation Notes",
    prescription: "Prescription Records",
    lab_result: "Lab Reports & Vitals",
  };

  const handleToggleScope = (scopeKey) => {
    setScopes((prev) =>
      prev.includes(scopeKey)
        ? prev.filter((s) => s !== scopeKey)
        : [...prev, scopeKey]
    );
  };

  const handleGrant = async (e) => {
    e.preventDefault();
    if (!selectedHospital) {
      toast.error("Please select a hospital first.");
      return;
    }
    if (scopes.length === 0) {
      toast.error("Please select at least one record type to share.");
      return;
    }

    setLoading(true);
    try {
      await grantConsent(selectedHospital, scopes, Number(duration));
      toast.success("Access successfully authorized!");
      // Reset form
      setSelectedHospital("");
      setScopes(["visit_note", "prescription"]);
      setDuration("7");
    } catch (err) {
      toast.error(err.message || "Failed to grant consent. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRevoke = async (consentId) => {
    setRevokingId(consentId);
    try {
      await revokeConsent(consentId);
      toast.success("Hospital access revoked instantly.");
    } catch (err) {
      toast.error(err.message || "Failed to revoke consent. Try again.");
    } finally {
      setRevokingId(null);
    }
  };

  // Helper to format date with time
  const formatDateTime = (isoString) => {
    if (!isoString) return "";
    return new Date(isoString).toLocaleString("en-NG", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Get active vs expired consents
  const activeConsents = consents.filter((c) => new Date(c.expires_at) > new Date());

  // Available hospitals to grant (exclude those that already have active consents to avoid confusion)
  const availableHospitals = INTEGRATED_HOSPITALS.filter(
    (h) => !activeConsents.some((ac) => ac.hospital_id === h.id)
  );

  return (
    <div className="space-y-10">
      
      {/* ── Page Header ── */}
      <div>
        <h1
          className="text-3xl font-extrabold text-foreground tracking-tight"
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        >
          Consent & Shared Access Controls
        </h1>
        <p className="text-sm text-muted-foreground mt-1.5">
          You own your medical records. BetaCare-integrated hospitals can only query your logs, vitals, or files with your explicit, time-bound authorization.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left/Middle Column: Active access list */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-bold tracking-tight text-foreground" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Hospitals with Active Access
          </h2>

          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {activeConsents.length > 0 ? (
                activeConsents.map((consent) => (
                  <motion.div
                    key={consent.id}
                    layout
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.25 }}
                    className="bg-card border border-border rounded-2xl p-6 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-primary/20 transition-all"
                  >
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-500" />
                    
                    <div className="space-y-4 flex-1">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/15 flex items-center justify-center text-primary shrink-0 mt-0.5">
                          <Building2 size={18} />
                        </div>
                        <div>
                          <h3 className="font-bold text-base text-foreground leading-snug">{consent.hospital_name}</h3>
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {consent.scope.map((s) => (
                              <span
                                key={s}
                                className="text-[10px] font-bold uppercase tracking-wide bg-secondary text-primary px-2.5 py-0.5 border border-primary/10 rounded-full"
                              >
                                {scopeLabels[s] || s}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-muted-foreground pt-2 border-t border-border/80">
                        <span className="flex items-center gap-1.5">
                          <Calendar size={14} className="text-muted-foreground/75" />
                          Authorized: {formatDateTime(consent.granted_at)}
                        </span>
                        <span className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 font-medium">
                          <Clock size={14} className="current-color" />
                          Expires: {formatDateTime(consent.expires_at)}
                        </span>
                      </div>
                    </div>

                    <div className="shrink-0 md:self-center">
                      <button
                        onClick={() => handleRevoke(consent.id)}
                        disabled={revokingId === consent.id}
                        className="w-full md:w-auto flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-destructive/20 hover:border-destructive/35 hover:bg-destructive/10 text-destructive text-xs font-bold transition-all disabled:opacity-50 cursor-pointer"
                      >
                        {revokingId === consent.id ? (
                          <>
                            <Loader2 size={14} className="animate-spin" /> Revoking…
                          </>
                        ) : (
                          <>
                            <Trash2 size={14} /> Revoke Access
                          </>
                        )}
                      </button>
                    </div>
                  </motion.div>
                ))
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-card border border-border p-12 text-center text-muted-foreground flex flex-col items-center justify-center gap-4 rounded-2xl"
                >
                  <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center text-muted-foreground/60">
                    <ShieldAlert size={24} />
                  </div>
                  <div className="max-w-sm">
                    <p className="font-bold text-foreground text-sm">No hospitals currently have access</p>
                    <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                      Your records are locked. Hospitals won't be able to query your profiles or push reports until you grant them access.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Right Column: Authorize New Access Widget */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold tracking-tight text-foreground" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Authorize New Access
          </h2>

          <div className="bg-card border border-border rounded-3xl p-6 shadow-sm">
            <form onSubmit={handleGrant} className="space-y-5">
              
              {/* Select Hospital */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase text-muted-foreground tracking-wider">Select Hospital</label>
                <select
                  required
                  value={selectedHospital}
                  onChange={(e) => setSelectedHospital(e.target.value)}
                  className="w-full px-4 py-3 bg-muted rounded-xl border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none cursor-pointer"
                >
                  <option value="">Choose integrated facility…</option>
                  {availableHospitals.map((h) => (
                    <option key={h.id} value={h.id}>
                      {h.name} ({h.state})
                    </option>
                  ))}
                  {availableHospitals.length === 0 && (
                    <option disabled>No additional hospitals integrated</option>
                  )}
                </select>
              </div>

              {/* Scopes Checklist */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-muted-foreground tracking-wider block mb-1">Access Scope</label>
                {Object.entries(scopeLabels).map(([key, label]) => {
                  const isChecked = scopes.includes(key);
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => handleToggleScope(key)}
                      className={`flex items-center gap-3 w-full p-3 rounded-xl border text-left text-xs font-semibold transition-all ${
                        isChecked
                          ? "bg-primary/10 border-primary/20 text-primary"
                          : "bg-muted border-border text-muted-foreground hover:border-primary/20"
                      }`}
                    >
                      <div className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-all ${
                        isChecked ? "bg-primary border-primary text-white" : "border-muted-foreground/60"
                      }`}>
                        {isChecked && <CheckCircle2 size={10} className="text-primary-foreground" />}
                      </div>
                      {label}
                    </button>
                  );
                })}
              </div>

              {/* Expiry / Duration presets */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-muted-foreground tracking-wider block mb-1">Access Expiration</label>
                <div className="grid grid-cols-4 gap-1.5 p-1 bg-muted rounded-xl border border-border">
                  {[
                    { days: "1", label: "24h" },
                    { days: "7", label: "7d" },
                    { days: "30", label: "30d" },
                    { days: "90", label: "90d" }
                  ].map((preset) => (
                    <button
                      key={preset.days}
                      type="button"
                      onClick={() => setDuration(preset.days)}
                      className={`py-2 rounded-lg text-[10px] font-bold tracking-wider uppercase transition-all cursor-pointer ${
                        duration === preset.days
                          ? "bg-background text-foreground shadow-sm font-black border border-border/80"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading || availableHospitals.length === 0}
                  className="w-full flex items-center justify-center gap-2 py-3.5 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/95 transition-colors disabled:opacity-50 text-sm cursor-pointer shadow-sm"
                >
                  {loading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" /> Authorizing Access…
                    </>
                  ) : (
                    <>
                      <Plus size={16} /> Authorize Sharing Access
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>
        </div>

      </div>

    </div>
  );
}
