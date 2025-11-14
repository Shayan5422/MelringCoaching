import type { Express } from "express";
import { createServer, type Server } from "http";
import { DatabaseStorage } from "./db-storage";

const storage = new DatabaseStorage();
import {
  insertContactSchema,
  insertBookingSchema,
  insertAvailabilitySlotSchema,
  insertBookingSlotSchema,
  insertRecurringSlotSchema
} from "../shared/schema.js";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // Health check endpoint
  app.get("/api/health", async (req, res) => {
    try {
      // Test database connection
      await storage.getAllContacts();
      res.json({
        status: "ok",
        message: "Database connection successful",
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV
      });
    } catch (error) {
      console.error("Health check failed:", error);
      res.status(500).json({
        status: "error",
        message: "Database connection failed",
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString()
      });
    }
  });

  app.post("/api/contact", async (req, res) => {
    try {
      const validatedData = insertContactSchema.parse(req.body);
      const contact = await storage.createContact(validatedData);
      res.json(contact);
    } catch (error: any) {
      if (error.name === "ZodError") {
        const validationError = fromZodError(error);
        res.status(400).json({ error: validationError.message });
      } else {
        console.error("Error creating contact:", error);
        res.status(500).json({ error: "Internal server error" });
      }
    }
  });

  app.get("/api/contacts", async (req, res) => {
    try {
      const contacts = await storage.getAllContacts();
      res.json(contacts);
    } catch (error) {
      console.error("Error fetching contacts:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/booking", async (req, res) => {
    try {
      const validatedData = insertBookingSchema.parse(req.body);
      const booking = await storage.createBooking(validatedData);
      res.json(booking);
    } catch (error: any) {
      if (error.name === "ZodError") {
        const validationError = fromZodError(error);
        res.status(400).json({ error: validationError.message });
      } else {
        console.error("Error creating booking:", error);
        res.status(500).json({ error: "Internal server error" });
      }
    }
  });

  app.get("/api/bookings", async (req, res) => {
    try {
      const bookings = await storage.getAllBookings();
      res.json(bookings);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Availability slots routes
  app.get("/api/availability-slots", async (req, res) => {
    try {
      const slots = await storage.getAllAvailabilitySlots();
      res.json(slots);
    } catch (error) {
      console.error("Error fetching availability slots:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/availability-slots/:date", async (req, res) => {
    try {
      const { date } = req.params;
      const slots = await storage.getAvailabilitySlotsByDate(date);

      // Get booking counts for each slot
      const slotsWithAvailability = await Promise.all(
        slots.map(async (slot) => {
          const bookings = await storage.getBookingSlotsBySlotId(slot.id);
          const availableSpots = parseInt(slot.maxBookings) - bookings.filter(b => b.status !== "cancelled").length;
          return {
            ...slot,
            availableSpots,
            totalSpots: parseInt(slot.maxBookings),
            isAvailable: availableSpots > 0
          };
        })
      );

      res.json(slotsWithAvailability);
    } catch (error) {
      console.error("Error fetching availability slots by date:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/availability-slots", async (req, res) => {
    try {
      const validatedData = insertAvailabilitySlotSchema.parse(req.body);
      const slot = await storage.createAvailabilitySlot(validatedData);
      res.json(slot);
    } catch (error: any) {
      if (error.name === "ZodError") {
        const validationError = fromZodError(error);
        res.status(400).json({ error: validationError.message });
      } else {
        console.error("Error creating availability slot:", error);
        res.status(500).json({ error: "Internal server error" });
      }
    }
  });

  app.put("/api/availability-slots/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const slot = await storage.updateAvailabilitySlot(id, req.body);
      res.json(slot);
    } catch (error: any) {
      if (error.message === "Availability slot not found") {
        res.status(404).json({ error: "Slot de disponibilité non trouvé" });
      } else {
        console.error("Error updating availability slot:", error);
        res.status(500).json({ error: "Internal server error" });
      }
    }
  });

  app.delete("/api/availability-slots/:id", async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteAvailabilitySlot(id);
      res.json({ message: "Slot de disponibilité supprimé avec succès" });
    } catch (error) {
      console.error("Error deleting availability slot:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Booking slots routes
  app.get("/api/booking-slots", async (req, res) => {
    try {
      const bookings = await storage.getAllBookingSlots();
      res.json(bookings);
    } catch (error) {
      console.error("Error fetching booking slots:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/booking-slots", async (req, res) => {
    try {
      const validatedData = insertBookingSlotSchema.parse(req.body);

      // Check if slot is still available
      const existingBookings = await storage.getBookingSlotsBySlotId(validatedData.slotId);
      const activeBookings = existingBookings.filter(b => b.status !== "cancelled");

      if (activeBookings.length >= 1) { // For now, allow 1 booking per slot
        return res.status(400).json({ error: "Ce créneau n'est plus disponible" });
      }

      const booking = await storage.createBookingSlot(validatedData);
      res.json(booking);
    } catch (error: any) {
      if (error.name === "ZodError") {
        const validationError = fromZodError(error);
        res.status(400).json({ error: validationError.message });
      } else {
        console.error("Error creating booking slot:", error);
        res.status(500).json({ error: "Internal server error" });
      }
    }
  });

  app.put("/api/booking-slots/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const booking = await storage.updateBookingSlot(id, req.body);
      res.json(booking);
    } catch (error: any) {
      if (error.message === "Booking slot not found") {
        res.status(404).json({ error: "Réservation non trouvée" });
      } else {
        console.error("Error updating booking slot:", error);
        res.status(500).json({ error: "Internal server error" });
      }
    }
  });

  // Recurring slots routes
  app.get("/api/recurring-slots", async (req, res) => {
    try {
      const recurringSlots = await storage.getAllRecurringSlots();
      res.json(recurringSlots);
    } catch (error) {
      console.error("Error fetching recurring slots:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/recurring-slots", async (req, res) => {
    try {
      const validatedData = insertRecurringSlotSchema.parse(req.body);
      const recurringSlot = await storage.createRecurringSlot(validatedData);

      // Generate availability slots from this recurring slot
      await storage.generateAvailabilitySlotsFromRecurring();

      res.json(recurringSlot);
    } catch (error: any) {
      if (error.name === "ZodError") {
        const validationError = fromZodError(error);
        res.status(400).json({ error: validationError.message });
      } else {
        console.error("Error creating recurring slot:", error);
        res.status(500).json({ error: "Internal server error" });
      }
    }
  });

  app.put("/api/recurring-slots/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const recurringSlot = await storage.updateRecurringSlot(id, req.body);

      // Regenerate availability slots when a recurring slot is updated
      await storage.generateAvailabilitySlotsFromRecurring();

      res.json(recurringSlot);
    } catch (error: any) {
      if (error.message === "Recurring slot not found") {
        res.status(404).json({ error: "Créneau récurrent non trouvé" });
      } else {
        console.error("Error updating recurring slot:", error);
        res.status(500).json({ error: "Internal server error" });
      }
    }
  });

  app.delete("/api/recurring-slots/:id", async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteRecurringSlot(id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting recurring slot:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/recurring-slots/generate", async (req, res) => {
    try {
      await storage.generateAvailabilitySlotsFromRecurring();
      res.json({ message: "Availability slots generated successfully" });
    } catch (error) {
      console.error("Error generating availability slots:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
