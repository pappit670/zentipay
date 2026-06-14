import 'react-native-gesture-handler';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { DynamicIsland } from '../components/DynamicIsland';
import { AuthProvider } from '../lib/auth-context';
import { IslandProvider } from '../lib/island-context';
import { OnboardingProvider, useOnboarding } from '../lib/onboarding-context';
import { StoreProvider } from '../lib/store';
import { ThemeProvider, useTheme } from '../lib/theme-context';

function Nav() {
  const { name, colors } = useTheme();
  const { onboarded } = useOnboarding();
  const segments = useSegments();
  const router = useRouter();

  // Route guard: send users to onboarding until they've completed it.
  useEffect(() => {
    if (onboarded === null) return;
    const inOnboarding = segments[0] === 'onboarding';
    if (!onboarded && !inOnboarding) router.replace('/onboarding');
    else if (onboarded && inOnboarding) router.replace('/');
  }, [onboarded, segments]);

  return (
    <>
      <StatusBar style={name === 'dark' ? 'light' : 'dark'} />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.bg } }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="pay" options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
        <Stack.Screen name="create" options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
        <Stack.Screen name="link" options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
        <Stack.Screen name="claim" options={{ presentation: 'fullScreenModal', animation: 'slide_from_bottom' }} />
        <Stack.Screen name="success" options={{ presentation: 'modal', animation: 'slide_from_bottom', gestureEnabled: false }} />
      </Stack>
      <DynamicIsland />
    </>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <OnboardingProvider>
            <StoreProvider>
              <IslandProvider>
                <AuthProvider>
                  <Nav />
                </AuthProvider>
              </IslandProvider>
            </StoreProvider>
          </OnboardingProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
