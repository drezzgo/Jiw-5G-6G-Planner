import {
  useMemo,
  useState,
} from 'react';

import type {
  GeoPoint,
} from '../../../core/geography';

import {
  analyzeTerrainProfile,
  generateTerrainSamplePoints,
  recommendedTerrainSampleCount,
  type TerrainProfileAnalysis,
} from '../../../core/terrain';

import {
  fetchCopernicusElevations,
} from '../../../services/elevation';

import {
  terrainEvidence,
} from '../../../knowledge/terrain-evidence';

import {
  PlannerTerm,
} from './PlannerHelp';

interface TerrainPanelProps {
  tx: GeoPoint;
  rx: GeoPoint;

  distanceM: number;
  frequencyHz: number;

  bsHeightM: number;
  utHeightM: number;
}

function formatNumber(
  value: number,
  digits = 1,
): string {
  return value.toLocaleString(
    'es-CO',
    {
      minimumFractionDigits:
        digits,
      maximumFractionDigits:
        digits,
    },
  );
}

function terrainChartPath(
  values: Array<{
    distanceM: number;
    elevationM: number;
    lineOfSightHeightM: number;
    fresnel60LowerHeightM: number;
  }>,
  width: number,
  height: number,
) {
  const padding = {
    left: 52,
    right: 18,
    top: 18,
    bottom: 34,
  };

  const maxDistance =
    values[
      values.length - 1
    ].distanceM;

  const yValues =
    values.flatMap(
      (value) => [
        value.elevationM,
        value.lineOfSightHeightM,
        value.fresnel60LowerHeightM,
      ],
    );

  const minY =
    Math.min(...yValues) - 5;

  const maxY =
    Math.max(...yValues) + 5;

  const x = (
    distanceM: number,
  ) =>
    padding.left
    + (
      distanceM
      / maxDistance
    )
      * (
        width
        - padding.left
        - padding.right
      );

  const y = (
    elevationM: number,
  ) =>
    padding.top
    + (
      maxY - elevationM
    )
      / (maxY - minY)
      * (
        height
        - padding.top
        - padding.bottom
      );

  const terrainLine =
    values
      .map(
        (value, index) =>
          `${index === 0 ? 'M' : 'L'} ${x(value.distanceM)} ${y(value.elevationM)}`,
      )
      .join(' ');

  const terrainArea =
    [
      terrainLine,
      `L ${x(maxDistance)} ${height - padding.bottom}`,
      `L ${x(0)} ${height - padding.bottom}`,
      'Z',
    ].join(' ');

  const losLine =
    values
      .map(
        (value, index) =>
          `${index === 0 ? 'M' : 'L'} ${x(value.distanceM)} ${y(value.lineOfSightHeightM)}`,
      )
      .join(' ');

  const fresnel60Line =
    values
      .map(
        (value, index) =>
          `${index === 0 ? 'M' : 'L'} ${x(value.distanceM)} ${y(value.fresnel60LowerHeightM)}`,
      )
      .join(' ');

  return {
    padding,
    minY,
    maxY,
    maxDistance,
    x,
    y,
    terrainLine,
    terrainArea,
    losLine,
    fresnel60Line,
  };
}

export default function TerrainPanel({
  tx,
  rx,
  distanceM,
  frequencyHz,
  bsHeightM,
  utHeightM,
}: TerrainPanelProps) {
  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState('');

  const [analysis, setAnalysis] =
    useState<TerrainProfileAnalysis | null>(
      null,
    );

  const [requestedPair, setRequestedPair] =
    useState('');

  const pairKey =
    [
      tx.lat.toFixed(7),
      tx.lng.toFixed(7),
      rx.lat.toFixed(7),
      rx.lng.toFixed(7),
      bsHeightM,
      utHeightM,
      frequencyHz,
    ].join('|');

  const stale =
    analysis !== null
    && requestedPair !== pairKey;

  async function loadTerrain() {
    if (distanceM < 10) {
      setError(
        'Separa los puntos al menos 10 m para generar un perfil útil.',
      );
      return;
    }

    setLoading(true);
    setError('');

    try {
      const count =
        recommendedTerrainSampleCount(
          distanceM,
        );

      const geometricSamples =
        generateTerrainSamplePoints(
          tx,
          rx,
          distanceM,
          count,
        );

      const elevations =
        await fetchCopernicusElevations(
          geometricSamples.map(
            (sample) =>
              sample.point,
          ),
        );

      const profile =
        geometricSamples.map(
          (sample, index) => ({
            ...sample,
            elevationM:
              elevations[index],
          }),
        );

      const result =
        analyzeTerrainProfile(
          profile,
          frequencyHz,
          bsHeightM,
          utHeightM,
        );

      setAnalysis(result);
      setRequestedPair(pairKey);
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : 'No fue posible obtener el perfil del terreno.',
      );
    } finally {
      setLoading(false);
    }
  }

  const chart =
    useMemo(
      () =>
        analysis
          ? terrainChartPath(
              analysis.samples,
              820,
              270,
            )
          : null,
      [analysis],
    );

  return (
    <section className="terrain-panel" id="terreno">
      <header className="terrain-heading">
        <div>
          <span className="planner-eyebrow">
            Fase 7 · Relieve
          </span>
          <h2>
            Perfil de terreno y{' '}
            <PlannerTerm helpKey="fresnel">
              zona de Fresnel
            </PlannerTerm>
          </h2>
          <p>
            Consulta el relieve entre la gNB y el UE y
            comprueba si el terreno invade la trayectoria
            directa o una fracción de la primera zona de
            Fresnel.
          </p>
        </div>

        <button
          type="button"
          className="terrain-load-button"
          disabled={
            loading
            || distanceM < 10
          }
          onClick={
            loadTerrain
          }
        >
          {loading
            ? 'Consultando elevaciones…'
            : 'Obtener perfil de terreno'}
        </button>
      </header>

      <div className="terrain-warning">
        <strong>
          Qué puede y qué no puede detectar
        </strong>
        <p>
          El modelo de elevación representa el
          <strong> terreno</strong>. No contiene la altura
          real de edificios, árboles u otros obstáculos
          urbanos. Por eso un perfil despejado no garantiza
          línea de vista real.
        </p>
      </div>

      {stale && (
        <div className="terrain-stale">
          Moviste alguno de los extremos o cambió una
          altura. Vuelve a consultar para actualizar el
          perfil.
        </div>
      )}

      {error && (
        <div className="terrain-error">
          {error}
        </div>
      )}

      {analysis && !stale && (
        <>
          <div className="terrain-results">
            <article
              className={
                analysis.geometricLosClear
                  ? 'terrain-result terrain-result--pass'
                  : 'terrain-result terrain-result--fail'
              }
            >
              <small>
                Línea directa respecto al terreno
              </small>
              <strong>
                {analysis.geometricLosClear
                  ? 'Despejada'
                  : 'Obstruida'}
              </strong>
              <span>
                Despeje mínimo:{' '}
                {formatNumber(
                  analysis.minimumTerrainClearanceM,
                )} m
              </span>
            </article>

            <article
              className={
                analysis.fresnel60Clear
                  ? 'terrain-result terrain-result--pass'
                  : 'terrain-result terrain-result--warn'
              }
            >
              <small>
                <PlannerTerm helpKey="fresnel60">
                  60% de la primera zona de Fresnel
                </PlannerTerm>
              </small>
              <strong>
                {analysis.fresnel60Clear
                  ? 'Despejado'
                  : 'Invadido'}
              </strong>
              <span>
                Despeje mínimo:{' '}
                {formatNumber(
                  analysis.minimumFresnel60ClearanceM,
                )} m
              </span>
            </article>

            <article className="terrain-result">
              <small>
                <PlannerTerm helpKey="fresnel">
                  Radio F1 máximo
                </PlannerTerm>
              </small>
              <strong>
                {formatNumber(
                  analysis.maximumFresnelRadiusM,
                )} m
              </strong>
              <span>
                a {formatNumber(
                  analysis.criticalFresnelSample.distanceM,
                  0,
                )} m del transmisor
              </span>
            </article>

            <article className="terrain-result">
              <small>
                Resolución del perfil
              </small>
              <strong>
                {analysis.samples.length}
                {' '}muestras
              </strong>
              <span>
                <PlannerTerm helpKey="dem">
                  DEM
                </PlannerTerm>{' '}
                nominal de 90 m
              </span>
            </article>
          </div>

          {chart && (
            <div className="terrain-chart-shell">
              <div className="terrain-chart-legend">
                <span>
                  <i className="terrain-key terrain-key--ground" />
                  terreno
                </span>
                <span>
                  <i className="terrain-key terrain-key--los" />
                  línea directa
                </span>
                <span>
                  <i className="terrain-key terrain-key--fresnel" />
                  límite inferior 60% F1
                </span>
              </div>

              <svg
                className="terrain-chart"
                viewBox="0 0 820 270"
                role="img"
                aria-label="Perfil de elevación, línea directa y despeje del sesenta por ciento de la primera zona de Fresnel"
              >
                <path
                  d={
                    chart.terrainArea
                  }
                  className="terrain-area"
                />

                <path
                  d={
                    chart.terrainLine
                  }
                  className="terrain-ground-line"
                />

                <path
                  d={
                    chart.losLine
                  }
                  className="terrain-los-line"
                />

                <path
                  d={
                    chart.fresnel60Line
                  }
                  className="terrain-fresnel-line"
                />

                <line
                  x1={
                    chart.padding.left
                  }
                  y1={
                    270
                    - chart.padding.bottom
                  }
                  x2={
                    820
                    - chart.padding.right
                  }
                  y2={
                    270
                    - chart.padding.bottom
                  }
                  className="terrain-axis"
                />

                <text
                  x={
                    chart.padding.left
                  }
                  y="258"
                  className="terrain-axis-label"
                >
                  gNB · 0 m
                </text>

                <text
                  x={
                    820
                    - chart.padding.right
                  }
                  y="258"
                  textAnchor="end"
                  className="terrain-axis-label"
                >
                  UE · {formatNumber(
                    analysis.totalDistanceM,
                    0,
                  )} m
                </text>

                <text
                  x="8"
                  y="24"
                  className="terrain-axis-label"
                >
                  {formatNumber(
                    chart.maxY,
                    0,
                  )} m
                </text>

                <text
                  x="8"
                  y="224"
                  className="terrain-axis-label"
                >
                  {formatNumber(
                    chart.minY,
                    0,
                  )} m
                </text>
              </svg>
            </div>
          )}

          <div className="terrain-interpretation">
            <strong>
              ¿Cómo interpretamos este perfil?
            </strong>

            {analysis.geometricLosClear ? (
              <p>
                Se interpreta que el relieve muestreado no
                cruza la línea geométrica que une la altura
                de la antena de la gNB con la altura del
                receptor. En otras palabras, con los datos
                de elevación disponibles no vemos una
                montaña o una elevación del suelo que
                bloquee directamente el trayecto. Esto no
                garantiza una línea de vista real, porque
                el{' '}
                <PlannerTerm helpKey="dem">
                  DEM
                </PlannerTerm>{' '}
                no representa de forma detallada edificios,
                árboles ni otros obstáculos.
              </p>
            ) : (
              <p>
                Se interpreta que al menos una parte del
                terreno queda por encima de la línea
                geométrica que une las dos antenas. En
                términos sencillos, el relieve sí está
                bloqueando el trayecto directo en algún
                punto. Lo mostramos como una evidencia de
                obstrucción por terreno, pero no cambiamos
                automáticamente el selector{' '}
                <PlannerTerm helpKey="los">
                  LOS
                </PlannerTerm>
                /
                <PlannerTerm helpKey="nlos">
                  NLOS
                </PlannerTerm>{' '}
                para no mezclar este análisis con el modelo de
                propagación 3GPP.
              </p>
            )}

            {analysis.fresnel60Clear ? (
              <p>
                Además, el terreno se mantiene por debajo
                del límite correspondiente al 60% de la
                primera zona de Fresnel. Esto significa que,
                respecto al relieve que pudimos muestrear,
                también conservamos el despeje de referencia
                que usamos para revisar posibles efectos de
                difracción alrededor del trayecto directo.
              </p>
            ) : (
              <p>
                También observamos que el terreno entra en
                el límite del 60% de la primera zona de
                Fresnel. Esto puede ocurrir incluso cuando
                todavía existe una línea directa entre las
                antenas: la señal necesita espacio alrededor
                de ese trayecto y una elevación cercana puede
                aumentar los efectos de difracción. Por eso
                marcamos el despeje de Fresnel como
                comprometido.
              </p>
            )}
          </div>

          <details className="terrain-evidence">
            <summary>
              Ver fuentes y alcance técnico
            </summary>

            <div className="terrain-evidence-grid">
              {Object.values(
                terrainEvidence,
              ).map(
                (item) => (
                  <article
                    key={
                      item.document
                    }
                  >
                    <span>
                      {item.authority}
                    </span>
                    <strong>
                      {item.document}
                    </strong>
                    <small>
                      {item.locator}
                    </small>
                    <p>
                      {item.supports}
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
        </>
      )}

      <div className="terrain-data-note">
        Datos de elevación: Copernicus{' '}
        <PlannerTerm helpKey="dem">
          DEM
        </PlannerTerm>{' '}
        GLO-90, consultados mediante Open-Meteo Elevation API.
        Para enlaces muy cortos en ciudad, una resolución
        nominal de 90 m no permite representar edificios ni
        detalles urbanos finos.
      </div>
    </section>
  );
}
