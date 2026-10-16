-- ====================================================================
-- Baba Anandeshwar Internet Cafe - Supabase Realtime & Permissions
-- Run this in Supabase SQL Editor (https://supabase.com/dashboard/project/tizmvrrsccqhrfxesazn/sql)
-- to enable live real-time synchronization directly with your database!
-- ====================================================================

-- 1. Enable Realtime Replication for Appointments & Feedback
ALTER PUBLICATION supabase_realtime ADD TABLE public.appointments;
ALTER PUBLICATION supabase_realtime ADD TABLE public.feedback;

-- 2. Allow public & staff access for direct frontend appointments
DROP POLICY IF EXISTS "Public read appointments" ON public.appointments;
CREATE POLICY "Public read appointments" ON public.appointments FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public book appointment" ON public.appointments;
CREATE POLICY "Public book appointment" ON public.appointments FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public update appointment status" ON public.appointments;
CREATE POLICY "Public update appointment status" ON public.appointments FOR UPDATE USING (true);

-- 3. Allow public & staff access for direct feedback
DROP POLICY IF EXISTS "Public read all feedback" ON public.feedback;
CREATE POLICY "Public read all feedback" ON public.feedback FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public submit feedback" ON public.feedback;
CREATE POLICY "Public submit feedback" ON public.feedback FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public update feedback moderation" ON public.feedback;
CREATE POLICY "Public update feedback moderation" ON public.feedback FOR UPDATE USING (true);

-- 4. Purge any demo data if present in database (keep only Aditya Kumar Mishra)
DELETE FROM public.appointments
WHERE customer_name IN ('Vikas Kushwaha', 'Pooja Tiwari', 'Sunil Kumar Gupta');

DELETE FROM public.feedback
WHERE display_name IN ('Ramesh Chandra', 'Deepak Dixit', 'Neha Saxena');

-- 5. Insert Aditya Kumar Mishra's appointment directly if not already present
INSERT INTO public.appointments (
  booking_reference,
  customer_name,
  customer_phone,
  service_name_snapshot,
  appointment_date,
  start_time,
  end_time,
  status
)
SELECT
  'BAC-350237',
  'Aditya Kumar Mishra',
  '08601326062',
  'Online Application & Document Processing',
  '2026-10-17'::date,
  '09:00:00'::time,
  '09:30:00'::time,
  'pending'
WHERE NOT EXISTS (
  SELECT 1 FROM public.appointments WHERE booking_reference = 'BAC-350237'
);
