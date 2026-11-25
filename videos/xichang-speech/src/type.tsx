import type { FC } from 'react';

export const Mark: FC<{ text: string; mark?: string; color: string }> = ({ text, mark, color }) => {
  if (!mark) return <>{text}</>;
  const i = text.indexOf(mark);
  if (i < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, i)}
      <span style={{ color }}>{mark}</span>
      {text.slice(i + mark.length)}
    </>
  );
};
