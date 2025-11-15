import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, Clock, User, Mail, Phone, Check, X, ChevronLeft, ChevronRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import {
  insertBookingSlotSchema,
  type InsertBookingSlot,
  type AvailabilitySlot,
} from "@shared/schema";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format, addDays, subDays } from "date-fns";
import { fr } from "date-fns/locale";
import { motion, AnimatePresence } from "framer-motion";

interface EnhancedBookingSectionProps {
  date?: string;
}

export function EnhancedBookingSection({ date = format(new Date(), "yyyy-MM-dd") }: EnhancedBookingSectionProps) {
  const { toast } = useToast();
  const [selectedSlot, setSelectedSlot] = useState<AvailabilitySlot | null>(null);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date(date));
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [selectedCourseType, setSelectedCourseType] = useState<string>("");

  const form = useForm<InsertBookingSlot>({
    resolver: zodResolver(insertBookingSlotSchema),
    defaultValues: {
      slotId: "",
      customerName: "",
      customerEmail: "",
      customerPhone: "",
      notes: "",
    },
  });

  // Format selected date as string for API
  const selectedDateStr = format(selectedDate, "yyyy-MM-dd");

  
  // Fetch all slots (availability + recurring) for the selected date
  const { data: slots = [], isLoading, refetch } = useQuery({
    queryKey: ["all-slots", selectedDateStr, selectedCourseType],
    queryFn: async () => {
      // Get availability slots for the selected date
      const availabilityResponse = await apiRequest("GET", `/api/availability-slots/${selectedDateStr}`);
      const availabilitySlots = await availabilityResponse.json();

      // Get recurring slots (active ones)
      const recurringResponse = await apiRequest("GET", "/api/recurring-slots");
      const recurringSlots = await recurringResponse.json();

      // Get current day of week (0 = Sunday, 1 = Monday, etc.)
      const currentDayOfWeek = new Date(selectedDateStr).getDay();

      // Format recurring slots to look like availability slots
      const formattedRecurringSlots = recurringSlots
        .filter((slot: any) => {
          // Only show recurring slots that match the current day of week
          const slotDayOfWeek = parseInt(slot.dayOfWeek);
          const matchesDay = slotDayOfWeek === currentDayOfWeek;
          return slot.isActive === "true" && matchesDay;
        })
        .map((slot: any) => ({
          id: slot.id,
          date: selectedDateStr, // Use current selected date
          startTime: slot.startTime,
          endTime: slot.endTime,
          description: slot.description,
          isActive: slot.isActive,
          maxBookings: slot.maxBookings,
          availableSpots: parseInt(slot.maxBookings), // Assume all spots available for recurring
          totalSpots: parseInt(slot.maxBookings),
          isAvailable: true,
          isRecurring: true, // Flag to identify recurring slots
          dayOfWeek: slot.dayOfWeek
        }));

      // Combine both types of slots
      const allSlots = [...availabilitySlots, ...formattedRecurringSlots];

      // Filter slots by selected course type
      if (selectedCourseType) {
        return allSlots.filter((slot: any) =>
          slot.description && slot.description.toLowerCase().includes(selectedCourseType.toLowerCase())
        );
      }

      return allSlots;
    },
  });

  // Date navigation functions
  const handlePreviousDay = () => {
    setSelectedDate(prev => subDays(prev, 1));
  };

  const handleNextDay = () => {
    setSelectedDate(prev => addDays(prev, 1));
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      setIsCalendarOpen(false);
    }
  };

  const bookingMutation = useMutation({
    mutationFn: async (data: InsertBookingSlot) => {
      return apiRequest("POST", "/api/booking-slots", data);
    },
    onSuccess: () => {
      toast({
        title: "Réservation confirmée !",
        description: "Votre séance a été réservée avec succès. Nous vous enverrons un email de confirmation.",
      });
      form.reset();
      setSelectedSlot(null);
      setShowBookingForm(false);
      refetch();
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue. Veuillez réessayer.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertBookingSlot) => {
    if (!selectedSlot) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un créneau horaire",
        variant: "destructive",
      });
      return;
    }
    bookingMutation.mutate({ ...data, slotId: selectedSlot.id });
  };

  const handleSlotSelect = (slot: AvailabilitySlot) => {
    setSelectedSlot(slot);
    setShowBookingForm(true);
    form.setValue("slotId", slot.id);
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":");
    return `${hours}:${minutes}`;
  };

  const getStatusColor = (availableSpots: number, totalSpots: number) => {
    if (availableSpots === 0) return "destructive";
    if (availableSpots === totalSpots) return "default";
    return "secondary";
  };

  const getStatusText = (availableSpots: number, totalSpots: number) => {
    if (availableSpots === 0) return "Complet";
    if (availableSpots === totalSpots) return "Disponible";
    return `${availableSpots} place(s) restante(s)`;
  };

  const getCourseColor = (description: string) => {
    if (!description) return "default";

    const lowerDesc = description.toLowerCase();
    if (lowerDesc.includes("open ring")) return "bg-blue-500";
    if (lowerDesc.includes("boxe femme")) return "bg-pink-500";
    if (lowerDesc.includes("boxe mixte")) return "bg-purple-500";
    if (lowerDesc.includes("hiit mixte")) return "bg-orange-500";
    if (lowerDesc.includes("hiit femme")) return "bg-red-500";

    return "bg-primary";
  };

  const getCourseVariant = (description: string) => {
    if (!description) return "default";

    const lowerDesc = description.toLowerCase();
    if (lowerDesc.includes("open ring")) return "secondary";
    if (lowerDesc.includes("boxe femme")) return "destructive";
    if (lowerDesc.includes("boxe mixte")) return "outline";
    if (lowerDesc.includes("hiit mixte")) return "secondary";
    if (lowerDesc.includes("hiit femme")) return "destructive";

    return "default";
  };

  // Helper function to get French day name
  const getDayName = (dayIndex: number) => {
    const days = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
    return days[dayIndex];
  };

  
  return (
    <section id="enhanced-booking" className="py-16 md:py-24 bg-gradient-to-br from-primary/5 to-secondary/5">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="h-1 w-24 bg-primary mx-auto mb-6 rounded-full animate-pulse" />
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl text-[#1D1D1B] mb-6">
            Réservez votre séance
          </h2>
          <p className="font-body text-lg text-[#1D1D1B]/70 max-w-2xl mx-auto mb-8">
            Choisissez le créneau qui vous convient le mieux parmi nos disponibilités
          </p>
        </div>

        
        <AnimatePresence mode="wait">
          {!showBookingForm ? (
            <motion.div
              key="slots"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Date Navigation */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-4 bg-white rounded-full shadow-md border border-[#1D1D1B]/10 px-6 py-3">
                  {/* Previous Day Button */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handlePreviousDay}
                    className="p-1 hover:bg-primary/10 rounded-full"
                    aria-label="Jour précédent"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>

                  {/* Date Picker */}
                  <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="ghost"
                        className="flex items-center gap-2 px-4 py-2 hover:bg-primary/10 rounded-full transition-colors"
                      >
                        <Calendar className="w-5 h-5 text-primary" />
                        <span className="font-display font-semibold text-lg">
                          {format(selectedDate, "EEEE d MMMM yyyy", { locale: fr })}
                        </span>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={selectedDate}
                        onSelect={handleDateSelect}
                        initialFocus
                        locale={fr}
                        className="rounded-md border"
                      />
                    </PopoverContent>
                  </Popover>

                  {/* Next Day Button */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleNextDay}
                    className="p-1 hover:bg-primary/10 rounded-full"
                    aria-label="Jour suivant"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>

                {/* Quick Date Selection */}
                <div className="flex flex-col items-center gap-3 mt-4">
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-sm text-[#1D1D1B]/60">Accès rapide:</span>
                    <div className="flex gap-2">
                      {["Aujourd'hui", "Demain", "Après-demain"].map((label, index) => {
                        const targetDate = addDays(new Date(), index);
                        return (
                          <Button
                            key={label}
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedDate(targetDate)}
                            className={`text-xs px-3 py-1 ${
                              format(selectedDate, "yyyy-MM-dd") === format(targetDate, "yyyy-MM-dd")
                                ? "bg-primary text-primary-foreground border-primary"
                                : "border-[#1D1D1B]/20 hover:border-primary"
                            }`}
                          >
                            {label}
                          </Button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Course Type Filters */}
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-sm text-[#1D1D1B]/60">Type de séance:</span>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedCourseType("")}
                        className={`text-xs px-3 py-1 ${
                          selectedCourseType === ""
                            ? "bg-primary text-primary-foreground border-primary"
                            : "border-[#1D1D1B]/20 hover:border-primary"
                        }`}
                      >
                        Tous
                      </Button>
                      {["Open Ring", "Boxe Femme", "Boxe Mixte", "HIIT Mixte", "HIIT Femme"].map((courseType) => (
                        <Button
                          key={courseType}
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedCourseType(courseType)}
                          className={`text-xs px-3 py-1 flex items-center gap-1 ${
                            selectedCourseType === courseType
                              ? "bg-primary text-primary-foreground border-primary"
                              : "border-[#1D1D1B]/20 hover:border-primary"
                          }`}
                        >
                          <div className={`w-2 h-2 rounded-full ${getCourseColor(courseType)}`}></div>
                          {courseType}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Filter Status */}
              {selectedCourseType && (
                <div className="text-center mb-4">
                  <Badge variant="secondary" className="text-sm">
                    {selectedCourseType} - {slots.length} créneau(x) trouvé(s)
                  </Badge>
                </div>
              )}

              {/* Available Slots Grid */}
              {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <Card key={i} className="animate-pulse">
                      <CardContent className="p-6">
                        <div className="h-4 bg-gray-200 rounded mb-2 w-24"></div>
                        <div className="h-6 bg-gray-200 rounded mb-4 w-32"></div>
                        <div className="h-8 bg-gray-200 rounded"></div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : slots.length === 0 ? (
                <Card className="text-center py-12">
                  <CardContent>
                    <X className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="font-display font-semibold text-xl text-[#1D1D1B] mb-2">
                      {selectedCourseType ? "Aucune disponibilité pour ce type de séance" : "Aucune disponibilité"}
                    </h3>
                    <p className="font-body text-[#1D1D1B]/60 mb-6">
                      {selectedCourseType
                        ? `Il n'y a pas de créneaux disponibles pour la séance "${selectedCourseType}" à cette date.`
                        : "Il n'y a pas de créneaux disponibles pour cette date."
                      }
                    </p>
                    <p className="font-body text-[#1D1D1B]/50 text-sm mb-4">
                      {selectedCourseType
                        ? "Essayez un autre type de séance ou une autre date."
                        : "Veuillez réessayer avec une autre date ou nous contacter directement."
                      }
                    </p>
                    {selectedCourseType && (
                      <Button
                        variant="outline"
                        onClick={() => setSelectedCourseType("")}
                        className="text-sm"
                      >
                        Afficher tous les créneaux
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ) : (
                <>
                  {/* Course Legend */}
                  <div className="mb-6 flex flex-wrap items-center justify-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-blue-500"></div>
                      <span className="text-[#1D1D1B]/70">Open Ring</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-pink-500"></div>
                      <span className="text-[#1D1D1B]/70">Boxe Femme</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-purple-500"></div>
                      <span className="text-[#1D1D1B]/70">Boxe Mixte</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-orange-500"></div>
                      <span className="text-[#1D1D1B]/70">HIIT Mixte</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-red-500"></div>
                      <span className="text-[#1D1D1B]/70">HIIT Femme</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {slots.map((slot: any, index: number) => (
                    <motion.div
                      key={slot.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Card className={`border-2 transition-all duration-300 cursor-pointer hover:shadow-lg ${
                        slot.isAvailable
                          ? "border-primary/20 hover:border-primary/40 bg-white"
                          : "border-gray-200 bg-gray-50 cursor-not-allowed opacity-60"
                      }`}>
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                {slot.description && (
                                  <Badge
                                    variant={getCourseVariant(slot.description)}
                                    className="text-xs font-medium"
                                  >
                                    {slot.description}
                                  </Badge>
                                )}
                              </div>
                              <div className="flex items-center gap-2">
                                <Clock className="w-5 h-5 text-primary" />
                                <CardTitle className="font-display text-lg">
                                  {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                                </CardTitle>
                              </div>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                              <Badge variant={getStatusColor(slot.availableSpots, slot.totalSpots)}>
                                {getStatusText(slot.availableSpots, slot.totalSpots)}
                              </Badge>
                              {slot.description && (
                                <div className={`w-3 h-3 rounded-full ${getCourseColor(slot.description)}`}></div>
                              )}
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            <div className="flex items-center gap-2 text-sm text-[#1D1D1B]/70">
                              <User className="w-4 h-4" />
                              <span>{slot.availableSpots} place(s) sur {slot.totalSpots}</span>
                            </div>
                            <Button
                              className="w-full"
                              disabled={!slot.isAvailable}
                              onClick={() => handleSlotSelect(slot)}
                              variant={slot.isAvailable ? "default" : "secondary"}
                            >
                              {slot.isAvailable ? "Réserver ce créneau" : "Indisponible"}
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
                  </>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="booking-form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="max-w-2xl mx-auto">
                <CardHeader className="text-center">
                  <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <Check className="w-8 h-8 text-primary" />
                  </div>
                  <CardTitle className="font-display text-2xl">
                    Confirmez votre réservation
                  </CardTitle>
                  <p className="font-body text-[#1D1D1B]/70">
                    Créneau sélectionné :{" "}
                    <span className="font-semibold">
                      {selectedSlot && formatTime(selectedSlot.startTime)} - {selectedSlot && formatTime(selectedSlot.endTime)}
                    </span>
                  </p>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                        <FormField
                          control={form.control}
                          name="customerName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex items-center gap-2">
                                <User className="w-4 h-4" />
                                Nom complet
                              </FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  placeholder="Jean Dupont"
                                  className="font-body"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="customerEmail"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex items-center gap-2">
                                <Mail className="w-4 h-4" />
                                Email
                              </FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  type="email"
                                  placeholder="jean.dupont@exemple.com"
                                  className="font-body"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="customerPhone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              <Phone className="w-4 h-4" />
                              Téléphone (optionnel)
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                type="tel"
                                placeholder="+33 6 12 34 56 78"
                                className="font-body"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="notes"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Notes ou demandes particulières</FormLabel>
                            <FormControl>
                              <Textarea
                                {...field}
                                placeholder="N'hésitez pas à nous faire part de vos attentes ou questions..."
                                className="font-body resize-none"
                                rows={3}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="flex gap-4 pt-4">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setShowBookingForm(false);
                            setSelectedSlot(null);
                          }}
                          className="flex-1"
                        >
                          Retour aux créneaux
                        </Button>
                        <Button
                          type="submit"
                          size="lg"
                          className="flex-1 bg-primary hover:bg-primary/90"
                          disabled={bookingMutation.isPending}
                        >
                          {bookingMutation.isPending ? "Réservation en cours..." : "Confirmer la réservation"}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}