import { router, useLocalSearchParams } from 'expo-router';
import { ChevronLeft, RotateCw, Share2 } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { radius, space } from '../../constants/theme';
import { kes } from '../../lib/format';
import { useIsland } from '../../lib/island-context';
import { useStore } from '../../lib/store';
import { useTheme } from '../../lib/theme-context';

export default function TxDetail() {
  const { colors } = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const store = useStore();
  const island = useIsland();
  const t = store.txs.find((x) => x.id === id);
  if (!t) return null;

  const sign = t.dir === 'in' ? '+' : '−';
  const ref = `ZT-${id.toUpperCase().slice(0, 8)}`;

  const share = () => {
    island.set('success', { text: 'Receipt shared' });
    setTimeout(() => island.set('idle'), 1500);
  };

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: colors.bg }]} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={10} style={[styles.icon, { backgroundColor: colors.s2 }]}>
          <ChevronLeft color={colors.t1} size={22} />
        </Pressable>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.body}>
        <View style={[styles.av, { backgroundColor: t.bg }]}>
          <Text style={[styles.avTxt, { color: t.color }]}>{t.initials}</Text>
        </View>
        <Text style={[styles.dir, { color: colors.t2 }]}>{t.dir === 'in' ? 'Received from' : 'You sent'}</Text>
        <Text style={[styles.name, { color: colors.t1 }]}>{t.name}</Text>
        <Text style={[styles.amount, { color: t.dir === 'in' ? colors.green : colors.t1 }]}>
          {sign}
          {kes(t.amount, false)}
        </Text>

        <View style={[styles.card, { backgroundColor: colors.s1, borderColor: colors.sep }]}>
          <Detail label="Status" value={t.status === 'pending' ? 'Pending' : 'Completed'} valueColor={t.status === 'pending' ? colors.amber : colors.green} />
          <Detail label="Date" value={t.date} />
          {!!t.note && <Detail label="Note" value={t.note} />}
          <Detail label="Reference" value={ref} last />
        </View>

        <View style={styles.actions}>
          <Pressable onPress={() => router.push('/pay')} style={[styles.action, { backgroundColor: colors.s2 }]}>
            <RotateCw color={colors.t1} size={18} />
            <Text style={[styles.actionTxt, { color: colors.t1 }]}>Repeat</Text>
          </Pressable>
          <Pressable onPress={share} style={[styles.action, { backgroundColor: colors.s2 }]}>
            <Share2 color={colors.t1} size={18} />
            <Text style={[styles.actionTxt, { color: colors.t1 }]}>Share</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

function Detail({ label, value, valueColor, last }: { label: string; value: string; valueColor?: string; last?: boolean }) {
  const { colors } = useTheme();
  return (
    <View style={[styles.detailRow, !last && { borderBottomColor: colors.sep, borderBottomWidth: 1 }]}>
      <Text style={[styles.detailLabel, { color: colors.t2 }]}>{label}</Text>
      <Text style={[styles.detailVal, { color: valueColor ?? colors.t1 }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: { flexDirection: 'row', paddingHorizontal: space.px, paddingTop: 6 },
  icon: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  body: { flex: 1, alignItems: 'center', paddingHorizontal: space.px, paddingTop: 8 },
  av: { width: 72, height: 72, borderRadius: 36, justifyContent: 'center', alignItems: 'center' },
  avTxt: { fontSize: 24, fontWeight: '800' },
  dir: { fontSize: 14, marginTop: 16 },
  name: { fontSize: 20, fontWeight: '700', marginTop: 2 },
  amount: { fontSize: 44, fontWeight: '800', letterSpacing: -1, marginTop: 12 },
  card: { alignSelf: 'stretch', borderRadius: radius.card, borderWidth: 1, marginTop: 28, overflow: 'hidden' },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', padding: 16 },
  detailLabel: { fontSize: 14 },
  detailVal: { fontSize: 14, fontWeight: '600' },
  actions: { flexDirection: 'row', gap: 12, alignSelf: 'stretch', marginTop: 20 },
  action: { flex: 1, height: 50, borderRadius: 14, flexDirection: 'row', gap: 8, justifyContent: 'center', alignItems: 'center' },
  actionTxt: { fontSize: 15, fontWeight: '700' },
});
