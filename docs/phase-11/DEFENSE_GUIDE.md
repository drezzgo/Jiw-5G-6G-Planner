# Guía corta para la sustentación

No es un guion para memorizar. Es el orden recomendado para no perderse dentro de
la web.

## 1. Inicio

Explicar en una frase:

> Construimos una herramienta web para modelar un enlace 5G, revisar cómo cambian
> sus condiciones con el entorno y contrastar parte de esos resultados con
> referencias técnicas 5G e IMT-2030.

## 2. Calculadora

Mostrar el escenario n78 de referencia.

Enfatizar:

- parámetros de entrada;
- PIRE;
- potencia recibida;
- SNR;
- margen;
- Shannon.

Idea principal:

> Primero comprobamos el enlace de forma matemática.

## 3. Planner

Mover el UE.

Cambiar:

```text
FSPL → UMi LOS → UMi NLOS
```

Idea principal:

> La geometría puede ser la misma, pero el modelo de entorno cambia la pérdida.

Después girar la antena.

Idea principal:

> Una antena direccional no entrega la misma ganancia en todas las direcciones.

## 4. Terreno

Obtener perfil.

Idea principal:

> El relieve puede obstruir la trayectoria o acercarse a la zona de Fresnel, pero
> el DEM no representa edificios.

## 5. IMT-2030

Usar:

```text
100 MHz
10 dB
```

Idea principal:

> Aquí no decimos que simulamos una red 6G final. Comparamos referencias con lo que
> nuestro modelo sí puede calcular.

## 6. Cierre

Relacionar con los enunciados:

> El primer enunciado queda representado por la simulación, los parámetros y los
> estándares. El segundo se cubre con la evaluación técnica, las especificaciones,
> el contexto colombiano, la calidad y la seguridad documentadas en el proyecto.

## Si el profesor pregunta algo que no modelamos

Responderlo como limitación.

Ejemplos:

- latencia real;
- edificios;
- Massive MIMO completo;
- throughput real;
- autorización de espectro;
- interfaz 6G final.

No convertir una limitación en un resultado inventado.
