import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "../components/shared/Layout";
import { api, setSession } from "../lib/api";

export default function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", phone: "", password: "" });
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
      const data = await api.post("/auth/patient/signup", form);
      setSession(data.token, data.role);
      navigate("/patient/dashboard");
    } catch (err) {
      setError(err.message || "Couldn't create your account. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Layout>
      <div className="max-w-sm mx-auto px-6 py-16">
        <h1 className="text-2xl font-display font-semibold text-ink mb-1">Create your account</h1>
        <p className="text-sm text-ink/60 mb-8">
          Get symptom checks and reminders, synced across every channel you use.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-ink/70 mb-1">
              Full name
            </label>
            <input
              id="name"
              type="text"
              required
              value={form.name}
              onChange={update("name")}
              className="w-full rounded-xl border border-line bg-white px-4 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-teal-700 focus:border-transparent"
            />
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-ink/70 mb-1">
              Phone number
            </label>
            <input
              id="phone"
              type="tel"
              required
              placeholder="0803…"
              value={form.phone}
              onChange={update("phone")}
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
              minLength={6}
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
            {loading ? "Creating account…" : "Create account"}
          </button>
        </form>

        <p className="text-sm text-ink/60 mt-6 text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-teal-900 font-medium hover:text-clay">
            Log in
          </Link>
        </p>
      </div>
    </Layout>
  );
}