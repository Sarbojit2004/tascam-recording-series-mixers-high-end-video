# TASCAM Model Series & Studio Bridge — production

Four deliverables, built from the project's own Gemini pre-production brief
(`TASCAM Series Technical Production Brief.docx`, Stages 1–11) and the MOTU AVB
ecosystem's motion/SFX ideology.

| Deliverable | Canvas | Runtime | Frames | Output |
|---|---|---|---|---|
| Long-form | 1920×1080 | 898.000 s | 26,940 | `longform/out/parts/` + `scripts/join.sh` |
| Reel 1 — The Tri-Path Survey | 1080×1920 | 178.000 s | 5,340 | `reels/out/tascam-reel-1.mp4` |
| Reel 2 — The Flagship & The Specialist | 1080×1920 | 178.000 s | 5,340 | `reels/out/tascam-reel-2.mp4` |
| Reel 3 — The Transparent Bridge | 1080×1920 | 178.000 s | 5,340 | `reels/out/tascam-reel-3.mp4` |

## Layout

```
production/
  shared/          single source of truth — spec, theme, brand, beat model,
                   scene renderers, the three Stage 6 motion graphics
  longform/        Remotion project, 1920×1080
  reels/           Remotion project, three separated 1080×1920 compositions
  assets/          prepared asset mirror + manifest (generated)
  scripts/         asset prep, audio build, audit, packaging
```

`shared/` is the only place any of it is edited. `node scripts/sync.mjs
<longform|reels>` copies it plus the assets each project needs into that
project, so both ship as self-contained zips while staying one codebase.

## Rebuild

```bash
python3 scripts/prepare_assets.py     # enumerate, hash, classify, crop clips
python3 scripts/make_logos.py         # both logos, as supplied (opaque, white ground)
python3 scripts/knockout.py           # background treatment for light-ground stills
node    scripts/synth-sfx.mjs         # 11 Layer 2 sounds, synthesised fresh
python3 scripts/build_music.py        # 4 stem-built music beds
node --experimental-strip-types scripts/make-sfx-timeline.mjs longform   # (and reel1|reel2|reel3)
node    scripts/sync.mjs longform     # (and reels)

cd longform && npm install
node --experimental-strip-types scripts/render.mjs LongForm tascam-model-series-longform.mp4
node --experimental-strip-types scripts/thumbs.mjs Thumbnail:thumbnail-tascam-longform
```

Reels, from `reels/`:

```bash
node --experimental-strip-types scripts/render.mjs Reel1 tascam-reel-1.mp4   # and Reel2 | Reel3
node --experimental-strip-types scripts/thumbs.mjs \
  Reel1Thumbnail:thumbnail-tascam-reel-1 \
  Reel2Thumbnail:thumbnail-tascam-reel-2 \
  Reel3Thumbnail:thumbnail-tascam-reel-3
```

## Audits

```bash
node --experimental-strip-types scripts/audit.mjs          # coverage, clip reuse, content rules, branding rotation
node --experimental-strip-types scripts/check-vo-sync.mjs  # voiceover cues against beat boundaries
python3 scripts/audit_audio.py                             # SFX floor / clipping / high-pass discipline
python3 scripts/verify_output.py <mp4> <frames> <w> <h>    # the rendered file itself
```

## The 898-second render

GitHub hard-rejects any file over 100 MB and git-lfs is not available in this
environment, so the long-form ships as keyframe-aligned chunks:

```bash
./scripts/join.sh   # stream copy, no re-encode
```

The rejoined file was verified against the original as **bit-identical in audio
(zero sample difference across all 43,104,256 samples) and exact in frame count
(26,940)**.
