import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';

export type HelpVisualKind =
  | 'distance'
  | 'bandwidth'
  | 'isotropic'
  | 'sensitivity'
  | 'tdd'
  | 'scs'
  | 'none';

export type HelpDefinition = {
  title: string;
  what: string;
  increase: string;
  decrease: string;
  equations: string[];
  example?: string;
  visual?: HelpVisualKind;
};

const parameterHelp: Record<string, HelpDefinition> = {
  frequency: {
    title: 'Frecuencia',
    what:
      'Es la frecuencia de la portadora de radio utilizada para transportar la señal.',
    increase:
      'Si lo demás no cambia, aumenta la pérdida en espacio libre. La potencia recibida tiende a disminuir y también puede cambiar la banda 5G con la que es compatible el escenario.',
    decrease:
      'Si lo demás no cambia, disminuye la pérdida en espacio libre y la potencia recibida tiende a mejorar.',
    equations: [
      'Pérdida en espacio libre (FSPL)',
      'Potencia recibida',
      'SNR',
      'Margen de enlace',
      'Capacidad de Shannon',
    ],
    example:
      'Ejemplo: 3500 MHz está dentro de la banda n78 definida por 3GPP, pero la regulación colombiana debe revisarse por separado.',
  },
  distance: {
    title: 'Distancia',
    what:
      'Es la separación entre el transmisor y el receptor.',
    increase:
      'Aumenta la pérdida de propagación. Normalmente bajan la potencia recibida, el SNR, el margen y la capacidad teórica.',
    decrease:
      'Reduce la pérdida de propagación y normalmente mejora el enlace.',
    equations: [
      'Pérdida en espacio libre (FSPL)',
      'Potencia recibida',
      'SNR',
      'Margen de enlace',
      'Capacidad de Shannon',
    ],
    example:
      'Comparar 200 m con 30 km permite ver cómo una sola variable puede hacer que el enlace deje de ser viable.',
    visual: 'distance',
  },
  bandwidth: {
    title: 'Ancho de banda',
    what:
      'Es el rango de frecuencias ocupado por el canal utilizado en el enlace.',
    increase:
      'Aumenta la potencia total de ruido térmico. En este modelo el SNR disminuye, aunque la capacidad teórica puede aumentar porque se dispone de más ancho de banda.',
    decrease:
      'Reduce el ruido térmico y puede mejorar el SNR, pero deja menos ancho disponible para transportar información.',
    equations: [
      'Ruido térmico',
      'SNR',
      'Capacidad de Shannon',
    ],
    example:
      'Un canal de 100 MHz dispone de más espectro que uno de 20 MHz, pero también integra más ruido térmico.',
    visual: 'bandwidth',
  },
  txPower: {
    title: 'Potencia de transmisión',
    what:
      'Es la potencia entregada por el transmisor antes de considerar la ganancia de antena y las pérdidas del lado transmisor.',
    increase:
      'Aumenta la PIRE y, si lo demás no cambia, mejora la potencia recibida, el SNR y el margen.',
    decrease:
      'Reduce la PIRE y empeora las condiciones del enlace.',
    equations: [
      'PIRE (EIRP)',
      'Potencia recibida',
      'SNR',
      'Margen de enlace',
      'Capacidad de Shannon',
    ],
  },
  sensitivity: {
    title: 'Sensibilidad del receptor',
    what:
      'Es el nivel mínimo de potencia recibida que se usa como referencia para considerar utilizable el receptor en este escenario.',
    increase:
      'Si el número se hace menos negativo, por ejemplo de −90 a −80 dBm, el receptor se considera menos sensible y el margen disminuye.',
    decrease:
      'Si el número se hace más negativo, por ejemplo de −90 a −100 dBm, el receptor se considera más sensible y el margen aumenta.',
    equations: [
      'Margen de enlace',
    ],
    example:
      '−100 dBm representa mayor sensibilidad que −80 dBm.',
    visual: 'sensitivity',
  },
  txGain: {
    title: 'Ganancia de antena transmisora',
    what:
      'Representa cuánto concentra la antena transmisora la energía en una dirección, comparada con una antena isotrópica ideal.',
    increase:
      'Aumenta la PIRE y mejora la potencia recibida en la dirección considerada.',
    decrease:
      'Reduce la PIRE y la potencia recibida.',
    equations: [
      'PIRE (EIRP)',
      'Potencia recibida',
      'SNR',
      'Margen de enlace',
      'Capacidad de Shannon',
    ],
    example:
      'Una antena isotrópica es una referencia matemática: radiaría por igual en todas las direcciones. Una antena real puede concentrar energía en ciertas direcciones.',
    visual: 'isotropic',
  },
  txLoss: {
    title: 'Pérdidas del lado transmisor',
    what:
      'Agrupan pérdidas antes de la antena transmisora, por ejemplo en cables, conectores u otros elementos de radiofrecuencia.',
    increase:
      'Reduce la PIRE y empeora el enlace.',
    decrease:
      'Permite que una mayor parte de la potencia llegue efectivamente a la antena.',
    equations: [
      'PIRE (EIRP)',
      'Potencia recibida',
      'SNR',
      'Margen de enlace',
      'Capacidad de Shannon',
    ],
  },
  rxGain: {
    title: 'Ganancia de antena receptora',
    what:
      'Representa cuánto favorece la antena receptora la señal que llega desde la dirección evaluada, comparada con una antena isotrópica ideal.',
    increase:
      'Aumenta la potencia recibida y mejora el SNR y el margen.',
    decrease:
      'Reduce la potencia recibida y empeora el enlace.',
    equations: [
      'Potencia recibida',
      'SNR',
      'Margen de enlace',
      'Capacidad de Shannon',
    ],
    example:
      'La antena isotrópica no es una antena física: se usa como referencia ideal para expresar ganancias en dBi.',
    visual: 'isotropic',
  },
  rxLoss: {
    title: 'Pérdidas del lado receptor',
    what:
      'Agrupan pérdidas entre la antena receptora y el receptor, por ejemplo en cables, conectores u otros elementos de radiofrecuencia.',
    increase:
      'Reduce la potencia que finalmente llega al receptor.',
    decrease:
      'Mejora la potencia disponible en el receptor.',
    equations: [
      'Potencia recibida',
      'SNR',
      'Margen de enlace',
      'Capacidad de Shannon',
    ],
  },
  noiseFigure: {
    title: 'Figura de ruido',
    what:
      'Indica cuánto ruido adicional introduce el receptor respecto a un receptor ideal.',
    increase:
      'Aumenta el ruido total calculado, reduce el SNR y puede reducir la capacidad teórica.',
    decrease:
      'Mejora el comportamiento del receptor frente al ruido.',
    equations: [
      'Potencia de ruido',
      'SNR',
      'Capacidad de Shannon',
    ],
  },
  temperature: {
    title: 'Temperatura de referencia',
    what:
      'Es la temperatura utilizada por el modelo para calcular el ruido térmico.',
    increase:
      'Aumenta el ruido térmico y reduce el SNR.',
    decrease:
      'Reduce el ruido térmico calculado y mejora el SNR.',
    equations: [
      'Potencia de ruido',
      'SNR',
      'Capacidad de Shannon',
    ],
  },
  bandN78: {
    title: 'Banda n78',
    what:
      'Es una banda de operación definida para 5G NR. El perfil técnico de esta herramienta usa el rango 3300–3800 MHz.',
    increase:
      'No es un valor que aumente o disminuya. Cambiar de banda cambia los rangos de frecuencia y las reglas técnicas que deben evaluarse.',
    decrease:
      'No aplica como valor numérico.',
    equations: [
      'No entra directamente en las ecuaciones; condiciona la compatibilidad tecnológica.',
    ],
  },
  scs: {
    title: 'Separación entre subportadoras (SCS)',
    what:
      'Es la separación en frecuencia entre subportadoras OFDM. Esta herramienta usa 30 kHz como parte del perfil tecnológico evaluado.',
    increase:
      'En una implementación NR real cambia la numerología y las combinaciones válidas de ancho de banda. Esta fase no la usa directamente en las ecuaciones de propagación.',
    decrease:
      'También modifica la numerología. No cambia directamente la pérdida de espacio libre de este modelo.',
    equations: [
      'No entra directamente en las ecuaciones RF de esta fase; se usa en reglas de compatibilidad.',
    ],
    visual: 'scs',
  },
  tdd: {
    title: 'Duplexación por división en el tiempo (TDD)',
    what:
      'TDD permite usar la misma banda para transmisión y recepción, separándolas en diferentes intervalos de tiempo.',
    increase:
      'No es un valor numérico. Cambiar el modo de duplexación afecta la compatibilidad con la banda y el diseño de la red.',
    decrease:
      'No aplica como valor numérico.',
    equations: [
      'No entra directamente en el presupuesto de enlace; se evalúa como compatibilidad tecnológica.',
    ],
    visual: 'tdd',
  },
  sa: {
    title: 'Arquitectura 5G SA',
    what:
      'SA significa Standalone: el acceso 5G NR funciona con un núcleo 5G, sin depender de una red 4G como ancla.',
    increase:
      'No es un valor numérico. Cambiar la arquitectura modifica requisitos de red y compatibilidad, no las ecuaciones RF básicas.',
    decrease:
      'No aplica como valor numérico.',
    equations: [
      'No entra directamente en el presupuesto de enlace; corresponde a arquitectura de red.',
    ],
  },
};

function ConceptVisual({
  kind,
}: {
  kind: HelpVisualKind;
}) {
  if (kind === 'none') return null;

  if (kind === 'isotropic') {
    return (
      <figure className="help-visual">
        <svg viewBox="0 0 320 128" role="img" aria-label="Comparación conceptual entre radiación isotrópica y direccional">
          <g transform="translate(78 62)">
            <circle r="34" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.28" />
            <circle r="20" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.45" />
            <circle r="4" fill="currentColor" />
            <path d="M0-42v-12M0 42v12M-42 0h-12M42 0h12M-30-30l-9-9M30 30l9 9M30-30l9-9M-30 30l-9 9" stroke="currentColor" strokeWidth="2" />
            <text x="0" y="72" textAnchor="middle">Isotrópica ideal</text>
          </g>
          <g transform="translate(238 62)">
            <circle r="4" fill="currentColor" />
            <path d="M3-5 C45-35 62-26 72 0 C62 26 45 35 3 5 Z" fill="currentColor" opacity="0.18" stroke="currentColor" strokeWidth="2" />
            <path d="M5 0h66" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" />
            <text x="0" y="72" textAnchor="middle">Direccional</text>
          </g>
        </svg>
        <figcaption>
          La isotrópica es una referencia matemática; una antena real puede concentrar energía.
        </figcaption>
      </figure>
    );
  }

  if (kind === 'bandwidth') {
    return (
      <figure className="help-visual">
        <svg viewBox="0 0 320 112" role="img" aria-label="Comparación conceptual de ancho de banda estrecho y amplio">
          <line x1="24" y1="72" x2="296" y2="72" stroke="currentColor" strokeWidth="2" />
          <rect x="54" y="42" width="62" height="30" rx="4" fill="currentColor" opacity="0.2" />
          <rect x="168" y="27" width="108" height="45" rx="4" fill="currentColor" opacity="0.34" />
          <text x="85" y="94" textAnchor="middle">20 MHz</text>
          <text x="222" y="94" textAnchor="middle">100 MHz</text>
          <text x="160" y="16" textAnchor="middle">Frecuencia →</text>
        </svg>
        <figcaption>
          Más ancho de banda ofrece más espectro para datos, pero también integra más ruido térmico.
        </figcaption>
      </figure>
    );
  }

  if (kind === 'distance') {
    return (
      <figure className="help-visual">
        <svg viewBox="0 0 320 112" role="img" aria-label="Comparación conceptual de distancias corta y larga en un enlace">
          <g transform="translate(34 42)">
            <path d="M0 30V0M-10 6L0-4L10 6" stroke="currentColor" strokeWidth="3" fill="none" />
            <path d="M0 6c14 0 14 22 28 22M0 6c22 0 22 34 44 34" stroke="currentColor" fill="none" opacity="0.45" />
          </g>
          <circle cx="112" cy="70" r="7" fill="currentColor" />
          <circle cx="270" cy="70" r="7" fill="currentColor" opacity="0.7" />
          <line x1="45" y1="86" x2="112" y2="86" stroke="currentColor" strokeWidth="2" />
          <line x1="45" y1="100" x2="270" y2="100" stroke="currentColor" strokeWidth="2" />
          <text x="80" y="82" textAnchor="middle">corta</text>
          <text x="158" y="96" textAnchor="middle">larga</text>
        </svg>
        <figcaption>
          En espacio libre, aumentar la distancia aumenta la pérdida del enlace.
        </figcaption>
      </figure>
    );
  }

  if (kind === 'sensitivity') {
    return (
      <figure className="help-visual">
        <svg viewBox="0 0 320 112" role="img" aria-label="Ejemplo conceptual de sensibilidad del receptor">
          <line x1="32" y1="55" x2="288" y2="55" stroke="currentColor" strokeWidth="3" />
          <circle cx="92" cy="55" r="7" fill="currentColor" />
          <circle cx="226" cy="55" r="7" fill="currentColor" opacity="0.65" />
          <text x="92" y="38" textAnchor="middle">−100 dBm</text>
          <text x="226" y="38" textAnchor="middle">−80 dBm</text>
          <text x="92" y="84" textAnchor="middle">más sensible</text>
          <text x="226" y="84" textAnchor="middle">menos sensible</text>
        </svg>
        <figcaption>
          En dBm negativos, un valor más negativo puede representar un receptor más sensible.
        </figcaption>
      </figure>
    );
  }

  if (kind === 'tdd') {
    return (
      <figure className="help-visual">
        <svg viewBox="0 0 320 118" role="img" aria-label="Ejemplo conceptual de TDD separando subida y bajada en el tiempo">
          <text x="24" y="24">Tiempo →</text>
          <g transform="translate(24 40)">
            <rect x="0" y="0" width="66" height="38" rx="5" fill="currentColor" opacity="0.28" />
            <rect x="70" y="0" width="38" height="38" rx="5" fill="currentColor" opacity="0.12" />
            <rect x="112" y="0" width="66" height="38" rx="5" fill="currentColor" opacity="0.28" />
            <rect x="182" y="0" width="38" height="38" rx="5" fill="currentColor" opacity="0.12" />
            <rect x="224" y="0" width="66" height="38" rx="5" fill="currentColor" opacity="0.28" />
            <text x="33" y="24" textAnchor="middle">DL</text>
            <text x="89" y="24" textAnchor="middle">UL</text>
            <text x="145" y="24" textAnchor="middle">DL</text>
            <text x="201" y="24" textAnchor="middle">UL</text>
            <text x="257" y="24" textAnchor="middle">DL</text>
          </g>
          <text x="24" y="101">Misma banda, distintos instantes</text>
        </svg>
        <figcaption>
          TDD alterna transmisión y recepción en el tiempo dentro de la misma banda.
        </figcaption>
      </figure>
    );
  }

  if (kind === 'scs') {
    return (
      <figure className="help-visual">
        <svg viewBox="0 0 320 112" role="img" aria-label="Ejemplo conceptual de separación entre subportadoras">
          <line x1="24" y1="82" x2="296" y2="82" stroke="currentColor" strokeWidth="2" />
          {[70, 105, 140, 175, 210, 245].map((x) => (
            <line key={x} x1={x} y1="82" x2={x} y2="35" stroke="currentColor" strokeWidth="3" />
          ))}
          <path d="M105 24h35" stroke="currentColor" strokeWidth="2" />
          <path d="M105 20l-6 4 6 4M140 20l6 4-6 4" fill="none" stroke="currentColor" strokeWidth="2" />
          <text x="122" y="17" textAnchor="middle">30 kHz</text>
          <text x="160" y="104" textAnchor="middle">frecuencia</text>
        </svg>
        <figcaption>
          SCS describe la separación entre subportadoras OFDM; aquí el perfil usa 30 kHz.
        </figcaption>
      </figure>
    );
  }

  return null;
}

export function HelpPopover({
  definition,
}: {
  definition: HelpDefinition;
}) {
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [position, setPosition] = useState({
    left: 16,
    top: 16,
    placement: 'bottom' as 'top' | 'bottom',
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;

    function updatePosition() {
      const trigger = triggerRef.current;
      if (!trigger) return;

      const rect = trigger.getBoundingClientRect();
      const width = Math.min(390, window.innerWidth - 24);
      const estimatedHeight = 430;
      const margin = 12;

      const left = Math.min(
        Math.max(rect.left + rect.width / 2 - width / 2, margin),
        window.innerWidth - width - margin,
      );

      const roomBelow = window.innerHeight - rect.bottom;
      const useTop = roomBelow < Math.min(estimatedHeight, window.innerHeight * 0.58)
        && rect.top > roomBelow;

      const top = useTop
        ? Math.max(margin, rect.top - Math.min(estimatedHeight, window.innerHeight - 24) - 10)
        : Math.min(window.innerHeight - margin, rect.bottom + 10);

      setPosition({
        left,
        top,
        placement: useTop ? 'top' : 'bottom',
      });
    }

    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);

    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [open]);

  const tooltip = (
    <div
      className={`help-popover-portal help-popover-portal--${position.placement}`}
      role="tooltip"
      style={{
        left: `${position.left}px`,
        top: `${position.top}px`,
      }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <strong className="help-popover__title">
        {definition.title}
      </strong>

      {definition.visual && (
        <ConceptVisual kind={definition.visual} />
      )}

      <span className="help-popover__section">
        <b>¿Qué es?</b>
        {definition.what}
      </span>

      <span className="help-popover__section">
        <b>Si aumenta</b>
        {definition.increase}
      </span>

      <span className="help-popover__section">
        <b>Si disminuye</b>
        {definition.decrease}
      </span>

      {definition.example && (
        <span className="help-popover__section help-popover__example">
          <b>Ejemplo</b>
          {definition.example}
        </span>
      )}

      <span className="help-popover__section">
        <b>Se relaciona con</b>
        {definition.equations.join(' · ')}
      </span>
    </div>
  );

  return (
    <span className="help-popover">
      <button
        ref={triggerRef}
        type="button"
        className="help-popover__trigger"
        aria-label={`Ayuda sobre ${definition.title}`}
        aria-expanded={open}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onClick={() => setOpen((value) => !value)}
      >
        ?
      </button>

      {mounted && open && createPortal(tooltip, document.body)}
    </span>
  );
}

export function LabelWithHelp({
  label,
  helpKey,
}: {
  label: ReactNode;
  helpKey: keyof typeof parameterHelp;
}) {
  return (
    <span className="label-with-help">
      <span>{label}</span>
      <HelpPopover
        definition={parameterHelp[helpKey]}
      />
    </span>
  );
}
