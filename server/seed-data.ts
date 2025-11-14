import { storage } from "./storage";

export async function seedInitialData() {
  console.log("Seeding initial data...");

  // Function to get next occurrence of a specific day of week
  function getNextDayOfWeek(dayOfWeek: number): Date {
    const today = new Date();
    const resultDate = new Date(today);
    const currentDay = today.getDay(); // 0 = Sunday, 1 = Monday, etc.

    let daysToAdd = (dayOfWeek - currentDay + 7) % 7;
    if (daysToAdd === 0 && today.getHours() >= 20) { // If it's the same day but past 8pm, go to next week
      daysToAdd = 7;
    }

    resultDate.setDate(today.getDate() + daysToAdd);
    return resultDate;
  }

  // Weekly schedule slots
  const weeklySchedule = [
    // LUNDI (Monday = 1)
    {
      dayOfWeek: 1,
      slots: [
        { startTime: "18:45", endTime: "20:00", maxBookings: 8, description: "Open Ring" },
        { startTime: "20:15", endTime: "21:15", maxBookings: 10, description: "Boxe Femme" }
      ]
    },
    // MARDI (Tuesday = 2)
    {
      dayOfWeek: 2,
      slots: [
        { startTime: "14:00", endTime: "17:00", maxBookings: 12, description: "Open Ring" },
        { startTime: "18:00", endTime: "18:45", maxBookings: 10, description: "HIIT Mixte" },
        { startTime: "19:00", endTime: "20:00", maxBookings: 10, description: "Boxe Femme" },
        { startTime: "20:15", endTime: "21:15", maxBookings: 12, description: "Boxe Mixte" }
      ]
    },
    // MERCREDI (Wednesday = 3)
    {
      dayOfWeek: 3,
      slots: [
        { startTime: "12:15", endTime: "13:00", maxBookings: 10, description: "HIIT Mixte" },
        { startTime: "14:00", endTime: "17:00", maxBookings: 12, description: "Open Ring" },
        { startTime: "18:00", endTime: "18:45", maxBookings: 8, description: "HIIT Femme" },
        { startTime: "19:00", endTime: "20:00", maxBookings: 12, description: "Boxe Mixte" },
        { startTime: "20:15", endTime: "21:15", maxBookings: 10, description: "Boxe Femme" }
      ]
    },
    // JEUDI (Thursday = 4)
    {
      dayOfWeek: 4,
      slots: [
        { startTime: "09:30", endTime: "10:30", maxBookings: 8, description: "Boxe Mixte" },
        { startTime: "12:15", endTime: "13:00", maxBookings: 8, description: "HIIT Femme" },
        { startTime: "14:00", endTime: "17:00", maxBookings: 12, description: "Open Ring" },
        { startTime: "18:00", endTime: "18:45", maxBookings: 10, description: "HIIT Mixte" },
        { startTime: "18:45", endTime: "20:00", maxBookings: 12, description: "Open Ring" },
        { startTime: "20:15", endTime: "21:15", maxBookings: 10, description: "Boxe Femme" }
      ]
    },
    // VENDREDI (Friday = 5)
    {
      dayOfWeek: 5,
      slots: [
        { startTime: "09:30", endTime: "10:30", maxBookings: 8, description: "Boxe Femme" },
        { startTime: "12:15", endTime: "13:00", maxBookings: 10, description: "HIIT Mixte" },
        { startTime: "18:00", endTime: "18:45", maxBookings: 8, description: "HIIT Femme" }
      ]
    },
    // SAMEDI (Saturday = 6)
    {
      dayOfWeek: 6,
      slots: [
        { startTime: "10:00", endTime: "12:00", maxBookings: 15, description: "Open Ring" },
        { startTime: "12:15", endTime: "13:00", maxBookings: 8, description: "HIIT Femme" },
        { startTime: "13:30", endTime: "14:30", maxBookings: 10, description: "Boxe Mixte" }
      ]
    },
    // DIMANCHE (Sunday = 0)
    {
      dayOfWeek: 0,
      slots: [
        { startTime: "11:00", endTime: "12:00", maxBookings: 8, description: "Boxe Mixte" },
        { startTime: "12:15", endTime: "13:00", maxBookings: 10, description: "HIIT Mixte" },
        { startTime: "13:30", endTime: "14:30", maxBookings: 8, description: "Boxe Femme" },
        { startTime: "15:00", endTime: "17:00", maxBookings: 15, description: "Open Ring" }
      ]
    }
  ];

  // Generate slots for the next 2 weeks
  for (let weekOffset = 0; weekOffset < 2; weekOffset++) {
    for (const daySchedule of weeklySchedule) {
      const targetDate = new Date(getNextDayOfWeek(daySchedule.dayOfWeek));
      targetDate.setDate(targetDate.getDate() + (weekOffset * 7));

      const dateStr = targetDate.toISOString().split('T')[0];

      for (const slot of daySchedule.slots) {
        const slotData = {
          date: dateStr,
          startTime: slot.startTime,
          endTime: slot.endTime,
          description: slot.description,
          maxBookings: slot.maxBookings,
        };

        try {
          await storage.createAvailabilitySlot(slotData);
          console.log(`Created availability slot: ${dateStr} ${slot.startTime}-${slot.endTime} (${slot.description})`);
        } catch (error) {
          console.error("Error creating slot:", error);
        }
      }
    }
  }

  console.log("Initial data seeded successfully!");
}