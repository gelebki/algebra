/* Lista 1 — ciała liczbowe, działania, Z_p */
(function () {
  'use strict';
  const A = AQ, R = A.R, T = String.raw;
  const fr = (p, q) => A.fracTex(p / (A.gcd(p, q) || 1) * (q < 0 ? -1 : 1), Math.abs(q) / (A.gcd(p, q) || 1));
  const frs = (p, q) => { const g = A.gcd(p, q) || 1; let a = p / g, b = q / g; if (b < 0) { a = -a; b = -b; } return b === 1 ? String(a) : a + '/' + b; };
  const md = (x, p) => ((x % p) + p) % p;
  const invMod = (a, p) => { a = md(a, p); for (let x = 1; x < p; x++) if ((a * x) % p === 1) return x; return null; };
  const pw = (a, e, p) => { let r = 1; a = md(a, p); for (let k = 0; k < e; k++) r = (r * a) % p; return r; };
  const yn = (label, ans) => ({ label, kind: 'yesno', ans });

  /* ---------------- 1.1 ---------------- */
  function gen11(gk) {
    if (gk === 'sqrt2' || !gk) {
      const c = R.pick([2, 3, 5, 6, 7]), q = R.pick([1, 1, 2]);
      const p = Math.ceil(q * Math.sqrt(c) + 0.01) + R.int(0, 2);
      const a = p * p + q * q * c, b = 2 * p * q;
      const qs = q === 1 ? '' : q;
      return {
        q: T`Oblicz $\sqrt{${a}+${b}\sqrt{${c}}}+\sqrt{${a}-${b}\sqrt{${c}}}$. Czy ta liczba jest wymierna?`,
        fields: [{ label: 'wartość', ans: String(2 * p), restrict: ['plain'] }],
        steps: [
          T`Szukamy zapisu $${a}\pm${b}\sqrt{${c}}=(x\pm y\sqrt{${c}})^2=x^2+${c}y^2\pm 2xy\sqrt{${c}}$.`,
          T`Warunki $x^2+${c}y^2=${a}$, $2xy=${b}$ spełniają $x=${p}$, $y=${q}$.`,
          T`Ponieważ $${p}>${qs}\sqrt{${c}}$, mamy $\sqrt{${a}-${b}\sqrt{${c}}}=${p}-${qs}\sqrt{${c}}$ (pierwiastek jest nieujemny!).`,
          T`Suma: $(${p}+${qs}\sqrt{${c}})+(${p}-${qs}\sqrt{${c}})=${2 * p}\in\mathbb{Q}$.`],
      };
    }
    if (gk === 'cbrt') {
      const opts = [];
      for (const k of [1, 2, 3]) for (let c = -6; c <= -1; c++) {
        const a2 = k * k * k - 3 * c * k; if (a2 % 2) continue; const a = a2 / 2;
        const D = a * a - c * c * c; if (D <= 0 || Number.isInteger(Math.sqrt(D))) continue;
        if (k === 1 && c === -1) continue;
        opts.push({ k, c, a, D });
      }
      const { k, c, a, D } = R.pick(opts);
      return {
        q: T`Oblicz $x=\sqrt[3]{${a}+\sqrt{${D}}}+\sqrt[3]{${a}-\sqrt{${D}}}$.`,
        fields: [{ label: 'x', ans: String(k), restrict: ['plain'] }],
        steps: [
          T`Oznacz $u=\sqrt[3]{${a}+\sqrt{${D}}}$, $v=\sqrt[3]{${a}-\sqrt{${D}}}$. Wtedy $x^3=u^3+v^3+3uv(u+v)$.`,
          T`$u^3+v^3=${2 * a}$, a $uv=\sqrt[3]{${a}^2-${D}}=\sqrt[3]{${a * a - D}}=${c}$.`,
          T`Stąd $x^3=${2 * a}${3 * c >= 0 ? '+' : ''}${3 * c}x$, czyli $x^3${-3 * c >= 0 ? '+' : ''}${-3 * c}x-${2 * a}=0$.`,
          T`Funkcja $x^3+${-3 * c}x$ jest rosnąca, więc jest jeden pierwiastek rzeczywisty. Zgadujemy dzielnik wyrazu wolnego: $x=${k}$ ✓.`,
          T`Zatem $x=${k}\in\mathbb{Q}$.`],
      };
    }
    if (gk === 'nest') {
      const cube = Math.random() < 0.5; const x = R.pick(cube ? [2, 3, 4] : [3, 4, 5]);
      const k = cube ? x ** 3 - x : x * x - x;
      const r = cube ? '\\sqrt[3]' : '\\sqrt';
      return {
        q: T`Oblicz $x=${r}{${k}+${r}{${k}+${r}{${k}+\ldots}}}$.`,
        fields: [{ label: 'x', ans: String(x), restrict: ['plain'] }],
        steps: [
          T`Wyrażenie pod pierwszym pierwiastkiem zawiera całe $x$ jeszcze raz: $x=${r}{${k}+x}$.`,
          cube ? T`Podnosimy do sześcianu: $x^3=${k}+x$, czyli $x^3-x-${k}=0$.` : T`Podnosimy do kwadratu: $x^2=${k}+x$, czyli $x^2-x-${k}=0$.`,
          T`Sprawdzamy dzielniki ${k}: $x=${x}$ jest pierwiastkiem; ${cube ? 'pozostały trójmian kwadratowy nie ma pierwiastków rzeczywistych' : 'drugi pierwiastek jest ujemny, a $x>0$'}.`,
          T`Zatem $x=${x}$ — liczba wymierna.`],
      };
    }
    // gk === 'choice'
    const ratPool = [
      () => { const g = gen11('sqrt2'); return { tex: g.q.match(/\$(.*)\$/)[1], rat: true }; },
      () => ({ tex: T`\sqrt[3]{20+14\sqrt{2}}+\sqrt[3]{20-14\sqrt{2}}`, rat: true }),
      () => ({ tex: T`\sqrt{12+\sqrt{12+\sqrt{12+\ldots}}}`, rat: true }),
      () => ({ tex: T`\sqrt[3]{24+\sqrt[3]{24+\ldots}}`, rat: true }),
      () => ({ tex: T`\sqrt[3]{27}`, rat: true }),
      () => ({ tex: T`\sqrt{3+2\sqrt{2}}-\sqrt{2}`, rat: true }),
    ];
    const irPool = [T`\sqrt[3]{4}`, T`\sqrt[3]{9}`, T`\sqrt{3+2\sqrt{2}}`, T`\sqrt{7+4\sqrt{3}}`, T`\sqrt[3]{6}`, T`\sqrt{6+4\sqrt{2}}-\sqrt{6-4\sqrt{2}}`, T`\sqrt{12}`];
    const rats = R.shuffle(ratPool).slice(0, 3).map(f => f());
    const irs = R.shuffle(irPool).slice(0, 3).map(t => ({ tex: t, rat: false }));
    const all = R.shuffle([...rats, ...irs]);
    return {
      type: 'choice', q: 'Zaznacz wszystkie liczby wymierne.',
      choice: { multi: true, opts: all.map(o => '$' + o.tex + '$'), correct: all.map((o, i) => o.rat ? i : -1).filter(i => i >= 0) },
      steps: ['Sprowadź każde wyrażenie: pierwiastki z $(a\\pm b\\sqrt c)^2$ upraszczają się, a dla nieskończonych wyrażeń zapisz równanie $x=\\sqrt[k]{n+x}$.',
        '$\\sqrt{3+2\\sqrt2}=1+\\sqrt2$ (niewymierna), $\\sqrt{7+4\\sqrt3}=2+\\sqrt3$ (niewymierna), $\\sqrt[3]{20\\pm14\\sqrt2}=2\\pm\\sqrt2$, więc suma $=4$.',
        '$\\sqrt[3]{n}$ jest wymierny tylko gdy $n$ jest sześcianem liczby wymiernej.'],
    };
  }

  /* ---------------- 1.2 (dowody) ---------------- */
  function proof12(p) {
    const t = T`\sqrt[3]{${p}}`, t2 = T`\sqrt[3]{${p * p}}`;
    return {
      steps: [
        T`Załóżmy, że $a+b${t}+c${t2}=0$, gdzie $t=${t}$, $t^2=${t2}$, $t^3=${p}$.`,
        T`Mnożąc równość przez $t$ dostajemy drugą: $at+bt^2+${p}c=0$.`,
        T`Mnożymy pierwszą przez $b$, drugą przez $c$ i odejmujemy: $(b^2-ac)\,t=${p}c^2-ab$.`,
        T`Gdyby $b^2-ac\neq0$, to $t=\frac{${p}c^2-ab}{b^2-ac}\in\mathbb{Q}$ — sprzeczność z niewymiernością $${t}$. Więc $b^2=ac$ i $ab=${p}c^2$.`,
        T`Gdyby $b\neq0$, to $c\neq0$ i $a=\frac{b^2}{c}$, skąd $b^3=${p}c^3$, czyli $${t}=\frac{b}{c}\in\mathbb{Q}$ — sprzeczność.`,
        T`Zatem $b=0$, więc $${p}c^2=0$, czyli $c=0$, a wtedy $a=0$. $\blacksquare$`],
      extra: [T`Podnosimy równość do kwadratu: $(a+b${t}+c${t2})^2=0$, więc każdy składnik jest zerem.`,
        T`Z równości wynika $a=-b${t}$, więc $a$ jest niewymierne — koniec dowodu.`],
    };
  }
  function gen12() {
    const p = R.pick([7, 11, 13, 6, 10]);
    const pr = proof12(p);
    return { type: 'order', q: T`Ułóż dowód: dla $a,b,c\in\mathbb{Q}$, jeżeli $a+b\sqrt[3]{${p}}+c\sqrt[3]{${p * p}}=0$, to $a=b=c=0$.`, order: pr, steps: pr.steps };
  }

  /* ---------------- 1.3 ---------------- */
  function divQ(p, num, den) { // rozwiązuje (a+bt+ct^2)*den = num
    const [d0, d1, d2] = den;
    const M = [[d0, p * d2, p * d1], [d1, d0, p * d2], [d2, d1, d0]];
    const Aug = M.map((r, i) => [...r, num[i]]);
    for (let c = 0; c < 3; c++) {
      let piv = c; while (Math.abs(Aug[piv][c]) < 1e-12) piv++;
      [Aug[c], Aug[piv]] = [Aug[piv], Aug[c]];
      for (let r = 0; r < 3; r++) if (r !== c) { const f = Aug[r][c] / Aug[c][c]; for (let k = 0; k < 4; k++) Aug[r][k] -= f * Aug[c][k]; }
    }
    return [0, 1, 2].map(i => Aug[i][3] / Aug[i][i]);
  }
  function polyTex(v, p) {
    const t = T`\sqrt[3]{${p}}`, t2 = T`\sqrt[3]{${p * p}}`;
    let s = '';
    [[v[0], ''], [v[1], t], [v[2], t2]].forEach(([c, b]) => {
      if (!c) return;
      const sg = c < 0 ? '-' : (s ? '+' : '');
      const ac = Math.abs(c);
      s += sg + (ac === 1 && b ? '' : ac) + b;
    });
    return s || '0';
  }
  function gen13() {
    for (;;) {
      const p = R.pick([2, 3, 5, 7]);
      const x = [R.int(-3, 4), R.int(-3, 3), R.int(-3, 3)];
      const den = [R.int(1, 3), R.int(-2, 2), R.int(-2, 2)];
      if (!x[1] && !x[2]) continue; if (!den[1] && !den[2]) continue;
      const [a, b, c] = x, [d0, d1, d2] = den;
      const num = [a * d0 + p * (b * d2 + c * d1), a * d1 + b * d0 + p * c * d2, a * d2 + b * d1 + c * d0];
      if (num.every(v => Math.abs(v) < 40) && (num[1] || num[2])) {
        const check = divQ(p, num, den); if (check.some((v, i) => Math.abs(v - x[i]) > 1e-9)) continue;
        const t = T`\sqrt[3]{${p}}`;
        return {
          q: T`Liczbę $\dfrac{${polyTex(num, p)}}{${polyTex(den, p)}}$ przedstaw w postaci $a+b${t}+c\sqrt[3]{${p * p}}$, $a,b,c\in\mathbb{Q}$.`,
          fields: [{ label: 'a', ans: String(a) }, { label: 'b', ans: String(b) }, { label: 'c', ans: String(c) }].map(f => Object.assign(f, { restrict: ['plain'] })),
          steps: [
            T`Szukamy $a,b,c$ z równości $(a+bt+ct^2)(${polyTex(den, p).replace(new RegExp('\\\\sqrt\\[3\\]\\{' + p * p + '\\}', 'g'), 't^2').replace(new RegExp('\\\\sqrt\\[3\\]\\{' + p + '\\}', 'g'), 't')})=${polyTex(num, p).replace(new RegExp('\\\\sqrt\\[3\\]\\{' + p * p + '\\}', 'g'), 't^2').replace(new RegExp('\\\\sqrt\\[3\\]\\{' + p + '\\}', 'g'), 't')}$, gdzie $t=${t}$, $t^3=${p}$, $t^4=${p}t$.`,
            T`Wymnażamy i porównujemy współczynniki przy $1$, $t$, $t^2$ (liczby $1,t,t^2$ są liniowo niezależne nad $\mathbb{Q}$ — Zad. 1.2):`,
            T`$$\begin{cases}${d0}a+${p * d2}b+${p * d1}c=${num[0]}\\ ${d1}a+${d0}b+${p * d2}c=${num[1]}\\ ${d2}a+${d1}b+${d0}c=${num[2]}\end{cases}$$`.replace(/\+-/g, '-'),
            T`Rozwiązując układ dostajemy $a=${a}$, $b=${b}$, $c=${c}$.`],
        };
      }
    }
  }
  const item13 = (p, num, den, lab) => {
    const v = divQ(p, num, den).map(x => Math.round(x * 1e6) / 1e6);
    return {
      label: lab, q: T`Liczbę $\dfrac{${polyTex(num, p)}}{${polyTex(den, p)}}$ przedstaw w postaci $a+b\sqrt[3]{${p}}+c\sqrt[3]{${p * p}}$.`,
      fields: ['a', 'b', 'c'].map((l, i) => ({ label: l, ans: String(v[i]), restrict: ['plain'] })),
      sol: [T`Rozwiązujemy $(a+bt+ct^2)\cdot(\text{mianownik})=\text{licznik}$ dla $t=\sqrt[3]{${p}}$, porównując współczynniki przy $1,t,t^2$ (pamiętaj: $t^3=${p}$).`,
        T`Wynik: $a=${v[0]},\ b=${v[1]},\ c=${v[2]}$.`],
    };
  };

  /* ---------------- 1.4 ---------------- */
  const SETS14 = [
    { tex: T`\mathbb{N}`, v: [1, 0, 1, 0], why: T`np. $1-2\notin\mathbb N$, $1:2\notin\mathbb N$` },
    { tex: T`\mathbb{N}_0`, v: [1, 0, 1, 0], why: 'odejmowanie: $0-1$; dzielenie: przez $0$ i $1:2$' },
    { tex: T`\mathbb{Z}`, v: [1, 1, 1, 0], why: T`$1:2\notin\mathbb Z$ oraz dzielenie przez $0$` },
    { tex: T`\mathbb{Z}^*=\{-1,1\}`, v: [0, 0, 1, 1], why: T`$1+1=2\notin\mathbb Z^*$, $1-1=0$; iloczyny i ilorazy to $\pm1$` },
    { tex: T`\mathbb{Q}`, v: [1, 1, 1, 0], why: T`nie można dzielić przez $0\in\mathbb Q$` },
    { tex: T`\mathbb{Q}^*`, v: [0, 0, 1, 1], why: T`$1+(-1)=0\notin\mathbb Q^*$` },
    { tex: T`\mathbb{IQ}`, v: [0, 0, 0, 0], why: T`$\sqrt2+(-\sqrt2)=0$, $\sqrt2-\sqrt2=0$, $\sqrt2\cdot\sqrt2=2$, $\sqrt2:\sqrt2=1$` },
    { tex: T`\mathbb{R}`, v: [1, 1, 1, 0], why: 'dzielenie przez $0$ niewykonalne' },
    { tex: T`\mathbb{R}^*`, v: [0, 0, 1, 1], why: T`$1+(-1)=0\notin\mathbb R^*$` },
  ];
  const SETS14X = [
    { tex: T`2\mathbb{Z}\ (\text{liczby parzyste})`, v: [1, 1, 1, 0], why: T`$2:4\notin 2\mathbb Z$` },
    { tex: T`\{\text{liczby nieparzyste}\}`, v: [0, 0, 1, 0], why: '$1+1=2$ parzyste; $1:3$ nie jest całkowite' },
    { tex: T`\mathbb{Q}_{+}=\{q\in\mathbb Q: q>0\}`, v: [1, 0, 1, 1], why: '$1-2<0$' },
    { tex: T`\{0\}`, v: [1, 1, 1, 0], why: 'nie dzielimy przez $0$' },
    { tex: T`\{0,1\}`, v: [0, 0, 1, 0], why: '$1+1=2$, $0-1=-1$, dzielenie przez $0$' },
    { tex: T`\{1\}`, v: [0, 0, 1, 1], why: '$1+1=2$, $1-1=0$' },
    { tex: T`\mathbb{R}_{+}=(0,\infty)`, v: [1, 0, 1, 1], why: '$1-2<0$' },
    { tex: T`\{-1,0,1\}`, v: [0, 0, 1, 0], why: '$1+1=2$, $-1-1=-2$, dzielenie przez $0$' },
    { tex: T`3\mathbb{Z}`, v: [1, 1, 1, 0], why: T`$3:6\notin3\mathbb Z$` },
  ];
  const OPS = ['dodawanie', 'odejmowanie', 'mnożenie', 'dzielenie'];
  const item14 = (s, lab) => ({
    label: lab, q: T`Które działania są wykonalne w zbiorze $${s.tex}$?`,
    fields: OPS.map((o, i) => yn(o, !!s.v[i])),
    sol: ['Kontrprzykłady / uzasadnienie: ' + s.why + '.'],
  });

  /* ---------------- 1.5 ---------------- */
  const K = [
    [T`K_1=\{a+b\sqrt2\}`, 1], [T`K_2=\{a+b\sqrt[3]{2}\}`, 0], [T`K_3=\{a+b\sqrt[3]{2}+c\sqrt[3]{4}\}`, 1],
    [T`K_4=\{a+b\sqrt3\}`, 1], [T`K_5=\{a+b\sqrt[3]{3}\}`, 0], [T`K_6=\{a+b\sqrt[3]{3}+c\sqrt[3]{9}\}`, 1],
    [T`K_7=\{a+b\sqrt5\}`, 1], [T`K_8=\{a+b\sqrt[3]{5}\}`, 0], [T`K_9=\{a+b\sqrt[3]{5}+c\sqrt[3]{25}\}`, 1]];
  const KX = [
    [T`\{a+b\sqrt6:a,b\in\mathbb Q\}`, 1], [T`\{a+b\sqrt[3]{7}:a,b\in\mathbb Q\}`, 0], [T`\{a+b\sqrt[3]{7}+c\sqrt[3]{49}:a,b,c\in\mathbb Q\}`, 1],
    [T`\{a+b\sqrt2+c\sqrt3:a,b,c\in\mathbb Q\}`, 0], [T`\{a+bi:a,b\in\mathbb Q\}`, 1], [T`\{a+b\sqrt2:a,b\in\mathbb Z\}`, 0],
    [T`\{a+b\sqrt[4]{2}:a,b\in\mathbb Q\}`, 0], [T`\{a+b\sqrt{11}:a,b\in\mathbb Q\}`, 1], [T`\mathbb{Z}`, 0], [T`\mathbb{Q}`, 1]];
  function invItem(a, b, d) {
    const N = a * a - d * b * b;
    const it = {
      q: T`W ciele $\{x+y\sqrt{${d}}:x,y\in\mathbb{Q}\}$ wyznacz $\left(${a}${b < 0 ? '-' : '+'}${Math.abs(b) === 1 ? '' : Math.abs(b)}\sqrt{${d}}\right)^{-1}=x+y\sqrt{${d}}$.`,
      fields: [{ label: 'x', ans: frs(a, N), restrict: ['plain'] }, { label: 'y', ans: frs(-b, N), restrict: ['plain'] }],
      steps: [T`Mnożymy licznik i mianownik ułamka $\frac{1}{${a}${b < 0 ? '-' : '+'}${Math.abs(b) === 1 ? '' : Math.abs(b)}\sqrt{${d}}}$ przez sprzężenie $${a}${b < 0 ? '+' : '-'}${Math.abs(b) === 1 ? '' : Math.abs(b)}\sqrt{${d}}$.`,
        T`Mianownik: $${a}^2-${d}\cdot${b * b}=${N}$ (różnica kwadratów — liczba wymierna, niezerowa, bo $\sqrt{${d}}\notin\mathbb Q$).`,
        T`Wynik: $x=${fr(a, N)}$, $y=${fr(-b, N)}$.`],
    };
    it.sol = it.steps; return it;
  }
  function gen15(gk) {
    if (gk === 'choice') {
      const pool = R.shuffle(KX).slice(0, 6);
      return { type: 'choice', q: 'Które z tych zbiorów są ciałami liczbowymi?', choice: { multi: true, opts: pool.map(k => '$' + k[0] + '$'), correct: pool.map((k, i) => k[1] ? i : -1).filter(i => i >= 0) },
        steps: ['Sprawdzamy zamkniętość na $+,-,\\cdot$ oraz istnienie odwrotności niezerowych elementów.', '$\\{a+b\\sqrt[3]{p}\\}$ nie jest zamknięty na mnożenie: $\\sqrt[3]{p}\\cdot\\sqrt[3]{p}=\\sqrt[3]{p^2}$.', '$\\{a+b\\sqrt2+c\\sqrt3\\}$: $\\sqrt2\\cdot\\sqrt3=\\sqrt6$ nie należy do zbioru.', '$\\{a+b\\sqrt2:a,b\\in\\mathbb Z\\}$: brak odwrotności $2$.'] };
    }
    if (gk === 'cinv') {
      const p = R.pick([2, 3, 5, 7]); const k = R.pick([1, 2]);
      // (k t)^{-1} = t^2/(k p)
      return { q: T`W ciele $\mathbb{Q}(\sqrt[3]{${p}})$ wyznacz $\left(${k === 1 ? '' : k}\sqrt[3]{${p}}\right)^{-1}=a+b\sqrt[3]{${p}}+c\sqrt[3]{${p * p}}$.`,
        fields: [{ label: 'a', ans: '0' }, { label: 'b', ans: '0' }, { label: 'c', ans: frs(1, k * p) }].map(f => Object.assign(f, { restrict: ['plain'] })),
        steps: [T`Mnożymy przez $\sqrt[3]{${p * p}}$: $${k === 1 ? '' : k}\sqrt[3]{${p}}\cdot\sqrt[3]{${p * p}}=${k * p}$.`, T`Zatem odwrotność to $\frac{1}{${k * p}}\sqrt[3]{${p * p}}$: $a=0,b=0,c=${fr(1, k * p)}$.`] };
    }
    let a, b, d, N;
    do { d = R.pick([2, 3, 5, 6, 7, 10]); a = R.nz(-4, 5); b = R.nz(-3, 3); N = a * a - d * b * b; } while (N === 0 || Math.abs(N) > 12);
    return invItem(a, b, d);
  }

  /* ---------------- 1.6 / 1.7 ---------------- */
  const OPS6 = [
    { lab: '6.1', tex: T`X=\mathbb{Z},\quad x\circ y=x+y-xy`, c: 1, a: 1, e: '0', inv: ['0', '2'], why: T`$x\circ y=1-(1-x)(1-y)$, więc łączne; $x\circ0=x$. Odwrotny: $y=\frac{x}{x-1}\in\mathbb Z\iff x\in\{0,2\}$.` },
    { lab: '6.2', tex: T`X=\{-1,0,1\},\quad x\circ y=x^2-y^2`, c: 0, a: 0, e: 'brak', why: T`$1\circ0=1\ne-1=0\circ1$; $(1\circ1)\circ1=-1\ne1=1\circ(1\circ1)$; $x\circ e=x$ dla $x=0$ wymusza $e=0$, ale $(-1)\circ0=1$.` },
    { lab: '6.3', tex: T`X=\mathbb{Q}^*,\quad x\circ y=\tfrac{x}{y}+\tfrac{y}{x}`, c: 1, a: 0, e: 'brak', why: T`$(1\circ1)\circ2=2\circ2=2$, a $1\circ(1\circ2)=1\circ\frac52=\frac{29}{10}$; $1\circ e=1$ daje $e^2-e+1=0$ — brak rozwiązań.` },
    { lab: '6.4', tex: T`X=\mathbb{N},\quad x\circ y=\mathrm{NWD}(x,y)`, c: 1, a: 1, e: 'brak', why: T`$\mathrm{NWD}(x,e)=x$ dla wszystkich $x$ wymagałoby, by każde $x$ dzieliło $e$.` },
    { lab: '6.5', tex: T`X=\mathbb{N},\quad x\circ y=\mathrm{NWW}(x,y)`, c: 1, a: 1, e: '1', inv: ['1'], why: T`$\mathrm{NWW}(x,1)=x$; $\mathrm{NWW}(x,y)=1\iff x=y=1$.` },
    { lab: '6.6', tex: T`X=\mathbb{N}_0,\quad x\circ y=\min(x,y)`, c: 1, a: 1, e: 'brak', why: T`$\min(x,e)=x$ dla wszystkich $x$ wymaga $e\ge x$ dla każdego $x$ — nie ma największej liczby.` },
    { lab: '6.7', tex: T`X=\mathbb{N}_0,\quad x\circ y=\max(x,y)`, c: 1, a: 1, e: '0', inv: ['0'], why: T`$\max(x,0)=x$; $\max(x,y)=0\iff x=y=0$.` },
    { lab: '6.8', tex: T`X=\mathbb{Q},\quad x\circ y=\min(x,y)`, c: 1, a: 1, e: 'brak', why: T`W $\mathbb Q$ nie ma elementu największego.` },
    { lab: '6.9', tex: T`X=\mathbb{Q},\quad x\circ y=\max(x,y)`, c: 1, a: 1, e: 'brak', why: T`W $\mathbb Q$ nie ma elementu najmniejszego.` },
  ];
  const OPS6X = [
    { tex: T`X=\mathbb{Z},\quad x\circ y=x+y+1`, c: 1, a: 1, e: '-1', inv: 'all', invf: '-2-x', why: T`$(x\circ y)\circ z=x+y+z+2$ symetrycznie; $x\circ(-1)=x$; odwrotny do $x$ to $-2-x$.` },
    { tex: T`X=\mathbb{Z},\quad x\circ y=x+y-2`, c: 1, a: 1, e: '2', inv: 'all', invf: '4-x', why: T`$x\circ2=x$; odwrotny do $x$ to $4-x$.` },
    { tex: T`X=\mathbb{Z},\quad x\circ y=xy`, c: 1, a: 1, e: '1', inv: ['1', '-1'], why: T`$x\cdot1=x$; $xy=1$ w $\mathbb Z$ tylko dla $x=\pm1$.` },
    { tex: T`X=\mathbb{Z},\quad x\circ y=x+y+xy`, c: 1, a: 1, e: '0', inv: ['0', '-2'], why: T`$x\circ y=(1+x)(1+y)-1$; $y=\frac{-x}{1+x}\in\mathbb Z\iff x\in\{0,-2\}$.` },
    { tex: T`X=\mathbb{Z},\quad x\circ y=x+y-2xy`, c: 1, a: 1, e: '0', inv: ['0', '1'], why: T`$1-2(x\circ y)=(1-2x)(1-2y)$; $y=\frac{x}{2x-1}\in\mathbb Z\iff x\in\{0,1\}$.` },
    { tex: T`X=\mathbb{N}_0,\quad x\circ y=|x-y|`, c: 1, a: 0, e: '0', why: T`$(1\circ2)\circ3=2$, $1\circ(2\circ3)=0$; $|x-0|=x$.` },
    { tex: T`X=\mathbb{Z},\quad x\circ y=2x+2y`, c: 1, a: 0, e: 'brak', why: T`$(x\circ y)\circ z=4x+4y+2z$, a $x\circ(y\circ z)=2x+4y+4z$ — różne (np. dla $x=1,y=z=0$); $2x+2e=x$ dla wszystkich $x$ — niemożliwe.` },
    { tex: T`X=\mathbb{Z},\quad x\circ y=x`, c: 0, a: 1, e: 'brak', why: T`$x\circ y=x\ne y=y\circ x$; łączne: oba nawiasowania dają $x$; $e\circ x=e\ne x$.` },
    { tex: T`X=\mathbb{Q},\quad x\circ y=\tfrac{x+y}{2}`, c: 1, a: 0, e: 'brak', why: T`$(0\circ0)\circ4=2\ne1=0\circ(0\circ4)$; $\frac{x+e}{2}=x\Rightarrow e=x$ zależy od $x$.` },
  ];
  const item6 = (o, lab) => ({
    label: lab, q: T`Czy działanie $\circ$ jest przemienne i łączne? Jaki jest element neutralny?$$${o.tex}$$`,
    fields: [yn('przemienne', !!o.c), yn('łączne', !!o.a), { label: 'element neutralny', ans: o.e, allowBrak: true, restrict: [] }],
    sol: [o.why], keys: ['brak'],
  });
  const item7 = (o, lab) => ({
    label: lab, q: T`Wyznacz wszystkie elementy mające element odwrotny dla: $$${o.tex}$$`,
    fields: [{ label: 'elementy odwracalne', kind: 'set', ans: o.inv }], sol: [o.why], keys: [';'],
  });
  function gen16b() { const o = R.pick(OPS6X); const it = item6(o); it.steps = [T`Sprawdzamy przemienność: czy $x\circ y=y\circ x$ dla wszystkich $x,y$.`, T`Łączność: porównujemy $(x\circ y)\circ z$ z $x\circ(y\circ z)$ (wystarczy jeden kontrprzykład, by obalić).`, T`Element neutralny $e$: $x\circ e=e\circ x=x$ dla każdego $x$.`, o.why]; return it; }
  function gen17() { const o = R.pick(OPS6X.filter(o => o.inv && o.inv !== 'all')); const it = item7(o); it.steps = [T`Najpierw element neutralny: $e=${o.e}$.`, T`Szukamy $y$ z $x\circ y=e$ i sprawdzamy, kiedy $y\in X$.`, o.why]; return it; }

  /* ---------------- 1.8 ---------------- */
  // tabelka działania w Z_p: wiersz r; kolumny z ks to pola do uzupełnienia
  const HL = x => (x === '?' ? T`\boxed{\,?\,}` : T`\boxed{\mathbf{${x}}}`);
  function rowCols(p, ks) { return p <= 7 ? [...Array(p)].map((_, k) => k) : ks; }
  function rowTable(p, r, ks, mul, show) {
    const cols = rowCols(p, ks), op = mul ? T`\cdot` : '+';
    const cell = k => { const v = mul ? (r * k) % p : (r + k) % p; return ks.includes(k) ? (show ? HL(v) : HL('?')) : String(v); };
    return T`$$\begin{array}{c|${'c'.repeat(cols.length)}}${op}&${cols.join('&')}\\\hline ${r}&${cols.map(cell).join('&')}\end{array}$$`;
  }
  function rowQ(p, r, ks, mul, lead) {
    return lead + (p <= 7 ? ' Uzupełnij pola ze znakiem zapytania:' : ' Uzupełnij wybrane kolumny:') + rowTable(p, r, ks, mul, false);
  }
  function rowSol(p, r, ks, mul) {
    const cols = rowCols(p, ks), op = mul ? T`\cdot` : '+';
    const raw = k => (mul ? r * k : r + k);
    const ex = ks.find(k => raw(k) >= p);
    return [
      T`W $\mathbb{Z}_{${p}}$ liczymy zwykły wynik, a potem bierzemy resztę z dzielenia przez $${p}$ (odejmujemy $${p}$ tyle razy, aż wynik będzie mniejszy niż $${p}$). W tabelce poniżej górny wiersz to zwykły wynik $${r}${mul ? '\\cdot' : '+'} k$, a dolny — reszta z dzielenia przez $${p}$.`,
      T`$$\begin{array}{r|${'c'.repeat(cols.length)}}k&${cols.join('&')}\\\hline ${r}${op} k&${cols.map(k => String(raw(k))).join('&')}\\ \text{reszta}&${cols.map(k => (ks.includes(k) ? HL(raw(k) % p) : String(raw(k) % p))).join('&')}\end{array}$$`,
      ex != null ? T`Np. $${r}${op}${ex}=${raw(ex)}=${Math.floor(raw(ex) / p)}\cdot${p}+${raw(ex) % p}$, więc w $\mathbb{Z}_{${p}}$ wychodzi $${raw(ex) % p}$.` : T`Wszystkie wyniki są mniejsze niż $${p}$, więc zostają bez zmian.`,
      T`<b>Wiersz $${r}$ w tabelce:</b>` + rowTable(p, r, ks, mul, true),
    ];
  }
  function gen18(gk) {
    const p = R.pick([5, 7, 11, 13]);
    if (gk === 'row') {
      const mulOp = Math.random() < 0.7; const r = R.int(2, p - 1);
      const ks = R.shuffle([...Array(p - 1)].map((_, i) => i + 1)).slice(0, Math.min(5, p - 1)).sort((a, b) => a - b);
      return { q: rowQ(p, r, ks, mulOp, T`Tabelka ${mulOp ? 'mnożenia' : 'dodawania'} w $\mathbb{Z}_{${p}}$ — wiersz $${r}$.`), fields: ks.map(k => ({ label: T`${r}${mulOp ? '\\cdot' : '+'}${k}`, kind: 'mod', mod: p, ans: String(mulOp ? (r * k) % p : (r + k) % p) })), steps: rowSol(p, r, ks, mulOp) };
    }
    if (gk === 'inv') {
      const a = R.int(2, p - 1); const x = invMod(a, p);
      return { q: T`Wyznacz $${a}^{-1}$ w ciele $\mathbb{Z}_{${p}}$.`, fields: [{ label: T`${a}^{-1}`, kind: 'mod', mod: p, ans: String(x) }],
        steps: [T`Szukamy $x$ takiego, że $${a}x\equiv1\pmod{${p}}$.`, T`Sprawdzamy kolejne $x$ (lub algorytm Euklidesa): $${a}\cdot${x}=${a * x}=${Math.floor(a * x / p)}\cdot${p}+1$.`, T`Zatem $${a}^{-1}=${x}$.`] };
    }
    if (gk === 'ops') {
      const a = R.int(1, p - 1), b = R.int(1, p - 1), c = R.int(2, p - 1);
      const ci = invMod(c * c, p);
      return { q: T`W ciele $\mathbb{Z}_{${p}}$ oblicz $${a}+${b}$, $${a}\cdot${b}$, $${a}-${b}$ oraz $${a}\cdot${c}^{-2}$.`,
        fields: [{ label: T`${a}+${b}`, ans: (a + b) % p }, { label: T`${a}\cdot${b}`, ans: (a * b) % p }, { label: T`${a}-${b}`, ans: md(a - b, p) }, { label: T`${a}\cdot${c}^{-2}`, ans: (a * ci) % p }].map(f => Object.assign(f, { kind: 'mod', mod: p, ans: String(f.ans) })),
        steps: [T`$${a}-${b}=${a - b}\equiv${md(a - b, p)}$ (dodajemy $${p}$, gdy wynik ujemny).`, T`$${c}^{2}=${c * c}\equiv${(c * c) % p}$, a jego odwrotność to $${ci}$, bo $${(c * c) % p}\cdot${ci}=${((c * c) % p) * ci}\equiv1$.`, T`$${a}\cdot${c}^{-2}=${a}\cdot${ci}=${a * ci}\equiv${(a * ci) % p}$.`] };
    }
    // expr: a^k * (b^2 - c) * (d*(-e))^{-1}
    const P = R.pick([7, 11, 13]); const a = R.int(2, P - 2), k = R.int(P, 2 * P), b = R.int(2, 6), c = R.int(1, 9), d = R.int(2, 5), e = R.int(2, 5);
    const ak = pw(a, k, P), bc = md(b * b - c, P), de = md(-d * e, P), dei = invMod(de, P);
    if (!dei || !bc) return gen18('expr');
    const res = md(ak * bc * dei, P);
    return { q: T`Oblicz $${a}^{${k}}\cdot(${b}^2-${c})\cdot(${d}\cdot(-${e}))^{-1}$ w ciele $\mathbb{Z}_{${P}}$.`, fields: [{ label: 'wynik', kind: 'mod', mod: P, ans: String(res) }],
      steps: [T`Małe tw. Fermata: $${a}^{${P - 1}}=1$, więc $${a}^{${k}}=${a}^{${k % (P - 1)}}=${ak}$.`, T`$${b}^2-${c}=${b * b - c}\equiv${bc}$.`, T`$${d}\cdot(-${e})=-${d * e}\equiv${de}$, odwrotność: $${dei}$ (bo $${de}\cdot${dei}\equiv1$).`, T`Wynik: $${ak}\cdot${bc}\cdot${dei}=${ak * bc * dei}\equiv${res}$.`] };
  }

  /* ---------------- 1.9 ---------------- */
  function matTex(M, p) { return T`\left[\begin{array}{ccc|c}` + M.map(r => r.join(' & ')).join(T`\\`) + T`\end{array}\right]`; }
  function solveModSteps(M0, p) {
    const M = M0.map(r => r.slice()); const steps = [T`Macierz rozszerzona układu: $$${matTex(M)}$$`];
    for (let c = 0; c < 3; c++) {
      let piv = c; while (piv < 3 && M[piv][c] % p === 0) piv++;
      if (piv === 3) return null;
      if (piv !== c) { [M[c], M[piv]] = [M[piv], M[c]]; steps.push(T`Zamieniamy wiersze $w_${c + 1}\leftrightarrow w_${piv + 1}$.`); }
      const iv = invMod(M[c][c], p);
      if (iv !== 1) { M[c] = M[c].map(v => md(v * iv, p)); steps.push(T`$w_${c + 1}\cdot ${iv}$ (bo $${iv}$ to odwrotność elementu wiodącego): $$${matTex(M)}$$`); }
      const ops = [];
      for (let r = 0; r < 3; r++) if (r !== c && M[r][c] % p) { const f = M[r][c]; M[r] = M[r].map((v, k) => md(v - f * M[c][k], p)); ops.push(T`w_${r + 1}-${f}w_${c + 1}`); }
      if (ops.length) steps.push(T`$${ops.join(',\ ')}$: $$${matTex(M)}$$`);
    }
    return { steps, sol: M.map(r => r[3]) };
  }
  function gen19() {
    for (;;) {
      const p = R.pick([5, 7, 11]); const s = [R.int(0, p - 1), R.int(0, p - 1), R.int(0, p - 1)];
      const M = [0, 1, 2].map(() => [R.int(1, p - 1), R.int(0, p - 1), R.int(0, p - 1)].map((v, i, a) => v));
      M.forEach(r => r.push(md(r[0] * s[0] + r[1] * s[1] + r[2] * s[2], p)));
      const res = solveModSteps(M, p); if (!res) continue;
      const eq = r => { let t = ''; ['x', 'y', 'z'].forEach((v, i) => { if (!r[i]) return; t += (t ? '+' : '') + (r[i] === 1 ? '' : r[i]) + v; }); return t + '=' + r[3]; };
      return { q: T`W ciele $\mathbb{Z}_{${p}}$ rozwiąż układ $$\begin{cases}${M.map(eq).join(T`\\`)}\end{cases}$$`,
        fields: ['x', 'y', 'z'].map((l, i) => ({ label: l, kind: 'mod', mod: p, ans: String(s[i]) })), steps: [...res.steps, T`Odczytujemy: $x=${s[0]},\ y=${s[1]},\ z=${s[2]}$.`] };
    }
  }

  /* ---------------- 1.10 ---------------- */
  const par = v => (v < 0 ? '(' + v + ')' : String(v));
  function gen110(gk) {
    if (gk === 'inv') {
      const [a, b] = R.pick([[3, 4], [4, 3], [1, 1], [1, 2], [2, 1], [1, -1], [0, 2], [5, 12], [-3, 4], [2, -2]]);
      const N = a * a + b * b;
      return { q: T`Wyznacz element odwrotny do $(${a},${b})$ w ciele $\mathbb{R}\times\mathbb{R}$.`, fields: [{ label: 'pierwsza współrzędna', ans: frs(a, N) }, { label: 'druga współrzędna', ans: frs(-b, N) }],
        steps: [T`Szukamy $(y_1,y_2)$ takiego, że $(${a},${b})\cdot(y_1,y_2)=(1,0)$, czyli $${a}y_1${b >= 0 ? '-' : '+'}${Math.abs(b)}y_2=1$ oraz $${a}y_2${b >= 0 ? '+' : '-'}${Math.abs(b)}y_1=0$.`, T`Rozwiązanie: $(y_1,y_2)=\left(\frac{x_1}{x_1^2+x_2^2},\frac{-x_2}{x_1^2+x_2^2}\right)$, tu $x_1^2+x_2^2=${N}$.`, T`Wynik: $\left(${fr(a, N)},\ ${fr(-b, N)}\right)$.`] };
    }
    const x = [R.int(-4, 5), R.int(-4, 5)], y = [R.int(-4, 5), R.int(-4, 5)];
    const r = [x[0] * y[0] - x[1] * y[1], x[0] * y[1] + x[1] * y[0]];
    return { q: T`Oblicz $(${x[0]},${x[1]})\cdot(${y[0]},${y[1]})$ w $\mathbb{R}\times\mathbb{R}$ z mnożeniem $(x_1,x_2)\cdot(y_1,y_2)=(x_1y_1-x_2y_2,\ x_1y_2+x_2y_1)$.`,
      fields: [{ label: 'pierwsza', ans: String(r[0]) }, { label: 'druga', ans: String(r[1]) }].map(f => Object.assign(f, { restrict: ['plain'] })),
      steps: [T`Pierwsza: $${x[0]}\cdot${par(y[0])}-${par(x[1])}\cdot${par(y[1])}=${r[0]}$.`, T`Druga: $${x[0]}\cdot${par(y[1])}+${par(x[1])}\cdot${par(y[0])}=${r[1]}$.`, T`Uwaga: to dokładnie mnożenie liczb $${A.Z.tex(x[0], x[1])}$ i $${A.Z.tex(y[0], y[1])}$ w $\mathbb C$.`] };
  }

  A.addList({
    num: 1, id: 'l1', title: 'Lista 1', name: 'Ciała liczbowe i działania', hue: 'l1',
    blurb: 'Liczby wymierne i niewymierne, ciała $\\mathbb{Q}(\\sqrt[3]{p})$, własności działań, arytmetyka w $\\mathbb{Z}_p$.',
    tasks: [
      {
        id: '1.1', name: 'Które liczby są wymierne?', statement: T`Które spośród liczb $\sqrt{6+4\sqrt2}+\sqrt{6-4\sqrt2}$, $\sqrt[3]{2+\sqrt5}+\sqrt[3]{2-\sqrt5}$, $\sqrt[3]{1+\frac23\sqrt{\frac73}}+\sqrt[3]{1-\frac23\sqrt{\frac73}}$, $\sqrt[3]{6+\sqrt[3]{6+\ldots}}$, $\sqrt[3]{2}$, $\sqrt[3]{3}$, $\sqrt[3]{5}$ są wymierne?`,
        wzory: [T`$(a\pm b)^2=a^2\pm2ab+b^2$, więc $\sqrt{x^2+y^2c\pm2xy\sqrt c}=|x\pm y\sqrt c|$.`, T`$(u+v)^3=u^3+v^3+3uv(u+v)$ — przy $x=u+v$ dostajemy równanie sześcienne na $x$.`, T`Wyrażenie nieskończone $x=\sqrt[k]{n+\sqrt[k]{n+\ldots}}$ spełnia $x^k=n+x$.`, T`Twierdzenie o pierwiastkach wymiernych: wymierny pierwiastek wielomianu o współczynnikach całkowitych $\frac pq$ ma $p\mid a_0$, $q\mid a_n$.`, T`$\sqrt[3]{n}\in\mathbb Q$ $\iff$ $n$ jest sześcianem liczby całkowitej (dla $n\in\mathbb N$).`],
        gen: gen11,
        items: [
          { label: 'a', gk: 'sqrt2', q: T`Oblicz $\sqrt{6+4\sqrt2}+\sqrt{6-4\sqrt2}$.`, fields: [{ label: 'wartość', ans: '4', restrict: ['plain'] }], sol: [T`$6\pm4\sqrt2=(2\pm\sqrt2)^2$, a $2>\sqrt2$.`, T`Suma: $(2+\sqrt2)+(2-\sqrt2)=4$ — wymierna.`] },
          { label: 'b', gk: 'cbrt', q: T`Oblicz $x=\sqrt[3]{2+\sqrt5}+\sqrt[3]{2-\sqrt5}$.`, fields: [{ label: 'x', ans: '1', restrict: ['plain'] }], sol: [T`$x^3=4+3\sqrt[3]{4-5}\,x=4-3x$.`, T`$x^3+3x-4=(x-1)(x^2+x+4)=0$, więc $x=1$.`] },
          { label: 'c', gk: 'cbrt', q: T`Oblicz $x=\sqrt[3]{1+\frac23\sqrt{\frac73}}+\sqrt[3]{1-\frac23\sqrt{\frac73}}$.`, fields: [{ label: 'x', ans: '1', restrict: ['plain'] }], sol: [T`$uv=\sqrt[3]{1-\frac49\cdot\frac73}=\sqrt[3]{-\frac1{27}}=-\frac13$.`, T`$x^3=2-x$, czyli $(x-1)(x^2+x+2)=0$, więc $x=1$.`] },
          { label: 'd', gk: 'nest', q: T`Oblicz $x=\sqrt[3]{6+\sqrt[3]{6+\sqrt[3]{6+\ldots}}}$.`, fields: [{ label: 'x', ans: '2', restrict: ['plain'] }], sol: [T`$x^3=6+x\Rightarrow(x-2)(x^2+2x+3)=0$, więc $x=2$.`] },
          { label: 'e', gk: 'choice', type: 'choice', q: 'Zaznacz wszystkie liczby wymierne.', choice: { multi: true, opts: [T`$\sqrt{6+4\sqrt2}+\sqrt{6-4\sqrt2}$`, T`$\sqrt[3]{2+\sqrt5}+\sqrt[3]{2-\sqrt5}$`, T`$\sqrt[3]{1+\frac23\sqrt{\frac73}}+\sqrt[3]{1-\frac23\sqrt{\frac73}}$`, T`$\sqrt[3]{6+\sqrt[3]{6+\ldots}}$`, T`$\sqrt[3]{2}$`, T`$\sqrt[3]{3}$`, T`$\sqrt[3]{5}$`], correct: [0, 1, 2, 3] }, sol: [T`Pierwsze cztery to $4,1,1,2$. Liczby $2,3,5$ nie są sześcianami, więc ich pierwiastki sześcienne są niewymierne.`] },
        ],
      },
      {
        id: '1.2', name: 'Liniowa niezależność $1,\\sqrt[3]{p},\\sqrt[3]{p^2}$', statement: T`Udowodnić, że dla dowolnych liczb wymiernych $a,b,c$: jeżeli $a+b\sqrt[3]{p}+c\sqrt[3]{p^2}=0$ (dla $p=2,3,5$), to $a=b=c=0$.`,
        wzory: [T`$t=\sqrt[3]{p}$ spełnia $t^3=p$, a dla $p$ niebędącego sześcianem $t\notin\mathbb Q$.`, T`Dowód nie wprost: zakładamy, że któryś współczynnik $\neq0$ i dochodzimy do $t\in\mathbb Q$.`, T`Eliminacja: z równań $a+bt+ct^2=0$ i $at+bt^2+pc=0$ usuwamy $t^2$.`],
        gen: gen12, proof: true,
        items: [2, 3, 5].map((p, i) => ({ label: '2.' + (i + 1), type: 'order', q: T`Ułóż dowód: jeżeli $a+b\sqrt[3]{${p}}+c\sqrt[3]{${p * p}}=0$, $a,b,c\in\mathbb Q$, to $a=b=c=0$.`, order: proof12(p) })),
      },
      {
        id: '1.3', name: 'Usuwanie niewymierności $\\sqrt[3]{p}$', statement: T`Przedstawić podane ułamki w postaci $a+b\sqrt[3]{p}+c\sqrt[3]{p^2}$, $a,b,c\in\mathbb Q$.`,
        wzory: [T`$t=\sqrt[3]{p}$: $t^3=p$, $t^4=pt$.`, T`Metoda: szukamy $x=a+bt+ct^2$ z równości $x\cdot(\text{mianownik})=\text{licznik}$; porównujemy współczynniki przy $1,t,t^2$ (to wolno, bo z Zad. 1.2 są liniowo niezależne).`, T`$(a+bt+ct^2)(d_0+d_1t+d_2t^2)=(ad_0+p(bd_2+cd_1))+(ad_1+bd_0+pcd_2)t+(ad_2+bd_1+cd_0)t^2$.`],
        gen: gen13,
        items: [item13(2, [4, 2, 0], [2, 1, -2], '3.1'), item13(3, [5, 15, 0], [2, 1, -2], '3.2'), item13(5, [-16, 16, 5], [2, -3, 2], '3.3')],
      },
      {
        id: '1.4', name: 'Wykonalność działań w zbiorach', statement: T`W których spośród zbiorów $\mathbb N,\mathbb N_0,\mathbb Z,\mathbb Z^*,\mathbb Q,\mathbb Q^*,\mathbb{IQ},\mathbb R,\mathbb R^*$ można wykonać dodawanie, odejmowanie, mnożenie, dzielenie?`,
        wzory: [T`Działanie jest <b>wykonalne</b> w $X$, gdy dla <i>wszystkich</i> $x,y\in X$ wynik istnieje i należy do $X$.`, T`Dzielenie: trzeba móc podzielić przez <i>każdy</i> element — jeśli $0\in X$, dzielenie nie jest wykonalne.`, T`Wystarczy jeden kontrprzykład, by pokazać niewykonalność.`, T`$\mathbb Z^*=\{-1,1\}$, $\mathbb Q^*=\mathbb Q\setminus\{0\}$, $\mathbb{IQ}$ — liczby niewymierne.`],
        gen: () => { const s = R.pick(SETS14X); const it = item14(s); it.steps = [T`Dla każdego działania szukamy kontrprzykładu w zbiorze $${s.tex}$.`, it.sol[0], 'Gdy kontrprzykładu nie ma — działanie jest wykonalne.']; return it; },
        items: SETS14.map((s, i) => item14(s, ['ℕ', 'ℕ₀', 'ℤ', 'ℤ*', 'ℚ', 'ℚ*', 'IQ', 'ℝ', 'ℝ*'][i])),
      },
      {
        id: '1.5', name: 'Ciała liczbowe', statement: T`Które z następujących zbiorów są ciałami liczbowymi: $K_1=\{a+b\sqrt2\}$, $K_2=\{a+b\sqrt[3]2\}$, $K_3=\{a+b\sqrt[3]2+c\sqrt[3]4\}$, $K_4$–$K_9$ analogicznie dla $\sqrt3,\sqrt[3]3,\sqrt5,\sqrt[3]5$ ($a,b,c\in\mathbb Q$)?`,
        wzory: [T`Ciało liczbowe: $K\subseteq\mathbb C$, $0,1\in K$, zamknięte na $+,-,\cdot$ i branie odwrotności niezerowych elementów.`, T`$\frac{1}{a+b\sqrt d}=\frac{a-b\sqrt d}{a^2-db^2}$.`, T`$\sqrt[3]{p}\cdot\sqrt[3]{p}=\sqrt[3]{p^2}$ — nie da się tego zapisać jako $a+b\sqrt[3]{p}$ (Zad. 1.2).`, T`W $\mathbb Q(\sqrt[3]p)$ odwrotność znajdziesz metodą z Zad. 1.3.`],
        gen: gen15,
        items: [
          { label: 'wybór', gk: 'choice', type: 'choice', q: 'Zaznacz zbiory, które są ciałami liczbowymi.', choice: { multi: true, opts: K.map(k => '$' + k[0] + '$'), correct: K.map((k, i) => k[1] ? i : -1).filter(i => i >= 0) }, sol: [T`$K_2,K_5,K_8$ nie są zamknięte na mnożenie: $\sqrt[3]p\cdot\sqrt[3]p=\sqrt[3]{p^2}\notin K$. Pozostałe są ciałami.`] },
          Object.assign(invItem(1, 1, 2), { label: 'K₁', gk: 'inv' }),
          Object.assign(invItem(2, 1, 3), { label: 'K₄', gk: 'inv' }),
          Object.assign(invItem(1, 1, 5), { label: 'K₇', gk: 'inv' }),
          { label: 'K₆', gk: 'cinv', q: T`W $K_6$ wyznacz $\left(\sqrt[3]{3}\right)^{-1}=a+b\sqrt[3]{3}+c\sqrt[3]{9}$.`, fields: [{ label: 'a', ans: '0' }, { label: 'b', ans: '0' }, { label: 'c', ans: '1/3' }].map(f => Object.assign(f, { restrict: ['plain'] })), sol: [T`$\sqrt[3]3\cdot\sqrt[3]9=3$, więc $(\sqrt[3]3)^{-1}=\frac13\sqrt[3]9$.`] },
        ],
      },
      {
        id: '1.6', name: 'Własności działań', statement: T`Czy działanie $\circ$ określone w zbiorze $X$ jest przemienne, łączne, ma element neutralny?`,
        wzory: [T`Przemienność: $x\circ y=y\circ x$ dla wszystkich $x,y\in X$.`, T`Łączność: $(x\circ y)\circ z=x\circ(y\circ z)$.`, T`Element neutralny $e\in X$: $x\circ e=e\circ x=x$ dla każdego $x\in X$ (jeden $e$ dla wszystkich $x$!).`, T`Sztuczka: $x+y-xy=1-(1-x)(1-y)$ — działanie „przenosi się” na mnożenie.`, T`$\mathbb N=\{1,2,3,\ldots\}$, $\mathbb N_0=\mathbb N\cup\{0\}$.`],
        gen: gen16b,
        items: OPS6.map(o => item6(o, o.lab)),
      },
      {
        id: '1.7', name: 'Elementy odwrotne', statement: T`W działaniach z Zadania 1.6 wyznaczyć wszystkie elementy, które posiadają element odwrotny (o ile istnieje element neutralny).`,
        wzory: [T`$y$ jest odwrotny do $x$, gdy $x\circ y=y\circ x=e$.`, T`Bez elementu neutralnego pytanie o odwrotność nie ma sensu.`, T`Dla $x\circ y=x+y-xy$: $x\circ y=0\iff y=\frac{x}{x-1}$.`],
        gen: gen17,
        items: [
          { label: 'bez e', type: 'choice', gk: 'set', q: 'Dla których działań z Zad. 1.6 nie istnieje element neutralny (więc nie ma elementów odwrotnych)?', choice: { multi: true, opts: OPS6.map(o => o.lab + ': $' + o.tex + '$'), correct: OPS6.map((o, i) => o.e === 'brak' ? i : -1).filter(i => i >= 0) }, sol: ['Element neutralny mają tylko 6.1 ($e=0$), 6.5 ($e=1$) i 6.7 ($e=0$).'] },
          ...OPS6.filter(o => o.inv).map(o => item7(o, o.lab)),
        ],
      },
      {
        id: '1.8', name: 'Arytmetyka w $\\mathbb{Z}_p$', statement: T`Tabelki działań i obliczenia w ciałach $\mathbb Z_5,\mathbb Z_7,\mathbb Z_{11},\mathbb Z_{13}$.`,
        wzory: [T`$\mathbb Z_p=\{0,1,\ldots,p-1\}$, działania modulo $p$: wynik to reszta z dzielenia przez $p$.`, T`$-a\equiv p-a$.`, T`$a^{-1}$: taki $x$, że $ax\equiv1\pmod p$. Szukaj wśród $1,\ldots,p-1$ albo algorytmem Euklidesa.`, T`Małe tw. Fermata: $a^{p-1}\equiv1\pmod p$ dla $a\not\equiv0$, więc $a^k=a^{k\bmod(p-1)}$.`, T`$a^{-2}=(a^2)^{-1}=(a^{-1})^2$.`],
        gen: gen18,
        items: [
          { label: '8.1a', gk: 'row', q: rowQ(5, 3, [0, 1, 2, 3, 4], false, T`Tabelka dodawania w $\mathbb Z_5$ — wiersz $3$.`), fields: [0, 1, 2, 3, 4].map(k => ({ label: '3+' + k, kind: 'mod', mod: 5, ans: String((3 + k) % 5) })), sol: rowSol(5, 3, [0, 1, 2, 3, 4], false) },
          { label: '8.1b', gk: 'row', q: rowQ(5, 3, [1, 2, 3, 4], true, T`Tabelka mnożenia w $\mathbb Z_5$ — wiersz $3$.`), fields: [1, 2, 3, 4].map(k => ({ label: T`3\cdot${k}`, kind: 'mod', mod: 5, ans: String((3 * k) % 5) })), sol: rowSol(5, 3, [1, 2, 3, 4], true) },
          { label: '8.1c', gk: 'row', q: rowQ(7, 5, [1, 2, 3, 4, 5, 6], true, T`Tabelka mnożenia w $\mathbb Z_7$ — wiersz $5$.`), fields: [1, 2, 3, 4, 5, 6].map(k => ({ label: T`5\cdot${k}`, kind: 'mod', mod: 7, ans: String((5 * k) % 7) })), sol: rowSol(7, 5, [1, 2, 3, 4, 5, 6], true) },
          { label: '8.1d', gk: 'row', q: rowQ(11, 4, [3, 5, 7, 9, 10], true, T`Tabelka mnożenia w $\mathbb Z_{11}$ — wiersz $4$.`), fields: [3, 5, 7, 9, 10].map(k => ({ label: T`4\cdot${k}`, kind: 'mod', mod: 11, ans: String((4 * k) % 11) })), sol: rowSol(11, 4, [3, 5, 7, 9, 10], true) },
          { label: '8.1e', gk: 'row', q: rowQ(13, 6, [2, 5, 8, 11, 12], true, T`Tabelka mnożenia w $\mathbb Z_{13}$ — wiersz $6$.`), fields: [2, 5, 8, 11, 12].map(k => ({ label: T`6\cdot${k}`, kind: 'mod', mod: 13, ans: String((6 * k) % 13) })), sol: rowSol(13, 6, [2, 5, 8, 11, 12], true) },
          { label: '8.2', gk: 'ops', q: T`Oblicz $3+4$, $3\cdot4$, $3-4$, $3\cdot2^{-2}$ w ciele $\mathbb Z_5$.`, fields: [['3+4', 2], [T`3\cdot4`, 2], ['3-4', 4], [T`3\cdot2^{-2}`, 2]].map(([l, v]) => ({ label: l, kind: 'mod', mod: 5, ans: String(v) })), sol: [T`$2^2=4$, $4^{-1}=4$ (bo $16\equiv1$), więc $3\cdot2^{-2}=12\equiv2$.`] },
          { label: '8.3', gk: 'inv', q: T`Wyznacz $3^{-1}$ kolejno w ciałach $\mathbb Z_5,\mathbb Z_7,\mathbb Z_{11},\mathbb Z_{13}$.`, fields: [[5, 2], [7, 5], [11, 4], [13, 9]].map(([p, v]) => ({ label: T`\mathbb Z_{${p}}`, kind: 'mod', mod: p, ans: String(v) })), sol: [T`$3\cdot2=6\equiv1\ (5)$, $3\cdot5=15\equiv1\ (7)$, $3\cdot4=12\equiv1\ (11)$, $3\cdot9=27\equiv1\ (13)$.`] },
          { label: '8.4', gk: 'expr', q: T`Oblicz $4^{12}\cdot(5^2-6)\cdot(2\cdot(-3))^{-1}$ w ciele $\mathbb Z_{11}$.`, fields: [{ label: 'wynik', kind: 'mod', mod: 11, ans: '8' }], sol: [T`$4^{10}\equiv1$, więc $4^{12}\equiv16\equiv5$; $5^2-6=19\equiv8$; $2\cdot(-3)=-6\equiv5$, $5^{-1}=9$.`, T`$5\cdot8\cdot9=360\equiv8$.`] },
        ],
      },
      {
        id: '1.9', name: 'Układ równań w $\\mathbb{Z}_7$', statement: T`W ciele $\mathbb Z_7$ rozwiązać układ $\begin{cases}3x+y+2z=1\\x+2y+3z=1\\4x+3y+2z=1\end{cases}$`,
        wzory: [T`Eliminacja Gaussa działa w każdym ciele — dzielenie zastępujemy mnożeniem przez odwrotność modulo $p$.`, T`Odwrotności w $\mathbb Z_7$: $1^{-1}=1,\ 2^{-1}=4,\ 3^{-1}=5,\ 4^{-1}=2,\ 5^{-1}=3,\ 6^{-1}=6$.`, T`Po każdym kroku redukuj liczby modulo $p$.`],
        gen: gen19,
        items: [{ label: '1.9', q: T`W ciele $\mathbb Z_7$ rozwiąż układ $$\begin{cases}3x+y+2z=1\\x+2y+3z=1\\4x+3y+2z=1\end{cases}$$`, fields: [['x', 2], ['y', 6], ['z', 5]].map(([l, v]) => ({ label: l, kind: 'mod', mod: 7, ans: String(v) })), sol: [T`Zamieniamy $w_1\leftrightarrow w_2$, eliminujemy $x$: $w_2-3w_1$, $w_3-4w_1$ itd.`, T`Rozwiązanie: $x=2,\ y=6,\ z=5$. Sprawdzenie: $3\cdot2+6+10=22\equiv1$ ✓.`] }],
      },
      {
        id: '1.10', name: '$\\mathbb{R}\\times\\mathbb{R}$ jako ciało', statement: T`W $\mathbb R\times\mathbb R$: $(x_1,x_2)+(y_1,y_2)=(x_1+y_1,x_2+y_2)$, $(x_1,x_2)\cdot(y_1,y_2)=(x_1y_1-x_2y_2,\ x_1y_2+x_2y_1)$. Sprawdzić, że z elementami $(0,0)$ i $(1,0)$ jest to ciało.`,
        wzory: [T`Aksjomaty ciała: $(K,+)$ grupa abelowa z zerem $0$; $(K\setminus\{0\},\cdot)$ grupa abelowa z jedynką $1$; rozdzielność mnożenia względem dodawania.`, T`Odwrotność: $(x_1,x_2)^{-1}=\left(\frac{x_1}{x_1^2+x_2^2},\ \frac{-x_2}{x_1^2+x_2^2}\right)$.`, T`To jest konstrukcja liczb zespolonych: $(x_1,x_2)\leftrightarrow x_1+x_2i$, $(0,1)^2=(-1,0)$.`],
        gen: gen110,
        items: [
          { label: 'iloczyn', gk: 'mul', q: T`Oblicz $(2,3)\cdot(1,-1)$.`, fields: [{ label: 'pierwsza', ans: '5' }, { label: 'druga', ans: '1' }], sol: [T`$(2\cdot1-3\cdot(-1),\ 2\cdot(-1)+3\cdot1)=(5,1)$.`] },
          { label: '(0,1)²', gk: 'mul', q: T`Oblicz $(0,1)\cdot(0,1)$.`, fields: [{ label: 'pierwsza', ans: '-1' }, { label: 'druga', ans: '0' }], sol: [T`$(0-1,\ 0+0)=(-1,0)$ — „$i^2=-1$”.`] },
          { label: 'odwrotny', gk: 'inv', q: T`Wyznacz element odwrotny do $(3,4)$.`, fields: [{ label: 'pierwsza', ans: '3/25' }, { label: 'druga', ans: '-4/25' }], sol: [T`$x_1^2+x_2^2=25$, więc $(3,4)^{-1}=\left(\frac{3}{25},-\frac{4}{25}\right)$.`] },
          { label: 'wzór', gk: 'inv', q: T`Wzór na $(a,b)^{-1}$ dla $(a,b)\neq(0,0)$.`, fields: [{ label: 'pierwsza', ans: 'a/(a^2+b^2)', vars: ['a', 'b'] }, { label: 'druga', ans: '-b/(a^2+b^2)', vars: ['a', 'b'] }], keys: ['a', 'b'], sol: [T`Rozwiązujemy $ay_1-by_2=1$, $ay_2+by_1=0$: $y_1=\frac{a}{a^2+b^2}$, $y_2=\frac{-b}{a^2+b^2}$.`] },
          { label: 'dowód', type: 'order', gk: 'mul', q: 'Ułóż szkic dowodu, że $\\mathbb R\\times\\mathbb R$ z tymi działaniami jest ciałem.', order: { steps: [
            T`Dodawanie działa po współrzędnych, więc jest łączne i przemienne, $(0,0)$ jest zerem, a $(-x_1,-x_2)$ elementem przeciwnym.`,
            T`Mnożenie jest przemienne: wzór nie zmienia się po zamianie $(x_1,x_2)\leftrightarrow(y_1,y_2)$.`,
            T`Łączność mnożenia i rozdzielność sprawdzamy, wymnażając obie strony na współrzędnych.`,
            T`$(1,0)$ jest jedynką: $(x_1,x_2)\cdot(1,0)=(x_1,x_2)$.`,
            T`Dla $(x_1,x_2)\neq(0,0)$ mamy $x_1^2+x_2^2>0$ i $(x_1,x_2)\cdot\left(\frac{x_1}{x_1^2+x_2^2},\frac{-x_2}{x_1^2+x_2^2}\right)=(1,0)$.`,
            T`Wszystkie aksjomaty są spełnione — to ciało (ciało liczb zespolonych $\mathbb C$). $\blacksquare$`],
            extra: [T`$(1,1)\cdot(1,1)=(1,1)$, więc mnożenie jest idempotentne.`] } },
        ],
      },
    ],
  });
})();
