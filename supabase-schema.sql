-- Create contact submissions table
CREATE TABLE IF NOT EXISTS contact_submissions (
  id VARCHAR(255) PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create availability slots table
CREATE TABLE IF NOT EXISTS availability_slots (
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
CREATE TABLE IF NOT EXISTS recurring_slots (
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
CREATE TABLE IF NOT EXISTS bookings (
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
CREATE INDEX IF NOT EXISTS idx_availability_slots_date ON availability_slots(date);
CREATE INDEX IF NOT EXISTS idx_availability_slots_recurring_id ON availability_slots(recurring_id);
CREATE INDEX IF NOT EXISTS idx_bookings_slot_id ON bookings(slot_id);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_created_at ON contact_submissions(created_at);

-- Enable RLS (Row Level Security)
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE availability_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE recurring_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Create policies (allow all operations for now, adjust as needed)
CREATE POLICY "Enable all operations on contact_submissions" ON contact_submissions FOR ALL USING (true);
CREATE POLICY "Enable all operations on availability_slots" ON availability_slots FOR ALL USING (true);
CREATE POLICY "Enable all operations on recurring_slots" ON recurring_slots FOR ALL USING (true);
CREATE POLICY "Enable all operations on bookings" ON bookings FOR ALL USING (true);