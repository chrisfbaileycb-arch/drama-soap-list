import React, { useState, useEffect } from 'react';
import { X, Star, Download, MessageSquare, Play, Apple, Share2, Check, ShieldCheck, Globe, Film, Sparkles } from 'lucide-react';
import { Platform } from '@/types';

interface PlatformDetailModalProps {
  platform: Platform | null;
  onClose: () => void;
}

export const PlatformDetailModal: React.FC<PlatformDetailModalProps> = ({ platform, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [isPlayingTrailer, setIsPlayingTrailer] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!platform) return null;

  const playUrl = platform.playStoreUrl || (platform.platform_url?.includes('play.google.com')
    ? platform.platform_url
    : `https://play.google.com/store/search?q=${encodeURIComponent(platform.name)}&c=apps`);

  const appleUrl = platform.appStoreUrl || platform.app_store_url ||
    `https://apps.apple.com/us/search?term=${encodeURIComponent(platform.name)}`;

  const posterImage = platform.posterUrl || platform.poster_url || 'https://play-lh.googleusercontent.com/O-OR6Mh0AoNyiaYYaa3OJ_VHGfLqWW2qNzUUZxRRodD3fqs2Pm04FatavdNbz-jsMZM=w720-h1280';

  const handleShare = async () => {
    const shareText = `Check out ${platform.name} on SoapList!\n\n${platform.description}\n\nGoogle Play: ${playUrl}\nApp Store: ${appleUrl}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: platform.name,
          text: shareText,
          url: window.location.href,
        });
      } catch (_) {}
    } else {
      navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div 
        onClick={onClose} 
        className="fixed inset-0 bg-[#1C1917]/70 backdrop-blur-xs transition-opacity"
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-2xl bg-white border border-[#E7DFD5] rounded-3xl shadow-2xl overflow-hidden z-10 my-8">
        
        {/* Top Warm Banner */}
        <div className="relative h-20 bg-gradient-to-r from-[#1C1917] via-[#292524] to-[#1C1917] text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 text-[11px] font-extrabold rounded-full bg-white/10 text-white border border-white/20">
              {platform.region_origin === 'US_Dominant' ? '🇺🇸 U.S. Focus' : '🌐 Global'}
            </span>
            <span className="px-2.5 py-1 text-[11px] font-extrabold rounded-full bg-[#15803D] text-white">
              {platform.content_focus}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              title="Share platform"
            >
              {copied ? <Check className="w-4 h-4 text-[#22C55E]" /> : <Share2 className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              title="Close modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          
          <div className="flex flex-col sm:flex-row gap-6 mb-6">
            
            {/* 9:16 Vertical Poster Preview with Play Button */}
            <div className="relative w-full sm:w-44 aspect-[9/14] rounded-2xl overflow-hidden bg-[#F5F2EB] border border-[#E7DFD5] shadow-md flex-shrink-0 group">
              <img
                src={posterImage}
                alt={platform.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                <button
                  onClick={() => setIsPlayingTrailer(!isPlayingTrailer)}
                  className="w-12 h-12 rounded-full bg-[#15803D] hover:bg-[#166534] text-white flex items-center justify-center shadow-lg transition-transform hover:scale-110 cursor-pointer"
                  title="Play sample 9:16 trailer"
                >
                  <Play className="w-5 h-5 fill-white ml-0.5" />
                </button>
              </div>
              {isPlayingTrailer && (
                <div className="absolute bottom-2 left-2 right-2 p-1.5 rounded-lg bg-black/80 backdrop-blur-xs text-[10px] text-white text-center font-bold animate-pulse">
                  Playing 9:16 Mobile Trailer
                </div>
              )}
            </div>

            {/* Platform Details */}
            <div className="flex-1 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl overflow-hidden bg-[#F5F2EB] border border-[#E7DFD5] flex-shrink-0">
                  <img
                    src={platform.icon_url}
                    alt={platform.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-[#1C1917] tracking-tight">
                    {platform.name}
                  </h2>
                  <p className="text-xs text-[#78716C] font-semibold">
                    Published by {platform.developer}
                  </p>
                </div>
              </div>

              {/* Tagline */}
              <p className="text-xs italic text-[#15803D] bg-[#E8F2EC] p-2.5 rounded-xl border border-[#D1E5D8] font-medium">
                "{platform.tagline}"
              </p>

              {/* Statistics Grid */}
              <div className="grid grid-cols-3 gap-2 p-3 rounded-2xl bg-[#FAF8F5] border border-[#E7DFD5]">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-[#D97706] font-extrabold text-sm mb-0.5">
                    <Star className="w-3.5 h-3.5 fill-[#D97706]" />
                    <span>{platform.rating.toFixed(1)}</span>
                  </div>
                  <span className="text-[10px] text-[#78716C]">Store Rating</span>
                </div>

                <div className="text-center border-x border-[#E7DFD5]">
                  <div className="flex items-center justify-center gap-1 text-[#1C1917] font-extrabold text-sm mb-0.5">
                    <Download className="w-3.5 h-3.5 text-[#15803D]" />
                    <span>{platform.download_count}</span>
                  </div>
                  <span className="text-[10px] text-[#78716C]">Downloads</span>
                </div>

                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-[#1C1917] font-extrabold text-sm mb-0.5">
                    <MessageSquare className="w-3.5 h-3.5 text-[#78716C]" />
                    <span>
                      {platform.review_count >= 1000
                        ? `${(platform.review_count / 1000).toFixed(0)}k`
                        : platform.review_count}
                    </span>
                  </div>
                  <span className="text-[10px] text-[#78716C]">Reviews</span>
                </div>
              </div>

              {/* Description */}
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#78716C] block mb-1">
                  About Platform
                </span>
                <p className="text-xs text-[#57534E] leading-relaxed">
                  {platform.description}
                </p>
              </div>

              {/* Specialties / Tropes */}
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#78716C] block mb-1.5">
                  Popular Themes & Specialties
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {platform.specialties.map(spec => (
                    <span
                      key={spec}
                      className="px-2.5 py-0.5 text-xs font-bold bg-[#FAF8F5] text-[#1C1917] border border-[#E7DFD5] rounded-lg"
                    >
                      #{spec}
                    </span>
                  ))}
                </div>
              </div>

            </div>

          </div>

          {/* Direct Store Download Action Buttons with rel="noopener noreferrer" */}
          <div className="space-y-3 pt-3 border-t border-[#E7DFD5]">
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href={playUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-3 px-4 rounded-xl bg-[#15803D] hover:bg-[#166534] text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 transition-transform hover:scale-102 shadow-md shadow-[#15803D]/20 cursor-pointer"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Open in Google Play</span>
              </a>

              {platform.app_store_url ? (
                <a
                  href={appleUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3 px-4 rounded-xl bg-white hover:bg-[#F5F2EB] border border-[#D8D1C5] hover:border-[#15803D] text-[#1C1917] font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 transition-transform hover:scale-102 shadow-2xs cursor-pointer"
                >
                  <Apple className="w-4 h-4 fill-current" />
                  <span>Download on App Store</span>
                </a>
              ) : (
                <a
                  href={`https://www.google.com/search?q=${encodeURIComponent(platform.name + ' mini drama app')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3 px-4 rounded-xl bg-[#FAF8F5] hover:bg-[#E7DFD5] text-[#57534E] font-bold text-xs sm:text-sm flex items-center justify-center gap-2"
                >
                  <Globe className="w-4 h-4" />
                  <span>Search Official Web</span>
                </a>
              )}
            </div>

            {copied && (
              <p className="text-xs text-center text-[#15803D] font-bold animate-pulse">
                Direct platform store links copied to clipboard!
              </p>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
