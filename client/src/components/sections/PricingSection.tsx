import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PricingSection() {
  const scrollToContact = () => {
    const element = document.getElementById("contact");
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
    }
  };

  return (
    <section id="pricing" className="py-16 md:py-24 bg-[#1D1D1B]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="h-1 w-24 bg-primary mx-auto mb-6 rounded-full" />
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl text-white mb-6" data-testid="heading-pricing">
            Tarifs
          </h2>
          <p className="font-body text-lg text-white/80 max-w-2xl mx-auto" data-testid="text-pricing-description">
            Des formules adaptées à tous les besoins et tous les objectifs.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-12">
          <div className="bg-white/5 border-2 border-primary/30 rounded-md overflow-hidden hover-elevate active-elevate-2 transition-all duration-300" data-testid="card-pricing-group">
            <div className="bg-primary p-4">
              <h3 className="font-display font-bold text-xl text-primary-foreground text-center" data-testid="heading-pricing-group">
                Cours Collectifs
              </h3>
              <p className="text-center text-primary-foreground/80 text-sm mt-1" data-testid="text-pricing-group-subtitle">6 à 12 personnes</p>
            </div>
            <div className="p-8">
              <div className="space-y-4 mb-6">
                <div className="flex items-baseline gap-2" data-testid="item-price-session-75">
                  <Check className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-body text-white font-medium">Séance 1h15</p>
                    <p className="text-primary text-2xl font-display font-bold" data-testid="text-price-18">18€<span className="text-sm font-normal text-white/70">/personne</span></p>
                  </div>
                </div>
                <div className="flex items-baseline gap-2" data-testid="item-price-session-45">
                  <Check className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-body text-white font-medium">Séance express 45min</p>
                    <p className="text-primary text-2xl font-display font-bold" data-testid="text-price-12">12€<span className="text-sm font-normal text-white/70">/personne</span></p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white/5 border-2 border-primary/30 rounded-md overflow-hidden hover-elevate active-elevate-2 transition-all duration-300" data-testid="card-pricing-packages">
            <div className="bg-primary p-4">
              <h3 className="font-display font-bold text-xl text-primary-foreground text-center">
                Forfaits
              </h3>
              <p className="text-center text-primary-foreground/80 text-sm mt-1">Économisez avec nos packs</p>
            </div>
            <div className="p-8">
              <div className="space-y-4 mb-6">
                <div className="flex items-baseline gap-2">
                  <Check className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-body text-white font-medium">5 séances (1h15)</p>
                    <p className="text-primary text-2xl font-display font-bold">80€</p>
                  </div>
                </div>
                <div className="flex items-baseline gap-2">
                  <Check className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-body text-white font-medium">10 séances (1h15)</p>
                    <p className="text-primary text-2xl font-display font-bold">150€</p>
                  </div>
                </div>
                <div className="flex items-baseline gap-2">
                  <Check className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-body text-white font-medium">5 séances express (45min)</p>
                    <p className="text-primary text-2xl font-display font-bold">50€</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white/5 border-2 border-primary/30 rounded-md overflow-hidden hover-elevate active-elevate-2 transition-all duration-300" data-testid="card-pricing-personal">
            <div className="bg-primary p-4">
              <h3 className="font-display font-bold text-xl text-primary-foreground text-center">
                Coaching Personnalisé
              </h3>
              <p className="text-center text-primary-foreground/80 text-sm mt-1">Individuel & Duo</p>
            </div>
            <div className="p-8">
              <div className="space-y-6">
                <div>
                  <p className="font-display font-bold text-lg text-primary mb-3">Individuel</p>
                  <div className="space-y-2 pl-4">
                    <div className="flex items-baseline gap-2">
                      <Check className="w-4 h-4 text-primary flex-shrink-0 mt-1" />
                      <div>
                        <p className="font-body text-white text-sm">Séance : <span className="text-primary font-bold">50€</span></p>
                      </div>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <Check className="w-4 h-4 text-primary flex-shrink-0 mt-1" />
                      <div>
                        <p className="font-body text-white text-sm">Forfait 5 séances : <span className="text-primary font-bold">230€</span></p>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <p className="font-display font-bold text-lg text-primary mb-3">Duo</p>
                  <div className="space-y-2 pl-4">
                    <div className="flex items-baseline gap-2">
                      <Check className="w-4 h-4 text-primary flex-shrink-0 mt-1" />
                      <div>
                        <p className="font-body text-white text-sm">Séance : <span className="text-primary font-bold">65€</span></p>
                      </div>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <Check className="w-4 h-4 text-primary flex-shrink-0 mt-1" />
                      <div>
                        <p className="font-body text-white text-sm">Forfait 5 séances : <span className="text-primary font-bold">300€</span></p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center">
          <Button
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-display font-bold text-base px-8 py-6 rounded-sm shadow-lg transition-all duration-300 hover:scale-105"
            onClick={scrollToContact}
            data-testid="button-contact-pricing"
          >
            Réserver maintenant
          </Button>
        </div>
      </div>

      {/* Monthly Subscription Section */}
      <div className="border-t border-white/20 pt-16">
        <div className="text-center mb-12">
          <div className="h-1 w-24 bg-primary mx-auto mb-6 rounded-full" />
          <h3 className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl text-white mb-6">
            NOS FORMULES
          </h3>
          <p className="font-body text-xl text-white/90 max-w-3xl mx-auto italic mb-8">
            Chez Melring, on forge la confiance autant que le corps.
          </p>
          <p className="font-body text-sm text-white/70 max-w-2xl mx-auto">
            * Tous nos abonnements mensuels sont soumis à un engagement d'un an pour garantir votre progression et notre accompagnement optimal.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Starter Plan */}
          <div className="bg-white/5 border-2 border-white/20 rounded-md overflow-hidden hover-elevate active-elevate-2 transition-all duration-300 relative">
            <div className="bg-gradient-to-br from-gray-600 to-gray-700 p-6">
              <h3 className="font-display font-black text-2xl text-white text-center mb-2">
                Starter
              </h3>
              <div className="text-center">
                <span className="text-4xl font-display font-black text-white">55 €</span>
                <span className="text-white/80 text-sm"> / mois</span>
              </div>
              <p className="text-center text-white/90 mt-3 font-semibold">
                5 séances / mois
              </p>
              <p className="text-center text-white/80 text-sm">
                → 11 € la séance
              </p>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-3">
                <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                <p className="font-body text-white">Idéal pour garder le rythme</p>
              </div>
              <div className="pt-4 border-t border-white/10">
                <p className="text-white/60 text-sm text-center mb-4">Perfect pour maintenir une routine régulière</p>
              </div>
            </div>
          </div>

          {/* Warrior Plan - Best Seller */}
          <div className="bg-white/10 border-2 border-primary rounded-md overflow-hidden hover-elevate active-elevate-2 transition-all duration-300 relative transform lg:scale-105 shadow-xl">
            <div className="absolute top-0 right-0 bg-primary text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
              Best-seller
            </div>
            <div className="bg-gradient-to-br from-primary to-primary/80 p-6">
              <h3 className="font-display font-black text-2xl text-white text-center mb-2">
                Warrior
              </h3>
              <div className="text-center">
                <span className="text-4xl font-display font-black text-white">75 €</span>
                <span className="text-white/90 text-sm"> / mois</span>
              </div>
              <p className="text-center text-white/90 mt-3 font-semibold">
                8 séances / mois
              </p>
              <p className="text-center text-white/80 text-sm">
                → 9,40 € la séance
              </p>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-3">
                <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                <p className="font-body text-white">Progression visible</p>
              </div>
              <div className="flex items-center gap-3">
                <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                <p className="font-body text-white">Équilibre parfait</p>
              </div>
              <div className="pt-4 border-t border-white/10">
                <p className="text-white/60 text-sm text-center mb-4">Le choix idéal pour des résultats concrets</p>
              </div>
            </div>
          </div>

          {/* Champion Plan */}
          <div className="bg-white/5 border-2 border-white/20 rounded-md overflow-hidden hover-elevate active-elevate-2 transition-all duration-300 relative">
            <div className="bg-gradient-to-br from-yellow-600 to-orange-600 p-6">
              <h3 className="font-display font-black text-2xl text-white text-center mb-2">
                Champion
              </h3>
              <div className="text-center">
                <span className="text-4xl font-display font-black text-white">95 €</span>
                <span className="text-white/90 text-sm"> / mois</span>
              </div>
              <p className="text-center text-white/90 mt-3 font-semibold">
                12+ séances / mois (illimité)
              </p>
              <p className="text-center text-white/80 text-sm">
                → 7,90 € la séance
              </p>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-3">
                <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                <p className="font-body text-white">Tout donner</p>
              </div>
              <div className="flex items-center gap-3">
                <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                <p className="font-body text-white">Accès complet</p>
              </div>
              <div className="pt-4 border-t border-white/10">
                <p className="text-white/60 text-sm text-center mb-4">Pour les plus motivés qui visent l'excellence</p>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-12">
          <Button
            size="lg"
            className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white font-display font-bold text-base px-12 py-6 rounded-sm shadow-lg transition-all duration-300 hover:scale-105 border-2 border-white/20"
            onClick={scrollToContact}
          >
            S'abonner maintenant
          </Button>
        </div>
      </div>
    </section>
  );
}
