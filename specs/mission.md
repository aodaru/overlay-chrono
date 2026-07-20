# Misión — Overlay Chrono

## Qué es

Overlay Chrono es una aplicación web que genera overlays de cuenta regresiva para Instagram Reels y posts. El usuario configura una duración y una esquina, presiona Play, y la app produce un video MP4 vertical (9:16) que contiene únicamente el cronómetro en esa esquina, con una duración exactamente igual a la configurada.

## Problema que resuelve

Los creadores de contenido (fitness, retos, cocina, productividad) necesitan cronómetros visuales limpios para superponer en sus videos. Hoy las opciones son grabar la pantalla de una app de reloj (impreciso, con UI sobrante) o construir el contador a mano en un editor (tedioso). Overlay Chrono entrega un clip listo para chroma key o fusión en segundos.

## Usuario objetivo

Creadores de contenido para Instagram que editan en CapCut, Premiere, DaVinci o similar, y quieren un overlay de cuenta regresiva minimalista sin fricción.

## Alcance (decidido)

- **Cuenta regresiva simple**: duración configurable en segundos. Sin intervalos ni rondas.
- **Posición**: cualquiera de las 4 esquinas del encuadre vertical.
- **Fondo del video**: verde (`#00FF00`, para chroma key) o negro puro (para fusión "Pantalla/Aclarar"), configurable por el usuario.
- **Salida**: MP4 9:16, duración exacta, solo el reloj visible.
- **100% en el navegador**: sin backend, sin cuentas, sin subidas de archivos.

## Fuera de alcance (descartado explícitamente)

- Motor HIIT (intervalos trabajo/descanso, rondas, fases) presente en el MVP.
- Efectos de sonido / pitidos.
- Pestañas, plantillas/presets, textos personalizados, drag & drop del widget.
- Simulación de la interfaz de Instagram.
- Grabación de pantalla como flujo de exportación (el video lo genera la app, no el usuario).

## Principios de producto

1. **Solo el reloj**: durante la reproducción y en el video exportado no existe ningún otro elemento visible.
2. **Duración exacta**: 15 s configurados = video de 15.00 s. Sin drift, sin captura en tiempo real.
3. **Minimalismo operativo**: configurar → Play → descargar. Tres pasos, cero distracciones.
4. **Sin servidor**: todo ocurre en el navegador del usuario.

## Criterios de éxito

- Configurar 15 s produce una descarga de MP4 1080×1920 de exactamente 15.00 s.
- El reloj se ve nítido y legible en cualquiera de las 4 esquinas.
- El flujo completo (abrir la app → descargar el video) toma menos de 1 minuto.
