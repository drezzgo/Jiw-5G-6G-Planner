export type EvidenceType =
  | 'STANDARD'
  | 'REGULATION'
  | 'REFERENCE';

export interface EvidenceReference {
  id: string;
  type: EvidenceType;
  authority: string;
  document: string;
  versionOrDate: string;
  locator: string;
  excerpt: string;
  supports: string;
  scopeNote: string;
  url: string;
}

export const evidenceRegistry: Record<string, EvidenceReference> = {
  ETSI_N78_OPERATING_BAND: {
    id: 'ETSI_N78_OPERATING_BAND',
    type: 'STANDARD',
    authority: 'ETSI / 3GPP',
    document:
      'ETSI TS 138 101-1 V18.7.0 (3GPP TS 38.101-1 Release 18)',
    versionOrDate: '2024-11',
    locator:
      'Cláusula 5.2 · Tabla 5.2-1 · página PDF 35',
    excerpt:
      '“n78 3300 MHz – 3800 MHz … TDD”',
    supports:
      'El rango de operación n78 y su modo de duplexación TDD.',
    scopeNote:
      'Es una especificación técnica 5G NR. No concede por sí sola autorización para usar espectro en Colombia.',
    url:
      'https://www.etsi.org/deliver/etsi_TS/138100_138199/13810101/18.07.00_60/ts_13810101v180700p.pdf#page=35',
  },

  ETSI_N78_BANDWIDTH_SCS30: {
    id: 'ETSI_N78_BANDWIDTH_SCS30',
    type: 'STANDARD',
    authority: 'ETSI / 3GPP',
    document:
      'ETSI TS 138 101-1 V18.7.0 (3GPP TS 38.101-1 Release 18)',
    versionOrDate: '2024-11',
    locator:
      'Cláusula 5.3.5 · Tabla 5.3.5-1 · página PDF 62',
    excerpt:
      '“n78 · 30 kHz · 10, 15, 20, 25, 30, 40, 50, 60, 70, 80, 90, 100 MHz”',
    supports:
      'Las combinaciones de ancho de banda de canal para n78 con SCS de 30 kHz usadas por este perfil.',
    scopeNote:
      'La tabla pertenece a requisitos de UE NR FR1 Standalone. La aplicación evalúa únicamente el subconjunto implementado.',
    url:
      'https://www.etsi.org/deliver/etsi_TS/138100_138199/13810101/18.07.00_60/ts_13810101v180700p.pdf#page=62',
  },

  MINTIC_3947_ART1_3500: {
    id: 'MINTIC_3947_ART1_3500',
    type: 'REGULATION',
    authority: 'Ministerio TIC de Colombia',
    document:
      'Resolución MinTIC 3947 de 2023 — compilación jurídica vigente consultada',
    versionOrDate: 'Consulta: 2026-09-16',
    locator:
      'Artículo 1 · numeral 5 y parágrafo 1',
    excerpt:
      '“3300 MHz a 3620 MHz, en adelante banda de 3500 MHz.”',
    supports:
      'El rango denominado banda de 3500 MHz dentro del proceso de asignación regulado por esa resolución.',
    scopeNote:
      'La resolución regula el proceso y obligaciones de los asignatarios de espectro. No debe interpretarse como permiso general para transmitir.',
    url:
      'https://normograma.mintic.gov.co/mintic/compilacion/docs/resolucion_mintic_3947_2023.htm',
  },

  MINTIC_3947_ART26_TDD: {
    id: 'MINTIC_3947_ART26_TDD',
    type: 'REGULATION',
    authority: 'Ministerio TIC de Colombia',
    document:
      'Resolución MinTIC 3947 de 2023 — compilación jurídica vigente consultada',
    versionOrDate: 'Consulta: 2026-09-16',
    locator:
      'Artículo 26 · literal a)',
    excerpt:
      '“...solo podrá emplear... TDD ... en la banda de 3500 MHz.”',
    supports:
      'La condición TDD para los asignatarios a los que aplica el artículo 26.',
    scopeNote:
      'La obligación está dirigida a los asignatarios de permisos de uso del espectro de ese proceso; no es una autorización de laboratorio.',
    url:
      'https://normograma.mintic.gov.co/mintic/compilacion/docs/resolucion_mintic_3947_2023.htm',
  },

  MINTIC_3947_ART28_SYNC: {
    id: 'MINTIC_3947_ART28_SYNC',
    type: 'REGULATION',
    authority: 'Ministerio TIC de Colombia',
    document:
      'Resolución MinTIC 3947 de 2023 — compilación jurídica vigente consultada',
    versionOrDate: 'Consulta: 2026-09-16',
    locator:
      'Artículo 28 · sincronización de redes en 3500 MHz',
    excerpt:
      '“...deben estar sincronizadas para evitar interferencia mutua.”',
    supports:
      'La exigencia de sincronización entre determinadas redes TDD en la misma zona geográfica.',
    scopeNote:
      'Es una obligación de operación para los sujetos regulados por la resolución; se mostrará como contexto regulatorio, no como resultado del presupuesto de enlace.',
    url:
      'https://normograma.mintic.gov.co/mintic/compilacion/docs/resolucion_mintic_3947_2023.htm',
  },

  MINTIC_3947_ART20_SPEED: {
    id: 'MINTIC_3947_ART20_SPEED',
    type: 'REGULATION',
    authority: 'Ministerio TIC de Colombia',
    document:
      'Resolución MinTIC 3947 de 2023 — compilación jurídica vigente consultada',
    versionOrDate: 'Consulta: 2026-09-16',
    locator:
      'Artículo 20 · numeral 1 · tabla de velocidades pico teóricas',
    excerpt:
      '“Un bloque de 80 MHz | 1026,4 | 68,6”',
    supports:
      'La referencia de velocidad pico teórica para un bloque de 80 MHz en la banda de 3500 MHz dentro de esa resolución.',
    scopeNote:
      'Son valores teóricos regulatorios para asignatarios de la subasta; no equivalen a velocidad real del usuario ni a capacidad Shannon.',
    url:
      'https://normograma.mintic.gov.co/mintic/compilacion/docs/resolucion_mintic_3947_2023.htm',
  },
};

export const evidenceByCriterion: Record<string, string[]> = {
  'n78-frequency': [
    'ETSI_N78_OPERATING_BAND',
    'MINTIC_3947_ART1_3500',
  ],
  'n78-duplex': [
    'ETSI_N78_OPERATING_BAND',
    'MINTIC_3947_ART26_TDD',
    'MINTIC_3947_ART28_SYNC',
  ],
  'n78-bandwidth-scs30': [
    'ETSI_N78_BANDWIDTH_SCS30',
  ],
};

export function getEvidenceForCriterion(
  criterionId: string,
): EvidenceReference[] {
  return (evidenceByCriterion[criterionId] ?? [])
    .map((id) => evidenceRegistry[id])
    .filter(Boolean);
}
