import type React from 'react';
import type {LFSceneId} from '../../lib/lf-theme';
import {CO1, FO1, type LFSceneProps} from './ColdOpenAndFamily';
import {M12_1, M12_2, M12_3, M12_4, M12_5} from './Model12';
import {M16_1, M16_2, M16_3, M16_4, M16_5} from './Model16';
import {M24_1, M24_2, M24_3, M24_4, M24_5, M24_6} from './Model24';
import {M2400_1, M2400_2, M2400_3, M2400_4, M2400_5, M2400_6, M2400_7} from './Model2400';
import {WF1, WF2} from './Workflows';
import {SB_1, SB_2, SB_3, SB_4, SB_5, SB_6} from './StudioBridge';
import {RT1, PR1, PR2, PR3} from './RangeAndOutro';

export type {LFSceneProps};

export const LF_REGISTRY: Record<LFSceneId, React.FC<LFSceneProps>> = {
  CO1, FO1,
  M12_1, M12_2, M12_3, M12_4, M12_5,
  M16_1, M16_2, M16_3, M16_4, M16_5,
  M24_1, M24_2, M24_3, M24_4, M24_5, M24_6,
  M2400_1, M2400_2, M2400_3, M2400_4, M2400_5, M2400_6, M2400_7,
  WF1, WF2,
  SB_1, SB_2, SB_3, SB_4, SB_5, SB_6,
  RT1,
  PR1, PR2, PR3,
};
