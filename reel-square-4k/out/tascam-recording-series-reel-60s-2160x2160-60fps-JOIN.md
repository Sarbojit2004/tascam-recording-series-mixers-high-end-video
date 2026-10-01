# tascam-recording-series-reel-60s-2160x2160-60fps

3 sequential parts, each playable on its own, total 60.783 s (2160x2160, 60 fps).
Video and audio are stream-copied from the master, never re-encoded.

- `tascam-recording-series-reel-60s-2160x2160-60fps-part01.mp4` — 0.0–20.0 s, 50 MB
- `tascam-recording-series-reel-60s-2160x2160-60fps-part02.mp4` — 20.0–40.0 s, 57 MB
- `tascam-recording-series-reel-60s-2160x2160-60fps-part03.mp4` — 40.0–60.8 s, 69 MB

Rejoin into one file:

```
ffmpeg -f concat -safe 0 -i tascam-recording-series-reel-60s-2160x2160-60fps.concat.txt -c copy tascam-recording-series-reel-60s-2160x2160-60fps.mp4
```
