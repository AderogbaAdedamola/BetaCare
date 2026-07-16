import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, UserPlus, ShieldCheck, Mail, Lock, ClipboardList } from "lucide-react";
import { toast } from "sonner";
import { DataTable } from "../../../components/common/DataTable";
import { RoleAssignmentModal } from "./components/RoleAssignmentModal";
import { StaffApprovalList } from "./components/StaffApprovalList";
import { api } from "../../../lib/api";

// Mock Data
const HOSPITAL_ROSTER = [
  { id: "bc_doc_0987", name: "Dr. Sarah Lee", email: "sarah.lee@hospital.com", role: "doctor", status: "Active" },
  { id: "bc_staff_102", name: "Mark Okafor", email: "mark.o@hospital.com", role: "receptionist", status: "Active" },
  { id: "bc_nurse_553", name: "Jane Adewale", email: "jane.a@hospital.com", role: "nurse", status: "Invited" },
];

const MOCK_PLATFORM_USERS = [
  { id: "bc_doc_1122", name: "Dr. Jane Doe", email: "jane@clinic.com", role: "doctor" },
  { id: "bc_doc_3344", name: "Dr. John Smith", email: "john@care.com", role: "doctor" },
];

export default function HospitalStaff() {
  const [roster, setRoster] = useState(HOSPITAL_ROSTER);
  const [activeTab, setActiveTab] = useState("link"); // 'link' or 'create'
  
  // Link State
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  
  // Create State
  const [newStaff, setNewStaff] = useState({ name: "", email: "", password: "" });

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [pendingUser, setPendingUser] = useState(null);

  // Approvals State
  const [pendingApprovals, setPendingApprovals] = useState([
    { id: "bc_staff_req_1", name: "Dr. Chioma Eze", email: "chioma.eze@gmail.com", role: "doctor", requestDate: "2026-07-14", status: "Pending" },
    { id: "bc_staff_req_2", name: "Ahmed Musa", email: "amusa@yahoo.com", role: "nurse", requestDate: "2026-07-15", status: "Pending" }
  ]);

  const handleApprove = async (staffId) => {
    try {
      await api.post("/auth/staff/approve", { id: staffId, action: "approve" });
      setPendingApprovals(p => p.filter(req => req.id !== staffId));
      toast.success("Staff approved successfully");
    } catch (err) {
      toast.error("Failed to approve staff");
    }
  };

  const handleReject = async (staffId) => {
    try {
      await api.post("/auth/staff/approve", { id: staffId, action: "reject" });
      setPendingApprovals(p => p.filter(req => req.id !== staffId));
      toast.success("Staff request rejected");
    } catch (err) {
      toast.error("Failed to reject staff");
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setTimeout(() => {
      const foundUser = MOCK_PLATFORM_USERS.find(
        (u) => u.id === searchQuery.trim() || u.name.toLowerCase() === searchQuery.trim().toLowerCase()
      );
      setSearchResult(foundUser || "not_found");
      setIsSearching(false);
    }, 800);
  };

  const openRoleModalForLink = () => {
    if (!searchResult || searchResult === "not_found") return;
    if (roster.some((u) => u.id === searchResult.id)) {
      toast.error(`${searchResult.name} is already in your hospital network.`);
      return;
    }
    setPendingUser(searchResult);
    setModalOpen(true);
  };

  const handleCreateStaffInitiate = (e) => {
    e.preventDefault();
    if (!newStaff.name || !newStaff.email || !newStaff.password) {
      toast.error("Please fill all fields."); return;
    }
    // Generate a mock ID
    const generatedUser = {
      id: `bc_staff_${Math.floor(Math.random() * 10000)}`,
      name: newStaff.name,
      email: newStaff.email,
      status: "Active"
    };
    setPendingUser(generatedUser);
    setModalOpen(true);
  };

  const handleConfirmAddStaff = (finalizedUser) => {
    setRoster([finalizedUser, ...roster]);
    toast.success(`${finalizedUser.name} added as a ${finalizedUser.role.replace("_", " ")}.`);
    
    // Reset states
    setModalOpen(false);
    setPendingUser(null);
    setSearchResult(null);
    setSearchQuery("");
    setNewStaff({ name: "", email: "", password: "" });
  };

  const handleRemove = (id) => {
    setRoster((prev) => prev.filter((s) => s.id !== id));
    toast.success("Staff member removed from hospital.");
  };

  // DataTable Columns Configuration
  const columns = [
    {
      header: "Name",
      accessor: "name",
      render: (row) => (
        <div>
          <p className="font-semibold text-foreground">{row.name}</p>
          <p className="text-xs text-muted-foreground">{row.email}</p>
        </div>
      )
    },
    { header: "Connection ID", accessor: "id", cellClassName: "text-muted-foreground font-mono text-xs" },
    { 
      header: "Role", 
      accessor: "role",
      render: (row) => <span className="capitalize font-medium text-foreground">{row.role.replace("_", " ")}</span>
    },
    {
      header: "Status",
      accessor: "status",
      render: (row) => (
        <span className={`px-2 py-1 text-xs font-bold rounded-md ${
          row.status === "Active" ? "bg-emerald-500/10 text-emerald-500" : "bg-orange-500/10 text-orange-500"
        }`}>
          {row.status}
        </span>
      )
    },
    {
      header: "Actions",
      accessor: "actions",
      headerClassName: "text-right",
      cellClassName: "text-right",
      render: (row) => (
        <button
          onClick={() => handleRemove(row.id)}
          className="text-xs text-destructive hover:underline font-medium"
        >
          Remove
        </button>
      )
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Manage Staff & Doctors
        </h1>
        <p className="text-muted-foreground mt-1">
          Add existing professionals or create internal accounts for your staff.
        </p>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        {/* Tabs */}
        <div className="flex border-b border-border">
          <button 
            onClick={() => setActiveTab("link")}
            className={`flex-1 py-4 text-sm font-semibold transition-colors flex justify-center items-center gap-2 ${
              activeTab === "link" ? "text-primary border-b-2 border-primary bg-primary/5" : "text-muted-foreground hover:bg-muted"
            }`}
          >
            <ShieldCheck size={18} /> Link Existing Doctor
          </button>
          <button 
            onClick={() => setActiveTab("create")}
            className={`flex-1 py-4 text-sm font-semibold transition-colors flex justify-center items-center gap-2 ${
              activeTab === "create" ? "text-primary border-b-2 border-primary bg-primary/5" : "text-muted-foreground hover:bg-muted"
            }`}
          >
            <UserPlus size={18} /> Create Staff Account
          </button>
          <button 
            onClick={() => setActiveTab("approvals")}
            className={`flex-1 py-4 text-sm font-semibold transition-colors flex justify-center items-center gap-2 ${
              activeTab === "approvals" ? "text-primary border-b-2 border-primary bg-primary/5" : "text-muted-foreground hover:bg-muted"
            }`}
          >
            <ClipboardList size={18} /> Pending Approvals
            {pendingApprovals.length > 0 && (
              <span className="ml-1 bg-accent text-accent-foreground text-[10px] font-bold px-2 py-0.5 rounded-full">
                {pendingApprovals.length}
              </span>
            )}
          </button>
        </div>

        <div className="p-6">
          <AnimatePresence mode="wait">
            
            {/* LINK DOCTOR TAB */}
            {activeTab === "link" && (
              <motion.div key="link" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}>
                <p className="text-sm text-muted-foreground mb-5">
                  Search for doctors already registered on BetaCare using their Connection ID.
                </p>
                <form onSubmit={handleSearch} className="flex gap-3 max-w-xl">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Enter Connection ID (e.g. bc_doc_1122)..."
                      className="w-full bg-background border border-border text-foreground text-sm rounded-xl focus:ring-2 focus:ring-primary focus:border-primary block pl-10 p-3 outline-none transition-all"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isSearching}
                    className="px-6 py-3 bg-primary text-primary-foreground font-medium rounded-xl text-sm transition-colors hover:bg-primary/90 disabled:opacity-70"
                  >
                    {isSearching ? "Searching..." : "Search"}
                  </button>
                </form>

                {searchResult && searchResult !== "not_found" && (
                  <div className="mt-6 p-4 border border-primary/20 rounded-xl bg-primary/5 flex items-center justify-between max-w-xl">
                    <div>
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="text-primary" size={18} />
                        <h4 className="font-bold text-foreground">Verified BetaCare User</h4>
                      </div>
                      <p className="text-sm text-foreground mt-2 font-medium">{searchResult.name} <span className="text-muted-foreground font-normal">({searchResult.id})</span></p>
                    </div>
                    <button
                      onClick={openRoleModalForLink}
                      className="px-4 py-2 bg-foreground text-background font-medium rounded-lg text-sm hover:opacity-90 transition-opacity"
                    >
                      Add & Set Role
                    </button>
                  </div>
                )}
                {searchResult === "not_found" && (
                  <div className="mt-6 p-4 border border-destructive/20 rounded-xl bg-destructive/5 text-destructive text-sm font-medium max-w-xl">
                    No user found matching that ID.
                  </div>
                )}
              </motion.div>
            )}

            {/* CREATE STAFF TAB */}
            {activeTab === "create" && (
              <motion.div key="create" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}>
                <p className="text-sm text-muted-foreground mb-5">
                  Directly create a BetaCare account for your internal staff (Nurses, Admin, Receptionists). They will use these credentials to log in.
                </p>
                <form onSubmit={handleCreateStaffInitiate} className="max-w-xl space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Full Name</label>
                      <input 
                        type="text" 
                        required 
                        value={newStaff.name} onChange={e => setNewStaff({...newStaff, name: e.target.value})}
                        placeholder="e.g. Jane Doe" 
                        className="w-full px-4 py-2.5 bg-background rounded-xl border border-border text-sm focus:ring-2 focus:ring-primary outline-none transition-all" 
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Email Address</label>
                      <input 
                        type="email" 
                        required 
                        value={newStaff.email} onChange={e => setNewStaff({...newStaff, email: e.target.value})}
                        placeholder="staff@hospital.com" 
                        className="w-full px-4 py-2.5 bg-background rounded-xl border border-border text-sm focus:ring-2 focus:ring-primary outline-none transition-all" 
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Temporary Password</label>
                    <input 
                      type="password" 
                      required 
                      value={newStaff.password} onChange={e => setNewStaff({...newStaff, password: e.target.value})}
                      placeholder="••••••••" 
                      className="w-full px-4 py-2.5 bg-background rounded-xl border border-border text-sm focus:ring-2 focus:ring-primary outline-none transition-all" 
                    />
                  </div>
                  <button type="submit" className="px-6 py-3 bg-primary text-primary-foreground font-medium rounded-xl text-sm transition-colors hover:bg-primary/90">
                    Next: Assign Role
                  </button>
                </form>
              </motion.div>
            )}

            {/* APPROVALS TAB */}
            {activeTab === "approvals" && (
              <motion.div key="approvals" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}>
                <div className="flex justify-between items-end mb-5">
                  <div>
                    <h3 className="text-lg font-bold text-foreground">Pending Join Requests</h3>
                    <p className="text-sm text-muted-foreground mt-1">Review healthcare professionals requesting to join your hospital network.</p>
                  </div>
                </div>
                
                <StaffApprovalList staff={pendingApprovals} onApprove={handleApprove} onReject={handleReject} />
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>

      {/* Scalable DataTable */}
      <div>
        <h3 className="text-lg font-bold text-foreground mb-4">Current Staff Roster</h3>
        <DataTable 
          columns={columns} 
          data={roster} 
          searchPlaceholder="Search staff by name, role, or ID..." 
          defaultItemsPerPage={5}
        />
      </div>

      {/* Role Assignment Modal */}
      <RoleAssignmentModal 
        isOpen={modalOpen} 
        onClose={() => { setModalOpen(false); setPendingUser(null); }}
        userDetails={pendingUser}
        onConfirm={handleConfirmAddStaff}
        mode={activeTab}
      />
    </motion.div>
  );
}
