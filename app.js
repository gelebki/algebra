/* Algebrownia — interfejs gry */
(function () {
  'use strict';
  const A = window.AQ;
  const $ = (s, el = document) => el.querySelector(s);
  const h = (tag, attrs = {}, ...kids) => {
    const el = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs || {})) {
      if (v == null || v === false) continue;
      if (k === 'class') el.className = v;
      else if (k === 'html') el.innerHTML = v;
      else if (k.startsWith('on')) el.addEventListener(k.slice(2), v);
      else el.setAttribute(k, v === true ? '' : v);
    }
    for (const k of kids.flat()) if (k != null && k !== false) el.append(k.nodeType ? k : document.createTextNode(k));
    return el;
  };

  /* ---------------- ikony ---------------- */
  const IC = {
    star: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.8l2.8 5.9 6.4.8-4.7 4.4 1.2 6.4L12 17.2l-5.7 3.1 1.2-6.4L2.8 9.5l6.4-.8z"/></svg>',
    flame: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2c1 3.5 5.5 5.6 5.5 11a5.5 5.5 0 0 1-11 0c0-2.4 1.2-4 2.5-5 .1 1.6.8 2.7 2 3.2C10.6 8.6 11 5 12 2z"/></svg>',
    sound: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 9v6h4l5 4V5L8 9z" fill="currentColor"/><path d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12"/></svg>',
    mute: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 9v6h4l5 4V5L8 9z" fill="currentColor"/><path d="M17 9l5 6M22 9l-5 6"/></svg>',
    back: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>',
    bulb: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z"/></svg>',
    book: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z"/><path d="M4 19V5M8 7h7M8 11h5"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
    x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>',
    bolt: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M13 2L4 14h7l-1 8 9-12h-7z"/></svg>',
    chart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M5 20V10M12 20V4M19 20v-7"/></svg>',
    trophy: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 4h8v5a4 4 0 0 1-8 0zM8 6H4a3 3 0 0 0 4 4M16 6h4a3 3 0 0 1-4 4M12 13v4M8 21h8M9 17h6"/></svg>',
    dice: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3.5" y="3.5" width="17" height="17" rx="4"/><circle cx="8.5" cy="8.5" r="1.3" fill="currentColor"/><circle cx="15.5" cy="15.5" r="1.3" fill="currentColor"/><circle cx="12" cy="12" r="1.3" fill="currentColor"/></svg>',
    flag: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M5 21V4M5 4h11l-2 4 2 4H5"/></svg>',
    kbd: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="2.5" y="6" width="19" height="12" rx="3"/><path d="M6 10h.01M10 10h.01M14 10h.01M18 10h.01M7 14h10"/></svg>',
    next: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  };
  const logoSVG = '<svg viewBox="0 0 32 32" fill="none"><rect x="1" y="1" width="30" height="30" rx="9" fill="var(--brand)"/><path d="M6 16h20M16 6v20" stroke="var(--brand-ink)" stroke-opacity=".45" stroke-width="1.6"/><circle cx="16" cy="16" r="7.5" stroke="var(--brand-ink)" stroke-width="2"/><path d="M16 16l5.3-5.3" stroke="var(--brand-ink)" stroke-width="2" stroke-linecap="round"/><circle cx="21.3" cy="10.7" r="2.4" fill="var(--xp)"/></svg>';

  /* ---------------- stan ---------------- */
  const KEY = 'algebrownia-v1';
  const blank = () => ({ practice: {}, xp: 0, items: {}, burned: {}, attempts: 0, correct: 0, wrong: 0, streak: 0, best: 0, clean: 0, variants: 0, proofs: 0, hints: 0, days: {}, lastDay: null, dayStreak: 0, badges: {}, sound: true, tab: 'l1', quickBest: 0 });
  let S = blank();
  try { const raw = localStorage.getItem(KEY); if (raw) S = Object.assign(blank(), JSON.parse(raw)); } catch (e) { /* bez pamięci */ }
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* ignoruj */ } if (window.AQRank && window.AQRank.queue) window.AQRank.queue(); };
  const today = () => { const d = new Date(); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); };

  /* ---------------- poziomy ---------------- */
  // Progi dopasowane do list: Lista 1 = 520 XP, Listy 1–2 = 1650 XP, wszystko = 2500 XP (250 podpunktów × 10).
  // Arcymistrz przy 2300 XP ≈ 92% podstawowego zestawu; podobne przykłady przyspieszają drogę.
  const LEVELS = [0, 80, 170, 270, 390, 510, 680, 860, 1050, 1250, 1460, 1700, 1900, 2100, 2300];
  const TITLES = ['Nowicjusz', 'Strażnik wymiernych', 'Pogromca niewymierności', 'Rachmistrz ℤₚ', 'Badacz działań', 'Budowniczy ciał',
    'Odkrywca liczby i', 'Mistrz sprzężenia', 'Treser trójmianów', 'Znawca trygonometrii', 'Nawigator płaszczyzny zespolonej',
    'Uczeń de Moivre’a', 'Władca potęg', 'Łowca pierwiastków', 'Arcymistrz algebry'];
  const MAXL = TITLES.length;
  function levelInfo(xp) {
    let L = 1; while (L < MAXL && xp >= LEVELS[L]) L++;
    const max = L === MAXL, acc = LEVELS[L - 1];
    return { L, max, into: max ? 1 : xp - acc, need: max ? 1 : LEVELS[L] - acc, title: TITLES[L - 1] };
  }
  const xpText = lv => (lv.max ? 'poziom maksymalny' : lv.into + '/' + lv.need + ' XP');

  /* ---------------- dźwięk (WebAudio) ---------------- */
  let AC = null;
  const ac = () => { if (!AC) { try { AC = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { AC = null; } } if (AC && AC.state === 'suspended') AC.resume(); return AC; };
  function tone(freq, t0, dur, type = 'sine', gain = 0.12, slide = 0) {
    const c = ac(); if (!c || !S.sound) return;
    const o = c.createOscillator(), g = c.createGain();
    o.type = type; o.frequency.setValueAtTime(freq, c.currentTime + t0);
    if (slide) o.frequency.exponentialRampToValueAtTime(freq * slide, c.currentTime + t0 + dur);
    g.gain.setValueAtTime(0.0001, c.currentTime + t0);
    g.gain.exponentialRampToValueAtTime(gain, c.currentTime + t0 + 0.015);
    g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + t0 + dur);
    o.connect(g).connect(c.destination); o.start(c.currentTime + t0); o.stop(c.currentTime + t0 + dur + 0.05);
  }
  const SFX = {
    click: () => tone(880, 0, 0.05, 'triangle', 0.04),
    key: () => tone(1200 + Math.random() * 200, 0, 0.035, 'sine', 0.03),
    correct: () => { [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => { tone(f, i * 0.075, 0.32, 'triangle', 0.11); tone(f * 2, i * 0.075, 0.18, 'sine', 0.03); }); },
    wrong: () => { tone(392, 0, 0.18, 'sine', 0.05); tone(330, 0.1, 0.26, 'sine', 0.045); },
    star: () => { [1318.5, 1568, 2093].forEach((f, i) => tone(f, i * 0.09, 0.25, 'sine', 0.07)); },
    level: () => { [392, 523.25, 659.25, 783.99, 1046.5, 1318.5].forEach((f, i) => { tone(f, i * 0.09, 0.45, 'triangle', 0.1); }); tone(1568, 0.6, 0.8, 'sine', 0.06); },
    hint: () => { tone(660, 0, 0.12, 'sine', 0.06); tone(990, 0.08, 0.16, 'sine', 0.05); },
    whoosh: () => tone(300, 0, 0.18, 'sine', 0.04, 2.5),
  };

  /* ---------------- konfetti ---------------- */
  let fxCanvas = null, parts = [], fxRun = false;
  const reduced = () => window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function confetti(n = 60, x = innerWidth / 2, y = innerHeight / 2.2, spread = 1) {
    if (reduced()) return;
    if (!fxCanvas) { fxCanvas = h('canvas', { class: 'fx' }); document.body.append(fxCanvas); }
    const cs = getComputedStyle(document.documentElement);
    const cols = ['--xp', '--l1', '--l2', '--l3', '--brand', '--ok'].map(v => cs.getPropertyValue(v).trim() || '#fc0');
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2, s = (4 + Math.random() * 8) * spread;
      parts.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s - 6 * spread, r: 3 + Math.random() * 5, c: cols[i % cols.length], rot: Math.random() * 6, vr: (Math.random() - 0.5) * 0.4, life: 90 + Math.random() * 50, sh: Math.random() < 0.3 ? 1 : 0 });
    }
    if (!fxRun) { fxRun = true; requestAnimationFrame(fxStep); }
  }
  function fxStep() {
    const c = fxCanvas, dpr = devicePixelRatio || 1;
    if (c.width !== innerWidth * dpr) { c.width = innerWidth * dpr; c.height = innerHeight * dpr; }
    const g = c.getContext('2d'); g.setTransform(dpr, 0, 0, dpr, 0, 0); g.clearRect(0, 0, innerWidth, innerHeight);
    parts = parts.filter(p => p.life > 0);
    for (const p of parts) {
      p.vy += 0.32; p.vx *= 0.985; p.x += p.vx; p.y += p.vy; p.rot += p.vr; p.life--;
      g.save(); g.translate(p.x, p.y); g.rotate(p.rot); g.globalAlpha = Math.min(1, p.life / 30); g.fillStyle = p.c;
      if (p.sh) { g.beginPath(); g.arc(0, 0, p.r * 0.7, 0, 7); g.fill(); } else g.fillRect(-p.r, -p.r / 2.5, p.r * 2, p.r / 1.25);
      g.restore();
    }
    if (parts.length) requestAnimationFrame(fxStep); else { fxRun = false; g.clearRect(0, 0, innerWidth, innerHeight); }
  }
  function xpFloat(text, el) {
    const r = el ? el.getBoundingClientRect() : { left: innerWidth / 2, top: innerHeight / 2, width: 0 };
    const f = h('div', { class: 'xpfloat', style: `left:${r.left + r.width / 2 - 30}px;top:${r.top - 10}px` }, text);
    document.body.append(f); setTimeout(() => f.remove(), 1400);
  }
  function toast(title, sub, icon = 'trophy') {
    const t = h('div', { class: 'toast' }, h('span', { html: IC[icon] }), h('div', {}, h('b', {}, title), h('small', {}, sub)));
    $('#toasts').append(t); setTimeout(() => { t.style.transition = 'opacity .4s'; t.style.opacity = '0'; setTimeout(() => t.remove(), 400); }, 3600);
  }

  /* ---------------- matematyka ---------------- */
  let mjReady = false; const texCache = new Map();
  function texNode(tex, display) {
    const key = (display ? 'D' : 'I') + tex;
    if (mjReady) {
      let svg = texCache.get(key);
      if (!svg) {
        try { const node = MathJax.tex2svg(tex, { display: !!display }); svg = node.outerHTML; } catch (e) { svg = null; }
        if (svg && /data-mjx-error|merror/.test(svg)) { console.warn('TeX error', tex); }
        texCache.set(key, svg);
      }
      if (svg) { const t = document.createElement('template'); t.innerHTML = svg; return t.content.firstChild; }
    }
    return h('span', { class: 'tex-fallback' }, tex);
  }
  function md(markup) {
    const frag = document.createDocumentFragment();
    for (const p of A.mdToTexParts(String(markup))) {
      if (p.text !== undefined) { const s = h('span', { html: p.text }); frag.append(s); }
      else frag.append(texNode(p.tex, p.display));
    }
    return frag;
  }
  const mdEl = (tag, markup, attrs = {}) => { const el = h(tag, attrs); el.append(md(markup)); return el; };

  /* ---------------- dane pomocnicze ---------------- */
  const LISTS = A.lists;
  const itemKey = (t, i) => t.id + '#' + i;
  function taskProgress(t) {
    let solved = 0, practiced = 0, practicable = 0;
    t.items.forEach((it, i) => { const k = itemKey(t, i); if (S.items[k]) solved++; if ((it.type || 'fields') !== 'order') { practicable++; if ((S.practice || {})[k] >= 1) practiced++; } });
    const total = t.items.length;
    let stars = 0;
    if (solved >= Math.ceil(total / 2)) stars = 1;
    if (solved === total) stars = 2;
    if (solved === total && practiced >= practicable) stars = 3;
    return { solved, total, stars, practiced, practicable };
  }
  function listProgress(L) {
    let s = 0, t = 0, stars = 0;
    for (const task of L.tasks) { const p = taskProgress(task); s += p.solved; t += p.total; stars += p.stars; }
    return { solved: s, total: t, stars, maxStars: L.tasks.length * 3 };
  }
  const starsEl = (n, max = 3) => h('span', { class: 'stars', 'aria-label': n + ' z ' + max + ' gwiazdek', html: Array.from({ length: max }, (_, i) => IC.star.replace('<svg', `<svg class="${i < n ? 'on' : 'off'}"`)).join('') });
  function ringSVG(frac, size, stroke, color) {
    const r = (size - stroke) / 2, c = 2 * Math.PI * r;
    return `<svg viewBox="0 0 ${size} ${size}" width="${size}" height="${size}"><circle cx="${size / 2}" cy="${size / 2}" r="${r}" fill="none" stroke="var(--line)" stroke-width="${stroke}"/><circle cx="${size / 2}" cy="${size / 2}" r="${r}" fill="none" stroke="${color}" stroke-width="${stroke}" stroke-linecap="round" stroke-dasharray="${c}" stroke-dashoffset="${c * (1 - Math.max(0, Math.min(1, frac)))}" style="transition:stroke-dashoffset .9s cubic-bezier(.2,.8,.2,1)"/></svg>`;
  }

  /* ---------------- odznaki ---------------- */
  const BADGES = [
    { id: 'first', name: 'Pierwszy krok', desc: 'Pierwsza poprawna odpowiedź', ok: () => S.correct >= 1 },
    { id: 's5', name: 'Rozgrzewka', desc: '10 rozwiązanych przykładów', ok: () => S.correct >= 10 },
    { id: 's10', name: 'W rytmie', desc: '50 rozwiązanych przykładów', ok: () => S.correct >= 50 },
    { id: 's25', name: 'Maszyna licząca', desc: '150 rozwiązanych przykładów', ok: () => S.correct >= 150 },
    { id: 'clean', name: 'Bez kół ratunkowych', desc: '10 podpunktów bez podpowiedzi', ok: () => S.clean >= 10 },
    { id: 'var', name: 'Trening czyni mistrza', desc: '10 poprawnych podobnych przykładów', ok: () => S.variants >= 10 },
    { id: 'p3', name: 'Opanowane', desc: 'Pełna seria 3 podobnych w 10 podpunktach', ok: () => Object.values(S.practice || {}).filter(x => x >= 3).length >= 10 },
    { id: 'proof', name: 'Dowodziciel', desc: '5 poprawnie ułożonych dowodów', ok: () => S.proofs >= 5 },
    { id: 'star3', name: 'Perfekcjonista', desc: 'Pierwsze zadanie na 3 gwiazdki', ok: () => LISTS.some(L => L.tasks.some(t => taskProgress(t).stars === 3)) },
    { id: 'l1', name: 'Ciało ukończone', desc: 'Wszystkie zadania z Listy 1', ok: () => { const p = listProgress(LISTS[0]); return p.solved === p.total; } },
    { id: 'l2', name: 'Zespolony umysł', desc: 'Wszystkie zadania z Listy 2', ok: () => { const p = listProgress(LISTS[1]); return p.solved === p.total; } },
    { id: 'l3', name: 'Pan pierwiastków', desc: 'Wszystkie zadania z Listy 3', ok: () => { const p = listProgress(LISTS[2]); return p.solved === p.total; } },
    { id: 'xp1k', name: 'Tysiąc XP', desc: 'Zdobądź 1000 punktów doświadczenia', ok: () => S.xp >= 1000 },
    { id: 'days3', name: 'Trzy dni z rzędu', desc: 'Ucz się 3 dni pod rząd', ok: () => S.dayStreak >= 3 },
    { id: 'quick', name: 'Błyskawica', desc: '8 przykładów w jednej szybkiej rundzie', ok: () => S.quickBest >= 8 },
  ];
  function checkBadges() {
    for (const b of BADGES) if (!S.badges[b.id] && b.ok()) { S.badges[b.id] = today(); setTimeout(() => { toast('Odznaka: ' + b.name, b.desc); SFX.star(); }, 700); }
  }

  /* ---------------- nagradzanie ---------------- */
  function bumpDay(ok) {
    const d = today(); S.days[d] = S.days[d] || { ok: 0, bad: 0 }; S.days[d][ok ? 'ok' : 'bad']++;
    if (S.lastDay !== d) {
      const y = new Date(); y.setDate(y.getDate() - 1);
      const ys = y.getFullYear() + '-' + String(y.getMonth() + 1).padStart(2, '0') + '-' + String(y.getDate()).padStart(2, '0');
      S.dayStreak = S.lastDay === ys ? S.dayStreak + 1 : 1; S.lastDay = d;
    }
  }
  function gainXP(n, anchor) {
    n = Math.max(1, n);
    S.xpDays = S.xpDays || {}; S.xpDays[today()] = (S.xpDays[today()] || 0) + n;
    const before = levelInfo(S.xp).L; S.xp += n; const after = levelInfo(S.xp);
    xpFloat('+' + n + ' XP', anchor);
    if (after.L > before) setTimeout(() => levelUp(after), 900);
  }

  /* ---------------- sesja zadania ---------------- */
  let V = { view: 'list', list: 0 }; // aktualny widok
  let T = null; // sesja zadania

  function startTask(li, ti, idx) {
    const L = LISTS[li], task = L.tasks[ti];
    if (idx == null) { idx = task.items.findIndex((_, i) => !S.items[itemKey(task, i)]); if (idx < 0) idx = 0; }
    T = { li, ti, L, task, idx, mode: 'orig', item: task.items[idx], origKey: itemKey(task, idx) };
    resetAttempt();
    V = { view: 'task', list: li };
    setHash('t' + task.id.replace('.', '-'));
    render();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  function resetAttempt() { if (T.mode === 'orig' && T._lastKey !== T.origKey) { T.tried = false; T._lastKey = T.origKey; } T.sel = []; T.vals = []; T.choice = new Set(); T.order = []; T.pool = null; T.status = 'answering'; T.usedW = false; T.usedP = false; T.marks = null; T.msgs = []; T.focus = 0; }
  function startVariant() {
    const gk = T.task.items[T.idx].gk || T.item.gk;
    let it; for (let k = 0; k < 6; k++) { it = T.task.gen(gk); if (!T.item || it.q !== T.item.q) break; }
    it.gk = it.gk || gk;
    T.mode = T.mode === 'quick' ? 'quick' : 'var'; T.item = it; resetAttempt(); render(); SFX.whoosh();
    window.scrollTo({ top: 0, behavior: reduced() ? 'auto' : 'smooth' });
  }
  const practiceN = () => (S.practice || {})[T.origKey] || 0;
  function startQuick(li) {
    const L = LISTS[li]; const items = [];
    const tasks = L.tasks.filter(t => t.gen);
    for (let k = 0; k < 10; k++) {
      const t = tasks[Math.floor(Math.random() * tasks.length)];
      const gks = [...new Set(t.items.map(i => i.gk).filter(Boolean))];
      const gk = gks.length ? gks[Math.floor(Math.random() * gks.length)] : undefined;
      try { const it = t.gen(gk); it.gk = it.gk || gk; it._task = t; items.push(it); } catch (e) { k--; }
    }
    T = { li, ti: 0, L, task: items[0]._task, idx: 0, mode: 'quick', item: items[0], quick: { items, i: 0, score: 0 } };
    resetAttempt(); V = { view: 'task', list: li }; render(); window.scrollTo({ top: 0 });
  }

  /* ---------------- sprawdzanie ---------------- */
  function evalCustom(item) {
    try { return item.check(item.fields.map((f, i) => A.evaluate(A.parse(T.vals[i] || '', f.vars || []), {}))); } catch (e) { return null; }
  }
  function submit() {
    if (T.status !== 'answering') return;
    const it = T.item; const type = it.type || 'fields';
    let ok = false;
    if (type === 'fields') {
      const mc = A.buildMC(it);
      if (mc.groups.some((g, i) => T.sel[i] == null)) { toast('Wybierz odpowiedź', 'Zaznacz jedną opcję w każdej grupie', 'flag'); return; }
      ok = mc.groups.every((g, i) => g.opts[T.sel[i]].ok);
    } else if (false) {
      const res = it.fields.map((f, i) => A.checkField(f, T.vals[i]));
      if (it.check) {
        const inv = it.fields.map((f, i) => (T.vals[i] || '').trim() ? null : { status: 'invalid', msg: 'Uzupełnij pole' });
        if (inv.some(Boolean)) { T.msgs = inv.map(x => x && x.msg); render(); return; }
        const r = evalCustom(it); if (r === null) { T.msgs = it.fields.map(() => 'Wpisz liczby całkowite'); render(); return; }
        ok = r; T.marks = it.fields.map(() => ok);
      } else {
        const inv = res.map(r => r.status === 'invalid' ? r.msg : null);
        if (inv.some(Boolean)) { T.msgs = inv; render(); const i = inv.findIndex(Boolean); focusField(i); SFX.click(); return; }
        T.marks = res.map(r => r.status === 'ok'); ok = T.marks.every(Boolean);
      }
    } else if (type === 'choice') {
      if (!T.choice.size) { toast('Wybierz odpowiedź', 'Zaznacz co najmniej jedną opcję', 'flag'); return; }
      const want = new Set(it.choice.correct);
      ok = want.size === T.choice.size && [...want].every(x => T.choice.has(x));
    } else if (type === 'order') {
      if (!T.order.length) { toast('Ułóż dowód', 'Klikaj kroki w kolejności', 'flag'); return; }
      const n = it.order.steps.length;
      ok = T.order.length === n && T.order.every((k, i) => k === i);
    }
    T.status = ok ? 'correct' : 'wrong';
    if (ok) bumpDay(true);
    const isOrig = T.mode === 'orig';
    if (ok) {
      S.correct++;
      if (type === 'order') S.proofs++;
      // XP: oryginał za pierwszym razem 10; pierwsze 3 podobne do podpunktu po 6, każdy kolejny 1
      let xp;
      S.tried = S.tried || {}; S.pc = S.pc || {};
      if (isOrig) {
        const prev = S.items[T.origKey];
        const first = !prev && !S.tried[T.origKey];
        if (!prev) S.items[T.origKey] = 'done';
        if (first && !T.usedW && !T.usedP) S.clean++;
        xp = prev ? 1 : first ? 10 : 6;
      } else {
        S.variants++;
        if (T.mode === 'var') {
          const k = S.pc[T.origKey] || 0;
          xp = k < 3 ? 6 : 1;
          S.pc[T.origKey] = k + 1;
          S.practice = S.practice || {}; S.practice[T.origKey] = Math.min(3, k + 1);
          if (k + 1 === 3) setTimeout(() => { toast('Seria podobnych ukończona', 'Podpunkt ' + (T.task.items[T.idx].label || '') + ' opanowany', 'star'); SFX.star(); }, 900);
          if (!S.items[T.origKey]) { S.items[T.origKey] = 'done'; T.redeemed = true; }
        } else { xp = 3; T.quick.score++; }
      }
      gainXP(xp, $('#card .opt.picked') || $('#submitBtn') || $('#card'));
      SFX.correct();
      const r = $('#card') ? $('#card').getBoundingClientRect() : null;
      confetti(T.mode === 'quick' ? 30 : 55, r ? r.left + r.width / 2 : undefined, r ? r.top + 80 : undefined, 0.9);
    } else {
      if (isOrig) { T.tried = true; S.tried = S.tried || {}; if (!S.items[T.origKey]) S.tried[T.origKey] = true; }
      SFX.wrong();
    }
    checkBadges(); save();
    render();
    const fb = $('#feedback'); if (fb) fb.scrollIntoView({ behavior: reduced() ? 'auto' : 'smooth', block: 'nearest' });
    if (ok && isOrig) { const p = taskProgress(T.task); if (p.solved === p.total && !T.celebrated) { T.celebrated = true; setTimeout(() => taskDone(p), 900); } }
  }
  function goNext() {
    if (T.mode === 'quick') {
      const q = T.quick; q.i++;
      if (q.i >= q.items.length) return quickDone();
      T.item = q.items[q.i]; T.task = T.item._task; resetAttempt(); render(); SFX.whoosh(); return;
    }
    const task = T.task; const n = task.items.length;
    let next = -1;
    for (let k = 1; k <= n; k++) { const j = (T.idx + k) % n; if (!S.items[itemKey(task, j)]) { next = j; break; } }
    if (next < 0) { V = { view: 'list', list: T.li }; T = null; setHash('l' + (V.list + 1)); render(); return; }
    T.idx = next; T.mode = 'orig'; T.item = task.items[next]; T.origKey = itemKey(task, next); T.redeemed = false; resetAttempt(); render(); SFX.whoosh();
    window.scrollTo({ top: 0, behavior: reduced() ? 'auto' : 'smooth' });
  }

  /* ---------------- modale ---------------- */
  function closeOverlays() { document.querySelectorAll('.scrim,.drawer,.modal').forEach(e => e.remove()); }
  function modal(content, onClose) {
    closeOverlays();
    const scrim = h('div', { class: 'scrim', onclick: () => { closeOverlays(); onClose && onClose(); } });
    const m = h('div', { class: 'modal', role: 'dialog', 'aria-modal': 'true' }, content);
    document.body.append(scrim, m);
    const b = m.querySelector('button'); if (b) b.focus();
    return m;
  }
  function levelUp(info) {
    SFX.level(); confetti(140, innerWidth / 2, innerHeight / 3, 1.3);
    modal([h('div', { class: 'muted' }, 'Nowy poziom!'), h('div', { class: 'big' }, String(info.L)), h('h2', {}, info.title), h('p', {}, info.max ? 'Najwyższy poziom. Gratulacje!' : 'Do kolejnego poziomu: ' + info.need + ' XP.'), h('div', { class: 'row' }, h('button', { class: 'btn primary', onclick: closeOverlays }, 'Dalej'))]);
    renderTop();
  }
  function taskDone(p) {
    SFX.star(); confetti(120, innerWidth / 2, innerHeight / 3, 1.2);
    modal([h('div', { class: 'muted' }, 'Zadanie ' + T.task.id + ' ukończone'), starsEl(p.stars), h('h2', {}, p.stars === 3 ? 'Perfekcyjnie!' : p.stars === 2 ? 'Komplet!' : 'Brawo!'),
      h('p', {}, p.stars === 3 ? 'Wszystkie podpunkty i podobne przykłady zrobione.' : 'Trzecia gwiazdka: po jednym podobnym przykładzie w każdym podpunkcie.'),
      h('div', { class: 'row' }, h('button', { class: 'btn primary', onclick: () => { closeOverlays(); const li = T.li; T = null; V = { view: 'list', list: li }; setHash('l' + (li + 1)); render(); } }, 'Wróć do mapy'), h('button', { class: 'btn', onclick: closeOverlays }, 'Zostań'))]);
  }
  function quickDone() {
    const q = T.quick; S.quickBest = Math.max(S.quickBest || 0, q.score); checkBadges(); save();
    SFX.level(); confetti(80 + q.score * 8, innerWidth / 2, innerHeight / 3, 1.1);
    const li = T.li;
    modal([h('div', { class: 'muted' }, 'Szybka runda — ' + LISTS[li].title), h('div', { class: 'big' }, String(q.score)), h('h2', {}, q.score === 1 ? 'rozwiązany przykład' : q.score >= 2 && q.score <= 4 ? 'rozwiązane przykłady' : 'rozwiązanych przykładów'),
      h('p', {}, 'Rekord: ' + S.quickBest),
      h('div', { class: 'row' }, h('button', { class: 'btn primary', onclick: () => { closeOverlays(); startQuick(li); } }, 'Jeszcze raz'), h('button', { class: 'btn', onclick: () => { closeOverlays(); T = null; V = { view: 'list', list: li }; render(); } }, 'Mapa'))]);
  }
  function drawer(title, icon, body) {
    closeOverlays();
    const scrim = h('div', { class: 'scrim', onclick: closeOverlays });
    const d = h('aside', { class: 'drawer', role: 'dialog', 'aria-label': title },
      h('header', {}, h('span', { html: icon, style: 'width:24px;height:24px;color:var(--hue);display:grid' }), h('h3', {}, title), h('button', { class: 'iconbtn', 'aria-label': 'Zamknij', onclick: closeOverlays, html: IC.x })),
      h('div', { class: 'body' }, body));
    d.classList.add('h-' + LISTS[T ? T.li : 0].hue);
    document.body.append(scrim, d);
    d.querySelector('header button').focus();
  }
  function showWzory() {
    if (!T.usedW && T.status === 'answering') { T.usedW = true; S.hints++; save(); }
    SFX.hint();
    const task = T.task;
    drawer('Wzory', IC.bulb, [
      ...(() => { const orig = T.mode === 'quick' ? T.item : task.items[T.idx]; const gk = (orig && orig.gk) || T.item.gk; return A.wzoryFor ? A.wzoryFor(task, orig, gk) : task.wzory; })().map(w => mdEl('div', w, { class: 'formula' })),
    ]);
    renderActionsOnly();
  }
  function showPrzyklad() {
    if (!T.usedP && T.status === 'answering') { T.usedP = true; S.hints++; save(); }
    SFX.hint();
    const gk = T.item.gk || (T.mode === 'orig' ? T.task.items[T.idx].gk : undefined) || (T.task.items[0] && T.task.items[0].gk);
    let ex; for (let k = 0; k < 8; k++) { ex = T.task.gen(gk); if (ex.q !== T.item.q) break; }
    const steps = (ex.steps || []).slice();
    const type = ex.type || 'fields';
    const stepsBox = h('div', { style: 'display:grid;gap:8px' });
    let shown = 0;
    const answerEl = () => {
      if (type === 'order') return h('div', { class: 'exq' }, h('b', {}, 'Dowód w kolejności:'), h('ol', {}, ex.order.steps.map(s => mdEl('li', s))));
      if (type === 'choice') return h('div', { class: 'exq' }, h('b', {}, 'Odpowiedź: '), ...ex.choice.correct.map(i => mdEl('div', ex.choice.opts[i])));
      if (ex.check) return mdEl('div', '<b>Odpowiedź:</b> ' + ex.showAns, { class: 'exq' });
      ex.gk = ex.gk || gk; const mc = A.buildMC(ex);
      return h('div', { class: 'exq' }, h('b', {}, 'Odpowiedź'), ...mc.groups.map(g => mdEl('div', (g.label ? A.mcLabel(g.label) + ': ' : '') + '$' + g.opts.find(o => o.ok).tex + '$')));
    };
    const btn = h('button', { class: 'btn primary', onclick: () => {
      if (shown < steps.length) { stepsBox.append(h('div', { class: 'exstep' }, h('span', { class: 'n' }, String(shown + 1)), mdEl('div', steps[shown]))); shown++; SFX.key(); }
      if (shown >= steps.length) { btn.replaceWith(answerEl()); SFX.star(); }
      else btn.textContent = 'Następny krok (' + (shown + 1) + '/' + steps.length + ')';
    } }, 'Pokaż pierwszy krok');
    if (!steps.length) btn.textContent = 'Pokaż odpowiedź';
    drawer('Przykład', IC.book, [
      h('div', { class: 'exq' }, md(ex.q)), stepsBox, btn,
    ]);
    renderActionsOnly();
  }
  function helpBox() {
    return h('div', { class: 'help', html: 'Jak wpisywać: <code>2+3i</code>, <code>√3</code> lub <code>sqrt(3)</code>, <code>∛2</code>, <code>root(4, 2)</code>, <code>π</code> lub <code>pi</code>, potęga <code>^</code>, ułamek <code>/</code> lub <code>:</code>, ułamki dziesiętne z kropką lub przecinkiem (<code>0,75</code>). Mnożenie można pomijać: <code>2√3i</code>. Postać wykładnicza: <code>2e^(iπ/3)</code>, trygonometryczna: <code>2(cos(π/3)+i sin(π/3))</code>. Kąty w radianach lub stopniach (<code>15°</code>), liczone modulo 2π. Kilka rozwiązań oddziel <code>;</code> (albo przecinkiem); działa też <code>±(2-i)</code>. Gdy coś nie istnieje: <code>brak</code>, <code>nie istnieje</code> lub <code>-</code>. Każdy równoważny zapis jest akceptowany — ale tam, gdzie wymagana jest postać a+bi, nie przejdzie przepisany z treści iloczyn ani iloraz liczb zespolonych.' });
  }

  /* ---------------- routing ---------------- */
  function setHash(x) { S.last = x; save(); try { if (location.hash !== '#' + x) history.replaceState(null, '', '#' + x); } catch (e) { /* ignoruj */ } }
  function fromHash() {
    const hs = (location.hash || '').slice(1);
    if (/^l[123]$/.test(hs)) { V = { view: 'list', list: +hs[1] - 1 }; return; }
    if (hs === 'stats') { V = { view: 'stats', list: V.list }; return; }
    if (hs === 'ranking') { V = { view: 'rank', list: V.list }; return; }
    const m = hs.match(/^t(\d+)-(\d+)$/);
    if (m) { const li = +m[1] - 1, task = LISTS[li] && LISTS[li].tasks.findIndex(t => t.id === m[1] + '.' + m[2]); if (task >= 0) { startTask(li, task); return 'started'; } }
    V = { view: 'list', list: 0 };
  }

  /* ---------------- renderowanie ---------------- */
  const app = () => $('#app');
  function render() {
    const root = app(); root.innerHTML = '';
    const hue = (V.view === 'stats' || V.view === 'rank') ? 'st' : LISTS[V.list].hue;
    document.body.className = 'h-' + hue;
    root.append(topBar(), h('div', { class: 'wrap' }, tabs(), V.view === 'list' ? listView() : V.view === 'stats' ? statsView() : V.view === 'rank' ? rankView() : taskView()));
    if (V.view === 'list') requestAnimationFrame(drawTrail);
    if (V.view === 'task') requestAnimationFrame(() => { if (T && T.status === 'answering') focusField(T.focus || 0, true); });
  }
  function renderTop() { const old = $('.top'); if (old) old.replaceWith(topBar()); }
  function renderActionsOnly() { const a = $('#actions'); if (a) a.replaceWith(actionsBar()); }

  function topBar() {
    const lv = levelInfo(S.xp);
    const top = h('header', { class: 'top' }, h('div', { class: 'wrap' },
      h('button', { class: 'logo', 'aria-label': 'Algebrownia — mapa', onclick: () => { T = null; V = { view: 'list', list: V.list }; setHash('l' + (V.list + 1)); render(); } }, h('span', { html: logoSVG }), h('b', {}, 'Algebrownia')),
      h('div', { class: 'spacer' }),
      h('div', { class: 'player' },
        h('div', { class: 'lvl', title: 'Poziom ' + lv.L, html: ringSVG(lv.into / lv.need, 42, 4, 'var(--xp)') + `<span style="position:relative">${lv.L}</span>` }),
        h('div', { class: 'xpbox' }, h('div', { class: 't' }, h('b', {}, lv.title), h('span', {}, xpText(lv))), h('div', { class: 'bar' }, h('i', { style: `width:${(100 * lv.into / lv.need).toFixed(1)}%` })))),
      h('span', { class: 'chip flame', title: 'Rozwiązane dzisiaj', html: IC.flame + '<span>' + ((S.days[today()] || {}).ok || 0) + '</span>' }),
      h('button', { class: 'iconbtn', 'aria-label': S.sound ? 'Wycisz dźwięki' : 'Włącz dźwięki', title: S.sound ? 'Dźwięk włączony' : 'Dźwięk wyłączony', html: S.sound ? IC.sound : IC.mute, onclick: () => { S.sound = !S.sound; save(); renderTop(); if (S.sound) SFX.correct(); } })));
    return top;
  }
  function tabs() {
    const bar = h('nav', { class: 'tabs', role: 'tablist', 'aria-label': 'Listy zadań' });
    LISTS.forEach((L, i) => {
      const p = listProgress(L);
      const sel = (V.view !== 'stats') && V.list === i;
      bar.append(h('button', { class: 'tab h-' + L.hue, role: 'tab', 'aria-selected': sel ? 'true' : 'false', onclick: () => { SFX.click(); T = null; V = { view: 'list', list: i }; S.tab = 'l' + (i + 1); save(); setHash('l' + (i + 1)); render(); } },
        h('span', { class: 'ring', html: ringSVG(p.solved / p.total, 30, 4, 'var(--hue)') }),
        h('span', { class: 'lbl' }, h('b', {}, L.title), h('small', {}, p.solved + '/' + p.total + ' podpunktów'))));
    });
    bar.append(h('button', { class: 'tab h-st', role: 'tab', 'aria-selected': V.view === 'stats' ? 'true' : 'false', onclick: () => { SFX.click(); T = null; V = { view: 'stats', list: V.list }; S.tab = 'stats'; save(); setHash('stats'); render(); } },
      h('span', { class: 'ring', html: IC.chart, style: 'color:var(--xp);display:grid;place-items:center' }), h('span', { class: 'lbl' }, h('b', {}, h('span', { class: 'full' }, 'Statystyki'), h('span', { class: 'short' }, 'Postęp')), h('small', {}, 'postępy i odznaki'))));
    bar.append(h('button', { class: 'tab h-st', role: 'tab', 'aria-selected': V.view === 'rank' ? 'true' : 'false', onclick: () => { SFX.click(); T = null; V = { view: 'rank', list: V.list }; setHash('ranking'); render(); } },
      h('span', { class: 'ring', html: IC.trophy, style: 'color:var(--xp);display:grid;place-items:center' }), h('span', { class: 'lbl' }, h('b', {}, 'Ranking'), h('small', {}, 'ze znajomymi'))));
    return bar;
  }

  function listView() {
    const L = LISTS[V.list]; const p = listProgress(L);
    const wrap = h('section', { class: 'h-' + L.hue });
    const hero = h('div', { class: 'hero' },
      h('div', {}, h('h1', {}, L.title + ' · ', h('span', {}, L.name)), mdEl('p', L.blurb)),
      h('div', { class: 'acts' },
        h('button', { class: 'btn primary', onclick: () => { const ti = L.tasks.findIndex(t => taskProgress(t).solved < t.items.length); startTask(V.list, ti < 0 ? 0 : ti); } }, h('span', { html: IC.next }), p.solved ? 'Kontynuuj' : 'Zacznij'),
        h('button', { class: 'btn', onclick: () => startQuick(V.list), title: '10 losowych przykładów' }, h('span', { html: IC.bolt }), 'Szybka runda')));
    const lb = h('div', { class: 'listbar' }, h('span', {}, `${p.solved}/${p.total} podpunktów`), h('div', { class: 'bar' }, h('i', { style: 'width:0' })), starsEl(0, 0), h('span', { html: IC.star.replace('<svg', '<svg style="width:15px;height:15px;color:var(--xp);vertical-align:-2px"') + ` ${p.stars}/${p.maxStars}` }));
    requestAnimationFrame(() => { const i = lb.querySelector('.bar i'); if (i) i.style.width = (100 * p.solved / p.total) + '%'; });
    const path = h('div', { class: 'path', id: 'path' }, h('svg', { class: 'trail', id: 'trail', 'aria-hidden': 'true' }));
    const pos = ['left', 'mid', 'right', 'mid'];
    L.tasks.forEach((t, i) => {
      const tp = taskProgress(t);
      const node = h('button', { class: 'node ' + pos[i % 4] + (tp.solved === tp.total ? ' done' : ''), style: `animation-delay:${i * 45}ms`, onclick: () => { SFX.click(); startTask(V.list, i); } },
        h('span', { class: 'disc', html: ringSVG(tp.solved / tp.total, 64, 6, 'var(--hue)') + `<b>${t.id}</b>` }),
        h('span', { class: 'meta' }, mdEl('h3', t.name), h('small', {}, `${tp.solved}/${tp.total} podpunktów` + (t.proof ? ' · dowód' : '')), starsEl(tp.stars)));
      path.append(node);
    });
    wrap.append(hero, lb, path);
    return wrap;
  }
  function drawTrail() {
    const path = $('#path'), svg = $('#trail'); if (!path || !svg) return;
    const pr = path.getBoundingClientRect();
    const pts = [...path.querySelectorAll('.disc')].map(d => { const r = d.getBoundingClientRect(); return [r.left - pr.left + r.width / 2, r.top - pr.top + r.height / 2]; });
    if (pts.length < 2) return;
    let d = `M${pts[0][0]},${pts[0][1]}`;
    for (let i = 1; i < pts.length; i++) { const [x0, y0] = pts[i - 1], [x1, y1] = pts[i]; const my = (y0 + y1) / 2; d += ` C${x0},${my} ${x1},${my} ${x1},${y1}`; }
    svg.setAttribute('viewBox', `0 0 ${pr.width} ${pr.height}`);
    svg.innerHTML = `<path d="${d}" fill="none" stroke="var(--hue)" stroke-opacity=".35" stroke-width="3" stroke-dasharray="2 9" stroke-linecap="round"/>`;
  }
  addEventListener('resize', () => { if (V.view === 'list') drawTrail(); });

  /* ---- widok zadania ---- */
  function taskView() {
    const L = T.L, task = T.task, it = T.item;
    const sec = h('section', { class: 'h-' + L.hue });
    const quick = T.mode === 'quick';
    const head = h('div', { class: 'taskhead' },
      h('button', { class: 'iconbtn', 'aria-label': 'Wróć do mapy', html: IC.back, onclick: () => { SFX.click(); const li = T.li; T = null; V = { view: 'list', list: li }; setHash('l' + (li + 1)); render(); } }),
      quick ? h('h2', {}, 'Szybka runda · ', h('span', {}, L.title)) : mdEl('h2', `<span>${task.id}</span> ` + task.name),
      h('div', { class: 'spacer' }),
      quick ? h('span', { class: 'chip' }, h('span', { html: IC.bolt }), String(T.quick.score)) : starsEl(taskProgress(task).stars));
    sec.append(head);
    if (quick) {
      const q = T.quick; const bar = h('div', { class: 'quickbar' }, h('span', { class: 'muted' }, (q.i + 1) + '/10'), h('div', { class: 'bar' }, h('i', { style: `width:${100 * q.i / 10}%` })));
      sec.append(bar);
    } else {
      const st = h('details', { class: 'statement' }, h('summary', {}, 'Treść z listy'), mdEl('div', task.statement, { style: 'margin-top:6px' }));
      sec.append(st);
      const dots = h('div', { class: 'dots', role: 'list', 'aria-label': 'Podpunkty' });
      task.items.forEach((x, i) => {
        const k = itemKey(task, i), s = S.items[k];
        const cls = 'dot' + (s ? ' gold' : '') + (i === T.idx && T.mode === 'orig' ? ' cur' : '');
        const lab = h('button', { class: cls, role: 'listitem', title: s ? 'Zaliczone' : 'Do zrobienia', onclick: () => { SFX.click(); T.idx = i; T.mode = 'orig'; T.item = task.items[i]; T.origKey = k; T.redeemed = false; resetAttempt(); render(); } });
        lab.append(md(x.label || String(i + 1)));
        dots.append(lab);
      });
      sec.append(dots);
    }
    // karta
    const card = h('article', { class: 'card', id: 'card' });
    const kick = h('div', { class: 'kicker' });
    if (quick) kick.append(h('span', { class: 'badge q' }, 'Zad. ' + task.id), mdEl('span', task.name));
    else if (T.mode === 'var') kick.append(h('span', { class: 'badge var' }, 'Podobny przykład'), h('span', {}, 'do ' + (task.items[T.idx].label || task.id)), pdots());
    else kick.append(h('span', { class: 'badge' }, task.id + (it.label ? ' · ' : '')), it.label ? md(it.label) : '', S.items[T.origKey] ? h('span', { class: 'badge', style: 'background:var(--ok-bg);color:var(--ok)' }, 'zaliczone') : '', (it.type || 'fields') !== 'order' && T.task.gen ? pdots() : '');
    card.append(kick, mdEl('div', it.q, { class: 'question' }));
    const type = it.type || 'fields';
    if (type === 'fields') card.append(mcUI(it));
    else if (type === 'choice') card.append(choiceUI(it));
    else card.append(orderUI(it));
    card.append(actionsBar());
    if (T.status !== 'answering') card.append(feedbackUI(it));
    sec.append(card);
    return sec;
  }

  /* pola + klawiatura */
  let lastInput = null;
  const coarse = () => window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
  let sysKbd = false;
  function fieldsUI(it) {
    const box = h('div', {});
    const list = h('div', { class: 'fields' });
    it.fields.forEach((f, i) => {
      const row = h('div', { class: 'field' + (T.marks ? (T.marks[i] ? ' ok' : ' bad') : '') });
      const lab = h('label', { for: 'f' + i }); const lt = f.label || 'x'; if (!/\\/.test(lt) && /^[a-ząćęłńóśźż ]{3,}$/i.test(lt)) lab.textContent = lt; else lab.append(md('$' + lt + '$'));
      if (f.kind === 'yesno') {
        const yn = h('div', { class: 'yn', role: 'group', 'aria-label': f.label },
          ...['tak', 'nie'].map(v => h('button', { 'aria-pressed': T.vals[i] === v ? 'true' : 'false', disabled: T.status !== 'answering', onclick: () => { T.vals[i] = v; SFX.key(); yn.querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', b.textContent.toLowerCase() === v ? 'true' : 'false')); } }, v === 'tak' ? 'Tak' : 'Nie')));
        lab.innerHTML = ''; lab.textContent = f.label;
        row.append(lab, h('div', { class: 'inbox' }, yn, T.marks && !T.marks[i] ? h('div', { class: 'preview err' }, 'Poprawnie: ' + (f.ans ? 'Tak' : 'Nie')) : ''));
      } else {
        const inp = h('input', { id: 'f' + i, type: 'text', autocomplete: 'off', autocapitalize: 'off', spellcheck: 'false', inputmode: coarse() && !sysKbd ? 'none' : 'text', value: T.vals[i] || '', 'aria-label': (f.label || 'odpowiedź').replace(/\\/g, ''), placeholder: placeholderFor(f), disabled: T.status !== 'answering' });
        const pv = h('div', { class: 'preview' + (T.msgs[i] ? ' err' : ''), 'aria-live': 'polite' });
        const upd = () => {
          T.vals[i] = inp.value; T.msgs[i] = null; pv.classList.remove('err'); pv.innerHTML = '';
          const v = inp.value.trim(); if (!v) return;
          try { const tx = A.previewTex(v, f); if (tx) pv.append(texNode(tx, false)); } catch (e) { pv.classList.add('err'); pv.textContent = e.message; }
        };
        inp.addEventListener('input', upd);
        inp.addEventListener('focus', () => { lastInput = inp; T.focus = i; });
        inp.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); if (i < it.fields.length - 1 && !(T.vals[i + 1] || '').trim()) focusField(i + 1); else submit(); } });
        if (T.msgs[i]) pv.textContent = T.msgs[i]; else if (T.vals[i]) setTimeout(upd, 0);
        const iw = h('div', { class: 'inwrap' }, inp);
        if (T.marks) iw.append(h('span', { class: 'mark', html: T.marks[i] ? IC.check : IC.x, style: `color:var(--${T.marks[i] ? 'ok' : 'bad'})` }));
        row.append(lab, h('div', { class: 'inbox' }, iw, pv));
      }
      list.append(row);
    });
    box.append(list);
    if (T.status === 'answering' && it.fields.some(f => f.kind !== 'yesno')) box.append(keypad(it));
    return box;
  }
  function pdots() {
    const n = practiceN();
    const go = () => { SFX.click(); startVariant(); };
    return h('span', { class: 'pdots' }, h('button', { class: 'plabel', onclick: go, title: 'Spróbuj podobnego przykładu' }, 'Podobne'),
      ...[0, 1, 2].map(i => h('button', { class: 'pdot' + (i < n ? ' on' : ''), onclick: go, title: (i < n ? 'Rozwiązany' : 'Spróbuj') + ' — podobny przykład ' + (i + 1) + '/3', 'aria-label': 'Podobny przykład ' + (i + 1) + ' z 3' + (i < n ? ', rozwiązany' : '') }, i < n ? h('span', { html: IC.check }) : String(i + 1))));
  }
  function mcUI(it) {
    const mc = A.buildMC(it);
    const box = h('div', { class: 'mc' });
    const single = mc.groups.length === 1;
    mc.groups.forEach((g, gi) => {
      const grp = h('div', { class: 'mcg', role: 'radiogroup' });
      if (g.label) grp.append(mdEl('div', A.mcLabel(g.label), { class: 'mcl' }));
      const done = T.status !== 'answering';
      g.opts.forEach((o, oi) => {
        const sel = T.sel[gi] === oi;
        let cls = 'opt mcopt';
        if (done) cls += o.ok ? ' ok' : sel ? ' chosen' : ' dim'; else if (sel) cls += ' picked';
        const b = h('button', { class: cls, role: 'radio', 'aria-checked': sel ? 'true' : 'false', disabled: done, onclick: () => {
          T.sel[gi] = oi; SFX.key();
          if (single) submit(); else box.replaceWith(mcUI(it));
        } }, h('span', { class: 'letter' }, 'ABCD'[oi]), mdEl('span', o.tex.split(',\\quad ').map(x => '<span class="part">$' + x + '$</span>').join('<span class="sep">, </span>'), { class: 'txt' }));
        if (done && sel) b.classList.add('picked');
        grp.append(b);
        if (done && sel && !o.ok && o.why) grp.append(mdEl('div', '<b>Skąd ten wynik:</b> ' + o.why, { class: 'why hit' }));
      });
      box.append(grp);
    });
    return box;
  }
  document.addEventListener('keydown', e => {
    if (!T || T.status !== 'answering' || (T.item.type || 'fields') !== 'fields' || e.target.tagName === 'INPUT') return;
    const k = e.key.toLowerCase(); const idx = '1234'.indexOf(k) >= 0 ? '1234'.indexOf(k) : 'abcd'.indexOf(k);
    if (idx < 0 || e.metaKey || e.ctrlKey || e.altKey) return;
    const mc = A.buildMC(T.item); if (mc.groups.length !== 1 || !mc.groups[0].opts[idx]) return;
    T.sel[0] = idx; submit();
  });
  function placeholderFor(f) {
    if (f.kind === 'set') return 'np. 1+2i; -1-2i';
    if (f.kind === 'mod') return 'liczba 0…' + (f.mod - 1);
    if (f.kind === 'angle') return 'np. 5π/12';
    if (f.allowBrak) return 'wartość albo „brak”';
    if ((f.vars || []).includes('alpha')) return 'np. sin(α)cos(β)';
    return 'wpisz wyrażenie';
  }
  function focusField(i, soft) {
    const el = document.getElementById('f' + i);
    if (el && !el.disabled) { if (soft && coarse()) { lastInput = el; return; } el.focus({ preventScroll: true }); lastInput = el; }
  }
  function keypad(it) {
    const keysWanted = new Set(it.keys || []);
    const fields = it.fields.filter(f => f.kind !== 'yesno');
    const onlyMod = fields.every(f => f.kind === 'mod');
    if (fields.some(f => f.kind === 'set')) keysWanted.add(';');
    if (fields.some(f => f.allowBrak)) keysWanted.add('brak');
    fields.forEach(f => (f.vars || []).forEach(v => keysWanted.add(v)));
    if (fields.some(f => f.kind === 'angle')) keysWanted.add('pi');
    const K = [];
    const add = (label, ins, cls = '', caret = 0, title) => K.push({ label, ins, cls, caret, title });
    ['7', '8', '9'].forEach(d => add(d, d, 'num'));
    add('(', '('); add(')', ')');
    if (!onlyMod) { add('i', 'i', 'fn'); add('π', 'π', 'fn'); }
    ['4', '5', '6'].forEach(d => add(d, d, 'num'));
    add('×', '·'); add('÷', '/');
    if (!onlyMod) { add('√', '√()', 'fn', -1, 'pierwiastek kwadratowy'); add('∛', '∛()', 'fn', -1, 'pierwiastek sześcienny'); }
    ['1', '2', '3'].forEach(d => add(d, d, 'num'));
    add('+', '+'); add('−', '-');
    if (!onlyMod) { add('xⁿ', '^', 'fn', 0, 'potęga'); add('x²', '^2', 'fn'); }
    add('0', '0', 'num'); add('.', '.', 'num');
    if (!onlyMod) { add('a⁄b', '()/()', 'fn', -4, 'ułamek'); add('ⁿ√', 'root(,)', 'fn', -2, 'pierwiastek n-tego stopnia: root(n, x)'); }
    if (keysWanted.has(';')) add(';', '; ', 'fn', 0, 'następne rozwiązanie');
    if (keysWanted.has('alpha')) add('α', 'α', 'fn'); if (keysWanted.has('beta')) add('β', 'β', 'fn');
    for (const v of ['n', 'm', 't', 'a', 'b']) if (keysWanted.has(v)) add(v, v, 'fn');
    for (const fn of ['sin', 'cos', 'tg', 'ctg']) if (keysWanted.has(fn)) add(fn, fn + '()', 'fn', -1);
    if (keysWanted.has('brak')) add('brak', '§brak', 'fn wide', 0, 'brak (nie istnieje)');
    add('←', '§left', 'ctl'); add('→', '§right', 'ctl'); add('⌫', '§bs', 'ctl'); add('C', '§clr', 'ctl', 0, 'wyczyść pole');
    const pad = h('div', { class: 'keypad', role: 'group', 'aria-label': 'Klawiatura matematyczna' });
    for (const k of K) {
      pad.append(h('button', { class: k.cls, title: k.title || k.label, 'aria-label': k.title || k.label, onmousedown: e => e.preventDefault(), onclick: () => press(k) }, k.label));
    }
    const head = h('div', { class: 'kp-head' }, h('span', {}, 'Klawiatura matematyczna — wstawia do aktywnego pola'),
      coarse() ? h('button', { onclick: () => { sysKbd = !sysKbd; render(); } }, sysKbd ? 'Ukryj klawiaturę systemową' : 'Klawiatura systemowa') : h('button', { onclick: () => drawer('Jak wpisywać odpowiedzi', IC.kbd, [helpBox()]) }, 'Jak wpisywać?'));
    return h('div', {}, head, pad);
  }
  function press(k) {
    SFX.key();
    let inp = lastInput && document.body.contains(lastInput) ? lastInput : document.getElementById('f' + (T.focus || 0));
    if (!inp || inp.disabled) return;
    const s = inp.selectionStart ?? inp.value.length, e = inp.selectionEnd ?? inp.value.length, v = inp.value;
    let nv = v, pos = s;
    if (k.ins === '§left') pos = Math.max(0, s - 1);
    else if (k.ins === '§right') pos = Math.min(v.length, e + 1);
    else if (k.ins === '§bs') { if (s !== e) { nv = v.slice(0, s) + v.slice(e); pos = s; } else if (s > 0) { nv = v.slice(0, s - 1) + v.slice(s); pos = s - 1; } }
    else if (k.ins === '§clr') { nv = ''; pos = 0; }
    else if (k.ins === '§brak') { nv = 'brak'; pos = 4; }
    else { const ins = k.ins; nv = v.slice(0, s) + ins + v.slice(e); pos = s + ins.length + (k.caret || 0); }
    inp.value = nv; inp.dispatchEvent(new Event('input'));
    if (!coarse() || sysKbd) inp.focus({ preventScroll: true });
    try { inp.setSelectionRange(pos, pos); } catch (er) { /* ignoruj */ }
  }

  function choiceUI(it) {
    const box = h('div', { class: 'choices', role: it.choice.multi ? 'group' : 'radiogroup' });
    if (it.choice.multi) box.append(h('div', { class: 'muted', style: 'font-size:13px' }, 'Zaznacz wszystkie poprawne.'));
    it.choice.opts.forEach((o, i) => {
      const sel = T.choice.has(i);
      let cls = 'opt' + (it.choice.multi ? '' : ' single');
      if (T.status !== 'answering') { const good = it.choice.correct.includes(i); if (good) cls += ' ok'; else if (sel) cls += ' bad'; }
      const b = h('button', { class: cls, 'aria-pressed': sel ? 'true' : 'false', disabled: T.status !== 'answering', onclick: () => {
        SFX.key();
        if (it.choice.multi) { sel ? T.choice.delete(i) : T.choice.add(i); } else { T.choice.clear(); T.choice.add(i); }
        const nb = choiceUI(it); box.replaceWith(nb);
      } }, h('span', { class: 'box' }), mdEl('span', o, { class: 'txt' }));
      box.append(b);
    });
    return box;
  }
  function orderUI(it) {
    if (!T.pool) { const all = [...it.order.steps.map((s, i) => ({ s, i })), ...(it.order.extra || []).map((s, j) => ({ s, i: 100 + j }))]; T.pool = shuffleNotSorted(all); }
    const box = h('div', { class: 'order' });
    const proof = h('div', { class: 'proof', 'aria-label': 'Twój dowód' });
    T.order.forEach((k, pos) => {
      const st = T.pool.find(x => x.i === k);
      let cls = 'step'; if (T.status !== 'answering') cls += k === pos ? ' ok' : ' bad';
      proof.append(h('button', { class: cls, disabled: T.status !== 'answering', title: 'Kliknij, aby usunąć', onclick: () => { T.order.splice(pos, 1); SFX.key(); box.replaceWith(orderUI(it)); } }, h('span', { class: 'n' }, String(pos + 1)), mdEl('span', st.s, { class: 'tx' })));
    });
    const pool = h('div', { class: 'pool' });
    T.pool.filter(x => !T.order.includes(x.i)).forEach(x => {
      pool.append(h('button', { class: 'step', disabled: T.status !== 'answering', onclick: () => { T.order.push(x.i); SFX.key(); box.replaceWith(orderUI(it)); } }, h('span', { class: 'n' }, '+'), mdEl('span', x.s, { class: 'tx' })));
    });
    box.append(h('div', {}, h('h4', {}, 'Twój dowód'), proof));
    if (T.status === 'answering') box.append(h('div', {}, h('h4', {}, 'Dostępne kroki' + ((it.order.extra || []).length ? ' (uwaga: część jest fałszywa)' : '')), pool));
    return box;
  }
  function shuffleNotSorted(arr) { let a; let k = 0; do { a = A.R.shuffle(arr); k++; } while (k < 10 && a.every((x, i) => x.i === i)); return a; }

  function actionsBar() {
    const it = T.item;
    const bar = h('div', { class: 'actions', id: 'actions' });
    if (T.status === 'answering') {
      const needBtn = (it.type || 'fields') !== 'fields' || A.buildMC(it).groups.length > 1;
      if (needBtn) bar.append(h('button', { class: 'btn primary', id: 'submitBtn', onclick: submit }, h('span', { html: IC.check }), 'Sprawdź'));
      bar.append(h('div', { class: 'spacer' }));
      bar.append(h('div', { class: 'life' },
        h('button', { class: 'btn small' + (T.usedW ? ' used' : ''), onclick: showWzory, title: 'Koło ratunkowe 1: wzory i definicje' }, h('span', { html: IC.bulb }), 'Wzory'),
        h('button', { class: 'btn small' + (T.usedP ? ' used' : ''), onclick: showPrzyklad, title: 'Koło ratunkowe 2: podobny przykład z rozwiązaniem' }, h('span', { html: IC.book }), 'Przykład')));
    }
    return bar;
  }
  function feedbackUI(it) {
    const ok = T.status === 'correct'; const type = it.type || 'fields';
    const fb = h('div', { class: 'feedback ' + (ok ? 'ok' : 'learn'), id: 'feedback', role: 'status' });
    const msgsOk = ['Świetnie!', 'Dokładnie tak!', 'Pięknie policzone!', 'Bezbłędnie!', 'Tak jest!', 'Znakomicie!'];
    if (ok) fb.append(h('h3', {}, h('span', { html: IC.check, style: 'width:22px;height:22px;display:grid' }), msgsOk[Math.floor(Math.random() * msgsOk.length)]));
    else fb.append(h('h3', {}, h('span', { html: IC.bulb, style: 'width:22px;height:22px;display:grid' }), 'Zobacz, jak to policzyć'));
    if (ok && T.redeemed) fb.append(h('p', { style: 'margin:6px 0 0' }, 'Podpunkt ' + (T.task.items[T.idx].label || '') + ' zaliczony.'));
    if (!ok) {
      if (T.mode === 'orig' && T.task.gen) fb.append(h('p', { style: 'margin:6px 0 0' }, 'Rozwiąż podobny przykład — wtedy ten podpunkt się zaliczy.'));
      const ans = h('div', { class: 'ans' }, h('b', {}, 'Poprawna odpowiedź:'));
      if (type === 'fields') { /* zaznaczona na zielono */ } else if (false) {
        if (it.check) ans.append(mdEl('div', it.showAns));
        else it.fields.forEach(f => ans.append(mdEl('div', '$' + (f.label ? f.label + ' = ' : '') + A.ansTex(f) + '$')));
      } else if (type === 'choice') it.choice.correct.forEach(i => ans.append(mdEl('div', it.choice.opts[i])));
      else ans.append(h('ol', {}, it.order.steps.map(s => mdEl('li', s))));
      if (type !== 'fields') fb.append(ans);
    }
    const sol = it.sol || it.steps;
    if (sol && sol.length && (!ok || type !== 'order')) {
      const det = h('details', { open: !ok ? '' : null }, h('summary', { style: 'cursor:pointer;font-weight:600' }, ok ? 'Rozwiązanie' : 'Rozwiązanie krok po kroku'), h('ol', {}, sol.map(s => mdEl('li', s))));
      fb.append(det);
    }
    const row = h('div', { class: 'row' });
    if (T.mode === 'quick') row.append(h('button', { class: 'btn primary', onclick: goNext }, T.quick.i >= 9 ? 'Podsumowanie' : 'Dalej', h('span', { html: IC.next })));
    else {
      const n = practiceN(), canP = !!T.task.gen && n < 3;
      const pBtn = cls => h('button', { class: 'btn ' + cls, onclick: startVariant }, h('span', { html: IC.dice }), 'Podobny przykład' + (canP ? ' (' + (n + 1) + '/3)' : ''));
      const nextBtn = cls => h('button', { class: 'btn ' + cls, onclick: goNext }, 'Dalej', h('span', { html: IC.next }));
      if (ok) { row.append(nextBtn('primary')); if (T.task.gen) row.append(pBtn('')); }
      else { if (T.task.gen) row.append(pBtn('primary')); row.append(nextBtn(T.task.gen ? '' : 'primary')); }
    }
    fb.append(row);
    setTimeout(() => { const b = row.querySelector('button'); if (b) b.focus({ preventScroll: true }); }, 50);
    return fb;
  }


  /* ---- ranking ---- */
  // Dostawca danych: na GitHubie window.AQRank (Firebase), tutaj podgląd z przykładowymi graczami.
  const DEMO = {
    demo: true, meNo: 7,
    others: [
      { id: 'd1', name: 'Kasia', xp: 3210, solved: 178, week: 410 }, { id: 'd2', name: 'Anon 3', xp: 2480, solved: 141, week: 95 },
      { id: 'd3', name: 'Bartek M.', xp: 1890, solved: 109, week: 520 }, { id: 'd4', name: 'Ola', xp: 1320, solved: 80, week: 260 },
      { id: 'd5', name: 'Anon 5', xp: 760, solved: 44, week: 0 }, { id: 'd6', name: 'Michał', xp: 540, solved: 33, week: 140 },
      { id: 'd7', name: 'Anon 2', xp: 210, solved: 12, week: 30 }, { id: 'd8', name: 'Zuza', xp: 95, solved: 6, week: 95 },
    ],
  };
  function weekStart(d = new Date()) { const x = new Date(d.getFullYear(), d.getMonth(), d.getDate()); x.setDate(x.getDate() - ((x.getDay() + 6) % 7)); return x; }
  const dkey = d => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  const weekKey = () => dkey(weekStart());
  function myWeekXP() {
    let w = 0; const st = weekStart();
    for (let k = 0; k < 7; k++) { const d = new Date(st); d.setDate(st.getDate() + k); w += (S.xpDays || {})[dkey(d)] || 0; }
    return w;
  }
  const myName = () => S.name || (window.AQRank ? (window.AQRank.meNo ? 'Anon ' + window.AQRank.meNo : 'Anon') : 'Anon ' + DEMO.meNo);
  function rankRows() {
    const P = window.AQRank;
    const wk = weekKey();
    const others = P ? P.rows().filter(r => r.id !== P.uid && r.xp > 0).map(r => Object.assign({}, r, { week: r.weekKey === wk ? (r.week || 0) : 0 })) : DEMO.others;
    const sm = summary();
    const me = { id: 'me', me: true, name: myName(), xp: S.xp, solved: sm.solved, week: myWeekXP() };
    return [...others, me];
  }
  function renameDialog() {
    const inp = h('input', { type: 'text', maxlength: '24', value: myName(), 'aria-label': 'Twoja nazwa', class: 'rinput' });
    const err = h('div', { class: 'rerr' });
    const ok = () => {
      const v = inp.value.trim().replace(/\s+/g, ' ');
      if (v.length < 2) { err.textContent = 'Co najmniej 2 znaki.'; return; }
      S.name = v; save(); if (window.AQRank && window.AQRank.rename) window.AQRank.rename(v);
      closeOverlays(); SFX.click(); render();
    };
    inp.addEventListener('keydown', e => { if (e.key === 'Enter') ok(); });
    modal([h('h2', {}, 'Twoja nazwa'), h('p', {}, 'Tak zobaczą Cię znajomi w rankingu.'), inp, err, h('div', { class: 'row' }, h('button', { class: 'btn primary', onclick: ok }, 'Zapisz'), h('button', { class: 'btn', onclick: closeOverlays }, 'Anuluj'))]);
    setTimeout(() => { inp.focus(); inp.select(); }, 50);
  }
  const AV = ['var(--l1)', 'var(--l2)', 'var(--l3)', 'var(--accent)', '#7fb3e6', '#d7a6d0'];
  const avatar = name => { let hs = 0; for (const ch of name) hs = (hs * 31 + ch.charCodeAt(0)) >>> 0; const ini = /^Anon \d+$/.test(name) ? 'A' + name.slice(5) : name.trim().split(/\s+/).map(w => w[0]).join('').slice(0, 2).toUpperCase(); return h('span', { class: 'av', style: '--c:' + AV[hs % AV.length] }, ini); };
  let rankMode = 'all';
  function rankView() {
    const sec = h('section', { class: 'h-st' });
    const P = window.AQRank;
    if (P && P.status !== 'ready') {
      const sm = summary(), lv = levelInfo(S.xp), nm = myName();
      sec.append(h('div', { class: 'hero' }, h('div', {}, h('h1', {}, 'Ranking'))));
      sec.append(h('div', { class: 'mecard' }, avatar(nm), h('div', { class: 'mewho' }, h('b', {}, nm), h('small', {}, lv.title)),
        h('button', { class: 'btn small', onclick: renameDialog }, 'Zmień nazwę'),
        h('div', { class: 'mepos' }, h('small', {}, 'XP'), h('b', {}, String(S.xp)))));
      const list = h('ol', { class: 'rlist' });
      list.append(h('li', { class: 'rrow me' }, h('span', { class: 'rpos' }, '–'), avatar(nm),
        h('div', { class: 'rwho' }, h('b', {}, nm, h('span', { class: 'you' }, 'Ty')), h('small', {}, lv.title + ' · ' + sm.solved + '/' + sm.total), h('div', { class: 'bar' }, h('i', { style: `width:${100 * sm.solved / sm.total}%` }))),
        h('div', { class: 'rxp' }, h('b', {}, String(S.xp)), h('small', {}, 'XP'))));
      sec.append(list, h('p', { class: 'demo-note' }, P.status === 'error' ? 'Wyniki innych graczy są chwilowo niedostępne.' : 'Wczytywanie wyników innych graczy…'));
      return sec;
    }
    const rows = rankRows();
    const key = rankMode === 'week' ? 'week' : 'xp';
    rows.sort((a, b) => (b[key] - a[key]) || (b.xp - a.xp));
    const pos = rows.findIndex(r => r.me) + 1;
    const me = rows[pos - 1];
    const lvMe = levelInfo(S.xp);
    sec.append(h('div', { class: 'hero' }, h('div', {}, h('h1', {}, 'Ranking'))));
    sec.append(h('div', { class: 'mecard' },
      avatar(me.name),
      h('div', { class: 'mewho' }, h('b', {}, me.name), h('small', {}, lvMe.title)),
      h('button', { class: 'btn small', onclick: renameDialog }, 'Zmień nazwę'),
      h('div', { class: 'mepos' }, h('small', {}, rankMode === 'week' ? 'w tym tygodniu' : 'miejsce'), h('b', {}, pos + '.'))));
    const seg = h('div', { class: 'seg', role: 'tablist' },
      ...[['all', 'Od początku'], ['week', 'Ten tydzień']].map(([k, l]) => h('button', { role: 'tab', 'aria-selected': rankMode === k ? 'true' : 'false', onclick: () => { rankMode = k; SFX.click(); render(); } }, l)));
    sec.append(seg);
    const list = h('ol', { class: 'rlist' });
    const total = summary().total;
    rows.forEach((r, i) => {
      const lv = levelInfo(r.xp);
      list.append(h('li', { class: 'rrow' + (r.me ? ' me' : ''), style: `animation-delay:${i * 30}ms` },
        h('span', { class: 'rpos' }, String(i + 1)), avatar(r.name),
        h('div', { class: 'rwho' }, h('b', {}, r.name, r.me ? h('span', { class: 'you' }, 'Ty') : ''), h('small', {}, lv.title + ' · ' + r.solved + '/' + total), h('div', { class: 'bar' }, h('i', { style: `width:${Math.min(100, 100 * r.solved / total)}%` }))),
        h('div', { class: 'rxp' }, h('b', {}, String(r[key])), h('small', {}, rankMode === 'week' ? 'XP w tym tyg.' : 'XP'))));
    });
    sec.append(list);
    if (!window.AQRank) sec.append(h('p', { class: 'demo-note' }, 'Podgląd: pozostali gracze to przykładowe dane. Twój wiersz liczy się na żywo.'));
    return sec;
  }

  /* ---- statystyki ---- */
  function statsView() {
    const lv = levelInfo(S.xp);
    const sec = h('section', { class: 'h-st' });
    const totalItems = LISTS.reduce((a, L) => a + listProgress(L).total, 0), solved = LISTS.reduce((a, L) => a + listProgress(L).solved, 0);
    sec.append(h('div', { class: 'hero' }, h('div', {}, h('h1', {}, 'Twoje ', h('span', {}, 'postępy')))));
    const kpi = (label, val, sub) => h('div', { class: 'kpi' }, h('small', {}, label), h('b', {}, val), h('span', {}, sub));
    sec.append(h('div', { class: 'kpis' },
      kpi('Poziom', String(lv.L), lv.title),
      kpi('Doświadczenie', S.xp + ' XP', lv.max ? 'poziom maksymalny' : (lv.need - lv.into) + ' XP do kolejnego'),
      kpi('Zaliczone podpunkty', solved + '/' + totalItems, Math.round(100 * solved / totalItems) + '% wszystkich list'),
      kpi('Rozwiązane przykłady', String(S.correct), 'łącznie z podobnymi'),
      kpi('Podobne przykłady', String(S.variants), Object.values(S.practice || {}).filter(x => x >= 3).length + ' pełnych serii'),
      kpi('Dni nauki z rzędu', String(S.dayStreak || 0), 'dzisiaj: ' + ((S.days[today()] || {}).ok || 0))));
    sec.append(h('h2', { class: 'sec' }, 'Listy'));
    const lp = h('div', { class: 'lp' });
    LISTS.forEach(L => {
      const p = listProgress(L);
      const row = h('div', { class: 'lprow h-' + L.hue }, h('b', {}, L.title + ' · ' + L.name), h('span', { class: 'muted' }, `${p.solved}/${p.total} · ★ ${p.stars}/${p.maxStars}`), h('div', { class: 'bar' }, h('i', { style: 'width:0' })),
        h('div', { class: 'tasks' }, L.tasks.map(t => { const tp = taskProgress(t); return h('span', { class: 'tpill' + (tp.stars >= 3 ? ' s3' : tp.solved ? ' s1' : ''), title: `${tp.solved}/${tp.total}, ${tp.stars}★` }, t.id + ' ' + '★'.repeat(tp.stars)); })));
      requestAnimationFrame(() => { row.querySelector('.bar i').style.width = (100 * p.solved / p.total) + '%'; });
      lp.append(row);
    });
    sec.append(lp);
    sec.append(h('h2', { class: 'sec' }, 'Ostatnie 14 dni'), activityChart());
    sec.append(h('h2', { class: 'sec' }, 'Odznaki'));
    sec.append(h('div', { class: 'badges' }, BADGES.map(b => h('div', { class: 'bdg' + (S.badges[b.id] ? '' : ' locked') }, h('span', { class: 'ic', html: IC.trophy }), h('div', {}, h('b', {}, b.name), h('small', {}, b.desc))))));
    const dz = h('div', { class: 'danger' });
    const resetBtn = h('button', { class: 'btn small ghost', onclick: () => {
      dz.innerHTML = ''; dz.append(h('span', {}, 'Na pewno wyzerować cały postęp? Tego nie da się cofnąć.'), h('button', { class: 'btn small', style: 'border-color:var(--bad);color:var(--bad)', onclick: () => { const snd = S.sound; S = blank(); S.sound = snd; save(); render(); toast('Postęp wyzerowany', 'Zaczynasz od nowa', 'flag'); } }, 'Tak, wyzeruj'), h('button', { class: 'btn small', onclick: () => render() }, 'Anuluj'));
    } }, 'Wyzeruj postęp');
    dz.append(resetBtn);
    sec.append(dz);
    return sec;
  }
  function activityChart() {
    const days = []; const d0 = new Date();
    for (let k = 13; k >= 0; k--) { const d = new Date(d0); d.setDate(d.getDate() - k); const key = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); days.push({ key, lab: d.getDate() + '.' + String(d.getMonth() + 1).padStart(2, '0'), v: S.days[key] || { ok: 0, bad: 0 } }); }
    const max = Math.max(4, ...days.map(x => x.v.ok));
    const nice = Math.ceil(max / 4) * 4;
    const W = 900, H = 190, padL = 30, padB = 26, padT = 10, bw = (W - padL - 10) / 14;
    const y = v => padT + (H - padT - padB) * (1 - v / nice);
    let svg = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Poprawne i błędne odpowiedzi w ostatnich 14 dniach">`;
    for (let g = 0; g <= 4; g++) { const v = nice * g / 4; svg += `<line x1="${padL}" x2="${W - 6}" y1="${y(v)}" y2="${y(v)}" stroke="var(--line)" stroke-width="1"/><text x="${padL - 6}" y="${y(v) + 4}" text-anchor="end" font-size="11" fill="var(--muted)" font-family="Inter">${v}</text>`; }
    days.forEach((dd, i) => {
      const x = padL + i * bw + bw * 0.18, w = bw * 0.64;
      const ok = dd.v.ok, bad = 0;
      if (ok) svg += `<rect x="${x}" y="${y(ok)}" width="${w}" height="${y(0) - y(ok)}" rx="3" fill="var(--ok)"><title>${dd.lab}: ${ok} dobrze</title></rect>`;
      if (bad) svg += `<rect x="${x}" y="${y(ok + bad)}" width="${w}" height="${y(ok) - y(ok + bad) - 1}" rx="3" fill="var(--bad)" fill-opacity=".55"><title>${dd.lab}: ${bad} źle</title></rect>`;
      if (i % 2 === 1 || i === 13) svg += `<text x="${x + w / 2}" y="${H - 8}" text-anchor="middle" font-size="11" fill="var(--muted)" font-family="Inter">${i === 13 ? 'dziś' : dd.lab}</text>`;
    });
    svg += '</svg>';
    const legend = h('div', { style: 'font-size:12.5px;color:var(--muted);margin-top:6px' }, 'Rozwiązane przykłady dziennie');
    return h('div', { class: 'chart' }, h('div', { html: svg }), legend);
  }

  /* ---------------- start ---------------- */
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeOverlays(); });
  addEventListener('hashchange', () => { const r = fromHash(); if (r !== 'started') render(); });
  let booted = false;
  function boot() {
    if (booted) return; booted = true;
    if (window.MathJax && MathJax.svgStylesheet) { try { document.head.appendChild(MathJax.svgStylesheet()); } catch (e) { /* ignoruj */ } }
    // ostatnio otwarty widok; przy pierwszym uruchomieniu — Lista 1
    const want = (location.hash || '').slice(1) || S.last || 'l1';
    try { history.replaceState(null, '', '#' + want); } catch (e) { /* ignoruj */ }
    V = { view: 'list', list: 0 };
    const r = fromHash(); if (r !== 'started') render();
  }
  function waitMJ() {
    const t0 = Date.now();
    const tick = () => {
      if (window.MathJax && MathJax.startup && MathJax.startup.promise && MathJax.tex2svg) { MathJax.startup.promise.then(() => { mjReady = true; texCache.clear(); boot(); if (booted) render(); }); return; }
      if (Date.now() - t0 > 8000) { boot(); return; }
      setTimeout(tick, 60);
    };
    tick();
  }
  function summary() {
    let solved = 0, total = 0, stars = 0;
    for (const L of LISTS) { const p = listProgress(L); solved += p.solved; total += p.total; stars += p.stars; }
    return { xp: S.xp, level: levelInfo(S.xp).L, solved, total, stars, correct: S.correct, attempts: S.correct, best: 0 };
  }
  A.ui = { weekKey, myWeekXP, myName, h, IC, md, toast, SFX, confetti, levelInfo, summary, getS: () => S, setS: ns => { S = Object.assign(blank(), ns); try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* ignoruj */ } }, render: () => { if (booted) render(); }, isRank: () => V.view === 'rank', closeOverlays, modal };
  if (window.AQRank && window.AQRank.init) window.AQRank.init();
  waitMJ();
})();
