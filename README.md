# Zenti

A consumer P2P wallet for Kenya — send · request · save · split · pool.
*Cash App's simplicity + Apple's motion/physics.* Dark default, Inter, green `#32d74b`.

## Stack
- **Expo** (SDK 56) + **expo-router** (typed routes)
- **react-native-reanimated** v4 + **gesture-handler** — the motion/physics backbone
- **@supabase/supabase-js** — auth + data (KES, M-Pesa/KCB rails)
- **lucide-react-native**, expo-linear-gradient / blur / haptics / image

## Structure
```
app/                 expo-router routes
  _layout.tsx        root: providers + stack
  (tabs)/            Home · Activity · Pay (center) · Wallet · Savings
  pay.tsx            pay modal (core pay engine — Inspo 15)
constants/
  theme.ts           design tokens (ported 1:1 from v34)
  motion.ts          durations / springs / scales
lib/
  supabase.ts        client (env-driven)
  theme-context.tsx  dark/light
  auth-context.tsx   Supabase session
docs/
  zenti-v34.html     the prototype — SOURCE OF TRUTH
  brainstorm-notes.md design decisions & inspos (1–18)
```

## Setup
```bash
npm install
cp .env.example .env   # fill with the real Zenti Supabase project
npx expo start
```

> ⚠️ The session's Supabase connector currently points at the wrong project —
> the app reads Supabase config from `.env` so nothing is hardcoded until the
> real Zenti DB is connected.
