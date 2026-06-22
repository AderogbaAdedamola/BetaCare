import Hero from "./Hero";
import StatsBanner from "./StatsBanner";
import ProblemSection from "./ProblemSection";
import HowItHelps from "./HowItHelps";
import Approach from "./Approach";
import CTA from "./CTA";
import LandingFooter from "./LandingFooter";

export default function Landing() {
  return (
    <div className="min-h-screen flex flex-col">
      <Hero />
      <StatsBanner />
      <ProblemSection />
      <HowItHelps />
      <Approach />
      <CTA />
      <LandingFooter />
    </div>
  );
}