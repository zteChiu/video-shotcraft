// 《What can I help with?》——15.0s / 30fps / 450f
// 跟 openai.com 首页：白底、#080808、blossom + OpenAI 字标路径、
// 那句 “What can I help with?”、圆角输入卡。不编模型回答。
// 字标入场仍是压印那套（scale 收到 1、blur 收到 0），幅度很小，停满 1 秒再出输入卡。
import React from 'react';
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from 'remotion';
import { OPENAI_BLOSSOM, OPENAI_WORDMARK } from './marks';

export const OPENAI_FIFTEEN_DURATION = 450;

const INK = '#080808';
const FONT = 'Inter, "Helvetica Neue", Arial, sans-serif';
const LINE = ['What', 'can', 'I', 'help', 'with?'];
const QUESTION = 'Help me think this through.';
const ease = Easing.bezier(0.2, 0.7, 0.25, 1);
const rise = Easing.bezier(0.16, 1, 0.3, 1);

export const OpenAIFifteen: React.FC = () => {
  const frame = useCurrentFrame();
  const fadeIn = interpolate(frame, [0, 14], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const veil = interpolate(frame, [432, 449], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  const mark = interpolate(frame, [12, 42], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: rise });
  const word = interpolate(frame, [28, 58], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease });
  const card = interpolate(frame, [156, 190], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: rise });
  const lift = interpolate(frame, [156, 196], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: rise });

  const typeStart = 206;
  const typed = Math.max(0, Math.min(QUESTION.length, Math.floor((frame - typeStart) / 3)));
  const typing = frame >= typeStart;
  const typedDone = typeStart + QUESTION.length * 3;
  const caretOn = !typing ? false : frame < typedDone ? true : Math.floor((frame - typedDone) / 16) % 2 === 0;
  const push = interpolate(frame, [typedDone, typedDone + 48], [1, 1.02], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.bezier(0.4, 0, 0.2, 1),
  });

  return (
    <AbsoluteFill style={{ backgroundColor: '#fff' }}>
      <AbsoluteFill style={{ opacity: fadeIn, justifyContent: 'center', alignItems: 'center', transform: `scale(${push})` }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', transform: `translateY(${(1 - lift) * 56}px)` }}>
          <div style={{ display: 'flex', alignItems: 'center', height: 88 }}>
            <div
              style={{ width: 72, height: 72, opacity: mark, transform: `scale(${1.08 - 0.08 * mark})` }}
              dangerouslySetInnerHTML={{ __html: OPENAI_BLOSSOM }}
            />
            <div
              style={{ width: 210, height: 56, marginLeft: 16, opacity: word, transform: `translateY(${(1 - word) * 8}px)` }}
              dangerouslySetInnerHTML={{ __html: OPENAI_WORDMARK }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'baseline', marginTop: 28, height: 92 }}>
            {LINE.map((w, i) => {
              const start = 64 + i * 6;
              const t = interpolate(frame, [start, start + 16], [0, 1], {
                extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease,
              });
              return (
                <span
                  key={w}
                  style={{
                    fontFamily: FONT,
                    fontWeight: 600,
                    fontSize: 72,
                    lineHeight: 1,
                    letterSpacing: '-0.03em',
                    color: INK,
                    marginRight: i === LINE.length - 1 ? 0 : 18,
                    opacity: t,
                    filter: `blur(${(1 - t) * 6}px)`,
                    transform: `translateY(${(1 - t) * 10}px)`,
                    display: 'inline-block',
                  }}
                >
                  {w}
                </span>
              );
            })}
          </div>

          <div
            style={{
              width: 980,
              marginTop: 28,
              minHeight: 168,
              padding: '28px 28px 24px',
              borderRadius: 28,
              background: '#fff',
              border: '1px solid rgba(13,13,13,0.06)',
              boxShadow: '0 18px 50px rgba(8,8,8,0.06)',
              opacity: card,
              transform: `translateY(${(1 - card) * 24}px)`,
              position: 'relative',
            }}
          >
            <div style={{ minHeight: 88, display: 'flex', alignItems: 'flex-start' }}>
              <span style={{ fontFamily: FONT, fontWeight: 400, fontSize: 36, lineHeight: 1.35, color: typing ? INK : 'rgba(8,8,8,0.45)' }}>
                {typing ? QUESTION.slice(0, typed) : 'Message ChatGPT'}
              </span>
              {typing && <span style={{ width: 2, height: 36, marginLeft: 3, background: INK, opacity: caretOn ? 1 : 0 }} />}
            </div>
            <div
              style={{
                position: 'absolute',
                right: 22,
                bottom: 22,
                width: 52,
                height: 52,
                borderRadius: 26,
                background: INK,
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 26,
                lineHeight: 1,
              }}
            >
              ↑
            </div>
          </div>
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{ backgroundColor: '#fff', opacity: veil }} />
    </AbsoluteFill>
  );
};
