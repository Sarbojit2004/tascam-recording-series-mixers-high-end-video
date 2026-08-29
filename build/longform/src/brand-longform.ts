/**
 * The long-form's branding plan: the shared builder applied to this schedule.
 *
 * Its 898-second runtime is long enough that a mark on roughly every other beat
 * still holds Shivansh absence under the 28-second ceiling — the audit is what
 * actually proves that, and it re-derives the timeline from this exact plan.
 */
import { buildPlan } from "./shared/brandbuild.ts";
import { BEATS } from "./schedule.ts";

export const PLAN = buildPlan(BEATS);
