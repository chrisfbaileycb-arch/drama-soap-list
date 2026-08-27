import React, { useEffect, useRef, useCallback, memo } from 'react';
import {
  View, Text, StyleSheet, Modal, Pressable, Animated,
  ScrollView, Linking, Share, Dimensions, PanResponder, Platform as RNPlatform,
} from 'react-native';
import { Image } from 'expo-image';
import { MaterialIcons, FontAwesome, FontAwesome5 } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Spacing, FontSize, Radius, Shadow } from '@/constants/theme';
import { Platform } from '@/constants/dramaData';

const { height: SH } = Dimensions.get('window');
const SHEET_MAX = SH * 0.88;

interface Props {
  platform: Platform | null;
  onClose: () => void;
}

export const PlatformDetailSheet = memo(({ platform, onClose }: Props) => {
  const insets = useSafeAreaInsets();
  const slideY = useRef(new Animated.Value(SHEET_MAX)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;

  // Keep a stable ref to close so PanResponder (created once) can always call latest version
  const closeRef = useRef<() => void>(() => {});

  const open = useCallback(() => {
    Animated.parallel([
      Animated.spring(slideY, {
        toValue: 0,
        tension: 65,
        friction: 11,
        useNativeDriver: true,
      }),
      Animated.timing(backdropOpacity, {
        toValue: 1,
        duration: 220,
        useNativeDriver: true,
      }),
    ]).start();
  }, [slideY, backdropOpacity]);

  const close = useCallback(() => {
    Animated.parallel([
      Animated.timing(slideY, {
        toValue: SHEET_MAX,
        duration: 260,
        useNativeDriver: true,
      }),
      Animated.timing(backdropOpacity, {
        toValue: 0,
        duration: 220,
        useNativeDriver: true,
      }),
    ]).start(() => onClose());
  }, [slideY, backdropOpacity, onClose]);

  useEffect(() => { closeRef.current = close; }, [close]);

  // PanResponder — created once, uses refs so it always has fresh values
  const panResponder = useRef(
    PanResponder.create({
      // Activate only on clear downward drag (not competing with horizontal scroll)
      onMoveShouldSetPanResponder: (_, gs) =>
        gs.dy > 8 && Math.abs(gs.dy) > Math.abs(gs.dx) * 1.5,
      onPanResponderMove: (_, gs) => {
        // Only allow dragging downward
        if (gs.dy > 0) slideY.setValue(gs.dy);
      },
      onPanResponderRelease: (_, gs) => {
        if (gs.dy > 110 || gs.vy > 0.5) {
          // Fast enough or far enough — dismiss
          closeRef.current();
        } else {
          // Snap back
          Animated.spring(slideY, {
            toValue: 0,
            tension: 65,
            friction: 11,
            useNativeDriver: true,
          }).start();
        }
      },
      onPanResponderTerminate: () => {
        Animated.spring(slideY, {
          toValue: 0,
          tension: 65,
          friction: 11,
          useNativeDriver: true,
        }).start();
      },
    })
  ).current;

  useEffect(() => {
    if (platform) {
      slideY.setValue(SHEET_MAX);
      backdropOpacity.setValue(0);
      open();
    }
  }, [platform]);

  if (!platform) return null;

  const handlePlayStore = () => {
    const url = platform.platform_url?.includes('play.google.com')
      ? platform.platform_url
      : `https://play.google.com/store/search?q=${encodeURIComponent(platform.name)}&c=apps`;
    Linking.openURL(url).catch(() => {});
  };

  const handleAppStore = () => {
    const url = platform.app_store_url
      ? platform.app_store_url
      : `https://apps.apple.com/us/search?term=${encodeURIComponent(platform.name)}`;
    Linking.openURL(url).catch(() => {});
  };

  const handleShare = async () => {
    const playUrl = platform.platform_url?.includes('play.google.com')
      ? platform.platform_url
      : `https://play.google.com/store/search?q=${encodeURIComponent(platform.name)}&c=apps`;
    const appleUrl = platform.app_store_url
      ? platform.app_store_url
      : `https://apps.apple.com/us/search?term=${encodeURIComponent(platform.name)}`;
    try {
      await Share.share({
        title: platform.name,
        message: `Check out ${platform.name} on SoapList!\n\n${platform.description}\n\n📱 Google Play: ${playUrl}\n🍎 App Store: ${appleUrl}`,
      });
    } catch (_) {}
  };

  const isUS = platform.region_origin === 'US_Dominant';
  const isPremium = platform.quality_tier === 'Premium';

  return (
    <Modal
      visible={!!platform}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={close}
    >
      {/* Backdrop */}
      <Animated.View style={[styles.backdrop, { opacity: backdropOpacity }]}>
        <Pressable style={StyleSheet.absoluteFill} onPress={close} />
      </Animated.View>

      {/* Sheet */}
      <Animated.View
        style={[
          styles.sheet,
          { transform: [{ translateY: slideY }], paddingBottom: insets.bottom + Spacing.md },
        ]}
      >
        {/* Drag handle area — pan gestures captured here */}
        <View style={styles.dragArea} {...panResponder.panHandlers}>
          <View style={styles.handle} />
        </View>

        {/* Header action row */}
        <Pressable
          style={({ pressed }) => [styles.closeBtn, pressed && { opacity: 0.7 }]}
          onPress={close}
          hitSlop={12}
        >
          <MaterialIcons name="close" size={18} color={Colors.textMuted} />
        </Pressable>
        <Pressable
          style={({ pressed }) => [styles.shareBtn, pressed && { opacity: 0.7 }]}
          onPress={handleShare}
          hitSlop={12}
        >
          <MaterialIcons name="ios-share" size={17} color={Colors.primary} />
        </Pressable>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          bounces={true}
        >
          {/* Hero section: icon + name */}
          <View style={styles.hero}>
            <View style={styles.iconWrap}>
              <Image
                source={{ uri: platform.icon_url }}
                style={styles.icon}
                contentFit="cover"
                transition={200}
              />
            </View>

            {/* NEW badge */}
            {platform.isNew ? (
              <View style={styles.newBadge}>
                <Text style={styles.newBadgeTxt}>NEW</Text>
              </View>
            ) : null}

            <Text style={styles.name}>{platform.name}</Text>
            <Text style={styles.developer}>{platform.developer}</Text>

            {/* Tagline */}
            <Text style={styles.tagline}>{platform.tagline}</Text>
          </View>

          {/* Stats row */}
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <MaterialIcons name="star" size={18} color={Colors.primary} />
              <Text style={styles.statVal}>{platform.rating.toFixed(1)}</Text>
              <Text style={styles.statLbl}>Rating</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statBox}>
              <MaterialIcons name="download" size={18} color={Colors.primary} />
              <Text style={styles.statVal}>{platform.download_count}</Text>
              <Text style={styles.statLbl}>Downloads</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statBox}>
              <MaterialIcons name="rate-review" size={18} color={Colors.primary} />
              <Text style={styles.statVal}>
                {platform.review_count >= 1000
                  ? `${(platform.review_count / 1000).toFixed(0)}K`
                  : platform.review_count > 0
                  ? platform.review_count.toString()
                  : 'New'}
              </Text>
              <Text style={styles.statLbl}>Reviews</Text>
            </View>
          </View>

          {/* Badges row */}
          <View style={styles.badgesRow}>
            <View style={[styles.badge, isUS ? styles.badgeUS : styles.badgeGlobal]}>
              <Text style={styles.badgeTxt}>{isUS ? '🇺🇸 US Dominant' : '🌐 Global Traction'}</Text>
            </View>
            <View style={[styles.badge, isPremium ? styles.badgePremium : styles.badgeStandard]}>
              <MaterialIcons
                name={isPremium ? 'workspace-premium' : 'verified'}
                size={11}
                color={isPremium ? Colors.primary : Colors.textMuted}
              />
              <Text style={[styles.badgeTxt, !isPremium && { color: Colors.textMuted }]}>
                {isPremium ? 'Premium' : 'Standard'}
              </Text>
            </View>
            <View style={[styles.badge, styles.badgeFocus]}>
              <Text style={styles.badgeTxt}>{platform.content_focus}</Text>
            </View>
          </View>

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About</Text>
            <Text style={styles.description}>{platform.description}</Text>
          </View>

          {/* Specialty tags */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Specialty Tags</Text>
            <View style={styles.tagsWrap}>
              {platform.specialties.map(s => (
                <View key={s} style={styles.tag}>
                  <Text style={styles.tagTxt}>{s}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Store buttons */}
          <View style={styles.storeRow} onStartShouldSetResponder={() => true}>
            <Pressable
              style={({ pressed }) => [styles.storeBtn, pressed && styles.storePressed]}
              onPress={handlePlayStore}
            >
              <FontAwesome5 name="google-play" size={15} color="#000" />
              <View>
                <Text style={styles.storeLbl}>Get it on</Text>
                <Text style={styles.storeName}>Google Play</Text>
              </View>
            </Pressable>
            {platform.app_store_url ? (
              <Pressable
                style={({ pressed }) => [styles.storeBtn, styles.storeBtnOut, pressed && styles.storePressed]}
                onPress={handleAppStore}
              >
                <FontAwesome name="apple" size={20} color={Colors.primary} />
                <View>
                  <Text style={[styles.storeLbl, { color: Colors.textMuted }]}>Download on the</Text>
                  <Text style={[styles.storeName, { color: Colors.primary }]}>App Store</Text>
                </View>
              </Pressable>
            ) : null}
          </View>

          {/* Share button */}
          <Pressable
            style={({ pressed }) => [styles.shareFullBtn, pressed && styles.storePressed]}
            onPress={handleShare}
          >
            <MaterialIcons name="ios-share" size={16} color={Colors.primary} />
            <Text style={styles.shareFullTxt}>Share Platform</Text>
          </Pressable>
        </ScrollView>
      </Animated.View>
    </Modal>
  );
});

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.75)',
  },
  sheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    maxHeight: SHEET_MAX,
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderTopWidth: 1,
    borderColor: Colors.border,
    ...Shadow.gold,
  },
  dragArea: {
    width: '100%',
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 8,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.surface3,
  },
  closeBtn: {
    position: 'absolute',
    top: 14,
    right: 16,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.surface2,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.md,
  },

  // Hero
  hero: {
    alignItems: 'center',
    paddingBottom: Spacing.lg,
  },
  iconWrap: {
    width: 110,
    height: 110,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: Colors.surface2,
    borderWidth: 2,
    borderColor: Colors.primaryGlow,
    marginBottom: Spacing.md,
    ...Shadow.gold,
  },
  icon: { width: '100%', height: '100%' },
  newBadge: {
    position: 'absolute',
    top: 0,
    right: 80,
    backgroundColor: Colors.primary,
    borderRadius: Radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  newBadgeTxt: { color: '#000', fontSize: 9, fontWeight: '900', letterSpacing: 0.8 },
  name: {
    color: Colors.text,
    fontSize: FontSize.xxl,
    fontWeight: '800',
    letterSpacing: -0.5,
    textAlign: 'center',
    marginBottom: 4,
  },
  developer: {
    color: Colors.textMuted,
    fontSize: FontSize.sm,
    textAlign: 'center',
    marginBottom: 8,
  },
  tagline: {
    color: Colors.textSubtle,
    fontSize: FontSize.sm,
    textAlign: 'center',
    lineHeight: FontSize.sm * 1.55,
    fontStyle: 'italic',
    paddingHorizontal: Spacing.sm,
  },

  // Stats
  statsRow: {
    flexDirection: 'row',
    backgroundColor: Colors.surface2,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  statBox: { flex: 1, alignItems: 'center', gap: 4 },
  statVal: { color: Colors.text, fontSize: FontSize.md, fontWeight: '800' },
  statLbl: { color: Colors.textMuted, fontSize: FontSize.xs },
  statDivider: { width: 1, backgroundColor: Colors.border, marginHorizontal: Spacing.sm },

  // Badges
  badgesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: Spacing.lg,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    borderRadius: Radius.pill,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
  },
  badgeTxt: { color: Colors.primary, fontSize: FontSize.xs, fontWeight: '700' },
  badgeUS: { backgroundColor: 'rgba(34,197,94,0.10)', borderColor: Colors.primaryGlow },
  badgeGlobal: { backgroundColor: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.12)' },
  badgePremium: { backgroundColor: 'rgba(34,197,94,0.10)', borderColor: Colors.primaryGlow },
  badgeStandard: { backgroundColor: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.08)' },
  badgeFocus: { backgroundColor: 'rgba(244,63,94,0.10)', borderColor: 'rgba(244,63,94,0.25)' },

  // Section
  section: { marginBottom: Spacing.lg },
  sectionTitle: {
    color: Colors.textMuted,
    fontSize: FontSize.xs,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  description: {
    color: Colors.textSubtle,
    fontSize: FontSize.md,
    lineHeight: FontSize.md * 1.65,
  },
  tagsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tag: {
    backgroundColor: Colors.primaryGlow,
    borderRadius: Radius.pill,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderWidth: 1,
    borderColor: 'rgba(34,197,94,0.30)',
  },
  tagTxt: { color: Colors.primary, fontSize: FontSize.sm, fontWeight: '600' },

  // Store buttons
  storeRow: { flexDirection: 'row', gap: 10 },
  storeBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: Colors.primary,
    borderRadius: Radius.md,
    paddingVertical: 14,
  },
  storeBtnOut: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: Colors.primary,
  },
  storePressed: { opacity: 0.78, transform: [{ scale: 0.97 }] },
  storeLbl: { color: 'rgba(0,0,0,0.65)', fontSize: 9, fontWeight: '600', letterSpacing: 0.2 },
  storeName: { color: '#000', fontSize: FontSize.sm, fontWeight: '800' },
  shareBtn: {
    position: 'absolute',
    top: 14,
    left: 16,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primaryLight,
    borderWidth: 1,
    borderColor: Colors.primaryGlow,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  shareFullBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 10,
    paddingVertical: 13,
    borderRadius: Radius.md,
    borderWidth: 1.5,
    borderColor: Colors.primaryGlow,
    backgroundColor: Colors.primaryLight,
  },
  shareFullTxt: { color: Colors.primary, fontSize: FontSize.sm, fontWeight: '700' },
});
