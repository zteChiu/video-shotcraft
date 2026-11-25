import type { FC } from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { EASE, ramp } from './ease';
import { TOTAL } from './timeline';

export const FadeOut: FC = () => {
  const frame = useCurrentFrame();
  const a = ramp(frame, TOTAL - 30, 30, EASE.smooth);
  if (a <= 0) return null;
  return <AbsoluteFill style={{ background: '#05040a', opacity: a, pointerEvents: 'none' }} />;
};

FadeOut.displayName = 'FadeOut';
