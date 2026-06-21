import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Layout from "../../../components/shared/Layout";
import PatientHistoryTimeline from "../../../components/PatientHistoryTimeline";
import DifferentialDiagnosisCard from "../../../components/DifferentialDiagnosisCard";
import EmptyState, { AlertIcon } from "../../../components/shared/EmptyState";
import { SkeletonLine, SkeletonCard } from "../../../components/shared/Skeleton";
import { api } from "../../../lib/api";

export default function PatientDetail() {
  const { id } = useParams();
  const [patient, setPatient] = useState(null);
  const [diagnosis, setDiagnosis] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      api.get(`/doctor/patients/${id}`),
      api.get(`/doctor/patients/${id}/diagnosis`),
    ])
      .then(([patientData, diagnosisData]) => {
        setPatient(patientData);
        setDiagnosis(diagnosisData);
      })
      .catch(() => {
        setPatient(null);
        setDiagnosis(null);
      })
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <Layout>
      <div className="max-w-2xl mx-auto px-6 py-12">
        <Link to="/doctor/patients" className="text-sm text-teal-900 hover:text-clay font-medium">
          ← All patients
        </Link>

        {loading ? (
          <div className="mt-6 space-y-8">
            <SkeletonLine className="h-8 w-1/2" />
            <SkeletonCard />
            <div className="space-y-3">
              <SkeletonCard />
              <SkeletonCard />
            </div>
          </div>
        ) : !patient ? (
          <div className="mt-6">
            <EmptyState
              icon={<AlertIcon />}
              title="Patient not found"
              detail="This patient may not exist, or you may not have access under your hospital."
              action={
                <Link
                  to="/doctor/patients"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-teal-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-teal-700 transition-colors"
                >
                  Back to patients
                </Link>
              }
            />
          </div>
        ) : (
          <>
            <h1 className="text-2xl font-display font-semibold text-ink mt-4 mb-8">
              {patient.name}
            </h1>

            <section className="mb-10">
              <h2 className="text-lg font-display font-semibold text-ink mb-4">
                AI differential diagnosis
              </h2>
              <DifferentialDiagnosisCard diagnosis={diagnosis} />
            </section>

            <section>
              <h2 className="text-lg font-display font-semibold text-ink mb-4">History</h2>
              <PatientHistoryTimeline interactions={patient.interactions ?? []} variant="doctor" />
            </section>
          </>
        )}
      </div>
    </Layout>
  );
}