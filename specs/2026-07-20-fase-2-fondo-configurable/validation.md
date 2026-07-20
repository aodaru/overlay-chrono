# Validación — Fase 2: Fondo configurable

## Criterios de éxito

Esta fase se considera completada cuando:

1. El selector de fondo aparece en el panel de controles con las dos opciones: verde chroma (`#00FF00`) y negro fusión (`#000000`).
2. El fondo por defecto es verde (`#00FF00`).
3. Al cambiar el selector, el canvas de vista previa se actualiza inmediatamente sin necesidad de pulsar Play.
4. Durante la reproducción el selector está deshabilitado/oculto junto con el resto de controles.
5. La cuenta regresiva se ve legible en ambos fondos con el reloj en blanco.
6. Al finalizar la cuenta regresiva, el canvas vuelve a mostrar el fondo seleccionado con la duración inicial.
7. No hay elementos visibles durante la reproducción aparte del reloj y el fondo.

## Checklist manual de validación

### Preparación

- [ ] `pnpm dev` levanta sin errores.
- [ ] Abrir la app en el navegador; el fondo inicial es verde.

### Selector y vista previa

- [ ] El dropdown muestra "Verde (chroma key)" seleccionado por defecto.
- [ ] Seleccionar "Negro (fusión)" cambia el canvas a negro inmediatamente.
- [ ] Volver a "Verde (chroma key)" cambia el canvas a verde inmediatamente.

### Durante la reproducción

- [ ] Pulsar Play con fondo verde: solo se ve el reloj sobre verde; controles ocultos.
- [ ] Esperar a que termine; vuelve a idle con fondo verde y duración inicial.
- [ ] Cambiar a fondo negro, pulsar Play: solo se ve el reloj sobre negro; controles ocultos.
- [ ] Esperar a que termine; vuelve a idle con fondo negro y duración inicial.

### Legibilidad

- [ ] El texto del reloj se lee con buen contraste sobre el fondo verde.
- [ ] El texto del reloj se lee con buen contraste sobre el fondo negro.

## Criterio de merge

- [ ] Todos los checks manuales anteriores están marcados.
- [ ] No se introducen cambios en `timer.js` ni en la lógica de cuenta regresiva.
- [ ] No se añaden dependencias nuevas.
- [ ] El código sigue el estilo existente (ES modules, nombres descriptivos, mínima intrusión).
- [ ] Se actualiza este `validation.md` si durante la implementación surge alguna excepción justificada.
