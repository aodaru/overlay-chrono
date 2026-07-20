# Requisitos — Setup del proyecto (Fase 0)

## Alcance

Puesta en marcha del esqueleto de la aplicación según `specs/roadmap.md` → Fase 0 y la estructura objetivo de `specs/tech-stack.md`. Al terminar, `pnpm dev` levanta y muestra el layout base vacío sobre fondo oscuro. No hay canvas, controles ni lógica de reloj: son fases posteriores.

### Incluido

- Inicialización con **pnpm** (único gestor permitido, ver `tech-stack.md` → Reglas de seguridad): `package.json`, `pnpm-lock.yaml`.
- Vite como devDependency con versión exacta (`.npmrc` ya tiene `save-exact=true`).
- `vite.config.js` con headers COOP/COEP en dev y preview.
- Estructura de carpetas objetivo: `index.html`, `src/main.js`, `src/timer.js`, `src/renderer.js`, `src/exporter.js` (stubs sin lógica).
- CSS plano base oscuro; layout base vacío visible en el navegador.
- `.gitignore` (`node_modules/`, `dist/`, etc.).
- `README.md` actualizado con instrucciones de arranque (se mantiene como spec de producto; el MVP HTML queda como referencia visual legada).

### No incluido

- Canvas 1080×1920 ni vista previa 9:16 (Fase 1).
- Controles de duración/esquina/Play ni cuenta regresiva (Fase 1).
- Selector de fondo verde/negro (Fase 2).
- `renderFrame(ctx, t)` real ni bucle determinístico (Fase 3).
- FFmpeg.wasm, exportación MP4 ni descarga de `@ffmpeg/*` (Fase 4): solo se dejan los headers listos.
- Fuentes tipográficas digitales (Fase 6).
- Frameworks, Tailwind, preprocesadores, tests (ver `tech-stack.md`).

## Decisiones

| ID | Decisión | Racional | Alternativa descartada |
|----|----------|----------|------------------------|
| D1 | El criterio de salida se verifica con `pnpm dev` (no `npm run dev` como dice literalmente el roadmap) | `tech-stack.md` prohíbe npm/yarn; el roadmap es anterior a esa regla | Ejecutar con npm — descartado, rompe la regla de seguridad |
| D2 | Configurar los headers COOP/COEP ya, en Fase 0 | Son requisito de FFmpeg.wasm multihilo (Fase 4); cuestan 5 líneas y conviene detectar efectos colaterales desde el principio | Dejarlos para Fase 4 — posponer un riesgo conocido sin beneficio |
| D3 | Los 4 módulos de `src/` se crean como stubs placeholder | Fija la estructura objetivo de `tech-stack.md` desde el primer commit sin implementar lógica de fases futuras | Crear solo `main.js` y añadir módulos al llegar a cada fase — difumina la arquitectura acordada |
| D4 | Vanilla JS + CSS plano, sin framework | Decisión ya tomada en `tech-stack.md`; Fase 0 solo la materializa | React/Vue/Tailwind — fuera de la constitución del proyecto |
| D5 | El MVP HTML legado (`estudio_de_overlays_hiit_para_instagram_reels.html`) se conserva intacto como referencia visual | El roadmap lo declara referencia legada; no se toca en esta fase | Borrarlo o migrarlo — fuera de alcance |

## Contexto

- **Estado del repo**: pre-implementación. Solo existen `specs/`, `AGENTS.md`, `README.md`, `.npmrc` y el MVP HTML legado. Sin commits aún.
- **Rama de trabajo**: `feat/fase-0-setup-proyecto` (primer commit del repo se hará en esta rama).
- **Stack acordado**: ver `specs/tech-stack.md` — Vanilla JS (módulos ES) + Vite, Canvas 2D 1080×1920 @ 30 fps, FFmpeg.wasm, salida MP4 H.264 `yuv420p`.
- **Producto**: ver `specs/mission.md` — overlay de cuenta regresiva para Reels, 100% en el navegador, duración exacta.
- **Headers requeridos** (para `SharedArrayBuffer` / cross-origin isolation, Fase 4):
  - `Cross-Origin-Opener-Policy: same-origin`
  - `Cross-Origin-Embedder-Policy: require-corp`

## Dependencias

- **Ninguna**: es la primera fase del roadmap.
- **Bloquea a**: Fases 1–6 (todas asumen el proyecto Vite levantando).

## Riesgos identificados

| Riesgo | Mitigación |
|--------|------------|
| COEP `require-corp` puede bloquear recursos externos futuros (p. ej. fuentes por CDN en Fase 6) | Alojar las fuentes localmente o servir con `Cross-Origin-Resource-Policy` adecuada; mejor descubrirlo ahora |
| El scaffolding por defecto de Vite/`create-vite` deja boilerplate de demo (contador, logos) | Crear los archivos manualmente o limpiar el scaffold: el layout final debe quedar vacío |
| Versiones flotantes de dependencias | `save-exact=true` ya fijado en `.npmrc`; commitear `pnpm-lock.yaml` |
| Suciedad del primer commit (node_modules, dist) | `.gitignore` se crea en el Grupo 1, antes de cualquier commit |
