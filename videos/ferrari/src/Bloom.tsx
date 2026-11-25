import type { FC } from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { EASE, ramp } from './ease';
import { HORIZON } from './theme';

/** One horizon bloom. Three of these in the whole film, on the measured drops. */
export const Bloom: FC<{ duration?: number }> = ({ duration = 16 }) => {
  const frame = useCurrentFrame();
  const attack = ramp(frame, 0, 3, EASE.linear);
  const decay = 1 - ramp(frame, 3, Math.max(1, duration - 3), EASE.out);
  const a = frame < 3 ? attack : attack * decay;
  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: HORIZON - 90,
          height: 220,
          background: `radial-gradient(ellipse 58% 70% at 64% 58%, rgba(255,196,140,${(0.62 * a).toFixed(3)}), rgba(255,90,48,${(0.2 * a).toFixed(3)}) 46%, rgba(255,40,24,0) 72%)`,
          mixBlendMode: 'screen',
        }}
      />
    </AbsoluteFill>
  );
};

Bloom.displayName = 'Bloom';
