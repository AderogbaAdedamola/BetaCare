import { useState } from "react";
import { motion } from "motion/react";
import {
  User,
  Mail,
  Phone,
  Globe,
  Bell,
  ShieldAlert,
  Fingerprint,
  RotateCcw,
  Save,
  Check
} from "lucide-react";
import { usePatient } from "../../../context/PatientContext";
import { toast } from "sonner";

export default function PatientSettings() {
  const { patient, profile, updateProfile } = usePatient();

  // Profile fields state
  const [fullName, setFullName] = useState(patient?.full_name || "Aderogba Adedamola");
  const [email, setEmail] = useState(patient?.email || "damola@example.com");
  const [phone, setPhone] = useState(patient?.contact?.phone || "+2348012345678");

  // Language management
  const [selectedLanguage, setSelectedLanguage] = useState(() => {
    return localStorage.getItem("betacare_language") || "english";
  });

  // Notification toggles
  const [notifications, setNotifications] = useState({
    smsAlerts: true,
    emailSummaries: false,
    coPilotAlerts: true
  });

  // Security setups
  const [biometricLogin, setBiometricLogin] = useState(true);
  const [signatureVer, setSignatureVer] = useState("SIG-8032-BETA-72X");

  const languages = [
    { id: "english", label: "English", native: "English", greeting: "Welcome back!" },
    { id: "yoruba", label: "Yoruba", native: "Èdè Yorùbá", greeting: "Ẹ n lẹ o! Kú àbọ̀!" },
    { id: "pidgin", label: "Pidgin", native: "Naija Pidgin", greeting: "How far! You dey welcome!" },
    { id: "hausa", label: "Hausa", native: "Harshen Hausa", greeting: "Sannu da zuwa!" },
    { id: "igbo", label: "Igbo", native: "Asụsụ Igbo", greeting: "Nnọọ! Ndeeme!" }
  ];

  const handleLanguageChange = (langId) => {
    const lang = languages.find(l => l.id === langId);
    setSelectedLanguage(langId);
    localStorage.setItem("betacare_language", langId);
    toast.success(`Language changed to ${lang.label}!`, {
      description: `"${lang.greeting}"`,
      icon: "🌐"
    });
  };

  const handleProfileSave = (e) => {
    e.preventDefault();
    toast.success("Profile details updated successfully!", {
      description: "Changes will reflect across your clinical portal.",
      icon: "👤"
    });
  };

  const toggleNotif = (key) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
    toast.info("Notification preference updated.");
  };

  const handleRegenSignature = () => {
    const nextSig = `SIG-${Math.floor(1000 + Math.random() * 9000)}-BETA-${Math.floor(10 + Math.random() * 89)}X`;
    setSignatureVer(nextSig);
    toast.success("Digital signature regenerated!", {
      description: `New Signature: ${nextSig}. Relinking secure tunnels.`,
      icon: "🔑"
    });
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto text-foreground">
      
      {/* ── Page Header ── */}
      <div>
        <h1
          className="text-3xl font-extrabold tracking-tight"
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        >
          Portal Settings
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Customize your BetaCare portal experience, language preferences, and secure EHR access.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left Side: Navigation Links / Fast Settings */}
        <div className="md:col-span-1 space-y-6">
          
          <div className="bg-card border border-border rounded-3xl p-5 shadow-sm space-y-4">
            <h3 className="font-extrabold text-sm uppercase tracking-wider text-muted-foreground/80">Account Quick Stats</h3>
            <div className="space-y-3.5">
              <div className="flex justify-between items-center text-xs">
                <span className="text-muted-foreground">Digital ID Status</span>
                <span className="font-bold text-emerald-500 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-ping" />
                  Verified
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-muted-foreground">Active Tunnels</span>
                <span className="font-bold text-foreground">2 Linked Hospitals</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-muted-foreground">Current Language</span>
                <span className="font-black text-primary capitalize">{selectedLanguage}</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-tr from-primary/[0.02] to-cyan-500/[0.02] border border-primary/10 p-5 rounded-3xl text-xs text-muted-foreground leading-relaxed space-y-3">
            <span className="font-bold text-foreground block">💡 Data Sharing Control</span>
            BetaCare uses end-to-end encryption. Your medical logs are only visible to hospitals with active access keys you granted.
          </div>

        </div>

        {/* Right Side: Settings Fields Form */}
        <div className="md:col-span-2 space-y-6">
          
          {/* 1. Language Preference */}
          <div className="bg-card border border-border rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-border/80">
              <div className="w-9 h-9 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
                <Globe size={18} />
              </div>
              <div>
                <h4 className="font-extrabold text-sm leading-snug">Language Preference</h4>
                <p className="text-[10px] text-muted-foreground">Select your primary communication dialect</p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1.5">
              {languages.map((lang) => {
                const isSelected = selectedLanguage === lang.id;
                return (
                  <button
                    key={lang.id}
                    onClick={() => handleLanguageChange(lang.id)}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between h-20 ${
                      isSelected
                        ? "bg-primary/5 border-primary shadow-sm"
                        : "hover:bg-muted border-border/60 hover:border-border"
                    }`}
                  >
                    <span className="text-xs font-bold text-foreground">{lang.label}</span>
                    <div className="flex justify-between items-end w-full">
                      <span className="text-[10px] text-muted-foreground/80">{lang.native}</span>
                      {isSelected && (
                        <Check size={14} className="text-primary" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Account Profile details */}
          <form onSubmit={handleProfileSave} className="bg-card border border-border rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-border/80">
              <div className="w-9 h-9 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 rounded-xl flex items-center justify-center">
                <User size={18} />
              </div>
              <div>
                <h4 className="font-extrabold text-sm leading-snug">Patient Profile Contact</h4>
                <p className="text-[10px] text-muted-foreground">Update your details seen by connected clinicians</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1.5">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Full Name</label>
                <div className="relative">
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2.5 bg-muted rounded-xl border border-border text-xs focus:outline-none focus:ring-1 focus:ring-primary/20 focus:border-primary transition-all text-foreground font-semibold"
                  />
                  <User size={13} className="absolute left-3 top-3 text-muted-foreground/75" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Contact Phone</label>
                <div className="relative">
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2.5 bg-muted rounded-xl border border-border text-xs focus:outline-none focus:ring-1 focus:ring-primary/20 focus:border-primary transition-all text-foreground font-semibold"
                  />
                  <Phone size={13} className="absolute left-3 top-3 text-muted-foreground/75" />
                </div>
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Email Address</label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2.5 bg-muted rounded-xl border border-border text-xs focus:outline-none focus:ring-1 focus:ring-primary/20 focus:border-primary transition-all text-foreground font-semibold"
                  />
                  <Mail size={13} className="absolute left-3 top-3 text-muted-foreground/75" />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-black px-4.5 py-2.5 rounded-xl hover:bg-primary/95 transition-all text-xs shadow-sm cursor-pointer hover:scale-[1.01]"
              >
                <Save size={13} />
                Save Profile Updates
              </button>
            </div>
          </form>

          {/* 3. Alerts and Notifications preferences */}
          <div className="bg-card border border-border rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-border/80">
              <div className="w-9 h-9 bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-xl flex items-center justify-center">
                <Bell size={18} />
              </div>
              <div>
                <h4 className="font-extrabold text-sm leading-snug">Notification Alerts</h4>
                <p className="text-[10px] text-muted-foreground">Manage how and when you receive health logs reminders</p>
              </div>
            </div>

            <div className="space-y-4 pt-1.5">
              <div className="flex items-center justify-between">
                <div>
                  <h5 className="text-xs font-bold text-foreground">SMS Med Reminders</h5>
                  <p className="text-[10px] text-muted-foreground mt-0.5">Receive reminders on your phone when dose schedules are due</p>
                </div>
                <button
                  onClick={() => toggleNotif("smsAlerts")}
                  className={`relative inline-flex h-5.5 w-10 shrink-0 cursor-pointer rounded-full border border-transparent transition-colors duration-200 focus:outline-none ${
                    notifications.smsAlerts ? "bg-primary" : "bg-muted-foreground/30"
                  }`}
                >
                  <span className={`pointer-events-none inline-block h-4.5 w-4.5 transform rounded-full bg-background shadow-md transition duration-200 ${
                    notifications.smsAlerts ? "translate-x-4.5" : "translate-x-0"
                  }`} />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h5 className="text-xs font-bold text-foreground">Email Health Log Summaries</h5>
                  <p className="text-[10px] text-muted-foreground mt-0.5">Receive weekly clinical reports detailing your trends and vitals</p>
                </div>
                <button
                  onClick={() => toggleNotif("emailSummaries")}
                  className={`relative inline-flex h-5.5 w-10 shrink-0 cursor-pointer rounded-full border border-transparent transition-colors duration-200 focus:outline-none ${
                    notifications.emailSummaries ? "bg-primary" : "bg-muted-foreground/30"
                  }`}
                >
                  <span className={`pointer-events-none inline-block h-4.5 w-4.5 transform rounded-full bg-background shadow-md transition duration-200 ${
                    notifications.emailSummaries ? "translate-x-4.5" : "translate-x-0"
                  }`} />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h5 className="text-xs font-bold text-foreground">AI Co-Pilot Health Insights</h5>
                  <p className="text-[10px] text-muted-foreground mt-0.5">Allow AI Co-Pilot background updates to trigger alert flags</p>
                </div>
                <button
                  onClick={() => toggleNotif("coPilotAlerts")}
                  className={`relative inline-flex h-5.5 w-10 shrink-0 cursor-pointer rounded-full border border-transparent transition-colors duration-200 focus:outline-none ${
                    notifications.coPilotAlerts ? "bg-primary" : "bg-muted-foreground/30"
                  }`}
                >
                  <span className={`pointer-events-none inline-block h-4.5 w-4.5 transform rounded-full bg-background shadow-md transition duration-200 ${
                    notifications.coPilotAlerts ? "translate-x-4.5" : "translate-x-0"
                  }`} />
                </button>
              </div>
            </div>
          </div>

          {/* 4. Encryption Signature & Security */}
          <div className="bg-card border border-border rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-border/80">
              <div className="w-9 h-9 bg-amber-500/10 text-amber-600 dark:text-amber-500 rounded-xl flex items-center justify-center">
                <ShieldAlert size={18} />
              </div>
              <div>
                <h4 className="font-extrabold text-sm leading-snug">Encryption Keys &amp; Tunnels</h4>
                <p className="text-[10px] text-muted-foreground">Manage your secure identities used during record queries</p>
              </div>
            </div>

            <div className="space-y-4 pt-1.5">
              <div className="flex items-center justify-between">
                <div>
                  <h5 className="text-xs font-bold text-foreground">Digital Signature Key</h5>
                  <p className="text-[10px] font-mono text-muted-foreground/80 mt-1 select-all">{signatureVer}</p>
                </div>
                <button
                  type="button"
                  onClick={handleRegenSignature}
                  className="inline-flex items-center gap-1.5 px-3 py-2 bg-secondary text-primary hover:bg-primary hover:text-primary-foreground border border-primary/10 rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  <RotateCcw size={11} /> Regen
                </button>
              </div>

              <div className="flex items-center justify-between border-t border-border/50 pt-4">
                <div>
                  <h5 className="text-xs font-bold text-foreground">Biometric Login / PIN</h5>
                  <p className="text-[10px] text-muted-foreground mt-0.5">Enable fingerprint scan or passcode lock for access</p>
                </div>
                <button
                  onClick={() => {
                    setBiometricLogin(!biometricLogin);
                    toast.info(`Biometric unlock ${!biometricLogin ? "activated" : "deactivated"}`);
                  }}
                  className={`relative inline-flex h-5.5 w-10 shrink-0 cursor-pointer rounded-full border border-transparent transition-colors duration-200 focus:outline-none ${
                    biometricLogin ? "bg-primary" : "bg-muted-foreground/30"
                  }`}
                >
                  <span className={`pointer-events-none inline-block h-4.5 w-4.5 transform rounded-full bg-background shadow-md transition duration-200 ${
                    biometricLogin ? "translate-x-4.5" : "translate-x-0"
                  }`} />
                </button>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
