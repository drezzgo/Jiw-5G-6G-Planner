# Fase 8 — IMT-2030 experimental

## Objetivo

Incluir IMT-2030 sin inventar una “6G final”.

La lógica de la fase es:

```text
referencia oficial
      +
resultado que sí calculamos
      ↓
comparación limitada
      ↓
conclusión explícita
```

## Fuente principal

`ITU-R M.2160-0`

La recomendación está vigente desde 2023 y presenta:

- escenarios de uso;
- capacidades;
- rangos y ejemplos para investigación.

La propia recomendación aclara que los valores son objetivos estimados para
investigación y estudio.

Por eso la interfaz evita palabras como:

- `cumple 6G`;
- `certificado IMT-2030`;
- `banda 6G`;
- `6G NR`.

## Evaluación que sí hacemos

Usamos:

```text
C = B log2(1 + SNRlin)
```

Con ello podemos realizar una comprobación unilateral.

### Si Shannon < 300 Mbit/s

Podemos concluir que el escenario no puede alcanzar la referencia de 300 Mbit/s
bajo ese ancho de banda y SNR porque ni siquiera el límite teórico llega a ella.

### Si Shannon >= 300 Mbit/s

Solo podemos decir que esa referencia no queda descartada por capacidad teórica.

No podemos concluir:

`el usuario tendrá 300 Mbit/s`

porque Shannon no representa:

- scheduler;
- protocolos;
- codificación práctica;
- retransmisiones;
- señalización;
- interferencia;
- carga de red.

## Capacidades que dejamos como no evaluables

- peak data rate;
- latency;
- mobility;
- positioning;
- security/resilience;
- sensing;
- AI-related capabilities.

La interfaz explica por qué cada una necesita un modelo adicional.

## Estado actual

### ITU

M.2160 continúa vigente.

En febrero de 2026 WP 5D acordó requisitos de desempeño para la evaluación de
interfaces IMT-2030, con la aprobación formal de nivel superior todavía dentro
del proceso de 2026.

### 3GPP

Release 20 ya contiene estudios de 6G.

Ejemplo:

`3GPP TR 38.914 — Study on 6G Scenarios and requirements`

No se presenta como una especificación radio comercial final.

## UX

Las interpretaciones de esta fase siguen la regla definida en Fase 7D:

- breves;
- naturales;
- explican qué significa el resultado;
- separan lo que podemos concluir de lo que todavía no.
