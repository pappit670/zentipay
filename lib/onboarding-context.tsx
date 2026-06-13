/**
 * Tracks whether the user has finished onboarding. Backed by AsyncStorage but
 * exposed as React state so the route guard (app/_layout) redirects reactively.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

const KEY = 'zenti.onboarded';

interface OnboardingCtx {
  /** null = still loading from storage */
  onboarded: boolean | null;
  complete: () => Promise<void>;
  reset: () => Promise<void>;
}

const Ctx = createContext<OnboardingCtx | null>(null);

export function OnboardingProvider({ children }: { children: React.ReactNode }) {
  const [onboarded, setOnboarded] = useState<boolean | null>(null);

  useEffect(() => {
    AsyncStorage.getItem(KEY).then((v) => setOnboarded(v === '1'));
  }, []);

  const value = useMemo<OnboardingCtx>(
    () => ({
      onboarded,
      complete: async () => {
        await AsyncStorage.setItem(KEY, '1');
        setOnboarded(true);
      },
      reset: async () => {
        await AsyncStorage.removeItem(KEY);
        setOnboarded(false);
      },
    }),
    [onboarded],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useOnboarding(): OnboardingCtx {
  const c = useContext(Ctx);
  if (!c) throw new Error('useOnboarding must be used within OnboardingProvider');
  return c;
}
