import { Link } from "react-router-dom";
import EmptyState, { HistoryIcon } from "./shared/EmptyState";

const CHANNEL_STYLE = {
  whatsapp: { label: "WhatsApp", className: "bg-sage-100 text-sage" },
  ussd: { label: "USSD", className: "bg-amber-100 text-amber" },
  voice: { label: "Voice", className: "bg-teal-100 text-teal-700" },
  web: { label: "Web", className: "bg-clay-100 text-clay" },
  telegram: { label: "Telegram", className: "bg-sage-100 text-sage" },
};

export default function PatientHistoryTimeline({ interactions = [], variant = "patient" }) {
  if (interactions.length === 0) {
    const isPatient = variant === "patient";
    return (
      <EmptyState
        icon={<HistoryIcon />}
        title={isPatient ? "Your story starts here" : "No interactions recorded yet"}
        detail={
          isPatient
            ? "Once you check your symptoms — here, on WhatsApp, USSD, or by voice — it'll show up in one timeline."
            : "Activity from any channel — WhatsApp, USSD, voice, or web — will appear here as soon as this patient checks in."
        }
        action={
          isPatient ? (
            <Link
              to="/patient/dashboard"
              className="inline-flex items-center gap-1.5 rounded-xl bg-teal-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-teal-700 transition-colors"
            >
              Check your symptoms
            </Link>
          ) : null
        }
      />
    );
  }

  return (
    <ol className="relative border-l border-line pl-6 space-y-6">
      {interactions.map((item) => {
        const channel = CHANNEL_STYLE[item.channel] ?? {
          label: item.channel,
          className: "bg-line text-ink/60",
        };
        return (
          <li key={item.id} className="relative">
            <span className="absolute -left-[29px] top-1 h-3 w-3 rounded-full bg-teal-900 ring-4 ring-paper" />
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-xs font-mono px-2 py-0.5 rounded-full ${channel.className}`}>
                {channel.label}
              </span>
              <span className="text-xs text-ink/40 font-mono">{item.timestampLabel}</span>
            </div>
            <p className="text-sm text-ink leading-relaxed">{item.summary}</p>
          </li>
        );
      })}
    </ol>
  );
}