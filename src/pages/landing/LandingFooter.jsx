import { Link } from "react-router-dom";

export default function LandingFooter() {
  return (
    <footer className="border-t border-white/8 bg-ink">
      <div className="max-w-5xl mx-auto px-8 py-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
        <div className="flex items-center gap-6">
          <p className="font-display font-bold text-white text-sm">BetaCare</p>
          <p className="text-[11px] text-white/25 leading-relaxed hidden sm:block">
            Stats: WHO (1:600) · NG ratio (1:3,474) · EMR (&lt;18%) · OOP (74.7%) · AI accuracy (98%+)
          </p>
        </div>
        <div className="flex items-center gap-6 text-xs">
          <Link to="/signup" className="text-white/30 hover:text-white transition-colors">Sign up</Link>
          <Link to="/login" className="text-white/30 hover:text-white transition-colors">Patient login</Link>
          <Link to="/doctor/login" className="text-white/30 hover:text-white transition-colors">Doctor login</Link>
        </div>
      </div>
    </footer>
  );
}