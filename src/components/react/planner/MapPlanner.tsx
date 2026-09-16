import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import type {
  GeoJSONSource,
  Map as MapLibreMap,
  MapMouseEvent,
  Marker as MapLibreMarker,
  StyleSpecification,
} from 'maplibre-gl';

import 'maplibre-gl/dist/maplibre-gl.css';
import mapLibreWorkerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url';
import './planner.css';

import {
  bearingToCardinal,
  calculateGreatCircleDistanceM,
  calculateInitialBearingDeg,
  type GeoPoint,
} from '../../../core/geography';

import {
  calculateLinkBudget,
  calculateLinkBudgetFromPathLoss,
  type LinkBudgetResult,
} from '../../../core/radio';

import {
  calculate3gppPathLoss,
  type PropagationCondition,
  type PropagationModelId,
  type PropagationResult,
} from '../../../core/propagation';

import {
  calculateEffectiveTxGain,
  type AntennaConfig,
  type AntennaMode,
} from '../../../core/antennas';

import type {
  CoverageInput,
  CoverageResult,
} from '../../../core/coverage';

import {
  evaluate5gNr,
} from '../../../core/assessment/evaluate';

import {
  getReferenceScenario,
} from '../../../core/scenarios/reference-scenarios';

import {
  PlannerTerm,
} from './PlannerHelp';

type PlacementMode =
  | 'TX'
  | 'RX'
  | null;

const INITIAL_TX: GeoPoint = {
  lat: 4.7110,
  lng: -74.0721,
};

const INITIAL_RX: GeoPoint = {
  lat: 4.7110,
  lng: -74.0621,
};

const EMPTY_FEATURE_COLLECTION = {
  type: 'FeatureCollection' as const,
  features: [],
};

const rasterStyle: StyleSpecification = {
  version: 8,
  sources: {
    osm: {
      type: 'raster',
      tiles: [
        'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
      ],
      tileSize: 256,
      maxzoom: 19,
      attribution:
        '© OpenStreetMap contributors',
    },
  },
  layers: [
    {
      id: 'osm-basemap',
      type: 'raster',
      source: 'osm',
    },
  ],
};

const modelLabels: Record<
  PropagationModelId,
  string
> = {
  FSPL:
    'Espacio libre · referencia ideal',
  UMI_STREET_CANYON:
    '3GPP UMi · calle urbana',
  UMA:
    '3GPP UMa · macro urbana',
  INH_OFFICE:
    '3GPP InH · oficina interior',
};

const modelDescriptions: Record<
  PropagationModelId,
  string
> = {
  FSPL:
    'Supone propagación ideal sin obstáculos. Es útil como referencia, no como representación de una ciudad.',
  UMI_STREET_CANYON:
    'Escenario microcelular urbano tipo cañón de calle. Perfil de alturas: gNB 10 m y UE 1,5 m.',
  UMA:
    'Escenario macrocelular urbano. Perfil de alturas: gNB 25 m y UE 1,5 m.',
  INH_OFFICE:
    'Escenario interior de oficina. Perfil de alturas: estación 3 m y UE 1 m.',
};

const antennaLabels: Record<
  AntennaMode,
  string
> = {
  FIXED_GAIN:
    'Ganancia fija · referencia del proyecto',
  THREE_GPP_SINGLE_ELEMENT:
    'Elemento direccional 3GPP · referencia',
};

function lineGeoJson(
  tx: GeoPoint,
  rx: GeoPoint,
) {
  return {
    type: 'Feature' as const,
    properties: {},
    geometry: {
      type: 'LineString' as const,
      coordinates: [
        [tx.lng, tx.lat],
        [rx.lng, rx.lat],
      ],
    },
  };
}

function coverageGeoJson(
  result: CoverageResult | null,
) {
  if (!result) {
    return EMPTY_FEATURE_COLLECTION;
  }

  return {
    type: 'FeatureCollection' as const,
    features:
      result.cells.map(
        (cell) => ({
          type: 'Feature' as const,
          properties: {
            id: cell.id,
            status: cell.status,
            marginDb:
              cell.linkMarginDb ?? -999,
            gainDbi:
              cell.antennaGainDbi ?? null,
            distanceM:
              cell.distanceM,
          },
          geometry: {
            type: 'Polygon' as const,
            coordinates: [
              cell.polygon.map(
                (point) => [
                  point.lng,
                  point.lat,
                ],
              ),
            ],
          },
        }),
      ),
  };
}

function profileHeights(
  model: PropagationModelId,
) {
  switch (model) {
    case 'UMA':
      return {
        bsHeightM: 25,
        utHeightM: 1.5,
      };

    case 'INH_OFFICE':
      return {
        bsHeightM: 3,
        utHeightM: 1,
      };

    case 'UMI_STREET_CANYON':
    case 'FSPL':
    default:
      return {
        bsHeightM: 10,
        utHeightM: 1.5,
      };
  }
}

function formatCoordinate(
  value: number,
): string {
  return value.toLocaleString(
    'es-CO',
    {
      minimumFractionDigits: 6,
      maximumFractionDigits: 6,
    },
  );
}

function formatDistance(
  distanceM: number,
): string {
  if (distanceM >= 1000) {
    return `${(distanceM / 1000).toLocaleString(
      'es-CO',
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      },
    )} km`;
  }

  return `${distanceM.toLocaleString(
    'es-CO',
    {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    },
  )} m`;
}

function formatNumber(
  value: number | undefined,
  digits = 2,
): string {
  if (
    value === undefined
    || !Number.isFinite(value)
  ) {
    return '—';
  }

  return value.toLocaleString(
    'es-CO',
    {
      minimumFractionDigits: digits,
      maximumFractionDigits: digits,
    },
  );
}

function assessmentLabel(
  status: string,
): string {
  switch (status) {
    case 'PASS':
      return 'Pasa las reglas evaluadas';
    case 'PASS_WITH_WARNINGS':
      return 'Pasa con advertencias';
    case 'FAIL':
      return 'No pasa las reglas evaluadas';
    default:
      return 'No evaluable completamente';
  }
}

export default function MapPlanner() {
  const mapContainerRef =
    useRef<HTMLDivElement>(null);

  const mapRef =
    useRef<MapLibreMap | null>(null);

  const txMarkerRef =
    useRef<MapLibreMarker | null>(null);

  const rxMarkerRef =
    useRef<MapLibreMarker | null>(null);

  const placementModeRef =
    useRef<PlacementMode>(null);

  const coverageWorkerRef =
    useRef<Worker | null>(null);

  const coverageRequestIdRef =
    useRef(0);

  const [mapReady, setMapReady] =
    useState(false);

  const [placementMode, setPlacementMode] =
    useState<PlacementMode>(null);

  const [tx, setTx] =
    useState<GeoPoint>(INITIAL_TX);

  const [rx, setRx] =
    useState<GeoPoint>(INITIAL_RX);

  const [
    propagationModel,
    setPropagationModel,
  ] = useState<PropagationModelId>(
    'FSPL',
  );

  const [
    propagationCondition,
    setPropagationCondition,
  ] = useState<PropagationCondition>(
    'LOS',
  );

  const [
    antennaMode,
    setAntennaMode,
  ] = useState<AntennaMode>(
    'FIXED_GAIN',
  );

  const [
    antennaAzimuthDeg,
    setAntennaAzimuthDeg,
  ] = useState(90);

  const [
    antennaDowntiltDeg,
    setAntennaDowntiltDeg,
  ] = useState(5);

  const [
    coverageRadiusM,
    setCoverageRadiusM,
  ] = useState(500);

  const [
    coverageGridSize,
    setCoverageGridSize,
  ] = useState(31);

  const [
    coverageVisible,
    setCoverageVisible,
  ] = useState(true);

  const [
    coverageLoading,
    setCoverageLoading,
  ] = useState(false);

  const [
    coverageError,
    setCoverageError,
  ] = useState('');

  const [
    coverageResult,
    setCoverageResult,
  ] = useState<CoverageResult | null>(
    null,
  );

  const distanceM = useMemo(
    () =>
      calculateGreatCircleDistanceM(
        tx,
        rx,
      ),
    [tx, rx],
  );

  const bearingDeg = useMemo(
    () =>
      calculateInitialBearingDeg(
        tx,
        rx,
      ),
    [tx, rx],
  );

  const scenario = useMemo(() => {
    const reference =
      getReferenceScenario(
        'N78_REFERENCE',
      );

    return {
      ...reference.scenario,
      radio: {
        ...reference.scenario.radio,
        distanceM:
          Math.max(
            distanceM,
            0.01,
          ),
      },
    };
  }, [distanceM]);

  const antennaConfig =
    useMemo<AntennaConfig>(
      () => ({
        mode: antennaMode,
        fixedGainDbi:
          scenario.radio.txGainDbi,
        azimuthDeg:
          antennaAzimuthDeg,
        downtiltDeg:
          antennaDowntiltDeg,
      }),
      [
        antennaMode,
        scenario.radio.txGainDbi,
        antennaAzimuthDeg,
        antennaDowntiltDeg,
      ],
    );

  const heights =
    useMemo(
      () =>
        profileHeights(
          propagationModel,
        ),
      [propagationModel],
    );

  const antennaGain =
    useMemo(
      () => {
        if (bearingDeg === null) {
          return null;
        }

        return calculateEffectiveTxGain(
          antennaConfig,
          {
            bearingDeg,
            distance2DM:
              Math.max(
                distanceM,
                1,
              ),
            bsHeightM:
              heights.bsHeightM,
            utHeightM:
              heights.utHeightM,
          },
        );
      },
      [
        antennaConfig,
        bearingDeg,
        distanceM,
        heights,
      ],
    );

  const scenarioWithAntenna =
    useMemo(
      () => ({
        ...scenario,
        radio: {
          ...scenario.radio,
          txGainDbi:
            antennaGain
              ?.effectiveGainDbi
            ?? scenario.radio.txGainDbi,
        },
      }),
      [
        scenario,
        antennaGain,
      ],
    );

  const fsplResult = useMemo(
    () =>
      calculateLinkBudget(
        scenarioWithAntenna.radio,
      ),
    [scenarioWithAntenna],
  );

  const propagationResult =
    useMemo<PropagationResult | null>(
      () => {
        if (
          propagationModel === 'FSPL'
        ) {
          return null;
        }

        return calculate3gppPathLoss({
          model:
            propagationModel,
          condition:
            propagationCondition,
          frequencyHz:
            scenario.radio.frequencyHz,
          distance2DM:
            Math.max(
              distanceM,
              0.01,
            ),
        });
      },
      [
        propagationModel,
        propagationCondition,
        scenario.radio.frequencyHz,
        distanceM,
      ],
    );

  const radioResult =
    useMemo<LinkBudgetResult | null>(
      () => {
        if (
          propagationModel === 'FSPL'
        ) {
          return fsplResult;
        }

        if (
          !propagationResult
          || !propagationResult
            .isApplicable
          || propagationResult
            .pathLossDb === undefined
        ) {
          return null;
        }

        return calculateLinkBudgetFromPathLoss(
          scenarioWithAntenna.radio,
          propagationResult.pathLossDb,
        );
      },
      [
        propagationModel,
        propagationResult,
        scenarioWithAntenna,
        fsplResult,
      ],
    );

  const assessment = useMemo(
    () =>
      radioResult
        ? evaluate5gNr(
            scenarioWithAntenna,
            radioResult,
          )
        : null,
    [
      scenarioWithAntenna,
      radioResult,
    ],
  );

  useEffect(() => {
    placementModeRef.current =
      placementMode;
  }, [placementMode]);

  useEffect(() => {
    const worker = new Worker(
      new URL(
        '../../../workers/coverage.worker.ts',
        import.meta.url,
      ),
      {
        type: 'module',
      },
    );

    worker.onmessage = (
      event: MessageEvent<{
        requestId: number;
        result?: CoverageResult;
        error?: string;
      }>,
    ) => {
      if (
        event.data.requestId
        !== coverageRequestIdRef.current
      ) {
        return;
      }

      setCoverageLoading(false);

      if (event.data.error) {
        setCoverageError(
          event.data.error,
        );
        return;
      }

      if (event.data.result) {
        setCoverageResult(
          event.data.result,
        );
      }
    };

    coverageWorkerRef.current =
      worker;

    return () => {
      worker.terminate();
      coverageWorkerRef.current =
        null;
    };
  }, []);

  useEffect(() => {
    if (
      !mapContainerRef.current
      || mapRef.current
    ) {
      return;
    }

    let cancelled = false;
    let localMap:
      | MapLibreMap
      | null = null;

    void (
      async () => {
        const {
          Map,
          Marker,
          Popup,
          setWorkerUrl,
        } = await import(
          'maplibre-gl'
        );

        if (
          cancelled
          || !mapContainerRef.current
        ) {
          return;
        }

        /**
         * MapLibre GL JS v6 + Vite:
         * el worker debe pasar explícitamente por el pipeline
         * `?worker&url` para generar un recurso autocontenido.
         *
         * Esto evita que el servidor de desarrollo intente
         * resolver `maplibre-gl-worker.mjs` dentro de
         * `.vite/deps`, donde puede no existir.
         */
        setWorkerUrl(
          mapLibreWorkerUrl,
        );

        const map = new Map({
          container:
            mapContainerRef.current,
          style: rasterStyle,
          center: [
            (
              INITIAL_TX.lng
              + INITIAL_RX.lng
            ) / 2,
            (
              INITIAL_TX.lat
              + INITIAL_RX.lat
            ) / 2,
          ],
          zoom: 13,
          dragRotate: false,
          pitchWithRotate: false,
          attributionControl: true,
        });

        localMap = map;

        map.touchZoomRotate
          .disableRotation();

        const txMarker =
          new Marker({
            color: '#2457d6',
            draggable: true,
          })
            .setLngLat([
              INITIAL_TX.lng,
              INITIAL_TX.lat,
            ])
            .setPopup(
              new Popup({
                offset: 28,
              }).setText(
                'gNB — estación base 5G',
              ),
            )
            .addTo(map);

        const rxMarker =
          new Marker({
            color: '#d97706',
            draggable: true,
          })
            .setLngLat([
              INITIAL_RX.lng,
              INITIAL_RX.lat,
            ])
            .setPopup(
              new Popup({
                offset: 28,
              }).setText(
                'UE — equipo de usuario',
              ),
            )
            .addTo(map);

        txMarker.on(
          'dragend',
          () => {
            const position =
              txMarker.getLngLat();

            setTx({
              lng: position.lng,
              lat: position.lat,
            });
          },
        );

        rxMarker.on(
          'dragend',
          () => {
            const position =
              rxMarker.getLngLat();

            setRx({
              lng: position.lng,
              lat: position.lat,
            });
          },
        );

        function handleMapClick(
          event: MapMouseEvent,
        ) {
          const mode =
            placementModeRef.current;

          if (!mode) {
            return;
          }

          const point: GeoPoint = {
            lng: event.lngLat.lng,
            lat: event.lngLat.lat,
          };

          if (mode === 'TX') {
            setTx(point);
          } else {
            setRx(point);
          }

          setPlacementMode(null);
        }

        map.on(
          'click',
          handleMapClick,
        );

        map.on(
          'load',
          () => {
            map.addSource(
              'coverage-grid',
              {
                type: 'geojson',
                data:
                  EMPTY_FEATURE_COLLECTION,
              },
            );

            map.addLayer({
              id: 'coverage-grid-fill',
              type: 'fill',
              source: 'coverage-grid',
              paint: {
                'fill-color': [
                  'case',
                  [
                    '==',
                    ['get', 'status'],
                    'NOT_EVALUABLE',
                  ],
                  '#94a3b8',
                  [
                    'step',
                    ['get', 'marginDb'],
                    '#b42318',
                    0,
                    '#d97706',
                    10,
                    '#14764d',
                  ],
                ],
                'fill-opacity': 0.48,
                'fill-outline-color':
                  'rgba(255,255,255,0.35)',
              },
            });

            map.addSource(
              'link-line',
              {
                type: 'geojson',
                data:
                  lineGeoJson(
                    INITIAL_TX,
                    INITIAL_RX,
                  ),
              },
            );

            map.addLayer({
              id: 'link-line',
              type: 'line',
              source: 'link-line',
              paint: {
                'line-color':
                  '#334155',
                'line-width': 3,
                'line-dasharray':
                  [2, 1.5],
              },
            });

            setMapReady(true);
          },
        );

        mapRef.current = map;
        txMarkerRef.current =
          txMarker;
        rxMarkerRef.current =
          rxMarker;
      }
    )();

    return () => {
      cancelled = true;
      setMapReady(false);

      localMap?.remove();

      if (
        mapRef.current
        === localMap
      ) {
        mapRef.current = null;
      }

      txMarkerRef.current = null;
      rxMarkerRef.current = null;
    };
  }, []);

  useEffect(() => {
    txMarkerRef.current?.setLngLat([
      tx.lng,
      tx.lat,
    ]);

    rxMarkerRef.current?.setLngLat([
      rx.lng,
      rx.lat,
    ]);

    const map =
      mapRef.current;

    if (!map || !mapReady) {
      return;
    }

    const source =
      map.getSource(
        'link-line',
      ) as
        | GeoJSONSource
        | undefined;

    source?.setData(
      lineGeoJson(
        tx,
        rx,
      ),
    );
  }, [
    tx,
    rx,
    mapReady,
  ]);

  useEffect(() => {
    const map =
      mapRef.current;

    if (!map || !mapReady) {
      return;
    }

    const source =
      map.getSource(
        'coverage-grid',
      ) as
        | GeoJSONSource
        | undefined;

    source?.setData(
      coverageVisible
        ? coverageGeoJson(
            coverageResult,
          )
        : EMPTY_FEATURE_COLLECTION,
    );
  }, [
    coverageResult,
    coverageVisible,
    mapReady,
  ]);

  useEffect(() => {
    if (
      propagationModel
      === 'INH_OFFICE'
      && coverageRadiusM > 100
    ) {
      setCoverageRadiusM(100);
    }
  }, [
    propagationModel,
    coverageRadiusM,
  ]);

  function centerLink() {
    const map =
      mapRef.current;

    if (!map) {
      return;
    }

    if (distanceM < 1) {
      map.flyTo({
        center: [
          tx.lng,
          tx.lat,
        ],
        zoom: 16,
        duration: 500,
      });

      return;
    }

    map.fitBounds(
      [
        [
          Math.min(
            tx.lng,
            rx.lng,
          ),
          Math.min(
            tx.lat,
            rx.lat,
          ),
        ],
        [
          Math.max(
            tx.lng,
            rx.lng,
          ),
          Math.max(
            tx.lat,
            rx.lat,
          ),
        ],
      ],
      {
        padding: 80,
        maxZoom: 15,
        duration: 550,
      },
    );
  }

  function resetExample() {
    setPlacementMode(null);
    setTx(INITIAL_TX);
    setRx(INITIAL_RX);
    setPropagationModel(
      'FSPL',
    );
    setPropagationCondition(
      'LOS',
    );
    setAntennaMode(
      'FIXED_GAIN',
    );
    setAntennaAzimuthDeg(90);
    setAntennaDowntiltDeg(5);
    setCoverageResult(null);
    setCoverageError('');

    window.setTimeout(
      centerLink,
      0,
    );
  }

  function zoomIn() {
    mapRef.current?.zoomIn({
      duration: 250,
    });
  }

  function zoomOut() {
    mapRef.current?.zoomOut({
      duration: 250,
    });
  }

  function generateCoverage() {
    const worker =
      coverageWorkerRef.current;

    if (!worker) {
      setCoverageError(
        'El motor de cobertura todavía no está disponible.',
      );
      return;
    }

    setCoverageError('');
    setCoverageLoading(true);
    setCoverageVisible(true);

    const requestId =
      coverageRequestIdRef.current
      + 1;

    coverageRequestIdRef.current =
      requestId;

    const input:
      CoverageInput = {
        center: tx,
        radiusM:
          coverageRadiusM,
        gridSize:
          coverageGridSize,
        radio:
          scenario.radio,
        propagationModel,
        propagationCondition,
        antenna:
          antennaConfig,
      };

    worker.postMessage({
      requestId,
      input,
    });
  }

  const bearingLabel =
    bearingDeg === null
      ? 'Sin dirección'
      : `${formatNumber(
          bearingDeg,
          1,
        )}° ${bearingToCardinal(
          bearingDeg,
        )}`;

  const marginPass =
    radioResult
      ?.linkMarginDb !== undefined
    && radioResult.linkMarginDb
      >= 0;

  const deltaVsFsplDb =
    radioResult
    && propagationModel
      !== 'FSPL'
      ? radioResult.pathLossDb
        - fsplResult.pathLossDb
      : 0;

  return (
    <div className="map-planner">
      <section className="planner-intro">
        <div>
          <span className="planner-eyebrow">
            Fase 6 · Antenas y cobertura
          </span>
          <h2>
            Ahora la dirección de la antena importa
          </h2>
          <p>
            Puedes mantener la ganancia fija de las fases
            anteriores o utilizar el patrón de un elemento
            direccional de referencia de 3GPP. La
            cobertura se calcula punto por punto sin
            modificar automáticamente el escenario.
          </p>
        </div>

        <div className="planner-profile">
          <span>
            Perfil{' '}
            <PlannerTerm helpKey="nr">
              <strong>
                5G NR
              </strong>
            </PlannerTerm>{' '}
            <PlannerTerm helpKey="n78">
              <strong>
                n78
              </strong>
            </PlannerTerm>
          </span>

          <span>
            Frecuencia{' '}
            <strong>
              3500 MHz
            </strong>
          </span>

          <span>
            Ancho{' '}
            <strong>
              100 MHz
            </strong>
          </span>
        </div>
      </section>

      <section className="phase6-controls">
        <div className="phase6-control-block">
          <label htmlFor="propagation-model">
            <PlannerTerm helpKey="propagation">
              Modelo de propagación
            </PlannerTerm>
          </label>

          <select
            id="propagation-model"
            value={propagationModel}
            onChange={(event) =>
              setPropagationModel(
                event.target
                  .value as PropagationModelId,
              )
            }
          >
            {Object.entries(
              modelLabels,
            ).map(
              ([id, label]) => (
                <option
                  value={id}
                  key={id}
                >
                  {label}
                </option>
              ),
            )}
          </select>
        </div>

        {propagationModel !== 'FSPL' && (
          <div className="phase6-control-block">
            <label htmlFor="propagation-condition">
              Condición de visibilidad
            </label>

            <select
              id="propagation-condition"
              value={
                propagationCondition
              }
              onChange={(event) =>
                setPropagationCondition(
                  event.target
                    .value as PropagationCondition,
                )
              }
            >
              <option value="LOS">
                LOS · con línea de vista
              </option>
              <option value="NLOS">
                NLOS · sin línea de vista
              </option>
            </select>

            <div className="condition-help-row">
              <PlannerTerm helpKey="los">
                LOS
              </PlannerTerm>
              <span>vs.</span>
              <PlannerTerm helpKey="nlos">
                NLOS
              </PlannerTerm>
            </div>
          </div>
        )}

        <div className="phase6-control-block">
          <label htmlFor="antenna-mode">
            <PlannerTerm helpKey="antennaMode">
              Modelo de antena
            </PlannerTerm>
          </label>

          <select
            id="antenna-mode"
            value={antennaMode}
            onChange={(event) =>
              setAntennaMode(
                event.target
                  .value as AntennaMode,
              )
            }
          >
            {Object.entries(
              antennaLabels,
            ).map(
              ([id, label]) => (
                <option
                  value={id}
                  key={id}
                >
                  {label}
                </option>
              ),
            )}
          </select>
        </div>

        <div className="phase6-explanation">
          <strong>
            {modelLabels[
              propagationModel
            ]}
          </strong>
          <span>
            {modelDescriptions[
              propagationModel
            ]}
          </span>
        </div>
      </section>

      <details className="propagation-guide">
        <summary>
          ¿Cómo elegir el modelo y qué significa LOS/NLOS?
        </summary>

        <div className="visibility-guide">
          <article className="visibility-card">
            <div className="visibility-diagram">
              <span className="diagram-node">
                gNB
              </span>
              <span className="diagram-line diagram-line--los" />
              <span className="diagram-node">
                UE
              </span>
            </div>

            <h3>
              <PlannerTerm helpKey="los">
                LOS · con línea de vista
              </PlannerTerm>
            </h3>

            <p>
              Existe un trayecto directo dominante entre
              estación y usuario. En igualdad de
              condiciones normalmente produce menos
              pérdida.
            </p>
          </article>

          <article className="visibility-card">
            <div className="visibility-diagram">
              <span className="diagram-node">
                gNB
              </span>
              <span className="diagram-building">
                edificio
              </span>
              <span className="diagram-node">
                UE
              </span>
            </div>

            <h3>
              <PlannerTerm helpKey="nlos">
                NLOS · sin línea de vista
              </PlannerTerm>
            </h3>

            <p>
              El trayecto directo está bloqueado. La señal
              llega principalmente por reflexiones,
              difracción y otros caminos.
            </p>
          </article>
        </div>
      </details>

      <section className="antenna-panel">
        <header>
          <div>
            <span className="planner-eyebrow">
              Antena transmisora
            </span>
            <h2>
              Orientación y ganancia efectiva
            </h2>
          </div>

          <div className="antenna-source-chip">
            {antennaMode
              === 'FIXED_GAIN'
              ? 'Parámetro del escenario'
              : '3GPP TR 38.901 · tabla 7.3-1'}
          </div>
        </header>

        <div className="antenna-controls-grid">
          <div className="antenna-field">
            <label htmlFor="antenna-azimuth">
              <PlannerTerm helpKey="azimuth">
                Azimut
              </PlannerTerm>
            </label>

            <div className="number-unit">
              <input
                id="antenna-azimuth"
                type="number"
                min="0"
                max="359"
                step="1"
                value={
                  antennaAzimuthDeg
                }
                onChange={(event) =>
                  setAntennaAzimuthDeg(
                    Number(
                      event.target.value,
                    ),
                  )
                }
              />
              <span>°</span>
            </div>
          </div>

          <div className="antenna-field">
            <label htmlFor="antenna-downtilt">
              <PlannerTerm helpKey="downtilt">
                Inclinación hacia abajo
              </PlannerTerm>
            </label>

            <div className="number-unit">
              <input
                id="antenna-downtilt"
                type="number"
                min="-20"
                max="30"
                step="0.5"
                value={
                  antennaDowntiltDeg
                }
                onChange={(event) =>
                  setAntennaDowntiltDeg(
                    Number(
                      event.target.value,
                    ),
                  )
                }
              />
              <span>°</span>
            </div>
          </div>

          <div className="antenna-readout">
            <small>
              <PlannerTerm helpKey="effectiveGain">
                Ganancia hacia el UE
              </PlannerTerm>
            </small>
            <strong>
              {formatNumber(
                antennaGain
                  ?.effectiveGainDbi,
              )} dBi
            </strong>
          </div>

          <div className="antenna-readout">
            <small>
              Diferencia de azimut
            </small>
            <strong>
              {formatNumber(
                antennaGain
                  ?.horizontalOffsetDeg,
                1,
              )}°
            </strong>
          </div>
        </div>

        {antennaMode
          === 'THREE_GPP_SINGLE_ELEMENT'
          ? (
            <div className="antenna-standard-note">
              <PlannerTerm helpKey="beamwidth">
                Elemento 3GPP de referencia
              </PlannerTerm>
              <span>
                Ganancia máxima: <strong>8 dBi</strong>
              </span>
              <span>
                Haz horizontal: <strong>65°</strong>
              </span>
              <span>
                Haz vertical: <strong>65°</strong>
              </span>
              <span>
                Atenuación máxima: <strong>30 dB</strong>
              </span>
              <p>
                Este patrón corresponde a un
                <strong> elemento individual</strong> del
                modelo de 3GPP. No equivale a simular un
                arreglo Massive MIMO completo.
              </p>
            </div>
          )
          : (
            <div className="antenna-standard-note">
              <PlannerTerm helpKey="fixedGain">
                Ganancia fija
              </PlannerTerm>
              <span>
                Valor aplicado:{' '}
                <strong>
                  {formatNumber(
                    scenario.radio
                      .txGainDbi,
                  )} dBi
                </strong>
              </span>
              <p>
                Mantiene la misma ganancia en cualquier
                dirección y reproduce el comportamiento
                de las fases anteriores.
              </p>
            </div>
          )}
      </section>

      <section className="planner-layout">
        <div className="map-panel">
          <div className="map-toolbar">
            <div className="placement-buttons">
              <button
                type="button"
                className={
                  placementMode
                    === 'TX'
                    ? 'active'
                    : ''
                }
                onClick={() =>
                  setPlacementMode(
                    placementMode
                      === 'TX'
                      ? null
                      : 'TX',
                  )
                }
              >
                Ubicar gNB
              </button>

              <button
                type="button"
                className={
                  placementMode
                    === 'RX'
                    ? 'active'
                    : ''
                }
                onClick={() =>
                  setPlacementMode(
                    placementMode
                      === 'RX'
                      ? null
                      : 'RX',
                  )
                }
              >
                Ubicar UE
              </button>
            </div>

            <div className="map-view-buttons">
              <button
                type="button"
                onClick={zoomIn}
              >
                +
              </button>
              <button
                type="button"
                onClick={zoomOut}
              >
                −
              </button>
              <button
                type="button"
                onClick={centerLink}
              >
                Centrar enlace
              </button>
            </div>
          </div>

          {placementMode && (
            <div className="placement-message">
              Haz clic en el mapa para ubicar{' '}
              <strong>
                {placementMode
                  === 'TX'
                  ? 'la gNB'
                  : 'el UE'}
              </strong>.
            </div>
          )}

          <div
            ref={mapContainerRef}
            className="map-container"
            aria-label="Mapa interactivo para ubicar gNB y UE"
          />

          <div className="coverage-legend">
            <span>
              <i className="coverage-color coverage-color--pass" />
              margen ≥ 10 dB
            </span>
            <span>
              <i className="coverage-color coverage-color--marginal" />
              0 a 10 dB
            </span>
            <span>
              <i className="coverage-color coverage-color--fail" />
              margen &lt; 0 dB
            </span>
            <span>
              <i className="coverage-color coverage-color--na" />
              no evaluable
            </span>
          </div>

          <div className="map-legend">
            <span>
              <i className="legend-dot legend-dot--tx" />
              <PlannerTerm helpKey="gnb">
                gNB · estación base
              </PlannerTerm>
            </span>
            <span>
              <i className="legend-dot legend-dot--rx" />
              <PlannerTerm helpKey="ue">
                UE · equipo de usuario
              </PlannerTerm>
            </span>
          </div>
        </div>

        <aside className="link-sidebar">
          <section className="coverage-card">
            <header>
              <span className="planner-eyebrow">
                <PlannerTerm helpKey="coverage">
                  Mapa de cobertura
                </PlannerTerm>
              </span>
              <h3>
                Cuadrícula de evaluación
              </h3>
            </header>

            <div className="coverage-controls">
              <label>
                <PlannerTerm helpKey="coverageRadius">
                  Radio
                </PlannerTerm>
                <select
                  value={
                    coverageRadiusM
                  }
                  onChange={(event) =>
                    setCoverageRadiusM(
                      Number(
                        event.target.value,
                      ),
                    )
                  }
                >
                  {(
                    propagationModel
                    === 'INH_OFFICE'
                      ? [50, 100]
                      : [
                          100,
                          250,
                          500,
                          1000,
                          2000,
                        ]
                  ).map(
                    (value) => (
                      <option
                        key={value}
                        value={value}
                      >
                        {value >= 1000
                          ? `${value / 1000} km`
                          : `${value} m`}
                      </option>
                    ),
                  )}
                </select>
              </label>

              <label>
                <PlannerTerm helpKey="gridResolution">
                  Resolución
                </PlannerTerm>
                <select
                  value={
                    coverageGridSize
                  }
                  onChange={(event) =>
                    setCoverageGridSize(
                      Number(
                        event.target.value,
                      ),
                    )
                  }
                >
                  <option value={21}>
                    21 × 21
                  </option>
                  <option value={31}>
                    31 × 31
                  </option>
                  <option value={41}>
                    41 × 41
                  </option>
                </select>
              </label>
            </div>

            <button
              type="button"
              className="coverage-generate"
              disabled={
                coverageLoading
              }
              onClick={
                generateCoverage
              }
            >
              {coverageLoading
                ? 'Calculando cobertura…'
                : 'Generar cobertura'}
            </button>

            <label className="coverage-toggle">
              <input
                type="checkbox"
                checked={
                  coverageVisible
                }
                onChange={(event) =>
                  setCoverageVisible(
                    event.target.checked,
                  )
                }
              />
              Mostrar capa de cobertura
            </label>

            {coverageError && (
              <p className="coverage-error">
                {coverageError}
              </p>
            )}

            {coverageResult && (
              <div className="coverage-summary">
                <span>
                  Celdas evaluables
                  <strong>
                    {coverageResult
                      .evaluableCells}
                  </strong>
                </span>
                <span>
                  Margen ≥ 0 dB
                  <strong>
                    {coverageResult
                      .passingCells}
                  </strong>
                </span>
                <span>
                  Margen &lt; 0 dB
                  <strong>
                    {coverageResult
                      .failingCells}
                  </strong>
                </span>
                <span>
                  No evaluables
                  <strong>
                    {coverageResult
                      .notEvaluableCells}
                  </strong>
                </span>
              </div>
            )}

            <p className="coverage-note">
              Cada celda reutiliza el mismo modelo de
              propagación, patrón de antena y sensibilidad
              configurados. Esto es una cuadrícula
              académica, no una predicción profesional de
              cobertura.
            </p>
          </section>

          <section className="geometry-card">
            <header>
              <span className="planner-eyebrow">
                Geometría
              </span>
              <h3>
                Enlace gNB → UE
              </h3>
            </header>

            <div className="geometry-hero">
              <div>
                <small>
                  <PlannerTerm helpKey="distance2d">
                    Distancia 2D
                  </PlannerTerm>
                </small>
                <strong>
                  {formatDistance(
                    distanceM,
                  )}
                </strong>
              </div>

              <div>
                <small>
                  <PlannerTerm helpKey="bearing">
                    Rumbo inicial
                  </PlannerTerm>
                </small>
                <strong>
                  {bearingLabel}
                </strong>
              </div>
            </div>

            <div className="coordinate-list">
              <article>
                <span className="coordinate-badge coordinate-badge--tx">
                  gNB
                </span>
                <div>
                  <span>
                    Latitud
                    <strong>
                      {formatCoordinate(
                        tx.lat,
                      )}
                    </strong>
                  </span>
                  <span>
                    Longitud
                    <strong>
                      {formatCoordinate(
                        tx.lng,
                      )}
                    </strong>
                  </span>
                </div>
              </article>

              <article>
                <span className="coordinate-badge coordinate-badge--rx">
                  UE
                </span>
                <div>
                  <span>
                    Latitud
                    <strong>
                      {formatCoordinate(
                        rx.lat,
                      )}
                    </strong>
                  </span>
                  <span>
                    Longitud
                    <strong>
                      {formatCoordinate(
                        rx.lng,
                      )}
                    </strong>
                  </span>
                </div>
              </article>
            </div>

            <button
              type="button"
              className="reset-button"
              onClick={
                resetExample
              }
            >
              Restablecer ejemplo
            </button>
          </section>

          <section className="propagation-card">
            <header>
              <span className="planner-eyebrow">
                Pérdida de propagación
              </span>
              <h3>
                {modelLabels[
                  propagationModel
                ]}
              </h3>
            </header>

            {propagationModel
              === 'FSPL'
              ? (
                <>
                  <div className="propagation-main-value">
                    <small>
                      Pérdida calculada
                    </small>
                    <strong>
                      {formatNumber(
                        fsplResult
                          .pathLossDb,
                      )} dB
                    </strong>
                  </div>
                  <p>
                    Referencia ideal de espacio libre.
                  </p>
                </>
              )
              : propagationResult
                ?.isApplicable
                ? (
                  <>
                    <div className="propagation-main-value">
                      <small>
                        <PlannerTerm helpKey="pathLoss">
                          Pérdida 3GPP
                        </PlannerTerm>
                      </small>
                      <strong>
                        {formatNumber(
                          propagationResult
                            .pathLossDb,
                        )} dB
                      </strong>
                    </div>

                    <div className="propagation-comparison">
                      <span>
                        FSPL de referencia
                        <strong>
                          {formatNumber(
                            fsplResult
                              .pathLossDb,
                          )} dB
                        </strong>
                      </span>
                      <span>
                        Diferencia
                        <strong>
                          {deltaVsFsplDb
                            >= 0
                            ? '+'
                            : ''}
                          {formatNumber(
                            deltaVsFsplDb,
                          )} dB
                        </strong>
                      </span>
                      <span>
                        <PlannerTerm helpKey="distance3d">
                          Distancia 3D
                        </PlannerTerm>
                        <strong>
                          {formatDistance(
                            propagationResult
                              .distance3DM,
                          )}
                        </strong>
                      </span>
                      <span>
                        <PlannerTerm helpKey="heights">
                          Alturas
                        </PlannerTerm>
                        <strong>
                          {propagationResult
                            .bsHeightM} m /{' '}
                          {propagationResult
                            .utHeightM} m
                        </strong>
                      </span>
                    </div>
                  </>
                )
                : (
                  <div className="model-outside-domain">
                    <strong>
                      Fuera del dominio del modelo
                    </strong>
                    {propagationResult
                      ?.messages
                      .map(
                        (message) => (
                          <p key={message}>
                            {message}
                          </p>
                        ),
                      )}
                  </div>
                )}
          </section>

          <section className="map-radio-card">
            <header>
              <span className="planner-eyebrow">
                Resultado RF
              </span>
              <h3>
                {!radioResult
                  ? 'No evaluable con el modelo seleccionado'
                  : marginPass
                    ? 'Enlace viable según sensibilidad'
                    : 'Enlace no viable según sensibilidad'}
              </h3>
            </header>

            {radioResult && (
              <>
                <div className="map-radio-metrics">
                  <span>
                    <small>
                      Pérdida
                    </small>
                    <strong>
                      {formatNumber(
                        radioResult
                          .pathLossDb,
                      )} dB
                    </strong>
                  </span>

                  <span>
                    <small>
                      <PlannerTerm helpKey="receivedPower">
                        Potencia recibida
                      </PlannerTerm>
                    </small>
                    <strong>
                      {formatNumber(
                        radioResult
                          .receivedPowerDbm,
                      )} dBm
                    </strong>
                  </span>

                  <span>
                    <small>
                      <PlannerTerm helpKey="snr">
                        SNR
                      </PlannerTerm>
                    </small>
                    <strong>
                      {formatNumber(
                        radioResult
                          .snrDb,
                      )} dB
                    </strong>
                  </span>

                  <span
                    className={
                      marginPass
                        ? 'metric-pass'
                        : 'metric-fail'
                    }
                  >
                    <small>
                      <PlannerTerm helpKey="linkMargin">
                        Margen
                      </PlannerTerm>
                    </small>
                    <strong>
                      {formatNumber(
                        radioResult
                          .linkMarginDb,
                      )} dB
                    </strong>
                  </span>
                </div>

                {assessment && (
                  <div className="assessment-mini">
                    <span>
                      Perfil 5G NR
                    </span>
                    <strong>
                      {assessmentLabel(
                        assessment
                          .aggregateStatus,
                      )}
                    </strong>
                  </div>
                )}
              </>
            )}

            <div className="fixed-parameters-note">
              <strong>
                Parámetros que NO se ajustan solos
              </strong>
              <span>
                Potencia TX{' '}
                {scenario.radio
                  .txPowerDbm} dBm
              </span>
              <span>
                Antena:{' '}
                {
                  antennaLabels[
                    antennaMode
                  ]
                }
              </span>
              <span>
                Sensibilidad{' '}
                {scenario.radio
                  .receiverSensitivityDbm} dBm
              </span>
            </div>
          </section>
        </aside>
      </section>

      <section className="map-method-note">
        <strong>
          Interpretación correcta
        </strong>
        <p>
          El patrón direccional implementado reproduce el
          patrón de potencia de un <strong>elemento</strong>
          de antena de la tabla 7.3-1 de 3GPP TR 38.901.
          Todavía no calculamos el factor de arreglo,
          precodificación, beamforming ni Massive MIMO
          completo. La cobertura representa una evaluación
          por celdas del modelo académico actual.
        </p>
      </section>
    </div>
  );
}
