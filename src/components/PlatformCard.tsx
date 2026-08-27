import React from 'react';
import { Star, Download, Play, Apple, ExternalLink, Sparkles, CheckCircle2 } from 'lucide-react';
import { Platform } from '@/types';

interface PlatformCardProps {
  platform: Platform;
  onSelect: (platform: Platform) => void;
}

export const PlatformCard: React.FC<PlatformCardProps> = ({ platform, onSelect }) => {
  const isUS = platform.region_origin === 'US_Dominant';
  const isPremium = platform.quality_tier === 'Premium';

  const playUrl = platform.playStoreUrl || (platform.platform_url?.includes('play.google.com')
    ? platform.platform_url
    : `https://play.google.com/store/search?q=${encodeURIComponent(platform.name)}&c=apps`);

  const appleUrl = platform.appStoreUrl || platform.app_store_url ||
    `https://apps.apple.com/us/search?term=${encodeURIComponent(platform.name)}`;

  const posterImage = platform.posterUrl || platform.poster_url || 'https://play-lh.googleusercontent.com/O-OR6Mh0AoNyiaYYaa3OJ_VHGfLqWW2qNzUUZxRRodD3fqs2Pm04FatavdNbz-jsMZM=w720-h1280';

  return (
    <div
      onClick={() => onSelect(platform)}
      className="group relative flex flex-col justify-between rounded-3xl bg-white border border-[#E7DFD5] hover:border-[#15803D] p-4 sm:p-5 transition-all duration-300 warm-card-shadow hover:warm-card-hover hover:-translate-y-1 cursor-pointer"
    >
      {/* Top Meta Badges & Status */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-1.5">
          <span className="px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider rounded-md bg-[#15803D]/10 text-[#15803D] border border-[#15803D]/20">
            {platform.content_focus}
          </span>
          {platform.pinnedGenreTop && (
            <span className="px-2 py-0.5 text-[9px] font-black uppercase tracking-wider rounded bg-amber-500/10 text-amber-700 border border-amber-500/20 flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5" />
              <span>TOP PIN</span>
            </span>
          )}
        </div>

        <div className="flex items-center gap-1 text-xs font-extrabold text-[#D97706] bg-[#FFFBEB] px-2 py-0.5 rounded-full border border-[#FEF3C7]">
          <Star className="w-3.5 h-3.5 fill-[#D97706]" />
          <span>{platform.rating.toFixed(1)}</span>
        </div>
      </div>

      {/* 9:16 Vertical Poster & App Branding Row */}
      <div className="flex gap-4 mb-3.5">
        
        {/* Prominent 9:16 Vertical Poster Preview */}
        <div className="relative w-24 sm:w-28 aspect-[9/14] flex-shrink-0 rounded-2xl overflow-hidden bg-[#F5F2EB] border border-[#E7DFD5] group-hover:border-[#15803D]/50 transition-colors shadow-2xs">
          <img
            src={posterImage}
            alt={`${platform.name} poster`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
          {platform.featured && (
            <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-black/70 backdrop-blur-xs text-[9px] font-black text-amber-300 uppercase">
              Spotlight
            </div>
          )}
        </div>

        {/* Platform Info Details */}
        <div className="flex-1 min-w-0 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-7 h-7 rounded-lg overflow-hidden bg-[#F5F2EB] border border-[#E7DFD5] flex-shrink-0">
                <img
                  src={platform.icon_url}
                  alt={platform.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              </div>
              <h3 className="text-base font-extrabold text-[#1C1917] truncate group-hover:text-[#15803D] transition-colors">
                {platform.name}
              </h3>
            </div>

            <p className="text-[11px] text-[#78716C] truncate font-medium mb-1.5">
              {platform.developer}
            </p>

            <div className="flex items-center gap-1.5 text-xs text-[#57534E] mb-2 font-medium">
              <Download className="w-3.5 h-3.5 text-[#15803D]" />
              <span>{platform.download_count} Downloads</span>
            </div>

            {platform.trailerTitle && (
              <div className="text-[11px] text-[#15803D] font-semibold bg-[#E8F2EC] px-2 py-1 rounded-lg line-clamp-1 border border-[#D1E5D8]">
                🎬 {platform.trailerTitle}
              </div>
            )}
          </div>

          {/* Specialties Pills */}
          <div className="flex flex-wrap gap-1 mt-2">
            {platform.specialties.slice(0, 2).map((spec) => (
              <span
                key={spec}
                className="px-2 py-0.5 text-[10px] font-medium bg-[#F5F2EB] text-[#57534E] border border-[#E7DFD5] rounded-md"
              >
                {spec}
              </span>
            ))}
          </div>
        </div>

      </div>

      {/* Description */}
      <p className="text-xs text-[#57534E] line-clamp-2 leading-relaxed mb-4">
        {platform.description}
      </p>

      {/* Direct App Store Download Buttons */}
      <div className="flex items-center gap-2 pt-3 border-t border-[#F5F2EB]" onClick={(e) => e.stopPropagation()}>
        <a
          href={playUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 py-2 px-2.5 rounded-xl bg-[#15803D] hover:bg-[#166534] text-white font-extrabold text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm cursor-pointer"
          title={`Open ${platform.name} on Google Play`}
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>Google Play</span>
        </a>

        {platform.app_store_url ? (
          <a
            href={appleUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-2 px-2.5 rounded-xl bg-white hover:bg-[#F5F2EB] border border-[#D8D1C5] hover:border-[#15803D] text-[#1C1917] font-extrabold text-xs flex items-center justify-center gap-1.5 transition-all shadow-2xs cursor-pointer"
            title={`Open ${platform.name} on Apple App Store`}
          >
            <Apple className="w-3.5 h-3.5 fill-current" />
            <span>App Store</span>
          </a>
        ) : (
          <button
            onClick={() => onSelect(platform)}
            className="px-3 py-2 rounded-xl bg-[#F5F2EB] hover:bg-[#E7DFD5] text-[#57534E] hover:text-[#1C1917] text-xs font-bold flex items-center gap-1 cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Details</span>
          </button>
        )}
      </div>
    </div>
  );
};
