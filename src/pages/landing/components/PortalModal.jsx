import { motion } from "motion/react";
import { ArrowRight, User, Stethoscope, Building2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

const stagger = { visible: { transition: { staggerChildren: 0.1 } } };

const portals = [
  {
    id: "patient",
    label: "Patient",
    icon: User,
    description: "Access your personal health records, manage appointments, and chat with our AI health agent.",
    color: "bg-secondary text-primary",
    border: "border-primary/20 hover:border-primary",
    href: "/patient/register",
  },
  {
    id: "doctor",
    label: "Doctor",
    icon: Stethoscope,
    description: "View patient histories, update case notes, and receive verified MDCN credentials.",
    color: "bg-accent/10 text-foreground",
    border: "border-accent/30 hover:border-accent",
    href: "/doctor/register",
  },
  {
    id: "hospital",
    label: "Hospital",
    icon: Building2,
    description: "Integrate BetaCare into your healthcare centre for seamless patient record management.",
    color: "bg-muted text-foreground",
    border: "border-border hover:border-muted-foreground",
    href: "/hospital/register",
  },
];

export function PortalModal({ open, onOpenChange }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-lg bg-card rounded-2xl shadow-2xl p-8 border-border gap-0">
        <DialogHeader className="mb-6 text-left sm:text-left">
          <DialogTitle
            className="text-xl font-bold text-foreground"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            Choose your portal
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground mt-0.5">
            Select the option that best describes you.
          </DialogDescription>
        </DialogHeader>
        <motion.div variants={stagger} initial="hidden" animate="visible" className="flex flex-col gap-3">
          {portals.map((portal) => {
            const Icon = portal.icon;
            return (
              <motion.a
                key={portal.id}
                variants={fadeUp}
                href={portal.href}
                whileHover={{ x: 4 }}
                transition={{ type: "spring", stiffness: 300 }}
                className={`flex items-start gap-4 p-4 rounded-xl border-2 group cursor-pointer ${portal.border}`}
                onClick={() => onOpenChange(false)}
              >
                <div className={`p-2.5 rounded-lg shrink-0 ${portal.color}`}>
                  <Icon size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <p
                    className="font-semibold text-foreground group-hover:text-primary transition-colors"
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                  >
                    {portal.label}
                  </p>
                  <p className="text-sm text-muted-foreground mt-0.5 leading-relaxed">{portal.description}</p>
                </div>
                <ArrowRight
                  size={16}
                  className="text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0 mt-1"
                />
              </motion.a>
            );
          })}
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
