# Plan — Selector de layout (Reel / Post)

## 1. UI: selector de resolución

1.1. En `index.html`, añadir un `<fieldset>` con dos radio buttons dentro de `#controls`:
   - `value="reel"` con label "Reel (9:16)".
   - `value="post"` con label "Post (1:1)".

1.2. Estilizar el nuevo control en `src/style.css` para que encaje visualmente con los controles existentes.

1.3. Deshabilitar los radios durante reproducción/exportación (junto con los demás controles).

## 2. Estado de la app: resolución activa

2.1. En `src/main.js`, añadir `layout: 'reel'` a `appState` como valor inicial.

2.2. Agregar mapa de resoluciones:
   - `reel` → `{ width: 1080, height: 1920, label: 'Reel (9:16)' }`
   - `post` → `{ width: 1080, height: 1080, label: 'Post (1:1)' }`

2.3. Implementar `applyLayout(layoutKey)` en `src/main.js` que:
   - Actualice `appState.layout`.
   - Sincronice los radio buttons.
   - Cambie el tamaño del canvas (`canvas.width / height`).
   - Llame a `paintIdle()` para reflejar el cambio inmediato.

2.4. Conectar el evento `change` de los radios a `applyLayout` solo en `idle`.

## 3. Renderizador: adaptar a la resolución

3.1. En `src/renderer.js`, modificar `renderFrame(ctx, t)` para que reciba `layout` (o `width`/`height`) en lugar de usar constantes `1080×1920` fijas.

3.2. Extraer constantes `WIDTH` y `HEIGHT` a parámetros o a un objeto de configuración.

3.3. Reposicionar el reloj proporcionalmente según la resolución: márgenes relativos al ancho/alto. En post 1:1 el reloj debe ubicarse en la esquina manteniendo la misma proporción de márgenes que en reel.

## 4. Exportación: resolución dinámica

4.1. En `src/exporter.js`, pasar la resolución activa al bucle de frames y al comando de FFmpeg.

4.2. El nombre del archivo descargado debe incluir la resolución:
   - `overlay-chrono-<duracion>s-reel.mp4`
   - `overlay-chrono-<duracion>s-post.mp4`

## 5. Verificación

5.1. `pnpm dev` levanta sin errores.

5.2. Seleccionar Post cambia el canvas a 1080×1080 centrado en la pantalla.

5.3. Volver a Reel restaura 1080×1920.

5.4. Exportar en ambos modos y verificar duración y resolución con `ffprobe`.

## 6. Documentación y merge

- [ ] Commit de todos los cambios
- [ ] Push de la rama
- [ ] Validar criterios de éxito
- [ ] Mergear y limpiar
