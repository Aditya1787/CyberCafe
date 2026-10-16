# REST API Documentation
## Baba Anandeshwar Internet Cafe API

Base URL: `http://localhost:4000/api` (Production: `/api`)

### Response Conventions
```json
// Success Response
{
  "data": { ... },
  "meta": { "page": 1, "limit": 20, "total": 50, "totalPages": 3 }
}

// Error Response
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request data",
    "details": [ ... ]
  }
}
```

---

### Endpoints

#### 1. System Health & Public Settings
- `GET /api/health`: Returns service health status and timestamp.
- `GET /api/settings`: Returns public business details, hero text, and hours.

#### 2. Services Catalogue
- `GET /api/service-categories`: Lists all active service categories.
- `GET /api/services`: Paginated, searchable, filterable service directory.
  - Query parameters:
    - `search`: Service name, keyword, or description.
    - `category`: Category slug.
    - `featured`: `'true'` or `'false'`.
    - `sort`: `'order'`, `'name_asc'`, `'name_desc'`, `'newest'`.
    - `page`, `limit`.
- `GET /api/services/:slug`: Returns detailed specification for a single active service.

#### 3. Real-Time Availability
- `GET /api/availability?date=YYYY-MM-DD`:
  Returns open status, operating hours, lunch break, and computed 30-minute time slots with remaining capacities and availability flags.

#### 4. Appointments
- `POST /api/appointments`:
  - Rate limit: 10 per hour.
  - Payload:
    ```json
    {
      "customer_name": "Ramesh Kumar",
      "customer_phone": "9876543210",
      "customer_email": "ramesh@example.com",
      "service_id": "UUID",
      "appointment_date": "2025-05-10",
      "start_time": "10:30",
      "customer_notes": "Urgent application",
      "consent": true
    }
    ```
  - Response (201 Created):
    Returns sanitized booking summary with `booking_reference`.
- `POST /api/appointments/lookup`:
  - Rate limit: 20 per 15 minutes.
  - Payload: `{ "booking_reference": "BAC-...", "customer_phone": "9876543210" }`
  - Returns appointment status, masked phone, scheduled date and time.

#### 5. Feedback
- `POST /api/feedback`: Submit 1-5 star review with optional public consent.
- `GET /api/feedback/public`: Returns approved feedback where `public_display_consent = true`.

#### 6. Protected Administrative Endpoints (`Authorization: Bearer <token>`)
- `GET /api/admin/dashboard`: Live DB aggregates (total appointments, today's visits, 7-day trend, top services, ratings).
- `GET /api/admin/services`: Full list of services including inactive/archived.
- `POST /api/admin/services`: Add a service.
- `PATCH /api/admin/services/:id`: Edit service details, price, duration, documents checklist.
- `DELETE /api/admin/services/:id`: Soft deactivate service.
- `GET /api/admin/appointments`: Search, filter by status and date, paginated appointments list.
- `GET /api/admin/appointments/:id`: Full appointment details.
- `PATCH /api/admin/appointments/:id/status`: Update status (`confirmed`, `completed`, `cancelled`, `no_show`).
- `GET /api/admin/appointments/export`: Downloads permitted appointment records as CSV.
- `GET /api/admin/feedback`: List all reviews for moderation.
- `PATCH /api/admin/feedback/:id`: Moderate public display status (`approved`, `rejected`).
- `PATCH /api/admin/feedback/:id/notes`: Save private internal staff notes.
- `GET /api/admin/availability/hours`: View business hours per weekday.
- `PATCH /api/admin/availability/hours/:weekday`: Update operating hours, break, and slot capacity.
- `POST /api/admin/availability/blocked-dates`: Add holiday or closure date.
- `DELETE /api/admin/availability/blocked-dates/:id`: Remove blocked date.
- `PATCH /api/admin/settings/:key`: Update business identity or content settings.
- `GET /api/admin/audit-logs`: Audit trail of administrative modifications.
