/**
 * LAYER 2 — the sound set, mapped to beat kinds.
 *
 * Every file here is synthesised by scripts/synth_sfx.py from first principles
 * (filtered noise, damped resonators, short exponential envelopes); none is a
 * library sample. The mapping is deliberately sparse: a sound fires on beats
 * where something MECHANICAL happens on screen — a plate seats, a value
 * latches, a connector registers, a transport engages — and nowhere else.
 * Scoring every beat would turn the layer into texture, which is the thing a
 * sound design layer is supposed not to be.
 *
 * Gains sit between 0.10 and 0.22 against a bed at 0.34, leaving the voiceover
 * the headroom scripts/audit_audio.py checks for.
 */
import type { BeatKind } from "./beat.ts";

export interface Sfx { file: string; at: number; gain: number }

export const SFX_FOR: Partial<Record<BeatKind, Sfx>> = {
  cold:      { file: "phase-mark.wav",       at: 6,  gain: 0.18 },
  statement: { file: "spec-latch.wav",       at: 14, gain: 0.13 },
  macro:     { file: "trs-insert.wav",       at: 18, gain: 0.15 },
  sweep:     { file: "fader-throw.wav",      at: 16, gain: 0.14 },
  hero:      { file: "phase-mark.wav",       at: 12, gain: 0.20 },
  specs:     { file: "spec-latch.wav",       at: 28, gain: 0.16 },
  compare:   { file: "knob-rotary.wav",      at: 30, gain: 0.13 },
  tripath:   { file: "data-tick.wav",        at: 82, gain: 0.17 },
  db25:      { file: "db25-seat.wav",        at: 30, gain: 0.22 },
  timecode:  { file: "transport-engage.wav", at: 24, gain: 0.19 },
  realvideo: { file: "sdxc-seat.wav",        at: 14, gain: 0.14 },
  brandbeat: { file: "phase-mark.wav",       at: 10, gain: 0.16 },
  outro:     { file: "phase-mark.wav",       at: 8,  gain: 0.15 },
};
