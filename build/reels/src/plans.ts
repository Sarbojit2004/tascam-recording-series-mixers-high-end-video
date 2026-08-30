/**
 * The three reels' contact-strip plans.
 *
 * `perBeat: 1` with the builder's own bump to two on any beat of 14 seconds or
 * more works out at roughly one channel every eleven seconds across a reel —
 * frequent enough that a viewer who joins part-way through still sees how to
 * make contact, without the strips becoming the thing they are watching.
 *
 * Each reel enters the five-channel rotation at a different point so that the
 * three of them do not all open on the website; every reel's own end screen
 * carries all five regardless.
 */
import { buildContactPlan } from "./shared/contactplan.ts";
import { REEL1, REEL2, REEL3 } from "./schedules.ts";

const opts = { portrait: true, perBeat: 1 };

export const PLAN1 = buildContactPlan(REEL1, { ...opts, channelFrom: 0 });
export const PLAN2 = buildContactPlan(REEL2, { ...opts, channelFrom: 2 });
export const PLAN3 = buildContactPlan(REEL3, { ...opts, channelFrom: 4 });
export const PLANS = { reel1: PLAN1, reel2: PLAN2, reel3: PLAN3 } as const;
