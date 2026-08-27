import React, { createContext, useContext, useState, useMemo, useEffect, useCallback } from 'react';
import { Platform, SponsorInquiry, ContentFilter, AppContextType, GooglePlayScraperItem } from '@/types';
import { INITIAL_PLATFORMS } from '@/constants/dramaData';
import { parseGooglePlayScraperJson } from '@/services/appStoreDiscovery';

const STORAGE_KEYS = {
  PLATFORMS: 'soaplist_platforms_v4',
  FEATURED_ORDER: 'soaplist_featured_order_v4',
  SPONSORS: 'soaplist_sponsors_v4',
  ADMIN: 'soaplist_admin_user_v4',
};

const INITIAL_FEATURED_ORDER = INITIAL_PLATFORMS.filter(p => p.featured).map(p => p.id);

const INITIAL_SPONSORS: SponsorInquiry[] = [
  {
    id: 'sp_101',
    studio_name: 'Apex Horizon Studios',
    contact_name: 'Elena Rostova',
    contact_email: 'elena@apexhorizon.la',
    series_title: 'Forbidden Luna: Her Secret Heir',
    target_url: 'https://play.google.com/store/apps/details?id=com.storymatrix.dramabox',
    poster_url: 'https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/09/b8/b5/09b8b5ea-1678-7b83-a417-7612f0f5b11a/AppIcon-0-0-1x_U007emarketing-0-8-0-85-220.png/256x256bb.jpg',
    package_tier: 599,
    package_name: 'Premium Featured',
    weeks: 4,
    total_amount: 2396,
    payment_status: 'paid_pending_approval',
    created_at: '2026-03-24T14:32:00Z',
  },
  {
    id: 'sp_102',
    studio_name: 'Vanguard Media NY',
    contact_name: 'Marcus Chen',
    contact_email: 'marcus@vanguardmedia.io',
    series_title: 'The CEO’s Double Life',
    target_url: 'https://play.google.com/store/apps/details?id=com.newleaf.chsp',
    poster_url: 'https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/30/ca/4f/30ca4fa2-bc42-3b24-11fa-ef3661be4949/AppIcon-0-0-1x_U007emarketing-0-8-0-85-220.png/256x256bb.jpg',
    package_tier: 399,
    package_name: 'Standard Spotlight',
    weeks: 2,
    total_amount: 798,
    payment_status: 'active',
    created_at: '2026-03-20T09:15:00Z',
  },
];

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [platforms, setPlatforms] = useState<Platform[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PLATFORMS);
      if (saved) return JSON.parse(saved);
    } catch (_) {}
    return INITIAL_PLATFORMS;
  });

  const [featuredOrder, setFeaturedOrder] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.FEATURED_ORDER);
      if (saved) return JSON.parse(saved);
    } catch (_) {}
    return INITIAL_FEATURED_ORDER;
  });

  const [sponsorInquiries, setSponsorInquiries] = useState<SponsorInquiry[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SPONSORS);
      if (saved) return JSON.parse(saved);
    } catch (_) {}
    return INITIAL_SPONSORS;
  });

  const [adminUser, setAdminUser] = useState<{ email: string } | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ADMIN);
      if (saved) return JSON.parse(saved);
    } catch (_) {}
    return null;
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<ContentFilter>('All');

  // Persistence effects
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PLATFORMS, JSON.stringify(platforms));
    } catch (_) {}
  }, [platforms]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.FEATURED_ORDER, JSON.stringify(featuredOrder));
    } catch (_) {}
  }, [featuredOrder]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SPONSORS, JSON.stringify(sponsorInquiries));
    } catch (_) {}
  }, [sponsorInquiries]);

  useEffect(() => {
    try {
      if (adminUser) {
        localStorage.setItem(STORAGE_KEYS.ADMIN, JSON.stringify(adminUser));
      } else {
        localStorage.removeItem(STORAGE_KEYS.ADMIN);
      }
    } catch (_) {}
  }, [adminUser]);

  // Auth
  const login = useCallback((email: string, pass: string): boolean => {
    if (email.trim().toLowerCase() === 'admin@dramaspot.com' && pass === 'spotlight2024') {
      setAdminUser({ email: email.trim() });
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setAdminUser(null);
  }, []);

  // Spotlight platforms (ordered strictly by featuredOrder)
  const spotlightPlatforms = useMemo(() => {
    const map = new Map(platforms.map(p => [p.id, p]));
    const list: Platform[] = [];
    for (const id of featuredOrder) {
      const p = map.get(id);
      if (p && p.active) list.push(p);
    }
    return list;
  }, [platforms, featuredOrder]);

  // Filtered Catalog
  const filteredCatalog = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return platforms.filter(p => {
      if (!p.active) return false;
      // Filter by genre
      if (selectedFilter !== 'All' && p.content_focus !== selectedFilter) return false;
      // Search by query
      if (q) {
        const matchName = p.name.toLowerCase().includes(q);
        const matchDev = p.developer.toLowerCase().includes(q);
        const matchTagline = p.tagline.toLowerCase().includes(q);
        const matchDesc = p.description.toLowerCase().includes(q);
        const matchSpec = p.specialties.some(s => s.toLowerCase().includes(q));
        const matchFocus = p.content_focus.toLowerCase().includes(q);
        if (!matchName && !matchDev && !matchTagline && !matchDesc && !matchSpec && !matchFocus) {
          return false;
        }
      }
      return true;
    });
  }, [platforms, selectedFilter, searchQuery]);

  // Platform admin toggles
  const toggleFeatured = useCallback((id: string) => {
    setFeaturedOrder(prev => {
      const exists = prev.includes(id);
      if (exists) {
        setPlatforms(pts => pts.map(p => p.id === id ? { ...p, featured: false } : p));
        return prev.filter(x => x !== id);
      } else {
        if (prev.length >= 10) {
          // If already 10, don't exceed or replace last
          alert('Maximum 10 spotlight slots reached. Remove an existing spotlight platform first.');
          return prev;
        }
        setPlatforms(pts => pts.map(p => p.id === id ? { ...p, featured: true } : p));
        return [...prev, id];
      }
    });
  }, []);

  const toggleActive = useCallback((id: string) => {
    setPlatforms(pts =>
      pts.map(p => {
        if (p.id === id) {
          const nextActive = !p.active;
          if (!nextActive) {
            // Also remove from featured
            setFeaturedOrder(f => f.filter(x => x !== id));
            return { ...p, active: false, featured: false };
          }
          return { ...p, active: true };
        }
        return p;
      })
    );
  }, []);

  const moveFeaturedUp = useCallback((id: string) => {
    setFeaturedOrder(prev => {
      const idx = prev.indexOf(id);
      if (idx <= 0) return prev;
      const next = [...prev];
      const temp = next[idx - 1];
      next[idx - 1] = next[idx];
      next[idx] = temp;
      return next;
    });
  }, []);

  const moveFeaturedDown = useCallback((id: string) => {
    setFeaturedOrder(prev => {
      const idx = prev.indexOf(id);
      if (idx === -1 || idx >= prev.length - 1) return prev;
      const next = [...prev];
      const temp = next[idx + 1];
      next[idx + 1] = next[idx];
      next[idx] = temp;
      return next;
    });
  }, []);

  const submitSponsorInquiry = useCallback((data: Omit<SponsorInquiry, 'id' | 'created_at'>): string => {
    const id = `sp_${Date.now()}`;
    const newInquiry: SponsorInquiry = {
      ...data,
      id,
      created_at: new Date().toISOString(),
    };
    setSponsorInquiries(prev => [newInquiry, ...prev]);
    return id;
  }, []);

  const approveSponsorInquiry = useCallback((id: string) => {
    setSponsorInquiries(prev =>
      prev.map(item => (item.id === id ? { ...item, payment_status: 'active' } : item))
    );

    // Auto-create or activate platform if relevant
    const inquiry = sponsorInquiries.find(x => x.id === id);
    if (inquiry) {
      setPlatforms(prev => {
        const exists = prev.find(p => p.name.toLowerCase() === inquiry.studio_name.toLowerCase());
        if (exists) {
          return prev.map(p => p.id === exists.id ? { ...p, active: true, featured: true } : p);
        }
        const newPlat: Platform = {
          id: `sponsor_${inquiry.id}`,
          name: inquiry.studio_name,
          developer: inquiry.contact_name,
          tagline: `Featured Sponsor — ${inquiry.series_title}`,
          description: `Sponsored showcase by ${inquiry.studio_name}. Featuring original vertical drama "${inquiry.series_title}".`,
          icon_url: inquiry.poster_url || `https://picsum.photos/seed/${inquiry.id}/200/200`,
          platform_url: inquiry.target_url,
          rating: 5.0,
          download_count: 'Sponsored',
          review_count: 100,
          content_focus: 'Drama',
          specialties: ['Sponsored', 'Exclusive', 'Spotlight'],
          region_origin: 'US_Dominant',
          quality_tier: 'Premium',
          featured: true,
          active: true,
          isNew: true,
        };
        return [newPlat, ...prev];
      });

      setFeaturedOrder(prev => {
        const platId = `sponsor_${inquiry.id}`;
        if (!prev.includes(platId) && prev.length < 10) {
          return [platId, ...prev];
        }
        return prev;
      });
    }
  }, [sponsorInquiries]);

  const rejectSponsorInquiry = useCallback((id: string) => {
    setSponsorInquiries(prev =>
      prev.map(item => (item.id === id ? { ...item, payment_status: 'rejected' } : item))
    );
  }, []);

  const mergeDiscoveredPlatforms = useCallback((discovered: Platform[]) => {
    setPlatforms(prev => {
      const existingIds = new Set(prev.map(p => p.id));
      const toAdd = discovered.filter(p => !existingIds.has(p.id));
      if (toAdd.length === 0) return prev;
      return [...toAdd, ...prev];
    });
  }, []);

  const importGooglePlayJson = useCallback((jsonData: GooglePlayScraperItem[] | string): { added: number; updated: number } => {
    try {
      const converted = parseGooglePlayScraperJson(jsonData);
      if (!converted || converted.length === 0) return { added: 0, updated: 0 };

      let added = 0;
      let updated = 0;

      setPlatforms(prev => {
        const next = [...prev];
        for (const item of converted) {
          // Check matching by id, appId, playStoreUrl, or name
          const idx = next.findIndex(
            p =>
              p.id.toLowerCase() === item.id.toLowerCase() ||
              (item.appId && p.appId === item.appId) ||
              (item.playStoreUrl && p.playStoreUrl === item.playStoreUrl) ||
              (item.playStoreUrl && p.platform_url === item.playStoreUrl) ||
              p.name.toLowerCase() === item.name.toLowerCase() ||
              (item.id === 'reelshort' && (p.id === 'rs' || p.name.toLowerCase().includes('reelshort'))) ||
              (item.id === 'dramabox' && (p.id === 'db' || p.name.toLowerCase().includes('dramabox'))) ||
              (item.id === 'shortmax' && (p.id === 'sm' || p.name.toLowerCase().includes('shortmax'))) ||
              (item.id === 'serealplus' && (p.id === 'sr' || p.name.toLowerCase().includes('sereal')))
          );

          if (idx >= 0) {
            // Update existing
            next[idx] = {
              ...next[idx],
              ...item,
              poster_url: item.poster_url || item.posterUrl || next[idx].poster_url,
              posterUrl: item.posterUrl || item.poster_url || next[idx].posterUrl,
              playStoreUrl: item.playStoreUrl || next[idx].playStoreUrl,
              appStoreUrl: item.appStoreUrl || next[idx].appStoreUrl,
              rating: item.rating || next[idx].rating,
              download_count: item.download_count || next[idx].download_count,
            };
            updated++;
          } else {
            // Add new
            next.unshift(item);
            added++;
          }
        }
        return next;
      });

      return { added, updated };
    } catch (e) {
      console.error('Failed to import Google Play JSON', e);
      return { added: 0, updated: 0 };
    }
  }, []);

  const value: AppContextType = {
    platforms,
    adminUser,
    featuredOrder,
    searchQuery,
    selectedFilter,
    spotlightPlatforms,
    filteredCatalog,
    sponsorInquiries,
    login,
    logout,
    toggleFeatured,
    toggleActive,
    moveFeaturedUp,
    moveFeaturedDown,
    setSearchQuery,
    setSelectedFilter,
    submitSponsorInquiry,
    approveSponsorInquiry,
    rejectSponsorInquiry,
    mergeDiscoveredPlatforms,
    importGooglePlayJson,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = (): AppContextType => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};
