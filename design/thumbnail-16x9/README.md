# Model series thumbnail — 16:9, 3840 × 2160

A landscape thumbnail for the long-form video covering every desk in the series
— Model 12, 16, 24, 2400 and the Studio Bridge — in the same design system as
the square slides, the 9:16 reel cover and the Sonicview thumbnail.

## Shared renderer

`build_thumb.py` now takes `SERIES=sv|ms` and draws from that series' prepared
assets, the same way `build_sq.py` does for the slides. The Sonicview thumbnail
renders byte-identically before and after that change (`a30f0bb4…`), so the
refactor is a no-op for approved work and a fix now lands on both.

## The headline is RECORDING, not MODELSERIES

MODELSERIES is two words run together. At eleven characters on the same measure
it sets 32px smaller than a nine-character word, and with the photograph
punched through the middle it reads as MOD…ERIES at real thumbnail width. Both
were rendered and compared at 360px before choosing. The labels carry **Model
Series** and **12 · 16 · 24 · 2400 · Bridge**, so the family and every model are
named regardless — and a mixer that is also a multitrack recorder is what the
series actually is.

## One guard earned its keep

Five plates across the register make a wider cell than six, and at 4:3 that is a
taller row — enough to push the caption 4px into it. The caption-to-register
clearance is asserted on every render and caught it; the plate box now carries a
`max-height` so row height does not depend on plate count. Six plates already
sit under that cap, which is why the Sonicview thumbnail is unmoved.

Verified — 3840 × 2160 exact; band colour drift **−0.38 / −0.38 / −0.37** of 255
against the supplied frame with the drawn overlays masked; **zero pixels altered
outside the product silhouette** by the forward text layer; no prohibited
content; all four permitted branding items present; caption clears the register
by 12px.

Rebuild with `SERIES=ms python3 build_thumb.py` (needs the prepared `ms/build/`
assets).
