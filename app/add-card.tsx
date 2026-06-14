import { router } from 'expo-router';
import { Check, CreditCard, X } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { Easing, FadeIn, useAnimatedStyle, useSharedValue, withRepeat, withTiming, ZoomIn } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../components/ui/Button';
import { CardArt, DESIGNS } from '../components/wallet/CardArt';
import { space } from '../constants/theme';
import { useStore, type Card, type CardDesign } from '../lib/store';
import { useTheme } from '../lib/theme-context';

const W = Dimensions.get('window').width - space.px * 2;
const DESIGN_KEYS = Object.keys(DESIGNS) as CardDesign[];

const fakeCard = (design: CardDesign): Card => ({ id: 'preview', label: 'Zenti', design, last4: '0000', brand: 'VISA', frozen: false, isDefault: false });

export default function AddCard() {
  const { colors } = useTheme();
  const store = useStore();
  const [step, setStep] = useState<'pick' | 'adding' | 'done'>('pick');
  const [design, setDesign] = useState<CardDesign>('midnight');

  const pulse = useSharedValue(1);
  useEffect(() => {
    if (step === 'adding') {
      pulse.value = withRepeat(withTiming(0.55, { duration: 700, easing: Easing.inOut(Easing.ease) }), -1, true);
      const t = setTimeout(() => {
        store.addCard(design);
        setStep('done');
      }, 1900);
      return () => clearTimeout(t);
    }
  }, [step]);

  const pulseStyle = useAnimatedStyle(() => ({ opacity: pulse.value }));

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: colors.bg }]}>
      <View style={styles.header}>
        {step === 'pick' && (
          <Pressable onPress={() => router.back()} style={[styles.close, { backgroundColor: colors.s3 }]} hitSlop={10}>
            <X color={colors.t1} size={20} />
          </Pressable>
        )}
      </View>

      {step === 'pick' && (
        <ScrollView contentContainerStyle={styles.body}>
          <Text style={[styles.title, { color: colors.t1 }]}>Add a card</Text>
          <Text style={[styles.sub, { color: colors.t2 }]}>Scan or enter your card, then pick a look.</Text>

          {/* preview */}
          <View style={styles.preview}>
            <CardArt card={fakeCard(design)} width={W} />
          </View>

          {/* design carousel (Inspo 17) */}
          <Text style={[styles.choose, { color: colors.t1 }]}>Choose a design</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.swatches}>
            {DESIGN_KEYS.map((d) => (
              <Pressable
                key={d}
                onPress={() => setDesign(d)}
                style={[styles.swatch, { borderColor: design === d ? colors.green : 'transparent' }]}
              >
                <CardArt card={fakeCard(d)} width={92} />
              </Pressable>
            ))}
          </ScrollView>

          <Button label="Add to Wallet" variant="green" onPress={() => setStep('adding')} style={{ marginTop: 8 }} />
          <Pressable style={styles.manual}>
            <Text style={[styles.manualTxt, { color: colors.green }]}>Enter details manually</Text>
          </Pressable>
        </ScrollView>
      )}

      {step === 'adding' && (
        <View style={styles.center}>
          <Animated.View style={pulseStyle}>
            <CardArt card={fakeCard(design)} width={W * 0.8} />
          </Animated.View>
          <View style={styles.addingRow}>
            <ActivityIndicator color={colors.green} />
            <Text style={[styles.addingTxt, { color: colors.t1 }]}>Adding to Wallet…</Text>
          </View>
          <Text style={[styles.encrypt, { color: colors.t2 }]}>Encrypting & adding securely</Text>
        </View>
      )}

      {step === 'done' && (
        <View style={styles.center}>
          <Animated.View entering={ZoomIn.duration(400)} style={[styles.check, { backgroundColor: colors.green }]}>
            <Check color="#000" size={44} strokeWidth={3} />
          </Animated.View>
          <Animated.Text entering={FadeIn.delay(150)} style={[styles.doneTitle, { color: colors.t1 }]}>
            Card activated
          </Animated.Text>
          <Animated.View entering={FadeIn.delay(300)} style={styles.donePreview}>
            <CardArt card={fakeCard(design)} width={W * 0.7} />
          </Animated.View>
          <View style={styles.doneFooter}>
            <Button label="Done" variant="green" onPress={() => router.back()} icon={<CreditCard color="#000" size={18} />} />
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: { paddingHorizontal: space.px, paddingTop: 6, minHeight: 42 },
  close: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
  body: { paddingHorizontal: space.px, paddingBottom: 24 },
  title: { fontSize: 30, fontWeight: '800', letterSpacing: -0.5 },
  sub: { fontSize: 15, marginTop: 6 },
  preview: { marginTop: 24, alignItems: 'center' },
  choose: { fontSize: 16, fontWeight: '700', marginTop: 28, marginBottom: 12 },
  swatches: { gap: 12, paddingBottom: 8 },
  swatch: { borderRadius: 12, borderWidth: 2, padding: 3 },
  manual: { alignItems: 'center', paddingVertical: 14 },
  manualTxt: { fontSize: 14, fontWeight: '600' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: space.px, gap: 20 },
  addingRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 16 },
  addingTxt: { fontSize: 18, fontWeight: '700' },
  encrypt: { fontSize: 13 },
  check: { width: 88, height: 88, borderRadius: 44, justifyContent: 'center', alignItems: 'center' },
  doneTitle: { fontSize: 24, fontWeight: '800' },
  donePreview: { marginTop: 8 },
  doneFooter: { alignSelf: 'stretch', marginTop: 12 },
});
