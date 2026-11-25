import type { CSSProperties, FC } from 'react';
import { useCurrentFrame } from 'remotion';
import { EASE, ramp } from './ease';
import { IVORY, ROSSO, SANS, SERIF } from './theme';

export const TITLE_DEFAULTS = {
  word: 'Ferrari',
  credit: 'Bebe Rexha',
  writers: 'Jason Evigan   ·   Bleta Rexha   ·   Asia Whitacre',
  duration: 353,
};

type Props = Partial<typeof TITLE_DEFAULTS>;

export const Title: FC<Props> = ({
  word = TITLE_DEFAULTS.word,
  credit = TITLE_DEFAULTS.credit,
  writers = TITLE_DEFAULTS.writers,
  duration = TITLE_DEFAULTS.duration,
}) => {
  const frame = useCurrentFrame();
  const rule = ramp(frame, 16, 22, EASE.snappy);
  const p = ramp(frame, 18, 90, EASE.out);
  const creditP = ramp(frame, 126, 22, EASE.out);
  const writersP = ramp(frame, 152, 20, EASE.out);
  const exitP = ramp(frame, Math.max(0, duration - 14), 14, EASE.exit);
  const sheen = ramp(frame, 150, 40, EASE.swift);
  const showSheen = frame >= 150 && frame <= 196 && exitP < 0.02;

  const track = 0.16 + (-0.045 - 0.16) * p;
  const wordStyle: CSSProperties = {
    fontFamily: SERIF,
    fontStyle: 'italic',
    fontWeight: 400,
    fontSize: 156,
    lineHeight: 0.9,
    letterSpacing: `${track.toFixed(4)}em`,
    color: ROSSO,
    opacity: p,
    transform: `translateY(${((1 - p) * 58).toFixed(2)}px)`,
    filter: p > 0.985 ? undefined : `blur(${((1 - p) * 16).toFixed(2)}px)`,
    fontSynthesis: 'none',
  };
  if (showSheen) {
    const at = sheen * 140 - 20;
    wordStyle.color = 'transparent';
    wordStyle.backgroundImage = `linear-gradient(105deg, ${ROSSO} ${at - 16}%, #ffe1b2 ${at}%, ${ROSSO} ${at + 16}%)`;
    wordStyle.WebkitBackgroundClip = 'text';
    wordStyle.backgroundClip = 'text';
  }

  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        top: 586,
        textAlign: 'center',
        opacity: 1 - exitP,
        transform: `translateY(${(-18 * exitP).toFixed(2)}px)`,
        filter: exitP > 0.03 ? `blur(${(12 * exitP).toFixed(2)}px)` : undefined,
      }}
    >
      <div
        style={{
          width: 156,
          height: 1.5,
          margin: '0 auto 14px',
          background: ROSSO,
          transform: `scaleX(${rule.toFixed(4)})`,
          opacity: rule,
        }}
      />
      <div style={wordStyle}>{word}</div>
      <div
        style={{
          marginTop: 28,
          fontFamily: SANS,
          fontWeight: 600,
          fontSize: 20,
          letterSpacing: '0.46em',
          textTransform: 'uppercase',
          color: IVORY,
          opacity: creditP,
          transform: `translateY(${((1 - creditP) * 16).toFixed(2)}px)`,
          filter: creditP > 0.98 ? undefined : `blur(${((1 - creditP) * 8).toFixed(2)}px)`,
        }}
      >
        {credit}
      </div>
      <div
        style={{
          marginTop: 16,
          fontFamily: SANS,
          fontWeight: 500,
          fontSize: 15,
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: 'rgba(246,241,231,0.55)',
          opacity: writersP,
          transform: `translateY(${((1 - writersP) * 10).toFixed(2)}px)`,
        }}
      >
        {writers}
      </div>
    </div>
  );
};

Title.displayName = 'Title';
