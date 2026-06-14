import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { OtpInput } from '../../components/ui/OtpInput';
import { StepHeader } from '../../components/ui/StepHeader';
import { space, type } from '../../constants/theme';
import { draft } from '../../lib/onboarding-store';
import { useTheme } from '../../lib/theme-context';

export default function OtpStep() {
  const { colors } = useTheme();

  // TODO: real verification via supabase.auth.verifyOtp once the DB is reachable.
  const onComplete = (_code: string) => {
    router.push('/onboarding/dob');
  };

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: colors.bg }]} edges={['top']}>
      <StepHeader total={5} index={1} />
      <View style={styles.body}>
        <Text style={[type.h1, { color: colors.t1 }]}>Enter the code</Text>
        <Text style={[styles.sub, { color: colors.t2 }]}>Sent to {draft.contact || 'your number'}</Text>
        <View style={{ height: 28 }} />
        <OtpInput length={6} onComplete={onComplete} />
        <Text style={[styles.help, { color: colors.green }]}>Resend code</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  body: { flex: 1, paddingHorizontal: space.px, paddingTop: 28 },
  sub: { fontSize: 15, marginTop: 8 },
  help: { fontSize: 14, fontWeight: '600', marginTop: 24 },
});
