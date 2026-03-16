import Navbar from "@/components/landing/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import ProblemSection from "@/components/landing/ProblemSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import ReportPreview from "@/components/landing/ReportPreview";
import TrustSection from "@/components/landing/TrustSection";
import SocialProof from "@/components/landing/SocialProof";
import PricingSection from "@/components/landing/PricingSection";
import FinalCTA from "@/components/landing/FinalCTA";
import Footer from "@/components/landing/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <ProblemSection />
      <FeaturesSection />
      <ReportPreview />
      <TrustSection />
      <SocialProof />
      <PricingSection />
      <FinalCTA />
      <Footer />
    </div>
  );
};

export default Index;
