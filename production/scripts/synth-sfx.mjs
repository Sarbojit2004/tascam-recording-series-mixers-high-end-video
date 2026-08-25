/**
 * LAYER 2 — TRANSITION / FOLEY PALETTE, SYNTHESISED FRESH.
 *
 * Section 9 makes fresh synthesis UNCONDITIONAL for this project, not a
 * fallback: the eight supplied music tracks contain no transition material of
 * any kind, and the MOTU AVB reference's own SFX files are consulted for
 * design ideology only, never reused file-for-file. AVB's palette was built
 * around rack interfaces and network switches (RJ-45 locks, gPTP chimes, AVB
 * handshake pings) and simply has no equivalent for a 100 mm fader in its
 * track, a rotary gain pot, an SDXC slot, a transport button, a TRS insert or
 * a 25-pin DB25 shell.
 *
 * Inherited from AVB as ideology (Section 0.2):
 *   - everything synthesised from raw PCM, no external audio service
 *   - NO cinematic low-frequency whooshes; every element high-passed >= 900 Hz
 *     so nothing muddies the music bed or masks the voiceover
 *   - tactile and physical rather than designed/sweetened
 *   - deterministic PRNG, so every build produces byte-identical output
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const OUT = resolve(dirname(fileURLToPath(import.meta.url)), "../assets/audio/sfx");
mkdirSync(OUT, { recursive: true });
const SR = 48000;

/* ------------------------------------------------------------ primitives */
const buf = (sec) => new Float32Array(Math.round(SR * sec));
const decay = (i, n, tau) => Math.exp((-i / n) * tau);

function rng(seed) {
  let s = seed >>> 0;
  return () => (((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296) * 2 - 1);
}
function noise(sec, seed) {
  const x = buf(sec), r = rng(seed);
  for (let i = 0; i < x.length; i++) x[i] = r();
  return x;
}
function biquad(x, b0, b1, b2, a1, a2) {
  let z1 = 0, z2 = 0;
  const y = new Float32Array(x.length);
  for (let i = 0; i < x.length; i++) {
    const o = b0 * x[i] + z1;
    z1 = b1 * x[i] - a1 * o + z2;
    z2 = b2 * x[i] - a2 * o;
    y[i] = o;
  }
  return y;
}
const hp = (x, f, q = 0.707) => {
  const w = (2 * Math.PI * f) / SR, a = Math.sin(w) / (2 * q), c = Math.cos(w), a0 = 1 + a;
  return biquad(x, (1 + c) / 2 / a0, -(1 + c) / a0, (1 + c) / 2 / a0, (-2 * c) / a0, (1 - a) / a0);
};
const lp = (x, f, q = 0.707) => {
  const w = (2 * Math.PI * f) / SR, a = Math.sin(w) / (2 * q), c = Math.cos(w), a0 = 1 + a;
  return biquad(x, (1 - c) / 2 / a0, (1 - c) / a0, (1 - c) / 2 / a0, (-2 * c) / a0, (1 - a) / a0);
};
const bp = (x, f, q = 4) => {
  const w = (2 * Math.PI * f) / SR, a = Math.sin(w) / (2 * q), c = Math.cos(w), a0 = 1 + a;
  return biquad(x, a / a0, 0, -a / a0, (-2 * c) / a0, (1 - a) / a0);
};
/** Damped sine partial — the body of every metallic/resonant element. */
function partial(x, freq, tau, amp, phase = 0) {
  for (let i = 0; i < x.length; i++)
    x[i] += amp * Math.sin((2 * Math.PI * freq * i) / SR + phase) * decay(i, x.length, tau);
  return x;
}
function mix(dst, src, gain = 1, atSec = 0) {
  const off = Math.round(atSec * SR);
  for (let i = 0; i < src.length; i++) { const j = i + off; if (j >= 0 && j < dst.length) dst[j] += src[i] * gain; }
  return dst;
}
function deClick(x, ms = 3) {
  const n = Math.min(Math.round((ms / 1000) * SR), Math.floor(x.length / 2));
  for (let i = 0; i < n; i++) {
    const g = 0.5 - 0.5 * Math.cos((Math.PI * i) / n);
    x[i] *= g; x[x.length - 1 - i] *= g;
  }
  return x;
}
function norm(x, peak = 0.9) {
  let m = 0; for (const v of x) m = Math.max(m, Math.abs(v));
  if (m > 0) for (let i = 0; i < x.length; i++) x[i] *= peak / m;
  return x;
}
/** A short contact event: transient + metallic partials. The atom of every
 *  connector, latch and button in this palette. */
function contact(sec, seed, freqs, tau, bright = 1) {
  const x = buf(sec);
  mix(x, hp(noise(sec * 0.25, seed), 2600 * bright), 0.55);
  freqs.forEach((f, k) => partial(x, f, tau, 0.5 / (k + 1)));
  return deClick(hp(x, 900), 1.5);
}
function writeWav(name, x) {
  norm(x);
  const n = x.length, b = Buffer.alloc(44 + n * 2);
  b.write("RIFF", 0); b.writeUInt32LE(36 + n * 2, 4); b.write("WAVE", 8);
  b.write("fmt ", 12); b.writeUInt32LE(16, 16); b.writeUInt16LE(1, 20);
  b.writeUInt16LE(1, 22); b.writeUInt32LE(SR, 24); b.writeUInt32LE(SR * 2, 28);
  b.writeUInt16LE(2, 32); b.writeUInt16LE(16, 34);
  b.write("data", 36); b.writeUInt32LE(n * 2, 40);
  for (let i = 0; i < n; i++) b.writeInt16LE(Math.max(-32767, Math.min(32767, Math.round(x[i] * 32767))), 44 + i * 2);
  writeFileSync(resolve(OUT, `${name}.wav`), b);
  return { name, sec: +(n / SR).toFixed(3) };
}

/* ------------------------------------------------------------- the palette */
const made = [];

// 1. A long-throw fader moving in its track. MECHANICAL FRICTION, NOT A CLICK —
//    the brief calls this out specifically. Filtered noise whose band centre
//    rides upward as the cap travels, with an accelerate/cruise/decelerate
//    velocity envelope and a fine grain modulation from the track wiper.
{
  const sec = 0.62, x = buf(sec), n = x.length, src = noise(sec, 0x51ade1);
  const stages = [1500, 2100, 2900, 3600, 4200];
  const bands = stages.map((f) => bp(src, f, 5.5));
  const r = rng(0x9f21a);
  for (let i = 0; i < n; i++) {
    const t = i / n;
    const vel = Math.sin(Math.PI * Math.min(1, t * 1.06)) ** 0.75;   // ease in/out travel
    const pos = t * (stages.length - 1);
    const k = Math.min(stages.length - 2, Math.floor(pos));
    const f = pos - k;
    const grain = 1 + 0.34 * Math.sin(i * 0.09) + 0.16 * r();        // wiper texture
    x[i] = (bands[k][i] * (1 - f) + bands[k + 1][i] * f) * vel * grain * 0.8;
  }
  made.push(writeWav("fader-throw", deClick(hp(x, 950), 12)));
}

// 2. Rotary gain / EQ knob: fine, CONTINUOUS resistance rather than stepped
//    detents — a dense train of sub-millisecond wiper contacts under one arc.
{
  const sec = 0.44, x = buf(sec), r = rng(0x2b0b);
  for (let t = 0.004; t < sec - 0.02; t += 0.0092 + 0.0026 * r()) {
    const prog = t / sec;
    const env = Math.sin(Math.PI * prog) ** 0.6;
    mix(x, contact(0.016, (t * 1e5) | 0, [4200 + 900 * prog, 6100], 26, 1.15), 0.2 * env, t);
  }
  mix(x, bp(noise(sec, 0x77), 2400, 3), 0.05);
  made.push(writeWav("knob-rotary", deClick(hp(x, 1100), 8)));
}

// 3. SDXC card seating: friction slide, then the spring latch takes it.
{
  const sec = 0.34, x = buf(sec), sl = bp(noise(0.17, 0x5dca), 2300, 3.2);
  for (let i = 0; i < sl.length; i++) sl[i] *= 0.25 + 0.75 * (i / sl.length);
  mix(x, deClick(sl, 6), 0.5, 0.0);
  mix(x, contact(0.07, 0x5d1, [2450, 3820, 5300], 30), 0.95, 0.175);
  mix(x, partial(buf(0.1), 6400, 34, 0.18), 0.5, 0.18);              // spring return
  made.push(writeWav("sdxc-seat", deClick(hp(x, 1000), 4)));
}

// 4. Transport button (Play / Stop / Record) engaging.
{
  const x = buf(0.13);
  mix(x, contact(0.05, 0x7a4, [1850, 2900, 4400], 34), 1.0, 0.0);
  mix(x, contact(0.05, 0x7a5, [1600, 2600], 42), 0.32, 0.036);       // key bottoming out
  made.push(writeWav("transport-engage", deClick(hp(x, 950), 3)));
}

// 5. TRS insert cable seating in a send/return jack: tip passes the ring
//    contact, then the sleeve seats in the shell.
{
  const x = buf(0.2);
  mix(x, contact(0.035, 0x7125, [3250, 5150], 40, 1.2), 0.62, 0.0);
  mix(x, contact(0.075, 0x7126, [2150, 3400, 4800], 28), 1.0, 0.028);
  made.push(writeWav("trs-insert", deClick(hp(x, 950), 3)));
}

// 6. DB25 MULTI-PIN SEATING — new for this build. Explicitly distinct from a
//    single XLR or TRS: 25 pins make contact in a dense, slightly staggered
//    cascade rather than one event, and the shell is heavier, so the seat is
//    longer, grainier and lower in centre frequency, finished by the jackscrew.
{
  const sec = 0.46, x = buf(sec), r = rng(0xdb25);
  for (let p = 0; p < 25; p++) {                                     // the pin cascade
    const t = 0.012 + (p / 25) * 0.115 + 0.004 * r();
    mix(x, contact(0.02, 0xdb00 + p, [3400 + 700 * r(), 5200 + 900 * r()], 34, 1.1), 0.2 + 0.08 * r(), t);
  }
  mix(x, contact(0.16, 0xdb90, [1150, 1780, 2450], 20), 1.0, 0.125); // shell seats
  const screw = bp(noise(0.17, 0xdbf), 3100, 5);                     // jackscrew bite
  for (let i = 0; i < screw.length; i++) screw[i] *= (1 - i / screw.length) * (1 + 0.5 * Math.sin(i * 0.055));
  mix(x, deClick(screw, 6), 0.34, 0.27);
  made.push(writeWav("db25-seat", deClick(hp(x, 900), 5)));
}

// 7. XLR latch — the Tri-Path Splitter's entry event.
{
  const x = buf(0.12);
  mix(x, contact(0.045, 0x11c, [2700, 4300, 6100], 36, 1.15), 1.0, 0.0);
  mix(x, contact(0.03, 0x11d, [5200], 46), 0.3, 0.042);
  made.push(writeWav("xlr-lock", deClick(hp(x, 1100), 3)));
}

// 8. USB / binary data-stream texture for the routing animations.
{
  const sec = 0.72, x = buf(sec), r = rng(0x0da7a);
  for (let t = 0; t < sec - 0.02; t += 0.0105) {
    if (r() < -0.15) continue;
    mix(x, deClick(bp(noise(0.007, (t * 9e4) | 0), 7000 + 1800 * r(), 9), 0.8), 0.34, t);
  }
  made.push(writeWav("data-tick", deClick(hp(x, 3000), 10)));
}

// 9. MIDI / MTC clock pulse for the Timecode Synchronization Pulse.
{
  const x = buf(0.26);
  partial(x, 1580, 15, 0.5); partial(x, 3160, 22, 0.2); partial(x, 4740, 30, 0.07);
  mix(x, hp(noise(0.01, 0x11d1), 4000), 0.3);
  made.push(writeWav("midi-pulse", deClick(hp(x, 950), 3)));
}

// 10. Level 1 hero-metric latch — a precise two-tone confirmation.
{
  const x = buf(0.19);
  mix(x, contact(0.06, 0x5eca, [2100, 3150], 30), 1.0, 0.0);
  partial(x, 3150, 13, 0.16); partial(x, 4200, 18, 0.06);
  made.push(writeWav("spec-latch", deClick(hp(x, 1000), 3)));
}

// 11. Phase / chapter boundary. The heaviest element in the palette and still
//     high-passed at 900 Hz — this is deliberately NOT a cinematic sub-drop.
{
  const x = buf(1.0);
  partial(x, 920, 7, 0.42); partial(x, 1380, 9, 0.26); partial(x, 1840, 12, 0.14);
  partial(x, 2760, 17, 0.06);
  mix(x, deClick(bp(noise(0.4, 0x9a5e), 2200, 2.5), 20), 0.16);
  made.push(writeWav("phase-mark", deClick(hp(x, 900), 6)));
}

console.log(`Layer 2 — ${made.length} sounds synthesised fresh (48 kHz mono, HP >= 900 Hz):`);
for (const m of made) console.log(`   ${m.name.padEnd(18)} ${m.sec.toFixed(3)}s`);
