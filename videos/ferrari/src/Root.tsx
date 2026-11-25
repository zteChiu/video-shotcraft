import type { FC } from 'react';
import { Composition } from 'remotion';
import { FerrariFilm } from './Ferrari';
import { FPS, TOTAL } from './timeline';

export const Root: FC = () => {
  return (
    <Composition
      id="Ferrari"
      component={FerrariFilm}
      durationInFrames={TOTAL}
      fps={FPS}
      width={1920}
      height={1080}
    />
  );
};
