export type TechnicalTermKey =
  | '3gpp'
  | 'nr'
  | 'n78'
  | 'scs'
  | 'tdd'
  | 'sa'
  | 'snr'
  | 'fspl'
  | 'pire'
  | 'shannon'
  | 'mimo'
  | 'wp5d'
  | 'imt2030'
  | 'rit'
  | 'srit'
  | 'los'
  | 'nlos'
  | 'dem'
  | 'fresnel'
  | 'gnb'
  | 'ue'
  | 'ofdm';

export interface TechnicalTermDefinition {
  title: string;
  description: string;
}

export const technicalGlossary: Record<
  TechnicalTermKey,
  TechnicalTermDefinition
> = {
  '3gpp': {
    title: '3GPP',
    description:
      'Organización que desarrolla especificaciones para redes móviles como 5G.',
  },

  nr: {
    title: 'NR',
    description:
      'New Radio: tecnología de acceso radio utilizada por 5G.',
  },

  n78: {
    title: 'n78',
    description:
      'Banda 5G NR entre 3300 y 3800 MHz en el perfil que usamos.',
  },

  scs: {
    title: 'SCS',
    description:
      'Separación entre subportadoras OFDM. En nuestro perfil usamos 30 kHz.',
  },

  tdd: {
    title: 'TDD',
    description:
      'Transmisión y recepción usan la misma banda, pero en tiempos distintos.',
  },

  sa: {
    title: 'SA',
    description:
      'Standalone: arquitectura 5G que utiliza un núcleo 5G.',
  },

  snr: {
    title: 'SNR',
    description:
      'Relación señal/ruido: indica cuánto sobresale la señal frente al ruido.',
  },

  fspl: {
    title: 'FSPL',
    description:
      'Pérdida ideal de propagación en espacio libre.',
  },

  pire: {
    title: 'PIRE / EIRP',
    description:
      'Potencia transmitida después de considerar ganancia y pérdidas de la antena.',
  },

  shannon: {
    title: 'Shannon',
    description:
      'Límite teórico de capacidad de un canal según ancho de banda y SNR.',
  },

  mimo: {
    title: 'MIMO',
    description:
      'Uso de varias antenas para transmitir y recibir información.',
  },

  wp5d: {
    title: 'WP 5D',
    description:
      'Grupo de ITU-R que trabaja en sistemas IMT, incluido IMT-2030.',
  },

  imt2030: {
    title: 'IMT-2030',
    description:
      'Marco de la UIT para la próxima generación móvil, comúnmente asociada con 6G.',
  },

  rit: {
    title: 'RIT',
    description:
      'Tecnología de interfaz radio candidata dentro del proceso IMT.',
  },

  srit: {
    title: 'SRIT',
    description:
      'Conjunto de tecnologías de interfaz radio candidatas dentro del proceso IMT.',
  },

  los: {
    title: 'LOS',
    description:
      'Line of Sight: existe un trayecto directo sin una obstrucción dominante.',
  },

  nlos: {
    title: 'NLOS',
    description:
      'Non-Line of Sight: el trayecto directo está bloqueado u obstruido.',
  },

  dem: {
    title: 'DEM',
    description:
      'Modelo digital de elevación: representa la altura del terreno.',
  },

  fresnel: {
    title: 'Zona de Fresnel',
    description:
      'Región alrededor del trayecto directo donde los obstáculos pueden afectar la señal.',
  },

  gnb: {
    title: 'gNB',
    description:
      'Estación base que conecta los equipos de usuario con la red 5G.',
  },

  ue: {
    title: 'UE',
    description:
      'Equipo de usuario, por ejemplo un celular, módem o CPE.',
  },

  ofdm: {
    title: 'OFDM',
    description:
      'Técnica que divide el canal en múltiples subportadoras.',
  },
};
