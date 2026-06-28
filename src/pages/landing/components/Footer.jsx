import { useNavigate } from "react-router";
import { BetaCareLogo } from "../../../components/icons/BetaCareLogo";
import { Heart } from "lucide-react";
import { Link } from "react-router-dom";

export function Footer() {
  const navigate = useNavigate();
  const links = {
    Product: [{ label: "How It Works", link: "#how-it-works" }, { label: "Features", link: "#features" }, { label: "Security", link: "#" }, { label: "Pricing", link: "#" }],
    Portals: [{ label: "Patient Login", link: "/patient/login" }, { label: "Doctor Login", link: "/doctor/login" }, { label: "Hospital Login", link: "/hospital/login" }, { label: "Register", link: "/register" }],
    Company: [{ label: "About Us", link: "#" }, { label: "Blog", link: "#" }, { label: "Careers", link: "#" }, { label: "Press", link: "#" }],
    Legal: [{ label: "Privacy Policy", link: "#" }, { label: "Terms of Service", link: "/terms" }, { label: "NDPR Compliance", link: "#" }],
  };
  return (
    <footer className="bg-foreground text-card pt-14 pb-8 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 pb-12 border-b border-card/10">
          <div className="col-span-2 md:col-span-1">
            <button onClick={() => navigate("/")} className="flex items-center gap-2.5 mb-4 cursor-pointer">
              <div className="w-8 h-8 rounded-lg bg-card/85 flex items-center justify-center">
                {BetaCareLogo("size-6")}
              </div>
              <span className="font-bold text-lg text-card" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Beta<span className="text-primary">Care</span>
              </span>
            </button>
            <p className="text-sm text-card/60 leading-relaxed max-w-[180px]">
              Digitizing Nigeria&apos;s healthcare records, one patient at a time.
            </p>
          </div>
          {Object.entries(links).map(([category, items]) => (
            <div key={category}>
              <p className="text-xs font-semibold text-card/40 uppercase tracking-wider mb-3">{category}</p>
              <ul className="flex flex-col gap-2">
                {items.map((item) => (
                  <li key={item.label}>
                    <Link to={item.link} className="text-sm text-card/65 hover:text-card transition-colors">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-card/40">
          <p>© 2026 BetaCare Technologies Ltd. All rights reserved.</p>
          <p>Made with care for Nigerians, by Nigerians.</p>
        </div>
      </div>
    </footer>
  );
}
