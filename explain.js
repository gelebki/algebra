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
      T`Moduł: $|z|^{12}=\left(|z|^2\right)^6=4^6(2-\sqrt3)^6=4096\left((2-\sqrt3)^2\right)^3=4096\,(7-4\sqrt3)^3=4096\,(1351-780\sqrt3)$.`,
      T`<b>Odpowiedź:</b> $-4096\left(1351-780\sqrt3\right)$`],
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
