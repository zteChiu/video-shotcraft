import type { FC } from 'react';
import { XichangFilm } from './Film';
import { Accusation, ACCUSATION_DEFAULTS } from './shots/Accusation';
import { Contempt, CONTEMPT_DEFAULTS } from './shots/Contempt';
import { Creed, CREED_DEFAULTS } from './shots/Creed';
import { Seal, SEAL_DEFAULTS } from './shots/Seal';
import { Turn, TURN_DEFAULTS } from './shots/Turn';
import { INK, SHOTS, TOTAL } from './theme';

type Field = Record<string, unknown> & { type: string; key: string; label: string; default: unknown };
const text = (key: string, label: string, def: string): Field => ({ type: 'text', key, label, default: def });
const color = (key: string, label: string, def: string): Field => ({ type: 'color', key, label, default: def });

const copy = (keys: string[], source: Record<string, string>, labels: Record<string, string>): Field[] =>
  keys.map((key) => text(key, labels[key] ?? key, source[key]));

const A = ACCUSATION_DEFAULTS;
const C = CONTEMPT_DEFAULTS;
const T = TURN_DEFAULTS;
const R = CREED_DEFAULTS;
const S = SEAL_DEFAULTS;

export const WORKBENCH = {
  name: '西厂 · 这就是西厂',
  fps: 30,
  width: 1920,
  height: 1080,
  total: TOTAL,
  background: INK,
  shots: [
    {
      id: 'accusation',
      label: '杯弓蛇影',
      from: SHOTS.accusation.from,
      duration: SHOTS.accusation.duration,
      component: Accusation,
      props: { ...A },
      durationProp: 'duration',
      schema: [
        ...copy(['line1a', 'line1b', 'line2', 'line3', 'mark1', 'mark3'], A, {
          line1a: '上行',
          line1b: '下行',
          line2: '第二句',
          line3: '第三句',
          mark1: '下行强调',
          mark3: '第三句强调',
        }),
        color('bone', '字色', A.bone),
        color('gold', '金色', A.gold),
        color('cinnabar', '朱砂', A.cinnabar),
      ],
    },
    {
      id: 'contempt',
      label: '算什么东西',
      from: SHOTS.contempt.from,
      duration: SHOTS.contempt.duration,
      component: Contempt,
      props: { ...C },
      durationProp: 'duration',
      schema: [
        ...copy(['hero', 'line5', 'line6', 'line7', 'mark6'], C, {
          hero: '主句',
          line5: '设立',
          line6: '资格',
          line7: '回敬',
          mark6: '资格强调',
        }),
        color('bone', '字色', C.bone),
        color('gold', '金色', C.gold),
        color('cinnabar', '朱砂', C.cinnabar),
      ],
    },
    {
      id: 'turn',
      label: '你问我',
      from: SHOTS.turn.from,
      duration: SHOTS.turn.duration,
      component: Turn,
      props: { ...T },
      durationProp: 'duration',
      schema: [
        ...copy(['kicker', 'hero', 'mark', 'follow'], T, {
          kicker: '眉题',
          hero: '主句',
          mark: '强调',
          follow: '收句',
        }),
        color('bone', '字色', T.bone),
        color('gold', '金色', T.gold),
      ],
    },
    {
      id: 'creed',
      label: '东厂西厂',
      from: SHOTS.creed.from,
      duration: SHOTS.creed.duration,
      component: Creed,
      props: { ...R },
      durationProp: 'duration',
      schema: [
        ...copy(
          ['line10', 'line11', 'line12', 'line13', 'line14', 'line15', 'mark10', 'mark11', 'mark12', 'mark14', 'mark15'],
          R,
          {
            line10: '破不了的案',
            line11: '不敢杀',
            line12: '不敢管',
            line13: '一句话',
            line14: '管得了',
            line15: '破不了',
            mark10: '强调 · 来破',
            mark11: '强调 · 我杀',
            mark12: '强调 · 我管',
            mark14: '强调 · 我要管',
            mark15: '强调 · 我更要管',
          },
        ),
        color('bone', '字色', R.bone),
        color('cinnabar', '朱砂', R.cinnabar),
        color('gold', '金色', R.gold),
      ],
    },
    {
      id: 'seal',
      label: '这就是西厂',
      from: SHOTS.seal.from,
      duration: SHOTS.seal.duration,
      component: Seal,
      props: { ...S },
      durationProp: 'duration',
      schema: [
        ...copy(['couplet', 'line', 'mark', 'seal', 'question'], S, {
          couplet: '先斩后奏',
          line: '这就是西厂',
          mark: '句中强调',
          seal: '印文',
          question: '收问',
        }),
        color('bone', '字色', S.bone),
        color('gold', '金色', S.gold),
        color('cinnabar', '朱砂', S.cinnabar),
      ],
    },
  ],
  transitions: [],
  captions: [],
  overlays: [],
  sfx: [],
  bgm: [{ from: 0, duration: TOTAL, src: 'audio/voice.mp3', volume: 1 }],
  order: ['transitions', 'captions', 'overlays'],
  original: XichangFilm as FC,
};
