import { Link } from "react-router";
import { ChevronRight } from "lucide-react";

export function PatientList({ patients }) {
  if (!patients || patients.length === 0) {
    return (
      <div className="py-10 text-center text-muted-foreground bg-card border border-border rounded-xl">
        No patients found.
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-muted/50 text-muted-foreground border-b border-border">
            <tr>
              <th className="px-6 py-4 font-medium">Patient Name</th>
              <th className="px-6 py-4 font-medium">Patient ID</th>
              <th className="px-6 py-4 font-medium">Last Visit</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {patients.map((patient) => (
              <tr key={patient.id} className="hover:bg-muted/50 transition-colors">
                <td className="px-6 py-4 font-medium text-foreground">
                  {patient.name}
                </td>
                <td className="px-6 py-4 text-muted-foreground">
                  {patient.id}
                </td>
                <td className="px-6 py-4 text-muted-foreground">
                  {patient.lastVisit}
                </td>
                <td className="px-6 py-4 text-right">
                  <Link
                    to={`/doctor/patients/${patient.id}`}
                    className="inline-flex items-center gap-1 text-primary hover:text-primary/80 font-medium transition-colors"
                  >
                    View Record <ChevronRight size={16} />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
