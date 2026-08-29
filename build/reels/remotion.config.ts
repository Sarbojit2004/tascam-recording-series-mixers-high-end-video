import { Config } from "@remotion/cli/config";

Config.setVideoImageFormat("jpeg");
Config.setJpegQuality(95);
Config.setPixelFormat("yuv420p");
Config.setCodec("h264");
Config.setCrf(18);
Config.setOverwriteOutput(true);
/**
 * The session has no egress to remotion.media, so the bundled browser download
 * is not available; the pre-installed headless shell is used instead.
 *
 * GL BACKEND. "angle" measured 7.35 fps against "swangle"'s 1.97 fps on this
 * container — a 3.7x speedup — and a frame-by-frame comparison of the two came
 * back pixel-identical, so the faster backend costs nothing.
 */
Config.setBrowserExecutable("/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell");
Config.setChromiumOpenGlRenderer("angle");
Config.setConcurrency(4);
