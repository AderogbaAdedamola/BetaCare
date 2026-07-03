import { useState } from "react";
import { X, Plus } from "lucide-react";


export function MedicationList({ medications, onChange }) {
  const FREQS = [
    { value: "once_daily", label: "Once daily" },
    { value: "twice_daily", label: "Twice daily" },
    { value: "three_daily", label: "3× daily" },
    { value: "as_needed", label: "As needed" },
    { value: "weekly", label: "Weekly" },
  ];
  const inputCls =
    "w-full px-3 py-2.5 bg-muted rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all text-foreground placeholder:text-muted-foreground";

  function add() {
    onChange([...medications, { name: "", dosage: "", frequency: "once_daily" }]);
  }
  function update(i, field, val) {
    const next = [...medications];
    next[i] = { ...next[i], [field]: val };
    onChange(next);
  }
  function remove(i) {
    onChange(medications.filter((_, idx) => idx !== i));
  }

  return (
    <div className="flex flex-col gap-3">
      {medications.map((med, i) => (
        <div
          key={i}
          className="bg-muted/50 border border-border rounded-xl p-4"
        >
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Medication {i + 1}
            </p>
            <button
              type="button"
              onClick={() => remove(i)}
              className="text-muted-foreground hover:text-red-500 transition-colors"
            >
              <X size={15} />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2 mb-2">
            <input
              value={med.name}
              onChange={(e) => update(i, "name", e.target.value)}
              placeholder="Drug name"
              className={inputCls}
            />
            <input
              value={med.dosage}
              onChange={(e) => update(i, "dosage", e.target.value)}
              placeholder="e.g. 500mg"
              className={inputCls}
            />
          </div>
          <select
            value={med.frequency}
            onChange={(e) => update(i, "frequency", e.target.value)}
            className={`${inputCls} appearance-none cursor-pointer`}
          >
            {FREQS.map((f) => (
              <option key={f.value} value={f.value}>
                {f.label}
              </option>
            ))}
          </select>
        </div>
      ))}
      {medications.length < 8 && (
        <button
          type="button"
          onClick={add}
          className="flex items-center justify-center gap-2 py-3.5 border-2 border-dashed border-border rounded-xl text-sm text-muted-foreground hover:border-primary/40 hover:text-primary transition-colors"
        >
          <Plus size={16} /> Add medication
        </button>
      )}
    </div>
  );
}