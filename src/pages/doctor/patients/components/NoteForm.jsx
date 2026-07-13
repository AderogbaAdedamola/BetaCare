import { useState } from "react";
import { Save, AlertCircle } from "lucide-react";

export function NoteForm({ onSubmit, isSubmitting }) {
  const [recordType, setRecordType] = useState("visit_note");
  const [content, setContent] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    onSubmit({ recordType, content });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-3">
        <label className="block text-sm font-semibold text-foreground">
          Record Type
        </label>
        <div className="flex flex-wrap gap-4">
          {["visit_note", "prescription", "lab_result"].map((type) => (
            <label
              key={type}
              className={`flex items-center gap-2 px-4 py-3 border rounded-xl cursor-pointer transition-colors ${
                recordType === type
                  ? "border-primary bg-primary/5 text-primary"
                  : "border-border bg-card text-muted-foreground hover:bg-muted/50"
              }`}
            >
              <input
                type="radio"
                name="recordType"
                value={type}
                checked={recordType === type}
                onChange={() => setRecordType(type)}
                className="sr-only"
              />
              <span className="font-medium capitalize">
                {type.replace("_", " ")}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <label htmlFor="content" className="block text-sm font-semibold text-foreground">
          Clinical Notes / Details
        </label>
        <textarea
          id="content"
          rows={6}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Enter detailed clinical observations, prescribed medications, or lab interpretations..."
          className="w-full bg-card border border-border text-foreground text-sm rounded-xl focus:ring-2 focus:ring-primary focus:border-primary block p-4 outline-none transition-all resize-none"
          required
        />
      </div>

      <div className="bg-amber-500/10 border border-amber-500/20 text-amber-600 p-4 rounded-xl flex items-start gap-3">
        <AlertCircle size={18} className="shrink-0 mt-0.5" />
        <div className="text-sm">
          <p className="font-semibold">Important</p>
          <p className="mt-1 opacity-90">
            Records added here are permanently attached to the patient's medical history and will be processed by the AI Agent to generate proactive check-ins.
          </p>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting || !content.trim()}
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save size={18} />
          {isSubmitting ? "Saving..." : "Save Record"}
        </button>
      </div>
    </form>
  );
}
