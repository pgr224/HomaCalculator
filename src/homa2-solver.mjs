/*
 * Dense Powell hybrid solver, translated from MINPACK/cminpack's hybrd,
 * dogleg, qrfac, qform, r1updt and r1mpyq routines (no pivoting, diag=1).
 * Source: https://github.com/devernay/cminpack/tree/master/src
 * This product includes software developed by the University of Chicago,
 * as Operator of Argonne National Laboratory.
 *
 * Minpack Copyright Notice (1999) University of Chicago.  All rights reserved
 * 
 * Redistribution and use in source and binary forms, with or
 * without modification, are permitted provided that the
 * following conditions are met:
 * 
 * 1. Redistributions of source code must retain the above
 * copyright notice, this list of conditions and the following
 * disclaimer.
 * 
 * 2. Redistributions in binary form must reproduce the above
 * copyright notice, this list of conditions and the following
 * disclaimer in the documentation and/or other materials
 * provided with the distribution.
 * 
 * 3. The end-user documentation included with the
 * redistribution, if any, must include the following
 * acknowledgment:
 * 
 *    "This product includes software developed by the
 *    University of Chicago, as Operator of Argonne National
 *    Laboratory.
 * 
 * Alternately, this acknowledgment may appear in the software
 * itself, if and wherever such third-party acknowledgments
 * normally appear.
 * 
 * 4. WARRANTY DISCLAIMER. THE SOFTWARE IS SUPPLIED "AS IS"
 * WITHOUT WARRANTY OF ANY KIND. THE COPYRIGHT HOLDER, THE
 * UNITED STATES, THE UNITED STATES DEPARTMENT OF ENERGY, AND
 * THEIR EMPLOYEES: (1) DISCLAIM ANY WARRANTIES, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO ANY IMPLIED WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE
 * OR NON-INFRINGEMENT, (2) DO NOT ASSUME ANY LEGAL LIABILITY
 * OR RESPONSIBILITY FOR THE ACCURACY, COMPLETENESS, OR
 * USEFULNESS OF THE SOFTWARE, (3) DO NOT REPRESENT THAT USE OF
 * THE SOFTWARE WOULD NOT INFRINGE PRIVATELY OWNED RIGHTS, (4)
 * DO NOT WARRANT THAT THE SOFTWARE WILL FUNCTION
 * UNINTERRUPTED, THAT IT IS ERROR-FREE OR THAT ANY ERRORS WILL
 * BE CORRECTED.
 * 
 * 5. LIMITATION OF LIABILITY. IN NO EVENT WILL THE COPYRIGHT
 * HOLDER, THE UNITED STATES, THE UNITED STATES DEPARTMENT OF
 * ENERGY, OR THEIR EMPLOYEES: BE LIABLE FOR ANY INDIRECT,
 * INCIDENTAL, CONSEQUENTIAL, SPECIAL OR PUNITIVE DAMAGES OF
 * ANY KIND OR NATURE, INCLUDING BUT NOT LIMITED TO LOSS OF
 * PROFITS OR LOSS OF DATA, FOR ANY REASON WHATSOEVER, WHETHER
 * SUCH LIABILITY IS ASSERTED ON THE BASIS OF CONTRACT, TORT
 * (INCLUDING NEGLIGENCE OR STRICT LIABILITY), OR OTHERWISE,
 * EVEN IF ANY OF SAID PARTIES HAS BEEN WARNED OF THE
 * POSSIBILITY OF SUCH LOSS OR DAMAGES.
 */
const EPS = Number.EPSILON;
const norm = a => {
  // MINPACK's ordinary-size branch preserves the original addition order.
  // Model residuals and iterates remain far from overflow/underflow here.
  let total = 0;
  for (const v of a) total += v * v;
  return Math.sqrt(total);
};

function qrFactor(a, n) {
  const rdiag = Array(n).fill(0);
  for (let j = 0; j < n; j++) {
    let ajnorm = norm(a.slice(j + j * n, n + j * n));
    if (ajnorm !== 0) {
      if (a[j + j * n] < 0) ajnorm = -ajnorm;
      for (let i = j; i < n; i++) a[i + j * n] /= ajnorm;
      a[j + j * n] += 1;
      for (let k = j + 1; k < n; k++) {
        let sum = 0;
        for (let i = j; i < n; i++) sum += a[i + j * n] * a[i + k * n];
        const temp = sum / a[j + j * n];
        for (let i = j; i < n; i++) a[i + k * n] -= temp * a[i + j * n];
      }
    }
    rdiag[j] = -ajnorm;
  }
  return rdiag;
}

function formQ(q, n) {
  const wa = Array(n).fill(0);
  for (let j = 1; j < n; j++) for (let i = 0; i < j; i++) q[i + j * n] = 0;
  for (let k = n - 1; k >= 0; k--) {
    for (let i = k; i < n; i++) {
      wa[i] = q[i + k * n];
      q[i + k * n] = 0;
    }
    q[k + k * n] = 1;
    if (wa[k] !== 0) {
      for (let j = k; j < n; j++) {
        let sum = 0;
        for (let i = k; i < n; i++) sum += q[i + j * n] * wa[i];
        const temp = sum / wa[k];
        for (let i = k; i < n; i++) q[i + j * n] -= temp * wa[i];
      }
    }
  }
}

function dogleg(r, qtb, delta, n) {
  const x = Array(n).fill(0), wa1 = Array(n).fill(0), wa2 = Array(n).fill(0);
  let jj = n * (n + 1) / 2;
  for (let k = 1; k <= n; k++) {
    const j = n - k;
    jj -= k;
    let l = jj + 1, sum = 0;
    for (let i = j + 1; i < n; i++) sum += r[l++] * x[i];
    let temp = r[jj];
    if (temp === 0) {
      l = j;
      for (let i = 0; i <= j; i++) {
        temp = Math.max(temp, Math.abs(r[l]));
        l += n - i - 1;
      }
      temp *= EPS;
      if (temp === 0) temp = EPS;
    }
    x[j] = (qtb[j] - sum) / temp;
  }
  const qnorm = norm(x);
  if (qnorm <= delta) return x;
  let l = 0;
  for (let j = 0; j < n; j++) {
    const temp = qtb[j];
    for (let i = j; i < n; i++) wa1[i] += r[l++] * temp;
  }
  const gnorm = norm(wa1);
  let sgnorm = 0, alpha = delta / qnorm;
  if (gnorm !== 0) {
    for (let j = 0; j < n; j++) wa1[j] /= gnorm;
    l = 0;
    for (let j = 0; j < n; j++) {
      let sum = 0;
      for (let i = j; i < n; i++) sum += r[l++] * wa1[i];
      wa2[j] = sum;
    }
    let temp = norm(wa2);
    sgnorm = temp === 0 ? delta : gnorm / temp / temp;
    alpha = 0;
    if (sgnorm < delta) {
      const bnorm = norm(qtb);
      temp = bnorm / gnorm * (bnorm / qnorm) * (sgnorm / delta);
      temp = temp - delta / qnorm * (sgnorm / delta) ** 2
        + Math.sqrt((temp - delta / qnorm) ** 2
          + (1 - (delta / qnorm) ** 2) * (1 - (sgnorm / delta) ** 2));
      alpha = delta / qnorm * (1 - (sgnorm / delta) ** 2) / temp;
    }
  }
  const temp = (1 - alpha) * Math.min(sgnorm, delta);
  for (let j = 0; j < n; j++) x[j] = temp * wa1[j] + alpha * x[j];
  return x;
}

function rankOneUpdate(s, u, v, w, n) {
  let jj = n * (n + 1) / 2 - 1;
  w[n - 1] = s[jj];
  for (let j = n - 2; j >= 0; j--) {
    jj -= n - j;
    w[j] = 0;
    if (v[j] !== 0) {
      let cos, sin, tau;
      if (Math.abs(v[n - 1]) < Math.abs(v[j])) {
        const cotan = v[n - 1] / v[j];
        sin = .5 / Math.sqrt(.25 + .25 * cotan * cotan);
        cos = sin * cotan;
        tau = Math.abs(cos) * Number.MAX_VALUE > 1 ? 1 / cos : 1;
      } else {
        const tan = v[j] / v[n - 1];
        cos = .5 / Math.sqrt(.25 + .25 * tan * tan);
        sin = cos * tan;
        tau = sin;
      }
      v[n - 1] = sin * v[j] + cos * v[n - 1];
      v[j] = tau;
      let l = jj;
      for (let i = j; i < n; i++) {
        const temp = cos * s[l] - sin * w[i];
        w[i] = sin * s[l] + cos * w[i];
        s[l++] = temp;
      }
    }
  }
  for (let i = 0; i < n; i++) w[i] += v[n - 1] * u[i];
  for (let j = 0; j < n - 1; j++) {
    if (w[j] !== 0) {
      let cos, sin, tau;
      if (Math.abs(s[jj]) < Math.abs(w[j])) {
        const cotan = s[jj] / w[j];
        sin = .5 / Math.sqrt(.25 + .25 * cotan * cotan);
        cos = sin * cotan;
        tau = Math.abs(cos) * Number.MAX_VALUE > 1 ? 1 / cos : 1;
      } else {
        const tan = w[j] / s[jj];
        cos = .5 / Math.sqrt(.25 + .25 * tan * tan);
        sin = cos * tan;
        tau = sin;
      }
      let l = jj;
      for (let i = j; i < n; i++) {
        const temp = cos * s[l] + sin * w[i];
        w[i] = -sin * s[l] + cos * w[i];
        s[l++] = temp;
      }
      w[j] = tau;
    }
    jj += n - j;
  }
  s[jj] = w[n - 1];
}

function multiplyQ(a, m, n, v, w) {
  for (let j = n - 2; j >= 0; j--) {
    let cos, sin;
    if (Math.abs(v[j]) > 1) {
      cos = 1 / v[j];
      sin = Math.sqrt(1 - cos * cos);
    } else {
      sin = v[j];
      cos = Math.sqrt(1 - sin * sin);
    }
    for (let i = 0; i < m; i++) {
      const temp = cos * a[i + j * m] - sin * a[i + (n - 1) * m];
      a[i + (n - 1) * m] = sin * a[i + j * m] + cos * a[i + (n - 1) * m];
      a[i + j * m] = temp;
    }
  }
  for (let j = 0; j < n - 1; j++) {
    let cos, sin;
    if (Math.abs(w[j]) > 1) {
      cos = 1 / w[j];
      sin = Math.sqrt(1 - cos * cos);
    } else {
      sin = w[j];
      cos = Math.sqrt(1 - sin * sin);
    }
    for (let i = 0; i < m; i++) {
      const temp = cos * a[i + j * m] + sin * a[i + (n - 1) * m];
      a[i + (n - 1) * m] = -sin * a[i + j * m] + cos * a[i + (n - 1) * m];
      a[i + j * m] = temp;
    }
  }
}

export function hybridRoot(fn, initial, { xtol = Math.sqrt(EPS), maxfev = 600, factor = 100 } = {}) {
  const x = [...initial], n = x.length, fjac = Array(n * n).fill(0);
  const qtf = Array(n).fill(0), r = Array(n * (n + 1) / 2).fill(0);
  let fvec = fn(x), nfev = 1, fnorm = norm(fvec);
  let iter = 1, ncsuc = 0, ncfail = 0, nslow1 = 0, nslow2 = 0;
  let delta = 0, xnorm = 0;
  const result = info => ({ x, fun: fvec, success: info === 1, info, nfev });
  for (;;) {
    let jeval = true;
    const eps = Math.sqrt(EPS);
    for (let j = 0; j < n; j++) {
      const temp = x[j], h = eps * Math.abs(temp) || eps;
      x[j] = temp + h;
      const work = fn(x);
      x[j] = temp;
      for (let i = 0; i < n; i++) fjac[i + j * n] = (work[i] - fvec[i]) / h;
    }
    nfev += n;
    const rdiag = qrFactor(fjac, n);
    if (iter === 1) {
      xnorm = norm(x);
      delta = factor * xnorm || factor;
    }
    for (let i = 0; i < n; i++) qtf[i] = fvec[i];
    for (let j = 0; j < n; j++) {
      if (fjac[j + j * n] !== 0) {
        let sum = 0;
        for (let i = j; i < n; i++) sum += fjac[i + j * n] * qtf[i];
        const temp = -sum / fjac[j + j * n];
        for (let i = j; i < n; i++) qtf[i] += fjac[i + j * n] * temp;
      }
    }
    for (let j = 0; j < n; j++) {
      let l = j;
      for (let i = 0; i < j; i++) {
        r[l] = fjac[i + j * n];
        l += n - i - 1;
      }
      r[l] = rdiag[j];
    }
    formQ(fjac, n);
    for (;;) {
      const wa1 = dogleg(r, qtf, delta, n).map(v => -v);
      const wa2 = x.map((v, j) => v + wa1[j]);
      const pnorm = norm(wa1);
      if (iter === 1) delta = Math.min(delta, pnorm);
      const wa4 = fn(wa2);
      nfev++;
      const fnorm1 = norm(wa4);
      const actred = fnorm1 < fnorm ? 1 - (fnorm1 / fnorm) ** 2 : -1;
      const wa3 = Array(n).fill(0);
      let l = 0;
      for (let i = 0; i < n; i++) {
        let sum = 0;
        for (let j = i; j < n; j++) sum += r[l++] * wa1[j];
        wa3[i] = qtf[i] + sum;
      }
      const temp = norm(wa3);
      const prered = temp < fnorm ? 1 - (temp / fnorm) ** 2 : 0;
      const ratio = prered > 0 ? actred / prered : 0;
      if (ratio < .1) {
        ncsuc = 0;
        ncfail++;
        delta *= .5;
      } else {
        ncfail = 0;
        ncsuc++;
        if (ratio >= .5 || ncsuc > 1) delta = Math.max(delta, pnorm / .5);
        if (Math.abs(ratio - 1) <= .1) delta = pnorm / .5;
      }
      if (ratio >= .0001) {
        for (let j = 0; j < n; j++) x[j] = wa2[j];
        fvec = [...wa4];
        xnorm = norm(x);
        fnorm = fnorm1;
        iter++;
      }
      nslow1++;
      if (actred >= .001) nslow1 = 0;
      if (jeval) nslow2++;
      if (actred >= .1) nslow2 = 0;
      if (delta <= xtol * xnorm || fnorm === 0) return result(1);
      let info = 0;
      if (nfev >= maxfev) info = 2;
      if (.1 * Math.max(.1 * delta, pnorm) <= EPS * xnorm) info = 3;
      if (nslow2 === 5) info = 4;
      if (nslow1 === 10) info = 5;
      if (info) return result(info);
      if (ncfail === 2) break;
      for (let j = 0; j < n; j++) {
        let sum = 0;
        for (let i = 0; i < n; i++) sum += fjac[i + j * n] * wa4[i];
        wa2[j] = (sum - wa3[j]) / pnorm;
        wa1[j] /= pnorm;
        if (ratio >= .0001) qtf[j] = sum;
      }
      rankOneUpdate(r, wa1, wa2, wa3, n);
      multiplyQ(fjac, n, n, wa2, wa3);
      multiplyQ(qtf, 1, n, wa2, wa3);
      jeval = false;
    }
  }
}
