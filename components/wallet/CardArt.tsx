import { LinearGradient } from 'expo-linear-gradient';
import { Lock, Nfc } from 'lucide-react-native';
import { StyleSheet, Text, View } from 'react-native';
import { draft } from '../../lib/onboarding-store';
import type { Card, CardDesign } from '../../lib/store';

export const CARD_RATIO = 1.586;

/** Inspo 17 card designs (programmatic gradients — final art is a later asset task). */
export const DESIGNS: Record<CardDesign, { colors: [string, string, ...string[]]; fg: string }> = {
  midnight: { colors: ['#2b2b2e', '#0a0a0b'], fg: '#fff' },
  emerald: { colors: ['#3ee35a', '#0b7d2b'], fg: '#06250f' },
  savanna: { colors: ['#d98a44', '#6b3b16', '#2a1809'], fg: '#fff' },
  terrazzo: { colors: ['#3a3a52', '#16213e'], fg: '#fff' },
  aurora: { colors: ['#ff9f0a', '#bf5af2', '#0a84ff'], fg: '#fff' },
};

export function CardArt({ card, width }: { card: Card; width: number }) {
  const d = DESIGNS[card.design];
  const height = width / CARD_RATIO;
  const ztag = draft.ztag ?? 'zenti';

  return (
    <View style={[styles.wrap, { width, height }]}>
      <LinearGradient colors={d.colors} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} />

      <View style={styles.top}>
        <Text style={[styles.brandName, { color: d.fg }]}>zenti</Text>
        <Nfc color={d.fg} size={20} />
      </View>

      <View style={[styles.chip, { backgroundColor: 'rgba(255,255,255,0.85)' }]} />

      <View style={styles.bottom}>
        <View>
          <Text style={[styles.tag, { color: d.fg }]}>${ztag}</Text>
          <Text style={[styles.num, { color: d.fg }]}>•••• {card.last4}</Text>
        </View>
        <Text style={[styles.brand, { color: d.fg }]}>{card.brand}</Text>
      </View>

      {card.frozen && (
        <View style={styles.frost}>
          <View style={styles.lockPill}>
            <Lock color="#fff" size={14} />
            <Text style={styles.lockTxt}>Frozen</Text>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { borderRadius: 18, overflow: 'hidden', padding: 18, justifyContent: 'space-between' },
  top: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  brandName: { fontSize: 18, fontWeight: '800', letterSpacing: -0.5 },
  chip: { width: 34, height: 26, borderRadius: 6, position: 'absolute', left: 18, top: 58 },
  bottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  tag: { fontSize: 15, fontWeight: '700' },
  num: { fontSize: 13, fontWeight: '500', marginTop: 2, opacity: 0.9, letterSpacing: 1 },
  brand: { fontSize: 15, fontWeight: '800', fontStyle: 'italic' },
  frost: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(10,10,15,0.45)', justifyContent: 'center', alignItems: 'center' },
  lockPill: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(0,0,0,0.5)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  lockTxt: { color: '#fff', fontSize: 12, fontWeight: '600' },
});
