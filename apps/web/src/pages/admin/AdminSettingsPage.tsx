import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Sliders, Save, Building, Globe, ShieldCheck } from 'lucide-react';
import { apiRequest } from '../../api/client.js';
import { BusinessSettings } from '../../types/index.js';
import { Button } from '../../components/common/Button.js';
import { Input } from '../../components/common/Input.js';
import { useToast } from '../../context/ToastContext.js';

export const AdminSettingsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const toast = useToast();

  const { data, isLoading } = useQuery<{ data: BusinessSettings }>({
    queryKey: ['admin-settings'],
    queryFn: () => apiRequest('/admin/settings'),
  });

  const settings = data?.data;

  // Business Info State
  const [businessName, setBusinessName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [address, setAddress] = useState('');
  const [primaryPhone, setPrimaryPhone] = useState('');
  const [secondaryPhone, setSecondaryPhone] = useState('');
  const [publicEmail, setPublicEmail] = useState('');
  const [directionsUrl, setDirectionsUrl] = useState('');

  // Website Content State
  const [heroHeadline, setHeroHeadline] = useState('');
  const [heroSupporting, setHeroSupporting] = useState('');
  const [announcementText, setAnnouncementText] = useState('');
  const [announcementEnabled, setAnnouncementEnabled] = useState(true);

  // Booking Rules State
  const [minNoticeHours, setMinNoticeHours] = useState('1');
  const [maxAdvanceDays, setMaxAdvanceDays] = useState('14');

  useEffect(() => {
    if (settings) {
      if (settings.business_info) {
        setBusinessName(settings.business_info.name || '');
        setContactPerson(settings.business_info.contact_person || '');
        setAddress(settings.business_info.address || '');
        setPrimaryPhone(settings.business_info.primary_phone || '');
        setSecondaryPhone(settings.business_info.secondary_phone || '');
        setPublicEmail(settings.business_info.public_email || '');
        setDirectionsUrl(settings.business_info.directions_url || '');
      }
      if (settings.website_content) {
        setHeroHeadline(settings.website_content.hero_headline || '');
        setHeroSupporting(settings.website_content.hero_supporting || '');
        setAnnouncementText(settings.website_content.announcement_text || '');
        setAnnouncementEnabled(settings.website_content.announcement_banner_enabled ?? true);
      }
      if (settings.booking_rules) {
        setMinNoticeHours(String(settings.booking_rules.min_notice_hours || 1));
        setMaxAdvanceDays(String(settings.booking_rules.max_advance_days || 14));
      }
    }
  }, [settings]);

  const updateSettingMutation = useMutation({
    mutationFn: ({ key, value }: { key: string; value: Record<string, unknown> }) =>
      apiRequest(`/admin/settings/${key}`, {
        method: 'PATCH',
        body: JSON.stringify(value),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-settings'] });
      queryClient.invalidateQueries({ queryKey: ['settings'] });
      toast.success('Settings saved successfully');
    },
    onError: (err: Error) => {
      toast.error('Failed to save settings', err.message);
    },
  });

  const saveBusinessInfo = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettingMutation.mutate({
      key: 'business_info',
      value: {
        name: businessName,
        contact_person: contactPerson,
        address,
        primary_phone: primaryPhone,
        secondary_phone: secondaryPhone,
        public_email: publicEmail,
        directions_url: directionsUrl,
      },
    });
  };

  const saveWebsiteContent = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettingMutation.mutate({
      key: 'website_content',
      value: {
        hero_headline: heroHeadline,
        hero_supporting: heroSupporting,
        announcement_banner_enabled: announcementEnabled,
        announcement_text: announcementText,
      },
    });
  };

  const saveBookingRules = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettingMutation.mutate({
      key: 'booking_rules',
      value: {
        min_notice_hours: parseInt(minNoticeHours, 10),
        max_advance_days: parseInt(maxAdvanceDays, 10),
        slot_duration_minutes: 30,
        cancellation_window_hours: 2,
      },
    });
  };

  if (isLoading) {
    return <div className="text-gray-400 py-12 text-center text-xs">Loading business settings...</div>;
  }

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-navy-dark tracking-tight">
          Business & Website Settings
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
          Update business identity, contact numbers, website hero messages, and advance reservation policies.
        </p>
      </div>

      {/* 1. Business Identity Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-6">
        <div className="flex items-center gap-2 pb-4 border-b border-gray-100">
          <Building className="w-5 h-5 text-brand-navy" />
          <h2 className="text-lg font-bold text-gray-900">Business Identity & Contact Details</h2>
        </div>

        <form onSubmit={saveBusinessInfo} className="space-y-4 text-xs sm:text-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Business Name"
              required
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
            />
            <Input
              label="Proprietor / Contact Person"
              required
              value={contactPerson}
              onChange={(e) => setContactPerson(e.target.value)}
            />
          </div>

          <Input
            label="Physical Address"
            required
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Primary Phone Number"
              required
              value={primaryPhone}
              onChange={(e) => setPrimaryPhone(e.target.value)}
            />
            <Input
              label="Secondary Phone Number"
              value={secondaryPhone}
              onChange={(e) => setSecondaryPhone(e.target.value)}
            />
            <Input
              label="Public Email"
              type="email"
              value={publicEmail}
              onChange={(e) => setPublicEmail(e.target.value)}
            />
          </div>

          <Input
            label="Google Maps Directions URL"
            value={directionsUrl}
            onChange={(e) => setDirectionsUrl(e.target.value)}
          />

          <div className="pt-2 flex justify-end">
            <Button variant="primary" size="sm" type="submit" isLoading={updateSettingMutation.isPending} leftIcon={<Save className="w-4 h-4" />}>
              Save Business Details
            </Button>
          </div>
        </form>
      </div>

      {/* 2. Website Content Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-6">
        <div className="flex items-center gap-2 pb-4 border-b border-gray-100">
          <Globe className="w-5 h-5 text-brand-teal" />
          <h2 className="text-lg font-bold text-gray-900">Home Page Content & Announcement Banner</h2>
        </div>

        <form onSubmit={saveWebsiteContent} className="space-y-4 text-xs sm:text-sm">
          <Input
            label="Hero Headline"
            required
            value={heroHeadline}
            onChange={(e) => setHeroHeadline(e.target.value)}
          />

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Hero Supporting Paragraph
            </label>
            <textarea
              rows={3}
              value={heroSupporting}
              onChange={(e) => setHeroSupporting(e.target.value)}
              className="w-full rounded-xl border border-gray-200 p-2.5 text-xs focus:ring-2 focus:ring-brand-teal/30"
            />
          </div>

          <div className="pt-2 border-t border-gray-100 space-y-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={announcementEnabled}
                onChange={(e) => setAnnouncementEnabled(e.target.checked)}
                className="rounded text-brand-teal"
              />
              <span className="font-semibold text-xs text-gray-800">Show Top Announcement Banner</span>
            </label>

            {announcementEnabled && (
              <Input
                label="Announcement Message"
                value={announcementText}
                onChange={(e) => setAnnouncementText(e.target.value)}
              />
            )}
          </div>

          <div className="pt-2 flex justify-end">
            <Button variant="secondary" size="sm" type="submit" isLoading={updateSettingMutation.isPending} leftIcon={<Save className="w-4 h-4" />}>
              Save Content Updates
            </Button>
          </div>
        </form>
      </div>

      {/* 3. Booking Rules Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-6">
        <div className="flex items-center gap-2 pb-4 border-b border-gray-100">
          <Sliders className="w-5 h-5 text-brand-gold" />
          <h2 className="text-lg font-bold text-gray-900">Appointment Booking Rules</h2>
        </div>

        <form onSubmit={saveBookingRules} className="space-y-4 text-xs sm:text-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Minimum Notice (Hours)"
              type="number"
              min="0"
              max="24"
              value={minNoticeHours}
              onChange={(e) => setMinNoticeHours(e.target.value)}
              helperText="Slots within this lead time are blocked for today"
            />
            <Input
              label="Maximum Advance Booking Period (Days)"
              type="number"
              min="1"
              max="60"
              value={maxAdvanceDays}
              onChange={(e) => setMaxAdvanceDays(e.target.value)}
              helperText="How far into the future customers can book"
            />
          </div>

          <div className="pt-2 flex justify-end">
            <Button variant="primary" size="sm" type="submit" isLoading={updateSettingMutation.isPending} leftIcon={<Save className="w-4 h-4" />}>
              Save Booking Rules
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
