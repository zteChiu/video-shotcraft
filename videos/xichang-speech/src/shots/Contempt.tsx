import type { CSSProperties, FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { fade, hitShake, pressStyle, pressT, slamRotate, slamScale } from '../motion';
import { BONE, BONE_DIM, CINNABAR, FONT, GOLD } from '../theme';
import { Mark } from '../type';

export const CONTEMPT_DEFAULTS = {
  hero: '西厂算什么东西',
  line5: '你们西厂设立还不到半年',
  line6: '你凭什么资格',
  line7: '替皇上分忧',
  mark6: '凭什么',
  bone: BONE,
  gold: GOLD,
  cinnabar: CINNABAR,
};

type Props = Partial<typeof CONTEMPT_DEFAULTS> & { duration?: number };

const IMPACT = 8;

const support: CSSProperties = {
  fontFamily: FONT,
  fontWeight: 600,
  letterSpacing: '0.06em',
  textAlign: 'center',
};

export const Contempt: FC<Props> = (props) => {
  const p = { ...CONTEMPT_DEFAULTS, ...props };
  const frame = useCurrentFrame();
  const duration = props.duration ?? 240;
  const breath = interpolate(frame, [duration - 18, duration], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const visible = frame >= IMPACT - 7 ? 1 : 0;
  const scale = slamScale(frame, IMPACT);
  const rot = slamRotate(frame, IMPACT);
  const shake = hitShake(frame, IMPACT, 5, 7);
  const heroTop = interpolate(frame, [42, 62], [430, 188], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const rule = fade(frame, IMPACT, IMPACT + 12);
  const l5 = pressT(frame, 48);
  const l6 = pressT(frame, 114);
  const l7 = pressT(frame, 162);

  return (
    <AbsoluteFill style={{ opacity: breath, transform: `translate(${shake.x}px, ${shake.y}px)` }}>
      <div style={{ position: 'absolute', left: 0, right: 0, top: heroTop, textAlign: 'center' }}>
        <div
          style={{
            display: 'inline-block',
            opacity: visible,
            transform: `scale(${scale}) rotate(${rot}deg)`,
            transformOrigin: '50% 60%',
            filter: frame < IMPACT ? `blur(${((1 - (frame - (IMPACT - 7)) / 7) * 6).toFixed(2)}px)` : undefined,
          }}
        >
          <div
            style={{
              fontFamily: FONT,
              fontWeight: 700,
              fontSize: 112,
              letterSpacing: '0.08em',
              color: p.bone,
              lineHeight: 1,
            }}
          >
            {p.hero}
          </div>
          <div
            style={{
              height: 5,
              width: 420,
              margin: '22px auto 0',
              background: p.cinnabar,
              transform: `scaleX(${rule})`,
              transformOrigin: '50% 50%',
            }}
          />
        </div>
      </div>

      <div style={{ position: 'absolute', left: 0, right: 0, top: 430, ...support, fontSize: 60, color: BONE_DIM, ...pressStyle(l5) }}>
        {p.line5}
      </div>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 548, ...support, fontSize: 76, color: p.bone, ...pressStyle(l6) }}>
        <Mark text={p.line6} mark={p.mark6} color={p.cinnabar} />
      </div>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 680, ...support, fontSize: 60, color: p.gold, ...pressStyle(l7) }}>
        「{p.line7}」
      </div>
    </AbsoluteFill>
  );
};

Contempt.displayName = 'Contempt';
