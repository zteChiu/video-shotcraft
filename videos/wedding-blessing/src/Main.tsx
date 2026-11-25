import { AbsoluteFill, Audio, interpolate, Sequence, staticFile, useCurrentFrame } from 'remotion';
import { BrandInkOpen, BRAND_INK_DEFAULTS } from './shots/BrandInkOpen';
import { PaperTitleCard } from './shots/PaperTitleCard';
import { GrainDissolve, GRAIN_DEFAULTS } from './shots/GrainDissolve';
import { SealHold, SEAL_HOLD_DEFAULTS } from './shots/SealHold';
import { BGM_FILE, BGM_VOLUME, SFX, SHOTS, TOTAL, sfxFrom } from './timeline';
import { PAPER } from './theme';

export type FilmProps = { bgm?: boolean };

export const VOW_A = { line1: '愿此生', line2: '常相守', accent: '常相守', sub: '一诺千金' };
export const VOW_B = { line1: '岁岁年年', line2: '皆欢喜', accent: '欢喜', sub: '喜乐长安' };

const Bed: React.FC<{ enabled: boolean }> = ({ enabled }) => {
  const frame = useCurrentFrame();
  if (!enabled) return null;
  const inn = interpolate(frame, [0, 24], [0, BGM_VOLUME], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const out = interpolate(frame, [TOTAL - 36, TOTAL - 4], [BGM_VOLUME, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return <Audio src={staticFile(BGM_FILE)} volume={Math.min(inn, out)} />;
};

export const WeddingFilm: React.FC<FilmProps> = ({ bgm = true }) => {
  return (
    <AbsoluteFill style={{ background: PAPER }}>
      <Sequence from={SHOTS.seal.from} durationInFrames={SHOTS.seal.duration}>
        <BrandInkOpen {...BRAND_INK_DEFAULTS} />
      </Sequence>
      <Sequence from={SHOTS.vowA.from} durationInFrames={SHOTS.vowA.duration}>
        <PaperTitleCard {...VOW_A} duration={SHOTS.vowA.duration} />
      </Sequence>
      <Sequence from={SHOTS.vowB.from} durationInFrames={SHOTS.vowB.duration}>
        <PaperTitleCard {...VOW_B} duration={SHOTS.vowB.duration} />
      </Sequence>
      <Sequence from={SHOTS.grain.from} durationInFrames={SHOTS.grain.duration}>
        <GrainDissolve {...GRAIN_DEFAULTS} />
      </Sequence>
      <Sequence from={SHOTS.hold.from} durationInFrames={SHOTS.hold.duration}>
        <SealHold {...SEAL_HOLD_DEFAULTS} duration={SHOTS.hold.duration} />
      </Sequence>
      {SFX.map((cue) => (
        <Sequence key={cue.id} from={sfxFrom(cue.target, cue.peakSeconds)} durationInFrames={cue.duration}>
          <Audio src={staticFile(cue.src)} volume={cue.volume} />
        </Sequence>
      ))}
      <Bed enabled={bgm} />
    </AbsoluteFill>
  );
};

WeddingFilm.displayName = 'WeddingFilm';
