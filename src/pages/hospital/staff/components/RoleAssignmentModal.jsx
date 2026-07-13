import { useState } from "react";
import { X, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const ROLES = [
  { id: "doctor", label: "Doctor / Physician" },
  { id: "nurse", label: "Nurse" },
  { id: "receptionist", label: "Receptionist / Front Desk" },
  { id: "billing", label: "Billing & Admin" },
];

export function RoleAssignmentModal({ isOpen, onClose, userDetails, onConfirm, mode = "link" }) {
  const [role, setRole] = useState(userDetails?.role || "doctor");
  const [permissions, setPermissions] = useState({
    view_records: true,
    add_notes: true,
    manage_staff: false,
    manage_billing: false,
  });

  if (!isOpen) return null;

  const handleToggle = (key) => setPermissions(p => ({ ...p, [key]: !p[key] }));

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirm({ ...userDetails, role, permissions });
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }} 
          onClick={onClose}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        />
        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }} 
          animate={{ scale: 1, opacity: 1 }} 
          exit={{ scale: 0.95, opacity: 0 }} 
          className="relative bg-card border border-border w-full max-w-lg rounded-2xl shadow-xl flex flex-col max-h-[90vh]"
        >
          <div className="flex items-center justify-between p-6 border-b border-border">
            <div>
              <h2 className="text-xl font-bold text-foreground">
                {mode === "link" ? "Add to Network & Assign Role" : "Create Account & Assign Role"}
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Configure access for <span className="font-semibold text-foreground">{userDetails?.name}</span>
              </p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-muted rounded-full text-muted-foreground transition-colors">
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6">
            
            {/* Role Selection */}
            <div>
              <label className="text-sm font-semibold text-foreground mb-3 block">Primary Role</label>
              <div className="grid grid-cols-2 gap-3">
                {ROLES.map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setRole(r.id)}
                    className={`p-3 text-left border rounded-xl transition-all ${
                      role === r.id 
                        ? "border-primary bg-primary/5 shadow-sm" 
                        : "border-border hover:border-primary/40 bg-background"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-sm font-medium ${role === r.id ? "text-primary" : "text-foreground"}`}>
                        {r.label}
                      </span>
                      {role === r.id && <ShieldCheck size={16} className="text-primary" />}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Permissions Toggles */}
            <div>
              <label className="text-sm font-semibold text-foreground mb-3 block">Access Permissions</label>
              <div className="space-y-3 bg-muted/30 border border-border rounded-xl p-4">
                
                <label className="flex items-center justify-between cursor-pointer group">
                  <div>
                    <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">View Patient Records</p>
                    <p className="text-xs text-muted-foreground">Can search and view patient medical history</p>
                  </div>
                  <input type="checkbox" checked={permissions.view_records} onChange={() => handleToggle("view_records")} className="w-5 h-5 accent-primary cursor-pointer" />
                </label>
                
                <hr className="border-border" />
                
                <label className="flex items-center justify-between cursor-pointer group">
                  <div>
                    <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">Add Clinical Notes</p>
                    <p className="text-xs text-muted-foreground">Can add visit notes and flag anomalies</p>
                  </div>
                  <input type="checkbox" checked={permissions.add_notes} onChange={() => handleToggle("add_notes")} className="w-5 h-5 accent-primary cursor-pointer" />
                </label>
                
                <hr className="border-border" />
                
                <label className="flex items-center justify-between cursor-pointer group">
                  <div>
                    <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">Manage Staff</p>
                    <p className="text-xs text-muted-foreground">Can add/remove staff and change roles</p>
                  </div>
                  <input type="checkbox" checked={permissions.manage_staff} onChange={() => handleToggle("manage_staff")} className="w-5 h-5 accent-primary cursor-pointer" />
                </label>
                
                <hr className="border-border" />
                
                <label className="flex items-center justify-between cursor-pointer group">
                  <div>
                    <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">Manage Billing</p>
                    <p className="text-xs text-muted-foreground">Access financial tools and invoice generation</p>
                  </div>
                  <input type="checkbox" checked={permissions.manage_billing} onChange={() => handleToggle("manage_billing")} className="w-5 h-5 accent-primary cursor-pointer" />
                </label>
              </div>
            </div>
            
            <div className="pt-4 border-t border-border flex justify-end gap-3">
              <button type="button" onClick={onClose} className="px-5 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Cancel
              </button>
              <button type="submit" className="px-6 py-2.5 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 transition-colors shadow-sm">
                Confirm & Save
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
