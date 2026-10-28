import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { calculateHoma2 } from '../src/homa2.mjs';
import { homa } from '../src/calculations.mjs';

// Expected columns: glucose mmol/L, total insulin pmol/L, %B, %S.
// Extracted from HOMA2Calculator Validation.xls in the supplied v2.2.3 installer.
// Workbook SHA-256: 23f499b333056e02b7320676977e1ba3715727cdf22c88293b5f9ea57b6adf77.
const reference = JSON.parse(await readFile(new URL('./fixtures/homa2-insulin.json', import.meta.url), 'utf8'));

test('HOMA2 matches all 441 official total-insulin workbook examples', () => {
  assert.equal(reference.length, 441);
  for (const [g, i, beta, sensitivity] of reference) {
    const actual = calculateHoma2(g, i);
    assert.deepEqual(actual, { beta, sensitivity, ir: 100 / sensitivity }, `glucose ${g}, insulin ${i}`);
  }
});

test('each selectable conversion factor preserves all official HOMA2 reference results', () => {
  for (const factor of [6, 6.945, 6.95]) {
    for (const [g, i, beta, sensitivity] of reference) {
      assert.deepEqual(homa(g * 18, i / factor, factor), { beta, sensitivity, ir: 100 / sensitivity },
        `factor ${factor}, glucose ${g}, insulin ${i}`);
    }
  }
});

test('selecting an insulin factor changes all three outputs for the same conventional inputs', () => {
  const expected = [
    [6, 334.3, 32.7],
    [6.945, 368.4, 28.5],
    [6.95, 368.5, 28.4]
  ];
  for (const [factor, beta, sensitivity] of expected) {
    assert.deepEqual(homa(72, 30, factor), { beta, sensitivity, ir: 100 / sensitivity });
  }
  assert.deepEqual(homa(72, 30), homa(72, 30, 6.95));
});

test('pmol/L inputs stay independent of the factor at insulin rounding boundaries', () => {
  for (const factor of [6, 6.945, 6.95]) {
    assert.deepEqual(homa(90, 24.0085, factor, 'pmol'), calculateHoma2(5, 24.009));
  }
});

test('HOMA2 uses rounded sensitivity to calculate resistance', () => {
  assert.deepEqual(calculateHoma2(4.9, 53.8), { beta: 99.5, sensitivity: 99.9, ir: 100 / 99.9 });
  assert.deepEqual(calculateHoma2(25, 400), { beta: 46.4, sensitivity: 0.3, ir: 100 / 0.3 });
});

test('HOMA2 input ranges include both endpoints and reject extrapolation', () => {
  for (const factor of [6, 6.945, 6.95]) for (const g of [3, 25]) for (const i of [20, 400]) {
    const expected = calculateHoma2(g, i);
    assert.deepEqual(homa(g * 18, i / factor, factor), expected);
  }
  for (const [g, i] of [[2.999, 20], [25.001, 20], [5, 19.999], [5, 400.001], [NaN, 69], [5, Infinity], ['5', 69]]) {
    assert.throws(() => calculateHoma2(g, i), /HOMA2 requires/);
  }
});
