// Test script to verify database connection
// Run this in your Supabase SQL Editor to test the connection

-- Test basic connection
SELECT 'Database connection test' as test, NOW() as current_time;

-- Test if tables exist
SELECT
    table_name,
    table_type
FROM information_schema.tables
WHERE table_schema = 'public'
    AND table_name IN ('contact_submissions', 'availability_slots', 'recurring_slots', 'bookings')
ORDER BY table_name;

-- Test if data exists in recurring slots
SELECT
    COUNT(*) as recurring_slots_count,
    day_of_week,
    description
FROM recurring_slots
GROUP BY day_of_week, description
ORDER BY day_of_week;

-- Test connection from your application
-- After running this script, visit: https://melring-coaching.vercel.app/api/health
-- It should return a success message if everything is working