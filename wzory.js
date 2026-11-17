/* Wzory z wyprowadzeniami. Każdy wpis: f — wzór, d — „skąd to się bierze” (kolejne linijki).
   Zestaw przy zadaniu ma wystarczyć do rozwiązania go od zera. */
(function (G) {
  'use strict';
  const AQ = G.AQ, T = String.raw;
  const F = {
    /* ---------- Lista 1 ---------- */
    sets: { f: T`$\mathbb N=\{1,2,3,\ldots\}$, $\ \mathbb N_0=\mathbb N\cup\{0\}$, $\ \mathbb Z$ — całkowite, $\ \mathbb Z^*=\{-1,1\}$, $\ \mathbb Q$ — wymierne, $\ \mathbb Q^*=\mathbb Q\setminus\{0\}$, $\ \mathbb{IQ}$ — niewymierne, $\ \mathbb R$ — rzeczywiste, $\ \mathbb R^*=\mathbb R\setminus\{0\}$`,
      d: [T`To oznaczenia z nagłówka Listy 1.`, T`Na algebrze liczby naturalne zaczynają się od $1$. Zero należy dopiero do $\mathbb N_0$.`, T`Gwiazdka zwykle znaczy „bez zera”. Wyjątek: $\mathbb Z^*$ to tylko $1$ i $-1$, czyli te liczby całkowite, których odwrotność też jest całkowita.`] },
    sq: { f: T`$(x\pm y)^2=x^2\pm2xy+y^2$`,
      d: [T`Mnożymy każdy przez każdy: $(x+y)(x+y)=x^2+xy+yx+y^2=x^2+2xy+y^2$.`, T`Dla minusa tak samo, tylko wyraz środkowy ma znak minus.`] },
    sqrtNested: { f: T`$\sqrt{a\pm b\sqrt c}=x\pm y\sqrt c$, gdy $x^2+cy^2=a$ i $2xy=b$ $\ (x\ge y\sqrt c>0)$`,
      d: [T`Szukamy liczby, której kwadrat to $a+b\sqrt c$. Próbujemy postaci $x+y\sqrt c$.`, T`$(x+y\sqrt c)^2=x^2+2xy\sqrt c+cy^2=(x^2+cy^2)+2xy\sqrt c$.`, T`Porównujemy z $a+b\sqrt c$: część bez pierwiastka $x^2+cy^2=a$, część z pierwiastkiem $2xy=b$. Zwykle wystarczy zgadnąć małe liczby całkowite.`, T`Uwaga na znak: $\sqrt{(x-y\sqrt c)^2}=|x-y\sqrt c|$, więc trzeba sprawdzić, że $x\ge y\sqrt c$.`] },
    cubeSum: { f: T`$(u+v)^3=u^3+v^3+3uv(u+v)$`,
      d: [T`$(u+v)^3=u^3+3u^2v+3uv^2+v^3$.`, T`Z dwóch środkowych wyrazów wyłączamy $3uv$: $3u^2v+3uv^2=3uv(u+v)$.`, T`Zastosowanie: jeśli $x=u+v$, to $x^3=u^3+v^3+3uv\cdot x$ — dostajemy równanie na samo $x$, bo $u^3+v^3$ i $uv$ da się policzyć.`] },
    nested: { f: T`Jeśli $x=\sqrt[k]{n+\sqrt[k]{n+\ldots}}$, to $x^k=n+x$`,
      d: [T`Pod pierwszym pierwiastkiem stoi $n$ plus… to samo nieskończone wyrażenie, czyli $x$.`, T`Zatem $x=\sqrt[k]{n+x}$. Podnosimy obie strony do potęgi $k$: $x^k=n+x$.`, T`Rozwiązujemy to równanie i wybieramy rozwiązanie dodatnie.`] },
    ratRoot: { f: T`Całkowite pierwiastki wielomianu $x^n+\ldots+a_0$ (o współczynnikach całkowitych) są dzielnikami wyrazu wolnego $a_0$`,
      d: [T`Jeśli $x_0$ jest całkowitym pierwiastkiem, to po wstawieniu każdy składnik oprócz $a_0$ dzieli się przez $x_0$ — więc $a_0$ też musi.`, T`W praktyce: sprawdzamy po kolei dzielniki $a_0$ (dodatnie i ujemne).`, T`Gdy znajdziemy pierwiastek $x_0$, dzielimy wielomian przez $(x-x_0)$ i badamy resztę (np. przez $\Delta<0$ — brak innych pierwiastków rzeczywistych).`] },
    cbrtIrr: { f: T`$\sqrt[3]{n}$ jest liczbą wymierną tylko wtedy, gdy $n$ jest sześcianem liczby wymiernej`,
      d: [T`Przypuśćmy, że $\sqrt[3]{2}=\frac pq$ (ułamek nieskracalny). Wtedy $p^3=2q^3$.`, T`Prawa strona jest parzysta, więc $p$ jest parzyste: $p=2k$. Wtedy $8k^3=2q^3$, czyli $q^3=4k^3$ — więc $q$ też parzyste.`, T`Ułamek dało się skrócić przez $2$ — sprzeczność. Dla $3$, $5$ itd. rozumowanie jest takie samo.`] },
    tcube: { f: T`Dla $t=\sqrt[3]{p}$: $\ t^2=\sqrt[3]{p^2}$, $\ t^3=p$, $\ t^4=p\,t$`,
      d: [T`Z definicji pierwiastka sześciennego: $t^3=p$.`, T`$t^2=\sqrt[3]{p}\cdot\sqrt[3]{p}=\sqrt[3]{p^2}$, a $t^4=t^3\cdot t=p\,t$.`, T`Dzięki temu każdą potęgę $t$ sprowadzamy do $1$, $t$ lub $t^2$.`] },
    qcbrt: { f: T`Szukamy $x=a+bt+ct^2$ z równania $x\cdot(\text{mianownik})=\text{licznik}$ i porównujemy współczynniki przy $1,\ t,\ t^2$`,
      d: [T`Dzielenie to odwrotność mnożenia: $\frac LM=x$ znaczy $x\cdot M=L$.`, T`Wymnażamy $(a+bt+ct^2)\cdot M$, zamieniając $t^3$ na $p$ i $t^4$ na $pt$.`, T`Liczby $1,t,t^2$ są „niezależne” (Zadanie 1.2): jeśli dwie kombinacje są równe, to mają równe współczynniki przy $1$, przy $t$ i przy $t^2$.`, T`Dostajemy układ trzech równań z niewiadomymi $a,b,c$.`] },
    closed: { f: T`Działanie jest <b>wykonalne</b> w zbiorze $X$, gdy dla każdych $x,y\in X$ wynik istnieje i też należy do $X$`,
      d: [T`Przykład: w $\mathbb N$ odejmowanie nie jest wykonalne, bo $1-2=-1\notin\mathbb N$.`, T`Żeby pokazać niewykonalność, wystarczy <b>jeden</b> kontrprzykład.`, T`Dzielenie: trzeba móc podzielić przez każdy element zbioru. Jeśli $0\in X$, dzielenie od razu odpada.`] },
    fieldDef: { f: T`<b>Ciało liczbowe</b>: zbiór liczb zawierający $0$ i $1$, w którym wykonalne są $+$, $-$, $\cdot$ oraz dzielenie przez liczby różne od zera`,
      d: [T`Sprawdzamy więc: czy suma, różnica i iloczyn dwóch elementów zbioru znów mają tę samą postać, oraz czy odwrotność elementu $\neq0$ też.`, T`Przykład: w $\{a+b\sqrt2\}$ iloczyn $(a+b\sqrt2)(c+d\sqrt2)=(ac+2bd)+(ad+bc)\sqrt2$ ma tę samą postać.`, T`Kontrprzykład: w $\{a+b\sqrt[3]2\}$ iloczyn $\sqrt[3]2\cdot\sqrt[3]2=\sqrt[3]4$ nie daje się zapisać jako $a+b\sqrt[3]2$.`] },
    invSqrt: { f: T`$\dfrac{1}{a+b\sqrt d}=\dfrac{a-b\sqrt d}{a^2-db^2}$`,
      d: [T`Usuwamy niewymierność z mianownika: mnożymy licznik i mianownik przez $a-b\sqrt d$.`, T`W mianowniku wzór $(x+y)(x-y)=x^2-y^2$: $(a+b\sqrt d)(a-b\sqrt d)=a^2-db^2$ — liczba wymierna.`] },
    cbrtMul: { f: T`$\sqrt[3]{p}\cdot\sqrt[3]{p}=\sqrt[3]{p^2}$, $\qquad\sqrt[3]{p}\cdot\sqrt[3]{p^2}=p$`,
      d: [T`Pierwiastki tego samego stopnia mnożymy pod jednym pierwiastkiem: $\sqrt[3]{p}\cdot\sqrt[3]{p^2}=\sqrt[3]{p^3}=p$.`, T`Stąd odwrotność: $\left(\sqrt[3]{p}\right)^{-1}=\frac{\sqrt[3]{p^2}}{p}$.`] },
    comm: { f: T`<b>Przemienność</b>: $x\circ y=y\circ x$ dla wszystkich $x,y$`,
      d: [T`Sprawdzamy, czy wzór zmienia się po zamianie $x$ z $y$.`, T`Żeby obalić — wystarczy jedna para liczb, np. dla $x\circ y=x^2-y^2$: $1\circ0=1$, ale $0\circ1=-1$.`] },
    assoc: { f: T`<b>Łączność</b>: $(x\circ y)\circ z=x\circ(y\circ z)$ dla wszystkich $x,y,z$`,
      d: [T`Liczymy obie strony osobno: najpierw nawias, potem drugie działanie.`, T`Żeby obalić — szukamy trzech małych liczb, dla których wyniki się różnią.`, T`Żeby udowodnić — rozpisujemy obie strony wzorem i porównujemy. Np. dla $x\circ y=x+y-xy$ obie strony dają $x+y+z-xy-xz-yz+xyz$.`] },
    neutral: { f: T`<b>Element neutralny</b> $e$: $\ x\circ e=e\circ x=x$ dla <b>każdego</b> $x$`,
      d: [T`To ten sam jeden element $e$ dla wszystkich $x$ (jak $0$ w dodawaniu albo $1$ w mnożeniu).`, T`Szukamy go z równania $x\circ e=x$. Jeśli wyliczone $e$ zależy od $x$ albo nie należy do zbioru — elementu neutralnego nie ma.`] },
    inverse: { f: T`Element $y$ jest <b>odwrotny</b> do $x$, gdy $x\circ y=y\circ x=e$`,
      d: [T`Najpierw musi istnieć element neutralny $e$ — bez niego pytanie nie ma sensu.`, T`Z równania $x\circ y=e$ wyliczamy $y$ i sprawdzamy, dla których $x$ wynik należy do zbioru.`, T`Np. $x\circ y=x+y-xy$, $e=0$: $y=\frac{x}{x-1}$ jest całkowite tylko dla $x=0$ i $x=2$.`] },
    zp: { f: T`$\mathbb Z_p=\{0,1,\ldots,p-1\}$; wynik działania to <b>reszta z dzielenia przez $p$</b>`,
      d: [T`Liczymy zwyczajnie, a potem odejmujemy $p$ tyle razy, aż trafimy do zbioru $\{0,\ldots,p-1\}$.`, T`Np. w $\mathbb Z_5$: $3\cdot4=12=2\cdot5+2$, więc $3\cdot4=2$.`, T`Tak działa zegar: po godzinie 12 znowu jest 1.`] },
    zpneg: { f: T`W $\mathbb Z_p$: $\ -a=p-a$`,
      d: [T`$-a$ to liczba, która dodana do $a$ daje $0$. A $a+(p-a)=p$, czyli $0$ w $\mathbb Z_p$.`, T`Np. w $\mathbb Z_5$: $3-4=-1=5-1=4$.`] },
    zpinv: { f: T`$a^{-1}$ w $\mathbb Z_p$ to taka liczba $x$, że $a\cdot x=1$ (modulo $p$)`,
      d: [T`Sprawdzamy kolejno $x=1,2,\ldots,p-1$, aż iloczyn $a\cdot x$ da resztę $1$.`, T`Np. w $\mathbb Z_7$: $3\cdot5=15=2\cdot7+1$, więc $3^{-1}=5$.`, T`Dla $p$ pierwszego każda liczba $\neq0$ ma odwrotność. Dzielenie przez $a$ to mnożenie przez $a^{-1}$; $a^{-2}=(a^2)^{-1}$.`] },
    fermat: { f: T`Małe twierdzenie Fermata: $a^{p-1}=1$ w $\mathbb Z_p$ $\ (a\neq0)$`,
      d: [T`Dzięki temu duże wykładniki zmniejszamy o wielokrotności $p-1$.`, T`Np. w $\mathbb Z_{11}$: $4^{12}=4^{10}\cdot4^2=1\cdot16=5$.`] },
    gaussmod: { f: T`Układ w $\mathbb Z_p$ rozwiązujemy eliminacją Gaussa; zamiast dzielić — mnożymy przez odwrotność`,
      d: [T`Operacje na wierszach są te same co zwykle: zamiana wierszy, mnożenie wiersza przez liczbę $\neq0$, dodanie wielokrotności innego wiersza.`, T`Po każdym kroku zamieniamy liczby na reszty modulo $p$.`, T`W $\mathbb Z_7$: $2^{-1}=4$, $3^{-1}=5$, $4^{-1}=2$, $5^{-1}=3$, $6^{-1}=6$.`] },
    pairMul: { f: T`$(x_1,x_2)\cdot(y_1,y_2)=(x_1y_1-x_2y_2,\ x_1y_2+x_2y_1)$`,
      d: [T`To definicja z treści zadania. Dodawanie działa po współrzędnych, mnożenie — według tego wzoru.`, T`Skąd taki wzór? Para $(x_1,x_2)$ to liczba zespolona $x_1+x_2i$: $(x_1+x_2i)(y_1+y_2i)=x_1y_1-x_2y_2+(x_1y_2+x_2y_1)i$.`] },
    pairInv: { f: T`$(a,b)^{-1}=\left(\dfrac{a}{a^2+b^2},\ \dfrac{-b}{a^2+b^2}\right)$ dla $(a,b)\neq(0,0)$`,
      d: [T`Szukamy $(y_1,y_2)$ z warunku $(a,b)\cdot(y_1,y_2)=(1,0)$, czyli $ay_1-by_2=1$ i $ay_2+by_1=0$.`, T`Pierwsze równanie mnożymy przez $a$, drugie przez $b$ i dodajemy: $(a^2+b^2)y_1=a$.`, T`Podobnie $(a^2+b^2)y_2=-b$. Mianownik $a^2+b^2$ jest dodatni, bo $(a,b)\neq(0,0)$.`] },
    /* ---------- Lista 2 ---------- */
    i2: { f: T`$i^2=-1$, $\quad i^3=-i$, $\quad i^4=1$`,
      d: [T`$i$ to z definicji liczba, której kwadrat wynosi $-1$.`, T`$i^3=i^2\cdot i=-i$, $\ i^4=(i^2)^2=1$ — potem potęgi powtarzają się co $4$.`] },
    cmul: { f: T`$(a+bi)(c+di)=(ac-bd)+(ad+bc)i$`,
      d: [T`Mnożymy każdy przez każdy, jak zwykłe nawiasy: $ac+adi+bci+bdi^2$.`, T`Zamieniamy $i^2$ na $-1$: $bdi^2=-bd$.`, T`Zbieramy osobno część bez $i$ i część z $i$.`] },
    conj: { f: T`Sprzężenie: $\overline{a+bi}=a-bi$; $\qquad z\cdot\overline z=a^2+b^2=|z|^2$`,
      d: [T`Sprzężenie zmienia znak części urojonej (odbicie względem osi rzeczywistej).`, T`$(a+bi)(a-bi)=a^2-(bi)^2=a^2+b^2$ — wynik jest zawsze liczbą rzeczywistą nieujemną. Dlatego sprzężenie pomaga przy dzieleniu.`] },
    cdiv: { f: T`$\dfrac{a+bi}{c+di}=\dfrac{(a+bi)(c-di)}{c^2+d^2}$`,
      d: [T`Nie umiemy dzielić przez liczbę z $i$, ale umiemy przez liczbę rzeczywistą.`, T`Mnożymy licznik i mianownik przez sprzężenie mianownika $c-di$ (ułamek się nie zmienia).`, T`W mianowniku: $(c+di)(c-di)=c^2+d^2$ — już bez $i$. Licznik wymnażamy i dzielimy obie części przez $c^2+d^2$.`] },
    cube: { f: T`$(a+bi)^3=(a^3-3ab^2)+(3a^2b-b^3)i$`,
      d: [T`Wzór na sześcian sumy: $(x+y)^3=x^3+3x^2y+3xy^2+y^3$ dla $x=a$, $y=bi$.`, T`$3a(bi)^2=-3ab^2$ oraz $(bi)^3=b^3i^3=-b^3i$.`, T`Przydatne: $(a-bi)^3$ to sprzężenie $(a+bi)^3$, więc ich suma to podwojona część rzeczywista, a różnica — podwojona część urojona razy $i$.`] },
    onei: { f: T`$(1+i)^2=2i$, $\qquad(1-i)^2=-2i$, $\qquad\dfrac{1+i}{1-i}=i$`,
      d: [T`$(1+i)^2=1+2i+i^2=1+2i-1=2i$.`, T`$\frac{1+i}{1-i}=\frac{(1+i)(1+i)}{(1-i)(1+i)}=\frac{2i}{2}=i$.`, T`Dzięki temu wysokie potęgi $1+i$ liczymy przez $(2i)^k$.`] },
    powrules: { f: T`$(a^m)^n=a^{mn}$, $\qquad(ab)^n=a^nb^n$`,
      d: [T`To zwykłe prawa potęg — działają też dla liczb zespolonych i wykładników całkowitych (także ujemnych, gdy $a\neq0$).`, T`Np. $(1+i)^8=\left((1+i)^2\right)^4=(2i)^4=2^4\cdot i^4=16$.`] },
    lineq: { f: T`Równanie $A\cdot z=B$ ($A\neq0$) ma jedno rozwiązanie $z=\dfrac BA$`,
      d: [T`Wymnażamy nawiasy i zbieramy: wszystko z $z$ na lewą stronę, reszta na prawą.`, T`Współczynnik przy $z$ i prawa strona to liczby zespolone; dzielimy je, mnożąc przez sprzężenie mianownika.`] },
    conjeq: { f: T`Gdy w równaniu jest $\overline z$: podstaw $z=x+iy$, $\overline z=x-iy$ ($x,y$ rzeczywiste)`,
      d: [T`$z$ i $\overline z$ to dwie różne niewiadome, więc nie da się po prostu „wyłączyć $z$”.`, T`Po podstawieniu wymnażamy i porównujemy części rzeczywiste oraz urojone — wychodzi układ dwóch zwykłych równań z $x$ i $y$.`] },
    reim: { f: T`$a+bi=c+di\iff a=c$ i $b=d$ $\ $ (dla $a,b,c,d$ rzeczywistych)`,
      d: [T`Liczba zespolona to punkt $(a,b)$ na płaszczyźnie — dwa punkty są równe, gdy mają obie współrzędne równe.`, T`Dlatego jedno równanie zespolone daje dwa równania rzeczywiste: jedno dla części rzeczywistych, drugie dla urojonych.`] },
    cramer: { f: T`Układ $\begin{cases}a_{11}z_1+a_{12}z_2=b_1\\a_{21}z_1+a_{22}z_2=b_2\end{cases}$: $\ W=a_{11}a_{22}-a_{12}a_{21}$, $\ z_1=\dfrac{b_1a_{22}-a_{12}b_2}{W}$, $\ z_2=\dfrac{a_{11}b_2-b_1a_{21}}{W}$`,
      d: [T`Pierwsze równanie mnożymy przez $a_{22}$, drugie przez $a_{12}$ i odejmujemy — znika $z_2$: $(a_{11}a_{22}-a_{12}a_{21})z_1=b_1a_{22}-a_{12}b_2$.`, T`Podobnie eliminujemy $z_1$. To wzory Cramera; działają tak samo dla liczb zespolonych.`, T`Jeśli $W\neq0$ — dokładnie jedno rozwiązanie.`] },
    elim: { f: T`<b>Eliminacja:</b> mnożymy równania przez dobrane liczby (także zespolone) i dodajemy lub odejmujemy stronami tak, żeby jedna niewiadoma zniknęła`,
      d: [T`Równanie wolno pomnożyć obustronnie przez dowolną liczbę $\neq0$ i wolno dodać do niego inne równanie — rozwiązania się nie zmieniają.`, T`Najprościej: pierwsze równanie mnożymy przez współczynnik przy $z_1$ z drugiego, a drugie — przez współczynnik przy $z_1$ z pierwszego. Wtedy przy $z_1$ stoi to samo i po odjęciu $z_1$ znika.`, T`Zostaje równanie z samym $z_2$: dzielimy (mnożąc przez sprzężenie mianownika), a potem wstawiamy $z_2$ do dowolnego równania i wyliczamy $z_1$.`, T`Czasem wystarczy zwykłe dodanie lub odjęcie równań — np. gdy współczynniki są „na krzyż” takie same, jak $(1+i)$ i $(1-i)$ w 5.1.`] },
    sing: { f: T`Gdy $W=0$: układ jest <b>sprzeczny</b> albo ma <b>nieskończenie wiele</b> rozwiązań`,
      d: [T`$W=0$ znaczy, że lewe strony są proporcjonalne: drugie równanie to pierwsze pomnożone przez pewną liczbę $k$.`, T`Sprawdzamy prawe strony: jeśli $b_2=k\cdot b_1$, równania są tym samym równaniem (nieskończenie wiele rozwiązań); jeśli nie — sprzeczność.`] },
    modulus: { f: T`Moduł: $|z|=\sqrt{a^2+b^2}$ dla $z=a+bi$`,
      d: [T`Liczba $a+bi$ to punkt $(a,b)$ na płaszczyźnie. Moduł to jego odległość od zera.`, T`Z twierdzenia Pitagorasa dla trójkąta o przyprostokątnych $|a|$ i $|b|$: odległość $=\sqrt{a^2+b^2}$.`, T`Moduł jest zawsze liczbą rzeczywistą $\ge0$.`] },
    sqrtC: { f: T`$\sqrt{a+bi}=\pm(x+iy)$, gdzie $x^2-y^2=a$, $\ 2xy=b$, $\ x^2+y^2=\sqrt{a^2+b^2}$`,
      d: [T`Szukamy $x+iy$, którego kwadrat to $a+bi$: $(x+iy)^2=x^2-y^2+2xyi$.`, T`Porównujemy części: $x^2-y^2=a$ oraz $2xy=b$.`, T`Trzecie równanie to porównanie modułów: $|x+iy|^2=|a+bi|$. Dodając je do pierwszego: $2x^2=a+\sqrt{a^2+b^2}$ — stąd $x$, potem $y$.`, T`Znaki $x,y$ dobieramy z $2xy=b$ (ten sam znak, gdy $b>0$).`] },
    quad: { f: T`$az^2+bz+c=0$: $\ \Delta=b^2-4ac$, $\ z=\dfrac{-b\pm\sqrt\Delta}{2a}$ — w $\mathbb C$ zawsze działa`,
      d: [T`Wzór bierze się z dopełnienia do kwadratu: $a\left(z+\frac{b}{2a}\right)^2=\frac{\Delta}{4a}$ — to samo co w szkole.`, T`Różnica: w liczbach zespolonych $\sqrt\Delta$ istnieje zawsze. Dla $\Delta<0$: $\sqrt{-4}=\pm2i$. Dla $\Delta$ zespolonej — patrz wzór na $\sqrt{a+bi}$.`] },
    biq: { f: T`Równanie z $z^4$ i $z^2$ (albo $z^6$ i $z^3$): podstaw $w=z^2$ (albo $w=z^3$)`,
      d: [T`Po podstawieniu dostajemy zwykłe równanie kwadratowe na $w$.`, T`Dla każdego znalezionego $w$ rozwiązujemy potem $z^2=w$ (dwa rozwiązania) albo $z^3=w$ (trzy rozwiązania).`] },
    mod2: { f: T`$|w|^2=w\cdot\overline w$`,
      d: [T`Dla $w=a+bi$: $w\overline w=(a+bi)(a-bi)=a^2+b^2=|w|^2$.`, T`Po co? Moduł sumy trudno rozpisać, a iloczyn $w\overline w$ wymnaża się jak zwykłe nawiasy.`] },
    conjprops: { f: T`$\overline{z_1\pm z_2}=\overline{z_1}\pm\overline{z_2}$, $\qquad\overline{z_1z_2}=\overline{z_1}\cdot\overline{z_2}$, $\qquad\overline{\overline z}=z$, $\qquad|\overline z|=|z|$`,
      d: [T`Sprzężenie zmienia tylko znak przy $i$. Przy dodawaniu części urojone się dodają, więc znak można zmienić przed albo po.`, T`Dla iloczynu sprawdzamy na wzorze: $\overline{(ac-bd)+(ad+bc)i}=(ac-bd)-(ad+bc)i=(a-bi)(c-di)$.`] },
    invmod: { f: T`Jeśli $|z|=r>0$, to $\dfrac1z=\dfrac{\overline z}{r^2}$`,
      d: [T`Z $z\overline z=|z|^2=r^2$ po podzieleniu przez $z\cdot r^2$.`, T`To zamienia odwrotności na sprzężenia — a sprzężenie sumy to suma sprzężeń.`] },
    modmul: { f: T`$|z_1z_2|=|z_1|\cdot|z_2|$`,
      d: [T`$|z_1z_2|^2=z_1z_2\cdot\overline{z_1z_2}=z_1\overline{z_1}\cdot z_2\overline{z_2}=|z_1|^2|z_2|^2$.`, T`Uwaga: dla sumy tak <b>nie</b> jest — $|z_1+z_2|$ to zwykle nie $|z_1|+|z_2|$.`] },
    sqrtvals: { f: T`Jeśli $w^2=z$, to: $(-w)^2=z$, $\quad\overline w^{\,2}=\overline z$, $\quad(iw)^2=-z$`,
      d: [T`$(-w)^2=w^2=z$ — pierwiastek kwadratowy ma zawsze dwie wartości: $w$ i $-w$.`, T`Sprzężenie iloczynu to iloczyn sprzężeń: $\overline w\cdot\overline w=\overline{w\cdot w}=\overline z$.`, T`$(iw)^2=i^2w^2=-z$.`] },
    degrad: { f: T`$\pi\ \text{rad}=180^\circ$, czyli $1^\circ=\dfrac{\pi}{180}$ rad`,
      d: [T`Miara łukowa kąta to długość łuku okręgu o promieniu $1$. Cały okrąg ma długość $2\pi$ i odpowiada $360^\circ$.`, T`Stopnie → radiany: mnożymy przez $\frac{\pi}{180}$. Radiany → stopnie: wstawiamy $180^\circ$ w miejsce $\pi$.`] },
    trigdef: { f: T`Punkt na okręgu jednostkowym dla kąta $\alpha$ to $(\cos\alpha,\ \sin\alpha)$; $\ \operatorname{tg}\alpha=\dfrac{\sin\alpha}{\cos\alpha}$, $\ \operatorname{ctg}\alpha=\dfrac{\cos\alpha}{\sin\alpha}$`,
      d: [T`Kąt odkładamy od dodatniej półosi poziomej, przeciwnie do ruchu wskazówek zegara. Cosinus to współrzędna pozioma punktu, sinus — pionowa.`, T`Z Pitagorasa: $\sin^2\alpha+\cos^2\alpha=1$.`, T`Tangens nie istnieje, gdy $\cos\alpha=0$ (kąty $\frac\pi2,\frac{3\pi}2$); cotangens — gdy $\sin\alpha=0$ (kąty $0,\pi$).`] },
    trigtable: { f: T`$\begin{array}{c|ccccc}\alpha&0&\frac\pi6&\frac\pi4&\frac\pi3&\frac\pi2\\[2pt]&0^\circ&30^\circ&45^\circ&60^\circ&90^\circ\\\hline\sin\alpha&0&\frac12&\frac{\sqrt2}2&\frac{\sqrt3}2&1\\[3pt]\cos\alpha&1&\frac{\sqrt3}2&\frac{\sqrt2}2&\frac12&0\end{array}$`,
      d: [T`$\frac\pi4$ ($45^\circ$): połowa kwadratu o boku $1$ — przekątna $\sqrt2$, więc $\sin=\cos=\frac{1}{\sqrt2}=\frac{\sqrt2}2$.`, T`$\frac\pi6$ i $\frac\pi3$ ($30^\circ$, $60^\circ$): połowa trójkąta równobocznego o boku $1$ — boki $\frac12$, $\frac{\sqrt3}2$, $1$.`, T`Łatwo zapamiętać: sinusy to $\frac{\sqrt0}2,\frac{\sqrt1}2,\frac{\sqrt2}2,\frac{\sqrt3}2,\frac{\sqrt4}2$, a cosinusy — w odwrotnej kolejności.`, T`Dla kątów od $\frac\pi2$ do $\pi$ i dalej: bierzemy kąt odniesienia z tej tabelki i dobieramy znak według ćwiartki (np. $\sin\frac{5\pi}6=\sin\frac\pi6=\frac12$, $\cos\frac{5\pi}6=-\frac{\sqrt3}2$).`] },
    tgctg: { f: T`$\operatorname{tg}\alpha=\dfrac{\sin\alpha}{\cos\alpha}$, $\qquad\operatorname{ctg}\alpha=\dfrac{\cos\alpha}{\sin\alpha}=\dfrac{1}{\operatorname{tg}\alpha}$`,
      d: [T`Tangensa i cotangensa nie trzeba pamiętać osobno — liczymy je z sinusa i cosinusa.`, T`Np. $\operatorname{tg}\frac\pi6=\frac{\sin\frac\pi6}{\cos\frac\pi6}=\frac{\frac12}{\frac{\sqrt3}2}=\frac{1}{\sqrt3}=\frac{\sqrt3}{3}$ (usuwamy niewymierność z mianownika, mnożąc przez $\frac{\sqrt3}{\sqrt3}$).`, T`Gdy w mianowniku wychodzi $0$, wartość nie istnieje: $\operatorname{tg}\frac\pi2$ (bo $\cos\frac\pi2=0$) i $\operatorname{ctg}0$ (bo $\sin0=0$).`, T`Znak: tangens i cotangens są dodatnie, gdy $\sin$ i $\cos$ mają ten sam znak (ćwiartki I i III), a ujemne, gdy różne (II i IV).`] },
    signs: { f: T`Znaki w ćwiartkach: I — wszystkie $+$; II — tylko $\sin$; III — tylko $\operatorname{tg}$ i $\operatorname{ctg}$; IV — tylko $\cos$. Wartość bezwzględną bierzemy z <b>kąta odniesienia</b>`,
      d: [T`Cosinus to współrzędna pozioma (dodatnia po prawej), sinus — pionowa (dodatnia u góry).`, T`Kąt odniesienia to kąt ostry między ramieniem a osią poziomą: w II ćwiartce $\pi-\alpha$, w III $\alpha-\pi$, w IV $2\pi-\alpha$.`, T`Np. $\frac{5\pi}6$: ćwiartka II, kąt odniesienia $\frac\pi6$, więc $\sin=+\frac12$, $\cos=-\frac{\sqrt3}2$.`] },
    period: { f: T`$\sin$ i $\cos$ nie zmieniają się po dodaniu $2\pi$: kąt można zmniejszać o pełne obroty`,
      d: [T`Po pełnym obrocie wracamy do tego samego punktu okręgu.`, T`Np. $\frac{56\pi}3=18\pi+\frac{2\pi}3$, a $18\pi$ to $9$ pełnych obrotów — zostaje $\frac{2\pi}3$.`] },
    evenodd: { f: T`$\cos(-\alpha)=\cos\alpha$, $\qquad\sin(-\alpha)=-\sin\alpha$`,
      d: [T`Kąt $-\alpha$ to odbicie kąta $\alpha$ względem osi poziomej: współrzędna pozioma (cosinus) zostaje, pionowa (sinus) zmienia znak.`] },
    cofun: { f: T`$\sin\alpha=\cos\left(\frac\pi2-\alpha\right)$, $\qquad\cos\alpha=\sin\left(\frac\pi2-\alpha\right)$`,
      d: [T`W trójkącie prostokątnym kąty ostre to $\alpha$ i $\frac\pi2-\alpha$. Przyprostokątna „naprzeciw” jednego jest „przy” drugim — stąd zamiana sinusa z cosinusem.`] },
    sumcos: { f: T`$\cos(\alpha\pm\beta)=\cos\alpha\cos\beta\mp\sin\alpha\sin\beta$`,
      d: [T`Na okręgu jednostkowym bierzemy punkty $A=(\cos\alpha,\sin\alpha)$ i $B=(\cos\beta,\sin\beta)$. Kąt między nimi to $\alpha-\beta$.`, T`Odległość $|AB|$ jest taka sama jak odległość punktu $(\cos(\alpha-\beta),\sin(\alpha-\beta))$ od $(1,0)$ — to ten sam kąt, tylko obrócony.`, T`Po rozpisaniu obu odległości i skorzystaniu z $\sin^2+\cos^2=1$: $2-2(\cos\alpha\cos\beta+\sin\alpha\sin\beta)=2-2\cos(\alpha-\beta)$.`, T`Stąd wzór na różnicę; wzór na sumę dostajemy, wstawiając $-\beta$.`] },
    sumsin: { f: T`$\sin(\alpha\pm\beta)=\sin\alpha\cos\beta\pm\cos\alpha\sin\beta$`,
      d: [T`Zamieniamy sinus na cosinus: $\sin(\alpha+\beta)=\cos\left(\left(\frac\pi2-\alpha\right)-\beta\right)$.`, T`Ze wzoru na cosinus różnicy: $\cos\left(\frac\pi2-\alpha\right)\cos\beta+\sin\left(\frac\pi2-\alpha\right)\sin\beta=\sin\alpha\cos\beta+\cos\alpha\sin\beta$.`] },
    sumtg: { f: T`$\operatorname{tg}(\alpha\pm\beta)=\dfrac{\operatorname{tg}\alpha\pm\operatorname{tg}\beta}{1\mp\operatorname{tg}\alpha\operatorname{tg}\beta}$`,
      d: [T`$\operatorname{tg}(\alpha+\beta)=\frac{\sin(\alpha+\beta)}{\cos(\alpha+\beta)}=\frac{\sin\alpha\cos\beta+\cos\alpha\sin\beta}{\cos\alpha\cos\beta-\sin\alpha\sin\beta}$.`, T`Dzielimy licznik i mianownik przez $\cos\alpha\cos\beta$.`, T`Dla cotangensa dzielimy przez $\sin\alpha\sin\beta$: $\operatorname{ctg}(\alpha+\beta)=\frac{\operatorname{ctg}\alpha\operatorname{ctg}\beta-1}{\operatorname{ctg}\alpha+\operatorname{ctg}\beta}$.`] },
    dbl: { f: T`$\sin2\alpha=2\sin\alpha\cos\alpha$, $\qquad\cos2\alpha=\cos^2\alpha-\sin^2\alpha$`,
      d: [T`We wzorach na sumę wstawiamy $\beta=\alpha$.`, T`$\sin(\alpha+\alpha)=\sin\alpha\cos\alpha+\cos\alpha\sin\alpha$; $\ \cos(\alpha+\alpha)=\cos\alpha\cos\alpha-\sin\alpha\sin\alpha$.`] },
    cos2: { f: T`$\cos2\alpha=\cos^2\alpha-\sin^2\alpha=2\cos^2\alpha-1=1-2\sin^2\alpha$`,
      d: [T`Pierwsza postać: wzór na $\cos(\alpha+\beta)$ dla $\beta=\alpha$.`, T`Z jedynki trygonometrycznej $\sin^2\alpha=1-\cos^2\alpha$, więc $\cos^2\alpha-(1-\cos^2\alpha)=2\cos^2\alpha-1$.`, T`Albo $\cos^2\alpha=1-\sin^2\alpha$, wtedy $1-2\sin^2\alpha$.`] },
    half: { f: T`$\cos^2\alpha=\dfrac{1+\cos2\alpha}{2}$, $\qquad\sin^2\alpha=\dfrac{1-\cos2\alpha}{2}$`,
      d: [T`To wzór $\cos2\alpha=2\cos^2\alpha-1$ rozwiązany względem $\cos^2\alpha$ (i $\cos2\alpha=1-2\sin^2\alpha$ względem $\sin^2\alpha$).`, T`Zastosowanie — kąt o połowę mniejszy: dla $\alpha=\frac\pi8$ mamy $2\alpha=\frac\pi4$, więc $\cos^2\frac\pi8=\frac{1+\frac{\sqrt2}2}{2}=\frac{2+\sqrt2}{4}$, czyli $\cos\frac\pi8=\frac{\sqrt{2+\sqrt2}}{2}$.`, T`Tak samo $\sin\frac\pi8=\frac{\sqrt{2-\sqrt2}}{2}$. Znak pierwiastka wybieramy według ćwiartki.`] },
    a12: { f: T`$\frac{\pi}{12}=\frac\pi3-\frac\pi4$: $\ \sin\frac{\pi}{12}=\dfrac{\sqrt6-\sqrt2}{4}$, $\ \cos\frac{\pi}{12}=\dfrac{\sqrt6+\sqrt2}{4}$, $\ \operatorname{tg}\frac{\pi}{12}=2-\sqrt3$`,
      d: [T`$15^\circ=60^\circ-45^\circ$, więc stosujemy wzory na różnicę kątów.`, T`$\sin\left(\frac\pi3-\frac\pi4\right)=\frac{\sqrt3}2\cdot\frac{\sqrt2}2-\frac12\cdot\frac{\sqrt2}2=\frac{\sqrt6-\sqrt2}{4}$.`, T`$\cos\left(\frac\pi3-\frac\pi4\right)=\frac12\cdot\frac{\sqrt2}2+\frac{\sqrt3}2\cdot\frac{\sqrt2}2=\frac{\sqrt6+\sqrt2}{4}$.`, T`$\operatorname{tg}\frac{\pi}{12}=\frac{\sqrt6-\sqrt2}{\sqrt6+\sqrt2}=\frac{(\sqrt6-\sqrt2)^2}{4}=2-\sqrt3$. Dla $\frac{5\pi}{12}=\frac\pi2-\frac\pi{12}$ sinus i cosinus zamieniają się rolami.`] },
    /* ---------- Lista 3 ---------- */
    polar: { f: T`Postać trygonometryczna: $z=|z|(\cos\varphi+i\sin\varphi)$, gdzie $|z|=\sqrt{a^2+b^2}$, $\ \cos\varphi=\dfrac{a}{|z|}$, $\ \sin\varphi=\dfrac{b}{|z|}$`,
      d: [T`Liczba $z=a+bi$ to punkt $(a,b)$. Opisujemy go inaczej: odległością od zera $|z|$ i kątem $\varphi$ (argumentem) od dodatniej półosi rzeczywistej.`, T`Z definicji sinusa i cosinusa: $a=|z|\cos\varphi$, $b=|z|\sin\varphi$. Wstawiamy: $z=|z|\cos\varphi+i|z|\sin\varphi$.`, T`Kąt wyznaczamy z <b>obu</b> warunków naraz: znaki $\cos\varphi$ i $\sin\varphi$ mówią, w której ćwiartce leży, a wartości — jaki to kąt z tabelki.`] },
    polarmuldiv: { f: T`Mnożenie: moduły mnożymy, argumenty <b>dodajemy</b>. Dzielenie: moduły dzielimy, argumenty <b>odejmujemy</b>`,
      d: [T`$(\cos\alpha+i\sin\alpha)(\cos\beta+i\sin\beta)=(\cos\alpha\cos\beta-\sin\alpha\sin\beta)+i(\sin\alpha\cos\beta+\cos\alpha\sin\beta)$.`, T`To dokładnie wzory na cosinus i sinus sumy: $=\cos(\alpha+\beta)+i\sin(\alpha+\beta)$.`, T`Dzielenie to odwrotność mnożenia, więc argumenty się odejmują.`] },
    demoivre: { f: T`Wzór de Moivre’a: $\left(|z|(\cos\varphi+i\sin\varphi)\right)^n=|z|^n(\cos n\varphi+i\sin n\varphi)$`,
      d: [T`Potęga to wielokrotne mnożenie. Przy każdym mnożeniu moduły się mnożą, a argumenty dodają.`, T`Po $n$ mnożeniach: moduł $|z|\cdot|z|\cdots|z|=|z|^n$, argument $\varphi+\varphi+\ldots+\varphi=n\varphi$.`, T`Na koniec kąt $n\varphi$ zmniejszamy o pełne obroty ($2\pi$) i odczytujemy sinus i cosinus z tabelki.`] },
    binom: { f: T`Dwumian Newtona: $(x+y)^n=\sum_{k=0}^{n}\binom nk x^{n-k}y^k$; współczynniki z trójkąta Pascala: $\ 1\,3\,3\,1$; $\ 1\,4\,6\,4\,1$; $\ 1\,5\,10\,10\,5\,1$`,
      d: [T`$\binom nk=\frac{n!}{k!(n-k)!}$ mówi, na ile sposobów z $n$ nawiasów wybrać $k$ razy $y$.`, T`Trójkąt Pascala: każda liczba to suma dwóch nad nią.`, T`Np. $(x+y)^3=x^3+3x^2y+3xy^2+y^3$.`] },
    roots: { f: T`Pierwiastki stopnia $n$ z $z=|z|(\cos\varphi+i\sin\varphi)$: $\ w_k=\sqrt[n]{|z|}\left(\cos\dfrac{\varphi+2k\pi}{n}+i\sin\dfrac{\varphi+2k\pi}{n}\right)$, $\ k=0,1,\ldots,n-1$`,
      d: [T`Szukamy $w$ o module $\rho$ i argumencie $\psi$ takiego, że $w^n=z$. Z de Moivre’a $w^n$ ma moduł $\rho^n$ i argument $n\psi$.`, T`Moduły: $\rho^n=|z|$, więc $\rho=\sqrt[n]{|z|}$ (zwykły pierwiastek z liczby dodatniej).`, T`Argumenty: $n\psi$ i $\varphi$ mogą się różnić o pełne obroty: $n\psi=\varphi+2k\pi$, czyli $\psi=\frac{\varphi+2k\pi}{n}$.`, T`Dla $k=0,\ldots,n-1$ dostajemy $n$ różnych liczb — wierzchołki $n$-kąta foremnego. Dalej wartości się powtarzają.`] },
    unityroots: { f: T`Pierwiastki stopnia $n$ z jedynki: $\varepsilon_k=\cos\dfrac{2k\pi}{n}+i\sin\dfrac{2k\pi}{n}$; $\ \varepsilon_k=\varepsilon_1^{\,k}$. Jeśli $\omega^n=z$, to wszystkie pierwiastki z $z$ to $\omega\cdot\varepsilon_k$`,
      d: [T`To wzór na pierwiastki dla $z=1$ (moduł $1$, argument $0$).`, T`Z de Moivre’a $\varepsilon_1^{\,k}$ ma argument $k\cdot\frac{2\pi}n$ — czyli jest to $\varepsilon_k$.`, T`$(\omega\varepsilon_k)^n=\omega^n\cdot\varepsilon_k^n=z\cdot1=z$, a liczby $\omega\varepsilon_k$ są różne i jest ich $n$ — więc to wszystkie pierwiastki.`] },
    geom: { f: T`$1+q+q^2+\ldots+q^{n-1}=\dfrac{q^n-1}{q-1}$ dla $q\neq1$`,
      d: [T`Oznaczmy sumę przez $S$. Wtedy $qS=q+q^2+\ldots+q^n$.`, T`Odejmujemy: $qS-S=q^n-1$, więc $S=\frac{q^n-1}{q-1}$.`, T`Dla pierwiastków z jedynki: $q=\varepsilon_1^{\,m}$ spełnia $q^n=1$, więc suma wynosi $0$ — chyba że $q=1$, wtedy suma to $n$.`] },
    viete: { f: T`Wzory Viète’a dla $z^n-1=(z-\varepsilon_0)(z-\varepsilon_1)\cdots(z-\varepsilon_{n-1})$: suma pierwiastków $=0$ (dla $n\ge2$), iloczyn $=(-1)^{n+1}$`,
      d: [T`Po wymnożeniu nawiasów współczynnik przy $z^{n-1}$ to minus suma pierwiastków, a wyraz wolny to $(-1)^n$ razy ich iloczyn.`, T`W wielomianie $z^n-1$ przy $z^{n-1}$ stoi $0$, a wyraz wolny to $-1$.`, T`Stąd suma $=0$ oraz $(-1)^n\cdot\text{iloczyn}=-1$, czyli iloczyn $=(-1)^{n+1}$.`] },
    conjpolar: { f: T`Jeśli $z$ ma moduł $|z|$ i argument $\varphi$, to $\overline z$ ma moduł $|z|$ i argument $-\varphi$; $\ z^n$: moduł $|z|^n$, argument $n\varphi$`,
      d: [T`Sprzężenie to odbicie względem osi rzeczywistej — odległość od zera zostaje, kąt zmienia znak.`, T`Równanie z $z$, $\overline z$ i $|z|$ rozwiązujemy, porównując <b>osobno moduły</b> (zwykłe równanie na liczbę $|z|\ge0$) i <b>osobno argumenty</b> (z dokładnością do $2k\pi$).`, T`Zawsze osobno sprawdzamy $z=0$ — ono nie ma argumentu.`] },
    eps: { f: T`Dla $\varepsilon=\cos\frac{2\pi}3+i\sin\frac{2\pi}3=-\frac12+\frac{\sqrt3}2i$: $\ \varepsilon^3=1$, $\ 1+\varepsilon+\varepsilon^2=0$`,
      d: [T`$\varepsilon^3$ ma argument $3\cdot\frac{2\pi}3=2\pi$, czyli $\varepsilon^3=1$.`, T`$\varepsilon^3-1=(\varepsilon-1)(\varepsilon^2+\varepsilon+1)=0$, a $\varepsilon\neq1$, więc $\varepsilon^2+\varepsilon+1=0$.`, T`Stąd $1+\varepsilon=-\varepsilon^2=\frac12+\frac{\sqrt3}2i$ (argument $\frac\pi3$) oraz $1+\varepsilon^2=-\varepsilon=\frac12-\frac{\sqrt3}2i$ (argument $-\frac\pi3$).`] },
    zinv: { f: T`$z+\dfrac1z=2\cos\alpha\ \Rightarrow\ z=\cos\alpha\pm i\sin\alpha$`,
      d: [T`Mnożymy przez $z$: $z^2-2\cos\alpha\cdot z+1=0$.`, T`$\Delta=4\cos^2\alpha-4=-4\sin^2\alpha$, więc $\sqrt\Delta=\pm2i\sin\alpha$ i $z=\cos\alpha\pm i\sin\alpha$.`, T`Takie $z$ ma moduł $1$, więc $\frac1z=\overline z$.`] },
  };

  const M = {
    '1.1': { 'G:sqrt2': ['sq', 'sqrtNested'], 'G:cbrt': ['cubeSum', 'ratRoot'], 'G:nest': ['nested', 'ratRoot'], 'G:choice': ['sqrtNested', 'cubeSum', 'nested', 'cbrtIrr'] },
    '1.2': { '*': ['tcube', 'cbrtIrr'] },
    '1.3': { '*': ['tcube', 'qcbrt'] },
    '1.4': { '*': ['sets', 'closed'] },
    '1.5': { 'G:choice': ['fieldDef', 'cbrtMul'], 'G:inv': ['invSqrt'], 'G:cinv': ['cbrtMul'] },
    '1.6': { '*': ['sets', 'comm', 'assoc', 'neutral'] },
    '1.7': { '*': ['neutral', 'inverse'] },
    '1.8': { 'G:row': ['zp'], 'G:ops': ['zp', 'zpneg', 'zpinv'], 'G:inv': ['zp', 'zpinv'], 'G:expr': ['zp', 'fermat', 'zpneg', 'zpinv'] },
    '1.9': { '*': ['zp', 'zpinv', 'gaussmod'] },
    '1.10': { 'G:mul': ['pairMul'], 'G:inv': ['pairMul', 'pairInv'], 'L:dowód': ['fieldDef', 'pairMul', 'pairInv'] },
    '2.1': { 'G:prod': ['i2', 'cmul'], 'G:cube': ['i2', 'cube'], 'G:quot': ['cmul', 'conj', 'cdiv'], 'G:mixed': ['i2', 'conj', 'cdiv'], 'G:powq': ['onei', 'i2', 'powrules'], 'G:unit': ['i2', 'cmul'] },
    '2.2': { '*': ['onei', 'i2', 'powrules'] },
    '2.3': { 'G:lin': ['lineq', 'cmul', 'cdiv'], 'G:conj': ['conj', 'conjeq', 'reim'] },
    '2.4': { '*': ['reim', 'cdiv'] },
    '2.5': { 'G:sys': ['cramer', 'elim', 'cdiv'], 'G:sing': ['cramer', 'sing'] },
    '2.6': { 'G:abs1': ['modulus', 'reim'], 'G:abs2': ['modulus', 'reim'], 'G:sq': ['sqrtC', 'modulus'], 'G:quad': ['quad', 'sqrtC'], 'G:quadLead': ['quad', 'sqrtC', 'cdiv'], 'G:biq': ['biq', 'quad', 'sqrtC'] },
    '2.7': { '*': ['mod2', 'conjprops', 'cmul'] },
    '2.8': { '*': ['mod2', 'invmod', 'modmul', 'conjprops'] },
    '2.9': { '*': ['modulus', 'modmul', 'cmul'] },
    '2.10': { '*': ['sqrtvals', 'conjprops'] },
    '2.11': { '*': ['degrad'] },
    '2.12': { '*': ['trigdef', 'trigtable', 'signs'] },
    '2.13': { 'L:sin': ['sumcos', 'cofun', 'sumsin'], 'L:cos': ['sumcos', 'evenodd'], 'L:tg': ['sumsin', 'sumcos', 'sumtg'], 'L:2α': ['sumsin', 'sumcos', 'dbl'], 'L:α/2': ['cos2', 'half'], '*': ['sumsin', 'sumcos', 'sumtg', 'trigtable'] },
    '2.14': { '*': ['trigtable', 'cos2', 'half', 'a12', 'signs'] },
    '2.15': { '*': ['signs', 'dbl', 'trigtable'] },
    '3.1': { 'G:polar': ['modulus', 'polar', 'trigtable', 'signs'], 'G:polarA': ['polar', 'evenodd', 'cofun', 'polarmuldiv'] },
    '3.2': { '*': ['polar', 'demoivre', 'period', 'trigtable'] },
    '3.3': { '*': ['demoivre', 'binom', 'i2', 'sumsin', 'sumcos'] },
    '3.4': { '*': ['binom', 'i2', 'demoivre'] },
    '3.5': { '*': ['polar', 'roots', 'trigtable'] },
    '3.6': { '*': ['biq', 'quad', 'roots'] },
    '3.7': { '*': ['roots', 'unityroots'] },
    '3.8': { '*': ['polar', 'conjpolar', 'polarmuldiv'] },
    '3.9': { '*': ['eps', 'demoivre', 'geom'] },
    '3.10': { '*': ['unityroots', 'geom', 'viete'] },
    '3.11': { '*': ['zinv', 'quad', 'demoivre'] },
    '3.12': { '*': ['unityroots', 'geom', 'trigdef'] },
  };
  // wzory dobrane do kątów, które naprawdę występują w danym przykładzie
  const angleIds = zs => {
    const ids = new Set(); let off = false;
    for (const z of zs) {
      if (!z || AQ.C.abs(z) < 1e-12) continue;
      const f = AQ.piFrac(AQ.C.arg(z)); if (!f) continue;
      const [p, q] = f; ids.add('trigtable');
      if (q === 12 || q === 24) { ids.add('sumsin'); ids.add('sumcos'); }
      if (q === 8 || q === 16) ids.add('half');
      if (p / q >= 0.5 && !(p === 0)) off = true;
    }
    if (off) ids.add('signs');
    return [...ids];
  };
  const rootsOf = it => { try { const f = it.fields && it.fields[0]; const v = f && typeof f.ans === 'function' ? f.ans() : null; return Array.isArray(v) ? v : []; } catch (e) { return []; } };
  M['3.5'] = { fn: it => { const r = rootsOf(it), ids = angleIds(r); return !ids.length && r.length === 2 ? ['modulus', 'sqrtC'] : ['polar', 'roots', ...ids]; } };
  // kąt z treści przykładu (np. „dla kąta $\frac{3\pi}{8}$”) -> wzory tylko do tego kąta
  const angleOfQ = it => {
    const q = (it && it.q) || '';
    const m = [...q.matchAll(/(-?)\\frac\{(\d*)\\pi\}\{(\d+)\}|(-?)(\d*)\\pi(?![}\d])/g)].pop();
    if (!m) return /\$0\$|kąta \$0/.test(q) ? [0, 1] : null;
    return m[3] ? [(m[1] ? -1 : 1) * +(m[2] || 1), +m[3]] : [(m[4] ? -1 : 1) * +(m[5] || 1), 1];
  };
  const trigIds = it => {
    const a = angleOfQ(it); if (!a) return null;
    const [p, q] = a, t = (((p / q) % 2) + 2) % 2, ids = [];
    if (q <= 2) ids.push('trigdef'); // kąty na osiach: odczyt z okręgu jednostkowego
    ids.push('trigtable', 'tgctg');
    if (q === 12 || q === 24) ids.push('sumsin', 'sumcos', 'a12');
    if (q === 8 || q === 16) ids.push('cos2', 'half');
    if (q > 2 && t > 0.5) ids.push('signs');
    if (p < 0) ids.push('evenodd');
    if (p / q >= 2) ids.push('period');
    return ids;
  };
  M['2.12'] = { fn: it => trigIds(it) || ['trigdef', 'trigtable', 'tgctg', 'signs'] };
  M['2.14'] = { fn: it => trigIds(it) || ['trigtable', 'tgctg', 'cos2', 'half', 'a12', 'signs'] };
  M['3.6'] = { fn: it => (it && it.gk === 'lin3' ? ['polar', 'demoivre', 'polarmuldiv', 'roots'] : ['biq', 'quad', 'roots']).concat(angleIds(rootsOf(it))) };
  M['3.8'] = { fn: it => ['polar', 'conjpolar', ...(it && it.gk === 'eqc' ? ['demoivre', 'polarmuldiv'] : []), ...angleIds(rootsOf(it))] };
  AQ.wzoryLib = F; AQ.wzoryMap = M;
  AQ.wzoryFor = function (task, item, gk, cur) {
    const m = M[task.id] || {};
    if (m.fn) { try { return [...new Set(m.fn(cur || item))].map(id => F[id]).filter(Boolean); } catch (e) { /* zwykły zestaw */ } }
    const ids = (item && item.label && m['L:' + item.label]) || (gk && m['G:' + gk]) || m['*'] || Object.values(m)[0] || [];
    return ids.map(id => F[id]).filter(Boolean);
  };
})(typeof window !== 'undefined' ? window : globalThis);
