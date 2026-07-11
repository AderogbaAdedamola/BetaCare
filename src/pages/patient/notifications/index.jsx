import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Bell,
  Activity,
  Shield,
  Heart,
  Check,
  Calendar,
  AlertCircle,
  Clock,
  Sparkles
} from "lucide-react";
import { toast } from "sonner";

// Premium mock notifications dataset
const INITIAL_NOTIFICATIONS = [
  {
    id: "notif_01",
    type: "medication",
    title: "Medication Reminder",
    message: "Time to take Metformin 500mg (twice daily dose). It is recommended to take it with meals.",
    time: "20 minutes ago",
    read: false,
    actionLabel: "Mark as Taken",
  },
  {
    id: "notif_02",
    type: "checkin",
    title: "AI Wellness Check-in",
    message: "Based on your recent logs, your blood pressure looks highly stable! Keep up the good work and stay hydrated today.",
    time: "2 hours ago",
    read: false,
    actionLabel: "View Insights",
  },
  {
    id: "notif_03",
    type: "consent",
    title: "Access Grant Confirmed",
    message: "Reddington Hospital was successfully granted access to your Lab Reports and consultation records.",
    time: "Yesterday, 3:15 PM",
    read: true,
    actionLabel: "Manage Access",
  },
  {
    id: "notif_04",
    type: "system",
    title: "Security Update",
    message: "Your BetaCare digital signature was updated during the last health sync to ensure end-to-end encryption.",
    time: "3 days ago",
    read: true,
  },
  {
    id: "notif_05",
    type: "medication",
    title: "Prescription Nearing Completion",
    message: "Your Lisinopril 10mg prescription at Reddington Hospital has 5 days of dosage remaining. Consider requesting a refill.",
    time: "4 days ago",
    read: true,
    actionLabel: "Request Refill",
  },
  {
    id: "notif_06",
    type: "consent",
    title: "Consent Expiration Alert",
    message: "Access grant for Lagos University Teaching Hospital (LUTH) expires in 48 hours.",
    time: "5 days ago",
    read: true,
    actionLabel: "Renew Access",
  }
];

export default function PatientNotifications() {
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [filter, setFilter] = useState("all"); // "all" | "medication" | "checkin" | "consent"

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAsRead = (id) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    toast.success("All notifications marked as read");
  };

  const handleAction = (id, action) => {
    handleMarkAsRead(id);
    if (action === "Mark as Taken") {
      toast.success("Medication dose logged successfully ✓");
    } else if (action === "Manage Access" || action === "Renew Access") {
      toast.info("Redirecting to access management dashboard…");
    } else {
      toast.info(`Action initiated: ${action}`);
    }
  };

  const filteredNotifs = notifications.filter(n => {
    if (filter === "all") return true;
    return n.type === filter;
  });

  const getNotifIcon = (type) => {
    switch (type) {
      case "medication":
        return <Activity size={18} className="text-purple-500" />;
      case "checkin":
        return <Sparkles size={18} className="text-emerald-500" />;
      case "consent":
        return <Shield size={18} className="text-cyan-500" />;
      case "system":
      default:
        return <Bell size={18} className="text-amber-500" />;
    }
  };

  const getNotifColor = (type) => {
    switch (type) {
      case "medication":
        return "bg-purple-500/10 border-purple-500/25";
      case "checkin":
        return "bg-emerald-500/10 border-emerald-500/25";
      case "consent":
        return "bg-cyan-500/10 border-cyan-500/25";
      case "system":
      default:
        return "bg-amber-500/10 border-amber-500/25";
    }
  };

  const filters = [
    { id: "all", label: "All Logs", icon: Bell },
    { id: "medication", label: "Medication", icon: Activity },
    { id: "checkin", label: "AI Check-ins", icon: Sparkles },
    { id: "consent", label: "Consents", icon: Shield }
  ];

  return (
    <div className="space-y-10">
      
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1
            className="text-3xl font-extrabold text-foreground tracking-tight"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            Notifications Center
          </h1>
          <p className="text-sm text-muted-foreground mt-1.5 flex items-center gap-1.5">
            <Clock size={14} />
            You have {unreadCount} unread alert{unreadCount !== 1 ? "s" : ""}
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllRead}
            className="self-start inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border bg-card text-foreground hover:bg-muted text-sm font-semibold transition-all cursor-pointer"
          >
            <Check size={14} />
            Mark all as read
          </button>
        )}
      </div>

      {/* ── Filters and Notifications list ── */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        
        {/* Left Side: Filter Options */}
        <div className="flex lg:flex-col gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
          {filters.map((f) => {
            const isActive = filter === f.id;
            const Icon = f.icon;
            return (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider shrink-0 transition-all cursor-pointer ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-card border border-border text-muted-foreground hover:bg-secondary hover:text-primary"
                }`}
              >
                <Icon size={14} />
                {f.label}
              </button>
            );
          })}
        </div>

        {/* Right Side: List layout */}
        <div className="lg:col-span-3 space-y-4">
          <AnimatePresence mode="popLayout">
            {filteredNotifs.length > 0 ? (
              filteredNotifs.map((notif) => (
                <motion.div
                  key={notif.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                  className={`bg-card border rounded-2xl p-5 relative overflow-hidden flex flex-col sm:flex-row justify-between gap-4 transition-all hover:border-primary/20 ${
                    !notif.read ? "border-primary/10 shadow-sm" : "border-border"
                  }`}
                >
                  {/* Unread pulsing dot */}
                  {!notif.read && (
                    <span className="absolute top-4 right-4 flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                    </span>
                  )}

                  <div className="flex gap-4 items-start">
                    {/* Icon container */}
                    <div className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 mt-0.5 ${getNotifColor(notif.type)}`}>
                      {getNotifIcon(notif.type)}
                    </div>
                    
                    <div className="space-y-1">
                      <h4 className={`text-sm font-bold text-foreground ${!notif.read ? "font-extrabold" : ""}`}>
                        {notif.title}
                      </h4>
                      <p className="text-xs text-muted-foreground leading-relaxed pr-6 sm:pr-0">
                        {notif.message}
                      </p>
                      <span className="text-[10px] text-muted-foreground/80 font-medium inline-block pt-1.5">
                        {notif.time}
                      </span>
                    </div>
                  </div>

                  {/* Notification actions */}
                  {notif.actionLabel && (
                    <div className="self-start sm:self-center shrink-0 w-full sm:w-auto">
                      <button
                        onClick={() => handleAction(notif.id, notif.actionLabel)}
                        className={`w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          !notif.read
                            ? "bg-primary text-primary-foreground hover:bg-primary/95 shadow-sm"
                            : "bg-secondary text-primary hover:bg-primary hover:text-primary-foreground"
                        }`}
                      >
                        {notif.actionLabel}
                      </button>
                    </div>
                  )}

                </motion.div>
              ))
            ) : (
              <div className="bg-card border border-border p-16 text-center text-muted-foreground flex flex-col items-center justify-center gap-4 rounded-2xl">
                <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center text-muted-foreground/60">
                  <Bell size={24} />
                </div>
                <div className="max-w-xs">
                  <p className="font-bold text-foreground text-sm">Clear skies here!</p>
                  <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                    No active notifications found in this category. Any alerts relating to medications or logs will show up here.
                  </p>
                </div>
              </div>
            )}
          </AnimatePresence>
        </div>

      </div>

    </div>
  );
}
