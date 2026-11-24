/* Elementarna teoria liczb — Lista 4: postać kanoniczna, wykładniki p-adyczne, liczba i suma dzielników. */
(function () {
  'use strict';
  const A = AQ, R = A.R, T = String.raw;
  const { S, M, proof, P, gcd, W, mk, txtField } = A.ETLH;
  const E3 = A.ETL3;
  const factor = n => { n = Math.abs(n); const f = {}; for (let p = 2; p * p <= n; p++) while (n % p === 0) { f[p] = (f[p] || 0) + 1; n /= p; } if (n > 1) f[n] = (f[n] || 0) + 1; return f; };
  const primesOf = f => Object.keys(f).map(Number).sort((a, b) => a - b);
  const powT = (p, e) => (e === 1 ? String(p) : p + '^{' + e + '}');
  const canonT = f => primesOf(f).filter(p => f[p]).map(p => powT(p, f[p])).join('\\cdot ') || '1';
  const tau = f => primesOf(f).reduce((s, p) => s * (f[p] + 1), 1);
  const sigma = f => primesOf(f).reduce((s, p) => s * (p ** (f[p] + 1) - 1) / (p - 1), 1);
  const mul = (f, g, k = 1) => { const r = Object.assign({}, f); for (const p of primesOf(g)) r[p] = (r[p] || 0) + k * g[p]; return r; };
  const val = f => primesOf(f).reduce((s, p) => s * p ** f[p], 1);
  const big = n => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '\\,');

  /* ===== 1. wykładniki p-adyczne ===== */
  function vpItem(num, den) {
    const g = gcd(num, den), a = num / g, b = den / g, fa = factor(a), fb = factor(b), v = Object.assign({}, fa); for (const p of primesOf(fb)) v[p] = -fb[p];
    const vT = w => primesOf(w).filter(p => w[p]).map(p => T`v_{${p}}=${w[p]}`).join(',\\quad ') + T`\ (\text{pozostałe }0)`;
    const xT = den === 1 ? String(num) : (num < 0 ? '-' : '') + T`\frac{${Math.abs(num)}}{${den}}`;
    const wrong = [];
    if (primesOf(fb).length) wrong.push([vT(mul(fa, fb)), 'Wykładniki z mianownika są ujemne: $v_p\\left(\\frac ab\\right)=v_p(a)-v_p(b)$.']);
    if (g > 1) { const w = Object.assign({}, factor(num)); for (const p of primesOf(factor(den))) w[p] = (w[p] || 0) - factor(den)[p]; const w2 = factor(Math.abs(num)); for (const p of primesOf(factor(den))) w2[p] = -factor(den)[p]; wrong.push([vT(w2), 'Najpierw skróć ułamek (albo odejmij wykładniki tej samej liczby pierwszej).']); void w; }
    if (num < 0) wrong.push([vT(v) + T`,\ v_{-1}=1`, 'Znak nie ma wykładnika — $v_p(-x)=v_p(x)$.']);
    const ps = primesOf(v).filter(p => v[p]);
    wrong.push([vT(Object.assign({}, v, { [ps[ps.length - 1]]: v[ps[ps.length - 1]] + (v[ps[ps.length - 1]] > 0 ? 1 : -1) })), 'Policz jeszcze raz krotność ostatniej liczby pierwszej.']);
    wrong.push([vT(Object.assign({}, v, { [ps[0]]: -v[ps[0]] })), 'Zły znak wykładnika.']);
    wrong.push([vT(Object.assign({}, v, { 2: (v[2] || 0) + 1 })), '$2$ nie występuje w tej liczbie w takiej potędze.']);
    return mk({ gk: 'vp', field: txtField(), q: T`Wyznacz wszystkie wykładniki liczb pierwszych (wykładniki $p$-adyczne) liczby $${xT}$.`, tex: vT(v),
      steps: [den === 1 ? T`Rozkład: $${Math.abs(num)}=${canonT(fa)}$${num < 0 ? ' (znak minus nie ma wpływu)' : ''}.` : T`${g > 1 ? T`Skracamy: $\frac{${Math.abs(num)}}{${den}}=\frac{${Math.abs(a)}}{${b}}$. ` : ''}Rozkłady: $${Math.abs(a)}=${canonT(fa)}$, $${b}=${canonT(fb)}$${num < 0 ? ' (znak minus nie ma wpływu)' : ''}.`,
        den === 1 ? T`$v_p(x)$ to wykładnik, w jakim liczba pierwsza $p$ występuje w rozkładzie. Odczytujemy wykładniki z rozkładu: ` + ps.map(q => T`$v_{${q}}=${v[q]}$`).join(', ') + '. Każda inna liczba pierwsza w rozkładzie nie występuje, więc ma wykładnik $0$.'
          : T`Dla ułamka wykładniki z licznika liczymy z plusem, a z mianownika z minusem: $v_p\left(\frac ab\right)=v_p(a)-v_p(b)$. ` + ps.map(q => T`$v_{${q}}=${fa[q] || 0}-${fb[q] || 0}=${v[q]}$`).join(', ') + '. Pozostałe liczby pierwsze mają wykładnik $0$.',
        T`Odpowiedź: $${vT(v)}$.`], wrong });
  }
  const genVp = () => { for (;;) { const num = R.int(2, 200) * R.pick([1, 1, -1]), den = R.pick([1, R.int(2, 120)]); if (Math.abs(num) === den) continue; const it = vpItem(num, den); if (it.mc.length >= 3) return it; } };

  /* ===== 2. postać kanoniczna, liczba i suma dzielników ===== */
  // 120:2=60, 60:2=30, … — dzielenie przez kolejne liczby pierwsze
  const divChain = n => { const out = []; let m = n; for (let p = 2; m > 1; p++) while (m % p === 0) { out.push(T`$${m}:${p}=${m / p}$`); m /= p; } return out.join(', '); };
  function canonItem(n) {
    const f = factor(n), t = tau(f), s = sigma(f), ps = primesOf(f);
    const ans = T`${canonT(f)};\ \ \tau=${t},\ \sigma=${s}`;
    const prodE = ps.reduce((x, p) => x * f[p], 1);
    return mk({ gk: 'canon', field: txtField(), q: T`Przedstaw $${n}$ w postaci kanonicznej i podaj liczbę $\tau$ oraz sumę $\sigma$ jej dzielników naturalnych.`, tex: ans,
      steps: [T`Dzielimy przez kolejne liczby pierwsze, dopóki się da: ` + divChain(n) + T`. Zatem $${n}=${canonT(f)}$.`,
        T`Każdy dzielnik ma postać $${ps.map((p, i) => powT(p, 'abcd'[i])).join('\\cdot ')}$, gdzie ${ps.map((p, i) => T`$${'abcd'[i]}\in\{${f[p] === 1 ? '0,1' : f[p] === 2 ? '0,1,2' : '0,\\ldots,' + f[p]}\}$ (${f[p] + 1} możliwości)`).join(', ')}. Wszystkich wyborów jest $\tau=${ps.map(p => '(' + f[p] + '+1)').join('')}=${t}$.`,
        T`Suma dzielników: wymnażamy nawiasy z potęgami każdej liczby pierwszej — każdy składnik iloczynu to jeden dzielnik: $\sigma=${ps.map(p => '(' + Array.from({ length: f[p] + 1 }, (_, i) => (i ? powT(p, i) : '1')).join('+') + ')').join('\\cdot ')}${ps.length > 1 ? '=' + ps.map(p => (p ** (f[p] + 1) - 1) / (p - 1)).join('\\cdot ') : ''}=${s}$.`],
      wrong: [[T`${canonT(f)};\ \ \tau=${prodE === t ? t + 1 : prodE},\ \sigma=${s}`, 'Liczba dzielników to iloczyn $(\\alpha_i+1)$, a nie samych wykładników.'], [T`${canonT(f)};\ \ \tau=${t},\ \sigma=${s - n}`, 'Do sumy dzielników wlicza się też sama liczba $n$.'], [T`${canonT(f)};\ \ \tau=${t - 1},\ \sigma=${s - 1}`, 'Dzielnik $1$ też się liczy.']] });
  }
  const genCanon = () => { for (;;) { const n = R.int(12, 400); const f = factor(n); if (primesOf(f).length >= 2 || Object.values(f)[0] >= 3) return canonItem(n); } };

  /* ===== 3. postać kanoniczna iloczynu ===== */
  function prodCanon(parts) { // [[base, exp], ...]
    let f = {}; for (const [b, e] of parts) f = mul(f, factor(b), e);
    const exprT = parts.map(([b, e]) => powT(b, e)).join('\\cdot ');
    const wrongF = (() => { let g = {}; for (const [b, e] of parts) { const fb = factor(b); for (const p of primesOf(fb)) g[p] = (g[p] || 0) + fb[p] + e - 1; } return g; })();
    return mk({ gk: 'prod', field: txtField(), q: T`Zapisz w postaci kanonicznej liczbę $${exprT}$.`, tex: canonT(f),
      steps: [T`Rozkładamy podstawy: ` + parts.map(([b, e]) => T`$${powT(b, e)}=${e > 1 && (primesOf(factor(b)).length > 1 || Object.values(factor(b))[0] > 1) ? '(' + canonT(factor(b)) + ')^{' + e + '}=' : ''}${canonT(mul({}, factor(b), e))}$`).join(', ') + '.', T`Dodajemy wykładniki tych samych liczb pierwszych: ` + primesOf(f).map(q => T`przy $${q}$: $${parts.map(([b, e]) => (factor(b)[q] || 0) * e).filter(x => x).join('+')}=${f[q]}$`).join(', ') + T`. Wynik: $${canonT(f)}$.`],
      wrong: [[canonT(wrongF), 'Potęgując iloczyn, mnożymy wykładniki: $(p^a)^e=p^{ae}$.'], [canonT(Object.fromEntries(primesOf(f).map((p, i) => [p, f[p] + (i ? 0 : 1)]))), 'Sprawdź sumę wykładników $2$.'], [canonT(Object.fromEntries(primesOf(f).map((p, i) => [p, f[p] - (i ? 1 : 0)]))), 'Sprawdź sumę wykładników — każdy czynnik się liczy.'], [canonT(Object.fromEntries(primesOf(f).map((p, i, arr) => [p, f[p] + (i === arr.length - 1 ? 1 : 0)]))), 'Sprawdź sumę wykładników ostatniej liczby pierwszej.'], [canonT(Object.fromEntries(primesOf(f).map(p => [p, Math.max(1, f[p] - 1)]))), 'Każdy czynnik dokłada swój wykładnik — policz jeszcze raz.'], [canonT(mul(f, { 3: 1 })), 'Sprawdź sumę wykładników $3$.'], [canonT(mul(f, { 5: 1 })), 'W rozkładzie nie ma tylu piątek — sprawdź podstawy.'], [canonT(mul(f, { 2: 2 })), 'Sprawdź sumę wykładników $2$ — każdy czynnik się liczy.']] });
  }
  const genProd = () => { const parts = []; const k = R.int(3, 4); for (let i = 0; i < k; i++) parts.push([R.pick([2, 3, 5, 6, 10, 12, 15, 18, 24]), R.int(1, 4)]); return prodCanon(parts); };

  /* ===== 4(a), 5. NWD i NWW przez wykładniki ===== */
  function gcdLcmItem(nums, which, label) {
    const fs = nums.map(factor), ps = [...new Set(fs.flatMap(primesOf))].sort((a, b) => a - b);
    const g = {}, l = {}; for (const p of ps) { const es = fs.map(f => f[p] || 0); g[p] = Math.min(...es); l[p] = Math.max(...es); }
    const r = which === 'gcd' ? g : l, v = val(r), sym = which === 'gcd' ? '(' : '[', sym2 = which === 'gcd' ? ')' : ']';
    const other = which === 'gcd' ? val(l) : val(g);
    return mk({ label, gk: which, ans: v, tex: String(v), flabel: which === 'gcd' ? 'NWD' : 'NWW', q: T`Przy pomocy wykładników $p$-adycznych oblicz $${sym}${nums.join(',')}${sym2}$.`,
      steps: [T`Rozkłady: ` + nums.map((n, i) => T`$${n}=${canonT(fs[i])}$`).join(', ') + '.', which === 'gcd' ? T`Wspólny dzielnik może mieć przy każdej liczbie pierwszej wykładnik co najwyżej taki jak w każdej z liczb — bierzemy najmniejszy: ` + ps.map(p => T`$v_{${p}}=\min(${fs.map(f => f[p] || 0).join(',')})=${g[p]}$`).join(', ') + '.' : T`Wspólna wielokrotność musi mieć przy każdej liczbie pierwszej wykładnik co najmniej taki jak w każdej z liczb — bierzemy największy: ` + ps.map(p => T`$v_{${p}}=\max(${fs.map(f => f[p] || 0).join(',')})=${l[p]}$`).join(', ') + '.', T`$${sym}${nums.join(',')}${sym2}=${canonT(r) === String(v) ? '' : canonT(r) + '='}${big(v)}$.`],
      wrong: [[String(other), which === 'gcd' ? 'To NWW — dla NWD bierzemy najmniejsze wykładniki.' : 'To NWD — dla NWW bierzemy największe wykładniki.'], ...(nums.length === 2 && which === 'lcm' ? [[String(nums[0] * nums[1]), 'Iloczyn to NWW tylko dla liczb względnie pierwszych.']] : []), [String(v * ps[0]), T`Za duży wykładnik przy $${ps[0]}$.`]] });
  }

  /* ===== 4(b). przykładowe rozwiązanie a₁x₁+…=NWD (albo inna prawa strona) ===== */
  function bezoutRHS(nums, rhs) {
    const vars = ['x', 'y', 'z', 't'].slice(0, nums.length), g = nums.reduce((a, b) => gcd(a, b));
    const { sol: co, steps: bst } = E3.bezSteps(nums);
    const m = rhs / g, sol = co.map(c => c * m);
    const solT = xs => vars.map((v, i) => v + '=' + xs[i]).join(',\\ ');
    const valS = xs => nums.reduce((s, a, i) => s + a * xs[i], 0);
    const wrong = [[sol.map((x, i) => (i === 0 ? -x : x)), 'Zły znak przy $x$.'], [sol.map(x => -x), 'Wszystkie znaki odwrócone — wtedy suma to $-' + rhs + '$.'], [sol.map((x, i) => (i === 0 ? x + 1 : x)), 'Błąd przy cofaniu się w algorytmie.'], [sol.map((x, i) => (i === 1 ? x + 1 : x)), 'Błąd przy podstawianiu.'], [co, m !== 1 ? T`To kombinacja dająca $${g}$ — trzeba jeszcze pomnożyć przez $${m}$.` : 'Sprawdź podstawiając.'], [sol.slice().reverse(), 'Zamienione wartości.']].filter(([xs]) => valS(xs) !== rhs).map(([xs, w]) => [solT(xs), w]);
    return mk({ gk: 'bezR', field: txtField(), q: T`Podaj przykładowe rozwiązanie całkowite równania $${E3.linV(nums, vars)}=${rhs}$.`, tex: solT(sol),
      steps: [T`Najpierw zapisujemy NWD $(${nums.join(',')})=${g}$ jako kombinację liczb (rozszerzony algorytm Euklidesa)${rhs !== g ? T`; potem pomnożymy ją przez $${m}$, bo $${rhs}=${g}\cdot ${m}$` : ''}.`, ...bst,
        ...(m !== 1 ? [T`Mnożymy wszystkie współczynniki przez $${m}$: $${solT(sol)}$, bo $${g}\cdot ${m}=${rhs}$.`] : []), T`Rozwiązanie: $${solT(sol)}$.`],
      wrong });
  }

  // 4.5 i podobne: a, b, c podane jako iloczyny potęg (także liczb złożonych, np. 6)
  function abcItem(which, parts) {
    const fs = parts.map(ps => { let f = {}; for (const [b, e] of ps) f = mul(f, factor(b), e); return f; });
    const vals = fs.map(val), exT = ps => ps.map(([b, e]) => powT(b, e)).join('\\cdot ');
    const it = gcdLcmItem(vals, which, which === 'gcd' ? 'NWD' : 'NWW');
    const def = ['a', 'b', 'c'].map((n, i) => n + '=' + exT(parts[i])).join(',\\ ');
    it.q = T`Niech $${def}$. Oblicz $${which === 'gcd' ? '(a,b,c)' : '[a,b,c]'}$.`;
    it.steps = [T`Postacie kanoniczne (liczby złożone rozkładamy do końca): ` + ['a', 'b', 'c'].map((n, i) => T`$${n}=${canonT(fs[i])}=${big(vals[i])}$`).join(', ') + '.'].concat(it.steps.slice(1));
    it.sol = it.steps;
    return it;
  }
  function genABC(which) { for (;;) { const mk3 = () => { return R.shuffle([2, 3, 5, 6, 10, 15]).slice(0, R.int(2, 4)).map(b => [b, R.int(1, 3)]); }; const parts = [mk3(), mk3(), mk3()]; const it = abcItem(which, parts); if (+it.fields[0].ans > 1 && +it.fields[0].ans < 1e7 && it.mc.length >= 3) return it; } }

  /* ===== 6, 7. liczba dzielników ===== */
  function tauItem(parts, label) { // parts: [[b,e], ...]
    let f = {}; for (const [b, e] of parts) f = mul(f, factor(b), e);
    const exprT = parts.map(([b, e]) => powT(b, e)).join('\\cdot '), t = tau(f), ps = primesOf(f);
    const naive = parts.reduce((s, [b, e]) => s * (e + 1), 1);
    return mk({ label, gk: 'tau', ans: t, tex: String(t), flabel: 'τ', q: T`Ile dzielników naturalnych ma liczba $${exprT}$?`,
      steps: [T`Postać kanoniczna: ` + (parts.length > 1 || parts[0][1] > 1 ? parts.map(([b, e]) => T`$${powT(b, e)}=${canonT(mul({}, factor(b), e))}$`).join(', ') + ', więc ' : '') + T`$${exprT}=${canonT(f)}$.`, T`Dzielnik wybieramy, ustalając wykładnik każdej liczby pierwszej: przy $p^{\alpha}$ mamy $\alpha+1$ możliwości ($0,1,\ldots,\alpha$). Zatem $\tau=${ps.map(p => '(' + f[p] + '+1)').join('')}=${t}$.`],
      wrong: [[String(naive === t ? t + 2 : naive), 'Najpierw postać kanoniczna — czynniki $' + parts.map(([b]) => b).join(',') + '$ nie muszą być pierwsze ani różne.'], [String(ps.reduce((s, p) => s * f[p], 1)), 'Iloczyn samych wykładników nie liczy dzielników — potrzebne $(\\alpha_i+1)$.'], [String(t - 1), 'Dzielniki $1$ i $n$ też się liczą.']] });
  }
  const genTau = () => { const k = R.int(1, 3), parts = []; for (let i = 0; i < k; i++) parts.push([R.pick([2, 3, 6, 10, 12, 14, 15, 26, 34, 52]), R.int(1, 5)]); return tauItem(parts, ''); };

  /* ===== 8–10. postać liczby o k dzielnikach ===== */
  function multParts(k, maxF = k) { if (k === 1) return [[]]; const r = []; for (let f = Math.min(k, maxF); f >= 2; f--) if (k % f === 0) for (const rest of multParts(k / f, f)) r.push([f, ...rest]); return r; }
  const LET = ['p', 'q', 'r', 's', 'u'];
  const formT = exps => exps.map((e, i) => (e === 1 ? LET[i] : LET[i] + '^{' + e + '}')).join('');
  function formsItem(k) {
    const forms = multParts(k).map(fs => fs.map(f => f - 1));
    const tex = forms.map(formT).join(',\\quad ') + T`\ (p,q,r,\ldots\text{ różne pierwsze})`;
    const near = multParts(k + 2).map(fs => fs.map(f => f - 1));
    return mk({ gk: 'forms', field: txtField(), q: T`Jaką postać kanoniczną może mieć liczba naturalna o dokładnie $${k}$ dzielnikach?`, tex,
      steps: [T`$\tau(p_1^{\alpha_1}\cdots p_m^{\alpha_m})=(\alpha_1+1)\cdots(\alpha_m+1)=${k}$. Każdy wykładnik $\alpha_i\geq1$, więc każdy czynnik $\alpha_i+1$ jest $\geq2$ — szukamy więc wszystkich rozkładów $${k}$ na czynniki $\geq2$ (kolejność nie gra roli).`, T`Rozkłady $${k}$ na czynniki $\geq2$: ` + multParts(k).map(fs => fs.join('\\cdot ')).map(x => '$' + x + '$').join(', ') + '.', T`Wykładniki to czynniki minus 1: $${forms.map(formT).join(',\\quad ')}$.`],
      wrong: [[forms.slice(0, -1).map(formT).join(',\\quad ') + T`\ (p,q,r,\ldots\text{ różne pierwsze})`, 'Brakuje jednego rozkładu ' + k + ' na czynniki.'], [multParts(k).map(fs => fs).map(formT).join(',\\quad ') + T`\ (p,q,r,\ldots\text{ różne pierwsze})`, 'Wykładnik to czynnik minus 1: $\\tau(p^a)=a+1$.'], [near.map(formT).join(',\\quad ') + T`\ (p,q,r,\ldots\text{ różne pierwsze})`, T`Te postacie mają $${k + 2}$ dzielników.`]] });
  }
  const PR = [2, 3, 5, 7, 11, 13];
  function minK(k) {
    const cands = multParts(k).map(fs => { const es = fs.map(f => f - 1); return [es, es.reduce((s, e, i) => s * PR[i] ** e, 1)]; }).sort((a, b) => a[1] - b[1]);
    const best = cands[0][1];
    return mk({ gk: 'mink', ans: best, tex: String(best), flabel: 'n', q: T`Znajdź najmniejszą liczbę naturalną, która ma dokładnie $${k}$ dzielników naturalnych.`,
      steps: [T`$\tau(n)=(\alpha_1+1)(\alpha_2+1)\cdots=${k}$. Rozkłady $${k}$ na czynniki $\geq2$: ` + multParts(k).map(fs => '$' + fs.join('\\cdot ') + '$').join(', ') + '.',
        T`Każdy rozkład daje wykładniki (czynnik minus 1). Żeby liczba była najmniejsza, największy wykładnik dajemy liczbie $2$, następny $3$, potem $5$ itd. (zamiana np. $2^1\cdot3^5$ na $2^5\cdot3^1$ zawsze zmniejsza liczbę).`,
        'Kandydaci: ' + multParts(k).map(fs => { const es = fs.map(f => f - 1), v = es.reduce((s2, e, i) => s2 * PR[i] ** e, 1); return T`$${fs.join('\\cdot ')}\Rightarrow ${es.map((e, i) => powT(PR[i], e)).join('\\cdot ')}=${big(v)}$`; }).join(', ') + '.', T`Porównujemy kandydatów — najmniejsza: $${big(best)}$.`],
      wrong: [[String(cands[1] ? cands[1][1] : best * 2), 'To też ma ' + k + ' dzielników, ale nie jest najmniejsza.'], [String(cands[0][0].reduce((s, e, i) => s * PR[cands[0][0].length - 1 - i] ** e, 1)), 'Większe wykładniki dawaj mniejszym liczbom pierwszym.'], [String(2 ** (k - 1)), T`$2^{${k - 1}}$ ma ${k} dzielników, ale jest dużo większa.`].filter(([x]) => +x !== best)] });
  }

  /* ===== opracowanie ===== */
  const F = {
    vp: W(T`<b>Wykładnik $p$-adyczny $v_p(x)$</b> — ile razy liczba pierwsza $p$ „siedzi” w $x$. Np. $v_2(24)=3$, bo $24=2^3\cdot3$.`,
      T`Rozłóż liczbę na czynniki pierwsze. Wykładnik przy $p$ to właśnie $v_p$; jeśli $p$ w rozkładzie nie występuje, to $v_p=0$.`,
      T`Przykład: $360=2^3\cdot3^2\cdot5$, więc $v_2(360)=3$, $v_3(360)=2$, $v_5(360)=1$, a $v_7(360)=0$ (i tak samo dla każdej innej liczby pierwszej).`,
      T`Ułamek: wykładniki z licznika liczymy z plusem, z mianownika z minusem: $v_p\left(\frac ab\right)=v_p(a)-v_p(b)$. Np. $\frac{12}{25}=2^2\cdot3\cdot5^{-2}$, więc $v_2=2$, $v_3=1$, $v_5=-2$.`,
      T`Najpierw skróć ułamek albo po prostu odejmij wykładniki: $\frac{21}{49}=\frac{3\cdot7}{7^2}$ daje $v_7=1-2=-1$, $v_3=1$.`,
      T`Znak minus nic nie zmienia: $v_p(-x)=v_p(x)$, np. $-14=-(2\cdot7)$ ma $v_2=v_7=1$.`,
      T`Przydatne: $v_p(xy)=v_p(x)+v_p(y)$ — dlatego przy mnożeniu potęg wykładniki się dodają.`),
    kanon: W(T`<b>Postać kanoniczna</b> — rozkład na potęgi różnych liczb pierwszych, od najmniejszej: $n=p_1^{\alpha_1}p_2^{\alpha_2}\cdots p_m^{\alpha_m}$.`,
      T`Dziel przez kolejne liczby pierwsze $2,3,5,7,\ldots$ tak długo, jak się da: $360=2\cdot180=2^2\cdot90=2^3\cdot45=2^3\cdot3^2\cdot5$.`,
      T`Każda liczba $\geq2$ ma dokładnie jeden taki rozkład (podstawowe twierdzenie arytmetyki) — dlatego można porównywać wykładniki.`,
      T`Gdy liczba jest podana jako iloczyn potęg liczb złożonych, rozłóż każdą podstawę i <b>pomnóż</b> wykładniki: $12^2=(2^2\cdot3)^2=2^4\cdot3^2$.`,
      T`Potem <b>dodaj</b> wykładniki tej samej liczby pierwszej: $2^4\cdot3^2\cdot2^3\cdot3=2^7\cdot3^3$.`),
    tau: W(T`<b>Liczba dzielników</b>: $\tau(p_1^{\alpha_1}\cdots p_m^{\alpha_m})=(\alpha_1+1)\cdots(\alpha_m+1)$.`,
      T`Każdy dzielnik $n$ ma postać $p_1^{\beta_1}\cdots p_m^{\beta_m}$ z $0\leq\beta_i\leq\alpha_i$ — i każdy taki wybór daje inny dzielnik.`,
      T`Dla $p_i$ wykładnik $\beta_i$ można wybrać na $\alpha_i+1$ sposobów ($0,1,\ldots,\alpha_i$), więc wszystkich wyborów jest $(\alpha_1+1)\cdots(\alpha_m+1)$.`,
      T`Przykład: $12=2^2\cdot3$, $\tau=(2+1)(1+1)=6$: dzielniki $1,2,4,3,6,12$.`,
      T`Uwaga: najpierw postać kanoniczna! $6^2=2^2\cdot3^2$ ma $9$ dzielników, a nie $2+1=3$.`),
    sigma: W(T`<b>Suma dzielników</b>: $\sigma(n)=\prod_i(1+p_i+p_i^2+\ldots+p_i^{\alpha_i})=\prod_i\frac{p_i^{\alpha_i+1}-1}{p_i-1}$.`,
      T`Wymnóż nawiasy $(1+2+2^2)(1+3)$ — każdy składnik wyniku to iloczyn jednej potęgi $2$ i jednej potęgi $3$, czyli dokładnie jeden dzielnik $12$.`,
      T`Więc iloczyn nawiasów to suma wszystkich dzielników: $\sigma(12)=(1+2+4)(1+3)=28=1+2+3+4+6+12$.`,
      T`Każdy nawias to suma ciągu geometrycznego: $1+p+\ldots+p^\alpha=\frac{p^{\alpha+1}-1}{p-1}$.`),
    nwdp: W(T`<b>NWD i NWW z wykładników</b>: $v_p((a,b))=\min\{v_p(a),v_p(b)\}$, $v_p([a,b])=\max\{v_p(a),v_p(b)\}$.`,
      T`Dzielnik obu liczb może mieć przy $p$ wykładnik co najwyżej taki, jak mniejszy z dwóch — stąd minimum dla NWD.`,
      T`Wielokrotność obu musi mieć przy $p$ wykładnik co najmniej taki, jak większy z dwóch — stąd maksimum dla NWW.`,
      T`Przykład: $252=2^2\cdot3^2\cdot7$, $198=2\cdot3^2\cdot11$. NWD: $2^1\cdot3^2=18$ (7 i 11 mają min $=0$). NWW: $2^2\cdot3^2\cdot7\cdot11=2772$.`,
      T`Sprawdzenie: $(a,b)\cdot[a,b]=ab$, bo $\min+\max$ to suma obu wykładników: $18\cdot2772=252\cdot198$.`),
    mink: W(T`<b>Najmniejsza liczba o $k$ dzielnikach</b>: rozłóż $k$ na czynniki, każdy czynnik to $\alpha+1$.`,
      T`Skoro $\tau=(\alpha_1+1)(\alpha_2+1)\cdots$, to każdy rozkład $k$ na czynniki $\geq2$ daje możliwy zestaw wykładników (czynnik minus 1).`,
      T`Żeby liczba była jak najmniejsza, największy wykładnik dajemy najmniejszej liczbie pierwszej: $2^{\text{największy}}\cdot3^{\ldots}\cdot5^{\ldots}$.`,
      T`Przykład $k=12$: $12\to2^{11}$; $6\cdot2\to2^5\cdot3=96$; $4\cdot3\to2^3\cdot3^2=72$; $3\cdot2\cdot2\to2^2\cdot3\cdot5=60$. Najmniejsza: $60$.`,
      T`Trzeba porównać wszystkich kandydatów — więcej czynników pierwszych nie zawsze wygrywa.`),
    bez: W(T`<b>Kombinacja dla kilku liczb</b>: $(a,b,c)=((a,b),c)$ — liczymy NWD po kolei i za każdym razem zapisujemy je jako kombinację.`,
      T`Rozszerzony Euklides daje $(a,b)=ax+by$.`,
      T`Potem $((a,b),c)=(a,b)\cdot u+c\cdot v$ — znów Euklides, tym razem dla liczb $(a,b)$ i $c$.`,
      T`Podstawiamy: $(a,b,c)=(ax+by)u+cv=a(xu)+b(yu)+cv$. Szukane współczynniki to $xu,\ yu,\ v$.`,
      T`Jeśli prawa strona to wielokrotność NWD, np. $17=17\cdot1$, mnożymy wszystkie współczynniki przez tę krotność.`),
  };
  const N4b = [[[252, 198], 18], [[221, 754], 13], [[45, 168, 396], 3], [[420, 1115, 630], 5], [[663, 731, 2516, 630], 17]];
  A.addList({
    num: 24, id: 'e4', subject: 'etl', title: 'Lista 4', name: 'Postać kanoniczna', hue: 'e4',
    blurb: 'Rozkład na czynniki pierwsze, wykładniki p-adyczne, NWD i NWW z wykładników, liczba i suma dzielników.',
    tasks: [
      { id: 'E4.1', name: 'Wykładniki $p$-adyczne', statement: T`Wyznaczyć wszystkie wykładniki liczb pierwszych następujących liczb: $3$, $21$, $105$, $-14$, $\frac23$, $\frac{14}{15}$, $\frac{121}{35}$, $-\frac{120}{49}$, $\frac{21}{49}$.`, wzIds: ['vp', 'kanon'], gen: genVp,
        items: [[3, 1], [21, 1], [105, 1], [-14, 1], [2, 3], [14, 15], [121, 35], [-120, 49], [21, 49]].map(([a, b], i) => P('(' + 'abcdefghi'[i] + ')', vpItem(a, b))) },
      { id: 'E4.2', name: 'Postać kanoniczna, $\\tau$ i $\\sigma$', statement: T`Przedstawić liczby $24$, $81$, $120$, $180$, $225$ w postaci kanonicznej. Dla każdej z nich podać ilość oraz sumę jej wszystkich dzielników naturalnych.`, wzIds: ['kanon', 'tau', 'sigma'], gen: genCanon,
        items: [24, 81, 120, 180, 225].map(n => P('(' + n + ')', canonItem(n))) },
      { id: 'E4.3', name: '$24^2\\cdot3^4\\cdot2^3\\cdot12$', statement: T`Zapisać w postaci kanonicznej liczbę $24^2\cdot3^4\cdot2^3\cdot12$.`, wzIds: ['kanon'], gen: genProd, items: [P('4.3', prodCanon([[24, 2], [3, 4], [2, 3], [12, 1]]))] },
      { id: 'E4.4', name: 'NWD, NWW i kombinacje', statement: T`(a) Znajdź przy pomocy wykładnika $p$-adycznego wartości $(252,198)$, $[252,198]$, $(221,754)$, $[221,754]$, $(45,168,396)$, $[45,168,396]$, $(420,1115,630)$, $[420,1115,630]$, $(663,731,2516,3655)$, $[663,731,2516,3655]$. (b) Podaj przykładowe rozwiązania całkowite równań: $252x+198y=(252,198)$, $221x+754y=(221,754)$, $45x+168y+396z=(45,168,396)$, $420x+1115y+630z=(420,1115,630)$, $663x+731y+2516z+630t=(663,731,2516,3655)$.`, wzIds: ['nwdp', 'kanon', 'bez'],
        gen: gk => { if (gk === 'bezR') { const k = R.int(2, 3); for (;;) { const g = R.pick([1, 2, 3, 6, 13, 17]); const ns = [...Array(k)].map(() => g * R.int(3, 60)); const gg = ns.reduce((a, b) => gcd(a, b)); if (gg === g) return bezoutRHS(ns, g); } } for (;;) { const k = R.int(2, 3), g = R.pick([2, 3, 6, 12, 15, 18]); const ns = [...Array(k)].map(() => g * R.int(2, 40)); if (new Set(ns).size === k) return gcdLcmItem(ns, gk === 'lcm' ? 'lcm' : 'gcd', ''); } },
        items: [[252, 198], [221, 754], [45, 168, 396], [420, 1115, 630], [663, 731, 2516, 3655]].flatMap((ns, i) => [gcdLcmItem(ns, 'gcd', '(a) ' + (i + 1) + ' NWD'), gcdLcmItem(ns, 'lcm', '(a) ' + (i + 1) + ' NWW')])
          .concat(N4b.map(([ns, r], i) => P('(b) ' + (i + 1), bezoutRHS(ns, r)))) },
      { id: 'E4.5', name: 'NWD i NWW trzech liczb', statement: T`Niech $a=2^2\cdot3^2\cdot5\cdot6$, $b=2\cdot3^2\cdot6^2$, $c=2\cdot3^3\cdot5^2$. Znaleźć największy wspólny dzielnik i najmniejszą wspólną wielokrotność liczb $a,b,c$.`, wzIds: ['nwdp', 'kanon'], gen: gk => genABC(gk === 'lcm' ? 'lcm' : 'gcd'),
        items: [gcdLcmItem([1080, 648, 1350], 'gcd', 'NWD'), gcdLcmItem([1080, 648, 1350], 'lcm', 'NWW')].map(it => Object.assign(it, { q: it.q.replace(/\$[\(\[]1080,648,1350[\)\]]\$/, m => (m[1] === '(' ? '$(a,b,c)$' : '$[a,b,c]$') + T` dla $a=2^2\cdot3^2\cdot5\cdot6$, $b=2\cdot3^2\cdot6^2$, $c=2\cdot3^3\cdot5^2$`).replace('Przy pomocy wykładników $p$-adycznych oblicz', 'Oblicz'), steps: [T`Postacie kanoniczne: $a=2^3\cdot3^3\cdot5=1080$, $b=2^3\cdot3^4=648$, $c=2\cdot3^3\cdot5^2=1350$ (pamiętaj: $6=2\cdot3$).`].concat(it.steps.slice(1)) })) },
      { id: 'E4.6', name: 'Liczba dzielników', statement: T`Ile dzielników naturalnych mają liczby: (a) $28$, (b) $34\cdot52$, (c) $152$, (d) $32\cdot104$?`, wzIds: ['tau', 'kanon'], gen: genTau,
        items: [tauItem([[28, 1]], '(a)'), tauItem([[34, 1], [52, 1]], '(b)'), tauItem([[152, 1]], '(c)'), tauItem([[32, 1], [104, 1]], '(d)')] },
      { id: 'E4.7', name: '$\\tau(2^3\\cdot3^2\\cdot5^5\\cdot6^6)$', statement: T`Ile dzielników naturalnych ma liczba $2^3\cdot3^2\cdot5^5\cdot6^6$?`, wzIds: ['tau', 'kanon'], gen: genTau, items: [tauItem([[2, 3], [3, 2], [5, 5], [6, 6]], '4.7')] },
      { id: 'E4.8', name: 'Dokładnie 12 dzielników', statement: T`Jaką postać kanoniczną może mieć liczba naturalna o dokładnie $12$ dzielnikach?`, wzIds: ['tau'], gen: () => formsItem(R.pick([6, 8, 10, 12, 16, 18, 20])), items: [P('4.8', formsItem(12))] },
      { id: 'E4.9', name: 'Najmniejsza z 28 dzielnikami', statement: T`Znajdź najmniejszą liczbę naturalną, która ma dokładnie $28$ dzielników naturalnych.`, wzIds: ['mink', 'tau'], gen: () => minK(R.pick([6, 8, 10, 12, 14, 15, 16, 20, 24, 30])), items: [P('4.9', minK(28))] },
      { id: 'E4.10', name: 'Najmniejsza z 18 dzielnikami', statement: T`Znajdź najmniejszą liczbę naturalną, która ma dokładnie $18$ dzielników.`, wzIds: ['mink', 'tau'], gen: () => minK(R.pick([6, 8, 10, 12, 14, 15, 16, 20, 24, 30])), items: [P('4.10', minK(18))] },
    ],
  });
  for (const t of A.lists.find(l => l.id === 'e4').tasks) t.wzLib = F;
  A.ETL4 = { factor, tau, sigma, vpItem, genVp, canonItem, genCanon, prodCanon, genProd, gcdLcmItem, bezoutRHS, tauItem, genTau, formsItem, minK, multParts };
  void S; void M; void proof;
})();
