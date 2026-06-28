import { useNavigate } from "react-router";
import { Heart } from "lucide-react";

export function Footer() {
  const navigate = useNavigate();
  const links = {
    Product: ["How It Works", "Features", "Security", "Pricing"],
    Portals: ["Patient Login", "Doctor Login", "Hospital Login", "Register"],
    Company: ["About Us", "Blog", "Careers", "Press"],
    Legal: ["Privacy Policy", "Terms of Service", "NDPR Compliance"],
  };
  return (
    <footer className="bg-foreground text-card pt-14 pb-8 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 pb-12 border-b border-card/10">
          <div className="col-span-2 md:col-span-1">
            <button onClick={() => navigate("/")} className="flex items-center gap-2.5 mb-4 cursor-pointer">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <Heart size={16} className="text-primary-foreground fill-current" />
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
                  <li key={item}>
                    <a href="#" className="text-sm text-card/65 hover:text-card transition-colors">
                      {item}
                    </a>
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
