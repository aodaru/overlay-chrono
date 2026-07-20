# Requisitos — Fase 2: Fondo configurable

## Contexto

La **Fase 1** ya entrega una cuenta regresiva funcional en el canvas de vista previa, con selector de esquina, input de duración y flujo Play/End que oculta los controles. Esta fase añade la primera variable de personalización del video: el color de fondo.

## Alcance incluido

- Añadir al panel de controles un selector de fondo con dos opciones:
  - **Verde chroma key:** `#00FF00`
  - **Negro fusión:** `#000000`
- Aplicar el fondo seleccionado al canvas de vista previa en todo momento (idle y reproducción).
- El reloj sigue siendo el único elemento visible durante la reproducción.
- Estado sincronizado entre controles y renderizador.
- Añadir al panel de controles un selector de de fuentes con 5 opciones, Las fuentes a utilizar estan en google fonts.
  - Orbitron
  - Press Start 2P
  - Sixtyfour
  - Keania One
  - Big Shoulders Stencil

## Decisiones de producto

| Aspecto           | Decisión                 | Razón                                                                                           |
| ----------------- | ------------------------ | ----------------------------------------------------------------------------------------------- |
| Control de fondo  | Dropdown (`<select>`)    | Escalable si en el futuro se añaden más fondos; ocupa poco espacio en UI minimalista.           |
| Color de reloj    | Blanco `#ffffff` siempre | Suficiente contraste sobre ambos fondos; no se toca la estética del reloj en esta fase.         |
| Fondo por defecto | Verde `#00FF00`          | Caso de uso principal es chroma key sobre videos de fitness/reels.                              |
| Persistencia      | Ninguna                  | Se mantiene la configuración solo durante la sesión actual, acorde al minimalismo del producto. |

## Fuera de alcance

- Fondos personalizados, imágenes o degradados.
- Cambio automático de color del reloj según el fondo.
- Exportación a video (llega en Fase 4); aquí solo se prepara el canvas.
- Cualquier funcionalidad HIIT, sonido, presets o textos personalizados (ver `specs/mission.md` → Fuera de alcance).

## Restricciones técnicas

- Canvas interno de 1080×1920; el fondo debe llenarlo completamente con `fillRect`.
- El color de fondo debe estar en el estado de la aplicación (`appState`) y pasarse al renderizador.
- No usar `Date.now()`, `performance.now()` ni temporizadores de pared para el color; es una propiedad de estado pura.
- Cumplir con la estructura del proyecto definida en `specs/tech-stack.md`.

## Referencias

- `specs/mission.md` — alcance, principios de producto y fuera de alcance.
- `specs/tech-stack.md` — arquitectura, reglas de duración exacta y estructura de archivos.
- `specs/roadmap.md` — Fase 2 (fondo configurable).
