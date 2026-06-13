import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { radius, space, type } from '../../constants/theme';
import { kes } from '../../lib/format';
import { useStore, type Goal, type Pool } from '../../lib/store';
import { useTheme } from '../../lib/theme-context';

export default function Savings() {
  const { colors } = useTheme();
  const store = useStore();
  const totalSaved = store.goals.reduce((s, g) => s + g.saved, 0);

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: colors.bg }]} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>
        <Text style={[type.h1, styles.h1, { color: colors.t1 }]}>Savings</Text>

        {/* flat landing (Inspo 10) */}
        <View style={[styles.card, { backgroundColor: colors.s1, borderColor: colors.sep }]}>
          <Text style={[styles.label, { color: colors.t2 }]}>Total saved</Text>
          <Text style={[styles.total, { color: colors.t1 }]}>{kes(totalSaved)}</Text>
          <Text style={[styles.interest, { color: colors.green }]}>Earning 6.5% p.a.</Text>
        </View>

        <Text style={[styles.section, { color: colors.t1 }]}>Goals</Text>
        {store.goals.map((g) => (
          <GoalRow key={g.id} g={g} />
        ))}

        <Text style={[styles.section, { color: colors.t1 }]}>Pools</Text>
        {store.pools.map((p) => (
          <PoolRow key={p.id} p={p} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

function GoalRow({ g }: { g: Goal }) {
  const { colors } = useTheme();
  const pct = Math.min(100, Math.round((g.saved / g.target) * 100));
  return (
    <View style={[styles.goal, { backgroundColor: colors.s1, borderColor: colors.sep }]}>
      <View style={styles.goalTop}>
        <Text style={styles.emoji}>{g.emoji}</Text>
        <View style={{ flex: 1 }}>
          <Text style={[styles.goalName, { color: colors.t1 }]}>{g.name}</Text>
          <Text style={[styles.goalMeta, { color: colors.t2 }]}>
            {kes(g.saved)} / {kes(g.target, false)}
          </Text>
        </View>
        <Text style={[styles.pct, { color: colors.green }]}>{pct}%</Text>
      </View>
      <View style={[styles.bar, { backgroundColor: colors.s3 }]}>
        <View style={[styles.fill, { backgroundColor: colors.green, width: `${pct}%` }]} />
      </View>
    </View>
  );
}

function PoolRow({ p }: { p: Pool }) {
  const { colors } = useTheme();
  const pct = Math.min(100, Math.round((p.total / p.target) * 100));
  return (
    <View style={[styles.goal, { backgroundColor: colors.s1, borderColor: colors.sep }]}>
      <View style={styles.goalTop}>
        <Text style={styles.emoji}>{p.emoji}</Text>
        <View style={{ flex: 1 }}>
          <Text style={[styles.goalName, { color: colors.t1 }]}>{p.name}</Text>
          <Text style={[styles.goalMeta, { color: colors.t2 }]}>
            {kes(p.total)} / {kes(p.target, false)} · {p.members} people
          </Text>
        </View>
        <Text style={[styles.pct, { color: colors.blue }]}>{pct}%</Text>
      </View>
      <View style={[styles.bar, { backgroundColor: colors.s3 }]}>
        <View style={[styles.fill, { backgroundColor: colors.blue, width: `${pct}%` }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  h1: { paddingHorizontal: space.px, paddingTop: 12, marginBottom: 16 },
  card: { marginHorizontal: space.px, borderRadius: radius.card, borderWidth: 1, padding: 20 },
  label: { fontSize: 13 },
  total: { fontSize: 34, fontWeight: '800', letterSpacing: -1, marginTop: 6 },
  interest: { fontSize: 13, fontWeight: '600', marginTop: 6 },
  section: { fontSize: 18, fontWeight: '700', paddingHorizontal: space.px, marginTop: 24, marginBottom: 10 },
  goal: { marginHorizontal: space.px, marginBottom: 10, borderRadius: radius.card, borderWidth: 1, padding: 16 },
  goalTop: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  emoji: { fontSize: 26 },
  goalName: { fontSize: 15, fontWeight: '600' },
  goalMeta: { fontSize: 12, marginTop: 2 },
  pct: { fontSize: 15, fontWeight: '700' },
  bar: { height: 6, borderRadius: 3, marginTop: 12, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: 3 },
});
