import React, { useState } from 'react';
import { 
  Sparkles, Play, Award, Film, ArrowRight, Star, Download, 
  Smartphone, CheckCircle2, ShieldCheck, Zap, Compass, ChevronRight,
  TrendingUp, Tv, Flame, Volume2, VolumeX, Eye, Layers, Lock
} from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { Platform } from '@/types';

interface LandingViewProps {
  onNavigateToDirectory: () => void;
  onNavigateToSponsor: () => void;
  onSelectPlatform: (platform: Platform) => void;
}

interface DemoClip {
  id: string;
  title: string;
  genre: string;
  platform: string;
  episodes: string;
  duration: string;
  synopsis: string;
  poster: string;
  views: string;
  rating: number;
}

const DEMO_CLIPS: DemoClip[] = [
  {
    id: 'clip_1',
    title: 'The Double Life of My Billionaire Husband',
    genre: 'Romance',
    platform: 'ReelShort',
    episodes: '72 Episodes',
    duration: '1.5 min/ep',
    synopsis: 'A waitress in debt enters a secret contract marriage with an eccentric driver, unaware he is secretly the city’s most elusive trillionaire.',
    poster: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=600&h=1067&q=80',
    views: '18.4M',
    rating: 4.9,
  },
  {
    id: 'clip_2',
    title: 'Forbidden Alpha: The Silver Moon Heir',
    genre: 'Romance',
    platform: 'Sereal+',
    episodes: '65 Episodes',
    duration: '1.2 min/ep',
    synopsis: 'Exiled from the Silver Pack for a crime she did not commit, she returns five years later with an uncanny heir who commands the wolf king’s aura.',
    poster: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=600&h=1067&q=80',
    views: '12.8M',
    rating: 4.8,
  },
  {
    id: 'clip_3',
    title: 'Revenge of the Disgraced Ex-Heiress',
    genre: 'Drama',
    platform: 'DramaBox',
    episodes: '80 Episodes',
    duration: '2.0 min/ep',
    synopsis: 'Framed and left penniless in the rain, Victoria re-emerges as the venture capitalist purchasing her corrupt family’s ancestral empire.',
    poster: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&h=1067&q=80',
    views: '21.1M',
    rating: 4.9,
  },
  {
    id: 'clip_4',
    title: 'CEO in Disguise: Hidden Billionaire',
    genre: 'Multi-Genre',
    platform: 'ShortMax',
    episodes: '58 Episodes',
    duration: '1.0 min/ep',
    synopsis: 'Disguised as a humble intern at his own multi-national enterprise, Marcus discovers the company board is plotting to oust his rightful inheritance.',
    poster: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=600&h=1067&q=80',
    views: '15.6M',
    rating: 4.8,
  },
  {
    id: 'clip_5',
    title: 'Contract Bride of the Tycoon',
    genre: 'Romance',
    platform: 'FreeReels',
    episodes: '60 Episodes',
    duration: '1.4 min/ep',
    synopsis: 'To save her family clinic, Clara signs a one-year marriage agreement with a reclusive billionaire whose past harbors dangerous secrets.',
    poster: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&h=1067&q=80',
    views: '14.2M',
    rating: 4.7,
  }
];

// Mosaic Wall Key-Art Items
const MOSAIC_CARDS_COL1 = [
  {
    id: 'rs',
    title: 'The Double Life of My Billionaire Husband',
    platform: 'ReelShort',
    genre: 'Romance',
    rating: 4.9,
    episodes: '72 Eps',
    poster: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=600&h=1067&q=80',
    tag: 'Billionaire'
  },
  {
    id: 'db',
    title: 'Revenge of the Ex-Heiress',
    platform: 'DramaBox',
    genre: 'Drama',
    rating: 4.8,
    episodes: '80 Eps',
    poster: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&h=1067&q=80',
    tag: 'Revenge'
  },
  {
    id: 'ft',
    title: 'Mr. Williams! Madam is Dying',
    platform: 'FlexTV',
    genre: 'Multi-Genre',
    rating: 4.8,
    episodes: '64 Eps',
    poster: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=600&h=1067&q=80',
    tag: 'Suspense'
  },
];

const MOSAIC_CARDS_COL2 = [
  {
    id: 'sr',
    title: 'Forbidden Alpha: Silver Moon',
    platform: 'Sereal+',
    genre: 'Romance',
    rating: 4.8,
    episodes: '65 Eps',
    poster: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=600&h=1067&q=80',
    tag: 'Werewolf'
  },
  {
    id: 'sm',
    title: 'CEO in Disguise: Hidden Billionaire',
    platform: 'ShortMax',
    genre: 'Multi-Genre',
    rating: 4.8,
    episodes: '58 Eps',
    poster: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=600&h=1067&q=80',
    tag: 'CEO'
  },
  {
    id: 'pine',
    title: 'Shadow of the Empress',
    platform: 'PineDrama',
    genre: 'Drama',
    rating: 4.8,
    episodes: '90 Eps',
    poster: 'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=600&h=1067&q=80',
    tag: 'Historical'
  },
];

export const LandingView: React.FC<LandingViewProps> = ({
  onNavigateToDirectory,
  onNavigateToSponsor,
  onSelectPlatform,
}) => {
  const { platforms, spotlightPlatforms } = useApp();
  const [activeClipIndex, setActiveClipIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isAudioActive, setIsAudioActive] = useState(false);

  const activeClip = DEMO_CLIPS[activeClipIndex];
  const activeCount = platforms.filter(p => p.active).length;

  const handleCardClick = (platformId: string) => {
    const matched = platforms.find(p => p.id === platformId);
    if (matched) {
      onSelectPlatform(matched);
    } else {
      onNavigateToDirectory();
    }
  };

  return (
    <div className="space-y-16 pb-12">
      
      {/* ── CINEMATIC HERO SECTION (HBO MAX / MGM+ STREAMING AESTHETIC) ──────── */}
      <section className="relative overflow-hidden pt-8 sm:pt-14 pb-16 border-b border-[#E7DFD5] bg-gradient-to-b from-[#FAF8F5] via-[#F4EFE6] to-[#FAF8F5]">
        
        {/* Deep Theater Projector Beams & Warm Atmospheric Glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[520px] theater-projector-beam pointer-events-none opacity-90" />
        <div className="absolute -top-24 left-1/4 w-[480px] h-[480px] bg-[#D97706]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-16 right-1/4 w-[480px] h-[480px] bg-[#15803D]/12 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
            
            {/* ── LEFT COLUMN: BOLD HEADLINE & HIGH-CONTRAST CTAS ────────────── */}
            <div className="lg:col-span-6 text-left space-y-6">
              
              {/* Live Curated Marquee Pill */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/95 border border-[#E7DFD5] text-[#15803D] text-xs font-extrabold shadow-sm">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#15803D] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#15803D]"></span>
                </span>
                <span className="uppercase tracking-wider">Curated Vertical Drama Directory</span>
                <span className="text-[#A8A29E]">•</span>
                <span className="text-[#57534E] font-medium">{activeCount} Verified Streaming Platforms</span>
              </div>

              {/* Bold Cinematic Title Treatment */}
              <h1 className="text-3xl sm:text-5xl lg:text-5xl xl:text-6xl font-black text-[#1C1917] tracking-tight leading-[1.08] font-['Cinzel',serif]">
                The Ultimate Stage For <br />
                <span className="text-[#15803D] bg-gradient-to-r from-[#D97706] via-[#B45309] to-[#15803D] bg-clip-text text-transparent">
                  Vertical Mini-Dramas
                </span>
              </h1>

              {/* Punchy Value Proposition */}
              <p className="text-sm sm:text-base text-[#57534E] leading-relaxed max-w-xl">
                Discover verified episodic 9:16 mobile micro-series, billionaire romance twists, alpha suspense, and revenge loops — with direct live store links for iOS and Android.
              </p>

              {/* High-Contrast Action CTAs */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
                <button
                  id="hero-cta-explore-directory"
                  onClick={onNavigateToDirectory}
                  className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-[#D97706] via-[#C46806] to-[#B45309] hover:from-[#B45309] hover:to-[#92400E] text-white font-extrabold text-sm sm:text-base flex items-center justify-center gap-2.5 transition-all duration-200 hover:scale-102 shadow-lg shadow-[#D97706]/25 cursor-pointer"
                >
                  <Compass className="w-5 h-5 text-amber-100" />
                  <span>Explore Free Directory</span>
                  <ArrowRight className="w-4 h-4 text-amber-100" />
                </button>

                <button
                  id="hero-cta-advertise"
                  onClick={onNavigateToSponsor}
                  className="px-7 py-3.5 rounded-2xl bg-white hover:bg-[#F5F2EB] text-[#1C1917] border-2 border-[#D8D1C5] hover:border-[#D97706] font-extrabold text-sm sm:text-base flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer shadow-sm"
                >
                  <Award className="w-5 h-5 text-[#D97706]" />
                  <span>Advertise Your App</span>
                </button>
              </div>

              {/* Editorial Quality Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-2 gap-3 pt-2 text-xs text-[#57534E] font-semibold border-t border-[#E7DFD5]/80">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#15803D] flex-shrink-0" />
                  <span>100% Free Directory Access</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#15803D] flex-shrink-0" />
                  <span>Direct iOS & Android Links</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#15803D] flex-shrink-0" />
                  <span>Verified Editorial Quality</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#15803D] flex-shrink-0" />
                  <span>40+ Indexed Mobile Catalogs</span>
                </div>
              </div>

            </div>

            {/* ── RIGHT COLUMN: ANGLED/ISOMETRIC POSTER MOSAIC WALL ───────────── */}
            <div className="lg:col-span-6 relative flex justify-center lg:justify-end">
              
              {/* Ambient Spotlight Flare behind Mosaic */}
              <div className="absolute inset-0 bg-gradient-to-tr from-[#D97706]/20 via-[#15803D]/15 to-transparent rounded-3xl blur-2xl transform scale-110 pointer-events-none" />
              
              {/* Isometric 3D Showcase Stage */}
              <div className="perspective-container w-full max-w-[520px] overflow-hidden p-2 sm:p-4">
                
                <div className="isometric-wall grid grid-cols-2 gap-3.5 sm:gap-4.5 scale-95 sm:scale-100 transform origin-center">
                  
                  {/* Staggered Column 1 */}
                  <div className="space-y-4 animate-float-1">
                    {MOSAIC_CARDS_COL1.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => handleCardClick(item.id)}
                        className="group relative rounded-2xl bg-white border border-[#E7DFD5] p-2.5 shadow-xl hover:border-[#D97706] hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden warm-card-shadow"
                      >
                        {/* 9:16 Vertical Poster */}
                        <div className="relative aspect-[9/13] rounded-xl overflow-hidden bg-[#1C1917] mb-2">
                          <img
                            src={item.poster}
                            alt={item.title}
                            className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-500"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 flex flex-col justify-between p-2">
                            <div className="flex justify-between items-center">
                              <span className="px-2 py-0.5 rounded-full bg-[#15803D] text-white text-[9px] font-extrabold uppercase">
                                {item.platform}
                              </span>
                              <span className="px-1.5 py-0.5 rounded-full bg-black/60 backdrop-blur-xs text-amber-300 text-[9px] font-bold flex items-center gap-0.5">
                                <Star className="w-2.5 h-2.5 fill-amber-300" />
                                <span>{item.rating}</span>
                              </span>
                            </div>
                            
                            <div>
                              <span className="inline-block px-1.5 py-0.5 rounded bg-white/20 backdrop-blur-xs text-white text-[8px] font-bold">
                                {item.episodes}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Title & Tag */}
                        <div>
                          <h4 className="font-extrabold text-xs text-[#1C1917] truncate group-hover:text-[#D97706] transition-colors">
                            {item.title}
                          </h4>
                          <div className="flex items-center justify-between text-[10px] text-[#78716C] mt-0.5">
                            <span>{item.genre}</span>
                            <span className="font-bold text-[#15803D]">#{item.tag}</span>
                          </div>
                        </div>

                      </div>
                    ))}
                  </div>

                  {/* Staggered Column 2 (Offset by mt-8) */}
                  <div className="space-y-4 mt-8 animate-float-2">
                    {MOSAIC_CARDS_COL2.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => handleCardClick(item.id)}
                        className="group relative rounded-2xl bg-white border border-[#E7DFD5] p-2.5 shadow-xl hover:border-[#D97706] hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden warm-card-shadow"
                      >
                        {/* 9:16 Vertical Poster */}
                        <div className="relative aspect-[9/13] rounded-xl overflow-hidden bg-[#1C1917] mb-2">
                          <img
                            src={item.poster}
                            alt={item.title}
                            className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-500"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 flex flex-col justify-between p-2">
                            <div className="flex justify-between items-center">
                              <span className="px-2 py-0.5 rounded-full bg-[#D97706] text-white text-[9px] font-extrabold uppercase">
                                {item.platform}
                              </span>
                              <span className="px-1.5 py-0.5 rounded-full bg-black/60 backdrop-blur-xs text-amber-300 text-[9px] font-bold flex items-center gap-0.5">
                                <Star className="w-2.5 h-2.5 fill-amber-300" />
                                <span>{item.rating}</span>
                              </span>
                            </div>
                            
                            <div>
                              <span className="inline-block px-1.5 py-0.5 rounded bg-white/20 backdrop-blur-xs text-white text-[8px] font-bold">
                                {item.episodes}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Title & Tag */}
                        <div>
                          <h4 className="font-extrabold text-xs text-[#1C1917] truncate group-hover:text-[#D97706] transition-colors">
                            {item.title}
                          </h4>
                          <div className="flex items-center justify-between text-[10px] text-[#78716C] mt-0.5">
                            <span>{item.genre}</span>
                            <span className="font-bold text-[#D97706]">#{item.tag}</span>
                          </div>
                        </div>

                      </div>
                    ))}
                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>
      </section>

      {/* ── SECTION 2: INTERACTIVE 9:16 TRAILER & MOBILE SHOWCASE ───────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="bg-white border-2 border-[#E7DFD5] rounded-3xl p-5 sm:p-8 shadow-2xl warm-card-shadow">
          
          <div className="flex flex-col lg:flex-row items-center gap-8">
            
            {/* 9:16 Smartphone Preview Mockup */}
            <div className="relative w-64 sm:w-72 aspect-[9/16] rounded-[2.5rem] bg-[#1C1917] p-3 shadow-2xl ring-8 ring-[#292524] ring-offset-4 ring-offset-[#FAF8F5] flex-shrink-0 overflow-hidden">
              
              {/* Speaker & Camera Notch */}
              <div className="absolute top-4 left-1/2 -translate-x-1/2 w-20 h-4 bg-[#0C0A09] rounded-full z-30 flex items-center justify-center">
                <div className="w-2.5 h-2.5 rounded-full bg-[#292524]"></div>
              </div>

              {/* 9:16 Simulated Video Screen */}
              <div className="relative w-full h-full rounded-[2rem] overflow-hidden bg-[#0C0A09]">
                <img
                  src={activeClip.poster}
                  alt={activeClip.title}
                  className="w-full h-full object-cover"
                />

                {/* Gradient Overlay & Controls inside Phone */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/40 flex flex-col justify-between p-4 z-20">
                  
                  {/* Top Bar inside Phone */}
                  <div className="flex justify-between items-center pt-5 text-[10px] text-white/90 font-bold">
                    <span className="px-2 py-0.5 rounded-full bg-[#15803D] text-white">
                      {activeClip.platform}
                    </span>
                    <span className="bg-black/40 backdrop-blur-sm px-2 py-0.5 rounded-full">
                      {activeClip.episodes}
                    </span>
                  </div>

                  {/* Center Play Indicator */}
                  <div className="flex items-center justify-center">
                    <button
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="w-12 h-12 rounded-full bg-[#D97706]/90 text-white flex items-center justify-center hover:scale-110 transition-transform shadow-lg cursor-pointer"
                    >
                      <Play className="w-5 h-5 fill-white ml-0.5" />
                    </button>
                  </div>

                  {/* Bottom Info inside Phone */}
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-1.5 text-[11px] text-amber-300 font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-300" />
                      <span>{activeClip.rating}</span>
                      <span className="text-white/60">•</span>
                      <span className="text-white/80">{activeClip.views} views</span>
                    </div>
                    <h4 className="text-xs font-extrabold text-white line-clamp-2 leading-tight">
                      {activeClip.title}
                    </h4>
                    
                    {/* Progress Bar Animation */}
                    <div className="w-full bg-white/20 h-1 rounded-full overflow-hidden">
                      <div className="bg-[#22C55E] h-full w-2/3 animate-pulse"></div>
                    </div>
                  </div>

                </div>
              </div>
            </div>

            {/* Right Side: Interactive Episode & Platform Selector */}
            <div className="flex-1 space-y-5">
              <div className="border-b border-[#E7DFD5] pb-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D97706]/10 text-[#D97706] text-xs font-extrabold uppercase tracking-wider mb-2">
                  <Flame className="w-3.5 h-3.5" />
                  <span>Trending Vertical Drama Spotlight</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-[#1C1917]">
                  {activeClip.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#57534E] leading-relaxed mt-2">
                  {activeClip.synopsis}
                </p>
              </div>

              {/* Episodes & Platform Specs */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E7DFD5]">
                  <span className="text-[#78716C] block">Host Platform</span>
                  <span className="font-extrabold text-[#1C1917]">{activeClip.platform}</span>
                </div>
                <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E7DFD5]">
                  <span className="text-[#78716C] block">Pacing</span>
                  <span className="font-extrabold text-[#1C1917]">{activeClip.duration}</span>
                </div>
                <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E7DFD5]">
                  <span className="text-[#78716C] block">Genre Category</span>
                  <span className="font-extrabold text-[#15803D]">{activeClip.genre}</span>
                </div>
              </div>

              {/* Switcher Tabs for Trending Clips */}
              <div>
                <span className="text-xs font-bold text-[#78716C] uppercase tracking-wider block mb-2">
                  Select Featured Trailer Clip:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {DEMO_CLIPS.map((clip, idx) => (
                    <button
                      key={clip.id}
                      onClick={() => setActiveClipIndex(idx)}
                      className={`p-2.5 rounded-xl text-left text-xs transition-all cursor-pointer border ${
                        activeClipIndex === idx
                          ? 'bg-[#15803D] text-white border-[#15803D] shadow-md shadow-[#15803D]/20 font-bold'
                          : 'bg-[#FAF8F5] text-[#57534E] border-[#E7DFD5] hover:bg-[#F5F2EB]'
                      }`}
                    >
                      <span className="block truncate font-bold">{clip.platform}</span>
                      <span className="text-[10px] opacity-80 truncate block">{clip.genre}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Direct Launch Button */}
              <div className="pt-2">
                <button
                  onClick={onNavigateToDirectory}
                  className="px-6 py-3 rounded-xl bg-[#1C1917] hover:bg-[#292524] text-white text-xs sm:text-sm font-extrabold flex items-center gap-2 transition-transform hover:scale-102 cursor-pointer shadow-md"
                >
                  <span>Find {activeClip.platform} & 40+ Apps in Directory</span>
                  <ArrowRight className="w-4 h-4 text-[#22C55E]" />
                </button>
              </div>

            </div>

          </div>

        </div>

      </section>

      {/* ── SECTION 3: TOP TRENDING VERTICAL POSTER GALLERY ─────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D97706]/10 text-[#D97706] text-xs font-extrabold uppercase tracking-wider mb-2">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Trending Mobile Releases</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#1C1917] tracking-tight font-['Cinzel',serif]">
              Popular Vertical Drama Series
            </h2>
            <p className="text-xs sm:text-sm text-[#57534E]">
              The highest rated 9:16 short-form drama titles across top U.S. mobile catalogs
            </p>
          </div>

          <button
            onClick={onNavigateToDirectory}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-extrabold text-[#15803D] hover:text-[#166534] hover:underline cursor-pointer"
          >
            <span>View All {activeCount} Apps in Directory</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* 4 Prominent 9:16 Vertical Poster Showcase */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {spotlightPlatforms.slice(0, 4).map((p) => (
            <div
              key={p.id}
              onClick={() => onSelectPlatform(p)}
              className="group relative rounded-3xl bg-white border border-[#E7DFD5] p-3.5 hover:border-[#15803D] transition-all duration-300 warm-card-shadow hover:warm-card-hover hover:-translate-y-1 cursor-pointer flex flex-col justify-between"
            >
              {/* 9:16 Vertical Poster Image */}
              <div className="relative aspect-[9/14] rounded-2xl overflow-hidden bg-[#F5F2EB] mb-3.5">
                <img
                  src={p.poster_url || 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=600&h=1067&q=80'}
                  alt={p.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                
                {/* Spotlight Badge */}
                <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[10px] font-extrabold flex items-center gap-1">
                  <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                  <span>{p.rating.toFixed(1)}</span>
                </div>

                {/* Genre Tag */}
                <div className="absolute bottom-2.5 left-2.5 px-2.5 py-0.5 rounded-md bg-[#15803D] text-white text-[10px] font-black uppercase tracking-wider">
                  {p.content_focus}
                </div>
              </div>

              {/* Card Meta */}
              <div>
                <h3 className="font-extrabold text-sm text-[#1C1917] truncate group-hover:text-[#15803D] transition-colors">
                  {p.name}
                </h3>
                <p className="text-[11px] text-[#78716C] truncate mb-2">
                  {p.developer}
                </p>
                <p className="text-xs text-[#57534E] line-clamp-2 leading-relaxed mb-3">
                  {p.tagline}
                </p>
              </div>

              {/* Direct Store Action */}
              <div className="pt-2 border-t border-[#F5F2EB] flex items-center justify-between text-xs">
                <span className="font-bold text-[#15803D]">{p.download_count} Downloads</span>
                <span className="font-bold text-[#78716C] group-hover:text-[#15803D] flex items-center gap-1">
                  <span>Explore</span>
                  <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── SECTION 4: MONETIZATION TIERS CALLOUT (PUBLISHER PORTAL) ────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-br from-[#1C1917] via-[#292524] to-[#1C1917] text-white p-6 sm:p-10 shadow-2xl relative overflow-hidden">
          
          {/* Subtle Ambient Glow */}
          <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-[#15803D]/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -left-20 -top-20 w-80 h-80 bg-[#D97706]/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            
            <div className="lg:col-span-2 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#15803D]/20 border border-[#15803D]/40 text-[#22C55E] text-xs font-bold uppercase tracking-wider">
                <Award className="w-3.5 h-3.5" />
                <span>Publisher & Studio Monetization</span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight font-['Cinzel',serif]">
                Spotlight Your Mini-Drama App to Millions of Mobile Viewers
              </h2>

              <p className="text-xs sm:text-sm text-[#D6D3D1] leading-relaxed max-w-xl">
                Directly feature your vertical series with rotating Spotlight carousel positions ($399/wk) or guaranteed #1 Sticky Hero banners with 9:16 trailer previews ($599/wk).
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-white text-sm">Standard Spotlight</span>
                    <span className="font-mono text-[#22C55E] font-black text-sm">$399/wk</span>
                  </div>
                  <p className="text-[11px] text-[#A8A29E]">
                    Rotating placement in the top 3D Spotlight carousel + verified directory badge.
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
                    Guaranteed #1 Sticky Hero banner, 9:16 trailer preview & top category pin.
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

