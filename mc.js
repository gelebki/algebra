/* Algebrownia — odpowiedzi A/B/C/D: błędne opcje to typowe błędy rachunkowe */
(function (G) {
  'use strict';
  const A = G.AQ, Cx = A.C, C = Cx.C, PI = Math.PI;
  const md = (x, p) => ((Math.round(x) % p) + p) % p;
  const dec = t => /\d\.\d|e[+-]\d/.test(t);

  /* ---------- formatowanie wartości ---------- */
  function realTex(x) {
    let t = A.niceReal(x, Math.abs(x) < 1e-6 && x !== 0);
    if (dec(t) && Math.abs(x) < 60) { const r = A.ratApprox(x / PI, 48); if (r) t = A.angleTex(r[0], r[1]); }
    return t;
  }
  function cTex(z) {
    const m = Cx.abs(z);
    if (m === 0) return '0';
    if (Math.abs(z.im) < 1e-10 * m) return realTex(z.re);
    const a = A.niceC(z);
    return dec(a) ? A.polarTex(z) : a;
  }
  A.cTex = cTex;
  function valTex(f, v) {
    if (v && v.tex) return v.tex;
    if (v === 'brak') return '\\text{brak}';
    if (typeof v === 'boolean') return v ? '\\text{tak}' : '\\text{nie}';
    if (v && v.expr !== undefined) return A.toTex(A.parse(v.expr, f.vars || []));
    if (Array.isArray(v)) return v.length ? '\\left\\{' + v.map(cTex).join(',\\quad ') + '\\right\\}' : '\\varnothing';
    if (f.kind === 'angle') return A.niceAngle(v.re);
    if (f.kind === 'mod') return String(md(v.re, f.mod));
    if (f.kind === 'pm') return '\\pm\\left(' + cTex(v) + '\\right)';
    return cTex(v);
  }

  /* ---------- wartość poprawna ---------- */
  function correctVal(f) {
    if (f.kind === 'yesno') return !!f.ans;
    if (f.ans === 'brak') return 'brak';
    if ((f.vars || []).length) {
      if (typeof f.ans !== 'string') return null;
      let usesVar = false; try { const walk = n => { if (!n || typeof n !== 'object') return; if (n.t === 'var') usesVar = true; Object.values(n).forEach(walk); }; walk(A.parse(f.ans, f.vars)); } catch (e) { usesVar = true; }
      if (usesVar) return { expr: f.ans };
      return A.expected(f, A.sampleEnvs(f)[0]);
    }
    const v = A.expected(f, {});
    if (!Array.isArray(v) && !f.scale && Cx.abs(v) < 1e-12) return C(0);
    if (Array.isArray(v)) return v.map(z => Cx.abs(z) < 1e-12 ? C(0) : z);
    return v;
  }

  /* ---------- porównanie ---------- */
  function eqVal(f, u, v) {
    if (u === v) return true;
    if (u === 'brak' || v === 'brak' || typeof u === 'boolean' || typeof v === 'boolean') return false;
    if (u.tex || v.tex) return u.tex === v.tex;
    if (u.expr !== undefined) {
      try {
        const pu = A.parse(u.expr, f.vars), pv = A.parse(v.expr, f.vars);
        return A.sampleEnvs(f).every(env => { try { return A.close(A.evaluate(pu, env), A.evaluate(pv, env)); } catch (e) { return false; } });
      } catch (e) { return false; }
    }
    if (Array.isArray(u)) {
      if (!Array.isArray(v) || u.length !== v.length) return false;
      const used = v.map(() => false);
      return u.every(a => { const j = v.findIndex((b, k) => !used[k] && A.close(a, b, 1e-6)); if (j < 0) return false; used[j] = true; return true; });
    }
    if (f.scale && !Array.isArray(u)) { u = Cx.mul(u, C(f.scale)); v = Cx.mul(v, C(f.scale)); }
    if (f.kind === 'angle') return A.angleClose(u, v);
    if (f.kind === 'mod') return md(u.re, f.mod) === md(v.re, f.mod);
    if (f.kind === 'pm') return A.close(u, v) || A.close(u, Cx.neg(v));
    return A.close(u, v);
  }
  const tupleEq = (F, a, b) => F.every((f, i) => eqVal(f, a[i], b[i]));

  /* ---------- tryby „błędnych rachunków” na wyrażeniu ---------- */
  function evalMode(ast, mode) {
    const ev = n => {
      switch (n.t) {
        case 'num': return C(n.v);
        case 'par': return ev(n.a);
        case 'const': return n.v === 'pi' ? C(PI) : n.v === 'e' ? C(Math.E) : C(0, 1);
        case 'neg': return Cx.neg(ev(n.a));
        case 'bin': {
          const a = ev(n.a), b = ev(n.b);
          if (n.op === '+') return Cx.add(a, b);
          if (n.op === '-') return Cx.sub(a, b);
          if (n.op === '*') return mode === 'split' ? C(a.re * b.re + a.im * b.im, a.re * b.im + a.im * b.re) : Cx.mul(a, b);
          if (n.op === '/') {
            if (mode === 'split') { const d = b.re * b.re - b.im * b.im; if (Math.abs(d) < 1e-12) throw 0; return C((a.re * b.re - a.im * b.im) / d, (a.im * b.re - a.re * b.im) / d); }
            if (Cx.isReal(b)) return Cx.div(a, b);
            if (mode === 'nonorm') return Cx.mul(a, Cx.conj(b));
            if (mode === 'conjdiv') return Cx.div(a, Cx.conj(b));
            return Cx.div(a, b);
          }
          break;
        }
        case 'pow': {
          const e = ev(n.b);
          let base = n.a; while (base.t === 'par') base = base.a;
          if (mode === 'fresh' && base.t === 'bin' && (base.op === '+' || base.op === '-') && Cx.isReal(e) && Math.abs(e.re) <= 12) {
            const x = Cx.pow(ev(base.a), e), y = Cx.pow(ev(base.b), e);
            return base.op === '+' ? Cx.add(x, y) : Cx.sub(x, y);
          }
          const a = ev(n.a);
          if (mode === 'split' && Cx.isReal(e) && Number.isInteger(e.re) && e.re > 0) { let r = C(1); for (let k = 0; k < e.re; k++) r = C(r.re * a.re + r.im * a.im, r.re * a.im + r.im * a.re); return r; }
          return Cx.pow(a, e);
        }
        case 'fn': {
          const x = ev(n.args[n.n === 'root' ? 1 : 0]);
          if (n.n === 'sqrt') return Cx.nroot(x, 2);
          if (n.n === 'cbrt') return Cx.nroot(x, 3);
          if (n.n === 'sin') return C(Math.sin(x.re));
          if (n.n === 'cos') return C(Math.cos(x.re));
          throw 0;
        }
      }
      throw 0;
    };
    return ev(ast);
  }
  const MODE_WHY = {
    split: 'Przyjęto $i^2=1$ zamiast $i^2=-1$.',
    fresh: 'Potęga sumy policzona jak suma potęg: $(a+b)^n\\neq a^n+b^n$.',
    nonorm: 'Pomnożono przez sprzężenie mianownika, ale zapomniano podzielić przez $|{\\rm mianownik}|^2$.',
    conjdiv: 'Podzielono przez sprzężenie mianownika zamiast przez sam mianownik.',
  };

  /* ---------- operacje na zapisie wyrażenia ---------- */
  function terms(s) { // [[znak, składnik], ...] na najwyższym poziomie
    const out = []; let d = 0, cur = '', sign = '+';
    let i = 0; if (s[0] === '-' || s[0] === '+') { sign = s[0]; i = 1; }
    for (; i < s.length; i++) {
      const ch = s[i];
      if (ch === '(') d++; if (ch === ')') d--;
      if (d === 0 && (ch === '+' || ch === '-') && cur && !/[\^*/(]$/.test(cur)) { out.push([sign, cur]); sign = ch; cur = ''; } else cur += ch;
    }
    out.push([sign, cur]); return out;
  }
  const join = ts => ts.map(([sg, t], k) => (k === 0 ? (sg === '-' ? '-' : '') : sg) + t).join('');
  const negStr = s => join(terms(s).map(([sg, t]) => [sg === '-' ? '+' : '-', t]));
  const dblStr = s => terms(s).length > 1 ? '2(' + s + ')' : (/^-/.test(s) ? '-2*' + s.slice(1) : '2*' + s);
  /* ---------- mutacje pojedynczej wartości ---------- */
  function rnd(a) { return a[Math.floor(Math.random() * a.length)]; }
  function mutations(f, v) {
    const out = [];
    const add = (val, why) => { if (val != null) out.push({ v: val, why }); };
    if (v == null) return out;
    if (v === 'brak') { add(C(0), 'Uznano, że wynik to $0$ — a on nie istnieje.'); add(C(1), 'Pomylono z elementem neutralnym mnożenia.'); add(C(-1), 'Zgadnięta wartość — tu nie ma takiego elementu.'); return out; }
    if (typeof v === 'boolean') { add(!v, v ? 'Własność jest spełniona — kontrprzykład nie istnieje.' : 'Wystarczy jeden kontrprzykład, żeby własność nie zachodziła.'); return out; }
    if (v.expr !== undefined) {
      const s = v.expr;
      const swapSC = s.replace(/sin/g, '§').replace(/cos/g, 'sin').replace(/§/g, 'cos');
      if (swapSC !== s) add({ expr: swapSC }, 'Pomylone $\\sin$ i $\\cos$.');
      const swapT = s.replace(/ctg/g, '§').replace(/tg/g, 'ctg').replace(/§/g, 'tg');
      if (swapT !== s) add({ expr: swapT }, 'Pomylone $\\operatorname{tg}$ i $\\operatorname{ctg}$.');
      const ts = terms(s);
      { // ułamek N/D na najwyższym poziomie
        let d = 0, at = -1; for (let i = 0; i < s.length; i++) { const ch = s[i]; if (ch === '(') d++; if (ch === ')') d--; if (d === 0 && ch === '/') { at = i; break; } }
        if (at > 0 && ts.length === 1) {
          const unp = x => (x[0] === '(' && x[x.length - 1] === ')' ? x.slice(1, -1) : x);
          const N = unp(s.slice(0, at)), D = unp(s.slice(at + 1)); const wrap = x => terms(x).length > 1 ? '(' + x + ')' : x;
          const tn = terms(N), td = terms(D);
          if (tn.length > 1) { const a = tn.map(x => x.slice()); a[1][0] = a[1][0] === '+' ? '-' : '+'; add({ expr: wrap(join(a)) + '/' + wrap(D) }, 'Zły znak w liczniku.'); }
          if (td.length > 1) { const a = td.map(x => x.slice()); a[td.length - 1][0] = a[td.length - 1][0] === '+' ? '-' : '+'; add({ expr: wrap(N) + '/' + wrap(join(a)) }, 'Zły znak w mianowniku.'); }
          if (/[a-z]/.test(D)) add({ expr: wrap(D) + '/' + wrap(N) }, 'Odwrócony ułamek.');
          else add({ expr: N }, 'Zapomniano podzielić przez mianownik.');
        }
      }
      if (ts.length > 1) { const a = ts.map(x => x.slice()); a[1][0] = a[1][0] === '+' ? '-' : '+'; add({ expr: join(a) }, 'Błąd znaku w jednym ze składników.'); }
      if (ts.length > 2) { const a = ts.map(x => x.slice()); const L = a.length - 1; a[L][0] = a[L][0] === '+' ? '-' : '+'; add({ expr: join(a) }, 'Błąd znaku w ostatnim składniku.'); }
      add({ expr: negStr(s) }, 'Zgubiony minus przed całym wyrażeniem.');
      if (/\^2/.test(s)) add({ expr: s.replace(/\^2/, '') }, 'Zgubiony kwadrat.');
      const cm = s.match(/^(\d+)/);
      if (cm) { add({ expr: s.slice(cm[1].length) }, 'Zgubiony współczynnik $' + cm[1] + '$.'); add({ expr: (+cm[1] + 1) + s.slice(cm[1].length) }, 'Błąd we współczynniku.'); }
      const im = s.match(/(\D)(\d+)(?=[a-z(])/);
      if (im && im.index > 0) add({ expr: s.slice(0, im.index + 1) + (+im[2] === 2 ? 4 : +im[2] - 1) + s.slice(im.index + 1 + im[2].length) }, 'Błąd we współczynniku dwumianu Newtona.');
      if (!s.includes('/')) add({ expr: dblStr(s) }, 'Zgubiony (lub dodany) czynnik $2$.');
      if (/\^n/.test(s)) add({ expr: s.replace(/\^n/, '^(n+1)') }, 'Pomyłka o jeden w wykładniku.');
      if (s === 'n') { add({ expr: 'n+1' }, 'Pomyłka o jeden.'); add({ expr: 'm' }, 'Pomylone $n$ i $m$.'); add({ expr: '1' }, 'Każdy składnik to $1$, ale jest ich $n$.'); }
      return out;
    }
    if (Array.isArray(v)) {
      const n = v.length;
      add(v.map(Cx.conj), 'Sprzężenia rozwiązań zamiast rozwiązań (błąd znaku przy $i$).');
      add(v.map(Cx.neg), 'Liczby przeciwne do rozwiązań (zły znak we wzorze).');
      if (n >= 2) { const zi = v.findIndex(z => Cx.abs(z) < 1e-12); add(v.filter((_, k) => k !== (zi >= 0 ? zi : n - 1)), zi >= 0 ? 'Zgubione rozwiązanie $z=0$.' : 'Zgubione jedno z rozwiązań.'); }
      if (n >= 2) add([v[0]], 'Podana tylko jedna wartość — a jest ich ' + n + '.');
      if (n >= 3) { const nz = v.filter(z => Cx.abs(z) > 1e-12); add(v.map(z => Cx.abs(z) < 1e-12 ? z : Cx.mul(z, Cx.polar(1, PI / nz.length))), 'Argumenty przesunięte — zapomniano o $\\frac{\\varphi+2k\\pi}{n}$ (a nie $\\frac{\\varphi}{n}+\\ldots$).'); }
      if (n >= 2) { const nz = v.filter(z => Cx.abs(z) > 1e-12); if (nz.length && Math.abs(Cx.abs(nz[0]) - 1) > 1e-6) add(v.map(z => Cx.abs(z) < 1e-12 ? z : Cx.mul(z, C(Cx.abs(z) ** (nz.length - 1)))), 'Nie wyciągnięto pierwiastka z modułu.'); }
      add([], 'Uznano, że nie ma żadnych — a są.');
      if (n === 1) add([C(v[0].re + 1, v[0].im)], 'Pomyłka o $1$.');
      if (n === 1) { add([v[0], Cx.neg(v[0])], 'Dopisane rozwiązanie, które nie spełnia równania.'); add([Cx.conj(v[0])], 'Błąd znaku w części urojonej.'); }
      if (n === 2) add([v[0], Cx.conj(v[1])], 'Błąd znaku przy liczeniu $\\sqrt{\\Delta}$.');
      if (!v.some(z => Cx.abs(z) < 1e-12)) add([C(0), ...v], 'Dopisane $0$, które tu nie pasuje.');
      add([...v, Cx.neg(v[0])].filter((z, k, arr) => arr.findIndex(w => A.close(w, z)) === k), 'Dopisana liczba przeciwna, która nie spełnia warunku.');
      add(v.map(z => Cx.mul(z, C(2))), 'Zgubiony czynnik $2$.');
      add([...v, C(1)].filter((z, k, arr) => arr.findIndex(w => A.close(w, z)) === k), 'Dopisane $1$ — sprawdź warunek dla tej liczby.');
      return out;
    }
    if (f.kind === 'mod') {
      const p = f.mod, x = md(v.re, p);
      add(C((p - x) % p), 'Wzięto element przeciwny ($-a$) zamiast właściwego.');
      add(C((x + 1) % p), 'Pomyłka o $1$ przy redukcji modulo $' + p + '$.');
      add(C((x + p - 1) % p), 'Pomyłka o $1$ przy redukcji modulo $' + p + '$.');
      add(C((2 * x) % p), 'Błąd rachunkowy — policz jeszcze raz i weź resztę z dzielenia.');
      add(C((x * x) % p), 'Błąd przy braniu reszty z dzielenia.');
      return out.filter(m => md(m.v.re, p) !== x);
    }
    if (f.kind === 'angle') {
      add(C(PI - v.re), 'Zła ćwiartka: $\\pi-\\varphi$ zamiast $\\varphi$.');
      add(C(-v.re), 'Zły znak argumentu.');
      add(C(v.re + PI), 'Kąt przesunięty o $\\pi$ — to punkt po przeciwnej stronie zera. Sprawdź znaki $\\cos\\varphi$ i $\\sin\\varphi$.');
      add(C(PI / 2 - v.re), 'Pomylone $\\sin$ i $\\cos$.');
      return out;
    }
    if (f.kind === 'pm') {
      add(Cx.conj(v), 'Brak sprzężenia (albo sprzężenie zbędne).');
      add(Cx.mul(v, C(0, 1)), 'Pomnożono przez $i$ — zły argument o $\\frac{\\pi}{2}$.');
      add(C(v.im, v.re), 'Zamienione części rzeczywista i urojona.');
      add(Cx.mul(v, C(2)), 'Zgubiony czynnik $2$.');
      return out;
    }
    // zwykła liczba
    if (Math.abs(v.im) <= 1e-10 * Cx.abs(v)) {
      const x = v.re;
      if (Math.abs(x) > 1e-12) add(C(-x), 'Błąd znaku.');
      if (Math.abs(x) > 1e-12 && Math.abs(Math.abs(x) - 1) > 1e-9) add(C(1 / x), 'Odwrotność zamiast wyniku.');
      const r2 = A.ratApprox(x * x, 48);
      if (r2 && !A.ratApprox(x, 48)) { add(C(x * x), 'Zapomniany pierwiastek.'); }
      if (Number.isInteger(Math.round(x * 1e9) / 1e9) && Math.abs(x) < 1e6) { add(C(x + 1), 'Pomyłka o $1$ w rachunkach.'); add(C(x - 1), 'Pomyłka o $1$ w rachunkach.'); }
      if (Math.abs(x) > 1e-12) { add(C(2 * x), 'Wynik dwa razy za duży — sprawdź jeszcze raz rachunek (np. potęgę modułu albo dzielenie przez $2$).'); add(C(x / 2), 'Wynik dwa razy za mały — sprawdź jeszcze raz rachunek (np. potęgę modułu albo mnożenie przez $2$).'); }
      else { add(C(1), 'Błąd: suma/wartość wynosi $0$, a nie $1$.'); add(C(-1), 'Błąd: wynik to $0$.'); add('brak', 'Wartość istnieje — to $0$.'); }
      return out;
    }
    add(Cx.conj(v), 'Błąd znaku w części urojonej (np. zgubiony minus przy $i^2$).');
    add(Cx.neg(v), 'Zgubiony minus przed całym wynikiem.');
    add(C(v.im, v.re), 'Zamienione części rzeczywista i urojona.');
    add(Cx.mul(v, C(0, 1)), 'Zły argument — pomyłka o $\\frac{\\pi}{2}$.');
    add(C(-v.re, v.im), 'Błąd znaku w części rzeczywistej.');
    return out;
  }

  /* ---------- pułapki zależne od zadania ---------- */
  const TRAPS = {
    trig(F, cv) { // [sin, cos, tg, ctg]
      const [s, c, t, k] = cv; const o = [];
      o.push({ vals: [c, s, k, t], why: 'Pomylone $\\sin$ z $\\cos$ (i $\\operatorname{tg}$ z $\\operatorname{ctg}$).' });
      const neg = x => (x === 'brak' ? x : Cx.neg(x));
      o.push({ vals: [neg(s), c, neg(t), neg(k)], why: 'Zły znak sinusa — źle rozpoznana ćwiartka.' });
      o.push({ vals: [s, neg(c), neg(t), neg(k)], why: 'Zły znak cosinusa — źle rozpoznana ćwiartka.' });
      o.push({ vals: [s, c, k, t], why: 'Pomylone $\\operatorname{tg}$ i $\\operatorname{ctg}$.' });
      o.push({ vals: [neg(s), neg(c), t, k], why: 'Odbity kąt o $\\pi$ — oba znaki złe.' });
      return o;
    },
    polar(F, cv) { // [r, phi]
      const [r, f] = cv; return [
        { vals: [C(r.re * r.re), f], why: 'Moduł bez pierwiastka: $a^2+b^2$ zamiast $\\sqrt{a^2+b^2}$.' },
        { vals: [r, C(PI - f.re)], why: 'Zła ćwiartka argumentu.' },
        { vals: [r, C(f.re + PI)], why: 'Kąt przesunięty o $\\pi$ — to punkt po przeciwnej stronie zera. Sprawdź znaki $\\cos\\varphi$ i $\\sin\\varphi$.' },
        { vals: [r, C(PI / 2 - f.re)], why: 'Pomylone $\\cos\\varphi=\\frac a{|z|}$ i $\\sin\\varphi=\\frac b{|z|}$.' }];
    },
  };
  TRAPS.polarA = null;

  /* ---------- budowa pytania ---------- */
  function exprModes(f) {
    if (typeof f.ans !== 'string' || (f.vars || []).length || !/i/.test(f.ans)) return [];
    let ast; try { ast = A.parse(f.ans, []); } catch (e) { return []; }
    const out = [];
    for (const mode of ['split', 'fresh', 'nonorm', 'conjdiv']) { try { const v = evalMode(ast, mode); if (isFinite(v.re) && isFinite(v.im)) out.push({ v, why: MODE_WHY[mode] }); } catch (e) { /* tryb nie dotyczy */ } }
    return out;
  }
  function pick3(F, correct, cands) {
    const chosen = [];
    for (const c of cands) {
      if (chosen.length >= 3) break;
      if (c.vals.some(x => x == null)) continue;
      if (c.vals.some(x => Array.isArray(x) && x.some((z, k) => x.findIndex(w => A.close(w, z, 1e-6)) !== k))) continue;
      try {
        if (tupleEq(F, c.vals, correct)) continue;
        if (chosen.some(d => tupleEq(F, d.vals, c.vals))) continue;
        const tx = tupleTex(F, c.vals, false);
        if (dec(tx)) continue;
        chosen.push(c);
      } catch (e) { /* pomiń */ }
    }
    return chosen;
  }
  const shuffle = a => { const b = a.slice(); for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };

  const wordy = l => /^[a-ząćęłńóśźż ]{3,}$/i.test(l || '');
  const labTex = l => wordy(l) ? '\\text{' + l + '}' : (l || 'x');
  A.mcLabel = l => wordy(l) ? l : '$' + l + '$';
  function shown(f, v, showCorrect) {
    if (showCorrect && f.show) {
      const wrapSet = t => (f.kind === 'set' && !/^\\left\\\{/.test(t) ? '\\left\\{' + t + '\\right\\}' : t);
      if (v == null) return wrapSet(f.show); const t = valTex(f, v); return dec(t) ? wrapSet(f.show) : t;
    }
    return valTex(f, v);
  }
  const parNeg = t => (/^-/.test(t) ? '\\left(' + t + '\\right)' : t);
  function polarFmt(F, vals) { // |z|(cos φ + i sin φ)
    const r = valTex(F[0], vals[0]), ph = parNeg(valTex(F[1], vals[1]));
    const rt = r === '1' ? '' : (/ [+-] /.test(r) && !/^\\frac/.test(r) ? '\\left(' + r + '\\right)' : r);
    return rt + '\\left(\\cos ' + ph + ' + i\\sin ' + ph + '\\right)';
  }
  function tupleTex(F, vals, showCorrect, item) {
    if (item && item.fmt === 'polar' && F.length === 2) return polarFmt(F, vals);
    if (F.length === 1) {
      const f = F[0], body = shown(f, vals[0], showCorrect);
      if (/^z(_\d)?$/.test(f.label || '')) return f.label + (f.kind === 'set' ? ' \\in ' : ' = ') + body;
      return body;
    }
    return F.map((f, i) => {
      const cond = /^[a-z0-9]+\s*(=|\\ge|\\le)\s*\d|\\n?mid/.test(f.label || '');
      const OPSYM = { dodawanie: '+', odejmowanie: '-', 'mnożenie': '\\cdot', dzielenie: '\\div' };
      const lab = f.kind === 'yesno' ? (OPSYM[f.label] ? '\\left(' + OPSYM[f.label] + '\\right)' : '\\text{' + f.label + '}') : cond ? '\\text{gdy }' + f.label : labTex(f.label);
      return lab + (f.kind === 'yesno' || cond ? ':\\ ' : ' = ') + shown(f, vals[i], showCorrect);
    }).join(',\\quad ');
  }

  /* ---------- siatka 2×2: dwa niezależne błędy; każda cecha występuje w dokładnie dwóch opcjach ---------- */
  const AX = {
    trig() {
      const neg = x => (x === 'brak' ? x : Cx.neg(x));
      return [
        { why: 'Pomylone $\\sin$ z $\\cos$ (i $\\operatorname{tg}$ z $\\operatorname{ctg}$).', apply: v => [v[1], v[0], v[3], v[2]] },
        { why: 'Zły znak sinusa — źle rozpoznana ćwiartka.', apply: v => [neg(v[0]), v[1], neg(v[2]), neg(v[3])] },
        { why: 'Zły znak cosinusa — źle rozpoznana ćwiartka.', apply: v => [v[0], neg(v[1]), neg(v[2]), neg(v[3])] },
      ];
    },
    polar() {
      const R = (fn, why) => ({ field: 0, why, apply: v => { const n = fn(v[0].re); return n == null ? null : [C(n), v[1]]; } });
      const P = (fn, why) => ({ field: 1, why, apply: v => [v[0], C(fn(v[1].re))] });
      return shuffle([
        R(r => (Math.abs(r * r - r) < 1e-9 ? null : r * r), 'Moduł bez pierwiastka: $a^2+b^2$ zamiast $\\sqrt{a^2+b^2}$.'),
        R(r => r * Math.SQRT2, 'Błąd w module: $|z|=\\sqrt{a^2+b^2}$ — sprawdź rachunek pod pierwiastkiem.'),
        R(r => r / Math.SQRT2, 'Błąd w module: $|z|=\\sqrt{a^2+b^2}$ — sprawdź rachunek pod pierwiastkiem.'),
        R(r => 2 * r, 'Błąd w module: $|z|=\\sqrt{a^2+b^2}$, a nie $|a|+|b|$ ani $a^2+b^2$.'),
      ]).concat(shuffle([
        P(f => PI - f, 'Zła ćwiartka: zły znak $\\cos\\varphi$.'),
        P(f => f + PI, 'Przeciwna ćwiartka: kąt przesunięty o $\\pi$, więc oba znaki są złe.'),
        P(f => -f, 'Zły znak $\\sin\\varphi$ — odbicie względem osi rzeczywistej.'),
        P(f => PI / 2 - f, 'Pomylone $\\cos\\varphi=\\frac{a}{|z|}$ i $\\sin\\varphi=\\frac{b}{|z|}$.'),
      ]));
    },
  };
  function axesFor(F, correct, gk) {
    const ax = [];
    if (AX[gk]) ax.push(...AX[gk](F, correct));
    if (gk === 'polar') return ax;
    F.forEach((f, i) => {
      const list = [
        ...exprModes(f).map(m => ({ fn: () => m.v, why: m.why })),
        ...mutations(f, correct[i]).map(m => ({ why: m.why, fn: x => { try { const r = mutations(f, x).find(y => y.why === m.why); return r ? r.v : null; } catch (e) { return null; } } })),
      ];
      list.slice(0, 8).forEach(op => ax.push({ field: i, why: (F.length > 1 ? A.mcLabel(F[i].label) + ': ' : '') + op.why,
        apply: vals => { const n = op.fn(vals[i]); if (n == null) return null; const c = vals.slice(); c[i] = n; return c; } }));
    });
    return ax;
  }
  function okTuple(F, t, item) {
    if (!t || t.some(x => x == null)) return false;
    if (t.some(x => Array.isArray(x) && x.some((z, k) => x.findIndex(w => A.close(w, z, 1e-6)) !== k))) return false;
    try { return !dec(tupleTex(F, t, false, item)); } catch (e) { return false; }
  }
  function grid(F, correct, gk, item) {
    const ax = axesFor(F, correct, gk); const valid = [];
    const multi = F.length > 1 && new Set(ax.map(a => a.field)).size > 1;
    for (const pass of (multi ? [1, 2] : [2])) {
      for (let a = 0; a < ax.length && valid.length < 6; a++) for (let b = a + 1; b < ax.length && valid.length < 6; b++) {
        const X = ax[a], Y = ax[b];
        if (pass === 1 && X.field !== undefined && X.field === Y.field) continue;
        let o1, o2, o3;
        try { o1 = X.apply(correct); o2 = Y.apply(correct); o3 = o2 && X.apply(o2); } catch (e) { continue; }
        const all = [correct, o1, o2, o3];
        if (![o1, o2, o3].every(t => okTuple(F, t, item))) continue;
        let distinct = true;
        for (let p = 0; p < 4 && distinct; p++) for (let q = p + 1; q < 4; q++) if (tupleEq(F, all[p], all[q])) { distinct = false; break; }
        if (!distinct) continue;
        valid.push([{ vals: o1, why: X.why }, { vals: o2, why: Y.why }, { vals: o3, why: X.why + ' ' + Y.why }]);
      }
      if (valid.length) break;
    }
    return valid.length ? valid[Math.floor(Math.random() * Math.min(valid.length, 2))] : null;
  }

  function groupFor(F, gk, item) {
    const correct = F.map(correctVal);
    if (!correct.some(v => v == null)) {
      const g = grid(F, correct, gk, item);
      if (g) return { opts: shuffle([{ tex: tupleTex(F, correct, true, item), ok: true }, ...g.map(w => ({ tex: tupleTex(F, w.vals, false, item), ok: false, why: w.why }))]) };
    }
    let cands = [];
    if (TRAPS[gk]) cands.push(...TRAPS[gk](F, correct));
    if (F.length === 1) {
      const m = [...exprModes(F[0]), ...mutations(F[0], correct[0])];
      cands.push(...m.map(x => ({ vals: [x.v], why: x.why })));
    } else {
      const per = F.map((f, i) => mutations(f, correct[i]).concat(exprModes(f)).map(x => ({ i, v: x.v, why: x.why })));
      // zamiana dwóch wartości miejscami
      for (let i = 0; i < F.length; i++) for (let j = i + 1; j < F.length; j++) {
        if (F[i].kind === F[j].kind && F[i].kind !== 'yesno') { const vals = correct.slice(); [vals[i], vals[j]] = [vals[j], vals[i]]; cands.push({ vals, why: 'Zamienione wartości ' + A.mcLabel(F[i].label) + ' i ' + A.mcLabel(F[j].label) + '.' }); }
      }
      const yn = F.every(f => f.kind === 'yesno');
      if (yn) { // dwa zmienione naraz też są typowe
        for (let i = 0; i < F.length; i++) for (let j = i + 1; j < F.length; j++) { const vals = correct.slice(); vals[i] = !vals[i]; vals[j] = !vals[j]; cands.push({ vals, why: 'Źle ocenione: ' + F[i].label + ' i ' + F[j].label + '.' }); }
      }
      let round = 0, any = true; const singles = [];
      while (any) { any = false; per.forEach(list => { if (list[round]) { any = true; singles.push(list[round]); } }); round++; }
      singles.forEach(m => { const vals = correct.slice(); vals[m.i] = m.v; cands.push({ vals, why: (F.length > 1 ? A.mcLabel(F[m.i].kind === 'yesno' ? F[m.i].label + '' : F[m.i].label).replace(/^([^$])/, '$1') + ': ' : '') + m.why }); });
      if (yn) cands = shuffle(cands);
    }
    if (!TRAPS[gk] && F.length > 1 && !F.every(f => f.kind === 'yesno')) { const [first, ...rest] = cands; cands = [first, ...shuffle(rest)].filter(Boolean); }
    const wrong = pick3(F, correct, cands);
    const opts = [{ tex: tupleTex(F, correct, true, item), ok: true }, ...wrong.map(w => ({ tex: tupleTex(F, w.vals, false, item), ok: false, why: w.why }))];
    return { opts: shuffle(opts) };
  }

  /* gotowe pytanie wielokrotnego wyboru dla podpunktu z polami */
  A.buildMC = function (item) {
    if (item._mc) return item._mc;
    const F = item.fields;
    let groups;
    if (item.mc) {
      const correctTex = item.mcCorrect || tupleTex(F, F.map(f => { try { return correctVal(f); } catch (e) { return null; } }), true, item);
      groups = [{ opts: shuffle([{ tex: correctTex, ok: true }, ...item.mc.map(d => ({ tex: d.tex, ok: false, why: d.why }))]) }];
    } else if (F.some(f => (f.vars || []).length)) {
      groups = F.map(f => Object.assign(groupFor([f], item.gk, item), { label: f.label }));
    } else {
      groups = [groupFor(F, item.gk, item)];
    }
    item._mc = { groups };
    return item._mc;
  };
  A.mcValTex = valTex;
})(typeof window !== 'undefined' ? window : globalThis);
