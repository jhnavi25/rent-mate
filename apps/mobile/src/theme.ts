export const colors = {
  bg: '#0B1020',
  bgElevated: '#121A2F',
  surface: '#1A2440',
  surfaceHover: '#222E4D',
  border: '#2A3555',
  borderLight: '#3A4668',
  text: '#F4F6FB',
  textMuted: '#9AA6C2',
  textDim: '#6B7899',
  primary: '#7C5CFF',
  primarySoft: 'rgba(124, 92, 255, 0.15)',
  accent: '#22D3A6',
  accentSoft: 'rgba(34, 211, 166, 0.15)',
  warning: '#FBBF24',
  warningSoft: 'rgba(251, 191, 36, 0.15)',
  danger: '#FF5C7A',
  dangerSoft: 'rgba(255, 92, 122, 0.15)',
  info: '#38BDF8',
  white: '#FFFFFF',
  black: '#000000',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  pill: 999,
};

export const typography = {
  hero: { fontSize: 32, fontWeight: '800' as const, letterSpacing: -0.5 },
  h1: { fontSize: 26, fontWeight: '700' as const },
  h2: { fontSize: 20, fontWeight: '700' as const },
  h3: { fontSize: 17, fontWeight: '600' as const },
  body: { fontSize: 15, lineHeight: 22 },
  caption: { fontSize: 13, lineHeight: 18 },
  tiny: { fontSize: 11, lineHeight: 14 },
};

export const shadows = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
};
