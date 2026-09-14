"""A 16:9 landscape thumbnail at exactly 3840 x 2160, in the slides' design system.

A third composition rather than a stretched square. The canvas is now 1.78x as
wide as it is tall, which changes what the layout has to do:

  - The display line gets a 1948pt measure instead of 1096, so SONICVIEW sets at
    ~420px rather than ~280. That is the point of a thumbnail -- it has to carry
    at a hundred pixels wide, so the word is the picture.
  - The lower zone splits left-to-right rather than being squeezed: the family
    photograph takes the left, and the model register -- which on a slide is an
    index -- becomes the argument, because this is the thumbnail for a video
    covering every model in the series.
  - Everything else is unchanged and shared with the slides: the same tokens,
    the same red rule and diagonal, the same programmatic halftone and grain,
    the same branding rail, and the same forward text layer at 36%.
"""
import json, os, sys, string, time

# One landscape renderer, every series. SERIES names the sibling directory whose
# prepared assets to draw from, exactly as build_sq.py does for the slides, so a
# fix lands on all of them rather than drifting between copies.
SERIES = os.environ.get('SERIES', 'sv')
SP = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(SP)
SRC = os.path.join(ROOT, SERIES)
assert os.path.isdir(SRC), f'no such series directory: {SRC}'
from PIL import Image

OUT = os.path.join(SP, 'out'); os.makedirs(OUT, exist_ok=True)
PAGES = os.path.join(SP, 'pages'); os.makedirs(PAGES, exist_ok=True)
CHROME = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome'

TPL = string.Template(r'''<!doctype html><html><head><meta charset="utf-8">
<style>
@font-face{font-family:Anton;src:url('../../sv/fonts/Anton-400.woff2') format('woff2');
  font-weight:400;font-display:block}
@font-face{font-family:ArchivoN;src:url('../../sv/fonts/ArchivoNarrow-500.woff2') format('woff2');
  font-weight:100 900;font-display:block}
@font-face{font-family:PlexMono;src:url('../../sv/fonts/IBMPlexMono-Regular.ttf') format('truetype');
  font-weight:400;font-display:block}
@font-face{font-family:PlexMono;src:url('../../sv/fonts/IBMPlexMono-Bold.ttf') format('truetype');
  font-weight:700;font-display:block}
:root{--paper:#F2F1EC;--ink:#151412;--red:#D5211B;--rule:#B6B2A8;--pad:92px;--cw:1736px}
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:1920px;height:1080px}
body{background:var(--paper);color:var(--ink);font-family:ArchivoN,'Arial Narrow',sans-serif;
  -webkit-font-smoothing:antialiased;overflow:hidden}
.slide{position:relative;width:1920px;height:1080px;overflow:hidden;background:var(--paper)}

.grain{position:absolute;inset:0;background-image:url('../../sv/build/grain.png');
  background-size:256px 256px;mix-blend-mode:multiply;opacity:.30;z-index:2}
.grain2{position:absolute;inset:0;background-image:url('../../sv/build/grain.png');
  background-size:97px 97px;mix-blend-mode:multiply;opacity:.16;z-index:3}

.top{position:absolute;left:var(--pad);top:52px;width:var(--cw);z-index:20}
.top .lbls{display:flex;justify-content:space-between;align-items:flex-end}
.top .lbls span{font-family:Anton,sans-serif;font-size:42px;line-height:1;
  letter-spacing:.055em;text-transform:uppercase}
.top .bar{height:6px;background:var(--red);margin-top:12px}

.halftone{position:absolute;right:0;top:132px;width:760px;height:400px;z-index:4;
  background-image:url('../../sv/build/halftone.png');background-size:100% 100%}

.head{position:absolute;left:-14px;top:150px;width:1948px;z-index:10}
.hl{font-family:Anton,sans-serif;color:var(--red);line-height:.815;
  letter-spacing:-.008em;white-space:nowrap;text-transform:uppercase}
.hl span{display:inline-block}
.hero{position:absolute;z-index:14}
.hero img{display:block;width:100%;height:auto}
.over{position:absolute;left:0;top:0;width:100%;z-index:15;opacity:.36;pointer-events:none;
  -webkit-mask-repeat:no-repeat;mask-repeat:no-repeat;mask-mode:alpha}

.band{position:absolute;left:0;z-index:12;overflow:hidden}
.band img{display:block;width:100%;height:100%;object-fit:cover;object-position:center}
.bandtag{position:absolute;z-index:22;background:var(--paper);padding:7px 12px;
  font-family:PlexMono,monospace;font-size:13px;letter-spacing:.12em;
  text-transform:uppercase;color:#55514A}

.cap{position:absolute;z-index:16;border:2px solid var(--ink);background:var(--paper);
  padding:16px 20px 18px;display:grid;grid-template-columns:268px 1fr;column-gap:22px;
  align-items:start}
.cap .t{grid-column:1;grid-row:1;font-weight:700;font-size:29px;line-height:1.04;
  letter-spacing:-.005em}
.cap .t em{font-style:normal;color:var(--red)}
.cap p{grid-column:2;grid-row:1 / span 2;font-weight:500;font-size:17px;line-height:1.30}
.cap .m{grid-column:1;grid-row:2;margin-top:10px;padding-top:8px;
  border-top:1px solid var(--rule);font-family:PlexMono,monospace;font-size:12px;
  letter-spacing:.09em;text-transform:uppercase;color:#6C685F}

.geo{position:absolute;inset:0;z-index:30;pointer-events:none}
.blk{position:absolute;z-index:31;background:var(--red)}

.reg{position:absolute;z-index:20}
.reg .rh{display:flex;justify-content:space-between;align-items:baseline;
  border-bottom:2px solid var(--ink);padding-bottom:7px}
.reg .rh b{font-family:Anton,sans-serif;font-weight:400;font-size:24px;
  letter-spacing:.12em;text-transform:uppercase}
.reg .rh i{font-family:PlexMono,monospace;font-style:normal;font-size:12px;
  letter-spacing:.1em;color:#6C685F;text-transform:uppercase}
.reg .row{display:grid;gap:10px;margin-top:13px}
.reg figure{margin:0}
.reg .th{width:100%;aspect-ratio:4/3;max-height:96px;border:1.5px solid #9C978C;
  background:#FFF;padding:3px;display:flex;align-items:center;justify-content:center;
  overflow:hidden}
/* max-height bounds the row regardless of plate count: five plates across the
   same register make a wider cell than six, and at 4:3 that is a taller row --
   which was enough to push the caption 4px into it. Six plates already sit
   under 96px, so this does not move the Sonicview thumbnail. */
.reg .th img{max-width:100%;max-height:100%;display:block}
.reg figcaption{font-family:PlexMono,monospace;font-size:11px;letter-spacing:.05em;
  color:#5A564E;margin-top:4px;text-transform:uppercase}

.colophon{position:absolute;left:0;top:860px;width:1920px;height:220px;z-index:18;
  background:#FFFFFF;border-top:2px solid var(--ink)}
.rail{position:absolute;left:var(--pad);top:896px;width:var(--cw);z-index:20;
  display:flex;justify-content:space-between;align-items:center}
.rail .marks{display:flex;align-items:center;gap:34px}
.rail .marks img.tsc{height:58px;width:auto;display:block}
.rail .marks img.shv{height:106px;width:auto;display:block}
.rail .vr{width:2px;height:104px;background:var(--rule)}
.rail .util{display:grid;grid-template-columns:44px auto;column-gap:18px;row-gap:6px;
  align-items:center}
.rail .util .ic{grid-column:1;display:flex;align-items:center;justify-content:center}
.rail .util .ic img{height:40px;width:auto;display:block}
.rail .util .www{grid-column:2;font-family:ArchivoN;font-weight:600;font-size:26px;
  letter-spacing:.012em;white-space:nowrap}
.rail .util .hr{grid-column:1 / -1;height:1.5px;background:var(--rule);margin:3px 0 2px}
.rail .util .num{grid-column:2;font-family:PlexMono,monospace;font-weight:400;
  font-size:22px;letter-spacing:.01em;white-space:nowrap}
</style></head>
<body>
<div class="slide">
  <div class="grain"></div><div class="grain2"></div>
  <div class="halftone"></div>

  <div class="top">
    <div class="lbls"><span>$LABEL_L</span><span>$LABEL_R</span></div>
    <div class="bar"></div>
  </div>

  <div class="head">
    <div class="hl l1"><span id="l1">$HEADWORD</span></div>
    <div class="hero" id="hero"><img src="../../sv/build/hero_$HSL.png" alt=""></div>
    <div class="hl l1 over" id="over" aria-hidden="true"><span id="l1o">$HEADWORD</span></div>
  </div>

  <div class="band" id="band"><img src="../../sv/build/band_$BSL.png" alt=""></div>
  <div class="bandtag" id="bandtag">$BAND_META</div>

  <div class="cap" id="cap">
    <div class="t">$CAP_T1<em>$CAP_T2</em></div>
    <p>$CAP_BODY</p>
    <div class="m">$CAP_META</div>
  </div>

  <svg class="geo" width="1920" height="1080" viewBox="0 0 1920 1080" fill="none">
    <line id="diag" x1="1948" y1="0" x2="-28" y2="0" stroke="#D5211B" stroke-width="6"/>
  </svg>
  <div class="blk" id="blk"></div>

  <div class="reg" id="reg">
    <div class="rh"><b>The Series</b><i>$REG_NOTE</i></div>
    <div class="row" id="plrow"></div>
  </div>

  <div class="colophon"></div>
  <div class="rail">
    <div class="marks">
      <img class="tsc" src="../../sv/build/logo_brand.png" alt="TASCAM">
      <div class="vr"></div>
      <img class="shv" src="../../sv/build/logo_shivansh.png" alt="Shivansh Electronics">
    </div>
    <div class="util">
      <span class="ic">
        <svg width="36" height="36" viewBox="0 0 24 24" stroke="#151412" stroke-width="1.6"
             fill="none" stroke-linecap="round">
          <circle cx="12" cy="12" r="9.1"/><ellipse cx="12" cy="12" rx="4.1" ry="9.1"/>
          <path d="M3.3 9.1h17.4M3.3 14.9h17.4"/>
        </svg>
      </span>
      <span class="www">www.shivanshelectronics.in</span>
      <span class="hr"></span>
      <span class="ic"><img src="../../sv/build/icon_whatsapp.png" alt="WhatsApp"></span>
      <span class="num">+91 98316 62458</span>
      <span class="num">+91 91477 00677</span>
      <span class="num">+91 89818 07755</span>
    </div>
  </div>
</div>

<script>
const PLATES = $PLATES, CAPS = $PLATECAPS;
const BANDW = 1020, BANDH = 286, ZONE_TOP = 560, ZONE_BOTTOM = 846, REGL = 1060, REGW = 788;
// One row. The lower zone is only 286px tall here, and at 3 columns a 788px
// register makes 192px-tall plates that need two rows and run 200px into the
// colophon. Across a single row the models read as a line-up, which is the
// thumbnail's whole claim.
const COLS = Math.min(PLATES.length, 6);

const reg = document.getElementById('reg');
reg.style.left = REGL + 'px'; reg.style.width = REGW + 'px'; reg.style.top = ZONE_TOP + 'px';
document.getElementById('plrow').style.gridTemplateColumns = `repeat($${COLS},1fr)`;
document.getElementById('plrow').innerHTML = PLATES.map((k,i)=>
  `<figure><div class="th"><img src="../../sv/build/pl_$${k}.png" alt=""></div>`+
  `<figcaption>$${CAPS ? CAPS[i] : String(i+1).padStart(2,'0')}</figcaption></figure>`).join('');

const rr = el => { const b = el.getBoundingClientRect();
  return [Math.round(b.left), Math.round(b.top), Math.round(b.width), Math.round(b.height)]; };

async function layout(){
  await document.fonts.ready;
  const probe = document.createElement('span');
  probe.style.cssText = 'position:absolute;left:-9999px;top:0;visibility:hidden;'+
    'white-space:nowrap;font-family:Anton,sans-serif;letter-spacing:-.008em;'+
    'text-transform:uppercase;font-size:100px;line-height:1';
  document.body.appendChild(probe);
  const l1 = document.getElementById('l1'), head0 = document.querySelector('.head');
  probe.textContent = l1.textContent;
  const per100 = probe.getBoundingClientRect().width;
  const TARGET = 1948;
  // The thumbnail's whole job is to read small, so the word takes the measure and
  // the ceiling is set by the vertical budget rather than by taste.
  let size = Math.max(300, Math.min(430, TARGET / (per100/100)));
  probe.style.fontSize = size+'px'; probe.textContent = l1.textContent;
  const natural = probe.getBoundingClientRect().width;
  let track = 0;
  if (natural < TARGET) {
    const n = Math.max(2, l1.textContent.length);
    track = Math.min(0.03 * size, (TARGET - natural) / (n - 1));
  }
  probe.remove();

  l1.parentElement.style.fontSize = size+'px';
  if (track > 0.4) {
    l1.style.letterSpacing = `calc(-0.008em + $${track}px)`;
    l1.style.marginRight = (-track)+'px';
  }
  const INK_TOP = 168;
  const cx = document.createElement('canvas').getContext('2d');
  cx.font = `$${size}px Anton`;
  const tm = cx.measureText(l1.textContent);
  const lead = (size * 0.815 - (tm.fontBoundingBoxAscent + tm.fontBoundingBoxDescent)) / 2;
  head0.style.top = (INK_TOP - (lead + tm.fontBoundingBoxAscent - tm.actualBoundingBoxAscent)) + 'px';

  const tn = l1.firstChild;
  const charRect = (i) => { const r = document.createRange();
                            r.setStart(tn, i); r.setEnd(tn, i+1);
                            return r.getBoundingClientRect(); };
  const hb = head0.getBoundingClientRect(), r1 = l1.getBoundingClientRect();
  const hero = document.getElementById('hero'), hImg = hero.querySelector('img');
  const ar = hImg.naturalWidth / hImg.naturalHeight;
  const a = charRect(0), z = charRect(tn.length - 1);

  const HMAX = 430;
  let hw = 0.44 * TARGET, hh = hw / ar;
  if (hh > HMAX) { hh = HMAX; hw = hh * ar; }
  if (hw > 0.52 * TARGET) { hw = 0.52 * TARGET; hh = hw / ar; }
  const lo = a.left + 0.40 * a.width, hi = z.right - 0.40 * z.width;
  let hx = (r1.left + r1.width / 2) - hw / 2;
  if (hi - lo >= hw) hx = Math.min(Math.max(hx, lo), hi - hw);
  const hxr = hx - hb.left;
  let hy = Math.min(Math.max(r1.top + (r1.height - hh) / 2, 150), ZONE_TOP - 16 - hh);
  const hyr = hy - hb.top;
  hero.style.left = hxr + 'px'; hero.style.width = hw + 'px'; hero.style.top = hyr + 'px';

  const ov = document.getElementById('over'), l1o = document.getElementById('l1o');
  ov.style.fontSize = size + 'px';
  if (track > 0.4) {
    l1o.style.letterSpacing = `calc(-0.008em + $${track}px)`;
    l1o.style.marginRight = (-track)+'px';
  }
  const mi = `url('../../sv/build/hero_$HSL.png')`;
  const msz = `$${hw}px $${hh}px`, mps = `$${hxr}px $${hyr}px`;
  ov.style.webkitMaskImage = mi; ov.style.maskImage = mi;
  ov.style.webkitMaskSize = msz; ov.style.maskSize = msz;
  ov.style.webkitMaskPosition = mps; ov.style.maskPosition = mps;

  const band = document.getElementById('band');
  band.style.top = ZONE_TOP + 'px'; band.style.width = BANDW + 'px'; band.style.height = BANDH + 'px';

  // The caption sits under the register rather than on the photograph. On a
  // square slide a card over the band is fine; on a thumbnail the band is the
  // only product shot and covering its middle throws away the picture -- and the
  // air under a single-row register was dead space anyway.
  const cap = document.getElementById('cap');
  cap.style.left = REGL + 'px'; cap.style.width = REGW + 'px';
  cap.style.top = '0px';
  const capH = cap.getBoundingClientRect().height;
  cap.style.top = (ZONE_BOTTOM - capH) + 'px';
  // register and caption share the right column; they must not overlap
  const regBot = reg.getBoundingClientRect().bottom;
  const capTop = ZONE_BOTTOM - capH;

  const tag = document.getElementById('bandtag');
  tag.style.left = (BANDW - tag.getBoundingClientRect().width - 20) + 'px';
  tag.style.top = (ZONE_TOP + BANDH - 42) + 'px';

  const d = document.getElementById('diag');
  d.setAttribute('y1', (ZONE_TOP - 62)); d.setAttribute('y2', (ZONE_TOP + 44));
  document.getElementById('blk').style.cssText =
    `left:$${BANDW - 70}px;top:$${ZONE_TOP - 28}px;width:84px;height:62px`;

  document.documentElement.dataset.ready = '1';
  document.documentElement.dataset.fit = JSON.stringify({
    size: Math.round(size*10)/10, track: Math.round(track*10)/10,
    lineW: Math.round(r1.width), hero: [Math.round(hx), Math.round(hw), Math.round(hh)],
    heroY: Math.round(hy), cols: COLS, regBottom: Math.round(reg.getBoundingClientRect().bottom),
    capTop: Math.round(capTop), capH: Math.round(capH),
    capClearsReg: Math.round(capTop - regBot),
    tag: rr(tag), blk: [BANDW - 70, ZONE_TOP - 28, 84, 62],
    diag: [ZONE_TOP - 62, ZONE_TOP + 44]
  });
}
layout();
</script>
</body></html>
''')

SETS = {}
SETS['sv'] = dict(
    OUTNAME='sonicview-series-thumbnail_3840x2160.png',
    LABEL_L='Sonicview Series', LABEL_R='16 &middot; 24 &middot; SB-16D',
    HEADWORD='SONICVIEW', HSL='01', BSL='01',
    CAP_T1='Every ', CAP_T2='desk',
    CAP_BODY='The 16 and the 24, the dp and XP variants, the SB-16D stage box and '
             'the cards that go in the slots &mdash; one model at a time.',
    CAP_META='Above &mdash; on black',
    BAND_META='Below &mdash; the same three on white',
    REG_NOTE='Six frames',
    # plate files exist only for frames the slide set used AS plates; a hero or a
    # band has no pl_ file, and referencing one renders an empty white box
    PLATES=json.dumps(['SV16-24', 'SV24-06', 'SB16D-01', 'FPGA-01', 'IFCARD-01', 'IFST-02']),
    PLATECAPS='null',
)

SETS['ms'] = dict(
    OUTNAME='model-series-thumbnail_3840x2160.png',
    LABEL_L='Model Series', LABEL_R='12 &middot; 16 &middot; 24 &middot; 2400 &middot; Bridge',
    # RECORDING rather than MODELSERIES: the latter is two words run together,
    # sets 32px smaller because it is 11 characters on the same measure, and at
    # real thumbnail width reads as MOD...ERIES. The labels name the family and
    # all five models anyway, and a mixer that is also a multitrack recorder is
    # what the series is.
    HEADWORD='RECORDING', HSL='01', BSL='01',
    CAP_T1='Five ', CAP_T2='desks',
    CAP_BODY='The Model 12, 16, 24 and 2400, and the Studio Bridge that has no faders '
             'at all &mdash; every desk in the series, one at a time.',
    CAP_META='Above &mdash; Model 24',
    BAND_META='Below &mdash; two of the five, on black',
    REG_NOTE='Five models',
    PLATES=json.dumps(['M12-02', 'M16-04', 'M24-05', 'M2400-02', 'BRIDGE-01']),
    PLATECAPS=json.dumps(['Model 12', 'Model 16', 'Model 24', 'Model 2400', 'Studio Bridge']),
)

CFG = SETS[SERIES]


def main():
    from playwright.sync_api import sync_playwright
    cfg = {k: v for k, v in CFG.items() if k != 'OUTNAME'}
    html = TPL.substitute(**cfg).replace('../../sv/build/', f'../../{SERIES}/build/')
    page = os.path.join(PAGES, f'thumb_{SERIES}.html'); open(page, 'w').write(html)
    t0 = time.time()
    with sync_playwright() as pw:
        b = pw.chromium.launch(executable_path=CHROME,
                               args=['--no-sandbox', '--disable-dev-shm-usage',
                                     '--force-color-profile=srgb',
                                     '--allow-file-access-from-files'])
        pg = b.new_page(viewport={'width': 1920, 'height': 1080}, device_scale_factor=2)
        errs = []; pg.on('pageerror', lambda e: errs.append(str(e)))
        pg.goto('file://' + page)
        pg.wait_for_function("document.documentElement.dataset.ready==='1'", timeout=40000)
        pg.wait_for_timeout(300)
        fit = json.loads(pg.evaluate("document.documentElement.dataset.fit"))
        out = os.path.join(OUT, CFG['OUTNAME'])
        # control frame with the forward text layer hidden, for the colour check
        pg.evaluate("document.getElementById('over').style.display='none'")
        pg.screenshot(path=os.path.join(OUT, f'_control_{SERIES}.png'), scale='device')
        pg.evaluate("document.getElementById('over').style.display=''")
        pg.screenshot(path=out, scale='device')
        pg.close(); b.close()
    im = Image.open(out)
    ok = 'OK' if im.size == (3840, 2160) else '*** WRONG SIZE ***'
    if fit['lineW'] > 1948 + max(20, fit['track'] * 1.5):
        ok = f"*** LINE OVERFLOWS MEASURE ({fit['lineW']}pt) ***"
    if fit['capClearsReg'] < 0:
        ok = f"*** CAPTION OVERLAPS REGISTER by {-fit['capClearsReg']}px ***"
    print(f"{im.size[0]}x{im.size[1]} {ok}  {os.path.getsize(out)/1e6:.2f} MB  {json.dumps(fit)}")
    json.dump(fit, open(os.path.join(SP, f'fit_{SERIES}.json'), 'w'), indent=1)
    if errs:
        print('PAGE ERRORS:', errs)
    print(f'rendered in {time.time()-t0:.0f}s')


if __name__ == '__main__':
    main()
