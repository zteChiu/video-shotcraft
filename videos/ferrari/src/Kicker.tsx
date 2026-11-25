import type { FC } from 'react';
import { useCurrentFrame } from 'remotion';
import { EASE, ramp } from './ease';
import { FPS, SECTIONS, f } from './timeline';
import { SANS, SODIUM } from './theme';

export const Kicker: FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  let index = 0;
  for (let i = 0; i < SECTIONS.length; i++) {
    if (SECTIONS[i].t <= t + 1e-4) index = i;
  }
  const section = SECTIONS[index];
  const next = SECTIONS[index + 1];
  if (!section.label) return null;

  const enter = ramp(frame - f(section.t), 0, 16, EASE.out);
  const exitP = next ? ramp(frame, f(next.t) - 12, 12, EASE.exit) : 0;
  const shown = enter * (1 - exitP);
  if (shown <= 0.01) return null;
  const center = section.place === 'center';
  const blur = (1 - enter) * 8 + exitP * 8;

  return (
    <div
      style={{
        position: 'absolute',
        top: center ? 548 : 578,
        left: center ? 0 : 148,
        right: center ? 0 : undefined,
        textAlign: center ? 'center' : 'left',
        opacity: shown,
        transform: `translateY(${((1 - enter) * 10 - exitP * 8).toFixed(2)}px)`,
        filter: blur > 0.4 ? `blur(${blur.toFixed(2)}px)` : undefined,
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          fontFamily: SANS,
          fontWeight: 600,
          fontSize: 16,
          letterSpacing: '0.36em',
          color: SODIUM,
        }}
      >
        {section.label}
      </div>
      <div
        style={{
          marginTop: 10,
          width: 48 * enter,
          height: 1,
          background: 'rgba(243,199,122,0.75)',
          marginLeft: center ? 'auto' : 0,
          marginRight: center ? 'auto' : 0,
        }}
      />
    </div>
  );
};

Kicker.displayName = 'Kicker';
