import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Pressable, Animated, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SpotlightCarousel } from '@/components/SpotlightCarousel';
import { PlatformCard } from '@/components/DramaCard';
import { PlatformDetailSheet } from '@/components/PlatformDetailSheet';
import { SearchBar } from '@/components/SearchBar';
import { GenreFilterBar } from '@/components/GenreFilterBar';
import { useApp } from '@/hooks/useAppState';
import { useDiscovery } from '@/hooks/useDiscovery';
import { Colors, Spacing, FontSize, Radius } from '@/constants/theme';
import { Platform } from '@/constants/dramaData';

interface HeaderProps {
  newCount: number;
  isRefreshing: boolean;
  lastRefreshed: Date | null;
}

function Header({ newCount, isRefreshing, lastRefreshed }: HeaderProps) {
  const { filteredCatalog, platforms } = useApp();
  const router = useRouter();
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!isRefreshing) return;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 0.4, duration: 600, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [isRefreshing, pulseAnim]);
  return (
    <View>
      <View style={styles.header}>
        <View style={styles.logoBlock}>
          <View style={styles.pill}>
            <MaterialIcons name="movie-filter" size={11} color={Colors.primary} />
            <Text style={styles.pillTxt}>Mini-Drama Directory</Text>
          </View>
          <Text style={styles.logo}>
            Soap<Text style={styles.logoAccent}>List</Text>
          </Text>
          <Text style={styles.logoSub}>U.S.-Focused Cinematic Drama Directory</Text>
        </View>
        <View style={styles.metricBadge}>
          <Text style={styles.metricNum}>{platforms.length}</Text>
          <Text style={styles.metricLbl}>Platforms</Text>
        </View>
      </View>

      <SpotlightCarousel />

      {/* Live Discovery Status */}
      {(newCount > 0 || isRefreshing) ? (
        <Animated.View style={[styles.liveBar, { opacity: isRefreshing ? pulseAnim : 1 }]}>
          <View style={styles.liveDot} />
          <Text style={styles.liveTxt}>
            {isRefreshing
              ? 'Scanning App Store for new platforms…'
              : `${newCount} new platform${newCount !== 1 ? 's' : ''} discovered`}
          </Text>
          {newCount > 0 && !isRefreshing ? (
            <View style={styles.liveCountBadge}>
              <Text style={styles.liveCountTxt}>+{newCount}</Text>
            </View>
          ) : null}
        </Animated.View>
      ) : null}

      {/* Sponsor CTA Banner */}
      <Pressable
        style={({ pressed }) => [styles.sponsorBanner, pressed && styles.sponsorPressed]}
        onPress={() => router.push('/(tabs)/sponsor')}
      >
        <View style={styles.sponsorLeft}>
          <View style={styles.sponsorIconWrap}>
            <MaterialIcons name="campaign" size={20} color={Colors.primary} />
          </View>
          <View style={styles.sponsorText}>
            <Text style={styles.sponsorTitle}>Get Your App Listed</Text>
            <Text style={styles.sponsorSub}>Reach thousands of mini-drama fans daily</Text>
          </View>
        </View>
        <View style={styles.sponsorBtn}>
          <Text style={styles.sponsorBtnTxt}>Sponsor</Text>
          <MaterialIcons name="arrow-forward-ios" size={10} color="#000" />
        </View>
      </Pressable>

      <SearchBar />
      <GenreFilterBar />

      <View style={styles.catHdr}>
        <Text style={styles.catTitle}>All Platforms</Text>
        <View style={styles.countPill}>
          <Text style={styles.countPillTxt}>{filteredCatalog.length} results</Text>
        </View>
      </View>
    </View>
  );
}

function EmptyState() {
  return (
    <View style={styles.empty}>
      <MaterialIcons name="search-off" size={48} color={Colors.textMuted} />
      <Text style={styles.emptyTxt}>No platforms match your search</Text>
      <Text style={styles.emptySub}>Try a different keyword or filter</Text>
    </View>
  );
}

export default function HomeScreen() {
  const { filteredCatalog, platforms, mergeDiscoveredPlatforms } = useApp();
  const { isRefreshing, newCount, lastRefreshed, runDiscovery } = useDiscovery(
    platforms,
    mergeDiscoveredPlatforms
  );
  const [selectedPlatform, setSelectedPlatform] = useState<Platform | null>(null);

  // Auto-run discovery once on mount
  useEffect(() => { runDiscovery(); }, []);

  const renderItem = useCallback(
    ({ item }: { item: Platform }) => (
      <PlatformCard platform={item} onPress={() => setSelectedPlatform(item)} />
    ),
    []
  );
  const keyExtractor = useCallback((item: Platform) => item.id, []);

  const headerProps = { newCount, isRefreshing, lastRefreshed };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <FlatList
        data={filteredCatalog}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        ListHeaderComponent={<Header {...headerProps} />}
        ListEmptyComponent={EmptyState}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={true}
        initialNumToRender={12}
        maxToRenderPerBatch={12}
        windowSize={10}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={runDiscovery}
            tintColor={Colors.primary}
            colors={[Colors.primary]}
            progressBackgroundColor={Colors.surface}
          />
        }
      />

      <PlatformDetailSheet
        platform={selectedPlatform}
        onClose={() => setSelectedPlatform(null)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.lg,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    marginBottom: Spacing.xs,
  },
  logoBlock: { flex: 1, paddingRight: Spacing.md },
  pill: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: Colors.primaryLight,
    borderRadius: Radius.pill,
    paddingHorizontal: 10, paddingVertical: 4,
    alignSelf: 'flex-start',
    borderWidth: 1, borderColor: Colors.primaryGlow,
    marginBottom: 8,
  },
  pillTxt: { color: Colors.primary, fontSize: FontSize.xs, fontWeight: '700', letterSpacing: 0.3 },
  logo: { fontSize: 26, fontWeight: '800', color: Colors.text, letterSpacing: -0.5, marginBottom: 2 },
  logoAccent: { color: Colors.primary },
  logoSub: { fontSize: FontSize.xs, color: Colors.textMuted },
  metricBadge: {
    alignItems: 'center',
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.primaryGlow,
    minWidth: 60,
    marginTop: 4,
  },
  metricNum: { color: Colors.primary, fontSize: FontSize.xl, fontWeight: '800' },
  metricLbl: { color: Colors.primary, fontSize: FontSize.xs, opacity: 0.7 },
  catHdr: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    marginTop: Spacing.xs,
    backgroundColor: Colors.surface,
    marginBottom: Spacing.xs,
  },
  catTitle: { color: Colors.text, fontSize: FontSize.md, fontWeight: '700' },
  countPill: {
    backgroundColor: Colors.surface2,
    paddingHorizontal: 10, paddingVertical: 3,
    borderRadius: Radius.pill,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  countPillTxt: { color: Colors.textMuted, fontSize: FontSize.xs, fontWeight: '600' },
  listContent: { paddingHorizontal: Spacing.md, paddingBottom: Spacing.xxl },
  sponsorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: 11,
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: 'rgba(245,158,11,0.35)',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 3,
  },
  sponsorPressed: { opacity: 0.8, transform: [{ scale: 0.985 }] },
  sponsorLeft: { flexDirection: 'row', alignItems: 'center', gap: 11, flex: 1 },
  sponsorIconWrap: {
    width: 36, height: 36,
    borderRadius: 9,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(245,158,11,0.30)',
  },
  sponsorText: { flex: 1 },
  sponsorTitle: { color: Colors.text, fontSize: FontSize.sm, fontWeight: '700', marginBottom: 1 },
  sponsorSub: { color: Colors.textMuted, fontSize: 10, lineHeight: 14 },
  sponsorBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: Radius.sm,
  },
  sponsorBtnTxt: { color: '#000', fontSize: FontSize.xs, fontWeight: '800' },
  empty: { padding: Spacing.xxl, alignItems: 'center', gap: Spacing.sm },
  emptyTxt: { color: Colors.textSubtle, fontSize: FontSize.md, fontWeight: '600' },
  emptySub: { color: Colors.textMuted, fontSize: FontSize.sm },
  // Live discovery bar
  liveBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.sm,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: 'rgba(245,158,11,0.08)',
    borderRadius: Radius.sm,
    borderWidth: 1,
    borderColor: 'rgba(245,158,11,0.20)',
  },
  liveDot: {
    width: 7, height: 7, borderRadius: 4,
    backgroundColor: Colors.primary,
  },
  liveTxt: {
    flex: 1,
    color: Colors.textSubtle,
    fontSize: FontSize.xs,
    fontWeight: '500',
  },
  liveCountBadge: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.pill,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  liveCountTxt: { color: '#000', fontSize: FontSize.xs, fontWeight: '800' },
});
