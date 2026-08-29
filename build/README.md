# TASCAM Model series — Shivansh Electronics

Four deliverables, built from one codebase:

| Deliverable | Canvas | Runtime | Composition |
|---|---|---|---|
| Long-form | 1920×1080 | 898 s (14:58) | `longform` → `LongForm` |
| Reel 1 — The Tri-Path Survey | 1080×1920 | 178 s (2:58) | `reels` → `Reel1TriPathSurvey` |
| Reel 2 — The Flagship and the Specialist | 1080×1920 | 178 s | `reels` → `Reel2FlagshipSpecialist` |
| Reel 3 — The Transparent Bridge | 1080×1920 | 178 s | `reels` → `Reel3TransparentBridge` |

Each ships with a poster (`out/thumbnail-*.png`) and a timecoded recording
script (`docs/voiceover/`).

## The argument

The five units are not five product tours. They are five answers to one claim,
the **tri-path**: a single Ultra-HDDA preamp stage feeds an analog mix bus, an
SD multitrack recorder and a USB interface *at the same time*, so one signal is
mixed, recorded and streamed without being split, re-amplified or converted
twice.

Every unit tests that claim. The Model 12 is it at its smallest; the Model 16
is it without a control surface; the Model 24 is it scaled; the Model 2400 is
it at full width with nothing traded away. The **Studio Bridge is the
counter-example** — the unit with no preamp at all, which is what proves the
preamp was the variable. It is deliberately last.

## Layout

```
build/
  shared/          everything both projects use, synced into each on build
    theme.ts       palette, canvases, spacing, caption-safe band
    fonts.ts       Fraunces / Archivo / JetBrains Mono, self-hosted
    spec.ts        the verified figures — the ONLY source of a number on screen
    assets.ts      the image / video / clip manifest
    beat.ts        the beat model and runtime arithmetic
    scenes.tsx     one renderer per beat kind, both orientations
    concepts.tsx   the three motion concepts
    branding.tsx   the four branding forms
    icons.tsx      the five channel marks, drawn as vectors
    logo.tsx       plate-stripped marks, placed directly on the page
    brandbuild.ts  derives a branding plan from a schedule
    vo.ts          the narration, keyed to beat id
  longform/        the 898 s landscape project
  reels/           the three 178 s portrait projects
  scripts/         asset preparation, audits, exports
  assets/          prepared masters (synced into each project's public/)
```

`shared/` is not a package — `scripts/sync.mjs` copies it into each project's
`src/shared/` and mirrors only the assets that project actually references.
Run it before any build; the render scripts already do.

## Building

```bash
cd build/longform && npm install      # and cd build/reels && npm install
node scripts/sync.mjs longform        # mirror shared/ + assets
node --experimental-strip-types scripts/audit_longform.mjs
npx remotion render LongForm out/tascam-model-series-longform.mp4
```

Run `node scripts/clean_bundles.mjs` before a long render — Remotion leaves a
~500 MB webpack bundle in `/tmp` per invocation, and forty of them will fill
the disk mid-render.

## The audits

Nothing renders until these pass. They are the reason the constraints hold.

| Script | Checks |
|---|---|
| `audit_longform.mjs` | runtime is exactly 898 s; every asset id resolves; every figure exists in `spec.ts`; no pricing or competitor term is typeset; every unit is covered; branding cadence |
| `audit_reels.mjs` | the same, per reel, at 178 s, plus portrait montage limits and distinct openings |
| `audit_brand.mjs` | Shivansh never absent longer than 28 s; no two consecutive marks share a slot; no slot takes more than a third; TASCAM appears noticeably less often; the contact set circulates |
| `audit_audio.py` | beds are at exact runtime, nothing clips, no dead air, sounds are high-passed clear of the voice band |
| `vo_check.mjs` | every beat has a narration entry; no line exceeds 78 % of its beat's speaking time |

## Constraints these enforce

- **No pricing, ever.** `FORBIDDEN.pricing` in `shared/brand.ts`; the audit
  greps the rendered copy, which is why "does not cost you the take" had to be
  rewritten rather than excused.
- **No competitor named.** Including MOTU — the MOTU productions are this
  build's structural reference, but naming them in a TASCAM video is not on.
- **Every figure verified.** `specValue()` throws on an unknown key, so an
  unverified number cannot be typeset at all.
- **Real photography is never cropped.** `fit()` solves a box at the asset's
  exact ratio and motion scales the *plate*, not the image inside it. The
  sixteen B-roll clips are the deliberate exception — they are generated
  footage and carry full editorial freedom.
- **Logos are placed directly on the page.** The supplied Shivansh file is
  97.9 % opaque; `scripts/prep_logos.py` keys off the white plate so what is
  drawn is bare artwork.
- **"Authorized Partner of TASCAM"**, with no territory clause.
