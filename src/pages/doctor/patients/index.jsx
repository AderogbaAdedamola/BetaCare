import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../../../components/shared/Layout";
import EmptyState, { PeopleIcon } from "../../../components/shared/EmptyState";
import { SkeletonList } from "../../../components/shared/Skeleton";
import { api } from "../../../lib/api";

export default function PatientList() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/doctor/patients")
      .then((data) => setPatients(data.patients ?? []))
      .catch(() => setPatients([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Layout>
      <div className="max-w-2xl mx-auto px-6 py-12">
        <h1 className="text-2xl font-display font-semibold text-ink mb-1">Your patients</h1>
        <p className="text-sm text-ink/60 mb-8">Patients seen at your hospital.</p>

        {loading ? (
          <SkeletonList count={4} />
        ) : patients.length === 0 ? (
          <EmptyState
            icon={<PeopleIcon />}
            title="No patients yet"
            detail="As soon as someone checks in under your hospital — on WhatsApp, USSD, voice, or web — they'll appear here."
          />
        ) : (
          <div className="space-y-2">
            {patients.map((p) => (
              <Link
                key={p.id}
                to={`/doctor/patients/${p.id}`}
                className="flex items-center justify-between rounded-xl border border-line bg-white px-5 py-4 hover:border-teal-700 transition-colors"
              >
                <div>
                  <p className="text-base font-medium text-ink">{p.name}</p>
                  <p className="text-sm text-ink/50">{p.lastVisitLabel}</p>
                </div>
                <span className="text-teal-900">→</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}