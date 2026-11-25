import { Bloom } from './Bloom';
import { FadeOut } from './FadeOut';
import { FerrariFilm } from './Ferrari';
import { Kicker } from './Kicker';
import { LYRIC_DEFAULTS, LyricLine } from './LyricLine';
import { TITLE_DEFAULTS, Title } from './Title';
import { BLOOMS, BLOOM_FRAMES, LYRICS, TITLE_DURATION, TOTAL, f } from './timeline';
import { World } from './World';

type Field = { type: string; key: string; label: string; default: unknown; options?: { value: string; label: string }[] };

const text = (key: string, label: string, def: string): Field => ({ type: 'text', key, label, default: def });
const select = (key: string, label: string, def: string, options: string[]): Field => ({
  type: 'select',
  key,
  label,
  default: def,
  options: options.map((value) => ({ value, label: value })),
});

const LYRIC_SCHEMA: Field[] = [
  text('en', 'English', LYRIC_DEFAULTS.en),
  text('zh', '中文', LYRIC_DEFAULTS.zh),
  select('align', '对齐', LYRIC_DEFAULTS.align, ['left', 'center']),
  select('tone', '颜色', LYRIC_DEFAULTS.tone, ['ivory', 'rosso']),
  select('mode', '版式', LYRIC_DEFAULTS.mode, ['line', 'whoa', 'aside']),
  select('emphasis', '钩子', LYRIC_DEFAULTS.emphasis, ['hook', 'echo']),
];

export const WORKBENCH = {
  name: 'Ferrari · Bebe Rexha',
  fps: 30,
  width: 1920,
  height: 1080,
  total: TOTAL,
  background: '#08070c',
  shots: [
    {
      id: 'title',
      label: 'Title',
      from: 0,
      duration: TITLE_DURATION,
      component: Title,
      props: { ...TITLE_DEFAULTS, duration: TITLE_DURATION },
      schema: [
        text('word', '字标', TITLE_DEFAULTS.word),
        text('credit', '艺人', TITLE_DEFAULTS.credit),
        text('writers', '词曲', TITLE_DEFAULTS.writers),
      ],
      durationProp: 'duration',
    },
  ],
  transitions: BLOOMS.map((bloom) => ({
    id: bloom.id,
    label: bloom.label,
    from: f(bloom.t),
    duration: BLOOM_FRAMES,
    component: Bloom,
    props: { duration: BLOOM_FRAMES },
    durationProp: 'duration',
    cardId: 'horizon-bloom',
    cardName: 'Horizon bloom',
  })),
  captions: LYRICS.map((cue) => ({
    id: cue.id,
    label: cue.en,
    from: cue.from,
    duration: cue.duration,
    component: LyricLine,
    props: {
      en: cue.en,
      zh: cue.zh,
      align: cue.align,
      tone: cue.tone,
      mode: cue.mode,
      emphasis: cue.emphasis ?? 'hook',
      duration: cue.duration,
      zhDelay: cue.zhDelay ?? 10,
    },
    schema: LYRIC_SCHEMA,
    durationProp: 'duration',
    cardId: 'lyric-line',
    cardName: 'Lyric line',
  })),
  overlays: [
    { id: 'world', label: 'Night drive', from: 0, duration: TOTAL, component: World },
    { id: 'kicker', label: 'Section mark', from: 0, duration: TOTAL, component: Kicker },
    { id: 'fade', label: 'Fade out', from: 0, duration: TOTAL, component: FadeOut },
  ],
  sfx: [],
  bgm: [{ from: 0, duration: TOTAL, src: 'audio/ferrari.mp3', volume: 1 }],
  order: ['transitions', 'captions', 'overlays'],
  original: FerrariFilm,
};
