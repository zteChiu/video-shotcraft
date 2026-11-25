import { useEffect, useState, type FC } from 'react';
import { cancelRender, continueRender, delayRender, staticFile } from 'remotion';

const FACES: [string, string, string, string][] = [
  ['Instrument Serif', 'fonts/InstrumentSerif-Regular.woff2', '400', 'normal'],
  ['Instrument Serif', 'fonts/InstrumentSerif-Italic.woff2', '400', 'italic'],
  ['Noto Serif SC', 'fonts/NotoSerifSC-500.woff2', '500', 'normal'],
  ['Inter', 'fonts/Inter-Medium.woff2', '500', 'normal'],
  ['Inter', 'fonts/Inter-SemiBold.woff2', '600', 'normal'],
];

export const Fonts: FC = () => {
  const [handle] = useState(() => delayRender('Ferrari fonts'));
  useEffect(() => {
    let live = true;
    Promise.all(
      FACES.map(async ([family, file, weight, style]) => {
        const face = new FontFace(family, `url(${staticFile(file)})`, { weight, style });
        document.fonts.add(await face.load());
      }),
    )
      .then(() => {
        if (live) continueRender(handle);
      })
      .catch((err: unknown) => {
        cancelRender(err instanceof Error ? err : new Error(String(err)));
      });
    return () => {
      live = false;
    };
  }, [handle]);
  return null;
};
