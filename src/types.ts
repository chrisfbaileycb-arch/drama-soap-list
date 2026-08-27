export type ContentFocus = 'Romance' | 'Drama' | 'Thriller' | 'Multi-Genre';
export type RegionOrigin = 'US_Dominant' | 'Global_Traction';
export type QualityTier = 'Premium' | 'Standard';

export interface GooglePlayScraperItem {
  id?: string;
  appId?: string;
  title?: string;
  name?: string;
  domain?: string;
  genre?: string;
  content_focus?: ContentFocus;
  rating?: number;
  score?: number;
  downloads?: string;
  download_count?: string;
  reviews?: number;
  review_count?: number;
  posterUrl?: string;
  poster_url?: string;
  icon?: string;
  icon_url?: string;
  iconUrl?: string;
  logoUrl?: string;
  screenshots?: string[];
  playStoreUrl?: string;
  platform_url?: string;
  appStoreUrl?: string;
  app_store_url?: string;
  developer?: string;
  summary?: string;
  description?: string;
  tagline?: string;
  specialties?: string[];
}

export interface Platform {
  isNew?: boolean;
  id: string;
  name: string;
  developer: string;
  publisher?: string;
  tagline: string;
  description: string;
  domain?: string;
  websiteUrl?: string;
  icon_url: string;
  iconUrl?: string;
  logoUrl?: string;
  poster_url?: string;
  posterUrl?: string;
  platform_url: string;
  playStoreUrl?: string;
  app_store_url?: string;
  appStoreUrl?: string;
  appId?: string;
  rating: number;
  download_count: string;
  review_count: number;
  content_focus: ContentFocus;
  specialties: string[];
  region_origin: RegionOrigin;
  quality_tier: QualityTier;
  featured: boolean;
  active: boolean;
  pinnedGenreTop?: boolean;
  trailerTitle?: string;
}

export interface SponsorInquiry {
  id: string;
  studio_name: string;
  contact_name: string;
  contact_email: string;
  series_title: string;
  target_url: string;
  poster_url: string;
  package_tier: 399 | 599;
  package_name: 'Standard Spotlight' | 'Premium Featured';
  weeks: number;
  total_amount: number;
  payment_status: 'paid_pending_approval' | 'active' | 'rejected';
  created_at: string;
}

export type ContentFilter = ContentFocus | 'All';

export interface AppContextType {
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
  importGooglePlayJson: (jsonData: GooglePlayScraperItem[] | string) => { added: number; updated: number };
}

