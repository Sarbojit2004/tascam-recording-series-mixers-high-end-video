#!/usr/bin/env python3
"""
ASSET PREPARATION — real product photography, real product video, and the
17 Gemini representational clips.

Two asset classes are governed by completely different rules and are NEVER
mixed in the manifest, in scene code, or in coverage tracking:

  REAL   real TASCAM product photography + the four real product videos.
         Standing pipeline rule: never permanently cropped, clipped or trimmed
         such that the viewer never sees the whole unit; video never sped up,
         never reduced to a single frame. Resampling for render performance is
         allowed because it preserves the entire frame.

  REPR   the 17 Gemini clips. Section 0.3 grants complete editorial freedom:
         crop, speed, trim, mute, loop, grade. They carry zero TASCAM likeness,
         zero branding and zero baked-in text by design.

Every one of the 17 Gemini clips has the four-pointed Gemini AI watermark burned
in at an identical position, measured across all 17 at x 1108-1198, y 552-642 in
the 1280x720 source. Two crops remove it with margin, and are baked in here so
no runtime crop maths is needed:

  LAND  crop 1280x545 @ (0,0)  -> 2.35:1, used by the landscape long-form
  PORT  crop 1100x720 @ (0,0)  -> 1.53:1, used by the portrait reels

Each clip is cropped in exactly ONE preset, because no clip is used by more than
one deliverable (Section 0.3's hard no-reuse constraint).
"""
import hashlib, json, os, re, shutil, subprocess, sys
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))   # production/
REPO = os.path.dirname(ROOT)
OUT  = os.path.join(ROOT, "assets")

# --- Which deliverable each Gemini clip belongs to. No clip appears twice. ----
# Long-form takes the landscape crop; the three reels share the portrait crop.
CLIP_TARGET = {
    1: "land", 3: "land", 4: "land", 6: "land", 9: "land",
    10: "land", 15: "land", 16: "land", 17: "land",
    2: "port", 5: "port", 7: "port", 8: "port",
    11: "port", 12: "port", 13: "port", 14: "port",
}
CROPS = {"land": "crop=1280:545:0:0", "port": "crop=1100:720:0:0"}

def slug(s):
    s = re.sub(r"\.(jpg|png|mp4)$", "", s, flags=re.I)
    s = s.upper().replace("TASCAM ", "").strip()
    s = re.sub(r"[^A-Z0-9]+", "-", s).strip("-").lower()
    return s

def classify_unit(fname):
    """Returns (unit, note). The one reclassification is documented inline."""
    U = fname.upper()
    # MISNAMED SOURCE FILE. Verified at full resolution: this frame shows
    # AUX OUTPUT 1-5, SUB 1-2/3-4/5-6/7-8 and a TALKBACK XLR. Per Stage 8 all
    # three are Model 2400-exclusive (the Model 24 has no subgroups and no
    # talkback), so attributing it to the Model 24 on screen would state a
    # false technical claim. Reclassified.
    if "MODEL 24 CASE STUDY (4)" in U:
        return "model2400", "reclassified from filename MODEL 24 (shows 5 AUX / 4 subgroups / TALKBACK = Model 2400)"
    if U.startswith("TASCAM STUDIO BRIDGE"): return "studiobridge", None
    if U.startswith("TASCAM MODEL 2400"):    return "model2400", None
    if U.startswith("TASCAM MODEL 24 VS"):   return "cross", None
    if U.startswith("TASCAM MODEL 24"):      return "model24", None
    if U.startswith("TASCAM MODEL 16"):      return "model16", None
    if U.startswith("TASCAM MODEL 12"):      return "model12", None
    if "SHIVANSH" in U:                      return "logo_shivansh", None
    if "TASCAM BRAND" in U:                  return "logo_tascam", None
    return "other", None

def ground(im):
    """Classify the image's own background so it can be seated correctly on a
    near-black page. The image itself is never altered."""
    g = im.convert("L"); w, h = g.size
    b = max(2, min(w, h) // 40)
    px = list(g.crop((0, 0, w, b)).getdata()) + list(g.crop((0, h - b, w, h)).getdata()) \
       + list(g.crop((0, 0, b, h)).getdata()) + list(g.crop((w - b, 0, w, h)).getdata())
    m = sum(px) / len(px)
    return "light" if m > 190 else ("dark" if m < 62 else "mixed"), round(m, 1)

def run(cmd):
    r = subprocess.run(cmd, capture_output=True)
    if r.returncode != 0:
        sys.exit(f"FAILED {' '.join(cmd[:6])}...\n{r.stderr.decode()[:600]}")

def main():
    for d in ("img", "video", "clips", "logo"):
        os.makedirs(os.path.join(OUT, d), exist_ok=True)

    images, seen, dups = [], {}, {}
    for f in sorted(os.listdir(REPO)):
        if not f.lower().endswith((".jpg", ".png")):
            continue
        p = os.path.join(REPO, f)
        sha = hashlib.sha256(open(p, "rb").read()).hexdigest()
        unit, note = classify_unit(f)

        if sha in seen:                      # byte-identical: one image, two names
            dups.setdefault(seen[sha], []).append(f)
            continue
        seen[sha] = f

        im = Image.open(p); im = im.convert("RGB") if im.mode != "RGB" else im
        gk, gv = ground(im)
        sw, sh = im.size
        if max(sw, sh) > 1920:               # resample only; nothing is cropped
            r = 1920 / max(sw, sh)
            im = im.resize((round(sw * r), round(sh * r)), Image.LANCZOS)
        sid = slug(f)
        sub = "logo" if unit.startswith("logo") else "img"
        ext = "png" if unit.startswith("logo") else "jpg"
        dst = os.path.join(OUT, sub, f"{sid}.{ext}")
        im.save(dst, quality=92, optimize=True) if ext == "jpg" else im.save(dst)
        images.append(dict(id=sid, src=f, unit=unit, kind="real-image",
                           w=im.width, h=im.height, srcW=sw, srcH=sh,
                           ground=gk, groundLum=gv, sha=sha[:16],
                           path=f"{sub}/{sid}.{ext}", note=note))

    for k, v in dups.items():
        for e in images:
            if e["src"] == k:
                e["duplicateOf"] = v

    videos = []
    for f in sorted(os.listdir(REPO)):
        if not (f.upper().startswith("TASCAM") and f.lower().endswith(".mp4")):
            continue
        unit, _ = classify_unit(f)
        sid = slug(f)
        dst = os.path.join(OUT, "video", f"{sid}.mp4")
        shutil.copyfile(os.path.join(REPO, f), dst)          # untouched: natural speed
        pr = subprocess.run(["ffprobe", "-v", "error", "-select_streams", "v:0",
                             "-show_entries", "stream=width,height,r_frame_rate,nb_frames",
                             "-show_entries", "format=duration", "-of", "json", dst],
                            capture_output=True).stdout
        j = json.loads(pr); st = j["streams"][0]
        videos.append(dict(id=sid, src=f, unit=unit, kind="real-video",
                           w=st["width"], h=st["height"],
                           dur=round(float(j["format"]["duration"]), 3),
                           path=f"video/{sid}.mp4"))

    clips = []
    for f in sorted(os.listdir(REPO)):
        if not f.upper().startswith("GEMINI"):
            continue
        n = int(re.match(r"GEMINI (\d+)", f.upper()).group(1))
        target = CLIP_TARGET[n]
        title = re.sub(r"^GEMINI \d+ - ", "", f[:-4], flags=re.I).strip()
        sid = f"clip{n:02d}-{slug(title)}"
        dst = os.path.join(OUT, "clips", f"{sid}.mp4")
        run(["ffmpeg", "-v", "error", "-y", "-i", os.path.join(REPO, f),
             "-vf", CROPS[target], "-an",              # muted: B-roll under the bed
             "-c:v", "libx264", "-preset", "slow", "-crf", "19",
             "-pix_fmt", "yuv420p", dst])
        pr = json.loads(subprocess.run(
            ["ffprobe", "-v", "error", "-select_streams", "v:0",
             "-show_entries", "stream=width,height", "-show_entries",
             "format=duration", "-of", "json", dst], capture_output=True).stdout)
        clips.append(dict(id=sid, n=n, title=title, kind="repr-clip",
                          crop=target, w=pr["streams"][0]["width"],
                          h=pr["streams"][0]["height"],
                          dur=round(float(pr["format"]["duration"]), 3),
                          path=f"clips/{sid}.mp4"))

    man = dict(images=images, videos=videos, clips=clips)
    json.dump(man, open(os.path.join(OUT, "manifest.json"), "w"), indent=1)

    prod = [i for i in images if not i["unit"].startswith("logo")]
    print(f"REAL images      : {len(images)} unique ({len(prod)} product + "
          f"{len(images)-len(prod)} logo), {sum(len(v) for v in dups.values())} byte-identical dupes folded")
    print(f"REAL video       : {len(videos)}")
    print(f"REPR clips       : {len(clips)}  (land={sum(1 for c in clips if c['crop']=='land')}, "
          f"port={sum(1 for c in clips if c['crop']=='port')})")
    from collections import Counter
    for u, c in sorted(Counter(i["unit"] for i in images).items()):
        print(f"   {u:16s} {c}")
    print("\nGROUND:", dict(Counter(i["ground"] for i in prod)))
    for e in images:
        if e.get("note"): print(f"\nRECLASSIFIED: {e['src']}\n  -> {e['unit']}: {e['note']}")

if __name__ == "__main__":
    main()
