import type { CSSProperties, FC } from 'react';
import { useCurrentFrame } from 'remotion';
import { EASE, ramp } from './ease';
import type { Align, Emphasis, Mode, Tone } from './timeline';
import { CJK, IVORY, ROSSO, SERIF, SODIUM } from './theme';

export const LYRIC_DEFAULTS = {
  en: "I'm a Ferrari",
  zh: '我就像一辆法拉利',
  align: 'center' as Align,
  tone: 'rosso' as Tone,
  mode: 'line' as Mode,
  emphasis: 'hook' as Emphasis,
  duration: 90,
  zhDelay: 10,
};

type Props = Partial<typeof LYRIC_DEFAULTS>;

const wrapEnglish = (text: string, size: number, maxWidth: number) => {
  const words = text.split(' ').filter(Boolean);
  const unit = size * 0.5;
  const lines: string[] = [];
  let cur = '';
  for (const word of words) {
    const next = cur ? `${cur} ${word}` : word;
    if (cur && next.length * unit > maxWidth) {
      lines.push(cur);
      cur = word;
    } else {
      cur = next;
    }
  }
  if (cur) lines.push(cur);
  return lines.length > 0 ? lines : [text];
};

const layoutEnglish = (text: string, tone: Tone, emphasis: Emphasis, maxWidth: number) => {
  if (tone === 'rosso') {
    return { size: emphasis === 'echo' ? 108 : 132, lines: [text] };
  }
  let size = 86;
  for (let i = 0; i < 5; i++) {
    const lines = wrapEnglish(text, size, maxWidth);
    if (lines.length <= 2) return { size, lines };
    size -= 8;
  }
  return { size, lines: wrapEnglish(text, size, maxWidth) };
};

const WordRow: FC<{
  words: { text: string; start: number }[];
  size: number;
  dur: number;
  color: string;
  italic: boolean;
  align: Align;
}> = ({ words, size, dur, color, italic, align }) => {
  const frame = useCurrentFrame();
  const dy = size * 0.36;
  const blur = Math.min(16, size * 0.11);
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: align === 'center' ? 'center' : 'flex-start',
        flexWrap: 'nowrap',
      }}
    >
      {words.map((word, i) => {
        const p = ramp(frame, word.start, dur, EASE.out);
        return (
          <span
            key={`${word.text}-${i}`}
            style={{
              display: 'inline-block',
              marginRight: i === words.length - 1 ? 0 : '0.36em',
              fontFamily: SERIF,
              fontStyle: italic ? 'italic' : 'normal',
              fontWeight: 400,
              fontSize: size,
              lineHeight: 1.02,
              letterSpacing: size >= 100 ? '-0.03em' : '-0.02em',
              color,
              opacity: p,
              transform: `translateY(${((1 - p) * dy).toFixed(2)}px)`,
              filter: p > 0.985 ? undefined : `blur(${((1 - p) * blur).toFixed(2)}px)`,
              fontSynthesis: 'none',
            }}
          >
            {word.text}
          </span>
        );
      })}
    </div>
  );
};

export const LyricLine: FC<Props> = ({
  en = LYRIC_DEFAULTS.en,
  zh = LYRIC_DEFAULTS.zh,
  align = LYRIC_DEFAULTS.align,
  tone = LYRIC_DEFAULTS.tone,
  mode = LYRIC_DEFAULTS.mode,
  emphasis = LYRIC_DEFAULTS.emphasis,
  duration = LYRIC_DEFAULTS.duration,
  zhDelay = LYRIC_DEFAULTS.zhDelay,
}) => {
  const frame = useCurrentFrame();
  const exitP = ramp(frame, Math.max(0, duration - 12), 12, EASE.exit);
  const shell: CSSProperties = {
    opacity: 1 - exitP,
    transform: `translateY(${(-16 * exitP).toFixed(2)}px)`,
    filter: exitP > 0.03 ? `blur(${(10 * exitP).toFixed(2)}px)` : undefined,
  };

  if (mode === 'whoa') {
    const drift = ramp(frame, 34, Math.max(24, duration - 46), EASE.smooth);
    return (
      <div style={{ position: 'absolute', inset: 0, ...shell }}>
        {['whoa', 'whoa', 'whoa'].map((text, i) => {
          const p = ramp(frame, 4 + i * 10, 22, EASE.out);
          const x = 18 + i * 32;
          const shift = (i - 1) * 42 * drift;
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: `${x}%`,
                top: 655,
                transform: `translate(calc(-50% + ${shift.toFixed(1)}px), ${((1 - p) * 34).toFixed(2)}px)`,
                opacity: p,
                filter: p > 0.985 ? undefined : `blur(${((1 - p) * 14).toFixed(2)}px)`,
                fontFamily: SERIF,
                fontStyle: 'italic',
                fontSize: 80,
                letterSpacing: '0.08em',
                color: IVORY,
                fontSynthesis: 'none',
              }}
            >
              {text}
            </div>
          );
        })}
      </div>
    );
  }

  if (mode === 'aside') {
    const p = ramp(frame, 0, 12, EASE.out);
    return (
      <div
        style={{
          position: 'absolute',
          right: 168,
          top: 748,
          ...shell,
          fontFamily: SERIF,
          fontStyle: 'italic',
          fontSize: 46,
          color: IVORY,
          opacity: (1 - exitP) * p,
          filter: p > 0.98 && exitP < 0.03 ? undefined : `blur(${((1 - p) * 8 + exitP * 8).toFixed(2)}px)`,
        }}
      >
        {en}
      </div>
    );
  }

  const maxWidth = align === 'center' ? 1480 : 980;
  const { size, lines } = layoutEnglish(en, tone, emphasis, maxWidth);
  const wordCount = lines.reduce((n, line) => n + line.split(' ').filter(Boolean).length, 0);
  const gap = wordCount > 8 ? 2.5 : 4;
  const wordDur = 22;
  let cursor = 0;
  const rows = lines.map((line, li) => {
    if (li > 0) cursor += 6;
    const words = line.split(' ').filter(Boolean).map((text, i) => ({ text, start: cursor + i * gap }));
    if (words.length > 0) cursor = words[words.length - 1].start + 4;
    return words;
  });
  const lastStart = rows.length > 0 && rows[rows.length - 1].length > 0 ? rows[rows.length - 1][rows[rows.length - 1].length - 1].start : 0;
  // Long sentences enter as one phrase. Word-by-word is for a single short line,
  // otherwise the last words are still blurring in on top of the Chinese.
  const useWords = lines.length === 1 && wordCount >= 2 && wordCount <= 7 && lastStart + wordDur < duration * 0.5;
  const block = ramp(frame, 0, 16, EASE.out);
  const color = tone === 'rosso' ? ROSSO : IVORY;
  const zhSize = tone === 'rosso' ? 32 : Math.min(36, Math.max(28, Math.round(size * 0.42)));
  const zhStart = Math.max(zhDelay, useWords ? lastStart + 12 : 14);
  const zhP = zh ? ramp(frame, zhStart, 18, EASE.out) : 0;
  const top = align === 'center' ? 604 : 636;

  return (
    <div
      style={{
        position: 'absolute',
        left: align === 'center' ? 140 : 148,
        right: align === 'center' ? 140 : undefined,
        width: align === 'center' ? undefined : maxWidth,
        top,
        textAlign: align,
        ...shell,
      }}
    >
      {useWords ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {rows.map((words, i) => (
            <WordRow key={i} words={words} size={size} dur={wordDur} color={color} italic={tone === 'rosso'} align={align} />
          ))}
        </div>
      ) : (
        <div
          style={{
            fontFamily: SERIF,
            fontStyle: tone === 'rosso' ? 'italic' : 'normal',
            fontWeight: 400,
            fontSize: size,
            lineHeight: 1.05,
            letterSpacing: size >= 100 ? '-0.03em' : '-0.02em',
            color,
            opacity: block,
            transform: `translateY(${((1 - block) * size * 0.32).toFixed(2)}px)`,
            filter: block > 0.985 ? undefined : `blur(${((1 - block) * Math.min(16, size * 0.11)).toFixed(2)}px)`,
            fontSynthesis: 'none',
          }}
        >
          {lines.map((line) => (
            <div key={line}>{line}</div>
          ))}
        </div>
      )}
      {zh ? (
        <div
          style={{
            marginTop: 28,
            fontFamily: CJK,
            fontWeight: 500,
            fontSize: zhSize,
            letterSpacing: '0.04em',
            lineHeight: 1.35,
            color: SODIUM,
            opacity: zhP,
            transform: `translateY(${((1 - zhP) * 18).toFixed(2)}px)`,
            filter: zhP > 0.985 ? undefined : `blur(${((1 - zhP) * 8).toFixed(2)}px)`,
          }}
        >
          {zh}
        </div>
      ) : null}
    </div>
  );
};

LyricLine.displayName = 'LyricLine';
