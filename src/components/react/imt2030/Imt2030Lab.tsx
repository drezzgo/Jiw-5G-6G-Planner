import {
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import {
  evaluateImt2030Experiment,
} from '../../../core/imt2030';

import {
  imt2030Evidence,
} from '../../../knowledge/imt2030-evidence';

import TechnicalTerm from '../common/TechnicalTerm';

import './imt2030.css';

function format(
  value: number,
  digits = 2,
): string {
  return value.toLocaleString(
    'es-CO',
    {
      maximumFractionDigits:
        digits,
      minimumFractionDigits:
        digits,
    },
  );
}

function capabilityExplanation(
  id: string,
  fallback: string,
): ReactNode {
  switch (id) {
    case 'user-experienced-data-rate':
      return (
        <>
          Con{' '}
          <TechnicalTerm termKey="shannon">
            Shannon
          </TechnicalTerm>{' '}
          solo descartamos una referencia si el límite
          teórico queda por debajo.
        </>
      );

    case 'peak-data-rate':
      return (
        <>
          No la evaluamos: el modelo no incluye{' '}
          <TechnicalTerm termKey="mimo">
            MIMO
          </TechnicalTerm>{' '}
          ni el sistema radio completo.
        </>
      );

    case 'latency':
      return (
        <>
          No modelamos tramas, colas ni
          retransmisiones.
        </>
      );

    case 'mobility':
      return (
        <>
          No simulamos cambios del enlace mientras el
          usuario se mueve.
        </>
      );

    case 'positioning':
      return (
        <>
          Las coordenadas del mapa no miden precisión de
          posicionamiento.
        </>
      );

    case 'security-ai-sensing':
      return (
        <>
          Requiere modelos distintos al presupuesto de
          enlace.
        </>
      );

    default:
      return fallback;
  }
}

export default function Imt2030Lab() {
  const [bandwidthMhz, setBandwidthMhz] =
    useState(100);

  const [snrDb, setSnrDb] =
    useState(10);

  const result =
    useMemo(
      () =>
        evaluateImt2030Experiment({
          bandwidthHz:
            bandwidthMhz * 1e6,
          snrDb,
        }),
      [
        bandwidthMhz,
        snrDb,
      ],
    );

  const capacityMbps =
    result.theoreticalCapacityBps
    / 1e6;

  return (
    <div className="imt2030-lab">
      <section
        className="imt-intro"
        id="escenario"
      >
        <div>
          <span className="imt-eyebrow">
            Fase 8 · Modo experimental
          </span>

          <h2>
            <TechnicalTerm termKey="imt2030">
              IMT-2030 / 6G
            </TechnicalTerm>
          </h2>

          <p>
            Comparamos referencias publicadas con lo que
            nuestro modelo sí puede calcular. No simulamos
            una red 6G final.
          </p>
        </div>

        <div className="imt-status">
          <strong>
            Estado
          </strong>
          <span>
            Experimental · sin certificación
          </span>
        </div>
      </section>

      <section className="imt-layout">
        <div className="imt-inputs">
          <h3>
            Parámetros
          </h3>

          <label>
            Ancho de banda

            <div className="imt-number-unit">
              <input
                type="number"
                min="1"
                max="5000"
                step="10"
                value={
                  bandwidthMhz
                }
                onChange={(event) =>
                  setBandwidthMhz(
                    Math.max(
                      1,
                      Number(
                        event.target.value,
                      ),
                    ),
                  )
                }
              />
              <span>
                MHz
              </span>
            </div>
          </label>

          <label>
            <TechnicalTerm termKey="snr">
              SNR
            </TechnicalTerm>

            <div className="imt-number-unit">
              <input
                type="number"
                min="-20"
                max="60"
                step="1"
                value={
                  snrDb
                }
                onChange={(event) =>
                  setSnrDb(
                    Number(
                      event.target.value,
                    ),
                  )
                }
              />
              <span>
                dB
              </span>
            </div>
          </label>

          <p className="imt-input-note">
            Son valores de prueba, no una banda 6G
            aprobada.
          </p>
        </div>

        <div
          className="imt-result"
          id="resultado"
        >
          <span>
            Límite teórico de{' '}
            <TechnicalTerm termKey="shannon">
              Shannon
            </TechnicalTerm>
          </span>

          <strong>
            {format(
              capacityMbps,
              2,
            )} Mbit/s
          </strong>

          <div
            className="imt-formula"
            aria-label="C igual a B por logaritmo base dos de uno más diez elevado a SNR sobre diez"
          >
            <span className="math-variable">
              C
            </span>
            <span>=</span>
            <span className="math-variable">
              B
            </span>
            <span>
              log<sub>2</sub>
            </span>
            <span>
              (1 + 10
              <sup>
                SNR / 10
              </sup>
              )
            </span>
          </div>

          <div className="imt-operation">
            <span>
              {format(
                bandwidthMhz,
                0,
              )} × 10
              <sup>6</sup>
            </span>
            <span>×</span>
            <span>
              log<sub>2</sub>
              (1 + 10
              <sup>
                {format(
                  snrDb,
                  0,
                )} / 10
              </sup>
              )
            </span>
            <span>=</span>
            <strong>
              {format(
                capacityMbps,
                2,
              )} Mbit/s
            </strong>
          </div>

          <p>
            {result.interpretation}
          </p>
        </div>

        <div className="imt-result imt-result--secondary">
          <span>
            Eficiencia espectral teórica
          </span>

          <strong>
            {format(
              result
                .theoreticalSpectralEfficiencyBpsHz,
              3,
            )} bit/s/Hz
          </strong>

          <p>
            Capacidad teórica obtenida por cada Hz
            disponible.
          </p>
        </div>
      </section>

      <section
        className="imt-reference"
      >
        <header>
          <div>
            <span className="imt-eyebrow">
              Referencia
            </span>
            <h3>
              Tasa de datos del usuario
            </h3>
          </div>

          <TechnicalTerm termKey="imt2030">
            ITU-R M.2160
          </TechnicalTerm>
        </header>

        <div className="imt-reference-scale">
          <div>
            <span>300 Mbit/s</span>
            <small>
              referencia
            </small>
          </div>

          <div>
            <span>500 Mbit/s</span>
            <small>
              referencia
            </small>
          </div>

          <div className="imt-reference-current">
            <span>
              {format(
                capacityMbps,
                1,
              )} Mbit/s
            </span>
            <small>
              límite del escenario
            </small>
          </div>
        </div>
      </section>

      <section
        className="imt-capabilities"
        id="capacidades"
      >
        <header>
          <span className="imt-eyebrow">
            Alcance
          </span>
          <h3>
            Qué podemos evaluar
          </h3>
          <p>
            Dejamos como no evaluable lo que el modelo no
            soporta.
          </p>
        </header>

        <div className="imt-capability-grid">
          {result.capabilities.map(
            (capability) => (
              <article
                key={
                  capability.id
                }
                className={
                  capability.status
                    === 'PARTIAL'
                    ? 'imt-capability imt-capability--partial'
                    : 'imt-capability'
                }
              >
                <span>
                  {capability.status
                    === 'PARTIAL'
                    ? 'Evaluación parcial'
                    : 'No evaluable'}
                </span>

                <h4>
                  {capability.title}
                </h4>

                <strong>
                  {capability.reference}
                </strong>

                <p>
                  {capabilityExplanation(
                    capability.id,
                    capability.explanation,
                  )}
                </p>
              </article>
            ),
          )}
        </div>
      </section>

      <section
        className="imt-current-state"
        id="estado"
      >
        <header>
          <span className="imt-eyebrow">
            Estado actual
          </span>
          <h3>
            IMT-2030 sigue en desarrollo
          </h3>
        </header>

        <div className="imt-timeline">
          <article>
            <span>2023</span>
            <strong>
              Marco IMT-2030
            </strong>
            <p>
              M.2160 define escenarios y capacidades.
            </p>
          </article>

          <article>
            <span>2026</span>
            <strong>
              <TechnicalTerm termKey="wp5d">
                WP 5D
              </TechnicalTerm>
            </strong>
            <p>
              Acordó requisitos de evaluación; el proceso
              formal continúa.
            </p>
          </article>

          <article>
            <span>
              <TechnicalTerm termKey="3gpp">
                3GPP
              </TechnicalTerm>
            </span>
            <strong>
              Estudios de 6G
            </strong>
            <p>
              Release 20 incluye estudios como TR 38.914,
              no una interfaz radio final.
            </p>
          </article>
        </div>

        <p className="imt-candidate-note">
          Las futuras{' '}
          <TechnicalTerm termKey="rit">
            RIT
          </TechnicalTerm>{' '}
          candidatas deben pasar por evaluación antes de
          formar parte de una recomendación IMT final.
        </p>

        <details className="imt-evidence">
          <summary>
            Ver fuentes
          </summary>

          <div>
            {Object.values(
              imt2030Evidence,
            ).map(
              (item) => (
                <article
                  key={
                    item.title
                  }
                >
                  <span>
                    {item.authority}
                  </span>

                  <strong>
                    {item.title}
                  </strong>

                  <small>
                    {item.locator}
                  </small>

                  <p>
                    {item.note}
                  </p>

                  <a
                    href={
                      item.url
                    }
                    target="_blank"
                    rel="noreferrer"
                  >
                    Abrir fuente oficial ↗
                  </a>
                </article>
              ),
            )}
          </div>
        </details>
      </section>
    </div>
  );
}
