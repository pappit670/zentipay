# Zenti — feature footage drop zone

Drop real screen-recordings / product clips here and they’ll slot straight
into the site. Each is wired behind a commented `<video>` tag (and a poster
image slot in `assets/`). To go live, just add the file and uncomment the
matching line.

## Homepage feature blocks (index.html)
The three bold-statement blocks reference these. The animated demos show now;
swap them by uncommenting the `<video>` in each `.fs-vid`:
- `tap-to-pay.mp4` — phone-to-phone NFC, the “tick” moment (your reference video B)
- `money-link.mp4` — sharing a link in WhatsApp → they tap → paid (your reference video A)
- `scan-pay.mp4` — scanning a Zenti QR at a till

## Feature page (features.html)
Each feature has a `Video demo` box with a commented `<video src="videos/…">`
and an optional `poster="assets/…-poster.jpg"`:
- `pay.mp4`, `money-link.mp4`, `tap-to-pay.mp4`, `scan-pay.mp4`,
  `savings.mp4`, `pools.mp4`, `card.mp4`

## Format tips
- MP4 (H.264) + `muted loop autoplay playsinline` is already set in the markup.
- Portrait clips (9:16) look best in the media boxes; ~6–12s, no audio needed.
- Keep each under ~3–4 MB so the page stays fast. A `poster` image avoids a
  blank frame before the clip loads.
