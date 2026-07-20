import { formatSeconds } from './timer.js';

export const WIDTH = 1080;
export const HEIGHT = 1920;
export const FPS = 30;

// Distancia del reloj a los bordes del encuadre vertical 9:16.
const MARGIN_X = 80;
const MARGIN_Y = 96;

// El reloj ocupa ~18 % del ancho del canvas.
const FONT_SIZE = Math.round(WIDTH * 0.18);

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

function getFontSpec(fontKey) {
  const config = FONTS[fontKey] ?? FONTS[DEFAULT_FONT_KEY];
  return `${config.weight} ${FONT_SIZE}px ${config.family}`;
}

const SHADOW_COLOR = 'rgba(0, 0, 0, 0.75)';
const SHADOW_BLUR = 32;
const SHADOW_OFFSET_Y = 8;
const OUTLINE_COLOR = 'rgba(0, 0, 0, 0.55)';
const OUTLINE_WIDTH = Math.max(6, Math.round(FONT_SIZE * 0.075));

function cornerAnchor(corner) {
  switch (corner) {
    case 'TR':
      return {
        x: WIDTH - MARGIN_X,
        y: MARGIN_Y,
        align: 'right',
        baseline: 'top',
      };
    case 'BL':
      return {
        x: MARGIN_X,
        y: HEIGHT - MARGIN_Y,
        align: 'left',
        baseline: 'bottom',
      };
    case 'BR':
      return {
        x: WIDTH - MARGIN_X,
        y: HEIGHT - MARGIN_Y,
        align: 'right',
        baseline: 'bottom',
      };
    case 'TL':
    default:
      return {
        x: MARGIN_X,
        y: MARGIN_Y,
        align: 'left',
        baseline: 'top',
      };
  }
}

/**
 * Dibuja un fotograma puro del overlay en el instante `t` (segundos).
 * No depende de relojes de pared: el mismo `t` siempre produce el mismo píxel.
 *
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} t — instante en segundos, 0 <= t < duration
 * @param {object} state — { duration, corner, background }
 */
export function renderFrame(ctx, t, { duration, corner, background = 'green', font = DEFAULT_FONT_KEY }) {
  const bg = BACKGROUNDS[background] ?? BACKGROUNDS.green;

  ctx.save();
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  // Valor entero visible de la cuenta regresiva en el instante t.
  // t=0.0 → duration; t=0.999 → duration; t=1.0 → duration-1.
  const elapsed = Math.floor(t + 1e-9);
  const value = Math.max(0, duration - elapsed);
  const text = formatSeconds(value);

  const { x, y, align, baseline } = cornerAnchor(corner);

  ctx.font = getFontSpec(font);
  ctx.textAlign = align;
  ctx.textBaseline = baseline;
  ctx.lineJoin = 'round';

  // Halo oscuro + contorno para legibilidad sobre cualquier video de fondo.
  ctx.shadowColor = SHADOW_COLOR;
  ctx.shadowBlur = SHADOW_BLUR;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = SHADOW_OFFSET_Y;

  ctx.lineWidth = OUTLINE_WIDTH;
  ctx.strokeStyle = OUTLINE_COLOR;
  ctx.strokeText(text, x, y);

  // Relleno blanco limpio encima del halo.
  ctx.shadowColor = 'transparent';
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
