import type { FC } from 'react';
import { AbsoluteFill, Audio, Sequence, staticFile } from 'remotion';
import './fonts';
import { Accusation } from './shots/Accusation';
import { Contempt } from './shots/Contempt';
import { Creed } from './shots/Creed';
import { Seal } from './shots/Seal';
import { Turn } from './shots/Turn';
import { FONT, INK, SHOTS } from './theme';

const Grain = () => (
  <svg
    width="1920"
    height="1080"
    style={{ position: 'absolute', inset: 0, opacity: 0.14, mixBlendMode: 'overlay', pointerEvents: 'none' }}
  >
    <filter id="grain">
      <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="7" />
    </filter>
    <rect width="100%" height="100%" filter="url(#grain)" />
  </svg>
);

export const XichangFilm: FC = () => {
  return (
    <AbsoluteFill style={{ background: INK, fontFamily: FONT }}>
      <AbsoluteFill
        style={{
          background:
            'radial-gradient(ellipse 1280px 860px at 50% 46%, #1c1410 0%, #0c0908 62%, #070504 100%)',
        }}
      />
      <Sequence from={SHOTS.accusation.from} durationInFrames={SHOTS.accusation.duration} name="accusation">
        <Accusation duration={SHOTS.accusation.duration} />
      </Sequence>
      <Sequence from={SHOTS.contempt.from} durationInFrames={SHOTS.contempt.duration} name="contempt">
        <Contempt duration={SHOTS.contempt.duration} />
      </Sequence>
      <Sequence from={SHOTS.turn.from} durationInFrames={SHOTS.turn.duration} name="turn">
        <Turn duration={SHOTS.turn.duration} />
      </Sequence>
      <Sequence from={SHOTS.creed.from} durationInFrames={SHOTS.creed.duration} name="creed">
        <Creed duration={SHOTS.creed.duration} />
      </Sequence>
      <Sequence from={SHOTS.seal.from} durationInFrames={SHOTS.seal.duration} name="seal">
        <Seal duration={SHOTS.seal.duration} />
      </Sequence>
      <AbsoluteFill
        style={{
          background: 'radial-gradient(ellipse at 50% 45%, transparent 42%, rgba(0,0,0,0.55) 100%)',
          pointerEvents: 'none',
        }}
      />
      <Grain />
      <div style={{ position: 'absolute', left: 72, right: 72, top: 46, height: 1, background: 'rgba(198,163,106,0.4)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', left: 72, right: 72, bottom: 46, height: 1, background: 'rgba(198,163,106,0.4)', pointerEvents: 'none' }} />
      <Audio src={staticFile('audio/voice.mp3')} />
    </AbsoluteFill>
  );
};
