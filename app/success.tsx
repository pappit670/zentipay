import { router, useLocalSearchParams } from 'expo-router';
import { Check } from 'lucide-react-native';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, ZoomIn } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../components/ui/Button';
import { space } from '../constants/theme';
import { kes } from '../lib/format';
import { useTheme } from '../lib/theme-context';

/** Shared success screen (Inspo 13) — one template, content driven by `type`. */
export default function Success() {
  const { colors } = useTheme();
  const { type, amount, name } = useLocalSearchParams<{ type: string; amount: string; name: string }>();
  const amt = Number(amount) || 0;
  const first = (name ?? '').split(' ')[0];

  const title =
    type === 'requested' ? `Request sent for\n${kes(amt)}` : `You sent ${kes(amt)}\nto ${first}`;
  const sub = type === 'requested' ? "They'll get a notification" : 'Delivered instantly · No fees';

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: colors.bg }]}>
      <View style={styles.body}>
        <Animated.View entering={ZoomIn.duration(400)} style={[styles.check, { backgroundColor: colors.green }]}>
          <Check color="#000" size={44} strokeWidth={3} />
        </Animated.View>
        <Animated.Text entering={FadeIn.delay(150).duration(500)} style={[styles.title, { color: colors.t1 }]}>
          {title}
        </Animated.Text>
        <Animated.Text entering={FadeIn.delay(300).duration(500)} style={[styles.sub, { color: colors.t2 }]}>
          {sub}
        </Animated.Text>
      </View>
      <View style={styles.footer}>
        <Button label="Done" variant="green" onPress={() => router.replace('/')} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  body: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: space.px, gap: 20 },
  check: { width: 88, height: 88, borderRadius: 44, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 28, fontWeight: '800', textAlign: 'center', lineHeight: 34 },
  sub: { fontSize: 15, textAlign: 'center' },
  footer: { paddingHorizontal: space.px, paddingBottom: 16 },
});
