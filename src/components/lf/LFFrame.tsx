import React from 'react';
import {AbsoluteFill} from 'remotion';
import {C, LF_CANVAS, LF_SAFE} from '../../lib/lf-theme';

/**
 * LANDSCAPE FRAME CONTRACT — deliberately different from the reel's Frame.tsx.
 *
 * There is no Instagram-style top/bottom exclusion band and no reserved
 * caption box (this format has neither platform-UI overlap risk nor a
 * caption placeholder requirement — see Section 2 of the brief). The full
 * 1920x1080 canvas is usable. The only rule: critical text/callouts stay
 * EDGE_PAD inboard of the true left/right edges.
 */

export const Ground: React.FC = () => (
  <AbsoluteFill
    style={{
      background: `radial-gradient(126% 78% at 50% 36%, #FBFAF7 0%, ${C.paper} 46%, ${C.paperDeep} 100%)`,
    }}
  />
);

export const LFFrame: React.FC<{children: React.ReactNode}> = ({children}) => (
  <AbsoluteFill style={{width: LF_CANVAS.w, height: LF_CANVAS.h, backgroundColor: C.paper}}>
    <Ground />
    <AbsoluteFill style={{overflow: 'hidden'}}>{children}</AbsoluteFill>
  </AbsoluteFill>
);

/** Positions a scene's real content inside the edge-padded safe box. */
export const LFSafe: React.FC<{children: React.ReactNode; style?: React.CSSProperties}> = ({
  children,
  style,
}) => (
  <div
    style={{
      position: 'absolute',
      left: LF_SAFE.x,
      top: LF_SAFE.y,
      width: LF_SAFE.w,
      height: LF_SAFE.h,
      ...style,
    }}
  >
    {children}
  </div>
);

/** Debug overlay for still-frame validation — draws the edge margin only. */
export const LFGuides: React.FC = () => (
  <AbsoluteFill style={{pointerEvents: 'none'}}>
    <div
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        width: LF_SAFE.x,
        height: LF_CANVAS.h,
        background: 'rgba(0,120,255,0.14)',
      }}
    />
    <div
      style={{
        position: 'absolute',
        right: 0,
        top: 0,
        width: LF_SAFE.x,
        height: LF_CANVAS.h,
        background: 'rgba(0,120,255,0.14)',
      }}
    />
  </AbsoluteFill>
);
