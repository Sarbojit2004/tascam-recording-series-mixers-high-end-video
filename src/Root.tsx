import React from 'react';
import {Composition} from 'remotion';
import {Reel} from './Reel';
import {Thumbnail} from './Thumbnail';
import {CANVAS, FPS, TOTAL_FRAMES} from './lib/theme';

export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="Reel"
      component={Reel}
      durationInFrames={TOTAL_FRAMES}
      fps={FPS}
      width={CANVAS.w}
      height={CANVAS.h}
      defaultProps={{guides: false}}
    />
    {/* Same composition with the safe-zone overlay, used by the still checks
        to prove no critical content crosses into the ambient bands. */}
    <Composition
      id="ReelGuides"
      component={Reel}
      durationInFrames={TOTAL_FRAMES}
      fps={FPS}
      width={CANVAS.w}
      height={CANVAS.h}
      defaultProps={{guides: true}}
    />
    <Composition
      id="Thumbnail"
      component={Thumbnail}
      durationInFrames={1}
      fps={FPS}
      width={CANVAS.w}
      height={CANVAS.h}
    />
  </>
);
