import { Composition } from 'remotion';
import { AIFL_TOTAL } from './aifl/Main';
import { ThemedFilm } from './themes/ThemedFilm';
import { DeepSeekLab, DEEPSEEK_LAB_DURATION } from './labs/DeepSeekFilm';
import { OpenAILab, OPENAI_LAB_DURATION } from './labs/OpenAIFilm';
import { ClaudeLab, CLAUDE_LAB_DURATION } from './labs/ClaudeFilm';

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
      <Composition id="DeepSeekLab" component={DeepSeekLab} durationInFrames={DEEPSEEK_LAB_DURATION} fps={30} width={1920} height={1080} />
      <Composition id="OpenAILab" component={OpenAILab} durationInFrames={OPENAI_LAB_DURATION} fps={30} width={1920} height={1080} />
      <Composition id="ClaudeLab" component={ClaudeLab} durationInFrames={CLAUDE_LAB_DURATION} fps={30} width={1920} height={1080} />
    </>
  );
};
