import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import teamBuildingImage from "@assets/generated_images/Corporate_team_building_boxing_03c0bb35.png";

export function TeamBuildingSection() {
  const scrollToContact = () => {
    const element = document.getElementById("contact");
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
    }
  };

  const benefits = [
    "Ateliers de boxe encadrés par des professionnels",
    "Travail du mental & gestion du stress",
    "Challenges collectifs pour renforcer l'esprit d'équipe",
    "Ateliers \"puissance intérieure & dépassement\"",
    "Formats sur mesure pour votre organisation"
  ];

  return (
    <section id="team-building" className="relative py-16 md:py-24 overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${teamBuildingImage})`,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#1D1D1B]/95 via-[#1D1D1B]/85 to-[#1D1D1B]/70" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <div className="h-1 w-24 bg-primary mb-6 rounded-full" />
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl text-white mb-6" data-testid="heading-team-building">
            Team-Building & Évènements d'Entreprise
          </h2>
          <p className="font-body text-lg text-white/90 mb-8 leading-relaxed" data-testid="text-team-building-description">
            Boostez la cohésion, l'énergie et la motivation de vos équipes avec des sessions de boxe pensées pour sortir du cadre, renforcer la confiance et créer une dynamique positive durable.
          </p>

          <div className="space-y-4 mb-10">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-start gap-3" data-testid={`item-benefit-${index}`}>
                <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
                <p className="font-body text-white/90" data-testid={`text-benefit-${index}`}>{benefit}</p>
              </div>
            ))}
          </div>

          <Button
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-display font-bold text-base px-8 py-6 rounded-sm shadow-lg transition-all duration-300 hover:scale-105"
            onClick={scrollToContact}
            data-testid="button-quote"
          >
            Demander un devis personnalisé
          </Button>
        </div>
      </div>
    </section>
  );
}
