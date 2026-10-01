"""Prepare the TASCAM Recording Series reel assets from the repository root.

- public/rec/img/<slug>.webp   every still (105): product shots on white are cut out to alpha,
                               diagrams stay on their white "paper", photos stay RGB
- public/rec/card/cNNN.webp    640x480 card of every still for the outro carousel
- public/rec/clip/<id>.mp4     the B-roll and product clips used, re-encoded for fast seeking
- public/rec/logo, icon        transparent white TASCAM + Shivansh marks, social icons
- src/assets.json              {img: {slug: [w, h, kind, product]}, cards: [slug...]}
"""
import json, os, re, shutil, subprocess
import numpy as np
from PIL import Image
from scipy import ndimage

HERE = os.path.dirname(os.path.abspath(__file__))
PROJ = os.path.dirname(HERE)
REPO = os.path.dirname(PROJ)
OUT = os.path.join(PROJ, "public", "rec")
SV = os.path.join(os.path.dirname(REPO), "tascam-sonicview-mixers-high-end-video", "reel-square-4k", "public")

# index = position in the product-ordered list below (Model 12, 16, 24, case study, 24 vs 2400, 2400, Studio Bridge)
CUT = {0, 3, 4, 5, 6, 7, 18, 24, 30, 31, 45, 46, 47, 48, 49, 50, 60, 68, 70, 71, 72, 73, 74, 83, 85, 86, 87, 88, 89, 90, 91}
PAPER = {8, 17, 19, 22, 39, 69, 101, 102, 103, 104}

CLIPS = {
    "b01": "B-ROLL 1 [The Fader That Writes Itself].mp4",
    "b02": "B-ROLL 2 [The Broadcast Bridge].mp4",
    "b03": "B-ROLL 3 [The Committed Signal].mp4",
    "b04": "B-ROLL 4 [Three Destinations, One Preamp].mp4",
    "b05": "B-ROLL 5 [No Computer Required].mp4",
    "b06": "B-ROLL 6 [The Multi-Pin Stage Feed].mp4",
    "b07": "B-ROLL 7 [The Bus That Glues the Mix].mp4",
    "b08": "B-ROLL 8 [One Clock, Every Machine].mp4",
    "b09": "B-ROLL 9 [The Stage Feed, Captured].mp4",
    "b10": "B-ROLL 10 [The Analog Desk, Digitized].mp4",
    "b12": "B-ROLL 12 [Backup Behind the Preamps].mp4",
    "b13": "B-ROLL 13 [The Sub-Compact's Full Rear].mp4",
    "b14": "B-ROLL 14 [Effects Built In].mp4",
    "b15": "B-ROLL 15 [A Session, Labeled By Hand].mp4",
    "b16": "B-ROLL 16 [Every Channel Has Somewhere to Go].mp4",
    "g02": "GEMINI 2 - TACTILE FADER MANAGEMENT.mp4",
    "g05": "GEMINI 5 - SD CARD HARDWARE CAPTURE.mp4",
    "g17": "GEMINI 17 - Holding the Mix Together.mp4",
    "v12": "TASCAM MODEL 12 VIDEO.mp4",
    "v16": "TASCAM MODEL 16 VIDEO.mp4",
    "v24": "TASCAM MODEL 24 VIDEO.mp4",
    "v2400": "TASCAM MODEL 2400 VIDEO.mp4",
}


def product(name):
    if "STUDIO BRIDGE" in name:
        return "sb"
    if "VS MODEL" in name:
        return "cmp"
    if "CASE STUDY" in name:
        return "cs"
    return "m" + re.search(r"MODEL (\d+)", name).group(1)


def ordered():
    fs = [f for f in os.listdir(REPO) if re.search(r"\.(jpe?g|png|webp)$", f, re.I) and (f.startswith("TASCAM MODEL") or f.startswith("TASCAM STUDIO"))]
    key = lambda s: (re.sub(r" \(\d+\).*", "", s), int((re.findall(r"\((\d+)\)", s) or ["-1"])[0]))
    return sorted(fs, key=key)


def cut_white(im):
    rgb = np.asarray(im.convert("RGB")).astype(np.float32)
    mn, mx = rgb.min(2), rgb.max(2)
    lab, _ = ndimage.label((mn > 228) & (mx - mn < 18))
    border = np.unique(np.r_[lab[0], lab[-1], lab[:, 0], lab[:, -1]])
    bg = np.isin(lab, border[border > 0])
    fg, n = ndimage.label(~bg)
    if n > 1:  # drop captions / specks that are not part of the product
        sizes = ndimage.sum(np.ones_like(fg), fg, range(1, n + 1))
        bg |= ~np.isin(fg, 1 + np.flatnonzero(sizes >= sizes.max() * 0.03))
    alpha = ndimage.gaussian_filter(np.where(bg, 0.0, 1.0), 0.8)
    out = np.dstack([np.where(bg[..., None], 0, rgb), alpha * 255]).astype(np.uint8)
    im = Image.fromarray(out, "RGBA")
    bb = im.getchannel("A").point(lambda v: 255 if v > 10 else 0).getbbox()
    return im.crop(bb) if bb else im


def card(im, kind):
    t = im.convert("RGBA")
    if kind == "cut":
        c = Image.new("RGBA", (640, 480), (20, 17, 14, 255))
        t.thumbnail((570, 410), Image.LANCZOS)
        g = Image.new("RGBA", (640, 480), (0, 0, 0, 0))
        g.alpha_composite(t, ((640 - t.width) // 2, (480 - t.height) // 2))
        c.alpha_composite(g)
    elif kind == "paper":
        c = Image.new("RGBA", (640, 480), (246, 244, 240, 255))
        t.thumbnail((600, 440), Image.LANCZOS)
        c.alpha_composite(t, ((640 - t.width) // 2, (480 - t.height) // 2))
    else:
        s = max(640 / t.width, 480 / t.height)
        t = t.resize((int(t.width * s) + 1, int(t.height * s) + 1), Image.LANCZOS)
        c = Image.new("RGBA", (640, 480))
        c.alpha_composite(t, (-(t.width - 640) // 2, -(t.height - 480) // 2))
    return c.convert("RGB")


def main():
    for d in ("img", "card", "clip", "logo", "icon"):
        os.makedirs(os.path.join(OUT, d), exist_ok=True)
    meta, cards, counts = {}, [], {}
    for i, f in enumerate(ordered()):
        p = product(f)
        counts[p] = counts.get(p, 0) + 1
        slug = f"{p}-{counts[p]:02d}"
        im = Image.open(os.path.join(REPO, f))
        if i in CUT:
            im, kind = cut_white(im), "cut"
        else:
            im, kind = im.convert("RGB"), "paper" if i in PAPER else "photo"
        if max(im.size) > 2048:
            im.thumbnail((2048, 2048), Image.LANCZOS)
        im.save(f"{OUT}/img/{slug}.webp", quality=93, method=4)
        meta[slug] = [im.width, im.height, kind, p]
        card(im, kind).save(f"{OUT}/card/c{len(cards):03d}.webp", quality=86)
        cards.append(slug)
        print(i, slug, im.size, kind, f)
    for k, f in CLIPS.items():
        dst = f"{OUT}/clip/{k}.mp4"
        if not os.path.exists(dst):
            subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", os.path.join(REPO, f), "-an", "-c:v", "libx264", "-crf", "19", "-preset", "medium",
                            "-pix_fmt", "yuv420p", "-g", "12", "-movflags", "+faststart", dst], check=True)
    # transparent white marks + social icons are committed in public/rec; refresh them from the
    # Sonicview reel's knock-outs only when that repository is checked out next to this one
    if os.path.isdir(SV):
        for f in ("tascam-white.png", "shivansh-white.png"):
            shutil.copy(os.path.join(SV, "logo", f), os.path.join(OUT, "logo", f))
        for f in ("whatsapp.png", "website.png", "instagram.png", "facebook.png", "youtube.png"):
            shutil.copy(os.path.join(SV, "icon", f), os.path.join(OUT, "icon", f))
    json.dump({"img": meta, "cards": cards}, open(os.path.join(PROJ, "src", "assets.json"), "w"), indent=1)
    print("stills", len(meta), counts)


if __name__ == "__main__":
    main()
