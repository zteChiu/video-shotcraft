// grain-dissolve — 整句砂化，凝聚成短字标。
// 时值不走 useVideoConfig()：那会读到整片 450 帧，把 2 秒的砂化拉成整段。
// 这里按 demo 的 60 帧合成（t = localFrame / 59）还原同一条曲线：
// burst 0.13–0.28、凝聚 0.60–0.71、凝固 0.68–0.90、辉光回落 0.88–1，
// displacement 峰值 52、baseFrequency 0.9→1.3、seed = floor(t*46)。
// 选区框改成金线请柬框，冷白辉光改成暖金，句子换成誓言。几何与时机不动。
import { useId } from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { E, rand, seg } from '../motion';
import { FilmGrain } from '../stage';
import { LACQUER, LACQUER_DEEP, SERIF } from '../theme';

export const GRAIN_DISSOLVE_DURATION = 60;
const ARC = GRAIN_DISSOLVE_DURATION - 1;

export const GRAIN_DEFAULTS = {
  vow: '愿此生，常相守',
  mark: '新婚快乐',
};

type GrainProps = Partial<typeof GRAIN_DEFAULTS> & { glowOverride?: number; grainFrame?: number };

const BX = 128;
const BY = 148;
const BW = 384;
const BH = 62;

const SAND = Array.from({ length: 150 }, (_, i) => {
  const r = (k: number) => rand(i * 13.7 + k * 101.3);
  const ang = r(3) * Math.PI * 2;
  return {
    hx: 150 + r(1) * 340,
    hy: 164 + r(2) * 30,
    dx: Math.cos(ang) * (8 + r(4) * 26),
    dy: Math.sin(ang) * (5 + r(5) * 14),
    tx: 170 + r(6) * 300,
    ty: 168 + r(7) * 32,
    size: 0.35 + r(8) * 0.75,
    alpha: 0.25 + r(9) * 0.6,
    lag: r(10) * 0.05,
    ph: r(11) * Math.PI * 2,
  };
});

const Corner: React.FC<{ x: number; y: number; sx: number; sy: number }> = ({ x, y, sx, sy }) => (
  <>
    <path
      d={`M${x + 16 * sx} ${y}H${x}V${y + 16 * sy}`}
      fill="none"
      stroke="#a68455"
      strokeWidth={1.15}
      strokeLinecap="square"
    />
    <circle cx={x + 34 * sx} cy={y + 28 * sy} r={1.4} fill="#c6a15b" />
  </>
);

export const GrainStage: React.FC<GrainProps & { t: number }> = ({ t, vow, mark, glowOverride, grainFrame }) => {
  const line = vow ?? GRAIN_DEFAULTS.vow;
  const word = mark ?? GRAIN_DEFAULTS.mark;
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '');
  const fid = `gd-${uid}`;
  const sid = `gd-${uid}-streak`;
  const burst = seg(t, 0.13, 0.28, E.outCubic);
  const cond = seg(t, 0.6, 0.71, E.inOutCubic);
  const lock = seg(t, 0.68, 0.9, E.outCubic);
  const settle = seg(t, 0.88, 1, E.outCubic);
  const glow = glowOverride ?? Math.max(0, burst * 0.3 + cond * 0.7 - settle * 0.45);
  const boxOut = seg(t, 0.55, 0.64, E.inCubic);
  const boxOpen = burst * (1 - boxOut * 0.35);
  const boxOp = Math.min(1, burst * 1.4) * (1 - boxOut);
  const markScale = 1 + 0.06 * (1 - lock);
  const streak = cond * (1 - seg(t, 0.74, 0.92, E.outCubic));
  const boil = Math.floor(t * 46);

  return (
    <AbsoluteFill style={{ background: LACQUER }}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(ellipse 62% 58% at 50% 46%, rgba(198, 140, 72, 0.22), ${LACQUER_DEEP} 72%)`,
        }}
      />
      <svg viewBox="0 0 640 360" width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}>
        <defs>
          <filter id={fid} x="-40%" y="-150%" width="180%" height="400%" colorInterpolationFilters="sRGB">
            <feTurbulence type="fractalNoise" baseFrequency={0.9 + burst * 0.4} numOctaves={2} seed={boil} result="n" />
            <feDisplacementMap
              in="SourceGraphic"
              in2="n"
              scale={burst * 52 * (1 - lock)}
              xChannelSelector="R"
              yChannelSelector="G"
              result="d"
            />
            <feGaussianBlur in="d" stdDeviation={burst * 1.1 * (1 - lock)} result="core" />
            <feGaussianBlur in="core" stdDeviation={1.2 + glow * 1.6} result="g1" />
            <feColorMatrix
              in="g1"
              type="matrix"
              result="g1c"
              values={`0 0 0 0 1  0 0 0 0 0.93  0 0 0 0 0.78  0 0 0 ${(0.15 + glow * 0.95).toFixed(3)} 0`}
            />
            <feGaussianBlur in="core" stdDeviation={5 + glow * 6} result="g2" />
            <feColorMatrix
              in="g2"
              type="matrix"
              result="g2c"
              values={`0 0 0 0 0.86  0 0 0 0 0.58  0 0 0 0 0.28  0 0 0 ${(glow * 0.75).toFixed(3)} 0`}
            />
            <feMerge>
              <feMergeNode in="g2c" />
              <feMergeNode in="g1c" />
              <feMergeNode in="core" />
            </feMerge>
          </filter>
          <linearGradient id={sid} x1="0" x2="1" y1="0" y2="0">
            <stop offset="0" stopColor="#e7c98a" stopOpacity="0" />
            <stop offset="0.5" stopColor="#fff6e4" stopOpacity="1" />
            <stop offset="1" stopColor="#e7c98a" stopOpacity="0" />
          </linearGradient>
        </defs>
        <g opacity={0.85}>
          <Corner x={88} y={96} sx={1} sy={1} />
          <Corner x={552} y={96} sx={-1} sy={1} />
          <Corner x={88} y={264} sx={1} sy={-1} />
          <Corner x={552} y={264} sx={-1} sy={-1} />
        </g>
        {boxOp > 0.002 ? (
          <g opacity={boxOp} transform={`translate(320 0) scale(${(0.2 + 0.8 * boxOpen).toFixed(4)} 1) translate(-320 0)`}>
            <rect x={BX} y={BY} width={BW} height={BH} fill="rgba(198,161,91,0.04)" />
            <rect x={BX} y={BY} width={BW} height={BH} fill="none" stroke="#c6a15b" strokeWidth={0.9} />
            <rect x={BX + 3} y={BY + 3} width={BW - 6} height={BH - 6} fill="none" stroke="#e7c98a" strokeWidth={0.35} />
          </g>
        ) : null}
        {streak > 0.002 ? (
          <g opacity={streak}>
            <ellipse cx={320} cy={186} rx={250} ry={7} fill={`url(#${sid})`} opacity={0.16} />
            <ellipse cx={320} cy={186} rx={220} ry={0.7} fill={`url(#${sid})`} opacity={0.75} />
          </g>
        ) : null}
        <g>
          {SAND.map((s, i) => {
            const pull = seg(t, 0.56 + s.lag, 0.71 + s.lag * 0.4, E.inQuart);
            const jitter = Math.sin(boil * 1.7 + s.ph) * 1.2 * burst * (1 - pull);
            const sx = s.hx + s.dx * burst;
            const sy = s.hy + s.dy * burst + jitter;
            const x = sx + (s.tx - sx) * pull;
            const y = sy + (s.ty - sy) * pull;
            const a = s.alpha * burst * (1 - seg(t, 0.66, 0.8, E.outCubic)) * (0.55 + 0.45 * Math.abs(Math.sin(boil * 0.9 + s.ph)));
            if (a < 0.01) return null;
            return <circle key={i} cx={x} cy={y} r={s.size * (1 - 0.4 * pull)} fill="#f3ddb0" opacity={a} />;
          })}
        </g>
        <g filter={`url(#${fid})`}>
          <text
            x={320}
            y={190}
            textAnchor="middle"
            opacity={1 - cond}
            style={{
              fill: '#f6ead6',
              fontFamily: SERIF,
              fontWeight: 600,
              fontSize: 34,
              letterSpacing: '4px',
            }}
          >
            {line}
          </text>
          <text
            x={320}
            y={204}
            textAnchor="middle"
            opacity={cond}
            transform={`translate(320 186) scale(${markScale.toFixed(4)}) translate(-320 -186)`}
            style={{
              fill: '#fff8ee',
              fontFamily: SERIF,
              fontWeight: 700,
              fontSize: 68,
              letterSpacing: '10px',
            }}
          >
            {word}
          </text>
        </g>
      </svg>
      <FilmGrain opacity={0.09} step={8} frame={grainFrame} />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          background: 'radial-gradient(ellipse 72% 70% at 50% 48%, transparent 48%, rgba(0,0,0,0.45) 100%)',
        }}
      />
    </AbsoluteFill>
  );
};

export const GrainDissolve: React.FC<GrainProps> = (props) => {
  const frame = useCurrentFrame();
  const t = Math.min(1, frame / ARC);
  return <GrainStage t={t} {...props} grainFrame={frame} />;
};

GrainDissolve.displayName = 'GrainDissolve';
