import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../../components/ui/Button';
import { StepHeader } from '../../components/ui/StepHeader';
import { WheelPicker } from '../../components/ui/WheelPicker';
import { space, type } from '../../constants/theme';
import { draft } from '../../lib/onboarding-store';
import { useTheme } from '../../lib/theme-context';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAYS = Array.from({ length: 31 }, (_, i) => String(i + 1));
const THIS_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 90 }, (_, i) => String(THIS_YEAR - i));

export default function DobStep() {
  const { colors } = useTheme();
  const [m, setM] = useState(0);
  const [d, setD] = useState(0);
  const [y, setY] = useState(25);

  const confirm = () => {
    draft.dob = { month: m + 1, day: d + 1, year: Number(YEARS[y]) };
    router.push('/onboarding/identity');
  };

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: colors.bg }]} edges={['top']}>
      <StepHeader total={5} index={2} />
      <View style={styles.body}>
        <Text style={[type.h1, { color: colors.t1 }]}>Select your{'\n'}date of birth</Text>
        <Text style={styles.cake}>🎂</Text>
        <View style={styles.wheels}>
          <WheelPicker items={MONTHS} index={m} onChange={setM} width={110} />
          <WheelPicker items={DAYS} index={d} onChange={setD} width={70} />
          <WheelPicker items={YEARS} index={y} onChange={setY} width={90} />
        </View>
        <View style={{ flex: 1 }} />
        <Text style={[styles.privacy, { color: colors.t3 }]}>
          We use this to personalize Zenti. Your info stays private.
        </Text>
        <Button label="Confirm" variant="green" onPress={confirm} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  body: { flex: 1, paddingHorizontal: space.px, paddingTop: 28, paddingBottom: 16 },
  cake: { fontSize: 40, textAlign: 'center', marginTop: 24 },
  wheels: { flexDirection: 'row', justifyContent: 'center', gap: 10, marginTop: 16 },
  privacy: { fontSize: 12, textAlign: 'center', marginBottom: 14 },
});
