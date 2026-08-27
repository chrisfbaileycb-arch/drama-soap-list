import React from 'react';
import { Sparkles, Tv, Clapperboard, Award, ShieldCheck, RefreshCw, Compass, Home, Play } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';

interface HeaderProps {
  currentTab: 'landing' | 'discover' | 'sponsor' | 'admin';
  setCurrentTab: (tab: 'landing' | 'discover' | 'sponsor' | 'admin') => void;
  onScanDiscovery?: () => void;
  isScanning?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  setCurrentTab,
  onScanDiscovery,
  isScanning = false,
}) => {
  const { platforms, spotlightPlatforms, adminUser } = useApp();
  const activeCount = platforms.filter(p => p.active).length;
  const spotlightCount = spotlightPlatforms.slice(0, 10).length;

  return (
    <header className="sticky top-0 z-40 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#E7DFD5] shadow-sm">
      
      {/* Ambient Theater Light Beam Accent Line */}
      <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-[#15803D]/60 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo & Brand Identity */}
          <div 
            onClick={() => setCurrentTab('landing')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-br from-[#15803D] to-[#166534] flex items-center justify-center shadow-md shadow-[#15803D]/20 group-hover:scale-105 transition-transform">
              <Clapperboard className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl sm:text-2xl tracking-tight text-[#1C1917] font-['Cinzel',serif]">
                  SOAP<span className="text-[#15803D]">LIST</span>
                </span>
                <span className="hidden sm:inline-block px-2.5 py-0.5 text-[10px] font-extrabold tracking-wider uppercase bg-[#15803D]/10 text-[#15803D] border border-[#15803D]/25 rounded-full">
                  Verified Directory
                </span>
              </div>
              <p className="text-[11px] text-[#78716C] hidden md:block">
                Direct Store Links • Vertical Drama Hub • 100% Free
              </p>
            </div>
          </div>

          {/* Center Factual Badges & Live Store Scan */}
          <div className="hidden lg:flex items-center gap-2.5 text-xs">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#E7DFD5] text-[#57534E] shadow-2xs">
              <Tv className="w-3.5 h-3.5 text-[#15803D]" />
              <span><strong className="text-[#1C1917] font-bold">{activeCount}</strong> Verified Apps</span>
            </div>
            
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#E7DFD5] text-[#57534E] shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-[#D97706]" />
              <span>Spotlight <strong className="text-[#1C1917] font-bold">({spotlightCount})</strong></span>
            </div>

            {onScanDiscovery && (
              <button
                onClick={onScanDiscovery}
                disabled={isScanning}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-[#F5F2EB] border border-[#D8D1C5] hover:border-[#15803D] text-[#15803D] transition-all text-xs font-bold disabled:opacity-50 cursor-pointer shadow-2xs"
                title="Scan live App Store directory for newly registered mini-drama apps"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin' : ''}`} />
                <span>{isScanning ? 'Scanning Store...' : 'App Store Scan'}</span>
              </button>
            )}
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center gap-1.5 sm:gap-2">
            <button
              id="nav-tab-landing"
              onClick={() => setCurrentTab('landing')}
              className={`px-3 sm:px-4 py-2 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-1.5 cursor-pointer ${
                currentTab === 'landing'
                  ? 'bg-[#15803D] text-white shadow-md shadow-[#15803D]/20'
                  : 'text-[#57534E] hover:text-[#1C1917] hover:bg-white/80'
              }`}
            >
              <Home className="w-4 h-4" />
              <span>Home</span>
            </button>

            <button
              id="nav-tab-discover"
              onClick={() => setCurrentTab('discover')}
              className={`px-3 sm:px-4 py-2 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-1.5 cursor-pointer ${
                currentTab === 'discover'
                  ? 'bg-[#15803D] text-white shadow-md shadow-[#15803D]/20'
                  : 'text-[#57534E] hover:text-[#1C1917] hover:bg-white/80'
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>Directory</span>
            </button>

            <button
              id="nav-tab-sponsor"
              onClick={() => setCurrentTab('sponsor')}
              className={`px-3 sm:px-4 py-2 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-1.5 cursor-pointer ${
                currentTab === 'sponsor'
                  ? 'bg-[#15803D] text-white shadow-md shadow-[#15803D]/20'
                  : 'text-[#57534E] hover:text-[#1C1917] hover:bg-white/80'
              }`}
            >
              <Award className="w-4 h-4 text-inherit" />
              <span>Advertise</span>
            </button>

            <button
              id="nav-tab-admin"
              onClick={() => setCurrentTab('admin')}
              className={`px-3 sm:px-4 py-2 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-1.5 cursor-pointer ${
                currentTab === 'admin'
                  ? 'bg-[#15803D] text-white shadow-md shadow-[#15803D]/20'
                  : 'text-[#57534E] hover:text-[#1C1917] hover:bg-white/80'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Admin{adminUser ? ' •' : ''}</span>
            </button>
          </nav>

        </div>
      </div>
    </header>
  );
};
