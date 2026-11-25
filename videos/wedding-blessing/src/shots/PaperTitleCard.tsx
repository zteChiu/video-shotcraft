// paper-title-card — 逐词 letterpress 压印。时值沿 demo：
// 第 i 词 delay = 4 + i·4、9f，scale 1.28→1，blur 7，bezier(0.2, 0.75, 0.3, 1)；
// 下划线 16–34f；整卡 55f，末 8f 淡出。
// 中文没有真正的斜体，重点词只改金色，避免合成倾斜。没有数字，所以不挂 DigitRoll。
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from 'remotion';
import { PaperField } from '../stage';
import { GOLD, INK, INK_SOFT, SANS, SERIF } from '../theme';

export const PAPER_TITLE_CARD_DURATION = 55;

export const PAPER_TITLE_DEFAULTS = {
  line1: '愿此生',
  line2: '常相守',
  accent: '常相守',
  sub: '一诺千金',
  fontSize: 116,
  duration: PAPER_TITLE_CARD_DURATION,
};

type Props = Partial<typeof PAPER_TITLE_DEFAULTS>;

const splitAccent = (line: string, accent: string) => {
  if (!accent) return [{ text: line, accent: false }];
  const at = line.indexOf(accent);
  if (at < 0) return [{ text: line, accent: false }];
  const parts: { text: string; accent: boolean }[] = [];
  if (at > 0) parts.push({ text: line.slice(0, at), accent: false });
  parts.push({ text: accent, accent: true });
  if (at + accent.length < line.length) parts.push({ text: line.slice(at + accent.length), accent: false });
  return parts;
};

export const PaperTitleCard: React.FC<Props> = (props) => {
  const {
    line1 = PAPER_TITLE_DEFAULTS.line1,
    line2 = PAPER_TITLE_DEFAULTS.line2,
    accent = PAPER_TITLE_DEFAULTS.accent,
    sub = PAPER_TITLE_DEFAULTS.sub,
    fontSize = PAPER_TITLE_DEFAULTS.fontSize,
    duration = PAPER_TITLE_DEFAULTS.duration,
  } = props;
  const frame = useCurrentFrame();
  const fadeOut = interpolate(frame, [duration - 8, duration], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const underline = interpolate(frame, [16, 34], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.3, 0, 0.2, 1),
  });
  const subT = interpolate(frame, [10, 22], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const words = [
    { text: line1, accent: false, br: true },
    ...splitAccent(line2, accent).map((part) => ({ ...part, br: false })),
  ];

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
            opacity: fadeOut,
          }}
        >
          <div style={{ textAlign: 'center', maxWidth: 1500 }}>
            <div
              style={{
                fontFamily: SERIF,
                fontSize,
                fontWeight: 600,
                lineHeight: 1.18,
                color: INK,
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
                columnGap: '0.06em',
              }}
            >
              {words.map((w, i) => {
                const delay = 4 + i * 4;
                const t = interpolate(frame, [delay, delay + 9], [0, 1], {
                  extrapolateLeft: 'clamp',
                  extrapolateRight: 'clamp',
                  easing: Easing.bezier(0.2, 0.75, 0.3, 1),
                });
                return (
                  <span key={`${w.text}-${i}`} style={{ display: 'contents' }}>
                    <span
                      style={{
                        opacity: t,
                        transform: t > 0.999 ? undefined : `scale(${1.28 - 0.28 * t})`,
                        filter: t > 0.999 ? undefined : `blur(${(1 - t) * 7}px)`,
                        display: 'inline-block',
                        color: w.accent ? GOLD : INK,
                      }}
                    >
                      {w.text}
                    </span>
                    {w.br ? <span style={{ flexBasis: '100%', height: 0 }} /> : null}
                  </span>
                );
              })}
            </div>
            <div
              style={{
                height: 6,
                width: 220,
                margin: '36px auto 0',
                borderRadius: 3,
                background: GOLD,
                transform: `scaleX(${underline})`,
              }}
            />
            <div
              style={{
                marginTop: 32,
                fontFamily: SANS,
                fontSize: 40,
                letterSpacing: '0.16em',
                color: INK_SOFT,
                opacity: subT,
                paddingLeft: '0.16em',
              }}
            >
              {sub}
            </div>
          </div>
        </div>
      </PaperField>
    </AbsoluteFill>
  );
};

PaperTitleCard.displayName = 'PaperTitleCard';
