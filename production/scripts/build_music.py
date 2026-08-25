#!/usr/bin/env python3
"""
LAYER 1 — MUSIC BEDS. One distinct track per deliverable, zero repetition.

Eight full-length instrumental tracks with isolated stems were supplied as
background bed material. Four are used, one per deliverable; four go unused by
definition, which Section 9 states is expected and correct.

Allocation was decided from actual waveform/spectral analysis, not titles:

  LONG-FORM   Idiosyncrasies (Gavin Luke)          226.5s  71.8bpm  centroid 514Hz  HF 0.012
              The darkest and least bright of the eight, with almost no high
              end to fight a specification-dense voiceover, and the longest, so
              898s needs the fewest passes. 4 stems -> one arrangement per
              Stage 7 narrative phase.
  REEL 1      Stay For A Minute (Windshield)       210.0s  89.1bpm  centroid 1147Hz
              Forward motion for a fast four-console survey. Covers 178s natively.
  REEL 2      Box of Black Pearls (Vivera)         226.5s  99.4bpm  centroid 961Hz
              The most assertive of the eight; suits flagship + specialist depth.
              Covers 178s natively.
  REEL 3      Like the Palm of Your Hand (Harper Rey) 148.8s 80.7bpm centroid 584Hz
              Flattest dynamics (12.7dB) and least-coloured of the eight, which
              is thematically exact for a unit whose entire claim is zero
              coloration. 29.25s short of 178s, so it opens on a pad built from
              its OWN bass+instrument stems rather than a crude loop.

Stems stay phase-locked to a single shared playhead at all times, so the music
is always harmonically and rhythmically correct; only WHICH stems are audible
changes over time. That is what stops four passes of a 226s track reading as a
loop across 898 seconds.
"""
import json, os, subprocess, sys
import numpy as np

SR = 48000
HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(os.path.dirname(os.path.dirname(HERE)), "sfx-audio-files")
OUT = os.path.join(os.path.dirname(HERE), "assets", "audio")
os.makedirs(OUT, exist_ok=True)

def load(path):
    r = subprocess.run(["ffmpeg", "-v", "error", "-i", path, "-ac", "2", "-ar", str(SR),
                        "-f", "f32le", "-"], capture_output=True)
    if r.returncode != 0: sys.exit(f"decode failed: {path}\n{r.stderr.decode()[:400]}")
    return np.frombuffer(r.stdout, dtype=np.float32).reshape(-1, 2).astype(np.float64)

def tile(x, n, xf_sec=5.0):
    """Repeat to n samples with an equal-power crossfade at every seam."""
    if len(x) >= n: return x[:n]
    xf = int(xf_sec * SR)
    out = np.zeros((n, 2)); pos = 0; first = True
    while pos < n:
        seg = x.copy()
        if first:
            take = min(len(seg), n - pos); out[pos:pos+take] += seg[:take]; pos += take - xf; first = False
        else:
            f = np.linspace(0, 1, xf)[:, None]
            head = min(xf, n - pos)
            out[pos:pos+head] = out[pos:pos+head] * np.cos(f[:head] * np.pi / 2) ** 2 \
                              + seg[:head] * np.sin(f[:head] * np.pi / 2) ** 2
            pos += head
            take = min(len(seg) - xf, n - pos)
            if take <= 0: break
            out[pos:pos+take] = seg[xf:xf+take]; pos += take - xf
    return out

def env(points, n):
    """Linear breakpoint automation. points = [(seconds, gain), ...]"""
    t = np.array([p[0] for p in points]) * SR
    g = np.array([p[1] for p in points], dtype=float)
    return np.interp(np.arange(n), t, g)[:, None]

def fades(x, fin=1.6, fout=2.6):
    n = len(x); a = int(fin * SR); b = int(fout * SR)
    x[:a] *= np.linspace(0, 1, a)[:, None] ** 1.6
    x[-b:] *= (np.cos(np.linspace(0, np.pi / 2, b))[:, None]) ** 2
    return x

def write(name, x, seconds):
    n = int(round(seconds * SR))
    assert len(x) == n, f"{name}: {len(x)} samples, expected {n}"
    peak = np.abs(x).max()
    if peak > 0: x = x * (0.66 / peak)                       # bed headroom for VO
    b = (np.clip(x, -1, 1) * 32767).astype("<i2").tobytes()
    p = os.path.join(OUT, f"{name}.wav")
    hdr = b"RIFF" + (36 + len(b)).to_bytes(4, "little") + b"WAVEfmt " + (16).to_bytes(4, "little") \
        + (1).to_bytes(2, "little") + (2).to_bytes(2, "little") + SR.to_bytes(4, "little") \
        + (SR * 4).to_bytes(4, "little") + (4).to_bytes(2, "little") + (16).to_bytes(2, "little") \
        + b"data" + len(b).to_bytes(4, "little")
    open(p, "wb").write(hdr + b)
    rms = 20 * np.log10(np.sqrt((x ** 2).mean()) + 1e-12)
    print(f"  {name:34s} {seconds:7.3f}s  {len(x):>10,} samples  rms {rms:6.1f} dBFS")
    return p

def build(name, seconds, base, stems, arrangement, offset=0.0, pad=None):
    n = int(round(seconds * SR))
    parts = {}
    for k, f in stems.items():
        s = load(os.path.join(SRC, f))
        if offset: s = s[int(offset * SR):]
        parts[k] = s
    ln = min(len(v) for v in parts.values())
    for k in parts: parts[k] = parts[k][:ln]

    if pad:                                  # Reel 3 only: pads built from its own stems
        # 148.75s of source against a 178s runtime. Rather than one long intro
        # ramp (which scored the opening hook to near-silence) or letting the
        # source's own dead ending land under the Level 3 contact screen, the
        # shortfall is split: a short lead-in pad, and a sustained outro pad
        # that holds presence through the closing telemetry.
        lead = int(pad["lead"] * SR)
        tailn = int(pad["tail"] * SR)
        n_body = n - lead - tailn
        body = np.zeros((n_body, 2))
        for k, points in arrangement.items():
            body += tile(parts[k], n_body) * env([(t, g) for t, g in points], n_body)

        intro = np.zeros((lead, 2))
        for k in pad["stems"]:
            intro += tile(parts[k], lead) * pad["gain"]
        intro *= env([(0, 0.55), (pad["lead"] * 0.5, 1.0), (pad["lead"], 1.0)], lead)

        # The outro starts EARLY (it overlaps the body's decay) so it must be
        # sized to the span it actually has to cover, right through to the last
        # sample — not to `tail` alone, which would leave a silent gap.
        xf_o = int(7.0 * SR)
        start = lead + n_body - xf_o
        outro_n = n - start
        outro = np.zeros((outro_n, 2))
        for k in pad["stems"]:
            outro += tile(parts[k], outro_n) * pad["gain"]
        outro *= env([(0, 1.0), (outro_n / SR * 0.75, 0.94), (outro_n / SR, 0.74)], outro_n)

        # The source's own ending decays to near-silence, so the outro pad is
        # OVERLAPPED onto the body's tail rather than butted after it — that
        # keeps presence under the Level 3 contact screen instead of leaving a
        # 3-second hole where the source happens to stop.
        xf_i = int(1.6 * SR)
        fi = np.linspace(0, 1, xf_i)[:, None]
        intro[-xf_i:] *= np.cos(fi * np.pi / 2) ** 2
        fo = np.linspace(0, 1, xf_o)[:, None]
        outro[:xf_o] *= np.sin(fo * np.pi / 2) ** 2
        out = np.zeros((n, 2))
        out[:lead] += intro
        out[lead:lead + n_body] += body
        out[start:] += outro
    else:
        out = np.zeros((n, 2))
        for k, points in arrangement.items():
            out += tile(parts[k], n) * env([(t, g) for t, g in points], n)
    return write(name, fades(out), seconds)


S = lambda t: t   # readability in the arrangement tables below

print("Layer 1 — music beds, one distinct track per deliverable:\n")

# ---------------------------------------------------------------- LONG-FORM
# Idiosyncrasies. Arrangement follows Stage 7's four phases exactly:
#   Ph1 problem 0-120     sparse, unresolved: instruments only
#   Ph2 solution 120-680  builds as the architecture is proven, tier by tier
#   Ph3 graft 680-830     strips back hard — the Studio Bridge's own tonal shift
#   Ph4 resolve 830-898   settles and decays
build("longform-music-bed", 898.0, None, {
    "inst":  "ES_Idiosyncrasies STEMS INSTRUMENTS - Gavin Luke.mp3",
    "bass":  "ES_Idiosyncrasies STEMS BASS - Gavin Luke.mp3",
    "drums": "ES_Idiosyncrasies STEMS DRUMS - Gavin Luke.mp3",
    "mel":   "ES_Idiosyncrasies STEMS MELODY - Gavin Luke.mp3",
}, {
    "inst":  [(0,.62),(120,.80),(210,.80),(680,.55),(700,.62),(830,.85),(898,.85)],
    "bass":  [(0,.00),(110,.00),(130,.55),(680,.60),(700,.30),(820,.30),(840,.62),(898,.62)],
    "drums": [(0,.00),(205,.00),(230,.42),(500,.55),(672,.55),(686,.00),(830,.00),(848,.40),(898,.40)],
    "mel":   [(0,.00),(495,.00),(520,.45),(672,.50),(686,.00),(836,.00),(856,.52),(898,.52)],
})

# ------------------------------------------------------------------- REEL 1
build("reel1-music-bed", 178.0, None, {
    "inst":  "ES_Stay For A Minute (Instrumental Version) STEMS INSTRUMENTS - Windshield.mp3",
    "bass":  "ES_Stay For A Minute (Instrumental Version) STEMS BASS - Windshield.mp3",
    "drums": "ES_Stay For A Minute (Instrumental Version) STEMS DRUMS - Windshield.mp3",
}, {
    "inst":  [(0,.70),(30,.80),(154,.80),(178,.70)],
    "bass":  [(0,.00),(28,.00),(34,.60),(154,.62),(178,.55)],
    "drums": [(0,.00),(28,.00),(36,.46),(150,.50),(160,.30),(178,.28)],
}, offset=8.0)

# ------------------------------------------------------------------- REEL 2
build("reel2-music-bed", 178.0, None, {
    "inst":  "ES_Box of Black Pearls (Instrumental Version) STEMS INSTRUMENTS - Vivera.mp3",
    "bass":  "ES_Box of Black Pearls (Instrumental Version) STEMS BASS - Vivera.mp3",
    "drums": "ES_Box of Black Pearls (Instrumental Version) STEMS DRUMS - Vivera.mp3",
}, {
    "inst":  [(0,.72),(24,.82),(148,.82),(178,.70)],
    "bass":  [(0,.00),(22,.00),(28,.58),(148,.60),(178,.50)],
    "drums": [(0,.00),(22,.00),(30,.44),(86,.48),(92,.44),(146,.48),(158,.26),(178,.24)],
}, offset=12.0)

# ------------------------------------------------------------------- REEL 3
# 148.75s source against a 178s runtime. The 29.25s shortfall is covered by an
# intro pad built from this track's OWN bass + instrument stems, no drums —
# musically the same material, not a crude loop.
build("reel3-music-bed", 178.0, None, {
    "inst":  "ES_Like the Palm of Your Hand STEMS INSTRUMENTS - Harper Rey.mp3",
    "bass":  "ES_Like the Palm of Your Hand STEMS BASS - Harper Rey.mp3",
    "drums": "ES_Like the Palm of Your Hand STEMS DRUMS - Harper Rey.mp3",
    "mel":   "ES_Like the Palm of Your Hand STEMS MELODY - Harper Rey.mp3",
}, {
    "inst":  [(0,.74),(120,.80),(148.75,.80)],
    "bass":  [(0,.55),(120,.60),(148.75,.52)],
    "drums": [(0,.00),(10,.00),(18,.38),(120,.42),(140,.24),(148.75,.20)],
    "mel":   [(0,.00),(40,.00),(52,.44),(130,.50),(148.75,.50)],
}, pad={"lead": 8.0, "tail": 28.25, "stems": ["bass", "inst", "mel"], "gain": 0.72})

print("\nUNUSED (4 of 8, expected and correct): ACTIVE - A P O L L O, Fable - Jakob Ahlbom,")
print("Impossible Theory - Rachel Sandy, The Light from Within - Howard Harper-Barnes")
