import { router } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { radius, space, type } from '../constants/theme';
import { kes } from '../lib/format';
import { useIsland } from '../lib/island-context';
import { useStore, type Contact } from '../lib/store';
import { useTheme } from '../lib/theme-context';

type Actionable = {
  id: string;
  kind: 'request' | 'sentlink';
  contact: Contact;
  amount: number;
  note: string;
};

const SEED: Actionable[] = [
  { id: 'n1', kind: 'request', contact: { name: 'Brian Otieno', ztag: 'brian', initials: 'BO', bg: '#0a84ff', color: '#fff' }, amount: 1500, note: 'Dinner last night' },
  { id: 'n2', kind: 'sentlink', contact: { name: 'Aisha Mohamed', ztag: 'aisha', initials: 'AM', bg: '#bf5af2', color: '#fff' }, amount: 800, note: 'Thank you!' },
];

export default function Notifications() {
  const { colors } = useTheme();
  const store = useStore();
  const island = useIsland();
  const [items, setItems] = useState<Actionable[]>(SEED);

  const act = (item: Actionable, accept: boolean) => {
    if (accept) {
      if (item.kind === 'request') {
        store.send({ amount: item.amount, contact: item.contact, note: item.note });
        island.process(`Sending ${kes(item.amount)}…`, 'Sent');
      } else {
        store.receive(item.amount, item.contact.name);
        island.process(`Receiving ${kes(item.amount)}…`, 'Received');
      }
    }
    setItems((xs) => xs.filter((x) => x.id !== item.id));
  };

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: colors.bg }]} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={10} style={[styles.icon, { backgroundColor: colors.s2 }]}>
          <ChevronLeft color={colors.t1} size={22} />
        </Pressable>
        <Text style={[styles.title, { color: colors.t1 }]}>Notifications</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>
        {items.length > 0 && <Text style={[styles.section, { color: colors.t1 }]}>Needs your action</Text>}
        {items.map((item) => (
          <View key={item.id} style={[styles.action, { backgroundColor: colors.s1, borderColor: colors.sep }]}>
            <View style={styles.actionTop}>
              <View style={[styles.av, { backgroundColor: item.contact.bg }]}>
                <Text style={[styles.avTxt, { color: item.contact.color }]}>{item.contact.initials}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.actName, { color: colors.t1 }]}>
                  {item.contact.name.split(' ')[0]} {item.kind === 'request' ? 'requests' : 'sent you'} {kes(item.amount)}
                </Text>
                <Text style={[styles.actNote, { color: colors.t2 }]}>"{item.note}"</Text>
              </View>
            </View>
            <View style={styles.btns}>
              <Pressable onPress={() => act(item, false)} style={[styles.btn, { backgroundColor: colors.s3 }]}>
                <Text style={[styles.btnTxt, { color: colors.t1 }]}>Decline</Text>
              </Pressable>
              <Pressable onPress={() => act(item, true)} style={[styles.btn, { backgroundColor: colors.green }]}>
                <Text style={[styles.btnTxt, { color: '#000' }]}>{item.kind === 'request' ? 'Pay' : 'Accept'}</Text>
              </Pressable>
            </View>
          </View>
        ))}

        <Text style={[styles.section, { color: colors.t1 }]}>Recent activity</Text>
        {store.txs.slice(0, 8).map((t) => (
          <View key={t.id} style={styles.statusRow}>
            <View style={[styles.dot, { backgroundColor: t.status === 'pending' ? colors.amber : colors.green }]} />
            <Text style={[styles.statusTxt, { color: colors.t2 }]}>
              {t.dir === 'in' ? `Received ${kes(t.amount)} from ${t.name}` : `Sent ${kes(t.amount)} to ${t.name}`}
              {t.status === 'pending' ? ' · pending' : ''}
            </Text>
            <Text style={[styles.statusDate, { color: colors.t3 }]}>{t.date}</Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: space.px, paddingTop: 6, paddingBottom: 8 },
  icon: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 17, fontWeight: '700' },
  section: { fontSize: 15, fontWeight: '700', paddingHorizontal: space.px, marginTop: 20, marginBottom: 12 },
  action: { marginHorizontal: space.px, marginBottom: 10, borderRadius: radius.card, borderWidth: 1, padding: 16 },
  actionTop: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  av: { width: 42, height: 42, borderRadius: 21, justifyContent: 'center', alignItems: 'center' },
  avTxt: { fontSize: 13, fontWeight: '800' },
  actName: { fontSize: 14, fontWeight: '700' },
  actNote: { fontSize: 13, marginTop: 2 },
  btns: { flexDirection: 'row', gap: 10, marginTop: 14 },
  btn: { flex: 1, height: 42, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  btnTxt: { fontSize: 14, fontWeight: '700' },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: space.px, paddingVertical: 10 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  statusTxt: { flex: 1, fontSize: 13 },
  statusDate: { fontSize: 12 },
});
