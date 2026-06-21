import { useState } from "react";

export default function SymptomInput({ onSubmit, loading }) {
  const [text, setText] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed || loading) return;
    onSubmit(trimmed);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <label htmlFor="symptoms" className="block text-sm font-medium text-ink/70">
        What's going on?
      </label>
      <textarea
        id="symptoms"
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={4}
        placeholder="e.g. I've had a fever and headache since yesterday, and I feel weak"
        className="w-full rounded-xl border border-line bg-white px-4 py-3 text-base text-ink placeholder:text-ink/35 focus:outline-none focus:ring-2 focus:ring-teal-700 focus:border-transparent resize-none"
      />
      <button
        type="submit"
        disabled={!text.trim() || loading}
        className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl bg-teal-900 px-6 py-3 text-white font-medium hover:bg-teal-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? "Checking…" : "Check my symptoms"}
      </button>
    </form>
  );
}
