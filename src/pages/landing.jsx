import { Link } from "react-router-dom";
import Layout from "../components/shared/Layout";

export default function Landing() {
  return (
    <Layout>
      <div className="max-w-2xl mx-auto px-6 py-24 text-center">
        <p className="text-xs font-mono uppercase tracking-widest text-clay mb-4">
          AI in Medicine · Oyo State
        </p>
        <h1 className="text-4xl font-display font-semibold text-ink mb-4 leading-tight">
          Healthcare guidance that meets you on whatever phone you have.
        </h1>
        <p className="text-base text-ink/60 mb-10 max-w-md mx-auto">
          WhatsApp, USSD, voice, or the web — BetaCare gives patients a clear next step, and
          gives doctors the full picture, synced across every channel.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link
            to="/signup"
            className="rounded-xl bg-teal-900 px-6 py-3 text-white font-medium hover:bg-teal-700 transition-colors"
          >
            Get started
          </Link>
          <Link
            to="/doctor/login"
            className="rounded-xl border border-line px-6 py-3 text-ink font-medium hover:border-teal-700 transition-colors"
          >
            Doctor log in
          </Link>
        </div>
      </div>
    </Layout>
  );
}
