import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { insertBookingSchema, type InsertBooking } from "@shared/schema";
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

export function BookingSection() {
  const { toast } = useToast();
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<InsertBooking>({
    resolver: zodResolver(insertBookingSchema),
    defaultValues: {
      email: "",
    },
  });

  const bookingMutation = useMutation({
    mutationFn: async (data: InsertBooking) => {
      return apiRequest("POST", "/api/booking", data);
    },
    onSuccess: () => {
      setIsSubmitted(true);
      toast({
        title: "Demande envoyée !",
        description: "Vous recevrez bientôt votre lien d'accès Bookyway par email.",
      });
      form.reset();
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue. Veuillez réessayer.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertBooking) => {
    bookingMutation.mutate(data);
  };

  return (
    <section id="booking" className="py-16 md:py-24 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="h-1 w-24 bg-primary mx-auto mb-6 rounded-full" />
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl text-[#1D1D1B] mb-6" data-testid="heading-booking">
            Accès au Planning
          </h2>
          <p className="font-body text-lg text-[#1D1D1B]/70 max-w-2xl mx-auto mb-8" data-testid="text-booking-description">
            Partagez-nous votre adresse email pour recevoir votre lien de connexion personnalisé.
          </p>
        </div>

        <div className="bg-[#1D1D1B]/5 border border-[#1D1D1B]/10 rounded-md p-8 md:p-12">
          {isSubmitted ? (
            <div className="text-center py-8" data-testid="status-booking-success">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Mail className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-display font-bold text-2xl text-[#1D1D1B] mb-3" data-testid="heading-booking-success">
                Demande reçue !
              </h3>
              <p className="font-body text-[#1D1D1B]/70" data-testid="text-booking-success">
                Nous vous enverrons votre lien d'accès Bookyway très prochainement.
              </p>
              <Button
                variant="outline"
                onClick={() => setIsSubmitted(false)}
                className="mt-6"
                data-testid="button-submit-another-booking"
              >
                Envoyer une autre demande
              </Button>
            </div>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="flex items-center gap-3 mb-6 pb-6 border-b border-[#1D1D1B]/10">
                  <div className="w-12 h-12 bg-primary/10 rounded-md flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-xl text-[#1D1D1B]">
                      Demande d'accès au planning
                    </h3>
                    <p className="font-body text-sm text-[#1D1D1B]/60">
                      
                    </p>
                  </div>
                </div>

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-body font-medium text-[#1D1D1B]">
                        Adresse email
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="email"
                          placeholder="votre.email@exemple.com"
                          className="font-body"
                          data-testid="input-booking-email"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  size="lg"
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-display font-bold text-base py-6 rounded-sm shadow-lg transition-all duration-300 hover:scale-105"
                  disabled={bookingMutation.isPending}
                  data-testid="button-submit-booking"
                >
                  {bookingMutation.isPending ? "Envoi en cours..." : "Recevoir mon lien d'accès"}
                </Button>
              </form>
            </Form>
          )}
        </div>
      </div>
    </section>
  );
}
