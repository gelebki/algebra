/* Matura — generatory „podobnych przykładów” do zadań zamkniętych CKE.
   Każde zadanie ma przypisany wzorzec (wspólny dla zadań tego samego typu). Generator losuje nowe liczby,
   sam liczy poprawną odpowiedź, a dystraktory A–D buduje z typowych błędów, które łapie CKE (każdy z opisem).
   Wzorzec ma też listę wycinków z tablic CKE (wz), które są potrzebne do rozwiązania. */
(function () {
  'use strict';
  const A = AQ, R = A.R, T = String.raw;
  const G = {}, MAP = {};
  const reg = (name, ids, wz, gen) => { G[name] = { wz, gen }; ids.forEach(i => { MAP[i] = name; }); };

  /* ---------- liczby wymierne i formatowanie ---------- */
  const gcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a || 1; };
  const Q = (n, d = 1) => { if (d < 0) { n = -n; d = -d; } const g = gcd(n, d); return { n: n / g, d: d / g }; };
  const qadd = (x, y) => Q(x.n * y.d + y.n * x.d, x.d * y.d), qsub = (x, y) => Q(x.n * y.d - y.n * x.d, x.d * y.d);
  const qmul = (x, y) => Q(x.n * y.n, x.d * y.d), qdiv = (x, y) => Q(x.n * y.d, x.d * y.n);
  const qeq = (x, y) => x.n === y.n && x.d === y.d;
  const qt = x => (x.d === 1 ? String(x.n) : (x.n < 0 ? '-' : '') + T`\frac{${Math.abs(x.n)}}{${x.d}}`);
  const opt = t => (/^-/.test(t) ? '\\left(' + t + '\\right)' : t); // liczby ujemne w odpowiedziach — w nawiasie, jak w arkuszach
  const qo = x => opt(qt(x)), no = n => opt(String(n));
  const dec = x => String(x).replace('.', '{,}');
  const big = n => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '\\,');
  const pw = (b, e) => (e === 1 ? String(b) : T`${b}^{${e}}`);
  const sgn = n => (n < 0 ? '-' + Math.abs(n) : '+' + n);
  const norm = t => String(t).replace(/\\left|\\right|\s|\\,|\{|\}/g, '');
  /** cztery opcje: poprawna + 3 różne dystraktory [tex, opis błędu] */
  function opts(correct, wrongs) {
    const seen = new Set([norm(correct)]), w = [];
    for (const [t, why] of wrongs) { if (t == null) continue; const k = norm(t); if (seen.has(k)) continue; seen.add(k); w.push({ t, why }); if (w.length === 3) break; }
    if (w.length < 3) return null;
    return R.shuffle([{ t: correct, ok: true }].concat(w));
  }
  const M = (s) => '$' + s + '$';
  /* oś liczbowa (SVG) — przedziały do zaznaczenia; segs: [[od, do, domkniętyOd, domkniętyDo]], ±Infinity dla półprostej */
  function axis(segs, marks) {
    const W = 300, H = 46, xs = marks.slice().sort((a, b) => a - b), lo = xs[0], hi = xs[xs.length - 1], span = Math.max(1, hi - lo);
    const X = v => (v === -Infinity ? 8 : v === Infinity ? W - 14 : 40 + (v - lo) / span * (W - 80));
    let s = `<svg class="maxis" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img"><line x1="4" y1="24" x2="${W - 8}" y2="24" stroke="currentColor" stroke-width="1.3"/><path d="M${W - 8} 24l-7-4v8z" fill="currentColor"/><text x="${W - 10}" y="42" font-size="12" font-style="italic" fill="currentColor">x</text>`;
    for (const [a, b] of segs) s += `<line x1="${X(a)}" y1="24" x2="${X(b)}" y2="24" stroke="#7b3fbf" stroke-width="4"/>`;
    for (const v of xs) { s += `<line x1="${X(v)}" y1="20" x2="${X(v)}" y2="28" stroke="currentColor"/><text x="${X(v)}" y="42" font-size="12" text-anchor="middle" fill="currentColor">${v < 0 ? '−' + -v : v}</text>`; }
    for (const [a, b, ca, cb] of segs) for (const [v, c] of [[a, ca], [b, cb]]) if (isFinite(v)) s += `<circle cx="${X(v)}" cy="24" r="4.2" fill="${c ? '#7b3fbf' : '#fff'}" stroke="#7b3fbf" stroke-width="1.8"/>`;
    return s + '</svg>';
  }

  /* =================== DZIAŁ I: liczby rzeczywiste =================== */
  // a^{-1} · (m^q)^{p/q}  (2406-1)
  reg('potUlamk', ['2406-1'], ['f02-3', 'f02-4'], () => {
    const k = R.pick([2, 3, 4]), m = R.pick([2, 3]), q = R.pick([3, 5]), p = R.pick([2, 3]), b = m ** q, v = Q(m ** p, k);
    return { q: T`Liczba $${k}^{-1}\cdot ${b}^{\frac{${p}}{${q}}}$ jest równa`, opts: opts(qo(v), [[qo(Q(-k * m ** p)), 'Ujemny wykładnik nie zmienia znaku liczby — oznacza odwrotność: $' + k + '^{-1}=\\frac1{' + k + '}$.'], [qo(Q(-v.n, v.d)), 'Liczba z ujemnym wykładnikiem nie jest ujemna.'], [qo(Q(m ** (p - 1), k)), T`$${b}^{\frac{${p}}{${q}}}=\left(\sqrt[${q}]{${b}}\right)^{${p}}=${m}^{${p}}$ — sprawdź wykładnik.`], [qo(Q(m ** (p + 1), k)), 'Licznik ułamka w wykładniku to potęga, mianownik — stopień pierwiastka.']]),
      steps: [T`$${b}^{\frac{${p}}{${q}}}=\left(\sqrt[${q}]{${b}}\right)^{${p}}=${m}^{${p}}=${m ** p}$`, T`$${k}^{-1}=\frac{1}{${k}}$, więc wynik to $\frac{${m ** p}}{${k}}${v.d === k && v.n === m ** p ? '' : '=' + qt(v)}$.`] };
  });
  // (a²/b²)^{-1/2} (2408-2)
  reg('potDzies', ['2408-2'], ['f02-3', 'f02-4'], () => {
    const [a, b] = R.pick([[2, 5], [4, 5], [1, 4], [3, 10], [1, 5], [1, 10], [3, 5], [1, 2], [3, 4], [5, 4], [5, 2], [4, 10], [7, 10], [9, 10], [1, 20]]), v = b / a;
    if (!Number.isInteger(v * 100)) return null;
    const fr = T`\left(\frac{${a * a}}{${b * b}}\right)^{-0{,}5}`;
    return { q: T`Liczba $${fr}$ jest równa`, opts: opts(dec(v), [[dec(a / b), 'Wykładnik $-0{,}5$ oznacza pierwiastek <b>i</b> odwrotność — tu zabrakło odwrócenia ułamka.'], [dec(+(b * b / (a * a)).toFixed(4)), 'Pominięty pierwiastek: $0{,}5$ w wykładniku to $\\sqrt{\\ }$.'], [dec(+(a * a / (b * b)).toFixed(4)), 'Ujemny wykładnik odwraca ułamek, a $0{,}5$ to pierwiastek — tu nie zrobiono żadnego z tych kroków.'], [dec(+(2 * a / b).toFixed(4)), 'Wykładnik $-0{,}5$ to nie mnożenie przez $-0{,}5$ ani przez 2.']]),
      steps: [T`$x^{-0{,}5}=\frac{1}{\sqrt{x}}$, więc $${fr}=\sqrt{\frac{${b * b}}{${a * a}}}=\frac{${b}}{${a}}=${dec(v)}$.`] };
  });
  // (3^{-1}·4^{0,5})/(3^{-2}·2^{-1}) (2608-2)
  reg('potIloraz', ['2608-2'], ['f02-3', 'f02-4'], () => {
    const a = R.pick([2, 3, 5]), s = R.pick([4, 9, 16, 25].filter(x => x !== a * a)), r = Math.sqrt(s), c = R.pick([2, 3].filter(x => x !== a));
    const v = Q(r * a * a * c, a); // a^{-1}·r / (a^{-2}·c^{-1}) = r·a·c
    return { q: T`Liczba $\dfrac{${a}^{-1}\cdot ${s}^{0{,}5}}{${a}^{-2}\cdot ${c}^{-1}}$ jest równa`, opts: opts(qo(v), [[qo(Q(1, v.n)), 'Odwrotność wyniku — ujemne wykładniki w mianowniku „przechodzą” do licznika z plusem.'], [qo(Q(r * a, c)), T`Czynnik $${c}^{-1}$ w mianowniku daje mnożenie przez $${c}$, a nie dzielenie.`], [qo(Q(1, r * a)), 'Pomylone potęgi z ujemnym wykładnikiem.'], [qo(Q(s * a * c)), T`$${s}^{0{,}5}=\sqrt{${s}}=${r}$, a nie $${s}$.`]]),
      steps: [T`$${s}^{0{,}5}=${r}$, $${a}^{-1}=\frac1{${a}}$, a $\frac{1}{${a}^{-2}\cdot ${c}^{-1}}=${a}^{2}\cdot ${c}$.`, T`Wynik: $\frac{${r}}{${a}}\cdot ${a * a}\cdot ${c}=${qt(v)}$.`] };
  });
  // sqrt(a/b)·sqrt(c) + 2^{-1} (2605-1)
  reg('pierwIloczyn', ['2605-1'], ['f02-2', 'f02-4'], () => {
    const [n, d, c] = R.pick([[25, 8, 2], [9, 8, 2], [49, 8, 2], [25, 12, 3], [81, 8, 2], [9, 50, 2], [49, 18, 2], [25, 2, 8], [9, 2, 2], [49, 3, 12], [1, 8, 2], [9, 27, 3], [16, 5, 5], [25, 27, 3], [81, 2, 8]]), rt = Q(Math.round(Math.sqrt(n * c)), Math.round(Math.sqrt(d / c * d * c / d * d))); // √(n/d·c)
    const inner = Q(n * c, d); const sq = Math.sqrt(inner.n), sd = Math.sqrt(inner.d); if (!Number.isInteger(sq) || !Number.isInteger(sd)) return null;
    const v = qadd(Q(sq, sd), Q(1, 2)); void rt;
    return { q: T`Liczba $\sqrt{\frac{${n}}{${d}}}\cdot\sqrt{${c}}+2^{-1}$ jest równa`, opts: opts(qo(v), [[qo(qsub(Q(sq, sd), Q(1, 2))), '$2^{-1}=\\frac12$, a nie $-\\frac12$.'], [qo(qadd(Q(sq, sd), Q(-2))), '$2^{-1}$ to odwrotność 2, a nie $-2$.'], [qo(Q(sq, sd)), 'Pominięty składnik $2^{-1}$.'], [qo(qadd(Q(sq * sq, sd * sd), Q(1, 2))), 'Zapomniany pierwiastek z iloczynu.']]),
      steps: [T`$\sqrt{\frac{${n}}{${d}}}\cdot\sqrt{${c}}=\sqrt{\frac{${n * c}}{${d}}}=\sqrt{${qt(inner)}}=${qt(Q(sq, sd))}$, a $2^{-1}=\frac12$.`, T`Razem: $${qt(Q(sq, sd))}+\frac12=${qt(v)}$.`] };
  });
  // a√(k²s) − b√(m²s)  (2308-2)
  reg('pierwRoznica', ['2308-2'], ['f02-2', 'f02-4'], () => {
    const s = R.pick([2, 3, 5, 6, 7]), k = R.int(2, 4), m = R.int(1, 3), a = R.int(2, 4), b = R.int(1, 2), c = a * k - b * m; if (c <= 1 || k === m) return null;
    return { q: T`Liczba $${a}\sqrt{${k * k * s}}-${b === 1 ? '' : b}\sqrt{${m * m * s}}$ jest równa`, opts: opts(T`${c}\cdot ${s}^{\frac12}`, [[T`(${c}\cdot ${s})^{\frac12}`, T`$${c}\sqrt{${s}}=${c}\cdot ${s}^{\frac12}$, a nie $\sqrt{${c}\cdot ${s}}$ — pierwiastek dotyczy tylko $${s}$.`], [T`${s}^{\frac12}`, 'Zgubiony współczynnik przed pierwiastkiem.'], [T`${c}^{\frac12}`, T`Pierwiastek jest z $${s}$, a współczynnik $${c}$ stoi przed nim.`], [T`${a - b}\cdot ${s}^{\frac12}`, 'Przed odjęciem trzeba wyłączyć czynniki spod pierwiastków.']]),
      steps: [T`$\sqrt{${k * k * s}}=\sqrt{${k * k}\cdot ${s}}=${k}\sqrt{${s}}$${m === 1 ? '' : T`, $\sqrt{${m * m * s}}=${m}\sqrt{${s}}$`}.`, T`$${a}\cdot ${k}\sqrt{${s}}-${b * m}\sqrt{${s}}=${c}\sqrt{${s}}=${c}\cdot ${s}^{\frac12}$.`] };
  });
  // (a√p ± b√q)²  (2406-3, 2505-1)
  reg('pierwKwadrat', ['2406-3', '2505-1'], ['f06-0', 'f02-2'], () => {
    const minus = R.int(0, 1) === 1;
    // (√X ± √Y)² = X + Y ± 2√(XY); XY ma być kwadratem albo dawać ładny pierwiastek
    const [X, Y] = R.pick(minus ? [[32, 2], [18, 2], [50, 2], [27, 3], [48, 3], [45, 5], [8, 2], [75, 3]] : [[40, 2], [12, 3], [20, 5], [28, 7], [24, 6], [18, 8], [10, 2]]);
    const P = X * Y, r = Math.sqrt(P), sq = Number.isInteger(r);
    let mid, midT; if (sq) { mid = 2 * r; midT = String(mid); } else { let f = 1, rest = P; for (let i = 2; i * i <= rest; i++) while (rest % (i * i) === 0) { rest /= i * i; f *= i; } mid = 2 * f; midT = T`${mid}\sqrt{${rest}}`; var restV = rest; }
    const show = x => { const f = [2, 3, 5].find(t => x % (t * t) === 0 && x / (t * t) > 1 && x / (t * t) < 12); return f && x > 20 && R.int(0, 1) ? T`${f}\sqrt{${x / (f * f)}}` : T`\sqrt{${x}}`; };
    const sx = show(X), sy = T`\sqrt{${Y}}`, S = X + Y;
    const correct = sq ? String(minus ? S - mid : S + mid) : T`${S}${minus ? '-' : '+'}${midT}`;
    const half = sq ? String(minus ? S - mid / 2 : S + mid / 2) : T`${S}${minus ? '-' : '+'}${mid / 2}\sqrt{${restV}}`;
    return { q: T`Liczba $\left(${sx}${minus ? '-' : '+'}${sy}\right)^2$ jest równa`, opts: opts(correct, [[String(S), 'Pominięty podwojony iloczyn: $(a\\pm b)^2=a^2\\pm2ab+b^2$, a nie $a^2+b^2$.'], [String(minus ? X - Y : X + Y + 2), 'To nie jest wzór skróconego mnożenia — kwadrat sumy/różnicy ma trzy składniki.'], [half, 'Zgubiona dwójka w wyrazie $2ab$.'], [String(minus ? S + (sq ? mid : 0) : S - (sq ? mid : 0)), 'Zły znak podwojonego iloczynu.'], [String(minus ? (Math.sqrt(X) - Math.sqrt(Y)) ** 2 + 2 : X - Y), 'Kwadrat różnicy to nie różnica kwadratów.']]),
      steps: [T`$(a${minus ? '-' : '+'}b)^2=a^2${minus ? '-' : '+'}2ab+b^2$, gdzie $a=${sx}$, $b=${sy}$.`, T`$a^2=${X}$, $b^2=${Y}$, $2ab=2\sqrt{${P}}=${midT}$, więc wynik to $${correct}$.`] };
  });
  // ∛(k³s) + ∛(m³s)  (2508-3)
  reg('pierwSzesc', ['2508-3'], ['f02-2', 'f02-4'], () => {
    const s = R.pick([2, 3, 4, 5]), k = R.int(2, 3), m = R.int(k + 1, 5), c = k + m;
    return { q: T`Liczba $\sqrt[3]{${k ** 3 * s}}+\sqrt[3]{${m ** 3 * s}}$ jest równa`, opts: opts(T`${c}\sqrt[3]{${s}}`, [[String(c), T`Pominięty czynnik $\sqrt[3]{${s}}$.`], [T`${s}\sqrt[3]{${c}}`, 'Zamienione: przed pierwiastkiem stoi suma wyłączonych czynników.'], [T`${c}\sqrt[3]{${2 * s}}`, 'Pierwiastków się nie dodaje pod jednym znakiem — wyłącz czynniki i dodaj współczynniki.'], [T`\sqrt[3]{${(k ** 3 + m ** 3) * s}}`, '$\\sqrt[3]{a}+\\sqrt[3]{b}\\neq\\sqrt[3]{a+b}$.']]),
      steps: [T`$\sqrt[3]{${k ** 3 * s}}=${k}\sqrt[3]{${s}}$, $\sqrt[3]{${m ** 3 * s}}=${m}\sqrt[3]{${s}}$.`, T`Suma: $${c}\sqrt[3]{${s}}$.`] };
  });
  // pierwiastki nieparzystego stopnia z liczb ujemnych (2606-1, 2608-1)
  reg('pierwUjemne', ['2606-1', '2608-1'], ['f02-2'], () => {
    if (R.int(0, 1)) { // ∛(-a³) + ⁵√(-b⁵)
      const a = R.int(2, 4), b = R.int(1, 2), v = -a - b;
      return { q: T`Liczba $\sqrt[3]{${-(a ** 3)}}+\sqrt[5]{${-(b ** 5)}}$ jest równa`, opts: opts(no(v), [[no(-a + b), 'Pierwiastek piątego stopnia z liczby ujemnej też jest ujemny.'], [no(a - b), 'Pierwiastek trzeciego stopnia z liczby ujemnej jest ujemny.'], [no(a + b), 'Pierwiastki nieparzystego stopnia z liczb ujemnych są ujemne.'], [no(-a * b), 'Pierwiastki się dodaje, nie mnoży.']]),
        steps: [T`$\sqrt[3]{${-(a ** 3)}}=${-a}$, bo $(${-a})^3=${-(a ** 3)}$; $\sqrt[5]{${-(b ** 5)}}=${-b}$.`, T`Suma: $${v}$.`] };
    }
    const a = R.int(3, 5), b = R.int(2, 4), c = R.int(1, 2); if (a === b) return null;
    const num = -a + b, v = Q(num, -2 * c);
    return { q: T`Liczba $\dfrac{\sqrt[3]{${-(a ** 3)}}+\sqrt[3]{${b ** 3}}}{\sqrt[5]{${-(32 * c ** 5)}}}$ jest równa`, opts: opts(qo(v), [[qo(Q(-v.n, v.d)), 'Znak: dzielimy liczbę ujemną przez ujemną albo dodatnią przez ujemną — sprawdź oba pierwiastki.'], [qo(Q(v.d, v.n)), 'Odwrócony ułamek.'], [qo(Q(-v.d, v.n)), 'Odwrócony ułamek i zły znak.'], [qo(Q(a + b, 2 * c)), 'Pierwiastek trzeciego stopnia z liczby ujemnej jest ujemny.']]),
      steps: [T`$\sqrt[3]{${-(a ** 3)}}=${-a}$, $\sqrt[3]{${b ** 3}}=${b}$, $\sqrt[5]{${-(32 * c ** 5)}}=${-2 * c}$.`, T`$\frac{${-a}+${b}}{${-2 * c}}=\frac{${num}}{${-2 * c}}=${qt(v)}$.`] };
  });
  // ∛(-a³/b)·∛(b/c³) itp. (2305-2)
  reg('pierwSzescUlamek', ['2305-2'], ['f02-2', 'f02-4'], () => {
    const a = R.int(2, 5), c = R.pick([2, 4].concat(a % 2 ? [] : [])), k = R.pick([2, 3]); if (gcd(a, c) !== 1) return null;
    // ∛(−a³/(c³·k)) · ∛k = −a/c
    const v = Q(-a, c);
    return { q: T`Liczba $\sqrt[3]{-\frac{${a ** 3}}{${c ** 3 * k}}}\cdot\sqrt[3]{${k}}$ jest równa`, opts: opts(qo(v), [[qo(Q(a, c)), 'Pierwiastek trzeciego stopnia z liczby ujemnej jest ujemny.'], [qo(Q(c, a)), 'Odwrócony ułamek i zgubiony minus.'], [qo(Q(-c, a)), 'Odwrócony ułamek.']]),
      steps: [T`$\sqrt[3]{x}\cdot\sqrt[3]{y}=\sqrt[3]{xy}$: $\ \sqrt[3]{-\frac{${a ** 3}}{${c ** 3 * k}}\cdot ${k}}=\sqrt[3]{-\frac{${a ** 3}}{${c ** 3}}}=${qt(v)}$.`] };
  });
  // ∛x·⁶√x·√x  (2306-2)
  reg('pierwPotegi', ['2306-2'], ['f02-3', 'f02-4'], () => {
    const ns = R.pick([[3, 6, 2], [4, 4, 2], [3, 3, 3], [2, 4, 4], [6, 6, 3], [2, 3, 6], [3, 6], [2, 4], [4, 4], [2, 6, 6], [5, 5, 5, 5, 5], [8, 8, 4], [3, 3, 6, 6], [4, 8, 8], [2, 8, 8, 4], [6, 3]]), e = ns.reduce((s, n) => qadd(s, Q(1, n)), Q(0));
    const T1 = n => (n === 2 ? '\\sqrt{x}' : T`\sqrt[${n}]{x}`), ex = x => (x.d === 1 ? (x.n === 1 ? 'x' : T`x^{${x.n}}`) : T`\sqrt[${x.d}]{x${x.n === 1 ? '' : '^{' + x.n + '}'}}`);
    const prod = Q(1, ns.reduce((s, n) => s * n, 1));
    return { q: T`Dla każdej dodatniej liczby rzeczywistej $x$ iloczyn $${ns.map(T1).join('\\cdot ')}$ jest równy`, opts: opts(ex(e), [[ex(prod), 'Przy mnożeniu potęg wykładniki się dodaje, a nie mnoży.'], [ex(Q(e.n + 1, e.d)), 'Policz jeszcze raz sumę wykładników.'], [T`x^{${ns.length}}`, 'Pierwiastek $n$-tego stopnia to wykładnik $\\frac1n$, a nie $1$.'], [ex(Q(3, ns.reduce((s, n) => s + n, 0))), 'Wykładniki to $\\frac1n$ — dodajemy ułamki, a nie mianowniki.']]),
      steps: [T`$${ns.map(T1).join('\\cdot ')}=x^{${ns.map(n => '\\frac1{' + n + '}').join('+')}}=x^{${qt(e)}}$.`] };
  });
  // potęgi o różnych podstawach sprowadzone do jednej (2405-2, 2506-2, 2508-2, 2606-2, 2605-3)
  reg('potJednaPodst', ['2405-2', '2506-2', '2508-2', '2606-2', '2605-3', '2308-5'], ['f02-4', 'f02-3'], () => {
    const t = R.int(0, 3), b = R.pick([2, 3, 5]);
    if (t === 0) { // (1/b^k)^m · (b^j)^n
      const k = R.int(2, 4), m = R.int(2, 6), j = R.int(2, 3), n = R.int(3, 8), e = -k * m + j * n; if (e < 2) return null;
      return { q: T`Liczba $\left(\frac{1}{${b ** k}}\right)^{${m}}\cdot ${b ** j}^{${n}}$ jest równa`, opts: opts(pw(b, e), [[pw(b, k * m + j * n), 'Ułamek $\\frac1{a}$ to $a^{-1}$ — wykładnik jest ujemny.'], [pw(b, j * n - m), T`$${b ** k}=${b}^{${k}}$, więc $\left(${b}^{-${k}}\right)^{${m}}=${b}^{-${k * m}}$.`], [pw(b, Math.abs(j * n - k - m)), 'Potęgę potęgi liczymy, mnożąc wykładniki, a nie dodając.'], [pw(b, e * 2), 'Sprawdź, jak zapisać obie liczby jako potęgi tej samej podstawy.']]),
        steps: [T`$\frac1{${b ** k}}=${b}^{-${k}}$, $${b ** j}=${b}^{${j}}$.`, T`$${b}^{-${k * m}}\cdot ${b}^{${j * n}}=${b}^{${e}}$.`] };
    }
    if (t === 1) { // b^{2k}·∛(b^3j)... 256·∛(8²)
      const k = R.int(5, 8), j = R.int(1, 2), e = k + 2 * j; if (b !== 2) return null;
      return { q: T`Liczba $${2 ** k}\cdot\sqrt[3]{${2 ** (3 * j)}^2}$ jest równa`, opts: opts(pw(2, e), [[pw(2, k), T`Pominięty czynnik $\sqrt[3]{${2 ** (3 * j)}^2}=2^{${2 * j}}$.`], [pw(2, k * 2 * j), 'Przy mnożeniu potęg dodajemy wykładniki, a nie mnożymy.'], [pw(2, k + 6 * j), 'Pierwiastek trzeciego stopnia dzieli wykładnik przez 3.'], [pw(2, k + j), T`$${2 ** (3 * j)}^2=2^{${6 * j}}$, a $\sqrt[3]{2^{${6 * j}}}=2^{${2 * j}}$.`]]),
        steps: [T`$${2 ** k}=2^{${k}}$, $\sqrt[3]{${2 ** (3 * j)}^2}=\sqrt[3]{2^{${6 * j}}}=2^{${2 * j}}$.`, T`$2^{${k}}\cdot 2^{${2 * j}}=2^{${e}}$.`] };
    }
    if (t === 2) { // (b²)^{-m} / (b³)^{-n}
      const m = R.int(2, 4), n = R.int(2, 5), e = -2 * m + 3 * n; if (e <= 0 || b === 2) return null;
      return { q: T`Liczba $\dfrac{${b * b}^{-${m}}}{${b ** 3}^{-${n}}}$ jest równa`, opts: opts(pw(b, e), [[pw(b, -2 * m - 3 * n), 'Przy dzieleniu potęg wykładniki się odejmuje: $-a-(-b)=-a+b$.'], [pw(b, -2 * m + n), T`$${b ** 3}=${b}^3$, więc $${b ** 3}^{-${n}}=${b}^{-${3 * n}}$.`], [pw(b, 2 * m - 3 * n === 0 ? 7 : Math.abs(2 * m - n)), 'Sprawdź znaki wykładników.'], [pw(b, 3 * n), 'Zgubiony licznik.']]),
        steps: [T`$${b * b}^{-${m}}=${b}^{-${2 * m}}$, $${b ** 3}^{-${n}}=${b}^{-${3 * n}}$.`, T`$${b}^{-${2 * m}-(-${3 * n})}=${b}^{${e}}$.`] };
    }
    // √(b·√b) = b^{3/4}
    const r = R.pick([[2, 2, '3}{4'], [3, 2, '2}{3'], [2, 3, '2}{3']]); void r;
    const outer = R.pick([2, 3]), inner = R.pick([2, 3]), e = Q(inner + 1, inner * outer);
    const ins = inner === 2 ? T`\sqrt{${b}}` : T`\sqrt[3]{${b}}`, out = outer === 2 ? T`\sqrt{${b}${ins}}` : T`\sqrt[3]{${b}${ins}}`;
    const ex = x => (x.d === 1 ? pw(b, x.n) : T`${b}^{\frac{${x.n}}{${x.d}}}`);
    return { q: T`Liczba $${out}$ jest równa`, opts: opts(ex(e), [[ex(Q(1, inner * outer)), 'Pod zewnętrznym pierwiastkiem jest $' + b + '\\cdot' + ins + '$, czyli $' + b + '^{1+\\frac1{' + inner + '}}$.'], [ex(Q(1, outer)), 'Zgubiony wewnętrzny pierwiastek.'], [ex(Q(inner + 1, inner)), 'Zgubiony zewnętrzny pierwiastek.'], [ex(Q(2, inner * outer)), 'Wykładniki się dodaje: $1+\\frac1n$.']]),
      steps: [T`$${b}${ins}=${b}^{1}\cdot ${b}^{\frac1{${inner}}}=${b}^{\frac{${inner + 1}}{${inner}}}$.`, T`Zewnętrzny pierwiastek dzieli wykładnik przez $${outer}$: $${ex(e)}$.`] };
  });
  // (b^m+b^{m+1}+b^{m+2})/b^m  (2505-2)
  reg('potWylacz', ['2505-2'], ['f02-4'], () => {
    const b = R.pick([2, 3, 4, 5]), m = R.int(8, 15), v = 1 + b + b * b;
    return { q: T`Liczba $\dfrac{${b}^{${m}}+${b}^{${m + 1}}+${b}^{${m + 2}}}{${b}^{${m}}}$ jest równa`, opts: opts(String(v), [[String(b + b * b), T`$\frac{${b}^{${m}}}{${b}^{${m}}}=1$, a nie $0$.`], [pw(b, m), 'Wyłącz $' + b + '^{' + m + '}$ z licznika przed skracaniem.'], [pw(b, 3 * m + 3 - m), 'Potęg o tej samej podstawie się nie dodaje, dodając wykładniki.'], [String(3 * b), 'Wyłączając $' + b + '^{' + m + '}$, zostaje $1+' + b + '+' + b + '^2$.']]),
      steps: [T`$${b}^{${m}}+${b}^{${m + 1}}+${b}^{${m + 2}}=${b}^{${m}}(1+${b}+${b}^2)$.`, T`Po skróceniu: $1+${b}+${b * b}=${v}$.`] };
  });
  // procent składany — odsetki po n latach (2306-4, 2605-2)
  reg('procentOdsetki', ['2306-4', '2605-2'], ['f08-10'], () => {
    const K = R.pick([10000, 20000, 30000, 40000, 50000]), p = R.pick([4, 5, 6, 7, 8]), n = 2;
    const tot = Math.round(K * (1 + p / 100) ** n), ods = tot - K;
    return { q: T`Klient wpłacił do banku $${big(K)}$ zł na lokatę dwuletnią. Po każdym rocznym okresie oszczędzania bank dolicza odsetki w wysokości $${p}\%$ od kwoty bieżącego kapitału znajdującego się na lokacie — zgodnie z procentem składanym. Po dwóch latach łączna wartość doliczonych odsetek (bez podatków) jest równa`,
      opts: opts(big(ods) + '\\text{ zł}', [[big(K * p / 100 * 2) + '\\text{ zł}', 'To odsetki proste — w drugim roku odsetki liczy się od powiększonego kapitału.'], [big(K * p / 100) + '\\text{ zł}', 'To odsetki tylko za pierwszy rok.'], [big(Math.round(K * p / 100 * (1 + p / 100))) + '\\text{ zł}', 'To odsetki tylko za drugi rok.'], [big(tot) + '\\text{ zł}', 'To cała kwota na lokacie, a pytamy o same odsetki.']]),
      steps: [T`Po dwóch latach: $${big(K)}\cdot ${dec(1 + p / 100)}^2=${big(tot)}$ zł.`, T`Odsetki: $${big(tot)}-${big(K)}=${big(ods)}$ zł.`] };
  });
  reg('procentWzor', ['2406-4'], ['f08-10'], () => {
    const p = R.pick([2, 3, 4, 5, 6, 8]), n = R.pick([2, 3, 4]), f = dec(1 + p / 100), K = 'K_0';
    return { q: T`Klient wpłacił do banku na ${n === 2 ? 'dwuletnią' : n === 3 ? 'trzyletnią' : 'czteroletnią'} lokatę kwotę $${K}$ zł. Po każdym rocznym okresie bank dolicza odsetki w wysokości $${p}\%$ od bieżącego kapitału — zgodnie z procentem składanym. Po $${n}$ latach kwota na lokacie (bez podatków) jest równa`,
      opts: opts(T`${K}\cdot(${f})^{${n}}`, [[T`${K}\cdot ${dec(1 + p * n / 100)}`, 'To procent prosty — odsetki doliczane są od coraz większej kwoty.'], [T`${K}\cdot(${dec(1 + p / 100 / n)})^{${n}}`, 'Oprocentowanie roczne nie dzieli się przez liczbę lat.'], [T`${K}\cdot(${dec(1 + p / 200)})^{${2 * n}}`, 'Kapitalizacja jest roczna, a nie półroczna.'], [T`${K}\cdot ${p}^{${n}}`, `Procent to ułamek: $${p}\\%=${dec(p / 100)}$, a kapitał rośnie o czynnik $${f}$.`]]),
      steps: [T`Co roku kapitał mnoży się przez $1+\frac{${p}}{100}=${f}$.`, T`Po $${n}$ latach: $${K}\cdot(${f})^{${n}}$.`] };
  });
  // wartość bezwzględna: oś → nierówność (2305-1)
  reg('absOsNierown', ['2305-1'], ['f01-1', 'f01-3'], () => {
    const a = R.int(-5, 2), b = a + 2 * R.int(2, 5) + R.pick([0, 1]); const c = (a + b) / 2, r = (b - a) / 2, out = R.int(0, 1) === 1;
    const segs = out ? [[-Infinity, a, 0, 1], [b, Infinity, 1, 0]] : [[a, b, 1, 1]];
    const N = (cc, s, rr) => T`|x${cc === 0 ? '' : (cc > 0 ? '-' : '+') + dec(Math.abs(cc))}|${s}${dec(rr)}`;
    const sg = out ? '\\geq ' : '\\leq ';
    return { q: 'Na osi liczbowej zaznaczono ' + (out ? 'sumę przedziałów' : 'przedział') + '.<br>' + axis(segs, [a, b]) + '<br>Zbiór zaznaczony na osi jest zbiorem wszystkich rozwiązań nierówności',
      opts: opts(N(c, sg, r), [[N(c, out ? '\\leq ' : '\\geq ', r), 'Zły kierunek nierówności: „$\\geq$” daje dwie półproste, „$\\leq$” — odcinek.'], [N(r, sg, c), 'Zamienione: środek odcinka to $\\frac{a+b}2$, a promień to $\\frac{b-a}2$.'], [N(-c, sg, r), '$|x-c|$ to odległość od $c$ — zły znak środka.'], [N(r, out ? '\\leq ' : '\\geq ', c), 'Zamieniony środek z promieniem i zły kierunek.']]),
      steps: [T`Środek: $\frac{${a}+${b}}{2}=${dec(c)}$, odległość do końców: $${dec(r)}$.`, T`${out ? 'Punkty odległe od środka o co najmniej' : 'Punkty odległe od środka o co najwyżej'} $${dec(r)}$: $${N(c, sg, r)}$.`] };
  });
  // nierówność → oś (2308-1, 2405-1)
  reg('absNierownOs', ['2308-1', '2405-1'], ['f01-1', 'f01-3'], () => {
    const c = R.int(-3, 5), r = R.int(1, 4), out = R.int(0, 1) === 1, strict = R.int(0, 1) === 1;
    const sg = out ? (strict ? '>' : '\\geq') : strict ? '<' : '\\leq', cl = strict ? 0 : 1;
    const seg = (cc, oo, cl2) => (oo ? [[-Infinity, cc - r, 0, cl2], [cc + r, Infinity, cl2, 0]] : [[cc - r, cc + r, cl2, cl2]]);
    const pic = s => axis(s, [c - r, c + r, -c - r, -c + r].filter((v, i, a) => a.indexOf(v) === i));
    const o = opts('A', []) || null; void o;
    const variants = [[seg(c, out, cl), true, ''], [seg(c, !out, cl), false, 'Zły kierunek: „$>$” to punkty dalej niż ' + r + ' od środka, „$<$” — bliżej.'], [seg(-c, out, cl), false, '$|x-' + c + '|$ to odległość od $' + c + '$, a nie od $' + -c + '$.'], [seg(c, out, 1 - cl), false, 'Nierówność ' + (strict ? 'ostra — końce nie należą do zbioru (puste kółka).' : 'nieostra — końce należą do zbioru (pełne kółka).')]];
    if (c === 0) variants[2] = [seg(c, !out, 1 - cl), false, 'Zły kierunek i złe końce.'];
    const sh = R.shuffle(variants);
    return { q: T`Dana jest nierówność $|x${c === 0 ? '' : sgn(-c)}|${sg} ${r}$. Na którym rysunku poprawnie zaznaczono zbiór wszystkich jej rozwiązań?`,
      opts: sh.map(([s, ok, why]) => ({ t: '', html: pic(s), ok, why })),
      steps: [T`$|x${c === 0 ? '' : sgn(-c)}|$ to odległość $x$ od $${c}$.`, T`${out ? 'Odległość większa' : 'Odległość mniejsza'}${strict ? '' : ' lub równa'} $${r}$: ${out ? T`$x${strict ? '<' : '\\leq'} ${c - r}$ lub $x${strict ? '>' : '\\geq'} ${c + r}$` : T`$${c - r}${strict ? '<' : '\\leq'} x${strict ? '<' : '\\leq'} ${c + r}$`}.`] };
  });
  // ile liczb całkowitych (dodatnich) spełnia |x+a| < r (2306-1, 2408-1)
  reg('absIleCalk', ['2306-1', '2408-1'], ['f01-1', 'f01-3'], () => {
    const a = R.int(-6, 6), r = R.int(2, 15), pos = R.int(0, 1) === 1;
    const lo = -a - r, hi = -a + r; let cnt = 0; for (let x = lo + 1; x < hi; x++) if (!pos || x > 0) cnt++;
    if (cnt < 2) return null;
    let cntLe = 0; for (let x = lo; x <= hi; x++) if (!pos || x > 0) cntLe++;
    return { q: T`Liczba wszystkich ${pos ? 'całkowitych dodatnich' : 'całkowitych'} rozwiązań nierówności $|x${a === 0 ? '' : sgn(a)}|<${r}$ jest równa`,
      opts: opts(String(cnt), [[String(cntLe), 'Nierówność jest ostra — końce przedziału nie należą do rozwiązań.'], [String(pos ? 2 * r - 1 : r), pos ? 'Pominięty warunek „dodatnich”.' : 'Liczby całkowite są po obu stronach środka.'], [String(cnt + 1), 'Policz końce: $' + (lo + 1) + '$ i $' + (hi - 1) + '$ należą do rozwiązań.'], [String(2 * r), 'Przedział otwarty o długości $' + 2 * r + '$ zawiera $' + (2 * r - 1) + '$ liczb całkowitych.']]),
      steps: [T`$|x${a === 0 ? '' : sgn(a)}|<${r}\iff ${lo}<x<${hi}$.`, pos ? T`Liczby całkowite dodatnie z tego przedziału: od $1$ do $${hi - 1}$ — jest ich $${cnt}$.` : T`Liczby całkowite od $${lo + 1}$ do $${hi - 1}$ — jest ich $${cnt}$.`] };
  });
  reg('absRownIloczyn', ['2506-1'], ['f01-1'], () => {
    const a = R.int(2, 9), r = R.int(1, 7); if (r === a) return null; const x1 = a - r, x2 = a + r;
    return { q: T`Liczby $x_1$ i $x_2$ są różnymi rozwiązaniami równania $|x-${a}|=${r}$. Iloczyn $x_1\cdot x_2$ jest równy`, opts: opts(no(x1 * x2), [[String(2 * a), 'To suma rozwiązań, a nie iloczyn.'], [no(a * r), 'Rozwiązania to $' + a + '\\pm' + r + '$.'], [String(x2 * x2), 'Drugie rozwiązanie to $' + x1 + '$, a nie $' + x2 + '$.'], [no(-(x1 * x2)), 'Sprawdź znak: $(' + x1 + ')\\cdot' + x2 + '$.']]),
      steps: [T`$|x-${a}|=${r}\iff x=${a}-${r}=${x1}$ lub $x=${a}+${r}=${x2}$.`, T`Iloczyn: $${x1 < 0 ? '(' + x1 + ')' : x1}\cdot ${x2}=${x1 * x2}$.`] };
  });
  reg('absPierw', ['2508-1'], ['f01-1'], () => {
    const s = R.pick([2, 3, 5, 6, 7, 10]), sq = Math.sqrt(s), up = Math.ceil(sq) + R.int(0, 1), lo = Math.floor(sq) - R.int(0, 1); if (lo < 0 || up === sq) return null;
    const v = up - lo; // |√s − up| + |√s − lo| = up − √s + √s − lo
    return { q: T`Liczba $|\sqrt{${s}}-${up}|+|\sqrt{${s}}-${lo}|$ jest równa`, opts: opts(String(v), [[T`2\sqrt{${s}}-${up + lo}`, `Opuszczono wartości bezwzględne bez sprawdzenia znaku — $\\sqrt{${s}}<${up}$, więc $|\\sqrt{${s}}-${up}|=${up}-\\sqrt{${s}}$.`], [T`2\sqrt{${s}}+${v}`, 'Zły znak przy opuszczaniu wartości bezwzględnej.'], [String(up + lo), 'Pierwiastki się redukują, ale liczby też trzeba odjąć.'], [T`${up + lo}-2\sqrt{${s}}`, `$\\sqrt{${s}}>${lo}$, więc $|\\sqrt{${s}}-${lo}|=\\sqrt{${s}}-${lo}$.`]]),
      steps: [T`$\sqrt{${s}}\approx ${dec(sq.toFixed(2))}$, więc $\sqrt{${s}}-${up}<0$ i $\sqrt{${s}}-${lo}>0$.`, T`$(${up}-\sqrt{${s}})+(\sqrt{${s}}-${lo})=${v}$.`] };
  });
  // logarytmy: log_a x ± log_a y (2305-4, 2605-4, 2508-4, 2306-5, 2608-3, 2505-3, 2308-3)
  reg('logDzialania', ['2305-4', '2605-4', '2508-4', '2306-5', '2608-3', '2505-3', '2308-3'], ['f03-1', 'f03-2'], () => {
    const b = R.pick([2, 3, 5, 8, 9]), base = { 2: 2, 3: 3, 5: 5, 8: 2, 9: 3 }[b], k = { 2: 1, 3: 1, 5: 1, 8: 3, 9: 2 }[b];
    // x = base^i, y = base^j; log_b x ± log_b y = (i ± j)/k
    const i = R.int(-2, 5), j = R.int(1, 4), plus = R.int(0, 1) === 1, c = R.pick([1, 1, 2]);
    const X = Q(base ** Math.max(i, 0), base ** Math.max(-i, 0)), Y = base ** j, e = plus ? i + c * j : i - c * j, v = Q(e, k);
    if (i === 0 || (b === base && Math.abs(i) > 3)) return null;
    const lg = x => T`\log_{${b}}${x}`, xt = qt(X);
    const yT = c === 1 ? lg(Y) : T`${c}\log_{${b}}${Y}`;
    const wrongArg = plus ? (X.d === 1 ? X.n + c * Y : null) : X.d === 1 ? X.n - c * Y : null;
    return { q: T`Liczba $${lg(xt)}${plus ? '+' : '-'}${yT}$ jest równa`, opts: opts(qo(v), [[wrongArg != null && wrongArg > 0 ? lg(wrongArg) : null, `$\\log a${plus ? '+' : '-'}\\log b=\\log(a${plus ? '\\cdot' : ':'}b)$, a nie $\\log(a${plus ? '+' : '-'}b)$.`], [qo(Q(plus ? i - c * j : i + c * j, k)), plus ? 'Logarytmy się dodaje — iloczyn, nie iloraz.' : 'Przy odejmowaniu logarytmów — iloraz, nie iloczyn.'], [qo(Q(-v.n, v.d)), 'Sprawdź znak wyniku.'], [qo(Q(e * k, 1)), k > 1 ? `Podstawa $${b}=${base}^{${k}}$ — wynik trzeba podzielić przez $${k}$.` : 'Policz potęgę podstawy jeszcze raz.'], [String(base ** Math.abs(e)), 'Logarytm to wykładnik, a nie sama liczba pod logarytmem.']]),
      steps: [T`$${lg(xt)}${plus ? '+' : '-'}${yT}=\log_{${b}}\left(${xt}${plus ? '\\cdot' : ':'}${Y}${c === 2 ? '^2' : ''}\right)=\log_{${b}}${qt(plus ? qmul(X, Q(Y ** c)) : qdiv(X, Q(Y ** c)))}$.`, T`$${b}^{${qt(v)}}=${qt(plus ? qmul(X, Q(Y ** c)) : qdiv(X, Q(Y ** c)))}$, więc wynik to $${qt(v)}$.`] };
  });
  // log_{√a} a^k, log_a ∛(a²)  (2405-4, 2606-3)
  reg('logPierw', ['2405-4', '2606-3'], ['f03-1', 'f02-3'], () => {
    const a = R.pick([2, 3, 5, 7]);
    if (R.int(0, 1)) { const k = R.int(2, 4), v = 2 * k; return { q: T`Liczba $\log_{\sqrt{${a}}}${a ** k}$ jest równa`, opts: opts(String(v), [[String(k), 'Podstawa to $\\sqrt{' + a + '}=' + a + '^{\\frac12}$ — wynik jest dwa razy większy.'], [qo(Q(k, 2)), 'Odwrotnie: dzielenie przez $\\frac12$ to mnożenie przez 2.'], [String(a ** k), 'Logarytm to wykładnik, a nie liczba.'], [String(k + 2), 'Wykładniki się mnoży, nie dodaje.']]), steps: [T`$${a ** k}=${a}^{${k}}=\left(\sqrt{${a}}\right)^{${2 * k}}$, więc logarytm to $${v}$.`] }; }
    const n = R.pick([3, 4, 5]), m = R.int(1, n - 1) + 0, v = Q(m, n); if (gcd(m, n) !== 1) return null;
    return { q: T`Liczba $\log_{${a}}\sqrt[${n}]{${a ** m}}$ jest równa`, opts: opts(qo(v), [[qo(Q(n, m)), 'Odwrócony ułamek: $\\sqrt[n]{a^m}=a^{\\frac mn}$.'], [qo(Q(m * n)), 'Pierwiastek dzieli wykładnik, a nie mnoży.'], [qo(Q(1, n)), 'Pod pierwiastkiem jest $' + a + '^{' + m + '}$.'], [String(m), 'Zapomniany stopień pierwiastka.']]), steps: [T`$\sqrt[${n}]{${a ** m}}=${a}^{\frac{${m}}{${n}}}$, więc $\log_{${a}}${a}^{\frac{${m}}{${n}}}=${qt(v)}$.`] };
  });
  reg('logUlamki', ['2406-2'], ['f03-2'], () => {
    const b = R.pick([2, 3, 5]), p = R.int(2, 4), q = R.int(2, 5); if (gcd(p, q) !== 1 || q === b) return null;
    // log_b(b/q) + log_b(q/b^p) = 1 − p
    const x = Q(b, q), y = Q(q, b ** p), v = 1 - p;
    return { q: T`Liczba $\log_{${b}}\left(${qt(x)}\right)+\log_{${b}}\left(${qt(y)}\right)$ jest równa`, opts: opts(no(v), [[T`\log_{${b}}${qt(qadd(x, y))}`, 'Suma logarytmów to logarytm iloczynu, a nie sumy.'], [T`\log_{${b}}\frac{${b + q}}{${q + b ** p}}`, 'Ułamków nie dodaje się „licznik do licznika”, a logarytmów — nie tak.'], [qo(Q(1, b ** (p - 1))), 'Wynik to logarytm iloczynu, czyli wykładnik, a nie sama liczba.'], [no(1 + p), 'Sprawdź znak: $\\frac1{' + b + '^{' + (p - 1) + '}}=' + b + '^{' + (1 - p) + '}$.']]),
      steps: [T`$\log_{${b}}${qt(x)}+\log_{${b}}${qt(y)}=\log_{${b}}\left(${qt(x)}\cdot ${qt(y)}\right)=\log_{${b}}${qt(qmul(x, y))}$.`, T`$${qt(qmul(x, y))}=${b}^{${v}}$, więc wynik to $${v}$.`] };
  });
  // P/F: 2·log a = log a², 2 + log a ≠ log(a+2) (2506-3)
  reg('logPF', ['2506-3'], ['f03-2', 'f03-1'], () => {
    const b = R.pick([2, 3, 5]), a = R.pick([3, 5, 6, 7].filter(x => x !== b)), k = R.int(2, 3);
    const s1 = R.int(0, 1) ? [T`Iloczyn $${k}\cdot\log_{${b}}${a}$ jest równy $\log_{${b}}${a ** k}$.`, true, '$r\\log x=\\log x^r$.'] : [T`Iloczyn $${k}\cdot\log_{${b}}${a}$ jest równy $\log_{${b}}${a * k}$.`, false, T`$${k}\log_{${b}}${a}=\log_{${b}}${a}^{${k}}=\log_{${b}}${a ** k}$.`];
    const s2 = R.int(0, 1) ? [T`Suma $${k}+\log_{${b}}${a}$ jest równa $\log_{${b}}${a + k}$.`, false, T`$${k}=\log_{${b}}${b ** k}$, więc suma to $\log_{${b}}${b ** k * a}$.`] : [T`Suma $${k}+\log_{${b}}${a}$ jest równa $\log_{${b}}${b ** k * a}$.`, true, T`$${k}=\log_{${b}}${b ** k}$, a suma logarytmów to logarytm iloczynu.`];
    return { pf: [s1, s2], q: 'Oceń prawdziwość poniższych stwierdzeń.', steps: [s1[2], s2[2]] };
  });
  // P/F: 4^a·5^{2a} dzieli się przez…, liczba cyfr (2605-5)
  reg('potCyfryPF', ['2605-5'], ['f02-4'], () => {
    const a = R.int(5, 15), N = 2 * a; // 4^a·5^{2a} = 10^{2a}
    const d = R.pick([20, 25, 40, 50, 8]), divOk = d === 8 ? 3 <= 2 * a : true;
    const digitsT = R.int(0, 1) ? N + 1 : N;
    return { pf: [[T`Liczba naturalna $4^{${a}}\cdot 5^{${2 * a}}$ jest podzielna przez $${d}$.`, divOk, T`$4^{${a}}\cdot 5^{${2 * a}}=2^{${2 * a}}\cdot 5^{${2 * a}}=10^{${2 * a}}$ — dzieli się przez $${d}$.`], [T`Liczba naturalna $4^{${a}}\cdot 5^{${2 * a}}$ jest w zapisie dziesiętnym liczbą ${digitsT}-cyfrową.`, digitsT === N + 1, T`$10^{${N}}$ to jedynka i $${N}$ zer — ma $${N + 1}$ cyfr.`]], q: 'Oceń prawdziwość poniższych stwierdzeń.', steps: [] };
  });
  // dwie prawdziwe równości z logarytmami (2408-4)
  reg('logDwie', ['2408-4'], ['f03-2'], () => {
    const b = R.pick([2, 3]), m = R.int(2, 4), x = b ** m, y = R.pick([5, 7, 9, 25].filter(v => v % b)), p = x * y;
    const L = T`\log_{${b}}${x}+\log_{${b}}${y}`;
    const all = [[T`${L}=\log_{${b}}${p}`, true], [T`${L}=${m}+\log_{${b}}${y}`, true], [T`${L}=\log_{${b}}${x + y}`, false], [T`${L}=\log_{${b * b}}${p}`, false], [T`${L}=${m}\cdot\log_{${b}}${y}`, false], [T`${L}=\log_{${b}}${x}\cdot\log_{${b}}${y}`, false]];
    return { multi: R.shuffle(all).map(([t, ok]) => ({ t, ok, why: ok ? '' : (t.includes(String(x + y)) ? 'Logarytm sumy to nie suma logarytmów.' : 'Suma logarytmów o tej samej podstawie to logarytm iloczynu.') })), q: 'Wybierz <b>dwie</b> prawdziwe równości.', steps: [T`$${L}=\log_{${b}}(${x}\cdot ${y})=\log_{${b}}${p}$, a $\log_{${b}}${x}=${m}$.`] };
  });

  A.MGEN = { G, MAP, snipTitles: {}, gen: id => { const g = G[MAP[id]]; if (!g) return null; for (let k = 0; k < 60; k++) { let r = null; try { r = g.gen(); } catch (e) { r = null; } if (r && (r.opts || r.pf || r.multi)) return Object.assign({ pattern: MAP[id] }, r); } return null; }, wz: id => (G[MAP[id]] || {}).wz || [] };
})();
