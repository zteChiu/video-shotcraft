import type { FC } from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { fade, pressStyle, pressT } from '../motion';
import { BONE, FONT, GOLD } from '../theme';
import { Mark } from '../type';

export const TURN_DEFAULTS = {
  kicker: '你问我',
  hero: '西厂算什么东西',
  mark: '西厂',
  follow: '现在我就来告诉你',
  bone: BONE,
  gold: GOLD,
};

type Props = Partial<typeof TURN_DEFAULTS> & { duration?: number };

export const Turn: FC<Props> = (props) => {
  const p = { ...TURN_DEFAULTS, ...props };
  const frame = useCurrentFrame();
  const k = pressT(frame, 0, 14);
  const h = pressT(frame, 6, 16);
  const f = pressT(frame, 78, 12);
  const rule = fade(frame, 96, 118);

  return (
    <AbsoluteFill>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 268, textAlign: 'center' }}>
        <div
          style={{
            ...pressStyle(k),
            fontFamily: FONT,
            fontWeight: 500,
            fontSize: 72,
            letterSpacing: '0.46em',
            color: p.gold,
            paddingLeft: '0.46em',
          }}
        >
          {p.kicker}
        </div>
      </div>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 420, textAlign: 'center' }}>
        <div
          style={{
            ...pressStyle(h),
            fontFamily: FONT,
            fontWeight: 700,
            fontSize: 116,
            letterSpacing: '0.1em',
            color: p.bone,
            lineHeight: 1,
          }}
        >
          <Mark text={p.hero} mark={p.mark} color={p.gold} />
        </div>
      </div>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 640, textAlign: 'center' }}>
        <div style={{ ...pressStyle(f), display: 'inline-block' }}>
          <div
            style={{
              fontFamily: FONT,
              fontWeight: 600,
              fontSize: 64,
              letterSpacing: '0.14em',
              color: p.bone,
            }}
          >
            {p.follow}
          </div>
          <div
            style={{
              height: 4,
              marginTop: 18,
              background: p.gold,
              transform: `scaleX(${rule})`,
              transformOrigin: '0% 50%',
            }}
          />
        </div>
      </div>
    </AbsoluteFill>
  );
};

Turn.displayName = 'Turn';
