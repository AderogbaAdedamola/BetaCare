import { useState, useEffect } from "react";
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
  AlertCircle,
  QrCode,
  Copy,
  Heart,
  Download,
  Share2,
  ChevronDown
} from "lucide-react";
import { usePatient, INTEGRATED_HOSPITALS, MOCK_DOCTORS } from "../../../context/PatientContext";
import { toast } from "sonner";

export default function PatientConsent() {
  const { consents, grantConsent, revokeConsent } = usePatient();
  const [activeTab, setActiveTab] = useState("hospital"); // "hospital" or "doctor"
  const [selectedEntity, setSelectedEntity] = useState("");
  const [scopes, setScopes] = useState(["visit_note", "prescription"]); // defaults
  const [duration, setDuration] = useState("7"); // days default
  const [historyRange, setHistoryRange] = useState("all"); // "all" | "30d" | "6m" | "1y"
  const [loading, setLoading] = useState(false);
  const [revokingId, setRevokingId] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // QR & Connection String states
  const [shareScopes, setShareScopes] = useState(["visit_note", "prescription"]);
  const [generatedCode, setGeneratedCode] = useState(null);
  const [activeCodes, setActiveCodes] = useState(() => {
    const saved = localStorage.getItem("betacare_shared_codes");
    return saved ? JSON.parse(saved) : [];
  });
  const [pendingRequests, setPendingRequests] = useState(() => {
    const saved = localStorage.getItem("betacare_pending_requests");
    return saved ? JSON.parse(saved) : [];
  });
  const [copiedCode, setCopiedCode] = useState(null);
  const [rightPanelTab, setRightPanelTab] = useState("direct"); // "direct" or "qr"

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem("betacare_shared_codes", JSON.stringify(activeCodes));
  }, [activeCodes]);

  useEffect(() => {
    localStorage.setItem("betacare_pending_requests", JSON.stringify(pendingRequests));
  }, [pendingRequests]);

  const scopeLabels = {
    visit_note: "Consultation Notes",
    prescription: "Prescription Records",
    lab_result: "Lab Reports & Vitals",
  };

  const handleGenerateCode = () => {
    if (shareScopes.length === 0) {
      toast.error("Please select at least one scope to share.");
      return;
    }

    // Generate a longer, hyphenated connection string: BC-SHARE-XXXX-XXXX-XXXX-XXXX
    const randSegment = () => Math.random().toString(36).substring(2, 6).toUpperCase();
    const code = `BC-SHARE-${randSegment()}-${randSegment()}-${randSegment()}-${randSegment()}`;

    const expiresAt = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(); // expires after 2 days

    const newCode = {
      id: `code_${Date.now()}`,
      code,
      scopes: shareScopes,
      expiresAt,
      revoked: false
    };

    setActiveCodes(prev => [newCode, ...prev]);
    setGeneratedCode(newCode);
    toast.success("Shareable QR Code & Connection String generated!");

    // Simulate someone attempting to connect using the generated code after 4.5 seconds
    setTimeout(() => {
      // Pick a random entity from available integrated entities
      const allEntities = [
        ...INTEGRATED_HOSPITALS.map(h => ({ id: h.id, name: h.name, is_doctor: false })),
        ...MOCK_DOCTORS.map(d => ({ id: d.id, name: `${d.name} (${d.specialty})`, is_doctor: true }))
      ];
      // Filter out entities that already have active consents or active pending requests
      const availableToRequest = allEntities.filter(
        entity => !consents.some(c => c.hospital_id === entity.id) &&
          !pendingRequests.some(pr => pr.entityId === entity.id)
      );

      if (availableToRequest.length > 0) {
        const selectedEntity = availableToRequest[Math.floor(Math.random() * availableToRequest.length)];
        const newRequest = {
          id: `req_${Date.now()}`,
          entityId: selectedEntity.id,
          entityName: selectedEntity.name,
          is_doctor: selectedEntity.is_doctor,
          code: code,
          scopes: shareScopes,
          receivedAt: new Date().toISOString()
        };
        setPendingRequests(prev => {
          // Double check if code wasn't revoked in the meantime
          const codes = JSON.parse(localStorage.getItem("betacare_shared_codes") || "[]");
          const currentCode = codes.find(c => c.code === code);
          if (currentCode && !currentCode.revoked) {
            toast.info(`New request from ${selectedEntity.name} using code ${code}!`);
            return [newRequest, ...prev];
          }
          return prev;
        });
      }
    }, 4500);
  };

  const handleRevokeCode = (codeId) => {
    setActiveCodes(prev =>
      prev.map(c => (c.id === codeId ? { ...c, revoked: true } : c))
    );
    const codeObj = activeCodes.find(c => c.id === codeId);
    if (codeObj) {
      setPendingRequests(prev => prev.filter(r => r.code !== codeObj.code));
      toast.success(`Connection string has been revoked.`);
    }
  };

  // Convert SVG to PNG and download
  const handleDownloadQRPNG = () => {
    if (!generatedCode) return;
    const svgElement = document.getElementById("qr-code-svg");
    if (!svgElement) return;

    try {
      const serializer = new XMLSerializer();
      const svgString = serializer.serializeToString(svgElement);
      const svgBlob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
      const URL = window.URL || window.webkitURL || window;
      const blobURL = URL.createObjectURL(svgBlob);

      const image = new Image();
      image.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = 512;
        canvas.height = 512;
        const context = canvas.getContext("2d");
        context.fillStyle = "#FFFFFF";
        context.fillRect(0, 0, 512, 512);

        context.drawImage(image, 64, 64, 384, 384);
        URL.revokeObjectURL(blobURL);

        const pngURL = canvas.toDataURL("image/png");
        const downloadLink = document.createElement("a");
        downloadLink.href = pngURL;
        downloadLink.download = `betacare-access-qr-${generatedCode.code}.png`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        toast.success("QR Code downloaded as PNG!");
      };
      image.onerror = () => {
        // Fallback to direct SVG download
        const downloadLink = document.createElement("a");
        downloadLink.href = blobURL;
        downloadLink.download = `betacare-access-qr-${generatedCode.code}.svg`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        toast.success("Downloaded as SVG");
      };
      image.src = blobURL;
    } catch (e) {
      toast.error("Failed to generate image download.");
    }
  };

  // Share generated QR code using Web Share API
  const handleShareQR = async () => {
    if (!generatedCode) return;
    const svgElement = document.getElementById("qr-code-svg");
    if (!svgElement) return;

    const shareText = `BetaCare Secure Connection String:\n${generatedCode.code}\n\nAllowed Scopes:\n${generatedCode.scopes.map(s => scopeLabels[s] || s).join(", ")}`;

    const copyToClipboardFallback = (text) => {
      navigator.clipboard.writeText(text);
      toast.success("Copied connection details to clipboard!");
    };

    try {
      const serializer = new XMLSerializer();
      const svgString = serializer.serializeToString(svgElement);
      const svgBlob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
      const URL = window.URL || window.webkitURL || window;
      const blobURL = URL.createObjectURL(svgBlob);

      const image = new Image();
      image.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = 512;
        canvas.height = 512;
        const context = canvas.getContext("2d");
        context.fillStyle = "#FFFFFF";
        context.fillRect(0, 0, 512, 512);
        context.drawImage(image, 64, 64, 384, 384);
        URL.revokeObjectURL(blobURL);

        canvas.toBlob(async (blob) => {
          if (!blob) {
            shareTextOnly();
            return;
          }
          const file = new File([blob], `betacare-access-qr-${generatedCode.code}.png`, { type: "image/png" });

          if (navigator.canShare && navigator.canShare({ files: [file] })) {
            try {
              await navigator.share({
                title: "BetaCare Access QR Code",
                text: `Use this secure connection code to access my BetaCare profile:`,
                files: [file]
              });
              toast.success("QR Code shared successfully!");
            } catch (err) {
              if (err.name !== "AbortError") {
                shareTextOnly();
              }
            }
          } else {
            shareTextOnly();
          }
        }, "image/png");
      };
      image.onerror = () => {
        shareTextOnly();
      };
      image.src = blobURL;
    } catch (e) {
      shareTextOnly();
    }

    function shareTextOnly() {
      if (navigator.share) {
        navigator.share({
          title: "BetaCare Access Connection String",
          text: shareText
        }).catch(err => {
          if (err.name !== "AbortError") {
            copyToClipboardFallback(shareText);
          }
        });
      } else {
        copyToClipboardFallback(shareText);
      }
    }
  };

  const handleApproveRequest = async (request) => {
    setLoading(true);
    try {
      await grantConsent(request.entityId, request.scopes, 7);
      setPendingRequests(prev => prev.filter(r => r.id !== request.id));
      toast.success(`Access granted successfully to ${request.entityName}!`);
    } catch (err) {
      toast.error(err.message || "Failed to grant access.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeclineRequest = (requestId) => {
    setPendingRequests(prev => prev.filter(r => r.id !== requestId));
    toast.info("Connection request declined.");
  };

  const handleToggleScope = (scopeKey) => {
    setScopes((prev) =>
      prev.includes(scopeKey)
        ? prev.filter((s) => s !== scopeKey)
        : [...prev, scopeKey]
    );
  };

  const handlePreSubmit = (e) => {
    e.preventDefault();
    if (!selectedEntity) {
      toast.error(`Please select a ${activeTab === "hospital" ? "hospital" : "doctor"} first.`);
      return;
    }
    if (scopes.length === 0) {
      toast.error("Please select at least one record type to share.");
      return;
    }
    setShowConfirmModal(true);
  };

  const handleGrant = async () => {
    setShowConfirmModal(false);
    setLoading(true);
    try {
      await grantConsent(selectedEntity, scopes, Number(duration));
      toast.success("Access successfully authorized!");
      // Reset form
      setSelectedEntity("");
      setScopes(["visit_note", "prescription"]);
      setDuration("7");
      setHistoryRange("all");
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
      toast.success("Access revoked instantly.");
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

  // Available entities to grant
  const availableHospitals = INTEGRATED_HOSPITALS.filter(
    (h) => !activeConsents.some((ac) => ac.hospital_id === h.id)
  );

  const availableDoctors = MOCK_DOCTORS.filter(
    (d) => !activeConsents.some((ac) => ac.hospital_id === d.id)
  );

  const getEntityName = (id) => {
    if (activeTab === "hospital") {
      return INTEGRATED_HOSPITALS.find((h) => h.id === id)?.name || "";
    }
    const doc = MOCK_DOCTORS.find((d) => d.id === id);
    return doc ? `${doc.name} (${doc.specialty})` : "";
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6">

      {/* ── Page Header ── */}
      <div className="border-b border-border/60 pb-6">
        <h1
          className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight bg-gradient-to-r from-foreground via-foreground/90 to-primary/80 bg-clip-text text-transparent"
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        >
          Consent & Shared Access Controls
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground mt-2 max-w-3xl leading-relaxed">
          You own your medical records. BetaCare-integrated hospitals and doctors can only query your logs, vitals, or files with your explicit, time-bound authorization.
        </p>
      </div>

      {/* ── Summary Stats Bar ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card/50 backdrop-blur-sm border border-border/80 rounded-2xl p-5 flex items-center justify-between shadow-sm hover:border-primary/20 transition-all duration-300">
          <div>
            <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Active Consents</p>
            <p className="text-2xl font-black mt-1 text-emerald-600 dark:text-emerald-400">{activeConsents.length}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shadow-inner">
            <ShieldCheck size={20} />
          </div>
        </div>

        <div className="bg-card/50 backdrop-blur-sm border border-border/80 rounded-2xl p-5 flex items-center justify-between shadow-sm hover:border-primary/20 transition-all duration-300">
          <div>
            <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Pending Requests</p>
            <p className="text-2xl font-black mt-1 text-amber-600 dark:text-amber-400">
              {pendingRequests.filter(req => {
                const codeObj = activeCodes.find(c => c.code === req.code);
                return codeObj && !codeObj.revoked;
              }).length}
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center shadow-inner">
            <ShieldAlert size={20} className={pendingRequests.length > 0 ? "animate-pulse" : ""} />
          </div>
        </div>

        <div className="bg-card/50 backdrop-blur-sm border border-border/80 rounded-2xl p-5 flex items-center justify-between shadow-sm hover:border-primary/20 transition-all duration-300">
          <div>
            <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Shared Codes</p>
            <p className="text-2xl font-black mt-1 text-cyan-600 dark:text-cyan-400">
              {activeCodes.filter(c => !c.revoked).length}
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-600 flex items-center justify-center shadow-inner">
            <QrCode size={20} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Left/Middle Column: Active access list */}
        <div className="lg:col-span-2 space-y-8">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Authorized Clinicians & Facilities
            </h2>
            <p className="text-xs text-muted-foreground mt-1">
              Currently active permissions for your health dashboard.
            </p>
          </div>

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
                    className="bg-card/70 backdrop-blur-sm border border-border rounded-2xl p-6 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 group"
                  >
                    <div className={`absolute top-0 left-0 w-1.5 h-full transition-colors duration-300 ${consent.is_doctor ? "bg-cyan-500" : "bg-emerald-500"}`} />

                    <div className="space-y-4 flex-1">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/15 flex items-center justify-center text-primary shrink-0 mt-0.5 group-hover:scale-105 group-hover:bg-primary/20 transition-all duration-300 shadow-sm">
                          <Building2 size={20} />
                        </div>
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-bold text-base text-foreground leading-snug tracking-tight">{consent.hospital_name}</h3>
                            <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${consent.is_doctor ? "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20" : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                              }`}>
                              {consent.is_doctor ? "Doctor" : "Hospital"}
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-1.5 mt-3">
                            {consent.scope.map((s) => (
                              <span
                                key={s}
                                className="text-[10px] font-bold uppercase tracking-wide bg-secondary text-primary px-3 py-1 border border-primary/10 rounded-full shadow-inner"
                              >
                                {scopeLabels[s] || s}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-muted-foreground pt-3 border-t border-border/80">
                        <span className="flex items-center gap-1.5">
                          <Calendar size={14} className="text-muted-foreground/75" />
                          Authorized: {formatDateTime(consent.granted_at)}
                        </span>
                        <span className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 font-semibold">
                          <Clock size={14} className="current-color" />
                          Expires: {formatDateTime(consent.expires_at)}
                        </span>
                      </div>
                    </div>

                    <div className="shrink-0 md:self-center">
                      <button
                        onClick={() => handleRevoke(consent.id)}
                        disabled={revokingId === consent.id}
                        className="w-full md:w-auto flex items-center justify-center gap-1.5 px-4.5 py-3 rounded-xl border border-destructive/20 hover:border-destructive/35 hover:bg-destructive/10 text-destructive text-xs font-bold transition-all duration-200 disabled:opacity-50 cursor-pointer shadow-sm"
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
                  className="bg-card/50 backdrop-blur-sm border border-border p-12 text-center text-muted-foreground flex flex-col items-center justify-center gap-4 rounded-2xl shadow-sm"
                >
                  <div className="w-14 h-14 bg-muted rounded-full flex items-center justify-center text-muted-foreground/60 shadow-inner">
                    <ShieldAlert size={26} />
                  </div>
                  <div className="max-w-sm">
                    <p className="font-bold text-foreground text-sm">No clinicians currently have access</p>
                    <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                      Your records are locked. Hospitals and doctors won't be able to query your profiles or push reports until you grant them access.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Pending Access Requests */}
          {pendingRequests.filter(req => {
            const codeObj = activeCodes.find(c => c.code === req.code);
            return codeObj && !codeObj.revoked;
          }).length > 0 && (
              <div className="space-y-4 mt-8 pt-4 border-t border-border/50">
                <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  <ShieldAlert size={20} className="text-amber-500 animate-pulse" />
                  Pending Access Requests (Validation Required)
                </h2>
                <div className="space-y-4">
                  <AnimatePresence mode="popLayout">
                    {pendingRequests.filter(req => {
                      const codeObj = activeCodes.find(c => c.code === req.code);
                      return codeObj && !codeObj.revoked;
                    }).map((req) => (
                      <motion.div
                        key={req.id}
                        layout
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-gradient-to-r from-amber-500/[0.03] to-orange-500/[0.03] dark:from-amber-500/[0.01] dark:to-orange-500/[0.01] border border-amber-500/20 rounded-2xl p-5 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-amber-500/40 hover:shadow-md hover:shadow-amber-500/[0.02] transition-all duration-300"
                      >
                        <div className="space-y-3 flex-1">
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-bold text-sm sm:text-base text-foreground leading-snug">{req.entityName}</h3>
                              <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-amber-500/10 text-amber-600 border border-amber-500/20">
                                Access Requested
                              </span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1.5">
                              Requested connection via code <span className="font-mono font-bold text-primary bg-primary/5 px-2 py-0.5 rounded border border-primary/10 select-all">{req.code}</span>
                            </p>
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {req.scopes.map((s) => (
                              <span
                                key={s}
                                className="text-[9px] font-bold uppercase tracking-wide bg-background text-amber-600 dark:text-amber-400 px-2.5 py-1 border border-amber-500/10 rounded-full"
                              >
                                {scopeLabels[s] || s}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="flex gap-2 shrink-0 self-end md:self-center">
                          <button
                            type="button"
                            onClick={() => handleDeclineRequest(req.id)}
                            className="px-4 py-2.5 rounded-xl border border-border text-muted-foreground hover:bg-muted text-xs font-semibold cursor-pointer transition-colors duration-200"
                          >
                            Decline
                          </button>
                          <button
                            type="button"
                            onClick={() => handleApproveRequest(req)}
                            className="px-4.5 py-2.5 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-sm transition-colors duration-200"
                          >
                            <ShieldCheck size={14} /> Grant Access
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            )}
        </div>

        {/* Right Column: Access Control Panel (Tabbed Direct Grant vs Share QR) */}
        <div className="space-y-8">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-foreground" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Access Authorization Panel
            </h2>
            <p className="text-xs text-muted-foreground mt-1">
              Grant permissions directly or generate shareable access tokens.
            </p>
          </div>

          <div className="bg-card/85 backdrop-blur-sm border border-border rounded-3xl p-6 shadow-md hover:shadow-lg transition-all duration-300">
            {/* Header Tabs */}
            <div className="grid grid-cols-2 gap-1 p-1 bg-muted rounded-xl border border-border mb-6">
              <button
                type="button"
                onClick={() => setRightPanelTab("direct")}
                className={`py-2 rounded-lg text-xs font-bold tracking-wide transition-all cursor-pointer flex items-center justify-center gap-1.5 ${rightPanelTab === "direct"
                    ? "bg-background text-foreground shadow-sm font-extrabold border border-border/80"
                    : "text-muted-foreground hover:text-foreground hover:bg-background/25"
                  }`}
              >
                <ShieldCheck size={14} /> Direct Grant
              </button>
              <button
                type="button"
                onClick={() => setRightPanelTab("qr")}
                className={`py-2 rounded-lg text-xs font-bold tracking-wide transition-all cursor-pointer flex items-center justify-center gap-1.5 ${rightPanelTab === "qr"
                    ? "bg-background text-foreground shadow-sm font-extrabold border border-border/80"
                    : "text-muted-foreground hover:text-foreground hover:bg-background/25"
                  }`}
              >
                <QrCode size={14} /> Share QR Code
              </button>
            </div>

            <AnimatePresence mode="wait">
              {rightPanelTab === "direct" ? (
                <motion.div
                  key="direct-form"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <form onSubmit={handlePreSubmit} className="space-y-5">

                    {/* Tab Selector */}
                    <div className="grid grid-cols-2 gap-1 p-1 bg-muted/60 rounded-xl border border-border/60">
                      <button
                        type="button"
                        onClick={() => { setActiveTab("hospital"); setSelectedEntity(""); }}
                        className={`py-2 rounded-lg text-xs font-semibold tracking-wider transition-all cursor-pointer ${activeTab === "hospital"
                            ? "bg-background text-foreground shadow-sm font-bold border border-border/80"
                            : "text-muted-foreground hover:text-foreground hover:bg-background/25"
                          }`}
                      >
                        Hospital
                      </button>
                      <button
                        type="button"
                        onClick={() => { setActiveTab("doctor"); setSelectedEntity(""); }}
                        className={`py-2 rounded-lg text-xs font-semibold tracking-wider transition-all cursor-pointer ${activeTab === "doctor"
                            ? "bg-background text-foreground shadow-sm font-bold border border-border/80"
                            : "text-muted-foreground hover:text-foreground hover:bg-background/25"
                          }`}
                      >
                        Doctor
                      </button>
                    </div>

                    {/* Select Entity */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase text-muted-foreground tracking-wider">
                        Select {activeTab === "hospital" ? "Hospital" : "Doctor"}
                      </label>
                      <div className="relative">
                        <select
                          required
                          value={selectedEntity}
                          onChange={(e) => setSelectedEntity(e.target.value)}
                          className="w-full px-4 py-3 bg-muted rounded-xl border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none cursor-pointer pr-10"
                        >
                          <option value="">Choose integrated {activeTab === "hospital" ? "facility" : "practitioner"}…</option>
                          {activeTab === "hospital" ? (
                            availableHospitals.map((h) => (
                              <option key={h.id} value={h.id}>
                                {h.name} ({h.state})
                              </option>
                            ))
                          ) : (
                            availableDoctors.map((d) => (
                              <option key={d.id} value={d.id}>
                                {d.name} — {d.specialty} ({d.state})
                              </option>
                            ))
                          )}
                          {activeTab === "hospital" && availableHospitals.length === 0 && (
                            <option disabled>No additional hospitals integrated</option>
                          )}
                          {activeTab === "doctor" && availableDoctors.length === 0 && (
                            <option disabled>No additional doctors integrated</option>
                          )}
                        </select>
                        <div className="absolute inset-y-0 right-3.5 flex items-center pointer-events-none text-muted-foreground">
                          <ChevronDown size={16} />
                        </div>
                      </div>
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
                            className={`flex items-center gap-3 w-full p-3.5 rounded-xl border text-left text-xs font-semibold transition-all duration-200 cursor-pointer hover:scale-[1.01] ${isChecked
                                ? "bg-primary/[0.08] border-primary/30 text-primary shadow-sm shadow-primary/5"
                                : "bg-muted border-border text-muted-foreground hover:border-primary/20"
                              }`}
                          >
                            <div className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-all ${isChecked ? "bg-primary border-primary text-white" : "border-muted-foreground/60"
                              }`}>
                              {isChecked && <CheckCircle2 size={10} className="text-primary-foreground" />}
                            </div>
                            {label}
                          </button>
                        );
                      })}
                    </div>

                    {/* Access History limit */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase text-muted-foreground tracking-wider block mb-1">Access History Limit</label>
                      <div className="relative">
                        <select
                          value={historyRange}
                          onChange={(e) => setHistoryRange(e.target.value)}
                          className="w-full px-4 py-3 bg-muted rounded-xl border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none cursor-pointer pr-10"
                        >
                          <option value="all">All time records history (Recommended)</option>
                          <option value="30d">Last 30 days records only</option>
                          <option value="6m">Last 6 months records only</option>
                          <option value="1y">Last 12 months records only</option>
                        </select>
                        <div className="absolute inset-y-0 right-3.5 flex items-center pointer-events-none text-muted-foreground">
                          <ChevronDown size={16} />
                        </div>
                      </div>
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
                            className={`py-2 rounded-lg text-[10px] font-extrabold tracking-wider uppercase transition-all cursor-pointer ${duration === preset.days
                                ? "bg-background text-foreground shadow-sm font-black border border-border/80 scale-[1.03]"
                                : "text-muted-foreground hover:text-foreground hover:bg-background/25"
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
                        disabled={loading || !selectedEntity}
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
                </motion.div>
              ) : (
                <motion.div
                  key="qr-panel"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-5"
                >
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Generate a shareable connection string and QR code for clinicians to request access. Expires after 2 days (default).
                  </p>

                  {/* Share Scope Checklist */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-muted-foreground tracking-wider block">Include in Scope</label>
                    {Object.entries(scopeLabels).map(([key, label]) => {
                      const isChecked = shareScopes.includes(key);
                      return (
                        <button
                          key={key}
                          type="button"
                          onClick={() => {
                            setShareScopes(prev =>
                              prev.includes(key) ? prev.filter(s => s !== key) : [...prev, key]
                            );
                          }}
                          className={`flex items-center gap-2.5 w-full p-2.5 rounded-xl border text-left text-xs font-semibold transition-all cursor-pointer ${isChecked
                              ? "bg-primary/5 border-primary/20 text-primary"
                              : "bg-muted border-border text-muted-foreground hover:border-primary/20"
                            }`}
                        >
                          <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center shrink-0 transition-all ${isChecked ? "bg-primary border-primary text-white" : "border-muted-foreground/60"
                            }`}>
                            {isChecked && <CheckCircle2 size={8} className="text-primary-foreground" />}
                          </div>
                          {label}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    type="button"
                    onClick={handleGenerateCode}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-secondary text-primary hover:bg-primary hover:text-primary-foreground font-bold rounded-xl transition-all text-xs cursor-pointer border border-primary/10"
                  >
                    <Plus size={14} /> Generate QR & Connection String
                  </button>

                  {/* Active / Generated Code Display */}
                  {generatedCode && !generatedCode.revoked && (
                    <div className="relative bg-gradient-to-b from-muted to-muted/30 p-5 rounded-2xl border border-border/80 text-center space-y-4 animate-fadeIn overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl pointer-events-none" />

                      <div className="flex justify-between items-center pb-2 border-b border-border/60">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                          Secure Access Token
                        </span>
                        <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                          Expires in 48h
                        </span>
                      </div>

                      {/* Beautiful QR Mock SVG */}
                      <div className="w-36 h-36 bg-white p-3 rounded-2xl border border-border mx-auto flex items-center justify-center relative shadow-md group hover:scale-105 hover:rotate-1 transition-all duration-300">
                        <svg id="qr-code-svg" viewBox="0 0 100 100" className="w-full h-full text-zinc-900" xmlns="http://www.w3.org/2000/svg">
                          <rect x="0" y="0" width="20" height="20" fill="currentColor" />
                          <rect x="5" y="5" width="10" height="10" fill="white" />
                          <rect x="80" y="0" width="20" height="20" fill="currentColor" />
                          <rect x="85" y="5" width="10" height="10" fill="white" />
                          <rect x="0" y="80" width="20" height="20" fill="currentColor" />
                          <rect x="5" y="85" width="10" height="10" fill="white" />
                          <rect x="30" y="10" width="10" height="10" fill="currentColor" />
                          <rect x="50" y="0" width="10" height="20" fill="currentColor" />
                          <rect x="40" y="30" width="20" height="10" fill="currentColor" />
                          <rect x="10" y="40" width="10" height="30" fill="currentColor" />
                          <rect x="70" y="40" width="20" height="10" fill="currentColor" />
                          <rect x="30" y="60" width="10" height="20" fill="currentColor" />
                          <rect x="50" y="80" width="10" height="10" fill="currentColor" />
                          <rect x="70" y="70" width="10" height="20" fill="currentColor" />
                          <rect x="80" y="60" width="10" height="10" fill="currentColor" />
                          <rect x="80" y="30" width="10" height="10" fill="currentColor" />
                          <rect x="30" y="80" width="10" height="10" fill="currentColor" />
                        </svg>
                        <div className="absolute inset-0 m-auto w-9 h-9 bg-white border border-border/80 rounded-xl flex items-center justify-center text-primary shadow-sm">
                          <Heart size={16} fill="currentColor" className="text-primary animate-pulse" />
                        </div>
                      </div>

                      <div className="space-y-1 text-left">
                        <label className="text-[9px] font-extrabold uppercase text-muted-foreground tracking-wider block">
                          Connection String
                        </label>
                        <div className="flex items-center justify-between gap-2 bg-background/85 backdrop-blur-md p-2.5 rounded-xl border border-border shadow-inner">
                          <span className="font-mono font-bold text-xs tracking-wider text-foreground select-all break-all pr-1">{generatedCode.code}</span>
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText(generatedCode.code);
                              setCopiedCode(generatedCode.id);
                              toast.success("Code copied to clipboard!");
                              setTimeout(() => setCopiedCode(null), 2000);
                            }}
                            className="p-1.5 hover:bg-muted text-muted-foreground hover:text-foreground rounded-lg transition-colors cursor-pointer shrink-0"
                          >
                            {copiedCode === generatedCode.id ? (
                              <CheckCircle2 size={14} className="text-emerald-500" />
                            ) : (
                              <Copy size={14} />
                            )}
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 mt-2">
                        <button
                          type="button"
                          onClick={handleDownloadQRPNG}
                          className="flex items-center justify-center gap-1.5 py-2.5 bg-secondary text-primary hover:bg-primary hover:text-primary-foreground font-bold rounded-xl transition-all text-xs cursor-pointer border border-primary/10 shadow-sm"
                        >
                          <Download size={14} /> Download QR
                        </button>
                        <button
                          type="button"
                          onClick={handleShareQR}
                          className="flex items-center justify-center gap-1.5 py-2.5 bg-primary text-primary-foreground hover:bg-primary/90 font-bold rounded-xl transition-all text-xs cursor-pointer shadow-sm"
                        >
                          <Share2 size={14} /> Share QR
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRevokeCode(generatedCode.id)}
                        className="w-full text-[10px] font-bold text-destructive hover:bg-destructive/10 py-2 rounded-xl transition-all cursor-pointer border border-destructive/10 border-dashed"
                      >
                        Revoke Active QR / Code
                      </button>
                    </div>
                  )}

                  {/* List of active codes */}
                  {activeCodes.filter(c => !c.revoked && (!generatedCode || generatedCode.id !== c.id)).length > 0 && (
                    <div className="space-y-2 pt-2 border-t border-border/85 animate-fadeIn">
                      <span className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider block">Active Shared Codes</span>
                      <div className="space-y-2">
                        {activeCodes.filter(c => !c.revoked && (!generatedCode || generatedCode.id !== c.id)).map(c => (
                          <div key={c.id} className="flex justify-between items-center p-2.5 rounded-xl border border-border bg-muted/40 text-xs">
                            <div className="min-w-0 flex-1">
                              <p className="font-mono font-bold text-foreground break-all tracking-tight pr-2">{c.code}</p>
                              <p className="text-[9px] text-muted-foreground mt-0.5">
                                Expires: {new Date(c.expiresAt).toLocaleDateString("en-NG", { day: "numeric", month: "short" })}
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleRevokeCode(c.id)}
                              className="text-[10px] font-bold text-destructive hover:text-destructive-hover px-2 py-1 rounded transition-colors cursor-pointer shrink-0"
                            >
                              Revoke
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

      </div>

      {/* Confirmation Dialogue Box Modal */}
      <AnimatePresence>
        {showConfirmModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowConfirmModal(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-card border border-border rounded-3xl p-6 shadow-2xl relative z-10 max-w-md w-full space-y-4"
            >
              <div className="flex items-center gap-3 text-primary">
                <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                  <ShieldCheck size={22} />
                </div>
                <h3 className="text-lg font-bold text-foreground">Confirm Authorization</h3>
              </div>

              <div className="space-y-3">
                <p className="text-xs text-muted-foreground leading-relaxed">
                  You are about to grant <span className="font-bold text-foreground">{getEntityName(selectedEntity)}</span> permission to access your private health records.
                </p>
                <div className="bg-muted/80 border border-border/80 p-4 rounded-xl space-y-2 text-xs">
                  <p className="text-foreground">
                    <span className="text-muted-foreground font-medium">Recipient:</span> <span className="font-bold text-primary">{getEntityName(selectedEntity)}</span>
                  </p>
                  <p className="text-muted-foreground">
                    <span className="font-medium">Data to Share:</span> <span className="font-bold text-foreground">{scopes.map(s => scopeLabels[s]).join(", ")}</span>
                  </p>
                  <p className="text-muted-foreground">
                    <span className="font-medium">History Range:</span> <span className="font-bold text-foreground capitalize">
                      {historyRange === "30d" ? "Last 30 days" : historyRange === "6m" ? "Last 6 months" : historyRange === "1y" ? "Last 1 year" : "All time records history"}
                    </span>
                  </p>
                  <p className="text-muted-foreground">
                    <span className="font-medium">Access Duration:</span> <span className="font-bold text-foreground">{duration} Days (expires automatically)</span>
                  </p>
                </div>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  They will be able to query and view this information on-demand for clinical care. You retain full control and can instantly revoke this access at any time.
                </p>
              </div>

              <div className="flex gap-3 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setShowConfirmModal(false)}
                  className="px-4 py-2.5 text-xs font-semibold border border-border hover:bg-muted text-muted-foreground rounded-xl cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleGrant}
                  className="px-5 py-2.5 text-xs font-bold bg-primary text-primary-foreground hover:bg-primary/95 rounded-xl cursor-pointer shadow-sm transition-colors"
                >
                  Agree & Authorize
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
