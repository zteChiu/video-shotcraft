import { VOW_A, VOW_B, WeddingFilm } from './Main';
import { BrandInkOpen, BRAND_INK_DEFAULTS } from './shots/BrandInkOpen';
import { PaperTitleCard, PAPER_TITLE_DEFAULTS } from './shots/PaperTitleCard';
import { GrainDissolve, GRAIN_DEFAULTS } from './shots/GrainDissolve';
import { SealHold, SEAL_HOLD_DEFAULTS } from './shots/SealHold';
import { BGM_FILE, BGM_VOLUME, SFX, SHOTS, TOTAL, sfxFrom } from './timeline';
import { LACQUER } from './theme';

type Field = Record<string, unknown> & { type: string; key: string; label: string; default: unknown };
const text = (key: string, label: string, def: string): Field => ({ type: 'text', key, label, default: def });
const slider = (key: string, label: string, def: number, min: number, max: number): Field => ({
  type: 'slider', key, label, default: def, min, max, step: 1, unit: 'px',
});
const color = (key: string, label: string, def: string): Field => ({ type: 'color', key, label, default: def });

export const WORKBENCH = {
  name: '新婚快乐',
  fps: 30,
  width: 1920,
  height: 1080,
  total: TOTAL,
  background: LACQUER,
  shots: [
    {
      id: 'seal',
      label: '囍印开场',
      from: SHOTS.seal.from,
      duration: SHOTS.seal.duration,
      component: BrandInkOpen,
      props: { ...BRAND_INK_DEFAULTS },
      schema: [
        text('wordmark', '字标', BRAND_INK_DEFAULTS.wordmark),
        slider('wordmarkSize', '字标字号', BRAND_INK_DEFAULTS.wordmarkSize, 120, 320),
        text('kicker', '副标', BRAND_INK_DEFAULTS.kicker),
        slider('kickerSize', '副标字号', BRAND_INK_DEFAULTS.kickerSize, 28, 64),
        color('ink', '印色', BRAND_INK_DEFAULTS.ink),
        color('gold', '金色', BRAND_INK_DEFAULTS.gold),
        color('cream', '印文字色', BRAND_INK_DEFAULTS.cream),
      ],
    },
    {
      id: 'vow-a',
      label: '誓言 · 常相守',
      from: SHOTS.vowA.from,
      duration: SHOTS.vowA.duration,
      component: PaperTitleCard,
      props: { ...VOW_A, duration: SHOTS.vowA.duration },
      schema: [
        text('line1', '上句', VOW_A.line1),
        text('line2', '下句', VOW_A.line2),
        text('accent', '重点词', VOW_A.accent),
        text('sub', '副行', VOW_A.sub),
      ],
      durationProp: 'duration',
      cardId: 'vow',
    },
    {
      id: 'vow-b',
      label: '誓言 · 皆欢喜',
      from: SHOTS.vowB.from,
      duration: SHOTS.vowB.duration,
      component: PaperTitleCard,
      props: { ...VOW_B, duration: SHOTS.vowB.duration },
      schema: [
        text('line1', '上句', VOW_B.line1),
        text('line2', '下句', VOW_B.line2),
        text('accent', '重点词', VOW_B.accent),
        text('sub', '副行', VOW_B.sub),
      ],
      durationProp: 'duration',
      cardId: 'vow',
    },
    {
      id: 'grain',
      label: '砂化成新婚快乐',
      from: SHOTS.grain.from,
      duration: SHOTS.grain.duration,
      component: GrainDissolve,
      props: { ...GRAIN_DEFAULTS },
      schema: [
        text('vow', '被砂化的句子', GRAIN_DEFAULTS.vow),
        text('mark', '凝聚后的字标', GRAIN_DEFAULTS.mark),
      ],
    },
    {
      id: 'hold',
      label: '落印停留',
      from: SHOTS.hold.from,
      duration: SHOTS.hold.duration,
      component: SealHold,
      props: { ...SEAL_HOLD_DEFAULTS },
      schema: [
        text('mark', '字标', SEAL_HOLD_DEFAULTS.mark),
        text('closing', '收句', SEAL_HOLD_DEFAULTS.closing),
      ],
      durationProp: 'duration',
    },
  ],
  transitions: [],
  captions: [],
  overlays: [],
  sfx: SFX.map((cue) => ({
    from: sfxFrom(cue.target, cue.peakSeconds),
    duration: cue.duration,
    src: cue.src,
    volume: cue.volume,
  })),
  bgm: [{ from: 0, duration: TOTAL, src: BGM_FILE, volume: BGM_VOLUME }],
  order: ['transitions', 'captions', 'overlays'],
  original: WeddingFilm,
};
