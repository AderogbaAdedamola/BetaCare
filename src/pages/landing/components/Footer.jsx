import { useNavigate } from "react-router";
import { BetaCareLogo } from "../../../components/icons/BetaCareLogo";
import { Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export function Footer() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const links = {
    [t('footer.product')]: [
      { label: t('footer.productLinks.howItWorks'), link: "#how-it-works" }, 
      { label: t('footer.productLinks.features'), link: "#features" }, 
      { label: t('footer.productLinks.security'), link: "#" }, 
      { label: t('footer.productLinks.pricing'), link: "#" }
    ],
    [t('footer.portals')]: [
      { label: t('footer.portalsLinks.patientLogin'), link: "/patient/login" }, 
      { label: t('footer.portalsLinks.doctorLogin'), link: "/doctor/login" }, 
      { label: t('footer.portalsLinks.hospitalLogin'), link: "/hospital/login" }, 
      { label: t('footer.portalsLinks.register'), link: "/register" }
    ],
    [t('footer.company')]: [
      { label: t('footer.companyLinks.aboutUs'), link: "#" }, 
      { label: t('footer.companyLinks.blog'), link: "#" }, 
      { label: t('footer.companyLinks.careers'), link: "#" }, 
      { label: t('footer.companyLinks.press'), link: "#" }
    ],
    [t('footer.legal')]: [
      { label: t('footer.legalLinks.privacyPolicy'), link: "#" }, 
      { label: t('footer.legalLinks.terms'), link: "/terms" }, 
      { label: t('footer.legalLinks.ndpr'), link: "#" }
    ],
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
              {t('footer.desc')}
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
          <p>{t('footer.copyright')}</p>
          <p>{t('footer.madeWithCare')}</p>
        </div>
      </div>
    </footer>
  );
}
