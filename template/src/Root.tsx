import { Composition } from 'remotion';
import { AIFL_TOTAL } from './aifl/Main';
import { ThemedFilm } from './themes/ThemedFilm';
import { Fifteen, FIFTEEN_DURATION } from './fifteen/Film';

export const Root: React.FC = () => {
  return (
    <>
      <Composition
        id="AiflPromo"
        component={ThemedFilm}
        defaultProps={{theme: 'ink-press'}}
        durationInFrames={AIFL_TOTAL}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="Fifteen"
        component={Fifteen}
        durationInFrames={FIFTEEN_DURATION}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
