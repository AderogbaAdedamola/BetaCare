export function PatientHeader({ patient }) {
  if (!patient) return null;

  return (
    <div className="bg-card border border-border p-6 rounded-xl flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center text-2xl font-bold">
          {patient.name.split(" ").map(n => n[0]).join("").substring(0, 2)}
        </div>
        <div>
          <h2 className="text-xl font-bold text-foreground">{patient.name}</h2>
          <p className="text-sm text-muted-foreground mt-1">
            ID: {patient.id} • DOB: {patient.dob} ({patient.age}y)
          </p>
          <p className="text-sm text-muted-foreground">
            Contact: {patient.phone}
          </p>
        </div>
      </div>
      
      <div className="flex gap-4 md:text-right">
        <div>
          <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Blood Type</p>
          <p className="font-medium text-foreground">{patient.bloodType || "N/A"}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Genotype</p>
          <p className="font-medium text-foreground">{patient.genotype || "N/A"}</p>
        </div>
      </div>
    </div>
  );
}
