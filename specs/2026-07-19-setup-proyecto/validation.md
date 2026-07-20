# Validación — Setup del proyecto (Fase 0)

## Estado de la fase

**✅ VALIDADA** (2026-07-19) — pendiente solo el criterio de merge (Grupo 5 del plan)

## Criterios de éxito

### 1. Proyecto inicializado

- [x] Existe `package.json` con `"type": "module"` y scripts `dev`, `build`, `preview`
- [x] Vite instalado como devDependency con versión exacta (sin `^`/`~`) — `8.1.5`
- [x] Existe `pnpm-lock.yaml`; **no** existen `package-lock.json` ni `yarn.lock`
- [x] `.gitignore` cubre `node_modules/` y `dist/`

### 2. Servidor de desarrollo

- [x] `pnpm install` completa sin errores
- [x] `pnpm dev` levanta sin errores y muestra el layout base vacío sobre fondo oscuro en el navegador
- [x] No aparece boilerplate de demo (contador de create-vite, logos, "Hello Vite", etc.)

### 3. Cross-origin isolation

- [x] El dev server responde con `Cross-Origin-Opener-Policy: same-origin` y `Cross-Origin-Embedder-Policy: require-corp` (verificado con `curl`, también en `pnpm preview`)
- [x] `crossOriginIsolated === true` en la consola del navegador (verificado con Chromium headless)

### 4. Estructura

- [x] Existen `index.html`, `vite.config.js`, `src/main.js`, `src/timer.js`, `src/renderer.js`, `src/exporter.js` y el CSS base (`src/style.css`)
- [x] Los módulos `timer/renderer/exporter` son stubs sin lógica de reloj, canvas ni exportación
- [x] No hay dependencias de framework (react, vue, etc.) en `package.json`

### 5. Documentación

- [x] `README.md` sigue siendo la spec de producto e incluye sección de arranque (`pnpm install`, `pnpm dev`)

## Cómo verificar

```bash
# Instalación y arranque
pnpm install
pnpm dev

# Headers COOP/COEP (con el dev server corriendo)
curl -sI http://localhost:5173 | grep -i 'cross-origin'

# En la consola del navegador:
#   crossOriginIsolated  // debe ser true

# Estructura de archivos
ls index.html vite.config.js src/main.js src/timer.js src/renderer.js src/exporter.js

# Sin artefactos de npm/yarn
ls package-lock.json yarn.lock 2>/dev/null && echo "FALLO" || echo "OK"
```

## Criterio de merge a main

- [ ] Todos los criterios marcados
- [ ] PR abierto
- [ ] Validación manual ejecutada

## Anti-criterios (lo que NO debe pasar)

- ❌ Uso de npm o yarn en cualquier paso (artefactos `package-lock.json` / `yarn.lock`)
- ❌ Canvas, controles o cuenta regresiva implementados (eso es Fase 1+)
- ❌ Dependencias de framework o utilidades de estilo (React, Vue, Tailwind…)
- ❌ Boilerplate de demo visible en la app
- ❌ `node_modules/` o `dist/` commiteados
- ❌ El MVP HTML legado modificado o borrado
