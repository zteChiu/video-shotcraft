import { HORIZON } from './theme';

const mulberry32 = (seed: number) => {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

type Building = { x: number; w: number; h: number; n: number; seed: number };

/** Hand-placed ridge: dark hillside on the left, the lit basin toward the right. */
const BUILDINGS: Building[] = [
  { x: 70, w: 120, h: 36, n: 3, seed: 1 },
  { x: 200, w: 54, h: 70, n: 4, seed: 2 },
  { x: 268, w: 150, h: 32, n: 4, seed: 3 },
  { x: 500, w: 44, h: 88, n: 6, seed: 4 },
  { x: 556, w: 78, h: 132, n: 11, seed: 5 },
  { x: 648, w: 120, h: 54, n: 7, seed: 6 },
  { x: 786, w: 50, h: 164, n: 13, seed: 7 },
  { x: 850, w: 100, h: 104, n: 10, seed: 8 },
  { x: 966, w: 58, h: 198, n: 16, seed: 9 },
  { x: 1038, w: 128, h: 80, n: 10, seed: 10 },
  { x: 1182, w: 46, h: 128, n: 10, seed: 11 },
  { x: 1242, w: 156, h: 60, n: 10, seed: 12 },
  { x: 1414, w: 62, h: 96, n: 7, seed: 13 },
  { x: 1490, w: 190, h: 42, n: 6, seed: 14 },
  { x: 1700, w: 68, h: 66, n: 4, seed: 15 },
  { x: 1784, w: 120, h: 30, n: 3, seed: 16 },
];

export type WindowLight = { x: number; y: number; cool: boolean; phase: number };

export const WINDOWS: WindowLight[] = BUILDINGS.flatMap((b) => {
  const rand = mulberry32(b.seed * 97);
  const cols = Math.max(1, Math.floor((b.w - 12) / 14));
  const rows = Math.max(1, Math.floor((b.h - 14) / 18));
  const top = HORIZON - b.h;
  const used = new Set<number>();
  const lights: WindowLight[] = [];
  for (let i = 0; i < b.n; i++) {
    const col = Math.floor(rand() * cols);
    const row = Math.floor(rand() * rows);
    const key = row * cols + col;
    if (used.has(key)) continue;
    used.add(key);
    lights.push({
      x: b.x + 8 + col * 14,
      y: Math.min(HORIZON - 10, top + 8 + row * 18),
      cool: rand() > 0.88,
      phase: rand() * Math.PI * 2,
    });
  }
  return lights;
});

export const BUILDING_SHAPES = BUILDINGS.map((b) => ({
  x: b.x,
  y: HORIZON - b.h,
  w: b.w,
  h: b.h,
}));

const starRand = mulberry32(2026);
export const STARS = Array.from({ length: 16 }, () => ({
  x: starRand() * 1920,
  y: 24 + starRand() * 250,
  r: starRand() > 0.85 ? 1.6 : 1.05,
  o: 0.28 + starRand() * 0.4,
}));

/** Static road geometry. z = 1 is the bumper, larger z is toward the horizon. */
export const project = (z: number) => {
  const y = HORIZON + 720 / z;
  const bend = 18 * (1 - Math.exp(-(z - 1) * 0.22));
  const x = 1000 - bend;
  const half = 16 + 980 / z;
  return { x, y, half };
};

const sampleZ = () => {
  const zs: number[] = [];
  for (let z = 1.04; z <= 18; z += 0.28) zs.push(Number(z.toFixed(3)));
  return zs;
};

const ZS = sampleZ();

export const ROAD_PATH = (() => {
  const left = ZS.map((z) => {
    const p = project(z);
    return `${p.x - p.half},${p.y.toFixed(1)}`;
  });
  const right = [...ZS].reverse().map((z) => {
    const p = project(z);
    return `${p.x + p.half},${p.y.toFixed(1)}`;
  });
  return `M ${left.join(' L ')} L ${right.join(' L ')} Z`;
})();

export const EDGE_LEFT = ZS.map((z) => {
  const p = project(z);
  return `${p.x - p.half},${p.y.toFixed(1)}`;
}).join(' ');

export const EDGE_RIGHT = ZS.map((z) => {
  const p = project(z);
  return `${p.x + p.half},${p.y.toFixed(1)}`;
}).join(' ');
