// brand-ink-open — 十字准星描画 → 字标 letterpress → 打字机副标 → 满一秒静止 → 上浮消散。
// 时值沿 demo（demos/typography/brand-ink-open/BrandInkOpen.tsx）：
// 竖线 0–9f、横线 8–18f、准星 24–34f 淡出；单字压印 12f、scale 1.6→1、blur 6；
// 多字时把错峰摊开，让最后一字仍在第 64 帧落定，97–104f 退场。
// 婚礼蒙皮：字标是一枚朱红方印「囍」，不是产品小写字标。中文副标按 3f/字，
// 因为 0.7f/字只适用于装饰性拉丁小字。
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from 'remotion';
import { PaperField } from '../stage';
import { CREAM, GOLD, INK_SOFT, SANS, SEAL, SERIF } from '../theme';

export const BRAND_INK_OPEN_DURATION = 104;

export const BRAND_INK_DEFAULTS = {
  wordmark: '囍',
  wordmarkSize: 220,
  kicker: '佳期已至',
  kickerSize: 40,
  ink: SEAL,
  gold: GOLD,
  cream: CREAM,
};

type Props = Partial<typeof BRAND_INK_DEFAULTS>;

export const BrandInkOpen: React.FC<Props> = (props) => {
  const {
    wordmark = BRAND_INK_DEFAULTS.wordmark,
    wordmarkSize = BRAND_INK_DEFAULTS.wordmarkSize,
    kicker = BRAND_INK_DEFAULTS.kicker,
    kickerSize = BRAND_INK_DEFAULTS.kickerSize,
    ink = BRAND_INK_DEFAULTS.ink,
    gold = BRAND_INK_DEFAULTS.gold,
    cream = BRAND_INK_DEFAULTS.cream,
  } = props;
  const frame = useCurrentFrame();

  const vDraw = interpolate(frame, [0, 9], [100, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.3, 0, 0.2, 1),
  });
  const hDraw = interpolate(frame, [8, 18], [100, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.linear,
  });
  const crossFade = interpolate(frame, [24, 34], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const cjk = /[\u3400-\u9fff]/.test(kicker);
  const perChar = cjk ? 3 : 0.7;
  const kickStart = 28;
  const kickChars = Math.floor(Math.max(0, frame - kickStart) / perChar);
  const kickDone = kickStart + kicker.length * perChar;
  const cursorOn = (() => {
    if (frame < kickStart) return false;
    if (frame < kickDone) return true;
    if (frame > 95) return false;
    return Math.floor((frame - kickDone) / 2) % 2 === 0;
  })();

  const brandOut = interpolate(frame, [97, 104], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.4, 0, 0.5, 1),
  });
  const glyphs = Array.from(wordmark);
  const stagger = glyphs.length <= 1 ? 0 : (64 - 12 - 10) / (glyphs.length - 1);

  return (
    <AbsoluteFill>
      <PaperField>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: 1 - brandOut,
            transform: `translateY(${-brandOut * 40}px) scale(${1 - brandOut * 0.12})`,
          }}
        >
          <div style={{ position: 'relative', textAlign: 'center' }}>
            <svg
              width={64}
              height={64}
              viewBox="0 0 64 64"
              style={{ position: 'absolute', left: '50%', top: -248, marginLeft: -32, opacity: crossFade }}
            >
              <line
                x1={32} y1={2} x2={32} y2={62}
                stroke={gold} strokeWidth={5} strokeLinecap="round"
                pathLength={100} strokeDasharray={100} strokeDashoffset={vDraw}
              />
              <line
                x1={2} y1={32} x2={62} y2={32}
                stroke={gold} strokeWidth={5} strokeLinecap="round"
                pathLength={100} strokeDasharray={100} strokeDashoffset={hDraw}
              />
            </svg>
            <div
              style={{
                fontFamily: SERIF,
                fontSize: wordmarkSize,
                fontWeight: 600,
                lineHeight: 1,
                display: 'inline-flex',
                alignItems: 'flex-end',
              }}
            >
              {glyphs.map((ch, i) => {
                const delay = 10 + i * stagger;
                const t = interpolate(frame, [delay, delay + 12], [0, 1], {
                  extrapolateLeft: 'clamp',
                  extrapolateRight: 'clamp',
                  easing: Easing.bezier(0.2, 0.7, 0.25, 1),
                });
                const glintCenter = delay + 12;
                const glint = interpolate(frame, [glintCenter - 4, glintCenter, glintCenter + 4], [0, 1, 0], {
                  extrapolateLeft: 'clamp',
                  extrapolateRight: 'clamp',
                });
                return (
                  <span
                    key={`${ch}-${i}`}
                    style={{
                      position: 'relative',
                      display: 'inline-flex',
                      opacity: t,
                      transform: t > 0.999 ? undefined : `scale(${1.6 - 0.6 * t})`,
                      transformOrigin: 'center bottom',
                      filter: t > 0.999 ? undefined : `blur(${(1 - t) * 6}px)`,
                    }}
                  >
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '1.18em',
                        height: '1.18em',
                        background: ink,
                        color: cream,
                        borderRadius: 12,
                        boxShadow: `inset 0 0 0 3px ${gold}`,
                      }}
                    >
                      {ch === ' ' ? '\u00a0' : ch}
                    </span>
                    <span
                      style={{
                        position: 'absolute',
                        left: '50%',
                        bottom: -10,
                        transform: 'translateX(-50%)',
                        width: `${glint * 72}%`,
                        height: 3,
                        background: gold,
                        opacity: glint,
                        borderRadius: 2,
                      }}
                    />
                  </span>
                );
              })}
            </div>
            <div
              style={{
                marginTop: 36,
                height: kickerSize + 8,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                fontFamily: SANS,
                fontSize: kickerSize,
                letterSpacing: '0.34em',
                color: INK_SOFT,
                paddingLeft: '0.34em',
              }}
            >
              <span>{kicker.slice(0, kickChars)}</span>
              <span
                style={{
                  display: 'inline-block',
                  width: 3,
                  height: kickerSize * 0.86,
                  marginLeft: 8,
                  background: gold,
                  opacity: cursorOn ? 0.9 : 0,
                }}
              />
            </div>
          </div>
        </div>
      </PaperField>
    </AbsoluteFill>
  );
};

BrandInkOpen.displayName = 'BrandInkOpen';
