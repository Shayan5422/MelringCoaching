-- Melring Coaching Database Setup
-- Run this in your Supabase SQL Editor

-- Drop existing tables if they exist (for clean setup)
DROP TABLE IF EXISTS bookings CASCADE;
DROP TABLE IF EXISTS availability_slots CASCADE;
DROP TABLE IF EXISTS recurring_slots CASCADE;
DROP TABLE IF EXISTS contact_submissions CASCADE;

-- Create contact submissions table
CREATE TABLE contact_submissions (
  id VARCHAR(255) PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create availability slots table
CREATE TABLE availability_slots (
  id VARCHAR(255) PRIMARY KEY DEFAULT gen_random_uuid(),
  date TEXT NOT NULL, -- YYYY-MM-DD format
  start_time TEXT NOT NULL, -- HH:mm format
  end_time TEXT NOT NULL, -- HH:mm format
  description TEXT, -- Course description (Open Ring, Boxe Femme, etc.)
  is_active TEXT NOT NULL DEFAULT 'true', -- "true" or "false"
  max_bookings TEXT NOT NULL DEFAULT '1', -- Maximum bookings per slot
  recurring_id TEXT, -- Link to recurring slot pattern
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create recurring slots table
CREATE TABLE recurring_slots (
  id VARCHAR(255) PRIMARY KEY DEFAULT gen_random_uuid(),
  day_of_week TEXT NOT NULL, -- 0-6 (Sunday=0, Monday=1, etc.)
  start_time TEXT NOT NULL, -- HH:mm format
  end_time TEXT NOT NULL, -- HH:mm format
  description TEXT, -- Course description (Open Ring, Boxe Femme, etc.)
  is_active TEXT NOT NULL DEFAULT 'true', -- "true" or "false"
  max_bookings TEXT NOT NULL DEFAULT '1', -- Maximum bookings per slot
  valid_from TEXT NOT NULL, -- YYYY-MM-DD start date for recurrence
  valid_until TEXT, -- YYYY-MM-DD end date for recurrence (optional)
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create bookings table
CREATE TABLE bookings (
  id VARCHAR(255) PRIMARY KEY DEFAULT gen_random_uuid(),
  slot_id VARCHAR(255) NOT NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  status TEXT NOT NULL DEFAULT 'pending', -- "pending", "confirmed", "cancelled"
  notes TEXT, -- Customer notes or special requirements
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_availability_slots_date ON availability_slots(date);
CREATE INDEX idx_availability_slots_recurring_id ON availability_slots(recurring_id);
CREATE INDEX idx_bookings_slot_id ON bookings(slot_id);
CREATE INDEX idx_contact_submissions_created_at ON contact_submissions(created_at);
CREATE INDEX idx_recurring_slots_day_of_week ON recurring_slots(day_of_week);

-- Enable Row Level Security (RLS)
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE availability_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE recurring_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Create policies (allow all operations for the application)
CREATE POLICY "Enable all operations on contact_submissions" ON contact_submissions FOR ALL USING (true);
CREATE POLICY "Enable all operations on availability_slots" ON availability_slots FOR ALL USING (true);
CREATE POLICY "Enable all operations on recurring_slots" ON recurring_slots FOR ALL USING (true);
CREATE POLICY "Enable all operations on bookings" ON bookings FOR ALL USING (true);

-- Insert some initial data (optional - you can also use the seed data from your app)
-- Weekly recurring schedule for Melring Coaching
INSERT INTO recurring_slots (day_of_week, start_time, end_time, description, max_bookings, valid_from) VALUES
-- LUNDI (Monday = 1)
('1', '18:45', '20:00', 'Open Ring', '8', '2025-01-01'),
('1', '20:15', '21:15', 'Boxe Femme', '10', '2025-01-01'),

-- MARDI (Tuesday = 2)
('2', '14:00', '17:00', 'Open Ring', '12', '2025-01-01'),
('2', '18:00', '18:45', 'HIIT Mixte', '10', '2025-01-01'),
('2', '19:00', '20:00', 'Boxe Femme', '10', '2025-01-01'),
('2', '20:15', '21:15', 'Boxe Mixte', '12', '2025-01-01'),

-- MERCREDI (Wednesday = 3)
('3', '12:15', '13:00', 'HIIT Mixte', '10', '2025-01-01'),
('3', '14:00', '17:00', 'Open Ring', '12', '2025-01-01'),
('3', '18:00', '18:45', 'HIIT Femme', '8', '2025-01-01'),
('3', '19:00', '20:00', 'Boxe Mixte', '12', '2025-01-01'),
('3', '20:15', '21:15', 'Boxe Femme', '10', '2025-01-01'),

-- JEUDI (Thursday = 4)
('4', '09:30', '10:30', 'Boxe Mixte', '8', '2025-01-01'),
('4', '12:15', '13:00', 'HIIT Femme', '8', '2025-01-01'),
('4', '14:00', '17:00', 'Open Ring', '12', '2025-01-01'),
('4', '18:00', '18:45', 'HIIT Mixte', '10', '2025-01-01'),
('4', '18:45', '20:00', 'Open Ring', '12', '2025-01-01'),
('4', '20:15', '21:15', 'Boxe Femme', '10', '2025-01-01'),

-- VENDREDI (Friday = 5)
('5', '09:30', '10:30', 'Boxe Femme', '8', '2025-01-01'),
('5', '12:15', '13:00', 'HIIT Mixte', '10', '2025-01-01'),
('5', '18:00', '18:45', 'HIIT Femme', '8', '2025-01-01'),

-- SAMEDI (Saturday = 6)
('6', '10:00', '12:00', 'Open Ring', '15', '2025-01-01'),
('6', '12:15', '13:00', 'HIIT Femme', '8', '2025-01-01'),
('6', '13:30', '14:30', 'Boxe Mixte', '10', '2025-01-01'),

-- DIMANCHE (Sunday = 0)
('0', '11:00', '12:00', 'Boxe Mixte', '8', '2025-01-01'),
('0', '12:15', '13:00', 'HIIT Mixte', '10', '2025-01-01'),
('0', '13:30', '14:30', 'Boxe Femme', '8', '2025-01-01'),
('0', '15:00', '17:00', 'Open Ring', '15', '2025-01-01');

-- Success message
SELECT 'Database setup completed successfully!' as status;