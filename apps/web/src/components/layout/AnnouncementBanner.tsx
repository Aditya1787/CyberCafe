import React, { useState } from 'react';
import { Megaphone, X } from 'lucide-react';

interface AnnouncementBannerProps {
  text?: string;
  enabled?: boolean;
}

export const AnnouncementBanner: React.FC<AnnouncementBannerProps> = ({
  text = 'Now accepting advance visit appointments! Avoid waiting in line by booking your slot online.',
  enabled = true,
}) => {
  const [dismissed, setDismissed] = useState(false);

  if (!enabled || dismissed || !text) return null;

  return (
    <div className="bg-gradient-to-r from-brand-navy via-brand-navy-dark to-brand-navy text-white text-xs sm:text-sm py-2 px-4 shadow-sm border-b border-brand-teal/20 relative z-40">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1 justify-center text-center">
          <span className="flex-shrink-0 bg-brand-gold text-brand-navy-dark p-1 rounded-md">
            <Megaphone className="w-3.5 h-3.5" />
          </span>
          <span className="font-medium tracking-wide">{text}</span>
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="text-gray-300 hover:text-white p-1 rounded-md hover:bg-white/10 transition-colors"
          aria-label="Dismiss banner"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
