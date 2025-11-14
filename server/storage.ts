import {
  type Contact,
  type InsertContact,
  type Booking,
  type InsertBooking,
  type AvailabilitySlot,
  type InsertAvailabilitySlot,
  type BookingSlot,
  type InsertBookingSlot
} from "@shared/schema";
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

  constructor() {
    this.contacts = new Map();
    this.bookings = new Map();
    this.availabilitySlots = new Map();
    this.bookingSlots = new Map();
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
}

export const storage = new MemStorage();
