/**
 * Dynamic Island controller (Inspo 7 / 13). Holds the live transient state and
 * exposes helpers. The visual lives in components/DynamicIsland.tsx, mounted at
 * the root so it floats over every screen.
 */
import React, { createContext, useContext, useMemo, useRef, useState } from 'react';

export type IslandState = 'idle' | 'pay-active' | 'processing' | 'success';

export interface IslandData {
  name?: string;
  initials?: string;
  bg?: string;
  color?: string;
  amount?: number;
  text?: string;
}

interface IslandCtx {
  state: IslandState;
  data: IslandData;
  set: (state: IslandState, data?: IslandData) => void;
  /** processing → success → idle, with auto timing. */
  process: (text: string, successText: string) => void;
}

const Ctx = createContext<IslandCtx | null>(null);

export function IslandProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<IslandState>('idle');
  const [data, setData] = useState<IslandData>({});
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const value = useMemo<IslandCtx>(
    () => ({
      state,
      data,
      set: (s, d = {}) => {
        setState(s);
        setData(d);
      },
      process: (text, successText) => {
        if (timer.current) clearTimeout(timer.current);
        setState('processing');
        setData({ text });
        timer.current = setTimeout(() => {
          setState('success');
          setData({ text: successText });
          timer.current = setTimeout(() => setState('idle'), 2000);
        }, 2200);
      },
    }),
    [state, data],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useIsland(): IslandCtx {
  const c = useContext(Ctx);
  if (!c) throw new Error('useIsland must be used within IslandProvider');
  return c;
}
