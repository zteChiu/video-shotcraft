// Copied from demos/_fixtures/Motion.tsx — only the helpers grain-dissolve uses.
export const E = {
  linear: (t: number) => t,
  inCubic: (t: number) => t * t * t,
  outCubic: (t: number) => 1 - Math.pow(1 - t, 3),
  inOutCubic: (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
  inQuart: (t: number) => t * t * t * t,
};

export const seg = (t: number, t0: number, t1: number, ease: (x: number) => number = E.linear) =>
  ease(Math.min(1, Math.max(0, (t - t0) / (t1 - t0))));

export const rand = (seed: number) => {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};
