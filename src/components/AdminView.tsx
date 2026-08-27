import React, { useState } from 'react';
import { 
  ShieldCheck, Lock, LogOut, ArrowUp, ArrowDown, Star, CheckCircle2, 
  XCircle, RefreshCw, Plus, Trash2, Eye, EyeOff, Sparkles, DollarSign,
  AlertCircle, ExternalLink, Layers, Search, Code2, Database, Copy, Check, FileCode, Play
} from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { Platform, GooglePlayScraperItem } from '@/types';
import { discoverNewPlatforms, DiscoveryResult, CURATED_GOOGLE_PLAY_PRESETS, parseGooglePlayScraperJson } from '@/services/appStoreDiscovery';

export const AdminView: React.FC = () => {
  const {
    adminUser, login, logout, platforms, featuredOrder,
    toggleFeatured, toggleActive, moveFeaturedUp, moveFeaturedDown,
    sponsorInquiries, approveSponsorInquiry, rejectSponsorInquiry,
    mergeDiscoveredPlatforms, importGooglePlayJson
  } = useApp();

  const [email, setEmail] = useState('admin@dramaspot.com');
  const [password, setPassword] = useState('spotlight2024');
  const [loginError, setLoginError] = useState(false);

  const [activeTab, setActiveTab] = useState<'spotlight' | 'gplay' | 'scanner' | 'sponsors' | 'catalog'>('spotlight');
  const [catalogSearch, setCatalogSearch] = useState('');

  // Scanner state
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<DiscoveryResult | null>(null);

  // Google Play Scraper Ingestion State
  const defaultSampleJson = JSON.stringify(
    [
      {
        id: "reelshort",
        title: "ReelShort - Short Dramas",
        genre: "Billionaire & Romance",
        rating: 4.8,
        downloads: "10M+",
        posterUrl: "https://play-lh.googleusercontent.com/O-OR6Mh0AoNyiaYYaa3OJ_VHGfLqWW2qNzUUZxRRodD3fqs2Pm04FatavdNbz-jsMZM=w720-h1280",
        playStoreUrl: "https://play.google.com/store/apps/details?id=com.reelshort.app",
        appStoreUrl: "https://apps.apple.com/app/id1636270631"
      }
    ],
    null,
    2
  );

  const [gplayJson, setGplayJson] = useState(defaultSampleJson);
  const [importNotice, setImportNotice] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ok = login(email, password);
    if (!ok) {
      setLoginError(true);
    } else {
      setLoginError(false);
    }
  };

  const handleRunScanner = async () => {
    setIsScanning(true);
    try {
      const knownIds = new Set(platforms.map(p => p.id));
      const res = await discoverNewPlatforms(knownIds);
      setScanResult(res);
    } catch (err) {
      console.error('Scan error:', err);
    } finally {
      setIsScanning(false);
    }
  };

  const handleImportScanned = () => {
    if (!scanResult || scanResult.platforms.length === 0) return;
    mergeDiscoveredPlatforms(scanResult.platforms);
    setScanResult(null);
  };

  const handleImportGooglePlayData = () => {
    try {
      const result = importGooglePlayJson(gplayJson);
      if (result.added > 0 || result.updated > 0) {
        setImportNotice({
          type: 'success',
          message: `Successfully ingested Google Play Scraper data! ${result.updated} updated, ${result.added} newly added.`
        });
      } else {
        setImportNotice({
          type: 'error',
          message: 'No valid app records could be imported from the JSON.'
        });
      }
    } catch (err) {
      setImportNotice({
        type: 'error',
        message: 'Invalid JSON format. Please verify JSON array syntax.'
      });
    }
  };

  const handleLoadCuratedPreset = () => {
    setGplayJson(JSON.stringify(CURATED_GOOGLE_PLAY_PRESETS, null, 2));
    setImportNotice(null);
  };

  const handleLoadSinglePreset = () => {
    setGplayJson(defaultSampleJson);
    setImportNotice(null);
  };

  const parsedPreview = React.useMemo(() => {
    try {
      return parseGooglePlayScraperJson(gplayJson);
    } catch (_) {
      return [];
    }
  }, [gplayJson]);

  // If not logged in, show Login Screen
  if (!adminUser) {
    return (
      <div className="max-w-md mx-auto px-4 py-16">
        <div className="bg-white border border-[#E7DFD5] rounded-3xl p-6 sm:p-8 shadow-xl warm-card-shadow">
          <div className="w-12 h-12 rounded-2xl bg-[#15803D]/10 border border-[#15803D]/25 flex items-center justify-center text-[#15803D] mx-auto mb-4">
            <Lock className="w-6 h-6" />
          </div>

          <h2 className="text-xl font-extrabold text-[#1C1917] text-center mb-1 font-['Cinzel',serif]">
            Admin Control Center
          </h2>
          <p className="text-xs text-[#78716C] text-center mb-6">
            Sign in to curate Spotlight rankings, review sponsors, and scan live store directories.
          </p>

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#1C1917] mb-1.5">
                Admin Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-[#FAF8F5] border border-[#E7DFD5] focus:border-[#15803D] focus:bg-white rounded-xl px-3.5 py-2.5 text-xs text-[#1C1917] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1C1917] mb-1.5">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-[#FAF8F5] border border-[#E7DFD5] focus:border-[#15803D] focus:bg-white rounded-xl px-3.5 py-2.5 text-xs text-[#1C1917] outline-none"
              />
            </div>

            {loginError && (
              <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                <span>Invalid credentials. Use admin@dramaspot.com / spotlight2024</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-[#15803D] hover:bg-[#166534] text-white font-bold text-xs transition-transform hover:scale-102 cursor-pointer shadow-md shadow-[#15803D]/20"
            >
              Sign In to Management Console
            </button>
          </form>

          <div className="mt-6 p-3 rounded-xl bg-[#FAF8F5] border border-[#E7DFD5] text-center text-[11px] text-[#78716C]">
            Default Demo Creds: <code className="text-[#15803D] font-bold">admin@dramaspot.com</code> / <code className="text-[#15803D] font-bold">spotlight2024</code>
          </div>
        </div>
      </div>
    );
  }

  // Calculate Metrics
  const activeCount = platforms.filter(p => p.active).length;
  const featuredCount = featuredOrder.length;
  const pendingSponsors = sponsorInquiries.filter(s => s.payment_status === 'paid_pending_approval');
  const totalRevenue = sponsorInquiries.reduce((acc, curr) => acc + curr.total_amount, 0);

  const filteredCatalogForAdmin = platforms.filter(p => {
    if (!catalogSearch) return true;
    const q = catalogSearch.toLowerCase();
    return p.name.toLowerCase().includes(q) || p.developer.toLowerCase().includes(q) || p.id.toLowerCase().includes(q);
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      
      {/* Top Admin Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl bg-white border border-[#E7DFD5] mb-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#15803D]/10 border border-[#15803D]/25 flex items-center justify-center text-[#15803D]">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-extrabold text-[#1C1917]">
              Platform Administration Console
            </h1>
            <p className="text-xs text-[#78716C]">
              Signed in as <span className="text-[#15803D] font-bold">{adminUser.email}</span>
            </p>
          </div>
        </div>

        <button
          onClick={logout}
          className="px-4 py-2 rounded-xl bg-[#FAF8F5] hover:bg-[#F5F2EB] border border-[#E7DFD5] text-xs font-bold text-[#57534E] hover:text-[#1C1917] flex items-center gap-2 transition-colors cursor-pointer self-start sm:self-auto"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="p-4 rounded-2xl bg-white border border-[#E7DFD5] shadow-2xs">
          <div className="text-xs text-[#78716C] font-medium mb-1">Total Catalog</div>
          <div className="text-xl font-black text-[#1C1917] font-mono">{platforms.length}</div>
          <div className="text-[10px] text-[#15803D] font-bold mt-1">{activeCount} active in directory</div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#E7DFD5] shadow-2xs">
          <div className="text-xs text-[#78716C] font-medium mb-1">Spotlight Slots</div>
          <div className="text-xl font-black text-[#1C1917] font-mono">{featuredCount} / 10</div>
          <div className="text-[10px] text-[#78716C] mt-1">Live Carousel Order</div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#E7DFD5] shadow-2xs">
          <div className="text-xs text-[#78716C] font-medium mb-1">Pending Sponsors</div>
          <div className="text-xl font-black text-[#15803D] font-mono">{pendingSponsors.length}</div>
          <div className="text-[10px] text-[#78716C] mt-1">Awaiting approval</div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#E7DFD5] shadow-2xs">
          <div className="text-xs text-[#78716C] font-medium mb-1">Sponsor Pipeline</div>
          <div className="text-xl font-black text-[#1C1917] font-mono">${totalRevenue.toLocaleString()}</div>
          <div className="text-[10px] text-[#78716C] mt-1">Gross inquiries</div>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex items-center gap-2 border-b border-[#E7DFD5] pb-3 mb-6 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveTab('spotlight')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'spotlight'
              ? 'bg-[#15803D] text-white shadow-md shadow-[#15803D]/20'
              : 'bg-white text-[#57534E] hover:text-[#1C1917] border border-[#E7DFD5]'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Spotlight Manager ({featuredOrder.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('gplay')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'gplay'
              ? 'bg-[#15803D] text-white shadow-md shadow-[#15803D]/20'
              : 'bg-white text-[#57534E] hover:text-[#1C1917] border border-[#E7DFD5]'
          }`}
        >
          <Code2 className="w-3.5 h-3.5" />
          <span>Google Play Scraper JSON</span>
        </button>

        <button
          onClick={() => setActiveTab('scanner')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'scanner'
              ? 'bg-[#15803D] text-white shadow-md shadow-[#15803D]/20'
              : 'bg-white text-[#57534E] hover:text-[#1C1917] border border-[#E7DFD5]'
          }`}
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>App Store Scanner</span>
        </button>

        <button
          onClick={() => setActiveTab('sponsors')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'sponsors'
              ? 'bg-[#15803D] text-white shadow-md shadow-[#15803D]/20'
              : 'bg-white text-[#57534E] hover:text-[#1C1917] border border-[#E7DFD5]'
          }`}
        >
          <DollarSign className="w-3.5 h-3.5" />
          <span>Sponsors ({sponsorInquiries.length})</span>
          {pendingSponsors.length > 0 && (
            <span className="px-1.5 py-0.2 rounded-full bg-rose-500 text-white text-[10px] font-bold">
              {pendingSponsors.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('catalog')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'catalog'
              ? 'bg-[#15803D] text-white shadow-md shadow-[#15803D]/20'
              : 'bg-white text-[#57534E] hover:text-[#1C1917] border border-[#E7DFD5]'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>All Platforms ({platforms.length})</span>
        </button>
      </div>

      {/* Tab 1: Spotlight Manager */}
      {activeTab === 'spotlight' && (
        <div className="bg-white border border-[#E7DFD5] rounded-3xl p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-[#F5F2EB]">
            <div>
              <h2 className="text-base font-extrabold text-[#1C1917]">
                Spotlight Showcase Ordering (Max 10)
              </h2>
              <p className="text-xs text-[#78716C]">
                The exact sequence below determines the top featured carousel on the Discover page.
              </p>
            </div>
            <span className="px-3 py-1 text-xs font-bold rounded-lg bg-[#E8F2EC] text-[#15803D] border border-[#D1E5D8] self-start sm:self-auto">
              {featuredOrder.length}/10 Active Slots
            </span>
          </div>

          <div className="space-y-2.5">
            {featuredOrder.map((id, index) => {
              const platform = platforms.find(p => p.id === id);
              if (!platform) return null;

              return (
                <div
                  key={id}
                  className="flex items-center justify-between gap-3 p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#E7DFD5] hover:border-[#D8D1C5] transition-all"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 text-center font-mono font-bold text-xs text-[#15803D]">
                      #{index + 1}
                    </span>
                    <img
                      src={platform.icon_url}
                      alt={platform.name}
                      className="w-10 h-10 rounded-xl object-cover bg-[#E7DFD5]"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs sm:text-sm font-bold text-[#1C1917]">
                          {platform.name}
                        </span>
                        <span className="text-[10px] text-[#78716C] font-medium">
                          {platform.developer}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-[#78716C]">
                        <span>Rating: {platform.rating}★</span>
                        <span>•</span>
                        <span>{platform.download_count}</span>
                        <span>•</span>
                        <span className="text-[#15803D] font-bold">{platform.content_focus}</span>
                      </div>
                    </div>
                  </div>

                  {/* Move Up / Move Down / Remove from Spotlight */}
                  <div className="flex items-center gap-1.5">
                    <button
                      disabled={index === 0}
                      onClick={() => moveFeaturedUp(id)}
                      className="p-1.5 rounded-lg bg-white border border-[#E7DFD5] hover:bg-[#F5F2EB] text-[#57534E] disabled:opacity-30 cursor-pointer shadow-2xs"
                      title="Move Up"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>
                    <button
                      disabled={index === featuredOrder.length - 1}
                      onClick={() => moveFeaturedDown(id)}
                      className="p-1.5 rounded-lg bg-white border border-[#E7DFD5] hover:bg-[#F5F2EB] text-[#57534E] disabled:opacity-30 cursor-pointer shadow-2xs"
                      title="Move Down"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => toggleFeatured(id)}
                      className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 cursor-pointer ml-1"
                      title="Remove from Spotlight"
                    >
                      <XCircle className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}

            {featuredOrder.length === 0 && (
              <p className="text-xs text-[#78716C] text-center py-8">
                No platforms currently in spotlight. Add platforms from the "All Platforms" tab below.
              </p>
            )}
          </div>
        </div>
      )}

      {/* Tab: Google Play Scraper JSON */}
      {activeTab === 'gplay' && (
        <div className="bg-white border border-[#E7DFD5] rounded-3xl p-6 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#F5F2EB]">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-[#E8F2EC] text-[#15803D] text-[10px] font-extrabold border border-[#D1E5D8]">
                  GOOGLE PLAY SCRAPER ENGINE
                </span>
              </div>
              <h2 className="text-base font-extrabold text-[#1C1917] mt-1">
                Google Play Scraper JSON Ingestion
              </h2>
              <p className="text-xs text-[#78716C] mt-0.5">
                Ingest high-resolution vertical key-art screenshot URLs and store metadata generated by <code className="px-1.5 py-0.5 bg-[#FAF8F5] border border-[#E7DFD5] rounded font-mono text-[11px] text-[#1C1917]">google-play-scraper</code>.
              </p>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <button
                onClick={handleLoadSinglePreset}
                className="px-3 py-2 rounded-xl bg-[#FAF8F5] hover:bg-[#F5F2EB] border border-[#E7DFD5] text-[#57534E] hover:text-[#1C1917] text-xs font-bold transition-all cursor-pointer"
              >
                Load ReelShort Preset
              </button>
              <button
                onClick={handleLoadCuratedPreset}
                className="px-3 py-2 rounded-xl bg-[#FAF8F5] hover:bg-[#F5F2EB] border border-[#E7DFD5] text-[#57534E] hover:text-[#1C1917] text-xs font-bold transition-all cursor-pointer"
              >
                Load Top 4 Apps Pack
              </button>
            </div>
          </div>

          {/* Scraper CLI / Node.js Reference Banner */}
          <div className="p-4 rounded-2xl bg-[#1C1917] text-white space-y-2 border border-[#292524]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-[#E7DFD5]">
                <FileCode className="w-4 h-4 text-[#22C55E]" />
                <span>Node.js Extraction Script (<code className="font-mono text-emerald-400">google-play-scraper</code>)</span>
              </div>
              <button
                onClick={() => {
                  const code = `import gplay from 'google-play-scraper';\n\nconst appData = await gplay.app({ appId: 'com.reelshort.app' });\nconsole.log(appData.screenshots[0]); // Returns high-res vertical screenshot CDN URL`;
                  navigator.clipboard.writeText(code);
                  setCopiedCode(true);
                  setTimeout(() => setCopiedCode(false), 2000);
                }}
                className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-[11px] font-bold text-white flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCode ? 'Copied' : 'Copy Code'}</span>
              </button>
            </div>
            <pre className="text-[11px] font-mono text-[#D6D3D1] bg-[#0C0A09] p-3 rounded-xl overflow-x-auto border border-white/10">
{`import gplay from 'google-play-scraper';

const appData = await gplay.app({ appId: 'com.reelshort.app' });
console.log(appData.screenshots[0]); // Returns high-res vertical screenshot CDN URL`}
            </pre>
          </div>

          {/* JSON Input & Actions */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[#1C1917] flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-[#15803D]" />
                <span>Scraper Output JSON Payload (Array of Apps)</span>
              </label>
              <span className="text-[11px] text-[#78716C]">
                {parsedPreview.length} valid item{parsedPreview.length === 1 ? '' : 's'} detected
              </span>
            </div>

            <textarea
              rows={8}
              value={gplayJson}
              onChange={e => {
                setGplayJson(e.target.value);
                setImportNotice(null);
              }}
              placeholder={`[\n  {\n    "id": "reelshort",\n    "title": "ReelShort - Short Dramas",\n    "genre": "Billionaire & Romance",\n    "rating": 4.8,\n    "downloads": "10M+",\n    "posterUrl": "https://play-lh.googleusercontent.com/O-OR6Mh0AoNyiaYYaa3OJ_VHGfLqWW2qNzUUZxRRodD3fqs2Pm04FatavdNbz-jsMZM=w720-h1280",\n    "playStoreUrl": "https://play.google.com/store/apps/details?id=com.reelshort.app",\n    "appStoreUrl": "https://apps.apple.com/app/id1636270631"\n  }\n]`}
              className="w-full p-4 rounded-2xl bg-[#FAF8F5] border border-[#E7DFD5] font-mono text-xs text-[#1C1917] focus:outline-none focus:ring-2 focus:ring-[#15803D] focus:bg-white transition-all resize-y"
            />

            {importNotice && (
              <div
                className={`p-3.5 rounded-xl text-xs font-bold flex items-center gap-2 ${
                  importNotice.type === 'success'
                    ? 'bg-[#E8F2EC] text-[#15803D] border border-[#D1E5D8]'
                    : 'bg-rose-50 text-rose-700 border border-rose-200'
                }`}
              >
                {importNotice.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 shrink-0" />
                )}
                <span>{importNotice.message}</span>
              </div>
            )}

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={handleImportGooglePlayData}
                disabled={parsedPreview.length === 0}
                className="px-5 py-2.5 rounded-xl bg-[#15803D] hover:bg-[#166534] text-white font-bold text-xs flex items-center gap-2 transition-transform hover:scale-102 cursor-pointer disabled:opacity-40 shadow-md shadow-[#15803D]/20"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Ingest & Sync into Live Directory ({parsedPreview.length})</span>
              </button>

              <button
                onClick={() => {
                  try {
                    const parsed = JSON.parse(gplayJson);
                    setGplayJson(JSON.stringify(parsed, null, 2));
                  } catch (_) {}
                }}
                className="px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] hover:bg-[#F5F2EB] border border-[#E7DFD5] text-[#57534E] text-xs font-bold cursor-pointer"
              >
                Format JSON
              </button>
            </div>
          </div>

          {/* Parsed Live Preview Section */}
          {parsedPreview.length > 0 && (
            <div className="space-y-3 pt-4 border-t border-[#F5F2EB]">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-extrabold text-[#1C1917] tracking-wider uppercase">
                  Parsed Apps Preview ({parsedPreview.length})
                </h3>
                <span className="text-[11px] text-[#78716C]">
                  High-resolution 9:16 vertical screenshot CDN verified
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {parsedPreview.map((item, idx) => {
                  const existingMatch = platforms.find(
                    p =>
                      p.id.toLowerCase() === item.id.toLowerCase() ||
                      p.name.toLowerCase() === item.name.toLowerCase() ||
                      (item.id === 'reelshort' && p.id === 'rs')
                  );

                  return (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E7DFD5] flex gap-4 items-start"
                    >
                      {/* 9:16 vertical poster preview */}
                      <div className="w-16 h-28 shrink-0 rounded-xl overflow-hidden bg-[#1C1917] border border-[#E7DFD5] relative group">
                        <img
                          src={item.poster_url || item.posterUrl}
                          alt={item.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                          onError={e => {
                            (e.target as HTMLImageElement).src =
                              'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=600&h=1067&q=80';
                          }}
                        />
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <Play className="w-4 h-4 text-white fill-white" />
                        </div>
                      </div>

                      {/* Metadata */}
                      <div className="flex-1 min-w-0 space-y-1.5">
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="text-sm font-bold text-[#1C1917] truncate">{item.name}</h4>
                          <span
                            className={`px-2 py-0.5 text-[10px] font-bold rounded-full shrink-0 ${
                              existingMatch
                                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                : 'bg-[#E8F2EC] text-[#15803D] border border-[#D1E5D8]'
                            }`}
                          >
                            {existingMatch ? 'Will Update Existing' : 'New Platform'}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-xs text-[#78716C]">
                          <span className="flex items-center gap-0.5 text-amber-600 font-bold">
                            <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                            {item.rating}
                          </span>
                          <span>•</span>
                          <span className="font-medium text-[#57534E]">{item.download_count} installs</span>
                          <span>•</span>
                          <span className="px-2 py-0.2 rounded-full bg-[#E8F2EC] text-[#15803D] font-bold text-[10px]">
                            {item.content_focus}
                          </span>
                        </div>

                        <p className="text-[11px] text-[#78716C] line-clamp-2">{item.description}</p>

                        <div className="flex items-center gap-2 pt-1">
                          {item.playStoreUrl && (
                            <a
                              href={item.playStoreUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="px-2 py-1 rounded-lg bg-white border border-[#E7DFD5] text-[10px] font-bold text-[#1C1917] hover:bg-[#F5F2EB] flex items-center gap-1"
                            >
                              <span>Google Play</span>
                              <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                            </a>
                          )}
                          {item.appStoreUrl && (
                            <a
                              href={item.appStoreUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="px-2 py-1 rounded-lg bg-white border border-[#E7DFD5] text-[10px] font-bold text-[#1C1917] hover:bg-[#F5F2EB] flex items-center gap-1"
                            >
                              <span>App Store</span>
                              <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: App Store Scanner */}
      {activeTab === 'scanner' && (
        <div className="bg-white border border-[#E7DFD5] rounded-3xl p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-[#F5F2EB]">
            <div>
              <h2 className="text-base font-extrabold text-[#1C1917]">
                Live App Store Discovery Engine
              </h2>
              <p className="text-xs text-[#78716C]">
                Queries real-time Apple iTunes Software API for newly registered vertical drama and micro-series applications.
              </p>
            </div>

            <button
              onClick={handleRunScanner}
              disabled={isScanning}
              className="px-5 py-2.5 rounded-xl bg-[#15803D] hover:bg-[#166534] text-white font-bold text-xs flex items-center gap-2 transition-transform hover:scale-102 cursor-pointer disabled:opacity-50 self-start sm:self-auto shadow-md shadow-[#15803D]/20"
            >
              <RefreshCw className={`w-4 h-4 ${isScanning ? 'animate-spin' : ''}`} />
              <span>{isScanning ? 'Executing Store Queries...' : 'Run Discovery Scan Now'}</span>
            </button>
          </div>

          {/* Results Area */}
          {scanResult ? (
            <div>
              <div className="p-4 rounded-2xl bg-[#E8F2EC] border border-[#D1E5D8] flex flex-col sm:flex-row items-center justify-between gap-3 mb-6">
                <div>
                  <div className="text-sm font-bold text-[#15803D]">
                    Scan Complete: {scanResult.platforms.length} Unindexed Apps Found
                  </div>
                  <div className="text-xs text-[#78716C]">
                    Analyzed {scanResult.totalFound} store software records matching vertical short drama keywords.
                  </div>
                </div>

                {scanResult.platforms.length > 0 && (
                  <button
                    onClick={handleImportScanned}
                    className="px-4 py-2 rounded-xl bg-[#15803D] text-white text-xs font-bold hover:bg-[#166534] transition-all cursor-pointer shadow-md shadow-[#15803D]/20"
                  >
                    Import All ({scanResult.platforms.length}) into Catalog
                  </button>
                )}
              </div>

              {scanResult.platforms.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {scanResult.platforms.map(p => (
                    <div
                      key={p.id}
                      className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#E7DFD5] flex items-start gap-3"
                    >
                      <img src={p.icon_url} alt={p.name} className="w-12 h-12 rounded-xl object-cover bg-[#E7DFD5]" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-bold text-[#1C1917] truncate">{p.name}</h4>
                          <span className="text-[10px] text-[#15803D] font-bold">{p.rating}★</span>
                        </div>
                        <p className="text-[11px] text-[#78716C] truncate">{p.developer}</p>
                        <p className="text-[11px] text-[#57534E] line-clamp-2 mt-1">{p.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-[#78716C] text-center py-6">
                  All active Store apps are already synchronized with your directory.
                </p>
              )}
            </div>
          ) : (
            <div className="py-12 text-center text-[#78716C]">
              <RefreshCw className="w-8 h-8 mx-auto mb-3 opacity-40" />
              <p className="text-xs">Click "Run Discovery Scan Now" to fetch live App Store releases.</p>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Sponsor Inquiries */}
      {activeTab === 'sponsors' && (
        <div className="bg-white border border-[#E7DFD5] rounded-3xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#F5F2EB]">
            <div>
              <h2 className="text-base font-extrabold text-[#1C1917]">
                Studio Sponsorship Requests
              </h2>
              <p className="text-xs text-[#78716C]">
                Approving an inquiry automatically activates and slots the sponsored series into the directory & spotlight.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {sponsorInquiries.map(s => {
              const isPending = s.payment_status === 'paid_pending_approval';
              const isActive = s.payment_status === 'active';

              return (
                <div
                  key={s.id}
                  className="p-5 rounded-2xl bg-[#FAF8F5] border border-[#E7DFD5] flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-[#1C1917]">{s.studio_name}</span>
                      <span className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full ${
                        isActive
                          ? 'bg-[#E8F2EC] text-[#15803D] border border-[#D1E5D8]'
                          : isPending
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}>
                        {s.payment_status.toUpperCase().replace(/_/g, ' ')}
                      </span>
                    </div>

                    <p className="text-xs text-[#57534E]">
                      Series: <strong className="text-[#1C1917] font-semibold">"{s.series_title}"</strong>
                    </p>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-[#78716C]">
                      <span>Contact: {s.contact_name} ({s.contact_email})</span>
                      <span>•</span>
                      <span>Tier: <strong className="text-[#15803D]">{s.package_name}</strong></span>
                      <span>•</span>
                      <span>Duration: {s.weeks} wks</span>
                      <span>•</span>
                      <span>Gross: <strong className="text-[#1C1917] font-mono">${s.total_amount}</strong></span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    {isPending && (
                      <>
                        <button
                          onClick={() => approveSponsorInquiry(s.id)}
                          className="px-4 py-2 rounded-xl bg-[#15803D] hover:bg-[#166534] text-white text-xs font-bold flex items-center gap-1.5 transition-transform hover:scale-102 cursor-pointer shadow-md shadow-[#15803D]/20"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Approve & Feature</span>
                        </button>
                        <button
                          onClick={() => rejectSponsorInquiry(s.id)}
                          className="px-3.5 py-2 rounded-xl bg-white hover:bg-rose-50 text-rose-600 border border-rose-200 text-xs font-bold cursor-pointer"
                        >
                          Reject
                        </button>
                      </>
                    )}
                    {isActive && (
                      <span className="text-xs text-[#15803D] font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" />
                        Live in Spotlight
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 4: Full Catalog Manager */}
      {activeTab === 'catalog' && (
        <div className="bg-white border border-[#E7DFD5] rounded-3xl p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-[#F5F2EB]">
            <div>
              <h2 className="text-base font-extrabold text-[#1C1917]">
                Platform Catalog ({platforms.length})
              </h2>
              <p className="text-xs text-[#78716C]">
                Toggle visibility or feature platforms directly in the Spotlight.
              </p>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-[#78716C]" />
              <input
                type="text"
                value={catalogSearch}
                onChange={e => setCatalogSearch(e.target.value)}
                placeholder="Filter by name..."
                className="w-full bg-[#FAF8F5] border border-[#E7DFD5] focus:border-[#15803D] focus:bg-white rounded-xl pl-9 pr-3 py-2 text-xs text-[#1C1917] outline-none"
              />
            </div>
          </div>

          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
            {filteredCatalogForAdmin.map(p => {
              const isSpotlight = featuredOrder.includes(p.id);

              return (
                <div
                  key={p.id}
                  className={`flex items-center justify-between gap-3 p-3 rounded-2xl border transition-all ${
                    p.active
                      ? 'bg-[#FAF8F5] border-[#E7DFD5]'
                      : 'bg-stone-100 border-dashed border-[#E7DFD5] opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img src={p.icon_url} alt={p.name} className="w-9 h-9 rounded-xl object-cover bg-[#E7DFD5] flex-shrink-0" />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#1C1917] truncate">{p.name}</span>
                        <span className="text-[10px] text-[#78716C] truncate">by {p.developer}</span>
                      </div>
                      <div className="text-[10px] text-[#78716C] flex items-center gap-2">
                        <span>{p.rating}★</span>
                        <span>•</span>
                        <span>{p.region_origin === 'US_Dominant' ? '🇺🇸 US' : '🌐 Global'}</span>
                        <span>•</span>
                        <span>{p.content_focus}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => toggleFeatured(p.id)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer ${
                        isSpotlight
                          ? 'bg-[#15803D] text-white'
                          : 'bg-white hover:bg-[#F5F2EB] text-[#78716C] hover:text-[#1C1917] border border-[#E7DFD5]'
                      }`}
                      title={isSpotlight ? 'Remove from spotlight' : 'Add to spotlight'}
                    >
                      <Star className="w-3 h-3" />
                      <span>{isSpotlight ? 'Featured' : 'Feature'}</span>
                    </button>

                    <button
                      onClick={() => toggleActive(p.id)}
                      className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                        p.active
                          ? 'bg-[#E8F2EC] text-[#15803D] border border-[#D1E5D8]'
                          : 'bg-rose-50 text-rose-600 border border-rose-200'
                      }`}
                      title={p.active ? 'Disable platform from directory' : 'Enable platform in directory'}
                    >
                      {p.active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
};
