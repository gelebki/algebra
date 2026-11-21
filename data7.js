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
  const M = (name, when, idea, steps, exam, traps) => ({ name, when, idea, steps, exam, traps, sol: steps.map(s => s.line) });
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
    const tbl = vals.map(([r, v]) => T`n\equiv${r}:\ ${r}^{${p}}${a < 0 ? '-' : '+'}${Math.abs(a) === 1 ? '' : Math.abs(a) + '\\cdot '}${r}=${r ** p + a * r}\equiv${v}`).join(',\\ \\ ');
    const factorMethod = p === 3 ? M('Rozkład na czynniki', 'Wielomian od $n$ — rozłóż go; często wychodzi iloczyn kolejnych liczb.',
      T`$n^3-n=(n-1)n(n+1)$ to trzy kolejne liczby całkowite.${k === 6 ? ' Wśród nich jest liczba parzysta i liczba podzielna przez 3.' : ' Jedna z nich dzieli się przez 3.'}${split}`,
      [S('Rozkład', T`Jak zapisać $n^3-n$ jako iloczyn?`, T`$n^3-n=(n-1)n(n+1)$`, T`$n^3-n=n(n^2-1)=(n-1)n(n+1)$${c ? T`, a $${exprT}=(n-1)n(n+1)${extra}$` : ''}.`, 'Wyciągamy $n$ przed nawias, a $n^2-1$ to różnica kwadratów.',
        [T`$n^3-n=n(n-1)^2$`, T`$n(n-1)^2=n^3-2n^2+n$ — inny wielomian.`], [T`$n^3-n=(n-1)(n^2+n+1)$`, T`To rozkład $n^3-1$, a nie $n^3-n$.`]),
       S('Kolejne liczby', T`Co wiemy o liczbach $n-1,\ n,\ n+1$?`, k === 6 ? 'To trzy kolejne liczby — jest wśród nich liczba parzysta i liczba podzielna przez 3' : 'To trzy kolejne liczby — jedna z nich dzieli się przez 3',
        k === 6 ? T`Wśród trzech kolejnych liczb całkowitych jest liczba parzysta i liczba podzielna przez $3$, więc $2\mid(n-1)n(n+1)$ i $3\mid(n-1)n(n+1)$; skoro $(2,3)=1$, to $6\mid(n-1)n(n+1)$.` : T`Wśród trzech kolejnych liczb całkowitych $n-1,n,n+1$ jedna dzieli się przez $3$ (dają różne reszty $0,1,2$), więc $3\mid(n-1)n(n+1)$.`,
        k === 6 ? 'Podzielność przez 2 i przez 3 daje podzielność przez 6, bo 2 i 3 są względnie pierwsze — to trzeba napisać.' : 'Trzy kolejne liczby dają trzy różne reszty z dzielenia przez 3, więc jedna reszta to 0.',
        ['Wszystkie trzy są nieparzyste', 'Kolejne liczby mają różną parzystość.'], ['Ich suma $3n$ dzieli się przez 3, więc iloczyn też', 'Z podzielności sumy nie wynika podzielność iloczynu.'])].concat(c ? [S('Doklejony wyraz', T`Co z wyrazem $${c}n$?`, T`$${k}\mid ${c}n$, bo $${k}\mid${c}$`, T`$${k}\mid ${c}n$, bo $${c}=${k}\cdot${c / k}$. Suma liczb podzielnych przez $${k}$ jest podzielna przez $${k}$: $\ ${k}\mid ${exprT}$. $\blacksquare$`, 'Podzielność sumy: jeśli $k\\mid A$ i $k\\mid B$, to $k\\mid A+B$.',
        [T`Trzeba go osobno sprawdzić dla małych $n$`, 'Nie — $' + c + 'n$ dzieli się przez $' + k + '$ dla każdego $n$.'], [T`Psuje podzielność`, 'Dodanie wielokrotności $' + k + '$ nie zmienia reszty.'])] : [S('Wniosek', 'Co z tego wynika?', T`$${k}\mid n^3-n$`, T`Zatem $${k}\mid n^3-n$ dla każdego $n\in\mathbb N$. $\blacksquare$`, 'Iloczyn, którego czynnik (lub kilka czynników) daje podzielność, sam jest podzielny.', ['Tylko dla $n\\geq3$', 'Rozumowanie działa dla każdego $n$, także $n=1$ (wtedy iloczyn to 0).'], ['Tylko dla parzystych $n$', 'Parzystość $n$ nie ma tu znaczenia.'])]),
      [[T`$${exprT}=${c ? '(n-1)n(n+1)' + extra : '(n-1)n(n+1)'}$`, 'poprawny rozkład'], [k === 6 ? T`Wśród trzech kolejnych liczb $n-1,n,n+1$ jest liczba parzysta i podzielna przez 3; $(2,3)=1$, więc $6\mid(n-1)n(n+1)$.` : T`Wśród trzech kolejnych liczb $n-1,n,n+1$ jedna jest podzielna przez $3$, więc $3\mid(n-1)n(n+1)$.`, 'uzasadnienie, dlaczego iloczyn dzieli się przez ' + k], ...(c ? [[T`$${k}\mid${c}n$, więc $${k}\mid${exprT}$.`, 'podzielność sumy']] : []), [T`$\blacksquare$`, null]],
      ['Samo „to iloczyn kolejnych liczb” bez wskazania, dlaczego dzieli się przez ' + k + '.', ...(k === 6 ? ['Brak informacji, że 2 i 3 są względnie pierwsze (inaczej z 2 | x i 4 | x nie wynika 8 | x).'] : []), 'Sprawdzenie kilku $n$ to nie dowód.'])
      : M('Rozkład na czynniki', 'Wielomian od $n$ — rozłóż go do końca, potem rozważ reszty.', T`$n^5-n=(n-1)n(n+1)(n^2+1)$. Gdy $n\equiv0,\pm1\pmod5$, dzieli się któryś z pierwszych trzech czynników; gdy $n\equiv\pm2$, to $n^2+1\equiv5\equiv0$.${split}`,
      [S('Rozkład', T`Jak rozłożyć $n^5-n$?`, T`$n(n^4-1)=(n-1)n(n+1)(n^2+1)$`, T`$n^5-n=n(n^4-1)=n(n^2-1)(n^2+1)=(n-1)n(n+1)(n^2+1)$.`, 'Dwa razy różnica kwadratów.', [T`$n(n-1)^4$`, 'Po wymnożeniu nie wychodzi $n^5-n$.'], [T`$(n-1)n(n+1)(n+2)(n+3)$`, 'To pięć kolejnych liczb — ich iloczyn jest stopnia 5, ale to inny wielomian.']),
       S('Przypadki', T`Kiedy $5$ dzieli któryś z czynników $n-1,\ n,\ n+1$?`, T`Gdy $n\equiv0,1,4\pmod5$`, T`Jeśli $n\equiv0$, $n\equiv1$ lub $n\equiv4\pmod5$, to $5$ dzieli odpowiednio $n$, $n-1$ lub $n+1$.`, '$n+1\\equiv0$ dokładnie wtedy, gdy $n\\equiv4\\equiv-1\\pmod 5$.', [T`Gdy $n\equiv0,1,2$`, T`$n\equiv2$ nie zeruje żadnego z czynników $n-1,n,n+1$.`], ['Zawsze', 'Dla $n=2$: $1\\cdot2\\cdot3$ nie dzieli się przez 5.']),
       S('Pozostałe reszty', T`Co, gdy $n\equiv2$ lub $n\equiv3\pmod5$?`, T`Wtedy $n^2+1\equiv0\pmod5$`, T`Jeśli $n\equiv\pm2\pmod5$, to $n^2+1\equiv4+1=5\equiv0\pmod5$. W każdym przypadku $5\mid n^5-n$${c ? T`, a $5\mid${c}n$, więc $5\mid${exprT}$` : ''}. $\blacksquare$`, 'Wszystkie pięć reszt jest pokrytych — to najważniejszy punkt dowodu.', [T`Wtedy $n^2+1\equiv3$`, T`$2^2+1=5$, $3^2+1=10$.`], ['Te przypadki można pominąć', 'Wtedy dowód nie obejmuje np. $n=2$ — sprawdzający odejmie punkty.'])],
      [[T`$n^5-n=(n-1)n(n+1)(n^2+1)$`, 'rozkład'], [T`$n\equiv0,1,4\pmod5\Rightarrow5$ dzieli $n$, $n-1$ lub $n+1$.`, 'trzy reszty'], [T`$n\equiv2,3\pmod5\Rightarrow n^2+1\equiv5\equiv0\pmod5$.`, 'pozostałe dwie reszty'], [T`W każdym przypadku $5\mid n^5-n$.${c ? T` Ponadto $5\mid${c}n$.` : ''} $\blacksquare$`, 'wszystkie przypadki zamknięte']],
      ['Pominięte reszty $2$ i $3$ — najczęstsza utrata punktów.', 'Powołanie się na małe twierdzenie Fermata tylko wtedy, gdy było na wykładzie.']);
    const restMethod = M('Wszystkie reszty', T`Mały moduł $${k}$ — sprawdź po kolei każdą resztę $n$ z dzielenia przez $${k}$.`, T`Wystarczy policzyć $${exprT}$ modulo $${k}$ dla $n\equiv0,1,\ldots,${k - 1}$ — zawsze wychodzi $0$.`,
      [S('Przypadki', 'Ile przypadków trzeba rozważyć?', T`$${k}$: $n\equiv0,1,\ldots,${k - 1}\pmod{${k}}$`, T`Każda liczba całkowita daje przy dzieleniu przez $${k}$ jedną z reszt $0,1,\ldots,${k - 1}$; rozważamy każdą.`, 'Reszta $n$ wyznacza resztę każdego wielomianu od $n$ (kongruencje można dodawać, mnożyć i potęgować).', [T`Dwa: $n$ parzyste i nieparzyste`, T`Parzystość to reszty modulo 2, a tu dzielimy przez $${k}$.`], [T`Wystarczy $n=1,2,3$`, 'Sprawdzenie kilku liczb to nie dowód — trzeba reszt, które obejmują wszystkie $n$.']),
       S('Rachunek', T`Ile wynosi $${exprT}$ modulo $${k}$ w każdym przypadku?`, T`$0$ w każdym przypadku`, T`$${tbl}$.`, 'Liczymy na resztach, bo $n\\equiv r$ daje $n^' + p + '\\equiv r^' + p + '$.', [T`$0$ tylko dla parzystych reszt`, 'Policz jeszcze raz — tabelka daje same zera.'], [T`Reszty $0,1,\ldots$ kolejno`, 'To reszty samego $n$, a nie wyrażenia.']),
       S('Wniosek', 'Co z tego wynika?', T`$${k}\mid ${exprT}$ dla każdego $n$`, T`W każdym przypadku $${exprT}\equiv0\pmod{${k}}$, więc $${k}\mid${exprT}$ dla każdego $n\in\mathbb N$. $\blacksquare$`, 'Przypadki obejmują wszystkie liczby całkowite.', ['Tylko dla $n<' + k + '$', 'Reszty obejmują wszystkie $n$, nie tylko małe.'], ['Tylko dla $n$ podzielnych przez ' + k, 'Wyszło 0 dla każdej reszty.'])],
      [[T`Rozważamy reszty $n$ z dzielenia przez $${k}$.`, 'wszystkie przypadki wymienione'], [T`$${tbl}$`, 'rachunek dla każdej reszty'], [T`Zatem $${k}\mid${exprT}$ dla każdego $n$. $\blacksquare$`, 'wniosek']],
      ['Pominięcie którejś reszty.', 'Zapis „n = 1, 2, 3 sprawdzone” zamiast reszt — to nie jest dowód.']);
    return proof('', p === 3 ? 'cube' : 'quint', q, [factorMethod, restMethod]);
  }
  const genCube = gk => { if (gk === 'quint') { const a = R.pick([-1, 4, 9, -6]); return cubeProof(5, 5, a); } const k = R.pick([3, 6]); const a = R.pick(k === 3 ? [-1, 2, 5, 8, -4] : [-1, 5, 11, -7]); return cubeProof(3, k, a); };

  /* ===== 1(c) i podobne: czy zawsze m | n^m − n? ===== */
  function kontr(m) {
    let ce = 2; while ((ce ** m - ce) % m === 0) ce++;
    const v = ce ** m - ce;
    return mk({ gk: 'kontr', field: txtField(), q: T`Czy dla każdego $n\in\mathbb N$ zachodzi $${m}\mid n^{${m}}-n$?`, tex: T`\text{Nie: dla }n=${ce}\text{ mamy }${ce}^{${m}}-${ce}=${big(v)},\ ${m}\nmid ${big(v)}`,
      steps: [T`Pytanie „czy zawsze” — żeby odpowiedzieć „nie”, wystarczy <b>jeden konkretny kontrprzykład</b>.`, T`Sprawdzamy małe $n$: $n=1$ daje $0$ (podzielne), $n=${ce}$: $${ce}^{${m}}-${ce}=${big(v)}$, a $${big(v)}=${m}\cdot${Math.floor(v / m)}+${v % m}$.`, T`Odpowiedź: nie zawsze, np. $n=${ce}$.`],
      wrong: [[T`\text{Tak — wynika to z rozkładu na czynniki}`, T`Dla $n=${ce}$ podzielność nie zachodzi — jeden kontrprzykład obala „zawsze”.`], [T`\text{Nie: dla }n=1\text{ nie zachodzi}`, T`Dla $n=1$: $1-1=0$, a $0$ dzieli się przez każdą liczbę — to nie jest kontrprzykład.`], [T`\text{Tak — sprawdzone dla }n=1,\ldots,${ce - 1}`, 'Kilka przykładów nie dowodzi „zawsze”, a dla kolejnego $n$ podzielność się psuje.']] });
  }
  const genKontr = () => kontr(R.pick([4, 6, 8, 9, 10]));

  /* ===== 2: podzielność potęg — kongruencje albo indukcja ===== */
  function powProofA(m, a, k, s, t, expT) { // m | a^{kn+s} + t, a^k ≡ 1 (mod m)
    const ak = pw(a, k), base1 = pw(a, k + s) + BigInt(t), q1 = base1 / BigInt(m), tak = BigInt(t) * (ak - 1n);
    const q = T`Udowodnij, że dla każdego $n\in\mathbb N$: $\ ${m}\mid ${a}^{${expT}}+${t}$.`;
    const red = md(a, m) === 1 ? T`$${a}\equiv1\pmod{${m}}$, więc każda potęga $${a}$ daje resztę $1$: $${a}^{${expT}}\equiv1^{${expT}}=1$.` : T`$${a}^{${k}}=${ak}\equiv1\pmod{${m}}$, więc $${a}^{${expT}}=${a}^{${s}}\cdot\left(${a}^{${k}}\right)^{n}\equiv${a}^{${s}}\cdot1^n=${pw(a, s)}\pmod{${m}}$.`;
    const resid = md(a, m) === 1 ? 1 : Number(pw(a, s) % BigInt(m));
    const kong = M('Kongruencje', 'Potęga z $n$ w wykładniku — zredukuj podstawę modulo ' + m + '; zwykle krócej niż indukcja.', T`Szukamy potęgi $${a}$, która daje resztę $1$ modulo $${m}$ — wtedy cała potęga ma stałą resztę.`,
      [S('Redukcja podstawy', T`Jaką resztę daje $${a}^{${expT}}$ modulo $${m}$?`, T`$${resid}$ dla każdego $n$`, red, T`Kongruencje można potęgować: z $x\equiv y$ wynika $x^j\equiv y^j\pmod m$.`, [T`Zależy od parzystości $n$`, T`Po redukcji podstawy wykładnik przestaje mieć znaczenie.`], [T`$${a}$`, 'Reszta potęgi to nie reszta podstawy (chyba że podstawa ≡ 1).']),
       S('Wniosek', T`Ile wynosi $${a}^{${expT}}+${t}$ modulo $${m}$?`, '$0$', T`$${a}^{${expT}}+${t}\equiv${resid}+${t}=${resid + t}\equiv0\pmod{${m}}$, czyli $${m}\mid${a}^{${expT}}+${t}$ dla każdego $n\in\mathbb N$. $\blacksquare$`, `$${resid + t}$ dzieli się przez $${m}$.`, [T`$${resid + t}$`, 'To prawda, ale trzeba jeszcze zauważyć, że $' + (resid + t) + '\\equiv0$.'], [T`$${t}$`, 'Zapomniana reszta potęgi.'])],
      [[red, 'redukcja podstawy z uzasadnieniem'], [T`$${a}^{${expT}}+${t}\equiv${resid}+${t}\equiv0\pmod{${m}}$, więc $${m}\mid${a}^{${expT}}+${t}$. $\blacksquare$`, 'wniosek']],
      ['Pisanie „$=$” zamiast „$\\equiv$” — to różne rzeczy.', ...(s < 0 ? [T`Warto dopisać, że dla $n\geq1$ wykładnik $${expT}$ jest naturalny.`] : [])]);
    const ind = M('Indukcja', 'Klasyczna metoda — dłuższa, ale zawsze działa; wyrażamy $A_{n+1}$ przez $A_n$.', T`Oznacz $A_n=${a}^{${expT}}+${t}$. Wtedy $A_{n+1}=${a}^{${k}}A_n-${t}\left(${a}^{${k}}-1\right)$ i oba składniki dzielą się przez $${m}$.`,
      [S('Baza', T`Co sprawdzamy w bazie?`, T`$n=1$: $${a}^{${k + s}}+${t}=${big(base1)}=${m}\cdot${big(q1)}$`, T`Baza: dla $n=1$: $\ ${a}^{${k + s}}+${t}=${big(base1)}=${m}\cdot${big(q1)}$.`, 'Bez bazy indukcja nie ma od czego wystartować — za brak bazy odejmują punkty.', [T`$n=0$`, T`Teza jest dla $n\in\mathbb N$, zaczynamy od $n=1$${s < 0 ? ' (dla $n=0$ wykładnik byłby ujemny)' : ''}.`], [T`Bazy nie trzeba, bo krok wystarczy`, 'Bez bazy „dowodzi się” też fałszywych twierdzeń.']),
       S('Krok', T`Jak wyrazić $A_{n+1}$ przez $A_n=${a}^{${expT}}+${t}$?`, T`$A_{n+1}=${a}^{${k}}\cdot A_n-${t}\left(${a}^{${k}}-1\right)$`, T`Załóżmy, że $${m}\mid A_n$. Wtedy $A_{n+1}=${a}^{${k}}\cdot${a}^{${expT}}+${t}=${a}^{${k}}\left(A_n-${t}\right)+${t}=${a}^{${k}}A_n-${t}\left(${a}^{${k}}-1\right)$.`, T`Wyciągamy $${a}^{${k}}$ i „dorabiamy” $A_n$, odejmując to, co dodaliśmy.`, [T`$A_{n+1}=A_n+${a}^{${k}}$`, 'Potęgi się mnożą, a nie dodają.'], [T`$A_{n+1}=${a}A_n$`, T`Wykładnik rośnie o $${k}$, więc wychodzi $${a}^{${k}}$, a stała $${t}$ też się zmienia.`]),
       S('Zakończenie', T`Dlaczego $${m}\mid A_{n+1}$?`, T`$${m}\mid A_n$ (założenie) i $${m}\mid ${t}(${a}^{${k}}-1)=${big(tak)}$`, T`$${m}\mid A_n$ z założenia, a $${t}\left(${a}^{${k}}-1\right)=${big(tak)}=${m}\cdot${big(tak / BigInt(m))}$. Zatem $${m}\mid A_{n+1}$ i na mocy zasady indukcji teza zachodzi dla każdego $n\in\mathbb N$. $\blacksquare$`, 'Zdanie „na mocy zasady indukcji…” zamyka dowód — warto je napisać.', [T`Bo $A_{n+1}>A_n$`, 'Wielkość liczby nic nie mówi o podzielności.'], [T`Bo $${m}\mid${a}^{${k}}$`, T`$${a}^{${k}}$ nie dzieli się przez $${m}$.`])],
      [[T`Baza ($n=1$): $${a}^{${k + s}}+${t}=${big(base1)}=${m}\cdot${big(q1)}$.`, 'baza'], [T`Założenie: $${m}\mid A_n=${a}^{${expT}}+${t}$.`, 'jawne założenie indukcyjne'], [T`Krok: $A_{n+1}=${a}^{${k}}A_n-${t}\left(${a}^{${k}}-1\right)$, a $${m}\mid A_n$ i $${m}\mid${big(tak)}$.`, 'wykorzystanie założenia'], [T`Na mocy zasady indukcji $${m}\mid A_n$ dla każdego $n\in\mathbb N$. $\blacksquare$`, 'zakończenie']],
      ['Brak bazy albo założenia zapisanego wprost.', 'Krok, w którym nie widać użycia założenia indukcyjnego.']);
    return proof('', 'f1', q, [kong, ind]);
  }
  function powProofB(m, b, s, c, r) { // m | b^{n+s} + c^{2n+r}, c² ≡ b (mod m)
    const c2 = c * c, w = (c2 - b) / m, base1 = pw(b, 1 + s) + pw(c, 2 + r), q1 = base1 / BigInt(m), bs = pw(b, s), cr = pw(c, r);
    const E = T`${b}^{n+${s}}+${c}^{2n+${r}}`.replace(/\^\{n\+0\}/, '^{n}').replace(/\^\{2n\+0\}/, '^{2n}');
    const q = T`Udowodnij, że dla każdego $n\in\mathbb N$: $\ ${m}\mid ${E}$.`;
    const kong = M('Kongruencje', 'Dwie potęgi — sprowadź je do wspólnej podstawy modulo ' + m + '.', T`$${c}^2=${c2}\equiv${b}\pmod{${m}}$, więc $${c}^{2n}$ zachowuje się jak $${b}^n$ i obie potęgi mają wspólny czynnik $${b}^n$.`,
      [S('Wspólna podstawa', T`Jaka jest reszta $${c}^2$ modulo $${m}$?`, T`$${c}^2=${c2}\equiv${b}\pmod{${m}}$`, T`$${c}^2=${c2}=${b}+${m}\cdot${w}\equiv${b}\pmod{${m}}$, więc $${c}^{2n+${r}}=${c}^{${r}}\left(${c}^2\right)^n\equiv${cr}\cdot${b}^n$.`, 'Szukamy związku między podstawami — tu kwadrat jednej daje drugą.', [T`$${c}^2\equiv1$`, T`$${c2}-1$ nie dzieli się przez $${m}$.`], [T`$${c}\equiv${b}$`, 'Same podstawy są różne modulo ' + m + '.']),
       S('Wyciągnięcie wspólnego czynnika', 'Ile wynosi całe wyrażenie modulo ' + m + '?', '$0$', T`$${E}\equiv${bs}\cdot${b}^n+${cr}\cdot${b}^n=${bs + cr}\cdot${b}^n=${m}\cdot${(bs + cr) / BigInt(m)}\cdot${b}^n\equiv0\pmod{${m}}$. $\blacksquare$`, `$${bs}+${cr}=${bs + cr}$ to wielokrotność $${m}$.`, [T`$${b}^n$`, 'Zostaje jeszcze współczynnik ' + (bs + cr) + ', a on dzieli się przez ' + m + '.'], ['Nie da się określić', 'Wyciągnięcie $' + b + '^n$ przed nawias wszystko załatwia.'])],
      [[T`$${c}^2=${c2}\equiv${b}\pmod{${m}}$.`, 'kluczowa kongruencja'], [T`$${E}\equiv(${bs}+${cr})\,${b}^n=${m}\cdot${(bs + cr) / BigInt(m)}\cdot${b}^n\equiv0\pmod{${m}}$. $\blacksquare$`, 'rachunek i wniosek']],
      ['Rachunek bez zapisu „(mod ' + m + ')”.']);
    const ind = M('Indukcja', 'Klasyczna metoda: $A_{n+1}=' + b + 'A_n+(' + c + '^2-' + b + ')\\cdot(\\ldots)$.', T`$A_{n+1}=${b}\cdot A_n+\left(${c}^2-${b}\right)${c}^{2n+${r}}$, a $${c}^2-${b}=${c2 - b}=${m}\cdot${w}$.`,
      [S('Baza', 'Co sprawdzamy w bazie?', T`$n=1$: $${big(base1)}=${m}\cdot${big(q1)}$`, T`Baza: $n=1$: $\ ${b}^{${1 + s}}+${c}^{${2 + r}}=${big(base1)}=${m}\cdot${big(q1)}$.`, 'Policz dokładnie i pokaż iloraz.', ['$n=0$', 'Teza jest dla $n\\in\\mathbb N$, start od $n=1$.'], ['Bazy nie trzeba', 'Bez bazy indukcja niczego nie dowodzi.']),
       S('Krok', T`Jak zapisać $A_{n+1}$ przez $A_n$?`, T`$A_{n+1}=${b}A_n+\left(${c}^2-${b}\right)${c}^{2n+${r}}$`, T`Niech $${m}\mid A_n$. Wtedy $A_{n+1}=${b}\cdot${b}^{n+${s}}+${c}^2\cdot${c}^{2n+${r}}=${b}A_n+\left(${c}^2-${b}\right)${c}^{2n+${r}}=${b}A_n+${m}\cdot${w}\cdot${c}^{2n+${r}}$.`, T`Dodajemy i odejmujemy $${b}\cdot${c}^{2n+${r}}$, żeby pojawiło się $A_n$.`, [T`$A_{n+1}=${b}A_n$`, 'Druga potęga rośnie o czynnik $' + c + '^2$, a nie $' + b + '$.'], [T`$A_{n+1}=${c}^2A_n$`, 'Pierwsza potęga rośnie tylko o czynnik $' + b + '$.']),
       S('Zakończenie', 'Dlaczego $' + m + '\\mid A_{n+1}$?', 'Oba składniki dzielą się przez ' + m, T`$${m}\mid A_n$ z założenia i $${m}\mid${m}\cdot${w}\cdot${c}^{2n+${r}}$, więc $${m}\mid A_{n+1}$. Na mocy zasady indukcji teza zachodzi dla każdego $n\in\mathbb N$. $\blacksquare$`, 'Zdanie o zasadzie indukcji zamyka dowód.', ['Bo $A_{n+1}$ jest większe', 'Wielkość nie ma związku z podzielnością.'], ['Bo $' + c + '$ dzieli się przez $' + m + '$', 'Nie dzieli się.'])],
      [[T`Baza: $n=1$: $${big(base1)}=${m}\cdot${big(q1)}$.`, 'baza'], [T`Założenie: $${m}\mid A_n=${E}$.`, 'założenie'], [T`$A_{n+1}=${b}A_n+${m}\cdot${w}\cdot${c}^{2n+${r}}$.`, 'krok z użyciem założenia'], ['Na mocy zasady indukcji teza zachodzi dla każdego $n\\in\\mathbb N$. $\\blacksquare$', 'zakończenie']],
      ['Brak bazy lub zakończenia.']);
    return proof('', 'f2', q, [kong, ind]);
  }
  function powProofC(qq, c) { // qq² | (1+qq)^n + c n − 1, c ≡ −qq (mod qq²)
    const m = qq * qq, a = 1 + qq, base1 = a + c - 1;
    const E = T`${a}^n+${c}n-1`;
    const q = T`Udowodnij, że dla każdego $n\in\mathbb N$: $\ ${m}\mid ${E}$.`;
    const kong = M('Kongruencje i dwumian', 'Podstawa to $1+' + qq + '$, a moduł $' + qq + '^2$ — rozwiń dwumian i odrzuć wyrazy z $' + qq + '^2$.', T`$${a}^n=(1+${qq})^n=1+${qq}n+\binom n2${qq}^2+\ldots\equiv1+${qq}n\pmod{${m}}$.`,
      [S('Dwumian', T`Jaka jest reszta $${a}^n$ modulo $${m}$?`, T`$${a}^n\equiv1+${qq}n\pmod{${m}}$`, T`Z dwumianu Newtona: $${a}^n=(1+${qq})^n=1+${qq}n+\binom n2${qq}^2+\binom n3${qq}^3+\ldots\equiv1+${qq}n\pmod{${m}}$, bo pozostałe wyrazy mają czynnik $${qq}^2=${m}$.`, 'Każdy wyraz od trzeciego w górę zawiera $' + qq + '^2$.', [T`$${a}^n\equiv1$`, T`Wyraz $${qq}n$ nie znika modulo $${m}$.`], [T`$${a}^n\equiv${a}$`, 'To tylko dla $n=1$.']),
       S('Wniosek', 'Ile wynosi całe wyrażenie modulo ' + m + '?', '$0$', T`$${E}\equiv1+${qq}n+${c}n-1=${qq + c}n\equiv0\pmod{${m}}$, bo $${qq + c}=${m}\cdot${(qq + c) / m}$. $\blacksquare$`, '$' + qq + '+' + c + '$ dzieli się przez $' + m + '$.', [T`$${c}n$`, 'Zapomniany wyraz $' + qq + 'n$ z dwumianu.'], [T`$${qq}n$`, 'Zapomniany wyraz $' + c + 'n$.'])],
      [[T`$${a}^n=(1+${qq})^n\equiv1+${qq}n\pmod{${m}}$ (pozostałe wyrazy dwumianu zawierają $${qq}^2$).`, 'dwumian z uzasadnieniem'], [T`$${E}\equiv${qq + c}n\equiv0\pmod{${m}}$. $\blacksquare$`, 'wniosek']],
      ['Brak uzasadnienia, czemu reszta wyrazów dwumianu znika modulo ' + m + '.']);
    const ind = M('Indukcja', 'Klasyczna metoda — tu wygodniejsza niż kongruencje dla wielu osób.', T`$A_{n+1}=${a}A_n-${m}\left(${(qq * c) / m}n-${(qq + c) / m}\right)$ — oba składniki dzielą się przez $${m}$.`,
      [S('Baza', 'Co sprawdzamy w bazie?', T`$n=1$: $${a}+${c}-1=${base1}=${m}\cdot${base1 / m}$`, T`Baza: $n=1$: $\ ${a}+${c}-1=${base1}=${m}\cdot${base1 / m}$.`, 'Policz i pokaż iloraz.', ['$n=0$', 'Start od $n=1$ — teza dla $n\\in\\mathbb N$.'], ['Bazy nie trzeba', 'Bez bazy indukcja nic nie daje.']),
       S('Krok', 'Jak zapisać $A_{n+1}$ przez $A_n$?', T`$A_{n+1}=${a}A_n-${qq * c}n+${qq + c}$`, T`Niech $${m}\mid A_n$. $A_{n+1}=${a}\cdot${a}^n+${c}(n+1)-1=${a}\left(A_n-${c}n+1\right)+${c}n+${c - 1}=${a}A_n-${qq * c}n+${qq + c}$.`, 'Podstawiamy $' + a + '^n=A_n-' + c + 'n+1$ i porządkujemy.', [T`$A_{n+1}=${a}A_n+${c}$`, 'Zapomniane wyrazy z $n$.'], [T`$A_{n+1}=A_n+${a}^n$`, 'Potęga mnoży się przez ' + a + ', nie dodaje.']),
       S('Zakończenie', 'Dlaczego $' + m + '\\mid A_{n+1}$?', T`$${qq * c}$ i $${qq + c}$ dzielą się przez $${m}$`, T`$-${qq * c}n+${qq + c}=-${m}\left(${(qq * c) / m}n-${(qq + c) / m}\right)$, a $${m}\mid A_n$ z założenia. Zatem $${m}\mid A_{n+1}$ i na mocy zasady indukcji teza zachodzi dla każdego $n$. $\blacksquare$`, 'Wyciągnij ' + m + ' przed nawias — to pokazuje podzielność.', ['Bo $A_{n+1}$ jest większe', 'To nie argument.'], ['Bo $' + a + '$ dzieli się przez $' + m + '$', 'Nie dzieli się.'])],
      [[T`Baza: $n=1$: $${base1}=${m}\cdot${base1 / m}$.`, 'baza'], [T`Założenie: $${m}\mid A_n=${E}$.`, 'założenie'], [T`$A_{n+1}=${a}A_n-${m}\left(${(qq * c) / m}n-${(qq + c) / m}\right)$.`, 'krok'], ['Na mocy zasady indukcji teza zachodzi dla każdego $n$. $\\blacksquare$', 'zakończenie']],
      ['Błąd przy porządkowaniu wyrazów w kroku — sprawdź rachunek na $n=1$.']);
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
      steps: [T`Dzielimy wielomian przez $${divT}$ z resztą: reszta to $W(${root})=${Wr}$ (twierdzenie o reszcie), czyli $${P}=(${divT})\cdot Q(n)${Wr < 0 ? Wr : '+' + Wr}$ z całkowitym $Q$.`, T`Stąd $${divT}\mid W(n)\iff ${divT}\mid ${Wr}$. Dzielniki $${Math.abs(Wr)}$: $\pm${divs(Wr).join(',\\pm')}$.`, T`$${divT}$ przyjmuje te wartości, a $n\geq1$ (przyjmujemy $\mathbb N=\{1,2,\ldots\}$): $${setT(sol)}$.`, 'Na koniec warto sprawdzić jeden wynik podstawieniem.'],
      wrong: [[setT(pos), r < 0 ? 'Dzielnik $' + divT + '$ może być ujemny — wtedy też dzieli.' : 'Sprawdź, które dzielniki dają $n\\geq1$.'], [setT([...new Set(divs(W3(co, -root)).map(d => d - r).filter(n => n >= 1))].sort((x, y) => x - y)), T`Reszta to $W(${root})$, a nie $W(${-root})$ — podstawiamy pierwiastek dzielnika.`], [setT(sol.filter((_, i) => i !== sol.length - 1)), 'Pominięty największy dzielnik.'], [setT([...sol, sol.length ? sol[sol.length - 1] + 1 : 1]), 'Sprawdź podstawieniem — ta wartość nie spełnia warunku.']] });
  }
  function genPoly() { for (;;) { const co = [1, R.int(-9, 9), R.int(-9, 9), R.int(-12, 12)], r = R.pick([1, 2, 3, -1, -2, -3, -5, -7]); const Wr = W3(co, -r); if (!Wr || Math.abs(Wr) > 60 || divs(Wr).length < 3) continue; const it = polyDiv(co, r); if (/brak/.test(it.mcCorrect)) continue; return it; } }
  // 3(c): przez iloczyn (n−7)(n+2)
  const item3c = mk({ gk: 'prod', field: txtField(), q: T`Dla jakich liczb naturalnych $n$ liczba $n^3-7n^2-5n+10$ jest podzielna przez $n^2-5n-14$?`, tex: setT([2, 6]),
    steps: [T`$n^2-5n-14=(n-7)(n+2)$. Jeśli iloczyn dzieli $W(n)$, to dzieli też każdy czynnik — więc $n$ musi spełniać (a) i (b).`, T`Z (a): $n\in\{2,6,14\}$, z (b): $n\in\{2,6,8,12,32\}$. Część wspólna: $n\in\{2,6\}$.`, T`To tylko warunek konieczny — sprawdzamy: $n=2$: $W=-20$, $n^2-5n-14=-20$ ✓; $n=6$: $W=-56$, dzielnik $-8$, $-56=7\cdot(-8)$ ✓.`, T`Odpowiedź: $n\in\{2,6\}$.`],
    wrong: [[setT([2, 6, 8, 12, 14, 32]), 'To suma zbiorów — a muszą zachodzić oba warunki naraz.'], [setT([2]), T`$n=6$ też spełnia: $-56=7\cdot(-8)$.`], [setT([6, 14]), 'Sprawdź $n=2$: $-20=1\\cdot(-20)$.']] });

  /* ===== 4: (n² + a)/(n + b) całkowite ===== */
  function fracInt(a, b) {
    const v = b * b + a, sol = [...new Set(divs(v).flatMap(d => [d - b, -d - b]))].sort((x, y) => x - y);
    const pos = [...new Set(divs(v).map(d => d - b))].sort((x, y) => x - y);
    const bt = b > 0 ? `+${b}` : `-${-b}`;
    return mk({ gk: 'frac', field: txtField(), q: T`Znajdź wszystkie liczby całkowite $n$, dla których $\frac{n^2+${a}}{n${bt}}$ jest liczbą całkowitą.`, tex: T`n\in\{${sol.join(',\\ ')}\}`,
      steps: [T`Dzielimy z resztą: $n^2+${a}=(n${bt})(n${b > 0 ? '-' + b : '+' + -b})+${v}$.`, T`Zatem $\frac{n^2+${a}}{n${bt}}=n${b > 0 ? '-' + b : '+' + -b}+\frac{${v}}{n${bt}}$ — całkowite $\iff n${bt}\mid${v}$.`, T`$n${bt}\in\{\pm${divs(v).join(',\\pm')}\}$, czyli $n\in\{${sol.join(',\\ ')}\}$.`, 'Liczby całkowite — więc ujemne dzielniki też się liczą.'],
      wrong: [[T`n\in\{${pos.join(',\\ ')}\}`, 'Pominięte ujemne dzielniki — $n$ jest całkowite, więc $n' + bt + '$ może być ujemne.'], [T`n\in\{${[...new Set(divs(Math.abs(a - b * b) || 1).flatMap(d => [d - b, -d - b]))].sort((x, y) => x - y).join(',\\ ')}\}`, T`Reszta to $b^2+a=${v}$ (podstaw $n=${-b}$ do licznika).`], [T`n\in\{${sol.filter(x => x !== sol[0]).join(',\\ ')}\}`, 'Brakuje jednego rozwiązania — sprawdź wszystkie dzielniki.']] });
  }
  const genFrac = () => { for (;;) { const a = R.int(1, 12), b = R.pick([1, 2, 3, -1, -2, -3]); if (divs(b * b + a).length >= 2) return fracInt(a, b); } };

  /* ===== 5, 6: sprzeczne reszty ===== */
  function resProof(m1, r1, m2, r2) {
    const d = gcd(m1, m2), q = T`Wykaż, że nie istnieje liczba naturalna, która przy dzieleniu przez $${m1}$ daje resztę $${r1}$, a przy dzieleniu przez $${m2}$ resztę $${r2}$.`;
    const A1 = M('Reszty modulo NWD', T`Moduły $${m1}$ i $${m2}$ mają wspólny dzielnik $${d}$ — porównaj reszty modulo $${d}$.`, T`$(${m1},${m2})=${d}$. Obie informacje mówią coś o reszcie z dzielenia przez $${d}$ — i mówią różne rzeczy.`,
      [S('Wspólny dzielnik', 'Przez jaką liczbę warto popatrzeć?', T`Przez $(${m1},${m2})=${d}$`, T`Przypuśćmy, że takie $x$ istnieje. Mamy $(${m1},${m2})=${d}$, więc $${d}\mid${m1}$ i $${d}\mid${m2}$.`, 'Dowód nie wprost: zakładamy, że liczba istnieje, i szukamy sprzeczności.', [T`Przez $${m1 * m2}$`, 'Iloczyn modułów nic tu nie daje.'], [T`Przez $${m1}$`, 'Potrzebujemy liczby, która dzieli oba moduły.']),
       S('Reszty', T`Jakie reszty modulo $${d}$ wynikają z obu warunków?`, T`$${r1 % d}$ i $${r2 % d}$ — różne`, T`$x=${m1}k+${r1}$, więc $x\equiv${r1}\equiv${r1 % d}\pmod{${d}}$; $x=${m2}l+${r2}$, więc $x\equiv${r2}\equiv${r2 % d}\pmod{${d}}$.`, T`$${d}\mid${m1}$, więc $${m1}k$ znika modulo $${d}$.`, [T`Obie równe $0$`, 'Policz reszty $' + r1 + '$ i $' + r2 + '$ modulo ' + d + '.'], [T`$${r1}$ i $${r2}$`, 'To reszty z dzielenia przez ' + m1 + ' i ' + m2 + ', a nie przez ' + d + '.']),
       S('Sprzeczność', 'Co z tego wynika?', 'Sprzeczność — liczba nie może mieć dwóch różnych reszt', T`Liczba $x$ ma jedną resztę z dzielenia przez $${d}$, a dostaliśmy $${r1 % d}\neq${r2 % d}$ — sprzeczność. Taka liczba nie istnieje. $\blacksquare$`, 'Reszta z dzielenia jest wyznaczona jednoznacznie.', ['Że $x$ jest ujemne', 'Nic takiego nie wynika — wynika sprzeczność.'], ['Że $x=0$', 'Zero też ma jedną resztę.'])],
      [[T`Przypuśćmy, że $x=${m1}k+${r1}=${m2}l+${r2}$ dla pewnych $k,l\in\mathbb Z$.`, 'założenie nie wprost'], [T`$${d}=(${m1},${m2})$ dzieli $${m1}$ i $${m2}$, więc $x\equiv${r1 % d}$ oraz $x\equiv${r2 % d}\pmod{${d}}$.`, 'redukcja do modułu ' + d], [T`$${r1 % d}\neq${r2 % d}$ — sprzeczność. $\blacksquare$`, 'sprzeczność']],
      ['Brak zdania „przypuśćmy, że istnieje” — dowód nie wprost musi to mieć.']);
    const A2 = M('Równanie liniowe', 'Zapisz oba warunki równaniem i porównaj podzielność stron.', T`$${m1}k+${r1}=${m2}l+${r2}$ daje $${m1}k-${m2}l=${r2 - r1}$; lewa strona dzieli się przez $${d}$, prawa nie.`,
      [S('Równanie', 'Jak zapisać oba warunki?', T`$x=${m1}k+${r1}=${m2}l+${r2}$`, T`Przypuśćmy, że $x$ istnieje: $x=${m1}k+${r1}=${m2}l+${r2}$, $k,l\in\mathbb Z$, czyli $${m1}k-${m2}l=${r2 - r1}$.`, 'Definicja reszty: $x=mq+r$.', [T`$x=${m1}+${r1}$`, 'Brakuje ilorazu $k$.'], [T`$x=${r1}\cdot${r2}$`, 'To nie wynika z warunków.']),
       S('Podzielność stron', 'Co dzieli lewą stronę?', T`$${d}$, a prawej strony $${r2 - r1}$ nie dzieli`, T`$${d}\mid${m1}k-${m2}l$, ale $${d}\nmid${r2 - r1}$ — sprzeczność. Taka liczba nie istnieje. $\blacksquare$`, T`$${d}$ dzieli oba współczynniki, więc dzieli całą lewą stronę.`, [T`$${m1}$`, 'Nie dzieli $' + m2 + 'l$.'], ['Nic', T`$${d}$ dzieli oba współczynniki.`])],
      [[T`$${m1}k+${r1}=${m2}l+${r2}\Rightarrow${m1}k-${m2}l=${r2 - r1}$.`, 'zapis warunków'], [T`$${d}\mid L$, $${d}\nmid${r2 - r1}$ — sprzeczność. $\blacksquare$`, 'sprzeczność']],
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
      [S('Szukamy mnożnika', T`Przez co pomnożyć $${lin(a, b)}$, żeby współczynniki dały $${c},${d}$ modulo $${m}$?`, T`Przez $${k}$: $${k}\cdot${a}=${k * a}\equiv${c}$, $${k}\cdot${b}=${k * b}\equiv${d}\pmod{${m}}$`, T`$${k}(${lin(a, b)})=${lin(k * a, k * b)}$, a $${k * a}\equiv${c}$, $${k * b}\equiv${d}\pmod{${m}}$.`, 'Szukamy $t$ z $t\\cdot' + a + '\\equiv' + c + '$ i sprawdzamy, czy pasuje też drugi współczynnik.', [T`Przez $${c}$`, T`$${c}\cdot${a}=${c * a}\not\equiv${c}$.`], ['Przez $' + m + '$', 'Wtedy wszystko jest podzielne przez ' + m + ', ale nie dostajemy wyrażenia z tezy.']),
       S('Tożsamość', 'Jaka tożsamość z tego wychodzi?', T`$${lin(c, d)}=${k}(${lin(a, b)})-${m}(${lin(u, v)})$`, T`$${lin(c, d)}=${k}(${lin(a, b)})-${m}(${lin(u, v)})$.`.replace(/\+-/g, '-'), 'Sprawdź wymnażając: $' + k + '\\cdot' + a + '-' + m + '\\cdot' + u + '=' + c + '$.', [T`$${lin(c, d)}=${k}(${lin(a, b)})$`, 'Brakuje poprawki z wielokrotnością ' + m + '.'], [T`$${lin(c, d)}=(${lin(a, b)})+${m}x$`, 'Współczynniki się nie zgadzają.']),
       S('Wniosek', 'Dlaczego ' + m + ' dzieli prawą stronę?', 'Bo dzieli oba składniki', T`Z założenia $${lin(a, b)}=${m}s$, $s\in\mathbb Z$. Wtedy $${lin(c, d)}=${m}\left(${k}s-(${lin(u, v)})\right)$, a nawias jest całkowity. Zatem $${m}\mid${lin(c, d)}$. $\blacksquare$`.replace(/\+-/g, '-'), 'Wyciągnięcie ' + m + ' przed nawias i stwierdzenie, że nawias jest całkowity — za to jest punkt.', ['Bo $x,y$ dzielą się przez ' + m, 'Nic takiego nie wiemy — tylko kombinacja się dzieli.'], ['Bo $' + k + '$ dzieli się przez ' + m, 'Nie dzieli się.'])],
      [[T`Z założenia $${lin(a, b)}=${m}s$ dla pewnego $s\in\mathbb Z$.`, 'zapis założenia'], [T`$${lin(c, d)}=${k}(${lin(a, b)})-${m}(${lin(u, v)})=${m}\left(${k}s-${lin(u, v)}\right)$.`.replace(/\+-/g, '-'), 'tożsamość'], [T`Nawias jest liczbą całkowitą, więc $${m}\mid${lin(c, d)}$. $\blacksquare$`, 'wniosek']],
      ['Tożsamość bez sprawdzenia — jeden błąd rachunkowy i cały dowód leży.', 'Brak stwierdzenia, że nawias jest całkowity.']);
    const A2 = M('Mnożenie i względna pierwszość', 'Pomnóż tezę przez liczbę względnie pierwszą z ' + m + ', żeby dostać założenie.', T`$${j}(${lin(c, d)})=(${lin(a, b)})+${m}(${lin(u2, v2)})$, a $(${j},${m})=1$.`,
      [S('Mnożnik', T`Przez co pomnożyć $${lin(c, d)}$, żeby pojawiło się $${lin(a, b)}$?`, T`Przez $${j}$`, T`$${j}(${lin(c, d)})=${lin(j * c, j * d)}=(${lin(a, b)})+${m}(${lin(u2, v2)})$.`.replace(/\+-/g, '-'), 'Szukamy $j$ z $j\\cdot' + c + '\\equiv' + a + '\\pmod{' + m + '}$.', [T`Przez $${a}$`, 'Współczynniki się nie zgodzą.'], ['Przez $' + m + '$', 'To nic nie daje.']),
       S('Podzielność iloczynu', 'Co wiemy o $' + j + '(' + lin(c, d) + ')$?', T`Dzieli się przez $${m}$`, T`Prawa strona dzieli się przez $${m}$ (pierwszy składnik z założenia), więc $${m}\mid${j}(${lin(c, d)})$.`, 'Suma wielokrotności ' + m + ' jest wielokrotnością ' + m + '.', ['Nie wiadomo', 'Oba składniki prawej strony dzielą się przez ' + m + '.'], ['Dzieli się przez $' + j + m + '$', 'Tylko przez ' + m + '.']),
       S('Względna pierwszość', 'Jak pozbyć się czynnika $' + j + '$?', T`$(${j},${m})=1$, więc $${m}\mid${lin(c, d)}$`, T`Ponieważ $(${j},${m})=1$, z $${m}\mid${j}(${lin(c, d)})$ wynika $${m}\mid${lin(c, d)}$. $\blacksquare$`, 'Lemat: jeśli $m\\mid ab$ i $(a,m)=1$, to $m\\mid b$ — trzeba go przywołać.', ['Dzielimy przez ' + j, 'Dzielenie trzeba uzasadnić względną pierwszością.'], ['Nie da się', 'Da się — bo $(' + j + ',' + m + ')=1$.'])],
      [[T`$${j}(${lin(c, d)})=(${lin(a, b)})+${m}(${lin(u2, v2)})$, więc $${m}\mid${j}(${lin(c, d)})$.`.replace(/\+-/g, '-'), 'tożsamość'], [T`$(${j},${m})=1$, zatem $${m}\mid${lin(c, d)}$. $\blacksquare$`, 'względna pierwszość — wprost']],
      ['Brak argumentu o względnej pierwszości — bez niego krok jest niepoprawny.']);
    return proof('', 'komb', q, [A1, A2]);
  }
  function genComb() { for (;;) { const m = R.pick([7, 11, 13, 17, 19, 23, 35]); const a = R.int(1, m - 1), b = R.int(1, m - 1), k = R.int(2, m - 2); if (gcd(k, m) !== 1 || gcd(a, m) !== 1) continue; const c = md(k * a, m), d = md(k * b, m); if (!c || !d || (c === a && d === b) || gcd(c, m) !== 1) continue; return combProof(m, a, b, c, d); } }

  /* ===== 9: z = x+y ⇒ x,y,z | z^e − x^e − y^e ===== */
  function sumProof(e) {
    const f = e === 3 ? T`3xy(x+y)` : T`5xy(x+y)(x^2+xy+y^2)`;
    const q = T`Niech $x,y\in\mathbb Z$ i $z=x+y$. Pokaż, że każda z liczb $x,y,z$ dzieli $z^{${e}}-x^{${e}}-y^{${e}}$.`;
    const A1 = M('Rozkład na czynniki', 'Wyrażenie, w którym coś się skraca — rozwiń i wyciągnij wspólne czynniki.', T`$(x+y)^{${e}}-x^{${e}}-y^{${e}}=${f}=${e === 3 ? '3xyz' : '5xyz(x^2+xy+y^2)'}$ — jawnie widać czynniki $x,y,z$.`,
      [S('Rozwinięcie', T`Ile wynosi $(x+y)^{${e}}-x^{${e}}-y^{${e}}$?`, e === 3 ? T`$3x^2y+3xy^2=3xy(x+y)$` : T`$5xy(x+y)(x^2+xy+y^2)$`, e === 3 ? T`$z^3-x^3-y^3=(x+y)^3-x^3-y^3=3x^2y+3xy^2=3xy(x+y)=3xyz$.` : T`$z^5-x^5-y^5=5x^4y+10x^3y^2+10x^2y^3+5xy^4=5xy(x^3+2x^2y+2xy^2+y^3)=5xy(x+y)(x^2+xy+y^2)$.`, 'Wyrazy $x^' + e + '$ i $y^' + e + '$ się skracają.', [e === 3 ? T`$3xy$` : T`$5xy$`, 'Zgubiony czynnik $(x+y)$.'], [T`$0$`, 'Wyrazy mieszane z dwumianu zostają.']),
       S('Wniosek', 'Dlaczego każda z liczb $x,y,z$ dzieli to wyrażenie?', 'Bo jest jego czynnikiem', T`$z^{${e}}-x^{${e}}-y^{${e}}=${e === 3 ? 'x\\cdot(3yz)=y\\cdot(3xz)=z\\cdot(3xy)' : 'x\\cdot(5yz\\,Q)=y\\cdot(5xz\\,Q)=z\\cdot(5xy\\,Q)'}$${e === 3 ? '' : ', gdzie $Q=x^2+xy+y^2\\in\\mathbb Z$'}, a nawiasy są całkowite, więc $x,y,z$ dzielą to wyrażenie. $\blacksquare$`, 'Definicja: $a\\mid b \\iff b=a\\cdot c$ dla pewnego całkowitego $c$ — także gdy $a=0$ i $b=0$.', ['Tylko gdy $x,y\\neq0$', 'Dla $x=0$ wyrażenie to $0$, a $0\\mid0$ — wszystko się zgadza.'], ['Bo $x,y,z$ są pierwsze', 'Nie zakładamy tego.'])],
      [[e === 3 ? T`$z^3-x^3-y^3=(x+y)^3-x^3-y^3=3xy(x+y)=3xyz$.` : T`$z^5-x^5-y^5=5xy(x+y)(x^2+xy+y^2)=5xyzQ$.`, 'rozwinięcie i rozkład'], [T`Wyrażenie jest postaci $x\cdot(\ldots)$, $y\cdot(\ldots)$, $z\cdot(\ldots)$ z całkowitymi nawiasami, więc $x,y,z$ go dzielą. $\blacksquare$`, 'wniosek z definicji podzielności']],
      ['Pominięcie uzasadnienia, że nawiasy są całkowite.']);
    return proof('', 'sum3', q, [A1]);
  }

  /* ===== 10 ===== */
  const it10 = proof('1.10', 'ab', T`Pokaż, że jeśli każda z liczb $a,b,c,d\in\mathbb N$ dzieli się przez $ab-cd$, to $|ab-cd|=1$.`, [M('Kwadrat dzielnika', 'Jeśli $k$ dzieli $a$ i $b$, to $k^2$ dzieli $ab$.', T`Oznacz $k=ab-cd$. Wtedy $k^2\mid ab$ i $k^2\mid cd$, więc $k^2\mid ab-cd=k$.`,
    [S('Oznaczenie', 'Co oznaczyć literą?', '$k=ab-cd$', T`Niech $k=ab-cd$. Z założenia $k\mid a,\ k\mid b,\ k\mid c,\ k\mid d$; ponieważ $a\neq0$, mamy $k\neq0$ (zero dzieli tylko zero).`, 'Warto od razu wykluczyć $k=0$.', ['$k=a+b$', 'Nie o tę liczbę chodzi.'], ['$k=(a,b)$', 'Teza mówi o $ab-cd$.']),
     S('Kwadrat', 'Co wynika z $k\\mid a$ i $k\\mid b$?', '$k^2\\mid ab$ (i tak samo $k^2\\mid cd$)', T`$a=ka',\ b=kb'$, więc $ab=k^2a'b'$, czyli $k^2\mid ab$; analogicznie $k^2\mid cd$. Zatem $k^2\mid ab-cd=k$.`, 'Iloczyn dwóch wielokrotności $k$ jest wielokrotnością $k^2$.', ['$k\\mid ab$ tylko', 'Da się więcej: $k^2\\mid ab$.'], ['$2k\\mid ab$', 'Czynniki się mnożą, nie dodają.']),
     S('Wniosek', 'Co wynika z $k^2\\mid k$ i $k\\neq0$?', '$|k|=1$', T`Skoro $k^2\mid k$ i $k\neq0$, to $k^2\leq|k|$, czyli $|k|\leq1$. Ponieważ $k\neq0$, mamy $|ab-cd|=|k|=1$. $\blacksquare$`, 'Dzielnik niezerowej liczby nie jest od niej większy co do modułu.', ['$k=0$', 'Wykluczyliśmy to na początku.'], ['$k=1$', 'Może być też $k=-1$ — poprawnie: $|k|=1$.'])],
    [[T`Niech $k=ab-cd$; $k\mid a,b,c,d$ i $k\neq0$.`, 'oznaczenie i $k\\neq0$'], [T`$k^2\mid ab$ oraz $k^2\mid cd$, więc $k^2\mid k$.`, 'kluczowa obserwacja'], [T`$k\neq0\Rightarrow k^2\leq|k|\Rightarrow|k|=1$. $\blacksquare$`, 'wniosek']],
    ['Brak uzasadnienia, że $k\\neq0$.', 'Odpowiedź $k=1$ zamiast $|k|=1$.'])]);

  /* ===== opracowanie: metody i wzory ===== */
  const F = {
    m_kong: W('<b>Metoda: kongruencje.</b> Zamiast liczb rachuj na resztach modulo $m$: zredukuj podstawę potęgi, aż dostaniesz $1$ albo coś prostego.', 'Kiedy: potęga z $n$ w wykładniku i stały moduł ($4\\mid5^{5n-2}+3$).', 'Jak: znajdź potęgę podstawy dającą resztę $1$ (np. $5\\equiv1\\pmod4$, $81\\equiv1\\pmod{10}$), wtedy reszta całej potęgi jest stała.', 'Zapis: każda linijka z „$\\pmod m$”, na końcu „$\\equiv0$, więc $m\\mid\\ldots$”.'),
    m_ind: W('<b>Metoda: indukcja dla podzielności.</b> Baza ($n=1$), założenie ($m\\mid A_n$), krok: $A_{n+1}=c\\cdot A_n+(\\text{wielokrotność }m)$.', 'Kiedy: zawsze działa, gdy wyrażenie zależy od $n$ — dobra, gdy kongruencje „nie widać”.', 'Jak: wyciągnij czynnik, z którym rośnie potęga, i „dorób” $A_n$, odejmując nadwyżkę.', 'Zapis: baza z policzoną liczbą, założenie wprost, krok z użyciem założenia, zdanie „na mocy zasady indukcji”.'),
    m_rozk: W('<b>Metoda: rozkład na czynniki.</b> Zapisz wyrażenie jako iloczyn i pokaż, że któryś czynnik się dzieli.', 'Kiedy: wielomian od $n$ (np. $n^3-n=(n-1)n(n+1)$).', 'Typowe: $n^2-1=(n-1)(n+1)$, $a^3\\pm b^3$, iloczyn $k$ kolejnych liczb dzieli się przez $k$.'),
    m_reszty: W('<b>Metoda: wszystkie reszty.</b> Rozważ $n\\equiv0,1,\\ldots,k-1\\pmod k$ i policz wyrażenie w każdym przypadku.', 'Kiedy: mały moduł ($2,3,4,5,6$).', 'Uwaga: nie pomijaj żadnej reszty — za to najczęściej lecą punkty.'),
    m_kontr: W('<b>Metoda: kontrprzykład.</b> Na „czy zawsze…?” odpowiedź „nie” wymaga jednego konkretnego, przeliczonego przykładu.', 'Wybierz najmniejsze $n$, dla którego teza nie zachodzi, i pokaż rachunek.'),
    m_komb: W('<b>Metoda: kombinacja liniowa.</b> Wyraź nowe wyrażenie przez dane: $cx+dy=k(ax+by)-m(\\ldots)$.', 'Kiedy: „jeśli $m\\mid ax+by$, to $m\\mid cx+dy$”.', 'Jak: szukaj $k$ z $k\\cdot a\\equiv c$, $k\\cdot b\\equiv d\\pmod m$; potem sprawdź tożsamość wymnażając.'),
    m_resz: W('<b>Metoda: sprzeczność reszt.</b> Gdy warunki dotyczą dzielenia przez $m_1$ i $m_2$, porównaj reszty modulo $d=(m_1,m_2)$.', 'Jeśli wychodzą różne reszty — taka liczba nie istnieje (dowód nie wprost).'),
    m_poly: W('<b>Metoda: reszta z dzielenia wielomianu.</b> $W(n)=(n-r)Q(n)+W(r)$, więc $n-r\\mid W(n)\\iff n-r\\mid W(r)$.', 'Kiedy: „dla jakich $n$ liczba $W(n)$ dzieli się przez $n\\pm r$”.', 'Potem: wypisz dzielniki $W(r)$ (dodatnie i ujemne!) i odrzuć $n$ spoza dziedziny.'),
    kongr: W('Kongruencje: $a\\equiv b\\pmod m\\iff m\\mid a-b$. Można je dodawać, mnożyć i podnosić do potęgi stronami.', 'Jeśli $a=b+mk$ i $c=d+ml$, to $a+c$, $ac$ różnią się od $b+d$, $bd$ o wielokrotność $m$.'),
    dwumian: W('$(1+q)^n=1+nq+\\binom n2q^2+\\ldots\\equiv1+nq\\pmod{q^2}$.', 'Od trzeciego wyrazu każdy ma czynnik $q^2$.'),
    kolejne: W('Wśród $k$ kolejnych liczb całkowitych jedna dzieli się przez $k$.', 'Dają one $k$ różnych reszt z dzielenia przez $k$, więc jedna z nich to $0$.'),
    wzgl: W('Lemat: jeśli $m\\mid ab$ i $(a,m)=1$, to $m\\mid b$.', 'Wynika z tożsamości Bézouta: $1=ax+my$, więc $b=abx+mby$ — obie części dzielą się przez $m$.'),
    sumdiv: W('Jeśli $d\\mid a$ i $d\\mid b$, to $d\\mid ax+by$ dla dowolnych całkowitych $x,y$.', '$a=da'+"'"+'$, $b=db'+"'"+'$, więc $ax+by=d(a'+"'"+'x+b'+"'"+'y)$.'),
    def: W('Definicja: $a\\mid b\\iff b=a\\cdot c$ dla pewnego $c\\in\\mathbb Z$.', 'W dowodzie zawsze zapisz to jawnie: „$b=ak$ dla pewnego $k\\in\\mathbb Z$”.'),
  };
  const P = (label, it) => Object.assign(it, { label });
  A.addList({
    num: 21, id: 'e1', subject: 'etl', title: 'Lista 1', name: 'Podzielność', hue: 'e1',
    blurb: 'Dowody podzielności: rozkład, reszty, kongruencje, indukcja i kombinacje liniowe.',
    tasks: [
      { id: 'E1.1', name: 'Podzielność $n^p-n$', statement: T`Niech $n\in\mathbb N$. (a) Udowodnij, że $3\mid n^3-n$. (b) Udowodnij, że $5\mid n^5-n$. (c) Czy zawsze $4\mid n^4-n$?`, wzIds: it => ({ kontr: ['m_kontr', 'def'] }[it && it.gk] || ['m_rozk', 'm_reszty', 'kolejne', 'kongr']), gen: gk => (gk === 'kontr' ? genKontr() : genCube(gk)),
        items: [P('(a)', cubeProof(3, 3, -1)), P('(b)', cubeProof(5, 5, -1)), P('(c)', kontr(4))] },
      { id: 'E1.2', name: 'Podzielność potęg', statement: T`Udowodnij, że dla każdego $n\in\mathbb N$: (a) $4\mid5^{5n-2}+3$, (b) $10\mid3^{4n+2}+1$, (c) $133\mid11^{n+2}+12^{2n+1}$, (d) $7\mid2^{n+2}+3^{2n+1}$, (e) $9\mid4^n+15n-1$.`, wzIds: it => ['m_kong', 'm_ind', 'kongr', ...(it && it.gk === 'f3' ? ['dwumian'] : [])], gen: gk => (gk === 'f2' ? genF2() : gk === 'f3' ? genF3() : genF1()),
        items: [P('(a)', powProofA(4, 5, 5, -2, 3, '5n-2')), P('(b)', powProofA(10, 3, 4, 2, 1, '4n+2')), P('(c)', powProofB(133, 11, 2, 12, 1)), P('(d)', powProofB(7, 2, 2, 3, 1)), P('(e)', powProofC(3, 15))] },
      { id: 'E1.3', name: 'Wielomian podzielny przez $n\\pm r$', statement: T`Dla jakich liczb naturalnych $n$ liczba $n^3-7n^2-5n+10$ jest podzielna przez: (a) $n+2$, (b) $n-7$, (c) $n^2-5n-14$?`, wzIds: ['m_poly', 'def'], gen: gk => (gk === 'prod' ? genPoly() : genPoly()),
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
  void norm;
})();
