import React, { useState, useEffect, useCallback } from 'react';
import { 
  Sparkles, ChevronLeft, ChevronRight, Star, Download, Play, 
  Apple, PlayCircle, PauseCircle, Film, Volume2, VolumeX, Eye
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
  const posterUrl = activePlatform.poster_url || 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=600&h=1067&q=80';

  return (
    <div className="relative rounded-3xl bg-white border border-[#E7DFD5] p-5 sm:p-8 mb-10 overflow-hidden shadow-xl warm-card-shadow">
      
      {/* Ambient Warm Theater Projector Lighting */}
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
              <h2 className="text-lg sm:text-xl font-extrabold text-[#1C1917] tracking-tight font-['Cinzel',serif]">
                Spotlight Showcase
              </h2>
              <span className="px-2 py-0.5 text-[10px] font-black uppercase tracking-wider bg-[#15803D]/10 text-[#15803D] border border-[#15803D]/25 rounded-full">
                Featured 10
              </span>
            </div>
            <p className="text-xs text-[#78716C]">
              Curated top-performing mini-drama publishers with verified production catalogs
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
            title={isMuted ? 'Unmute theater chime' : 'Mute theater chime'}
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
        
        {/* Active Poster Preview (9:16 Aspect) */}
        <div className="lg:col-span-4 flex justify-center">
          <div 
            onClick={() => onSelectPlatform(activePlatform)}
            className="relative w-56 sm:w-64 aspect-[9/14] rounded-3xl overflow-hidden bg-[#F5F2EB] border-2 border-[#E7DFD5] shadow-xl hover:border-[#15803D] transition-all duration-300 cursor-pointer group"
          >
            <img
              src={posterUrl}
              alt={activePlatform.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 flex flex-col justify-between p-4">
              <div className="flex justify-between items-center">
                <span className="px-2.5 py-1 rounded-full bg-[#15803D] text-white text-[10px] font-black uppercase">
                  {activePlatform.content_focus}
                </span>
                <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-xs text-amber-300 text-[10px] font-bold flex items-center gap-1">
                  <Star className="w-3 h-3 fill-amber-300" />
                  {activePlatform.rating.toFixed(1)}
                </span>
              </div>

              <div>
                <div className="text-white font-extrabold text-base leading-tight drop-shadow-md mb-1">
                  {activePlatform.name}
                </div>
                <div className="text-white/80 text-[11px] font-medium flex items-center gap-1">
                  <Eye className="w-3 h-3 text-[#22C55E]" />
                  <span>Click to view trailer & episodes</span>
                </div>
              </div>
            </div>
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
              Developed by {activePlatform.developer}
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
              href={activePlatform.platform_url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-xl bg-[#15803D] hover:bg-[#166534] text-white font-extrabold text-xs sm:text-sm flex items-center gap-2 transition-all shadow-md shadow-[#15803D]/20 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Google Play</span>
            </a>

            {activePlatform.app_store_url && (
              <a
                href={activePlatform.app_store_url}
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
              Full Profile & Trailers
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
                  className={`w-11 h-11 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all cursor-pointer ${
                    activeIndex === idx
                      ? 'border-[#15803D] scale-110 shadow-md ring-2 ring-[#15803D]/30'
                      : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                  title={p.name}
                >
                  <img
                    src={p.icon_url}
                    alt={p.name}
                    className="w-full h-full object-cover"
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
