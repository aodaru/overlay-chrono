import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';
import { FPS, renderFrame } from './renderer.js';

const CORE_VERSION = '0.12.10';
const CORE_BASE_URL = `https://cdn.jsdelivr.net/npm/@ffmpeg/core-mt@${CORE_VERSION}/dist/esm`;

let ffmpegInstance = null;
let loadPromise = null;
let currentOnProgress = null;

async function loadFFmpeg() {
  const ffmpeg = new FFmpeg();

  ffmpeg.on('log', ({ message }) => {
    // eslint-disable-next-line no-console
    console.log('[ffmpeg]', message);
  });

  ffmpeg.on('progress', ({ progress }) => {
    const cb = currentOnProgress;
    if (cb) {
      const percent = Math.min(100, 50 + Math.round(progress * 50));
      cb(percent, 'Codificando MP4…');
    }
  });

  await ffmpeg.load({
    coreURL: await toBlobURL(`${CORE_BASE_URL}/ffmpeg-core.js`, 'text/javascript'),
    wasmURL: await toBlobURL(`${CORE_BASE_URL}/ffmpeg-core.wasm`, 'application/wasm'),
    workerURL: await toBlobURL(`${CORE_BASE_URL}/ffmpeg-core.worker.js`, 'text/javascript'),
  });

  return ffmpeg;
}

async function getFFmpeg() {
  if (ffmpegInstance?.loaded) return ffmpegInstance;
  if (loadPromise) return loadPromise;
  loadPromise = loadFFmpeg().catch((error) => {
    loadPromise = null;
    throw error;
  });
  ffmpegInstance = await loadPromise;
  loadPromise = null;
  return ffmpegInstance;
}

function padFrame(n) {
  return String(n).padStart(3, '0');
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  // Liberar el objeto URL después de que el navegador inicie la descarga.
  setTimeout(() => URL.revokeObjectURL(url), 60000);
}

/**
 * Genera y descarga el MP4 de la cuenta regresiva.
 *
 * @param {object} options
 * @param {HTMLCanvasElement} options.canvas — canvas de 1080×1920
 * @param {object} options.state — { duration, corner, background }
 * @param {function(number, string): void} [options.onProgress] — (percent, message)
 * @returns {Promise<{ url: string, filename: string, duration: number }>}
 */
export async function exportOverlay({ canvas, state, onProgress }) {
  const totalFrames = Math.round(state.duration * FPS);

  // Aviso de primera carga pesada: el core de FFmpeg.wasm pesa ~31 MB.
  if (!ffmpegInstance?.loaded) {
    onProgress?.(0, 'Cargando FFmpeg por primera vez (~31 MB)…');
  }

  const ffmpeg = await getFFmpeg();
  const ctx = canvas.getContext('2d');

  // Renderizado determinístico: frame i en el instante exacto i / 30 s.
  onProgress?.(0, 'Renderizando frames…');
  for (let i = 0; i < totalFrames; i += 1) {
    const t = i / FPS;
    renderFrame(ctx, t, state);

    const blob = await new Promise((resolve) => {
      canvas.toBlob(resolve, 'image/png');
    });
    if (!blob) {
      throw new Error('No se pudo generar el PNG de un frame.');
    }

    const data = await fetchFile(blob);
    await ffmpeg.writeFile(`frame_${padFrame(i + 1)}.png`, data);

    const percent = Math.round(((i + 1) / totalFrames) * 50);
    onProgress?.(percent, `Renderizando frame ${i + 1} de ${totalFrames}`);
  }

  onProgress?.(50, 'Codificando MP4…');
  currentOnProgress = onProgress;

  let exitCode;
  try {
    exitCode = await ffmpeg.exec([
      '-framerate', String(FPS),
      '-i', 'frame_%03d.png',
      '-c:v', 'libx264',
      '-pix_fmt', 'yuv420p',
      '-preset', 'ultrafast',
      '-movflags', '+faststart',
      '-an',
      '-y',
      'output.mp4',
    ]);
  } finally {
    currentOnProgress = null;
  }

  if (exitCode !== 0) {
    throw new Error(`FFmpeg terminó con código ${exitCode}.`);
  }

  const data = await ffmpeg.readFile('output.mp4');
  const buffer = data.buffer ? data.buffer : data;
  const blob = new Blob([buffer], { type: 'video/mp4' });

  const filename = `overlay-chrono-${state.duration}s-${state.layout}.mp4`;
  downloadBlob(blob, filename);

  // Limpieza del FS virtual.
  for (let i = 0; i < totalFrames; i += 1) {
    await ffmpeg.deleteFile(`frame_${padFrame(i + 1)}.png`);
  }
  await ffmpeg.deleteFile('output.mp4');

  return {
    url: URL.createObjectURL(blob),
    filename,
    duration: state.duration,
  };
}
