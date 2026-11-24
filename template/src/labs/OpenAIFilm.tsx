// 原创 15 秒。不取官网画面。白环收到中间，一道白缝把句子打开。
import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { CJK, SANS, press, rise, settle } from './ease';

export const OPENAI_LAB_DURATION = 450;

export const OpenAILab: React.FC = () => {
  const frame = useCurrentFrame();
  const fadeIn = interpolate(frame, [0, 12], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const radius = interpolate(frame, [8, 86], [360, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: settle });
  const ringOpacity = interpolate(frame, [8, 20, 78, 92], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const name = interpolate(frame, [58, 96], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: press });
  const slit = interpolate(frame, [150, 196], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: rise });
  const line = interpolate(frame, [186, 220], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: rise });
  const lift = interpolate(frame, [150, 200], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: rise });

  return (
    <AbsoluteFill style={{ backgroundColor: '#070707', opacity: fadeIn }}>
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
        <div
          style={{
            width: radius * 2,
            height: radius * 2,
            borderRadius: radius,
            border: '1.5px solid rgba(255,255,255,0.92)',
            opacity: ringOpacity,
          }}
        />
      </AbsoluteFill>
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ transform: `translateY(${-lift * 150}px)`, textAlign: 'center' }}>
          <div
            style={{
              fontFamily: SANS,
              fontWeight: 500,
              fontSize: 108,
              letterSpacing: '-0.045em',
              color: '#f5f5f5',
              opacity: name,
              filter: `blur(${(1 - name) * 8}px)`,
              transform: `scale(${1.06 - 0.06 * name})`,
            }}
          >
            OpenAI
          </div>
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', pointerEvents: 'none' }}>
        <div
          style={{
            width: 860,
            height: 132,
            background: '#f4f4f4',
            transform: `scaleY(${slit})`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              fontFamily: CJK,
              fontSize: 48,
              letterSpacing: '0.34em',
              color: '#111',
              opacity: line,
              paddingLeft: '0.34em',
            }}
          >
            把问题打开
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
