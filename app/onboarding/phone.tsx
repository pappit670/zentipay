import { router } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../../components/ui/Button';
import { StepHeader } from '../../components/ui/StepHeader';
import { radius, space, type } from '../../constants/theme';
import { draft } from '../../lib/onboarding-store';
import { useTheme } from '../../lib/theme-context';

export default function PhoneStep() {
  const { colors } = useTheme();
  const [method, setMethod] = useState<'phone' | 'email'>('phone');
  const [val, setVal] = useState('');
  const valid = method === 'phone' ? val.replace(/\D/g, '').length >= 9 : /\S+@\S+\.\S+/.test(val);

  const next = () => {
    draft.method = method;
    draft.contact = method === 'phone' ? `+254 ${val}` : val;
    router.push('/onboarding/otp');
  };

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: colors.bg }]} edges={['top']}>
      <StepHeader total={5} index={0} />
      <KeyboardAvoidingView style={styles.body} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={{ flex: 1 }}>
          <Text style={[type.h1, { color: colors.t1 }]}>
            {method === 'phone' ? 'Enter your phone' : 'Enter your email'}
          </Text>
          <View style={[styles.inputRow, { backgroundColor: colors.s2, borderColor: colors.sep }]}>
            {method === 'phone' && <Text style={[styles.prefix, { color: colors.t2 }]}>+254</Text>}
            <TextInput
              autoFocus
              value={val}
              onChangeText={setVal}
              placeholder={method === 'phone' ? '712 345 678' : 'you@email.com'}
              placeholderTextColor={colors.t3}
              keyboardType={method === 'phone' ? 'phone-pad' : 'email-address'}
              autoCapitalize="none"
              style={[styles.input, { color: colors.t1 }]}
            />
          </View>
          <Text style={[styles.help, { color: colors.t2 }]}>We'll text you a code to confirm it's you.</Text>
        </View>
        <View style={styles.footer}>
          <Button
            label={method === 'phone' ? 'Use email' : 'Use phone'}
            variant="ghost"
            style={{ flex: 1 }}
            onPress={() => {
              setMethod((m) => (m === 'phone' ? 'email' : 'phone'));
              setVal('');
            }}
          />
          <Button label="Next" variant="green" style={{ flex: 1 }} disabled={!valid} onPress={next} />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  body: { flex: 1, paddingHorizontal: space.px, paddingTop: 28, paddingBottom: 16 },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    height: 56,
    borderRadius: radius.btn,
    borderWidth: 1,
    paddingHorizontal: 16,
    marginTop: 24,
  },
  prefix: { fontSize: 17, fontWeight: '600' },
  input: { flex: 1, fontSize: 17, height: '100%' },
  help: { fontSize: 13, marginTop: 14 },
  footer: { flexDirection: 'row', gap: 12 },
});
