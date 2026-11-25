import type { CSSProperties, FC } from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { pressStyle, pressT } from '../motion';
import { BONE, BONE_DIM, CINNABAR, FONT, GOLD } from '../theme';
import { Mark } from '../type';

export const ACCUSATION_DEFAULTS = {
  line1a: '一个江湖剑客',
  line1b: '就把你们搞得杯弓蛇影',
  line2: '缩在庙里叹气，有用吗',
  line3: '咱们当官的，是替皇上分忧的',
  mark1: '杯弓蛇影',
  mark3: '替皇上分忧',
  bone: BONE,
  gold: GOLD,
  cinnabar: CINNABAR,
};

type Props = Partial<typeof ACCUSATION_DEFAULTS> & { duration?: number };

const line: CSSProperties = {
  fontFamily: FONT,
  fontWeight: 600,
  letterSpacing: '0.04em',
  lineHeight: 1.25,
};

export const Accusation: FC<Props> = (props) => {
  const p = { ...ACCUSATION_DEFAULTS, ...props };
  const frame = useCurrentFrame();
  const a = pressT(frame, 0, 12);
  const b = pressT(frame, 84, 11);
  const c = pressT(frame, 144, 11);

  return (
    <AbsoluteFill>
      <div style={{ position: 'absolute', left: 168, top: 286, display: 'flex', gap: 36, alignItems: 'stretch' }}>
        <div style={{ width: 2, background: p.gold, opacity: a }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 36, maxWidth: 1460 }}>
          <div style={{ ...pressStyle(a, '0% 50%') }}>
            <div style={{ ...line, fontSize: 92, color: p.bone }}>{p.line1a}</div>
            <div style={{ ...line, fontSize: 92, color: p.bone, marginTop: 8 }}>
              <Mark text={p.line1b} mark={p.mark1} color={p.gold} />
            </div>
          </div>
          <div style={{ ...line, fontSize: 64, color: BONE_DIM, ...pressStyle(b, '0% 50%') }}>{p.line2}</div>
          <div style={{ ...line, fontSize: 64, color: p.bone, ...pressStyle(c, '0% 50%') }}>
            <Mark text={p.line3} mark={p.mark3} color={p.cinnabar} />
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

Accusation.displayName = 'Accusation';
