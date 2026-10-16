import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  CheckCircle,
  XCircle,
  Star,
  Layers,
  ExternalLink,
} from 'lucide-react';
import { apiRequest } from '../../api/client.js';
import { Service, ServiceCategory } from '../../types/index.js';
import { Button } from '../../components/common/Button.js';
import { Input } from '../../components/common/Input.js';
import { Badge } from '../../components/common/Badge.js';
import { Modal } from '../../components/common/Modal.js';
import { useToast } from '../../context/ToastContext.js';

export const AdminServicesPage: React.FC = () => {
  const queryClient = useQueryClient();
  const toast = useToast();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [shortDesc, setShortDesc] = useState('');
  const [description, setDescription] = useState('');
  const [serviceType, setServiceType] = useState<'online_assistance' | 'physical_service' | 'authorized_agent' | 'mixed'>('online_assistance');
  const [docsInput, setDocsInput] = useState('');
  const [instructions, setInstructions] = useState('');
  const [providerName, setProviderName] = useState('');
  const [officialUrl, setOfficialUrl] = useState('');
  const [priceAmount, setPriceAmount] = useState<string>('');
  const [priceLabel, setPriceLabel] = useState('');
  const [duration, setDuration] = useState<string>('20');
  const [isFeatured, setIsFeatured] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [bookingEnabled, setBookingEnabled] = useState(true);
  const [displayOrder, setDisplayOrder] = useState<number>(0);

  // Fetch all categories
  const { data: categoriesData } = useQuery<{ data: ServiceCategory[] }>({
    queryKey: ['categories'],
    queryFn: () => apiRequest('/service-categories'),
  });

  const categories = categoriesData?.data || [];

  // Fetch admin services
  const { data: servicesData, isLoading } = useQuery<{ data: Service[] }>({
    queryKey: ['admin-services'],
    queryFn: () => apiRequest('/admin/services'),
  });

  const allServices = servicesData?.data || [];

  const openCreateModal = () => {
    setEditingService(null);
    setName('');
    setSlug('');
    setCategoryId(categories[0]?.id || '');
    setShortDesc('');
    setDescription('');
    setServiceType('online_assistance');
    setDocsInput('Aadhaar Card, Passport photo');
    setInstructions('');
    setProviderName('');
    setOfficialUrl('');
    setPriceAmount('100');
    setPriceLabel('Service assistance fee');
    setDuration('20');
    setIsFeatured(false);
    setIsActive(true);
    setBookingEnabled(true);
    setDisplayOrder(0);
    setIsModalOpen(true);
  };

  const openEditModal = (svc: Service) => {
    setEditingService(svc);
    setName(svc.name);
    setSlug(svc.slug);
    setCategoryId(svc.category_id);
    setShortDesc(svc.short_description);
    setDescription(svc.description);
    setServiceType(svc.service_type || 'online_assistance');
    setDocsInput((svc.required_documents || []).join(', '));
    setInstructions(svc.instructions || '');
    setProviderName(svc.provider_name || '');
    setOfficialUrl(svc.official_url || '');
    setPriceAmount(svc.price_amount !== null && svc.price_amount !== undefined ? String(svc.price_amount) : '');
    setPriceLabel(svc.price_label || '');
    setDuration(svc.estimated_duration_minutes ? String(svc.estimated_duration_minutes) : '');
    setIsFeatured(svc.is_featured);
    setIsActive(svc.is_active);
    setBookingEnabled(svc.booking_enabled);
    setDisplayOrder(svc.display_order || 0);
    setIsModalOpen(true);
  };

  // Create/Update Mutation
  const saveMutation = useMutation({
    mutationFn: (payload: Record<string, unknown>) => {
      if (editingService) {
        return apiRequest(`/admin/services/${editingService.id}`, {
          method: 'PATCH',
          body: JSON.stringify(payload),
        });
      } else {
        return apiRequest('/admin/services', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-services'] });
      queryClient.invalidateQueries({ queryKey: ['services'] });
      toast.success(editingService ? 'Service updated successfully' : 'New service created successfully');
      setIsModalOpen(false);
    },
    onError: (err: Error) => {
      toast.error('Save failed', err.message);
    },
  });

  // Soft Deactivate Mutation
  const deactivateMutation = useMutation({
    mutationFn: (id: string) =>
      apiRequest(`/admin/services/${id}`, {
        method: 'DELETE',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-services'] });
      queryClient.invalidateQueries({ queryKey: ['services'] });
      toast.success('Service archived/deactivated successfully');
    },
    onError: (err: Error) => {
      toast.error('Deactivation failed', err.message);
    },
  });

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const docs = docsInput
      .split(',')
      .map((d) => d.trim())
      .filter(Boolean);

    saveMutation.mutate({
      name,
      slug: slug.toLowerCase().replace(/[^a-z0-9-]/g, '-'),
      category_id: categoryId,
      short_description: shortDesc,
      description,
      service_type: serviceType,
      required_documents: docs,
      instructions: instructions || null,
      provider_name: providerName || null,
      official_url: officialUrl || null,
      price_amount: priceAmount ? parseFloat(priceAmount) : null,
      price_label: priceLabel || null,
      estimated_duration_minutes: duration ? parseInt(duration, 10) : null,
      is_featured: isFeatured,
      is_active: isActive,
      booking_enabled: bookingEnabled,
      display_order: Number(displayOrder) || 0,
    });
  };

  // Filter services
  const filteredServices = allServices.filter((s) => {
    const matchesSearch = !search || s.name.toLowerCase().includes(search.toLowerCase()) || s.slug.includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || s.category_id === selectedCategory || s.category?.slug === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-navy-dark tracking-tight">
            Services Catalogue
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Total {allServices.length} registered services across {categories.length} categories
          </p>
        </div>

        <Button variant="secondary" size="sm" onClick={openCreateModal} leftIcon={<Plus className="w-4 h-4" />}>
          Add New Service
        </Button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search service name or slug..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50 rounded-xl text-xs border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-teal/30 focus:border-brand-teal"
          />
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full md:w-auto bg-gray-50 border border-gray-200 text-xs rounded-xl px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-brand-teal/30"
        >
          <option value="all">All Categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      {/* Services Table */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50/70 border-b border-gray-100 text-gray-500 uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3.5 px-4">Order</th>
                <th className="py-3.5 px-4">Service Name</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Fee</th>
                <th className="py-3.5 px-4">Booking</th>
                <th className="py-3.5 px-4">Featured</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-gray-400">Loading catalogue...</td>
                </tr>
              ) : filteredServices.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-gray-400">No services match the criteria.</td>
                </tr>
              ) : (
                filteredServices.map((svc) => (
                  <tr key={svc.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-3.5 px-4 text-gray-400 font-mono">
                      #{svc.display_order}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-gray-900">
                      <div>{svc.name}</div>
                      <span className="text-[10px] text-gray-400 font-mono">{svc.slug}</span>
                    </td>
                    <td className="py-3.5 px-4 text-gray-600">
                      {svc.category?.name || 'Uncategorized'}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-gray-800">
                      {svc.price_amount !== null && svc.price_amount !== undefined ? `₹${svc.price_amount}` : '—'}
                    </td>
                    <td className="py-3.5 px-4">
                      {svc.booking_enabled ? (
                        <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-medium">Enabled</span>
                      ) : (
                        <span className="text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">Disabled</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      {svc.is_featured ? (
                        <span className="text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full font-medium flex items-center gap-1 w-max">
                          <Star className="w-3 h-3 fill-amber-500 text-amber-500" /> Featured
                        </span>
                      ) : (
                        <span className="text-gray-400">No</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      {svc.is_active ? (
                        <Badge variant="success">Active</Badge>
                      ) : (
                        <Badge variant="cancelled">Archived</Badge>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openEditModal(svc)}
                          className="p-1.5 rounded-lg text-gray-500 hover:text-brand-navy hover:bg-gray-100 transition-colors"
                          title="Edit Service"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        {svc.is_active && (
                          <button
                            onClick={() => {
                              if (window.confirm(`Deactivate '${svc.name}'? Existing appointments will remain preserved.`)) {
                                deactivateMutation.mutate(svc.id);
                              }
                            }}
                            className="p-1.5 rounded-lg text-gray-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                            title="Soft Deactivate Service"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Service Modal */}
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={editingService ? `Edit Service: ${editingService.name}` : 'Add New Service to Catalogue'}
          maxWidth="xl"
        >
          <form onSubmit={handleFormSubmit} className="space-y-4 text-xs sm:text-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="Service Name"
                required
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (!editingService) {
                    setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
                  }
                }}
              />
              <Input
                label="URL Slug"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                helperText="Unique identifier in URLs"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Category <span className="text-rose-500">*</span>
                </label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs focus:ring-2 focus:ring-brand-teal/30"
                  required
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Service Type <span className="text-rose-500">*</span>
                </label>
                <select
                  value={serviceType}
                  onChange={(e) => setServiceType(e.target.value as typeof serviceType)}
                  className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs focus:ring-2 focus:ring-brand-teal/30"
                >
                  <option value="online_assistance">Online Assistance</option>
                  <option value="physical_service">Physical Service (Printing/Xerox)</option>
                  <option value="authorized_agent">Authorized Agent Service</option>
                  <option value="mixed">Mixed</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Short Description <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={2}
                required
                value={shortDesc}
                onChange={(e) => setShortDesc(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-white p-2.5 text-xs focus:ring-2 focus:ring-brand-teal/30"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Detailed Description <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={3}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-white p-2.5 text-xs focus:ring-2 focus:ring-brand-teal/30"
              />
            </div>

            <div>
              <Input
                label="Required Documents (comma-separated list)"
                value={docsInput}
                onChange={(e) => setDocsInput(e.target.value)}
                placeholder="Aadhaar Card, 2 Passport Photos, 10th Marksheet"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Input
                label="Assistance Fee (₹)"
                type="number"
                min="0"
                step="1"
                value={priceAmount}
                onChange={(e) => setPriceAmount(e.target.value)}
              />
              <Input
                label="Price Label"
                value={priceLabel}
                onChange={(e) => setPriceLabel(e.target.value)}
                placeholder="per application"
              />
              <Input
                label="Duration (minutes)"
                type="number"
                min="5"
                max="360"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="Official Source / Provider Name"
                value={providerName}
                onChange={(e) => setProviderName(e.target.value)}
                placeholder="e.g. NSDL / UIDAI / ECI"
              />
              <Input
                label="Official Portal URL (optional)"
                type="url"
                value={officialUrl}
                onChange={(e) => setOfficialUrl(e.target.value)}
                placeholder="https://..."
              />
            </div>

            {/* Checkboxes: Featured, Booking Enabled, Active */}
            <div className="pt-2 border-t border-gray-100 flex flex-wrap gap-4 text-xs">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="rounded text-brand-teal"
                />
                <span>Featured on Home Page</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={bookingEnabled}
                  onChange={(e) => setBookingEnabled(e.target.checked)}
                  className="rounded text-brand-teal"
                />
                <span>Enable Appointment Booking</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="rounded text-brand-teal"
                />
                <span>Active in Public Directory</span>
              </label>
            </div>

            <div className="pt-4 border-t border-gray-100 flex justify-end gap-2">
              <Button variant="ghost" size="sm" type="button" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="secondary" size="sm" type="submit" isLoading={saveMutation.isPending}>
                Save Service
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
