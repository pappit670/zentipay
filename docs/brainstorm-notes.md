# Zenti — Brainstorm Notes
*Living scratchpad. Not a spec, not code. We capture inspos + design/UX ideas here as we talk.*
*Brand reminders: dark default · Inter · green `#32d74b` · rounded half-sheets · progress rings · Dynamic Island.*

---

## 📋 BACKLOG — areas still to brainstorm (living tracker)
*Covered so far (Inspos 1–13): wallet deck · scan/add-card · adding-sim · money-link receive · notifications · credit score · card-detail+perks · savings page · unified create flow (goals/pools/split) · ± stepper/tips · transaction states.*

**🟢 Onboarding** *(covered in Inspo 14 — NO splash)*
- [x] **Entry (no splash)** — mesh-gradient + wordmark assembling (Inspo 3/14)
- [x] **Sign up / Sign in** — phone/email toggle + OTP + Google/Apple
- [x] **DOB** — scroll-wheel picker
- [x] **@ztag creation** — handle + display name + avatar (hero beat, live availability + card preview)
- [x] **Permissions priming** — soft-ask before OS prompt
- [x] **Security setup** — biometric (Face ID) + PIN
- [x] **Returning-user fast path** — "Welcome back, @tag" + biometric (Inspo 3 add-on)
- [x] **First-run illustrated intros** for Savings / Pools / Split (contextual)
- [ ] *remaining: lock DOB age gate (18+/13+), avatar default, progress indicator*

**🔲 Still uncovered — core loop & pay**
- [ ] `v-numpad` core pay screen — method (contact/QR/NFC) + mode (pay/request) + recipient
- [ ] `v-search` — recipient picker by @ztag / name / contacts
- [ ] `v-qr` — my code + scanner
- [ ] `v-proximity` + `v-tap-wait` — tap-to-connect nearby pay (NFC)
- [ ] **Money-link CREATE side** — create → preview card → share (receive side done in Inspo 5)

**🔲 Still uncovered — surfaces**
- [ ] `v-activity` — full transaction list (filters, grouping)
- [ ] `v-txd` — transaction detail (touched via states/share; full screen not designed)
- [ ] `v-profile` — profile + theme toggle + settings (limits, security, account, sign out)
- [ ] **Empty states** across the app (brief: loading→success→failed→**empty**)

**🔲 Still uncovered — wallet/cards & extras**
- [ ] `v-card-zenti` — the Zenti card's own art/identity
- [ ] `v-add-wallet` — add to Apple/Google Wallet
- [ ] `v-paylater` — Pay Later / BNPL
- [ ] **Companion website** — landing + money-link web claim page (brief §5)
- [ ] **Fraud / limits** surfaces (brief mentions helpers)

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
> **UPDATE:** Split now **runs on the unified create flow (Inspo 11)** as its *split mode* — not a separate flow. The logic below (even/custom, include-myself, suggested accounts, status tracking) applies *inside* Inspo 11's add-people step.

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

**Side note — `v-home` header is the bell's home.**

**Open decisions (RESOLVED):**
- ✅ Two-tier badge (red = action, neutral dot = FYI).
- ✅ Inline row actions as the default (act in the inbox; tap through only when needed).

### 🏠 Home screen — LEAVE AS-IS (v34 is exceptional, do NOT restyle)
**RETRACTED earlier "home style directive."** Per user: the v34 home page stays exactly as it is — no balance/sparkline/pill restyling from the Overview inspo. The Overview inspo only informs the **notification bell behavior** (two-tier badge + actionable inbox), which slots into the home that *already exists* in v34. Touch nothing else on home.

---

## Inspo 8 — Credit score checker (Kikoff "Credit Report")  ✅ CONFIRMED
**Maps to:** a **Credit Score** screen reachable from the **individual card page** via the **top-nav menu button** (the menu also holds the other v34 card options: freeze/lock, card settings, etc. → `v-card-settings`). Theme: *making banking easier — bridge the wallet to the user's credit at the bank.*

**Core mechanic (Kikoff):** big **score gauge/ring** (on-brand green), **↑ pts delta**, a **monthly trend sparkline**, an encouraging message ("Bravo, you've gained 50 pts…"), and a **Recent events** list of credit events with their point impact.

**Build model (for later):**
- New screen, but it's an **addition reached from the existing v34 card-page menu** — fit it in, don't remodel the card page.
- Screen design is straightforward (ring + trend + events list, all green-on-dark).

**Design / UX add-ons (Claude):**
- **Progress-ring + delta** reuse the same ring primitive as savings goals (one component, many uses).
- **Encouraging coach tone** — frame score moves as wins; nudge the next action ("pay on time to gain ~X").
- **Recent events** double as education — each event explains *why* the score moved.

**Decisions (RESOLVED):**
- ✅ **Mock now** — build the screen with sample data to perfect the UX. **Don't worry about KYC/bureau** for now; once there's an MVP we set up KYC + a real bureau provider then.

---

## Inspo 9 — Card detail page: Unlock/copy + Perks slot + Perks→Autosave loop (Cash App style)  ✅ CONFIRMED
**Maps to:** `v-card-detail` (reached by tapping a card in the Inspo 1 deck) + `v-card-settings`, and ties into Savings / round-ups (`v-roundups`, `v-roundups-settings`, `savings_goals`/vault).

**⚠️ Card page is ALREADY defined in v34 — do NOT remodel. We only ADJUST the new specs into the existing v34 card structure.** The Cash App shot informs the *perks concept*, not the layout.

**New specs to fit into the existing v34 card page:**
- **⚙ menu** (top nav, already in v34) gains a **Credit Score** option alongside the existing v34 card options (freeze/lock, settings).
- The card page's **existing notification slot** also becomes the card's **perks/offers visibility point** (merchant offers e.g. "5% off", "Show more") — same slot, added duty. No new layout.

**⭐ The Perks → Autosave loop (user's headline idea):**
1. Each card carries **perks/offers** (merchant discounts/promos), visible in the perks slot.
2. **Before paying** at a merchant, the app **auto-applies** a suggested eligible discount/promo for that card — zero effort (friction law).
3. The **money saved** by that discount is **auto-redirected into Savings**.
4. The **% of the saving** that's swept to Savings is **set by the user** (an autosave percentage).

**Build model (for later):**
- Treat this as a second trigger on the **same auto-save engine** as round-ups: round-ups sweep spare change; perks sweep realized discounts. One engine, two sources → `savings_goals`/vault.
- At pay time (NFC/QR/online), match merchant → eligible offer → apply → compute saving → sweep `saving × autosave%` to the default goal/vault.

**Design / UX add-ons (Claude):**
- **Perks slot = horizontal offer chips** (merchant logo + "5% off") + "Show more"; notifications pinned above or as a small toggle so the slot never feels cluttered.
- **Auto-apply confirmation** via Dynamic Island/toast: "Saved $1.20 — $0.84 → Savings" so the magic is *visible* without being a step.
- **Autosave loop is owned by the SAVINGS page** — it's *activated there*, and the **% control lives in the Savings page settings** (a slider), NOT on the card page. The card page only *surfaces* perks; the sweep + percentage logic lives in Savings.
- **Impact metric** — "Perks saved you $X this month, $Y auto-saved" on the savings screen → satisfying loop feedback.
- **User stays in control** — choose which perks auto-apply; payment is never silently altered without the saving being shown.

**Decisions (RESOLVED):**
- ✅ **Offers = mock/curated now, real provider later** (Visa Offers / similar plugged in down the line).
- ✅ **Autosave % = ask on first use** — no silent default; the first time a perk-saving happens, prompt the user to pick their sweep %. Editable later in settings.
- ✅ **One auto-save engine** — perks-autosave extends the existing round-ups engine (round-ups = spare change, perks = realized discounts).

**Open decision:**
- Perks vs notifications in the shared slot — **tabs** or **stacked** (notifications pinned, perks below)? *(still open)*

---

## Inspo 10 — Savings page: intro · landing · goal-rings · Round-Ups settings  ✅ CONFIRMED
**Maps to (all already in v34 — fit in, don't remodel, per Law #2):** `v-savings`, `v-create-goal`, `v-goal-detail` (ring), `v-vault`, `v-roundups`, `v-roundups-settings`. This is also where the **autosave loop is activated** (Inspo 9) and where its **% control lives**.

### A) Illustrative intro (Cash App "A new way to save")
- First-time entry opens with an **illustrated intro** ("A new way to save… stash some cash, just in case") → **Start saving**. (Brief flags illustrated intros for Savings/Pools/Split.) Show once, then straight to the landing.

### B) Savings LANDING — flat, no ring (Cash App dark $1,200 screen)
- The default savings landing is **ring-less**: big **balance** + **interest rate** ("3.25% interest ›"), **Add money / Withdraw**, a **Set a goal** CTA, a **"Grow your savings"** list, then **Activity**.
- **"Grow your savings" = the auto-save engine's sources:** **Round-Ups** (spare change), **Perks** (our Inspo 9 realized-discount sweep), **Paychecks** (save part of each). One engine, listed as toggleable sources here.

### C) Goal detail — the RING activates per specific goal (Cash App light $75/$25-to-goal)
- **Rings are goal-specific.** A specific savings goal shows the **progress ring** (e.g. $75 saved, $25 to goal) + emoji/icon, **Transfer in / Transfer out**, **Update goal**, **Round-Ups** toggle.
- Landing = no ring; each goal = its own ring. Multiple goals each carry their own ring (mini-ring in a list → tap → full ring on `v-goal-detail`).

### D) Round-Ups settings (Acorns) — adjustable, decision-easing
- **Round-up amount slider** ($0 · $0.25 · $0.50 · $0.75 · $1) with a **live example** that recomputes ("buy lunch for $10 → we auto-save **$0.50**").
- **Multiplier** chips (Off · 2x · 3x · 10x) with its own live example.
- **Autosave % control** (the perks sweep, Inspo 9) lives here too — *ask on first use*, editable after.
- One **Save** button. All controls show a live example so the choice is obvious (user's ask: "ease decision making").

**Design / UX add-ons (Claude):**
- **Reuse one ring primitive** across goals + credit score (Inspo 8) — consistent motion.
- **Honest interest** — display rate (mocked for now); never fake numbers that imply a real APY we don't have.
- **Live examples everywhere** in settings so users never guess what a setting does.
- **Sensible defaults + one Save** (friction law) — don't make saving feel like configuring.
- **Goal celebration** — hitting 100% on a goal-ring = a success moment (confetti/haptic), consistent with other success states.

**Decision (RESOLVED):**
- ✅ **Savings is greenfield** (v34 left it rough) — we design it fresh. **Landing flat / ring-per-goal confirmed.** No reconciliation against v34 needed here.
- Creation of goals uses the **unified flow (Inspo 11)**.

---

## Inspo 11 — UNIFIED create+manage flow for Goals · Pools · Split (Cash App pools)  ✅ CONFIRMED
**Greenfield** (v34 left these rough — see Law #2 exception). **One flow machine, three uses.** Reuses the v34 **numpad** (`v-numpad`) for amount entry and the **ring** primitive for progress.

**The flow, start → finish (from the 5 Cash App shots):**
1. **Entry** — tap *Start a pool* / *Create goal* / *Split a bill*.
2. **Numpad** — input the **amount** (target / total). Reuse v34 `v-numpad` (with ops).
3. **Slide-up sheet** — **name it** ("For ___") + **pick emoji** (`cyclePoolEmoji`/`cycleGoalEmoji`) + **Start/Create**. Live preview (`updatePoolPreview`).
4. **Detail screen (RING)** — new object shows progress **ring** ("$0 of $500 goal"), creator avatar, **Add people** + **Contribute**, empty state ("be the first to contribute").
5. **Add people / Share** — search by **name / $ztag / email / phone** + **Share a link** (Copy link / Share — collect from *anyone*, incl. non-app via web claim page) + **suggested accounts** list with **Add**. *(This single screen unifies Inspo 6's two share paths.)*
6. **Funding / activity** — contributions fill the ring ("$450 of $500"), **Activity** list of who added what (+$100, +$40…).
7. **Close / complete** — success: "You closed the pool and transferred $500 — money's in your balance, ready to send or spend; view it anytime." **Done.**

**The three uses fork ONLY at the contribution model:**
- **Savings goal** = solo (just you fund toward target). Add-people optional → promotes it to a shared pool.
- **Pool** = you + others **contribute openly** toward the target (group gift, trip fund).
- **Split** = total **auto-divided into per-person owed shares**; adding people **assigns shares + sends each a request** (→ Inspo 5 request branch, Decline · Send). Ring fills as each pays; **even-by-default + custom-on-tap + include-myself-ON** (Inspo 6) apply at the add-people step. Close = settle-up.

**⭐ Split integration answer (user's open question):** Split is **NOT a separate flow** — it's a **mode** of this unified flow. Same numpad → sheet → ring → add-people. The only differences: (a) the amount is the *bill total*, (b) at add-people the total **auto-splits into shares and fires requests** instead of waiting for open contributions, (c) the ring tracks "collected of total owed", (d) close = settle-up. So Inspo 6's split logic lives *inside* this flow; nothing's thrown away.

**Design / UX add-ons (Claude):**
- **One numpad, one ring, one add-people/share screen** across all three → consistency + less to build (friction law).
- **Emoji + name personalization** makes each goal/pool/split feel owned.
- **Share-a-link** path means non-app people can still contribute/pay (ties to `money_links` + web claim page).
- **Close/transfer success** consistent with other success states + Dynamic Island ("Pool closed · $500 → balance").
- **Type can be set at entry** (Goal/Pool/Split buttons) so the flow knows its mode up front — no mid-flow config.

**Decisions (RESOLVED):**
- ✅ **Option A — type picked at entry.** Mode is chosen before the numpad; carried as a `mode` flag through one shared flow.
- ✅ **Same numpad across all three**, only the **option buttons below differ** (e.g. Goal→"Start saving", Pool→"Start pool", Split→"Send requests"). One numpad component, mode-driven buttons/labels.
- ✅ **Entry points live on the HOME screen** — a **features list just above the transactions list** (Goal · Pool · Split, etc.). This is the home's savings/pools "peek" area (brief already calls for it), so it's a sanctioned home addition, not a redesign. *(See home note under Law #2.)*

---

## Inspo 12 — Quick ± stepper / Quick Tips (Apple Cash iMessage)  ✅ CONFIRMED
**The component:** a compact amount with **− / +** on either side ("$15"), a **"Show Keypad"** link to expand to the full v34 numpad, and action buttons below (Apple Cash uses Request/Send). A fast way to nudge an amount without typing.

**Where it fits (user's idea):** primarily **Quick Tips** — add a tip with one-tap ± on top of a payment. Possibly also a compact quick-entry for small sends / quick pool contributions.

**Design / UX add-ons (Claude):**
- **Compact ↔ full numpad** — the ± stepper is the *quick* mode; **"Show Keypad"** expands to the v34 numpad for precise/larger amounts. Same amount-entry primitive, two densities.
- **Quick Tips use:** on a send/pay confirm, an **"Add a tip"** affordance → ± stepper with smart presets (e.g. round-up, +$1/+$2, or 15/18/20%) and ± for fine control. One tap to a sensible tip, friction-free.
- **Tip targets** — tip a person by `$ztag` (barber, busker, creator), or add a tip on top of a split/bill payment.
- **Smart step size** — ± increments sensibly ($1 default; could scale with amount). Long-press to accelerate.
- **Reuse** — the same ± stepper can serve "quick contribute" to a pool (Inspo 11) without opening the full numpad.

**Open decision:**
- ✅ **RESOLVED:** primary home for the ± stepper = **tips on the pay/send confirm**. (Tip presets — %, round-up, flat ± — to finalize during build.)

---

## Inspo 13 — Transaction STATES system (P2P · bank transfers · savings · loading · push)  ✅ CONFIRMED
**Maps to:** success/status surfaces across `v-success`, `v-txd`, the Dynamic Island, and push. Brief mandate: *"States everywhere: loading → success → failed → empty, surfaced via Dynamic Island + sheets."*

**⭐ The core distinction the user is drawing — internal vs external rails:**
- **P2P (internal, instant):** money moves inside Zenti → **no pending**, success is immediate & minimal.
- **Bank transfers (external rails):** Cash In / Cash Out touch banks → **Pending → Completed** states, show **source + timestamp + ETA**.
- **Savings (internal):** instant, with **habit-coaching** tone + contextual upsell.

**State templates by type (one shared success layout, type-driven content):**
- **A) P2P send/receive** — "You sent $150 to **Rich The Boss**" / "$25 from **@AD**" ✓ · Done. Minimal, instant, **Share** option (per `v-txd`). Failed → "Couldn't send — Retry".
- **B) Cash In (Add Cash)** — icon + **amount** + **"From Visa Debit ••9855"** + **timestamp** + **status pill (✓ Completed / Pending)**. External rail → may show Pending then auto-flip to Completed (realtime + island).
- **C) Cash Out (Withdraw)** — same anatomy, reverse direction; **must show ETA** ("Arrives by Thu") and the **instant-fee vs standard** choice. Handle reversal on failure.
- **D) Savings transfer** — "**$10 transferred to savings** · Nicely done, you're building healthy saving habits" + a **contextual upsell card** (e.g. "Get paid faster with direct deposit") + Done. Encouraging tone.
- **E) Loading screens** — branded **green-ring spinner** + context label ("Verifying your credentials…", "Adding cash…", "Cashing out…"). For auth, card-add, rail round-trips. Distinct from inline/island micro-loading.
- **F) Push notifications** — lock-screen mirror of the Inspo 7 system: "**@name sent you $25**", money requests (**actionable → deep-link** into the receive screen), statements/info. Actionable pushes jump straight to the right in-app surface.

**Design / UX add-ons (Claude):**
- **One success-screen template, content by type** (icon · headline · sub-detail · optional upsell · Done) — same layout everywhere, varies by `type`. Consistency + less to build (friction law).
- **Status pill + realtime** — anything on external rails shows Completed/Pending/Failed; **Pending auto-updates** to Completed via Supabase realtime, mirrored in the island. No manual refresh.
- **Always show ETA** on cash-out — never leave "where's my money?" ambiguity.
- **Three renderings of one event** — full success sheet (in-app) · Dynamic Island (live/transient) · push (out-of-app). Same event, surfaced wherever the user is.
- **Failed state for every type** — clear reason + retry; reversals explicit (brief mandate, no dead ends).
- **Tone by type** — P2P neutral-celebratory · savings habit-coaching · bank transfers informational/trust.
- **Contextual upsell only on success, never blocking Done** (direct-deposit after savings; share-link after P2P).

**Notes / RESOLVED:**
- ✅ **Cash In / Cash Out = mock rails now**, real processor wired post-MVP.
- ✅ **Cash-out offers both speed tiers** — **Instant (fee)** and **Standard (free, 1–3 days)**, with **Standard pre-selected** as default. (Mocked; easy to drop to standard-only later.)

---

## Inspo 14 — ONBOARDING flow (no splash · scroll-wheel · illustratives · creative)  ✅ CONFIRMED
**Greenfield entry journey.** User directives: **NO splash**, use the **iOS scroll-wheel** (DOB-picker style) as a signature input, add **illustratives**, and go **creative**. Consumer-only, light PII (DOB for age-gate ≠ full KYC — KYC is post-MVP).

**The flow (one question per screen, friction law):**
1. **Entry (no splash)** — app opens straight into the **living mesh-gradient + Zenti wordmark assembling** (Inspo 3 — the "loadup" beat *is* this screen now). Buttons: **Continue with Google / Apple**, and **Use phone or email**.
2. **Phone / Email** (Cash App) — "Enter your phone or email" with a **Use Phone ⇄ Use Email** toggle, `+1` region auto-detect, "Need help logging in?", Next.
3. **OTP** — "Please enter the code sent to ___" → **auto-submit** when filled (no Next tap needed).
4. **Date of birth** — the **scroll-wheel** ("Select your date of birth") + Confirm + privacy-notice microcopy.
5. **@ztag + identity** — claim your `$handle` + display name (+ avatar).
6. **Permissions priming** — soft-ask (notifications, contacts) with value framing *before* the OS prompt.
7. **Security** — Face ID / PIN setup → "You're in."
8. **→ Home** (welcome moment). First-run illustrated intros for Savings/Pools/Split appear *contextually* the first time each is opened.

**⭐ Creative concepts (Claude cooked):**
- **Scroll-wheel as a brand motif** — make it *physical*: momentum + rubber-band, a **haptic tick per row**, the center row **magnifies + locks green `#32d74b`** when settled. Reuse the wheel beyond DOB wherever a bounded choice fits → a signature Zenti feel.
- **Birthday-cake payoff** — on the DOB wheel, a 🎂 illustrative **lights its candles** as you land on your year. Tiny delight, zero friction.
- **Reactive illustratives per step** — each step has a small animated illustration that *responds*: phone/email → envelope flies; OTP → a **lock unlocks** on the correct code; @ztag → a **name badge stamps** in.
- **@ztag = the hero beat** — claiming your handle is identity. **Live availability check** (green ✓ / suggestions), and a **live card preview** showing `$yourtag` on a Zenti card (ties straight into the wallet/card art). The emotional "this is mine" moment.
- **Continuity transitions** — the step illustration hands off into the next (same shared-element thread as scan→wallet, splash→auth). Onboarding feels like one continuous motion, never cut screens.
- **Smart prefills** — region code from device locale; email/name prefilled if they came via Google/Apple; skip steps OAuth already answered.
- **Welcome confetti** — first home entry: subtle "Welcome to Zenti, @tag" + green burst.

**Open decisions:**
- DOB: gate at **18+** or **13+**? (affects copy + legal)
- Avatar at signup — required, optional, or auto-generated (e.g. emoji/initials) with edit-later? *(lean: auto-generated + edit later, friction law)*
- Thin progress indicator across onboarding steps — dots/bar, or keep it invisible?

---

## ⭐ Global design law #2 — v34 IS THE SOURCE OF TRUTH (adjust, don't remodel)
*User's rule:*
- The v34 prototype's screens (esp. the **home page** and **card pages**) are **exceptional as-is** — we do **NOT** redesign them.
- New inspos/specs are **fitted INTO** existing v34 screens (e.g. add a menu option, give an existing slot a second duty) or are **net-new components/screens** (Dynamic Island states, money-link receive, credit-score screen, perks loop).
- When an inspo and v34 disagree on layout, **v34 wins**; the inspo only contributes the *concept/feel*.
- **Home page: untouched** — *one sanctioned addition:* a **features list (Goal · Pool · Split entry points) just above the transactions list**, living in the home's existing savings/pools **peek** area (brief already calls for this). Additive, not a redesign.

> **EXCEPTION — greenfield zones:** **Savings, Pools, and Split** (the "features" screens) were **NOT** built properly in v34. These we **design fresh** from our inspos (the inspos *are* the design here, not just feel). v34-respect still applies to home, card pages, the nav skeleton, and the core pay loop.

## ⭐ Global design law #1 — LOWEST-FRICTION PATH WINS
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
