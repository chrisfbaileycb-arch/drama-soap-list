import React, { useState } from 'react';
import { Award, CheckCircle2, Sparkles, Shield, Clock, ArrowRight, DollarSign, Upload, AlertCircle, HelpCircle, Film, Play, Star, Eye } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '@/contexts/AppContext';

interface SponsorViewProps {
  onSuccessReturn: () => void;
}

export const SponsorView: React.FC<SponsorViewProps> = ({ onSuccessReturn }) => {
  const { submitSponsorInquiry } = useApp();

  const [packageTier, setPackageTier] = useState<399 | 599>(599);
  const [weeks, setWeeks] = useState<number>(4);

  const [studioName, setStudioName] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [seriesTitle, setSeriesTitle] = useState('');
  const [targetUrl, setTargetUrl] = useState('');
  const [genre, setGenre] = useState('Romance');
  const [posterUrl, setPosterUrl] = useState('https://picsum.photos/seed/drama_sponsor_preview/450/800');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedId, setSubmittedId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const basePrice = packageTier;
  const totalAmount = basePrice * weeks;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!studioName.trim() || !contactName.trim() || !contactEmail.trim() || !seriesTitle.trim() || !targetUrl.trim()) {
      setErrorMsg('Please fill in all required fields.');
      return;
    }

    setIsSubmitting(true);

    try {
      setTimeout(() => {
        const id = submitSponsorInquiry({
          studio_name: studioName.trim(),
          contact_name: contactName.trim(),
          contact_email: contactEmail.trim(),
          series_title: seriesTitle.trim(),
          target_url: targetUrl.trim(),
          poster_url: posterUrl.trim() || `https://picsum.photos/seed/${encodeURIComponent(studioName)}/450/800`,
          package_tier: packageTier,
          package_name: packageTier === 599 ? 'Premium Featured' : 'Standard Spotlight',
          weeks,
          total_amount: totalAmount,
          payment_status: 'paid_pending_approval',
        });

        setIsSubmitting(false);
        setSubmittedId(id);

        try {
          confetti({
            particleCount: 90,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#15803D', '#22C55E', '#D97706', '#1C1917'],
          });
        } catch (_) {}
      }, 600);
    } catch (err) {
      console.error('Submission error:', err);
      setIsSubmitting(false);
      setErrorMsg('Submission encountered an unexpected error. Please verify input fields and try again.');
    }
  };

  if (submittedId) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 rounded-3xl bg-[#15803D]/10 border border-[#15803D]/30 flex items-center justify-center text-[#15803D] mx-auto mb-6 shadow-sm">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1C1917] mb-2 font-['Cinzel',serif]">
          Sponsorship Request Submitted!
        </h2>
        <p className="text-sm text-[#78716C] mb-6">
          Application Reference: <span className="font-mono text-[#15803D] font-bold">{submittedId}</span>
        </p>

        <div className="p-6 rounded-3xl bg-white border border-[#E7DFD5] text-left mb-8 space-y-3 shadow-sm">
          <div className="flex justify-between border-b border-[#F5F2EB] pb-2 text-xs">
            <span className="text-[#78716C]">Publisher / Studio:</span>
            <span className="text-[#1C1917] font-bold">{studioName}</span>
          </div>
          <div className="flex justify-between border-b border-[#F5F2EB] pb-2 text-xs">
            <span className="text-[#78716C]">Series / App:</span>
            <span className="text-[#1C1917] font-bold">{seriesTitle}</span>
          </div>
          <div className="flex justify-between border-b border-[#F5F2EB] pb-2 text-xs">
            <span className="text-[#78716C]">Selected Tier & Duration:</span>
            <span className="text-[#15803D] font-bold">
              {packageTier === 599 ? 'Premium Featured ($599/wk)' : 'Standard Spotlight ($399/wk)'} ({weeks} {weeks === 1 ? 'Week' : 'Weeks'})
            </span>
          </div>
          <div className="flex justify-between text-xs pt-1">
            <span className="text-[#78716C]">Total Investment:</span>
            <span className="text-[#1C1917] font-extrabold text-sm">${totalAmount.toLocaleString()} USD</span>
          </div>
        </div>

        <p className="text-xs text-[#57534E] mb-8 leading-relaxed">
          Our editorial review board verifies vertical series assets within 12 business hours. Once approved, your campaign will automatically occupy your guaranteed placement with direct store routing.
        </p>

        <button
          onClick={onSuccessReturn}
          className="px-8 py-3.5 rounded-2xl bg-[#15803D] hover:bg-[#166534] text-white font-extrabold text-sm transition-transform hover:scale-102 shadow-lg shadow-[#15803D]/20 cursor-pointer"
        >
          Return to Free Directory
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Header Banner */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#15803D]/10 border border-[#15803D]/20 text-[#15803D] text-xs font-extrabold uppercase tracking-wider mb-3">
          <Film className="w-3.5 h-3.5" />
          <span>Publisher & Studio Portal</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-[#1C1917] tracking-tight mb-3 font-['Cinzel',serif]">
          Promote Your Mini-Drama on SoapList
        </h1>
        <p className="text-xs sm:text-sm text-[#57534E] leading-relaxed">
          Reach dedicated vertical drama fans, werewolf romance readers, and short-form video viewers with high-impact native spotlight placements.
        </p>
      </div>

      {/* Package Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        
        {/* Standard Tier: $399/week */}
        <div
          onClick={() => setPackageTier(399)}
          className={`p-6 sm:p-7 rounded-3xl border-2 transition-all cursor-pointer relative ${
            packageTier === 399
              ? 'bg-white border-[#15803D] shadow-xl shadow-[#15803D]/10 ring-2 ring-[#15803D]/20'
              : 'bg-white border-[#E7DFD5] hover:border-[#D8D1C5]'
          }`}
        >
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-[#1C1917]">Standard Spotlight</h3>
              <p className="text-xs text-[#78716C]">Rotating showcase placement + verified badge</p>
            </div>
            <div className="text-right">
              <span className="text-2xl sm:text-3xl font-black text-[#1C1917] font-mono">$399</span>
              <span className="text-xs text-[#78716C] block">/ week</span>
            </div>
          </div>

          <ul className="space-y-3 text-xs text-[#44403C] mb-6">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#15803D] flex-shrink-0" />
              <span><strong>Rotating placement</strong> in the top 3D Spotlight carousel (10 slots)</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#15803D] flex-shrink-0" />
              <span>Verified <strong>"Spotlight" badge</strong> on your directory profile</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#15803D] flex-shrink-0" />
              <span>Direct store routing to Google Play & Apple App Store</span>
            </li>
          </ul>

          <div className={`w-full py-2.5 rounded-xl text-center font-bold text-xs ${
            packageTier === 399 ? 'bg-[#15803D] text-white' : 'bg-[#FAF8F5] text-[#78716C]'
          }`}>
            {packageTier === 399 ? '✓ Selected Tier' : 'Select Standard ($399/wk)'}
          </div>
        </div>

        {/* Premium Tier: $599/week */}
        <div
          onClick={() => setPackageTier(599)}
          className={`p-6 sm:p-7 rounded-3xl border-2 transition-all cursor-pointer relative ${
            packageTier === 599
              ? 'bg-white border-[#15803D] shadow-xl shadow-[#15803D]/15 ring-2 ring-[#15803D]/20'
              : 'bg-white border-[#E7DFD5] hover:border-[#D8D1C5]'
          }`}
        >
          <span className="absolute -top-3 right-6 px-3 py-1 text-[10px] font-black uppercase tracking-wider bg-[#15803D] text-white rounded-full shadow-md">
            PREMIUM SPONSOR
          </span>

          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-[#1C1917] flex items-center gap-1.5">
                <span>Premium Featured</span>
                <Sparkles className="w-4 h-4 text-[#D97706]" />
              </h3>
              <p className="text-xs text-[#78716C]">Hero banner + 9:16 trailer + top-pinned genre</p>
            </div>
            <div className="text-right">
              <span className="text-2xl sm:text-3xl font-black text-[#15803D] font-mono">$599</span>
              <span className="text-xs text-[#78716C] block">/ week</span>
            </div>
          </div>

          <ul className="space-y-3 text-xs text-[#44403C] mb-6">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#15803D] flex-shrink-0" />
              <span><strong>Guaranteed #1 Sticky Hero banner</strong> across SoapList</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#15803D] flex-shrink-0" />
              <span>Embedded <strong>9:16 vertical video trailer preview</strong> in modal & banner</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#15803D] flex-shrink-0" />
              <span><strong>Top-pinned placement</strong> in your primary genre category</span>
            </li>
          </ul>

          <div className={`w-full py-2.5 rounded-xl text-center font-bold text-xs ${
            packageTier === 599 ? 'bg-[#15803D] text-white' : 'bg-[#FAF8F5] text-[#78716C]'
          }`}>
            {packageTier === 599 ? '✓ Selected Tier' : 'Select Premium ($599/wk)'}
          </div>
        </div>

      </div>

      {/* Form & Live Preview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Form Container */}
        <div className="lg:col-span-7 bg-white border border-[#E7DFD5] rounded-3xl p-6 sm:p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-5">
            
            <div className="border-b border-[#F5F2EB] pb-4 mb-5">
              <h2 className="text-lg font-bold text-[#1C1917] flex items-center gap-2">
                <Shield className="w-4 h-4 text-[#15803D]" />
                Campaign Specifications & Assets
              </h2>
              <p className="text-xs text-[#78716C]">
                Enter your publisher credentials and vertical drama series details.
              </p>
            </div>

            {/* Duration Selector */}
            <div>
              <label className="block text-xs font-bold text-[#1C1917] uppercase tracking-wider mb-2">
                Campaign Duration
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[1, 2, 4, 8].map(w => (
                  <button
                    type="button"
                    key={w}
                    onClick={() => setWeeks(w)}
                    className={`py-2.5 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex flex-col items-center ${
                      weeks === w
                        ? 'bg-[#15803D] text-white shadow-md shadow-[#15803D]/20'
                        : 'bg-[#FAF8F5] text-[#57534E] hover:bg-[#F5F2EB] border border-[#E7DFD5]'
                    }`}
                  >
                    <span>{w} {w === 1 ? 'Week' : 'Weeks'}</span>
                    <span className="text-[10px] opacity-90 font-mono">${(packageTier * w).toLocaleString()}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Studio and Contact */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#1C1917] mb-1.5">
                  Studio / Publisher Name *
                </label>
                <input
                  type="text"
                  required
                  value={studioName}
                  onChange={e => setStudioName(e.target.value)}
                  placeholder="e.g. Apex Horizon Studios"
                  className="w-full bg-[#FAF8F5] border border-[#E7DFD5] focus:border-[#15803D] focus:bg-white rounded-xl px-4 py-2.5 text-xs text-[#1C1917] placeholder-[#A8A29E] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1C1917] mb-1.5">
                  Contact Person *
                </label>
                <input
                  type="text"
                  required
                  value={contactName}
                  onChange={e => setContactName(e.target.value)}
                  placeholder="e.g. Elena Rostova"
                  className="w-full bg-[#FAF8F5] border border-[#E7DFD5] focus:border-[#15803D] focus:bg-white rounded-xl px-4 py-2.5 text-xs text-[#1C1917] placeholder-[#A8A29E] outline-none"
                />
              </div>
            </div>

            {/* Email and Series Title */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#1C1917] mb-1.5">
                  Work Email *
                </label>
                <input
                  type="email"
                  required
                  value={contactEmail}
                  onChange={e => setContactEmail(e.target.value)}
                  placeholder="e.g. elena@apexhorizon.la"
                  className="w-full bg-[#FAF8F5] border border-[#E7DFD5] focus:border-[#15803D] focus:bg-white rounded-xl px-4 py-2.5 text-xs text-[#1C1917] placeholder-[#A8A29E] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1C1917] mb-1.5">
                  Featured Series Title *
                </label>
                <input
                  type="text"
                  required
                  value={seriesTitle}
                  onChange={e => setSeriesTitle(e.target.value)}
                  placeholder="e.g. Forbidden Luna: Secret Alpha"
                  className="w-full bg-[#FAF8F5] border border-[#E7DFD5] focus:border-[#15803D] focus:bg-white rounded-xl px-4 py-2.5 text-xs text-[#1C1917] placeholder-[#A8A29E] outline-none"
                />
              </div>
            </div>

            {/* Primary Genre & Destination URL */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#1C1917] mb-1.5">
                  Primary Genre Category
                </label>
                <select
                  value={genre}
                  onChange={e => setGenre(e.target.value)}
                  className="w-full bg-[#FAF8F5] border border-[#E7DFD5] focus:border-[#15803D] focus:bg-white rounded-xl px-4 py-2.5 text-xs text-[#1C1917] outline-none"
                >
                  <option value="Romance">Romance & Werewolf</option>
                  <option value="Drama">Family & CEO Drama</option>
                  <option value="Thriller">Thriller & Mystery</option>
                  <option value="Multi-Genre">Multi-Genre & Sci-Fi</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1C1917] mb-1.5">
                  Store / Download URL *
                </label>
                <input
                  type="url"
                  required
                  value={targetUrl}
                  onChange={e => setTargetUrl(e.target.value)}
                  placeholder="https://play.google.com/store/apps/..."
                  className="w-full bg-[#FAF8F5] border border-[#E7DFD5] focus:border-[#15803D] focus:bg-white rounded-xl px-4 py-2.5 text-xs text-[#1C1917] placeholder-[#A8A29E] outline-none font-mono"
                />
              </div>
            </div>

            {errorMsg && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Pricing Summary Card & Submit */}
            <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E7DFD5] flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <div className="text-xs text-[#78716C]">Total Campaign Fee</div>
                <div className="text-xl font-black text-[#1C1917] font-mono">
                  ${totalAmount.toLocaleString()} USD
                  <span className="text-xs text-[#78716C] font-sans font-normal ml-2">
                    (${basePrice}/wk × {weeks} wks)
                  </span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto px-7 py-3 rounded-xl bg-[#15803D] hover:bg-[#166534] text-white font-extrabold text-sm flex items-center justify-center gap-2 transition-transform hover:scale-102 shadow-md shadow-[#15803D]/20 cursor-pointer disabled:opacity-50"
              >
                <span>{isSubmitting ? 'Processing Application...' : 'Submit Sponsorship'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </form>
        </div>

        {/* Live Mockup Preview Column */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-3xl bg-white border border-[#E7DFD5] shadow-sm">
            <div className="flex items-center justify-between mb-3 border-b border-[#F5F2EB] pb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#78716C] flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-[#15803D]" />
                <span>Live Placement Preview</span>
              </span>
              <span className="text-[10px] font-extrabold text-[#15803D] bg-[#E8F2EC] px-2 py-0.5 rounded-full">
                {packageTier === 599 ? 'Premium Hero' : 'Spotlight Card'}
              </span>
            </div>

            {/* Mock Card */}
            <div className="rounded-2xl border border-[#E7DFD5] p-3.5 bg-[#FAF8F5]">
              <div className="flex gap-3 mb-2.5">
                <div className="w-20 aspect-[9/14] rounded-xl overflow-hidden bg-[#E7DFD5] flex-shrink-0 relative">
                  <img
                    src={posterUrl}
                    alt="Preview Poster"
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-black/70 text-[8px] font-black text-amber-300">
                    SPOTLIGHT
                  </span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1 mb-0.5">
                    <span className="text-[10px] font-extrabold text-[#15803D] bg-[#E8F2EC] px-1.5 py-0.2 rounded">
                      {genre}
                    </span>
                    {packageTier === 599 && (
                      <span className="text-[9px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200">
                        TOP PIN
                      </span>
                    )}
                  </div>
                  <h4 className="font-extrabold text-sm text-[#1C1917] truncate">
                    {seriesTitle || 'Your Series Title'}
                  </h4>
                  <p className="text-[11px] text-[#78716C] truncate">
                    {studioName || 'Your Studio Name'}
                  </p>
                  <p className="text-[11px] text-[#15803D] font-medium mt-1">
                    🎬 9:16 Vertical Video Trailer Ready
                  </p>
                </div>
              </div>

              <div className="w-full py-1.5 rounded-lg bg-[#15803D] text-white text-center text-xs font-bold">
                Download on App Store & Google Play
              </div>
            </div>

            <p className="text-[11px] text-[#78716C] mt-3 leading-relaxed">
              * Sponsors receive priority indexing and direct link routing to maximize viewer installs and engagement.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
};
