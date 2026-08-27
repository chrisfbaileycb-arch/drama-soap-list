import React, { useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TextInput, Pressable, KeyboardAvoidingView, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useApp } from '@/hooks/useAppState';
import { Colors, Spacing, FontSize, Radius, Shadow } from '@/constants/theme';

type PackageTier = 399 | 599;
type Step = 1 | 2 | 3 | 4;

const WEEKS_OPTIONS = [1, 2, 4, 8, 12];

const PACKAGES: { tier: PackageTier; name: 'Standard Spotlight' | 'Premium Featured'; desc: string; perks: string[] }[] = [
  {
    tier: 399, name: 'Standard Spotlight',
    desc: '1-week rotation in the 10-card Spotlight carousel.',
    perks: ['Spotlight carousel rotation', 'Equal rotation position', 'All genre categories', 'Direct link to your platform'],
  },
  {
    tier: 599, name: 'Premium Featured',
    desc: 'Priority positioning in the Spotlight carousel + genre-featured placement.',
    perks: ['Priority carousel position', 'Genre-featured badge', 'Top-3 rotation guarantee', 'Direct platform link', 'Premium quality tier'],
  },
];

function ProgressBar({ step }: { step: Step }) {
  const labels = ['Details', 'Package', 'Payment', 'Done'];
  return (
    <View style={ps.progressWrap}>
      {labels.map((label, i) => {
        const n = (i + 1) as Step;
        const done = step > n;
        const active = step === n;
        return (
          <React.Fragment key={n}>
            <View style={ps.progStep}>
              <View style={[ps.progDot, active && ps.progDotActive, done && ps.progDotDone]}>
                {done
                  ? <MaterialIcons name="check" size={12} color="#000" />
                  : <Text style={[ps.progNum, (active || done) && ps.progNumActive]}>{n}</Text>
                }
              </View>
              <Text style={[ps.progLbl, (active || done) && ps.progLblActive]}>{label}</Text>
            </View>
            {i < labels.length - 1 && <View style={[ps.progLine, done && ps.progLineDone]} />}
          </React.Fragment>
        );
      })}
    </View>
  );
}

export default function SponsorScreen() {
  const { submitSponsorInquiry } = useApp();

  const [step, setStep] = useState<Step>(1);
  const [processing, setProcessing] = useState(false);
  const [refId, setRefId] = useState('');

  // Step 1: Details
  const [studioName, setStudioName] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [seriesTitle, setSeriesTitle] = useState('');
  const [targetUrl, setTargetUrl] = useState('');
  const [posterUrl, setPosterUrl] = useState('');
  const [error1, setError1] = useState('');

  // Step 2: Package
  const [packageTier, setPackageTier] = useState<PackageTier>(399);
  const [weeks, setWeeks] = useState(1);

  // Step 3: Payment
  const [cardNum, setCardNum] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardName, setCardName] = useState('');
  const [error3, setError3] = useState('');

  const selectedPkg = PACKAGES.find(p => p.tier === packageTier)!;
  const totalAmount = packageTier * weeks;

  const handleStep1 = useCallback(() => {
    if (!studioName.trim() || !contactName.trim() || !contactEmail.trim() || !seriesTitle.trim() || !targetUrl.trim()) {
      setError1('All fields except Poster URL are required.');
      return;
    }
    if (!contactEmail.includes('@')) {
      setError1('Please enter a valid email address.');
      return;
    }
    setError1('');
    setStep(2);
  }, [studioName, contactName, contactEmail, seriesTitle, targetUrl]);

  const handleStep3 = useCallback(() => {
    const digits = cardNum.replace(/\s/g, '');
    if (digits.length < 16 || !expiry.trim() || cvv.length < 3 || !cardName.trim()) {
      setError3('Please complete all payment fields.');
      return;
    }
    setError3('');
    setProcessing(true);
    setTimeout(() => {
      const id = submitSponsorInquiry({
        studio_name: studioName.trim(),
        contact_name: contactName.trim(),
        contact_email: contactEmail.trim(),
        series_title: seriesTitle.trim(),
        target_url: targetUrl.trim(),
        poster_url: posterUrl.trim(),
        package_tier: packageTier,
        package_name: selectedPkg.name,
        weeks,
        total_amount: totalAmount,
        payment_status: 'paid_pending_approval',
      });
      setRefId(id);
      setProcessing(false);
      setStep(4);
    }, 2000);
  }, [cardNum, expiry, cvv, cardName, studioName, contactName, contactEmail, seriesTitle, targetUrl, posterUrl, packageTier, selectedPkg, weeks, totalAmount, submitSponsorInquiry]);

  const formatCard = (val: string) => {
    const digits = val.replace(/\D/g, '').slice(0, 16);
    return digits.replace(/(\d{4})(?=\d)/g, '$1 ');
  };

  const formatExpiry = (val: string) => {
    const digits = val.replace(/\D/g, '').slice(0, 4);
    if (digits.length >= 3) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    return digits;
  };

  return (
    <SafeAreaView style={ps.screen} edges={['top']}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        {/* Header */}
        <View style={ps.header}>
          <View style={ps.headerIcon}>
            <MaterialIcons name="campaign" size={20} color={Colors.primary} />
          </View>
          <View>
            <Text style={ps.headerTitle}>Sponsor Access</Text>
            <Text style={ps.headerSub}>Soap List Placement Portal</Text>
          </View>
        </View>

        {step < 4 && <ProgressBar step={step} />}

        <ScrollView style={{ flex: 1 }} contentContainerStyle={ps.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

          {/* ── STEP 1: APPLICATION DETAILS ── */}
          {step === 1 && (
            <View>
              <Text style={ps.stepTitle}>Application Details</Text>
              <Text style={ps.stepSub}>Tell us about your studio and the series you want to promote.</Text>

              <Text style={ps.label}>Business / Studio Name *</Text>
              <TextInput style={ps.inp} value={studioName} onChangeText={setStudioName} placeholder="e.g. Crazy Maple Studio" placeholderTextColor={Colors.textMuted} />

              <Text style={ps.label}>Contact Person *</Text>
              <TextInput style={ps.inp} value={contactName} onChangeText={setContactName} placeholder="Full name" placeholderTextColor={Colors.textMuted} />

              <Text style={ps.label}>Contact Email *</Text>
              <TextInput style={ps.inp} value={contactEmail} onChangeText={setContactEmail} placeholder="email@studio.com" placeholderTextColor={Colors.textMuted} keyboardType="email-address" autoCapitalize="none" />

              <Text style={ps.label}>Series / App Title *</Text>
              <TextInput style={ps.inp} value={seriesTitle} onChangeText={setSeriesTitle} placeholder="e.g. The Billionaire's Secret" placeholderTextColor={Colors.textMuted} />

              <Text style={ps.label}>Target Destination URL *</Text>
              <TextInput style={ps.inp} value={targetUrl} onChangeText={setTargetUrl} placeholder="App Store, Play Store, or web link" placeholderTextColor={Colors.textMuted} keyboardType="url" autoCapitalize="none" />

              <Text style={ps.label}>Poster Image URL <Text style={ps.optional}>(optional)</Text></Text>
              <TextInput style={ps.inp} value={posterUrl} onChangeText={setPosterUrl} placeholder="https://..." placeholderTextColor={Colors.textMuted} keyboardType="url" autoCapitalize="none" />

              {error1 ? (
                <View style={ps.errBox}>
                  <MaterialIcons name="error-outline" size={14} color={Colors.error} />
                  <Text style={ps.errTxt}>{error1}</Text>
                </View>
              ) : null}

              <Pressable style={({ pressed }) => [ps.ctaBtn, pressed && ps.ctaPressed]} onPress={handleStep1}>
                <Text style={ps.ctaTxt}>Continue to Package Selection</Text>
                <MaterialIcons name="arrow-forward" size={18} color="#000" />
              </Pressable>
            </View>
          )}

          {/* ── STEP 2: PACKAGE SELECTION ── */}
          {step === 2 && (
            <View>
              <Text style={ps.stepTitle}>Select Your Package</Text>
              <Text style={ps.stepSub}>Choose the placement tier that fits your campaign goals.</Text>

              {PACKAGES.map(pkg => (
                <Pressable
                  key={pkg.tier}
                  style={[ps.pkgCard, packageTier === pkg.tier && ps.pkgCardOn]}
                  onPress={() => setPackageTier(pkg.tier)}
                >
                  <View style={ps.pkgHeader}>
                    <View style={ps.pkgTitleRow}>
                      <Text style={[ps.pkgName, packageTier === pkg.tier && ps.pkgNameOn]}>{pkg.name}</Text>
                      {pkg.tier === 599 && <View style={ps.bestBadge}><Text style={ps.bestTxt}>BEST VALUE</Text></View>}
                    </View>
                    <Text style={ps.pkgPrice}>${pkg.tier}<Text style={ps.pkgPer}> / week</Text></Text>
                  </View>
                  <Text style={ps.pkgDesc}>{pkg.desc}</Text>
                  <View style={ps.pkgPerks}>
                    {pkg.perks.map(perk => (
                      <View key={perk} style={ps.perkRow}>
                        <MaterialIcons name="check-circle" size={13} color={packageTier === pkg.tier ? Colors.primary : Colors.textMuted} />
                        <Text style={[ps.perkTxt, packageTier === pkg.tier && ps.perkTxtOn]}>{perk}</Text>
                      </View>
                    ))}
                  </View>
                  {packageTier === pkg.tier && (
                    <View style={ps.selectedBadge}>
                      <MaterialIcons name="radio-button-checked" size={16} color={Colors.primary} />
                      <Text style={ps.selectedTxt}>Selected</Text>
                    </View>
                  )}
                </Pressable>
              ))}

              <Text style={ps.label}>Campaign Duration</Text>
              <View style={ps.weeksRow}>
                {WEEKS_OPTIONS.map(w => (
                  <Pressable key={w} style={[ps.weekChip, weeks === w && ps.weekChipOn]} onPress={() => setWeeks(w)}>
                    <Text style={[ps.weekTxt, weeks === w && ps.weekTxtOn]}>{w}w</Text>
                  </Pressable>
                ))}
              </View>

              <View style={ps.summaryBox}>
                <Text style={ps.summaryTitle}>Order Summary</Text>
                <View style={ps.summaryRow}>
                  <Text style={ps.summaryKey}>{selectedPkg.name}</Text>
                  <Text style={ps.summaryVal}>${packageTier}/wk</Text>
                </View>
                <View style={ps.summaryRow}>
                  <Text style={ps.summaryKey}>Duration</Text>
                  <Text style={ps.summaryVal}>{weeks} week{weeks > 1 ? 's' : ''}</Text>
                </View>
                <View style={[ps.summaryRow, ps.summaryTotal]}>
                  <Text style={ps.summaryTotalKey}>Total</Text>
                  <Text style={ps.summaryTotalVal}>${totalAmount.toLocaleString()}</Text>
                </View>
              </View>

              <View style={ps.btnRow}>
                <Pressable style={[ps.ctaBtn, ps.ctaOutline]} onPress={() => setStep(1)}>
                  <MaterialIcons name="arrow-back" size={18} color={Colors.primary} />
                  <Text style={[ps.ctaTxt, ps.ctaTxtOutline]}>Back</Text>
                </Pressable>
                <Pressable style={({ pressed }) => [ps.ctaBtn, ps.ctaFlex, pressed && ps.ctaPressed]} onPress={() => setStep(3)}>
                  <Text style={ps.ctaTxt}>Proceed to Payment</Text>
                  <MaterialIcons name="lock" size={16} color="#000" />
                </Pressable>
              </View>
            </View>
          )}

          {/* ── STEP 3: MOCK PAYMENT ── */}
          {step === 3 && (
            <View>
              <View style={ps.mockBanner}>
                <MaterialIcons name="info-outline" size={14} color="#000" />
                <Text style={ps.mockTxt}>MOCK PAYMENT — Sandbox Mode. No real charges will be made.</Text>
              </View>

              <Text style={ps.stepTitle}>Secure Checkout</Text>

              <View style={ps.orderSummaryCard}>
                <MaterialIcons name="receipt" size={16} color={Colors.primary} />
                <View style={{ flex: 1 }}>
                  <Text style={ps.orderTitle}>{selectedPkg.name} — {weeks} week{weeks > 1 ? 's' : ''}</Text>
                  <Text style={ps.orderSeries}>{seriesTitle}</Text>
                </View>
                <Text style={ps.orderTotal}>${totalAmount.toLocaleString()}</Text>
              </View>

              <Text style={ps.label}>Cardholder Name</Text>
              <TextInput style={ps.inp} value={cardName} onChangeText={setCardName} placeholder="Name on card" placeholderTextColor={Colors.textMuted} autoCapitalize="words" />

              <Text style={ps.label}>Card Number</Text>
              <View style={ps.cardNumWrap}>
                <MaterialIcons name="credit-card" size={18} color={Colors.textMuted} style={{ marginRight: 8 }} />
                <TextInput
                  style={[ps.inp, { flex: 1, marginBottom: 0 }]}
                  value={cardNum}
                  onChangeText={v => setCardNum(formatCard(v))}
                  placeholder="1234 5678 9012 3456"
                  placeholderTextColor={Colors.textMuted}
                  keyboardType="numeric"
                  maxLength={19}
                />
              </View>

              <View style={ps.cardRow}>
                <View style={{ flex: 1 }}>
                  <Text style={ps.label}>Expiry (MM/YY)</Text>
                  <TextInput style={ps.inp} value={expiry} onChangeText={v => setExpiry(formatExpiry(v))} placeholder="MM/YY" placeholderTextColor={Colors.textMuted} keyboardType="numeric" maxLength={5} />
                </View>
                <View style={{ width: Spacing.sm }} />
                <View style={{ flex: 1 }}>
                  <Text style={ps.label}>CVV</Text>
                  <TextInput style={ps.inp} value={cvv} onChangeText={v => setCvv(v.replace(/\D/g, '').slice(0, 4))} placeholder="CVV" placeholderTextColor={Colors.textMuted} keyboardType="numeric" secureTextEntry maxLength={4} />
                </View>
              </View>

              {error3 ? (
                <View style={ps.errBox}>
                  <MaterialIcons name="error-outline" size={14} color={Colors.error} />
                  <Text style={ps.errTxt}>{error3}</Text>
                </View>
              ) : null}

              <View style={ps.secureNote}>
                <MaterialIcons name="lock" size={12} color={Colors.textMuted} />
                <Text style={ps.secureNoteTxt}>Payments are processed securely. Your card data is not stored.</Text>
              </View>

              <View style={ps.btnRow}>
                <Pressable style={[ps.ctaBtn, ps.ctaOutline]} onPress={() => setStep(2)}>
                  <MaterialIcons name="arrow-back" size={18} color={Colors.primary} />
                  <Text style={[ps.ctaTxt, ps.ctaTxtOutline]}>Back</Text>
                </Pressable>
                <Pressable
                  style={({ pressed }) => [ps.ctaBtn, ps.ctaFlex, pressed && ps.ctaPressed, processing && ps.ctaLoading]}
                  onPress={handleStep3}
                  disabled={processing}
                >
                  {processing
                    ? <Text style={ps.ctaTxt}>Processing...</Text>
                    : <>
                        <MaterialIcons name="lock" size={16} color="#000" />
                        <Text style={ps.ctaTxt}>Pay ${totalAmount.toLocaleString()}</Text>
                      </>
                  }
                </Pressable>
              </View>
            </View>
          )}

          {/* ── STEP 4: SUCCESS ── */}
          {step === 4 && (
            <View style={ps.successWrap}>
              <View style={ps.successIcon}>
                <MaterialIcons name="check-circle" size={64} color={Colors.success} />
              </View>
              <Text style={ps.successTitle}>Application Submitted!</Text>
              <Text style={ps.successSub}>Your sponsorship request has been received and is pending review by our team.</Text>

              <View style={ps.refBox}>
                <Text style={ps.refLabel}>Reference ID</Text>
                <Text style={ps.refVal}>{refId}</Text>
              </View>

              <View style={ps.successDetails}>
                <View style={ps.successRow}>
                  <MaterialIcons name="business" size={14} color={Colors.textSubtle} />
                  <Text style={ps.successRowTxt}>{studioName}</Text>
                </View>
                <View style={ps.successRow}>
                  <MaterialIcons name="movie" size={14} color={Colors.textSubtle} />
                  <Text style={ps.successRowTxt}>{seriesTitle}</Text>
                </View>
                <View style={ps.successRow}>
                  <MaterialIcons name="star" size={14} color={Colors.primary} />
                  <Text style={ps.successRowTxt}>{selectedPkg.name} — {weeks} week{weeks > 1 ? 's' : ''} (${totalAmount.toLocaleString()})</Text>
                </View>
              </View>

              <Text style={ps.successNote}>Our team will review and activate your spotlight placement within 24 hours. You will receive a confirmation at <Text style={{ color: Colors.primary }}>{contactEmail}</Text>.</Text>

              <Pressable
                style={({ pressed }) => [ps.ctaBtn, pressed && ps.ctaPressed, { marginTop: Spacing.lg }]}
                onPress={() => {
                  setStep(1);
                  setStudioName(''); setContactName(''); setContactEmail('');
                  setSeriesTitle(''); setTargetUrl(''); setPosterUrl('');
                  setCardNum(''); setExpiry(''); setCvv(''); setCardName('');
                  setPackageTier(399); setWeeks(1);
                }}
              >
                <Text style={ps.ctaTxt}>Submit Another Application</Text>
              </Pressable>
            </View>
          )}

          <View style={{ height: Spacing.xxl }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const ps = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.sm,
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.md,
    borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  headerIcon: {
    width: 36, height: 36, borderRadius: Radius.sm,
    backgroundColor: Colors.primaryGlow,
    alignItems: 'center', justifyContent: 'center',
  },
  headerTitle: { color: Colors.text, fontSize: FontSize.lg, fontWeight: '800' },
  headerSub: { color: Colors.textMuted, fontSize: FontSize.xs },
  progressWrap: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm,
    borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  progStep: { alignItems: 'center', gap: 3 },
  progDot: {
    width: 24, height: 24, borderRadius: 12,
    backgroundColor: Colors.surface2, borderWidth: 1, borderColor: Colors.border,
    alignItems: 'center', justifyContent: 'center',
  },
  progDotActive: { borderColor: Colors.primary, backgroundColor: Colors.primaryGlow },
  progDotDone: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  progNum: { color: Colors.textMuted, fontSize: FontSize.xs, fontWeight: '700' },
  progNumActive: { color: Colors.primary },
  progLbl: { color: Colors.textMuted, fontSize: 9, fontWeight: '600' },
  progLblActive: { color: Colors.primary },
  progLine: { flex: 1, height: 1, backgroundColor: Colors.border, marginBottom: 14 },
  progLineDone: { backgroundColor: Colors.primary },
  content: { padding: Spacing.md },
  stepTitle: { color: Colors.text, fontSize: FontSize.xl, fontWeight: '800', marginBottom: Spacing.xs },
  stepSub: { color: Colors.textSubtle, fontSize: FontSize.sm, marginBottom: Spacing.lg, lineHeight: FontSize.sm * 1.5 },
  label: { color: Colors.textSubtle, fontSize: FontSize.sm, fontWeight: '600', marginBottom: Spacing.xs, marginTop: Spacing.sm },
  optional: { color: Colors.textMuted, fontWeight: '400' },
  inp: {
    backgroundColor: Colors.surface2, borderRadius: Radius.sm,
    paddingHorizontal: Spacing.md, paddingVertical: 12,
    color: Colors.text, fontSize: FontSize.base,
    borderWidth: 1, borderColor: Colors.border, marginBottom: Spacing.sm,
  },
  errBox: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: 'rgba(231,76,60,0.1)', borderRadius: Radius.xs,
    padding: Spacing.sm, marginBottom: Spacing.sm,
    borderLeftWidth: 3, borderLeftColor: Colors.error,
  },
  errTxt: { color: Colors.error, fontSize: FontSize.sm, flex: 1 },
  ctaBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: Colors.primary, borderRadius: Radius.sm,
    paddingVertical: 14, paddingHorizontal: Spacing.md,
    marginTop: Spacing.md, ...Shadow.gold,
  },
  ctaOutline: { backgroundColor: 'transparent', borderWidth: 1, borderColor: Colors.primary, flex: 0.35 },
  ctaFlex: { flex: 1 },
  ctaPressed: { opacity: 0.85, transform: [{ scale: 0.98 }] },
  ctaLoading: { opacity: 0.7 },
  ctaTxt: { color: '#000', fontSize: FontSize.md, fontWeight: '800' },
  ctaTxtOutline: { color: Colors.primary },
  btnRow: { flexDirection: 'row', gap: Spacing.sm, alignItems: 'center', marginTop: Spacing.sm },
  // Package cards
  pkgCard: {
    backgroundColor: Colors.surface, borderRadius: Radius.lg,
    padding: Spacing.md, marginBottom: Spacing.md,
    borderWidth: 1, borderColor: Colors.border,
  },
  pkgCardOn: { borderColor: Colors.primary, backgroundColor: 'rgba(245,158,11,0.06)' },
  pkgHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: Spacing.xs },
  pkgTitleRow: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: Spacing.xs, flexWrap: 'wrap' },
  pkgName: { color: Colors.textSubtle, fontSize: FontSize.md, fontWeight: '700' },
  pkgNameOn: { color: Colors.text },
  pkgPrice: { color: Colors.primary, fontSize: FontSize.lg, fontWeight: '800' },
  pkgPer: { color: Colors.textSubtle, fontSize: FontSize.sm, fontWeight: '400' },
  pkgDesc: { color: Colors.textMuted, fontSize: FontSize.sm, marginBottom: Spacing.sm, lineHeight: FontSize.sm * 1.5 },
  pkgPerks: { gap: 4 },
  perkRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  perkTxt: { color: Colors.textMuted, fontSize: FontSize.sm },
  perkTxtOn: { color: Colors.textSubtle },
  bestBadge: { backgroundColor: Colors.primary, paddingHorizontal: 6, paddingVertical: 2, borderRadius: Radius.xs },
  bestTxt: { color: '#000', fontSize: 9, fontWeight: '800' },
  selectedBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: Spacing.sm },
  selectedTxt: { color: Colors.primary, fontSize: FontSize.sm, fontWeight: '700' },
  // Weeks
  weeksRow: { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.md, flexWrap: 'wrap' },
  weekChip: {
    paddingHorizontal: Spacing.md, paddingVertical: 8,
    borderRadius: Radius.pill, borderWidth: 1, borderColor: Colors.border,
    backgroundColor: Colors.surface2,
  },
  weekChipOn: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  weekTxt: { color: Colors.textSubtle, fontSize: FontSize.sm, fontWeight: '600' },
  weekTxtOn: { color: '#000' },
  // Summary
  summaryBox: {
    backgroundColor: Colors.surface, borderRadius: Radius.md,
    padding: Spacing.md, marginTop: Spacing.sm,
    borderWidth: 1, borderColor: Colors.border,
  },
  summaryTitle: { color: Colors.primary, fontSize: FontSize.sm, fontWeight: '700', marginBottom: Spacing.sm },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: Spacing.xs },
  summaryKey: { color: Colors.textSubtle, fontSize: FontSize.sm },
  summaryVal: { color: Colors.text, fontSize: FontSize.sm, fontWeight: '600' },
  summaryTotal: { borderTopWidth: 1, borderTopColor: Colors.border, paddingTop: Spacing.sm, marginTop: Spacing.xs },
  summaryTotalKey: { color: Colors.text, fontSize: FontSize.md, fontWeight: '700' },
  summaryTotalVal: { color: Colors.primary, fontSize: FontSize.lg, fontWeight: '800' },
  // Payment
  mockBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: Colors.warning, borderRadius: Radius.sm,
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.xs,
    marginBottom: Spacing.md,
  },
  mockTxt: { color: '#000', fontSize: FontSize.xs, fontWeight: '700', flex: 1 },
  orderSummaryCard: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.sm,
    backgroundColor: Colors.surface, borderRadius: Radius.md,
    padding: Spacing.md, marginBottom: Spacing.md,
    borderWidth: 1, borderColor: Colors.primaryGlow,
  },
  orderTitle: { color: Colors.text, fontSize: FontSize.sm, fontWeight: '700' },
  orderSeries: { color: Colors.textSubtle, fontSize: FontSize.xs },
  orderTotal: { color: Colors.primary, fontSize: FontSize.lg, fontWeight: '800' },
  cardNumWrap: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surface2, borderRadius: Radius.sm, paddingLeft: Spacing.md, borderWidth: 1, borderColor: Colors.border, marginBottom: Spacing.sm },
  cardRow: { flexDirection: 'row', gap: Spacing.sm },
  secureNote: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: Spacing.sm },
  secureNoteTxt: { color: Colors.textMuted, fontSize: FontSize.xs },
  // Success
  successWrap: { alignItems: 'center', paddingTop: Spacing.xl },
  successIcon: { marginBottom: Spacing.md },
  successTitle: { color: Colors.text, fontSize: FontSize.xxl, fontWeight: '800', textAlign: 'center', marginBottom: Spacing.sm },
  successSub: { color: Colors.textSubtle, fontSize: FontSize.base, textAlign: 'center', lineHeight: FontSize.base * 1.6, marginBottom: Spacing.lg },
  refBox: {
    backgroundColor: Colors.surface, borderRadius: Radius.md, padding: Spacing.md,
    alignItems: 'center', borderWidth: 1, borderColor: Colors.primaryGlow, marginBottom: Spacing.lg, width: '100%',
  },
  refLabel: { color: Colors.textMuted, fontSize: FontSize.xs, fontWeight: '600', marginBottom: 4 },
  refVal: { color: Colors.primary, fontSize: FontSize.sm, fontFamily: 'monospace', fontWeight: '700' },
  successDetails: { width: '100%', gap: Spacing.xs, marginBottom: Spacing.lg },
  successRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  successRowTxt: { color: Colors.textSubtle, fontSize: FontSize.sm },
  successNote: { color: Colors.textMuted, fontSize: FontSize.sm, textAlign: 'center', lineHeight: FontSize.sm * 1.6, width: '100%' },
});
