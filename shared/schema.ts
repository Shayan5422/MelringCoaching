import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const contactSubmissions = pgTable("contact_submissions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const bookingRequests = pgTable("booking_requests", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertContactSchema = createInsertSchema(contactSubmissions).pick({
  name: true,
  email: true,
  message: true,
}).extend({
  email: z.string().email("Email invalide"),
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  message: z.string().min(10, "Le message doit contenir au moins 10 caractères"),
});

export const availabilitySlots = pgTable("availability_slots", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  date: text("date").notNull(), // YYYY-MM-DD format
  startTime: text("start_time").notNull(), // HH:mm format
  endTime: text("end_time").notNull(), // HH:mm format
  description: text("description"), // Course description (Open Ring, Boxe Femme, etc.)
  isActive: text("is_active").notNull().default("true"), // "true" or "false"
  maxBookings: text("max_bookings").notNull().default("1"), // Maximum bookings per slot
  recurringId: text("recurring_id"), // Link to recurring slot pattern
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const recurringSlots = pgTable("recurring_slots", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  dayOfWeek: text("day_of_week").notNull(), // 0-6 (Sunday=0, Monday=1, etc.)
  startTime: text("start_time").notNull(), // HH:mm format
  endTime: text("end_time").notNull(), // HH:mm format
  description: text("description"), // Course description (Open Ring, Boxe Femme, etc.)
  isActive: text("is_active").notNull().default("true"), // "true" or "false"
  maxBookings: text("max_bookings").notNull().default("1"), // Maximum bookings per slot
  validFrom: text("valid_from").notNull(), // YYYY-MM-DD start date for recurrence
  validUntil: text("valid_until"), // YYYY-MM-DD end date for recurrence (optional)
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const bookings = pgTable("bookings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  slotId: varchar("slot_id").notNull(),
  customerName: text("customer_name").notNull(),
  customerEmail: text("customer_email").notNull(),
  customerPhone: text("customer_phone"),
  status: text("status").notNull().default("pending"), // "pending", "confirmed", "cancelled"
  notes: text("notes"), // Customer notes or special requirements
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertBookingSchema = createInsertSchema(bookingRequests).pick({
  email: true,
}).extend({
  email: z.string().email("Email invalide"),
});

export const insertAvailabilitySlotSchema = createInsertSchema(availabilitySlots).pick({
  date: true,
  startTime: true,
  endTime: true,
  description: true,
  isActive: true,
  maxBookings: true,
  recurringId: true,
}).extend({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Format de date invalide (YYYY-MM-DD)"),
  startTime: z.string().regex(/^\d{2}:\d{2}$/, "Format d'heure invalide (HH:mm)"),
  endTime: z.string().regex(/^\d{2}:\d{2}$/, "Format d'heure invalide (HH:mm)"),
  description: z.string().optional(),
  isActive: z.enum(["true", "false"]).optional(),
  maxBookings: z.string().transform(Number).pipe(z.number().min(1)), // Accept string, transform to number
  recurringId: z.string().optional(),
});

export const insertBookingSlotSchema = createInsertSchema(bookings).pick({
  slotId: true,
  customerName: true,
  customerEmail: true,
  customerPhone: true,
  notes: true,
}).extend({
  customerName: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  customerEmail: z.string().email("Email invalide"),
  customerPhone: z.string().optional(),
  notes: z.string().optional(),
});

export const insertRecurringSlotSchema = createInsertSchema(recurringSlots).pick({
  dayOfWeek: true,
  startTime: true,
  endTime: true,
  description: true,
  maxBookings: true,
  validFrom: true,
  validUntil: true,
}).extend({
  dayOfWeek: z.string().transform(Number).pipe(z.number().min(0).max(6)), // 0-6 (Sunday=0)
  startTime: z.string().regex(/^\d{2}:\d{2}$/, "Format d'heure invalide (HH:mm)"),
  endTime: z.string().regex(/^\d{2}:\d{2}$/, "Format d'heure invalide (HH:mm)"),
  description: z.string().optional(),
  maxBookings: z.string().transform(Number).pipe(z.number().min(1)),
  validFrom: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Format de date invalide (YYYY-MM-DD)"),
  validUntil: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Format de date invalide (YYYY-MM-DD)").optional(),
});

export type InsertContact = z.infer<typeof insertContactSchema>;
export type Contact = typeof contactSubmissions.$inferSelect;

export type InsertBooking = z.infer<typeof insertBookingSchema>;
export type Booking = typeof bookingRequests.$inferSelect;

export type AvailabilitySlot = typeof availabilitySlots.$inferSelect;
export type InsertAvailabilitySlot = z.infer<typeof insertAvailabilitySlotSchema>;

export type BookingSlot = typeof bookings.$inferSelect;
export type InsertBookingSlot = z.infer<typeof insertBookingSlotSchema>;

export type RecurringSlot = typeof recurringSlots.$inferSelect;
export type InsertRecurringSlot = z.infer<typeof insertRecurringSlotSchema>;
