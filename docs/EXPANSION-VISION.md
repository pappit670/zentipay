# Zenti — Expansion Vision (Business · Transit · Payments API)

> Captured 2026-06-15. Strategy/roadmap reference. Positioning: **the operating system for money
> movement and business operations in Africa** — not a wallet, not a POS, not accounting software.
> The layer that sits *above* existing tools: payment → record → report → compliance.

## Core philosophy
Remove unnecessary steps from moving money, running a business, and (later) managing movement.
**Less paperwork. Less waiting. Less friction.**

## Zenti Pay (consumer layer)
Send, receive, split, save, payment links, pay businesses, digital receipts, **store transit passes**.
Promise: move money in the fewest steps possible.

## Zenti Business (operational layer)
Sits above operations; gives clarity, records, reporting, payroll, compliance. Not a POS/inventory/accounting tool.
1. **Payments** — Zenti QR, links, NFC, future POS integrations. Every payment auto-becomes a record.
2. **Records** — revenue, customers, payment history, exportable. No notebooks/spreadsheets.
3. **Reports** — today/week/month revenue, expenses, profit estimates; downloadable, emailed, or WhatsApp.
4. **Compliance** — Phase 1: reports + tax-prep + KRA-ready docs. Phase 2: filing integrations, automated workflows.
5. **Payroll (Max)** — employee profiles, salaries, one-click payout to employee Zenti wallets.
6. **Supplier tracking** — stock purchases, supplier payments, outstanding balances.

## Payment session system
- **Merchant-entry (small biz):** enter amount → generate → customer scans/taps → biometric → success → record.
- **POS integration (larger):** POS → amount → Zenti API → session → customer scans → biometric → success. Merchant never types amounts.

### NFC strategy (phased — do NOT build hardware early)
- **Phase 1:** phone NFC + existing tags + Android NFC.
- **Phase 2:** "Zenti Verified NFC" — cheap countertop tag.
- **Phase 3:** POS triggers NFC sessions via the API.
NFC pitch is **"Tap. Done."** (QR still needs open-camera-aim-scan).

## Zenti Payments API (infra play)
Let restaurant/pharmacy/retail/POS software generate Zenti payment sessions. Positions Zenti as
**infrastructure**, not another merchant tool — far stronger than out-building every POS vendor.

## Zenti Transit (later)
Transport booking + payment inside Zenti. Pick SACCO → pickup → destination → date → pay → a **Transit
Card auto-generates in the Wallet** (e.g. "SUPER METRO · Rongai → CBD · 17 June · KES 150 · PAID"). Board by
swiping to the card and showing the conductor — no M-Pesa-message hunting. SACCOs (via Zenti Business) get
passenger records, daily revenue, route demand. Long-term: find route → book seat → pay → card → board.

## Positioning lines (marketing)
- Consumer: "Pay in seconds. Enter amount. Tap. Done." · "No cash. No waiting. No paperwork."
- Business: "Run your business. Not your paperwork." (current hero) · **"While others process payments, Zenti organizes your business."**
- The thesis: Money moves → records update → reports generate → businesses operate better.

## Build-order notes (my take)
- ✅ Now/honest on site: payments→records→reports→compliance (already shown), payroll + supplier (Max).
- ⏳ Roadmap, mark "coming" only — don't present as live: Transit, Payments API, biometric POS sessions, "Zenti Verified NFC" hardware.
- ⚠️ Honesty guardrail: keep speculative/future features clearly labelled until shipped (same rule we applied to partners/returns/user-counts).
