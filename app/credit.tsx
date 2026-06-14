import { router } from 'expo-router';
import { ChevronLeft, TrendingUp } from 'lucide-react-native';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ProgressRing } from '../components/ui/ProgressRing';
import { radius, space } from '../constants/theme';
import { useTheme } from '../lib/theme-context';

const SCORE = 712;
const MAX = 850;

const EVENTS = [
  { period: 'This month', label: 'On-time loan repayment reported', pts: 24 },
  { period: 'Last month', label: 'Credit utilization dropped', pts: 12 },
  { period: 'Mar', label: 'Zenti account opened & reported', pts: 30 },
];

export default function Credit() {
  const { colors } = useTheme();

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: colors.bg }]} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={10} style={[styles.icon, { backgroundColor: colors.s2 }]}>
          <ChevronLeft color={colors.t1} size={22} />
        </Pressable>
        <Text style={[styles.title, { color: colors.t1 }]}>Credit Score</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>
        <View style={styles.ringWrap}>
          <ProgressRing size={220} stroke={16} progress={SCORE / MAX} color={colors.green} track={colors.s3}>
            <View style={styles.delta}>
              <TrendingUp color={colors.green} size={14} />
              <Text style={[styles.deltaTxt, { color: colors.green }]}>+24 pts</Text>
            </View>
            <Text style={[styles.score, { color: colors.t1 }]}>{SCORE}</Text>
            <Text style={[styles.outOf, { color: colors.t2 }]}>of {MAX}</Text>
          </ProgressRing>
          <Text style={[styles.source, { color: colors.t3 }]}>Metropol CRB · Sample data</Text>
        </View>

        <View style={[styles.bravo, { backgroundColor: colors.gdim }]}>
          <Text style={styles.bravoEmoji}>🚀</Text>
          <Text style={[styles.bravoTxt, { color: colors.t1 }]}>
            Nice work — you've gained 24 points this month. Keep paying on time to climb faster.
          </Text>
        </View>

        <Text style={[styles.section, { color: colors.t1 }]}>Recent events</Text>
        <View style={[styles.list, { backgroundColor: colors.s1, borderColor: colors.sep }]}>
          {EVENTS.map((e, i) => (
            <View key={i} style={[styles.row, i < EVENTS.length - 1 && { borderBottomColor: colors.sep, borderBottomWidth: 1 }]}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.evLabel, { color: colors.t1 }]}>{e.label}</Text>
                <Text style={[styles.evPeriod, { color: colors.t2 }]}>{e.period}</Text>
              </View>
              <Text style={[styles.evPts, { color: colors.green }]}>↑ {e.pts}</Text>
            </View>
          ))}
        </View>
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
  delta: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  deltaTxt: { fontSize: 14, fontWeight: '700' },
  score: { fontSize: 56, fontWeight: '800', letterSpacing: -1 },
  outOf: { fontSize: 14 },
  source: { fontSize: 12, marginTop: 16 },
  bravo: { flexDirection: 'row', gap: 12, marginHorizontal: space.px, marginTop: 24, padding: 16, borderRadius: radius.card, alignItems: 'center' },
  bravoEmoji: { fontSize: 26 },
  bravoTxt: { flex: 1, fontSize: 14, lineHeight: 19 },
  section: { fontSize: 17, fontWeight: '700', paddingHorizontal: space.px, marginTop: 24, marginBottom: 12 },
  list: { marginHorizontal: space.px, borderRadius: radius.card, borderWidth: 1, overflow: 'hidden' },
  row: { flexDirection: 'row', alignItems: 'center', padding: 16 },
  evLabel: { fontSize: 14, fontWeight: '600' },
  evPeriod: { fontSize: 12, marginTop: 2 },
  evPts: { fontSize: 15, fontWeight: '700' },
});
