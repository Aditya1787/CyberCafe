import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Star, MessageSquareQuote, MessageSquarePlus } from 'lucide-react';
import { apiRequest } from '../../api/client.js';
import { FeedbackItem } from '../../types/index.js';
import { Button } from '../common/Button.js';

export const PublicReviews: React.FC = () => {
  const { data, isLoading } = useQuery<{ data: FeedbackItem[] }>({
    queryKey: ['public-feedback'],
    queryFn: () => apiRequest('/feedback/public'),
    staleTime: 5 * 60 * 1000,
  });

  const reviews = data?.data || [];

  return (
    <section className="py-16 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="neo-pill-inset px-3.5 py-1 text-xs font-bold tracking-widest uppercase text-sky-700">
              Customer Experiences
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 mt-3 tracking-tight">
              Community Feedback & Ratings
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-2 max-w-xl">
              Authentic reviews submitted by verified visitors to Baba Anandeshwar Internet Cafe in Kanpur.
            </p>
          </div>

          <Link to="/feedback">
            <Button variant="secondary" size="sm" leftIcon={<MessageSquarePlus className="w-4 h-4" />}>
              Share Your Experience
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-44 neo-card animate-pulse p-6" />
            ))}
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-12 px-6 neo-card max-w-md mx-auto">
            <div className="w-14 h-14 rounded-2xl neo-circle mx-auto mb-4 text-sky-600">
              <MessageSquareQuote className="w-7 h-7" />
            </div>
            <h3 className="font-extrabold text-slate-900 text-lg mb-1">Be the First to Review Us!</h3>
            <p className="text-xs text-slate-600 max-w-sm mx-auto mb-5 leading-relaxed">
              We value genuine feedback from our customers. If you recently visited our cafe in Kanpur, share your thoughts.
            </p>
            <Link to="/feedback">
              <Button variant="outline" size="sm">
                Submit Feedback
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {reviews.map((r) => (
              <div key={r.id} className="neo-card neo-card-hover p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-bold text-slate-900 text-sm">{r.display_name}</span>
                    <div className="flex items-center gap-0.5 text-amber-500">
                      {[...Array(r.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-current" />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 italic leading-relaxed">
                    "{r.message}"
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-200/50 text-[10px] text-slate-400">
                  {new Date(r.created_at).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
