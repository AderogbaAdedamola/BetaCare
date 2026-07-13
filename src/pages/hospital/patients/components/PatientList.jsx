import { Link } from "react-router";
import { ChevronRight } from "lucide-react";
import { DataTable } from "../../../../components/common/DataTable";

export function PatientList({ patients }) {
  if (!patients || patients.length === 0) {
    return (
      <div className="py-10 text-center text-muted-foreground bg-card border border-border rounded-xl">
        No patients found in your consented records.
      </div>
    );
  }

  const columns = [
    {
      header: "Patient Name",
      accessor: "name",
      cellClassName: "font-medium text-foreground"
    },
    {
      header: "Patient ID",
      accessor: "id",
      cellClassName: "text-muted-foreground font-mono text-sm"
    },
    {
      header: "Consent Status",
      accessor: "status",
      render: () => (
        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-green-500/10 text-green-600">
          Active
        </span>
      )
    },
    {
      header: "Actions",
      accessor: "actions",
      headerClassName: "text-right",
      cellClassName: "text-right",
      render: (row) => (
        <Link
          to={`/hospital/patients/${row.id}`}
          className="inline-flex items-center gap-1 text-primary hover:text-primary/80 font-medium transition-colors"
        >
          View Record <ChevronRight size={16} />
        </Link>
      )
    }
  ];

  return (
    <DataTable 
      columns={columns} 
      data={patients} 
      searchPlaceholder="Search patients by name or ID..."
      defaultItemsPerPage={10}
      itemsPerPageOptions={[5, 10, 20, 50]}
    />
  );
}
