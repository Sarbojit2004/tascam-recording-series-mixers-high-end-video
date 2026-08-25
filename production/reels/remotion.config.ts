import { Config } from "@remotion/cli/config";
import { existsSync } from "node:fs";

// This environment ships Chromium already and blocks remotion.media, so point
// Remotion at the local binary rather than letting it try to download one.
for (const c of [
  "/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell",
  "/opt/pw-browsers/chromium-1194/chrome-linux/chrome",
]) {
  if (existsSync(c)) { Config.setBrowserExecutable(c); break; }
}

Config.setVideoImageFormat("jpeg");
Config.setCodec("h264");
Config.setCrf(17);
Config.setPixelFormat("yuv420p");
Config.setOverwriteOutput(true);
Config.setChromiumOpenGlRenderer("angle");
Config.setDelayRenderTimeoutInMilliseconds(120000);
