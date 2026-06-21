import WhyButton from "./WhyButton";

const SEVERITY = {
  chemist: {
    label: "See a chemist",
    sub: "This sounds manageable with over-the-counter care.",
    bg: "bg-sage-100",
    border: "border-sage/30",
    dot: "bg-sage",
  },
  clinic: {
    label: "Visit a clinic",
    sub: "Worth getting checked by a health worker soon.",
    bg: "bg-amber-100",
    border: "border-amber/30",
    dot: "bg-amber",
  },
  hospital: {
    label: "Go to a hospital",
    sub: "This needs medical attention now.",
    bg: "bg-rust-100",
    border: "border-rust/30",
    dot: "bg-rust",
  },
};

export default function TriageResult({ result }) {
  if (!result) return null;

  const meta = SEVERITY[result.severity] ?? SEVERITY.clinic;

  return (
    <div className={`mt-6 rounded-xl border ${meta.border} ${meta.bg} px-5 py-4`}>
      <div className="flex items-center gap-2 mb-2">
        <span className={`h-2.5 w-2.5 rounded-full ${meta.dot}`} aria-hidden="true" />
        <span className="font-display font-semibold text-ink">{meta.label}</span>
      </div>
      <p className="text-sm text-ink/60 mb-2">{meta.sub}</p>
      <p className="text-base leading-relaxed text-ink">{result.triage}</p>
      <WhyButton why={result.why} />
    </div>
  );
}
