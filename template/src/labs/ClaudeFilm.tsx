// 原创 15 秒。不取官网画面。名字先在，句子后到，像有人在听。
import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { CJK, SERIF, press, rise } from './ease';

export const CLAUDE_LAB_DURATION = 450;
const LINE = '先听完这一句';

export const ClaudeLab: React.FC = () => {
  const frame = useCurrentFrame();
  const fadeIn = interpolate(frame, [0, 18], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const veil = interpolate(frame, [432, 449], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const name = interpolate(frame, [14, 48], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: press });
  const rule = interpolate(frame, [168, 206], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: rise });

  return (
    <AbsoluteFill style={{ backgroundColor: '#f3eee6' }}>
      <AbsoluteFill style={{ opacity: fadeIn }}>
        <div style={{ position: 'absolute', left: -120, top: -160, width: 720, height: 520, borderRadius: '50%', background: '#efe4d4', filter: 'blur(40px)' }} />
        <div style={{ position: 'absolute', right: -180, bottom: -200, width: 840, height: 560, borderRadius: '50%', background: '#e7efe8', filter: 'blur(50px)' }} />
        <AbsoluteFill style={{ background: 'radial-gradient(ellipse at center, rgba(243,238,230,0) 40%, rgba(90,62,40,0.08) 100%)' }} />

        <div style={{ position: 'absolute', left: 140, top: 0, bottom: 0, display: 'flex', alignItems: 'center' }}>
          <div
            style={{
              fontFamily: SERIF,
              fontStyle: 'italic',
              fontWeight: 400,
              fontSize: 132,
              letterSpacing: '-0.03em',
              color: '#2a241e',
              opacity: name,
              transform: `translateY(${(1 - name) * 16}px)`,
            }}
          >
            Claude
          </div>
        </div>

        <div style={{ position: 'absolute', left: 860, top: 0, bottom: 0, display: 'flex', alignItems: 'center' }}>
          <div>
            <div style={{ display: 'flex', height: 78, alignItems: 'center' }}>
              {LINE.split('').map((ch, i) => {
                const start = 78 + i * 9;
                const t = interpolate(frame, [start, start + 16], [0, 1], {
                  extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: rise,
                });
                return (
                  <span
                    key={i}
                    style={{
                      fontFamily: CJK,
                      fontSize: 46,
                      letterSpacing: '0.18em',
                      color: '#3a322b',
                      opacity: t,
                      filter: `blur(${(1 - t) * 5}px)`,
                      display: 'inline-block',
                    }}
                  >
                    {ch}
                  </span>
                );
              })}
            </div>
            <div style={{ marginTop: 22, height: 2, width: 280 * rule, background: '#b46b3c' }} />
          </div>
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{ backgroundColor: '#f3eee6', opacity: veil }} />
    </AbsoluteFill>
  );
};
