import type { FC } from 'react';
import { AbsoluteFill, staticFile, useCurrentFrame } from 'remotion';
import { BUILDING_SHAPES, EDGE_LEFT, EDGE_RIGHT, ROAD_PATH, STARS, WINDOWS, project } from './city';
import { FPS, cameraPush, distanceAt, speedAt } from './timeline';
import { HORIZON, NIGHT } from './theme';

const DASH_GAP = 0.52;

export const World: FC = () => {
  const frame = useCurrentFrame();
  const speed = speedAt(frame / FPS);
  const push = cameraPush(frame);
  const shift = (distanceAt(frame) % DASH_GAP);
  const streak = speed < 0.4 ? 1.5 : Math.min(8, 1.5 + (speed - 0.4) * 10);
  const twinkle = speed < 0.8;

  const dashes: { x1: number; y1: number; x2: number; y2: number; w: number; a: number }[] = [];
  for (let i = 0; i < 36; i++) {
    const z1 = 1.05 + i * DASH_GAP - shift;
    if (z1 < 1.04 || z1 > 15) continue;
    const z2 = z1 + 0.2;
    const a = project(z1);
    const b = project(Math.min(z2, 18));
    const near = Math.min(1, Math.max(0, (z1 - 1.02) / 0.28));
    const far = Math.min(1, Math.max(0, (14.5 - z1) / 3.5));
    dashes.push({
      x1: a.x,
      y1: a.y,
      x2: b.x,
      y2: b.y,
      w: Math.min(18, Math.max(1.6, 14 / z1)),
      a: near * far * (0.4 + 0.5 * (1 - Math.min(1, z1 / 8))),
    });
  }

  return (
    <AbsoluteFill style={{ background: NIGHT, overflow: 'hidden' }}>
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: 1920,
          height: 1080,
          transform: `scale(${push.toFixed(4)})`,
          transformOrigin: '50% 72%',
        }}
      >
        <AbsoluteFill
          style={{
            background:
              'linear-gradient(180deg, #05040a 0%, #0b0a12 38%, #1a120f 70%, #2c1b14 100%)',
          }}
        />
        {STARS.map((star, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: star.x,
              top: star.y,
              width: star.r,
              height: star.r,
              borderRadius: '50%',
              background: '#f6f1e7',
              opacity: star.o,
            }}
          />
        ))}

        <div
          style={{
            position: 'absolute',
            left: 860,
            top: 390,
            width: 420,
            height: 220,
            background: 'radial-gradient(ellipse at center, rgba(255,176,92,0.16), rgba(255,176,92,0) 68%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: 1180,
            top: 430,
            width: 340,
            height: 180,
            background: 'radial-gradient(ellipse at center, rgba(255,140,70,0.12), rgba(255,140,70,0) 70%)',
          }}
        />

        <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ position: 'absolute', inset: 0 }}>
          <path d="M0 508 C 140 452, 280 486, 420 506 C 500 516, 540 508, 600 508 L 0 540 Z" fill="#07060c" />
          <path d="M0 508 C 180 478, 320 498, 480 508 L 0 508 Z" fill="#100e16" opacity={0.9} />
          {BUILDING_SHAPES.map((b, i) => (
            <g key={i}>
              <rect x={b.x} y={b.y} width={b.w} height={b.h} fill="#0a090e" />
              <rect x={b.x + b.w - 2} y={b.y} width={2} height={b.h} fill="#17151d" />
            </g>
          ))}
          {WINDOWS.map((w, i) => {
            const glow = twinkle ? 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(frame * 0.065 + w.phase)) : 0.82;
            const color = w.cool ? '#d7e6ff' : '#ffd7a6';
            return (
              <line
                key={i}
                x1={w.x - streak}
                y1={w.y}
                x2={w.x + streak}
                y2={w.y}
                stroke={color}
                strokeWidth={w.cool ? 1.4 : 1.7}
                strokeLinecap="round"
                opacity={glow}
              />
            );
          })}
          <rect x={0} y={HORIZON - 1} width={1920} height={3} fill="url(#horizon)" />
          <defs>
            <linearGradient id="horizon" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#f3c77a" stopOpacity="0" />
              <stop offset="0.28" stopColor="#f3c77a" stopOpacity="0.18" />
              <stop offset="0.62" stopColor="#ffc98a" stopOpacity={0.35 + speed * 0.18} />
              <stop offset="1" stopColor="#f3c77a" stopOpacity="0.12" />
            </linearGradient>
          </defs>
        </svg>

        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: HORIZON - 70,
            height: 120,
            background:
              'linear-gradient(180deg, rgba(42,24,18,0) 0%, rgba(48,28,20,0.38) 48%, rgba(8,7,12,0) 100%)',
          }}
        />

        <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ position: 'absolute', inset: 0 }}>
          <rect x={0} y={780} width={1920} height={300} fill="#09080d" />
          <path d={ROAD_PATH} fill="#09080d" />
          <polyline points={EDGE_LEFT} fill="none" stroke="rgba(243,199,122,0.28)" strokeWidth={1.6} />
          <polyline points={EDGE_RIGHT} fill="none" stroke="rgba(243,199,122,0.28)" strokeWidth={1.6} />
          {dashes.map((d, i) => (
            <line
              key={i}
              x1={d.x1}
              y1={d.y1}
              x2={d.x2}
              y2={d.y2}
              stroke="#f3c77a"
              strokeWidth={d.w}
              strokeLinecap="round"
              opacity={d.a}
            />
          ))}
        </svg>

        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            height: 380,
            background:
              'radial-gradient(ellipse 42% 80% at 52% 120%, rgba(255,214,160,0.10), rgba(255,214,160,0) 62%)',
          }}
        />
      </div>

      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 548,
          height: 430,
          background:
            'linear-gradient(180deg, rgba(8,7,12,0) 0%, rgba(8,7,12,0.58) 18%, rgba(8,7,12,0.72) 62%, rgba(8,7,12,0.28) 100%)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse 72% 64% at 50% 40%, rgba(0,0,0,0) 42%, rgba(0,0,0,0.58) 100%)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url(${staticFile('grain.png')})`,
          backgroundSize: '256px 256px',
          opacity: 0.22,
          mixBlendMode: 'overlay',
          pointerEvents: 'none',
        }}
      />
    </AbsoluteFill>
  );
};

World.displayName = 'NightDrive';
