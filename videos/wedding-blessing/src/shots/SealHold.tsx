// 砂化落定之后的静止：同一幅「新婚快乐」继续停在画面上，
// 再慢慢描一只金环、盖一枚小囍、写下收句。第 0 帧与 grain 末帧重合，避免接缝跳变。
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from 'remotion';
import { GrainStage, GRAIN_DEFAULTS, GRAIN_DISSOLVE_DURATION } from './GrainDissolve';
import { CREAM, GOLD, GOLD_BRIGHT, SANS, SEAL, SERIF } from '../theme';

export const SEAL_HOLD_DURATION = 176;

export const SEAL_HOLD_DEFAULTS = {
  vow: GRAIN_DEFAULTS.vow,
  mark: GRAIN_DEFAULTS.mark,
  closing: '白头偕老',
  duration: SEAL_HOLD_DURATION,
};

type Props = Partial<typeof SEAL_HOLD_DEFAULTS>;

const FRAME = { x: 440, y: 388, w: 1008, h: 292, r: 46 };
const framePath = (() => {
  const { x, y, w, h, r } = FRAME;
  return `M ${x + r} ${y} H ${x + w - r} A ${r} ${r} 0 0 1 ${x + w} ${y + r} V ${y + h - r} A ${r} ${r} 0 0 1 ${x + w - r} ${y + h} H ${x + r} A ${r} ${r} 0 0 1 ${x} ${y + h - r} V ${y + r} A ${r} ${r} 0 0 1 ${x + r} ${y}`;
})();

export const SealHold: React.FC<Props> = (props) => {
  const {
    vow = SEAL_HOLD_DEFAULTS.vow,
    mark = SEAL_HOLD_DEFAULTS.mark,
    closing = SEAL_HOLD_DEFAULTS.closing,
    duration = SEAL_HOLD_DEFAULTS.duration,
  } = props;
  const frame = useCurrentFrame();
  const push = interpolate(frame, [0, duration], [1, 1.018], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const settle = interpolate(frame, [0, 80], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
  const glow = 0.55 - 0.1 * settle + Math.sin(frame / 36) * 0.012 * settle;
  const ring = interpolate(frame, [10, 88], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });
  const sealIn = interpolate(frame, [24, 48], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.2, 0.7, 0.25, 1),
  });
  const sub = interpolate(frame, [36, 62], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{ background: '#14080b', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, transform: `scale(${push})`, transformOrigin: '50% 48%' }}>
        <GrainStage t={1} vow={vow} mark={mark} glowOverride={glow} grainFrame={GRAIN_DISSOLVE_DURATION - 1 + frame} />
        <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          <path
            d={framePath}
            fill="none"
            stroke={GOLD_BRIGHT}
            strokeWidth={1.6}
            pathLength={100}
            strokeDasharray={100}
            strokeDashoffset={100 * (1 - ring)}
            opacity={0.9}
          />
        </svg>
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: 196,
            transform: `translateX(-50%) scale(${0.92 + 0.08 * sealIn})`,
            opacity: sealIn,
            width: 84,
            height: 84,
            borderRadius: 8,
            background: SEAL,
            color: CREAM,
            boxShadow: `inset 0 0 0 2px ${GOLD}`,
            fontFamily: SERIF,
            fontWeight: 600,
            fontSize: 58,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          囍
        </div>
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 778,
            textAlign: 'center',
            fontFamily: SANS,
            fontSize: 60,
            letterSpacing: '0.46em',
            color: GOLD_BRIGHT,
            opacity: sub,
            paddingLeft: '0.46em',
          }}
        >
          {closing}
        </div>
      </div>
    </AbsoluteFill>
  );
};

SealHold.displayName = 'SealHold';
