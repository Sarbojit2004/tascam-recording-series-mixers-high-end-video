// Coverage + editorial audit:  node scripts/audit.mjs
// 1. every one of the 105 stills is placed in its model's scene (hero view or film strip),
//    on the image wall and in the outro carousel
// 2. no full stop anywhere in on-screen copy (a dot is allowed only between digits or in the web address)
import fs from "node:fs";

const assets = JSON.parse(fs.readFileSync("src/assets.json", "utf8"));
const slugs = Object.keys(assets.img);
const data = fs.readFileSync("src/data.ts", "utf8");
let fail = 0;

// product scenes own every still of their model: views are listed, photos = all the rest of that model
const views = [...data.matchAll(/"((?:m12|m16|m24|m2400|sb)-\d\d)"/g)].map((m) => m[1]);
const owners = { m12: ["m12"], m16: ["m16"], m24: ["m24", "cs"], m2400: ["m2400", "cmp"], sb: ["sb"] };
const owned = new Set(Object.values(owners).flat());
for (const s of slugs) {
  if (!owned.has(assets.img[s][3])) {
    console.log("UNOWNED", s);
    fail++;
  }
}
for (const v of new Set(views)) if (!slugs.includes(v)) (console.log("MISSING VIEW", v), fail++);
if (assets.cards.length !== slugs.length) (console.log("CARDS", assets.cards.length, "!=", slugs.length), fail++);
for (const s of slugs) if (!fs.existsSync(`public/rec/img/${s}.webp`)) (console.log("NO FILE", s), fail++);

// full stops in on-screen copy: string literals and JSX text in the scene files
const strip = (t) => t.replace(/shivanshelectronics\.in/g, "");
for (const f of ["src/Reel.tsx", "src/Thumb.tsx", "src/data.ts"]) {
  const src = fs.readFileSync(f, "utf8");
  const texts = [
    ...[...src.matchAll(/say\("([^"]*)"\)/g)].map((m) => m[1]),
    ...[...src.matchAll(/>[ \t]*([A-Za-z][^<>{}\n;()=&|]*?)[ \t]*</g)].map((m) => m[1]),
    ...[...src.matchAll(/(?:name|family|line|word|title|sub|extra|k): "([^"]*)"/g)].map((m) => m[1]),
  ];
  for (const t of texts) if (/\.(?!\d)/.test(strip(t))) (console.log("FULL STOP", f, JSON.stringify(t)), fail++);
}
console.log(`stills ${slugs.length}, cards ${assets.cards.length}, hero views ${new Set(views).size} — ${fail ? fail + " problem(s)" : "OK"}`);
process.exit(fail ? 1 : 0);
