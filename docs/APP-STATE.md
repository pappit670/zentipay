# Zenti App — State Snapshot (parked 2026-06-14)

> **Status: PARKED.** Per the owner, app work is paused; website work continues.
> **Source of truth for app design:** `docs/zenti-v34.html` (264K prototype, untouched — last edited 2026-06-13).
> Nothing in the app source (`app/`, `components/`, `lib/`, `constants/`) was changed during the website/deploy work.

## What this is
Zenti — a Kenyan mobile payments + business finance app. Expo / React Native (expo-router),
TypeScript. Currency KES, M-Pesa context, Kenyan names/contacts. Aesthetic: Apple-Wallet precision
+ Cash App simplicity, dark, Inter, green `#66E31A` as a functional accent only.

## Architecture map

### Routes (`app/`)
- **Onboarding** (`app/onboarding/`): `index` (mesh entry) → `phone` → `otp` → `dob` (wheel picker) → `identity` (@ztag + pic) → `welcome`
- **Tabs** (`app/(tabs)/`): `index` (home/balance), `pay`, `savings`, `wallet`, `activity`
- **Flows / modals**: `pay`, `success`, `create` (goal/pool/split unified), `roundups`, `link` (money-link create), `claim` (Apple-style receive), `add-card`, `qr`, `notifications`, `profile`, `credit` (score ring)
- **Dynamic routes**: `card/[id]`, `goal/[id]`, `tx/[id]`

### Components (`components/`)
- `DynamicIsland.tsx`, `Screen.tsx`
- `pay/Numpad.tsx` (numpad + ops)
- `wallet/CardArt.tsx`, `wallet/WalletDeck.tsx` (Apple-Wallet deck physics)
- `ui/`: `Button`, `MeshGradient`, `OtpInput`, `ProgressRing`, `SegmentedProgress`, `StepHeader`, `Stepper`, `SwipeToConfirm`, `WheelPicker`

### State / libs (`lib/`)
- `store.tsx` — main app state (balance, tx, goals, etc.); mock-backed, shapes match Supabase
- `auth-context.tsx`, `onboarding-context.tsx`, `onboarding-store.ts`, `island-context.tsx`, `theme-context.tsx`
- `supabase.ts` — client reads `EXPO_PUBLIC_SUPABASE_URL` / `_ANON_KEY`; auth storage = AsyncStorage
- `format.ts`, `haptics.ts`
- `constants/theme.ts`, `constants/motion.ts`

## Build status (phases 1–8 complete)
1. Onboarding 2. Home + Pay (numpad/rails/swipe, Dynamic Island) 3. Wallet (deck physics, card detail, credit ring)
4. Savings/Pools/Split (unified create, round-ups) 5. Money-links (create/preview/share + claim screen)
6. Notifications/Profile/Transaction detail 7. QR + add-card 8. Polish (steppers, empty states)

## Pending / next time
- **Wire Supabase**: swap mock store bodies for real queries (shapes already match). Apply `money_links` migration (not yet written).
- **Real OTP / payment processor / CRB credit data** — currently stubbed with `TODO`s.
- **Bespoke card art & illustrations** (programmatic placeholders in place).
- Native gesture polish; EAS build/publish.

## Web-deploy note (separate from native app)
- For Vercel we added 3 web-only deps (`react-dom`, `react-native-web`, `@expo/metro-runtime`) and a `vercel.json`.
- These DO NOT affect the native iOS/Android app — only used when building for web.
- The app rendered via `react-native-web` looks rough in a browser (native components don't map 1:1 to HTML). That is a *rendering target* artifact, NOT an edit to the app. Revisit later if a polished web build is wanted.

## Run it
```bash
npm install
npx expo start      # scan with Expo Go
```
`.env` holds the Supabase public keys (safe — anon key + URL, protected by RLS).
