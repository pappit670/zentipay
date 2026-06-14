/**
 * Zenti design tokens — ported 1:1 from the v34 prototype (`docs/zenti-v34.html`).
 * Dark is the default; light is the alternate. Keep these as the single source of
 * truth for color/spacing/typography so every screen stays on-brand.
 */

export type ThemeName = 'dark' | 'light';

export interface Palette {
  // surfaces
  bg: string;
  s1: string;
  s2: string;
  s3: string;
  s4: string;
  // text
  t1: string;
  t2: string;
  t3: string;
  // separators
  sep: string;
  sep2: string;
  // accents
  green: string;
  gdim: string;
  red: string;
  blue: string;
  amber: string;
  purple: string;
  orange: string;
  // misc
  inputBg: string;
  inputBorder: string;
  sheetBg: string;
  scanBg: string;
  scanBorder: string;
  overlayBg: string;
}

export const palettes: Record<ThemeName, Palette> = {
  dark: {
    bg: '#000',
    s1: '#111',
    s2: '#1c1c1e',
    s3: '#2c2c2e',
    s4: '#3a3a3c',
    t1: '#fff',
    t2: 'rgba(255,255,255,0.55)',
    t3: 'rgba(255,255,255,0.25)',
    sep: 'rgba(255,255,255,0.07)',
    sep2: 'rgba(255,255,255,0.12)',
    green: '#32d74b',
    gdim: 'rgba(50,215,75,0.12)',
    red: '#ff453a',
    blue: '#0a84ff',
    amber: '#ff9f0a',
    purple: '#bf5af2',
    orange: '#ff9f0a',
    inputBg: '#1c1c1e',
    inputBorder: 'rgba(255,255,255,0.07)',
    sheetBg: '#111',
    scanBg: '#1a1a2e',
    scanBorder: 'rgba(255,255,255,0.3)',
    overlayBg: 'rgba(0,0,0,0.6)',
  },
  light: {
    bg: '#f5f5f7',
    s1: '#fff',
    s2: '#f2f2f7',
    s3: '#e5e5ea',
    s4: '#d1d1d6',
    t1: '#000',
    t2: 'rgba(0,0,0,0.55)',
    t3: 'rgba(0,0,0,0.25)',
    sep: 'rgba(0,0,0,0.06)',
    sep2: 'rgba(0,0,0,0.1)',
    green: '#34c759',
    gdim: 'rgba(52,199,89,0.1)',
    red: '#ff3b30',
    blue: '#007aff',
    amber: '#ff9500',
    purple: '#af52de',
    orange: '#ff9500',
    inputBg: '#f2f2f7',
    inputBorder: 'rgba(0,0,0,0.08)',
    sheetBg: '#fff',
    scanBg: '#f2f2f7',
    scanBorder: 'rgba(0,0,0,0.2)',
    overlayBg: 'rgba(0,0,0,0.3)',
  },
};

/** Card art gradients (the Zenti card designs live in Inspo 17 — these are placeholders). */
export const cardGradients: Record<ThemeName, [string, string]> = {
  dark: ['#1a1a2e', '#16213e'],
  light: ['#667eea', '#764ba2'],
};

/** Typography scale from v34 (Inter). */
export const type = {
  family: 'Inter',
  h1: { fontSize: 34, fontWeight: '800' as const, letterSpacing: -0.8, lineHeight: 37 },
  h2: { fontSize: 22, fontWeight: '700' as const, letterSpacing: -0.3 },
  h3: { fontSize: 17, fontWeight: '600' as const },
  body: { fontSize: 15, fontWeight: '400' as const },
  caption: { fontSize: 13, fontWeight: '400' as const },
};

/** Corner radii from v34. */
export const radius = {
  btn: 14,
  pill: 26,
  inset: 16,
  card: 20,
  sheet: 24,
  phone: 54,
  full: 999,
};

/** Spacing helpers. */
export const space = {
  px: 24, // horizontal page padding
  pt: 60, // safe-area top
  pb: 36, // safe-area bottom
  gap: 14,
};

/** App-wide constants. */
export const APP = {
  currency: 'KES', // Kenya-first — see docs/brainstorm-notes.md "Market reality"
  brandGreen: '#32d74b',
};
