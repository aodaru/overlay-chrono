import './style.css';
import { drawTimer, createCanvas, renderInitial } from './renderer.js';
import { createCountdown } from './timer.js';

const CORNERS = ['TL', 'TR', 'BL', 'BR'];

const appState = {
  phase: 'idle',
  duration: 15,
  corner: 'TL',
};

const stage = document.querySelector('#stage');
const durationInput = document.querySelector('#duration');
const playButton = document.querySelector('#play');
const hotspotButtons = Array.from(document.querySelectorAll('.hotspot'));

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

function onPlay() {
  if (appState.phase !== 'idle') return;
  if (!isValidDuration(appState.duration)) return;

  appState.phase = 'running';
  document.body.classList.add('is-running');
  durationInput.blur();
  playButton.blur();

  drawTimer(ctx, appState.duration, appState.corner);

  countdown?.cancel();
  countdown = createCountdown({
    duration: appState.duration,
    onTick: (value) => drawTimer(ctx, value, appState.corner),
    onEnd: () => {
      appState.phase = 'idle';
      document.body.classList.remove('is-running');
      countdown = null;
      paintIdle();
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

  canvas = createCanvas(stage);
  ctx = canvas.getContext('2d');

  applyDuration(appState.duration, { commitInput: true });
  applyCorner(appState.corner);
  paintIdle();
  wireHotspots();
  wireDuration();
  playButton.addEventListener('click', onPlay);
}

boot();
