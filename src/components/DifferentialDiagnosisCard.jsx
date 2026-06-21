import EmptyState, { PulseIcon } from "./shared/EmptyState";

export default function DifferentialDiagnosisCard({ diagnosis }) {
  if (!diagnosis) {
    return (
      <EmptyState
        icon={<PulseIcon />}
        title="Nothing to flag yet"
        detail="As soon as this patient's latest symptom check is processed, the AI's suggested differential will appear here."
      />
    );
  }

  return (
    <div className="rounded-xl border border-teal-100 bg-white px-5 py-4">
      <p className="text-xs font-mono uppercase tracking-wide text-teal-700 mb-3">
        AI differential diagnosis
      </p>
      <ul className="space-y-2">
        {diagnosis.candidates.map((c) => (
          <li key={c.condition} className="flex items-center justify-between gap-3">
            <span className="text-sm text-ink">{c.condition}</span>
            <span className="text-xs font-mono text-ink/45">{c.confidence}</span>
          </li>
        ))}
      </ul>
      {diagnosis.notes && (
        <p className="text-sm text-ink/70 leading-relaxed mt-3 pt-3 border-t border-line">
          {diagnosis.notes}
        </p>
      )}
    </div>
  );
}