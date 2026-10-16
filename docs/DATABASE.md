# Database Architecture & Security Policies
## Baba Anandeshwar Internet Cafe

### 1. Database Schema Overview

PostgreSQL schema running on Supabase with Row Level Security (RLS) enabled on all public tables.

#### Table Definitions:
1. **`profiles`**
   - `id`: UUID primary key references `auth.users(id)` ON DELETE CASCADE
   - `display_name`: TEXT
   - `role`: TEXT CHECK `role IN ('admin', 'staff')`
   - `is_active`: BOOLEAN DEFAULT true
   - `created_at`, `updated_at`: TIMESTAMPTZ

2. **`service_categories`**
   - `id`: UUID primary key
   - `name`: TEXT NOT NULL
   - `slug`: TEXT UNIQUE NOT NULL
   - `description`: TEXT
   - `icon`: TEXT
   - `display_order`: INTEGER DEFAULT 0
   - `is_active`: BOOLEAN DEFAULT true

3. **`services`**
   - `id`: UUID primary key
   - `category_id`: UUID REFERENCES `service_categories(id)`
   - `name`, `slug`: TEXT UNIQUE
   - `short_description`, `description`: TEXT
   - `service_type`: TEXT CHECK `service_type IN ('online_assistance', 'physical_service', 'authorized_agent', 'mixed')`
   - `required_documents`: JSONB ARRAY
   - `instructions`: TEXT
   - `provider_name`, `official_url`: TEXT
   - `price_amount`: NUMERIC(10,2)
   - `price_label`: TEXT
   - `estimated_duration_minutes`: INTEGER
   - `is_featured`, `is_active`, `booking_enabled`: BOOLEAN
   - `display_order`: INTEGER
   - `disclaimer`: TEXT

4. **`appointments`**
   - `id`: UUID primary key
   - `booking_reference`: TEXT UNIQUE (e.g. `BAC-YYYYMMDD-XXXXXX`)
   - `customer_name`: TEXT
   - `customer_phone`: TEXT (10-digit normalized)
   - `customer_email`: TEXT
   - `service_id`: UUID REFERENCES `services(id)` ON DELETE SET NULL
   - `service_name_snapshot`: TEXT (preserves historical accuracy if service renamed)
   - `additional_services_snapshot`: JSONB
   - `appointment_date`: DATE
   - `start_time`, `end_time`: TIME
   - `timezone`: TEXT DEFAULT 'Asia/Kolkata'
   - `customer_notes`: TEXT
   - `status`: TEXT CHECK `status IN ('pending', 'confirmed', 'completed', 'cancelled', 'no_show')`
   - `verified_at`, `cancelled_at`, `completed_at`: TIMESTAMPTZ

5. **`business_hours`**
   - `id`: UUID primary key
   - `weekday`: INTEGER UNIQUE (0=Sun, 1=Mon ... 6=Sat)
   - `is_open`: BOOLEAN
   - `opening_time`, `closing_time`: TIME
   - `break_start`, `break_end`: TIME
   - `slot_duration_minutes`: INTEGER DEFAULT 30
   - `max_bookings_per_slot`: INTEGER DEFAULT 3

6. **`blocked_dates`**
   - `id`: UUID primary key
   - `blocked_date`: DATE UNIQUE
   - `reason`: TEXT

7. **`feedback`**
   - `id`: UUID primary key
   - `display_name`: TEXT
   - `appointment_id`: UUID REFERENCES `appointments(id)` ON DELETE SET NULL
   - `rating`: INTEGER CHECK `rating BETWEEN 1 AND 5`
   - `category`: TEXT CHECK `category IN ('service_quality', 'staff_assistance', 'waiting_time', 'website_experience', 'other')`
   - `message`: TEXT
   - `public_display_consent`: BOOLEAN
   - `moderation_status`: TEXT CHECK `moderation_status IN ('pending', 'approved', 'rejected')`
   - `resolution_status`: TEXT CHECK `resolution_status IN ('unresolved', 'in_progress', 'resolved')`
   - `internal_notes`: TEXT (never exposed publicly)

8. **`business_settings`**
   - `id`: UUID primary key
   - `key`: TEXT UNIQUE
   - `value`: JSONB
   - `is_public`: BOOLEAN

9. **`audit_logs`**
   - `id`: UUID primary key
   - `actor_user_id`: UUID REFERENCES `auth.users(id)`
   - `action`: TEXT
   - `entity_type`: TEXT
   - `entity_id`: TEXT
   - `safe_metadata`: JSONB

---

### 2. Atomic Slot Concurrency Logic
The PostgreSQL stored procedure `public.book_appointment_atomic`:
1. Validates `appointment_date` is not in `blocked_dates`.
2. Validates `business_hours` for requested weekday (`is_open = true`).
3. Ensures `start_time` and `end_time` fall inside opening/closing bounds and outside lunch break.
4. Performs a row-level count lock on `appointments` for that slot.
5. Rejects with `409 Conflict` if existing non-cancelled bookings >= `max_bookings_per_slot`.
6. Inserts the appointment atomically and returns the committed record.
