import { Composition } from 'remotion';
import { AIFL_TOTAL } from './aifl/Main';
import { ThemedFilm } from './themes/ThemedFilm';
import { DeepSeekFifteen, DEEPSEEK_FIFTEEN_DURATION } from './deepseek/Film';

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
        id="DeepSeekFifteen"
        component={DeepSeekFifteen}
        durationInFrames={DEEPSEEK_FIFTEEN_DURATION}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
