# Model series reel cover — 9:16, 2160 × 3840

A portrait cover for the reel covering every desk in the series — Model 12, 16,
24, 2400 and the Studio Bridge — in the same design system as the square slides
and the landscape thumbnail.

## The fourth composition

Where the landscape thumbnail had width to spend and no height, this has the
opposite, so the display returns to **two stacked lines** — and each is fitted to
the measure on its own, so MODEL and SERIES set at different sizes and both run
to the same width. That is the reference poster's system, and portrait is the
only one of the three formats with the vertical budget to afford it: on a square
canvas two full-measure lines would eat the whole page, which is why the square
slides set one line instead.

Everything else is shared: the same tokens, the same red rule and diagonal, the
same programmatic halftone and grain, the same forward text layer at 36%, and
**the vertical slides' own branding rail proportions** rather than new ones.

The register names each of the five models under its plate, because on a cover
the register is the claim — this reel covers all of them.

## Guards

Three clearances are asserted on every render rather than eyeballed: headline to
band, caption to register, and register to colophon. The portrait budget is
tight enough that the last of them clears by 8px.

Two faults were caught and fixed this way and by reading the output: the final S
of SERIES sat on the canvas edge (line 2 is right-aligned into a 1104pt box that
bleeds 12px past the page, so it needed pulling inside), and the band caption
said "a live room" when the photograph is two desks on a dark ground — corrected
to describe what the frame actually shows.

Verified — 2160 × 3840 exact; band colour drift **−0.32 / −0.33 / −0.32** of 255
against the supplied frame with the drawn overlays masked; **zero pixels altered
outside the product silhouette** by the forward text layer; no prohibited
content; all four permitted branding items present.

Rebuild with `python3 build_reel.py` (needs the prepared `ms/build/` assets).
