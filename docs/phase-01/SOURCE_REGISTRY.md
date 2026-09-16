# Registro base de fuentes — Fase 1

Fecha de verificación inicial: 2026-09-16.

## ITU_R_P_525_5_2024

- Organismo: ITU-R
- Documento: Recommendation ITU-R P.525-5
- Título: Calculation of free-space attenuation
- Aprobación: noviembre de 2024
- Estado observado: In force / Main
- Uso: FSPL baseline
- URL:
  https://www.itu.int/rec/R-REC-P.525-5-202411-I/en

## 3GPP_TR_38_901_R19_4_0

- Organismo: 3GPP
- Documento: TR 38.901
- Título: Study on channel model for frequencies from 0.5 to 100 GHz
- Tipo: Technical Report
- Estado observado: Under change control
- Versión seleccionada de referencia: Release 19, v19.4.0
- Fecha mostrada por portal 3GPP: 2026-06-23
- Uso futuro: modelos UMi/UMa/Indoor
- URL:
  https://portal.3gpp.org/desktopmodules/Specifications/SpecificationDetails.aspx?specificationId=3173

## 3GPP_TS_38_101_1

- Organismo: 3GPP
- Documento: TS 38.101-1
- Título: NR; User Equipment (UE) radio transmission and reception; Part 1: Range 1 Standalone
- Estado observado: Under change control
- Uso futuro: perfil UE FR1 SA y bandas
- URL:
  https://portal.3gpp.org/desktopmodules/Specifications/SpecificationDetails.aspx?specificationId=3283

## ETSI_TS_138_101_1

- Organismo: ETSI / 3GPP publication
- Documento consultado: ETSI TS 138 101-1
- Uso: respaldo documental de tablas de bandas NR cuando fijemos versión.
- Ejemplo comprobado en una versión publicada:
  n78 = 3300–3800 MHz, TDD.
- La regla no se activará hasta fijar explícitamente la versión usada por el perfil de la aplicación.
- URL:
  https://www.etsi.org/deliver/etsi_ts/138100_138199/13810101/

## 3GPP_TS_38_104

- Organismo: 3GPP
- Título: NR; Base Station (BS) radio transmission and reception
- Uso futuro: especificaciones RF gNB
- URL:
  https://portal.3gpp.org/desktopmodules/Specifications/SpecificationDetails.aspx?specificationId=3202

## 3GPP_TS_23_501

- Organismo: 3GPP
- Título: System architecture for the 5G System (5GS)
- Uso futuro: arquitectura 5GS/SA
- URL:
  https://portal.3gpp.org/desktopmodules/Specifications/SpecificationDetails.aspx?specificationId=3144

## 3GPP_TS_33_501

- Organismo: 3GPP
- Título: Security architecture and procedures for 5G System
- Uso futuro: Advisor de seguridad
- URL:
  https://portal.3gpp.org/desktopmodules/Specifications/SpecificationDetails.aspx?specificationId=3169

## ITU_R_M_2160_0_2023

- Organismo: ITU-R
- Documento: Recommendation ITU-R M.2160-0
- Título: Framework and overall objectives of the future development of IMT for 2030 and beyond
- Aprobación: 2023-11-13
- Estado observado: In force / Main
- Uso: marco IMT-2030
- URL:
  https://www.itu.int/rec/R-REC-M.2160-0-202311-I/en

## ITU_IMT2030_WP5D_2026

- Organismo: ITU-R WP 5D
- Estado observado en septiembre de 2026:
  - WP 5D completó en febrero de 2026 el draft de requisitos técnicos mínimos;
  - completó en junio de 2026 el draft de guías de evaluación;
  - ambos habían sido enviados a SG 5 para aprobación prevista en diciembre de 2026.
- Uso: impedir que la aplicación presente estos documentos como una “norma 6G final” antes de su aprobación.
- URL:
  https://www.itu.int/en/ITU-R/study-groups/rsg5/rwp5d/imt-2030/pages/default.aspx

## NIST_BOLTZMANN

- Organismo: NIST
- Valor:
  `k = 1.380649 × 10^-23 J/K`
- Uso: ruido térmico.
- URL:
  https://www.nist.gov/si-redefinition/kelvin/kelvin-boltzmann-constant

## SHANNON_1948

- Autor: Claude E. Shannon
- Obra: A Mathematical Theory of Communication
- Publicación: Bell System Technical Journal, 1948
- Uso: capacidad teórica de Shannon.
- DOI parte I:
  https://doi.org/10.1002/j.1538-7305.1948.tb01338.x
- DOI parte II:
  https://doi.org/10.1002/j.1538-7305.1948.tb00917.x

---

# Regla de mantenimiento

Antes de utilizar una fuente para una regla visible del dashboard:

1. fijar versión;
2. fijar sección/tabla cuando corresponda;
3. registrar fecha de verificación;
4. registrar qué afirmación concreta respalda;
5. no extrapolar más allá de lo que el documento afirma.
