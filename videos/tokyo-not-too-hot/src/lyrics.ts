export type Kind = 'title' | 'credit' | 'verse' | 'chat' | 'hook' | 'bridge';

export type LyricLine = {
  t: number;
  text: string;
  kind: Kind;
  sub?: string;
  tag?: 'NaYo' | 'Ayo';
  motif?: 'photo' | 'smoke' | 'lamp';
  lead?: string;
  tone?: 'cold';
};

// Timestamps come from the supplied LRC. Mid-word spaces that the file
// inserted on repeated lines are closed; sung variations (嘛/吗, 再没, 寂寞渲染) stay.
export const LINES: LyricLine[] = [
  {t: 2.06, text: '东京不太热', kind: 'title'},
  {t: 7.96, text: '封茗囧菌', kind: 'credit', sub: '翻唱'},
  {t: 14.09, text: '洛天依', kind: 'credit', sub: '原唱'},

  {t: 20.44, text: '收藏夹的照片看了又删', kind: 'verse', motif: 'photo'},
  {t: 24.37, text: '去年夏天后就没聊过天', kind: 'verse'},
  {t: 28.1, text: '一盏一盏街灯烘焙了夜', kind: 'verse', motif: 'lamp'},
  {t: 31.92, text: '只有手中烟在寂寞地渲染', kind: 'verse', motif: 'smoke'},
  {t: 35.53, text: '人太多，大部分是漫无目的的走', kind: 'verse'},
  {t: 39.35, text: '听着歌想念一个人心痛也不说', kind: 'verse'},
  {t: 43.18, text: '悄悄看外边的情侣暧昧牵着手', kind: 'verse'},
  {t: 46.79, text: '你也牵过手', kind: 'verse'},
  {t: 48.65, text: '是左手牵右手', kind: 'verse'},

  {t: 51.07, text: '叮当当，Q 响起会是谁呢', kind: 'chat', tag: 'NaYo'},
  {t: 54.34, text: '会是他嘛', kind: 'chat', tag: 'NaYo'},
  {t: 56.32, text: '什么事呢', kind: 'chat', tag: 'Ayo'},
  {t: 58.28, text: '假装正经帮他把问题都摆平', kind: 'chat', tag: 'NaYo'},
  {t: 62.11, text: '不多聊了', kind: 'chat', tag: 'NaYo'},
  {t: 63.96, text: '去吃饭了', kind: 'chat', tag: 'Ayo'},

  {t: 66.26, text: '明明心里很喜欢却保持着距离', kind: 'hook'},
  {t: 69.77, text: '怕被伤害就伪装出高冷的表情', kind: 'hook', lead: 'oh'},
  {t: 73.48, text: '以为这样总有一天他会接近你', kind: 'hook'},
  {t: 77.43, text: '直到有天看见他和别人在一起', kind: 'hook', tone: 'cold'},

  {t: 82.02, text: '一盏一盏街灯烘焙了夜', kind: 'verse', motif: 'lamp'},
  {t: 85.64, text: '只有手中烟在寂寞渲染', kind: 'verse', motif: 'smoke'},
  {t: 89.56, text: '收藏夹的照片看了又删', kind: 'verse', motif: 'photo'},
  {t: 93.18, text: '去年夏天后就再没聊过天', kind: 'verse'},
  {t: 97.0, text: '人太多，大部分是漫无目的的走', kind: 'verse'},
  {t: 100.72, text: '听着歌想念一个人心痛也不说', kind: 'verse'},
  {t: 104.65, text: '悄悄看外边的情侣暧昧牵着手', kind: 'verse'},
  {t: 108.27, text: '你也牵过手', kind: 'verse'},
  {t: 109.9, text: '是左手牵右手', kind: 'verse'},

  {t: 111.65, text: '叮当当，Q 响起会是谁呢', kind: 'chat', tag: 'NaYo'},
  {t: 115.72, text: '会是他吗', kind: 'chat', tag: 'NaYo'},
  {t: 117.15, text: '什么事呢', kind: 'chat', tag: 'Ayo'},
  {t: 119.65, text: '假装正经把问题都帮他摆平', kind: 'chat', tag: 'NaYo'},
  {t: 123.26, text: '不多聊了', kind: 'chat', tag: 'NaYo'},
  {t: 124.59, text: '去吃饭了', kind: 'chat', tag: 'Ayo'},

  {t: 127.31, text: '明明心里很喜欢却保持着距离', kind: 'hook'},
  {t: 131.15, text: '怕被伤害就伪装出高冷的表情', kind: 'hook', lead: 'oh'},
  {t: 135.09, text: '以为这样总有一天他会接近你', kind: 'hook'},
  {t: 138.91, text: '直到有天看见他和别人在一起', kind: 'hook', tone: 'cold'},

  {t: 142.41, text: '优雅的转身', kind: 'bridge'},
  {t: 145.25, text: '熟悉的音乐', kind: 'bridge'},
  {t: 147.22, text: '是我们曾经那一段', kind: 'bridge'},
  {t: 150.93, text: '你已经淡出', kind: 'bridge'},
  {t: 152.8, text: '在我的时间轴', kind: 'bridge'},
  {t: 154.77, text: '只留下那天的回忆单曲循环', kind: 'bridge'},

  {t: 158.27, text: '叮当当，Q 响起会是谁呢', kind: 'chat', tag: 'NaYo'},
  {t: 161.77, text: '会是他吗', kind: 'chat', tag: 'NaYo'},
  {t: 163.19, text: '什么事呢', kind: 'chat', tag: 'Ayo'},
  {t: 164.72, text: '假装正经把问题都帮他摆平', kind: 'chat', tag: 'NaYo'},
  {t: 169.54, text: '不多聊了', kind: 'chat', tag: 'NaYo'},
  {t: 171.4, text: '去吃饭了', kind: 'chat', tag: 'Ayo'},

  {t: 173.47, text: '明明心里很喜欢却保持着距离', kind: 'hook'},
  {t: 177.3, text: '怕被伤害就伪装出高冷的表情', kind: 'hook', lead: 'oh'},
  {t: 181.34, text: '以为这样总有一天他会接近你', kind: 'hook'},
  {t: 184.62, text: '直到有天看见他和别人在一起', kind: 'hook', tone: 'cold'},

  {t: 189.0, text: '叮当当，Q 响起会是谁呢', kind: 'chat', tag: 'NaYo'},
  {t: 192.62, text: '会是他吗', kind: 'chat', tag: 'NaYo'},
  {t: 194.37, text: '什么事呢', kind: 'chat', tag: 'Ayo'},
  {t: 196.44, text: '假装正经把问题都帮他摆平', kind: 'chat', tag: 'NaYo'},
  {t: 200.15, text: '不多聊了', kind: 'chat', tag: 'NaYo'},
  {t: 202.12, text: '去吃饭了', kind: 'chat', tag: 'Ayo'},

  {t: 204.31, text: '明明心里很喜欢却保持着距离', kind: 'hook'},
  {t: 208.05, text: '怕被伤害就伪装出高冷的表情', kind: 'hook', lead: 'oh'},
  {t: 211.87, text: '以为这样总有一天他会接近你', kind: 'hook'},
  {t: 215.68, text: '直到有天看见他和别人在一起', kind: 'hook', tone: 'cold'},

  {t: 219.74, text: '叮当当，Q 响起会是谁呢', kind: 'chat', tag: 'NaYo'},
];

export const FPS = 30;
export const DURATION_SEC = 224.966531;
export const DURATION_FRAMES = Math.ceil(DURATION_SEC * FPS);

export const lineIndexAt = (t: number) => {
  if (t < LINES[0].t) return -1;
  let index = 0;
  for (let i = 0; i < LINES.length; i++) {
    if (LINES[i].t <= t) index = i;
    else break;
  }
  return index;
};
