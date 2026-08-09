# TASCAM Recording Series — 88-Second Vertical Reel

A Remotion project for an 88-second, 1080×1920 reel covering the **TASCAM
Model 12, Model 16, Model 24, Model 2400 and Studio Bridge**, produced for
**Shivansh Electronics**, TASCAM's authorized partner.

| | |
|---|---|
| Canvas | 1080 × 1920, 30 fps |
| Runtime | **88.000 s — 2,640 frames exactly** |
| Ground | Light throughout (warm neutral `#F2F1ED`), dark ink `#141A22` |
| Assets used | **109 / 109** — 105 stills + 4 video clips, every one placed |
| Render | `out/tascam-model-series-reel.mp4` |
| Thumbnail | `out/thumbnail-tascam-reel.png` |
| Voiceover script | [`VO_SCRIPT_REEL_TASCAM.md`](VO_SCRIPT_REEL_TASCAM.md) |
| Coverage ledger | [`ASSET_COVERAGE.md`](ASSET_COVERAGE.md) |

---

## Quick start

```bash
npm install
npm run assets     # mirror the root assets into public/ under render-safe ids
npm run audio      # synthesise the music bed, ambient bed and 35 SFX, then audit
npm run check      # asset-coverage audit + TypeScript
npm start          # Remotion Studio
npm run render     # render -> finalize -> verify, in one command
npm run thumbnail  # the portrait thumbnail
```

`npm run assets` and `npm run audio` are required after a fresh clone: both
produce files that are deliberately not tracked (see *Repository layout*).

### Why `render` has three stages

`npm run render` runs `render:raw` → `scripts/finalize.py` → `scripts/verify_output.py`,
because Remotion's muxer needs two corrections before the file is the
deliverable:

1. **Length.** The audio stream is written longer than the composition
   (~89.2 s against 88.0 s) and the video is then padded by a frame or two to
   cover it, landing at 88.03–88.07 s. `finalize.py` cuts the video to exactly
   2,640 packets with a **stream copy** — lossless, no second video encode.
2. **The last second.** Within the final second the muxer overlaps a chunk of
   the mix, so the composition's own closing fade does not survive into the
   file. `finalize.py` decodes the audio, cuts it to exactly 88.000 s and
   applies a 0.6 s cosine fade, so the ending is a clean monotonic decay to
   silence (−83 dBFS at the boundary) regardless of what the muxer left there.

**Audio/video sync is not affected by any of this** — a sample-level comparison
of an isolated range render against the full render aligns at exactly zero lag.
Only length and the tail needed correcting. `verify_output.py` asserts all of
it: frame count, duration, resolution, frame rate, both streams present, audio
neither silent nor clipped, and no audio running past the last video frame.

---

## The three constraints that shaped every decision

### 1. All 109 assets must appear

The repository holds 105 stills and 4 clips. Every one of them has to be in the
finished reel — near-duplicates and multiple angles included. Across 2,640
frames that is **~0.8 seconds per asset** if spread evenly, so the edit is built
around rapid montage, quick multi-asset grids and a strobe hook rather than
lingering hero shots.

Placement runs in two tiers, both audited:

- **Primary (72 assets)** — hero cards, montage grids and the four clips, all
  inside the 250–1580 px safe band, composed to be individually legible.
- **Ambient (37 assets)** — soft, blurred tiles drifting through the top
  (0–250 px) and bottom (1580–1920 px) bands, where losing the detail to a
  device crop costs nothing.

`src/lib/assets.ts` is the contract; `scripts/check_coverage.mjs` fails the
build if a single asset is missing, duplicated, or if a clip is not placed in
the primary tier (which would mean its motion never plays).

### 2. Instagram safe-zone geometry, full frame

There is no reserved dead centre square. Content is composed across the whole
frame, but nothing a viewer must *read* enters the bands where Instagram paints
its own UI.

| Zone | Pixels | Contents |
|---|---|---|
| Top ambient | 0 – 250 | Blurred asset tiles only |
| **Primary safe band** | **250 – 1580** | Everything critical |
| Bottom ambient | 1580 – 1920 | Blurred asset tiles only |
| Side margins | 78 px each | Nothing critical crosses inward |

The persistent partner strip sits at y 1462–1554 — *inside* the safe band,
because contact details are critical content.

`scripts/check_safezone.py` verifies this off rendered pixels: it counts ink-dark
pixels inside the forbidden regions on every scene still. The ambient bands are
washed toward paper by design, so a dark pixel there can only be escaped content.

### 3. The four clips must play as motion

The source clips are natively **1600 × 500 @ 23.976 fps** — a wide letterbox
crop that is neither the 9:16 canvas nor 16:9. Each is placed as a sharp band at
its true aspect ratio, with a heavily blurred, scaled copy of the same footage
filling the card above and below it. **The subject is never cropped into.**

Playback is **1× throughout**. The pace comes from trimming to a chosen segment
and cutting away — never from speeding the footage up.

| Clip | Native | Segment used | On screen |
|---|---|---|---|
| Model 12 | 18.52 s | from 7.60 s — the camera gliding the fader bank | 2.50 s |
| Model 16 | 15.93 s | from 6.20 s — a hand working the desk | 2.33 s |
| Model 24 | 12.26 s | from 9.60 s — hands across a lit console | 2.50 s |
| Model 2400 | 21.19 s | from 2.40 s — a hand travelling the flagship surface | 2.67 s |

Studio Bridge has no clip. That is correct, not a gap — its coverage is 100 %
stills.

---

## Structure

| Act | Scenes | Frames | Seconds |
|---|---|---:|---:|
| 0 · Philosophy hook | S01 strobe · S02 the range as a ladder | 300 | 10.0 |
| 1 · Model 12 | S03 hero · S04 **clip** · S05 HUI/MCU · S06 workflow | 390 | 13.0 |
| 2 · Model 16 | S07 hero · S08 **clip** · S09 SD capture · S10 live rig | 360 | 12.0 |
| 3 · Model 24 | S11 hero · S12 **clip** · S13 100 mm faders · S14 case study | 420 | 14.0 |
| 4 · Model 2400 | S15 hero · S16 **clip** · S17 master bus · S18 in the room | 480 | 16.0 |
| 5 · Studio Bridge | S19 the pivot · S20 DB-25 · S21 system diagrams | 390 | 13.0 |
| 6 · Close | S22 the range together · S23 five prices · S24 CTA | 300 | 10.0 |

Ordering follows the creative brief: ascending scale, then architectural
distillation. Studio Bridge's act is built on **subtraction** — its opening beat
strikes through FADERS, MIC PREAMPS and CHANNEL EQ — so it never reads as a
fifth mixer.

---

## Audio

Everything is synthesised from scratch in `scripts/gen_audio.py` using numpy and
scipy — biquad filters, explicit envelopes, comb-filter reverb, stereo widening.
**No sampled library and no hosted audio-generation service is used anywhere.**

Three layers:

1. **`ambient-bed.mp3`** — a continuous low drone plus filtered room texture,
   present in all 2,640 frames.
2. **`music-bed.mp3`** — 88.000 s in six zones following the brief's music arc:
   lo-fi and intimate for the Model 12, warmer live drums for the 16, sweeping
   large-format layers for the 24 and 2400, then an abrupt strip-back to a clean
   arpeggiator for Studio Bridge, and a resolve for the close.
3. **35 SFX** — a wide transition palette plus TASCAM-specific mechanical
   accents (`fader-slide`, `knob-detent`, `relay-click`, `meter-ripple`,
   `sd-insert`, `db25-lock`, `transport-arm`) cued to what the hardware is
   actually doing on screen, not just to generic cuts.

Levels are deliberately forward — final balancing happens in post.
`scripts/audit_audio.py` fully decodes every file to PCM and checks duration and
true peak before any scene is allowed to reference a cue.

`public/vo/voiceover-reel-tascam.mp3` is a **silent 88.000 s placeholder**. Drop
the recorded read in at that path; no code change is needed.

---

## Typography

Ported structurally from the MOTU UltraLite-mk5 / 828 reel: **Barlow Condensed**
600/700/800 for display, **Inter** variable for UI and body, **JetBrains Mono**
variable for the technical layer. Faces are vendored into `public/fonts` and
loaded through the FontFace API behind `delayRender`, so a 2,640-frame render
never waits on a network fetch.

What was *not* ported is the dark-background scrim. Colour is re-derived for the
light ground: dark ink on paper, with a white plate behind copy only where it
overlaps photography.

| Role | Colour | Contrast on `#F2F1ED` |
|---|---|---|
| Ink | `#141A22` | 15.4 : 1 |
| Body | `#3A4350` | 8.7 : 1 |
| Caption | `#69727F` | 4.6 : 1 |
| Model 12 | `#1663C7` | 5.6 : 1 |
| Model 16 | `#0A6B5C` | 5.4 : 1 |
| Model 24 | `#B23C08` | 5.5 : 1 |
| Model 2400 | `#A6143A` | 7.2 : 1 |
| Studio Bridge | `#54329C` | 8.1 : 1 |
| Pricing | `#7E5F0E` | 5.4 : 1 |

---

## No logo files

Neither the TASCAM logo nor the Shivansh Electronics logo is added anywhere in
the reel or the thumbnail — they are placed by hand afterwards. Branding is
present as text only. Where a product photograph has a TASCAM badge printed on
the hardware, it is left exactly as shot.

---

## Repository layout

```
src/
  Reel.tsx            composition root: scene plan, audio layers, programme fade
  Thumbnail.tsx       1080x1920 portrait thumbnail
  lib/
    theme.ts          palette, safe-zone geometry, the 24-scene timing table
    assets.ts         the compulsory-coverage manifest and clip trim points
    copy.ts           every on-screen string, pricing, per-product identity
    sfx.ts            cue table — a sound on every cut, accents on hardware motion
    fonts.ts          vendored FontFace loading behind delayRender
    anim.ts           easing, springs, Ken Burns
  components/         Type, Photo, Clip, Frame (safe zone + ambient rails), Strip, Bits
  scenes/             act0 … act6, one file per act
scripts/
  prepare_assets.py   mirror root assets into public/ under render-safe ids
  gen_audio.py        synthesise beds + SFX + silent VO placeholder
  audit_audio.py      decode and validate every audio file
  check_coverage.mjs  assert all 109 assets are placed exactly once
  stills.mjs          one still per scene (--guides for the safe-zone overlay)
  check_safezone.py   pixel-level safe-zone compliance check
  finalize.py         trim to exactly 2640 frames and clean the audio tail
  verify_output.py    final delivery check on the rendered MP4
```

**Not tracked, regenerate locally:** `public/img/` and `public/video/` are
byte-identical mirrors of assets already tracked at the repository root —
duplicating ~90 MB of binaries in git would slow every clone. `npm run assets`
recreates them deterministically.

---

## The long-form video (298 s / 1920×1080)

A companion piece in this same project: a 5-minute landscape walkthrough of
the same five products, sharing the reel's palette, type system and
per-product accent colors, extended for a format with ~2.7 s of average
runtime per asset instead of the reel's ~0.8 s.

| | |
|---|---|
| Canvas | 1920 × 1080, 30 fps |
| Runtime | **298.000 s — 8,940 frames exactly** |
| Assets used | **109 / 109**, same manifest discipline as the reel |
| Render | `out/tascam-model-series-longform.mp4` |
| Thumbnail | `out/thumbnail-tascam-longform.png` |
| Voiceover script | [`VO_SCRIPT_LONGFORM_TASCAM.md`](VO_SCRIPT_LONGFORM_TASCAM.md) |
| Coverage ledger | [`ASSET_COVERAGE_LONGFORM.md`](ASSET_COVERAGE_LONGFORM.md) |
| Project zip | `out/tascam-project-source.zip` — self-contained; `unzip`, `npm install`, `npm run assets`, `npm run render` / `npm run render:lf` reproduce either video independently |

### What's different from the reel

- **Full frame, no Instagram safe zone.** This is a direct-file landscape
  delivery, not a feed/story format, so there's no platform-UI overlap risk
  and no reserved band. The only rule is a 56px margin for *critical text* —
  background and hero photography may touch the true edge.
- **No logo files added in the reel; both added here, repeatedly.** This
  repository has no TASCAM or Shivansh Electronics logo image files (checked
  again for this video — still true), so both brands appear as styled text
  wordmark cards (`BrandCard`, `src/components/lf/BrandCard.tsx`) rather than
  a fabricated graphic mark. Shivansh Electronics recurs continuously (a
  persistent corner strip plus a dedicated branding beat in every product
  chapter — worst-case gap ~0.7s, verified by `npm run branding:lf`); TASCAM
  appears at 6 deliberate moments including mid-video, not just open/close.
- **Sequential hero + coverage-sweep, not dense montage.** Each product
  chapter runs hero → clip-motion → a small named-feature `BeatCycle` → a
  `GallerySweep` clearing the rest of that product's pool in cross-dissolving
  groups of ~4. The reel's tight per-cut pacing wasn't needed at this
  runtime; genuine explanatory depth was.
- **Longer clip trims.** 3–6s segments (vs. the reel's ~2.5s) — still 1x
  speed, still cut-away-from rather than played through, per the shared
  trim discipline in `lib/lf-assets.ts` / `LF_CLIPS`.
- **Ten chapters**, scaled from the creative brief's own 180s ratio to this
  project's real 298s, plus two chapters the brief didn't need to budget for
  at reel length: a dedicated Real-World Workflows chapter (matching each
  product to who actually uses it) and a Range Together chapter (the
  Model 2400 ↔ Studio Bridge "same engine, different form factor"
  relationship).

### Structure

| Chapter | Frames | Seconds |
|---|---:|---:|
| Cold Open | 600 | 20 |
| Family Overview (shared DNA + signal-flow diagram) | 540 | 18 |
| Model 12 | 1080 | 36 |
| Model 16 | 900 | 30 |
| Model 24 | 1080 | 36 |
| Model 2400 (flagship — largest single-product share) | 1740 | 58 |
| Real-World Workflows | 600 | 20 |
| Studio Bridge (musical/tonal pivot, built on subtraction) | 1260 | 42 |
| Range Together | 420 | 14 |
| Pricing + Outro | 720 | 24 |
| **Total** | **8940** | **298.000** |

### Audio

Reuses the reel's own validated 35-clip SFX palette (`public/audio/sfx/` is
shared between both videos — it's generic transition/mechanical sound, not
reel-specific, so synthesising it twice would be pure waste) plus 4 new SFX
unique to this video's beat vocabulary (`chapter-swell`, `gallery-tick`,
`brand-chime`, `chapter-out`), and its own 298.000s music bed and ambient bed
following the same ten-chapter energy arc. `scripts/gen_audio_longform.py` /
`npm run audio:lf` generates and validates all of it.

### Commands

```bash
npm run audio:lf          # synthesise + validate the LF-specific beds and 4 new SFX
npm run check:lf          # LF asset-coverage audit + TypeScript
npm run stills:lf         # one still per LF scene
npm run edgemargin:lf     # pixel-level edge-margin review
npm run branding:lf       # timestamped Shivansh/TASCAM cadence report
npm run render:lf         # render -> finalize -> verify, in one command
npm run thumbnail:lf      # the landscape thumbnail
npm run package           # rebuild the safety-net project zip
```

### Why `render:lf` also has three stages

Same reasoning as the reel's `render` (see above): Remotion's muxer writes
audio longer than the composition and overlaps a chunk of the mix in the
final second. `LFReel.tsx` applies a `lfTail()` envelope across the last 20
frames on every audio layer — learned directly from building the reel first
— so `finalize.py --lf` cuts to exactly 8,940 packets and rebuilds the tail
as a clean 1.2s fade, landing in genuine silence rather than a clipped decay.
