import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  MessageSquareQuote,
  Star,
  CheckCircle,
  XCircle,
  Eye,
  Trash2,
  Lock,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { apiRequest, supabase, isSupabaseFrontendConfigured } from '../../api/client.js';
import { FeedbackItem } from '../../types/index.js';
import { Button } from '../../components/common/Button.js';
import { Badge } from '../../components/common/Badge.js';
import { Modal } from '../../components/common/Modal.js';
import { useToast } from '../../context/ToastContext.js';

export const AdminFeedbackPage: React.FC = () => {
  const queryClient = useQueryClient();
  const toast = useToast();

  const [ratingFilter, setRatingFilter] = useState('all');
  const [moderationFilter, setModerationFilter] = useState('all');
  const [page, setPage] = useState(1);

  const [selectedReview, setSelectedReview] = useState<FeedbackItem | null>(null);
  const [internalNotes, setInternalNotes] = useState('');

  // Real-time synchronization for feedback
  useEffect(() => {
    // 1. In-window & broadcast sync
    const handleSync = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (!customEvent.detail || customEvent.detail.entity === 'feedback' || customEvent.detail.entity === 'all') {
        queryClient.invalidateQueries({ queryKey: ['admin-feedback'] });
      }
    };
    window.addEventListener('baba_cafe_data_sync', handleSync);

    let bc: BroadcastChannel | null = null;
    try {
      if ('BroadcastChannel' in window) {
        bc = new BroadcastChannel('baba_cafe_sync_channel');
        bc.onmessage = (msg) => {
          if (msg.data?.entity === 'feedback' || msg.data?.entity === 'all') {
            queryClient.invalidateQueries({ queryKey: ['admin-feedback'] });
          }
        };
      }
    } catch {
      // Ignore
    }

    // 2. Supabase Realtime channel
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let channel: any = null;
    if (isSupabaseFrontendConfigured) {
      try {
        channel = supabase
          .channel('realtime_admin_feedback')
          .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'feedback' },
            () => {
              queryClient.invalidateQueries({ queryKey: ['admin-feedback'] });
            }
          )
          .subscribe();
      } catch {
        // Ignore
      }
    }

    return () => {
      window.removeEventListener('baba_cafe_data_sync', handleSync);
      if (bc) bc.close();
      if (channel) supabase.removeChannel(channel);
    };
  }, [queryClient]);

  const { data, isLoading } = useQuery<{ data: FeedbackItem[]; meta: { total: number; totalPages: number } }>({
    queryKey: ['admin-feedback', ratingFilter, moderationFilter, page],
    queryFn: () => {
      const params = new URLSearchParams();
      if (ratingFilter !== 'all') params.set('rating', ratingFilter);
      if (moderationFilter !== 'all') params.set('moderation_status', moderationFilter);
      params.set('page', String(page));
      params.set('limit', '15');
      return apiRequest(`/admin/feedback?${params.toString()}`);
    },
    refetchInterval: 3000, // Live real-time polling every 3 seconds
  });

  const feedbackList = data?.data || [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rawMeta = data?.meta || (data as any)?.pagination;
  const totalPages = rawMeta?.totalPages || Math.ceil((rawMeta?.total || feedbackList.length) / 15) || 1;
  const totalCount = rawMeta?.total ?? feedbackList.length;

  // Moderate Status Mutation
  const moderateMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: 'approved' | 'rejected' }) =>
      apiRequest(`/admin/feedback/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ moderation_status: status }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-feedback'] });
      queryClient.invalidateQueries({ queryKey: ['public-feedback'] });
      toast.success('Moderation status updated');
      setSelectedReview(null);
    },
    onError: (err: Error) => {
      toast.error('Failed to update moderation', err.message);
    },
  });

  // Save Notes Mutation
  const notesMutation = useMutation({
    mutationFn: ({ id, notes }: { id: string; notes: string }) =>
      apiRequest(`/admin/feedback/${id}/notes`, {
        method: 'PATCH',
        body: JSON.stringify({ internal_notes: notes }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-feedback'] });
      toast.success('Internal notes saved');
    },
    onError: (err: Error) => {
      toast.error('Failed to save notes', err.message);
    },
  });

  // Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      apiRequest(`/admin/feedback/${id}`, {
        method: 'DELETE',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-feedback'] });
      toast.success('Feedback deleted');
      setSelectedReview(null);
    },
    onError: (err: Error) => {
      toast.error('Failed to delete feedback', err.message);
    },
  });

  const openReviewModal = (item: FeedbackItem) => {
    setSelectedReview(item);
    setInternalNotes(item.internal_notes || '');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-navy-dark tracking-tight">
          Customer Feedback Moderation
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
          Approve or reject customer reviews for public display and add internal resolution notes.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="neo-card p-4 sm:p-5 flex flex-wrap items-center gap-3">
        <select
          value={moderationFilter}
          onChange={(e) => { setModerationFilter(e.target.value); setPage(1); }}
          className="neo-inset text-base sm:text-xs rounded-xl px-3.5 py-2.5 text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-brand-teal/30"
        >
          <option value="all">All Moderation Statuses</option>
          <option value="pending">Pending Approval</option>
          <option value="approved">Approved (Public)</option>
          <option value="rejected">Rejected</option>
        </select>

        <select
          value={ratingFilter}
          onChange={(e) => { setRatingFilter(e.target.value); setPage(1); }}
          className="neo-inset text-base sm:text-xs rounded-xl px-3.5 py-2.5 text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-brand-teal/30"
        >
          <option value="all">All Ratings</option>
          <option value="5">5 Stars</option>
          <option value="4">4 Stars</option>
          <option value="3">3 Stars</option>
          <option value="2">2 Stars</option>
          <option value="1">1 Star</option>
        </select>
      </div>

      {/* Feedback Table */}
      <div className="neo-card rounded-3xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200/60 text-slate-500 uppercase tracking-wider font-bold">
              <tr>
                <th className="py-4 px-4">Customer</th>
                <th className="py-4 px-4">Rating</th>
                <th className="py-4 px-4">Category</th>
                <th className="py-4 px-4">Review Message</th>
                <th className="py-4 px-4">Public Consent</th>
                <th className="py-4 px-4">Status</th>
                <th className="py-4 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/60">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400 font-medium">Loading reviews...</td>
                </tr>
              ) : feedbackList.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400 font-medium">No feedback submissions found.</td>
                </tr>
              ) : (
                feedbackList.map((item) => (
                  <tr key={item.id} className="hover:bg-white/40 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-slate-800">
                      {item.display_name}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-0.5 text-amber-500">
                        <Star className="w-3.5 h-3.5 fill-amber-500" />
                        <span className="font-bold ml-1">{item.rating}/5</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-gray-600 capitalize">
                      {item.category?.replace('_', ' ')}
                    </td>
                    <td className="py-3.5 px-4 text-gray-700 max-w-xs truncate">
                      "{item.message}"
                    </td>
                    <td className="py-3.5 px-4">
                      {item.public_display_consent ? (
                        <span className="text-emerald-700 font-medium">Yes</span>
                      ) : (
                        <span className="text-gray-400">No</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge variant={item.moderation_status === 'approved' ? 'success' : item.moderation_status === 'rejected' ? 'cancelled' : 'pending'}>
                        {item.moderation_status}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => openReviewModal(item)}
                        className="p-1.5 rounded-lg text-gray-500 hover:text-brand-navy hover:bg-gray-100 transition-colors"
                        title="Moderate Review"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
            <span>Page {page} of {totalPages}</span>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>
                Previous
              </Button>
              <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>
                Next
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Moderation Detail Modal */}
      {selectedReview && (
        <Modal
          isOpen={Boolean(selectedReview)}
          onClose={() => setSelectedReview(null)}
          title="Review Moderation & Notes"
          maxWidth="lg"
        >
          <div className="space-y-4 text-xs sm:text-sm">
            <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-gray-900">{selectedReview.display_name}</span>
                <span className="text-amber-500 font-bold flex items-center gap-1">
                  <Star className="w-4 h-4 fill-amber-500" /> {selectedReview.rating} / 5
                </span>
              </div>
              <p className="text-gray-700 leading-relaxed italic bg-white p-3 rounded-lg border border-gray-100">
                "{selectedReview.message}"
              </p>
              <div className="flex items-center justify-between text-xs text-gray-500 pt-1">
                <span>Public Display Consent: <strong>{selectedReview.public_display_consent ? 'Granted' : 'Not Granted'}</strong></span>
                <span>Submitted: {new Date(selectedReview.created_at).toLocaleDateString()}</span>
              </div>
            </div>

            {/* Public Moderation Decision */}
            <div className="p-3 border border-gray-100 rounded-xl space-y-2">
              <span className="font-bold text-gray-800 block text-xs uppercase tracking-wider">
                Public Website Publication:
              </span>
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  className="flex-1"
                  disabled={selectedReview.moderation_status === 'approved' || !selectedReview.public_display_consent}
                  onClick={() => moderateMutation.mutate({ id: selectedReview.id, status: 'approved' })}
                >
                  Approve for Public Display
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 text-rose-600 border-rose-200 hover:bg-rose-50"
                  disabled={selectedReview.moderation_status === 'rejected'}
                  onClick={() => moderateMutation.mutate({ id: selectedReview.id, status: 'rejected' })}
                >
                  Reject Publication
                </Button>
              </div>
              {!selectedReview.public_display_consent && (
                <p className="text-[11px] text-amber-700 italic">
                  Note: Customer did not consent to public display, so review cannot appear publicly even if approved.
                </p>
              )}
            </div>

            {/* Internal Staff Notes */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1">
                <Lock className="w-3.5 h-3.5 text-gray-400" /> Private Internal Notes (Never Public):
              </label>
              <textarea
                rows={3}
                value={internalNotes}
                onChange={(e) => setInternalNotes(e.target.value)}
                placeholder="Log internal staff comments or follow-up actions..."
                className="w-full rounded-xl border border-gray-200 p-2.5 text-xs focus:ring-2 focus:ring-brand-teal/30"
              />
              <div className="flex justify-between items-center pt-1">
                <Button
                  variant="danger"
                  size="sm"
                  leftIcon={<Trash2 className="w-3.5 h-3.5" />}
                  onClick={() => {
                    if (window.confirm('Permanently delete this feedback item?')) {
                      deleteMutation.mutate(selectedReview.id);
                    }
                  }}
                >
                  Delete Feedback
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => notesMutation.mutate({ id: selectedReview.id, notes: internalNotes })}
                  isLoading={notesMutation.isPending}
                >
                  Save Internal Notes
                </Button>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
