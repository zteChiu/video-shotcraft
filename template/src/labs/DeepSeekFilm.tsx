// 原创 15 秒。不取官网画面。一束光沉进水里，名字停在水面上。
import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { CJK, SANS, press, rise, settle } from './ease';

export const DEEPSEEK_LAB_DURATION = 450;
const HORIZON = 560;

export const DeepSeekLab: React.FC = () => {
  const frame = useCurrentFrame();
  const fadeIn = interpolate(frame, [0, 16], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const fall = interpolate(frame, [18, 132], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: settle });
  const y = 188 + fall * 620;
  const name = interpolate(frame, [36, 72], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: press });
  const line = interpolate(frame, [156, 188], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: rise });
  const crossed = y >= HORIZON;
  const rippleT = interpolate(frame, [96, 150], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: rise });
  const rippleOn = frame >= 96 && frame <= 158;
  const refY = HORIZON + Math.min(180, Math.abs(HORIZON - y) * 0.45);

  return (
    <AbsoluteFill style={{ backgroundColor: '#041018', opacity: fadeIn }}>
      <AbsoluteFill style={{ background: 'linear-gradient(180deg, #16324c 0%, #0c2236 46%, #071520 62%, #03080e 100%)' }} />
      <div style={{ position: 'absolute', left: 0, right: 0, top: HORIZON, height: 1, background: 'rgba(186,214,236,0.28)' }} />
      <div style={{ position: 'absolute', left: 0, right: 0, top: HORIZON + 1, bottom: 0, background: 'linear-gradient(180deg, rgba(8,28,44,0.2), rgba(2,6,12,0.55))' }} />
      {[0, 1, 2, 3].map((i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: 180,
            right: 180,
            top: HORIZON + 36 + i * 48,
            height: 1,
            background: 'rgba(170,204,228,0.09)',
          }}
        />
      ))}

      <div
        style={{
          position: 'absolute',
          left: 960 - 7,
          top: y - 7,
          width: 14,
          height: 14,
          borderRadius: 7,
          background: '#e7f2ff',
          boxShadow: '0 0 28px 10px rgba(176,210,255,0.55), 0 0 80px 24px rgba(120,170,230,0.25)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 959,
          top: line > 0.15 ? 700 : Math.min(y, HORIZON),
          width: 2,
          height: Math.max(0, (line > 0.15 ? y : Math.max(y, HORIZON)) - (line > 0.15 ? 700 : Math.min(y, HORIZON))),
          background: crossed
            ? 'linear-gradient(180deg, rgba(190,220,255,0.0), rgba(190,220,255,0.35))'
            : 'linear-gradient(180deg, rgba(190,220,255,0.35), rgba(190,220,255,0))',
          opacity: 0.7,
        }}
      />
      {!crossed && (
        <div
          style={{
            position: 'absolute',
            left: 960 - 5,
            top: refY,
            width: 10,
            height: 10,
            borderRadius: 5,
            background: 'rgba(200,224,255,0.45)',
            filter: 'blur(2px)',
          }}
        />
      )}
      {rippleOn && (
        <div
          style={{
            position: 'absolute',
            left: 960 - (12 + rippleT * 260),
            top: HORIZON - 1,
            width: (12 + rippleT * 260) * 2,
            height: 2,
            borderRadius: 2,
            border: '1px solid rgba(210,230,255,0.55)',
            opacity: 1 - rippleT,
          }}
        />
      )}

      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 250,
          textAlign: 'center',
          fontFamily: SANS,
          fontWeight: 500,
          fontSize: 92,
          letterSpacing: '0.18em',
          color: '#f4f8fc',
          opacity: name,
          transform: `translateY(${(1 - name) * 12}px)`,
          filter: `blur(${(1 - name) * 6}px)`,
        }}
      >
        DeepSeek
      </div>
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 612,
          textAlign: 'center',
          fontFamily: CJK,
          fontWeight: 400,
          fontSize: 42,
          letterSpacing: '0.42em',
          color: 'rgba(214,230,244,0.88)',
          opacity: line,
          transform: `translateY(${(1 - line) * 10}px)`,
        }}
      >
        往深处找
      </div>
    </AbsoluteFill>
  );
};
