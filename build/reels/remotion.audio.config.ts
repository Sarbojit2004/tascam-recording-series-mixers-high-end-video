/**
 * A config used ONLY by scripts/remix_audio.sh, for audio-only renders.
 *
 * The main remotion.config.ts sets a CRF, which is a video-encoder setting the
 * WAV codec rejects outright — so an audio-only render cannot reuse it. This
 * carries the browser and GL settings the container needs and nothing else.
 */
import { Config } from "@remotion/cli/config";

Config.setBrowserExecutable("/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell");
Config.setChromiumOpenGlRenderer("angle");
Config.setOverwriteOutput(true);
Config.setConcurrency(4);
