/* Dowody prowadzone krok po kroku: na każdym kroku wybór „co dalej” (1 poprawny + typowe błędy rozumowania). */
(function () {
  'use strict';
  const A = globalThis.AQ, T = String.raw;
  // krok: [pytanie, poprawna odpowiedź, [[błędna, dlaczego], ...]]
  const S = (q, a, ...w) => ({ q, a, w });

  function p12(p) {
    const t = T`\sqrt[3]{${p}}`;
    return [
      S('Od czego zaczynamy?', T`Oznaczmy $t=${t}$. Wtedy $t^3=${p}$, $t\notin\mathbb Q$, a założenie to $a+bt+ct^2=0$.`,
        [T`Podnosimy $a+bt+ct^2=0$ do kwadratu.`, T`Kwadrat sumy niczego tu nie upraszcza — pojawiają się nowe wyrazy mieszane.`],
        [T`Suma jest zerem, więc każdy składnik jest zerem: $a=bt=ct^2=0$.`, T`Suma może być zerem, choć składniki nie są, np. $1+(-1)=0$.`]),
      S(T`Najpierw przypadek $c=0$. Co wynika z $a+bt=0$?`, T`Przypadek $c=0$: gdyby $b\neq0$, to $t=-\frac ab\in\mathbb Q$ — sprzeczność. Zatem $b=0$, a wtedy $a=0$.`,
        [T`$a=-bt$, więc $a$ jest niewymierne — sprzeczność.`, T`Dla $b=0$ mamy $a=0$ i żadnej sprzeczności — trzeba osobno rozważyć $b\neq0$.`],
        [T`$a=b=0$, bo $t$ jest niewymierne.`, T`Brakuje uzasadnienia, dlaczego $b\neq0$ prowadzi do sprzeczności.`]),
      S(T`Teraz $c\neq0$. Co wiemy o liczbie $t$?`, T`Przypadek $c\neq0$: $t$ jest pierwiastkiem dwóch wielomianów o współczynnikach wymiernych: $q(x)=cx^2+bx+a$ oraz $x^3-${p}$.`,
        [T`Ze wzoru na pierwiastki $q$: $t=\frac{-b\pm\sqrt{b^2-4ac}}{2c}$, więc $t\in\mathbb Q$.`, T`$\sqrt{b^2-4ac}$ nie musi być wymierny — ten wzór niczego nie rozstrzyga.`],
        [T`$t^2=-\frac{a+bt}{c}$, więc $t^2\in\mathbb Q$.`, T`$a+bt$ nie musi być wymierne, bo $t$ jest niewymierne.`]),
      S(T`Dzielimy $x^3-${p}$ przez $q(x)$ z resztą. Co dostajemy?`, T`$x^3-${p}=q(x)(dx+e)+(ux+v)$, $d,e,u,v\in\mathbb Q$. Wstawiając $t$: $ut+v=0$, więc jak w przypadku $c=0$: $u=v=0$.`,
        [T`Reszta ma stopień $2$, więc nic z niej nie wynika.`, T`Reszta z dzielenia przez wielomian stopnia $2$ ma stopień co najwyżej $1$.`],
        [T`Reszta jest zerowa, bo $q$ zawsze dzieli $x^3-${p}$.`, T`To właśnie trzeba wykazać — wynika dopiero z $ut+v=0$.`]),
      S('Jak kończymy?', T`$x^3-${p}=q(x)(dx+e)$, więc $x^3-${p}$ ma wymierny pierwiastek $-\frac ed$ — czyli $${p}$ jest sześcianem liczby wymiernej. Sprzeczność. Zostaje $c=0$, a stąd $a=b=c=0$. $\blacksquare$`,
        [T`Skoro $q$ dzieli $x^3-${p}$, to $q(x)=x^3-${p}$.`, T`Stopnie się nie zgadzają: $2\neq3$.`],
        [T`Skoro $t$ jest pierwiastkiem $q$, to $t\in\mathbb Q$.`, T`Bycie pierwiastkiem wielomianu wymiernego nie daje wymierności.`]),
    ];
  }
  const tool = S('Jakie narzędzie wybrać?', T`$|w|^2=w\,\overline w$ — moduł zamieniamy na iloczyn, który da się wymnożyć.`,
    [T`$|z_1+z_2|=|z_1|+|z_2|$`, T`To nieprawda w ogólności — nierówność trójkąta daje tylko $\le$.`],
    [T`$|w|^2=w^2$`, T`Prawda tylko dla liczb rzeczywistych: $|i|^2=1$, a $i^2=-1$.`]);

  const P = {
    '1.10#dowód': [
      S('Co trzeba sprawdzić?', T`Że $(\mathbb R^2,+)$ i $(\mathbb R^2\setminus\{(0,0)\},\cdot)$ są grupami przemiennymi i że mnożenie jest rozdzielne względem dodawania.`,
        [T`Wystarczy przemienność mnożenia.`, T`To tylko jeden z aksjomatów ciała.`],
        [T`Że każdy element, także $(0,0)$, ma odwrotność.`, T`W ciele zero nie ma odwrotności — sprawdzamy tylko elementy niezerowe.`]),
      S('Dodawanie?', T`Działa po współrzędnych, więc łączność, przemienność, zero $(0,0)$ i element przeciwny $(-x_1,-x_2)$ wynikają z własności $\mathbb R$.`,
        [T`Zerem jest $(1,0)$.`, T`$(x_1,x_2)+(1,0)=(x_1+1,x_2)$ — to nie $(x_1,x_2)$.`],
        [T`Przeciwny do $(x_1,x_2)$ jest $(x_2,x_1)$.`, T`Suma $(x_1+x_2,\ x_1+x_2)$ nie jest zerem.`]),
      S('Jedynka mnożenia?', T`$(1,0)$, bo $(x_1,x_2)\cdot(1,0)=(x_1,x_2)$.`,
        [T`$(1,1)$`, T`$(x_1,x_2)\cdot(1,1)=(x_1-x_2,\ x_1+x_2)$.`],
        [T`$(0,1)$`, T`$(x_1,x_2)\cdot(0,1)=(-x_2,x_1)$ — to obrót, nie jedynka.`]),
      S(T`Odwrotność $(x_1,x_2)\neq(0,0)$?`, T`$\left(\frac{x_1}{x_1^2+x_2^2},\frac{-x_2}{x_1^2+x_2^2}\right)$; mianownik jest dodatni, bo $(x_1,x_2)\neq(0,0)$.`,
        [T`$\left(\frac1{x_1},\frac1{x_2}\right)$`, T`Mnożenie nie działa po współrzędnych (a $x_2$ może być $0$).`],
        [T`$(x_1,-x_2)$`, T`Iloczyn to $(x_1^2+x_2^2,\ 0)$ — trzeba jeszcze podzielić przez $x_1^2+x_2^2$.`]),
      S('Łączność mnożenia i rozdzielność?', T`Sprawdzamy rachunkiem na współrzędnych — obie strony są równe. Wszystkie aksjomaty spełnione: to ciało (liczby zespolone). $\blacksquare$`,
        [T`Wynikają z przemienności mnożenia.`, T`Przemienność nie daje ani łączności, ani rozdzielności.`],
        [T`Nie trzeba ich sprawdzać.`, T`To aksjomaty ciała — trzeba je sprawdzić.`]),
    ],
    '2.2#2.1': [
      S('Od czego zaczynamy?', T`$(1+i)^2=1+2i+i^2=2i$.`,
        [T`$(1+i)^2=1+i^2=0$`, T`Zgubiony wyraz $2i$: $(a+b)^2=a^2+2ab+b^2$.`],
        [T`$(1+i)^2=2$`, T`$1+2i+i^2=1+2i-1=2i$.`]),
      S(T`Ile wynosi $(1+i)^8$?`, T`$(1+i)^8=(2i)^4=16i^4=16=2^4$.`,
        [T`$(2i)^4=16i$`, T`$i^4=1$, nie $i$.`],
        [T`$(2i)^4=-16$`, T`$i^4=(i^2)^2=1$.`]),
      S('Jak kończymy?', T`$(1+i)^{8n}=\left((1+i)^8\right)^n=(2^4)^n=2^{4n}$ dla każdego $n\in\mathbb Z$ (dla $n<0$ też, bo $1+i\neq0$). $\blacksquare$`,
        [T`Indukcja dla $n\ge1$ wystarcza.`, T`Teza obejmuje wszystkie $n\in\mathbb Z$, także zero i liczby ujemne.`],
        [T`$(1+i)^{8n}=8n(1+i)$`, T`Potęgowanie to nie mnożenie przez wykładnik.`]),
    ],
    '2.2#2.2': [
      S('Od czego zaczynamy?', T`$(1+i)^2=1+2i+i^2=2i$.`,
        [T`$(1+i)^2=1+i^2=0$`, T`Zgubiony wyraz $2i$: $(a+b)^2=a^2+2ab+b^2$.`],
        [T`$(1+i)^2=2$`, T`$1+2i+i^2=2i$.`]),
      S(T`Ile wynosi $(1+i)^4$?`, T`$(1+i)^4=(2i)^2=4i^2=-4$.`,
        [T`$(2i)^2=4$`, T`$i^2=-1$, więc $(2i)^2=-4$.`],
        [T`$(2i)^2=4i$`, T`$(2i)^2=4i^2$, nie $4i$.`]),
      S('Jak kończymy?', T`$(1+i)^{4n}=(-4)^n=(-1)^n4^n=(-1)^n2^{2n}$. $\blacksquare$`,
        [T`$(-4)^n=-4^n$`, T`Minus też podnosimy do potęgi: $(-4)^n=(-1)^n4^n$.`],
        [T`$(-4)^n=(-1)^n2^n$`, T`$4^n=2^{2n}$, nie $2^n$.`]),
    ],
    '2.7#7.1': [tool,
      S(T`Rozwiń $|z_1+z_2|^2$.`, T`$(z_1+z_2)(\overline{z_1}+\overline{z_2})=|z_1|^2+z_1\overline{z_2}+\overline{z_1}z_2+|z_2|^2$.`,
        [T`$|z_1|^2+|z_2|^2$`, T`Zgubione wyrazy mieszane $z_1\overline{z_2}+\overline{z_1}z_2$.`],
        [T`$|z_1|^2+2z_1z_2+|z_2|^2$`, T`Wyrazy mieszane są ze sprzężeniami: $z_1\overline{z_2}+\overline{z_1}z_2$.`]),
      S(T`A $|z_1-z_2|^2$?`, T`$|z_1|^2-z_1\overline{z_2}-\overline{z_1}z_2+|z_2|^2$.`,
        [T`$|z_1|^2-|z_2|^2$`, T`Zgubione wyrazy mieszane, a $|{-z_2}|^2=|z_2|^2$ ma znak plus.`],
        [T`$|z_1|^2+z_1\overline{z_2}+\overline{z_1}z_2+|z_2|^2$`, T`Przy $-z_2$ wyrazy mieszane zmieniają znak.`]),
      S('Jak kończymy?', T`Dodajemy — wyrazy mieszane się znoszą: $2|z_1|^2+2|z_2|^2$. $\blacksquare$`,
        [T`Odejmujemy stronami.`, T`Odjęcie daje $2(z_1\overline{z_2}+\overline{z_1}z_2)$ — trzeba dodać.`],
        [T`Wyrazy mieszane są zerem.`, T`Nie są — znoszą się dopiero po dodaniu obu rozwinięć.`]),
    ],
    '2.7#7.2': [tool,
      S(T`Rozwiń $|1+z_1\overline{z_2}|^2$.`, T`$(1+z_1\overline{z_2})(1+\overline{z_1}z_2)=1+z_1\overline{z_2}+\overline{z_1}z_2+|z_1|^2|z_2|^2$.`,
        [T`$1+|z_1|^2|z_2|^2$`, T`Zgubione wyrazy mieszane.`],
        [T`$(1+z_1\overline{z_2})^2$`, T`Moduł do kwadratu to iloczyn ze sprzężeniem, nie kwadrat.`]),
      S(T`Dodaj $|z_1-z_2|^2=|z_1|^2-z_1\overline{z_2}-\overline{z_1}z_2+|z_2|^2$.`, T`Wyrazy mieszane się znoszą: $1+|z_1|^2+|z_2|^2+|z_1|^2|z_2|^2$.`,
        [T`$1+|z_1|^2|z_2|^2$`, T`Zgubione $|z_1|^2+|z_2|^2$ z drugiego składnika.`],
        [T`$1+|z_1|^2+|z_2|^2+2z_1\overline{z_2}$`, T`Wyrazy mieszane znoszą się w całości.`]),
      S('Jak kończymy?', T`$1+|z_1|^2+|z_2|^2+|z_1|^2|z_2|^2=(1+|z_1|^2)(1+|z_2|^2)$. $\blacksquare$`,
        [T`To $(1+|z_1|)^2(1+|z_2|)^2$.`, T`Po wymnożeniu pojawiłyby się $|z_1|$ i $|z_2|$ w pierwszej potędze.`],
        [T`To $(1+|z_1|^2+|z_2|^2)^2$.`, T`Ten kwadrat ma dużo więcej wyrazów.`]),
    ],
    '2.7#7.3': [
      S('Jak uprościć składniki ze sprzężeniami?', T`$|\overline w|=|w|$, więc $|\overline{z_1}+\overline{z_2}-z_3|=|z_1+z_2-\overline{z_3}|$ i analogicznie czwarty składnik.`,
        [T`$\overline{z_1}+\overline{z_2}-z_3=z_1+z_2-z_3$`, T`Sprzężenie zmienia liczbę — równe są tylko moduły.`],
        [T`Sprzężenia można pominąć, bo $|z|^2=z^2$.`, T`$|z|^2=z\overline z$, nie $z^2$.`]),
      S('Pierwszy + drugi składnik?', T`To tożsamość 7.1 dla $w_1=z_1+z_2$, $w_2=\overline{z_3}$: $2\left(|z_1+z_2|^2+|z_3|^2\right)$.`,
        [T`$2\left(|z_1|^2+|z_2|^2+|z_3|^2\right)$`, T`Za wcześnie — tu jeszcze stoi $|z_1+z_2|^2$.`],
        [T`$|z_1+z_2|^2+|z_3|^2$`, T`Tożsamość 7.1 daje czynnik $2$.`]),
      S('Trzeci + czwarty?', T`Tak samo dla $w_1=z_1-z_2$: $2\left(|z_1-z_2|^2+|z_3|^2\right)$.`,
        [T`$2\left(|z_1+z_2|^2-|z_3|^2\right)$`, T`7.1 daje sumę kwadratów modułów, nie różnicę.`],
        [T`$2\left(|z_1|^2-|z_2|^2+|z_3|^2\right)$`, T`Najpierw zostaje $|z_1-z_2|^2$, rozkładamy go później.`]),
      S('Jak kończymy?', T`Jeszcze raz 7.1: $2\left(|z_1+z_2|^2+|z_1-z_2|^2\right)+4|z_3|^2=4\left(|z_1|^2+|z_2|^2+|z_3|^2\right)$. $\blacksquare$`,
        [T`$2\left(|z_1+z_2|^2+|z_1-z_2|^2\right)=2\left(|z_1|^2+|z_2|^2\right)$`, T`Brakuje czynnika $2$: to $2\cdot2\left(|z_1|^2+|z_2|^2\right)$.`],
        [T`$|z_1+z_2|^2+|z_1-z_2|^2=0$`, T`To suma kwadratów modułów — równa $2(|z_1|^2+|z_2|^2)$.`]),
    ],
    '2.8#dowód': [
      S(T`Co daje założenie $|z_k|=r$?`, T`$z_k\overline{z_k}=r^2$, czyli $\frac1{z_k}=\frac{\overline{z_k}}{r^2}$ (dla $r>0$; przypadek $r=0$ jest oczywisty).`,
        [T`$z_1=z_2=z_3=r$`, T`Równe moduły nie oznaczają równych liczb.`],
        [T`$z_k^2=r^2$`, T`Prawda tylko dla liczb rzeczywistych; ogólnie $z\overline z=r^2$.`]),
      S('Jak przekształcić lewą stronę?', T`$z_1z_2+z_2z_3+z_3z_1=z_1z_2z_3\left(\frac1{z_1}+\frac1{z_2}+\frac1{z_3}\right)$.`,
        [T`$|z_1z_2+z_2z_3+z_3z_1|=|z_1z_2|+|z_2z_3|+|z_3z_1|$`, T`Moduł sumy to nie suma modułów.`],
        [T`$z_1z_2+z_2z_3+z_3z_1=(z_1+z_2+z_3)^2$`, T`$(z_1+z_2+z_3)^2$ ma jeszcze wyrazy $z_k^2$ i podwojone iloczyny.`]),
      S('Co dalej?', T`$=\frac{z_1z_2z_3}{r^2}\left(\overline{z_1}+\overline{z_2}+\overline{z_3}\right)=\frac{z_1z_2z_3}{r^2}\cdot\overline{z_1+z_2+z_3}$.`,
        [T`$=z_1z_2z_3(z_1+z_2+z_3)$`, T`$\frac1{z_k}=\frac{\overline{z_k}}{r^2}$, a nie $z_k$.`],
        [T`$=\frac{z_1z_2z_3}{r}(z_1+z_2+z_3)$`, T`Zgubione sprzężenie i zły mianownik.`]),
      S('Jak kończymy?', T`Bierzemy moduł: $\frac{r^3}{r^2}\,|\overline{z_1+z_2+z_3}|=r\,|z_1+z_2+z_3|$. $\blacksquare$`,
        [T`Moduł: $r^3\,|z_1+z_2+z_3|$`, T`Zgubiony mianownik $r^2$.`],
        [T`Moduł sprzężenia jest inny, więc trzeba liczyć dalej.`, T`$|\overline w|=|w|$.`]),
    ],
    '2.9#dowód': [
      S(T`Jak zapisać $a^2+b^2$ liczbą zespoloną?`, T`$a^2+b^2=|a+bi|^2$.`,
        [T`$a^2+b^2=(a+bi)^2$`, T`$(a+bi)^2=a^2-b^2+2abi$.`],
        [T`$a^2+b^2=|a+b|^2$`, T`To $(a+b)^2$ — inna liczba.`]),
      S('Co z iloczynem?', T`$(a^2+b^2)(c^2+d^2)=|a+bi|^2|c+di|^2=|(a+bi)(c+di)|^2$ — moduł iloczynu to iloczyn modułów.`,
        [T`$=|(a+bi)+(c+di)|^2$`, T`Iloczyn modułów to moduł iloczynu, nie sumy.`],
        [T`$=|a+bi|\cdot|c+di|$`, T`Zgubione kwadraty.`]),
      S('Jak kończymy?', T`$(a+bi)(c+di)=(ac-bd)+(ad+bc)i$, więc iloczyn $=(ac-bd)^2+(ad+bc)^2$ — suma kwadratów liczb całkowitych. $\blacksquare$`,
        [T`$=(ac)^2+(bd)^2$`, T`Iloczyn liczb zespolonych nie działa „składnikami”.`],
        [T`$=(ac+bd)^2+(ad+bc)^2$`, T`Część rzeczywista iloczynu to $ac-bd$.`]),
    ],
    '3.4#dowód': [
      S('Jaka liczba „zawiera” obie sumy?', T`$(1+i)^n=\sum_{k=0}^n\binom nk i^k$ (dwumian Newtona).`,
        [T`$2^n=\sum_{k=0}^n\binom nk$`, T`Tu wszystkie znaki są dodatnie, a w tezie się przeplatają.`],
        [T`$(1+i^2)^n$`, T`$1+i^2=0$.`]),
      S('Które wyrazy tworzą część rzeczywistą?', T`Parzyste $k$, bo $i^{2j}=(-1)^j$: $\operatorname{Re}=1-\binom n2+\binom n4-\ldots$, a $\operatorname{Im}=\binom n1-\binom n3+\ldots$.`,
        [T`Nieparzyste $k$.`, T`$i^k$ jest rzeczywiste dla parzystych $k$.`],
        [T`Wszystkie, bo $\binom nk$ są rzeczywiste.`, T`Czynnik $i^k$ bywa urojony.`]),
      S(T`Policz $(1+i)^n$ inaczej.`, T`$1+i=\sqrt2\left(\cos\frac\pi4+i\sin\frac\pi4\right)$, więc $(1+i)^n=\sqrt2^{\,n}\left(\cos\frac{n\pi}4+i\sin\frac{n\pi}4\right)$.`,
        [T`$(1+i)^n=1+i^n$`, T`Potęga sumy to nie suma potęg.`],
        [T`$(1+i)^n=\sqrt2^{\,n}\left(\cos\frac\pi4+i\sin\frac\pi4\right)$`, T`Argument też mnożymy przez $n$ (de Moivre).`]),
      S('Jak kończymy?', T`Porównujemy części rzeczywiste i urojone obu zapisów — to są dokładnie obie tożsamości. $\blacksquare$`,
        [T`Porównujemy moduły.`, T`Moduły dają tylko $|(1+i)^n|=\sqrt2^{\,n}$ — za mało.`],
        [T`Porównujemy argumenty.`, T`Argument nie mówi nic o sumach współczynników.`]),
    ],
    '3.11#dowód': [
      S(T`Co wynika z $z+z^{-1}=2\cos\alpha$?`, T`Po pomnożeniu przez $z$: $z^2-2\cos\alpha\cdot z+1=0$.`,
        [T`$z=\cos\alpha$`, T`Wtedy $z+\frac1z=\cos\alpha+\frac1{\cos\alpha}$, co zwykle nie jest $2\cos\alpha$.`],
        [T`$z^2+1=2\cos\alpha$`, T`Po pomnożeniu przez $z$ prawa strona też się mnoży: $2\cos\alpha\cdot z$.`]),
      S('Rozwiąż to równanie.', T`$\Delta=4\cos^2\alpha-4=(2i\sin\alpha)^2$, więc $z=\cos\alpha\pm i\sin\alpha$.`,
        [T`$\Delta\le0$, więc brak rozwiązań.`, T`W $\mathbb C$ równanie kwadratowe zawsze ma rozwiązania.`],
        [T`$z=\cos\alpha\pm\sin\alpha$`, T`$\sqrt{-4\sin^2\alpha}=2i\sin\alpha$ — zgubione $i$.`]),
      S(T`Co z $z^m$ i $z^{-m}$?`, T`De Moivre: $z^m=\cos m\alpha\pm i\sin m\alpha$, a $z^{-m}=\cos m\alpha\mp i\sin m\alpha$ (bo $|z|=1$).`,
        [T`$z^m=\cos^m\alpha\pm i\sin^m\alpha$`, T`Potęgujemy całą liczbę, a nie osobno $\cos$ i $\sin$.`],
        [T`$z^{-m}=-z^m$`, T`$z^{-m}=\frac1{z^m}=\overline{z^m}$, bo $|z|=1$.`]),
      S('Jak kończymy?', T`Dodajemy: $z^m+z^{-m}=2\cos(m\alpha)$. $\blacksquare$`,
        [T`Dodajemy: $2\cos^m\alpha$`, T`De Moivre daje $\cos m\alpha$, nie $\cos^m\alpha$.`],
        [T`Odejmujemy: $2i\sin(m\alpha)$`, T`Teza dotyczy sumy $z^m+z^{-m}$.`]),
    ],
  };

  const mk = (base, steps, task) => {
    let q = base.q.replace('Ułóż szkic dowodu, że', 'Udowodnij, że').replace(/^Ułóż dowód/, 'Udowodnij');
    q = q.replace('Udowodnij tożsamości ', 'Udowodnij tożsamość ');
    if (/^Udowodnij( obu)?( tożsamości)?\.$/.test(q)) q = task.statement;
    return Object.assign({}, base, { type: 'guided', q, steps, order: undefined, sol: steps.map(s => s.a) });
  };
  for (const L of A.lists) for (const t of L.tasks) {
    t.items = t.items.map(it => {
      if (it.type !== 'order') return it;
      if (t.id === '1.2') { const p = +(it.q.match(/\\sqrt\[3\]\{(\d+)\}/) || [0, 2])[1]; return mk(it, p12(p), t); }
      const g = P[t.id + '#' + it.label];
      return g ? mk(it, g, t) : it;
    });
    if (t.id === '1.2') t.gen = () => { const p = [7, 11, 13, 6, 10][Math.floor(Math.random() * 5)]; return { type: 'guided', gk: 'p', q: T`Udowodnij: jeżeli $a+b\sqrt[3]{${p}}+c\sqrt[3]{${p * p}}=0$, $a,b,c\in\mathbb Q$, to $a=b=c=0$.`, steps: p12(p), sol: p12(p).map(s => s.a) }; };
  }
})();
