
import React, { memo } from 'react';
import { View, Text, StyleSheet, Pressable, Linking } from 'react-native';
import { Image } from 'expo-image';
import { MaterialIcons, FontAwesome, FontAwesome5 } from '@expo/vector-icons';
import { Colors, Spacing, FontSize, Radius, Shadow } from '@/constants/theme';
import { Platform } from '@/constants/dramaData';

interface Props { platform: Platform; onPress?: () => void; }

export const PlatformCard = memo(({ platform, onPress }: Props) => (
  <Pressable
    style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
    onPress={onPress}
  >
    {/* NEW badge */}
    {platform.isNew ? (
      <View style={styles.newBadge}>
        <Text style={styles.newBadgeTxt}>NEW</Text>
      </View>
    ) : null}

    {/* Row: Icon + Info */}
    <View style={styles.row}>
      {/* App Icon */}
      <View style={styles.iconWrap}>
        <Image
          source={{ uri: platform.icon_url }}
          style={styles.icon}
          contentFit="cover"
          transition={200}
        />
      </View>

      {/* Info Block */}
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>{platform.name}</Text>
        <Text style={styles.developer} numberOfLines={1}>{platform.developer}</Text>

        {/* Stats row */}
        <View style={styles.statsRow}>
          <MaterialIcons name="star" size={12} color={Colors.primary} />
          <Text style={styles.rating}>{platform.rating.toFixed(1)}</Text>
          <View style={styles.dot} />
          <Text style={styles.downloads}>{platform.download_count}</Text>
        </View>

        {/* Specialty chips */}
        <View style={styles.chips}>
          {platform.specialties.slice(0, 2).map(s => (
            <View key={s} style={styles.chip}>
              <Text style={styles.chipTxt} numberOfLines={1}>{s}</Text>
            </View>
          ))}
          <View style={[styles.chip, styles.regionChip]}>
            <Text style={styles.regionTxt}>
              {platform.region_origin === 'US_Dominant' ? '🇺🇸 US' : '🌐 Global'}
            </Text>
          </View>
        </View>
      </View>
    </View>

    {/* Description */}
    <Text style={styles.desc} numberOfLines={2}>{platform.description}</Text>

    {/* Store Buttons */}
    <View style={styles.storeRow} onStartShouldSetResponder={() => true}>
      <Pressable
        style={({ pressed }) => [styles.storeBtn, pressed && styles.storePressed]}
        onPress={() => {
          const url = platform.platform_url?.includes('play.google.com')
            ? platform.platform_url
            : `https://play.google.com/store/search?q=${encodeURIComponent(platform.name)}&c=apps`;
          Linking.openURL(url).catch(() => {});
        }}
      >
        <FontAwesome5 name="google-play" size={11} color="#000" />
        <Text style={styles.storeTxt}>Google Play</Text>
      </Pressable>
      {platform.app_store_url ? (
        <Pressable
          style={({ pressed }) => [styles.storeBtn, styles.storeBtnOut, pressed && styles.storePressed]}
          onPress={() => Linking.openURL(platform.app_store_url!).catch(() => {})}
        >
          <FontAwesome name="apple" size={13} color={Colors.primary} />
          <Text style={[styles.storeTxt, styles.storeTxtOut]}>App Store</Text>
        </Pressable>
      ) : null}
    </View>
  </Pressable>
));

// Keep legacy export for backward compatibility
export const DramaCard = PlatformCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    ...Shadow.card,
    overflow: 'hidden',
  },
  cardPressed: {
    opacity: 0.82,
    borderColor: Colors.primary,
    transform: [{ scale: 0.985 }],
  },
  newBadge: {
    position: 'absolute',
    top: 10, right: 10,
    backgroundColor: Colors.primary,
    borderRadius: Radius.pill,
    paddingHorizontal: 8, paddingVertical: 3,
    zIndex: 10,
  },
  newBadgeTxt: { color: '#000', fontSize: 9, fontWeight: '900', letterSpacing: 0.5 },

  // Horizontal icon + info row
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.md,
    marginBottom: 10,
  },
  iconWrap: {
    width: 88,
    height: 88,
    borderRadius: 18,
    overflow: 'hidden',
    backgroundColor: Colors.surface2,
    flexShrink: 0,
    ...Shadow.sm,
  },
  icon: { width: '100%', height: '100%' },

  info: { flex: 1, paddingTop: 2 },
  name: {
    color: Colors.text,
    fontSize: FontSize.lg,
    fontWeight: '800',
    marginBottom: 3,
    letterSpacing: -0.2,
  },
  developer: { color: Colors.textMuted, fontSize: FontSize.sm, marginBottom: 6 },

  statsRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 8 },
  dot: { width: 3, height: 3, borderRadius: 2, backgroundColor: Colors.textMuted },
  rating: { color: Colors.primary, fontSize: FontSize.sm, fontWeight: '700' },
  downloads: { color: Colors.textMuted, fontSize: FontSize.sm },

  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 5 },
  chip: {
    backgroundColor: Colors.primaryGlow,
    borderRadius: Radius.pill,
    paddingHorizontal: 8, paddingVertical: 3,
    borderWidth: 1, borderColor: 'rgba(245,158,11,0.25)',
  },
  chipTxt: { color: Colors.primary, fontSize: 10, fontWeight: '600' },
  regionChip: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderColor: 'rgba(255,255,255,0.10)',
  },
  regionTxt: { color: Colors.textSubtle, fontSize: 10, fontWeight: '600' },

  // Description
  desc: {
    color: Colors.textSubtle,
    fontSize: FontSize.sm,
    lineHeight: FontSize.sm * 1.55,
    marginBottom: 12,
  },

  // Store buttons
  storeRow: { flexDirection: 'row', gap: 8 },
  storeBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: Colors.primary,
    borderRadius: Radius.sm,
    paddingVertical: 9,
  },
  storeBtnOut: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: Colors.primary,
  },
  storePressed: { opacity: 0.8, transform: [{ scale: 0.98 }] },
  storeTxt: { color: '#000', fontSize: FontSize.sm, fontWeight: '800' },
  storeTxtOut: { color: Colors.primary },
});
