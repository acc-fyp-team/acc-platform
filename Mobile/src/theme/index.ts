// Values from the ACC Figma design system (board 01 · Foundations).

export const colors = {
  brand: '#F66435',
  charcoal: '#1A1A1A',
  cream: '#F4EFCA',
  canvas: '#F7F8FA',
  surface: '#FFFFFF',
  border: '#E4E7EC',
  text: '#1A1D21',
  muted: '#667085',
  success: '#0A7D43',
  warning: '#92400E',
  error: '#DC2626',
  info: '#1C6FD6',
  ai: '#6D3FD9',
};

export const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32, xxxl: 48 };

export const radius = { sm: 8, md: 12, lg: 16 };

/** Mobile touch target (board 05 · Mobile controls). */
export const touchHeight = 48;

export const fonts = {
  heading: 'Poppins_600SemiBold',
  headingBold: 'Poppins_700Bold',
  body: 'Inter_400Regular',
  bodyMedium: 'Inter_500Medium',
  bodySemi: 'Inter_600SemiBold',
};

export const type = {
  h1: { fontFamily: fonts.headingBold, fontSize: 26, lineHeight: 34, color: colors.text },
  h2: { fontFamily: fonts.heading, fontSize: 20, lineHeight: 28, color: colors.text },
  body: { fontFamily: fonts.body, fontSize: 14, lineHeight: 22, color: colors.text },
  button: { fontFamily: fonts.bodySemi, fontSize: 14, lineHeight: 20 },
  label: { fontFamily: fonts.bodyMedium, fontSize: 12, lineHeight: 18, color: colors.muted },
};
