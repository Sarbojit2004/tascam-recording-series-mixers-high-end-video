# TASCAM Model Series & Studio Bridge — Delivery Record

Four deliverables for **Shivansh Electronics**, built on the four-tier architecture
established by the Gemini pre-production brief (Stages 1–11).

| Tier | Unit(s) | Character |
|---|---|---|
| 1 | Model 12 | Sub-Compact Digital-Forward Hybrid |
| 2 | Model 16, Model 24 | Classic Analog-Forward Hybrids (no MIDI, MTC, HUI/MCU) |
| 3 | Model 2400 | Advanced Flagship Hybrid |
| 4 | Studio Bridge | Transparent Digital Bridge — **outside** the console topology |

The Studio Bridge has no preamp stage, so it has nothing to split. It does **not**
participate in the Tri-Path Architecture, and `TriPathSplitter` throws if applied to it.

---

## 1 · Long-form (landscape)

| | |
|---|---|
| **File** | `longform/out/parts/chunk-00…08.mp4` → `scripts/join.sh` → `tascam-model-series-longform.mp4` |
| **Runtime** | 898.006 s · **26,940 frames** · 30 fps · 1920×1080 · 357.9 MB |
| **Thumbnail** | `longform/out/thumbnail-tascam-longform.png` (1920×1080) |
| **Music** | *Idiosyncrasies* — Gavin Luke (226.5 s, 71.8 BPM, 514 Hz centroid) |
| **Beats** | 57 |
| **Gemini clips** | 9, 10, 1, 15, 16, 17, 6, 3, 4 — nine of seventeen |
| **Real images** | 54 |
| **Real video** | Model 16, Model 24, Model 2400 — all at natural speed |
| **Motion concepts** | Tri-Path Splitter ×1 · DB25 Injection ×1 · Timecode Pulse ×2 |
| **VO script** | `VO_SCRIPT_TASCAM_LONGFORM_898S.md` — 1,283 narrated words, 57/57 cues on beat boundaries |

**Structure.** Phase 1 states the round-trip problem (120 s, 13.4 %). Phase 2 opens on the
Tri-Path Architecture itself (90 s) before walking the four consoles in ascending tier:
Model 12 (120 s), Model 16 (100 s), Model 24 (105 s), Model 2400 (145 s — the deepest
treatment, as the flagship). Phase 3 gives the Studio Bridge its own 150 s, framed as a
line-level graft onto a desk that already exists rather than as a fifth console. Phase 4
closes at 68 s.

**Why this order.** The film argues from signal flow, so it establishes the split before
showing any unit that performs it. The Model 2400 gets the most time because it is the only
unit where every thread of the argument — the split, DAW control and master clock —
converges. The Studio Bridge is held to the end precisely because it breaks the pattern:
placing it earlier would have implied peerage with the consoles.

---

## 2 · Reel 1 — The Tri-Path Survey (portrait)

| | |
|---|---|
| **File** | `reels/out/tascam-reel-1.mp4` · 74.0 MB |
| **Runtime** | 178.005 s · **5,340 frames** · 30 fps · 1080×1920 |
| **Thumbnail** | `reels/out/thumbnail-tascam-reel-1.png` (1080×1920) |
| **Music** | *Stay For A Minute* — Windshield (210.0 s, 89.1 BPM, 1147 Hz centroid) |
| **Beats** | 18 |
| **Gemini clips** | 14, 2, 5, 12 |
| **Real images** | 26 |
| **Motion concepts** | Tri-Path Splitter ×1 |
| **VO script** | `VO_SCRIPT_TASCAM_REEL1_TRIPATH_SURVEY.md` — 266 narrated words, 18/18 cues synced |

The one idea shared by all four consoles, and the only reel that carries all four. One
preamp, three simultaneous destinations — analog bus, SD card, USB — with the four units
surveyed as instances of that single principle rather than as a product list. The brightest
of the four music beds, matched to the survey's faster cut rate.

---

## 3 · Reel 2 — The Flagship & The Specialist (portrait)

| | |
|---|---|
| **File** | `reels/out/tascam-reel-2.mp4` · 69.4 MB |
| **Runtime** | 178.005 s · **5,340 frames** · 30 fps · 1080×1920 |
| **Thumbnail** | `reels/out/thumbnail-tascam-reel-2.png` (1080×1920) |
| **Music** | *Box of Black Pearls* — Vivera (226.5 s, 99.4 BPM, 961 Hz centroid) |
| **Beats** | 15 |
| **Gemini clips** | 11, 13, 7, 8 |
| **Real images** | 10 |
| **Real video** | Model 12 — natural speed |
| **Motion concepts** | Timecode Synchronisation Pulse ×2 |
| **VO script** | `VO_SCRIPT_TASCAM_REEL2_FLAGSHIP_SPECIALIST.md` — 311 narrated words, 15/15 cues synced |

Model 2400 (Tier 3) and Model 12 (Tier 1) are the only two units in the range with MIDI,
MTC and HUI/MCU emulation — the only two that can command a DAW and a master clock. The
framing beat states outright that they share **no** architectural tier; they are paired here
by capability alone, and the reel never implies otherwise. `TimecodePulse` is hard-guarded to
these two units.

---

## 4 · Reel 3 — The Transparent Bridge (portrait)

| | |
|---|---|
| **File** | `reels/out/tascam-reel-3.mp4` · 32.3 MB |
| **Runtime** | 178.005 s · **5,340 frames** · 30 fps · 1080×1920 |
| **Thumbnail** | `reels/out/thumbnail-tascam-reel-3.png` (1080×1920) |
| **Music** | *Like the Palm of Your Hand* — Harper Rey (148.8 s, 80.7 BPM, 584 Hz centroid) |
| **Beats** | 11 |
| **Gemini clips** | **none — deliberate** |
| **Real images** | 11 |
| **Motion concepts** | DB25 Injection ×1 |
| **VO script** | `VO_SCRIPT_TASCAM_REEL3_TRANSPARENT_BRIDGE.md` — 314 narrated words, 11/11 cues synced |

Tier 4, alone, on its own terms: 24 × 24 line-level I/O over AES59-2012 DB25, THD+N
≤ 0.003 %, no preamps and no faders. **No Gemini clip appears in this reel.** None of the
seventeen depicts a rack-mounted, preamp-less bridging unit, and using one that showed a
console would have contradicted the reel's entire argument. The reel runs on real
photography, the DB25 Injection graphic and the schematic instead — which is also why it is
the longest-per-beat and quietest of the three.

---

## Cross-deliverable guarantees

Every one of these was machine-audited, not eyeballed. `scripts/audit.mjs` re-derives them
from the schedules themselves and fails the build on any violation.

| Constraint | Result |
|---|---|
| Exact runtimes | 26,940 / 5,340 / 5,340 / 5,340 frames — all exact |
| **Gemini clip reuse** | 17/17 used, **each exactly once** across all four deliverables |
| **Music reuse** | 4 distinct tracks, zero overlap (4 of the 8 supplied go unused by definition) |
| **Real-asset coverage** | 101 images + 4 videos placed; per-deliverable counts 54 + 26 + 10 + 11 = **101**, a perfectly disjoint partition |
| **Zero pricing** | No amount, currency or commercial language anywhere — word-boundary audited |
| **No brand comparison** | The argument is entirely internal to TASCAM |
| Motion-concept scoping | Tri-Path → 4 consoles only · DB25 → Studio Bridge only · Timecode → Model 12 + Model 2400 only. Enforced by runtime guards, not convention. |
| Spec provenance | Every on-screen figure resolves through `specValue()`, which throws on any key not VERIFIED in Stage 8 |
| Model 16 fader travel | UNVERIFIED in Stage 8 → mechanically excluded (`null`), never stated |
| Product imagery | `object-fit: contain` throughout — the `Plate` component cannot crop |
| Real video | No `playbackRate` prop exists on `RealClip`; natural speed is unbypassable |
| Branding | Both supplied logos drawn **exactly as given** — opaque, white ground intact, no plate or backing added, nothing keyed. The Shivansh mark is on every eligible beat and **moves every beat**; the TASCAM mark, the socials and the three numbers rotate alongside it. See the table below. |
| Designation | "Authorised Partner of TASCAM" — deliberately not the distributor line used in the MOTU videos |
| Captions | None burned in; the VO scripts reserve a placeholder audio slot |

### Branding

Rebuilt to match the MOTU AVB and MOTU UltraLite-mk5 / 828 productions: the logo
files are used as supplied, opaque, with the white ground that was kept
deliberately, and with no box, card or plate added behind them. What differs
from the MOTU reference is placement — those anchor a corner lockup to one fixed
corner, whereas here the marks travel.

Six anchored slots (top / bottom × left / centre / right), reassigned every beat
by `shared/brandplan.ts`. The rail lives outside the caption-safe padding, which
is where no scene draws type, so it can move freely without ever colliding.

| Deliverable | Shivansh mark | Moves | Slots used | TASCAM | Socials | Numbers |
|---|---|---|---|---|---|---|
| Long-form | 56 / 56 beats | every beat (55/55) | 6/6 | 6 | 6 | 6 |
| Reel 1 | 17 / 17 beats | every beat (16/16) | 6/6 | 1 | 2 | 1 |
| Reel 2 | 14 / 14 beats | every beat (13/13) | 6/6 | 1 | 1 | 1 |
| Reel 3 | 10 / 10 beats | every beat (9/9) | 6/6 | 1 | 1 | 1 |

Counts exclude each film's outro beat, which carries the full legend instead:
both logos, the partner designation, the region, the website, all three social
channels and all three numbers. `scripts/audit.mjs` fails the build if the mark
ever misses an eligible beat, repeats a slot on consecutive beats, or if the
TASCAM mark is not less frequent than the Shivansh one.

This replaced an earlier mechanism — a fixed 60 %-opacity Shivansh watermark
locked to the top-right corner plus a static full-width Data Ribbon — which
keyed the mark to transparency and never moved. Both are gone, along with the
knocked-out logo variants they depended on.

### Audio deliverables

Eight standalone files, two per video, each spanning the exact runtime:

```
tascam-model-series-longform-music-bed.flac      898.000 s
tascam-model-series-longform-sfx-timeline.flac   898.000 s
tascam-reel-{1,2,3}-music-bed.flac               178.000 s
tascam-reel-{1,2,3}-sfx-timeline.flac            178.000 s
```

All 48 kHz / 16-bit stereo. Shipped as FLAC to stay under GitHub's file limit;
`scripts/audio-expand.sh` restores the WAVs losslessly.

The **11 Layer-2 transition sounds are synthesised fresh** for this build — pure-PCM
JavaScript, no sample library, no file inherited from the AVB work (its SFX were consulted
for ideology only). All are high-passed so as not to crowd narration: ≤ 0.20 % of energy
below 900 Hz, none clipped. `db25-seat` — a 25-pin staggered contact cascade, shell seat and
jackscrew — was written specifically for the Studio Bridge and has no AVB precedent.

Both the MP4 audio and the standalone SFX timeline are generated from `buildCues(BEATS)`,
so the stem and the film are derived from one source and cannot drift apart.

### Reconstructing the long-form

GitHub hard-rejects files over 100 MB and git-lfs is unavailable here, so the 898 s render
ships as nine keyframe-aligned segments:

```bash
cd production/longform && bash ../scripts/join.sh
```

The rejoin was verified **bit-identical on audio** (0 differing samples across 43,104,256)
and exact on frame count — re-confirmed against the committed chunks after push.
