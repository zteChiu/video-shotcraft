import { EASE, ramp } from './ease';

export const FPS = 30;
/** Master length, seconds. Matches the supplied mp3. */
export const DURATION_SEC = 212.58449;
export const TOTAL = Math.ceil(DURATION_SEC * FPS);
export const f = (sec: number) => Math.round(sec * FPS);

export const TITLE_DURATION = f(11.44) + 10;

export type Align = 'left' | 'center';
export type Tone = 'ivory' | 'rosso';
export type Mode = 'line' | 'whoa' | 'aside';
export type Emphasis = 'hook' | 'echo';

type CueIn = {
  t: number;
  en: string;
  zh?: string;
  align: Align;
  tone: Tone;
  mode: Mode;
  emphasis?: Emphasis;
  /** Frames after the English line before Chinese appears. */
  zhDelay?: number;
};

const RAW: CueIn[] = [
  { t: 11.44, en: "Every day's a blur", zh: '感觉每天都是浑浑噩噩', align: 'left', tone: 'ivory', mode: 'line' },
  { t: 15.0, en: "Sometimes I can't tell what day it is", zh: '有时候我甚至不知道当天是周几', align: 'left', tone: 'ivory', mode: 'line' },
  { t: 18.75, en: "Don't know what day it is", zh: '不知道当天是周几', align: 'left', tone: 'ivory', mode: 'line' },
  { t: 21.35, en: 'Can you tell me what day it is', zh: '你能告诉我今天是周几吗', align: 'left', tone: 'ivory', mode: 'line' },
  { t: 24.0, en: "Life's passing by", zh: '时光匆匆流逝', align: 'left', tone: 'ivory', mode: 'line' },
  { t: 27.55, en: "'Cause I'm out chasing empty highs", zh: '因为我一直在追逐虚无的快乐', align: 'left', tone: 'ivory', mode: 'line' },
  { t: 30.82, en: 'Every hello just means goodbye', zh: '每一次问候都意味着告别', align: 'left', tone: 'ivory', mode: 'line' },
  { t: 33.78, en: "But I'm looking for more this time", zh: '但我还是想追寻更多这样的机会', align: 'left', tone: 'ivory', mode: 'line' },

  { t: 37.85, en: 'Can we start to slow it down', zh: '我们可以慢下脚步吗', align: 'center', tone: 'ivory', mode: 'line' },
  { t: 40.85, en: 'Can we learn to live right now', zh: '现在我们能学会乐享人生吗', align: 'center', tone: 'ivory', mode: 'line' },
  { t: 44.0, en: 'I just want to feel it all', zh: '我只是想感受美好的一切', align: 'center', tone: 'ivory', mode: 'line' },

  { t: 49.63, en: "I'm a Ferrari", zh: '极速驰骋的法拉利', align: 'center', tone: 'rosso', mode: 'line', emphasis: 'hook' },
  { t: 52.32, en: 'Pulled off on Mulholland Drive', zh: '我就像在穆赫兰大道上', align: 'center', tone: 'ivory', mode: 'line' },
  { t: 55.75, en: 'Over the city the lights are so pretty from up here', zh: '从这里望去 整个城市的灯火特别美', align: 'center', tone: 'ivory', mode: 'line' },
  { t: 61.96, en: "I'm a Ferrari", zh: '我就像一辆法拉利', align: 'center', tone: 'rosso', mode: 'line', emphasis: 'echo' },
  { t: 64.95, en: "And after the party's done", zh: '派对过后', align: 'center', tone: 'ivory', mode: 'line' },
  { t: 68.31, en: 'I keep on going missing the moments', zh: '我只顾向前开 错过了那美好的时刻', align: 'center', tone: 'ivory', mode: 'line' },
  { t: 72.15, en: "Living in the fast lane's getting kinda lonely", zh: '生活节奏如此之快 我感觉有些孤独', align: 'center', tone: 'ivory', mode: 'line' },

  { t: 76.35, en: 'Yeah', align: 'center', tone: 'ivory', mode: 'aside' },
  { t: 77.87, en: 'Whoa whoa whoa', align: 'center', tone: 'ivory', mode: 'whoa' },
  { t: 86.28, en: "Living in the fast lane's getting kinda lonely", zh: '生活节奏如此之快 我感觉有些孤独', align: 'center', tone: 'ivory', mode: 'line' },
  { t: 90.26, en: 'Whoa whoa whoa', align: 'center', tone: 'ivory', mode: 'whoa' },
  { t: 98.92, en: "Living in the fast lane's getting kinda lonely", zh: '生活节奏如此之快 我感觉有些孤独', align: 'center', tone: 'ivory', mode: 'line' },

  { t: 104.15, en: 'Got a heavy heart', zh: '心情沉重', align: 'left', tone: 'ivory', mode: 'line' },
  { t: 107.45, en: "'Cause it's still beating on its own", zh: '因为这颗心依旧孤独地跳动着', align: 'left', tone: 'ivory', mode: 'line' },
  { t: 110.68, en: 'Might be going out in the crowd', zh: '或许我会走进人群之中', align: 'left', tone: 'ivory', mode: 'line' },
  { t: 113.81, en: "But I'm still coming home alone", zh: '但我还是独自踏上了回家的路', align: 'left', tone: 'ivory', mode: 'line' },
  { t: 116.45, en: "Not trying to say I'm not grateful for everything", zh: '不是想说自己对一切都不在乎', align: 'left', tone: 'ivory', mode: 'line' },
  { t: 123.15, en: "I'm just going too fast to see", zh: '我只是开得太快 看不清', align: 'left', tone: 'ivory', mode: 'line' },
  { t: 126.34, en: 'All the good things in front of me', zh: '眼前美好的一切', align: 'left', tone: 'ivory', mode: 'line' },

  { t: 129.62, en: "I'm a Ferrari", zh: '极速驰骋的法拉利', align: 'center', tone: 'rosso', mode: 'line', emphasis: 'hook' },
  { t: 132.53, en: 'Pulled off on Mulholland Drive', zh: '我就像在穆赫兰大道上', align: 'center', tone: 'ivory', mode: 'line' },
  { t: 135.78, en: 'Over the city the lights are so pretty from up here', zh: '从这里望去 整个城市的灯火特别美', align: 'center', tone: 'ivory', mode: 'line' },
  { t: 142.03, en: "I'm a Ferrari", zh: '我就像一辆法拉利', align: 'center', tone: 'rosso', mode: 'line', emphasis: 'echo' },
  { t: 144.96, en: "And after the party's done", zh: '派对过后', align: 'center', tone: 'ivory', mode: 'line' },
  { t: 148.36, en: 'I keep on going missing the moments', zh: '我只顾向前开 错过了那美好的时刻', align: 'center', tone: 'ivory', mode: 'line' },
  { t: 152.15, en: "Living in the fast lane's getting kinda lonely", zh: '生活节奏如此之快 我感觉有些孤独', align: 'center', tone: 'ivory', mode: 'line' },

  { t: 156.19, en: 'Whoa whoa whoa', align: 'center', tone: 'ivory', mode: 'whoa' },
  { t: 164.96, en: "Living in the fast lane's getting kinda lonely", zh: '生活节奏如此之快 我感觉有些孤独', align: 'center', tone: 'ivory', mode: 'line' },
  { t: 168.77, en: 'Whoa whoa whoa', align: 'center', tone: 'ivory', mode: 'whoa' },

  { t: 179.77, en: "I'm a Ferrari", zh: '极速驰骋的法拉利', align: 'center', tone: 'rosso', mode: 'line', emphasis: 'hook' },
  { t: 182.55, en: 'Pulled off on Mulholland Drive', zh: '我就像在穆赫兰大道上', align: 'center', tone: 'ivory', mode: 'line' },
  { t: 186.03, en: 'Over the city the lights are so pretty from up here', zh: '从这里望去 整个城市的灯火特别美', align: 'center', tone: 'ivory', mode: 'line' },
  { t: 192.22, en: "I'm a Ferrari", zh: '我就像一辆法拉利', align: 'center', tone: 'rosso', mode: 'line', emphasis: 'echo' },
  { t: 195.28, en: "And after the party's done", zh: '派对过后', align: 'center', tone: 'ivory', mode: 'line' },
  { t: 198.54, en: 'I keep on going missing the moments', zh: '我只顾向前开 错过了那美好的时刻', align: 'center', tone: 'ivory', mode: 'line' },
  {
    t: 202.62,
    en: "Living in the fast lane's getting kinda lonely",
    zh: '生活节奏如此之快 我感觉有些孤独',
    align: 'center',
    tone: 'ivory',
    mode: 'line',
    zhDelay: f(207.06) - f(202.62),
  },
];

export type LyricCue = CueIn & { id: string; from: number; duration: number; zh: string };

export const LYRICS: LyricCue[] = RAW.map((cue, i) => {
  const from = f(cue.t);
  const end = i < RAW.length - 1 ? f(RAW[i + 1].t) : TOTAL;
  return {
    ...cue,
    zh: cue.zh ?? '',
    id: `l${String(i + 1).padStart(2, '0')}`,
    from,
    duration: end - from,
  };
});

if (LYRICS.some((cue) => cue.duration < 18)) {
  const bad = LYRICS.filter((cue) => cue.duration < 18).map((cue) => cue.id);
  throw new Error(`Lyric cue shorter than 18 frames: ${bad.join(', ')}`);
}

export const SECTIONS: { t: number; label: string; place: 'left' | 'center' }[] = [
  { t: 0, label: '', place: 'left' },
  { t: 11.44, label: 'NIGHT', place: 'left' },
  { t: 37.85, label: 'SLOW DOWN', place: 'center' },
  { t: 49.63, label: 'MULHOLLAND', place: 'center' },
  { t: 76.35, label: '', place: 'center' },
  { t: 104.15, label: 'HEAVY HEART', place: 'left' },
  { t: 129.62, label: 'MULHOLLAND', place: 'center' },
  { t: 156.19, label: '', place: 'center' },
  { t: 179.77, label: '', place: 'center' },
];

/** Measured low-band peaks. Three horizon blooms, spaced well past 16 beats. */
export const BLOOMS = [
  { id: 'bloom-1', t: 76.904, label: 'First drop' },
  { id: 'bloom-2', t: 155.341, label: 'Second drop' },
  { id: 'bloom-3', t: 178.863, label: 'Into the last chorus' },
];

export const BLOOM_FRAMES = 16;

/**
 * Section speed, world-units per second. Smoothstep between keys.
 * Verse idles, the pre-chorus brakes, each chorus accelerates, the last line stops the car.
 */
const SPEED_KEYS: { t: number; v: number }[] = [
  { t: 0, v: 0.16 },
  { t: 11.44, v: 0.22 },
  { t: 18, v: 0.55 },
  { t: 37.85, v: 0.58 },
  { t: 46.8, v: 0.1 },
  { t: 49.63, v: 0.22 },
  { t: 53.4, v: 1.55 },
  { t: 74, v: 1.4 },
  { t: 80, v: 0.62 },
  { t: 104, v: 0.4 },
  { t: 118, v: 0.7 },
  { t: 129.62, v: 0.68 },
  { t: 133.4, v: 1.6 },
  { t: 156, v: 0.78 },
  { t: 179.77, v: 0.48 },
  { t: 184, v: 1.45 },
  { t: 199.5, v: 1.2 },
  { t: 206.4, v: 0 },
  { t: 220, v: 0 },
];

export const speedAt = (t: number) => {
  const keys = SPEED_KEYS;
  if (t <= keys[0].t) return keys[0].v;
  for (let i = 1; i < keys.length; i++) {
    const a = keys[i - 1];
    const b = keys[i];
    if (t <= b.t) {
      const u = (t - a.t) / Math.max(1e-6, b.t - a.t);
      const s = u * u * (3 - 2 * u);
      return a.v + (b.v - a.v) * s;
    }
  }
  return keys[keys.length - 1].v;
};

const TRAVEL_GAIN = 2.15;
const distance: number[] = [0];
for (let frame = 1; frame <= TOTAL; frame++) {
  distance.push(distance[frame - 1] + (speedAt((frame - 0.5) / FPS) * TRAVEL_GAIN) / FPS);
}

export const distanceAt = (frame: number) => distance[Math.max(0, Math.min(TOTAL, frame))];

/** Whole-film push, slow enough that it never reads as a beat pump. */
export const cameraPush = (frame: number) => 1 + 0.032 * ramp(frame, 0, f(198), EASE.smooth);
