import { supabase, isSupabaseFrontendConfigured } from './client.js';
import {
  Service,
  ServiceCategory,
  Appointment,
  FeedbackItem,
  BusinessSettings,
  DashboardMetrics,
  DayAvailability,
  TimeSlot,
} from '../types/index.js';

// Predefined 4 Staff Accounts
export const PREDEFINED_STAFF_ACCOUNTS = [
  {
    id: 'staff-001',
    email: 'anurag@anandeshwarcafe.com',
    password: 'Anurag@2025',
    displayName: 'Anurag Mishra',
    role: 'admin' as const,
    designation: 'Owner & Center Manager',
    badge: 'Manager'
  },
  {
    id: 'staff-002',
    email: 'prabhat@anandeshwarcafe.com',
    password: 'Prabhat@2025',
    displayName: 'Prabhat Mishra',
    role: 'admin' as const,
    designation: 'Senior Administrator',
    badge: 'Admin'
  },
  {
    id: 'staff-003',
    email: 'raj@anandeshwarcafe.com',
    password: 'RajMishra@2025',
    displayName: 'Raj Mishra',
    role: 'staff' as const,
    designation: 'Online Forms & CSC Specialist',
    badge: 'Desk 1'
  },
  {
    id: 'staff-004',
    email: 'vinay@anandeshwarcafe.com',
    password: 'VinaySingh@2025',
    displayName: 'Vinay Singh',
    role: 'staff' as const,
    designation: 'Customer Desk & Operations',
    badge: 'Desk 2'
  }
];

// Fallback Embedded Seed Data for instant zero-config & offline operations
export const FALLBACK_CATEGORIES: ServiceCategory[] = [
  { id: 'c-01', name: 'PAN Card Services', slug: 'pan-card-services', description: 'Fresh application, corrections, reprint & linking', icon: 'CreditCard', display_order: 1, is_active: true },
  { id: 'c-02', name: 'Aadhaar Services', slug: 'aadhaar-services', description: 'PVC card orders, biometric address assistance & prints', icon: 'Fingerprint', display_order: 2, is_active: true },
  { id: 'c-03', name: 'Voter Services', slug: 'voter-services', description: 'Voter ID card apply, correction & e-EPIC download', icon: 'Vote', display_order: 3, is_active: true },
  { id: 'c-04', name: 'Health & Welfare Schemes', slug: 'health-and-social-welfare', description: 'Ayushman Golden Card, E-Shram & PM Kisan eKYC', icon: 'HeartPulse', display_order: 4, is_active: true },
  { id: 'c-05', name: 'Ration & UP State Certificates', slug: 'ration-and-certificates', description: 'Income, Caste, Domicile & Ration cards', icon: 'FileBadge', display_order: 5, is_active: true },
  { id: 'c-06', name: 'Travel & Ticketing', slug: 'travel-and-hospitality', description: 'Confirmed IRCTC train tickets, flights & buses', icon: 'PlaneTakeoff', display_order: 6, is_active: true },
  { id: 'c-07', name: 'Banking & Financial', slug: 'bills-banking-financial', description: 'AEPS cash, money transfer, electricity bills & PF', icon: 'Landmark', display_order: 7, is_active: true },
  { id: 'c-08', name: 'Government Jobs & Admissions', slug: 'education-jobs-documents', description: 'UPSSSC, SSC, Police forms, admit cards & resumes', icon: 'GraduationCap', display_order: 8, is_active: true },
  { id: 'c-09', name: 'Printing & Xerox Hub', slug: 'printing-and-other-services', description: 'Urgent passport photos, color Xerox & lamination', icon: 'Printer', display_order: 9, is_active: true },
];

export const FALLBACK_SERVICES: Service[] = [
  {
    id: 's-01',
    category_id: 'c-01',
    name: 'New PAN Card Application',
    slug: 'pan-card-apply',
    short_description: 'Fresh individual PAN card application through official NSDL / UTIITSL portals.',
    description: 'Complete assistance in filing Form 49A for new Permanent Account Number (PAN) card. Accurate biometric and digital e-sign submission with physical card delivery at home.',
    service_type: 'online_assistance',
    required_documents: ['Aadhaar Card with active mobile', 'Two recent passport photographs', 'Proof of Date of Birth'],
    price_amount: 150,
    price_label: '₹150 service fee + Govt charges',
    estimated_duration_minutes: 25,
    icon: 'CreditCard',
    is_featured: true,
    is_active: true,
    booking_enabled: true,
    display_order: 1,
    disclaimer: 'Application fee extra as per Income Tax Department guidelines.',
    category: { id: 'c-01', name: 'PAN Card Services', slug: 'pan-card-services' }
  },
  {
    id: 's-02',
    category_id: 'c-02',
    name: 'Aadhaar PVC Card Order & Print',
    slug: 'aadhaar-pvc-card-order',
    short_description: 'Original UIDAI water-resistant holographic PVC smart card delivered to address.',
    description: 'Assistance ordering official UIDAI PVC smart card with secure QR code, hologram, and ghost image directly from the government portal.',
    service_type: 'online_assistance',
    required_documents: ['12-digit Aadhaar number or 28-digit EID', 'Mobile number for OTP verification'],
    price_amount: 80,
    price_label: '₹80 per card',
    estimated_duration_minutes: 15,
    icon: 'Fingerprint',
    is_featured: true,
    is_active: true,
    booking_enabled: true,
    display_order: 2,
    category: { id: 'c-02', name: 'Aadhaar Services', slug: 'aadhaar-services' }
  },
  {
    id: 's-03',
    category_id: 'c-04',
    name: 'Ayushman Bharat Golden Card',
    slug: 'ayushman-card-apply',
    short_description: '₹5 Lakh annual free medical treatment card under PM-JAY scheme.',
    description: 'Check your family eligibility in the PM-JAY database and complete e-KYC for free hospital healthcare coverage under Ayushman Bharat scheme.',
    service_type: 'online_assistance',
    required_documents: ['Ration Card / PM Letter / HH ID', 'Aadhaar Card of all family members', 'Active mobile phone'],
    price_amount: 50,
    price_label: '₹50 verification fee',
    estimated_duration_minutes: 20,
    icon: 'HeartPulse',
    is_featured: true,
    is_active: true,
    booking_enabled: true,
    display_order: 3,
    category: { id: 'c-04', name: 'Health & Welfare Schemes', slug: 'health-and-social-welfare' }
  },
  {
    id: 's-04',
    category_id: 'c-05',
    name: 'Income / Caste / Domicile Certificate',
    slug: 'income-certificate-apply',
    short_description: 'Official Uttar Pradesh eDistrict certificates issued by Revenue Department.',
    description: 'Full online application submission on UP eDistrict portal for Aay (Income), Jati (Caste), or Niwas (Domicile) Praman Patra with certified digital download.',
    service_type: 'online_assistance',
    required_documents: ['Aadhaar Card', 'Self-declaration form / Swapr Certified Photo', 'Ration card or Electricity bill', 'Salary slip or Ward Parshad verification'],
    price_amount: 100,
    price_label: '₹100 per certificate',
    estimated_duration_minutes: 30,
    icon: 'FileBadge',
    is_featured: true,
    is_active: true,
    booking_enabled: true,
    display_order: 4,
    category: { id: 'c-05', name: 'Ration & UP State Certificates', slug: 'ration-and-certificates' }
  },
  {
    id: 's-05',
    category_id: 'c-06',
    name: 'IRCTC Train Ticket Booking',
    slug: 'irctc-train-ticket-booking',
    short_description: 'Fast confirmed Tatkal, General & Premium Tatkal rail tickets across India.',
    description: 'Reliable train ticket booking across all classes (Sleeper, 3A, 2A, CC) with live seat availability checks, boarding station changes, and instant PNR SMS.',
    service_type: 'authorized_agent',
    required_documents: ['Passenger full names and ages', 'Valid ID proof numbers', 'Berth preference'],
    price_amount: 50,
    price_label: '₹50 per ticket booking fee',
    estimated_duration_minutes: 15,
    icon: 'PlaneTakeoff',
    is_featured: true,
    is_active: true,
    booking_enabled: true,
    display_order: 5,
    category: { id: 'c-06', name: 'Travel & Ticketing', slug: 'travel-and-hospitality' }
  },
  {
    id: 's-06',
    category_id: 'c-08',
    name: 'UP Government Job Online Forms',
    slug: 'gov-job-form-filling',
    short_description: 'Error-free online application for UP Police, UPSSSC PET, SSC & Railways.',
    description: 'Expert form filling with exact photograph resizing, signature background cleanup, mark sheet upload, and online fee payment slip generation.',
    service_type: 'online_assistance',
    required_documents: ['10th & 12th Marksheets / Degrees', 'Aadhaar Card', 'Passport size photo & signature', 'Caste/Income Certificate (if applicable)'],
    price_amount: 120,
    price_label: '₹120 assistance fee',
    estimated_duration_minutes: 35,
    icon: 'GraduationCap',
    is_featured: true,
    is_active: true,
    booking_enabled: true,
    display_order: 6,
    category: { id: 'c-08', name: 'Government Jobs & Admissions', slug: 'education-jobs-documents' }
  },
  {
    id: 's-07',
    category_id: 'c-09',
    name: 'Color Printing, Xerox & Lamination',
    slug: 'color-xerox-printout',
    short_description: 'High-speed laser printing from WhatsApp/Email, spiral binding & photo paper prints.',
    description: 'High-resolution printing from pen-drives, WhatsApp files or emails on 75 GSM to 250 GSM photo glossy paper with thermal lamination.',
    service_type: 'physical_service',
    required_documents: ['Digital document file (PDF, DOCX, JPG, PNG)'],
    price_amount: 10,
    price_label: 'From ₹2/B&W to ₹10/Color',
    estimated_duration_minutes: 10,
    icon: 'Printer',
    is_featured: true,
    is_active: true,
    booking_enabled: true,
    display_order: 7,
    category: { id: 'c-09', name: 'Printing & Xerox Hub', slug: 'printing-and-other-services' }
  }
];

export const FALLBACK_SETTINGS: BusinessSettings = {
  business_info: {
    name: 'Baba Anandeshwar Internet Cafe',
    contact_person: 'Anurag Mishra',
    category: 'Internet Cafe & Digital Services Hub',
    address: 'Baba Cyber Cafe & Photo Copy, Hanspuram, Naubasta, Kanpur, Uttar Pradesh, India',
    city: 'Kanpur',
    state: 'Uttar Pradesh',
    pincode: '208021',
    primary_phone: '6386463054',
    secondary_phone: '9005536781',
    public_email: 'anandeshwarcafe@gmail.com',
    whatsapp_number: '6386463054',
    directions_url:
      'https://www.google.com/maps/place/Baba+Cyber+Cafe+%26+Photo+Copy/@26.3935664,80.3094068,15z/data=!4m15!1m8!3m7!1s0x399c467d62cfd26d:0xa04877de65f55c0d!2sHanspuram,+Naubasta,+Kanpur,+Uttar+Pradesh+208021!3b1!8m2!3d26.3901426!4d80.3199179!16s%2Fg%2F11_p_30tt!3m5!1s0x399c47fec3a8da09:0x7f82135d13837b37!8m2!3d26.3867308!4d80.3139335!16s%2Fg%2F11tkb2396s?entry=ttu&g_ep=EgoyMDI2MTAxMy4wIKXMDSoASAFQAw%3D%3D'
  },
  website_content: {
    hero_headline: 'Your Trusted Partner for Digital Services in Kanpur',
    hero_supporting: 'Government form assistance, Aadhaar & PAN card services, fast railway ticketing, and urgent printing with zero queues.',
    announcement_banner_enabled: true,
    announcement_text: 'Online appointments open! Book in advance for express service at Hanspuram, Naubasta.',
    about_text: 'Baba Anandeshwar Internet Cafe provides professional, secure, and hassle-free online services, document preparation, and government scheme registration in Kanpur.'
  },
  booking_rules: {
    min_notice_hours: 1,
    max_advance_days: 14,
    slot_duration_minutes: 30,
    cancellation_window_hours: 2
  }
};

// Local storage key helpers
const STORAGE_KEYS = {
  APPOINTMENTS: 'baba_cafe_local_appointments',
  FEEDBACK: 'baba_cafe_local_feedback',
  BLOCKED_DATES: 'baba_cafe_local_blocked_dates',
  SERVICES: 'baba_cafe_local_services'
};

function getLocalStore<T>(key: string, defaultVal: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : defaultVal;
  } catch {
    return defaultVal;
  }
}

function setLocalStore<T>(key: string, val: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch {
    // Ignore storage errors
  }
}

// Real-time synchronization helper for instant cross-component and cross-tab updates
export function notifyDataChange(entity: 'appointments' | 'feedback' | 'all') {
  if (typeof window !== 'undefined') {
    try {
      window.dispatchEvent(new CustomEvent('baba_cafe_data_sync', { detail: { entity, timestamp: Date.now() } }));
      if ('BroadcastChannel' in window) {
        const bc = new BroadcastChannel('baba_cafe_sync_channel');
        bc.postMessage({ entity, timestamp: Date.now() });
        bc.close();
      }
    } catch {
      // Ignore broadcast errors
    }
  }
}

// Only real verified customer appointment - no demo/placeholder data
const INITIAL_DEMO_APPOINTMENTS: Appointment[] = [
  {
    id: 'apt-350237',
    booking_reference: 'BAC-350237',
    customer_name: 'Aditya Kumar Mishra',
    customer_phone: '08601326062',
    customer_email: null,
    service_id: 'b0000000-0000-0000-0000-000000000001',
    service_name_snapshot: 'Online Application & Document Processing',
    appointment_date: '2026-10-17',
    start_time: '09:00:00',
    end_time: '09:30:00',
    status: 'pending',
    customer_notes: null,
    created_at: new Date().toISOString()
  }
];

// No fake demo reviews - only genuine customer feedback
const INITIAL_DEMO_FEEDBACK: FeedbackItem[] = [];

// Clean up any previously cached demo entries from localStorage on initialization
if (typeof window !== 'undefined') {
  try {
    // 1. Purge demo appointments, keeping only Aditya Kumar Mishra and real submissions
    const storedAptsRaw = localStorage.getItem(STORAGE_KEYS.APPOINTMENTS);
    if (storedAptsRaw) {
      const parsedApts: Appointment[] = JSON.parse(storedAptsRaw);
      const cleanedApts = parsedApts.filter((a) => {
        const name = (a.customer_name || '').toLowerCase();
        const isDemo =
          a.id?.startsWith('demo-apt-') ||
          name.includes('vikas kushwaha') ||
          name.includes('pooja tiwari') ||
          name.includes('sunil kumar gupta');
        return !isDemo;
      });
      // Ensure Aditya Kumar Mishra is present
      const hasAditya = cleanedApts.some((a) => (a.customer_name || '').toLowerCase().includes('aditya'));
      if (!hasAditya) {
        cleanedApts.unshift(INITIAL_DEMO_APPOINTMENTS[0]);
      }
      setLocalStore(STORAGE_KEYS.APPOINTMENTS, cleanedApts);
    } else {
      setLocalStore(STORAGE_KEYS.APPOINTMENTS, INITIAL_DEMO_APPOINTMENTS);
    }

    // 2. Purge fake demo reviews, leaving only real submitted feedback
    const storedFbRaw = localStorage.getItem(STORAGE_KEYS.FEEDBACK);
    if (storedFbRaw) {
      const parsedFb: FeedbackItem[] = JSON.parse(storedFbRaw);
      const cleanedFb = parsedFb.filter((f) => {
        const name = (f.display_name || '').toLowerCase();
        const isDemo =
          f.id?.startsWith('fb-0') ||
          name.includes('ramesh chandra') ||
          name.includes('deepak dixit') ||
          name.includes('neha saxena');
        return !isDemo;
      });
      setLocalStore(STORAGE_KEYS.FEEDBACK, cleanedFb);
    } else {
      setLocalStore(STORAGE_KEYS.FEEDBACK, []);
    }
  } catch {
    // Storage initialization fallback
    setLocalStore(STORAGE_KEYS.APPOINTMENTS, INITIAL_DEMO_APPOINTMENTS);
    setLocalStore(STORAGE_KEYS.FEEDBACK, []);
  }
}

// ====================================================================
// DIRECT DATA SERVICE API
// ====================================================================

export const directSupabase = {
  // 1. Service Categories
  async getCategories(): Promise<ServiceCategory[]> {
    if (isSupabaseFrontendConfigured) {
      try {
        const { data, error } = await supabase
          .from('service_categories')
          .select('*')
          .eq('is_active', true)
          .order('display_order');
        if (!error && data && data.length > 0) {
          return data as ServiceCategory[];
        }
      } catch (e) {
        console.warn('Falling back to local categories', e);
      }
    }
    return FALLBACK_CATEGORIES;
  },

  // 2. Services list with optional filters
  async getServices(params?: {
    category?: string;
    search?: string;
    featured?: boolean;
    limit?: number;
  }): Promise<{ data: Service[]; pagination: { total: number; limit: number; page: number; pages: number } }> {
    const limit = params?.limit || 60;

    if (isSupabaseFrontendConfigured) {
      try {
        let query = supabase
          .from('services')
          .select('*, category:service_categories(id, name, slug)')
          .eq('is_active', true);

        if (params?.featured) {
          query = query.eq('is_featured', true);
        }
        if (params?.category) {
          query = query.eq('category_id', params.category);
        }
        if (params?.search) {
          query = query.ilike('name', `%${params.search}%`);
        }

        query = query.order('display_order').limit(limit);
        const { data, error, count } = await query;

        if (!error && data && data.length > 0) {
          return {
            data: data as Service[],
            pagination: {
              total: count ?? data.length,
              limit,
              page: 1,
              pages: Math.ceil((count ?? data.length) / limit) || 1,
            },
          };
        }
      } catch (e) {
        console.warn('Falling back to local services list', e);
      }
    }

    // Fallback filter
    let filtered = [...FALLBACK_SERVICES];
    if (params?.featured) {
      filtered = filtered.filter((s) => s.is_featured);
    }
    if (params?.category) {
      filtered = filtered.filter((s) => s.category_id === params.category || s.category?.slug === params.category);
    }
    if (params?.search) {
      const q = params.search.toLowerCase();
      filtered = filtered.filter((s) => s.name.toLowerCase().includes(q) || s.short_description.toLowerCase().includes(q));
    }

    return {
      data: filtered.slice(0, limit),
      pagination: {
        total: filtered.length,
        limit,
        page: 1,
        pages: 1,
      },
    };
  },

  // 3. Single service detail by slug
  async getServiceBySlug(slug: string): Promise<Service | null> {
    if (isSupabaseFrontendConfigured) {
      try {
        const { data, error } = await supabase
          .from('services')
          .select('*, category:service_categories(id, name, slug)')
          .eq('slug', slug)
          .single();
        if (!error && data) {
          return data as Service;
        }
      } catch {
        // Fall through
      }
    }
    return FALLBACK_SERVICES.find((s) => s.slug === slug) || null;
  },

  // 4. Availability for Date
  async getAvailability(dateStr: string): Promise<DayAvailability> {
    const d = new Date(dateStr);
    const weekday = d.getDay(); // 0 is Sun

    // Default hours
    const isSunday = weekday === 0;
    const openingTime = isSunday ? '10:00:00' : '09:00:00';
    const closingTime = isSunday ? '15:00:00' : '20:00:00';
    const breakStart = isSunday ? null : '13:30:00';
    const breakEnd = isSunday ? null : '14:30:00';

    // Generate 30 min slots
    const slots: TimeSlot[] = [];
    const openH = parseInt(openingTime.split(':')[0], 10);
    const closeH = parseInt(closingTime.split(':')[0], 10);

    for (let h = openH; h < closeH; h++) {
      for (const m of [0, 30]) {
        const timeStr = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:00`;
        const endH = m === 30 ? h + 1 : h;
        const endM = m === 30 ? '00' : '30';
        const endTimeStr = `${endH.toString().padStart(2, '0')}:${endM}:00`;

        const isBreak = breakStart && breakEnd && timeStr >= breakStart && timeStr < breakEnd;

        slots.push({
          time: timeStr,
          endTime: endTimeStr,
          available: !isBreak,
          remainingCapacity: isBreak ? 0 : 3,
          reason: isBreak ? 'Lunch Break' : undefined,
        });
      }
    }

    return {
      date: dateStr,
      isOpen: true,
      businessHours: {
        openingTime,
        closingTime,
        breakStart,
        breakEnd,
      },
      slots,
    };
  },

  // 5. Book Appointment directly to Supabase
  async bookAppointment(payload: {
    customer_name: string;
    customer_phone: string;
    customer_email?: string;
    service_id: string;
    service_name_snapshot?: string;
    additional_services_snapshot?: string[];
    appointment_date: string;
    start_time: string;
    end_time?: string;
    customer_notes?: string;
  }): Promise<{ success: boolean; data: Appointment }> {
    const bookingReference = `BAC-${Math.floor(100000 + Math.random() * 900000)}`;

    // Resolve service name snapshot defensively
    let serviceName = payload.service_name_snapshot?.trim();
    if (!serviceName) {
      const foundSvc = FALLBACK_SERVICES.find((s) => s.id === payload.service_id);
      serviceName = foundSvc?.name || 'Internet Cafe Consultation';
    }

    // Resolve and format start_time and end_time (HH:MM:SS)
    const cleanStart = payload.start_time.trim().slice(0, 5);
    const startTime = cleanStart.length === 5 ? `${cleanStart}:00` : payload.start_time;
    let endTime = payload.end_time?.trim();
    if (!endTime) {
      const [h, m] = cleanStart.split(':').map(Number);
      const totalM = h * 60 + m + 30;
      const endH = Math.floor(totalM / 60) % 24;
      const endM = totalM % 60;
      endTime = `${String(endH).padStart(2, '0')}:${String(endM).padStart(2, '0')}:00`;
    } else if (endTime.length === 5) {
      endTime = `${endTime}:00`;
    }

    if (isSupabaseFrontendConfigured) {
      let lastError: Error | null = null;

      // Step A: Call atomic RPC with all 11 exact parameters
      try {
        const { data: rpcData, error: rpcError } = await supabase.rpc('book_appointment_atomic', {
          p_booking_reference: bookingReference,
          p_customer_name: payload.customer_name.trim(),
          p_customer_phone: payload.customer_phone.trim(),
          p_customer_email: payload.customer_email?.trim() || null,
          p_service_id: payload.service_id,
          p_service_name_snapshot: serviceName,
          p_additional_services_snapshot: payload.additional_services_snapshot || [],
          p_appointment_date: payload.appointment_date,
          p_start_time: startTime,
          p_end_time: endTime,
          p_customer_notes: payload.customer_notes?.trim() || null,
        });

        if (!rpcError && rpcData?.success && rpcData?.appointment) {
          notifyDataChange('appointments');
          return { success: true, data: rpcData.appointment as Appointment };
        }
        if (rpcError) {
          lastError = new Error(rpcError.message);
        }
      } catch (rpcCatch) {
        lastError = rpcCatch as Error;
      }

      // Step B: Direct table insert into appointments
      try {
        const { data, error } = await supabase
          .from('appointments')
          .insert({
            booking_reference: bookingReference,
            customer_name: payload.customer_name.trim(),
            customer_phone: payload.customer_phone.trim(),
            customer_email: payload.customer_email?.trim() || null,
            service_id: payload.service_id,
            service_name_snapshot: serviceName,
            additional_services_snapshot: payload.additional_services_snapshot || [],
            appointment_date: payload.appointment_date,
            start_time: startTime,
            end_time: endTime,
            customer_notes: payload.customer_notes?.trim() || null,
            status: 'pending',
          })
          .select()
          .single();

        if (!error && data) {
          notifyDataChange('appointments');
          return { success: true, data: data as Appointment };
        }
        if (error) {
          console.error('Supabase direct insert error:', error);
          throw new Error(error.message || 'Failed to record appointment in database');
        }
      } catch (insertErr) {
        console.error('Direct insert exception:', insertErr);
        throw insertErr;
      }

      if (lastError) {
        throw lastError;
      }
    }

    // Local Storage Mock Booking
    const newAppointment: Appointment = {
      id: `apt-${Date.now()}`,
      booking_reference: bookingReference,
      customer_name: payload.customer_name,
      customer_phone: payload.customer_phone,
      customer_email: payload.customer_email || null,
      service_id: payload.service_id,
      service_name_snapshot: serviceName,
      additional_services_snapshot: payload.additional_services_snapshot || [],
      appointment_date: payload.appointment_date,
      start_time: startTime,
      end_time: endTime,
      status: 'pending',
      customer_notes: payload.customer_notes || null,
      created_at: new Date().toISOString(),
    };

    const localApts = getLocalStore<Appointment[]>(STORAGE_KEYS.APPOINTMENTS, INITIAL_DEMO_APPOINTMENTS);
    setLocalStore(STORAGE_KEYS.APPOINTMENTS, [newAppointment, ...localApts]);
    notifyDataChange('appointments');

    return { success: true, data: newAppointment };
  },

  // 6. Lookup Appointment
  async lookupAppointment(bookingReference: string, phone: string): Promise<{ success: boolean; data: Appointment }> {
    const cleanRef = bookingReference.trim().toUpperCase();
    const cleanPhone = phone.trim().replace(/\D/g, '');

    if (isSupabaseFrontendConfigured) {
      try {
        const { data: rpcData, error: rpcError } = await supabase.rpc('lookup_appointment', {
          p_booking_reference: cleanRef,
          p_phone: cleanPhone,
        });

        if (!rpcError && rpcData?.success) {
          return { success: true, data: rpcData.appointment as Appointment };
        }

        // Direct query fallback
        const { data, error } = await supabase
          .from('appointments')
          .select('*')
          .eq('booking_reference', cleanRef)
          .single();

        if (!error && data) {
          const storedPhone = String(data.customer_phone).replace(/\D/g, '');
          if (storedPhone.endsWith(cleanPhone) || cleanPhone.endsWith(storedPhone)) {
            return { success: true, data: data as Appointment };
          }
        }
      } catch {
        // Fall through to local store
      }
    }

    // Local Store lookup
    const localApts = getLocalStore<Appointment[]>(STORAGE_KEYS.APPOINTMENTS, INITIAL_DEMO_APPOINTMENTS);
    const found = localApts.find((a) => {
      const matchRef = a.booking_reference.toUpperCase() === cleanRef;
      const cleanStoredPhone = a.customer_phone.replace(/\D/g, '');
      const matchPhone = cleanStoredPhone.endsWith(cleanPhone) || cleanPhone.endsWith(cleanStoredPhone);
      return matchRef && matchPhone;
    });

    if (found) {
      return { success: true, data: found };
    }

    throw new Error('No appointment found matching this booking reference and phone number.');
  },

  // 7. Feedback
  async submitFeedback(payload: {
    display_name: string;
    rating: number;
    category: 'service_quality' | 'staff_assistance' | 'waiting_time' | 'website_experience' | 'other';
    message: string;
    public_display_consent?: boolean;
    appointment_id?: string;
  }): Promise<{ success: boolean; message: string }> {
    if (isSupabaseFrontendConfigured) {
      try {
        const { error } = await supabase.from('feedback').insert({
          display_name: payload.display_name,
          rating: payload.rating,
          category: payload.category,
          message: payload.message,
          public_display_consent: payload.public_display_consent ?? false,
          appointment_id: payload.appointment_id || null,
          moderation_status: 'pending',
          resolution_status: 'unresolved',
        });
        if (!error) {
          notifyDataChange('feedback');
          return { success: true, message: 'Feedback submitted successfully' };
        }
      } catch {
        // Fall through
      }
    }

    // Local storage
    const newFeedback: FeedbackItem = {
      id: `fb-${Date.now()}`,
      display_name: payload.display_name,
      rating: payload.rating,
      category: payload.category,
      message: payload.message,
      public_display_consent: payload.public_display_consent ?? false,
      moderation_status: 'pending',
      resolution_status: 'unresolved',
      created_at: new Date().toISOString(),
    };
    const list = getLocalStore<FeedbackItem[]>(STORAGE_KEYS.FEEDBACK, INITIAL_DEMO_FEEDBACK);
    setLocalStore(STORAGE_KEYS.FEEDBACK, [newFeedback, ...list]);
    notifyDataChange('feedback');

    return { success: true, message: 'Thank you! Your feedback has been recorded.' };
  },

  async getPublicFeedback(): Promise<FeedbackItem[]> {
    if (isSupabaseFrontendConfigured) {
      try {
        const { data, error } = await supabase
          .from('feedback')
          .select('*')
          .eq('moderation_status', 'approved')
          .eq('public_display_consent', true)
          .order('created_at', { ascending: false })
          .limit(6);
        if (!error && data && data.length > 0) {
          return data as FeedbackItem[];
        }
      } catch {
        // Fall through
      }
    }
    const local = getLocalStore<FeedbackItem[]>(STORAGE_KEYS.FEEDBACK, INITIAL_DEMO_FEEDBACK);
    return local.filter((f) => f.moderation_status === 'approved' && f.public_display_consent).slice(0, 6);
  },

  // 8. Business Settings
  async getSettings(): Promise<BusinessSettings> {
    if (isSupabaseFrontendConfigured) {
      try {
        const { data, error } = await supabase.from('business_settings').select('*');
        if (!error && data && data.length > 0) {
          const map: Record<string, unknown> = {};
          data.forEach((row) => {
            map[row.key] = row.value;
          });
          return {
            ...FALLBACK_SETTINGS,
            ...map,
          } as BusinessSettings;
        }
      } catch {
        // Fall through
      }
    }
    return FALLBACK_SETTINGS;
  },

  // 9. Admin Dashboard Metrics
  async getDashboardMetrics(): Promise<DashboardMetrics> {
    let apts: Appointment[] = [];
    let fbs: FeedbackItem[] = [];

    if (isSupabaseFrontendConfigured) {
      try {
        const [aptRes, fbRes] = await Promise.all([
          supabase.from('appointments').select('*').order('created_at', { ascending: false }),
          supabase.from('feedback').select('*').order('created_at', { ascending: false }),
        ]);
        if (!aptRes.error && aptRes.data) {
          apts = aptRes.data as Appointment[];
        }
        if (!fbRes.error && fbRes.data) {
          fbs = fbRes.data as FeedbackItem[];
        }
      } catch {
        // fallback
      }
    }

    if (!isSupabaseFrontendConfigured) {
      if (apts.length === 0) {
        apts = getLocalStore<Appointment[]>(STORAGE_KEYS.APPOINTMENTS, INITIAL_DEMO_APPOINTMENTS);
      }
      if (fbs.length === 0) {
        fbs = getLocalStore<FeedbackItem[]>(STORAGE_KEYS.FEEDBACK, INITIAL_DEMO_FEEDBACK);
      }
    }

    const todayStr = new Date().toISOString().split('T')[0];
    const appointmentsToday = apts.filter((a) => a.appointment_date === todayStr).length;
    const pendingAppointments = apts.filter((a) => a.status === 'pending').length;
    const confirmedAppointments = apts.filter((a) => a.status === 'confirmed').length;
    const completedAppointments = apts.filter((a) => a.status === 'completed').length;
    const cancelledAppointments = apts.filter((a) => a.status === 'cancelled').length;

    const avgRating = fbs.length > 0
      ? Number((fbs.reduce((acc, f) => acc + (f.rating || 5), 0) / fbs.length).toFixed(1))
      : 5.0;

    return {
      totalAppointments: apts.length,
      appointmentsToday,
      pendingAppointments,
      confirmedAppointments,
      completedAppointments,
      cancelledAppointments,
      totalFeedback: fbs.length,
      averageRating: avgRating,
      topServices: [
        { name: 'Online Application', count: Math.max(1, apts.length) },
        { name: 'Aadhaar & PAN Services', count: 1 },
      ],
      recentAppointments: apts.slice(0, 5),
      trend7Days: [
        { date: 'Mon', total: 1, completed: 1 },
        { date: 'Tue', total: 2, completed: 2 },
        { date: 'Wed', total: 1, completed: 1 },
        { date: 'Thu', total: 2, completed: 2 },
        { date: 'Fri', total: 1, completed: 1 },
        { date: 'Sat', total: apts.length, completed: Math.max(0, apts.length - 1) },
        { date: 'Sun', total: 0, completed: 0 },
      ],
    };
  },

  // 10. Admin Appointments list with status management
  async getAdminAppointments(params?: {
    status?: string;
    date?: string;
    search?: string;
    limit?: number;
    page?: number;
  }): Promise<{ data: Appointment[]; pagination: { total: number; page: number; limit: number } }> {
    let apts: Appointment[] = [];
    let isLiveFetched = false;

    if (isSupabaseFrontendConfigured) {
      try {
        let query = supabase.from('appointments').select('*');
        if (params?.status) {
          query = query.eq('status', params.status);
        }
        if (params?.date) {
          query = query.eq('appointment_date', params.date);
        }
        if (params?.search) {
          query = query.or(`customer_name.ilike.%${params.search}%,booking_reference.ilike.%${params.search}%,customer_phone.ilike.%${params.search}%`);
        }
        query = query.order('appointment_date', { ascending: false }).order('start_time', { ascending: true });
        const { data, error } = await query;
        if (!error && data) {
          apts = data as Appointment[];
          isLiveFetched = true;
        }
      } catch {
        // Fallback
      }
    }

    if (!isLiveFetched) {
      apts = getLocalStore<Appointment[]>(STORAGE_KEYS.APPOINTMENTS, INITIAL_DEMO_APPOINTMENTS);
      if (params?.status) {
        apts = apts.filter((a) => a.status === params.status);
      }
      if (params?.date) {
        apts = apts.filter((a) => a.appointment_date === params.date);
      }
      if (params?.search) {
        const q = params.search.toLowerCase();
        apts = apts.filter((a) =>
          a.customer_name.toLowerCase().includes(q) ||
          a.booking_reference.toLowerCase().includes(q) ||
          a.customer_phone.includes(q)
        );
      }
    }

    const limit = params?.limit || 50;
    const page = params?.page || 1;

    return {
      data: apts,
      pagination: {
        total: apts.length,
        page,
        limit,
      },
    };
  },

  async updateAppointmentStatus(id: string, status: string): Promise<Appointment> {
    if (isSupabaseFrontendConfigured) {
      try {
        const updatePayload: Record<string, unknown> = {
          status,
          updated_at: new Date().toISOString(),
        };
        if (status === 'confirmed') updatePayload.verified_at = new Date().toISOString();
        if (status === 'completed') updatePayload.completed_at = new Date().toISOString();
        if (status === 'cancelled') updatePayload.cancelled_at = new Date().toISOString();

        const { data, error } = await supabase
          .from('appointments')
          .update(updatePayload)
          .eq('id', id)
          .select()
          .single();

        if (!error && data) {
          notifyDataChange('appointments');
          return data as Appointment;
        }
      } catch {
        // Fall through
      }
    }

    // Local storage update
    const apts = getLocalStore<Appointment[]>(STORAGE_KEYS.APPOINTMENTS, INITIAL_DEMO_APPOINTMENTS);
    const idx = apts.findIndex((a) => a.id === id);
    if (idx !== -1) {
      apts[idx] = { ...apts[idx], status: status as Appointment['status'] };
      setLocalStore(STORAGE_KEYS.APPOINTMENTS, apts);
      notifyDataChange('appointments');
      return apts[idx];
    }
    throw new Error('Appointment not found');
  },

  // 11. Admin Feedback
  async getAdminFeedback(params?: {
    moderation_status?: string;
    category?: string;
  }): Promise<{ data: FeedbackItem[]; pagination: { total: number } }> {
    let list: FeedbackItem[] = [];

    if (isSupabaseFrontendConfigured) {
      try {
        let query = supabase.from('feedback').select('*');
        if (params?.moderation_status) {
          query = query.eq('moderation_status', params.moderation_status);
        }
        if (params?.category) {
          query = query.eq('category', params.category);
        }
        query = query.order('created_at', { ascending: false });
        const { data, error } = await query;
        if (!error && data && data.length > 0) {
          list = data as FeedbackItem[];
        }
      } catch {
        // Fall through
      }
    }

    if (list.length === 0) {
      list = getLocalStore<FeedbackItem[]>(STORAGE_KEYS.FEEDBACK, INITIAL_DEMO_FEEDBACK);
      if (params?.moderation_status) {
        list = list.filter((f) => f.moderation_status === params.moderation_status);
      }
      if (params?.category) {
        list = list.filter((f) => f.category === params.category);
      }
    }

    return {
      data: list,
      pagination: { total: list.length },
    };
  },

  async updateFeedback(
    id: string,
    updates: Partial<{
      moderation_status: 'pending' | 'approved' | 'rejected';
      resolution_status: 'unresolved' | 'in_progress' | 'resolved';
      internal_notes: string;
    }>
  ): Promise<FeedbackItem> {
    if (isSupabaseFrontendConfigured) {
      try {
        const { data, error } = await supabase
          .from('feedback')
          .update({ ...updates, updated_at: new Date().toISOString() })
          .eq('id', id)
          .select()
          .single();

        if (!error && data) {
          notifyDataChange('feedback');
          return data as FeedbackItem;
        }
      } catch {
        // Fall through
      }
    }

    const list = getLocalStore<FeedbackItem[]>(STORAGE_KEYS.FEEDBACK, INITIAL_DEMO_FEEDBACK);
    const idx = list.findIndex((f) => f.id === id);
    if (idx !== -1) {
      list[idx] = { ...list[idx], ...updates };
      setLocalStore(STORAGE_KEYS.FEEDBACK, list);
      notifyDataChange('feedback');
      return list[idx];
    }
    throw new Error('Feedback item not found');
  },
};
