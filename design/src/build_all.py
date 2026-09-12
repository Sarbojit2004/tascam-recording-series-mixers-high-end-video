"""Render the ten slides at exactly 2160 x 3840.

One template, one layout engine. Every slide carries the same eight mechanics and
the same branding rail; what changes per slide is the copy, the three image roles
and how many rows the plate register needs.
"""
import json, os, sys, string, time
SP = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, SP)
from spec import SPEC
from PIL import Image

BUILD = os.path.join(SP, 'build')
OUTDIR = os.path.join(SP, 'slides'); os.makedirs(OUTDIR, exist_ok=True)
CHROME = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome'

TPL = string.Template(r'''<!doctype html><html><head><meta charset="utf-8">
<style>
/* ------------------------------------------------------------------ fonts
   Anton for the display line (heavy condensed grotesque, closest open face to
   the reference poster's headline). Archivo Narrow for the caption card and
   utility text. IBM Plex Mono for index numerals and silkscreen-style marks.
   Stored locally so the render is deterministic and needs no network.        */
@font-face{font-family:Anton;src:url('../fonts/Anton-400.woff2') format('woff2');
  font-weight:400;font-display:block}
@font-face{font-family:ArchivoN;src:url('../fonts/ArchivoNarrow-500.woff2') format('woff2');
  font-weight:100 900;font-display:block}
@font-face{font-family:PlexMono;src:url('../fonts/IBMPlexMono-Regular.ttf') format('truetype');
  font-weight:400;font-display:block}
@font-face{font-family:PlexMono;src:url('../fonts/IBMPlexMono-Bold.ttf') format('truetype');
  font-weight:700;font-display:block}

:root{
  --paper:#F2F1EC;      /* warm off-white ground */
  --ink:#151412;
  --red:#D5211B;        /* the single accent -- flat, hard-edged only */
  --rule:#B6B2A8;
  --pad:74px;
  --cw:932px;           /* content width = 1080 - 2*pad */
}
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:1080px;height:1920px}
body{background:var(--paper);color:var(--ink);
  font-family:ArchivoN,'Arial Narrow',sans-serif;
  -webkit-font-smoothing:antialiased;overflow:hidden}
.slide{position:relative;width:1080px;height:1920px;overflow:hidden;background:var(--paper)}

/* paper tooth: sits UNDER every photographic layer so no supplied frame is tinted */
.grain{position:absolute;inset:0;background-image:url('../build/grain.png');
  background-size:256px 256px;mix-blend-mode:multiply;opacity:.30;z-index:2}
.grain2{position:absolute;inset:0;background-image:url('../build/grain.png');
  background-size:97px 97px;mix-blend-mode:multiply;opacity:.16;z-index:3}

/* 01 thin red rule with two flanking all-caps labels */
.top{position:absolute;left:var(--pad);top:74px;width:var(--cw);z-index:20}
.top .lbls{display:flex;justify-content:space-between;align-items:flex-end}
.top .lbls span{font-family:Anton,sans-serif;font-size:33px;line-height:1;
  letter-spacing:.055em;text-transform:uppercase}
.top .bar{height:5px;background:var(--red);margin-top:11px}

/* 05 halftone, bleeding in from the right edge */
.halftone{position:absolute;right:0;top:150px;width:560px;height:720px;z-index:4;
  background-image:url('../build/halftone.png');background-size:100% 100%}

/* 02 massive stacked type, physically interrupted by the photograph */
.head{position:absolute;left:-12px;top:152px;width:1104px;z-index:10}
.hl{font-family:Anton,sans-serif;color:var(--red);line-height:.815;
  letter-spacing:-.008em;white-space:nowrap;text-transform:uppercase}
.hl span{display:inline-block}
.hl.l2{text-align:right;margin-top:4px;padding-right:18px}
.hero{position:absolute;z-index:14}
.hero img{display:block;width:100%;height:auto}

/* 04 small boxed caption card */
.cap{position:absolute;left:var(--pad);width:336px;z-index:16;
  border:1.5px solid var(--ink);background:var(--paper);padding:17px 19px 19px}
.cap .t{font-weight:700;font-size:31px;line-height:1;letter-spacing:-.005em;margin-bottom:11px}
.cap .t em{font-style:normal;color:var(--red)}
.cap p{font-weight:500;font-size:16.5px;line-height:1.31}
.cap .m{margin-top:12px;padding-top:9px;border-top:1px solid var(--rule);
  font-family:PlexMono,monospace;font-size:11px;letter-spacing:.09em;text-transform:uppercase;
  color:#6C685F}

/* a found fragment of the Sonicview logotype, set as a plate rather than a photo */
.found{position:absolute;z-index:16;border:1.5px solid var(--ink);background:#fff;padding:6px}
.found img{display:block;width:100%;height:auto}

/* 06 second full-width photo band, full colour */
.band{position:absolute;left:0;width:1080px;z-index:12;overflow:hidden}
.band img{display:block;width:100%;height:100%;object-fit:cover;object-position:$BANDPOS}
.bandtag{position:absolute;left:var(--pad);z-index:20;font-family:PlexMono,monospace;
  font-size:11.5px;letter-spacing:.13em;text-transform:uppercase;color:#6C685F}

/* 07 connective geometry: diagonal, outline, one solid block */
.geo{position:absolute;inset:0;z-index:30;pointer-events:none}
.mark{position:absolute;z-index:32;border:3px solid var(--red)}
.blk{position:absolute;z-index:31;background:var(--red)}

/* plate register */
.reg{position:absolute;left:var(--pad);width:var(--cw);z-index:20}
.reg .rh{display:flex;justify-content:space-between;align-items:baseline;
  border-bottom:1.5px solid var(--ink);padding-bottom:6px}
.reg .rh b{font-family:Anton,sans-serif;font-weight:400;font-size:20px;letter-spacing:.12em;
  text-transform:uppercase}
.reg .rh i{font-family:PlexMono,monospace;font-style:normal;font-size:11.5px;
  letter-spacing:.11em;color:#6C685F;text-transform:uppercase}
.reg .row{display:grid;grid-template-columns:repeat($COLS,1fr);gap:9px;margin-top:11px}
.reg figure{margin:0}
.reg .th{width:100%;aspect-ratio:4/3;border:1px solid #9C978C;background:#FFFFFF;padding:3px;
  display:flex;align-items:center;justify-content:center;overflow:hidden}
.reg .th img{max-width:100%;max-height:100%;display:block}
.reg figcaption{font-family:PlexMono,monospace;font-size:9.5px;letter-spacing:.06em;
  color:#5A564E;margin-top:5px}

/* branding rail on its own white colophon band */
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
    <div class="hero" id="hero"><img src="../build/hero_$SL.png" alt=""></div>
  </div>

  <div class="cap" id="cap">
    <div class="t">$CAP_T1<em>$CAP_T2</em></div>
    <p>$CAP_BODY</p>
    <div class="m">$CAP_META</div>
  </div>
  $FOUND

  <div class="band" id="band"><img src="../build/band_$SL.png" alt=""></div>
  <div class="bandtag" id="bandtag">$BAND_META</div>

  <svg class="geo" width="1080" height="1920" viewBox="0 0 1080 1920" fill="none">
    <line id="diag" x1="1092" y1="778" x2="-12" y2="952" stroke="#D5211B" stroke-width="4"/>
  </svg>
  <div class="mark" id="extmark" style="display:none"></div>
  <div class="blk" id="blk"></div>

  <div class="reg" id="reg">
    <div class="rh"><b>Plates</b><i>$REG_NOTE</i></div>
    <div class="row" id="plrow"></div>
  </div>

  <div class="colophon"></div>
  <div class="rail">
    <div class="marks">
      <img class="tsc" src="../build/logo_tascam.png" alt="TASCAM">
      <div class="vr"></div>
      <img class="shv" src="../build/logo_shivansh.png" alt="Shivansh Electronics">
    </div>
    <div class="util">
      <span class="ic">
        <svg width="26" height="26" viewBox="0 0 24 24" stroke="#151412" stroke-width="1.5"
             fill="none" stroke-linecap="round">
          <circle cx="12" cy="12" r="9.1"/>
          <ellipse cx="12" cy="12" rx="4.1" ry="9.1"/>
          <path d="M3.3 9.1h17.4M3.3 14.9h17.4"/>
        </svg>
      </span>
      <span class="www">www.shivanshelectronics.in</span>
      <span class="hr"></span>
      <span class="ic"><img src="../build/icon_whatsapp.png" alt="WhatsApp"></span>
      <span class="num">+91 98316 62458</span>
      <span class="num">+91 91477 00677</span>
      <span class="num">+91 89818 07755</span>
    </div>
  </div>
</div>

<script>
const PLATES = $PLATES;
const MARK   = $MARK;
const HERO_FIXED = $HERO_FIXED;
const COLS = $COLS;

document.getElementById('plrow').innerHTML = PLATES.map((k,i)=>
  `<figure><div class="th"><img src="../build/pl_$${k}.png" alt=""></div>`+
  `<figcaption>$${String(i+1).padStart(2,'0')}</figcaption></figure>`).join('');

async function layout(){
  await document.fonts.ready;

  // Measure the TEXT, not its block container. A block element's bounding rect is
  // its declared width whatever the font size, so the display line has to be sized
  // against a hidden inline probe instead.
  const probe = document.createElement('span');
  probe.style.cssText = 'position:absolute;left:-9999px;top:0;visibility:hidden;'+
    'white-space:nowrap;font-family:Anton,sans-serif;letter-spacing:-.008em;'+
    'text-transform:uppercase;font-size:100px;line-height:1';
  document.body.appendChild(probe);
  const l1 = document.getElementById('l1'), l2 = document.getElementById('l2');
  probe.textContent = l1.textContent;
  const per100 = probe.getBoundingClientRect().width;
  const TARGET = 1104;
  // clamp so a four-letter word never grows to swallow the page, and a long one
  // never shrinks below the set's common weight
  let size = Math.max(300, Math.min(430, TARGET / (per100/100)));
  probe.style.fontSize = size+'px';
  probe.textContent = l1.textContent;
  let natural = probe.getBoundingClientRect().width;
  // short words are tracked out toward the full measure rather than left adrift
  let track = 0;
  if (natural < TARGET) {
    // n characters give n-1 gaps once the trailing space is pulled back off,
    // so divide by n-1 or the line lands short by one whole gap
    const n = Math.max(2, l1.textContent.length);
    track = Math.min(0.012*size, (TARGET-natural)/(n-1));
  }
  probe.remove();

  l1.parentElement.style.fontSize = size+'px';
  l2.parentElement.style.fontSize = size+'px';
  // add to the inherited tracking, never replace it -- assigning a bare px value
  // wipes the -0.008em the display face is set with and the line grows by 19px
  if (track > 0.5) {
    l1.style.letterSpacing = `calc(-0.008em + $${track}px)`;
    l1.style.marginRight = (-track)+'px';
  }

  // Measure the first and last glyph with a Range rather than wrapping them in
  // elements. Splitting a word into per-letter spans breaks the kerning pairs
  // between them, which widened this line by 19px on the first attempt.
  const tn = l1.firstChild;
  const charRect = (i) => { const r = document.createRange();
                            r.setStart(tn, i); r.setEnd(tn, i+1);
                            return r.getBoundingClientRect(); };
  const head = document.querySelector('.head');
  const hb = head.getBoundingClientRect(), r1 = l1.getBoundingClientRect();
  const hero = document.getElementById('hero'), hImg = hero.querySelector('img');
  const ar = hImg.naturalWidth / hImg.naturalHeight;

  let gapL, gapR;
  if (HERO_FIXED) { gapL = HERO_FIXED[0]; gapR = HERO_FIXED[0] + HERO_FIXED[1]; }
  else {
    const a = charRect(0), z = charRect(tn.length - 1);
    gapL = a.right + 4; gapR = z.left + 22;
  }
  // a four or five letter word leaves too small a gap for the photograph to
  // carry the slide, so widen symmetrically to a floor -- it eats into the end
  // letters the way the reference's building eats into its B
  const MINW = 620;
  let hw = Math.max(gapR - gapL, MINW), hh = hw / ar;
  const HMAX = r1.height + 130;
  if (hh > HMAX) { hh = HMAX; hw = hh * ar; }
  const hx = gapL + ((gapR - gapL) - hw) / 2;
  hero.style.left = (hx - hb.left) + 'px';
  hero.style.width = hw + 'px';
  hero.style.top = ((r1.top - hb.top) + (r1.height - hh)/2 + 10) + 'px';

  // caption card drops into the white the right-aligned second line leaves
  const r2 = l2.getBoundingClientRect();
  const cap = document.getElementById('cap');
  cap.style.top = (r2.top + r2.height*0.13) + 'px';
  const found = document.getElementById('found');

  let headBottom = Math.max(r2.bottom, cap.getBoundingClientRect().bottom);
  if (found) { found.style.top = (headBottom + 22) + 'px';
               headBottom = found.getBoundingClientRect().bottom; }

  // register sits on a fixed foot; the band then takes whatever is left, so a
  // dense slide shortens the band instead of colliding with the rail
  const reg = document.getElementById('reg');
  const rows = Math.ceil(PLATES.length / COLS);
  const tileH = ((932 - (COLS-1)*9)/COLS) * 3/4;
  const regH = 30 + rows*(tileH + 16);
  const regTop = 1570 - regH;
  reg.style.top = regTop + 'px';

  const bandBottom = regTop - 56;
  const bandTop = Math.max(headBottom + 72, bandBottom - 620);
  const band = document.getElementById('band');
  band.style.top = bandTop + 'px';
  band.style.height = (bandBottom - bandTop) + 'px';
  document.getElementById('bandtag').style.top = (bandBottom + 14) + 'px';

  // the diagonal crosses the air between the headline and the band
  const d = document.getElementById('diag');
  d.setAttribute('y1', (bandTop - 96)); d.setAttribute('y2', (bandTop + 80));
  const blk = document.getElementById('blk');
  blk.style.cssText = `left:938px;top:$${bandTop-24}px;width:68px;height:52px`;

  if (MARK) {
    const bb = band.getBoundingClientRect();
    const m = document.getElementById('extmark');
    m.style.display = 'block';
    m.style.left   = (bb.left + bb.width*MARK[0]) + 'px';
    m.style.top    = (bb.top  + bb.height*MARK[1]) + 'px';
    m.style.width  = (bb.width*MARK[2]) + 'px';
    m.style.height = (bb.height*MARK[3]) + 'px';
  }

  document.documentElement.dataset.ready = '1';
  document.documentElement.dataset.fit = JSON.stringify({
    size: Math.round(size*10)/10, track: Math.round(track*10)/10,
    l1: Math.round(l1.getBoundingClientRect().width),
    headBottom: Math.round(headBottom),
    hero: [Math.round(hx), Math.round(hw), Math.round(hh)],
    band: [Math.round(bandTop), Math.round(bandBottom-bandTop)],
    regTop: Math.round(regTop), rows: rows
  });
}
layout();
</script>
</body></html>
''')


def build_html(sl, s):
    found = ''
    if 'found' in s:
        found = ('<div class="found" id="found" style="left:74px;width:212px">'
                 f'<img src="../build/found_{sl}.png" alt=""></div>')
    n = len(s['plates'])
    note = {1: 'One frame'}.get(n, f'{n} frames')
    html = TPL.substitute(
        SL=sl,
        LABEL_L=s['labels'][0], LABEL_R=s['labels'][1],
        HEAD1=s['head'][0], HEAD2=s['head'][1],
        CAP_T1=s['cap_title'][0], CAP_T2=s['cap_title'][1],
        CAP_BODY=s['cap_body'], CAP_META=s['cap_meta'],
        BAND_META=s['band_meta'], BANDPOS=s.get('band_pos', 'center'),
        REG_NOTE=note,
        PLATES=json.dumps(s['plates']),
        MARK=json.dumps(list(s['mark'])) if 'mark' in s else 'null',
        HERO_FIXED=json.dumps(list(s['hero_fixed'])) if 'hero_fixed' in s else 'null',
        COLS=str(s.get('cols', 9)),
        FOUND=found,
    )
    p = os.path.join(SP, 'pages', f'slide{sl}.html')
    os.makedirs(os.path.dirname(p), exist_ok=True)
    open(p, 'w').write(html)
    return p


def main(only=None):
    from playwright.sync_api import sync_playwright
    targets = [k for k in sorted(SPEC) if (only is None or k in only)]
    t0 = time.time()
    fits = {}
    fitpath = os.path.join(SP, 'fits.json')
    if os.path.exists(fitpath):
        fits = json.load(open(fitpath))
    with sync_playwright() as pw:
        b = pw.chromium.launch(executable_path=CHROME,
                               args=['--no-sandbox', '--disable-dev-shm-usage',
                                     '--force-color-profile=srgb'])
        for sl in targets:
            s = SPEC[sl]
            page_path = build_html(sl, s)
            pg = b.new_page(viewport={'width': 1080, 'height': 1920}, device_scale_factor=2)
            errs = []
            pg.on('pageerror', lambda e: errs.append(str(e)))
            pg.goto('file://' + page_path)
            pg.wait_for_function("document.documentElement.dataset.ready==='1'", timeout=40000)
            pg.wait_for_timeout(320)
            fit = pg.evaluate("document.documentElement.dataset.fit")
            out = os.path.join(OUTDIR, s['name'] + '.png')
            pg.screenshot(path=out, scale='device')
            pg.close()
            im = Image.open(out)
            ok = 'OK' if im.size == (2160, 3840) else '*** WRONG SIZE ***'
            fits[sl] = json.loads(fit)
            print(f"{sl}  {im.size[0]}x{im.size[1]} {ok}  {os.path.getsize(out)/1e6:5.2f} MB  {fit}")
            if errs:
                print('    PAGE ERRORS:', errs)
        b.close()
    json.dump(fits, open(fitpath, 'w'), indent=1)
    print(f'rendered {len(targets)} slides in {time.time()-t0:.0f}s')


if __name__ == '__main__':
    main(sys.argv[1:] or None)
