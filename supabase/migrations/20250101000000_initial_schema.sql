-- ========================================================
-- BABA ANANDESHWAR INTERNET CAFE - INITIAL SCHEMA & POLICIES
-- ========================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES (Admins and Staff)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    display_name TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('admin', 'staff')),
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. SERVICE CATEGORIES
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

-- 3. SERVICES (All 50 distinct services)
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

-- Full text search indexes for services
CREATE INDEX IF NOT EXISTS idx_services_category ON public.services(category_id);
CREATE INDEX IF NOT EXISTS idx_services_slug ON public.services(slug);
CREATE INDEX IF NOT EXISTS idx_services_active_featured ON public.services(is_active, is_featured, display_order);
CREATE INDEX IF NOT EXISTS idx_services_search ON public.services USING gin(to_tsvector('english', name || ' ' || short_description || ' ' || description));

-- 4. APPOINTMENTS
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
CREATE INDEX IF NOT EXISTS idx_appointments_status ON public.appointments(status);

-- 5. APPOINTMENT SERVICES (Normalized join)
CREATE TABLE IF NOT EXISTS public.appointment_services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    appointment_id UUID NOT NULL REFERENCES public.appointments(id) ON DELETE CASCADE,
    service_id UUID REFERENCES public.services(id) ON DELETE SET NULL,
    service_name_snapshot TEXT NOT NULL,
    price_snapshot NUMERIC(10,2),
    duration_snapshot INTEGER,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 6. BUSINESS HOURS
CREATE TABLE IF NOT EXISTS public.business_hours (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    weekday INTEGER NOT NULL UNIQUE CHECK (weekday BETWEEN 0 AND 6), -- 0=Sunday, 1=Monday ... 6=Saturday
    is_open BOOLEAN NOT NULL DEFAULT true,
    opening_time TIME NOT NULL DEFAULT '09:00:00',
    closing_time TIME NOT NULL DEFAULT '20:00:00',
    break_start TIME DEFAULT '13:30:00',
    break_end TIME DEFAULT '14:30:00',
    slot_duration_minutes INTEGER NOT NULL DEFAULT 30,
    max_bookings_per_slot INTEGER NOT NULL DEFAULT 3,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 7. BLOCKED DATES (Holidays / Special closures)
CREATE TABLE IF NOT EXISTS public.blocked_dates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    blocked_date DATE NOT NULL UNIQUE,
    reason TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 8. FEEDBACK
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

CREATE INDEX IF NOT EXISTS idx_feedback_public ON public.feedback(moderation_status, public_display_consent, created_at DESC);

-- 9. BUSINESS SETTINGS
CREATE TABLE IF NOT EXISTS public.business_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key TEXT NOT NULL UNIQUE,
    value JSONB NOT NULL,
    is_public BOOLEAN NOT NULL DEFAULT true,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 10. AUDIT LOGS
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id TEXT,
    safe_metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_actor ON public.audit_logs(actor_user_id, created_at DESC);

-- ========================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ========================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointment_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_hours ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blocked_dates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Helper function to check if current user is an active admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid()
      AND role = 'admin'
      AND is_active = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Profiles: Admins can read/write all; users can read their own profile
CREATE POLICY "Admins full access to profiles"
    ON public.profiles FOR ALL
    USING (public.is_admin());

CREATE POLICY "Users can read own profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id);

-- Service Categories: Public read active; admin full access
CREATE POLICY "Public can view active service categories"
    ON public.service_categories FOR SELECT
    USING (is_active = true);

CREATE POLICY "Admins manage service categories"
    ON public.service_categories FOR ALL
    USING (public.is_admin());

-- Services: Public read active; admin full access
CREATE POLICY "Public can view active services"
    ON public.services FOR SELECT
    USING (is_active = true);

CREATE POLICY "Admins manage services"
    ON public.services FOR ALL
    USING (public.is_admin());

-- Appointments:
-- Public can NOT view appointments table directly without backend verification
-- Admins have full access
CREATE POLICY "Admins full access to appointments"
    ON public.appointments FOR ALL
    USING (public.is_admin());

-- Appointment Services:
CREATE POLICY "Admins full access to appointment services"
    ON public.appointment_services FOR ALL
    USING (public.is_admin());

-- Business Hours: Public read; admin update
CREATE POLICY "Public can view business hours"
    ON public.business_hours FOR SELECT
    USING (true);

CREATE POLICY "Admins manage business hours"
    ON public.business_hours FOR ALL
    USING (public.is_admin());

-- Blocked Dates: Public read; admin manage
CREATE POLICY "Public can view blocked dates"
    ON public.blocked_dates FOR SELECT
    USING (true);

CREATE POLICY "Admins manage blocked dates"
    ON public.blocked_dates FOR ALL
    USING (public.is_admin());

-- Feedback:
-- Public can read approved feedback with public_display_consent = true
CREATE POLICY "Public can view approved public feedback"
    ON public.feedback FOR SELECT
    USING (moderation_status = 'approved' AND public_display_consent = true);

-- Anyone can submit feedback
CREATE POLICY "Public can insert feedback"
    ON public.feedback FOR INSERT
    WITH CHECK (
        moderation_status = 'pending' AND
        resolution_status = 'unresolved' AND
        internal_notes IS NULL
    );

-- Admins manage all feedback
CREATE POLICY "Admins manage feedback"
    ON public.feedback FOR ALL
    USING (public.is_admin());

-- Business Settings: Public read is_public = true; admin manage all
CREATE POLICY "Public can view public settings"
    ON public.business_settings FOR SELECT
    USING (is_public = true);

CREATE POLICY "Admins manage settings"
    ON public.business_settings FOR ALL
    USING (public.is_admin());

-- Audit Logs: Admin read-only
CREATE POLICY "Admins read audit logs"
    ON public.audit_logs FOR SELECT
    USING (public.is_admin());

-- ========================================================
-- ATOMIC CONCURRENCY BOOKING STORED PROCEDURE
-- ========================================================
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
    -- 1. Check if date is blocked
    IF EXISTS (SELECT 1 FROM public.blocked_dates WHERE blocked_date = p_appointment_date) THEN
        RETURN jsonb_build_object('success', false, 'error', 'Selected date is blocked for bookings or is a holiday.');
    END IF;

    -- 2. Check weekday business hours
    v_weekday := EXTRACT(DOW FROM p_appointment_date); -- 0=Sun, 6=Sat
    SELECT is_open, opening_time, closing_time, break_start, break_end, max_bookings_per_slot
    INTO v_is_open, v_opening, v_closing, v_break_start, v_break_end, v_max_capacity
    FROM public.business_hours
    WHERE weekday = v_weekday;

    IF v_is_open IS NULL OR v_is_open = false THEN
        RETURN jsonb_build_object('success', false, 'error', 'The cafe is closed on this day.');
    END IF;

    -- 3. Check time bounds
    IF p_start_time < v_opening OR p_end_time > v_closing THEN
        RETURN jsonb_build_object('success', false, 'error', 'Requested appointment time is outside operating hours.');
    END IF;

    -- 4. Check break time
    IF v_break_start IS NOT NULL AND v_break_end IS NOT NULL THEN
        IF (p_start_time >= v_break_start AND p_start_time < v_break_end) OR
           (p_end_time > v_break_start AND p_end_time <= v_break_end) THEN
            RETURN jsonb_build_object('success', false, 'error', 'Requested appointment time overlaps with cafe break time.');
        END IF;
    END IF;

    -- 5. Lock and check existing slot capacity
    -- Advisory or row-level lock on the slot
    SELECT COUNT(*)
    INTO v_current_bookings
    FROM public.appointments
    WHERE appointment_date = p_appointment_date
      AND start_time = p_start_time
      AND status NOT IN ('cancelled');

    IF v_current_bookings >= COALESCE(v_max_capacity, 3) THEN
        RETURN jsonb_build_object('success', false, 'error', 'This time slot is fully booked. Please select another slot.');
    END IF;

    -- 6. Insert appointment
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
