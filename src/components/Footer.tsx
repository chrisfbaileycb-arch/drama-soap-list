import React from 'react';
import { Clapperboard, Heart, Shield, Sparkles, ExternalLink, CheckCircle2 } from 'lucide-react';

interface FooterProps {
  onNavigateTab: (tab: 'landing' | 'discover' | 'sponsor' | 'admin') => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigateTab }) => {
  return (
    <footer className="mt-20 border-t border-[#E7DFD5] bg-white text-[#78716C] text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#15803D] to-[#166534] flex items-center justify-center text-white shadow-sm">
                <Clapperboard className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-lg tracking-tight text-[#1C1917] font-['Cinzel',serif]">
                SOAP<span className="text-[#15803D]">LIST</span>
              </span>
            </div>
            <p className="text-xs text-[#57534E] max-w-sm leading-relaxed">
              Curated directory for vertical short-drama apps, episodic micro-series, and mobile drama streaming platforms with direct store download links.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] text-[#78716C]">
              <span className="flex items-center gap-1 text-[#15803D] font-bold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Curated Directory</span>
              </span>
              <span>•</span>
              <span>Free Access</span>
              <span>•</span>
              <span>Direct Store Links</span>
              <span>•</span>
              <span>U.S. Focus</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-[#1C1917] uppercase tracking-wider text-[11px] mb-3">
              Explore & Portals
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigateTab('landing')}
                  className="hover:text-[#15803D] transition-colors cursor-pointer"
                >
                  Featured Showcase (Home)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTab('discover')}
                  className="hover:text-[#15803D] transition-colors cursor-pointer"
                >
                  Free Vertical Directory
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTab('sponsor')}
                  className="hover:text-[#15803D] transition-colors cursor-pointer"
                >
                  Advertise & Monetization Tiers
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTab('admin')}
                  className="hover:text-[#1C1917] transition-colors cursor-pointer"
                >
                  Admin Control Portal
                </button>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-bold text-[#1C1917] uppercase tracking-wider text-[11px] mb-3">
              Popular Drama Tropes
            </h4>
            <ul className="space-y-1.5 text-xs text-[#57534E]">
              <li>Billionaire & CEO Romance</li>
              <li>Alpha Wolf & Lycan Suspense</li>
              <li>Betrayal & Revenge Arcs</li>
              <li>Secret Heiress & Disguise</li>
              <li>Vertical Sci-Fi & Drama</li>
            </ul>
          </div>

        </div>

        {/* Disclaimer & Copyright */}
        <div className="pt-6 border-t border-[#F5F2EB] flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px]">
          <p>© {new Date().getFullYear()} SoapList. All trademarks, logos, and app icons belong to their respective publishers.</p>
          <div className="flex items-center gap-4 text-[#78716C]">
            <span>Direct App Store & Google Play Routing</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
