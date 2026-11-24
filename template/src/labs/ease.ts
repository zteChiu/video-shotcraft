import { Easing } from 'remotion';

export const press = Easing.bezier(0.2, 0.7, 0.25, 1);
export const rise = Easing.bezier(0.16, 1, 0.3, 1);
export const settle = Easing.bezier(0.4, 0, 0.15, 1);

export const SANS = 'Inter, "Helvetica Neue", Arial, sans-serif';
export const SERIF = '"Liberation Serif", "Noto Serif", Georgia, serif';
export const CJK = '"WenQuanYi Micro Hei", "Droid Sans Fallback", sans-serif';
