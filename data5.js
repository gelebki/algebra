/* Proseminarium — Lista 2: Jednomiany i wielomiany */
(function () {
  'use strict';
  const A = AQ, R = A.R, T = String.raw;
  const { Q, qadd, qsub, qmul, qt, qs, mk, fill, txtField, W, norm, big } = A.PRO;

  /* ---------- wielomiany: zapis ---------- */
  const rq = c => (Array.isArray(c) ? Q(c[0], c[1]) : Q(c));
  // terms: [[współczynnik, jednomian w TeX, jednomian dla parsera]]
  function poly(terms) {
    let tex = '', str = '';
    for (const [c0, mt, ms] of terms) {
      const c = rq(c0); if (c[0] === 0) continue;
      const neg = c[0] < 0, a = [Math.abs(c[0]), c[1]], one = a[0] === 1 && a[1] === 1;
      const ct = one && mt ? '' : qt(a), cs = a[1] === 1 ? String(a[0]) : '(' + a[0] + '/' + a[1] + ')';
      tex += (tex ? (neg ? '-' : '+') : (neg ? '-' : '')) + ct + (mt || '');
      str += (str ? (neg ? '-' : '+') : (neg ? '-' : '')) + (mt ? (one ? '' : cs + '*') + ms : cs);
    }
    return { tex: tex || '0', str: str || '0' };
  }
  const lin = (ca, cb, va = 'a', vb = 'b') => poly([[ca, va, va], [cb, vb, vb]]);
  // część pytania wieloczęściowego z własnymi błędnymi odpowiedziami
  function part(label, ans, tex, wrong) {
    const seen = new Set([norm(tex)]), mc = [];
    for (const [t, why] of wrong) { const k = norm(t); if (!t || seen.has(k) || mc.length >= 6) continue; seen.add(k); mc.push({ tex: t, why }); }
    fill(tex, mc, seen);
    return { label, ans: String(ans), restrict: ['plain'], mcCorrect: tex, mc };
  }
  const multi = (o) => ({ label: o.label, gk: o.gk, q: o.q, fields: o.parts, pairs: true, sol: o.steps, steps: o.steps });
  const fib = n => { let a = 0, b = 1; for (let k = 0; k < n; k++) [a, b] = [b, a + b]; return a; };

  const F = {
    brackets: W(T`Minus przed nawiasem zmienia znaki wszystkich wyrazów w nawiasie: $-(a-b+c)=-a+b-c$.`, T`$-(\ldots)$ to mnożenie przez $-1$, a mnożymy każdy wyraz.`, T`Nawiasy opuszczamy od środka: najpierw $(\,)$, potem $[\,]$, na końcu $\{\,\}$.`),
    like: W(T`Wyrazy podobne mają te same litery w tych samych potęgach — dodajemy tylko współczynniki: $3x^2y-5x^2y=-2x^2y$.`, T`$x^2y$ i $xy^2$ <i>nie</i> są podobne: inne potęgi.`),
    distr: W(T`Rozdzielność: $k(a+b)=ka+kb$ — mnożymy każdy wyraz w nawiasie.`, T`Najczęstszy błąd: pomnożyć tylko pierwszy wyraz nawiasu.`),
    pows: W(T`$x^{n-1}=x\cdot x^{n-2}$; podstawiamy liczby dopiero po uproszczeniu.`, T`Dla $n=3$: $x^{n-1}=x^2$, $x^{n-2}=x$.`),
    identity: W(T`Dwa wielomiany są równe dla wszystkich $x,y$ $\iff$ mają równe współczynniki przy tych samych jednomianach.`, T`Przenieś wszystko na jedną stronę: wielomian zerowy ma wszystkie współczynniki równe $0$.`),
    sqzero: W(T`Suma kwadratów (z dodatnimi współczynnikami) jest zerem tylko wtedy, gdy każdy kwadrat jest zerem.`, T`Kwadraty są $\geq0$, więc jeśli choć jeden jest dodatni, suma też jest dodatnia.`),
    monomial: W(T`Jednomian: iloczyn liczby i zmiennych w potęgach o wykładnikach naturalnych, np. $-\frac35x^2y$.`, T`$\frac x5=\frac15x$ jest jednomianem, ale $\frac3{x^2}=3x^{-2}$ i $1+\frac1x$ — nie (ujemny wykładnik, suma).`),
    degree: W(T`$\deg(P\cdot Q)=\deg P+\deg Q$; $\ \deg(P+Q)\leq\max(\deg P,\deg Q)$.`, T`Przy dodawaniu najwyższe wyrazy mogą się zredukować: $(x^4+x)+(-x^4+1)=x+1$.`, T`Przy mnożeniu najwyższe wyrazy się mnożą i nie mogą zniknąć (iloczyn niezerowych liczb $\neq0$).`),
    expand: W(T`Wymnażanie: każdy wyraz pierwszego nawiasu przez każdy wyraz drugiego.`, T`Dla $(x-r_1)(x-r_2)(x-r_3)(x-r_4)$: współczynnik przy $x^3$ to $-(r_1+\ldots+r_4)$, a wyraz wolny to $r_1r_2r_3r_4$ (wzory Viète'a).`),
    dsq: W(T`$(A+B)(A-B)=A^2-B^2$ — także gdy $A,B$ to całe wyrażenia.`, T`$(5xy-B)(5xy+B)=(5xy)^2-B^2$, gdzie $B=3x^2-\frac12y^2$.`),
    sqsum: W(T`$(a\pm b)^2=a^2\pm2ab+b^2$.`, T`$(a+b)^2=a^2+ab+ba+b^2$.`),
    reduce: W(T`Gdy $x$ spełnia równanie, wyższe potęgi zastępujemy niższymi, np. z $x^2=x+1$: $x^3=x\cdot x^2=x^2+x=2x+1$.`, T`Tak samo $\frac1x$: z $x^2-x=1$ mamy $x(x-1)=1$, czyli $\frac1x=x-1$.`),
    usegiven: W(T`Wyrażenie przekształcamy tak, żeby pojawiła się dana kombinacja, np. $6x^3-x^2-3x=2x(3x^2+x)-3x^2-3x$.`, T`To jest dzielenie wielomianu przez dany trójmian z resztą.`),
    perfsq: W(T`Liczba $A^2+2AB+B^2$ jest kwadratem $(A+B)^2$.`, T`$2^8=(2^4)^2$, więc szukamy, który składnik może być „$2AB$”.`),
    ratio: W(T`Jeśli $\frac ab=\frac cd=\frac ef=x$, to $a=xb$, $c=xd$, $e=xf$; dodając: $a+c+e=x(b+d+f)$.`, T`Gdy $b+d+f\neq0$, $x=\frac{a+c+e}{b+d+f}$. Przypadek $b+d+f=0$ trzeba rozpatrzyć osobno!`),
    oddf: W(T`Jednomiany o nieparzystych wykładnikach zmieniają znak: $(-x)^7=-x^7$.`, T`Dla $P(x)=ax^7+bx^3+cx-5$: $P(-x)+P(x)=-10$.`),
    unity5: W(T`$a^5-1=(a-1)(a^4+a^3+a^2+a+1)$.`, T`Jeśli $a^4+a^3+a^2+a+1=0$, to $a^5=1$, więc potęgi $a$ powtarzają się co $5$.`),
    coefsum: W(T`Suma współczynników wielomianu $=P(1)$. Suma współczynników przy parzystych potęgach $=\frac{P(1)+P(-1)}2$.`, T`W $P(-1)$ wyrazy parzyste mają znak $+$, nieparzyste $-$; dodanie $P(1)$ znosi nieparzyste i podwaja parzyste.`),
    fracsum: W(T`$\frac1a+\frac1b+\frac1c=\frac{ab+bc+ca}{abc}$; $\ (a+b)(b+c)(c+a)=(a+b+c)(ab+bc+ca)-abc$.`, T`Wymnóż: $(a+b)(b+c)=ab+ac+b^2+bc$, potem przez $(c+a)$ i porównaj.`),
    squares: W(T`Prostokąt z kwadratów: oznacz bok jednego kwadratu literą, a resztę boków wyrażaj przez nią, idąc wzdłuż wspólnych krawędzi.`, T`Na końcu dwie drogi wzdłuż tego samego boku prostokąta muszą dać tę samą długość — to równanie.`),
    sys3: W(T`Z $xy=a$, $xz=b$, $yz=c$: $x^2=\frac{(xy)(xz)}{yz}=\frac{ab}c$ i analogicznie.`, T`Mnożymy dwa równania zawierające $x$ i dzielimy przez trzecie.`),
  };

  /* ---------- 2.1 ---------- */
  function e21(c) { // c1 a + { c2 b - [ c3 a + c4 b - ( c5 a + c6 b ) ] + c7 a }
    const [c1, c2, c3, c4, c5, c6, c7] = c;
    const ra = c1 - c3 + c5 + c7, rb = c2 - c4 + c6, r = lin(ra, rb);
    const L = (x, y) => lin(x, y).tex;
    const q = T`Uprość wyrażenie $$${L(c1, 0)}+\left\{${L(0, c2)}-\left[${L(c3, c4)}-(${L(c5, c6)})\right]${c7 < 0 ? '' : '+'}${L(c7, 0)}\right\}$$`;
    const inner = lin(c3 - c5, c4 - c6);
    const steps = [T`Najpierw nawias okrągły: $${L(c3, c4)}-(${L(c5, c6)})=${inner.tex}$ (minus zmienia oba znaki).`, T`Nawias kwadratowy z minusem: $${L(0, c2)}-(${inner.tex})${c7 < 0 ? '' : '+'}${L(c7, 0)}=${lin(c7 - c3 + c5, c2 - c4 + c6).tex}$.`, T`Dodajemy $${L(c1, 0)}$: $${r.tex}$.`];
    return mk({ q, vars: ['a', 'b'], ans: r.str, tex: r.tex, steps, wrong: [
      [lin(c1 - c3 - c5 + c7, c2 - c4 - c6).tex, T`Przy $-(${L(c5, c6)})$ trzeba zmienić znaki obu wyrazów.`],
      [lin(c1 - c3 + c5 + c7, c2 + c4 + c6).tex, T`Minus przed $[\ldots]$ zmienia znak każdego wyrazu, także $${L(0, c4)}$.`],
      [lin(c1 + c3 - c5 + c7, c2 + c4 - c6).tex, T`Minus przed $[\ldots]$ zmienia znaki — a wyrazy z nawiasu okrągłego po opuszczeniu go mają już nowe znaki.`],
      [lin(-ra, -rb).tex, 'Odwrócone znaki całego wyniku.']] });
  }
  const gen21 = () => { for (;;) { const c = Array.from({ length: 7 }, () => R.nz(-7, 7)); const ra = c[0] - c[2] + c[4] + c[6], rb = c[1] - c[3] + c[5]; if (ra || rb) return e21(c); } };

  /* ---------- 2.2 ---------- */
  function e22(k, p, q0, r, s, t, u) {
    const cx = k * (1 - r) * p + u, c0 = -k * (1 - r) * q0 - k * s - t, res = poly([[cx, 'x', 'x'], [c0, '', '']]);
    const P = poly([[p, 'x', 'x'], [-q0, '', '']]).tex;
    const q = T`Uprość wyrażenie $$${k}\left\{(${P})-\left[${r}(${P})+${s}\right]\right\}-(${t}-${u}x)$$`;
    const inn = poly([[(1 - r) * p, 'x', 'x'], [-(1 - r) * q0 - s, '', '']]).tex;
    const steps = [T`W klamrze: $(${P})-${r}(${P})-${s}=${1 - r}(${P})-${s}=${inn}$.`, T`Mnożymy przez $${k}$: $${poly([[k * (1 - r) * p, 'x', 'x'], [k * (-(1 - r) * q0 - s), '', '']]).tex}$.`, T`Odejmujemy $(${t}-${u}x)$, czyli dodajemy $-${t}+${u}x$: wynik $${res.tex}$.`];
    return mk({ q, vars: ['x'], ans: res.str, tex: res.tex, steps, wrong: [
      [poly([[cx, 'x', 'x'], [c0 + k * s - s, '', '']]).tex, T`Liczbę $${s}$ z nawiasu kwadratowego też mnożymy przez $${k}$.`],
      [poly([[cx - 2 * u, 'x', 'x'], [c0, '', '']]).tex, T`$-(${t}-${u}x)=-${t}+${u}x$ — minus zmienia oba znaki.`],
      [poly([[k * (1 + r) * p + u, 'x', 'x'], [-k * (1 + r) * q0 - k * s - t, '', '']]).tex, T`Przed $[\ldots]$ jest minus: $(${P})-${r}(${P})$, a nie $+$.`],
      [poly([[-cx, 'x', 'x'], [-c0, '', '']]).tex, 'Odwrócone znaki.']] });
  }
  const gen22 = () => e22(R.int(2, 5), R.int(2, 5), R.int(1, 4), R.int(2, 4), R.int(1, 5), R.int(1, 6), R.int(1, 7));

  /* ---------- 2.3 ---------- */
  function e23(a, b, c, d, x, n, gk) {
    const A1 = c * d - b, A2 = -c; // A1 x^{n-1} + A2 x^{n-2}
    const exprT = T`-${a}x^{n-2}-${b}x^{n-1}-(-${a}x^{n-2})-${c}(x^{n-2}-${d}x^{n-1})`;
    const simp = poly([[A1, 'x^{n-1}', 'x^(n-1)'], [A2, 'x^{n-2}', 'x^(n-2)']]).tex;
    const base = [T`$-${a}x^{n-2}$ i $-(-${a}x^{n-2})$ znoszą się.`, T`$-${c}(x^{n-2}-${d}x^{n-1})=-${c}x^{n-2}+${c * d}x^{n-1}$.`, T`Razem: $(${c * d}-${b})x^{n-1}-${c}x^{n-2}=${simp}$.`];
    if (gk === 'simp') return mk({ gk, field: txtField(), q: T`Uprość $$${exprT}$$`, tex: simp, steps: base, wrong: [
      [poly([[c * d - b, 'x^{n-1}', ''], [-2 * a - c, 'x^{n-2}', '']]).tex, T`$-(-${a}x^{n-2})=+${a}x^{n-2}$, więc znosi się z $-${a}x^{n-2}$.`],
      [poly([[c * d + b, 'x^{n-1}', ''], [-c, 'x^{n-2}', '']]).tex, T`$-${b}x^{n-1}$ ma minus.`],
      [poly([[-c * d - b, 'x^{n-1}', ''], [-c, 'x^{n-2}', '']]).tex, T`$-${c}\cdot(-${d}x^{n-1})=+${c * d}x^{n-1}$.`]] });
    const v = A1 * x ** (n - 1) + A2 * x ** (n - 2);
    return mk({ gk: 'val', q: T`Oblicz wartość wyrażenia $$${exprT}$$ dla $x=${x}$ oraz $n=${n}$.`, ans: String(v), tex: big(v),
      steps: [...base, T`Dla $n=${n}$, $x=${x}$: $${A1}\cdot ${x}^{${n - 1}}${A2 < 0 ? '-' : '+'}${Math.abs(A2)}\cdot ${x}^{${n - 2}}=${big(A1 * x ** (n - 1))}${A2 < 0 ? '-' : '+'}${big(Math.abs(A2) * x ** (n - 2))}=${big(v)}$.`], wrong: [
        [big((c * d + b) * x ** (n - 1) - c * x ** (n - 2)), T`Zły znak przy $${b}x^{n-1}$.`], [big(A1 * x ** (n - 1) + c * x ** (n - 2)), T`$-${c}x^{n-2}$ ma minus.`], [big(A1 * x ** (n - 2) + A2 * x ** (n - 1)), T`Pomylone wykładniki: $x^{n-1}=x^{${n - 1}}$, $x^{n-2}=x^{${n - 2}}$.`], [big(v - 2 * a * x ** (n - 2)), T`$-(-${a}x^{n-2})$ znosi się z $-${a}x^{n-2}$.`]] });
  }
  const gen23 = gk => e23(R.int(2, 9), R.int(2, 9), R.int(2, 9), R.int(2, 3), R.int(2, 9), R.int(3, 4), gk === 'simp' ? 'simp' : 'val');

  /* ---------- 2.4 ---------- */
  function e24(p, q, r) {
    const steps = [T`Przenosimy wszystko na lewą stronę: $${p}x^2y+(a+${r})xy^2+(${q}+d)xy-bx^cy=0$.`, T`$x^2y$ musi się zredukować z $bx^cy$: więc $c=2$ i $b=${p}$.`, T`Przy $xy^2$: $a+${r}=0\Rightarrow a=${-r}$. Przy $xy$: $${q}+d=0\Rightarrow d=${-q}$.`];
    return multi({ gk: 'id', q: T`Dla wszystkich $x,y$ zachodzi $$\begin{wrap}&x^3+${p}x^2y+axy^2+${q}xy-bx^cy\\&+${r}xy^2+dxy+y^2=x^3+y^2.\end{wrap}$$ Wyznacz $a,b,c,d$.`, steps, parts: [
      part('a', -r, String(-r), [[String(r), T`$a+${r}=0$, więc $a=-${r}$.`], [String(-r + 1), 'Pomyłka o 1.'], ['0', T`Wyraz $${r}xy^2$ też trzeba zredukować.`]]),
      part('b', p, String(p), [[String(-p), T`Przed $bx^cy$ jest minus: $${p}x^2y-bx^2y=0\Rightarrow b=${p}$.`], ['0', T`Wyrazu $${p}x^2y$ nie ma po prawej, więc musi się zredukować.`], [String(p + 1), 'Pomyłka o 1.']]),
      part('c', 2, '2', [['1', T`Redukujemy $x^2y$, więc potęga $x$ musi być $2$.`], ['3', T`$x^3$ jest po obu stronach — nie trzeba go redukować.`], ['0', T`Dla $c=0$ powstałby wyraz $by$, którego nie ma w równości.`]]),
      part('d', -q, String(-q), [[String(q), T`$${q}+d=0$, więc $d=-${q}$.`], ['0', T`$${q}xy$ trzeba zredukować.`], [String(-q - 1), 'Pomyłka o 1.']])] });
  }
  const gen24 = () => e24(R.int(2, 9), R.int(2, 9), R.int(2, 9));

  /* ---------- 2.5 ---------- */
  function e25(x0, yv, s, k) { // (2/3)(x-x0)^2 + k m^2 = 0;  a^2 b^{y+s} ~ a^2 b^{yv+s}
    const val = x0 * x0 * yv + 10 * x0 * yv * yv;
    const steps = [T`Suma nieujemnych składników $\frac23(x-${x0})^2+${k}m^2$ jest zerem tylko gdy oba są zerami: $x=${x0}$, $m=0$.`, T`Wyrazy podobne mają te same potęgi: $b^{y+${s}}$ i $b^{${yv + s}}$, więc $y=${yv}$.`, T`Upraszczamy klamrę: $-\frac7{16}x^2y-\frac14xy^2-\frac3{16}x^2y-3{,}475xy^2-6{,}275xy^2=-\frac58x^2y-10xy^2$.`, T`Wyrażenie: $\frac38x^2y+${k}m^2+\frac58x^2y+10xy^2=x^2y+10xy^2+${k}m^2$.`, T`Podstawiamy: $${x0}^2\cdot ${yv}+10\cdot ${x0}\cdot ${yv}^2+0=${val}$.`];
    const q = T`Liczby $m,x,y$ spełniają: $\frac23(x-${x0})^2+${k}m^2=0$ oraz $-2a^2b^{y+${s}}$ i $3a^2b^{${yv + s}}$ są wyrazami podobnymi. Oblicz $$\begin{wrap}&\tfrac38x^2y+${k}m^2-\Big\{-\tfrac7{16}x^2y\\&+\left[-\tfrac14xy^2-\tfrac3{16}x^2y-3{,}475xy^2\right]-6{,}275xy^2\Big\}\end{wrap}$$`;
    return multi({ gk: 'val', q, steps, parts: [
      part('x', x0, String(x0), [[String(-x0), T`$(x-${x0})^2=0\iff x=${x0}$.`], ['0', T`To $m$ jest zerem; $x$ zeruje nawias $(x-${x0})$.`], [String(x0 * x0), 'Nie podnosimy do kwadratu — rozwiązujemy $x-' + x0 + '=0$.']]),
      part('m', 0, '0', [[String(k), T`$${k}m^2=0$ tylko dla $m=0$.`], ['1', T`Dla $m=1$ suma byłaby dodatnia.`], [String(x0), 'Pomylone $m$ z $x$.']]),
      part('y', yv, String(yv), [[String(yv + s), T`$y+${s}=${yv + s}$, więc $y=${yv}$.`], [String(yv - 1), 'Pomyłka o 1.'], ['2', 'Wykładniki przy $a$ są równe ($2$), ale porównujemy wykładniki przy $b$.']]),
      part('wartość', val, String(val), [[String(x0 * x0 * yv), T`Zgubiony wyraz $10xy^2$ — z klamry wychodzi $+10xy^2$.`], [String(x0 * x0 * yv - 10 * x0 * yv * yv), T`Minus przed klamrą zmienia $-10xy^2$ na $+10xy^2$.`], [String(10 * x0 * x0 * yv + x0 * yv * yv), T`Pomylone $x^2y$ i $xy^2$.`]])] });
  }
  const gen25 = () => e25(R.int(2, 6), R.int(1, 4), R.int(1, 3), R.int(2, 7));

  /* ---------- 2.7 ---------- */
  function e27(rs) {
    const e1 = rs.reduce((a, b) => a + b, 0); let e2 = 0, e3 = 0;
    for (let i = 0; i < 4; i++) for (let j = i + 1; j < 4; j++) { e2 += rs[i] * rs[j]; for (let k = j + 1; k < 4; k++) e3 += rs[i] * rs[j] * rs[k]; }
    const e4 = rs.reduce((a, b) => a * b, 1);
    const P = (c1, c2, c3, c4) => poly([[1, 'x^4', 'x^4'], [c1, 'x^3', 'x^3'], [c2, 'x^2', 'x^2'], [c3, 'x', 'x'], [c4, '', '']]);
    const res = P(-e1, e2, -e3, e4);
    const fac = rs.map(r => (r > 0 ? T`(x-${r})` : T`(x+${-r})`)).join('');
    const p12 = poly([[1, 'x^2', ''], [-(rs[0] + rs[1]), 'x', ''], [rs[0] * rs[1], '', '']]).tex, p34 = poly([[1, 'x^2', ''], [-(rs[2] + rs[3]), 'x', ''], [rs[2] * rs[3], '', '']]).tex;
    return mk({ q: T`Rozwiń do postaci wielomianu: $$${fac}$$`, vars: ['x'], ans: res.str, tex: res.tex,
      steps: [T`Mnożymy parami: $${fac.slice(0, fac.indexOf(')') + 1)}${fac.slice(fac.indexOf(')') + 1, fac.indexOf(')', fac.indexOf(')') + 1) + 1)}=${p12}$ oraz drugą parę: $${p34}$.`, T`Teraz $(${p12})(${p34})$ — każdy wyraz z każdym, potem redukcja wyrazów podobnych.`, T`Kontrola (wzory Viète'a): przy $x^3$ stoi $-(${rs.join('+').replace(/\+-/g, '-')})=${-e1}$, wyraz wolny to iloczyn $${e4}$.`, T`Wynik: $${res.tex}$.`],
      wrong: [[P(e1, e2, e3, e4).tex, T`Znaki: $(x-r)$ daje ujemne współczynniki przy nieparzystych potęgach (dla dodatnich $r$).`], [P(-e1, e2, -e3, -e4).tex, T`Wyraz wolny to iloczyn $(-r_1)(-r_2)(-r_3)(-r_4)=r_1r_2r_3r_4$ — parzysta liczba minusów.`], [P(-e1, e2 - rs[0] * rs[3], -e3, e4).tex, 'Przy $x^2$ brakuje jednego iloczynu par — par jest sześć.'], [P(-e1, -e2, -e3, e4).tex, T`Współczynnik przy $x^2$ to suma iloczynów par, ze znakiem $+$.`]] });
  }
  const gen27 = () => { let rs; do { rs = Array.from({ length: 4 }, () => R.nz(-5, 5)); } while (new Set(rs).size < 3); return e27(rs.sort((a, b) => b - a)); };

  /* ---------- 2.8 ---------- */
  function e28(a, b, c) { // (a xy - b x^2 + c/2 y^2)(a xy + b x^2 - c/2 y^2)
    const res = poly([[-b * b, 'x^4', 'x^4'], [a * a + b * c, 'x^2y^2', 'x^2*y^2'], [[-c * c, 4], 'y^4', 'y^4']]);
    const half = qt(Q(c, 2)), half2 = qt(Q(c * c, 4));
    const B = T`${b === 1 ? '' : b}x^2-${half}y^2`;
    return mk({ q: T`Rozwiń do postaci wielomianu: $$\left(${a}xy-${b === 1 ? '' : b}x^2+${half}y^2\right)\left(${a}xy+${b === 1 ? '' : b}x^2-${half}y^2\right)$$`, vars: ['x', 'y'], ans: res.str, tex: res.tex,
      steps: [T`To $(A-B)(A+B)$ z $A=${a}xy$ i $B=${B}$.`, T`$A^2=${a * a}x^2y^2$, $\ B^2=${b * b}x^4-${b * c}x^2y^2+${half2}y^4$ (wzór $(p-q)^2$).`, T`$A^2-B^2=${a * a}x^2y^2-${b * b}x^4+${b * c}x^2y^2-${half2}y^4=${res.tex}$.`],
      wrong: [[poly([[-b * b, 'x^4', ''], [a * a, 'x^2y^2', ''], [[-c * c, 4], 'y^4', '']]).tex, T`Zgubiony wyraz $2pq$ z $B^2=(${B})^2$.`], [poly([[-b * b, 'x^4', ''], [a * a - b * c, 'x^2y^2', ''], [[-c * c, 4], 'y^4', '']]).tex, T`$-B^2$: wyraz $-${b * c}x^2y^2$ z $B^2$ zmienia znak na $+$.`], [poly([[b * b, 'x^4', ''], [a * a + b * c, 'x^2y^2', ''], [[c * c, 4], 'y^4', '']]).tex, 'To $A^2+B^2$ — a ma być $A^2-B^2$.'], [poly([[-b * b, 'x^4', ''], [a * a + b * c, 'x^2y^2', ''], [[-c * c, 2], 'y^4', '']]).tex, T`$\left(${half}y^2\right)^2=${half2}y^4$.`]] });
  }
  const gen28 = () => e28(R.int(2, 7), R.int(1, 4), R.pick([1, 3, 5]));

  /* ---------- 2.9 ---------- */
  const e29 = () => mk({ gk: 'orig', vars: ['x'], q: T`Wiedząc, że $x^2-x-1=0$, sprowadź wyrażenie $\frac{x^3+x+1}{x^5}$ do postaci wielomianu.`, ans: 'x-1', tex: 'x-1',
    steps: [T`Z równania: $x^2=x+1$. Wtedy $x^3=x\cdot x^2=x^2+x=2x+1$ i $x^4=x\cdot x^3=2x^2+x=3x+2$.`, T`Licznik: $x^3+x+1=2x+1+x+1=3x+2=x^4$.`, T`$\frac{x^4}{x^5}=\frac1x$. Z $x^2-x=1$ mamy $x(x-1)=1$, czyli $\frac1x=x-1$.`],
    wrong: [['x+1', T`$\frac1x=x-1$, bo $x(x-1)=x^2-x=1$.`], ['3x+2', 'To licznik — trzeba jeszcze podzielić przez $x^5$.'], [T`\frac{3x+2}{5x+3}`, T`To jeszcze nie wielomian: zauważ, że licznik to $x^4$.`]] });
  function e29p(n) {
    const a = fib(n), b = fib(n - 1), res = poly([[a, 'x', 'x'], [b, '', '']]);
    return mk({ gk: 'pow', vars: ['x'], q: T`Wiedząc, że $x^2-x-1=0$, zapisz $x^{${n}}$ w postaci $ax+b$.`, ans: res.str, tex: res.tex,
      steps: [T`$x^2=x+1$, więc każdą potęgę obniżamy: $x^{k+1}=x\cdot x^k$.`, T`${Array.from({ length: n - 1 }, (_, k) => T`$x^{${k + 2}}=${poly([[fib(k + 2), 'x', ''], [fib(k + 1), '', '']]).tex}$`).join(', ')}.`, T`Współczynniki to kolejne liczby Fibonacciego: $x^{${n}}=${res.tex}$.`],
      wrong: [[poly([[fib(n + 1), 'x', ''], [fib(n), '', '']]).tex, T`Przesunięcie o jeden — to $x^{${n + 1}}$.`], [poly([[b, 'x', ''], [a, '', '']]).tex, 'Zamienione współczynniki.'], [poly([[a, 'x', ''], [-b, '', '']]).tex, T`$x^2=x+1$ — z plusem.`]] });
  }
  const gen29 = gk => (gk === 'orig' ? e29() : e29p(R.int(3, 11)));

  /* ---------- 2.10 ---------- */
  const MONO = [[T`\frac x5`, 1], [T`-0{,}5\left(1+\frac1x\right)`, 0], [T`\frac3{x^2}`, 0], [T`7x^3y`, 1], [T`\sqrt2\,x^2`, 1], [T`\sqrt x`, 0], [T`x^{-1}`, 0], [T`2^x`, 0], [T`-\frac34`, 1], [T`x+y`, 0], [T`0{,}2x^2y^5`, 1], [T`(2x)^3`, 1], [T`\frac{x^2}{y}`, 0], [T`\pi x`, 1]];
  function e210(sel) {
    const opts = sel.map(i => '$\\displaystyle ' + MONO[i][0] + '$'), correct = sel.map((i, k) => (MONO[i][1] ? -1 : k)).filter(k => k >= 0);
    return { gk: 'mono', type: 'choice', q: 'Które z poniższych wyrażeń <b>nie są</b> jednomianami?', choice: { multi: true, opts, correct },
      sol: [T`Jednomian to liczba razy zmienne w potęgach naturalnych (współczynnik może być dowolną liczbą rzeczywistą).`, ...sel.map(i => T`$${MONO[i][0]}$: ${MONO[i][1] ? 'jednomian' : '<b>nie</b> jest jednomianem'}${{ 1: ' ($\\frac15x$)', 2: ' (suma — po wymnożeniu $-0{,}5-\\frac{0{,}5}{x}$, zmienna w mianowniku)', 3: ' ($3x^{-2}$ — wykładnik ujemny)', 5: ' (wykładnik $\\frac12$)', 6: ' (wykładnik ujemny)', 7: ' (zmienna w wykładniku)', 8: ' (stała to też jednomian)', 9: ' (suma dwóch jednomianów)', 11: ' ($8x^3$)', 12: ' ($y$ w mianowniku)' }[i] || ''}.`)] };
  }
  const gen210 = () => { for (;;) { const sel = R.shuffle(MONO.map((_, i) => i)).slice(0, 4); const k = sel.filter(i => MONO[i][1]).length; if (k >= 1 && k <= 3) { const it = e210(sel); it.steps = it.sol; return it; } } };

  /* ---------- 2.11, 2.14 — stopnie ---------- */
  function e211(m, n, op) {
    const same = m === n;
    if (op === '·') return mk({ gk: 'deg', field: txtField(), q: T`Jaki może być stopień iloczynu wielomianu stopnia $${m}$ i wielomianu stopnia $${n}$?`, tex: T`\text{dokładnie }${m + n}`,
      steps: [T`Najwyższe wyrazy $ax^{${m}}$ i $bx^{${n}}$ mnożą się do $abx^{${m + n}}$, a $ab\neq0$.`, T`Więc stopień iloczynu to zawsze $${m}+${n}=${m + n}$.`],
      wrong: [[T`\text{nie większy niż }${m + n}`, 'Przy mnożeniu najwyższy wyraz nie może się zredukować — iloczyn niezerowych liczb jest niezerowy.'], [T`\text{dokładnie }${m * n}`, T`Wykładniki się dodają: $x^{${m}}\cdot x^{${n}}=x^{${m + n}}$.`], [T`\text{dokładnie }${Math.max(m, n)}`, 'To dotyczy sumy (różnych stopni), nie iloczynu.'], [T`\text{mniej niż }${m + n}`, 'Najwyższe wyrazy się mnożą i nie mogą zniknąć.']] });
    return mk({ gk: 'deg', field: txtField(), q: T`Jaki może być stopień sumy dwóch wielomianów stopni $${m}$ i $${n}$?`, tex: same ? T`\text{nie większy niż }${m}` : T`\text{dokładnie }${Math.max(m, n)}`,
      steps: same ? [T`Najwyższe wyrazy $ax^{${m}}$ i $bx^{${m}}$ dają $(a+b)x^{${m}}$.`, T`Gdy $a+b\neq0$ — stopień $${m}$; gdy $a=-b$ — wyraz znika i stopień jest mniejszy (np. $(x^{${m}}+x)+(-x^{${m}}+1)=x+1$).`, T`Ogólnie: stopień $\leq ${m}$ — „nie większy niż $${m}$”.`]
        : [T`Wyraz $x^{${Math.max(m, n)}}$ występuje tylko w jednym wielomianie, więc nic go nie zredukuje.`, T`Stopień sumy to dokładnie $${Math.max(m, n)}$.`],
      wrong: same ? [[T`${2 * m}`, 'Stopnie się nie dodają przy dodawaniu — to dzieje się przy mnożeniu.'], [T`\text{dokładnie }${m}`, T`Najwyższe wyrazy mogą się znieść, np. $x^{${m}}+(-x^{${m}})$.`], [T`\text{mniej niż }${m}`, T`Nie zawsze: $x^{${m}}+x^{${m}}=2x^{${m}}$ ma stopień $${m}$.`]]
        : [[T`\text{nie większy niż }${Math.max(m, n)}`, 'Przy różnych stopniach najwyższy wyraz nie może się zredukować.'], [T`${m + n}`, 'Stopnie dodają się przy mnożeniu, nie przy dodawaniu.'], [T`\text{dokładnie }${Math.min(m, n)}`, 'O stopniu decyduje wyższy z wielomianów.']] });
  }
  const gen211 = () => { const m = R.int(2, 7); const r = Math.random(); return r < 0.5 ? e211(m, m, '+') : r < 0.75 ? e211(m, R.int(2, 7), '+') : e211(m, R.int(2, 7), '·'); };
  function e214(k, p, qd) {
    const deg = k + p, low = k - 1 - qd;
    const third = [1, ...Array.from({ length: qd }, (_, j) => T`\frac{${j + 2}}{x${j ? '^' + (j + 1) : ''}}`)].join('+');
    return mk({ gk: 'deg', field: txtField(), q: T`Wyrażenia $x^{${k}}$, $x${p > 1 ? '^' + p : ''}+\frac1x$ oraz $${third}$ pomnożono przez siebie. Jaki jest stopień otrzymanego wielomianu?`, tex: String(deg),
      steps: [T`Najwyższa potęga: $x^{${k}}\cdot x^{${p}}\cdot1=x^{${deg}}$.`, T`Najniższa: $x^{${k}}\cdot\frac1x\cdot\frac{${qd + 1}}{x^{${qd}}}=${qd + 1}x^{${low}}$ — wykładnik $\geq0$, więc to naprawdę wielomian.`, T`Stopień: $${deg}$.`],
      wrong: [[String(k + p + qd), T`Wyraz z $\frac1{x^{${qd}}}$ obniża potęgę, a nie podwyższa.`], [String(k + p + 1), T`Z trzeciego nawiasu najwyższy wyraz to $1=x^0$.`], [String(k), 'Pozostałe nawiasy też zmieniają stopień.'], [String(deg - 1), T`$x^{${k}}\cdot x^{${p}}=x^{${deg}}$.`]] });
  }
  const gen214 = () => { const qd = R.int(1, 3), p = R.int(1, 3); return e214(R.int(qd + 1, qd + 5), p, qd); };

  /* ---------- 2.12 ---------- */
  function e212(B, Rr) { // B = dodawany wielomian, Rr = otrzymany (zły) wynik A-B
    const P = c => poly([[c[0], 'x^2', 'x^2'], [c[1], 'x', 'x'], [c[2], '', '']]);
    const good = Rr.map((r, i) => r + 2 * B[i]);
    return mk({ vars: ['x'], q: T`Podczas dodawania dwóch wielomianów Adam pomylił się i zamiast dodać wielomian $${P(B).tex}$, odjął go, otrzymując $${P(Rr).tex}$. Wyznacz poprawny wynik.`, ans: P(good).str, tex: P(good).tex,
      steps: [T`Adam policzył $A-B=${P(Rr).tex}$, gdzie $B=${P(B).tex}$.`, T`Pierwszy składnik: $A=(A-B)+B$; a poprawny wynik to $A+B=(A-B)+2B$.`, T`$${P(Rr).tex}+2(${P(B).tex})=${P(good).tex}$.`],
      wrong: [[P(Rr.map((r, i) => r + B[i])).tex, 'To tylko $A$ — trzeba jeszcze dodać $B$.'], [P(Rr.map((r, i) => r - 2 * B[i])).tex, 'Trzeba dodać $2B$, nie odjąć.'], [P(Rr.map((r, i) => -r + 2 * B[i])).tex, 'Zły znak przy wyniku Adama.'], [P(Rr.map((r, i) => r + 3 * B[i])).tex, T`Trzeba dodać $2B$, a nie $3B$: $A=(A-B)+B$, potem jeszcze $+B$.`], [P(Rr.map((r, i) => 2 * r + 2 * B[i])).tex, T`Wynik Adama liczymy raz: $(A-B)+2B$.`]] });
  }
  const gen212 = () => e212([R.int(1, 5), R.nz(-4, 4), R.nz(-5, 5)], [R.int(1, 7), R.nz(-6, 6), R.nz(-6, 6)]);

  /* ---------- 2.13 ---------- */
  function e213(u, w, p, q, r) { // p x^b y^c, q x^{m-u} y^{2n-w}; suma = r a x^n y^m
    const wf = w < 0 ? "+" + (-w) : "-" + w;
    const m = 2 * u + w, n = m - u, a = Q(Math.round((p + q) * 100), Math.round(r * 100)), abc = qmul(a, Q(n * m));
    const dec = x => String(x).replace('.', '{,}');
    const steps = [T`Wyrazy podobne: $b=m-${u}$, $c=2n${wf}$. Ich suma $${dec(p + q)}x^by^c$ ma być równa $${dec(r)}ax^ny^m$.`, T`Porównujemy potęgi: $b=n$ i $c=m$. Wtedy $n=m-${u}$ i $m=2n${wf}=2m-${2 * u + w}$, więc $m=${m}$, $n=${n}$.`, T`Stąd $b=${n}$, $c=${m}$, a współczynniki: $${dec(p + q)}=${dec(r)}a$, czyli $a=${qt(a)}$.`, T`$abc=${qt(a)}\cdot ${n}\cdot ${m}=${qt(abc)}$.`];
    return multi({ gk: 'abc', q: T`Jednomiany $${dec(p)}x^by^c$ oraz $${dec(q)}x^{m-${u}}y^{2n${wf}}$ są wyrazami podobnymi, a ich suma wynosi $${dec(r)}ax^ny^m$. Oblicz $abc$.`, steps, parts: [
      part('n', n, String(n), [[String(m), 'Pomylone $n$ i $m$.'], [String(n + 1), 'Pomyłka o 1.'], [String(u), T`$n=m-${u}$, a nie $${u}$.`]]),
      part('m', m, String(m), [[String(n), 'Pomylone $n$ i $m$.'], [String(2 * n), T`$m=2n${wf}$.`], [String(m - 1), 'Pomyłka o 1.']]),
      part('a', qs(a), qt(a), [[qt(Q(Math.round(r * 100), Math.round((p + q) * 100))), 'Odwrócony iloraz.'], [qt(Q(Math.round(p * 100), Math.round(r * 100))), 'Współczynnik sumy to suma obu współczynników.'], [qt(Q(Math.round((p - q) * 100), Math.round(r * 100))), 'Współczynniki się dodaje, nie odejmuje.']]),
      part('abc', qs(abc), qt(abc), [[qt(qmul(a, Q(n + m))), 'Iloczyn, nie suma $b$ i $c$.'], [String(n * m), T`Zapomniane $a=${qt(a)}$.`], [qt(qmul(a, Q(n * n))), T`$c=m=${m}$.`]])] });
  }
  const gen213 = () => { for (;;) { const p = R.pick([0.25, 0.5, 0.75, 1.5, 2.5]), q = R.pick([-0.5, -0.25, 0.5, 1.25]), r = R.pick([0.25, 0.5, 1.25, 2]); if (Math.abs(p + q) > 1e-9) return e213(R.int(1, 3), R.pick([-1, 1, 3]), p, q, r); } };

  /* ---------- 2.15 ---------- */
  function e215(t1, t2) {
    const ns = []; for (let n = 0; n <= 120; n++) { const v = (1n << BigInt(t1)) + (1n << BigInt(t2)) + (1n << BigInt(n)); let s = BigInt(Math.floor(Math.sqrt(Number(v)))); for (const d of [-2n, -1n, 0n, 1n, 2n]) { const x = s + d; if (x >= 0n && x * x === v) { ns.push(n); break; } } }
    const set = [...new Set(ns)].sort((a, b) => a - b);
    const tex = set.length ? T`n\in\{${set.join(',\\ ')}\}` : T`\text{brak}`;
    const exps = [t1, t2].map(t => (t % 2 === 0 ? T`$2^{${t}}=(2^{${t / 2}})^2$` : '')).filter(Boolean).join(', ');
    return mk({ field: txtField(), q: T`Znajdź wszystkie liczby naturalne $n$, dla których $2^{${t1}}+2^{${t2}}+2^n$ jest kwadratem liczby całkowitej.`, tex,
      steps: [T`Szukamy zapisu $(A+B)^2=A^2+2AB+B^2$, gdzie składniki to potęgi dwójki. ${exps ? 'Kwadraty: ' + exps + '.' : ''}`, ...set.map(n => { const v = (1n << BigInt(t1)) + (1n << BigInt(t2)) + (1n << BigInt(n)); const s = BigInt(Math.round(Math.sqrt(Number(v)))); return T`$n=${n}$: $2^{${t1}}+2^{${t2}}+2^{${n}}=${big(v)}=${s}^2$.`; }), T`Dla innych $n$ suma nie jest kwadratem (między kolejnymi kwadratami nie ma miejsca na trzy potęgi dwójki w innym układzie).`, T`Odpowiedź: $${tex}$.${set.length > 1 ? ' Często podaje się tylko największe $n$ — ale wszystkie wartości z listy działają.' : ''}`],
      wrong: [[T`n=${set[set.length - 1]}`, set.length > 1 ? T`To jedno z rozwiązań — $n=${set[0]}$ też działa: sprawdź $2^{${t1}}+2^{${t2}}+2^{${set[0]}}$.` : 'To nie jest jedyna możliwość.'], [T`n=${t1 + t2}`, T`$2^{${t1}}\cdot2^{${t2}}=2^{${t1 + t2}}$ — ale tu dodajemy, nie mnożymy.`], [T`n=${Math.max(t1, t2) + 1}`, 'Sprawdź: suma nie jest kwadratem.'], [T`\text{brak}`, 'Takie $n$ istnieje — szukaj zapisu $(A+B)^2$.']] });
  }
  const gen215 = () => { for (;;) { const a = R.int(1, 8), b = R.int(1, 8); const t1 = 2 * a, t2 = a + b + 1; if (t1 !== t2 && t2 !== 2 * b) { const it = e215(Math.min(t1, t2), Math.max(t1, t2)); if (!/brak/.test(it.mcCorrect)) return it; } } };

  /* ---------- 2.16 ---------- */
  function e216(a, b, c, al, be, K) { // P = (al x + be)(a x^2 + b x - c) + K
    const c3 = al * a, c2 = al * b + be * a, c1 = -al * c + be * b, c0 = -be * c + K;
    const P = poly([[c3, 'x^3', ''], [c2, 'x^2', ''], [c1, 'x', ''], [c0, '', '']]).tex, G = poly([[a, 'x^2', ''], [b, 'x', '']]).tex;
    return mk({ q: T`Wiedząc, że $${G}=${c}$, oblicz wartość wyrażenia $$${P}$$`, ans: String(K), tex: String(K),
      steps: [T`Szukamy w wyrażeniu kombinacji $${G}$. Dzielimy: $${P}=(${poly([[al, 'x', ''], [be, '', '']]).tex})(${G}-${c})+${K}$.`, T`Sprawdź wymnażając: $(${poly([[al, 'x', ''], [be, '', '']]).tex})(${G}-${c})=${poly([[c3, 'x^3', ''], [c2, 'x^2', ''], [c1, 'x', ''], [-be * c, '', '']]).tex}$.`, T`Z założenia $${G}-${c}=0$, więc zostaje $${K}$.`],
      wrong: [[String(c0), 'To wyraz wolny wyrażenia — reszta wyrazów nie znika sama.'], [String(K + c), T`Nawias $${G}-${c}$ jest zerem — nie dodajemy $${c}$.`], [String(K - be * c), 'Błąd przy wymnażaniu wyrazu wolnego.']] });
  }
  const gen216 = () => e216(R.int(2, 5), R.nz(-3, 3), R.int(1, 4), R.int(1, 3), R.nz(-3, 3), R.int(1990, 2030));

  /* ---------- 2.17 ---------- */
  function e217(k) {
    const vs = ['a', 'b', 'c', 'd', 'e'].slice(0, k), fr = vs.map(v => T`\frac{${v}}{${vs.filter(u => u !== v).join('+')}}`).join('=');
    const half = qt(Q(1, k - 1));
    return mk({ gk: 'ratio', field: txtField(), q: T`Jeśli $x=${fr}$, to $x$ wynosi:`, tex: T`${half}\text{ lub }-1`,
      steps: [T`Każdy licznik to $x$ razy mianownik. Dodajemy wszystkie ${k} równości: $${vs.join('+')}=x\cdot ${k - 1}(${vs.join('+')})$.`, T`Jeśli $${vs.join('+')}\neq0$: dzielimy i $x=${half}$.`, T`Jeśli $${vs.join('+')}=0$: mianownik $${vs.slice(1).join('+')}=-a$, więc $x=\frac a{-a}=-1$.`, T`Oba przypadki są możliwe (np. ${k === 3 ? '$a=b=c=1$ oraz $a=1,b=1,c=-2$' : 'wszystkie równe albo suma zero'}), więc $x=${half}$ lub $x=-1$.`],
      wrong: [[half, T`Przy dzieleniu przez $${vs.join('+')}$ trzeba osobno rozpatrzyć przypadek, gdy ta suma jest zerem.`], ['-1', T`To tylko przypadek sumy zerowej — gdy liczby są równe, wychodzi $${half}$.`], [qt(Q(k, k - 1)), 'Błąd przy dodawaniu mianowników.']] });
  }
  const gen217 = () => e217(R.int(3, 5));

  /* ---------- 2.18 ---------- */
  function e218(t, p, q, r) {
    const v = Q(-p * t + q, -t - r);
    return mk({ q: T`Wiedząc, że $\frac1x-\frac1y=${t}$, oblicz wartość ułamka $$\frac{${p}x+${q}xy-${p}y}{x-y-${r}xy}$$`, ans: qs(v), tex: qt(v),
      steps: [T`$\frac1x-\frac1y=\frac{y-x}{xy}=${t}$, więc $x-y=-${t}xy$.`, T`Licznik: $${p}(x-y)+${q}xy=-${p * t}xy+${q}xy=${q - p * t}xy$.`, T`Mianownik: $(x-y)-${r}xy=-${t}xy-${r}xy=${-t - r}xy$.`, T`Ułamek: $\frac{${q - p * t}xy}{${-t - r}xy}=${qt(v)}$.`],
      wrong: [[qt(Q(p * t + q, t - r)), T`$\frac1x-\frac1y=\frac{y-x}{xy}$ — więc $x-y=-${t}xy$, z minusem.`], [qt(Q(-t - r, -p * t + q)), 'Odwrócony ułamek.'], [qt(Q(-p * t, -t)), T`Zgubione wyrazy z $xy$.`]] });
  }
  const gen218 = () => { for (;;) { const t = R.int(2, 6), p = R.int(1, 4), q = R.int(1, 6), r = R.int(1, 4); if (q - p * t !== 0) return e218(t, p, q, r); } };

  /* ---------- 2.20 ---------- */
  function e220(k, d, v) {
    const res = 2 * d - v;
    return mk({ q: T`Niech $P(x)=ax^7+bx^3+cx${d < 0 ? d : '+' + d}$, gdzie $a,b,c$ są stałymi. Wiedząc, że $P(-${k})=${v}$, oblicz $P(${k})$.`, ans: String(res), tex: String(res),
      steps: [T`Oznacz $Q(x)=ax^7+bx^3+cx$ — same nieparzyste potęgi, więc $Q(-x)=-Q(x)$.`, T`$P(-${k})=Q(-${k})${d < 0 ? d : '+' + d}=${v}$, więc $Q(-${k})=${v - d}$ i $Q(${k})=${d - v}$.`, T`$P(${k})=Q(${k})${d < 0 ? d : '+' + d}=${d - v}${d < 0 ? d : '+' + d}=${res}$.`],
      wrong: [[String(-v), T`Wyraz wolny $${d}$ nie zmienia znaku — tylko $Q$ jest nieparzyste.`], [String(v), 'Nieparzyste potęgi zmieniają znak.'], [String(-v - d), T`$P(${k})=-Q(-${k})+(${d})$ — dodaj wyraz wolny raz.`]] });
  }
  const gen220 = () => e220(R.int(2, 9), R.nz(-9, 9), R.int(-15, 15));

  /* ---------- 2.22 ---------- */
  const e222gen = () => mk({ gk: 'gen', vars: ['a', 'b', 'c'], q: T`Dany jest układ $xy=a$, $xz=b$, $yz=c$, przy czym $abc\neq0$. Wyznacz $x^2+y^2+z^2$.`, ans: 'a*b/c+a*c/b+b*c/a', tex: T`\frac{ab}c+\frac{ac}b+\frac{bc}a`,
    steps: [T`$x^2=\frac{(xy)(xz)}{yz}=\frac{ab}c$.`, T`Analogicznie $y^2=\frac{(xy)(yz)}{xz}=\frac{ac}b$, $\ z^2=\frac{(xz)(yz)}{xy}=\frac{bc}a$.`, T`Suma: $\frac{ab}c+\frac{ac}b+\frac{bc}a=\frac{a^2b^2+a^2c^2+b^2c^2}{abc}$.`],
    wrong: [[T`\frac{bc}a+\frac{ab}c+\frac{ac}{b}+abc`, 'Dopisany zbędny wyraz.'], [T`\frac{a}{bc}+\frac{b}{ac}+\frac{c}{ab}`, T`Odwrócone ułamki: $x^2=\frac{ab}{c}$.`], [T`a^2+b^2+c^2`, T`$a=xy$, więc $a^2=x^2y^2$, a nie $x^2$.`]] });
  function e222(x, y, z) {
    const a = x * y, b = x * z, c = y * z, v = x * x + y * y + z * z;
    return mk({ gk: 'num', q: T`Liczby $x,y,z$ spełniają $xy=${a}$, $xz=${b}$, $yz=${c}$. Oblicz $x^2+y^2+z^2$.`, ans: String(v), tex: String(v),
      steps: [T`$x^2=\frac{(xy)(xz)}{yz}=\frac{${a}\cdot ${b}}{${c}}=${x * x}$, $\ y^2=\frac{${a}\cdot ${c}}{${b}}=${y * y}$, $\ z^2=\frac{${b}\cdot ${c}}{${a}}=${z * z}$.`, T`Suma: $${x * x}+${y * y}+${z * z}=${v}$.`],
      wrong: [[String(a * a + b * b + c * c), T`$a=xy$, więc $a^2=x^2y^2$ — to nie $x^2$.`], [String(Math.abs(x) + Math.abs(y) + Math.abs(z)), 'Policzono $|x|+|y|+|z|$ zamiast sumy kwadratów.'], [String(v + 2 * (a + b + c)), 'To $(x+y+z)^2$.']] });
  }
  const gen222 = gk => (gk === 'gen' ? e222gen() : e222(R.nz(-6, 6), R.nz(-6, 6), R.nz(-6, 6)));

  /* ---------- 2.23 ---------- */
  function e223(es) {
    const r = es.map(e => e % 5), v = r.filter(x => x === 0).length + 1 + (new Set(r.filter(x => x)).size === 4 ? -1 : 0);
    const nz = r.filter(x => x), allFour = new Set(nz).size === 4 && nz.length === 4;
    const val = allFour ? 0 : r.every(x => x === 0) ? es.length + 1 : null;
    return mk({ q: T`Wiedząc, że $a^4+a^3+a^2+a+1=0$, oblicz $$${es.map(e => 'a^{' + e + '}').join('+')}+1$$`, ans: String(val), tex: String(val),
      steps: [T`Mnożymy równanie przez $(a-1)$: $a^5-1=0$, więc $a^5=1$ (i $a\neq1$).`, T`Potęgi powtarzają się co $5$: ${es.map((e, i) => T`$a^{${e}}=a^{${r[i]}}$`).join(', ')}.`, allFour ? T`Zostaje $a^4+a^3+a^2+a+1=0$ (w innej kolejności).` : T`Każdy składnik to $1$: suma $=${val}$.`],
      wrong: [[String(allFour ? 5 : 0), allFour ? 'Reszty z dzielenia przez 5 są różne — to nie same jedynki.' : 'Wykładniki są wielokrotnościami 5, więc każda potęga to 1.'], [String(allFour ? 1 : val - 1), 'Nie zapomnij o $+1$ na końcu.'], ['-1', T`$a^5=1$, a nie $-1$.`]] });
  }
  const gen223 = () => (Math.random() < 0.5 ? e223([5 * R.int(100, 500), 5 * R.int(100, 500)]) : e223(R.shuffle([1, 2, 3, 4]).map(r => 5 * R.int(50, 400) + r)));

  /* ---------- 2.24 ---------- */
  const e224gen = () => mk({ gk: 'gen', field: txtField(), q: T`Dany jest wielomian $(x^2-x-1)^n=a_{2n}x^{2n}+\ldots+a_1x+a_0$. Wyznacz $a_0+a_2+a_4+\ldots+a_{2n}$.`, tex: T`\frac{1+(-1)^n}{2}`,
    steps: [T`$W(1)=(1-1-1)^n=(-1)^n$ — suma wszystkich współczynników.`, T`$W(-1)=(1+1-1)^n=1$ — współczynniki parzyste z plusem, nieparzyste z minusem.`, T`$W(1)+W(-1)=2(a_0+a_2+\ldots)$, więc szukana suma $=\frac{(-1)^n+1}2$: $1$ dla $n$ parzystego, $0$ dla nieparzystego.`],
    wrong: [[T`(-1)^n`, T`To suma <i>wszystkich</i> współczynników $W(1)$.`], [T`\frac{(-1)^n-1}{2}`, T`Parzyste współczynniki to $\frac{W(1)+W(-1)}2$ — z plusem.`], ['1', T`Dla nieparzystego $n$ wychodzi $0$.`]] });
  function e224(p, q0, n) {
    const W1 = (1 + p + q0) ** n, Wm = (1 - p + q0) ** n, v = (W1 + Wm) / 2;
    const tri = poly([[1, 'x^2', ''], [p, 'x', ''], [q0, '', '']]).tex;
    return mk({ gk: 'num', q: T`Dla $(${tri})^{${n}}=a_{${2 * n}}x^{${2 * n}}+\ldots+a_1x+a_0$ oblicz $a_0+a_2+\ldots+a_{${2 * n}}$.`, ans: String(v), tex: String(v),
      steps: [T`$W(1)=(${1 + p + q0})^{${n}}=${W1}$, $\ W(-1)=(${1 - p + q0})^{${n}}=${Wm}$.`, T`Suma parzystych: $\frac{W(1)+W(-1)}2=\frac{${W1}+${par(Wm)}}2=${v}$.`],
      wrong: [[String(W1), 'To suma wszystkich współczynników.'], [String((W1 - Wm) / 2), 'To suma współczynników przy nieparzystych potęgach.'], [String(W1 + Wm), 'Zapomniano podzielić przez 2.']] });
  }
  const par = x => (x < 0 ? '(' + x + ')' : String(x));
  const gen224 = gk => { if (gk === 'gen') return e224gen(); for (;;) { const p = R.int(-2, 2), q0 = R.int(-2, 2), n = R.int(2, 6); if (q0 !== 0 && Math.abs(1 + p + q0) <= 3 && Math.abs(1 - p + q0) <= 3 && (1 + p + q0 + 1 - p + q0) !== 0) return e224(p, q0, n); } };

  /* ---------- 2.6, 2.19, 2.21 — zadania bez losowania ---------- */
  const it26 = mk({ field: txtField(), q: T`Dane są $P(x)=nx^{n+4}+3x^{4-n}-2x^3+4x-5$ oraz $Q(x)=3x^{n+4}-x^4+x^3+2nx^2+x-2$. Dla jakiej liczby całkowitej $n$ różnica $P-Q$ jest wielomianem stopnia $5$ o dokładnie sześciu wyrazach?`, tex: 'n=-1',
    steps: [T`Żeby $P,Q$ były wielomianami: $n+4\geq0$ i $4-n\geq0$, czyli $n\in\{-4,\ldots,4\}$.`, T`$P-Q=(n-3)x^{n+4}+3x^{4-n}+x^4-3x^3-2nx^2+3x-3$.`, T`Stopień $5$: albo $n+4=5$ ($n=1$), albo $4-n=5$ ($n=-1$).`, T`$n=1$: $-2x^5+x^4+3x^3-3x^3-2x^2+3x-3=-2x^5+x^4-2x^2+3x-3$ — tylko 5 wyrazów ($x^3$ się redukuje).`, T`$n=-1$: $-4x^3+3x^5+x^4-3x^3+2x^2+3x-3=3x^5+x^4-7x^3+2x^2+3x-3$ — 6 wyrazów, stopień 5 ✓.`, T`Odpowiedź: tak, $n=-1$.`],
    wrong: [['n=1', T`Dla $n=1$ wyrazy $3x^3$ i $-3x^3$ się znoszą — zostaje tylko 5 wyrazów.`], ['n=3', T`Dla $n=3$ współczynnik $n-3$ jest zerem, a $x^1$ i $x^4$… stopień nie wynosi 5.`], [T`\text{takie }n\text{ nie istnieje}`, T`Sprawdź $n=-1$: wtedy $3x^{4-n}=3x^5$.`]] });
  const fig219 = '<svg viewBox="0 0 330 345" width="200" style="display:block;margin:10px auto;max-width:60%" aria-label="Prostokąt podzielony na 9 kwadratów"><g fill="none" stroke="currentColor" stroke-width="2.5">' +
    [[0, 0, 14, 'D'], [14, 0, 18, 'I'], [0, 14, 10, 'C'], [10, 14, 4, 'E'], [10, 18, 7, 'F'], [9, 24, 1, ''], [0, 24, 9, 'B'], [9, 25, 8, 'G'], [17, 18, 15, 'H']].map(([x, y, s, l]) => `<rect x="${x * 10 + 1}" y="${y * 10 + 1}" width="${s * 10}" height="${s * 10}"/>` + (l ? `<text x="${x * 10 + 1 + s * 5}" y="${y * 10 + 1 + s * 5 + 6}" text-anchor="middle" font-size="${s > 5 ? 22 : 14}" font-style="italic" fill="currentColor" stroke="none">${l}</text>` : '')).join('') + '</g></svg>';
  const it219 = multi({ q: T`Prostokąt podzielono na dziewięć kwadratów ($B,C,D,E,F,G,H,I$ i jeden najmniejszy, bez litery). Najmniejszy kwadrat ma bok $1$. Wyznacz bok drugiego najmniejszego kwadratu oraz pole prostokąta.${fig219}`,
    steps: [T`Oznacz boki literami kwadratów: $c$ — bok $C$, $e$ — bok $E$ itd. Idziemy wzdłuż wspólnych krawędzi.`, T`Górny brzeg $C$ i $E$ to dolny brzeg $D$: $d=c+e$. Prawy brzeg $E$ to lewy brzeg $I$, dolny brzeg $E$ to dolny brzeg $I$: $i=d+e=c+2e$.`, T`Kwadrat $1\times1$ leży pod prawym końcem $C$: $b=c-1$. Pod nim $G$, a $G$ kończy się tam, gdzie $F$: $g=f+1$; górny brzeg $G$ to dolny brzeg $F$: $c+1=e+f$.`, T`Dolne brzegi $B$ i $G$ są równe: $c+b=c+1+g$, czyli $c-1=f+2$, więc $f=c-3$. Z $c+1=e+f$: $\boxed{e=4}$.`, T`$H$: od dolnego brzegu $I$ do dołu, $h=(d+c+b)-(d+e)=2c-5$. Szerokość dwiema drogami: $d+i=c+f+h$, czyli $2c+12=4c-8$, $c=10$.`, T`Boki: $1,4,7,8,9,10,14,15,18$. Prostokąt: $32\times33$, pole $1056$.`],
    parts: [part('bok drugiego najmniejszego', 4, '4', [['2', 'Sprawdź równanie z dolnych brzegów $B$ i $G$.'], ['7', 'To bok $F$ — trzeci najmniejszy.'], ['3', T`Z $c-1=f+2$ i $c+1=e+f$ wychodzi $e=4$.`]]), part('pole prostokąta', 1056, '1056', [['1024', T`Prostokąt nie jest kwadratem: $32\times33$.`], ['1089', 'To $33^2$ — boki są różne.'], ['1012', 'Sprawdź szerokość: $14+18=32$, wysokość: $14+10+9=33$.']])] });
  const S = (goal, q, a, line, why, ...w) => ({ goal, q, a, line, why, w });
  const it221 = { label: '2.21', type: 'guided', gk: 'proof', q: T`Wykaż, że jeśli niezerowe liczby $a,b,c$ spełniają $\frac1a+\frac1b+\frac1c=\frac1{a+b+c}$, to wśród nich są dwie liczby przeciwne.`,
    idea: T`„Dwie liczby przeciwne” to $a+b=0$ albo $b+c=0$ albo $c+a=0$ — czyli iloczyn $(a+b)(b+c)(c+a)$ jest zerem. Wystarczy przekształcić założenie do tej postaci: pozbyć się ułamków i rozpoznać rozkład na czynniki.`,
    steps: [
      S('Bez ułamków', T`Jak pozbyć się ułamków w założeniu?`, T`Pomnożyć obie strony przez $abc(a+b+c)$`, T`Mnożymy przez $abc(a+b+c)\neq0$: $(ab+bc+ca)(a+b+c)=abc$.`, T`Lewa strona po sprowadzeniu do wspólnego mianownika to $\frac{ab+bc+ca}{abc}$. Mianownik $a+b+c\neq0$, bo prawa strona ma sens.`,
        [T`Odwrócić obie strony`, T`$\frac1{\frac1a+\frac1b+\frac1c}\neq a+b+c$ — odwrotność sumy to nie suma odwrotności.`], [T`Pomnożyć przez $a+b+c$`, 'Zostaną ułamki z $a,b,c$ w mianownikach.']),
      S('Rozpoznajemy iloczyn', T`Co ma wspólnego $(a+b+c)(ab+bc+ca)-abc$ z liczbami przeciwnymi?`, T`To jest $(a+b)(b+c)(c+a)$`, T`Wymnażając: $(a+b+c)(ab+bc+ca)-abc=(a+b)(b+c)(c+a)$. Zatem $(a+b)(b+c)(c+a)=0$.`, T`Sprawdź: $(a+b)(b+c)=ab+ac+b^2+bc$; razy $(c+a)$ daje $a^2b+a^2c+ab^2+b^2c+ac^2+bc^2+2abc$ — tyle samo co lewa strona.`,
        [T`To jest $(a+b+c)^3$`, 'Rozwinięcie sześcianu ma wyrazy $a^3,b^3,c^3$, których tu nie ma.'], [T`To jest $a^2+b^2+c^2$`, 'Wyrażenie ma stopień 3, nie 2.']),
      S('Wniosek', T`Iloczyn trzech czynników jest zerem. Co z tego wynika?`, T`Któryś czynnik jest zerem, np. $a+b=0$`, T`Iloczyn jest zerem, więc $a+b=0$ lub $b+c=0$ lub $c+a=0$ — dwie z liczb są przeciwne. $\blacksquare$`, T`Iloczyn liczb rzeczywistych jest zerem tylko wtedy, gdy któryś czynnik jest zerem.`,
        [T`Wszystkie czynniki są zerami`, 'Wystarczy jeden — np. $a=1,b=-1,c=5$.'], [T`$a=b=c=0$`, 'Liczby są niezerowe z założenia.'])] };
  it221.sol = it221.steps.map(s => s.line);

  /* ---------- lista ---------- */
  const L = (id, name, statement, wzIds, gen, items) => ({ id, name, statement, wzIds, gen, items });
  A.addList({
    num: 12, id: 'p2', subject: 'pro', title: 'Lista 2', name: 'Jednomiany i wielomiany', hue: 'p2',
    blurb: 'Opuszczanie nawiasów, wyrazy podobne, równość wielomianów, wymnażanie, stopień, sprytne podstawienia.',
    tasks: [
      L('P2.1', 'Nawiasy w nawiasach', T`Uprość wyrażenie $3a+\{-4b-[4a-7b-(-4a-b)]+5a\}$.`, ['brackets', 'like'], gen21, [Object.assign(e21([3, -4, 4, -7, -4, -1, 5]), { label: '2.1' })]),
      L('P2.2', 'Nawiasy z mnożeniem', T`Uprość wyrażenie $4\{(3x-2)-[3(3x-2)+3]\}-(4-6x)$.`, ['brackets', 'distr', 'like'], gen22, [Object.assign(e22(4, 3, 2, 3, 3, 4, 6), { label: '2.2' })]),
      L('P2.3', 'Potęgi z $n$ w wykładniku', T`Oblicz wartość wyrażenia $-9x^{n-2}-8x^{n-1}-(-9x^{n-2})-8(x^{n-2}-2x^{n-1})$ dla $x=9$ oraz $n=3$.`, ['brackets', 'like', 'pows'], gen23, [Object.assign(e23(9, 8, 8, 2, 9, 3, 'simp'), { label: 'uprość' }), Object.assign(e23(9, 8, 8, 2, 9, 3, 'val'), { label: 'wartość' })]),
      L('P2.4', 'Równość wielomianów', T`Dla dowolnych $x,y$: $x^3+4x^2y+axy^2+3xy-bx^cy+7xy^2+dxy+y^2=x^3+y^2$. Wyznacz $a,b,c,d$.`, ['identity', 'like'], gen24, [Object.assign(e24(4, 3, 7), { label: '2.4' })]),
      L('P2.5', 'Warunki i wyrazy podobne', T`Liczby $m,x,y$ spełniają: $\frac23(x-5)^2+5m^2=0$ oraz $-2a^2b^{y+1}$ i $3a^2b^3$ są wyrazami podobnymi. Oblicz $\frac38x^2y+5m^2$ $-\left\{-\frac7{16}x^2y+\left[-\frac14xy^2-\frac3{16}x^2y-3{,}475xy^2\right]-6{,}275xy^2\right\}$.`, ['sqzero', 'like', 'brackets'], gen25, [Object.assign(e25(5, 2, 1, 5), { label: '2.5' })]),
      L('P2.6', 'Różnica $P-Q$ stopnia 5', T`Dane są $P(x)=nx^{n+4}+3x^{4-n}-2x^3+4x-5$ oraz $Q(x)=3x^{n+4}-x^4+x^3+2nx^2+x-2$. Czy istnieje liczba całkowita $n$, dla której $P-Q$ jest wielomianem stopnia $5$ o dokładnie sześciu wyrazach?`, ['degree', 'like'], null, [Object.assign(it26, { label: '2.6' })]),
      L('P2.7', 'Wymnażanie czterech nawiasów', T`Rozwiń do postaci wielomianu: $(x-1)(x-2)(x-3)(x-4)$.`, ['expand'], gen27, [Object.assign(e27([1, 2, 3, 4]), { label: '2.7' })]),
      L('P2.8', 'Różnica kwadratów wyrażeń', T`Rozwiń: $\left(5xy-3x^2+\frac12y^2\right)\left(5xy+3x^2-\frac12y^2\right)$.`, ['dsq', 'sqsum'], gen28, [Object.assign(e28(5, 3, 1), { label: '2.8' })]),
      L('P2.9', 'Redukcja z $x^2=x+1$', T`Wiedząc, że $x^2-x-1=0$, sprowadź $\frac{x^3+x+1}{x^5}$ do postaci wielomianu.`, ['reduce'], gen29, [Object.assign(e29(), { label: '2.9' })]),
      L('P2.10', 'Co jest jednomianem?', T`Które z wyrażeń $\frac x5$, $-0{,}5\left(1+\frac1x\right)$, $\frac3{x^2}$ nie są jednomianami?`, ['monomial'], gen210, [Object.assign(e210([0, 1, 2]), { label: '2.10' })]),
      L('P2.11', 'Stopień sumy', T`Jaki może być stopień sumy dwóch wielomianów stopnia $4$? (1) $8$, (2) $4$, (3) mniej niż $4$, (4) nie większy niż $4$.`, ['degree'], gen211, [Object.assign(e211(4, 4, '+'), { label: '2.11' })]),
      L('P2.12', 'Pomyłka Adama', T`Adam zamiast dodać wielomian $2x^2+x+1$, odjął go i otrzymał $5x^2-2x+4$. Wyznacz poprawny wynik.`, ['brackets', 'like'], gen212, [Object.assign(e212([2, 1, 1], [5, -2, 4]), { label: '2.12' })]),
      L('P2.13', 'Jednomiany podobne', T`Jednomiany $0{,}75x^by^c$ oraz $-0{,}5x^{m-1}y^{2n-1}$ są podobne, a ich suma wynosi $1{,}25ax^ny^m$. Oblicz $abc$.`, ['like'], gen213, [Object.assign(e213(1, 1, 0.75, -0.5, 1.25), { label: '2.13' })]),
      L('P2.14', 'Stopień iloczynu', T`Wyrażenia $x^5$, $x+\frac1x$ oraz $1+\frac2x+\frac3{x^2}$ pomnożono przez siebie. Określ stopień otrzymanego wielomianu.`, ['degree', 'monomial'], gen214, [Object.assign(e214(5, 1, 2), { label: '2.14' })]),
      L('P2.15', 'Kwadrat z potęg dwójki', T`Znajdź liczbę naturalną $n$ taką, że $2^8+2^{10}+2^n$ jest kwadratem liczby całkowitej.`, ['perfsq', 'sqsum'], gen215, [Object.assign(e215(8, 10), { label: '2.15' })]),
      L('P2.16', 'Wykorzystaj $3x^2+x=1$', T`Wiedząc, że $3x^2+x=1$, oblicz $6x^3-x^2-3x+2010$.`, ['usegiven'], gen216, [Object.assign(e216(3, 1, 1, 2, -1, 2009), { label: '2.16' })]),
      L('P2.17', 'Równe ilorazy', T`Jeśli $x=\frac a{b+c}=\frac b{a+c}=\frac c{a+b}$, to $x$ wynosi: (1) $\frac12$, (2) $-1$, (3) $\frac12$ lub $-1$, (4) $\frac32$.`, ['ratio'], gen217, [Object.assign(e217(3), { label: '2.17' })]),
      L('P2.18', 'Podstawienie z $\\frac1x-\\frac1y$', T`Wiedząc, że $\frac1x-\frac1y=4$, oblicz $\frac{2x+4xy-2y}{x-y-2xy}$.`, ['sub'], gen218, [Object.assign(e218(4, 2, 4, 2), { label: '2.18' })]),
      L('P2.19', 'Prostokąt z kwadratów', T`Prostokąt podzielono na dziewięć kwadratów. Najmniejszy ma bok $1$. Wyznacz bok drugiego najmniejszego kwadratu i pole prostokąta.`, ['squares'], null, [Object.assign(it219, { label: '2.19' })]),
      L('P2.20', 'Nieparzyste potęgi', T`Niech $P(x)=ax^7+bx^3+cx-5$. Wiedząc, że $P(-7)=7$, oblicz $P(7)$.`, ['oddf'], gen220, [Object.assign(e220(7, -5, 7), { label: '2.20' })]),
      L('P2.21', 'Dwie liczby przeciwne', T`Wykaż, że jeśli niezerowe $a,b,c$ spełniają $\frac1a+\frac1b+\frac1c=\frac1{a+b+c}$, to wśród nich są dwie liczby przeciwne.`, ['fracsum'], null, [it221]),
      L('P2.22', 'Układ $xy=a$, $xz=b$, $yz=c$', T`Dany jest układ $xy=a$, $xz=b$, $yz=c$, $abc\neq0$. Wyznacz $x^2+y^2+z^2$ w zależności od $a,b,c$.`, ['sys3'], gen222, [Object.assign(e222gen(), { label: '2.22' })]),
      L('P2.23', 'Pierwiastek z jedynki', T`Wiedząc, że $a^4+a^3+a^2+a+1=0$, oblicz $a^{2000}+a^{2010}+1$.`, ['unity5'], gen223, [Object.assign(e223([2000, 2010]), { label: '2.23' })]),
      L('P2.24', 'Suma parzystych współczynników', T`Dla $(x^2-x-1)^n=a_{2n}x^{2n}+\ldots+a_1x+a_0$ wyznacz $a_0+a_2+\ldots+a_{2n}$.`, ['coefsum'], gen224, [Object.assign(e224gen(), { label: '2.24' })]),
    ],
  });
  for (const t of A.lists.find(l => l.id === 'p2').tasks) { t.wzLib = Object.assign({}, A.PRO.F1 || {}, F); if (!t.gen) delete t.gen; }
  A.PRO._t2 = { e21, e22, e23, e24, e25, e27, e28, e29p, e212, e213, e215, e216, e218, e220, e222, e223, e224, poly };
})();
