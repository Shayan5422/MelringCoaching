import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import heroImage from "@assets/generated_images/Hero_boxing_training_session_bd0e6cba.png";

export function HeroSection() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  return (
    <section id="hero" className="relative h-screen flex items-center justify-center overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${heroImage})`,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#1D1D1B]/80 via-[#1D1D1B]/60 to-[#1D1D1B]/80" />
      
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="mb-6">
          <div className="h-1 w-24 bg-primary mx-auto rounded-full animate-pulse" />
        </div>
        
        <h1 className="font-display font-black text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white mb-6 tracking-tight leading-tight" data-testid="heading-hero">
          MELRING
          <span className="block text-3xl sm:text-4xl md:text-5xl lg:text-6xl mt-2 text-primary">
            Coaching par la boxe
          </span>
        </h1>
        
        <p className="font-body text-lg sm:text-xl md:text-2xl text-white/90 mb-4 max-w-3xl mx-auto leading-relaxed" data-testid="text-hero-tagline">
          Un lieu unique où se rencontrent dépassement de soi, puissance intérieure et engagement.
        </p>
        
        <p className="font-body text-base sm:text-lg text-white/80 mb-12 max-w-3xl mx-auto leading-relaxed" data-testid="text-hero-description">
          Chez Melring, on ne vient pas simplement faire du sport : on vient libérer ce qui freine, ancrer ce qui élève, et construire sa confiance — sur le ring comme dans la vie.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Button
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-display font-bold text-base px-8 py-6 rounded-sm shadow-lg transition-all duration-300 hover:scale-105"
            onClick={() => scrollToSection("services")}
            data-testid="button-discover"
          >
            Découvrez l'expérience
          </Button>
          
          <Button
            size="lg"
            variant="outline"
            className="border-2 border-white text-white bg-white/10 backdrop-blur-sm hover:bg-white/20 font-display font-bold text-base px-8 py-6 rounded-sm transition-all duration-300 hover:scale-105"
            onClick={() => scrollToSection("enhanced-booking")}
            data-testid="button-schedule"
          >
            Voir le planning
          </Button>
        </div>

        <button
          onClick={() => scrollToSection("philosophy")}
          className="animate-bounce text-white/70 hover:text-primary transition-colors"
          data-testid="button-scroll-down"
          aria-label="Scroll down"
        >
          <ChevronDown className="w-8 h-8" />
        </button>
      </div>
    </section>
  );
}
