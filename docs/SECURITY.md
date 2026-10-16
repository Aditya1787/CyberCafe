# Security & Data Protection Specification
## Baba Anandeshwar Internet Cafe

### 1. Threat Model & Key Protections

#### 1.1 Secret Isolation (Server-Only Keys)
- `SUPABASE_SERVICE_ROLE_KEY` is restricted exclusively to the Express backend runtime (`apps/api`).
- Frontend (`apps/web`) bundles only receive public configuration prefixed with `VITE_` (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_API_BASE_URL`).
- All administrative mutations are verified on the server; the client-side state is never trusted.

#### 1.2 Authentication & Authorization Boundary
- Supabase Auth handles password hashing and issuing cryptographically signed JWT tokens.
- On protected endpoints (`/api/admin/*`), the `requireAdmin` Express middleware:
  1. Verifies the Bearer JWT with Supabase.
  2. Queries the `public.profiles` table for `id = user.id`.
  3. Enforces `role = 'admin'` and `is_active = true`.
  4. Records the action in `audit_logs`.

#### 1.3 Abuse Prevention & Rate Limiting
- Appointment booking: Strict IP rate limit (10 bookings / hour).
- Status lookup: Rate limited to 20 lookups / 15 minutes to prevent enumeration.
- Feedback submission: Limited to 5 submissions / hour.

#### 1.4 Protection Against Enumerable IDs
- Sequential primary keys are never displayed to customers.
- External reference codes use cryptographically secure random bytes: `BAC-YYYYMMDD-XXXXXX`.
- The status lookup API requires **two verification factors**:
  1. The non-guessable booking reference.
  2. The exact 10-digit customer mobile number registered during booking.
- Customer phone numbers returned in lookups are masked (`XXXXXX1234`).

#### 1.5 No Sensitive Document Storage
- No identity documents (Aadhaar cards, PAN cards, voter cards) or biometrics are ever uploaded or stored in Supabase Storage.
- Physical documents are verified in person at the cafe desk in Kanpur.
