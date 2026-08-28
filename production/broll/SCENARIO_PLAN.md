# Scenario Plan — Real-Image-Anchored B-Roll (Addendum Section 2)

## Discontinuation

The prior 17-clip text-only pipeline (`GEMINI 1–17…mp4`, generated from Stage 11's
generic-hardware prompts) is discontinued in full, per the user's explicit direction
that footage generated that way "has got no value." None of those 17 clips are used in
any deliverable going forward. Confirmed: none of them are currently placed in any
build — the long-form (`production/longform/src/schedule.ts`) and all three reels
(`production/reels/src/schedule{1,2,3}.ts`) reference `clip(n)` calls resolving to the
old files via `production/shared/assets.ts` and `assets/manifest.json`. Removing those
17 `clip` references, deleting the underlying files, and re-authoring the affected
beats to use the new library is scoped for after this plan's clips exist and are
verified (Section 5 gate) — that rebuild is not part of this addendum's own
deliverable.

## Total clip count: 12

Not a round number, not carried over from the prior 10 or 17. It is the count of
genuinely distinct, real-image-supported workflow claims across the five units once
near-duplicate coverage is refused: Model 12 (2), Model 16 (2), Model 24 (2), Model
2400 (2), Studio Bridge (4). Studio Bridge gets double the others' allocation because
it is the only unit with four *official TASCAM workflow diagrams* — not stock lifestyle
photography, but the manufacturer's own documentation of four genuinely different
deployment topologies — plus Stage 7's explicit instruction that it "earns its own
phase" rather than being folded into the console arc. Model 12/16/24/2400 each hold
real-image support for exactly two distinct claims; a third for any of them would have
meant reusing a visually near-identical "person at a DAW" or "engineer + laptop app"
shot already spent on a sibling scenario, which is padding, not support.

## Model 12 — Sub-Compact Digital-Forward Hybrid

**Stage 4 priorities:** #1 HUI/MCU Protocol DAW Emulation, #2 TRRS Mix-Minus Topology.
**Stage 2 motivation:** restoring tactile control lost to all-digital mixing; for M12
specifically, eliminating feedback loops in bidirectional broadcast routing.

1. **`broll-model12-hui-automation`** — "The Fader That Writes Itself." A hand moves a
   physical fader; the DAW screen behind it shows the automation lane recording the
   move in real time — HUI/MCU protocol translating a 60 mm fader gesture into digital
   automation data.
   Anchors: `TASCAM MODEL 12 (10).jpg`, `TASCAM MODEL 12 (14).jpg`
2. **`broll-model12-broadcast-bridge`** — "The Broadcast Bridge." The camera/video
   switcher's signal reaches the Model 12; TRRS mix-minus prevents the return audio
   from looping back into the presenter's ear; XLR main out feeds a streaming encoder.
   Anchor: `TASCAM MODEL 12 (8).jpg` (the official camera→Model12→VS-R265 diagram)

## Model 16 — Classic Analog-Forward Hybrid

**Stage 4 priority:** #1 4-Channel Tri-Path Signal Splitting.
**Stage 2 motivation:** restoring immediate tactile control; committing to EQ/compression
in the analog domain before the signal reaches the A/D converter.

3. **`broll-model16-committed-signal`** — "The Committed Signal." A hand turns a
   physical EQ/gain knob mid-set — the decision is made in the analog domain, before
   conversion, not deferred to a plugin later.
   Anchors: `TASCAM MODEL 16 (5).jpg`, `TASCAM MODEL 16 (9).jpg`
4. **`broll-model16-three-destinations`** — "Three Destinations, One Preamp." A
   top-down pass across the channel-strip array — the physical hardware whose signal
   the coded Tri-Path Splitter graphic (Stage 6) abstracts: one preamp, three
   simultaneous paths.
   Anchors: `TASCAM MODEL 16 (8).jpg`, `TASCAM MODEL 16 (11).jpg`

## Model 24 — Classic Analog-Forward Hybrid

**Stage 4 priority:** #1 24-Track Standalone SDXC Engine.
**Stage 2 motivation:** bulletproof reliability for live touring and remote field
recording, free of software-crash risk.

5. **`broll-model24-no-computer`** — "No Computer Required." A full band is tracked
   live to the desk's own SDXC engine — no laptop being babysat, no crash risk, just
   the take being captured.
   Anchor: `TASCAM MODEL 24 CASE STUDY (2).jpg`
6. **`broll-model24-stage-feed`** — "The Multi-Pin Stage Feed." A dense cable snake
   is patched into the rear panel under stage lighting; a hand reaches to mute a
   channel mid-set while a laptop nearby mirrors the levels remotely.
   Anchors: `TASCAM MODEL 24 (13).jpg`, `TASCAM MODEL 24 (15).jpg`, `TASCAM MODEL 24 (18).jpg`

## Model 2400 — Advanced Flagship Hybrid

**Stage 4 priorities:** #1 24-Channel Analog Summing with 4 Subgroups, #2 Integrated
MIDI/MTC/SPP Clocking.
**Stage 2 motivation:** eliminating peripheral sync hardware by centralising the
studio's master clock in the desk itself.

7. **`broll-model2400-bus-glue`** — "The Bus That Glues the Mix." A hand rides the
   Master Bus Processor's THRESH/ATTACK/RELEASE/MAKEUP knobs — the flagship's
   exclusive analog summing-bus compression, gluing a complex mix together before it
   ever reaches a DAW.
   Anchor: `TASCAM MODEL 2400 (9).jpg`
8. **`broll-model2400-one-clock`** — "One Clock, Every Machine." The signal reaches
   the desk's MIDI output; visually this is the real hardware the coded Timecode
   Synchronization Pulse graphic (Stage 6) abstracts into a ripple effect.
   Anchor: `TASCAM MODEL 2400 (10).jpg`

## Studio Bridge — Transparent Digital Bridge (own Stage 7 phase)

**Stage 4 priorities:** #1 4×24 DB25 AES59-2012 Line I/O, #2 Hardware DAW Transport
Control.
**Stage 2 motivation:** preserving a heavy investment in legacy analog gear; grafting
modern DAW transport and SD recording onto equipment that is otherwise digitally
isolated, without altering its analog character.

9. **`broll-studiobridge-stage-feed`** — "The Stage Feed, Captured." A live console's
   TRS sends route through 24 D-sub25 lines into the Studio Bridge's own multi-track
   recorder — no computer on stage, no DAW in the signal path.
   Anchor: `TASCAM STUDIO BRIDGE (18).jpg` (official diagram) + `(13).jpg` (live tracking)
10. **`broll-studiobridge-analog-digitized`** — "The Analog Desk, Digitized." A pure
    analog console, mic and instruments feeding it, and the Studio Bridge recording
    every channel with zero PC in the loop — the purest expression of the transparent
    graft.
    Anchor: `TASCAM STUDIO BRIDGE (20).jpg` (official diagram) + `(9).jpg` (overhead, in situ)
11. **`broll-studiobridge-bridging-timeline`** — "Bridging to the Timeline." The same
    analog console now connects through the Studio Bridge to a DAW over USB — the
    desk's signal reaching a modern timeline without ever touching a converter that
    isn't the Bridge's own.
    Anchor: `TASCAM STUDIO BRIDGE (19).jpg` (official diagram) + `(14).jpg` (cable connection)
12. **`broll-studiobridge-backup-preamps`** — "Backup Behind the Preamps." A rack of
    outboard mic preamps feeds the Studio Bridge, which quietly backs up the session
    to SD while the DAW records — the one configuration no other unit in this range
    can claim.
    Anchor: `TASCAM STUDIO BRIDGE (21).jpg` (official diagram) + `(17).jpg` (hardware
    transport control, tap-tempo/START-STOP — the desk is commanded without a screen)

## Explicitly excluded

- `TASCAM MODEL 24 VS MODEL 2400.jpg` — a same-brand tier-comparison graphic. Not a
  workflow scenario, and using it risks reading as a comparison even though it compares
  two TASCAM units against each other rather than against a competitor. Left unused.
- All software-screenshot-only images (`MODEL 12 (19)`, `MODEL 2400 (3)`) — UI chrome,
  not physical hardware in use; not strong enough on their own to anchor real-hardware
  video generation, though they remain available for on-screen graphic beats elsewhere
  in the edit if wanted.
- Repeated "person at DAW, unit partially visible" compositions across Model 12, 24 and
  2400 — visually near-identical to each other; using more than one per unit would have
  been coverage padding, not a new claim.

## Visual system note (per addendum §3's own fallback instruction)

No "corrected light-background, AVB-derived visual system" exists in this repository.
Stage 5's dark-void aesthetic (`COLOR.void = "#08090B"`, the near-black page with a
directional cool rim wash) is what is actually implemented for all four TASCAM
deliverables and is unchanged. Per the addendum's own fallback, generation requests
will ask Gemini to match each clip's own real reference image's actual lighting and
background — which varies legitimately by anchor (dark stage lighting for the live
shots, clean white/dark studio grounds for the hero and rear-panel macros, natural loft
light for the Studio Bridge tracking session) — rather than guessing at a palette that
was never built.

## Content rules carried forward

No on-screen text or graphic overlay baked into any generated clip (added later in the
Remotion edit). No Shivansh Electronics branding in the generated footage. No pricing.
The rule against showing real TASCAM hardware is reversed for this pipeline — showing
it accurately, consistent with the supplied reference image(s), is the entire point.
Every request targets exactly 10 seconds.
