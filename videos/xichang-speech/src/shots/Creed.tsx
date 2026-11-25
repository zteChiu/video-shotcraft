import type { CSSProperties, FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { fade, pressStyle, pressT } from '../motion';
import { BONE, BONE_DIM, CINNABAR, FONT, GOLD } from '../theme';
import { Mark } from '../type';

export const CREED_DEFAULTS = {
  line10: '东厂破不了的案，由我西厂来破',
  line11: '东厂不敢杀的人，我杀',
  line12: '东厂不敢管的事，我管',
  line13: '一句话',
  line14: '东厂管得了的，我要管',
  line15: '东厂破不了的，我更要管',
  mark10: '由我西厂来破',
  mark11: '我杀',
  mark12: '我管',
  mark14: '我要管',
  mark15: '我更要管',
  bone: BONE,
  cinnabar: CINNABAR,
  gold: GOLD,
};

type Props = Partial<typeof CREED_DEFAULTS> & { duration?: number };

const ROW: { key: keyof typeof CREED_DEFAULTS; mark: keyof typeof CREED_DEFAULTS; at: number }[] = [
  { key: 'line10', mark: 'mark10', at: 0 },
  { key: 'line11', mark: 'mark11', at: 72 },
  { key: 'line12', mark: 'mark12', at: 144 },
  { key: 'line13', mark: 'mark10', at: 204 },
  { key: 'line14', mark: 'mark14', at: 234 },
  { key: 'line15', mark: 'mark15', at: 288 },
];

const textStyle: CSSProperties = {
  fontFamily: FONT,
  fontWeight: 600,
  fontSize: 68,
  letterSpacing: '0.04em',
  lineHeight: 1,
};

export const Creed: FC<Props> = (props) => {
  const p = { ...CREED_DEFAULTS, ...props };
  const frame = useCurrentFrame();
  const bright = interpolate(frame, [302, 324], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill>
      <div style={{ position: 'absolute', left: 310, top: 246, width: 1300 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 28, paddingLeft: 36, borderLeft: `2px solid ${p.gold}` }}>
          {ROW.map((row, i) => {
            if (frame < row.at) return null;
            const t = pressT(frame, row.at, 10);
            const nextAt = ROW[i + 1]?.at ?? 9999;
            const active = frame < nextAt + 8;
            const color = active || bright > 0.85 ? p.bone : BONE_DIM;
            if (row.key === 'line13') {
              const rule = fade(frame, row.at + 2, row.at + 14);
              return (
                <div key={row.key} style={{ ...pressStyle(t, '0% 50%'), display: 'flex', alignItems: 'center', gap: 22, height: 68 }}>
                  <div style={{ width: 180, height: 2, background: p.cinnabar, transform: `scaleX(${rule})`, transformOrigin: '100% 50%' }} />
                  <div style={{ ...textStyle, fontSize: 64, letterSpacing: '0.28em', color: p.cinnabar, paddingLeft: '0.28em' }}>
                    {p.line13}
                  </div>
                  <div style={{ width: 180, height: 2, background: p.cinnabar, transform: `scaleX(${rule})`, transformOrigin: '0% 50%' }} />
                </div>
              );
            }
            const mark = p[row.mark];
            return (
              <div key={row.key} style={{ ...textStyle, color, ...pressStyle(t, '0% 50%') }}>
                <Mark text={p[row.key]} mark={typeof mark === 'string' ? mark : undefined} color={p.cinnabar} />
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

Creed.displayName = 'Creed';
