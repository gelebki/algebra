/* Elementarna teoria liczb — Lista 2: Liczby pierwsze.
   Zadania „wyznacz” mają odpowiedź do wpisania albo wyboru; dowody — wybór metody, wersję na kolokwium i pułapki. */
(function () {
  'use strict';
  const A = AQ, R = A.R, T = String.raw;
  const { S, M, proof, P, gcd, divs, W, mk, txtField } = A.ETLH;
  const isP = n => { if (n < 2) return false; for (let i = 2; i * i <= n; i++) if (n % i === 0) return false; return true; };
  const primes = N => { const r = []; for (let i = 2; i <= N; i++) if (isP(i)) r.push(i); return r; };
  const fmtList = xs => xs.join(', ');

  /* ===== 1. Sito Eratostenesa ===== */
  function sieveCount(N) {
    const ps = primes(N), used = primes(Math.floor(Math.sqrt(N))), next = primes(400).find(p => p * p > N);
    const lastU = used[used.length - 1];
    return mk({ gk: 'sito', ans: ps.length, tex: String(ps.length), flabel: 'ile liczb', q: T`Metodą sita Eratostenesa wyznacz wszystkie liczby pierwsze $\leq ${N}$. Ile ich jest?`,
      steps: [T`Wypisujemy liczby $2,3,\ldots,${N}$ i dla kolejnych liczb pierwszych $${used.join(',')}$ skreślamy ich wielokrotności (zaczynając od kwadratu).`,
        T`Na $${lastU}$ kończymy, bo $${next}^2=${next * next}>${N}$: każda liczba złożona $\leq ${N}$ ma dzielnik pierwszy $\leq\sqrt{${N}}$.`,
        'Zostają: ' + fmtList(ps) + T` — razem $${ps.length}$ liczb.`],
      wrong: [[String(ps.length + 1), 'Liczba $1$ nie jest pierwsza — nie licz jej.'], [String(ps.length - used.length), 'Liczby, którymi „przesiewamy” (' + used.join(', ') + '), same są pierwsze — nie skreślaj ich.'], [String(primes(N - 12).length), 'Sprawdź końcówkę przedziału — tuż przed ' + N + ' też bywają liczby pierwsze.']] });
  }
  function kthPrime(k) {
    const ps = primes(400), p = ps[k - 1];
    return mk({ gk: 'pk', ans: p, tex: String(p), flabel: 'p', q: T`Przy pomocy sita Eratostenesa wyznacz $p_{${k}}$, czyli $${k}$-tą kolejną liczbę pierwszą.`,
      steps: [T`Szacujemy, gdzie szukać: przesiewamy np. przedział $[2,${Math.ceil((p + 10) / 10) * 10}]$ liczbami pierwszymi $\leq\sqrt{${Math.ceil((p + 10) / 10) * 10}}$.`,
        T`Liczymy kolejne liczby pierwsze: ` + fmtList(ps.slice(0, k).map((x, i) => (i + 1) % 5 === 0 ? '<b>' + x + '</b>' : String(x))) + '.',
        T`$${k}$-ta z nich to $p_{${k}}=${p}$.`],
      wrong: [[String(ps[k]), T`To $p_{${k + 1}}$ — sprawdź liczenie (pierwsza liczba pierwsza to $p_1=2$).`], [String(ps[k - 2]), T`To $p_{${k - 1}}$ — chyba liczba $1$ została policzona jako pierwsza.`], [String(ps[k + 1]), T`To $p_{${k + 2}}$ — przelicz jeszcze raz kolejne liczby pierwsze.`]] });
  }
  function sieveStop(n) {
    const r = Math.sqrt(n), ps = primes(Math.floor(r)), last = ps[ps.length - 1], nx = primes(400).find(p => p > r);
    return mk({ gk: 'stop', ans: last, tex: String(last), flabel: 'p', q: T`Na jakiej liczbie pierwszej można poprzestać przy „odsiewaniu”, aby otrzymać wszystkie liczby pierwsze $\leq ${n}$?`,
      steps: [T`Liczba złożona $m\leq ${n}$ ma dzielnik pierwszy $p\leq\sqrt m\leq\sqrt{${n}}\approx ${r.toFixed(2).replace('.', '{,}')}$ (gdyby oba czynniki były większe, iloczyn przekroczyłby $${n}$).`,
        T`Największa liczba pierwsza $\leq ${r.toFixed(2).replace('.', '{,}')}$ to $${last}$ (bo $${last}^2=${last * last}\leq ${n}<${nx}^2=${nx * nx}$).`, T`Wystarczy odsiać wielokrotności liczb pierwszych do $${last}$ włącznie.`],
      wrong: [[String(nx), T`$${nx}^2=${nx * nx}>${n}$ — wielokrotności $${nx}$ zostały już skreślone wcześniej.`], [String(ps[ps.length - 2]), T`Za wcześnie: $${last}^2=${last * last}\leq ${n}$ trzeba jeszcze skreślić.`], [String(Math.floor(r)), T`$${Math.floor(r)}$ to część całkowita $\sqrt{${n}}$ — ale sito prowadzimy liczbami pierwszymi.`]] });
  }

  /* ===== 2. p² − 2q² = 1 ===== */
  const it2 = proof('2.2', 'pq2', T`Rozwiąż równanie $p^2-2q^2=1$, jeżeli $p$ i $q$ są liczbami pierwszymi.`, [
    M('Parzystość', 'Równanie z liczbami pierwszymi — sprawdź parzystość: jedyna parzysta liczba pierwsza to $2$.', T`$p^2=2q^2+1$ jest nieparzyste, więc $p=2k+1$; wtedy $q^2=2k(k+1)$ jest parzyste, czyli $q=2$.`,
      [S('Parzystość p', 'Co wiemy o $p$?', '$p$ jest nieparzyste', T`$p^2=2q^2+1$ jest liczbą nieparzystą, więc $p$ jest nieparzyste: $p=2k+1$, $k\in\mathbb N$.`, 'Kwadrat liczby parzystej jest parzysty.', ['$p=2$', 'Wtedy $4-2q^2=1$, czyli $2q^2=3$ — niemożliwe.'], ['$p$ jest parzyste', '$2q^2+1$ jest nieparzyste.']),
       S('Parzystość q', T`Co daje podstawienie $p=2k+1$?`, T`$q^2=2k(k+1)$, więc $q$ parzyste, $q=2$`, T`$4k^2+4k+1-2q^2=1$, czyli $q^2=2k(k+1)$. Prawa strona jest parzysta, więc $q$ jest parzyste, a jako liczba pierwsza $q=2$.`, 'Jedyna parzysta liczba pierwsza to 2 — to kluczowe zdanie.', [T`$q=3$`, T`Wtedy $p^2=19$ — nie jest kwadratem.`], [T`$q$ nieparzyste`, T`$q^2=2k(k+1)$ jest parzyste.`]),
       S('Wynik', T`Ile wynosi $p$?`, T`$p=3$`, T`$p^2=2\cdot 4+1=9$, więc $p=3$ (pierwsza ✓). Rozwiązanie: $(p,q)=(3,2)$. $\blacksquare$`, 'Sprawdź, że wynik naprawdę jest liczbą pierwszą.', [T`$p=\pm3$`, 'Liczby pierwsze są dodatnie.'], [T`$p=9$`, 'To $p^2$.'])],
      [[T`$p^2=2q^2+1$ nieparzyste $\Rightarrow p=2k+1$.`, 'parzystość $p$'], [T`$q^2=2k(k+1)$ parzyste $\Rightarrow q=2$.`, 'jedyna parzysta pierwsza'], [T`$p^2=9\Rightarrow p=3$. Odp.: $(3,2)$. $\blacksquare$`, 'wynik']],
      ['Zgadnięcie $(3,2)$ bez pokazania, że innych rozwiązań nie ma — to 0 punktów za „rozwiąż”.']),
    M('Rozkład na czynniki', 'Przenieś $1$ na drugą stronę i rozłóż różnicę kwadratów.', T`$2q^2=(p-1)(p+1)$; oba czynniki są parzyste, więc $4\mid 2q^2$ i $q$ jest parzyste.`,
      [S('Rozkład', 'Jak przekształcić równanie?', T`$2q^2=(p-1)(p+1)$`, T`$p^2-1=2q^2$, czyli $(p-1)(p+1)=2q^2$.`, 'Różnica kwadratów.', [T`$2q^2=(p-1)^2$`, T`$(p-1)^2\neq p^2-1$.`], [T`$q^2=(p-1)(p+1)$`, 'Zgubiona dwójka.']),
       S('Czynnik 4', T`Co wiemy o $p-1$ i $p+1$?`, T`Oba parzyste, więc $4\mid 2q^2$`, T`Prawa strona jest parzysta, więc $p$ jest nieparzyste; wtedy $p-1$ i $p+1$ są parzyste, $4\mid(p-1)(p+1)=2q^2$, więc $2\mid q^2$ i $q=2$.`, 'Iloczyn dwóch liczb parzystych dzieli się przez 4.', ['Jeden parzysty, drugi nie', 'Różnią się o 2 — mają tę samą parzystość.'], ['Oba nieparzyste', '$p$ jest nieparzyste, więc $p\\pm1$ są parzyste.']),
       S('Wynik', T`Ile wynosi $p$?`, T`$p=3$`, T`$(p-1)(p+1)=8$, więc $p^2=9$, $p=3$. Odp.: $(p,q)=(3,2)$. $\blacksquare$`, 'Sprawdzenie: $9-8=1$ ✓.', [T`$p=2$`, '$1\\cdot3=3\\neq8$.'], [T`$p=5$`, '$4\\cdot6=24\\neq8$.'])],
      [[T`$(p-1)(p+1)=2q^2$.`, 'rozkład'], [T`$p$ nieparzyste $\Rightarrow 4\mid 2q^2\Rightarrow q=2$.`, 'parzystość'], [T`$p^2=9$, $p=3$. Odp.: $(3,2)$. $\blacksquare$`, 'wynik']],
      ['Brak uzasadnienia, dlaczego $p$ jest nieparzyste.'])]);

  /* ===== 3. a·p − b·q = c (q wymuszone) ===== */
  function linPrime(l, B, c1, f) { // równanie f·l·p − f·B·q = f·l·c1; rozwiązanie q = l, p = c1 + B
    const p0 = c1 + B, C = l * c1;
    const q = T`Wyznacz wszystkie liczby pierwsze $p,q$ takie, że $${f * l}p-${f * B}q=${f * C}$.`;
    const div = f > 1 ? T`Dzielimy przez $${f}$: $${l}p-${B}q=${C}$.` : T`Równanie: $${l}p-${B}q=${C}$.`;
    return proof('', 'lin', q, [
      M('Podzielność', T`Jeden współczynnik i prawa strona mają wspólny dzielnik pierwszy — on musi dzielić drugi składnik.`, T`$${l}\mid ${C}$ i $${l}\mid ${l}p$, więc $${l}\mid ${B}q$; skoro $(${l},${B})=1$, to $${l}\mid q$, czyli $q=${l}$.`,
        [S('Uproszczenie', 'Od czego zacząć?', f > 1 ? T`Podzielić przez $${f}$` : T`Zauważyć, że $${l}\mid ${l}p$ i $${l}\mid ${C}$`, div, 'Mniejsze liczby — łatwiej zobaczyć podzielność.', [T`Podstawiać kolejne liczby pierwsze`, 'Tak nie pokażesz, że innych rozwiązań nie ma.'], [T`Policzyć $p=q$`, 'Nic tego nie sugeruje.']),
         S('Podzielność', T`Co dzieli $${B}q$?`, T`$${l}$, więc $q=${l}$`, T`$${B}q=${l}p-${C}=${l}(p-${c1})$, więc $${l}\mid ${B}q$. Ponieważ $(${l},${B})=1$, to $${l}\mid q$, a $q$ jest pierwsza, więc $q=${l}$.`, 'Lemat: $m\\mid ab$ i $(m,a)=1$ daje $m\\mid b$.', [T`$${B}$, więc $q=${B}$`, T`$${B}$ dzieli $${B}q$ zawsze — to nic nie daje.`], [T`$q=2$`, 'Nic nie wymusza parzystości.']),
         S('Wynik', T`Ile wynosi $p$?`, T`$p=${p0}$`, T`$${l}p=${C}+${B}\cdot ${l}=${C + B * l}$, więc $p=${p0}$ — liczba pierwsza ✓. Odp.: $p=${p0},\ q=${l}$. $\blacksquare$`, 'Sprawdź, że $p$ wyszło pierwsze — inaczej rozwiązań by nie było.', [T`$p=${p0 + B}$`, 'Przelicz dzielenie.'], [T`$p=${c1}$`, 'Zapomniany składnik $' + B + 'q$.'])],
        [[div, f > 1 ? 'uproszczenie' : null], [T`$${l}\mid ${B}q$, $(${l},${B})=1\Rightarrow ${l}\mid q\Rightarrow q=${l}$.`, 'kluczowa podzielność'], [T`$p=${p0}$ (pierwsza). Odp.: $(p,q)=(${p0},${l})$. $\blacksquare$`, 'wynik ze sprawdzeniem']],
        ['Brak argumentu $(' + l + ',' + B + ')=1$ przy przejściu do $' + l + '\\mid q$.']),
      M('Rozwiązanie ogólne', 'Rozwiąż równanie liniowe w liczbach całkowitych, a potem nałóż warunek „pierwsze”.', T`Wszystkie rozwiązania całkowite: $p=${c1}+${B}t,\ q=${l}t$. Pierwszość $q=${l}t$ wymusza $t=1$.`,
        [S('Rozwiązanie szczególne', 'Jakie jest proste rozwiązanie całkowite?', T`$p=${c1},\ q=0$`, T`${div} Para $(${c1},0)$ spełnia je: $${l}\cdot ${c1}=${C}$.`, 'Gdy współczynnik dzieli prawą stronę, rozwiązanie szczególne widać od razu.', [T`$p=0,\ q=${c1}$`, T`$-${B}\cdot ${c1}\neq ${C}$.`], [T`$p=1,\ q=1$`, T`$${l}-${B}\neq ${C}$.`]),
         S('Rozwiązanie ogólne', 'Jak wyglądają wszystkie rozwiązania całkowite?', T`$p=${c1}+${B}t,\ q=${l}t$, $t\in\mathbb Z$`, T`Ponieważ $(${l},${B})=1$, wszystkie rozwiązania to $p=${c1}+${B}t,\ q=${l}t$, $t\in\mathbb Z$.`, 'Do rozwiązania szczególnego dodajemy $t\\cdot(b,a)$ podzielone przez NWD.', [T`$p=${c1}+${l}t,\ q=${B}t$`, 'Współczynniki zamienione — sprawdź podstawiając.'], [T`$p=${c1}+t,\ q=t$`, 'Nie spełnia równania dla $t\\neq0$.']),
         S('Warunek pierwszości', T`Kiedy $q=${l}t$ jest pierwsza?`, T`Tylko dla $t=1$: $q=${l},\ p=${p0}$`, T`$q=${l}t$ jest pierwsza tylko dla $t=1$. Wtedy $q=${l}$, $p=${p0}$ — pierwsza ✓. Odp.: $(p,q)=(${p0},${l})$. $\blacksquare$`, 'Iloczyn $' + l + 't$ dla $t\\geq2$ ma dzielnik ' + l + ' — jest złożony.', [T`Dla $t=0$`, '$q=0$ nie jest pierwsza.'], ['Dla każdego $t$', 'Dla $t=2$ $q$ jest złożone.'])],
        [[T`Rozwiązania całkowite: $p=${c1}+${B}t,\ q=${l}t,\ t\in\mathbb Z$.`, 'rozwiązanie ogólne'], [T`$q$ pierwsza $\Rightarrow t=1\Rightarrow (p,q)=(${p0},${l})$. $\blacksquare$`, 'warunek pierwszości']],
        ['Rozwiązanie ogólne bez sprawdzenia — łatwo zamienić współczynniki.'])]);
  }
  function genLin() { for (;;) { const l = R.pick([3, 5, 7]), B = R.int(2, 19), c1 = R.int(1, 15), f = R.pick([1, 2, 2, 3]); if (gcd(l, B) !== 1 || !isP(c1 + B) || c1 + B === l) continue; return linPrime(l, B, c1, f); } }

  /* ===== 4. p(p+q) = N ===== */
  const pairT = ps => ps.map(([a, b]) => `(${a},${b})`).join(',\\ ');
  function pqEq(N) {
    const sol = [], tried = [];
    for (const p of primes(N)) if (N % p === 0) { const q = N / p - p; tried.push([p, q]); if (q > 0 && isP(q) && q !== p) sol.push([p, q]); }
    const tex = sol.length ? T`(p,q)\in\{${pairT(sol)}\}` : T`\text{brak takich par}`;
    const all = tried.filter(([, q]) => q > 0);
    return mk({ gk: 'pq', field: txtField(), q: T`Wyznacz wszystkie pary różnych liczb pierwszych $p,q$ spełniających równanie $pq=${N}-p^2$.`, tex,
      steps: [T`Przenosimy: $p^2+pq=${N}$, czyli $p(p+q)=${N}$. Zatem $p\mid ${N}$, więc $p\in\{${primes(N).filter(x => N % x === 0).join(',')}\}$.`,
        T`Sprawdzamy: ` + tried.map(([p, q]) => T`$p=${p}$: $q=${N}/${p}-${p}=${q}$ ${q > 0 && isP(q) && q !== p ? '✓' : q === p ? '(równe $p$ ✗)' : '✗'}`).join('; ') + '.',
        T`Odpowiedź: $${tex}$.`],
      wrong: [[T`(p,q)\in\{${pairT(all)}\}`, 'Część wartości $q$ nie jest pierwsza — sprawdź każdą.'], [sol.length > 1 ? T`(p,q)\in\{${pairT(sol.slice(0, 1))}\}` : T`(p,q)\in\{${pairT(sol.map(([a, b]) => [b, a]))}\}`, sol.length > 1 ? 'Brakuje rozwiązania — sprawdź wszystkie dzielniki pierwsze.' : 'Sprawdź: $p$ musi dzielić ' + N + ', a role $p$ i $q$ nie są symetryczne.'], [T`(p,q)\in\{${pairT(sol.concat(sol.map(([a, b]) => [b, a])))}\}`, 'Równanie nie jest symetryczne — zamiana $p$ i $q$ nie daje rozwiązania.'], [T`(p,q)\in\{${pairT(sol.map(([a, b]) => [a, b + 2]))}\}`, 'Przelicz $q=\frac{' + N + '}{p}-p$.'], [T`(p,q)\in\{${pairT(sol.map(([a, b]) => [b, a]))}\}`, 'Sprawdź: $p$ musi dzielić ' + N + '.']] });
  }
  function genPq() { for (;;) { const N = R.int(30, 300); const it = pqEq(N); if (/brak/.test(it.mcCorrect)) continue; return it; } }

  /* ===== 5. a³ + b³ pierwsza ===== */
  const it5 = proof('2.5', 'cubes', T`Wyznacz wszystkie $a,b\in\mathbb N$, dla których liczba $a^3+b^3$ jest pierwsza.`, [
    M('Rozkład na czynniki', 'Suma sześcianów rozkłada się na iloczyn — liczba pierwsza ma tylko rozkład $1\\cdot p$.', T`$a^3+b^3=(a+b)(a^2-ab+b^2)$; skoro $a+b\geq2$, musi być $a^2-ab+b^2=1$.`,
      [S('Rozkład', 'Jak rozłożyć $a^3+b^3$?', '$(a+b)(a^2-ab+b^2)$', T`$a^3+b^3=(a+b)(a^2-ab+b^2)$.`, 'Wzór skróconego mnożenia na sumę sześcianów.', ['$(a+b)(a^2+ab+b^2)$', 'To byłby rozkład $a^3-b^3$ (z $a-b$).'], ['$(a+b)^3$', 'Brakuje wyrazów mieszanych.']),
       S('Czynnik 1', 'Który czynnik musi być równy 1?', '$a^2-ab+b^2=1$', T`Liczba pierwsza ma tylko dzielniki $1$ i siebie. Ponieważ $a+b\geq2$, musi być $a^2-ab+b^2=1$ (i $a+b$ pierwsza).`, 'Większy czynnik równa się liczbie, mniejszy musi być 1.', ['$a+b=1$', 'Dla $a,b\\geq1$ mamy $a+b\\geq2$.'], ['Oba równe 1', 'Wtedy iloczyn byłby 1 — nie jest pierwszy.']),
       S('Rozwiązanie', T`Kiedy $a^2-ab+b^2=1$?`, '$a=b=1$', T`$a^2-ab+b^2=(a-b)^2+ab\geq ab\geq1$, z równością tylko dla $a=b$ i $ab=1$, czyli $a=b=1$. Wtedy $a^3+b^3=2$ — pierwsza ✓. Odp.: $a=b=1$. $\blacksquare$`, 'Zapis $(a-b)^2+ab$ od razu pokazuje, kiedy jest równość.', ['$a=1$, $b$ dowolne', 'Dla $b=2$: $1-2+4=3\\neq1$.'], ['Brak rozwiązań', '$1^3+1^3=2$ jest pierwsza.'])],
      [[T`$a^3+b^3=(a+b)(a^2-ab+b^2)$, $a+b\geq2$.`, 'rozkład'], [T`Pierwsza $\Rightarrow a^2-ab+b^2=1$.`, 'czynnik równy 1'], [T`$(a-b)^2+ab=1\Rightarrow a=b=1$; $1+1=2$ ✓. $\blacksquare$`, 'rozwiązanie i sprawdzenie']],
      ['Brak uzasadnienia, że $a+b\\neq1$.', 'Pominięcie sprawdzenia, że $2$ jest pierwsza.'])]);

  /* ===== 6. pqr = k(p+q+r) ===== */
  const tripT = ts => ts.map(t => '\\{' + t.join(',') + '\\}').join(',\\quad ');
  function triple(k) {
    const sol = [];
    for (const d of divs(k + 1)) { const p = d + 1, q = (k + 1) / d + 1; if (p <= q && isP(p) && isP(q)) sol.push([p, q, k].sort((x, y) => x - y)); }
    const tex = T`${tripT(sol)}`;
    const cands = divs(k + 1).filter(d => d <= (k + 1) / d).map(d => [d + 1, (k + 1) / d + 1]);
    return mk({ gk: 'trip', field: txtField(), q: T`Wyznacz wszystkie trójki liczb pierwszych, których iloczyn jest ${({ 2: 'dwu', 3: 'trzy', 5: 'pięcio', 7: 'siedmio', 11: 'jedenasto', 13: 'trzynasto' })[k]}krotnie większy od ich sumy.`, tex,
      steps: [T`$pqr=${k}(p+q+r)$, więc $${k}\mid pqr$; $${k}$ jest pierwsza, więc dzieli jeden z czynników — np. $r=${k}$.`,
        T`Wtedy $pq=p+q+${k}$, czyli $pq-p-q+1=${k + 1}$, $(p-1)(q-1)=${k + 1}$.`,
        T`Rozkłady $${k + 1}$ (z $p\leq q$): ` + cands.map(([p, q]) => T`$p=${p},q=${q}$ ${isP(p) && isP(q) ? '✓' : '✗'}`).join('; ') + T`. Odpowiedź: $${tex}$ (z dokładnością do kolejności).`],
      wrong: [[tripT(cands.map(([p, q]) => [p, q, k].sort((x, y) => x - y))), 'Nie wszystkie te liczby są pierwsze — sprawdź każdą.'], [k === 3 ? T`\{3,3,3\}` : T`\{${k},${k},${k}\}`, k === 3 ? 'Brakuje trójki $\\{2,3,5\\}$: 0=3\\cdot10$.' : T`$${k ** 3}\neq ${k}\cdot ${3 * k}$.`], [T`\{2,3,${k + 1}\}`, 'Trik $(p-1)(q-1)=' + (k + 1) + '$ trzeba rozwiązać przez dzielniki.'], [tripT(sol.slice(0, -1).length ? sol.slice(0, -1) : [[2, k, k + 2]]), sol.length > 1 ? 'Brakuje jednej trójki.' : T`$${2 * k * (k + 2)}\neq ${k}\cdot ${2 + k + k + 2}$.`]] });
  }

  /* ===== 7. jedna jest różnicą sześcianów dwóch pozostałych ===== */
  const it7 = mk({ gk: 'cube3', field: txtField(), q: T`Wyznacz trzy liczby pierwsze, z których jedna jest różnicą sześcianów dwóch pozostałych.`, tex: T`19,\ 3,\ 2\quad(19=3^3-2^3)`,
    steps: [T`$p=q^3-r^3=(q-r)(q^2+qr+r^2)$, a $q^2+qr+r^2>1$, więc dla pierwszej $p$ musi być $q-r=1$.`, T`Dwie liczby pierwsze różniące się o $1$ to tylko $3$ i $2$: $q=3,\ r=2$.`, T`$p=27-8=19$ — pierwsza ✓. Odpowiedź: $19,3,2$.`],
    wrong: [[T`7,\ 2,\ 1\quad(7=2^3-1^3)`, '$1$ nie jest liczbą pierwszą.'], [T`98,\ 5,\ 3\quad(98=5^3-3^3)`, '$98$ nie jest pierwsza — warunek $q-r=1$ nie jest spełniony.'], [T`37,\ 4,\ 3\quad(37=4^3-3^3)`, '$4$ nie jest pierwsza.']] });

  /* ===== 8. a⁴ − b⁴ nigdy pierwsza ===== */
  const it8 = proof('2.8', 'ab4', T`Wykaż, że nie istnieją liczby całkowite $a,b$, dla których liczba $a^4-b^4$ jest pierwsza.`, [
    M('Dwa czynniki', 'Różnica kwadratów: $a^4-b^4=(a^2-b^2)(a^2+b^2)$ — mniejszy czynnik musiałby być 1.', T`Gdyby $a^4-b^4=p$, to $a^2+b^2>0$ dzieli $p$, a $a^2-b^2\leq a^2+b^2$, więc $a^2-b^2=1$ — a to daje $b=0$, $p=1$.`,
      [S('Rozkład', 'Jak rozłożyć $a^4-b^4$?', '$(a^2-b^2)(a^2+b^2)$', T`Przypuśćmy, że $a^4-b^4=p$ jest pierwsza. Mamy $a^4-b^4=(a^2-b^2)(a^2+b^2)$.`, 'Dowód nie wprost: zakładamy, że jest pierwsza.', ['$(a-b)^4$', 'To inny wielomian.'], ['$(a^2-b^2)^2$', 'Po wymnożeniu wychodzi $a^4-2a^2b^2+b^4$.']),
       S('Czynnik 1', 'Który czynnik musi być równy 1?', '$a^2-b^2=1$', T`$p>0$ i $a^2+b^2>0$ (gdyby $a=b=0$, to $p=0$), więc $a^2-b^2>0$. Ponieważ $a^2-b^2\leq a^2+b^2$, a $p$ ma tylko dzielniki $1$ i $p$, musi być $a^2-b^2=1$.`, 'Mniejszy z dwóch dodatnich czynników liczby pierwszej to 1.', ['$a^2+b^2=1$', 'Wtedy $a^2-b^2=p\\geq2$ byłoby większe od $a^2+b^2$ — niemożliwe.'], ['Żaden', 'Liczba pierwsza ma tylko rozkład $1\\cdot p$.']),
       S('Sprzeczność', 'Co daje $a^2-b^2=1$?', '$b=0$, $a^2=1$, więc $p=1$ — sprzeczność', T`$(a-b)(a+b)=1$, więc $a-b=a+b=\pm1$, czyli $b=0$, $a^2=1$. Wtedy $a^4-b^4=1$, a $1$ nie jest pierwsza — sprzeczność. $\blacksquare$`, 'Dwie liczby całkowite o iloczynie 1 to obie 1 albo obie −1.', ['$a=1, b=0$ i $p=1$ jest pierwsza', '$1$ nie jest liczbą pierwszą.'], ['$a=b$', 'Wtedy $a^2-b^2=0\\neq1$.'])],
      [[T`Przypuśćmy, że $p=a^4-b^4=(a^2-b^2)(a^2+b^2)$ jest pierwsza.`, 'założenie nie wprost i rozkład'], [T`$0<a^2-b^2\leq a^2+b^2$, więc $a^2-b^2=1$.`, 'czynnik równy 1'], [T`$(a-b)(a+b)=1\Rightarrow b=0, a^2=1\Rightarrow p=1$ — sprzeczność. $\blacksquare$`, 'sprzeczność']],
      ['Pominięcie przypadku ujemnych czynników — trzeba napisać, że $a^2-b^2>0$.']),
    M('Trzy czynniki', 'Rozłóż do końca: $(a-b)(a+b)(a^2+b^2)$ i porównaj wielkości czynników.', T`Iloczyn trzech czynników jest pierwszy tylko, gdy dwa z nich mają moduł 1 — a to wymusza $a^4-b^4=\pm1$.`,
      [S('Rozkład', 'Jak rozłożyć $a^4-b^4$ do końca?', '$(a-b)(a+b)(a^2+b^2)$', T`Przypuśćmy, że $p=a^4-b^4$ jest pierwsza. $a^4-b^4=(a-b)(a+b)(a^2+b^2)$.`, 'Dwa razy różnica kwadratów.', ['$(a-b)^2(a+b)^2$', 'To $(a^2-b^2)^2$.'], ['$(a-b)(a^3+b^3)$', 'Po wymnożeniu nie wychodzi $a^4-b^4$.']),
       S('Moduły czynników', 'Ile czynników może mieć moduł większy niż 1?', 'Najwyżej jeden', T`$|p|=|a-b|\cdot|a+b|\cdot(a^2+b^2)$; liczba pierwsza nie rozkłada się na dwa czynniki $>1$, więc dwa z trzech czynników mają moduł $1$.`, 'Rozkład liczby pierwszej: wszystkie czynniki poza jednym to $\\pm1$.', ['Dwa', 'Wtedy $p$ byłoby złożone.'], ['Wszystkie trzy', 'Iloczyn trzech liczb $>1$ jest złożony.']),
       S('Sprzeczność', 'Co z tego wynika?', 'Wtedy $a^4-b^4=\\pm1$ — sprzeczność', T`Jeśli $|a-b|=|a+b|=1$, to $b=0$, $a^2=1$; jeśli $a^2+b^2=1$, to $\{|a|,|b|\}=\{0,1\}$. W obu przypadkach $a^4-b^4=\pm1$ — nie jest pierwsza. Sprzeczność. $\blacksquare$`, 'Wszystkie przypadki prowadzą do $\\pm1$ (albo 0).', ['$a=2,b=1$ daje 15', '15 nie jest pierwsza — zgadza się z tezą, ale to nie dowód.'], ['$p=1$ jest pierwsza', 'Nie jest.'])],
      [[T`$a^4-b^4=(a-b)(a+b)(a^2+b^2)$.`, 'rozkład'], [T`Dla pierwszej $p$ dwa czynniki mają moduł 1.`, 'analiza czynników'], [T`Każdy przypadek daje $a^4-b^4=\pm1$ — sprzeczność. $\blacksquare$`, 'rozpatrzenie przypadków']],
      ['Pominięty przypadek $a^2+b^2=1$.'])]);

  /* ===== 9–12. kiedy wyrażenie od n jest pierwsze ===== */
  function whenPrime(gk, q, steps, sol, wrong) { const tex = sol.length ? T`n=${sol.join(',\\ ')}` : T`\text{nie istnieje}`; return mk({ gk, field: txtField(), q, tex, steps, wrong }); }
  const it9 = whenPrime('n44', T`Dla jakich $n\in\mathbb N$ liczba $n^4+4$ jest pierwsza?`, [T`Dopisujemy i odejmujemy $4n^2$: $n^4+4=(n^2+2)^2-(2n)^2=(n^2-2n+2)(n^2+2n+2)$.`, T`Drugi czynnik jest $\geq5$, więc dla pierwszej liczby musi być $n^2-2n+2=1$, czyli $(n-1)^2=0$, $n=1$.`, T`$n=1$: $1+4=5$ — pierwsza ✓. Odpowiedź: $n=1$.`], [1],
    [[T`\text{nie istnieje}`, 'Sprawdź $n=1$: $1+4=5$.'], [T`n=1,\ 3`, '$3^4+4=85=5\\cdot17$.'], [T`n=1,\ 5`, '$5^4+4=629=17\\cdot37$.'], [T`n=3`, '$85=5\\cdot17$.']]);
  const it10 = whenPrime('n421', T`Dla jakich $n\in\mathbb N$ liczba $n^4+n^2+1$ jest pierwsza?`, [T`$n^4+n^2+1=(n^2+1)^2-n^2=(n^2-n+1)(n^2+n+1)$.`, T`$n^2+n+1\geq3$, więc musi być $n^2-n+1=1$, czyli $n(n-1)=0$, $n=1$.`, T`$n=1$: $1+1+1=3$ — pierwsza ✓. Odpowiedź: $n=1$.`], [1],
    [[T`n=1,\ 2`, '$16+4+1=21=3\\cdot7$.'], [T`\text{nie istnieje}`, '$n=1$ daje $3$.'], [T`n=2`, '$21$ jest złożona.']]);
  function cubeMinus(a, b, plus) { // a³n³ ∓ b³
    const E = plus ? T`${a ** 3}n^3+${b ** 3}` : T`${a ** 3}n^3-${b ** 3}`;
    const f1 = plus ? T`${a}n+${b}` : T`${a}n-${b}`, f2 = plus ? T`${a * a}n^2-${a * b}n+${b * b}` : T`${a * a}n^2+${a * b}n+${b * b}`;
    const val = n => (plus ? a ** 3 * n ** 3 + b ** 3 : a ** 3 * n ** 3 - b ** 3);
    const sol = []; for (let n = 1; n < 60; n++) { const v = val(n); if (v > 1 && isP(v)) sol.push(n); }
    const n1 = (b + 1) % a === 0 ? (b + 1) / a : null;
    const q = plus ? T`Czy istnieje liczba naturalna $n$ taka, że $${E}$ jest pierwsza?` : T`Dla jakich $n\in\mathbb N$ liczba $${E}$ jest pierwsza?`;
    const steps = [T`Wzór na ${plus ? 'sumę' : 'różnicę'} sześcianów: $${E}=(${a}n)^3${plus ? '+' : '-'}${b}^3=(${f1})(${f2})$.`,
      plus ? T`Dla $n\geq1$: $${f1}\geq ${a + b}$ i $${f2}=${a}n(${a}n-${b})+${b * b}\geq ${Math.min(...[1, 2, 3].map(n => a * a * n * n - a * b * n + b * b))}$ — oba czynniki są większe od $1$, więc liczba jest złożona.` : T`Drugi czynnik jest większy od $1$, więc musi być $${f1}=1$, czyli $n=${n1 == null ? '\\frac{' + (b + 1) + '}{' + a + '}' : n1}$${n1 == null ? ' — to nie jest liczba naturalna' : ''}.`,
      plus ? T`Odpowiedź: nie istnieje.` : sol.length ? T`$n=${sol[0]}$: $${val(sol[0])}$ — pierwsza ✓. Odpowiedź: $n=${sol.join(',')}$.` : T`Odpowiedź: dla żadnego $n$.`];
    const wrong = plus ? [[T`n=1`, T`$${val(1)}=${a + b}\cdot ${a * a - a * b + b * b}$ — złożona.`], [T`n=2`, T`$${val(2)}$ dzieli się przez $${2 * a + b}$.`], [T`n=1,\ 3`, 'Wzór na sumę sześcianów daje rozkład dla każdego $n$.']]
      : [[sol.length ? T`\text{nie istnieje}` : T`n=1`, sol.length ? 'Sprawdź $n=' + sol[0] + '$.' : T`$${val(1)}$ jest złożona albo $\leq1$.`], [T`n=${(sol[0] || 1) + 1}`, T`$${val((sol[0] || 1) + 1)}$ dzieli się przez $${a * ((sol[0] || 1) + 1) - b}$.`], [T`n=${sol.length ? sol[0] + ',\\ ' + (sol[0] + 2) : '2'}`, 'Dla większych $n$ pierwszy czynnik jest większy od 1 — liczba złożona.']];
    return whenPrime(plus ? 'c3p' : 'c3m', q, steps, plus ? [] : sol, wrong);
  }
  const genC3 = plus => { for (;;) { const a = R.pick([2, 3, 4, 5]), b = R.int(1, 6); if (gcd(a, b) !== 1) continue; if (!plus && !((b + 1) % a === 0 && isP(a * a * ((b + 1) / a) ** 2 + a * b * (b + 1) / a + b * b))) continue; return cubeMinus(a, b, plus); } };

  /* ===== 13. n | (n−1)! + 1 ⇒ n pierwsza ===== */
  const it13 = proof('2.13', 'wilson', T`Udowodnij, że jeżeli $n\geq2$ jest taką liczbą naturalną, że $n\mid(n-1)!+1$, to $n$ jest liczbą pierwszą.`, [
    M('Nie wprost (dzielnik)', 'Teza „$n$ jest pierwsza” — załóż, że jest złożona, i weź jej dzielnik.', T`Jeśli $n=ab$, $1<a<n$, to $a\mid(n-1)!$ (bo $a\leq n-1$) i $a\mid n\mid(n-1)!+1$, więc $a\mid1$ — sprzeczność.`,
      [S('Założenie', 'Co zakładamy?', '$n$ jest złożona: $n=ab$, $1<a<n$', T`Przypuśćmy, że $n$ jest złożona: ma dzielnik $a$, $1<a<n$.`, 'Dowód nie wprost — zaprzeczamy tezie.', ['$n$ jest pierwsza', 'To teza — nie zakładamy jej.'], ['$n$ jest parzysta', 'Złożona nie musi być parzysta.']),
       S('Dwie podzielności', T`Co dzieli $a$?`, T`$(n-1)!$ i $(n-1)!+1$`, T`$a\leq n-1$, więc $a$ jest jednym z czynników $(n-1)!=1\cdot2\cdots(n-1)$: $a\mid(n-1)!$. Ponadto $a\mid n$ i $n\mid(n-1)!+1$, więc $a\mid(n-1)!+1$.`, 'Przechodniość: $a\\mid n$ i $n\\mid m$ daje $a\\mid m$.', [T`Tylko $(n-1)!$`, T`Także $(n-1)!+1$ — z przechodniości.`], [T`$n!$ i $n$`, 'Potrzebujemy dwóch liczb różniących się o 1.']),
       S('Sprzeczność', 'Co z tego wynika?', '$a\\mid1$ — sprzeczność z $a>1$', T`$a$ dzieli różnicę: $a\mid\big((n-1)!+1\big)-(n-1)!=1$, a $a>1$ — sprzeczność. Zatem $n$ jest pierwsza. $\blacksquare$`, 'Dzielnik dwóch liczb dzieli ich różnicę.', ['$a=n$', 'Założyliśmy $a<n$.'], ['$a\\mid2$', 'Różnica to 1, nie 2.'])],
      [[T`Przypuśćmy, że $n=ab$, $1<a<n$.`, 'założenie nie wprost'], [T`$a\leq n-1\Rightarrow a\mid(n-1)!$; $a\mid n\mid(n-1)!+1$.`, 'obie podzielności'], [T`$a\mid1$ — sprzeczność. $\blacksquare$`, 'sprzeczność']],
      ['Brak uzasadnienia, dlaczego $a\\mid(n-1)!$ (bo $a\\leq n-1$).', 'Pominięcie założenia $n\\geq2$: dla $n=1$ teza jest fałszywa.'])]);

  /* ===== 14. liczba pierwsza w [n, n!+1] ===== */
  const it14 = proof('2.14', 'euklid', T`Udowodnij, że dla dowolnej liczby naturalnej $n$ w przedziale $[n,n!+1]$ znajduje się liczba pierwsza. Wywnioskuj, że liczb pierwszych jest nieskończenie wiele.`, [
    M('Dzielnik pierwszy $n!+1$', 'Liczba $n!+1$ nie dzieli się przez nic z $2,\\ldots,n$ — jej dzielnik pierwszy musi być większy od $n$.', T`Weź dzielnik pierwszy $p$ liczby $n!+1\geq2$. Gdyby $p\leq n$, to $p\mid n!$ i $p\mid1$. Więc $n<p\leq n!+1$.`,
      [S('Dzielnik pierwszy', T`Od czego zacząć?`, T`Od dzielnika pierwszego $p$ liczby $n!+1$`, T`$n!+1\geq2$, więc ma dzielnik pierwszy $p$; oczywiście $p\leq n!+1$.`, 'Każda liczba $\\geq2$ ma dzielnik pierwszy.', [T`Od $p=n+1$`, '$n+1$ nie musi być pierwsza.'], [T`Od indukcji`, 'Tu wystarczy jeden dobry dzielnik.']),
       S('p > n', T`Dlaczego $p>n$?`, T`Gdyby $p\leq n$, to $p\mid n!$ i $p\mid1$`, T`Gdyby $p\leq n$, to $p\mid n!$, a skoro $p\mid n!+1$, to $p\mid1$ — sprzeczność. Zatem $n<p\leq n!+1$, czyli $p\in[n,n!+1]$.`, '$n!$ zawiera każdy czynnik od 1 do $n$.', ['Bo $p$ jest duże', 'To trzeba uzasadnić.'], ['Bo $n!+1$ jest pierwsza', 'Nie musi: $5!+1=121=11^2$.']),
       S('Wniosek', 'Dlaczego liczb pierwszych jest nieskończenie wiele?', 'Dla każdego $n$ istnieje liczba pierwsza $>n$', T`Dla każdego $n$ istnieje liczba pierwsza $p>n$, więc nie ma największej liczby pierwszej — jest ich nieskończenie wiele. $\blacksquare$`, 'Gdyby było ich skończenie wiele, wzięlibyśmy $n$ = największa.', ['Bo $n!$ rośnie', 'To nie jest argument.'], ['Bo przedział jest długi', 'Długość nic nie daje — liczy się $p>n$.'])],
      [[T`$p$ — dzielnik pierwszy $n!+1$; $p\leq n!+1$.`, 'wybór dzielnika'], [T`$p\leq n\Rightarrow p\mid n!\Rightarrow p\mid1$ — sprzeczność, więc $p>n$.`, 'kluczowe uzasadnienie'], [T`Dla każdego $n$ istnieje pierwsza $>n$ — jest ich nieskończenie wiele. $\blacksquare$`, 'wniosek']],
      ['Twierdzenie „$n!+1$ jest pierwsza” — fałsz ($5!+1=121$).'])]);

  /* ===== 15. n kolejnych liczb złożonych ===== */
  const it15 = proof('2.15', 'gap', T`Dla dowolnej liczby naturalnej $n$ wskaż przedział długości $n$ niezawierający liczb pierwszych.`, [
    M('Silnia', 'Weź $(n+1)!$ — dzieli się przez każdą liczbę od 2 do $n+1$.', T`Liczby $(n+1)!+2,\ (n+1)!+3,\ldots,(n+1)!+(n+1)$: liczba $(n+1)!+k$ dzieli się przez $k$.`,
      [S('Konstrukcja', 'Jakie liczby wziąć?', '$(n+1)!+2,\\ldots,(n+1)!+(n+1)$', T`Rozważmy $n$ kolejnych liczb $(n+1)!+k$ dla $k=2,3,\ldots,n+1$.`, 'Przesunięcie o 2 do $n+1$ daje dokładnie $n$ liczb.', ['$n!+1,\\ldots,n!+n$', '$n!+1$ może być pierwsza.'], ['$n+1,\\ldots,2n$', 'Wśród nich bywają pierwsze.']),
       S('Złożoność', T`Dlaczego $(n+1)!+k$ jest złożona?`, T`Dzieli się przez $k$ i jest większa od $k$`, T`Dla $2\leq k\leq n+1$: $k\mid(n+1)!$ i $k\mid k$, więc $k\mid(n+1)!+k$, a $(n+1)!+k>k\geq2$ — liczba złożona.`, 'Trzeba też napisać, że liczba jest większa od dzielnika.', ['Bo jest parzysta', 'Tylko co druga jest parzysta.'], ['Bo jest duża', 'Duże liczby bywają pierwsze.']),
       S('Wniosek', 'Jaki przedział?', '$[(n+1)!+2,\\ (n+1)!+n+1]$', T`Przedział $[(n+1)!+2,\ (n+1)!+n+1]$ zawiera $n$ kolejnych liczb złożonych, więc nie ma w nim liczb pierwszych. $\blacksquare$`, 'Długość rozumiemy jako liczbę liczb całkowitych w przedziale.', ['$[(n+1)!,\\ (n+1)!+n]$', '$(n+1)!+1$ może być pierwsza.'], ['$[2,n+1]$', 'Zawiera liczbę 2.'])],
      [[T`Liczby $(n+1)!+k$, $k=2,\ldots,n+1$.`, 'konstrukcja'], [T`$k\mid(n+1)!+k$ i $(n+1)!+k>k$ — złożona.`, 'uzasadnienie złożoności'], [T`Przedział $[(n+1)!+2,(n+1)!+n+1]$ nie zawiera liczb pierwszych. $\blacksquare$`, 'wniosek']],
      ['Brak uzasadnienia, że liczba jest większa od $k$ (inaczej mogłaby być równa $k$).'])]);
  function gapEx(n) {
    const f = [...Array(n + 1).keys()].reduce((a, b) => a * (b + 1), 1), xs = [...Array(n).keys()].map(i => f + 2 + i);
    return mk({ gk: 'gapn', field: txtField(), q: T`Wskaż $${n}$ kolejnych liczb złożonych (konstrukcją z silnią).`, tex: T`${xs[0]},\ldots,${xs[n - 1]}`,
      steps: [T`$(${n}+1)!=${n + 1}!=${f}$.`, T`Liczby $${f}+k$ dla $k=2,\ldots,${n + 1}$: $${f}+k$ dzieli się przez $k$.`, T`Odpowiedź: $${xs[0]},\ldots,${xs[n - 1]}$.`],
      // błędne: przedziały długości n, w których jest liczba pierwsza (podajemy którą)
      wrong: [f - n, f + 1, f / (n + 1) + 1, f / (n + 1) + 2, f + 2 - n, f - 2 * n, f + n + 2, ...Array.from({ length: 80 }, (_, i) => f - 40 + i)].map(s => [s, [...Array(n).keys()].map(i => s + i).find(isP)]).filter(([s, pr]) => pr && s !== f + 2).slice(0, 3)
        .map(([s, pr]) => [T`${s},\ldots,${s + n - 1}`, T`$${pr}$ jest pierwsza. Konstrukcja: $(n+1)!+2,\ldots,(n+1)!+(n+1)$ — każda z tych liczb ma dzielnik $k$.`]) });
  }

  /* ===== opracowanie ===== */
  const F = {
    sito: W(T`<b>Sito Eratostenesa</b>: wypisz $2,3,\ldots,N$ i dla kolejnych liczb pierwszych $p$ skreślaj ich wielokrotności $p^2,\ p^2+p,\ p^2+2p,\ldots$`,
      T`Bierzemy najmniejszą nieskreśloną liczbę — jest pierwsza (nie dzieli jej nic mniejszego). Skreślamy jej wielokrotności.`,
      T`Zaczynamy od $p^2$, bo mniejsze wielokrotności $2p,3p,\ldots$ zostały już skreślone przez mniejsze liczby pierwsze.`,
      T`Kończymy na największej $p\leq\sqrt N$: liczba złożona $m=ab\leq N$ ma czynnik $\leq\sqrt m\leq\sqrt N$, więc już została skreślona.`,
      T`Przykład $N=50$: $\sqrt{50}\approx7{,}07$, więc wystarczy przesiać przez $2,3,5,7$. Zostaje $15$ liczb pierwszych.`),
    m_par: W(T`<b>Metoda: parzystość</b>. Jedyna parzysta liczba pierwsza to $2$ — sprawdź, czy któraś niewiadoma nie musi być parzysta.`,
      T`Porównaj parzystość obu stron równania. Np. $p^2=2q^2+1$: prawa strona jest nieparzysta, więc $p$ też.`,
      T`Podstaw $p=2k+1$ i sprawdź, co z tego wynika dla drugiej niewiadomej: $4k^2+4k=2q^2$, czyli $q^2=2k(k+1)$ — parzyste, więc $q=2$.`,
      T`Na koniec policz pozostałą niewiadomą i <b>sprawdź</b>, że jest pierwsza.`),
    m_rozkP: W(T`<b>Metoda: rozkład i czynnik 1</b>. Liczba pierwsza ma tylko rozkład $1\cdot p$ — jeśli wyrażenie to $A\cdot B$ z $B>1$, to musi być $A=1$.`,
      T`Rozłóż wyrażenie na iloczyn (wzory skróconego mnożenia, wyciąganie przed nawias, „dopisz i odejmij”).`,
      T`Pokaż, że większy czynnik jest $>1$, i przyrównaj mniejszy do $1$.`,
      T`Rozwiąż $A=1$ i sprawdź, czy wynik naprawdę daje liczbę pierwszą.`,
      T`Przykład: $n^4+4=(n^2-2n+2)(n^2+2n+2)$; drugi czynnik $\geq5$, więc $n^2-2n+2=1$, czyli $n=1$ — i $1+4=5$ jest pierwsza.`),
    m_podz: W(T`<b>Metoda: podzielność współczynników</b>. W $ap-bq=c$: jeśli liczba pierwsza $m$ dzieli $a$ i $c$, to dzieli też $bq$.`,
      T`Przenieś: $bq=ap-c$. Prawa strona dzieli się przez $m$, więc lewa też.`,
      T`Jeśli $(m,b)=1$, to z $m\mid bq$ wynika $m\mid q$; a $q$ jest pierwsza, więc $q=m$.`,
      T`Przykład $6p-22q=12$: dzielimy przez 2 — $3p-11q=6$; $3\mid 11q$, $(3,11)=1$, więc $q=3$ i $p=13$.`),
    m_nwp: W(T`<b>Metoda: nie wprost z dzielnikiem</b>. Żeby pokazać, że $n$ jest pierwsza, załóż, że ma dzielnik $1<a<n$, i dojdź do sprzeczności.`,
      T`Typowa sprzeczność: $a$ dzieli dwie liczby różniące się o $1$, więc dzieli $1$ — a $a>1$.`,
      T`Przykład: $a\mid(n-1)!$ (bo $a\leq n-1$) i $a\mid n\mid(n-1)!+1$, więc $a\mid1$.`,
      T`Pamiętaj o przypadku brzegowym (np. $n=1$ nie jest pierwsza).`),
    m_sil: W(T`<b>Silnia</b>: $n!=1\cdot2\cdots n$ dzieli się przez każdą liczbę $2,3,\ldots,n$.`,
      T`Stąd $n!+1$ daje resztę $1$ przy dzieleniu przez każdą z nich — żadna z nich nie jest jej dzielnikiem.`,
      T`A $(n+1)!+k$ dzieli się przez $k$ dla $2\leq k\leq n+1$ — to daje $n$ kolejnych liczb złożonych.`,
      T`Przykład $n=4$: $5!=120$, liczby $122,123,124,125$ dzielą się kolejno przez $2,3,4,5$.`),
    m_gen: W(T`<b>Rozwiązanie ogólne równania liniowego</b>: jeśli $(a,b)=1$ i $(x_0,y_0)$ spełnia $ax+by=c$, to wszystkie rozwiązania to $x=x_0+bt,\ y=y_0-at$.`,
      T`Podstaw: $a(x_0+bt)+b(y_0-at)=ax_0+by_0+abt-abt=c$ — działa dla każdego $t$.`,
      T`I nie ma innych: z $a(x-x_0)=-b(y-y_0)$ i $(a,b)=1$ wynika $b\mid x-x_0$.`,
      T`W zadaniach z liczbami pierwszymi: wypisz rozwiązanie ogólne i sprawdź, dla jakich $t$ obie liczby są pierwsze.`),
    wzory: W(T`<b>Wzory skróconego mnożenia</b>: $a^3\pm b^3=(a\pm b)(a^2\mp ab+b^2)$, $a^2-b^2=(a-b)(a+b)$, $a^4-b^4=(a-b)(a+b)(a^2+b^2)$.`,
      T`Sprawdź wymnażając: $(a+b)(a^2-ab+b^2)=a^3-a^2b+ab^2+a^2b-ab^2+b^3=a^3+b^3$.`,
      T`$a^4-b^4$ to dwa razy różnica kwadratów: $(a^2-b^2)(a^2+b^2)$, a potem $a^2-b^2=(a-b)(a+b)$.`,
      T`Trik „dopisz i odejmij”: $n^4+4=(n^2+2)^2-4n^2$ — różnica kwadratów.`),
    pierwsza: W(T`<b>Liczba pierwsza</b>: $p\geq2$, której jedynymi dzielnikami naturalnymi są $1$ i $p$. Liczba $1$ nie jest pierwsza.`,
      T`Jeśli $p=AB$ z $A,B\in\mathbb N$, to $A=1$ albo $B=1$ — z tego korzystają wszystkie zadania „kiedy wyrażenie jest pierwsze”.`,
      T`Jedyna parzysta liczba pierwsza to $2$.`,
      T`Każda liczba $\geq2$ ma dzielnik pierwszy (najmniejszy dzielnik $>1$ jest pierwszy).`),
  };
  A.addList({
    num: 22, id: 'e2', subject: 'etl', title: 'Lista 2', name: 'Liczby pierwsze', hue: 'e2',
    blurb: 'Sito Eratostenesa, równania w liczbach pierwszych, rozkłady na czynniki i dowody nie wprost.',
    tasks: [
      { id: 'E2.1', name: 'Sito Eratostenesa', statement: T`(a) Metodą sita Eratostenesa wyznacz wszystkie liczby pierwsze $\leq 140$. (b) Wyznacz $p_{35}$ — 35-tą liczbę pierwszą. (c) Na jakiej liczbie pierwszej można poprzestać przy odsiewaniu, gdy $n=1000$, a na jakiej, gdy $n=10000$?`, wzIds: ['sito', 'pierwsza'],
        gen: gk => (gk === 'sito' ? sieveCount(R.int(60, 200)) : gk === 'pk' ? kthPrime(R.int(15, 45)) : sieveStop(R.pick([500, 700, 2000, 3000, 5000, 6000, 8000, 20000, 50000]))),
        items: [P('(a)', sieveCount(140)), P('(b)', kthPrime(35)), P('(c) n=1000', sieveStop(1000)), P('(c) n=10000', sieveStop(10000))] },
      { id: 'E2.2', name: '$p^2-2q^2=1$', statement: T`Rozwiązać równanie $p^2-2q^2=1$, jeżeli wiadomo, że $p$ i $q$ są liczbami pierwszymi.`, wzIds: ['m_par', 'm_rozkP', 'pierwsza'], items: [it2] },
      { id: 'E2.3', name: '$6p-22q=12$', statement: T`Wyznaczyć wszystkie liczby pierwsze $p,q$ takie, że $6p-22q=12$.`, wzIds: ['m_podz', 'm_gen', 'pierwsza'], gen: genLin, items: [P('2.3', linPrime(3, 11, 2, 2))] },
      { id: 'E2.4', name: '$pq=140-p^2$', statement: T`Wyznaczyć wszystkie pary różnych liczb pierwszych $p,q$ spełniających równanie $pq=140-p^2$.`, wzIds: ['m_rozkP', 'pierwsza'], gen: genPq, items: [P('2.4', pqEq(140))] },
      { id: 'E2.5', name: '$a^3+b^3$ pierwsza', statement: T`Wyznacz wszystkie $a,b\in\mathbb N$, dla których liczba $a^3+b^3$ jest pierwsza.`, wzIds: ['m_rozkP', 'wzory', 'pierwsza'], items: [it5] },
      { id: 'E2.6', name: 'Iloczyn = 5 · suma', statement: T`Wyznacz wszystkie trójki liczb pierwszych, których iloczyn jest pięciokrotnie większy od ich sumy.`, wzIds: ['m_rozkP', 'pierwsza'], gen: () => triple(R.pick([3, 5, 7, 11])), items: [P('2.6', triple(5))] },
      { id: 'E2.7', name: 'Różnica sześcianów', statement: T`Wyznacz trzy liczby pierwsze, z których jedna jest różnicą sześcianów dwóch pozostałych.`, wzIds: ['m_rozkP', 'wzory', 'pierwsza'], items: [P('2.7', it7)] },
      { id: 'E2.8', name: '$a^4-b^4$ nie jest pierwsza', statement: T`Wykaż, że nie istnieją liczby całkowite $a,b$, dla których liczba $a^4-b^4$ jest pierwsza.`, wzIds: ['m_rozkP', 'wzory', 'pierwsza'], items: [it8] },
      { id: 'E2.9', name: '$n^4+4$', statement: T`Dla jakich $n\in\mathbb N$ liczba $n^4+4$ jest pierwsza?`, wzIds: ['m_rozkP', 'pierwsza'], items: [P('2.9', it9)] },
      { id: 'E2.10', name: '$n^4+n^2+1$', statement: T`Dla jakich $n\in\mathbb N$ liczba $n^4+n^2+1$ jest pierwsza?`, wzIds: ['m_rozkP', 'pierwsza'], items: [P('2.10', it10)] },
      { id: 'E2.11', name: '$27n^3-8$', statement: T`Dla jakich $n\in\mathbb N$ liczba $27n^3-8$ jest pierwsza?`, wzIds: ['m_rozkP', 'wzory', 'pierwsza'], gen: () => genC3(false), items: [P('2.11', cubeMinus(3, 2, false))] },
      { id: 'E2.12', name: '$27n^3+8$', statement: T`Czy istnieje liczba naturalna $n$ taka, że $27n^3+8$ jest pierwsza?`, wzIds: ['m_rozkP', 'wzory', 'pierwsza'], gen: () => genC3(true), items: [P('2.12', cubeMinus(3, 2, true))] },
      { id: 'E2.13', name: '$n\\mid(n-1)!+1$', statement: T`Udowodnij, że jeżeli $n$ jest taką liczbą naturalną, że $n\mid(n-1)!+1$, to $n$ jest liczbą pierwszą.`, wzIds: ['m_nwp', 'm_sil', 'pierwsza'], items: [it13] },
      { id: 'E2.14', name: 'Pierwsza w $[n,n!+1]$', statement: T`Udowodnij, że dla dowolnej liczby naturalnej $n$ w przedziale $[n,n!+1]$ znajduje się pewna liczba pierwsza. Wyprowadź stąd wniosek, że liczb pierwszych jest nieskończenie wiele.`, wzIds: ['m_sil', 'm_nwp', 'pierwsza'], items: [it14] },
      { id: 'E2.15', name: 'Przedział bez liczb pierwszych', statement: T`Dla dowolnej liczby naturalnej $n$ wskaż przedział długości $n$ niezawierający liczb pierwszych.`, wzIds: ['m_sil', 'pierwsza'], gen: gk => (gk === 'gapn' ? gapEx(R.int(3, 7)) : it15), items: [P('(dowód)', it15), P('(n = 5)', gapEx(5))] },
    ],
  });
  for (const t of A.lists.find(l => l.id === 'e2').tasks) t.wzLib = F;
  A.ETL2 = { isP, primes, sieveCount, kthPrime, sieveStop, linPrime, genLin, pqEq, genPq, triple, cubeMinus, genC3, gapEx };
})();
