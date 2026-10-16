import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { apiRequest } from '../../api/client.js';
import { Service } from '../../types/index.js';
import { ServiceCard } from '../services/ServiceCard.js';
import { ServiceCardSkeleton } from '../common/LoadingSkeleton.js';
import { Button } from '../common/Button.js';

export const PopularServices: React.FC = () => {
  const { data, isLoading } = useQuery<{ data: Service[] }>({
    queryKey: ['popular-services'],
    queryFn: () => apiRequest('/services?featured=true&limit=6'),
    staleTime: 5 * 60 * 1000,
  });

  const services = data?.data || [];

  return (
    <section className="py-20 bg-brand-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold tracking-widest uppercase text-brand-teal mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Most Requested Services</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-navy-dark">
              Popular Assistance Services
            </h2>
            <p className="text-sm text-gray-500 mt-1 max-w-xl">
              High-demand citizen applications, identity verification assistance, and essential document printing.
            </p>
          </div>

          <Link to="/services">
            <Button variant="outline" size="sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
              View All 50 Services
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <ServiceCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
