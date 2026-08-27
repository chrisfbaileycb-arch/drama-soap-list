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
  
  const posterUrl = item.posterUrl || item.poster_url || (item.screenshots && item.screenshots[0]) || 'https://play-lh.googleusercontent.com/O-OR6Mh0AoNyiaYYaa3OJ_VHGfLqWW2qNzUUZxRRodD3fqs2Pm04FatavdNbz-jsMZM=w720-h1280';
  const iconUrl = item.icon_url || item.icon || (posterUrl.includes('googleusercontent.com') ? posterUrl.replace(/=w\d+-h\d+/, '=w200-h200') : posterUrl);
  
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
    icon_url: iconUrl,
    poster_url: posterUrl,
    posterUrl: posterUrl,
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
    appId: "com.reelshort.app",
    title: "ReelShort - Short Dramas",
    genre: "Billionaire & Romance",
    rating: 4.8,
    downloads: "10M+",
    posterUrl: "https://play-lh.googleusercontent.com/O-OR6Mh0AoNyiaYYaa3OJ_VHGfLqWW2qNzUUZxRRodD3fqs2Pm04FatavdNbz-jsMZM=w720-h1280",
    playStoreUrl: "https://play.google.com/store/apps/details?id=com.reelshort.app",
    appStoreUrl: "https://apps.apple.com/app/id1636270631",
    developer: "Crazy Maple Studio / COL Group",
    description: "ReelShort is an HD streaming platform featuring bite-sized vertical drama series including billionaire husbands, alpha wolves, and secret heirs."
  },
  {
    id: "dramabox",
    appId: "com.storymatrix.drama",
    title: "DramaBox - Stream Drama Shorts",
    genre: "Revenge & Betrayal",
    rating: 4.8,
    downloads: "5M+",
    posterUrl: "https://play-lh.googleusercontent.com/r7YmB38jG2n9vM_1N_C9eG3wT2t2t5i2m1c1k1k1v1k1v1k1v1k1v1k1v1k1v1k=w720-h1280",
    playStoreUrl: "https://play.google.com/store/apps/details?id=com.storymatrix.drama",
    appStoreUrl: "https://apps.apple.com/us/app/dramabox-stream-drama-shorts/id6445905219",
    developer: "StoryMatrix",
    description: "DramaBox delivers gripping urban family drama, betrayal sequences, and CEO revenge cycles with high production values."
  },
  {
    id: "shortmax",
    appId: "live.shorttv.apps",
    title: "ShortMax - Watch Dramas & Shows",
    genre: "CEO & Mystery",
    rating: 4.8,
    downloads: "8M+",
    posterUrl: "https://play-lh.googleusercontent.com/O-OR6Mh0AoNyiaYYaa3OJ_VHGfLqWW2qNzUUZxRRodD3fqs2Pm04FatavdNbz-jsMZM=w720-h1280",
    playStoreUrl: "https://play.google.com/store/apps/details?id=live.shorttv.apps",
    appStoreUrl: "https://apps.apple.com/us/app/shortmax-watch-dramas-shows/id6463402431",
    developer: "ShortMax Video",
    description: "ShortMax offers fast-paced secret-identity storylines and cliffhanger hooks structured in quick 1-2 minute mobile episodes."
  },
  {
    id: "serealplus",
    appId: "com.sereal.app",
    title: "Sereal+ - Drama & Romance",
    genre: "Paranormal & Werewolf",
    rating: 4.8,
    downloads: "3M+",
    posterUrl: "https://play-lh.googleusercontent.com/O-OR6Mh0AoNyiaYYaa3OJ_VHGfLqWW2qNzUUZxRRodD3fqs2Pm04FatavdNbz-jsMZM=w720-h1280",
    playStoreUrl: "https://play.google.com/store/apps/details?id=com.sereal.app",
    appStoreUrl: "https://apps.apple.com/us/app/id6450622288",
    developer: "Sereal Plus Team",
    description: "Sereal+ blends romance with paranormal drama — lycan kings, forbidden alphas, and billionaire heiresses across episodic short-form seasons."
  }
];

function itunesResultToPlatform(result: ItunesResult, knownIds: Set<string>): Platform | null {
  const extId = `itunes_${result.trackId}`;
  if (knownIds.has(extId)) return null;

  const icon =
    result.artworkUrl512 ||
    result.artworkUrl100 ||
    `https://picsum.photos/seed/app_${result.trackId}/200/200`;

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
    icon_url: icon,
    poster_url: icon,
    posterUrl: icon,
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

