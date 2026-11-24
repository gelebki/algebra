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

  /* ---------- wielomiany, przedziały, wykresy ---------- */
  const ptrim = a => { const r = a.slice(); while (r.length > 1 && !r[0]) r.shift(); return r; };
  const poly = (cs, v = 'x') => { const n = cs.length - 1; let s = ''; cs.forEach((c, i) => { if (!c) return; const e = n - i, a = Math.abs(c); s += (c < 0 ? '-' : s ? '+' : '') + (a === 1 && e > 0 ? '' : String(a)) + (e === 0 ? '' : e === 1 ? v : v + '^{' + e + '}'); }); return s || '0'; };
  const pmul = (a, b) => { const r = Array(a.length + b.length - 1).fill(0); a.forEach((x, i) => b.forEach((y, j) => { r[i + j] += x * y; })); return r; };
  const padd = (a, b) => { const n = Math.max(a.length, b.length), A2 = Array(n - a.length).fill(0).concat(a), B2 = Array(n - b.length).fill(0).concat(b); return ptrim(A2.map((x, i) => x + B2[i])); };
  const pneg = a => a.map(x => -x);
  const lin = (p, q, v = 'x') => poly([p, q], v); // px+q
  const inf = v => (v === Infinity ? '+\\infty' : v === -Infinity ? '-\\infty' : (typeof v === 'object' ? qt(v) : String(v)));
  const iv = (a, b, ca, cb) => (a === -Infinity || !ca ? '(' : '[') + inf(a) + ', ' + inf(b) + (b === Infinity || !cb ? ')' : ']');
  // wykres prostych y = a x + b na siatce −6..6 (a może być ułamkiem {n,d})
  function plotLines(ls) {
    const S = 18, O = 6 * S + 8, W = 12 * S + 16; let s = `<svg class="maxis mplot" viewBox="0 0 ${W} ${W}" width="${W}" height="${W}" role="img">`;
    for (let i = -6; i <= 6; i++) s += `<line x1="${O + i * S}" y1="8" x2="${O + i * S}" y2="${W - 8}" stroke="currentColor" stroke-opacity=".13"/><line x1="8" y1="${O + i * S}" x2="${W - 8}" y2="${O + i * S}" stroke="currentColor" stroke-opacity=".13"/>`;
    s += `<line x1="4" y1="${O}" x2="${W - 4}" y2="${O}" stroke="currentColor"/><line x1="${O}" y1="${W - 4}" x2="${O}" y2="4" stroke="currentColor"/><text x="${W - 12}" y="${O - 5}" font-size="11" font-style="italic" fill="currentColor">x</text><text x="${O + 5}" y="13" font-size="11" font-style="italic" fill="currentColor">y</text>`;
    for (const v of [-5, -3, -1, 1, 3, 5]) s += `<text x="${O + v * S}" y="${O + 13}" font-size="9.5" text-anchor="middle" fill="currentColor">${v < 0 ? '−' + -v : v}</text><text x="${O - 4}" y="${O - v * S + 3}" font-size="9.5" text-anchor="end" fill="currentColor">${v < 0 ? '−' + -v : v}</text>`;
    const col = ['#7b3fbf', '#d0618a'], cid = 'mc' + Math.random().toString(36).slice(2, 8);
    s += `<clipPath id="${cid}"><rect x="8" y="8" width="${W - 16}" height="${W - 16}"/></clipPath>`;
    ls.forEach(([a, b], k) => { const av = typeof a === 'object' ? a.n / a.d : a, bv = typeof b === 'object' ? b.n / b.d : b; const y = x => av * x + bv; s += `<line x1="${O - 6.4 * S}" y1="${O - y(-6.4) * S}" x2="${O + 6.4 * S}" y2="${O - y(6.4) * S}" stroke="${col[k]}" stroke-width="2.4" clip-path="url(#${cid})"/>`; });
    return `<div class="mplotw">${s}</svg></div>`;
  }
  const linEq = (a, b) => T`y=${(typeof a === 'object' ? (a.d === 1 ? (a.n === 1 ? '' : a.n === -1 ? '-' : a.n) : qt(a)) : a === 1 ? '' : a === -1 ? '-' : a)}x${(typeof b === 'object' ? b.n : b) === 0 ? '' : (typeof b === 'object' ? (b.n < 0 ? '-' + qt(Q(-b.n, b.d)) : '+' + qt(b)) : sgn(b))}`;
  const sys = (e1, e2) => T`\begin{cases}${e1}\\${e2}\end{cases}`;

  /* =================== DZIAŁ II: wyrażenia algebraiczne =================== */
  // (px+q)² − (rx+s)²  oraz (ax+by)² − (ax−by)²  (2305-5, 2405-5, 2508-6, 2505-4)
  reg('kwRoznKw', ['2305-5', '2405-5', '2508-6', '2505-4'], ['f06-0'], () => {
    if (R.int(0, 1)) { // dwie zmienne
      const a = R.int(1, 4), b = R.int(1, 3), sw = R.int(0, 1), first = sw ? '-' : '+', second = sw ? '+' : '-', c = 4 * a * b * (sw ? -1 : 1);
      const A1 = (a === 1 ? '' : a) + 'x', B1 = (b === 1 ? '' : b) + 'y', mono = k => (k === 1 ? '' : k === -1 ? '-' : k) + 'xy';
      return { q: T`Dla każdych liczb rzeczywistych $x$, $y$ wartość wyrażenia $(${A1}${first}${B1})^2-(${A1}${second}${B1})^2$ jest równa wartości wyrażenia`, opts: opts(opt(mono(c)), [[opt(mono(-c)), 'Zły znak: odejmujemy cały drugi kwadrat — jego wyraz $2ab$ zmienia znak.'], [T`${2 * b * b}y^2`, 'Wyrazy $a^2$ i $b^2$ się redukują — zostaje tylko podwojony iloczyn (dwa razy).'], [T`${2 * a * a}x^2`, 'Kwadraty się skracają, nie dodają.'], [opt(mono(c / 2)), 'Podwojony iloczyn występuje w obu kwadratach — razem $4ab$, a nie $2ab$.'], ['0', 'Kwadraty się nie znoszą — różnią się znakiem wyrazu $2ab$.']]),
        steps: [T`$(${A1}${first}${B1})^2=${a * a}x^2${first}${2 * a * b}xy+${b * b}y^2$, $(${A1}${second}${B1})^2=${a * a}x^2${second}${2 * a * b}xy+${b * b}y^2$.`, T`Różnica: $${mono(c)}$.`] };
    }
    const p = R.int(1, 3), q = R.int(-4, 4) || 2, r = R.int(1, 3), s = R.int(-4, 4) || -3; if (p === r && Math.abs(q) === Math.abs(s) && q === s) return null;
    const P1 = pmul([p, q], [p, q]), P2 = pmul([r, s], [r, s]), D = padd(P1, pneg(P2));
    const noMid = padd([p * p, 0, q * q], pneg([r * r, 0, s * s])), halfSub = padd(P1, [-r * r, -2 * r * s, s * s]);
    return { q: T`Dla każdej liczby rzeczywistej $x$ wartość wyrażenia $(${lin(p, q)})^2-(${lin(r, s)})^2$ jest równa wartości wyrażenia`, opts: opts(poly(D), [[poly(noMid), 'Pominięte wyrazy $2ab$: $(a+b)^2\\neq a^2+b^2$.'], [poly(halfSub), 'Minus przed nawiasem zmienia znaki <b>wszystkich</b> wyrazów drugiego kwadratu.'], [poly(padd(P1, P2)), 'Kwadraty trzeba odjąć, nie dodać.'], [poly(padd(D, [0, 0, 2 * s * s])), 'Zły znak przy wyrazie wolnym drugiego kwadratu.'], [poly(pmul([p - r, q - s], [p - r, q - s])), '$a^2-b^2\\neq(a-b)^2$.']]),
      steps: [T`$(${lin(p, q)})^2=${poly(P1)}$, $(${lin(r, s)})^2=${poly(P2)}$.`, T`Różnica (minus zmienia znaki drugiego nawiasu): $${poly(D)}$.`] };
  });
  // (k+√s)² − (k−√s)² = 4k√s  i  (k−√s)² − (√s−k)² = 0  (2306-6, 2308-6, 2608-4)
  reg('kwRoznKwLiczby', ['2306-6', '2308-6', '2608-4'], ['f06-0'], () => {
    const k = R.int(1, 4), s = R.pick([2, 3, 5, 6, 7]), t = R.int(0, 2), rt = T`\sqrt{${s}}`;
    if (t === 0) return { q: T`Wartość wyrażenia $(${k}-${rt})^2-(${rt}-${k})^2$ jest równa`, opts: opts('0', [[opt(T`-${4 * k}${rt}`), T`$(a-b)^2=(b-a)^2$ — obie różnice podniesione do kwadratu dają to samo.`], [String(2 * (k * k + s)), 'Kwadraty trzeba odjąć, a są równe.'], [T`${4 * k}${rt}`, T`$(${k}-${rt})^2$ i $(${rt}-${k})^2$ to ta sama liczba.`], [String(2 * k * k - 2 * s), 'Zgubione wyrazy z pierwiastkiem — a i tak kwadraty są równe.']]), steps: [T`$(a-b)^2=(b-a)^2$, więc oba kwadraty są równe i różnica to $0$.`] };
    const pi = t === 2, x = pi ? '\\pi' : String(k), y = pi ? String(k) : rt, val = pi ? T`${4 * k}\pi` : T`${4 * k}${rt}`;
    return { q: T`Liczba $(${x}+${y})^2-(${x}-${y})^2$ jest równa`, opts: opts(val, [['0', 'Kwadraty nie są równe — różnią się znakiem wyrazu $2ab$.'], [pi ? String(2 * k) : opt(String(-2 * s)), 'Wyrazy $a^2$ i $b^2$ się skracają, zostaje $2ab-(-2ab)=4ab$.'], [pi ? T`${4 * k}\pi+${2 * k * k}` : T`${2 * k}+${2 * k}${rt}`, 'Po odjęciu skracają się oba kwadraty $a^2$ i $b^2$.'], [pi ? T`${2 * k}\pi` : T`${2 * k}${rt}`, 'Podwojony iloczyn: $2ab$ w obu kwadratach — razem $4ab$.']]),
      steps: [T`$(a+b)^2-(a-b)^2=4ab$, gdzie $a=${x}$, $b=${y}$.`, T`Wynik: $${val}$.`] };
  });
  reg('kwMinusPierw', ['2506-4'], ['f06-0', 'f02-2'], () => {
    const s = R.pick([2, 3, 5, 6, 7]), k = R.int(1, 3); // (√s+k)² − √(4k²s) = s + k²
    return { q: T`Liczba $(\sqrt{${s}}+${k})^2-\sqrt{${4 * k * k * s}}$ jest równa`, opts: opts(String(s + k * k), [[T`${s + k * k}-${2 * k}\sqrt{${s}}`, T`Pominięty wyraz $2ab=${2 * k}\sqrt{${s}}$ — a on właśnie skraca się z $\sqrt{${4 * k * k * s}}=${2 * k}\sqrt{${s}}$.`], [T`${s + k * k}-${4 * k}\sqrt{${s}}`, 'Zły znak przy $2ab$: $(a+b)^2=a^2+2ab+b^2$.'], [String(s + k * k - 2 * k), T`$\sqrt{${4 * k * k * s}}=${2 * k}\sqrt{${s}}$, a nie $${2 * k}$.`], [String(s), 'Zgubione $b^2$.']]),
      steps: [T`$(\sqrt{${s}}+${k})^2=${s}+${2 * k}\sqrt{${s}}+${k * k}$, a $\sqrt{${4 * k * k * s}}=${2 * k}\sqrt{${s}}$.`, T`Różnica: $${s + k * k}$.`] };
  });
  reg('kwPodstaw', ['2605-6'], ['f06-0'], () => {
    const a = R.int(2, 7), s = R.pick([2, 3, 5, 7]); // x²+2ax+a² dla x = √s − a
    return { q: T`Wartość wyrażenia $x^2+${2 * a}x+${a * a}$ dla $x=\sqrt{${s}}-${a}$ jest równa`, opts: opts(String(s), [[T`\sqrt{${s}}`, T`$x^2+${2 * a}x+${a * a}=(x+${a})^2$, a $(\sqrt{${s}})^2=${s}$.`], [T`${s}-${4 * a}\sqrt{${s}}`, 'Pomyłka znaku przy podstawianiu — najpierw zwiń wyrażenie do kwadratu.'], [T`${s + a * a * 2}-${2 * a}\sqrt{${s}}`, 'Podstawiając, zgubiono część wyrazów — prościej zwinąć do $(x+' + a + ')^2$.'], [String(s + 2 * a * a), 'Zły znak w $(\\sqrt{' + s + '}-' + a + ')+' + a + '$.']]),
      steps: [T`$x^2+${2 * a}x+${a * a}=(x+${a})^2$.`, T`Dla $x=\sqrt{${s}}-${a}$: $(\sqrt{${s}})^2=${s}$.`] };
  });
  reg('kanonOgolna', ['2608-13.2'], ['f07-5', 'f07-2', 'f06-0'], () => {
    const a = R.pick([-3, -2, -1, 2, 3]), p = R.int(-4, 4) || 1, q = R.int(-5, 5); const G2 = padd(pmul([a], pmul([1, -p], [1, -p])), [q]);
    const fx = T`f(x)=${a === 1 ? '' : a === -1 ? '-' : a}(x${sgn(-p)})^2${q ? sgn(q) : ''}`;
    return { q: T`Funkcja kwadratowa $f$ jest określona wzorem $${fx}$. Wzorem tej funkcji w postaci ogólnej jest`, opts: opts(T`f(x)=${poly(G2)}`, [[T`f(x)=${poly([a, 0, a * p * p + q])}`, 'Pominięty wyraz $-2px$: $(x-p)^2=x^2-2px+p^2$.'], [T`f(x)=${poly([a, -2 * p, a * p * p + q])}`, 'Współczynnik $' + a + '$ mnoży wszystkie wyrazy nawiasu, także $-2px$.'], [T`f(x)=${poly([a, 2 * a * p, a * p * p + q])}`, 'Zły znak wyrazu z $x$.'], [T`f(x)=${poly([a, -2 * a * p, p * p + q])}`, 'Współczynnik $' + a + '$ mnoży też $p^2$.']]),
      steps: [T`$(x${sgn(-p)})^2=x^2${sgn(-2 * p)}x+${p * p}$.`, T`$${a}\cdot(x^2${sgn(-2 * p)}x+${p * p})${q ? sgn(q) : ''}=${poly(G2)}$.`] };
  });
  reg('wielomPF', ['2405-8'], ['f06-0'], () => {
    const a = R.int(2, 4), b = R.int(1, 3), c = R.int(2, 5), W = [a, a * b, a * c, 0], r = R.pick([-1, 1, 2, -2]), Wr = a * r ** 3 + a * b * r * r + a * c * r;
    const f1 = R.int(0, 1) ? [T`Wielomian $W$ jest iloczynem wielomianów $F(x)=${a}x$ i $G(x)=${poly([1, b, c])}$.`, true, T`$${a}x(${poly([1, b, c])})=${poly(W)}$.`] : [T`Wielomian $W$ jest iloczynem wielomianów $F(x)=${a}x$ i $G(x)=${poly([1, a * b, a * c])}$.`, false, T`Przed nawias wyłączamy $${a}x$ — w nawiasie zostaje $${poly([1, b, c])}$.`];
    return { pf: [f1, [T`Liczba $${r < 0 ? '(' + r + ')' : r}$ jest rozwiązaniem równania $W(x)=0$.`, Wr === 0, T`$W(${r})=${Wr}$${Wr ? ' — nie zero' : ''}.`]], q: T`Dany jest wielomian $W(x)=${poly(W)}$. Oceń prawdziwość stwierdzeń.`, steps: [f1[2], T`$W(${r})=${Wr}$.`] };
  });
  reg('wielomWspol', ['2406-9'], ['f06-0'], () => {
    const p = R.int(1, 3), q = R.int(1, 4) * R.pick([1, -1]), r = R.int(1, 3), s = R.int(-4, 4) || 1; // (q − p x)² · (r x + s)
    const F = pmul([-p, q], [-p, q]), W = pmul(F, [r, s]), sum = W.reduce((a, b) => a + b, 0);
    return { q: T`Wielomian $W(x)=ax^3+bx^2+cx+d$ jest iloczynem wielomianów $F(x)=(${poly([-p, q]).replace(/^(-?\d*)x(.*)$/, (m0) => m0)})^2$ i $G(x)=${lin(r, s)}$. Suma $a+b+c+d$ jest równa`, opts: opts(no(sum), [[no(W[W.length - 1]), 'To tylko wyraz wolny $d=W(0)$, a suma współczynników to $W(1)$.'], [no(W.reduce((a2, b2, i) => a2 + b2 * (i % 2 ? -1 : 1) * ((W.length - 1) % 2 ? -1 : 1), 0)), 'To $W(-1)$, a suma współczynników to $W(1)$.'], [no(W[0]), 'To tylko współczynnik $a$.'], [no(sum + 2), 'Sprawdź rachunek $F(1)\\cdot G(1)$.']]),
      steps: [T`Suma współczynników to $W(1)=F(1)\cdot G(1)$.`, T`$F(1)=(${q - p})^2=${(q - p) ** 2}$, $G(1)=${r + s}$, więc $W(1)=${sum}$.`] };
  });
  reg('wielomDzial', ['2606-6'], ['f06-0'], () => {
    const k = R.int(1, 3), c = R.int(1, 3) * R.pick([1, -1]), h = R.int(1, 4) * R.pick([1, -1]); // W = x^4, V = x^3 + c, H = x + h
    const Wp = [1, 0, 0, 0, 0], V = [1, 0, 0, c], H = [1, h], P = pmul(V, H), D = padd(Wp, pneg(P)); void k;
    return { q: T`Dane są wielomiany $W(x)=x^4$, $V(x)=${poly(V)}$, $H(x)=${poly(H)}$. Wielomian $W(x)-V(x)\cdot H(x)$ jest określony wzorem`, opts: opts(poly(D), [[poly(padd(Wp, P)), 'Iloczyn trzeba odjąć.'], [poly(padd(Wp, pneg(padd(P, [0, 0, 0, 0, 2 * P[4]])))), 'Minus zmienia znak każdego wyrazu iloczynu, także wyrazu wolnego.'], [poly(padd(D, [0, 0, 0, -2 * D[3], 0])), 'Zły znak wyrazu z $x$.'], [poly(padd(Wp, pneg(padd(V, H)))), 'Wielomiany $V$ i $H$ trzeba pomnożyć, nie dodać.']]),
      steps: [T`$V(x)\cdot H(x)=(${poly(V)})(${poly(H)})=${poly(P)}$.`, T`$x^4-(${poly(P)})=${poly(D)}$.`] };
  });
  reg('wielomRozklad', ['2606-4'], ['f06-0'], () => {
    const a = R.int(1, 4), sq = R.int(0, 1) === 1; const P = sq ? pmul([1, 0], pmul([1, -a], [1, -a])) : pmul([1, 0], pmul([1, -a], [1, a]));
    const c1 = sq ? T`x(x-${a})^2` : T`x(x-${a})(x+${a})`;
    return { q: T`Dla każdej liczby rzeczywistej $x$ wartość wyrażenia $${poly(P)}$ jest równa wartości wyrażenia`, opts: opts(c1, [[sq ? T`x(x-${a})(x+${a})` : T`x(x-${a})^2`, sq ? 'To $x(x^2-' + a * a + ')$ — brakuje wyrazu z $x^2$.' : 'Kwadrat różnicy ma wyraz $-2ax$, którego tu nie ma.'], [T`(x-${a})(x^2+${a * a})`, 'Rozłóż najpierw, wyłączając $x$ przed nawias.'], [sq ? T`(x+${a})(x-${a})^2` : T`x(x+${a})^2`, 'Sprawdź, mnożąc nawiasy — wychodzi inny wielomian.'], [T`x(x+${a})^2`, 'Zły znak w nawiasie.']]),
      steps: [T`$${poly(P)}=x(${poly(P.slice(0, -1))})$.`, sq ? T`$${poly(P.slice(0, -1))}=(x-${a})^2$ — wzór na kwadrat różnicy.` : T`$x^2-${a * a}=(x-${a})(x+${a})$ — różnica kwadratów.`] };
  });
  // wyrażenia wymierne: mnożenie / dzielenie / odejmowanie (2406-8, 2505-8, 2306-7, 2608-8, 2308-7)
  reg('wymierne', ['2406-8', '2505-8', '2306-7', '2608-8', '2308-7'], ['f06-0'], () => {
    const t = R.int(0, 2), a = R.int(1, 4);
    if (t === 0) { // (x²+ax)/(x+a)² · (x+a)/x = 1  … wersja: (x²+x)/(x+2)² · (x+2)/x = (x+1)/(x+2)
      const b = R.int(1, 5); if (a === b) return null;
      return { q: T`Dla każdej liczby $x$ różnej od $0$ i $${-a}$ wartość wyrażenia $\dfrac{x^2+${b === 1 ? '' : b}x}{(x+${a})^2}\cdot\dfrac{x+${a}}{x}$ jest równa wartości wyrażenia`, opts: opts(T`\frac{x+${b}}{x+${a}}`, [[T`\frac{x+${b}}{(x+${a})^2}`, 'Jeden czynnik $(x+' + a + ')$ skraca się z licznikiem drugiego ułamka.'], [T`\frac{x^2+${b}}{x+${a}}`, 'Wyłącz $x$ z licznika: $x^2+' + b + 'x=x(x+' + b + ')$ — i dopiero skracaj.'], [T`\frac{${b === 1 ? '' : b}x}{x+${a}}`, 'Nie wolno skracać składnika sumy — tylko czynnik iloczynu.'], [T`\frac{x+${b}}{${a}x+${a * a}}`, 'Sprawdź, co zostaje w mianowniku po skróceniu.']]),
        steps: [T`$x^2+${b === 1 ? '' : b}x=x(x+${b})$.`, T`$\frac{x(x+${b})}{(x+${a})^2}\cdot\frac{x+${a}}{x}=\frac{x+${b}}{x+${a}}$.`] };
    }
    if (t === 1) { // 4/(x²+2x) : 5x/(4−x²)
      const m = R.int(2, 5), n = R.int(2, 6), num = m; // m/(x(x+a)) : n x / (a²−x²) = m(a−x)(a+x)/(x(x+a)·n x) = m(a−x)/(n x²)
      return { q: T`Dla każdej liczby $x$ różnej od $${-a}$, $0$ i $${a}$ wartość wyrażenia $\dfrac{${num}}{x^2+${a === 1 ? '' : a}x}:\dfrac{${n}x}{${a * a}-x^2}$ jest równa wartości wyrażenia`, opts: opts(T`\frac{${m * a}-${m}x}{${n}x^2}`, [[T`\frac{${m}x-${m * a}}{${n}x^2}`, T`$${a * a}-x^2=(${a}-x)(${a}+x)$, a nie $(x-${a})(x+${a})$ — zły znak.`], [T`\frac{${m * n}}{(x+${a})^2(${a}-x)}`, 'Dzielenie to mnożenie przez <b>odwrotność</b> drugiego ułamka.'], [T`\frac{${m}}{${n}x^2}`, 'Zgubiony czynnik $(' + a + '-x)$ po skróceniu.']]),
        steps: [T`$x^2+${a === 1 ? '' : a}x=x(x+${a})$, $${a * a}-x^2=(${a}-x)(${a}+x)$.`, T`$\frac{${m}}{x(x+${a})}\cdot\frac{(${a}-x)(${a}+x)}{${n}x}=\frac{${m}(${a}-x)}{${n}x^2}$.`] };
    }
    // 1/(kx) − x
    const k = R.int(2, 5);
    return { q: T`Dla każdej liczby $x\neq0$ wartość wyrażenia $\dfrac{1}{${k}x}-x$ jest równa wartości wyrażenia`, opts: opts(T`\frac{1-${k}x^2}{${k}x}`, [[T`\frac{1-x}{${k}x}`, 'Sprowadzając do wspólnego mianownika, $x$ trzeba pomnożyć przez $' + k + 'x$.'], [T`\frac{1}{x}`, 'Odejmowanie ułamków wymaga wspólnego mianownika.'], [T`-\frac{1}{${k}x}`, 'To nie jest wynik odejmowania.'], [T`\frac{1-${k}x}{${k}x}`, '$x=\\frac{' + k + 'x^2}{' + k + 'x}$, więc w liczniku jest $x^2$.']]),
      steps: [T`$x=\frac{${k}x^2}{${k}x}$, więc $\frac{1}{${k}x}-\frac{${k}x^2}{${k}x}=\frac{1-${k}x^2}{${k}x}$.`] };
  });

  /* =================== DZIAŁ III: równania i nierówności =================== */
  reg('rownProp', ['2605-9'], ['f02-4'], () => {
    const p = R.int(1, 5), q = R.int(2, 7); if (gcd(p, q) !== 1 || p === q) return null;
    const x0 = R.int(-3, 12), b = R.int(1, 4), c = R.int(-5, 5); // (x+a)/(bx−c) = p/q, dobieramy a: q(x0+a) = p(b x0 − c)
    const aNum = p * (b * x0 - c) - q * x0; if (aNum % q) return null; const a = aNum / q; if (!a || b * x0 - c === 0) return null;
    // błędy: mnożenie „na krzyż” źle
    const w1 = Q(p * (-c) - q * a, q - p * b), w2 = Q(p * c - q * a, q - p * b);
    return { q: T`Rozwiązaniem równania $\dfrac{x${sgn(a)}}{${lin(b, -c)}}=\dfrac{${p}}{${q}}$ jest liczba`, opts: opts(no(x0), [[w1.d && !qeq(w1, Q(x0)) ? qo(w1) : null, 'Mnożąc „na krzyż”: $' + q + '(x' + sgn(a) + ')=' + p + '(' + lin(b, -c) + ')$ — sprawdź znaki po przeniesieniu.'], [w2.d ? qo(w2) : null, 'Zły znak przy wyrazie wolnym mianownika.'], [qo(Q(q * a, p)), 'Nie wolno „skreślać” $x$ — trzeba pomnożyć na krzyż.'], [no(x0 + 1), 'Sprawdź, podstawiając wynik do równania.'], [no(-x0), 'Zły znak wyniku.']]),
      steps: [T`$${q}(x${sgn(a)})=${p}(${lin(b, -c)})$`, T`$${q}x${sgn(q * a)}=${p * b}x${sgn(-p * c)}$, więc $x=${x0}$.`] };
  });
  // nierówność liniowa → przedział (2305-6, 2405-6, 2408-5, 2508-7)
  reg('nierLin', ['2305-6', '2405-6', '2408-5', '2508-7'], ['f02-4'], () => {
    // a·(x + b) ≤ (c − x)/d  →  przekształcenie; liczymy ogólnie: L(x) = α x + β, nierówność L(x) ≤ 0
    const x0 = R.int(-8, 8), al = R.pick([-3, -2, -1, 2, 3]), d = R.pick([2, 3, 5]), sym = R.pick(['\\leq', '\\geq', '<', '>']);
    // lewa: al(x − x0)·d/… zapis: al(x + m) sym (n − x)/d  z m, n dobranymi tak, by granica = x0
    const m = R.int(-5, 5), n = d * al * (x0 + m) + x0; // al(x0+m) = (n − x0)/d
    const coef = al * d + 1; // al d x + al d m sym n − x  →  (al d + 1) x sym n − al d m
    if (coef === 0) return null;
    const keep = coef > 0, closed = sym === '\\leq' || sym === '\\geq', le = sym === '\\leq' || sym === '<';
    const right = keep ? le : !le; // x ≤ x0 → (−∞, x0]
    const ans = right ? iv(-Infinity, x0, 0, closed) : iv(x0, Infinity, closed, 0), flip = right ? iv(x0, Infinity, closed, 0) : iv(-Infinity, x0, 0, closed);
    return { q: T`Zbiorem wszystkich rozwiązań nierówności $${al}(x${m ? sgn(m) : ''})${sym}\dfrac{${n}-x}{${d}}$ jest przedział`, opts: opts(ans, [[flip, coef < 0 ? 'Dzieląc przez liczbę ujemną, trzeba zmienić kierunek nierówności.' : 'Zły kierunek — sprawdź, podstawiając np. $x=' + (x0 + 10) + '$.'], [right ? iv(-Infinity, -x0, 0, closed) : iv(-x0, Infinity, closed, 0), 'Zły znak granicy przedziału.'], [right ? iv(-Infinity, x0, 0, !closed) : iv(x0, Infinity, !closed, 0), closed ? 'Nierówność nieostra — koniec przedziału należy do rozwiązań (nawias kwadratowy).' : 'Nierówność ostra — koniec nie należy (nawias okrągły).'], [right ? iv(-x0, Infinity, closed, 0) : iv(-Infinity, -x0, 0, closed), 'Zły znak granicy i zły kierunek.']]),
      steps: [T`Mnożymy obie strony przez $${d}$: $${al * d}(x${m ? sgn(m) : ''})${sym}${n}-x$.`, T`$${coef}x${keep ? sym : { '\\leq': '\\geq', '\\geq': '\\leq', '<': '>', '>': '<' }[sym]}${coef * x0}$ ${coef < 0 ? '(dzielimy przez liczbę ujemną — zmiana kierunku)' : ''} $\Rightarrow x${right ? (closed ? '\\leq' : '<') : closed ? '\\geq' : '>'}${x0}$.`] };
  });
  // liczby całkowite spełniające nierówność liniową (2406-6, 2506-6, 2608-6, 2306-16)
  reg('nierLinCalk', ['2406-6', '2506-6', '2608-6', '2306-16'], ['f08-1'], () => {
    const kind = R.int(0, 2), a = R.pick([2, 3, 5, 7]), b = R.int(-9, 9), c = R.pick([2, 3, 4, 5, 6, 12]), dd = R.int(1, 5);
    // (a x + b)/c  ?  d   →  a x ? c d − b  → granica g = (c d − b)/a
    const g = (c * dd - b) / a; if (Number.isInteger(g)) return null;
    if (kind === 0) { const hi = Math.floor(g); if (hi < 2) return null; return { q: T`Liczba wszystkich całkowitych dodatnich rozwiązań nierówności $\dfrac{${lin(a, b)}}{${c}}<${dd}$ jest równa`, opts: opts(String(hi), [[String(hi + 1), 'Granica $' + dec(+g.toFixed(2)) + '$ nie jest całkowita — największa całkowita spełniająca to $' + hi + '$.'], [String(hi - 1), 'Policz jeszcze raz: od $1$ do $' + hi + '$.'], [String(Math.floor((c * dd + b) / a) > 0 && Math.floor((c * dd + b) / a) !== hi ? Math.floor((c * dd + b) / a) : hi + 2), 'Zły znak przy przenoszeniu wyrazu wolnego.'], [String(c * dd), 'Trzeba rozwiązać nierówność, a nie tylko pomnożyć.']]), steps: [T`$${lin(a, b)}<${c * dd}\iff x<${qt(Q(c * dd - b, a))}\approx ${dec(+g.toFixed(2))}$.`, T`Dodatnie liczby całkowite: $1,\ldots,${hi}$ — jest ich $${hi}$.`] }; }
    if (kind === 1) { const hi = Math.floor(g); return { q: T`Największą liczbą całkowitą spełniającą nierówność $\dfrac{${lin(a, b)}}{${c}}\leq ${dd}$ jest`, opts: opts(no(hi), [[no(hi + 1), 'Ta liczba już nie spełnia nierówności — sprawdź, podstawiając.'], [no(Math.ceil(g) + 1), 'Szukamy największej liczby <b>nie większej</b> od granicy.'], [no(hi - 1), 'Istnieje większa liczba całkowita spełniająca nierówność.'], [no(Math.round(c * dd / a)), 'Zgubiony wyraz wolny licznika.']]), steps: [T`$${lin(a, b)}\leq ${c * dd}\iff x\leq ${qt(Q(c * dd - b, a))}\approx ${dec(+g.toFixed(2))}$.`, T`Największa liczba całkowita: $${hi}$.`] }; }
    const lo = Math.ceil(g); return { q: T`Najmniejszą liczbą całkowitą spełniającą nierówność $\dfrac{${lin(a, b)}}{${c}}\geq ${dd}$ jest`, opts: opts(no(lo), [[no(lo - 1), 'Ta liczba nie spełnia nierówności — granica to $' + dec(+g.toFixed(2)) + '$.'], [no(lo + 1), 'Istnieje mniejsza liczba całkowita spełniająca nierówność.'], [no(-lo), 'Zły znak.'], [no(Math.floor(g) - 1), 'Szukamy najmniejszej liczby <b>nie mniejszej</b> od granicy.']]), steps: [T`$${lin(a, b)}\geq ${c * dd}\iff x\geq ${qt(Q(c * dd - b, a))}\approx ${dec(+g.toFixed(2))}$.`, T`Najmniejsza liczba całkowita: $${lo}$.`] };
  });
  reg('nierLinOs', ['2505-6'], ['f02-4'], () => {
    const x0 = R.int(-9, 6), a = R.int(2, 5), b = R.int(1, 4), c = R.int(1, 5); // a − b(1 − c x) ≥ c... prościej: p x + q ≥ r x + s z granicą x0
    const p = R.int(2, 6), r = R.int(-3, p - 1), q = R.int(-9, 9), s = (p - r) * x0 + q; void a; void b; void c;
    const strict = R.int(0, 1) === 1, sym = strict ? '>' : '\\geq';
    const pic = (dir, cl) => axis([dir > 0 ? [x0, Infinity, cl, 0] : [-Infinity, x0, 0, cl]], [x0, 0].filter((v, i, ar) => ar.indexOf(v) === i));
    const v = R.shuffle([[pic(1, !strict), true, ''], [pic(-1, !strict), false, 'Zły kierunek — sprawdź, podstawiając dużą liczbę.'], [pic(1, strict), false, strict ? 'Nierówność ostra — pusty koniec.' : 'Nierówność nieostra — pełny koniec.'], [pic(-1, strict), false, 'Zły kierunek i zły koniec.']]);
    return { q: T`Dana jest nierówność $${lin(p, q)}${sym}${lin(r, s)}$. Na którym rysunku zaznaczono zbiór wszystkich jej rozwiązań?`, opts: v.map(([html, ok, why]) => ({ t: '', html, ok, why })), steps: [T`$${p - r}x${sym}${s - q}\iff x${sym}${x0}$.`] };
  });
  reg('nierKwadr', ['2606-7'], ['f07-4', 'f07-6'], () => {
    const a = R.pick([-3, -2, -1, 1, 2]), x1 = R.int(-5, 2), x2 = x1 + R.int(2, 6), gt = R.int(0, 1) === 1;
    const inside = (a < 0) === gt; // a(x−x1)(x−x2) > 0: dla a<0 między pierwiastkami
    const ans = inside ? iv(x1, x2, 0, 0) : T`(-\infty, ${x1})\cup(${x2}, +\infty)`;
    const other = inside ? T`(-\infty, ${x1})\cup(${x2}, +\infty)` : iv(x1, x2, 0, 0);
    return { q: T`Zbiorem wszystkich rozwiązań nierówności $${a === 1 ? '' : a === -1 ? '-' : a}(x${sgn(-x1)})(x${sgn(-x2)})${gt ? '>' : '<'}0$ jest`, opts: opts(ans, [[other, 'Współczynnik $' + a + '$ decyduje o kierunku ramion paraboli — sprawdź, gdzie wartości są ' + (gt ? 'dodatnie.' : 'ujemne.')], [iv(x1, x2, 1, 1), 'Nierówność ostra — końce nie należą.'], [iv(-x2, -x1, 0, 0), 'Miejsca zerowe $(x-a)$ to $a$, nie $-a$.'], [iv(-x2, -x1, 1, 1), 'Złe miejsca zerowe i złe końce.']]),
      steps: [T`Miejsca zerowe: $${x1}$ i $${x2}$; ramiona paraboli skierowane ${a < 0 ? 'w dół' : 'w górę'}.`, T`Wartości ${gt ? 'dodatnie' : 'ujemne'}: $${ans}$.`] };
  });
  // równania wielomianowe w postaci iloczynowej (2305-7, 2505-7, 2506-7, 2508-10, 2605-8, 2608-7)
  reg('rownIloczyn', ['2305-7', '2505-7', '2506-7', '2508-10', '2605-8', '2608-7'], ['f06-0'], () => {
    const t = R.int(0, 2);
    if (t === 0) { // ile rozwiązań: k(x−a)²(x²−b²)=0 lub (x²+c)
      const a = R.int(-4, 4), b = R.int(1, 6), neg = R.int(0, 1), roots = new Set([a]); if (!neg) { roots.add(b); roots.add(-b); }
      const n = roots.size, word = ['', 'jedno rozwiązanie.', 'dwa rozwiązania.', 'trzy rozwiązania.', 'cztery rozwiązania.', 'pięć rozwiązań.'];
      return { q: T`Równanie $${R.int(2, 5)}(x${a ? sgn(-a) : ''})^2(x^2${neg ? '+' : '-'}${b * b})=0$ w zbiorze liczb rzeczywistych ma dokładnie`, opts: opts(T`\text{${word[n]}}`, [[T`\text{${word[n + 1] || 'sześć rozwiązań.'}}`, 'Pierwiastek podwójny $(x' + (a ? sgn(-a) : '') + ')^2$ to jedno rozwiązanie, nie dwa.'], [T`\text{${word[Math.max(1, n - 1)] === word[n] ? word[n + 2] : word[Math.max(1, n - 1)]}}`, neg ? 'Sprawdź, czy $x^2+' + b * b + '=0$ ma rozwiązania.' : 'Równanie $x^2-' + b * b + '=0$ ma dwa rozwiązania: $\\pm' + b + '$.'], [T`\text{${neg ? word[3] : word[5]}}`, neg ? '$x^2+' + b * b + '>0$ — ten czynnik nie daje rozwiązań.' : 'Liczba czynników to nie liczba rozwiązań.'], [T`\text{${word[4]}}`, 'Policz różne rozwiązania.']]),
        steps: [T`$(x${a ? sgn(-a) : ''})^2=0\iff x=${a}$; ${neg ? T`$x^2+${b * b}=0$ nie ma rozwiązań` : T`$x^2-${b * b}=0\iff x=\pm${b}$`}.`, T`Różnych rozwiązań: $${n}$.`] };
    }
    if (t === 1) { // suma rozwiązań (px − q)(r + s x)(x − u) = 0
      const r1 = R.int(-5, 5), r2 = R.int(-5, 5), r3 = R.int(-5, 5); if (new Set([r1, r2, r3]).size < 3) return null;
      const k1 = R.int(2, 4), k2 = R.int(2, 5), sum = r1 + r2 + r3;
      const f1 = T`(${k1}x${sgn(-k1 * r1)})`, f2 = T`(${-k2 * r2 === 0 ? '' : -k2 * r2}${-k2 * r2 === 0 ? '' : '+'}${k2}x)`, f3 = T`(x${sgn(-r3)})`;
      return { q: T`Suma wszystkich rozwiązań równania $${f1}${f2}${f3}=0$ jest równa`, opts: opts(no(sum), [[no(k1 * r1 + (-k2 * r2) / -1 + r3 === sum ? sum + 2 : -sum), 'Rozwiązanie czynnika $(x-a)$ to $a$ — sprawdź znaki.'], [no(-k1 * r1 + k2 * r2 + r3 === sum ? sum + 3 : k1 * r1 - k2 * r2 * -1 + r3), 'Przy czynniku $(kx+m)$ rozwiązaniem jest $-\\frac mk$, a nie $-m$.'], [no(r1 * r2 * r3 === sum ? sum - 1 : r1 * r2 * r3), 'Pytamy o sumę, nie iloczyn.'], [no(sum + 1), 'Policz każde rozwiązanie osobno.']]),
        steps: [T`Rozwiązania: $${r1}$, $${r2}$, $${r3}$.`, T`Suma: $${sum}$.`] };
    }
    // jedno z rozwiązań: k(x²−s)(x+a)=0
    const s = R.pick([2, 3, 5, 7]), a = R.int(1, 6);
    return { q: T`Jednym z rozwiązań równania $\sqrt{${R.pick([2, 3, 5])}}(x^2-${s})(x+${a})=0$ jest liczba`, opts: opts(T`\sqrt{${s}}`, [[String(a), 'Czynnik $(x+' + a + ')$ zeruje się dla $x=-' + a + '$.'], [String(s), '$x^2=' + s + '\\iff x=\\pm\\sqrt{' + s + '}$.'], [T`\sqrt{${s === 2 ? 3 : 2}}`, 'Współczynnik przed nawiasami nie daje rozwiązań.'], [opt(String(-s)), '$x^2=' + s + '$, a nie $x=-' + s + '$.']]),
      steps: [T`Iloczyn jest zerem, gdy któryś czynnik jest zerem: $x^2=${s}$ albo $x=-${a}$.`, T`Rozwiązania: $\pm\sqrt{${s}}$, $-${a}$.`] };
  });
  // równania wymierne — dziedzina! (2305-8, 2306-10, 2308-8, 2405-7, 2408-6)
  reg('rownWymierne', ['2305-8', '2306-10', '2308-8', '2405-7', '2408-6'], ['f06-0'], () => {
    const a = R.int(1, 5), b = R.int(1, 5), c = R.int(1, 6); if (a === b || a === c) return null;
    // (x²−a x)(x+b) / (x²−b²) = 0: licznik zeruje się w 0, a, −b; mianownik w ±b → rozwiązania 0, a (o ile a ≠ b)
    const roots = [0, a, -b].filter(x => Math.abs(x) !== b), n = roots.length;
    const word = ['nie ma rozwiązań.', 'ma dokładnie jedno rozwiązanie.', 'ma dokładnie dwa rozwiązania.', 'ma dokładnie trzy rozwiązania.', 'ma dokładnie cztery rozwiązania.'];
    return { q: T`Równanie $\dfrac{(x^2-${a === 1 ? '' : a}x)(x+${b})}{x^2-${b * b}}=0$ w zbiorze liczb rzeczywistych`, opts: opts(T`\text{${word[n]}}`, [[T`\text{${word[3]}}`, 'Liczba $-' + b + '$ zeruje mianownik — nie należy do dziedziny.'], [T`\text{${word[1]}}`, 'Sprawdź oba czynniki licznika: $x(x-' + a + ')$.'], [T`\text{${word[4]}}`, 'Miejsca zerowe mianownika nie są rozwiązaniami — wręcz przeciwnie, trzeba je wykluczyć.'], [T`\text{${word[0]}}`, 'Licznik ma miejsca zerowe spoza $\\{\\pm' + b + '\\}$.']]),
      steps: [T`Dziedzina: $x\neq\pm${b}$.`, T`Licznik: $x(x-${a})(x+${b})=0\iff x\in\{0,${a},${-b}\}$; $-${b}$ odpada. Rozwiązania: $0$, $${a}$.`] };
  });

  /* =================== DZIAŁ IV: układy równań =================== */
  reg('ukladWykres', ['2305-10', '2405-11', '2408-8'], ['f11-3', 'f11-8'], () => {
    const par = R.int(0, 2) === 0, a1 = R.pick([-2, -1, 1, 2]), b1 = R.int(-3, 3), a2 = par ? a1 : R.pick([-2, -1, 1, 2].filter(v => v !== a1)), b2 = par ? b1 + R.pick([-3, -2, 2, 3]) : R.int(-3, 3);
    if (!par && b1 === b2) return null;
    const S = sys(linEq(a1, b1), linEq(a2, b2));
    return { q: 'Na rysunku przedstawiono interpretację geometryczną jednego z poniższych układów równań.' + plotLines([[a1, b1], [a2, b2]]) + 'Tym układem jest',
      opts: opts(S, [[sys(linEq(-a1, b1), linEq(a2, b2)), 'Pierwsza prosta ' + (a1 > 0 ? 'rośnie' : 'maleje') + ' — współczynnik kierunkowy jest ' + (a1 > 0 ? 'dodatni.' : 'ujemny.')], [sys(linEq(a1, -b1 || 4), linEq(a2, b2)), 'Wyraz wolny to punkt przecięcia z osią $Oy$ — odczytaj go z rysunku.'], [sys(linEq(a1, b1), linEq(-a2, b2)), 'Druga prosta ma przeciwne nachylenie.'], [sys(linEq(a1, b1), linEq(a2, -b2 || 4)), 'Sprawdź, gdzie druga prosta przecina oś $Oy$.']]),
      steps: [T`Wyraz wolny $b$ odczytujemy z osi $Oy$, współczynnik $a$ — z nachylenia (o ile rośnie $y$, gdy $x$ rośnie o 1).`, T`Proste: $${linEq(a1, b1)}$ i $${linEq(a2, b2)}$${par ? ' — równoległe, bo mają ten sam współczynnik $a$' : ''}.`] };
  });
  reg('ukladPunkt', ['2308-10'], ['f11-3'], () => {
    const x = R.int(-8, 8), y = R.int(-8, 8); const mk = () => { const p = R.int(-3, 3) || 1, q = R.int(-3, 3) || 1; return [p, q, p * x + q * y]; };
    const e = ([p, q, r]) => T`${poly([p, 0]).replace('x', 'x')}${q < 0 ? '-' : '+'}${Math.abs(q) === 1 ? '' : Math.abs(q)}y=${r}`;
    const good = [mk(), mk()]; if (good[0][0] * good[1][1] === good[0][1] * good[1][0]) return null;
    const bad = k => { const g = mk(); g[2] += k; return g; };
    return { q: T`W kartezjańskim układzie współrzędnych punkt $(${x},${y})$ jest punktem przecięcia prostych o równaniach`, opts: opts(T`${e(good[0])}\ \text{i}\ ${e(good[1])}`, [[T`${e(good[0])}\ \text{i}\ ${e(bad(2))}`, 'Punkt musi spełniać <b>oba</b> równania — podstaw do drugiego.'], [T`${e(bad(-3))}\ \text{i}\ ${e(good[1])}`, 'Pierwsze równanie nie jest spełnione przez ten punkt.'], [T`${e(bad(1))}\ \text{i}\ ${e(bad(4))}`, 'Żadne z równań nie jest spełnione.'], [T`${e([good[0][1], good[0][0], good[0][2]])}\ \text{i}\ ${e(good[1])}`, 'Zamienione współrzędne $x$ i $y$.']]),
      steps: [T`Podstawiamy $x=${x}$, $y=${y}$ do każdej pary — oba równania muszą być spełnione.`] };
  });
  reg('ukladIle', ['2406-7'], null, () => {
    const p = R.int(1, 3), q = R.int(-4, 4) || 2, r = R.int(-6, 6), k = R.pick([-4, -3, -2, 2, 3]), t = R.int(0, 2);
    const e2 = t === 0 ? [k * p, k * q, k * r] : t === 1 ? [k * p, k * q, k * r + R.pick([-2, 1, 3])] : [k * p + 1, k * q, k * r];
    const E = ([a, b, c]) => T`${poly([a, 0])}${b < 0 ? '-' : '+'}${Math.abs(b) === 1 ? '' : Math.abs(b)}y=${c}`;
    const ans = ['\\text{ma nieskończenie wiele rozwiązań.}', '\\text{nie ma rozwiązań.}', '\\text{ma dokładnie jedno rozwiązanie.}'][t];
    return { q: T`Układ równań $${sys(E([p, q, r]), E(e2))}$`, opts: opts(ans, [['\\text{ma dokładnie dwa rozwiązania.}', 'Układ dwóch równań liniowych ma 0, 1 albo nieskończenie wiele rozwiązań — nigdy dokładnie dwa.'], ...['\\text{ma nieskończenie wiele rozwiązań.}', '\\text{nie ma rozwiązań.}', '\\text{ma dokładnie jedno rozwiązanie.}'].filter(x => x !== ans).map(x => [x, t === 0 ? 'Drugie równanie to pierwsze pomnożone przez $' + k + '$ — to ta sama prosta.' : t === 1 ? 'Lewe strony są proporcjonalne, prawe nie — proste równoległe, rozłączne.' : 'Współczynniki przy $x$ i $y$ nie są proporcjonalne — proste się przecinają.'])]),
      steps: [t === 0 ? T`Drugie równanie to pierwsze pomnożone przez $${k}$ — ta sama prosta, nieskończenie wiele rozwiązań.` : t === 1 ? 'Lewe strony proporcjonalne, prawe nie — proste równoległe rozłączne, brak rozwiązań.' : 'Współczynniki nie są proporcjonalne — proste przecinają się w jednym punkcie.'] };
  });
  reg('ukladTresc', ['2405-10', '2606-9', '2305-11'], null, () => {
    const t = R.int(0, 1);
    if (t === 0) { const N = R.int(150, 400), k = R.int(10, 40), m = R.pick([2, 3, 4]);
      return { q: T`W parku rosną drzewa iglaste i liściaste — łącznie $${N}$. Gdyby drzew iglastych było o $${k}$ więcej, to liściastych byłoby $${m}$ razy więcej niż iglastych. Niech $x$ — liczba drzew iglastych, $y$ — liściastych. Układem równań opisującym tę sytuację jest`,
        opts: opts(sys(T`x+y=${N}`, T`y=${m}(x+${k})`), [[sys(T`x+y=${N}`, T`x+${k}=${m}y`), 'Zamienione role: to liściastych byłoby $' + m + '$ razy więcej.'], [sys(T`x+y=${N}`, T`y=${m}x+${k}`), 'Najpierw dodajemy $' + k + '$ do liczby iglastych, potem mnożymy — potrzebny nawias.'], [sys(T`x+y=${N}`, T`${m}y=x+${k}`), 'To znaczy, że iglastych byłoby więcej.'], [sys(T`x-y=${N}`, T`y=${m}(x+${k})`), 'Łączna liczba to suma.']]),
        steps: [T`Razem: $x+y=${N}$. Po dodaniu $${k}$ iglastych: $x+${k}$; liściastych jest $${m}$ razy więcej: $y=${m}(x+${k})$.`] };
    }
    const P = R.pick([20, 24, 30, 36, 40]), d = R.int(2, 6);
    return { q: T`Obwód prostokąta o bokach $a>b$ jest równy $${P}$, a jeden bok jest o $${d}$ krótszy od drugiego. Układem równań opisującym tę sytuację jest`,
      opts: opts(sys(T`2a+2b=${P}`, T`a-b=${d}`), [[sys(T`2ab=${P}`, T`a-b=${d}`), '$2ab$ to nie obwód — obwód to suma boków.'], [sys(T`a+b=${P}`, T`a=b+${d}`), 'Obwód to $2a+2b$, a nie $a+b$.'], [sys(T`2a+2b=${P}`, T`b=${d}a`), '„O $' + d + '$ krótszy” to różnica, nie iloraz.'], [sys(T`2a+b=${P}`, T`a=${d}b`), 'Obwód: $2a+2b$; różnica boków: $a-b=' + d + '$.']]),
      steps: [T`Obwód: $2a+2b=${P}$; różnica boków: $a-b=${d}$.`] };
  });

  /* =================== DZIAŁ V: funkcje =================== */
  // rysunek wykresu: łamana (węzły [x,y]) z kółkami na końcach albo parabola
  function plotFn(f, o) {
    const S = 17, X0 = o.xmin ?? -7, X1 = o.xmax ?? 7, Y0 = o.ymin ?? -6, Y1 = o.ymax ?? 6, W = (X1 - X0) * S + 20, H = (Y1 - Y0) * S + 20;
    const px = x => 10 + (x - X0) * S, py = y => 10 + (Y1 - y) * S;
    let s = `<svg class="maxis mplot" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img">`;
    for (let x = X0; x <= X1; x++) s += `<line x1="${px(x)}" y1="${py(Y1)}" x2="${px(x)}" y2="${py(Y0)}" stroke="currentColor" stroke-opacity=".12"/>`;
    for (let y = Y0; y <= Y1; y++) s += `<line x1="${px(X0)}" y1="${py(y)}" x2="${px(X1)}" y2="${py(y)}" stroke="currentColor" stroke-opacity=".12"/>`;
    s += `<line x1="${px(X0) - 4}" y1="${py(0)}" x2="${px(X1) + 6}" y2="${py(0)}" stroke="currentColor"/><line x1="${px(0)}" y1="${py(Y0) + 4}" x2="${px(0)}" y2="${py(Y1) - 6}" stroke="currentColor"/>`;
    s += `<text x="${px(X1) + 2}" y="${py(0) - 5}" font-size="11" font-style="italic" fill="currentColor">x</text><text x="${px(0) + 5}" y="${py(Y1) + 2}" font-size="11" font-style="italic" fill="currentColor">y</text>`;
    for (let x = X0; x <= X1; x++) if (x && x % (o.step || 1) === 0) s += `<text x="${px(x)}" y="${py(0) + 12}" font-size="9" text-anchor="middle" fill="currentColor">${x < 0 ? '−' + -x : x}</text>`;
    for (let y = Y0; y <= Y1; y++) if (y && y % (o.step || 1) === 0) s += `<text x="${px(0) - 4}" y="${py(y) + 3}" font-size="9" text-anchor="end" fill="currentColor">${y < 0 ? '−' + -y : y}</text>`;
    s += `<text x="${px(0) - 4}" y="${py(0) + 12}" font-size="9" text-anchor="end" fill="currentColor">0</text>`;
    if (f.nodes) { s += `<polyline points="${f.nodes.map(([x, y]) => px(x) + ',' + py(y)).join(' ')}" fill="none" stroke="#7b3fbf" stroke-width="2.4" stroke-linejoin="round"/>`; for (const [x, y, c] of [[...f.nodes[0], f.c0], [...f.nodes[f.nodes.length - 1], f.c1]]) s += `<circle cx="${px(x)}" cy="${py(y)}" r="3.6" fill="${c ? '#7b3fbf' : '#fff'}" stroke="#7b3fbf" stroke-width="1.8"/>`; }
    const cid = 'mc' + Math.random().toString(36).slice(2, 8); s += `<clipPath id="${cid}"><rect x="${px(X0)}" y="${py(Y1)}" width="${px(X1) - px(X0)}" height="${py(Y0) - py(Y1)}"/></clipPath>`;
    if (f.fn) { const pts = []; for (let x = X0; x <= X1 + 1e-9; x += 0.1) { const y = f.fn(x); if (y >= Y0 - 0.5 && y <= Y1 + 0.5) pts.push(px(x).toFixed(1) + ',' + py(y).toFixed(1)); } s += `<polyline points="${pts.join(' ')}" fill="none" stroke="#7b3fbf" stroke-width="2.4" clip-path="url(#${cid})"/>`; }
    return `<div class="mplotw">${s}</svg></div>`;
  }
  // losowa ciągła łamana o całkowitych węzłach
  function randPL() {
    for (let t = 0; t < 200; t++) {
      const k = R.int(3, 4), xs = [R.int(-6, -3)]; for (let i = 0; i < k; i++) xs.push(xs[i] + R.int(1, 4)); if (xs[k] > 6) continue;
      const ys = xs.map(() => R.int(-4, 5)); let ok = true; for (let i = 0; i < k; i++) { const dy = ys[i + 1] - ys[i], dx = xs[i + 1] - xs[i]; if (dy % dx && dy !== 0) { if ((ys[i] <= 0 && ys[i + 1] >= 0) || (ys[i] >= 0 && ys[i + 1] <= 0)) ok = false; } if (i && (ys[i] - ys[i - 1]) * (ys[i + 1] - ys[i]) > 0 && (ys[i] - ys[i - 1]) / (xs[i] - xs[i - 1]) === (ys[i + 1] - ys[i]) / (xs[i + 1] - xs[i])) ok = false; }
      if (!ok || new Set(ys).size < 3) continue;
      const f = { nodes: xs.map((x, i) => [x, ys[i]]), c0: R.int(0, 1) === 1, c1: R.int(0, 1) === 1 };
      f.at = x => { for (let i = 0; i < k; i++) if (x >= xs[i] && x <= xs[i + 1]) return ys[i] + (ys[i + 1] - ys[i]) * (x - xs[i]) / (xs[i + 1] - xs[i]); return NaN; };
      f.inD = x => (x > xs[0] && x < xs[k]) || (x === xs[0] && f.c0) || (x === xs[k] && f.c1);
      f.a = xs[0]; f.b = xs[k]; return f;
    }
    return null;
  }
  // zbiór {x ∈ D: pred(f(x))} jako suma przedziałów — próbkowanie co 1/4 (węzły i przecięcia są całkowite)
  function setOf(f, pred) {
    const pts = []; for (let x = f.a; x <= f.b + 1e-9; x += 0.25) pts.push(+x.toFixed(2));
    const iv2 = []; let cur = null;
    for (const x of pts) { const ok = f.inD(x) && pred(f.at(x)); if (ok) { if (!cur) cur = { a: x, ca: true }; cur.b = x; cur.cb = true; } else if (cur) { iv2.push(cur); cur = null; } }
    if (cur) iv2.push(cur);
    // granice niecałkowite (sąsiedzi punktów wykluczonych) -> otwarte końce w liczbie całkowitej
    return iv2.map(I => { const a = Math.round(I.a * 4) / 4, b = I.b; const A2 = Number.isInteger(a) ? a : Math.floor(a), B2 = Number.isInteger(b) ? b : Math.ceil(b); return { a: A2, b: B2, ca: Number.isInteger(I.a), cb: Number.isInteger(I.b) }; });
  }
  const ivT = I => (I.length ? I.map(i => (i.a === i.b ? `\\{${i.a}\\}` : (i.ca ? '[' : '(') + i.a + ', ' + i.b + (i.cb ? ']' : ')'))).join('\\cup ') : '\\emptyset');
  const fRange = f => { const ys = f.nodes.map(n => n[1]); const mn = Math.min(...ys), mx = Math.max(...ys); const att = v => f.nodes.some(([x, y]) => y === v && f.inD(x)); return { mn, mx, cmn: att(mn), cmx: att(mx) }; };
  reg('wykresLamana', ['2508-12.1', '2605-12.1', '2606-12.2', '2305-12.1', '2305-12.2', '2305-12.3', '2306-13.2', '2308-14.1', '2308-14.2', '2406-11.1', '2306-13.1', '2508-12.2', '2605-12.2', '2606-12.1', '2608-11', '2505-11', '2506-10'], null, () => {
    const f = randPL(); if (!f) return null; const pic = plotFn(f, {}), t = R.int(0, 6), rg = fRange(f), D = { a: f.a, b: f.b, ca: f.c0, cb: f.c1 };
    const head = 'Na rysunku przedstawiono wykres funkcji $y=f(x)$.' + pic;
    if (t === 0) return { q: head + 'Dziedziną funkcji $f$ jest', opts: opts(ivT([D]), [[ivT([{ a: rg.mn, b: rg.mx, ca: rg.cmn, cb: rg.cmx }]), 'To zbiór wartości (oś $Oy$), a dziedzina to argumenty — oś $Ox$.'], [ivT([{ ...D, ca: !D.ca }]), 'Pusty kółek oznacza, że koniec nie należy do wykresu — nawias okrągły.'], [ivT([{ ...D, cb: !D.cb }]), 'Sprawdź prawy koniec: pełne kółko — nawias kwadratowy, puste — okrągły.'], [ivT([{ ...D, ca: !D.ca, cb: !D.cb }]), 'Oba końce mają zły nawias.']]), steps: [T`Dziedzina to rzut wykresu na oś $Ox$: od $${f.a}$ do $${f.b}$; ${f.c0 ? 'lewy koniec należy' : 'lewy koniec nie należy'}, ${f.c1 ? 'prawy należy' : 'prawy nie należy'}.`] };
    if (t === 1) { const W2 = ivT([{ a: rg.mn, b: rg.mx, ca: rg.cmn, cb: rg.cmx }]); return { q: head + 'Zbiorem wartości funkcji $f$ jest', opts: opts(W2, [[ivT([D]), 'To dziedzina (oś $Ox$), a zbiór wartości czytamy z osi $Oy$.'], [ivT([{ a: rg.mn, b: rg.mx, ca: !rg.cmn, cb: rg.cmx }]), 'Sprawdź, czy najmniejsza wartość jest przyjmowana (pełny punkt) czy tylko „dochodzi” do pustego kółka.'], [ivT([{ a: rg.mn, b: rg.mx, ca: rg.cmn, cb: !rg.cmx }]), 'Sprawdź, czy największa wartość jest przyjmowana.'], [ivT([{ a: f.nodes[0][1] < f.nodes[f.nodes.length - 1][1] ? f.nodes[0][1] : f.nodes[f.nodes.length - 1][1], b: Math.max(f.nodes[0][1], f.nodes[f.nodes.length - 1][1]), ca: true, cb: true }]), 'Zbiór wartości to nie wartości na końcach dziedziny — szukamy najniższego i najwyższego punktu.']]), steps: [T`Najniższy punkt wykresu: $y=${rg.mn}$, najwyższy: $y=${rg.mx}$.`, T`Zbiór wartości: $${W2}$.`] }; }
    if (t === 2) { const a = R.int(f.a + 1, f.b - 2), b = R.int(a + 1, f.b - 1); let mx = -99, arg = a; for (let x = a; x <= b; x += 0.25) if (f.at(x) > mx) { mx = f.at(x); arg = x; } if (!Number.isInteger(mx)) return null;
      return { q: head + T`Największa wartość funkcji $f$ w przedziale $[${a}, ${b}]$ jest równa`, opts: opts(no(mx), [[no(rg.mx), 'To największa wartość na całej dziedzinie, a pytamy tylko o przedział $[' + a + ', ' + b + ']$.'], [no(arg), 'To argument (współrzędna $x$), a nie wartość.'], [no(f.at(b)), 'Wartość na końcu przedziału nie musi być największa.'], [no(f.at(a)), 'Wartość na początku przedziału nie musi być największa.'], [no(mx + 1), 'Odczytaj dokładnie z siatki.']]), steps: [T`W przedziale $[${a}, ${b}]$ najwyżej leży punkt $(${arg}, ${mx})$.`] }; }
    if (t === 3) { // monotoniczność
      const segs = []; for (let i = 0; i + 1 < f.nodes.length; i++) { const d = Math.sign(f.nodes[i + 1][1] - f.nodes[i][1]); const last = segs[segs.length - 1]; if (last && last.d === d) last.b = f.nodes[i + 1][0]; else segs.push({ a: f.nodes[i][0], b: f.nodes[i + 1][0], d }); }
      const dec = R.int(0, 1) ? -1 : 1, good = segs.filter(s2 => s2.d === dec), bad = segs.filter(s2 => s2.d === -dec); if (!good.length || !bad.length) return null;
      const g = R.pick(good), b2 = R.pick(bad), all = segs.length > 1 ? { a: segs[0].a, b: segs[1].b } : null;
      const ivx = s2 => `[${s2.a}, ${s2.b}]`;
      return { q: head + T`Funkcja $f$ jest ${dec < 0 ? 'malejąca' : 'rosnąca'} w przedziale`, opts: opts(ivx(g), [[ivx(b2), dec < 0 ? 'W tym przedziale wykres idzie w górę — funkcja rośnie.' : 'W tym przedziale wykres idzie w dół — funkcja maleje.'], [all && (all.a !== g.a || all.b !== g.b) ? ivx(all) : null, 'Ten przedział zawiera punkt, w którym funkcja zmienia monotoniczność.'], [ivx({ a: Math.min(...f.nodes.map(n => n[1])), b: Math.max(...f.nodes.map(n => n[1])) }), 'Przedziały monotoniczności czytamy na osi $Ox$, nie $Oy$.'], [ivx({ a: g.a - 1, b: g.b }), 'Sprawdź lewy koniec przedziału na rysunku.'], [ivx({ a: f.a, b: f.b }), 'Na całej dziedzinie funkcja nie jest monotoniczna.']]), steps: [T`Wykres ${dec < 0 ? 'opada' : 'wznosi się'} m.in. dla $x\in[${g.a}, ${g.b}]$.`] };
    }
    if (t === 4) { const z = setOf(f, y => Math.abs(y) < 1e-9).filter(I => I.a === I.b).map(I => I.a); if (!z.length || z.length > 3) return null; const zs = z.join(',\\ ');
      const y0 = f.inD(0) ? f.at(0) : null;
      return { q: head + 'Wszystkimi miejscami zerowymi funkcji $f$ są liczby', opts: opts(zs, [[y0 != null && Number.isInteger(y0) && !z.includes(y0) ? String(y0) : null, 'To $f(0)$ — punkt przecięcia z osią $Oy$, a nie miejsce zerowe.'], [z.length > 1 ? z.slice(1).join(',\\ ') : null, 'Brakuje jednego miejsca zerowego.'], [z.map(v => -v).join(',\\ ') !== zs ? z.map(v => -v).join(',\\ ') : null, 'Zły znak — odczytaj z osi $Ox$.'], [zs + ',\\ ' + (z[z.length - 1] + 2), 'Ta liczba nie jest miejscem zerowym.'], [String(z[0] + 1), 'Odczytaj dokładnie z siatki.']]), steps: [T`Miejsca zerowe to punkty wspólne wykresu z osią $Ox$: $${zs}$.`] }; }
    if (t === 5) { const c = R.int(rg.mn + 1, rg.mx - 1); for (let i = 0; i + 1 < f.nodes.length; i++) { const [x1, y1] = f.nodes[i], [x2, y2] = f.nodes[i + 1]; if ((y1 - c) * (y2 - c) < 0 && ((c - y1) * (x2 - x1)) % (y2 - y1)) return null; } const gt = R.int(0, 1) === 1, P = gt ? (y => y > c + 1e-9) : (y => y < c - 1e-9), I = setOf(f, P); if (!I.length) return null;
      const Iq = setOf(f, gt ? (y => y >= c - 1e-9) : (y => y <= c + 1e-9)), Ic = setOf(f, gt ? (y => y < c - 1e-9) : (y => y > c + 1e-9));
      return { q: head + T`Zbiorem wszystkich rozwiązań nierówności $f(x)${gt ? '>' : '<'}${c}$ jest`, opts: opts(ivT(I), [[ivT(Iq), 'Nierówność ostra — punkty, w których $f(x)=' + c + '$, nie należą do rozwiązań.'], [ivT(Ic), 'To zbiór, gdzie wykres jest po drugiej stronie prostej $y=' + c + '$.'], [ivT([{ a: c, b: gt ? rg.mx : rg.mn, ca: false, cb: true }].map(x => (x.a > x.b ? { a: x.b, b: x.a, ca: true, cb: false } : x))), 'Rozwiązania nierówności to argumenty ($x$), a nie wartości.'], [ivT(I.map(x => ({ ...x, ca: !x.ca })) ), 'Sprawdź końce przedziałów.']]), steps: [T`Szukamy $x$, dla których wykres leży ${gt ? 'powyżej' : 'poniżej'} prostej $y=${c}$: $${ivT(I)}$.`] }; }
    // t === 6: wartość wyrażenia
    const xa = R.int(f.a + 1, f.b - 1), xb = R.int(f.a + 1, f.b - 1), k = R.int(2, 3), va = f.at(xa), vb = f.at(xb); if (!Number.isInteger(va) || !Number.isInteger(vb) || xa === xb) return null;
    const v = va + k * vb;
    return { q: head + T`Wartość wyrażenia $f(${xa})+${k}\cdot f(${xb})$ jest równa`, opts: opts(no(v), [[no(xa + k * xb), 'Zamiast wartości użyto argumentów.'], [no(va + vb), 'Zapomniany mnożnik $' + k + '$.'], [no(-va + k * vb), 'Sprawdź znak $f(' + xa + ')$.'], [no(k * va + vb), 'Mnożnik dotyczy $f(' + xb + ')$.']]), steps: [T`$f(${xa})=${va}$, $f(${xb})=${vb}$, więc wynik to $${va}+${k}\cdot ${vb < 0 ? '(' + vb + ')' : vb}=${v}$.`] };
  });
  // przekształcenia wykresu: g(x)=f(x+a), f(x)+b, f(−x) — wybór rysunku
  reg('wykresPrzeksz', ['2406-11.2', '2308-14.3', '2405-14.4'], ['f11-13'], () => {
    const f = randPL(); if (!f) return null; const t = R.int(0, 2), a = R.pick([-3, -2, 2, 3]);
    const tr = (g, fx, fy) => ({ nodes: g.nodes.map(([x, y]) => [fx(x), fy(y)]).sort((p, q) => p[0] - q[0]), c0: fx(g.nodes[0][0]) < fx(g.nodes[g.nodes.length - 1][0]) ? g.c0 : g.c1, c1: fx(g.nodes[0][0]) < fx(g.nodes[g.nodes.length - 1][0]) ? g.c1 : g.c0 });
    const V = [[tr(f, x => x - a, y => y), t === 0], [tr(f, x => x + a, y => y), false], [tr(f, x => x, y => y + a), t === 1], [tr(f, x => -x, y => y), t === 2], [tr(f, x => x, y => -y), false]];
    const want = t === 0 ? T`g(x)=f(x${sgn(a)})` : t === 1 ? T`g(x)=f(x)${sgn(a)}` : 'g(x)=f(-x)';
    const pickV = [V[t === 0 ? 0 : t === 1 ? 2 : 3]].concat(R.shuffle(V.filter((v, i) => i !== (t === 0 ? 0 : t === 1 ? 2 : 3))).slice(0, 3));
    const fits = g => g.nodes.every(([x, y]) => x >= -7 && x <= 7 && y >= -6 && y <= 6); if (!pickV.every(([g]) => fits(g))) return null;
    const why = g => (g === V[1][0] ? 'Przesunięcie w złą stronę: $f(x+a)$ przesuwa wykres w <b>lewo</b> o $a$, gdy $a>0$.' : g === V[2][0] ? 'To przesunięcie w pionie — $f(x)+b$.' : g === V[3][0] ? 'To odbicie względem osi $Oy$ — $f(-x)$.' : g === V[4][0] ? 'To odbicie względem osi $Ox$ — $-f(x)$.' : 'To przesunięcie w poziomie.');
    return { q: 'Na rysunku przedstawiono wykres funkcji $y=f(x)$.' + plotFn(f, {}) + T`Funkcja $g$ jest określona wzorem $${want}$. Wykres funkcji $g$ przedstawiono na rysunku`,
      opts: R.shuffle(pickV.map(([g], i) => ({ t: '', html: plotFn(g, {}), ok: i === 0, why: i === 0 ? '' : why(g) }))),
      steps: [t === 0 ? T`$f(x${sgn(a)})$ przesuwa wykres o $${Math.abs(a)}$ w ${a > 0 ? 'lewo' : 'prawo'}.` : t === 1 ? T`$f(x)${sgn(a)}$ przesuwa wykres o $${Math.abs(a)}$ w ${a > 0 ? 'górę' : 'dół'}.` : '$f(-x)$ odbija wykres względem osi $Oy$.'] };
  });
  reg('fTabela', ['2406-12', '2408-9'], null, () => {
    const xs = [-3, -2, -1, 0, 1, 2, 3], ys = xs.map(() => R.int(-4, 5)); const zeros = xs.filter((x, i) => ys[i] === 0); if (zeros.length !== 1 && zeros.length !== 2) return null;
    const mx = Math.max(...ys), argmx = xs[ys.indexOf(mx)], tbl = `<table class="mtab2"><tr><th>$x$</th>${xs.map(x => '<td>$' + x + '$</td>').join('')}</tr><tr><th>$y$</th>${ys.map(y => '<td>$' + y + '$</td>').join('')}</tr></table>`;
    if (R.int(0, 1)) return { q: 'Funkcja $y=f(x)$ jest określona tabelą.' + tbl + 'Największa wartość funkcji $f$ jest równa', opts: opts(no(mx), [[no(argmx), 'To argument, dla którego funkcja przyjmuje największą wartość.'], [no(Math.max(...xs)), 'To największy argument, a nie wartość.'], [no(ys[ys.length - 1]), 'Wartość dla ostatniego argumentu nie musi być największa.'], [no(Math.min(...ys)), 'To najmniejsza wartość.']]), steps: [T`Największa liczba w wierszu $y$: $${mx}$.`] };
    const sym = xs.every((x, i) => ys[i] === ys[xs.indexOf(-x)]);
    return { pf: [[T`Funkcja $f$ ma dokładnie jedno miejsce zerowe.`, zeros.length === 1, T`Miejsca zerowe (gdzie $y=0$): $${zeros.join(',\\ ')}$.`], [T`Wykres funkcji $f$ jest symetryczny względem osi $Oy$.`, sym, sym ? 'Dla $x$ i $-x$ wartości są równe.' : 'Dla $x$ i $-x$ wartości nie zawsze są równe.']], q: 'Funkcja $y=f(x)$ jest określona tabelą.' + tbl + 'Oceń prawdziwość stwierdzeń.', steps: [] };
  });
  reg('fModelLin', ['2408-11.1', '2408-11.2', '2408-11.3'], ['f11-3'], () => {
    const m0 = R.pick([4.5, 5, 5.5, 6, 6.5, 7]), k = R.pick([0.9, 1.03, 1.2, 1.5, 0.8]), V = R.pick([5, 8, 10, 12, 15]), mx = +(m0 + k * V).toFixed(2);
    const intro = T`Pusty pojemnik o pojemności $${V}$ litrów ma masę $${dec(m0)}$ kg. Jeden litr cieczy ma masę $${dec(k)}$ kg. Niech $f(x)$ oznacza masę pojemnika z $x$ litrami cieczy, $x\in[0, ${V}]$. `;
    if (R.int(0, 1)) return { q: intro + 'Funkcja $f$ jest określona wzorem', opts: opts(T`f(x)=${dec(k)}x+${dec(m0)}`, [[T`f(x)=${dec(m0)}x+${dec(k)}`, 'Zamienione: masa pustego pojemnika to wyraz wolny, a masa litra — współczynnik przy $x$.'], [T`f(x)=${dec(k)}x+${V}`, 'Wyraz wolny to masa pustego pojemnika, a nie pojemność.'], [T`f(x)=${V}x+${dec(k)}`, 'Pojemność nie jest współczynnikiem we wzorze.'], [T`f(x)=${dec(k)}x`, 'Zapomniano o masie pustego pojemnika.']]), steps: [T`Masa = masa pojemnika + masa cieczy: $f(x)=${dec(m0)}+${dec(k)}x$.`] };
    return { q: intro + 'Największa wartość funkcji $f$ jest równa', opts: opts(dec(mx), [[dec(+(m0 * V + k).toFixed(2)), 'Zamienione role liczb we wzorze.'], [dec(+(k * V).toFixed(2)), 'To sama masa cieczy — doliczyć masę pojemnika.'], [dec(+(V + k).toFixed(2)), 'Funkcja jest rosnąca — największa wartość dla $x=' + V + '$: $f(' + V + ')$.'], [dec(+(m0 + V).toFixed(2)), 'Masa litra to $' + dec(k) + '$ kg, a nie 1 kg.']]), steps: [T`Funkcja rośnie, więc największa wartość jest dla $x=${V}$: $${dec(m0)}+${dec(k)}\cdot ${V}=${dec(mx)}$.`] };
  });
  reg('fWzorWart', ['2308-12'], null, () => {
    const x0 = R.int(-3, 3), k = R.int(-6, 6), d = x0 * x0 + 1; if ((x0 - k) % d) return null; const val = (x0 - k) / d;
    return { q: T`Funkcja $f$ jest określona wzorem $f(x)=\dfrac{x-k}{x^2+1}$. Spełnia warunek $f(${x0})=${val}$. Współczynnik $k$ jest równy`, opts: opts(no(k), [[no(-k), 'Zły znak: $' + x0 + '-k=' + val * d + '$.'], [no(x0 + val * d), 'Przenosząc na drugą stronę, zmieniamy znak.'], [no(x0 - val), 'Najpierw pomnóż przez mianownik $' + d + '$.'], [no(k + d), 'Policz mianownik: $' + x0 + '^2+1=' + d + '$.']]), steps: [T`$\frac{${x0}-k}{${d}}=${val}\Rightarrow ${x0}-k=${val * d}\Rightarrow k=${k}$.`] };
  });
  // parabola z wykresu (2405-14.x, 2408-12.x, 2505-12.x)
  function randPar() {
    for (let t = 0; t < 100; t++) { const a = R.pick([-1, 1, -0.5, 0.5, -2, 2]), p = R.int(-3, 3), q = R.int(-5, 5); const fn = x => a * (x - p) ** 2 + q; const d2 = -q / a; const r = d2 > 0 ? Math.sqrt(d2) : null; if (r != null && !Number.isInteger(r)) continue; if (Math.abs(fn(0)) > 6 || !Number.isInteger(fn(0))) continue; return { a, p, q, fn, x1: r != null ? p - r : null, x2: r != null ? p + r : null }; }
    return null;
  }
  const aT = a => (a === 1 ? '' : a === -1 ? '-' : a === 0.5 ? '\\frac12' : a === -0.5 ? '-\\frac12' : String(a));
  const canT = P => T`${aT(P.a)}(x${P.p ? sgn(-P.p) : ''})^2${P.q ? sgn(P.q) : ''}`;
  reg('parabolaWykres', ['2405-14.1', '2405-14.2', '2405-14.3', '2408-12.1', '2408-12.2', '2408-12.3', '2505-12.2', '2505-12.3'], ['f07-3', 'f07-5'], () => {
    const P = randPar(); if (!P) return null; const pic = plotFn({ fn: P.fn }, {}), t = R.int(0, 4), head = T`Na rysunku przedstawiono fragment paraboli — wykresu funkcji kwadratowej $f$. Wierzchołek i punkty przecięcia z osiami mają całkowite współrzędne.` + pic;
    if (t === 0) { const W2 = P.a > 0 ? iv(P.q, Infinity, 1, 0) : iv(-Infinity, P.q, 0, 1); return { q: head + 'Zbiorem wartości funkcji $f$ jest', opts: opts(W2, [[P.a > 0 ? iv(-Infinity, P.q, 0, 1) : iv(P.q, Infinity, 1, 0), 'Ramiona paraboli idą ' + (P.a > 0 ? 'w górę' : 'w dół') + ' — wartości ' + (P.a > 0 ? 'od $q$ w górę.' : 'od $q$ w dół.')], [P.a > 0 ? iv(P.p, Infinity, 1, 0) : iv(-Infinity, P.p, 0, 1), 'Zbiór wartości zależy od $q$ (druga współrzędna wierzchołka), a nie od $p$.'], [P.a > 0 ? iv(P.q, Infinity, 0, 0) : iv(-Infinity, P.q, 0, 0), 'Wierzchołek należy do wykresu — nawias kwadratowy.'], [P.x1 != null ? iv(P.x1, P.x2, 1, 1) : iv(P.q - 2, P.q + 2, 1, 1), 'Zbiór wartości czytamy na osi $Oy$.']]), steps: [T`Wierzchołek $W=(${P.p}, ${P.q})$, ramiona ${P.a > 0 ? 'w górę' : 'w dół'}: $${W2}$.`] }; }
    if (t === 1) return { q: head + 'Osią symetrii wykresu funkcji $f$ jest prosta o równaniu', opts: opts(T`x=${P.p}`, [[T`y=${P.p}`, 'Oś symetrii paraboli jest pionowa: $x=p$.'], [T`x=${P.q}`, 'To druga współrzędna wierzchołka — oś symetrii to $x=p$.'], [T`y=${P.q}`, 'Prosta $y=q$ jest pozioma — styczna w wierzchołku, a nie oś symetrii.'], [T`x=${-P.p}`, 'Zły znak — odczytaj $p$ z rysunku.']]), steps: [T`Oś symetrii przechodzi przez wierzchołek $(${P.p}, ${P.q})$ pionowo: $x=${P.p}$.`] };
    if (t === 2) { const s = R.int(P.p - 5, P.p + 5); if (s === P.p) return null; const t2 = 2 * P.p - s; return { q: head + T`Dla funkcji $f$ prawdziwa jest równość`, opts: opts(T`f(${s})=f(${t2})`, [[T`f(${s})=f(${t2 + 1})`, 'Punkty o równych wartościach leżą symetrycznie względem osi $x=' + P.p + '$.'], [T`f(${s})=f(${-s})`, 'Oś symetrii to $x=' + P.p + '$, a nie oś $Oy$.'], [T`f(${s})=f(${t2 - 1})`, 'Sprawdź odległość od osi symetrii.'], [T`f(${s})=f(${P.p * 2 + s})`, 'Punkt symetryczny do $s$ względem $p$ to $2p-s$.']]), steps: [T`Punkt symetryczny do $${s}$ względem osi $x=${P.p}$: $2\cdot ${P.p}-(${s})=${t2}$.`] }; }
    if (t === 3) return { q: head + 'Funkcja $f$ jest określona wzorem', opts: opts(T`f(x)=${canT(P)}`, [[T`f(x)=${canT({ ...P, p: -P.p })}`, 'W postaci kanonicznej $a(x-p)^2+q$: dla $p=' + P.p + '$ w nawiasie jest $x' + sgn(-P.p) + '$.'], [T`f(x)=${canT({ ...P, a: -P.a })}`, 'Ramiona ' + (P.a > 0 ? 'w górę — $a>0$.' : 'w dół — $a<0$.')], [T`f(x)=${canT({ ...P, q: -P.q })}`, 'Druga współrzędna wierzchołka to $q=' + P.q + '$.'], [T`f(x)=${canT({ ...P, p: P.q, q: P.p })}`, 'Zamienione współrzędne wierzchołka.']]), steps: [T`Wierzchołek $(${P.p}, ${P.q})$, ramiona ${P.a > 0 ? 'w górę' : 'w dół'}; $a$ odczytujemy z punktu przecięcia z osią $Oy$: $f(0)=${P.fn(0)}$.`, T`$f(x)=${canT(P)}$.`] };
    if (P.x1 == null || P.x1 === P.x2) return null;
    const ge = R.int(0, 1) === 1, inside = (P.a > 0) !== ge; const S2 = inside ? iv(P.x1, P.x2, 1, 1) : T`(-\infty, ${P.x1}]\cup[${P.x2}, +\infty)`;
    return { q: head + T`Zbiorem wszystkich rozwiązań nierówności $f(x)${ge ? '\\geq' : '\\leq'} 0$ jest`, opts: opts(S2, [[inside ? T`(-\infty, ${P.x1}]\cup[${P.x2}, +\infty)` : iv(P.x1, P.x2, 1, 1), 'Wybrano argumenty, dla których wykres jest po drugiej stronie osi $Ox$.'], [inside ? iv(P.x1, P.x2, 0, 0) : T`(-\infty, ${P.x1})\cup(${P.x2}, +\infty)`, 'Nierówność nieostra — miejsca zerowe należą do rozwiązań.'], [P.a > 0 ? iv(P.q, Infinity, 1, 0) : iv(-Infinity, P.q, 0, 1), 'To zbiór wartości, a pytamy o argumenty.'], [iv(-P.x2, -P.x1, 1, 1), 'Odczytaj miejsca zerowe z osi $Ox$ — zły znak.']]), steps: [T`Miejsca zerowe: $${P.x1}$, $${P.x2}$; wykres ${ge ? 'nad' : 'pod'} osią $Ox$ dla $${S2}$.`] };
  });
  // symetria paraboli, drugie miejsce zerowe, przesunięcie wierzchołka (2606-13.1, 2305-14, 2308-13, 2606-13.2, 2508-14.3, 2508-14.1)
  reg('parabolaSym', ['2606-13.1', '2305-14', '2308-13', '2606-13.2', '2508-14.3', '2508-14.1'], ['f07-3', 'f07-6'], () => {
    const t = R.int(0, 3), p = R.int(-6, 6), q = R.int(-9, 9);
    if (t === 0) { const s = R.int(-12, 12); if (s === p) return null; const v = 2 * p - s; return { q: T`Wykresem funkcji kwadratowej $f$ jest parabola o wierzchołku $W=(${p}, ${q})$. Liczba $t\neq ${s}$ spełnia warunek $f(t)=f(${s})$. Liczba $t$ jest równa`, opts: opts(no(v), [[no(-s), 'Oś symetrii to $x=' + p + '$, a nie oś $Oy$.'], [no(s + p), 'Punkt symetryczny względem $p$: $2p-s$, a nie $s+p$.'], [no(p - s), 'Policz: $2\\cdot' + p + '-(' + s + ')$.'], [no(v + q), 'Druga współrzędna wierzchołka nie ma tu znaczenia.']]), steps: [T`Punkty o równych wartościach leżą symetrycznie względem $x=${p}$: $t=2\cdot ${p}-(${s})=${v}$.`] }; }
    if (t === 1) { const x1 = R.int(-12, 12); if (x1 === p) return null; const x2 = 2 * p - x1; return { q: T`Jednym z miejsc zerowych funkcji kwadratowej $f$ jest liczba $${x1 < 0 ? '(' + x1 + ')' : x1}$. Pierwsza współrzędna wierzchołka paraboli jest równa $${p}$. Drugim miejscem zerowym jest`, opts: opts(no(x2), [[no(-x1), 'Miejsca zerowe są symetryczne względem $x=p$, nie względem zera.'], [no(p - x1), 'Środek odcinka $[x_1, x_2]$ to $p$: $x_2=2p-x_1$.'], [no(x1 + p), 'Policz: $2\\cdot' + p + '-(' + x1 + ')$.'], [no(2 * x1 - p), 'Zamienione role $p$ i $x_1$.']]), steps: [T`$p=\frac{x_1+x_2}{2}\Rightarrow x_2=2p-x_1=${x2}$.`] }; }
    if (t === 2) { const a = R.pick([-3, -2, 2, 3]), b = R.int(-5, 5); if (!b && !a) return null; const sh = R.int(0, 1); // g(x) = f(x − a) albo f(x) + b
      const W2 = sh ? `(${p + a}, ${q})` : `(${p}, ${q + b})`;
      return { q: T`Wykresem funkcji kwadratowej $f$ jest parabola o wierzchołku $W=(${p}, ${q})$. Funkcja $g$ jest określona wzorem $g(x)=${sh ? T`f(x${sgn(-a)})` : T`f(x)${sgn(b)}`}$. Wierzchołek paraboli $g$ ma współrzędne`, opts: opts(W2, [[sh ? `(${p - a}, ${q})` : `(${p}, ${q - b})`, sh ? '$f(x-a)$ przesuwa wykres w prawo o $a$ (gdy $a>0$).' : '$f(x)+b$ przesuwa wykres w górę o $b$.'], [sh ? `(${p}, ${q + a})` : `(${p + b}, ${q})`, sh ? 'Zmiana w argumencie przesuwa wykres w poziomie, nie w pionie.' : 'Dodanie liczby do wartości przesuwa w pionie, nie w poziomie.'], [sh ? `(${p}, ${q - a})` : `(${p - b}, ${q})`, 'Złe przesunięcie.'], [`(${q}, ${p})`, 'Zamienione współrzędne.']]), steps: [sh ? T`$g(x)=f(x${sgn(-a)})$ — przesunięcie o $${a}$ wzdłuż osi $Ox$: $${W2}$.` : T`$g(x)=f(x)${sgn(b)}$ — przesunięcie o $${b}$ wzdłuż osi $Oy$: $${W2}$.`] };
    }
    const a = R.pick([0.5, -0.5, 1, -1, 2]), x1 = R.int(-6, 6), x2 = 2 * p - x1; if (x1 === x2) return null;
    const f = (u, v) => T`f(x)=${aT(a)}(x${u ? sgn(-u) : ''})(x${v ? sgn(-v) : ''})`;
    return { q: T`Funkcja kwadratowa $f(x)=${aT(a)}x^2+bx+c$ ma miejsce zerowe $${x1}$, a prosta $x=${p}$ jest osią symetrii jej wykresu. Funkcja $f$ jest określona wzorem`, opts: opts(f(x1, x2), [[f(-x1, -x2), 'Miejsce zerowe $x_0$ daje czynnik $(x-x_0)$ — zły znak.'], [f(x1, -x2), 'Drugie miejsce zerowe: $2p-x_1=' + x2 + '$.'], [f(-x1, x2), 'Sprawdź znak przy pierwszym miejscu zerowym.'], [f(x1, x1 + p), 'Drugie miejsce zerowe to $2p-x_1$.']]), steps: [T`Drugie miejsce zerowe: $2\cdot ${p}-(${x1})=${x2}$.`, T`Postać iloczynowa: $${f(x1, x2)}$.`] };
  });
  reg('kwPF', ['2406-15.2', '2608-13.1', '2508-14.2'], ['f07-5', 'f07-3', 'f07-4'], () => {
    const a = R.pick([-2, -1, 1, 2]), p = R.int(-4, 4), q = R.int(-6, 6), f0 = a * p * p + q, zeros = -q / a > 0 ? 2 : -q / a === 0 ? 1 : 0;
    const fx = T`f(x)=${aT(a)}(x${p ? sgn(-p) : ''})^2${q ? sgn(q) : ''}`, y0 = R.pick([f0, q, f0 + 1]);
    return { pf: [[T`Funkcja $f$ ma dwa rzeczywiste miejsca zerowe.`, zeros === 2, zeros === 2 ? 'Wierzchołek leży po drugiej stronie osi $Ox$ niż ramiona — są dwa miejsca zerowe.' : 'Wierzchołek i ramiona są po tej samej stronie osi $Ox$ — brak dwóch miejsc zerowych.'], [T`Wykres funkcji $f$ przecina oś $Oy$ w punkcie $(0, ${y0})$.`, y0 === f0, T`$f(0)=${aT(a) || '1'}\cdot ${p * p}${q ? sgn(q) : ''}=${f0}$.`]], q: T`Funkcja kwadratowa jest określona wzorem $${fx}$. Oceń prawdziwość stwierdzeń.`, steps: [] };
  });
  reg('kwModel', ['2305-31.1', '2605-33.1'], ['f07-3', 'f07-4'], () => {
    const t1 = R.int(1, 4), t2 = t1 + R.int(2, 6), k = R.pick([1, 2, 5]); // h(t) = −k (t + t1')… prościej: h(t) = −k t (t − T)
    const Tt = t2, h = t => -k * t * (t - Tt), tm = Tt / 2; void t1;
    return { q: T`Wysokość piłki (w metrach) $t$ sekund po wyrzuceniu z ziemi opisuje wzór $h(t)=${-k === -1 ? '-' : -k}t^2+${k * Tt}t$. Piłka uderzy w ziemię w chwili`, opts: opts(T`t=${Tt}\text{ s}`, [[T`t=${dec(tm)}\text{ s}`, 'W tej chwili piłka jest najwyżej (wierzchołek), a nie na ziemi.'], [T`t=${k * Tt}\text{ s}`, 'Rozwiąż $h(t)=0$: $t(' + (k * Tt) + '-' + (k === 1 ? '' : k) + 't)=0$.'], [T`t=${Tt + 1}\text{ s}`, 'Sprawdź: $h(t)$ musi być równe 0.'], [T`t=${dec(+(h(tm)).toFixed(2))}\text{ s}`, 'To maksymalna wysokość w metrach, a nie czas.']]), steps: [T`$h(t)=0\iff t=0$ albo $t=${Tt}$. Piłka spada na ziemię po $${Tt}$ s.`] };
  });
  reg('kwParam', ['2606-11'], ['f07-4'], () => {
    const a = R.int(1, 3), c = R.int(-8, 8), x0 = R.pick([-3, -2, -1, 1, 2, 3]); // a x0² − k x0 + c = 0 → k = (a x0² + c)/x0
    if ((a * x0 * x0 + c) % x0) return null; const k = (a * x0 * x0 + c) / x0;
    return { q: T`Funkcja $f(x)=${a === 1 ? '' : a}x^2-kx${c ? sgn(c) : ''}$ ma miejsce zerowe $${x0 < 0 ? '(' + x0 + ')' : x0}$. Liczba $k$ jest równa`, opts: opts(no(k), [[no(-k), 'Uwaga na znak przy $-kx$.'], [no((a * x0 * x0 - c) / x0), 'Zły znak wyrazu wolnego.'], [no(a * x0 * x0 + c), 'Zapomniano podzielić przez $' + x0 + '$.'], [no(k + a), 'Sprawdź: $f(' + x0 + ')$ musi być równe $0$.']]), steps: [T`$f(${x0})=0$: $${a * x0 * x0}-${x0 < 0 ? '(' + x0 + ')' : x0}k${c ? sgn(c) : ''}=0\Rightarrow k=${k}$.`] };
  });
  reg('kwZnakiWykres', ['2306-14'], ['f07-2', 'f07-3'], () => {
    const sa = R.pick([-1, 1]), sb = R.pick([-1, 1]), c = R.pick([-2, -1, 1, 2]);
    const mk = (A2, B2) => { const a = A2 * R.pick([0.5, 1]), b = B2 * R.pick([1, 2]); return plotFn({ fn: x => a * x * x + b * x + c }, {}); };
    const opts2 = R.shuffle([[sa, sb, true], [-sa, sb, false], [sa, -sb, false], [-sa, -sb, false]]).map(([A2, B2, ok]) => ({ t: '', html: mk(A2, B2), ok, why: ok ? '' : (A2 !== sa ? 'Znak $a$ decyduje o kierunku ramion: $a' + (sa < 0 ? '<' : '>') + '0$ — ramiona ' + (sa < 0 ? 'w dół.' : 'w górę.') : 'Wierzchołek $p=-\\frac b{2a}$ — przy tym $a$ i $b' + (sb > 0 ? '>' : '<') + '0$ leży po ' + (sb * sa < 0 ? 'prawej' : 'lewej') + ' stronie osi $Oy$.') }));
    return { q: T`Funkcja $f(x)=ax^2+bx${sgn(c)}$, gdzie $a${sa < 0 ? '<' : '>'}0$ i $b${sb < 0 ? '<' : '>'}0$. Fragment wykresu tej funkcji przedstawiono na rysunku`, opts: opts2, steps: [T`$a${sa < 0 ? '<' : '>'}0$ — ramiona ${sa < 0 ? 'w dół' : 'w górę'}; $p=-\frac{b}{2a}$ jest ${sb * sa < 0 ? 'dodatnie' : 'ujemne'}; wykres przecina oś $Oy$ w $(0, ${c})$.`] };
  });
  reg('kwZbiorWart', ['2308-15'], ['f07-3', 'f07-5'], () => {
    const q = R.int(-4, 4), mk = (a, p, qq) => T`${aT(a)}(x${p ? sgn(-p) : ''})^2${qq ? sgn(qq) : ''}`, p1 = R.int(-3, 3), p2 = R.int(-3, 3);
    const all = R.shuffle([[mk(-1, p1, q), true], [mk(-2, p2, q), true], [mk(1, p1, q), false], [mk(-1, q, p1 === q ? q + 1 : p1), false], [mk(-1, p1, -q || 3), false], [mk(2, p2, q), false]]);
    return { multi: all.map(([t, ok]) => ({ t: 'f(x)=' + t, ok })), q: T`Wybierz <b>dwie</b> funkcje, których zbiorem wartości jest przedział $(-\infty, ${q}]$.`, steps: [T`Zbiór $(-\infty, q]$ mają funkcje $a(x-p)^2+q$ z $a<0$ i $q=${q}$ — $p$ może być dowolne.`] };
  });
  /* --- funkcja liniowa --- */
  reg('linZnaki', ['2305-13', '2605-13.1', '2605-13.2'], ['f11-3'], () => {
    const a = R.pick([-3, -2, -1, 1, 2, 3, Q(1, 2), Q(-1, 2), Q(3, 2), Q(-3, 2)]), b = R.int(-4, 4) || 2, av = typeof a === 'object' ? a.n / a.d : a;
    const pic = plotLines([[a, b]]); const sg = (v, n) => n + (v > 0 ? '>0' : '<0');
    if (R.int(0, 1)) return { q: 'Na rysunku przedstawiono fragment wykresu funkcji liniowej $f(x)=ax+b$.' + pic + 'Liczby $a$ i $b$ spełniają warunki', opts: opts(T`${sg(av, 'a')}\ \text{i}\ ${sg(b, 'b')}`, [[T`${sg(-av, 'a')}\ \text{i}\ ${sg(b, 'b')}`, 'Prosta ' + (av > 0 ? 'rośnie — $a>0$.' : 'maleje — $a<0$.')], [T`${sg(av, 'a')}\ \text{i}\ ${sg(-b, 'b')}`, '$b$ to punkt przecięcia z osią $Oy$ — ' + (b > 0 ? 'nad' : 'pod') + ' osią $Ox$.'], [T`${sg(-av, 'a')}\ \text{i}\ ${sg(-b, 'b')}`, 'Oba znaki odwrotnie.']]), steps: [T`Prosta ${av > 0 ? 'rośnie' : 'maleje'}, więc $a${av > 0 ? '>' : '<'}0$; przecina oś $Oy$ w $(0, ${b})$, więc $b${b > 0 ? '>' : '<'}0$.`] };
    const x0 = Q(-b * (typeof a === 'object' ? a.d : 1), typeof a === 'object' ? a.n : a); if (!Number.isInteger(x0.n / x0.d)) return null;
    const tg = typeof a === 'object' ? a : Q(a);
    return { q: 'Na rysunku przedstawiono fragment wykresu funkcji liniowej $f(x)=ax+b$. Wykres jest nachylony do osi $Ox$ pod kątem $\\alpha$.' + pic + 'Tangens kąta $\\alpha$ jest równy', opts: opts(qo(tg), [[qo(Q(-tg.n, tg.d)), 'Znak tangensa = znak $a$: prosta ' + (av > 0 ? 'rośnie.' : 'maleje.')], [qo(Q(tg.d, tg.n)), 'Tangens to iloraz przyrostów: $\\frac{\\Delta y}{\\Delta x}$, a nie odwrotnie.'], [qo(Q(-tg.d, tg.n)), 'Odwrócony iloraz i zły znak.'], [qo(Q(b)), 'To wyraz wolny $b$, a nie nachylenie.']]), steps: [T`$\operatorname{tg}\alpha=a=\frac{\Delta y}{\Delta x}=${qt(tg)}$ (odczytane z punktów przecięcia z osiami).`] };
  });
  reg('linParam', ['2306-11', '2405-12', '2505-13', '2506-11', '2406-13'], ['f11-3', 'f11-8'], () => {
    const t = R.int(0, 3), u = R.int(1, 4), w = R.int(-5, 5);
    if (t === 0) { // (u m + w) x + c równoległa do y = s x → u m + w = s
      const s = R.int(-3, 3) || -1, m = Q(s - w, u); if (m.d !== 1) return null;
      return { q: T`Wykresy funkcji $f(x)=(${u === 1 ? '' : u}m${sgn(w)})x+${R.int(1, 6)}$ oraz $g(x)=${s === 1 ? '' : s === -1 ? '-' : s}x$ nie mają punktów wspólnych dla`, opts: opts(T`m=${m.n}`, [[T`m=${-m.n || 3}`, 'Proste bez punktów wspólnych są równoległe — współczynniki kierunkowe równe: $' + u + 'm' + sgn(w) + '=' + s + '$.'], [T`m=${(s + w) / u === m.n || !Number.isInteger((s + w) / u) ? m.n + 2 : (s + w) / u}`, 'Zły znak przy przenoszeniu $' + w + '$.'], [T`m=${(-1 / s - w) / u === m.n || !Number.isInteger((-1 / s - w) / u) ? m.n - 1 : (-1 / s - w) / u}`, 'To warunek prostopadłości, a potrzebna równoległość.'], [T`m=${m.n + 1}`, 'Podstaw i sprawdź współczynnik.']]), steps: [T`Brak punktów wspólnych $\iff$ proste równoległe: $${u}m${sgn(w)}=${s}\Rightarrow m=${m.n}$.`] }; }
    if (t === 1) { // malejąca: (−u k + w) < 0 → k > w/u
      const g = Q(w, u); return { q: T`Funkcja $f(x)=(-${u === 1 ? '' : u}k${sgn(w)})x+k-1$ jest malejąca dla każdego $k$ z przedziału`, opts: opts(T`\left(${qt(g)}, +\infty\right)`, [[T`\left(-\infty, ${qt(g)}\right)`, 'Dla tych $k$ współczynnik jest dodatni — funkcja rośnie.'], [T`\left(-\infty, 1\right)`, 'Monotoniczność zależy od współczynnika przy $x$, a nie od wyrazu wolnego.'], [T`\left(1, +\infty\right)`, 'Wyraz wolny $k-1$ nie wpływa na monotoniczność.'], [T`\left(${qt(Q(-w, u))}, +\infty\right)`, 'Zły znak przy rozwiązywaniu nierówności.']]), steps: [T`Malejąca $\iff -${u === 1 ? '' : u}k${sgn(w)}<0\iff k>${qt(g)}$.`] }; }
    if (t === 2) { // nie ma miejsca zerowego: (c − m) x + d, d ≠ 0 → m = c
      const c = R.int(-5, 5), d = R.int(1, 6) * R.pick([-1, 1]);
      return { q: T`Funkcja $f(x)=(${c}-m)x${sgn(d)}$ nie ma miejsca zerowego dla $m$ równego`, opts: opts(no(c), [[no(-c || 1), 'Brak miejsca zerowego, gdy współczynnik przy $x$ jest zerem: $' + c + '-m=0$.'], ['0', 'Dla $m=0$ funkcja ma miejsce zerowe.'], [no(d), 'Wyraz wolny nie decyduje — liczy się współczynnik przy $x$.'], [no(c + d), 'Podstaw i sprawdź.']]), steps: [T`Funkcja stała $f(x)=${d}$ (dla $m=${c}$) nie ma miejsc zerowych.`] };
    }
    const x0 = R.pick([-2, -1, 1, 2, 4]), c = R.int(-6, 6) || 2, d = R.int(-8, 8) || 4; // (c − m) x0 + d = 0 → m = c + d/x0
    if (d % x0) return null; const m = c + d / x0;
    return { q: T`Liczba $${x0 < 0 ? '(' + x0 + ')' : x0}$ jest miejscem zerowym funkcji $f(x)=(${c}-m)x${sgn(d)}$. Liczba $m$ jest równa`, opts: opts(no(m), [[no(c - d / x0), 'Zły znak przy przenoszeniu.'], [no(c), 'Dla tego $m$ funkcja jest stała.'], [no(c + d), 'Zapomniano podzielić przez $' + x0 + '$.'], [no(m + 1), 'Podstaw $x=' + x0 + '$ i sprawdź.']]), steps: [T`$(${c}-m)\cdot ${x0 < 0 ? '(' + x0 + ')' : x0}${sgn(d)}=0\Rightarrow ${c}-m=${-d / x0}\Rightarrow m=${m}$.`] };
  });
  reg('linWzor', ['2306-12', '2308-11', '2405-13', '2508-13', '2506-12'], ['f11-5', 'f11-3'], () => {
    const t = R.int(0, 2);
    if (t === 0) { const xA = R.int(-5, 3), xB = xA + R.int(1, 6), yA = R.int(-5, 5), yB = R.int(-5, 5); if (yA === yB) return null; const a = Q(yB - yA, xB - xA);
      return { q: T`Prosta $y=ax+b$ przechodzi przez punkty $A=(${xA}, ${yA})$ i $B=(${xB}, ${yB})$. Współczynnik $a$ jest równy`, opts: opts(qo(a), [[qo(Q(xB - xA, yB - yA)), 'Iloraz odwrotnie: $a=\\frac{y_B-y_A}{x_B-x_A}$.'], [qo(Q(-a.n, a.d)), 'Zły znak — sprawdź różnice w tej samej kolejności.'], [qo(Q(yB + yA, xB + xA || 1)), 'Potrzebne są różnice, nie sumy.'], [qo(Q(yB - yA, 1)), 'Podziel przez różnicę $x$.']]), steps: [T`$a=\frac{${yB}-(${yA})}{${xB}-(${xA})}=${qt(a)}$.`] }; }
    if (t === 1) { const x0 = R.int(-4, 4), y0b = R.int(-4, 4) || 3; // miejsce zerowe x0, f(0) = b
      if (!x0) return null; const a = Q(-y0b, x0), f = (A2, B2) => T`f(x)=${A2.d === 1 ? (A2.n === 1 ? '' : A2.n === -1 ? '-' : A2.n) : qt(A2)}x${sgn(B2)}`;
      return { q: T`Miejscem zerowym funkcji liniowej $f$ jest $${x0 < 0 ? '(' + x0 + ')' : x0}$, a $f(0)=${y0b}$. Funkcja $f$ jest określona wzorem`, opts: opts(f(a, y0b), [[f(Q(-a.n, a.d), y0b), 'Sprawdź: $f(' + x0 + ')=0$ — zły znak współczynnika.'], [f(Q(x0), y0b), 'Współczynnik to $-\\frac{b}{x_0}$, a nie $x_0$.'], [f(a, x0), '$f(0)$ to wyraz wolny $b=' + y0b + '$.'], [f(Q(a.d, a.n), y0b), 'Odwrócony iloraz.']]), steps: [T`$b=f(0)=${y0b}$; $0=a\cdot ${x0 < 0 ? '(' + x0 + ')' : x0}${sgn(y0b)}\Rightarrow a=${qt(a)}$.`] }; }
    const k = R.int(2, 6), s = R.int(1, 3) * R.pick([1, -1]); // f(x) = k x przesunięte o s w prawo → k x − k s
    return { q: T`Wykres funkcji $f(x)=${k}x$ przesunięto o $${Math.abs(s)}$ ${Math.abs(s) === 1 ? 'jednostkę' : 'jednostki'} w ${s > 0 ? 'prawo' : 'lewo'} wzdłuż osi $Ox$. Otrzymano wykres funkcji $g$ o wzorze`, opts: opts(T`g(x)=${k}x${sgn(-k * s)}`, [[T`g(x)=${k}x${sgn(k * s)}`, 'Przesunięcie w ' + (s > 0 ? 'prawo' : 'lewo') + ': $g(x)=f(x' + sgn(-s) + ')$.'], [T`g(x)=${k}x${sgn(-s)}`, 'Nawias: $' + k + '(x' + sgn(-s) + ')$ — mnożymy też przesunięcie.'], [T`g(x)=${k}x${sgn(s)}`, 'To przesunięcie w pionie, i to w złą stronę.'], [T`g(x)=${k + s}x`, 'Przesunięcie nie zmienia nachylenia.']]), steps: [T`$g(x)=f(x${sgn(-s)})=${k}(x${sgn(-s)})=${k}x${sgn(-k * s)}$.`] };
  });
  reg('linPF', ['2606-10'], ['f11-3'], () => {
    const a = R.int(-5, 5) || 2, b = R.int(-6, 6) || -3, y = R.pick([b, -b]);
    return { pf: [[T`Funkcja $f$ jest rosnąca.`, a > 0, T`Współczynnik $a=${a}$ jest ${a > 0 ? 'dodatni' : 'ujemny'}.`], [T`Wykres funkcji $f$ przecina oś $Oy$ w punkcie $(0, ${y})$.`, y === b, T`$f(0)=${b}$.`]], q: T`Funkcja liniowa jest określona wzorem $f(x)=${a === 1 ? '' : a === -1 ? '-' : a}x${sgn(b)}$. Oceń prawdziwość stwierdzeń.`, steps: [] };
  });
  reg('linKat', ['2408-10'], ['f09-5', 'f11-3'], () => {
    const [aT2, ang, sinT] = R.pick([['\\frac{\\sqrt3}{3}', 30, '\\frac12'], ['1', 45, '\\frac{\\sqrt2}{2}'], ['\\sqrt3', 60, '\\frac{\\sqrt3}{2}']]), b = R.int(-5, 5);
    return { q: T`Wykres funkcji $f(x)=${aT2 === '1' ? '' : aT2}x${b ? sgn(b) : ''}$ jest nachylony do osi $Ox$ pod kątem ostrym $\alpha$. Sinus kąta $\alpha$ jest równy`, opts: opts(sinT, [[aT2 === '1' ? '1' : aT2, 'To tangens kąta (współczynnik kierunkowy), a pytamy o sinus.'], [ang === 30 ? '\\frac{\\sqrt3}{2}' : ang === 60 ? '\\frac12' : '\\frac{\\sqrt3}{2}', 'Sprawdź kąt: $\\operatorname{tg}\\alpha=' + aT2 + '$ daje $\\alpha=' + ang + '^\\circ$.'], [String(ang), 'To miara kąta, a nie sinus.'], [ang === 45 ? '\\frac12' : '\\frac{\\sqrt2}{2}', 'Odczytaj wartość z tabeli dla $' + ang + '^\\circ$.']]), steps: [T`$\operatorname{tg}\alpha=${aT2}\Rightarrow \alpha=${ang}^\circ$, więc $\sin\alpha=${sinT}$.`] };
  });

  A.MGEN = { G, MAP, snipTitles: {}, gen: id => { const g = G[MAP[id]]; if (!g) return null; for (let k = 0; k < 60; k++) { let r = null; try { r = g.gen(); } catch (e) { r = null; } if (r && (r.opts || r.pf || r.multi)) { if (r.pf && !(r.steps && r.steps.length)) r.steps = r.pf.map(x => x[2]).filter(Boolean); return Object.assign({ pattern: MAP[id] }, r); } } return null; }, wz: id => (G[MAP[id]] || {}).wz || [], noWz: id => !!G[MAP[id]] && G[MAP[id]].wz === null };
})();
