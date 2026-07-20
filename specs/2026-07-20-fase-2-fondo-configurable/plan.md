# Plan — Fase 2: Fondo configurable

## 1. UI: añadir selector de fondo al panel de controles

1.1. En `index.html`, añadir un campo `<label>` + `<select id="background">` dentro de `#controls`, después del input de duración y antes del botón Play.

1.2. El `<select>` contendrá dos `<option>`:
   - `value="green"` con texto "Verde (chroma key)".
   - `value="black"` con texto "Negro (fusión)".

1.3. Estilizar el nuevo control en `src/style.css` para que encaje visualmente con el input de duración y el botón Play (mismos márgenes, tipografía y estados deshabilitados cuando la app está en reproducción).

## 2. Estado y wiring del selector

2.1. En `src/main.js`, añadir `background: 'green'` a `appState` como valor inicial.

2.2. Definir el mapa de colores en un lugar central (por ejemplo, `src/renderer.js` o `src/main.js`):
   - `green` → `#00FF00`
   - `black` → `#000000`

2.3. Implementar `applyBackground(backgroundKey)` en `src/main.js` que:
   - Valide que el valor sea `'green'` o `'black'`.
   - Actualice `appState.background`.
   - Sincronice el `<select>` si es necesario.
   - Llamue a `paintIdle()` para reflejar el cambio inmediatamente.

2.4. Conectar el evento `change` del `<select>` para llamar a `applyBackground` solo cuando `appState.phase === 'idle'`.

2.5. Deshabilitar el selector durante la reproducción (igual que se ocultan los controles con `body.is-running`).

## 3. Renderizador: aplicar el fondo al canvas

3.1. Modificar `drawTimer(ctx, value, corner, backgroundKey)` en `src/renderer.js` para aceptar el color de fondo.

3.2. Usar el mapa de colores para pintar el fondo del canvas con `fillRect(0, 0, WIDTH, HEIGHT)` antes de dibujar el texto.

3.3. Actualizar `renderInitial(canvas, state)` para pasar `state.background` a `drawTimer`.

3.4. Asegurar que `drawTimer` preserve `ctx.save()` / `ctx.restore()` para no contaminar el contexto gráfico.

## 4. Flujo Play/End

4.1. En `onPlay()` de `src/main.js`, pasar `appState.background` al llamar a `drawTimer`.

4.2. En el `onTick` del countdown, pasar `appState.background` para que cada frame se dibuje sobre el fondo correcto.

4.3. Verificar que al terminar la cuenta regresiva y volver a `idle`, el canvas vuelve a mostrar el fondo seleccionado con la duración inicial.

## 5. Verificación manual

5.1. Ejecutar `pnpm dev` y comprobar que el selector aparece y funciona.

5.2. Cambiar entre verde y negro y confirmar que el canvas se actualiza inmediatamente en estado idle.

5.3. Pulsar Play y confirmar que la cuenta regresiva se ve sobre el fondo seleccionado y que los controles (incluido el selector) están ocultos/deshabilitados.

5.4. Esperar a que termine la cuenta regresiva y confirmar que el fondo seleccionado persiste al volver a idle.
