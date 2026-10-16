import { Router } from 'express';
import { requireAdmin } from '../middleware/auth.js';
import { bookingLimiter, feedbackLimiter, lookupLimiter } from '../middleware/rateLimiter.js';

import * as servicesCtrl from '../modules/services/services.controller.js';
import * as availabilityCtrl from '../modules/availability/availability.controller.js';
import * as appointmentsCtrl from '../modules/appointments/appointments.controller.js';
import * as feedbackCtrl from '../modules/feedback/feedback.controller.js';
import * as adminCtrl from '../modules/admin/admin.controller.js';
import * as settingsCtrl from '../modules/settings/settings.controller.js';

const router = Router();

// ==========================================
// 1. Health Endpoint
// ==========================================
router.get('/health', (_req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'Baba Anandeshwar Internet Cafe API',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
  });
});

// ==========================================
// 2. Public Settings
// ==========================================
router.get('/settings', settingsCtrl.getPublicSettings);

// ==========================================
// 3. Services Endpoints
// ==========================================
router.get('/service-categories', servicesCtrl.getCategories);
router.get('/services', servicesCtrl.getServices);
router.get('/services/:slug', servicesCtrl.getServiceBySlug);

// ==========================================
// 4. Availability Endpoints
// ==========================================
router.get('/availability', availabilityCtrl.getAvailability);

// ==========================================
// 5. Appointments Endpoints
// ==========================================
router.post('/appointments', bookingLimiter, appointmentsCtrl.createAppointment);
router.post('/appointments/lookup', lookupLimiter, appointmentsCtrl.lookupAppointment);

// ==========================================
// 6. Feedback Endpoints
// ==========================================
router.post('/feedback', feedbackLimiter, feedbackCtrl.submitFeedback);
router.get('/feedback/public', feedbackCtrl.getPublicApprovedFeedback);

// ==========================================
// 7. Protected Admin Endpoints
// ==========================================
router.use('/admin', requireAdmin);

// Admin Dashboard & Audit
router.get('/admin/dashboard', adminCtrl.getDashboardOverview);
router.get('/admin/audit-logs', adminCtrl.getAuditLogs);

// Admin Services Management
router.get('/admin/services', servicesCtrl.getAllServicesAdmin);
router.post('/admin/services', servicesCtrl.createServiceAdmin);
router.patch('/admin/services/:id', servicesCtrl.updateServiceAdmin);
router.delete('/admin/services/:id', servicesCtrl.deleteServiceAdmin);

// Admin Appointments Management
router.get('/admin/appointments/export', appointmentsCtrl.exportAppointmentsCSV);
router.get('/admin/appointments', appointmentsCtrl.getAdminAppointments);
router.get('/admin/appointments/:id', appointmentsCtrl.getAdminAppointmentById);
router.patch('/admin/appointments/:id/status', appointmentsCtrl.updateAppointmentStatusAdmin);
router.post('/admin/appointments/:id/cancel', appointmentsCtrl.cancelAppointmentAdmin);

// Admin Feedback Moderation
router.get('/admin/feedback', feedbackCtrl.getAdminFeedback);
router.patch('/admin/feedback/:id', feedbackCtrl.updateFeedbackModeration);
router.patch('/admin/feedback/:id/notes', feedbackCtrl.updateFeedbackNotes);
router.delete('/admin/feedback/:id', feedbackCtrl.deleteFeedbackAdmin);

// Admin Availability & Hours
router.get('/admin/availability/hours', availabilityCtrl.getBusinessHoursAdmin);
router.patch('/admin/availability/hours/:weekday', availabilityCtrl.updateBusinessHoursAdmin);
router.get('/admin/availability/blocked-dates', availabilityCtrl.getBlockedDatesAdmin);
router.post('/admin/availability/blocked-dates', availabilityCtrl.createBlockedDateAdmin);
router.delete('/admin/availability/blocked-dates/:id', availabilityCtrl.deleteBlockedDateAdmin);

// Admin Settings
router.get('/admin/settings', settingsCtrl.getAllSettingsAdmin);
router.patch('/admin/settings/:key', settingsCtrl.updateSettingAdmin);

export default router;
