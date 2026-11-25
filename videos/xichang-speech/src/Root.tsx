import type { FC } from 'react';
import { Composition } from 'remotion';
import { XichangFilm } from './Film';
import { FPS, TOTAL } from './theme';

export const Root: FC = () => {
  return (
    <Composition
      id="XichangSpeech"
      component={XichangFilm}
      durationInFrames={TOTAL}
      fps={FPS}
      width={1920}
      height={1080}
    />
  );
};
