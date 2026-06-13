/**
 * Mock data store (Kenya / KES) — stands in for Supabase until the DB is
 * reachable. Mirrors the v34 `Store` shape: balance, transactions, contacts,
 * savings goals, pools. Persists to AsyncStorage so it survives reloads.
 *
 * When Supabase is wired, swap the action bodies for RPC/queries — the shapes
 * are intentionally close to the brief's schema.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

export type TxDir = 'in' | 'out';
export type TxType = 'p2p' | 'cashin' | 'cashout' | 'savings' | 'request';

export interface Tx {
  id: string;
  dir: TxDir;
  type: TxType;
  name: string;
  ztag?: string;
  initials: string;
  bg: string;
  color: string;
  amount: number;
  note?: string;
  date: string;
  status: 'completed' | 'pending' | 'failed';
}

export interface Contact {
  name: string;
  ztag: string;
  initials: string;
  bg: string;
  color: string;
}

export interface Goal {
  id: string;
  name: string;
  emoji: string;
  saved: number;
  target: number;
}

export interface Pool {
  id: string;
  name: string;
  emoji: string;
  total: number;
  target: number;
  members: number;
}

const CONTACTS: Contact[] = [
  { name: 'Sarah Ochieng', ztag: 'sarah', initials: 'SO', bg: '#A8ED78', color: '#000' },
  { name: 'Brian Otieno', ztag: 'brian', initials: 'BO', bg: '#0a84ff', color: '#fff' },
  { name: 'Aisha Mohamed', ztag: 'aisha', initials: 'AM', bg: '#bf5af2', color: '#fff' },
  { name: 'David Kamau', ztag: 'david', initials: 'DK', bg: '#ff9f0a', color: '#000' },
  { name: 'Grace Wanjiru', ztag: 'grace', initials: 'GW', bg: '#ff453a', color: '#fff' },
  { name: 'Kevin Mwangi', ztag: 'kevin', initials: 'KM', bg: '#32d74b', color: '#000' },
];

const seedTxs: Tx[] = [
  { id: 't1', dir: 'in', type: 'cashin', name: 'M-Pesa', initials: 'M', bg: '#00A651', color: '#fff', amount: 5000, note: 'Top-up', date: 'May 8', status: 'completed' },
  { id: 't2', dir: 'out', type: 'p2p', name: 'Sarah Ochieng', ztag: 'sarah', initials: 'SO', bg: '#A8ED78', color: '#000', amount: 1200, note: 'Lunch', date: 'May 7', status: 'completed' },
  { id: 't3', dir: 'in', type: 'p2p', name: 'Brian Otieno', ztag: 'brian', initials: 'BO', bg: '#0a84ff', color: '#fff', amount: 3000, note: 'Rent share', date: 'May 6', status: 'completed' },
  { id: 't4', dir: 'out', type: 'p2p', name: 'David Kamau', ztag: 'david', initials: 'DK', bg: '#ff9f0a', color: '#000', amount: 800, note: 'Boda', date: 'May 5', status: 'completed' },
];

const seedGoals: Goal[] = [
  { id: 'g1', name: 'Emergency Fund', emoji: '🛟', saved: 15000, target: 50000 },
  { id: 'g2', name: 'New Phone', emoji: '📱', saved: 8000, target: 40000 },
];

const seedPools: Pool[] = [
  { id: 'p1', name: 'Trip to Diani', emoji: '🏖️', total: 12000, target: 50000, members: 4 },
];

interface StoreState {
  balance: number;
  txs: Tx[];
  contacts: Contact[];
  goals: Goal[];
  pools: Pool[];
}

interface StoreCtx extends StoreState {
  ready: boolean;
  send: (a: { amount: number; contact: Contact; note?: string }) => void;
  request: (a: { amount: number; contact: Contact; note?: string }) => void;
  addCash: (amount: number, source?: string) => void;
  withdraw: (amount: number, dest?: string) => void;
}

const Ctx = createContext<StoreCtx | null>(null);
const KEY = 'zenti.store.v1';
const rid = () => Math.random().toString(36).slice(2, 10);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<StoreState>({
    balance: 24500,
    txs: seedTxs,
    contacts: CONTACTS,
    goals: seedGoals,
    pools: seedPools,
  });
  const [ready, setReady] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(KEY).then((v) => {
      if (v) {
        try {
          const saved = JSON.parse(v);
          setState((s) => ({ ...s, ...saved, contacts: CONTACTS }));
        } catch {}
      }
      setReady(true);
    });
  }, []);

  useEffect(() => {
    if (ready) {
      AsyncStorage.setItem(KEY, JSON.stringify({ balance: state.balance, txs: state.txs, goals: state.goals, pools: state.pools }));
    }
  }, [state, ready]);

  const value = useMemo<StoreCtx>(
    () => ({
      ...state,
      ready,
      send: ({ amount, contact, note }) =>
        setState((s) => ({
          ...s,
          balance: s.balance - amount,
          txs: [
            { id: rid(), dir: 'out', type: 'p2p', name: contact.name, ztag: contact.ztag, initials: contact.initials, bg: contact.bg, color: contact.color, amount, note, date: 'Just now', status: 'completed' },
            ...s.txs,
          ],
        })),
      request: ({ amount, contact, note }) =>
        setState((s) => ({
          ...s,
          txs: [
            { id: rid(), dir: 'in', type: 'request', name: contact.name, ztag: contact.ztag, initials: contact.initials, bg: contact.bg, color: contact.color, amount, note, date: 'Just now', status: 'pending' },
            ...s.txs,
          ],
        })),
      addCash: (amount, source = 'M-Pesa') =>
        setState((s) => ({
          ...s,
          balance: s.balance + amount,
          txs: [{ id: rid(), dir: 'in', type: 'cashin', name: source, initials: 'M', bg: '#00A651', color: '#fff', amount, note: 'Top-up', date: 'Just now', status: 'completed' }, ...s.txs],
        })),
      withdraw: (amount, dest = 'M-Pesa') =>
        setState((s) => ({
          ...s,
          balance: s.balance - amount,
          txs: [{ id: rid(), dir: 'out', type: 'cashout', name: dest, initials: 'M', bg: '#00A651', color: '#fff', amount, note: 'Withdrawal', date: 'Just now', status: 'completed' }, ...s.txs],
        })),
    }),
    [state, ready],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore(): StoreCtx {
  const c = useContext(Ctx);
  if (!c) throw new Error('useStore must be used within StoreProvider');
  return c;
}
