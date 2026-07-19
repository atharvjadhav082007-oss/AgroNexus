import Navbar from "../../components/Navbar/Navbar";
import Hero from "./components/Hero";
import TrustSection from "./components/TrustSection";
import FeaturesSection from "./components/FeaturesSection";
import StatsSection from "./components/StatsSection";
import HowItWorksSection from "./components/HowItWorksSection";
import DashboardPreviewSection from "./components/DashboardPreviewSection";
import WhyKhetSevaSection from "./components/WhyKhetSevaSection";
import TestimonialsSection from "./components/TestimonialsSection";
import CTASection from "./components/CTASection";
import Footer from "../../components/Footer/Footer";

export default function Landing() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8FCF8]">
      <Navbar />

      <main className="flex-grow">
        <div id="home">
          <Hero />
        </div>

        <TrustSection />

        <div id="features">
          <FeaturesSection />
        </div>

        <div id="how-it-works">
          <HowItWorksSection />
        </div>

        <WhyKhetSevaSection />

        <StatsSection />

        <div id="about">
          <TestimonialsSection />
        </div>

        <CTASection />
      </main>

      <Footer />
    </div>
  );
}
