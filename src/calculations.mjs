export const GLUCOSE_FACTOR = 18;
export const CPEPTIDE_FACTOR = 0.331;
export function positive(value, label = 'Value') {
  if (value === '' || value === null || value === undefined || !Number.isFinite(Number(value)) || Number(value) <= 0) throw new Error(`${label} must be a number greater than zero.`);
  return Number(value);
}
export function glucoseMg(value, unit = 'mg') { return positive(value, 'Glucose') * (unit === 'mmol' ? GLUCOSE_FACTOR : 1); }
export function insulinU(value, unit = 'u', factor = 6.945) { return positive(value, 'Insulin') / (unit === 'pmol' ? positive(factor, 'Conversion factor') : 1); }
export function homa(glucose, insulin) {
  const g = positive(glucose, 'Glucose'), i = positive(insulin, 'Insulin');
  const ir = g * i / 405;
  return { ir, beta: g > 63 ? 360 * i / (g - 63) : null, sensitivity: 100 / ir };
}
export function quicki(glucose, insulin) {
  const denominator = Math.log10(positive(glucose, 'Glucose')) + Math.log10(positive(insulin, 'Insulin'));
  if (denominator <= 0) throw new Error('These inputs are outside the useful QUICKI calculation range. Check the values and units.');
  return 1 / denominator;
}
export function tyg(glucose, triglycerides) { return Math.log(positive(glucose, 'Glucose') * positive(triglycerides, 'Triglycerides') / 2); }
export function a1cToEag(a1c) { const a = positive(a1c, 'HbA1c'); if (a < 4 || a > 15) throw new Error('Use HbA1c between 4% and 15% for this educational estimate.'); return 28.7 * a - 46.7; }
export function eagToA1c(glucose) { const a = (positive(glucose, 'Average glucose') + 46.7) / 28.7; a1cToEag(a); return a; }
export function a1cToIfcc(a1c) { const result = (positive(a1c, 'HbA1c') - 2.152) / 0.09148; if (result <= 0) throw new Error('HbA1c must be greater than 2.152% for this unit conversion.'); return result; }
export function ifccToA1c(value) { return positive(value, 'HbA1c') * 0.09148 + 2.152; }
