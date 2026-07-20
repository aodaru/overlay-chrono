# Tech Stack — Overlay Chrono

## Decisiones

| Capa        | Decisión                                             | Por qué                                                                        |
| ----------- | ---------------------------------------------------- | ------------------------------------------------------------------------------ |
| App         | Vanilla JS (módulos ES) + Vite                       | Fiel a la simplicidad del MVP, con build moderno y mantenible. Sin framework.  |
| Estilos     | CSS plano                                            | La UI es mínima; no justifica Tailwind ni preprocesadores.                     |
| Render      | Canvas 2D, 1080×1920 @ 30 fps                        | Dibujo determinístico del reloj; la vista previa es el propio canvas escalado. |
| Exportación | FFmpeg.wasm (`@ffmpeg/ffmpeg` + `@ffmpeg/core`)      | MP4 H.264 frame-exacto, 100% cliente, sin servidor.                            |
| Salida      | MP4 (H.264, `yuv420p`), 1080×1920, 30 fps, sin audio | Estándar Instagram Reels; máxima compatibilidad con editores.                  |

## Arquitectura en una frase

Una función pura `renderFrame(ctx, t)` dibuja el reloj en el instante `t`; el exportador la invoca para los `N = duración × fps` frames, los escribe al sistema de archivos virtual de FFmpeg.wasm y codifica el MP4.

## Regla de oro: duración exacta

- Prohibido capturar en tiempo real (`MediaRecorder` introduce drift y duración aproximada).
- El tiempo del frame `i` es `i / fps`, nunca `Date.now()` ni `performance.now()`.
- `N` frames a 30 fps = `N/30` segundos exactos, siempre.

## Notas técnicas

- **SharedArrayBuffer / cross-origin isolation**: la build multihilo de FFmpeg.wasm exige los headers `Cross-Origin-Opener-Policy: same-origin` y `Cross-Origin-Embedder-Policy: require-corp`. Configurarlos en `vite.config.js` (dev y preview). Alternativa si da problemas: usar el core single-thread, más lento pero sin headers especiales.
- **Carga perezosa**: FFmpeg.wasm (decenas de MB) se descarga solo la primera vez que se exporta.
- **Formato de frames**: PNG por frame (`frame_%05d.png`) al FS virtual de ffmpeg; encode con libx264, `-pix_fmt yuv420p -r 30`.
- **Fuentes**: la tipografía digital debe estar cargada antes del primer render de canvas (`document.fonts.ready`).

## Reglas de seguridad

- solo podemos usar pnpm.

## Estructura del proyecto (objetivo)

```
overlay-chrono/
├── index.html
├── vite.config.js
├── src/
│   ├── main.js          # Bootstrap, estado de la app, wiring de controles
│   ├── timer.js         # Lógica de cuenta regresiva (duración, esquina)
│   ├── renderer.js      # renderFrame(ctx, t): dibujo del reloj en canvas
│   └── exporter.js      # Motor de frames + FFmpeg.wasm → descarga MP4
├── specs/               # Esta constitución
└── estudio_de_overlays_hiit_para_instagram_reels.html  # MVP de referencia (legado)
```

## Verificación

- Validación manual visual por fase (app de carácter visual).
- La duración del MP4 generado se verifica con `ffprobe` durante el desarrollo.
