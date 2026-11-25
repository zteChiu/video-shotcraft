import { Easing, interpolate } from 'remotion';
import type { CSSProperties } from 'react';

const clamp = { extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const };

const PRESS = Easing.bezier(0.2, 0.75, 0.3, 1);
const DROP = Easing.bezier(0.55, 0.085, 0.68, 0.53);
const SETTLE = Easing.bezier(0.16, 1, 0.3, 1);

export const pressT = (frame: number, start: number, dur = 11) =>
  interpolate(frame, [start, start + dur], [0, 1], { ...clamp, easing: PRESS });

export const pressStyle = (t: number, origin = '50% 50%'): CSSProperties => ({
  opacity: t,
  transform: `scale(${1.22 - 0.22 * t})`,
  transformOrigin: origin,
  filter: t >= 0.999 ? undefined : `blur(${((1 - t) * 7).toFixed(2)}px)`,
});

export const fade = (frame: number, a: number, b: number) =>
  interpolate(frame, [a, b], [0, 1], clamp);

export const slamScale = (frame: number, impact: number) => {
  if (frame < impact - 7) return 1.46;
  const drop = interpolate(frame, [impact - 7, impact], [0, 1], { ...clamp, easing: DROP });
  if (frame < impact) return 1.46 - (1.46 - 0.965) * drop;
  const settle = interpolate(frame, [impact, impact + 12], [0, 1], { ...clamp, easing: SETTLE });
  return 0.965 + 0.035 * settle;
};

export const slamRotate = (frame: number, impact: number) =>
  interpolate(frame, [impact - 7, impact], [-3.5, 0], { ...clamp, easing: DROP });

const hash = (n: number) => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

export const hitShake = (frame: number, impact: number, frames = 5, amp = 8) => {
  if (frame < impact || frame >= impact + frames) return { x: 0, y: 0 };
  const t = frame - impact;
  const a = amp * Math.exp(-t * 0.9);
  return {
    x: a * 0.35 * (hash(frame * 7 + 1) * 2 - 1),
    y: a * (t === 0 ? 1 : hash(frame * 13 + 2) * 2 - 1),
  };
};
