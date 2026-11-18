/* Proseminarium — Lista 1: Przekształcenia (rachunki, sprytne przekształcenia, sumy teleskopowe) */
(function () {
  'use strict';
  const A = AQ, R = A.R, T = String.raw;

  /* ---------- wspólne narzędzia proseminarium ---------- */
  const gcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a; };
  const Q = (p, q = 1) => { if (q < 0) { p = -p; q = -q; } const g = gcd(p, q) || 1; return [p / g, q / g]; };
  const qadd = (x, y) => Q(x[0] * y[1] + y[0] * x[1], x[1] * y[1]);
  const qsub = (x, y) => Q(x[0] * y[1] - y[0] * x[1], x[1] * y[1]);
  const qmul = (x, y) => Q(x[0] * y[0], x[1] * y[1]);
  const qdiv = (x, y) => Q(x[0] * y[1], x[1] * y[0]);
  const qt = x => (x[1] === 1 ? String(x[0]) : (x[0] < 0 ? '-' : '') + '\\frac{' + Math.abs(x[0]) + '}{' + x[1] + '}');
  const qs = x => (x[1] === 1 ? String(x[0]) : x[0] + '/' + x[1]);
  const par = s => (/^-/.test(s) ? '\\left(' + s + '\\right)' : s);
  const big = n => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '\\,');
  const norm = s => String(s).replace(/\s|\\,|\\left|\\right/g, '');
  // podpunkt z jedną odpowiedzią i własnymi błędnymi odpowiedziami (każda z wyjaśnieniem „skąd ten wynik”)
  // zapas: gdy błędne odpowiedzi się pokryły, dobieramy bliskie wartości liczbowe
  function fill(tex, mc, seen) {
    if (mc.length >= 3) return;
    const t = norm(tex); let cands = [];
    const mI = t.match(/^(-?)(\d+)$/), mF = t.match(/^(-?)\\frac\{(\d+)\}\{(\d+)\}$/);
    if (mI) { const v = (mI[1] ? -1 : 1) * +mI[2]; cands = [[v + 1, 'Pomyłka o $1$ w ostatnim kroku — przelicz jeszcze raz.'], [v - 1, 'Pomyłka o $1$ w ostatnim kroku — przelicz jeszcze raz.'], [-v, 'Zły znak wyniku.'], [2 * v, 'Wynik policzony podwójnie.'], [v + 2, 'Błąd rachunkowy — sprawdź dodawanie.'], [v - 2, 'Błąd rachunkowy — sprawdź odejmowanie.']].map(([x, w]) => [String(x), w]); }
    else if (mF) { const s = mF[1] ? -1 : 1, p = +mF[2], q = +mF[3]; cands = [[[s * (p + 1), q], 'Błąd w liczniku — przelicz ostatni krok.'], [[s * p, q + 1], 'Błąd w mianowniku — przelicz ostatni krok.'], [[-s * p, q], 'Zły znak wyniku.'], [[s * q, p], 'Odwrócony ułamek.'], [[s * p, 2 * q], 'Zgubiony czynnik $2$.']].map(([x, w]) => [qt(Q(x[0], x[1])), w]); }
    for (const [c, why] of cands) { const k = norm(c); if (mc.length >= 3) break; if (seen.has(k)) continue; seen.add(k); mc.push({ tex: c, why }); }
  }
  function mk(o) {
    const f = o.field || { label: o.flabel || 'wynik', ans: String(o.ans), restrict: ['plain'] };
    if (o.vars) f.vars = o.vars;
    const seen = new Set([norm(o.tex)]), mc = [];
    for (const [tex, why] of o.wrong) { const k = norm(tex); if (!tex || seen.has(k) || mc.length >= 3) continue; seen.add(k); mc.push({ tex, why }); }
    fill(o.tex, mc, seen);
    const it = { label: o.label, gk: o.gk, q: o.q, fields: [f], mcCorrect: o.tex, mc, sol: o.steps, steps: o.steps };
    if (o.extra) Object.assign(it, o.extra);
    return it;
  }
  // długie sumy łamiemy na wiersze (telefon): parts = kolejne składniki z własnym znakiem
  const wrapSum = (parts, per) => (parts.length <= per ? parts.join('') : '\\begin{aligned}&' + Array.from({ length: Math.ceil(parts.length / per) }, (_, i) => parts.slice(i * per, i * per + per).join('')).join('\\\\&') + '\\end{aligned}');
  const txtField = () => ({ label: 'odpowiedź', kind: 'yesno', ans: true });
  // opracowanie: biblioteka wzorów z wyprowadzeniem (pokazywane w „Wzorach”)
  const W = (f, ...d) => ({ f, d });
  A.PRO = { wrapSum, gcd, Q, qadd, qsub, qmul, qdiv, qt, qs, par, big, norm, mk, fill, txtField, W };

  const F = {
    order: W(T`Kolejność działań: nawiasy → potęgi → mnożenie i dzielenie (od lewej) → dodawanie i odejmowanie.`, T`Potęga wiąże najmocniej: $-2^2=-4$, ale $(-2)^2=4$.`, T`Dzielenie i mnożenie wykonujemy od lewej do prawej: $8:2\cdot4=16$.`),
    negpow: W(T`$(-a)^n=a^n$ dla $n$ parzystego, $(-a)^n=-a^n$ dla $n$ nieparzystego. W szczególności $(-1)^n=\pm1$.`, T`Każda para minusów daje plus: $(-a)(-a)=a^2$.`, T`Przy nieparzystej liczbie czynników zostaje jeden minus bez pary.`),
    divfrac: W(T`Dzielenie przez ułamek to mnożenie przez odwrotność: $x:\frac pq=x\cdot\frac qp$.`, T`$x:\frac pq=y$ znaczy $y\cdot\frac pq=x$, więc $y=x\cdot\frac qp$.`),
    powprod: W(T`$a^n\cdot b^n=(ab)^n$, $\ a^{m}\cdot a^{n}=a^{m+n}$.`, T`Przykład: $(-0{,}125)^7\cdot8^8=(-0{,}125\cdot8)^7\cdot8=(-1)^7\cdot8$.`),
    signs: W(T`Odejmowanie liczby ujemnej to dodawanie: $x-(-y)=x+y$.`, T`$-(-y)$ to liczba przeciwna do $-y$, czyli $y$.`),
    nines: W(T`$a\cdot\underbrace{99\ldots9}_{k}=a\cdot(10^k-1)=a\cdot10^k-a$.`, T`$99\ldots9$ ($k$ dziewiątek) to $10^k-1$, np. $999=1000-1$.`, T`Mnożenie przez $10^k$ dopisuje $k$ zer, potem odejmujemy $a$ pisemnie.`),
    dsq: W(T`$a^2-b^2=(a-b)(a+b)$.`, T`Wymnażamy: $(a-b)(a+b)=a^2+ab-ab-b^2=a^2-b^2$.`, T`Często spotykane: $(n-1)(n+1)=n^2-1$.`),
    sqsum: W(T`$(a\pm b)^2=a^2\pm2ab+b^2$.`, T`$(a+b)^2=(a+b)(a+b)=a^2+ab+ba+b^2$.`, T`Stąd $(n-1)^2+(n+1)^2=2n^2+2$.`),
    cubes: W(T`$a^3+b^3=(a+b)(a^2-ab+b^2)$, $\ a^3-b^3=(a-b)(a^2+ab+b^2)$.`, T`Wymnóż prawą stronę: $(a+b)(a^2-ab+b^2)=a^3-a^2b+ab^2+a^2b-ab^2+b^3=a^3+b^3$.`),
    sub: W(T`Podstawienie: powtarzający się fragment zastępujemy jedną literą, np. $n=13579$.`, T`Rachunek na literach pokazuje, co się skraca — liczby podstawiamy dopiero na końcu.`),
    tel1: W(T`$\frac{1}{k(k+1)}=\frac1k-\frac1{k+1}$ (suma teleskopowa).`, T`$\frac1k-\frac1{k+1}=\frac{(k+1)-k}{k(k+1)}=\frac1{k(k+1)}$.`, T`W sumie środkowe wyrazy się skracają: zostaje pierwszy i ostatni.`),
    teld: W(T`$\frac{1}{x(x+d)}=\frac1d\left(\frac1x-\frac1{x+d}\right)$.`, T`$\frac1x-\frac1{x+d}=\frac{d}{x(x+d)}$, więc trzeba jeszcze podzielić przez $d$.`, T`Dla kolejnych liczb nieparzystych $d=2$: $\frac1{(2k-1)(2k+1)}=\frac12\left(\frac1{2k-1}-\frac1{2k+1}\right)$.`),
    tel3: W(T`$\frac{1}{k(k+1)(k+2)}=\frac12\left(\frac1{k(k+1)}-\frac1{(k+1)(k+2)}\right)$.`, T`$\frac1{k(k+1)}-\frac1{(k+1)(k+2)}=\frac{(k+2)-k}{k(k+1)(k+2)}=\frac{2}{k(k+1)(k+2)}$.`),
    gauss: W(T`$1+2+\ldots+n=\frac{n(n+1)}{2}$.`, T`Zapisz sumę dwa razy: od przodu i od tyłu. Każda para daje $n+1$, par jest $n$, więc $2S=n(n+1)$.`),
    prodtel: W(T`Iloczyn teleskopowy: $\frac12\cdot\frac23\cdot\frac34\cdots\frac{m-1}{m}=\frac1m$.`, T`Licznik każdego ułamka skraca się z mianownikiem poprzedniego.`),
    repeat: W(T`$\overline{abcdabcd}=\overline{abcd}\cdot10001$, np. $20092009=2009\cdot10001$.`, T`Dopisanie tej samej czwórki cyfr to $x\cdot10^4+x=x\cdot10001$.`),
    pairs: W(T`Grupowanie w pary: łączymy wyrazy, które razem dają coś prostego, np. $(-1)^k+(-1)^{k+1}=0$ albo $(2k+1)^2-(2k)^2=4k+1$.`, T`$(2k+1)^2-(2k)^2=(2k+1-2k)(2k+1+2k)=4k+1$ (różnica kwadratów).`),
    sophie: W(T`$1+k^2+k^4=(k^2+k+1)(k^2-k+1)$.`, T`$k^4+k^2+1=(k^2+1)^2-k^2=(k^2+1-k)(k^2+1+k)$ — różnica kwadratów.`, T`Przy tym $(k+1)^2-(k+1)+1=k^2+k+1$, więc kolejne czynniki się zazębiają.`),
    symm: W(T`Symetria: jeśli $f(k)+f(2a-k)=2$, to wyrazy łączymy w pary od końców.`, T`Dla $f(k)=\frac{k^2}{k^2-2ak+2a^2}$ mianownik się nie zmienia po zamianie $k\to2a-k$.`),
    cmp: W(T`Porównanie przez różnicę: $X>Y\iff X-Y>0$.`, T`$(a-b)^2-(a+b)^2=-4ab$.`),
    abspow: W(T`Dla $0<|a|<1$ potęgi maleją co do wartości: $|a|^4<|a|^3<|a|<1<\frac1{|a|}$.`, T`Mnożenie przez liczbę o module mniejszym od $1$ zmniejsza moduł.`, T`Znak: parzysta potęga dodatnia, nieparzysta ma znak $a$.`),
    harm: W(T`Gdy w wyrażeniu powtarza się długa suma, oznacz ją literą (np. $S=\frac13+\ldots+\frac1{2008}$) i wymnóż nawiasy.`, T`Wyrazy $S^2$ i większość wyrazów z $S$ się skrócą.`),
  };

  /* ---------- 1.1 ---------- */
  function e11(a, b, c, N) {
    const s = N % 2 ? 1 : -1, v = qadd(Q(-1, a), Q(-b * b * b * c * c + s));
    const q = T`Oblicz wartość wyrażenia $$(-${a})^2\cdot\left(-\frac{1}{${a}}\right)^3-${b}^3:\left(-\frac{1}{${c}}\right)^2-(-1)^{${N}}$$`;
    const steps = [
      T`Potęgi: $(-${a})^2=${a * a}$ (parzysty wykładnik), $\left(-\frac1{${a}}\right)^3=-\frac1{${a ** 3}}$ (nieparzysty — minus zostaje).`,
      T`Iloczyn: $${a * a}\cdot\left(-\frac1{${a ** 3}}\right)=-\frac1{${a}}$.`,
      T`$${b}^3=${b ** 3}$, $\left(-\frac1{${c}}\right)^2=\frac1{${c * c}}$, a dzielenie przez $\frac1{${c * c}}$ to mnożenie przez $${c * c}$: $${b ** 3}\cdot${c * c}=${b ** 3 * c * c}$.`,
      T`$(-1)^{${N}}=${-s}$ (${N % 2 ? 'nieparzysty' : 'parzysty'} wykładnik), więc $-(-1)^{${N}}=${s > 0 ? '+1' : '-1'}$.`,
      T`Razem: $-\frac1{${a}}-${b ** 3 * c * c}${s > 0 ? '+1' : '-1'}=${qt(v)}$.`];
    const W1 = qadd(Q(1, a), Q(-(b ** 3) * c * c + s)), W2 = qadd(qadd(Q(-1, a), Q(-(b ** 3), c * c)), Q(s)), W3 = qadd(Q(-1, a), Q(-(b ** 3) * c * c - s));
    return mk({ q, ans: qs(v), tex: qt(v), steps, wrong: [
      [qt(W1), T`Zgubiony minus: $\left(-\frac1{${a}}\right)^3$ jest ujemne, bo wykładnik jest nieparzysty.`],
      [qt(W2), T`Dzielenie przez $\frac1{${c * c}}$ potraktowano jak mnożenie — a to mnożenie przez $${c * c}$.`],
      [qt(W3), T`Zły znak $(-1)^{${N}}$: przy ${N % 2 ? 'nieparzystym' : 'parzystym'} wykładniku to $${-s}$.`],
      [qt(qadd(Q(-1, a), Q(-(b ** 3) * c * c))), T`Zgubiony ostatni wyraz $-(-1)^{${N}}$.`]] });
  }
  const gen11 = () => e11(R.pick([2, 3, 4, 5, 6]), R.pick([2, 3]), R.pick([2, 3, 4]), R.int(1990, 2030));

  /* ---------- 1.2 ---------- */
  const PR = [2, 3, 5, 7, 11];
  function w1(ps) {
    const P = ps.reduce((a, b) => a * b, 1), parts = ps.map(p => P / p), v = parts.reduce((a, b) => a + b, 0);
    const sumNum = ps.length, sumDen = ps.reduce((a, b) => a + b, 0);
    return mk({ gk: 'w1', q: T`Oblicz $$(${ps.join('\\cdot ')})\left(${ps.map(p => '\\frac1{' + p + '}').join('+')}\right)$$`, ans: String(v), tex: String(v),
      steps: [T`Nie licz najpierw nawiasu — wymnóż iloczyn przez każdy ułamek osobno (rozdzielność).`, T`$${P}\cdot\frac1p=\frac{${P}}{p}$: ${parts.map((x, i) => T`$\frac{${P}}{${ps[i]}}=${x}$`).join(', ')}.`, T`Suma: $${parts.join('+')}=${v}$.`],
      wrong: [[String(v - parts[parts.length - 1]), 'Pominięty ostatni składnik nawiasu.'], [qt(Q(P * sumNum, sumDen)), T`Ułamków nie dodaje się „licznik do licznika, mianownik do mianownika”: $\frac12+\frac13\neq\frac25$.`], [String(parts[0]), 'Pomnożono tylko przez pierwszy ułamek.'], [String(v + parts[0]), 'Pierwszy składnik policzony dwa razy.']] });
  }
  function w2(k, n) {
    const dec = { 2: '0{,}5', 4: '0{,}25', 5: '0{,}2', 8: '0{,}125' }[k], s = n % 2 ? -1 : 1;
    return mk({ gk: 'w2', q: T`Oblicz $(-${dec})^{${n}}\cdot${k}^{${n + 1}}$.`, ans: String(s * k), tex: String(s * k),
      steps: [T`$${dec}=\frac1{${k}}$, więc $(-${dec})^{${n}}\cdot${k}^{${n}}=\left(-\frac1{${k}}\cdot${k}\right)^{${n}}=(-1)^{${n}}=${s}$.`, T`Został jeszcze jeden czynnik: $${k}^{${n + 1}}=${k}^{${n}}\cdot${k}$.`, T`Wynik: $${s}\cdot${k}=${s * k}$.`],
      wrong: [[String(-s * k), T`Zły znak: $(-1)^{${n}}=${s}$, bo wykładnik jest ${n % 2 ? 'nieparzysty' : 'parzysty'}.`], [String(s), T`Zgubiony ostatni czynnik $${k}$: $${k}^{${n + 1}}=${k}^{${n}}\cdot${k}$.`], [String(s * k * k), T`Za dużo jednego czynnika $${k}$.`], [qt(Q(s, k)), 'Odwrócony wynik.']] });
  }
  function w3(ns) { // ns: liczby; pierwsze dwie dodawane jako ujemne, reszta odejmowane ujemne
    const [p1, p2, ...r] = ns, v = -p1 - p2 + r.reduce((a, b) => a + b, 0);
    const q = T`Oblicz $(-${p1})+(-${p2})${r.map(x => '-(-' + x + ')').join('')}$.`;
    return mk({ gk: 'w3', q, ans: String(v), tex: String(v),
      steps: [T`$-(-x)=+x$, więc wyrażenie to $-${p1}-${p2}${r.map(x => '+' + x).join('')}$.`, T`$-${p1 + p2}+${r.reduce((a, b) => a + b, 0)}=${v}$.`],
      wrong: [[String(-p1 - p2 - r.reduce((a, b) => a + b, 0)), T`$-(-x)$ to $+x$, a nie $-x$.`], [String(p1 + p2 + r.reduce((a, b) => a + b, 0)), T`$(-${p1})+(-${p2})$ to dodawanie liczb ujemnych — wynik jest ujemny.`], [String(v - 2 * r[r.length - 1]), 'Ostatni wyraz z błędnym znakiem.'], [String(-v), 'Odwrócony znak wyniku.']] });
  }
  function w4(a, b, d) {
    const v = Q(a * a + b * b, d * d);
    return mk({ gk: 'w4', q: T`Oblicz $\left(-\frac{${a}}{${d}}\right)^2+\left(\frac{${b}}{${d}}\right)^2$.`, ans: qs(v), tex: qt(v),
      steps: [T`Kwadrat usuwa minus: $\left(-\frac{${a}}{${d}}\right)^2=\frac{${a * a}}{${d * d}}$, $\left(\frac{${b}}{${d}}\right)^2=\frac{${b * b}}{${d * d}}$.`, T`Wspólny mianownik: $\frac{${a * a + b * b}}{${d * d}}${v[1] !== d * d ? '=' + qt(v) : ''}$.`],
      wrong: [[qt(Q(b * b - a * a, d * d)), T`Kwadrat liczby ujemnej jest dodatni: $(-x)^2=x^2$.`], [qt(Q((b - a) ** 2, d * d)), T`$x^2+y^2\neq(x+y)^2$ — nie wolno dodać przed podniesieniem do kwadratu.`], [qt(Q(a * a + b * b, d)), T`Mianownik też podnosimy do kwadratu: $\left(\frac pq\right)^2=\frac{p^2}{q^2}$.`], [qt(Q((a + b) ** 2, d * d)), T`$x^2+y^2\neq(x+y)^2$ — brakuje wyrazu $2xy$.`], [qt(Q(2 * (a * a + b * b), d * d)), 'Licznik policzony dwa razy.']] });
  }
  const w5 = () => mk({ gk: 'w5', field: txtField(), q: T`Jaki znak ma wyrażenie $$\left[\left(-\frac67\right)^7+\left(-\frac45\right)\cdot\left(-\frac49\right)\cdot\frac{16}{81}\right]\cdot\left(9\tfrac{246}{247}-0{,}666\right)?$$`,
    tex: T`\text{ujemny}`, steps: [T`Drugi nawias: $9\tfrac{246}{247}-0{,}666\approx9{,}33>0$ — nie zmienia znaku.`, T`$\left(-\frac67\right)^7<0$ (nieparzysta potęga), i to wcale nie mała liczba: $\left(\frac67\right)^7=\left(\frac{36}{49}\right)^3\cdot\frac67\approx0{,}34$.`, T`$\left(-\frac45\right)\left(-\frac49\right)\frac{16}{81}=\frac{256}{3645}\approx0{,}07$ — dodatnie, ale za małe.`, T`Pierwszy nawias $\approx-0{,}27<0$, więc całe wyrażenie jest <b>ujemne</b>.`],
    wrong: [[T`\text{dodatni}`, T`$\left(-\frac67\right)^7$ jest ujemne i większe co do modułu niż drugi składnik.`], [T`\text{równy }0`, 'Składniki nawiasu nie znoszą się: $-0{,}34+0{,}07\\neq0$.'], [T`\text{nie da się ustalić bez kalkulatora}`, T`Wystarczy oszacować: $\left(\frac67\right)^7>\left(\frac23\right)^7>0{,}05\cdot\ldots$ — szacowanie wystarcza.`]] });
  const maxItem = () => mk({ gk: 'max', field: txtField(), q: T`Które z pięciu wyrażeń zadania 1.2 ma największą wartość? (Wartości: $(1)=247$, $(2)=-8$, $(3)=242$, $(4)=\frac{538}{13}$, $(5)<0$.)`,
    tex: T`\text{wyrażenie }(1)`, steps: [T`$(1)=247$, $(3)=242$, $(4)=\frac{538}{13}\approx41{,}4$, $(2)=-8$, $(5)<0$.`, T`Największe jest $(1)=247$ — tylko o $5$ więcej niż $(3)$, więc trzeba liczyć dokładnie.`],
    wrong: [[T`\text{wyrażenie }(3)`, T`$242<247$ — różnica jest mała, ale jest.`], [T`\text{wyrażenie }(4)`, T`$\frac{538}{13}\approx41$, dużo mniej niż $247$.`], [T`\text{wyrażenie }(5)`, 'Wyrażenie (5) jest ujemne.']] });
  function gen12(gk) {
    if (gk === 'w2') return w2(R.pick([2, 4, 5, 8]), R.int(5, 11));
    if (gk === 'w3') { const m = R.pick([7, 9, 11, 13]); const k = R.shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 6).sort((a, b) => a - b); return w3(k.map(x => x * m)); }
    if (gk === 'w4') { let a, b, d; do { d = R.pick([7, 11, 13]); a = R.int(d + 1, 6 * d); b = R.int(d + 1, 6 * d); } while (a % d === 0 || b % d === 0); return w4(a, b, d); }
    if (gk === 'w5' || gk === 'max') return gk === 'w5' ? w5() : maxItem();
    return w1(R.shuffle(PR).slice(0, R.pick([3, 4])).sort((a, b) => a - b));
  }

  /* ---------- 1.3 ---------- */
  function e13(a, k) {
    const A1 = BigInt(a), p = 10n ** BigInt(k), v = A1 * p - A1, nn = '9'.repeat(k);
    const noBorrow = BigInt(String(a) + String(p - A1).padStart(k, '0'));
    return mk({ q: T`Oblicz $${a}\cdot${nn}$.`, ans: String(v), tex: big(v),
      steps: [T`$${nn}=10^{${k}}-1$, więc $${a}\cdot${nn}=${a}\cdot10^{${k}}-${a}$.`, T`$${a}\cdot10^{${k}}=${big(A1 * p)}$ (dopisujemy ${k} zer).`, T`Odejmujemy pisemnie: $${big(A1 * p)}-${a}=${big(v)}$. Uwaga na pożyczkę z cyfry jedności liczby $${a}$.`],
      wrong: [[big(noBorrow), T`Zapomniana pożyczka: ostatnie cyfry są dobre, ale przednia część to $${a}-1$, nie $${a}$.`], [big(A1 * p + A1), T`$${nn}=10^{${k}}-1$, więc $${a}$ odejmujemy, a nie dodajemy.`], [big(A1 * p - 1n), T`Odejmujemy $${a}\cdot1=${a}$, a nie $1$.`]] });
  }
  const gen13 = () => { const k = R.int(4, 7); const digs = R.pick(['123456789', '987654321', '135792468', '246813579']).slice(0, k); return e13(+digs, k); };

  /* ---------- 1.4 ---------- */
  function e14(n) {
    return mk({ q: T`Oblicz $$\frac{${n}}{(-${n})^2+(-${n - 1})\cdot${n + 1}}$$`, ans: String(n), tex: String(n),
      steps: [T`Podstaw $n=${n}$: mianownik to $(-n)^2+(-(n-1))(n+1)=n^2-(n-1)(n+1)$.`, T`$(n-1)(n+1)=n^2-1$ (różnica kwadratów), więc mianownik $=n^2-(n^2-1)=1$.`, T`Wynik: $\frac{${n}}{1}=${n}$.`],
      wrong: [[T`\frac{${n}}{${2 * n * n - 1}}`, T`$(-${n - 1})\cdot${n + 1}$ jest ujemne — minus zmienia $+(n^2-1)$ na $-(n^2-1)$.`], [String(-n), T`Mianownik to $+1$: $n^2-(n^2-1)=1$, a nie $-1$.`], [T`\frac1{${n}}`, 'Odwrócony ułamek.']] });
  }
  const gen14 = () => { const d = R.pick([13579, 24680, 11111, 98765, 54321, 20262]); return e14(d + R.int(-50, 50)); };

  /* ---------- 1.5 ---------- */
  function e15(a, b, note) {
    return mk({ q: T`Oblicz $$\frac{${a}^3+${b}^3}{${a}\cdot${a - b}+${b}^2}$$`, ans: String(a + b), tex: String(a + b),
      steps: [...(note ? [note] : []), T`Zauważ: $${a - b}=${a}-${b}$, więc mianownik to $${a}^2-${a}\cdot${b}+${b}^2$.`, T`Licznik: $${a}^3+${b}^3=(${a}+${b})(${a}^2-${a}\cdot${b}+${b}^2)$.`, T`Nawias się skraca: wynik to $${a}+${b}=${a + b}$.`],
      wrong: [[String(a - b), T`Pomylony wzór: $a^3+b^3=(a+b)(a^2-ab+b^2)$ — w pierwszym nawiasie jest plus.`], [String(a * a - a * b + b * b), 'To sam mianownik — nie podzielono.'], [String((a + b) ** 2), T`Licznik to $(a+b)\cdot(\ldots)$, a nie $(a+b)^2\cdot(\ldots)$.`]] });
  }
  const gen15 = () => { const b = R.int(7, 29), a = b + R.int(20, 80); return e15(a, b); };

  /* ---------- 1.6 ---------- */
  function e16(a, b) {
    const num = [a, a + 2, a + 4], den = [a + 1, a + 3, a + 5];
    const t = n => T`(${n}\cdot${n + 3}+2)`;
    const v = (a + 1) * (b + 2);
    return mk({ q: T`Oblicz $$\frac{${num.map(t).join('')}\cdots${t(b)}}{${den.map(t).join('')}\cdots${t(b - 1)}}$$`, ans: String(v), tex: String(v),
      steps: [T`Każdy czynnik ma postać $n(n+3)+2=n^2+3n+2=(n+1)(n+2)$.`, T`Licznik ($n=${a},${a + 2},\ldots,${b}$): $${a + 1}\cdot${a + 2}\cdot${a + 3}\cdot${a + 4}\cdots${b + 1}\cdot${b + 2}$ — kolejne liczby od $${a + 1}$ do $${b + 2}$.`, T`Mianownik ($n=${a + 1},\ldots,${b - 1}$): kolejne liczby od $${a + 2}$ do $${b + 1}$.`, T`Po skróceniu zostaje $${a + 1}\cdot${b + 2}=${v}$.`],
      wrong: [[String(b + 2), T`Zgubiony czynnik $${a + 1}$ z początku licznika.`], [String(a + 1), T`Zgubiony czynnik $${b + 2}$ z końca licznika.`], [T`\frac1{${v}}`, 'Odwrócony wynik: więcej czynników jest w liczniku.']] });
  }
  const gen16 = () => { const a = R.pick([2, 4, 6, 8]); return e16(a, a + 2 * R.int(15, 60)); };

  /* ---------- 1.7 ---------- */
  function e17(n) {
    return mk({ q: T`Oblicz $$\frac{${n}^2}{${n - 1}^2+${n + 1}^2-2}$$`, ans: '1/2', tex: T`\frac12`,
      steps: [T`Oznacz $n=${n}$. Mianownik: $(n-1)^2+(n+1)^2-2$.`, T`$(n-1)^2+(n+1)^2=n^2-2n+1+n^2+2n+1=2n^2+2$.`, T`Mianownik $=2n^2$, więc ułamek to $\frac{n^2}{2n^2}=\frac12$.`],
      wrong: [['2', 'Odwrócony ułamek.'], ['1', T`$(n-1)^2+(n+1)^2=2n^2+2$, a nie $n^2+2$.`], [T`\frac14`, T`Mianownik to $2n^2$, nie $4n^2$.`]] });
  }
  const gen17 = () => e17(R.pick([20092008, 12345678, 20262027, 31415926, 99999999 - R.int(1, 50000)]));

  /* ---------- 1.8, 1.9, 1.15, 1.16 — sumy teleskopowe ---------- */
  function e18(c, m) {
    const v = qsub(Q(c), Q(m, m + 1)), dens = Array.from({ length: m }, (_, k) => (k + 1) * (k + 2));
    return mk({ q: T`Oblicz $$${wrapSum([String(c), ...dens.map(d => '-\\frac1{' + d + '}')], 5)}$$`, ans: qs(v), tex: qt(v),
      steps: [T`Mianowniki to $1\cdot2,\ 2\cdot3,\ 3\cdot4,\ldots,${m}\cdot${m + 1}$, a $\frac1{k(k+1)}=\frac1k-\frac1{k+1}$.`, T`Suma odejmowanych ułamków: $\left(1-\frac12\right)+\left(\frac12-\frac13\right)+\ldots+\left(\frac1{${m}}-\frac1{${m + 1}}\right)=1-\frac1{${m + 1}}=\frac{${m}}{${m + 1}}$.`, T`Wynik: $${c}-\frac{${m}}{${m + 1}}=${qt(v)}$.`],
      wrong: [[qt(qsub(Q(c), Q(1, m + 1))), T`Odjęto tylko ostatni ułamek; teleskop daje $1-\frac1{${m + 1}}$, a to odejmujemy od $${c}$.`], [qt(qsub(Q(c), Q(m + 1, m + 2))), 'Przesunięcie o jeden: ostatni mianownik to $' + m + '\\cdot' + (m + 1) + '$.'], [qt(Q(m, m + 1)), T`To sama suma ułamków — trzeba ją jeszcze odjąć od $${c}$.`], [qt(qsub(Q(c), Q(m - 1, m))), T`Ułamków jest $${m}$ — teleskop kończy się na $\frac1{${m + 1}}$.`], [qt(qadd(Q(c), Q(m, m + 1))), 'Ułamki odejmujemy, a nie dodajemy.']] });
  }
  const gen18 = () => e18(R.int(1, 5), R.int(4, 11));
  function e19(m) {
    const v = Q(m, 2 * m + 1), dens = Array.from({ length: m }, (_, k) => (2 * k + 1) * (2 * k + 3));
    return mk({ q: T`Oblicz $$${wrapSum(dens.map((d, i) => (i ? '+' : '') + '\\frac1{' + d + '}'), 4)}$$`, ans: qs(v), tex: qt(v),
      steps: [T`Mianowniki to iloczyny kolejnych liczb nieparzystych: $1\cdot3,\ 3\cdot5,\ldots,${2 * m - 1}\cdot${2 * m + 1}$.`, T`$\frac1{(2k-1)(2k+1)}=\frac12\left(\frac1{2k-1}-\frac1{2k+1}\right)$.`, T`Suma $=\frac12\left(1-\frac1{${2 * m + 1}}\right)=\frac12\cdot\frac{${2 * m}}{${2 * m + 1}}=${qt(v)}$.`],
      wrong: [[qt(Q(2 * m, 2 * m + 1)), T`Zgubione $\frac12$: $\frac1{2k-1}-\frac1{2k+1}=\frac{2}{(2k-1)(2k+1)}$.`], [qt(Q(m, 2 * m - 1)), 'Ostatni mianownik źle wyznaczony.'], [qt(qmul(Q(1, 2), qsub(Q(1, 2), Q(1, 2 * m + 1)))), T`Teleskop zaczyna się od $\frac11$, a nie od $\frac12$.`]] });
  }
  const gen19 = () => e19(R.int(4, 9));
  function eTel(gk, a, d, n) { // 1/(x(x+d)) od x=a, n wyrazów
    const last = a + n * d, v = qmul(Q(1, d), qsub(Q(1, a), Q(1, last)));
    const terms = Array.from({ length: n }, (_, k) => [a + k * d, a + (k + 1) * d]);
    const show = gk === 'odd' ? terms.map(([x, y]) => T`\frac1{${x}\cdot${y}}`) : terms.map(([x, y]) => T`\frac1{${x * y}}`);
    const steps = [
      ...(gk === 'odd' ? [] : [T`Rozłóż mianowniki: $${terms.map(([x, y]) => x * y + '=' + x + '\\cdot' + y).join(',\\ ')}$ — czynniki rosną co $${d}$.`]),
      T`$\frac1{x(x+${d})}=\frac1{${d}}\left(\frac1x-\frac1{x+${d}}\right)$.`,
      T`Teleskop: $\frac1{${d}}\left(\frac1{${a}}-\frac1{${last}}\right)=\frac1{${d}}\cdot${qt(qsub(Q(1, a), Q(1, last)))}=${qt(v)}$.`];
    return mk({ gk, q: T`Oblicz $$${wrapSum(show.map((x, i) => (i ? '+' : '') + x), 3)}$$`, ans: qs(v), tex: qt(v), steps,
      wrong: [[qt(qsub(Q(1, a), Q(1, last))), T`Zgubiony czynnik $\frac1{${d}}$: $\frac1x-\frac1{x+${d}}=\frac{${d}}{x(x+${d})}$.`], [qt(qmul(Q(1, d), qsub(Q(1, a), Q(1, last - d)))), T`Ostatni ułamek rozkłada się do $\frac1{${last}}$, a nie $\frac1{${last - d}}$.`], [qt(qmul(Q(1, d + 1), qsub(Q(1, a), Q(1, last)))), T`Różnica czynników to $${d}$, więc dzielimy przez $${d}$.`], [qt(Q(n, a * last)), 'Teleskopu nie da się zastąpić mnożeniem liczby wyrazów.']] });
  }
  const gen115 = () => eTel('odd', R.pick([1, 3, 5, 7, 9]), 2, R.int(4, 7));
  const gen116 = () => eTel('step', R.int(1, 4), R.pick([3, 4, 5]), R.int(4, 6));

  /* ---------- 1.10 ---------- */
  function e110(rel) {
    const cond = { '<': 'ab<0', '>': 'ab>0' }[rel];
    const res = rel === '<' ? '(a-b)^2>(a+b)^2' : '(a-b)^2<(a+b)^2';
    return mk({ field: txtField(), q: T`Jeśli $${cond}$, ustal relację między $(a-b)^2$ oraz $(a+b)^2$.`, tex: res,
      steps: [T`Porównujemy przez różnicę: $(a-b)^2-(a+b)^2=(a^2-2ab+b^2)-(a^2+2ab+b^2)=-4ab$.`, rel === '<' ? T`$ab<0$, więc $-4ab>0$: różnica dodatnia.` : T`$ab>0$, więc $-4ab<0$: różnica ujemna.`, T`Zatem $${res}$.`],
      wrong: [[rel === '<' ? '(a-b)^2<(a+b)^2' : '(a-b)^2>(a+b)^2', T`Różnica to $-4ab$, a znak $ab$ jest dany — sprawdź znak $-4ab$.`], ['(a-b)^2=(a+b)^2', T`Równość byłaby tylko dla $ab=0$.`], [T`\text{zależy od }a\text{ i }b`, T`Znak różnicy $-4ab$ zależy tylko od znaku $ab$, a ten znamy.`]] });
  }
  const gen110 = () => e110(R.pick(['<', '>']));

  /* ---------- 1.11 ---------- */
  const NAMES = [['a^3', a => a ** 3], ['-a^3', a => -(a ** 3)], ['a^4', a => a ** 4], ['-a^4', a => -(a ** 4)], [T`\frac1a`, a => 1 / a], [T`-\frac1a`, a => -1 / a]];
  function e111(iv) {
    const [lo, hi, rep, ivt] = { neg: [-1, 0, -0.5, T`-1<a<0`], pos: [0, 1, 0.5, T`0<a<1`], big: [1, null, 2, T`a>1`], low: [null, -1, -2, T`a<-1`] }[iv];
    const ord = NAMES.slice().sort((x, y) => x[1](rep) - y[1](rep)).map(x => x[0]);
    const chain = o => o.join('<');
    const val = n => A.niceReal(NAMES.find(x => x[0] === n)[1](rep));
    const sw = (o, i) => { const c = o.slice(); [c[i], c[i + 1]] = [c[i + 1], c[i]]; return c; };
    const why1 = i => T`Zamienione $${ord[i]}$ i $${ord[i + 1]}$: dla $a=${A.niceReal(rep)}$ mamy $${ord[i]}=${val(ord[i])}<${val(ord[i + 1])}=${ord[i + 1]}$.`;
    const [i1, i2] = R.shuffle([0, 1, 2, 3, 4]).filter((x, k, arr) => k === 0 || Math.abs(x - arr[0]) > 1).slice(0, 2);
    const opp = NAMES.slice().sort((x, y) => x[1](-rep) - y[1](-rep)).map(x => x[0]);
    const wrong = R.shuffle([
      [chain(sw(ord, i1)), why1(i1)],
      [chain(sw(sw(ord, i1), i2)), why1(i1) + ' ' + T`Do tego zamienione $${ord[i2]}$ i $${ord[i2 + 1]}$.`],
      [chain(opp), T`To kolejność dla $a=${A.niceReal(-rep)}$ — liczba $a$ ma tu przeciwny znak. Sprawdź na przykładzie $a=${A.niceReal(rep)}$.`],
      [chain(ord.slice().reverse()), 'To kolejność od największej do najmniejszej — odwrotnie niż w poleceniu.']]);
    const vals = NAMES.map(([n, f]) => T`$${n}=${A.niceReal(f(rep))}$`).join(', ');
    return mk({ field: txtField(), gk: iv, q: T`Jeśli $${ivt}$, uporządkuj od najmniejszej do największej: $$a^3,\quad -a^3,\quad a^4,\quad -a^4,\quad \frac1a,\quad -\frac1a$$`, tex: chain(ord),
      steps: [T`Zawsze można sprawdzić na przykładzie: weź $a=${A.niceReal(rep)}$. Wtedy ${vals}.`, Math.abs(rep) < 1 ? T`Ogólnie: dla $0<|a|<1$ mamy $|a|^4<|a|^3<1<\frac1{|a|}$ — wyższa potęga jest mniejsza co do modułu.` : T`Ogólnie: dla $|a|>1$ mamy $\frac1{|a|}<1<|a|^3<|a|^4$.`, T`Znaki: $a^4>0$, $-a^4<0$, a $a^3$ i $\frac1a$ mają znak liczby $a$.`, T`Kolejność: $${chain(ord)}$.`],
      wrong });
  }
  const gen111 = () => e111(R.pick(['neg', 'pos', 'big', 'low']));

  /* ---------- 1.12 ---------- */
  function e112(c, m) {
    const S = m % 2 ? -1 : 0, v = c - S;
    const ct = c < 0 ? String(c) : String(c);
    return mk({ q: T`Oblicz $$${ct}-(-1)^1-(-1)^2-(-1)^3-\ldots-(-1)^{${m}}$$`, ans: String(v), tex: String(v),
      steps: [T`Odejmujemy sumę $S=(-1)^1+(-1)^2+\ldots+(-1)^{${m}}$.`, T`Kolejne pary $(-1)^{2k-1}+(-1)^{2k}=-1+1=0$. ${m % 2 ? T`Wyrazów jest $${m}$ (nieparzyście), więc zostaje ostatni: $(-1)^{${m}}=-1$, czyli $S=-1$.` : T`Wyrazów jest $${m}$ — same pełne pary, więc $S=0$.`}`, T`Wynik: $${ct}-${par(String(S))}=${v}$.`],
      wrong: [[String(c + S), T`Odejmujemy $S$, więc $-(${S})$ zmienia znak.`], [String(c - (S === 0 ? -1 : 0)), T`Policz pary: wyrazów jest $${m}$, ${m % 2 ? 'zostaje jeden bez pary' : 'wszystkie są w parach'}.`], [String(-v), 'Zły znak wyniku.'], [String(c - m), T`$(-1)^k$ to $\pm1$ na zmianę, a nie zawsze $1$.`]] });
  }
  const gen112 = () => e112(R.pick([-3, -2, -1, 1, 2, 3]), R.int(40, 120));

  /* ---------- 1.13 ---------- */
  function e113(a, b, k) {
    const rb = T`${b}${b}`, ra = T`${a}${a}`, B2 = b + k, v = (a * b - B2 * a) * 10001;
    return mk({ q: T`Oblicz $${a}\cdot${rb}-${B2}\cdot${ra}$.`, ans: String(v), tex: big(v),
      steps: [T`$${rb}=${b}\cdot10001$ oraz $${ra}=${a}\cdot10001$.`, T`Wyrażenie: $${a}\cdot${b}\cdot10001-${B2}\cdot${a}\cdot10001=${a}\cdot10001\cdot(${b}-${B2})$.`, k === 0 ? 'Nawias jest zerem, więc wynik to $0$.' : T`$=${a}\cdot10001\cdot(${-k})=${big(v)}$.`],
      wrong: k === 0 ? [['10001', 'Wspólny czynnik $10001$ mnoży się przez zero w nawiasie.'], [big(a * b), 'Iloczyny są równe i się odejmują.'], ['1', 'Iloczyny się zerują — nie zostaje nic.']] : [[big(-v), 'Zły znak: odejmujemy większy iloczyn.'], [big(-k * a), T`Zgubiony czynnik $10001$.`], ['0', T`Czynniki nie są takie same: $${b}\neq${B2}$.`]] });
  }
  const gen113 = () => { const a = R.int(1900, 2099), b = R.int(1900, 2099); return e113(a, b, R.pick([0, 0, 1, -1, 2])); };

  /* ---------- 1.14 ---------- */
  function e114(N, m) {
    const v = Q(N, m);
    return mk({ q: T`Od liczby $${N}$ odejmujemy najpierw jej połowę, następnie $\frac13$ pozostałej części, potem $\frac14$ nowej pozostałej części i tak dalej, aż odejmiemy $\frac1{${m}}$ ostatniej pozostałej części. Jaka liczba zostanie?`, ans: qs(v), tex: qt(v),
      steps: [T`Odjęcie $\frac1k$ reszty zostawia $\left(1-\frac1k\right)=\frac{k-1}{k}$ tej reszty.`, T`Zostaje $${N}\cdot\frac12\cdot\frac23\cdot\frac34\cdots\frac{${m - 1}}{${m}}$.`, T`Iloczyn się teleskopuje: $\frac12\cdot\frac23\cdots\frac{${m - 1}}{${m}}=\frac1{${m}}$.`, T`Wynik: $\frac{${N}}{${m}}=${qt(v)}$.`],
      wrong: [[qt(Q(N, m + 1)), 'Przesunięcie o jeden: ostatni czynnik to $\\frac{' + (m - 1) + '}{' + m + '}$.'], [qt(Q(N, 2)), 'Odjęto tylko połowę — kolejne kroki też zmniejszają resztę.'], ['0', 'Za każdym razem odejmujemy tylko część reszty, więc coś zawsze zostaje.']] });
  }
  const gen114 = () => { const m = R.int(9, 60); return e114(m * R.int(1, 9), m); };

  /* ---------- 1.17 ---------- */
  function e117(N) {
    const v = qsub(Q(1, N), Q(1, 2));
    return mk({ q: T`Oblicz $$\begin{aligned}&\left(\tfrac13+\ldots+\tfrac1{${N}}\right)\left(1+\tfrac12+\ldots+\tfrac1{${N - 1}}\right)\\-&\left(1+\tfrac13+\ldots+\tfrac1{${N}}\right)\left(\tfrac12+\tfrac13+\ldots+\tfrac1{${N - 1}}\right)\end{aligned}$$`, ans: qs(v), tex: qt(v),
      steps: [T`Oznacz $S=\frac13+\frac14+\ldots+\frac1{${N - 1}}$ i $c=\frac1{${N}}$.`, T`Wyrażenie: $(S+c)\left(\frac32+S\right)-(1+S+c)\left(\frac12+S\right)$.`, T`Pierwszy iloczyn: $S^2+\frac32S+cS+\frac32c$. Drugi: $S^2+\frac32S+cS+\frac12+\frac12c$.`, T`Różnica: $\frac32c-\frac12c-\frac12=c-\frac12=\frac1{${N}}-\frac12=${qt(v)}$.`],
      wrong: [[qt(Q(-v[0], v[1])), 'Zły znak — sprawdź, który iloczyn ma dodatkowe $\\frac12$.'], [qt(Q(1, N)), T`Zgubione $-\frac12$ z drugiego iloczynu.`], [T`-\frac12`, T`Zgubione $c=\frac1{${N}}$.`]] });
  }
  const gen117 = () => e117(R.int(20, 3000));

  /* ---------- 1.18 ---------- */
  function e118(N) {
    const v = Q(N - 1, N + 1);
    const show = [2, 3].map(k => T`\frac1{${Array.from({ length: k }, (_, j) => j + 1).join('+')}}`).join('+');
    return mk({ q: T`Oblicz $$${show}+\ldots+\frac1{1+2+\ldots+${N}}$$`, ans: qs(v), tex: qt(v),
      steps: [T`$1+2+\ldots+k=\frac{k(k+1)}2$, więc $\frac1{1+\ldots+k}=\frac2{k(k+1)}=2\left(\frac1k-\frac1{k+1}\right)$.`, T`Sumujemy od $k=2$ do $k=${N}$: $2\left(\frac12-\frac1{${N + 1}}\right)$.`, T`$=1-\frac2{${N + 1}}=${qt(v)}$.`],
      wrong: [[qt(Q(2 * N, N + 1)), T`Suma zaczyna się od $k=2$ ($\frac1{1+2}$), nie od $k=1$.`], [qt(qsub(Q(1, 2), Q(1, N + 1))), T`Zgubiony czynnik $2$: $\frac1{1+\ldots+k}=\frac{2}{k(k+1)}$.`], [qt(qmul(Q(2), qsub(Q(1, 2), Q(1, N)))), T`Ostatni wyraz to $\frac1{${N}}-\frac1{${N + 1}}$.`]] });
  }
  const gen118 = () => e118(R.int(10, 99));

  /* ---------- 1.19 ---------- */
  const e119gen = () => mk({ gk: 'gen', vars: ['n'], q: T`Niech $n$ będzie dodatnią liczbą całkowitą. Znajdź wartość sumy $$\begin{aligned}&1+\left(\frac12+\frac22+\frac12\right)\\&+\left(\frac13+\frac23+\frac33+\frac23+\frac13\right)\\&+\ldots+\left(\frac1n+\ldots+\frac nn+\ldots+\frac1n\right)\end{aligned}$$`, ans: 'n(n+1)/2', tex: T`\frac{n(n+1)}{2}`,
    steps: [T`Grupa dla $k$: $\frac{1+2+\ldots+k+\ldots+2+1}{k}$.`, T`Licznik: $(1+\ldots+k)+(1+\ldots+(k-1))=\frac{k(k+1)}2+\frac{(k-1)k}2=k^2$.`, T`Grupa $=\frac{k^2}{k}=k$. Suma wszystkich grup: $1+2+\ldots+n=\frac{n(n+1)}2$.`],
    wrong: [['n^2', T`Każda grupa daje $k$, a nie wszystkie $n$.`], ['n(n+1)', T`$1+2+\ldots+n=\frac{n(n+1)}{2}$ — zgubiona dwójka.`], [T`\frac{n^2+1}{2}`, T`Licznik grupy to $k^2$, więc grupa to $k$.`]] });
  function e119(n) {
    const v = n * (n + 1) / 2;
    return mk({ gk: 'num', q: T`Oblicz $$\begin{aligned}&1+\left(\frac12+\frac22+\frac12\right)\\&+\left(\frac13+\frac23+\frac33+\frac23+\frac13\right)\\&+\ldots+\left(\frac1{${n}}+\ldots+\frac{${n}}{${n}}+\ldots+\frac1{${n}}\right)\end{aligned}$$`, ans: String(v), tex: String(v),
      steps: [T`Grupa dla $k$: $\frac{1+2+\ldots+k+\ldots+2+1}{k}=\frac{k^2}{k}=k$.`, T`Suma: $1+2+\ldots+${n}=\frac{${n}\cdot${n + 1}}2=${v}$.`],
      wrong: [[String(n * n), T`Każda grupa daje $k$, a nie $${n}$.`], [String(2 * v), 'Zgubiona dwójka we wzorze na sumę.'], [String(v - n), 'Pominięta ostatnia grupa.']] });
  }
  const gen119 = gk => (gk === 'gen' ? e119gen() : e119(R.int(8, 60)));

  /* ---------- 1.20 ---------- */
  function e120(n) {
    const odd = n % 2 === 1, v = odd ? n * (n + 1) / 2 : -n * (n + 1) / 2;
    return mk({ q: T`Oblicz $$1^2-2^2+3^2-4^2+\ldots${odd ? T`-${n - 1}^2+${n}^2` : T`+${n - 1}^2-${n}^2`}$$`, ans: String(v), tex: big(v),
      steps: odd ? [T`Grupujemy: $1^2+(3^2-2^2)+(5^2-4^2)+\ldots+(${n}^2-${n - 1}^2)$.`, T`$(k+1)^2-k^2=(k+1)+k$ — różnica kwadratów kolejnych liczb to ich suma.`, T`Zatem całość to $1+2+3+\ldots+${n}=\frac{${n}\cdot${n + 1}}2=${big(v)}$.`]
        : [T`Grupujemy: $(1^2-2^2)+(3^2-4^2)+\ldots+(${n - 1}^2-${n}^2)$.`, T`$k^2-(k+1)^2=-(k+(k+1))$.`, T`Zatem całość to $-(1+2+\ldots+${n})=-\frac{${n}\cdot${n + 1}}2=${big(v)}$.`],
      wrong: [[big(-v), 'Zły znak — sprawdź, czy ostatni wyraz jest dodawany, czy odejmowany.'], [big(odd ? (n - 1) * n / 2 : -(n - 1) * n / 2), T`Suma kończy się na $${n}$, nie na $${n - 1}$.`], [big(n * n), 'To tylko ostatni wyraz.']] });
  }
  const gen120 = () => e120(R.int(50, 2999));

  /* ---------- 1.21 ---------- */
  function e121(m) {
    const ones = Number('1'.repeat(m) + '0'), sub = m * (19 - m) / 2, v = 2 * ones - sub;
    const terms = wrapSum(Array.from({ length: m }, (_, k) => (k ? '+' : '') + '1' + '9'.repeat(k) + String(k + 1)), 3);
    return mk({ q: T`Znajdź sumę $$${terms}$$`, ans: String(v), tex: big(v),
      steps: [T`Każdy wyraz to $2\cdot10^k$ minus coś małego: $11=20-9$, $192=200-8$, $1993=2000-7$, …`, T`Suma $=2\cdot(10+100+\ldots+10^{${m}})-(9+8+\ldots+${10 - m})=2\cdot${big(ones)}-${sub}$.`, T`$=${big(2 * ones)}-${sub}=${big(v)}$.`],
      wrong: [[big(2 * ones), 'Zapomniano odjąć poprawki $9+8+\\ldots$.'], [big(2 * ones + sub), 'Poprawki trzeba odjąć, nie dodać.'], [big(ones - sub), T`Każdy wyraz jest bliski $2\cdot10^k$, a nie $10^k$.`]] });
  }
  const gen121 = () => e121(R.int(4, 8));

  /* ---------- 1.22 ---------- */
  function e122(N) {
    const cnt = (N - 1) / 2, v = qadd(Q(cnt), qsub(Q(1, 2), Q(1, N + 1)));
    return mk({ q: T`Oblicz $$\frac{3^2+1}{3^2-1}+\frac{5^2+1}{5^2-1}+\frac{7^2+1}{7^2-1}+\ldots+\frac{${N}^2+1}{${N}^2-1}$$`, ans: qs(v), tex: qt(v),
      steps: [T`$\frac{n^2+1}{n^2-1}=1+\frac{2}{n^2-1}=1+\frac1{n-1}-\frac1{n+1}$.`, T`Jedynek jest tyle, ile wyrazów: $n=3,5,\ldots,${N}$ to $${cnt}$ wyrazów.`, T`Teleskop: $\left(\frac12-\frac14\right)+\left(\frac14-\frac16\right)+\ldots+\left(\frac1{${N - 1}}-\frac1{${N + 1}}\right)=\frac12-\frac1{${N + 1}}$.`, T`Razem: $${cnt}+${qt(qsub(Q(1, 2), Q(1, N + 1)))}=${qt(v)}$.`],
      wrong: [[String(cnt), T`Zgubiona część ułamkowa $\frac2{n^2-1}$.`], [qt(qadd(Q(cnt), Q(1, 2))), T`Teleskop kończy się na $-\frac1{${N + 1}}$.`], [qt(qadd(Q(cnt), qmul(Q(1, 2), qsub(Q(1, 2), Q(1, N + 1))))), T`$\frac{2}{n^2-1}=\frac1{n-1}-\frac1{n+1}$ — bez dodatkowego $\frac12$.`]] });
  }
  const gen122 = () => e122(2 * R.int(10, 80) + 1);

  /* ---------- 1.23 ---------- */
  function e123(N, gk) {
    const TN = N * (N + 1) / 2;
    const core = T`\begin{aligned}&1-\frac{2}{1\cdot(1+2)}-\frac{3}{(1+2)(1+2+3)}\\&-\ldots-\frac{${N}}{(1+\ldots+${N - 1})(1+\ldots+${N})}\end{aligned}`;
    const base = [T`Oznacz $T_k=1+2+\ldots+k$. Wtedy $T_k-T_{k-1}=k$.`, T`$\frac{k}{T_{k-1}T_k}=\frac{T_k-T_{k-1}}{T_{k-1}T_k}=\frac1{T_{k-1}}-\frac1{T_k}$.`, T`Suma odejmowanych ułamków: $\frac1{T_1}-\frac1{T_{${N}}}=1-\frac1{${TN}}$, więc wyrażenie $=\frac1{${TN}}$ (bo $T_{${N}}=\frac{${N}\cdot${N + 1}}2=${TN}$).`];
    if (gk === 'diff') return mk({ gk, q: T`Wyrażenie $$${core}$$ po uproszczeniu jest ułamkiem nieskracalnym. Znajdź różnicę między jego mianownikiem a licznikiem.`, ans: String(TN - 1), tex: String(TN - 1),
      steps: [...base, T`Różnica: $${TN}-1=${TN - 1}$.`], wrong: [[String(TN), 'To sam mianownik — trzeba odjąć licznik $1$.'], [String(TN + 1), 'Licznik odejmujemy, a nie dodajemy.'], [String(N * (N - 1) / 2 - 1), T`Ostatnia suma to $1+\ldots+${N}$, nie $1+\ldots+${N - 1}$.`]] });
    return mk({ gk: 'val', q: T`Oblicz $$${core}$$`, ans: '1/' + TN, tex: T`\frac1{${TN}}`, steps: base,
      wrong: [[T`\frac{${TN - 1}}{${TN}}`, T`To suma odejmowanych ułamków — trzeba ją jeszcze odjąć od $1$.`], [T`\frac1{${(N + 1) * (N + 2) / 2}}`, T`Ostatnie $T$ to $T_{${N}}=${TN}$.`], [T`\frac1{${N}}`, T`$T_{${N}}=1+\ldots+${N}$, a nie $${N}$.`]] });
  }
  const gen123 = gk => e123(R.int(10, 150), gk === 'diff' ? 'diff' : 'val');

  /* ---------- 1.24 ---------- */
  function e124(N) {
    const v = qmul(Q(1, 2), qsub(Q(1, 2), Q(1, (N + 1) * (N + 2))));
    return mk({ q: T`Oblicz $$\frac1{1\cdot2\cdot3}+\frac1{2\cdot3\cdot4}+\ldots+\frac1{${N}\cdot${N + 1}\cdot${N + 2}}$$`, ans: qs(v), tex: qt(v),
      steps: [T`$\frac1{k(k+1)(k+2)}=\frac12\left(\frac1{k(k+1)}-\frac1{(k+1)(k+2)}\right)$.`, T`Teleskop: $\frac12\left(\frac1{1\cdot2}-\frac1{${N + 1}\cdot${N + 2}}\right)=\frac12\left(\frac12-\frac1{${(N + 1) * (N + 2)}}\right)$.`, T`$=${qt(v)}$.`],
      wrong: [[qt(qsub(Q(1, 2), Q(1, (N + 1) * (N + 2)))), T`Zgubione $\frac12$ z rozkładu.`], [qt(qmul(Q(1, 2), qsub(Q(1, 2), Q(1, N * (N + 1))))), T`Ostatni wyraz rozkładu to $\frac1{(N+1)(N+2)}$.`], [T`\frac14`, 'To granica dla nieskończenie wielu wyrazów — tu wyrazów jest skończenie wiele.']] });
  }
  const gen124 = () => e124(R.int(10, 120));

  /* ---------- 1.25 ---------- */
  function e125(N) {
    const D = N * N + N + 1, v = qmul(Q(1, 2), qsub(Q(1), Q(1, D)));
    return mk({ q: T`Znajdź sumę $$\frac{1}{1+1^2+1^4}+\frac{2}{1+2^2+2^4}+\ldots+\frac{${N}}{1+${N}^2+${N}^4}$$`, ans: qs(v), tex: qt(v),
      steps: [T`$1+k^2+k^4=(k^2-k+1)(k^2+k+1)$ (bo $k^4+2k^2+1-k^2=(k^2+1)^2-k^2$).`, T`Różnica nawiasów to $2k$, więc $\frac{k}{(k^2-k+1)(k^2+k+1)}=\frac12\left(\frac1{k^2-k+1}-\frac1{k^2+k+1}\right)$.`, T`$k^2+k+1$ dla $k$ to $k^2-k+1$ dla $k+1$ — teleskop: $\frac12\left(1-\frac1{${D}}\right)=${qt(v)}$.`],
      wrong: [[qt(qsub(Q(1), Q(1, D))), T`Zgubione $\frac12$: różnica nawiasów to $2k$, nie $k$.`], [qt(qmul(Q(1, 2), qsub(Q(1), Q(1, N * N - N + 1)))), T`Teleskop kończy się na $\frac1{${N}^2+${N}+1}$.`], [T`\frac12`, 'Ostatni ułamek teleskopu nie znika.']] });
  }
  const gen125 = () => e125(R.int(10, 90));

  /* ---------- 1.26 ---------- */
  function e126(a, note) {
    const n = 2 * a - 1, term = k => T`\frac{${k}^2}{${k}^2-${2 * a * k}+${2 * a * a}}`;
    return mk({ q: T`Oblicz $$${term(1)}+${term(2)}+\ldots+${term(n)}$$`, ans: String(n), tex: String(n),
      steps: [...(note ? [note] : []), T`$f(k)=\frac{k^2}{k^2-${2 * a}k+${2 * a * a}}$. Po zamianie $k\to${2 * a}-k$ mianownik się nie zmienia: $(${2 * a}-k)^2-${2 * a}(${2 * a}-k)+${2 * a * a}=k^2-${2 * a}k+${2 * a * a}$.`, T`$f(k)+f(${2 * a}-k)=\frac{k^2+(${2 * a}-k)^2}{k^2-${2 * a}k+${2 * a * a}}=\frac{2(k^2-${2 * a}k+${2 * a * a})}{k^2-${2 * a}k+${2 * a * a}}=2$.`, T`Pary $(1,${n}),(2,${n - 1}),\ldots$: $${a - 1}$ par po $2$, plus środkowy $f(${a})=\frac{${a * a}}{${a * a}}=1$. Razem $${2 * (a - 1)}+1=${n}$.`],
      wrong: [[String(n - 1), T`Zapomniany środkowy wyraz $f(${a})=1$.`], [String(2 * n), T`Każda para daje $2$, ale par jest $${a - 1}$, nie $${n}$.`], [String(n + 1), T`Środkowy wyraz to $1$, nie $2$.`]] });
  }
  const gen126 = () => e126(R.int(3, 9));

  /* ---------- lista ---------- */
  const ids = (...k) => k;
  A.addList({
    num: 11, id: 'p1', subject: 'pro', title: 'Lista 1', name: 'Przekształcenia', hue: 'p1',
    blurb: 'Rachunki bez kalkulatora: kolejność działań, wzory skróconego mnożenia, sprytne podstawienia i sumy teleskopowe.',
    tasks: [
      { id: 'P1.1', name: 'Kolejność działań i potęgi', statement: T`Oblicz wartość wyrażenia: $(-5)^2\cdot\left(-\frac15\right)^3-2^3:\left(-\frac12\right)^2-(-1)^{1999}$.`, wzIds: ids('order', 'negpow', 'divfrac'), gen: gen11,
        items: [Object.assign(e11(5, 2, 2, 1999), { label: '1.1' })] },
      { id: 'P1.2', name: 'Które wyrażenie największe?', statement: T`Danych jest pięć wyrażeń: (1) $(2\cdot3\cdot5\cdot7)\left(\frac12+\frac13+\frac15+\frac17\right)$, (2) $(-0{,}125)^7\cdot8^8$, (3) $(-11)+(-33)-(-55)-(-66)-(-77)-(-88)$, (4) $\left(-\frac{75}{13}\right)^2+\left(\frac{37}{13}\right)^2$, (5) $\left[\left(-\frac67\right)^7+\left(-\frac45\right)\left(-\frac49\right)\frac{16}{81}\right]\left(9\frac{246}{247}-0{,}666\right)$. Wskaż, które ma największą wartość.`,
        wzIds: it => ({ w1: ['order'], w2: ['powprod', 'negpow'], w3: ['signs'], w4: ['negpow'], w5: ['negpow', 'abspow'], max: ['cmp'] }[(it && it.gk) || 'w1'] || ['order']), gen: gen12,
        items: [Object.assign(w1([2, 3, 5, 7]), { label: '(1)' }), Object.assign(w2(8, 7), { label: '(2)', q: T`Oblicz $(-0{,}125)^7\cdot8^8$.` }), Object.assign(w3([11, 33, 55, 66, 77, 88]), { label: '(3)' }), Object.assign(w4(75, 37, 13), { label: '(4)' }), Object.assign(w5(), { label: '(5)' }), Object.assign(maxItem(), { label: 'max' })] },
      { id: 'P1.3', name: 'Mnożenie przez $99\\ldots9$', statement: T`Oblicz wartość iloczynu $123456789\cdot999999999$.`, wzIds: ids('nines'), gen: gen13, items: [Object.assign(e13(123456789, 9), { label: '1.3' })] },
      { id: 'P1.4', name: 'Podstawienie $n=13579$', statement: T`Oblicz $\frac{13579}{(-13579)^2+(-13578)(13580)}$.`, wzIds: ids('sub', 'dsq'), gen: gen14, items: [Object.assign(e14(13579), { label: '1.4' })] },
      { id: 'P1.5', name: 'Suma sześcianów', statement: T`Oblicz wartość ułamka $\frac{83^2+17^3}{83\cdot66+17^2}$.`, wzIds: ids('cubes'), gen: gen15,
        items: [Object.assign(e15(83, 17, T`Uwaga: na liście w liczniku jest $83^2$ — to literówka (wtedy wynik $\frac{11802}{5767}$ się nie upraszcza). Zadanie jest zbudowane pod $83^3$: wtedy $66=83-17$ i działa wzór na sumę sześcianów.`), { label: '1.5' })] },
      { id: 'P1.6', name: 'Iloczyn $\\frac{(4\\cdot7+2)\\cdots}{(5\\cdot8+2)\\cdots}$', statement: T`Oblicz $\frac{(4\cdot7+2)(6\cdot9+2)(8\cdot11+2)\cdots(100\cdot103+2)}{(5\cdot8+2)(7\cdot10+2)(9\cdot12+2)\cdots(99\cdot102+2)}$.`, wzIds: ids('prodtel'), gen: gen16, items: [Object.assign(e16(4, 100), { label: '1.6' })] },
      { id: 'P1.7', name: 'Ułamek z dużymi kwadratami', statement: T`Oblicz $\frac{20092008^2}{20092007^2+20092009^2-2}$.`, wzIds: ids('sub', 'sqsum'), gen: gen17, items: [Object.assign(e17(20092008), { label: '1.7' })] },
      { id: 'P1.8', name: 'Teleskop $\\frac1{k(k+1)}$', statement: T`Oblicz $3-\frac12-\frac16-\frac1{12}-\frac1{20}-\frac1{30}-\frac1{42}-\frac1{56}$.`, wzIds: ids('tel1'), gen: gen18, items: [Object.assign(e18(3, 7), { label: '1.8' })] },
      { id: 'P1.9', name: 'Teleskop dla liczb nieparzystych', statement: T`Oblicz $\frac13+\frac1{15}+\frac1{35}+\frac1{63}+\frac1{99}+\frac1{143}$.`, wzIds: ids('teld'), gen: gen19, items: [Object.assign(e19(6), { label: '1.9' })] },
      { id: 'P1.10', name: 'Relacja $(a-b)^2$ i $(a+b)^2$', statement: T`Jeśli $ab<0$, ustal relację między $(a-b)^2$ oraz $(a+b)^2$.`, wzIds: ids('cmp', 'sqsum'), gen: gen110, items: [Object.assign(e110('<'), { label: '1.10' })] },
      { id: 'P1.11', name: 'Porządkowanie potęg', statement: T`Jeśli $-1<a<0$, uporządkuj od najmniejszej do największej: $a^3,-a^3,a^4,-a^4,\frac1a,-\frac1a$.`, wzIds: ids('abspow', 'negpow'), gen: gen111, items: [Object.assign(e111('neg'), { label: '1.11' })] },
      { id: 'P1.12', name: 'Suma $(-1)^k$', statement: T`Oblicz $-1-(-1)^1-(-1)^2-(-1)^3-\ldots-(-1)^{99}-(-1)^{100}$.`, wzIds: ids('pairs', 'negpow'), gen: gen112, items: [Object.assign(e112(-1, 100), { label: '1.12' })] },
      { id: 'P1.13', name: 'Liczby $\\overline{abcdabcd}$', statement: T`Oblicz $2008\cdot20092009-2009\cdot20082008$.`, wzIds: ids('repeat'), gen: gen113, items: [Object.assign(e113(2008, 2009, 0), { label: '1.13', q: T`Oblicz $2008\cdot20092009-2009\cdot20082008$.` })] },
      { id: 'P1.14', name: 'Odejmowanie części reszty', statement: T`Od liczby $2009$ odejmujemy jej połowę, potem $\frac13$ reszty, $\frac14$ nowej reszty itd., aż odejmiemy $\frac1{2009}$ ostatniej reszty. Ile zostanie?`, wzIds: ids('prodtel'), gen: gen114, items: [Object.assign(e114(2009, 2009), { label: '1.14' })] },
      { id: 'P1.15', name: 'Teleskop $\\frac1{x(x+2)}$', statement: T`Znajdź sumę $\frac1{5\cdot7}+\frac1{7\cdot9}+\frac1{9\cdot11}+\frac1{11\cdot13}+\frac1{13\cdot15}$.`, wzIds: ids('teld'), gen: gen115, items: [Object.assign(eTel('odd', 5, 2, 5), { label: '1.15' })] },
      { id: 'P1.16', name: 'Teleskop z ukrytymi czynnikami', statement: T`Znajdź sumę $\frac1{10}+\frac1{40}+\frac1{88}+\frac1{154}+\frac1{238}$.`, wzIds: ids('teld'), gen: gen116, items: [Object.assign(eTel('step', 2, 3, 5), { label: '1.16' })] },
      { id: 'P1.17', name: 'Podstawienie za długą sumę', statement: T`Oblicz $\left(\frac13+\frac14+\ldots+\frac1{2009}\right)\left(1+\frac12+\ldots+\frac1{2008}\right)$ $-\left(1+\frac13+\frac14+\ldots+\frac1{2009}\right)\left(\frac12+\frac13+\ldots+\frac1{2008}\right)$.`, wzIds: ids('harm', 'sub'), gen: gen117, items: [Object.assign(e117(2009), { label: '1.17' })] },
      { id: 'P1.18', name: 'Odwrotności sum $1+\\ldots+k$', statement: T`Znajdź sumę $\frac1{1+2}+\frac1{1+2+3}+\ldots+\frac1{1+2+\ldots+51}$.`, wzIds: ids('gauss', 'tel1'), gen: gen118, items: [Object.assign(e118(51), { label: '1.18' })] },
      { id: 'P1.19', name: 'Suma „piramid”', statement: T`Niech $n$ będzie dodatnią liczbą całkowitą. Znajdź $1+\frac12+\frac22+\frac12$ $+\frac13+\frac23+\frac33+\frac23+\frac13$ $+\ldots$ $+\frac1n+\frac2n+\ldots+\frac nn+\frac{n-1}n+\ldots+\frac1n$.`, wzIds: ids('gauss'), gen: gen119, items: [Object.assign(e119gen(), { label: '1.19' })] },
      { id: 'P1.20', name: 'Naprzemienna suma kwadratów', statement: T`Oblicz $1^2-2^2+3^2-4^2+\ldots-2008^2+2009^2$.`, wzIds: ids('pairs', 'dsq', 'gauss'), gen: gen120, items: [Object.assign(e120(2009), { label: '1.20' })] },
      { id: 'P1.21', name: 'Suma $11+192+1993+\\ldots$', statement: 'Znajdź sumę 11 + 192 + 1993 + 19994 + 199995 + 1999996 + 19999997 + 199999998 + 1999999999.', wzIds: ids('nines'), gen: gen121, items: [Object.assign(e121(9), { label: '1.21' })] },
      { id: 'P1.22', name: 'Suma $\\frac{n^2+1}{n^2-1}$', statement: T`Oblicz $\frac{3^2+1}{3^2-1}+\frac{5^2+1}{5^2-1}+\frac{7^2+1}{7^2-1}+\ldots+\frac{99^2+1}{99^2-1}$.`, wzIds: ids('dsq', 'teld'), gen: gen122, items: [Object.assign(e122(99), { label: '1.22' })] },
      { id: 'P1.23', name: 'Teleskop z sumami $T_k$', statement: T`Wyrażenie $1-\frac2{1\cdot(1+2)}-\frac3{(1+2)(1+2+3)}-\ldots-\frac{100}{(1+\ldots+99)(1+\ldots+100)}$ po uproszczeniu jest ułamkiem nieskracalnym. Znajdź różnicę między jego mianownikiem a licznikiem.`, wzIds: ids('gauss', 'tel1'), gen: gen123,
        items: [Object.assign(e123(100, 'val'), { label: 'wartość' }), Object.assign(e123(100, 'diff'), { label: 'różnica' })] },
      { id: 'P1.24', name: 'Teleskop $\\frac1{k(k+1)(k+2)}$', statement: T`Oblicz $\frac1{1\cdot2\cdot3}+\frac1{2\cdot3\cdot4}+\ldots+\frac1{100\cdot101\cdot102}$.`, wzIds: ids('tel3'), gen: gen124, items: [Object.assign(e124(100), { label: '1.24' })] },
      { id: 'P1.25', name: 'Rozkład $1+k^2+k^4$', statement: T`Znajdź sumę $\frac1{1+1^2+1^4}+\frac2{1+2^2+2^4}+\ldots+\frac{50}{1+50^2+50^4}$.`, wzIds: ids('sophie', 'teld'), gen: gen125, items: [Object.assign(e125(50), { label: '1.25' })] },
      { id: 'P1.26', name: 'Symetryczne pary', statement: T`Oblicz $\frac{1^2}{1^2-10+50}+\frac{2^2}{2^2-20+50}+\ldots$ (wyrazy $\frac{k^2}{k^2-10k+50}$).`, wzIds: ids('symm'), gen: gen126,
        items: [Object.assign(e126(5, T`Na liście ostatni wyraz jest zapisany niejednoznacznie ($80^2-80+50$). Reguła wyrazów to $\frac{k^2}{k^2-10k+50}$, a sztuczka z parami działa dla $k=1,\ldots,9$ — tak liczymy.`), { label: '1.26' })] },
    ],
  });
  for (const t of A.lists.find(l => l.id === 'p1').tasks) t.wzLib = F;
  A.PRO.F1 = F;
  A.PRO._t1 = { e11, w1, w2, w3, w4, e13, e14, e15, e16, e17, e18, e19, eTel, e112, e113, e114, e117, e118, e119, e120, e121, e122, e123, e124, e125, e126 };
})();
