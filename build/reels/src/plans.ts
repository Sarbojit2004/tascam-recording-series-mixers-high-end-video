/**
 * The three reels' branding plans.
 *
 * `everyBeat` is on because 178 seconds leaves no room to skip: at thirteen
 * beats a reel, marking every other one would open gaps of nearly forty
 * seconds. `tascamEvery: 4` keeps the TASCAM mark to roughly a quarter of the
 * Shivansh appearances — still noticeably less often (Section 10.3), but
 * present enough in a short piece to register at all.
 */
import { buildPlan } from "./shared/brandbuild.ts";
import { REEL1, REEL2, REEL3 } from "./schedules.ts";

const opts = { everyBeat: true, tascamEvery: 4 };

// Each reel enters the twelve-entry contact rotation a third of the way further
// along, so the three of them cover the whole set between them. Each reel's own
// closing block still carries every channel and all three numbers.
export const PLAN1 = buildPlan(REEL1, { ...opts, contactFrom: 0 });
export const PLAN2 = buildPlan(REEL2, { ...opts, contactFrom: 4 });
export const PLAN3 = buildPlan(REEL3, { ...opts, contactFrom: 8 });
export const PLANS = { reel1: PLAN1, reel2: PLAN2, reel3: PLAN3 } as const;
