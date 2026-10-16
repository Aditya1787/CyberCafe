import React from 'react';
import { Routes, Route, Outlet, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from './api/client.js';
import { BusinessSettings } from './types/index.js';

// Layout Components
import { Navbar } from './components/layout/Navbar.js';
import { Footer } from './components/layout/Footer.js';
import { AnnouncementBanner } from './components/layout/AnnouncementBanner.js';
import { AdminLayout } from './components/layout/AdminLayout.js';
import { MobileBottomNav } from './components/layout/MobileBottomNav.js';

// Public Pages
import { HomePage } from './pages/HomePage.js';
import { ServicesPage } from './pages/ServicesPage.js';
import { ServiceDetailPage } from './pages/ServiceDetailPage.js';
import { BookAppointmentPage } from './pages/BookAppointmentPage.js';
import { AppointmentStatusPage } from './pages/AppointmentStatusPage.js';
import { FeedbackPage } from './pages/FeedbackPage.js';
import { AboutPage } from './pages/AboutPage.js';
import { ContactPage } from './pages/ContactPage.js';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage.js';
import { TermsPage } from './pages/TermsPage.js';
import { NotFoundPage } from './pages/NotFoundPage.js';

// Admin Pages
import { AdminLoginPage } from './pages/admin/AdminLoginPage.js';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage.js';
import { AdminAppointmentsPage } from './pages/admin/AdminAppointmentsPage.js';
import { AdminServicesPage } from './pages/admin/AdminServicesPage.js';
import { AdminFeedbackPage } from './pages/admin/AdminFeedbackPage.js';
import { AdminAvailabilityPage } from './pages/admin/AdminAvailabilityPage.js';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage.js';

// Customer Layout Wrapper
const CustomerLayout: React.FC = () => {
  const { data } = useQuery<{ data: BusinessSettings }>({
    queryKey: ['settings'],
    queryFn: () => apiRequest('/settings'),
    staleTime: 5 * 60 * 1000,
  });

  const bannerText = data?.data?.website_content?.announcement_text;
  const bannerEnabled = data?.data?.website_content?.announcement_banner_enabled ?? true;

  return (
    <div className="flex flex-col min-h-screen pb-16 sm:pb-0 bg-[#e9eef6] dark:bg-[#0b111e] text-slate-800 dark:text-slate-100 transition-colors duration-200">
      <AnnouncementBanner text={bannerText} enabled={bannerEnabled} />
      <Navbar />
      <div className="flex-1">
        <Outlet />
      </div>
      <Footer />
      <MobileBottomNav />
    </div>
  );
};

export const App: React.FC = () => {
  const location = useLocation();

  // Scroll to top on route change
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <Routes>
      {/* Customer Facing Routes */}
      <Route element={<CustomerLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/services/:slug" element={<ServiceDetailPage />} />
        <Route path="/book-appointment" element={<BookAppointmentPage />} />
        <Route path="/appointment-status" element={<AppointmentStatusPage />} />
        <Route path="/feedback" element={<FeedbackPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>

      {/* Admin Authentication */}
      <Route path="/admin/login" element={<AdminLoginPage />} />

      {/* Protected Admin Routes */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboardPage />} />
        <Route path="appointments" element={<AdminAppointmentsPage />} />
        <Route path="services" element={<AdminServicesPage />} />
        <Route path="feedback" element={<AdminFeedbackPage />} />
        <Route path="availability" element={<AdminAvailabilityPage />} />
        <Route path="settings" element={<AdminSettingsPage />} />
      </Route>
    </Routes>
  );
};

export default App;
