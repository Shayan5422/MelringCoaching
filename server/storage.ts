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
import { randomUUID } from "crypto";

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

export class MemStorage implements IStorage {
  private contacts: Map<string, Contact>;
  private bookings: Map<string, Booking>;
  private availabilitySlots: Map<string, AvailabilitySlot>;
  private bookingSlots: Map<string, BookingSlot>;
  private recurringSlots: Map<string, RecurringSlot>;

  constructor() {
    this.contacts = new Map();
    this.bookings = new Map();
    this.availabilitySlots = new Map();
    this.bookingSlots = new Map();
    this.recurringSlots = new Map();
  }

  async createContact(insertContact: InsertContact): Promise<Contact> {
    const id = randomUUID();
    const contact: Contact = {
      ...insertContact,
      id,
      createdAt: new Date(),
    };
    this.contacts.set(id, contact);
    return contact;
  }

  async getAllContacts(): Promise<Contact[]> {
    return Array.from(this.contacts.values()).sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
  }

  async createBooking(insertBooking: InsertBooking): Promise<Booking> {
    const id = randomUUID();
    const booking: Booking = {
      ...insertBooking,
      id,
      createdAt: new Date(),
    };
    this.bookings.set(id, booking);
    return booking;
  }

  async getAllBookings(): Promise<Booking[]> {
    return Array.from(this.bookings.values()).sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
  }

  // Availability slots methods
  async createAvailabilitySlot(insertSlot: InsertAvailabilitySlot): Promise<AvailabilitySlot> {
    const id = randomUUID();
    const now = new Date();
    const slot: AvailabilitySlot = {
      ...insertSlot,
      id,
      isActive: "true",
      description: insertSlot.description || null,
      maxBookings: insertSlot.maxBookings.toString(),
      recurringId: insertSlot.recurringId || null,
      createdAt: now,
      updatedAt: now,
    };
    this.availabilitySlots.set(id, slot);
    return slot;
  }

  async getAllAvailabilitySlots(): Promise<AvailabilitySlot[]> {
    return Array.from(this.availabilitySlots.values()).sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  }

  async getAvailabilitySlotsByDate(date: string): Promise<AvailabilitySlot[]> {
    return Array.from(this.availabilitySlots.values())
      .filter(slot => slot.date === date && slot.isActive === "true")
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
  }

  async updateAvailabilitySlot(id: string, updates: Partial<AvailabilitySlot>): Promise<AvailabilitySlot> {
    const slot = this.availabilitySlots.get(id);
    if (!slot) {
      throw new Error("Availability slot not found");
    }
    const updatedSlot: AvailabilitySlot = {
      ...slot,
      ...updates,
      updatedAt: new Date(),
    };
    this.availabilitySlots.set(id, updatedSlot);
    return updatedSlot;
  }

  async deleteAvailabilitySlot(id: string): Promise<void> {
    this.availabilitySlots.delete(id);
  }

  // Booking slots methods
  async createBookingSlot(insertBooking: InsertBookingSlot): Promise<BookingSlot> {
    const id = randomUUID();
    const now = new Date();
    const booking: BookingSlot = {
      ...insertBooking,
      id,
      status: "pending",
      customerPhone: insertBooking.customerPhone || null,
      notes: insertBooking.notes || null,
      createdAt: now,
      updatedAt: now,
    };
    this.bookingSlots.set(id, booking);
    return booking;
  }

  async getAllBookingSlots(): Promise<BookingSlot[]> {
    return Array.from(this.bookingSlots.values()).sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
  }

  async getBookingSlotsBySlotId(slotId: string): Promise<BookingSlot[]> {
    return Array.from(this.bookingSlots.values())
      .filter(booking => booking.slotId === slotId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async updateBookingSlot(id: string, updates: Partial<BookingSlot>): Promise<BookingSlot> {
    const booking = this.bookingSlots.get(id);
    if (!booking) {
      throw new Error("Booking slot not found");
    }
    const updatedBooking: BookingSlot = {
      ...booking,
      ...updates,
      updatedAt: new Date(),
    };
    this.bookingSlots.set(id, updatedBooking);
    return updatedBooking;
  }

  // Recurring slots methods
  async createRecurringSlot(insertSlot: InsertRecurringSlot): Promise<RecurringSlot> {
    const id = randomUUID();
    const now = new Date();
    const slot: RecurringSlot = {
      ...insertSlot,
      id,
      dayOfWeek: insertSlot.dayOfWeek.toString(),
      maxBookings: insertSlot.maxBookings.toString(),
      description: insertSlot.description || null,
      validUntil: insertSlot.validUntil || null,
      isActive: "true",
      createdAt: now,
      updatedAt: now,
    };
    this.recurringSlots.set(id, slot);
    return slot;
  }

  async getAllRecurringSlots(): Promise<RecurringSlot[]> {
    return Array.from(this.recurringSlots.values()).sort(
      (a, b) => parseInt(a.dayOfWeek) - parseInt(b.dayOfWeek)
    );
  }

  async updateRecurringSlot(id: string, updates: Partial<RecurringSlot>): Promise<RecurringSlot> {
    const slot = this.recurringSlots.get(id);
    if (!slot) {
      throw new Error("Recurring slot not found");
    }
    const updatedSlot: RecurringSlot = {
      ...slot,
      ...updates,
      updatedAt: new Date(),
    };
    this.recurringSlots.set(id, updatedSlot);
    return updatedSlot;
  }

  async deleteRecurringSlot(id: string): Promise<void> {
    this.recurringSlots.delete(id);
    // Also delete all availability slots generated from this recurring slot
    Array.from(this.availabilitySlots.entries()).forEach(([slotId, availabilitySlot]) => {
      if (availabilitySlot.recurringId === id) {
        this.availabilitySlots.delete(slotId);
      }
    });
  }

  async generateAvailabilitySlotsFromRecurring(): Promise<void> {
    const today = new Date();
    const validUntil = new Date(today);
    validUntil.setDate(validUntil.getDate() + 14); // Generate slots for next 14 days

    Array.from(this.recurringSlots.values()).forEach(recurringSlot => {
      if (recurringSlot.isActive !== "true") return;

      const validFrom = new Date(recurringSlot.validFrom);
      const slotValidUntil = recurringSlot.validUntil ? new Date(recurringSlot.validUntil) : validUntil;

      // Generate slots from validFrom to min(validUntil, slotValidUntil)
      const endDate = new Date(Math.min(validUntil.getTime(), slotValidUntil.getTime()));

      for (let date = new Date(validFrom); date <= endDate; date.setDate(date.getDate() + 1)) {
        if (date.getDay() === parseInt(recurringSlot.dayOfWeek)) {
          const dateStr = date.toISOString().split('T')[0];

          // Check if slot already exists
          const existingSlot = Array.from(this.availabilitySlots.values()).find(
            slot => slot.date === dateStr &&
                   slot.startTime === recurringSlot.startTime &&
                   slot.endTime === recurringSlot.endTime &&
                   slot.recurringId === recurringSlot.id
          );

          if (!existingSlot) {
            const availabilitySlot: AvailabilitySlot = {
              id: randomUUID(),
              date: dateStr,
              startTime: recurringSlot.startTime,
              endTime: recurringSlot.endTime,
              description: recurringSlot.description,
              isActive: recurringSlot.isActive,
              maxBookings: recurringSlot.maxBookings,
              recurringId: recurringSlot.id,
              createdAt: new Date(),
              updatedAt: new Date(),
            };
            this.availabilitySlots.set(availabilitySlot.id, availabilitySlot);
          }
        }
      }
    });
  }
}

export const storage = new MemStorage();
