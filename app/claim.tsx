import { router, useLocalSearchParams } from 'expo-router';
import { ShieldCheck } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { space } from '../constants/theme';
import { kes } from '../lib/format';
import { useIsland } from '../lib/island-context';
import { useStore } from '../lib/store';
import { useTheme } from '../lib/theme-context';

/**
 * Money-link claim / receive screen (Inspo 5). Dark, big amount, sender + trust
 * row. `type=send` → Decline/Accept; `type=request` → Decline/Pay.
 */
export default function Claim() {
  const { colors } = useTheme();
  const store = useStore();
  const island = useIsland();
  const { type, amount, note, from } = useLocalSearchParams<{ type: string; amount: string; note: string; from: string }>();
  const amt = Number(amount) || 0;
  const sender = from || 'Zenti User';
  const isSend = type === 'send';

  const accept = () => {
    if (isSend) {
      store.receive(amt, sender);
      island.process(`Receiving ${kes(amt)}…`, 'Received');
      router.replace({ pathname: '/success', params: { type: 'received', amount: String(amt), name: sender } });
    } else {
      store.send({ amount: amt, contact: { name: sender, ztag: '', initials: (sender[0] ?? 'Z').toUpperCase(), bg: '#A8ED78', color: '#000' }, note: note });
      island.process(`Sending ${kes(amt)}…`, 'Sent');
      router.replace({ pathname: '/success', params: { type: 'sent', amount: String(amt), name: sender } });
    }
  };

  return (
    <View style={styles.root}>
      <SafeAreaView style={styles.safe}>
        <View style={styles.body}>
          <Animated.Text entering={FadeIn.duration(500)} style={styles.from}>
            {isSend ? `${sender} sent you` : `${sender} requests`}
          </Animated.Text>
          <Animated.Text entering={FadeInDown.duration(600)} style={styles.amount}>
            {kes(amt)}
          </Animated.Text>
          {!!note && <Animated.Text entering={FadeIn.delay(200)} style={styles.note}>"{note}"</Animated.Text>}

          <Animated.View entering={FadeIn.delay(350)} style={styles.trust}>
            <ShieldCheck color="#32d74b" size={15} />
            <Text style={styles.trustTxt}>New contact · expires in 7 days</Text>
          </Animated.View>
        </View>

        <View style={styles.footer}>
          <View style={styles.btns}>
            <Pressable onPress={() => router.back()} style={[styles.btn, styles.decline]}>
              <Text style={styles.declineTxt}>Decline</Text>
            </Pressable>
            <Pressable onPress={accept} style={[styles.btn, styles.accept]}>
              <Text style={styles.acceptTxt}>{isSend ? 'Accept' : 'Pay'}</Text>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#050505' },
  safe: { flex: 1 },
  body: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: space.px },
  from: { color: 'rgba(255,255,255,0.6)', fontSize: 16 },
  amount: { color: '#fff', fontSize: 64, fontWeight: '800', letterSpacing: -2, marginTop: 10, textShadowColor: 'rgba(120,200,255,0.35)', textShadowRadius: 18 },
  note: { color: 'rgba(255,255,255,0.7)', fontSize: 17, fontStyle: 'italic', marginTop: 14 },
  trust: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 22 },
  trustTxt: { color: 'rgba(255,255,255,0.5)', fontSize: 13 },
  footer: { paddingHorizontal: space.px, paddingBottom: 16 },
  btns: { flexDirection: 'row', gap: 12 },
  btn: { flex: 1, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center' },
  decline: { backgroundColor: 'rgba(255,255,255,0.12)' },
  declineTxt: { color: '#fff', fontSize: 16, fontWeight: '700' },
  accept: { backgroundColor: '#fff' },
  acceptTxt: { color: '#000', fontSize: 16, fontWeight: '700' },
});
