import { formatSeconds } from './timer.js';

export const LAYOUTS = {
  reel: { width: 1080, height: 1920 },
  post: { width: 1080, height: 1080 },
};

export const FPS = 30;

const MARGIN_X_RATIO = 80 / 1080;
const MARGIN_Y_RATIO = 96 / 1920;
const FONT_SIZE_RATIO = 0.18;
const SHADOW_BLUR_RATIO = 32 / 194;
const SHADOW_OFFSET_Y_RATIO = 8 / 194;
const OUTLINE_WIDTH_RATIO = 0.075;

export const BACKGROUNDS = {
  green: '#00FF00',
  black: '#000000',
};

export const FONTS = {
  orbitron: { family: 'Orbitron', weight: 700 },
  'press-start-2p': { family: '"Press Start 2P"', weight: 400 },
  sixtyfour: { family: 'Sixtyfour', weight: 400 },
  'keania-one': { family: '"Keania One"', weight: 400 },
  'big-shoulders-stencil': { family: '"Big Shoulders Stencil"', weight: 700 },
};

const DEFAULT_FONT_KEY = 'orbitron';
const SHADOW_COLOR = 'rgba(0, 0, 0, 0.75)';
const OUTLINE_COLOR = 'rgba(0, 0, 0, 0.55)';

function getFontSpec(fontKey, fontSize) {
  const config = FONTS[fontKey] ?? FONTS[DEFAULT_FONT_KEY];
  return `${config.weight} ${fontSize}px ${config.family}`;
}

function cornerAnchor(corner, width, height, marginX, marginY) {
  switch (corner) {
    case 'TR':
      return { x: width - marginX, y: marginY, align: 'right', baseline: 'top' };
    case 'BL':
      return { x: marginX, y: height - marginY, align: 'left', baseline: 'bottom' };
    case 'BR':
      return { x: width - marginX, y: height - marginY, align: 'right', baseline: 'bottom' };
    case 'TL':
    default:
      return { x: marginX, y: marginY, align: 'left', baseline: 'top' };
  }
}

export function renderFrame(ctx, t, { duration, corner, background = 'green', font = DEFAULT_FONT_KEY, width = 1080, height = 1920 }) {
  const bg = BACKGROUNDS[background] ?? BACKGROUNDS.green;
  const baseSize = Math.min(width, height);
  const fontSize = Math.round(baseSize * FONT_SIZE_RATIO);
  const marginX = Math.round(width * MARGIN_X_RATIO);
  const marginY = Math.round(height * MARGIN_Y_RATIO);
  const outlineWidth = Math.max(6, Math.round(fontSize * OUTLINE_WIDTH_RATIO));
  const shadowBlur = Math.round(fontSize * SHADOW_BLUR_RATIO);
  const shadowOffsetY = Math.round(fontSize * SHADOW_OFFSET_Y_RATIO);

  ctx.save();
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, width, height);

  const elapsed = Math.floor(t + 1e-9);
  const value = Math.max(0, duration - elapsed);
  const text = formatSeconds(value);

  const { x, y, align, baseline } = cornerAnchor(corner, width, height, marginX, marginY);

  ctx.font = getFontSpec(font, fontSize);
  ctx.textAlign = align;
  ctx.textBaseline = baseline;
  ctx.lineJoin = 'round';

  ctx.shadowColor = SHADOW_COLOR;
  ctx.shadowBlur = shadowBlur;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = shadowOffsetY;

  ctx.lineWidth = outlineWidth;
  ctx.strokeStyle = OUTLINE_COLOR;
  ctx.strokeText(text, x, y);

  ctx.shadowColor = 'transparent';
  ctx.fillStyle = '#ffffff';
  ctx.fillText(text, x, y);

  ctx.restore();
}

export function createCanvas(stage, width, height) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  stage.insertBefore(canvas, stage.firstChild);
  return canvas;
}

export function renderInitial(canvas, state) {
  const ctx = canvas.getContext('2d');
  renderFrame(ctx, 0, state);
}

/**
 * Helper para la vista previa en tiempo real: `value` son los segundos
 * restantes de la cuenta regresiva (igual que emitía timer.js).
 */
export function drawTimer(ctx, value, state) {
  const t = Math.max(0, state.duration - value);
  renderFrame(ctx, t, state);
}
