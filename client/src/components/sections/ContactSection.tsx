import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, Instagram, MapPin } from "lucide-react";
import { SiTiktok } from "react-icons/si";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { insertContactSchema, type InsertContact } from "@shared/schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

export function ContactSection() {
  const { toast } = useToast();
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<InsertContact>({
    resolver: zodResolver(insertContactSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  });

  const contactMutation = useMutation({
    mutationFn: async (data: InsertContact) => {
      return apiRequest("POST", "/api/contact", data);
    },
    onSuccess: () => {
      setIsSubmitted(true);
      toast({
        title: "Message envoyé !",
        description: "Nous vous répondrons dans les plus brefs délais.",
      });
      form.reset();
      setTimeout(() => setIsSubmitted(false), 5000);
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue. Veuillez réessayer.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertContact) => {
    contactMutation.mutate(data);
  };

  return (
    <section id="contact" className="py-16 md:py-24 bg-[#1D1D1B]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="h-1 w-24 bg-primary mx-auto mb-6 rounded-full" />
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl text-white mb-6" data-testid="heading-contact">
            Contactez-nous
          </h2>
          <p className="font-body text-lg text-white/80 max-w-2xl mx-auto" data-testid="text-contact-description">
            Envie de rejoindre l'expérience MELRING ? N'hésitez pas à nous contacter.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          <div>
            {isSubmitted ? (
              <div className="bg-primary/20 border border-primary rounded-md p-8 text-center" data-testid="status-contact-success">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-8 h-8 text-primary-foreground" />
                </div>
                <h3 className="font-display font-bold text-2xl text-white mb-2" data-testid="heading-contact-success">
                  Message envoyé !
                </h3>
                <p className="font-body text-white/80" data-testid="text-contact-success">
                  Nous vous répondrons très bientôt.
                </p>
              </div>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-body font-medium text-white">
                          Nom
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Votre nom"
                            className="bg-white/10 border-white/20 text-white placeholder:text-white/50 font-body focus:border-primary"
                            data-testid="input-contact-name"
                          />
                        </FormControl>
                        <FormMessage className="text-red-400" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-body font-medium text-white">
                          Email
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="email"
                            placeholder="votre.email@exemple.com"
                            className="bg-white/10 border-white/20 text-white placeholder:text-white/50 font-body focus:border-primary"
                            data-testid="input-contact-email"
                          />
                        </FormControl>
                        <FormMessage className="text-red-400" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-body font-medium text-white">
                          Message
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="Votre message..."
                            rows={6}
                            className="bg-white/10 border-white/20 text-white placeholder:text-white/50 font-body focus:border-primary resize-none"
                            data-testid="input-contact-message"
                          />
                        </FormControl>
                        <FormMessage className="text-red-400" />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-display font-bold text-sm sm:text-base py-4 sm:py-6 rounded-sm shadow-lg transition-all duration-300 hover:scale-105"
                    disabled={contactMutation.isPending}
                    data-testid="button-submit-contact"
                  >
                    {contactMutation.isPending ? "Envoi en cours..." : "Envoyer le message"}
                  </Button>
                </form>
              </Form>
            )}
          </div>

          <div className="space-y-8">
            <div>
              <h3 className="font-display font-bold text-2xl text-white mb-6" data-testid="heading-contact-info">
                Informations de contact
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary/20 rounded-md flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-body text-white/60 text-sm">Téléphone</p>
                    <p className="font-body text-white" data-testid="text-phone">06 72 91 26 89</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary/20 rounded-md flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-body text-white/60 text-sm">Adresse</p>
                    <p className="font-body text-white" data-testid="text-address">8 Allée des Fileuses, 59260 Lille - Hellemmes</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary/20 rounded-md flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-body text-white/60 text-sm">Email</p>
                    <p className="font-body text-white" data-testid="text-email">melring.coaching@gmail.com</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-white/10">
              <h3 className="font-display font-bold text-2xl text-white mb-6" data-testid="heading-social">
                Suivez-nous
              </h3>
              <div className="flex gap-4">
                <a
                  href="https://www.instagram.com/melring.coaching/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-primary/20 hover:bg-primary/30 rounded-md flex items-center justify-center transition-colors hover-elevate active-elevate-2"
                  data-testid="link-contact-instagram"
                  aria-label="Instagram"
                >
                  <Instagram className="w-6 h-6 text-primary" />
                </a>
                <a
                  href="https://www.tiktok.com/@melring.coaching"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-primary/20 hover:bg-primary/30 rounded-md flex items-center justify-center transition-colors hover-elevate active-elevate-2"
                  data-testid="link-contact-tiktok"
                  aria-label="TikTok"
                >
                  <SiTiktok className="w-5 h-5 text-primary" />
                </a>
              </div>
            </div>

            <div className="pt-8 border-t border-white/10">
              <p className="font-body text-white/70 leading-relaxed">
                <span className="font-bold text-white">MELRING</span> - Un club de boxe ? Bien plus que ça. Une expérience de transformation.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
