# Zenti Business — Model Validation & Tiering (2026-06-14)

> Purpose: stop us building impressive components nobody needs. Every feature below is tied to a
> *specific problem* and a *specific tier*. If a component doesn't map to a real, validated pain for
> that persona, it gets cut or deferred.

## Market reality (researched, cited)
- **7.4M MSMEs in Kenya; only ~20% formal/licensed.** Most are informal, cash-based, low digital
  literacy, no bank relationship, no credit history.
- **M-Pesa dominates: 34M+ users, ~95% of digital credit.** Safaricom already lends to micro
  businesses off till data — **Taasi Till** (KES 1,500–250,000) and **Fuliza Biashara**; M-Shwari/Tala
  score thin-file users on M-Pesa history.
- **eTIMS is now mandatory for ALL businesses** (incl. non-VAT, freelancers). From **Jan 1, 2026 KRA
  validates declared income/expenses against eTIMS**; no valid e-invoice = non-deductible expense;
  penalties up to KES 1M / 10% of tax.

## The strategic conclusion
- ❌ **Do NOT position Zenti to micro as "payments + credit."** Safaricom owns that. We lose.
- ✅ **Zenti's defensible wedge = the things M-Pesa does NOT do:**
  1. **Make eTIMS painless** — e-invoicing tied to payments you already take (urgent, mandatory, unsolved-for-SMEs).
  2. **Unified operations layer** — one clear picture across M-Pesa + bank + cash: categorized, tax-estimated, invoiced, staffed. M-Pesa only shows you M-Pesa.
  3. **Consumer network → business funnel** — the Zenti consumer app (money-links, social pay) drives merchant adoption.
- 💡 **ARPU lives in Pro/Max (growing + established SMEs).** Starter is a funnel, not a profit center — keep it minimal.

## Tier model (build against this)

### Starter — FREE · "Mama mboga, kiosk, boda"
**Their real problem:** "What did I make today? Am I okay with KRA?" Nothing more.
**Include (each solves a real problem):**
- Get paid: QR + money-link (acquisition; must be as easy as M-Pesa)
- Today/this-week revenue at a glance (clarity)
- Transaction list (auto from M-Pesa till)
- **ONE gentle eTIMS nudge** ("KRA now needs e-invoices — turn on when ready"), not a controls panel
**Explicitly EXCLUDE:** compliance controls, frameworks, multi-framework tracking, team, multi-location,
advanced reports, invoicing suite. (This is the mistake to avoid.)

### Pro — paid · "Salon, restaurant, retail (formalizing SME)"
**Their real problem:** "Stay KRA-compliant without an accountant, know what I owe, get paid professionally, track expenses."
**Include:**
- **eTIMS-compliant invoicing** (the hero feature) + recurring invoices
- M-Pesa + bank + cash **reconciliation & categorization**
- Tax estimates: **TOT / VAT / PAYE** (estimate, not advice)
- Basic compliance *summary* (filing deadlines, what's due) — light, not the full controls grid
- Expense tracking, basic reports, a couple of staff (cashier role)

### Max — paid (higher) · "Law firm, pharmacy chain, logistics (established)"
**Their real problem:** "Run a compliant multi-location operation; give my accountant a clean feed; manage a team."
**Include (this is where the deep build belongs):**
- **Deep compliance controls** (the Fathom-style grid: pass/fail controls, frameworks KRA/VAT/PAYE/NSSF/SHIF, requirements) — *Pro/Max only*
- Multi-location, full team roles (manager/cashier/accountant/owner), accountant read-only access
- Advanced reports, audit-ready exports, priority support

## Per-component audit of current business.html dashboard
| Component | Verdict | Tier |
|---|---|---|
| Overview (revenue today/month, recent tx, AI line) | Keep | Starter+ (trim AI to Pro+) |
| Sales (trend, methods, top customers) | Keep | Pro+ |
| Transactions table | Keep | Starter (basic) / Pro (filters+export) |
| Customers | Keep | Pro+ |
| Invoices | **Re-frame as eTIMS invoicing (hero)** | Pro+ |
| QR Payments | Keep | Starter+ |
| **Compliance (deep controls grid)** | Keep but **gate** | **Pro (summary) / Max (full grid)** |
| Reports | Keep | Pro (basic) / Max (advanced) |
| Team | Keep | Pro (1-2 roles) / Max (full) |
| Settings | Keep | all |

## Immediate build implications
1. Pricing → **3 tiers** (Starter / Pro / Max), not 2.
2. **Lead the business landing with eTIMS** ("KRA-ready invoices, automatically") — it's the urgent wedge.
3. **Gate deep compliance to Pro/Max**; Starter sees only the one-line eTIMS nudge.
4. Don't add micro "credit/loan" messaging — Safaricom owns it; if we ever touch credit, it's via the
   consumer app's CRB score, not a business-dashboard claim.

## Sources
- KIPPRA / tralac / AfDB on MSME informality & financial-management gaps
- KRA eTIMS notices; Thomson Reuters/Pagero, Alphacap, flick.network on 2026 validation & penalties
- FinRegLab (alternative-data MSE lending), Safaricom Taasi/Fuliza Biashara, FrontierFintech on M-Pesa credit dominance
