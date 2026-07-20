import { formatSeconds } from './timer.js';

export const WIDTH = 1080;
export const HEIGHT = 1920;
export const MARGIN = 80;

const FONT_FAMILY =
  "ui-monospace, SFMono-Regular, Menlo, 'Liberation Mono', 'Courier New', monospace";
const FONT_SIZE = Math.round(WIDTH * 0.14);

function cornerAnchor(corner) {
  switch (corner) {
    case 'TR':
      return { x: WIDTH - MARGIN, y: MARGIN, align: 'right', baseline: 'top' };
    case 'BL':
      return { x: MARGIN, y: HEIGHT - MARGIN, align: 'left', baseline: 'bottom' };
    case 'BR':
      return { x: WIDTH - MARGIN, y: HEIGHT - MARGIN, align: 'right', baseline: 'bottom' };
    case 'TL':
    default:
      return { x: MARGIN, y: MARGIN, align: 'left', baseline: 'top' };
  }
}

export function drawTimer(ctx, value, corner) {
  ctx.save();
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  const { x, y, align, baseline } = cornerAnchor(corner);
  const text = formatSeconds(value);

  ctx.font = `700 ${FONT_SIZE}px ${FONT_FAMILY}`;
  ctx.textAlign = align;
  ctx.textBaseline = baseline;

  ctx.shadowColor = 'rgba(0, 0, 0, 0.65)';
  ctx.shadowBlur = 24;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 6;
  ctx.fillStyle = '#ffffff';
  ctx.fillText(text, x, y);

  ctx.restore();
}

export function createCanvas(stage) {
  const canvas = document.createElement('canvas');
  canvas.width = WIDTH;
  canvas.height = HEIGHT;
  stage.insertBefore(canvas, stage.firstChild);
  return canvas;
}

export function renderInitial(canvas, state) {
  const ctx = canvas.getContext('2d');
  drawTimer(ctx, state.duration, state.corner);
}
