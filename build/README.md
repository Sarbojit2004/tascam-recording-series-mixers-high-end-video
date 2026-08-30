# TASCAM Model series — Shivansh Electronics

Four deliverables, built from one codebase:

| Deliverable | Canvas | Runtime | Composition |
|---|---|---|---|
| Long-form Part 1 | 1920×1080 | 300 s (5:00) | `longform` → `LongFormPart1` |
| Long-form Part 2 | 1920×1080 | 299 s (4:59) | `longform` → `LongFormPart2` |
| Long-form Part 3 | 1920×1080 | 299 s (4:59) | `longform` → `LongFormPart3` |
| Reel 1 — The Tri-Path Survey | 1080×1920 | 178 s (2:58) | `reels` → `Reel1TriPathSurvey` |
| Reel 2 — The Flagship and the Specialist | 1080×1920 | 178 s | `reels` → `Reel2FlagshipSpecialist` |
| Reel 3 — The Transparent Bridge | 1080×1920 | 178 s | `reels` → `Reel3TransparentBridge` |

The three parts sum to exactly 898 s and share one continuous music bed — each
plays its own window of the same file, so watching all three back to back gives
one piece of music rather than the same opening bars three times.

Each deliverable ships with a timecoded recording script (`docs/voiceover/`);
posters live in `out/thumbnail-*.png`.

## Branding: strips in the body, logos at the end

The Shivansh and TASCAM marks appear **only on end screens** — every part and
every reel closes with the same block: both marks, the "Authorized Partner of
TASCAM" line, and all five contact channels behind their own icons. Nothing in
`branding.tsx` draws a mark anywhere else, and `audit_contact.mjs` fails the
build if a strip plan targets an end screen or a logo appearance escapes one.

The body instead carries **contact strips**: one icon and the detail it
identifies. Five channels rotate — website, Instagram, Facebook, YouTube, and
WhatsApp, which always shows all three numbers together on one line behind a
single icon. Strips slide in from the nearest edge, hold, and leave; the next
appears elsewhere. Nothing is pinned.

Where they may land differs by canvas, because the two have different empty
space:

- **Portrait** has 180 px above the content and 220 px below it, reserved as a
  caption-safe band and otherwise empty. Strips live there and nowhere else, so
  a collision with content is impossible by construction rather than avoided by
  care.
- **Landscape** has no such band, so each beat kind declares the corners its own
  layout leaves free (`LANDSCAPE_SLOTS` in `contactplan.ts`) and strips go
  there. Full-bleed B-roll carries a top scrim so a strip over dark footage
  stays legible.

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
| `audit_longform.mjs` | each part is its declared length and ends with an end screen; the three sum to 898 s; every asset id resolves; every figure exists in `spec.ts`; no pricing or competitor term is typeset; every unit is covered |
| `audit_reels.mjs` | the same, per reel, at 178 s, plus portrait montage limits and distinct openings |
| `audit_contact.mjs` | no strip lands on an end screen or outlives its beat; contact is never absent longer than 26 s; no two consecutive strips share a slot; no slot takes more than a third; all five channels circulate; the WhatsApp line carries all three numbers |
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
- **No logo in the body of any deliverable.** The marks belong to the end
  screens; the body markets the contact details instead.
