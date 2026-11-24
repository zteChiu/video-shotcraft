// 《探索未至之境》——15.0s / 30fps / 450f
// 视觉跟 deepseek.com 中文首页走：云底、品牌蓝 #4D6BFE、字色 #152443、
// 口号字距、圆角提问卡、「深度思考 / 智能搜索」。不写模型回答，不问不存在的数字。
// 字标入场沿用 brand-ink-open 的压印（scale 收到 1、blur 收到 0、bezier(0.2,0.7,0.25,1)），
// 幅度收小，好让它待在这页的安静里。落定后先停满 1 秒，再升起提问卡。
import React from 'react';
import {
  AbsoluteFill,
  Easing,
  cancelRender,
  continueRender,
  delayRender,
  interpolate,
  staticFile,
  useCurrentFrame,
} from 'remotion';
import { DEEPSEEK_LOCKUP } from './logo';

export const DEEPSEEK_FIFTEEN_DURATION = 450;

const INK = '#152443';
const MUTED = '#8691a1';
const BRAND = '#4D6BFE';
const SLOGAN = '探索未至之境';
const QUESTION = '如果一直往下走，会到哪里';
const FONT = '"Noto Sans SC","WenQuanYi Micro Hei","PingFang SC",sans-serif';

const pressEase = Easing.bezier(0.2, 0.7, 0.25, 1);
const riseEase = Easing.bezier(0.16, 1, 0.3, 1);

const fontHandle = delayRender('noto-sans-sc');
const face400 = new FontFace('Noto Sans SC', `url(${staticFile('deepseek/noto-sc-400.ttf')})`, { weight: '400' });
const face500 = new FontFace('Noto Sans SC', `url(${staticFile('deepseek/noto-sc-500.ttf')})`, { weight: '500' });
Promise.all([face400.load(), face500.load()])
  .then((faces) => {
    faces.forEach((face) => document.fonts.add(face));
    continueRender(fontHandle);
  })
  .catch((err) => cancelRender(err));

const Clouds: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: '#f7f8fb', overflow: 'hidden' }}>
    <div style={{ position: 'absolute', left: -180, top: -220, width: 1100, height: 720, borderRadius: '50%', background: '#d5e4f6', filter: 'blur(70px)' }} />
    <div style={{ position: 'absolute', right: -260, top: -80, width: 980, height: 640, borderRadius: '50%', background: '#e4eef9', filter: 'blur(60px)' }} />
    <div style={{ position: 'absolute', left: 380, top: 80, width: 1200, height: 520, borderRadius: '50%', background: 'rgba(255,255,255,0.85)', filter: 'blur(40px)' }} />
    <div style={{ position: 'absolute', left: 120, bottom: -280, width: 1600, height: 560, borderRadius: '50%', background: '#f4f7fb', filter: 'blur(30px)' }} />
  </AbsoluteFill>
);

export const DeepSeekFifteen: React.FC = () => {
  const frame = useCurrentFrame();
  const fadeIn = interpolate(frame, [0, 16], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const fadeOut = interpolate(frame, [432, 449], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  const logoIn = interpolate(frame, [14, 36], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: riseEase,
  });

  const cardIn = interpolate(frame, [132, 168], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: riseEase,
  });
  const lift = interpolate(frame, [132, 172], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: riseEase,
  });

  const think = interpolate(frame, [176, 184, 196], [0, 1, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: pressEase,
  });
  const thinkScale = interpolate(frame, [176, 182, 192], [1, 0.96, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  const typeStart = 204;
  const typed = Math.max(0, Math.min(QUESTION.length, Math.floor((frame - typeStart) / 4)));
  const typing = frame >= typeStart;
  const typedDone = typeStart + QUESTION.length * 4;
  const caretOn = frame < typeStart ? false : frame < typedDone ? true : Math.floor((frame - typedDone) / 15) % 2 === 0;

  const push = interpolate(frame, [typedDone, typedDone + 50], [1, 1.025], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.bezier(0.4, 0, 0.2, 1),
  });

  return (
    <AbsoluteFill style={{ backgroundColor: '#f7f8fb' }}>
      <AbsoluteFill style={{ opacity: fadeIn }}>
      <Clouds />
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', transform: `scale(${push})` }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', transform: `translateY(${(1 - lift) * 64}px)` }}>
          <div
            style={{ width: 392, height: 63, opacity: logoIn, transform: `translateY(${(1 - logoIn) * 10}px)` }}
          >
            <style>{`[data-ds-lockup] svg{width:100%;height:100%;display:block}`}</style>
            <div data-ds-lockup dangerouslySetInnerHTML={{ __html: DEEPSEEK_LOCKUP }} style={{ width: '100%', height: '100%' }} />
          </div>

          <div style={{ display: 'flex', marginTop: 36, height: 120, alignItems: 'center' }}>
            {SLOGAN.split('').map((ch, i) => {
              const start = 32 + i * 6;
              const t = interpolate(frame, [start, start + 18], [0, 1], {
                extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: pressEase,
              });
              return (
                <span
                  key={i}
                  style={{
                    fontFamily: FONT,
                    fontWeight: 400,
                    fontSize: 84,
                    lineHeight: 1,
                    color: INK,
                    letterSpacing: '0.28em',
                    opacity: t,
                    filter: `blur(${(1 - t) * 8}px)`,
                    transform: `scale(${1.16 - 0.16 * t})`,
                    display: 'inline-block',
                  }}
                >
                  {ch}
                </span>
              );
            })}
          </div>

          <div
            style={{
              width: 1040,
              marginTop: 18,
              padding: '36px 36px 28px',
              borderRadius: 28,
              background: 'rgba(255,255,255,0.86)',
              border: '1px solid rgba(255,255,255,0.9)',
              boxShadow: '0 24px 60px rgba(21,36,67,0.06)',
              opacity: cardIn,
              transform: `translateY(${(1 - cardIn) * 28}px)`,
            }}
          >
            <div style={{ minHeight: 72, display: 'flex', alignItems: 'center' }}>
              <span style={{ fontFamily: FONT, fontWeight: 400, fontSize: 40, lineHeight: 1.4, color: typing ? INK : MUTED }}>
                {typing ? QUESTION.slice(0, typed) : '问点什么，一起探索'}
              </span>
              {typing && (
                <span style={{ width: 2, height: 40, marginLeft: 4, background: BRAND, opacity: caretOn ? 1 : 0 }} />
              )}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', marginTop: 22 }}>
              <div
                style={{
                  height: 64,
                  padding: '0 22px',
                  borderRadius: 32,
                  display: 'flex',
                  alignItems: 'center',
                  fontFamily: FONT,
                  fontWeight: 500,
                  fontSize: 32,
                  color: think > 0.5 ? BRAND : INK,
                  background: `rgba(77,107,254,${0.14 * think})`,
                  border: `1px solid rgba(77,107,254,${0.15 + 0.45 * think})`,
                  transform: `scale(${thinkScale})`,
                }}
              >
                深度思考
              </div>
              <div
                style={{
                  height: 64,
                  marginLeft: 14,
                  padding: '0 22px',
                  borderRadius: 32,
                  display: 'flex',
                  alignItems: 'center',
                  fontFamily: FONT,
                  fontWeight: 500,
                  fontSize: 32,
                  color: INK,
                  background: 'transparent',
                  border: '1px solid rgba(21,36,67,0.12)',
                }}
              >
                智能搜索
              </div>
              <div style={{ flex: 1 }} />
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: 32,
                  background: BRAND,
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 30,
                  lineHeight: 1,
                }}
              >
                ↑
              </div>
            </div>
          </div>
        </div>
      </AbsoluteFill>
      </AbsoluteFill>
      <AbsoluteFill style={{ backgroundColor: '#f7f8fb', opacity: 1 - fadeOut }} />
    </AbsoluteFill>
  );
};
