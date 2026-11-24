/* Elementarna teoria liczb — Lista 3: NWD, NWW i równania diofantyczne.
   Rachunki (Euklides, rozwiązania ogólne) liczy kod, więc wygenerowane przykłady są zawsze poprawne. */
(function () {
  'use strict';
  const A = AQ, R = A.R, T = String.raw;
  const { S, M, proof, P, gcd, divs, W, mk, txtField, norm } = A.ETLH;
  const gcdN = xs => xs.reduce((a, b) => gcd(a, b));
  const lcm = (a, b) => Math.abs(a / gcd(a, b) * b);
  const egcd = (a, b) => { if (!b) return [Math.abs(a), Math.sign(a) || 1, 0]; const [g, x, y] = egcd(b, a % b); return [g, y, x - Math.trunc(a / b) * y]; };
  const isP = n => { if (n < 2) return false; for (let i = 2; i * i <= n; i++) if (n % i === 0) return false; return true; };
  // wyrażenie liniowe: lin([7,4],['a','b']) = 7a+4b; zmienna '' to wyraz wolny
  const linV = (cs, vs) => { let s = ''; cs.forEach((c, i) => { if (!c) return; const a = Math.abs(c), v = vs[i]; s += (c < 0 ? '-' : s ? '+' : '') + (a === 1 && v ? '' : a) + v; }); return s || '0'; };
  const pm = c => (c < 0 ? '-' + Math.abs(c) : '+' + c);
  const tsign = (c, v) => (c === 0 ? '' : (c < 0 ? '-' : '+') + (Math.abs(c) === 1 ? '' : Math.abs(c)) + v);
  const aff = (c0, terms) => { const t = terms.map(([k, v]) => tsign(k, v)).join(''); return c0 ? String(c0) + t : t ? t.replace(/^\+/, '') : '0'; };

  /* ===== algorytm Euklidesa ===== */
  function euclidRows(a, b) { const rows = []; while (b) { rows.push([a, b, Math.floor(a / b), a % b]); [a, b] = [b, a % b]; } return rows; }
  const rowsT = rows => rows.map(([a, b, q, r]) => T`$${a}=${q}\cdot ${b}+${r}$`).join(', ');
  function gcdItem(nums) {
    const g = gcdN(nums), steps = [];
    if (nums.length === 2) {
      const rows = euclidRows(Math.max(...nums), Math.min(...nums));
      steps.push('Algorytm Euklidesa: ' + rowsT(rows) + '.', T`Ostatnia niezerowa reszta: $(${nums.join(',')})=${g}$.`);
    } else {
      const g1 = gcd(nums[0], nums[1]);
      steps.push(T`$(a,b,c)=((a,b),c)$ — liczymy po kolei.`, T`$(${nums[0]},${nums[1]})$: ` + rowsT(euclidRows(Math.max(nums[0], nums[1]), Math.min(nums[0], nums[1]))) + T`, więc $(${nums[0]},${nums[1]})=${g1}$.`);
      steps.push(T`$(${g1},${nums[2]})$: ` + rowsT(euclidRows(Math.max(g1, nums[2]), Math.min(g1, nums[2]))) + T`. Zatem $(${nums.join(',')})=${g}$.`);
    }
    const wrong = [];
    if (nums.length === 3) { const g1 = gcd(nums[0], nums[1]); if (g1 !== g) wrong.push([String(g1), T`To tylko $(${nums[0]},${nums[1]})$ — trzeba jeszcze uwzględnić $${nums[2]}$.`]); }
    const rows = euclidRows(Math.max(nums[0], nums[1]), Math.min(nums[0], nums[1]));
    if (rows.length > 1) { const prev = rows[rows.length - 2][1]; if (prev !== g) wrong.push([String(prev), 'To przedostatni dzielnik — NWD to ostatnia niezerowa reszta.']); }
    for (const p of [2, 3, 5, 7, 11, 13]) { if (wrong.length >= 3) break; const v = g * p; if (!nums.every(x => x % v === 0)) wrong.push([String(v), T`$${v}$ nie dzieli wszystkich liczb, np. $${nums.find(x => x % v)}$.`]); }
    if (g !== 1) wrong.push(['1', T`Liczby mają wspólny dzielnik $${g}$.`]);
    return mk({ gk: nums.length === 2 ? 'nwd' : 'nwd3', ans: g, tex: String(g), flabel: 'NWD', q: T`Oblicz $(${nums.join(',')})$.`, steps, wrong });
  }
  const genGcd = gk => { for (;;) { const g = R.pick([1, 2, 3, 6, 7, 9, 11, 12, 13, 14, 15, 18, 21, 26]); const k = gk === 'nwd3' ? 3 : 2; const ms = [...Array(k)].map(() => R.int(5, 90)); if (gcdN(ms) !== 1 || new Set(ms).size < k) continue; return gcdItem(ms.map(m => m * g)); } };

  /* ===== tożsamość Bézouta (rozszerzony Euklides) ===== */
  function bezoutRows(a, b) { // reszty jako kombinacje a i b
    let r0 = a, r1 = b, x0 = 1, y0 = 0, x1 = 0, y1 = 1; const out = [];
    while (r1) { const q = Math.floor(r0 / r1); [r0, r1] = [r1, r0 - q * r1]; [x0, x1] = [x1, x0 - q * x1]; [y0, y1] = [y1, y0 - q * y1]; if (r1) out.push([r1, x1, y1]); }
    return { g: r0, x: x0, y: y0, out };
  }
  const combT = (a, b, x, y) => T`${a}\cdot ${x < 0 ? '(' + x + ')' : x}+${b}\cdot ${y < 0 ? '(' + y + ')' : y}`;
  // kombinacja w „ludzkiej” postaci: 29·990 − 7·4095 (najpierw wyraz dodatni)
  const termsT = ps => { const q = ps.filter(([k]) => k).sort((u, v) => (v[0] > 0) - (u[0] > 0)); let s = ''; for (const [k, n] of q) { const m = Math.abs(k); s += (k < 0 ? '-' : s ? '+' : '') + (m === 1 ? '' : m + '\\cdot ') + n; } return s || '0'; };
  // algorytm Euklidesa + cofanie: każdą resztę zapisujemy przez a i b (w kolejności z zadania); każdy krok to osobna linijka
  function backSub(a, b) {
    const big = Math.max(a, b), small = Math.min(a, b), co = n => (n === a ? [1, 0] : [0, 1]);
    let r0 = big, r1 = small, c0 = a === b ? [1, 0] : co(big), c1 = a === b ? [0, 1] : co(small), o0 = true, o1 = true;
    const rows = [], lines = [], cT = c => termsT([[c[0], a], [c[1], b]]);
    for (;;) {
      const q = Math.floor(r0 / r1), r = r0 - q * r1; rows.push([r0, r1, q, r]);
      if (!r) break;
      const c = [c0[0] - q * c1[0], c0[1] - q * c1[1]];
      let ln = T`$${r}=${r0}-${q === 1 ? '' : q + '\\cdot '}${r1}$`;
      if (!(o0 && o1)) ln += T` $=${o0 ? r0 : T`\left(${cT(c0)}\right)`}-${o1 ? (q === 1 ? '' : q + '\\cdot ') + r1 : (q === 1 ? '' : q) + T`\left(${cT(c1)}\right)`}$ $=${cT(c)}$`;
      lines.push(ln);
      r0 = r1; r1 = r; c0 = c1; c1 = c; o0 = o1; o1 = false;
    }
    return { rows, lines, g: r1, x: c1[0], y: c1[1] };
  }
  // opis: Euklides w przód, potem cofanie
  const backSubSteps = (a, b) => {
    const bs = backSub(a, b), lo = Math.min(a, b), hi = Math.max(a, b);
    const out = [T`Algorytm Euklidesa dla $${a}$ i $${b}$: ` + rowsT(bs.rows) + T`. Ostatnia niezerowa reszta: $(${a},${b})=${bs.g}$.`];
    if (bs.lines.length) out.push(T`Cofamy się od góry: z każdej równości wyznaczamy resztę i wstawiamy za wcześniejsze reszty ich zapis przez $${a}$ i $${b}$. Potem wymnażamy nawias i zbieramy osobno wielokrotności $${a}$ i $${b}$.`, ...bs.lines);
    else out.push(T`$${lo}$ dzieli $${hi}$, więc $(${a},${b})=${lo}=${lo === a ? combT(a, b, 1, 0) : combT(a, b, 0, 1)}$ — nie ma czego cofać.`);
    return { bs, out };
  };
  function bezSteps(nums) {
    const vars = ['x', 'y', 'z', 't'].slice(0, nums.length), g = gcdN(nums);
    let sol, steps;
    const pairSteps = null;
    void pairSteps;
    if (nums.length === 2) { const { bs, out } = backSubSteps(nums[0], nums[1]); sol = [bs.x, bs.y]; steps = [...out, T`Zatem $${combT(nums[0], nums[1], bs.x, bs.y)}=${g}$, czyli $x=${bs.x},\ y=${bs.y}$.`]; }
    else {
      // redukcja: d_k = (d_{k-1}, a_k) = d_{k-1}·u + a_k·v
      const cmb = (ns, cs) => ns.map((a, i) => (i ? '+' : '') + a + '\\cdot ' + (cs[i] < 0 ? '(' + cs[i] + ')' : cs[i])).join('');
      let d = nums[0], co = [1]; steps = [T`NWD kilku liczb liczymy po kolei: $(${nums.join(',')})=${'('.repeat(nums.length - 2)}(${nums[0]},${nums[1]})${nums.slice(2).map(n => ',' + n + ')').join('')}$. Za każdym razem zapisujemy otrzymany NWD jako kombinację.`];
      for (let k = 1; k < nums.length; k++) {
        const bs = backSub(d, nums[k]);
        steps.push(T`<b>Krok ${k}:</b> $(${d},${nums[k]})$. ` + rowsT(bs.rows) + T`, więc $(${d},${nums[k]})=${bs.g}$.`);
        if (bs.lines.length) steps.push(...bs.lines);
        const natT = (ns, cs) => termsT(ns.map((a, i) => [cs[i], a]));
        steps.push(T`Czyli $${bs.g}=${natT([d, nums[k]], [bs.x, bs.y])}$.` + (k > 1 && bs.x ? T` Za $${d}$ wstawiamy zapis z poprzedniego kroku: $${d}=${natT(nums.slice(0, k), co)}$.` : ''));
        if (k > 1 && bs.x) steps.push(T`$${bs.g}=${bs.x === 1 ? '' : bs.x === -1 ? '-' : bs.x}\left(${natT(nums.slice(0, k), co)}\right)$ $${bs.y < 0 ? '-' : '+'}${Math.abs(bs.y) === 1 ? '' : Math.abs(bs.y) + '\\cdot '}${nums[k]}$ $=${natT(nums.slice(0, k + 1), co.map(c => c * bs.x).concat([bs.y]))}$`);
        co = co.map(c => c * bs.x).concat([bs.y]); d = bs.g;
      }
      sol = co; steps.push(T`Stąd $${vars.map((v, i) => v + '=' + sol[i]).join(',\\ ')}$. Sprawdzenie: $${cmb(nums, sol)}$ $=${nums.map((a, i) => a * sol[i]).map((v, i) => (i && v >= 0 ? '+' : '') + v).join('')}$ $=${g}$ ✓.`);
    }
    return { sol, steps };
  }
  function bezout(nums) {
    const vars = ['x', 'y', 'z', 't'].slice(0, nums.length), eq = linV(nums, vars), g = gcdN(nums);
    const { sol, steps } = bezSteps(nums);
    const val = xs => nums.reduce((s, a, i) => s + a * xs[i], 0);
    const solT = xs => vars.map((v, i) => v + '=' + xs[i]).join(',\\ ');
    const cands = [[sol.map((x, i) => (i === 0 ? -x : x)), 'Zły znak przy $x$ — sprawdź podstawiając.'], [sol.map((x, i) => (i === 1 ? -x : x)), 'Zły znak przy $y$ — sprawdź podstawiając.'], [sol.slice().reverse(), 'Zamienione wartości — każda liczba ma swój współczynnik.'], [sol.map((x, i) => x + (i === 0 ? nums[1] / g : i === 1 ? nums[0] / g : 0)), 'Przesunięcie rozwiązania robimy z przeciwnymi znakami: $x+\\frac bd t,\\ y-\\frac ad t$.'], [sol.map((x, i) => (i === 0 ? x + 1 : x)), 'Błąd przy cofaniu się w algorytmie.']]
      .filter(([xs]) => val(xs) !== g).map(([xs, why]) => [solT(xs), why]);
    return mk({ gk: nums.length === 2 ? 'bez' : 'bez3', field: txtField(), q: T`Znajdź liczby całkowite $${vars.join(',')}$ takie, że $${eq}=(${nums.join(',')})$.`, tex: solT(sol), steps, wrong: cands });
  }
  const genBez = gk => { for (;;) { const k = gk === 'bez3' ? 3 : 2; const g = R.pick([1, 2, 3, 6, 9, 13, 17]); const ms = [...Array(k)].map(() => R.int(4, 60)); if (gcdN(ms) !== 1) continue; return bezout(ms.map(m => m * g)); } };

  /* ===== 1. pociągi: NWD trzech liczb ===== */
  function trains(xs) {
    const g = gcdN(xs), w = xs.map(x => x / g), steps = [T`Liczba żołnierzy w wagonie dzieli każdą z liczb $${xs.join(',')}$; największa taka liczba to $(${xs.join(',')})$.`, T`Algorytm Euklidesa dla $${xs[0]}$ i $${xs[1]}$: ` + rowsT(euclidRows(xs[1], xs[0])) + T`, więc $(${xs[0]},${xs[1]})=${gcd(xs[0], xs[1])}$.`, T`Teraz $(${gcd(xs[0], xs[1])},${xs[2]})$: ` + rowsT(euclidRows(Math.max(xs[2], gcd(xs[0], xs[1])), Math.min(xs[2], gcd(xs[0], xs[1])))) + T`, więc $(${xs.join(',')})=${g}$.`];
    return [mk({ gk: 'trainG', ans: g, tex: String(g), flabel: 'żołnierzy', q: T`Przez stację przejechały trzy pociągi: z $${xs[0]}$, $${xs[1]}$ i $${xs[2]}$ żołnierzami. W każdym wagonie była ta sama, największa możliwa liczba żołnierzy. Ilu żołnierzy było w wagonie?`, steps: steps.concat([T`W każdym wagonie: $${g}$ żołnierzy.`]),
      wrong: [[String(gcd(xs[0], xs[1])) === String(g) ? String(g * 2) : String(gcd(xs[0], xs[1])), 'Trzeba uwzględnić wszystkie trzy pociągi.'], [String(lcm(lcm(xs[0], xs[1]), xs[2])), 'To NWW — a liczba w wagonie ma dzielić liczby żołnierzy.']] }),
    mk({ gk: 'trainW', field: txtField(), q: T`Pociągi wiozły $${xs[0]}$, $${xs[1]}$ i $${xs[2]}$ żołnierzy, w każdym wagonie tyle samo — największa możliwa liczba. Z ilu wagonów składały się pociągi?`, tex: T`${w.join(',\\ ')}`,
      steps: steps.concat([T`Wagony: $${xs[0]}:${g}=${w[0]}$, $${xs[1]}:${g}=${w[1]}$, $${xs[2]}:${g}=${w[2]}$.`]),
      wrong: [[w.map(x => x * 2).join(',\\ '), 'To wynik dla dzielnika dwa razy mniejszego — nie największego.'], [w.map(x => x + 1).join(',\\ '), 'Pomyłka przy dzieleniu.'], [xs.map(x => x / gcd(xs[0], xs[1]) * (gcd(xs[0], xs[1]) === g ? 3 : 1)).join(',\\ '), 'Trzeba dzielić przez NWD wszystkich trzech liczb.']] })];
  }
  const genTrains = gk => { for (;;) { const g = R.int(12, 60), ms = [R.int(5, 20), R.int(5, 20), R.int(5, 20)]; if (gcdN(ms) !== 1 || new Set(ms).size < 3) continue; return trains(ms.sort((a, b) => a - b).map(m => m * g))[gk === 'trainW' ? 1 : 0]; } };

  /* ===== 2. ta sama liczba, dane reszty ===== */
  function sameRem(a, r1, b, r2) {
    const x = a - r1, y = b - r2, g = gcd(x, y), mx = Math.max(r1, r2), sol = divs(g).filter(d => d > mx);
    return mk({ gk: 'rem', ans: sol[0], tex: String(sol[0]), flabel: 'dzielnik', q: T`Liczby $${a}$ oraz $${b}$ podzielono przez tę samą liczbę naturalną i otrzymano odpowiednio reszty $${r1}$ i $${r2}$. Znajdź tę liczbę.`,
      steps: [T`Z definicji reszty: $${a}=d\cdot q_1+${r1}$ i $${b}=d\cdot q_2+${r2}$. Zatem $d\cdot q_1=${a}-${r1}=${x}$ i $d\cdot q_2=${b}-${r2}=${y}$, czyli $d$ dzieli obie liczby, a więc dzieli ich NWD: $d\mid(${x},${y})$.`, 'Algorytm Euklidesa: ' + rowsT(euclidRows(Math.max(x, y), Math.min(x, y))) + T`, więc $(${x},${y})=${g}$.`, T`Reszta jest mniejsza od dzielnika, więc $d>${mx}$. Dzielniki $${g}$ większe od $${mx}$: $${sol.join(',')}$. Odpowiedź: $d=${sol.join(',')}$.`],
      wrong: [[String(gcd(a, b)), 'Najpierw trzeba odjąć reszty — dzielnik dzieli $' + a + '-' + r1 + '$, a nie $' + a + '$.'], [String(divs(g).filter(d => d <= mx).pop() || g * 3), T`Reszta musi być mniejsza od dzielnika, a tu $${mx}$ by nie pasowało.`], [String(gcd(a - r2, b - r1)), 'Reszty zamienione miejscami.']] });
  }
  const genRem = () => { for (;;) { const d = R.int(9, 40), r1 = R.int(1, d - 1), r2 = R.int(1, d - 1); const a = d * R.int(20, 300) + r1, b = d * R.int(20, 300) + r2; const g = gcd(a - r1, b - r2); if (divs(g).filter(x => x > Math.max(r1, r2)).length !== 1) continue; return sameRem(a, r1, b, r2); } };

  /* ===== 5. układy z NWD i NWW ===== */
  const pairsT = ps => (ps.length ? T`(x,y)\in\{${ps.map(([x, y]) => `(${x},${y})`).join(',\\quad ')}\}` : T`\text{brak rozwiązań}`);
  const coprimeSplits = (sumOrProd, kind) => { const r = []; if (kind === 'sum') { for (let a = 1; a < sumOrProd; a++) r.push([a, sumOrProd - a]); } else for (const a of divs(sumOrProd)) r.push([a, sumOrProd / a]); return r; };
  function nwdSys(kind, V, d) { // kind: sum (x+y=V), prod (xy=V), lcm ([x,y]=V)
    const K = kind === 'sum' ? V / d : kind === 'prod' ? V / (d * d) : V / d;
    const all = coprimeSplits(K, kind === 'sum' ? 'sum' : 'prod'), good = all.filter(([a, b]) => gcd(a, b) === 1);
    const sol = good.map(([a, b]) => [a * d, b * d]);
    const cond = kind === 'sum' ? T`x+y=${V},\ (x,y)=${d}` : kind === 'prod' ? T`xy=${V},\ (x,y)=${d}` : T`(x,y)=${d},\ [x,y]=${V}`;
    const eqT = kind === 'sum' ? T`${d}a+${d}b=${V}\Rightarrow a+b=${K}` : kind === 'prod' ? T`${d}a\cdot ${d}b=${V}\Rightarrow ab=${K}` : T`[x,y]=${d}ab=${V}\Rightarrow ab=${K}`;
    const half = sol.filter(([x, y]) => x <= y);
    return mk({ gk: kind, field: txtField(), q: T`Rozwiąż w liczbach naturalnych: $${cond}$.`, tex: pairsT(sol),
      steps: [T`Skoro $(x,y)=${d}$, to $x=${d}a,\ y=${d}b$, gdzie $(a,b)=1$${kind === 'lcm' ? T` (wtedy $[x,y]=${d}ab$)` : ''}.`, T`$${eqT}$.`, T`Pary $(a,b)$ względnie pierwsze: ` + (good.length ? good.map(([a, b]) => `$(${a},${b})$`).join(', ') : 'brak') + (all.length > good.length && all.length < 14 ? T` (odrzucamy ` + all.filter(([a, b]) => gcd(a, b) !== 1).map(([a, b]) => `$(${a},${b})$`).join(', ') + ')' : '') + '.', T`Odpowiedź: $${pairsT(sol)}$.`],
      wrong: [[pairsT(all.map(([a, b]) => [a * d, b * d])), 'Bez warunku $(a,b)=1$ dostajemy pary o większym NWD.'], [pairsT(half), 'Pary uporządkowane: $(x,y)$ i $(y,x)$ to dwa różne rozwiązania.'], [pairsT(good.map(([a, b]) => [a, b])), 'To pary $(a,b)$ — trzeba jeszcze pomnożyć przez ' + d + '.'], [pairsT(sol.slice(1)), 'Brakuje rozwiązania — sprawdź wszystkie pary $(a,b)$.'], [T`\text{brak rozwiązań}`, 'Rozwiązania istnieją — np. ' + (sol[0] ? '$(' + sol[0].join(',') + ')$' : '') + '.'], [pairsT(sol.map(([x, y]) => [x * 2, y * 2])), 'Wtedy NWD byłby ' + 2 * d + ', a nie ' + d + '.']] });
  }
  const genNwdSys = gk => { for (;;) { const d = R.pick([2, 3, 4, 5, 6, 7, 10, 12, 15]); const kind = gk; const K = R.int(4, 40); const V = kind === 'sum' ? d * K : kind === 'prod' ? d * d * K : d * K; const it = nwdSys(kind, V, d); const n = (it.mcCorrect.match(/\(\d+,\d+\)/g) || []).length; if (n < 2 || n > 8) continue; return it; } };
  const brute = (pred, X, Y) => { const r = []; for (let x = 1; x <= X; x++) for (let y = 1; y <= Y; y++) if (pred(x, y)) r.push([x, y]); return r; };
  const sys5b = mk({ gk: 'ratio', field: txtField(), q: T`Rozwiąż w liczbach naturalnych: $7x=11y,\ (x,y)=45$.`, tex: pairsT([[495, 315]]),
    steps: [T`$7x=11y$ i $(7,11)=1$, więc $11\mid x$: $x=11t$, wtedy $y=7t$.`, T`$(x,y)=(11t,7t)=t\cdot(11,7)=t$, więc $t=45$.`, T`Odpowiedź: $x=495,\ y=315$.`],
    wrong: [[pairsT([[315, 495]]), 'Sprawdź: $7\\cdot315\\neq11\\cdot495$.'], [pairsT([[11, 7]]), 'Wtedy $(x,y)=1$, a nie 45.'], [pairsT([[495, 315], [315, 495]]), 'Równanie $7x=11y$ nie jest symetryczne.']] });
  const sol5e = brute((x, y) => x + y === 667 && lcm(x, y) === 120 * gcd(x, y), 667, 667);
  const sys5e = mk({ gk: 'lcmsum', field: txtField(), q: T`Rozwiąż w liczbach naturalnych: $x+y=667,\ [x,y]=120\,(x,y)$.`, tex: pairsT(sol5e),
    steps: [T`$x=da,\ y=db$, $(a,b)=1$, $d=(x,y)$. Wtedy $[x,y]=dab$, więc $dab=120d$, czyli $ab=120$.`, T`$x+y=d(a+b)=667=23\cdot29$, więc $a+b$ dzieli $667$: $a+b\in\{1,23,29,667\}$. Szukamy $a,b$ o danej sumie i iloczynie $120$ (to pierwiastki $u^2-(a+b)u+120=0$).`, T`$a+b=23$: $8\cdot15=120$ ✓, wtedy $d=667:23=29$. $\ a+b=29$: $5\cdot24=120$ ✓, $d=23$. Sumy $1$ i $667$ nie dają iloczynu $120$. Obie pary są względnie pierwsze, więc $(x,y)=(29\cdot8,29\cdot15)$ lub $(23\cdot5,23\cdot24)$ i pary zamienione.`, 'Odpowiedź: ' + sol5e.map(([x, y]) => `$(${x},${y})$`).join(', ') + '.'],
    wrong: [[pairsT(sol5e.filter(([x, y]) => x < y)), 'Pary uporządkowane — dopisz zamienione.'], [pairsT([[232, 435], [435, 232]]), T`Brakuje przypadku $a+b=29$.`], [pairsT([[8, 15], [5, 24]]), 'To pary $(a,b)$ — trzeba pomnożyć przez $d$.']] });
  const sol5f = brute((x, y) => lcm(x, 2 * y) === 308 && gcd(3 * x, 5 * y) === 7, 308, 154);
  const sys5f = mk({ gk: 'lcm2', field: txtField(), q: T`Rozwiąż w liczbach naturalnych: $[x,2y]=308,\ (3x,5y)=7$.`, tex: pairsT(sol5f),
    steps: [T`$(3x,5y)=7$, więc $7\mid 3x$ i $7\mid 5y$; ponieważ $(7,3)=(7,5)=1$, to $7\mid x$ i $7\mid y$. Piszemy $x=7a$, $y=7b$.`,
      T`Wtedy $(3x,5y)=7\cdot(3a,5b)=7$, czyli $(3a,5b)=1$: liczby $a,b$ są względnie pierwsze, $3\nmid b$ i $5\nmid a$.`,
      T`$[x,2y]=[7a,14b]=7\cdot[a,2b]=308$, czyli $[a,2b]=44=2^2\cdot11$. Zatem $a\mid44$ i $2b\mid44$, czyli $a\in\{1,2,4,11,22,44\}$, $b\in\{1,2,11,22\}$.`,
      T`Sprawdzamy pary z $(a,b)=1$: $a=1,b=22$: $[1,44]=44$ ✓; $a=4,b=11$: $[4,22]=44$ ✓; $a=11,b=2$: $[11,4]=44$ ✓; $a=44,b=1$: $[44,2]=44$ ✓. Pozostałe dają $[a,2b]<44$ (np. $a=2,b=11$: $[2,22]=22$) albo mają wspólny dzielnik.`,
      T`Mnożymy przez $7$. Odpowiedź: $${pairsT(sol5f)}$.`],
    wrong: [[pairsT(brute((x, y) => lcm(x, 2 * y) === 308 && x % 7 === 0 && y % 7 === 0, 308, 154).filter(([x, y], i) => sol5f.some(([a, b]) => a === x && b === y) || i % 4 === 1)), 'Nie sprawdzono warunku $(3x,5y)=7$ — np. $3$ albo $5$ też mogą być wspólnym dzielnikiem.'], [pairsT(sol5f.map(([x, y]) => [y, x])), 'Zamienione $x$ i $y$ — warunki nie są symetryczne.'], [pairsT(sol5f.slice(0, 1)), 'Brakuje rozwiązań — sprawdź wszystkich kandydatów.']] });

  /* ===== 6. (pa+qb, ra+sb) = (a,b) ===== */
  // Euklides na wektorach współczynników; zwraca kolejne pary (do zapisu (u,v)=(u',v')=…)
  function vecEuclid(U, V, stopUnit) {
    const seq = [[U, V]]; let u = U.slice(), v = V.slice();
    const isUnit = w => w[0] === 0 && Math.abs(w[1]) === 1;
    for (let it = 0; it < 30; it++) {
      if (stopUnit && (isUnit(u) || isUnit(v))) break;
      if (u[0] === 0 || v[0] === 0) { const z = u[0] === 0 ? u : v, o = u[0] === 0 ? v : u; if (o[1] === 0 || z[1] === 0) break; const k = Math.round(o[1] / z[1]); const no = [o[0], o[1] - k * z[1]]; if (u[0] === 0) v = no; else u = no; seq.push([u.slice(), v.slice()]); continue; }
      if (Math.abs(u[0]) >= Math.abs(v[0])) { const k = Math.trunc(u[0] / v[0]); u = [u[0] - k * v[0], u[1] - k * v[1]]; } else { const k = Math.trunc(v[0] / u[0]); v = [v[0] - k * u[0], v[1] - k * u[1]]; }
      seq.push([u.slice(), v.slice()]);
    }
    return seq;
  }
  const chainT = (seq, vs, tail) => { const lst = seq[seq.length - 1]; if (tail === '=(a,b)' && linV(lst[0], vs) === 'a' && linV(lst[1], vs) === 'b') tail = ''; return chainT0(seq, vs, tail); };
  const chainT0 = (seq, vs, tail) => '\\begin{aligned}[t]' + seq.map(([u, v], i) => (i ? '\\\\&=' : '&') + '(' + linV(u, vs) + ',' + linV(v, vs) + ')').join('') + (tail || '') + '\\end{aligned}';
  function gcdComb(p, q, r, s) {
    const D = p * s - q * r, u = linV([p, q], ['a', 'b']), v = linV([r, s], ['a', 'b']);
    // a = (s·U − q·V)/D, b = (−r·U + p·V)/D
    const aC = [s / D, -q / D], bC = [-r / D, p / D];
    const combU = (c, w) => linV(c, ['(' + u + ')', '(' + v + ')']);
    const qq = T`Wykaż, że dla dowolnych liczb całkowitych $a,b$ (nie obu równych zeru) zachodzi $(${u},${v})=(a,b)$.`;
    const seq = vecEuclid([p, q], [r, s], false);
    return proof('', 'gcomb', qq, [
      M('Wzajemna podzielność', 'Pokaż, że $d=(a,b)$ i $e=(' + u + ',' + v + ')$ dzielą się nawzajem.', T`$d$ dzieli obie kombinacje, a $a$ i $b$ dają się wyrazić przez $${u}$ i $${v}$: $a=${combU(aC)}$, $b=${combU(bC)}$.`,
        [S('Oznaczenia', 'Co oznaczyć?', T`$d=(a,b)$, $e=(${u},${v})$`, T`Niech $d=(a,b)$ i $e=(${u},${v})$. Pokażemy, że $d\mid e$ i $e\mid d$.`, 'Dwie liczby naturalne dzielące się nawzajem są równe.', ['$d=a+b$', 'NWD, a nie suma.'], ['$d=ab$', 'NWD, a nie iloczyn.']),
         S('d | e', T`Dlaczego $d\mid e$?`, T`$d$ dzieli $${u}$ i $${v}$`, T`$d\mid a$ i $d\mid b$, więc $d$ dzieli każdą kombinację: $d\mid ${u}$ i $d\mid ${v}$. Zatem $d\mid e$.`, 'Wspólny dzielnik dzieli NWD.', ['Bo $d\\leq e$', 'Nierówność nie daje podzielności.'], ['Bo $e$ jest pierwsze', 'Nie wiemy tego.']),
         S('Odwrócenie', T`Jak wyrazić $a$ i $b$ przez $${u}$ i $${v}$?`, T`$a=${combU(aC)}$, $b=${combU(bC)}$`, T`$a=${combU(aC)}$, $\ b=${combU(bC)}$. Sprawdzenie dla $a$: $${combU(aC)}$ $=${linV([aC[0] * p + aC[1] * r, 0], ['a', 'b']) === 'a' ? linV([aC[0] * p, aC[0] * q], ['a', 'b']) + (aC[1] * r >= 0 ? '+' : '') + linV([aC[1] * r, aC[1] * s], ['a', 'b']) : ''}$ $=a$ ✓ (dla $b$ tak samo).`, T`Rozwiązujemy układ dla $a,b$ — wyznacznik $${p}\cdot ${s}-${q}\cdot ${r}=${D}$ to $\pm1$, więc współczynniki są całkowite.`, [T`$a=${combU([s, q])}$`, 'Sprawdź wymnażając — znaki się nie zgadzają.'], ['Nie da się', 'Da się, bo wyznacznik układu to $\\pm1$.']),
         S('e | d i wniosek', T`Co wynika z $e\mid ${u}$, $e\mid ${v}$?`, T`$e\mid a$, $e\mid b$, więc $e\mid d$, czyli $e=d$`, T`$e$ dzieli obie kombinacje, więc $e\mid a$ i $e\mid b$, czyli $e\mid d$. Skoro $d\mid e$, $e\mid d$ i $d,e>0$, to $d=e$. $\blacksquare$`, 'Dodatniość NWD jest potrzebna — inaczej mogłoby być $d=-e$.', ['$e=2d$', 'Wzajemna podzielność daje równość.'], ['$e\\leq d$ tylko', 'Mamy też $d\\mid e$.'])],
        [[T`$d=(a,b)$ dzieli $${u}$ i $${v}$, więc $d\mid e$.`, 'pierwsza podzielność'], [T`$a=${combU(aC)}$, $b=${combU(bC)}$.`, 'odwrócenie (z wymnożeniem)'], [T`Stąd $e\mid a$, $e\mid b$, więc $e\mid d$; $d,e>0\Rightarrow d=e$. $\blacksquare$`, 'druga podzielność i wniosek']],
        ['Pokazanie tylko jednej podzielności.', 'Wzory na $a$, $b$ bez sprawdzenia.']),
      M('Euklides na wyrażeniach', 'Odejmuj wielokrotności jednego wyrażenia od drugiego — NWD się nie zmienia.', T`$(x,y)=(x,y-kx)$; po kilku krokach dojdziemy do $(a,b)$.`,
        [S('Zasada', 'Jaką własność NWD wykorzystamy?', '$(x,y)=(x,y-kx)$ dla całkowitego $k$', T`Dla całkowitych $x,y,k$: $(x,y)=(x,y-kx)$ — wspólne dzielniki obu par są te same.`, 'Jeśli $t\\mid x$ i $t\\mid y$, to $t\\mid y-kx$, i odwrotnie.', ['$(x,y)=(x,y+1)$', 'Dodanie 1 zmienia NWD.'], ['$(x,y)=(x,ky)$', 'Mnożenie może zmienić NWD.']),
         S('Redukcja', 'Jak zredukować wyrażenia?', T`$${chainT(seq, ['a', 'b'])}$`, T`$${chainT(seq, ['a', 'b'], '=(a,b)')}$.`, 'Za każdym razem odejmujemy wielokrotność jednego wyrażenia od drugiego.', ['Dzielimy oba przez $a$', 'Dzielenie nie jest dozwolone — tylko odejmowanie wielokrotności.'], ['Dodajemy oba wyrażenia', 'Suma zastępuje jedno z nich dopiero po odjęciu.']),
         S('Wniosek', 'Co dostaliśmy?', T`$(${u},${v})=(a,b)$`, T`Na końcu zostały $\pm a$ i $\pm b$, a znak nie zmienia NWD. Zatem $(${u},${v})=(a,b)$. $\blacksquare$`, '$(x,y)=(-x,y)$.', ['$(a,b)=1$', 'Nie wiemy, czy $a,b$ są względnie pierwsze.'], ['$(' + u + ',' + v + ')=a$', 'Zostały dwa wyrażenia, nie jedno.'])],
        [[T`$(x,y)=(x,y-kx)$.`, 'przywołana własność'], [T`$${chainT(seq, ['a', 'b'], '=(a,b)')}$. $\blacksquare$`, 'poprawne przekształcenia']],
        ['Przekształcenia bez wskazania, z jakiej własności korzystamy.'])]);
  }
  const genGcomb = () => { for (;;) { const p = R.int(2, 12), q = R.int(1, 9), r = R.int(2, 12); for (const D of [1, -1]) { if ((D + q * r) % p === 0) { const s = (D + q * r) / p; if (s >= 1 && s <= 15 && !(p === r && q === s)) return gcdComb(p, q, r, s); } } } };

  /* ===== 7a. ułamek (an+b)/(cn+d) nieskracalny ===== */
  function fracIrr(a, b, c, d) {
    const D = a * d - b * c, num = linV([a, b], ['n', '']), den = linV([c, d], ['n', '']);
    const q = T`Udowodnij, że dla każdego $n\in\mathbb N$ ułamek $\dfrac{${num}}{${den}}$ jest nieskracalny.`;
    // c·(an+b) − a·(cn+d) = bc − ad = −D
    const seq = vecEuclid([a, b], [c, d], true);
    const last = seq[seq.length - 1];
    return proof('', 'frac', q, [
      M('Kombinacja liniowa', 'Dobierz mnożniki tak, żeby $n$ się skróciło — zostanie stała.', T`$${c}(${num})-${a}(${den})=${-D}$, więc wspólny dzielnik licznika i mianownika dzieli $${Math.abs(D)}=1$.`,
        [S('Wspólny dzielnik', 'Co zakładamy?', T`$d$ dzieli $${num}$ i $${den}$`, T`Niech $d=(${num},${den})$. Wtedy $d$ dzieli każdą kombinację całkowitą tych liczb.`, 'Ułamek jest nieskracalny $\\iff$ NWD licznika i mianownika to 1.', ['$d$ dzieli $n$', 'Nie wiemy tego.'], ['$d=n$', 'Nic tego nie sugeruje.']),
         S('Kombinacja', 'Jaką kombinację wziąć?', T`$${c}(${num})-${a}(${den})=${-D}$`, T`$${c}(${num})-${a}(${den})=${linV([a * c, b * c], ['n', ''])}-${'(' + linV([a * c, a * d], ['n', '']) + ')'}=${-D}$.`, 'Mnożymy licznik przez współczynnik przy $n$ w mianowniku i odwrotnie.', [T`$(${den})-(${num})$`, T`Zostaje $${linV([c - a, d - b], ['n', ''])}$ — $n$ się nie skróciło.`], [T`$${d === 1 ? '' : d}(${num})-${b === 1 ? '' : b}(${den})$`, 'Tak skraca się wyraz wolny, a nie $n$.']),
         S('Wniosek', 'Co z tego wynika?', '$d\\mid1$, więc $d=1$', T`$d\mid ${-D}$, więc $d=1$ i ułamek jest nieskracalny dla każdego $n$. $\blacksquare$`, 'Jedyny dodatni dzielnik 1 to 1.', ['$d\\mid n$', 'Kombinacja dała stałą, nie $n$.'], ['$d=2$', '2 nie dzieli 1.'])],
        [[T`$d=(${num},${den})$ dzieli każdą kombinację.`, 'oznaczenie'], [T`$${c}(${num})-${a}(${den})=${-D}$.`, 'kombinacja (sprawdzona)'], [T`$d\mid1\Rightarrow d=1$. $\blacksquare$`, 'wniosek']],
        ['Rachunek kombinacji bez wymnożenia — łatwo o błąd znaku.']),
      M('Algorytm Euklidesa', 'Odejmuj wielokrotności jednego wyrażenia od drugiego, aż zostanie stała.', T`$(x,y)=(x,y-kx)$: $${chainT(seq, ['n', ''])}$.`,
        [S('Zasada', 'Jaka własność NWD?', '$(x,y)=(x,y-kx)$', T`Korzystamy z $(x,y)=(x,y-kx)$ dla całkowitych $x,y,k$.`, 'Wspólne dzielniki par $(x,y)$ i $(x,y-kx)$ są te same.', ['$(x,y)=(x+1,y)$', 'Dodanie 1 zmienia NWD.'], ['$(x,y)=(x/n,y/n)$', 'Nie wolno dzielić.']),
         S('Redukcja', 'Jak redukować?', T`$${chainT(seq, ['n', ''])}$`, T`$${chainT(seq, ['n', ''], '=1')}$.`, 'Ostatnia para zawiera $\\pm1$, a $(x,\\pm1)=1$.', ['$(' + num + ',' + den + ')=(' + num + ',n)$ i koniec', 'Trzeba doprowadzić do stałej.'], ['Podzielić przez $n$', 'Dzielenie nie zachowuje NWD.']),
         S('Wniosek', 'Wniosek?', 'NWD $=1$ — ułamek nieskracalny', T`$(${num},${den})=1$, więc ułamek jest nieskracalny dla każdego $n\in\mathbb N$. $\blacksquare$`, 'NWD równe 1 oznacza brak wspólnych dzielników $>1$.', ['NWD $=2$', 'Na końcu jest para z $\\pm1$, a $(x,\\pm1)=1$.'], ['NWD $=n$', 'Zeszło do stałej 1.'])],
        [[T`$${chainT(seq, ['n', ''], '=1')}$.`, 'redukcja'], [T`Zatem ułamek jest nieskracalny. $\blacksquare$`, 'wniosek']],
        ['Brak informacji, z jakiej własności NWD korzystamy.'])]);
    void last;
  }
  const genFracIrr = () => { for (;;) { const a = R.int(1, 9), c = R.int(2, 19), b = R.int(-5, 9); for (const D of [1, -1]) { if ((D + b * c) % a === 0) { const d = (D + b * c) / a; if (d >= 1 && d <= 30 && b !== 0 && !(a === c)) return fracIrr(a, b, c, d); } } } };

  /* ===== 7b. czy zawsze nieskracalny? ===== */
  function fracCheck(a, b, c, d) {
    const D = a * d - b * c, num = linV([a, b], ['n', '']), den = linV([c, d], ['n', '']);
    let ce = null; for (let n = 1; n < 400; n++) { const x = a * n + b, y = c * n + d; if (gcd(x, y) > 1) { ce = [n, x, y]; break; } }
    const tex = ce ? T`\text{Nie, np. }n=${ce[0]}:\ \tfrac{${ce[1]}}{${ce[2]}}\text{ się skraca}` : T`\text{Tak, zawsze}`;
    const fake = n => T`\text{Nie, np. }n=${n}:\ \tfrac{${a * n + b}}{${c * n + d}}\text{ się skraca}`;
    const wrong = ce ? [[T`\text{Tak, zawsze}`, T`Kombinacja daje $${Math.abs(D)}$, a nie $1$ — dla niektórych $n$ wspólnym dzielnikiem jest $${Math.abs(D)}$.`], [fake(ce[0] + 1), T`$(${a * (ce[0] + 1) + b},${c * (ce[0] + 1) + d})=${gcd(a * (ce[0] + 1) + b, c * (ce[0] + 1) + d)}$ — ten ułamek jest nieskracalny.`], [fake(1), T`$(${a + b},${c + d})=${gcd(a + b, c + d)}$.`].filter(() => gcd(a + b, c + d) === 1)]
      : [[fake(1), T`$(${a + b},${c + d})=1$.`], [fake(2), T`$(${2 * a + b},${2 * c + d})=1$.`], [fake(3), T`$(${3 * a + b},${3 * c + d})=1$.`]];
    for (const k of [2, 3, 4, 5, 7]) { const nn = (ce ? ce[0] : 0) + k; if (gcd(a * nn + b, c * nn + d) === 1) wrong.push([fake(nn), T`$(${a * nn + b},${c * nn + d})=1$ — ten ułamek jest nieskracalny.`]); }
    return mk({ gk: 'fcheck', field: txtField(), q: T`Czy dla każdej liczby naturalnej $n$ ułamek $\dfrac{${num}}{${den}}$ jest nieskracalny?`, tex,
      steps: [T`Niech $d$ dzieli licznik i mianownik. Kombinacja: $${c}(${num})-${a}(${den})=${-D}$, więc $d\mid ${Math.abs(D)}$.`,
        Math.abs(D) === 1 ? T`Zatem $d=1$ — ułamek jest zawsze nieskracalny.` : T`$${Math.abs(D)}$ nie jest jedynką, więc skracanie przez $${Math.abs(D)}$ jest możliwe. Szukamy $n$ z $${Math.abs(D)}\mid ${num}$, czyli $${num}\equiv0\pmod{${Math.abs(D)}}$ — sprawdzamy $n=1,2,3,\ldots$ albo rozwiązujemy kongruencję: najmniejsze takie $n$ to $${ce[0]}$ ($${a}\cdot ${ce[0]}${b < 0 ? '' : '+'}${b}=${ce[1]}=${Math.abs(D)}\cdot ${ce[1] / Math.abs(D)}$).`,
        ce ? T`Dla $n=${ce[0]}$: $\frac{${ce[1]}}{${ce[2]}}$, a $(${ce[1]},${ce[2]})=${gcd(ce[1], ce[2])}$. Odpowiedź: nie zawsze.` : T`Odpowiedź: tak, dla każdego $n$.`],
      wrong });
  }
  const genFracCheck = () => { for (;;) { const a = R.int(1, 9), b = R.int(-4, 9), c = R.int(2, 19), d = R.int(1, 20); const D = Math.abs(a * d - b * c); if (!b || D === 0 || (D !== 1 && !isP(D)) || D > 40 || gcd(a, b) !== 1 || gcd(c, d) !== 1 || gcd(a, D) !== 1) continue; return fracCheck(a, b, c, d); } };

  /* ===== 8–11: dowody z NWD ===== */
  const it8 = proof('3.8', 'adbc', T`Udowodnij, że jeżeli $ad-bc=1$, to ułamek $\dfrac{a+b}{c+d}$ jest nieskracalny.`, [
    M('Kombinacja liniowa', 'Znajdź kombinację $a+b$ i $c+d$ równą $ad-bc$.', T`$d(a+b)-b(c+d)=ad-bc=1$, więc wspólny dzielnik $a+b$ i $c+d$ dzieli 1.`,
      [S('Wspólny dzielnik', 'Od czego zacząć?', '$g\\mid a+b$ i $g\\mid c+d$', T`Niech $g$ będzie wspólnym dzielnikiem $a+b$ i $c+d$ (dodatnim).`, 'Pokażemy, że $g=1$.', ['$g\\mid a$', 'Nie wiemy tego.'], ['$g=ad-bc$', 'To nie jest definicja $g$.']),
       S('Kombinacja', 'Jaka kombinacja daje $ad-bc$?', '$d(a+b)-b(c+d)$', T`$d(a+b)-b(c+d)=ad+bd-bc-bd=ad-bc=1$.`, 'Wyrazy $bd$ się skracają.', ['$a(a+b)-b(c+d)$', 'Wychodzi $a^2+ab-bc-bd$ — wyrazy się nie skracają.'], ['$(a+b)-(c+d)$', 'Nie daje $ad-bc$.']),
       S('Wniosek', 'Wniosek?', '$g\\mid1$, więc $g=1$', T`$g$ dzieli kombinację, czyli $g\mid1$, więc $g=1$. Ułamek jest nieskracalny. $\blacksquare$`, 'Jedyny dodatni dzielnik 1 to 1.', ['$g\\mid ad$', 'Zbyt słabe.'], ['$g=ad-bc$', 'Tylko $g\\mid ad-bc$.'])],
      [[T`$g\mid a+b$, $g\mid c+d$.`, 'oznaczenie'], [T`$d(a+b)-b(c+d)=ad-bc=1$.`, 'kombinacja'], [T`$g\mid1\Rightarrow g=1$. $\blacksquare$`, 'wniosek']],
      ['Brak wymnożenia kombinacji.']),
    M('Liczba pierwsza i kongruencje', 'Gdyby ułamek się skracał, skracałby się przez pewną liczbę pierwszą $p$.', T`Z $p\mid a+b$, $p\mid c+d$ mamy $a\equiv-b$, $c\equiv-d\pmod p$, więc $ad-bc\equiv-bd+bd=0$ — sprzeczność z $ad-bc=1$.`,
      [S('Założenie', 'Co zakładamy?', 'Liczba pierwsza $p$ dzieli $a+b$ i $c+d$', T`Przypuśćmy, że ułamek się skraca: pewna liczba pierwsza $p$ dzieli $a+b$ i $c+d$.`, 'Każdy dzielnik $>1$ ma dzielnik pierwszy.', ['$p\\mid ad-bc$', 'To wyjdzie, nie zakładamy tego.'], ['$p=2$', 'Nie wiemy, która.']),
       S('Kongruencje', 'Co daje to modulo $p$?', '$a\\equiv-b$, $c\\equiv-d$', T`$a\equiv-b$ i $c\equiv-d\pmod p$, więc $ad-bc\equiv(-b)d-b(-d)=0\pmod p$.`, 'Podstawiamy kongruencje do wyrażenia.', ['$a\\equiv b$', 'Z $p\\mid a+b$ wynika $a\\equiv-b$.'], ['$ad\\equiv1$', 'Nie wynika z założeń.']),
       S('Sprzeczność', 'Co dalej?', '$p\\mid1$ — sprzeczność', T`$p\mid ad-bc=1$ — sprzeczność. Ułamek jest nieskracalny. $\blacksquare$`, 'Liczba pierwsza nie dzieli 1.', ['$p=1$', '1 nie jest pierwsza.'], ['$ad=bc$', 'Mamy $ad-bc=1$.'])],
      [[T`Przypuśćmy, że $p$ pierwsza dzieli $a+b$ i $c+d$.`, 'założenie nie wprost'], [T`$a\equiv-b$, $c\equiv-d\Rightarrow ad-bc\equiv0\pmod p$.`, 'rachunek modulo $p$'], [T`$p\mid1$ — sprzeczność. $\blacksquare$`, 'sprzeczność']],
      ['Brak zdania „przypuśćmy, że…”.'])]);

  const it9 = proof('3.9', 'frac2', T`Udowodnij, że jeśli $n\in\mathbb N$, to ułamek $\dfrac{2n^2+8n+4}{2n^2+6n+3}$ jest nieskracalny.`, [
    M('Algorytm Euklidesa', 'Odejmuj wielokrotności — stopnie wielomianów maleją.', T`$(2n^2+8n+4,\ 2n^2+6n+3)=(2n+1,\ 2n^2+6n+3)=(2n+1,\ n+1)=(n,\ n+1)=1$.`,
      [S('Pierwsze odejmowanie', 'Co odjąć najpierw?', 'Mianownik od licznika: zostaje $2n+1$', T`$(2n^2+8n+4,\ 2n^2+6n+3)=(2n+1,\ 2n^2+6n+3)$, bo różnica licznika i mianownika to $2n+1$.`, '$(x,y)=(x-y,y)$.', ['$(2n^2+8n+4,\\ 2)$', 'Różnica to $2n+1$, nie 2.'], ['Dzielimy przez $2n^2$', 'Nie wolno dzielić.']),
       S('Drugie odejmowanie', T`Jak zredukować $2n^2+6n+3$ modulo $2n+1$?`, T`$2n^2+6n+3-(n+2)(2n+1)=n+1$`, T`$2n^2+6n+3=(n+2)(2n+1)+(n+1)$, więc $(2n+1,\ 2n^2+6n+3)=(2n+1,\ n+1)$.`, 'Dzielenie wielomianów z resztą.', [T`Reszta $n$`, T`$(n+2)(2n+1)=2n^2+5n+2$, więc reszta to $n+1$.`], [T`Reszta $3$`, 'Policz $(n+2)(2n+1)$.']),
       S('Koniec', 'Jak dokończyć?', '$(2n+1,n+1)=(n,n+1)=(n,1)=1$', T`$(2n+1,\ n+1)=(n,\ n+1)=(n,\ 1)=1$. Ułamek jest nieskracalny. $\blacksquare$`, 'Kolejne liczby są względnie pierwsze.', ['$(2n+1,n+1)=2$', 'Odejmij: $(2n+1)-(n+1)=n$.'], ['$=n$', '$(n,n+1)=1$.'])],
      [[T`$(2n^2+8n+4,\ 2n^2+6n+3)=(2n+1,\ 2n^2+6n+3)$.`, 'pierwsza redukcja'], [T`$2n^2+6n+3=(n+2)(2n+1)+(n+1)$, więc $=(2n+1,\ n+1)$.`, 'dzielenie z resztą'], [T`$=(n,\ n+1)=1$. $\blacksquare$`, 'zakończenie']],
      ['Pomyłka w dzieleniu wielomianów — warto sprawdzić wymnażając.']),
    M('Kombinacja liniowa', 'Znajdź kombinację licznika i mianownika równą stałej.', T`$g\mid(2n^2+8n+4)-(2n^2+6n+3)=2n+1$, a $2(2n^2+6n+3)-(2n+1)(2n+5)=1$.`,
      [S('Różnica', 'Co dzieli wspólny dzielnik $g$?', '$g\\mid 2n+1$', T`Niech $g$ dzieli licznik $L$ i mianownik $M$. Wtedy $g\mid L-M=2n+1$.`, 'Różnica dwóch wielokrotności $g$.', ['$g\\mid 2$', 'Różnica to $2n+1$.'], ['$g\\mid n$', 'Nie wynika.']),
       S('Druga kombinacja', T`Jak z $M$ i $2n+1$ dostać stałą?`, T`$2M-(2n+1)(2n+5)=1$`, T`$2M=4n^2+12n+6$, $(2n+1)(2n+5)=4n^2+12n+5$, więc $2M-(2n+1)(2n+5)=1$. Zatem $g\mid1$.`, 'Dobieramy wielomian tak, żeby skróciły się wyrazy z $n$.', [T`$M-n(2n+1)=5n+3$`, 'To dobry krok, ale jeszcze nie stała.'], [T`$M-(2n+1)=2n^2+4n+2$`, 'Stopień się nie zmniejszył.']),
       S('Wniosek', 'Wniosek?', '$g=1$', T`$g\mid1$, więc $g=1$ — ułamek jest nieskracalny. $\blacksquare$`, 'Jedyny dodatni dzielnik 1 to 1.', ['$g=2n+1$', '$g$ dzieli 1.'], ['$g\\mid2$', 'Kombinacja dała 1.'])],
      [[T`$g\mid L-M=2n+1$.`, 'różnica'], [T`$2M-(2n+1)(2n+5)=1$, więc $g\mid1$.`, 'kombinacja ze sprawdzeniem'], [T`$g=1$. $\blacksquare$`, 'wniosek']],
      ['Brak sprawdzenia kombinacji.'])]);

  const it10 = proof('3.10', 'sumdiff', T`Niech $a,b\in\mathbb Z$. Pokaż, że jeżeli $(a,b)=1$, to $(a+b,a-b)$ jest równe $1$ lub $2$.`, [
    M('Wspólny dzielnik', 'Dodaj i odejmij oba wyrażenia — dostaniesz $2a$ i $2b$.', T`$d=(a+b,a-b)$ dzieli $2a$ i $2b$, więc $d\mid(2a,2b)=2(a,b)=2$.`,
      [S('Oznaczenie', 'Co oznaczyć?', '$d=(a+b,a-b)$', T`Niech $d=(a+b,a-b)$. Wtedy $d\mid a+b$ i $d\mid a-b$.`, 'Pokażemy, że $d$ dzieli $2$.', ['$d=(a,b)$', 'To już wiemy — równe 1.'], ['$d=a+b$', 'To nie jest NWD.']),
       S('Suma i różnica', 'Co jeszcze dzieli $d$?', '$2a$ i $2b$', T`$d$ dzieli sumę i różnicę tych liczb: $(a+b)+(a-b)=2a$ oraz $(a+b)-(a-b)=2b$. Zatem $d\mid 2a$ i $d\mid 2b$.`, 'Dzielnik dwóch liczb dzieli ich sumę i różnicę.', ['$a$ i $b$', 'Wychodzi $2a$ i $2b$, nie $a$ i $b$.'], ['$ab$', 'Z sumy i różnicy dostajemy $2a$ i $2b$, a nie iloczyn.']),
       S('Wniosek', 'Co wynika z $d\\mid 2a$ i $d\\mid 2b$?', '$d\\mid(2a,2b)=2$', T`$d$ jest wspólnym dzielnikiem $2a$ i $2b$, więc dzieli ich NWD: $(2a,2b)=2(a,b)=2\cdot1=2$. Zatem $d\mid2$, czyli $d=1$ lub $d=2$. $\blacksquare$`, '$(ka,kb)=k(a,b)$ — wyciągamy wspólny czynnik.', ['$d\\mid(a,b)=1$', 'Nie: dzieli tylko $2a$ i $2b$.'], ['$d=2$ zawsze', 'Dla $a=2,b=1$: $(3,1)=1$.'])],
      [[T`$d=(a+b,a-b)$; $d\mid(a+b)+(a-b)=2a$ i $d\mid(a+b)-(a-b)=2b$.`, 'suma i różnica'], [T`$d\mid(2a,2b)=2(a,b)=2$, więc $d\in\{1,2\}$. $\blacksquare$`, 'wniosek z $(ka,kb)=k(a,b)$']],
      ['Wniosek $d\\mid(a,b)$ zamiast $d\\mid2(a,b)$.']),
    M('Liczba pierwsza', 'Sprawdź, jaka liczba pierwsza może dzielić oba wyrażenia, a potem wyklucz $4$.', T`Liczba pierwsza $p$ dzieląca oba dzieli $2a$ i $2b$; dla nieparzystej $p$ to $p\mid a,b$. Zostaje $p=2$, a $4$ nie może dzielić obu.`,
      [S('Suma i różnica', 'Co dzieli wspólny dzielnik $a+b$ i $a-b$?', '$2a$ i $2b$', T`Każdy wspólny dzielnik $t$ liczb $a+b$ i $a-b$ dzieli też $2a=(a+b)+(a-b)$ i $2b=(a+b)-(a-b)$.`, 'Dzielnik dwóch liczb dzieli ich sumę i różnicę.', ['$a$ i $b$', 'Wychodzi $2a$ i $2b$.'], ['Nic więcej', 'Dzieli też sumę i różnicę.']),
       S('Nieparzyste p', 'Czy nieparzysta liczba pierwsza $p$ może dzielić $a+b$ i $a-b$?', 'Nie — wtedy $p\\mid a$ i $p\\mid b$', T`Gdyby nieparzysta pierwsza $p$ dzieliła oba, to $p\mid2a$ i $p\mid2b$, a skoro $p\nmid2$, to $p\mid a$ i $p\mid b$ — sprzeczność z $(a,b)=1$.`, 'Lemat: $p\\mid xy$, $p\\nmid x\\Rightarrow p\\mid y$.', ['Tak', '$(a,b)=1$ to wyklucza.'], ['Tak, np. $p=3$', 'Wtedy $3\\mid a$ i $3\\mid b$ — sprzeczność z $(a,b)=1$.']),
       S('Potęga 2', 'Czy $4$ może dzielić oba?', 'Nie — wtedy $2\\mid a$ i $2\\mid b$', T`Gdyby $4\mid a+b$ i $4\mid a-b$, to $4\mid 2a$, $4\mid 2b$, czyli $2\mid a$, $2\mid b$ — sprzeczność. Jedynym możliwym wspólnym czynnikiem jest więc pojedyncza dwójka: $(a+b,a-b)\in\{1,2\}$. $\blacksquare$`, 'NWD to iloczyn wspólnych potęg liczb pierwszych.', ['Tak', 'Wtedy $a,b$ byłyby parzyste.'], ['Tylko dla $a=b$', 'Wtedy $(a,b)=|a|$.'])],
      [[T`Wspólny dzielnik $a+b$ i $a-b$ dzieli $2a$ i $2b$.`, 'suma i różnica'], [T`Nieparzysta pierwsza $p\mid a\pm b\Rightarrow p\mid a,b$ — sprzeczność.`, 'nieparzyste dzielniki'], [T`$4\mid a\pm b\Rightarrow 2\mid a,b$ — sprzeczność. Więc NWD $\in\{1,2\}$. $\blacksquare$`, 'wykluczenie 4']],
      ['Pominięcie przypadku $4$.'])]);

  const it11 = proof('3.11', 'cab', T`Niech $a,b\in\mathbb Z$. Udowodnij, że jeżeli $(a,b)=1$ i $c\mid a+b$, to $(c,a)=(c,b)=1$.`, [
    M('Wspólny dzielnik', 'Weź wspólny dzielnik $c$ i $a$ — pokaż, że dzieli też $b$.', T`$d\mid c\mid a+b$ i $d\mid a$, więc $d\mid b$; zatem $d\mid(a,b)=1$.`,
      [S('Dzielnik', 'Co oznaczyć?', '$d=(c,a)$', T`Niech $d=(c,a)$. Wtedy $d\mid c$ i $d\mid a$.`, 'Wystarczy pokazać $d=1$; dla $(c,b)$ rozumowanie jest symetryczne.', ['$d=(a,b)$', 'To już wiemy — równe 1.'], ['$d=c$', 'To nie jest NWD.']),
       S('d | a+b', 'Co wiemy o $d$ i $a+b$?', '$d\\mid a+b$', T`$d\mid c$ i $c\mid a+b$, więc z przechodniości $d\mid a+b$.`, 'Przechodniość: $x\\mid y$ i $y\\mid z$ daje $x\\mid z$.', ['$d\\mid ab$', 'Z założenia $c$ dzieli sumę, nie iloczyn.'], ['Nic', 'Przechodniość podzielności daje $d\\mid a+b$.']),
       S('d | b', 'Dlaczego $d\\mid b$?', '$d\\mid(a+b)-a=b$', T`$d\mid a+b$ i $d\mid a$, więc $d$ dzieli różnicę: $d\mid(a+b)-a=b$.`, 'Dzielnik dwóch liczb dzieli ich różnicę.', ['Bo $d\\mid c$', 'Za mało — trzeba przejść przez $a+b$.'], ['Bo $b\\mid a$', 'Nic takiego nie wiemy.']),
       S('Wniosek', 'Wniosek?', '$d\\mid(a,b)=1$', T`$d\mid a$ i $d\mid b$, więc $d\mid(a,b)=1$, czyli $d=1$. Tak samo $(c,b)=1$ (zamieniamy role $a$ i $b$). $\blacksquare$`, 'Drugą równość wystarczy uzasadnić symetrią.', ['$d=a$', 'Nie wynika.'], ['$d=2$', 'Dzieli 1, więc 1.'])],
      [[T`$d=(c,a)$; $d\mid c\mid a+b$, więc $d\mid a+b$.`, 'oznaczenie i przechodniość'], [T`$d\mid a$, więc $d\mid(a+b)-a=b$; stąd $d\mid(a,b)=1$.`, 'kluczowy krok'], [T`$(c,a)=1$; analogicznie $(c,b)=1$. $\blacksquare$`, 'symetria']],
      ['Pominięcie drugiej równości $(c,b)=1$.']),
    M('Nie wprost (liczba pierwsza)', 'Załóż, że liczba pierwsza dzieli $c$ i $a$.', T`$p\mid c\mid a+b$ i $p\mid a$ dają $p\mid b$ — sprzeczność z $(a,b)=1$.`,
      [S('Założenie', 'Co zakładamy?', 'Liczba pierwsza $p$ dzieli $c$ i $a$', T`Przypuśćmy, że $(c,a)>1$; wtedy pewna liczba pierwsza $p$ dzieli $c$ i $a$.`, 'NWD $>1$ ma dzielnik pierwszy.', ['$p\\mid b$', 'To wyjdzie.'], ['$p=c$', 'Nie musi.']),
       S('p | b', 'Co wynika dla $b$?', '$p\\mid b$', T`$p\mid c$ i $c\mid a+b$, więc $p\mid a+b$. Skoro też $p\mid a$, to $p\mid(a+b)-a=b$.`, 'Przechodniość, a potem różnica.', ['$p\\mid a+b$ tylko', 'Odejmij $a$.'], ['Nic', '$p$ dzieli $a+b$ i $a$.']),
       S('Sprzeczność', 'Co dalej?', '$p\\mid(a,b)=1$ — sprzeczność', T`$p\mid a$ i $p\mid b$, więc $p\mid(a,b)=1$ — sprzeczność, bo liczba pierwsza nie dzieli $1$. Zatem $(c,a)=1$; analogicznie $(c,b)=1$. $\blacksquare$`, 'Ten sam argument dla $b$.', ['Brak sprzeczności', '$p$ dzieli $a$ i $b$.'], ['$p=1$', '1 nie jest pierwsza.'])],
      [[T`Przypuśćmy: $p$ pierwsza, $p\mid c$, $p\mid a$.`, 'założenie'], [T`$p\mid a+b$, więc $p\mid b$.`, 'przechodniość i różnica'], [T`$p\mid(a,b)=1$ — sprzeczność. $\blacksquare$`, 'sprzeczność']],
      ['Brak części dla $(c,b)$.'])]);

  const it12 = mk({ gk: 'a2b2', field: txtField(), q: T`Niech $a,b\in\mathbb Z$, $(a,b)=1$. Znajdź wszystkie możliwe wartości $(a^2+b^2,\ a+b)$.`, tex: T`1\text{ lub }2`,
    steps: [T`Niech $d=(a^2+b^2,a+b)$. $a^2+b^2=(a+b)^2-2ab$, więc $d\mid 2ab$.`, T`Z zad. 3.11: $d\mid a+b$ i $(a,b)=1$ daje $(d,a)=(d,b)=1$. Liczba $d$ nie ma więc wspólnego dzielnika pierwszego ani z $a$, ani z $b$, czyli też z iloczynem $ab$: $(d,ab)=1$.`, T`Skoro $d\mid 2\cdot ab$ i $(d,ab)=1$, to $d\mid 2$ (lemat: $m\mid xy$ i $(m,y)=1$ daje $m\mid x$). Zatem $d\in\{1,2\}$.`, T`Obie wartości występują: $a=2,b=1$: $(5,3)=1$; $a=b=1$: $(2,2)=2$. Odpowiedź: $1$ lub $2$.`],
    wrong: [[T`1`, 'Dla $a=b=1$: $(2,2)=2$ — dwójka też występuje.'], [T`2`, 'Dla $a=2,b=1$: $(5,3)=1$.'], [T`1,\ 2\text{ lub }4`, 'Z $d\\mid2$ — więc 4 jest niemożliwe.']] });

  /* ===== 13. równania diofantyczne ===== */
  function dio2(a, b, c) { // ax + by = c
    const g = gcd(a, b), eq = linV([a, b], ['x', 'y']);
    const q = T`Rozwiąż w liczbach całkowitych: $${eq}=${c}$.`;
    if (c % g) return mk({ gk: 'dio', field: txtField(), q, tex: T`\text{brak rozwiązań}`,
      steps: [T`$(${Math.abs(a)},${Math.abs(b)})=${g}$, a $${g}\nmid ${c}$.`, T`$${Math.abs(a)}=${g}\cdot ${Math.abs(a) / g}$ i $${Math.abs(b)}=${g}\cdot ${Math.abs(b) / g}$, więc lewa strona to $${g}\cdot(\ldots)$ — dzieli się przez $${g}$ dla każdych całkowitych $x,y$. Prawa strona $${c}$ nie dzieli się przez $${g}$, więc równość jest niemożliwa — brak rozwiązań.`],
      wrong: [[T`x=${c}+${Math.abs(b)}t,\ y=${-c}${tsign(-a, 't')}`, 'Sprawdź: najpierw warunek $(a,b)\\mid c$.'], [T`x=0,\ y=${(c / b).toFixed(2).replace('.', '{,}')}`, 'Szukamy liczb całkowitych.'], [T`x=${c}${tsign(Math.abs(b) / gcd(a, b), 't')},\ y=${-c}${tsign(-a / gcd(a, b), 't')},\ t\in\mathbb Z`, 'Podstaw $t=0$ — nie spełnia równania; najpierw warunek $(a,b)\\mid c$.']] });
    const A_ = Math.abs(a), B_ = Math.abs(b), { bs, out: euSteps } = backSubSteps(A_, B_), x1 = bs.x, y1 = bs.y, mul = c / g;
    let X = x1 * Math.sign(a) * (c / g), Y = y1 * Math.sign(b) * (c / g);
    const X1 = X, Y1 = Y;
    let kx = b / g, ky = -a / g; if (kx < 0) { kx = -kx; ky = -ky; }
    const t0 = Math.floor(X / kx); X -= t0 * kx; Y -= t0 * ky;
    const solT = (x0, kx_, y0, ky_) => T`x=${aff(x0, [[kx_, 't']])},\ y=${aff(y0, [[ky_, 't']])},\ t\in\mathbb Z`;
    const pv = v => (v < 0 ? '(' + v + ')' : v), eqT = (u, v) => T`${a}\cdot ${pv(u)}${b < 0 ? '-' : '+'}${B_}\cdot ${pv(v)}`;
    const signNote = a < 0 || b < 0 ? T` W równaniu stoi $${a < 0 ? '-' + A_ + 'x' : ''}${a < 0 && b < 0 ? '\\ \\text{i}\\ ' : ''}${b < 0 ? '-' + B_ + 'y' : ''}$, więc ${a < 0 && b < 0 ? 'obie niewiadome bierzemy' : (a < 0 ? '$x$' : '$y$') + ' bierzemy'} z przeciwnym znakiem (np. $${b < 0 ? T`-${B_}\cdot ${pv(Y1)}=${B_}\cdot ${pv(-Y1)}` : T`-${A_}\cdot ${pv(X1)}=${A_}\cdot ${pv(-X1)}`}$).` : '';
    const dioSteps = [T`$(${A_},${B_})=${g}$ i $${g}\mid ${c}$ — rozwiązania istnieją.`, ...euSteps,
      T`Mamy $${combT(A_, B_, x1, y1)}=${g}$. Mnożymy obie strony przez $${mul}$: $\ ${combT(A_, B_, x1 * mul, y1 * mul)}=${c}$.${signNote} Rozwiązanie szczególne: $x_0=${X1},\ y_0=${Y1}$.`,
      T`Wszystkie rozwiązania: $x=x_0${tsign(kx, 't')},\ y=y_0${tsign(ky, 't')}$, $t\in\mathbb Z$. Przy $t$ stoją $\frac{${B_}}{${g}}=${Math.abs(kx)}$ i $\frac{${A_}}{${g}}=${Math.abs(ky)}$ ze znakami dobranymi tak, żeby zmiany się znosiły. Czyli $x=${aff(X1, [[kx, 't']])},\ y=${aff(Y1, [[ky, 't']])}$.`];
    if (t0) dioSteps.push(T`Liczby są niewygodne, więc wybieramy prostsze rozwiązanie szczególne: dla $t=${-t0}$ wychodzi $x=${X},\ y=${Y}$. Ten sam zbiór rozwiązań zapisujemy więc jako $${solT(X, kx, Y, ky)}$.`);
    dioSteps.push(T`Sprawdzenie: dla $t=0$: $${eqT(X, Y)}=${a * X}${b * Y < 0 ? '-' : '+'}${Math.abs(b * Y)}=${c}$ ✓, a wyrazy z $t$ się znoszą: $${a}\cdot ${kx}t${b < 0 ? '-' : '+'}${B_}\cdot ${ky < 0 ? '(' + ky + 't)' : ky + 't'}=${a * kx}t${b * ky < 0 ? '-' : '+'}${Math.abs(b * ky)}t=0$.`);
    const tex = solT(X, kx, Y, ky);
    const wrong = [[solT(X, kx, Y, -ky), 'Zły znak przy $t$ w $y$ — podstaw i sprawdź: $t$ musi się skrócić.']];
    if (g > 1) wrong.push([solT(X, kx * g, Y, ky * g), T`Krok to $\frac{b}{d}$ i $\frac{a}{d}$ z $d=${g}$ — bez dzielenia gubimy rozwiązania.`]);
    wrong.push([solT(X + 1, kx, Y, ky), T`Dla $t=0$: $${a * (X + 1) + b * Y}\neq ${c}$ — złe rozwiązanie szczególne.`], [T`\text{brak rozwiązań}`, T`$(${Math.abs(a)},${Math.abs(b)})=${g}$ dzieli $${c}$, więc rozwiązania istnieją.`]);
    return mk({ gk: 'dio', field: txtField(), q, tex, extra: { _gs: [X, kx, Y, ky] },
      steps: dioSteps,
      wrong });
  }
  const genDio = () => { for (;;) { const g = R.pick([1, 1, 2, 3, 3, 4, 6]); const a = g * R.int(2, 25) * R.pick([1, 1, -1]), b = g * R.int(2, 25) * R.pick([1, -1]); if (gcd(a, b) !== g || Math.abs(a) === Math.abs(b)) continue; const c = R.pick([g * R.int(-20, 30), R.int(-30, 40)]); if (!c) continue; return dio2(a, b, c); } };
  function dio3(a, b, c, e) { // ax + by + cz = e, (a,b)=d1
    const d1 = gcd(a, b), g = gcd(d1, c), eq = linV([a, b, c], ['x', 'y', 'z']);
    const q = T`Rozwiąż w liczbach całkowitych: $${eq}=${e}$.`;
    if (e % g) return mk({ gk: 'dio3', field: txtField(), q, tex: T`\text{brak rozwiązań}`, steps: [T`$(${a},${b},${c})=${g}$, a $${g}\nmid ${e}$.`, T`Lewa strona dzieli się przez $${g}$ dla wszystkich całkowitych $x,y,z$, prawa nie — brak rozwiązań.`], wrong: [[T`x=${e},\ y=-${e},\ z=0`, 'Podstaw — nie spełnia równania.'], [T`x=${e}-3s,\quad y=s+t,\quad z=-t\ (s,t\in\mathbb Z)`, T`Podstaw — nie spełnia; najpierw warunek $(a,b,c)\mid ${e}$.`], [T`x=s,\ y=t,\ z=${e}-s-t`, 'To nie jest rozwiązanie tego równania.']] });
    const { x: x1, y: y1 } = bezoutRows(Math.abs(a), Math.abs(b)); const sx = x1 * Math.sign(a), sy = y1 * Math.sign(b); // a·sx + b·sy = d1
    const { x: u1, y: v1 } = bezoutRows(d1, Math.abs(c)); const w0 = u1 * (e / g), z0 = v1 * Math.sign(c) * (e / g); // d1·w0 + c·z0 = e
    // w = w0 + (c/g)s, z = z0 − (d1/g)s ; x = sx·w + (b/d1)t, y = sy·w − (a/d1)t
    const cw = c / g, cz = -d1 / g;
    const X = [sx * w0, sx * cw, b / d1], Y = [sy * w0, sy * cw, -a / d1], Z = [z0, cz, 0];
    const fT = ([k0, ks, kt]) => aff(k0, [[ks, 's'], [kt, 't']]);
    const tex = T`x=${fT(X)},\quad y=${fT(Y)},\quad z=${fT(Z)}\ (s,t\in\mathbb Z)`;
    const alt = (Xa, Ya, Za) => T`x=${fT(Xa)},\quad y=${fT(Ya)},\quad z=${fT(Za)}\ (s,t\in\mathbb Z)`;
    return mk({ gk: 'dio3', field: txtField(), q, tex,
      steps: [T`Pomysł: dwie pierwsze niewiadome łączymy w jedną. $(${Math.abs(a)},${Math.abs(b)})=${d1}$, więc wyrażenie $${linV([a, b], ['x', 'y'])}$ przyjmuje ${d1 === 1 ? 'każdą wartość całkowitą' : T`dokładnie wszystkie wielokrotności $${d1}$`} (tożsamość Bézout). Piszemy $${linV([a, b], ['x', 'y'])}=${linV([d1], ['w'])}$, $w\in\mathbb Z$, i równanie staje się równaniem z dwiema niewiadomymi: $${linV([d1, c], ['w', 'z'])}=${e}$.`,
        T`$(${d1},${Math.abs(c)})=${g}\mid ${e}$. Jedno rozwiązanie: $w=${w0},\ z=${z0}$ (sprawdzenie: $${d1 === 1 ? '' : d1 + '\\cdot '}${w0 < 0 ? '(' + w0 + ')' : w0}${c < 0 ? '-' : '+'}${Math.abs(c)}\cdot ${z0 < 0 ? '(' + z0 + ')' : z0}=${e}$). Wszystkie: $w=${aff(w0, [[cw, 's']])},\ z=${aff(z0, [[cz, 's']])}$, $s\in\mathbb Z$.`,
        T`Teraz $${linV([a, b], ['x', 'y'])}=${linV([d1], ['w'])}$. Dla $x=${sx},\ y=${sy}$ mamy $${a}\cdot ${sx < 0 ? '(' + sx + ')' : sx}${b < 0 ? '-' : '+'}${Math.abs(b)}\cdot ${sy < 0 ? '(' + sy + ')' : sy}=${d1}$; mnożymy przez $w$ i dokładamy wszystkie rozwiązania jednorodne: $x=${linV([sx, b / d1], ['w', 't'])}$, $\ y=${linV([sy, -a / d1], ['w', 't'])}$, $\ t\in\mathbb Z$.`,
        T`Podstawiamy $w$: $x=${fT(X)}$, $\ y=${fT(Y)}$, $\ z=${fT(Z)}$, $\ s,t\in\mathbb Z$.`],
      wrong: [[alt(X, Y, [z0, -cz, 0]), 'Zły znak przy $s$ w $z$ — sprawdź podstawiając.'], [alt([X[0], X[1], 0], [Y[0], Y[1], 0], Z).replace('s,t\\in', 's\\in'), 'Brakuje drugiego parametru — równanie z trzema niewiadomymi ma rodzinę dwuparametrową.'], [alt([X[0] + 1, X[1], X[2]], Y, Z), 'Złe rozwiązanie szczególne: dla $s=t=0$ nie wychodzi ' + e + '.']] });
  }

  /* ===== 14. czy istnieją rozwiązania naturalne ===== */
  function natExist(cs, e, label) {
    const n = cs.length, vars = ['x', 'y', 'z'].slice(0, n), eq = linV(cs, vars);
    let found = null, inf = false;
    if (cs.some(c => c < 0) && cs.some(c => c > 0) && e % gcdN(cs.map(Math.abs)) === 0) inf = true;
    const lim = inf ? 400 : Math.max(2, Math.abs(e) + 2);
    if (n === 2) { for (let x = 1; x <= lim && !found; x++) { const r = e - cs[0] * x; if (r % cs[1] === 0 && r / cs[1] >= 1) found = [x, r / cs[1]]; } }
    else { for (let x = 1; x <= lim && !found; x++) for (let y = 1; y <= lim && !found; y++) { const r = e - cs[0] * x - cs[1] * y; if (r % cs[2] === 0 && r / cs[2] >= 1) found = [x, y, r / cs[2]]; } }
    const solT = xs => vars.map((v, i) => v + '=' + xs[i]).join(',\\ ');
    const tex = found ? T`\text{Tak, np. }${solT(found)}` : T`\text{Nie}`;
    const gg = gcdN(cs.map(Math.abs)), allPos = cs.every(c => c > 0), minV = cs.reduce((s, c) => s + c, 0);
    const steps = [];
    if (e % gg) steps.push(T`$(${cs.map(Math.abs).join(',')})=${gg}\nmid ${e}$ — nie ma nawet rozwiązań całkowitych.`);
    else if (allPos && minV > e) steps.push(T`Współczynniki są dodatnie, więc dla $${vars.join(',')}\geq1$: $${eq}\geq ${minV}>${e}$ — brak rozwiązań naturalnych.`);
    else if (found) steps.push(T`Szukamy w rozwiązaniu ogólnym parametru, dla którego wszystkie niewiadome są $\geq1$, np. $${solT(found)}$: $${cs.map((c, i) => (i && c > 0 ? '+' : '') + (c < 0 ? '-' : '') + Math.abs(c) + '\\cdot ' + found[i]).join('')}=${e}$ ✓.`, inf ? 'Współczynniki mają różne znaki — takich rozwiązań jest nieskończenie wiele.' : 'Przyjmujemy $\\mathbb N=\\{1,2,\\ldots\\}$.');
    else if (n === 2) { const it = dio2(cs[0], cs[1], e), [X0, KX, Y0, KY] = it._gs; const dec = v => v.toFixed(2).replace('.', '{,}'); steps.push(T`Rozwiązanie ogólne w liczbach całkowitych (zad. 3.13): $${it.mcCorrect}$. Szukamy $t$, dla którego obie liczby są $\geq1$.`, T`$x\geq1$: $\ ${aff(X0, [[KX, 't']])}\geq1$ $\iff ${KX}t\geq ${1 - X0}$ $\iff t\geq\frac{${1 - X0}}{${KX}}\approx ${dec((1 - X0) / KX)}$.`, KY < 0 ? T`$y\geq1$: $\ ${aff(Y0, [[KY, 't']])}\geq1$ $\iff ${-KY}t\leq ${Y0 - 1}$ $\iff t\leq\frac{${Y0 - 1}}{${-KY}}\approx ${dec((Y0 - 1) / -KY)}$.` : T`$y\geq1\iff t\geq ${dec((1 - Y0) / KY)}$.`, T`Między $${dec((1 - X0) / KX)}$ a $${dec(KY < 0 ? (Y0 - 1) / -KY : (1 - Y0) / KY)}$ nie ma żadnej liczby całkowitej, więc żadne $t$ nie daje obu liczb naturalnych.`); }
    else { const cases = []; for (let z = 1; cs[0] + cs[1] + cs[2] * z <= e; z++) for (let y = 1; cs[0] + cs[1] * y + cs[2] * z <= e; y++) { const r = e - cs[1] * y - cs[2] * z; cases.push(T`$${vars[1]}=${y},\ ${vars[2]}=${z}$: $${cs[0]}${vars[0]}=${r}$ ✗`); }
      steps.push(T`Współczynniki są dodatnie, więc przy $${vars.join(',')}\geq1$ żadna niewiadoma nie może być duża: $${vars[1]}\leq ${Math.floor((e - cs[0] - cs[2]) / cs[1])}$ i $${vars[2]}\leq ${Math.floor((e - cs[0] - cs[1]) / cs[2])}$. Sprawdzamy wszystkie możliwości — w żadnej $${vars[0]}$ nie wychodzi naturalne:`, cases.join('; ') + '.'); }
    steps.push(found ? 'Odpowiedź: tak.' : 'Odpowiedź: nie.');
    let fakeInt = null; if (!found && e % gg === 0) { outer: for (let x = -60; x <= 60; x++) for (let y = -60; y <= 60; y++) { if (n === 2) { if (cs[0] * x + cs[1] * y === e) { fakeInt = [x, y]; break outer; } } else { const r = e - cs[0] * x - cs[1] * y; if (r % cs[2] === 0) { fakeInt = [x, y, r / cs[2]]; break outer; } } } }
    const wrong = found ? [[T`\text{Nie}`, T`Przykład: $${solT(found)}$.`], [T`\text{Tak, np. }${solT(found.map((v, i) => (i ? v : v + 1)))}`, (n === 3 ? 'Ta trójka' : 'Ta para') + ' nie spełnia równania — podstaw.'], [T`\text{Tak, np. }${solT(found.map((v, i) => (i === 1 ? v + 1 : v)))}`, (n === 3 ? 'Ta trójka' : 'Ta para') + ' nie spełnia równania — podstaw.']]
      : [[fakeInt ? T`\text{Tak, np. }${solT(fakeInt)}` : T`\text{Tak, np. }${solT(vars.map(() => 1))}`, fakeInt ? 'To rozwiązanie całkowite, ale ma składowe $\\leq0$ — nie jest naturalne.' : 'Podstaw — nie spełnia równania.'], [T`\text{Tak, np. }${solT(vars.map((_, i) => (i === 0 ? 1 : 2)))}`, 'Podstaw — nie spełnia równania.'], [T`\text{Tak, np. }${solT(vars.map((_, i) => (i === 0 ? 2 : 1)))}`, 'Podstaw — nie spełnia równania.']];
    return mk({ label, gk: 'nat', field: txtField(), q: T`Czy istnieją liczby naturalne spełniające równanie $${eq}=${e}$?`, tex, steps, wrong });
  }

  /* ===== 15. układy dwóch równań z trzema niewiadomymi ===== */
  function sys3(r1, r2) { // ri = [a,b,c,e]
    const V = ['x', 'y', 'z'];
    const cr = [r1[1] * r2[2] - r1[2] * r2[1], r1[2] * r2[0] - r1[0] * r2[2], r1[0] * r2[1] - r1[1] * r2[0]], gg = gcdN(cr.map(Math.abs)); let v = cr.map(x => x / gg);
    // rozwiązanie szczególne
    let p0 = null;
    const k = [0, 1, 2].find(i => Math.abs(r1[i]) === 1) ?? 2; const o = [0, 1, 2].filter(i => i !== k);
    for (let s = -300; s <= 300 && !p0; s++) for (let t = -300; t <= 300 && !p0; t++) { const xs = [0, 0, 0]; xs[o[0]] = s; xs[o[1]] = t; const rest = r1[3] - r1[o[0]] * s - r1[o[1]] * t; if (rest % r1[k]) continue; xs[k] = rest / r1[k]; if (r2[0] * xs[0] + r2[1] * xs[1] + r2[2] * xs[2] === r2[3]) p0 = xs; }
    if (v[0] < 0 || (v[0] === 0 && v[1] < 0)) for (let i = 0; i < 3; i++) v[i] = -v[i];
    const ix = v.findIndex(c => c !== 0), sh = Math.floor(p0[ix] / v[ix]); for (let i = 0; i < 3; i++) p0[i] -= sh * v[i];
    const solT = (p, w) => V.map((n, i) => n + '=' + aff(p[i], [[w[i], 't']])).join(',\\quad ') + T`,\ t\in\mathbb Z`;
    const eqs = [r1, r2].map(r => linV(r.slice(0, 3), V) + '=' + r[3]);
    // eliminacja zmiennej k z równania 1
    const elim = [0, 1, 2].map(i => r2[i] * r1[k] - r1[i] * r2[k]), elimE = r2[3] * r1[k] - r1[3] * r2[k];
    // rozwiązanie równania po eliminacji i warunek całkowitości dla zmiennej k
    const ea = elim[o[0]], eb = elim[o[1]], gE = gcd(ea, eb), elimSteps = [];
    { const { x: bx, y: by } = bezoutRows(Math.abs(ea), Math.abs(eb)); let X0 = bx * Math.sign(ea) * (elimE / gE), Y0 = by * Math.sign(eb) * (elimE / gE); let kx = eb / gE, ky = -ea / gE; if (kx < 0) { kx = -kx; ky = -ky; } const shE = Math.floor(X0 / kx); X0 -= shE * kx; Y0 -= shE * ky;
      const Pc = r1[3] - r1[o[0]] * X0 - r1[o[1]] * Y0, Qc = r1[o[0]] * kx + r1[o[1]] * ky, ck = r1[k];
      const nm = V[o[0]], nn = V[o[1]]; let s0 = 0, m = 1;
      elimSteps.push(T`$(${Math.abs(ea)},${Math.abs(eb)})=${gE}$. Jedno rozwiązanie: $${nm}=${X0},\ ${nn}=${Y0}$ (sprawdzenie: $${ea}\cdot ${X0 < 0 ? '(' + X0 + ')' : X0}${eb < 0 ? '-' : '+'}${Math.abs(eb)}\cdot ${Y0 < 0 ? '(' + Y0 + ')' : Y0}=${elimE}$; znajdujemy je jak w zad. 3.13). Wszystkie: $${nm}=${aff(X0, [[kx, 's']])},\ ${nn}=${aff(Y0, [[ky, 's']])}$, $s\in\mathbb Z$.`);
      if (Math.abs(ck) === 1) elimSteps.push(T`Podstawiamy $${nm}$ i $${nn}$ do (I) i wyznaczamy $${V[k]}$: $${V[k]}=${aff(Pc * ck, [[-Qc * ck, 's']])}$ — zawsze całkowite (współczynnik przy $${V[k]}$ to $\pm1$).`);
      else if (Math.abs(ck) / gcd(Qc, Math.abs(ck)) === 1 && Pc % ck === 0) elimSteps.push(T`Podstawiamy $${nm}$ i $${nn}$ do (I): $${ck}${V[k]}=${aff(Pc, [[-Qc, 's']])}$, czyli $${V[k]}=\frac{${aff(Pc, [[-Qc, 's']])}}{${ck}}=${aff(Pc / ck, [[-Qc / ck, 's']])}$ — całkowite dla każdego $s$.`);
      else { m = Math.abs(ck) / gcd(Qc, Math.abs(ck)); while ((Pc - Qc * s0) % ck) s0++; elimSteps.push(T`Podstawiamy $${nm}$ i $${nn}$ do (I): $${V[k]}=\frac{${aff(Pc, [[-Qc, 's']])}}{${ck}}$. To jest całkowite tylko dla niektórych $s$: dokładnie gdy $s\equiv ${s0}\pmod{${m}}$, czyli $s=${aff(s0, [[m, 't']])}$, $t\in\mathbb Z$.`); }
      const pF = [0, 0, 0], vF = [0, 0, 0];
      pF[o[0]] = X0 + kx * s0; vF[o[0]] = kx * m; pF[o[1]] = Y0 + ky * s0; vF[o[1]] = ky * m; pF[k] = (Pc - Qc * s0) / ck; vF[k] = -Qc * m / ck;
      if (vF.every((c, i) => c === v[i] || c === -v[i]) && Math.abs(vF[0]) === Math.abs(v[0])) { p0 = pF; v = vF; }
    }
    const tex = solT(p0, v);
    const wrong = [[solT(p0, v.map((c, i) => (i === 2 ? -c : c))), 'Zły znak w kierunku — sprawdź drugie równanie.'], [solT(p0.map((c, i) => (i === 0 ? c + 1 : c)), v), 'Złe rozwiązanie szczególne — podstaw $t=0$.']];
    if (gg > 1) wrong.push([solT(p0, cr.map(c => c * (cr[0] < 0 ? -1 : 1))), 'Wektor kierunkowy trzeba skrócić przez NWD współrzędnych — inaczej gubimy rozwiązania.']);
    else wrong.push([solT(p0, v.map(c => 2 * c)), 'Krok $2t$ pomija co drugie rozwiązanie.']);
    wrong.push([solT(p0.map((c, i) => (i === 1 ? c - 1 : c)), v), 'Złe rozwiązanie szczególne — podstaw $t=0$ do obu równań.']);
    return mk({ gk: 'sys3', field: txtField(), q: T`Rozwiąż w liczbach całkowitych układ: $\begin{cases}${eqs[0]}\\${eqs[1]}\end{cases}$`, tex,
      steps: [T`Eliminujemy $${V[k]}$ — w (I) stoi przy tej niewiadomej mały współczynnik $${r1[k]}$. ${r1[k] === 1 ? T`Mnożymy (I) przez $${r2[k]}$` : T`Mnożymy (II) przez $${r1[k]}$, a (I) przez $${r2[k]}$`}, żeby współczynniki przy $${V[k]}$ się zrównały:`,
        T`${r1[k] === 1 ? '(II)' : T`$${r1[k]}\cdot(\text{II})$`}: $\ ${linV(r2.slice(0, 3).map(c => c * r1[k]), V)}=${r2[3] * r1[k]}$; $\ ${r2[k]}\cdot(\text{I})$: $\ ${linV(r1.slice(0, 3).map(c => c * r2[k]), V)}=${r1[3] * r2[k]}$.`,
        T`Odejmujemy stronami — $${V[k]}$ znika: $${linV(elim, V)}=${elimE}$. To równanie z dwiema niewiadomymi.`,
        ...elimSteps,
        T`Zbieramy wynik (parametr oznaczamy $t$): $${tex}$.`,
        T`Sprawdzenie dla $t=0$, czyli $(${p0.join(',')})$: (I) $${r1.slice(0, 3).map((c, i) => (i && c >= 0 ? '+' : '') + c + '\\cdot ' + (p0[i] < 0 ? '(' + p0[i] + ')' : p0[i])).join('')}=${r1[3]}$ ✓, (II) $${r2.slice(0, 3).map((c, i) => (i && c >= 0 ? '+' : '') + c + '\\cdot ' + (p0[i] < 0 ? '(' + p0[i] + ')' : p0[i])).join('')}=${r2[3]}$ ✓.`],
      wrong });
  }

  /* ===== 16. liczba rozwiązań naturalnych am + bn = N ===== */
  function countNat(a, b, N) {
    const sols = []; for (let n = 1; b * n < N; n++) { const r = N - b * n; if (r % a === 0 && r / a >= 1) sols.push(n); }
    const g = gcd(a, b);
    return mk({ gk: 'count', ans: sols.length, tex: String(sols.length), flabel: 'ile par', q: T`Ile jest par liczb naturalnych $m,n$ takich, że $${a}m+${b}n=${N}$?`,
      steps: [T`$m=\frac{${N}-${b}n}{${a}}$ musi być naturalne: $${a}\mid ${N}-${b}n$ i $${N}-${b}n\geq ${a}$.`, T`Warunek podzielności: $${b}n\equiv ${N}\pmod{${a}}$, czyli $n\equiv ${sols.length ? sols[0] % (a / g) : 0}\pmod{${a / g}}$ (sprawdzamy reszty $n$ z dzielenia przez $${a / g}$). Warunek wielkości: $m\geq1\iff ${b}n\leq ${N}-${a}=${N - a}\iff n\leq ${Math.floor((N - a) / b)}$.`,
        sols.length ? T`$n\in\{${sols[0]},${sols[1] ?? ''}${sols.length > 2 ? ',\\ldots,' + sols[sols.length - 1] : ''}\}$ — to ciąg arytmetyczny o różnicy $${a / g}$: $\frac{${sols[sols.length - 1]}-${sols[0]}}{${a / g}}+1=${sols.length}$ par.` : 'Brak par.'],
      wrong: [[String(sols.length + 1), 'Sprawdź końce: $m$ i $n$ muszą być $\\geq1$.'], [String(sols.length - 1), 'Liczba wyrazów ciągu: $\\frac{\\text{ostatni}-\\text{pierwszy}}{r}+1$.'], [String(Math.floor((N - a) / b)), 'Nie każde $n$ daje całkowite $m$ — potrzebny warunek podzielności.']] });
  }
  const genCount = () => { for (;;) { const a = R.int(2, 9), b = R.int(2, 13), N = R.int(100, 3000); if (gcd(a, b) !== 1 || a === b) continue; return countNat(a, b, N); } };

  /* ===== 17. podział 111 ===== */
  const sol17 = []; for (let x = 2; x < 111; x += 2) for (let y = 5; x + y < 111; y += 5) { const z = 111 - x - y; if (z % 7 === 0 && z > 0 && 3 * x + 4 * y + 5 * z === 490) sol17.push([x, y, z]); }
  const it17 = mk({ gk: 'split', field: txtField(), q: T`Podziel liczbę $111$ na trzy części tak, aby pierwsza była podzielna przez $2$, druga przez $5$, trzecia przez $7$, a potrójna pierwsza, poczwórna druga i pięciokrotna trzecia dawały w sumie $490$.`, tex: T`${sol17[0].join(',\\ ')}`,
    steps: [T`Części to $x,y,z$: $\ x+y+z=111$ oraz $3x+4y+5z=490$. Od drugiego równania odejmujemy potrojone pierwsze: $(3x+4y+5z)-3(x+y+z)=490-333$, czyli $y+2z=157$.`, T`$y=157-2z$ ma dzielić się przez $5$: $2z\equiv157\equiv2\pmod5$, więc $z\equiv1\pmod5$. Do tego $7\mid z$.`, T`Wielokrotności $7$: $7,14,21,\ldots$ dają reszty $2,4,1,\ldots$ z dzielenia przez $5$ — pierwsza pasująca to $21$, a następne co $5\cdot7=35$: $z\in\{21,56,91,\ldots\}$.`, T`$z=21$: $y=115>111$ ✗; $z=56$: $y=45$, $x=111-45-56=10$ (parzyste ✓); $z=91$: $y<0$ ✗.`, T`Odpowiedź: $10,\ 45,\ 56$ (sprawdzenie: $30+180+280=490$ ✓).`],
    wrong: [[T`21,\ 35,\ 55`, '$55$ nie dzieli się przez 7.'], [T`10,\ 56,\ 45`, 'Kolejność ma znaczenie: druga część przez 5, trzecia przez 7.'], [T`16,\ 25,\ 70`, 'Sprawdź: $48+100+350=498\\neq490$.']] });


  /* ===== generatory dla 3.5 (b, e, f), 3.12, 3.17 ===== */
  function sysRatio(p, q, d) { // p x = q y, (x,y) = d, (p,q) = 1
    const sol = [[q * d, p * d]];
    return mk({ gk: 'ratio', field: txtField(), q: T`Rozwiąż w liczbach naturalnych: $${p}x=${q}y,\ (x,y)=${d}$.`, tex: pairsT(sol),
      steps: [T`$${p}x=${q}y$ i $(${p},${q})=1$, więc $${q}\mid x$: $x=${q}t$, wtedy $y=${p}t$.`, T`$(x,y)=(${q}t,${p}t)=t\cdot(${q},${p})=t$, więc $t=${d}$.`, T`Odpowiedź: $x=${q * d},\ y=${p * d}$.`],
      wrong: [[pairsT([[p * d, q * d]]), T`Sprawdź: $${p}\cdot ${p * d}\neq ${q}\cdot ${q * d}$.`], [pairsT([[q, p]]), T`Wtedy $(x,y)=1$, a nie $${d}$.`], [pairsT([[q * d, p * d], [p * d, q * d]]), T`Równanie $${p}x=${q}y$ nie jest symetryczne.`]] });
  }
  const genRatio = () => { for (;;) { const p = R.int(2, 13), q = R.int(2, 13); if (p === q || gcd(p, q) !== 1) continue; return sysRatio(p, q, R.int(2, 60)); } };
  function sysLcmSum(S, k) { // x + y = S, [x,y] = k (x,y)
    const sol = brute((x, y) => x + y === S && lcm(x, y) === k * gcd(x, y), S, S);
    const cases = []; for (const s of divs(S)) for (let a = 1; a < s; a++) { const b = s - a; if (a <= b && a * b === k) cases.push([s, a, b, S / s, gcd(a, b) === 1]); }
    return mk({ gk: 'lcmsum', field: txtField(), q: T`Rozwiąż w liczbach naturalnych: $x+y=${S},\ [x,y]=${k}\,(x,y)$.`, tex: pairsT(sol),
      steps: [T`$x=da,\ y=db$, $(a,b)=1$, $d=(x,y)$. Wtedy $[x,y]=dab$, więc $dab=${k}d$, czyli $ab=${k}$.`,
        T`$x+y=d(a+b)=${S}$, więc $a+b$ dzieli $${S}$. Dla każdego takiego dzielnika szukamy $a,b$ o tej sumie i iloczynie $${k}$ (pierwiastki $u^2-(a+b)u+${k}=0$); wtedy $d=${S}:(a+b)$. Pary: ` + (cases.length ? cases.map(([s, a, b, d, ok]) => T`$a+b=${s}$: $\{${a},${b}\}$, $d=${d}$${ok ? ' ✓' : ' (nie są względnie pierwsze ✗)'}`).join('; ') : 'brak') + '.',
        T`Odpowiedź: $${pairsT(sol)}$.`],
      wrong: [[pairsT(sol.filter(([x, y]) => x < y)), 'Pary uporządkowane — dopisz zamienione.'], [pairsT(sol.slice(0, Math.max(1, sol.length - 2))), 'Brakuje przypadku — sprawdź wszystkie dzielniki sumy.'], [pairsT(cases.filter(c => c[4]).map(([, a, b]) => [a, b])), 'To pary $(a,b)$ — trzeba pomnożyć przez $d$.'], [T`\text{brak rozwiązań}`, 'Rozwiązania istnieją.']] });
  }
  const genLcmSum = () => { for (;;) { const a = R.int(1, 12), b = R.int(a + 1, 25), d = R.int(2, 40); if (gcd(a, b) !== 1) continue; const it = sysLcmSum(d * (a + b), a * b); const k = (it.mcCorrect.match(/\(\d+,\d+\)/g) || []).length; if (k >= 2 && k <= 6) return it; } };
  // błędne opcje będące tym samym zbiorem par (inna kolejność) odrzucamy
  const sameSet = (A1, B1) => A1.map(String).sort().join(';') === B1.map(String).sort().join(';');
  function sysLcm2(Lm, c, u, v, g) { // [x, c y] = Lm, (u x, v y) = g
    const sol = brute((x, y) => lcm(x, c * y) === Lm && gcd(u * x, v * y) === g, Lm, Lm);
    return mk({ gk: 'lcm2', field: txtField(), q: T`Rozwiąż w liczbach naturalnych: $[x,${c}y]=${Lm},\ (${u}x,${v}y)=${g}$.`, tex: pairsT(sol),
      steps: [T`Z $[x,${c}y]=${Lm}$: $x\mid ${Lm}$ i $${c}y\mid ${Lm}$ — kandydatów jest skończenie wiele.`, T`Z $(${u}x,${v}y)=${g}$: oba wyrażenia dzielą się przez $${g}$, a nie mają większego wspólnego dzielnika.`, T`Sprawdzamy pary kandydatów — zostają ` + sol.map(([x, y]) => `$(${x},${y})$`).join(', ') + '.', T`Odpowiedź: $${pairsT(sol)}$.`],
      wrong: [...(sameSet(sol, sol.map(([x, y]) => [y, x])) ? [] : [[pairsT(sol.map(([x, y]) => [y, x])), 'Zamienione $x$ i $y$ — warunki nie są symetryczne.']]), [pairsT(sol.slice(0, 1)), 'Brakuje rozwiązań — sprawdź wszystkich kandydatów.'], [pairsT(sol.slice(1)), 'Brakuje rozwiązania — sprawdź wszystkich kandydatów.'], [pairsT(brute((x, y) => lcm(x, c * y) === Lm && (u * x) % g === 0 && (v * y) % g === 0, Lm, Lm).slice(0, sol.length + 2)), T`Nie sprawdzono, czy NWD jest dokładnie $${g}$ — może być większy.`]] });
  }
  const genLcm2 = () => { for (;;) { const c = R.pick([2, 3]), u = R.pick([2, 3, 5, 7]), v = R.pick([2, 3, 5, 7]), x0 = R.int(2, 40), y0 = R.int(2, 30); if (u === v) continue; const Lm = lcm(x0, c * y0), g = gcd(u * x0, v * y0); if (Lm > 400 || g < 2) continue; const it = sysLcm2(Lm, c, u, v, g); const k = (it.mcCorrect.match(/\(\d+,\d+\)/g) || []).length; if (k >= 1 && k <= 5 && it.mc.length >= 3) return it; } };
  function sqSum(k) { // możliwe wartości (a^2 + k b^2, a + b) dla (a,b) = 1
    const vals = new Map(); for (let a = -40; a <= 40; a++) for (let b = 1; b <= 40; b++) if (gcd(a, b) === 1 && a + b !== 0) { const v = gcd(a * a + k * b * b, a + b); if (!vals.has(v)) vals.set(v, [a, b]); }
    const vs = [...vals.keys()].sort((x, y) => x - y), lst = xs => xs.join(',\\ ');
    const E = T`a^2+${k === 1 ? '' : k}b^2`;
    const wrongs = [[lst(divs(k)), T`Kongruencja daje $d\mid ${k + 1}$, a nie $d\mid ${k}$.`], [lst(vs.slice(0, -1)), T`Brakuje wartości $${vs[vs.length - 1]}$, np. $a=${vals.get(vs[vs.length - 1])[0]},\ b=${vals.get(vs[vs.length - 1])[1]}$.`], [lst(divs(2 * (k + 1))), T`Większe dzielniki $${2 * (k + 1)}$ nie wychodzą — $d$ dzieli $${k + 1}$.`], [lst([1]), T`Dla $a=${vals.get(vs[1] || 1)[0]},\ b=${vals.get(vs[1] || 1)[1]}$ wychodzi więcej niż 1.`]].filter(([t]) => t !== lst(vs));
    return mk({ gk: 'sqsum', field: txtField(), q: T`Niech $a,b\in\mathbb Z$, $(a,b)=1$. Znajdź wszystkie możliwe wartości $(${E},\ a+b)$.`, tex: lst(vs),
      steps: [T`Niech $d=(${E},a+b)$. Z $d\mid a+b$: $a\equiv-b\pmod d$, więc $${E}\equiv ${k + 1}b^2\pmod d$, czyli $d\mid ${k + 1}b^2$.`, T`Jak w zad. 3.11: $d\mid a+b$ i $(a,b)=1$ daje $(d,b)=1$, więc $d\mid ${k + 1}$.`, T`Każdy dzielnik $${k + 1}$ występuje: ` + vs.map(v => T`$${v}$ dla $a=${vals.get(v)[0]},b=${vals.get(v)[1]}$`).join(', ') + T`. Odpowiedź: $${lst(vs)}$.`],
      wrong: wrongs });
  }
  function split3(N, ds, ws, S) { // N = x+y+z, d_i | części, Σ w_i·część = S
    const sol = []; for (let x = ds[0]; x < N; x += ds[0]) for (let y = ds[1]; x + y < N; y += ds[1]) { const z = N - x - y; if (z > 0 && z % ds[2] === 0 && ws[0] * x + ws[1] * y + ws[2] * z === S) sol.push([x, y, z]); }
    if (sol.length !== 1) return null;
    const [X, Y, Z] = sol[0], A2 = ws[1] - ws[0], A3 = ws[2] - ws[0], RHS = S - ws[0] * N;
    const zs = []; for (let z = ds[2]; z < N; z += ds[2]) { const r = RHS - A3 * z; if (r % A2 === 0) { const y = r / A2; zs.push([z, y, N - y - z]); } }
    const fmt = ([z, y, x]) => T`$z=${z}$: $y=${y}$, $x=${x}$ ${y > 0 && x > 0 && y % ds[1] === 0 && x % ds[0] === 0 ? '✓' : '✗'}`;
    return mk({ gk: 'split', field: txtField(), q: T`Podziel liczbę $${N}$ na trzy części tak, aby pierwsza była podzielna przez $${ds[0]}$, druga przez $${ds[1]}$, trzecia przez $${ds[2]}$, a ${ws[0]}-krotność pierwszej, ${ws[1]}-krotność drugiej i ${ws[2]}-krotność trzeciej dawały w sumie $${S}$.`, tex: T`${X},\ ${Y},\ ${Z}`,
      steps: [T`$x+y+z=${N}$, $${ws[0]}x+${ws[1]}y+${ws[2]}z=${S}$. Odejmujemy $${ws[0]}$ razy pierwsze: $${A2 === 1 ? '' : A2}y${A3 < 0 ? '-' : '+'}${Math.abs(A3) === 1 ? '' : Math.abs(A3)}z=${RHS}$.`, T`Przeglądamy $z$ podzielne przez $${ds[2]}$, dla których $y$ wychodzi całkowite: ` + zs.slice(0, 6).map(fmt).join('; ') + (zs.length > 6 ? '; …' : '') + '.', T`Odpowiedź: $${X},\ ${Y},\ ${Z}$ (sprawdzenie: $${ws[0] * X}+${ws[1] * Y}+${ws[2] * Z}=${S}$ ✓).`],
      wrong: [[T`${Y},\ ${X},\ ${Z}`, 'Kolejność ma znaczenie — każda część ma swój dzielnik.'], [T`${X + ds[0]},\ ${Y},\ ${Z - ds[0]}`, T`Suma się zgadza, ale ważona nie: sprawdź $${ws[0]}x+${ws[1]}y+${ws[2]}z$.`], [T`${X},\ ${Y + ds[1]},\ ${Z - ds[1]}`, T`Trzecia część musi dzielić się przez $${ds[2]}$, a ważona suma się nie zgadza.`]] });
  }
  const genSplit = () => { for (;;) { const ds = R.shuffle([2, 3, 4, 5, 6, 7, 9]).slice(0, 3), ws = R.shuffle([2, 3, 4, 5, 6]).slice(0, 3); const parts = ds.map(d => d * R.int(1, 12)); const N = parts.reduce((a, b) => a + b, 0), S = parts.reduce((s, x, i) => s + ws[i] * x, 0); if (N > 150) continue; const it = split3(N, ds, ws, S); if (it && it.mc.length >= 3) return it; } };

  /* ===== opracowanie ===== */
  const F = {
    m_euk: W(T`<b>Algorytm Euklidesa</b>: $(a,b)=(b,r)$, gdzie $r$ to reszta z dzielenia $a$ przez $b$. Powtarzaj, aż reszta będzie $0$ — NWD to ostatnia niezerowa reszta.`,
      T`Dlaczego to działa: $a=qb+r$, więc każdy wspólny dzielnik $a$ i $b$ dzieli też $r=a-qb$, i odwrotnie. Pary $(a,b)$ i $(b,r)$ mają te same wspólne dzielniki.`,
      T`Liczby maleją, więc po kilku krokach reszta będzie $0$: wtedy $(r,0)=r$.`,
      T`Przykład: $(252,198)$: $252=1\cdot198+54$, $198=3\cdot54+36$, $54=1\cdot36+18$, $36=2\cdot18+0$. Wynik: $18$.`,
      T`Dla trzech liczb liczymy po kolei: $(a,b,c)=((a,b),c)$.`),
    m_ext: W(T`<b>Rozszerzony Euklides (tożsamość Bézouta)</b>: zawsze istnieją całkowite $x,y$ z $ax+by=(a,b)$.`,
      T`Zapisuj każdą resztę jako kombinację $a$ i $b$. Startujemy od $a=a\cdot1+b\cdot0$ i $b=a\cdot0+b\cdot1$.`,
      T`Skoro $r=(\text{poprzednia})-q\cdot(\text{ostatnia})$, to współczynniki liczymy tym samym działaniem: odejmujemy $q$ razy współczynniki ostatniej linii.`,
      T`Przykład $(252,198)$: $54=252-198$, czyli $54=252\cdot1+198\cdot(-1)$; $36=198-3\cdot54=252\cdot(-3)+198\cdot4$; $18=54-36=252\cdot4+198\cdot(-5)$.`,
      T`Zawsze sprawdź na końcu podstawiając: $252\cdot4-198\cdot5=1008-990=18$ ✓.`),
    m_dio: W(T`<b>Równanie $ax+by=c$ w liczbach całkowitych</b>: ma rozwiązania $\iff d=(a,b)\mid c$.`,
      T`Lewa strona zawsze dzieli się przez $d$ — jeśli $d\nmid c$, rozwiązań nie ma.`,
      T`Jeśli $d\mid c$: z Bézouta $ax_1+by_1=d$; mnożymy przez $\frac cd$ i mamy rozwiązanie szczególne $x_0=x_1\frac cd$, $y_0=y_1\frac cd$.`,
      T`Wszystkie rozwiązania: $x=x_0+\frac bd t,\ y=y_0-\frac ad t$, $t\in\mathbb Z$ — po podstawieniu $t$ się skraca: $a\frac bd t-b\frac ad t=0$.`,
      T`Przykład $8x+3y=2$: $8\cdot(-1)+3\cdot3=1$, razy $2$: $x_0=-2,y_0=6$; ogólnie $x=-2+3t,\ y=6-8t$ (to samo co $x=1+3t,\ y=-2-8t$ po przesunięciu $t$).`,
      T`Nie zapomnij dzielić przez $d$: kroki $\frac bd$ i $\frac ad$ — inaczej zgubisz co którąś parę.`),
    m_dio3: W(T`<b>Trzy niewiadome $ax+by+cz=e$</b>: wprowadź $w$ z $ax+by=(a,b)\,w$ i rozwiąż dwa równania z dwiema niewiadomymi.`,
      T`Niech $d=(a,b)$. Wtedy $ax+by$ to zawsze wielokrotność $d$, więc piszemy $ax+by=dw$.`,
      T`Najpierw rozwiązujemy $dw+cz=e$ (zwykłe równanie z dwiema niewiadomymi) — dostajemy $w$ i $z$ zależne od parametru $s$.`,
      T`Potem rozwiązujemy $ax+by=dw$ — dochodzi drugi parametr $t$.`,
      T`Wynik ma dwa parametry, bo jedno równanie z trzema niewiadomymi wyznacza „płaszczyznę” rozwiązań.`),
    m_nwdnww: W(T`<b>Układy z NWD i NWW</b>: jeśli $(x,y)=d$, to $x=da$, $y=db$, gdzie $(a,b)=1$; wtedy $[x,y]=dab$.`,
      T`Wyciągamy wspólny czynnik $d$ — po jego wyciągnięciu $a$ i $b$ nie mogą mieć już wspólnego dzielnika, inaczej NWD byłby większy.`,
      T`Podstawiamy do drugiego warunku, np. $x+y=180$, $(x,y)=30$: $30(a+b)=180$, czyli $a+b=6$.`,
      T`Wypisujemy pary $(a,b)$ i <b>odrzucamy</b> te, które nie są względnie pierwsze: z $a+b=6$ zostaje tylko $(1,5)$ i $(5,1)$.`,
      T`Pary są uporządkowane — $(30,150)$ i $(150,30)$ to dwa rozwiązania.`),
    m_red: W(T`<b>Redukcja NWD</b>: $(x,y)=(x,\ y-kx)$ dla każdego całkowitego $k$; także $(x,y)=(-x,y)$.`,
      T`Wspólny dzielnik $x$ i $y$ dzieli $y-kx$; i odwrotnie — wspólny dzielnik $x$ i $y-kx$ dzieli $y=(y-kx)+kx$.`,
      T`Dzięki temu „Euklides” działa też na wyrażeniach: $(2n+1,\ 9n+4)=(2n+1,\ 9n+4-4(2n+1))=(2n+1,\ n)=(1,\ n)=1$.`,
      T`Odejmuj tak, żeby zmniejszać współczynniki — jak przy dzieleniu z resztą.`),
    m_komb2: W(T`<b>Kombinacja dająca stałą</b>: jeśli $uL+vM=\pm1$, to $(L,M)=1$.`,
      T`Każdy wspólny dzielnik $L$ i $M$ dzieli każdą ich kombinację, więc dzieli też $\pm1$ — jedyny taki dodatni to $1$.`,
      T`Dla ułamka $\frac{an+b}{cn+d}$ mnożymy krzyżowo współczynniki przy $n$: $c(an+b)-a(cn+d)=bc-ad$ — $n$ się skraca.`,
      T`Jeśli $bc-ad=\pm1$, ułamek jest zawsze nieskracalny. Jeśli wyszło np. $17$, to ułamek może skracać się przez $17$ — szukaj $n$ z $17\mid an+b$.`),
    m_pierw: W(T`<b>Nie wprost z liczbą pierwszą</b>: jeśli $(x,y)>1$, to jakaś liczba pierwsza $p$ dzieli i $x$, i $y$.`,
      T`Każda liczba $>1$ ma dzielnik pierwszy — wystarczy więc pokazać, że <i>żadna</i> liczba pierwsza nie dzieli obu.`,
      T`Zakładamy $p\mid x$ i $p\mid y$, liczymy modulo $p$ i dochodzimy do sprzeczności, np. $p\mid1$.`,
      T`Przydaje się lemat: jeśli $p\mid ab$, to $p\mid a$ lub $p\mid b$.`),
    m_wzaj: W(T`<b>Wzajemna podzielność</b>: żeby pokazać $d=e$ dla dodatnich $d,e$, wystarczy $d\mid e$ i $e\mid d$.`,
      T`Z $d\mid e$ mamy $d\leq e$, z $e\mid d$ mamy $e\leq d$ — więc $d=e$.`,
      T`Przy NWD: pokaż, że wspólny dzielnik jednej pary dzieli obie liczby drugiej pary, i odwrotnie.`,
      T`Np. $(7a+4b,\ 9a+5b)=(a,b)$: $a,b$ dają obie kombinacje, a z kolei $a=-5(7a+4b)+4(9a+5b)$, $b=9(7a+4b)-7(9a+5b)$.`),
    nwdw: W(T`<b>Własności NWD i NWW</b>: $(ka,kb)=k(a,b)$, $(a,b)\cdot[a,b]=ab$ (dla dodatnich), wspólny dzielnik dzieli NWD.`,
      T`$(ka,kb)=k(a,b)$: z rozkładu na czynniki — mnożenie przez $k$ dodaje te same wykładniki obu liczbom.`,
      T`$(a,b)[a,b]=ab$: przy każdej liczbie pierwszej $\min+\max$ wykładników to ich suma.`,
      T`Każdy wspólny dzielnik $a$ i $b$ dzieli $(a,b)$ (bo $(a,b)=ax+by$).`),
    nat: W(T`<b>Rozwiązania naturalne</b>: przyjmujemy $\mathbb N=\{1,2,3,\ldots\}$ — szukamy rozwiązań z $x,y\geq1$.`,
      T`Weź rozwiązanie ogólne $x=x_0+kt$, $y=y_0+lt$ i zapisz warunki $x\geq1$, $y\geq1$ jako nierówności na $t$.`,
      T`Jeśli przedział dla $t$ zawiera liczbę całkowitą — rozwiązanie naturalne istnieje; jeśli jest pusty — nie.`,
      T`Przy dodatnich współczynnikach szybki test: $ax+by\geq a+b$, więc gdy $c<a+b$, rozwiązań naturalnych nie ma.`,
      T`Przy współczynnikach różnych znaków (np. $54x-42y$) rozwiązań naturalnych jest nieskończenie wiele, o ile są całkowite.`),
  };
  const [t1a, t1b] = trains([462, 546, 630]);
  const L13 = [[8, 3, 2], [75, -39, 14], [32, 45, 7], [55, 83, 202], [50, 111, 89], [54, -42, -18]];
  A.addList({
    num: 23, id: 'e3', subject: 'etl', title: 'Lista 3', name: 'NWD i równania diofantyczne', hue: 'e3',
    blurb: 'Algorytm Euklidesa, tożsamość Bézouta, układy z NWD/NWW, ułamki nieskracalne i równania w liczbach całkowitych.',
    tasks: [
      { id: 'E3.1', name: 'Pociągi wojskowe', statement: T`Przez stację kolejową przejechały trzy pociągi wojskowe. W pierwszym było $462$ żołnierzy, w drugim $546$, a w trzecim $630$. Z ilu wagonów składały się poszczególne pociągi, jeżeli w każdym wagonie była taka sama liczba żołnierzy i liczba ta była największa z możliwych?`, wzIds: ['m_euk', 'nwdw'], gen: genTrains, items: [P('(liczba w wagonie)', t1a), P('(wagony)', t1b)] },
      { id: 'E3.2', name: 'Dzielnik z resztami', statement: T`Liczby $4373$ oraz $826$ podzielono przez tę samą liczbę naturalną i otrzymano odpowiednio reszty $8$ i $7$. Znajdź tę liczbę.`, wzIds: ['m_euk', 'nwdw'], gen: genRem, items: [P('3.2', sameRem(4373, 8, 826, 7))] },
      { id: 'E3.3', name: 'Oblicz NWD', statement: T`Oblicz: $(990,4095)$, $(168,396)$, $(143,91)$, $(252,198)$, $(211,754)$, $(1001,286,312)$, $(420,1115,630)$.`, wzIds: ['m_euk', 'nwdw'], gen: genGcd,
        items: [[990, 4095], [168, 396], [143, 91], [252, 198], [211, 754], [1001, 286, 312], [420, 1115, 630]].map((ns, i) => P('(' + 'abcdefg'[i] + ')', gcdItem(ns))) },
      { id: 'E3.4', name: 'Tożsamość Bézouta', statement: T`Znajdź liczby całkowite takie, że: (a) $990x+4095y=(990,4095)$, (b) $252x+198y=(252,198)$, (c) $168x+396y=(168,396)$, (d) $221x+754y=(221,754)$, (e) $1001x+286y+312z=(1001,286,312)$, (f) $420x+1115y+630z=(420,1115,630)$.`, wzIds: ['m_ext', 'm_euk'], gen: genBez,
        items: [[990, 4095], [252, 198], [168, 396], [221, 754], [1001, 286, 312], [420, 1115, 630]].map((ns, i) => P('(' + 'abcdef'[i] + ')', bezout(ns))) },
      { id: 'E3.5', name: 'Układy z NWD i NWW', statement: T`Rozwiąż w liczbach naturalnych: (a) $x+y=180,\ (x,y)=30$; (b) $7x=11y,\ (x,y)=45$; (c) $xy=720,\ (x,y)=4$; (d) $(x,y)=15,\ [x,y]=420$; (e) $x+y=667,\ [x,y]=120(x,y)$; (f) $[x,2y]=308,\ (3x,5y)=7$.`, wzIds: ['m_nwdnww', 'nwdw'],
        gen: gk => (['sum', 'prod', 'lcm'].includes(gk) ? genNwdSys(gk) : gk === 'ratio' ? genRatio() : gk === 'lcmsum' ? genLcmSum() : gk === 'lcm2' ? genLcm2() : genNwdSys(R.pick(['sum', 'prod', 'lcm']))),
        items: [P('(a)', nwdSys('sum', 180, 30)), P('(b)', sys5b), P('(c)', nwdSys('prod', 720, 4)), P('(d)', nwdSys('lcm', 420, 15)), P('(e)', sys5e), P('(f)', sys5f)] },
      { id: 'E3.6', name: '$(7a+4b,9a+5b)=(a,b)$', statement: T`Wykazać, że dla dowolnych liczb całkowitych $a$ i $b$ takich, że $a\neq0$ lub $b\neq0$, zachodzi równość $(7a+4b,\ 9a+5b)=(a,b)$.`, wzIds: ['m_wzaj', 'm_red', 'nwdw'], gen: genGcomb, items: [P('3.6', gcdComb(7, 4, 9, 5))] },
      { id: 'E3.7', name: 'Ułamki nieskracalne', statement: T`Niech $n\in\mathbb N$. (a) Udowodnij, że ułamek $\frac{2n+1}{9n+4}$ jest nieskracalny. (b) Czy dla każdego $n$ ułamki $\frac{8n+3}{13n+5}$, $\frac{2n-1}{9n+4}$, $\frac{11n+2}{18n+5}$ są nieskracalne?`, wzIds: ['m_komb2', 'm_red'],
        gen: gk => (gk === 'fcheck' ? genFracCheck() : genFracIrr()), items: [P('(a)', fracIrr(2, 1, 9, 4)), P('(b) 1', fracCheck(8, 3, 13, 5)), P('(b) 2', fracCheck(2, -1, 9, 4)), P('(b) 3', fracCheck(11, 2, 18, 5))] },
      { id: 'E3.8', name: '$ad-bc=1$', statement: T`Udowodnij, że jeżeli $ad-bc=1$, to ułamek $\frac{a+b}{c+d}$ jest nieskracalny.`, wzIds: ['m_komb2', 'm_pierw'], items: [it8] },
      { id: 'E3.9', name: '$\\frac{2n^2+8n+4}{2n^2+6n+3}$', statement: T`Udowodnij, że jeśli $n\in\mathbb N$, to ułamek $\frac{2n^2+8n+4}{2n^2+6n+3}$ jest nieskracalny.`, wzIds: ['m_red', 'm_komb2'], items: [it9] },
      { id: 'E3.10', name: '$(a+b,a-b)\\in\\{1,2\\}$', statement: T`Niech $a,b\in\mathbb Z$. Pokazać, że jeżeli $(a,b)=1$, to $(a+b,a-b)$ jest równe $1$ lub $2$.`, wzIds: ['nwdw', 'm_pierw'], items: [it10] },
      { id: 'E3.11', name: '$c\\mid a+b\\Rightarrow(c,a)=1$', statement: T`Niech $a,b\in\mathbb Z$. Udowodnić, że jeżeli $(a,b)=1$ i $c\mid a+b$, to $(c,a)=(c,b)=1$.`, wzIds: ['nwdw', 'm_pierw'], items: [it11] },
      { id: 'E3.12', name: '$(a^2+b^2,a+b)$', statement: T`Niech $a,b\in\mathbb Z$. Znajdź wszystkie możliwe wartości liczby $(a^2+b^2,a+b)$, jeśli $(a,b)=1$.`, wzIds: ['nwdw', 'm_pierw'], gen: () => sqSum(R.pick([2, 3, 4, 5, 6, 7, 8, 9, 11])), items: [P('3.12', it12)] },
      { id: 'E3.13', name: 'Równania diofantyczne', statement: T`W liczbach całkowitych rozwiązać: (a) $8x+3y=2$, (b) $75x-39y=14$, (c) $32x+45y=7$, (d) $55x+83y=202$, (e) $50x+111y=89$, (f) $54x-42y=-18$, (g) $2x+3y+5z=11$, (h) $181x+51y+12z=3$.`, wzIds: ['m_dio', 'm_dio3', 'm_ext'],
        gen: gk => (gk === 'dio3' ? dio3(R.int(2, 30), R.int(2, 30), R.int(2, 20), R.int(1, 40)) : genDio()),
        items: L13.map((c, i) => P('(' + 'abcdef'[i] + ')', dio2(...c))).concat([P('(g)', dio3(2, 3, 5, 11)), P('(h)', dio3(181, 51, 12, 3))]) },
      { id: 'E3.14', name: 'Rozwiązania naturalne?', statement: T`Czy istnieją pary liczb naturalnych $x,y$ spełniające równania z poprzedniego zadania?`, wzIds: ['nat', 'm_dio'],
        gen: () => { const cs = [R.int(2, 40), R.int(2, 40) * R.pick([1, -1])], e = R.int(-40, 300); return natExist(cs, e, ''); },
        items: L13.map((c, i) => natExist([c[0], c[1]], c[2], '(' + 'abcdef'[i] + ')')).concat([natExist([2, 3, 5], 11, '(g)'), natExist([181, 51, 12], 3, '(h)')]) },
      { id: 'E3.15', name: 'Układy w liczbach całkowitych', statement: T`W liczbach całkowitych rozwiązać układy: (a) $15x-3y+8z=-36$, $9x+2y-3z=1$; (b) $2x-y+z=5$, $3x+2y+z=7$; (c) $x-2y+3z=6$, $2x+y-2z=9$.`, wzIds: ['m_dio', 'm_dio3'],
        gen: () => { for (;;) { const nz = (lo, hi) => { for (;;) { const v = R.int(lo, hi); if (v) return v; } }; const r1 = [nz(-5, 9), nz(-5, 9), R.pick([1, -1, 2, 3])], r2 = [nz(-5, 9), nz(-5, 9), nz(-4, 4)]; const xs = [R.int(-6, 9), R.int(-6, 9), R.int(-6, 9)]; const cr = [r1[1] * r2[2] - r1[2] * r2[1], r1[2] * r2[0] - r1[0] * r2[2], r1[0] * r2[1] - r1[1] * r2[0]]; if (cr.every(c => !c) || cr.some(c => Math.abs(c) > 40)) continue; const it = sys3(r1.concat([r1[0] * xs[0] + r1[1] * xs[1] + r1[2] * xs[2]]), r2.concat([r2[0] * xs[0] + r2[1] * xs[1] + r2[2] * xs[2]])); if (/NaN|Infinity|undefined/.test(JSON.stringify(it))) continue; return it; } },
        items: [P('(a)', sys3([15, -3, 8, -36], [9, 2, -3, 1])), P('(b)', sys3([2, -1, 1, 5], [3, 2, 1, 7])), P('(c)', sys3([1, -2, 3, 6], [2, 1, -2, 9]))] },
      { id: 'E3.16', name: '$2m+5n=2001$', statement: T`Ile jest par liczb naturalnych $m,n$ takich, że $2m+5n=2001$?`, wzIds: ['m_dio', 'nat'], gen: genCount, items: [P('3.16', countNat(2, 5, 2001))] },
      { id: 'E3.17', name: 'Podział liczby 111', statement: T`Podzielić liczbę $111$ na takie trzy części, aby pierwsza część była podzielna przez $2$, druga przez $5$, a trzecia przez $7$ i aby potrójna pierwsza część, poczwórna druga i pięciokrotna trzecia dawały w sumie $490$.`, wzIds: ['m_dio'], gen: genSplit, items: [P('3.17', it17)] },
    ],
  });
  for (const t of A.lists.find(l => l.id === 'e3').tasks) t.wzLib = F;
  A.ETL3 = { bezSteps, gcdItem, genGcd, bezout, genBez, trains, genTrains, sameRem, genRem, nwdSys, genNwdSys, gcdComb, genGcomb, fracIrr, genFracIrr, fracCheck, genFracCheck, dio2, genDio, dio3, natExist, sys3, countNat, genCount, sol17, sol5e, sol5f, linV, egcd, lcm, gcdN, bezoutRows, euclidRows };
  void norm;
})();
