/**
 * Zenti motion tokens — the "Apple physics" backbone.
 * v34's signature easing is cubic-bezier(0.32,0.72,0,1); these springs/timings
 * recreate that feel in Reanimated. Reuse everywhere so motion stays consistent.
 */
import { Easing } from 'react-native-reanimated';

/** The v34 signature easing curve (iOS-like ease-out). */
export const EASE = Easing.bezier(0.32, 0.72, 0, 1);

/** Durations (ms). */
export const dur = {
  fast: 120, // taps / press feedback
  base: 300, // view transitions
  slow: 400, // Dynamic Island / sheets
  island: 400,
};

/** Reanimated spring presets. */
export const spring = {
  /** Default — smooth, minimal overshoot. Sheets, cards settling. */
  gentle: { damping: 26, stiffness: 240, mass: 1 },
  /** Snappy — quick settle, slight bounce. Toggles, chips. */
  snappy: { damping: 20, stiffness: 320, mass: 0.9 },
  /** Bouncy — playful overshoot. Success, confetti, card flips. */
  bouncy: { damping: 14, stiffness: 220, mass: 1 },
  /** Stiff — near-instant, no bounce. Drag-follow. */
  stiff: { damping: 40, stiffness: 500, mass: 1 },
};

/** Press / interaction scales. */
export const scale = {
  press: 0.97, // buttons
  pressSmall: 0.93, // icons / chips
  cardLift: 1.04, // card rising in the wallet deck
};

/** Wallet deck geometry (Inspo 1). */
export const deck = {
  peek: 56, // visible band per collapsed card
  expandedGap: 100,
};
