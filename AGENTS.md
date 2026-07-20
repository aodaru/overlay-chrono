# AGENTS.md — Overlay Chrono

## Project state

**Fase 0 (setup) implementada y validada** en la rama `feat/fase-0-setup-proyecto`: Vite 8 + estructura `src/` (stubs), headers COOP/COEP activos, `pnpm dev` levanta el layout base oscuro. Pendiente: primer commit/PR (Grupo 5 del plan) y Fases 1–6.

## Key constraints

- **pnpm only** — never use npm or yarn. `.npmrc` sets `save-exact=true`.
- **Duration must be exact** — never use `Date.now()`, `performance.now()`, or `MediaRecorder`. Frame `i` at `i / fps`. `N` frames @ 30 fps = `N/30` seconds exactly.
- **COOP/COEP headers** required for FFmpeg.wasm multi-thread. Configure in `vite.config.js`.
- **FFmpeg.wasm lazy-loaded** — only on first export.
- **Fonts loaded via `document.fonts.ready`** before first canvas render.

## Architecture

Vanilla JS (ES modules) + Vite. No framework.

- `src/renderer.js` — `renderFrame(ctx, t)` pure function, draws clock at instant `t`
- `src/exporter.js` — deterministic frame loop + FFmpeg.wasm → MP4 download
- `src/timer.js` — countdown logic (duration, corner)
- `src/main.js` — bootstrap, state wiring, controls

Canvas 1080×1920 @ 30 fps. Output: MP4 H.264 yuv420p, vertical 9:16, no audio.

## Specs reference

- `specs/mission.md` — product scope, what's in/out
- `specs/roadmap.md` — 7 implementation phases (F0–F6), each blocking
- `specs/tech-stack.md` — architecture decisions, verification method

Legacy MVP: `estudio_de_overlays_hiit_para_instagram_reels.html` (reference only — HIIT features are explicitly out of scope per mission.md).

## Verification

No test framework. Visual validation per phase. MP4 duration checked with `ffprobe` during dev.
