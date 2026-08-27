import React, { useState, useEffect } from 'react';
import { X, Star, Download, MessageSquare, Play, Apple, Share2, Check, ShieldCheck, Globe, Sparkles, ExternalLink } from 'lucide-react';
import { Platform } from '@/types';

interface PlatformDetailModalProps {
  platform: Platform | null;
  onClose: () => void;
}

export const PlatformDetailModal: React.FC<PlatformDetailModalProps> = ({ platform, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [imgError, setImgError] = useState(false);

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

  const domain = platform.websiteUrl
    ? platform.websiteUrl.replace(/^https?:\/\//, '').replace(/\/.*$/, '')
    : (platform.domain || 'google.com');

  const iconSrc = platform.logoUrl || `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
  const initialLetter = (platform.name || 'A').trim().charAt(0).toUpperCase();

  const websiteUrl = platform.websiteUrl || (platform.domain ? `https://${platform.domain}` : '');

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
        
        {/* Top Header Banner */}
        <div className="relative h-18 bg-gradient-to-r from-[#1C1917] via-[#292524] to-[#1C1917] text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 text-[11px] font-extrabold rounded-full bg-white/10 text-white border border-white/20">
              {platform.region_origin === 'US_Dominant' ? '🇺🇸 U.S. Focus' : '🌐 Global'}
            </span>
            <span className="px-2.5 py-1 text-[11px] font-extrabold rounded-full bg-[#15803D] text-white">
              {platform.content_focus}
            </span>
            {platform.featured && (
              <span className="px-2 py-0.5 text-[10px] font-extrabold rounded bg-amber-400 text-[#1C1917] flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                <span>Featured App</span>
              </span>
            )}
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
        <div className="p-6 sm:p-8">
          
          {/* Main App Overview Row: Square App Icon + Key Identity */}
          <div className="flex items-start gap-5 mb-6">
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-3xl overflow-hidden bg-[#FAF8F5] border-2 border-[#E7DFD5] shadow-md flex-shrink-0 flex items-center justify-center">
              <img
                src={iconSrc}
                alt={`${platform.name} icon`}
                className="w-full h-full object-cover rounded-3xl"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
                }}
              />
            </div>

            <div className="flex-1 min-w-0">
              <h2 className="text-xl sm:text-2xl font-black text-[#1C1917] tracking-tight">
                {platform.name}
              </h2>
              <p className="text-xs sm:text-sm text-[#78716C] font-semibold mt-0.5">
                Published by {platform.publisher || platform.developer}
              </p>

              {(websiteUrl || platform.domain) && (
                <div className="flex items-center gap-1 text-xs text-[#15803D] font-medium mt-1">
                  <Globe className="w-3.5 h-3.5" />
                  <a
                    href={websiteUrl || `https://${platform.domain}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    {domain}
                  </a>
                </div>
              )}

              <div className="flex flex-wrap items-center gap-2 mt-2.5">
                <span className="px-2.5 py-0.5 text-xs font-bold text-[#D97706] bg-[#FFFBEB] rounded-md border border-[#FEF3C7] flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-[#D97706]" />
                  <span>{platform.rating.toFixed(1)} Rating</span>
                </span>
                <span className="px-2.5 py-0.5 text-xs font-bold text-[#15803D] bg-[#E8F2EC] rounded-md border border-[#D1E5D8] flex items-center gap-1">
                  <Download className="w-3.5 h-3.5" />
                  <span>{platform.download_count} Downloads</span>
                </span>
              </div>
            </div>
          </div>

          {/* Tagline */}
          <div className="mb-5">
            <p className="text-xs sm:text-sm italic text-[#15803D] bg-[#E8F2EC] p-3 rounded-2xl border border-[#D1E5D8] font-medium">
              "{platform.tagline}"
            </p>
          </div>

          {/* Statistics Grid */}
          <div className="grid grid-cols-3 gap-2 p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#E7DFD5] mb-5">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-[#D97706] font-extrabold text-sm mb-0.5">
                <Star className="w-3.5 h-3.5 fill-[#D97706]" />
                <span>{platform.rating.toFixed(1)}</span>
              </div>
              <span className="text-[10px] text-[#78716C] font-semibold">Store Rating</span>
            </div>

            <div className="text-center border-x border-[#E7DFD5]">
              <div className="flex items-center justify-center gap-1 text-[#1C1917] font-extrabold text-sm mb-0.5">
                <Download className="w-3.5 h-3.5 text-[#15803D]" />
                <span>{platform.download_count}</span>
              </div>
              <span className="text-[10px] text-[#78716C] font-semibold">Downloads</span>
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
              <span className="text-[10px] text-[#78716C] font-semibold">Reviews</span>
            </div>
          </div>

          {/* Description */}
          <div className="mb-5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#78716C] block mb-1.5">
              About This Application
            </span>
            <p className="text-xs sm:text-sm text-[#57534E] leading-relaxed">
              {platform.description}
            </p>
          </div>

          {/* Specialties / Tropes */}
          <div className="mb-6">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#78716C] block mb-2">
              Popular Tropes & Specialties
            </span>
            <div className="flex flex-wrap gap-1.5">
              {platform.specialties.map(spec => (
                <span
                  key={spec}
                  className="px-2.5 py-1 text-xs font-bold bg-[#FAF8F5] text-[#1C1917] border border-[#E7DFD5] rounded-xl"
                >
                  #{spec}
                </span>
              ))}
            </div>
          </div>

          {/* Direct Store Download Action Buttons */}
          <div className="space-y-3 pt-4 border-t border-[#E7DFD5]">
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

              {(platform.appStoreUrl || platform.app_store_url) ? (
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
                  <ExternalLink className="w-4 h-4" />
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

