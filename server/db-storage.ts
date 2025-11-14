import { eq, and, gte, lte } from "drizzle-orm";
import { randomUUID } from "node:crypto";
import {
  type Contact,
  type InsertContact,
  type Booking,
  type InsertBooking,
  type AvailabilitySlot,
  type InsertAvailabilitySlot,
  type BookingSlot,
  type InsertBookingSlot,
  type RecurringSlot,
  type InsertRecurringSlot
} from "../shared/schema.js";
import { db } from "./db.js";
import {
  contactSubmissions,
  availabilitySlots,
  recurringSlots,
  bookings
} from "../shared/schema.js";

export interface IStorage {
  createContact(contact: InsertContact): Promise<Contact>;
  getAllContacts(): Promise<Contact[]>;
  createBooking(booking: InsertBooking): Promise<Booking>;
  getAllBookings(): Promise<Booking[]>;

  // Availability slots
  createAvailabilitySlot(slot: InsertAvailabilitySlot): Promise<AvailabilitySlot>;
  getAllAvailabilitySlots(): Promise<AvailabilitySlot[]>;
  getAvailabilitySlotsByDate(date: string): Promise<AvailabilitySlot[]>;
  updateAvailabilitySlot(id: string, updates: Partial<AvailabilitySlot>): Promise<AvailabilitySlot>;
  deleteAvailabilitySlot(id: string): Promise<void>;

  // Recurring slots
  createRecurringSlot(slot: InsertRecurringSlot): Promise<RecurringSlot>;
  getAllRecurringSlots(): Promise<RecurringSlot[]>;
  updateRecurringSlot(id: string, updates: Partial<RecurringSlot>): Promise<RecurringSlot>;
  deleteRecurringSlot(id: string): Promise<void>;
  generateAvailabilitySlotsFromRecurring(): Promise<void>;

  // Booking slots
  createBookingSlot(booking: InsertBookingSlot): Promise<BookingSlot>;
  getAllBookingSlots(): Promise<BookingSlot[]>;
  getBookingSlotsBySlotId(slotId: string): Promise<BookingSlot[]>;
  updateBookingSlot(id: string, updates: Partial<BookingSlot>): Promise<BookingSlot>;
}

export class DatabaseStorage implements IStorage {
  constructor() {
    console.log("DatabaseStorage initialized successfully");
  }

  // Contact methods
  async createContact(insertContact: InsertContact): Promise<Contact> {
    const [contact] = await db
      .insert(contactSubmissions)
      .values(insertContact)
      .returning();
    return contact;
  }

  async getAllContacts(): Promise<Contact[]> {
    return await db
      .select()
      .from(contactSubmissions)
      .orderBy(contactSubmissions.createdAt);
  }

  // Simple booking methods
  async createBooking(insertBooking: InsertBooking): Promise<Booking> {
    const [booking] = await db
      .insert(contactSubmissions)
      .values({
        id: randomUUID(),
        name: "Booking Request",
        email: insertBooking.email,
        message: `Simple booking request: ${JSON.stringify(insertBooking)}`
      })
      .returning();
    return booking;
  }

  async getAllBookings(): Promise<Booking[]> {
    return await db
      .select()
      .from(contactSubmissions)
      .orderBy(contactSubmissions.createdAt);
  }

  // Availability slots methods
  async createAvailabilitySlot(insertSlot: InsertAvailabilitySlot): Promise<AvailabilitySlot> {
    const [slot] = await db
      .insert(availabilitySlots)
      .values({
        ...insertSlot,
        id: randomUUID(),
        isActive: insertSlot.isActive || "true",
        maxBookings: insertSlot.maxBookings?.toString() || "1",
        createdAt: new Date(),
        updatedAt: new Date()
      })
      .returning();
    return slot;
  }

  async getAllAvailabilitySlots(): Promise<AvailabilitySlot[]> {
    return await db
      .select()
      .from(availabilitySlots)
      .orderBy(availabilitySlots.date, availabilitySlots.startTime);
  }

  async getAvailabilitySlotsByDate(date: string): Promise<AvailabilitySlot[]> {
    return await db
      .select()
      .from(availabilitySlots)
      .where(and(
        eq(availabilitySlots.date, date),
        eq(availabilitySlots.isActive, "true")
      ))
      .orderBy(availabilitySlots.startTime);
  }

  async updateAvailabilitySlot(id: string, updates: Partial<AvailabilitySlot>): Promise<AvailabilitySlot> {
    const [slot] = await db
      .update(availabilitySlots)
      .set({
        ...updates,
        updatedAt: new Date()
      })
      .where(eq(availabilitySlots.id, id))
      .returning();

    if (!slot) {
      throw new Error("Availability slot not found");
    }
    return slot;
  }

  async deleteAvailabilitySlot(id: string): Promise<void> {
    await db
      .delete(availabilitySlots)
      .where(eq(availabilitySlots.id, id));
  }

  // Booking slots methods
  async createBookingSlot(insertBooking: InsertBookingSlot): Promise<BookingSlot> {
    const [booking] = await db
      .insert(bookings)
      .values({
        ...insertBooking,
        id: randomUUID(),
        status: "pending",
        customerPhone: insertBooking.customerPhone || undefined,
        notes: insertBooking.notes || undefined,
        createdAt: new Date(),
        updatedAt: new Date()
      })
      .returning();
    return booking;
  }

  async getAllBookingSlots(): Promise<BookingSlot[]> {
    return await db
      .select()
      .from(bookings)
      .orderBy(bookings.createdAt);
  }

  async getBookingSlotsBySlotId(slotId: string): Promise<BookingSlot[]> {
    return await db
      .select()
      .from(bookings)
      .where(eq(bookings.slotId, slotId))
      .orderBy(bookings.createdAt);
  }

  async updateBookingSlot(id: string, updates: Partial<BookingSlot>): Promise<BookingSlot> {
    const [booking] = await db
      .update(bookings)
      .set({
        ...updates,
        updatedAt: new Date()
      })
      .where(eq(bookings.id, id))
      .returning();

    if (!booking) {
      throw new Error("Booking slot not found");
    }
    return booking;
  }

  // Recurring slots methods
  async createRecurringSlot(insertSlot: InsertRecurringSlot): Promise<RecurringSlot> {
    const [slot] = await db
      .insert(recurringSlots)
      .values({
        ...insertSlot,
        id: randomUUID(),
        dayOfWeek: insertSlot.dayOfWeek.toString(),
        maxBookings: insertSlot.maxBookings?.toString() || "1",
        description: insertSlot.description || undefined,
        validUntil: insertSlot.validUntil || undefined,
        isActive: "true",
        createdAt: new Date(),
        updatedAt: new Date()
      })
      .returning();
    return slot;
  }

  async getAllRecurringSlots(): Promise<RecurringSlot[]> {
    return await db
      .select()
      .from(recurringSlots)
      .orderBy(recurringSlots.dayOfWeek);
  }

  async updateRecurringSlot(id: string, updates: Partial<RecurringSlot>): Promise<RecurringSlot> {
    const [slot] = await db
      .update(recurringSlots)
      .set({
        ...updates,
        updatedAt: new Date()
      })
      .where(eq(recurringSlots.id, id))
      .returning();

    if (!slot) {
      throw new Error("Recurring slot not found");
    }
    return slot;
  }

  async deleteRecurringSlot(id: string): Promise<void> {
    // Delete associated availability slots first
    await db
      .delete(availabilitySlots)
      .where(eq(availabilitySlots.recurringId, id));

    // Then delete the recurring slot
    await db
      .delete(recurringSlots)
      .where(eq(recurringSlots.id, id));
  }

  async generateAvailabilitySlotsFromRecurring(): Promise<void> {
    const today = new Date();
    const validUntil = new Date(today);
    validUntil.setDate(validUntil.getDate() + 14); // Generate slots for next 14 days

    const recurringSlotsList = await this.getAllRecurringSlots();

    for (const recurringSlot of recurringSlotsList) {
      if (recurringSlot.isActive !== "true") continue;

      const validFrom = new Date(recurringSlot.validFrom);
      const slotValidUntil = recurringSlot.validUntil ? new Date(recurringSlot.validUntil) : validUntil;
      const endDate = new Date(Math.min(validUntil.getTime(), slotValidUntil.getTime()));

      for (let date = new Date(validFrom); date <= endDate; date.setDate(date.getDate() + 1)) {
        if (date.getDay() === parseInt(recurringSlot.dayOfWeek)) {
          const dateStr = date.toISOString().split("T")[0];

          // Check if slot already exists
          const existingSlots = await db
            .select()
            .from(availabilitySlots)
            .where(and(
              eq(availabilitySlots.date, dateStr),
              eq(availabilitySlots.startTime, recurringSlot.startTime),
              eq(availabilitySlots.endTime, recurringSlot.endTime),
              eq(availabilitySlots.recurringId, recurringSlot.id)
            ));

          if (existingSlots.length === 0) {
            await this.createAvailabilitySlot({
              date: dateStr,
              startTime: recurringSlot.startTime,
              endTime: recurringSlot.endTime,
              description: recurringSlot.description || undefined,
              isActive: recurringSlot.isActive as "true" | "false",
              maxBookings: parseInt(recurringSlot.maxBookings),
              recurringId: recurringSlot.id
            });
          }
        }
      }
    }
  }
}