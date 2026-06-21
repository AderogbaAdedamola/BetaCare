import WhyButton from "./SymptomChecker/WhyButton";

export default function ReminderCard({ reminder }) {
  return (
    <div className="rounded-xl border border-line bg-white px-5 py-4">
      <div className="flex items-start justify-between gap-3">
        <p className="text-base text-ink font-medium">{reminder.title}</p>
        {reminder.dueLabel && (
          <span className="shrink-0 text-xs font-mono text-ink/45 mt-1">{reminder.dueLabel}</span>
        )}
      </div>
      {reminder.detail && (
        <p className="text-sm text-ink/60 mt-1">{reminder.detail}</p>
      )}
      <WhyButton why={reminder.why} />
    </div>
  );
}
