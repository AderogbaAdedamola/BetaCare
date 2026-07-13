import { Sparkles } from "lucide-react";

export function VisitSummary({ summary }) {
  if (!summary) return null;

  return (
    <div className="bg-primary/5 border border-primary/20 rounded-xl p-5 mb-6">
      <div className="flex items-center gap-2 mb-3 text-primary">
        <Sparkles size={20} />
        <h3 className="font-semibold">AI Visit Summary</h3>
      </div>
      <p className="text-sm text-foreground/80 leading-relaxed">
        {summary}
      </p>
    </div>
  );
}
