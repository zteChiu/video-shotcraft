import { Composition } from 'remotion';
import { AIFL_TOTAL } from './aifl/Main';
import { ThemedFilm } from './themes/ThemedFilm';
import { OpenAIFifteen, OPENAI_FIFTEEN_DURATION } from './openai/Film';

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
        id="OpenAIFifteen"
        component={OpenAIFifteen}
        durationInFrames={OPENAI_FIFTEEN_DURATION}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
