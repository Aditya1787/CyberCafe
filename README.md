# Baba Anandeshwar Internet Cafe
### Complete Digital Front, Appointment Platform & Administration Dashboard

A modern, responsive, production-oriented website and booking platform for **Baba Anandeshwar Internet Cafe**, located in **Hanspuram, Naubasta, Kanpur, Uttar Pradesh, India** (Proprietor: Anurag Mishra).

Built with **React 18**, **TypeScript**, **Node.js / Express**, and **Supabase (PostgreSQL & Auth)**.

---

## 🌟 Key Features

- **Complete 50 Services Catalogue**:
  Full directory across 9 categories (PAN Card, Aadhaar assistance, Voter ID, Ayushman, E-Shram, UP e-District, Train/Flight tickets, KESCo bills, AEPS Banking, Resumes, and Printing).
- **Interactive 3D Hero Scene**:
  Built with Three.js, React Three Fiber, and Drei, featuring floating digital service cards, laptop model, and particles, with a smooth CSS/SVG fallback for reduced-motion and unsupported devices.
- **Smart Appointment Booking Engine**:
  Real-time slot availability adhering to business hours (Mon–Sat 09:00–20:00, Sun 10:00–15:00), lunch break exclusions (13:30–14:30), slot capacity enforcement, and holiday closures.
- **Atomic Concurrency Control**:
  PostgreSQL stored procedure `book_appointment_atomic` prevents double booking and race conditions.
- **Cryptographic Booking References**:
  Generates non-guessable format `BAC-YYYYMMDD-XXXXXX`. Status lookup requires matching the registered 10-digit mobile number as an additional security factor.
- **Customer Feedback & Moderation**:
  1-to-5 star rating system with customer display consent. Administrator approval is required before public display.
- **Protected Administrator Dashboard**:
  Supabase Auth session handling with role verification (`profiles.role = 'admin'`). Live aggregated statistics, appointment management (confirm, complete, cancel, no-show), full service CRUD, feedback moderation, business hours & capacity controls, and CSV export.
- **Privacy-by-Design**:
  Strictly avoids collecting Aadhaar numbers, PAN numbers, OTPs, or passwords. Clear statutory disclaimers for government services.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, TypeScript, Vite, Tailwind CSS, TanStack Query, React Router v6, Lucide Icons, Framer Motion, Three.js (@react-three/fiber & @react-three/drei) |
| **Backend** | Node.js, Express, TypeScript, Zod Schema Validation, Helmet, CORS, Express Rate Limit, Morgan |
| **Database & Auth** | Supabase Managed PostgreSQL, Row Level Security (RLS) Policies, Supabase Auth |
| **Testing** | Vitest, Supertest |

---

## 📁 Repository Structure

```
.
├── apps/
│   ├── api/                     # Node.js + Express REST API
│   │   ├── src/
│   │   │   ├── config/          # Environment & Supabase client providers
│   │   │   ├── middleware/      # Auth (JWT + Admin profile check), Rate limiting, Errors
│   │   │   ├── modules/         # Services, Availability, Appointments, Feedback, Admin, Settings
│   │   │   ├── routes/          # API router
│   │   │   ├── utils/           # Reference generator, Phone normalizer
│   │   │   ├── tests/           # Unit & API integration tests
│   │   │   ├── app.ts           # Express application setup
│   │   │   └── server.ts        # Server entry point
│   │   └── package.json
│   └── web/                     # React + Vite Frontend
│       ├── src/
│       │   ├── api/             # API client & Supabase client
│       │   ├── components/      # Common UI, Layout (Navbar, Footer, Admin), 3D Hero
│       │   ├── context/         # AuthContext & ToastContext
│       │   ├── pages/           # Public & Admin route components
│       │   ├── types/           # Shared TypeScript interfaces
│       │   ├── App.tsx          # Client routing
│       │   └── main.tsx         # Root mounting
│       └── package.json
├── supabase/
│   ├── migrations/              # Version-controlled SQL schema & RLS policies
│   ├── seed.sql                 # Complete 50 services, categories & default business data
│   └── config.toml              # Local Supabase configuration
├── docs/
│   ├── PRD-TRD.md               # Product & Technical Requirements
│   ├── DATABASE.md              # Database schemas, RLS, stored procedures
│   ├── API.md                   # Complete REST endpoints documentation
│   ├── SECURITY.md              # Threat model & secret handling
│   └── DEPLOYMENT.md            # Production deployment guide
├── .env.example
├── package.json                 # Monorepo workspaces
└── README.md
```

---

## 🚀 Quickstart & Local Setup

### 1. Prerequisites
- Node.js v18+ (tested on Node v24)
- npm v9+

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Variables Configuration
Copy the `.env.example` file to create your environment configuration:
```bash
cp .env.example .env
```
Populate the Supabase project credentials in `.env`:
```env
# Frontend Configuration
VITE_SUPABASE_URL=https://<your-project-id>.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_API_BASE_URL=http://localhost:4000/api

# Backend Configuration
PORT=4000
NODE_ENV=development
FRONTEND_ORIGIN=http://localhost:5173
SUPABASE_URL=https://<your-project-id>.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
BOOKING_LOOKUP_PEPPER=your_secure_random_lookup_pepper_string
```

### 4. Database Setup & Seed
1. In your Supabase Dashboard, open the **SQL Editor**.
2. Run `supabase/migrations/20250101000000_initial_schema.sql` to create all tables and RLS policies.
3. Run `supabase/seed.sql` to populate all 50 services, categories, default business hours, and settings.

### 5. Provision the Initial Administrator
1. In the Supabase Dashboard, navigate to **Authentication -> Users -> Add User**.
2. Create the user with email `anandeshwarcafe@gmail.com` and a strong password.
3. Copy the newly generated User UUID (`id`).
4. Execute in the Supabase SQL Editor:
   ```sql
   INSERT INTO public.profiles (id, display_name, role, is_active)
   VALUES ('<COPIED_USER_UUID>', 'Anurag Mishra', 'admin', true)
   ON CONFLICT (id) DO UPDATE SET role = 'admin', is_active = true;
   ```

### 6. Run the Application
In development mode (runs backend API on port 4000 and frontend on port 5173 with hot reload):
```bash
# Start both API and Web concurrently
npm run dev

# Or start individually:
npm run dev:api    # http://localhost:4000
npm run dev:web    # http://localhost:5173
```

---

## 🧪 Testing & Verification

Run the automated test suite across unit and integration tests:
```bash
npm run test
```
Run TypeScript type-checks:
```bash
npm run typecheck
```
Build the production bundles:
```bash
npm run build
```

---

## 🛡️ External Integrations Status

| Service Integration | Status | Notes |
|---|---|---|
| **Supabase PostgreSQL & RLS** | Fully Implemented | Schema, RLS policies, atomic booking stored procedure, seed script. |
| **Supabase Authentication** | Fully Implemented | Bearer JWT validation, admin profile role verification, protected router. |
| **Availability & Atomic Slots** | Fully Implemented | Real-time calculation engine with lunch breaks and capacity enforcement. |
| **Email Notifications** | Configurable | Hooks in place for transactional email via SMTP/Resend API. |
| **WhatsApp Notifications** | Future Expansion Ready | Configurable setting; avoids unauthorized personal account automation. |

---

## 🏢 Business Identity & Contact

- **Business Name**: Baba Anandeshwar Internet Cafe
- **Operator**: Anurag Mishra
- **Address**: Hanspuram, Naubasta, Kanpur, Uttar Pradesh — 208021
- **Phones**: 6386463054 / 9005536781
- **Email**: anandeshwarcafe@gmail.com
- **Operating Hours**: Mon–Sat: 09:00 AM – 08:00 PM \| Sun: 10:00 AM – 03:00 PM
