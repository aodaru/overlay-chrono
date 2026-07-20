# Validación — Selector de layout (Reel / Post)

## Estado de la fase

**✅ COMPLETADA**

## Criterios de éxito

### 1. Selector de layout en UI

- [x] Aparecen dos radio buttons: "Reel (9:16)" y "Post (1:1)" en el panel de controles.
- [x] Por defecto está seleccionado "Reel (9:16)".
- [x] Los radios se deshabilitan/ocultan durante reproducción y exportación.

### 2. Preview se adapta

- [x] Al seleccionar "Post (1:1)", el canvas cambia a 1080×1080 y se ve centrado.
- [x] Al seleccionar "Reel (9:16)", el canvas vuelve a 1080×1920.
- [x] El cambio es inmediato sin necesidad de pulsar Play.

### 3. Reloj proporcionado

- [x] En Post 1:1, el reloj aparece en la esquina seleccionada con márgenes proporcionales (se ve igual de separado del borde que en Reel).
- [x] El tamaño del texto es legible en ambas resoluciones.

### 4. Exportación

- [x] Exportar en modo Reel produce un MP4 de 1080×1920.
- [x] Exportar en modo Post produce un MP4 de 1080×1080.
- [x] El nombre del archivo contiene `reel` o `post` según el modo.
- [x] La duración del MP4 es exacta en ambos modos.

### 5. Regresivo

- [x] No se rompe ninguna funcionalidad existente (cuenta regresiva, selector de esquina, fondo, exportación).

## Cómo verificar

```bash
pnpm dev
# Probar selector de layout en UI
# Exportar en ambos modos
ffprobe -v error -select_streams v:0 -show_entries stream=width,height,duration -of csv=p=0 /ruta/al/mp4
```

## Criterio de merge a main

- [x] Todos los criterios marcados.
- [x] El código sigue el estilo existente (ES modules, nombres descriptivos, mínima intrusión).
- [x] No se añaden dependencias nuevas.

## Anti-criterios (lo que NO debe pasar)

- ❌ El canvas se ve deformado o estirado en cualquiera de los dos modos.
- ❌ El reloj se sale del encuadre en Post 1:1.
- ❌ La exportación falla o produce duración incorrecta en algún modo.
- ❌ El cambio de layout afecta el estado actual de reproducción.
