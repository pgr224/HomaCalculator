import { calculateHoma2 } from './homa2.mjs';

export const GLUCOSE_FACTOR = 18;
export const CPEPTIDE_FACTOR = 0.331;
export function positive(value, label = 'Value') {
  if (!['string', 'number'].includes(typeof value) || String(value).trim() === '' || !Number.isFinite(Number(value)) || Number(value) <= 0) throw new Error(`${label} must be a number greater than zero.`);
  return Number(value);
}
function unitFactor(unit, factors) {
  if (!Object.hasOwn(factors, unit)) throw new Error('Select a supported unit.');
  return factors[unit];
}
function checked(value) {
  if (!Number.isFinite(value) || value <= 0) throw new Error('These inputs are outside the supported numerical range.');
  return value;
}
export function glucoseMg(value, unit = 'mg') { return checked(positive(value, 'Glucose') * unitFactor(unit, {mg: 1, mmol: GLUCOSE_FACTOR})); }
export function insulinU(value, unit = 'u', factor = 6) { return checked(positive(value, 'Insulin') / unitFactor(unit, {u: 1, pmol: positive(factor, 'Conversion factor')})); }
export function lengthCm(value, unit = 'cm') { return checked(positive(value, 'Length') * unitFactor(unit, {cm: 1, inch: 2.54})); }
export function weightKg(value, unit = 'kg') { return checked(positive(value, 'Weight') * unitFactor(unit, {kg: 1, lb: 0.45359237})); }
export function bmi(weight, heightCm) { return checked(positive(weight, 'Weight') / (positive(heightCm, 'Height') / 100) ** 2); }
export function waistHeightRatio(waistCm, heightCm) { return checked(positive(waistCm, 'Waist') / positive(heightCm, 'Height')); }
export function homa1(glucose, insulin) {
  // HOMA1-IR approximation: glucose in mg/dL and insulin in µIU/mL.
  return checked(positive(glucose, 'Glucose') * positive(insulin, 'Insulin') / 405);
}
export function homa(glucose, insulin, factor = 6.95, insulinUnit = 'u') {
  // Default to mg/dL and µIU/mL; accept pmol/L directly to avoid conversion round trips.
  const gRaw = positive(glucose, 'Glucose') / GLUCOSE_FACTOR;
  if (gRaw < 3 || gRaw > 25) calculateHoma2(gRaw, 20);
  const g = Math.round(gRaw * 10) / 10;
  const conversion = unitFactor(insulinUnit, {u: positive(factor, 'Conversion factor'), pmol: 1});
  const i = Math.round(positive(insulin, 'Insulin') * conversion * 1000) / 1000;
  return calculateHoma2(g, i);
}
export function quicki(glucose, insulin) {
  const denominator = Math.log10(positive(glucose, 'Glucose')) + Math.log10(positive(insulin, 'Insulin'));
  if (denominator <= 0) throw new Error('These inputs are outside the useful QUICKI calculation range. Check the values and units.');
  return 1 / denominator;
}
export function tyg(glucose, triglycerides) { return Math.log(checked(positive(glucose, 'Glucose') * positive(triglycerides, 'Triglycerides') / 2)); }
export function a1cToEag(a1c) { const a = positive(a1c, 'HbA1c'); if (a < 4 || a > 15) throw new Error('Use HbA1c between 4% and 15% for this educational estimate.'); return 28.7 * a - 46.7; }
export function eagToA1c(glucose) { const a = (positive(glucose, 'Average glucose') + 46.7) / 28.7; a1cToEag(a); return a; }
export function a1cToIfcc(a1c) { const result = (positive(a1c, 'HbA1c') - 2.152) / 0.09148; if (result <= 0) throw new Error('HbA1c must be greater than 2.152% for this unit conversion.'); return result; }
export function ifccToA1c(value) { return positive(value, 'HbA1c') * 0.09148 + 2.152; }
