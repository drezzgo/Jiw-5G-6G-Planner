import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';

import {
  createPortal,
} from 'react-dom';

type HelpKey =
  | 'imt2030'
  | 'bandwidth'
  | 'snr'
  | 'shannon'
  | 'spectralEfficiency'
  | 'researchTarget'
  | 'rit';

const help: Record<
  HelpKey,
  {
    title: string;
    text: string;
  }
> = {
  imt2030: {
    title: 'IMT-2030',
    text:
      'Es el nombre que utiliza la UIT para la siguiente generación de telecomunicaciones móviles, comúnmente asociada con 6G. En 2026 el proceso de definición y evaluación todavía está en desarrollo.',
  },
  bandwidth: {
    title: 'Ancho de banda experimental',
    text:
      'Es la cantidad de espectro que usamos en este ejercicio matemático. No significa que exista una banda 6G aprobada con ese ancho.',
  },
  snr: {
    title: 'SNR',
    text:
      'Es la relación entre potencia de señal y ruido. Un SNR mayor permite una capacidad teórica mayor si el ancho de banda permanece igual.',
  },
  shannon: {
    title: 'Capacidad de Shannon',
    text:
      'Es un límite teórico de información para un canal con cierto ancho de banda y SNR. No equivale a velocidad real de usuario.',
  },
  spectralEfficiency: {
    title: 'Eficiencia espectral teórica',
    text:
      'Indica cuántos bit/s teóricos obtenemos por cada Hz de ancho de banda bajo el límite de Shannon.',
  },
  researchTarget: {
    title: 'Objetivo de investigación',
    text:
      'ITU-R M.2160 usa rangos y ejemplos para orientar investigación. No debemos tratarlos como una certificación final de IMT-2030.',
  },
  rit: {
    title: 'Interfaz radio candidata',
    text:
      'Una RIT o SRIT es una propuesta de tecnología radio que debe pasar por un proceso de presentación y evaluación antes de formar parte de una recomendación IMT final.',
  },
};

export function ImtHelp({
  helpKey,
}: {
  helpKey: HelpKey;
}) {
  const triggerRef =
    useRef<HTMLButtonElement>(null);

  const [open, setOpen] =
    useState(false);

  const [mounted, setMounted] =
    useState(false);

  const [position, setPosition] =
    useState({
      left: 12,
      top: 12,
      topMode: false,
    });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;

    const update = () => {
      const trigger =
        triggerRef.current;

      if (!trigger) return;

      const rect =
        trigger.getBoundingClientRect();

      const width =
        Math.min(
          360,
          window.innerWidth - 24,
        );

      const left =
        Math.min(
          Math.max(
            rect.left
              + rect.width / 2
              - width / 2,
            12,
          ),
          window.innerWidth
            - width
            - 12,
        );

      const roomBelow =
        window.innerHeight
        - rect.bottom;

      const topMode =
        roomBelow < 220
        && rect.top > roomBelow;

      setPosition({
        left,
        top:
          topMode
            ? rect.top - 10
            : rect.bottom + 10,
        topMode,
      });
    };

    update();

    window.addEventListener(
      'resize',
      update,
    );

    window.addEventListener(
      'scroll',
      update,
      true,
    );

    return () => {
      window.removeEventListener(
        'resize',
        update,
      );

      window.removeEventListener(
        'scroll',
        update,
        true,
      );
    };
  }, [open]);

  const definition =
    help[helpKey];

  const card = (
    <div
      role="tooltip"
      className={
        position.topMode
          ? 'imt-help-card imt-help-card--top'
          : 'imt-help-card'
      }
      style={{
        left:
          `${position.left}px`,
        top:
          `${position.top}px`,
      }}
      onMouseEnter={() =>
        setOpen(true)
      }
      onMouseLeave={() =>
        setOpen(false)
      }
    >
      <strong>
        {definition.title}
      </strong>
      <p>
        {definition.text}
      </p>
    </div>
  );

  return (
    <span className="imt-help">
      <button
        ref={triggerRef}
        type="button"
        aria-label={
          `Ayuda sobre ${definition.title}`
        }
        onMouseEnter={() =>
          setOpen(true)
        }
        onMouseLeave={() =>
          setOpen(false)
        }
        onFocus={() =>
          setOpen(true)
        }
        onBlur={() =>
          setOpen(false)
        }
        onClick={() =>
          setOpen(
            (value) => !value,
          )
        }
      >
        ?
      </button>

      {mounted
        && open
        && createPortal(
          card,
          document.body,
        )}
    </span>
  );
}

export function ImtTerm({
  children,
  helpKey,
}: {
  children: ReactNode;
  helpKey: HelpKey;
}) {
  return (
    <span className="imt-term">
      <span>
        {children}
      </span>
      <ImtHelp
        helpKey={helpKey}
      />
    </span>
  );
}
