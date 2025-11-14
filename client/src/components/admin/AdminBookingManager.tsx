import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, Plus, Edit2, Trash2, Users, CheckCircle, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import {
  insertAvailabilitySlotSchema,
  type InsertAvailabilitySlot,
  type AvailabilitySlot,
  type BookingSlot,
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
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export function AdminBookingManager() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedDate, setSelectedDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [editingSlot, setEditingSlot] = useState<AvailabilitySlot | null>(null);

  // Fetch all availability slots
  const { data: slots = [], isLoading: loadingSlots } = useQuery({
    queryKey: ["all-availability-slots"],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/availability-slots");
      return response.json();
    },
  });

  // Fetch all bookings
  const { data: bookings = [], isLoading: loadingBookings } = useQuery({
    queryKey: ["all-booking-slots"],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/booking-slots");
      return response.json();
    },
  });

  const form = useForm<InsertAvailabilitySlot>({
    resolver: zodResolver(insertAvailabilitySlotSchema),
    defaultValues: {
      date: format(new Date(), "yyyy-MM-dd"),
      startTime: "",
      endTime: "",
      maxBookings: 1,
    },
  });

  const createSlotMutation = useMutation({
    mutationFn: async (data: InsertAvailabilitySlot) => {
      return apiRequest("POST", "/api/availability-slots", data);
    },
    onSuccess: () => {
      toast({
        title: "Créneau ajouté",
        description: "Le créneau de disponibilité a été ajouté avec succès.",
      });
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["all-availability-slots"] });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue",
        variant: "destructive",
      });
    },
  });

  const updateSlotMutation = useMutation({
    mutationFn: async ({ id, ...data }: Partial<AvailabilitySlot> & { id: string }) => {
      return apiRequest("PUT", `/api/availability-slots/${id}`, data);
    },
    onSuccess: () => {
      toast({
        title: "Créneau mis à jour",
        description: "Le créneau a été modifié avec succès.",
      });
      setEditingSlot(null);
      queryClient.invalidateQueries({ queryKey: ["all-availability-slots"] });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue",
        variant: "destructive",
      });
    },
  });

  const deleteSlotMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest("DELETE", `/api/availability-slots/${id}`);
    },
    onSuccess: () => {
      toast({
        title: "Créneau supprimé",
        description: "Le créneau a été supprimé avec succès.",
      });
      queryClient.invalidateQueries({ queryKey: ["all-availability-slots"] });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue",
        variant: "destructive",
      });
    },
  });

  const updateBookingMutation = useMutation({
    mutationFn: async ({ id, ...data }: Partial<BookingSlot> & { id: string }) => {
      return apiRequest("PUT", `/api/booking-slots/${id}`, data);
    },
    onSuccess: () => {
      toast({
        title: "Réservation mise à jour",
        description: "Le statut de la réservation a été modifié.",
      });
      queryClient.invalidateQueries({ queryKey: ["all-booking-slots"] });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertAvailabilitySlot) => {
    createSlotMutation.mutate(data);
  };

  const handleEditSlot = (slot: AvailabilitySlot) => {
    setEditingSlot(slot);
    form.reset({
      date: slot.date,
      startTime: slot.startTime,
      endTime: slot.endTime,
      maxBookings: parseInt(slot.maxBookings),
    });
  };

  const handleUpdateSlot = (data: InsertAvailabilitySlot) => {
    if (editingSlot) {
      updateSlotMutation.mutate({ id: editingSlot.id, ...data, maxBookings: data.maxBookings.toString() });
    }
  };

  const handleDeleteSlot = (id: string) => {
    deleteSlotMutation.mutate(id);
  };

  const handleUpdateBookingStatus = (bookingId: string, status: string) => {
    updateBookingMutation.mutate({ id: bookingId, status });
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":");
    return `${hours}:${minutes}`;
  };

  const getBookingCountForSlot = (slotId: string) => {
    return bookings.filter((b: BookingSlot) => b.slotId === slotId && b.status !== "cancelled").length;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed": return "default";
      case "pending": return "secondary";
      case "cancelled": return "destructive";
      default: return "secondary";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "confirmed": return "Confirmé";
      case "pending": return "En attente";
      case "cancelled": return "Annulé";
      default: return status;
    }
  };

  const sortedSlots = slots.sort((a: AvailabilitySlot, b: AvailabilitySlot) => {
    const dateCompare = new Date(a.date).getTime() - new Date(b.date).getTime();
    if (dateCompare !== 0) return dateCompare;
    return a.startTime.localeCompare(b.startTime);
  });

  const sortedBookings = bookings.sort((a: BookingSlot, b: BookingSlot) =>
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="font-display font-extrabold text-3xl text-[#1D1D1B] mb-2">
            Gestion des Réservations
          </h1>
          <p className="font-body text-[#1D1D1B]/70">
            Gérez vos disponibilités et suivez les réservations
          </p>
        </div>

        <Tabs defaultValue="availability" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="availability">Disponibilités</TabsTrigger>
            <TabsTrigger value="bookings">Réservations</TabsTrigger>
          </TabsList>

          <TabsContent value="availability" className="space-y-6">
            {/* Add/Edit Slot Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  {editingSlot ? "Modifier un créneau" : "Ajouter un créneau"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={editingSlot ? form.handleSubmit(handleUpdateSlot) : form.handleSubmit(onSubmit)}
                        className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <FormField
                      control={form.control}
                      name="date"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Date</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="startTime"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Heure de début</FormLabel>
                          <FormControl>
                            <Input type="time" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="endTime"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Heure de fin</FormLabel>
                          <FormControl>
                            <Input type="time" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="maxBookings"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Places max</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="1"
                              {...field}
                              onChange={(e) => field.onChange(e.target.value)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="flex gap-2 md:col-span-4">
                      <Button
                        type="submit"
                        disabled={createSlotMutation.isPending || updateSlotMutation.isPending}
                        className="flex-1"
                      >
                        {editingSlot
                          ? (updateSlotMutation.isPending ? "Mise à jour..." : "Mettre à jour")
                          : (createSlotMutation.isPending ? "Ajout..." : "Ajouter")
                        }
                      </Button>
                      {editingSlot && (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setEditingSlot(null);
                            form.reset();
                          }}
                        >
                          Annuler
                        </Button>
                      )}
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>

            {/* Slots List */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Créneaux de disponibilité
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loadingSlots ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="animate-pulse">
                        <div className="h-16 bg-gray-200 rounded-lg"></div>
                      </div>
                    ))}
                  </div>
                ) : sortedSlots.length === 0 ? (
                  <div className="text-center py-8 text-[#1D1D1B]/60">
                    Aucun créneau de disponibilité défini
                  </div>
                ) : (
                  <div className="space-y-3">
                    <AnimatePresence>
                      {sortedSlots.map((slot: any, index: number) => (
                        <motion.div
                          key={slot.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                        >
                          <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                            <div className="flex items-center gap-4">
                              <div>
                                <div className="font-semibold">
                                  {format(new Date(slot.date), "EEEE d MMMM yyyy", { locale: fr })}
                                </div>
                                <div className="text-sm text-[#1D1D1B]/70">
                                  {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Users className="w-4 h-4 text-[#1D1D1B]/60" />
                                <span className="text-sm">
                                  {getBookingCountForSlot(slot.id)}/{parseInt(slot.maxBookings)}
                                </span>
                              </div>
                              <Badge variant={slot.isActive === "true" ? "default" : "secondary"}>
                                {slot.isActive === "true" ? "Actif" : "Inactif"}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEditSlot(slot)}
                              >
                                <Edit2 className="w-4 h-4" />
                              </Button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="outline" size="sm">
                                    <Trash2 className="w-4 h-4 text-red-500" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Supprimer ce créneau ?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Cette action est irréversible. Le créneau sera définitivement supprimé.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Annuler</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleDeleteSlot(slot.id)}>
                                      Supprimer
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bookings" className="space-y-6">
            {/* Bookings List */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Réservations des clients
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loadingBookings ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="animate-pulse">
                        <div className="h-20 bg-gray-200 rounded-lg"></div>
                      </div>
                    ))}
                  </div>
                ) : sortedBookings.length === 0 ? (
                  <div className="text-center py-8 text-[#1D1D1B]/60">
                    Aucune réservation pour le moment
                  </div>
                ) : (
                  <div className="space-y-4">
                    <AnimatePresence>
                      {sortedBookings.map((booking: any, index: number) => (
                        <motion.div
                          key={booking.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                        >
                          <div className="border rounded-lg p-6">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                  <div>
                                    <div className="font-semibold text-lg">{booking.customerName}</div>
                                    <div className="text-sm text-[#1D1D1B]/70">{booking.customerEmail}</div>
                                    {booking.customerPhone && (
                                      <div className="text-sm text-[#1D1D1B]/70">{booking.customerPhone}</div>
                                    )}
                                  </div>
                                  <div className="text-right">
                                    <Badge variant={getStatusColor(booking.status)} className="mb-2">
                                      {getStatusText(booking.status)}
                                    </Badge>
                                    <div className="text-sm text-[#1D1D1B]/60">
                                      Réservé le {format(new Date(booking.createdAt), "d MMMM yyyy à HH:mm", { locale: fr })}
                                    </div>
                                  </div>
                                </div>
                                {booking.notes && (
                                  <div className="mt-3 p-3 bg-gray-50 rounded text-sm">
                                    <strong>Notes :</strong> {booking.notes}
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="flex gap-2 mt-4">
                              {booking.status === "pending" && (
                                <>
                                  <Button
                                    size="sm"
                                    onClick={() => handleUpdateBookingStatus(booking.id, "confirmed")}
                                    className="flex items-center gap-1"
                                  >
                                    <CheckCircle className="w-4 h-4" />
                                    Confirmer
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleUpdateBookingStatus(booking.id, "cancelled")}
                                    className="flex items-center gap-1 text-red-600 border-red-200 hover:bg-red-50"
                                  >
                                    <XCircle className="w-4 h-4" />
                                    Annuler
                                  </Button>
                                </>
                              )}
                              {booking.status === "confirmed" && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleUpdateBookingStatus(booking.id, "cancelled")}
                                  className="flex items-center gap-1 text-red-600 border-red-200 hover:bg-red-50"
                                >
                                  <XCircle className="w-4 h-4" />
                                  Annuler
                                </Button>
                              )}
                              {booking.status === "cancelled" && (
                                <Button
                                  size="sm"
                                  onClick={() => handleUpdateBookingStatus(booking.id, "confirmed")}
                                  className="flex items-center gap-1"
                                >
                                  <CheckCircle className="w-4 h-4" />
                                  Reactiver
                                </Button>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}