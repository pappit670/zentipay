import { router, useLocalSearchParams } from 'expo-router';
import { ChevronLeft, RotateCw } from 'lucide-react-native';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ProgressRing } from '../../components/ui/ProgressRing';
import { radius, space } from '../../constants/theme';
import { kes } from '../../lib/format';
import { useStore } from '../../lib/store';
import { useTheme } from '../../lib/theme-context';

const QUICK = [500, 1000, 5000];

export default function GoalDetail() {
  const { colors } = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const store = useStore();
  const goal = store.goals.find((g) => g.id === id);
  if (!goal) return null;

  const pct = Math.min(1, goal.saved / goal.target);
  const left = Math.max(0, goal.target - goal.saved);

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: colors.bg }]} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={10} style={[styles.icon, { backgroundColor: colors.s2 }]}>
          <ChevronLeft color={colors.t1} size={22} />
        </Pressable>
        <Text style={[styles.title, { color: colors.t1 }]}>{goal.emoji} {goal.name}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>
        <View style={styles.ringWrap}>
          <ProgressRing size={220} stroke={16} progress={pct} color={colors.green} track={colors.s3}>
            <Text style={[styles.emoji]}>{goal.emoji}</Text>
            <Text style={[styles.saved, { color: colors.t1 }]}>{kes(goal.saved)}</Text>
            <Text style={[styles.left, { color: colors.t2 }]}>{kes(left, false)} to go</Text>
          </ProgressRing>
        </View>

        <Text style={[styles.section, { color: colors.t2 }]}>Add to goal</Text>
        <View style={styles.quick}>
          {QUICK.map((q) => (
            <Pressable
              key={q}
              onPress={() => store.addToGoal(goal.id, q)}
              style={[styles.quickBtn, { backgroundColor: colors.s2 }]}
            >
              <Text style={[styles.quickTxt, { color: colors.t1 }]}>+{kes(q, false)}</Text>
            </Pressable>
          ))}
        </View>

        <Pressable onPress={() => router.push('/roundups')} style={[styles.row, { backgroundColor: colors.s1, borderColor: colors.sep }]}>
          <View style={[styles.rowIcon, { backgroundColor: colors.gdim }]}>
            <RotateCw color={colors.green} size={20} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.rowTitle, { color: colors.t1 }]}>Round-Ups</Text>
            <Text style={[styles.rowSub, { color: colors.t2 }]}>Save your spare change automatically</Text>
          </View>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: space.px, paddingTop: 6, paddingBottom: 8 },
  icon: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 17, fontWeight: '700' },
  ringWrap: { alignItems: 'center', marginTop: 20 },
  emoji: { fontSize: 26, marginBottom: 4 },
  saved: { fontSize: 32, fontWeight: '800', letterSpacing: -1 },
  left: { fontSize: 14, marginTop: 2 },
  section: { fontSize: 13, fontWeight: '600', paddingHorizontal: space.px, marginTop: 28, marginBottom: 12 },
  quick: { flexDirection: 'row', gap: 10, paddingHorizontal: space.px },
  quickBtn: { flex: 1, height: 52, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  quickTxt: { fontSize: 15, fontWeight: '700' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 14, marginHorizontal: space.px, marginTop: 16, padding: 16, borderRadius: radius.card, borderWidth: 1 },
  rowIcon: { width: 42, height: 42, borderRadius: 21, justifyContent: 'center', alignItems: 'center' },
  rowTitle: { fontSize: 15, fontWeight: '700' },
  rowSub: { fontSize: 13, marginTop: 2 },
});
