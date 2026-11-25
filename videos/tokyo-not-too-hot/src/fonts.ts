import {useEffect, useState} from 'react';
import {continueRender, delayRender, staticFile} from 'remotion';

export const useFilmFonts = () => {
  const [handle] = useState(() => delayRender('Loading lyric fonts'));
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const faces = [
      new FontFace('Lyric', `url(${staticFile('fonts/NotoSerifSC-600.woff2')})`, {
        weight: '600',
        display: 'block',
      }),
      new FontFace('Title', `url(${staticFile('fonts/ZCOOLXiaoWei-Regular.woff2')})`, {
        weight: '400',
        display: 'block',
      }),
      new FontFace('Ui', `url(${staticFile('fonts/LiberationSans-Regular.ttf')})`, {
        weight: '400',
        display: 'block',
      }),
      new FontFace('Ui', `url(${staticFile('fonts/LiberationSans-Bold.ttf')})`, {
        weight: '700',
        display: 'block',
      }),
    ];

    Promise.all(
      faces.map((face) =>
        face.load().then((loaded) => {
          document.fonts.add(loaded);
        }),
      ),
    )
      .then(() => setReady(true))
      .catch((error) => {
        console.error(error);
      })
      .finally(() => continueRender(handle));
  }, [handle]);

  return ready;
};
