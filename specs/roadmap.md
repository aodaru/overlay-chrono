# Roadmap — Overlay Chrono

Orden de implementación en fases muy pequeñas. Cada fase es verificable de forma independiente y deja la app funcionando. No se avanza a la siguiente fase sin cumplir el criterio de salida (✅).

## Fase 0 — Setup del proyecto

- Inicializar Vite (vanilla), estructura de carpetas, `index.html` y CSS base oscuro.
- `README.md` se mantiene como spec de producto; el MVP HTML queda como referencia visual legada.
- ✅ `npm run dev` levanta y muestra el layout base vacío.

## Fase 1 — Reloj funcional en pantalla

- Vista previa vertical 9:16 (canvas 1080×1920 escalado a pantalla).
- Controles: input de duración (segundos), selector de 4 esquinas, botón Play.
- Al presionar Play: los controles desaparecen y solo queda la cuenta regresiva en la esquina elegida, actualizándose en pantalla.
- Al terminar la cuenta: vuelven los controles (aún sin exportación).
- ✅ La cuenta regresiva se ve correcta en las 4 esquinas; durante el conteo no hay ningún control visible.

## Fase 2 — Fondo configurable

- Selector de fondo: verde (`#00FF00`) / negro (`#000000`), aplicado al canvas de vista previa.
- ✅ La cuenta regresiva corre sobre ambos fondos con contraste legible.

## Fase 3 — Motor de render determinístico

- Refactor del dibujo a `renderFrame(ctx, t)` pura (sin relojes de pared).
- Bucle de render que genera los `N = duración × fps` frames exactos sin depender del tiempo real.
- ✅ Generar 15 s produce exactamente 450 frames (30 fps) con el dígito correcto en cada frame.

## Fase 4 — Exportación MP4

- Integración de FFmpeg.wasm con carga perezosa + headers COOP/COEP en Vite.
- Pipeline: frames PNG → FS virtual → libx264 `yuv420p` → descarga `overlay-chrono-<duracion>s.mp4`.
- ✅ Configurar 15 s descarga un MP4 1080×1920 de 15.00 s exactos (verificado con `ffprobe`).

## Fase 5 — UX de exportación

- Indicador de progreso (render de frames → codificación), UI bloqueada durante el proceso, aviso de primera carga pesada de FFmpeg.wasm.
- ✅ El usuario entiende qué ocurre en todo momento y no puede disparar exportaciones duplicadas.

## Fase 6 — Pulido visual del reloj

- Estética final: tipografía digital, tamaño, márgenes por esquina, sombra/halo para legibilidad sobre cualquier video de fondo.
- ✅ El overlay se ve nítido y profesional superpuesto en un Reel de prueba, tanto con chroma key (verde) como con fusión (negro).

## Descartado por ahora

HIIT, sonido, presets, textos personalizados, drag & drop, simulación de GUI de Instagram (ver `mission.md` → Fuera de alcance).
