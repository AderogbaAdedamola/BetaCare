import { useEffect, useState } from "react";
import Layout from "../../components/shared/Layout";
import PatientHistoryTimeline from "../../components/PatientHistoryTimeline";
import { SkeletonList } from "../../components/shared/Skeleton";
import { api } from "../../lib/api";

export default function PatientHistory() {
  const [interactions, setInteractions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/patient/interactions")
      .then((data) => setInteractions(data.interactions ?? []))
      .catch(() => setInteractions([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Layout>
      <div className="max-w-2xl mx-auto px-6 py-12">
        <h1 className="text-2xl font-display font-semibold text-ink mb-1">Your history</h1>
        <p className="text-sm text-ink/60 mb-8">
          Every check-in, on whichever channel you used at the time.
        </p>

        {loading ? <SkeletonList count={4} /> : <PatientHistoryTimeline interactions={interactions} />}
      </div>
    </Layout>
  );
}