export interface ServiceCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  display_order: number;
  is_active: boolean;
}

export interface Service {
  id: string;
  category_id: string;
  name: string;
  slug: string;
  short_description: string;
  description: string;
  service_type: 'online_assistance' | 'physical_service' | 'authorized_agent' | 'mixed';
  required_documents: string[];
  instructions?: string | null;
  provider_name?: string | null;
  official_url?: string | null;
  price_amount?: number | null;
  price_label?: string | null;
  estimated_duration_minutes?: number | null;
  icon?: string | null;
  is_featured: boolean;
  is_active: boolean;
  booking_enabled: boolean;
  display_order: number;
  disclaimer?: string | null;
  category?: {
    id: string;
    name: string;
    slug: string;
  };
}

export interface TimeSlot {
  time: string;
  endTime: string;
  available: boolean;
  remainingCapacity: number;
  reason?: string;
}

export interface DayAvailability {
  date: string;
  isOpen: boolean;
  reason?: string;
  businessHours?: {
    openingTime: string;
    closingTime: string;
    breakStart?: string | null;
    breakEnd?: string | null;
  };
  slots: TimeSlot[];
}

export interface Appointment {
  id: string;
  booking_reference: string;
  customer_name: string;
  customer_phone: string;
  customer_email?: string | null;
  service_id: string;
  service_name_snapshot: string;
  additional_services_snapshot?: string[];
  appointment_date: string;
  start_time: string;
  end_time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no_show';
  customer_notes?: string | null;
  created_at: string;
  service?: Service;
}

export interface FeedbackItem {
  id: string;
  display_name: string;
  rating: number;
  category: 'service_quality' | 'staff_assistance' | 'waiting_time' | 'website_experience' | 'other';
  message: string;
  public_display_consent?: boolean;
  moderation_status?: 'pending' | 'approved' | 'rejected';
  resolution_status?: 'unresolved' | 'in_progress' | 'resolved';
  internal_notes?: string | null;
  created_at: string;
}

export interface BusinessSettings {
  business_info: {
    name: string;
    contact_person: string;
    category: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    primary_phone: string;
    secondary_phone: string;
    public_email: string;
    whatsapp_number?: string;
    directions_url: string;
  };
  website_content: {
    hero_headline: string;
    hero_supporting: string;
    announcement_banner_enabled: boolean;
    announcement_text: string;
    about_text: string;
  };
  booking_rules: {
    min_notice_hours: number;
    max_advance_days: number;
    slot_duration_minutes: number;
    cancellation_window_hours: number;
  };
}

export interface DashboardMetrics {
  totalAppointments: number;
  appointmentsToday: number;
  pendingAppointments: number;
  confirmedAppointments: number;
  completedAppointments: number;
  cancelledAppointments: number;
  totalFeedback: number;
  averageRating: number;
  topServices: { name: string; count: number }[];
  recentAppointments: Appointment[];
  trend7Days: { date: string; total: number; completed: number }[];
}
