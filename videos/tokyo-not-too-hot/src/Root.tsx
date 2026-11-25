import {Composition} from 'remotion';
import {DURATION_FRAMES, FPS} from './lyrics';
import {Film} from './Film';

export const Root: React.FC = () => {
  return (
    <Composition
      id="TokyoNotTooHot"
      component={Film}
      durationInFrames={DURATION_FRAMES}
      fps={FPS}
      width={1920}
      height={1080}
    />
  );
};
