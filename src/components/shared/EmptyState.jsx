/**
 * Stylish, hopeful empty state — not a dead end.
 */
export default function EmptyState({ icon, title, detail, action }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-teal-100 bg-gradient-to-b from-teal-100/40 to-white px-6 py-12 text-center">
      {icon && (
        <div className="mx-auto mb-4 h-14 w-14 rounded-2xl bg-white shadow-sm ring-1 ring-teal-100 flex items-center justify-center text-teal-700">
          {icon}
        </div>
      )}
      <p className="text-base font-display font-semibold text-ink">{title}</p>
      {detail && (
        <p className="text-sm text-ink/55 mt-1.5 max-w-sm mx-auto leading-relaxed">{detail}</p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function BellIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}

export function HistoryIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12a9 9 0 1 0 3-6.7" />
      <path d="M3 4v5h5" />
      <path d="M12 7v5l3 3" />
    </svg>
  );
}

export function PeopleIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="8" r="3.25" />
      <path d="M2.5 19.5c0-3.6 2.9-5.5 6.5-5.5s6.5 1.9 6.5 5.5" />
      <circle cx="17.5" cy="8.5" r="2.5" />
      <path d="M17 13.2c2.6.4 4.5 2 4.5 4.8" />
    </svg>
  );
}

export function PulseIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12h4l2-7 4 14 2-7h6" />
    </svg>
  );
}

export function AlertIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3 2 20h20L12 3Z" />
      <path d="M12 10v4" />
      <path d="M12 17h.01" />
    </svg>
  );
}