# Zenti — Brainstorm Notes
*Living scratchpad. Not a spec, not code. We capture inspos + design/UX ideas here as we talk.*
*Brand reminders: dark default · Inter · green `#32d74b` · rounded half-sheets · progress rings · Dynamic Island.*

---

## Inspo 1 — Apple-Wallet card stack (ULYS / "Cartes")
**Maps to:** `v-wallet` (+ `toggleWalletStack`), `v-card-detail`, `v-card-settings`.

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

## Inspo 2 — Tabby scan frame ("Scan your ___")
**Maps to:** `v-scan-card` / `v-manual-card`, `v-transit-id`; hands off to `v-adding-card` → `v-card-activated`.

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

## Cross-cutting threads (worth keeping consistent)
- **Motion continuity** — same "Adding…/processing" language across scan→wallet and auth, all surfaced via the **Dynamic Island**.
- **Shared-element transitions** — card flies from scan frame into the wallet deck; wordmark flies from splash into auth. Continuous, never cut.
- **Dark-first, green-accent everywhere** — adapt every light inspo to the dark default.
- **No dead ends** — every flow (scan, auth) has a manual/fallback path.

## Effort read
- Inspo 1 (card physics) = the only real engineering depth; gesture springs are fiddly to get Apple-smooth.
- Inspo 2 & 3 = mostly standard flows in great clothing.
