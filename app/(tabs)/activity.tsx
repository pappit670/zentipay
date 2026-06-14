import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { radius, space, type } from '../../constants/theme';
import { kes } from '../../lib/format';
import { useStore, type Tx } from '../../lib/store';
import { useTheme } from '../../lib/theme-context';

export default function Activity() {
  const { colors } = useTheme();
  const store = useStore();

  const spent = store.txs.filter((t) => t.dir === 'out').reduce((s, t) => s + t.amount, 0);
  const received = store.txs.filter((t) => t.dir === 'in').reduce((s, t) => s + t.amount, 0);

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: colors.bg }]} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>
        <Text style={[type.h1, styles.h1, { color: colors.t1 }]}>Activity</Text>

        {/* insights (Inspo 18) */}
        <View style={[styles.insights, { backgroundColor: colors.s1, borderColor: colors.sep }]}>
          <View style={styles.insightCol}>
            <Text style={[styles.insightLabel, { color: colors.t2 }]}>Spent</Text>
            <Text style={[styles.insightVal, { color: colors.t1 }]}>{kes(spent)}</Text>
          </View>
          <View style={[styles.divider, { backgroundColor: colors.sep }]} />
          <View style={styles.insightCol}>
            <Text style={[styles.insightLabel, { color: colors.t2 }]}>Received</Text>
            <Text style={[styles.insightVal, { color: colors.green }]}>{kes(received)}</Text>
          </View>
        </View>

        <View style={[styles.list, { backgroundColor: colors.s1, borderColor: colors.sep }]}>
          {store.txs.map((t, i) => (
            <Row key={t.id} t={t} last={i === store.txs.length - 1} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function Row({ t, last }: { t: Tx; last: boolean }) {
  const { colors } = useTheme();
  return (
    <Pressable
      onPress={() => router.push({ pathname: '/tx/[id]', params: { id: t.id } })}
      style={[styles.row, !last && { borderBottomColor: colors.sep, borderBottomWidth: 1 }]}
    >
      <View style={[styles.av, { backgroundColor: t.bg }]}>
        <Text style={[styles.avTxt, { color: t.color }]}>{t.initials}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={[styles.name, { color: colors.t1 }]}>{t.name}</Text>
        <Text style={[styles.meta, { color: colors.t2 }]}>
          {t.note ? `${t.note} · ` : ''}
          {t.date}
          {t.status === 'pending' ? ' · Pending' : ''}
        </Text>
      </View>
      <Text style={[styles.amt, { color: t.dir === 'in' ? colors.green : colors.t1 }]}>
        {t.dir === 'in' ? '+' : '−'}
        {kes(t.amount, false)}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  h1: { paddingHorizontal: space.px, paddingTop: 12, marginBottom: 16 },
  insights: { flexDirection: 'row', marginHorizontal: space.px, borderRadius: radius.card, borderWidth: 1, padding: 18, marginBottom: 16 },
  insightCol: { flex: 1, alignItems: 'center' },
  insightLabel: { fontSize: 13 },
  insightVal: { fontSize: 20, fontWeight: '700', marginTop: 4 },
  divider: { width: 1 },
  list: { marginHorizontal: space.px, borderRadius: radius.card, borderWidth: 1, overflow: 'hidden' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 13, padding: 14 },
  av: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  avTxt: { fontSize: 12, fontWeight: '800' },
  name: { fontSize: 14, fontWeight: '600' },
  meta: { fontSize: 12, marginTop: 1 },
  amt: { fontSize: 15, fontWeight: '700' },
});
