import { Check, X } from "lucide-react";

export function StaffApprovalList({ staff, onApprove, onReject }) {
  if (!staff || staff.length === 0) {
    return (
      <div className="py-10 text-center text-muted-foreground bg-card border border-border rounded-xl">
        No pending staff approvals at this time.
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-muted/50 text-muted-foreground border-b border-border">
            <tr>
              <th className="px-6 py-4 font-medium">Name</th>
              <th className="px-6 py-4 font-medium">Email / ID</th>
              <th className="px-6 py-4 font-medium">Requested Role</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {staff.map((user) => (
              <tr key={user.id} className="hover:bg-muted/50 transition-colors">
                <td className="px-6 py-4 font-medium text-foreground">
                  {user.name}
                </td>
                <td className="px-6 py-4 text-muted-foreground">
                  {user.email}
                </td>
                <td className="px-6 py-4 text-muted-foreground capitalize">
                  {user.role.replace("_", " ")}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => onReject(user.id)}
                      className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                      title="Reject"
                    >
                      <X size={18} />
                    </button>
                    <button
                      onClick={() => onApprove(user.id)}
                      className="p-2 text-green-600 hover:bg-green-500/10 rounded-lg transition-colors"
                      title="Approve"
                    >
                      <Check size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
