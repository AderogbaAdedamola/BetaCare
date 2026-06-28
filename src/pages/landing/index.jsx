import { HeroSection } from "./components/HeroSection";
import { ProblemSection } from "./components/ProblemSection";
import { FeaturesSection } from "./components/FeaturesSection";
import { HowItWorksSection } from "./components/HowItWorksSection";
import { HospitalSection } from "./components/HospitalSection";
import { TrustSection } from "./components/TrustSection";
import { FAQSection } from "./components/FAQSection";
import { CTASection } from "./components/CTASection";
import { Footer } from "./components/Footer";

export default function LandingPage({ onGetStarted }) {
  return (
    <>
      <HeroSection onGetStarted={onGetStarted} />
      <ProblemSection />
      <FeaturesSection />
      <HowItWorksSection />
      <HospitalSection />
      <TrustSection />
      <FAQSection />
      <CTASection onGetStarted={onGetStarted} />
      <Footer />
    </>
  );
}
