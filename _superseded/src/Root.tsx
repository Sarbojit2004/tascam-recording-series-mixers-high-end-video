import React from 'react';
import {Composition} from 'remotion';
import {LFReel} from './LFReel';
import {LongFormThumbnail} from './LongFormThumbnail';
import {Reel} from './Reel';
import {Thumbnail} from './Thumbnail';
import {CANVAS, FPS, TOTAL_FRAMES} from './lib/theme';
import {LF_CANVAS, LF_FPS, LF_TOTAL_FRAMES} from './lib/lf-theme';

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

    {/* ---- long-form video ------------------------------------------- */}
    <Composition
      id="LongForm"
      component={LFReel}
      durationInFrames={LF_TOTAL_FRAMES}
      fps={LF_FPS}
      width={LF_CANVAS.w}
      height={LF_CANVAS.h}
      defaultProps={{guides: false}}
    />
    <Composition
      id="LongFormGuides"
      component={LFReel}
      durationInFrames={LF_TOTAL_FRAMES}
      fps={LF_FPS}
      width={LF_CANVAS.w}
      height={LF_CANVAS.h}
      defaultProps={{guides: true}}
    />
    <Composition
      id="LongFormThumbnail"
      component={LongFormThumbnail}
      durationInFrames={1}
      fps={LF_FPS}
      width={LF_CANVAS.w}
      height={LF_CANVAS.h}
    />
  </>
);
