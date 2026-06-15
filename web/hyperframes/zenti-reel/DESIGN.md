# zenti-reel — Design reference

Brand-accurate first draft for Claude Code / local refinement.

## Identity
| Token | Value | Use |
|---|---|---|
| `--bg` | `#0e0e11` | deep near-black background (lets the green vibrate) |
| `--ink` | `#f5f5f7` | primary text |
| `--accent` | `#34ff18` | Zenti green — ticks, counters, CTA, glow (functional accent only) |
| `--muted` | `#9a9aa2` | secondary text |
| `--accent-dim` | `#103016` | deep-green glow base |

## Type
- **Display:** General Sans (Fontshare), **italic 500**, tight tracking — matches the site's headline voice.
- **Data:** JetBrains Mono 500, tabular-nums for the KES counter.
- Sizes: 116px headlines, 38px body, 30px kicker/pill.

## Motion
- Eases vary per scene: `expo.out` (hook), `back.out` (tick/pill/CTA), `power3.out` (titles), `sine.inOut` (breathing floats).
- Mid-scene activity every scene: glow pulse (s1), pill float (s2), KES counter 0→35,000 (s3), tick float (s4), title float (s5), CTA pulse (s6).
- One shader transition: `cinematic-zoom` at the s3→s4 hero reveal (boundary 7.5s, duration 0.5s). Everything else is a hard cut.

## Refinement notes (for Claude Code)
- Scene 3's counter could ease longer (1.8–2.0s) for a more satisfying climb.
- Scene 4's hero could hold ~0.3s longer if the `cinematic-zoom` feels rushed; try `whip-pan` for more energy.
- Consider a real app screen recording behind scenes 2–4 (Ken Burns) once captures exist.
- Swap CTA copy / store badges for the live launch.

## Honesty
No fabricated stats, partnerships, or user counts. The KES 35,000 round-up figure is illustrative.
