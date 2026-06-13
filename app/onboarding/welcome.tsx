import { router } from 'expo-router';
import { ArrowUpRight, PiggyBank, Users } from 'lucide-react-native';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../../components/ui/Button';
import { space, type } from '../../constants/theme';
import { useOnboarding } from '../../lib/onboarding-context';
import { draft } from '../../lib/onboarding-store';
import { useTheme } from '../../lib/theme-context';

const HIGHLIGHTS = [
  { Icon: ArrowUpRight, title: 'Send & Request', sub: 'Pay anyone in seconds by $ztag, QR, or tap.' },
  { Icon: PiggyBank, title: 'Save without thinking', sub: 'Round-ups and perks auto-save into your goals.' },
  { Icon: Users, title: 'Split & Pool together', sub: 'Share bills, gifts, and goals with friends.' },
];

export default function WelcomeStep() {
  const { colors } = useTheme();
  const { complete } = useOnboarding();

  const finish = async () => {
    await complete();
    router.replace('/');
  };

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: colors.bg }]}>
      <View style={styles.body}>
        <Animated.Text entering={FadeInDown.duration(600)} style={[type.h1, styles.title, { color: colors.t1 }]}>
          Welcome to Zenti{draft.name ? `,\n${draft.name.split(' ')[0]}` : ''}
        </Animated.Text>

        <View style={styles.list}>
          {HIGHLIGHTS.map(({ Icon, title, sub }, i) => (
            <Animated.View key={title} entering={FadeInDown.delay(200 + i * 120).duration(500)} style={styles.row}>
              <View style={[styles.iconCircle, { backgroundColor: colors.gdim }]}>
                <Icon color={colors.green} size={24} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.rowTitle, { color: colors.t1 }]}>{title}</Text>
                <Text style={[styles.rowSub, { color: colors.t2 }]}>{sub}</Text>
              </View>
            </Animated.View>
          ))}
        </View>

        <View style={{ flex: 1 }} />
        <Button label="Get started" variant="green" onPress={finish} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  body: { flex: 1, paddingHorizontal: space.px, paddingTop: 24, paddingBottom: 16 },
  title: { fontSize: 40, marginTop: 24 },
  list: { gap: 28, marginTop: 48 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  iconCircle: { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center' },
  rowTitle: { fontSize: 17, fontWeight: '700' },
  rowSub: { fontSize: 14, marginTop: 2, lineHeight: 19 },
});
