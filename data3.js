/* Lista 3 — postać trygonometryczna, de Moivre, pierwiastki z jedynki */
(function () {
  'use strict';
  const A = AQ, R = A.R, T = String.raw, Z = A.Z, Cx = A.C;
  const ev = (s, env = {}, vars = []) => A.evaluate(A.parse(s, vars), env);
  const qtex = s => A.toTex(A.parse(s, ['alpha', 'm', 'n']));
  const isNice = t => !/\d\.\d/.test(t);
  const showZ = z => { const p = A.polarTex(z), a = A.niceC(z); return Cx.abs(z) < 1e-12 ? '0' : (isNice(a) ? a : p); };
  const showSet = arr => arr.map(showZ).join(',\\quad ');
  const SA = [{ alpha: 0.31 }, { alpha: 0.77 }, { alpha: 1.12 }, { alpha: 0.53 }];
  const BIN = (n, k) => { let r = 1; for (let i = 1; i <= k; i++) r = r * (n - k + i) / i; return Math.round(r); };

  /* ---------- 3.1 ---------- */
  function polarItem(label, expr, gk = 'polar', opt = {}) {
    const vars = opt.vars || [];
    const z = env => A.evaluate(A.parse(expr, vars), env);
    const it = {
      label, gk, q: T`Przedstaw w postaci trygonometrycznej $z=r(\cos\varphi+i\sin\varphi)$: $$z=${opt.tex || qtex(expr)}$$ Podaj moduł $r$ i argument $\varphi$.`,
      fields: [
        { label: '|z|', ans: env => Cx.C(Cx.abs(z(env))), restrict: ['noabs', 'notrig'], vars, samples: vars.length ? SA : undefined, show: opt.rShow },
        { label: '\\varphi', kind: 'angle', ans: env => Cx.C(Cx.arg(z(env))), vars, samples: vars.length ? SA : undefined, show: opt.phiShow, restrict: vars.length ? [] : ['notrig'] },
      ], keys: vars.length ? ['pi', 'alpha'] : ['pi'],
    };
    if (opt.mc) { it.mc = opt.mc; it.mcCorrect = opt.mcCorrect; }
    if (!vars.length) { const zz = z({}); it.sol = [T`$r=\sqrt{a^2+b^2}=${A.niceReal(Cx.abs(zz))}$; $\cos\varphi=\frac ar$, $\sin\varphi=\frac br$.`, T`$z=${A.polarTex(zz)}$.`]; }
    return it;
  }
  function gen31() {
    const den = R.pick([4, 6, 3, 12]); let p; do { p = R.int(1, 2 * den - 1); } while (A.gcd(p, den) !== 1);
    const r = den === 12 ? R.pick([2, 4]) : R.pick([1, 2, 3, 4, 2, Math.SQRT2]);
    const t = p * Math.PI / den; const z = Cx.polar(r, t);
    const at = A.niceC(z);
    const it = { q: T`Przedstaw w postaci trygonometrycznej: $$z=${at}$$ Podaj $r$ i $\varphi$.`, keys: ['pi'],
      fields: [{ label: '|z|', ans: Cx.C(r), restrict: ['noabs', 'notrig'] }, { label: '\\varphi', kind: 'angle', ans: Cx.C(t), restrict: ['notrig'] }] };
    it.steps = [T`$r=|z|=\sqrt{(\operatorname{Re}z)^2+(\operatorname{Im}z)^2}=${A.niceReal(r)}$.`, T`$\cos\varphi=\frac{\operatorname{Re}z}{r}=${A.niceReal(Math.cos(t))}$, $\sin\varphi=\frac{\operatorname{Im}z}{r}=${A.niceReal(Math.sin(t))}$.`, T`Ćwiartka ze znaków i kąt odniesienia: $\varphi=${A.angleTex(p, den)}$.`, T`$z=${A.polarTex(z)}$.`];
    return it;
  }

  /* ---------- 3.2 de Moivre ---------- */
  const powItem = (label, expr, gk, extra = {}) => Object.assign({ label, gk, q: T`Oblicz, korzystając z postaci trygonometrycznej (wynik w postaci algebraicznej): $$${qtex(expr)}$$`, fields: [{ label: 'wynik', ans: expr, restrict: ['alg'] }] }, extra);
  const BASES = [['1+i', Math.SQRT2, 1, 4], ['1-i', Math.SQRT2, -1, 4], ['1+√3i', 2, 1, 3], ['√3+i', 2, 1, 6], ['-1+i', Math.SQRT2, 3, 4], ['√3-i', 2, -1, 6], ['-1+√3i', 2, 2, 3], ['1-√3i', 2, -1, 3]];
  function gen32(gk) {
    if (gk === 'quot') {
      for (;;) {
        const [a, b] = R.shuffle(BASES).slice(0, 2); const k = R.int(4, 12), l = R.int(2, 8);
        const expr = `(${a[0]})^${k}/(${b[0]})^${l}`; const v = ev(expr);
        if (!isNice(A.niceC(v)) || Cx.abs(v) > 1e6) continue;
        return powItem('', expr, gk, { steps: [T`$${qtex(a[0])}=${A.niceReal(a[1])}\left(\cos${A.angleTex(a[2], a[3])}+i\sin${A.angleTex(a[2], a[3])}\right)$, $${qtex(b[0])}=${A.niceReal(b[1])}\left(\cos${A.angleTex(b[2], b[3])}+i\sin${A.angleTex(b[2], b[3])}\right)$.`, T`De Moivre: moduły podnosimy do potęgi, argumenty mnożymy; przy dzieleniu moduły dzielimy, argumenty odejmujemy.`, T`Argument wyniku: $${k}\cdot${A.angleTex(a[2], a[3])}-${l}\cdot${A.angleTex(b[2], b[3])}\equiv${A.niceAngle(Cx.arg(v))}$.`, T`Wynik: $${A.niceC(v)}$.`] });
      }
    }
    const a = R.pick(BASES); const k = R.int(6, 30);
    const expr = `(${a[0]})^${k}`; const v = ev(expr);
    return powItem('', expr, 'pow', { steps: [T`$${qtex(a[0])}=${A.niceReal(a[1])}\left(\cos${A.angleTex(a[2], a[3])}+i\sin${A.angleTex(a[2], a[3])}\right)$.`, T`$\left(r(\cos\varphi+i\sin\varphi)\right)^{${k}}=r^{${k}}(\cos${k}\varphi+i\sin${k}\varphi)$.`, T`$${k}\cdot${A.angleTex(a[2], a[3])}=${A.angleTex(k * a[2], a[3])}\equiv${A.niceAngle(k * a[2] * Math.PI / a[3])}\pmod{2\pi}$.`, T`Wynik: $${A.niceC(v)}$.`] });
  }

  /* ---------- 3.5 pierwiastki ---------- */
  function rootItem(label, n, W, gk = 'root') {
    const roots = () => Cx.allRoots(ev(W), n);
    const w = ev(W);
    return {
      label, gk, q: T`Wyznacz wszystkie wartości pierwiastka: $$\sqrt${n === 2 ? '' : '[' + n + ']'}{${qtex(W)}}$$`,
      fields: [{ label: 'wartości', kind: 'set', ans: roots, restrict: ['roots'], show: showSet(roots()) }], keys: [';', 'pi'],
      sol: [T`$${qtex(W)}=${A.polarTex(w)}$.`, T`$w_k=\sqrt[${n}]{r}\left(\cos\frac{\varphi+2k\pi}{${n}}+i\sin\frac{\varphi+2k\pi}{${n}}\right)$, $k=0,\ldots,${n - 1}$.`],
    };
  }
  function gen35() {
    const n = R.pick([2, 3, 3, 4]);
    let w0; if (n === 2) w0 = Z.rnd(4); else if (n === 3) w0 = R.pick([[1, 1], [2, 0], [0, 2], [1, -1], [-1, 1], [0, 1], [2, 2], [3, 0]]); else w0 = R.pick([[1, 1], [1, 0], [0, 2], [2, 0], [1, -1]]);
    let W = [1, 0]; for (let k = 0; k < n; k++) W = Z.mul(W, w0);
    const Ws = Z.str(...W); const it = rootItem('', n, Ws);
    const wv = ev(Ws); const r = Cx.abs(wv), t = Cx.arg(wv);
    it.steps = [T`Postać trygonometryczna: $${Z.tex(...W)}=${A.polarTex(wv)}$.`, T`Moduł pierwiastków: $\sqrt[${n}]{${A.niceReal(r)}}=${A.niceReal(Math.pow(r, 1 / n))}$; argumenty: $\frac{\varphi+2k\pi}{${n}}$, gdzie $\varphi=${A.argTex(wv)}$, $k=0,\ldots,${n - 1}$.`, T`Wartości: $${showSet(Cx.allRoots(wv, n))}$.`, T`Kontrola: jedną wartością jest $${Z.tex(...w0)}$, bo $(${Z.tex(...w0)})^{${n}}=${Z.tex(...W)}$; pozostałe to jej obroty o $\frac{2\pi}{${n}}$.`];
    return it;
  }

  /* ---------- 3.8 ---------- */
  const polarSet = (r, phi0, step, count) => [...Array(count)].map((_, k) => Cx.polar(r, phi0 + k * step));
  const eqItem = (label, tex, sols, gk = 'eq') => ({ label, gk, q: T`Wyznacz wszystkie $z\in\mathbb C$: $$${tex}$$`, fields: [{ label: 'z', kind: 'set', ans: () => sols, restrict: ['roots'], show: showSet(sols) }], keys: [';', 'pi'] });
  function gen38() {
    const n = R.int(2, 5); const fam = R.int(0, 1);
    if (fam === 0) {
      const sols = [Cx.C(0), ...polarSet(1, 0, 2 * Math.PI / (n + 1), n + 1)];
      return Object.assign(eqItem('', T`\overline{z}=z^{${n}}`, sols), { steps: [T`$z=0$ jest rozwiązaniem. Dla $z=r(\cos\varphi+i\sin\varphi)\neq0$: $\overline z=r(\cos(-\varphi)+i\sin(-\varphi))$.`, T`Moduły: $r=r^{${n}}\Rightarrow r=1$. Argumenty: $-\varphi\equiv${n}\varphi$, czyli $${n + 1}\varphi=2k\pi$.`, T`Rozwiązania: $0$ oraz $\cos\frac{2k\pi}{${n + 1}}+i\sin\frac{2k\pi}{${n + 1}}$, $k=0,\ldots,${n}$ — razem $${n + 2}$.`] });
    }
    const k = 2 ** (n - 1);
    const sols = [Cx.C(0), ...polarSet(2, 0, 2 * Math.PI / (n + 1), n + 1)];
    return Object.assign(eqItem('', T`z^{${n}}=${k}\,\overline{z}`, sols), { steps: [T`$z=0$ spełnia równanie. Dla $z\neq0$ porównujemy moduły: $r^{${n}}=${k}r\Rightarrow r^{${n - 1}}=${k}$, $r=2$.`, T`Argumenty: $${n}\varphi\equiv-\varphi$, czyli $\varphi=\frac{2k\pi}{${n + 1}}$.`, T`Rozwiązania: $0$ oraz $2\left(\cos\frac{2k\pi}{${n + 1}}+i\sin\frac{2k\pi}{${n + 1}}\right)$, $k=0,\ldots,${n}$.`] });
  }

  A.addList({
    num: 3, id: 'l3', title: 'Lista 3', name: 'Postać trygonometryczna i pierwiastki', hue: 'l3',
    blurb: 'Moduł i argument, wzór de Moivre’a, pierwiastki z liczb zespolonych, pierwiastki z jedynki.',
    tasks: [
      {
        id: '3.1', name: 'Postać trygonometryczna', statement: 'Następujące liczby zespolone przedstawić w postaci trygonometrycznej $z=r(\\cos\\varphi+i\\sin\\varphi)$.',
        wzory: [T`$r=|z|=\sqrt{a^2+b^2}$ dla $z=a+bi$.`, T`$\cos\varphi=\frac ar$, $\sin\varphi=\frac br$ — oba warunki naraz wyznaczają $\varphi$ (mod $2\pi$).`, T`$\operatorname{tg}\frac\pi{12}=2-\sqrt3$, $\operatorname{tg}\frac{5\pi}{12}=2+\sqrt3$, $|\sqrt6\pm\sqrt2|$ pojawia się przy kątach $\frac{k\pi}{12}$.`, T`$\frac{z_1}{z_2}$: moduły dzielimy, argumenty odejmujemy.`, T`$\cos\alpha-i\sin\alpha=\cos(-\alpha)+i\sin(-\alpha)$; $\sin\alpha+i\cos\alpha=\cos(\frac\pi2-\alpha)+i\sin(\frac\pi2-\alpha)$.`],
        gen: gen31,
        items: [
          ...[['1.1', '1+i'], ['1.2', '-1+i'], ['1.3', '-1-i'], ['1.4', '1-i'], ['1.5', '1+√3i'], ['1.6', '-1+√3i'], ['1.7', '-1-√3i'], ['1.8', '1-√3i'], ['1.9', '√3+i'], ['1.10', '-√3+i'], ['1.11', '-√3-i'], ['1.12', '√3-i'],
            ['1.13', '2+√3+i'], ['1.14', '-2-√3+i'], ['1.15', '-2-√3-i'], ['1.16', '2+√3-i'], ['1.17', '1+(2+√3)i'], ['1.18', '-1+(2+√3)i'], ['1.19', '-1-(2+√3)i'], ['1.20', '1-(2+√3)i'],
            ['1.21', '√6+√2+(√6-√2)i'], ['1.22', '-√6-√2+(√6-√2)i'], ['1.23', '-√6-√2-(√6-√2)i'], ['1.24', '√6+√2-(√6-√2)i']].map(([l, e]) => polarItem(l, e)),
          polarItem('1.25', 'cos(alpha)-i sin(alpha)', 'polarA', { vars: ['alpha'], tex: T`\cos\alpha-i\sin\alpha`, rShow: '1', phiShow: '-\\alpha' , mc: [{ tex: T`r = 1,\quad \varphi = \alpha`, why: T`Zły znak argumentu: $\cos\alpha-i\sin\alpha=\cos(-\alpha)+i\sin(-\alpha)$.` }, { tex: T`r = 1,\quad \varphi = \pi-\alpha`, why: 'Zła ćwiartka — to zmienia znak cosinusa.' }, { tex: T`r = -1,\quad \varphi = \alpha`, why: 'Moduł nigdy nie jest ujemny.' }], mcCorrect: T`r = 1,\quad \varphi = -\alpha` }),
          polarItem('1.26', 'sin(alpha)+i cos(alpha)', 'polarA', { vars: ['alpha'], tex: T`\sin\alpha+i\cos\alpha`, rShow: '1', phiShow: '\\frac\\pi2-\\alpha' , mc: [{ tex: T`r = 1,\quad \varphi = \alpha`, why: T`Pomylone $\sin$ i $\cos$ — tu część rzeczywista to $\sin\alpha=\cos(\frac\pi2-\alpha)$.` }, { tex: T`r = 1,\quad \varphi = \alpha-\frac\pi2`, why: 'Zły znak argumentu.' }, { tex: T`r = 1,\quad \varphi = \frac\pi2+\alpha`, why: T`Zły wzór redukcyjny: $\cos(\frac\pi2+\alpha)=-\sin\alpha$.` }], mcCorrect: T`r = 1,\quad \varphi = \frac\pi2-\alpha` }),
          polarItem('1.27', '(2+2i)/(1-i)'),
          polarItem('1.28', '(1-√3i)/(√3+i)'),
          polarItem('1.29', '(ctg(alpha)+i)/(ctg(alpha)-i)', 'polarA', { vars: ['alpha'], tex: T`\frac{\operatorname{ctg}\alpha+i}{\operatorname{ctg}\alpha-i}`, rShow: '1', phiShow: '2\\alpha' , mc: [{ tex: T`r = 1,\quad \varphi = \alpha`, why: T`Licznik i mianownik mają argumenty $\pm\alpha$ — przy dzieleniu odejmujemy: $2\alpha$.` }, { tex: T`r = \operatorname{ctg}^2\alpha+1,\quad \varphi = 2\alpha`, why: 'Moduł ilorazu liczb o równych modułach to $1$.' }, { tex: T`r = 1,\quad \varphi = \pi-2\alpha`, why: 'Zła ćwiartka.' }], mcCorrect: T`r = 1,\quad \varphi = 2\alpha` }),
          polarItem('1.30', '(1+i tg(alpha))/(1-i tg(alpha))', 'polarA', { vars: ['alpha'], tex: T`\frac{1+i\operatorname{tg}\alpha}{1-i\operatorname{tg}\alpha}`, rShow: '1', phiShow: '2\\alpha' , mc: [{ tex: T`r = 1,\quad \varphi = \alpha`, why: T`Przy dzieleniu argumenty się odejmują: $\alpha-(-\alpha)=2\alpha$.` }, { tex: T`r = 1+\operatorname{tg}^2\alpha,\quad \varphi = 2\alpha`, why: 'Licznik i mianownik mają ten sam moduł — iloraz ma moduł $1$.' }, { tex: T`r = 1,\quad \varphi = 0`, why: 'Argumenty się odejmują, a nie znoszą.' }], mcCorrect: T`r = 1,\quad \varphi = 2\alpha` }),
        ],
      },
      {
        id: '3.2', name: 'Wzór de Moivre’a', statement: 'Korzystając z postaci trygonometrycznej wykonać działania (wynik w postaci algebraicznej).',
        wzory: [T`$\left(r(\cos\varphi+i\sin\varphi)\right)^n=r^n(\cos n\varphi+i\sin n\varphi)$.`, T`$z_1z_2$: $r_1r_2$, $\varphi_1+\varphi_2$; $\frac{z_1}{z_2}$: $\frac{r_1}{r_2}$, $\varphi_1-\varphi_2$.`, T`$1+i=\sqrt2\,e^{i\pi/4}$, $1+i\sqrt3=2e^{i\pi/3}$, $\sqrt3+i=2e^{i\pi/6}$ (skrót: $e^{i\varphi}=\cos\varphi+i\sin\varphi$).`, T`Argument redukuj modulo $2\pi$: np. $50\pi\equiv0$.`],
        gen: gen32,
        items: [
          powItem('2.1', '(1+√3i)^150', 'pow'), powItem('2.2', '(√3-i)^20', 'pow'), Object.assign(powItem('2.3', '(2-√3+i)^12', 'pow'), { fields: [{ label: 'wynik', ans: '(2-√3+i)^12', restrict: ['alg'], show: T`-4096\left(1351-780\sqrt3\right)` }], mcCorrect: T`-4096\left(1351-780\sqrt3\right)`, mc: [{ tex: T`4096\left(1351-780\sqrt3\right)`, why: T`Argument $12\cdot\frac{5\pi}{12}=5\pi$ daje $\cos5\pi=-1$ — zgubiony minus.` }, { tex: T`-4096\left(1351+780\sqrt3\right)`, why: T`Błąd znaku przy $(2-\sqrt3)^6$.` }, { tex: T`-4096i\left(1351-780\sqrt3\right)`, why: T`Zły argument — pomyłka o $\frac\pi2$.` }] }),
          powItem('2.4', '((1-√3i)/(1+i))^12', 'quot'), powItem('2.5', '((√3+i)/(1-i))^30', 'quot'),
          Object.assign(powItem('2.6', '((-1+i)/(1+√3i))^2013', 'quot'), { fields: [{ label: 'wynik', ans: '((-1+i)/(1+√3i))^2013', restrict: ['alg'], scale: 2 ** 1007 }] }),
          powItem('2.7', '(1+i)^10/(1+√3i)^15', 'quot'), powItem('2.8', '(-5+5i)^36/(√5-√15i)^20', 'quot'), powItem('2.9', '(-1+√3i)^28/(1-i)^26+(-1-√3i)^28/(1+i)^26', 'quot'),
          { label: '2.10', gk: 'quot', mcCorrect: T`\left(2^{4m-12n-\frac{13}{2}}+2^{12n-4m+\frac{13}{2}}\right)\left(\cos\tfrac{7\pi}{12}-i\sin\tfrac{7\pi}{12}\right)`, mc: [
            { tex: T`\left(2^{4m-12n-\frac{13}{2}}+2^{12n-4m+\frac{13}{2}}\right)\left(\cos\tfrac{7\pi}{12}+i\sin\tfrac{7\pi}{12}\right)`, why: T`Zły znak argumentu: oba składniki mają argument $-\frac{7\pi}{12}$.` },
            { tex: T`\left(2^{4m-12n-\frac{13}{2}}+2^{12n-4m+\frac{13}{2}}\right)\left(\cos\tfrac{\pi}{12}-i\sin\tfrac{\pi}{12}\right)`, why: T`Argumenty się dodają: $-\frac\pi4-\frac\pi3=-\frac{7\pi}{12}$, nie odejmują.` },
            { tex: T`2^{4m-12n-\frac{13}{2}}\left(\cos\tfrac{7\pi}{12}-i\sin\tfrac{7\pi}{12}\right)`, why: T`Drugi składnik nie jest sprzężeniem pierwszego — ma inny moduł.` }], keys: ['m', 'n', 'pi', 'cos', 'sin'], q: T`Dla dowolnych $m,n\in\mathbb N$ oblicz (wynik zależny od $m,n$): $$\frac{(1+i)^{8m+7}}{(\sqrt3-i)^{12n+10}}+\frac{(\sqrt3+i)^{12n+10}}{(1-i)^{8m+7}}$$`,
            fields: [{ label: 'wynik', ans: '(1+i)^(8m+7)/(√3-i)^(12n+10)+(√3+i)^(12n+10)/(1-i)^(8m+7)', vars: ['m', 'n'], samples: [{ m: 1, n: 1 }, { m: 2, n: 1 }, { m: 1, n: 2 }, { m: 3, n: 2 }, { m: 4, n: 1 }], restrict: ['alg'],
              show: T`\left(2^{4m-12n-\frac{13}{2}}+2^{12n-4m+\frac{13}{2}}\right)\left(\cos\tfrac{7\pi}{12}-i\sin\tfrac{7\pi}{12}\right)` }],
            sol: [T`$(1+i)^{8m+7}=16^m\cdot8(1-i)$, $(\sqrt3-i)^{12n+10}=2^{12n+10}\left(\cos\frac\pi3+i\sin\frac\pi3\right)$.`, T`Oba składniki mają argument $-\frac{7\pi}{12}$; moduły: $2^{4m-12n-6.5}$ i $2^{12n-4m+6.5}$.`] },
        ],
      },
      {
        id: '3.3', name: 'Funkcje kąta wielokrotnego', statement: 'Korzystając z własności liczb zespolonych wyrazić $\\sin3\\alpha,\\cos3\\alpha,\\sin4\\alpha,\\cos4\\alpha,\\sin5\\alpha,\\cos5\\alpha$ za pomocą $\\sin\\alpha$ oraz $\\cos\\alpha$.',
        wzory: [T`$\cos n\alpha+i\sin n\alpha=(\cos\alpha+i\sin\alpha)^n$.`, T`Rozwiń dwumianem Newtona, oznaczając $c=\cos\alpha$, $s=\sin\alpha$: $(c+is)^n=\sum\binom nk c^{n-k}(is)^k$.`, T`Część rzeczywista $\to\cos n\alpha$, urojona $\to\sin n\alpha$.`],
        gen: () => {
          const which = R.int(0, 2);
          if (which === 0) { const [p, q] = R.pick([[1, 3], [1, 2], [2, 3], [1, 4], [3, 4], [-1, 3]]); const c = p / q; const v = 4 * c ** 3 - 3 * c; const r = A.ratApprox(v, 100000);
            return { q: T`Wiedząc, że $\cos\alpha=${A.fracTex(p, q)}$, oblicz $\cos3\alpha$.`, fields: [{ label: '\\cos3\\alpha', ans: r[0] + '/' + r[1], restrict: ['notrig'] }], steps: [T`$\cos3\alpha=\cos^3\alpha-3\cos\alpha\sin^2\alpha=4\cos^3\alpha-3\cos\alpha$.`, T`$4\left(${A.fracTex(p, q)}\right)^3-3\cdot${A.fracTex(p, q)}=${A.fracTex(r[0], r[1])}$.`] }; }
          if (which === 1) { const [p, q] = R.pick([[1, 3], [1, 2], [2, 3], [1, 4], [3, 5], [-1, 2]]); const s = p / q; const v = 3 * s - 4 * s ** 3; const r = A.ratApprox(v, 100000);
            return { q: T`Wiedząc, że $\sin\alpha=${A.fracTex(p, q)}$, oblicz $\sin3\alpha$.`, fields: [{ label: '\\sin3\\alpha', ans: r[0] + '/' + r[1], restrict: ['notrig'] }], steps: [T`$\sin3\alpha=3\cos^2\alpha\sin\alpha-\sin^3\alpha=3\sin\alpha-4\sin^3\alpha$.`, T`$3\cdot${A.fracTex(p, q)}-4\left(${A.fracTex(p, q)}\right)^3=${A.fracTex(r[0], r[1])}$.`] }; }
          const [p, q] = R.pick([[1, 3], [1, 2], [2, 3], [1, 4], [3, 5]]); const c = p / q; const v = 8 * c ** 4 - 8 * c * c + 1; const r = A.ratApprox(v, 100000);
          return { q: T`Wiedząc, że $\cos\alpha=${A.fracTex(p, q)}$, oblicz $\cos4\alpha$.`, fields: [{ label: '\\cos4\\alpha', ans: r[0] + '/' + r[1], restrict: ['notrig'] }], steps: [T`$\cos4\alpha=c^4-6c^2s^2+s^4$, a po podstawieniu $s^2=1-c^2$: $8c^4-8c^2+1$.`, T`Wynik: $${A.fracTex(r[0], r[1])}$.`] };
        },
        items: [
          { label: '3α', keys: ['alpha', 'sin', 'cos'], q: 'Wyraź przez $\\sin\\alpha$ i $\\cos\\alpha$:', fields: [{ label: '\\sin3\\alpha', ans: '3cos(alpha)^2 sin(alpha)-sin(alpha)^3' }, { label: '\\cos3\\alpha', ans: 'cos(alpha)^3-3cos(alpha)sin(alpha)^2' }].map(f => Object.assign(f, { vars: ['alpha'], restrict: ['trig'] })) },
          { label: '4α', keys: ['alpha', 'sin', 'cos'], q: 'Wyraź przez $\\sin\\alpha$ i $\\cos\\alpha$:', fields: [{ label: '\\sin4\\alpha', ans: '4cos(alpha)^3 sin(alpha)-4cos(alpha)sin(alpha)^3' }, { label: '\\cos4\\alpha', ans: 'cos(alpha)^4-6cos(alpha)^2 sin(alpha)^2+sin(alpha)^4' }].map(f => Object.assign(f, { vars: ['alpha'], restrict: ['trig'] })) },
          { label: '5α', keys: ['alpha', 'sin', 'cos'], q: 'Wyraź przez $\\sin\\alpha$ i $\\cos\\alpha$:', fields: [{ label: '\\sin5\\alpha', ans: '5cos(alpha)^4 sin(alpha)-10cos(alpha)^2 sin(alpha)^3+sin(alpha)^5' }, { label: '\\cos5\\alpha', ans: 'cos(alpha)^5-10cos(alpha)^3 sin(alpha)^2+5cos(alpha)sin(alpha)^4' }].map(f => Object.assign(f, { vars: ['alpha'], restrict: ['trig'] })) },
        ],
      },
      {
        id: '3.4', name: 'Tożsamości z symbolem Newtona', statement: T`Udowodnić: $1-\binom n2+\binom n4-\ldots=\sqrt2^n\cos\frac{n\pi}4$ oraz $\binom n1-\binom n3+\binom n5-\ldots=\sqrt2^n\sin\frac{n\pi}4$.`,
        wzory: [T`$(1+i)^n=\sum_{k=0}^n\binom nk i^k$.`, T`$i^k$ cyklicznie: $1,i,-1,-i$.`, T`$1+i=\sqrt2\left(\cos\frac\pi4+i\sin\frac\pi4\right)$ + de Moivre.`],
        gen: () => { const n = R.int(3, 12), re = Math.random() < 0.5; let s = 0; for (let k = re ? 0 : 1, sg = 1; k <= n; k += 2, sg = -sg) s += sg * BIN(n, k);
          return { q: re ? T`Oblicz $1-\binom{${n}}{2}+\binom{${n}}{4}-\ldots$ dla $n=${n}$.` : T`Oblicz $\binom{${n}}{1}-\binom{${n}}{3}+\binom{${n}}{5}-\ldots$ dla $n=${n}$.`, fields: [{ label: 'suma', ans: String(s), restrict: ['plain'] }],
            steps: [T`Suma to ${re ? 'część rzeczywista' : 'część urojona'} liczby $(1+i)^{${n}}$.`, T`$(1+i)^{${n}}=\sqrt2^{${n}}\left(\cos\frac{${n}\pi}4+i\sin\frac{${n}\pi}4\right)=${A.niceC(Cx.powInt(Cx.C(1, 1), n))}$.`, T`Wynik: $${s}$.`] }; },
        items: [
          { label: 'dowód', type: 'order', gk: 'n', q: 'Ułóż dowód obu tożsamości.', order: { steps: [
            T`Rozwijamy $(1+i)^n=\sum_{k=0}^n\binom nk i^k$ (dwumian Newtona).`,
            T`Ponieważ $i^{2j}=(-1)^j$, $i^{2j+1}=(-1)^ji$: część rzeczywista to $1-\binom n2+\binom n4-\ldots$, urojona to $\binom n1-\binom n3+\ldots$.`,
            T`Z drugiej strony $1+i=\sqrt2\left(\cos\frac\pi4+i\sin\frac\pi4\right)$, więc $(1+i)^n=\sqrt2^n\left(\cos\frac{n\pi}4+i\sin\frac{n\pi}4\right)$.`,
            T`Porównując części rzeczywiste i urojone obu zapisów otrzymujemy obie tożsamości. $\blacksquare$`], extra: [T`$(1+i)^n=1+i^n$.`] } },
          { label: 'n=6', gk: 'n', q: T`Oblicz $1-\binom62+\binom64-\binom66$.`, fields: [{ label: 'suma', ans: '0', restrict: ['plain'] }], sol: [T`$1-15+15-1=0=\sqrt2^6\cos\frac{6\pi}4=8\cdot0$.`] },
          { label: 'n=5', gk: 'n', q: T`Oblicz $\binom51-\binom53+\binom55$.`, fields: [{ label: 'suma', ans: '-4', restrict: ['plain'] }], sol: [T`$5-10+1=-4=\sqrt2^5\sin\frac{5\pi}4=4\sqrt2\cdot\left(-\frac{\sqrt2}2\right)$.`] },
        ],
      },
      {
        id: '3.5', name: 'Pierwiastki z liczb zespolonych', statement: 'Wyznaczyć wszystkie wartości pierwiastków.',
        wzory: [T`Jeżeli $z=r(\cos\varphi+i\sin\varphi)$, to $\sqrt[n]{z}$ ma $n$ wartości: $w_k=\sqrt[n]{r}\left(\cos\frac{\varphi+2k\pi}{n}+i\sin\frac{\varphi+2k\pi}{n}\right)$, $k=0,\ldots,n-1$.`, T`Wartości leżą na okręgu o promieniu $\sqrt[n]r$, co $\frac{2\pi}{n}$ — wierzchołki $n$-kąta foremnego.`, T`Znając jedną wartość $w$: wszystkie to $w\cdot\varepsilon_k$, gdzie $\varepsilon_k$ — pierwiastki $n$-tego stopnia z $1$.`],
        gen: gen35,
        items: [
          rootItem('5.1', 2, '3-4i'), rootItem('5.2', 3, 'i'), rootItem('5.3', 3, '2-2i'), rootItem('5.4', 2, '-1+√3i'), rootItem('5.5', 4, '-8-8√3i'),
          rootItem('5.6', 4, '72(-1+√3i)'), rootItem('5.7', 3, '(1+i)^3'), rootItem('5.8', 3, '(1+√3i)^6'), rootItem('5.9', 6, '(-1+√3i)^10'), rootItem('5.10', 3, '(8+24i)/(3-i)'),
          rootItem('5.11', 3, '(27-54i)/(2+i)'), rootItem('5.12', 4, '(-1+i)/(1-√3i)'), rootItem('5.13', 4, '-32/(9(1-√3i))'), rootItem('5.14', 4, '18/(-(1+√3i))'), rootItem('5.15', 4, '(√3-i)^30/(1+i)^24'),
        ],
      },
      {
        id: '3.6', name: 'Równania z $z^3$', statement: 'Wyznaczyć wszystkie liczby zespolone $z$ spełniające równania.',
        wzory: [T`Podstawienie $w=z^3$ sprowadza równanie do kwadratowego.`, T`$\Delta$ może wyjść „ładne”: np. $-4-2\sqrt3=(i(1+\sqrt3))^2$.`, T`$z^3=w$ ma 3 rozwiązania: $\sqrt[3]{|w|}\left(\cos\frac{\varphi+2k\pi}{3}+i\sin\frac{\varphi+2k\pi}{3}\right)$.`],
        gen: () => {
          const pool = [[-8, 0], [8, 0], [0, 8], [0, -8], [1, 0], [-1, 0], [0, 1], [0, -1], [-27, 0], [2, 2], [-2, 2]];
          const [w1, w2] = R.shuffle(pool).slice(0, 2); const B = Z.add(w1, w2), Cc = Z.mul(w1, w2);
          const sols = [...Cx.allRoots(Cx.C(...w1), 3), ...Cx.allRoots(Cx.C(...w2), 3)];
          const tex = T`z^6-${Z.ptex(...B)}z^3+${Z.ptex(...Cc)}=0`.replace(/-\(-/g, '+(').replace(/\+\(-/g, '-(').replace(/\+-/g, '-').replace(/--/g, '+').replace(/-0z\^3/, '').replace(/\(([0-9]+)\)/g, '$1');
          return Object.assign(eqItem('', tex, sols), { steps: [T`$w=z^3$: $w^2-${Z.ptex(...B)}w+${Z.ptex(...Cc)}=0$, więc $w_1=${Z.tex(...w1)}$, $w_2=${Z.tex(...w2)}$ (wzory Viète’a).`, T`Pierwiastki trzeciego stopnia z $w_1$: $${showSet(Cx.allRoots(Cx.C(...w1), 3))}$.`, T`Z $w_2$: $${showSet(Cx.allRoots(Cx.C(...w2), 3))}$.`] });
        },
        items: [
          eqItem('6.1', T`z^6+\left(2-(1-\sqrt3)i\right)z^3+1+\sqrt3-(1-\sqrt3)i=0`, [...Cx.allRoots(Cx.C(-1, 1), 3), ...Cx.allRoots(Cx.C(-1, -Math.sqrt(3)), 3)]),
          eqItem('6.2', T`\frac{(1-i\sqrt3)z^3}{2}=\frac{8\left(\cos\frac{3\pi}8+i\sin\frac{3\pi}8\right)^{10}}{\cos\frac{5\pi}4+i\sin\frac{5\pi}4}`, Cx.allRoots(ev('8(cos(3pi/8)+i sin(3pi/8))^10/(cos(5pi/4)+i sin(5pi/4))*2/(1-√3i)'), 3)),
        ].map((it, i) => Object.assign(it, { sol: i === 0 ? [T`$w=z^3$: $\Delta=-4-2\sqrt3=\left(i(1+\sqrt3)\right)^2$, więc $w_1=-1+i$, $w_2=-1-\sqrt3i$.`, T`$z^3=\sqrt2e^{3\pi i/4}$ oraz $z^3=2e^{4\pi i/3}$ — po 3 pierwiastki.`] : [T`Prawa strona: $8e^{i(30\pi/8-5\pi/4)}=8e^{i\pi/2}=8i$; lewa: $e^{-i\pi/3}z^3$.`, T`$z^3=8e^{i5\pi/6}$, więc $z=2e^{i(5\pi/18+2k\pi/3)}$.`] })),
      },
      {
        id: '3.7', name: 'Pierwiastki przez jedną wartość', statement: T`7.1: wyznaczyć wszystkie wartości $\sqrt[n]z$, wiedząc, że jedna z nich to $\omega$. 7.2: wyznaczyć wszystkie wartości $\sqrt[3]{(3+2i)^3}$ oraz $\sqrt[3]{(5-i)^{12}}$.`,
        wzory: [T`$\varepsilon_k=\cos\frac{2k\pi}n+i\sin\frac{2k\pi}n$ — pierwiastki $n$-tego stopnia z $1$.`, T`Jeśli $\omega^n=z$, to $(\omega\varepsilon_k)^n=\omega^n\varepsilon_k^n=z$.`, T`Dla $n=3$: $\varepsilon_1=-\frac12+\frac{\sqrt3}2i$, $\varepsilon_2=-\frac12-\frac{\sqrt3}2i$.`],
        gen: () => { const w = Z.rnd(3); const k = R.pick([3, 3, 6]); const base = k === 3 ? w : Z.mul(w, w); const sols = [0, 1, 2].map(j => Cx.mul(Cx.C(...base), Cx.polar(1, 2 * j * Math.PI / 3)));
          return Object.assign(eqItem('', T`z=\sqrt[3]{(${Z.tex(...w)})^{${k}}}\quad(\text{wszystkie wartości})`, sols), { q: T`Wyznacz wszystkie wartości $\sqrt[3]{(${Z.tex(...w)})^{${k}}}$.`, steps: [T`Jedną wartością jest $${k === 3 ? Z.ptex(...w) : '(' + Z.tex(...w) + ')^2=' + Z.tex(...base)}$.`, T`Wszystkie: $\omega,\ \omega\varepsilon_1,\ \omega\varepsilon_2$ z $\varepsilon_{1,2}=-\frac12\pm\frac{\sqrt3}2i$.`, T`$${showSet(sols)}$.`] }); },
        items: [
          { label: '7.1', type: 'choice', gk: 'w', q: T`Jedną z wartości $\sqrt[n]z$ jest $\omega$. Wszystkie wartości to:`, choice: { multi: false, opts: [T`$\omega\cdot\varepsilon_k$, $\ \varepsilon_k=\cos\frac{2k\pi}n+i\sin\frac{2k\pi}n$, $k=0,\ldots,n-1$`, T`$\omega+\varepsilon_k$, $k=0,\ldots,n-1$`, T`$\omega^k$, $k=1,\ldots,n$`, T`$\omega\cdot\left(\cos\frac{k\pi}n+i\sin\frac{k\pi}n\right)$, $k=0,\ldots,n-1$`], correct: [0] }, sol: [T`$(\omega\varepsilon_k)^n=\omega^n\cdot1=z$, a liczby $\omega\varepsilon_k$ są parami różne — jest ich $n$, czyli wszystkie.`] },
          eqItem('7.2a', T`z\in\sqrt[3]{(3+2i)^3}`, [0, 1, 2].map(j => Cx.mul(Cx.C(3, 2), Cx.polar(1, 2 * j * Math.PI / 3))), 'w'),
          (it => { it.fields[0].show = String.raw`(476-480i)\cdot\varepsilon_k,\ \varepsilon_k\in\left\{1,\,-\tfrac12\pm\tfrac{\sqrt3}{2}i\right\}`; it.mcCorrect = it.fields[0].show; it.mc = [{ tex: String.raw`476-480i\ \text{(tylko jedna)}`, why: 'Pierwiastek 3. stopnia ma trzy wartości.' }, { tex: String.raw`(476+480i)\cdot\varepsilon_k`, why: 'Błąd znaku przy $(5-i)^2=24-10i$.' }, { tex: String.raw`(24-10i)\cdot\varepsilon_k`, why: T`$\frac{12}{3}=4$, więc $\omega=(5-i)^4$, a nie $(5-i)^2$.` }]; return it; })(eqItem('7.2b', T`z\in\sqrt[3]{(5-i)^{12}}`, [0, 1, 2].map(j => Cx.mul(Cx.C(476, -480), Cx.polar(1, 2 * j * Math.PI / 3))), 'w')),
        ].map((it, i) => i ? Object.assign(it, { q: T`Wyznacz wszystkie wartości $${i === 1 ? '\\sqrt[3]{(3+2i)^3}' : '\\sqrt[3]{(5-i)^{12}}'}$.`, sol: [i === 1 ? T`$\omega=3+2i$, pozostałe: $(3+2i)\varepsilon_1$, $(3+2i)\varepsilon_2$.` : T`$\omega=(5-i)^4=476-480i$, pozostałe: $\omega\varepsilon_1$, $\omega\varepsilon_2$.`] }) : it),
      },
      {
        id: '3.8', name: 'Równania ze sprzężeniem i modułem', statement: 'Wyznaczyć wszystkie liczby zespolone $z$ spełniające równania.',
        wzory: [T`Zapisz $z=r(\cos\varphi+i\sin\varphi)$: $\overline z$ ma argument $-\varphi$, $|z|=r$.`, T`Porównaj osobno moduły i argumenty (argumenty modulo $2\pi$).`, T`Nie zapomnij o rozwiązaniu $z=0$!`, T`$-1-i\sqrt3=2\left(\cos\frac{4\pi}3+i\sin\frac{4\pi}3\right)$.`],
        gen: gen38,
        items: [
          eqItem('8.1', T`\overline{z}\cdot|z|=z^4`, [Cx.C(0), ...polarSet(1, 0, 2 * Math.PI / 5, 5)]),
          eqItem('8.2', T`\overline{z}^{\,4}=4z^6`, [Cx.C(0), ...polarSet(0.5, 0, Math.PI / 5, 10)]),
          eqItem('8.3', T`\overline{z}=z^3`, [Cx.C(0), ...polarSet(1, 0, Math.PI / 2, 4)]),
          eqItem('8.4', T`\frac{\overline{z}^{\,3}}{(-1-i\sqrt3)^4}=|z|`, [Cx.C(0), ...polarSet(4, 2 * Math.PI / 9, 2 * Math.PI / 3, 3)]),
          eqItem('8.5', T`\frac{z^3\cdot\overline{z}}{(-1-i\sqrt3)^2}=|z|^3`, [Cx.C(0), ...polarSet(4, Math.PI / 3, Math.PI, 2)]),
          eqItem('8.6', T`\frac{z^5\cdot|z|^3}{-\sqrt3+i}=(1+i)\cdot\overline{z}^{\,2}`, [Cx.C(0), ...polarSet(Math.pow(2, 0.25), 13 * Math.PI / 84, 2 * Math.PI / 7, 7)]),
        ],
      },
      {
        id: '3.9', name: 'Pierwiastek pierwotny $\\varepsilon$', statement: T`$\varepsilon=\cos\frac{2\pi}3+i\sin\frac{2\pi}3$. Obliczyć $1+\varepsilon^m+\varepsilon^{2m}$, $(1+\varepsilon)^m$, $(1+\varepsilon^2)^m$ dla $m\in\mathbb N$.`,
        wzory: [T`$\varepsilon^3=1$ i $1+\varepsilon+\varepsilon^2=0$.`, T`$1+\varepsilon=-\varepsilon^2=\cos\frac\pi3+i\sin\frac\pi3$.`, T`$1+\varepsilon^2=-\varepsilon=\cos\frac\pi3-i\sin\frac\pi3$.`, T`Suma ciągu geometrycznego: $1+q+q^2=\frac{q^3-1}{q-1}$ dla $q\neq1$.`],
        gen: () => { const m = R.int(10, 200); const plus = Math.random() < 0.5; const base = plus ? Cx.C(0.5, Math.sqrt(3) / 2) : Cx.C(0.5, -Math.sqrt(3) / 2); const v = Cx.powInt(base, m);
          return { q: T`Dla $\varepsilon=\cos\frac{2\pi}3+i\sin\frac{2\pi}3$ oblicz $(1+\varepsilon${plus ? '' : '^2'})^{${m}}$ (postać algebraiczna).`, fields: [{ label: 'wynik', ans: Cx.C(v.re, v.im), restrict: ['alg'], show: A.niceC(v) }],
            steps: [T`$1+\varepsilon${plus ? '' : '^2'}=${plus ? '-\\varepsilon^2' : '-\\varepsilon'}=\cos\frac\pi3${plus ? '+' : '-'}i\sin\frac\pi3$.`, T`Potęga: argument $${plus ? '' : '-'}\frac{${m}\pi}{3}$, a $${m}\bmod6=${m % 6}$.`, T`Wynik: $${A.niceC(v)}$.`] }; },
        items: [
          { label: '9.1', gk: 'p', q: T`Oblicz $1+\varepsilon^m+\varepsilon^{2m}$.`, fields: [{ label: '3\\mid m', ans: '3', restrict: ['plain'] }, { label: '3\\nmid m', ans: '0', restrict: ['plain'] }], sol: [T`Gdy $3\mid m$: $\varepsilon^m=1$, suma $=3$. W przeciwnym razie $\varepsilon^m\neq1$ i $1+q+q^2=\frac{q^3-1}{q-1}=0$.`] },
          { label: '9.2', gk: 'p', mcCorrect: T`\cos\frac{m\pi}3+i\sin\frac{m\pi}3`, mc: [
            { tex: T`\cos\frac{2m\pi}3+i\sin\frac{2m\pi}3`, why: T`To jest $\varepsilon^m$, a nie $(1+\varepsilon)^m$: $1+\varepsilon=-\varepsilon^2$ ma argument $\frac\pi3$.` },
            { tex: T`\cos\frac{m\pi}3-i\sin\frac{m\pi}3`, why: T`Zły znak: $1+\varepsilon=\frac12+\frac{\sqrt3}2i$ ma argument $+\frac\pi3$.` },
            { tex: T`2^m\left(\cos\frac{m\pi}3+i\sin\frac{m\pi}3\right)`, why: T`$|1+\varepsilon|=1$, a nie $2$.` }], keys: ['m', 'pi', 'cos', 'sin'], q: T`Oblicz $(1+\varepsilon)^m$ (wyrażenie zależne od $m$).`, fields: [{ label: '(1+\\varepsilon)^m', ans: '(1/2+√3/2i)^m', vars: ['m'], samples: [1, 2, 3, 4, 5, 7, 11].map(m => ({ m })), restrict: ['alg'], show: T`\cos\frac{m\pi}3+i\sin\frac{m\pi}3` }], sol: [T`$1+\varepsilon=\frac12+\frac{\sqrt3}2i=\cos\frac\pi3+i\sin\frac\pi3$, de Moivre.`] },
          { label: '9.3', gk: 'p', mcCorrect: T`\cos\frac{m\pi}3-i\sin\frac{m\pi}3`, mc: [
            { tex: T`\cos\frac{4m\pi}3+i\sin\frac{4m\pi}3`, why: T`To jest $\varepsilon^{2m}$, a nie $(1+\varepsilon^2)^m$.` },
            { tex: T`\cos\frac{m\pi}3+i\sin\frac{m\pi}3`, why: T`Zły znak: $1+\varepsilon^2=\frac12-\frac{\sqrt3}2i$ ma argument $-\frac\pi3$.` },
            { tex: T`(-1)^m\left(\cos\frac{m\pi}3-i\sin\frac{m\pi}3\right)`, why: T`$1+\varepsilon^2=-\varepsilon$, ale $-\varepsilon$ to już $\cos\frac\pi3-i\sin\frac\pi3$ — minus jest wliczony.` }], keys: ['m', 'pi', 'cos', 'sin'], q: T`Oblicz $(1+\varepsilon^2)^m$ (wyrażenie zależne od $m$).`, fields: [{ label: '(1+\\varepsilon^2)^m', ans: '(1/2-√3/2i)^m', vars: ['m'], samples: [1, 2, 3, 4, 5, 7, 11].map(m => ({ m })), restrict: ['alg'], show: T`\cos\frac{m\pi}3-i\sin\frac{m\pi}3` }], sol: [T`$1+\varepsilon^2=\frac12-\frac{\sqrt3}2i=\cos\frac\pi3-i\sin\frac\pi3$.`] },
        ],
      },
      {
        id: '3.10', name: 'Sumy i iloczyny pierwiastków z jedynki', statement: T`$\varepsilon_k=\cos\frac{2k\pi}n+i\sin\frac{2k\pi}n$, $k=0,\ldots,n-1$, $n\ge2$. Obliczyć sumy i iloczyny $\varepsilon_k$, $\varepsilon_k^2$, $\varepsilon_k^m$.`,
        wzory: [T`$\varepsilon_k$ to wszystkie pierwiastki wielomianu $z^n-1$.`, T`Wzory Viète’a: suma pierwiastków $z^n-1$ to $0$ (dla $n\ge2$), iloczyn to $(-1)^{n+1}$.`, T`$\varepsilon_k=\varepsilon_1^k$ — suma to ciąg geometryczny: $\sum_{k=0}^{n-1}q^k=\frac{q^n-1}{q-1}$ dla $q\neq1$.`, T`$\varepsilon_k^m=\varepsilon_1^{km}$: gdy $n\mid m$, wszystkie są równe $1$.`],
        gen: () => { const n = R.int(3, 9), m = R.int(1, 3 * n); const sum = n % (n / A.gcd(n, m)) === 0 && m % n === 0 ? n : 0; const kind = R.int(0, 1);
          if (kind === 0) return { q: T`Oblicz $\varepsilon_0^{${m}}+\varepsilon_1^{${m}}+\ldots+\varepsilon_{${n - 1}}^{${m}}$ dla pierwiastków stopnia $n=${n}$ z jedynki.`, fields: [{ label: 'suma', ans: String(m % n === 0 ? n : 0), restrict: ['plain'] }], steps: [T`$\varepsilon_k^{${m}}=q^k$ dla $q=\varepsilon_1^{${m}}$.`, m % n === 0 ? T`$${n}\mid${m}$, więc $q=1$ i suma $=${n}$.` : T`$${n}\nmid${m}$, więc $q\neq1$, $q^{${n}}=1$, suma $=\frac{q^{${n}}-1}{q-1}=0$.`] };
          const prod = ((n + 1) * m) % 2 === 0 ? 1 : -1;
          return { q: T`Oblicz $\varepsilon_0^{${m}}\cdot\varepsilon_1^{${m}}\cdots\varepsilon_{${n - 1}}^{${m}}$ dla $n=${n}$.`, fields: [{ label: 'iloczyn', ans: String(prod), restrict: ['plain'] }], steps: [T`$\varepsilon_0\varepsilon_1\cdots\varepsilon_{n-1}=(-1)^{n+1}$ (Viète dla $z^n-1$).`, T`Iloczyn potęg $=\left((-1)^{${n + 1}}\right)^{${m}}=${prod}$.`] }; },
        items: [
          { label: '10.1', gk: 's', keys: ['n'], q: T`Oblicz $\varepsilon_0+\varepsilon_1+\ldots+\varepsilon_{n-1}$ (ogólnie, $n\ge2$).`, fields: [{ label: 'suma', ans: '0', vars: ['n'], restrict: [] }], sol: [T`Viète: współczynnik przy $z^{n-1}$ w $z^n-1$ to $0$.`] },
          { label: '10.2', gk: 's', keys: ['n'], mcCorrect: T`(-1)^{n+1}`, mc: [{ tex: T`(-1)^{n}`, why: T`Viète: iloczyn pierwiastków $z^n-1$ to $(-1)^n\cdot\frac{-1}{1}=(-1)^{n+1}$ — zgubiony minus wyrazu wolnego.` }, { tex: '1', why: T`Pary sprzężone dają $1$, ale przy parzystym $n$ jest też $\varepsilon=-1$.` }, { tex: '0', why: T`To suma pierwiastków wynosi $0$, nie iloczyn.` }], q: T`Oblicz $\varepsilon_0\cdot\varepsilon_1\cdots\varepsilon_{n-1}$ (wzór zależny od $n$).`, fields: [{ label: 'iloczyn', ans: '(-1)^(n+1)', vars: ['n'] }], sol: [T`Viète: iloczyn pierwiastków $z^n-1$ to $(-1)^n\cdot(-1)=(-1)^{n+1}$.`] },
          { label: '10.3', gk: 's', q: T`Oblicz $\varepsilon_0^2+\varepsilon_1^2+\ldots+\varepsilon_{n-1}^2$.`, fields: [{ label: 'n=2', ans: '2', restrict: ['plain'] }, { label: 'n\\ge3', ans: '0', restrict: ['plain'] }], sol: [T`$q=\varepsilon_1^2$: dla $n=2$ $q=1$, suma $=2$; dla $n\ge3$ $q\ne1$, suma $=0$.`] },
          { label: '10.4', gk: 's', q: T`Oblicz $\varepsilon_0^2\cdot\varepsilon_1^2\cdots\varepsilon_{n-1}^2$.`, fields: [{ label: 'iloczyn', ans: '1', restrict: ['plain'] }], sol: [T`$\left((-1)^{n+1}\right)^2=1$.`] },
          { label: '10.5', gk: 's', keys: ['n'], q: T`Oblicz $\varepsilon_0^m+\varepsilon_1^m+\ldots+\varepsilon_{n-1}^m$.`, fields: [{ label: 'n\\mid m', ans: 'n', vars: ['n'] }, { label: 'n\\nmid m', ans: '0', restrict: ['plain'] }], sol: [T`Gdy $n\mid m$: każdy składnik $=1$. W przeciwnym razie suma geometryczna z $q\neq1$, $q^n=1$: $0$.`] },
          { label: '10.6', gk: 's', keys: ['n', 'm'], mcCorrect: T`(-1)^{(n+1)m}`, mc: [{ tex: T`(-1)^{n+1}`, why: T`Zapomniano podnieść iloczyn do potęgi $m$.` }, { tex: T`(-1)^{nm}`, why: T`Pomyłka o jeden: iloczyn $\varepsilon_k$ to $(-1)^{n+1}$.` }, { tex: '1', why: T`$(-1)^{(n+1)m}$ jest równe $1$ tylko dla parzystego $(n+1)m$.` }], q: T`Oblicz $\varepsilon_0^m\cdot\varepsilon_1^m\cdots\varepsilon_{n-1}^m$.`, fields: [{ label: 'iloczyn', ans: '(-1)^((n+1)m)', vars: ['n', 'm'] }], sol: [T`$\left((-1)^{n+1}\right)^m=(-1)^{(n+1)m}$.`] },
        ],
      },
      {
        id: '3.11', name: '$z^m+z^{-m}=2\\cos m\\alpha$', statement: T`Dla dowolnej $m\in\mathbb N$ udowodnić: jeżeli $z+z^{-1}=2\cos\alpha$, to $z^m+z^{-m}=2\cos(m\alpha)$.`,
        wzory: [T`$z+\frac1z=2\cos\alpha\iff z^2-2\cos\alpha\,z+1=0$.`, T`$\Delta=4\cos^2\alpha-4=-4\sin^2\alpha$, więc $z=\cos\alpha\pm i\sin\alpha$.`, T`De Moivre: $(\cos\alpha\pm i\sin\alpha)^m=\cos m\alpha\pm i\sin m\alpha$.`],
        gen: () => { const [p, q, v] = R.pick([[1, 3, '1'], [1, 4, '√2'], [1, 6, '√3'], [2, 3, '-1'], [1, 2, '0']]); const m = R.int(2, 12); const val = 2 * Math.cos(m * p * Math.PI / q);
          return { q: T`Wiedząc, że $z+z^{-1}=${qtex(v)}$, oblicz $z^{${m}}+z^{-${m}}$.`, fields: [{ label: T`z^{${m}}+z^{-${m}}`, ans: Cx.C(Math.abs(val) < 1e-12 ? 0 : val), restrict: ['notrig', 'alg'] }],
            steps: [T`$${qtex(v)}=2\cos\alpha$ dla $\alpha=${A.angleTex(p, q)}$.`, T`Z tożsamości: $z^{${m}}+z^{-${m}}=2\cos\frac{${m * p}\pi}{${q}}$.`, T`Wynik: $${A.niceReal(val)}$.`] }; },
        items: [
          { label: 'dowód', type: 'order', gk: 'x', q: 'Ułóż dowód.', order: { steps: [
            T`Mnożąc $z+z^{-1}=2\cos\alpha$ przez $z\neq0$: $z^2-2\cos\alpha\cdot z+1=0$.`,
            T`$\Delta=4\cos^2\alpha-4=(2i\sin\alpha)^2$, więc $z=\cos\alpha\pm i\sin\alpha$.`,
            T`Z wzoru de Moivre’a $z^m=\cos m\alpha\pm i\sin m\alpha$, a $z^{-m}=\cos m\alpha\mp i\sin m\alpha$ (bo $|z|=1$, $z^{-1}=\overline z$).`,
            T`Dodając: $z^m+z^{-m}=2\cos(m\alpha)$. $\blacksquare$`], extra: [T`Indukcja: $z^{m+1}+z^{-(m+1)}=(z+z^{-1})^{m+1}$.`] } },
          { label: 'liczbowo', gk: 'x', q: T`Wiedząc, że $z+z^{-1}=1$, oblicz $z^{7}+z^{-7}$.`, fields: [{ label: 'z^7+z^{-7}', ans: '1', restrict: ['plain'] }], sol: [T`$1=2\cos\frac\pi3$, więc $z^7+z^{-7}=2\cos\frac{7\pi}3=2\cos\frac\pi3=1$.`] },
        ],
      },
      {
        id: '3.12', name: 'Sumy i iloczyny cosinusów', statement: T`Dla $n\in\mathbb N$ obliczyć: $\cos\frac{2\pi}{2n+1}+\cos\frac{4\pi}{2n+1}+\ldots+\cos\frac{2n\pi}{2n+1}$ oraz $\cos\frac{\pi}{2n+1}\cdot\cos\frac{2\pi}{2n+1}\cdots\cos\frac{n\pi}{2n+1}$.`,
        wzory: [T`Pierwiastki stopnia $N=2n+1$ z jedynki sumują się do $0$: $1+2\sum_{k=1}^{n}\cos\frac{2k\pi}{N}=0$.`, T`$\cos\frac{2k\pi}N=\cos\frac{2(N-k)\pi}N$ — pierwiastki łączą się w pary sprzężone.`, T`Iloczyn: $\prod_{k=1}^{N-1}\left(1-\varepsilon_k\right)=N$ i $|1-e^{i\theta}|=2\left|\sin\frac\theta2\right|$; albo sztuczka $2\sin x\cos x=\sin2x$.`],
        gen: () => { const n = R.int(2, 6); const N = 2 * n + 1; const sum = Math.random() < 0.5;
          return sum ? { q: T`Oblicz $${[...Array(n)].map((_, k) => T`\cos\frac{${2 * (k + 1)}\pi}{${N}}`).join('+')}$.`, fields: [{ label: 'suma', ans: '-1/2', restrict: ['notrig'] }], steps: [T`Suma wszystkich pierwiastków stopnia $${N}$ z jedynki: $1+\sum_{k=1}^{${N - 1}}\varepsilon_k=0$.`, T`Części rzeczywiste: $1+2\left(\cos\frac{2\pi}{${N}}+\ldots+\cos\frac{${2 * n}\pi}{${N}}\right)=0$.`, T`Wynik: $-\frac12$.`] }
            : { q: T`Oblicz $${[...Array(n)].map((_, k) => T`\cos\frac{${k + 1 === 1 ? '' : k + 1}\pi}{${N}}`).join('\\cdot')}$.`, fields: [{ label: 'iloczyn', ans: '1/' + 2 ** n, restrict: ['notrig'] }], steps: [T`Ogólny wzór: $\prod_{k=1}^{n}\cos\frac{k\pi}{2n+1}=\frac1{2^n}$.`, T`Dla $n=${n}$: $\frac1{${2 ** n}}$.`] }; },
        items: [
          { label: '12.1', gk: 'x', keys: ['n'], q: T`Oblicz $\cos\frac{2\pi}{2n+1}+\cos\frac{4\pi}{2n+1}+\ldots+\cos\frac{2n\pi}{2n+1}$.`, fields: [{ label: 'suma', ans: '-1/2', vars: ['n'], restrict: ['notrig'] }], sol: [T`$1+2S=0$ (suma pierwiastków stopnia $2n+1$ z jedynki), więc $S=-\frac12$.`] },
          { label: '12.2', gk: 'x', keys: ['n'], q: T`Oblicz $\cos\frac{\pi}{2n+1}\cdot\cos\frac{2\pi}{2n+1}\cdots\cos\frac{n\pi}{2n+1}$ (wzór zależny od $n$).`, fields: [{ label: 'iloczyn', ans: '1/2^n', vars: ['n'], restrict: ['notrig'] }], sol: [T`Wynik: $\frac{1}{2^n}$ (np. $n=1$: $\cos\frac\pi3=\frac12$).`] },
        ],
      },
    ],
  });
})();
