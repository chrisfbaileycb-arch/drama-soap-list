import React, { useRef, useEffect, useState, useCallback, memo } from 'react';
import { View, FlatList, StyleSheet, Dimensions, Text, Pressable, Linking } from 'react-native';
import { Image } from 'expo-image';
import { MaterialIcons, FontAwesome, FontAwesome5 } from '@expo/vector-icons';
import { useApp } from '@/hooks/useAppState';
import { Colors, Spacing, FontSize, Radius, Shadow } from '@/constants/theme';
import { Platform } from '@/constants/dramaData';

const { width: SW } = Dimensions.get('window');
const CARD_W = Math.min(SW * 0.80, 320);
const CARD_H = 370;
const GAP = 12;
const SIDE_PAD = (SW - CARD_W) / 2;

interface CardProps { platform: Platform; isActive: boolean; }

const SpotCard = memo(({ platform, isActive }: CardProps) => (
  <View style={[styles.card, isActive && styles.cardActive]}>
    {/* App Icon */}
    <View style={styles.iconWrap}>
      <Image source={{ uri: platform.icon_url }} style={styles.icon} contentFit="cover" transition={200} />
    </View>

    {/* Name & Developer */}
    <Text style={styles.name} numberOfLines={1}>{platform.name}</Text>
    <Text style={styles.developer} numberOfLines={1}>{platform.developer}</Text>

    {/* Divider */}
    <View style={styles.divider} />

    {/* Description */}
    <Text style={styles.desc} numberOfLines={3}>{platform.description}</Text>

    {/* Stats */}
    <View style={styles.statsRow}>
      <View style={styles.statItem}>
        <MaterialIcons name="star" size={13} color={Colors.primary} />
        <Text style={styles.statTxt}>{platform.rating.toFixed(1)}</Text>
      </View>
      <View style={styles.statDot} />
      <View style={styles.statItem}>
        <MaterialIcons name="download" size={12} color={Colors.textSubtle} />
        <Text style={styles.statTxt}>{platform.download_count} Downloads</Text>
      </View>
    </View>

    {/* Specialty chips */}
    <View style={styles.chips}>
      {platform.specialties.slice(0, 3).map(s => (
        <View key={s} style={styles.chip}><Text style={styles.chipTxt}>{s}</Text></View>
      ))}
    </View>

    {/* Store Buttons */}
    <View style={styles.storeRow}>
      <Pressable
        style={({ pressed }) => [styles.storeBtn, pressed && styles.storePressed]}
        onPress={() => {
          const url = platform.platform_url?.includes('play.google.com')
            ? platform.platform_url
            : `https://play.google.com/store/search?q=${encodeURIComponent(platform.name)}&c=apps`;
          Linking.openURL(url).catch(() => {});
        }}
      >
        <FontAwesome5 name="google-play" size={13} color="#000" />
        <Text style={styles.storeTxt}>Google Play</Text>
      </Pressable>
      <Pressable
        style={({ pressed }) => [styles.storeBtn, styles.storeBtnOut, pressed && styles.storePressed]}
        onPress={() => {
          const url = platform.app_store_url
            ? platform.app_store_url
            : `https://apps.apple.com/us/search?term=${encodeURIComponent(platform.name)}`;
          Linking.openURL(url).catch(() => {});
        }}
      >
        <FontAwesome name="apple" size={16} color={Colors.primary} />
        <Text style={[styles.storeTxt, styles.storeTxtOut]}>App Store</Text>
      </Pressable>
    </View>
  </View>
));

export const SpotlightCarousel = memo(() => {
  const { spotlightPlatforms } = useApp();
  const ref = useRef<FlatList>(null);
  const [active, setActive] = useState(0);

  const scrollTo = useCallback((idx: number) => {
    ref.current?.scrollToOffset({ offset: idx * (CARD_W + GAP), animated: true });
  }, []);

  useEffect(() => {
    if (spotlightPlatforms.length <= 1) return;
    const t = setInterval(() => {
      setActive(prev => {
        const next = (prev + 1) % spotlightPlatforms.length;
        scrollTo(next);
        return next;
      });
    }, 5000);
    return () => clearInterval(t);
  }, [spotlightPlatforms.length, scrollTo]);

  const onViewChange = useRef(({ viewableItems }: any) => {
    if (viewableItems[0]?.index != null) setActive(viewableItems[0].index);
  });
  const viewConfig = useRef({ itemVisiblePercentThreshold: 50 });

  if (!spotlightPlatforms.length) return null;

  return (
    <View style={styles.wrap}>
      <View style={styles.hdr}>
        <View style={styles.hdrLeft}>
          <MaterialIcons name="auto-awesome" size={14} color={Colors.primary} />
          <Text style={styles.hdrTxt}>Spotlight Features</Text>
        </View>
        <Text style={styles.hdrSub}>Top {spotlightPlatforms.length}</Text>
      </View>
      <FlatList
        ref={ref}
        data={spotlightPlatforms}
        horizontal
        keyExtractor={item => item.id}
        renderItem={({ item, index }) => <SpotCard platform={item} isActive={index === active} />}
        snapToInterval={CARD_W + GAP}
        decelerationRate="fast"
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: SIDE_PAD }}
        ItemSeparatorComponent={() => <View style={{ width: GAP }} />}
        onViewableItemsChanged={onViewChange.current}
        viewabilityConfig={viewConfig.current}
        onScrollToIndexFailed={() => {}}
      />
      <View style={styles.dots}>
        {spotlightPlatforms.map((_, i) => (
          <Pressable key={i} onPress={() => { setActive(i); scrollTo(i); }} hitSlop={8}>
            <View style={[styles.dot, i === active && styles.dotOn]} />
          </Pressable>
        ))}
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  wrap: { marginBottom: Spacing.md },
  hdr: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, paddingBottom: Spacing.sm },
  hdrLeft: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  hdrSub: { color: Colors.textMuted, fontSize: FontSize.xs },
  hdrTxt: { color: Colors.text, fontSize: FontSize.sm, fontWeight: '700' },
  card: {
    width: CARD_W, height: CARD_H,
    borderRadius: Radius.lg,
    backgroundColor: Colors.surface,
    borderWidth: 1, borderColor: Colors.border,
    padding: Spacing.md,
    alignItems: 'center',
    ...Shadow.card,
  },
  cardActive: { borderColor: Colors.primary, borderWidth: 1.5, ...Shadow.gold },
  iconWrap: {
    width: 80, height: 80,
    borderRadius: 18,
    overflow: 'hidden',
    backgroundColor: Colors.surface2,
    marginBottom: Spacing.sm,
    ...Shadow.sm,
  },
  icon: { width: '100%', height: '100%' },
  name: { color: Colors.text, fontSize: FontSize.xl, fontWeight: '800', textAlign: 'center', marginBottom: 3 },
  developer: { color: Colors.textMuted, fontSize: FontSize.xs, textAlign: 'center', marginBottom: Spacing.sm },
  divider: { width: '80%', height: 1, backgroundColor: Colors.border, marginBottom: Spacing.sm },
  desc: { color: Colors.textSubtle, fontSize: FontSize.sm, lineHeight: FontSize.sm * 1.5, textAlign: 'center', marginBottom: Spacing.sm },
  statsRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginBottom: Spacing.sm },
  statItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  statDot: { width: 3, height: 3, borderRadius: 2, backgroundColor: Colors.textMuted },
  statTxt: { color: Colors.textSubtle, fontSize: FontSize.xs, fontWeight: '600' },
  chips: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 5, marginBottom: Spacing.md },
  chip: { backgroundColor: Colors.primaryGlow, borderRadius: Radius.pill, paddingHorizontal: 8, paddingVertical: 3, borderWidth: 1, borderColor: 'rgba(245,158,11,0.35)' },
  chipTxt: { color: Colors.primary, fontSize: FontSize.xs, fontWeight: '600' },
  storeRow: { flexDirection: 'row', gap: 8, width: '100%' },
  storeBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: Colors.primary, borderRadius: Radius.sm, paddingVertical: 10 },
  storeBtnOut: { backgroundColor: 'transparent', borderWidth: 1.5, borderColor: Colors.primary },
  storePressed: { opacity: 0.8, transform: [{ scale: 0.97 }] },
  storeTxt: { color: '#000', fontSize: FontSize.sm, fontWeight: '800' },
  storeTxtOut: { color: Colors.primary },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: 6, paddingTop: Spacing.sm },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.textMuted },
  dotOn: { width: 20, backgroundColor: Colors.primary },
});
