// 《十五秒》——三张已调校镜头卡接成 15.0s（30fps × 450f）。
// 不改卡片内部时值：每张卡跑满自己的时长，切点落在前一张的 hold 上。
//   0–104    letterspace-materialize  暮色湖面，video-shotcraft 一笔写完并停住
//   105–284  flying-words             夜色词隧，能力词迎面飞过，中心压着品牌短句
//   285–449  text-as-mask             瓷白舞台上的 SCALE 字窗打开，产品画面接管
// 片头 14f 从黑淡入，两处切点各 12f 淡入黑再打开，片尾 20f 淡出。
import React from 'react';
import { AbsoluteFill, interpolate, Sequence, useCurrentFrame } from 'remotion';
import {
  LetterspaceMaterialize,
  LETTERSPACE_MATERIALIZE_DURATION,
} from '../../../demos/opening/letterspace-materialize/LetterspaceMaterialize';
import { FlyingWords, FLYING_WORDS_DURATION } from '../../../demos/typography/flying-words/FlyingWords';
import { TextAsMask, TEXT_AS_MASK_DURATION } from '../../../demos/opening/text-as-mask/TextAsMask';

export const FIFTEEN_DURATION =
  LETTERSPACE_MATERIALIZE_DURATION + FLYING_WORDS_DURATION + TEXT_AS_MASK_DURATION;

const dipAt = (frame: number, at: number) =>
  interpolate(frame, [at - 6, at, at + 6], [0, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

export const Fifteen: React.FC = () => {
  const frame = useCurrentFrame();
  const fadeIn = interpolate(frame, [0, 14], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const fadeOut = interpolate(frame, [FIFTEEN_DURATION - 20, FIFTEEN_DURATION - 1], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const dip = Math.max(
    dipAt(frame, LETTERSPACE_MATERIALIZE_DURATION),
    dipAt(frame, LETTERSPACE_MATERIALIZE_DURATION + FLYING_WORDS_DURATION),
  );

  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      <AbsoluteFill style={{ opacity: fadeIn * fadeOut }}>
        <Sequence durationInFrames={LETTERSPACE_MATERIALIZE_DURATION} name="lake">
          <LetterspaceMaterialize />
        </Sequence>
        <Sequence from={LETTERSPACE_MATERIALIZE_DURATION} durationInFrames={FLYING_WORDS_DURATION} name="tunnel">
          <FlyingWords />
        </Sequence>
        <Sequence
          from={LETTERSPACE_MATERIALIZE_DURATION + FLYING_WORDS_DURATION}
          durationInFrames={TEXT_AS_MASK_DURATION}
          name="scale"
        >
          <TextAsMask />
        </Sequence>
      </AbsoluteFill>
      <AbsoluteFill style={{ backgroundColor: '#000', opacity: dip }} />
    </AbsoluteFill>
  );
};
