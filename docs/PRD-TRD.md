# Product & Technical Requirements Document (PRD & TRD)
## Baba Anandeshwar Internet Cafe — Digital Platform

### 1. Product Overview
Baba Anandeshwar Internet Cafe is a digital storefront, appointment booking platform, and administrative management system for the cyber cafe located at Hanspuram, Naubasta, Kanpur, Uttar Pradesh, India (Operator: Anurag Mishra).

The platform enables citizens to discover all 50 catalogued services across 9 categories, understand required documentation checklists, reserve guaranteed time slots, look up appointment progress securely, and submit verified feedback. An authenticated administration panel empowers the proprietor to manage services, appointments, customer feedback, operating hours, and business content without modifying code.

---

### 2. Architecture & Tech Stack

```
+-------------------------------------------------------------+
|                      React 18 Frontend                      |
| (Vite, TypeScript, Tailwind CSS, TanStack Query, Three.js)  |
+------------------------------+------------------------------+
                               |
                   REST API    |   Supabase Auth Session
             (Axios / fetch)   |   (Bearer JWT)
                               v
+-------------------------------------------------------------+
|                     Node.js Express API                     |
|  (TypeScript, Helmet, CORS, Rate Limiters, Zod Schemas)    |
+------------------------------+------------------------------+
                               |
                               | Supabase JS SDK
                               v
+-------------------------------------------------------------+
|                 Supabase PostgreSQL & Auth                  |
| (Row Level Security, book_appointment_atomic stored proc)   |
+-------------------------------------------------------------+
```

---

### 3. Core Functional Requirements
1. **50 Distinct Services**: Full coverage of Categories A through I (PAN, Aadhaar assistance, Voter ID, Ayushman, UP e-District, Travel reservations, KESCo bills, AEPS banking, Resume/Jobs, Printing & Xerox).
2. **Real-time Availability Engine**: Generates 30-minute booking intervals adhering to business hours (Mon-Sat 09:00-20:00, Sun 10:00-15:00), lunch breaks (13:30-14:30), slot concurrency limits, and holiday closures.
3. **Atomic Concurrency Control**: Slot capacity is protected via database transaction / PostgreSQL stored procedure (`book_appointment_atomic`), preventing double booking.
4. **Non-Enumerable Reference Codes**: Generates cryptographic format `BAC-YYYYMMDD-XXXXXX`. Status lookup requires matching the registered 10-digit mobile number as a second verification factor.
5. **Customer Feedback Moderation**: Customers submit 1-5 star reviews with optional public consent. Reviews are held in `pending` moderation before display. Internal administrative notes are protected from public exposure.
6. **Privacy-by-Design**: No Aadhaar numbers, PAN numbers, OTPs, or passwords are ever requested or stored on the platform. Physical document review occurs in person.
