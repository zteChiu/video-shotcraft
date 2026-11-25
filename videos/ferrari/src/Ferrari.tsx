import type { FC } from 'react';
import { AbsoluteFill, Audio, Sequence, staticFile } from 'remotion';
import { Bloom } from './Bloom';
import { FadeOut } from './FadeOut';
import { Fonts } from './fonts';
import { Kicker } from './Kicker';
import { LyricLine } from './LyricLine';
import { Title } from './Title';
import { BLOOMS, BLOOM_FRAMES, LYRICS, TITLE_DURATION, f } from './timeline';
import { NIGHT } from './theme';
import { World } from './World';

/**
 * Ferrari — Bebe Rexha.
 * One continuous night pull-off above the city. Lyrics lock to the vocal
 * timestamps; the road speeds up and brakes with the sections. Three horizon
 * blooms sit on the measured drops and nowhere else.
 */
export const FerrariFilm: FC = () => {
  return (
    <AbsoluteFill style={{ background: NIGHT, overflow: 'hidden' }}>
      <Fonts />
      <World />
      <Kicker />
      <Sequence from={0} durationInFrames={TITLE_DURATION} name="Title">
        <Title duration={TITLE_DURATION} />
      </Sequence>
      {LYRICS.map((cue) => (
        <Sequence key={cue.id} from={cue.from} durationInFrames={cue.duration} name={cue.en}>
          <LyricLine
            en={cue.en}
            zh={cue.zh}
            align={cue.align}
            tone={cue.tone}
            mode={cue.mode}
            emphasis={cue.emphasis}
            duration={cue.duration}
            zhDelay={cue.zhDelay}
          />
        </Sequence>
      ))}
      {BLOOMS.map((bloom) => (
        <Sequence key={bloom.id} from={f(bloom.t)} durationInFrames={BLOOM_FRAMES} name={bloom.label}>
          <Bloom duration={BLOOM_FRAMES} />
        </Sequence>
      ))}
      <FadeOut />
      <Audio src={staticFile('audio/ferrari.mp3')} />
    </AbsoluteFill>
  );
};

FerrariFilm.displayName = 'Ferrari';
