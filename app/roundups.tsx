import { router } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../components/ui/Button';
import { space } from '../constants/theme';
import { kes } from '../lib/format';
import { useStore } from '../lib/store';
import { useTheme } from '../lib/theme-context';

const BASES = [0, 10, 50, 100];
const MULTS = [1, 2, 3, 10];
const PCTS: (number | null)[] = [null, 25, 50, 100];

export default function Roundups() {
  const { colors } = useTheme();
  const store = useStore();
  const [base, setBase] = useState(store.roundups.base);
  const [mult, setMult] = useState(store.roundups.multiplier);
  const [pct, setPct] = useState<number | null>(store.roundups.autosavePct);

  // example: a KES 480 purchase rounds up to next `base`, then ×mult
  const example = base ? (Math.ceil(480 / base) * base - 480) * mult : 0;

  const save = () => {
    store.setRoundups({ base, multiplier: mult, autosavePct: pct, enabled: base > 0 });
    router.back();
  };

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: colors.bg }]} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={10} style={[styles.icon, { backgroundColor: colors.s2 }]}>
          <ChevronLeft color={colors.t1} size={22} />
        </Pressable>
        <Text style={[styles.title, { color: colors.t1 }]}>Round-Ups</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
        <Section label="Round up to nearest">
          <Segmented
            options={BASES.map((b) => (b === 0 ? 'Off' : kes(b, false)))}
            selected={BASES.indexOf(base)}
            onSelect={(i) => setBase(BASES[i])}
          />
        </Section>

        <Section label="Multiplier">
          <Segmented
            options={MULTS.map((m) => (m === 1 ? 'Off' : `${m}x`))}
            selected={MULTS.indexOf(mult)}
            onSelect={(i) => setMult(MULTS[i])}
          />
        </Section>

        <Section label="Auto-save perks savings">
          <Segmented
            options={PCTS.map((p) => (p === null ? 'Ask first' : `${p}%`))}
            selected={PCTS.indexOf(pct)}
            onSelect={(i) => setPct(PCTS[i])}
          />
        </Section>

        <View style={[styles.example, { backgroundColor: colors.gdim }]}>
          <Text style={[styles.exampleTxt, { color: colors.t1 }]}>
            {base
              ? `Spend ${kes(480)} → we auto-save `
              : 'Round-Ups are off. '}
            {base ? <Text style={{ color: colors.green, fontWeight: '700' }}>{kes(example)}</Text> : 'Turn on a round-up to start saving.'}
          </Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button label="Save" variant="green" onPress={save} />
      </View>
    </SafeAreaView>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  const { colors } = useTheme();
  return (
    <View style={styles.section}>
      <Text style={[styles.sectionLabel, { color: colors.t1 }]}>{label}</Text>
      {children}
    </View>
  );
}

function Segmented({ options, selected, onSelect }: { options: string[]; selected: number; onSelect: (i: number) => void }) {
  const { colors } = useTheme();
  return (
    <View style={[styles.segmented, { backgroundColor: colors.s2 }]}>
      {options.map((o, i) => (
        <Pressable key={o} onPress={() => onSelect(i)} style={[styles.seg, selected === i && { backgroundColor: colors.green }]}>
          <Text style={[styles.segTxt, { color: selected === i ? '#000' : colors.t2 }]}>{o}</Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: space.px, paddingTop: 6, paddingBottom: 8 },
  icon: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 17, fontWeight: '700' },
  section: { paddingHorizontal: space.px, marginTop: 24 },
  sectionLabel: { fontSize: 16, fontWeight: '700', marginBottom: 12 },
  segmented: { flexDirection: 'row', borderRadius: 14, padding: 4, gap: 4 },
  seg: { flex: 1, height: 40, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  segTxt: { fontSize: 14, fontWeight: '600' },
  example: { marginHorizontal: space.px, marginTop: 28, padding: 16, borderRadius: 16 },
  exampleTxt: { fontSize: 14, lineHeight: 20 },
  footer: { paddingHorizontal: space.px, paddingBottom: 16 },
});
