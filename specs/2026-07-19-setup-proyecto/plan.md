# Plan — Setup del proyecto (Fase 0)

Plan secuencial. Cada grupo debe completarse antes de pasar al siguiente.
Marcar checkboxes al ejecutar.

## Grupo 1: Inicialización del proyecto

1. [x] Crear `package.json` con pnpm (nombre `overlay-chrono`, `"type": "module"`, scripts `dev`/`build`/`preview`)
2. [x] Instalar Vite como devDependency (`pnpm add -D vite`) — `.npmrc` ya fija `save-exact=true`
3. [x] Crear `.gitignore` (`node_modules/`, `dist/`, `.DS_Store`, logs)
   - Obligatorio antes del primer commit

## Grupo 2: Configuración de Vite

4. [x] Crear `vite.config.js` con los headers COOP/COEP en `server.headers` y `preview.headers`
   - `Cross-Origin-Opener-Policy: same-origin`
   - `Cross-Origin-Embedder-Policy: require-corp`
   - Se configuran ahora aunque FFmpeg.wasm llega en Fase 4 (decisión D2 de `requirements.md`)

## Grupo 3: Estructura base de la app

5. [x] Crear `index.html` en la raíz apuntando a `src/main.js` (módulo ES)
6. [x] Crear CSS base oscuro (`src/style.css` o `style.css`): fondo oscuro, tipografía de sistema, reset mínimo
7. [x] Crear stubs vacíos de la estructura objetivo (sin lógica, solo exportaciones placeholder):
   - `src/main.js` — bootstrap mínimo que monta el layout base
   - `src/timer.js` — placeholder
   - `src/renderer.js` — placeholder
   - `src/exporter.js` — placeholder
8. [x] Layout base vacío visible al abrir la app (contenedor centrado, sin canvas ni controles — eso es Fase 1)

## Grupo 4: README y verificación manual

9. [x] Actualizar `README.md`: mantener como spec de producto y añadir sección de arranque (`pnpm install`, `pnpm dev`)
10. [x] Ejecutar la verificación de `validation.md` (levantar `pnpm dev`, comprobar headers, comprobar estructura)

## Grupo 5: Documentación y merge

- [ ] Commit de todos los cambios
- [ ] Push de la rama
- [ ] Crear PR
- [ ] Validar criterios de éxito
- [ ] Mergear y limpiar
