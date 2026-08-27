export const Colors = {
  background: '#0E0308',       // deep crimson-black cinema canvas
  surface: '#1A060E',          // dark wine card background
  surface2: '#2A0F18',         // burgundy — input / container bg
  surface3: '#3D1825',         // deep rose — borders, dividers
  primary: '#22C55E',          // vibrant emerald green accent
  primaryDark: '#16A34A',      // green-700 — pressed / hover
  primaryLight: 'rgba(34,197,94,0.10)',   // green tinted background
  primaryGlow: 'rgba(34,197,94,0.22)',    // green glow border/shadow
  accent: '#F43F5E',           // rose-red — spare accent
  text: '#F8FAFC',             // near white — primary text
  textSubtle: '#E2C9D0',       // warm muted rose-white — body text
  textMuted: '#9F6D7A',        // dusty rose — placeholders, hints
  border: '#2A0F18',           // burgundy — card / input borders
  borderLight: '#1A060E',      // deep wine border — hairline dividers
  overlay: 'rgba(0,0,0,0.72)', // dark cinema overlay
  success: '#22C55E',          // emerald-500 (same as primary)
  error: '#EF4444',            // red-500
  warning: '#FBBF24',          // amber
};

export const Spacing = {
  xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48,
};

export const FontSize = {
  xs: 11, sm: 12, base: 14, md: 16, lg: 18, xl: 22, xxl: 28,
};

export const Radius = {
  xs: 4, sm: 8, md: 12, lg: 16, xl: 24, pill: 999,
};

export const Shadow = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.50,
    shadowRadius: 8,
    elevation: 6,
  },
  gold: {
    shadowColor: '#22C55E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 14,
    elevation: 10,
  },
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.30,
    shadowRadius: 4,
    elevation: 3,
  },
};
