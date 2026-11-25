import { Composition } from 'remotion';
import './fonts';
import { WeddingFilm } from './Main';
import { TOTAL } from './timeline';
import { HEIGHT, WIDTH } from './theme';

export const Root: React.FC = () => {
  return (
    <Composition
      id="WeddingBlessing"
      component={WeddingFilm}
      defaultProps={{ bgm: true }}
      durationInFrames={TOTAL}
      fps={30}
      width={WIDTH}
      height={HEIGHT}
    />
  );
};
