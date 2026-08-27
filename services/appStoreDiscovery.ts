import { Platform, ContentFocus, QualityTier, RegionOrigin } from '@/constants/dramaData';

// ─── iTunes Search API ────────────────────────────────────────────────────────

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

// ─── Helpers ─────────────────────────────────────────────────────────────────

function mapGenreToContentFocus(genres: string[] = [], name: string): ContentFocus {
  const all = [...genres, name].map(g => g.toLowerCase()).join(' ');
  if (all.includes('romance') || all.includes('love') || all.includes('romantic')) return 'Romance';
  if (all.includes('thriller') || all.includes('suspense') || all.includes('mystery')) return 'Thriller';
  if (all.includes('drama')) return 'Drama';
  return 'Multi-Genre';
}

function formatDownloadCount(ratingCount: number): string {
  if (ratingCount >= 1_000_000) return `${(ratingCount / 1_000_000).toFixed(0)}M+`;
  if (ratingCount >= 100_000) return `${(ratingCount / 1_000).toFixed(0)}K+`;
  if (ratingCount >= 1_000) return `${(ratingCount / 1_000).toFixed(0)}K+`;
  return `${ratingCount}+`;
}

function deriveSpecialties(name: string, description: string, genres: string[]): string[] {
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
    platform_url: `https://play.google.com/store/search?q=${encodeURIComponent(name)}&c=apps`,
    app_store_url: `https://apps.apple.com/us/app/id${result.trackId}`,
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

// ─── Main Discovery Function ──────────────────────────────────────────────────

export interface DiscoveryResult {
  platforms: Platform[];
  totalFound: number;
  searchTermsUsed: string[];
  error?: string;
}

async function queryItunesTerm(term: string): Promise<ItunesResult[]> {
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

  // Fire all queries in parallel
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

  // Filter to drama-relevant apps only
  const relevant = allResults.filter(isDramaRelevant);

  // Map to Platform objects, skip already known
  const newPlatforms: Platform[] = [];
  for (const result of relevant) {
    const p = itunesResultToPlatform(result, existingIds);
    if (p) newPlatforms.push(p);
  }

  // Sort by rating descending
  newPlatforms.sort((a, b) => b.rating - a.rating);

  return {
    platforms: newPlatforms,
    totalFound: relevant.length,
    searchTermsUsed: SEARCH_TERMS,
  };
}
