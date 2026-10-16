-- ====================================================================
-- PART 1: SCHEMA, TABLES, POLICIES & 4 ADMINS
-- File: supabase/1_schema_and_admins.sql
-- Run this FIRST in Supabase SQL Editor
-- ====================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. PROFILES TABLE (Admins & Staff)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    display_name TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('admin', 'staff')) DEFAULT 'staff',
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. SERVICE CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS public.service_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    icon TEXT,
    display_order INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. SERVICES TABLE
CREATE TABLE IF NOT EXISTS public.services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID NOT NULL REFERENCES public.service_categories(id) ON DELETE RESTRICT,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    short_description TEXT NOT NULL,
    description TEXT NOT NULL,
    service_type TEXT NOT NULL CHECK (service_type IN ('online_assistance', 'physical_service', 'authorized_agent', 'mixed')) DEFAULT 'online_assistance',
    required_documents JSONB NOT NULL DEFAULT '[]'::jsonb,
    instructions TEXT,
    provider_name TEXT,
    official_url TEXT,
    price_amount NUMERIC(10,2),
    price_label TEXT,
    estimated_duration_minutes INTEGER,
    icon TEXT,
    is_featured BOOLEAN NOT NULL DEFAULT false,
    is_active BOOLEAN NOT NULL DEFAULT true,
    booking_enabled BOOLEAN NOT NULL DEFAULT true,
    display_order INTEGER NOT NULL DEFAULT 0,
    disclaimer TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_services_category ON public.services(category_id);
CREATE INDEX IF NOT EXISTS idx_services_slug ON public.services(slug);

-- 5. APPOINTMENTS TABLE
CREATE TABLE IF NOT EXISTS public.appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_reference TEXT NOT NULL UNIQUE,
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    customer_email TEXT,
    service_id UUID REFERENCES public.services(id) ON DELETE SET NULL,
    service_name_snapshot TEXT NOT NULL,
    additional_services_snapshot JSONB NOT NULL DEFAULT '[]'::jsonb,
    appointment_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    timezone TEXT NOT NULL DEFAULT 'Asia/Kolkata',
    customer_notes TEXT,
    status TEXT NOT NULL CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled', 'no_show')) DEFAULT 'pending',
    verified_at TIMESTAMPTZ,
    cancelled_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_appointments_ref ON public.appointments(booking_reference);
CREATE INDEX IF NOT EXISTS idx_appointments_date_slot ON public.appointments(appointment_date, start_time, status);
CREATE INDEX IF NOT EXISTS idx_appointments_phone ON public.appointments(customer_phone);

-- 6. APPOINTMENT SERVICES (Normalized join)
CREATE TABLE IF NOT EXISTS public.appointment_services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    appointment_id UUID NOT NULL REFERENCES public.appointments(id) ON DELETE CASCADE,
    service_id UUID REFERENCES public.services(id) ON DELETE SET NULL,
    service_name_snapshot TEXT NOT NULL,
    price_snapshot NUMERIC(10,2),
    duration_snapshot INTEGER,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 7. BUSINESS HOURS TABLE
CREATE TABLE IF NOT EXISTS public.business_hours (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    weekday INTEGER NOT NULL UNIQUE CHECK (weekday BETWEEN 0 AND 6),
    is_open BOOLEAN NOT NULL DEFAULT true,
    opening_time TIME NOT NULL DEFAULT '09:00:00',
    closing_time TIME NOT NULL DEFAULT '20:00:00',
    break_start TIME DEFAULT '13:30:00',
    break_end TIME DEFAULT '14:30:00',
    slot_duration_minutes INTEGER NOT NULL DEFAULT 30,
    max_bookings_per_slot INTEGER NOT NULL DEFAULT 3,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 8. BLOCKED DATES TABLE
CREATE TABLE IF NOT EXISTS public.blocked_dates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    blocked_date DATE NOT NULL UNIQUE,
    reason TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 9. FEEDBACK TABLE
CREATE TABLE IF NOT EXISTS public.feedback (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    display_name TEXT NOT NULL,
    appointment_id UUID REFERENCES public.appointments(id) ON DELETE SET NULL,
    rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
    category TEXT NOT NULL CHECK (category IN ('service_quality', 'staff_assistance', 'waiting_time', 'website_experience', 'other')),
    message TEXT NOT NULL,
    public_display_consent BOOLEAN NOT NULL DEFAULT false,
    moderation_status TEXT NOT NULL CHECK (moderation_status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending',
    resolution_status TEXT NOT NULL CHECK (resolution_status IN ('unresolved', 'in_progress', 'resolved')) DEFAULT 'unresolved',
    internal_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 10. BUSINESS SETTINGS TABLE
CREATE TABLE IF NOT EXISTS public.business_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key TEXT NOT NULL UNIQUE,
    value JSONB NOT NULL,
    is_public BOOLEAN NOT NULL DEFAULT true,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointment_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_hours ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blocked_dates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_settings ENABLE ROW LEVEL SECURITY;

-- Helper function: Check if caller is active admin or staff
CREATE OR REPLACE FUNCTION public.is_staff_or_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE (id = auth.uid() OR email = auth.jwt()->>'email')
      AND role IN ('admin', 'staff')
      AND is_active = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN public.is_staff_or_admin();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Policies for Profiles
DROP POLICY IF EXISTS "Staff manage profiles" ON public.profiles;
CREATE POLICY "Staff manage profiles" ON public.profiles FOR ALL USING (public.is_staff_or_admin());
DROP POLICY IF EXISTS "Public read profiles" ON public.profiles;
CREATE POLICY "Public read profiles" ON public.profiles FOR SELECT USING (true);

-- Policies for Categories & Services
DROP POLICY IF EXISTS "Public view categories" ON public.service_categories;
CREATE POLICY "Public view categories" ON public.service_categories FOR SELECT USING (is_active = true);
DROP POLICY IF EXISTS "Staff manage categories" ON public.service_categories;
CREATE POLICY "Staff manage categories" ON public.service_categories FOR ALL USING (public.is_staff_or_admin());

DROP POLICY IF EXISTS "Public view services" ON public.services;
CREATE POLICY "Public view services" ON public.services FOR SELECT USING (is_active = true);
DROP POLICY IF EXISTS "Staff manage services" ON public.services;
CREATE POLICY "Staff manage services" ON public.services FOR ALL USING (public.is_staff_or_admin());

-- Policies for Appointments (Direct client booking + Staff manage)
DROP POLICY IF EXISTS "Public book appointment" ON public.appointments;
CREATE POLICY "Public book appointment" ON public.appointments FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Staff manage appointments" ON public.appointments;
CREATE POLICY "Staff manage appointments" ON public.appointments FOR ALL USING (public.is_staff_or_admin());

DROP POLICY IF EXISTS "Staff manage appointment services" ON public.appointment_services;
CREATE POLICY "Staff manage appointment services" ON public.appointment_services FOR ALL USING (public.is_staff_or_admin());

-- Policies for Hours & Dates
DROP POLICY IF EXISTS "Public view hours" ON public.business_hours;
CREATE POLICY "Public view hours" ON public.business_hours FOR SELECT USING (true);
DROP POLICY IF EXISTS "Staff manage hours" ON public.business_hours;
CREATE POLICY "Staff manage hours" ON public.business_hours FOR ALL USING (public.is_staff_or_admin());

DROP POLICY IF EXISTS "Public view blocked dates" ON public.blocked_dates;
CREATE POLICY "Public view blocked dates" ON public.blocked_dates FOR SELECT USING (true);
DROP POLICY IF EXISTS "Staff manage blocked dates" ON public.blocked_dates;
CREATE POLICY "Staff manage blocked dates" ON public.blocked_dates FOR ALL USING (public.is_staff_or_admin());

-- Policies for Feedback
DROP POLICY IF EXISTS "Public view approved feedback" ON public.feedback;
CREATE POLICY "Public view approved feedback" ON public.feedback FOR SELECT USING (moderation_status = 'approved' AND public_display_consent = true);
DROP POLICY IF EXISTS "Public submit feedback" ON public.feedback;
CREATE POLICY "Public submit feedback" ON public.feedback FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Staff manage feedback" ON public.feedback;
CREATE POLICY "Staff manage feedback" ON public.feedback FOR ALL USING (public.is_staff_or_admin());

-- Policies for Business Settings
DROP POLICY IF EXISTS "Public view settings" ON public.business_settings;
CREATE POLICY "Public view settings" ON public.business_settings FOR SELECT USING (is_public = true);
DROP POLICY IF EXISTS "Staff manage settings" ON public.business_settings;
CREATE POLICY "Staff manage settings" ON public.business_settings FOR ALL USING (public.is_staff_or_admin());

-- ====================================================================
-- STORED PROCEDURES (Direct RPCs from Frontend)
-- ====================================================================

-- 1. Appointment Lookup RPC
CREATE OR REPLACE FUNCTION public.lookup_appointment(
    p_booking_reference TEXT,
    p_phone TEXT
)
RETURNS JSONB AS $$
DECLARE
    v_apt RECORD;
BEGIN
    SELECT id, booking_reference, customer_name, customer_phone, customer_email,
           service_name_snapshot, additional_services_snapshot,
           appointment_date, start_time, end_time, status, verified_at, cancelled_at,
           customer_notes, created_at
    INTO v_apt
    FROM public.appointments
    WHERE UPPER(TRIM(booking_reference)) = UPPER(TRIM(p_booking_reference))
      AND (
        RIGHT(REGEXP_REPLACE(customer_phone, '\D', '', 'g'), 10) = RIGHT(REGEXP_REPLACE(p_phone, '\D', '', 'g'), 10)
        OR customer_phone = TRIM(p_phone)
      );

    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'error', 'No matching appointment found with this reference and phone number.');
    END IF;

    RETURN jsonb_build_object('success', true, 'appointment', to_jsonb(v_apt));
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Atomic Appointment Booking RPC
CREATE OR REPLACE FUNCTION public.book_appointment_atomic(
    p_booking_reference TEXT,
    p_customer_name TEXT,
    p_customer_phone TEXT,
    p_customer_email TEXT,
    p_service_id UUID,
    p_service_name_snapshot TEXT,
    p_additional_services_snapshot JSONB,
    p_appointment_date DATE,
    p_start_time TIME,
    p_end_time TIME,
    p_customer_notes TEXT
)
RETURNS JSONB AS $$
DECLARE
    v_weekday INTEGER;
    v_is_open BOOLEAN;
    v_max_capacity INTEGER;
    v_opening TIME;
    v_closing TIME;
    v_break_start TIME;
    v_break_end TIME;
    v_current_bookings INTEGER;
    v_new_appointment public.appointments%ROWTYPE;
BEGIN
    IF EXISTS (SELECT 1 FROM public.blocked_dates WHERE blocked_date = p_appointment_date) THEN
        RETURN jsonb_build_object('success', false, 'error', 'Selected date is closed for bookings or is a holiday.');
    END IF;

    v_weekday := EXTRACT(DOW FROM p_appointment_date);
    SELECT is_open, opening_time, closing_time, break_start, break_end, max_bookings_per_slot
    INTO v_is_open, v_opening, v_closing, v_break_start, v_break_end, v_max_capacity
    FROM public.business_hours
    WHERE weekday = v_weekday;

    IF v_is_open IS NULL OR v_is_open = false THEN
        RETURN jsonb_build_object('success', false, 'error', 'The cafe is closed on this day.');
    END IF;

    IF p_start_time < v_opening OR p_end_time > v_closing THEN
        RETURN jsonb_build_object('success', false, 'error', 'Requested time is outside operating hours.');
    END IF;

    SELECT COUNT(*)
    INTO v_current_bookings
    FROM public.appointments
    WHERE appointment_date = p_appointment_date
      AND start_time = p_start_time
      AND status NOT IN ('cancelled');

    IF v_current_bookings >= COALESCE(v_max_capacity, 3) THEN
        RETURN jsonb_build_object('success', false, 'error', 'This time slot is fully booked. Please select another slot.');
    END IF;

    INSERT INTO public.appointments (
        booking_reference,
        customer_name,
        customer_phone,
        customer_email,
        service_id,
        service_name_snapshot,
        additional_services_snapshot,
        appointment_date,
        start_time,
        end_time,
        customer_notes,
        status
    ) VALUES (
        p_booking_reference,
        p_customer_name,
        p_customer_phone,
        p_customer_email,
        p_service_id,
        p_service_name_snapshot,
        COALESCE(p_additional_services_snapshot, '[]'::jsonb),
        p_appointment_date,
        p_start_time,
        p_end_time,
        p_customer_notes,
        'pending'
    ) RETURNING * INTO v_new_appointment;

    RETURN jsonb_build_object(
        'success', true,
        'appointment', to_jsonb(v_new_appointment)
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ====================================================================
-- INSERT 4 ADMIN & STAFF PROFILES
-- ====================================================================
INSERT INTO public.profiles (email, display_name, role, is_active)
VALUES
('anurag@anandeshwarcafe.com', 'Anurag Mishra', 'admin', true),
('prabhat@anandeshwarcafe.com', 'Prabhat Mishra', 'admin', true),
('raj@anandeshwarcafe.com', 'Raj Mishra', 'staff', true),
('vinay@anandeshwarcafe.com', 'Vinay Singh', 'staff', true)
ON CONFLICT (email) DO UPDATE SET
  display_name = EXCLUDED.display_name,
  role = EXCLUDED.role,
  is_active = EXCLUDED.is_active;

-- ====================================================================
-- INSERT BUSINESS HOURS & SETTINGS
-- ====================================================================
INSERT INTO public.business_hours (weekday, is_open, opening_time, closing_time, break_start, break_end, slot_duration_minutes, max_bookings_per_slot)
VALUES
(1, true, '09:00:00', '20:00:00', '13:30:00', '14:30:00', 30, 3),
(2, true, '09:00:00', '20:00:00', '13:30:00', '14:30:00', 30, 3),
(3, true, '09:00:00', '20:00:00', '13:30:00', '14:30:00', 30, 3),
(4, true, '09:00:00', '20:00:00', '13:30:00', '14:30:00', 30, 3),
(5, true, '09:00:00', '20:00:00', '13:30:00', '14:30:00', 30, 3),
(6, true, '09:00:00', '20:00:00', '13:30:00', '14:30:00', 30, 3),
(0, true, '10:00:00', '15:00:00', NULL, NULL, 30, 2)
ON CONFLICT (weekday) DO UPDATE SET
  is_open = EXCLUDED.is_open,
  opening_time = EXCLUDED.opening_time,
  closing_time = EXCLUDED.closing_time,
  break_start = EXCLUDED.break_start,
  break_end = EXCLUDED.break_end;

INSERT INTO public.business_settings (key, value, is_public)
VALUES
('business_info', jsonb_build_object(
  'name', 'Baba Anandeshwar Internet Cafe',
  'contact_person', 'Anurag Mishra',
  'category', 'Internet Cafe & Digital Application Services',
  'address', 'Hanspuram, Naubasta, Kanpur, Uttar Pradesh, India',
  'city', 'Kanpur',
  'state', 'Uttar Pradesh',
  'pincode', '208021',
  'primary_phone', '6386463054',
  'secondary_phone', '9005536781',
  'public_email', 'anandeshwarcafe@gmail.com',
  'whatsapp_number', '6386463054',
  'directions_url', 'https://maps.google.com/?q=Hanspuram+Naubasta+Kanpur'
), true),
('website_content', jsonb_build_object(
  'hero_headline', 'Your Trusted Local Partner for Digital & Online Services',
  'hero_supporting', 'From government application assistance and document services to travel bookings, printing, and everyday digital needs - get reliable assistance at Baba Anandeshwar Internet Cafe.',
  'announcement_banner_enabled', true,
  'announcement_text', 'Now accepting advance visit appointments! Avoid waiting in line by booking your slot online.',
  'about_text', 'Located in Hanspuram, Naubasta, Kanpur, Baba Anandeshwar Internet Cafe has been assisting local residents, students, and businesses with speed and transparency.'
), true),
('booking_rules', jsonb_build_object(
  'min_notice_hours', 1,
  'max_advance_days', 14,
  'slot_duration_minutes', 30,
  'cancellation_window_hours', 2
), true)
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;
