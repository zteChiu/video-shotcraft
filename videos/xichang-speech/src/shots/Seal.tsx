import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { fade, hitShake, pressStyle, pressT, slamRotate, slamScale } from '../motion';
import { BONE, CINNABAR, FONT, GOLD } from '../theme';
import { Mark } from '../type';

export const SEAL_DEFAULTS = {
  couplet: '先斩后奏，皇权特许',
  line: '这就是西厂',
  mark: '西厂',
  seal: '西厂',
  question: '够不够清楚',
  bone: BONE,
  gold: GOLD,
  cinnabar: CINNABAR,
};

type Props = Partial<typeof SEAL_DEFAULTS> & { duration?: number };

const IMPACT = 72;

export const Seal: FC<Props> = (props) => {
  const p = { ...SEAL_DEFAULTS, ...props };
  const frame = useCurrentFrame();
  const coupletIn = pressT(frame, 0, 12);
  const coupletTop = interpolate(frame, [58, 78], [450, 156], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const showLockup = frame >= IMPACT - 7;
  const scale = slamScale(frame, IMPACT);
  const rot = slamRotate(frame, IMPACT);
  const shake = hitShake(frame, IMPACT, 4, 6);
  const echo = fade(frame, IMPACT, IMPACT + 14);
  const echoOp = interpolate(frame, [IMPACT, IMPACT + 16], [0.85, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const q = pressT(frame, 132, 14);

  return (
    <AbsoluteFill style={{ transform: `translate(${shake.x}px, ${shake.y}px)` }}>
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '46%',
          width: 900,
          height: 900,
          marginLeft: -450,
          marginTop: -450,
          background: 'radial-gradient(circle, rgba(214,69,61,0.16) 0%, transparent 68%)',
          opacity: showLockup ? interpolate(frame, [IMPACT - 7, IMPACT + 10], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) : 0,
        }}
      />

      <div style={{ position: 'absolute', left: 0, right: 0, top: coupletTop, textAlign: 'center' }}>
        <div
          style={{
            ...pressStyle(coupletIn),
            fontFamily: FONT,
            fontWeight: 600,
            fontSize: 80,
            letterSpacing: '0.18em',
            color: p.gold,
            lineHeight: 1,
          }}
        >
          {p.couplet}
        </div>
      </div>

      <div style={{ position: 'absolute', left: 0, right: 0, top: 360, textAlign: 'center' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 48,
            opacity: showLockup ? 1 : 0,
            transform: `scale(${showLockup ? scale : 1}) rotate(${showLockup ? rot : 0}deg)`,
            transformOrigin: '50% 55%',
            filter: showLockup && frame < IMPACT ? `blur(${((1 - (frame - (IMPACT - 7)) / 7) * 5).toFixed(2)}px)` : undefined,
          }}
        >
          <div style={{ position: 'relative', width: 204, height: 204, transform: 'rotate(-1.5deg)' }}>
            <div
              style={{
                position: 'absolute',
                inset: -16,
                border: `3px solid ${p.cinnabar}`,
                opacity: echoOp,
                transform: `scale(${1 + echo * 0.22})`,
              }}
            />
            <div
              style={{
                width: 204,
                height: 204,
                boxSizing: 'border-box',
                border: `10px solid ${p.cinnabar}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <div
                style={{
                  width: 164,
                  height: 164,
                  boxSizing: 'border-box',
                  border: `2px solid ${p.cinnabar}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: p.cinnabar,
                  fontFamily: FONT,
                  fontWeight: 900,
                  fontSize: 76,
                  letterSpacing: '0.01em',
                  lineHeight: 1,
                  whiteSpace: 'nowrap',
                }}
              >
                {p.seal}
              </div>
            </div>
          </div>
          <div
            style={{
              fontFamily: FONT,
              fontWeight: 700,
              fontSize: 108,
              letterSpacing: '0.08em',
              color: p.bone,
              lineHeight: 1,
            }}
          >
            <Mark text={p.line} mark={p.mark} color={p.cinnabar} />
          </div>
        </div>
      </div>

      <div style={{ position: 'absolute', left: 0, right: 0, top: 820, textAlign: 'center' }}>
        <div
          style={{
            ...pressStyle(q),
            fontFamily: FONT,
            fontWeight: 500,
            fontSize: 68,
            letterSpacing: '0.42em',
            color: p.bone,
            paddingLeft: '0.42em',
          }}
        >
          {p.question}
        </div>
      </div>
    </AbsoluteFill>
  );
};

Seal.displayName = 'Seal';
