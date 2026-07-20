# Overlay Chrono - Cronómetro para Videos de Instagram

## Descripción

Desarrollo de un overlay (superposición) para cronometrar ejercicios en videos de Instagram/Reels. El cronómetro se muestra como una cuenta regresiva en una de las esquinas del video. La aplicación debe generar un archivo de video con la duración exacta del cronómetro configurado (ej: si se configura una cuenta regresiva de 15 segundos, se genera un video de exactamente 15 segundos).

## Requisitos Funcionales

### Configuración del Temporizador
- Permitir configurar el tiempo del cronómetro antes de iniciar
- El temporizador debe soportar diferentes duraciones según el ejercicio

### Visualización
- El reloj debe poder colocarse en cualquiera de las 4 esquinas del video
- **Solo debe mostrarse el cronómetro** (cuenta regresiva), NO los controles
- Diseño minimalista optimizado para formato de video vertical (Instagram Reels)

### Modo de Reproducción
- Una vez configurado el tiempo y presionado "Play", el cronómetro se reproduce automáticamente
- Durante la reproducción, únicamente se visualiza el reloj en pantalla
- Los controles de configuración desaparecen al iniciar la cuenta regresiva

### Generación de Video
- Al finalizar la cuenta regresiva, la aplicación debe generar automáticamente un archivo de video
- La duración del video debe ser exactamente igual al tiempo configurado en el cronómetro
- El video debe contener únicamente el cronómetro en la esquina seleccionada
- Formato de salida compatible con Instagram Reels (vertical, MP4)

## Arranque

Requisito: [pnpm](https://pnpm.io/) (único gestor de paquetes permitido en este proyecto).

```bash
pnpm install
pnpm dev
```

La app queda disponible en `http://localhost:5173`.

## Estado Actual

Existe un archivo HTML con el MVP de la idea, pero incluye controles innecesarios que deben eliminarse. El objetivo es simplificar la interfaz para que solo muestre el cronómetro durante la reproducción.

## Flujo de Uso

1. Configurar el tiempo del cronómetro (ej: 15 segundos)
2. Seleccionar la esquina donde se mostrará el reloj
3. Presionar "Play"
4. El overlay muestra únicamente la cuenta regresiva en la esquina seleccionada
5. Al finalizar la cuenta regresiva, se genera automáticamente un video con la duración exacta configurada
6. El video generado está listo para usar en Instagram Reels
