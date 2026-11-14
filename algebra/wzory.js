/* Wzory — tylko to, co potrzebne do danego typu podpunktu.
   Klucze: L:<etykieta podpunktu>, G:<typ>, '*' = domyślne dla zadania. */
(function () {
  'use strict';
  const T = String.raw;
  const W = {
    '1.1': {
      'G:sqrt2': [T`$\sqrt{a\pm b\sqrt c}=x\pm y\sqrt c$, gdy $x^2+cy^2=a$ i $2xy=b$.`],
      'G:cbrt': [T`$x=u+v\ \Rightarrow\ x^3=u^3+v^3+3uv\,x$`],
      'G:nest': [T`$x=\sqrt[k]{n+x}\ \Rightarrow\ x^k=n+x$`],
      'G:choice': [T`$\sqrt{x^2\pm2xy\sqrt c+cy^2}=|x\pm y\sqrt c|$`, T`$\sqrt[3]{n}\in\mathbb Q\iff n$ jest sześcianem`],
    },
    '1.2': { '*': [T`$t=\sqrt[3]{p}$: $t^3=p$, $t\notin\mathbb Q$`] },
    '1.3': { '*': [T`$t^3=p$, $t^4=pt$`, T`$(a+bt+ct^2)\cdot\text{mianownik}=\text{licznik}$ — porównaj współczynniki przy $1,t,t^2$`] },
    '1.4': { '*': [T`Wykonalne: wynik zawsze należy do zbioru. Jeśli $0\in X$, dzielenie odpada.`] },
    '1.5': {
      'G:choice': [T`Ciało: zamknięte na $+,-,\cdot$ i odwrotności.`, T`$\sqrt[3]{p}\cdot\sqrt[3]{p}=\sqrt[3]{p^2}$`],
      'G:inv': [T`$\dfrac{1}{a+b\sqrt d}=\dfrac{a-b\sqrt d}{a^2-db^2}$`],
      'G:cinv': [T`$\sqrt[3]{p}\cdot\sqrt[3]{p^2}=p$`],
    },
    '1.6': { '*': [T`Łączność: $(x\circ y)\circ z=x\circ(y\circ z)$`, T`Neutralny: $x\circ e=e\circ x=x$ dla każdego $x$`] },
    '1.7': { '*': [T`$y$ odwrotny do $x$: $x\circ y=y\circ x=e$`] },
    '1.8': {
      'G:row': [T`Wynik w $\mathbb Z_p$ = reszta z dzielenia przez $p$.`],
      'G:ops': [T`$-a\equiv p-a$`, T`$a^{-2}=(a^2)^{-1}$`],
      'G:inv': [T`$a^{-1}$: takie $x$, że $ax\equiv1\pmod p$`],
      'G:expr': [T`$a^{p-1}\equiv1\pmod p$ (Fermat)`, T`$a^{-1}$: $ax\equiv1\pmod p$`],
    },
    '1.9': { '*': [T`Eliminacja Gaussa; zamiast dzielić — mnóż przez odwrotność mod $p$.`, T`W $\mathbb Z_7$: $2^{-1}=4,\ 3^{-1}=5,\ 6^{-1}=6$`] },
    '1.10': {
      'G:mul': [T`$(x_1,x_2)\cdot(y_1,y_2)=(x_1y_1-x_2y_2,\ x_1y_2+x_2y_1)$`],
      'G:inv': [T`$(a,b)^{-1}=\left(\frac{a}{a^2+b^2},\frac{-b}{a^2+b^2}\right)$`],
    },
    '2.1': {
      'G:prod': [T`$(a+bi)(c+di)=(ac-bd)+(ad+bc)i$`],
      'G:cube': [T`$(a+bi)^3=(a^3-3ab^2)+(3a^2b-b^3)i$`],
      'G:quot': [T`$\dfrac{z}{w}=\dfrac{z\,\overline w}{|w|^2}$`],
      'G:mixed': [T`$\dfrac{z}{w}=\dfrac{z\,\overline w}{|w|^2}$`],
      'G:powq': [T`$(1+i)^2=2i$, $\ \dfrac{1+i}{1-i}=i$`],
      'G:unit': [T`$(\cos\varphi+i\sin\varphi)^n=\cos n\varphi+i\sin n\varphi$`],
    },
    '2.2': { '*': [T`$(1+i)^2=2i$`] },
    '2.3': {
      'G:lin': [T`$az=b\ \Rightarrow\ z=\frac ba$`],
      'G:conj': [T`Podstaw $z=x+iy$, $\overline z=x-iy$ i porównaj części.`],
    },
    '2.4': { '*': [T`Porównaj części rzeczywiste i urojone obu stron.`] },
    '2.5': {
      'G:sys': [T`$z_1=\frac{W_1}{W},\ z_2=\frac{W_2}{W}$, $\ W=a_{11}a_{22}-a_{12}a_{21}$`],
      'G:sing': [T`$W=0$: sprzeczny albo nieskończenie wiele rozwiązań.`],
    },
    '2.6': {
      'G:abs1': [T`$z=x+iy$, $|z|=\sqrt{x^2+y^2}\ge0$`],
      'G:abs2': [T`$z=x+iy$, $|z|=\sqrt{x^2+y^2}\ge0$`],
      'G:sq': [T`$(x+iy)^2=a+bi$: $\ x^2-y^2=a,\ 2xy=b,\ x^2+y^2=|a+bi|$`],
      'G:quad': [T`$z=\frac{-b\pm\sqrt\Delta}{2a}$, $\ \Delta=b^2-4ac$`],
      'G:quadLead': [T`$z=\frac{-b\pm\sqrt\Delta}{2a}$, $\ \Delta=b^2-4ac$`],
      'G:biq': [T`Podstaw $w=z^2$.`],
    },
    '2.7': { '*': [T`$|w|^2=w\,\overline w$`] },
    '2.8': { '*': [T`$|z|=r\ \Rightarrow\ \frac1z=\frac{\overline z}{r^2}$`] },
    '2.9': { '*': [T`$(a^2+b^2)(c^2+d^2)=|(a+bi)(c+di)|^2$`] },
    '2.10': { '*': [T`$w^2=z\Rightarrow(-w)^2=z,\ \ \overline w^{\,2}=\overline z,\ \ (iw)^2=-z$`] },
    '2.11': { '*': [T`$\pi=180^\circ$`] },
    '2.12': { '*': [T`$\sin\frac\pi6=\frac12,\ \sin\frac\pi4=\frac{\sqrt2}2,\ \sin\frac\pi3=\frac{\sqrt3}2$`, T`Znaki: I — wszystkie, II — $\sin$, III — $\operatorname{tg}$, IV — $\cos$`] },
    '2.13': {
      'L:sin': [T`$\sin(\alpha\pm\beta)=\sin\alpha\cos\beta\pm\cos\alpha\sin\beta$`],
      'L:cos': [T`$\cos(\alpha\pm\beta)=\cos\alpha\cos\beta\mp\sin\alpha\sin\beta$`],
      'L:tg': [T`$\operatorname{tg}=\frac{\sin}{\cos}$ — podziel wzory na $\sin$ i $\cos$ sumy`],
      'L:2α': [T`Wstaw $\beta=\alpha$ do wzorów na sumę.`],
      'L:α/2': [T`$\cos\alpha=2\cos^2\frac\alpha2-1=1-2\sin^2\frac\alpha2$`],
      '*': [T`$\sin(\alpha\pm\beta)=\sin\alpha\cos\beta\pm\cos\alpha\sin\beta$`, T`$\cos(\alpha\pm\beta)=\cos\alpha\cos\beta\mp\sin\alpha\sin\beta$`],
    },
    '2.14': { '*': [T`$\frac\pi{12}=\frac\pi3-\frac\pi4$, $\ \frac\pi8=\frac12\cdot\frac\pi4$`, T`$\cos^2\frac\alpha2=\frac{1+\cos\alpha}2$`] },
    '2.15': { '*': [T`Znaki $\sin$ i $\cos$ wyznaczają ćwiartkę.`, T`$\sin\frac\pi8=\frac{\sqrt{2-\sqrt2}}2$, $\ \sin\frac\pi{12}=\frac{\sqrt6-\sqrt2}4$`] },
    '3.1': {
      'G:polar': [T`$r=\sqrt{a^2+b^2}$, $\ \cos\varphi=\frac ar,\ \sin\varphi=\frac br$`],
      'G:polarA': [T`$\cos\alpha-i\sin\alpha=\cos(-\alpha)+i\sin(-\alpha)$`, T`$\frac{z_1}{z_2}$: argumenty się odejmują`],
    },
    '3.2': { '*': [T`$\left(r(\cos\varphi+i\sin\varphi)\right)^n=r^n(\cos n\varphi+i\sin n\varphi)$`] },
    '3.3': { '*': [T`$\cos n\alpha+i\sin n\alpha=(\cos\alpha+i\sin\alpha)^n$ — rozwiń dwumianem`] },
    '3.4': { '*': [T`$(1+i)^n=\sum\binom nk i^k=\sqrt2^n\left(\cos\frac{n\pi}4+i\sin\frac{n\pi}4\right)$`] },
    '3.5': { '*': [T`$\sqrt[n]{z}=\sqrt[n]{r}\left(\cos\frac{\varphi+2k\pi}{n}+i\sin\frac{\varphi+2k\pi}{n}\right)$, $k=0,\ldots,n-1$`] },
    '3.6': { '*': [T`Podstaw $w=z^3$.`] },
    '3.7': { '*': [T`Wszystkie wartości: $\omega\cdot\varepsilon_k$, $\ \varepsilon_k^n=1$`] },
    '3.8': { '*': [T`Porównaj osobno moduły i argumenty; $\overline z$ ma argument $-\varphi$.`, T`Sprawdź $z=0$.`] },
    '3.9': { '*': [T`$1+\varepsilon=-\varepsilon^2$, $\ 1+\varepsilon^2=-\varepsilon$, $\ \varepsilon^3=1$`] },
    '3.10': { '*': [T`$\sum_{k=0}^{n-1}q^k=\frac{q^n-1}{q-1}$ dla $q\ne1$`, T`Iloczyn pierwiastków $z^n-1$: $(-1)^{n+1}$`] },
    '3.11': { '*': [T`$z+\frac1z=2\cos\alpha\ \Rightarrow\ z=\cos\alpha\pm i\sin\alpha$`] },
    '3.12': { '*': [T`Suma pierwiastków $N$-tego stopnia z jedynki $=0$.`] },
  };
  AQ.wzoryFor = function (task, item, gk) {
    const w = W[task.id]; if (!w) return task.wzory;
    return (item && item.label && w['L:' + item.label]) || (gk && w['G:' + gk]) || w['*'] || Object.values(w)[0];
  };
})();
