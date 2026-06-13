# Zenti — Brainstorm Notes
*Living scratchpad. Not a spec, not code. We capture inspos + design/UX ideas here as we talk.*
*Brand reminders: dark default · Inter · green `#32d74b` · rounded half-sheets · progress rings · Dynamic Island.*

---

## Inspo 1 — Apple-Wallet card stack (ULYS / "Cartes")  ✅ CONFIRMED
**Maps to:** `v-wallet` (+ `toggleWalletStack`), `v-card-detail`, `v-card-settings`.

**Confirmed flow:** home top-nav **wallet-card icon** → wallet page → **slide up/down** through deck → **tap a card → individual card page** (`v-card-detail`). Claude's build recs approved — go with them.

**Core mechanic (user's ask):** stacked cards, only a thin colored header band peeking per card; one card pulled full-size; whole deck slides up/down with spring snapping; center card = the default card.

**Build model (for later, not now):**
- Per-card `translateY` + `scale` driven off distance-from-active + a shared drag value (Reanimated + gesture-handler Pan).
- Two macro-states springing between **collapsed deck** (~56px peek) and **expanded/scrollable** — that toggle *is* `toggleWalletStack`.
- Snap-to-nearest on release; rubber-band at the ends so it feels physical.
- Heterogeneous deck: Zenti card (default) + added cards + transit cards.

**Design / UX add-ons (Claude):**
- **Default-card halo** — a soft green `#32d74b` ring/glow on the default card so it's identifiable at a glance even when collapsed. No need to expand to know which one pays.
- **Info on the peek band** — show last-4 or a tiny balance/last-used hint on the visible band, so collapsed cards still carry meaning (Apple shows almost nothing — we can do better).
- **Long-press quick actions** — long-press any card → radial/sheet with Set default · Freeze · Copy number, skipping a trip to detail. Cuts taps on the most common actions.
- **Drag-to-reorder** = set priority; the card you drag to center becomes a candidate default (ties into the open question below).
- **Haptic detents** — a light tick as each card snaps into the front slot. Sells the physics.
- **Frozen state visual** — desaturate + frosted overlay on a locked card, lock glyph on the band.
- **Parallax card art** — art shifts slightly against the card frame while dragging → depth.
- **Empty/first-run** — just the Zenti card + a ghost "Add card" slot beckoning beneath it.

**Open decisions:**
- "Center = default": does the default *always sit center* (visual anchor) OR does selecting slide a card *to* center? Different physics.
- Tap-to-pay/NFC always fires the **default** card regardless of what's expanded? (assume yes)
- Max cards before the deck needs internal scrolling.

---

## Inspo 2 — Tabby scan frame ("Scan your ___")  ✅ CONFIRMED
**Maps to:** `v-scan-card` / `v-manual-card`, `v-transit-id`; hands off to `v-adding-card` → `v-card-activated`.

**Confirmed decisions:**
- **OCR is required** → request **camera permission** (with a clear pre-permission rationale screen so the OS prompt isn't a surprise → higher grant rate).
- **Scan BOTH sides** — front (number, name, expiry) then flip prompt for back (we read what's needed; CVV is never stored).
- **"Add manually" button pinned at the bottom**, always ready as the fallback (covers permission-denied, scan-fail, damaged card).

**Important reframe:** Tabby's is an *Emirates ID / KYC* scan. Zenti is **no-KYC**. We borrow only the *visual language* (bracketed viewport + calm "Scan your ___" + reassurance copy + one fat button) and point it at **payment cards** and **transit cards** — never identity.

**Build model (for later):**
- One screen, two states: idle intro (illustration + Continue) → live camera *inside* the same bracket frame with edge-detect + auto-capture.
- On detect: frame snaps to green `#32d74b`, haptic, card "flies" into the wallet deck → Apple-Wallet **"Adding…"** beat. (Shared-element handoff into Inspo 1.)
- Transit reuses the exact frame, different payload (`v-transit-id`), with NFC tap as alt.

**Design / UX add-ons (Claude):**
- **Live guidance copy** that morphs: "Position your card" → "Hold steady…" → "Got it ✓". Reduces the "is it working?" anxiety.
- **Auto-capture + manual shutter fallback** — auto removes friction; shutter rescues edge cases.
- **Glare/blur nudge** — if the frame can't read, gently prompt "Reduce glare" instead of silent failure.
- **"Enter manually" always one tap away** — accessibility + camera-denied + scan-fail safety net. Never a dead end.
- **Issuer auto-theming** — on success, theme the new card's art to the detected bank's brand colors (Apple-Wallet-style). Instant delight, makes the deck look curated.
- **Reused privacy line** — keep a reassurance microcopy ("stored securely, tokenized, never your raw number") — borrows Tabby's trust beat without the KYC.
- **Dark variant** — inspo is light; we design the dark-default version of the frame (brackets glow subtly on dark).

**Open decisions:**
- Real card OCR vs. manual-first with scan as the hero option?
- NFC for transit in v1 or later?

---

## Inspo 3 — MUSH-MUSH auth entry
**Maps to:** post-splash front door — Sign up / Sign in (consumer-only, no KYC). Possibly after the value-prop carousel.

**Core mechanic:** soft drifting mesh-gradient bg, oversized centered wordmark, everything else stripped, bottom = "Already have an account? Log in" + Continue with Google / Apple pills.

**Build model (for later):**
- Animated mesh-gradient (drifting green blobs via Skia or layered blurred gradients) in Zenti green on dark.
- "Loadup" beat: splash logo settles into the wordmark, then auth pills fade up.
- Supabase OAuth: Google + native Apple sign-in (Apple required by App Store once Google is offered).

**Design / UX add-ons (Claude):**
- **Gyroscope parallax** — mesh blobs drift subtly with device tilt. Premium, alive, near-free with Reanimated sensors.
- **Returning-user fast path** — if a session/biometric exists, skip the full screen → "Welcome back, @tag" + Face ID unlock. Don't make repeat users re-pick a provider.
- **Progressive disclosure** — social-first; a quiet "Other ways" reveals phone/email OTP. Keeps the screen clean but inclusive.
- **Breathing wordmark** — micro scale/opacity loop so the screen never feels static.
- **OAuth round-trip state in the Dynamic Island** — "Signing in…" lives up top, consistent with the rest of the app's state model.
- **First-run vs. returning** — carousel only on true first run (stored flag); afterwards straight to auth.
- **Legal microcopy** pinned at the very bottom (ToS / Privacy).

**Open decisions:**
- Dark mesh w/ green blobs (Claude rec) vs. the light inspo look?
- Google + Apple only, or add phone/email OTP for reach?
- Does the value-prop carousel still sit *before* this, or is auth the first thing after splash?

---

## Inspo 4 — "Adding to Wallet…" simulation (Apple Wallet add moment)  ✅ CONFIRMED
**Maps to:** `v-adding-card` → `v-card-activated`. Fires right after a successful scan (both sides) or manual entry.

**Core mechanic:** the card art floats above the phone, dissolves into a shimmering particle/noise texture while it's "processed", with "**Adding Card** ✦ / Adding to Wallet…" + spinner. Then it resolves and the card drops into the deck.

**Build model (for later):**
- Sequence: scanned card → flip/merge → floats up → **particle shimmer (tokenizing)** → settles → **"Card activated" ✓** → shared-element drop into the wallet deck (Inspo 1).
- The shimmer is tied to the *real* tokenization round-trip (Supabase `card_tokens`), not a fake timer.

**Design / UX add-ons (Claude):**
- **Honest-but-felt timing** — bind the spinner to the actual network call; if it returns too fast, hold a ~1.2s minimum so the moment *registers* rather than flickering by.
- **Microcopy that explains the shimmer** — "Encrypting & adding…" so the particle effect reads as *securing*, not just decoration. Builds trust.
- **Failure branch** — on tokenization fail, particles **scatter** + graceful "Couldn't add card — Retry / Enter manually". Never a dead spinner.
- **Haptics** — success haptic on activate + a soft "thunk" as the card lands in the deck.
- **Continuity** — same card art object travels scan → adding → deck (one element, never a cut).

---

## Inspo 5 — Money-link RECEIVE screen ($20 / Accept · Decline)  ✅ CONFIRMED
**Maps to:** money-link claim (receive side of `v-reqlink`). Entry = user **taps a money link** sent by someone (in-app deep link OR web claim page → into app).

**Core mechanic:** black starfield, giant chrome amount, note in quotes ("Thank you x 20!"), sender row (avatar + "From Elisha"), two buttons, and an "Accept as [profile]" selector at the bottom.

**Two branches (by link type):**
- **Someone SENT you money** (`type=send`) → **Decline · Accept**.
- **Someone REQUESTS money** (`type=request`) → **Decline · Send** (i.e. pay them).

**Build model (for later):**
- Deep link resolves the `money_links` row → render this screen in the right branch by `type` + `status`.
- Accept (send link) → funds land in wallet → success + balance bump on home.
- Send (request link) → into pay-confirm (which card/balance) → success.

**Design / UX add-ons (Claude):**
- **Visually differentiate the two branches** — *send* = celebratory chrome digits + particle fountains (as in the inspo); *request* = calmer, foregrounds "what it's for" + a clear Pay.
- **Animated amount reveal** — chrome digits assemble/shimmer on entry with particle bursts behind.
- **Sender trust row (fraud guardrail — important for no-KYC P2P)** — @tag + a signal like "you've paid them 3× before" vs **"⚠ New contact"** so users can smell a scam *before* accepting/paying.
- **Status & expiry** — links expire (`pending|claimed|expired|cancelled`). Show "expires in 6d"; if already claimed/expired/cancelled, render that state instead of live buttons (prevents double-claim & confusion).
- **"Accept as / into" selector** — default to Wallet, but optionally route an accepted amount straight **into a Savings goal or Pool** — ties the receive moment into Zenti's save/split/pool pillars.
- **Gentle decline** — confirm step; for *send* links, declined funds return to sender (and sender gets notified). Make the money-state explicit, never ambiguous.
- **Post-action** — success screen + Dynamic Island state ("Received $20 from Elisha").

---

## Inspo 6 — Split the bill / Split groups (Point app "Split $38")  ✅ CONFIRMED
**Maps to:** the **Split** pillar + Pools (`v-create-pool`, `v-pool-detail`, `updatePoolPreview`, `addPoolMember`/`inviteToPool`). Opens with an illustrated intro (brief flags this for Savings/Pools/Split).

**Core mechanic (inspo + user's ask):** keep Point's simplicity — "Split $X with [people]", a FRIENDS list you tick — but add:
- **Input amount + number of people** → auto per-head share.
- **Split groups** = reusable, pool-style groups for recurring splits (roommates, trips), not just one-offs.
- **Two share paths:** (a) **social media** share, (b) **in-app request** from **suggested accounts**.
- Requests land on recipients as a **Dynamic Island notification** → taps into the receive screen.

**Two flows:**
1. **One-off split (quick)** — amount + pick people / headcount → fire requests.
2. **Split group (persistent, pool-like)** — named group + members, runs multiple splits over time, tracks who's paid.

**Build model (for later):**
- A split = a lightweight **pool**: target = total, each member's expected = their share; track paid/unpaid with a progress ring (reuse `pools` + `pool_members`).
- **In-app request** to a Zenti user → shows up as **Inspo 5's request branch** (Decline · Send). Clean reuse.
- **Headcount / non-app people** → generate a **money-link per share** (social path; ties to `money_links` + web claim page).

**Design / UX add-ons (Claude):**
- **Even by default, custom on tap** — split evenly (total ÷ N) but tap a person to adjust their share; a live **"remaining"** indicator keeps the math reconciling to the total (no rounding leaks).
- **"Include myself" toggle** — explicit: am I one of the N (I owe a share) or did I front it (others owe me)? Kills the most common split confusion.
- **Suggested accounts** — surface recent counterparties / frequent split partners first (from `profiles` by ztag + recent tx) so it's tap-not-type.
- **Live per-head preview** — "$X each" updates instantly as amount/N change (`updatePoolPreview`).
- **Status tracking** — per-member rows: paid · pending · declined; gentle **remind** on unpaid after a while.
- **Dynamic Island for the organizer** — live "2 of 4 paid" collapsing into the island; recipients get the request as an island alert.
- **Settle-up moment** — all-paid = celebratory success; on a decline, rebalance or let the organizer cover.
- **Social-share card** — a clean preview ("Alex owes you $9.50"), consistent with the money-link preview card.

**Decisions (RESOLVED):**
- ✅ **Split = a flavor of `pools`** — reuse everything, including **creation + record-keeping** (splits are created and tracked through the pool model; one source of truth).
- ✅ **"Include myself" = ON by default** — the organizer is part of the split and owes a share too.
- ✅ **Headcount-only splits = one shared link** N people each claim a slot on (resolved by the friction law below — one link to drop in a group chat beats generating N links).

---

## Inspo 7 — Actionable notifications (Overview bell + badge)  ✅ CONFIRMED
**Maps to:** notification bell + badge on `v-home` header → a **notifications inbox/center**. Complements the Dynamic Island (see split of surfaces below).

**User's framing:** the badge signals **actionable** notifications. Examples called out: bill/split requests, in-app money requests, **pending** transactions, **successful** ones, etc.

**Two notification surfaces (keep distinct, keep consistent):**
- **Dynamic Island** = *live / in-the-moment / transient* — a payment landing, a pending tx resolving, "Signing in…". Fades.
- **Bell → notification center** = *persistent inbox* — the backlog of actionable items + recent activity you can return to.

**Notification types:**
- **Actionable (needs you):** split/bill request, money request, money-link received (Accept/Decline), pool/split invite, card verification needed.
- **Status (FYI):** pending tx, tx successful, tx failed, deposit received, savings milestone, round-up applied.

**Build model (for later):**
- Realtime via Supabase → new items hit the inbox **and** fire the Dynamic Island.
- Actionable rows resolve to the right surface: a money request → **Inspo 5 request branch** (Decline · Send); a received link → Inspo 5 send branch; a tx → `v-txd`.

**Design / UX add-ons (Claude):**
- **Two-tier badge** — **red** = *needs your action*; a quieter neutral dot = *FYI*. A successful-payment notice shouldn't scream as loud as a money request.
- **Inline actions in the row** (friction law ⭐) — **Accept / Decline / Pay right in the inbox**, no need to open. Tap-through only when confirmation/amount detail is genuinely needed (→ Inspo 5).
- **Pending → live in place** — a pending row shows a progress state and **auto-updates to success/fail** via realtime, mirrored in the island. No manual refresh, ever.
- **Grouping** — "**Needs your action**" pinned on top, "**Recent activity**" below; acted items auto-move to history.
- **Swipe actions** — swipe to dismiss/mark read; swipe the other way to act.
- **Calm empty state** — "You're all caught up ✓".
- **Per-type mute/settings** — control what pushes.

**Side note — borrowable `v-home` header details from this inspo (flag for later):** big balance with **eye hide-toggle**, currency selector, a **green sparkline**, and bold pill actions. (Zenti's actions = Pay center / send · request, not Swap/Deposit — adapt, don't copy.) *Ask user: also log these as the home-screen styling direction?*

**Open decisions:**
- Two-tier badge (action vs FYI) — yes? *(Claude rec: yes)*
- Inline row actions as the default — yes? *(Claude rec: yes, per friction law)*

---

## ⭐ Global design law — LOWEST-FRICTION PATH WINS
*User's rule, applies to every flow in the app:*
- Always build the **easiest possible path** for the user. No friction.
- If a way of **creating** or **tracking/recording** something is hard or clunky, **cut that path entirely** — don't ship a hard option next to an easy one.
- Defaults do the right thing so the user rarely has to configure (even split, include-myself ON, suggested accounts pre-surfaced).
- One link / one tap / one source of truth over many.

## Cross-cutting threads (worth keeping consistent)
- **Motion continuity** — same "Adding…/processing" language across scan→wallet and auth, all surfaced via the **Dynamic Island**.
- **Shared-element transitions** — card flies from scan frame into the wallet deck; wordmark flies from splash into auth. Continuous, never cut.
- **Dark-first, green-accent everywhere** — adapt every light inspo to the dark default.
- **No dead ends** — every flow (scan, auth) has a manual/fallback path.

## Effort read
- Inspo 1 (card physics) = the only real engineering depth; gesture springs are fiddly to get Apple-smooth.
- Inspo 2 & 3 = mostly standard flows in great clothing.
