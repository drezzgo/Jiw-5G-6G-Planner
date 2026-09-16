import {
  useEffect,
  useMemo,
  useState,
  type FormEvent,
  type ReactNode,
} from 'react';

import {
  calculateLinkBudget,
  type LinkBudgetResult,
} from '../../../core/radio';

import {
  evaluate5gNr,
  evaluateImt2030,
} from '../../../core/assessment/evaluate';

import type {
  AssessmentScenario,
  ProfileAssessment,
} from '../../../core/assessment/types';

import {
  getReferenceScenario,
  referenceScenarios,
  type ReferenceScenario,
} from '../../../core/scenarios/reference-scenarios';

import {
  getEvidenceForCriterion,
} from '../../../knowledge/evidence-registry';

import {
  LabelWithHelp,
} from './ContextHelp';

import SourceEvidence from './SourceEvidence';

import TechnicalTerm from '../common/TechnicalTerm';

import './calculator.css';

type ViewMode =
  | '5G_NR'
  | 'IMT2030_EXPERIMENTAL'
  | 'COMPARE';

type NumericRadioKey =
  | 'frequencyHz'
  | 'distanceM'
  | 'txPowerDbm'
  | 'txGainDbi'
  | 'txLossDb'
  | 'rxGainDbi'
  | 'rxLossDb'
  | 'bandwidthHz'
  | 'temperatureK'
  | 'noiseFigureDb'
  | 'receiverSensitivityDbm';

const sourceUrls: Record<string, string> = {
  ETSI_TS_138_101_1_V18_7_0:
    'https://www.etsi.org/deliver/etsi_TS/138100_138199/13810101/18.07.00_60/ts_13810101v180700p.pdf',
  ITU_R_M_2160_0_2023:
    'https://www.itu.int/rec/R-REC-M.2160-0-202311-I/en',
  ITU_IMT2030_WP5D_2026:
    'https://www.itu.int/en/ITU-R/study-groups/rsg5/rwp5d/imt-2030/pages/default.aspx',
};

function deepCloneScenario(
  scenario: AssessmentScenario,
): AssessmentScenario {
  return structuredClone(scenario);
}

function format(
  value: number | undefined,
  digits = 2,
): string {
  if (value === undefined || !Number.isFinite(value)) {
    return '—';
  }

  return value.toLocaleString('es-CO', {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  });
}

function formatCompact(
  value: number,
  digits = 3,
): string {
  if (!Number.isFinite(value)) return '';

  return Number(value.toFixed(digits)).toString();
}


function formatOperationNumber(
  value: number | undefined,
  digits = 3,
): string {
  if (value === undefined || !Number.isFinite(value)) {
    return '—';
  }

  return value.toLocaleString('es-CO', {
    maximumFractionDigits: digits,
  });
}

function statusLabel(status: string): string {
  switch (status) {
    case 'PASS':
      return 'Pasa';
    case 'PASS_WITH_WARNINGS':
      return 'Pasa con advertencias';
    case 'FAIL':
      return 'Falla';
    case 'CONDITIONAL':
      return 'Condicional';
    case 'NOT_EVALUABLE':
      return 'No evaluable';
    default:
      return status;
  }
}

function statusClass(status: string): string {
  return `status status--${status.toLowerCase()}`;
}

function NumericInput({
  id,
  label,
  helpKey,
  value,
  unit,
  onValueChange,
  decimals = 3,
  helper,
}: {
  id: string;
  label: string;
  helpKey: keyof typeof parameterHelp;
  value: number;
  unit: string;
  onValueChange: (value: number) => void;
  decimals?: number;
  helper?: string;
}) {
  const [draft, setDraft] = useState(
    formatCompact(value, decimals),
  );

  useEffect(() => {
    setDraft(formatCompact(value, decimals));
  }, [value, decimals]);

  function handleChange(raw: string) {
    setDraft(raw);

    const normalized = raw
      .trim()
      .replace(',', '.');

    if (
      normalized === ''
      || normalized === '-'
      || normalized === '.'
      || normalized === '-.'
    ) {
      return;
    }

    const parsed = Number(normalized);

    if (Number.isFinite(parsed)) {
      onValueChange(parsed);
    }
  }

  function normalizeDisplay() {
    setDraft(formatCompact(value, decimals));
  }

  return (
    <div className="field">
      <label htmlFor={id}>
        <LabelWithHelp
          label={label}
          helpKey={helpKey}
        />
      </label>

      <div className="input-unit">
        <input
          id={id}
          type="text"
          inputMode="decimal"
          autoComplete="off"
          value={draft}
          onChange={(event) =>
            handleChange(event.target.value)
          }
          onBlur={normalizeDisplay}
          aria-describedby={
            helper ? `${id}-helper` : undefined
          }
        />
        <span>{unit}</span>
      </div>

      {helper && (
        <small
          className="field-helper"
          id={`${id}-helper`}
        >
          {helper}
        </small>
      )}
    </div>
  );
}

function ResultCard({
  label,
  value,
  unit,
  tone = 'default',
  note,
}: {
  label: ReactNode;
  value: string;
  unit: string;
  tone?: 'default' | 'accent' | 'success' | 'danger';
  note?: string;
}) {
  return (
    <article className={`result-card result-card--${tone}`}>
      <span className="result-card__label">{label}</span>
      <strong className="result-card__value">
        {value}
        <small>{unit}</small>
      </strong>
      {note && (
        <span className="result-card__note">{note}</span>
      )}
    </article>
  );
}

function FormulaRow({
  step,
  name,
  formula,
  substitution,
  result,
  explanation,
}: {
  step: number;
  name: string;
  formula: string;
  substitution: string;
  result: string;
  explanation: string;
}) {
  return (
    <article className="formula-row">
      <div className="formula-step">{step}</div>

      <div className="formula-content">
        <div className="formula-heading">
          <strong>{name}</strong>
          <span>{result}</span>
        </div>

        <div
          className="math-formula"
          aria-label={`Fórmula de ${name}`}
        >
          {formula}
        </div>

        <div
          className="math-substitution"
          aria-label={`Sustitución de valores para ${name}`}
        >
          <span>Sustitución con el escenario actual</span>
          <code>{substitution}</code>
        </div>

        <p>{explanation}</p>
      </div>
    </article>
  );
}


function criterionLabelNode(
  id: string,
  fallback: string,
): ReactNode {
  switch (id) {
    case 'n78-frequency':
      return (
        <>
          Frecuencia compatible con la banda{' '}
          <TechnicalTerm termKey="n78">
            n78
          </TechnicalTerm>
        </>
      );

    case 'n78-duplex':
      return (
        <>
          Duplexación{' '}
          <TechnicalTerm termKey="tdd">
            TDD
          </TechnicalTerm>{' '}
          para n78
        </>
      );

    case 'n78-bandwidth-scs30':
      return (
        <>
          Ancho de banda con{' '}
          <TechnicalTerm termKey="scs">
            SCS
          </TechnicalTerm>{' '}
          de 30 kHz
        </>
      );

    case 'snr-information':
      return (
        <>
          Relación señal/ruido{' '}
          (
          <TechnicalTerm termKey="snr">
            SNR
          </TechnicalTerm>
          )
        </>
      );

    case 'shannon-information':
      return (
        <>
          Capacidad teórica de{' '}
          <TechnicalTerm termKey="shannon">
            Shannon
          </TechnicalTerm>
        </>
      );

    default:
      return fallback;
  }
}

function AssessmentPanel({
  assessment,
  expanded,
}: {
  assessment: ProfileAssessment;
  expanded: boolean;
}) {
  const passed = assessment.criteria.filter(
    (criterion) => criterion.status === 'PASS',
  ).length;

  const failed = assessment.criteria.filter(
    (criterion) => criterion.status === 'FAIL',
  ).length;

  const pending = assessment.criteria.length - passed - failed;

  return (
    <section className="assessment-panel">
      <header className="assessment-panel__header">
        <div>
          <span className="eyebrow">Perfil evaluado</span>
          <h3>{assessment.label}</h3>
        </div>

        <span
          className={statusClass(
            assessment.aggregateStatus,
          )}
        >
          {statusLabel(assessment.aggregateStatus)}
        </span>
      </header>

      <div className="assessment-summary">
        <div>
          <strong>{passed}</strong>
          <span>pasan</span>
        </div>
        <div>
          <strong>{failed}</strong>
          <span>fallan</span>
        </div>
        <div>
          <strong>{pending}</strong>
          <span>condicionales / no evaluables</span>
        </div>
      </div>

      {assessment.blockers.length > 0 ? (
        <div className="blockers">
          <span className="blockers__title">
            Aspectos que impiden aprobar el perfil
          </span>

          {assessment.blockers.map((blocker) => (
            <div
              className="blocker-line"
              key={blocker.id}
            >
              <span
                className={statusClass(blocker.status)}
              >
                {statusLabel(blocker.status)}
              </span>
              <span>
                {criterionLabelNode(
                  blocker.id,
                  blocker.label,
                )}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-blockers">
          No se detectaron aspectos críticos que fallen en
          las reglas implementadas para este perfil.
        </div>
      )}

      <details
        className="assessment-details"
        open={expanded}
      >
        <summary>Ver criterios evaluados</summary>

        <div className="criteria">
          {assessment.criteria.map((criterion) => {
            const url =
              sourceUrls[criterion.source.sourceId];

            return (
              <article
                className="criterion"
                key={criterion.id}
              >
                <div className="criterion__top">
                  <div>
                    <strong>
                      {criterionLabelNode(
                        criterion.id,
                        criterion.label,
                      )}
                    </strong>
                    <div className="criterion__meta">
                      {criterion.severity}
                      {' · '}
                      {criterion.source.sourceType}
                    </div>
                  </div>

                  <span
                    className={statusClass(
                      criterion.status,
                    )}
                  >
                    {statusLabel(criterion.status)}
                  </span>
                </div>

                {(criterion.observedValue !== undefined
                  || criterion.requiredValue !== undefined) && (
                  <div className="criterion__values">
                    {criterion.observedValue !== undefined && (
                      <span>
                        <small>Valor obtenido</small>
                        <strong>
                          {typeof criterion.observedValue ===
                          'number'
                            ? format(
                                criterion.observedValue,
                                2,
                              )
                            : criterion.observedValue}
                          {criterion.unit
                            ? ` ${criterion.unit}`
                            : ''}
                        </strong>
                      </span>
                    )}

                    {criterion.requiredValue !== undefined && (
                      <span>
                        <small>Referencia</small>
                        <strong>
                          {criterion.requiredValue}
                          {criterion.unit
                            ? ` ${criterion.unit}`
                            : ''}
                        </strong>
                      </span>
                    )}
                  </div>
                )}

                <p>{criterion.explanation}</p>

                {criterion.remediation && (
                  <p className="remediation">
                    <strong>Qué revisar:</strong>{' '}
                    {criterion.remediation}
                  </p>
                )}

                {getEvidenceForCriterion(
                  criterion.id,
                ).length > 0 ? (
                  <SourceEvidence
                    items={getEvidenceForCriterion(
                      criterion.id,
                    )}
                  />
                ) : (
                  <footer className="criterion__source">
                    {url ? (
                      <a
                        href={url}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Abrir fuente técnica · {criterion.source.sourceId}
                      </a>
                    ) : (
                      <span>
                        Fuente · {criterion.source.sourceId}
                      </span>
                    )}
                  </footer>
                )}
              </article>
            );
          })}
        </div>
      </details>
    </section>
  );
}

export default function RadioCalculator() {
  const firstPreset = getReferenceScenario(
    'N78_REFERENCE',
  );

  const [presetId, setPresetId] =
    useState<ReferenceScenario['id']>(
      firstPreset.id,
    );

  const [scenario, setScenario] =
    useState<AssessmentScenario>(
      deepCloneScenario(firstPreset.scenario),
    );

  const [parameterNotice, setParameterNotice] =
    useState(firstPreset.parameterNotice);

  const [changedFrom, setChangedFrom] =
    useState(firstPreset.changedFrom);

  const [viewMode, setViewMode] =
    useState<ViewMode>('5G_NR');

  const [defenseMode, setDefenseMode] =
    useState(false);

  const [result, setResult] =
    useState<LinkBudgetResult>(() =>
      calculateLinkBudget(firstPreset.scenario.radio),
    );

  const [error, setError] = useState('');

  const assessment5g = useMemo(
    () => evaluate5gNr(scenario, result),
    [scenario, result],
  );

  const assessmentImt2030 = useMemo(
    () => evaluateImt2030(scenario, result),
    [scenario, result],
  );

  function loadPreset(
    id: ReferenceScenario['id'],
  ) {
    const preset = getReferenceScenario(id);

    setPresetId(id);
    setScenario(
      deepCloneScenario(preset.scenario),
    );
    setParameterNotice(preset.parameterNotice);
    setChangedFrom(preset.changedFrom);
    setError('');

    try {
      setResult(
        calculateLinkBudget(preset.scenario.radio),
      );
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : 'No fue posible calcular el escenario.',
      );
    }
  }

  function updateRadio(
    key: NumericRadioKey,
    displayedValue: number,
    multiplier = 1,
  ) {
    setScenario((current) => ({
      ...current,
      radio: {
        ...current.radio,
        [key]: displayedValue * multiplier,
      },
    }));
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    setError('');

    try {
      setResult(
        calculateLinkBudget(scenario.radio),
      );
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : 'No fue posible calcular el escenario.',
      );
    }
  }

  const capacityMbps =
    result.shannonCapacityBps / 1e6;

  const linkPass =
    result.linkMarginDb !== undefined
    && result.linkMarginDb >= 0;

  const linkStatus =
    result.linkMarginDb === undefined
      ? 'No se puede evaluar sin sensibilidad'
      : linkPass
        ? 'Enlace viable según la sensibilidad configurada'
        : 'Enlace no viable según la sensibilidad configurada';

  const selectedPreset =
    referenceScenarios.find(
      (preset) => preset.id === presetId,
    ) ?? firstPreset;

  return (
    <div className="radio-calculator">
      <section className="calculator-toolbar" id="escenario">
        <div className="field field--scenario">
          <label htmlFor="preset">
            Caso de referencia
          </label>

          <select
            id="preset"
            value={presetId}
            onChange={(event) =>
              loadPreset(
                event.target
                  .value as ReferenceScenario['id'],
              )
            }
          >
            {referenceScenarios.map((preset) => (
              <option
                value={preset.id}
                key={preset.id}
              >
                {preset.label}
              </option>
            ))}
          </select>
        </div>

        <div
          className="segmented"
          aria-label="Perfil de evaluación"
        >
          <button
            type="button"
            className={
              viewMode === '5G_NR' ? 'active' : ''
            }
            onClick={() => setViewMode('5G_NR')}
          >
            5G NR
          </button>

          <button
            type="button"
            className={
              viewMode === 'IMT2030_EXPERIMENTAL'
                ? 'active'
                : ''
            }
            onClick={() =>
              setViewMode('IMT2030_EXPERIMENTAL')
            }
          >
            IMT-2030
          </button>

          <button
            type="button"
            className={
              viewMode === 'COMPARE' ? 'active' : ''
            }
            onClick={() => setViewMode('COMPARE')}
          >
            Comparar
          </button>
        </div>

        <label className="defense-toggle">
          <input
            type="checkbox"
            checked={defenseMode}
            onChange={(event) =>
              setDefenseMode(event.target.checked)
            }
          />
          <span>
            <strong>Modo sustentación</strong>
            <small>muestra el desarrollo completo</small>
          </span>
        </label>
      </section>

      <section className="scenario-overview">
        <div>
          <span className="eyebrow">Escenario actual</span>
          <h2>{selectedPreset.label}</h2>
          <p>{selectedPreset.shortDescription}</p>
        </div>

        <div className="technology-profile">
          <span>
            Banda{' '}
            <TechnicalTerm termKey="n78">
              n78
            </TechnicalTerm>
          </span>

          <span>
            <TechnicalTerm termKey="scs">
              SCS
            </TechnicalTerm>{' '}
            <strong>30 kHz</strong>
          </span>

          <span>
            Duplexación{' '}
            <TechnicalTerm termKey="tdd">
              TDD
            </TechnicalTerm>
          </span>

          <span>
            Arquitectura{' '}
            <TechnicalTerm termKey="sa">
              SA
            </TechnicalTerm>
          </span>
        </div>
      </section>

      <details className="scenario-context">
        <summary>
          Alcance y procedencia de los parámetros
        </summary>
        <p>{parameterNotice}</p>
        {changedFrom && (
          <p>
            <strong>Cambio controlado:</strong>{' '}
            {changedFrom}
          </p>
        )}
      </details>

      <form
        className="calculator-grid"
        id="calculo"
        onSubmit={submit}
      >
        <section className="input-panel">
          <header className="panel-heading">
            <div>
              <span className="eyebrow">Entradas</span>
              <h2>Configura el enlace</h2>
            </div>
            <span className="panel-hint">
              Pasa el cursor sobre ? para entender cada
              parámetro
            </span>
          </header>

          <div className="fields-grid fields-grid--primary">
            <NumericInput
              id="frequency"
              label="Frecuencia"
              helpKey="frequency"
              value={scenario.radio.frequencyHz / 1e6}
              unit="MHz"
              decimals={3}
              onValueChange={(value) =>
                updateRadio(
                  'frequencyHz',
                  value,
                  1e6,
                )
              }
            />

            <NumericInput
              id="distance"
              label="Distancia"
              helpKey="distance"
              value={scenario.radio.distanceM}
              unit="m"
              decimals={2}
              onValueChange={(value) =>
                updateRadio('distanceM', value)
              }
            />

            <NumericInput
              id="bandwidth"
              label="Ancho de banda"
              helpKey="bandwidth"
              value={scenario.radio.bandwidthHz / 1e6}
              unit="MHz"
              decimals={3}
              onValueChange={(value) =>
                updateRadio(
                  'bandwidthHz',
                  value,
                  1e6,
                )
              }
            />

            <NumericInput
              id="txPower"
              label="Potencia de transmisión"
              helpKey="txPower"
              value={scenario.radio.txPowerDbm}
              unit="dBm"
              decimals={2}
              onValueChange={(value) =>
                updateRadio('txPowerDbm', value)
              }
            />

            <NumericInput
              id="sensitivity"
              label="Sensibilidad del receptor"
              helpKey="sensitivity"
              value={
                scenario.radio.receiverSensitivityDbm
                ?? -90
              }
              unit="dBm"
              decimals={2}
              helper="Es un parámetro del receptor del escenario, no un valor universal de 5G."
              onValueChange={(value) =>
                updateRadio(
                  'receiverSensitivityDbm',
                  value,
                )
              }
            />
          </div>

          <details className="advanced-panel">
            <summary>Parámetros avanzados</summary>

            <div className="fields-grid">
              <NumericInput
                id="txGain"
                label="Ganancia de antena TX"
                helpKey="txGain"
                value={scenario.radio.txGainDbi}
                unit="dBi"
                decimals={2}
                onValueChange={(value) =>
                  updateRadio('txGainDbi', value)
                }
              />

              <NumericInput
                id="txLoss"
                label="Pérdidas del lado TX"
                helpKey="txLoss"
                value={scenario.radio.txLossDb}
                unit="dB"
                decimals={2}
                onValueChange={(value) =>
                  updateRadio('txLossDb', value)
                }
              />

              <NumericInput
                id="rxGain"
                label="Ganancia de antena RX"
                helpKey="rxGain"
                value={scenario.radio.rxGainDbi}
                unit="dBi"
                decimals={2}
                onValueChange={(value) =>
                  updateRadio('rxGainDbi', value)
                }
              />

              <NumericInput
                id="rxLoss"
                label="Pérdidas del lado RX"
                helpKey="rxLoss"
                value={scenario.radio.rxLossDb}
                unit="dB"
                decimals={2}
                onValueChange={(value) =>
                  updateRadio('rxLossDb', value)
                }
              />

              <NumericInput
                id="noiseFigure"
                label="Figura de ruido"
                helpKey="noiseFigure"
                value={scenario.radio.noiseFigureDb}
                unit="dB"
                decimals={2}
                onValueChange={(value) =>
                  updateRadio('noiseFigureDb', value)
                }
              />

              <NumericInput
                id="temperature"
                label="Temperatura de referencia"
                helpKey="temperature"
                value={scenario.radio.temperatureK}
                unit="K"
                decimals={2}
                onValueChange={(value) =>
                  updateRadio('temperatureK', value)
                }
              />
            </div>
          </details>

          <button
            className="calculate-button"
            type="submit"
          >
            Recalcular escenario
          </button>

          {error && (
            <p
              className="calculator-error"
              role="alert"
            >
              {error}
            </p>
          )}
        </section>

        <section className="results-panel">
          <header className="panel-heading">
            <div>
              <span className="eyebrow">
                Resultado del enlace
              </span>
              <h2>{linkStatus}</h2>
            </div>

            {result.linkMarginDb !== undefined && (
              <span
                className={
                  linkPass
                    ? 'link-indicator link-indicator--pass'
                    : 'link-indicator link-indicator--fail'
                }
              >
                Margen {format(result.linkMarginDb)} dB
              </span>
            )}
          </header>

          <div className="hero-results">
            <ResultCard
              label="Potencia recibida"
              value={format(
                result.receivedPowerDbm,
              )}
              unit="dBm"
              tone="accent"
            />

            <ResultCard
              label="Relación señal/ruido (SNR)"
              value={format(result.snrDb)}
              unit="dB"
            />

            <ResultCard
              label="Margen de enlace"
              value={format(result.linkMarginDb)}
              unit="dB"
              tone={linkPass ? 'success' : 'danger'}
            />

            <ResultCard
              label="Capacidad teórica de Shannon"
              value={format(capacityMbps)}
              unit="Mbit/s"
              note="límite teórico, no velocidad real 5G"
            />
          </div>

          <div className="secondary-results">
            <span>
              <small>
                Pérdida en espacio libre (
                <TechnicalTerm termKey="fspl">
                  FSPL
                </TechnicalTerm>
                )
              </small>
              <strong>
                {format(result.pathLossDb)} dB
              </strong>
            </span>

            <span>
              <small>
                <TechnicalTerm termKey="pire">
                  PIRE (EIRP)
                </TechnicalTerm>
              </small>
              <strong>
                {format(result.eirpDbm)} dBm
              </strong>
            </span>

            <span>
              <small>
                Potencia de ruido
              </small>
              <strong>
                {format(result.noisePowerDbm)} dBm
              </strong>
            </span>
          </div>

          <details
            className="calculation-details"
            open={defenseMode}
          >
            <summary>Ver desarrollo del cálculo</summary>

            <div className="formula-list">
              <FormulaRow
                step={1}
                name="Pérdida de espacio libre"
                formula="FSPL = 20 log₁₀(4πdf / c)"
                substitution={`20 log₁₀((4π × ${formatOperationNumber(scenario.radio.distanceM, 2)} m × ${formatOperationNumber(scenario.radio.frequencyHz, 0)} Hz) / 299.792.458 m/s) = ${format(result.pathLossDb)} dB`}
                result={`${format(result.pathLossDb)} dB`}
                explanation="Usa distancia y frecuencia. Es una referencia ideal de propagación y todavía no incluye edificios, obstáculos urbanos ni desvanecimientos."
              />

              <FormulaRow
                step={2}
                name="Potencia isotrópica radiada equivalente"
                formula="PIRE = Pₜₓ + Gₜₓ − Lₜₓ"
                substitution={`${formatOperationNumber(scenario.radio.txPowerDbm, 2)} dBm + ${formatOperationNumber(scenario.radio.txGainDbi, 2)} dBi − ${formatOperationNumber(scenario.radio.txLossDb, 2)} dB = ${format(result.eirpDbm)} dBm`}
                result={`${format(result.eirpDbm)} dBm`}
                explanation="Combina la potencia de transmisión, la ganancia de antena y las pérdidas del lado transmisor."
              />

              <FormulaRow
                step={3}
                name="Potencia recibida"
                formula="Pᵣₓ = PIRE − PL + Gᵣₓ − Lᵣₓ"
                substitution={`${format(result.eirpDbm)} dBm − ${format(result.pathLossDb)} dB + ${formatOperationNumber(scenario.radio.rxGainDbi, 2)} dBi − ${formatOperationNumber(scenario.radio.rxLossDb, 2)} dB = ${format(result.receivedPowerDbm)} dBm`}
                result={`${format(result.receivedPowerDbm)} dBm`}
                explanation="Aplica la pérdida de propagación y las condiciones del lado receptor."
              />

              <FormulaRow
                step={4}
                name="Potencia de ruido"
                formula="N = 10 log₁₀(kTB / 1 mW) + NF"
                substitution={`10 log₁₀((1,380649×10⁻²³ × ${formatOperationNumber(scenario.radio.temperatureK, 2)} × ${formatOperationNumber(scenario.radio.bandwidthHz, 0)}) / 10⁻³) + ${formatOperationNumber(scenario.radio.noiseFigureDb, 2)} = ${format(result.noisePowerDbm)} dBm`}
                result={`${format(result.noisePowerDbm)} dBm`}
                explanation="Depende del ancho de banda, la temperatura de referencia y la figura de ruido."
              />

              <FormulaRow
                step={5}
                name="Relación señal/ruido"
                formula="SNR = Pᵣₓ − N"
                substitution={`${format(result.receivedPowerDbm)} dBm − (${format(result.noisePowerDbm)} dBm) = ${format(result.snrDb)} dB`}
                result={`${format(result.snrDb)} dB`}
                explanation="Indica cuánto sobresale la señal recibida respecto al ruido calculado. En esta fase no se convierte automáticamente a CQI, MCS o modulación."
              />

              <FormulaRow
                step={6}
                name="Margen del enlace"
                formula="M = Pᵣₓ − Sᵣₓ"
                substitution={`${format(result.receivedPowerDbm)} dBm − (${formatOperationNumber(scenario.radio.receiverSensitivityDbm, 2)} dBm) = ${format(result.linkMarginDb)} dB`}
                result={`${format(result.linkMarginDb)} dB`}
                explanation="Compara la potencia recibida contra la sensibilidad definida para el receptor del escenario."
              />

              <FormulaRow
                step={7}
                name="Capacidad teórica de Shannon"
                formula="C = B log₂(1 + SNRₗᵢₙ)"
                substitution={`${formatOperationNumber(scenario.radio.bandwidthHz, 0)} × log₂(1 + 10^(${format(result.snrDb)}/10)) = ${formatOperationNumber(result.shannonCapacityBps, 0)} bit/s ≈ ${format(capacityMbps)} Mbit/s`}
                result={`${format(capacityMbps)} Mbit/s`}
                explanation="Representa un límite teórico del canal. No equivale a la velocidad real que tendría una red 5G."
              />
            </div>
          </details>
        </section>
      </form>

      <section className="assessment-section" id="evaluacion">
        <header className="section-heading">
          <div>
            <span className="eyebrow">
              Panel de evaluación
            </span>
            <h2>
              ¿Qué pasa, qué falla y por qué?
            </h2>
          </div>

          <p>
            Separamos compatibilidad tecnológica de
            viabilidad radio para evitar conclusiones
            engañosas.
          </p>
        </header>

        <div
          className={
            viewMode === 'COMPARE'
              ? 'assessment-layout assessment-layout--compare'
              : 'assessment-layout'
          }
        >
          {(viewMode === '5G_NR'
            || viewMode === 'COMPARE') && (
            <AssessmentPanel
              assessment={assessment5g}
              expanded={defenseMode}
            />
          )}

          {(viewMode === 'IMT2030_EXPERIMENTAL'
            || viewMode === 'COMPARE') && (
            <AssessmentPanel
              assessment={assessmentImt2030}
              expanded={defenseMode}
            />
          )}
        </div>
      </section>

      <section className="interpretation-note" id="conclusion">
        <strong>Cómo interpretar el resultado</strong>
        <p>
          Que un perfil “pase” significa que satisface las
          reglas implementadas en esta herramienta. No
          equivale a una certificación integral de 3GPP.
          Para IMT-2030 se realiza una evaluación
          experimental y exploratoria.
        </p>
      </section>
    </div>
  );
}
