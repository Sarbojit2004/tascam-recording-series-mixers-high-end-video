import type React from 'react';
import type {SceneId} from '../lib/theme';
import {S01, S02} from './act0';
import {S03, S04, S05, S06} from './act1';
import {S07, S08, S09, S10} from './act2';
import {S11, S12, S13, S14} from './act3';
import {S15, S16, S17, S18} from './act4';
import {S19, S20, S21} from './act5';
import {S22, S23, S24} from './act6';
import type {SceneProps} from './shell';

export const REGISTRY: Record<SceneId, React.FC<SceneProps>> = {
  S01, S02,
  S03, S04, S05, S06,
  S07, S08, S09, S10,
  S11, S12, S13, S14,
  S15, S16, S17, S18,
  S19, S20, S21,
  S22, S23, S24,
};
