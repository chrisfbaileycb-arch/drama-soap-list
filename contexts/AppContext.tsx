import React, { createContext, useState, useMemo, useCallback, ReactNode } from 'react';
import { INITIAL_PLATFORMS, Platform, ContentFocus, SponsorInquiry } from '@/constants/dramaData';

export type ContentFilter = ContentFocus | 'All';

interface AppContextType {
  platforms: Platform[];
  adminUser: { email: string } | null;
  featuredOrder: string[];
  searchQuery: string;
  selectedFilter: ContentFilter;
  spotlightPlatforms: Platform[];
  filteredCatalog: Platform[];
  sponsorInquiries: SponsorInquiry[];
  login: (email: string, password: string) => boolean;
  logout: () => void;
  toggleFeatured: (id: string) => void;
  toggleActive: (id: string) => void;
  moveFeaturedUp: (id: string) => void;
  moveFeaturedDown: (id: string) => void;
  setSearchQuery: (q: string) => void;
  setSelectedFilter: (f: ContentFilter) => void;
  submitSponsorInquiry: (data: Omit<SponsorInquiry, 'id' | 'created_at'>) => string;
  approveSponsorInquiry: (id: string) => void;
  rejectSponsorInquiry: (id: string) => void;
  mergeDiscoveredPlatforms: (discovered: Platform[]) => void;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

const FOCUS_LIST: ContentFocus[] = ['Romance', 'Drama', 'Thriller', 'Multi-Genre'];
const INITIAL_FEATURED_ORDER = INITIAL_PLATFORMS.filter(p => p.featured).map(p => p.id);

function buildBackfill(platforms: Platform[], featuredIds: Set<string>, needed: number): Platform[] {
  const byFocus: Record<string, Platform[]> = {};
  for (const f of FOCUS_LIST) {
    byFocus[f] = platforms
      .filter(p => !featuredIds.has(p.id) && p.active && p.content_focus === f)
      .sort((a, b) => b.rating - a.rating || b.review_count - a.review_count);
  }
  const result: Platform[] = [];
  const picked = new Set<string>();
  let fi = 0;
  while (result.length < needed) {
    const focus = FOCUS_LIST[fi % FOCUS_LIST.length];
    const candidate = byFocus[focus].find(p => !picked.has(p.id));
    if (candidate) { result.push(candidate); picked.add(candidate.id); }
    fi++;
    if (fi > needed * FOCUS_LIST.length + 40) break;
  }
  return result.slice(0, needed);
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [platforms, setPlatforms] = useState<Platform[]>(INITIAL_PLATFORMS);
  const [adminUser, setAdminUser] = useState<{ email: string } | null>(null);
  const [featuredOrder, setFeaturedOrder] = useState<string[]>(INITIAL_FEATURED_ORDER);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<ContentFilter>('All');
  const [sponsorInquiries, setSponsorInquiries] = useState<SponsorInquiry[]>([]);

  const spotlightPlatforms = useMemo(() => {
    const map = new Map(platforms.map(p => [p.id, p]));
    const featured = featuredOrder.map(id => map.get(id)).filter((p): p is Platform => !!p && p.active);
    if (featured.length >= 10) return featured.slice(0, 10);
    const needed = 10 - featured.length;
    const ids = new Set(featured.map(p => p.id));
    const backfill = buildBackfill(platforms, ids, needed);
    return [...featured, ...backfill];
  }, [platforms, featuredOrder]);

  const filteredCatalog = useMemo(() => {
    const isDefaultView = !searchQuery.trim() && selectedFilter === 'All';
    return platforms
      .filter(p => {
        if (!p.active) return false;
        if (selectedFilter !== 'All' && p.content_focus !== selectedFilter) return false;
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          return (
            p.name.toLowerCase().includes(q) ||
            p.developer.toLowerCase().includes(q) ||
            p.content_focus.toLowerCase().includes(q) ||
            p.specialties.some(s => s.toLowerCase().includes(q))
          );
        }
        return true;
      })
      .sort((a, b) => {
        if (isDefaultView) {
          const rA = a.region_origin === 'US_Dominant' ? 0 : 1;
          const rB = b.region_origin === 'US_Dominant' ? 0 : 1;
          if (rA !== rB) return rA - rB;
          const tA = a.quality_tier === 'Premium' ? 0 : 1;
          const tB = b.quality_tier === 'Premium' ? 0 : 1;
          if (tA !== tB) return tA - tB;
          if (b.rating !== a.rating) return b.rating - a.rating;
        }
        return a.name.localeCompare(b.name);
      });
  }, [platforms, searchQuery, selectedFilter]);

  const login = useCallback((email: string, password: string): boolean => {
    if (email.trim() === 'admin@dramaspot.com' && password === 'spotlight2024') {
      setAdminUser({ email: email.trim() });
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => setAdminUser(null), []);

  const toggleFeatured = useCallback((id: string) => {
    setFeaturedOrder(prev => {
      if (prev.includes(id)) return prev.filter(fid => fid !== id);
      if (prev.length >= 10) return prev;
      return [...prev, id];
    });
  }, []);

  const toggleActive = useCallback((id: string) => {
    setPlatforms(prev => prev.map(p => p.id === id ? { ...p, active: !p.active } : p));
  }, []);

  const moveFeaturedUp = useCallback((id: string) => {
    setFeaturedOrder(prev => {
      const i = prev.indexOf(id);
      if (i <= 0) return prev;
      const arr = [...prev];
      [arr[i - 1], arr[i]] = [arr[i], arr[i - 1]];
      return arr;
    });
  }, []);

  const moveFeaturedDown = useCallback((id: string) => {
    setFeaturedOrder(prev => {
      const i = prev.indexOf(id);
      if (i === -1 || i >= prev.length - 1) return prev;
      const arr = [...prev];
      [arr[i + 1], arr[i]] = [arr[i], arr[i + 1]];
      return arr;
    });
  }, []);

  const submitSponsorInquiry = useCallback((data: Omit<SponsorInquiry, 'id' | 'created_at'>): string => {
    const id = `inq_${Date.now()}`;
    const inquiry: SponsorInquiry = { ...data, id, created_at: new Date().toISOString() };
    setSponsorInquiries(prev => [...prev, inquiry]);
    return id;
  }, []);

  const approveSponsorInquiry = useCallback((inquiryId: string) => {
    setSponsorInquiries(prev => {
      const inquiry = prev.find(inq => inq.id === inquiryId);
      if (inquiry) {
        const sid = `sponsor_${inquiryId}`;
        const newPlatform: Platform = {
          id: sid,
          name: inquiry.series_title,
          developer: inquiry.studio_name,
          tagline: `Sponsored platform by ${inquiry.studio_name}.`,
          description: `Sponsored placement by ${inquiry.studio_name}. Visit their platform for more content.`,
          icon_url: inquiry.poster_url || `https://picsum.photos/seed/app_${sid}/200/200`,
          platform_url: inquiry.target_url,
          rating: 5.0,
          download_count: 'New',
          review_count: 0,
          content_focus: 'Multi-Genre',
          specialties: ['Sponsored'],
          featured: true,
          active: true,
          region_origin: 'US_Dominant',
          quality_tier: inquiry.package_tier === 599 ? 'Premium' : 'Standard',
        };
        setPlatforms(d => d.some(dd => dd.id === sid) ? d : [...d, newPlatform]);
        setFeaturedOrder(fo => fo.length < 10 ? [sid, ...fo.filter(x => x !== sid)] : fo);
      }
      return prev.map(inq => inq.id === inquiryId ? { ...inq, payment_status: 'active' as const } : inq);
    });
  }, []);

  const mergeDiscoveredPlatforms = useCallback((discovered: Platform[]) => {
    setPlatforms(prev => {
      const existingIds = new Set(prev.map(p => p.id));
      const fresh = discovered.filter(p => !existingIds.has(p.id));
      return fresh.length > 0 ? [...prev, ...fresh] : prev;
    });
  }, []);

  const rejectSponsorInquiry = useCallback((inquiryId: string) => {
    setSponsorInquiries(prev =>
      prev.map(inq => inq.id === inquiryId ? { ...inq, payment_status: 'rejected' as const } : inq)
    );
  }, []);

  return (
    <AppContext.Provider value={{
      platforms, adminUser, featuredOrder, searchQuery, selectedFilter,
      spotlightPlatforms, filteredCatalog, sponsorInquiries,
      login, logout, toggleFeatured, toggleActive,
      moveFeaturedUp, moveFeaturedDown, setSearchQuery, setSelectedFilter,
      submitSponsorInquiry, approveSponsorInquiry, rejectSponsorInquiry,
      mergeDiscoveredPlatforms,
    }}>
      {children}
    </AppContext.Provider>
  );
}
