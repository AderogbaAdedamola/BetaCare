export function AuditTable({ logs }) {
  if (!logs || logs.length === 0) {
    return (
      <div className="py-10 text-center text-muted-foreground bg-card border border-border rounded-xl">
        No audit logs found.
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-muted/50 text-muted-foreground border-b border-border">
            <tr>
              <th className="px-6 py-4 font-medium">Timestamp</th>
              <th className="px-6 py-4 font-medium">Actor</th>
              <th className="px-6 py-4 font-medium">Action</th>
              <th className="px-6 py-4 font-medium">Target Entity</th>
              <th className="px-6 py-4 font-medium">Target ID</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {logs.map((log) => (
              <tr key={log.id} className="hover:bg-muted/50 transition-colors">
                <td className="px-6 py-4 text-muted-foreground whitespace-nowrap">
                  {new Date(log.timestamp).toLocaleString()}
                </td>
                <td className="px-6 py-4 font-medium text-foreground">
                  {log.actor_id}
                </td>
                <td className="px-6 py-4">
                  <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-secondary text-foreground">
                    {log.action}
                  </span>
                </td>
                <td className="px-6 py-4 text-muted-foreground">
                  {log.target_entity}
                </td>
                <td className="px-6 py-4 text-muted-foreground font-mono text-xs">
                  {log.target_id}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
