# Plan — Reloj funcional en pantalla (Fase 1)

Plan secuencial. Cada grupo debe completarse antes de pasar al siguiente.
Marcar checkboxes al ejecutar.

## Grupo 1: Layout de la app

1. [x] Ampliar `index.html`: añadir estructura DOM con dos zonas — `#stage` (mini-canvas 9:16 a la izquierda) y `#controls` (panel de controles a la derecha)
2. [x] `src/style.css` (o el CSS base existente): layout flex horizontal, fondo oscuro, panel de controles con ancho fijo razonable
3. [x] Responsive mínimo: si la ventana es estrecha, apilar verticalmente (canvas arriba, controles abajo)
4. [x] `src/main.js`: importar los módulos que se vayan necesitando y montar el estado global de la app (`appState = { phase: 'idle' | 'running', duration, corner }`)

## Grupo 2: Canvas 1080×1920 y render del cronómetro

5. [x] `src/renderer.js`: crear `<canvas width="1080" height="1920">` dentro de `#stage` y escalarlo por CSS al contenedor
6. [x] Esperar `document.fonts.ready` antes del primer render (constraint de `AGENTS.md` — disciplina que ya se aplica aunque la tipografía digital llegue en Fase 6)
7. [x] Función `drawTimer(ctx, value, corner)`: dibuja el número con `formatSeconds(value)` (padding 2 dígitos, D1), color blanco, fuente monospace system, sombra/halo sutil para legibilidad
8. [x] Posicionamiento por esquina: `TL` arriba-izquierda, `TR` arriba-derecha, `BL` abajo-izquierda, `BR` abajo-derecha, con margen 80px desde cada borde (D3 de `requirements.md`)
9. [x] Función `renderInitial(state)`: pinta el número inicial (la duración configurada, default 15) en la esquina seleccionada sobre fondo oscuro neutro — esto es el estado "idle" visible
10. [x] Constantes `WIDTH = 1080`, `HEIGHT = 1920`, `MARGIN = 80` exportadas desde `renderer.js` (las reutilizará el selector de esquina)

## Grupo 3: Selector de esquina (mini-canvas con hotspots)

11. [x] Dentro de `#stage`, superponer un canvas adicional 9:16 con las mismas proporciones que el canvas principal (puede ser un `<canvas>` o un overlay DOM con `aspect-ratio: 9/16`)
12. [x] Render del mini-canvas: rectángulo 9:16 con el fondo del video futuro (gris neutro en Fase 1) y los 4 hotspots invisibles en las esquinas (zonas clicables de ~80×80px en proporción 9:16)
13. [x] Estado `selectedCorner ∈ {TL, TR, BL, BR}`, default `TL`, expuesto en `appState`
14. [x] Click en un hotspot → actualiza `selectedCorner` y resalta el hotspot activo (círculo de ~16px o borde marcado)
15. [x] Al cambiar `selectedCorner`, re-renderizar el canvas principal con `drawTimer` en la nueva esquina

## Grupo 4: Lógica de cuenta regresiva (timer.js)

16. [x] `formatSeconds(n)`: entero → string con padding 2 dígitos (`String(n).padStart(2, '0')`); valores fuera de rango se clampean a `00`
17. [x] `createCountdown({ duration, onTick, onEnd })`: devuelve `{ start, cancel }`
18. [x] `start()`: programa los ticks con `setInterval(1000)`; el primer tick se emite con el valor `duration` y los siguientes con `duration - 1`, `duration - 2`, … hasta `1`
19. [x] `cancel()`: limpia el interval (reservado para futuro; en Fase 1 no se usa porque no hay Stop, ver D5)
20. [x] `onTick(secondsRemaining)`: se invoca una vez por segundo mientras el conteo corre
21. [x] `onEnd()`: se invoca cuando se ha mostrado el último valor (`1`) durante 1s; en ese momento se cancela el interval
22. [x] **Wall-clock en Fase 1**: el interval introduce un drift de ±1 tick aceptable para visualización en vivo. La regla de oro de `tech-stack.md` ("frame `i` a `i / fps`") aplica a partir de Fase 3; no se salta esa fase, se respeta la separación de concerns del roadmap

## Grupo 5: Input de duración y botón Play

23. [x] En `#controls`: `<label>Duración (s)</label>` + `<input type="number" min="1" max="99" step="1" value="15">`
24. [x] Listener `input`: clampa a `[1, 99]` y descarta no-enteros; si el valor cambia, re-renderiza el canvas principal con el nuevo número inicial
25. [x] `<button id="play">Play</button>` debajo del input
26. [x] Estado del botón: deshabilitado si la duración es inválida (`NaN`, `<1`, `>99`, decimal)
27. [x] `main.js`: orquestar `renderer` + `timer`; el botón Play dispara `createCountdown(...).start()` y cambia `appState.phase` a `'running'`

## Grupo 6: Flujo Play / End (ocultar y mostrar controles)

28. [x] Al entrar en `phase: 'running'`: añadir clase CSS `is-running` al `<body>` (o a `#app`) que oculta `#controls` y centra `#stage` horizontalmente
29. [x] Durante `running`: solo es visible el número decrementando en la esquina — sin input, sin botón, sin hotspots del mini-canvas
30. [x] Cuando `onEnd` se dispara: quitar la clase `is-running`, volver a `phase: 'idle'`, los controles reaparecen
31. [x] Verificar manualmente: tras pulsar Play no debe quedar ningún elemento de UI visible hasta que termine la cuenta (D5: no hay Stop en Fase 1)

## Grupo 7: Verificación y merge

32. [ ] Ejecutar la verificación descrita en `validation.md`
33. [ ] Commit con mensaje siguiendo el estilo del repo (`fase 1: …` por grupo, cierre administrativo al final)
34. [ ] Push de la rama
35. [ ] Abrir PR
36. [ ] Mergear a `main` y limpiar la rama
