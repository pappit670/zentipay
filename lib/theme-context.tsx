/**
 * Theme context — dark default, with a light toggle (Profile › Appearance).
 * Persists the choice; exposes the active palette via `useTheme()`.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { palettes, type Palette, type ThemeName } from '../constants/theme';

const KEY = 'zenti.theme';

interface ThemeCtx {
  name: ThemeName;
  colors: Palette;
  setTheme: (t: ThemeName) => void;
  toggle: () => void;
}

const Ctx = createContext<ThemeCtx | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [name, setName] = useState<ThemeName>('dark');

  useEffect(() => {
    AsyncStorage.getItem(KEY).then((v) => {
      if (v === 'light' || v === 'dark') setName(v);
    });
  }, []);

  const setTheme = (t: ThemeName) => {
    setName(t);
    AsyncStorage.setItem(KEY, t);
  };

  const value = useMemo<ThemeCtx>(
    () => ({
      name,
      colors: palettes[name],
      setTheme,
      toggle: () => setTheme(name === 'dark' ? 'light' : 'dark'),
    }),
    [name],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useTheme(): ThemeCtx {
  const c = useContext(Ctx);
  if (!c) throw new Error('useTheme must be used within ThemeProvider');
  return c;
}
