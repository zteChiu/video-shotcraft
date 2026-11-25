import {AbsoluteFill, Audio, staticFile, useCurrentFrame} from 'remotion';
import envelope from './envelope.json';
import {useFilmFonts} from './fonts';
import {City} from './City';
import {DURATION_SEC, LINES, LyricLine, lineIndexAt} from './lyrics';

const LEVELS: number[] = envelope;

const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(max, value));

const easeOut = (value: number) => 1 - Math.pow(1 - clamp(value, 0, 1), 3);

const fmt = (time: number) => {
  const safe = Math.max(0, time);
  const minutes = Math.floor(safe / 60);
  const seconds = Math.floor(safe % 60);
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

const warmthFor = (kind: LyricLine['kind'] | 'night') => {
  if (kind === 'hook') return 0.28;
  if (kind === 'chat') return 0.48;
  if (kind === 'bridge') return 0.16;
  return 0.86;
};

const CharLine: React.FC<{
  text: string;
  progress: number;
  size: number;
  color: string;
  family?: string;
  tracking?: string;
  weight?: number;
}> = ({text, progress, size, color, family = 'Lyric, serif', tracking = '0.08em', weight = 600}) => {
  const chars = Array.from(text);
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        fontFamily: family,
        fontWeight: weight,
        fontSize: size,
        letterSpacing: tracking,
        color,
        lineHeight: 1.12,
        textShadow: '0 2px 18px rgba(0,0,0,0.55)',
        whiteSpace: 'nowrap',
      }}
    >
      {chars.map((char, index) => {
        const start = Math.min(index * 0.035, 0.38);
        const shown = easeOut((progress - start) / 0.62);
        return (
          <span
            key={`${char}-${index}`}
            style={{
              display: 'inline-block',
              opacity: shown,
              transform: `translateY(${(1 - shown) * 20}px)`,
            }}
          >
            {char}
          </span>
        );
      })}
    </div>
  );
};

const roundOf = (index: number, kind: LyricLine['kind']) => {
  let count = 0;
  for (let i = 0; i <= index; i++) {
    if (LINES[i].kind === kind) count += 1;
  }
  return Math.floor((count - 1) / (kind === 'hook' ? 4 : 6));
};

const Photo: React.FC<{
  local: number;
  duration: number;
  faded: boolean;
}> = ({local, duration, faded}) => {
  const enter = easeOut(clamp(local / 0.5, 0, 1));
  const fade = clamp((local - duration * 0.5) / (duration * 0.4), 0, 1);
  return (
    <div
      style={{
        position: 'absolute',
        right: 128,
        top: 250,
        width: 286,
        opacity: enter * (1 - fade * 0.62),
        transform: `translateY(${(1 - enter) * 18}px) rotate(${faded ? 5 : -6.5}deg)`,
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: -16,
          left: '50%',
          width: 74,
          height: 22,
          transform: 'translateX(-50%) rotate(-3deg)',
          background: 'rgba(255, 232, 190, 0.42)',
        }}
      />
      <div
        style={{
          background: '#f3eee4',
          padding: '14px 14px 52px',
          boxShadow: '0 22px 50px rgba(0,0,0,0.42)',
        }}
      >
        <div
          style={{
            height: 236,
            background: faded
              ? 'linear-gradient(180deg, #c9b5a4 0%, #9aa4ae 46%, #596372 100%)'
              : 'radial-gradient(circle at 72% 28%, rgba(255,228,186,0.95), transparent 26%), linear-gradient(180deg, #f3b48a 0%, #e8c6a4 30%, #7f9cb8 64%, #3c4d66 100%)',
          }}
        />
        <div
          style={{
            marginTop: 14,
            textAlign: 'center',
            fontFamily: 'Lyric, serif',
            fontSize: 16,
            letterSpacing: '0.28em',
            color: '#6d5e50',
          }}
        >
          去年夏天
        </div>
      </div>
    </div>
  );
};

const Smoke: React.FC<{frame: number; opacity: number}> = ({frame, opacity}) => (
  <div style={{position: 'absolute', inset: 0, opacity, pointerEvents: 'none'}}>
    {[0, 1, 2, 3].map((index) => {
      const y = 560 - ((frame * (0.55 + index * 0.18) + index * 70) % 240);
      const x = 780 + index * 86 + Math.sin(frame / 36 + index) * 16;
      return (
        <div
          key={index}
          style={{
            position: 'absolute',
            left: x,
            top: y,
            width: 170 - index * 18,
            height: 64,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.1)',
            filter: 'blur(14px)',
          }}
        />
      );
    })}
  </div>
);

const Tag: React.FC<{tag: 'NaYo' | 'Ayo'}> = ({tag}) => (
  <span
    style={{
      display: 'inline-block',
      marginLeft: 16,
      padding: '5px 12px 6px',
      borderRadius: 999,
      background: tag === 'Ayo' ? 'rgba(150, 186, 255, 0.16)' : 'rgba(255, 112, 158, 0.18)',
      color: tag === 'Ayo' ? '#d5e4ff' : '#ffc0d4',
      fontFamily: 'Ui, sans-serif',
      fontSize: 18,
      letterSpacing: '0.12em',
      transform: 'translateY(-6px)',
    }}
  >
    {tag}
  </span>
);

const ChatPanel: React.FC<{
  line: LyricLine;
  index: number;
  enter: number;
  local: number;
}> = ({line, index, enter, local}) => {
  const previous = index > 0 && LINES[index - 1].kind === 'chat' ? LINES[index - 1] : null;
  const run = roundOf(index, 'chat');
  const shift = [-20, 36, -8, 24][run] ?? 0;
  const chime = line.text.startsWith('叮当当');
  const ring = clamp(local / 0.7, 0, 1);

  return (
    <div
      style={{
        position: 'absolute',
        left: '50%',
        top: 268,
        width: 900,
        transform: `translateX(calc(-50% + ${shift}px)) translateY(${(1 - enter) * 16}px)`,
        opacity: enter,
      }}
    >
      <div
        style={{
          borderRadius: 30,
          padding: '26px 34px 32px',
          background: 'linear-gradient(180deg, rgba(28,24,40,0.94), rgba(14,12,22,0.92))',
          border: '1px solid rgba(255,255,255,0.12)',
          boxShadow: '0 30px 70px rgba(0,0,0,0.45)',
        }}
      >
        <div style={{display: 'flex', alignItems: 'center', gap: 14, marginBottom: 26}}>
          <div
            style={{
              width: 42,
              height: 42,
              borderRadius: '50%',
              background: 'linear-gradient(140deg, #ffb15a, #ff6d9a)',
            }}
          />
          <div style={{fontFamily: 'Lyric, serif', fontSize: 22, letterSpacing: '0.18em'}}>他</div>
          <div style={{flex: 1}} />
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              border: '1px solid rgba(255,177,90,0.45)',
              color: '#ffb15a',
              fontFamily: 'Ui, sans-serif',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            Q
          </div>
        </div>
        {chime ? (
          <div style={{height: 28, marginBottom: 8, position: 'relative'}}>
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  left: 8 + i * 22,
                  top: 8,
                  width: 10 + ring * (18 + i * 10),
                  height: 10 + ring * (18 + i * 10),
                  marginLeft: -(ring * (9 + i * 5)),
                  marginTop: -(ring * (9 + i * 5)),
                  borderRadius: '50%',
                  border: '1.5px solid rgba(255,177,90,0.7)',
                  opacity: (1 - ring) * (i === 0 ? 1 : 0.7),
                }}
              />
            ))}
          </div>
        ) : null}
        {previous ? (
          <div
            style={{
              marginBottom: 16,
              fontFamily: 'Lyric, serif',
              fontSize: 26,
              letterSpacing: '0.06em',
              color: 'rgba(244,234,216,0.38)',
            }}
          >
            {previous.text}
            {previous.tag ? (
              <span style={{marginLeft: 10, fontFamily: 'Ui, sans-serif', fontSize: 16}}>
                {previous.tag}
              </span>
            ) : null}
          </div>
        ) : null}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            maxWidth: '100%',
            padding: '16px 22px',
            borderRadius: '8px 22px 22px 22px',
            background: 'rgba(255,177,90,0.1)',
            border: '1px solid rgba(255,177,90,0.28)',
            fontFamily: 'Lyric, serif',
            fontSize: 40,
            letterSpacing: '0.04em',
            color: '#f6efe4',
            textShadow: '0 2px 12px rgba(0,0,0,0.35)',
          }}
        >
          <span>{line.text}</span>
          {line.tag ? <Tag tag={line.tag} /> : null}
        </div>
      </div>
    </div>
  );
};

const Vinyl: React.FC<{frame: number; opacity: number}> = ({frame, opacity}) => (
  <div
    style={{
      position: 'absolute',
        left: '50%',
        top: 408,
        width: 460,
        height: 460,
        marginLeft: -230,
      opacity,
    }}
  >
    <div
      style={{
        position: 'absolute',
        inset: 0,
        borderRadius: '50%',
        background:
          'repeating-radial-gradient(circle at 50% 50%, #1a1612 0 2px, #0d0b09 3px 6px)',
        boxShadow: '0 30px 80px rgba(0,0,0,0.5), inset 0 0 40px rgba(0,0,0,0.55)',
        transform: `rotate(${frame * 0.45}deg)`,
      }}
    />
    <div
      style={{
        position: 'absolute',
        inset: 0,
        borderRadius: '50%',
        background:
          'linear-gradient(120deg, rgba(255,255,255,0.16), transparent 40%, transparent 62%, rgba(255,255,255,0.05))',
      }}
    />
    <div
      style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        width: 132,
        height: 132,
        marginLeft: -66,
        marginTop: -66,
        borderRadius: '50%',
        background: 'radial-gradient(circle at 40% 35%, #e07a8a, #9a3d52 70%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Lyric, serif',
        fontSize: 20,
        letterSpacing: '0.22em',
        color: '#fff6f2',
      }}
    >
      回忆
    </div>
  </div>
);

const Timeline: React.FC<{t: number; opacity: number}> = ({t, opacity}) => {
  const progress = clamp((t - 142.41) / (158.27 - 142.41), 0, 1);
  const label = clamp((t - 152.8) / 0.4, 0, 1);
  return (
    <div
      style={{
        position: 'absolute',
        left: '50%',
        top: 952,
        width: 760,
        marginLeft: -380,
        opacity,
      }}
    >
      <div
        style={{
          marginBottom: 12,
          fontFamily: 'Lyric, serif',
          fontSize: 14,
          letterSpacing: '0.42em',
          color: `rgba(255,177,90,${0.35 + label * 0.6})`,
        }}
      >
        时间轴
      </div>
      <div style={{position: 'relative', height: 2, background: 'rgba(244,234,216,0.2)'}}>
        <div
          style={{
            width: `${progress * 100}%`,
            height: '100%',
            background: '#ffb15a',
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: `${progress * 100}%`,
            top: -5,
            width: 12,
            height: 12,
            marginLeft: -6,
            background: '#f4ead8',
            transform: 'rotate(45deg)',
          }}
        />
      </div>
    </div>
  );
};

const LyricStage: React.FC<{
  index: number;
  t: number;
  frame: number;
}> = ({index, t, frame}) => {
  const line = LINES[index];
  const next = LINES[index + 1]?.t ?? DURATION_SEC;
  const local = t - line.t;
  const duration = Math.max(0.4, next - line.t);
  const enterDur = Math.min(0.45, duration * 0.24);
  const exitDur = Math.min(0.32, duration * 0.18);
  const enter = easeOut(clamp(local / enterDur, 0, 1));
  const exit = easeOut(clamp((local - (duration - exitDur)) / exitDur, 0, 1));
  const hold = 1 - exit;

  if (line.kind === 'chat') {
    return <ChatPanel line={line} index={index} enter={enter * hold} local={local} />;
  }

  if (line.kind === 'bridge') {
    const bridgeIn = easeOut(clamp((t - 142.41) / 0.6, 0, 1));
    return (
      <>
        <Vinyl frame={frame} opacity={bridgeIn * (t < 158.1 ? 1 : hold)} />
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 228,
            display: 'flex',
            justifyContent: 'center',
            opacity: hold,
            transform: `translateY(${-16 * exit}px)`,
          }}
        >
          <CharLine text={line.text} progress={enter} size={72} color="#f7f1e6" />
        </div>
        <Timeline t={t} opacity={bridgeIn} />
      </>
    );
  }

  const hookRound = line.kind === 'hook' ? roundOf(index, 'hook') : 0;
  const size = line.kind === 'hook' ? [74, 78, 82, 88][hookRound] ?? 78 : 70;
  const color = line.tone === 'cold' ? '#f6e7ee' : '#f7f1e6';
  const rule = line.tone === 'cold' ? '#e7a4ba' : '#ffb15a';
  const photoCount = LINES.slice(0, index + 1).filter((item) => item.motif === 'photo').length;

  return (
    <>
      {line.motif === 'photo' ? (
        <Photo local={local} duration={duration} faded={photoCount > 1} />
      ) : null}
      {line.motif === 'smoke' ? <Smoke frame={frame} opacity={enter * hold} /> : null}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: line.kind === 'hook' ? 392 : 408,
          display: 'flex',
          justifyContent: 'center',
          marginRight: line.motif === 'photo' ? 300 : 0,
          opacity: hold,
          transform: `translateY(${-18 * exit}px)`,
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: '50%',
            width: 1280,
            height: 220,
            top: -40,
            marginLeft: -640,
            background: 'radial-gradient(ellipse, rgba(0,0,0,0.34), transparent 70%)',
            pointerEvents: 'none',
          }}
        />
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative'}}>
          {line.lead ? (
            <div
              style={{
                alignSelf: 'flex-start',
                marginBottom: 10,
                fontFamily: 'Ui, sans-serif',
                fontSize: 18,
                letterSpacing: '0.34em',
                color: 'rgba(255, 184, 206, 0.9)',
                opacity: enter,
              }}
            >
              OH
            </div>
          ) : null}
          <CharLine text={line.text} progress={enter} size={size} color={color} />
          <div
            style={{
              marginTop: 18,
              height: 2,
              width: '100%',
              background: rule,
              transform: `scaleX(${enter})`,
              transformOrigin: 'center',
              opacity: 0.9,
            }}
          />
        </div>
      </div>
    </>
  );
};

const TitleCard: React.FC<{t: number}> = ({t}) => {
  const title = easeOut(clamp((t - 2.06) / 1.05, 0, 1));
  const creditA = easeOut(clamp((t - 7.96) / 0.55, 0, 1));
  const creditB = easeOut(clamp((t - 14.09) / 0.55, 0, 1));
  const leave = easeOut(clamp((t - 19.9) / 0.5, 0, 1));
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: 140,
        opacity: 1 - leave,
        transform: `translateY(${-20 * leave}px)`,
      }}
    >
      <CharLine
        text="东京不太热"
        progress={title}
        size={138}
        color="#f7f1e6"
        family="Title, Lyric, serif"
        tracking="0.16em"
        weight={400}
      />
      <div
        style={{
          marginTop: 26,
          fontFamily: 'Ui, sans-serif',
          fontSize: 16,
          letterSpacing: '0.46em',
          color: 'rgba(255,177,90,0.92)',
          opacity: title,
        }}
      >
        TOKYO ISN&apos;T TOO HOT
      </div>
      <div style={{marginTop: 64, minHeight: 116, display: 'flex', flexDirection: 'column', gap: 16}}>
        {[
          {sub: '翻唱', name: '封茗囧菌', shown: creditA},
          {sub: '原唱', name: '洛天依', shown: creditB},
        ].map((credit) => (
          <div
            key={credit.sub}
            style={{
              display: 'flex',
              alignItems: 'baseline',
              justifyContent: 'center',
              gap: 18,
              opacity: credit.shown,
              transform: `translateY(${(1 - credit.shown) * 10}px)`,
            }}
          >
            <span
              style={{
                fontFamily: 'Lyric, serif',
                fontSize: 16,
                letterSpacing: '0.42em',
                color: '#ffb15a',
              }}
            >
              {credit.sub}
            </span>
            <span
              style={{
                fontFamily: 'Lyric, serif',
                fontSize: 36,
                letterSpacing: '0.14em',
                color: '#f4ead8',
              }}
            >
              {credit.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export const Film: React.FC = () => {
  useFilmFonts();
  const frame = useCurrentFrame();
  const t = frame / 30;
  const index = lineIndexAt(t);
  const line = index >= 0 ? LINES[index] : null;
  const kind = line?.kind ?? 'night';
  const local = line ? t - line.t : 0;
  const previousKind = index > 0 ? LINES[index - 1].kind : kind;
  const blend = easeOut(clamp(local / 0.8, 0, 1));
  const warmth = warmthFor(previousKind) + (warmthFor(kind) - warmthFor(previousKind)) * blend;
  const level = LEVELS[Math.min(frame, LEVELS.length - 1)] ?? 0;
  const lampOn = easeOut(clamp((t - 0.25) / 1.7, 0, 1));
  const lampBoost = line?.motif === 'lamp' ? 0.18 : 0;
  const lamp = lampOn * (0.74 + level * 0.22 + lampBoost);
  const open = easeOut(clamp(t / 1.15, 0, 1));
  const end = 1 - easeOut(clamp((t - 223.15) / 1.7, 0, 1));
  const chrome = easeOut(clamp((t - 4.2) / 0.6, 0, 1)) * (t < 20.44 ? 1 : 1);
  const titleMode = t < 20.44;

  return (
    <AbsoluteFill style={{background: '#000'}}>
      <AbsoluteFill style={{opacity: open * end}}>
        <City frame={frame} warmth={warmth} lamp={lamp} />
        {titleMode ? <TitleCard t={t} /> : null}
        {!titleMode && index >= 0 ? <LyricStage index={index} t={t} frame={frame} /> : null}
        <div style={{position: 'absolute', inset: 0, opacity: chrome, pointerEvents: 'none'}}>
          {t >= 20.44 ? (
            <div
              style={{
                position: 'absolute',
                left: 42,
                top: 72,
                writingMode: 'vertical-rl',
                fontFamily: 'Lyric, serif',
                fontSize: 18,
                letterSpacing: '0.48em',
                color: 'rgba(244,234,216,0.62)',
              }}
            >
              东京不太热
            </div>
          ) : null}
          <div
            style={{
              position: 'absolute',
              top: 36,
              right: 48,
              fontFamily: 'Ui, sans-serif',
              fontSize: 18,
              letterSpacing: '0.16em',
              color: 'rgba(244,234,216,0.78)',
            }}
          >
            {fmt(t)}
          </div>
          <div style={{position: 'absolute', left: 72, right: 72, bottom: 34}}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: 10,
                fontFamily: 'Lyric, serif',
                fontSize: 14,
                letterSpacing: '0.28em',
                color: 'rgba(244,234,216,0.62)',
              }}
            >
              <span>东京不太热</span>
              <span>封茗囧菌</span>
            </div>
            <div style={{height: 2, background: 'rgba(255,255,255,0.14)'}}>
              <div
                style={{
                  width: `${clamp(t / DURATION_SEC, 0, 1) * 100}%`,
                  height: '100%',
                  background: '#ffb15a',
                }}
              />
            </div>
          </div>
        </div>
      </AbsoluteFill>
      <Audio src={staticFile('audio/song.mp3')} />
    </AbsoluteFill>
  );
}
