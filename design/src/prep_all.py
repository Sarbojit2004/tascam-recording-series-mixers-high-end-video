"""Prepare every image asset for all ten slides.

Nothing here recolours anything. Every operation is one of: matte to the product's
own silhouette, trim to the product's bounding box, or a straight rectangular crop.
Textures (halftone, paper grain) are generated from scratch.
"""
import json, os, sys, math, time
SP = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, SP)
import numpy as np
from PIL import Image, ImageDraw, ImageFilter
from matte import cutout, bbox_crop, open_srgb
from spec import SPEC, PREP

ROOT = '/home/user/tascam-recording-series-mixers-high-end-video'
# the Model-series repo ships no WhatsApp icon; reuse the one the client
# supplied with the Sonicview job, which is the same asset
SVROOT = '/home/user/tascam-sonicview-mixers-high-end-video'
ids = json.load(open(SP + '/ids.json')); REV = {v: k for k, v in ids.items()}
OUT = os.path.join(SP, 'build'); os.makedirs(OUT, exist_ok=True)


def src(k):
    return os.path.join(ROOT, REV[k])


def rect_crop(k, box):
    im = open_srgb(src(k))
    W, H = im.size
    return im.crop((int(W*box[0]), int(H*box[1]), int(W*box[2]), int(H*box[3])))


def prepare(k, mode, **kw):
    """mode: cut (RGBA silhouette) | bbox (trimmed frame) | crop | raw"""
    if mode == 'cut':
        return cutout(src(k), **kw)
    if mode == 'bbox':
        return bbox_crop(src(k), pad=0.015, **kw)
    if mode == 'crop':
        return rect_crop(k, kw['box'])
    return open_srgb(src(k))


# ------------------------------------------------------------------ halftone
def halftone(w, h, pitch=21, gamma=1.85, maxr=0.44, alpha=0.50):
    im = Image.new('L', (w*3, h*3), 0); d = ImageDraw.Draw(im)
    n = int(max(w, h) / pitch) + 4
    for j in range(-2, n*2):
        for i in range(-2, n*2):
            x, y = i*pitch, j*pitch
            if not (-pitch <= x <= w+pitch and -pitch <= y <= h+pitch):
                continue
            t = min(1., max(0., x/float(w))) ** gamma
            v = 1. - min(1., max(0., (y/float(h) - 0.55) / 0.45))
            r = pitch * maxr * t * (0.30 + 0.70*v)
            if r < 0.30:
                continue
            d.ellipse([(x-r)*3, (y-r)*3, (x+r)*3, (y+r)*3], fill=255)
    a = im.resize((w, h), Image.LANCZOS)
    out = Image.new('RGBA', (w, h), (26, 24, 17, 0))
    out.putalpha(a.point(lambda v: int(v*alpha)))
    return out


def main():
    t0 = time.time()
    halftone(1120, 1440).save(f'{OUT}/halftone.png')

    rng = np.random.default_rng(1603)
    g = rng.normal(128, 9, (512, 512)).astype(np.float32)
    g = np.asarray(Image.fromarray(g.astype(np.uint8)).filter(ImageFilter.GaussianBlur(0.4)))
    Image.fromarray(np.clip(g, 0, 255).astype(np.uint8)).convert('RGB').save(f'{OUT}/grain.png')

    for base, k, name in ((ROOT, 'TASCAM BRAND LOGO (2).png', 'logo_tascam'),
                          (ROOT, 'SHIVANSH ELECTRONICS LOGO FOR VIDEO.png', 'logo_shivansh'),
                          (SVROOT, 'WHATSAPP ICON.png', 'icon_whatsapp')):
        im = Image.open(os.path.join(base, k)).convert('RGBA')
        bb = Image.fromarray((np.asarray(im)[..., 3] > 6).astype(np.uint8)*255).getbbox()
        im.crop(bb).save(f'{OUT}/{name}.png')

    geom = {}
    done = set()
    for sl, s in SPEC.items():
        g = {}
        # hero
        hk = s['hero']
        hero = prepare(hk, 'cut' if s['hero_mode'] == 'cut' else 'raw')
        hero.save(f'{OUT}/hero_{sl}.png')
        g['hero'] = [hero.width, hero.height]

        # band
        bk = s['band']
        # tight trim: a band is meant to bleed the full width, so the product
        # runs edge to edge rather than floating on a margin
        band = (bbox_crop(src(bk), pad=0.004) if s['band_mode'] == 'bbox'
                else prepare(bk, 'raw'))
        if band.width > 2400:
            band = band.resize((2400, int(band.height*2400/band.width)), Image.LANCZOS)
        band.save(f'{OUT}/band_{sl}.png')
        g['band'] = [band.width, band.height]

        # plates
        for k in s['plates']:
            if k in done:
                continue
            p = PREP.get(k, dict(mode='raw'))
            kw = {kk: vv for kk, vv in p.items() if kk != 'mode'}
            im = prepare(k, p['mode'], **kw)
            if im.mode == 'RGBA':
                bgi = Image.new('RGBA', im.size, (255, 255, 255, 255))
                bgi.alpha_composite(im); im = bgi.convert('RGB')
            im.thumbnail((760, 760), Image.LANCZOS)
            im.save(f'{OUT}/pl_{k}.png')
            done.add(k)

        if 'found' in s:
            f = prepare(s['found'], 'raw')
            f.thumbnail((1200, 1200), Image.LANCZOS)
            f.save(f'{OUT}/found_{sl}.png')
            g['found'] = [f.width, f.height]

        geom[sl] = g
        print(f'  slide {sl}: hero {g["hero"]}  band {g["band"]} '
              f'(ar {g["band"][0]/g["band"][1]:.3f})  plates {len(s["plates"])}'
              f'   {time.time()-t0:.0f}s')

    json.dump(geom, open(f'{OUT}/geom.json', 'w'), indent=1)
    print(f'done in {time.time()-t0:.0f}s')


if __name__ == '__main__':
    main()
