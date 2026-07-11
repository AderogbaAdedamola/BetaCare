import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate, useLocation } from "react-router";
import { BetaCareLogo } from "../../../components/icons/BetaCareLogo";
import {
  Heart,
  ChevronDown,
  Menu,
  X,
  User,
  Stethoscope,
  Building2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "../../../components/ui/dropdown-menu";
import { MagneticButton } from "../../../components/common/MagneticButton";


export function Navbar({ onGetStarted }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [signInOpen, setSignInOpen] = useState(false);
  const isContact = location.pathname === "/contact";

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const navLinks = [
    { label: "How It Works", href: "#how-it-works" },
    { label: "Features", href: "#features" },
    { label: "For Hospitals", href: "#hospitals" },
    { label: "FAQ", href: "#faq" },
  ];
  
  const signInLinks = [
    { label: "Patient", href: "/patient/login", icon: User },
    { label: "Doctor", href: "/doctor/login", icon: Stethoscope },
    { label: "Hospital", href: "/hospital/login", icon: Building2 },
  ];

  return (
    <motion.header
      initial={{ y: -64 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 200, damping: 24 }}
      className={`fixed top-[2px] left-0 right-0 z-40 transition-all duration-300 ${
        scrolled || isContact ? "bg-card/85 backdrop-blur-md border-b border-border shadow-sm" : "bg-transparent"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <button onClick={() => navigate("/")} className="flex items-center gap-2.5 shrink-0 cursor-pointer">
          <motion.div
            className="w-8 h-8 flex items-center justify-center"
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            {BetaCareLogo("w-8 h-8")}
            {/* <Heart size={16} className="text-primary-foreground fill-current" /> */}
          </motion.div>
          <span
            className="font-bold text-lg text-foreground"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            Beta<span className="text-primary">Care</span>
          </span>
        </button>

        {!isContact && (
          <ul className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  className="px-3.5 py-2 text-sm text-muted-foreground hover:text-foreground font-medium transition-colors rounded-lg hover:bg-muted"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        )}

        <div className="hidden md:flex items-center gap-2">
          <MagneticButton
            onClick={() => navigate("/contact")}
            className="px-4 py-2 text-sm font-medium text-foreground hover:bg-muted rounded-lg transition-colors cursor-pointer"
          >
            Contact
          </MagneticButton>

          <DropdownMenu open={signInOpen} onOpenChange={setSignInOpen}>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-foreground hover:bg-muted rounded-lg transition-colors cursor-pointer">
                Sign In{" "}
                <ChevronDown
                  size={14}
                  className={`transition-transform duration-200 ${signInOpen ? "rotate-180" : ""}`}
                />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="z-50 min-w-[160px] bg-card border border-border rounded-xl shadow-lg p-1.5 mt-1" align="end">
              {signInLinks.map((item) => {
                const Icon = item.icon;
                return (
                  <DropdownMenuItem key={item.label} asChild>
                    <a
                      href={item.href}
                      className="flex items-center gap-3 px-3 py-2.5 text-sm text-foreground hover:bg-secondary rounded-lg cursor-pointer transition-colors focus:outline-none"
                    >
                      <Icon size={15} className="text-primary" /> {item.label}
                    </a>
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>

          <MagneticButton
            onClick={onGetStarted}
            className="px-4 py-2 text-sm font-semibold bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors cursor-pointer"
          >
            Get Started
          </MagneticButton>
        </div>

        <button
          className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors cursor-pointer"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22 }}
            className="md:hidden bg-card border-b border-border overflow-hidden"
          >
            <div className="px-6 py-4 flex flex-col gap-1">
              {!isContact && navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="px-3 py-2.5 text-sm font-medium text-foreground hover:bg-muted rounded-lg transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <div className="border-t border-border my-2 pt-2 flex flex-col gap-1">
                {signInLinks.map((item) => {
                  const Icon = item.icon;
                  return (
                    <a
                      key={item.label}
                      href={item.href}
                      className="flex items-center gap-3 px-3 py-2.5 text-sm text-foreground hover:bg-muted rounded-lg transition-colors"
                    >
                      <Icon size={15} className="text-primary" /> Sign in as {item.label}
                    </a>
                  );
                })}
              </div>
              <button
                onClick={() => {
                  setMobileOpen(false);
                  navigate("/contact");
                }}
                className="px-3 py-2.5 text-sm font-medium text-left text-foreground hover:bg-muted rounded-lg transition-colors cursor-pointer"
              >
                Contact
              </button>
              <button
                onClick={() => {
                  setMobileOpen(false);
                  onGetStarted();
                }}
                className="mt-2 px-4 py-3 text-sm font-semibold bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-center cursor-pointer"
              >
                Get Started Free
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
