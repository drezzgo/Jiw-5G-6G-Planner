import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from 'react';

import {
  createPortal,
} from 'react-dom';

import {
  technicalGlossary,
  type TechnicalTermKey,
} from '../../../knowledge/technical-glossary';

import './technical-term.css';

interface TechnicalTermProps {
  termKey?: TechnicalTermKey;
  title?: string;
  description?: string;
  children: ReactNode;
}

export default function TechnicalTerm({
  termKey,
  title,
  description,
  children,
}: TechnicalTermProps) {
  const triggerRef =
    useRef<HTMLSpanElement>(null);

  const closeTimerRef =
    useRef<
      ReturnType<typeof setTimeout>
      | null
    >(null);

  const [mounted, setMounted] =
    useState(false);

  const [open, setOpen] =
    useState(false);

  const [position, setPosition] =
    useState({
      left: 12,
      top: 12,
      placement:
        'bottom' as 'top' | 'bottom',
    });

  const definition =
    termKey
      ? technicalGlossary[termKey]
      : {
          title:
            title ?? 'Término técnico',
          description:
            description ?? '',
        };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;

    function updatePosition() {
      const trigger =
        triggerRef.current;

      if (!trigger) return;

      const rect =
        trigger.getBoundingClientRect();

      const width =
        Math.min(
          310,
          window.innerWidth - 24,
        );

      const estimatedHeight = 130;
      const margin = 12;

      const left =
        Math.min(
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
        window.innerHeight
        - rect.bottom;

      const useTop =
        roomBelow < estimatedHeight
        && rect.top > roomBelow;

      const top =
        useTop
          ? Math.max(
              margin,
              rect.top
                - estimatedHeight
                - 8,
            )
          : Math.min(
              window.innerHeight
                - margin,
              rect.bottom + 8,
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

  function cancelClose() {
    if (
      closeTimerRef.current
      !== null
    ) {
      clearTimeout(
        closeTimerRef.current,
      );

      closeTimerRef.current =
        null;
    }
  }

  function show() {
    cancelClose();
    setOpen(true);
  }

  function scheduleClose() {
    cancelClose();

    closeTimerRef.current =
      setTimeout(
        () => {
          setOpen(false);
        },
        120,
      );
  }

  function handleKeyDown(
    event:
      KeyboardEvent<HTMLSpanElement>,
  ) {
    if (
      event.key === 'Enter'
      || event.key === ' '
    ) {
      event.preventDefault();
      setOpen(
        (value) => !value,
      );
    }

    if (event.key === 'Escape') {
      setOpen(false);
    }
  }

  const tooltip = (
    <div
      className={`technical-term-popover technical-term-popover--${position.placement}`}
      role="tooltip"
      style={{
        left: `${position.left}px`,
        top: `${position.top}px`,
      }}
      onMouseEnter={show}
      onMouseLeave={scheduleClose}
    >
      <strong>
        {definition.title}
      </strong>

      <span>
        {definition.description}
      </span>
    </div>
  );

  return (
    <span className="technical-term">
      <span
        ref={triggerRef}
        className="technical-term__trigger"
        role="button"
        tabIndex={0}
        aria-expanded={open}
        onMouseEnter={show}
        onMouseLeave={scheduleClose}
        onFocus={show}
        onBlur={scheduleClose}
        onClick={() =>
          setOpen(
            (value) => !value,
          )
        }
        onKeyDown={
          handleKeyDown
        }
      >
        {children}
      </span>

      {mounted
        && open
        && createPortal(
          tooltip,
          document.body,
        )}
    </span>
  );
}
