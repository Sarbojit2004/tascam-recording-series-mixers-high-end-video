"""A 9:16 portrait reel cover at exactly 2160 x 3840, in the slides' design system.

The fourth composition. Where the landscape thumbnail had width to spend and no
height, this has the opposite, so the display returns to the TWO stacked lines
of the original vertical slides -- each line fitted to the measure on its own, so
MODEL and SERIES set at different sizes and both run to the same width. That is
the reference poster's system, and portrait is the only one of the three formats
with the vertical budget to afford it.

Everything else is shared with the slides: the same tokens, the same red rule and
diagonal, the same programmatic halftone and grain, the same forward text layer
at 36%, and the vertical set's own branding rail proportions rather than new ones.
"""
import json, os, sys, string, time
SP = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(SP)
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
:root{--paper:#F2F1EC;--ink:#151412;--red:#D5211B;--rule:#B6B2A8;--pad:74px;--cw:932px}
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:1080px;height:1920px}
body{background:var(--paper);color:var(--ink);font-family:ArchivoN,'Arial Narrow',sans-serif;
  -webkit-font-smoothing:antialiased;overflow:hidden}
.slide{position:relative;width:1080px;height:1920px;overflow:hidden;background:var(--paper)}

.grain{position:absolute;inset:0;background-image:url('../../ms/build/grain.png');
  background-size:256px 256px;mix-blend-mode:multiply;opacity:.30;z-index:2}
.grain2{position:absolute;inset:0;background-image:url('../../ms/build/grain.png');
  background-size:97px 97px;mix-blend-mode:multiply;opacity:.16;z-index:3}

.top{position:absolute;left:var(--pad);top:74px;width:var(--cw);z-index:20}
.top .lbls{display:flex;justify-content:space-between;align-items:flex-end}
.top .lbls span{font-family:Anton,sans-serif;font-size:32px;line-height:1;
  letter-spacing:.055em;text-transform:uppercase}
.top .bar{height:5px;background:var(--red);margin-top:11px}

.halftone{position:absolute;right:0;top:150px;width:470px;height:520px;z-index:4;
  background-image:url('../../ms/build/halftone.png');background-size:100% 100%}

.head{position:absolute;left:-12px;top:150px;width:1104px;z-index:10}
.hl{font-family:Anton,sans-serif;color:var(--red);line-height:.815;
  letter-spacing:-.008em;white-space:nowrap;text-transform:uppercase}
.hl span{display:inline-block}
.hl.l2{text-align:right;margin-top:2px;padding-right:22px}
.hero{position:absolute;z-index:14}
.hero img{display:block;width:100%;height:auto}
.over{position:absolute;left:0;top:0;width:100%;z-index:15;opacity:.36;pointer-events:none;
  -webkit-mask-repeat:no-repeat;mask-repeat:no-repeat;mask-mode:alpha}

.band{position:absolute;left:0;z-index:12;overflow:hidden}
.band img{display:block;width:100%;height:100%;object-fit:cover;object-position:center}
.bandtag{position:absolute;z-index:22;background:var(--paper);padding:6px 11px;
  font-family:PlexMono,monospace;font-size:11px;letter-spacing:.12em;
  text-transform:uppercase;color:#55514A}

.cap{position:absolute;left:var(--pad);width:var(--cw);z-index:16;
  border:1.5px solid var(--ink);background:var(--paper);padding:16px 20px 18px;
  display:grid;grid-template-columns:250px 1fr;column-gap:22px;align-items:start}
.cap .t{grid-column:1;grid-row:1;font-weight:700;font-size:29px;line-height:1.04;
  letter-spacing:-.005em}
.cap .t em{font-style:normal;color:var(--red)}
.cap p{grid-column:2;grid-row:1 / span 2;font-weight:500;font-size:16px;line-height:1.31}
.cap .m{grid-column:1;grid-row:2;margin-top:10px;padding-top:8px;
  border-top:1px solid var(--rule);font-family:PlexMono,monospace;font-size:10px;
  letter-spacing:.09em;text-transform:uppercase;color:#6C685F}

.geo{position:absolute;inset:0;z-index:30;pointer-events:none}
.blk{position:absolute;z-index:31;background:var(--red)}

.reg{position:absolute;left:var(--pad);width:var(--cw);z-index:20}
.reg .rh{display:flex;justify-content:space-between;align-items:baseline;
  border-bottom:1.5px solid var(--ink);padding-bottom:6px}
.reg .rh b{font-family:Anton,sans-serif;font-weight:400;font-size:20px;
  letter-spacing:.12em;text-transform:uppercase}
.reg .rh i{font-family:PlexMono,monospace;font-style:normal;font-size:10px;
  letter-spacing:.1em;color:#6C685F;text-transform:uppercase}
.reg .row{display:grid;gap:10px;margin-top:11px;grid-template-columns:repeat(5,1fr)}
.reg figure{margin:0}
.reg .th{width:100%;aspect-ratio:4/3;border:1px solid #9C978C;background:#FFF;padding:3px;
  display:flex;align-items:center;justify-content:center;overflow:hidden}
.reg .th img{max-width:100%;max-height:100%;display:block}
.reg figcaption{font-family:PlexMono,monospace;font-size:9.5px;letter-spacing:.05em;
  color:#5A564E;margin-top:4px;text-transform:uppercase}

/* the vertical set's own rail, reused rather than re-proportioned */
.colophon{position:absolute;left:0;top:1640px;width:1080px;height:280px;z-index:18;
  background:#FFFFFF;border-top:1.5px solid var(--ink)}
.rail{position:absolute;left:var(--pad);top:1717px;width:var(--cw);z-index:20;
  display:flex;justify-content:space-between;align-items:center}
.rail .marks{display:flex;align-items:center;gap:27px}
.rail .marks img.tsc{height:46px;width:auto;display:block}
.rail .marks img.shv{height:86px;width:auto;display:block}
.rail .vr{width:1.5px;height:84px;background:var(--rule)}
.rail .util{display:grid;grid-template-columns:34px auto;column-gap:14px;row-gap:6px;
  align-items:center}
.rail .util .ic{grid-column:1;display:flex;align-items:center;justify-content:center}
.rail .util .ic svg{display:block}
.rail .util .ic img{height:31px;width:auto;display:block}
.rail .util .www{grid-column:2;font-family:ArchivoN;font-weight:600;font-size:20px;
  letter-spacing:.012em;white-space:nowrap}
.rail .util .hr{grid-column:1 / -1;height:1px;background:var(--rule);margin:3px 0 1px}
.rail .util .num{grid-column:2;font-family:PlexMono,monospace;font-weight:400;font-size:17.5px;
  letter-spacing:.01em;white-space:nowrap}
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
    <div class="hl l1"><span id="l1">$HEAD1</span></div>
    <div class="hl l2"><span id="l2">$HEAD2</span></div>
    <div class="hero" id="hero"><img src="../../ms/build/hero_$HSL.png" alt=""></div>
    <div class="hl l1 over" id="over" aria-hidden="true"><span id="l1o">$HEAD1</span></div>
  </div>

  <div class="band" id="band"><img src="../../ms/build/band_$BSL.png" alt=""></div>
  <div class="bandtag" id="bandtag">$BAND_META</div>

  <div class="cap" id="cap">
    <div class="t">$CAP_T1<em>$CAP_T2</em></div>
    <p>$CAP_BODY</p>
    <div class="m">$CAP_META</div>
  </div>

  <svg class="geo" width="1080" height="1920" viewBox="0 0 1080 1920" fill="none">
    <line id="diag" x1="1092" y1="0" x2="-12" y2="0" stroke="#D5211B" stroke-width="5"/>
  </svg>
  <div class="blk" id="blk"></div>

  <div class="reg" id="reg">
    <div class="rh"><b>The Series</b><i>$REG_NOTE</i></div>
    <div class="row" id="plrow"></div>
  </div>

  <div class="colophon"></div>
  <div class="rail">
    <div class="marks">
      <img class="tsc" src="../../ms/build/logo_brand.png" alt="TASCAM">
      <div class="vr"></div>
      <img class="shv" src="../../ms/build/logo_shivansh.png" alt="Shivansh Electronics">
    </div>
    <div class="util">
      <span class="ic">
        <svg width="28" height="28" viewBox="0 0 24 24" stroke="#151412" stroke-width="1.6"
             fill="none" stroke-linecap="round">
          <circle cx="12" cy="12" r="9.1"/><ellipse cx="12" cy="12" rx="4.1" ry="9.1"/>
          <path d="M3.3 9.1h17.4M3.3 14.9h17.4"/>
        </svg>
      </span>
      <span class="www">www.shivanshelectronics.in</span>
      <span class="hr"></span>
      <span class="ic"><img src="../../ms/build/icon_whatsapp.png" alt="WhatsApp"></span>
      <span class="num">+91 98316 62458</span>
      <span class="num">+91 91477 00677</span>
      <span class="num">+91 89818 07755</span>
    </div>
  </div>
</div>

<script>
const PLATES = $PLATES, CAPS = $PLATECAPS;
const BAND_TOP = 890, BANDH = 380, CAP_TOP = 1300, REG_TOP = 1432, COLOPHON = 1640;

document.getElementById('plrow').innerHTML = PLATES.map((k,i)=>
  `<figure><div class="th"><img src="../../ms/build/pl_$${k}.png" alt=""></div>`+
  `<figcaption>$${CAPS[i]}</figcaption></figure>`).join('');
const rr = el => { const b = el.getBoundingClientRect();
  return [Math.round(b.left), Math.round(b.top), Math.round(b.width), Math.round(b.height)]; };

async function layout(){
  await document.fonts.ready;
  const probe = document.createElement('span');
  probe.style.cssText = 'position:absolute;left:-9999px;top:0;visibility:hidden;'+
    'white-space:nowrap;font-family:Anton,sans-serif;letter-spacing:-.008em;'+
    'text-transform:uppercase;font-size:100px;line-height:1';
  document.body.appendChild(probe);
  const l1 = document.getElementById('l1'), l2 = document.getElementById('l2');
  const head0 = document.querySelector('.head');
  const TARGET = 1104;

  // Each line is fitted to the measure on its own, so the two set at different
  // sizes and both run the same width -- the reference poster's system, which
  // only portrait has the vertical budget for.
  function fit(el, cap){
    probe.style.fontSize = '100px'; probe.textContent = el.textContent;
    let size = Math.max(240, Math.min(cap, TARGET / (probe.getBoundingClientRect().width/100)));
    probe.style.fontSize = size+'px'; probe.textContent = el.textContent;
    const natural = probe.getBoundingClientRect().width;
    let track = 0;
    if (natural < TARGET) {
      const n = Math.max(2, el.textContent.length);
      track = Math.min(0.03 * size, (TARGET - natural) / (n - 1));
    }
    el.parentElement.style.fontSize = size+'px';
    if (track > 0.4) {
      el.style.letterSpacing = `calc(-0.008em + $${track}px)`;
      el.style.marginRight = (-track)+'px';
    }
    return {size, track};
  }
  const f1 = fit(l1, 420), f2 = fit(l2, 420);
  probe.remove();

  const INK_TOP = 168;
  const cx = document.createElement('canvas').getContext('2d');
  cx.font = `$${f1.size}px Anton`;
  const tm = cx.measureText(l1.textContent);
  const lead = (f1.size * 0.815 - (tm.fontBoundingBoxAscent + tm.fontBoundingBoxDescent)) / 2;
  head0.style.top = (INK_TOP - (lead + tm.fontBoundingBoxAscent - tm.actualBoundingBoxAscent)) + 'px';

  const tn = l1.firstChild;
  const charRect = (i) => { const r = document.createRange();
                            r.setStart(tn, i); r.setEnd(tn, i+1);
                            return r.getBoundingClientRect(); };
  const hb = head0.getBoundingClientRect(), r1 = l1.getBoundingClientRect();
  const r2 = l2.getBoundingClientRect();
  const hero = document.getElementById('hero'), hImg = hero.querySelector('img');
  const ar = hImg.naturalWidth / hImg.naturalHeight;
  const a = charRect(0), z = charRect(tn.length - 1);

  const HMAX = 400;
  let hw = 0.46 * TARGET, hh = hw / ar;
  if (hh > HMAX) { hh = HMAX; hw = hh * ar; }
  if (hw > 0.56 * TARGET) { hw = 0.56 * TARGET; hh = hw / ar; }
  const lo = a.left + 0.40 * a.width, hi = z.right - 0.40 * z.width;
  let hx = (r1.left + r1.width / 2) - hw / 2;
  if (hi - lo >= hw) hx = Math.min(Math.max(hx, lo), hi - hw);
  const hxr = hx - hb.left;
  let hy = Math.min(Math.max(r1.top + (r1.height - hh) / 2, 150), BAND_TOP - 24 - hh);
  const hyr = hy - hb.top;
  hero.style.left = hxr + 'px'; hero.style.width = hw + 'px'; hero.style.top = hyr + 'px';

  const ov = document.getElementById('over'), l1o = document.getElementById('l1o');
  ov.style.fontSize = f1.size + 'px';
  if (f1.track > 0.4) {
    l1o.style.letterSpacing = `calc(-0.008em + $${f1.track}px)`;
    l1o.style.marginRight = (-f1.track)+'px';
  }
  const mi = `url('../../ms/build/hero_$HSL.png')`;
  const msz = `$${hw}px $${hh}px`, mps = `$${hxr}px $${hyr}px`;
  ov.style.webkitMaskImage = mi; ov.style.maskImage = mi;
  ov.style.webkitMaskSize = msz; ov.style.maskSize = msz;
  ov.style.webkitMaskPosition = mps; ov.style.maskPosition = mps;

  const band = document.getElementById('band');
  band.style.top = BAND_TOP + 'px'; band.style.width = '1080px'; band.style.height = BANDH + 'px';

  const cap = document.getElementById('cap');
  cap.style.top = CAP_TOP + 'px';
  const capBottom = cap.getBoundingClientRect().bottom;

  const reg = document.getElementById('reg');
  reg.style.top = REG_TOP + 'px';
  const regBottom = reg.getBoundingClientRect().bottom;

  const tag = document.getElementById('bandtag');
  tag.style.left = (1080 - 74 - tag.getBoundingClientRect().width) + 'px';
  tag.style.top = (BAND_TOP + BANDH - 34) + 'px';

  const d = document.getElementById('diag');
  d.setAttribute('y1', (BAND_TOP - 58)); d.setAttribute('y2', (BAND_TOP + 30));
  document.getElementById('blk').style.cssText =
    `left:$${1080 - 74 - 64}px;top:$${BAND_TOP - 34}px;width:64px;height:48px`;

  document.documentElement.dataset.ready = '1';
  document.documentElement.dataset.fit = JSON.stringify({
    l1: [f1.size, Math.round(f1.track*10)/10, Math.round(r1.width)],
    l2: [f2.size, Math.round(f2.track*10)/10, Math.round(r2.width)],
    headBottom: Math.round(r2.bottom),
    hero: [Math.round(hx), Math.round(hw), Math.round(hh)], heroY: Math.round(hy),
    capBottom: Math.round(capBottom), regTop: REG_TOP,
    capClearsReg: Math.round(REG_TOP - capBottom),
    regBottom: Math.round(regBottom), regClearsColophon: Math.round(COLOPHON - regBottom),
    headClearsBand: Math.round(BAND_TOP - r2.bottom),
    tag: rr(tag), blk: [1080-74-64, BAND_TOP-34, 64, 48],
    diag: [BAND_TOP - 58, BAND_TOP + 30]
  });
}
layout();
</script>
</body></html>
''')

CFG = dict(
    LABEL_L='Model Series', LABEL_R='12 &middot; 16 &middot; 24 &middot; 2400 &middot; Bridge',
    HEAD1='MODEL', HEAD2='SERIES', HSL='01', BSL='01',
    CAP_T1='Five ', CAP_T2='desks',
    CAP_BODY='The Model 12, 16, 24 and 2400, and the Studio Bridge that has no faders '
             'at all &mdash; every desk in the series, one at a time.',
    CAP_META='Above &mdash; Model 24',
    BAND_META='Below &mdash; two of the five, on black',
    REG_NOTE='Five models',
    PLATES=json.dumps(['M12-02', 'M16-04', 'M24-05', 'M2400-02', 'BRIDGE-01']),
    PLATECAPS=json.dumps(['Model 12', 'Model 16', 'Model 24', 'Model 2400', 'Studio Bridge']),
)


def main():
    from playwright.sync_api import sync_playwright
    html = TPL.substitute(**CFG)
    page = os.path.join(PAGES, 'reel.html'); open(page, 'w').write(html)
    t0 = time.time()
    with sync_playwright() as pw:
        b = pw.chromium.launch(executable_path=CHROME,
                               args=['--no-sandbox', '--disable-dev-shm-usage',
                                     '--force-color-profile=srgb',
                                     '--allow-file-access-from-files'])
        pg = b.new_page(viewport={'width': 1080, 'height': 1920}, device_scale_factor=2)
        errs = []; pg.on('pageerror', lambda e: errs.append(str(e)))
        pg.goto('file://' + page)
        pg.wait_for_function("document.documentElement.dataset.ready==='1'", timeout=40000)
        pg.wait_for_timeout(300)
        fit = json.loads(pg.evaluate("document.documentElement.dataset.fit"))
        out = os.path.join(OUT, 'model-series-reel-cover_2160x3840.png')
        pg.evaluate("document.getElementById('over').style.display='none'")
        pg.screenshot(path=os.path.join(OUT, '_control_reel.png'), scale='device')
        pg.evaluate("document.getElementById('over').style.display=''")
        pg.screenshot(path=out, scale='device')
        pg.close(); b.close()
    im = Image.open(out)
    ok = 'OK' if im.size == (2160, 3840) else '*** WRONG SIZE ***'
    for line, lbl in ((fit['l1'], 'line 1'), (fit['l2'], 'line 2')):
        if line[2] > 1104 + max(12, line[1] * 1.5):
            ok = f'*** {lbl} OVERFLOWS MEASURE ({line[2]}pt) ***'
    for k, lbl in (('headClearsBand', 'headline over band'),
                   ('capClearsReg', 'caption over register'),
                   ('regClearsColophon', 'register over colophon')):
        if fit[k] < 0:
            ok = f'*** {lbl.upper()} by {-fit[k]}px ***'
    print(f"{im.size[0]}x{im.size[1]} {ok}  {os.path.getsize(out)/1e6:.2f} MB")
    print(json.dumps(fit))
    json.dump(fit, open(os.path.join(SP, 'fit_reel.json'), 'w'), indent=1)
    if errs:
        print('PAGE ERRORS:', errs)
    print(f'rendered in {time.time()-t0:.0f}s')


if __name__ == '__main__':
    main()
