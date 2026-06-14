/** Money formatting — Zenti is KES-native (Kenya market). */
export function kes(n: number, withSymbol = true): string {
  const v = Math.round(n).toLocaleString('en-KE');
  return withSymbol ? `KES ${v}` : v;
}

/** Compact relative-ish date label for mock data. */
export function shortDate(d: Date = new Date()): string {
  return d.toLocaleDateString('en-KE', { month: 'short', day: 'numeric' });
}
