import React from 'react';

interface SkeletonProps {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = 'h-4 w-full' }) => {
  return (
    <div className={`animate-pulse bg-gray-200/80 rounded-lg ${className}`} />
  );
};

export const ServiceCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm flex flex-col gap-4 animate-pulse">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-gray-200" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-200 rounded w-3/4" />
          <div className="h-3 bg-gray-200 rounded w-1/2" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-3 bg-gray-200 rounded" />
        <div className="h-3 bg-gray-200 rounded w-5/6" />
      </div>
      <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
        <div className="h-4 bg-gray-200 rounded w-1/3" />
        <div className="h-8 bg-gray-200 rounded-lg w-1/4" />
      </div>
    </div>
  );
};
