import { Flame, Heart, Users, Calendar, Briefcase, User } from "lucide-react";

export function ServicesSection() {
  const services = [
    {
      icon: Flame,
      title: "HIIT & Cardio-Training",
      description: "Des séances intenses pour brûler des calories, améliorer votre endurance et sculpter votre silhouette."
    },
    {
      icon: Heart,
      title: "Boxe (tous niveaux)",
      description: "Technique, puissance et coordination. Progressez à votre rythme avec un encadrement personnalisé."
    },
    {
      icon: Calendar,
      title: "Séances à la carte",
      description: "Flexibilité totale pour adapter votre entraînement à votre emploi du temps et vos objectifs."
    },
    {
      icon: Users,
      title: "Cours collectifs",
      description: "Entraînez-vous en petits groupes (6-12 personnes) dans une ambiance motivante et conviviale."
    },
    {
      icon: Briefcase,
      title: "Évènements & Team-Building",
      description: "Des expériences sur mesure pour renforcer la cohésion d'équipe et booster la motivation collective."
    },
    {
      icon: User,
      title: "Coaching individuel",
      description: "Un accompagnement 100% personnalisé pour atteindre vos objectifs spécifiques rapidement."
    }
  ];

  return (
    <section id="services" className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="h-1 w-24 bg-primary mx-auto mb-6 rounded-full" />
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl text-[#1D1D1B] mb-6" data-testid="heading-services">
            Nos Services
          </h2>
          <p className="font-body text-lg text-[#1D1D1B]/70 max-w-2xl mx-auto" data-testid="text-services-description">
            Des formats en petits groupes spécialement conçus pour bouger, se dépasser et se révéler.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <div
                key={index}
                className="group hover-elevate active-elevate-2 bg-white border border-[#1D1D1B]/10 rounded-md p-8 transition-all duration-300 hover:border-primary shadow-sm hover:shadow-lg"
                data-testid={`card-service-${index}`}
              >
                <div className="mb-4 flex items-start">
                  <div className="w-12 h-12 rounded-md bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors flex-shrink-0">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                </div>
                <h3 className="font-display font-bold text-xl text-[#1D1D1B] mb-3" data-testid={`heading-service-${index}`}>
                  {service.title}
                </h3>
                <p className="font-body text-[#1D1D1B]/70 leading-relaxed text-sm" data-testid={`text-service-description-${index}`}>
                  {service.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
