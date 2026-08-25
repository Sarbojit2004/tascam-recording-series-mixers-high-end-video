import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition } from "@remotion/renderer";
import { existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
const CHROME=["/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell"].find(existsSync);
const PROJ=resolve(dirname(fileURLToPath(import.meta.url)),"..");
const [,,comp_id="LongFormSilent",gl="swangle",conc="3",a="3000",n="30"]=process.argv;
let t=Date.now();
const serveUrl=await bundle({entryPoint:resolve(PROJ,"src/index.ts"),onProgress:()=>{}});
console.log(`bundle ${((Date.now()-t)/1000).toFixed(1)}s`);
t=Date.now();
const comp=await selectComposition({serveUrl,id:comp_id,inputProps:{},browserExecutable:CHROME});
console.log(`select ${((Date.now()-t)/1000).toFixed(1)}s`);
t=Date.now();
await renderMedia({composition:comp,serveUrl,codec:"h264",outputLocation:resolve(PROJ,"out/bench.mp4"),
  browserExecutable:CHROME,crf:23,concurrency:+conc,chromiumOptions:{gl:gl==="none"?undefined:gl},
  frameRange:[+a,+a+ +n-1],
  onProgress:({renderedFrames})=>{ if(renderedFrames%10===0&&renderedFrames) console.log(`  ${renderedFrames}/${n} @ ${((Date.now()-t)/1000).toFixed(1)}s`);}});
const s=(Date.now()-t)/1000;
console.log(`RESULT gl=${gl} conc=${conc} from=${a}: ${n}f in ${s.toFixed(1)}s = ${(+n/s).toFixed(2)}fps -> full ${(26940/(+n/s)/60).toFixed(0)}min`);
