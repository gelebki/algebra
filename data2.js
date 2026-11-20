/* Lista 2 — liczby zespolone w postaci algebraicznej, trygonometria */
(function () {
  'use strict';
  const A = AQ, R = A.R, T = String.raw, Z = A.Z, Cx = A.C;
  const ev = s => A.evaluate(A.parse(s, []), {});
  const qtex = s => A.toTex(A.parse(s, []));
  const nice = z => A.niceC(z);
  const gz = z => Cx.C(z[0], z[1]);
  const exprItem = (label, expr, gk, extra = {}) => Object.assign({
    label, gk, q: T`Przedstaw w postaci algebraicznej $a+bi$: $$${qtex(expr)}$$`,
    fields: [{ label: 'z', ans: expr, restrict: ['alg'] }],
    sol: A.autoSol(expr),
  }, extra);

  /* ---------- 2.1 generatory ---------- */
  const prodSteps = (x, y) => {
    const r = Z.mul(x, y);
    return T`$${Z.ptex(...x)}${Z.ptex(...y)}=${x[0] * y[0]}${x[0] * y[1] >= 0 ? '+' : ''}${x[0] * y[1]}i${x[1] * y[0] >= 0 ? '+' : ''}${x[1] * y[0]}i${x[1] * y[1] >= 0 ? '+' : ''}${x[1] * y[1]}i^2=${Z.tex(...r)}$`;
  };
  function gen21(gk) {
    if (gk === 'prod') {
      const x = Z.rnd(4), y = Z.rnd(4), u = Z.rnd(4), v = Z.rnd(4); const s = R.pick(['+', '-']);
      const expr = `${Z.pstr(...x)}${Z.pstr(...y)}${s}${Z.pstr(...u)}${Z.pstr(...v)}`;
      const p1 = Z.mul(x, y), p2 = Z.mul(u, v), r = s === '+' ? Z.add(p1, p2) : Z.sub(p1, p2);
      return Object.assign(exprItem('', expr), { steps: ['Mnożymy jak wielomiany i używamy $i^2=-1$:', prodSteps(x, y), prodSteps(u, v), T`$${Z.ptex(...p1)}${s}${Z.ptex(...p2)}=${Z.tex(...r)}$`] });
    }
    if (gk === 'cube') {
      const a = R.int(1, 3), b = R.nz(-3, 3), s = R.pick(['+', '-']);
      const expr = `(${Z.str(a, b)})^3${s}(${Z.str(a, -b)})^3`;
      const c1 = [a ** 3 - 3 * a * b * b, 3 * a * a * b - b ** 3];
      return Object.assign(exprItem('', expr), { steps: [T`$(a+bi)^3=a^3+3a^2bi+3a(bi)^2+(bi)^3=(a^3-3ab^2)+(3a^2b-b^3)i$.`, T`$(${Z.tex(a, b)})^3=${Z.tex(...c1)}$, a $(${Z.tex(a, -b)})^3=\overline{(${Z.tex(a, b)})^3}=${Z.tex(c1[0], -c1[1])}$.`, s === '+' ? T`Suma liczby i jej sprzężenia: $2\operatorname{Re}=${2 * c1[0]}$.` : T`Różnica liczby i jej sprzężenia: $2i\operatorname{Im}=${Z.tex(0, 2 * c1[1])}$.`] });
    }
    if (gk === 'quot') {
      const d = Z.rnd(3), u = Z.rnd(3), v = Z.rnd(3); const sq = Math.random() < 0.35;
      let expr, w;
      if (sq) { const N = Z.mul(Z.mul(d, d), u); expr = `${Z.pstr(...N)}/(${Z.str(...d)})^2`; w = u; }
      else { const du = Z.mul(d, u); expr = `(${Z.pstr(...du)}${Z.pstr(...v)})/(${Z.str(...d)})`; w = Z.mul(u, v); }
      const den = sq ? Z.mul(d, d) : d;
      return Object.assign(exprItem('', expr), { steps: [sq ? T`Mianownik: $${Z.ptex(...d)}^2=${Z.tex(...den)}$.` : prodSteps(Z.mul(d, u), v), T`Mnożymy licznik i mianownik przez sprzężenie mianownika $${Z.tex(den[0], -den[1])}$; w mianowniku dostajemy $|${Z.tex(...den)}|^2=${Z.n2(den)}$.`, T`Wynik: $${Z.tex(...w)}$.`] });
    }
    if (gk === 'powq') {
      const a = R.int(3, 7), b = R.int(2, 5);
      const expr = `(1+i)^${a}/(1-i)^${b}`;
      return Object.assign(exprItem('', expr), { steps: [T`$(1+i)^2=2i$, $(1-i)^2=-2i$, oraz $\frac{1+i}{1-i}=i$.`, T`$\frac{(1+i)^{${a}}}{(1-i)^{${b}}}=\left(\frac{1+i}{1-i}\right)^{${b}}(1+i)^{${a - b}}=i^{${b}}(1+i)^{${a - b}}$.`, T`Wynik: $${nice(ev(expr))}$.`] });
    }
    if (gk === 'unit') {
      const opt = R.pick([['-1/2+√3/2i', '\\frac{2\\pi}{3}', 3], ['1/2+√3/2i', '\\frac{\\pi}{3}', 6], ['√2/2-√2/2i', '-\\frac{\\pi}{4}', 8], ['√3/2+1/2i', '\\frac{\\pi}{6}', 12], ['-√2/2+√2/2i', '\\frac{3\\pi}{4}', 8]]);
      const k = R.pick([2, 3, 4, 6].filter(x => x !== opt[2] || true));
      const expr = `(${opt[0]})^${k}`;
      return Object.assign(exprItem('', expr), { steps: [T`Liczba $${qtex(opt[0])}$ ma moduł $1$ i argument $${opt[1]}$.`, T`Podnosząc do potęgi $${k}$ mnożymy argument przez $${k}$ (albo liczymy $(a+bi)^2$ i dalej mnożymy).`, T`Wynik: $${nice(ev(expr))}$.`] });
    }
    // mixed
    const x = Z.rnd(3), d = Z.rnd(3), w = Z.rnd(3); const num = Z.mul(d, w);
    const expr = `${Z.pstr(...x)}i+(${Z.str(...num)})/(${Z.str(...d)})`;
    return Object.assign(exprItem('', expr), { steps: [T`$${Z.ptex(...x)}i=${Z.tex(-x[1], x[0])}$.`, T`$\frac{${Z.tex(...num)}}{${Z.tex(...d)}}=\frac{(${Z.tex(...num)})(${Z.tex(d[0], -d[1])})}{${Z.n2(d)}}=${Z.tex(...w)}$.`, T`Suma: $${nice(ev(expr))}$.`] });
  }
  const gzToArr = z => [Math.round(z.re), Math.round(z.im)];

  /* ---------- 2.3 ---------- */
  function gen23(gk) {
    for (;;) {
      const z0 = Z.rnd(3, false);
      if (gk === 'conj') {
        const p = Z.rnd(3), r = Z.rnd(3);
        if (Z.n2(p) === Z.n2(r)) continue;
        // p * conj(z) - r(1 + i z) = C
        const C1 = Z.sub(Z.mul(p, Z.conj(z0)), Z.mul(r, Z.add([1, 0], Z.mul([0, 1], z0))));
        const ri = Z.mul(r, [0, 1]); // r*i
        // p conj z - r i z = C + r
        const rhs = Z.add(C1, r);
        return { q: T`Wyznacz wszystkie $z\in\mathbb C$: $$${Z.ptex(...p)}\overline{z}-${Z.ptex(...r)}(1+iz)=${Z.tex(...C1)}$$`, fields: [{ label: 'z', ans: Z.str(...z0), restrict: ['alg'] }],
          steps: [T`Przenosimy stałe: $${Z.ptex(...p)}\overline z${(() => { const t = Z.tex(-ri[0], -ri[1]); return /^-/.test(t) ? t : '+' + '(' + t + ')'; })()}z=${Z.tex(...rhs)}$.`,
            T`Podstawiamy $z=x+iy$, $\overline z=x-iy$ i porównujemy części rzeczywiste oraz urojone — dostajemy układ dwóch równań liniowych z niewiadomymi $x,y\in\mathbb R$.`,
            T`Rozwiązanie: $x=${z0[0]}$, $y=${z0[1]}$, czyli $z=${Z.tex(...z0)}$.`] };
      }
      const p = Z.rnd(3), q = Z.rnd(3, false), r = Z.rnd(3);
      const coef = Z.sub(Z.mul(p, [-1, 0]), Z.mul(r, [0, 1])); // -p - i r
      if (!Z.n2(coef)) continue;
      const cst = Z.add(Z.mul(p, q), r);
      const C1 = Z.add(Z.mul(coef, z0), cst);
      return { q: T`Wyznacz wszystkie $z\in\mathbb C$: $$${Z.ptex(...p)}(${Z.tex(...q)}-z)+${Z.ptex(...r)}(1-iz)=${Z.tex(...C1)}$$`, fields: [{ label: 'z', ans: Z.str(...z0), restrict: ['alg'] }],
        steps: [T`Wymnażamy: współczynnik przy $z$ to $-${Z.ptex(...p)}-${Z.ptex(...r)}i=${Z.tex(...coef)}$, wyraz wolny $${Z.ptex(...p)}${Z.ptex(...q)}+${Z.ptex(...r)}=${Z.tex(...cst)}$.`,
          T`$${Z.ptex(...coef)}z=${Z.tex(...C1)}-${Z.ptex(...cst)}=${Z.tex(...Z.sub(C1, cst))}$.`,
          T`$z=\frac{${Z.tex(...Z.sub(C1, cst))}}{${Z.tex(...coef)}}$ — mnożymy przez sprzężenie mianownika: $z=${Z.tex(...z0)}$.`] };
    }
  }

  /* ---------- 2.4 pary rzeczywiste ---------- */
  function solve2(P, Q, S) { // P x + Q y = S  (P,Q,S complex), x,y real
    const det = P.re * Q.im - Q.re * P.im;
    return [(S.re * Q.im - Q.re * S.im) / det, (P.re * S.im - S.re * P.im) / det];
  }
  const pairItem = (label, Ps, Qs, Ss, qtx) => ({
    label, gk: 'pair', q: T`Wyznacz wszystkie pary liczb rzeczywistych $x,y$: $$${qtx}$$`,
    fields: [0, 1].map(i => ({ label: i ? 'y' : 'x', ans: () => Cx.C(solve2(ev(Ps), ev(Qs), ev(Ss))[i]) })),
    sol: (() => { const P = ev(Ps), Q = ev(Qs), S0 = ev(Ss), [x, y] = solve2(P, Q, S0); const n = A.niceReal, f = t => t.replace(/\+ -/g, '- ').replace(/(^|[^0-9])1([xy])/g, '$1$2');
      return [T`Najpierw zapisujemy współczynniki w postaci $a+bi$: przy $x$ stoi $${nice(P)}$, przy $y$ stoi $${nice(Q)}$.`,
        T`$x,y$ są rzeczywiste, więc lewa strona to $\left(${f(n(P.re) + 'x + ' + n(Q.re) + 'y')}\right)+\left(${f(n(P.im) + 'x + ' + n(Q.im) + 'y')}\right)i$.`,
        T`Dwie liczby zespolone są równe, gdy mają równe części rzeczywiste i urojone: $$\begin{cases}${f(n(P.re) + 'x + ' + n(Q.re) + 'y')}=${n(S0.re)}\\${f(n(P.im) + 'x + ' + n(Q.im) + 'y')}=${n(S0.im)}\end{cases}$$`,
        T`Rozwiązujemy układ (np. metodą podstawiania): <b>$x=${n(Math.abs(x) < 1e-12 ? 0 : x)}$, $y=${n(Math.abs(y) < 1e-12 ? 0 : y)}$</b>.`]; })(),
  });
  function gen24() {
    for (;;) {
      const P = Z.rnd(3, false), Q = Z.rnd(3, false); const x = R.nz(-4, 4), y = R.nz(-4, 4);
      if (P[0] * Q[1] - Q[0] * P[1] === 0) continue;
      const S = Z.add(Z.mul(P, [x, 0]), Z.mul(Q, [y, 0]));
      const fac = Math.random() < 0.5;
      let qtx = T`${Z.ptex(...P)}x+${Z.ptex(...Q)}y=${Z.tex(...S)}`;
      if (fac) { // ukryj P jako iloczyn
        const a = Z.rnd(2), Pp = Z.mul(a, P); if (Z.n2(a) < 2) continue; // P = Pp / a -> zapis (Pp)/(a)
        qtx = T`\frac{${Z.tex(...Pp)}}{${Z.tex(...a)}}x+${Z.ptex(...Q)}y=${Z.tex(...S)}`;
      }
      return { q: T`Wyznacz pary liczb rzeczywistych $x,y$: $$${qtx}$$`, fields: [{ label: 'x', ans: String(x) }, { label: 'y', ans: String(y) }],
        steps: [fac ? T`Najpierw upraszczamy ułamek: współczynnik przy $x$ to $${Z.tex(...P)}$.` : 'Współczynniki są już w postaci $a+bi$.', T`Część rzeczywista: $${P[0]}x+${Q[0]}y=${S[0]}$; część urojona: $${P[1]}x+${Q[1]}y=${S[1]}$.`.replace(/\+-/g, '-'), T`Rozwiązanie układu: $x=${x}$, $y=${y}$.`] };
    }
  }

  /* ---------- 2.5 układy ---------- */
  function cramer(a11, a12, b1, a21, a22, b2) {
    const [A11, A12, B1, A21, A22, B2] = [a11, a12, b1, a21, a22, b2].map(ev);
    const W = Cx.sub(Cx.mul(A11, A22), Cx.mul(A12, A21));
    return [Cx.div(Cx.sub(Cx.mul(B1, A22), Cx.mul(A12, B2)), W), Cx.div(Cx.sub(Cx.mul(A11, B2), Cx.mul(B1, A21)), W)];
  }
  // Sposób 2: eliminacja — mnożymy równania przez dobrane liczby i odejmujemy, żeby zniknęła jedna niewiadoma
  function elimSteps(A11, A12, B1, A21, A22, B2) {
    if (Cx.abs(A11) < 1e-12 || Cx.abs(A21) < 1e-12) return [];
    const p = z => { const t = nice(z); return / [+-] /.test(t) || /^-/.test(t) ? '\\left(' + t + '\\right)' : t; };
    const co = (c, v, first) => { const t = nice(c); const body = t === '1' ? v : t === '-1' ? '-' + v : / [+-] /.test(t) ? '\\left(' + t + '\\right)' + v : t + v; return first || /^-/.test(body) ? body : '+' + body; };
    const L = (c1, c2, r) => co(c1, 'z_1', true) + co(c2, 'z_2') + '=' + nice(r);
    const q = z => { const t = nice(z); return / [+-] /.test(t) ? '\\left(' + t + '\\right)' : t; };
    const c12 = Cx.mul(A12, A21), c22 = Cx.mul(A22, A11), r1 = Cx.mul(B1, A21), r2 = Cx.mul(B2, A11), c11 = Cx.mul(A11, A21);
    const K = Cx.sub(c12, c22), R = Cx.sub(r1, r2), z2 = Cx.div(R, K);
    const rest = Cx.sub(B1, Cx.mul(A12, z2)), z1 = Cx.div(rest, A11);
    return [
      T`<b>Sposób 2 — eliminacja</b> (bez wzorów): pierwsze równanie mnożymy przez $${nice(A21)}$ (współczynnik przy $z_1$ w drugim), a drugie przez $${nice(A11)}$ (współczynnik przy $z_1$ w pierwszym). Wtedy przy $z_1$ w obu stoi to samo.`,
      T`$$\begin{aligned}&${L(c11, c12, r1)}\\&${L(c11, c22, r2)}\end{aligned}$$`,
      T`Odejmujemy stronami — $z_1$ znika: $\ ${co(K, 'z_2', true)}=${nice(R)}$, czyli $z_2=\frac{${nice(R)}}{${nice(K)}}=${nice(z2)}$ (dzielenie: mnożymy przez sprzężenie mianownika).`,
      T`Wstawiamy $z_2$ do pierwszego równania: $\ ${co(A11, 'z_1', true)}=${nice(B1)}-${p(A12)}\cdot${p(z2)}=${nice(rest)}$, więc $z_1=${nice(z1)}$.`,
    ];
  }
  const sysItem = (label, c, tex) => ({
    label, gk: 'sys', q: T`Rozwiąż w liczbach zespolonych: $$${tex}$$`,
    fields: [0, 1].map(i => ({ label: T`z_${i + 1}`, ans: () => cramer(...c)[i], restrict: ['alg'] })),
    sol: (() => { const [A11, A12, B1, A21, A22, B2] = c.map(ev); const W = Cx.sub(Cx.mul(A11, A22), Cx.mul(A12, A21)), W1 = Cx.sub(Cx.mul(B1, A22), Cx.mul(A12, B2)), W2 = Cx.sub(Cx.mul(A11, B2), Cx.mul(B1, A21)); const [z1, z2] = cramer(...c);
      return [T`<b>Sposób 1 — wzory Cramera.</b> Wyznacznik główny (współczynniki przy $z_1,z_2$): $W=a_{11}a_{22}-a_{12}a_{21}=${nice(W)}$. Jest różny od zera, więc układ ma dokładnie jedno rozwiązanie.`,
        T`$W_1$ — pierwszą kolumnę zastępujemy prawymi stronami: $W_1=b_1a_{22}-a_{12}b_2=${nice(W1)}$.`,
        T`$W_2$ — drugą kolumnę zastępujemy prawymi stronami: $W_2=a_{11}b_2-b_1a_{21}=${nice(W2)}$.`,
        T`<b>$z_1=\frac{W_1}{W}=${nice(z1)}$, $\ z_2=\frac{W_2}{W}=${nice(z2)}$</b> (dzielimy, mnożąc przez sprzężenie mianownika).`, ...elimSteps(A11, A12, B1, A21, A22, B2), T`<b>Odpowiedź:</b> $z_1=${nice(z1)}$, $\ z_2=${nice(z2)}$ — oba sposoby dają to samo.`]; })(),
  });
  function gen25(gk) {
    if (gk === 'sing') {
      const a1 = Z.rnd(2, false), a2 = Z.rnd(2, false), c = Z.rnd(2), b1 = Z.rnd(3, false);
      const kind = R.int(0, 1); let b2 = Z.mul(c, b1); if (kind === 0) b2 = Z.add(b2, Z.rnd(2));
      const r2 = [Z.mul(c, a1), Z.mul(c, a2)];
      const tm = (x, v, f) => { const t = Z.tex(...x); const body = (t === '1' ? '' : t === '-1' ? '-' : (x[0] && x[1] ? '(' + t + ')' : t)) + v; return f ? body : (/^-/.test(body) ? body : '+' + body); };
      return { type: 'choice', q: T`Ile rozwiązań ma układ $$\begin{cases}${tm(a1, 'z_1', 1)}${tm(a2, 'z_2')}=${Z.tex(...b1)}\\${tm(r2[0], 'z_1', 1)}${tm(r2[1], 'z_2')}=${Z.tex(...b2)}\end{cases}$$`, choice: { multi: false, opts: ['dokładnie jedno', 'brak rozwiązań (układ sprzeczny)', 'nieskończenie wiele'], correct: [kind === 0 ? 1 : 2] },
        steps: [T`$W=a_{11}a_{22}-a_{12}a_{21}=0$ — lewa strona drugiego równania to pierwsze pomnożone przez $${Z.tex(...c)}$.`, kind === 0 ? T`Prawa strona: $${Z.ptex(...c)}\cdot${Z.ptex(...b1)}=${Z.tex(...Z.mul(c, b1))}\neq${Z.tex(...b2)}$ — układ sprzeczny.` : T`Prawa strona też: $${Z.ptex(...c)}\cdot${Z.ptex(...b1)}=${Z.tex(...b2)}$ — równania są równoważne, nieskończenie wiele rozwiązań.`] };
    }
    for (;;) {
      const a = [Z.rnd(2, false), Z.rnd(2, false), Z.rnd(2, false), Z.rnd(2, false)];
      const W = Z.sub(Z.mul(a[0], a[3]), Z.mul(a[1], a[2])); if (!Z.n2(W)) continue;
      const z1 = Z.rnd(3, false), z2 = Z.rnd(3, false);
      const b1 = Z.add(Z.mul(a[0], z1), Z.mul(a[1], z2)), b2 = Z.add(Z.mul(a[2], z1), Z.mul(a[3], z2));
      const term = (c, v, first) => { const t = Z.tex(...c); if (c[0] === 0 && c[1] === 0) return ''; const body = (t === '1' ? '' : t === '-1' ? '-' : (c[0] && c[1] ? '(' + t + ')' : t)) + v; return first ? body : (/^-/.test(body) ? body : '+' + body); };
      const tex = T`\begin{cases}${term(a[0], 'z_1', 1)}${term(a[1], 'z_2')}=${Z.tex(...b1)}\\${term(a[2], 'z_1', 1)}${term(a[3], 'z_2')}=${Z.tex(...b2)}\end{cases}`;
      return { q: T`Rozwiąż w liczbach zespolonych: $$${tex}$$`, fields: [{ label: 'z_1', ans: Z.str(...z1), restrict: ['alg'] }, { label: 'z_2', ans: Z.str(...z2), restrict: ['alg'] }],
        steps: [T`<b>Sposób 1 — wzory Cramera.</b> Wyznacznik główny: $W=${Z.ptex(...a[0])}${Z.ptex(...a[3])}-${Z.ptex(...a[1])}${Z.ptex(...a[2])}=${Z.tex(...W)}$.`,
          T`$W_1=b_1a_{22}-a_{12}b_2=${Z.tex(...Z.sub(Z.mul(b1, a[3]), Z.mul(a[1], b2)))}$, $W_2=a_{11}b_2-b_1a_{21}=${Z.tex(...Z.sub(Z.mul(a[0], b2), Z.mul(b1, a[2])))}$.`,
          T`$z_1=\frac{W_1}{W}=${Z.tex(...z1)}$, $z_2=\frac{W_2}{W}=${Z.tex(...z2)}$.`, ...elimSteps(...[a[0], a[1], b1, a[2], a[3], b2].map(x => Cx.C(...x))), T`<b>Odpowiedź:</b> $z_1=${Z.tex(...z1)}$, $\ z_2=${Z.tex(...z2)}$.`] };
    }
  }

  /* ---------- 2.6 równania ---------- */
  function quadRoots(a, b, c) { // stringi
    const [Aa, B, Cc] = [a, b, c].map(ev);
    const D = Cx.sub(Cx.mul(B, B), Cx.mul(Cx.C(4), Cx.mul(Aa, Cc)));
    const s = Cx.nroot(D, 2);
    const two = Cx.mul(Cx.C(2), Aa);
    return [Cx.div(Cx.add(Cx.neg(B), s), two), Cx.div(Cx.sub(Cx.neg(B), s), two)];
  }
  const quadItem = (label, a, b, c, tex, gk = 'quad') => ({
    label, gk, q: T`Rozwiąż w $\mathbb C$: $$${tex}$$`,
    fields: [{ label: 'z', kind: 'set', ans: () => quadRoots(a, b, c), restrict: ['alg'] }], keys: [';'],
    sol: (() => { const [Aa, B, Cc] = [a, b, c].map(ev); const D = Cx.sub(Cx.mul(B, B), Cx.mul(Cx.C(4), Cx.mul(Aa, Cc))); const sD = Cx.nroot(D, 2); const [r1, r2] = quadRoots(a, b, c);
      return [T`Współczynniki: $a=${nice(Aa)}$, $b=${nice(B)}$, $c=${nice(Cc)}$. Wyróżnik: $\Delta=b^2-4ac=${nice(D)}$.`,
        Cx.isReal(D) ? T`$\Delta$ jest liczbą rzeczywistą ${D.re < 0 ? 'ujemną' : 'nieujemną'}, więc $\sqrt\Delta=${nice(sD)}$${D.re < 0 ? T` (bo $(${nice(sD)})^2=${nice(D)}$)` : ''}.` : T`Szukamy $\sqrt\Delta=x+iy$: z $(x+iy)^2=${nice(D)}$ mamy $x^2-y^2=${A.niceReal(D.re)}$, $2xy=${A.niceReal(D.im)}$, a dodatkowo $x^2+y^2=|\Delta|=${A.niceReal(Cx.abs(D))}$. Stąd $x^2=${A.niceReal((Cx.abs(D) + D.re) / 2)}$, $y^2=${A.niceReal((Cx.abs(D) - D.re) / 2)}$; znaki dobieramy tak, by $2xy=${A.niceReal(D.im)}$: $\sqrt\Delta=${nice(sD)}$.`,
        T`$z_{1,2}=\frac{-b\pm\sqrt\Delta}{2a}$: <b>$z_1=${nice(r1)}$, $z_2=${nice(r2)}$</b>.`]; })(),
  });
  function sqrtSteps(w, r) { return T`Szukamy $x+iy$: $(x+iy)^2=${Z.tex(...w)}$, czyli $x^2-y^2=${w[0]}$, $2xy=${w[1]}$; dodatkowo $x^2+y^2=|${Z.tex(...w)}|=${Math.round(Math.sqrt(Z.n2(w)))}$. Stąd $\pm(${Z.tex(...r)})$.`; }
  function gen26(gk) {
    if (gk === 'abs1') {
      const [x, y] = R.pick([[3, 4], [4, 3], [-3, 4], [5, 12], [-4, 3], [8, 6], [12, 5], [6, -8], [3, -4], [0, 2], [4, -3], [-5, 12]]);
      const r = Math.round(Math.hypot(x, y)); const c = [x + r, y];
      return { q: T`Rozwiąż w $\mathbb C$: $\;|z|+z=${Z.tex(...c)}$`, fields: [{ label: 'z', ans: Z.str(x, y), restrict: ['alg', 'noabs'] }],
        steps: [T`$z=x+iy$: $\sqrt{x^2+y^2}+x+iy=${Z.tex(...c)}$, więc $y=${y}$.`, T`$\sqrt{x^2+${y * y}}=${c[0]}-x$ $\Rightarrow$ $x^2+${y * y}=${c[0] * c[0]}-${2 * c[0]}x+x^2$.`, T`$x=\frac{${c[0] * c[0] - y * y}}{${2 * c[0]}}=${x}$ (i $${c[0]}-x\ge0$ ✓). Zatem $z=${Z.tex(x, y)}$.`] };
    }
    if (gk === 'abs2') {
      const [x, y] = R.pick([[4, -3], [3, -4], [-4, -3], [6, -8], [8, -6], [0, -2], [-3, -4], [5, -12], [12, -5]]);
      const r = Math.round(Math.hypot(x, y)); const c = [r - 2 * y, 2 * x]; // |z|+2iz
      const sols = (() => { const X = c[1] / 2, a = c[0]; const D = 16 * a * a - 12 * (a * a - X * X); const out = []; if (D < 0) return out; for (const s of [1, -1]) { const Y = (-4 * a + s * Math.sqrt(D)) / 6; if (a + 2 * Y >= -1e-9) out.push(Cx.C(X, Y)); } return out.filter((v, i, arr) => arr.findIndex(w => A.close(v, w)) === i); })();
      return { q: T`Rozwiąż w $\mathbb C$: $\;|z|+2iz=${Z.tex(...c)}$.`, fields: [{ label: 'z', kind: 'set', ans: () => sols, restrict: ['alg', 'noabs'] }], keys: [';'],
        steps: [T`$z=x+iy$: $2iz=2ix-2y$, więc część urojona: $2x=${c[1]}$, $x=${c[1] / 2}$.`, T`Część rzeczywista: $\sqrt{x^2+y^2}=${c[0]}+2y$. Podnosimy do kwadratu i rozwiązujemy równanie kwadratowe na $y$.`, T`Odrzucamy rozwiązania z $${c[0]}+2y<0$ (pierwiastek jest nieujemny!). Wynik: $${sols.map(nice).join(';\\ ')}$.`] };
    }
    if (gk === 'sq') {
      let r; do { r = Z.rnd(4); } while (!r[0] || Math.abs(r[0]) === Math.abs(r[1])); const w = Z.mul(r, r);
      return { q: T`Rozwiąż w $\mathbb C$: $\;z^2=${Z.tex(...w)}$`, fields: [{ label: 'z', kind: 'set', ans: [Z.str(...r), Z.str(-r[0], -r[1])], restrict: ['alg'] }], keys: [';'],
        steps: [sqrtSteps(w, r), T`Rozwiązania: $z=${Z.tex(...r)}$ oraz $z=${Z.tex(-r[0], -r[1])}$.`] };
    }
    if (gk === 'biq') {
      const s1 = Z.rnd(2), s2 = R.pick([[1, 0], [0, 1], [2, 0], [1, 1], [0, 2]]);
      const w1 = Z.mul(s1, s1), w2 = Z.mul(s2, s2); const B = Z.add(w1, w2), Cc = Z.mul(w1, w2);
      if (A.close(gz(w1), gz(w2))) return gen26('biq');
      const tex = T`z^4-${Z.ptex(...B)}z^2+${Z.ptex(...Cc)}=0`.replace('-(-', '+(').replace(/\+\(-/g, '-(').replace(/\+-/g, '-').replace(/--/g, '+').replace(/\(([0-9]+)\)/g, '$1').replace(/-0z\^2/, '').replace(/\+0=/, '=');
      return { q: T`Rozwiąż w $\mathbb C$: $$${tex}$$`, fields: [{ label: 'z', kind: 'set', ans: [Z.str(...s1), Z.str(-s1[0], -s1[1]), Z.str(...s2), Z.str(-s2[0], -s2[1])], restrict: ['alg'] }], keys: [';'],
        steps: [T`Podstawiamy $w=z^2$: $w^2-${Z.ptex(...B)}w+${Z.ptex(...Cc)}=0$, skąd $w_1=${Z.tex(...w1)}$, $w_2=${Z.tex(...w2)}$.`, T`$z^2=${Z.tex(...w1)}\Rightarrow z=\pm(${Z.tex(...s1)})$; $z^2=${Z.tex(...w2)}\Rightarrow z=\pm(${Z.tex(...s2)})$.`] };
    }
    // quad / quadLead
    const lead = gk === 'quadLead' ? R.pick([[1, 1], [1, -1], [0, 1], [2, 0]]) : [1, 0];
    const r1 = Z.rnd(4, false), r2 = Z.rnd(4, false);
    if (A.close(gz(r1), gz(r2))) return gen26(gk);
    const B = Z.mul(lead, Z.add(r1, r2)), Cc = Z.mul(lead, Z.mul(r1, r2));
    const lt = lead[0] === 1 && lead[1] === 0 ? '' : Z.ptex(...lead);
    let tex = T`${lt}z^2-${Z.ptex(...B)}z+${Z.ptex(...Cc)}=0`.replace(/-\(-/g, '+(').replace(/\+\(-/g, '-(').replace(/\+-/g, '-').replace(/--/g, '+').replace(/\(([0-9]+)\)/g, '$1').replace(/-0z/, '').replace(/\+0=/, '=');
    const D = Z.sub(Z.mul(B, B), Z.mul([4, 0], Z.mul(lead, Cc)));
    const sD = Z.mul(lead, Z.sub(r1, r2));
    return { q: T`Rozwiąż w $\mathbb C$: $$${tex}$$`, fields: [{ label: 'z', kind: 'set', ans: [Z.str(...r1), Z.str(...r2)], restrict: ['alg'] }], keys: [';'],
      steps: [T`$\Delta=b^2-4ac=${Z.tex(...D)}$.`, T`$\sqrt\Delta$: szukamy $(x+iy)^2=${Z.tex(...D)}$ — układ $x^2-y^2=${D[0]}$, $2xy=${D[1]}$, $x^2+y^2=${Math.round(Math.sqrt(Z.n2(D)))}$. Jedna z wartości: $${Z.tex(...sD)}$.`, T`$z_{1,2}=\frac{${Z.tex(...B)}\pm(${Z.tex(...sD)})}{${lt ? '2' + Z.ptex(...lead) : '2'}}$, czyli $z_1=${Z.tex(...r1)}$, $z_2=${Z.tex(...r2)}$.`] };
  }

  /* ---------- 2.7–2.10 ---------- */
  function gen27() {
    const z1 = Z.rnd(4, false), z2 = Z.rnd(4, false); const kind = R.int(1, 2);
    if (kind === 1) {
      const v = 2 * (Z.n2(z1) + Z.n2(z2));
      return { q: T`Dla $z_1=${Z.tex(...z1)}$, $z_2=${Z.tex(...z2)}$ oblicz $|z_1+z_2|^2+|z_1-z_2|^2$.`, fields: [{ label: 'wynik', ans: String(v), restrict: ['plain'] }],
        steps: [T`$|z_1+z_2|^2=|${Z.tex(...Z.add(z1, z2))}|^2=${Z.n2(Z.add(z1, z2))}$, $|z_1-z_2|^2=|${Z.tex(...Z.sub(z1, z2))}|^2=${Z.n2(Z.sub(z1, z2))}$.`, T`Suma: $${v}$ — zgodnie z tożsamością $2(|z_1|^2+|z_2|^2)=2(${Z.n2(z1)}+${Z.n2(z2)})$.`] };
    }
    const v = (1 + Z.n2(z1)) * (1 + Z.n2(z2));
    const w = Z.add([1, 0], Z.mul(z1, Z.conj(z2)));
    return { q: T`Dla $z_1=${Z.tex(...z1)}$, $z_2=${Z.tex(...z2)}$ oblicz $|1+z_1\overline{z_2}|^2+|z_1-z_2|^2$.`, fields: [{ label: 'wynik', ans: String(v), restrict: ['plain'] }],
      steps: [T`$1+z_1\overline{z_2}=${Z.tex(...w)}$, $|\cdot|^2=${Z.n2(w)}$; $|z_1-z_2|^2=${Z.n2(Z.sub(z1, z2))}$.`, T`Suma $=${v}=(1+${Z.n2(z1)})(1+${Z.n2(z2)})$.`] };
  }
  const proof71 = { steps: [
    T`Korzystamy z $|w|^2=w\overline w$ oraz $\overline{z_1\pm z_2}=\overline{z_1}\pm\overline{z_2}$.`,
    T`$|z_1+z_2|^2=(z_1+z_2)(\overline{z_1}+\overline{z_2})=|z_1|^2+z_1\overline{z_2}+\overline{z_1}z_2+|z_2|^2$.`,
    T`$|z_1-z_2|^2=(z_1-z_2)(\overline{z_1}-\overline{z_2})=|z_1|^2-z_1\overline{z_2}-\overline{z_1}z_2+|z_2|^2$.`,
    T`Dodając, wyrazy mieszane się redukują: suma $=2(|z_1|^2+|z_2|^2)$. $\blacksquare$`],
    extra: [T`$|z_1+z_2|=|z_1|+|z_2|$ dla dowolnych $z_1,z_2$.`] };
  const proof72 = { steps: [
    T`$|1+z_1\overline{z_2}|^2=(1+z_1\overline{z_2})(1+\overline{z_1}z_2)=1+z_1\overline{z_2}+\overline{z_1}z_2+|z_1|^2|z_2|^2$.`,
    T`$|z_1-z_2|^2=|z_1|^2-z_1\overline{z_2}-\overline{z_1}z_2+|z_2|^2$.`,
    T`Po dodaniu wyrazy mieszane znikają: $1+|z_1|^2+|z_2|^2+|z_1|^2|z_2|^2$.`,
    T`To jest dokładnie $(1+|z_1|^2)(1+|z_2|^2)$. $\blacksquare$`], extra: [T`$\overline{z_1\overline{z_2}}=\overline{z_1}\,\overline{z_2}$.`] };
  const proof73 = { steps: [
    T`Moduł sprzężenia jest równy modułowi liczby, więc $|\overline{z_1}+\overline{z_2}-z_3|=|z_1+z_2-\overline{z_3}|$ i $|\overline{z_1}-\overline{z_2}-z_3|=|z_1-z_2-\overline{z_3}|$.`,
    T`Tożsamość 7.1 dla $w_1=z_1+z_2$, $w_2=\overline{z_3}$: składnik 1. + 2. $=2(|z_1+z_2|^2+|z_3|^2)$.`,
    T`Tożsamość 7.1 dla $w_1=z_1-z_2$, $w_2=\overline{z_3}$: składnik 3. + 4. $=2(|z_1-z_2|^2+|z_3|^2)$.`,
    T`Sumujemy i jeszcze raz stosujemy 7.1: $2\cdot2(|z_1|^2+|z_2|^2)+4|z_3|^2=4(|z_1|^2+|z_2|^2+|z_3|^2)$. $\blacksquare$`],
    extra: [T`$|z_1+z_2+\overline{z_3}|=|z_1|+|z_2|+|z_3|$.`] };
  const proof8 = { steps: [
    T`Ponieważ $|z_k|=r$, mamy $z_k\overline{z_k}=r^2$, więc $\frac{1}{z_k}=\frac{\overline{z_k}}{r^2}$ (dla $r>0$; przypadek $r=0$ jest trywialny).`,
    T`$z_1z_2+z_2z_3+z_3z_1=z_1z_2z_3\left(\frac1{z_3}+\frac1{z_1}+\frac1{z_2}\right)$.`,
    T`$=z_1z_2z_3\cdot\frac{\overline{z_1}+\overline{z_2}+\overline{z_3}}{r^2}=\frac{z_1z_2z_3}{r^2}\cdot\overline{z_1+z_2+z_3}$.`,
    T`Biorąc moduł: $\frac{r^3}{r^2}\cdot|\overline{z_1+z_2+z_3}|=r\,|z_1+z_2+z_3|$. $\blacksquare$`], extra: [T`$|z_1z_2+z_2z_3+z_3z_1|=|z_1z_2|+|z_2z_3|+|z_3z_1|=3r^2$.`] };
  function gen28() {
    const pts = [[5, 0], [-5, 0], [0, 5], [0, -5], [3, 4], [4, 3], [-3, 4], [4, -3], [-4, -3], [3, -4]];
    const [z1, z2, z3] = R.shuffle(pts).slice(0, 3);
    const s = Z.add(Z.add(Z.mul(z1, z2), Z.mul(z2, z3)), Z.mul(z3, z1)); const sum = Z.add(Z.add(z1, z2), z3);
    return { q: T`Dla $z_1=${Z.tex(...z1)}$, $z_2=${Z.tex(...z2)}$, $z_3=${Z.tex(...z3)}$ (wszystkie o module $5$) oblicz $|z_1z_2+z_2z_3+z_3z_1|$.`, fields: [{ label: 'wynik', ans: String(5 * Math.sqrt(Z.n2(sum))) }],
      steps: [T`Z tożsamości: $|z_1z_2+z_2z_3+z_3z_1|=r|z_1+z_2+z_3|$, $r=5$.`, T`$z_1+z_2+z_3=${Z.tex(...sum)}$, $|\cdot|=\sqrt{${Z.n2(sum)}}$.`, T`Wynik: $5\sqrt{${Z.n2(sum)}}=${A.niceReal(5 * Math.sqrt(Z.n2(sum)))}$ (dla sprawdzenia: $z_1z_2+z_2z_3+z_3z_1=${Z.tex(...s)}$).`] };
  }
  const sumsqItem = (label, a, b, c, d) => ({
    label, gk: 'sumsq', q: T`Liczbę $(${a}^2+${b}^2)(${c}^2+${d}^2)=${(a * a + b * b) * (c * c + d * d)}$ zapisz jako $x^2+y^2$, $x,y\in\mathbb Z$.`,
    fields: [{ label: 'x', restrict: ['int'] }, { label: 'y', restrict: ['int'] }],
    check: v => Number.isInteger(v[0].re) && Number.isInteger(v[1].re) && v[0].re ** 2 + v[1].re ** 2 === (a * a + b * b) * (c * c + d * d),
    showAns: T`np. $x=${Math.abs(a * c - b * d)},\ y=${Math.abs(a * d + b * c)}$`,
    mcCorrect: T`x=${Math.abs(a * c - b * d)},\ y=${Math.abs(a * d + b * c)}`,
    mc: [{ tex: T`x=${a * c + b * d},\ y=${a * d + b * c}`, why: T`Zły znak: $(a+bi)(c+di)=(ac-bd)+(ad+bc)i$, a nie $ac+bd$.` },
      { tex: T`x=${a * c},\ y=${b * d}`, why: 'Mnożenie „składnikami” — tak nie działa iloczyn liczb zespolonych.' },
      { tex: T`x=${a + c},\ y=${b + d}`, why: 'Dodane zamiast pomnożone.' }],
    sol: [T`$(${a}^2+${b}^2)(${c}^2+${d}^2)=|${Z.tex(a, b)}|^2|${Z.tex(c, d)}|^2=|(${Z.tex(a, b)})(${Z.tex(c, d)})|^2=|${Z.tex(...Z.mul([a, b], [c, d]))}|^2$.`, T`Zatem $x=${Math.abs(a * c - b * d)}$, $y=${Math.abs(a * d + b * c)}$.`],
  });
  const proof9 = { steps: [
    T`Niech $m=a^2+b^2$ i $n=c^2+d^2$, $a,b,c,d\in\mathbb Z$.`,
    T`Wtedy $m=|a+bi|^2$ oraz $n=|c+di|^2$.`,
    T`Moduł jest multiplikatywny: $mn=|(a+bi)(c+di)|^2$.`,
    T`$(a+bi)(c+di)=(ac-bd)+(ad+bc)i$, więc $mn=(ac-bd)^2+(ad+bc)^2$ — suma kwadratów liczb całkowitych. $\blacksquare$`], extra: [T`$mn=(a^2+c^2)(b^2+d^2)$.`] };
  function gen210() {
    const a = R.nz(-4, 4), b = R.nz(-4, 4);
    return { q: T`Jedną z wartości $\sqrt z$ jest $${Z.tex(a, b)}$. Podaj drugą wartość $\sqrt z$ oraz po jednej wartości $\sqrt{\overline z}$, $\sqrt{-z}$ i $\sqrt{-\overline z}$.`,
      fields: [{ label: T`\text{druga }\sqrt z`, ans: Z.str(-a, -b), restrict: ['alg'] }, { label: T`\sqrt{\overline z}`, kind: 'pm', ans: Z.str(a, -b), restrict: ['alg'] }, { label: T`\sqrt{-z}`, kind: 'pm', ans: Z.str(-b, a), restrict: ['alg'] }, { label: T`\sqrt{-\overline z}`, kind: 'pm', ans: Z.str(b, a), restrict: ['alg'] }],
      steps: [T`Jeśli $w^2=z$, to także $(-w)^2=z$: druga wartość to $${Z.tex(-a, -b)}$.`, T`$\overline{w}^2=\overline{w^2}=\overline z$, więc $\sqrt{\overline z}=\pm(${Z.tex(a, -b)})$.`, T`$(iw)^2=-w^2=-z$, więc $\sqrt{-z}=\pm i(${Z.tex(a, b)})=\pm(${Z.tex(-b, a)})$.`, T`$(i\overline w)^2=-\overline w^{\,2}=-\overline z$, więc $\sqrt{-\overline z}=\pm i(${Z.tex(a, -b)})=\pm(${Z.tex(b, a)})$.`] };
  }

  /* ---------- trygonometria ---------- */
  const TR = {
    sin: t => Math.sin(t), cos: t => Math.cos(t),
    tg: t => (Math.abs(Math.cos(t)) < 1e-12 ? null : Math.tan(t)),
    ctg: t => (Math.abs(Math.sin(t)) < 1e-12 ? null : Math.cos(t) / Math.sin(t)),
  };
  const FN = [['sin', '\\sin'], ['cos', '\\cos'], ['tg', '\\operatorname{tg}'], ['ctg', '\\operatorname{ctg}']];
  function trigItem(p, q, label) {
    const t = p * Math.PI / q; const at = A.angleTex(p, q);
    return {
      label: label || '$' + at + '$', gk: 'trig', q: T`Wyznacz wartości funkcji trygonometrycznych dla kąta $${at}$.`,
      fields: FN.map(([f, ft]) => { const v = TR[f](t); return { label: ft + ' ' + (at.length > 3 ? '\\left(' + at + '\\right)' : at), ans: v === null ? 'brak' : Cx.C(Math.abs(v) < 1e-12 ? 0 : v), allowBrak: true, restrict: ['notrig'] }; }),
      keys: ['brak'], sol: trigSteps(p, q),
    };
  }
  function gen212() { const q = R.pick([6, 4, 3, 2, 6, 4]); const p = R.int(-q, 3 * q); return Object.assign(trigItem(p, q), { steps: trigSteps(p, q) }); }
  function gen214() { const q = R.pick([12, 8]); let p; do { p = R.int(1, 2 * q - 1); } while (A.gcd(p, q) !== 1); return Object.assign(trigItem(p, q), { steps: trigSteps(p, q) }); }
  function trigSteps(p, q) {
    const t = p * Math.PI / q; let u = ((t % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
    const quadN = Math.min(4, Math.floor(u / (Math.PI / 2) + 1e-9) + 1), quad = ['I', 'II', 'III', 'IV'][quadN - 1];
    const ref = Math.min(u % Math.PI, Math.PI - (u % Math.PI));
    const rr = A.ratApprox(ref / Math.PI, 48) || [0, 1]; const refT = A.angleTex(rr[0], rr[1]);
    const n = A.niceReal, out = [];
    const onAxis = Math.abs(ref) < 1e-9 || Math.abs(ref - Math.PI / 2) < 1e-9;
    if (Math.abs(u - t) > 1e-9) out.push(T`Funkcje trygonometryczne powtarzają się co $2\pi$, więc zamiast $${A.angleTex(p, q)}$ bierzemy kąt $${A.niceAngle(t)}$.`);
    if (onAxis) out.push(T`Kąt $${A.niceAngle(t)}$ wyznacza punkt na osi układu: $(\cos,\sin)=(${n(Math.cos(t))},\,${n(Math.sin(t))})$ na okręgu jednostkowym.`);
    else {
      out.push(T`Kąt $${A.niceAngle(t)}$ leży w ćwiartce ${quad}. Jego kąt odniesienia (kąt ostry do osi poziomej) to $${refT}$.`);
      const den = rr[1];
      if (den === 12 || den === 8) out.push(...A.trigLines(rr[0], rr[1], new Set()));
      else out.push(T`Z tabelki dla kąta $${refT}$: $\sin${refT.length > 3 ? '' : ' '}${refT}=${n(Math.sin(ref))}$, $\ \cos ${refT}=${n(Math.cos(ref))}$.`);
      out.push(T`Znaki w ćwiartce ${quad}: $\sin$ jest ${Math.sin(t) > 0 ? 'dodatni' : 'ujemny'}, $\cos$ jest ${Math.cos(t) > 0 ? 'dodatni' : 'ujemny'}. Zatem $\sin=${n(Math.sin(t))}$, $\cos=${n(Math.cos(t))}$.`);
    }
    out.push((TR.tg(t) === null ? T`$\operatorname{tg}=\frac{\sin}{\cos}$ nie istnieje, bo $\cos=0$` : T`$\operatorname{tg}=\frac{\sin}{\cos}=${n(TR.tg(t))}$`) + '; ' + (TR.ctg(t) === null ? T`$\operatorname{ctg}=\frac{\cos}{\sin}$ nie istnieje, bo $\sin=0$.` : T`$\operatorname{ctg}=\frac{\cos}{\sin}=${n(TR.ctg(t))}$.`));
    return out;
  }
  function angleFromItem(p, q, label) {
    const t = p * Math.PI / q;
    return { label, gk: 'ang', q: T`Wyznacz miarę kąta $\alpha\in[0,2\pi)$, wiedząc, że $$\sin\alpha=${A.niceReal(Math.sin(t))},\qquad\cos\alpha=${A.niceReal(Math.cos(t))}.$$`,
      fields: [{ label: '\\alpha', kind: 'angle', ans: Cx.C(t), restrict: ['notrig'] }], keys: ['pi'], sol: angSteps(p, q) };
  }
  function angSteps(p, q) {
    const t = p * Math.PI / q, u = ((t % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI); const ref = Math.min(u % Math.PI, Math.PI - (u % Math.PI)); const rr = A.ratApprox(ref / Math.PI, 48);
    const s = Math.sin(t) > 0, c = Math.cos(t) > 0; const quad = s && c ? 'I' : s ? 'II' : !c ? 'III' : 'IV';
    return [T`Znaki: $\sin\alpha${s ? '>' : '<'}0$ i $\cos\alpha${c ? '>' : '<'}0$, więc kąt leży w ćwiartce ${quad}.`,
      T`Podwajamy kąt, żeby pozbyć się „piętrowych” pierwiastków: $\cos2\alpha=\cos^2\alpha-\sin^2\alpha=${A.niceReal(Math.cos(2 * t))}$, $\ \sin2\alpha=2\sin\alpha\cos\alpha=${A.niceReal(Math.sin(2 * t))}$.`,
      T`To wartości z tabelki: $2\alpha=${A.niceAngle(2 * t)}$ (z dokładnością do pełnych obrotów), czyli kąt odniesienia dla $\alpha$ to $${A.angleTex(rr[0], rr[1])}$.`,
      T`W ćwiartce ${quad}: <b>$\alpha=${A.niceAngle(t)}$</b>.`];
  }
  function gen215() {
    const q = R.pick([12, 8, 12]); let p; do { p = R.int(1, 2 * q - 1); } while (A.gcd(p, q) !== 1);
    const it = angleFromItem(p, q, '');
    const t = p * Math.PI / q, u = ((t % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI); const ref = Math.min(u % Math.PI, Math.PI - (u % Math.PI)); const rr = A.ratApprox(ref / Math.PI, 48);
    it.steps = angSteps(p, q); return it;
    it.steps = [T`Znaki: $\sin\alpha${Math.sin(t) > 0 ? '>' : '<'}0$, $\cos\alpha${Math.cos(t) > 0 ? '>' : '<'}0$ — wyznacza to ćwiartkę.`, T`Rozpoznajemy kąt odniesienia z wartości bezwzględnych: $${A.angleTex(rr[0], rr[1])}$ (np. przez $\cos2\alpha=\cos^2\alpha-\sin^2\alpha$, $\sin2\alpha=2\sin\alpha\cos\alpha$).`, T`Wynik: $\alpha=${A.niceAngle(t)}$.`];
    return it;
  }

  const SAMP2 = [{ alpha: 0.41, beta: 0.23 }, { alpha: 1.07, beta: 0.31 }, { alpha: 0.77, beta: -0.52 }, { alpha: 2.3, beta: 0.9 }];
  const idf = (label, ans) => ({ label, ans, vars: ['alpha', 'beta'], samples: SAMP2, restrict: ['trig'] });
  function gen213() {
    const pairs = [[1, 4, 1, 6, '+'], [1, 3, 1, 4, '+'], [1, 4, 1, 6, '-'], [1, 3, 1, 4, '-'], [2, 3, 1, 4, '+'], [1, 2, 1, 6, '+'], [3, 4, 1, 6, '+'], [1, 3, 1, 4, '+']];
    const [p1, q1, p2, q2, s] = R.pick(pairs); const f = R.pick(['sin', 'cos', 'tg']);
    const t = p1 * Math.PI / q1 + (s === '+' ? 1 : -1) * p2 * Math.PI / q2; const v = f === 'sin' ? Math.sin(t) : f === 'cos' ? Math.cos(t) : Math.tan(t);
    const r = A.ratApprox(t / Math.PI, 48); const ft = f === 'tg' ? '\\operatorname{tg}' : '\\' + f;
    return { q: T`Korzystając ze wzoru na ${f} ${s === '+' ? 'sumy' : 'różnicy'}, oblicz $${ft}\left(${A.angleTex(r[0], r[1])}\right)=${ft}\left(${A.angleTex(p1, q1)}${s}${A.angleTex(p2, q2)}\right)$.`,
      fields: [{ label: ft + '\\left(' + A.angleTex(r[0], r[1]) + '\\right)', ans: Cx.C(v), restrict: ['notrig'] }],
      steps: [f === 'sin' ? T`$\sin(\alpha\pm\beta)=\sin\alpha\cos\beta\pm\cos\alpha\sin\beta$.` : f === 'cos' ? T`$\cos(\alpha\pm\beta)=\cos\alpha\cos\beta\mp\sin\alpha\sin\beta$.` : T`$\operatorname{tg}(\alpha\pm\beta)=\frac{\operatorname{tg}\alpha\pm\operatorname{tg}\beta}{1\mp\operatorname{tg}\alpha\operatorname{tg}\beta}$.`,
        T`Wstawiamy wartości dla $${A.angleTex(p1, q1)}$ i $${A.angleTex(p2, q2)}$.`, T`Wynik: $${A.niceReal(v)}$.`] };
  }

  const L2 = [];
  A.addList({
    num: 2, id: 'l2', title: 'Lista 2', name: 'Liczby zespolone i trygonometria', hue: 'l2',
    blurb: 'Postać algebraiczna $a+bi$, równania i układy w $\\mathbb C$, moduł i sprzężenie, wartości funkcji trygonometrycznych.',
    tasks: [
      {
        id: '2.1', name: 'Postać algebraiczna', statement: 'Następujące liczby zespolone przedstawić w postaci algebraicznej $a+bi$.',
        wzory: [T`$i^2=-1$, $i^3=-i$, $i^4=1$.`, T`$(a+bi)(c+di)=(ac-bd)+(ad+bc)i$.`, T`$\frac{a+bi}{c+di}=\frac{(a+bi)(c-di)}{c^2+d^2}$ — mnożymy przez sprzężenie mianownika.`, T`$(a+bi)^3=(a^3-3ab^2)+(3a^2b-b^3)i$.`, T`$z+\overline z=2\operatorname{Re}z$, $z-\overline z=2i\operatorname{Im}z$.`, T`$(1+i)^2=2i$, $\frac{1+i}{1-i}=i$.`],
        gen: gen21,
        items: [
          ['1.1', '(2+i)(4-i)+(1+2i)(3+4i)', 'prod'], ['1.2', '(2+i)(3-i)+(2+3i)(3+4i)', 'prod'], ['1.3', '(2+i)(3+7i)-(1+2i)(5+3i)', 'prod'], ['1.4', '(4+i)(5+3i)-(3+i)(3-i)', 'prod'],
          ['1.5', '(2+i)^3+(2-i)^3', 'cube'], ['1.6', '(3+i)^3-(3-i)^3', 'cube'], ['1.7', '((5+i)(7-6i))/(3+i)', 'quot'], ['1.8', '((5+i)(3+5i))/(2i)', 'quot'],
          ['1.9', '((1+3i)(8-i))/(2+i)^2', 'quot'], ['1.10', '((2+i)(4+i))/(1+i)', 'quot'], ['1.11', '((3-i)(1-4i))/(2-i)', 'quot'], ['1.12', '(1+i)^5/(1-i)^3', 'powq'],
          ['1.13', '(1+2i)i+(2+3i)/(1-4i)', 'mixed'], ['1.14', '(√2/2+√2/2i)^3', 'unit'], ['1.15', '(-1/2+√3/2i)^3', 'unit'], ['1.16', '(-1/2-√3/2i)^3', 'unit'],
        ].map(([l, e, g]) => exprItem(l, e, g)),
      },
      {
        id: '2.2', name: 'Potęgi $(1+i)$', statement: T`Udowodnić, że dla dowolnej liczby całkowitej $n$: $(1+i)^{8n}=2^{4n}$ oraz $(1+i)^{4n}=(-1)^n2^{2n}$.`,
        wzory: [T`$(1+i)^2=1+2i+i^2=2i$.`, T`$(ab)^n=a^nb^n$, $(a^m)^n=a^{mn}$ — także dla $n<0$ (w ciele).`, T`$(2i)^2=-4$, $(-4)^2=16$.`],
        gen: () => { const k = R.int(3, 12), s = R.pick([1, -1]); const e = `(1${s > 0 ? '+' : '-'}i)^${k}`; return Object.assign(exprItem('', e, 'pow'), { steps: [T`$(1${s > 0 ? '+' : '-'}i)^2=${s > 0 ? '2i' : '-2i'}$.`, T`$(1${s > 0 ? '+' : '-'}i)^{${k}}=\left(${s > 0 ? '2i' : '-2i'}\right)^{${Math.floor(k / 2)}}${k % 2 ? '(1' + (s > 0 ? '+' : '-') + 'i)' : ''}$.`, T`Wynik: $${nice(ev(e))}$.`] }); },
        items: [
          exprItem('(1+i)²', '(1+i)^2', 'pow'), exprItem('(1+i)⁴', '(1+i)^4', 'pow'), exprItem('(1+i)⁸', '(1+i)^8', 'pow'),
          { label: '2.1', type: 'order', gk: 'pow', q: T`Ułóż dowód: $(1+i)^{8n}=2^{4n}$ dla $n\in\mathbb Z$.`, order: { steps: [T`$(1+i)^2=1+2i+i^2=2i$.`, T`$(1+i)^4=(2i)^2=-4$.`, T`$(1+i)^8=(-4)^2=16=2^4$.`, T`Zatem $(1+i)^{8n}=\left((1+i)^8\right)^n=(2^4)^n=2^{4n}$ (dla $n<0$ też, bo $1+i\neq0$). $\blacksquare$`], extra: [T`$(1+i)^8=1+i^8=2$.`] } },
          { label: '2.2', type: 'order', gk: 'pow', q: T`Ułóż dowód: $(1+i)^{4n}=(-1)^n2^{2n}$ dla $n\in\mathbb Z$.`, order: { steps: [T`$(1+i)^2=2i$.`, T`$(1+i)^4=(2i)^2=4i^2=-4$.`, T`$(1+i)^{4n}=(-4)^n=(-1)^n4^n=(-1)^n2^{2n}$. $\blacksquare$`], extra: [T`$(1+i)^4=4$, bo $|1+i|^4=4$.`] } },
        ],
      },
      {
        id: '2.3', name: 'Równania liniowe w $\\mathbb C$', statement: 'Wyznaczyć wszystkie liczby zespolone $z$ spełniające równanie.',
        wzory: [T`Równanie $az=b$ ($a\neq0$) ma jedno rozwiązanie $z=\frac ba$.`, T`Gdy występuje $\overline z$: podstaw $z=x+iy$ i porównaj części rzeczywiste i urojone.`, T`$\overline{z_1z_2}=\overline{z_1}\,\overline{z_2}$, $\overline{z_1+z_2}=\overline{z_1}+\overline{z_2}$.`],
        gen: gen23,
        items: [
          { label: '3.1', gk: 'lin', q: T`$$(1+2i)(i-z)+(3-4i)(1-iz)=1+7i$$`, fields: [{ label: 'z', ans: '-1-i', restrict: ['alg'] }], sol: [T`Współczynnik przy $z$: $-(1+2i)-i(3-4i)=-5-5i$; wyraz wolny: $(1+2i)i+3-4i=1-3i$.`, T`$(-5-5i)z=10i\Rightarrow z=-1-i$.`] },
          { label: '3.2', gk: 'conj', q: T`$$(1-2i)\overline{z}-(3+2i)(1+iz)=5-2i$$`, fields: [{ label: 'z', ans: '1+5i', restrict: ['alg'] }], sol: [T`$(1-2i)\overline z+(2-3i)z=8$. Dla $z=x+iy$: $3x+y=8$, $-5x+y=0$.`, T`$x=1$, $y=5$: $z=1+5i$.`] },
          { label: '3.3', gk: 'lin', q: T`$$\begin{wrap}&\frac{(5-i)\overline{(7-6i)}z}{3-i}+\frac{-(1+3i)\overline{(8+i)}z}{(2+i)^2}\\&\qquad=\left(\frac{(8+i)(1-2i)}{2-3i}\right)^2\end{wrap}$$`, fields: [{ label: 'z', ans: () => { const a = ev('(5-i)(7+6i)/(3-i)'), b = ev('-(1+3i)(8-i)/(2+i)^2'), c = ev('((8+i)(1-2i)/(2-3i))^2'); return Cx.div(c, Cx.add(a, b)); }, restrict: ['alg'] }], sol: [T`Upraszczamy każdy współczynnik osobno: $\frac{(5-i)(7+6i)}{3-i}$, $\frac{-(1+3i)(8-i)}{(2+i)^2}$ oraz prawą stronę; potem $z=\frac{\text{prawa}}{\text{suma współczynników}}$.`] },
        ],
      },
      {
        id: '2.4', name: 'Pary liczb rzeczywistych', statement: 'Wyznaczyć wszystkie pary liczb rzeczywistych $x$ i $y$ spełniające równanie.',
        wzory: [T`Dla $x,y\in\mathbb R$: $(a+bi)x+(c+di)y=e+fi$ $\iff$ $\begin{cases}ax+cy=e\\bx+dy=f\end{cases}$.`, T`Najpierw sprowadź współczynniki do postaci $a+bi$.`],
        gen: gen24,
        items: [
          pairItem('4.1', '2+i', '1+2i', '1-4i', T`(2+i)x+(1+2i)y=1-4i`),
          pairItem('4.2', '3+2i', '1+3i', '4-9i', T`(3+2i)x+(1+3i)y=4-9i`),
          pairItem('4.3', '(1-i)(2+i)', '2(2-i)^2', '-6+8i', T`(1-i)(2+i)x+2(2-i)^2y=-6+8i`),
          pairItem('4.4', '2(3-i)(2+3i)', '(1-i)^2', '18+8i', T`2(3-i)(2+3i)x+(1-i)^2y=18+8i`),
          pairItem('4.5', '(2+i)/(3-i)', '((4-i)/(1-3i))^2', '1+i', T`\left(\frac{2+i}{3-i}\right)x+\left(\frac{4-i}{1-3i}\right)^2y=1+i`),
        ],
      },
      {
        id: '2.5', name: 'Układy równań w $\\mathbb C$', statement: 'W liczbach zespolonych rozwiązać układy równań.',
        wzory: [T`Wzory Cramera: $W=\begin{vmatrix}a_{11}&a_{12}\\a_{21}&a_{22}\end{vmatrix}$, $z_1=\frac{W_1}{W}$, $z_2=\frac{W_2}{W}$ (w $W_k$ zastępujemy $k$-tą kolumnę prawą stroną).`, T`Alternatywnie: eliminacja — mnożymy równania przez liczby zespolone i odejmujemy.`],
        gen: gen25,
        items: [
          sysItem('5.1', ['1+i', '1-i', '1+i', '1-i', '1+i', '1+3i'], T`\begin{cases}(1+i)z_1+(1-i)z_2=1+i\\(1-i)z_1+(1+i)z_2=1+3i\end{cases}`),
          sysItem('5.2', ['i', '1+i', '2+2i', '2i', '3+2i', '5+3i'], T`\begin{cases}iz_1+(1+i)z_2=2+2i\\2iz_1+(3+2i)z_2=5+3i\end{cases}`),
          { label: '5.3', type: 'choice', gk: 'sing', q: T`Ile rozwiązań ma układ $$\begin{cases}(1-i)z_1-3z_2=-i\\2z_1-(3+3i)z_2=3-i\end{cases}$$`, choice: { multi: false, opts: ['dokładnie jedno', 'brak rozwiązań (układ sprzeczny)', 'nieskończenie wiele'], correct: [1] }, sol: [T`$W=(1-i)(-3-3i)-(-3)\cdot2=-6+6=0$.`, T`Pierwsze równanie pomnożone przez $1+i$ daje $2z_1-(3+3i)z_2=1-i\neq3-i$ — sprzeczność.`] },
          { label: '5.4a', type: 'choice', gk: 'sing', q: T`Ile rozwiązań ma układ $$\begin{cases}2z_1-(2+i)z_2=-i\\(4-2i)z_1-5z_2=-1-2i\end{cases}$$`, choice: { multi: false, opts: ['dokładnie jedno', 'brak rozwiązań (układ sprzeczny)', 'nieskończenie wiele'], correct: [2] }, sol: [T`$W=-10+(2+i)(4-2i)=0$, a drugie równanie to pierwsze pomnożone przez $2-i$.`] },
          { label: '5.4b', gk: 'sing', keys: ['t'], q: T`Układ 5.4 ma nieskończenie wiele rozwiązań. Przyjmij $z_2=t\in\mathbb C$ i wyznacz $z_1$ w zależności od $t$: $$2z_1-(2+i)z_2=-i$$`, fields: [{ label: 'z_1', ans: '((2+i)t-i)/2', vars: ['t'], samples: [{ t: 0 }, { t: 1 }, { t: { re: 0.3, im: -1.2 } }] }], sol: [T`$z_1=\frac{(2+i)t-i}{2}=\left(1+\frac i2\right)t-\frac i2$, $z_2=t$.`] },
        ],
      },
      {
        id: '2.6', name: 'Równania w $\\mathbb C$', statement: 'W liczbach zespolonych rozwiązać równania.',
        wzory: [T`$|z|=\sqrt{x^2+y^2}$ dla $z=x+iy$.`, T`$\sqrt{a+bi}$: $(x+iy)^2=a+bi\iff x^2-y^2=a,\ 2xy=b$; pomocniczo $x^2+y^2=\sqrt{a^2+b^2}$.`, T`$az^2+bz+c=0$: $\Delta=b^2-4ac$, $z=\frac{-b\pm\sqrt\Delta}{2a}$ (w $\mathbb C$ zawsze działa!).`, T`Równanie dwukwadratowe: podstaw $w=z^2$.`],
        gen: gen26,
        items: [
          { label: '6.1', gk: 'abs1', q: T`$$|z|+z=2+i$$`, fields: [{ label: 'z', kind: 'set', ans: ['3/4+i'], restrict: ['alg', 'noabs'] }], keys: [';'], sol: [T`$y=1$, $\sqrt{x^2+1}=2-x\Rightarrow x=\frac34$.`] },
          { label: '6.2', gk: 'abs2', q: T`$$|z|+2iz=11+8i$$`, fields: [{ label: 'z', kind: 'set', ans: ['4-3i'], restrict: ['alg', 'noabs'] }], keys: [';'], mc: [
            { tex: T`4-3i,\ \ 4-\tfrac{35}{3}i`, why: 'Nie odrzucono pierwiastka, dla którego $11+2y<0$ (moduł jest nieujemny).' },
            { tex: T`4+3i`, why: T`Zły znak: $2i\cdot iy=-2y$.` },
            { tex: T`-3+4i`, why: 'Zamienione części rzeczywista i urojona.' }], mcCorrect: '4 - 3i', sol: [T`$2x=8\Rightarrow x=4$; $\sqrt{16+y^2}=11+2y\Rightarrow3y^2+44y+105=0$, $y\in\{-3,-\frac{35}3\}$.`, T`Tylko $y=-3$ daje $11+2y\ge0$: $z=4-3i$.`] },
          { label: '6.3', gk: 'sq', q: T`$$z^2=3-4i$$`, fields: [{ label: 'z', kind: 'set', ans: ['2-i', '-2+i'], restrict: ['alg'] }], keys: [';'], sol: [sqrtSteps([3, -4], [2, -1])] },
          { label: '6.4', gk: 'sq', q: T`$$z^2=5-12i$$`, fields: [{ label: 'z', kind: 'set', ans: ['3-2i', '-3+2i'], restrict: ['alg'] }], keys: [';'], sol: [sqrtSteps([5, -12], [3, -2])] },
          quadItem('6.5', '1', '-4', '5', T`z^2-4z+5=0`),
          { label: '6.6', gk: 'biq', q: T`$$z^4-4z^2+5=0$$`, fields: [{ label: 'z', kind: 'set', ans: () => [...Cx.allRoots(Cx.C(2, 1), 2), ...Cx.allRoots(Cx.C(2, -1), 2)], restrict: ['alg'], show: T`\pm\left(\sqrt{\tfrac{\sqrt5+2}{2}}+i\sqrt{\tfrac{\sqrt5-2}{2}}\right),\quad \pm\left(\sqrt{\tfrac{\sqrt5+2}{2}}-i\sqrt{\tfrac{\sqrt5-2}{2}}\right)` }], keys: [';'], mc: [
            { tex: T`\pm\sqrt{2+i},\ \text{i nic więcej}`, why: 'Zgubione rozwiązania z $z^2=2-i$.' },
            { tex: T`\pm\left(\sqrt{\tfrac{\sqrt5-2}{2}}\pm i\sqrt{\tfrac{\sqrt5+2}{2}}\right)`, why: T`Zamienione $x^2$ i $y^2$: część rzeczywista to $\sqrt{\frac{\sqrt5+2}{2}}$.` },
            { tex: T`\pm\sqrt{2},\ \pm i\sqrt{2}`, why: T`Potraktowano $w=2\pm i$ jak $w=2$ — zgubiona część urojona.` }], sol: [T`$w=z^2$: $w^2-4w+5=0$, $w=2\pm i$.`, T`$\sqrt{2+i}$: $x^2-y^2=2$, $x^2+y^2=\sqrt5$, więc $x^2=\frac{\sqrt5+2}{2}$, $y^2=\frac{\sqrt5-2}{2}$, $xy>0$.`] },
          quadItem('6.7', '1', '-5', '4+10i', T`z^2-5z+4+10i=0`),
          quadItem('6.8', '1', '-2', '1-2i', T`z^2-2z+1-2i=0`),
          quadItem('6.9', '1', '-(5+5i)', '2+11i', T`z^2-(5+5i)z+2+11i=0`),
          quadItem('6.10', '1', '-(1+i)', '6+3i', T`z^2-(1+i)z+6+3i=0`),
          quadItem('6.11', '1', '-(5+i)', '12+5i', T`z^2-(5+i)z+12+5i=0`),
          quadItem('6.12', '1', '-(3+i)', '4+3i', T`z^2-(3+i)z+4+3i=0`),
          quadItem('6.13', '1', '-8+i', '17-i', T`z^2+(-8+i)z+17-i=0`),
          quadItem('6.14', '1', '-7+2i', '13-i', T`z^2+(-7+2i)z+13-i=0`),
          quadItem('6.15', '1', '2-4i', '-(6+8i)', T`z^2+(2-4i)z-(6+8i)=0`),
          quadItem('6.16', '1+i', '-(11+3i)', '30+32i', T`(1+i)z^2-(11+3i)z+30+32i=0`, 'quadLead'),
        ],
      },
      {
        id: '2.7', name: 'Tożsamości z modułem', statement: T`Udowodnić, że dla dowolnych liczb zespolonych $z_1,z_2,z_3$: $$|z_1+z_2|^2+|z_1-z_2|^2=2\left(|z_1|^2+|z_2|^2\right)\quad(7.1)$$ $$|1+z_1\overline{z_2}|^2+|z_1-z_2|^2=\left(1+|z_1|^2\right)\left(1+|z_2|^2\right)\quad(7.2)$$ $$\begin{wrap}&|z_1+z_2+\overline{z_3}|^2+|\overline{z_1}+\overline{z_2}-z_3|^2\\&+|z_1-z_2+\overline{z_3}|^2+|\overline{z_1}-\overline{z_2}-z_3|^2\\&=4\left(|z_1|^2+|z_2|^2+|z_3|^2\right)\qquad(7.3)\end{wrap}$$`,
        wzory: [T`$|w|^2=w\overline w$.`, T`$\overline{z_1\pm z_2}=\overline{z_1}\pm\overline{z_2}$, $\overline{z_1z_2}=\overline{z_1}\,\overline{z_2}$, $\overline{\overline z}=z$.`, T`$z\overline w+\overline zw=2\operatorname{Re}(z\overline w)$ — wyrazy mieszane.`],
        gen: gen27, proof: true,
        items: [
          { label: '7.1', type: 'order', gk: 'num', q: T`Ułóż dowód tożsamości równoległoboku $|z_1+z_2|^2+|z_1-z_2|^2=2(|z_1|^2+|z_2|^2)$.`, order: proof71 },
          { label: '7.2', type: 'order', gk: 'num', q: T`Ułóż dowód: $|1+z_1\overline{z_2}|^2+|z_1-z_2|^2=(1+|z_1|^2)(1+|z_2|^2)$.`, order: proof72 },
          { label: '7.3 liczbowo', gk: 'num', q: T`Sprawdź tożsamość 7.3 liczbowo: dla $z_1=1$, $z_2=i$, $z_3=1+i$ oblicz $$\begin{wrap}&|z_1+z_2+\overline{z_3}|^2+|\overline{z_1}+\overline{z_2}-z_3|^2\\&+|z_1-z_2+\overline{z_3}|^2+|\overline{z_1}-\overline{z_2}-z_3|^2\end{wrap}$$`, fields: [{ label: 'wynik', ans: '16', restrict: ['plain'] }], sol: [T`$\overline{z_3}=1-i$: składniki to $|2|^2=4$, $|-2i|^2=4$, $|2-2i|^2=8$, $|0|^2=0$.`, T`Suma $16=4(1+1+2)$ ✓.`] },
          { label: '7.3', type: 'order', gk: 'num', q: T`Ułóż dowód tożsamości 7.3: $$\begin{wrap}&|z_1+z_2+\overline{z_3}|^2+|\overline{z_1}+\overline{z_2}-z_3|^2\\&+|z_1-z_2+\overline{z_3}|^2+|\overline{z_1}-\overline{z_2}-z_3|^2\\&=4\left(|z_1|^2+|z_2|^2+|z_3|^2\right)\end{wrap}$$`, order: proof73 },
          { label: '7.1 liczbowo', gk: 'num', q: T`Dla $z_1=2+i$, $z_2=1-3i$ oblicz $|z_1+z_2|^2+|z_1-z_2|^2$.`, fields: [{ label: 'wynik', ans: '30', restrict: ['plain'] }], sol: [T`$|3-2i|^2+|1+4i|^2=13+17=30=2(5+10)$.`] },
        ],
      },
      {
        id: '2.8', name: 'Liczby o równych modułach', statement: T`Jeżeli $|z_1|=|z_2|=|z_3|=r$, to $|z_1z_2+z_2z_3+z_3z_1|=r|z_1+z_2+z_3|$.`,
        wzory: [T`Dla $|z|=r>0$: $\frac1z=\frac{\overline z}{r^2}$.`, T`$|z_1z_2|=|z_1||z_2|$, $|\overline w|=|w|$.`, T`Wyciągnij $z_1z_2z_3$ przed nawias.`],
        gen: gen28, proof: true,
        items: [
          { label: 'dowód', type: 'order', gk: 'num', q: 'Ułóż dowód tożsamości.', order: proof8 },
          { label: 'liczbowo', gk: 'num', q: T`Dla $z_1=1$, $z_2=i$, $z_3=-1$ oblicz $|z_1z_2+z_2z_3+z_3z_1|$.`, fields: [{ label: 'wynik', ans: '1', restrict: ['plain'] }], sol: [T`$i-i-1=-1$, moduł $1$; prawa strona: $1\cdot|i|=1$ ✓.`] },
        ],
      },
      {
        id: '2.9', name: 'Iloczyn sum dwóch kwadratów', statement: 'Korzystając z własności modułu wykazać, że iloczyn dwóch liczb całkowitych, z których każda jest sumą kwadratów dwóch liczb całkowitych, też jest sumą kwadratów dwóch liczb całkowitych.',
        wzory: [T`$a^2+b^2=|a+bi|^2$.`, T`$|z_1z_2|=|z_1|\,|z_2|$.`, T`$(a+bi)(c+di)=(ac-bd)+(ad+bc)i$ — tożsamość Brahmagupty.`],
        gen: () => { for (;;) { const [a, b, c, d] = [R.int(1, 5), R.int(1, 5), R.int(1, 6), R.int(1, 6)]; const N = (a * a + b * b) * (c * c + d * d);
          const ds = [[a * c + b * d, a * d + b * c], [a * c, b * d], [a + c, b + d]]; const key = v => Math.min(...v.map(Math.abs)) + ',' + Math.max(...v.map(Math.abs));
          if (ds.some(v => v[0] * v[0] + v[1] * v[1] === N) || new Set(ds.map(key)).size < 3 || a * c === b * d) continue;
          const it = sumsqItem('', a, b, c, d); it.steps = it.sol; return it; } },
        items: [
          { label: 'dowód', type: 'order', gk: 'n', q: 'Ułóż dowód.', order: proof9 },
          sumsqItem('1·', 1, 2, 3, 4), sumsqItem('2·', 2, 3, 1, 4),
        ],
      },
      {
        id: '2.10', name: 'Wartości pierwiastka', statement: T`Jedną z wartości $\sqrt z$ jest $a+bi$. Wyznaczyć drugą wartość $\sqrt z$ oraz wartości $\sqrt{\overline z}$, $\sqrt{-z}$, $\sqrt{-\overline z}$.`,
        wzory: [T`Jeśli $w^2=z$, to $(-w)^2=z$ — pierwiastek kwadratowy ma dwie wartości $\pm w$.`, T`$\overline{w}^{\,2}=\overline{w^2}$.`, T`$(iw)^2=-w^2$.`],
        gen: gen210,
        items: [{ label: '2.10', gk: 'n', q: T`Wartość $\sqrt z$ to $a+bi$. Podaj drugą wartość $\sqrt z$, oraz po jednej wartości $\sqrt{\overline z}$, $\sqrt{-z}$, $\sqrt{-\overline z}$.`, keys: ['a', 'b'],
          fields: [{ label: T`\text{druga }\sqrt z`, ans: '-a-bi', vars: ['a', 'b'], restrict: ['alg'] }, { label: T`\sqrt{\overline z}`, kind: 'pm', ans: 'a-bi', vars: ['a', 'b'], restrict: ['alg'] }, { label: T`\sqrt{-z}`, kind: 'pm', ans: '-b+ai', vars: ['a', 'b'], restrict: ['alg'] }, { label: T`\sqrt{-\overline z}`, kind: 'pm', ans: 'b+ai', vars: ['a', 'b'], restrict: ['alg'] }],
          sol: [T`$\pm(a+bi)$; $\sqrt{\overline z}=\pm(a-bi)$; $\sqrt{-z}=\pm i(a+bi)=\pm(-b+ai)$; $\sqrt{-\overline z}=\pm i(a-bi)=\pm(b+ai)$.`] }],
      },
      {
        id: '2.11', name: 'Stopnie i radiany', statement: 'Wyrazić w stopniach: $\\frac\\pi6,\\frac\\pi5,\\frac{3\\pi}4,\\frac{5\\pi}6,\\frac{5\\pi}4,\\frac{4\\pi}3,\\frac{11\\pi}6$. Wyrazić w radianach: $15^\\circ,20^\\circ,45^\\circ,75^\\circ,60^\\circ,90^\\circ,100^\\circ,120^\\circ,210^\\circ,300^\\circ,315^\\circ,270^\\circ$.',
        wzory: [T`$\pi\ \text{rad}=180^\circ$.`, T`$\alpha^\circ=\alpha\cdot\frac{\pi}{180}$ rad, $\ x\ \text{rad}=x\cdot\frac{180^\circ}{\pi}$.`],
        gen: () => { const deg = Math.random() < 0.5; const dd = R.shuffle([10, 18, 24, 30, 36, 40, 50, 135, 140, 150, 160, 225, 240, 330]).slice(0, 4); return deg ? { q: T`Wyraź w radianach: $$${dd.map(d => d + '^\\circ').join(',\\quad ')}$$`, keys: ['pi'], fields: dd.map(d => ({ label: d + '^\\circ', ans: d + 'pi/180', restrict: ['notrig'], show: A.angleTex(d, 180), toRad: d })), steps: [T`$1^\circ=\frac{\pi}{180}$, więc mnożymy liczbę stopni przez $\frac{\pi}{180}$ i skracamy ułamek.`, ...dd.map(d => T`$${d}^\circ=\frac{${d}\pi}{180}=${A.niceAngle(d * Math.PI / 180)}$`)] } : { q: T`Wyraź w stopniach: $$${dd.map(d => A.niceAngle(d * Math.PI / 180)).join(',\\quad ')}$$`, fields: dd.map(d => ({ label: A.niceAngle(d * Math.PI / 180), ans: String(d), restrict: ['plain'], unit: '^\\circ' })), steps: [T`$\pi$ radianów to $180^\circ$ — w miejsce $\pi$ wstawiamy $180^\circ$.`, ...dd.map(d => { const g = A.gcd(d, 180), n = d / g, q = 180 / g; return T`$${A.niceAngle(d * Math.PI / 180)}=\frac{${n === 1 ? '' : n + '\\cdot '}180^\circ}{${q}}=${d}^\circ$`; })] }; },
        items: [
          { label: '11.1', q: T`Wyraź w stopniach: $$\frac{\pi}{6},\quad \frac{\pi}{5},\quad \frac{3\pi}{4},\quad \frac{5\pi}{6},\quad \frac{5\pi}{4},\quad \frac{4\pi}{3},\quad \frac{11\pi}{6}$$`, fields: [[1, 6], [1, 5], [3, 4], [5, 6], [5, 4], [4, 3], [11, 6]].map(([p, q]) => ({ label: A.angleTex(p, q), ans: String(180 * p / q), restrict: ['plain'], unit: '^\\circ' })), sol: [T`$\pi$ radianów to $180^\circ$ — w miejsce $\pi$ wstawiamy $180^\circ$.`, T`$\frac\pi6=\frac{180^\circ}{6}=30^\circ$, $\ \frac\pi5=36^\circ$, $\ \frac{3\pi}4=3\cdot45^\circ=135^\circ$, $\ \frac{5\pi}6=150^\circ$, $\ \frac{5\pi}4=225^\circ$, $\ \frac{4\pi}3=240^\circ$, $\ \frac{11\pi}6=330^\circ$.`] },
          { label: '11.2a', q: T`Wyraź w radianach: $$15^\circ,\quad 20^\circ,\quad 45^\circ,\quad 75^\circ,\quad 60^\circ,\quad 90^\circ$$`, keys: ['pi'], fields: [15, 20, 45, 75, 60, 90].map(d => ({ label: d + '^\\circ', ans: d + 'pi/180', restrict: ['notrig'], show: A.angleTex(d, 180), toRad: d })), sol: [T`$1^\circ=\frac{\pi}{180}$, więc mnożymy liczbę stopni przez $\frac{\pi}{180}$ i skracamy ułamek.`, T`$15^\circ=\frac{15\pi}{180}=\frac{\pi}{12}$, $\ 20^\circ=\frac\pi9$, $\ 45^\circ=\frac\pi4$, $\ 75^\circ=\frac{5\pi}{12}$, $\ 60^\circ=\frac\pi3$, $\ 90^\circ=\frac\pi2$.`] },
          { label: '11.2b', q: T`Wyraź w radianach: $$100^\circ,\quad 120^\circ,\quad 210^\circ,\quad 300^\circ,\quad 315^\circ,\quad 270^\circ$$`, keys: ['pi'], fields: [100, 120, 210, 300, 315, 270].map(d => ({ label: d + '^\\circ', ans: d + 'pi/180', restrict: ['notrig'], show: A.angleTex(d, 180), toRad: d })), sol: [T`Mnożymy liczbę stopni przez $\frac{\pi}{180}$ i skracamy.`, T`$100^\circ=\frac{100\pi}{180}=\frac{5\pi}9$, $\ 120^\circ=\frac{2\pi}3$, $\ 210^\circ=\frac{7\pi}6$, $\ 300^\circ=\frac{5\pi}3$, $\ 315^\circ=\frac{7\pi}4$, $\ 270^\circ=\frac{3\pi}2$.`] },
        ],
      },
      {
        id: '2.12', name: 'Wartości funkcji trygonometrycznych', statement: 'Wyznaczyć wartości $\\sin,\\cos,\\operatorname{tg},\\operatorname{ctg}$ dla kątów $0,\\frac\\pi6,\\frac\\pi4,\\ldots,\\frac{11\\pi}6$.',
        wzory: [T`$\sin\frac\pi6=\frac12,\ \sin\frac\pi4=\frac{\sqrt2}2,\ \sin\frac\pi3=\frac{\sqrt3}2$; $\cos$ — w odwrotnej kolejności.`, T`$\sin(\pi-\alpha)=\sin\alpha$, $\cos(\pi-\alpha)=-\cos\alpha$, $\sin(\pi+\alpha)=-\sin\alpha$, $\cos(\pi+\alpha)=-\cos\alpha$.`, T`$\operatorname{tg}\alpha=\frac{\sin\alpha}{\cos\alpha}$, $\operatorname{ctg}\alpha=\frac{\cos\alpha}{\sin\alpha}$ — nieokreślone, gdy mianownik $=0$.`, T`Znaki w ćwiartkach: I — wszystkie $+$; II — $\sin$; III — $\operatorname{tg},\operatorname{ctg}$; IV — $\cos$.`],
        gen: gen212,
        items: [[0, 1], [1, 6], [1, 4], [1, 3], [1, 2], [2, 3], [3, 4], [5, 6], [1, 1], [7, 6], [5, 4], [4, 3], [3, 2], [5, 3], [7, 4], [11, 6]].map(([p, q]) => trigItem(p, q)),
      },
      {
        id: '2.13', name: 'Wzory na sumę, różnicę i wielokrotność', statement: 'Wyznaczyć funkcje sinus, cosinus, tangens oraz cotangens sumy i różnicy dwóch kątów, kąta podwojonego, połowy kąta.',
        wzory: [T`Punkt na okręgu jednostkowym: $(\cos\alpha,\sin\alpha)$. Odległość punktów dla kątów $\alpha,\beta$ równa jest odległości punktów dla $\alpha-\beta$ i $0$.`, T`Z tego: $\cos(\alpha-\beta)=\cos\alpha\cos\beta+\sin\alpha\sin\beta$.`, T`$\sin\alpha=\cos(\frac\pi2-\alpha)$, $\cos(-\beta)=\cos\beta$, $\sin(-\beta)=-\sin\beta$.`, T`$\cos2\alpha=\cos^2\alpha-\sin^2\alpha=2\cos^2\alpha-1=1-2\sin^2\alpha$.`],
        gen: gen213,
        items: [
          { label: 'sin', keys: ['alpha', 'beta', 'sin', 'cos'], q: T`Wyraź za pomocą $\sin\alpha,\cos\alpha,\sin\beta,\cos\beta$:`, fields: [idf(T`\sin(\alpha+\beta)`, 'sin(alpha)cos(beta)+cos(alpha)sin(beta)'), idf(T`\sin(\alpha-\beta)`, 'sin(alpha)cos(beta)-cos(alpha)sin(beta)')], sol: [T`Punkt wyjścia to wzór $\cos(\alpha-\beta)=\cos\alpha\cos\beta+\sin\alpha\sin\beta$ (wynika z porównania odległości punktów na okręgu jednostkowym).`, T`$\sin x=\cos\left(\frac\pi2-x\right)$, więc ze wzoru na cosinus różnicy: $$\begin{aligned}\sin(\alpha+\beta)&=\cos\left(\left(\tfrac\pi2-\alpha\right)-\beta\right)\\&=\cos\left(\tfrac\pi2-\alpha\right)\cos\beta+\sin\left(\tfrac\pi2-\alpha\right)\sin\beta\end{aligned}$$ a $\cos\left(\frac\pi2-\alpha\right)=\sin\alpha$, $\sin\left(\frac\pi2-\alpha\right)=\cos\alpha$.`, T`<b>$\sin(\alpha+\beta)=\sin\alpha\cos\beta+\cos\alpha\sin\beta$</b>.`, T`Wstawiając $-\beta$ w miejsce $\beta$ ($\cos(-\beta)=\cos\beta$, $\sin(-\beta)=-\sin\beta$): <b>$\sin(\alpha-\beta)=\sin\alpha\cos\beta-\cos\alpha\sin\beta$</b>.`] },
          { label: 'cos', keys: ['alpha', 'beta', 'sin', 'cos'], q: T`Wyraź za pomocą $\sin\alpha,\cos\alpha,\sin\beta,\cos\beta$:`, fields: [idf(T`\cos(\alpha+\beta)`, 'cos(alpha)cos(beta)-sin(alpha)sin(beta)'), idf(T`\cos(\alpha-\beta)`, 'cos(alpha)cos(beta)+sin(alpha)sin(beta)')], sol: [T`Na okręgu jednostkowym punkty $A=(\cos\alpha,\sin\alpha)$ i $B=(\cos\beta,\sin\beta)$ są od siebie tak samo odległe jak punkty $C=(\cos(\alpha-\beta),\sin(\alpha-\beta))$ i $P=(1,0)$ — to ten sam kąt $\alpha-\beta$, tylko obrócony.`, T`$|AB|^2=2-2(\cos\alpha\cos\beta+\sin\alpha\sin\beta)$, a $|CP|^2=2-2\cos(\alpha-\beta)$ (korzystamy z $\sin^2+\cos^2=1$).`, T`Porównując: <b>$\cos(\alpha-\beta)=\cos\alpha\cos\beta+\sin\alpha\sin\beta$</b>.`, T`Wstawiając $-\beta$ w miejsce $\beta$: <b>$\cos(\alpha+\beta)=\cos\alpha\cos\beta-\sin\alpha\sin\beta$</b>.`] },
          { label: 'tg', keys: ['alpha', 'beta', 'tg', 'ctg'], q: T`Wyraź za pomocą $\operatorname{tg}\alpha,\operatorname{tg}\beta$ (oraz $\operatorname{ctg}$):`, fields: [idf(T`\operatorname{tg}(\alpha+\beta)`, '(tg(alpha)+tg(beta))/(1-tg(alpha)tg(beta))'), idf(T`\operatorname{tg}(\alpha-\beta)`, '(tg(alpha)-tg(beta))/(1+tg(alpha)tg(beta))'), idf(T`\operatorname{ctg}(\alpha+\beta)`, '(ctg(alpha)ctg(beta)-1)/(ctg(alpha)+ctg(beta))')], sol: [T`$\operatorname{tg}(\alpha+\beta)=\frac{\sin(\alpha+\beta)}{\cos(\alpha+\beta)}=\frac{\sin\alpha\cos\beta+\cos\alpha\sin\beta}{\cos\alpha\cos\beta-\sin\alpha\sin\beta}$.`, T`Dzielimy licznik i mianownik przez $\cos\alpha\cos\beta$: <b>$\operatorname{tg}(\alpha+\beta)=\frac{\operatorname{tg}\alpha+\operatorname{tg}\beta}{1-\operatorname{tg}\alpha\operatorname{tg}\beta}$</b>.`, T`Dla różnicy wstawiamy $-\beta$ ($\operatorname{tg}(-\beta)=-\operatorname{tg}\beta$): <b>$\operatorname{tg}(\alpha-\beta)=\frac{\operatorname{tg}\alpha-\operatorname{tg}\beta}{1+\operatorname{tg}\alpha\operatorname{tg}\beta}$</b>.`, T`Cotangens: ten sam ułamek dzielimy przez $\sin\alpha\sin\beta$: <b>$\operatorname{ctg}(\alpha+\beta)=\frac{\operatorname{ctg}\alpha\operatorname{ctg}\beta-1}{\operatorname{ctg}\alpha+\operatorname{ctg}\beta}$</b>.`] },
          { label: '2α', keys: ['alpha', 'sin', 'cos', 'tg', 'ctg'], q: T`Kąt podwojony — wyraź przez funkcje kąta $\alpha$:`, fields: [idf(T`\sin2\alpha`, '2sin(alpha)cos(alpha)'), idf(T`\cos2\alpha`, 'cos(alpha)^2-sin(alpha)^2'), idf(T`\operatorname{tg}2\alpha`, '2tg(alpha)/(1-tg(alpha)^2)'), idf(T`\operatorname{ctg}2\alpha`, '(ctg(alpha)^2-1)/(2ctg(alpha))')], sol: [T`We wzorach na sumę wstawiamy $\beta=\alpha$.`, T`<b>$\sin2\alpha=\sin\alpha\cos\alpha+\cos\alpha\sin\alpha=2\sin\alpha\cos\alpha$</b>.`, T`<b>$\cos2\alpha=\cos^2\alpha-\sin^2\alpha$</b> (a z $\sin^2\alpha+\cos^2\alpha=1$ także $=2\cos^2\alpha-1=1-2\sin^2\alpha$).`, T`<b>$\operatorname{tg}2\alpha=\frac{2\operatorname{tg}\alpha}{1-\operatorname{tg}^2\alpha}$</b>, $\ $<b>$\operatorname{ctg}2\alpha=\frac{\operatorname{ctg}^2\alpha-1}{2\operatorname{ctg}\alpha}$</b>.`] },
          { label: 'α/2', keys: ['alpha', 'sin', 'cos'], q: T`Połowa kąta — wyraź przez $\cos\alpha$ i $\sin\alpha$:`, fields: [idf(T`\cos^2\frac\alpha2`, '(1+cos(alpha))/2'), idf(T`\sin^2\frac\alpha2`, '(1-cos(alpha))/2'), idf(T`\operatorname{tg}\frac\alpha2`, '(1-cos(alpha))/sin(alpha)')], sol: [T`$\cos^2\frac\alpha2=\frac{1+\cos\alpha}2$ z $\cos\alpha=2\cos^2\frac\alpha2-1$.`, T`$\operatorname{tg}\frac\alpha2=\frac{\sin\frac\alpha2}{\cos\frac\alpha2}=\frac{2\sin^2\frac\alpha2}{2\sin\frac\alpha2\cos\frac\alpha2}=\frac{1-\cos\alpha}{\sin\alpha}$.`] },
        ],
      },
      {
        id: '2.14', name: 'Kąty $\\frac{k\\pi}{12}$ i $\\frac{k\\pi}{8}$', statement: 'Wyznaczyć wartości $\\sin,\\cos,\\operatorname{tg},\\operatorname{ctg}$ dla kątów $\\frac\\pi{12},\\frac\\pi8,\\frac{3\\pi}8,\\ldots,\\frac{23\\pi}{12}$.',
        wzory: [T`$\frac\pi{12}=\frac\pi3-\frac\pi4$: $\sin\frac\pi{12}=\frac{\sqrt6-\sqrt2}4$, $\cos\frac\pi{12}=\frac{\sqrt6+\sqrt2}4$, $\operatorname{tg}\frac\pi{12}=2-\sqrt3$.`, T`Połowa kąta $\frac\pi4$: $\sin\frac\pi8=\frac{\sqrt{2-\sqrt2}}2$, $\cos\frac\pi8=\frac{\sqrt{2+\sqrt2}}2$, $\operatorname{tg}\frac\pi8=\sqrt2-1$.`, T`$\sin(\frac\pi2-\alpha)=\cos\alpha$ — więc $\frac{5\pi}{12}$ i $\frac{3\pi}8$ mają zamienione sin i cos.`, T`Redukcja do pierwszej ćwiartki + znak z ćwiartki.`],
        gen: gen214,
        items: [[1, 12], [1, 8], [3, 8], [5, 12], [7, 12], [5, 8], [7, 8], [11, 12], [13, 12], [9, 8], [11, 8], [17, 12], [19, 12], [13, 8], [15, 8], [23, 12]].map(([p, q]) => trigItem(p, q)),
      },
      {
        id: '2.15', name: 'Kąt z wartości sin i cos', statement: 'Wyznaczyć miarę kąta $\\alpha$, wiedząc jakie są $\\sin\\alpha$ i $\\cos\\alpha$.',
        wzory: [T`Znaki $\sin\alpha$ i $\cos\alpha$ wyznaczają ćwiartkę.`, T`$\frac{\sqrt{2-\sqrt2}}2=\sin\frac\pi8$, $\frac{\sqrt{2-\sqrt3}}2=\frac{\sqrt6-\sqrt2}4=\sin\frac\pi{12}$.`, T`Sposób z rozwiązań: $\cos2\alpha=\cos^2\alpha-\sin^2\alpha$, $\sin2\alpha=2\sin\alpha\cos\alpha$ — rozpoznaj $2\alpha$.`, T`Kąty w ćwiartkach dla kąta odniesienia $\beta$: $\beta,\ \pi-\beta,\ \pi+\beta,\ 2\pi-\beta$.`],
        gen: gen215,
        items: [[1, 8], [7, 8], [9, 8], [15, 8], [1, 12], [11, 12], [13, 12], [23, 12], [1, 12], [11, 12], [13, 12], [23, 12]].map(([p, q], i) => {
          const it = angleFromItem(p, q, '15.' + (i + 1));
          if (i >= 4 && i < 8) { const t = p * Math.PI / q; const s = Math.sin(t) < 0 ? '-' : '', c = Math.cos(t) < 0 ? '-' : ''; it.q = T`Wyznacz $\alpha\in[0,2\pi)$: $$\sin\alpha=\frac{${s}\sqrt{2-\sqrt3}}{2},\qquad\cos\alpha=\frac{${c}\sqrt{2+\sqrt3}}{2}.$$`; }
          if (i < 4) { const t = p * Math.PI / q; const s = Math.sin(t) < 0 ? '-' : '', c = Math.cos(t) < 0 ? '-' : ''; it.q = T`Wyznacz $\alpha\in[0,2\pi)$: $$\sin\alpha=\frac{${s}\sqrt{2-\sqrt2}}{2},\qquad\cos\alpha=\frac{${c}\sqrt{2+\sqrt2}}{2}.$$`; }
          return it;
        }),
      },
    ],
  });

  /* ---------- podobne przykłady dopasowane do rodzaju podpunktu (Lista 2) ---------- */
  {
    const L2x = A.lists.find(l => l.id === 'l2'); const TK = id => L2x.tasks.find(t => t.id === id);
    const fx = t => t.replace(/\+ -/g, '- ').replace(/- -/g, '+ ');

    // 2.3 — podpunkt 3.3: długie ułamki ze sprzężeniami
    const t23 = TK('2.3'), g23 = t23.gen;
    function genBig() {
      for (let tries = 0; tries < 400; tries++) {
        const S0 = Z.rnd(2), h = Z.rnd(2); if (Z.n2(S0) < 2) continue;
        const k = Z.rnd(2), q = Z.rnd(3), R0 = Z.rnd(2, false);
        if (Z.n2(R0) < 2 || Z.n2(q) < 2) continue;
        const Av = Z.mul(k, Z.conj(q)); const Bv = Z.sub(S0, Av); if (!Bv[0] && !Bv[1]) continue;
        // B = m * conj(t): szukamy dzielnika t (|t|^2 >= 2) liczby B
        let t = null, m = null;
        for (const cand of R.shuffle([[1, 1], [1, -1], [2, 1], [1, 2], [2, -1], [1, -2], [0, 2], [2, 0], [3, 1], [1, 3]])) {
          const ct = Z.conj(cand), n2 = Z.n2(ct), num = Z.mul(Bv, Z.conj(ct));
          if (num[0] % n2 === 0 && num[1] % n2 === 0) { t = cand; m = [num[0] / n2, num[1] / n2]; break; }
        }
        if (!t || (!m[0] && !m[1])) continue;
        const U = Z.rnd(2, false); if (Z.n2(U) < 2) continue;
        const P = Z.mul(k, R0), Sn = Z.mul(m, Z.mul(U, U));
        const X = Z.rnd(2, false); if (Z.n2(X) < 2) continue;
        const V = Z.mul(h, X), W = S0, c1 = Z.mul(h, S0), Cr = Z.mul(c1, c1), z0 = Z.mul(S0, Z.mul(h, h));
        if (Math.abs(z0[0]) > 30 || Math.abs(z0[1]) > 30 || Math.abs(P[0]) > 20 || Math.abs(Sn[0]) > 40 || Math.abs(Sn[1]) > 40) continue;
        const pt = z => Z.ptex(...z), tx = z => Z.tex(...z);
        const tex = T`\begin{wrap}&\frac{${pt(P)}\overline{${pt(q)}}z}{${tx(R0)}}+\frac{${pt(Sn)}\overline{${pt(t)}}z}{${pt(U)}^2}\\&\qquad=\left(\frac{${pt(V)}${pt(W)}}{${tx(X)}}\right)^2\end{wrap}`;
        return { gk: 'big', q: T`Wyznacz wszystkie $z\in\mathbb C$: $$${tex}$$`, fields: [{ label: 'z', ans: Z.str(...z0), restrict: ['alg'] }],
          steps: [
            T`Upraszczamy pierwszy współczynnik: $\overline{${pt(q)}}=${tx(Z.conj(q))}$, a $${pt(P)}=${pt(k)}\cdot${pt(R0)}$, więc $\frac{${pt(P)}\overline{${pt(q)}}}{${tx(R0)}}=${pt(k)}${pt(Z.conj(q))}=${tx(Av)}$.`,
            T`Drugi: $${pt(U)}^2=${tx(Z.mul(U, U))}$ i $${pt(Sn)}=${pt(m)}\cdot${pt(Z.mul(U, U))}$, więc $\frac{${pt(Sn)}\overline{${pt(t)}}}{${pt(U)}^2}=${pt(m)}${pt(Z.conj(t))}=${tx(Bv)}$.`,
            T`Prawa strona: $${pt(V)}=${pt(h)}\cdot${pt(X)}$, więc $\frac{${pt(V)}${pt(W)}}{${tx(X)}}=${pt(h)}${pt(W)}=${tx(c1)}$ i do kwadratu: $${tx(Cr)}$.`,
            T`Równanie: $\left(\left(${tx(Av)}\right)+\left(${tx(Bv)}\right)\right)z=${tx(Cr)}$, czyli $${pt(S0)}z=${tx(Cr)}$.`,
            T`$z=\frac{${tx(Cr)}}{${tx(S0)}}=${tx(z0)}$ (dzielimy, mnożąc przez sprzężenie mianownika).`,
          ] };
      }
      return g23('lin');
    }
    t23.gen = gk => (gk === 'big' ? genBig() : g23(gk));
    t23.items.forEach(it => { if (it.label === '3.3') it.gk = 'big'; });

    // 2.4 — współczynniki jako iloczyny/kwadraty (4.3–4.4) i ułamki (4.5)
    const t24 = TK('2.4'), g24 = t24.gen;
    function genPairX(gk) {
      for (let tries = 0; tries < 400; tries++) {
        const x = R.nz(-4, 4), y = R.nz(-4, 4);
        let Ps, Qs, Ptex, Qtex;
        if (gk === 'pairP') {
          const a = Z.rnd(3, false), b = Z.rnd(3), c = Z.rnd(2, false), k = R.pick([1, 1, 2, 3]);
          Ps = `${k === 1 ? '' : k}(${Z.str(...a)})(${Z.str(...b)})`; Qs = `(${Z.str(...c)})^2`;
          Ptex = T`${k === 1 ? '' : k}${Z.ptex(...a)}${Z.ptex(...b)}`; Qtex = T`${Z.ptex(...c)}^2`;
          if (Math.random() < 0.5) { [Ps, Qs] = [Qs, Ps]; [Ptex, Qtex] = [Qtex, Ptex]; }
        } else {
          const P0 = Z.rnd(2), d = Z.rnd(3, false), Q1 = Z.rnd(2), e = Z.rnd(3, false);
          if (Z.n2(d) < 2 || Z.n2(e) < 2) continue;
          const Pn = Z.mul(P0, d), Qn = Z.mul(Q1, e);
          Ps = `(${Z.str(...Pn)})/(${Z.str(...d)})`; Qs = `((${Z.str(...Qn)})/(${Z.str(...e)}))^2`;
          Ptex = T`\left(\frac{${Z.tex(...Pn)}}{${Z.tex(...d)}}\right)`; Qtex = T`\left(\frac{${Z.tex(...Qn)}}{${Z.tex(...e)}}\right)^2`;
        }
        const P = ev(Ps), Q = ev(Qs);
        if (Math.abs(P.re * Q.im - Q.re * P.im) < 1e-9) continue;
        const S = Cx.add(Cx.mul(P, Cx.C(x)), Cx.mul(Q, Cx.C(y)));
        if (Math.abs(S.re - Math.round(S.re)) > 1e-9 || Math.abs(S.im - Math.round(S.im)) > 1e-9) continue;
        const Ss = Z.str(Math.round(S.re), Math.round(S.im));
        const it = pairItem('', Ps, Qs, Ss, T`${Ptex}x+${Qtex}y=${Z.tex(Math.round(S.re), Math.round(S.im))}`);
        it.gk = gk; it.q = it.q.replace('Wyznacz wszystkie pary', 'Wyznacz wszystkie pary');
        const pre = [...A.autoSol(Ps).slice(0, -1), ...A.autoSol(Qs).slice(0, -1)];
        it.steps = [...(pre.length ? [T`Najpierw obliczamy współczynniki:`, ...pre] : []), ...it.sol];
        return it;
      }
      return g24();
    }
    t24.gen = gk => (gk === 'pairP' || gk === 'pairF' ? genPairX(gk) : g24(gk));
    t24.items.forEach(it => { if (it.label === '4.3' || it.label === '4.4') it.gk = 'pairP'; if (it.label === '4.5') it.gk = 'pairF'; });

    // 2.11 — kierunek zamiany taki jak w podpunkcie
    const t211 = TK('2.11'), g211 = t211.gen;
    t211.gen = gk => { for (let k = 0; k < 60; k++) { const it = g211(); const deg = /stopniach/.test(it.q); if (!gk || (gk === 'todeg') === deg) { it.gk = gk; return it; } } return g211(); };
    t211.items.forEach(it => { it.gk = it.label === '11.1' ? 'todeg' : 'torad'; });

    // 2.13 — osobno: sinus, cosinus, tangens sumy/różnicy, kąt podwojony, połowa kąta
    const t213 = TK('2.13'), g213 = t213.gen;
    const PAIRS = [[1, 3, 1, 4], [1, 4, 1, 6], [1, 2, 1, 6], [2, 3, 1, 4], [3, 4, 1, 6], [1, 3, 1, 6], [1, 2, 1, 4], [3, 4, 1, 3]];
    const AT = (p, q) => A.angleTex(p, q), nr = x => A.niceReal(Math.abs(x) < 1e-12 ? 0 : x);
    const par = t => (/^-|[+-]/.test(t) ? '\\left(' + t + '\\right)' : t);
    function genTrigSum(gk) {
      for (let tries = 0; tries < 200; tries++) {
        const [p1, q1, p2, q2] = R.pick(PAIRS), sg = R.pick([1, -1]);
        const a = p1 * Math.PI / q1, b = p2 * Math.PI / q2, t = a + sg * b;
        if (t <= 1e-9) continue;
        const r = A.ratApprox(t / Math.PI, 48); if (!r || r[1] !== 12) continue;
        const tt = AT(r[0], r[1]), At = AT(p1, q1), Bt = AT(p2, q2), op = sg > 0 ? '+' : '-', opm = sg > 0 ? '-' : '+';
        const sA = nr(Math.sin(a)), cA = nr(Math.cos(a)), sB = nr(Math.sin(b)), cB = nr(Math.cos(b));
        let v, fn, formula, subst;
        if (gk === 'sin') { v = Math.sin(t); fn = '\\sin'; formula = T`\sin(\alpha${op}\beta)=\sin\alpha\cos\beta${op}\cos\alpha\sin\beta`; subst = T`${par(sA)}\cdot${par(cB)}${op}${par(cA)}\cdot${par(sB)}`; }
        else if (gk === 'cos') { v = Math.cos(t); fn = '\\cos'; formula = T`\cos(\alpha${op}\beta)=\cos\alpha\cos\beta${opm}\sin\alpha\sin\beta`; subst = T`${par(cA)}\cdot${par(cB)}${opm}${par(sA)}\cdot${par(sB)}`; }
        else {
          if (Math.abs(Math.cos(a)) < 1e-9 || Math.abs(Math.cos(b)) < 1e-9 || Math.abs(Math.cos(t)) < 1e-9) continue;
          v = Math.tan(t); fn = '\\operatorname{tg}'; const tA = nr(Math.tan(a)), tB = nr(Math.tan(b));
          formula = T`\operatorname{tg}(\alpha${op}\beta)=\frac{\operatorname{tg}\alpha${op}\operatorname{tg}\beta}{1${opm}\operatorname{tg}\alpha\operatorname{tg}\beta}`;
          subst = T`\frac{${tA}${op}${par(tB)}}{1${opm}${par(tA)}\cdot${par(tB)}}`;
        }
        if (/\d\.\d/.test(nr(v))) continue;
        return { gk, q: T`Korzystając ze wzoru na ${gk === 'tg' ? 'tangens' : gk === 'sin' ? 'sinus' : 'cosinus'} ${sg > 0 ? 'sumy' : 'różnicy'}, oblicz $${fn}${tt}$, zapisując $${tt}=${At}${op}${Bt}$.`,
          fields: [{ label: T`${fn}${tt}`, ans: Cx.C(v), restrict: ['notrig'] }],
          steps: [T`Wzór: $${formula}$.`, T`Wartości z tabelki: $\sin${At}=${sA}$, $\cos${At}=${cA}$, $\sin${Bt}=${sB}$, $\cos${Bt}=${cB}$${gk === 'tg' ? T`, a $\operatorname{tg}=\frac{\sin}{\cos}$: $\operatorname{tg}${At}=${nr(Math.tan(a))}$, $\operatorname{tg}${Bt}=${nr(Math.tan(b))}$` : ''}.`,
            T`Podstawiamy: $$${fn}${tt}=${subst}=${nr(v)}$$${gk === 'tg' ? ' (na końcu usuwamy niewymierność z mianownika).' : ''}`] };
      }
      return g213();
    }
    const TRI = [[3, 4, 5], [4, 3, 5], [5, 12, 13], [12, 5, 13], [8, 15, 17], [15, 8, 17]];
    const fr = (p, q) => { const g = A.gcd(Math.abs(p), Math.abs(q)) || 1; const s = q < 0 ? -1 : 1; return [s * p / g, s * q / g]; };
    const ft = ([p, q]) => A.fracTex(p, q), fs = ([p, q]) => (q === 1 ? String(p) : p + '/' + q);
    function genDbl() {
      const [a, b, c] = R.pick(TRI), Q2 = Math.random() < 0.5; // sin = b/c, cos = ±a/c
      const ca = Q2 ? -a : a, s2 = fr(2 * b * ca, c * c), c2 = fr(ca * ca - b * b, c * c), t2 = fr(2 * b * ca, ca * ca - b * b);
      return { gk: 'dbl', q: T`Wiadomo, że $\sin\alpha=${A.fracTex(b, c)}$ i $\alpha\in${Q2 ? T`\left(\frac\pi2,\pi\right)` : T`\left(0,\frac\pi2\right)`}$. Oblicz $\sin2\alpha$, $\cos2\alpha$ i $\operatorname{tg}2\alpha$.`,
        fields: [{ label: T`\sin2\alpha`, ans: fs(s2), restrict: ['notrig'] }, { label: T`\cos2\alpha`, ans: fs(c2), restrict: ['notrig'] }, { label: T`\operatorname{tg}2\alpha`, ans: fs(t2), restrict: ['notrig'] }],
        steps: [T`Z jedynki trygonometrycznej: $\cos^2\alpha=1-\sin^2\alpha=1-\frac{${b * b}}{${c * c}}=\frac{${a * a}}{${c * c}}$, więc $\cos\alpha=\pm${A.fracTex(a, c)}$. W ${Q2 ? 'II' : 'I'} ćwiartce cosinus jest ${Q2 ? 'ujemny' : 'dodatni'}: $\cos\alpha=${A.fracTex(ca, c)}$.`,
          T`$\sin2\alpha=2\sin\alpha\cos\alpha=2\cdot${A.fracTex(b, c)}\cdot${par(A.fracTex(ca, c))}=${ft(s2)}$.`,
          T`$\cos2\alpha=\cos^2\alpha-\sin^2\alpha=\frac{${a * a}}{${c * c}}-\frac{${b * b}}{${c * c}}=${ft(c2)}$.`,
          T`$\operatorname{tg}2\alpha=\frac{\sin2\alpha}{\cos2\alpha}=${ft(t2)}$.`] };
    }
    function genHalf() {
      const [a, b, c] = R.pick(TRI), neg = Math.random() < 0.5, ca = neg ? -a : a; // cos α = ca/c, α ∈ (0, π), sin α = b/c
      const C2 = fr(c + ca, 2 * c), S2 = fr(c - ca, 2 * c), Th = fr(b, c + ca);
      return { gk: 'half', q: T`Wiadomo, że $\cos\alpha=${A.fracTex(ca, c)}$ i $\alpha\in(0,\pi)$. Oblicz $\cos^2\frac\alpha2$, $\sin^2\frac\alpha2$ i $\operatorname{tg}\frac\alpha2$.`,
        fields: [{ label: T`\cos^2\frac\alpha2`, ans: fs(C2), restrict: ['notrig'] }, { label: T`\sin^2\frac\alpha2`, ans: fs(S2), restrict: ['notrig'] }, { label: T`\operatorname{tg}\frac\alpha2`, ans: fs(Th), restrict: ['notrig'] }],
        steps: [T`Ze wzoru $\cos\alpha=2\cos^2\frac\alpha2-1$: $\cos^2\frac\alpha2=\frac{1+\cos\alpha}{2}=\frac{1${ca < 0 ? '-' : '+'}${A.fracTex(Math.abs(ca), c)}}{2}=${ft(C2)}$.`,
          T`Ze wzoru $\cos\alpha=1-2\sin^2\frac\alpha2$: $\sin^2\frac\alpha2=\frac{1-\cos\alpha}{2}=\frac{1${ca < 0 ? '+' : '-'}${A.fracTex(Math.abs(ca), c)}}{2}=${ft(S2)}$.`,
          T`$\sin\alpha=\sqrt{1-\cos^2\alpha}=${A.fracTex(b, c)}$ (dodatni, bo $\alpha\in(0,\pi)$). $\operatorname{tg}\frac\alpha2=\frac{\sin\alpha}{1+\cos\alpha}=\frac{${A.fracTex(b, c)}}{${ft(fr(c + ca, c))}}=${ft(Th)}$ (bo $\frac{\sin\alpha}{1+\cos\alpha}=\frac{2\sin\frac\alpha2\cos\frac\alpha2}{2\cos^2\frac\alpha2}$).`] };
    }
    t213.gen = gk => (gk === 'sin' || gk === 'cos' || gk === 'tg' ? genTrigSum(gk) : gk === 'dbl' ? genDbl() : gk === 'half' ? genHalf() : g213());
    t213.items.forEach(it => { it.gk = { sin: 'sin', cos: 'cos', tg: 'tg', '2α': 'dbl', 'α/2': 'half' }[it.label] || it.gk; });
  }
})();
