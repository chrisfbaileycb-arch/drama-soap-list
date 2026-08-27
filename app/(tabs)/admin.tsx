import React, { useState, memo, useCallback } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { MaterialIcons } from '@expo/vector-icons';
import { useApp } from '@/hooks/useAppState';
import { Colors, Spacing, FontSize, Radius, Shadow } from '@/constants/theme';
import { Platform, SponsorInquiry } from '@/constants/dramaData';

// ── LOGIN ─────────────────────────────────────────────────────────────────────
function LoginScreen() {
  const { login } = useApp();
  const [email, setEmail] = useState('admin@dramaspot.com');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = useCallback(() => {
    if (!email.trim() || !password.trim()) { setError('Please enter email and password.'); return; }
    setLoading(true); setError('');
    setTimeout(() => {
      if (!login(email.trim(), password)) setError('Invalid credentials. Use demo credentials below.');
      setLoading(false);
    }, 600);
  }, [email, password, login]);

  return (
    <ScrollView contentContainerStyle={styles.loginWrap} keyboardShouldPersistTaps="handled">
      <View style={styles.mockBadge}>
        <MaterialIcons name="info-outline" size={14} color="#000" />
        <Text style={styles.mockTxt}>MOCK LOGIN — No real authentication active</Text>
      </View>
      <View style={styles.loginCard}>
        <View style={styles.loginIconWrap}>
          <MaterialIcons name="admin-panel-settings" size={40} color={Colors.primary} />
        </View>
        <Text style={styles.loginTitle}>Admin Portal</Text>
        <Text style={styles.loginSub}>Soap List Management</Text>
        <View style={styles.hintBox}>
          <Text style={styles.hintLabel}>Demo Credentials</Text>
          <Text style={styles.hintVal}>admin@dramaspot.com</Text>
          <Text style={styles.hintVal}>spotlight2024</Text>
        </View>
        <TextInput style={styles.inp} value={email} onChangeText={setEmail} placeholder="Email address" placeholderTextColor={Colors.textMuted} keyboardType="email-address" autoCapitalize="none" autoCorrect={false} />
        <TextInput style={styles.inp} value={password} onChangeText={setPassword} placeholder="Password" placeholderTextColor={Colors.textMuted} secureTextEntry />
        {error ? <Text style={styles.errTxt}>{error}</Text> : null}
        <Pressable style={({ pressed }) => [styles.loginBtn, pressed && styles.loginBtnPressed]} onPress={handleLogin}>
          <Text style={styles.loginBtnTxt}>{loading ? 'Signing In...' : 'Sign In'}</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

// ── FEATURED ROW ──────────────────────────────────────────────────────────────
interface FeatRowProps { platform: Platform; index: number; total: number; onUp: () => void; onDown: () => void; onRemove: () => void; }

const FeatRow = memo(({ platform, index, total, onUp, onDown, onRemove }: FeatRowProps) => (
  <View style={styles.featRow}>
    <Text style={styles.featRank}>{index + 1}</Text>
    <View style={styles.iconThumb}>
      <Image source={{ uri: platform.icon_url }} style={styles.iconThumbImg} contentFit="cover" />
    </View>
    <View style={styles.featInfo}>
      <Text style={styles.featTitle} numberOfLines={1}>{platform.name}</Text>
      <Text style={styles.featMeta} numberOfLines={1}>{platform.developer}</Text>
      <View style={styles.microRow}>
        <MaterialIcons name="star" size={11} color={Colors.primary} />
        <Text style={styles.featRating}>{platform.rating.toFixed(1)}</Text>
        <Text style={styles.genrePill}>{platform.content_focus}</Text>
        <Text style={styles.dlCount}>{platform.download_count}</Text>
      </View>
    </View>
    <View style={styles.featBtns}>
      <Pressable onPress={onUp} disabled={index === 0} style={[styles.iconBtn, index === 0 && styles.iconBtnOff]} hitSlop={8}>
        <MaterialIcons name="arrow-upward" size={16} color={index === 0 ? Colors.textMuted : Colors.text} />
      </Pressable>
      <Pressable onPress={onDown} disabled={index === total - 1} style={[styles.iconBtn, index === total - 1 && styles.iconBtnOff]} hitSlop={8}>
        <MaterialIcons name="arrow-downward" size={16} color={index === total - 1 ? Colors.textMuted : Colors.text} />
      </Pressable>
      <Pressable onPress={onRemove} style={styles.removeBtn} hitSlop={8}>
        <MaterialIcons name="remove-circle-outline" size={18} color={Colors.error} />
      </Pressable>
    </View>
  </View>
));

// ── CATALOG ROW ───────────────────────────────────────────────────────────────
interface CatRowProps { platform: Platform; isFeatured: boolean; canAdd: boolean; onToggleFeat: () => void; onToggleActive: () => void; }

const CatRow = memo(({ platform, isFeatured, canAdd, onToggleFeat, onToggleActive }: CatRowProps) => (
  <View style={[styles.catRow, !platform.active && styles.catRowInactive]}>
    <View style={styles.iconThumb}>
      <Image source={{ uri: platform.icon_url }} style={styles.iconThumbImg} contentFit="cover" />
    </View>
    <View style={styles.catInfo}>
      <Text style={[styles.catTitle, !platform.active && styles.mutedText]} numberOfLines={1}>{platform.name}</Text>
      <Text style={styles.catMeta} numberOfLines={1}>{platform.developer}</Text>
      <View style={styles.microRow}>
        <MaterialIcons name="star" size={11} color={Colors.primary} />
        <Text style={styles.featRating}>{platform.rating.toFixed(1)}</Text>
        <Text style={[styles.activeTag, platform.active ? styles.activeOn : styles.activeOff]}>{platform.active ? 'Active' : 'Hidden'}</Text>
      </View>
      <View style={styles.tagRow}>
        <View style={[styles.regionPill, platform.region_origin === 'US_Dominant' ? styles.pillUS : styles.pillGlobal]}>
          <Text style={[styles.pillTxt, platform.region_origin === 'US_Dominant' ? styles.pillUSTxt : styles.pillGlobalTxt]}>
            {platform.region_origin === 'US_Dominant' ? 'US' : 'GLOBAL'}
          </Text>
        </View>
        <View style={[styles.tierPill, platform.quality_tier === 'Premium' ? styles.pillPremium : styles.pillStandard]}>
          <Text style={[styles.pillTxt, platform.quality_tier === 'Premium' ? styles.pillPremiumTxt : styles.pillStandardTxt]}>
            {platform.quality_tier}
          </Text>
        </View>
        <View style={styles.focusPill}>
          <Text style={styles.focusTxt}>{platform.content_focus}</Text>
        </View>
      </View>
    </View>
    <View style={styles.catBtns}>
      <Pressable onPress={onToggleFeat} disabled={!isFeatured && !canAdd} style={[styles.spotBtn, isFeatured && styles.spotBtnOn, !isFeatured && !canAdd && styles.spotBtnOff]} hitSlop={4}>
        <MaterialIcons name={isFeatured ? 'star' : 'star-border'} size={14} color={isFeatured ? '#FFFFFF' : (!canAdd ? Colors.textMuted : Colors.primary)} />
        <Text style={[styles.spotBtnTxt, !isFeatured && styles.spotBtnTxtOut]}>{isFeatured ? 'Featured' : 'Add'}</Text>
      </Pressable>
      <Pressable onPress={onToggleActive} style={styles.iconBtn} hitSlop={8}>
        <MaterialIcons name={platform.active ? 'visibility' : 'visibility-off'} size={16} color={platform.active ? Colors.textSubtle : Colors.textMuted} />
      </Pressable>
    </View>
  </View>
));

// ── SPONSOR REQUEST ROW ───────────────────────────────────────────────────────
interface ReqRowProps { inquiry: SponsorInquiry; canApprove: boolean; onApprove?: () => void; onReject?: () => void; }

const ReqRow = memo(({ inquiry, canApprove, onApprove, onReject }: ReqRowProps) => {
  const statusColor = inquiry.payment_status === 'active' ? Colors.success : inquiry.payment_status === 'rejected' ? Colors.textMuted : Colors.warning;
  const statusLabel = inquiry.payment_status === 'active' ? 'Active' : inquiry.payment_status === 'rejected' ? 'Rejected' : 'Pending Review';
  return (
    <View style={styles.reqRow}>
      {inquiry.poster_url ? (
        <View style={styles.iconThumb}><Image source={{ uri: inquiry.poster_url }} style={styles.iconThumbImg} contentFit="cover" /></View>
      ) : (
        <View style={[styles.iconThumb, styles.thumbPlaceholder]}>
          <MaterialIcons name="campaign" size={18} color={Colors.textMuted} />
        </View>
      )}
      <View style={styles.reqInfo}>
        <Text style={styles.reqTitle} numberOfLines={1}>{inquiry.series_title}</Text>
        <Text style={styles.reqMeta}>{inquiry.studio_name}</Text>
        <Text style={styles.reqContact} numberOfLines={1}>{inquiry.contact_email}</Text>
        <View style={styles.microRow}>
          <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
          <Text style={[styles.statusTxt, { color: statusColor }]}>{statusLabel}</Text>
          <Text style={styles.reqPkg}>{inquiry.package_name}</Text>
        </View>
        <Text style={styles.reqAmount}>${inquiry.total_amount.toLocaleString()} · {inquiry.weeks}w</Text>
      </View>
      {inquiry.payment_status === 'paid_pending_approval' && (
        <View style={styles.reqBtns}>
          <Pressable onPress={onApprove} disabled={!canApprove} style={[styles.approveBtn, !canApprove && styles.approveBtnOff]} hitSlop={4}>
            <MaterialIcons name="check" size={14} color={canApprove ? '#000000' : Colors.textMuted} />
            <Text style={[styles.approveTxt, !canApprove && styles.approveTxtOff]}>Approve</Text>
          </Pressable>
          <Pressable onPress={onReject} style={styles.rejectBtn} hitSlop={8}>
            <MaterialIcons name="close" size={14} color={Colors.error} />
          </Pressable>
        </View>
      )}
    </View>
  );
});

// ── INBOUND REQUESTS ─────────────────────────────────────────────────────────
function InboundRequests() {
  const { sponsorInquiries, approveSponsorInquiry, rejectSponsorInquiry, featuredOrder } = useApp();
  const canApprove = featuredOrder.length < 10;
  const pending = sponsorInquiries.filter(i => i.payment_status === 'paid_pending_approval');
  const active = sponsorInquiries.filter(i => i.payment_status === 'active');
  const rejected = sponsorInquiries.filter(i => i.payment_status === 'rejected');

  if (sponsorInquiries.length === 0) {
    return (
      <View style={styles.emptySection}>
        <MaterialIcons name="inbox" size={40} color={Colors.textMuted} />
        <Text style={styles.emptySectionTxt}>No sponsor inquiries yet</Text>
        <Text style={styles.emptySectionSub}>Applications submitted via the Sponsor tab will appear here</Text>
      </View>
    );
  }

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      {!canApprove && (
        <View style={styles.maxBanner}>
          <MaterialIcons name="info" size={14} color={Colors.warning} />
          <Text style={styles.maxTxt}>Spotlight full (10/10). Remove a platform first to approve new sponsors.</Text>
        </View>
      )}
      {pending.length > 0 && (
        <View>
          <View style={styles.sectionHdr}>
            <Text style={styles.sectionTitle}>Pending Review</Text>
            <View style={styles.countBadge}><Text style={styles.countTxt}>{pending.length}</Text></View>
          </View>
          {pending.map(inq => (
            <ReqRow key={inq.id} inquiry={inq} canApprove={canApprove}
              onApprove={() => approveSponsorInquiry(inq.id)}
              onReject={() => rejectSponsorInquiry(inq.id)}
            />
          ))}
        </View>
      )}
      {active.length > 0 && (
        <View>
          <View style={styles.sectionHdr}>
            <Text style={styles.sectionTitle}>Active Sponsors</Text>
            <View style={[styles.countBadge, { backgroundColor: 'rgba(46,204,113,0.15)' }]}>
              <Text style={[styles.countTxt, { color: Colors.success }]}>{active.length}</Text>
            </View>
          </View>
          {active.map(inq => <ReqRow key={inq.id} inquiry={inq} canApprove={false} />)}
        </View>
      )}
      {rejected.length > 0 && (
        <View>
          <View style={styles.sectionHdr}>
            <Text style={[styles.sectionTitle, { color: Colors.textMuted }]}>Rejected</Text>
          </View>
          {rejected.map(inq => <ReqRow key={inq.id} inquiry={inq} canApprove={false} />)}
        </View>
      )}
      <View style={{ height: Spacing.xxl }} />
    </ScrollView>
  );
}

// ── DASHBOARD ─────────────────────────────────────────────────────────────────
function AdminDashboard() {
  const { platforms, featuredOrder, spotlightPlatforms, toggleFeatured, toggleActive, moveFeaturedUp, moveFeaturedDown, logout, sponsorInquiries } = useApp();
  const [tab, setTab] = useState<'spotlight' | 'catalog' | 'requests'>('spotlight');
  const [catSearch, setCatSearch] = useState('');

  const featuredPlatforms = featuredOrder.map(id => platforms.find(p => p.id === id)).filter((p): p is Platform => !!p);
  const canAdd = featuredOrder.length < 10;
  const featIds = new Set(featuredOrder);
  const pendingCount = sponsorInquiries.filter(i => i.payment_status === 'paid_pending_approval').length;

  const filteredCat = platforms
    .filter(p => {
      if (!catSearch.trim()) return true;
      const q = catSearch.toLowerCase();
      return p.name.toLowerCase().includes(q) || p.developer.toLowerCase().includes(q);
    })
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <View style={styles.dashWrap}>
      <View style={styles.adminHdr}>
        <View>
          <Text style={styles.adminTitle}>Admin Panel</Text>
          <Text style={styles.adminSub}>Soap List Management</Text>
        </View>
        <Pressable onPress={logout} style={styles.logoutBtn} hitSlop={8}>
          <MaterialIcons name="logout" size={16} color={Colors.textSubtle} />
          <Text style={styles.logoutTxt}>Sign Out</Text>
        </Pressable>
      </View>

      <View style={styles.tabBar}>
        <Pressable style={[styles.tab, tab === 'spotlight' && styles.tabOn]} onPress={() => setTab('spotlight')}>
          <MaterialIcons name="stars" size={15} color={tab === 'spotlight' ? Colors.primary : Colors.textMuted} />
          <Text style={[styles.tabTxt, tab === 'spotlight' && styles.tabTxtOn]}>{`Spotlight (${featuredOrder.length}/10)`}</Text>
        </Pressable>
        <Pressable style={[styles.tab, tab === 'catalog' && styles.tabOn]} onPress={() => setTab('catalog')}>
          <MaterialIcons name="apps" size={15} color={tab === 'catalog' ? Colors.primary : Colors.textMuted} />
          <Text style={[styles.tabTxt, tab === 'catalog' && styles.tabTxtOn]}>{`Directory (${platforms.length})`}</Text>
        </Pressable>
        <Pressable style={[styles.tab, tab === 'requests' && styles.tabOn]} onPress={() => setTab('requests')}>
          <MaterialIcons name="inbox" size={15} color={tab === 'requests' ? Colors.primary : Colors.textMuted} />
          <View style={styles.tabLabelRow}>
            <Text style={[styles.tabTxt, tab === 'requests' && styles.tabTxtOn]}>Requests</Text>
            {pendingCount > 0 && (
              <View style={styles.badge}><Text style={styles.badgeTxt}>{pendingCount}</Text></View>
            )}
          </View>
        </Pressable>
      </View>

      {tab === 'spotlight' && (
        <ScrollView style={styles.dashContent} showsVerticalScrollIndicator={false}>
          <View style={styles.infoBar}>
            <Text style={styles.infoTxt}>{featuredOrder.length}/10 spotlight slots filled</Text>
            {spotlightPlatforms.length > featuredPlatforms.length && (
              <Text style={styles.backfillTxt}>{spotlightPlatforms.length - featuredPlatforms.length} slot(s) auto-backfilled from top-rated catalog</Text>
            )}
          </View>
          {featuredPlatforms.length === 0 ? (
            <View style={styles.emptySection}>
              <MaterialIcons name="star-outline" size={40} color={Colors.textMuted} />
              <Text style={styles.emptySectionTxt}>No spotlight items added</Text>
              <Text style={styles.emptySectionSub}>Go to Directory tab to add platforms</Text>
            </View>
          ) : (
            featuredPlatforms.map((platform, i) => (
              <FeatRow key={platform.id} platform={platform} index={i} total={featuredPlatforms.length}
                onUp={() => moveFeaturedUp(platform.id)}
                onDown={() => moveFeaturedDown(platform.id)}
                onRemove={() => toggleFeatured(platform.id)}
              />
            ))
          )}
          <View style={{ height: Spacing.xxl }} />
        </ScrollView>
      )}

      {tab === 'catalog' && (
        <View style={styles.dashContent}>
          <View style={styles.catSearchBar}>
            <MaterialIcons name="search" size={17} color={Colors.textMuted} />
            <TextInput style={styles.catSearchInp} placeholder="Search directory..." placeholderTextColor={Colors.textMuted} value={catSearch} onChangeText={setCatSearch} />
            {catSearch.length > 0 && (
              <Pressable onPress={() => setCatSearch('')} hitSlop={8}>
                <MaterialIcons name="close" size={15} color={Colors.textMuted} />
              </Pressable>
            )}
          </View>
          {!canAdd && (
            <View style={styles.maxBanner}>
              <MaterialIcons name="info" size={14} color={Colors.warning} />
              <Text style={styles.maxTxt}>Spotlight full (10/10). Remove a platform to add another.</Text>
            </View>
          )}
          <ScrollView showsVerticalScrollIndicator={false}>
            {filteredCat.map(platform => (
              <CatRow key={platform.id} platform={platform} isFeatured={featIds.has(platform.id)} canAdd={canAdd}
                onToggleFeat={() => toggleFeatured(platform.id)} onToggleActive={() => toggleActive(platform.id)} />
            ))}
            <View style={{ height: Spacing.xxl }} />
          </ScrollView>
        </View>
      )}

      {tab === 'requests' && (
        <View style={styles.dashContent}>
          <InboundRequests />
        </View>
      )}
    </View>
  );
}

// ── SCREEN ────────────────────────────────────────────────────────────────────
export default function AdminScreen() {
  const { adminUser } = useApp();
  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      {adminUser ? <AdminDashboard /> : <LoginScreen />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.background },
  loginWrap: { flexGrow: 1, padding: Spacing.md, justifyContent: 'center' },
  mockBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: Colors.warning, borderRadius: Radius.sm, paddingHorizontal: Spacing.md, paddingVertical: Spacing.xs, marginBottom: Spacing.lg, alignSelf: 'center' },
  mockTxt: { color: '#000', fontSize: FontSize.xs, fontWeight: '700' },
  loginCard: { backgroundColor: Colors.surface, borderRadius: Radius.lg, padding: Spacing.lg, borderWidth: 1, borderColor: Colors.border },
  loginIconWrap: { alignItems: 'center', marginBottom: Spacing.sm },
  loginTitle: { color: Colors.text, fontSize: FontSize.xl, fontWeight: '800', textAlign: 'center' },
  loginSub: { color: Colors.textSubtle, fontSize: FontSize.sm, textAlign: 'center', marginBottom: Spacing.lg },
  hintBox: { backgroundColor: Colors.surface2, borderRadius: Radius.sm, padding: Spacing.sm, marginBottom: Spacing.md, borderLeftWidth: 3, borderLeftColor: Colors.primary },
  hintLabel: { color: Colors.primary, fontSize: FontSize.xs, fontWeight: '700', marginBottom: 4 },
  hintVal: { color: Colors.textSubtle, fontSize: FontSize.sm, fontFamily: 'monospace' },
  inp: { backgroundColor: Colors.surface2, borderRadius: Radius.sm, paddingHorizontal: Spacing.md, paddingVertical: 12, color: Colors.text, fontSize: FontSize.base, marginBottom: Spacing.sm, borderWidth: 1, borderColor: Colors.border },
  errTxt: { color: Colors.error, fontSize: FontSize.sm, marginBottom: Spacing.sm },
  loginBtn: { backgroundColor: Colors.primary, borderRadius: Radius.sm, paddingVertical: 14, alignItems: 'center', marginTop: Spacing.xs },
  loginBtnPressed: { opacity: 0.85 },
  loginBtnTxt: { color: '#000', fontSize: FontSize.md, fontWeight: '800' },
  dashWrap: { flex: 1 },
  adminHdr: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: Spacing.md, paddingVertical: Spacing.md, borderBottomWidth: 1, borderBottomColor: Colors.border },
  adminTitle: { color: Colors.text, fontSize: FontSize.lg, fontWeight: '800' },
  adminSub: { color: Colors.textMuted, fontSize: FontSize.xs },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: Spacing.sm, paddingVertical: Spacing.xs },
  logoutTxt: { color: Colors.textSubtle, fontSize: FontSize.sm },
  tabBar: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: Colors.border },
  tab: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5, paddingVertical: 12 },
  tabOn: { borderBottomWidth: 2, borderBottomColor: Colors.primary },
  tabTxt: { color: Colors.textMuted, fontSize: FontSize.xs, fontWeight: '600' },
  tabTxtOn: { color: Colors.primary },
  tabLabelRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  badge: { backgroundColor: Colors.primary, borderRadius: Radius.pill, minWidth: 16, height: 16, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 4 },
  badgeTxt: { color: '#000', fontSize: 9, fontWeight: '800' },
  dashContent: { flex: 1 },
  infoBar: { padding: Spacing.md, backgroundColor: Colors.surface2, margin: Spacing.md, borderRadius: Radius.sm, borderLeftWidth: 3, borderLeftColor: Colors.primary },
  infoTxt: { color: Colors.textSubtle, fontSize: FontSize.sm },
  backfillTxt: { color: Colors.textMuted, fontSize: FontSize.xs, marginTop: 4 },
  iconThumb: { width: 44, height: 44, borderRadius: 10, overflow: 'hidden', backgroundColor: Colors.surface2 },
  iconThumbImg: { width: '100%', height: '100%' },
  thumbPlaceholder: { alignItems: 'center', justifyContent: 'center' },
  featRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, borderBottomWidth: 1, borderBottomColor: Colors.border },
  featRank: { color: Colors.primary, fontSize: FontSize.md, fontWeight: '800', width: 24, textAlign: 'center' },
  featInfo: { flex: 1 },
  featTitle: { color: Colors.text, fontSize: FontSize.sm, fontWeight: '700' },
  featMeta: { color: Colors.textSubtle, fontSize: FontSize.xs },
  microRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  featRating: { color: Colors.primary, fontSize: FontSize.xs, fontWeight: '700' },
  genrePill: { color: Colors.textMuted, fontSize: FontSize.xs },
  dlCount: { color: Colors.textMuted, fontSize: FontSize.xs },
  featBtns: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  iconBtn: { width: 30, height: 30, alignItems: 'center', justifyContent: 'center' },
  iconBtnOff: { opacity: 0.3 },
  removeBtn: { width: 30, height: 30, alignItems: 'center', justifyContent: 'center' },
  catRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, borderBottomWidth: 1, borderBottomColor: Colors.border },
  catRowInactive: { opacity: 0.5 },
  catInfo: { flex: 1 },
  catTitle: { color: Colors.text, fontSize: FontSize.sm, fontWeight: '700' },
  catMeta: { color: Colors.textSubtle, fontSize: FontSize.xs },
  mutedText: { color: Colors.textMuted },
  activeTag: { fontSize: FontSize.xs, fontWeight: '600' },
  activeOn: { color: Colors.success },
  activeOff: { color: Colors.textMuted },
  tagRow: { flexDirection: 'row', gap: 4, marginTop: 3, flexWrap: 'wrap' },
  regionPill: { paddingHorizontal: 5, paddingVertical: 2, borderRadius: Radius.xs },
  pillUS: { backgroundColor: 'rgba(46,204,113,0.15)' },
  pillGlobal: { backgroundColor: 'rgba(56,189,248,0.12)' },
  tierPill: { paddingHorizontal: 5, paddingVertical: 2, borderRadius: Radius.xs },
  pillPremium: { backgroundColor: 'rgba(232,180,35,0.1)' },
  pillStandard: { backgroundColor: 'rgba(80,80,80,0.15)' },
  focusPill: { paddingHorizontal: 5, paddingVertical: 2, borderRadius: Radius.xs, backgroundColor: 'rgba(245,158,11,0.10)' },
  pillTxt: { fontSize: 9, fontWeight: '700' },
  pillUSTxt: { color: Colors.success },
  pillGlobalTxt: { color: '#38BDF8' },
  pillPremiumTxt: { color: Colors.primary },
  pillStandardTxt: { color: Colors.textMuted },
  focusTxt: { fontSize: 9, fontWeight: '700', color: Colors.primary },
  catBtns: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  spotBtn: { flexDirection: 'row', alignItems: 'center', gap: 3, paddingHorizontal: Spacing.sm, paddingVertical: 4, borderRadius: Radius.xs, borderWidth: 1, borderColor: Colors.primary },
  spotBtnOn: { backgroundColor: Colors.primary },
  spotBtnOff: { borderColor: Colors.textMuted },
  spotBtnTxt: { color: '#000', fontSize: FontSize.xs, fontWeight: '700' },
  spotBtnTxtOut: { color: Colors.primary },
  catSearchBar: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, backgroundColor: Colors.surface2, borderRadius: Radius.sm, paddingHorizontal: Spacing.md, paddingVertical: 10, margin: Spacing.md, marginBottom: Spacing.sm, borderWidth: 1, borderColor: Colors.border },
  catSearchInp: { flex: 1, color: Colors.text, fontSize: FontSize.base, padding: 0 },
  maxBanner: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(245,158,11,0.1)', marginHorizontal: Spacing.md, marginBottom: Spacing.sm, padding: Spacing.sm, borderRadius: Radius.xs, borderLeftWidth: 3, borderLeftColor: Colors.warning },
  maxTxt: { color: Colors.warning, fontSize: FontSize.xs, flex: 1 },
  reqRow: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.sm, paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, borderBottomWidth: 1, borderBottomColor: Colors.border },
  reqInfo: { flex: 1 },
  reqTitle: { color: Colors.text, fontSize: FontSize.sm, fontWeight: '700' },
  reqMeta: { color: Colors.textSubtle, fontSize: FontSize.xs },
  reqContact: { color: Colors.textMuted, fontSize: FontSize.xs },
  reqPkg: { color: Colors.textMuted, fontSize: FontSize.xs },
  reqAmount: { color: Colors.primary, fontSize: FontSize.xs, fontWeight: '700', marginTop: 2 },
  reqBtns: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  approveBtn: { flexDirection: 'row', alignItems: 'center', gap: 3, backgroundColor: Colors.primary, paddingHorizontal: Spacing.sm, paddingVertical: 4, borderRadius: Radius.xs },
  approveBtnOff: { backgroundColor: Colors.surface2, borderWidth: 1, borderColor: Colors.border },
  approveTxt: { color: '#000', fontSize: FontSize.xs, fontWeight: '700' },
  approveTxtOff: { color: Colors.textMuted },
  rejectBtn: { width: 28, height: 28, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: Colors.error, borderRadius: Radius.xs },
  statusDot: { width: 6, height: 6, borderRadius: 3 },
  statusTxt: { fontSize: FontSize.xs, fontWeight: '700' },
  sectionHdr: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, backgroundColor: Colors.surface2 },
  sectionTitle: { color: Colors.textSubtle, fontSize: FontSize.sm, fontWeight: '700', flex: 1 },
  countBadge: { backgroundColor: 'rgba(245,158,11,0.12)', paddingHorizontal: 8, paddingVertical: 2, borderRadius: Radius.pill },
  countTxt: { color: Colors.primary, fontSize: FontSize.xs, fontWeight: '700' },
  emptySection: { padding: Spacing.xxl, alignItems: 'center', gap: Spacing.sm },
  emptySectionTxt: { color: Colors.textSubtle, fontSize: FontSize.md, fontWeight: '600' },
  emptySectionSub: { color: Colors.textMuted, fontSize: FontSize.sm, textAlign: 'center' },
});
