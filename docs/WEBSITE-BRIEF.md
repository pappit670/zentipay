# Zenti — Website Handoff Brief (for Claude design)

Hand this file + the two HTML files to a Claude design chat to keep iterating on the **website**
(not the app). Each HTML file is fully self-contained (inline CSS + vanilla JS, no build, no
dependencies except Google Fonts) — drop one in and it renders.

## Files (the actual designs)
- **`web/index.html`** — the marketing site (`zentipay.app`), ~48K
- **`web/business.html`** — the business product (`business.zentipay.app`), ~52K

## Brand system (locked — keep exactly)
- **Colors:** white `#FFFFFF`, deep black `#0A0A0A`. Green `#66E31A` is a *functional accent only*
  (success / active / confirmations) — never a brand color. Dark sections are `#0A0A0A`.
- **Type:** Inter only. Headlines Inter Black 900, tracking −2 to −3px. Body 400 / 18px / 1.7.
  Labels 600 / 12px / uppercase / 0.14em.
- **Layout:** container 1200px; section rhythm 140px desktop / 80px mobile; generous whitespace.
- **Motion:** entry `cubic-bezier(.32,.72,0,1)`; spring `cubic-bezier(.34,1.56,.64,1)`;
  reveals opacity+translateY, 0.08s stagger, IntersectionObserver-driven.
- Partners shown as **text wordmarks**, not recreated logos. No copying Apple/Cash App UI — motion inspo only.

## index.html — section map
1. Fixed nav (blur-on-scroll) 2. Hero — headline + **auto-playing looped phone demo** (finger taps
through Home→Pay→numpad→swipe→"Sent ✓" Dynamic Island→Savings→Card) + floating UI cards
3. **Guided tour** — *pinned, scroll-scrubbed* phone walkthrough w/ captions (the centerpiece; Cash App/Apple Card style)
4. Receive (link claim card) 5. Pools (animated ring + popping avatars) 6. Partners
7. Card (dark, scramble headline, 3D-tilt card fan, waitlist) 8. Business bridge 9. Download (Z-particle canvas + counter) 10. Footer

### Key engine in index.html
- `SCREENS` object = the app screens as HTML; `buildPhone()` injects them; `setStage()` crossfades.
- Hero = self-running async loop (`heroLoop`). Tour = scroll-progress → stage (`onTour`).
- **To use real app captures:** replace a screen's innerHTML with
  `<img src="assets/your-screen.png" style="width:100%;height:100%;object-fit:cover">`
  (hook is commented in the SCREENS block). Or add a `<video>` for Higgsfield/AI clips.

## business.html — what's built
Landing (hero dashboard, how-it-works, features, 3 personas, Starter/Pro pricing) +
4-step registration (type → details → animated M-Pesa import → QR ready) +
full logged-in dashboard with sidebar routing across all 10 screens (Overview, Sales, Transactions,
Customers, Invoices, QR, Compliance, Reports, Team, Settings). Plain-language "Zenti AI" tone.
Founding-principle footer (Zenti = clarity/records/automation, NOT a law/accounting/tax/financial advisor).

## Good next steps (ideas)
- Drop in **real app screenshots/recordings** (or Higgsfield clips) where the CSS phone screens are.
- Custom domains: `zentipay.app` → site, `business.zentipay.app` → `business.html`.
- A real **web money-link claim page** that reads Supabase `money_links` (mirror of in-app claim).
- Light/system theme pass; OG/meta + social cards; accessibility audit.

## Full original creative direction
The complete 626-line brief (every section's copy, motion, layout) is the spec these were built from —
ask the owner for it if deeper detail is needed.
