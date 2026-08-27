import React, { useState, useEffect, useCallback } from 'react';
import { 
  Sparkles, ChevronLeft, ChevronRight, Star, Download, Play, 
  Apple, PlayCircle, PauseCircle, Volume2, VolumeX, ShieldCheck, CheckCircle2,
  ExternalLink, Layers
} from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { Platform } from '@/types';

interface SpotlightCarouselProps {
  onSelectPlatform: (platform: Platform) => void;
}

export const SpotlightCarousel: React.FC<SpotlightCarouselProps> = ({ onSelectPlatform }) => {
  const { spotlightPlatforms } = useApp();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoSpin, setIsAutoSpin] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  
  const items = spotlightPlatforms.slice(0, 10);
  const total = items.length;

  const playCinemaSound = useCallback(() => {
    if (isMuted) return;
    try {
      const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.06, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.15);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.16);
    } catch (_) {}
  }, [isMuted]);

  useEffect(() => {
    if (total <= 1 || !isAutoSpin) return;
    const timer = setInterval(() => {
      setActiveIndex(prev => (prev + 1) % total);
    }, 4500);
    return () => clearInterval(timer);
  }, [total, isAutoSpin]);

  const handlePrev = () => {
    setActiveIndex(prev => (prev - 1 + total) % total);
    playCinemaSound();
  };

  const handleNext = () => {
    setActiveIndex(prev => (prev + 1) % total);
    playCinemaSound();
  };

  if (total === 0) return null;

  const activePlatform = items[activeIndex];

  const playUrl = activePlatform.playStoreUrl || (activePlatform.platform_url?.includes('play.google.com')
    ? activePlatform.platform_url
    : `https://play.google.com/store/search?q=${encodeURIComponent(activePlatform.name)}&c=apps`);

  const appleUrl = activePlatform.appStoreUrl || activePlatform.app_store_url ||
    `https://apps.apple.com/us/search?term=${encodeURIComponent(activePlatform.name)}`;

  return (
    <div className="relative rounded-3xl bg-white border border-[#E7DFD5] p-5 sm:p-8 mb-10 overflow-hidden shadow-xl warm-card-shadow">
      
      {/* Ambient Warm Lighting */}
      <div className="absolute top-0 right-1/3 w-72 h-72 bg-[#D97706]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-[#15803D]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Row: Title & Control Switches */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-[#F5F2EB] pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#D97706]/15 text-[#D97706] flex items-center justify-center font-bold">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-extrabold text-[#1C1917] tracking-tight">
                Featured App Spotlight
              </h2>
              <span className="px-2 py-0.5 text-[10px] font-black uppercase tracking-wider bg-[#15803D]/10 text-[#15803D] border border-[#15803D]/25 rounded-full">
                Top 10 Apps
              </span>
            </div>
            <p className="text-xs text-[#78716C]">
              Curated top-performing mini-drama publishers with official store apps
            </p>
          </div>
        </div>

        {/* Carousel Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAutoSpin(!isAutoSpin)}
            className={`p-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors border cursor-pointer ${
              isAutoSpin 
                ? 'bg-[#E8F2EC] text-[#15803D] border-[#D1E5D8]' 
                : 'bg-[#FAF8F5] text-[#78716C] border-[#E7DFD5]'
            }`}
            title={isAutoSpin ? 'Pause auto rotation' : 'Start auto rotation'}
          >
            {isAutoSpin ? <PauseCircle className="w-4 h-4" /> : <PlayCircle className="w-4 h-4" />}
            <span className="hidden sm:inline">{isAutoSpin ? 'Auto' : 'Paused'}</span>
          </button>

          <button
            onClick={() => {
              setIsMuted(!isMuted);
              if (isMuted) playCinemaSound();
            }}
            className={`p-2 rounded-xl text-xs font-bold transition-colors border cursor-pointer ${
              !isMuted 
                ? 'bg-[#FEF3C7] text-[#D97706] border-[#FDE68A]' 
                : 'bg-[#FAF8F5] text-[#78716C] border-[#E7DFD5]'
            }`}
            title={isMuted ? 'Unmute chime' : 'Mute chime'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          <div className="flex items-center gap-1 ml-1">
            <button
              onClick={handlePrev}
              className="p-2 rounded-xl bg-white hover:bg-[#F5F2EB] border border-[#D8D1C5] text-[#1C1917] hover:text-[#15803D] transition-colors cursor-pointer shadow-2xs"
              aria-label="Previous platform"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNext}
              className="p-2 rounded-xl bg-white hover:bg-[#F5F2EB] border border-[#D8D1C5] text-[#1C1917] hover:text-[#15803D] transition-colors cursor-pointer shadow-2xs"
              aria-label="Next platform"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Spotlight Highlight Area */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        
        {/* Active App Tile Showcase Box */}
        <div className="lg:col-span-4 flex justify-center">
          <div 
            onClick={() => onSelectPlatform(activePlatform)}
            className="w-full max-w-xs rounded-3xl bg-[#FAF8F5] border-2 border-[#E7DFD5] p-6 shadow-md hover:border-[#15803D] transition-all duration-300 cursor-pointer group flex flex-col items-center text-center"
          >
            {/* Large Rounded Square App Icon */}
            <div className="relative w-28 h-28 rounded-3xl overflow-hidden bg-[#FAF8F5] border-2 border-[#E7DFD5] shadow-lg mb-4 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
              <img
                src={activePlatform.logoUrl || `https://www.google.com/s2/favicons?domain=${activePlatform.domain}&sz=128`}
                alt={activePlatform.name}
                className="w-full h-full object-cover rounded-3xl"
              />
              <span className="absolute top-2 right-2 px-1.5 py-0.5 rounded-full bg-amber-400 text-[#1C1917] text-[9px] font-black uppercase shadow-xs">
                ★ {activePlatform.rating.toFixed(1)}
              </span>
            </div>

            <h4 className="text-lg font-black text-[#1C1917] group-hover:text-[#15803D] transition-colors mb-1 truncate max-w-full">
              {activePlatform.name}
            </h4>

            <p className="text-xs text-[#78716C] font-semibold mb-3 truncate max-w-full">
              {activePlatform.publisher || activePlatform.developer}
            </p>

            <div className="flex items-center gap-2 mb-4">
              <span className="px-2.5 py-0.5 rounded-full bg-[#15803D]/10 text-[#15803D] text-[11px] font-extrabold uppercase">
                {activePlatform.content_focus}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-[#F5F2EB] text-[#57534E] text-[11px] font-bold">
                {activePlatform.download_count} installs
              </span>
            </div>

            <span className="text-xs font-bold text-[#15803D] group-hover:underline flex items-center gap-1">
              <span>View Full App Specs</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>

        {/* Active Platform Story & Quick Link Controls */}
        <div className="lg:col-span-8 space-y-4">
          
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-[#15803D]/10 text-[#15803D] text-xs font-black uppercase tracking-wider">
              {activePlatform.content_focus} Category
            </span>
            <span className="px-3 py-1 rounded-full bg-[#FEF3C7] text-[#B45309] text-xs font-bold">
              ★ {activePlatform.rating.toFixed(1)} Rating ({activePlatform.review_count.toLocaleString()} reviews)
            </span>
            <span className="px-3 py-1 rounded-full bg-[#F5F2EB] text-[#57534E] text-xs font-bold">
              {activePlatform.download_count} Verified Downloads
            </span>
          </div>

          <div>
            <h3 className="text-2xl sm:text-3xl font-black text-[#1C1917] tracking-tight">
              {activePlatform.name}
            </h3>
            <p className="text-xs sm:text-sm text-[#78716C] font-semibold mt-0.5">
              Published by {activePlatform.publisher || activePlatform.developer}
            </p>
          </div>

          <p className="text-xs sm:text-sm text-[#44403C] leading-relaxed">
            {activePlatform.description}
          </p>

          {/* Trope Specialty Tags */}
          <div className="flex flex-wrap gap-2 pt-1">
            {activePlatform.specialties.map(spec => (
              <span 
                key={spec}
                className="px-3 py-1 rounded-xl bg-[#FAF8F5] border border-[#E7DFD5] text-[#57534E] text-xs font-bold"
              >
                #{spec}
              </span>
            ))}
          </div>

          {/* Store Download & Detail Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-3">
            <a
              href={playUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-xl bg-[#15803D] hover:bg-[#166534] text-white font-extrabold text-xs sm:text-sm flex items-center gap-2 transition-all shadow-md shadow-[#15803D]/20 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Google Play</span>
            </a>

            {(activePlatform.appStoreUrl || activePlatform.app_store_url) && (
              <a
                href={appleUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-xl bg-white hover:bg-[#F5F2EB] border border-[#D8D1C5] hover:border-[#15803D] text-[#1C1917] font-extrabold text-xs sm:text-sm flex items-center gap-2 transition-all shadow-2xs cursor-pointer"
              >
                <Apple className="w-4 h-4 fill-current" />
                <span>App Store</span>
              </a>
            )}

            <button
              onClick={() => onSelectPlatform(activePlatform)}
              className="px-4 py-2.5 rounded-xl bg-[#FAF8F5] hover:bg-[#E7DFD5] text-[#57534E] hover:text-[#1C1917] font-bold text-xs sm:text-sm transition-colors cursor-pointer"
            >
              Full Profile
            </button>
          </div>

          {/* Mini Thumbnail Strip for 10 Spotlight Apps */}
          <div className="pt-4 border-t border-[#F5F2EB]">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#78716C] block mb-2">
              Browse Spotlight ({activeIndex + 1} of {total}):
            </span>
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {items.map((p, idx) => (
                <button
                  key={p.id}
                  onClick={() => {
                    setActiveIndex(idx);
                    playCinemaSound();
                  }}
                  className={`w-11 h-11 rounded-xl overflow-hidden flex-shrink-0 border-2 bg-[#FAF8F5] flex items-center justify-center transition-all cursor-pointer ${
                    activeIndex === idx
                      ? 'border-[#15803D] scale-110 shadow-md ring-2 ring-[#15803D]/30'
                      : 'border-[#E7DFD5] opacity-70 hover:opacity-100'
                  }`}
                  title={p.name}
                >
                  <img
                    src={p.logoUrl || `https://www.google.com/s2/favicons?domain=${p.domain}&sz=128`}
                    alt={p.name}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </button>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

