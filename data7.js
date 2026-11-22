/* Elementarna teoria liczb — Lista 1: Podzielność.
   Dowody mają kilka metod do wyboru; każda: kroki prowadzone, wersja na kolokwium (z punktami) i pułapki. */
(function () {
  'use strict';
  const A = AQ, R = A.R, T = String.raw;
  const { mk, txtField, W, norm } = A.PRO;
  const gcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a; };
  const md = (a, m) => ((a % m) + m) % m;
  const inv = (a, m) => { for (let x = 1; x < m; x++) if (md(a * x, m) === 1) return x; return null; };
  const pw = (b, e) => { let r = 1n; for (let i = 0; i < e; i++) r *= BigInt(b); return r; };
  const big = n => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '\\,');
  const S = (goal, q, a, line, why, ...w) => ({ goal, q, a, line, why, w });
  // metoda: nazwa, kiedy jej użyć, pomysł, kroki, wersja na kolokwium [[linia, za co punkt]], pułapki
  // kropka i ■ po wielowierszowym wzorze lądują przy pierwszym wierszu — przenosimy je do środka, na koniec ostatniego wiersza
  const fixAl = t => (typeof t === 'string' ? t.replace(/\\end\{aligned\}\$\. \$\\blacksquare\$/g, '.\\ \\blacksquare\\end{aligned}$').replace(/\\end\{aligned\}\$\./g, '.\\end{aligned}$') : t);
  const M = (name, when, idea, steps, exam, traps) => { steps.forEach(st => { st.line = fixAl(st.line); }); exam = exam.map(([l, pt]) => [fixAl(l), pt]); return { name, when, idea, steps, exam, traps, sol: steps.map(s => s.line) }; };
  // podpunkt-dowód: domyślnie pierwsza metoda (dla zgodności), wybór metody robi aplikacja
  const proof = (label, gk, q, methods) => Object.assign({ label, gk, type: 'guided', q, methods }, { steps: methods[0].steps, idea: methods[0].idea, sol: methods[0].sol, exam: methods[0].exam, traps: methods[0].traps });
  const sgn = x => (x < 0 ? '-' + Math.abs(x) : '+' + x);

  /* ===== 1(a,b): k | n^p + a·n ===== */
  function cubeProof(p, k, a) { // p ∈ {3,5}; k | n^p + a n, gdzie a ≡ −1 (mod k)
    const c = a + 1, exprT = T`n^{${p}}${a === -1 ? '-n' : a === 1 ? '+n' : sgn(a) + 'n'}`;
    const extra = c === 0 ? '' : (c < 0 ? `${c}n` : `+${c}n`);
    const fac = p === 3 ? T`(n-1)n(n+1)` : T`(n-1)n(n+1)(n^2+1)`;
    const q = T`Udowodnij, że dla każdego $n\in\mathbb N$: $\ ${k}\mid ${exprT}$.`;
    const split = c === 0 ? '' : T` Zapisz: $${exprT}=(n^{${p}}-n)${extra}$, a $${c}n$ dzieli się przez $${k}$, bo $${k}\mid ${c}$.`;
    const vals = [...Array(k).keys()].map(r => [r, md(r ** p + a * r, k)]);
    const tbl = vals.map(([r, v]) => T`n\equiv ${r}&:\ ${r}^{${p}}${a < 0 ? '-' : '+'}${Math.abs(a) === 1 ? '' : Math.abs(a) + '\\cdot '}${r}=${r ** p + a * r}\equiv ${v}`).join(',\\\\ '); const tblA = '\\begin{aligned}[t]' + tbl + '\\end{aligned}';
    const factorMethod = p === 3 ? M('Rozkład na czynniki', 'Wielomian od $n$ — rozłóż go; często wychodzi iloczyn kolejnych liczb.',
      T`$n^3-n=(n-1)n(n+1)$ to trzy kolejne liczby całkowite.${k === 6 ? ' Wśród nich jest liczba parzysta i liczba podzielna przez 3.' : ' Jedna z nich dzieli się przez 3.'}${split}`,
      [S('Rozkład', T`Jak zapisać $n^3-n$ jako iloczyn?`, T`$n^3-n=(n-1)n(n+1)$`, T`$n^3-n=n(n^2-1)=(n-1)n(n+1)$${c ? T`, a $${exprT}=(n-1)n(n+1)${extra}$` : ''}.`, 'Wyciągamy $n$ przed nawias, a $n^2-1$ to różnica kwadratów.',
        [T`$n^3-n=n(n-1)^2$`, T`$n(n-1)^2=n^3-2n^2+n$ — inny wielomian.`], [T`$n^3-n=(n-1)(n^2+n+1)$`, T`To rozkład $n^3-1$, a nie $n^3-n$.`]),
       S('Kolejne liczby', T`Co wiemy o liczbach $n-1,\ n,\ n+1$?`, k === 6 ? 'To trzy kolejne liczby — jest wśród nich liczba parzysta i liczba podzielna przez 3' : 'To trzy kolejne liczby — jedna z nich dzieli się przez 3',
        k === 6 ? T`Wśród trzech kolejnych liczb całkowitych jest liczba parzysta i liczba podzielna przez $3$, więc $2\mid(n-1)n(n+1)$ i $3\mid(n-1)n(n+1)$; skoro $(2,3)=1$, to $6\mid(n-1)n(n+1)$.` : T`Wśród trzech kolejnych liczb całkowitych $n-1,n,n+1$ jedna dzieli się przez $3$ (dają różne reszty $0,1,2$), więc $3\mid(n-1)n(n+1)$.`,
        k === 6 ? 'Podzielność przez 2 i przez 3 daje podzielność przez 6, bo 2 i 3 są względnie pierwsze — to trzeba napisać.' : 'Trzy kolejne liczby dają trzy różne reszty z dzielenia przez 3, więc jedna reszta to 0.',
        ['Wszystkie trzy są nieparzyste', 'Kolejne liczby mają różną parzystość.'], ['Ich suma $3n$ dzieli się przez 3, więc iloczyn też', 'Z podzielności sumy nie wynika podzielność iloczynu.'])].concat(c ? [S('Doklejony wyraz', T`Co z wyrazem $${c}n$?`, T`$${k}\mid ${c}n$, bo $${k}\mid ${c}$`, T`$${k}\mid ${c}n$, bo $${c}=${k}\cdot ${c / k}$. Suma liczb podzielnych przez $${k}$ jest podzielna przez $${k}$: $\ ${k}\mid ${exprT}$. $\blacksquare$`, 'Podzielność sumy: jeśli $k\\mid A$ i $k\\mid B$, to $k\\mid A+B$.',
        [T`Trzeba go osobno sprawdzić dla małych $n$`, 'Nie — $' + c + 'n$ dzieli się przez $' + k + '$ dla każdego $n$.'], [T`Psuje podzielność`, 'Dodanie wielokrotności $' + k + '$ nie zmienia reszty.'])] : [S('Wniosek', 'Co z tego wynika?', T`$${k}\mid n^3-n$`, T`Zatem $${k}\mid n^3-n$ dla każdego $n\in\mathbb N$. $\blacksquare$`, 'Iloczyn, którego czynnik (lub kilka czynników) daje podzielność, sam jest podzielny.', ['Tylko dla $n\\geq3$', 'Rozumowanie działa dla każdego $n$, także $n=1$ (wtedy iloczyn to 0).'], ['Tylko dla parzystych $n$', 'Parzystość $n$ nie ma tu znaczenia.'])]),
      [[T`$${exprT}=${c ? '(n-1)n(n+1)' + extra : '(n-1)n(n+1)'}$`, 'poprawny rozkład'], [k === 6 ? T`Wśród trzech kolejnych liczb $n-1,n,n+1$ jest liczba parzysta i podzielna przez 3; $(2,3)=1$, więc $6\mid(n-1)n(n+1)$.` : T`Wśród trzech kolejnych liczb $n-1,n,n+1$ jedna jest podzielna przez $3$, więc $3\mid(n-1)n(n+1)$.`, 'uzasadnienie, dlaczego iloczyn dzieli się przez ' + k], ...(c ? [[T`$${k}\mid ${c}n$, więc $${k}\mid ${exprT}$.`, 'podzielność sumy']] : []), [T`$\blacksquare$`, null]],
      ['Samo „to iloczyn kolejnych liczb” bez wskazania, dlaczego dzieli się przez ' + k + '.', ...(k === 6 ? ['Brak informacji, że 2 i 3 są względnie pierwsze (inaczej z 2 | x i 4 | x nie wynika 8 | x).'] : []), 'Sprawdzenie kilku $n$ to nie dowód.'])
      : M('Rozkład na czynniki', 'Wielomian od $n$ — rozłóż go do końca, potem rozważ reszty.', T`$n^5-n=(n-1)n(n+1)(n^2+1)$. Gdy $n\equiv0,\pm1\pmod5$, dzieli się któryś z pierwszych trzech czynników; gdy $n\equiv\pm2$, to $n^2+1\equiv5\equiv0$.${split}`,
      [S('Rozkład', T`Jak rozłożyć $n^5-n$?`, T`$n(n^4-1)=(n-1)n(n+1)(n^2+1)$`, T`$n^5-n=n(n^4-1)=n(n^2-1)(n^2+1)=(n-1)n(n+1)(n^2+1)$.`, 'Dwa razy różnica kwadratów.', [T`$n(n-1)^4$`, 'Po wymnożeniu nie wychodzi $n^5-n$.'], [T`$(n-1)n(n+1)(n+2)(n+3)$`, 'To pięć kolejnych liczb — ich iloczyn jest stopnia 5, ale to inny wielomian.']),
       S('Przypadki', T`Kiedy $5$ dzieli któryś z czynników $n-1,\ n,\ n+1$?`, T`Gdy $n\equiv0,1,4\pmod5$`, T`Jeśli $n\equiv0$, $n\equiv1$ lub $n\equiv4\pmod5$, to $5$ dzieli odpowiednio $n$, $n-1$ lub $n+1$.`, '$n+1\\equiv0$ dokładnie wtedy, gdy $n\\equiv4\\equiv-1\\pmod 5$.', [T`Gdy $n\equiv0,1,2$`, T`$n\equiv2$ nie zeruje żadnego z czynników $n-1,n,n+1$.`], ['Zawsze', 'Dla $n=2$: $1\\cdot2\\cdot3$ nie dzieli się przez 5.']),
       S('Pozostałe reszty', T`Co, gdy $n\equiv2$ lub $n\equiv3\pmod5$?`, T`Wtedy $n^2+1\equiv0\pmod5$`, T`Jeśli $n\equiv\pm2\pmod5$, to $n^2+1\equiv4+1=5\equiv0\pmod5$. W każdym przypadku $5\mid n^5-n$${c ? T`, a $5\mid ${c}n$, więc $5\mid ${exprT}$` : ''}. $\blacksquare$`, 'Wszystkie pięć reszt jest pokrytych — to najważniejszy punkt dowodu.', [T`Wtedy $n^2+1\equiv3$`, T`$2^2+1=5$, $3^2+1=10$.`], ['Te przypadki można pominąć', 'Wtedy dowód nie obejmuje np. $n=2$ — sprawdzający odejmie punkty.'])],
      [[T`$n^5-n=(n-1)n(n+1)(n^2+1)$`, 'rozkład'], [T`$n\equiv0,1,4\pmod5\Rightarrow5$ dzieli $n$, $n-1$ lub $n+1$.`, 'trzy reszty'], [T`$n\equiv2,3\pmod5\Rightarrow n^2+1\equiv5\equiv0\pmod5$.`, 'pozostałe dwie reszty'], [T`W każdym przypadku $5\mid n^5-n$.${c ? T` Ponadto $5\mid ${c}n$.` : ''} $\blacksquare$`, 'wszystkie przypadki zamknięte']],
      ['Pominięte reszty $2$ i $3$ — najczęstsza utrata punktów.', 'Powołanie się na małe twierdzenie Fermata tylko wtedy, gdy było na wykładzie.']);
    const restMethod = M('Wszystkie reszty', T`Mały moduł $${k}$ — sprawdź po kolei każdą resztę $n$ z dzielenia przez $${k}$.`, T`Wystarczy policzyć $${exprT}$ modulo $${k}$ dla $n\equiv0,1,\ldots,${k - 1}$ — zawsze wychodzi $0$.`,
      [S('Przypadki', 'Ile przypadków trzeba rozważyć?', T`$${k}$: $n\equiv0,1,\ldots,${k - 1}\pmod{${k}}$`, T`Każda liczba całkowita daje przy dzieleniu przez $${k}$ jedną z reszt $0,1,\ldots,${k - 1}$; rozważamy każdą.`, 'Reszta $n$ wyznacza resztę każdego wielomianu od $n$ (kongruencje można dodawać, mnożyć i potęgować).', [T`Dwa: $n$ parzyste i nieparzyste`, T`Parzystość to reszty modulo 2, a tu dzielimy przez $${k}$.`], [T`Wystarczy $n=1,2,3$`, 'Sprawdzenie kilku liczb to nie dowód — trzeba reszt, które obejmują wszystkie $n$.']),
       S('Rachunek', T`Ile wynosi $${exprT}$ modulo $${k}$ w każdym przypadku?`, T`$0$ w każdym przypadku`, T`$${tblA}$`, 'Liczymy na resztach, bo $n\\equiv r$ daje $n^' + p + '\\equiv r^' + p + '$.', [T`$0$ tylko dla parzystych reszt`, 'Policz jeszcze raz — tabelka daje same zera.'], [T`Reszty $0,1,\ldots$ kolejno`, 'To reszty samego $n$, a nie wyrażenia.']),
       S('Wniosek', 'Co z tego wynika?', T`$${k}\mid ${exprT}$ dla każdego $n$`, T`W każdym przypadku $${exprT}\equiv0\pmod{${k}}$, więc $${k}\mid ${exprT}$ dla każdego $n\in\mathbb N$. $\blacksquare$`, 'Przypadki obejmują wszystkie liczby całkowite.', ['Tylko dla $n<' + k + '$', 'Reszty obejmują wszystkie $n$, nie tylko małe.'], ['Tylko dla $n$ podzielnych przez ' + k, 'Wyszło 0 dla każdej reszty.'])],
      [[T`Rozważamy reszty $n$ z dzielenia przez $${k}$.`, 'wszystkie przypadki wymienione'], [T`$${tblA}$`, 'rachunek dla każdej reszty'], [T`Zatem $${k}\mid ${exprT}$ dla każdego $n$. $\blacksquare$`, 'wniosek']],
      ['Pominięcie którejś reszty.', 'Zapis „n = 1, 2, 3 sprawdzone” zamiast reszt — to nie jest dowód.']);
    // trzecia metoda: indukcja (zapis jak na zajęciach: sprawdzenie, założenie, teza, dowód tezy)
    const cT = c === 0 ? '' : c > 0 ? '+' + c : String(c);
    const anT = a === 1 ? '+n' : a === -1 ? '-n' : (a < 0 ? a : '+' + a) + 'n', aT = a < 0 ? String(a) : '+' + a;
    const expr1 = exprT.replace(/n/g, '(n+1)');
    const expand = p === 3 ? T`n^3+3n^2+3n+1${anT}${aT}` : T`n^5+5n^4+10n^3+10n^2+5n+1${anT}${aT}`;
    const extraT = p === 3 ? T`3n(n+1)${cT}` : T`5(n^4+2n^3+2n^2+n)${cT}`;
    const whyDiff = k === 6 ? T`$n(n+1)$ to iloczyn dwóch kolejnych liczb, więc jest parzysty, czyli $6\mid 3n(n+1)$${c ? T`; do tego $6\mid ${c}$` : ''}.` : p === 3 ? T`$3\mid 3n(n+1)$${c ? T` i $3\mid ${c}$` : ''}.` : T`$5\mid 5(n^4+2n^3+2n^2+n)$${c ? T` i $5\mid ${c}$` : ''}.`;
    const indMethod = M('Indukcja', 'Teza „dla każdego $n\\in\\mathbb N$” — indukcja działa zawsze, gdy rozkład nie przychodzi do głowy.', T`Wyrażenie dla $n+1$ to wyrażenie dla $n$ plus $${extraT}$, a ta reszta dzieli się przez $${k}$.`,
      [S('Sprawdzenie dla n = 1', 'Co sprawdzamy na początku?', T`$n=1$: $1^{${p}}${aT}=${c}$, podzielne przez $${k}$`, T`Dla $n=1$: $1^{${p}}${aT}=${c}$ i $${k}\mid ${c}$ — teza zachodzi.`, 'Bez sprawdzenia dla $n=1$ indukcja nic nie dowodzi — to osobny punkt.', [T`$n=0$: wychodzi $0$`, 'Dowodzimy dla $n\\in\\mathbb N=\\{1,2,\\ldots\\}$ — zaczynamy od $n=1$.'], [T`$n=1$: wychodzi $${p}$`, T`$1^{${p}}${aT}=${c}$.`]),
       S('Założenie i teza', 'Co zakładamy, a co chcemy wykazać?', T`Zał.: $${exprT}=${k}l$; teza: $${k}\mid ${expr1}$`, T`<b>Założenie indukcyjne:</b> dla pewnego $n\in\mathbb N$ zachodzi $${k}\mid ${exprT}$, czyli $${exprT}=${k}l$ dla pewnego $l\in\mathbb Z$.<br><b>Teza indukcyjna:</b> $${k}\mid ${expr1}$.`, 'Założenie zapisujemy od razu z definicji podzielności — przyda się w rachunku.', [T`Zakładamy, że $${k}\mid ${exprT}$ dla każdego $n$`, 'To byłaby cała teza — zakładamy tylko dla jednego, ustalonego $n$.'], [T`Teza: $${k}\mid ${exprT}$`, 'Tezę piszemy dla $n+1$.']),
       S('Rozpisanie dla n + 1', T`Jak zapisać $${expr1}$ przez wyrażenie dla $n$?`, T`$=(${exprT})+${extraT}$`, T`$${expr1}=${expand}=(${exprT})+${extraT}=${k}l+${extraT}$.`, 'Rozwijamy potęgę, a potem wyodrębniamy wyrażenie z założenia.', [T`$=${exprT}+1$`, 'Rozwiń $(n+1)^' + p + '$ — zmienia się więcej niż o 1.'], [T`$=(${exprT})\cdot(n+1)$`, 'Dodajemy, a nie mnożymy.']),
       S('Podzielność', T`Dlaczego $${k}$ dzieli $${k}l+${extraT}$?`, k === 6 ? T`$n(n+1)$ parzyste, więc $6\mid 3n(n+1)$${c ? T`, i $6\mid ${c}$` : ''}` : T`Każdy składnik dzieli się przez $${k}$`, T`${whyDiff} Każdy składnik sumy $${k}l+${extraT}$ dzieli się przez $${k}$, więc $${k}\mid ${expr1}$ — teza indukcyjna zachodzi.`, k === 6 ? 'Sam czynnik 3 nie wystarcza — parzystość $n(n+1)$ daje brakującą dwójkę.' : 'Suma liczb podzielnych przez ' + k + ' dzieli się przez ' + k + '.', [T`Bo $${k}\mid n$`, 'Nie wiemy tego — $n$ jest dowolne.'], [k === 6 ? T`Bo $3\mid 3n(n+1)$` : T`Nie dzieli się`, k === 6 ? 'Przez 3 tak, ale potrzebujemy 6 — brakuje parzystości.' : 'Dzieli: każdy składnik jest wielokrotnością ' + k + '.']),
       S('Zakończenie', 'Jak zakończyć dowód?', 'Zdaniem o zasadzie indukcji', T`Na mocy zasady indukcji matematycznej $${k}\mid ${exprT}$ dla każdego $n\in\mathbb N$. $\blacksquare$`, 'Zdanie kończące jest częścią dowodu — bez niego sprawdzający odejmie punkt.', ['Nic nie trzeba dopisywać', 'Trzeba powołać się na zasadę indukcji.'], ['„Sprawdziłem dla wielu $n$”', 'Przykłady nie są dowodem.'])],
      [[T`Dla $n=1$: $${c}$ dzieli się przez $${k}$.`, 'sprawdzenie dla $n=1$'], [T`Zał.: $${exprT}=${k}l$, $l\in\mathbb Z$. Teza: $${k}\mid ${expr1}$.`, 'założenie i teza'], [T`$${expr1}=${k}l+${extraT}$; ${whyDiff}`, 'dowód tezy z użyciem założenia'], [T`Na mocy zasady indukcji matematycznej teza zachodzi dla każdego $n\in\mathbb N$. $\blacksquare$`, 'zakończenie']],
      ['Brak sprawdzenia dla $n=1$ albo brak zdania kończącego.', 'Dowód tezy bez użycia założenia — wtedy to nie jest indukcja.', ...(k === 6 ? ['Uzasadnienie tylko podzielności przez 3 zamiast przez 6.'] : [])]);
    return proof('', p === 3 ? 'cube' : 'quint', q, [factorMethod, restMethod, indMethod]);
  }
  const genCube = gk => { if (gk === 'quint') { const a = R.pick([-1, 4, 9, -6, 14, -11, 19, 24]); return cubeProof(5, 5, a); } const k = R.pick([3, 6]); const a = R.pick(k === 3 ? [-1, 2, 5, 8, -4] : [-1, 5, 11, -7]); return cubeProof(3, k, a); };

  /* ===== 1(c) i podobne: czy zawsze m | n^m − n? ===== */
  function kontr(m) {
    let ce = 2; while ((ce ** m - ce) % m === 0) ce++;
    const v = ce ** m - ce;
    return mk({ gk: 'kontr', field: txtField(), q: T`Czy dla każdego $n\in\mathbb N$ zachodzi $${m}\mid n^{${m}}-n$?`, tex: T`\text{Nie: dla }n=${ce}\text{ mamy }${ce}^{${m}}-${ce}=${big(v)},\ ${m}\nmid ${big(v)}`,
      steps: [T`Pytanie „czy zawsze” — żeby odpowiedzieć „nie”, wystarczy <b>jeden konkretny kontrprzykład</b>.`, T`Sprawdzamy małe $n$: $n=1$ daje $0$ (podzielne), $n=${ce}$: $${ce}^{${m}}-${ce}=${big(v)}$, a $${big(v)}=${m}\cdot ${Math.floor(v / m)}+${v % m}$.`, T`Odpowiedź: nie zawsze, np. $n=${ce}$.`],
      wrong: [[T`\text{Nie: dla }n=1\text{ mamy }1^{${m}}-1=0,\ ${m}\nmid 0`, T`$0$ dzieli się przez każdą liczbę — to nie jest kontrprzykład.`], ...[m, m + 1, 2 * m, 2 * m + 1, ce + 1, ce + 2].filter((x, k, arr) => x !== ce && arr.indexOf(x) === k && (x ** m - x) % m === 0).slice(0, 2).map(x => [T`\text{Nie: dla }n=${x}\text{ mamy }${x}^{${m}}-${x}=${big(x ** m - x)},\ ${m}\nmid ${big(x ** m - x)}`, T`$${big(x ** m - x)}=${m}\cdot ${big((x ** m - x) / m)}$ — dzieli się, więc to nie jest kontrprzykład.`])] });
  }
  const genKontr = () => kontr(R.pick([4, 6, 8, 9, 10]));

  /* ===== 2: podzielność potęg — kongruencje albo indukcja ===== */
  function powProofA(m, a, k, s, t, expT) { // m | a^{kn+s} + t, a^k ≡ 1 (mod m)
    const ak = pw(a, k), base1 = pw(a, k + s) + BigInt(t), q1 = base1 / BigInt(m), tak = BigInt(t) * (ak - 1n);
    const q = T`Udowodnij, że dla każdego $n\in\mathbb N$: $\ ${m}\mid ${a}^{${expT}}+${t}$.`;
    const red = md(a, m) === 1 ? T`$${a}\equiv1\pmod{${m}}$, więc każda potęga $${a}$ daje resztę $1$: $${a}^{${expT}}\equiv1^{${expT}}=1$.` : T`$${a}^{${k}}=${ak}\equiv1\pmod{${m}}$, więc $${a}^{${expT}}=${a}^{${s}}\cdot\left(${a}^{${k}}\right)^{n}\equiv ${a}^{${s}}\cdot1^n=${pw(a, s)}\pmod{${m}}$.`;
    const resid = md(a, m) === 1 ? 1 : Number(pw(a, s) % BigInt(m));
    const a1 = md(a, m) === 1, akq = (ak - 1n) / BigInt(m);
    const st1 = a1
      ? S('Reszta podstawy', T`Jaką resztę daje $${a}$ przy dzieleniu przez $${m}$?`, T`$1$: $${a}\equiv1\pmod{${m}}$`, T`$${a}=${m}\cdot ${(a - 1) / m}+1$, więc $${a}\equiv1\pmod{${m}}$.`, 'Zaczynamy od najprostszego pytania: jaka jest reszta samej podstawy.', [T`$${a}$`, 'Reszta musi być mniejsza od $' + m + '$.'], [T`$0$`, T`$${a}$ nie dzieli się przez $${m}$.`])
      : S('Potęga z resztą 1', T`Która potęga $${a}$ daje resztę $1$ przy dzieleniu przez $${m}$?`, T`$${a}^{${k}}=${big(ak)}\equiv1\pmod{${m}}$`, T`Sprawdzamy kolejne potęgi: $${a}^{${k}}=${big(ak)}=${m}\cdot ${big(akq)}+1$, więc $${a}^{${k}}\equiv1\pmod{${m}}$.`, 'Gdy jakaś potęga daje resztę 1, dowolnie duże potęgi łatwo zredukować.', [T`$${a}^{${k + 1}}$`, T`$${a}^{${k + 1}}\equiv ${a}\cdot1=${md(a, m)}$, nie $1$.`], [T`$${a}^{1}$`, T`$${a}$ daje resztę $${md(a, m)}$, nie $1$.`]);
    const st2 = S('Reszta całej potęgi', T`Jaką resztę daje $${a}^{${expT}}$ modulo $${m}$?`, T`$${resid}$ dla każdego $n$`, red, T`Kongruencje można mnożyć i potęgować: z $x\equiv y$ wynika $x^j\equiv y^j\pmod m$.`, [T`Zależy od parzystości $n$`, T`Po redukcji podstawy wykładnik przestaje mieć znaczenie.`], [T`$${md(a, m) === 1 ? 0 : a}$`, a1 ? 'Reszta to $1$, bo każda potęga jedynki to $1$.' : 'Reszta potęgi to nie reszta podstawy.']);
    const kong = M('Kongruencje', 'Potęga z $n$ w wykładniku — zredukuj podstawę modulo ' + m + '; zwykle krócej niż indukcja.', T`Szukamy potęgi $${a}$, która daje resztę $1$ modulo $${m}$ — wtedy cała potęga ma stałą resztę.`,
      [st1, st2,
       S('Wniosek', T`Ile wynosi $${a}^{${expT}}+${t}$ modulo $${m}$?`, '$0$', T`$${a}^{${expT}}+${t}\equiv ${resid}+${t}=${resid + t}\equiv0\pmod{${m}}$, czyli $${m}\mid ${a}^{${expT}}+${t}$ dla każdego $n\in\mathbb N$. $\blacksquare$`, `$${resid + t}$ dzieli się przez $${m}$.`, [T`$${resid + t}$`, 'To prawda, ale trzeba jeszcze zauważyć, że $' + (resid + t) + '\\equiv0$.'], [T`$${t}$`, 'Zapomniana reszta potęgi.'])],
      [[st1.line, a1 ? 'reszta podstawy' : 'potęga z resztą 1'], [red, 'redukcja całej potęgi'], [T`$${a}^{${expT}}+${t}\equiv ${resid}+${t}\equiv0\pmod{${m}}$, więc $${m}\mid ${a}^{${expT}}+${t}$. $\blacksquare$`, 'wniosek']],
      ['Pisanie „$=$” zamiast „$\\equiv$” — to różne rzeczy.', ...(s < 0 ? [T`Warto dopisać, że dla $n\geq1$ wykładnik $${expT}$ jest naturalny.`] : [])]);
    const expT1 = expT === 'n' ? 'n+1' : expT.replace(/n/, '(n+1)'), tc = t === 1 ? '' : t;
    const ind = M('Indukcja', 'Klasyczna metoda — dłuższa, ale zawsze działa.', T`Z założenia $${a}^{${expT}}=${m}l-${t}$; dla $n+1$ wykładnik rośnie o $${k}$, więc wystarczy pomnożyć przez $${a}^{${k}}$.`,
      [S('Sprawdzenie dla n = 1', 'Co sprawdzamy na początku?', T`$n=1$: $${a}^{${k + s}}+${t}=${big(base1)}=${m}\cdot ${big(q1)}$`, T`Dla $n=1$: $\ ${a}^{${k + s}}+${t}=${big(base1)}=${m}\cdot ${big(q1)}$ — teza zachodzi.`, 'Bez sprawdzenia dla $n=1$ indukcja nie ma od czego wystartować.', [T`$n=0$`, T`Teza jest dla $n\in\mathbb N$, zaczynamy od $n=1$${s < 0 ? ' (dla $n=0$ wykładnik byłby ujemny)' : ''}.`], [T`Nie trzeba sprawdzać`, 'Bez tego „dowodzi się” też fałszywych twierdzeń.']),
       S('Założenie i teza', 'Co zakładamy, a co chcemy wykazać?', T`Zał.: $${a}^{${expT}}+${t}=${m}l$; teza: $${m}\mid ${a}^{${expT1}}+${t}$`, T`<b>Założenie indukcyjne:</b> dla pewnego $n\in\mathbb N$ zachodzi $${m}\mid ${a}^{${expT}}+${t}$, czyli $${a}^{${expT}}+${t}=${m}l$ dla pewnego $l\in\mathbb Z$.<br><b>Teza indukcyjna:</b> $${m}\mid ${a}^{${expT1}}+${t}$.`, 'Z założenia przyda się postać $' + a + '^{' + expT + '}=' + m + 'l-' + t + '$.', [T`Zakładamy dla każdego $n$`, 'To byłaby cała teza — zakładamy dla jednego, ustalonego $n$.'], [T`Teza: $${m}\mid ${a}^{${expT}}+${t}$`, 'Tezę piszemy dla $n+1$.']),
       S('Rozpisanie dla n + 1', T`Jak zapisać $${a}^{${expT1}}+${t}$ przy użyciu założenia?`, T`$=${a}^{${k}}\left(${m}l-${t}\right)+${t}$`, T`$${a}^{${expT1}}=${a}^{${k}}\cdot ${a}^{${expT}}$, a z założenia $${a}^{${expT}}=${m}l-${t}$. Zatem $${a}^{${expT1}}+${t}=${a}^{${k}}\left(${m}l-${t}\right)+${t}=${m}\cdot ${a}^{${k}}l-${tc}\left(${a}^{${k}}-1\right)$.`, T`Wykładnik rośnie o $${k}$, więc wyciągamy $${a}^{${k}}$ i podstawiamy założenie.`, [T`$=${a}^{${expT}}+${t}+${a}^{${k}}$`, 'Potęgi się mnożą, a nie dodają.'], [T`$=${a}\cdot(${m}l-${t})+${t}$`, T`Wykładnik rośnie o $${k}$, więc mnożymy przez $${a}^{${k}}$.`]),
       S('Podzielność', T`Dlaczego $${m}$ dzieli $${m}\cdot ${a}^{${k}}l-${tc}\left(${a}^{${k}}-1\right)$?`, T`Bo $${tc}\left(${a}^{${k}}-1\right)=${big(tak)}=${m}\cdot ${big(tak / BigInt(m))}$`, T`Pierwszy składnik ma czynnik $${m}$, a $${tc}\left(${a}^{${k}}-1\right)=${big(tak)}=${m}\cdot ${big(tak / BigInt(m))}$. Zatem $${m}\mid ${a}^{${expT1}}+${t}$ — teza indukcyjna zachodzi.`, 'Różnica dwóch wielokrotności ' + m + ' jest wielokrotnością ' + m + '.', [T`Bo $${m}\mid ${a}^{${k}}$`, T`$${a}^{${k}}$ nie dzieli się przez $${m}$.`], [T`Bo liczba jest duża`, 'Wielkość liczby nic nie mówi o podzielności.']),
       S('Zakończenie', 'Jak zakończyć dowód?', 'Zdaniem o zasadzie indukcji', T`Na mocy zasady indukcji matematycznej $${m}\mid ${a}^{${expT}}+${t}$ dla każdego $n\in\mathbb N$. $\blacksquare$`, 'Zdanie kończące jest częścią dowodu.', ['Nic nie trzeba dopisywać', 'Trzeba powołać się na zasadę indukcji.'], ['„Sprawdziłem dla kilku $n$”', 'Przykłady nie są dowodem.'])],
      [[T`Dla $n=1$: $${a}^{${k + s}}+${t}=${big(base1)}=${m}\cdot ${big(q1)}$.`, 'sprawdzenie dla $n=1$'], [T`Zał.: $${a}^{${expT}}+${t}=${m}l$, $l\in\mathbb Z$. Teza: $${m}\mid ${a}^{${expT1}}+${t}$.`, 'założenie i teza'], [T`$${a}^{${expT1}}+${t}=${a}^{${k}}(${m}l-${t})+${t}=${m}\cdot ${a}^{${k}}l-${big(tak)}$, a $${m}\mid ${big(tak)}$.`, 'dowód tezy z użyciem założenia'], [T`Na mocy zasady indukcji matematycznej teza zachodzi dla każdego $n\in\mathbb N$. $\blacksquare$`, 'zakończenie']],
      ['Brak sprawdzenia dla $n=1$ albo założenia zapisanego wprost.', 'Dowód tezy, w którym nie widać użycia założenia indukcyjnego.']);
    return proof('', 'f1', q, [kong, ind]);
  }
  function powProofB(m, b, s, c, r) { // m | b^{n+s} + c^{2n+r}, c² ≡ b (mod m)
    const c2 = c * c, w = (c2 - b) / m, base1 = pw(b, 1 + s) + pw(c, 2 + r), q1 = base1 / BigInt(m), bs = pw(b, s), cr = pw(c, r);
    const E = T`${b}^{n+${s}}+${c}^{2n+${r}}`.replace(/\^\{n\+0\}/, '^{n}').replace(/\^\{2n\+0\}/, '^{2n}');
    const q = T`Udowodnij, że dla każdego $n\in\mathbb N$: $\ ${m}\mid ${E}$.`;
    const sq = (bs + cr) / BigInt(m), sqT = sq === 1n ? '' : sq + '\\cdot ', wT = w === 1 ? '' : w + '\\cdot ';
    const kong = M('Kongruencje', 'Dwie potęgi — sprowadź je do wspólnej podstawy modulo ' + m + '.', T`$${c}^2=${c2}\equiv ${b}\pmod{${m}}$, więc $${c}^{2n}$ zachowuje się jak $${b}^n$ i obie potęgi mają wspólny czynnik $${b}^n$.`,
      [S('Wspólna podstawa', T`Jaka jest reszta $${c}^2$ modulo $${m}$?`, T`$${c}^2=${c2}\equiv ${b}\pmod{${m}}$`, T`$${c}^2=${c2}=${m}\cdot ${w}+${b}$, więc $${c}^2\equiv ${b}\pmod{${m}}$.`, 'Szukamy związku między podstawami — tu kwadrat jednej daje drugą.', [T`$${c}^2\equiv1$`, T`$${c2}-1$ nie dzieli się przez $${m}$.`], [T`$${c}\equiv ${b}$`, 'Same podstawy są różne modulo ' + m + '.']),
       S('Obie potęgi przez $' + b + '^n$', 'Jak zapisać obie potęgi przez $' + b + '^n$?', T`$${E}\equiv ${bs}\cdot ${b}^n+${cr}\cdot ${b}^n$`, T`$${c}^{2n+${r}}=${r === 1 ? c : c + '^{' + r + '}'}\cdot\left(${c}^2\right)^n\equiv ${cr}\cdot ${b}^n$ oraz $${b}^{n+${s}}=${b}^{${s}}\cdot ${b}^n=${bs}\cdot ${b}^n$. Razem: $${E}\equiv ${bs}\cdot ${b}^n+${cr}\cdot ${b}^n\pmod{${m}}$.`.replace(/\^\{n\+0\}/g, '^{n}').replace(/\^\{2n\+0\}/g, '^{2n}'), 'Rozbijamy wykładnik: $x^{2n+r}=x^r\\cdot(x^2)^n$, a potem podmieniamy $' + c + '^2$ na $' + b + '$.', [T`$${E}\equiv 2\cdot ${b}^n$`, 'Współczynniki przy $' + b + '^n$ to $' + bs + '$ i $' + cr + '$.'], [T`$${E}\equiv ${b}^{2n}$`, 'Potęgi się nie mnożą — dodajemy dwa wyrazy.']),
       S('Wspólny czynnik', 'Ile wynosi całe wyrażenie modulo ' + m + '?', '$0$', T`$${bs}\cdot ${b}^n+${cr}\cdot ${b}^n=${bs + cr}\cdot ${b}^n${sq === 1n ? '' : '=' + m + '\\cdot ' + sqT + b + '^n'}\equiv0\pmod{${m}}$, czyli $${m}\mid ${E}$. $\blacksquare$`.replace(/\^\{n\+0\}/g, '^{n}').replace(/\^\{2n\+0\}/g, '^{2n}'), `$${bs}+${cr}=${bs + cr}$ to wielokrotność $${m}$.`, [T`$${b}^n$`, 'Zostaje jeszcze współczynnik ' + (bs + cr) + ', a on dzieli się przez ' + m + '.'], ['Nie da się określić', 'Wyciągnięcie $' + b + '^n$ przed nawias wszystko załatwia.'])],
      [[T`$${c}^2=${c2}\equiv ${b}\pmod{${m}}$.`, 'kluczowa kongruencja'], [T`$${E}\equiv ${bs}\cdot ${b}^n+${cr}\cdot ${b}^n\pmod{${m}}$.`.replace(/\^\{n\+0\}/g, '^{n}').replace(/\^\{2n\+0\}/g, '^{2n}'), 'sprowadzenie do $' + b + '^n$'], [T`$=${bs + cr}\cdot ${b}^n${sq === 1n ? '' : '=' + m + '\\cdot ' + sqT + b + '^n'}\equiv0\pmod{${m}}$. $\blacksquare$`, 'wniosek']],
      ['Rachunek bez zapisu „(mod ' + m + ')”.']);
    const e1 = s ? 'n+' + s : 'n', e2 = r ? '2n+' + r : '2n', e1b = 'n+' + (s + 1), e2b = '2n+' + (r + 2);
    const E1 = T`${b}^{${e1b}}+${c}^{${e2b}}`;
    const ind = M('Indukcja', 'Klasyczna metoda: rozpisz wyrażenie dla $n+1$ i „dorób” wyrażenie z założenia.', T`$${E1}=${b}\left(${E}\right)+\left(${c}^2-${b}\right)${c}^{${e2}}$, a $${c}^2-${b}=${c2 - b}=${m}\cdot ${w}$.`,
      [S('Sprawdzenie dla n = 1', 'Co sprawdzamy na początku?', T`$n=1$: $${big(base1)}=${m}\cdot ${big(q1)}$`, T`Dla $n=1$: $\ ${b}^{${1 + s}}+${c}^{${2 + r}}=${big(base1)}=${m}\cdot ${big(q1)}$ — teza zachodzi.`, 'Policz dokładnie i pokaż iloraz.', ['$n=0$', 'Teza jest dla $n\\in\\mathbb N$, start od $n=1$.'], ['Nie trzeba sprawdzać', 'Bez tego indukcja niczego nie dowodzi.']),
       S('Założenie i teza', 'Co zakładamy, a co chcemy wykazać?', T`Zał.: $${E}=${m}l$; teza: $${m}\mid ${E1}$`, T`<b>Założenie indukcyjne:</b> dla pewnego $n\in\mathbb N$ zachodzi $${m}\mid ${E}$, czyli $${E}=${m}l$ dla pewnego $l\in\mathbb Z$.<br><b>Teza indukcyjna:</b> $${m}\mid ${E1}$.`, 'Tezę piszemy, podstawiając $n+1$ w miejsce $n$.', [T`Zakładamy dla każdego $n$`, 'To byłaby cała teza — zakładamy dla jednego, ustalonego $n$.'], [T`Teza: $${m}\mid ${E}$`, 'Tezę piszemy dla $n+1$.']),
       S('Rozpisanie dla n + 1', T`Jak zapisać $${E1}$, żeby pojawiło się wyrażenie z założenia?`, T`$=${b}\left(${E}\right)+\left(${c}^2-${b}\right)${c}^{${e2}}$`, T`$${E1}=${b}\cdot ${b}^{${e1}}+${c}^2\cdot ${c}^{${e2}}$. Dodajemy i odejmujemy $${b}\cdot ${c}^{${e2}}$: $\ =${b}\left(${E}\right)+\left(${c}^2-${b}\right)${c}^{${e2}}=${b}\cdot ${m}l+${c2 - b}\cdot ${c}^{${e2}}$.`, T`Pierwsza potęga rośnie o czynnik $${b}$, druga o $${c}^2$ — dlatego wyrównujemy je, dodając i odejmując ten sam wyraz.`, [T`$=${b}\left(${E}\right)$`, 'Druga potęga rośnie o czynnik $' + c + '^2$, a nie $' + b + '$.'], [T`$=${c}^2\left(${E}\right)$`, 'Pierwsza potęga rośnie tylko o czynnik $' + b + '$.']),
       S('Podzielność', T`Dlaczego $${m}$ dzieli $${b}\cdot ${m}l+${c2 - b}\cdot ${c}^{${e2}}$?`, T`Bo $${c}^2-${b}=${c2 - b}${w === 1 ? '' : T`=${m}\cdot ${w}`}$`, T`Pierwszy składnik ma czynnik $${m}$, a $${c}^2-${b}=${c2 - b}${w === 1 ? '' : T`=${m}\cdot ${w}`}$. Zatem $${E1}=${m}\left(${b}l+${wT}${c}^{${e2}}\right)$ i $${m}\mid ${E1}$ — teza indukcyjna zachodzi.`, 'Wyciągamy ' + m + ' przed nawias.', ['Bo $' + c + '$ dzieli się przez $' + m + '$', 'Nie dzieli się.'], ['Bo liczba jest duża', 'Wielkość nie ma związku z podzielnością.']),
       S('Zakończenie', 'Jak zakończyć dowód?', 'Zdaniem o zasadzie indukcji', T`Na mocy zasady indukcji matematycznej $${m}\mid ${E}$ dla każdego $n\in\mathbb N$. $\blacksquare$`, 'Zdanie kończące jest częścią dowodu.', ['Nic nie trzeba dopisywać', 'Trzeba powołać się na zasadę indukcji.'], ['„Sprawdziłem dla kilku $n$”', 'Przykłady nie są dowodem.'])],
      [[T`Dla $n=1$: $${big(base1)}=${m}\cdot ${big(q1)}$.`, 'sprawdzenie dla $n=1$'], [T`Zał.: $${E}=${m}l$, $l\in\mathbb Z$. Teza: $${m}\mid ${E1}$.`, 'założenie i teza'], [T`$${E1}=${b}\left(${E}\right)+\left(${c}^2-${b}\right)${c}^{${e2}}=${m}\left(${b}l+${wT}${c}^{${e2}}\right)$.`, 'dowód tezy z użyciem założenia'], [T`Na mocy zasady indukcji matematycznej teza zachodzi dla każdego $n\in\mathbb N$. $\blacksquare$`, 'zakończenie']],
      ['Brak sprawdzenia dla $n=1$ lub zdania kończącego.']);
    return proof('', 'f2', q, [kong, ind]);
  }
  function powProofC(qq, c) { // qq² | (1+qq)^n + c n − 1, c ≡ −qq (mod qq²)
    const m = qq * qq, a = 1 + qq, base1 = a + c - 1;
    const E = T`${a}^n+${c}n-1`;
    const q = T`Udowodnij, że dla każdego $n\in\mathbb N$: $\ ${m}\mid ${E}$.`;
    const kong = M('Kongruencje i dwumian', 'Podstawa to $1+' + qq + '$, a moduł $' + qq + '^2$ — rozwiń dwumian i odrzuć wyrazy z $' + qq + '^2$.', T`$${a}^n=(1+${qq})^n=1+${qq}n+\binom n2${qq}^2+\ldots\equiv1+${qq}n\pmod{${m}}$.`,
      [S('Dwumian', T`Jak rozpisać $${a}^n$?`, T`$(1+${qq})^n=1+${qq}n+\binom n2${qq}^2+\binom n3${qq}^3+\ldots$`, T`$${a}=1+${qq}$, więc z dwumianu Newtona: $${a}^n=(1+${qq})^n=1+\binom n1${qq}+\binom n2${qq}^2+\binom n3${qq}^3+\ldots+${qq}^n$.`, 'Zapisanie podstawy jako $1+' + qq + '$ to cały pomysł — moduł to $' + qq + '^2$.', [T`$(1+${qq})^n=1+${qq}^n$`, 'Brakuje wyrazów środkowych dwumianu.'], [T`$(1+${qq})^n=1+${qq}n$`, 'To dopiero po redukcji modulo ' + m + ' — w równości są jeszcze dalsze wyrazy.']),
       S('Co znika modulo $' + m + '$', T`Jaka jest więc reszta $${a}^n$ modulo $${m}$?`, T`$${a}^n\equiv1+${qq}n\pmod{${m}}$`, T`Każdy wyraz od $\binom n2${qq}^2$ dalej ma czynnik $${qq}^2=${m}$, więc znika modulo $${m}$: $${a}^n\equiv1+${qq}n\pmod{${m}}$.`, 'Zostają tylko dwa pierwsze wyrazy dwumianu.', [T`$${a}^n\equiv1$`, T`Wyraz $${qq}n$ nie znika modulo $${m}$.`], [T`$${a}^n\equiv ${a}$`, 'To tylko dla $n=1$.']),
       S('Wniosek', 'Ile wynosi całe wyrażenie modulo ' + m + '?', '$0$', T`$${E}\equiv1+${qq}n+${c}n-1=${qq + c}n\equiv0\pmod{${m}}$, bo $${qq + c}=${m}\cdot ${(qq + c) / m}$. $\blacksquare$`, '$' + qq + '+' + c + '$ dzieli się przez $' + m + '$.', [T`$${c}n$`, 'Zapomniany wyraz $' + qq + 'n$ z dwumianu.'], c === qq ? [T`$1$`, 'Jedynki się znoszą: $1-1=0$.'] : [T`$${qq}n$`, 'Zapomniany wyraz $' + c + 'n$.'])],
      [[T`$${a}^n=(1+${qq})^n=1+${qq}n+\binom n2${qq}^2+\ldots$`, 'rozwinięcie dwumianu'], [T`Wyrazy od trzeciego zawierają $${qq}^2=${m}$, więc $${a}^n\equiv1+${qq}n\pmod{${m}}$.`, 'uzasadnienie redukcji'], [T`$${E}\equiv ${qq + c}n\equiv0\pmod{${m}}$. $\blacksquare$`, 'wniosek']],
      ['Brak uzasadnienia, czemu reszta wyrazów dwumianu znika modulo ' + m + '.']);
    const E1 = T`${a}^{n+1}+${c}(n+1)-1`, Q1 = (qq * c) / m, Q2 = (qq + c) / m;
    const ind = M('Indukcja', 'Klasyczna metoda — tu wygodniejsza niż kongruencje dla wielu osób.', T`Z założenia $${a}^n=${m}l-${c}n+1$; podstawiamy to do wyrażenia dla $n+1$.`,
      [S('Sprawdzenie dla n = 1', 'Co sprawdzamy na początku?', T`$n=1$: $${a}+${c}-1=${base1}=${m}\cdot ${base1 / m}$`, T`Dla $n=1$: $\ ${a}+${c}-1=${base1}=${m}\cdot ${base1 / m}$ — teza zachodzi.`, 'Policz i pokaż iloraz.', ['$n=0$', 'Start od $n=1$ — teza dla $n\\in\\mathbb N$.'], ['Nie trzeba sprawdzać', 'Bez tego indukcja nic nie daje.']),
       S('Założenie i teza', 'Co zakładamy, a co chcemy wykazać?', T`Zał.: $${E}=${m}l$; teza: $${m}\mid ${E1}$`, T`<b>Założenie indukcyjne:</b> dla pewnego $n\in\mathbb N$ zachodzi $${m}\mid ${E}$, czyli $${E}=${m}l$ dla pewnego $l\in\mathbb Z$. Stąd $${a}^n=${m}l-${c}n+1$.<br><b>Teza indukcyjna:</b> $${m}\mid ${E1}$.`, 'Z założenia wyznaczamy potęgę — podstawimy ją za chwilę.', [T`Zakładamy dla każdego $n$`, 'To byłaby cała teza — zakładamy dla jednego, ustalonego $n$.'], [T`Teza: $${m}\mid ${E}$`, 'Tezę piszemy dla $n+1$.']),
       S('Rozpisanie dla n + 1', T`Ile wynosi $${E1}$ po podstawieniu założenia?`, T`$${m}\cdot ${a}l-${qq * c}n+${qq + c}$`, T`$${E1}=${a}\cdot ${a}^n+${c}n+${c - 1}=${a}\left(${m}l-${c}n+1\right)+${c}n+${c - 1}=${m}\cdot ${a}l-${a * c}n+${a}+${c}n+${c - 1}=${m}\cdot ${a}l-${qq * c}n+${qq + c}$.`, 'Wymnażamy nawias i zbieramy wyrazy z $n$ oraz stałe.', [T`$${m}\cdot ${a}l+${c}$`, 'Zgubione wyrazy z $n$.'], [T`$${m}l+${a}$`, 'Potęga mnoży się przez ' + a + ', a nie dodaje.']),
       S('Podzielność', T`Dlaczego $${m}$ dzieli $${m}\cdot ${a}l-${qq * c}n+${qq + c}$?`, T`$${qq * c}$ i $${qq + c}$ dzielą się przez $${m}$`, T`$${qq * c}=${m}\cdot ${Q1}$ i $${qq + c}=${m}\cdot ${Q2}$, więc $${E1}=${m}\left(${a}l-${Q1}n+${Q2}\right)$ i $${m}\mid ${E1}$ — teza indukcyjna zachodzi.`, 'Wyciągnij ' + m + ' przed nawias — to pokazuje podzielność.', ['Bo $' + a + '$ dzieli się przez $' + m + '$', 'Nie dzieli się.'], ['Bo liczba jest duża', 'To nie argument.']),
       S('Zakończenie', 'Jak zakończyć dowód?', 'Zdaniem o zasadzie indukcji', T`Na mocy zasady indukcji matematycznej $${m}\mid ${E}$ dla każdego $n\in\mathbb N$. $\blacksquare$`, 'Zdanie kończące jest częścią dowodu.', ['Nic nie trzeba dopisywać', 'Trzeba powołać się na zasadę indukcji.'], ['„Sprawdziłem dla kilku $n$”', 'Przykłady nie są dowodem.'])],
      [[T`Dla $n=1$: $${base1}=${m}\cdot ${base1 / m}$.`, 'sprawdzenie dla $n=1$'], [T`Zał.: $${E}=${m}l$, $l\in\mathbb Z$, czyli $${a}^n=${m}l-${c}n+1$. Teza: $${m}\mid ${E1}$.`, 'założenie i teza'], [T`$${E1}=${a}(${m}l-${c}n+1)+${c}n+${c - 1}=${m}\left(${a}l-${Q1}n+${Q2}\right)$.`, 'dowód tezy z użyciem założenia'], [T`Na mocy zasady indukcji matematycznej teza zachodzi dla każdego $n\in\mathbb N$. $\blacksquare$`, 'zakończenie']],
      ['Błąd przy wymnażaniu — sprawdź rachunek, podstawiając $n=1$.']);
    return proof('', 'f3', q, [kong, ind]);
  }
  function genF1() { for (;;) { const m = R.pick([4, 5, 7, 8, 9, 10, 11, 13]); const a = R.int(2, 12); if (gcd(a, m) !== 1) continue; let k = 1; while (md(Number(pw(a, k) % BigInt(m)), m) !== 1) k++; if (k > 6 || pw(a, k) > 100000n) continue; const s = R.int(0, 2); const t = md(-Number(pw(a, s) % BigInt(m)), m) + m * R.int(0, 2); if (!t) continue; const expT = (k === 1 ? '' : k) + 'n' + (s ? '+' + s : ''); return powProofA(m, a, k, s, t, expT); } }
  function genF2() { for (;;) { const m = R.pick([7, 11, 13, 17, 19, 31, 43, 133]); const c = R.int(2, 14), b = md(c * c, m); if (b < 2 || b === c) continue; const s = R.int(1, 2), r = R.int(1, 2); if (Number((pw(b, s) + pw(c, r)) % BigInt(m)) !== 0) continue; return powProofB(m, b, s, c, r); } }
  function genF3() { const qq = R.pick([2, 3, 4, 5, 6]); const c = -qq + qq * qq * R.int(1, 3); return powProofC(qq, c); }

  /* ===== 3: dla jakich n wielomian dzieli się przez n ± r ===== */
  const divs = v => { v = Math.abs(v); const d = []; for (let i = 1; i <= v; i++) if (v % i === 0) d.push(i); return d; };
  const W3 = (co, n) => co[0] * n ** 3 + co[1] * n * n + co[2] * n + co[3];
  const polyT = co => { const t = [[co[0], 'n^3'], [co[1], 'n^2'], [co[2], 'n'], [co[3], '']]; let s = ''; for (const [c, m] of t) { if (!c) continue; const a = Math.abs(c); s += (c < 0 ? '-' : s ? '+' : '') + (a === 1 && m ? '' : a) + m; } return s; };
  const setT = xs => (xs.length ? T`n\in\{${xs.join(',\\ ')}\}` : T`\text{brak takich }n`);
  function polyDiv(co, r, gk) { // dzielnik n + r (r>0) albo n − r (r<0 zapisujemy jako n−|r|)
    const root = -r, Wr = W3(co, root), divT = r > 0 ? `n+${r}` : `n-${-r}`;
    let sol = [];
    for (const d of divs(Wr)) for (const e of [d, -d]) { const n = e - r; if (n >= 1 && n + r !== 0) sol.push(n); }
    if (Wr === 0) sol = ['wszystkie'];
    sol = [...new Set(sol)].sort((x, y) => x - y);
    const pos = [...new Set(divs(Wr).map(d => d - r).filter(n => n >= 1))].sort((x, y) => x - y);
    const P = polyT(co);
    return mk({ gk: gk || 'poly', field: txtField(), q: T`Dla jakich liczb naturalnych $n$ liczba $${P}$ jest podzielna przez $${divT}$?`, tex: setT(sol),
      steps: [T`Dzielimy wielomian przez $${divT}$ z resztą: reszta to $W(${root})=${Wr}$ (twierdzenie o reszcie), czyli $${P}=(${divT})\cdot Q(n)${Wr < 0 ? Wr : '+' + Wr}$ z całkowitym $Q$.`, T`Stąd $${divT}\mid W(n)\iff ${divT}\mid ${Wr}$. Dzielniki $${Math.abs(Wr)}$: $\pm ${divs(Wr).join(',\\pm')}$.`, T`$${divT}$ przyjmuje te wartości, a $n\geq1$ (przyjmujemy $\mathbb N=\{1,2,\ldots\}$): $${setT(sol)}$.`, 'Na koniec warto sprawdzić jeden wynik podstawieniem.'],
      wrong: [[setT(pos), r < 0 ? 'Dzielnik $' + divT + '$ może być ujemny — wtedy też dzieli.' : 'Sprawdź, które dzielniki dają $n\\geq1$.'], [setT([...new Set(divs(W3(co, -root)).map(d => d - r).filter(n => n >= 1))].sort((x, y) => x - y)), T`Reszta to $W(${root})$, a nie $W(${-root})$ — podstawiamy pierwiastek dzielnika.`], [setT(sol.filter((_, i) => i !== sol.length - 1)), 'Pominięty największy dzielnik.'], [setT([...sol, sol.length ? sol[sol.length - 1] + 1 : 1]), 'Sprawdź podstawieniem — ta wartość nie spełnia warunku.'], ...(typeof sol[0] === 'number' ? [[setT(sol.slice(1)), 'Brakuje najmniejszego rozwiązania — sprawdź wszystkie dzielniki.'], [setT(sol.map(x => x + 1)), 'Przesunięcie o 1: $n$ to wartość dzielnika minus ' + (r > 0 ? r : '(' + r + ')') + '.']] : [])] });
  }
  function genPoly() { for (;;) { const co = [1, R.int(-9, 9), R.int(-9, 9), R.int(-12, 12)], r = R.pick([1, 2, 3, -1, -2, -3, -5, -7]); const Wr = W3(co, -r); if (!Wr || Math.abs(Wr) > 60 || divs(Wr).length < 3) continue; const it = polyDiv(co, r); if (/brak/.test(it.mcCorrect)) continue; return it; } }
  // 3(c): przez iloczyn (n−7)(n+2)
  const item3c = mk({ gk: 'prod', field: txtField(), q: T`Dla jakich liczb naturalnych $n$ liczba $n^3-7n^2-5n+10$ jest podzielna przez $n^2-5n-14$?`, tex: setT([2, 6]),
    steps: [T`$n^2-5n-14=(n-7)(n+2)$. Jeśli iloczyn dzieli $W(n)$, to dzieli też każdy czynnik — więc $n$ musi spełniać (a) i (b).`, T`Z (a): $n\in\{2,6,14\}$, z (b): $n\in\{2,6,8,12,32\}$. Część wspólna: $n\in\{2,6\}$.`, T`To tylko warunek konieczny — sprawdzamy: $n=2$: $W=-20$, $n^2-5n-14=-20$ ✓; $n=6$: $W=-56$, dzielnik $-8$, $-56=7\cdot(-8)$ ✓.`, T`Odpowiedź: $n\in\{2,6\}$.`],
    wrong: [[setT([2, 6, 8, 12, 14, 32]), 'To suma zbiorów — a muszą zachodzić oba warunki naraz.'], [setT([2]), T`$n=6$ też spełnia: $-56=7\cdot(-8)$.`], [setT([6, 14]), 'Sprawdź $n=2$: $-20=1\\cdot(-20)$.']] });

  // 3(c) i podobne: podzielność przez iloczyn (n+r1)(n+r2) — warunek konieczny z obu czynników, potem sprawdzenie
  function polyProd(co, r1, r2) {
    const P = polyT(co), dT = r => (r > 0 ? 'n+' + r : 'n-' + -r), quad = polyT([0, 1, r1 + r2, r1 * r2]).replace(/^0/, '');
    const one = r => { const out = []; const Wr = W3(co, -r); for (let n = 1; n <= Math.abs(Wr) + Math.abs(r) + 2; n++) if (n + r !== 0 && W3(co, n) % (n + r) === 0) out.push(n); return out; };
    const A1 = one(r1), A2 = one(r2), both = A1.filter(n => A2.includes(n));
    const sol = both.filter(n => W3(co, n) % ((n + r1) * (n + r2)) === 0), bad = both.filter(n => !sol.includes(n));
    return mk({ gk: 'prod', field: txtField(), q: T`Dla jakich liczb naturalnych $n$ liczba $${P}$ jest podzielna przez $${quad}$?`, tex: setT(sol),
      steps: [T`$${quad}=(${dT(r1)})(${dT(r2)})$. Jeśli iloczyn dzieli $W(n)$, to dzieli też każdy czynnik — więc $n$ musi spełniać oba warunki.`,
        T`$${dT(r1)}\mid W(n)\iff ${dT(r1)}\mid W(${-r1})=${W3(co, -r1)}$: $${setT(A1)}$. $\ ${dT(r2)}\mid W(n)\iff ${dT(r2)}\mid W(${-r2})=${W3(co, -r2)}$: $${setT(A2)}$.`,
        T`Część wspólna: $${setT(both)}$. To tylko warunek konieczny — sprawdzamy cały iloczyn` + (bad.length ? T`: $n=${bad.join(',')}$ odpada` : ': wszystkie pasują') + '.', T`Odpowiedź: $${setT(sol)}$.`],
      wrong: [[setT([...new Set([...A1, ...A2])].sort((x, y) => x - y)), 'To suma zbiorów — a muszą zachodzić oba warunki naraz.'], [setT(both), bad.length ? 'Część wspólna to tylko warunek konieczny — sprawdź iloczyn.' : 'Sprawdź jeszcze raz część wspólną.'], [setT(sol.slice(1)), 'Brakuje rozwiązania.'], [setT(A1), 'To warunek tylko dla jednego czynnika.'], [setT(A2), 'To warunek tylko dla jednego czynnika.']] });
  }
  function genPolyProd() { for (;;) { const co = [1, R.int(-9, 9), R.int(-9, 9), R.int(-12, 12)], r1 = R.int(1, 4), r2 = -R.int(1, 8); const W1 = W3(co, -r1), W2 = W3(co, -r2); if (!W1 || !W2 || Math.abs(W1) > 80 || Math.abs(W2) > 80) continue; const it = polyProd(co, r1, r2); if (/brak/.test(it.mcCorrect) || it.mc.length < 3) continue; return it; } }

  /* ===== 4: (n² + a)/(n + b) całkowite ===== */
  function fracInt(a, b) {
    const v = b * b + a, sol = [...new Set(divs(v).flatMap(d => [d - b, -d - b]))].sort((x, y) => x - y);
    const pos = [...new Set(divs(v).map(d => d - b))].sort((x, y) => x - y);
    const bt = b > 0 ? `+${b}` : `-${-b}`;
    return mk({ gk: 'frac', field: txtField(), q: T`Znajdź wszystkie liczby całkowite $n$, dla których $\frac{n^2+${a}}{n${bt}}$ jest liczbą całkowitą.`, tex: T`n\in\{${sol.join(',\\ ')}\}`,
      steps: [T`Dzielimy z resztą: $n^2+${a}=(n${bt})(n${b > 0 ? '-' + b : '+' + -b})+${v}$.`, T`Zatem $\frac{n^2+${a}}{n${bt}}=n${b > 0 ? '-' + b : '+' + -b}+\frac{${v}}{n${bt}}$ — całkowite $\iff n${bt}\mid ${v}$.`, T`$n${bt}\in\{\pm ${divs(v).join(',\\pm')}\}$, czyli $n\in\{${sol.join(',\\ ')}\}$.`, 'Liczby całkowite — więc ujemne dzielniki też się liczą.'],
      wrong: [[T`n\in\{${pos.join(',\\ ')}\}`, 'Pominięte ujemne dzielniki — $n$ jest całkowite, więc $n' + bt + '$ może być ujemne.'], [T`n\in\{${[...new Set(divs(Math.abs(a - b * b) || 1).flatMap(d => [d - b, -d - b]))].sort((x, y) => x - y).join(',\\ ')}\}`, T`Reszta to $b^2+a=${v}$ (podstaw $n=${-b}$ do licznika).`], [T`n\in\{${sol.filter(x => x !== sol[0]).join(',\\ ')}\}`, 'Brakuje jednego rozwiązania — sprawdź wszystkie dzielniki.']] });
  }
  const genFrac = () => { for (;;) { const a = R.int(1, 12), b = R.pick([1, 2, 3, -1, -2, -3]); if (divs(b * b + a).length >= 2) return fracInt(a, b); } };

  /* ===== 5, 6: sprzeczne reszty ===== */
  function resProof(m1, r1, m2, r2) {
    const d = gcd(m1, m2), q = T`Wykaż, że nie istnieje liczba naturalna, która przy dzieleniu przez $${m1}$ daje resztę $${r1}$, a przy dzieleniu przez $${m2}$ resztę $${r2}$.`;
    const A1 = M('Reszty modulo NWD', T`Moduły $${m1}$ i $${m2}$ mają wspólny dzielnik $${d}$ — porównaj reszty modulo $${d}$.`, T`$(${m1},${m2})=${d}$. Obie informacje mówią coś o reszcie z dzielenia przez $${d}$ — i mówią różne rzeczy.`,
      [S('Wspólny dzielnik', 'Przez jaką liczbę warto popatrzeć?', T`Przez $(${m1},${m2})=${d}$`, T`Przypuśćmy, że takie $x$ istnieje. Mamy $(${m1},${m2})=${d}$, więc $${d}\mid ${m1}$ i $${d}\mid ${m2}$.`, 'Dowód nie wprost: zakładamy, że liczba istnieje, i szukamy sprzeczności.', [T`Przez $${m1 * m2}$`, 'Iloczyn modułów nic tu nie daje.'], [T`Przez $${m1}$`, 'Potrzebujemy liczby, która dzieli oba moduły.']),
       S('Reszty', T`Jakie reszty modulo $${d}$ wynikają z obu warunków?`, T`$${r1 % d}$ i $${r2 % d}$ — różne`, T`$x=${m1}k+${r1}$, więc $x\equiv ${r1}\equiv ${r1 % d}\pmod{${d}}$; $x=${m2}l+${r2}$, więc $x\equiv ${r2}\equiv ${r2 % d}\pmod{${d}}$.`, T`$${d}\mid ${m1}$, więc $${m1}k$ znika modulo $${d}$.`, [T`Obie równe $0$`, 'Policz reszty $' + r1 + '$ i $' + r2 + '$ modulo ' + d + '.'], [T`$${r1}$ i $${r2}$`, 'To reszty z dzielenia przez ' + m1 + ' i ' + m2 + ', a nie przez ' + d + '.']),
       S('Sprzeczność', 'Co z tego wynika?', 'Sprzeczność — liczba nie może mieć dwóch różnych reszt', T`Liczba $x$ ma jedną resztę z dzielenia przez $${d}$, a dostaliśmy $${r1 % d}\neq ${r2 % d}$ — sprzeczność. Taka liczba nie istnieje. $\blacksquare$`, 'Reszta z dzielenia jest wyznaczona jednoznacznie.', ['Że $x$ jest ujemne', 'Nic takiego nie wynika — wynika sprzeczność.'], ['Że $x=0$', 'Zero też ma jedną resztę.'])],
      [[T`Przypuśćmy, że $x=${m1}k+${r1}=${m2}l+${r2}$ dla pewnych $k,l\in\mathbb Z$.`, 'założenie nie wprost'], [T`$${d}=(${m1},${m2})$ dzieli $${m1}$ i $${m2}$, więc $x\equiv ${r1 % d}$ oraz $x\equiv ${r2 % d}\pmod{${d}}$.`, 'redukcja do modułu ' + d], [T`$${r1 % d}\neq ${r2 % d}$ — sprzeczność. $\blacksquare$`, 'sprzeczność']],
      ['Brak zdania „przypuśćmy, że istnieje” — dowód nie wprost musi to mieć.']);
    const A2 = M('Równanie liniowe', 'Zapisz oba warunki równaniem i porównaj podzielność stron.', T`$${m1}k+${r1}=${m2}l+${r2}$ daje $${m1}k-${m2}l=${r2 - r1}$; lewa strona dzieli się przez $${d}$, prawa nie.`,
      [S('Równanie', 'Jak zapisać oba warunki?', T`$x=${m1}k+${r1}=${m2}l+${r2}$`, T`Przypuśćmy, że $x$ istnieje. Z definicji reszty: $x=${m1}k+${r1}$ oraz $x=${m2}l+${r2}$ dla pewnych $k,l\in\mathbb Z$. Przyrównujemy i przenosimy: $${m1}k-${m2}l=${r2}-${r1 < 0 ? '(' + r1 + ')' : r1}=${r2 - r1}$.`, 'Definicja reszty: $x=mq+r$.', [T`$x=${m1}+${r1}$`, 'Brakuje ilorazu $k$.'], [T`$x=${r1}\cdot ${r2}$`, 'To nie wynika z warunków.']),
       S('Lewa strona', 'Przez co na pewno dzieli się lewa strona?', T`Przez $${d}$: $${m1}k-${m2}l=${d}\left(${m1 / d}k-${m2 / d}l\right)$`, T`$${m1}=${d}\cdot ${m1 / d}$ i $${m2}=${d}\cdot ${m2 / d}$, więc $${m1}k-${m2}l=${d}\left(${m1 / d}k-${m2 / d}l\right)$ — lewa strona dzieli się przez $${d}$ dla dowolnych $k,l$.`, T`Wyciągamy wspólny dzielnik współczynników, czyli $(${m1},${m2})=${d}$.`, [T`Przez $${m1}$`, 'Wyraz $' + m2 + 'l$ nie musi dzielić się przez ' + m1 + '.'], [T`Przez $${m1 * m2}$`, 'Nic takiego nie wynika.']),
       S('Sprzeczność', 'Co z prawą stroną?', T`$${d}\nmid ${r2 - r1}$ — sprzeczność`, T`Prawa strona to $${r2 - r1}$, a $${d}\nmid ${r2 - r1}$. Lewa strona dzieli się przez $${d}$, prawa nie — sprzeczność. Taka liczba nie istnieje. $\blacksquare$`, 'Równe liczby mają te same dzielniki.', [T`$${d}\mid ${r2 - r1}$`, T`$${r2 - r1}$ nie jest wielokrotnością $${d}$.`], ['Brak sprzeczności', 'Strony równania różnią się podzielnością przez ' + d + '.'])],
      [[T`Przypuśćmy, że $x=${m1}k+${r1}=${m2}l+${r2}$; wtedy $${m1}k-${m2}l=${r2 - r1}$.`, 'założenie nie wprost i równanie'], [T`$${m1}k-${m2}l=${d}\left(${m1 / d}k-${m2 / d}l\right)$, więc $${d}$ dzieli lewą stronę.`, 'podzielność lewej strony'], [T`$${d}\nmid ${r2 - r1}$ — sprzeczność. $\blacksquare$`, 'sprzeczność']],
      ['Brak dowodu nie wprost.']);
    return proof('', 'resz', q, [A1, A2]);
  }
  function genRes() { for (;;) { const d = R.pick([2, 3, 4, 5, 6]), m1 = d * R.int(2, 7), m2 = d * R.int(2, 7); if (m1 === m2 || gcd(m1, m2) !== d) continue; const r1 = R.int(1, m1 - 1), r2 = R.int(1, m2 - 1); if (r1 % d === r2 % d) continue; return resProof(m1, r1, m2, r2); } }

  /* ===== 7, 8: m | ax+by ⇒ m | cx+dy ===== */
  const lin = (a, b) => { let s = ''; for (const [c, v] of [[a, 'x'], [b, 'y']]) { if (!c) continue; const ac = Math.abs(c); s += (c < 0 ? '-' : s ? '+' : '') + (ac === 1 ? '' : ac) + v; } return s || '0'; };
  function combProof(m, a, b, c, d) {
    let k = null; for (let t = 1; t < m; t++) if (md(t * a - c, m) === 0 && md(t * b - d, m) === 0) { k = t; break; }
    const u = (k * a - c) / m, v = (k * b - d) / m, j = inv(k, m), u2 = (j * c - a) / m, v2 = (j * d - b) / m;
    const q = T`Liczby $x,y\in\mathbb Z$ są takie, że $${m}\mid ${lin(a, b)}$. Udowodnij, że $${m}\mid ${lin(c, d)}$.`;
    const A1 = M('Kombinacja liniowa', 'Wyraź nowe wyrażenie przez dane plus wielokrotność ' + m + '.', T`$${lin(c, d)}=${k}(${lin(a, b)})-${m}(${lin(u, v).replace(/\+-/g, '-')})$ — sprawdź, wymnażając.`,
      [S('Szukamy mnożnika', T`Przez co pomnożyć $${lin(a, b)}$, żeby współczynniki dały $${c},${d}$ modulo $${m}$?`, T`Przez $${k}$: $${k}\cdot ${a}=${k * a}\equiv ${c}$, $${k}\cdot ${b}=${k * b}\equiv ${d}\pmod{${m}}$`, T`$${k}(${lin(a, b)})=${lin(k * a, k * b)}$, a $${k * a}\equiv ${c}$, $${k * b}\equiv ${d}\pmod{${m}}$.`, 'Szukamy $t$ z $t\\cdot' + a + '\\equiv' + c + '$ i sprawdzamy, czy pasuje też drugi współczynnik.', (() => { const v = [c, k + 1, k + 2, 2, 3].find(x => x !== k && x % m !== 0 && (md(x * a - c, m) !== 0 || md(x * b - d, m) !== 0)); return [T`Przez $${v}$`, md(v * a - c, m) !== 0 ? T`$${v}\cdot ${a}=${v * a}\not\equiv ${c}\pmod{${m}}$.` : T`$${v}\cdot ${b}=${v * b}\not\equiv ${d}\pmod{${m}}$.`]; })(), ['Przez $' + m + '$', 'Wtedy wszystko jest podzielne przez ' + m + ', ale nie dostajemy wyrażenia z tezy.']),
       S('Tożsamość', 'Jaka tożsamość z tego wychodzi?', T`$${lin(c, d)}=${k}(${lin(a, b)})-${m}(${lin(u, v)})$`, T`$${lin(c, d)}=${k}(${lin(a, b)})-${m}(${lin(u, v)})$.`.replace(/\+-/g, '-'), 'Sprawdź wymnażając: $' + k + '\\cdot' + a + '-' + m + '\\cdot' + u + '=' + c + '$.', [T`$${lin(c, d)}=${k}(${lin(a, b)})$`, 'Brakuje poprawki z wielokrotnością ' + m + '.'], [T`$${lin(c, d)}=(${lin(a, b)})+${m}x$`, 'Współczynniki się nie zgadzają.']),
       S('Wniosek', 'Dlaczego ' + m + ' dzieli prawą stronę?', 'Bo dzieli oba składniki', T`Z założenia $${lin(a, b)}=${m}s$, $s\in\mathbb Z$. Wtedy $${lin(c, d)}=${m}\left(${k}s-(${lin(u, v)})\right)$, a nawias jest całkowity. Zatem $${m}\mid ${lin(c, d)}$. $\blacksquare$`.replace(/\+-/g, '-'), 'Wyciągnięcie ' + m + ' przed nawias i stwierdzenie, że nawias jest całkowity — za to jest punkt.', ['Bo $x,y$ dzielą się przez ' + m, 'Nic takiego nie wiemy — tylko kombinacja się dzieli.'], ['Bo $' + k + '$ dzieli się przez ' + m, 'Nie dzieli się.'])],
      [[T`Z założenia $${lin(a, b)}=${m}s$ dla pewnego $s\in\mathbb Z$.`, 'zapis założenia'], [T`$${lin(c, d)}=${k}(${lin(a, b)})-${m}(${lin(u, v)})=${m}\left(${k}s-${lin(u, v)}\right)$.`.replace(/\+-/g, '-'), 'tożsamość'], [T`Nawias jest liczbą całkowitą, więc $${m}\mid ${lin(c, d)}$. $\blacksquare$`, 'wniosek']],
      ['Tożsamość bez sprawdzenia — jeden błąd rachunkowy i cały dowód leży.', 'Brak stwierdzenia, że nawias jest całkowity.']);
    const A2 = M('Mnożenie i względna pierwszość', 'Pomnóż tezę przez liczbę względnie pierwszą z ' + m + ', żeby dostać założenie.', T`$${j}(${lin(c, d)})=(${lin(a, b)})+${m}(${lin(u2, v2)})$, a $(${j},${m})=1$.`,
      [S('Mnożnik', T`Przez co pomnożyć $${lin(c, d)}$, żeby pojawiło się $${lin(a, b)}$?`, T`Przez $${j}$`, T`$${j}(${lin(c, d)})=${lin(j * c, j * d)}=(${lin(a, b)})+${m}(${lin(u2, v2)})$.`.replace(/\+-/g, '-'), 'Szukamy $j$ z $j\\cdot' + c + '\\equiv' + a + '\\pmod{' + m + '}$.', (() => { const v = [a, j + 1, j + 2, 2, 3].find(x => x !== j && x % m !== 0 && (md(x * c - a, m) !== 0 || md(x * d - b, m) !== 0)); return [T`Przez $${v}$`, 'Współczynniki się nie zgodzą — sprawdź oba modulo ' + m + '.']; })(), ['Przez $' + m + '$', 'To nic nie daje.']),
       S('Podzielność iloczynu', 'Co wiemy o $' + j + '(' + lin(c, d) + ')$?', T`Dzieli się przez $${m}$`, T`Prawa strona dzieli się przez $${m}$ (pierwszy składnik z założenia), więc $${m}\mid ${j}(${lin(c, d)})$.`, 'Suma wielokrotności ' + m + ' jest wielokrotnością ' + m + '.', ['Nie wiadomo', 'Oba składniki prawej strony dzielą się przez ' + m + '.'], ['Dzieli się przez $' + j + m + '$', 'Tylko przez ' + m + '.']),
       S('Względna pierwszość', 'Jak pozbyć się czynnika $' + j + '$?', T`$(${j},${m})=1$, więc $${m}\mid ${lin(c, d)}$`, T`Ponieważ $(${j},${m})=1$, z $${m}\mid ${j}(${lin(c, d)})$ wynika $${m}\mid ${lin(c, d)}$. $\blacksquare$`, 'Lemat: jeśli $m\\mid ab$ i $(a,m)=1$, to $m\\mid b$ — trzeba go przywołać.', ['Dzielimy przez ' + j, 'Dzielenie trzeba uzasadnić względną pierwszością.'], ['Nie da się', 'Da się — bo $(' + j + ',' + m + ')=1$.'])],
      [[T`$${j}(${lin(c, d)})=(${lin(a, b)})+${m}(${lin(u2, v2)})$, więc $${m}\mid ${j}(${lin(c, d)})$.`.replace(/\+-/g, '-'), 'tożsamość'], [T`$(${j},${m})=1$, zatem $${m}\mid ${lin(c, d)}$. $\blacksquare$`, 'względna pierwszość — wprost']],
      ['Brak argumentu o względnej pierwszości — bez niego krok jest niepoprawny.']);
    return proof('', 'komb', q, [A1, A2]);
  }
  function genComb() { for (;;) { const m = R.pick([7, 11, 13, 17, 19, 23, 35]); const a = R.int(1, m - 1), b = R.int(1, m - 1), k = R.int(2, m - 2); if (gcd(k, m) !== 1 || gcd(a, m) !== 1) continue; const c = md(k * a, m), d = md(k * b, m); if (!c || !d || (c === a && d === b) || gcd(c, m) !== 1) continue; return combProof(m, a, b, c, d); } }

  /* ===== 9: z = x+y ⇒ x,y,z | z^e − x^e − y^e ===== */
  function sumProof(e) {
    const f = e === 3 ? T`3xy(x+y)` : T`5xy(x+y)(x^2+xy+y^2)`;
    const q = T`Niech $x,y\in\mathbb Z$ i $z=x+y$. Pokaż, że każda z liczb $x,y,z$ dzieli $z^{${e}}-x^{${e}}-y^{${e}}$.`;
    const ex = e === 3 ? T`x^3+3x^2y+3xy^2+y^3` : T`x^5+5x^4y+10x^3y^2+10x^2y^3+5xy^4+y^5`;
    const rest = e === 3 ? T`3x^2y+3xy^2` : T`5x^4y+10x^3y^2+10x^2y^3+5xy^4`;
    const fac1 = e === 3 ? T`3xy(x+y)` : T`5xy(x^3+2x^2y+2xy^2+y^3)`;
    const A1 = M('Rozkład na czynniki', 'Wyrażenie, w którym coś się skraca — rozwiń i wyciągnij wspólne czynniki.', T`$(x+y)^{${e}}-x^{${e}}-y^{${e}}=${f}=${e === 3 ? '3xyz' : '5xyz(x^2+xy+y^2)'}$ — jawnie widać czynniki $x,y,z$.`,
      [S('Podstawienie', T`Co podstawić za $z$?`, T`$z=x+y$`, T`Skoro $z=x+y$, to $z^{${e}}-x^{${e}}-y^{${e}}=(x+y)^{${e}}-x^{${e}}-y^{${e}}$.`, 'Wtedy wszystko jest wyrażone przez $x$ i $y$.', [T`$z=xy$`, 'Z założenia $z=x+y$.'], [T`$z=x-y$`, 'Z założenia $z=x+y$.']),
       S('Rozwinięcie', T`Ile wynosi $(x+y)^{${e}}$?`, T`$${ex}$`, T`${e === 3 ? 'Wzór skróconego mnożenia' : 'Dwumian Newtona (współczynniki $1,5,10,10,5,1$)'}: $(x+y)^{${e}}=${ex}$. Po odjęciu $x^{${e}}$ i $y^{${e}}$ zostaje $${rest}$.`, 'Skrajne wyrazy $x^' + e + '$ i $y^' + e + '$ się skracają.', [e === 3 ? T`$x^3+y^3$` : T`$x^5+y^5$`, 'Brakuje wyrazów mieszanych.'], [e === 3 ? T`$x^3+2xy+y^3$` : T`$x^5+5xy+y^5$`, e === 3 ? 'Współczynniki to $1,3,3,1$.' : 'Współczynniki to $1,5,10,10,5,1$.']),
       S('Wspólny czynnik', T`Co wyciągnąć przed nawias z $${rest}$?`, T`$${f}$`, e === 3 ? T`Każdy wyraz zawiera $3xy$: $3x^2y+3xy^2=3xy(x+y)=3xyz$.` : T`Każdy wyraz zawiera $5xy$: $${rest}=${fac1}$, a $x^3+2x^2y+2xy^2+y^3=(x+y)(x^2+xy+y^2)$ (sprawdź, wymnażając). Razem: $5xy(x+y)(x^2+xy+y^2)=5xyz(x^2+xy+y^2)$.`, 'Na końcu z powrotem $x+y=z$.', [e === 3 ? T`$3xy(x+2y)$` : T`$5xy(x^3+y^3)$`, 'Wymnóż z powrotem — nie wychodzi wyjściowe wyrażenie.'], [T`$xy$`, 'Zgubiony współczynnik liczbowy.']),
       S('Wniosek', 'Dlaczego każda z liczb $x,y,z$ dzieli to wyrażenie?', 'Bo jest jego czynnikiem', T`$z^{${e}}-x^{${e}}-y^{${e}}=${e === 3 ? 'x\\cdot(3yz)=y\\cdot(3xz)=z\\cdot(3xy)' : 'x\\cdot(5yz\\,Q)=y\\cdot(5xz\\,Q)=z\\cdot(5xy\\,Q)'}$${e === 3 ? '' : ', gdzie $Q=x^2+xy+y^2\\in\\mathbb Z$'}, a nawiasy są całkowite, więc $x,y,z$ dzielą to wyrażenie. $\blacksquare$`, 'Definicja: $a\\mid b \\iff b=a\\cdot c$ dla pewnego całkowitego $c$ — także gdy $a=0$ i $b=0$.', ['Tylko gdy $x,y\\neq0$', 'Dla $x=0$ wyrażenie to $0$, a $0\\mid0$ — wszystko się zgadza.'], ['Bo $x,y,z$ są pierwsze', 'Nie zakładamy tego.'])],
      [[T`$z^{${e}}-x^{${e}}-y^{${e}}=(x+y)^{${e}}-x^{${e}}-y^{${e}}=${rest}$.`, 'podstawienie i rozwinięcie'], [e === 3 ? T`$=3xy(x+y)=3xyz$.` : T`$=5xy(x+y)(x^2+xy+y^2)=5xyzQ$.`, 'rozkład'], [T`Wyrażenie jest postaci $x\cdot(\ldots)$, $y\cdot(\ldots)$, $z\cdot(\ldots)$ z całkowitymi nawiasami, więc $x,y,z$ go dzielą. $\blacksquare$`, 'wniosek z definicji podzielności']],
      ['Pominięcie uzasadnienia, że nawiasy są całkowite.']);
    return proof('', 'sum3', q, [A1]);
  }

  /* ===== 10 ===== */
  const it10 = proof('1.10', 'ab', T`Pokaż, że jeśli każda z liczb $a,b,c,d\in\mathbb N$ dzieli się przez $ab-cd$, to $|ab-cd|=1$.`, [M('Kwadrat dzielnika', 'Jeśli $k$ dzieli $a$ i $b$, to $k^2$ dzieli $ab$.', T`Oznacz $k=ab-cd$. Wtedy $k^2\mid ab$ i $k^2\mid cd$, więc $k^2\mid ab-cd=k$.`,
    [S('Oznaczenie', 'Co oznaczyć literą?', '$k=ab-cd$', T`Niech $k=ab-cd$. Z założenia $k\mid a,\ k\mid b,\ k\mid c,\ k\mid d$.`, 'Krótka nazwa ułatwia zapis — teza to $|k|=1$.', ['$k=a+b$', 'Nie o tę liczbę chodzi.'], ['$k=(a,b)$', 'Teza mówi o $ab-cd$.']),
     S('k ≠ 0', T`Dlaczego $k\neq0$?`, T`Bo $k\mid a$, a $a\neq0$`, T`Gdyby $k=0$, to z $0\mid a$ mielibyśmy $a=0$ — a $a\in\mathbb N$, więc $a\geq1$. Zatem $k\neq0$.`, 'Zero dzieli tylko zero ($a=0\\cdot c$ daje $a=0$). Bez $k\\neq0$ końcowa nierówność nie działa.', [T`Bo $ab>cd$`, 'Tego nie wiemy — $k$ może być ujemne.'], [T`Nie trzeba tego pokazywać`, 'Potrzebne w ostatnim kroku: z $k^2\\mid k$ dla $k=0$ nic nie wynika.']),
     S('Kwadrat dzieli iloczyn', 'Co wynika z $k\\mid a$ i $k\\mid b$?', '$k^2\\mid ab$', T`$k\mid a$ i $k\mid b$, czyli $a=ka'$, $b=kb'$ dla pewnych $a',b'\in\mathbb Z$. Wtedy $ab=ka'\cdot kb'=k^2a'b'$, więc $k^2\mid ab$. Tak samo $c=kc'$, $d=kd'$ daje $cd=k^2c'd'$, czyli $k^2\mid cd$.`, 'Iloczyn dwóch wielokrotności $k$ jest wielokrotnością $k^2$.', ['Tylko $k\\mid ab$', 'Da się więcej: $k^2\\mid ab$.'], ['$2k\\mid ab$', 'Czynniki się mnożą, a nie dodają.']),
     S('k² dzieli k', 'Co z tego wynika dla $k$?', '$k^2\\mid k$', T`$k=ab-cd=k^2a'b'-k^2c'd'=k^2\left(a'b'-c'd'\right)$, więc $k^2\mid k$.`, 'Różnica dwóch wielokrotności $k^2$ jest wielokrotnością $k^2$.', ['$k\\mid k^2$', 'To prawda zawsze — nic nie daje. Potrzebne odwrotnie.'], ['$k^2=k$', 'Wiemy tylko, że $k^2$ dzieli $k$.']),
     S('Wniosek', 'Co wynika z $k^2\\mid k$ i $k\\neq0$?', '$|k|=1$', T`Z $k=k^2\cdot m$ ($m\in\mathbb Z$, $m\neq0$, bo $k\neq0$) mamy $|k|=k^2|m|\geq k^2$. Dzielimy przez $|k|>0$: $1\geq|k|$. Ponieważ $k\neq0$ jest całkowite, $|k|=1$, czyli $|ab-cd|=1$. $\blacksquare$`, 'Niezerowa wielokrotność liczby ma moduł co najmniej taki jak ta liczba.', ['$k=0$', 'Wykluczyliśmy to wcześniej.'], ['$k=1$', 'Może być też $k=-1$ — poprawnie: $|k|=1$.'])],
    [[T`Niech $k=ab-cd$; $k\mid a,b,c,d$.`, 'oznaczenie'], [T`$k\neq0$, bo $k\mid a$ i $a\neq0$.`, 'uzasadnienie $k\\neq0$'], [T`$a=ka',\ b=kb',\ c=kc',\ d=kd'$, więc $ab=k^2a'b'$, $cd=k^2c'd'$.`, 'zapis z definicji podzielności'], [T`$k=k^2(a'b'-c'd')$, więc $k^2\mid k$.`, 'kluczowa obserwacja'], [T`$k\neq0\Rightarrow |k|\geq k^2\Rightarrow |k|\leq1\Rightarrow |k|=1$. $\blacksquare$`, 'wniosek']],
    ['Brak uzasadnienia, że $k\\neq0$.', 'Odpowiedź $k=1$ zamiast $|k|=1$.'])]);

  /* ===== opracowanie: metody i wzory ===== */
  const F = {
    m_kong: W('<b>Metoda: kongruencje.</b> Zamiast liczb rachuj na resztach modulo $m$: zredukuj podstawę potęgi, aż dostaniesz $1$ albo coś prostego.', 'Kiedy: potęga z $n$ w wykładniku i stały moduł ($4\\mid5^{5n-2}+3$).', 'Jak: znajdź potęgę podstawy dającą resztę $1$ (np. $5\\equiv1\\pmod4$, $81\\equiv1\\pmod{10}$), wtedy reszta całej potęgi jest stała.', 'Zapis: każda linijka z „$\\pmod m$”, na końcu „$\\equiv0$, więc $m\\mid\\ldots$”.'),
    m_ind: W(T`<b>Metoda: indukcja dla podzielności.</b> Sprawdzenie dla $n=1$, założenie dla $n$, teza dla $n+1$, dowód tezy, zakończenie.`, T`<b>Sprawdzenie:</b> podstaw $n=1$ i pokaż iloraz, np. $5^3+3=128=4\cdot32$.`, T`<b>Założenie indukcyjne:</b> dla pewnego $n\in\mathbb N$ teza zachodzi — zapisz to z definicji: $5^{5n-2}+3=4l$, $l\in\mathbb Z$.`, T`<b>Teza indukcyjna:</b> to samo dla $n+1$: $4\mid5^{5(n+1)-2}+3$.`, T`<b>Dowód tezy:</b> zapisz wyrażenie dla $n+1$ tak, żeby pojawiło się wyrażenie z założenia: $5^{5n+3}=5^5\cdot5^{5n-2}=5^5(4l-3)$, więc $5^{5n+3}+3=4\cdot5^5l-3(5^5-1)$, a $3(5^5-1)=9372=4\cdot2343$.`, T`<b>Zakończenie:</b> „Na mocy zasady indukcji matematycznej teza zachodzi dla każdego $n\in\mathbb N$”.`),
    m_rozk: W('<b>Metoda: rozkład na czynniki.</b> Zapisz wyrażenie jako iloczyn i pokaż, że któryś czynnik się dzieli.', 'Kiedy: wielomian od $n$ (np. $n^3-n=(n-1)n(n+1)$).', 'Typowe: $n^2-1=(n-1)(n+1)$, $a^3\\pm b^3$, iloczyn $k$ kolejnych liczb dzieli się przez $k$.'),
    m_reszty: W('<b>Metoda: wszystkie reszty.</b> Rozważ $n\\equiv0,1,\\ldots,k-1\\pmod k$ i policz wyrażenie w każdym przypadku.', 'Kiedy: mały moduł ($2,3,4,5,6$).', 'Uwaga: nie pomijaj żadnej reszty — za to najczęściej lecą punkty.'),
    m_kontr: W(T`<b>Metoda: kontrprzykład.</b> Na pytanie „czy zawsze…?” odpowiedź „nie” wymaga jednego konkretnego, przeliczonego przykładu.`,
      T`Sprawdzaj kolejne małe $n$: $1,2,3,\ldots$ — liczy się pierwsze, dla którego teza nie zachodzi.`,
      T`Pokaż rachunek: np. $n=2$: $2^4-2=14$, a $14=4\cdot3+2$, więc $4\nmid14$.`,
      T`Uwaga na fałszywe kontrprzykłady: $n=1$ daje $0$, a $0$ dzieli się przez każdą liczbę.`,
      T`Odwrotnie: kilka udanych przykładów nigdy nie dowodzi „zawsze” — do tego potrzebny jest dowód.`),
    m_komb: W('<b>Metoda: kombinacja liniowa.</b> Wyraź nowe wyrażenie przez dane: $cx+dy=k(ax+by)-m(\\ldots)$.', 'Kiedy: „jeśli $m\\mid ax+by$, to $m\\mid cx+dy$”.', 'Jak: szukaj $k$ z $k\\cdot a\\equiv c$, $k\\cdot b\\equiv d\\pmod m$; potem sprawdź tożsamość wymnażając.'),
    m_resz: W(T`<b>Metoda: sprzeczność reszt.</b> Gdy warunki dotyczą dzielenia przez $m_1$ i $m_2$, porównaj reszty modulo $d=(m_1,m_2)$.`,
      T`Z $x=m_1k+r_1$ i $d\mid m_1$ wynika $x\equiv r_1\pmod d$; tak samo $x\equiv r_2\pmod d$.`,
      T`Jeśli $r_1$ i $r_2$ dają różne reszty modulo $d$, to $x$ miałby dwie różne reszty — sprzeczność, taka liczba nie istnieje.`,
      T`Przykład: przez $18$ reszta $13$, przez $21$ reszta $2$. $(18,21)=3$: $13\equiv1$, a $2\equiv2\pmod3$ — sprzeczność.`),
    m_poly: W('<b>Metoda: reszta z dzielenia wielomianu.</b> $W(n)=(n-r)Q(n)+W(r)$, więc $n-r\\mid W(n)\\iff n-r\\mid W(r)$.', 'Kiedy: „dla jakich $n$ liczba $W(n)$ dzieli się przez $n\\pm r$”.', 'Potem: wypisz dzielniki $W(r)$ (dodatnie i ujemne!) i odrzuć $n$ spoza dziedziny.'),
    kongr: W(T`<b>Kongruencje</b>: $a\equiv b\pmod m\iff m\mid a-b$ („$a$ i $b$ dają tę samą resztę z dzielenia przez $m$”).`,
      T`Można je dodawać i mnożyć stronami: jeśli $a=b+mk$, $c=d+ml$, to $a+c$ i $ac$ różnią się od $b+d$ i $bd$ o wielokrotność $m$.`,
      T`Stąd też potęgowanie: $a\equiv b\Rightarrow a^n\equiv b^n\pmod m$.`,
      T`Praktycznie: zamiast dużej liczby wstaw jej resztę. Np. $81\equiv1\pmod{10}$, więc $3^{4n}=81^n\equiv1\pmod{10}$.`,
      T`Na końcu: „$A\equiv0\pmod m$, więc $m\mid A$”.`),
    dwumian: W(T`<b>Dwumian modulo $q^2$</b>: $(1+q)^n\equiv1+nq\pmod{q^2}$.`,
      T`Rozwiń: $(1+q)^n=1+nq+\binom n2q^2+\binom n3q^3+\ldots$`,
      T`Od trzeciego wyrazu każdy ma czynnik $q^2$, więc modulo $q^2$ znikają.`,
      T`Przykład: $4^n=(1+3)^n\equiv1+3n\pmod9$, stąd $4^n+15n-1\equiv1+3n+15n-1=18n\equiv0\pmod9$.`),
    kolejne: W(T`<b>Kolejne liczby</b>: wśród $k$ kolejnych liczb całkowitych dokładnie jedna dzieli się przez $k$.`,
      T`$k$ kolejnych liczb daje $k$ różnych reszt z dzielenia przez $k$ — czyli wszystkie $0,1,\ldots,k-1$, w tym $0$.`,
      T`Stąd $(n-1)n(n+1)$ dzieli się przez $3$ i przez $2$, więc przez $6$ (bo $(2,3)=1$).`,
      T`Uwaga: z $2\mid x$ i $4\mid x$ nie wynika $8\mid x$ — mnożyć dzielniki wolno tylko względnie pierwsze.`),
    wzgl: W(T`<b>Lemat</b>: jeśli $m\mid ab$ i $(a,m)=1$, to $m\mid b$.`,
      T`Z Bézouta: $1=ax+my$ dla pewnych całkowitych $x,y$.`,
      T`Mnożymy przez $b$: $b=abx+mby$. Oba składniki dzielą się przez $m$ ($ab$ z założenia), więc $m\mid b$.`,
      T`Bez względnej pierwszości to nie działa: $6\mid 2\cdot3$, ale $6\nmid3$.`),
    sumdiv: W(T`<b>Kombinacje</b>: jeśli $d\mid a$ i $d\mid b$, to $d\mid ax+by$ dla dowolnych całkowitych $x,y$.`,
      T`Zapisz $a=da'$, $b=db'$; wtedy $ax+by=d(a'x+b'y)$, a nawias jest całkowity.`,
      T`W szczególności $d$ dzieli sumę i różnicę: $d\mid a\pm b$.`,
      T`Tak dowodzimy „jeśli $m\mid ax+by$, to $m\mid cx+dy$”: wyrażamy drugie przez pierwsze plus wielokrotność $m$.`),
    def: W(T`<b>Definicja podzielności</b>: $a\mid b\iff b=a\cdot c$ dla pewnego $c\in\mathbb Z$.`,
      T`W dowodzie zawsze zapisuj to jawnie: „$b=ak$ dla pewnego $k\in\mathbb Z$” — za to jest punkt.`,
      T`Każda liczba dzieli $0$ ($0=a\cdot0$), a $0$ dzieli tylko $0$.`,
      T`Podzielność jest przechodnia: $a\mid b$ i $b\mid c$ daje $a\mid c$.`),
  };
  const P = (label, it) => Object.assign(it, { label });
  A.addList({
    num: 21, id: 'e1', subject: 'etl', title: 'Lista 1', name: 'Podzielność', hue: 'e1',
    blurb: 'Dowody podzielności: rozkład, reszty, kongruencje, indukcja i kombinacje liniowe.',
    tasks: [
      { id: 'E1.1', name: 'Podzielność $n^p-n$', statement: T`Niech $n\in\mathbb N$. (a) Udowodnij, że $3\mid n^3-n$. (b) Udowodnij, że $5\mid n^5-n$. (c) Czy zawsze $4\mid n^4-n$?`, wzIds: it => ({ kontr: ['m_kontr', 'def'] }[it && it.gk] || ['m_rozk', 'm_reszty', 'm_ind', 'kolejne', 'kongr']), gen: gk => (gk === 'kontr' ? genKontr() : genCube(gk)),
        items: [P('(a)', cubeProof(3, 3, -1)), P('(b)', cubeProof(5, 5, -1)), P('(c)', kontr(4))] },
      { id: 'E1.2', name: 'Podzielność potęg', statement: T`Udowodnij, że dla każdego $n\in\mathbb N$: (a) $4\mid5^{5n-2}+3$, (b) $10\mid3^{4n+2}+1$, (c) $133\mid11^{n+2}+12^{2n+1}$, (d) $7\mid2^{n+2}+3^{2n+1}$, (e) $9\mid4^n+15n-1$.`, wzIds: it => ['m_kong', 'm_ind', 'kongr', ...(it && it.gk === 'f3' ? ['dwumian'] : [])], gen: gk => (gk === 'f2' ? genF2() : gk === 'f3' ? genF3() : genF1()),
        items: [P('(a)', powProofA(4, 5, 5, -2, 3, '5n-2')), P('(b)', powProofA(10, 3, 4, 2, 1, '4n+2')), P('(c)', powProofB(133, 11, 2, 12, 1)), P('(d)', powProofB(7, 2, 2, 3, 1)), P('(e)', powProofC(3, 15))] },
      { id: 'E1.3', name: 'Wielomian podzielny przez $n\\pm r$', statement: T`Dla jakich liczb naturalnych $n$ liczba $n^3-7n^2-5n+10$ jest podzielna przez: (a) $n+2$, (b) $n-7$, (c) $n^2-5n-14$?`, wzIds: ['m_poly', 'def'], gen: gk => (gk === 'prod' ? genPolyProd() : genPoly()),
        items: [P('(a)', polyDiv([1, -7, -5, 10], 2)), P('(b)', polyDiv([1, -7, -5, 10], -7)), P('(c)', item3c)] },
      { id: 'E1.4', name: 'Kiedy ułamek jest całkowity', statement: T`Znaleźć wszystkie liczby całkowite $n$, dla których $\frac{n^2+1}{n+2}$ jest liczbą całkowitą.`, wzIds: ['m_poly', 'def'], gen: genFrac, items: [P('1.4', fracInt(1, 2))] },
      { id: 'E1.5', name: 'Sprzeczne reszty (18 i 21)', statement: T`Wykaż, że nie istnieje liczba naturalna, która przy dzieleniu przez $18$ daje resztę $13$, a przy dzieleniu przez $21$ daje resztę $2$.`, wzIds: ['m_resz', 'def'], gen: genRes, items: [P('1.5', resProof(18, 13, 21, 2))] },
      { id: 'E1.6', name: 'Sprzeczne reszty (15 i 20)', statement: T`Wykaż, że nie istnieje liczba naturalna, która przy dzieleniu przez $15$ daje resztę $11$, a przy dzieleniu przez $20$ daje resztę $19$.`, wzIds: ['m_resz', 'def'], gen: genRes, items: [P('1.6', resProof(15, 11, 20, 19))] },
      { id: 'E1.7', name: '$35\\mid6x+13y\\Rightarrow35\\mid x+8y$', statement: T`Liczby $x,y\in\mathbb Z$ są takie, że $6x+13y$ dzieli się przez $35$. Wykaż, że $x+8y$ też dzieli się przez $35$.`, wzIds: ['m_komb', 'wzgl', 'sumdiv', 'def'], gen: genComb, items: [P('1.7', combProof(35, 6, 13, 1, 8))] },
      { id: 'E1.8', name: '$17\\mid2x+3y\\Rightarrow17\\mid9x+5y$', statement: T`Udowodnić, że jeżeli $x,y\in\mathbb Z$ i $17\mid2x+3y$, to $17\mid9x+5y$.`, wzIds: ['m_komb', 'wzgl', 'sumdiv', 'def'], gen: genComb, items: [P('1.8', combProof(17, 2, 3, 9, 5))] },
      { id: 'E1.9', name: '$z=x+y$ i $z^3-x^3-y^3$', statement: T`Pokazać, że jeżeli $x,y\in\mathbb Z$ oraz $z=x+y$, to każda z liczb $x,y,z$ jest dzielnikiem liczby $z^3-x^3-y^3$.`, wzIds: ['m_rozk', 'def'], gen: () => sumProof(R.pick([3, 5])), items: [P('1.9', sumProof(3))] },
      { id: 'E1.10', name: 'Dzielnik $ab-cd$', statement: T`Pokazać, że jeśli każda z liczb $a,b,c,d\in\mathbb N$ dzieli się przez $ab-cd$, to $|ab-cd|=1$.`, wzIds: ['def'], items: [it10] },
    ],
  });
  for (const t of A.lists.find(l => l.id === 'e1').tasks) t.wzLib = F;
  A.ETL = { cubeProof, kontr, powProofA, powProofB, powProofC, polyDiv, fracInt, resProof, combProof, sumProof, W3, genF1, genF2, genF3, genComb, genRes, genPoly, genFrac, genCube };
  A.ETLH = { S, M, proof, P, gcd, md, inv, divs, big, sgn, lin, pw, W, mk, txtField, norm };
})();
