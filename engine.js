/* Algebra Quest — silnik: liczby zespolone, parser wyrażeń, sprawdzanie odpowiedzi, formatowanie */
(function (G) {
  'use strict';
  const AQ = G.AQ = G.AQ || {};
  AQ.lists = AQ.lists || [];

  /* ---------- liczby zespolone ---------- */
  const C = (re, im = 0) => ({ re, im });
  const add = (a, b) => C(a.re + b.re, a.im + b.im);
  const sub = (a, b) => C(a.re - b.re, a.im - b.im);
  const mul = (a, b) => C(a.re * b.re - a.im * b.im, a.re * b.im + a.im * b.re);
  const div = (a, b) => { // algorytm Smitha — bez przepełnienia dla bardzo dużych/małych liczb
    if (Math.abs(b.re) >= Math.abs(b.im)) { const r = b.im / b.re, d = b.re + b.im * r; return C((a.re + a.im * r) / d, (a.im - a.re * r) / d); }
    const r = b.re / b.im, d = b.re * r + b.im; return C((a.re * r + a.im) / d, (a.im * r - a.re) / d);
  };
  const abs = a => Math.hypot(a.re, a.im);
  const arg = a => Math.atan2(a.im, a.re);
  const conj = a => C(a.re, -a.im);
  const neg = a => C(-a.re, -a.im);
  const polar = (r, t) => C(r * Math.cos(t), r * Math.sin(t));
  const isReal = a => Math.abs(a.im) <= 1e-12 * Math.max(1, Math.abs(a.re));
  const isInt = x => Math.abs(x - Math.round(x)) < 1e-9;
  function powInt(a, n) {
    if (n < 0) return div(C(1), powInt(a, -n));
    let r = C(1), b = a;
    while (n > 0) { if (n & 1) r = mul(r, b); b = mul(b, b); n = Math.floor(n / 2); }
    return r;
  }
  function pow(a, e) {
    if (isReal(e) && isInt(e.re) && Math.abs(e.re) <= 4096) return powInt(a, Math.round(e.re));
    if (isReal(a) && a.re > 0 && isReal(e)) return C(Math.pow(a.re, e.re));
    if (a.re === 0 && a.im === 0) return C(0);
    const lr = Math.log(abs(a)), t = arg(a);
    const re = e.re * lr - e.im * t, im = e.im * lr + e.re * t;
    return polar(Math.exp(re), im);
  }
  function nroot(a, n) { // główna wartość; dla rzeczywistych ujemnych i n nieparzystego — rzeczywista
    if (isReal(a) && n % 2 === 1) return C(Math.sign(a.re) * Math.pow(Math.abs(a.re), 1 / n));
    if (isReal(a) && a.re >= 0) return C(Math.pow(a.re, 1 / n));
    return polar(Math.pow(abs(a), 1 / n), arg(a) / n);
  }
  function allRoots(a, n) {
    const r = Math.pow(abs(a), 1 / n), t = arg(a), out = [];
    for (let k = 0; k < n; k++) out.push(polar(r, (t + 2 * Math.PI * k) / n));
    return out;
  }
  const csin = a => C(Math.sin(a.re) * Math.cosh(a.im), Math.cos(a.re) * Math.sinh(a.im));
  const ccos = a => C(Math.cos(a.re) * Math.cosh(a.im), -Math.sin(a.re) * Math.sinh(a.im));
  AQ.C = { C, add, sub, mul, div, abs, arg, conj, neg, polar, pow, powInt, nroot, allRoots, isReal };

  /* ---------- tokenizer ---------- */
  const FUNCS = ['sqrt', 'cbrt', 'root', 'sin', 'cos', 'tg', 'tan', 'ctg', 'cot', 'abs', 'conj', 'Re', 'Im', 'exp'];
  const CONSTS = ['pi', 'i', 'e'];
  const GREEK = { 'π': 'pi', 'α': 'alpha', 'β': 'beta', 'φ': 'phi', 'ω': 'omega' };
  function tokenize(src, vars) {
    let s = src.replace(/°/g, '*π/180').replace(/[·×∙⋅]/g, '*').replace(/[÷:]/g, '/').replace(/[−–]/g, '-').replace(/\s+/g, ' ');
    s = s.replace(/²/g, '^2').replace(/³/g, '^3');
    const names = [...FUNCS, ...CONSTS, ...vars, 'alpha', 'beta'].sort((a, b) => b.length - a.length);
    const toks = []; let i = 0;
    while (i < s.length) {
      const ch = s[i];
      if (ch === ' ') { i++; continue; }
      if (/[0-9.]/.test(ch)) {
        let j = i; while (j < s.length && /[0-9.]/.test(s[j])) j++;
        const sci = s.slice(j).match(/^e[+-]?\d+/); if (sci) j += sci[0].length;
        const str = s.slice(i, j);
        if ((str.match(/\./g) || []).length > 1 || str === '.' || isNaN(parseFloat(str))) throw new Error('Niepoprawna liczba „' + str + '”');
        toks.push({ t: 'num', v: parseFloat(str), s: str }); i = j; continue;
      }
      if ('+-*/^(),|'.includes(ch)) { toks.push({ t: 'op', v: ch }); i++; continue; }
      if (ch === '√') { toks.push({ t: 'fn', v: 'sqrt' }); i++; continue; }
      if (ch === '∛') { toks.push({ t: 'fn', v: 'cbrt' }); i++; continue; }
      if (ch === '∜') { toks.push({ t: 'fn', v: 'root4' }); i++; continue; }
      if (ch === '[' ) { toks.push({ t: 'op', v: '(' }); i++; continue; }
      if (ch === ']' ) { toks.push({ t: 'op', v: ')' }); i++; continue; }
      if (GREEK[ch]) { const n = GREEK[ch]; toks.push(n === 'pi' ? { t: 'const', v: 'pi' } : { t: 'var', v: n }); i++; continue; }
      if (/[A-Za-z]/.test(ch)) {
        let found = null;
        for (const n of names) if (s.startsWith(n, i)) { found = n; break; }
        if (!found) throw new Error('Nieznany symbol „' + s.slice(i).match(/^[A-Za-z]+/)[0] + '”');
        if (FUNCS.includes(found)) toks.push({ t: 'fn', v: found });
        else if (CONSTS.includes(found)) toks.push({ t: 'const', v: found });
        else toks.push({ t: 'var', v: found });
        i += found.length; continue;
      }
      throw new Error('Nieznany znak „' + ch + '”');
    }
    return toks;
  }

  /* ---------- parser ---------- */
  function parse(src, vars = []) {
    const toks = tokenize(src, vars); let p = 0;
    const peek = () => toks[p];
    const isOp = (v) => peek() && peek().t === 'op' && peek().v === v;
    const eat = (v) => { if (!isOp(v)) throw new Error(v === ')' ? 'Brakuje nawiasu „)”' : 'Oczekiwano „' + v + '”'); p++; };
    const startsPrimary = () => { const k = peek(); if (!k) return false; return k.t === 'num' || k.t === 'const' || k.t === 'var' || k.t === 'fn' || (k.t === 'op' && (k.v === '(')); };
    function expr() {
      let a = term();
      while (isOp('+') || isOp('-')) { const op = peek().v; p++; const b = term(); a = { t: 'bin', op, a, b }; }
      return a;
    }
    function term() {
      let a = unary();
      for (;;) {
        if (isOp('*') || isOp('/')) { const op = peek().v; p++; const b = unary(); a = { t: 'bin', op, a, b }; }
        else if (startsPrimary()) { const b = power(); a = { t: 'bin', op: '*', a, b, imp: true }; }
        else break;
      }
      return a;
    }
    function unary() {
      if (isOp('-')) { p++; return { t: 'neg', a: unary() }; }
      if (isOp('+')) { p++; return unary(); }
      return power();
    }
    function power() {
      const a = primary();
      if (isOp('^')) { p++; const b = unary(); return { t: 'pow', a, b }; }
      return a;
    }
    function fnArg() {
      if (isOp('(')) { p++; const e = expr(); eat(')'); return e; }
      return power();
    }
    function primary() {
      const k = peek();
      if (!k) throw new Error('Wyrażenie urywa się');
      if (k.t === 'num') { p++; return { t: 'num', v: k.v, s: k.s }; }
      if (k.t === 'const') { p++; return { t: 'const', v: k.v }; }
      if (k.t === 'var') { p++; return { t: 'var', v: k.v }; }
      if (k.t === 'op' && k.v === '(') { p++; const e = expr(); eat(')'); return { t: 'par', a: e }; }
      if (k.t === 'op' && k.v === '|') { p++; const e = expr(); eat('|'); return { t: 'fn', n: 'abs', args: [e] }; }
      if (k.t === 'fn') {
        p++;
        const name = k.v;
        if (name === 'root') {
          eat('('); const n = expr(); eat(','); const x = expr(); eat(')');
          return { t: 'fn', n: 'root', args: [n, x] };
        }
        if (name === 'root4') return { t: 'fn', n: 'root', args: [{ t: 'num', v: 4, s: '4' }, fnArg()] };
        // sin^2(x)
        if (isOp('^') && ['sin', 'cos', 'tg', 'tan', 'ctg', 'cot'].includes(name)) {
          p++; const e = primary(); const x = fnArg();
          return { t: 'pow', a: { t: 'fn', n: name, args: [x] }, b: e };
        }
        return { t: 'fn', n: name, args: [fnArg()] };
      }
      if (k.t === 'op' && k.v === ')') throw new Error('Nadmiarowy nawias „)”');
      throw new Error('Nieoczekiwany znak „' + k.v + '”');
    }
    if (!toks.length) throw new Error('Puste pole');
    const e = expr();
    if (p < toks.length) {
      const k = toks[p];
      if (k.t === 'op' && k.v === ')') throw new Error('Nadmiarowy nawias „)”');
      if (k.t === 'op' && k.v === ',') throw new Error('Przecinek tylko w root(n, x); ułamki dziesiętne pisz z kropką');
      throw new Error('Nie rozumiem fragmentu od „' + (k.v ?? '') + '”');
    }
    return e;
  }

  /* ---------- ewaluacja z flagami ---------- */
  function evaluate(ast, env = {}, flags = {}) {
    const ev = (n) => {
      switch (n.t) {
        case 'num': return C(n.v);
        case 'par': return ev(n.a);
        case 'const': return n.v === 'pi' ? C(Math.PI) : n.v === 'e' ? C(Math.E) : C(0, 1);
        case 'var': {
          if (!(n.v in env)) throw new Error('Symbol „' + n.v + '” nie występuje w tym zadaniu');
          const v = env[n.v]; return typeof v === 'number' ? C(v) : v;
        }
        case 'neg': return neg(ev(n.a));
        case 'bin': {
          const a = ev(n.a), b = ev(n.b);
          if (n.op === '+') return add(a, b);
          if (n.op === '-') return sub(a, b);
          if (n.op === '*') { if (!isReal(a) && !isReal(b)) flags.complexMul = true; return mul(a, b); }
          if (n.op === '/') {
            if (abs(b) < 1e-300) throw new Error('Dzielenie przez zero');
            if (!isReal(b)) flags.complexDiv = true;
            return div(a, b);
          }
          break;
        }
        case 'pow': {
          const a = ev(n.a), e = ev(n.b);
          const intExp = isReal(e) && isInt(e.re);
          if (!isReal(a) && intExp && Math.abs(e.re) >= 2) flags.complexPow = true;
          if (!isReal(a) && intExp && e.re < 0) flags.complexDiv = true;
          if (!intExp && (!isReal(a) || a.re < 0)) flags.complexRoot = true;
          return pow(a, e);
        }
        case 'fn': {
          const fn = n.n;
          if (['sin', 'cos', 'tg', 'tan', 'ctg', 'cot'].includes(fn)) {
            if (n.args[0].t !== 'var' || !['alpha', 'beta', 'a', 'b'].includes(n.args[0].v)) flags.trigNonBasic = true;
            flags.usesTrig = true;
          }
          const x = ev(n.args[fn === 'root' ? 1 : 0]);
          switch (fn) {
            case 'sqrt': if (!isReal(x)) flags.complexRoot = true; return isReal(x) && x.re < 0 ? C(0, Math.sqrt(-x.re)) : nroot(x, 2);
            case 'cbrt': if (!isReal(x)) flags.complexRoot = true; return nroot(x, 3);
            case 'root': {
              const k = ev(n.args[0]);
              if (!isReal(k) || !isInt(k.re) || k.re < 2) throw new Error('W root(n, x) n musi być liczbą naturalną ≥ 2');
              if (!isReal(x)) flags.complexRoot = true;
              if (isReal(x) && x.re < 0 && Math.round(k.re) % 2 === 0) flags.complexRoot = true;
              return nroot(x, Math.round(k.re));
            }
            case 'sin': return csin(x);
            case 'cos': return ccos(x);
            case 'tg': case 'tan': { const c = ccos(x); if (abs(c) < 1e-12) throw new Error('tg nieokreślony'); return div(csin(x), c); }
            case 'ctg': case 'cot': { const s = csin(x); if (abs(s) < 1e-12) throw new Error('ctg nieokreślony'); return div(ccos(x), s); }
            case 'abs': flags.usesAbs = true; return C(abs(x));
            case 'conj': flags.usesConj = true; return conj(x);
            case 'exp': return pow(C(Math.E), x);
            case 'Re': return C(x.re);
            case 'Im': return C(x.im);
          }
        }
      }
      throw new Error('Błąd obliczeń');
    };
    const r = ev(ast);
    if (!isFinite(r.re) || !isFinite(r.im)) throw new Error('Wynik nie jest skończony');
    return r;
  }

  /* ---------- AST -> TeX (podgląd) ---------- */
  const VARTEX = { alpha: '\\alpha', beta: '\\beta', phi: '\\varphi', omega: '\\omega' };
  const FNTEX = { sin: '\\sin', cos: '\\cos', tg: '\\operatorname{tg}', tan: '\\operatorname{tg}', ctg: '\\operatorname{ctg}', cot: '\\operatorname{ctg}', Re: '\\operatorname{Re}', Im: '\\operatorname{Im}' };
  function toTex(n) {
    switch (n.t) {
      case 'num': return n.s ?? String(n.v);
      case 'const': return n.v === 'pi' ? '\\pi' : n.v === 'e' ? 'e' : 'i';
      case 'var': return VARTEX[n.v] || n.v;
      case 'par': return '\\left(' + toTex(n.a) + '\\right)';
      case 'neg': return '-' + toTex(n.a);
      case 'bin': {
        if (n.op === '/') { if (n.a.t === 'neg') return '-\\frac{' + toTex(strip(n.a.a)) + '}{' + toTex(strip(n.b)) + '}'; return '\\frac{' + toTex(strip(n.a)) + '}{' + toTex(strip(n.b)) + '}'; }
        if (n.op === '*') {
          const L = toTex(n.a), R = toTex(n.b);
          const needDot = /[0-9.]$/.test(L) && /^[0-9.\-]/.test(R) || (n.b.t === 'neg');
          return L + (needDot ? ' \\cdot ' : (n.imp ? '' : ' \\cdot ')) + R;
        }
        return toTex(n.a) + ' ' + n.op + ' ' + toTex(n.b);
      }
      case 'pow': {
        let b = toTex(n.a);
        if (n.a.t === 'fn' && FNTEX[n.a.n]) return FNTEX[n.a.n] + '^{' + toTex(strip(n.b)) + '}\\left(' + toTex(n.a.args[0]) + '\\right)';
        const atomic = ['num', 'const', 'var', 'par'].includes(n.a.t) || (n.a.t === 'fn' && ['sqrt', 'cbrt', 'root', 'abs', 'conj'].includes(n.a.n));
        if (!atomic) b = '\\left(' + b + '\\right)';
        return '{' + b + '}^{' + toTex(strip(n.b)) + '}';
      }
      case 'fn': {
        const a = n.args;
        if (n.n === 'sqrt') return '\\sqrt{' + toTex(strip(a[0])) + '}';
        if (n.n === 'cbrt') return '\\sqrt[3]{' + toTex(strip(a[0])) + '}';
        if (n.n === 'root') return '\\sqrt[' + toTex(strip(a[0])) + ']{' + toTex(strip(a[1])) + '}';
        if (n.n === 'abs') return '\\left|' + toTex(strip(a[0])) + '\\right|';
        if (n.n === 'conj') return '\\overline{' + toTex(strip(a[0])) + '}';
        const inner = toTex(strip(a[0]));
        const simple = ['num', 'const', 'var'].includes(a[0].t);
        return FNTEX[n.n] + (simple ? ' ' + inner : '\\left(' + inner + '\\right)');
      }
    }
    return '?';
  }
  const strip = n => (n.t === 'par' ? n.a : n);
  AQ.parse = parse; AQ.evaluate = evaluate; AQ.toTex = n => toTex(strip(n));

  /* dzieli tekst na wartości po średnikach (na najwyższym poziomie) */
  function splitTop(s) {
    const out = []; let d = 0, cur = '';
    for (const ch of s) {
      if ('([|'.includes(ch)) d++;
      if (')]'.includes(ch)) d--;
      if (ch === ';' && d <= 0) { out.push(cur); cur = ''; } else cur += ch;
    }
    out.push(cur);
    return out.map(x => x.trim()).filter(x => x.length);
  }
  AQ.splitTop = splitTop;

  /* podgląd na żywo dla pola */
  const BRAK = /^\s*(brak|nie ma|nie istnieje|nieokreślon[yae]|nieokreslon[yae]|∅|—|-)\s*$/i;
  AQ.isBrak = s => BRAK.test(s || '');
  // ujednolica zapis: przecinek dziesiętny, przecinek jako separator rozwiązań, ±
  function normalizeParts(src, kind) {
    let s = src.trim();
    if (kind === 'set' && !s.includes(';')) {
      let d = 0, out = '';
      for (let k = 0; k < s.length; k++) {
        const ch = s[k];
        if ('([|'.includes(ch)) d++; if (')]'.includes(ch)) d--;
        out += (ch === ',' && d <= 0) ? ';' : ch;
      }
      s = out;
    }
    if (!/root\s*\(/.test(s)) s = s.replace(/(\d),(\d)/g, '$1.$2');
    let parts = kind === 'set' ? splitTop(s) : [s];
    const expand = p => { const k = p.search(/[±∓]/); if (k < 0) return [p]; const a = p.slice(0, k), b = p.slice(k + 1); return [...expand(a + '+' + b), ...expand(a + '-' + b)]; };
    if (kind === 'set') parts = parts.flatMap(expand);
    else if (kind === 'pm') parts = parts.map(p => p.replace(/^\s*[±∓]/, '').replace(/[±∓]/g, '+'));
    return parts;
  }
  AQ.normalizeParts = normalizeParts;
  AQ.previewTex = function (src, field) {
    const vars = field.vars || [];
    if (field.kind === 'yesno') return '';
    if (BRAK.test(src)) return '\\text{brak}';
    if (field.kind !== 'set' && field.kind !== 'pm' && /[±∓]/.test(src)) throw new Error('Znak ± tylko w polach z kilkoma rozwiązaniami');
    const parts = normalizeParts(src, field.kind);
    return parts.map(p => toTex(parse(p, vars))).join(';\\quad ');
  };

  /* ---------- porównania ---------- */
  function close(u, v, tol = 1e-7) {
    const m = Math.max(abs(u), abs(v));
    if (m < 1e-9) return true;
    return abs(sub(u, v)) <= tol * Math.max(m, 1e-300) || abs(sub(u, v)) < 1e-10 && m > 1e-6;
  }
  function angleClose(u, v) {
    if (!isReal(u) || !isReal(v)) return false;
    const d = (u.re - v.re) / (2 * Math.PI);
    return Math.abs(d - Math.round(d)) < 1e-7;
  }
  AQ.close = close; AQ.angleClose = angleClose;

  function sampleEnvs(field) {
    if (field.samples) return field.samples.map(e => Object.assign({}, e));
    const vars = field.vars || [];
    if (!vars.length) return [{}];
    const envs = [];
    const fixed = [[0.37, 1.13], [1.21, 0.41], [2.47, 0.83], [0.71, 2.19], [-0.9, 0.66]];
    for (let k = 0; k < 5; k++) {
      const e = {};
      vars.forEach((v, j) => {
        if (v === 'n' || v === 'm' || v === 'k') e[v] = 2 + ((k * 3 + j * 2) % 7);
        else e[v] = fixed[k][j % 2] + (j > 1 ? 0.3 * j : 0);
      });
      envs.push(e);
    }
    return envs;
  }

  AQ.sampleEnvs = f => sampleEnvs(f);
  function expected(field, env) {
    const a = field.ans;
    if (typeof a === 'function') return a(env);
    if (Array.isArray(a)) return a.map(s => typeof s === 'string' ? evaluate(parse(s, field.vars || []), env) : s);
    if (typeof a === 'string') return evaluate(parse(a, field.vars || []), env);
    if (typeof a === 'number') return C(a);
    return a;
  }
  AQ.expected = expected;

  /* zwraca {status:'ok'|'wrong'|'invalid', msg} */
  AQ.checkField = function (field, raw) {
    const src = (raw ?? '').trim();
    const kind = field.kind || 'expr';
    if (kind === 'yesno') {
      if (src !== 'tak' && src !== 'nie') return { status: 'invalid', msg: 'Wybierz Tak albo Nie' };
      return { status: (src === 'tak') === !!field.ans ? 'ok' : 'wrong' };
    }
    if (!src) return { status: 'invalid', msg: 'Uzupełnij wszystkie pola' };
    const isBrak = BRAK.test(src);
    if (field.ans === 'brak') return { status: isBrak ? 'ok' : 'wrong' };
    if (isBrak) return field.allowBrak ? { status: 'wrong' } : { status: 'invalid', msg: '„brak” nie pasuje do tego pola' };
    const restrict = field.restrict || [];
    if (kind === 'mod' || restrict.includes('int')) {
      if (!/^-?\d+$/.test(src)) return { status: 'invalid', msg: 'Wpisz pojedynczą liczbę całkowitą' };
    }
    if (restrict.includes('plain') && /sqrt|cbrt|root|√|∛|∜|\^/.test(src)) return { status: 'invalid', msg: 'Podaj wartość bez pierwiastków i potęg — uprość wyrażenie' };
    if (restrict.includes('nofrac') && /\//.test(src) && kind === 'mod') return { status: 'invalid', msg: 'W Zₚ wpisz element 0…p−1' };
    const vars = field.vars || [];
    let envs = sampleEnvs(field);
    try {
      if (kind !== 'set' && kind !== 'pm' && /[±∓]/.test(src)) return { status: 'invalid', msg: 'Znak ± tylko w polach z kilkoma rozwiązaniami' };
      const parts = normalizeParts(src, kind);
      const asts = parts.map(p => parse(p, vars));
      let allOk = true;
      for (const env of envs) {
        const flags = {};
        const vals = asts.map(a => evaluate(a, env, flags));
        if (restrict.includes('alg') && (flags.complexDiv || flags.complexPow || flags.complexRoot || flags.complexMul))
          return { status: 'invalid', msg: 'Uprość do postaci a + bi: bez mnożenia/dzielenia dwóch liczb nierzeczywistych i bez ich potęg/pierwiastków' };
        if (restrict.includes('roots') && flags.complexRoot)
          return { status: 'invalid', msg: 'Nie używaj pierwiastków z liczb zespolonych — podaj wartości w postaci algebraicznej lub trygonometrycznej' };
        if (restrict.includes('trig') && flags.trigNonBasic)
          return { status: 'invalid', msg: 'Wolno używać tylko sin α, cos α (tg α…) — bez funkcji kątów wielokrotnych' };
        if (restrict.includes('notrig') && flags.usesTrig)
          return { status: 'invalid', msg: 'Podaj wartość liczbową — bez funkcji trygonometrycznych' };
        if (restrict.includes('noabs') && (flags.usesAbs || flags.usesConj))
          return { status: 'invalid', msg: 'Nie używaj |·| ani sprzężenia w odpowiedzi' };
        const exp = expected(field, env);
        if (kind === 'set') {
          const want = exp.slice();
          if (vals.length !== want.length) { allOk = false; break; }
          const used = new Array(want.length).fill(false);
          for (const v of vals) {
            const j = want.findIndex((w, idx) => !used[idx] && close(v, w, 1e-6));
            if (j < 0) { allOk = false; break; }
            used[j] = true;
          }
          if (!allOk) break;
        } else {
          let v = vals[0]; let exp2 = exp;
          if (field.scale) { v = mul(v, C(field.scale)); exp2 = mul(exp, C(field.scale)); }
          let ok;
          if (kind === 'angle') ok = angleClose(v, exp2);
          else if (kind === 'mod') { const p = field.mod; ok = ((Math.round(v.re) - Math.round(exp2.re)) % p + p) % p === 0; }
          else if (kind === 'pm') ok = close(v, exp2) || close(v, neg(exp2));
          else ok = close(v, exp2);
          if (!ok) { allOk = false; break; }
        }
      }
      return { status: allOk ? 'ok' : 'wrong' };
    } catch (e) {
      return { status: 'invalid', msg: e.message };
    }
  };

  /* ---------- formatowanie „ładnych” liczb ---------- */
  function gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a; }
  AQ.gcd = gcd;
  function ratApprox(x, maxQ = 64) {
    for (let q = 1; q <= maxQ; q++) { const p = Math.round(x * q); if (Math.abs(p / q - x) < 1e-12 * Math.max(1e-300, Math.abs(x))) { const g = gcd(p, q) || 1; return [p / g, q / g]; } }
    return null;
  }
  AQ.ratApprox = ratApprox;
  function fracTex(p, q) {
    if (q === 1) return String(p);
    return (p < 0 ? '-' : '') + '\\frac{' + Math.abs(p) + '}{' + q + '}';
  }
  AQ.fracTex = fracTex;
  function sqfree(n) { let out = 1, inside = n; for (let k = 2; k * k <= inside; k++) while (inside % (k * k) === 0) { inside /= k * k; out *= k; } return [out, inside]; }
  // x ≈ (p + q√c)/d
  const isDec = t => /\d\.\d|e[+-]\d/.test(t);
  // liczba całkowita (być może ogromna) -> TeX, z potęgą 2/3/5 gdy duża
  // duża dokładna potęga liczby pierwszej (≥ 1000) -> b^{k}, np. 524288 -> 2^{19}
  function powForm(a) {
    a = Math.round(a); if (a < 1000) return null;
    for (const b of [2, 3, 5, 7]) { let k = 0, m = a; while (m % b === 0) { m /= b; k++; } if (m === 1) return b + '^{' + k + '}'; }
    return null;
  }
  AQ.powForm = powForm;
  function bigInt(p) {
    const s = p < 0 ? '-' : ''; let a = Math.abs(p);
    if (a < 1e7) { const pf = powForm(a); return s + (pf || Math.round(a)); }
    for (const b of [2, 5, 3]) {
      let k = 0, m = a;
      while (m / b >= 1 && Math.abs(m / b - Math.round(m / b)) < 1e-9 * (m / b) && k < 400) { m /= b; k++; }
      if (m < 1000 && k > 3) { const mm = Math.round(m); return s + (mm === 1 ? '' : mm + '\\cdot ') + b + '^{' + k + '}'; }
    }
    return s + a.toExponential(4);
  }
  // x = (p/q)·√c · b^k  — wybieramy najprostszy zapis; działa też dla ogromnych/maleńkich liczb
  function ratSqrt(x) {
    const ax = Math.abs(x); const cands = [];
    const maxQ = ax > 1e4 ? 16 : ax > 100 ? 64 : 2048;
    for (const c of [1, 2, 3, 5, 6, 7, 10, 15]) {
      const y = x / Math.sqrt(c);
      const r = ratApprox(y, maxQ);
      if (r && Math.abs(r[0]) < 1e7) cands.push({ p: r[0], q: r[1], c, b: 1, k: 0 });
      if (Math.abs(y) > 1e6 || Math.abs(y) < 1e-2) {
        for (const b of [2, 5, 3]) {
          const k0 = Math.round(Math.log(Math.abs(y)) / Math.log(b));
          for (let kk = k0 - 4; kk <= k0 + 4; kk++) {
            const r2 = ratApprox(y / Math.pow(b, kk), 64);
            if (r2 && Math.abs(r2[0]) < 1000) cands.push({ p: r2[0], q: r2[1], c, b, k: kk });
          }
        }
      }
    }
    if (!cands.length) return null;
    const cost = o => Math.log10(Math.abs(o.p) + 1) + Math.log10(o.q) * 1.5 + (o.c > 1 ? 0.5 : 0) + (o.b > 1 ? 1 + Math.log10(Math.abs(o.k) + 1) * 0.1 : 0);
    cands.sort((a, b) => cost(a) - cost(b));
    let { p, q, c, b, k } = cands[0];
    if (b > 1 && k < 0) { q = q * 1; } // obsługa poniżej
    const sq = c === 1 ? '' : '\\sqrt{' + c + '}';
    const ap = Math.abs(p);
    let num = (ap === 1 && (sq || (b > 1 && k > 0)) ? '' : (b === 1 ? bigInt(ap) : String(ap))) + sq;
    let den = q === 1 ? '' : (powForm(q) || String(q));
    if (b > 1 && k > 0) num = (num ? num + '\\cdot ' : '') + b + '^{' + k + '}';
    if (b > 1 && k < 0) den = (den ? den + '\\cdot ' : '') + b + '^{' + (-k) + '}';
    if (!num) num = '1';
    const s = p < 0 ? '-' : '';
    return den ? s + '\\frac{' + num + '}{' + den + '}' : s + num;
  }
  function niceReal(x, allowTiny) {
    if (allowTiny ? x === 0 : Math.abs(x) < 1e-10) return '0';
    const rs = ratSqrt(x); if (rs) return rs;
    return tidySum(niceCore(x));
  }
  // „-a + b” zapisujemy jako „b - a” (także w liczniku ułamka), np. \frac{\sqrt2-\sqrt6}{4}
  function tidySum(t) {
    let m = t.match(/^\\frac\{-([^{}+-]+(?:\{[^{}]*\})?) \+ ([^{}+-]+(?:\{[^{}]*\})?)\}\{(\d+)\}$/);
    if (m) return '\\frac{' + m[2] + ' - ' + m[1] + '}{' + m[3] + '}';
    m = t.match(/^\\frac\{-([^{}+-]+(?:\{[^{}]*\})?) - ([^{}+-]+(?:\{[^{}]*\})?)\}\{(\d+)\}$/);
    if (m) return '-\\frac{' + m[1] + ' + ' + m[2] + '}{' + m[3] + '}';
    m = t.match(/^-([^{}+-]+(?:\{[^{}]*\})?) \+ ([^{}+-]+(?:\{[^{}]*\})?)$/);
    if (m) return m[2] + ' - ' + m[1];
    return t;
  }
  function niceCore(x) {
    if (Math.abs(x) < 1e-300) return '0';
    if (Math.abs(x) > 1e6 || Math.abs(x) < 1e-6) return x.toExponential(4);
    const sign = x < 0 ? '-' : ''; const ax = Math.abs(x);
    const r2 = ratApprox(ax * ax, 48);
    if (r2 && r2[0] < 5000) {
      const [p, q] = r2;
      const [o, ins] = sqfree(p * q);
      if (ins !== 1) {
        const g = gcd(o, q); const num = o / g, den = q / g;
        return sign + (den === 1 ? (num === 1 ? '' : num) + '\\sqrt{' + ins + '}' : '\\frac{' + (num === 1 ? '' : num) + '\\sqrt{' + ins + '}}{' + den + '}');
      }
    }
    for (const c of [2, 3, 5, 6, 7, 10, 15]) for (const d of [1, 2, 3, 4, 6, 8, 12]) for (let q = -24; q <= 24; q++) {
      if (!q) continue;
      const p = x * d - q * Math.sqrt(c);
      if (Math.abs(p - Math.round(p)) < 1e-8 && Math.abs(Math.round(p)) < 200) {
        const P = Math.round(p); if (P === 0) continue;
        const g = gcd(gcd(P, q), d);
        const pp = P / g, qq = q / g, dd = d / g;
        const sq = (Math.abs(qq) === 1 ? '' : Math.abs(qq)) + '\\sqrt{' + c + '}';
        const numer = pp + (qq > 0 ? ' + ' : ' - ') + sq;
        return dd === 1 ? numer : '\\frac{' + numer + '}{' + dd + '}';
      }
    }
    for (const [c1, c2] of [[6, 2], [3, 2], [6, 3], [10, 2], [15, 3], [5, 1]]) for (const d of [1, 2, 4, 8]) for (let q1 = -4; q1 <= 4; q1++) {
      if (!q1) continue;
      const q2 = (x * d - q1 * Math.sqrt(c1)) / Math.sqrt(c2);
      if (Math.abs(q2 - Math.round(q2)) < 1e-8 && Math.round(q2) !== 0 && Math.abs(q2) < 5) {
        const Q2 = Math.round(q2);
        const t1 = (q1 < 0 ? '-' : '') + (Math.abs(q1) === 1 ? '' : Math.abs(q1)) + '\\sqrt{' + c1 + '}';
        const t2 = (Math.abs(Q2) === 1 && c2 !== 1 ? '' : Math.abs(Q2)) + (c2 === 1 ? '' : '\\sqrt{' + c2 + '}');
        const numer = t1 + (Q2 > 0 ? ' + ' : ' - ') + t2;
        return d === 1 ? numer : '\\frac{' + numer + '}{' + d + '}';
      }
    }
    for (const n of [3, 4, 6, 8]) {
      const rn = ratApprox(Math.pow(ax, n), 24);
      if (rn && rn[0] < 100000) return sign + (rn[1] === 1 ? '\\sqrt[' + n + ']{' + rn[0] + '}' : '\\sqrt[' + n + ']{' + fracTex(rn[0], rn[1]) + '}');
    }
    // √(a ± √b)/d
    for (const d of [1, 2, 4, 8]) {
      const y = (ax * d) ** 2;
      for (const c of [2, 3, 5]) for (let q = -8; q <= 8; q++) {
        if (!q) continue; const p = y - q * Math.sqrt(c);
        if (Math.abs(p - Math.round(p)) < 1e-8 && Math.round(p) > 0) {
          const P = Math.round(p);
          const inner = P + (q > 0 ? ' + ' : ' - ') + (Math.abs(q) === 1 ? '' : Math.abs(q)) + '\\sqrt{' + c + '}';
          return sign + (d === 1 ? '\\sqrt{' + inner + '}' : '\\frac{\\sqrt{' + inner + '}}{' + d + '}');
        }
      }
    }
    return (Math.round(x * 1e6) / 1e6).toString();
  }
  AQ.niceReal = niceReal;
  AQ.niceC = function (z) {
    const m = abs(z); const tiny = m < 1e-6;
    const re = Math.abs(z.re) < 1e-10 * m ? 0 : z.re;
    const im = Math.abs(z.im) < 1e-10 * m ? 0 : z.im;
    if (m === 0) return '0';
    if (im === 0) return niceReal(re, tiny);
    let it = niceReal(Math.abs(im), tiny);
    // \frac{-1+\sqrt3}{2} z minusem przed — czytelniej jako + \frac{1-\sqrt3}{2}
    if (im < 0 && /^\\frac\{-/.test(it)) { const t2 = niceReal(im, tiny); if (!/^-/.test(t2)) return (re === 0 ? '' : niceReal(re, tiny) + ' + ') + t2 + 'i'; }
    const needPar = !it.startsWith('\\frac') && / [+-] /.test(it) && !it.startsWith('\\left(');
    const imPart = (it === '1' ? '' : (needPar ? '\\left(' + it + '\\right)' : it)) + 'i';
    if (re === 0) return (im < 0 ? '-' : '') + imPart;
    return niceReal(re, tiny) + (im < 0 ? ' - ' : ' + ') + imPart;
  };
  AQ.angleTex = function (p, q) { // p*pi/q
    const g = gcd(p, q) || 1; p /= g; q /= g;
    if (p === 0) return '0';
    const s = p < 0 ? '-' : ''; const a = Math.abs(p);
    const num = (a === 1 ? '' : a) + '\\pi';
    return s + (q === 1 ? num : '\\frac{' + num + '}{' + q + '}');
  };
  AQ.niceAngle = function (t) { // t w radianach -> tex (mod 2pi, w [0,2pi))
    let u = t / Math.PI; u = ((u % 2) + 2) % 2;
    if (u < 1e-9 || 2 - u < 1e-9) return '0';
    const r = ratApprox(u, 168);
    if (r) return AQ.angleTex(r[0], r[1]);
    return (Math.round(t * 1e4) / 1e4).toString();
  };
  AQ.argTex = function (z) { // argument liczby z: dokładnie (kπ/n) albo przez arcus tangens
    let t = AQ.niceAngle(arg(z));
    if (/\d\.\d/.test(t)) {
      const q = niceReal(Math.abs(z.im / z.re));
      const at = '\\operatorname{arctg}' + (/^\d+$/.test(q) ? q : '\\left(' + q + '\\right)');
      t = z.re > 0 ? (z.im >= 0 ? at : '\\left(-' + at + '\\right)') : (z.im >= 0 ? '\\left(\\pi-' + at + '\\right)' : '\\left(\\pi+' + at + '\\right)');
    }
    return t;
  };
  AQ.polarTex = function (z) {
    const r = abs(z); let t = AQ.argTex(z); if (/^-/.test(t)) t = '\\left(' + t + '\\right)';
    const rt = niceReal(r);
    const core = '\\cos ' + t + ' + i\\sin ' + t;
    if (rt === '1') return core;
    return (/ [+-] /.test(rt) && !/^\\frac/.test(rt) ? '\\left(' + rt + '\\right)' : rt) + '\\left(' + core + '\\right)';
  };

  /* ---------- losowanie ---------- */
  const R = AQ.R = {
    int: (a, b) => a + Math.floor(Math.random() * (b - a + 1)),
    nz: (a, b) => { let x; do { x = R.int(a, b); } while (x === 0); return x; },
    pick: arr => arr[Math.floor(Math.random() * arr.length)],
    shuffle: arr => { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; },
    sign: () => (Math.random() < 0.5 ? -1 : 1),
  };

  /* ---------- liczby Gaussa: format ---------- */
  // z = [a,b]  ->  składnia wyrażeń i TeX
  const Z = AQ.Z = {
    str(a, b) { if (b === 0) return String(a); const bi = (Math.abs(b) === 1 ? '' : Math.abs(b)) + 'i'; if (a === 0) return (b < 0 ? '-' : '') + bi; return a + (b < 0 ? '-' : '+') + bi; },
    tex(a, b) { return Z.str(a, b).replace(/([+-])/g, ' $1 ').replace(/^ - /, '-').trim(); },
    ptex(a, b) { const s = Z.tex(a, b); return (a !== 0 && b !== 0) || /^-/.test(s) ? '(' + s + ')' : s; },
    pstr(a, b) { const s = Z.str(a, b); return (a !== 0 && b !== 0) || /^-/.test(s) ? '(' + s + ')' : s; },
    mul: (x, y) => [x[0] * y[0] - x[1] * y[1], x[0] * y[1] + x[1] * y[0]],
    add: (x, y) => [x[0] + y[0], x[1] + y[1]],
    sub: (x, y) => [x[0] - y[0], x[1] - y[1]],
    conj: x => [x[0], -x[1]],
    n2: x => x[0] * x[0] + x[1] * x[1],
    rnd(m = 5, nonreal = true) { let a, b; do { a = R.int(-m, m); b = R.int(-m, m); } while ((nonreal && b === 0) || (a === 0 && b === 0)); return [a, b]; },
    rndPos(m = 5) { return [R.int(1, m), R.nz(-m, m)]; },
  };
  // TeX liczby zespolonej z ułamkami
  AQ.ctexQ = function (re, im) { return AQ.niceC(C(re, im)); };

  /* ---------- markup: tekst z $..$ ---------- */
  AQ.mdToTexParts = function (s) {
    const out = []; const re = /\$\$([\s\S]+?)\$\$|\$([^$]+?)\$/g; let last = 0, m;
    while ((m = re.exec(s))) {
      if (m.index > last) out.push({ text: s.slice(last, m.index) });
      out.push(m[1] !== undefined ? { tex: m[1], display: true } : { tex: m[2], display: false });
      last = re.lastIndex;
    }
    if (last < s.length) out.push({ text: s.slice(last) });
    return out;
  };

  /* rejestracja list */
  AQ.addList = function (list) { AQ.lists.push(list); AQ.lists.sort((a, b) => a.num - b.num); };
})(typeof window !== 'undefined' ? window : globalThis);

/* ---------- prezentacja oczekiwanej odpowiedzi ---------- */
(function (G) {
  const AQ = G.AQ;
  AQ.ansTex = function (field) {
    if (field.show) return field.show;
    const kind = field.kind || 'expr';
    if (kind === 'yesno') return field.ans ? '\\text{Tak}' : '\\text{Nie}';
    if (field.ans === 'brak') return '\\text{brak}';
    const vars = field.vars || [];
    if (typeof field.ans === 'string' && vars.length) return AQ.toTex(AQ.parse(field.ans, vars));
    if (kind === 'set') {
      const arr = AQ.expected(field, {});
      return arr.map(z => AQ.niceC(z)).join(',\\quad ');
    }
    let v;
    try { v = AQ.expected(field, vars.length ? (field.samples ? field.samples[0] : {}) : {}); } catch (e) { return '?'; }
    if (!field.scale && AQ.C.abs(v) < 1e-12 && kind !== 'angle') return '0';
    if (kind === 'angle') return AQ.niceAngle(v.re);
    if (kind === 'mod') return String(((Math.round(v.re) % field.mod) + field.mod) % field.mod);
    if (kind === 'pm') return '\\pm\\left(' + AQ.niceC(v) + '\\right)';
    return AQ.niceC(v);
  };
})(typeof window !== 'undefined' ? window : globalThis);
