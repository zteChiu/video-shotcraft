import { continueRender, delayRender, staticFile } from 'remotion';

const handle = delayRender('Load Noto SC', { timeoutInMilliseconds: 120000 });

const faces: { family: string; weight: string; file: string }[] = [
  { family: 'Noto Serif SC', weight: '600', file: 'fonts/noto-serif-sc-600.woff2' },
  { family: 'Noto Serif SC', weight: '700', file: 'fonts/noto-serif-sc-700.woff2' },
  { family: 'Noto Sans SC', weight: '400', file: 'fonts/noto-sans-sc-400.woff2' },
];

const loadFace = async (family: string, weight: string, file: string) => {
  let last: unknown;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const face = new FontFace(family, `url(${staticFile(file)})`, { weight, style: 'normal' });
      const loaded = await Promise.race([
        face.load(),
        new Promise<FontFace>((_, reject) => {
          setTimeout(() => reject(new Error(`font load timed out: ${file}`)), 8000);
        }),
      ]);
      document.fonts.add(loaded);
      return;
    } catch (error) {
      last = error;
      await new Promise((resolve) => setTimeout(resolve, 300));
    }
  }
  throw last;
};

Promise.all(faces.map((face) => loadFace(face.family, face.weight, face.file)))
  .then(() => continueRender(handle))
  .catch((error: unknown) => {
    console.error(error);
    continueRender(handle);
  });
