import { CheckCircle2 } from "lucide-react";

export function PillSelect({ label, value, onChange, options }) {
  return (
    <div>
      {label && (
        <p className="text-sm font-medium text-foreground mb-2">{label}</p>
      )}
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
              value === opt.value
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-muted text-muted-foreground border-border hover:border-primary/40 hover:text-foreground"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export function TriSelect({ label, value, onChange }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-border last:border-0">
      <span className="text-sm text-foreground">{label}</span>
      <div className="flex gap-1">
        {[
          { v: "yes", l: "Yes" },
          { v: "no", l: "No" },
          { v: "unknown", l: "?" },
        ].map(({ v, l }) => (
          <button
            key={v}
            type="button"
            onClick={() => onChange(v)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              value === v
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/70"
            }`}
          >
            {l}
          </button>
        ))}
      </div>
    </div>
  );
}

export function ConditionToggle({ label, checked, onChange }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`flex items-center gap-2.5 px-3.5 py-3 rounded-xl border text-sm font-medium text-left transition-all w-full ${
        checked
          ? "bg-primary/10 border-primary/40 text-primary"
          : "bg-muted border-border text-muted-foreground hover:border-primary/20 hover:text-foreground"
      }`}
    >
      <div
        className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-all ${
          checked ? "bg-primary border-primary" : "border-current"
        }`}
      >
        {checked && <CheckCircle2 size={10} className="text-primary-foreground" />}
      </div>
      {label}
    </button>
  );
}
