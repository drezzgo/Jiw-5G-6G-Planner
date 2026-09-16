import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';

export type PlannerHelpKey =
  | 'gnb'
  | 'ue'
  | 'nr'
  | 'n78'
  | 'propagation'
  | 'fspl'
  | 'umi'
  | 'uma'
  | 'inh'
  | 'los'
  | 'nlos'
  | 'distance2d'
  | 'distance3d'
  | 'bearing'
  | 'pathLoss'
  | 'receivedPower'
  | 'snr'
  | 'linkMargin'
  | 'heights'
  | 'antennaMode'
  | 'fixedGain'
  | 'azimuth'
  | 'downtilt'
  | 'effectiveGain'
  | 'beamwidth'
  | 'coverage'
  | 'coverageRadius'
  | 'gridResolution';

type HelpDefinition = {
  title: string;
  what: string;
  effect?: string;
  example?: string;
};

const help: Record<PlannerHelpKey, HelpDefinition> = {
  gnb: {
    title: 'gNB',
    what:
      'Es la estación base de 5G NR. Es el equipo de la red que transmite y recibe señales de radio hacia los usuarios.',
    effect:
      'Moverla cambia la distancia y el rumbo hacia el UE. En fases posteriores también influirán su altura, orientación y patrón de antena.',
  },
  ue: {
    title: 'UE',
    what:
      'UE significa User Equipment o equipo de usuario: por ejemplo, un celular, módem o CPE compatible con la red.',
    effect:
      'Moverlo cambia la geometría del enlace y por tanto la pérdida de propagación calculada.',
  },
  nr: {
    title: '5G NR',
    what:
      'NR significa New Radio. Es la tecnología de acceso radio definida por 3GPP para 5G.',
  },
  n78: {
    title: 'Banda n78',
    what:
      'Es una banda de operación 5G NR. En este proyecto se usa como perfil técnico de referencia alrededor de 3,5 GHz.',
    effect:
      'La frecuencia utilizada influye en la pérdida de propagación y en la compatibilidad técnica del escenario.',
  },
  propagation: {
    title: 'Modelo de propagación',
    what:
      'Es una representación matemática de cómo se debilita una señal de radio al viajar entre transmisor y receptor.',
    effect:
      'Elegir otro modelo no cambia la antena ni la potencia: cambia la forma de estimar la pérdida producida por el entorno.',
    example:
      'La misma distancia puede producir pérdidas distintas en espacio libre, una calle urbana o una oficina.',
  },
  fspl: {
    title: 'FSPL · pérdida en espacio libre',
    what:
      'Es una referencia ideal que supone que la señal viaja sin edificios, paredes ni otros obstáculos.',
    effect:
      'Sirve como punto de comparación. No debe interpretarse como una predicción realista de una ciudad.',
  },
  umi: {
    title: 'UMi · microcelda urbana',
    what:
      'UMi significa Urban Micro. El escenario Street Canyon representa una estación relativamente baja dentro de una calle urbana rodeada de edificaciones.',
    effect:
      'En esta implementación se usa una gNB de referencia de 10 m y un UE de 1,5 m. Es útil para enlaces urbanos de menor escala.',
    example:
      'Ejemplo conceptual: una pequeña estación 5G instalada a nivel de calle entre edificios.',
  },
  uma: {
    title: 'UMa · macrocelda urbana',
    what:
      'UMa significa Urban Macro. Representa una estación base más alta, normalmente por encima del entorno inmediato urbano.',
    effect:
      'En esta implementación se usa una gNB de referencia de 25 m y un UE de 1,5 m.',
    example:
      'Ejemplo conceptual: una estación base instalada en una torre o azotea que cubre un área urbana mayor.',
  },
  inh: {
    title: 'InH · escenario interior',
    what:
      'InH significa Indoor Hotspot. Aquí se usa el perfil Office para representar un enlace dentro de una oficina o edificio.',
    effect:
      'En esta implementación se usan alturas de referencia de 3 m para la estación y 1 m para el usuario, con alcance limitado por el dominio del modelo.',
    example:
      'Ejemplo conceptual: un punto de acceso o estación interior que atiende usuarios dentro de oficinas.',
  },
  los: {
    title: 'LOS · con línea de vista',
    what:
      'LOS significa Line of Sight. Existe un camino directo entre transmisor y receptor sin una obstrucción dominante entre ambos.',
    effect:
      'En los modelos implementados suele producir menos pérdida que NLOS, porque la componente directa de la señal puede llegar al receptor.',
    example:
      'Ejemplo: desde la antena se puede “ver” físicamente el receptor sin un edificio bloqueando el trayecto principal.',
  },
  nlos: {
    title: 'NLOS · sin línea de vista',
    what:
      'NLOS significa Non-Line of Sight. El trayecto directo está bloqueado o fuertemente obstruido y la señal llega principalmente por reflexión, difracción u otros caminos.',
    effect:
      'Normalmente produce una pérdida mayor y reduce potencia recibida, SNR y margen de enlace.',
    example:
      'Ejemplo: un edificio se encuentra entre la estación base y el usuario.',
  },
  distance2d: {
    title: 'Distancia 2D',
    what:
      'Es la distancia horizontal calculada entre las coordenadas de la gNB y el UE sobre el mapa.',
    effect:
      'Al aumentar, normalmente aumenta la pérdida de propagación.',
  },
  distance3d: {
    title: 'Distancia 3D',
    what:
      'Incluye la distancia horizontal y la diferencia de altura entre estación y usuario.',
    effect:
      'Es la distancia que algunas fórmulas 3GPP utilizan directamente.',
  },
  bearing: {
    title: 'Rumbo inicial',
    what:
      'Es la dirección geográfica desde la gNB hacia el UE, medida desde el norte.',
    effect:
      'Todavía no cambia la ganancia. En la fase de antenas permitirá comparar el rumbo del usuario con el azimut de la antena.',
  },
  pathLoss: {
    title: 'Pérdida de propagación',
    what:
      'Indica cuántos decibelios se atenúa la señal entre transmisor y receptor según el modelo seleccionado.',
    effect:
      'Una pérdida mayor reduce la potencia recibida si los demás parámetros permanecen iguales.',
  },
  receivedPower: {
    title: 'Potencia recibida',
    what:
      'Es la potencia estimada que llega al receptor después de considerar potencia transmitida, ganancias, pérdidas y propagación.',
    effect:
      'Valores más bajos pueden acercar el enlace a la sensibilidad mínima del receptor.',
  },
  snr: {
    title: 'SNR · relación señal/ruido',
    what:
      'Compara la potencia de la señal recibida con la potencia de ruido calculada.',
    effect:
      'Un SNR mayor indica que la señal sobresale más respecto al ruido. Esta fase no lo convierte automáticamente en MCS o modulación.',
  },
  linkMargin: {
    title: 'Margen de enlace',
    what:
      'Es la diferencia entre la potencia recibida y la sensibilidad configurada para el receptor.',
    effect:
      'Un margen positivo significa que, bajo ese criterio y ese modelo, la potencia recibida queda por encima de la sensibilidad.',
  },
  heights: {
    title: 'Alturas del perfil',
    what:
      'Son las alturas de referencia de la estación base y del usuario utilizadas por el modelo 3GPP seleccionado.',
    effect:
      'Influyen en la distancia 3D y, en UMi/UMa, también en la distancia de ruptura de la fórmula.',
  },
  antennaMode: {
    title: 'Modelo de antena',
    what:
      'Define cómo se calcula la ganancia del transmisor según la dirección del usuario.',
    effect:
      'Ganancia fija mantiene el valor del escenario en todas las direcciones. El elemento 3GPP reduce la ganancia cuando el usuario se aleja de la dirección principal.',
  },
  fixedGain: {
    title: 'Ganancia fija',
    what:
      'Es una abstracción del proyecto: se aplica la misma ganancia efectiva sin importar la dirección.',
    effect:
      'Sirve como referencia y mantiene el comportamiento de las fases anteriores.',
  },
  azimuth: {
    title: 'Azimut de la antena',
    what:
      'Es la dirección horizontal hacia donde apunta el lóbulo principal: 0° norte, 90° este, 180° sur y 270° oeste.',
    effect:
      'Cuando el UE queda fuera de esa dirección, una antena direccional aplica mayor atenuación.',
  },
  downtilt: {
    title: 'Inclinación hacia abajo (downtilt)',
    what:
      'Es la inclinación vertical del lóbulo principal de la antena hacia el suelo.',
    effect:
      'Permite dirigir más energía hacia usuarios ubicados por debajo de la estación. Un valor incorrecto puede reducir la ganancia efectiva hacia el UE.',
  },
  effectiveGain: {
    title: 'Ganancia efectiva',
    what:
      'Es la ganancia que realmente se aplica hacia una dirección concreta después de considerar orientación y patrón.',
    effect:
      'Esta ganancia reemplaza la ganancia TX fija dentro del presupuesto de enlace para esa dirección.',
  },
  beamwidth: {
    title: 'Ancho de haz',
    what:
      'Describe qué tan amplio es el lóbulo principal de una antena direccional.',
    effect:
      'El elemento de referencia de 3GPP usa 65° en los cortes horizontal y vertical. No representa por sí solo el patrón completo de un Massive MIMO.',
  },
  coverage: {
    title: 'Mapa de cobertura',
    what:
      'Evalúa muchos puntos alrededor de la gNB usando el mismo motor de propagación, antena y presupuesto de enlace.',
    effect:
      'Cada celda muestra si el margen calculado queda por encima o por debajo de la sensibilidad configurada.',
  },
  coverageRadius: {
    title: 'Radio de cobertura calculado',
    what:
      'Define hasta qué distancia alrededor de la gNB se construye la cuadrícula de evaluación.',
    effect:
      'Aumentarlo cubre más área pero también incrementa la distancia entre celdas para una misma resolución.',
  },
  gridResolution: {
    title: 'Resolución de cuadrícula',
    what:
      'Es la cantidad de filas y columnas usadas para muestrear el área.',
    effect:
      'Una cuadrícula mayor produce más detalle, pero requiere más cálculos. Por eso el procesamiento se ejecuta en un Web Worker.',
  },
};

export function PlannerHelp({
  helpKey,
}: {
  helpKey: PlannerHelpKey;
}) {
  const definition = help[helpKey];
  const triggerRef =
    useRef<HTMLButtonElement>(null);

  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [position, setPosition] = useState({
    left: 12,
    top: 12,
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

      const rect =
        trigger.getBoundingClientRect();

      const width = Math.min(
        380,
        window.innerWidth - 24,
      );

      const estimatedHeight = 310;
      const margin = 12;

      const left = Math.min(
        Math.max(
          rect.left
            + rect.width / 2
            - width / 2,
          margin,
        ),
        window.innerWidth
          - width
          - margin,
      );

      const roomBelow =
        window.innerHeight - rect.bottom;

      const useTop =
        roomBelow < estimatedHeight
        && rect.top > roomBelow;

      const top = useTop
        ? Math.max(
            margin,
            rect.top
              - Math.min(
                  estimatedHeight,
                  window.innerHeight - 24,
                )
              - 10,
          )
        : Math.min(
            window.innerHeight - margin,
            rect.bottom + 10,
          );

      setPosition({
        left,
        top,
        placement:
          useTop ? 'top' : 'bottom',
      });
    }

    updatePosition();

    window.addEventListener(
      'resize',
      updatePosition,
    );

    window.addEventListener(
      'scroll',
      updatePosition,
      true,
    );

    return () => {
      window.removeEventListener(
        'resize',
        updatePosition,
      );

      window.removeEventListener(
        'scroll',
        updatePosition,
        true,
      );
    };
  }, [open]);

  const content = (
    <div
      className={`planner-help-card planner-help-card--${position.placement}`}
      role="tooltip"
      style={{
        left: `${position.left}px`,
        top: `${position.top}px`,
      }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <strong>
        {definition.title}
      </strong>

      <div>
        <b>¿Qué significa?</b>
        <span>{definition.what}</span>
      </div>

      {definition.effect && (
        <div>
          <b>¿Qué cambia?</b>
          <span>{definition.effect}</span>
        </div>
      )}

      {definition.example && (
        <div className="planner-help-example">
          <b>Ejemplo</b>
          <span>{definition.example}</span>
        </div>
      )}
    </div>
  );

  return (
    <span className="planner-help">
      <button
        ref={triggerRef}
        type="button"
        className="planner-help-trigger"
        aria-label={`Ayuda sobre ${definition.title}`}
        aria-expanded={open}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onClick={() =>
          setOpen((value) => !value)
        }
      >
        ?
      </button>

      {mounted
        && open
        && createPortal(
          content,
          document.body,
        )}
    </span>
  );
}

export function PlannerTerm({
  children,
  helpKey,
}: {
  children: ReactNode;
  helpKey: PlannerHelpKey;
}) {
  return (
    <span className="planner-term">
      <span>{children}</span>
      <PlannerHelp helpKey={helpKey} />
    </span>
  );
}
