import { useState } from "react";
import { motion } from "motion/react";
import { Search, UserPlus, CheckCircle, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { StaffApprovalList } from "./components/StaffApprovalList";

// Mock Data
const HOSPITAL_ROSTER = [
  { id: "bc_doc_0987", name: "Dr. Sarah Lee", email: "sarah.lee@hospital.com", role: "doctor" },
  { id: "bc_staff_102", name: "Mark Okafor", email: "mark.o@hospital.com", role: "hospital_staff" },
];

const MOCK_PLATFORM_USERS = [
  { id: "bc_doc_1122", name: "Dr. Jane Doe", email: "jane@clinic.com", role: "doctor" },
  { id: "bc_doc_3344", name: "Dr. John Smith", email: "john@care.com", role: "doctor" },
];

export default function HospitalStaff() {
  const [roster, setRoster] = useState(HOSPITAL_ROSTER);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    
    // Simulate finding a user on the platform using connection string/ID
    setTimeout(() => {
      const foundUser = MOCK_PLATFORM_USERS.find(
        (u) => u.id === searchQuery.trim() || u.name.toLowerCase() === searchQuery.trim().toLowerCase()
      );
      setSearchResult(foundUser || "not_found");
      setIsSearching(false);
    }, 800);
  };

  const handleAddStaff = () => {
    if (!searchResult || searchResult === "not_found") return;
    
    // Check if already in roster
    if (roster.some((u) => u.id === searchResult.id)) {
      toast.error(`${searchResult.name} is already in your hospital network.`);
      return;
    }

    setRoster([searchResult, ...roster]);
    toast.success(`${searchResult.name} added to your hospital network.`);
    setSearchResult(null);
    setSearchQuery("");
  };

  const handleRemove = (id) => {
    setRoster((prev) => prev.filter((s) => s.id !== id));
    toast.success("Staff member removed from hospital.");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 max-w-5xl mx-auto"
    >
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Manage Staff & Doctors
        </h1>
        <p className="text-muted-foreground mt-1">
          Search for existing BetaCare professionals using their name or connection ID, and add them to your hospital's network.
        </p>
      </div>

      <div className="bg-card border border-border rounded-xl p-6">
        <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
          <UserPlus className="text-primary" size={20} /> Add New Staff Member
        </h3>
        
        <form onSubmit={handleSearch} className="flex gap-3 max-w-xl">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
              <Search size={18} />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Enter Doctor/Staff Connection ID (e.g. bc_doc_1122)..."
              className="w-full bg-background border border-border text-foreground text-sm rounded-xl focus:ring-2 focus:ring-primary focus:border-primary block pl-10 p-3 outline-none transition-all"
            />
          </div>
          <button
            type="submit"
            disabled={isSearching}
            className="px-6 py-3 bg-primary text-primary-foreground font-medium rounded-xl text-sm transition-colors hover:bg-primary/90 disabled:opacity-70"
          >
            {isSearching ? "Searching..." : "Search Platform"}
          </button>
        </form>

        {searchResult && searchResult !== "not_found" && (
          <div className="mt-6 p-4 border border-border rounded-xl bg-muted/30 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="text-emerald-500" size={18} />
                <h4 className="font-bold text-foreground">Verified BetaCare User Found</h4>
              </div>
              <p className="text-sm text-foreground mt-2 font-medium">{searchResult.name} <span className="text-muted-foreground font-normal">({searchResult.id})</span></p>
              <p className="text-xs text-muted-foreground capitalize mt-0.5">Role: {searchResult.role.replace("_", " ")}</p>
            </div>
            <button
              onClick={handleAddStaff}
              className="px-4 py-2 bg-foreground text-background font-medium rounded-lg text-sm hover:opacity-90 transition-opacity"
            >
              Add to Hospital
            </button>
          </div>
        )}

        {searchResult === "not_found" && (
          <div className="mt-6 p-4 border border-destructive/20 rounded-xl bg-destructive/5 text-destructive text-sm font-medium">
            No user found matching that ID or name. Ensure the professional is already registered on BetaCare.
          </div>
        )}
      </div>

      <div>
        <h3 className="text-lg font-bold text-foreground mb-4">Current Hospital Roster</h3>
        {/* We reuse the StaffApprovalList but modify it slightly for removal instead of approve/reject if possible, or just pass handleRemove to both for now to see. Actually, let's just make a simple table here. */}
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted/50 text-muted-foreground border-b border-border">
                <tr>
                  <th className="px-6 py-4 font-medium">Name</th>
                  <th className="px-6 py-4 font-medium">Connection ID</th>
                  <th className="px-6 py-4 font-medium">Role</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {roster.map((user) => (
                  <tr key={user.id} className="hover:bg-muted/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-foreground">
                      {user.name}
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {user.id}
                    </td>
                    <td className="px-6 py-4 text-muted-foreground capitalize">
                      {user.role.replace("_", " ")}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleRemove(user.id)}
                        className="text-xs text-destructive hover:underline font-medium"
                      >
                        Remove from Network
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
