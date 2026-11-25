export const FONT = '"Noto Serif SC", "Source Han Serif SC", serif';

export const INK = '#070504';
export const BONE = '#f3ead7';
export const BONE_DIM = 'rgba(243, 234, 215, 0.72)';
export const GOLD = '#c6a36a';
export const CINNABAR = '#d6453d';

export const FPS = 30;
export const TOTAL = 1170; // 39.0s — voice ends 37.43s, closing line holds through the silence

export const sec = (s: number) => Math.round(s * FPS);

export const SHOTS = {
  accusation: { from: sec(0), duration: sec(7.4) - sec(0) },
  contempt: { from: sec(7.4), duration: sec(15.4) - sec(7.4) },
  turn: { from: sec(15.4), duration: sec(19.8) - sec(15.4) },
  creed: { from: sec(19.8), duration: sec(31.6) - sec(19.8) },
  seal: { from: sec(31.6), duration: TOTAL - sec(31.6) },
} as const;
