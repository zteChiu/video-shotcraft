import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { GOLD, PAPER, PAPER_GLOW } from './theme';

const hash = (n: number) => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

const grainCache = new Map<string, string>();
const grainTile = (variant: number) => {
  const key = String(variant);
  const hit = grainCache.get(key);
  if (hit) return hit;
  const svg =
    `<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'>` +
    `<filter id='g' x='0' y='0' width='100%' height='100%' color-interpolation-filters='sRGB'>` +
    `<feTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='2' seed='${variant * 17 + 3}' stitchTiles='stitch'/>` +
    `<feColorMatrix type='matrix' values='0.33 0.33 0.33 0 0  0.33 0.33 0.33 0 0  0.33 0.33 0.33 0 0  0 0 0 0.9 0'/>` +
    `</filter><rect width='100%' height='100%' filter='url(#g)'/></svg>`;
  const url = `url("data:image/svg+xml;utf8,${encodeURIComponent(svg)}")`;
  grainCache.set(key, url);
  return url;
};

export const FilmGrain: React.FC<{ opacity?: number; step?: number; frame?: number }> = ({ opacity = 0.055, step = 6, frame }) => {
  const local = useCurrentFrame();
  const k = Math.floor((frame ?? local) / step);
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        opacity,
        mixBlendMode: 'multiply',
        backgroundImage: grainTile(k % 6),
        backgroundSize: '180px 180px',
        backgroundPosition: `${Math.floor(hash(k * 3 + 1) * 180)}px ${Math.floor(hash(k * 7 + 2) * 180)}px`,
      }}
    />
  );
};

const Corner: React.FC<{ x: number; y: number; sx: number; sy: number }> = ({ x, y, sx, sy }) => (
  <div
    style={{
      position: 'absolute',
      left: x,
      top: y,
      width: 54,
      height: 54,
      transform: `scale(${sx}, ${sy})`,
      transformOrigin: 'top left',
      borderTop: `1.5px solid ${GOLD}`,
      borderLeft: `1.5px solid ${GOLD}`,
      opacity: 0.85,
    }}
  />
);

export const PaperField: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <AbsoluteFill
    style={{
      backgroundColor: PAPER,
      backgroundImage: `radial-gradient(1100px 760px at 50% 44%, ${PAPER_GLOW}, transparent 66%)`,
    }}
  >
    <Corner x={78} y={64} sx={1} sy={1} />
    <Corner x={1788} y={64} sx={-1} sy={1} />
    <Corner x={78} y={962} sx={1} sy={-1} />
    <Corner x={1788} y={962} sx={-1} sy={-1} />
    {children}
    <FilmGrain />
    <div
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        background: `radial-gradient(ellipse 70% 68% at 50% 46%, transparent 52%, rgba(90, 42, 36, 0.16) 100%)`,
      }}
    />
  </AbsoluteFill>
);
