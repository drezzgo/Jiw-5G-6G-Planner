# Política de datos cartográficos — Fase 4

## Privacidad

La aplicación no necesita conocer la ubicación real del usuario.

Por diseño, esta fase NO:

- solicita permiso de geolocalización;
- llama `navigator.geolocation`;
- intenta detectar la ubicación del dispositivo.

El usuario coloca manualmente puntos de simulación.

## Coordenadas

Las coordenadas representan escenarios de planificación.

No representan necesariamente:

- una instalación real;
- una estación base existente;
- una dirección de residencia;
- una autorización de operación.

## Fuente cartográfica

El mapa raster utiliza OpenStreetMap y muestra la atribución correspondiente.

La capa base sirve únicamente como contexto visual.

Los cálculos de distancia se realizan en nuestro Core TypeScript, no se obtienen del proveedor de mapas.
