/* Algebra liniowa I — Lista 4: sumy trygonometryczne, geometria liczb zespolonych */
(function () {
  'use strict';
  const A = AQ, R = A.R, T = String.raw, Z = A.Z, Cx = A.C;
  const nc = z => A.niceC(z), nr = x => A.niceReal(x);
  const C = (a, b = 0) => Cx.C(a, b);
  const isNice = t => !/\d\.\d|e[+-]\d/.test(t);
  const showSet = arr => arr.map(nc).join(',\\quad ');
  const S3 = Math.sqrt(3);
  const zt = z => Z.tex(...z), zp = z => Z.ptex(...z);
  // ładny zapis „− (a+bi)” w treści: z − (−1+2i) → z+1−2i
  const minusZ = (z) => { const s = Z.tex(-z[0], -z[1]); return /^-/.test(s) ? s : '+' + s; };
  const abs2 = z => z[0] * z[0] + z[1] * z[1];

  /* ================= rysunki na płaszczyźnie zespolonej (SVG) ================= */
  let uid = 0;
  function plane(o) {
    const [x0, x1, y0, y1] = o.box, W = 300, s = W / (x1 - x0), H = Math.round((y1 - y0) * s);
    const X = x => ((x - x0) * s).toFixed(1), Y = y => ((y1 - y) * s).toFixed(1);
    const id = 'pl' + (++uid) + Math.floor(Math.random() * 1e6);
    const out = [];
    const step = (x1 - x0) > 26 ? 5 : (x1 - x0) > 14 ? 2 : 1;
    for (let x = Math.ceil(x0); x <= x1; x++) out.push(`<line x1="${X(x)}" y1="0" x2="${X(x)}" y2="${H}" stroke="currentColor" stroke-opacity="${x % step ? .05 : .12}"/>`);
    for (let y = Math.ceil(y0); y <= y1; y++) out.push(`<line x1="0" y1="${Y(y)}" x2="${W}" y2="${Y(y)}" stroke="currentColor" stroke-opacity="${y % step ? .05 : .12}"/>`);
    const fill = 'fill="var(--accent)" fill-opacity=".22"', line = 'stroke="var(--accent)" stroke-width="2" fill="none"';
    for (const g of o.shapes || []) {
      if (g.t === 'disk') out.push(`<circle cx="${X(g.c[0])}" cy="${Y(g.c[1])}" r="${(g.r * s).toFixed(1)}" ${fill}/>`, `<circle cx="${X(g.c[0])}" cy="${Y(g.c[1])}" r="${(g.r * s).toFixed(1)}" ${line}/>`);
      if (g.t === 'circle') out.push(`<circle cx="${X(g.c[0])}" cy="${Y(g.c[1])}" r="${(g.r * s).toFixed(1)}" ${line} stroke-dasharray="${g.dash ? '5 4' : ''}"/>`);
      if (g.t === 'ring') {
        const c = g.c, arc = r => `M${X(c[0] + r)} ${Y(c[1])}a${r * s} ${r * s} 0 1 0 ${-2 * r * s} 0a${r * s} ${r * s} 0 1 0 ${2 * r * s} 0Z`;
        out.push(`<path d="${arc(g.R)}${arc(g.r)}" fill-rule="evenodd" ${fill}/>`, `<circle cx="${X(c[0])}" cy="${Y(c[1])}" r="${g.R * s}" ${line}/>`, `<circle cx="${X(c[0])}" cy="${Y(c[1])}" r="${g.r * s}" ${line}/>`);
      }
      if (g.t === 'poly') out.push(`<polygon points="${g.p.map(q => X(q[0]) + ',' + Y(q[1])).join(' ')}" ${fill}/>`);
      if (g.t === 'path') out.push(`<polyline points="${g.p.map(q => X(q[0]) + ',' + Y(q[1])).join(' ')}" ${line}/>`);
      if (g.t === 'diskMinus') { // koło g.c,g.r bez wnętrza koła g.c2,g.r2
        out.push(`<mask id="${id}m"><rect width="${W}" height="${H}" fill="black"/><circle cx="${X(g.c[0])}" cy="${Y(g.c[1])}" r="${g.r * s}" fill="white"/><circle cx="${X(g.c2[0])}" cy="${Y(g.c2[1])}" r="${g.r2 * s}" fill="black"/></mask>`,
          `<rect width="${W}" height="${H}" ${fill} mask="url(#${id}m)"/>`, `<circle cx="${X(g.c[0])}" cy="${Y(g.c[1])}" r="${g.r * s}" ${line} stroke-dasharray="5 4" stroke-opacity=".6"/>`, `<circle cx="${X(g.c2[0])}" cy="${Y(g.c2[1])}" r="${g.r2 * s}" ${line} stroke-dasharray="5 4" stroke-opacity=".6"/>`);
      }
      if (g.t === 'seg') out.push(`<line x1="${X(g.a[0])}" y1="${Y(g.a[1])}" x2="${X(g.b[0])}" y2="${Y(g.b[1])}" stroke="${g.col || 'var(--accent)'}" stroke-width="${g.w || 2}" stroke-dasharray="${g.dash ? '5 4' : ''}"/>`);
    }
    // osie
    if (x0 <= 0 && x1 >= 0) out.push(`<line x1="${X(0)}" y1="0" x2="${X(0)}" y2="${H}" stroke="currentColor" stroke-opacity=".6"/>`);
    if (y0 <= 0 && y1 >= 0) out.push(`<line x1="0" y1="${Y(0)}" x2="${W}" y2="${Y(0)}" stroke="currentColor" stroke-opacity=".6"/>`);
    const fs = 'font-size="11" fill="currentColor" fill-opacity=".7"';
    if (y0 <= 0 && y1 >= 0) for (let x = Math.ceil(x0 / step) * step; x <= x1; x += step) if (x && x > x0 && x < x1) out.push(`<text x="${X(x)}" y="${+Y(0) + 12}" text-anchor="middle" ${fs}>${String(x).replace('-', '−')}</text>`);
    if (x0 <= 0 && x1 >= 0) for (let y = Math.ceil(y0 / step) * step; y <= y1; y += step) if (y && y > y0 && y < y1) out.push(`<text x="${+X(0) - 4}" y="${+Y(y) + 4}" text-anchor="end" ${fs}>${String(y).replace('-', '−')}i</text>`);
    for (const p of o.pts || []) {
      const col = p.col || 'var(--accent)';
      out.push(`<circle cx="${X(p.z[0])}" cy="${Y(p.z[1])}" r="4" fill="${col}"/>`);
      if (p.lab) out.push(`<text x="${+X(p.z[0]) + 6}" y="${+Y(p.z[1]) - 6}" font-size="12" fill="${col}">${p.lab}</text>`);
    }
    return `<div class="cplane"><svg viewBox="0 0 ${W} ${H}" width="100%" style="max-width:${W}px;height:auto;display:block;margin:6px auto;color:var(--text)" role="img" aria-label="${o.aria || 'rysunek na płaszczyźnie zespolonej'}">${out.join('').replace(/(\d\.\d)\d+/g, '$1')}</svg></div>`;
  }
  // wycinek kwadratu (prostokąta) półpłaszczyzną a·x+b·y+c ≤ 0
  function clip(poly, a, b, c) {
    const out = [], f = q => a * q[0] + b * q[1] + c;
    for (let k = 0; k < poly.length; k++) {
      const P = poly[k], Q = poly[(k + 1) % poly.length], fp = f(P), fq = f(Q);
      if (fp <= 0) out.push(P);
      if ((fp < 0 && fq > 0) || (fp > 0 && fq < 0)) { const t = fp / (fp - fq); out.push([P[0] + t * (Q[0] - P[0]), P[1] + t * (Q[1] - P[1])]); }
    }
    return out;
  }
  const boxPoly = b => [[b[0], b[2]], [b[1], b[2]], [b[1], b[3]], [b[0], b[3]]];
  const boxAround = (pts, pad = 2) => {
    let x0 = Math.min(0, ...pts.map(p => p[0])) - pad, x1 = Math.max(0, ...pts.map(p => p[0])) + pad, y0 = Math.min(0, ...pts.map(p => p[1])) - pad, y1 = Math.max(0, ...pts.map(p => p[1])) + pad;
    x0 = Math.floor(x0); x1 = Math.ceil(x1); y0 = Math.floor(y0); y1 = Math.ceil(y1);
    return [x0, x1, y0, y1];
  };
  const diskBox = (c, r) => boxAround([[c[0] - r, c[1] - r], [c[0] + r, c[1] + r]], 1);

  /* ================= 4.1, 4.2 — sumy trygonometryczne ================= */
  const fracPi = (p, q) => A.angleTex(p, q);
  function gen41() {
    const n = R.int(3, 9), kind = R.int(0, 2);
    if (kind === 0) {
      const sin = Math.random() < 0.5, f = sin ? 'sin' : 'cos';
      const terms = [...Array(n - 1)].map((_, k) => T`${'\\' + f}${fracPi(2 * (k + 1), n)}`);
      return { gk: 'sum', q: T`Oblicz: $${terms.join('+')}$.`, fields: [{ label: 'suma', ans: C(sin ? 0 : -1), restrict: ['plain'] }],
        steps: [T`To ${sin ? 'część urojona' : 'część rzeczywista'} sumy $\varepsilon+\varepsilon^2+\ldots+\varepsilon^{${n - 1}}$, gdzie $\varepsilon=\cos\frac{2\pi}{${n}}+i\sin\frac{2\pi}{${n}}$ (pierwiastek stopnia $${n}$ z jedynki).`,
          T`Ponieważ $\varepsilon^{${n}}=1$ i $\varepsilon\neq1$: $1+\varepsilon+\ldots+\varepsilon^{${n - 1}}=\frac{\varepsilon^{${n}}-1}{\varepsilon-1}=0$, więc $\varepsilon+\ldots+\varepsilon^{${n - 1}}=-1$.`,
          sin ? T`Część urojona liczby $-1$ to $0$. <b>Suma $=0$.</b>` : T`Część rzeczywista liczby $-1$ to $-1$. <b>Suma $=-1$.</b>`] };
    }
    if (kind === 1) {
      const sin = Math.random() < 0.5, f = sin ? 'sin' : 'cos';
      const terms = [...Array(n)].map((_, k) => T`${'\\' + f}${fracPi(2 * k + 1, n)}`);
      return { gk: 'sum', q: T`Oblicz: $${terms.join('+')}$.`, fields: [{ label: 'suma', ans: C(0), restrict: ['plain'] }],
        steps: [T`Niech $\eta=\cos\frac{\pi}{${n}}+i\sin\frac{\pi}{${n}}$. Wtedy $\eta^{2k+1}=\cos\frac{(2k+1)\pi}{${n}}+i\sin\frac{(2k+1)\pi}{${n}}$ — to są kolejne składniki.`,
          T`$\eta+\eta^3+\ldots+\eta^{${2 * n - 1}}=\eta\left(1+\eta^2+\ldots+(\eta^2)^{${n - 1}}\right)=\eta\cdot\frac{(\eta^2)^{${n}}-1}{\eta^2-1}$, a $(\eta^2)^{${n}}=\eta^{${2 * n}}=\cos2\pi+i\sin2\pi=1$.`,
          T`Cała suma zespolona jest równa $0$, więc jej ${sin ? 'część urojona' : 'część rzeczywista'} też. <b>Suma $=0$.</b>`] };
    }
    const m = R.int(1, 4), N = 2 * m + 1, sin = Math.random() < 0.5;
    const terms = sin ? [...Array(N - 1)].map((_, k) => (k % 2 ? '+' : '-') + T`\sin${fracPi(k + 1, N)}`) : ['1', ...[...Array(N - 1)].map((_, k) => (k % 2 ? '+' : '-') + T`\cos${fracPi(k + 1, N)}`)];
    return { gk: 'sum', q: T`Oblicz: $${terms.join('').replace(/^\+/, '')}$.`, fields: [{ label: 'suma', ans: C(0), restrict: ['plain'] }],
      steps: [T`Niech $\omega=\cos\frac{\pi}{${N}}+i\sin\frac{\pi}{${N}}$. Składniki ze znakami $+,-,+,\ldots$ to ${sin ? 'części urojone' : 'części rzeczywiste'} liczb $(-\omega)^k$, $k=0,1,\ldots,${N - 1}$.`,
        T`$(-\omega)^{${N}}=-\omega^{${N}}=-(\cos\pi+i\sin\pi)=1$ oraz $-\omega\neq1$.`,
        T`Suma ciągu geometrycznego: $\sum_{k=0}^{${N - 1}}(-\omega)^k=\frac{(-\omega)^{${N}}-1}{-\omega-1}=0$. <b>Suma $=0$.</b>`] };
  }
  const ALPHAS = [[1, 2], [1, 3], [2, 3], [1, 4], [3, 4], [1, 6], [5, 6], [1, 1]];
  function gen42(gk) {
    for (let tries = 0; tries < 200; tries++) {
      const [p, q] = R.pick(ALPHAS), al = p * Math.PI / q, n = R.int(3, 7), at = fracPi(p, q);
      if (gk === 'tg') {
        if (q === 2 || q === 1) continue;
        const v = Cx.polar(1, 2 * n * al), vt = nc(v); if (!isNice(vt)) continue;
        const tg = nr(Math.tan(al));
        return { gk, q: T`Oblicz: $\left(\frac{1+i\,\mathrm{tg}\,${at}}{1-i\,\mathrm{tg}\,${at}}\right)^{${n}}$ (wynik w postaci algebraicznej).`, fields: [{ label: 'wynik', ans: v, restrict: ['alg'] }],
          steps: [T`$1\pm i\,\mathrm{tg}\,\alpha=\frac{\cos\alpha\pm i\sin\alpha}{\cos\alpha}$, więc $\frac{1+i\,\mathrm{tg}\,\alpha}{1-i\,\mathrm{tg}\,\alpha}=\frac{\cos\alpha+i\sin\alpha}{\cos(-\alpha)+i\sin(-\alpha)}=\cos2\alpha+i\sin2\alpha$.`,
            T`Tutaj $\alpha=${at}$ (czyli $\mathrm{tg}\,\alpha=${tg}$). Z wzoru de Moivre’a potęga $${n}$ daje $\cos(${2 * n}\alpha)+i\sin(${2 * n}\alpha)$, a $${2 * n}\alpha=${fracPi(2 * n * p, q)}$.`,
            T`<b>Wynik: $${vt}$</b>`] };
      }
      const weighted = gk === 'k', sin = Math.random() < 0.5, f = sin ? 'sin' : 'cos';
      let s = 0; for (let k = 1; k <= n; k++) s += (weighted ? k : 1) * (sin ? Math.sin(k * al) : Math.cos(k * al));
      if (Math.abs(s - Math.round(s)) < 1e-9) s = Math.round(s); const st = nr(s); if (!isNice(st) || /\^\{/.test(st) || Math.abs(Math.sin(al / 2)) < 1e-9) continue;
      const terms = [...Array(n)].map((_, j) => (weighted && j ? (j + 1) + '\\cdot ' : '') + T`${'\\' + f}${fracPi((j + 1) * p, q)}`);
      const steps = weighted
        ? [T`To przykład na wzór z podpunktu ${sin ? '2.4' : '2.3'} dla $\alpha=${at}$, $n=${n}$ (bo $\alpha\neq2t\pi$).`,
          sin ? T`$\frac{(n+1)\sin(n\alpha)-n\sin((n+1)\alpha)}{4\sin^2\frac{\alpha}{2}}=\frac{${n + 1}\cdot ${nr(Math.sin(n * al))}-${n}\cdot ${A.parTex(nr(Math.sin((n + 1) * al)))}}{4\cdot ${A.parTex(nr(Math.sin(al / 2)))}^2}$`
            : T`$\frac{-1+(n+1)\cos(n\alpha)-n\cos((n+1)\alpha)}{4\sin^2\frac{\alpha}{2}}=\frac{-1+${n + 1}\cdot ${A.parTex(nr(Math.cos(n * al)))}-${n}\cdot ${A.parTex(nr(Math.cos((n + 1) * al)))}}{4\cdot ${A.parTex(nr(Math.sin(al / 2)))}^2}$`,
          T`<b>Suma $=${st}$</b> (można sprawdzić, dodając składniki po kolei).`]
        : [T`To przykład na wzór z podpunktu ${sin ? '2.2' : '2.1'} dla $\alpha=${at}$, $n=${n}$.`,
          T`$\frac{\sin\frac{n\alpha}{2}\cdot ${'\\' + f}\frac{(n+1)\alpha}{2}}{\sin\frac{\alpha}{2}}=\frac{${A.parTex(nr(Math.sin(n * al / 2)))}\cdot ${A.parTex(nr(sin ? Math.sin((n + 1) * al / 2) : Math.cos((n + 1) * al / 2)))}}{${nr(Math.sin(al / 2))}}$`,
          T`<b>Suma $=${st}$</b>`];
      return { gk, q: T`Oblicz: $${terms.join('+')}$.`, fields: [{ label: 'suma', ans: C(s), restrict: ['notrig'] }], steps };
    }
    return gen41();
  }

  /* ================= 4.3, 4.4 ================= */
  function gen43() {
    for (;;) {
      const n = R.pick([3, 4, 4, 6, 6, 8]), k = R.int(1, n - 1), eps = Cx.polar(1, 2 * k * Math.PI / n), et = nc(eps);
      if (!isNice(et)) continue;
      const v = Cx.div(C(n), Cx.sub(eps, C(1))), vt = nc(v); if (!isNice(vt)) continue;
      return { gk: 'num', q: T`Dla $\varepsilon=${et}$ (pierwiastek stopnia $${n}$ z jedynki) oblicz $${n <= 4 ? [...Array(n)].map((_, j) => (j ? (j + 1) : '1') + (j ? (j === 1 ? '\\varepsilon' : '\\varepsilon^{' + j + '}') : '')).join('+') : T`1+2\varepsilon+3\varepsilon^2+\ldots+${n}\varepsilon^{${n - 1}}`}$.`, fields: [{ label: 'suma', ans: v, restrict: ['alg'] }],
        steps: [T`Oznaczmy sumę przez $S$. Mnożymy przez $\varepsilon$ i odejmujemy: $S-\varepsilon S=1+\varepsilon+\ldots+\varepsilon^{${n - 1}}-${n}\varepsilon^{${n}}$.`,
          T`$\varepsilon^{${n}}=1$ i $\varepsilon\neq1$, więc $1+\varepsilon+\ldots+\varepsilon^{${n - 1}}=0$. Zostaje $(1-\varepsilon)S=-${n}$, czyli $S=\frac{${n}}{\varepsilon-1}$.`,
          T`$\varepsilon-1=${nc(Cx.sub(eps, C(1)))}$, więc $S=\frac{${n}}{${nc(Cx.sub(eps, C(1)))}}=${vt}$ (mnożymy licznik i mianownik przez sprzężenie mianownika).`, T`<b>$S=${vt}$</b>`] };
    }
  }
  function gen44() {
    for (;;) {
      const m = R.pick([3, 4, 6, 6]), j = R.int(0, 2 * m - 1), w = Cx.polar(1, j * Math.PI / m), z = Cx.neg(w);
      if (Cx.abs(Cx.sub(Cx.powInt(z, m), C(1))) > 1e-9 || Cx.abs(Cx.sub(z, C(1))) < 1e-9) continue;
      const wt = nc(w); if (!isNice(wt)) continue;
      const v = Cx.div(C(m), Cx.sub(z, C(1))), vt = nc(v); if (!isNice(vt)) continue;
      const terms = [...Array(m)].map((_, k) => (k ? (k % 2 ? '-' : '+') : '') + (k ? (k + 1) : '1') + (k ? (k === 1 ? 'w' : 'w^{' + k + '}') : '')).join('');
      return { gk: 'num', q: T`Dla $w=${wt}$ oblicz $${terms}$.`, fields: [{ label: 'suma', ans: v, restrict: ['alg'] }],
        steps: [T`Znaki się zmieniają, więc podstawiamy $u=-w$: suma to $1+2u+3u^2+\ldots+${m}u^{${m - 1}}$.`,
          T`$u=-w=${nc(z)}$ spełnia $u^{${m}}=1$ i $u\neq1$ — to pierwiastek stopnia $${m}$ z jedynki, jak w zadaniu 4.3.`,
          T`Z zadania 4.3: suma $=\frac{${m}}{u-1}=\frac{${m}}{${nc(Cx.sub(z, C(1)))}}=${vt}$.`, T`<b>Suma $=${vt}$</b>`] };
    }
  }

  /* ================= 4.5 ================= */
  function item45(label, z, gk = 'pt') {
    const neg = [-z[0], -z[1]], cj = [z[0], -z[1]];
    const pts = [{ z, lab: zt(z).replace(/-/g, '−'), col: 'var(--accent)' }, { z: neg, lab: '−z', col: 'var(--l2)' }, { z: cj, lab: 'z̄', col: 'var(--ok)' }];
    const fig = plane({ box: boxAround([z, neg, cj], 1.5), pts });
    const sol = [T`Liczba $z=${zt(z)}$ to punkt $(${z[0]},${z[1]})$: część rzeczywista na osi poziomej, urojona na pionowej.`,
      T`Liczba przeciwna $-z=${zt(neg)}$ — symetria względem początku układu (punkt $(0,0)$).`,
      T`Liczba sprzężona $\overline{z}=${zt(cj)}$ — symetria względem osi rzeczywistej (zmieniamy znak części urojonej).${z[1] === 0 ? T` Tu $z$ jest rzeczywista, więc $\overline z=z$.` : ''}${z[0] === 0 ? T` Tu $z$ jest czysto urojona, więc $\overline z=-z$.` : ''}`, fig];
    return { label, gk, qKeep: true, q: T`Zaznacz na płaszczyźnie liczbę $z=${zt(z)}$, liczbę do niej przeciwną i liczbę do niej sprzężoną. Podaj $-z$ oraz $\overline{z}$.`,
      fields: [{ label: '-z', ans: C(...neg), restrict: ['alg'] }, { label: '\\overline{z}', ans: C(...cj), restrict: ['alg', 'noabs'] }], sol };
  }
  const gen45 = () => { const t = R.int(0, 3); const z = t === 0 ? [R.nz(-5, 5), 0] : t === 1 ? [0, R.nz(-5, 5)] : Z.rnd(5); if (!z[0] && !z[1]) return gen45(); const it = item45('', z); it.steps = it.sol; delete it.sol; delete it.qKeep; return it; };

  /* ================= 4.6 — zbiory ================= */
  const setQ = st => T`Zaznacz na płaszczyźnie zespolonej zbiór $\{z\in\mathbb{C}:${st}\}$.`;
  function diskItem(label, c, r, gk = 'disk') { // |z − c| ≤ r
    const st = T`|z${minusZ(c)}|\leqslant ${r}`;
    return { label, gk, qKeep: true, q: setQ(st) + ' Podaj środek i promień koła.', fields: [{ label: 'środek', ans: C(...c), restrict: ['alg'] }, { label: 'r', ans: C(r), restrict: ['plain'] }],
      sol: [T`$|z-w|$ to odległość punktu $z$ od punktu $w$. Zapisujemy warunek w tej postaci: $|z${minusZ(c)}|=|z-(${zt(c)})|\leqslant ${r}$.`,
        T`To punkty odległe od $${zt(c)}$ o co najwyżej $${r}$: <b>koło domknięte o środku $${zt(c)}$ i promieniu $${r}$</b> (razem z okręgiem).`, plane({ box: diskBox(c, r), shapes: [{ t: 'disk', c, r }], pts: [{ z: c, lab: zt(c).replace(/-/g, '−') }] })] };
  }
  function ringItem(label, c, r, Rr, gk = 'ring') {
    const st = T`${r}\leqslant|z${minusZ(c)}|\leqslant ${Rr}`;
    return { label, gk, qKeep: true, q: setQ(st) + ' Podaj środek oraz promienie: mniejszy $r$ i większy $R$.', fields: [{ label: 'środek', ans: C(...c), restrict: ['alg'] }, { label: 'r', ans: C(r), restrict: ['plain'] }, { label: 'R', ans: C(Rr), restrict: ['plain'] }],
      sol: [T`$|z${minusZ(c)}|=|z-(${zt(c)})|$ — odległość punktu $z$ od punktu $${zt(c)}$.`,
        T`Odległość ma być co najmniej $${r}$ i co najwyżej $${Rr}$: <b>pierścień o środku $${zt(c)}$, między okręgami o promieniach $${r}$ i $${Rr}$</b> (oba okręgi należą do zbioru).`,
        plane({ box: diskBox(c, Rr), shapes: [{ t: 'ring', c, r, R: Rr }], pts: [{ z: c, lab: zt(c).replace(/-/g, '−') }] })] };
  }
  // |z − P| ≤ |z − Q|: półpłaszczyzna; brzeg y = a·x + b (o ile nie pionowy)
  function bisector(P, Q) {
    const dx = Q[0] - P[0], dy = Q[1] - P[1], mx = (P[0] + Q[0]) / 2, my = (P[1] + Q[1]) / 2;
    // dx(x−mx)+dy(y−my) ≤ 0 — bliżej P
    return { dx, dy, mx, my, a: dy ? -dx / dy : null, b: dy ? my + dx / dy * mx : null };
  }
  function lineItem(label, P, Q, gk = 'line') {
    const L = bisector(P, Q), st = T`|z${minusZ(P)}|\leqslant|z${minusZ(Q)}|`;
    const box = boxAround([P, Q], 3), poly = clip(boxPoly(box), L.dx, L.dy, -(L.dx * L.mx + L.dy * L.my));
    const ys = x => L.a * x + L.b, side = L.dy > 0 ? 'pod prostą (i na niej)' : 'nad prostą (i na niej)';
    const sgnI = L.dy > 0 ? '\\leqslant' : '\\geqslant';
    return { label, gk, qKeep: true, q: setQ(st) + T` Brzegiem zbioru jest prosta $y=ax+b$ — podaj $a$ i $b$.`, fields: [{ label: 'a', ans: C(L.a), restrict: ['plain'] }, { label: 'b', ans: C(L.b), restrict: ['plain'] }],
      sol: [T`$|z${minusZ(P)}|$ to odległość $z$ od punktu $P=${zt(P)}$, a $|z${minusZ(Q)}|$ — od punktu $Q=${zt(Q)}$. Szukamy punktów bliższych $P$ niż $Q$ (albo równo odległych).`,
        T`Punkty równo odległe od $P$ i $Q$ tworzą symetralną odcinka $PQ$. Środek odcinka: $\left(\frac{${P[0]}+${A.parTex(String(Q[0]))}}{2},\frac{${P[1]}+${A.parTex(String(Q[1]))}}{2}\right)=(${nr(L.mx)},${nr(L.my)})$.`,
        T`Wektor $\overrightarrow{PQ}=(${L.dx},${L.dy})$ jest prostopadły do symetralnej: $${L.dx}(x-${A.parTex(nr(L.mx))})+${A.parTex(String(L.dy))}(y-${A.parTex(nr(L.my))})=0$, czyli $y=${nr(L.a)}x${L.b < 0 ? '-' + nr(-L.b) : L.b > 0 ? '+' + nr(L.b) : ''}$. Stąd $a=${nr(L.a)}$, $b=${nr(L.b)}$.`,
        T`Po której stronie? Punkt $P$ należy do zbioru (jego odległość od siebie to $0$). Zbiór to <b>półpłaszczyzna $y${sgnI}${nr(L.a)}x${L.b < 0 ? '-' + nr(-L.b) : L.b > 0 ? '+' + nr(L.b) : ''}$</b> — ${side}.`,
        plane({ box, shapes: [{ t: 'poly', p: poly }, { t: 'seg', a: [box[0], ys(box[0])], b: [box[1], ys(box[1])] }], pts: [{ z: P, lab: 'P' }, { z: Q, lab: 'Q', col: 'var(--l2)' }] })] };
  }
  // |k·z + u| ≤ |z + v| (k = 2 lub 3/2 itp.) → okrąg Apoloniusza; dane: k1, u, k2, v jako |k1 z − u| ≤ |k2 z − v|
  function apolItem(label, k1, U, k2, V, gk = 'apol', texL, texR) {
    // (k1² − k2²)|z|² − 2Re(z·conj(k1 U − k2 V)) + |U|² − |V|² ≤ 0  (U, V — „przesunięcia” z k1·z − U, k2·z − V)
    const a = k1 * k1 - k2 * k2, wx = k1 * U[0] - k2 * V[0], wy = k1 * U[1] - k2 * V[1], c0 = abs2(U) - abs2(V);
    const cx = wx / a, cy = wy / a, r2 = cx * cx + cy * cy - c0 / a, r = Math.sqrt(r2);
    const st = T`|${texL}|\leqslant|${texR}|`;
    const xpart = (k, U) => T`(${k === 1 ? '' : k}x${U[0] ? (U[0] > 0 ? '-' + U[0] : '+' + -U[0]) : ''})^2+(${k === 1 ? '' : k}y${U[1] ? (U[1] > 0 ? '-' + U[1] : '+' + -U[1]) : ''})^2`;
    const lin = (co, v) => co === 0 ? '' : (co > 0 ? '-' : '+') + (Math.abs(co) === 1 ? '' : nr(Math.abs(co))) + v;
    return { label, gk, qKeep: true, q: setQ(st) + ' Podaj środek i promień koła.', fields: [{ label: 'środek', ans: C(cx, cy), restrict: ['alg'] }, { label: 'r', ans: C(r), restrict: [] }],
      sol: [T`Podstawiamy $z=x+iy$. Moduły są nieujemne, więc nierówność możemy podnieść do kwadratu: $|w|^2=(\mathrm{Re}\,w)^2+(\mathrm{Im}\,w)^2$.`,
        T`$${xpart(k1, U)}\leqslant ${xpart(k2, V)}$`,
        T`Wymnażamy nawiasy i przenosimy wszystko na lewo: $${nr(a)}x^2+${nr(a)}y^2${lin(2 * wx, 'x')}${lin(2 * wy, 'y')}${c0 > 0 ? '+' + c0 : c0 < 0 ? c0 : ''}\leqslant0$.`,
        T`Dzielimy przez $${nr(a)}$: $x^2+y^2${lin(2 * cx, 'x')}${lin(2 * cy, 'y')}${c0 / a > 0 ? '+' + nr(c0 / a) : c0 / a < 0 ? nr(c0 / a) : ''}\leqslant0$.`,
        T`Dopełniamy do kwadratów: $(x${cx > 0 ? '-' + nr(cx) : cx < 0 ? '+' + nr(-cx) : ''})^2+(y${cy > 0 ? '-' + nr(cy) : cy < 0 ? '+' + nr(-cy) : ''})^2\leqslant ${nr(r2)}$.`,
        T`To <b>koło domknięte o środku $${nc(C(cx, cy))}$ i promieniu $${nr(r)}$</b>.`, plane({ box: diskBox([cx, cy], r), shapes: [{ t: 'disk', c: [cx, cy], r }], pts: [{ z: [cx, cy], lab: nc(C(cx, cy)).replace(/\\sqrt\{(\d+)\}/g, '√$1').replace(/-/g, '−').replace(/ /g, '') }] })] };
  }
  const zSh = (k, U) => T`${k === 1 ? '' : k}z${minusZ(U)}`;
  function gen46(gk) {
    for (let tries = 0; tries < 300; tries++) {
      if (gk === 'disk') { const c = Z.rnd(5, false), r = R.int(1, 6); if (!c[0] && !c[1]) continue; const it = diskItem('', c, r); return fin(it); }
      if (gk === 'ring') { const c = Z.rnd(5, false), r = R.int(1, 3), Rr = r + R.int(1, 3); if (!c[0] || !c[1]) continue; return fin(ringItem('', c, r, Rr)); }
      if (gk === 'line') { const P = Z.rnd(5, false), Q = Z.rnd(5, false); if (P[1] === Q[1] || (P[0] - Q[0]) % (P[1] - Q[1]) || ((P[0] + Q[0]) % 2) || (P[1] + Q[1]) % 2) continue; return fin(lineItem('', P, Q)); }
      if (gk === 'apol') {
        // |2z − U| ≤ |z − V|  →  koło o środku (4P − V)/3, P = U/2; wybieramy środek całkowity i promień ładny
        const cc = Z.rnd(3, false), d = R.pick([[3, 0], [0, 3], [-3, 0], [0, -3], [3, 3], [-3, 3], [6, 0], [0, 6]]);
        const P = [cc[0] - d[0] / 3, cc[1] - d[1] / 3], V = [P[0] - d[0], P[1] - d[1]], U = [2 * P[0], 2 * P[1]];
        if (!Number.isInteger(U[0]) || !Number.isInteger(U[1])) continue;
        const k2 = 1, k1 = 2; return fin(apolItem('', k1, U, k2, V, 'apol', zSh(k1, U), zSh(k2, V)));
      }
      if (gk === 'wedge') return fin(wedgeGen());
      if (gk === 'parab') return fin(parabItem('', R.int(1, 3), R.pick(['x', 'y']), R.sign()));
    }
    return fin(diskItem('', [1, -2], 3));
  }
  const fin = it => { it.steps = it.sol; delete it.sol; delete it.qKeep; return it; };
  // 6.8 — dwie symetralne: kąt o wierzchołku w środku okręgu opisanego na trójkącie P, Q, S
  function wedgeItem(label, P, Q, S, gk = 'wedge') {
    const L1 = bisector(P, Q), L2 = bisector(Q, S);
    // wierzchołek: przecięcie symetralnych
    const a1 = L1.dx, b1 = L1.dy, c1 = L1.dx * L1.mx + L1.dy * L1.my, a2 = L2.dx, b2 = L2.dy, c2 = L2.dx * L2.mx + L2.dy * L2.my, det = a1 * b2 - a2 * b1;
    const v = [(c1 * b2 - c2 * b1) / det, (a1 * c2 - a2 * c1) / det];
    const box = boxAround([P, Q, S, v], 2);
    let poly = clip(boxPoly(box), L1.dx, L1.dy, -c1); poly = clip(poly, L2.dx, L2.dy, -c2);
    const eq = L => L.dy ? T`y=${nr(L.a)}x${L.b < 0 ? '-' + nr(-L.b) : L.b > 0 ? '+' + nr(L.b) : ''}` : T`x=${nr(L.mx)}`;
    const ln = L => L.dy ? [[box[0], L.a * box[0] + L.b], [box[1], L.a * box[1] + L.b]] : [[L.mx, box[2]], [L.mx, box[3]]];
    const st = T`|z${minusZ(P)}|\leqslant|z${minusZ(Q)}|\leqslant|z${minusZ(S)}|`;
    return { label, gk, qKeep: true, q: setQ(st) + ' Zbiór jest kątem — podaj jego wierzchołek.', fields: [{ label: 'wierzchołek', ans: C(...v), restrict: ['alg'] }],
      sol: [T`Oznaczmy $P=${zt(P)}$, $Q=${zt(Q)}$, $S=${zt(S)}$. Warunek mówi: $z$ jest nie dalej od $P$ niż od $Q$ <i>oraz</i> nie dalej od $Q$ niż od $S$.`,
        T`Pierwsza nierówność: półpłaszczyzna po stronie $P$, ograniczona symetralną odcinka $PQ$: $${eq(L1)}$.`,
        T`Druga nierówność: półpłaszczyzna po stronie $Q$, ograniczona symetralną odcinka $QS$: $${eq(L2)}$.`,
        T`Symetralne przecinają się w punkcie równo odległym od $P$, $Q$, $S$ (środek okręgu opisanego): rozwiązujemy układ i dostajemy $${nc(C(...v))}$.`,
        T`Zbiór to <b>część wspólna dwóch półpłaszczyzn — kąt o wierzchołku $${nc(C(...v))}$</b> (z brzegami).`,
        plane({ box, shapes: [{ t: 'poly', p: poly }, { t: 'seg', a: ln(L1)[0], b: ln(L1)[1] }, { t: 'seg', a: ln(L2)[0], b: ln(L2)[1], col: 'var(--l2)' }], pts: [{ z: P, lab: 'P' }, { z: Q, lab: 'Q' }, { z: S, lab: 'S' }, { z: v, lab: '', col: 'var(--text)' }] })] };
  }
  function wedgeGen() {
    for (;;) {
      const v = Z.rnd(3, false), r2 = R.pick([5, 10, 25, 13]);
      const on = []; for (let x = -6; x <= 6; x++) for (let y = -6; y <= 6; y++) if (x * x + y * y === r2) on.push([v[0] + x, v[1] + y]);
      const [P, Q, S] = R.shuffle(on).slice(0, 3);
      const cr = (Q[0] - P[0]) * (S[1] - P[1]) - (Q[1] - P[1]) * (S[0] - P[0]); if (Math.abs(cr) < 2) continue;
      if (P[1] === Q[1] || Q[1] === S[1]) continue;
      return wedgeItem('', P, Q, S);
    }
  }
  // 6.1 — |z| + Re z ≤ 1 (parabola); generator: |z| ± Re z ≤ c lub |z| ± Im z ≤ c
  function parabItem(label, c, which, sg, gk = 'parab') {
    const part = which === 'x' ? 're(z)' : 'im(z)', st = T`|z|${sg > 0 ? '+' : '-'}${part}\leqslant ${c}`;
    const v = sg > 0 ? T`${which}\leqslant\frac{${c * c}-${which === 'x' ? 'y' : 'x'}^2}{${2 * c}}` : T`${which}\geqslant\frac{${which === 'x' ? 'y' : 'x'}^2-${c * c}}{${2 * c}}`;
    const other = which === 'x' ? 'y' : 'x';
    const vert = sg > 0 ? c / 2 : -c / 2, vtex = sg > 0 ? nr(c / 2) : nr(-c / 2);
    const vertZ = which === 'x' ? C(vert, 0) : C(0, vert);
    const pts = []; for (let t = -2.5 * c - 1; t <= 2.5 * c + 1.001; t += 0.1) { const w = sg * (c * c - t * t) / (2 * c); pts.push(which === 'x' ? [w, t] : [t, w]); }
    const B = which === 'x' ? [-(2 * c + 2), c + 2, -(2 * c + 1), 2 * c + 1] : [-(2 * c + 1), 2 * c + 1, -(2 * c + 2), c + 2];
    if (sg < 0) { if (which === 'x') { B[0] = -(c + 2); B[1] = 2 * c + 2; } else { B[2] = -(c + 2); B[3] = 2 * c + 2; } }
    const big = 50, far = which === 'x' ? [[sg > 0 ? -big : big, 2.5 * c + 1], [sg > 0 ? -big : big, -2.5 * c - 1]] : [[-2.5 * c - 1, sg > 0 ? -big : big], [2.5 * c + 1, sg > 0 ? -big : big]];
    const PL = { L: 'na lewo od paraboli', P: 'na prawo od paraboli', D: 'pod parabolą', G: 'nad parabolą' }, good = sg > 0 ? (which === 'x' ? 'L' : 'D') : (which === 'x' ? 'P' : 'G'), bad = { L: 'P', P: 'L', D: 'G', G: 'D' }[good];
    const opts = [T`obszar ${PL[good]} o wierzchołku $${nc(vertZ)}$ (wraz z parabolą)`,
      T`koło o środku $0$ i promieniu $${c}$`, T`obszar ${PL[bad]} o wierzchołku $${nc(vertZ)}$ (wraz z parabolą)`, T`półpłaszczyzna $${which}\leqslant ${c}$`];
    return { label, gk, qKeep: true, type: 'choice', q: setQ(st) + ' Jaki to zbiór?', choice: { multi: false, opts, correct: [0] },
      sol: [T`Podstawiamy $z=x+iy$: $|z|=\sqrt{x^2+y^2}$, $\mathrm{${which === 'x' ? 'Re' : 'Im'}}\,z=${which}$. Warunek: $\sqrt{x^2+y^2}\leqslant ${c}${sg > 0 ? '-' : '+'}${which}$.`,
        T`Lewa strona jest nieujemna, więc musi być $${c}${sg > 0 ? '-' : '+'}${which}\geqslant0$. Wtedy obie strony są nieujemne i możemy podnieść do kwadratu: $x^2+y^2\leqslant ${c * c}${sg > 0 ? '-' : '+'}${2 * c}${which}+${which}^2$.`,
        T`$${which}^2$ się skraca: $${other}^2\leqslant ${c * c}${sg > 0 ? '-' : '+'}${2 * c}${which}$, czyli $${v}$. (Warunek z poprzedniego kroku jest wtedy spełniony automatycznie.)`,
        T`Brzeg $${which}=${sg > 0 ? '' : '-'}\frac{${c * c}-${other}^2}{${2 * c}}$ to parabola o wierzchołku $${nc(vertZ)}$ (dla $${other}=0$ wychodzi $${which}=${vtex}$), ramiona skierowane ${sg > 0 ? (which === 'x' ? 'w lewo' : 'w dół') : (which === 'x' ? 'w prawo' : 'w górę')}. <b>Zbiór: ${opts[0]}.</b>`,
        plane({ box: B, shapes: [{ t: 'poly', p: pts.concat(far) }, { t: 'path', p: pts }], pts: [{ z: [vertZ.re, vertZ.im], lab: '' }] })] };
  }
  // 6.9 — koło minus wnętrze drugiego koła
  function mixItem(label) {
    const opts = [T`część koła o środku $1-2i$ i promieniu $3$ leżąca na zewnątrz koła o środku $3+4i$ i promieniu $5$ (z brzegami)`, T`część wspólna koła o środku $1-2i$ i promieniu $3$ oraz koła o środku $3+4i$ i promieniu $5$`,
      T`pierścień o środku $1-2i$ i promieniach $3$ i $5$`, T`koło o środku $3+4i$ i promieniu $5$ bez koła o środku $1-2i$ i promieniu $3$`];
    return { label, gk: 'apol', qKeep: true, type: 'choice', q: setQ(T`|2z+1+4i|\leqslant|z+5+2i|\leqslant|2z-2-5i|`) + ' Jaki to zbiór?', choice: { multi: false, opts, correct: [0] },
      sol: [T`Rozdzielamy na dwie nierówności i każdą podnosimy do kwadratu (moduły są nieujemne), $z=x+iy$.`,
        T`$|2z+1+4i|\leqslant|z+5+2i|$: $(2x+1)^2+(2y+4)^2\leqslant(x+5)^2+(y+2)^2$.`,
        T`Po wymnożeniu: $4x^2+4x+1+4y^2+16y+16\leqslant x^2+10x+25+y^2+4y+4$, czyli $3x^2-6x+3y^2+12y-12\leqslant0$; po podzieleniu przez $3$: $x^2-2x+y^2+4y-4\leqslant0$.`,
        T`Dopełniamy do kwadratów: $(x-1)^2+(y+2)^2\leqslant9$ — koło o środku $1-2i$ i promieniu $3$.`,
        T`$|z+5+2i|\leqslant|2z-2-5i|$: $(x+5)^2+(y+2)^2\leqslant(2x-2)^2+(2y-5)^2$, czyli $x^2+10x+25+y^2+4y+4\leqslant4x^2-8x+4+4y^2-20y+25$.`,
        T`Przenosimy na prawo: $0\leqslant3x^2-18x+3y^2-24y$, po podzieleniu przez $3$: $x^2-6x+y^2-8y\geqslant0$, czyli $(x-3)^2+(y-4)^2\geqslant25$ — punkty poza otwartym kołem o środku $3+4i$ i promieniu $5$.`,
        T`<b>Zbiór: ${opts[0]}.</b>`, plane({ box: [-4, 9, -6, 10], shapes: [{ t: 'diskMinus', c: [1, -2], r: 3, c2: [3, 4], r2: 5 }], pts: [{ z: [1, -2], lab: '1−2i' }, { z: [3, 4], lab: '3+4i', col: 'var(--l2)' }] })] };
  }

  /* ================= 4.7 — |z/w| + p·z + q = 0 ================= */
  // |z|·s + p z + q = 0, s = 1/|w|; z = −(q + s|z|)/p; r=|z| z równania kwadratowego
  function solve47(s, p, q) {
    const P2 = Cx.abs(p) ** 2, a = P2 - s * s, b = -2 * s * q.re, c = -(Cx.abs(q) ** 2);
    const rs = Math.abs(a) < 1e-12 ? [-c / b] : (() => { const D = b * b - 4 * a * c; if (D < 0) return []; return [(-b + Math.sqrt(D)) / (2 * a), (-b - Math.sqrt(D)) / (2 * a)]; })();
    const out = [];
    for (const r of rs) { if (r < -1e-12) continue; const z = Cx.neg(Cx.div(Cx.add(q, C(s * r)), p)); if (Math.abs(Cx.abs(z) - r) < 1e-9 && !out.some(u => Cx.abs(Cx.sub(u, z)) < 1e-9)) out.push(z); }
    return out;
  }
  function item47(label, wTex, wAbs, p, q, gk = 'eq7', sol) {
    const sols = solve47(1 / wAbs, p, q);
    return { label, gk, fields: [{ label: 'z', kind: 'set', ans: () => sols, restrict: ['roots', 'noabs'], show: sols.length ? showSet(sols) : 'brak' }], keys: [';'], sol };
  }
  const SOL71 = [T`Moduł ilorazu to iloraz modułów: $\left|\frac{z}{1-i}\right|=\frac{|z|}{|1-i|}=\frac{|z|}{\sqrt2}$. Równanie: $\frac{|z|}{\sqrt2}-2z-2i=0$.`,
    T`Wyznaczamy $z$: $2z=\frac{|z|}{\sqrt2}-2i$, więc $z=\frac{|z|}{2\sqrt2}-i$. Część urojona $z$ to $-1$, a część rzeczywista $x=\frac{|z|}{2\sqrt2}\geqslant0$.`,
    T`Zatem $z=x-i$, $|z|=\sqrt{x^2+1}$ i $x=\frac{\sqrt{x^2+1}}{2\sqrt2}$. Podnosimy do kwadratu (obie strony nieujemne): $x^2=\frac{x^2+1}{8}$.`,
    T`$8x^2=x^2+1$, więc $7x^2=1$, $x^2=\frac17$ i (bo $x\geqslant0$) $x=\frac{1}{\sqrt7}=\frac{\sqrt7}{7}$.`,
    T`<b>$z=\frac{\sqrt7}{7}-i$</b> — jeden punkt na płaszczyźnie.`];
  const SOL72 = [T`$\left|\frac{z}{1+i}\right|=\frac{|z|}{|1+i|}=\frac{|z|}{\sqrt2}$. Równanie: $\frac{|z|}{\sqrt2}+iz-1=0$, czyli $iz=1-\frac{|z|}{\sqrt2}$.`,
    T`Prawa strona jest liczbą rzeczywistą, więc $iz$ jest rzeczywiste — czyli $z$ jest czysto urojone: $z=iy$, $y\in\mathbb R$. Wtedy $iz=i\cdot iy=-y$ i $|z|=|y|$.`,
    T`Równanie: $-y=1-\frac{|y|}{\sqrt2}$. Przypadek $y\geqslant0$: $-y=1-\frac{y}{\sqrt2}$, czyli $y\left(\frac{1}{\sqrt2}-1\right)=1$ — lewa strona jest $\leqslant0$, sprzeczność.`,
    T`Przypadek $y<0$ ($|y|=-y$): $-y=1+\frac{y}{\sqrt2}$, czyli $-y\left(1+\frac{1}{\sqrt2}\right)=1$, więc $y=-\frac{1}{1+\frac{1}{\sqrt2}}=-\frac{\sqrt2}{\sqrt2+1}$.`,
    T`Usuwamy niewymierność: $-\frac{\sqrt2}{\sqrt2+1}\cdot\frac{\sqrt2-1}{\sqrt2-1}=-\frac{2-\sqrt2}{1}=\sqrt2-2$ (to rzeczywiście liczba ujemna).`,
    T`<b>$z=(\sqrt2-2)i$</b> — jeden punkt na osi urojonej.`];
  function gen47() {
    const Ws = [['1-i', Math.SQRT2], ['1+i', Math.SQRT2], ['2', 2], ['i', 1], ['3+4i', 5], ['2i', 2]];
    for (let t = 0; t < 400; t++) {
      const [wt, wa] = R.pick(Ws), p = C(...R.pick([[-2, 0], [2, 0], [0, 1], [0, -1], [-1, 0], [0, 2], [-3, 0]])), q = C(...R.pick([[0, -2], [0, 2], [-1, 0], [1, 0], [0, 1], [-2, 0], [0, -3], [3, 0]]));
      const sols = solve47(1 / wa, p, q); if (sols.length !== 1) continue;
      const st = showSet(sols); if (!isNice(st) || /arctg/.test(st)) continue;
      const pt = nc(p), qt = nc(q);
      const eq = T`\left|\frac{z}{${wt}}\right|${/^-/.test(pt) ? '' : '+'}${pt === '1' ? '' : pt === '-1' ? '-' : pt}z${/^-/.test(qt) ? '' : '+'}${qt}=0`;
      const s = 1 / wa;
      return { gk: 'eq7', q: T`Wyznacz wszystkie $z\in\mathbb C$: $$${eq}$$`, fields: [{ label: 'z', kind: 'set', ans: () => sols, restrict: ['roots', 'noabs'], show: st }], keys: [';'],
        steps: [T`$\left|\frac{z}{${wt}}\right|=\frac{|z|}{${nr(wa)}}$ — moduł to liczba rzeczywista $\geqslant0$. Oznaczmy $r=|z|$.`,
          T`Wyznaczamy $z$ z równania: $z=-\frac{${qt}+\frac{r}{${nr(wa)}}}{${pt}}$ — dla danego $r$ to jeden konkretny punkt.`,
          T`Warunek zgodności: moduł tego punktu musi być równy $r$. Daje to równanie na $r\geqslant0$ (po podniesieniu do kwadratu — kwadratowe lub liniowe).`,
          T`Jedyne dopuszczalne $r$ to $${nr(Cx.abs(sols[0]))}$, stąd <b>$z=${st}$</b>.`] };
    }
    return gen45();
  }

  /* ================= 4.8, 4.9 ================= */
  function gen48(gk) {
    for (;;) {
      const a = Z.rnd(4, false), b = Z.rnd(4, false), c = Z.rnd(4, false);
      const cr = (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]); if (Math.abs(cr) < 2) continue;
      const d = Z.sub(Z.add(a, c), b), all = [d, Z.sub(Z.add(a, b), c), Z.sub(Z.add(b, c), a)];
      const fig = plane({ box: boxAround([a, b, c, ...all], 1), shapes: [{ t: 'seg', a, b }, { t: 'seg', a: b, b: c }, { t: 'seg', a: c, b: d, dash: true }, { t: 'seg', a: d, b: a, dash: true }], pts: [{ z: a, lab: 'z₁' }, { z: b, lab: 'z₂' }, { z: c, lab: 'z₃' }, { z: d, lab: 'z₄', col: 'var(--l2)' }] });
      if (gk === 'all') return { gk, q: T`Punkty $${zt(a)}$, $${zt(b)}$, $${zt(c)}$ są trzema wierzchołkami równoległoboku. Podaj wszystkie możliwe położenia czwartego wierzchołka.`, fields: [{ label: 'z_4', kind: 'set', ans: () => all.map(w => C(...w)), restrict: ['alg'] }], keys: [';'],
        steps: [T`Czwarty wierzchołek leży naprzeciw jednego z trzech danych. Przekątne równoległoboku dzielą się na pół, więc wierzchołek naprzeciw $w$ to suma dwóch pozostałych minus $w$.`,
          T`Naprzeciw $${zt(b)}$: $${zt(d)}$; naprzeciw $${zt(c)}$: $${zt(all[1])}$; naprzeciw $${zt(a)}$: $${zt(all[2])}$.`, T`<b>$z_4\in\{${all.map(zt).join(',\\ ')}\}$</b>`] };
      return { gk: 'par', q: T`Liczby $z_1=${zt(a)}$, $z_2=${zt(b)}$, $z_3=${zt(c)}$ to kolejne wierzchołki równoległoboku $z_1z_2z_3z_4$. Wyznacz $z_4$.`, fields: [{ label: 'z_4', ans: C(...d), restrict: ['alg'] }],
        steps: [T`W równoległoboku $z_1z_2z_3z_4$ wektor $\overrightarrow{z_2z_1}$ jest równy wektorowi $\overrightarrow{z_3z_4}$: $z_1-z_2=z_4-z_3$.`,
          T`Stąd $z_4=z_1+z_3-z_2=(${zt(a)})+(${zt(c)})-(${zt(b)})$.`, T`<b>$z_4=${zt(d)}$</b>`, fig] };
    }
  }
  function gen49() {
    for (;;) {
      const a = Z.rnd(4, false), b = Z.rnd(4, false), s = Z.rnd(3, false); const c = [3 * s[0] - a[0] - b[0], 3 * s[1] - a[1] - b[1]];
      const cr = (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]); if (Math.abs(cr) < 2 || Math.abs(c[0]) > 9 || Math.abs(c[1]) > 9) continue;
      return { gk: 'cent', q: T`Wierzchołkami trójkąta są $z_1=${zt(a)}$, $z_2=${zt(b)}$ i $z_3$, a jego środkiem ciężkości jest $s=${zt(s)}$. Wyznacz $z_3$.`, fields: [{ label: 'z_3', ans: C(...c), restrict: ['alg'] }],
        steps: [T`Środek ciężkości to średnia wierzchołków: $s=\frac{z_1+z_2+z_3}{3}$.`, T`Stąd $z_3=3s-z_1-z_2=3(${zt(s)})-(${zt(a)})-(${zt(b)})=${zt([3 * s[0], 3 * s[1]])}-(${zt(Z.add(a, b))})$.`, T`<b>$z_3=${zt(c)}$</b>`] };
    }
  }

  /* ================= 4.10–4.13 — liczbowe sprawdzenia ================= */
  function gen410() {
    for (;;) {
      const a = R.int(2, 9), b = R.int(2, 9), e = R.int(Math.abs(a - b) + 1, a + b - 1); const f2 = 2 * (a * a + b * b) - e * e; if (f2 <= 0) continue;
      const ft = nr(Math.sqrt(f2)); if (!isNice(ft)) continue;
      return { gk: 'par', q: T`Boki równoległoboku mają długości $${a}$ i $${b}$, a jedna z przekątnych ma długość $${e}$. Oblicz długość drugiej przekątnej.`, fields: [{ label: 'f', ans: C(Math.sqrt(f2)), restrict: [] }],
        steps: [T`Tożsamość z zadania: jeśli boki to $|z_1|$ i $|z_2|$, to przekątne to $|z_1+z_2|$ i $|z_1-z_2|$, a $|z_1+z_2|^2+|z_1-z_2|^2=2(|z_1|^2+|z_2|^2)$.`,
          T`$${e}^2+f^2=2(${a}^2+${b}^2)=2\cdot ${a * a + b * b}=${2 * (a * a + b * b)}$, więc $f^2=${2 * (a * a + b * b)}-${e * e}=${f2}$.`, T`<b>$f=${ft}$</b>`] };
    }
  }
  function gen411() {
    for (;;) {
      const a = Z.rnd(3, false), up = Math.random() < 0.5, d = R.pick([2, 4, 6]) * R.sign();
      const horiz = Math.random() < 0.5, b = horiz ? [a[0] + d, a[1]] : [a[0], a[1] + d];
      const rot = Cx.polar(1, (up ? 1 : -1) * Math.PI / 3), v = Cx.add(C(...a), Cx.mul(Cx.sub(C(...b), C(...a)), rot));
      const cond = horiz ? (v.im > a[1] ? T`\mathrm{Im}\,z_3>${a[1]}` : T`\mathrm{Im}\,z_3<${a[1]}`) : (v.re > a[0] ? T`\mathrm{Re}\,z_3>${a[0]}` : T`\mathrm{Re}\,z_3<${a[0]}`);
      return { gk: 'eq3', q: T`Trójkąt o wierzchołkach $z_1=${zt(a)}$, $z_2=${zt(b)}$, $z_3$ jest równoboczny i $${cond}$. Wyznacz $z_3$.`, fields: [{ label: 'z_3', ans: v, restrict: ['alg'] }],
        steps: [T`Wierzchołek $z_3$ dostajemy, obracając wektor $z_2-z_1=${zt(Z.sub(b, a))}$ o kąt $\pm\frac{\pi}{3}$ wokół $z_1$: $z_3=z_1+(z_2-z_1)\left(\frac12\pm\frac{\sqrt3}{2}i\right)$.`,
          T`Warunek $${cond}$ wybiera znak ${up ? '$+$' : '$-$'}: $(${zt(Z.sub(b, a))})\left(\frac12${up ? '+' : '-'}\frac{\sqrt3}{2}i\right)=${nc(Cx.mul(Cx.sub(C(...b), C(...a)), rot))}$.`,
          T`<b>$z_3=${nc(v)}$</b>. Sprawdzenie z zadania 4.11: $z_1^2+z_2^2+z_3^2=z_1z_2+z_2z_3+z_3z_1$.`] };
    }
  }
  function gen412() {
    for (;;) {
      const P = [Z.rnd(4, false), Z.rnd(4, false), Z.rnd(4, false), Z.rnd(4, false)];
      let convex = true; for (let k = 0; k < 4; k++) { const a = P[k], b = P[(k + 1) % 4], c = P[(k + 2) % 4]; const cr = (b[0] - a[0]) * (c[1] - b[1]) - (b[1] - a[1]) * (c[0] - b[0]); if (cr <= 0) convex = false; }
      if (!convex) continue;
      const sides = [0, 1, 2, 3].map(k => abs2(Z.sub(P[k], P[(k + 1) % 4]))), d1 = abs2(Z.sub(P[0], P[2])), d2 = abs2(Z.sub(P[1], P[3]));
      const m4 = abs2(Z.sub(Z.add(P[0], P[2]), Z.add(P[1], P[3]))); // = (2|M−N|)^2
      return { gk: 'quad', q: T`Czworokąt wypukły ma kolejne wierzchołki $${P.map(zt).join(',\\ ')}$. Oblicz $(2m)^2$, gdzie $m$ to odległość środków przekątnych.`, fields: [{ label: '(2m)^2', ans: C(m4), restrict: ['plain'] }],
        steps: [T`Suma kwadratów boków: $${sides.join('+')}=${sides.reduce((x, y) => x + y)}$ (każdy kwadrat boku liczymy jako $|z_k-z_{k+1}|^2$).`,
          T`Kwadraty przekątnych: $${d1}$ i $${d2}$, razem $${d1 + d2}$.`, T`Z twierdzenia z zadania 4.12: $(2m)^2=${sides.reduce((x, y) => x + y)}-${d1 + d2}=${m4}$.`,
          T`Sprawdzenie wprost: $2m=|(z_1+z_3)-(z_2+z_4)|=|${zt(Z.sub(Z.add(P[0], P[2]), Z.add(P[1], P[3])))}|$, a kwadrat tego modułu to $${m4}$. <b>$(2m)^2=${m4}$</b>`] };
    }
  }
  function gen413() {
    for (;;) {
      const a = Z.rnd(4, false), b = Z.rnd(4, false), c = Z.rnd(4, false); const sx = a[0] + b[0] + c[0], sy = a[1] + b[1] + c[1];
      if (sx % 3 || sy % 3) continue; const cr = (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]); if (Math.abs(cr) < 2) continue;
      const q = [sx / 3, sy / 3], z = Z.rnd(4, false); const lhs = abs2(Z.sub(z, a)) + abs2(Z.sub(z, b)) + abs2(Z.sub(z, c)), qs = abs2(Z.sub(q, a)) + abs2(Z.sub(q, b)) + abs2(Z.sub(q, c));
      return { gk: 'leib', q: T`Trójkąt ma wierzchołki $${zt(a)}$, $${zt(b)}$, $${zt(c)}$. Oblicz $|z-z_1|^2+|z-z_2|^2+|z-z_3|^2$ dla $z=${zt(z)}$.`, fields: [{ label: 'suma', ans: C(lhs), restrict: ['plain'] }],
        steps: [T`Środek ciężkości: $q=\frac{z_1+z_2+z_3}{3}=\frac{${zt([sx, sy])}}{3}=${zt(q)}$.`,
          T`$|q-z_1|^2+|q-z_2|^2+|q-z_3|^2=${abs2(Z.sub(q, a))}+${abs2(Z.sub(q, b))}+${abs2(Z.sub(q, c))}=${qs}$, a $|q-z|^2=|${zt(Z.sub(q, z))}|^2=${abs2(Z.sub(q, z))}$.`,
          T`Twierdzenie Leibniza: suma $=${qs}+3\cdot ${abs2(Z.sub(q, z))}=${lhs}$ (to samo wychodzi z liczenia wprost).`, T`<b>${lhs}</b>`] };
    }
  }

  /* ================= 4.14, 4.15 — wielokąty foremne ================= */
  const CONDS = [
    [n => Math.PI, 'jednym wierzchołkiem na ujemnej półosi rzeczywistej (licząc od środka okręgu)'],
    [n => 0, 'jednym wierzchołkiem na dodatniej półosi rzeczywistej (licząc od środka okręgu)'],
    [n => Math.PI / 2, 'jednym wierzchołkiem dokładnie nad środkiem okręgu'],
    [n => Math.PI / 2 - Math.PI / n, 'jednym bokiem równoległym do osi rzeczywistej'],
    [n => -Math.PI / n, 'jednym bokiem równoległym do osi urojonej'],
  ];
  function polyItem(n, c, r, phi0, cond, cTex) {
    const cl = x => (Math.abs(x - Math.round(x)) < 1e-9 ? Math.round(x) : x), ws = [...Array(n)].map((_, k) => { const w = Cx.add(c, Cx.polar(r, phi0 + 2 * k * Math.PI / n)); return C(cl(w.re), cl(w.im)); });
    const st = showSet(ws), rn = nr(r);
    const name = { 3: 'trójkąta równobocznego', 4: 'kwadratu', 6: 'sześciokąta foremnego' }[n];
    const fig = plane({ box: boxAround(ws.map(w => [w.re, w.im]).concat([[c.re, c.im]]), 1), shapes: ws.map((w, k) => ({ t: 'seg', a: [w.re, w.im], b: [ws[(k + 1) % n].re, ws[(k + 1) % n].im] })).concat([{ t: 'circle', c: [c.re, c.im], r, dash: true }]), pts: ws.map((w, k) => ({ z: [w.re, w.im], lab: 'ω' + '₀₁₂₃₄₅'[k] })) });
    const steps = [T`Wierzchołki ${name} wpisanego w okrąg o środku $${cTex}$ i promieniu $${rn}$ to $${cTex}+w$, gdzie $w$ przebiega wierzchołki takiego samego wielokąta o środku w $0$ — czyli wszystkie wartości $\sqrt[${n}]{w_0^{${n}}}$ dla jednego wierzchołka $w_0$.`,
      T`Kolejne wierzchołki różnią się obrotem o $\frac{2\pi}{${n}}$: $w_k=${rn === '1' ? '' : rn}\left(\cos(\varphi_0+\tfrac{2k\pi}{${n}})+i\sin(\varphi_0+\tfrac{2k\pi}{${n}})\right)$.`,
      T`Warunek „${cond}” wyznacza kąt startowy: $\varphi_0=${A.argTex(Cx.polar(1, phi0))}$ (${/bokiem/.test(cond) ? 'bok między $w_0$ i $w_1$ ma wtedy środek na osi prostopadłej do tego boku' : 'wierzchołek $w_0$ leży na wskazanej półprostej'}).`,
      T`<b>$\{${st}\}$</b>`, fig];
    return { ws, st, steps, name };
  }
  function gen414() {
    for (let t = 0; t < 300; t++) {
      const n = R.pick([3, 4, 6]), [f, cond] = R.pick(CONDS), r = R.pick(n === 4 ? [1, 2, Math.SQRT2, 2 * Math.SQRT2] : [1, 2, 4]);
      const c = R.pick([C(0), C(0), C(R.int(-2, 2), R.int(-2, 2)), C(1, S3), C(-2, S3), C(S3, 1)]);
      const P = polyItem(n, c, r, f(n), cond, nc(c));
      if (!isNice(P.st) || /arctg/.test(P.st)) continue;
      return { gk: 'poly', q: T`Wyznacz wierzchołki ${P.name} wpisanego w okrąg o środku $${nc(c)}$ i promieniu $${nr(r)}$, z ${cond}.`, fields: [{ label: '\\omega_k', kind: 'set', ans: () => P.ws, restrict: ['roots'] }], keys: [';'], steps: P.steps };
    }
  }

  /* ================= dowody (kolejność kroków) ================= */
  const ord = (label, q, steps, extra, gk) => ({ label, type: 'order', gk, qKeep: true, q, order: { steps, extra } });

  A.addList({
    num: 4, id: 'l4', title: 'Lista 4', name: 'Sumy trygonometryczne i geometria liczb zespolonych', hue: 'l4',
    blurb: 'Sumy cosinusów i sinusów przez pierwiastki z jedynki, zbiory na płaszczyźnie zespolonej, równoległoboki, trójkąty i wielokąty foremne.',
    tasks: [
      {
        id: '4.1', name: 'Sumy cosinusów i sinusów', statement: '',
        wzory: [T`$\varepsilon=\cos\frac{2\pi}{n}+i\sin\frac{2\pi}{n}$: $\varepsilon^k=\cos\frac{2k\pi}{n}+i\sin\frac{2k\pi}{n}$ (de Moivre), $\varepsilon^n=1$.`, T`Suma ciągu geometrycznego: $1+q+\ldots+q^{m-1}=\frac{q^m-1}{q-1}$ dla $q\neq1$.`, T`$w=0\iff\mathrm{Re}\,w=0$ i $\mathrm{Im}\,w=0$.`],
        gen: gen41,
        items: [
          ord('1.1–1.2', T`Ułóż dowód tożsamości 1.1 i 1.2: $$1+cos\frac{2\pi}{n}+\ldots+cos\frac{2(n-1)\pi}{n}=0,\qquad sin\frac{2\pi}{n}+\ldots+sin\frac{2(n-1)\pi}{n}=0.$$`, [
            T`Niech $\varepsilon=\cos\frac{2\pi}{n}+i\sin\frac{2\pi}{n}$. Ze wzoru de Moivre’a $\varepsilon^k=\cos\frac{2k\pi}{n}+i\sin\frac{2k\pi}{n}$.`,
            T`$\varepsilon^n=\cos2\pi+i\sin2\pi=1$, a dla $n\geqslant2$ jest $\varepsilon\neq1$.`,
            T`Z wzoru na sumę ciągu geometrycznego: $1+\varepsilon+\ldots+\varepsilon^{n-1}=\frac{\varepsilon^n-1}{\varepsilon-1}=\frac{1-1}{\varepsilon-1}=0$.`,
            T`Ta suma to $\left(1+\cos\frac{2\pi}{n}+\ldots+\cos\frac{2(n-1)\pi}{n}\right)+i\left(\sin\frac{2\pi}{n}+\ldots+\sin\frac{2(n-1)\pi}{n}\right)$.`,
            T`Liczba zespolona jest zerem dokładnie wtedy, gdy jej część rzeczywista i urojona są zerami — to są tożsamości 1.1 i 1.2. $\blacksquare$`],
            [T`$1+\varepsilon+\ldots+\varepsilon^{n-1}=n$, bo każdy składnik ma moduł $1$.`], 'sum'),
          ord('1.3–1.4', T`Ułóż dowód tożsamości 1.3 i 1.4: $$cos\frac{\pi}{n}+cos\frac{3\pi}{n}+\ldots+cos\frac{(2n-1)\pi}{n}=0,\qquad sin\frac{\pi}{n}+\ldots+sin\frac{(2n-1)\pi}{n}=0.$$`, [
            T`Niech $\eta=\cos\frac{\pi}{n}+i\sin\frac{\pi}{n}$. Wtedy $\eta^{2k-1}=\cos\frac{(2k-1)\pi}{n}+i\sin\frac{(2k-1)\pi}{n}$.`,
            T`$\eta^{2n}=\cos2\pi+i\sin2\pi=1$, a $\eta^2=\cos\frac{2\pi}{n}+i\sin\frac{2\pi}{n}\neq1$ dla $n\geqslant2$.`,
            T`$\eta+\eta^3+\ldots+\eta^{2n-1}=\eta\left(1+\eta^2+\ldots+(\eta^2)^{n-1}\right)=\eta\cdot\frac{(\eta^2)^n-1}{\eta^2-1}=0$.`,
            T`Część rzeczywista tej sumy to lewa strona 1.3, a część urojona — lewa strona 1.4; obie są więc równe $0$. $\blacksquare$`],
            [T`$\eta^{n}=1$, więc $\eta$ jest pierwiastkiem $n$-tego stopnia z jedynki.`], 'sum'),
          ord('1.5–1.6', T`Ułóż dowód tożsamości 1.5 i 1.6: $$1-cos\frac{\pi}{2n+1}+cos\frac{2\pi}{2n+1}-\ldots+cos\frac{2n\pi}{2n+1}=0,\qquad -sin\frac{\pi}{2n+1}+sin\frac{2\pi}{2n+1}-\ldots+sin\frac{2n\pi}{2n+1}=0.$$`, [
            T`Niech $\omega=\cos\frac{\pi}{2n+1}+i\sin\frac{\pi}{2n+1}$. Składniki ze znakami $+,-,+,\ldots$ to części liczb $(-\omega)^k=(-1)^k\left(\cos\frac{k\pi}{2n+1}+i\sin\frac{k\pi}{2n+1}\right)$, $k=0,\ldots,2n$.`,
            T`$(-\omega)^{2n+1}=-\omega^{2n+1}=-(\cos\pi+i\sin\pi)=1$, a $-\omega\neq1$.`,
            T`Suma ciągu geometrycznego: $\sum_{k=0}^{2n}(-\omega)^k=\frac{(-\omega)^{2n+1}-1}{-\omega-1}=0$.`,
            T`Część rzeczywista tej sumy to lewa strona 1.5, część urojona — lewa strona 1.6; obie są równe $0$. $\blacksquare$`],
            [T`$\omega^{2n+1}=1$.`], 'sum'),
        ],
      },
      {
        id: '4.2', name: 'Sumy z kątem α', statement: '',
        wzory: [T`$z=\cos\alpha+i\sin\alpha\neq1$ dla $\alpha\neq2t\pi$.`, T`$\cos x+i\sin x-1=2i\sin\frac{x}{2}\left(\cos\frac{x}{2}+i\sin\frac{x}{2}\right)$.`, T`$\sum_{k=1}^n kz^k=\frac{z\left(1-(n+1)z^n+nz^{n+1}\right)}{(1-z)^2}$.`, T`$1\pm i\,\mathrm{tg}\,\alpha=\frac{\cos\alpha\pm i\sin\alpha}{\cos\alpha}$.`],
        gen: gen42,
        items: [
          ord('2.1–2.2', T`Ułóż dowód tożsamości 2.1 i 2.2 (sumy $\cos(k\alpha)$ i $\sin(k\alpha)$ dla $k=1,\ldots,n$).`, [
            T`Niech $z=\cos\alpha+i\sin\alpha$. Ponieważ $\alpha\neq2t\pi$, jest $z\neq1$, a $z^k=\cos(k\alpha)+i\sin(k\alpha)$.`,
            T`$z+z^2+\ldots+z^n=z\cdot\frac{z^n-1}{z-1}$ (suma ciągu geometrycznego).`,
            T`Dla każdego $x$: $\cos x+i\sin x-1=2i\sin\frac{x}{2}\left(\cos\frac{x}{2}+i\sin\frac{x}{2}\right)$. Stosujemy to do $z^n-1$ (z $x=n\alpha$) i do $z-1$ (z $x=\alpha$).`,
            T`Po skróceniu $2i$: suma $=\frac{\sin\frac{n\alpha}{2}}{\sin\frac{\alpha}{2}}\left(\cos\frac{(n+1)\alpha}{2}+i\sin\frac{(n+1)\alpha}{2}\right)$ (argumenty: $\alpha+\frac{n\alpha}{2}-\frac{\alpha}{2}=\frac{(n+1)\alpha}{2}$).`,
            T`Porównujemy części rzeczywiste (2.1) i urojone (2.2). $\blacksquare$`],
            [T`$z^n-1=(z-1)^n$.`], 'cs'),
          ord('2.3–2.4', T`Ułóż dowód tożsamości 2.3 i 2.4 (sumy $k\cos(k\alpha)$ i $k\sin(k\alpha)$).`, [
            T`Niech $z=\cos\alpha+i\sin\alpha\neq1$ i $S=z+2z^2+\ldots+nz^n$.`,
            T`$S-zS=z+z^2+\ldots+z^n-nz^{n+1}$, skąd $S=\frac{z\left(1-(n+1)z^n+nz^{n+1}\right)}{(1-z)^2}$.`,
            T`$1-z=-2i\sin\frac{\alpha}{2}\left(\cos\frac{\alpha}{2}+i\sin\frac{\alpha}{2}\right)$, więc $(1-z)^2=-4\sin^2\frac{\alpha}{2}\cdot z$.`,
            T`Zatem $S=\frac{-1+(n+1)z^n-nz^{n+1}}{4\sin^2\frac{\alpha}{2}}$, gdzie $z^n=\cos(n\alpha)+i\sin(n\alpha)$, $z^{n+1}=\cos((n+1)\alpha)+i\sin((n+1)\alpha)$.`,
            T`Część rzeczywista daje 2.3, część urojona — 2.4. $\blacksquare$`],
            [T`$(1-z)^2=1-z^2$.`], 'k'),
          ord('2.5', T`Ułóż dowód tożsamości 2.5: $$\left(\frac{1+i\cdot tg\alpha}{1-i\cdot tg\alpha}\right)^n=\frac{1+i\cdot tg(n\alpha)}{1-i\cdot tg(n\alpha)}.$$`, [
            T`$1+i\,\mathrm{tg}\,\alpha=\frac{\cos\alpha+i\sin\alpha}{\cos\alpha}$ oraz $1-i\,\mathrm{tg}\,\alpha=\frac{\cos\alpha-i\sin\alpha}{\cos\alpha}=\frac{\cos(-\alpha)+i\sin(-\alpha)}{\cos\alpha}$.`,
            T`Dzieląc (moduły $1$, argumenty odejmujemy): $\frac{1+i\,\mathrm{tg}\,\alpha}{1-i\,\mathrm{tg}\,\alpha}=\cos2\alpha+i\sin2\alpha$.`,
            T`Z wzoru de Moivre’a lewa strona to $\cos(2n\alpha)+i\sin(2n\alpha)$.`,
            T`Ten sam rachunek dla kąta $n\alpha$ daje prawą stronę: $\cos(2n\alpha)+i\sin(2n\alpha)$. Strony są równe. $\blacksquare$`],
            [T`$\frac{1+i\,\mathrm{tg}\,\alpha}{1-i\,\mathrm{tg}\,\alpha}=\mathrm{tg}\,2\alpha$.`], 'tg'),
          { label: 'α=π/3, n=4', gk: 'cs', qKeep: true, q: T`Sprawdź wzór 2.1 na przykładzie: oblicz $\cos\frac{\pi}{3}+\cos\frac{2\pi}{3}+\cos\pi+\cos\frac{4\pi}{3}$.`, fields: [{ label: 'suma', ans: C(-1.5), restrict: ['notrig'] }],
            sol: [T`Wprost: $\frac12-\frac12-1-\frac12=-\frac32$.`, T`Ze wzoru 2.1 ($n=4$, $\alpha=\frac{\pi}{3}$): $\frac{\sin\frac{2\pi}{3}\cos\frac{5\pi}{6}}{\sin\frac{\pi}{6}}=\frac{\frac{\sqrt3}{2}\cdot\left(-\frac{\sqrt3}{2}\right)}{\frac12}=-\frac34\cdot2=-\frac32$.`, T`<b>$-\frac32$</b>`] },
        ],
      },
      {
        id: '4.3', name: 'Suma 1+2ε+…+nεⁿ⁻¹', statement: '',
        wzory: [T`$\varepsilon^n=1$; dla $\varepsilon\neq1$: $1+\varepsilon+\ldots+\varepsilon^{n-1}=0$.`, T`Sztuczka: $S-\varepsilon S$ — składniki się „przesuwają”.`, T`$1+2+\ldots+n=\frac{n(n+1)}{2}$.`],
        gen: gen43,
        items: [
          { label: 'wynik', type: 'choice', gk: 'num', qKeep: true, q: T`Ile wynosi $1+2\varepsilon+3\varepsilon^2+\ldots+n\varepsilon^{n-1}$ dla pierwiastka $\varepsilon\neq1$ stopnia $n$ z jedynki?`, choice: { multi: false, opts: [T`$\frac{n}{\varepsilon-1}$`, T`$\frac{n}{1-\varepsilon}$`, T`$0$`, T`$\frac{n(n+1)}{2}$`], correct: [0] },
            sol: [T`Oznaczmy sumę przez $S$. Wtedy $\varepsilon S=\varepsilon+2\varepsilon^2+\ldots+(n-1)\varepsilon^{n-1}+n\varepsilon^n$.`, T`Odejmujemy: $S-\varepsilon S=1+\varepsilon+\varepsilon^2+\ldots+\varepsilon^{n-1}-n\varepsilon^n$.`,
              T`$\varepsilon^n=1$ i $\varepsilon\neq1$, więc $1+\varepsilon+\ldots+\varepsilon^{n-1}=\frac{\varepsilon^n-1}{\varepsilon-1}=0$. Zostaje $(1-\varepsilon)S=-n$.`, T`<b>$S=\frac{n}{\varepsilon-1}$</b>; a dla $\varepsilon=1$ suma to $1+2+\ldots+n=\frac{n(n+1)}{2}$.`] },
          { label: 'ε=1', type: 'choice', gk: 'num', qKeep: true, q: T`A ile wynosi ta suma, gdy $\varepsilon=1$ (to też pierwiastek $n$-tego stopnia z jedynki)?`, choice: { multi: false, opts: [T`$\frac{n(n+1)}{2}$`, T`$n$`, T`$0$`, T`$n^2$`], correct: [0] },
            sol: [T`Dla $\varepsilon=1$ wszystkie potęgi są równe $1$: suma to $1+2+3+\ldots+n=\frac{n(n+1)}{2}$.`] },
          { label: 'n=4, ε=i', gk: 'num', qKeep: true, q: T`Oblicz $1+2\varepsilon+3\varepsilon^2+4\varepsilon^3$ dla $\varepsilon=i$.`, fields: [{ label: 'suma', ans: C(-2, -2), restrict: ['alg'] }],
            sol: [T`$i^4=1$ i $i\neq1$, więc ze wzoru: $S=\frac{4}{i-1}$.`, T`Mnożymy licznik i mianownik przez sprzężenie $-1-i$: $\frac{4(-1-i)}{(i-1)(-1-i)}=\frac{-4-4i}{2}=-2-2i$.`, T`Sprawdzenie wprost: $1+2i+3i^2+4i^3=1+2i-3-4i=-2-2i$. <b>$-2-2i$</b>`] },
        ],
      },
      {
        id: '4.4', name: 'Suma z ω i zmiennymi znakami', statement: '',
        wzory: [T`$\omega^{2n+1}=\cos\pi+i\sin\pi=-1$, więc $(-\omega)^{2n+1}=1$.`, T`Zadanie 4.3 dla $u=-\omega$: $1+2u+\ldots+mu^{m-1}=\frac{m}{u-1}$.`, T`$1+\cos\theta+i\sin\theta=2\cos\frac{\theta}{2}\left(\cos\frac{\theta}{2}+i\sin\frac{\theta}{2}\right)$.`],
        gen: gen44,
        items: [
          { label: 'wynik', type: 'choice', gk: 'num', qKeep: true, q: T`Ile wynosi $1-2\omega+3\omega^2-\ldots+(2n+1)\omega^{2n}$ dla $\omega=\cos\frac{\pi}{2n+1}+i\sin\frac{\pi}{2n+1}$?`,
            choice: { multi: false, opts: [T`$-\frac{2n+1}{1+\omega}=-\frac{2n+1}{2}+i\,\frac{2n+1}{2}\,\mathrm{tg}\frac{\pi}{4n+2}$`, T`$\frac{2n+1}{1-\omega}$`, T`$0$`, T`$\frac{(2n+1)(2n+2)}{2}$`], correct: [0] },
            sol: [T`Podstawiamy $u=-\omega$: suma to $1+2u+3u^2+\ldots+(2n+1)u^{2n}$.`, T`$u^{2n+1}=-\omega^{2n+1}=-(\cos\pi+i\sin\pi)=1$ i $u\neq1$, więc $u$ jest pierwiastkiem stopnia $2n+1$ z jedynki.`,
              T`Z zadania 4.3 (z $2n+1$ zamiast $n$): suma $=\frac{2n+1}{u-1}=-\frac{2n+1}{1+\omega}$.`,
              T`Dla $\theta=\frac{\pi}{2n+1}$: $1+\omega=2\cos\frac{\theta}{2}\left(\cos\frac{\theta}{2}+i\sin\frac{\theta}{2}\right)$, więc $\frac{1}{1+\omega}=\frac{\cos\frac{\theta}{2}-i\sin\frac{\theta}{2}}{2\cos\frac{\theta}{2}}=\frac{1-i\,\mathrm{tg}\frac{\theta}{2}}{2}$.`,
              T`<b>Suma $=-\frac{2n+1}{2}+i\,\frac{2n+1}{2}\,\mathrm{tg}\frac{\pi}{4n+2}$</b>`] },
          { label: 'n=1', gk: 'num', qKeep: true, q: T`Oblicz $1-2\omega+3\omega^2$ dla $\omega=\cos\frac{\pi}{3}+i\sin\frac{\pi}{3}$ (czyli $n=1$).`, fields: [{ label: 'suma', ans: C(-1.5, S3 / 2), restrict: ['alg'] }],
            sol: [T`$\omega=\frac12+\frac{\sqrt3}{2}i$, $\omega^2=\cos\frac{2\pi}{3}+i\sin\frac{2\pi}{3}=-\frac12+\frac{\sqrt3}{2}i$.`, T`$1-2\omega+3\omega^2=1-(1+i\sqrt3)+\left(-\frac32+\frac{3\sqrt3}{2}i\right)$.`, T`Części rzeczywiste: $1-1-\frac32=-\frac32$; urojone: $-\sqrt3+\frac{3\sqrt3}{2}=\frac{\sqrt3}{2}$.`,
              T`Ze wzoru: $-\frac32+i\cdot\frac32\,\mathrm{tg}\frac{\pi}{6}=-\frac32+i\cdot\frac32\cdot\frac{\sqrt3}{3}=-\frac32+\frac{\sqrt3}{2}i$. <b>$-\frac32+\frac{\sqrt3}{2}i$</b>`] },
        ],
      },
      {
        id: '4.5', name: 'Liczby przeciwne i sprzężone', statement: '',
        wzory: [T`$z=a+bi$ to punkt $(a,b)$.`, T`$-z=-a-bi$ — symetria względem punktu $0$.`, T`$\overline z=a-bi$ — symetria względem osi rzeczywistej.`],
        gen: gen45,
        items: [[2, 1], [2, -1], [-3, 4], [2, 0], [0, 3], [-4, -5]].map(z => item45('$' + zt(z) + '$', z)),
      },
      {
        id: '4.6', name: 'Zbiory na płaszczyźnie', statement: '',
        wzory: [T`$|z-w|$ — odległość punktów $z$ i $w$.`, T`$|z-w|\leqslant r$ — koło o środku $w$ i promieniu $r$.`, T`$|z-P|\leqslant|z-Q|$ — półpłaszczyzna wyznaczona przez symetralną odcinka $PQ$ (po stronie $P$).`, T`$|kz-u|=|k|\cdot\left|z-\frac{u}{k}\right|$; dla $z=x+iy$: $|z|^2=x^2+y^2$.`],
        gen: gen46,
        items: [
          parabItem('6.1', 1, 'x', 1), diskItem('6.2', [3, -2], 5), ringItem('6.3', [-5, -5], 2, 5), ringItem('6.4', [-3, 5], 3, 5), lineItem('6.5', [4, -2], [0, 2]),
          apolItem('6.6', 2, [-1, 4], 1, [-5, 2], 'apol', '2z+1-4i', 'z+5-2i'), apolItem('6.7', 3, [1, -1], 2, [-1, -4], 'apol', '3z-1+i', '2z+1+4i'),
          wedgeItem('6.8', [-4, -6], [-1, -7], [-5, -5]), mixItem('6.9'),
        ],
      },
      {
        id: '4.7', name: 'Równania z modułem', statement: '',
        wzory: [T`$\left|\frac{z}{w}\right|=\frac{|z|}{|w|}$, $|1\pm i|=\sqrt2$.`, T`$|z|$ jest liczbą rzeczywistą $\geqslant0$ — z równania odczytujemy, którą część $z$ znamy.`],
        gen: gen47,
        items: [item47('7.1', '1-i', Math.SQRT2, C(-2), C(0, -2), 'eq7', SOL71), item47('7.2', '1+i', Math.SQRT2, C(0, 1), C(-1), 'eq7', SOL72)],
      },
      {
        id: '4.8', name: 'Czwarty wierzchołek równoległoboku', statement: '',
        wzory: [T`Dodawanie liczb zespolonych to dodawanie wektorów.`, T`W równoległoboku $z_1z_2z_3z_4$: $z_1-z_2=z_4-z_3$, czyli $z_4=z_1+z_3-z_2$.`, T`Przekątne dzielą się na pół: $\frac{z_1+z_3}{2}=\frac{z_2+z_4}{2}$.`],
        gen: gen48,
        items: [
          { label: 'z₄', gk: 'par', fields: [{ label: 'z_4', ans: C(2, 4), restrict: ['alg'] }],
            sol: [T`Przyjmujemy kolejność wierzchołków $z_1z_2z_3z_4$ (jak w nazwach). Wtedy $\overrightarrow{z_2z_1}=\overrightarrow{z_3z_4}$, czyli $z_1-z_2=z_4-z_3$.`, T`$z_4=z_1+z_3-z_2=(-1+2i)+(3+3i)-i=2+4i$.`,
              T`<b>$z_4=2+4i$</b>. (Gdyby wierzchołki nie były podane po kolei, możliwe są jeszcze $z_1+z_2-z_3=-4$ i $z_2+z_3-z_1=4+2i$.)`,
              plane({ box: [-5, 5, -1, 5], shapes: [{ t: 'seg', a: [-1, 2], b: [0, 1] }, { t: 'seg', a: [0, 1], b: [3, 3] }, { t: 'seg', a: [3, 3], b: [2, 4], dash: true }, { t: 'seg', a: [2, 4], b: [-1, 2], dash: true }], pts: [{ z: [-1, 2], lab: 'z₁' }, { z: [0, 1], lab: 'z₂' }, { z: [3, 3], lab: 'z₃' }, { z: [2, 4], lab: 'z₄', col: 'var(--l2)' }] })] },
          { label: 'wszystkie', gk: 'all', qKeep: true, q: T`Podaj wszystkie możliwe położenia czwartego wierzchołka, jeśli nie wiadomo, w jakiej kolejności $z_1=-1+2i$, $z_2=i$, $z_3=3+3i$ leżą na obwodzie.`, fields: [{ label: 'z_4', kind: 'set', ans: () => [C(2, 4), C(-4), C(4, 2)], restrict: ['alg'] }], keys: [';'],
            sol: [T`Czwarty wierzchołek leży naprzeciw jednego z danych. Wierzchołek naprzeciw $w$ to suma dwóch pozostałych minus $w$ (przekątne dzielą się na pół).`, T`Naprzeciw $z_2$: $z_1+z_3-z_2=2+4i$; naprzeciw $z_3$: $z_1+z_2-z_3=-4$; naprzeciw $z_1$: $z_2+z_3-z_1=4+2i$.`, T`<b>$\{2+4i,\ -4,\ 4+2i\}$</b>`] },
        ],
      },
      {
        id: '4.9', name: 'Trzeci wierzchołek ze środka ciężkości', statement: '',
        wzory: [T`Środek ciężkości trójkąta: $s=\frac{z_1+z_2+z_3}{3}$.`, T`Środek odcinka: $\frac{z_1+z_2}{2}$; $s$ dzieli środkową w stosunku $2:1$.`],
        gen: gen49,
        items: [{ label: 'z₃', gk: 'cent', fields: [{ label: 'z_3', ans: C(4, 5), restrict: ['alg'] }],
          sol: [T`Środek ciężkości to średnia arytmetyczna wierzchołków: $s=\frac{z_1+z_2+z_3}{3}$ (wynika to z podziału środkowej w stosunku $2:1$: $s=z_3+\frac23\left(\frac{z_1+z_2}{2}-z_3\right)$).`,
            T`Stąd $z_3=3s-z_1-z_2=3(2+3i)-(-1+3i)-(3+i)$.`, T`$=6+9i-(2+4i)=4+5i$.`, T`<b>$z_3=4+5i$</b>`] }],
      },
      {
        id: '4.10', name: 'Tożsamość równoległoboku', statement: '',
        wzory: [T`$|w|^2=w\overline w$.`, T`Punkty $0$, $z_1$, $z_1+z_2$, $z_2$ tworzą równoległobok; przekątne to $z_1+z_2$ i $z_1-z_2$.`],
        gen: gen410,
        items: [
          { label: 'interpretacja', type: 'choice', gk: 'par', qKeep: true, q: T`Jaka jest interpretacja geometryczna tożsamości $|z_1+z_2|^2+|z_1-z_2|^2=2(|z_1|^2+|z_2|^2)$?`,
            choice: { multi: false, opts: ['W równoległoboku suma kwadratów długości obu przekątnych jest równa sumie kwadratów długości wszystkich czterech boków.', 'W trójkącie prostokątnym kwadrat przeciwprostokątnej jest równy sumie kwadratów przyprostokątnych.', 'W równoległoboku przekątne dzielą się na połowy.', 'W rombie przekątne są prostopadłe.'], correct: [0] },
            sol: [T`Równoległobok rozpięty na wektorach $z_1$ i $z_2$ ma wierzchołki $0$, $z_1$, $z_1+z_2$, $z_2$.`, T`Jego boki mają długości $|z_1|$, $|z_2|$, $|z_1|$, $|z_2|$, a przekątne: $|z_1+z_2|$ (od $0$ do $z_1+z_2$) oraz $|z_1-z_2|$ (od $z_2$ do $z_1$).`,
              T`Lewa strona to suma kwadratów przekątnych, prawa — suma kwadratów czterech boków. <b>To prawo równoległoboku.</b>`] },
          ord('dowód', 'Ułóż dowód tożsamości (rachunkiem na liczbach zespolonych).', [
            T`$|z_1+z_2|^2=(z_1+z_2)(\overline{z_1}+\overline{z_2})=|z_1|^2+|z_2|^2+z_1\overline{z_2}+\overline{z_1}z_2$.`,
            T`$|z_1-z_2|^2=(z_1-z_2)(\overline{z_1}-\overline{z_2})=|z_1|^2+|z_2|^2-z_1\overline{z_2}-\overline{z_1}z_2$.`,
            T`Dodając, wyrazy mieszane się redukują: $|z_1+z_2|^2+|z_1-z_2|^2=2(|z_1|^2+|z_2|^2)$. $\blacksquare$`],
            [T`$|z_1+z_2|=|z_1|+|z_2|$.`], 'par'),
        ],
      },
      {
        id: '4.11', name: 'Trójkąt równoboczny', statement: '',
        wzory: [T`Obrót o kąt $\varphi$ wokół $z_1$: $z\mapsto z_1+(z-z_1)(\cos\varphi+i\sin\varphi)$.`, T`$\lambda=\frac12\pm\frac{\sqrt3}{2}i$ to pierwiastki równania $\lambda^2-\lambda+1=0$.`],
        gen: gen411,
        items: [ord('dowód', 'Ułóż dowód równoważności.', [
          T`Trójkąt $z_1z_2z_3$ jest równoboczny $\iff$ wektor $z_3-z_1$ powstaje z $z_2-z_1$ przez obrót o $\frac{\pi}{3}$ lub $-\frac{\pi}{3}$, czyli $\frac{z_3-z_1}{z_2-z_1}=\lambda$, gdzie $\lambda=\frac12\pm\frac{\sqrt3}{2}i$.`,
          T`Liczby $\frac12\pm\frac{\sqrt3}{2}i$ to dokładnie oba pierwiastki równania $\lambda^2-\lambda+1=0$.`,
          T`Zatem trójkąt jest równoboczny $\iff(z_3-z_1)^2-(z_3-z_1)(z_2-z_1)+(z_2-z_1)^2=0$ (pomnożyliśmy przez $(z_2-z_1)^2\neq0$).`,
          T`Po wymnożeniu lewa strona to $z_1^2+z_2^2+z_3^2-z_1z_2-z_2z_3-z_3z_1$.`,
          T`Więc trójkąt jest równoboczny $\iff z_1^2+z_2^2+z_3^2=z_1z_2+z_2z_3+z_3z_1$. $\blacksquare$`],
          [T`Trójkąt jest równoboczny $\iff|z_1|=|z_2|=|z_3|$.`], 'eq3')],
      },
      {
        id: '4.12', name: 'Twierdzenie o czworokącie', statement: '',
        wzory: [T`$|a+b|^2=|a|^2+|b|^2+2\,\mathrm{Re}(a\overline b)$.`, T`Środki przekątnych: $M=\frac{z_1+z_3}{2}$, $N=\frac{z_2+z_4}{2}$, więc $2|M-N|=|z_1-z_2+z_3-z_4|$.`],
        gen: gen412,
        items: [ord('dowód', 'Ułóż dowód (czworokąt $z_1z_2z_3z_4$, przekątne $z_1z_3$ i $z_2z_4$).', [
          T`Środki przekątnych to $M=\frac{z_1+z_3}{2}$ i $N=\frac{z_2+z_4}{2}$, więc podwojona długość odcinka $MN$ to $|z_1-z_2+z_3-z_4|$.`,
          T`Oznaczmy $u=z_1-z_2$, $v=z_2-z_3$, $w=z_3-z_4$. Wtedy $z_4-z_1=-(u+v+w)$, przekątne to $u+v$ i $v+w$, a $z_1-z_2+z_3-z_4=u+w$.`,
          T`Teza ma postać: $|u|^2+|v|^2+|w|^2+|u+v+w|^2=|u+v|^2+|v+w|^2+|u+w|^2$.`,
          T`Rozpisujemy każdy kwadrat wzorem $|a+b|^2=|a|^2+|b|^2+2\,\mathrm{Re}(a\overline b)$: obie strony są równe $2(|u|^2+|v|^2+|w|^2)+2\,\mathrm{Re}(u\overline v+v\overline w+u\overline w)$. $\blacksquare$`],
          [T`Przekątne czworokąta wypukłego dzielą się na połowy.`], 'quad')],
      },
      {
        id: '4.13', name: 'Twierdzenie Leibniza', statement: '',
        wzory: [T`$q=\frac{z_1+z_2+z_3}{3}$, więc $(q-z_1)+(q-z_2)+(q-z_3)=0$.`, T`$|a+b|^2=|a|^2+|b|^2+2\,\mathrm{Re}(a\overline b)$.`],
        gen: gen413,
        items: [ord('dowód', 'Ułóż dowód twierdzenia Leibniza.', [
          T`Zapisujemy $z-z_k=(z-q)+(q-z_k)$ dla $k=1,2,3$.`,
          T`$|z-z_k|^2=|z-q|^2+|q-z_k|^2+2\,\mathrm{Re}\left((z-q)\overline{(q-z_k)}\right)$.`,
          T`Sumujemy po $k$: wyrazy mieszane dają $2\,\mathrm{Re}\left((z-q)\cdot\overline{(3q-z_1-z_2-z_3)}\right)$.`,
          T`Ponieważ $q=\frac{z_1+z_2+z_3}{3}$, jest $3q-z_1-z_2-z_3=0$, więc wyrazy mieszane znikają.`,
          T`Zostaje $\sum|z-z_k|^2=\sum|q-z_k|^2+3|q-z|^2$. $\blacksquare$`],
          [T`$|z-z_k|^2=|z|^2-|z_k|^2$.`], 'leib')],
      },
      {
        id: '4.14', name: 'Trójkąt równoboczny w okręgu', statement: '',
        wzory: [T`Wierzchołki $n$-kąta foremnego o środku $0$ to wszystkie wartości $\sqrt[n]{w_0^n}$ — kolejne obroty o $\frac{2\pi}{n}$.`, T`$\cos\frac{\pi}{3}=\frac12$, $\sin\frac{\pi}{3}=\frac{\sqrt3}{2}$.`],
        gen: gen414,
        items: [{ label: 'ω₀, ω₁, ω₂', gk: 'poly', fields: [{ label: '\\omega_k', kind: 'set', ans: () => [C(-1), C(0.5, S3 / 2), C(0.5, -S3 / 2)], restrict: ['roots'] }], keys: [';'],
          sol: [T`Wierzchołek na ujemnej półosi rzeczywistej, na okręgu o promieniu $1$: $\omega_0=-1$.`, T`Pozostałe wierzchołki powstają przez obroty o $\frac{2\pi}{3}$ — to wszystkie wartości $\sqrt[3]{\omega_0^3}=\sqrt[3]{-1}$.`,
            T`$\omega_1=\cos\frac{\pi}{3}+i\sin\frac{\pi}{3}=\frac12+\frac{\sqrt3}{2}i$, $\omega_2=\cos\frac{5\pi}{3}+i\sin\frac{5\pi}{3}=\frac12-\frac{\sqrt3}{2}i$.`,
            T`Bok $\omega_1\omega_2$ jest pionowy (te same części rzeczywiste $\frac12$) — równoległy do osi urojonej, zgodnie z treścią.`, T`<b>$\left\{-1,\ \frac12+\frac{\sqrt3}{2}i,\ \frac12-\frac{\sqrt3}{2}i\right\}$</b>`,
            polyItem(3, C(0), 1, Math.PI, '', '0').steps[4]] }],
      },
      {
        id: '4.15', name: 'Sześciokąt foremny', statement: '',
        wzory: [T`Przesunięcie o $c$: wierzchołki to $c+w_k$, gdzie $w_k$ — wierzchołki sześciokąta o środku $0$.`, T`$w_k$ — wartości $\sqrt[6]{64}$ (promień $2$): $2\left(\cos\frac{k\pi}{3}+i\sin\frac{k\pi}{3}\right)$.`],
        gen: gen414,
        items: [{ label: 'ω₀,…,ω₅', gk: 'poly', fields: [{ label: '\\omega_k', kind: 'set', ans: () => [0, 1, 2, 3, 4, 5].map(k => Cx.add(C(2, S3), Cx.polar(2, k * Math.PI / 3))), restrict: ['roots'] }], keys: [';'],
          sol: [T`Najpierw sześciokąt o środku $0$ i promieniu $2$: wierzchołki to wartości $\sqrt[6]{64}$, czyli $w_k=2\left(\cos\frac{k\pi}{3}+i\sin\frac{k\pi}{3}\right)$: $2,\ 1+i\sqrt3,\ -1+i\sqrt3,\ -2,\ -1-i\sqrt3,\ 1-i\sqrt3$.`,
            T`Bok między $1+i\sqrt3$ i $-1+i\sqrt3$ jest poziomy (te same części urojone) — równoległy do osi rzeczywistej, zgodnie z treścią.`,
            T`Przesuwamy o środek $2+i\sqrt3$: $\omega_k=2+i\sqrt3+w_k$.`,
            T`<b>$\{4+i\sqrt3,\ 3+2i\sqrt3,\ 1+2i\sqrt3,\ i\sqrt3,\ 1,\ 3\}$</b>`, polyItem(6, C(2, S3), 2, 0, '', '2+i\\sqrt3').steps[4]] }],
      },
    ],
  });
})();
