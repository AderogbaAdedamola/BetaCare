import { useState } from "react";
import { AlertCircle, CheckCircle } from "lucide-react";

export function AnomalyList({ anomalies, onResolve }) {
  if (!anomalies || anomalies.length === 0) {
    return (
      <div className="py-12 flex flex-col items-center justify-center text-center bg-card border border-border rounded-xl">
        <div className="w-12 h-12 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mb-4">
          <CheckCircle size={24} />
        </div>
        <h3 className="text-lg font-bold text-foreground">All Clear</h3>
        <p className="text-muted-foreground mt-1 max-w-sm">
          There are no flagged anomalies requiring your review at this time.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {anomalies.map((anomaly) => (
        <AnomalyCard key={anomaly.id} anomaly={anomaly} onResolve={onResolve} />
      ))}
    </div>
  );
}

function AnomalyCard({ anomaly, onResolve }) {
  const [isResolving, setIsResolving] = useState(false);
  const [notes, setNotes] = useState("");

  const handleResolve = () => {
    onResolve(anomaly.id, notes);
  };

  return (
    <div className="bg-card border border-border rounded-xl p-5 md:p-6 flex flex-col md:flex-row gap-6">
      <div className="flex-1 space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-destructive/10 text-destructive flex items-center justify-center shrink-0">
              <AlertCircle size={20} />
            </div>
            <div>
              <h3 className="font-bold text-foreground">{anomaly.patientName}</h3>
              <p className="text-sm text-muted-foreground">ID: {anomaly.patientId} • Triggered: {anomaly.date}</p>
            </div>
          </div>
          <span className="px-3 py-1 bg-destructive/10 text-destructive text-xs font-bold rounded-full uppercase tracking-wider">
            {anomaly.severity}
          </span>
        </div>

        <div className="bg-muted/30 border border-border rounded-lg p-4 text-sm">
          <p className="font-semibold text-foreground mb-1">Issue Description:</p>
          <p className="text-muted-foreground">{anomaly.description}</p>
        </div>
      </div>

      <div className="md:w-72 shrink-0 flex flex-col justify-between space-y-4 md:border-l border-border md:pl-6">
        {!isResolving ? (
          <>
            <div className="flex-1">
              <p className="text-xs text-muted-foreground uppercase font-semibold mb-2">Recommended Action</p>
              <p className="text-sm font-medium text-foreground">{anomaly.recommendedAction || "Review patient record and contact if necessary."}</p>
            </div>
            <button
              onClick={() => setIsResolving(true)}
              className="w-full bg-primary text-primary-foreground py-2.5 rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              Resolve Anomaly
            </button>
          </>
        ) : (
          <div className="flex flex-col h-full space-y-3">
            <p className="text-sm font-semibold text-foreground">Resolution Notes (Optional)</p>
            <textarea
              className="flex-1 w-full bg-background border border-border text-sm rounded-lg p-3 resize-none focus:ring-2 focus:ring-primary focus:border-primary outline-none"
              placeholder="E.g., Contacted patient, adjusted dosage..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setIsResolving(false)}
                className="flex-1 bg-muted text-muted-foreground hover:bg-muted/80 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleResolve}
                className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Confirm
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
