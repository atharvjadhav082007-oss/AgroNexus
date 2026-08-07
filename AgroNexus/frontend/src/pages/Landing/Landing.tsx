import Navbar from "../../components/Navbar/Navbar";
import Hero from "./components/Hero";
import FeaturesSection from "./components/FeaturesSection";
import HowItWorksSection from "./components/HowItWorksSection";
import DashboardPreviewSection from "./components/DashboardPreviewSection";
import WhyKhetSevaSection from "./components/WhyKhetSevaSection";
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

        <div id="features">
          <FeaturesSection />
        </div>

        <div id="how-it-works">
          <HowItWorksSection />
        </div>

        <WhyKhetSevaSection />

        <CTASection />
      </main>

      <Footer />
    </div>
  );
}

