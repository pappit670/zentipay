import { router } from 'expo-router';
import {
  ArrowDownLeft,
  ArrowUpRight,
  Bell,
  Eye,
  EyeOff,
  Plus,
  Scissors,
  Search,
  Target,
  Users,
} from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { radius, space } from '../../constants/theme';
import { kes } from '../../lib/format';
import { useIsland } from '../../lib/island-context';
import { draft } from '../../lib/onboarding-store';
import { useStore, type Tx } from '../../lib/store';
import { useTheme } from '../../lib/theme-context';

export default function Home() {
  const { colors } = useTheme();
  const store = useStore();
  const island = useIsland();
  const [hidden, setHidden] = useState(false);

  const name = draft.name?.split(' ')[0] ?? 'there';
  const initials = (draft.name?.[0] ?? 'Z').toUpperCase();

  const addMoney = () => {
    store.addCash(5000);
    island.process('Adding KES 5,000…', 'Added');
  };

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: colors.bg }]} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>
        {/* header */}
        <View style={styles.header}>
          <View style={[styles.avatar, { backgroundColor: colors.green }]}>
            <Text style={styles.avatarTxt}>{initials}</Text>
          </View>
          <Text style={[styles.hi, { color: colors.t1 }]}>Hey, {name}</Text>
          <View style={{ flex: 1 }} />
          <Pressable style={[styles.iconBtn, { backgroundColor: colors.s2 }]}>
            <Search color={colors.t1} size={20} />
          </Pressable>
          <Pressable style={[styles.iconBtn, { backgroundColor: colors.s2 }]}>
            <Bell color={colors.t1} size={20} />
            <View style={[styles.badge, { backgroundColor: colors.red, borderColor: colors.bg }]} />
          </Pressable>
        </View>

        {/* balance */}
        <View style={[styles.balCard, { backgroundColor: colors.s1, borderColor: colors.sep }]}>
          <Pressable style={styles.balLabel} onPress={() => setHidden((h) => !h)}>
            <Text style={[styles.balLabelTxt, { color: colors.t2 }]}>Total balance</Text>
            {hidden ? <EyeOff color={colors.t2} size={14} /> : <Eye color={colors.t2} size={14} />}
          </Pressable>
          <Text style={[styles.balVal, { color: colors.t1 }]}>{hidden ? 'KES ••••••' : kes(store.balance)}</Text>

          <View style={styles.actions}>
            <Action icon={<Plus color="#000" size={20} />} label="Add" onPress={addMoney} primary />
            <Action icon={<ArrowUpRight color={colors.t1} size={20} />} label="Send" onPress={() => router.push('/pay')} />
            <Action icon={<ArrowDownLeft color={colors.t1} size={20} />} label="Request" onPress={() => router.push('/pay')} />
          </View>
        </View>

        {/* features (Inspo 11 entry points) */}
        <View style={styles.features}>
          <Feature icon={<Target color={colors.green} size={20} />} label="Goal" onPress={() => router.push('/savings')} />
          <Feature icon={<Users color={colors.blue} size={20} />} label="Pool" onPress={() => router.push('/savings')} />
          <Feature icon={<Scissors color={colors.purple} size={20} />} label="Split" onPress={() => router.push('/pay')} />
        </View>

        {/* recent activity */}
        <View style={styles.sectionHead}>
          <Text style={[styles.sectionTitle, { color: colors.t1 }]}>Recent</Text>
          <Pressable onPress={() => router.push('/activity')}>
            <Text style={[styles.seeAll, { color: colors.green }]}>See all</Text>
          </Pressable>
        </View>
        <View style={[styles.txCard, { backgroundColor: colors.s1, borderColor: colors.sep }]}>
          {store.txs.slice(0, 5).map((t, i) => (
            <TxRow key={t.id} t={t} last={i === Math.min(4, store.txs.length - 1)} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function Action({ icon, label, onPress, primary }: { icon: React.ReactNode; label: string; onPress: () => void; primary?: boolean }) {
  const { colors } = useTheme();
  return (
    <Pressable style={styles.action} onPress={onPress}>
      <View style={[styles.actionCircle, { backgroundColor: primary ? colors.green : colors.s3 }]}>{icon}</View>
      <Text style={[styles.actionLabel, { color: colors.t2 }]}>{label}</Text>
    </Pressable>
  );
}

function Feature({ icon, label, onPress }: { icon: React.ReactNode; label: string; onPress: () => void }) {
  const { colors } = useTheme();
  return (
    <Pressable style={[styles.feature, { backgroundColor: colors.s1, borderColor: colors.sep }]} onPress={onPress}>
      {icon}
      <Text style={[styles.featureLabel, { color: colors.t1 }]}>{label}</Text>
    </Pressable>
  );
}

function TxRow({ t, last }: { t: Tx; last: boolean }) {
  const { colors } = useTheme();
  return (
    <View style={[styles.txRow, !last && { borderBottomColor: colors.sep, borderBottomWidth: 1 }]}>
      <View style={[styles.txAv, { backgroundColor: t.bg }]}>
        <Text style={[styles.txAvTxt, { color: t.color }]}>{t.initials}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={[styles.txName, { color: colors.t1 }]}>{t.name}</Text>
        <Text style={[styles.txMeta, { color: colors.t2 }]}>
          {t.note ? `${t.note} · ` : ''}
          {t.date}
        </Text>
      </View>
      <Text style={[styles.txAmt, { color: t.dir === 'in' ? colors.green : colors.t1 }]}>
        {t.dir === 'in' ? '+' : '−'}
        {kes(t.amount, false)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: space.px, paddingTop: 8, paddingBottom: 16 },
  avatar: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
  avatarTxt: { fontSize: 15, fontWeight: '800', color: '#000' },
  hi: { fontSize: 17, fontWeight: '700' },
  iconBtn: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  badge: { position: 'absolute', top: 8, right: 9, width: 9, height: 9, borderRadius: 5, borderWidth: 1.5 },
  balCard: { marginHorizontal: space.px, borderRadius: radius.card, borderWidth: 1, padding: 20 },
  balLabel: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  balLabelTxt: { fontSize: 13, fontWeight: '500' },
  balVal: { fontSize: 38, fontWeight: '800', letterSpacing: -1, marginTop: 6 },
  actions: { flexDirection: 'row', gap: 24, marginTop: 20 },
  action: { alignItems: 'center', gap: 7 },
  actionCircle: { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center' },
  actionLabel: { fontSize: 12, fontWeight: '500' },
  features: { flexDirection: 'row', gap: 10, paddingHorizontal: space.px, marginTop: 16 },
  feature: { flex: 1, height: 64, borderRadius: 16, borderWidth: 1, justifyContent: 'center', alignItems: 'center', gap: 5 },
  featureLabel: { fontSize: 12, fontWeight: '600' },
  sectionHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: space.px, marginTop: 24, marginBottom: 10 },
  sectionTitle: { fontSize: 18, fontWeight: '700' },
  seeAll: { fontSize: 14, fontWeight: '600' },
  txCard: { marginHorizontal: space.px, borderRadius: radius.card, borderWidth: 1, overflow: 'hidden' },
  txRow: { flexDirection: 'row', alignItems: 'center', gap: 13, padding: 14 },
  txAv: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  txAvTxt: { fontSize: 12, fontWeight: '800' },
  txName: { fontSize: 14, fontWeight: '600' },
  txMeta: { fontSize: 12, marginTop: 1 },
  txAmt: { fontSize: 15, fontWeight: '700' },
});
