import {continueRender, delayRender, staticFile} from 'remotion';

// Type system ported structurally from the MOTU UltraLite-mk5 / 828 reel:
// Barlow Condensed for display, Inter for UI/body, JetBrains Mono for the
// technical spec layer. Faces are vendored into public/fonts so a 2640-frame
// render never depends on a network fetch — the colour values are the only
// thing re-derived for this project's light ground (see theme.ts).

type Face = {family: string; file: string; weight: string};

const FACES: Face[] = [
  {family: 'BarlowCondensed', file: 'fonts/bc-600.woff2', weight: '600'},
  {family: 'BarlowCondensed', file: 'fonts/bc-700.woff2', weight: '700'},
  {family: 'BarlowCondensed', file: 'fonts/bc-800.woff2', weight: '800'},
  {family: 'Inter', file: 'fonts/inter-var.woff2', weight: '100 900'},
  {family: 'JetBrainsMono', file: 'fonts/jbm-var.woff2', weight: '100 800'},
];

let started = false;

/**
 * Waits only on the five explicit FontFace loads. `document.fonts.ready`
 * resolves against every font the document might still be resolving and was
 * observed to hang a render worker under concurrency, so it is deliberately
 * not awaited here — these five faces are the only ones the reel uses.
 */
export const loadFonts = (): void => {
  if (started || typeof document === 'undefined') return;
  started = true;

  const handle = delayRender('load-fonts', {
    timeoutInMilliseconds: 90000,
    retries: 2,
  });

  Promise.all(
    FACES.map(async (f) => {
      const face = new FontFace(f.family, `url(${staticFile(f.file)}) format("woff2")`, {
        weight: f.weight,
        style: 'normal',
        display: 'block',
      });
      const loaded = await face.load();
      document.fonts.add(loaded);
    }),
  )
    .then(() => continueRender(handle))
    .catch(() => continueRender(handle));
};
