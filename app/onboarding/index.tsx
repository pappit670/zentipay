import { router } from 'expo-router';
import { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, FadeInUp } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../../components/ui/Button';
import { MeshGradient } from '../../components/ui/MeshGradient';
import { space } from '../../constants/theme';
import { resetDraft } from '../../lib/onboarding-store';

/** Entry — no splash. Living mesh gradient + wordmark + auth options (Inspo 14). */
export default function OnboardingEntry() {
  useEffect(() => {
    resetDraft();
  }, []);

  return (
    <MeshGradient>
      <SafeAreaView style={styles.root}>
        <View style={styles.center}>
          <Animated.Text entering={FadeIn.duration(800)} style={styles.wordmark}>
            zenti
          </Animated.Text>
          <Animated.Text entering={FadeIn.delay(300).duration(800)} style={styles.tagline}>
            Money, made effortless.
          </Animated.Text>
        </View>

        <Animated.View entering={FadeInUp.delay(450).duration(600)} style={styles.actions}>
          <Button label="Continue with Google" variant="fill" onPress={() => router.push('/onboarding/phone')} />
          <Button label="Continue with Apple" variant="fill" onPress={() => router.push('/onboarding/phone')} />
          <Button label="Use phone or email" variant="ghost" onPress={() => router.push('/onboarding/phone')} />
          <Pressable onPress={() => router.push('/onboarding/phone')} style={styles.login}>
            <Text style={styles.loginText}>
              Already have an account? <Text style={styles.loginLink}>Log in</Text>
            </Text>
          </Pressable>
        </Animated.View>
      </SafeAreaView>
    </MeshGradient>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, justifyContent: 'flex-end', paddingHorizontal: space.px, paddingBottom: 12 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  wordmark: { fontSize: 64, fontWeight: '800', color: '#fff', letterSpacing: -2 },
  tagline: { fontSize: 16, color: 'rgba(255,255,255,0.6)', marginTop: 8 },
  actions: { gap: 12 },
  login: { alignItems: 'center', paddingVertical: 12 },
  loginText: { color: 'rgba(255,255,255,0.6)', fontSize: 14 },
  loginLink: { color: '#fff', fontWeight: '700' },
});
