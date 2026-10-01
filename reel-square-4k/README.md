# TASCAM Recording Mixer Series — 60-second Square 4K Reel

A beat-locked reel for the **TASCAM Model 12, Model 16, Model 24, Model 2400 and Studio Bridge**,
produced for **Shivansh Electronics, TASCAM's Authorized Partner**.

| | |
|---|---|
| Reel | **2160 × 2160, 60 fps**, 60.78 s (3,647 frames), h264 + AAC 320 kbps |
| Music | *Mortals (Hindi)* — Zeus X Crona, Warriyo, Panther [NCS Release], **−14.0 LUFS** integrated |
| Thumbnail | **2160 × 3840** (9:16 portrait 4K), `out/tascam-recording-thumbnail-2160x3840.png/.jpg` |
| Stills used | **105 / 105** — every image in the repository, plus 18 B-roll / product clips |

## Why this edit is built the way it is

Metricool data for the account (Instagram reels, Sep 2026) showed the same problem on every recent
reel: only **17–36 %** of viewers stay past 3 seconds, average watch time is 4–20 s, and Facebook
reels average 1–3 s. The best performers opened with a **bold claim** ("1 CABLE DID ALL OF IT"
held 35 %), the weakest opened on a logo sting. So this reel:

- **opens on the hook, not a logo** — frame 0 is "24 TRACKS" over moving footage, then "NO
  COMPUTER", "ZERO LATENCY", "ONE DESK", one per beat, while a level bar fills to the drop;
- lands the **drop at 2.67 s** with a shockwave, flash and camera shake;
- changes something **on every beat** (0.67 s): product flips, background swaps, chips light up;
- keeps an **open loop** running — "01 / 05 … 05 / 05" and a progress bar promise more to come;
- runs a **live REC HUD** (timecode + 24-track meters driven by the beat) for constant motion;
- carries **no full stops** anywhere on screen (house rule; separators are commas or •).

## The music edit (`scripts/music.py`)

~89.55 BPM, bar 2.674 s, 4-bar phrases. Beats come from a dynamic-programming tracker on
spectral flux; downbeats are the beat phase with the most sub-bass.

| Reel | Song | |
|---|---|---|
| 0.00 – 42.67 s | 29.35 → 72.02 s | pre-hook bar, then **hook 1** (drop at 2.67 s) |
| 42.67 – 60.78 s | 109.35 → 127.46 s | pre-hook bar, then **hook 2** (drop at 45.34 s) |

The splice joins two pre-hook bars of the same function with a 40 ms equal-power crossfade that
ends on the downbeat. 1.0 s fade-in (the reel opens on energy), 2.0 s fade-out, pure-gain
normalisation to −14.0 LUFS (re-measured on the muxed file).

## Scene map — every change on a downbeat

| Bars | Scene | What happens |
|---|---|---|
| 0 | **Hook** | four claims, one per beat, over B-roll; product cut-outs fly in |
| 1–2 | **Drop** | TASCAM mark slams, the five machines rise onto the stage |
| 3–4 | **One preamp** | the Ultra-HDDA input splits into ANALOG MIX, SD RECORDER, USB INTERFACE — then all at once |
| 5–6 | **Model 12** 01/05 | 12 tracks; HUI/MCU, MIDI + MTC, smartphone mix-minus |
| 7–8 | **Model 16** 02/05 | 16 tracks; 14 inputs, 16-in/14-out USB |
| 9–10 | **Model 24** 03/05 | 24 tracks; 100 mm faders; case-study photos |
| 11–13 | **Model 2400** 04/05 | flagship; 4 stereo subgroups, 5 aux, master bus insert, HUI/MCU + MTC |
| 14–15 | **Studio Bridge** 05/05 | 24×24 DB25, no preamps on purpose |
| 16 | **Pick your size** | inputs and tracks count up model by model |
| 17–18 | **Record everything** | the four official product clips as widescreen bands, then the wall of all 105 stills |
| 19 → end | **Outro (10.1 s)** | rotating 3D carousel of every still, which folds into the partner card layout: TASCAM mark, *Model 12 • 16 • 24 • 2400*, Shivansh Electronics, *TASCAM's Authorized Partner*, three WhatsApp numbers, website and *Follow Shivansh Electronics* |

Each product scene flips one cut-out view per beat (CSS 3D, specular sweep), cycles that model's
photos behind it and streams every other still of the model through a film strip, so all 105
images appear in their own scene as well as on the wall and in the carousel.

Every figure on screen is marked VERIFIED in *TASCAM Series Technical Production Brief* (Stage 8
tables). No pricing. Logos are the transparent white TASCAM and Shivansh Electronics marks.

## Build

```bash
npm install                       # or symlink node_modules from another Remotion 4.0.497 project
npm run assets                    # 105 stills -> cut-outs / photos / cards, clips re-encoded
python3 scripts/music.py <Mortals mp3>
node scripts/audit.mjs            # coverage + no-full-stop rule
npx tsc --noEmit
END=3647 CONC=2 sh scripts/render.sh TascamRec tascam-rec-video   # silent 4K, chunked
npx remotion still TascamRecThumb out/tascam-recording-thumbnail-2160x3840.png --scale=2
```

The muxed master is split into playable parts under GitHub's 100 MB limit by `scripts/split.py`;
`*-JOIN.md` next to the parts has the one-line lossless rejoin command.

## Music credit

*Mortals (Hindi)* is an NCS release — free to use with credit: **"Music: Zeus X Crona, Warriyo,
Panther – Mortals (Hindi) [NCS Release]. Music provided by NoCopyrightSounds."**
