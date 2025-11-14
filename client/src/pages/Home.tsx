import { Navigation } from "@/components/Navigation";
import { HeroSection } from "@/components/sections/HeroSection";
import { PhilosophySection } from "@/components/sections/PhilosophySection";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { PricingSection } from "@/components/sections/PricingSection";
import { TeamBuildingSection } from "@/components/sections/TeamBuildingSection";
import { BookingSection } from "@/components/sections/BookingSection";
import { EnhancedBookingSection } from "@/components/sections/EnhancedBookingSection";
import { ContactSection } from "@/components/sections/ContactSection";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <HeroSection />
      <PhilosophySection />
      <ServicesSection />
      <PricingSection />
      <TeamBuildingSection />
      <EnhancedBookingSection />
      <BookingSection />
      <ContactSection />
      <Footer />
    </div>
  );
}
