import Navbar from "@/components/navbar";
import HeroSection from "@/components/sections/hero";
import ProblemSection from "@/components/sections/problem";
import HowItWorksSection from "@/components/sections/how-it-works";
import WalkthroughSection from "@/components/sections/walkthrough";
import BeforeAfterSection from "@/components/sections/before-after";
import ComparisonSection from "@/components/sections/comparison";
import ROICalculator from "@/components/sections/roi-calculator";
import FAQSection from "@/components/sections/faq";
import Footer from "@/components/sections/footer";

export default function HomePage() {
  return (
    <main>
      <Navbar />
      <HeroSection />
      <ProblemSection />
      <HowItWorksSection />
      <WalkthroughSection />
      <BeforeAfterSection />
      <ComparisonSection />
      <ROICalculator />
      <FAQSection />
      <Footer />
    </main>
  );
}