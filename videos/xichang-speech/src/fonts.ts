import { cancelRender, continueRender, delayRender, staticFile } from 'remotion';

const handle = delayRender('Noto Serif SC', { timeoutInMilliseconds: 20000 });

const finish = () => continueRender(handle);

const ready = () =>
  document.fonts.check('600 64px "Noto Serif SC"') && document.fonts.check('700 64px "Noto Serif SC"');

if (ready()) {
  finish();
} else {
  const load = (file: string, weight: string) => {
    const face = new FontFace('Noto Serif SC', `url('${staticFile(file)}') format('truetype')`, {
      weight,
      style: 'normal',
      display: 'block',
    });
    return face.load().then((loaded) => {
      document.fonts.add(loaded);
    });
  };

  Promise.all([load('fonts/NotoSerifSC-Medium.ttf', '600'), load('fonts/NotoSerifSC-Bold.ttf', '700')])
    .then(finish)
    .catch((err: unknown) => {
      if (ready()) finish();
      else cancelRender(err);
    });
}
