# Fase 11 — Validación final

La Fase 11 no agrega funcionalidades.

Su objetivo es comprobar que el proyecto que vamos a sustentar coincide con el
alcance que realmente implementamos.

---

# 1. Validación automatizada

Ejecutar:

```powershell
.\scripts\final-check.ps1
```

El script comprueba:

- rutas finales;
- ausencia del Asesor Colombia;
- términos que no deberían quedar en la interfaz;
- `git diff --check`;
- tests;
- build.

El resultado esperado termina en:

```text
VALIDACIÓN FINAL AUTOMATIZADA: OK
```

---

# 2. Rutas finales

La aplicación debe tener únicamente estos módulos principales:

```text
/
├─ /calculadora
├─ /planner
└─ /imt2030
```

No debe existir:

```text
/asesor
```

---

# 3. Inicio

Comprobar:

- [ ] la portada explica qué construimos;
- [ ] aparecen Calculadora RF, Planificador e IMT-2030;
- [ ] las flechas del flujo vertical apuntan hacia abajo;
- [ ] no aparecen tiempos de exposición;
- [ ] la redacción habla desde el proyecto y no en tercera persona;
- [ ] Modo exposición está desactivado al abrir la página;
- [ ] Modo exposición solo se activa manualmente.

---

# 4. Calculadora RF

Usar el escenario de referencia n78.

Comprobar:

- [ ] frecuencia;
- [ ] distancia;
- [ ] ancho de banda;
- [ ] potencia TX;
- [ ] sensibilidad;
- [ ] parámetros avanzados;
- [ ] PIRE;
- [ ] FSPL;
- [ ] potencia recibida;
- [ ] ruido;
- [ ] SNR;
- [ ] margen;
- [ ] Shannon;
- [ ] sustituciones numéricas;
- [ ] evaluación técnica.

## Redacción

Los criterios deben:

- explicar qué significa el resultado;
- ser breves;
- no declarar cumplimiento regulatorio integral por una sola condición.

---

# 5. Planificador

Comprobar:

- [ ] gNB y UE se pueden mover;
- [ ] distancia cambia;
- [ ] rumbo cambia;
- [ ] línea del enlace se actualiza;
- [ ] FSPL funciona;
- [ ] UMi LOS funciona;
- [ ] UMi NLOS funciona;
- [ ] UMa funciona;
- [ ] InH funciona;
- [ ] fuera de dominio se muestra como no evaluable;
- [ ] antena fija funciona;
- [ ] antena direccional cambia con azimut;
- [ ] downtilt modifica ganancia;
- [ ] cobertura se genera;
- [ ] cobertura rota con antena;
- [ ] capa puede ocultarse;
- [ ] perfil de terreno carga;
- [ ] Fresnel se grafica;
- [ ] el DEM no se presenta como edificios.

---

# 6. IMT-2030

Caso principal:

```text
Ancho de banda: 100 MHz
SNR:             10 dB
```

Resultado esperado:

```text
Shannon ≈ 345,94 Mbit/s
```

Comprobar:

- [ ] fórmula legible;
- [ ] sustitución legible;
- [ ] 300 Mbit/s no queda descartado matemáticamente;
- [ ] 500 Mbit/s queda por encima del límite del escenario;
- [ ] no se llama throughput real a Shannon;
- [ ] latencia aparece como no evaluable;
- [ ] movilidad aparece como no evaluable;
- [ ] posicionamiento aparece como no evaluable;
- [ ] no aparece “6G NR”;
- [ ] no aparece una afirmación de cumplimiento final IMT-2030.

---

# 7. Popovers técnicos

Comprobar en desktop y móvil:

- [ ] n78;
- [ ] SCS;
- [ ] TDD;
- [ ] SA;
- [ ] SNR;
- [ ] FSPL;
- [ ] PIRE/EIRP;
- [ ] Shannon;
- [ ] MIMO;
- [ ] WP 5D;
- [ ] IMT-2030;
- [ ] RIT;
- [ ] LOS/NLOS;
- [ ] DEM;
- [ ] Fresnel;
- [ ] gNB;
- [ ] UE.

Deben verse:

- semibold;
- línea punteada inferior;
- popover corto;
- sin salirse del viewport.

---

# 8. Modo exposición

Activarlo manualmente.

Revisar:

- [ ] no rompe la alineación de tarjetas;
- [ ] Perfil / Frecuencia / Ancho quedan centrados;
- [ ] mapa sigue siendo usable;
- [ ] controles siguen alineados;
- [ ] textos principales siguen visibles;
- [ ] Calculadora y Planner conservan el modo en la misma pestaña;
- [ ] al salir del modo vuelve la disposición normal.

---

# 9. Responsive

Revisar aproximadamente:

```text
1440 px
1024 px
768 px
390 px
```

No necesitamos perfección de producto comercial, pero sí:

- no tener overflow horizontal injustificado;
- botones utilizables;
- popovers visibles;
- resultados legibles.

---

# 10. Fuentes

Abrir al menos una fuente desde cada grupo:

- [ ] ETSI/3GPP;
- [ ] ITU-R;
- [ ] MinTIC;
- [ ] Copernicus/Open-Meteo.

Confirmar que los enlaces siguen funcionando y corresponden a lo que se afirma.

---

# 11. Informe

Revisar:

```text
docs/phase-10/REPORT_DRAFT.md
docs/phase-10/TRACEABILITY_MATRIX.md
docs/phase-10/SOURCE_INDEX.md
```

Comprobar:

- [ ] ambos enunciados están literales;
- [ ] las interpretaciones están separadas;
- [ ] no aparece la Fase 9 como parte del alcance final;
- [ ] las limitaciones coinciden con la web;
- [ ] IMT-2030 se denomina experimental;
- [ ] Shannon se presenta como límite teórico.

---

# 12. Criterio de cierre

El proyecto se considera técnicamente cerrado cuando:

```text
tests        OK
build        OK
rutas        OK
escenarios   OK
fuentes      OK
UI           OK
informe      consistente
```

Después de este punto no añadimos nuevas funciones salvo que aparezca un error que
afecte directamente la sustentación o el cumplimiento de los enunciados.
