/* Proseminarium — Lista 3: Trygonometria */
(function () {
  'use strict';
  const A = AQ, R = A.R, T = String.raw;
  const { Q, qadd, qmul, qdiv, qt, qs, mk, fill, txtField, W, norm } = A.PRO;
  const ALG = id => A.lists.find(l => l.id === 'l2').tasks.find(t => t.id === id);
  const cloneIt = (it, over) => { const c = Object.assign({}, it, { fields: it.fields ? it.fields.map(f => Object.assign({}, f)) : it.fields }, over || {}); delete c._mc; return c; };

  /* ---------- liczby postaci  p/q·√d  (d ∈ {1,2,3,6}) i ich sumy ---------- */
  const sqf = n => { let o = 1, i = n; for (let k = 2; k * k <= i; k++) while (i % (k * k) === 0) { i /= k * k; o *= k; } return [o, i]; };
  const term = (p, q, d = 1) => { const [o, i] = sqf(d); return { c: Q(p * o, q), d: i }; };
  const tmul = (a, b) => { const [o, i] = sqf(a.d * b.d); return { c: qmul(qmul(a.c, b.c), Q(o)), d: i }; };
  const tdiv = (a, b) => tmul(a, { c: qdiv(Q(1), qmul(b.c, Q(b.d))), d: b.d }); // 1/(c√d) = √d/(c·d)
  const tneg = a => ({ c: [-a.c[0], a.c[1]], d: a.d });
  // suma: mapa d -> współczynnik
  const S = (...ts) => { const m = {}; for (const t of ts) { if (!t || t.c[0] === 0) continue; m[t.d] = m[t.d] ? qadd(m[t.d], t.c) : t.c; } return m; };
  function stex(m) {
    const ks = Object.keys(m).map(Number).filter(d => m[d][0] !== 0).sort((a, b) => a - b);
    if (!ks.length) return '0';
    return ks.map((d, i) => { const [p, q] = m[d], ap = Math.abs(p), sg = p < 0 ? '-' : i ? '+' : '';
      const num = d === 1 ? String(ap) : (ap === 1 ? '' : ap) + '\\sqrt{' + d + '}';
      return sg + (q === 1 ? num : '\\frac{' + num + '}{' + q + '}'); }).join('');
  }
  function sstr(m) {
    const ks = Object.keys(m).map(Number).filter(d => m[d][0] !== 0);
    if (!ks.length) return '0';
    return ks.map(d => '(' + m[d][0] + '/' + m[d][1] + ')' + (d === 1 ? '' : '*sqrt(' + d + ')')).join('+');
  }
  const tt = t => stex(S(t));

  /* ---------- wartości dla kątów w stopniach ---------- */
  const BASE = { 0: [term(0, 1), term(1, 1)], 30: [term(1, 2), term(1, 2, 3)], 45: [term(1, 2, 2), term(1, 2, 2)], 60: [term(1, 2, 3), term(1, 2)], 90: [term(1, 1), term(0, 1)] };
  const nd = x => ((x % 360) + 360) % 360;
  function sc(deg) { // [sin, cos] dla kąta o kącie odniesienia z tabelki
    const a = nd(deg); const quad = Math.floor(a / 90), r = a % 90;
    let ref, ss, cs;
    if (a <= 90) { ref = a; ss = 1; cs = 1; } else if (a <= 180) { ref = 180 - a; ss = 1; cs = -1; } else if (a <= 270) { ref = a - 180; ss = -1; cs = -1; } else { ref = 360 - a; ss = -1; cs = 1; }
    const b = BASE[ref]; if (!b) return null;
    void quad; void r;
    return [ss > 0 ? b[0] : tneg(b[0]), cs > 0 ? b[1] : tneg(b[1]), ref];
  }
  function fval(fn, deg) {
    const v = sc(deg); if (!v) return null; const [s, c] = v;
    if (fn === 'sin') return s; if (fn === 'cos') return c;
    if (fn === 'tg') return c.c[0] === 0 ? null : tdiv(s, c);
    return s.c[0] === 0 ? null : tdiv(c, s);
  }
  const FN = { sin: '\\sin', cos: '\\cos', tg: '\\operatorname{tg}', ctg: '\\operatorname{ctg}' };
  const quadName = a => (a < 90 ? 'I' : a < 180 ? 'II' : a < 270 ? 'III' : 'IV');
  // linijka redukcji: sin 1200° = sin 120° = sin(180°−60°) = sin 60° = √3/2
  function redLine(fn, deg) {
    const per = fn === 'tg' || fn === 'ctg' ? 180 : 360;
    let parts = [T`${FN[fn]}(${deg}^\circ)`.replace(/\((\d+)\^\\circ\)/, ' $1^\\circ')];
    let a = deg, why = [];
    if (deg < 0 && (fn === 'cos')) { a = -deg; parts.push(T`${FN[fn]}${a}^\circ`); why.push('cosinus jest parzysty'); }
    else if (deg < 0) { a = -deg; parts.push(T`-${FN[fn]}${a}^\circ`); why.push(`${fn === 'sin' ? 'sinus' : fn === 'tg' ? 'tangens' : 'cotangens'} jest nieparzysty`); }
    const neg = deg < 0 && fn !== 'cos';
    const k = Math.floor(a / per); if (k > 0) { a -= k * per; parts.push(T`${neg ? '-' : ''}${FN[fn]}${a}^\circ`); why.push(`okres $${per}^\\circ$`); }
    const v = fval(fn, deg);
    if (v && !BASE[a] && a !== 180 && a !== 270) {
      const ref = a < 90 ? a : a < 180 ? 180 - a : a < 270 ? a - 180 : 360 - a;
      const sgn = (neg ? -1 : 1) * Math.sign(v.c[0]) * (neg ? -1 : 1);
      parts.push(T`${sgn < 0 ? '-' : ''}${FN[fn]}${ref}^\circ`);
      why.push(`$${a}^\\circ$ leży w ${quadName(a)} ćwiartce, kąt odniesienia $${ref}^\\circ$`);
    }
    parts.push(v ? stex(S(v)) : T`\text{nie istnieje}`);
    return { tex: parts.join('='), why, v, red: a };
  }

  /* ---------- 3.4 ---------- */
  const T4 = {
    a: () => { // sin(A) + cos(B)
      const A1 = R.pick([30, 45, 60, 120, 135, 150, 210, 225, 240, 300, 315, 330]) + 360 * R.int(1, 4), B1 = -(R.pick([0, 60, 120, 180, 240, 300, 45, 135]) + 360 * R.int(1, 3));
      return { q: T`\sin${A1}^\circ+\cos(${B1}^\circ)`, f: [['sin', A1], ['cos', B1]], op: 'sum' };
    },
    b: () => ({ k: R.int(2, 5), f: [['cos', -R.pick([300, 240, 60, 120, 420])], ['sin', R.pick([120, 150, 210, 240, 300, 60])], ['tg', R.pick([135, 45, 225, 315, 120, 240])]], op: 'prodq' }),
    c: () => ({ k: R.pick([2, 4, 6, 10, 12]), f: [['ctg', R.pick([315, 135, 225, 45, 150, 330])], ['sin', -R.pick([150, 30, 210, 330, 120])], ['cos', R.pick([225, 135, 45, 315, 210, 150])]], op: 'quot2' }),
  };
  function e34(gk, spec) {
    const s = spec || T4[gk]();
    const lines = s.f.map(([fn, d]) => redLine(fn, d));
    if (lines.some(l => !l.v)) return e34(gk);
    const vals = lines.map(l => l.v);
    const fx = (fn, d) => T`${FN[fn]}${d < 0 ? '(' + d + '^\\circ)' : d + '^\\circ'}`;
    let q, res, wrongs = [];
    const compute = vs => s.op === 'sum' ? S(vs[0], vs[1]) : s.op === 'prodq' ? S(tdiv(tmul(tmul(term(s.k, 1), vs[0]), vs[1]), vs[2])) : S(tdiv(tmul(term(s.k, 1), vs[0]), tmul(vs[1], vs[2])));
    if (s.op === 'sum') q = T`$${fx(...s.f[0])}+${fx(...s.f[1])}$`;
    else if (s.op === 'prodq') q = T`$$\frac{${s.k}${fx(...s.f[0])}\,${fx(...s.f[1])}}{${fx(...s.f[2])}}$$`;
    else q = T`$$\frac{${s.k}${fx(...s.f[0])}}{${fx(...s.f[1])}\,${fx(...s.f[2])}}$$`;
    res = compute(vals);
    vals.forEach((v, i) => { const w = vals.slice(); w[i] = tneg(v); wrongs.push([stex(compute(w)), T`Zły znak $${fx(...s.f[i])}$: ${s.f[i][1] < 0 && s.f[i][0] !== 'cos' ? 'funkcja nieparzysta zmienia znak dla kąta ujemnego, a potem liczy się ćwiartka' : 'sprawdź ćwiartkę kąta po redukcji okresu'}.`]); });
    const steps = [...lines.map((l, i) => T`$${l.tex}$${l.why.length ? ' (' + l.why.join(', ') + ')' : ''}.`), T`Podstawiamy: wynik $=${stex(res)}$.`];
    const CO2 = { sin: 'cos', cos: 'sin', tg: 'ctg', ctg: 'tg' };
    s.f.forEach(([fn, d], i) => { const cv = fval(CO2[fn], d); if (!cv) return; const w = vals.slice(); w[i] = cv; try { wrongs.push([stex(compute(w)), T`Pomylone $${FN[fn]}$ z $${FN[CO2[fn]]}$ przy kącie $${d}^\circ$.`]); } catch (e) { /* dzielenie przez zero */ } });
    wrongs.push([stex(compute(vals.map(tneg))), 'Wszystkie znaki odwrócone — sprawdź ćwiartki.']);
    const scale = (m, k) => { const o = {}; for (const d in m) o[d] = qmul(m[d], k); return o; };
    wrongs.push([stex(scale(res, Q(2))), 'Błąd przy ułamkach: dzielenie przez $\\frac12$ to mnożenie przez $2$ — sprawdź, gdzie stoi ułamek.'], [stex(scale(res, Q(1, 2))), 'Błąd przy ułamkach — sprawdź, czy $\\frac12$ jest w liczniku, czy w mianowniku.']);
    { const flat = {}; for (const d in res) flat[1] = flat[1] ? qadd(flat[1], res[d]) : res[d]; wrongs.push([stex(flat), 'Zgubiony pierwiastek: $\\frac{\\sqrt2}2\\cdot\\frac{\\sqrt2}{2}=\\frac12$, ale pojedynczy $\\sqrt2$ zostaje.']); }
    return mk({ gk, q: T`Oblicz bez tablic: ${q}`, ans: sstr(res), tex: stex(res), steps, wrong: wrongs.filter(w => !/NaN|Infinity/.test(w[0])) });
  }
  const it34 = [
    Object.assign(e34('a', { f: [['sin', 1200], ['cos', -1080]], op: 'sum' }), { label: '(a)' }),
    Object.assign(e34('b', { k: 3, f: [['cos', -300], ['sin', 120], ['tg', 135]], op: 'prodq' }), { label: '(b)' }),
    Object.assign(e34('c', { k: 10, f: [['ctg', 315], ['sin', -150], ['cos', 225]], op: 'quot2' }), { label: '(c)' }),
  ];

  /* ---------- 3.5 — wzory redukcyjne ---------- */
  // funkcja jako wykładniki (sin, cos): sin=(1,0), cos=(0,1), tg=(1,-1), ctg=(-1,1)
  const EXP = { sin: [1, 0], cos: [0, 1], tg: [1, -1], ctg: [-1, 1] };
  const CO = { sin: 'cos', cos: 'sin', tg: 'ctg', ctg: 'tg' };
  const SH = [['\\pi-\\alpha', 180, -1], ['\\pi+\\alpha', 180, 1], ['\\alpha-\\pi', -180, 1], ['2\\pi-\\alpha', 360, -1], ['\\alpha-2\\pi', -360, 1], ['\\frac\\pi2-\\alpha', 90, -1], ['\\frac\\pi2+\\alpha', 90, 1], ['\\alpha-\\frac\\pi2', -90, 1], ['\\frac{3\\pi}2-\\alpha', 270, -1], ['\\frac{3\\pi}2+\\alpha', 270, 1], ['\\alpha-\\frac{3\\pi}2', -270, 1]];
  function reduce(fn, sh) { // zwraca [znak, funkcja]
    const [, off, sgn] = sh, a = 20 * Math.PI / 180, x = off * Math.PI / 180 + sgn * a;
    const val = { sin: Math.sin, cos: Math.cos, tg: Math.tan, ctg: t => 1 / Math.tan(t) }[fn](x);
    const g = Math.abs(off) % 180 === 90 ? CO[fn] : fn, base = { sin: Math.sin, cos: Math.cos, tg: Math.tan, ctg: t => 1 / Math.tan(t) }[g](a);
    return [Math.sign(val) === Math.sign(base) ? 1 : -1, g];
  }
  const fT = (fn, arg) => T`${FN[fn]}\left(${arg}\right)`;
  const sgT = (s, fn) => (s < 0 ? '-' : '') + FN[fn] + '\\alpha';
  function monoTex(sg, a, b) { // sg·sin^a·cos^b
    const pw = (f, e) => (e === 1 ? FN[f] + '\\alpha' : FN[f] + '^{' + e + '}\\alpha');
    const num = [a > 0 ? pw('sin', a) : '', b > 0 ? pw('cos', b) : ''].filter(Boolean).join(''), den = [a < 0 ? pw('sin', -a) : '', b < 0 ? pw('cos', -b) : ''].filter(Boolean).join('');
    let t;
    if (a === 1 && b === -1) t = FN.tg + '\\alpha'; else if (a === -1 && b === 1) t = FN.ctg + '\\alpha'; else if (!num && !den) t = '1';
    else t = den ? T`\frac{${num || '1'}}{${den}}` : num;
    return (sg < 0 ? '-' : '') + t;
  }
  function e35r() { // podobny: iloczyn/iloraz trzech funkcji po redukcji
    const fs = Array.from({ length: 3 }, () => [R.pick(['sin', 'cos', 'tg', 'ctg']), R.pick(SH)]);
    const red = fs.map(([f, sh]) => reduce(f, sh));
    const mul = (k, s0) => { let sg = 1, a = 0, b = 0; red.forEach(([s, g], i) => { const e = EXP[g], dir = i === 2 ? -1 : 1; const ss = i === k ? -s : s; sg *= ss; a += dir * e[0]; b += dir * e[1]; }); return [sg * s0, a, b]; };
    const [sg, a, b] = mul(-1, 1);
    if (a === 0 && b === 0) return e35r();
    const q = T`Uprość $$\frac{${fT(...fs[0].map((x, i) => (i ? x[0] : x)))}\cdot ${fT(fs[1][0], fs[1][1][0])}}{${fT(fs[2][0], fs[2][1][0])}}$$`;
    const steps = [...fs.map(([f, sh], i) => T`$${fT(f, sh[0])}=${sgT(red[i][0], red[i][1])}$ — ${Math.abs(sh[1]) % 180 === 90 ? 'kąt $\\frac\\pi2$ lub $\\frac{3\\pi}2$: zmiana na kofunkcję' : 'kąt $\\pi$ lub $2\\pi$: ta sama funkcja'}, znak jak ${f === 'sin' ? 'sinusa' : f === 'cos' ? 'cosinusa' : f === 'tg' ? 'tangensa' : 'cotangensa'} w ćwiartce kąta $${sh[0]}$ (dla ostrego $\alpha$).`), T`Wynik: $${monoTex(sg, a, b)}$.`];
    const wrong = [[monoTex(-sg, a, b), 'Zły znak jednego z czynników — sprawdź ćwiartkę.']];
    for (let k = 0; k < 3; k++) { const [f, sh] = fs[k]; if (Math.abs(sh[1]) % 180 === 90) { const e1 = EXP[red[k][1]], e0 = EXP[f]; const dir = k === 2 ? -1 : 1; wrong.push([monoTex(sg, a - dir * e1[0] + dir * e0[0], b - dir * e1[1] + dir * e0[1]), T`Dla $${sh[0]}$ funkcja zmienia się na kofunkcję.`]); } }
    wrong.push([monoTex(sg, -a, -b), 'Odwrócony iloraz.'], [monoTex(-sg, -a, -b), 'Odwrócony iloraz i zły znak.']);
    return mk({ gk: 'simp', field: txtField(), q, tex: monoTex(sg, a, b), steps, wrong });
  }
  const it35 = (() => {
    const steps = [T`$\operatorname{tg}(\pi-\alpha)=-\operatorname{tg}\alpha$, $\operatorname{ctg}(\alpha-\pi)=\operatorname{ctg}\alpha$ (okres $\pi$), $\operatorname{tg}(\alpha-2\pi)=\operatorname{tg}\alpha$, $\operatorname{tg}\left(\frac{3\pi}2-\alpha\right)=\operatorname{ctg}\alpha$.`,
      T`Licznik: $-\operatorname{tg}\alpha\operatorname{ctg}^2\alpha-\operatorname{tg}^3\alpha\operatorname{ctg}^2\alpha=-\operatorname{ctg}\alpha-\operatorname{tg}\alpha=-\frac{1}{\sin\alpha\cos\alpha}$ (bo $\operatorname{tg}\alpha\operatorname{ctg}\alpha=1$ i $\operatorname{tg}\alpha+\operatorname{ctg}\alpha=\frac{\sin^2\alpha+\cos^2\alpha}{\sin\alpha\cos\alpha}$).`,
      T`$\operatorname{tg}\left(\alpha-\frac\pi2\right)=-\operatorname{ctg}\alpha$; $\ \sin\left(\alpha-\frac{3\pi}2\right)=\cos\alpha$, $\ \sin\left(\frac{3\pi}2+\alpha\right)=-\cos\alpha$, więc nawias to $2\cos^2\alpha$.`,
      T`Mianownik: $-\operatorname{ctg}\alpha\cdot2\cos^2\alpha=-\frac{2\cos^3\alpha}{\sin\alpha}$.`,
      T`Iloraz: $\frac{-\frac1{\sin\alpha\cos\alpha}}{-\frac{2\cos^3\alpha}{\sin\alpha}}=\frac{1}{2\cos^4\alpha}$.`];
    const part = (label, tex, wrong) => { const seen = new Set([norm(tex)]), mc = []; for (const [t, w] of wrong) if (!seen.has(norm(t)) && mc.length < 6) { seen.add(norm(t)); mc.push({ tex: t, why: w }); } return { label, kind: 'txt', ans: '0', mcCorrect: tex, mc }; };
    return { label: '3.5', gk: 'simp', pairs: true, sol: steps, steps,
      q: T`Doprowadź do prostszej postaci: $$\frac{\operatorname{tg}(\pi-\alpha)\operatorname{ctg}^2(\alpha-\pi)-\operatorname{tg}^3(\alpha-2\pi)\operatorname{tg}^2\left(\frac32\pi-\alpha\right)}{\operatorname{tg}\left(\alpha-\frac\pi2\right)\left[\sin^2\left(\alpha-\frac32\pi\right)+\sin^2\left(\frac32\pi+\alpha\right)\right]}$$`,
      fields: [
        part("Licznik po uproszczeniu", T`-\operatorname{tg}\alpha-\operatorname{ctg}\alpha`, [[T`\operatorname{tg}\alpha-\operatorname{ctg}\alpha`, T`$\operatorname{tg}(\pi-\alpha)=-\operatorname{tg}\alpha$ — oba wyrazy dostają minus.`], [T`-\operatorname{ctg}\alpha-\operatorname{tg}^5\alpha`, T`$\operatorname{tg}\left(\frac{3\pi}2-\alpha\right)=\operatorname{ctg}\alpha$ (kofunkcja), więc $\operatorname{tg}^3\alpha\operatorname{ctg}^2\alpha=\operatorname{tg}\alpha$.`], [T`\operatorname{ctg}\alpha+\operatorname{tg}\alpha`, T`Zgubiony minus z $\operatorname{tg}(\pi-\alpha)$.`]]),
        part("Mianownik po uproszczeniu", T`-2\operatorname{ctg}\alpha\cos^2\alpha`, [[T`2\operatorname{ctg}\alpha\cos^2\alpha`, T`$\operatorname{tg}\left(\alpha-\frac\pi2\right)=-\operatorname{ctg}\alpha$.`], [T`-\operatorname{ctg}\alpha`, T`$\sin^2\left(\alpha-\frac{3\pi}2\right)+\sin^2\left(\frac{3\pi}2+\alpha\right)=2\cos^2\alpha$, a nie $1$.`], [T`-\operatorname{tg}\alpha\cdot2\sin^2\alpha`, 'Przy $\\frac\\pi2$ i $\\frac{3\\pi}2$ zmieniamy funkcję na kofunkcję.']]),
        part("Wynik", T`\frac{1}{2\cos^4\alpha}`, [[T`-\frac{1}{2\cos^4\alpha}`, 'Oba — licznik i mianownik — są ujemne, więc iloraz dodatni.'], [T`\frac{1}{2\cos^2\alpha}`, T`Licznik $=-\frac1{\sin\alpha\cos\alpha}$, mianownik $=-\frac{2\cos^3\alpha}{\sin\alpha}$; iloraz ma $\cos^4\alpha$.`], [T`\frac{\operatorname{tg}\alpha}{2}`, T`$\operatorname{tg}\alpha+\operatorname{ctg}\alpha=\frac1{\sin\alpha\cos\alpha}$ — nie skraca się do $\operatorname{tg}\alpha$.`]])] };
  })();

  /* ---------- 3.6 ---------- */
  const it36a = mk({ gk: 'a', vars: ['a', 'b'], q: T`Oblicz wartość wyrażenia $$\frac{4a^2\sin45^\circ-6ab\operatorname{tg}^230^\circ+(b\operatorname{tg}45^\circ)^2}{2a\sin30^\circ-2b\cos^245^\circ}$$`, ans: '(2*sqrt(2)*a^2-2*a*b+b^2)/(a-b)', tex: T`\frac{2\sqrt2\,a^2-2ab+b^2}{a-b}`,
    steps: [T`Wartości: $\sin45^\circ=\frac{\sqrt2}2$, $\operatorname{tg}30^\circ=\frac{\sqrt3}3$ (więc $\operatorname{tg}^230^\circ=\frac13$), $\operatorname{tg}45^\circ=1$, $\sin30^\circ=\frac12$, $\cos^245^\circ=\frac12$.`, T`Licznik: $4a^2\cdot\frac{\sqrt2}2-6ab\cdot\frac13+b^2=2\sqrt2\,a^2-2ab+b^2$.`, T`Mianownik: $2a\cdot\frac12-2b\cdot\frac12=a-b$.`],
    wrong: [[T`\frac{2a^2-2ab+b^2}{a-b}`, T`$\sin45^\circ=\frac{\sqrt2}2$, a nie $\frac12$ — to jest $\sin30^\circ$.`], [T`\frac{2\sqrt2\,a^2-2\sqrt3ab+b^2}{a-b}`, T`$\operatorname{tg}^230^\circ=\left(\frac{\sqrt3}3\right)^2=\frac13$.`], [T`\frac{2\sqrt2\,a^2-2ab+b^2}{a-2b}`, T`$\cos^245^\circ=\frac12$, więc $2b\cos^245^\circ=b$.`]] });
  const ONE = [['\\sin90^\\circ', 1], ['\\cos0^\\circ', 1], ['\\operatorname{tg}45^\\circ', 1], ['\\operatorname{ctg}45^\\circ', 1], ['\\cos360^\\circ', 1], ['\\cos180^\\circ', -1], ['\\sin270^\\circ', -1], ['\\operatorname{tg}135^\\circ', -1], ['\\operatorname{ctg}135^\\circ', -1]];
  const ZERO = ['\\operatorname{tg}0^\\circ', '\\operatorname{ctg}90^\\circ', '\\sin180^\\circ', '\\cos90^\\circ', '\\sin0^\\circ'];
  const pickV = v => R.pick(ONE.filter(o => o[1] === v));
  function e36b(s, choice) {
    const c = choice || { u: pickV(1), v: pickV(s), w: R.pick(ONE), g: R.pick(ONE), z1: R.pick(ZERO), z2: R.pick(ZERO), k: R.pick(ONE) };
    const h = c.h || R.pick(ONE.filter(o => o[1] === -s * c.g[1]));
    const res = s > 0 ? 'x+y' : 'x-y';
    const q = T`Oblicz wartość wyrażenia $$\frac{(x${c.u[0]})^3-x^2y^2${c.z1}+xy^2${c.z2}+(y${c.v[0]})^3}{(x${c.w[0]})^2+xy${c.g[0]}${h[0]}+(y${c.k[0]})^2}$$`;
    const steps = [T`Wartości: $${[c.u, c.v, c.w, c.g, h, c.k].map(o => o[0] + '=' + o[1]).filter((x, i, a) => a.indexOf(x) === i).join(',\\ ')}$, a $${c.z1}=${c.z2}=0$.`, T`Licznik: $x^3${s > 0 ? '+' : '-'}y^3$ (środkowe wyrazy są zerami), mianownik: $x^2${s > 0 ? '-' : '+'}xy+y^2$.`, T`$x^3${s > 0 ? '+' : '-'}y^3=(x${s > 0 ? '+' : '-'}y)(x^2${s > 0 ? '-' : '+'}xy+y^2)$, więc wynik to $${res}$.`];
    return mk({ gk: 'b', vars: ['x', 'y'], q, ans: res, tex: res, steps,
      wrong: [[s > 0 ? 'x-y' : 'x+y', T`$${c.v[0]}=${c.v[1]}$, więc $(y${c.v[0]})^3=${s > 0 ? '' : '-'}y^3$.`], [T`\frac{x^3${s > 0 ? '+' : '-'}y^3}{x^2+y^2}`, T`Wyraz $xy${c.g[0]}${h[0]}$ nie jest zerem: to $${s > 0 ? '-' : '+'}xy$.`], ['1', 'Licznik i mianownik nie są równe — licznik ma stopień 3.'], [s > 0 ? 'y-x' : '-x-y', 'Zły znak wyniku.']] });
  }
  const it36b = e36b(-1, { u: ONE[0], v: ONE[5], w: ONE[5], g: ONE[6], h: ONE[5], z1: ZERO[0], z2: ZERO[1], k: ONE[6] });
  it36b.q = T`Oblicz wartość wyrażenia $$\frac{(x\sin90^\circ)^3-x^2y^2\operatorname{tg}0^\circ+xy^2\operatorname{ctg}90^\circ+(y\cos180^\circ)^3}{(x\cos180^\circ)^2+xy\sin270^\circ\cos180^\circ+(y\sin270^\circ)^2}$$`;
  function e36a() {
    const F1 = R.pick([['\\sin45^\\circ', term(1, 2, 2)], ['\\sin30^\\circ', term(1, 2)], ['\\sin60^\\circ', term(1, 2, 3)], ['\\cos45^\\circ', term(1, 2, 2)]]);
    const F2 = R.pick([['\\operatorname{tg}^230^\\circ', term(1, 3)], ['\\operatorname{tg}^260^\\circ', term(3, 1)], ['\\sin^245^\\circ', term(1, 2)], ['\\cos^260^\\circ', term(1, 4)]]);
    const D1 = R.pick([['\\sin30^\\circ', term(1, 2)], ['\\cos60^\\circ', term(1, 2)]]), D2 = R.pick([['\\cos^245^\\circ', term(1, 2)], ['\\sin^245^\\circ', term(1, 2)]]);
    const p = R.pick([2, 4, 6]), qq = R.pick([3, 6, 9, 12]), r = 2, s2 = 2;
    const c1 = tmul(term(p, 1), F1[1]), c2 = tmul(term(qq, 1), F2[1]), d1 = tmul(term(r, 1), D1[1]), d2 = tmul(term(s2, 1), D2[1]);
    const cf = (t, mon, first) => { const x = stex(S(t)); const one = x === '1'; return (first ? '' : '+') + (one ? '' : x.replace(/^\\frac\{(.+)\}\{(\d+)\}$/, '\\frac{$1}{$2}')) + mon; };
    const num = cf(c1, 'a^2', true) + '-' + (stex(S(c2)) === '1' ? '' : stex(S(c2))) + 'ab+b^2', den = (stex(S(d1)) === '1' ? '' : stex(S(d1))) + 'a-' + (stex(S(d2)) === '1' ? '' : stex(S(d2))) + 'b';
    const tex = T`\frac{${num}}{${den}}`;
    const str = `((${sstr(S(c1))})*a^2-(${sstr(S(c2))})*a*b+b^2)/((${sstr(S(d1))})*a-(${sstr(S(d2))})*b)`;
    return mk({ gk: 'a', vars: ['a', 'b'], q: T`Oblicz wartość wyrażenia $$\frac{${p}a^2${F1[0]}-${qq}ab${F2[0]}+(b\operatorname{tg}45^\circ)^2}{${r}a${D1[0]}-${s2}b${D2[0]}}$$`, ans: str, tex,
      steps: [T`Wartości z tabelki: $${F1[0]}=${tt(F1[1])}$, $${F2[0]}=${tt(F2[1])}$, $\operatorname{tg}45^\circ=1$, $${D1[0]}=${tt(D1[1])}$, $${D2[0]}=${tt(D2[1])}$.`, T`Podstawiamy i upraszczamy współczynniki: $${tex}$.`],
      wrong: [[T`\frac{${num}}{${den.replace(/b$/, '2b')}}`, T`$${D2[0]}=\frac12$, więc $${s2}b${D2[0]}=b$.`], [T`\frac{${num.replace('+b^2', '-b^2')}}{${den}}`, T`$(b\operatorname{tg}45^\circ)^2=b^2$ — z plusem.`], [T`\frac{${num}}{${den.replace('a-', 'a+')}}`, 'Zły znak w mianowniku.']] });
  }
  const gen36 = gk => (gk === 'a' ? e36a() : e36b(R.pick([1, -1])));

  /* ---------- 3.7 — dowód ---------- */
  const SG = (goal, q, a, line, why, ...w) => ({ goal, q, a, line, why, w });
  const it37 = { label: '3.7', type: 'guided', gk: 'proof', q: T`Udowodnij, że dla dowolnego kąta $\alpha\in\mathbb R$: $\ \sin^2\alpha+\cos^2\alpha=1$.`,
    idea: T`Wróć do definicji: weź dowolny punkt $P=(x,y)\neq(0,0)$ na końcowym ramieniu kąta. Sinus i cosinus to ilorazy współrzędnych przez odległość $r$ punktu od początku układu, a $r^2=x^2+y^2$ (Pitagoras).`,
    steps: [
      SG('Definicja', T`Jak zdefiniowane są $\sin\alpha$ i $\cos\alpha$ dla dowolnego kąta?`, T`$\sin\alpha=\frac yr$, $\cos\alpha=\frac xr$ dla punktu $P=(x,y)$ na ramieniu kąta, $r=|OP|$`, T`Niech $P=(x,y)\neq(0,0)$ leży na końcowym ramieniu kąta $\alpha$, $r=\sqrt{x^2+y^2}>0$. Z definicji $\sin\alpha=\frac yr$, $\cos\alpha=\frac xr$.`, T`Definicja przez trójkąt prostokątny działa tylko dla kątów ostrych — dla dowolnego $\alpha$ potrzebny jest układ współrzędnych.`,
        [T`$\sin\alpha=\frac{\text{przyprostokątna}}{\text{przeciwprostokątna}}$`, 'To działa tylko dla kątów ostrych, a twierdzenie ma być dla każdego $\\alpha\\in\\mathbb R$.'], [T`$\sin\alpha=\frac xr$, $\cos\alpha=\frac yr$`, 'Odwrotnie: cosinus to współrzędna $x$ (pozioma), sinus — $y$.']),
      SG('Podstawienie', T`Ile wynosi $\sin^2\alpha+\cos^2\alpha$ po podstawieniu definicji?`, T`$\frac{x^2+y^2}{r^2}$`, T`$\sin^2\alpha+\cos^2\alpha=\frac{y^2}{r^2}+\frac{x^2}{r^2}=\frac{x^2+y^2}{r^2}$.`, 'Wspólny mianownik $r^2$ — zostaje suma kwadratów współrzędnych.',
        [T`$\frac{x+y}{r}$`, 'Podnosimy do kwadratu licznik i mianownik osobno.'], [T`$\frac{x^2+y^2}{r}$`, 'Mianownik też jest do kwadratu: $r^2$.']),
      SG('Pitagoras', T`Dlaczego $\frac{x^2+y^2}{r^2}=1$?`, T`Bo $r^2=x^2+y^2$ (odległość punktu od początku układu)`, T`Ponieważ $r=|OP|=\sqrt{x^2+y^2}$, mamy $r^2=x^2+y^2$, więc $\sin^2\alpha+\cos^2\alpha=1$. $\blacksquare$`, T`To twierdzenie Pitagorasa dla trójkąta o wierzchołkach $O$, $(x,0)$, $P$ — działa w każdej ćwiartce, bo kwadraty usuwają znaki.`,
        [T`Bo $x=y$`, 'Nie — $x,y$ są dowolne.'], [T`Bo $r=1$`, 'Nie zakładaliśmy $r=1$; wynik nie zależy od wyboru punktu na ramieniu.'])] };
  it37.sol = it37.steps.map(s => s.line);

  /* ---------- 3.9 ---------- */
  const it39 = [
    mk({ label: 'sin 75°', gk: 'sin', q: T`Oblicz bez tablic $\sin75^\circ$.`, ans: '(sqrt(6)+sqrt(2))/4', tex: T`\frac{\sqrt6+\sqrt2}{4}`,
      steps: [T`$75^\circ=45^\circ+30^\circ$.`, T`$\sin(\alpha+\beta)=\sin\alpha\cos\beta+\cos\alpha\sin\beta$: $\ \frac{\sqrt2}2\cdot\frac{\sqrt3}2+\frac{\sqrt2}2\cdot\frac12=\frac{\sqrt6+\sqrt2}4$.`],
      wrong: [[T`\frac{\sqrt6-\sqrt2}{4}`, T`To $\sin15^\circ$ — w $\sin(\alpha+\beta)$ jest plus.`], [T`\frac{\sqrt2+\sqrt3}{2}`, T`$\sin(\alpha+\beta)\neq\sin\alpha+\sin\beta$.`], [T`\frac{\sqrt6+\sqrt2}{2}`, T`$\frac{\sqrt2}2\cdot\frac{\sqrt3}2=\frac{\sqrt6}4$ — mianownik $4$.`]] }),
    mk({ label: 'cos 15°', gk: 'cos', q: T`Oblicz bez tablic $\cos15^\circ$.`, ans: '(sqrt(6)+sqrt(2))/4', tex: T`\frac{\sqrt6+\sqrt2}{4}`,
      steps: [T`$15^\circ=45^\circ-30^\circ$.`, T`$\cos(\alpha-\beta)=\cos\alpha\cos\beta+\sin\alpha\sin\beta$: $\ \frac{\sqrt2}2\cdot\frac{\sqrt3}2+\frac{\sqrt2}2\cdot\frac12=\frac{\sqrt6+\sqrt2}4$.`, T`Zauważ: $\cos15^\circ=\sin75^\circ$, bo $15^\circ+75^\circ=90^\circ$.`],
      wrong: [[T`\frac{\sqrt6-\sqrt2}{4}`, T`W $\cos(\alpha-\beta)$ jest <b>plus</b>: $\cos\alpha\cos\beta+\sin\alpha\sin\beta$.`], [T`\frac{\sqrt2-\sqrt3}{2}`, T`$\cos(\alpha-\beta)\neq\cos\alpha-\cos\beta$.`], [T`\frac{\sqrt3}{2}`, T`To $\cos30^\circ$.`]] }),
    mk({ label: 'tg 105°', gk: 'tg', q: T`Oblicz bez tablic $\operatorname{tg}105^\circ$.`, ans: '-2-sqrt(3)', tex: T`-2-\sqrt3`,
      steps: [T`$105^\circ=60^\circ+45^\circ$.`, T`$\operatorname{tg}(\alpha+\beta)=\frac{\operatorname{tg}\alpha+\operatorname{tg}\beta}{1-\operatorname{tg}\alpha\operatorname{tg}\beta}=\frac{\sqrt3+1}{1-\sqrt3}$.`, T`Usuwamy niewymierność: $\frac{(\sqrt3+1)(1+\sqrt3)}{(1-\sqrt3)(1+\sqrt3)}=\frac{4+2\sqrt3}{-2}=-2-\sqrt3$.`, T`Kontrola: $105^\circ$ jest w II ćwiartce, więc tangens ujemny ✓.`],
      wrong: [[T`2+\sqrt3`, T`$105^\circ$ leży w II ćwiartce — tangens jest ujemny.`], [T`-2+\sqrt3`, T`$(\sqrt3+1)^2=4+2\sqrt3$.`], [T`\sqrt3+1`, T`$\operatorname{tg}(\alpha+\beta)\neq\operatorname{tg}\alpha+\operatorname{tg}\beta$.`]] })];
  const gen39 = gk => { const g = ALG('2.13').gen(gk); g.gk = gk; return g; };

  /* ---------- 3.10 — kąt z sin i cos ---------- */
  const ANG = { '7pi/8': [7, 8], '3pi/8': [3, 8], 'pi/12': [1, 12], '5pi/12': [5, 12], '17pi/12': [17, 12] };
  function it310(label, sT, cT, key, steps) {
    const [p, q] = ANG[key];
    return { label, gk: 'ang', q: T`Wyznacz miarę kąta $\alpha\in[0,2\pi)$, wiedząc, że $$\sin\alpha=${sT},\qquad\cos\alpha=${cT}.$$`, keys: ['pi'], fields: [{ label: '\\alpha', kind: 'angle', ans: key, restrict: ['notrig'] }], sol: steps, steps, _ang: [p, q] };
  }
  const r2 = T`\sqrt{2-\sqrt2}`, r2p = T`\sqrt{2+\sqrt2}`, r3 = T`\sqrt{2-\sqrt3}`, r3p = T`\sqrt{2+\sqrt3}`;
  const its310 = [
    it310('(a)', T`\frac{${r2}}2`, T`-\frac{${r2p}}2`, '7pi/8', [T`Znaki: $\sin\alpha>0$, $\cos\alpha<0$ — II ćwiartka.`, T`$\frac{${r2}}2=\sin\frac\pi8$ (połowa kąta $\frac\pi4$: $\sin^2\frac\pi8=\frac{1-\cos\frac\pi4}2=\frac{2-\sqrt2}4$).`, T`Kąt odniesienia $\frac\pi8$ w II ćwiartce: $\alpha=\pi-\frac\pi8=\frac{7\pi}8$.`]),
    it310('(b)', T`\frac{${r2p}}2`, T`\frac{${r2}}2`, '3pi/8', [T`Oba dodatnie — I ćwiartka.`, T`$\cos\alpha=\frac{${r2}}2=\sin\frac\pi8$, a $\sin\frac\pi8=\cos\left(\frac\pi2-\frac\pi8\right)=\cos\frac{3\pi}8$.`, T`$\alpha=\frac{3\pi}8$ (kontrola: $\sin\frac{3\pi}8=\cos\frac\pi8=\frac{${r2p}}2$ ✓).`]),
    it310('(c)', T`\frac{${r3}}2`, T`\frac{${r3p}}2`, 'pi/12', [T`Oba dodatnie — I ćwiartka.`, T`$\cos2\alpha=\cos^2\alpha-\sin^2\alpha=\frac{2+\sqrt3}4-\frac{2-\sqrt3}4=\frac{\sqrt3}2$ i $\sin2\alpha>0$, więc $2\alpha=\frac\pi6$.`, T`$\alpha=\frac\pi{12}$.`]),
    it310('(d)', T`\frac{${r3p}}2`, T`\frac{${r3}}2`, '5pi/12', [T`Oba dodatnie — I ćwiartka.`, T`Sinus i cosinus zamienione względem (c), więc $\alpha=\frac\pi2-\frac\pi{12}=\frac{5\pi}{12}$.`, T`Kontrola: $\cos2\alpha=\frac{2-\sqrt3}4-\frac{2+\sqrt3}4=-\frac{\sqrt3}2$, czyli $2\alpha=\frac{5\pi}6$ ✓.`]),
    it310('(e)', T`\frac{\sqrt6-\sqrt2}4`, T`\frac{\sqrt6+\sqrt2}4`, 'pi/12', [T`Oba dodatnie — I ćwiartka.`, T`$\frac{\sqrt6-\sqrt2}4=\sin(45^\circ-30^\circ)=\sin15^\circ$ (wzór na sinus różnicy).`, T`$\alpha=15^\circ=\frac\pi{12}$. To ten sam kąt co w (c): $\frac{\sqrt6-\sqrt2}4=\frac{\sqrt{2-\sqrt3}}2$.`]),
    it310('(f)', T`-\frac{\sqrt6+\sqrt2}4`, T`-\frac{\sqrt6-\sqrt2}4`, '17pi/12', [T`Oba ujemne — III ćwiartka.`, T`$\frac{\sqrt6+\sqrt2}4=\sin75^\circ=\sin\frac{5\pi}{12}$ i $\frac{\sqrt6-\sqrt2}4=\cos\frac{5\pi}{12}$ — kąt odniesienia $\frac{5\pi}{12}$.`, T`W III ćwiartce: $\alpha=\pi+\frac{5\pi}{12}=\frac{17\pi}{12}$.`])];

  /* ---------- 3.11 ---------- */
  function e311(t, a, b, c, d, quad) {
    const v = Q(a * t + b, c - d * t);
    const sg = x => (x < 0 ? '-' : '+');
    return mk({ q: T`Znajdź wartość wyrażenia $W=\frac{${a}\sin\alpha${sg(b)}${Math.abs(b) === 1 ? '' : Math.abs(b)}\cos\alpha}{${c === 1 ? '' : c}\cos\alpha-${d}\sin\alpha}$, jeśli $\operatorname{tg}\alpha=${t}$ oraz $${quad}$.`, ans: qs(v), tex: qt(v),
      steps: [T`$\operatorname{tg}\alpha$ istnieje, więc $\cos\alpha\neq0$ — dzielimy licznik i mianownik przez $\cos\alpha$.`, T`$W=\frac{${a}\operatorname{tg}\alpha${sg(b)}${Math.abs(b)}}{${c}-${d}\operatorname{tg}\alpha}=\frac{${a}\cdot(${t})${sg(b)}${Math.abs(b)}}{${c}-${d}\cdot(${t})}=\frac{${a * t + b}}{${c - d * t}}=${qt(v)}$.`, T`Przedział dla $\alpha$ nie jest tu potrzebny — iloraz zależy tylko od $\operatorname{tg}\alpha$.`],
      wrong: [[qt(Q(a * t + b, c + d * t)), T`$-${d}\operatorname{tg}\alpha$ przy $\operatorname{tg}\alpha=${t}$ daje $${-d * t > 0 ? '+' : ''}${-d * t}$.`], [qt(Q(a + b * t, c * t - d)), 'Podzielono przez $\\sin\\alpha$ w liczniku, a przez $\\cos\\alpha$ w mianowniku — trzeba wszędzie to samo.'], [qt(Q(-(a * t + b), c - d * t)), 'Zły znak — przedział nie zmienia wartości ilorazu.'], [qt(Q(c - d * t, a * t + b)), 'Odwrócony ułamek.']] });
  }
  const gen311 = () => { for (;;) { const t = R.nz(-5, 5), a = R.int(1, 4), b = R.nz(-3, 3), c = R.int(1, 3), d = R.int(1, 4); if (c - d * t !== 0 && a * t + b !== 0) return e311(t, a, b, c, d, t < 0 ? '90^\\circ<\\alpha<180^\\circ' : '0^\\circ<\\alpha<90^\\circ'); } };

  /* ---------- 3.1 — stopnie i radiany ---------- */
  const t211 = ALG('2.11');
  const D1 = [[1, 6], [1, 4], [3, 5], [3, 4], [4, 3], [5, 6], [5, 4], [11, 6]];
  const it31a = cloneIt(t211.items[0], { label: '1.1', pairs: true, q: T`Wyraź w stopniach: $$${D1.map(([p, q]) => A.angleTex(p, q)).join(',\\quad ')}$$`,
    fields: D1.map(([p, q]) => ({ label: A.angleTex(p, q), ans: String(180 * p / q), restrict: ['plain'], unit: '^\\circ' })),
    sol: [T`$\pi$ radianów to $180^\circ$, więc $\pi$ zastępujemy przez $180^\circ$ i skracamy.`, D1.map(([p, q]) => T`$${A.angleTex(p, q)}=\frac{${p}\cdot180^\circ}{${q}}=${180 * p / q}^\circ$`).join(', ') + '.'] });
  const it31b = cloneIt(t211.items[1], { label: '1.2a', pairs: true }), it31c = cloneIt(t211.items[2], { label: '1.2b', pairs: true });

  /* ---------- 3.2, 3.3, 3.8 — z algebry ---------- */
  const t212 = ALG('2.12'), t214 = ALG('2.14'), t213 = ALG('2.13');
  const byAng = (t, p, q) => t.items.find(i => i.label === '$' + A.angleTex(p, q) + '$');
  const ANG2 = [[1, 12], [1, 8], [3, 8], [3, 12], [5, 12], [5, 8], [7, 8], [7, 12], [11, 12], [9, 8], [11, 8], [17, 12], [19, 12], [13, 8], [15, 8], [23, 12]];
  const its32 = ANG2.map(([p, q]) => {
    if (p === 3 && q === 12) { const b = byAng(t212, 1, 4); return cloneIt(b, { label: T`$\frac{3\pi}{12}$`, q: T`Wyznacz wartości funkcji trygonometrycznych dla kąta $\frac{3\pi}{12}$.`, sol: [T`Najpierw skróć: $\frac{3\pi}{12}=\frac\pi4$ — to kąt z tabelki.`, ...(b.sol || b.steps || [])] }); }
    return cloneIt(byAng(t214, p, q));
  });
  const its33 = t212.items.map(i => cloneIt(i));
  const its38 = t213.items.map(i => cloneIt(i));

  /* ---------- opracowanie ---------- */
  const F = {
    deg: W(T`$\pi\text{ rad}=180^\circ$: $\ \alpha^\circ=\alpha\cdot\frac{\pi}{180}$, $\ x\text{ rad}=x\cdot\frac{180^\circ}\pi$.`, T`Pełny kąt to $360^\circ$ i jednocześnie $2\pi$ (obwód okręgu jednostkowego).`),
    period: W(T`Okresowość: $\sin(\alpha+360^\circ k)=\sin\alpha$, $\cos(\alpha+360^\circ k)=\cos\alpha$, $\operatorname{tg}(\alpha+180^\circ k)=\operatorname{tg}\alpha$.`, T`Kąt $\alpha+360^\circ$ ma to samo ramię końcowe co $\alpha$ — ten sam punkt na okręgu.`),
    evenodd: W(T`$\cos(-\alpha)=\cos\alpha$; $\ \sin(-\alpha)=-\sin\alpha$, $\operatorname{tg}(-\alpha)=-\operatorname{tg}\alpha$, $\operatorname{ctg}(-\alpha)=-\operatorname{ctg}\alpha$.`, T`Kąt $-\alpha$ to odbicie względem osi $Ox$: $x$ się nie zmienia, $y$ zmienia znak.`),
    red: W(T`Wzory redukcyjne: dla $\pi\pm\alpha$, $2\pi-\alpha$ — ta sama funkcja; dla $\frac\pi2\pm\alpha$, $\frac{3\pi}2\pm\alpha$ — kofunkcja ($\sin\leftrightarrow\cos$, $\operatorname{tg}\leftrightarrow\operatorname{ctg}$).`, T`Znak: traktujemy $\alpha$ jak kąt ostry i patrzymy, w której ćwiartce leży kąt i jaki znak ma tam <i>wyjściowa</i> funkcja.`, T`Przykład: $\operatorname{tg}\left(\frac{3\pi}2-\alpha\right)$ — III ćwiartka, tangens dodatni, kofunkcja: $+\operatorname{ctg}\alpha$.`),
    table: W(T`$\sin30^\circ=\frac12$, $\sin45^\circ=\frac{\sqrt2}2$, $\sin60^\circ=\frac{\sqrt3}2$; $\cos$ — w odwrotnej kolejności.`, T`Trójkąt równoboczny o boku $2$ przecięty wysokością daje kąty $30^\circ,60^\circ$ i boki $1,\sqrt3,2$; kwadrat o boku $1$ — kąt $45^\circ$ i przekątną $\sqrt2$.`),
    tgctg: W(T`$\operatorname{tg}\alpha=\frac{\sin\alpha}{\cos\alpha}$, $\ \operatorname{ctg}\alpha=\frac{\cos\alpha}{\sin\alpha}=\frac1{\operatorname{tg}\alpha}$.`, T`Wartości tg i ctg dla kątów z tabelki liczymy z sin i cos — nie trzeba ich osobno pamiętać.`),
    signs: W(T`Znaki: I ćw. — wszystkie dodatnie; II — tylko $\sin$; III — tylko $\operatorname{tg},\operatorname{ctg}$; IV — tylko $\cos$.`, T`$\sin$ to współrzędna $y$, $\cos$ — współrzędna $x$ punktu na okręgu.`),
    pyth: W(T`$\sin^2\alpha+\cos^2\alpha=1$; stąd $\operatorname{tg}\alpha+\operatorname{ctg}\alpha=\frac1{\sin\alpha\cos\alpha}$.`, T`$\frac{\sin\alpha}{\cos\alpha}+\frac{\cos\alpha}{\sin\alpha}=\frac{\sin^2\alpha+\cos^2\alpha}{\sin\alpha\cos\alpha}$.`),
    unit: W(T`Definicja: dla $P=(x,y)$ na ramieniu kąta i $r=\sqrt{x^2+y^2}$: $\sin\alpha=\frac yr$, $\cos\alpha=\frac xr$.`, T`Nie zależy od wyboru punktu na ramieniu — trójkąty są podobne.`),
    sumsin: W(T`$\sin(\alpha\pm\beta)=\sin\alpha\cos\beta\pm\cos\alpha\sin\beta$.`, T`Wynika ze wzoru na $\cos(\alpha-\beta)$ i $\sin\alpha=\cos\left(\frac\pi2-\alpha\right)$.`),
    sumcos: W(T`$\cos(\alpha\pm\beta)=\cos\alpha\cos\beta\mp\sin\alpha\sin\beta$.`, T`Odległość punktów $(\cos\alpha,\sin\alpha)$ i $(\cos\beta,\sin\beta)$ liczona na dwa sposoby daje $\cos(\alpha-\beta)$.`),
    sumtg: W(T`$\operatorname{tg}(\alpha\pm\beta)=\frac{\operatorname{tg}\alpha\pm\operatorname{tg}\beta}{1\mp\operatorname{tg}\alpha\operatorname{tg}\beta}$.`, T`Podziel wzór na $\sin(\alpha\pm\beta)$ przez wzór na $\cos(\alpha\pm\beta)$, a potem licznik i mianownik przez $\cos\alpha\cos\beta$.`),
    half: W(T`$\sin^2\frac\alpha2=\frac{1-\cos\alpha}2$, $\cos^2\frac\alpha2=\frac{1+\cos\alpha}2$.`, T`Ze wzoru $\cos\alpha=1-2\sin^2\frac\alpha2=2\cos^2\frac\alpha2-1$.`),
    divcos: W(T`Iloraz $\frac{a\sin\alpha+b\cos\alpha}{c\cos\alpha+d\sin\alpha}$ dzielimy przez $\cos\alpha$: $\frac{a\operatorname{tg}\alpha+b}{c+d\operatorname{tg}\alpha}$.`, T`Wolno, bo skoro $\operatorname{tg}\alpha$ istnieje, to $\cos\alpha\neq0$.`),
    cubes: W(T`$x^3\pm y^3=(x\pm y)(x^2\mp xy+y^2)$.`, T`Wymnóż prawą stronę — wyrazy mieszane się znoszą.`),
  };

  const L3 = (id, name, statement, extra) => Object.assign({ id, name, statement }, extra);
  A.addList({
    num: 13, id: 'p3', subject: 'pro', title: 'Lista 3', name: 'Trygonometria', hue: 'p3',
    blurb: 'Stopnie i radiany, wartości funkcji trygonometrycznych, wzory redukcyjne i wzory na sumę kątów.',
    tasks: [
      L3('P3.1', 'Stopnie i radiany', T`Wyrazić w stopniach: $\frac\pi6$, $\frac\pi4$, $\frac{3\pi}5$, $\frac{3\pi}4$, $\frac{4\pi}3$, $\frac{5\pi}6$, $\frac{5\pi}4$, $\frac{11\pi}6$. Wyrazić w radianach: $15^\circ$, $20^\circ$, $45^\circ$, $75^\circ$, $60^\circ$, $90^\circ$, $100^\circ$, $120^\circ$, $210^\circ$, $300^\circ$, $315^\circ$, $270^\circ$.`, { wzIds: ['deg'], gen: gk => t211.gen(gk), items: [it31a, it31b, it31c] }),
      L3('P3.2', 'Kąty $\\frac{k\\pi}{12}$ i $\\frac{k\\pi}8$', T`Wyznaczyć wartości sinus, cosinus, tangens oraz cotangens dla kątów $\frac\pi{12}$, $\frac\pi8$, $\frac{3\pi}8$, $\frac{3\pi}{12}$, $\frac{5\pi}{12}$, $\frac{5\pi}8$, $\frac{7\pi}8$, $\frac{7\pi}{12}$, $\frac{11\pi}{12}$, $\frac{9\pi}8$, $\frac{11\pi}8$, $\frac{17\pi}{12}$, $\frac{19\pi}{12}$, $\frac{13\pi}8$, $\frac{15\pi}8$, $\frac{23\pi}{12}$.`, { wzFrom: '2.14', gen: gk => t214.gen(gk), items: its32 }),
      L3('P3.3', 'Tabelka wartości', T`Wyznaczyć wartości sinus, cosinus, tangens oraz cotangens dla kątów $0$, $\frac\pi6$, $\frac\pi4$, $\frac\pi3$, $\frac\pi2$, $\frac{2\pi}3$, $\frac{3\pi}4$, $\frac{5\pi}6$, $\pi$, $\frac{7\pi}6$, $\frac{5\pi}4$, $\frac{4\pi}3$, $\frac{3\pi}2$, $\frac{5\pi}3$, $\frac{7\pi}4$, $\frac{11\pi}6$.`, { wzFrom: '2.12', gen: gk => t212.gen(gk), items: its33 }),
      L3('P3.4', 'Bez tablic: duże i ujemne kąty', T`Obliczyć bez tablic: (a) $\sin1200^\circ+\cos(-1080^\circ)$, (b) $\frac{3\cos(-300^\circ)\sin120^\circ}{\operatorname{tg}135^\circ}$, (c) $\frac{10\operatorname{ctg}315^\circ}{\sin(-150^\circ)\cos225^\circ}$.`, { wzIds: ['period', 'evenodd', 'signs', 'table', 'tgctg'], gen: gk => e34(gk), items: it34 }),
      L3('P3.5', 'Wzory redukcyjne', T`Doprowadzić do prostszej postaci $\frac{\operatorname{tg}(\pi-\alpha)\operatorname{ctg}^2(\alpha-\pi)-\operatorname{tg}^3(\alpha-2\pi)\operatorname{tg}^2\left(\frac32\pi-\alpha\right)}{\operatorname{tg}\left(\alpha-\frac\pi2\right)\left[\sin^2\left(\alpha-\frac32\pi\right)+\sin^2\left(\frac32\pi+\alpha\right)\right]}$.`, { wzIds: ['red', 'period', 'evenodd', 'pyth', 'tgctg'], gen: () => e35r(), items: [it35] }),
      L3('P3.6', 'Podstawianie wartości', T`Obliczyć wartość wyrażeń: (a) $\frac{4a^2\sin45^\circ-6ab\operatorname{tg}^230^\circ+(b\operatorname{tg}45^\circ)^2}{2a\sin30^\circ-2b\cos^245^\circ}$, (b) $\frac{(x\sin90^\circ)^3-x^2y^2\operatorname{tg}0^\circ+xy^2\operatorname{ctg}90^\circ+(y\cos180^\circ)^3}{(x\cos180^\circ)^2+xy\sin270^\circ\cos180^\circ+(y\sin270^\circ)^2}$.`, { wzIds: it => (it && it.gk === 'b' ? ['table', 'tgctg', 'cubes'] : ['table', 'tgctg']), gen: gen36, items: [Object.assign(it36a, { label: '(a)' }), Object.assign(it36b, { label: '(b)' })] }),
      L3('P3.7', 'Jedynka trygonometryczna', T`Udowodnij, że dla dowolnego kąta $\alpha\in\mathbb R$: $\sin^2\alpha+\cos^2\alpha=1$.`, { wzIds: ['unit', 'pyth'], items: [it37] }),
      L3('P3.8', 'Wzory na sumę, różnicę i wielokrotność', T`Wyznaczyć funkcje sinus, cosinus, tangens oraz cotangens sumy i różnicy dwóch kątów, kąta podwojonego oraz połowy kąta.`, { wzFrom: '2.13', gen: gk => t213.gen(gk), items: its38 }),
      L3('P3.9', 'Bez tablic: $75^\\circ$, $15^\\circ$, $105^\\circ$', T`Obliczyć bez tablic: $\sin75^\circ$, $\cos15^\circ$, $\operatorname{tg}105^\circ$.`, { wzIds: it => ({ sin: ['sumsin', 'table'], cos: ['sumcos', 'table'], tg: ['sumtg', 'table', 'signs'] }[(it && it.gk) || 'sin'] || ['sumsin']), gen: gen39, items: it39 }),
      L3('P3.10', 'Kąt z sin i cos', T`Wyznaczyć miarę kąta $\alpha$, wiedząc, że: (a) $\sin\alpha=\frac{\sqrt{2-\sqrt2}}2$, $\cos\alpha=-\frac{\sqrt{2+\sqrt2}}2$; (b) $\sin\alpha=\frac{\sqrt{2+\sqrt2}}2$, $\cos\alpha=\frac{\sqrt{2-\sqrt2}}2$; (c) $\sin\alpha=\frac{\sqrt{2-\sqrt3}}2$, $\cos\alpha=\frac{\sqrt{2+\sqrt3}}2$; (d) $\sin\alpha=\frac{\sqrt{2+\sqrt3}}2$, $\cos\alpha=\frac{\sqrt{2-\sqrt3}}2$; (e) $\sin\alpha=\frac{\sqrt6-\sqrt2}4$, $\cos\alpha=\frac{\sqrt6+\sqrt2}4$; (f) $\sin\alpha=-\frac{\sqrt6+\sqrt2}4$, $\cos\alpha=-\frac{\sqrt6-\sqrt2}4$.`, { wzFrom: '2.15', gen: gk => ALG('2.15').gen(gk), items: its310 }),
      L3('P3.11', 'Wartość z $\\operatorname{tg}\\alpha$', T`Znaleźć wartość wyrażenia $W=\frac{2\sin\alpha+\cos\alpha}{\cos\alpha-3\sin\alpha}$, jeśli $\operatorname{tg}\alpha=-2$ oraz $90^\circ<\alpha<180^\circ$.`, { wzIds: ['divcos', 'tgctg'], gen: gen311, items: [Object.assign(e311(-2, 2, 1, 1, 3, '90^\\circ<\\alpha<180^\\circ'), { label: '3.11' })] }),
    ],
  });
  for (const t of A.lists.find(l => l.id === 'p3').tasks) if (!t.wzFrom) t.wzLib = F;
  A.PRO._t3 = { e34, e35r, e36a, e36b, e311, fval, stex, S };
  void fill; void qs;
})();
