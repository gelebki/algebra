/* Algebrownia — automatyczne rozwiązania „krok po kroku” dla działań na liczbach zespolonych */
(function (G) {
  'use strict';
  const AQ = G.AQ, Cx = AQ.C;
  const strip = n => { while (n.t === 'par') n = n.a; return n; };
  const fix = s => s.replace(/\+ -/g, '- ').replace(/- -/g, '+ ').replace(/\+-/g, '-');
  AQ.parTex = t => (/^-/.test(t) ? '\\left(' + t + '\\right)' : t);

  const T = String.raw;
  AQ.solOverrides = {
    '3.2#2.3': [
      T`Oznaczmy $z=2-\sqrt3+i$. Kwadrat modułu: $|z|^2=(2-\sqrt3)^2+1^2=4-4\sqrt3+3+1=8-4\sqrt3=4(2-\sqrt3)$.`,
      T`Argument: $z$ leży w I ćwiartce, a $\operatorname{tg}\varphi=\frac{1}{2-\sqrt3}=2+\sqrt3$. Wiemy, że $\operatorname{tg}\frac{\pi}{12}=2-\sqrt3$, więc $\operatorname{tg}\left(\frac\pi2-\frac\pi{12}\right)=\frac{1}{2-\sqrt3}$, czyli $\varphi=\frac{5\pi}{12}$.`,
      T`Wzór de Moivre’a: $z^{12}=|z|^{12}\left(\cos\left(12\cdot\frac{5\pi}{12}\right)+i\sin\left(12\cdot\frac{5\pi}{12}\right)\right)=|z|^{12}(\cos5\pi+i\sin5\pi)=-|z|^{12}$.`,
      T`Moduł: $|z|^{12}=\left(|z|^2\right)^6=4^6(2-\sqrt3)^6=2^{12}\left((2-\sqrt3)^2\right)^3=2^{12}(7-4\sqrt3)^3=2^{12}(1351-780\sqrt3)$.`,
      T`<b>Odpowiedź:</b> $-2^{12}\left(1351-780\sqrt3\right)$`],
    '3.2#2.6': [
      T`Licznik: $|-1+i|=\sqrt2$, punkt w II ćwiartce, więc $-1+i=\sqrt2\left(\cos\frac{3\pi}4+i\sin\frac{3\pi}4\right)$.`,
      T`Mianownik: $|1+\sqrt3i|=\sqrt{1+3}=2$, więc $1+\sqrt3i=2\left(\cos\frac\pi3+i\sin\frac\pi3\right)$.`,
      T`Dzielenie — moduły dzielimy, argumenty odejmujemy: moduł $\frac{\sqrt2}2$, argument $\frac{3\pi}4-\frac\pi3=\frac{5\pi}{12}$.`,
      T`Wzór de Moivre’a: moduł $\left(\frac{\sqrt2}{2}\right)^{2013}=\left(2^{-\frac12}\right)^{2013}=2^{-\frac{2013}{2}}$, argument $2013\cdot\frac{5\pi}{12}=\frac{3355\pi}{4}=838\pi+\frac{3\pi}4$ — po odjęciu pełnych obrotów zostaje $\frac{3\pi}4$.`,
      T`Wynik: $2^{-\frac{2013}{2}}\left(\cos\frac{3\pi}4+i\sin\frac{3\pi}4\right)=2^{-\frac{2013}{2}}\cdot\frac{\sqrt2}{2}(-1+i)=2^{-1007}(-1+i)$, bo $\frac{\sqrt2}2=2^{-\frac12}$.`,
      T`<b>Odpowiedź:</b> $-\frac{1}{2^{1007}}+\frac{1}{2^{1007}}i$`],
    '3.2#2.8': [
      T`Licznik: $-5+5i=5\sqrt2\left(\cos\frac{3\pi}4+i\sin\frac{3\pi}4\right)$. Z de Moivre’a: moduł $(5\sqrt2)^{36}=5^{36}\cdot2^{18}$, argument $36\cdot\frac{3\pi}4=27\pi$, czyli po odjęciu pełnych obrotów $\pi$.`,
      T`Mianownik: $|\sqrt5-\sqrt{15}i|=\sqrt{5+15}=2\sqrt5$, punkt w IV ćwiartce: $\sqrt5-\sqrt{15}i=2\sqrt5\left(\cos\frac{5\pi}3+i\sin\frac{5\pi}3\right)$. Z de Moivre’a: moduł $(2\sqrt5)^{20}=2^{20}\cdot5^{10}$, argument $20\cdot\frac{5\pi}3=\frac{100\pi}3=32\pi+\frac{4\pi}3$, czyli $\frac{4\pi}3$.`,
      T`Dzielenie — moduły dzielimy, argumenty odejmujemy: moduł $\frac{5^{36}\cdot2^{18}}{2^{20}\cdot5^{10}}=\frac{5^{26}}{4}$, argument $\pi-\frac{4\pi}3=-\frac\pi3$.`,
      T`Wynik: $\frac{5^{26}}4\left(\cos\left(-\frac\pi3\right)+i\sin\left(-\frac\pi3\right)\right)=\frac{5^{26}}4\left(\frac12-\frac{\sqrt3}2i\right)$.`,
      T`<b>Odpowiedź:</b> $\frac{5^{26}}{8}-\frac{\sqrt3\cdot5^{26}}{8}i$`],
  };
  /* ---------- kąty: ułamki π, kąt odniesienia, wartości dla π/12 i π/8 ---------- */
  const gcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a || 1; };
  AQ.piFrac = x => { const t = (((x / Math.PI) % 2) + 2) % 2; return AQ.ratApprox(t, 72); }; // [p,q]: kąt = pπ/q w [0, 2π)
  const aT = (p, q) => AQ.angleTex(p, q);
  // linijki wyjaśniające cos i sin kąta pπ/q, gdy nie ma go w tabelce (mianownik 12 albo 8)
  AQ.trigLines = function (p, q, done) {
    const g = gcd(p, q); p /= g; q /= g;
    if (q !== 12 && q !== 8) return [];
    // kąt odniesienia rp/rq w (0, π/2)
    const t = p / q; let rp, quad;
    if (t < 0.5) { rp = p; quad = 1; } else if (t < 1) { rp = q - p; quad = 2; } else if (t < 1.5) { rp = p - q; quad = 3; } else { rp = 2 * q - p; quad = 4; }
    const out = [];
    const key = rp + '/' + q;
    if (!done.has(key)) {
      done.add(key);
      if (q === 12 && rp === 1) out.push(T`Kąta $\frac{\pi}{12}$ nie ma w tabelce. Rozbijamy go na kąty z tabelki: $\frac{\pi}{12}=\frac{\pi}{3}-\frac{\pi}{4}$ (bo $\frac{4}{12}-\frac{3}{12}=\frac{1}{12}$, a $\frac{4}{12}=\frac13$, $\frac{3}{12}=\frac14$). Wzory na różnicę: $$\cos\frac{\pi}{12}=\cos\frac\pi3\cos\frac\pi4+\sin\frac\pi3\sin\frac\pi4=\frac12\cdot\frac{\sqrt2}2+\frac{\sqrt3}2\cdot\frac{\sqrt2}2=\frac{\sqrt2+\sqrt6}{4}$$ $$\sin\frac{\pi}{12}=\sin\frac\pi3\cos\frac\pi4-\cos\frac\pi3\sin\frac\pi4=\frac{\sqrt3}2\cdot\frac{\sqrt2}2-\frac12\cdot\frac{\sqrt2}2=\frac{\sqrt6-\sqrt2}{4}$$`);
      if (q === 12 && rp === 5) out.push(T`Kąta $\frac{5\pi}{12}$ nie ma w tabelce. Rozbijamy go na kąty z tabelki: $\frac{5\pi}{12}=\frac{\pi}{4}+\frac{\pi}{6}$ (bo $\frac{3}{12}+\frac{2}{12}=\frac{5}{12}$, a $\frac{3}{12}=\frac14$, $\frac{2}{12}=\frac16$). Wzory na sumę: $$\cos\frac{5\pi}{12}=\cos\frac\pi4\cos\frac\pi6-\sin\frac\pi4\sin\frac\pi6=\frac{\sqrt2}2\cdot\frac{\sqrt3}2-\frac{\sqrt2}2\cdot\frac12=\frac{\sqrt6-\sqrt2}{4}$$ $$\sin\frac{5\pi}{12}=\sin\frac\pi4\cos\frac\pi6+\cos\frac\pi4\sin\frac\pi6=\frac{\sqrt2}2\cdot\frac{\sqrt3}2+\frac{\sqrt2}2\cdot\frac12=\frac{\sqrt6+\sqrt2}{4}$$`);
      if (q === 8 && rp === 1) out.push(T`Kąta $\frac{\pi}{8}$ nie ma w tabelce, ale $2\cdot\frac\pi8=\frac\pi4$ już jest. Wzory na połowę kąta: $$\cos^2\frac\pi8=\frac{1+\cos\frac\pi4}{2}=\frac{2+\sqrt2}{4},\qquad \sin^2\frac\pi8=\frac{1-\cos\frac\pi4}{2}=\frac{2-\sqrt2}{4}$$ więc $\cos\frac\pi8=\frac{\sqrt{2+\sqrt2}}{2}$, $\sin\frac\pi8=\frac{\sqrt{2-\sqrt2}}{2}$ (oba dodatnie, bo I ćwiartka).`);
      if (q === 8 && rp === 3) out.push(T`Kąta $\frac{3\pi}{8}$ nie ma w tabelce, ale $2\cdot\frac{3\pi}8=\frac{3\pi}4$ i $\cos\frac{3\pi}4=-\frac{\sqrt2}2$. Wzory na połowę kąta: $$\cos^2\frac{3\pi}8=\frac{1-\frac{\sqrt2}2}{2}=\frac{2-\sqrt2}{4},\qquad \sin^2\frac{3\pi}8=\frac{2+\sqrt2}{4}$$ więc $\cos\frac{3\pi}8=\frac{\sqrt{2-\sqrt2}}{2}$, $\sin\frac{3\pi}8=\frac{\sqrt{2+\sqrt2}}{2}$.`);
    }
    if (quad !== 1) {
      const sg = { 2: ['ujemny', 'dodatni'], 3: ['ujemny', 'ujemny'], 4: ['dodatni', 'ujemny'] }[quad];
      const rel = { 2: T`\pi-`, 3: T`\pi+`, 4: T`2\pi-` }[quad];
      out.push(T`$${aT(p, q)}=${rel}${aT(rp, q)}$ leży w ${['', 'I', 'II', 'III', 'IV'][quad]} ćwiartce: wartości bierzemy z kąta odniesienia $${aT(rp, q)}$, cosinus jest ${sg[0]}, sinus ${sg[1]}.`);
    }
    return out;
  };
  // rozwiązanie „krok po kroku” dla wszystkich pierwiastków stopnia n z liczby W
  AQ.rootSteps = function (W, n, Wtex) {
    const Cx = AQ.C, m = Cx.abs(W), f = AQ.piFrac(Cx.arg(W));
    const nr = AQ.niceReal;
    if (!f && n === 2) { // kąt nie jest „ładny” — pierwiastek kwadratowy liczymy algebraicznie
      const a0 = W.re, b0 = W.im, X = (a0 + m) / 2, Y = (m - a0) / 2, x0 = Math.sqrt(X), y0 = Math.sign(b0 || 1) * Math.sqrt(Y);
      const w = Cx.C(x0, y0), pw2 = t => (/^-/.test(t) ? '\\left(' + t + '\\right)' : t);
      return { roots: [w, Cx.neg(w)], lines: [
        T`Kąt liczby $${AQ.niceC(W)}$ nie jest z tabelki, więc pierwiastek kwadratowy liczymy algebraicznie: szukamy $w=x+iy$ takiego, że $w^2=${AQ.niceC(W)}$.`,
        T`$(x+iy)^2=x^2-y^2+2xyi$. Porównujemy części: $x^2-y^2=${nr(a0)}$ oraz $2xy=${nr(b0)}$. Porównując moduły: $x^2+y^2=|z|=\sqrt{${pw2(nr(a0))}^2+${pw2(nr(b0))}^2}=${nr(m)}$.`,
        T`Dodajemy pierwsze i trzecie równanie: $2x^2=${nr(a0 + m)}$, więc $x^2=${nr(X)}$; odejmujemy: $y^2=${nr(Y)}$.`,
        T`Z $2xy=${nr(b0)}$: liczby $x$ i $y$ mają ${b0 >= 0 ? 'ten sam znak' : 'przeciwne znaki'}. Stąd $w=\pm\left(${AQ.niceC(w)}\right)$.`,
      ] };
    }
    if (!f) return null;
    const [p, q] = f, out = [];
    const a = W.re, b = W.im;
    const simple = AQ.niceC(W);
    if (Wtex && Wtex.replace(/\s/g, '') !== simple.replace(/\s/g, '')) out.push(T`Najpierw upraszczamy liczbę pod pierwiastkiem: $${Wtex}=${simple}$.`);
    const pw = t => (/^-|[+-]/.test(t.slice(1)) || /^-/.test(t) ? '\\left(' + t + '\\right)' : t);
    out.push(T`Postać trygonometryczna: $|z|=\sqrt{${pw(nr(a))}^2+${pw(nr(b))}^2}=${nr(m)}$, a z $\cos\varphi=\frac{${nr(a)}}{${nr(m)}}$ i $\sin\varphi=\frac{${nr(b)}}{${nr(m)}}$ odczytujemy $\varphi=${aT(p, q)}$. Zatem $z=${AQ.polarTex(W)}$.`);
    const rr = nr(Math.pow(m, 1 / n));
    out.push(T`Pierwiastek stopnia $${n}$ ma $${n}$ wartości: $$w_k=\sqrt[${n}]{|z|}\left(\cos\frac{\varphi+2k\pi}{${n}}+i\sin\frac{\varphi+2k\pi}{${n}}\right),\quad k=0,\ldots,${n - 1}$$ Moduł każdej wartości: $\sqrt[${n}]{${nr(m)}}=${rr}$.`);
    const done = new Set(), roots = [], extra = [];
    for (let k = 0; k < n; k++) {
      const np = p + 2 * k * q, nq = q * n, g = gcd(np, nq);
      const th = (np / g) * Math.PI / (nq / g), w = Cx.polar(Math.pow(m, 1 / n), th);
      roots.push(w);
      const parts = [];
      if (k === 0) parts.push(T`\frac{${aT(p, q)}}{${n}}`);
      else {
        const two = (2 * k === 1 ? '' : 2 * k) + '\\pi';
        parts.push(T`\frac{${aT(p, q)}+${two}}{${n}}`);
        if (q > 1 && p !== 0) parts.push(T`\frac{${aT(p, q)}+\frac{${2 * k * q}\pi}{${q}}}{${n}}`);
        if (p !== 0) parts.push(T`\frac{${aT(np, q)}}{${n}}`);
      }
      if (nq / g !== q * n || np / g !== np) parts.push(T`\frac{${np === 1 ? '' : np}\pi}{${nq}}`);
      parts.push(aT(np / g, nq / g));
      const uniq = parts.filter((x, i2) => parts.indexOf(x) === i2);
      const tl = AQ.trigLines(np / g, nq / g, done);
      if (tl.length) out.push(...tl);
      const alg = AQ.niceC(w);
      out.push(T`$k=${k}$: kąt $${uniq.join('=')}$, więc $w_${k}=${AQ.polarTex(w)}${/\d\.\d|e[+-]/.test(alg) ? '' : '=' + alg}$.`);
    }
    return { lines: out, roots };
  };

  AQ.autoSol = function (expr) {
    let ast; try { ast = AQ.parse(expr, []); } catch (e) { return []; }
    const lines = [];
    const val = n => AQ.evaluate(n, {});
    const isLit = n => { const f = {}; try { AQ.evaluate(n, {}, f); } catch (e) { return false; } return !(f.complexMul || f.complexDiv || f.complexPow || f.complexRoot); };
    const wrap = t => (/ [+-] /.test(t) || /^-/.test(t) ? '\\left(' + t + '\\right)' : t);
    const nr = x => AQ.niceReal(x);
    const ugly = t => /\d\.\d|e[+-]\d|^0$/.test(t);
    const pw = t => (/^\d+$/.test(t) ? t : '\\left(' + t + '\\right)');
    function walk(n0) { // -> { v, t }: wartość i zapis do użycia w kolejnych liniach
      const n = strip(n0);
      if (isLit(n)) { const v = val(n); return { v, t: wrap(AQ.toTex(n)), lit: true }; }
      if (n.t === 'neg') { const a = walk(n.a); const v = Cx.neg(a.v); return { v, t: wrap(AQ.niceC(v)) }; }
      if (n.t === 'bin') {
        const a = walk(n.a), b = walk(n.b), v = val(n), res = AQ.niceC(v);
        if (n.op === '*') {
          let mid = '';
          const g = z => AQ.ratApprox(z.re, 64) && AQ.ratApprox(z.im, 64);
          if (a.v.re && a.v.im && b.v.re && b.v.im && g(a.v) && g(b.v)) mid = fix(`${nr(a.v.re * b.v.re)} + ${nr(a.v.re * b.v.im)}i + ${nr(a.v.im * b.v.re)}i + ${nr(a.v.im * b.v.im)}i^2 = `).replace(/(^|[+-] )1i/g, '$1i');
          lines.push(`$${a.t}\\cdot ${b.t} = ${mid}${res}$` + (mid ? ' (bo $i^2=-1$)' : ''));
        } else if (n.op === '/') {
          if (!Cx.isReal(b.v)) {
            const cb = Cx.conj(b.v), num = Cx.mul(a.v, cb), den = b.v.re * b.v.re + b.v.im * b.v.im;
            if (ugly(AQ.niceC(num)) || ugly(nr(den))) lines.push(`Dzielimy w postaci trygonometrycznej — moduły dzielimy, argumenty odejmujemy: $$\\frac{${AQ.polarTex(a.v)}}{${AQ.polarTex(b.v)}} = ${AQ.polarTex(v)} = ${res}$$`);
            else lines.push(`Dzielenie: mnożymy licznik i mianownik przez sprzężenie mianownika, czyli przez $${AQ.niceC(cb)}$: $$\\frac{${AQ.niceC(a.v)}}{${AQ.niceC(b.v)}} = \\frac{${wrap(AQ.niceC(a.v))}${wrap(AQ.niceC(cb))}}{${wrap(AQ.niceC(b.v))}${wrap(AQ.niceC(cb))}} = \\frac{${AQ.niceC(num)}}{${nr(den)}} = ${res}$$`);
          } else lines.push(`$\\frac{${AQ.niceC(a.v)}}{${AQ.niceC(b.v)}} = ${res}$`);
        } else lines.push(fix(`$${AQ.niceC(a.v)} ${n.op} ${wrap(AQ.niceC(b.v))} = ${res}$`));
        return { v, t: wrap(res) };
      }
      if (n.t === 'pow') {
        const a = walk(n.a), e = val(n.b), v = val(n), res = AQ.niceC(v), k = Math.round(e.re);
        const bt = AQ.niceC(a.v);
        if (k === 2) lines.push(fix(`$\\left(${bt}\\right)^2 = ${wrap(nr(a.v.re))}^2 + 2\\cdot${wrap(nr(a.v.re))}\\cdot${wrap(nr(a.v.im))}i + \\left(${nr(a.v.im)}i\\right)^2 = ${res}$`));
        else if (k === 3 && AQ.ratApprox(a.v.re, 64) && AQ.ratApprox(a.v.im, 64)) lines.push(`Ze wzoru $(a+bi)^3=(a^3-3ab^2)+(3a^2b-b^3)i$ dla $a=${nr(a.v.re)}$, $b=${nr(a.v.im)}$: $\\left(${bt}\\right)^3 = ${res}$`);
        else {
          const m = Cx.abs(a.v), ph = AQ.argTex(a.v), r = AQ.ratApprox((((Cx.arg(a.v) / Math.PI) % 2) + 2) % 2, 48);
          lines.push(`Postać trygonometryczna podstawy: $\\left|${bt}\\right| = \\sqrt{${pw(nr(a.v.re))}^2 + ${pw(nr(a.v.im))}^2} = ${nr(m)}$, argument $\\varphi = ${ph}$, więc $${bt} = ${AQ.polarTex(a.v)}$.`);
          lines.push(`Wzór de Moivre’a — moduł podnosimy do potęgi, argument mnożymy przez $${k}$: $$\\left(${bt}\\right)^{${k}} = ${pw(nr(m))}^{${k}}\\left(\\cos\\left(${k}\\cdot${AQ.parTex(ph)}\\right) + i\\sin\\left(${k}\\cdot${AQ.parTex(ph)}\\right)\\right)$$`);
          const mk = pw(nr(m)) + '^{' + k + '}', mv = nr(Cx.abs(v)), mt = ugly(mv) ? mk : mv;
          if (r) {
            const tot = k * r[0] / r[1];
            lines.push(`Kąt: $${k}\\cdot${AQ.parTex(ph)} = ${AQ.angleTex(k * r[0], r[1])}$` + (tot >= 0 && tot < 2 ? '.' : `. Odejmujemy pełne obroty (wielokrotności $2\\pi$) — zostaje $${AQ.niceAngle(k * Cx.arg(a.v))}$.`) + (mt === mk || mk === mv ? '' : ` Moduł: $${mk} = ${mv}$.`));
          }
          const core = '\\cos ' + AQ.parTex(AQ.niceAngle(k * Cx.arg(a.v))) + ' + i\\sin ' + AQ.parTex(AQ.niceAngle(k * Cx.arg(a.v)));
          lines.push(`Zatem $\\left(${bt}\\right)^{${k}} = ${mt === '1' ? core : mt + '\\left(' + core + '\\right)'} = ${res}$.`);
        }
        return { v, t: wrap(res) };
      }
      const v = val(n); return { v, t: wrap(AQ.niceC(v)) };
    }
    let out; try { out = walk(ast); } catch (e) { return []; }
    lines.push(`<b>Odpowiedź:</b> $${AQ.niceC(out.v)}$`);
    return lines;
  };
})(typeof window !== 'undefined' ? window : globalThis);
