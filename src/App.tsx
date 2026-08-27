import React, { useState } from 'react';
import { AppProvider, useApp } from '@/contexts/AppContext';
import { Header } from '@/components/Header';
import { LandingView } from '@/components/LandingView';
import { DiscoverView } from '@/components/DiscoverView';
import { SponsorView } from '@/components/SponsorView';
import { AdminView } from '@/components/AdminView';
import { Footer } from '@/components/Footer';
import { PlatformDetailModal } from '@/components/PlatformDetailModal';
import { discoverNewPlatforms } from '@/services/appStoreDiscovery';
import { Platform } from '@/types';

const MainApp: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<'landing' | 'discover' | 'sponsor' | 'admin'>('landing');
  const [selectedPlatform, setSelectedPlatform] = useState<Platform | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResultMsg, setScanResultMsg] = useState<string | null>(null);

  const { platforms, mergeDiscoveredPlatforms } = useApp();

  const handleScanDiscovery = async () => {
    setIsScanning(true);
    setScanResultMsg(null);
    try {
      const knownIds = new Set(platforms.map(p => p.id));
      const res = await discoverNewPlatforms(knownIds);
      if (res.platforms.length > 0) {
        mergeDiscoveredPlatforms(res.platforms);
        setScanResultMsg(`Discovered & indexed ${res.platforms.length} new vertical short drama platforms directly from the App Store!`);
      } else {
        setScanResultMsg(`Store scan complete: All current top ${res.totalFound} mini-drama releases are already in your catalog.`);
      }
      setTimeout(() => setScanResultMsg(null), 8000);
    } catch (err) {
      console.error('Scan discovery error:', err);
      setScanResultMsg('App Store discovery query failed or timed out. Please retry.');
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-[#1C1917]">
      <Header
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        onScanDiscovery={handleScanDiscovery}
        isScanning={isScanning}
      />

      <main className="flex-1">
        {currentTab === 'landing' && (
          <LandingView
            onNavigateToDirectory={() => setCurrentTab('discover')}
            onNavigateToSponsor={() => setCurrentTab('sponsor')}
            onSelectPlatform={(platform) => setSelectedPlatform(platform)}
          />
        )}

        {currentTab === 'discover' && (
          <DiscoverView
            onNavigateToSponsor={() => setCurrentTab('sponsor')}
            onScanDiscovery={handleScanDiscovery}
            isScanning={isScanning}
            scanResultMsg={scanResultMsg}
          />
        )}

        {currentTab === 'sponsor' && (
          <SponsorView
            onSuccessReturn={() => setCurrentTab('discover')}
          />
        )}

        {currentTab === 'admin' && (
          <AdminView />
        )}
      </main>

      {/* Global platform detail sheet / modal if selected from landing */}
      {selectedPlatform && (
        <PlatformDetailModal
          platform={selectedPlatform}
          onClose={() => setSelectedPlatform(null)}
        />
      )}

      <Footer onNavigateTab={setCurrentTab} />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
};

export default App;
