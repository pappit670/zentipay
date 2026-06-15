# zenti-reel

A HyperFrames video composition — a 15s Zenti Pay social reel (1080×1920). Plain HTML + GSAP, rendered to MP4 by the `hyperframes` CLI.

## Requirements
- **Node.js 22+** — [nodejs.org](https://nodejs.org/)
- **FFmpeg** — `brew install ffmpeg` (macOS) / `sudo apt install ffmpeg` (Debian) / [ffmpeg.org](https://ffmpeg.org/download.html) (Windows)

Verify: `npx hyperframes doctor`

## Preview
```bash
npx hyperframes preview
```
Opens HyperFrames Studio (frame-accurate scrubbing) at http://localhost:3002.

## Refine with Claude Code
```bash
npx skills add heygen-com/hyperframes   # one-time
npx hyperframes lint                    # should pass with zero errors
npx hyperframes preview                 # live feedback
```
Then iterate: "make scene 3's counter smoother", "tighten scene 5", "swap the shader to whip-pan".

## Render
```bash
npx hyperframes render index.html -o zenti-reel.mp4
```
1080×1920 / 30fps by default. `--fps 60` or `--resolution 2160x3840` to override.

## Scenes (15s, 6 scenes, 1 shader)
1. Hook — "Money, finally simple."
2. Pay — "Pay anyone. In seconds." + Paid pill
3. Save — "Save for what matters." + KES round-up counter *(shader anchor)*
4. Hero — "One tap. It's done." + tick *(revealed by `cinematic-zoom`)*
5. Built for Kenya — "M-Pesa, bank, and cash, one app."
6. CTA — Zenti wordmark + "Download free"
