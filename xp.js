/* Ile XP za podpunkt — według liczby kroków, czasu, pomysłowości i poziomu (2–20, typowo 10).
   Klucz: numer zadania; wartość: liczba albo { rodzaj (gk) / typ podpunktu / '*': liczba }.
   Zadania wieloczęściowe dzielą tę pulę równo na części. */
(function (G) {
  'use strict';
  const XP = {
    // Algebra liniowa — Lista 1
    '1.1': { sqrt2: 10, cbrt: 14, nest: 8, choice: 6 }, '1.2': 18, '1.3': 16, '1.4': 6,
    '1.5': { choice: 8, inv: 10, cinv: 14 }, '1.6': 8, '1.7': { set: 8, '*': 10 },
    '1.8': { row: 6, ops: 8, inv: 8, expr: 12 }, '1.9': 18, '1.10': { mul: 4, inv: 8, guided: 12, '*': 8 },
    // Lista 2
    '2.1': { prod: 4, cube: 8, quot: 8, powq: 10, mixed: 10, unit: 6 }, '2.2': { pow: 8, guided: 12 },
    '2.3': { lin: 10, conj: 12, big: 16 }, '2.4': { pair: 10, pairP: 12, pairF: 12 }, '2.5': { sys: 14, sing: 9 },
    '2.6': { abs1: 10, abs2: 12, sq: 10, quad: 12, biq: 16, quadLead: 14 },
    '2.7': { guided: 12, num: 8 }, '2.8': { guided: 14, num: 8 }, '2.9': { guided: 12, sumsq: 10 },
    '2.10': 10, '2.11': { todeg: 14, torad: 12 }, '2.12': 6, '2.13': { sin: 10, cos: 10, tg: 12, dbl: 12, half: 14 }, '2.14': 12, '2.15': 10,
    // Lista 3
    '3.1': { polar: 8, polarS: 14, polarA: 12, polarQ: 12 }, '3.2': { pow: 10, qpow: 12, quot: 12, sum: 14 },
    '3.3': { '3α': 14, '4α': 16, '5α': 18 }, '3.4': { guided: 16, cos: 12, sin: 12 },
    '3.5': { sq: 10, rpolar: 12, pow: 14, frac: 14, powfrac: 16 }, '3.6': { q3: 16, lin3: 18 },
    '3.7': { choice: 8, w: 12, wk: 14 }, '3.8': { eq: 16, eqc: 18 }, '3.9': { p0: 6, p1: 10, p2: 10 },
    '3.10': { sum1: 4, prod1: 6, sum2: 6, prod2: 6, summ: 10, prodm: 10 }, '3.11': { guided: 14, '*': 10 }, '3.12': { csum: 14, cprod: 16 },
    // Proseminarium — Lista 1
    'P1.1': 6, 'P1.2': { w1: 6, w2: 4, w3: 2, w4: 4, w5: 6, max: 2 }, 'P1.3': 6, 'P1.4': 8, 'P1.5': 10, 'P1.6': 12, 'P1.7': 8,
    'P1.8': 6, 'P1.9': 8, 'P1.10': 6, 'P1.11': 8, 'P1.12': 4, 'P1.13': 6, 'P1.14': 8, 'P1.15': 8, 'P1.16': 10, 'P1.17': 14,
    'P1.18': 10, 'P1.19': 12, 'P1.20': 12, 'P1.21': 10, 'P1.22': 14, 'P1.23': { val: 16, diff: 4 }, 'P1.24': 14, 'P1.25': 18, 'P1.26': 16,
    // Lista 2
    'P2.1': 4, 'P2.2': 6, 'P2.3': { simp: 6, val: 4 }, 'P2.4': 8, 'P2.5': 12, 'P2.6': 14, 'P2.7': 10, 'P2.8': 10, 'P2.9': 14,
    'P2.10': 4, 'P2.11': 4, 'P2.12': 6, 'P2.13': 12, 'P2.14': 6, 'P2.15': 14, 'P2.16': 10, 'P2.17': 12, 'P2.18': 10,
    'P2.19': 16, 'P2.20': 10, 'P2.21': 16, 'P2.22': 12, 'P2.23': 14, 'P2.24': 14,
    // Lista 3
    'P3.1': { todeg: 16, torad: 12 }, 'P3.2': 12, 'P3.3': 6, 'P3.4': { a: 8, b: 10, c: 12 }, 'P3.5': 18, 'P3.6': { a: 8, b: 12 },
    'P3.7': 10,
    // ETL — Lista 1
    'E1.1': { cube: 10, quint: 12, kontr: 4 }, 'E1.2': { f1: 8, f2: 10, f3: 12 }, 'E1.3': { poly: 10, prod: 12 }, 'E1.4': 8, 'E1.5': 8, 'E1.6': 8,
    'E1.7': 10, 'E1.8': 10, 'E1.9': 8, 'E1.10': 14, 'P3.8': { sin: 10, cos: 10, tg: 12, dbl: 12, half: 14 }, 'P3.9': { sin: 8, cos: 8, tg: 12 }, 'P3.10': 10, 'P3.11': 8,
  };
  // pula XP za podpunkt (oryginał, pierwsze podejście)
  G.AQ.baseXP = function (task, item) {
    const e = XP[task && task.id];
    const guided = item && (item.type === 'guided' || item.type === 'order');
    let v = typeof e === 'number' ? e : e ? ((guided ? e.guided : undefined) ?? e[item && item.gk] ?? e[item && (item.type || 'fields')] ?? e['*']) : undefined;
    if (v == null) v = 10;
    return Math.max(2, Math.min(20, v));
  };
  G.AQ.XPTABLE = XP;
})(typeof window !== 'undefined' ? window : globalThis);
