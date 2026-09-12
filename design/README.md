# Model series — social slides

Ten editorial slides built from the frames in this repository, in the same
design system as the Sonicview set.

| Folder | Size | Use |
|---|---|---|
| `square-2160x2160/` | 2160 × 2160 | Instagram feed — **the delivered set** |
| `vertical-2160x3840/` | 2160 × 3840 | Built first, superseded by the square set, **never reviewed** |

`_contact-sheet.png` in each folder shows all ten together.

## The composition

One display line set to the full measure, a photograph punched through it, a
wide lower photograph, a figure caption beneath it, and a plate register beside
it — then the branding rail on a white colophon.

The square canvas keeps its width and loses 44% of its height, so a two-line
display stack cannot reach the measure at any size that also leaves room for a
photograph and a register. The word is therefore set whole, at whatever size
fills 1096: 219px for STUDIOBRIDGE, 300px for the short ones. The ten share one
measure and vary in scale.

**Tracking is capped at 3% of the size, which is why some Model lines end
short.** The Sonicview words are 8–10 letters and reach the measure on their
own. Several Model words are seven — SURFACE, ROUTING, STUDIOS, BETWEEN — and
the vertical budget already pins the size at 300px, so they cannot reach the
measure by growing, only by being pulled apart. Uncapped they needed 20–36px of
letter-spacing and stopped reading as words at all (SURFACE became SU‑‑‑CE).
Capped, they end at 86–95% of the measure, which is a ragged display line rather
than a row of loose letters.

## The forward text layer

Where the photograph covers the display line, the buried part of the type is
brought forward over it at 36% rather than being lost. This is per-pixel, not
per-letter: a glyph half behind the chassis keeps its exposed half at full
strength and only its buried half comes forward, and the transition happens
exactly on the product's outline.

The headline is drawn twice. The base layer stays behind the photograph at full
opacity — that is what renders every uncovered part unchanged. A second copy
sits above it, masked by the hero's own alpha, at 36%. Where the product does
not cover the line the mask is empty, so nothing paints and the base layer shows
through untouched.

Note that a CSS `mask-image` is fetched as a **cross-origin** resource and
Chromium blocks `file://` for those, even though an `<img>` from the same path
loads fine. Without `--allow-file-access-from-files` the mask silently resolves
to nothing and the layer never paints, with no error raised.

## Rules the build holds to

- Every product photograph and both logos appear in their **original colour**,
  unmodified. Nothing is desaturated, filtered or AI-regenerated. Frames
  carrying an ICC profile are converted to sRGB so PIL and Chromium agree on the
  numbers — the correct rendition of the photograph, not a recolour of it.
- All textures (halftone, paper grain) are generated programmatically.
- Only four informational items appear: the TASCAM logo, the Shivansh
  Electronics logo, the website, and the WhatsApp icon with the three numbers.
- No social handles, email, pricing, unverified specification claims, or a
  call-to-action sentence.

`verify_sq.py` measures these rather than asserting them. Latest run on the
square set — 10/10 exact at 2160 × 2160; 100 placements, 100 distinct, none
unplaced, no duplicates; worst per-channel colour drift **0.73 of 255**; no
prohibited content; and **zero pixels altered outside any product silhouette**
by the forward text layer.

Two masks keep that measurement honest rather than flattering:

- The overlay tints the product inside the letterforms by design, so the
  renderer also writes a `control/` frame per slide with the layer hidden and
  the colour check measures that. The overlay is then audited separately, for
  containment.
- The red diagonal rule and the solid block are drawn over the photographs on
  purpose, and a tall hero reaches into both. Left in, they read as a +4.35 red
  lift in the hero's bottom third while its top two thirds sit at the resampling
  floor. Masked, every hero returns to that floor.

## Rebuilding

```
python3 prep_all.py                 # mattes, trims and textures -> build/
SERIES=ms python3 build_sq.py       # the square set
SERIES=ms python3 verify_sq.py      # the measurement pass
```

`build_sq.py` and `verify_sq.py` are shared with the Sonicview set and select
between them with `SERIES=sv|ms`, so a fix lands on both rather than drifting
between two copies. They resolve assets relative to their own working layout
(`../../ms/build/`, `../../ms/fonts/`); adjust for wherever you run them from.
`prep_all.py` expects this repository's frames at the path in its `ROOT`.
