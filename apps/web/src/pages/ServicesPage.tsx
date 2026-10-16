import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Search, Filter, X, Layers, ArrowUpDown } from 'lucide-react';
import { apiRequest } from '../api/client.js';
import { Service, ServiceCategory } from '../types/index.js';
import { ServiceCard } from '../components/services/ServiceCard.js';
import { ServiceCardSkeleton } from '../components/common/LoadingSkeleton.js';
import { EmptyState } from '../components/common/EmptyState.js';
import { Button } from '../components/common/Button.js';

export const ServicesPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const currentCategory = searchParams.get('category') || 'all';
  const currentSearch = searchParams.get('search') || '';
  const currentSort = searchParams.get('sort') || 'order';

  const [searchInput, setSearchInput] = useState(currentSearch);

  // Sync search input when URL changes
  useEffect(() => {
    setSearchInput(currentSearch);
  }, [currentSearch]);

  // Fetch categories
  const { data: categoriesData } = useQuery<{ data: ServiceCategory[] }>({
    queryKey: ['categories'],
    queryFn: () => apiRequest('/service-categories'),
    staleTime: 10 * 60 * 1000,
  });

  // Fetch services based on filters
  const { data: servicesData, isLoading } = useQuery<{ data: Service[]; meta: { total: number } }>({
    queryKey: ['services', currentCategory, currentSearch, currentSort],
    queryFn: () => {
      const params = new URLSearchParams();
      if (currentCategory && currentCategory !== 'all') params.set('category', currentCategory);
      if (currentSearch) params.set('search', currentSearch);
      if (currentSort) params.set('sort', currentSort);
      params.set('limit', '60'); // Load all 50 services cleanly
      return apiRequest(`/services?${params.toString()}`);
    },
    staleTime: 2 * 60 * 1000,
  });

  const categories = categoriesData?.data || [];
  const services = servicesData?.data || [];
  const totalCount = servicesData?.meta?.total ?? services.length;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newParams = new URLSearchParams(searchParams);
    if (searchInput.trim()) {
      newParams.set('search', searchInput.trim());
    } else {
      newParams.delete('search');
    }
    setSearchParams(newParams);
  };

  const handleCategorySelect = (slug: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (slug === 'all') {
      newParams.delete('category');
    } else {
      newParams.set('category', slug);
    }
    setSearchParams(newParams);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('sort', e.target.value);
    setSearchParams(newParams);
  };

  const clearAllFilters = () => {
    setSearchInput('');
    setSearchParams(new URLSearchParams());
  };

  const hasActiveFilters = currentCategory !== 'all' || currentSearch !== '' || currentSort !== 'order';

  return (
    <div className="min-h-screen py-8 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
          <span className="text-xs font-extrabold tracking-widest uppercase text-brand-teal">
            Complete Digital Catalogue
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-800 dark:text-white mt-1">
            All 50 Internet Cafe Services
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2">
            Explore required documents, assistance fees, processing duration, and book your visit in advance.
          </p>
        </div>

        {/* Filter Controls Panel */}
        <div className="neo-card p-5 sm:p-6 mb-8 space-y-4">
          <div className="flex flex-col md:flex-row items-center gap-3">
            {/* Search Input */}
            <form onSubmit={handleSearchSubmit} className="flex-1 w-full relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search services by keyword, document, or name..."
                className="w-full pl-11 pr-24 py-3 neo-inset text-base sm:text-sm text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-teal/30"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 px-3.5 py-1.5 neo-btn-teal text-white rounded-xl text-xs font-bold transition-all shadow-sm"
              >
                Search
              </button>
            </form>

            {/* Sort Select */}
            <div className="flex items-center gap-2 w-full md:w-auto">
              <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 flex-shrink-0 font-medium">
                <ArrowUpDown className="w-3.5 h-3.5" />
                <span>Sort by:</span>
              </div>
              <select
                value={currentSort}
                onChange={handleSortChange}
                className="neo-inset text-xs px-3.5 py-2.5 text-slate-800 dark:text-slate-100 dark:bg-[#0e1726] font-medium focus:outline-none focus:ring-2 focus:ring-brand-teal/30"
              >
                <option value="order">Featured / Recommended</option>
                <option value="name_asc">Name (A to Z)</option>
                <option value="name_desc">Name (Z to A)</option>
                <option value="newest">Recently Added</option>
              </select>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="pt-3 border-t border-slate-200/60 dark:border-white/10 flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none text-xs">
            <button
              onClick={() => handleCategorySelect('all')}
              className={`px-3.5 py-2 rounded-full font-bold whitespace-nowrap transition-all ${
                currentCategory === 'all'
                  ? 'neo-pill-inset text-brand-teal dark:text-sky-400'
                  : 'neo-pill text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              All Categories ({totalCount})
            </button>
            {categories.map((cat) => (
              <button
                key={cat.slug}
                onClick={() => handleCategorySelect(cat.slug)}
                className={`px-3.5 py-2 rounded-full font-bold whitespace-nowrap transition-all ${
                  currentCategory === cat.slug
                    ? 'neo-pill-inset text-brand-teal dark:text-sky-400'
                    : 'neo-pill text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Active Filter summary */}
          {hasActiveFilters && (
            <div className="flex items-center justify-between pt-3 border-t border-slate-200/60 text-xs text-slate-500">
              <div className="flex flex-wrap items-center gap-2">
                <span>Active filters:</span>
                {currentCategory !== 'all' && (
                  <span className="neo-pill-inset text-brand-teal px-2.5 py-1 text-[11px] font-bold">
                    Category: {categories.find((c) => c.slug === currentCategory)?.name || currentCategory}
                  </span>
                )}
                {currentSearch && (
                  <span className="neo-pill-inset text-blue-600 px-2.5 py-1 text-[11px] font-bold">
                    Search: "{currentSearch}"
                  </span>
                )}
              </div>
              <button
                onClick={clearAllFilters}
                className="text-rose-600 hover:text-rose-700 flex items-center gap-1 font-bold text-xs ml-auto"
              >
                <X className="w-3.5 h-3.5" /> Clear All
              </button>
            </div>
          )}
        </div>

        {/* Services Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <ServiceCardSkeleton key={i} />
            ))}
          </div>
        ) : services.length === 0 ? (
          <EmptyState
            icon={<Layers className="w-8 h-8 text-brand-teal" />}
            title="No Services Found"
            description="We could not find any service matching your search or category filter. Try clearing filters to see all 50 services."
            actionLabel="Reset All Filters"
            onAction={clearAllFilters}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
