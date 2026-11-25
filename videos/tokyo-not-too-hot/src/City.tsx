import {staticFile} from 'remotion';

const GROUND = 1000;

type Building = {
  x: number;
  w: number;
  h: number;
  seed: number;
};

type WindowLight = {
  x: number;
  y: number;
  on: boolean;
  cool: boolean;
  pulse: boolean;
  phase: number;
};

const FAR: Building[] = [
  {x: 40, w: 90, h: 120, seed: 1},
  {x: 150, w: 70, h: 160, seed: 2},
  {x: 250, w: 120, h: 100, seed: 3},
  {x: 400, w: 80, h: 140, seed: 4},
  {x: 520, w: 140, h: 90, seed: 5},
  {x: 700, w: 100, h: 150, seed: 6},
  {x: 840, w: 160, h: 110, seed: 7},
  {x: 1040, w: 90, h: 170, seed: 8},
  {x: 1160, w: 130, h: 100, seed: 9},
  {x: 1340, w: 80, h: 140, seed: 10},
  {x: 1480, w: 150, h: 90, seed: 11},
  {x: 1680, w: 110, h: 150, seed: 12},
  {x: 1820, w: 100, h: 120, seed: 13},
];

const NEAR: Building[] = [
  {x: 0, w: 168, h: 250, seed: 21},
  {x: 148, w: 196, h: 320, seed: 22},
  {x: 330, w: 140, h: 210, seed: 23},
  {x: 455, w: 118, h: 270, seed: 24},
  {x: 1288, w: 170, h: 280, seed: 25},
  {x: 1440, w: 210, h: 360, seed: 26},
  {x: 1630, w: 150, h: 230, seed: 27},
  {x: 1760, w: 160, h: 300, seed: 28},
];

const mulberry32 = (seed: number) => {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

const windowsFor = (building: Building): WindowLight[] => {
  const rand = mulberry32(building.seed);
  const lights: WindowLight[] = [];
  const cols = Math.max(2, Math.floor((building.w - 24) / 28));
  const rows = Math.max(2, Math.floor((building.h - 28) / 34));
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const roll = rand();
      if (roll < 0.62) continue;
      lights.push({
        x: building.x + 14 + col * 28,
        y: GROUND - building.h + 16 + row * 34,
        on: roll > 0.82,
        cool: roll > 0.93,
        pulse: roll > 0.9,
        phase: rand() * Math.PI * 2,
      });
    }
  }
  return lights;
};

const NEAR_WINDOWS = NEAR.flatMap(windowsFor);

const RAIN = Array.from({length: 72}, (_, index) => {
  const rand = mulberry32(400 + index);
  return {
    x: rand() * 2100 - 80,
    y: rand() * 1080,
    len: 16 + rand() * 26,
    speed: 11 + rand() * 13,
    opacity: 0.04 + rand() * 0.07,
  };
});

const MOTES = Array.from({length: 14}, (_, index) => {
  const rand = mulberry32(900 + index);
  return {
    x: 80 + rand() * 420,
    y: 520 + rand() * 420,
    r: 1.2 + rand() * 2.2,
    speed: 0.25 + rand() * 0.45,
    phase: rand() * Math.PI * 2,
  };
});

const mix = (a: string, b: string, t: number) => {
  const parse = (hex: string) =>
    [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
  const pa = parse(a);
  const pb = parse(b);
  const channels = pa.map((value, i) => Math.round(value + (pb[i] - value) * t));
  return `#${channels.map((value) => value.toString(16).padStart(2, '0')).join('')}`;
};

export const City: React.FC<{
  frame: number;
  warmth: number;
  lamp: number;
}> = ({frame, warmth, lamp}) => {
  const skyTop = mix('#07091a', '#140d12', warmth);
  const skyMid = mix('#12162c', '#241610', warmth);
  const rainOpacity = 0.55 + warmth * 0.2;

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        background: `linear-gradient(180deg, ${skyTop} 0%, ${skyMid} 46%, #120e14 78%, #07060a 100%)`,
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: 1180,
          top: 90,
          width: 280,
          height: 280,
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(190,205,255,0.16) 0%, rgba(190,205,255,0) 68%)',
        }}
      />

      {FAR.map((building) => (
        <div
          key={`far-${building.seed}`}
          style={{
            position: 'absolute',
            left: building.x,
            top: GROUND - building.h - 30,
            width: building.w,
            height: building.h,
            background: mix('#17182a', '#241820', warmth * 0.4),
            opacity: 0.85,
          }}
        />
      ))}

      <svg
        width={1920}
        height={1080}
        style={{position: 'absolute', inset: 0}}
        viewBox="0 0 1920 1080"
      >
        <g transform="translate(1124 1000)">
          <polygon points="-16,0 16,0 10,-300 -10,-300" fill="#14131c" />
          <polygon points="-34,-284 34,-284 26,-318 -26,-318" fill="#1b1a26" />
          <polygon points="-2,-318 2,-318 0,-390" fill="#191822" />
        </g>
      </svg>

      {NEAR.map((building) => (
        <div
          key={`near-${building.seed}`}
          style={{
            position: 'absolute',
            left: building.x,
            top: GROUND - building.h,
            width: building.w,
            height: building.h,
            background: `linear-gradient(180deg, ${mix('#12111a', '#1a1214', warmth)} 0%, #0b0a10 100%)`,
            boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.03)',
          }}
        />
      ))}

      {NEAR_WINDOWS.map((light, index) => {
        const pulse = light.pulse ? 0.55 + 0.45 * Math.sin(frame / 28 + light.phase) : 1;
        const alpha = light.on ? 0.42 * pulse : 0.08;
        const color = light.cool ? `rgba(170,196,255,${alpha})` : `rgba(255,190,120,${alpha})`;
        return (
          <div
            key={`win-${index}`}
            style={{
              position: 'absolute',
              left: light.x,
              top: light.y,
              width: 14,
              height: 18,
              background: color,
            }}
          />
        );
      })}

      <div
        style={{
          position: 'absolute',
          right: 168,
          top: 640,
          writingMode: 'vertical-rl',
          fontFamily: 'Lyric, serif',
          fontSize: 22,
          letterSpacing: '0.42em',
          color: '#ff8fb0',
          textShadow: '0 0 10px rgba(255,90,140,0.85), 0 0 28px rgba(255,70,130,0.35)',
          opacity: 0.78,
        }}
      >
        不太热
      </div>

      <div
        style={{
          position: 'absolute',
          left: 214,
          top: 486,
          width: 18,
          height: GROUND - 486,
          background: 'linear-gradient(#2a241c, #14110e)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 196,
          top: 470,
          width: 54,
          height: 16,
          borderRadius: 8,
          background: `rgba(255, 214, 160, ${0.35 + lamp * 0.65})`,
          boxShadow: `0 0 18px rgba(255, 186, 96, ${0.4 + lamp * 0.5})`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: -40,
          top: 470,
          width: 620,
          height: 620,
          background: `radial-gradient(ellipse at 46% 0%, rgba(255,176,90,${0.34 * lamp}) 0%, rgba(255,140,60,${0.08 * lamp}) 34%, transparent 68%)`,
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          position: 'absolute',
          left: 1560,
          top: 630,
          width: 10,
          height: GROUND - 630,
          background: '#221c16',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 1548,
          top: 618,
          width: 34,
          height: 10,
          borderRadius: 6,
          background: `rgba(255, 196, 140, ${0.25 + lamp * 0.35})`,
          boxShadow: '0 0 16px rgba(255,170,90,0.4)',
        }}
      />

      {MOTES.map((mote, index) => {
        const y = mote.y - ((frame * mote.speed + mote.phase * 40) % 280);
        const x = mote.x + Math.sin(frame / 48 + mote.phase) * 10;
        return (
          <div
            key={`mote-${index}`}
            style={{
              position: 'absolute',
              left: x,
              top: y,
              width: mote.r * 2,
              height: mote.r * 2,
              borderRadius: '50%',
              background: `rgba(255, 214, 170, ${0.18 + lamp * 0.35})`,
            }}
          />
        );
      })}

      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: GROUND - 8,
          height: 120,
          background:
            'linear-gradient(180deg, rgba(20,16,18,0.2) 0%, #09080c 55%, #05050a 100%)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 120,
          top: 1012,
          width: 280,
          height: 18,
          borderRadius: '50%',
          background: `rgba(255, 176, 90, ${0.16 * lamp})`,
          filter: 'blur(6px)',
        }}
      />

      <div style={{position: 'absolute', inset: 0, opacity: rainOpacity, pointerEvents: 'none'}}>
        {RAIN.map((drop, index) => {
          const y = (drop.y + frame * drop.speed) % 1200;
          return (
            <div
              key={`rain-${index}`}
              style={{
                position: 'absolute',
                left: drop.x,
                top: y - 80,
                width: 1.2,
                height: drop.len,
                background: `rgba(214, 224, 255, ${drop.opacity})`,
                transform: 'rotate(16deg)',
              }}
            />
          );
        })}
      </div>

      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url(${staticFile('grain.png')})`,
          backgroundSize: '384px 384px',
          backgroundPosition: `${(frame * 7) % 384}px ${(frame * 11) % 384}px`,
          opacity: 0.11,
          mixBlendMode: 'overlay',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse at 50% 42%, transparent 42%, rgba(0,0,0,0.58) 100%)',
          pointerEvents: 'none',
        }}
      />
    </div>
  );
};
