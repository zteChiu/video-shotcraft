import { FPS } from './theme';
import { BRAND_INK_OPEN_DURATION } from './shots/BrandInkOpen';
import { PAPER_TITLE_CARD_DURATION } from './shots/PaperTitleCard';
import { GRAIN_DISSOLVE_DURATION } from './shots/GrainDissolve';
import { SEAL_HOLD_DURATION } from './shots/SealHold';

export const SHOTS = {
  seal: { from: 0, duration: BRAND_INK_OPEN_DURATION },
  vowA: { from: BRAND_INK_OPEN_DURATION, duration: PAPER_TITLE_CARD_DURATION },
  vowB: { from: BRAND_INK_OPEN_DURATION + PAPER_TITLE_CARD_DURATION, duration: PAPER_TITLE_CARD_DURATION },
  grain: {
    from: BRAND_INK_OPEN_DURATION + PAPER_TITLE_CARD_DURATION * 2,
    duration: GRAIN_DISSOLVE_DURATION,
  },
  hold: {
    from: BRAND_INK_OPEN_DURATION + PAPER_TITLE_CARD_DURATION * 2 + GRAIN_DISSOLVE_DURATION,
    duration: SEAL_HOLD_DURATION,
  },
} as const;

export const TOTAL = SHOTS.hold.from + SHOTS.hold.duration;

// AAC priming on this Remotion 4.0.484 / h264 / 48 kHz pipeline.
// Measured after the first render (see DESIGN.md). 0 until that measurement lands.
export const OUTPUT_AUDIO_LAG_FRAMES = 0;

export const sfxFrom = (target: number, peakSeconds: number) =>
  Math.max(0, Math.round(target - peakSeconds * FPS - OUTPUT_AUDIO_LAG_FRAMES));

export const BGM_FILE = 'audio/sfx/fs-573972.mp3';
export const BGM_VOLUME = 0.14;

export const SFX = [
  {
    id: 'stamp',
    src: 'audio/sfx/fs-683031.mp3',
    target: 22,
    peakSeconds: 0.185,
    volume: 0.4,
    duration: 24,
    note: '囍印压到纸上',
  },
  {
    id: 'paper-a',
    src: 'audio/sfx/fs-444431.mp3',
    target: SHOTS.vowA.from + 8,
    peakSeconds: 0.495,
    volume: 3.4,
    duration: 36,
    note: '第一张誓言字卡压印',
  },
  {
    id: 'paper-b',
    src: 'audio/sfx/fs-444431.mp3',
    target: SHOTS.vowB.from + 8,
    peakSeconds: 0.495,
    volume: 2.6,
    duration: 36,
    note: '第二张誓言字卡压印，音量降一档',
  },
  {
    id: 'whoosh',
    src: 'audio/sfx/fs-816261.mp3',
    target: SHOTS.grain.from + 12,
    peakSeconds: 0.185,
    volume: 0.85,
    duration: 16,
    note: '誓言开始砂化',
  },
  {
    id: 'bell',
    src: 'audio/sfx/fs-148849.mp3',
    target: SHOTS.grain.from + 39,
    peakSeconds: 0.155,
    volume: 3.2,
    duration: 80,
    note: '凝聚成「新婚快乐」的一击',
  },
] as const;
