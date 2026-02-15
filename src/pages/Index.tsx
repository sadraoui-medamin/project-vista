import { useState } from "react";
import { Navbar } from "@/components/landing/Navbar";
import { HeroSection } from "@/components/landing/HeroSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { StatsSection } from "@/components/landing/StatsSection";
import { IntegrationsSection } from "@/components/landing/IntegrationsSection";
import { CTASection } from "@/components/landing/CTASection";
import { Footer } from "@/components/landing/Footer";
import { AuthModal } from "@/components/AuthModal";

const Index = () => {
  const [authOpen, setAuthOpen] = useState(false);
  const [authTab, setAuthTab] = useState<"signin" | "signup">("signin");

  const openSignIn = () => {
    setAuthTab("signin");
    setAuthOpen(true);
  };

  const openSignUp = () => {
    setAuthTab("signup");
    setAuthOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar onSignIn={openSignIn} onSignUp={openSignUp} />
      <HeroSection onGetStarted={openSignUp} />
      <FeaturesSection />
      <StatsSection />
      <IntegrationsSection />
      <CTASection onGetStarted={openSignUp} />
      <Footer />
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} defaultTab={authTab} />
    </div>
  );
};

export default Index;
