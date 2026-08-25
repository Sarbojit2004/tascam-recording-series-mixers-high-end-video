/**
 * LAYER 2 CUE GENERATION.
 *
 * Cues are DERIVED from the beat schedule rather than authored separately, so
 * the standalone transition-SFX deliverable and the audio inside the MP4 are
 * generated from one source and cannot drift apart. Re-timing a beat re-times
 * its sounds automatically.
 *
 * The palette maps to this hardware's own physical vocabulary — a long-throw
 * fader in its track, a rotary gain pot, an SDXC slot, a transport button, a
 * TRS insert, and a 25-pin DB25 shell — none of which the MOTU AVB reference's
 * rack-interface/network-switch set contains.
 */
import type { Beat } from "./beat.ts";
import { frames, starts } from "./beat.ts";

export interface Cue {
  sfx: string;
  frame: number;
  gain?: number;
  pan?: number;
}

const FPS = 30;

export function buildCues(beats: Beat[]): Cue[] {
  const at = starts(beats, FPS);
  const cues: Cue[] = [];
  const push = (sfx: string, frame: number, gain = 0.7, pan = 0) => {
    if (frame >= 0) cues.push({ sfx, frame: Math.round(frame), gain, pan });
  };

  beats.forEach((b, i) => {
    const s = at[i];
    const d = frames(b.sec, FPS);

    // Phase boundaries get the heaviest element in the palette — still
    // high-passed at 900 Hz, deliberately not a cinematic sub-drop.
    if (b.phase) push("phase-mark", s, 0.62);

    switch (b.kind) {
      case "cold":
      case "repr":
        push("data-tick", s + 6, 0.2);
        if (b.hero) push("spec-latch", s + 10, 0.5);
        break;

      case "statement":
        push("spec-latch", s + 8, 0.42);
        break;

      case "unit":
        // A unit card lands like a console powering up: transport, then the
        // hero metric latching in.
        push("transport-engage", s + 6, 0.6);
        push("spec-latch", s + 12, 0.62);
        break;

      case "specs":
        push("knob-rotary", s + 8, 0.42, -0.2);
        (b.specKeys ?? []).forEach((_, k) => push("spec-latch", s + 16 + k * 8, 0.3));
        break;

      case "macro":
        // The pull-back resolves on a fader coming up under the hand.
        push("fader-throw", s + Math.round(d * 0.34), 0.5, 0.15);
        push("spec-latch", s + Math.round(d * 0.5), 0.5);
        break;

      case "sweep":
        // A lateral move along a connector row: the seating sound is chosen
        // to match the connector actually on screen.
        push(b.unit === "studiobridge" ? "db25-seat" : "trs-insert", s + 10, 0.6, -0.3);
        push("data-tick", s + Math.round(d * 0.45), 0.22, 0.2);
        break;

      case "montage":
        (b.images ?? []).forEach((_, k) => push("spec-latch", s + 12 + k * 7, 0.24));
        break;

      case "realvideo":
        push("transport-engage", s + 4, 0.55);
        break;

      case "schematic":
        push("trs-insert", s + 10, 0.38, -0.15);
        (b.images ?? []).forEach((_, k) => push("spec-latch", s + 16 + k * 11, 0.3));
        break;

      case "tripath": {
        // Timed against TriPathSplitter's own progress: XLR seats, the preamp
        // node energises, then all three destinations land together.
        push("xlr-lock", s + Math.round(d * 0.03), 0.72);
        push("knob-rotary", s + Math.round(d * 0.2), 0.3);
        push("fader-throw", s + Math.round(d * 0.6), 0.5, 0.25);
        push("sdxc-seat", s + Math.round(d * 0.6), 0.55, -0.25);
        push("data-tick", s + Math.round(d * 0.58), 0.3, 0.1);
        push("spec-latch", s + Math.round(d * 0.78), 0.44);
        break;
      }

      case "db25": {
        // The 25-pin cascade is the signature sound of this deliverable.
        push("db25-seat", s + Math.round(d * 0.34), 0.8);
        push("data-tick", s + Math.round(d * 0.06), 0.24, -0.3);
        push("spec-latch", s + Math.round(d * 0.62), 0.44);
        push("data-tick", s + Math.round(d * 0.76), 0.26, 0.3);
        break;
      }

      case "timecode": {
        // One pulse per ripple, on the graphic's own beat (see TimecodePulse).
        const beat = 0.115, emit = 0.2;
        for (let k = 0; k < 9; k++) {
          const t = emit + k * beat;
          if (t < 1) push("midi-pulse", s + Math.round(d * t), 0.4);
        }
        push("transport-engage", s + Math.round(d * 0.68), 0.5);
        break;
      }

      case "outro":
        push("spec-latch", s + 10, 0.5);
        push("transport-engage", s + Math.round(d * 0.42), 0.34);
        break;
    }
  });

  return cues.sort((a, b2) => a.frame - b2.frame);
}
