import { defineConfig } from 'vite';

// Headers de cross-origin isolation: requisito de SharedArrayBuffer
// para la build multihilo de FFmpeg.wasm (Fase 4).
const crossOriginIsolationHeaders = {
  'Cross-Origin-Opener-Policy': 'same-origin',
  'Cross-Origin-Embedder-Policy': 'require-corp',
};

export default defineConfig({
  server: {
    headers: crossOriginIsolationHeaders,
  },
  preview: {
    headers: crossOriginIsolationHeaders,
  },
});
