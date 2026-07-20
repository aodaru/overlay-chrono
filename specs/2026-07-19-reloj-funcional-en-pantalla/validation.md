# Validación — Reloj funcional en pantalla (Fase 1)

## Estado de la fase

**✅ COMPLETADA** — implementación y verificación manual realizadas en `feat/fase-1-reloj-funcional-en-pantalla` antes del merge.

## Criterios de éxito

### 1. Layout y entorno

- [x] `pnpm dev` levanta sin errores ni warnings nuevos
- [x] La pantalla muestra dos zonas: mini-canvas 9:16 a la izquierda, panel de controles a la derecha, sobre fondo oscuro
- [x] El canvas principal tiene atributos `width="1080" height="1920"`; CSS lo escala al contenedor sin distorsión
- [x] `crossOriginIsolated === true` en la consola del navegador
- [x] No aparece ningún elemento de la demo de Vite ni boilerplate de scaffolds anteriores
- [x] No hay artefactos de `npm` o `yarn` en el repo (solo `pnpm-lock.yaml`)

### 2. Render inicial (estado idle)

- [x] Al abrir la app se ve el número `15` (default) en la esquina superior izquierda (default), en blanco, fuente monospace, con padding de 2 dígitos
- [x] El número tiene un halo/sombra sutil que lo mantiene legible sobre el fondo oscuro neutro
- [x] El número está dentro del encuadre (no se sale del canvas 1080×1920)
- [x] `document.fonts.ready` se espera antes del primer `drawTimer`

### 3. Selector de esquina

- [x] El mini-canvas 9:16 muestra los 4 hotspots (uno por esquina) con feedback visual al pasar el cursor
- [x] El hotspot activo (default `TL`) está resaltado (círculo, borde o equivalente)
- [x] Click en otro hotspot → el highlight se mueve y el número del canvas principal se re-renderiza en la nueva esquina
- [x] Las 4 esquinas (`TL`, `TR`, `BL`, `BR`) posicionan el número correctamente: alineado al borde correspondiente con el margen definido

### 4. Input de duración

- [x] El input acepta valores enteros en el rango `1–99`
- [x] El default es `15`
- [x] Valores fuera de rango se clampean al recargar o al perder el foco (`<1 → 1`, `>99 → 99`)
- [x] Decimales, `NaN` o vacío: el botón Play queda deshabilitado
- [x] Cambiar la duración re-renderiza el número inicial en el canvas (sigue mostrando la esquina seleccionada)

### 5. Botón Play

- [x] El botón Play es visible y está habilitado con la configuración por defecto
- [x] Click en Play:
  - El panel de controles desaparece
  - El mini-canvas de selección también desaparece (queda solo el canvas principal con el número)
  - La cuenta atrás arranca mostrando `15`

### 6. Cuenta atrás

- [x] La secuencia visible es exactamente: `15`, `14`, `13`, … `02`, `01` (un valor por segundo, padding de 2 dígitos)
- [x] El último valor mostrado es `01`; tras 1s con `01` los controles reaparecen (no se muestra `00`)
- [x] Duración total medida con cronómetro externo (móvil o `stopwatch`): **15.0 s ± 1.0 s** (tolerancia del wall-clock)
- [x] El número permanece en la esquina seleccionada durante toda la cuenta
- [x] En ningún momento del conteo hay un control, botón, hotspot o etiqueta visible — solo el número sobre el canvas

### 7. Robustez por valores y esquinas

- [x] Probar con duración `1`: la cuenta muestra `01` durante 1s y termina (~1s total, ±1s)
- [x] Probar con duración `99`: la cuenta muestra `99`, `98`, … `02`, `01` y termina (~99s total, ±1s)
- [x] Probar las 4 esquinas: en cada una el número está alineado al borde correcto y no se sale del encuadre
- [x] Probar `TL` + duración `15`, `TR` + duración `30`, `BL` + duración `7`, `BR` + duración `60` — todas funcionan

### 8. Consola y código

- [x] No hay errores ni warnings en la consola del navegador durante el flujo completo
- [x] No hay `Date.now()` ni `performance.now()` usados para calcular el frame del render (D4)
- [x] No se introdujo ninguna dependencia nueva en `package.json` (la fase no las necesita)
- [x] `src/renderer.js`, `src/timer.js` y `src/main.js` son los módulos que implementan la fase; `src/exporter.js` permanece como stub
- [x] Sin frameworks, sin Tailwind, sin preprocesadores

## Cómo verificar

```bash
# Arranque
pnpm install
pnpm dev
# Abrir http://localhost:5173 en el navegador

# Aislamiento cross-origin
# En la consola del navegador:
#   crossOriginIsolated  // debe ser true

# Verificar el rechazo de npm/yarn
ls package-lock.json yarn.lock 2>/dev/null && echo "FALLO" || echo "OK"

# Estructura mínima
ls src/main.js src/timer.js src/renderer.js src/exporter.js
```

Procedimiento manual recomendado:

1. Abrir la app, observar el estado idle (`15` en `TL`).
2. Cambiar la esquina 4 veces, una por hotspot — comprobar re-render.
3. Cambiar la duración a `5`, a `99`, a `1` — comprobar re-render y clamp.
4. Intentar teclear `0`, `100`, `3.5` en el input — comprobar comportamiento.
5. Pulsar Play y cronometrar con el móvil: 15s ± 1s.
6. Repetir con duración `1`, `30`, `99` y con cada esquina.
7. Inspeccionar la consola: limpia durante todo el flujo.

## Criterio de merge a main

- [ ] Todos los criterios de éxito marcados
- [ ] PR abierto contra `main`
- [ ] `pnpm dev` validado manualmente siguiendo el procedimiento
- [ ] Sin cambios fuera de scope (no se toca `src/exporter.js`, no se añaden dependencias)

## Anti-criterios (lo que NO debe pasar)

- ❌ Botón Stop / Pausa / Reset visible en la UI (D5)
- ❌ Selector de fondo verde / negro (eso es Fase 2)
- ❌ Exportación MP4, botón "Descargar" o cualquier referencia a FFmpeg.wasm (Fase 4)
- ❌ Fuente digital custom (Fase 6) — debe ser monospace system
- ❌ Uso de `Date.now()` o `performance.now()` en el render del frame (D4)
- ❌ `00` mostrado en pantalla aunque sea un instante (D6)
- ❌ npm o yarn en cualquier paso
- ❌ Frameworks, Tailwind, preprocesadores, librerías de UI
- ❌ Persistencia con localStorage, sessionStorage o cookies (D10)
- ❌ Modificación del MVP HTML legado o de la estructura de `specs/` (excepto este directorio nuevo)
- ❌ Cambios en `vite.config.js` que no sean estrictamente necesarios (los headers ya están)
