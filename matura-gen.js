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
  /** √n uproszczony: k√m */
  const surdKM = n => { let k = 1, m = n; for (let f = 2; f * f <= m; f++) while (m % (f * f) === 0) { m /= f * f; k *= f; } return [k, m]; };
  const surd = n => { const [k, m] = surdKM(n); return m === 1 ? String(k) : (k === 1 ? '' : k) + T`\sqrt{${m}}`; };
  /** num/√n po usunięciu niewymierności z mianownika */
  const fracSurd = (num, n) => { const [k, m] = surdKM(n); if (m === 1) return qt(Q(num, k)); const q = Q(num, k * m), top = (Math.abs(q.n) === 1 ? '' : Math.abs(q.n)) + T`\sqrt{${m}}`; return (q.n < 0 ? '-' : '') + (q.d === 1 ? top : T`\frac{${top}}{${q.d}}`); };
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
    const mx = Math.max(...ys), argmx = xs[ys.indexOf(mx)], tbl = `<table class="mtab2"><tr><th><i>x</i></th>${xs.map(x => '<td>' + String(x).replace('-', '−') + '</td>').join('')}</tr><tr><th><i>y</i></th>${ys.map(y => '<td>' + String(y).replace('-', '−') + '</td>').join('')}</tr></table>`;
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

  /* =================== DZIAŁ VI: ciągi =================== */
  const nth = n => T`a_{${n}}`;
  reg('ciagWzor', ['2305-15', '2308-16', '2508-15', '2608-14.1'], ['f08-1'], () => {
    const t = R.int(0, 2), k = R.int(3, 6);
    if (t === 0) { const c = R.int(2, 4), d = R.int(1, 2), f = n => c * n * (n + d), v = f(k);
      return { q: T`Ciąg $(a_n)$ jest określony wzorem $a_n=${c}n\cdot(n+${d})$ dla $n\geq1$. Wyraz $${nth(k)}$ jest równy`, opts: opts(String(v), [[String(f(k - 1)), 'To wyraz $a_{' + (k - 1) + '}$ — podstaw $n=' + k + '$.'], [String(f(k + 1)), 'To wyraz $a_{' + (k + 1) + '}$.'], [String(c * k * k + d), 'Nawias: $' + c + 'n(n+' + d + ')$ — mnożymy przez całą sumę.'], [String(c * k + k + d), 'Mnożenie, nie dodawanie.']]), steps: [T`$${nth(k)}=${c}\cdot ${k}\cdot(${k}+${d})=${v}$.`] }; }
    if (t === 1) { const d = R.pick([1, 3]), f = n => Q((-1) ** n * (n + d), 2), v = f(k);
      return { q: T`Ciąg $(a_n)$ jest określony wzorem $a_n=(-1)^n\cdot\dfrac{n+${d}}{2}$ dla $n\geq1$. Wyraz $${nth(k)}$ jest równy`, opts: opts(qo(v), [[qo(Q(-v.n, v.d)), '$(-1)^n$ dla ' + (k % 2 ? 'nieparzystego' : 'parzystego') + ' $n$ to $' + (k % 2 ? '-1' : '1') + '$.'], [qo(f(k + 1)), 'To następny wyraz.'], [qo(Q(k + d)), 'Zapomniano podzielić przez 2.'], [qo(f(k - 1)), 'To poprzedni wyraz.']]), steps: [T`$${nth(k)}=(-1)^{${k}}\cdot\frac{${k}+${d}}{2}=${qt(v)}$.`] }; }
    const c = R.pick([16, 32, 64]), s = R.int(3, 6), f = n => Q(c * 2 ** Math.max(0, s - n), 2 ** Math.max(0, n - s)), v = f(k);
    return { q: T`Ciąg $(a_n)$ jest określony wzorem $a_n=${c}\cdot\left(\frac12\right)^{n-${s}}$ dla $n\geq1$. Wyraz $${nth(k)}$ jest równy`, opts: opts(qo(v), [[qo(f(k + 1)), 'Wykładnik to $n-' + s + '=' + (k - s) + '$.'], [qo(f(k - 1)), 'Sprawdź wykładnik.'], [qo(f(2 * s - k)), 'Ujemny wykładnik odwraca ułamek — tu zrobiono to odwrotnie.'], [qo(Q(c * (k - s))), 'To potęga, a nie mnożenie przez wykładnik.']]), steps: [T`$${nth(k)}=${c}\cdot\left(\frac12\right)^{${k - s}}=${qt(v)}$.`] };
  });
  reg('ciagSuma', ['2406-16.1', '2506-14.1', '2408-13'], ['f08-2'], () => {
    const t = R.int(0, 2);
    if (t === 0) { const p = R.int(1, 3), q = R.int(1, 4), k = R.int(3, 5), S = n => p * n * n + q * n, v = S(k) - S(k - 1);
      return { q: T`Suma $n$ początkowych wyrazów ciągu $(a_n)$ wyraża się wzorem $S_n=${p === 1 ? '' : p}n^2+${q}n$. Wyraz $${nth(k)}$ jest równy`, opts: opts(String(v), [[String(S(k)), 'To suma $S_{' + k + '}$, a $a_{' + k + '}=S_{' + k + '}-S_{' + (k - 1) + '}$.'], [String(S(k - 1)), 'To $S_{' + (k - 1) + '}$.'], [String(S(k) + S(k - 1)), 'Sumy się odejmuje.'], [String(S(k) - S(k - 2)), 'Odejmujemy $S_{' + (k - 1) + '}$, nie $S_{' + (k - 2) + '}$.']]), steps: [T`$${nth(k)}=S_{${k}}-S_{${k - 1}}=${S(k)}-${S(k - 1)}=${v}$.`] }; }
    if (t === 1) { const c = R.int(2, 3), f = n => c * n * n - c * n, k = 3, v = f(1) + f(2) + f(3);
      return { q: T`Ciąg $(a_n)$ jest określony wzorem $a_n=${c}n^2-${c}n$. Suma trzech początkowych wyrazów jest równa`, opts: opts(String(v), [[String(f(3)), 'To tylko $a_3$, a potrzebna suma $a_1+a_2+a_3$.'], [String(f(1) + f(2)), 'Brakuje $a_3$.'], [String(3 * f(3)), 'Wyrazy są różne — trzeba policzyć każdy osobno.'], [String(f(2) + f(3) + f(4)), 'Zaczynamy od $a_1$.']]), steps: [T`$a_1=${f(1)}$, $a_2=${f(2)}$, $a_3=${f(3)}$; suma: $${v}$.`] }; }
    const p = R.int(1, 3), q = R.int(3, 7), n = R.pick([10, 20, 6]), v = q * n; // a_n = p(−1)^{n+1} + q, n parzyste → suma q n
    return { q: T`Ciąg $(a_n)$ jest określony wzorem $a_n=${p}\cdot(-1)^{n+1}+${q}$. Suma $${n}$ początkowych wyrazów jest równa`, opts: opts(String(v), [[String(q + p), 'To pierwszy wyraz, nie suma.'], [String(q - p), 'To drugi wyraz.'], [String(v + p), 'Przy parzystej liczbie wyrazów składniki $\\pm' + p + '$ się znoszą.'], [String(2 * v), 'Wyrazy to na zmianę $' + (q + p) + '$ i $' + (q - p) + '$ — średnio $' + q + '$.']]), steps: [T`Wyrazy to na zmianę $${q + p}$ i $${q - p}$; każda para daje $${2 * q}$. $${n / 2}$ par: $${v}$.`] };
  });
  reg('ciagRek', ['2505-14.1', '2606-14.1', '2505-14.2', '2606-14.2'], ['f08-1', 'f08-4'], () => {
    const a1 = R.int(-3, 5), m = R.pick([1, 2, 3]), c = R.int(-6, 6) || 2, k = R.int(3, 5);
    const seq = [a1]; for (let i = 1; i < k + 1; i++) seq.push(m * seq[i - 1] + c);
    const rec = T`a_1=${a1},\ a_{n+1}=${m === 1 ? '' : m}a_n${sgn(c)}`;
    if (R.int(0, 2) === 0) { const ar = m === 1, ge = c === 0, dec = m === 1 && c < 0;
      return { pf: [[T`Ciąg $(a_n)$ jest arytmetyczny.`, ar, ar ? T`Co krok dodajemy $${c}$ — różnica stała.` : T`Różnice: $a_2-a_1=${seq[1] - seq[0]}$, $a_3-a_2=${seq[2] - seq[1]}$ — nie są równe.`], [T`Ciąg $(a_n)$ jest malejący.`, dec || (m === 1 ? c < 0 : seq.slice(0, 4).every((v, i, A2) => !i || v < A2[i - 1])), T`Kolejne wyrazy: $${seq.slice(0, 4).join(', ')}$.`]], q: T`Ciąg jest określony rekurencyjnie: $${rec}$. Oceń prawdziwość stwierdzeń.`, steps: [] }; }
    return { q: T`Ciąg $(a_n)$ jest określony następująco: $${rec}$. Wyraz $${nth(k)}$ jest równy`, opts: opts(no(seq[k - 1]), [[no(seq[k]), 'To $a_{' + (k + 1) + '}$ — liczymy od $a_1$.'], [no(seq[k - 2]), 'To $a_{' + (k - 1) + '}$ — jeszcze jeden krok.'], [no(a1 + (k - 1) * c * m), 'Ciąg ' + (m === 1 ? 'jest arytmetyczny, ale' : 'nie jest arytmetyczny —') + ' licz krok po kroku.'], [no(seq[k - 1] + c), 'Policz kolejne wyrazy dokładnie.']]), steps: [T`Kolejne wyrazy: $${seq.slice(0, k).join(',\\ ')}$.`] };
  });
  reg('ciagPF', ['2506-14.2', '2406-16.2', '2405-15'], ['f08-1'], () => {
    const d = R.int(2, 9), f = n => (-1) ** n * (n - d), i = R.int(1, 4), j = R.int(5, 8);
    const s1 = !!(R.int(0, 1) || !f(i)), v1 = s1 ? f(i) : -f(i);
    const st1 = [T`$a_{${i}}=${v1}$`, s1, T`$a_{${i}}=(-1)^{${i}}\cdot(${i}-${d})=${f(i)}$.`];
    const t2 = R.int(0, 2), st2 = t2 === 0 ? [T`Liczba $0$ jest wyrazem tego ciągu.`, true, T`Dla $n=${d}$: $a_{${d}}=0$.`]
      : t2 === 1 ? [T`Wszystkie wyrazy ciągu są dodatnie.`, false, T`Np. $a_{${d}}=0$, a $(-1)^n$ zmienia znaki.`]
      : [T`$a_{${j}}>a_{${j + 1}}$`, f(j) > f(j + 1), T`$a_{${j}}=${f(j)}$, $a_{${j + 1}}=${f(j + 1)}$.`];
    return { pf: [st1, st2], q: T`Ciąg $(a_n)$ jest określony wzorem $a_n=(-1)^n\cdot(n-${d})$ dla $n\geq1$. Oceń prawdziwość stwierdzeń.`, steps: [] };
  });
  reg('arytm', ['2506-15.1', '2506-15.2', '2406-17', '2508-16', '2605-16'], ['f08-1', 'f08-2'], () => {
    const a1 = R.int(-20, 60), r = R.int(-6, 6) || 3, i = R.int(1, 5), j = i + R.int(3, 20), a = n => a1 + (n - 1) * r, t = R.int(0, 2);
    if (t === 0) return { q: T`W ciągu arytmetycznym $${nth(i)}=${a(i)}$ oraz $${nth(j)}=${a(j)}$. Różnica ciągu jest równa`, opts: opts(no(r), [[qo(Q(a(j) - a(i), j - i + 1)), 'Między $a_{' + i + '}$ a $a_{' + j + '}$ jest $' + (j - i) + '$ kroków, nie $' + (j - i + 1) + '$.'], [no(-r), 'Zły znak różnicy.'], [qo(Q(a(j) - a(i), j)), 'Dzielimy przez liczbę kroków $' + (j - i) + '$.'], [no(a(j) - a(i)), 'Trzeba podzielić przez liczbę kroków.']]), steps: [T`$${nth(j)}=${nth(i)}+${j - i}r\Rightarrow r=\frac{${a(j)}-(${a(i)})}{${j - i}}=${r}$.`] };
    if (t === 1) { const k = j + R.int(1, 6); return { q: T`W ciągu arytmetycznym $${nth(i)}=${a(i)}$ oraz $${nth(j)}=${a(j)}$. Wyraz $${nth(k)}$ jest równy`, opts: opts(no(a(k)), [[no(a(k) - r), 'O jeden krok za mało.'], [no(a(k) + r), 'O jeden krok za dużo.'], [no(a(j) + (k - j) * (a(j) - a(i))), 'Różnica $r$ to przyrost na jeden krok, nie na ' + (j - i) + '.'], [no(a(i) + k * r), 'Od $a_{' + i + '}$ do $a_{' + k + '}$ jest $' + (k - i) + '$ kroków.']]), steps: [T`$r=\frac{${a(j)}-(${a(i)})}{${j - i}}=${r}$, $${nth(k)}=${nth(j)}+${k - j}r=${a(k)}$.`] }; }
    const n = j, S = (a(1) + a(n)) * n / 2; if (!Number.isInteger(S)) return null;
    return { q: T`W ciągu arytmetycznym $a_1=${a(1)}$ oraz $${nth(n)}=${a(n)}$. Suma $S_{${n}}$ jest równa`, opts: opts(no(S), [[no((a(1) + a(n)) * n), 'Zapomniane dzielenie przez 2.'], [no((a(1) + a(n)) / 2 * (n - 1)), 'Mnożymy przez liczbę wyrazów $n=' + n + '$.'], [no(a(1) * n + a(n)), '$S_n=\\frac{a_1+a_n}{2}\\cdot n$.'], [no(S + n), 'Sprawdź rachunek.']]), steps: [T`$S_{${n}}=\frac{${a(1)}+${a(n) < 0 ? '(' + a(n) + ')' : a(n)}}{2}\cdot ${n}=${S}$.`] };
  });
  reg('arytmTrzy', ['2306-17', '2408-15'], ['f08-3'], () => {
    const a = R.int(-5, 8), r = R.int(-6, 6) || 3, k = R.int(2, 6); // (a, a+r, (ostatni) a+2r = x + k)
    const x = a + 2 * r - k;
    return { q: T`Trzywyrazowy ciąg $(${a}, ${a + r}, x${sgn(k)})$ jest arytmetyczny. Liczba $x$ jest równa`, opts: opts(no(x), [[no(a + 2 * r), 'To trzeci wyraz, a $x$ jest od niego o ' + k + ' mniejsze.'], [no(2 * (a + r) + a - k), 'Środkowy wyraz to średnia sąsiadów: $2b=a+c$.'], [a ? qo(qsub(Q((a + r) ** 2, a), Q(k))) : null, 'To warunek dla ciągu geometrycznego.'], [no(x + 2 * r), 'Sprawdź: $c-b$ musi być równe $b-a$.']]), steps: [T`$2\cdot ${a + r}=${a}+(x${sgn(k)})\Rightarrow x=${x}$.`] };
  });
  reg('arytmGeomZnaki', ['2406-18', '2508-18'], ['f08-3', 'f08-6'], () => {
    const a = R.pick([-3, -2, -1, 1, 2, 3]), b = R.pick([-3, -2, -1, 1, 2, 4].filter(v => v !== a)), x = 2 * b - a, y = Q(b * b, a), ys = Math.sign(y.n);
    if (!x) return null; const sg = (n, v) => n + (v > 0 ? '>0' : '<0');
    return { q: T`Ciąg $(${a}, ${b}, x)$ jest arytmetyczny, a ciąg $(${a}, ${b}, y)$ — geometryczny. Liczby $x$ i $y$ spełniają warunki`, opts: opts(T`${sg('x', x)}\ \text{i}\ ${sg('y', ys)}`, [[T`${sg('x', -x)}\ \text{i}\ ${sg('y', ys)}`, '$x=2\\cdot' + b + '-(' + a + ')=' + x + '$.'], [T`${sg('x', x)}\ \text{i}\ ${sg('y', -ys)}`, '$y=\\frac{' + b + '^2}{' + a + '}$ — znak taki jak $' + a + '$.'], [T`${sg('x', -x)}\ \text{i}\ ${sg('y', -ys)}`, 'Oba znaki odwrotnie.']]), steps: [T`$x=2\cdot ${b}-(${a})=${x}$, $y=\frac{${b}^2}{${a}}=${qt(y)}$.`] };
  });
  reg('geom', ['2306-18', '2408-14', '2505-16', '2508-17', '2308-17', '2608-14.2'], ['f08-4', 'f08-5'], () => {
    const a1 = R.pick([1, 2, 3, 4, 6, 8, 27, 81, 64]), q = R.pick([Q(2), Q(3), Q(-2), Q(1, 2), Q(-1, 2), Q(1, 3)]), a = n => { let v = Q(a1); for (let i = 1; i < n; i++) v = qmul(v, q); return v; }, t = R.int(0, 3);
    if (t === 0) { const i = R.int(1, 3), j = i + R.int(2, 3); const qn = q; return { q: T`W ciągu geometrycznym $${nth(i)}=${qt(a(i))}$ oraz $${nth(j)}=${qt(a(j))}$. Iloraz ciągu jest równy`, opts: opts(qo(qn), [[qo(qdiv(a(j), a(i))), 'To $q^{' + (j - i) + '}$ — trzeba wyciągnąć pierwiastek stopnia ' + (j - i) + '.'], [qo(Q(qn.d, qn.n)), 'Odwrotność ilorazu: $q=\\frac{a_{n+1}}{a_n}$.'], [qo(Q(-qn.n, qn.d)), (j - i) % 2 ? 'Pierwiastek nieparzystego stopnia zachowuje znak.' : 'Sprawdź znak.'], [qo(qdiv(qsub(a(j), a(i)), Q(j - i))), 'To ciąg geometryczny — dzielimy wyrazy, nie odejmujemy.']]), steps: [T`$${nth(j)}=${nth(i)}\cdot q^{${j - i}}\Rightarrow q^{${j - i}}=${qt(qdiv(a(j), a(i)))}\Rightarrow q=${qt(qn)}$.`] }; }
    if (t === 1) { const k = R.int(3, 5); return { q: T`W ciągu geometrycznym $a_1=${a1}$ oraz $a_2=${qt(a(2))}$. Wyraz $${nth(k)}$ jest równy`, opts: opts(qo(a(k)), [[qo(a(k + 1)), 'To $a_{' + (k + 1) + '}$: $a_n=a_1q^{n-1}$.'], [qo(a(k - 1)), 'To $a_{' + (k - 1) + '}$.'], [qo(qadd(Q(a1), qmul(Q(k - 1), qsub(a(2), Q(a1))))), 'To wynik dla ciągu arytmetycznego.'], [qo(Q(-a(k).n, a(k).d)), 'Sprawdź znak: $q=' + qt(q) + '$.']]), steps: [T`$q=\frac{a_2}{a_1}=${qt(q)}$, $${nth(k)}=${a1}\cdot\left(${qt(q)}\right)^{${k - 1}}=${qt(a(k))}$.`] }; }
    if (t === 2) { const S3 = qadd(qadd(a(1), a(2)), a(3)); return { q: T`W ciągu geometrycznym $a_1=${a1}$ oraz $a_2=${qt(a(2))}$. Suma trzech początkowych wyrazów jest równa`, opts: opts(qo(S3), [[qo(qadd(a(1), a(2))), 'Brakuje $a_3$.'], [qo(qadd(qadd(a(1), qmul(a(2), Q(-1))), a(3))), 'Sprawdź znak $a_2$.'], [qo(a(3)), 'To tylko $a_3$.'], [qo(qmul(Q(3), a(2))), 'To byłoby dla ciągu arytmetycznego.']]), steps: [T`$q=${qt(q)}$, $a_3=${qt(a(3))}$; $S_3=${qt(S3)}$.`] }; }
    const inc = (a1 > 0 && q.n / q.d > 1) || (a1 < 0 && q.n / q.d < 1 && q.n > 0); const mono = q.n < 0 ? 'nie jest monotoniczny' : inc ? 'rosnący' : 'malejący';
    return { q: T`Ciąg $(a_n)$ jest określony wzorem $a_n=${a1}\cdot\left(${qt(q)}\right)^{n-1}$. Ciąg $(a_n)$ jest`, opts: opts(T`\text{geometryczny i ${mono}}`, [[T`\text{arytmetyczny i ${mono === 'rosnący' ? 'malejący' : 'rosnący'}}`, 'Kolejne wyrazy powstają przez mnożenie — to ciąg geometryczny.'], [T`\text{geometryczny i ${mono === 'rosnący' ? 'malejący' : mono === 'malejący' ? 'rosnący' : 'rosnący'}}`, q.n < 0 ? 'Ujemny iloraz — znaki się przeplatają, ciąg nie jest monotoniczny.' : 'Sprawdź pierwsze wyrazy: $' + [1, 2, 3].map(n => qt(a(n))).join(', ') + '$.'], [T`\text{arytmetyczny i ${mono === 'rosnący' ? 'rosnący' : 'malejący'}}`, 'To ciąg geometryczny, nie arytmetyczny.'], [T`\text{stały}`, 'Iloraz różny od 1 — ciąg nie jest stały.']]), steps: [T`Ciąg geometryczny o ilorazie $${qt(q)}$; pierwsze wyrazy: $${[1, 2, 3].map(n => qt(a(n))).join(', ')}$.`] };
  });
  reg('geomTrzy', ['2305-16', '2506-16', '2608-16', '2405-16'], ['f08-6'], () => {
    const a = R.pick([2, 3, 4, 8, 12, 16, 27, 18]), q = R.pick([Q(1, 2), Q(1, 3), Q(2), Q(3), Q(-2), Q(-1, 2)]), b = qmul(Q(a), q), c = qmul(b, q); if (c.d !== 1 || b.d !== 1) return null; const k = R.int(1, 5);
    return { q: T`Trzywyrazowy ciąg $(${a}, ${b.n}, x${sgn(-k)})$ jest geometryczny. Liczba $x$ jest równa`, opts: opts(no(c.n + k), [[no(c.n), 'To trzeci wyraz; $x$ jest o $' + k + '$ większe.'], [no(2 * b.n - a + k), 'To warunek ciągu arytmetycznego — dla geometrycznego $b^2=ac$.'], [no(c.n - k), 'Przenosząc $' + -k + '$, zmieniamy znak.'], [no(b.n * b.n + k), 'Trzeba podzielić przez $' + a + '$.']]), steps: [T`$${b.n < 0 ? '(' + b.n + ')' : b.n}^2=${a}\cdot(x-${k})\Rightarrow x-${k}=${c.n}\Rightarrow x=${c.n + k}$.`] };
  });
  reg('geomIloczyn', ['2605-17', '2606-16'], ['f08-4', 'f08-6'], () => {
    if (R.int(0, 1)) { const m = R.int(2, 4) * R.pick([1, -1]), P = m ** 5; return { q: T`Pięciowyrazowy ciąg $(a_1, a_2, ${m}, a_4, a_5)$ jest geometryczny. Iloczyn $a_1\cdot a_2\cdot ${m}\cdot a_4\cdot a_5$ jest równy`, opts: opts(no(P), [[no(m ** 3), '$a_1a_5=a_2a_4=a_3^2$ — iloczyn to $a_3^5$.'], [no(5 * m), 'To iloczyn, nie suma.'], [no(m ** 4), 'Pięć czynników.'], [no(-P), 'Sprawdź znak.']]), steps: [T`$a_1a_5=a_2a_4=${m}^2$, więc iloczyn to $${m}^2\cdot ${m}^2\cdot ${m}=${m}^5=${P}$.`] }; }
    const i = R.int(2, 4), j = i + R.int(2, 4), s = R.int(1, i - 1), P = R.int(5, 40);
    return { q: T`W ciągu geometrycznym $${nth(i)}\cdot ${nth(j)}=${P}$. Iloczyn $${nth(i - s)}\cdot ${nth(j + s)}$ jest równy`, opts: opts(String(P), [[String(P * 2), 'Suma indeksów jest taka sama ($' + (i + j) + '$) — iloczyny są równe.'], [String(P * P), 'Iloczyn jest równy, nie podniesiony do kwadratu.'], [qo(Q(P, 2)), 'Iloczyny wyrazów o tej samej sumie indeksów są równe.'], [String(P + s), 'Iloczyn nie zależy od przesunięcia, gdy suma indeksów się nie zmienia.']]), steps: [T`$${nth(i - s)}\cdot ${nth(j + s)}=a_1^2q^{${i + j - 2}}=${nth(i)}\cdot ${nth(j)}=${P}$ (ta sama suma indeksów).`] };
  });

  /* =================== DZIAŁ VII: trygonometria =================== */
  const TRIPLES = [[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25], [20, 21, 29], [9, 40, 41]];
  reg('trygJedynka', ['2308-19', '2408-16', '2508-19', '2606-21'], ['f09-4', 'f09-1'], () => {
    const [p, q, r] = R.pick(TRIPLES), sw = R.int(0, 1), A2 = sw ? p : q, B2 = sw ? q : p, ask = R.int(0, 1), obt = R.int(0, 3) === 0;
    // cos α = A2/r → sin α = B2/r, tg = B2/A2
    if (obt) { const v = Q(-A2, r); return { q: T`Kąt $\alpha$ jest rozwarty oraz $\sin\alpha=${qt(Q(B2, r))}$. Cosinus kąta $\alpha$ jest równy`, opts: opts(qo(v), [[qo(Q(A2, r)), 'Kąt rozwarty — cosinus jest ujemny.'], [qo(Q(-B2, A2)), 'To tangens, a pytamy o cosinus.'], [qo(Q(B2, A2)), 'To tangens kąta ostrego.'], [qo(Q(-B2, r)), 'To minus sinus — użyj jedynki trygonometrycznej.']]), steps: [T`$\cos^2\alpha=1-${qt(Q(B2 * B2, r * r))}=${qt(Q(A2 * A2, r * r))}$; kąt rozwarty, więc $\cos\alpha=${qt(v)}$.`] }; }
    if (ask) { const v = Q(B2, A2); return { q: T`Kąt $\alpha$ jest ostry oraz $\cos\alpha=${qt(Q(A2, r))}$. Tangens kąta $\alpha$ jest równy`, opts: opts(qo(v), [[qo(Q(A2, B2)), 'Odwrotnie: $\\operatorname{tg}\\alpha=\\frac{\\sin\\alpha}{\\cos\\alpha}$.'], [qo(Q(B2, r)), 'To sinus, a nie tangens.'], [qo(Q(r - A2, r)), 'Sinus to nie $1-\\cos\\alpha$ — użyj jedynki: $\\sin^2+\\cos^2=1$.'], [qo(Q(r, A2)), 'To odwrotność cosinusa.']]), steps: [T`$\sin\alpha=\sqrt{1-${qt(Q(A2 * A2, r * r))}}=${qt(Q(B2, r))}$, $\operatorname{tg}\alpha=\frac{\sin\alpha}{\cos\alpha}=${qt(v)}$.`] }; }
    const v = Q(B2, r); return { q: T`Kąt $\alpha$ jest ostry oraz $\cos\alpha=${qt(Q(A2, r))}$. Sinus kąta $\alpha$ jest równy`, opts: opts(qo(v), [[qo(Q(B2 * B2, r * r)), 'To $\\sin^2\\alpha$ — trzeba jeszcze spierwiastkować.'], [qo(Q(r - A2, r)), '$\\sin\\alpha\\neq1-\\cos\\alpha$.'], [qo(Q(B2, A2)), 'To tangens.'], [qo(Q(A2, B2)), 'Odwrócony iloraz.']]), steps: [T`$\sin^2\alpha=1-\cos^2\alpha=${qt(Q(B2 * B2, r * r))}$, kąt ostry: $\sin\alpha=${qt(v)}$.`] };
  });
  reg('trygWartosci', ['2508-20'], ['f09-5'], () => {
    const V = { 30: ['\\frac12', '\\frac{\\sqrt3}{2}'], 45: ['\\frac{\\sqrt2}{2}', '\\frac{\\sqrt2}{2}'], 60: ['\\frac{\\sqrt3}{2}', '\\frac12'] }, a = R.pick([30, 60]), b = 90 - a;
    if (R.int(0, 2)) { const k = R.int(1, 5), m = R.int(1, 5), v = Q(k + m, 2), w = (n => n === 1 ? '' : n);
      return { q: T`Liczba $${w(k)}\sin30^\circ+${w(m)}\cos60^\circ$ jest równa`, opts: opts(qo(v), [[T`${qt(Q(k + m, 2))}\sqrt3`, '$\\sin30^\\circ=\\cos60^\\circ=\\frac12$ — bez $\\sqrt3$.'], [T`${qt(Q(k, 2))}+${m === 2 ? '' : qt(Q(m, 2))}\sqrt3`, '$\\cos60^\\circ=\\frac12$, a $\\frac{\\sqrt3}{2}$ to $\\cos30^\\circ$.'], [String(k + m), 'Zapomniane $\\frac12$.'], [qo(Q(k * m, 4)), 'To suma, nie iloczyn.']]), steps: [T`$${w(k)}\cdot\frac12+${w(m)}\cdot\frac12=${qt(v)}$.`] }; }
    return { q: T`Liczba $\sin${a}^\circ\cdot\cos${b}^\circ+\sin${b}^\circ\cdot\cos${a}^\circ$ jest równa`, opts: opts('1', [['\\frac12', 'Każdy iloczyn to $\\frac14$ albo $\\frac34$ — razem $1$.'], ['\\frac{\\sqrt3}{2}', 'Podstaw wartości z tabeli i policz dokładnie.'], ['\\frac{\\sqrt2}{2}', 'To wartość dla $45^\\circ$.'], ['\\frac{\\sqrt3}{4}', 'Dodaj oba iloczyny.']]), steps: [T`$${V[a][0]}\cdot ${V[b][1]}+${V[b][0]}\cdot ${V[a][1]}=1$ (bo $\sin${a}^\circ=\cos${b}^\circ$ — to $\sin^2+\cos^2$).`] };
  });
  reg('trygTozsam', ['2305-19', '2306-19', '2405-19', '2406-19', '2506-17'], ['f09-4'], () => {
    const t = R.int(0, 3), ang = R.pick([15, 20, 25, 27, 35, 40]);
    if (t === 0) return { q: T`Liczba $\sin^3${ang}^\circ+\cos^2${ang}^\circ\cdot\sin${ang}^\circ$ jest równa`, opts: opts(T`\sin${ang}^\circ`, [[T`\cos${ang}^\circ`, 'Wyłącz $\\sin' + ang + '^\\circ$: zostaje $\\sin^2+\\cos^2=1$.'], [T`\operatorname{tg}${ang}^\circ`, 'Nic tu nie dzielimy przez cosinus.'], [T`\sin${ang}^\circ\cdot\cos${ang}^\circ`, 'Wyłączamy $\\sin' + ang + '^\\circ$ z obu składników.'], ['1', 'Po wyłączeniu zostaje $\\sin' + ang + '^\\circ\\cdot1$.']]), steps: [T`$\sin${ang}^\circ(\sin^2${ang}^\circ+\cos^2${ang}^\circ)=\sin${ang}^\circ$.`] };
    if (t === 1) return { q: T`Liczba $\dfrac{\sin^3${ang}^\circ+\sin${ang}^\circ\cdot\cos^2${ang}^\circ}{\cos${ang}^\circ}$ jest równa`, opts: opts(T`\operatorname{tg}${ang}^\circ`, [[T`\sin${ang}^\circ`, 'Zapomniany mianownik $\\cos' + ang + '^\\circ$.'], [T`\cos${ang}^\circ`, 'Licznik to $\\sin' + ang + '^\\circ$, a dzielimy przez $\\cos$.'], ['1', 'Wynik to $\\frac{\\sin}{\\cos}$.'], [T`\frac{1}{\operatorname{tg}${ang}^\circ}`, 'Odwrotnie.']]), steps: [T`Licznik: $\sin${ang}^\circ(\sin^2+\cos^2)=\sin${ang}^\circ$; po podzieleniu: $\operatorname{tg}${ang}^\circ$.`] };
    if (t === 2) { const k = R.int(1, 3); return { q: T`Liczba $${k}+\cos^2${ang}^\circ$ jest równa`, opts: opts(T`${k + 1}-\sin^2${ang}^\circ`, [[T`${k - 1 === 0 ? '' : k - 1}${k - 1 === 0 ? '' : '+'}\sin^2${ang}^\circ`, '$\\cos^2=1-\\sin^2$, a nie $\\sin^2-1$.'], [T`${k + 1}+\sin^2${ang}^\circ`, 'Zły znak przy $\\sin^2$.'], [String(k + 1), '$\\cos^2' + ang + '^\\circ\\neq1$.'], [T`\sin^2${ang}^\circ`, 'Zgubione $' + k + '$.']]), steps: [T`$\cos^2${ang}^\circ=1-\sin^2${ang}^\circ$, więc $${k}+\cos^2=${k + 1}-\sin^2${ang}^\circ$.`] }; }
    return { q: T`Dla każdego kąta ostrego $\alpha$ wyrażenie $\cos\alpha-\cos\alpha\cdot\sin^2\alpha$ jest równe`, opts: opts('\\cos^3\\alpha', [['\\sin^2\\alpha', 'Wyłącz $\\cos\\alpha$: $\\cos\\alpha(1-\\sin^2\\alpha)$.'], ['1-\\sin^2\\alpha', 'To tylko nawias — zapomniano o czynniku $\\cos\\alpha$.'], ['\\cos\\alpha', '$1-\\sin^2\\alpha=\\cos^2\\alpha\\neq1$.'], ['\\cos^2\\alpha', 'Wynik to $\\cos\\alpha\\cdot\\cos^2\\alpha$.']]), steps: ['$\\cos\\alpha(1-\\sin^2\\alpha)=\\cos\\alpha\\cdot\\cos^2\\alpha=\\cos^3\\alpha$.'] };
  });
  reg('trygWarunek', ['2505-17', '2605-23', '2608-17'], ['f09-4', 'f09-5'], () => {
    if (R.int(0, 1)) { const [k, c] = R.pick([['\\sqrt3', '\\frac{\\sqrt3}{2}'], ['\\sqrt2', '\\frac{\\sqrt2}{2}'], ['1', '\\frac12']]); // k tg α = 2 sin α → cos α = k/2
      return { q: T`Kąt $\alpha$ jest ostry i $${k === '1' ? '' : k}\operatorname{tg}\alpha=2\sin\alpha$. Cosinus kąta $\alpha$ jest równy`, opts: opts(c, [[k === '1' ? '\\frac{\\sqrt3}{2}' : '\\frac12', '$\\operatorname{tg}\\alpha=\\frac{\\sin\\alpha}{\\cos\\alpha}$ — podziel obie strony przez $\\sin\\alpha$.'], [k === '\\sqrt3' ? '\\frac{\\sqrt3}{3}' : '\\frac{\\sqrt3}{3}', 'Z równania: $\\cos\\alpha=\\frac{' + k + '}{2}$.'], ['2', 'Cosinus kąta ostrego jest mniejszy od 1.'], [k === '\\sqrt2' ? '\\frac{\\sqrt3}{2}' : '\\frac{\\sqrt2}{2}', 'Sprawdź: $\\cos\\alpha=\\frac{' + k + '}{2}$.']]), steps: [T`$${k === '1' ? '' : k}\frac{\sin\alpha}{\cos\alpha}=2\sin\alpha$, dzielimy przez $\sin\alpha\neq0$: $\cos\alpha=\frac{${k}}{2}$.`] }; }
    const a = R.int(1, 4), b = R.int(1, 4), k = R.int(3, 8); // (a sin + b cos)/(b cos) = k → a tg / b = k − 1 → tg = b(k−1)/a
    const v = Q(b * (k - 1), a);
    return { q: T`Kąt $\alpha$ jest ostry i $\dfrac{${a === 1 ? '' : a}\sin\alpha+${b === 1 ? '' : b}\cos\alpha}{${b === 1 ? '' : b}\cos\alpha}=${k}$. Tangens kąta $\alpha$ jest równy`, opts: opts(qo(v), [[qo(Q(b * k, a)), 'Rozbij ułamek: $\\frac{' + a + '\\sin\\alpha}{' + b + '\\cos\\alpha}+1=' + k + '$.'], [qo(Q(a, b * (k - 1))), 'Odwrócony wynik.'], [qo(Q(k - 1)), 'Uwzględnij współczynniki $' + a + '$ i $' + b + '$.'], [qo(Q(b * (k + 1), a)), 'Przenosząc 1, odejmujemy.']]), steps: [T`$\frac{${a}\sin\alpha}{${b}\cos\alpha}+1=${k}\Rightarrow \frac{${a}}{${b}}\operatorname{tg}\alpha=${k - 1}\Rightarrow\operatorname{tg}\alpha=${qt(v)}$.`] };
  });
  reg('trygTrojkat', ['2505-18.1', '2505-18.2', '2506-18', '2605-18', '2406-20', '2408-17', '2608-20', '2606-25'], ['f09-1', 'f10-1'], () => {
    const [p, q, r] = R.pick(TRIPLES), s = R.int(1, 3), a = p * s, b = q * s, c = r * s, t = R.int(0, 2);
    const pic = 'W trójkącie prostokątnym przyprostokątne mają długości $' + a + '$ i $' + b + '$, a kąt $\\alpha$ leży naprzeciwko boku $' + a + '$.';
    if (t === 0) return { q: pic + ' Sinus kąta $\\alpha$ jest równy', opts: opts(qo(Q(a, c)), [[qo(Q(b, c)), 'To cosinus: przyprostokątna <b>przy</b> kącie przez przeciwprostokątną.'], [qo(Q(a, b)), 'To tangens.'], [qo(Q(c, a)), 'Odwrotny iloraz.'], [qo(Q(b, a)), 'To odwrotność tangensa.']]), steps: [T`Przeciwprostokątna: $\sqrt{${a}^2+${b}^2}=${c}$. $\sin\alpha=\frac{${a}}{${c}}=${qt(Q(a, c))}$.`] };
    if (t === 1) return { q: pic + ' Tangens kąta $\\alpha$ jest równy', opts: opts(qo(Q(a, b)), [[qo(Q(b, a)), 'Odwrotnie: naprzeciw przez przyległą.'], [qo(Q(a, c)), 'To sinus.'], [qo(Q(b, c)), 'To cosinus.'], [qo(Q(c, b)), 'Przeciwprostokątna nie występuje w tangensie.']]), steps: [T`$\operatorname{tg}\alpha=\frac{${a}}{${b}}=${qt(Q(a, b))}$.`] };
    const d = c - a; return { q: T`W trójkącie prostokątnym sinus kąta $\alpha$ jest równy $${qt(Q(p, r))}$, a przeciwprostokątna jest o $${d}$ dłuższa od przyprostokątnej leżącej naprzeciw kąta $\alpha$. Przeciwprostokątna ma długość`, opts: opts(String(c), [[String(a), 'To przyprostokątna naprzeciw kąta.'], [String(b), 'To druga przyprostokątna.'], [String(c + d), 'Sprawdź: $' + (c + d) + '-' + (a + d) + '$ — sinus się nie zgadza.'], [String(r * d), 'Ułóż równanie: $c-\\frac{' + p + '}{' + r + '}c=' + d + '$.']]), steps: [T`Naprzeciw: $\frac{${p}}{${r}}c$; $c-\frac{${p}}{${r}}c=${d}\Rightarrow c=${c}$.`] };
  });
  reg('trygKatWsp', ['2305-18', '2405-18'], ['f09-2'], () => {
    const x = R.pick([-4, -3, -2, -1, 1, 2, 3, 4]), y = R.pick([1, 2, 3, 4]), r2 = x * x + y * y, r = Math.sqrt(r2), rt = Number.isInteger(r) ? String(r) : T`\sqrt{${r2}}`;
    const t = R.int(0, 1);
    if (t === 0) return { q: T`Ramię kąta $\alpha$ przechodzi przez punkt $P=(${x}, ${y})$ (drugie ramię to dodatnia półoś $Ox$). Tangens kąta $\alpha$ jest równy`, opts: opts(qo(Q(y, x)), [[qo(Q(x, y)), '$\\operatorname{tg}\\alpha=\\frac yx$, nie $\\frac xy$.'], [qo(Q(-y, x)), 'Znak tangensa zależy od znaku $x$ — punkt jest w ' + (x > 0 ? 'I' : 'II') + ' ćwiartce.'], [qo(Q(Math.abs(x), y)), 'Odwrotny iloraz i zgubiony znak.'], [qo(Q(y, Math.abs(x) + 1)), 'Odczytaj współrzędne dokładnie.']]), steps: [T`$\operatorname{tg}\alpha=\frac{y}{x}=\frac{${y}}{${x}}=${qt(Q(y, x))}$.`] };
    return { q: T`Ramię kąta $\alpha$ przechodzi przez punkt $P=(${x}, ${y})$ (drugie ramię to dodatnia półoś $Ox$). Cosinus kąta $\alpha$ jest równy`, opts: opts(opt(fracSurd(x, r2)), [[opt(fracSurd(y, r2)), 'To sinus: $\\sin\\alpha=\\frac yr$.'], [opt(fracSurd(-x, r2)), 'Znak cosinusa = znak $x$ (punkt w ' + (x > 0 ? 'I' : 'II') + ' ćwiartce).'], [qo(Q(x, y)), 'To odwrotność tangensa — w cosinusie dzielimy przez $r=|OP|$.'], [qo(Q(x, r2)), '$r=\\sqrt{x^2+y^2}$ — nie zapomnij o pierwiastku.']]), steps: [T`$r=\sqrt{${x * x}+${y * y}}=${surd(r2)}$, $\cos\alpha=\frac{x}{r}=${fracSurd(x, r2)}$.`] };
  });
  reg('trygPoleCos', ['2505-21', '2508-22.1', '2508-22.2', '2408-18', '2306-20'], ['f10-3', 'f10-4'], () => {
    const a = R.int(3, 9), b = R.int(2, 8), t = R.int(0, 1);
    if (t === 0) { const [ang, s] = R.pick([[60, '\\frac{\\sqrt3}{2}'], [30, '\\frac12'], [45, '\\frac{\\sqrt2}{2}'], [120, '\\frac{\\sqrt3}{2}']]); const P = a * b; // ½ a b sin
      const val = ang === 30 ? qo(Q(P, 4)) : ang === 45 ? T`${qt(Q(P, 4))}\sqrt2` : T`${qt(Q(P, 4))}\sqrt3`;
      return { q: T`W trójkącie $ABC$: $|AB|=${a}$, $|AC|=${b}$, $|\angle CAB|=${ang}^\circ$. Pole trójkąta $ABC$ jest równe`, opts: opts(val, [[ang === 30 ? qo(Q(P, 2)) : T`${qt(Q(P, 2))}${ang === 45 ? '\\sqrt2' : '\\sqrt3'}`, 'Wzór ma $\\frac12$: $P=\\frac12ab\\sin\\alpha$.'], [String(P), 'Pominięty sinus i $\\frac12$.'], [qo(Q(P, 2)), 'Pominięty $\\sin' + ang + '^\\circ=' + s + '$.'], [ang === 30 ? T`${qt(Q(P, 4))}\sqrt3` : qo(Q(P, 4)), 'Pomylone wartości funkcji trygonometrycznych.']]), steps: [T`$P=\frac12\cdot ${a}\cdot ${b}\cdot\sin${ang}^\circ=\frac12\cdot ${a * b}\cdot ${s}=${val}$.`] }; }
    const [cn, cd] = R.pick([[1, 2], [3, 5], [1, 3], [-1, 2], [2, 5]]); const c2 = Q(a * a + b * b, 1), sq = qsub(c2, Q(2 * a * b * cn, cd)); if (sq.d !== 1 || sq.n <= 0) return null;
    const rt = surd(sq.n), cosT = qt(Q(cn, cd)), sr = q2 => (q2.d === 1 && q2.n > 0 ? surd(q2.n) : null);
    return { q: T`W trójkącie $ABC$: $|AB|=${a}$, $|AC|=${b}$, $\cos|\angle BAC|=${cosT}$. Długość boku $BC$ jest równa`, opts: opts(rt, [[surd(a * a + b * b), 'To Pitagoras — kąt nie jest prosty, potrzebne $-2ab\\cos\\alpha$.'], [sr(qadd(c2, Q(2 * a * b * cn, cd))), 'Zły znak: $a^2+b^2-2ab\\cos\\alpha$.'], [sr(qsub(c2, Q(a * b * cn, cd))), 'Zapomniane $2$ w $2ab\\cos\\alpha$.'], [String(sq.n), 'To $|BC|^2$ — trzeba spierwiastkować.']]), steps: [T`$|BC|^2=${a}^2+${b}^2-2\cdot ${a}\cdot ${b}\cdot ${cn < 0 ? '(' + cosT + ')' : cosT}=${sq.n}$, więc $|BC|=${rt}$.`] };
  });

  /* =================== DZIAŁ VIII: planimetria =================== */
  const dg = v => (Number.isInteger(v) && v > 0 && v < 360 ? v + '^\\circ' : null);
  reg('katyOkrag', ['2508-21.1', '2305-21', '2306-23', '2308-22', '2405-22', '2406-21', '2408-19', '2505-19', '2506-20', '2605-19', '2606-18', '2608-18'], ['f10-13'], () => {
    const t = R.int(0, 6);
    if (t === 0) { const a = R.int(12, 85); return { q: T`Punkty $A$, $B$, $C$ leżą na okręgu o środku $S$. Kąt wpisany $ACB$ ma miarę $${a}^\circ$. Kąt środkowy $ASB$, oparty na tym samym łuku, ma miarę`, opts: opts(dg(2 * a), [[dg(a), 'Kąt środkowy jest <b>dwa razy większy</b> od wpisanego opartego na tym samym łuku.'], [dg(a / 2), 'Odwrotnie: to wpisany jest połową środkowego.'], [dg(180 - a), 'To nie czworokąt wpisany — kąt środkowy to $2\\alpha$.'], [dg(180 - 2 * a), 'To kąt przy wierzchołku trójkąta równoramiennego... ale pytamy o kąt środkowy $2\\alpha$.']]), steps: [T`$|\angle ASB|=2\cdot ${a}^\circ=${2 * a}^\circ$.`] }; }
    if (t === 1) { const b = 2 * R.int(50, 85); return { q: T`Punkty $K$, $L$, $M$ leżą na okręgu o środku $S$. Kąt środkowy $KSM$ ma miarę $${b}^\circ$, a punkt $L$ leży na krótszym łuku $KM$. Kąt wpisany $KLM$ ma miarę`, opts: opts(dg(180 - b / 2), [[dg(b / 2), 'Kąt $KLM$ jest oparty na <b>dłuższym</b> łuku (bo $L$ leży na krótszym) — połowa z $360^\\circ-' + b + '^\\circ$.'], [dg(b), 'Kąt wpisany to połowa kąta środkowego.'], [dg(360 - b), 'To kąt środkowy oparty na dłuższym łuku — jeszcze połowa.'], [dg(180 - b), 'Policz: $\\frac{360^\\circ-' + b + '^\\circ}{2}$.']]), steps: [T`$L$ na krótszym łuku, więc $KLM$ jest oparty na łuku $360^\circ-${b}^\circ=${360 - b}^\circ$; $|\angle KLM|=\frac{${360 - b}^\circ}{2}=${180 - b / 2}^\circ$.`] }; }
    if (t === 2) { const x = 2 * R.int(13, 42); return { q: T`Punkty $A$, $B$, $C$ leżą na okręgu o środku $O$ (punkt $B$ na dłuższym łuku $AC$). Kąt $ACO$ ma miarę $${x}^\circ$. Kąt wpisany $ABC$ ma miarę`, opts: opts(dg(90 - x), [[dg(180 - 2 * x), 'To kąt środkowy $AOC$ — wpisany $ABC$ jest jego połową.'], [dg(x), '$|OA|=|OC|$, więc $|\\angle OAC|=' + x + '^\\circ$; dalej $|\\angle AOC|=180^\\circ-2\\cdot' + x + '^\\circ$.'], [dg(x / 2), 'Kąt $ACO$ to nie kąt wpisany ani środkowy.'], [dg(2 * x - 90 > 0 ? 2 * x - 90 : 90 + x), 'Sprawdź: najpierw kąt środkowy, potem połowa.']]), steps: [T`$|OA|=|OC|$, więc $|\angle AOC|=180^\circ-2\cdot ${x}^\circ=${180 - 2 * x}^\circ$; $|\angle ABC|=\frac12\cdot ${180 - 2 * x}^\circ=${90 - x}^\circ$.`] }; }
    if (t === 3) { const g = R.int(18, 80); return { q: T`Trójkąt $ABC$ jest wpisany w okrąg o środku $S$, a kąt $ACB$ ma miarę $${g}^\circ$. Miara kąta ostrego $BAS$ jest równa`, opts: opts(dg(90 - g), [[dg(g), 'Trójkąt $ASB$ jest równoramienny ($|SA|=|SB|$) z kątem $2\\cdot' + g + '^\\circ$ przy $S$.'], [dg(2 * g), 'To kąt środkowy $ASB$.'], [dg(180 - 2 * g), 'Suma kątów przy podstawie to $180^\\circ-2\\cdot' + g + '^\\circ$; jeden kąt to połowa.'], [dg(90 - g / 2), 'Kąt przy $S$ to $2\\gamma$, nie $\\gamma$.']]), steps: [T`$|\angle ASB|=2\cdot ${g}^\circ=${2 * g}^\circ$; trójkąt $ASB$ równoramienny: $|\angle BAS|=\frac{180^\circ-${2 * g}^\circ}{2}=${90 - g}^\circ$.`] }; }
    if (t === 4) { const d = R.int(15, 55); return { q: T`W okręgu kąt środkowy $\beta$ oraz kąt wpisany $\alpha$ są oparte na tym samym łuku. Kąt $\beta$ ma miarę o $${d}^\circ$ większą od kąta $\alpha$. Miara kąta $\beta$ jest równa`, opts: opts(dg(2 * d), [[dg(d), 'To miara $\\alpha$: z $2\\alpha=\\alpha+' + d + '^\\circ$ mamy $\\alpha=' + d + '^\\circ$.'], [dg(3 * d), '$\\beta=2\\alpha$, a nie $\\alpha+2\\cdot' + d + '^\\circ$.'], [dg(180 - 2 * d), 'Kąty nie dopełniają się do $180^\\circ$.'], [dg(4 * d), 'Sprawdź: $\\beta=2\\alpha=2\\cdot' + d + '^\\circ$.']]), steps: [T`$\beta=2\alpha$ i $\beta=\alpha+${d}^\circ$, więc $\alpha=${d}^\circ$, $\beta=${2 * d}^\circ$.`] }; }
    if (t === 5) { const k = R.pick([3, 4, 5, 6, 8, 9, 10, 12]); return { q: T`Długość łuku $AB$, na którym jest oparty kąt wpisany $ACB$, jest równa $\frac{1}{${k}}$ długości okręgu. Miara kąta $ACB$ jest równa`, opts: opts(dg(180 / k), [[dg(360 / k), 'To kąt środkowy $\\frac{360^\\circ}{' + k + '}$ — wpisany jest połową.'], [dg(90 / k), 'Łuk to $\\frac1{' + k + '}$ okręgu, czyli $\\frac{360^\\circ}{' + k + '}$, nie $\\frac{180^\\circ}{' + k + '}$.'], [dg(180 - 180 / k), 'Kąt wpisany to połowa środkowego.'], [dg(90 - 180 / k), 'To kąt przy podstawie trójkąta $ASB$.']]), steps: [T`Kąt środkowy: $\frac{360^\circ}{${k}}=${360 / k}^\circ$; wpisany: $${180 / k}^\circ$.`] }; }
    const n = R.pick([5, 6, 8, 9, 10, 12]), m = R.int(2, Math.floor(n / 2) - (n === 5 ? 0 : 1)), L = 'ABCDEFGHIJKL', P = L[0], Qv = L[m], X = L[m + 1 + R.int(0, n - m - 2)];
    if (!Number.isInteger(180 * m / n)) return null;
    return { q: T`Na ${n}-kącie foremnym $${L.slice(0, n)}$ opisano okrąg. Kąt wpisany $${P}${X}${Qv}$ ma miarę`, opts: opts(dg(180 * m / n), [[dg(360 * m / n), 'To kąt środkowy oparty na łuku $' + P + Qv + '$ — wpisany jest połową.'], [dg(180 / n), 'Łuk $' + P + Qv + '$ zawiera ' + m + ' boki, nie jeden.'], [dg(180 * (n - 2) / n), 'To kąt wewnętrzny wielokąta.'], [dg(360 / n), 'To kąt środkowy jednego boku.']]), steps: [T`Każdy bok to łuk $\frac{360^\circ}{${n}}=${360 / n}^\circ$; łuk $${P}${Qv}$ to $${m}\cdot ${360 / n}^\circ=${360 * m / n}^\circ$; kąt wpisany: $${180 * m / n}^\circ$.`] };
  });
  reg('dwusieczna', ['2308-23', '2405-20'], ['f10-9'], () => {
    const a = R.int(2, 9), b = R.int(2, 9); if (a === b) return null; const g = gcd(a, b), A2 = a / g, B2 = b / g, r = (x, y) => T`${x}:${y}`;
    return { q: T`W trójkącie $ABC$: $|AC|=${a}$, $|BC|=${b}$. Dwusieczna kąta $ACB$ przecina bok $AB$ w punkcie $D$. Stosunek $|AD|:|DB|$ jest równy`, opts: opts(r(A2, B2), [[r(B2, A2), 'Odcinek $AD$ leży przy boku $AC$: $\\frac{|AD|}{|DB|}=\\frac{|AC|}{|BC|}$.'], [r(A2, A2 + B2), 'To stosunek $|AD|:|AB|$.'], [r(B2, A2 + B2), 'To $|DB|:|AB|$.'], [r(1, 1), 'Dwusieczna kąta nie dzieli boku na połowy (to robi środkowa).']]), steps: [T`Twierdzenie o dwusiecznej: $\frac{|AD|}{|DB|}=\frac{|AC|}{|BC|}=\frac{${a}}{${b}}$.`] };
  });
  reg('tales', ['2605-20', '2606-19'], ['f10-10', 'f10-8'], () => {
    if (R.int(0, 1)) { const p = R.int(2, 9), q = R.int(2, 9), s = R.int(1, 6), v = Q(q * (p + s), p);
      return { q: T`Ramiona kąta o wierzchołku $A$ przecięto prostymi równoległymi $k$ i $l$: prosta $k$ w punktach $B$ i $C$, prosta $l$ w punktach $D$ i $E$ ($B$, $D$ na jednym ramieniu). $|AB|=${p}$, $|BC|=${q}$, $|BD|=${s}$ ($D$ dalej od $A$). Odcinek $DE$ ma długość`, opts: opts(qo(v), [[qo(Q(q * s, p)), 'Proporcja z $|AD|=' + (p + s) + '$, nie z $|BD|$: $\\frac{|DE|}{|BC|}=\\frac{|AD|}{|AB|}$.'], [qo(Q(q + s)), 'Twierdzenie Talesa daje proporcję, nie dodawanie.'], [qo(Q(p * (p + s), q)), 'Odwrócona proporcja.'], [qo(Q(q * p, p + s)), 'Dłuższy odcinek na dalszej prostej — $|DE|>|BC|$.']]), steps: [T`$\frac{|DE|}{|BC|}=\frac{|AD|}{|AB|}\Rightarrow |DE|=${q}\cdot\frac{${p + s}}{${p}}=${qt(v)}$.`] }; }
    const oa = R.int(4, 15), ob = R.int(2, 12), oc = R.int(2, 12); if (oa === oc) return null; const v = Q(oa * ob, oc);
    return { q: T`Proste $k\parallel l$. Prosta $m$ przecina je w punktach $A\in k$ i $C\in l$, a prosta $n$ — w punktach $D\in k$ i $B\in l$. Odcinki $AC$ i $BD$ przecinają się w $O$, $|OA|=${oa}$, $|OB|=${ob}$, $|OC|=${oc}$. Odcinek $OD$ ma długość`, opts: opts(qo(v), [[qo(Q(oc * ob, oa)), 'Trójkąt $OAD$ odpowiada $OCB$: $\\frac{|OD|}{|OB|}=\\frac{|OA|}{|OC|}$ — tu odwrotnie.'], [qo(Q(oa * oc, ob)), 'Pomylone odpowiadające boki.'], [qo(Q(oa + ob - oc)), 'To proporcja, nie dodawanie.'], [qo(Q(oa - ob + oc)), 'Trójkąty $OAD$ i $OCB$ są podobne — ułóż proporcję.']]), steps: [T`$\triangle OAD\sim\triangle OCB$: $\frac{|OD|}{|OB|}=\frac{|OA|}{|OC|}\Rightarrow |OD|=\frac{${oa}\cdot ${ob}}{${oc}}=${qt(v)}$.`] };
  });
  reg('podobSkala', ['2308-20', '2506-21', '2608-21', '2306-24'], ['f10-20', 'f10-8'], () => {
    const t = R.int(0, 2);
    if (t === 0) { const k = R.int(2, 4), P2 = R.int(3, 20), O2 = R.int(4, 20), P1 = P2 * k * k, O1 = O2 * k;
      return { q: T`Figura $F_1$ o polu $${P1}$ i obwodzie $${O1}$ jest podobna do figury $F_2$ o polu $${P2}$. Obwód figury $F_2$ jest równy`, opts: opts(String(O2), [[qo(Q(O1, k * k)), 'Pola mają się jak $k^2$, a obwody jak $k$: $k=\\sqrt{' + P1 / P2 + '}=' + k + '$.'], [qo(Q(O1 * P2, P1)), 'Obwody nie są proporcjonalne do pól.'], [String(O1 * k), 'Figura $F_2$ jest mniejsza.'], [qo(Q(O1, 2)), 'Skala wynika z pól: $k^2=' + P1 / P2 + '$.']]), steps: [T`$k^2=\frac{${P1}}{${P2}}=${k * k}\Rightarrow k=${k}$; obwód $F_2$: $\frac{${O1}}{${k}}=${O2}$.`] }; }
    if (t === 1) { const k = R.int(2, 5), a2 = R.pick([1, 2, 3, 4, 5]), S = a2 * (1 + k * k), a = surd(a2);
      return { q: T`Kwadrat $K_2$ jest podobny do kwadratu $K_1$ w skali $${k}$. Suma pól tych kwadratów jest równa $${S}$. Długość boku kwadratu $K_1$ jest równa`, opts: opts(a, [[String(a2), 'To pole kwadratu $K_1$ — bok to pierwiastek.'], [S % (1 + k) ? null : surd(S / (1 + k)), 'Pola mają się jak $k^2=' + (k * k) + '$, nie jak $k$.'], [surd(a2 * k * k), 'To bok większego kwadratu $K_2$.'], [surd(S), 'Najpierw $a^2+' + k * k + 'a^2=' + S + '$, potem pierwiastek z $a^2$.']]), steps: [T`$a^2+(${k}a)^2=${S}\Rightarrow ${1 + k * k}a^2=${S}\Rightarrow a^2=${a2}\Rightarrow a=${a}$.`] }; }
    const s = R.pick([[2, 3, 4], [3, 4, 5], [4, 5, 6], [2, 4, 5], [3, 5, 7]]), m = R.int(2, 4), O = (s[0] + s[1] + s[2]) * m, kk = R.int(1, 3), sc = s.map(x => x * kk);
    return { q: T`Trójkąt o bokach $${sc.join('$, $')}$ jest podobny do trójkąta $KLM$ o obwodzie $${O}$. Najkrótszy bok trójkąta $KLM$ ma długość`, opts: opts(String(s[0] * m), [[String(s[2] * m), 'To najdłuższy bok.'], [String(s[1] * m), 'To środkowy bok.'], [String(sc[0] + (O - sc[0] - sc[1] - sc[2])), 'Boki nie zwiększają się o stałą — skalujemy (mnożymy).'], [qo(Q(O, 3)), 'Boki nie są równe — dziel obwód w stosunku $' + s.join(':') + '$.']]), steps: [T`Obwód danego: $${sc[0] + sc[1] + sc[2]}$; skala $k=\frac{${O}}{${sc[0] + sc[1] + sc[2]}}=${qt(Q(O, sc[0] + sc[1] + sc[2]))}$; najkrótszy bok: $${sc[0]}\cdot ${qt(Q(O, sc[0] + sc[1] + sc[2]))}=${s[0] * m}$.`] };
  });
  reg('podobRownoram', ['2505-20'], ['f10-8'], () => {
    const b = R.int(3, 9), c = R.int(2, b), v = Q(c * c, b), dc = x => (x.d === 1 ? String(x.n) : [2, 4, 5, 8, 10, 20, 25].includes(x.d) ? dec(x.n / x.d) : qt(x));
    return { q: T`W trójkącie równoramiennym $ABC$: $|AC|=|BC|=${b}$, $|AB|=${c}$. Na boku $BC$ wybrano punkt $D$ taki, że trójkąty $ABC$ i $BDA$ są podobne. Odcinek $BD$ ma długość`, opts: opts(dc(v), [[dc(Q(b * b, c)), 'Odwrócona proporcja: $\\frac{|BD|}{|AB|}=\\frac{|AB|}{|BC|}$.'], [dc(Q(b - c)), 'Podobieństwo daje proporcję, nie różnicę.'], [dc(Q(c, 2)), '$D$ nie jest środkiem boku.'], [dc(Q(b * c, b + c)), 'Ułóż proporcję odpowiadających boków.']]), steps: [T`$\triangle ABC\sim\triangle BDA$: $\frac{|BD|}{|AB|}=\frac{|AB|}{|AC|}\Rightarrow |BD|=\frac{${c}^2}{${b}}=${dc(v)}$.`] };
  });
  reg('trapezPF', ['2306-22', '2508-23'], ['f10-8', 'f10-17'], () => {
    const k = R.int(2, 4), S = [
      [T`Trójkąt $ABE$ jest podobny do trójkąta $CDE$.`, true, 'Kąty naprzemianległe przy podstawach równoległych są równe (cecha kkk).'],
      [T`Pole trójkąta $ABE$ jest ${k} razy większe od pola trójkąta $CDE$.`, false, T`Skala podobieństwa to $${k}$, więc pola mają się jak $${k}^2=${k * k}$.`],
      [T`Pole trójkąta $ABE$ jest ${k * k} razy większe od pola trójkąta $CDE$.`, true, T`Skala $${k}$, stosunek pól $${k * k}$.`],
      [T`Pola trójkątów $BCE$ oraz $AED$ są równe.`, true, 'Trójkąty $ABC$ i $ABD$ mają wspólną podstawę i tę samą wysokość; po odjęciu $ABE$ zostają równe pola.'],
      [T`Pole trójkąta $ACD$ jest równe polu trójkąta $BCD$.`, true, 'Wspólna podstawa $CD$ i ta sama wysokość trapezu.'],
      [T`$|AE|=|EC|$`, false, T`$|AE|:|EC|=|AB|:|CD|=${k}$.`],
      [T`$|AE|=${k}\cdot|EC|$`, true, T`Z podobieństwa: $|AE|:|EC|=${k}$.`]];
    const p = R.shuffle(S.slice()).slice(0, 2);
    return { pf: p, q: T`W trapezie $ABCD$ o podstawach $AB$ i $CD$, gdzie $|AB|=${k}\cdot|CD|$, przekątne przecinają się w punkcie $E$. Oceń prawdziwość stwierdzeń.`, steps: [] };
  });
  reg('rownoleglobok', ['2305-20', '2306-25', '2405-21'], ['f10-17', 'f10-4'], () => {
    const ANG = [[30, 150, '\\frac12', 1, 1], [45, 135, '\\frac{\\sqrt2}{2}', 1, 2], [60, 120, '\\frac{\\sqrt3}{2}', 1, 3]], [al, ob, sT, , rad] = R.pick(ANG), a = R.int(2, 9), b = R.int(2, 9), t = R.int(0, 2);
    const half = x => (rad === 1 ? qo(Q(x, 2)) : T`${qt(Q(x, 2)) === '1' ? '' : qt(Q(x, 2))}\sqrt${rad}`), full = x => (rad === 1 ? String(x) : T`${x === 1 ? '' : x}\sqrt${rad}`);
    if (t === 0) return { q: T`Równoległobok ma boki długości $${a}$ i $${b}$, a kąt między nimi ma miarę $${R.int(0, 1) ? al : ob}^\circ$. Pole tego równoległoboku jest równe`, opts: opts(half(a * b), [[full(a * b), 'Brakuje czynnika $\\frac12$ z sinusa — $\\sin' + al + '^\\circ=' + sT + '$.'], [String(a * b), 'Pole to $ab\\sin\\alpha$, nie $ab$.'], [half(a * b / 2) === half(a * b) ? null : (rad === 1 ? qo(Q(a * b, 4)) : T`${qt(Q(a * b, 4)) === '1' ? '' : qt(Q(a * b, 4))}\sqrt${rad}`), 'To pole trójkąta — połowy równoległoboku.'], [rad === 3 ? qo(Q(a * b, 2)) : rad === 2 ? qo(Q(a * b, 2)) : T`${qt(Q(a * b, 2))}\sqrt3`, 'Pomylone wartości sinusa.']]), steps: [T`$P=ab\sin\alpha=${a}\cdot ${b}\cdot ${sT}=${half(a * b)}$ (a $\sin${ob}^\circ=\sin${al}^\circ$).`] };
    if (t === 1) { const P = a * b; return { q: T`Pole równoległoboku $ABCD$ jest równe $${half(P)}$, bok $AD$ ma długość $${a}$, a kąt $ABC$ ma miarę $${ob}^\circ$. Długość boku $AB$ jest równa`, opts: opts(String(b), [[String(2 * b), 'Pomnóż przez $\\sin' + ob + '^\\circ=' + sT + '$, nie pomijaj go.'], [qo(Q(b, 2)), 'Dzielimy przez $' + a + '\\cdot' + sT + '$.'], [full(b), 'Niewymierność się skraca: $\\frac{' + half(P) + '}{' + a + '\\cdot' + sT + '}$.'], [String(a), 'To długość boku $AD$ — ułóż równanie $P=|AD|\\cdot|AB|\\sin\\alpha$.']]), steps: [T`$${half(P)}=${a}\cdot|AB|\cdot ${sT}\Rightarrow |AB|=${b}$.`] }; }
    const s = R.int(2, 8); return { q: T`W rombie o boku długości $${s}$ kąt rozwarty ma miarę $${ob}^\circ$. Iloczyn długości przekątnych tego rombu jest równy`, opts: opts(full(s * s), [[half(s * s), 'To pole rombu: $P=\\frac{d_1d_2}{2}$, więc $d_1d_2=2P$.'], [String(s * s), 'Pole to $a^2\\sin\\alpha$; iloczyn przekątnych $2a^2\\sin\\alpha$.'], [String(2 * s * s), 'Uwzględnij $\\sin' + ob + '^\\circ=' + sT + '$.'], [full(2 * s * s), 'Za dużo o czynnik 2.']]), steps: [T`$P=a^2\sin\alpha=${half(s * s)}$; $d_1d_2=2P=${full(s * s)}$.`] };
  });
  reg('trojProstSin', ['2606-17'], ['f09-1', 'f10-1'], () => {
    const k = R.int(2, 6), m = R.int(1, 4), c = k * m * R.pick([1, 2]), a = c / k, b2 = c * c - a * a;
    return { q: T`Dany jest trójkąt prostokątny o takim kącie $\alpha$, że $\sin\alpha=\frac1{${k}}$. Przeciwprostokątna tego trójkąta ma długość $${c}$. Krótsza przyprostokątna ma długość`, opts: opts(String(a), [[surd(b2), 'To dłuższa przyprostokątna (przyległa do $\\alpha$).'], [String(c * k), 'Przyprostokątna jest krótsza od przeciwprostokątnej: $a=c\\sin\\alpha$.'], [qo(Q(a, 2)), 'Sprawdź: $' + c + '\\cdot\\frac1{' + k + '}$.'], [String(c - a), 'Pitagoras: $b=\\sqrt{c^2-a^2}$, nie $c-a$.']]), steps: [T`Naprzeciw $\alpha$ (najmniejszy kąt): $a=c\sin\alpha=\frac{${c}}{${k}}=${a}$.`] };
  });
  reg('okrWpisOpis', ['2506-19.1', '2506-19.2', '2605-22'], ['f10-5', 'f10-6'], () => {
    const t = R.int(0, 2);
    if (t < 2) { const [p, q, r] = R.pick(TRIPLES), s = R.int(1, 3), a = p * s, b = q * s, c = r * s, ri = (a + b - c) / 2;
      if (t === 0) return { q: T`Dany jest trójkąt prostokątny o bokach $${a}$, $${b}$, $${c}$. Promień okręgu wpisanego w ten trójkąt jest równy`, opts: opts(qo(Q(ri)), [[qo(Q(c, 2)), 'To promień okręgu <b>opisanego</b> (połowa przeciwprostokątnej).'], [qo(Q(a + b - c)), 'Wzór ma dzielenie przez 2: $r=\\frac{a+b-c}{2}$.'], [qo(Q(a * b, 2 * (a + b + c))), 'Z $P=\\frac12 r(a+b+c)$ mamy $r=\\frac{2P}{a+b+c}$ — zgubiony czynnik 2.'], [qo(Q(a * b, c)), 'To wysokość opuszczona na przeciwprostokątną.']]), steps: [T`$r=\frac{a+b-c}{2}=\frac{${a}+${b}-${c}}{2}=${ri}$.`] };
      return { q: T`Dany jest trójkąt prostokątny o bokach $${a}$, $${b}$, $${c}$. Promień okręgu opisanego na tym trójkącie jest równy`, opts: opts(qo(Q(c, 2)), [[qo(Q(ri)), 'To promień okręgu wpisanego.'], [String(c), 'Przeciwprostokątna to średnica, nie promień.'], [qo(Q(a * b, c)), 'To wysokość na przeciwprostokątną.'], [qo(Q(a + b, 2)), 'Środek okręgu opisanego to środek przeciwprostokątnej: $R=\\frac c2$.']]), steps: [T`$R=\frac c2=${qt(Q(c, 2))}$.`] }; }
    const m = R.int(2, 9), Rr = T`${m}\sqrt3`;
    return { q: T`W okrąg o promieniu $${Rr}$ wpisano trójkąt równoboczny. Bok tego trójkąta ma długość`, opts: opts(String(3 * m), [[T`${2 * m}\sqrt3`, 'To średnica, a bok to $a=R\\sqrt3$.'], [String(m), 'Odwrotnie: $R=\\frac{a\\sqrt3}{3}$, więc $a=R\\sqrt3$.'], [String(6 * m), 'Za dużo o 2 — $a=R\\sqrt3$.'], [qo(Q(3 * m, 2)), 'Promień okręgu opisanego to $\\frac23$ wysokości.']]), steps: [T`$R=\frac{a\sqrt3}{3}\Rightarrow a=R\sqrt3=${m}\sqrt3\cdot\sqrt3=${3 * m}$.`] };
  });
  reg('wycinek', ['2308-21', '2508-21.2'], ['f10-12', 'f10-13'], () => {
    const r = R.int(2, 12), a = R.pick([20, 30, 36, 40, 45, 60, 72, 90, 120]), L = Q(2 * r * a, 360), pi = x => (x.n === 0 ? '0' : (x.d === 1 ? (x.n === 1 ? '' : x.n) : qt(x)) + '\\pi');
    if (R.int(0, 1)) return { q: T`Koło ma promień $${r}$. Obwód wycinka tego koła o kącie środkowym $${a}^\circ$ jest równy`, opts: opts(T`${pi(L)}+${2 * r}`, [[pi(L), 'Obwód wycinka to łuk <b>plus dwa promienie</b>.'], [pi(Q(r * r * a, 360)), 'To pole wycinka (bez promieni).'], [T`${pi(Q(r * r * a, 360))}+${2 * r}`, 'Długość łuku to $\\frac{\\alpha}{360^\\circ}\\cdot2\\pi r$, nie $\\pi r^2$.'], [T`${pi(L)}+${r}`, 'Promienie są dwa.']]), steps: [T`Łuk: $\frac{${a}}{360}\cdot 2\pi\cdot ${r}=${pi(L)}$; obwód: $${pi(L)}+2\cdot ${r}$.`] };
    const g = R.pick([10, 15, 20, 25, 30, 40, 50, 60, 65]), rr = R.pick([18, 36, 9, 12, 24]), Lb = Q(2 * rr * 2 * g, 360);
    return { q: T`Punkty $B$, $C$, $D$ leżą na okręgu o promieniu $${rr}$. Kąt wpisany $CDB$ ma miarę $${g}^\circ$. Długość łuku $BC$, na którym jest oparty ten kąt, jest równa`, opts: opts(pi(Lb), [[pi(Q(2 * rr * g, 360)), 'Łuk wyznacza kąt <b>środkowy</b> $2\\cdot' + g + '^\\circ$, nie wpisany.'], [pi(Q(rr * rr * 2 * g, 360)), 'To pole wycinka.'], [pi(Q(4 * rr * 2 * g, 360)), 'Obwód okręgu to $2\\pi r$, nie $4\\pi r$.'], [pi(Q(rr * 2 * g, 360)), 'Brakuje czynnika 2 w $2\\pi r$.']]), steps: [T`Kąt środkowy: $${2 * g}^\circ$; łuk: $\frac{${2 * g}}{360}\cdot 2\pi\cdot ${rr}=${pi(Lb)}$.`] };
  });
  reg('styczna', ['2306-21'], ['f10-16', 'f10-13'], () => {
    const p = R.int(2, 9), q = R.int(1, 8), h2 = p * q;
    return { q: T`Odcinek $AB$ jest średnicą okręgu. Prosta $k$ jest styczna do okręgu w punkcie $A$. Prosta $l$ przechodzi przez $B$, przecina okrąg w punkcie $C$, a prostą $k$ w punkcie $D$. $|BC|=${p}$, $|CD|=${q}$. Odległość punktu $A$ od prostej $l$ jest równa`, opts: opts(surd(h2), [[qo(Q(p + q, 2)), 'Odległość $A$ od $l$ to $|AC|$ ($\\angle ACB=90^\\circ$) — wysokość trójkąta prostokątnego $ABD$.'], [surd(q * (p + q)), 'To $|AD|$ (styczna: $|AD|^2=|DC|\\cdot|DB|$), a nie odległość od prostej.'], [String(p), 'To $|BC|$.'], [surd(p * (p + q)), 'To $|AB|$.']]), steps: [T`$\angle ACB=90^\circ$ (oparty na średnicy), więc $AC$ jest wysokością trójkąta prostokątnego $ABD$: $|AC|^2=|DC|\cdot|CB|=${q}\cdot ${p}=${h2}$, $|AC|=${surd(h2)}$.`] };
  });

  /* =================== DZIAŁ IX: geometria analityczna =================== */
  const pt = (x, y) => T`(${x}, ${y})`, sq2 = (a, b) => (a === 0 ? T`x^2` : T`(x${sgn(-a)})^2`) + '+' + (b === 0 ? T`y^2` : T`(y${sgn(-b)})^2`);
  const slopeT = m => (m.d === 1 ? (m.n === 1 ? '' : m.n === -1 ? '-' : String(m.n)) : qt(m));
  reg('prostePerp', ['2305-23', '2306-26', '2405-23', '2308-27'], ['f11-9'], () => {
    const t = R.int(0, 2);
    if (t === 0) { const a = R.pick([-4, -3, -2, 2, 3, 4, 5]), m = Q(-1, a), sol = qsub(m, Q(1)), sh = R.int(1, 7);
      return { q: T`Proste $k\colon y=(m+1)x+${sh}$ oraz $l\colon y=${a}x+${sh}$ są prostopadłe, gdy liczba $m$ jest równa`, opts: opts(qo(sol), [[qo(qsub(Q(1, a), Q(1))), 'Prostopadłość: $a_1a_2=-1$ — zgubiony minus.'], [qo(Q(-a - 1)), 'To warunek równoległości ($m+1=' + a + '$) z odwrotnym znakiem.'], [qo(Q(a - 1)), 'To warunek równoległości: $m+1=' + a + '$.'], [qo(m), 'To wartość $m+1$, a pytamy o $m$.']]), steps: [T`$(m+1)\cdot ${a}=-1\Rightarrow m+1=${qt(m)}\Rightarrow m=${qt(sol)}$.`] }; }
    if (t === 1) { const a = R.pick([Q(1), Q(-1), Q(2), Q(-2), Q(1, 2), Q(-1, 3), Q(3)]), b0 = R.int(-5, 5), b = R.int(-6, 6), ap = Q(-a.d, a.n);
      return { q: T`Funkcja liniowa $f(x)=${linEq(a, b0).slice(2)}$. Wykres funkcji liniowej $g$ przechodzi przez punkt $P=${pt(0, b)}$ i jest prostopadły do wykresu $f$. Wzorem funkcji $g$ jest`, opts: opts(linEq(ap, b).replace('y=', 'g(x)='), [[linEq(a, b).replace('y=', 'g(x)='), 'Ten sam współczynnik — to prosta równoległa.'], [linEq(Q(-ap.n, ap.d), b).replace('y=', 'g(x)='), 'Prostopadła ma współczynnik $-\\frac1a$ — zgubiony minus.'], [linEq(ap, b0 === b ? -b || 3 : b0).replace('y=', 'g(x)='), 'Wyraz wolny odczytujemy z punktu $P$ na osi $Oy$.'], [linEq(Q(-a.n, a.d), b).replace('y=', 'g(x)='), 'Zmiana znaku to nie wszystko — trzeba też odwrócić.']]), steps: [T`$a_g=-\frac{1}{${a.n < 0 ? '(' + qt(a) + ')' : qt(a)}}=${qt(ap)}$, $b=${b}$ (punkt na osi $Oy$).`] }; }
    const p = R.pick([2, 3, 4, -2, -3]), q = R.pick([3, 2, 1, -1]), m1 = Q(p, q), m2 = Q(-q, p), b1 = R.int(-4, 4), x0 = q * R.int(-2, 2), y0 = p * x0 / q + b1, b2 = y0 + q * x0 / p;
    if (!Number.isInteger(b2) || p === -q) return null;
    return { q: T`Proste $k\colon ${linEq(m1, b1)}$ oraz $l\colon ${linEq(m2, Q(b2))}$`, opts: opts(T`\text{są prostopadłe i przecinają się w punkcie } ${pt(x0, y0)}`, [[T`\text{nie są prostopadłe i przecinają się w punkcie } ${pt(x0, y0)}`, T`$${qt(m1)}\cdot\left(${qt(m2)}\right)=-1$ — są prostopadłe.`], [T`\text{są prostopadłe i przecinają się w punkcie } ${pt(-x0 || 1, y0)}`, 'Sprawdź pierwszą współrzędną, rozwiązując układ.'], [T`\text{są prostopadłe i przecinają się w punkcie } ${pt(x0, -y0 || 2)}`, 'Podstaw $x$ do równania prostej $k$.'], [T`\text{są równoległe}`, 'Różne współczynniki kierunkowe — proste się przecinają.']]), steps: [T`$${qt(m1)}\cdot\left(${qt(m2)}\right)=-1$; z układu: $x=${x0}$, $y=${y0}$.`] };
  });
  reg('prosteRown', ['2305-24', '2308-25', '2408-22', '2505-23', '2508-24', '2605-26', '2608-24'], ['f11-8', 'f11-4'], () => {
    const t = R.int(0, 2);
    if (t === 0) { const a = R.pick([Q(1, 3), Q(-1, 3), Q(3, 4), Q(-1, 2), Q(2), Q(-3), Q(2, 3)]), x0 = a.d * R.int(-3, 4), y0 = R.int(-6, 6), b = qsub(Q(y0), qmul(a, Q(x0))), b0 = R.int(-5, 5);
      if (b.d !== 1 || b.n === b0) return null; const ap = Q(-a.d, a.n);
      return { q: T`Prosta przechodząca przez punkt $P=${pt(x0, y0)}$ i równoległa do prostej $${linEq(a, b0)}$ ma równanie`, opts: opts(linEq(a, b), [[linEq(ap, qadd(Q(y0), qmul(Q(-1), qmul(ap, Q(x0))))), 'To prosta prostopadła — współczynnik $-\\frac1a$.'], [linEq(a, qadd(Q(y0), qmul(a, Q(x0)))), 'Zły znak przy obliczaniu $b$: $b=y_0-ax_0$.'], [linEq(Q(-a.n, a.d), qadd(Q(y0), qmul(a, Q(x0)))), 'Równoległa ma ten sam współczynnik kierunkowy.'], [linEq(a, Q(b0 + 1)), 'Podstaw punkt $P$, aby wyznaczyć $b$.']]), steps: [T`$a=${qt(a)}$; $${y0}=${qt(a)}\cdot(${x0})+b\Rightarrow b=${qt(b)}$.`] }; }
    if (t === 1) { const p = R.int(2, 4), q = R.int(1, 3), m = R.int(-6, 6); if (p === q) return null; const c = (p - q) * m; // (p m + u)x vs (q m + u + c)
      const u = R.int(-5, 5), mm = n => (n === 1 ? '' : n) + 'm', A1 = T`(${mm(p)}${sgn(u)})`, A2 = T`(${mm(q)}${sgn(u + c)})`;
      return { q: T`Proste $k\colon y=${A1}x-2$ oraz $l\colon y=${A2}x+2$ są równoległe, gdy liczba $m$ jest równa`, opts: opts(no(m), [[no(-m), 'Przenosząc wyrazy, zmieniamy znak: $' + mm(p - q) + '=' + c + '$.'], [qo(Q(c, p + q)), 'Współczynniki porównujemy, nie dodajemy.'], [no(m + 1 === 0 ? 5 : 2 * m || 4), 'Rozwiąż $' + mm(p) + sgn(u) + '=' + mm(q) + sgn(u + c) + '$.'], [no(m - 2), 'Sprawdź rachunek.']]), steps: [T`$${mm(p)}${sgn(u)}=${mm(q)}${sgn(u + c)}\Rightarrow ${mm(p - q)}=${c}\Rightarrow m=${m}$.`] }; }
    const a = R.pick([Q(1, 3), Q(-1, 3), Q(1, 2), Q(-2), Q(3), Q(-1, 2)]), x0 = a.d * R.int(-2, 3), y0 = R.int(-5, 5), b = qsub(Q(y0), qmul(a, Q(x0)));
    if (!x0) return null;
    return { q: T`Prosta $l$ jest równoległa do prostej $${linEq(a, 2)}$ i przechodzi przez punkt $${pt(x0, y0)}$. Prosta $l$ przecina oś $Oy$ w punkcie`, opts: opts(T`(0, ${qt(b)})`, [[T`(0, ${qt(qadd(Q(y0), qmul(a, Q(x0))))})`, 'Zły znak: $b=y_0-ax_0$.'], [T`(0, 2)`, 'To punkt przecięcia danej prostej, nie prostej $l$.'], [T`(${qt(b)}, 0)`, 'Punkt na osi $Oy$ ma pierwszą współrzędną $0$.'], [T`(0, ${y0})`, 'Punkt $P$ nie leży na osi $Oy$.']]), steps: [T`$l\colon y=${slopeT(a)}x+b$; $${y0}=${qt(a)}\cdot(${x0})+b\Rightarrow b=${qt(b)}$.`] };
  });
  reg('prostaDwaPkt', ['2608-22.1'], ['f11-5'], () => {
    const x1 = R.int(-4, 4), y1 = R.int(-6, 6), dx = R.pick([1, 2, 3, 4]), a = R.pick([-3, -2, -1, 1, 2, 3]), x2 = x1 + dx, y2 = y1 + a * dx, b = y1 - a * x1;
    return { q: T`Prosta przechodząca przez punkty $A=${pt(x1, y1)}$ i $B=${pt(x2, y2)}$ ma równanie`, opts: opts(linEq(a, b), [[linEq(-a, b), 'Współczynnik $a=\\frac{y_B-y_A}{x_B-x_A}=' + a + '$.'], [linEq(Q(1, a), y1 - x1 / a === Math.round(y1 - x1 / a) ? Q(y1 - x1 / a) : Q(b + 1)), 'Odwrócony iloraz: $\\frac{\\Delta y}{\\Delta x}$, nie $\\frac{\\Delta x}{\\Delta y}$.'], [linEq(a, -b || 5), 'Sprawdź wyraz wolny, podstawiając punkt $A$.'], [linEq(a, y1 + a * x1 === b ? b + 2 : y1 + a * x1), 'Zły znak: $b=y_A-ax_A$.']]), steps: [T`$a=\frac{${y2}-(${y1})}{${x2}-(${x1})}=${a}$, $b=${y1}-(${a})\cdot(${x1})=${b}$.`] };
  });
  reg('odcinekDl', ['2306-27', '2505-22', '2606-23', '2308-28', '2605-24.1', '2608-22.2'], ['f11-1', 'f11-2'], () => {
    const x1 = R.int(-5, 5), y1 = R.int(-5, 5), dx = R.int(-5, 5), dy = R.int(-5, 5); if (!dx && !dy) return null; const d2 = dx * dx + dy * dy, t = R.int(0, 3), x2 = x1 + dx, y2 = y1 + dy;
    if (t === 0) return { q: T`Punkty $A=${pt(x1, y1)}$ i $C=${pt(x2, y2)}$ są przeciwległymi wierzchołkami kwadratu $ABCD$. Pole kwadratu jest równe`, opts: opts(qo(Q(d2, 2)), [[String(d2), 'To $|AC|^2$ — kwadrat przekątnej; pole to $\\frac{d^2}{2}$.'], [surd(d2), 'To długość przekątnej.'], [qo(Q(d2, 4)), 'Pole kwadratu z przekątnej: $\\frac{d^2}{2}$.'], [String(2 * d2), 'Przekątna nie jest bokiem.']]), steps: [T`$|AC|^2=${dx * dx}+${dy * dy}=${d2}$; $P=\frac{|AC|^2}{2}=${qt(Q(d2, 2))}$.`] };
    if (t === 1) return { q: T`Punkty $A=${pt(x1, y1)}$ i $B=${pt(x2, y2)}$ są kolejnymi wierzchołkami kwadratu $ABCD$. Obwód kwadratu jest równy`, opts: opts(surd(16 * d2), [[surd(d2), 'To długość jednego boku.'], [String(4 * d2), 'Bok to $\\sqrt{' + d2 + '}$ — trzeba spierwiastkować.'], [surd(8 * d2), 'Obwód to $4a$.'], [String(d2), 'To kwadrat długości boku.']]), steps: [T`$|AB|=\sqrt{${dx * dx}+${dy * dy}}=${surd(d2)}$; obwód: $4\cdot ${surd(d2)}=${surd(16 * d2)}$.`] };
    if (t === 2) return { q: T`Punkt $A=${pt(x1, y1)}$ jest wierzchołkiem równoległoboku $ABCD$, a punkt $S=${pt(x2, y2)}$ — jego środkiem symetrii. Przekątna $AC$ ma długość`, opts: opts(surd(4 * d2), [[surd(d2), 'To $|AS|$ — połowa przekątnej.'], [String(4 * d2), 'Spierwiastkuj.'], [surd(2 * d2), 'Przekątna to $2|AS|$, nie $\\sqrt2|AS|$.'], [surd((x1 + x2) ** 2 + (y1 + y2) ** 2) === surd(4 * d2) ? null : surd(((x1 + x2) ** 2 + (y1 + y2) ** 2) || 1), 'Długość liczymy z różnic współrzędnych, nie sum.']]), steps: [T`$|AS|=${surd(d2)}$, $|AC|=2|AS|=${surd(4 * d2)}$.`] };
    const cx = R.int(-4, 4), cy = R.int(-4, 4); return { q: T`W kwadracie $ABCD$: $A=${pt(cx + dx, cy + dy)}$, a przekątne przecinają się w punkcie $S=${pt(cx, cy)}$. Przekątna ma długość`, opts: opts(surd(4 * d2), [[surd(d2), 'To połowa przekątnej $|AS|$.'], [surd(2 * d2), 'Przekątna to $2|AS|$.'], [String(d2), 'To $|AS|^2$.'], [surd(8 * d2), 'Za dużo — to $2\\sqrt2|AS|$.']]), steps: [T`$|AS|=\sqrt{${dx * dx}+${dy * dy}}=${surd(d2)}$; przekątna: $2|AS|=${surd(4 * d2)}$.`] };
  });
  reg('srodekOdc', ['2608-23.1', '2605-24.2'], ['f11-2'], () => {
    const sx = R.int(-9, 9), sy = R.int(-9, 9), ax = R.int(-12, 12), ay = R.int(-15, 15), bx = 2 * sx - ax, by = 2 * sy - ay;
    if (R.int(0, 1)) return { q: T`Odcinek $AB$, gdzie $A=${pt(ax, ay)}$ i $B=(${bx}, y_B)$, jest średnicą okręgu o środku $S=${pt(sx, sy)}$. Współrzędna $y_B$ jest równa`, opts: opts(no(by), [[qo(Q(ay + sy, 2)), 'To środek odcinka $AS$; $S$ jest środkiem $AB$: $y_B=2y_S-y_A$.'], [no(ay - 2 * sy), 'Zły znak: $y_B=2y_S-y_A$.'], [no(sy - ay), 'Brakuje czynnika 2: $y_B=2y_S-y_A$.'], [no(-by), 'Sprawdź znak.']]), steps: [T`$y_S=\frac{y_A+y_B}{2}\Rightarrow y_B=2\cdot(${sy})-(${ay})=${by}$.`] };
    const ex = R.int(-5, 5), ey = 2 * R.int(-4, 4), fx = ex + 2 * R.int(1, 3) * R.pick([1, -1]), fy = ey + 2 * R.int(-3, 3), mx = (ex + fx) / 2, my = (ey + fy) / 2;
    return { q: T`Trójkąt o wierzchołkach $A=${pt(ex, ey)}$, $B=${pt(fx, fy)}$ i $C$ jest prostokątny, a $AB$ jest jego przeciwprostokątną. Środek okręgu opisanego na tym trójkącie ma współrzędne`, opts: opts(pt(mx, my), [[pt(fx - ex, fy - ey), 'To wektor $\\overrightarrow{AB}$, a środek to średnia współrzędnych.'], [pt((fx - ex) / 2, (fy - ey) / 2), 'Dodajemy współrzędne, nie odejmujemy: $\\left(\\frac{x_A+x_B}{2},\\frac{y_A+y_B}{2}\\right)$.'], [pt(ex + fx, ey + fy), 'Podziel sumę przez 2.'], [pt(my, mx), 'Zamienione współrzędne.']]), steps: [T`Środek okręgu opisanego na trójkącie prostokątnym to środek przeciwprostokątnej: $\left(\frac{${ex}+${fx < 0 ? '(' + fx + ')' : fx}}{2},\frac{${ey}+${fy < 0 ? '(' + fy + ')' : fy}}{2}\right)=${pt(mx, my)}$.`] };
  });
  reg('okragRown', ['2608-23.2', '2308-26', '2408-23', '2505-24', '2606-24'], ['f11-11', 'f11-2'], () => {
    const a = R.int(-6, 6), b = R.int(-6, 6), t = R.int(0, 2); if (!a || !b) return null; let r2, intro;
    if (t === 0) { const r = R.int(2, 9); r2 = r * r; intro = T`Okrąg o środku $S=${pt(a, b)}$ i promieniu $${r}$ jest określony równaniem`; }
    else if (t === 1) { const px = a + R.int(-4, 4), py = b + R.int(-4, 4); r2 = (px - a) ** 2 + (py - b) ** 2; if (!r2) return null; intro = T`Punkt $P=${pt(px, py)}$ leży na okręgu o środku $S=${pt(a, b)}$. Okrąg ten jest określony równaniem`; }
    else { const dx = R.int(-5, 5), dy = R.int(-5, 5); r2 = dx * dx + dy * dy; if (!r2) return null; intro = T`Odcinek o końcach $A=${pt(a - dx, b - dy)}$ i $B=${pt(a + dx, b + dy)}$ jest średnicą okręgu. Okrąg ten jest określony równaniem`; }
    const E = (x, y, rr) => sq2(x, y) + '=' + rr;
    return { q: intro, opts: opts(E(a, b, r2), [[E(-a, -b, r2), 'Znaki w nawiasach są przeciwne do współrzędnych środka: $(x-a)^2$.'], [E(a, b, surd(r2)), 'Po prawej stronie jest $r^2$, nie $r$.'], [E(-a, -b, surd(r2)), 'Dwa błędy: znaki i $r$ zamiast $r^2$.'], [t === 2 ? E(a, b, 4 * r2) : E(a, -b, r2), t === 2 ? 'Średnica to $2r$ — tu wzięto $|AB|^2$ zamiast $r^2$.' : 'Sprawdź znak przy $y$.']]), steps: [T`Środek $${pt(a, b)}$, $r^2=${r2}$: $${E(a, b, r2)}$.`] };
  });
  reg('okragPF', ['2605-25', '2406-23.1', '2508-25'], ['f11-11', 'f11-1'], () => {
    const a = R.int(-5, 5), b = R.int(-5, 5), r = R.int(2, 5), r2 = r * r, [p, q, rr] = R.pick([[3, 4, 5], [0, 1, 1], [1, 2, 0]]);
    const S = [];
    if (rr === 5 && r === 5) { const P = [a + 3, b - 4]; S.push([T`Punkt $${pt(P[0], P[1])}$ leży na okręgu.`, true, T`$3^2+4^2=25=r^2$.`]); }
    const off = [a + r, b + 1]; S.push([T`Punkt $${pt(off[0], off[1])}$ leży na okręgu.`, false, T`$${r}^2+1^2=${r2 + 1}\neq ${r2}$.`]);
    const on = [a, b + r]; S.push([T`Punkt $${pt(on[0], on[1])}$ leży na okręgu.`, true, T`$0^2+${r}^2=${r2}$.`]);
    S.push([T`Promień okręgu jest równy $${r2}$.`, false, T`$r^2=${r2}$, więc $r=${r}$.`]);
    S.push([T`Okrąg nie ma punktów wspólnych z osią $Ox$.`, Math.abs(b) > r, T`Odległość środka od osi $Ox$ to $|${b}|=${Math.abs(b)}$, a $r=${r}$.`]);
    S.push([T`Okrąg ma z osią $Oy$ dokładnie dwa punkty wspólne.`, Math.abs(a) < r, T`Odległość środka od osi $Oy$ to $${Math.abs(a)}$, a $r=${r}$ — ${Math.abs(a) < r ? 'mniejsza, więc dwa punkty' : Math.abs(a) === r ? 'równa: jeden punkt (styczność)' : 'większa: brak punktów'}.`]);
    const p2 = R.shuffle(S).slice(0, 2); void p; void q;
    return { pf: p2, q: T`Dany jest okrąg $\mathcal O\colon ${sq2(a, b)}=${r2}$. Oceń prawdziwość stwierdzeń.`, steps: [] };
  });
  reg('okragSym', ['2506-23', '2406-23.2'], ['f11-13', 'f11-11'], () => {
    const a = R.int(-6, 6), b = R.int(-6, 6), r2 = R.pick([4, 5, 9, 16, 10, 25]); if (!a || !b) return null; const t = R.int(0, 2), nm = ['osi $Oy$', 'osi $Ox$', 'początku układu współrzędnych'][t], img = [[-a, b], [a, -b], [-a, -b]][t];
    const E = (x, y) => sq2(x, y) + '=' + r2, all = [[-a, b], [a, -b], [-a, -b], [a, b]].filter(([x, y]) => x !== img[0] || y !== img[1]);
    const why = ([x, y]) => (x === a && y === b ? 'To okrąg wyjściowy — środek musi się zmienić.' : x === -a && y === b ? 'To symetria względem osi $Oy$ (zmienia się tylko $x$).' : x === a && y === -b ? 'To symetria względem osi $Ox$ (zmienia się tylko $y$).' : 'To symetria środkowa (zmieniają się obie współrzędne).');
    return { q: T`Okrąg $\mathcal K$ jest obrazem okręgu $${E(a, b)}$ w symetrii ${t < 2 ? 'osiowej względem ' : 'środkowej względem '}${nm}. Okrąg $\mathcal K$ jest określony równaniem`, opts: opts(E(img[0], img[1]), all.map(c => [E(c[0], c[1]), why(c)])), steps: [T`Środek $${pt(a, b)}\mapsto ${pt(img[0], img[1])}$, promień bez zmian.`] };
  });

  /* =================== DZIAŁ X: stereometria =================== */
  const dq = x => { const v = x.n / x.d; return x.d === 1 ? String(x.n) : [2, 4, 5, 8, 10, 20, 25, 40, 50].includes(x.d) ? opt(dec(+v.toFixed(4))) : qo(x); };
  const kS = (k, m) => (m === 1 ? String(k) : (k === 1 ? '' : k) + T`\sqrt{${m}}`); // k√m
  reg('graniastNachyl', ['2305-25', '2406-27', '2306-30', '2405-25.2'], ['f12-3', 'f09-1'], () => {
    const a = R.int(2, 15), t = R.int(0, 2);
    if (t === 0) { const g = R.int(1, 4); return { q: T`Podstawą graniastosłupa prawidłowego czworokątnego jest kwadrat o boku $${a}$. Przekątna graniastosłupa jest nachylona do płaszczyzny podstawy pod kątem $\alpha$ takim, że $\operatorname{tg}\alpha=${g}$. Wysokość graniastosłupa jest równa`, opts: opts(kS(g * a, 2), [[String(g * a), 'Kąt leży między przekątną bryły a <b>przekątną podstawy</b> $' + a + '\\sqrt2$, nie krawędzią.'], [kS(a, 2), 'To przekątna podstawy — pomnóż przez $\\operatorname{tg}\\alpha$.'], [String(2 * g * a), 'Przekątna kwadratu to $a\\sqrt2$, nie $2a$.'], [qo(Q(a, g)) === String(g * a) ? null : kS(a, 2) + (g === 1 ? '' : T`\cdot\frac1{${g}}`), '$H=d\\cdot\\operatorname{tg}\\alpha$ — mnożymy, nie dzielimy.']]), steps: [T`Przekątna podstawy: $d=${a}\sqrt2$; $\operatorname{tg}\alpha=\frac{H}{d}\Rightarrow H=${g}\cdot ${a}\sqrt2=${kS(g * a, 2)}$.`] }; }
    if (t === 1) { const k = R.int(2, 5); return { q: T`Krawędź podstawy graniastosłupa prawidłowego czworokątnego ma długość $${a}$. Przekątna graniastosłupa jest nachylona do płaszczyzny podstawy pod kątem $\alpha$, $\cos\alpha=\frac{\sqrt2}{${k}}$. Długość przekątnej graniastosłupa jest równa`, opts: opts(String(k * a), [[kS(a, 2), 'To przekątna podstawy.'], [kS(k * a, 2), '$\\frac{' + a + '\\sqrt2}{\\sqrt2/' + k + '}$ — pierwiastki się skracają.'], [qo(Q(2 * a, k)), '$\\cos\\alpha=\\frac{d}{D}$, więc $D=\\frac{d}{\\cos\\alpha}$ — tu pomnożono.'], [String(k * a * 2), 'Przekątna kwadratu to $a\\sqrt2$.']]), steps: [T`$\cos\alpha=\frac{${a}\sqrt2}{D}\Rightarrow D=\frac{${a}\sqrt2\cdot ${k}}{\sqrt2}=${k * a}$.`] }; }
    return { q: T`W graniastosłupie prawidłowym sześciokątnym $ABCDEFA'B'C'D'E'F'$ krawędź podstawy ma długość $${a}$, a przekątna $AD'$ jest nachylona do płaszczyzny podstawy pod kątem $45^\circ$. Pole ściany bocznej jest równe`, opts: opts(String(2 * a * a), [[String(a * a), 'Wysokość to $|AD|=2a$ (najdłuższa przekątna sześciokąta), nie $a$.'], [kS(a * a, 3), '$|AD|$ w sześciokącie foremnym to $2a$, nie $a\\sqrt3$.'], [String(4 * a * a), 'Ściana boczna to prostokąt $a\\times H$, a nie $H\\times H$.'], [kS(2 * a * a, 3), 'Pole ściany to $a\\cdot H=a\\cdot2a$.']]), steps: [T`$|AD|=2\cdot ${a}=${2 * a}$; kąt $45^\circ$, więc $H=|AD|=${2 * a}$; ściana: $${a}\cdot ${2 * a}=${2 * a * a}$.`] };
  });
  reg('ostroslupH', ['2608-26', '2306-29.2', '2306-29.1'], ['f12-4', 'f09-1'], () => {
    const t = R.int(0, 2);
    if (t === 0) { const l = 2 * R.int(2, 9), [ang, f] = R.pick([[60, 3], [45, 2], [30, 1]]), H = f === 1 ? String(l / 2) : kS(l / 2, f), other = f === 1 ? kS(l / 2, 3) : f === 3 ? String(l / 2) : null;
      return { q: T`Krawędź boczna ostrosłupa prawidłowego czworokątnego ma długość $${l}$ i jest nachylona do płaszczyzny podstawy pod kątem $${ang}^\circ$. Wysokość ostrosłupa jest równa`, opts: opts(H, [[other || String(l), 'Wysokość leży <b>naprzeciw</b> kąta nachylenia: $H=l\\sin\\alpha$, nie $l\\cos\\alpha$.'], [String(l), 'Krawędź boczna jest przeciwprostokątną — wysokość jest krótsza.'], [kS(l, f === 1 ? 3 : f), 'Brakuje czynnika $\\frac12$ z wartości funkcji.'], [kS(l / 2, f === 2 ? 3 : 2), 'Pomylone wartości funkcji trygonometrycznych.']]), steps: [T`$H=${l}\sin${ang}^\circ=${H}$.`] }; }
    const a = R.int(2, 8), h = R.int(2, 12);
    if (t === 1) { const d2 = 2 * a * a, tg = fracSurd(h, d2);
      return { q: T`Podstawą ostrosłupa jest kwadrat o boku $${a}$. Jedna z krawędzi bocznych ma długość $${h}$ i jest prostopadła do płaszczyzny podstawy. Tangens kąta nachylenia najdłuższej krawędzi bocznej do płaszczyzny podstawy jest równy`, opts: opts(tg, [[qo(Q(h, a)), 'Najdłuższa krawędź wychodzi do <b>przeciwległego</b> wierzchołka — rzut to przekątna $' + a + '\\sqrt2$.'], [(c => (h / c === 1 ? kS(a / c, 2) : T`\frac{${kS(a / c, 2)}}{${h / c}}`))(gcd(a, h)), 'Odwrócony iloraz: $\\operatorname{tg}=\\frac{H}{d}$.'], [qo(Q(a, h)), 'To odwrotność tangensa przy krawędzi bocznej.'], [fracSurd(h, a * a + h * h), 'To sinus, nie tangens.']]), steps: [T`Rzut najdłuższej krawędzi to przekątna podstawy $${a}\sqrt2$; $\operatorname{tg}\alpha=\frac{${h}}{${a}\sqrt2}=${tg}$.`] }; }
    const V = Q(a * a * h, 3);
    return { q: T`Podstawą ostrosłupa jest kwadrat o boku $${a}$. Jedna z krawędzi bocznych ma długość $${h}$ i jest prostopadła do płaszczyzny podstawy. Objętość ostrosłupa jest równa`, opts: opts(qo(V), [[String(a * a * h), 'Objętość ostrosłupa ma czynnik $\\frac13$.'], [qo(Q(a * a * h, 2)), 'To $\\frac12$ — ostrosłup ma $\\frac13$.'], [qo(Q(a * h, 3)), 'Pole podstawy to $a^2$.'], [qo(Q(4 * a * a * h, 3)), 'Pole podstawy to $a^2$, nie $(2a)^2$.']]), steps: [T`Krawędź prostopadła do podstawy jest wysokością: $V=\frac13\cdot ${a}^2\cdot ${h}=${qt(V)}$.`] };
  });
  reg('prostopad', ['2408-26', '2408-25', '2406-26', '2505-26', '2308-29.1', '2608-25'], ['f12-2', 'f12-3'], () => {
    const t = R.int(0, 4), a = R.int(2, 9);
    if (t === 0) return { q: T`Przekątna ściany sześcianu ma długość $${a}\sqrt2$. Objętość sześcianu jest równa`, opts: opts(String(a ** 3), [[kS(a ** 3 * 2, 2), 'Krawędź to $' + a + '$ — przekątna ściany to $a\\sqrt2$.'], [String(6 * a * a), 'To pole powierzchni całkowitej.'], [String(a * a), 'Objętość to $a^3$.'], [kS(a ** 3, 2), 'Krawędź $a=' + a + '$ (bez $\\sqrt2$).']]), steps: [T`$a\sqrt2=${a}\sqrt2\Rightarrow a=${a}$, $V=${a}^3=${a ** 3}$.`] };
    if (t === 1) return { q: T`Objętość sześcianu jest równa $${a ** 3}$. Długość przekątnej sześcianu jest równa`, opts: opts(kS(a, 3), [[kS(a, 2), 'To przekątna ściany; przekątna sześcianu to $a\\sqrt3$.'], [String(3 * a), '$a\\sqrt3$, nie $3a$.'], [String(a), 'To krawędź, a nie przekątna.'], [kS(a * a, 3), 'Krawędź to $\\sqrt[3]{' + a ** 3 + '}=' + a + '$.']]), steps: [T`$a=\sqrt[3]{${a ** 3}}=${a}$, przekątna: $a\sqrt3=${kS(a, 3)}$.`] };
    if (t === 2) { const m = 2 * R.int(3, 8), e = [m - 4, m - 2, m], P = 2 * (e[0] * e[1] + e[1] * e[2] + e[0] * e[2]);
      return { q: T`Długości trzech krawędzi prostopadłościanu wychodzących z jednego wierzchołka są trzema kolejnymi liczbami naturalnymi parzystymi. Najdłuższa z nich ma długość $${m}$. Pole powierzchni całkowitej jest równe`, opts: opts(String(P), [[String(P / 2), 'Każda ściana występuje dwa razy: $P=2(ab+bc+ac)$.'], [String(e[0] * e[1] * e[2]), 'To objętość.'], [String(2 * ((m - 2) * (m - 1) + (m - 1) * m + (m - 2) * m)), 'Kolejne liczby <b>parzyste</b>: $' + e.join(', ') + '$.'], [String(6 * m * m), 'To nie sześcian.']]), steps: [T`Krawędzie: $${e.join(', ')}$; $P=2(${e[0]}\cdot ${e[1]}+${e[1]}\cdot ${e[2]}+${e[0]}\cdot ${e[2]})=${P}$.`] }; }
    if (t === 3) { const s = T`${6 * a * a}+${kS(3 * a * a, 3)}`;
      return { q: T`Każda krawędź graniastosłupa prawidłowego sześciokątnego ma długość $${a}$. Pole powierzchni całkowitej jest równe`, opts: opts(s, [[T`${6 * a * a}+${qt(Q(3 * a * a, 2)) === '1' ? '' : qt(Q(3 * a * a, 2))}\sqrt{3}`, 'Podstawy są <b>dwie</b>: $2\\cdot\\frac{3a^2\\sqrt3}{2}$.'], [T`${6 * a * a}+${kS(6 * a * a, 3)}`, 'Pole sześciokąta to $\\frac{3a^2\\sqrt3}{2}$, nie $3a^2\\sqrt3$.'], [T`${6 * a * a}+${kS(a * a, 3)}`, 'Sześciokąt to 6 trójkątów równobocznych: $6\\cdot\\frac{a^2\\sqrt3}{4}$.'], [T`${4 * a * a}+${kS(3 * a * a, 3)}`, 'Ścian bocznych jest sześć.']]), steps: [T`Ściany boczne: $6\cdot ${a}^2=${6 * a * a}$; podstawy: $2\cdot\frac{3\cdot ${a}^2\sqrt3}{2}=${kS(3 * a * a, 3)}$.`] }; }
    const ang = R.pick([30, 45, 60]), BH = ang === 30 ? String(2 * a) : ang === 45 ? kS(a, 2) : T`\frac{${kS(2 * a, 3)}}{3}`;
    if (ang === 60) return null;
    return { q: T`W prostopadłościanie $ABCDEFGH$ podstawa $ABCD$ jest kwadratem o boku $${a}$. Przekątna $BH$ tworzy z przekątną $AH$ ściany bocznej $ADHE$ kąt o mierze $${ang}^\circ$. Przekątna $BH$ ma długość`, opts: opts(BH, [[ang === 30 ? kS(a, 3) : String(2 * a), 'Krawędź $AB$ jest prostopadła do ściany $ADHE$, więc $|AB|=|BH|\\sin' + ang + '^\\circ$.'], [String(a), 'To krawędź $AB$, leżąca naprzeciw kąta.'], [ang === 30 ? kS(2 * a, 3) : kS(a, 3), 'Użyj sinusa: $\\sin' + ang + '^\\circ=\\frac{|AB|}{|BH|}$.'], [kS(a, 2) === BH ? kS(2 * a, 2) : kS(a, 2), 'To przekątna podstawy.']]), steps: [T`$AB\perp AH$, więc $\sin${ang}^\circ=\frac{|AB|}{|BH|}\Rightarrow |BH|=${BH}$.`] };
  });
  reg('ostroslupPola', ['2506-25', '2405-26'], ['f12-4', 'f10-20'], () => {
    if (R.int(0, 1)) { const k = R.int(2, 5), b = R.pick([1, 2, 3, 4, 5, 6, 8, 9]), S = b * (k + 1);
      return { q: T`Pole powierzchni całkowitej ostrosłupa prawidłowego czworokątnego jest równe $${S}$, a pole powierzchni bocznej jest ${k} razy większe od pola podstawy. Krawędź podstawy ma długość`, opts: opts(surd(b), [[String(b), 'To pole podstawy — bok to pierwiastek.'], [S % k ? null : surd(S / k), 'Całkowite = podstawa + boczne = $(1+' + k + ')P_p$.'], [surd(S), 'Najpierw wyznacz pole podstawy.'], [surd(b * k), 'To pole boczne, nie podstawa.']]), steps: [T`$P_p+${k}P_p=${S}\Rightarrow P_p=${b}\Rightarrow a=${surd(b)}$.`] }; }
    const k = R.int(2, 5), V1 = R.int(1, 8) * 8, V2 = V1 * k ** 3;
    return { q: T`Ostrosłup $F_1$ o objętości $${V1}$ jest podobny do ostrosłupa $F_2$ o objętości $${V2}$. Stosunek pola powierzchni całkowitej $F_2$ do pola powierzchni całkowitej $F_1$ jest równy`, opts: opts(String(k * k), [[String(k ** 3), 'To stosunek objętości ($k^3$); pola mają się jak $k^2$.'], [String(k), 'To skala podobieństwa $k$.'], [String(3 * k), 'Pola mają się jak $k^2$, gdzie $k^3=' + k ** 3 + '$.'], [qo(Q(1, k * k)), 'Odwrotnie — $F_2$ jest większy.']]), steps: [T`$k^3=\frac{${V2}}{${V1}}=${k ** 3}\Rightarrow k=${k}$; pola: $k^2=${k * k}$.`] };
  });
  reg('brylyObrot', ['2506-26', '2508-27', '2605-28', '2606-26'], ['f12-5', 'f12-6'], () => {
    const t = R.int(0, 3);
    if (t === 0) { const l = 2 * R.int(1, 6), [ang, H, wr] = R.pick([[60, kS(l / 2, 3), String(l / 2)], [90, kS(l / 2, 2), String(l)], [120, String(l / 2), kS(l / 2, 3)]]);
      return { q: T`Tworząca stożka ma długość $${l}$, a kąt rozwarcia stożka ma miarę $${ang}^\circ$. Wysokość stożka jest równa`, opts: opts(H, [[wr, 'To promień — wysokość leży przy kącie $\\frac{' + ang + '^\\circ}{2}$: $H=l\\cos' + ang / 2 + '^\\circ$.'], [String(l), 'Tworząca jest przeciwprostokątną.'], [kS(l, ang === 120 ? 3 : 2), 'Kąt rozwarcia dzielimy na pół.'], [kS(l / 2, 5), 'Policz w trójkącie prostokątnym $H$, $r$, $l$.']]), steps: [T`Połowa kąta rozwarcia: $${ang / 2}^\circ$; $H=${l}\cos${ang / 2}^\circ=${H}$.`] }; }
    if (t === 1) { const r = R.int(2, 6), h = R.int(2, 9), V = r * r * h;
      return { q: T`Objętość walca o promieniu podstawy $${r}$ jest równa $${V}\pi^2$. Wysokość walca jest równa`, opts: opts(T`${h}\pi`, [[String(h), '$V=\\pi r^2h$ — w objętości jest $\\pi^2$, więc $h$ zawiera $\\pi$.'], [T`${h * r}\pi`, 'Promień podnosimy do kwadratu.'], [qo(Q(V, r)), 'Dziel przez $\\pi r^2$.'], [T`${V}\pi`, 'Dziel przez $r^2=' + r * r + '$.']]), steps: [T`$\pi\cdot ${r}^2\cdot h=${V}\pi^2\Rightarrow h=${h}\pi$.`] }; }
    if (t === 2) { const k = R.int(2, 4), v = Q(k * k, 3);
      return { q: T`Stożek i walec mają równe wysokości. Promień podstawy stożka jest ${k} razy większy od promienia podstawy walca. Stosunek objętości stożka do objętości walca jest równy`, opts: opts(qo(v), [[qo(Q(k, 3)), 'Promień jest w kwadracie: $(' + k + 'r)^2$.'], [qo(Q(1, 3 * k * k)), 'Odwrotnie — stożek ma większy promień.'], [String(k * k), 'Stożek ma $\\frac13$ w objętości.'], [qo(Q(k * k, 2)), 'Objętość stożka to $\\frac13\\pi r^2h$.']]), steps: [T`$\frac{\frac13\pi(${k}r)^2h}{\pi r^2h}=\frac{${k * k}}{3}$.`] }; }
    const r = R.int(2, 6), k = R.pick([2, 2, 3]), l = k * r;
    return { pf: [[T`Pole powierzchni bocznej stożka jest ${k === 2 ? 'dwukrotnie' : 'trzykrotnie'} większe od pola jego podstawy.`, true, T`$\pi r l=\pi\cdot ${r}\cdot ${l}=${r * l}\pi$, a podstawa $${r * r}\pi$ — stosunek $${k}$.`], [T`Kąt rozwarcia stożka ma miarę $60^\circ$.`, k === 2, T`$\sin\frac{\beta}{2}=\frac{r}{l}=\frac1{${k}}$${k === 2 ? ', więc $\\frac\\beta2=30^\\circ$.' : ' — to nie $\\frac12$.'}`]], q: T`Tworząca stożka o promieniu podstawy $${r}$ ma długość $${l}$. Oceń prawdziwość stwierdzeń.`, steps: [] };
  });
  reg('podzialOdc', ['2306-28'], ['f11-2'], () => {
    const ax = R.int(-5, 5), ay = R.int(-8, 8), dx = R.int(-3, 3), dy = R.int(-4, 4), k = R.int(2, 4); if (!dx || !dy) return null;
    const px = ax + dx, py = ay + dy, B = [ax + (k + 1) * dx, ay + (k + 1) * dy];
    return { q: T`Dane są punkty $A=${pt(ax, ay)}$ oraz $P=${pt(px, py)}$. Punkt $P$ dzieli odcinek $AB$ tak, że $|AP|:|PB|=1:${k}$. Punkt $B$ ma współrzędne`, opts: opts(pt(B[0], B[1]), [[pt(ax + k * dx, ay + k * dy), 'Od $P$ do $B$ jest $' + k + '$ odcinków $AP$, więc od $A$ do $B$ — $' + (k + 1) + '$.'], [pt(px + (k + 1) * dx, py + (k + 1) * dy), 'Liczymy $' + (k + 1) + '$ kroki od $A$, nie od $P$.'], [pt(2 * px - ax, 2 * py - ay), 'To byłoby, gdyby $P$ był środkiem $AB$.'], [pt(ax - (k + 1) * dx, ay - (k + 1) * dy), 'Punkt $B$ leży po stronie $P$, nie po przeciwnej.']]), steps: [T`$\overrightarrow{AP}=[${dx}, ${dy}]$, $\overrightarrow{AB}=${k + 1}\cdot\overrightarrow{AP}=[${(k + 1) * dx}, ${(k + 1) * dy}]$, więc $B=${pt(B[0], B[1])}$.`] };
  });

  /* =================== DZIAŁ XI: kombinatoryka =================== */
  reg('ostroslupLiczby', ['2305-27', '2406-25', '2408-24', '2608-27'], null, () => {
    const n = R.int(4, 30), W = n + 1, K = 2 * n, S = n + 1, t = R.int(0, 3), ng = m => m + '-kąt';
    if (t === 0) return { q: T`Ostrosłup prawidłowy ma $${n}$ ścian bocznych. Liczba wszystkich krawędzi tego ostrosłupa jest równa`, opts: opts(String(K), [[String(n), 'To tylko krawędzie boczne — doliczamy $' + n + '$ krawędzi podstawy.'], [String(n + 1), 'To liczba wierzchołków (albo ścian).'], [String(n + 2), 'Krawędzi jest $2n$.'], [String(3 * n), 'To byłoby dla graniastosłupa.']]), steps: [T`Podstawa: $${n}$ krawędzi, boczne: $${n}$; razem $${K}$.`] };
    if (t === 1) return { q: T`Liczba wszystkich ścian ostrosłupa prawidłowego jest równa $${S}$. Liczba wszystkich wierzchołków jest równa`, opts: opts(String(W), [[String(n), 'Wierzchołki podstawy plus wierzchołek ostrosłupa: $n+1$.'], [String(K), 'To liczba krawędzi.'], [String(n + 2), 'Ścian jest $n+1$, więc $n=' + n + '$.'], [String(2 * S), 'Policz: podstawa ma $' + n + '$ wierzchołków.']]), steps: [T`Ściany: $n+1=${S}\Rightarrow n=${n}$; wierzchołki: $n+1=${W}$.`] };
    if (t === 2) { const d = K - W; return { q: T`W pewnym ostrosłupie liczba krawędzi jest o $${d}$ większa od liczby wierzchołków. Podstawą ostrosłupa jest`, opts: opts(T`\text{${ng(n)}}`, [[T`\text{${ng(d)}}`, '$2n-(n+1)=n-1=' + d + '$, więc $n=' + n + '$.'], [T`\text{${ng(n + 1)}}`, 'Sprawdź: $2n-(n+1)=' + d + '$.'], [T`\text{${ng(2 * d)}}`, 'Krawędzi jest $2n$, wierzchołków $n+1$.'], [T`\text{${ng(n - 2 > 2 ? n - 2 : n + 2)}}`, 'Ułóż równanie $2n=(n+1)+' + d + '$.']]), steps: [T`$2n=(n+1)+${d}\Rightarrow n=${n}$.`] }; }
    const g = gcd(W, K); if (g === 1 && R.int(0, 1)) return null; const nn = n;
    return { q: T`W pewnym ostrosłupie prawidłowym stosunek liczby $W$ wierzchołków do liczby $K$ krawędzi jest równy $\frac{W}{K}=${qt(Q(W, K))}$. Podstawą tego ostrosłupa jest`, opts: opts(T`\text{${ng(nn)}}`, [[T`\text{${ng(nn + 1)}}`, '$\\frac{n+1}{2n}=' + qt(Q(W, K)) + '$ — rozwiąż równanie.'], [T`\text{${ng(nn - 1)}}`, 'Wierzchołków $n+1$, krawędzi $2n$.'], [T`\text{${ng(nn + 2)}}`, 'Sprawdź dla podanej odpowiedzi: $\\frac{W}{K}$.'], [T`\text{${ng(2 * nn)}}`, 'To liczba krawędzi.']]), steps: [T`$\frac{n+1}{2n}=${qt(Q(W, K))}\Rightarrow n=${nn}$.`] };
  });
  const cnt = (nd, pred) => { let c = 0; for (let x = 10 ** (nd - 1); x < 10 ** nd; x++) if (pred(String(x))) c++; return c; };
  reg('liczbyCyfry', ['2305-28', '2306-31', '2408-27', '2308-30', '2405-27', '2406-29', '2505-27', '2506-28', '2508-28', '2605-29', '2606-28'], ['f13-1', 'f13-3', 'f13-4'], () => {
    const t = R.int(0, 8), D = s => [...s].map(Number);
    if (t === 0) { const nd = R.int(3, 5), set = R.pick([[0, 5, 7], [0, 1, 2], [0, 3, 8, 9], [1, 4, 6], [2, 4, 7]]), k = set.length, z = set.includes(0) ? 1 : 0, c = (k - z) * k ** (nd - 1);
      const ex = z ? T`${k - 1}\cdot ${k}^{${nd - 1}}` : T`${k}^{${nd}}`;
      return { q: T`Wszystkich liczb naturalnych ${nd}-cyfrowych, w których zapisie występują tylko cyfry $${set.join(', ')}$, jest`, opts: opts(ex, [[z ? T`${k}^{${nd}}` : T`${k}\cdot ${k - 1}^{${nd - 1}}`, z ? 'Pierwszą cyfrą nie może być $0$.' : 'Cyfry mogą się powtarzać.'], [T`${nd}^{${k}}`, 'Podstawa potęgi to liczba cyfr do wyboru ($' + k + '$), wykładnik — liczba miejsc.'], [z ? T`${k - 1}\cdot ${nd}^{${k}}` : T`${nd}^{${k}}\cdot 2`, 'Na każdym z ' + nd + ' miejsc wybieramy jedną z ' + k + ' cyfr.'], [T`${k - 1}^{${nd}}`, z ? 'Zero może stać na dalszych miejscach.' : 'Każda z ' + k + ' cyfr jest dozwolona na każdym miejscu.']]), steps: [T`${z ? T`Pierwsza cyfra: $${k - 1}$ możliwości (bez zera), pozostałe: po $${k}$` : T`Każde z $${nd}$ miejsc: $${k}$ możliwości`}; razem $${ex}=${c}$.`] }; }
    if (t === 1) { const nd = R.int(2, 3), s = R.int(2, 5), c = cnt(nd, x => D(x).reduce((a, b) => a + b) === s), c0 = nd === 3 ? (s + 2) * (s + 1) / 2 : s + 1;
      return { q: T`Wszystkich liczb naturalnych ${nd}-cyfrowych o sumie cyfr równej $${s}$ jest`, opts: opts(String(c), [[String(c0), 'Liczono też zapisy z zerem na początku — to nie są liczby ' + nd + '-cyfrowe.'], [String(c - 1), 'Wypisz wszystkie systematycznie, np. od największej.'], [String(s), 'Wypisz wszystkie możliwości — jest ich więcej.'], [String(c + 2), 'Policz dokładnie, bez powtórzeń.']]), steps: [T`Wypisujemy systematycznie: jest ich $${c}$.`] }; }
    if (t === 2) { const k = R.int(1, 8), c = 10 - k;
      return { q: T`Wszystkich liczb naturalnych dwucyfrowych, w których cyfra dziesiątek jest o $${k}$ większa od cyfry jedności, jest`, opts: opts(String(c), [[String(c - 1), 'Cyfra jedności może być równa $0$ (np. $' + k + '0$).'], [String(2 * c), 'Tylko cyfra dziesiątek jest większa — nie odwrotnie.'], [String(9 - k + 2), 'Policz: jedności od $0$ do $' + (9 - k) + '$.'], [String(k), 'Liczba możliwości zależy od $9-' + k + '$.']]), steps: [T`Cyfra jedności $0,1,\ldots,${9 - k}$ — razem $${c}$ liczb.`] }; }
    if (t === 3) { const nd = R.int(3, 5), f = [9]; for (let i = 1; i < nd; i++) f.push(10 - i); const ex = f.join('\\cdot ');
      return { q: T`Wszystkich liczb naturalnych ${nd}-cyfrowych, w których cyfry się nie powtarzają, jest`, opts: opts(ex, [[Array.from({ length: nd }, (_, i) => 10 - i).join('\\cdot '), 'Pierwsza cyfra nie może być zerem — ma $9$ możliwości.'], [[9].concat(Array(nd - 1).fill(10)).join('\\cdot '), 'Cyfry nie mogą się powtarzać.'], [Array(nd).fill(9).join('\\cdot '), 'Na kolejnych miejscach ubywa jednej możliwości.'], [Array.from({ length: nd }, (_, i) => 9 - i).join('\\cdot '), 'Na drugim miejscu dochodzi $0$ — wciąż $9$ możliwości.']]), steps: [T`Pierwsza: $9$ (bez zera), kolejne: $${f.slice(1).join(', ')}$; razem $${ex}$.`] }; }
    if (t === 4) { const k = R.int(3, 6), f = [1, 1, 2, 6, 24, 120, 720][k];
      return { q: T`Rozważamy kody ${k}-cyfrowe utworzone z ${k} różnych danych cyfr, przy czym każda cyfra występuje w kodzie dokładnie raz. Liczba takich kodów jest równa`, opts: opts(String(f), [[String(k ** k), 'Cyfry nie mogą się powtarzać — to permutacje: $' + k + '!$.'], [String(k * k), 'To permutacje: $' + k + '\\cdot' + (k - 1) + '\\cdots1$.'], [String(k), 'Każde ustawienie to inny kod.'], [String(f / k), 'Policz $' + k + '!$.']]), steps: [T`$${k}!=${f}$.`] }; }
    if (t === 5) { const nd = R.int(3, 4), set = R.pick([[2, 4, 7], [1, 3, 6], [2, 5, 8], [1, 2, 3, 5], [3, 4, 9]]), par = R.int(0, 1), ok = set.filter(d => d % 2 === (par ? 0 : 1)).length; if (!ok) return null; const k = set.length, c = ok * k ** (nd - 1);
      return { q: T`Wszystkich liczb naturalnych ${nd}-cyfrowych ${par ? 'parzystych' : 'nieparzystych'}, w których zapisie występują tylko cyfry $${set.join(', ')}$, jest`, opts: opts(String(c), [[String(k ** nd), 'Ostatnia cyfra musi być ' + (par ? 'parzysta' : 'nieparzysta') + ' — tylko $' + ok + '$ możliwości.'], [String(ok * (k - 1) ** (nd - 1)), 'Cyfry mogą się powtarzać.'], [String(ok ** nd), 'Warunek parzystości dotyczy tylko cyfry jedności.'], [String(c / ok * (k - ok) || c + k), 'Pomylona parzystość.']]), steps: [T`Cyfra jedności: $${ok}$ możliwości, pozostałe $${nd - 1}$: po $${k}$; razem $${ok}\cdot ${k}^{${nd - 1}}=${c}$.`] }; }
    if (t === 6) { const par = R.int(0, 1), c = cnt(3, x => [...x].filter(d => d === '0').length === 1 && (+x % 2 === (par ? 0 : 1)));
      const c2 = cnt(3, x => x.includes('0') && (+x % 2 === (par ? 0 : 1))), c3 = cnt(3, x => [...x].filter(d => d === '0').length === 1);
      return { q: T`Wszystkich liczb naturalnych trzycyfrowych ${par ? 'parzystych' : 'nieparzystych'}, w których zapisie występuje dokładnie jeden raz cyfra $0$, jest`, opts: opts(String(c), [[String(c2), '„Dokładnie jeden raz” — wyklucz liczby z dwoma zerami.'], [String(c3), 'Uwzględnij warunek parzystości.'], [String(par ? 81 : 50), par ? 'Zero może stać na końcu (wtedy liczba jest parzysta) — rozpatrz przypadki.' : 'Zero może stać tylko w środku (nieparzysta kończy się cyfrą nieparzystą).'], [String(c + 9), 'Rozpatrz osobno: zero w środku i zero na końcu.']]), steps: [par ? T`Zero na końcu: $9\cdot 9=81$; zero w środku: $9\cdot 4=36$ (ostatnia z $2,4,6,8$); razem $${c}$.` : T`Zero tylko w środku: $9\cdot 1\cdot 5=${c}$.`] }; }
    if (t === 7) { const th = R.pick([300, 400, 500, 600, 700]), c = cnt(3, x => +x > th && D(x).every(d => d % 2)), cAll = cnt(3, x => D(x).every(d => d % 2));
      return { q: T`Wszystkich trzycyfrowych liczb naturalnych większych od $${th}$, w których zapisie występują tylko cyfry nieparzyste, jest`, opts: opts(String(c), [[String(cAll), 'Uwzględnij warunek „większych od ' + th + '”.'], [String(999 - th), 'Tylko cyfry nieparzyste.'], [String(c + 25), 'Cyfra setek musi być nieparzysta i większa od $' + th / 100 + '$.'], [String(c + 5), 'Pozostałe cyfry: po $5$ możliwości (tylko nieparzyste).']]), steps: [T`Cyfra setek: nieparzyste $>${th / 100 - 1}$, tzn. $${[1, 3, 5, 7, 9].filter(d => d >= th / 100).join(', ')}$; pozostałe: po $5$. Razem $${c}$.`] }; }
    if (R.int(0, 1)) { const c = cnt(4, x => x[0] === x[3] && +x % 2 === 0); return { q: T`Wszystkich liczb naturalnych czterocyfrowych parzystych, w których cyfra tysięcy jest równa cyfrze jedności, jest`, opts: opts(String(c), [[String(c * 5 / 4), 'Cyfra jedności = cyfra tysięcy, więc nie może być $0$: tylko $2,4,6,8$.'], [String(900), 'Liczba musi być parzysta.'], [String(1600), 'Cyfra jedności jest wyznaczona przez cyfrę tysięcy.'], [String(c / 4 * 9), 'Tylko parzyste cyfry tysięcy.']]), steps: [T`Cyfra tysięcy = jedności $\in\{2,4,6,8\}$: $4$; środkowe: $10\cdot10$. Razem $${c}$.`] }; }
    const top = R.int(5, 8), c = cnt(3, x => D(x).every(d => d <= top - 1) && +x % 2 === 1), ex = T`${top - 1}\cdot ${top}\cdot ${Math.ceil((top - 1) / 2)}`; void c;
    return { q: T`Wszystkich liczb naturalnych trzycyfrowych nieparzystych, w których zapisie występują tylko cyfry $0, 1, \ldots, ${top - 1}$, jest`, opts: opts(ex, [[T`${top}\cdot ${top}\cdot ${Math.ceil((top - 1) / 2)}`, 'Pierwsza cyfra nie może być zerem.'], [T`${top - 1}\cdot ${top}\cdot ${top}`, 'Ostatnia cyfra musi być nieparzysta.'], [T`${top}\cdot ${top}\cdot ${top}`, 'Dwa warunki: bez zera na początku, nieparzysta na końcu.'], [T`${top - 1}\cdot ${top - 1}\cdot ${Math.ceil((top - 1) / 2)}`, 'Cyfry mogą się powtarzać — w środku wszystkie $' + top + '$.']]), steps: [T`Setki: $${top - 1}$ (bez zera), dziesiątki: $${top}$, jedności (nieparzyste): $${Math.ceil((top - 1) / 2)}$.`] };
  });

  /* =================== DZIAŁ XII: prawdopodobieństwo i statystyka =================== */
  reg('kule', ['2406-30'], ['f14-2'], () => {
    const [p, q] = R.pick([[3, 5], [2, 3], [3, 4], [2, 5], [1, 4], [4, 7]]), m = R.int(2, 8), b = p * m, w = (q - p) * m;
    return { q: T`W pudełku są wyłącznie kule białe i czarne. Kul czarnych jest $${b}$. Prawdopodobieństwo wylosowania kuli czarnej jest równe $\frac{${p}}{${q}}$. Liczba kul białych jest równa`, opts: opts(String(w), [[String(q * m), 'To liczba wszystkich kul.'], [(b * p) % (q - p) ? null : String(b * p / (q - p)), 'Prawdopodobieństwo $\\frac{' + p + '}{' + q + '}$ dotyczy kul <b>czarnych</b>: $\\frac{' + b + '}{' + b + '+n}$.'], [String(b), 'Kul białych nie musi być tyle samo.'], [String(p * m * 2), 'Rozwiąż $\\frac{' + b + '}{' + b + '+n}=\\frac{' + p + '}{' + q + '}$.']]), steps: [T`$\frac{${b}}{${b}+n}=\frac{${p}}{${q}}\Rightarrow ${b}+n=${q * m}\Rightarrow n=${w}$.`] };
  });
  reg('kostki', ['2505-28', '2608-28'], ['f14-2'], () => {
    const t = R.int(0, 1), s = R.int(3, 11), pairs = []; for (let i = 1; i <= 6; i++) for (let j = 1; j <= 6; j++) pairs.push([i, j]);
    const cond = t === 0 ? ([i, j]) => i + j === s : t === 1 ? ([i, j]) => i + j > s : ([i, j]) => i * j === s * 2 - 2 || false, desc = t === 0 ? T`suma oczek będzie równa $${s}$` : T`suma oczek będzie większa od $${s}$`;
    if (t === 2) return null; const c = pairs.filter(cond).length, un = new Set(pairs.filter(cond).map(([i, j]) => Math.min(i, j) + ',' + Math.max(i, j))).size; if (!c) return null;
    return { q: T`Rzucamy dwa razy symetryczną sześcienną kostką. Prawdopodobieństwo, że ${desc}, jest równe`, opts: opts(qo(Q(c, 36)), [[un === c ? qo(Q(c + 1, 36)) : qo(Q(un, 36)), 'Pary są uporządkowane: $(5,6)$ i $(6,5)$ to dwa różne wyniki.'], [qo(Q(c, 12)), 'Wszystkich wyników jest $6\\cdot6=36$, nie $6+6$.'], [qo(Q(un, 21)), 'Wszystkich wyników jest $36$ (pary uporządkowane).'], [qo(Q(c, 6)), 'Rzucamy dwa razy — $36$ wyników.']]), steps: [T`$|\Omega|=36$, sprzyjające: $${pairs.filter(cond).map(([i, j]) => '(' + i + ',' + j + ')').join(', ')}$ — $${c}$; $P=${qt(Q(c, 36))}$.`] };
  });
  reg('srednia', ['2405-28', '2506-29', '2505-29', '2605-32', '2606-29'], ['f15-1', 'f15-5'], () => {
    const t = R.int(0, 3);
    if (t === 0) { const m = R.int(2, 15), p = R.int(1, 4), q = p + R.int(1, 3), v = Q(m * (p + q), 2);
      return { q: T`Średnia arytmetyczna trzech liczb $a, b, c$ jest równa $${m}$. Średnia arytmetyczna sześciu liczb $${p === 1 ? '' : p}a, ${q}a, ${p === 1 ? '' : p}b, ${q}b, ${p === 1 ? '' : p}c, ${q}c$ jest równa`, opts: opts(dq(v), [[String(m * (p + q)), 'Liczb jest sześć: suma $' + (p + q) + '(a+b+c)$ dzielimy przez $6$.'], [String(m), 'Liczby są przemnożone — średnia się zmienia.'], [String(m * p * q), 'Współczynniki się dodają, nie mnożą.'], [dq(Q(m * (p + q), 6)), 'Suma $a+b+c=' + 3 * m + '$, nie $' + m + '$.']]), steps: [T`$a+b+c=${3 * m}$; suma sześciu: $${p + q}\cdot ${3 * m}=${3 * m * (p + q)}$; średnia: $\frac{${3 * m * (p + q)}}{6}=${dq(v)}$.`] }; }
    if (t === 1) { const n = R.int(4, 6), m = R.int(2, 6), xs = Array.from({ length: n }, (_, i) => i + 1), S = (n + 2) * m - xs.reduce((a, b) => a + b); if (S < 0) return null;
      return { q: T`Średnia arytmetyczna ${n + 2} liczb: $${xs.join(', ')}, x, y$ jest równa $${m}$. Suma $x+y$ jest równa`, opts: opts(String(S), [[String(n * m - xs.reduce((a, b) => a + b)), 'Liczb jest $' + (n + 2) + '$, nie $' + n + '$.'], [String(2 * m), 'To nie znaczy, że $x=y=' + m + '$ — liczymy z sumy.'], [String((n + 2) * m), 'To suma wszystkich liczb; odejmij $' + xs.reduce((a, b) => a + b) + '$.'], [String(S + 1), 'Sprawdź rachunek.']]), steps: [T`Suma: $${n + 2}\cdot ${m}=${(n + 2) * m}$; $x+y=${(n + 2) * m}-${xs.reduce((a, b) => a + b)}=${S}$.`] }; }
    if (t === 2) { const n1 = R.int(2, 5), n2 = R.int(2, 5), m1 = R.int(1, 8), m2 = Q(R.int(4, 20), 2), v = qdiv(qadd(Q(n1 * m1), qmul(Q(n2), m2)), Q(n1 + n2)); if (![1, 2, 4, 5, 8, 10, 20].includes(v.d)) return null;
      return { q: T`Średnia arytmetyczna ${n1} liczb jest równa $${m1}$, a średnia innych ${n2} liczb — $${dq(m2)}$. Średnia wszystkich ${n1 + n2} liczb jest równa`, opts: opts(dq(v), [[dq(qdiv(qadd(Q(m1), m2), Q(2))), 'Grupy mają różną liczebność — to średnia ważona.'], [dq(qdiv(qadd(Q(n2 * m1), qmul(Q(n1), m2)), Q(n1 + n2))), 'Pomylone wagi.'], [dq(qadd(Q(m1), m2)), 'Średnią trzeba podzielić przez liczbę liczb.'], [dq(qadd(v, Q(1, 4))), 'Sprawdź rachunek: $\\frac{' + n1 + '\\cdot' + m1 + '+' + n2 + '\\cdot' + dq(m2) + '}{' + (n1 + n2) + '}$.']]), steps: [T`$\frac{${n1}\cdot ${m1}+${n2}\cdot ${dq(m2)}}{${n1 + n2}}=${dq(v)}$.`] }; }
    const k = R.int(2, 4), a1 = R.int(6, 14), a2 = a1 + R.int(2, 6), v = Q(k * a1 + a2, k + 1); if (![1, 2, 4, 5, 10].includes(v.d)) return null;
    return { q: T`W pierwszej szkole jest ${k} razy więcej uczniów niż w drugiej. Średni wiek uczniów w pierwszej szkole to $${a1}$ lat, a w drugiej — $${a2}$ lat. Średni wiek wszystkich uczniów jest równy`, opts: opts(dq(v), [[dq(Q(a1 + a2, 2)), 'Szkoły mają różną liczbę uczniów — średnia ważona z wagami $' + k + '$ i $1$.'], [dq(Q(a1 + k * a2, k + 1)), 'Waga $' + k + '$ należy do <b>pierwszej</b> szkoły.'], [dq(Q(k * a1 + a2, k)), 'Dzielimy przez sumę wag $' + (k + 1) + '$.'], [String(a1), 'Średnia leży między $' + a1 + '$ a $' + a2 + '$.']]), steps: [T`$\frac{${k}\cdot ${a1}+1\cdot ${a2}}{${k + 1}}=${dq(v)}$.`] };
  });
  reg('diagramStat', ['2308-32', '2405-29', '2406-28', '2408-28', '2606-30', '2605-31', '2305-29', '2505-30', '2506-30', '2508-30', '2608-29'], ['f15-1', 'f15-6', 'f15-5'], () => {
    const xs = [1, 2, 3, 4, 5, 6], ns = xs.map(() => R.int(0, 8)), N = ns.reduce((a, b) => a + b); if (N < 8) return null;
    const flat = []; xs.forEach((x, i) => { for (let k = 0; k < ns[i]; k++) flat.push(x); });
    const med = N % 2 ? Q(flat[(N - 1) / 2]) : Q(flat[N / 2 - 1] + flat[N / 2], 2), mean = Q(flat.reduce((a, b) => a + b), N), mode = xs[ns.indexOf(Math.max(...ns))];
    const tbl = `<table class="mtab2"><tr><th>ocena</th>${xs.map(x => '<td>' + String(x).replace('-', '−') + '</td>').join('')}</tr><tr><th>liczba uczniów</th>${ns.map(y => '<td>' + String(y).replace('-', '−') + '</td>').join('')}</tr></table>`;
    const fm = x => (x.d === 1 ? String(x.n) : x.d === 2 || x.d === 4 || x.d === 5 ? dq(x) : T`${qt(x)}\approx ${dec(+(x.n / x.d).toFixed(2))}`);
    if (R.int(0, 1)) return { q: 'W tabeli przedstawiono oceny uczniów pewnej klasy ze sprawdzianu.' + tbl + 'Mediana ocen jest równa', opts: opts(fm(med), [[fm(Q(mode)), 'To dominanta (najczęstsza ocena), nie mediana.'], [fm(Q(7, 2)), 'Mediana to środkowa wartość <b>uporządkowanych wyników</b>, nie środek skali ocen.'], [fm(mean), 'To średnia arytmetyczna.'], [fm(Q(ns.slice().sort((a, b) => a - b)[2] + ns.slice().sort((a, b) => a - b)[3], 2)), 'Mediana dotyczy ocen, nie liczebności.']]), steps: [T`Uczniów: $${N}$; ${N % 2 ? T`środkowy wynik to $${(N + 1) / 2}$.` : T`środkowe wyniki to $${N / 2}$. i $${N / 2 + 1}$.`} Mediana: $${fm(med)}$.`] };
    return { q: 'W tabeli przedstawiono oceny uczniów pewnej klasy ze sprawdzianu.' + tbl + 'Średnia arytmetyczna ocen jest równa', opts: opts(fm(mean), [[fm(Q(7, 2)), 'To średnia skali ocen — trzeba uwzględnić liczebności (średnia ważona).'], [fm(Q(N, 6)), 'To średnia liczba uczniów na ocenę.'], [fm(med), 'To mediana.'], [fm(Q(flat.reduce((a, b) => a + b), N + 1)), 'Dzielimy przez liczbę uczniów $' + N + '$.']]), steps: [T`Suma ocen: $${xs.map((x, i) => x + '\\cdot ' + ns[i]).join('+')}=${flat.reduce((a, b) => a + b)}$; średnia: $\frac{${flat.reduce((a, b) => a + b)}}{${N}}=${fm(mean)}$.`] };
  });

  /* =================== DZIAŁ XIII: optymalizacja =================== */
  reg('optym', ['2506-31', '2605-33.2', '2406-32'], ['f07-3'], () => {
    if (R.int(0, 1)) { const b = R.pick([10, 20, 25, 50]), a = b * R.int(2, 12), c = R.int(10, 30), p2 = c - a / b; if (p2 <= 0 || p2 % 2) return null; const p = p2 / 2, Z = x => (a + b * x) * (c - x);
      return { q: T`Zysk ze sprzedaży wyraża się wzorem $Z(x)=(${a}+${b}x)(${c}-x)$, gdzie $x$ to kwota obniżki ceny (w zł). Zysk jest największy dla obniżki $x$ równej`, opts: opts(String(p), [[String(c), 'To miejsce zerowe — wierzchołek leży w połowie między miejscami zerowymi.'], [String(c / 2 === p ? c / 2 + 1 : c / 2), 'Miejsca zerowe to $' + -a / b + '$ i $' + c + '$ — średnia z obu.'], [String(Z(p)), 'To wartość największego zysku, a pytamy o $x$.'], [String(p + 1), 'Wierzchołek: $p=\\frac{x_1+x_2}{2}$.']]), steps: [T`Miejsca zerowe: $${-a / b}$ i $${c}$; wierzchołek: $p=\frac{${-a / b}+${c}}{2}=${p}$.`] }; }
    const tm = R.pick([1, 1.5, 2, 2.5, 3]), v = +(9.8 * tm).toFixed(1), hm = +(4.9 * tm * tm).toFixed(3);
    return { q: T`Piłeczkę wyrzucono pionowo do góry. Jej wysokość (w metrach) po czasie $t$ (w sekundach) wyraża się wzorem $h(t)=-4{,}9t^2+${dec(v)}t$. Piłeczka osiągnęła największą wysokość po czasie`, opts: opts(T`${dec(tm)}\ \text{s}`, [[T`${dec(2 * tm)}\ \text{s}`, 'To chwila upadku (drugie miejsce zerowe) — wierzchołek jest w połowie.'], [T`${dec(hm)}\ \text{s}`, 'To największa wysokość (w metrach), a nie czas.'], [T`${dec(tm / 2)}\ \text{s}`, '$t_w=-\\frac{b}{2a}=\\frac{' + dec(v) + '}{9{,}8}$.'], [T`${dec(+(v / 4.9).toFixed(2) + 1)}\ \text{s}`, 'Skorzystaj ze wzoru na wierzchołek paraboli.']]), steps: [T`$t_w=-\frac{b}{2a}=\frac{${dec(v)}}{9{,}8}=${dec(tm)}$.`] };
  });

  reg('graniastSciana', ['2405-25.1'], ['f12-3', 'f10-6'], () => {
    const H = R.int(2, 12), a2 = R.pick([2, 3, 5, 6, 7, 10, 4, 9]), Pp = 3 * a2, a = surd(a2), [k, m] = surdKM(a2), face = m === 1 ? String(H * k) : kS(H * k, m);
    return { q: T`Wysokość graniastosłupa prawidłowego sześciokątnego jest równa $${H}$, a pole podstawy jest równe $${qt(Q(Pp, 2)) === '1' ? '' : qt(Q(Pp, 2))}\sqrt3$. Pole jednej ściany bocznej jest równe`, opts: opts(face, [[String(H * a2), 'To $H\\cdot a^2$ — bok to $a=\\sqrt{' + a2 + '}$.'], [kS(H * H * k, m), 'Ściana to prostokąt $a\\times H$.'], [String(6 * H * a2), 'To nie pole boczne całości — jedna ściana: $a\\cdot H$.'], [m === 1 ? String(6 * H * k) : kS(6 * H * k, m), 'Pytamy o <b>jedną</b> ścianę, nie o sześć.']]), steps: [T`$\frac{3a^2\sqrt3}{2}=${qt(Q(Pp, 2))}\sqrt3\Rightarrow a^2=${a2}\Rightarrow a=${a}$; ściana: $a\cdot H=${face}$.`] };
  });

  A.MGEN = { G, MAP, snipTitles: {}, gen: id => { const g = G[MAP[id]]; if (!g) return null; for (let k = 0; k < 60; k++) { let r = null; try { r = g.gen(); } catch (e) { r = null; } if (r && (r.opts || r.pf || r.multi)) { if (r.pf && !(r.steps && r.steps.length)) r.steps = r.pf.map(x => x[2]).filter(Boolean); return Object.assign({ pattern: MAP[id] }, r); } } return null; }, wz: id => (G[MAP[id]] || {}).wz || [], noWz: id => !!G[MAP[id]] && G[MAP[id]].wz === null };
})();
