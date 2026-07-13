import { FileText, Stethoscope, Pill, Beaker } from "lucide-react";

const ICONS = {
  visit_note: Stethoscope,
  prescription: Pill,
  lab_result: Beaker,
  default: FileText,
};

export function RecordTimeline({ records }) {
  if (!records || records.length === 0) {
    return (
      <div className="py-8 text-center text-muted-foreground bg-card border border-border rounded-xl">
        No medical records found.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-bold text-foreground">Medical History</h3>
      <div className="space-y-4">
        {records.map((record) => {
          const Icon = ICONS[record.type] || ICONS.default;
          return (
            <div
              key={record.id}
              className="flex gap-4 p-4 bg-card border border-border rounded-xl hover:shadow-sm transition-shadow"
            >
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-primary">
                <Icon size={20} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-foreground capitalize">
                    {record.type.replace("_", " ")}
                  </h4>
                  <span className="text-xs text-muted-foreground">
                    • {record.date}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {record.description}
                </p>
                {record.provider && (
                  <p className="text-xs text-muted-foreground mt-2 font-medium">
                    Added by: {record.provider}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
