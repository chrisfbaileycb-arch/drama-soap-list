import React from 'react';
import { useApp } from '@/contexts/AppContext';
import { ContentFilter } from '@/types';
import { Sparkles, Heart, Flame, ShieldAlert, Layers } from 'lucide-react';

const FILTERS: { id: ContentFilter; label: string }[] = [
  { id: 'All', label: 'All Platforms' },
  { id: 'Romance', label: 'Romance & Werewolf' },
  { id: 'Drama', label: 'Family & CEO Drama' },
  { id: 'Thriller', label: 'Thriller & Mystery' },
  { id: 'Multi-Genre', label: 'Multi-Genre & Sci-Fi' },
];

export const GenreFilterBar: React.FC = () => {
  const { selectedFilter, setSelectedFilter, platforms } = useApp();

  const getCount = (f: ContentFilter) => {
    if (f === 'All') return platforms.filter(p => p.active).length;
    return platforms.filter(p => p.active && p.content_focus === f).length;
  };

  return (
    <div className="w-full overflow-x-auto pb-2 scrollbar-none mb-6">
      <div className="flex items-center gap-2 min-w-max">
        {FILTERS.map(({ id, label }) => {
          const isSelected = selectedFilter === id;
          const count = getCount(id);

          return (
            <button
              key={id}
              onClick={() => setSelectedFilter(id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                isSelected
                  ? 'bg-[#15803D] text-white shadow-md shadow-[#15803D]/20 scale-102 ring-2 ring-[#15803D]/20'
                  : 'bg-white hover:bg-[#F5F2EB] text-[#57534E] hover:text-[#1C1917] border border-[#E7DFD5]'
              }`}
            >
              <span>{label}</span>
              <span className={`px-1.5 py-0.5 rounded-md text-[10px] font-extrabold ${
                isSelected ? 'bg-white/20 text-white' : 'bg-[#F4EFE6] text-[#78716C]'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
