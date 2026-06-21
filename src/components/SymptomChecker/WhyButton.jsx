import { useState } from "react";

/**
 * Collapsed-by-default reveal for the "why" text.
 * `why` is expected to already be present in the parent's data (no separate
 * fetch / spinner) — see BetaCare_Frontend_Workflow.md section 6.
 */
export default function WhyButton({ why }) {
  const [open, setOpen] = useState(false);

  if (!why) return null;

  return (
    <div className="mt-3">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-clay hover:text-rust transition-colors"
      >
        <span
          className={`inline-block transition-transform duration-200 ${open ? "rotate-90" : ""}`}
        >
          ›
        </span>
        {open ? "Hide why" : "Why?"}
      </button>

      <div
        className={`grid transition-all duration-200 ease-out ${
          open ? "grid-rows-[1fr] opacity-100 mt-2" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <p className="text-sm leading-relaxed text-ink/80 bg-clay-100 border border-clay/20 rounded-lg px-4 py-3">
            {why}
          </p>
        </div>
      </div>
    </div>
  );
}
