import React, { useState, useEffect } from 'react';
import { 
  Sparkles, Award, ArrowRight, RefreshCw, AlertCircle, CheckCircle2, 
  Film, ShieldCheck, Zap, Globe, Smartphone, Play, Clapperboard, Star,
  ChevronLeft, ChevronRight, Compass
} from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { Platform } from '@/types';
import { SpotlightCarousel } from './SpotlightCarousel';
import { SearchBar } from './SearchBar';
import { GenreFilterBar } from './GenreFilterBar';
import { PlatformCard } from './PlatformCard';
import { PlatformDetailModal } from './PlatformDetailModal';

interface DiscoverViewProps {
  onNavigateToSponsor: () => void;
  onScanDiscovery?: () => void;
  isScanning?: boolean;
  scanResultMsg?: string | null;
}

const ITEMS_PER_PAGE = 12;

export const DiscoverView: React.FC<DiscoverViewProps> = ({
  onNavigateToSponsor,
  onScanDiscovery,
  isScanning = false,
  scanResultMsg = null,
}) => {
  const { filteredCatalog, searchQuery, selectedFilter, setSelectedFilter, setSearchQuery, platforms } = useApp();
  const [selectedPlatform, setSelectedPlatform] = useState<Platform | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Reset pagination when search query or genre filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedFilter]);

  const hasActiveFilters = searchQuery !== '' || selectedFilter !== 'All';

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedFilter('All');
    setCurrentPage(1);
  };

  const totalActive = platforms.filter(p => p.active).length;

  // Pagination Math
  const totalItems = filteredCatalog.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE) || 1;
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, totalItems);
  const currentItems = filteredCatalog.slice(startIndex, endIndex);

  // Find top sticky hero platform (Premium Featured tier)
  const premiumHeroPlatform = platforms.find(p => p.active && p.pinnedGenreTop) || platforms[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      
      {/* ── CINEMATIC THEATER HERO BANNER (WARM THEME) ─────────────────── */}
      <div className="relative rounded-3xl bg-gradient-to-r from-[#1C1917] via-[#292524] to-[#1C1917] text-white p-6 sm:p-8 mb-8 overflow-hidden shadow-xl">
        {/* Subtle Ambient Theater Projection */}
        <div className="absolute top-0 right-1/4 w-80 h-80 bg-[#15803D]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-[#D97706]/15 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="max-w-2xl text-center md:text-left">
            
            {/* 4 Standardized Verified Pillars Badges */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-3">
              <span className="px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider bg-[#15803D]/25 text-[#22C55E] border border-[#15803D]/40 rounded-full flex items-center gap-1.5 shadow-xs">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Curated Directory</span>
              </span>
              <span className="px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider bg-white/10 text-[#E7DFD5] border border-white/15 rounded-full flex items-center gap-1.5">
                <Smartphone className="w-3.5 h-3.5 text-[#22C55E]" />
                <span>Free Access</span>
              </span>
              <span className="px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider bg-white/10 text-[#E7DFD5] border border-white/15 rounded-full flex items-center gap-1.5">
                <Play className="w-3.5 h-3.5 text-[#22C55E]" />
                <span>Direct Store Links</span>
              </span>
              <span className="px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider bg-amber-500/15 text-amber-300 border border-amber-500/30 rounded-full flex items-center gap-1.5">
                <span>🇺🇸 U.S. Focus</span>
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight mb-2.5 font-['Cinzel',serif]">
              Vertical Mini-Drama <span className="text-[#22C55E]">Directory</span>
            </h1>
            <p className="text-xs sm:text-sm text-[#D6D3D1] leading-relaxed max-w-xl">
              Explore cataloged episodic short-form streaming apps, werewolf & billionaire romance series, and revenge cycles with verified live store download links.
            </p>
          </div>

          {/* Directory Stat Chip */}
          <div className="flex flex-col items-center sm:items-end justify-center gap-2 p-4 rounded-2xl bg-white/5 border border-white/10 flex-shrink-0">
            <div className="text-center sm:text-right">
              <span className="text-xs text-[#A8A29E] font-semibold block">Indexed Platforms</span>
              <span className="text-2xl sm:text-3xl font-black text-white font-mono">
                {totalActive} <span className="text-xs font-sans text-[#22C55E]">Verified</span>
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-[#A8A29E]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#22C55E]" />
              <span>Independent & Major Studios</span>
            </div>
          </div>
        </div>
      </div>

      {/* Live Discovery Notification Banner if any */}
      {scanResultMsg && (
        <div className="mb-6 p-4 rounded-2xl bg-[#E8F2EC] border border-[#D1E5D8] flex items-center justify-between gap-3 text-xs sm:text-sm text-[#15803D] shadow-xs animate-fade-in">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-[#15803D]" />
            <span className="font-bold">{scanResultMsg}</span>
          </div>
        </div>
      )}

      {/* ── 3D CIRCULAR SPOTLIGHT SHOWCASE (10) ─────────────────────────── */}
      <SpotlightCarousel onSelectPlatform={setSelectedPlatform} />

      {/* ── STUDIO & CREATOR SPONSORSHIP MARQUEE ───────────────────────── */}
      <div className="mb-10 p-5 sm:p-6 rounded-3xl bg-white border border-[#E7DFD5] flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm warm-card-shadow">
        <div className="flex items-center gap-4 text-center sm:text-left">
          <div className="w-12 h-12 rounded-2xl bg-[#15803D]/10 border border-[#15803D]/25 flex items-center justify-center text-[#15803D] flex-shrink-0 shadow-xs">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-extrabold text-[#1C1917]">
              Publisher Spotlight & Premium Sponsorships
            </h3>
            <p className="text-xs sm:text-sm text-[#78716C]">
              Feature your original mini-drama series with Standard Spotlight ($399/wk) or Premium Sticky Hero placement ($599/wk).
            </p>
          </div>
        </div>

        <button
          onClick={onNavigateToSponsor}
          className="px-5 py-2.5 rounded-xl bg-[#15803D] hover:bg-[#166534] text-white font-extrabold text-xs sm:text-sm flex items-center gap-2 transition-transform hover:scale-102 shadow-md shadow-[#15803D]/20 flex-shrink-0 cursor-pointer"
        >
          <span>View Publisher Tiers</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* ── FULL DIRECTORY HEADER & CONTROLS ───────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#1C1917] tracking-tight flex items-center gap-2.5 font-['Cinzel',serif]">
            <Film className="w-5 h-5 text-[#15803D]" />
            Curated Directory
          </h2>
          <p className="text-xs text-[#78716C]">
            Verified vertical short-drama apps categorized by genre, specialties, and store availability
          </p>
        </div>

        <div className="flex items-center gap-2">
          {onScanDiscovery && (
            <button
              onClick={onScanDiscovery}
              disabled={isScanning}
              className="px-3.5 py-2 rounded-xl bg-white hover:bg-[#F5F2EB] border border-[#D8D1C5] hover:border-[#15803D] text-xs text-[#15803D] font-bold flex items-center gap-2 transition-all disabled:opacity-50 cursor-pointer shadow-2xs"
              title="Query real-time App Store API for newly launched series apps"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin' : ''}`} />
              <span>{isScanning ? 'Querying Store API...' : 'Live Store Scan'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Search & Genre Filter Controls */}
      <SearchBar />
      <GenreFilterBar />

      {/* Active Filter Info / Reset */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5 px-1 text-xs text-[#78716C]">
        <div>
          <span>
            Showing <strong className="text-[#1C1917] font-bold">{totalItems === 0 ? 0 : `${startIndex + 1}–${endIndex}`}</strong> of <strong className="text-[#1C1917] font-bold">{totalItems}</strong> platforms
            {hasActiveFilters && <span> matching filter criteria</span>}
          </span>
        </div>

        {hasActiveFilters && (
          <button
            onClick={handleResetFilters}
            className="text-[#15803D] hover:underline font-bold cursor-pointer text-left sm:text-right"
          >
            Clear all filters
          </button>
        )}
      </div>

      {/* Platforms Grid with Multi-Page Pagination */}
      {currentItems.length > 0 ? (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {currentItems.map(platform => (
              <PlatformCard
                key={platform.id}
                platform={platform}
                onSelect={setSelectedPlatform}
              />
            ))}
          </div>

          {/* Clean Multi-Page Pagination Bar */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-[#E7DFD5]">
              <span className="text-xs text-[#78716C] font-medium">
                Page <strong className="text-[#1C1917]">{currentPage}</strong> of <strong className="text-[#1C1917]">{totalPages}</strong>
              </span>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-2 rounded-xl bg-white border border-[#D8D1C5] hover:border-[#15803D] text-xs font-bold text-[#1C1917] disabled:opacity-40 disabled:pointer-events-none transition-all flex items-center gap-1 cursor-pointer shadow-2xs"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-9 h-9 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                      currentPage === page
                        ? 'bg-[#15803D] text-white shadow-md shadow-[#15803D]/20'
                        : 'bg-white hover:bg-[#F5F2EB] border border-[#D8D1C5] text-[#57534E]'
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 rounded-xl bg-white border border-[#D8D1C5] hover:border-[#15803D] text-xs font-bold text-[#1C1917] disabled:opacity-40 disabled:pointer-events-none transition-all flex items-center gap-1 cursor-pointer shadow-2xs"
                >
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Empty State */
        <div className="py-16 text-center rounded-3xl bg-white border border-[#E7DFD5] p-8 shadow-sm">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-[#F5F2EB] flex items-center justify-center text-[#78716C] mb-4">
            <AlertCircle className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-[#1C1917] mb-1">No platforms match your search</h3>
          <p className="text-xs text-[#78716C] max-w-sm mx-auto mb-5">
            We couldn't find any mini-drama platforms matching "{searchQuery}" under {selectedFilter}. Try adjusting your keywords or category.
          </p>
          <button
            onClick={handleResetFilters}
            className="px-4 py-2 rounded-xl bg-[#15803D] text-white text-xs font-bold hover:bg-[#166534] transition-colors cursor-pointer shadow-sm"
          >
            Reset Filters & View All
          </button>
        </div>
      )}

      {/* Platform Detail Modal */}
      <PlatformDetailModal
        platform={selectedPlatform}
        onClose={() => setSelectedPlatform(null)}
      />
    </div>
  );
};
