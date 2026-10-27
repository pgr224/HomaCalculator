// Total-insulin HOMA2 model recovered from HOMACore 2.2.3.
// DLL SHA-256: f95c717bba02da5bde1e8e16b7192d71ef664850311be2b7c3ed4c2c66c5cfa1.
// Equations and nested searches follow pgr224/HomaIR-Project model.py.
import { tables } from './homa2-tables.mjs';
import { hybridRoot } from './homa2-solver.mjs';

const N = 3.1550497;
const C1 = 10839.016269269705;
const C2 = 143890.97450136047;

// The original engine rounds exact half-way cases down, after scaling.
function round1(value) {
  const scaled = value * 10, low = Math.floor(scaled), high = Math.ceil(scaled);
  return (Math.abs(scaled - high) < Math.abs(scaled - low) ? high : low) / 10;
}

function renalLoss(g) {
  if (g < 9.2) return 0;
  if (g >= 30) return 0.5595 + (g - 29.8) / 0.2 * (0.5665 - 0.5595);
  const gs = tables.renal_glucose, ys = tables.renal_loss;
  let j = 1;
  while (j < gs.length - 1 && gs[j] <= g) j++;
  const w = (g - gs[j - 1]) / (gs[j] - gs[j - 1]);
  return ys[j - 1] * (1 - w) + ys[j] * w;
}

function secretion(g, b) {
  const x = (g * b ** 0.25) ** N;
  return 1254.639 * x / (10 ** N + x) * b ** 0.75;
}

function insulinState(g, b) {
  const q = secretion(g, b);
  const fraction = Math.max(0, 0.000933155 * g + 0.0037681);
  const p = fraction / (1 - fraction) * q / (4.18 * (Math.log(2) / 20));
  const r = p * 1.92e-6 / (p * 1.92e-6 + 0.0095);
  const k = 6718.75 / (1 - r), a = C1 * 5.5, t0 = C2 * 0.33;
  const z = (k * 2.4749999999999996 + a * 0.098) * q;
  const c = (((C2 * 0.03234 - q) + k * 0.825) * k * 0.15
    + ((a * 0.825 * k + (k * 0.825 + a * 0.098) * t0) * 0.098 - z)) * k;
  const bb = (k * 2.6249999999999996 + ((t0 + a) * 0.196 - q * 2)) * k * 0.15
    + ((k * 1.65 + C1 * 0.539) * 0.098 * (t0 + a) - z);
  const aa = ((t0 + a) * 0.098 - q) * 0.825
    + (k * 2.7749999999999995 + ((C1 * 11 + t0) * 0.098 - q)) * 0.15;
  let x = q * q, converged = false;
  for (let iteration = 0; iteration < 100; iteration++) {
    const delta = (0.14625 * x ** 4 + aa * x ** 3 + bb * x * x + c * x - q * 0.825 * k ** 3)
      / (0.585 * x ** 3 + 3 * aa * x * x + 2 * bb * x + c);
    if (Math.abs(delta) < 7.2e-5) { converged = true; break; }
    x -= delta;
  }
  if (!converged) throw new Error('HOMA2 insulin balance did not converge.');
  const h = x * C1 / (x + k);
  const y = (h * 0.539 + x * 0.02727272727272727 * 5.5) / 0.825 + x;
  const t = C2 * y / (y + k);
  return { x, p, h, t, r };
}

function glucoseBalance(g, s, { h, t, r }) {
  const zh = (t + (C2 - t) * r) * 0.040766494 * s;
  const zm = (h + (C1 - h) * r) * 0.536720754 * s;
  const production = (1 - Math.tanh(0.0029573405646865863 * zh)) * 2.1536014
    * (1 - 0.885 * 4.85 / (4.85 + 8.899073383983891));
  const uptake = 19.171071 * 4.85 * ((zm / (251.96889168 + zm)) ** 2 + 0.0272484)
    / (4.85 + 7.7866865);
  return production - uptake - 0.5 * Math.tanh(0.4045365 * g)
    - 0.5 * g / (g + 7.786689210985906) - renalLoss(g);
}

function forward(beta, sensitivity) {
  const b = Math.max(0, beta) || 1e-100, s = Math.max(0, sensitivity);
  function evaluate(g) {
    const state = insulinState(g, b);
    return [glucoseBalance(g, s, state), state.x + state.p];
  }
  for (const bisect of [false, true]) {
    let lo = 0, hi = 80;
    let [fl] = evaluate(lo), [fh] = evaluate(hi);
    if (fl < 0 || fh > 0) throw new Error('HOMA2 glucose balance is not bracketed.');
    let g = bisect ? (lo + hi) / 2 : (fh * lo - fl * hi) / (fh - fl);
    for (let iteration = 0; iteration < 250; iteration++) {
      const [f, i] = evaluate(g);
      if (Math.abs(f) < 5e-5) return [g, i];
      if (f >= 0) { lo = g; fl = f; } else { hi = g; fh = f; }
      g = bisect ? (lo + hi) / 2 : (fh * lo - fl * hi) / (fh - fl);
    }
  }
  throw new Error('HOMA2 glucose search did not converge.');
}

function initialEstimate(g, i) {
  const gx = (g - 3) / (22 / 40), ix = (i - 20) / (380 / 40);
  const gj = Math.max(0, Math.min(40, Math.trunc(gx)));
  const ij = Math.max(0, Math.min(40, Math.trunc(ix)));
  const gu = Math.min(40, gj + 1), iu = Math.min(40, ij + 1);
  const u = gx - gj, v = ix - ij;
  const interpolate = table => ((1 - u) * (1 - v) * table[ij * 41 + gj]
    + u * (1 - v) * table[ij * 41 + gu]
    + (1 - u) * v * table[iu * 41 + gj] + u * v * table[iu * 41 + gu]) / 1000;
  return [interpolate(tables.initial_b), interpolate(tables.initial_s)];
}

export function calculateHoma2(g, i) {
  if (!Number.isFinite(g) || g < 3 || g > 25)
    throw new Error('HOMA2 requires glucose from 54 to 450 mg/dL (3–25 mmol/L).');
  if (!Number.isFinite(i) || i < 20 || i > 400)
    throw new Error('HOMA2 requires insulin from 20 to 400 pmol/L (20/6.95–400/6.95 µIU/mL).');
  let gs = g, is = i;
  const gr = round1(g), ir = round1(i);
  // The original engine perturbs starting estimates in these solver regions.
  if ((gr === 23.6 && ir > 74.5 && ir <= 75.2) || (gr === 23.7 && ir > 70.6 && ir <= 71.5)) {
    gs -= 0.3; is -= 0.3;
  } else if ((gr > 23.2 && gr <= 24.3) || (gr === 6.3 && ir === 283.8)) {
    gs += 0.3; is += 0.3;
  }
  const initial = initialEstimate(gs, is);
  const xtol = Math.min(Math.sqrt(2.22044604926e-16), 1e-4 / (2 * Math.max(...initial)));
  const residual = ([b, s]) => {
    const [gg, ii] = forward(b, s);
    return [gg - g, ii - i];
  };
  const solved = hybridRoot(residual, initial, { xtol, maxfev: 600, factor: 100 });
  if (!solved.success || solved.fun.some(x => !Number.isFinite(x) || Math.abs(x) > 0.05)
      || solved.x.some(x => !Number.isFinite(x) || x <= 0))
    throw new Error('HOMA2 inverse calculation did not converge for these inputs.');
  const beta = round1(100 * solved.x[0]);
  const sensitivity = round1(100 * solved.x[1]);
  if (beta <= 0 || sensitivity <= 0) throw new Error('HOMA2 result is outside the supported numerical range.');
  return { beta, sensitivity, ir: 100 / sensitivity };
}
