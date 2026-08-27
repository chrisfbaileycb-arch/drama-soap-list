import React, { useState } from 'react';
import { 
  Sparkles, Play, Award, Film, ArrowRight, Star, Download, 
  Smartphone, CheckCircle2, ShieldCheck, Zap, Compass, ChevronRight,
  TrendingUp, Globe, Apple, Layers, Check
} from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { Platform } from '@/types';

interface LandingViewProps {
  onNavigateToDirectory: () => void;
  onNavigateToSponsor: () => void;
  onSelectPlatform: (platform: Platform) => void;
}

export const LandingView: React.FC<LandingViewProps> = ({
  onNavigateToDirectory,
  onNavigateToSponsor,
  onSelectPlatform,
}) => {
  const { platforms, spotlightPlatforms } = useApp();
  const [imgErrorMap, setImgErrorMap] = useState<Record<string, boolean>>({});

  const activePlatforms = platforms.filter(p => p.active);
  const activeCount = activePlatforms.length;

  const topApps = spotlightPlatforms.slice(0, 8);

  const getPlatformIcon = (platform: Platform) => {
    return platform.iconUrl || platform.icon_url || (platform.domain ? `https://www.google.com/s2/favicons?domain=${platform.domain}&sz=128` : '');
  };

  const handleCardClick = (platform: Platform) => {
    onSelectPlatform(platform);
  };

  return (
    <div className="space-y-16 pb-12">
      
      {/* ── HERO SECTION (CLEAN APP STORE DIRECTORY AESTHETIC) ──────── */}
      <section className="relative overflow-hidden pt-8 sm:pt-14 pb-16 border-b border-[#E7DFD5] bg-gradient-to-b from-[#FAF8F5] via-[#F4EFE6] to-[#FAF8F5]">
        
        {/* Warm Ambient Glows */}
        <div className="absolute -top-24 left-1/4 w-[480px] h-[480px] bg-[#D97706]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-16 right-1/4 w-[480px] h-[480px] bg-[#15803D]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
            
            {/* ── LEFT COLUMN: BOLD HEADLINE & CTAS ────────────── */}
            <div className="lg:col-span-6 text-left space-y-6">
              
              {/* Curated Marquee Pill */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/95 border border-[#E7DFD5] text-[#15803D] text-xs font-extrabold shadow-xs">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#15803D] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#15803D]"></span>
                </span>
                <span className="uppercase tracking-wider">Independent App Directory</span>
                <span className="text-[#A8A29E]">•</span>
                <span className="text-[#57534E] font-medium">{activeCount} Verified Platforms</span>
              </div>

              {/* Bold Title Treatment */}
              <h1 className="text-3xl sm:text-5xl lg:text-5xl xl:text-6xl font-black text-[#1C1917] tracking-tight leading-[1.08]">
                The Directory For <br />
                <span className="text-[#15803D]">
                  Vertical Mini-Drama Apps
                </span>
              </h1>

              {/* Value Proposition */}
              <p className="text-sm sm:text-base text-[#57534E] leading-relaxed max-w-xl">
                Discover verified mobile episodic drama apps, billionaire romance series, and revenge loops — with direct store links for Google Play and Apple App Store.
              </p>

              {/* High-Contrast Action CTAs */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
                <button
                  id="hero-cta-explore-directory"
                  onClick={onNavigateToDirectory}
                  className="px-8 py-3.5 rounded-2xl bg-[#15803D] hover:bg-[#166534] text-white font-extrabold text-sm sm:text-base flex items-center justify-center gap-2.5 transition-all duration-200 hover:scale-102 shadow-lg shadow-[#15803D]/25 cursor-pointer"
                >
                  <Compass className="w-5 h-5 text-emerald-100" />
                  <span>Explore App Directory</span>
                  <ArrowRight className="w-4 h-4 text-emerald-100" />
                </button>

                <button
                  id="hero-cta-advertise"
                  onClick={onNavigateToSponsor}
                  className="px-7 py-3.5 rounded-2xl bg-white hover:bg-[#F5F2EB] text-[#1C1917] border-2 border-[#D8D1C5] hover:border-[#15803D] font-extrabold text-sm sm:text-base flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer shadow-xs"
                >
                  <Award className="w-5 h-5 text-[#D97706]" />
                  <span>Publisher Sponsorship</span>
                </button>
              </div>

              {/* Editorial Quality Badges */}
              <div className="grid grid-cols-2 gap-3 pt-2 text-xs text-[#57534E] font-semibold border-t border-[#E7DFD5]/80">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#15803D] flex-shrink-0" />
                  <span>100% Free Public Directory</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#15803D] flex-shrink-0" />
                  <span>Direct Play & App Store Links</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#15803D] flex-shrink-0" />
                  <span>Verified Publisher Quality</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#15803D] flex-shrink-0" />
                  <span>40+ Indexed Mobile Catalogs</span>
                </div>
              </div>

            </div>

            {/* ── RIGHT COLUMN: APP STORE DIRECTORY TILES SHOWCASE ───────────── */}
            <div className="lg:col-span-6 relative flex justify-center lg:justify-end">
              
              {/* Ambient Spotlight Flare */}
              <div className="absolute inset-0 bg-gradient-to-tr from-[#D97706]/10 via-[#15803D]/10 to-transparent rounded-3xl blur-2xl transform scale-110 pointer-events-none" />
              
              {/* Directory Tiles Grid */}
              <div className="w-full max-w-[500px] grid grid-cols-1 sm:grid-cols-2 gap-3.5 p-2">
                {topApps.slice(0, 4).map((app) => {
                  const iconSrc = getPlatformIcon(app);
                  const initialLetter = (app.name || 'A').trim().charAt(0).toUpperCase();

                  return (
                    <div
                      key={app.id}
                      onClick={() => handleCardClick(app)}
                      className="group relative rounded-2xl bg-white border border-[#E7DFD5] p-4 shadow-sm hover:border-[#15803D] hover:shadow-md transition-all duration-200 cursor-pointer overflow-hidden warm-card-shadow flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center gap-3 mb-3">
                          <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-[#FAF8F5] border border-[#E7DFD5] flex-shrink-0 flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
                            <img
                              src={app.logoUrl || `https://www.google.com/s2/favicons?domain=${app.domain}&sz=128`}
                              alt={`${app.name} icon`}
                              className="w-12 h-12 rounded-xl object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = `https://www.google.com/s2/favicons?domain=${app.domain || 'google.com'}&sz=128`;
                              }}
                            />
                          </div>

                          <div className="min-w-0 flex-1">
                            <h4 className="font-extrabold text-xs sm:text-sm text-[#1C1917] truncate group-hover:text-[#15803D] transition-colors">
                              {app.name}
                            </h4>
                            <p className="text-[11px] text-[#78716C] truncate font-medium">
                              {app.developer}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 mb-2">
                          <span className="px-2 py-0.5 rounded-md bg-[#15803D]/10 text-[#15803D] text-[10px] font-bold uppercase">
                            {app.content_focus}
                          </span>
                          <span className="px-1.5 py-0.5 rounded-md bg-[#FFFBEB] text-[#D97706] text-[10px] font-bold flex items-center gap-0.5 border border-[#FEF3C7]">
                            <Star className="w-2.5 h-2.5 fill-[#D97706]" />
                            <span>{app.rating.toFixed(1)}</span>
                          </span>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-[#F5F2EB] flex items-center justify-between text-[11px]">
                        <span className="text-[#78716C] font-semibold">{app.download_count} installs</span>
                        <span className="text-[#15803D] font-bold group-hover:underline flex items-center gap-0.5">
                          <span>View</span>
                          <ChevronRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* ── SECTION 2: TOP FEATURED PLATFORMS DIRECTORY ───────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#15803D]/10 text-[#15803D] text-xs font-extrabold uppercase tracking-wider mb-2">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Trending Mobile Apps</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#1C1917] tracking-tight">
              Featured Mini-Drama Publishers
            </h2>
            <p className="text-xs sm:text-sm text-[#57534E]">
              Verified mobile apps with top ratings and high-volume episode production catalogs
            </p>
          </div>

          <button
            onClick={onNavigateToDirectory}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-extrabold text-[#15803D] hover:text-[#166534] hover:underline cursor-pointer"
          >
            <span>View All {activeCount} Apps</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Directory Grid with Square App Icons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {topApps.map((app) => {
            const iconSrc = getPlatformIcon(app);
            const initialLetter = (app.name || 'A').trim().charAt(0).toUpperCase();

            return (
              <div
                key={app.id}
                onClick={() => onSelectPlatform(app)}
                className="group relative rounded-2xl bg-white border border-[#E7DFD5] p-5 hover:border-[#15803D] transition-all duration-200 warm-card-shadow hover:warm-card-hover hover:-translate-y-0.5 cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start gap-3.5 mb-3.5">
                    <div className="relative w-14 h-14 rounded-2xl shadow-xs border border-[#E7DFD5] bg-[#FAF8F5] flex-shrink-0 overflow-hidden flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
                      {!imgErrorMap[app.id] && iconSrc ? (
                        <img
                          src={iconSrc}
                          alt={app.name}
                          className="w-full h-full object-cover rounded-2xl"
                          onError={() => setImgErrorMap(prev => ({ ...prev, [app.id]: true }))}
                        />
                      ) : (
                        <div className="w-full h-full bg-[#15803D] flex items-center justify-center font-bold text-white text-xl">
                          {initialLetter}
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-extrabold text-[#1C1917] truncate group-hover:text-[#15803D] transition-colors">
                        {app.name}
                      </h3>
                      <p className="text-xs text-[#78716C] truncate font-medium">
                        {app.developer}
                      </p>
                      <div className="flex items-center gap-1 text-xs font-bold text-[#D97706] mt-1">
                        <Star className="w-3 h-3 fill-[#D97706]" />
                        <span>{app.rating.toFixed(1)}</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-[#57534E] line-clamp-2 leading-relaxed mb-3">
                    {app.description}
                  </p>

                  <div className="flex flex-wrap gap-1 mb-3">
                    {app.specialties.slice(0, 2).map((spec) => (
                      <span
                        key={spec}
                        className="px-2 py-0.5 text-[10px] font-medium bg-[#F5F2EB] text-[#57534E] rounded-md border border-[#E7DFD5]"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-[#F5F2EB] flex items-center justify-between text-xs">
                  <span className="font-semibold text-[#15803D]">{app.download_count} Downloads</span>
                  <span className="font-bold text-[#78716C] group-hover:text-[#15803D] flex items-center gap-1">
                    <span>Details</span>
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── SECTION 3: MONETIZATION TIERS CALLOUT (PUBLISHER PORTAL) ────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-br from-[#1C1917] via-[#292524] to-[#1C1917] text-white p-6 sm:p-10 shadow-2xl relative overflow-hidden">
          
          {/* Ambient Glow */}
          <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-[#15803D]/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -left-20 -top-20 w-80 h-80 bg-[#D97706]/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            
            <div className="lg:col-span-2 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#15803D]/20 border border-[#15803D]/40 text-[#22C55E] text-xs font-bold uppercase tracking-wider">
                <Award className="w-3.5 h-3.5" />
                <span>Publisher & Studio Sponsorships</span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                Spotlight Your Mini-Drama App to Mobile Viewers
              </h2>

              <p className="text-xs sm:text-sm text-[#D6D3D1] leading-relaxed max-w-xl">
                Feature your platform with Standard Spotlight placement ($399/wk) or guaranteed #1 Sticky Hero positioning ($599/wk) with direct store download tracking.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-white text-sm">Standard Spotlight</span>
                    <span className="font-mono text-[#22C55E] font-black text-sm">$399/wk</span>
                  </div>
                  <p className="text-[11px] text-[#A8A29E]">
                    Prominent placement in the top Featured App Carousel + verified directory badge.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#15803D]/20 border border-[#15803D]/50">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-white text-sm flex items-center gap-1">
                      <span>Premium Featured</span>
                      <Sparkles className="w-3.5 h-3.5 text-[#22C55E]" />
                    </span>
                    <span className="font-mono text-[#22C55E] font-black text-sm">$599/wk</span>
                  </div>
                  <p className="text-[11px] text-[#D6D3D1]">
                    Guaranteed #1 Sticky Hero banner, top category pin & direct store routing.
                  </p>
                </div>
              </div>
            </div>

            {/* CTA Button Box */}
            <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-white/5 border border-white/10 text-center">
              <span className="text-xs text-[#A8A29E] font-bold uppercase tracking-wider mb-2">
                Ready to Launch Your Campaign?
              </span>
              <button
                onClick={onNavigateToSponsor}
                className="w-full py-3.5 px-6 rounded-xl bg-[#22C55E] hover:bg-[#16A34A] text-[#0E0308] font-extrabold text-sm transition-transform hover:scale-103 shadow-lg shadow-[#22C55E]/25 flex items-center justify-center gap-2 cursor-pointer mb-3"
              >
                <span>Select Sponsorship Tier</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <span className="text-[11px] text-[#78716C]">
                Self-serve instant review & direct store routing
              </span>
            </div>

          </div>

        </div>
      </section>

    </div>
  );
};
