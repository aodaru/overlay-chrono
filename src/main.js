import './style.css';
import { drawTimer, createCanvas, renderInitial, FONTS, LAYOUTS } from './renderer.js';
import { createCountdown } from './timer.js';
import { exportOverlay } from './exporter.js';

const CORNERS = ['TL', 'TR', 'BL', 'BR'];
const LAYOUT_KEYS = Object.keys(LAYOUTS);
const BACKGROUNDS = ['green', 'black'];
const FONT_KEYS = Object.keys(FONTS);

const appState = {
  phase: 'idle',
  duration: 15,
  corner: 'TL',
  background: 'green',
  font: 'orbitron',
  layout: 'reel',
};

const stage = document.querySelector('#stage');
const durationInput = document.querySelector('#duration');
const playButton = document.querySelector('#play');
const hotspotButtons = Array.from(document.querySelectorAll('.hotspot'));
const bgButtons = Array.from(document.querySelectorAll('.bg-option'));
const layoutButtons = Array.from(document.querySelectorAll('.layout-option'));
const fontSelect = document.querySelector('#font');
const statusEl = document.querySelector('#status');
const statusMessage = statusEl.querySelector('.status-message');
const statusProgress = statusEl.querySelector('#status-progress');

let canvas = null;
let ctx = null;
let countdown = null;

function isValidDuration(n) {
  return Number.isInteger(n) && n >= 1 && n <= 99;
}

function parseInputDuration() {
  const raw = durationInput.value;
  if (raw === '') return null;
  const n = Number(raw);
  if (!Number.isFinite(n) || !Number.isInteger(n)) return null;
  return n;
}

function syncPlayDisabled() {
  const n = parseInputDuration();
  playButton.disabled = !(n !== null && isValidDuration(n));
}

function paintIdle() {
  if (!ctx) return;
  renderInitial(canvas, appState);
}

function applyDuration(value, { commitInput = false } = {}) {
  if (isValidDuration(value)) {
    const changed = appState.duration !== value;
    appState.duration = value;
    if (commitInput) durationInput.value = String(value);
    syncPlayDisabled();
    if (changed) paintIdle();
    return true;
  }
  syncPlayDisabled();
  return false;
}

function applyCorner(corner) {
  if (!CORNERS.includes(corner)) return;
  const changed = appState.corner !== corner;
  appState.corner = corner;
  for (const el of hotspotButtons) {
    const isActive = el.dataset.corner === corner;
    el.classList.toggle('is-active', isActive);
    el.setAttribute('aria-pressed', String(isActive));
  }
  if (changed) paintIdle();
}

function applyBackground(background) {
  if (!BACKGROUNDS.includes(background)) return;
  const changed = appState.background !== background;
  appState.background = background;
  for (const el of bgButtons) {
    const isActive = el.dataset.bg === background;
    el.classList.toggle('is-active', isActive);
    el.setAttribute('aria-pressed', String(isActive));
  }
  if (changed) paintIdle();
}

async function applyFont(font) {
  if (!FONT_KEYS.includes(font)) return;
  const changed = appState.font !== font;
  appState.font = font;
  if (fontSelect.value !== font) fontSelect.value = font;

  if (changed) {
    const { family, weight } = FONTS[font];
    await document.fonts.load(`${weight} 16px ${family}`);
    paintIdle();
  }
}

function applyLayout(layout) {
  if (!LAYOUT_KEYS.includes(layout)) return;
  const changed = appState.layout !== layout;
  appState.layout = layout;
  const res = LAYOUTS[layout];
  canvas.width = res.width;
  canvas.height = res.height;
  stage.style.aspectRatio = `${res.width} / ${res.height}`;
  for (const el of layoutButtons) {
    const isActive = el.dataset.layout === layout;
    el.classList.toggle('is-active', isActive);
    el.setAttribute('aria-pressed', String(isActive));
  }
  if (changed) paintIdle();
}

function updateStatus(percent, message) {
  statusProgress.value = percent;
  statusMessage.textContent = message;
  statusEl.setAttribute('aria-busy', 'true');
}

function resetStatus() {
  statusProgress.value = 0;
  statusMessage.textContent = 'Preparando exportación…';
  statusEl.setAttribute('aria-busy', 'false');
}

function finishExporting() {
  appState.phase = 'idle';
  document.body.classList.remove('is-running', 'is-exporting');
  resetStatus();
  paintIdle();
}

async function startExport() {
  if (appState.phase !== 'running') return;
  appState.phase = 'exporting';
  document.body.classList.add('is-exporting');

  try {
    await exportOverlay({
      canvas,
      state: appState,
      onProgress: updateStatus,
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    const msg =
      typeof error === 'string'
        ? error
        : error?.message || error?.toString?.() || 'Error desconocido';
    window.alert(`Error al exportar: ${msg}`);
  } finally {
    finishExporting();
  }
}

function onPlay() {
  if (appState.phase !== 'idle') return;
  if (!isValidDuration(appState.duration)) return;

  appState.phase = 'running';
  document.body.classList.add('is-running');
  durationInput.blur();
  playButton.blur();

  drawTimer(ctx, appState.duration, appState);

  countdown?.cancel();
  countdown = createCountdown({
    duration: appState.duration,
    onTick: (value) => drawTimer(ctx, value, appState),
    onEnd: () => {
      countdown = null;
      startExport();
    },
  });
  countdown.start();
}

function wireHotspots() {
  for (const el of hotspotButtons) {
    el.addEventListener('click', () => {
      if (appState.phase !== 'idle') return;
      applyCorner(el.dataset.corner);
    });
  }
}

function wireBackgrounds() {
  for (const el of bgButtons) {
    el.addEventListener('click', () => {
      if (appState.phase !== 'idle') return;
      applyBackground(el.dataset.bg);
    });
  }
}

function wireFont() {
  fontSelect.addEventListener('change', () => {
    if (appState.phase !== 'idle') return;
    applyFont(fontSelect.value);
  });
}

function wireLayout() {
  for (const el of layoutButtons) {
    el.addEventListener('click', () => {
      if (appState.phase !== 'idle') return;
      applyLayout(el.dataset.layout);
    });
  }
}

function wireDuration() {
  durationInput.addEventListener('input', () => {
    const n = parseInputDuration();
    if (n === null) {
      syncPlayDisabled();
      return;
    }
    if (!isValidDuration(n)) {
      syncPlayDisabled();
      return;
    }
    applyDuration(n);
  });

  durationInput.addEventListener('blur', () => {
    const n = parseInputDuration();
    if (n === null) {
      durationInput.value = String(appState.duration);
      syncPlayDisabled();
      return;
    }
    const clamped = Math.max(1, Math.min(99, n));
    applyDuration(clamped, { commitInput: true });
  });
}

async function boot() {
  if (document.fonts && typeof document.fonts.ready?.then === 'function') {
    await document.fonts.ready;
  }

  const initLayout = LAYOUTS[appState.layout];
  canvas = createCanvas(stage, initLayout.width, initLayout.height);
  ctx = canvas.getContext('2d');

  applyDuration(appState.duration, { commitInput: true });
  applyCorner(appState.corner);
  applyBackground(appState.background);
  applyLayout(appState.layout);
  await applyFont(appState.font);
  wireHotspots();
  wireBackgrounds();
  wireLayout();
  wireFont();
  wireDuration();
  playButton.addEventListener('click', onPlay);
}

boot();
