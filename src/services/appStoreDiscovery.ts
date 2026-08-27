import { Platform, ContentFocus, QualityTier, RegionOrigin, GooglePlayScraperItem } from '@/types';

const ITUNES_ENDPOINT = 'https://itunes.apple.com/search';

const SEARCH_TERMS = [
  'short drama',
  'vertical drama',
  'micro series',
  'reel short',
  'mini tv drama',
];

interface ItunesResult {
  trackId: number;
  trackName: string;
  sellerName: string;
  artworkUrl512?: string;
  artworkUrl100?: string;
  averageUserRating?: number;
  userRatingCount?: number;
  description?: string;
  genres?: string[];
  primaryGenreName?: string;
  bundleId?: string;
}

interface ItunesResponse {
  resultCount: number;
  results: ItunesResult[];
}

export function mapGenreToContentFocus(genres: string[] = [], name: string = ''): ContentFocus {
  const all = [...genres, name].map(g => g.toLowerCase()).join(' ');
  if (all.includes('romance') || all.includes('love') || all.includes('romantic')) return 'Romance';
  if (all.includes('thriller') || all.includes('suspense') || all.includes('mystery')) return 'Thriller';
  if (all.includes('drama')) return 'Drama';
  return 'Multi-Genre';
}

export function formatDownloadCount(ratingCount: number): string {
  if (ratingCount >= 1_000_000) return `${(ratingCount / 1_000_000).toFixed(0)}M+`;
  if (ratingCount >= 100_000) return `${(ratingCount / 1_000).toFixed(0)}K+`;
  if (ratingCount >= 1_000) return `${(ratingCount / 1_000).toFixed(0)}K+`;
  return `${ratingCount}+`;
}

export function deriveSpecialties(name: string, description: string = '', genres: string[] = []): string[] {
  const text = `${name} ${description}`.toLowerCase();
  const tags: string[] = [];
  const checks: [string, string][] = [
    ['billionaire', 'Billionaire'],
    ['alpha', 'Alpha Wolf'],
    ['lycan', 'Lycan'],
    ['revenge', 'Revenge'],
    ['ceo', 'CEO'],
    ['betrayal', 'Betrayal'],
    ['secret', 'Secret Identity'],
    ['fantasy', 'Fantasy'],
    ['thriller', 'Thriller'],
    ['romance', 'Romance'],
    ['werewolf', 'Werewolf'],
    ['supernatural', 'Supernatural'],
    ['drama', 'Drama'],
  ];
  for (const [keyword, tag] of checks) {
    if (text.includes(keyword) && tags.length < 3) tags.push(tag);
  }
  if (tags.length === 0 && genres.length) tags.push(genres[0]);
  if (tags.length === 0) tags.push('Mini-Drama');
  return tags.slice(0, 3);
}

export function convertGooglePlayItemToPlatform(item: GooglePlayScraperItem): Platform {
  const title = item.title || item.name || 'Short Drama App';
  const appId = item.appId || (item.playStoreUrl ? (() => {
    try { return new URL(item.playStoreUrl).searchParams.get('id') || undefined; } catch { return undefined; }
  })() : undefined);
  
  const id = item.id || (appId ? appId.replace(/[^a-zA-Z0-9]/g, '_') : `gplay_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`);
  const domain = item.domain || (appId ? `${appId.split('.').reverse()[0] || 'app'}.com` : undefined);
  
  const logoUrl = item.logoUrl || item.iconUrl || item.icon_url || item.icon || (domain ? `https://www.google.com/s2/favicons?domain=${domain}&sz=128` : 'https://www.google.com/s2/favicons?domain=google.com&sz=128');
  
  const playStoreUrl = item.playStoreUrl || (appId ? `https://play.google.com/store/apps/details?id=${appId}` : item.platform_url || 'https://play.google.com');
  const appStoreUrl = item.appStoreUrl || item.app_store_url;
  
  const rating = typeof item.rating === 'number' ? item.rating : (typeof item.score === 'number' ? item.score : 4.8);
  const downloads = item.downloads || item.download_count || '10M+';
  const desc = item.description || item.summary || `${title} is a vertical short-form drama streaming application featuring binge-worthy episodic storytelling.`;
  const genre = item.genre || 'Billionaire & Romance';
  const focus = item.content_focus || mapGenreToContentFocus([genre], title);

  return {
    id,
    appId,
    name: title,
    developer: item.developer || 'Verified Mobile Studio',
    tagline: item.tagline || `Top rated ${genre} vertical series platform`,
    description: desc.slice(0, 260) + (desc.length > 260 ? '…' : ''),
    domain,
    logoUrl,
    iconUrl: logoUrl,
    icon_url: logoUrl,
    platform_url: playStoreUrl,
    playStoreUrl: playStoreUrl,
    app_store_url: appStoreUrl,
    appStoreUrl: appStoreUrl,
    rating: Math.round(rating * 10) / 10,
    download_count: downloads,
    review_count: item.review_count || item.reviews || 250000,
    content_focus: focus,
    specialties: item.specialties || deriveSpecialties(title, `${desc} ${genre}`, [genre]),
    region_origin: 'US_Dominant' as RegionOrigin,
    quality_tier: rating >= 4.6 ? ('Premium' as QualityTier) : ('Standard' as QualityTier),
    featured: false,
    active: true,
    isNew: true,
  };
}

export function parseGooglePlayScraperJson(rawInput: string | GooglePlayScraperItem[]): Platform[] {
  let items: GooglePlayScraperItem[] = [];
  if (typeof rawInput === 'string') {
    const parsed = JSON.parse(rawInput.trim());
    if (Array.isArray(parsed)) {
      items = parsed;
    } else if (typeof parsed === 'object' && parsed !== null) {
      items = [parsed];
    }
  } else if (Array.isArray(rawInput)) {
    items = rawInput;
  }
  return items.map(convertGooglePlayItemToPlatform);
}

export const CURATED_GOOGLE_PLAY_PRESETS: GooglePlayScraperItem[] = [
  {
    id: "reelshort",
    appId: "com.newleaf.chsp",
    domain: "reelshort.com",
    title: "ReelShort - Short Dramas",
    genre: "Billionaire & Romance",
    rating: 4.8,
    downloads: "10M+",
    logoUrl: "https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/30/ca/4f/30ca4fa2-bc42-3b24-11fa-ef3661be4949/AppIcon-0-0-1x_U007emarketing-0-8-0-85-220.png/256x256bb.jpg",
    iconUrl: "https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/30/ca/4f/30ca4fa2-bc42-3b24-11fa-ef3661be4949/AppIcon-0-0-1x_U007emarketing-0-8-0-85-220.png/256x256bb.jpg",
    playStoreUrl: "https://play.google.com/store/apps/details?id=com.newleaf.chsp",
    appStoreUrl: "https://apps.apple.com/us/app/reelshort-short-movie-tv/id6444075114",
    developer: "Crazy Maple Studio / COL Group",
    description: "ReelShort is an HD streaming platform featuring bite-sized vertical drama series including billionaire husbands, alpha wolves, and secret heirs."
  },
  {
    id: "dramabox",
    appId: "com.storymatrix.dramabox",
    domain: "dramabox.com",
    title: "DramaBox - Stream Drama Shorts",
    genre: "Revenge & Betrayal",
    rating: 4.8,
    downloads: "5M+",
    logoUrl: "https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/09/b8/b5/09b8b5ea-1678-7b83-a417-7612f0f5b11a/AppIcon-0-0-1x_U007emarketing-0-8-0-85-220.png/256x256bb.jpg",
    iconUrl: "https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/09/b8/b5/09b8b5ea-1678-7b83-a417-7612f0f5b11a/AppIcon-0-0-1x_U007emarketing-0-8-0-85-220.png/256x256bb.jpg",
    playStoreUrl: "https://play.google.com/store/apps/details?id=com.storymatrix.dramabox",
    appStoreUrl: "https://apps.apple.com/us/app/dramabox-stream-drama-shorts/id6445905219",
    developer: "STORYMATRIX PTE. LTD.",
    description: "DramaBox delivers gripping urban family drama, betrayal sequences, and CEO revenge cycles with high production values."
  },
  {
    id: "shortmax",
    appId: "com.topshort.android",
    domain: "shortmax.com",
    title: "ShortMax - Watch Short Dramas",
    genre: "CEO & Mystery",
    rating: 4.8,
    downloads: "8M+",
    logoUrl: "https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/eb/fa/d7/ebfad733-4f2b-8a8b-4b10-6ec9908cf67d/AppIcon-0-0-1x_U007emarketing-0-8-0-85-220.png/256x256bb.jpg",
    iconUrl: "https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/eb/fa/d7/ebfad733-4f2b-8a8b-4b10-6ec9908cf67d/AppIcon-0-0-1x_U007emarketing-0-8-0-85-220.png/256x256bb.jpg",
    playStoreUrl: "https://play.google.com/store/apps/details?id=com.topshort.android",
    appStoreUrl: "https://apps.apple.com/us/app/shortmax-watch-short-dramas/id6468903332",
    developer: "ShortMax Video",
    description: "ShortMax offers fast-paced secret-identity storylines and cliffhanger hooks structured in quick 1-2 minute mobile episodes."
  },
  {
    id: "serealplus",
    appId: "com.sereal.plus",
    domain: "serealplus.com",
    title: "Sereal+ - Drama & Romance",
    genre: "Paranormal & Werewolf",
    rating: 4.8,
    downloads: "3M+",
    logoUrl: "https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/d5/07/28/d50728c3-4217-1f9e-6447-b8d42d38686e/AppIcon-0-0-1x_U007emarketing-0-8-0-85-220.png/256x256bb.jpg",
    iconUrl: "https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/d5/07/28/d50728c3-4217-1f9e-6447-b8d42d38686e/AppIcon-0-0-1x_U007emarketing-0-8-0-85-220.png/256x256bb.jpg",
    playStoreUrl: "https://play.google.com/store/apps/details?id=com.sereal.plus",
    appStoreUrl: "https://apps.apple.com/us/app/sereal-drama-shorts/id6471850125",
    developer: "SerealPlus Team",
    description: "Sereal+ blends romance with paranormal drama — lycan kings, forbidden alphas, and billionaire heiresses across episodic short-form seasons."
  }
];

function itunesResultToPlatform(result: ItunesResult, knownIds: Set<string>): Platform | null {
  const extId = `itunes_${result.trackId}`;
  if (knownIds.has(extId)) return null;

  const icon =
    result.artworkUrl512 ||
    result.artworkUrl100 ||
    `https://www.google.com/s2/favicons?domain=apple.com&sz=128`;

  const rating = result.averageUserRating ?? 4.0;
  const reviewCount = result.userRatingCount ?? 0;
  const description = result.description ?? `${result.trackName} is a short-form drama streaming app.`;
  const genres = result.genres ?? [];
  const name = result.trackName;

  return {
    id: extId,
    name,
    developer: result.sellerName ?? 'Unknown Developer',
    tagline: `Discovered on the App Store — ${genres[0] ?? 'Drama'} streaming app`,
    description: description.slice(0, 220) + (description.length > 220 ? '…' : ''),
    logoUrl: icon,
    icon_url: icon,
    iconUrl: icon,
    platform_url: `https://play.google.com/store/search?q=${encodeURIComponent(name)}&c=apps`,
    playStoreUrl: `https://play.google.com/store/search?q=${encodeURIComponent(name)}&c=apps`,
    app_store_url: `https://apps.apple.com/us/app/id${result.trackId}`,
    appStoreUrl: `https://apps.apple.com/us/app/id${result.trackId}`,
    rating: Math.round(rating * 10) / 10,
    download_count: reviewCount > 0 ? formatDownloadCount(reviewCount) : 'New',
    review_count: reviewCount,
    content_focus: mapGenreToContentFocus(genres, name),
    specialties: deriveSpecialties(name, description, genres),
    region_origin: 'Global_Traction' as RegionOrigin,
    quality_tier: rating >= 4.5 ? ('Premium' as QualityTier) : ('Standard' as QualityTier),
    featured: false,
    active: true,
    isNew: true,
  };
}

export interface DiscoveryResult {
  platforms: Platform[];
  totalFound: number;
  searchTermsUsed: string[];
  error?: string;
}

async function queryItunesTerm(term: string): Promise<ItunesResult[]> {
  try {
    const params = new URLSearchParams({
      term,
      entity: 'software',
      country: 'us',
      limit: '50',
      lang: 'en_us',
    });
    const res = await fetch(`${ITUNES_ENDPOINT}?${params.toString()}`, {
      headers: { Accept: 'application/json' },
    });
    if (!res.ok) return [];
    const data: ItunesResponse = await res.json();
    return data.results ?? [];
  } catch (err) {
    console.warn('Error fetching from iTunes for term:', term, err);
    return [];
  }
}

const DRAMA_KEYWORDS = [
  'drama', 'short', 'reel', 'mini', 'series', 'episode', 'story', 'romance',
  'thriller', 'soap', 'novela', 'serial', 'vertical', 'micro', 'watch', 'stream',
];

function isDramaRelevant(result: ItunesResult): boolean {
  const text = `${result.trackName} ${result.description ?? ''} ${(result.genres ?? []).join(' ')}`.toLowerCase();
  return DRAMA_KEYWORDS.some(kw => text.includes(kw));
}

export async function discoverNewPlatforms(existingIds: Set<string>): Promise<DiscoveryResult> {
  const seen = new Set<number>();
  const allResults: ItunesResult[] = [];

  const queryResults = await Promise.allSettled(
    SEARCH_TERMS.map(term => queryItunesTerm(term))
  );

  for (const r of queryResults) {
    if (r.status === 'fulfilled') {
      for (const item of r.value) {
        if (!seen.has(item.trackId)) {
          seen.add(item.trackId);
          allResults.push(item);
        }
      }
    }
  }

  const relevant = allResults.filter(isDramaRelevant);

  const newPlatforms: Platform[] = [];
  for (const result of relevant) {
    const p = itunesResultToPlatform(result, existingIds);
    if (p) newPlatforms.push(p);
  }

  newPlatforms.sort((a, b) => b.rating - a.rating);

  return {
    platforms: newPlatforms,
    totalFound: relevant.length,
    searchTermsUsed: SEARCH_TERMS,
  };
}

