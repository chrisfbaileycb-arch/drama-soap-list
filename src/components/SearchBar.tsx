import React from 'react';
import { Search, X } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';

export const SearchBar: React.FC = () => {
  const { searchQuery, setSearchQuery } = useApp();

  return (
    <div className="relative w-full mb-4">
      <div className="relative flex items-center w-full">
        <Search className="absolute left-4 w-4 h-4 text-[#78716C] pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by mini-drama app name, studio, trope (e.g. Billionaire, Alpha Wolf, CEO, Revenge)..."
          className="w-full bg-white border border-[#E7DFD5] focus:border-[#15803D] focus:ring-2 focus:ring-[#15803D]/20 text-[#1C1917] placeholder-[#A8A29E] text-xs sm:text-sm rounded-2xl pl-11 pr-10 py-3.5 transition-all outline-none shadow-2xs"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3.5 p-1 rounded-md text-[#78716C] hover:text-[#1C1917] hover:bg-[#F5F2EB] transition-colors cursor-pointer"
            aria-label="Clear search"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
