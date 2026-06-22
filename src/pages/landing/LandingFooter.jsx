import { Link } from "react-router-dom";

export default function LandingFooter() {
  return (
    <footer className="bg-teal-900 text-white">
      <div className="max-w-5xl mx-auto px-6 py-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div>
          <p className="font-display font-bold text-white mb-1">BetaCare</p>
          <p className="text-xs text-white/35 max-w-sm leading-relaxed">
            Stats: WHO ratio standard (1:600) · NG ratio (1:3,474) · facility ratio (1:5,475) · EMR adoption (&lt;18%) · out-of-pocket rate (74.7%) · AI TB accuracy (98%+)
          </p>
        </div>
        <div className="flex items-center gap-5 text-sm">
          <Link to="/signup" className="text-white/40 hover:text-white transition-colors">Sign up</Link>
          <Link to="/login" className="text-white/40 hover:text-white transition-colors">Patient login</Link>
          <Link to="/doctor/login" className="text-white/40 hover:text-white transition-colors">Doctor login</Link>
        </div>
      </div>
    </footer>
  );
}