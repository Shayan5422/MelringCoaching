import { Target, Zap, Award } from "lucide-react";

export function PhilosophySection() {
  const values = [
    {
      icon: Target,
      title: "Dépassement",
      description: "Repousser vos limites à chaque séance et découvrir votre véritable potentiel physique et mental."
    },
    {
      icon: Zap,
      title: "Puissance",
      description: "Développer une force intérieure qui transcende le ring et transforme votre quotidien."
    },
    {
      icon: Award,
      title: "Élévation",
      description: "S'investir pleinement dans votre transformation avec discipline, passion et persévérance."
    }
  ];

  return (
    <section id="philosophy" className="py-16 md:py-24 bg-[#1D1D1B]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="h-1 w-24 bg-primary mx-auto mb-6 rounded-full" />
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl text-white mb-6" data-testid="heading-philosophy">
            Notre Philosophie
          </h2>
          <p className="font-body text-lg text-white/80 max-w-2xl mx-auto" data-testid="text-philosophy-description">
            Chez MELRING, chaque séance est pensée pour renforcer le corps, affûter l'esprit et révéler la version la plus authentique et la plus forte de soi-même.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {values.map((value, index) => {
            const Icon = value.icon;
            return (
              <div
                key={index}
                className="group hover-elevate active-elevate-2 bg-white/5 border border-white/10 rounded-md p-8 text-center transition-all duration-300 hover:border-primary/50"
                data-testid={`card-value-${index}`}
              >
                <div className="mb-6 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition-colors">
                    <Icon className="w-8 h-8 text-primary" />
                  </div>
                </div>
                <h3 className="font-display font-bold text-2xl text-white mb-4" data-testid={`heading-value-${index}`}>
                  {value.title}
                </h3>
                <p className="font-body text-white/70 leading-relaxed" data-testid={`text-value-description-${index}`}>
                  {value.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
