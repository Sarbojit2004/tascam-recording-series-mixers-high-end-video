/**
 * The long-form's contact-strip plans, one per part.
 *
 * Each part is planned independently so its slot usage and channel rotation
 * balance within the five minutes a viewer actually watches, rather than across
 * a fifteen-minute whole that nobody sees in one sitting. Part 2 and Part 3
 * enter the rotation further along so a viewer who watches all three in order
 * does not see the same channel open every part.
 */
import { buildContactPlan } from "./shared/contactplan.ts";
import { PART1, PART2, PART3 } from "./schedule.ts";

export const PLAN1 = buildContactPlan(PART1, { perBeat: 1, channelFrom: 0 });
export const PLAN2 = buildContactPlan(PART2, { perBeat: 1, channelFrom: 2 });
export const PLAN3 = buildContactPlan(PART3, { perBeat: 1, channelFrom: 4 });
export const PLANS = { part1: PLAN1, part2: PLAN2, part3: PLAN3 } as const;
