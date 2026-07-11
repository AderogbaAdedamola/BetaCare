import { useState } from "react";
import { Link, useLocation } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  LayoutDashboard,
  ClipboardList,
  ShieldCheck,
  LogOut,
  Menu,
  X,
  Bell,
  LineChart,
  Bot,
} from "lucide-react";
import { usePatient } from "../../context/PatientContext";
import { BetaCareLogo } from "../icons/BetaCareLogo";

export function PatientLayout({ children }) {
  const { patient, logout } = usePatient();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    { name: "Dashboard", href: "/patient/dashboard", icon: LayoutDashboard },
    { name: "Medical Records", href: "/patient/records", icon: ClipboardList },
    { name: "Track Health", href: "/patient/health-tracker", icon: LineChart },
    { name: "AI Assistant", href: "/patient/ai-chat", icon: Bot },
    { name: "Notifications", href: "/patient/notifications", icon: Bell },
    { name: "Manage Access", href: "/patient/consent", icon: ShieldCheck },
  ];

  const isActive = (path) => location.pathname === path;

  const getInitials = () => {
    if (patient?.full_name) {
      const parts = patient.full_name.split(" ");
      return parts.map((p) => p[0]).join("").substring(0, 2).toUpperCase();
    }
    return "BC";
  };

  const menuVariants = {
    closed: { x: "-100%", opacity: 0 },
    open: { x: 0, opacity: 1, transition: { type: "spring", stiffness: 260, damping: 26 } },
  };

  return (
    <div className="min-h-screen bg-background flex flex-col lg:flex-row text-foreground">

      {/* ── Desktop Sidebar ── */}
      <aside className="hidden lg:flex flex-col w-72 bg-card border-r border-border shrink-0 z-30 h-screen sticky top-0">
        {/* Brand header */}
        <div className="h-[76px] flex items-center gap-3 px-6 border-b border-border">
          <BetaCareLogo className="w-9 h-9 object-contain" />
          <span
            className="font-bold text-lg text-foreground tracking-tight"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            Beta<span className="text-primary">Care</span>
            <span className="text-[10px] ml-1.5 px-1.5 py-0.5 bg-primary/10 text-primary font-bold rounded">PATIENT</span>
          </span>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 px-4 py-6 space-y-1">
          {navigation.map((item) => {
            const active = isActive(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all group relative overflow-hidden ${
                  active
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-secondary hover:text-primary"
                }`}
              >
                <Icon
                  size={18}
                  className={`transition-colors duration-250 ${
                    active ? "text-primary-foreground" : "text-muted-foreground group-hover:text-primary"
                  }`}
                />
                {item.name}
                {!active && (
                  <motion.div
                    className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r"
                    initial={{ x: -4 }}
                    whileHover={{ x: 0 }}
                    transition={{ duration: 0.2 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* User footer block */}
        <div className="p-4 border-t border-border bg-muted/40">
          <div className="flex items-center gap-3 p-2 bg-card border border-border rounded-xl">
            <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary font-bold text-sm flex items-center justify-center shrink-0">
              {getInitials()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate text-foreground leading-tight">
                {patient?.full_name || "Patient Profile"}
              </p>
              <p className="text-xs text-muted-foreground truncate mt-0.5">
                {patient?.contact?.phone || patient?.contact?.email || "Connected via Web"}
              </p>
            </div>
            <button
              onClick={logout}
              title="Logout"
              className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors cursor-pointer"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* ── Mobile Top Header ── */}
      <header className="lg:hidden h-[68px] flex items-center justify-between px-6 bg-card border-b border-border z-40 sticky top-0">
        <Link to="/patient/dashboard" className="flex items-center gap-2.5">
          <BetaCareLogo className="w-8 h-8 object-contain" />
          <span
            className="font-bold text-base text-foreground"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            Beta<span className="text-primary">Care</span>
          </span>
        </Link>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 text-foreground hover:bg-muted rounded-xl transition-all cursor-pointer"
        >
          {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </header>

      {/* ── Mobile Drawer Navigation Menu ── */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="lg:hidden fixed inset-0 bg-black z-30"
            />
            <motion.div
              variants={menuVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="lg:hidden fixed top-[68px] left-0 bottom-0 w-80 bg-card border-r border-border p-6 z-30 flex flex-col"
            >
              <p className="text-xs uppercase tracking-widest font-semibold text-muted-foreground mb-4">
                Portal Menu
              </p>
              <nav className="flex-1 space-y-1">
                {navigation.map((item) => {
                  const active = isActive(item.href);
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-semibold transition-all ${
                        active
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:bg-secondary hover:text-primary"
                      }`}
                    >
                      <Icon size={18} />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>

              <div className="border-t border-border pt-6 mt-auto">
                <div className="flex items-center gap-3 p-2 border border-border bg-muted/40 rounded-xl mb-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary font-bold text-sm flex items-center justify-center shrink-0">
                    {getInitials()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate text-foreground">
                      {patient?.full_name || "Patient Profile"}
                    </p>
                    <p className="text-xs text-muted-foreground truncate mt-0.5">
                      {patient?.contact?.phone || patient?.contact?.email}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => { setMobileMenuOpen(false); logout(); }}
                  className="w-full flex items-center justify-center gap-2 py-3 border border-border hover:border-destructive hover:bg-destructive/5 text-muted-foreground hover:text-destructive text-sm font-semibold rounded-xl transition-all cursor-pointer"
                >
                  <LogOut size={16} />
                  Log out of portal
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Main content pane ── */}
      <main className="flex-1 min-w-0 relative overflow-y-auto px-6 sm:px-10 py-8 lg:py-12">
        <div className="max-w-6xl mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  );
}
