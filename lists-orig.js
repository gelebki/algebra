/* Treść zadań Algebry liniowej I — 1:1 z list (zapis jak na listach prowadzącej).
   Nadpisuje treść zadania (statement) oraz treść podpunktów, które odpowiadają numerom z listy. */
(function () {
  'use strict';
  const A = AQ, T = String.raw;
  // lead + podpunkty (siatka jak na liście) + zakończenie
  const S = (lead, subs, tail, cols) => lead + (subs && subs.length ? `<div class="lsg${cols === 1 ? ' one' : ''}">` + subs.map(([n, t]) => `<span class="lsi"><b>${n}.</b> ${t}</span>`).join('') + '</div>' : '') + (tail || '');
  const D = t => '$\\displaystyle ' + t + '$';
  const O = {
    /* ---------------- Lista 1 ---------------- */
    '1.1': { st: T`Które spośród liczb $\sqrt{6+4\sqrt{2}}+\sqrt{6-4\sqrt{2}}$, $\sqrt[3]{2+\sqrt{5}}+\sqrt[3]{2-\sqrt{5}}$, $\sqrt[3]{1+\frac{2}{3}\sqrt{\frac{7}{3}}}+\sqrt[3]{1-\frac{2}{3}\sqrt{\frac{7}{3}}}$, $\sqrt[3]{6+\sqrt[3]{6+\sqrt[3]{6+\ldots}}}$, $\sqrt[3]{2}$, $\sqrt[3]{3}$ oraz $\sqrt[3]{5}$ są wymierne ?` },
    '1.2': { subs: [['2.1', T`jeżeli $a+b\sqrt[3]{2}+c\sqrt[3]{4}=0$, to $a=b=c=0$.`], ['2.2', T`jeżeli $a+b\sqrt[3]{3}+c\sqrt[3]{9}=0$, to $a=b=c=0$.`], ['2.3', T`jeżeli $a+b\sqrt[3]{5}+c\sqrt[3]{25}=0$, to $a=b=c=0$.`]],
      lead: T`Udowodnić, że dla dowolnych liczb wymiernych $a$, $b$, $c$`, cols: 1 },
    '1.3': { subs: [['3.1', T`Liczbę $\frac{4+2\sqrt[3]{2}}{2+\sqrt[3]{2}-2\sqrt[3]{4}}$ przedstawić w postaci $a+b\sqrt[3]{2}+c\sqrt[3]{4}$,`], ['3.2', T`Liczbę $\frac{5+15\sqrt[3]{3}}{2+\sqrt[3]{3}-2\sqrt[3]{9}}$ przedstawić w postaci $a+b\sqrt[3]{3}+c\sqrt[3]{9}$,`], ['3.3', T`Liczbę $\frac{-16+16\sqrt[3]{5}+5\sqrt[3]{25}}{2-3\sqrt[3]{5}+2\sqrt[3]{25}}$ przedstawić w postaci $a+b\sqrt[3]{5}+c\sqrt[3]{25}$,`]],
      lead: '', tail: T`dla pewnych liczb wymiernych $a$, $b$, $c$.`, cols: 1, itemTail: T` dla pewnych liczb wymiernych $a$, $b$, $c$.` },
    '1.4': { st: T`W których spośród zbiorów $\mathbb{N}$, $\mathbb{N}_0$, $\mathbb{Z}$, $\mathbb{Z}^*$, $\mathbb{Q}$, $\mathbb{Q}^*$, $\mathbb{IQ}$, $\mathbb{R}$, $\mathbb{R}^*$ można wykonać dodawanie, odejmowanie, mnożenie, dzielenie ?<div class="lnote">Stosowane oznaczenia: $\mathbb{N}$ – zbiór liczb naturalnych, $\mathbb{N}_0=\mathbb{N}\cup\{0\}$, $\mathbb{Z}$ – zbiór liczb całkowitych, $\mathbb{Z}^*=\{-1,1\}$, $\mathbb{Q}$ – zbiór liczb wymiernych, $\mathbb{Q}^*=\mathbb{Q}\setminus\{0\}$, $\mathbb{IQ}$ – zbiór liczb niewymiernych, $\mathbb{R}$ – zbiór liczb rzeczywistych, $\mathbb{R}^*=\mathbb{R}\setminus\{0\}$.</div>` },
    '1.5': { lead: T`Które z następujących zbiorów są ciałami liczbowymi:`, cols: 1, subs: [
      ['5.1', T`$K_1=\{a+b\sqrt{2}\mid a,b\in\mathbb{Q}\}$.`], ['5.2', T`$K_2=\{a+b\sqrt[3]{2}\mid a,b\in\mathbb{Q}\}$.`], ['5.3', T`$K_3=\{a+b\sqrt[3]{2}+c\sqrt[3]{4}\mid a,b,c\in\mathbb{Q}\}$.`],
      ['5.4', T`$K_4=\{a+b\sqrt{3}\mid a,b\in\mathbb{Q}\}$.`], ['5.5', T`$K_5=\{a+b\sqrt[3]{3}\mid a,b\in\mathbb{Q}\}$.`], ['5.6', T`$K_6=\{a+b\sqrt[3]{3}+c\sqrt[3]{9}\mid a,b,c\in\mathbb{Q}\}$.`],
      ['5.7', T`$K_7=\{a+b\sqrt{5}\mid a,b\in\mathbb{Q}\}$.`], ['5.8', T`$K_8=\{a+b\sqrt[3]{5}\mid a,b\in\mathbb{Q}\}$.`], ['5.9', T`$K_9=\{a+b\sqrt[3]{5}+c\sqrt[3]{25}\mid a,b,c\in\mathbb{Q}\}$.`]] },
    '1.6': { lead: T`Czy działanie $\circ$ określone w zbiorze $X$ jest przemienne, łączne, ma element neutralny, jeżeli`, cols: 1, subs: [
      ['6.1', T`$X=\mathbb{Z},\quad x\circ y=x+y-xy$.`], ['6.2', T`$X=\{-1,0,1\},\quad x\circ y=x^2-y^2$.`], ['6.3', T`$X=\mathbb{Q}^*,\quad x\circ y=\frac{x}{y}+\frac{y}{x}$.`],
      ['6.4', T`$X=\mathbb{N},\quad x\circ y=NWD(x,y)$.`], ['6.5', T`$X=\mathbb{N},\quad x\circ y=NWW(x,y)$.`], ['6.6', T`$X=\mathbb{N}_0,\quad x\circ y=MIN(x,y)$.`],
      ['6.7', T`$X=\mathbb{N}_0,\quad x\circ y=MAX(x,y)$.`], ['6.8', T`$X=\mathbb{Q},\quad x\circ y=MIN(x,y)$.`], ['6.9', T`$X=\mathbb{Q},\quad x\circ y=MAX(x,y)$.`]] },
    '1.7': { st: T`W działaniach określonych w Zadaniu 1.6 wyznaczyć wszystkie te elementy, które posiadają element odwrotny. Proszę zwrócić uwagę na to, że aby mówić o elementach odwrotnych trzeba mieć element neutralny.`,
      items: { '6.1': T`$X=\mathbb{Z},\quad x\circ y=x+y-xy$.`, '6.5': T`$X=\mathbb{N},\quad x\circ y=NWW(x,y)$.`, '6.7': T`$X=\mathbb{N}_0,\quad x\circ y=MAX(x,y)$.` } },
    '1.8': { lead: '', cols: 1, subs: [['8.1', T`Wypełnić tabelkę dodawania i mnożenia kolejno w ciałach $\mathbb{Z}_5$, $\mathbb{Z}_7$, $\mathbb{Z}_{11}$, $\mathbb{Z}_{13}$.`], ['8.2', T`Obliczyć $3+4$, $3\cdot 4$, $3-4$, $3\cdot 2^{-2}$ w ciele $\mathbb{Z}_5$.`], ['8.3', T`Wyznaczyć $3^{-1}$ kolejno w ciałach $\mathbb{Z}_5$, $\mathbb{Z}_7$, $\mathbb{Z}_{11}$, $\mathbb{Z}_{13}$.`], ['8.4', T`Obliczyć $4^{12}\cdot(5^2-6)\cdot(2\cdot(-3))^{-1}$ w ciele $\mathbb{Z}_{11}$.`]] },
    '1.9': { st: T`W ciele $\mathbb{Z}_7$ rozwiązać układ równań $$\left\{\begin{array}{rcrcrcl}3x&+&y&+&2z&=&1\\x&+&2y&+&3z&=&1\\4x&+&3y&+&2z&=&1\end{array}\right.$$`, items: { '1.9': '=' } },
    '1.10': { st: T`W iloczynie kartezjańskim $\mathbb{R}\times\mathbb{R}$ określamy dodawanie oraz mnożenie w ten sposób, że dla dowolnych par $(x_1,x_2),(y_1,y_2)\in\mathbb{R}\times\mathbb{R}$ $$\begin{array}{r}(x_1,x_2)+(y_1,y_2)=(x_1+y_1,x_2+y_2)\\(x_1,x_2)\cdot(y_1,y_2)=(x_1y_1-x_2y_2,x_1y_2+x_2y_1).\end{array}$$ Sprawdzić, że zbiór $\mathbb{R}\times\mathbb{R}$ wraz z tak określonymi działaniami oraz wyróżnionymi elementami $(0,0)$ i $(1,0)$ jest ciałem.` },

    /* ---------------- Lista 2 ---------------- */
    '2.1': { lead: T`Następujące liczby zespolone przedstawić w postaci algebraicznej:`, disp: true, subs: [
      ['1.1', T`(2+i)(4-i)+(1+2i)(3+4i)`], ['1.2', T`(2+i)(3-i)+(2+3i)(3+4i)`], ['1.3', T`(2+i)(3+7i)-(1+2i)(5+3i)`], ['1.4', T`(4+i)(5+3i)-(3+i)(3-i)`],
      ['1.5', T`(2+i)^3+(2-i)^3`], ['1.6', T`(3+i)^3-(3-i)^3`], ['1.7', T`\frac{(5+i)(7-6i)}{3+i}`], ['1.8', T`\frac{(5+i)(3+5i)}{2i}`],
      ['1.9', T`\frac{(1+3i)(8-i)}{(2+i)^2}`], ['1.10', T`\frac{(2+i)(4+i)}{1+i}`], ['1.11', T`\frac{(3-i)(1-4i)}{2-i}`], ['1.12', T`\frac{(1+i)^5}{(1-i)^3}`],
      ['1.13', T`(1+2i)i+\frac{2+3i}{1-4i}`], ['1.14', T`\left(\frac{\sqrt{2}}{2}+\frac{\sqrt{2}}{2}i\right)^3`], ['1.15', T`\left(\frac{-1}{2}+\frac{\sqrt{3}}{2}i\right)^3`], ['1.16', T`\left(\frac{-1}{2}-\frac{\sqrt{3}}{2}i\right)^3`]] },
    '2.2': { lead: T`Udowodnić, że dla dowolnej liczby całkowitej $n$`, disp: true, subs: [['2.1', T`(1+i)^{8n}=2^{4n}`], ['2.2', T`(1+i)^{4n}=(-1)^n2^{2n}`]] },
    '2.3': { lead: T`Wyznaczyć wszystkie liczby zespolone $z$ spełniające równanie`, disp: true, cols: 1, subs: [
      ['3.1', T`(1+2i)(i-z)+(3-4i)(1-iz)=1+7i`], ['3.2', T`(1-2i)\overline{z}-(3+2i)(1+iz)=5-2i`],
      ['3.3', T`\frac{(5-i)\overline{(7-6i)}z}{3-i}+\frac{-(1+3i)\overline{(8+i)}z}{(2+i)^2}=\left(\frac{(8+i)(1-2i)}{2-3i}\right)^2`]] },
    '2.4': { lead: T`Wyznaczyć wszystkie pary liczb rzeczywistych $x$ i $y$ spełniające równanie`, disp: true, cols: 1, subs: [
      ['4.1', T`(2+i)x+(1+2i)y=1-4i`], ['4.2', T`(3+2i)x+(1+3i)y=4-9i`], ['4.3', T`(1-i)(2+i)x+2(2-i)^2y=-6+8i`], ['4.4', T`2(3-i)(2+3i)x+(1-i)^2y=18+8i`],
      ['4.5', T`\left(\frac{2+i}{3-i}\right)x+\left(\frac{4-i}{1-3i}\right)^2y=1+i`]] },
    '2.5': { lead: T`W liczbach zespolonych rozwiązać następujące układy równań:`, disp: true, subs: [
      ['5.1', T`\begin{cases}(1+i)z_1+(1-i)z_2=1+i\\(1-i)z_1+(1+i)z_2=1+3i\end{cases}`], ['5.2', T`\begin{cases}iz_1+(1+i)z_2=2+2i\\2iz_1+(3+2i)z_2=5+3i\end{cases}`],
      ['5.3', T`\begin{cases}(1-i)z_1-3z_2=-i\\2z_1-(3+3i)z_2=3-i\end{cases}`], ['5.4', T`\begin{cases}2z_1-(2+i)z_2=-i\\(4-2i)z_1-5z_2=-1-2i\end{cases}`]], alias: { '5.4a': '5.4' } },
    '2.6': { lead: T`W liczbach zespolonych rozwiązać następujące równania:`, disp: true, subs: [
      ['6.1', T`|z|+z=2+i`], ['6.2', T`|z|+2iz=11+8i`], ['6.3', T`z^2=3-4i`], ['6.4', T`z^2=5-12i`], ['6.5', T`z^2-4z+5=0`], ['6.6', T`z^4-4z^2+5=0`],
      ['6.7', T`z^2-5z+4+10i=0`], ['6.8', T`z^2-2z+1-2i=0`], ['6.9', T`z^2-(5+5i)z+2+11i=0`], ['6.10', T`z^2-(1+i)z+6+3i=0`], ['6.11', T`z^2-(5+i)z+12+5i=0`], ['6.12', T`z^2-(3+i)z+4+3i=0`],
      ['6.13', T`z^2+(-8+i)z+17-i=0`], ['6.14', T`z^2+(-7+2i)z+13-i=0`], ['6.15', T`z^2+(2-4i)z-(6+8i)=0`], ['6.16', T`(1+i)z^2-(11+3i)z+30+32i=0`]] },
    '2.7': { lead: T`W liczbach zespolonych udowodnić następujące tożsamości:`, disp: true, cols: 1, subs: [
      ['7.1', T`|z_1+z_2|^2+|z_1-z_2|^2=2(|z_1|^2+|z_2|^2)`], ['7.2', T`|1+z_1\overline{z_2}|^2+|z_1-z_2|^2=(1+|z_1|^2)(1+|z_2|^2)`],
      ['7.3', T`|z_1+z_2+\overline{z_3}|^2+|\overline{z_1}+\overline{z_2}-z_3|^2+|z_1-z_2+\overline{z_3}|^2+|\overline{z_1}-\overline{z_2}-z_3|^2=4(|z_1|^2+|z_2|^2+|z_3|^2)`]] },
    '2.8': { st: T`Załóżmy, że liczby zespolone $z_1$, $z_2$ oraz $z_3$ są równe co do modułu $|z_1|=|z_2|=|z_3|\overset{\text{ozn}}{=}r$. Udowodnić, że wówczas $|z_1z_2+z_2z_3+z_3z_1|=r|z_1+z_2+z_3|$.` },
    '2.9': { st: T`Korzystając z własności modułu liczby zespolonej wykazać, że iloczyn dwóch liczb całkowitych z których każda jest sumą kwadratów pewnych dwóch liczb całkowitych jest też sumą kwadratów pewnych dwóch liczb całkowitych.` },
    '2.10': { st: T`Załóżmy, że jedną z dwóch wartości pierwiastka $\sqrt{z}$ jest $a+bi$ dla pewnych liczb rzeczywistych $a$ i $b$. Wyznaczyć drugą wartość pierwiastka $\sqrt{z}$ oraz wartości pierwiastków $\sqrt{\overline{z}}$, $\sqrt{-z}$, $\sqrt{-\overline{z}}$.`, items: { '2.10': '=' } },
    '2.11': { lead: '', cols: 1, subs: [['11.1', T`Wyrazić w stopniach: $\frac{\pi}{6}$, $\frac{\pi}{5}$, $\frac{3\pi}{4}$, $\frac{5\pi}{6}$, $\frac{5\pi}{4}$, $\frac{4\pi}{3}$, $\frac{11\pi}{6}$.`], ['11.2', T`Wyrazić w radianach: $15^\circ, 20^\circ, 45^\circ, 75^\circ, 60^\circ, 90^\circ, 100^\circ, 120^\circ, 210^\circ, 300^\circ, 315^\circ, 270^\circ$.`]],
      items: { '11.2a': T`Wyrazić w radianach: $15^\circ, 20^\circ, 45^\circ, 75^\circ, 60^\circ, 90^\circ$.`, '11.2b': T`Wyrazić w radianach: $100^\circ, 120^\circ, 210^\circ, 300^\circ, 315^\circ, 270^\circ$.` } },
    '2.12': { st: T`Wyznaczyć wartości funkcji <i>sinus</i>, <i>cosinus</i>, <i>tangens</i> oraz <i>cotangens</i> dla następujących kątów: $$0,\ \frac{\pi}{6},\ \frac{\pi}{4},\ \frac{\pi}{3},\ \frac{\pi}{2},\ \frac{2\pi}{3},\ \frac{3\pi}{4},\ \frac{5\pi}{6},\ \pi,\ \frac{7\pi}{6},\ \frac{5\pi}{4},\ \frac{4\pi}{3},\ \frac{3\pi}{2},\ \frac{5\pi}{3},\ \frac{7\pi}{4},\ \frac{11\pi}{6}.$$` },
    '2.13': { st: T`Wyznaczyć funkcje <i>sinus</i>, <i>cosinus</i>, <i>tangens</i> oraz <i>cotangens</i> sumy i różnicy dwóch kątów, kąta podwojonego, połowy kąta.` },
    '2.14': { st: T`Wyznaczyć wartości funkcji <i>sinus</i>, <i>cosinus</i>, <i>tangens</i> oraz <i>cotangens</i> dla następujących kątów: $$\frac{\pi}{12},\ \frac{\pi}{8},\ \frac{3\pi}{8},\ \frac{5\pi}{12},\ \frac{7\pi}{12},\ \frac{5\pi}{8},\ \frac{7\pi}{8},\ \frac{11\pi}{12},\ \frac{13\pi}{12},\ \frac{9\pi}{8},\ \frac{11\pi}{8},\ \frac{17\pi}{12},\ \frac{19\pi}{12},\ \frac{13\pi}{8},\ \frac{15\pi}{8},\ \frac{23\pi}{12}.$$` },
    '2.15': { lead: T`Wyznaczyć miarę kąta $\alpha$ wiedząc, że`, disp: true, cols: 1, subs: [
      ['15.1', T`sin\alpha=\frac{\sqrt{2-\sqrt{2}}}{2},\quad cos\alpha=\frac{\sqrt{2+\sqrt{2}}}{2}`], ['15.2', T`sin\alpha=\frac{\sqrt{2-\sqrt{2}}}{2},\quad cos\alpha=\frac{-\sqrt{2+\sqrt{2}}}{2}`],
      ['15.3', T`sin\alpha=\frac{-\sqrt{2-\sqrt{2}}}{2},\quad cos\alpha=\frac{-\sqrt{2+\sqrt{2}}}{2}`], ['15.4', T`sin\alpha=\frac{-\sqrt{2-\sqrt{2}}}{2},\quad cos\alpha=\frac{\sqrt{2+\sqrt{2}}}{2}`],
      ['15.5', T`sin\alpha=\frac{\sqrt{2-\sqrt{3}}}{2},\quad cos\alpha=\frac{\sqrt{2+\sqrt{3}}}{2}`], ['15.6', T`sin\alpha=\frac{\sqrt{2-\sqrt{3}}}{2},\quad cos\alpha=\frac{-\sqrt{2+\sqrt{3}}}{2}`],
      ['15.7', T`sin\alpha=\frac{-\sqrt{2-\sqrt{3}}}{2},\quad cos\alpha=\frac{-\sqrt{2+\sqrt{3}}}{2}`], ['15.8', T`sin\alpha=\frac{-\sqrt{2-\sqrt{3}}}{2},\quad cos\alpha=\frac{\sqrt{2+\sqrt{3}}}{2}`],
      ['15.9', T`sin\alpha=\frac{\sqrt{6}-\sqrt{2}}{4},\quad cos\alpha=\frac{\sqrt{6}+\sqrt{2}}{4}`], ['15.10', T`sin\alpha=\frac{\sqrt{6}-\sqrt{2}}{4},\quad cos\alpha=\frac{-\sqrt{6}-\sqrt{2}}{4}`],
      ['15.11', T`sin\alpha=\frac{-\sqrt{6}+\sqrt{2}}{4},\quad cos\alpha=\frac{-\sqrt{6}-\sqrt{2}}{4}`], ['15.12', T`sin\alpha=\frac{-\sqrt{6}+\sqrt{2}}{4},\quad cos\alpha=\frac{\sqrt{6}+\sqrt{2}}{4}`]] },

    /* ---------------- Lista 3 ---------------- */
    '3.1': { lead: T`Następujące liczby zespolone przedstawić w postaci trygonometrycznej:`, disp: true, subs: [
      ['1.1', T`1+i`], ['1.2', T`-1+i`], ['1.3', T`-1-i`], ['1.4', T`1-i`], ['1.5', T`1+i\sqrt{3}`], ['1.6', T`-1+i\sqrt{3}`], ['1.7', T`-1-i\sqrt{3}`], ['1.8', T`1-i\sqrt{3}`],
      ['1.9', T`\sqrt{3}+i`], ['1.10', T`-\sqrt{3}+i`], ['1.11', T`-\sqrt{3}-i`], ['1.12', T`\sqrt{3}-i`], ['1.13', T`2+\sqrt{3}+i`], ['1.14', T`-2-\sqrt{3}+i`], ['1.15', T`-2-\sqrt{3}-i`], ['1.16', T`2+\sqrt{3}-i`],
      ['1.17', T`1+(2+\sqrt{3})i`], ['1.18', T`-1+(2+\sqrt{3})i`], ['1.19', T`-1-(2+\sqrt{3})i`], ['1.20', T`1-(2+\sqrt{3})i`],
      ['1.21', T`\sqrt{6}+\sqrt{2}+(\sqrt{6}-\sqrt{2})i`], ['1.22', T`-\sqrt{6}-\sqrt{2}+(\sqrt{6}-\sqrt{2})i`], ['1.23', T`-\sqrt{6}-\sqrt{2}-(\sqrt{6}-\sqrt{2})i`], ['1.24', T`\sqrt{6}+\sqrt{2}-(\sqrt{6}-\sqrt{2})i`],
      ['1.25', T`cos\alpha-i\cdot sin\alpha`], ['1.26', T`sin\alpha+i\cdot cos\alpha`], ['1.27', T`\frac{2+2i}{1-i}`], ['1.28', T`\frac{1-i\sqrt{3}}{\sqrt{3}+i}`], ['1.29', T`\frac{ctg\alpha+i}{ctg\alpha-i}`], ['1.30', T`\frac{1+i\cdot tg\alpha}{1-i\cdot tg\alpha}`]] },
    '3.2': { lead: T`Korzystając z postaci trygonometrycznej liczby zespolonej wykonać następujące działania (o ile to możliwe, wynik proszę podać w postaci algebraicznej):`, disp: true, tail: T`dla dowolnej liczby naturalnej $m$.`, subs: [
      ['2.1', T`(1+i\sqrt{3})^{150}`], ['2.2', T`(\sqrt{3}-i)^{20}`], ['2.3', T`(2-\sqrt{3}+i)^{12}`], ['2.4', T`\left(\frac{1-i\sqrt{3}}{1+i}\right)^{12}`], ['2.5', T`\left(\frac{\sqrt{3}+i}{1-i}\right)^{30}`],
      ['2.6', T`\left(\frac{-1+i}{1+i\sqrt{3}}\right)^{2013}`], ['2.7', T`\frac{(1+i)^{10}}{(1+i\sqrt{3})^{15}}`], ['2.8', T`\frac{(-5+5i)^{36}}{(\sqrt{5}-i\sqrt{15})^{20}}`],
      ['2.9', T`\frac{(-1+i\sqrt{3})^{28}}{(1-i)^{26}}+\frac{(-1-i\sqrt{3})^{28}}{(1+i)^{26}}`], ['2.10', T`\frac{(1+i)^{8m+7}}{(\sqrt{3}-i)^{12n+10}}+\frac{(\sqrt{3}+i)^{12n+10}}{(1-i)^{8m+7}}`]] },
    '3.3': { st: T`Korzystając z własności liczb zespolonych wyrazić funkcje $sin(3\alpha)$, $cos(3\alpha)$, $sin(4\alpha)$, $cos(4\alpha)$, $sin(5\alpha)$, $cos(5\alpha)$ za pomocą funkcji $sin\alpha$ oraz $cos\alpha$.` },
    '3.4': { lead: T`Dla dowolnej liczby naturalnej $n$ udowodnić następujące tożsamości:`, disp: true, cols: 1, subs: [
      ['4.1', T`1-\binom{n}{2}+\binom{n}{4}-\binom{n}{6}+\ldots=\sqrt{2^n}\cdot cos\frac{n\pi}{4}`], ['4.2', T`\binom{n}{1}-\binom{n}{3}+\binom{n}{5}-\binom{n}{7}+\ldots=\sqrt{2^n}\cdot sin\frac{n\pi}{4}`]] },
    '3.5': { lead: T`Wyznaczyć wszystkie wartości następujących pierwiastków (o ile to możliwe, wynik proszę podać w postaci algebraicznej):`, disp: true, subs: [
      ['5.1', T`\sqrt{3-4i}`], ['5.2', T`\sqrt[3]{i}`], ['5.3', T`\sqrt[3]{2-2i}`], ['5.4', T`\sqrt{-1+i\sqrt{3}}`], ['5.5', T`\sqrt[4]{-8-8i\sqrt{3}}`], ['5.6', T`\sqrt[4]{72(-1+i\sqrt{3})}`],
      ['5.7', T`\sqrt[3]{(1+i)^3}`], ['5.8', T`\sqrt[3]{(1+i\sqrt{3})^6}`], ['5.9', T`\sqrt[6]{(-1+i\sqrt{3})^{10}}`], ['5.10', T`\sqrt[3]{\frac{8+24i}{3-i}}`], ['5.11', T`\sqrt[3]{\frac{27-54i}{2+i}}`], ['5.12', T`\sqrt[4]{\frac{-1+i}{1-i\sqrt{3}}}`],
      ['5.13', T`\sqrt[4]{\frac{-32}{9(1-i\sqrt{3})}}`], ['5.14', T`\sqrt[4]{\frac{18}{-(1+i\sqrt{3})}}`], ['5.15', T`\sqrt[4]{\frac{(\sqrt{3}-i)^{30}}{(1+i)^{24}}}`]] },
    '3.6': { lead: T`Wyznaczyć wszystkie liczby zespolone $z$ spełniające równanie`, disp: true, cols: 1, subs: [
      ['6.1', T`z^6+\left(2-(1-\sqrt{3})i\right)z^3+1+\sqrt{3}-(1-\sqrt{3})i=0`], ['6.2', T`\frac{\left(1-i\sqrt{3}\right)z^3}{2}=\frac{8\left(cos\frac{3\pi}{8}+i\cdot sin\frac{3\pi}{8}\right)^{10}}{cos\frac{5\pi}{4}+i\cdot sin\frac{5\pi}{4}}`]] },
    '3.7': { lead: '', cols: 1, subs: [['7.1', T`Dla dowolnej liczby naturalnej $n$ oraz dowolnej niezerowej liczby zespolonej $z$ wyznaczyć wszystkie wartości pierwiastka $\sqrt[n]{z}$ wiedząc, że jedna z tych wartości jest znana i wynosi $\omega$.`], ['7.2', T`Wyznaczyć wszystkie wartości następujących pierwiastków: (a) $\sqrt[3]{(3+2i)^3}$ oraz (b) $\sqrt[3]{(5-i)^{12}}$.`]],
      items: { '7.2a': T`(a) $\sqrt[3]{(3+2i)^3}$`, '7.2b': T`(b) $\sqrt[3]{(5-i)^{12}}$` } },
    '3.8': { lead: T`Wyznaczyć wszystkie liczby zespolone $z$ spełniające równanie`, disp: true, subs: [
      ['8.1', T`\overline{z}\cdot|z|=z^4`], ['8.2', T`\overline{z^4}=4z^6`], ['8.3', T`\overline{z}=z^3`], ['8.4', T`\frac{\overline{z^3}}{(-1-i\sqrt{3})^4}=|z|`], ['8.5', T`\frac{z^3\cdot\overline{z}}{(-1-i\sqrt{3})^2}=|z|^3`], ['8.6', T`\frac{z^5\cdot|z|^3}{-\sqrt{3}+i}=(1+i)\cdot\overline{z^2}`]] },
    '3.9': { lead: T`Oznaczmy pierwiastek pierwotny trzeciego stopnia z jedynki $\varepsilon=cos\frac{2\pi}{3}+i\cdot sin\frac{2\pi}{3}$. Obliczyć:`, disp: true, tail: T`dla dowolnej liczby naturalnej $m$.`, subs: [['9.1', T`1+\varepsilon^m+\varepsilon^{2m}`], ['9.2', T`(1+\varepsilon)^m`], ['9.3', T`(1+\varepsilon^2)^m`]] },
    '3.10': { lead: T`Dla dowolnej liczby naturalnej $n\geqslant 2$ oraz dowolnej nieujemnej liczby całkowitej $k\leqslant n-1$ oznaczmy pierwiastki $n$-tego stopnia z jedynki $\varepsilon_k=cos\frac{2k\pi}{n}+i\cdot sin\frac{2k\pi}{n}$. Obliczyć:`, disp: true, tail: T`dla dowolnej liczby naturalnej $m$.`, subs: [
      ['10.1', T`\varepsilon_0+\varepsilon_1+\ldots+\varepsilon_{n-1}`], ['10.2', T`\varepsilon_0\cdot\varepsilon_1\cdots\varepsilon_{n-1}`], ['10.3', T`{\varepsilon_0}^2+{\varepsilon_1}^2+\ldots+{\varepsilon_{n-1}}^2`],
      ['10.4', T`{\varepsilon_0}^2\cdot{\varepsilon_1}^2\cdots{\varepsilon_{n-1}}^2`], ['10.5', T`{\varepsilon_0}^m+{\varepsilon_1}^m+\ldots+{\varepsilon_{n-1}}^m`], ['10.6', T`{\varepsilon_0}^m\cdot{\varepsilon_1}^m\cdots{\varepsilon_{n-1}}^m`]] },
    '3.11': { st: T`Dla dowolnej liczby naturalnej $m$ udowodnić, że jeżeli $z+z^{-1}=2cos\alpha$, to $z^m+z^{-m}=2cos(m\alpha)$.` },
    '3.12': { lead: T`Dla dowolnej liczby naturalnej $n$ obliczyć:`, disp: true, cols: 1, subs: [['12.1', T`cos\frac{2\pi}{2n+1}+cos\frac{4\pi}{2n+1}+\ldots+cos\frac{2n\pi}{2n+1}`], ['12.2', T`cos\frac{\pi}{2n+1}\cdot cos\frac{2\pi}{2n+1}\cdots cos\frac{n\pi}{2n+1}`]] },

    /* ---------------- Lista 4 ---------------- */
    '4.1': { lead: T`Dla dowolnej liczby naturalnej $n\geqslant 2$ udowodnić następujące tożsamości trygonometryczne:`, disp: true, cols: 1, subs: [
      ['1.1', T`1+cos\frac{2\pi}{n}+cos\frac{4\pi}{n}+\ldots+cos\frac{2(n-1)\pi}{n}=0`], ['1.2', T`sin\frac{2\pi}{n}+sin\frac{4\pi}{n}+\ldots+sin\frac{2(n-1)\pi}{n}=0`],
      ['1.3', T`cos\frac{\pi}{n}+cos\frac{3\pi}{n}+\ldots+cos\frac{(2n-1)\pi}{n}=0`], ['1.4', T`sin\frac{\pi}{n}+sin\frac{3\pi}{n}+\ldots+sin\frac{(2n-1)\pi}{n}=0`],
      ['1.5', T`1-cos\frac{\pi}{2n+1}+cos\frac{2\pi}{2n+1}-\ldots+cos\frac{2n\pi}{2n+1}=0`], ['1.6', T`-sin\frac{\pi}{2n+1}+sin\frac{2\pi}{2n+1}-\ldots+sin\frac{2n\pi}{2n+1}=0.`]] },
    '4.2': { lead: T`Dla dowolnej liczby naturalnej $n$ oraz dowolnego kąta $\alpha\neq 2t\pi$, gdzie $t$ jest liczbą całkowitą, udowodnić następujące tożsamości trygonometryczne:`, disp: true, cols: 1, subs: [
      ['2.1', T`cos\alpha+cos(2\alpha)+\ldots+cos(n\alpha)=\frac{sin\frac{n\alpha}{2}\cdot cos\frac{(n+1)\alpha}{2}}{sin\frac{\alpha}{2}}`],
      ['2.2', T`sin\alpha+sin(2\alpha)+\ldots+sin(n\alpha)=\frac{sin\frac{n\alpha}{2}\cdot sin\frac{(n+1)\alpha}{2}}{sin\frac{\alpha}{2}}`],
      ['2.3', T`cos\alpha+2\cdot cos(2\alpha)+\ldots+n\cdot cos(n\alpha)=\frac{-1+(n+1)\cdot cos(n\alpha)-n\cdot cos((n+1)\alpha)}{4\cdot sin^2\left(\frac{\alpha}{2}\right)}`],
      ['2.4', T`sin\alpha+2\cdot sin(2\alpha)+\ldots+n\cdot sin(n\alpha)=\frac{(n+1)\cdot sin(n\alpha)-n\cdot sin((n+1)\alpha)}{4\cdot sin^2\left(\frac{\alpha}{2}\right)}`],
      ['2.5', T`\left(\frac{1+i\cdot tg\alpha}{1-i\cdot tg\alpha}\right)^n=\frac{1+i\cdot tg(n\alpha)}{1-i\cdot tg(n\alpha)}.`]] },
    '4.3': { st: T`Dla dowolnej liczby naturalnej $n$ oznaczmy przez $\varepsilon$ pierwiastek $n$-tego stopnia z jedynki. Obliczyć sumę $1+2\varepsilon+3\varepsilon^2+\ldots+n\varepsilon^{n-1}$.` },
    '4.4': { st: T`Dla dowolnej liczby naturalnej $n$ oznaczmy liczbę zespoloną $\omega=cos\frac{\pi}{2n+1}+i\cdot sin\frac{\pi}{2n+1}$. Obliczyć sumę $1-2\omega+3\omega^2-\ldots-2n\omega^{2n-1}+(2n+1)\omega^{2n}$.` },
    '4.5': { st: T`Na płaszczyźnie zespolonej zaznaczyć następujące liczby zespolone, liczby do nich przeciwne oraz liczby do nich sprzężone: $2+i$, $2-i$, $-3+4i$, $2$, $3i$, $-4-5i$.` },
    '4.6': { lead: T`Na płaszczyźnie zespolonej zaznaczyć następujące zbiory:`, cols: 1, subs: [
      ['6.1', T`$\{z\in\mathbb{C}:|z|+re(z)\leqslant 1\}$`], ['6.2', T`$\{z\in\mathbb{C}:|z-3+2i|\leqslant 5\}$`], ['6.3', T`$\{z\in\mathbb{C}:2\leqslant|z+5+5i|\leqslant 5\}$`],
      ['6.4', T`$\{z\in\mathbb{C}:3\leqslant|z+3-5i|\leqslant 5\}$`], ['6.5', T`$\{z\in\mathbb{C}:|z-4+2i|\leqslant|z-2i|\}$`], ['6.6', T`$\{z\in\mathbb{C}:|2z+1-4i|\leqslant|z+5-2i|\}$`],
      ['6.7', T`$\{z\in\mathbb{C}:|3z-1+i|\leqslant|2z+1+4i|\}$`], ['6.8', T`$\{z\in\mathbb{C}:|z+4+6i|\leqslant|z+1+7i|\leqslant|z+5+5i|\}$`], ['6.9', T`$\{z\in\mathbb{C}:|2z+1+4i|\leqslant|z+5+2i|\leqslant|2z-2-5i|\}$.`]] },
    '4.7': { lead: T`Na płaszczyźnie zespolonej zaznaczyć wszystkie liczby zespolone $z$ spełniające równanie`, disp: true, subs: [
      ['7.1', T`\left|\frac{z}{1-i}\right|-2z-2i=0`], ['7.2', T`\left|\frac{z}{1+i}\right|+iz-1=0.`]] },
    '4.8': { st: T`Załóżmy, że liczby zespolone $z_1=-1+2i$, $z_2=i$ oraz $z_3=3+3i$ umieszczone na płaszczyźnie $\mathbb{R}^2$ tworzą wierzchołki równoległoboku. Korzystając z interpretacji geometrycznej liczby zespolonej wyznaczyć liczbę zespoloną $z_4$ odpowiadającą czwartemu wierzchołkowi równoległoboku.` },
    '4.9': { st: T`Załóżmy, że liczby zespolone $z_1=-1+3i$, $z_2=3+i$ umieszczone na płaszczyźnie $\mathbb{R}^2$ tworzą wierzchołki trójkąta oraz, że liczba zespolona $s=2+3i$ umieszczona na płaszczyźnie $\mathbb{R}^2$ tworzy jego środek ciężkości<sup>1</sup>. Korzystając z interpretacji geometrycznej liczby zespolonej wyznaczyć liczbę zespoloną $z_3$ odpowiadającą trzeciemu wierzchołkowi trójkąta.<div class="lnote"><sup>1</sup>Środkową trójkąta nazywamy odcinek łączący wierzchołek trójkąta ze środkiem przeciwległego boku. Wszystkie środkowe trójkąta przecinają się w jednym punkcie zwanym środkiem ciężkości trójkąta. Punkt ten dzieli każdą środkową w stosunku $2:1$ licząc od wierzchołka trójkąta.</div>` },
    '4.10': { st: T`Podać interpretację geometryczną tożsamości $|z_1+z_2|^2+|z_1-z_2|^2=2(|z_1|^2+|z_2|^2)$.` },
    '4.11': { st: T`Na płaszczyźnie zespolonej dany jest trójkąt o wierzchołkach $z_1$, $z_2$ oraz $z_3$. Udowodnić, że trójkąt ten jest równoboczny wtedy i tylko wtedy, gdy $z_1^2+z_2^2+z_3^2=z_1z_2+z_2z_3+z_3z_1$.` },
    '4.12': { st: T`Korzystając z interpretacji geometrycznej liczby zespolonej udowodnić następujący fakt znany z geometrii euklidesowej: w czworokącie wypukłym suma kwadratów długości boków jest równa sumie kwadratów długości przekątnych powiększonej o kwadrat podwojonej długości odcinka łączącego środki obu przekątnych.` },
    '4.13': { st: T`Na płaszczyźnie zespolonej dany jest trójkąt o wierzchołkach $z_1$, $z_2$, $z_3$ oraz środku ciężkości $q$. Oznaczmy przez $z$ dowolny punkt płaszczyzny zespolonej. Korzystając z interpretacji geometrycznej liczby zespolonej udowodnić Twierdzenie Leibniza: $$|z-z_1|^2+|z-z_2|^2+|z-z_3|^2=|q-z_1|^2+|q-z_2|^2+|q-z_3|^2+3\cdot|q-z|^2.$$` },
    '4.14': { st: T`Korzystając z interpretacji geometrycznej pierwiastkowania liczb zespolonych wyznaczyć liczby zespolone $\omega_0$, $\omega_1$, $\omega_2$ odpowiadające wierzchołkom trójkąta równobocznego wpisanego w okrąg o środku w początku układu współrzędnych i promieniu 1, z jednym bokiem równoległym do osi urojonej oraz jednym wierzchołkiem na ujemnej półosi rzeczywistej.` },
    '4.15': { st: T`Korzystając z interpretacji geometrycznej pierwiastkowania liczb zespolonych, wyznaczyć liczby zespolone $\omega_0$, $\omega_1$, $\omega_2$, $\omega_3$, $\omega_4$, $\omega_5$ odpowiadające wierzchołkom sześciokąta foremnego wpisanego w okrąg o środku w punkcie $2+i\sqrt{3}$ i promieniu 2, z jednym bokiem równoległym do osi rzeczywistej.` },
  };
  A.LIST_ORIG = O;
  const apply = () => {
    for (const L of A.lists || []) {
      if ((L.subject || 'alg') !== 'alg') continue;
      for (const t of L.tasks || []) {
        const o = O[t.id]; if (!o) continue;
        const subs = (o.subs || []).map(([n, x]) => [n, o.disp ? D(x) : x]);
        t.statement = o.st || S(o.lead || '', subs, o.tail ? '<div class="ltail">' + o.tail + '</div>' : '', o.cols);
        const byNum = Object.fromEntries(subs);
        for (const it of t.items || []) {
          if (it.qKeep) continue;
          const key = (o.alias && o.alias[it.label]) || it.label;
          if (o.items && key in o.items) it.q = o.items[key] === '=' ? t.statement : o.items[key];
          else if (byNum[key]) it.q = byNum[key] + (o.itemTail || '');
        }
      }
    }
  };
  apply();
  A.applyListOrig = apply;
})();
