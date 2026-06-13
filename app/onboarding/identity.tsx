import { router } from 'expo-router';
import { Camera, Check } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../../components/ui/Button';
import { StepHeader } from '../../components/ui/StepHeader';
import { radius, space, type } from '../../constants/theme';
import { draft } from '../../lib/onboarding-store';
import { useTheme } from '../../lib/theme-context';

// Mock "taken" handles until the DB check is wired.
const TAKEN = ['zenti', 'admin', 'john', 'sarah'];
const AV_COLORS = ['#32d74b', '#0a84ff', '#bf5af2', '#ff9f0a', '#ff453a'];

export default function IdentityStep() {
  const { colors } = useTheme();
  const [ztag, setZtag] = useState('');
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState(0);

  const clean = ztag.replace(/[^a-zA-Z0-9_]/g, '').toLowerCase();
  const available = clean.length >= 3 && !TAKEN.includes(clean);
  const valid = available && name.trim().length >= 2;
  const initials = useMemo(() => (name.trim() ? name.trim()[0].toUpperCase() : '?'), [name]);

  const next = () => {
    draft.ztag = clean;
    draft.name = name.trim();
    draft.avatarColor = AV_COLORS[avatar];
    router.push('/onboarding/welcome');
  };

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: colors.bg }]} edges={['top']}>
      <StepHeader total={5} index={3} />
      <KeyboardAvoidingView style={styles.body} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <Text style={[type.h1, { color: colors.t1 }]}>Make it yours</Text>

        {/* Profile picture (placeholder — real picker comes later) */}
        <Pressable style={styles.avatarWrap} onPress={() => setAvatar((a) => (a + 1) % AV_COLORS.length)}>
          <View style={[styles.avatar, { backgroundColor: AV_COLORS[avatar] }]}>
            <Text style={styles.avatarInit}>{initials}</Text>
          </View>
          <View style={[styles.camera, { backgroundColor: colors.s3, borderColor: colors.bg }]}>
            <Camera color={colors.t1} size={16} />
          </View>
        </Pressable>
        <Text style={[styles.avatarLabel, { color: colors.t2 }]}>Add a profile picture</Text>

        {/* @ztag */}
        <View style={[styles.inputRow, { backgroundColor: colors.s2, borderColor: available ? colors.green : colors.sep }]}>
          <Text style={[styles.tag, { color: colors.t2 }]}>$</Text>
          <TextInput
            value={ztag}
            onChangeText={setZtag}
            placeholder="yourtag"
            placeholderTextColor={colors.t3}
            autoCapitalize="none"
            autoCorrect={false}
            style={[styles.input, { color: colors.t1 }]}
          />
          {available && (
            <View style={[styles.checkDot, { backgroundColor: colors.green }]}>
              <Check color="#000" size={13} strokeWidth={3} />
            </View>
          )}
        </View>
        {clean.length >= 3 && !available && (
          <Text style={[styles.taken, { color: colors.red }]}>$ {clean} is taken — try another</Text>
        )}

        {/* name */}
        <View style={[styles.inputRow, { backgroundColor: colors.s2, borderColor: colors.sep }]}>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Display name"
            placeholderTextColor={colors.t3}
            style={[styles.input, { color: colors.t1 }]}
          />
        </View>

        <View style={{ flex: 1 }} />
        <Button label="Continue" variant="green" disabled={!valid} onPress={next} />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  body: { flex: 1, paddingHorizontal: space.px, paddingTop: 28, paddingBottom: 16 },
  avatarWrap: { alignSelf: 'center', marginTop: 24 },
  avatar: { width: 96, height: 96, borderRadius: 48, justifyContent: 'center', alignItems: 'center' },
  avatarInit: { fontSize: 38, fontWeight: '800', color: '#000' },
  camera: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarLabel: { textAlign: 'center', marginTop: 10, fontSize: 13 },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    height: 56,
    borderRadius: radius.btn,
    borderWidth: 1,
    paddingHorizontal: 16,
    marginTop: 18,
  },
  tag: { fontSize: 19, fontWeight: '700' },
  input: { flex: 1, fontSize: 17, height: '100%' },
  checkDot: { width: 22, height: 22, borderRadius: 11, justifyContent: 'center', alignItems: 'center' },
  taken: { fontSize: 13, marginTop: 8, marginLeft: 4 },
});
