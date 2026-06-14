import { router } from 'expo-router';
import {
  Bell,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Fingerprint,
  Gift,
  Globe,
  HelpCircle,
  Landmark,
  LogOut,
  Moon,
  QrCode,
  Shield,
  SlidersHorizontal,
  TrendingUp,
  User,
} from 'lucide-react-native';
import { Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { radius, space } from '../constants/theme';
import { useOnboarding } from '../lib/onboarding-context';
import { draft } from '../lib/onboarding-store';
import { useTheme } from '../lib/theme-context';

export default function Profile() {
  const { colors, name, toggle } = useTheme();
  const { reset } = useOnboarding();

  const logout = async () => {
    await reset();
    router.replace('/onboarding');
  };

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: colors.bg }]} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={10} style={[styles.icon, { backgroundColor: colors.s2 }]}>
          <ChevronLeft color={colors.t1} size={22} />
        </Pressable>
        <Text style={[styles.title, { color: colors.t1 }]}>Profile</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>
        {/* profile header */}
        <View style={styles.profileHead}>
          <View style={[styles.bigAv, { backgroundColor: colors.green }]}>
            <Text style={styles.bigAvTxt}>{(draft.name?.[0] ?? 'Z').toUpperCase()}</Text>
          </View>
          <Text style={[styles.name, { color: colors.t1 }]}>{draft.name ?? 'Zenti User'}</Text>
          <Text style={[styles.tag, { color: colors.t2 }]}>${draft.ztag ?? 'you'}</Text>
          <Pressable style={[styles.qrBtn, { backgroundColor: colors.s2 }]}>
            <QrCode color={colors.t1} size={16} />
            <Text style={[styles.qrTxt, { color: colors.t1 }]}>My QR</Text>
          </Pressable>
        </View>

        <Group>
          <Row icon={<User color={colors.t1} size={20} />} label="Edit profile" />
          <Row icon={<Landmark color={colors.t1} size={20} />} label="Linked accounts" hint="M-Pesa, KCB" />
          <Row icon={<SlidersHorizontal color={colors.t1} size={20} />} label="Spending limits" />
          <Row icon={<CreditCard color={colors.t1} size={20} />} label="Round-Ups & auto-save" onPress={() => router.push('/roundups')} last />
        </Group>

        <Group>
          <Row icon={<Shield color={colors.t1} size={20} />} label="Security & PIN" />
          <Row icon={<Fingerprint color={colors.t1} size={20} />} label="Biometrics" right={<Switch value trackColor={{ true: colors.green }} />} last />
        </Group>

        <Group>
          <Row icon={<Bell color={colors.t1} size={20} />} label="Notifications" onPress={() => router.push('/notifications')} />
          <Row icon={<Moon color={colors.t1} size={20} />} label="Dark mode" right={<Switch value={name === 'dark'} onValueChange={toggle} trackColor={{ true: colors.green }} />} />
          <Row icon={<Globe color={colors.t1} size={20} />} label="Language" hint="English" last />
        </Group>

        <Group>
          <Row icon={<Gift color={colors.t1} size={20} />} label="Invite friends" />
          <Row icon={<TrendingUp color={colors.t1} size={20} />} label="Credit score" onPress={() => router.push('/credit')} />
          <Row icon={<HelpCircle color={colors.t1} size={20} />} label="Help & support" last />
        </Group>

        <Pressable onPress={logout} style={[styles.logout, { backgroundColor: colors.s1, borderColor: colors.sep }]}>
          <LogOut color={colors.red} size={20} />
          <Text style={[styles.logoutTxt, { color: colors.red }]}>Log out</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

function Group({ children }: { children: React.ReactNode }) {
  const { colors } = useTheme();
  return <View style={[styles.group, { backgroundColor: colors.s1, borderColor: colors.sep }]}>{children}</View>;
}

function Row({
  icon,
  label,
  hint,
  right,
  onPress,
  last,
}: {
  icon: React.ReactNode;
  label: string;
  hint?: string;
  right?: React.ReactNode;
  onPress?: () => void;
  last?: boolean;
}) {
  const { colors } = useTheme();
  return (
    <Pressable onPress={onPress} style={[styles.row, !last && { borderBottomColor: colors.sep, borderBottomWidth: 1 }]}>
      {icon}
      <Text style={[styles.rowLabel, { color: colors.t1 }]}>{label}</Text>
      {hint && <Text style={[styles.rowHint, { color: colors.t2 }]}>{hint}</Text>}
      {right ?? (onPress ? <ChevronRight color={colors.t3} size={18} /> : null)}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: space.px, paddingTop: 6, paddingBottom: 8 },
  icon: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 17, fontWeight: '700' },
  profileHead: { alignItems: 'center', paddingVertical: 16 },
  bigAv: { width: 84, height: 84, borderRadius: 42, justifyContent: 'center', alignItems: 'center' },
  bigAvTxt: { fontSize: 34, fontWeight: '800', color: '#000' },
  name: { fontSize: 20, fontWeight: '700', marginTop: 12 },
  tag: { fontSize: 15, marginTop: 2 },
  qrBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 16, paddingVertical: 8, borderRadius: radius.pill, marginTop: 14 },
  qrTxt: { fontSize: 14, fontWeight: '600' },
  group: { marginHorizontal: space.px, marginTop: 16, borderRadius: radius.card, borderWidth: 1, overflow: 'hidden' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 16 },
  rowLabel: { flex: 1, fontSize: 15, fontWeight: '600' },
  rowHint: { fontSize: 13, marginRight: 6 },
  logout: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, marginHorizontal: space.px, marginTop: 24, padding: 16, borderRadius: radius.card, borderWidth: 1 },
  logoutTxt: { fontSize: 15, fontWeight: '700' },
});
