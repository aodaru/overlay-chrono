# Requisitos — Reloj funcional en pantalla (Fase 1)

## Alcance

Implementar la cuenta regresiva visible en el navegador, según `specs/roadmap.md` → Fase 1. Al terminar, el usuario puede configurar una duración (entera, 1–99 s) y una de las 4 esquinas, pulsar Play y ver la cuenta atrás corriendo a pantalla completa. Al finalizar, los controles reaparecen. **No hay exportación, ni selector de fondo, ni tipografía digital**: son fases posteriores.

### Incluido

- Layout de dos zonas: **mini-canvas 9:16 a la izquierda** con hotspots clicables para elegir esquina, panel de **controles a la derecha** con input de duración y botón Play.
- Canvas principal interno `1080×1920`, escalado por CSS al contenedor; el dibujo ocurre en coordenadas reales para que la vista previa coincida 1:1 con el export futuro.
- Render del cronómetro con **padding de 2 dígitos** (`15`, `14`, … `02`, `01`) en fuente monospace system y color blanco, con halo sutil para legibilidad.
- **Selector de esquina** como mini-canvas 9:16 con 4 hotspots clicables (uno por esquina) y highlight del seleccionado.
- **Input de duración** entero `1–99` (default `15`) con validación y clamp; cambio en vivo del número inicial en el canvas.
- **Botón Play** que oculta los controles, arranca la cuenta atrás, y los restaura al terminar.
- Lógica de cuenta atrás **wall-clock** (`setInterval` 1s) en `timer.js`: ticks `duration`, `duration-1`, … `1`; `onEnd` tras mostrar `1` durante 1s.
- `document.fonts.ready` esperado antes del primer render (constraint de `AGENTS.md`, disciplina que se mantiene aunque la tipografía digital llegue en Fase 6).
- Estructura modular coherente con `tech-stack.md` → `src/main.js`, `src/timer.js`, `src/renderer.js`, `src/exporter.js` (este último queda como stub; entra en Fase 4).

### No incluido

- Selector de fondo verde / negro (Fase 2).
- `renderFrame(ctx, t)` determinístico ni bucle de `N = duración × fps` frames (Fase 3).
- Exportación MP4, FFmpeg.wasm, descarga (Fase 4).
- UX de progreso de exportación (Fase 5).
- Tipografía digital, halo profesional, márgenes por esquina afinados visualmente (Fase 6).
- Persistencia (localStorage), presets, botón Stop, edición de duración durante el conteo, atajos de teclado.
- Frameworks, Tailwind, tests automatizados (ver `tech-stack.md`).

## Decisiones

| ID | Decisión | Racional | Alternativa descartada |
|----|----------|----------|------------------------|
| D1 | Display format = padding 2 dígitos (`15`, `14`, … `02`, `01`) | Decidido por el usuario; ancho de texto estable, indica que "00" existe como fin lógico aunque no se muestre | Sin padding: ancho variable, aspecto menos profesional. `M:SS`: más explícito pero menos minimalista |
| D2 | Selector de esquina = mini-canvas 9:16 con 4 hotspots clicables | Decidido por el usuario; replica la forma del video final, el usuario ve dónde caerá el número antes de Play | 4 botones de texto: más rápido de implementar pero sin pista visual. Grid 2×2 etiquetado: equilibrio pero menos fiel |
| D3 | Duración = entero `1–99` s, default `15` | Decidido por el usuario; cubre el rango útil para Reels y match exacto con el ejemplo de `mission.md` | Decimal con step 0.1: introduce redondeo en el render. `1–600`: superficie innecesaria |
| D4 | Countdown driver = wall-clock (`setInterval(1000)`) | La separación de concerns del roadmap indica que Fase 1 es "reloj visible" y Fase 3 introduce `renderFrame(ctx, t)`; saltar a determinismo ahora difumina esa frontera | Render determinístico desde Fase 1: ocupa Fase 3 antes de tiempo y complica el bootstrap visual |
| D5 | Sin botón Stop en Fase 1 | El roadmap dice "al terminar la cuenta vuelven los controles" sin mencionar parada manual; añadir Stop sería scope creep antes de validar el flujo end-to-end | Botón Stop/Pausa: se puede añadir en Fase 5 (UX de exportación) o en una fase futura si surge la necesidad |
| D6 | Última cifra mostrada = `01`; `onEnd` se dispara tras 1s con ese valor; `00` no se llega a mostrar | D1 muestra la secuencia `15 … 01`; un valor extra `00` añadiría 1s real a la duración, rompiendo el principio de `mission.md` ("15 s configurados = 15.00 s") | Mostrar `00` durante 1s: total = `N+1` segundos, contradice la duración exacta. Mostrar `00` instantáneo: igual suma 1 frame de drift |
| D7 | Font en Fase 1 = monospace system (`ui-monospace, SFMono-Regular, Menlo, monospace`) | No hay todavía tipografía digital (Fase 6); monospace system respeta el principio de minimalismo y es legible sobre cualquier fondo | Web font ya en Fase 1: introduce red y el manejo de `document.fonts.ready` se aplaza. Fuente del MVP HTML legado: el MVP está declarado "referencia legada", no se reutiliza |
| D8 | Coordenadas de dibujo = `1080×1920` (espacio de export); CSS escala al contenedor | El canvas de vista previa es el mismo canvas que se va a exportar; Fase 4 reutiliza el render sin transformaciones | Canvas escalado a la pantalla con `transform.scale`: complica la matemática del export y rompe la promesa "1:1 con el video" |
| D9 | Margen de esquina = `80px` desde cada borde (≈ 7.4% ancho, 4.2% alto) | Equivale a la "safe area" aproximada de Reels; mantiene el número dentro del encuadre incluso con los overlays de la UI nativa de Instagram | Margen absoluto en CSS: pierde significado al escalar. Margen porcentual: نفس النتيجة pero más críptico |
| D10 | Sin persistencia entre recargas | YAGNI; Fase 1 valida el flujo visual. localStorage introduce estado oculto y bugs difíciles de reproducir | localStorage con `selectedCorner`/`duration`: la fricción de re-configurar es baja (un click y un número) y no compensa el riesgo |
| D11 | El MVP HTML legado (`estudio_de_overlays_hiit_para_instagram_reels.html`) **no se reutiliza** como librería | El MVP contiene lógica de HIIT explícitamente fuera de alcance; copiar partes contamina el código nuevo con features muertas | Reutilizar la función de countdown del MVP: arrastra dependencias de la versión anterior, ruido HIIT, y dependencias de DOM no aisladas |

## Contexto

- **Estado del repo**: Fase 0 completada y mergeada a `main`. Vite levanta, headers COOP/COEP activos, estructura `src/` con stubs, layout base oscuro vacío.
- **Rama de trabajo**: `feat/fase-1-reloj-funcional-en-pantalla` (rama actual).
- **Stack acordado**: ver `specs/tech-stack.md` — Vanilla JS (módulos ES) + Vite, Canvas 2D 1080×1920 @ 30 fps, FFmpeg.wasm (Fase 4), salida MP4 H.264 `yuv420p`.
- **Producto**: ver `specs/mission.md` — overlay de cuenta regresiva para Reels, 100% navegador, duración exacta, minimalismo operativo.
- **Estado del canvas**: el stub de `src/renderer.js` ya existe; se transforma de placeholder a implementación real de `drawTimer` + `renderInitial`. El stub de `src/timer.js` se transforma en `createCountdown`. `src/exporter.js` queda como stub hasta Fase 4.

## Dependencias

- **Bloqueada por**: Fase 0 (proyecto Vite levantando, headers COOP/COEP, `src/style.css` base).
- **Bloquea a**: Fases 2 (selector de fondo reutiliza el canvas ya renderizado), 3 (refactoriza `drawTimer` a `renderFrame(ctx, t)`), 6 (intercambia la fuente system por la digital y afina márgenes).

## Riesgos identificados

| Riesgo | Mitigación |
|--------|------------|
| `setInterval` 1s acumula drift visible en duraciones largas | Aceptable en Fase 1 (visual en vivo). Fase 3 introduce el motor determinístico que se usa para el export |
| La fuente system puede tener métricas distintas entre OS (Linux/macOS/Windows) y descolocar el número entre renders | El halo/sombra mitiga la percepción; la posición por esquina está en coordenadas fijas del canvas 1080×1920, no en métricas de fuente |
| `aspect-ratio: 9/16` no soportado en navegadores muy viejos | Target = navegadores modernos con COOP/COEP (ya exigidos por Fase 4). No es un target a soportar |
| El mini-canvas con hotspots superpuestos puede comerse clicksintended al canvas principal si el orden DOM es incorrecto | El mini-canvas va con `position: absolute; pointer-events: none` excepto en las zonas de hotspot (`pointer-events: auto`). El canvas principal queda debajo sin interactividad |
| Cambiar `duration` mientras `phase === 'running'` produciría inconsistencia | El input se oculta al entrar en `running`; no es posible editarlo durante el conteo |
| La cuenta atrás no se detiene si la pestaña queda en background (throttling de timers) | Aceptable para Fase 1: al volver a primer plano el interval retoma donde iba. Si surge como problema, mover el `Date.now()`-based offset a Fase 3 con el motor determinístico |
