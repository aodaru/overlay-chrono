# Requisitos — Selector de layout (Reel / Post)

## Alcance

### Incluido

- Selector de resolución con dos opciones: **Reel** (1080×1920, 9:16 vertical) y **Post** (1080×1080, 1:1 cuadrado).
- El canvas de preview se redimensiona al cambiar la resolución.
- El reloj se reposiciona proporcionalmente en ambas resoluciones (márgenes relativos).
- La exportación genera MP4 con la resolución seleccionada.
- El nombre del archivo exportado distingue el layout seleccionado.

### No incluido

- Resoluciones adicionales (Landscape, Stories, etc.).
- Preview responsivo que ocupe todo el viewport en ambos modos (se mantiene el escalado actual).
- Cambio automático de posición del reloj según resolución (el usuario elige la esquina manualmente como ahora).
- Soporte para Instagram Stories (9:16 sin bordes es lo mismo que Reel; se cubre con el modo Reel).

## Decisiones

| ID | Decisión | Racional | Alternativa descartada |
|----|----------|----------|------------------------|
| D1 | Radio buttons para selector | Mutuamente excluyente; dos opciones claras; scalable a más resoluciones | Dropdown (menos visual para pocas opciones) |
| D2 | Canvas se redimensiona en vivo | El preview siempre refleja la resolución exacta de salida | Canvas fijo con letterboxing (confunde al usuario) |
| D3 | Márgenes proporcionales | El reloj se ve idéntico en ambas resoluciones (misma distancia relativa al borde) | Márgenes fijos en píxeles (se vería diferente) |
| D4 | Reel como default | Backwards compatible con Fases 1–6 | Post como default (rompe comportamiento existente) |

## Contexto

- Canvas base actual: 1080×1920 @ 30 fps. Ahora será dinámico según `layout`.
- `renderFrame(ctx, t)` en `src/renderer.js` usa constantes `WIDTH=1080, HEIGHT=1920` — deben parametrizarse.
- `src/exporter.js` construye el comando FFmpeg con `-s 1080x1920` — debe usar la resolución activa.
- `src/main.js` tiene `appState` donde se agrega `layout`.

## Dependencias

- **Fase 6**: Pulido visual del reloj (tipografía, márgenes, sombra) — se reutiliza la estética.

## Riesgos identificados

| Riesgo | Mitigación |
|--------|------------|
| El texto del reloj se ve desproporcionado en 1:1 | Usar márgenes relativos y tamaño de fuente escalado |
| El preview en 1:1 se ve muy pequeño en pantalla | Mantener el escalado actual (`object-fit: contain`) |
| FFmpeg falla con resolución cambiada | Pasar `-s ${W}x${H}` dinámico en el comando |
