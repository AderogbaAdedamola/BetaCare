import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "../components/shared/Layout";
import { api, setSession } from "../lib/api";

export default function Login({ portal = "patient" }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ phone: "", email: "", identifier: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function update(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const path = portal === "doctor" ? "/auth/doctor/login" : "/auth/patient/login";
      const identifierField = portal === "doctor" ? { email: form.email, password: form.password } : { phone: form.phone, password: form.password };
      console.log("Submitting login form:", identifierField); // Debug log
      const data = await api.post(path, identifierField);
      setSession(data.token, data.role, data.patient?.id || data.doctor?.id);
      navigate(data.role === "doctor" ? "/doctor/patients" : "/patient/dashboard");
    } catch (err) {
      setError(err.message || "Couldn't log you in. Check your details and try again.");
    } finally {
      setLoading(false);
    }
  }

  const isDoctor = portal === "doctor";
  const identifierLabel = isDoctor ? "Email" : "Phone";
  

  return (
    <Layout>
      <div className="max-w-sm mx-auto px-6 py-16">
        <h1 className="text-2xl font-display font-semibold text-ink mb-1">
          {isDoctor ? "Doctor log in" : "Log in"}
        </h1>
        <p className="text-sm text-ink/60 mb-8">
          {isDoctor ? "Sign in under your hospital." : "Welcome back."}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor={identifierLabel.toLowerCase()} className="block text-sm font-medium text-ink/70 mb-1">
              {isDoctor ? "Email" : "Phone number"}
            </label>
            <input
              id={identifierLabel.toLowerCase()}
              type={isDoctor ? "email" : "tel"}
              required
              value={form[identifierLabel]}
              onChange={update(identifierLabel.toLowerCase())}
              className="w-full rounded-xl border border-line bg-white px-4 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-teal-700 focus:border-transparent"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-ink/70 mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={form.password}
              onChange={update("password")}
              className="w-full rounded-xl border border-line bg-white px-4 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-teal-700 focus:border-transparent"
            />
          </div>

          {error && <p className="text-sm text-rust">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-teal-900 px-6 py-3 text-white font-medium hover:bg-teal-700 disabled:opacity-40 transition-colors"
          >
            {loading ? "Logging in…" : "Log in"}
          </button>
        </form>

        {!isDoctor && (
          <p className="text-sm text-ink/60 mt-6 text-center">
            New here?{" "}
            <Link to="/signup" className="text-teal-900 font-medium hover:text-clay">
              Create an account
            </Link>
          </p>
        )}
      </div>
    </Layout>
  );
}
