import { router, useLocalSearchParams } from 'expo-router';
import { ChevronLeft, ChevronRight, Copy, Lock, LockOpen, Settings, Star, TrendingUp } from 'lucide-react-native';
import { Dimensions, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CardArt } from '../../components/wallet/CardArt';
import { radius, space } from '../../constants/theme';
import { kes } from '../../lib/format';
import { useIsland } from '../../lib/island-context';
import { useStore } from '../../lib/store';
import { useTheme } from '../../lib/theme-context';

const WIDTH = Dimensions.get('window').width - space.px * 2;

const PERKS = [
  { m: 'Naivas', off: '5%' },
  { m: 'Java House', off: '10%' },
  { m: 'Quickmart', off: '7%' },
];

export default function CardDetail() {
  const { colors } = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const store = useStore();
  const island = useIsland();
  const card = store.cards.find((c) => c.id === id);

  if (!card) return null;

  const copy = () => {
    island.set('success', { text: `Copied •• ${card.last4}` });
    setTimeout(() => island.set('idle'), 1500);
  };

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: colors.bg }]} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={10} style={[styles.icon, { backgroundColor: colors.s2 }]}>
          <ChevronLeft color={colors.t1} size={22} />
        </Pressable>
        <Text style={[styles.title, { color: colors.t1 }]}>{card.label}</Text>
        <Pressable style={[styles.icon, { backgroundColor: colors.s2 }]}>
          <Settings color={colors.t1} size={20} />
        </Pressable>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>
        <View style={styles.cardWrap}>
          <CardArt card={card} width={WIDTH} />
        </View>

        {/* primary actions */}
        <View style={styles.actions}>
          <Pressable
            onPress={() => store.toggleFreeze(card.id)}
            style={[styles.actionBtn, { backgroundColor: card.frozen ? colors.green : colors.s2 }]}
          >
            {card.frozen ? <LockOpen color="#000" size={18} /> : <Lock color={colors.t1} size={18} />}
            <Text style={[styles.actionTxt, { color: card.frozen ? '#000' : colors.t1 }]}>
              {card.frozen ? 'Unfreeze' : 'Freeze'}
            </Text>
          </Pressable>
          <Pressable onPress={copy} style={[styles.actionBtn, { backgroundColor: colors.s2 }]}>
            <Copy color={colors.t1} size={18} />
            <Text style={[styles.actionTxt, { color: colors.t1 }]}>•• {card.last4}</Text>
          </Pressable>
        </View>

        {/* menu rows */}
        <View style={[styles.menu, { backgroundColor: colors.s1, borderColor: colors.sep }]}>
          <MenuRow icon={<TrendingUp color={colors.green} size={20} />} label="Credit score" onPress={() => router.push('/credit')} />
          {!card.isDefault && (
            <MenuRow icon={<Star color={colors.amber} size={20} />} label="Set as default" onPress={() => store.setDefaultCard(card.id)} />
          )}
          <MenuRow icon={<Settings color={colors.t2} size={20} />} label="Card settings" last />
        </View>

        {/* perks slot (Inspo 9) */}
        <Text style={[styles.section, { color: colors.t1 }]}>Perks</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.perks}>
          {PERKS.map((p) => (
            <View key={p.m} style={[styles.perk, { backgroundColor: colors.s1, borderColor: colors.sep }]}>
              <Text style={[styles.perkOff, { color: colors.green }]}>{p.off} off</Text>
              <Text style={[styles.perkM, { color: colors.t2 }]}>{p.m}</Text>
            </View>
          ))}
        </ScrollView>

        {/* spending (Inspo 18 per-card) */}
        <Text style={[styles.section, { color: colors.t1 }]}>Spending this month</Text>
        <View style={[styles.spend, { backgroundColor: colors.s1, borderColor: colors.sep }]}>
          <Text style={[styles.spendVal, { color: colors.t1 }]}>{kes(8400)}</Text>
          <View style={[styles.bar, { backgroundColor: colors.s3 }]}>
            <View style={[styles.fill, { backgroundColor: colors.green, width: '56%' }]} />
          </View>
          <Text style={[styles.spendMeta, { color: colors.t2 }]}>56% of your KES 15,000 limit</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function MenuRow({ icon, label, onPress, last }: { icon: React.ReactNode; label: string; onPress?: () => void; last?: boolean }) {
  const { colors } = useTheme();
  return (
    <Pressable onPress={onPress} style={[styles.menuRow, !last && { borderBottomColor: colors.sep, borderBottomWidth: 1 }]}>
      {icon}
      <Text style={[styles.menuLabel, { color: colors.t1 }]}>{label}</Text>
      <ChevronRight color={colors.t3} size={18} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: space.px, paddingTop: 6, paddingBottom: 8 },
  icon: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 17, fontWeight: '700' },
  cardWrap: { paddingHorizontal: space.px, marginTop: 8 },
  actions: { flexDirection: 'row', gap: 12, paddingHorizontal: space.px, marginTop: 18 },
  actionBtn: { flex: 1, height: 50, borderRadius: 14, flexDirection: 'row', gap: 8, justifyContent: 'center', alignItems: 'center' },
  actionTxt: { fontSize: 15, fontWeight: '700' },
  menu: { marginHorizontal: space.px, marginTop: 18, borderRadius: radius.card, borderWidth: 1, overflow: 'hidden' },
  menuRow: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 16 },
  menuLabel: { flex: 1, fontSize: 15, fontWeight: '600' },
  section: { fontSize: 17, fontWeight: '700', paddingHorizontal: space.px, marginTop: 24, marginBottom: 12 },
  perks: { gap: 12, paddingHorizontal: space.px },
  perk: { width: 120, borderRadius: 16, borderWidth: 1, padding: 14 },
  perkOff: { fontSize: 16, fontWeight: '800' },
  perkM: { fontSize: 13, marginTop: 4 },
  spend: { marginHorizontal: space.px, borderRadius: radius.card, borderWidth: 1, padding: 18 },
  spendVal: { fontSize: 26, fontWeight: '800' },
  bar: { height: 8, borderRadius: 4, marginTop: 12, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: 4 },
  spendMeta: { fontSize: 13, marginTop: 8 },
});
