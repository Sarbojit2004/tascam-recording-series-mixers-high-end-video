import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import { existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
const CHROME=["/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell"].find(existsSync);
const PROJ=resolve(dirname(fileURLToPath(import.meta.url)),"..");
const serveUrl=await bundle({entryPoint:resolve(PROJ,"src/index.ts"),onProgress:()=>{}});
const comp=await selectComposition({serveUrl,id:"LongFormSilent",inputProps:{},browserExecutable:CHROME});
for (const gl of ["swangle","angle"]) {
  for (const f of [+process.argv[2], +process.argv[3]]) {
    await renderStill({composition:comp,serveUrl,output:resolve(PROJ,`out/gl-${gl}-${f}.png`),
      frame:f,browserExecutable:CHROME,imageFormat:"png",chromiumOptions:{gl}});
  }
}
console.log("done");
