import { describe, expect, it } from 'vitest';

import { calculateLinkBudget } from '../../src/core/radio';

import {
  evaluate5gNr,
  evaluateImt2030,
} from '../../src/core/assessment/evaluate';

import {
  getReferenceScenario,
} from '../../src/core/scenarios/reference-scenarios';

describe('Phase 3 assessment profiles', () => {
  it('passes the implemented 5G n78 profile for the reference scenario', () => {
    const reference =
      getReferenceScenario('N78_REFERENCE');

    const results = calculateLinkBudget(
      reference.scenario.radio,
    );

    const assessment = evaluate5gNr(
      reference.scenario,
      results,
    );

    expect(assessment.aggregateStatus).toBe('PASS');
    expect(assessment.blockers).toHaveLength(0);
  });

  it('fails radio viability when only distance is degraded', () => {
    const degraded =
      getReferenceScenario(
        'N78_DISTANCE_DEGRADED',
      );

    const results = calculateLinkBudget(
      degraded.scenario.radio,
    );

    const assessment = evaluate5gNr(
      degraded.scenario,
      results,
    );

    expect(assessment.aggregateStatus).toBe('FAIL');

    expect(
      assessment.blockers.some(
        (item) => item.id === 'radio-link-margin',
      ),
    ).toBe(true);

    expect(results.linkMarginDb).toBeLessThan(0);
  });

  it('fails n78 compatibility even when RF remains favorable outside the band', () => {
    const outOfBand =
      getReferenceScenario('N78_OUT_OF_BAND');

    const results = calculateLinkBudget(
      outOfBand.scenario.radio,
    );

    const assessment = evaluate5gNr(
      outOfBand.scenario,
      results,
    );

    const frequencyRule =
      assessment.criteria.find(
        (item) => item.id === 'n78-frequency',
      );

    expect(frequencyRule?.status).toBe('FAIL');
    expect(results.linkMarginDb).toBeGreaterThan(0);
    expect(assessment.aggregateStatus).toBe('FAIL');
  });

  it('does not claim final IMT-2030 compliance for a favorable scenario', () => {
    const reference =
      getReferenceScenario('N78_REFERENCE');

    const results = calculateLinkBudget(
      reference.scenario.radio,
    );

    const assessment = evaluateImt2030(
      reference.scenario,
      results,
    );

    expect(
      assessment.aggregateStatus,
    ).toBe('NOT_EVALUABLE');

    const capacityRule =
      assessment.criteria.find(
        (item) =>
          item.id ===
          'imt2030-capacity-screening',
      );

    expect(capacityRule?.status).toBe('CONDITIONAL');
  });

  it('fails the experimental IMT-2030 capacity screening when Shannon itself is below 300 Mbit/s', () => {
    const degraded =
      getReferenceScenario(
        'N78_DISTANCE_DEGRADED',
      );

    const results = calculateLinkBudget(
      degraded.scenario.radio,
    );

    const assessment = evaluateImt2030(
      degraded.scenario,
      results,
    );

    const capacityRule =
      assessment.criteria.find(
        (item) =>
          item.id ===
          'imt2030-capacity-screening',
      );

    expect(capacityRule?.status).toBe('FAIL');
    expect(assessment.aggregateStatus).toBe('FAIL');
  });
});
