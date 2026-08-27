import React from 'react';
import { Star, Download, Play, Apple, Sparkles, ChevronRight } from 'lucide-react';
import { Platform } from '@/types';

interface PlatformCardProps {
  platform: Platform;
  onSelect: (platform: Platform) => void;
}

export const PlatformCard: React.FC<PlatformCardProps> = ({ platform, onSelect }) => {
  const playUrl = platform.playStoreUrl || (platform.platform_url?.includes('play.google.com')
    ? platform.platform_url
    : `https://play.google.com/store/search?q=${encodeURIComponent(platform.name)}&c=apps`);

  const appleUrl = platform.appStoreUrl || platform.app_store_url ||
    `https://apps.apple.com/us/search?term=${encodeURIComponent(platform.name)}`;

  return (
    <div
      onClick={() => onSelect(platform)}
      className="group relative flex flex-col justify-between rounded-2xl bg-white border border-[#E7DFD5] hover:border-[#15803D] p-5 transition-all duration-200 warm-card-shadow hover:warm-card-hover hover:-translate-y-0.5 cursor-pointer"
    >
      {/* Top Header Area: App Icon + App Meta */}
      <div>
        <div className="flex items-start gap-3.5 mb-3.5">
          {/* Rounded Square App Icon */}
          <div className="relative w-12 h-12 rounded-xl shadow-xs border border-[#E7DFD5] bg-[#F5F2EB] flex-shrink-0 overflow-hidden flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
            <img
              src={platform.logoUrl || `https://www.google.com/s2/favicons?domain=${platform.domain}&sz=128`}
              alt={platform.name}
              className="w-12 h-12 rounded-xl object-cover"
            />
            {platform.featured && (
              <span className="absolute -bottom-0.5 -right-0.5 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500 border-2 border-white"></span>
              </span>
            )}
          </div>

          {/* App Title, Publisher / Developer, Category & Ratings */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-1.5 mb-1">
              <h3 className="text-base font-extrabold text-[#1C1917] truncate group-hover:text-[#15803D] transition-colors">
                {platform.name}
              </h3>
            </div>

            <p className="text-xs text-[#78716C] truncate font-medium mb-1.5">
              {platform.publisher || platform.developer}
            </p>

            <div className="flex items-center flex-wrap gap-1.5">
              <div className="flex items-center gap-1 text-xs font-bold text-[#D97706] bg-[#FFFBEB] px-2 py-0.5 rounded-md border border-[#FEF3C7]">
                <Star className="w-3 h-3 fill-[#D97706]" />
                <span>{platform.rating.toFixed(1)}</span>
              </div>

              <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md bg-[#15803D]/10 text-[#15803D] border border-[#15803D]/20">
                {platform.content_focus}
              </span>

              {platform.pinnedGenreTop && (
                <span className="px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wider rounded bg-amber-500/10 text-amber-700 border border-amber-500/20 flex items-center gap-0.5">
                  <Sparkles className="w-2.5 h-2.5" />
                  <span>Featured</span>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Short Description */}
        <p className="text-xs text-[#57534E] line-clamp-2 leading-relaxed mb-3">
          {platform.description}
        </p>

        {/* Specialties Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {platform.specialties.slice(0, 3).map((spec) => (
            <span
              key={spec}
              className="px-2 py-0.5 text-[10px] font-medium bg-[#F5F2EB] text-[#57534E] border border-[#E7DFD5] rounded-md"
            >
              #{spec}
            </span>
          ))}
        </div>
      </div>

      {/* Bottom Row: Download Stats & Direct Action Buttons */}
      <div className="pt-3 border-t border-[#F5F2EB] flex items-center justify-between gap-2" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-1 text-xs text-[#78716C] font-semibold">
          <Download className="w-3.5 h-3.5 text-[#15803D]" />
          <span>{platform.download_count}</span>
        </div>

        <div className="flex items-center gap-1.5">
          <a
            href={playUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 rounded-lg bg-[#15803D] hover:bg-[#166534] text-white font-extrabold text-xs flex items-center gap-1 transition-all shadow-2xs cursor-pointer"
            title={`Get ${platform.name} on Google Play`}
          >
            <Play className="w-3 h-3 fill-current" />
            <span>GET</span>
          </a>

          {(platform.appStoreUrl || platform.app_store_url) ? (
            <a
              href={appleUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-2.5 py-1.5 rounded-lg bg-white hover:bg-[#F5F2EB] border border-[#D8D1C5] hover:border-[#15803D] text-[#1C1917] font-extrabold text-xs flex items-center gap-1 transition-all shadow-2xs cursor-pointer"
              title={`View on Apple App Store`}
            >
              <Apple className="w-3 h-3 fill-current" />
            </a>
          ) : (
            <button
              onClick={() => onSelect(platform)}
              className="px-2.5 py-1.5 rounded-lg bg-[#F5F2EB] hover:bg-[#E7DFD5] text-[#57534E] text-xs font-bold flex items-center cursor-pointer"
              title="Platform Details"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

