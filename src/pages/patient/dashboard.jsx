import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../../components/shared/Layout";
import SymptomInput from "../../components/SymptomChecker/SymptomInput";
import TriageResult from "../../components/SymptomChecker/TriageResult";
import ReminderCard from "../../components/ReminderCard";
import EmptyState, { BellIcon } from "../../components/shared/EmptyState";
import { SkeletonList } from "../../components/shared/Skeleton";
import { api } from "../../lib/api";

export default function PatientDashboard() {
  const [result, setResult] = useState(null);
  const [checking, setChecking] = useState(false);
  const [checkError, setCheckError] = useState("");

  const [reminders, setReminders] = useState([]);
  const [remindersLoading, setRemindersLoading] = useState(true);

  useEffect(() => {
    api
      .get("/patient/reminders")
      .then((data) => setReminders(data.reminders ?? []))
      .catch(() => setReminders([]))
      .finally(() => setRemindersLoading(false));
  }, []);

  async function handleSymptomSubmit(text) {
    setChecking(true);
    setCheckError("");
    setResult(null);
    try {
      const data = await api.post("/patient/symptom-check", { text });
      setResult(data);
    } catch (err) {
      setCheckError(err.message || "Couldn't check your symptoms right now. Try again.");
    } finally {
      setChecking(false);
    }
  }

  return (
    <Layout>
      <div className="max-w-2xl mx-auto px-6 py-12 space-y-12">
        <section>
          <h1 className="text-2xl font-display font-semibold text-ink mb-1">
            How are you feeling?
          </h1>
          <p className="text-sm text-ink/60 mb-6">
            Describe your symptoms in your own words — we'll tell you what to do next.
          </p>

          <div className="bg-white rounded-2xl border border-line p-6">
            <SymptomInput onSubmit={handleSymptomSubmit} loading={checking} />
            {checkError && <p className="text-sm text-rust mt-3">{checkError}</p>}
            <TriageResult result={result} />
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-display font-semibold text-ink">Your reminders</h2>
            <Link to="/patient/history" className="text-sm text-teal-900 hover:text-clay font-medium">
              View history →
            </Link>
          </div>

          {remindersLoading ? (
            <SkeletonList count={2} />
          ) : reminders.length === 0 ? (
            <EmptyState
              icon={<BellIcon />}
              title="You're all caught up"
              detail="Nothing needs your attention right now. Check your symptoms above any time and we'll keep you on track."
            />
          ) : (
            <div className="space-y-3">
              {reminders.map((r) => (
                <ReminderCard key={r.id} reminder={r} />
              ))}
            </div>
          )}
        </section>
      </div>
    </Layout>
  );
}