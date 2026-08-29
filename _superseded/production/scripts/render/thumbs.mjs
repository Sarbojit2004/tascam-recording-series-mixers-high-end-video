/**
 * Renders this project's thumbnail stills.
 *
 * One bundle serves every thumbnail in the project, so the reels' three
 * portrait stills cost one bundle rather than three.
 *
 *   node --experimental-strip-types scripts/thumbs.mjs Thumbnail:thumbnail-tascam-longform
 *   node --experimental-strip-types scripts/thumbs.mjs Reel1Thumbnail:thumbnail-tascam-reel-1 ...
 */
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import { existsSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const PROJ = resolve(HERE, "..");
const jobs = process.argv.slice(2).map((a) => {
  const [id, name] = a.split(":");
  if (!id || !name) throw new Error(`usage: thumbs.mjs <compositionId>:<outBasename> ...`);
  return { id, name };
});
if (!jobs.length) throw new Error("usage: thumbs.mjs <compositionId>:<outBasename> ...");

const CHROME = [
  "/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell",
  "/opt/pw-browsers/chromium-1194/chrome-linux/chrome",
].find(existsSync);

mkdirSync(resolve(PROJ, "out"), { recursive: true });
const serveUrl = await bundle({ entryPoint: resolve(PROJ, "src/index.ts"), onProgress: () => {} });

for (const { id, name } of jobs) {
  const composition = await selectComposition({ serveUrl, id, inputProps: {}, browserExecutable: CHROME });
  const output = resolve(PROJ, "out", `${name}.png`);
  await renderStill({
    composition, serveUrl, output, frame: 0,
    imageFormat: "png",
    browserExecutable: CHROME,
    chromiumOptions: { gl: "angle" },
  });
  console.log(`${id.padEnd(16)} ${composition.width}x${composition.height} -> out/${name}.png`);
}
