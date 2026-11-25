/* Matematyka — interfejs gry */
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
    moon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.5 14.2A8.5 8.5 0 1 1 9.8 3.5a6.8 6.8 0 0 0 10.7 10.7Z"/></svg>',
    sun: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4.2"/><path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M5.3 18.7l1.6-1.6M17.1 6.9l1.6-1.6"/></svg>',
    sheet: '<svg viewBox="0 0 24 24" fill="none"><path d="M6 2.8h8.2L19 7.6V20a1.2 1.2 0 0 1-1.2 1.2H6A1.2 1.2 0 0 1 4.8 20V4A1.2 1.2 0 0 1 6 2.8Z" fill="#fff" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M14 2.8V7a.8.8 0 0 0 .8.8H19" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><rect x="7" y="9.4" width="9.8" height="2.8" rx=".6" fill="#b98ae0"/><path d="M7.4 15.2h9M7.4 18.2h6" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>',
    star: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.8l2.8 5.9 6.4.8-4.7 4.4 1.2 6.4L12 17.2l-5.7 3.1 1.2-6.4L2.8 9.5l6.4-.8z"/></svg>',
    solved: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M8 12.5l2.8 2.8L16.5 9.5"/></svg>',
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
  const ymd = d => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  const yesterday = () => { const y = new Date(); y.setDate(y.getDate() - 1); return ymd(y); };
  const liveStreak = (n, day) => (day && (day === today() || day === yesterday()) ? n || 0 : 0);
  const curStreak = () => liveStreak(S.dayStreak, S.lastDay);
  const today = () => { const d = new Date(); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); };

  /* ---------------- poziomy ---------------- */
  // Progi dopasowane do list: Lista 1 = 520 XP, Listy 1–2 = 1650 XP, wszystko = 2500 XP (250 podpunktów × 10).
  // Arcymistrz przy 2300 XP ≈ 92% podstawowego zestawu; podobne przykłady przyspieszają drogę.
  // pierwsze 15 progów bez zmian (nikt nie traci poziomu); 16–25 dla drugiego przedmiotu
  const LEVELS = [0, 80, 170, 270, 390, 510, 680, 860, 1050, 1250, 1460, 1700, 1900, 2100, 2300, 2550, 2850, 3200, 3600, 4050, 4550, 5100, 5750, 6500, 7400];
  const TITLES = ['Pierwszak', 'Tropiciel ułamków', 'Pogromca nawiasów', 'Pogromca niewymierności', 'Rachmistrz bez kalkulatora',
    'Zegarmistrz ℤₚ', 'Tester działań', 'Mistrz skracania', 'Architekt ciał', 'Odkrywca liczby i',
    'Wielomianowy wirtuoz', 'Mistrz sprzężenia', 'Strażnik wzorów redukcyjnych', 'Zaklinacz delty', 'Kartograf płaszczyzny Gaussa',
    'Nawigator kątów', 'Łowca tożsamości', 'Mag de Moivre’a', 'Władca potęg', 'Geniusz dowodów',
    'Legenda okręgu jednostkowego', 'Profesor', 'Dziekan', 'Mistrz matematyki', 'Arcymistrz'];
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
  function confetti(n = 60, x = innerWidth / 2, y = innerHeight / 2.2, spread = 1, pal) {
    if (reduced()) return;
    if (!fxCanvas) { fxCanvas = h('canvas', { class: 'fx' }); document.body.append(fxCanvas); }
    const cs = getComputedStyle(document.documentElement);
    const bcs = getComputedStyle(document.body);
    const cols = pal === 'gold' ? ['--g3', '--g2', '--g2', '--g1', '--g4', '--xp'].map(v => bcs.getPropertyValue(v).trim() || '#fc0') : ['--xp', '--l1', '--l2', '--l3', '--brand', '--ok'].map(v => cs.getPropertyValue(v).trim() || '#fc0');
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
    const t = h('div', { class: 'toast' }, h('span', { html: IC[icon] }), h('div', {}, h('b', {}, title), sub ? h('small', {}, typeof sub === 'string' && sub.includes('$') ? md(sub) : sub) : ''));
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
  // \begin{wrap}…\end{wrap}: długi wzór łamany na telefonie w wiersze, na szerokim ekranie w jednej linijce
  const wideScreen = () => { try { return innerWidth >= 760; } catch (e) { return true; } };
  function wrapTex(tex) {
    if (!/\\begin\{wrap\}/.test(tex)) return tex;
    return tex.replace(/\\begin\{wrap\}([\s\S]*?)\\end\{wrap\}/g, (m, inner) => wideScreen()
      ? inner.split(/\\\\/).map(l => l.replace(/^(\s*[-+=]?)\s*&/, '$1').replace(/^\\qquad/, '').replace(/&/g, '')).join(' ')
      : '\\begin{aligned}' + inner + '\\end{aligned}');
  }
  // kosmetyka zapisu z generatorów: 1x → x, −1i → −i, +0y → (nic), 0a+… → …, (…)^{1} → (…)
  function tidyTex(tex) {
    let t = tex;
    t = t.replace(/(^|[=+\-(,{&\s]|\\\\|\\begin\{cases\})1(?=[a-zA-Z])(?!(?:cdot|ldots|quad|frac|left|right|mid|equiv|pmod|in|to|sqrt|text)\b)/g, '$1');
    t = t.replace(/[+-]0(?:[a-zA-Z](?:_\{?\d+\}?)?)(?![a-zA-Z0-9^{])/g, '');
    t = t.replace(/(^|[=(&{]|\\\\|\\begin\{cases\})(\s*)0[a-zA-Z](?:_\{?\d+\}?)?(?![a-zA-Z0-9^])\s*\+/g, '$1$2').replace(/(^|[=(&{]|\\\\|\\begin\{cases\})(\s*)0[a-zA-Z](?:_\{?\d+\}?)?(?![a-zA-Z0-9^])\s*-/g, '$1$2-');
    t = t.replace(/=0\+(?=[0-9a-z(\\])/g, '=');
    t = t.replace(/(\)|\\right\))\^\{1\}(?![0-9])/g, '$1');
    return t;
  }
  A.tidyTex = tidyTex;
  function md(markup) {
    const frag = document.createDocumentFragment();
    for (const p of A.mdToTexParts(String(markup))) {
      if (p.text !== undefined) { const s = h('span', { html: p.text }); frag.append(s); }
      else frag.append(texNode(wrapTex(tidyTex(p.tex)), p.display));
    }
    return frag;
  }
  const mdEl = (tag, markup, attrs = {}) => { const el = h(tag, attrs); el.append(md(markup)); return el; };

  /* ---------------- dane pomocnicze ---------------- */
  const LISTS = A.lists;
  const itemKey = (t, i) => t.id + '#' + i;
  LISTS.forEach(L => { if (!L.subject) L.subject = 'alg'; });
  const SUBJ = [{ id: 'alg', name: 'Algebra liniowa', short: 'Algebra', color: '#f0b65a' }, { id: 'pro', name: 'Proseminarium', short: 'Proseminarium', color: '#a594ff' }, { id: 'etl', name: 'Elementarna teoria liczb', short: 'ETL', nav: 'ETL', color: '#64aee8' }];
  const tid = t => String(t.id).replace(/^[PE]/, '');
  const lhash = i => LISTS[i].id;
  const subjOf = i => (LISTS[i] && LISTS[i].subject) || 'alg';
  const subjLists = sid => LISTS.map((L, i) => (L.subject === sid ? i : -1)).filter(i => i >= 0);
  const subjProgress = sid => subjLists(sid).reduce((a, i) => { const p = listProgress(LISTS[i]); a.solved += p.solved; a.total += p.total; return a; }, { solved: 0, total: 0 });
  const curSubj = () => (V.view === 'list' || V.view === 'task' ? subjOf(V.list) : (S.subj || subjOf(V.list)));
  function taskProgress(t) {
    let solved = 0, practiced = 0, practicable = 0;
    t.items.forEach((it, i) => { const k = itemKey(t, i); if (S.items[k]) solved++; if (!['order', 'guided'].includes(it.type || 'fields')) { practicable++; if ((S.practice || {})[k] >= 1) practiced++; } });
    const total = t.items.length;
    return { solved, total, done: solved === total, practiced, practicable };
  }
  function listProgress(L) {
    let s = 0, t = 0, done = 0;
    for (const task of L.tasks) { const p = taskProgress(task); s += p.solved; t += p.total; if (p.done) done++; }
    return { solved: s, total: t, done, tasks: L.tasks.length };
  }
  // żółty pasek postępu zadania; prev — poprzedni ułamek (do animacji przyrostu)
  function pbarEl(solved, total, opts = {}) {
    const f = total ? solved / total : 0, full = solved >= total && total > 0;
    const i = h('i', { style: 'width:' + (100 * (opts.from != null ? opts.from : f)) + '%' });
    const el = h('div', { class: 'pbar' + (full && !opts.burst ? ' full' : '') + (opts.cls ? ' ' + opts.cls : ''), role: 'progressbar', 'aria-valuemin': '0', 'aria-valuemax': String(total), 'aria-valuenow': String(solved), 'aria-label': solved + ' z ' + total + ' podpunktów' }, i);
    if (opts.from != null && opts.from !== f) requestAnimationFrame(() => requestAnimationFrame(() => { i.style.width = (100 * f) + '%'; }));
    if (opts.burst) setTimeout(() => barBurst(el, total === 1 ? 'GOTOWE!' : 'KOMPLET!'), total === 1 ? 250 : 550);
    return el;
  }
  function barBurst(el, label = 'KOMPLET!') {
    if (!el.isConnected) return;
    el.classList.add('full', 'burst');
    const r = el.getBoundingClientRect(), x = r.right - 4, y = r.top + r.height / 2;
    const small = label !== 'KOMPLET!';
    if (small) SFX.star(); else SFX.level();
    confetti(small ? 45 : 110, x, y, small ? 0.8 : 1.1, 'gold');
    if (!reduced()) {
      const flash = h('div', { class: 'barflash', style: `left:${r.left - 12}px;top:${r.top - 12}px;width:${r.width + 24}px;height:${r.height + 24}px` });
      const ring = h('div', { class: 'shock', style: `left:${x}px;top:${y}px` });
      document.body.append(flash, ring);
      for (let k = 0; k < 22; k++) {
        const a = Math.PI * 2 * k / 22 + Math.random() * 0.3, d = 50 + Math.random() * 70;
        const sp = h('div', { class: 'bspark', style: `left:${x}px;top:${y}px;--dx:${Math.cos(a) * d}px;--dy:${Math.sin(a) * d}px;animation-delay:${Math.random() * 80}ms` });
        document.body.append(sp); setTimeout(() => sp.remove(), 1000);
      }
      const lab = h('div', { class: 'komplet', style: `left:${Math.min(innerWidth - 100, Math.max(100, r.left + r.width / 2))}px;top:${r.top - 6}px` }, label);
      document.body.append(lab);
      setTimeout(() => { flash.remove(); ring.remove(); }, 900); setTimeout(() => lab.remove(), 1700);
    }
    setTimeout(() => el.classList.remove('burst'), 1200);
  }
  function ringSVG(frac, size, stroke, color) {
    const r = (size - stroke) / 2, c = 2 * Math.PI * r;
    return `<svg viewBox="0 0 ${size} ${size}" width="${size}" height="${size}"><circle cx="${size / 2}" cy="${size / 2}" r="${r}" fill="none" stroke="var(--line)" stroke-width="${stroke}"/><circle cx="${size / 2}" cy="${size / 2}" r="${r}" fill="none" stroke="${color}" stroke-width="${stroke}" stroke-linecap="round" stroke-dasharray="${c}" stroke-dashoffset="${c * (1 - Math.max(0, Math.min(1, frac)))}" style="transition:stroke-dashoffset .9s cubic-bezier(.2,.8,.2,1)"/></svg>`;
  }

  /* ---------------- odznaki ---------------- */
  const listDone = id => { const L = LISTS.find(x => x.id === id); if (!L) return false; const p = listProgress(L); return p.solved === p.total; };
  const ALLN = LISTS.reduce((a, L) => a + L.tasks.reduce((b, t) => b + t.items.length, 0), 0);
  const BADGES = [
    { id: 'first', name: 'Pierwszy krok', desc: 'Pierwsza poprawna odpowiedź', ok: () => S.correct >= 1 },
    { id: 's5', name: 'Rozgrzewka', desc: '10 rozwiązanych przykładów', ok: () => S.correct >= 10 },
    { id: 's10', name: 'W rytmie', desc: '50 rozwiązanych przykładów', ok: () => S.correct >= 50 },
    { id: 's25', name: 'Maszyna licząca', desc: '150 rozwiązanych przykładów', ok: () => S.correct >= 150 },
    { id: 'clean', name: 'Bez kół ratunkowych', desc: '10 podpunktów bez podpowiedzi', ok: () => S.clean >= 10 },
    { id: 'var', name: 'Trening czyni mistrza', desc: '10 poprawnych podobnych przykładów', ok: () => S.variants >= 10 },
    { id: 'p3', name: 'Opanowane', desc: 'Pełna seria 3 podobnych w 10 podpunktach', ok: () => Object.values(S.practice || {}).filter(x => x >= 3).length >= 10 },
    { id: 'proof', name: 'Dowodziciel', desc: '5 poprawnie ułożonych dowodów', ok: () => S.proofs >= 5 },
    { id: 'star3', name: 'Perfekcjonista', desc: 'Pierwsze zadanie ukończone w całości', ok: () => LISTS.some(L => L.tasks.some(t => taskProgress(t).done)) },
    { id: 'l1', name: 'Ciało ukończone', desc: 'Algebra: wszystkie zadania z Listy 1', ok: () => listDone('l1') },
    { id: 'l2', name: 'Zespolony umysł', desc: 'Algebra: wszystkie zadania z Listy 2', ok: () => listDone('l2') },
    { id: 'l3', name: 'Pan pierwiastków', desc: 'Algebra: wszystkie zadania z Listy 3', ok: () => listDone('l3') },
    { id: 'pl1', name: 'Mistrz przekształceń', desc: 'Proseminarium: wszystkie zadania z Listy 1', ok: () => listDone('p1') },
    { id: 'pl2', name: 'Wielomianowy wymiatacz', desc: 'Proseminarium: wszystkie zadania z Listy 2', ok: () => listDone('p2') },
    { id: 'pl3', name: 'Trygonometra', desc: 'Proseminarium: wszystkie zadania z Listy 3', ok: () => listDone('p3') },
    { id: 'el1', name: 'Podzielność opanowana', desc: 'ETL: wszystkie zadania z Listy 1', ok: () => listDone('e1') },
    { id: 'el2', name: 'Łowca liczb pierwszych', desc: 'ETL: wszystkie zadania z Listy 2', ok: () => listDone('e2') },
    { id: 'el3', name: 'Uczeń Euklidesa', desc: 'ETL: wszystkie zadania z Listy 3', ok: () => listDone('e3') },
    { id: 'el4', name: 'Rozkład na czynniki', desc: 'ETL: wszystkie zadania z Listy 4', ok: () => listDone('e4') },
    { id: 'xp1k', name: 'Tysiąc XP', desc: 'Zdobądź 1000 punktów doświadczenia', ok: () => S.xp >= 1000 },
    { id: 'days3', name: 'Trzy dni z rzędu', desc: 'Ucz się 3 dni pod rząd', ok: () => S.dayStreak >= 3 },
    { id: 'quick', name: 'Błyskawica', desc: '8 przykładów w jednej szybkiej rundzie', ok: () => S.quickBest >= 8 },
    // ukryte — po 100 XP
    { id: 'h_days5', hidden: true, name: 'Kto tak się uczy? 🙈', desc: 'Nauka 5 dni pod rząd', ok: () => S.dayStreak >= 5 },
    { id: 'h_all', hidden: true, name: 'All in', desc: 'Wszystkie ' + ALLN + ' podpunktów ze wszystkich przedmiotów zaliczone', ok: () => LISTS.every(L => { const p = listProgress(L); return p.solved === p.total; }) },
    { id: 'h_run', hidden: true, name: 'Snajper', desc: '25 poprawnych odpowiedzi z rzędu, bez ani jednej pomyłki', ok: () => (S.bestRun || 0) >= 25 },
    { id: 'h_day', hidden: true, name: 'Maraton', desc: '60 rozwiązanych przykładów jednego dnia', ok: () => Object.values(S.days || {}).some(d => (d.ok || 0) >= 60) },
    { id: 'h_clean', hidden: true, name: 'Czysta robota', desc: '100 podpunktów zaliczonych za pierwszym razem, bez Przykładu i Wzorów', ok: () => (S.clean || 0) >= 100 },
  ];
  const COOL = { el4: 64, el3: 64, el2: 64, el1: 64, pl3: 63, pl2: 63, pl1: 63, h_all: 100, h_clean: 96, h_run: 92, h_day: 88, h_days5: 84, l3: 62, l2: 61, l1: 60, xp1k: 55, s25: 50, star3: 46, p3: 44, proof: 40, quick: 38, days3: 36, s10: 30, clean: 28, var: 26, s5: 20, first: 10 };
  function badgeModal(b) {
    if (b.hidden) { confetti(150, innerWidth / 2, innerHeight / 3, 1.3); } else confetti(90, innerWidth / 2, innerHeight / 3, 1.1);
    SFX.star();
    const more = CQ.length;
    modal([h('div', { class: 'muted' }, b.hidden ? 'Ukryta odznaka!' : 'Nowa odznaka'), h('div', { class: 'bico' + (b.hidden ? ' gold' : ''), html: b.hidden ? IC.star : IC.trophy }), h('h2', {}, b.name), h('p', {}, b.desc + (b.hidden ? ' · +100 XP' : '')),
      h('div', { class: 'row' }, h('button', { class: 'btn primary', onclick: closeOverlays }, more ? 'Dalej (' + more + ')' : 'Dalej'))]);
    if (b.hidden) gainXP(100, document.querySelector('.modal h2'));
    { const bt = document.querySelector('.modal .btn.primary'); if (bt) bt.textContent = CQ.length ? 'Dalej (' + CQ.length + ')' : 'Dalej'; }
    save(); if (V.view === 'stats') render();
  }
  function checkBadges() {
    for (const b of BADGES) if (!S.badges[b.id] && b.ok()) { S.badges[b.id] = today(); celebrate(1000 + (COOL[b.id] || 0), () => badgeModal(b)); }
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
    if (after.L > before) celebrate(400, () => levelUp(levelInfo(S.xp)));
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
    setHash('t' + task.id.replace('.', '-')); S.subj = L.subject; S.subjList = Object.assign(S.subjList || {}, { [L.subject]: li });
    render();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  function resetAttempt() { if (T) T.gs = null; if (T && T.item && T.item._again && (T.item.type || 'fields') === 'fields') { delete T.item._mc; T.item._again = false; } // ponowne podejście: odpowiedzi ABCD w nowej kolejności (tak/nie zostaje „tak” → „nie”)
    if (T.mode === 'orig' && T._lastKey !== T.origKey) { T.tried = false; T._lastKey = T.origKey; } T.sel = []; T.mcStep = 0; T.mcRev = null; T.vals = []; T.choice = new Set(); T.order = []; T.pool = null; T.status = 'answering'; T.usedW = false; T.usedP = false; T.marks = null; T.msgs = []; T.focus = 0; }
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
    T.doneBefore = T.mode === 'quick' ? true : taskProgress(T.task).done; T.prevFrac = T.mode === 'quick' ? 0 : (p0 => p0.solved / p0.total)(taskProgress(T.task));
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
    } else if (type === 'guided') {
      ok = true;
      if (T.gs.misses && T.mode === 'orig' && !S.items[T.origKey]) { S.tried = S.tried || {}; S.tried[T.origKey] = true; }
    } else if (type === 'order') {
      if (!T.order.length) { toast('Ułóż dowód', 'Klikaj kroki w kolejności', 'flag'); return; }
      const n = it.order.steps.length;
      ok = T.order.length === n && T.order.every((k, i) => k === i);
    }
    T.status = ok ? 'correct' : 'wrong';
    if (type === 'fields') it._again = true;
    if (ok) bumpDay(true);
    const isOrig = T.mode === 'orig';
    // pula XP podpunktu (2–20) i zaliczanie części osobno
    const origIt = T.mode === 'quick' ? it : (T.task.items[T.idx] || it);
    const base = A.baseXP(T.task, origIt);
    const grps = type === 'fields' ? A.buildMC(it).groups : null, nG = grps ? grps.length : 1;
    const marks = grps ? grps.map((g, i) => !!(g.opts[T.sel[i]] && g.opts[T.sel[i]].ok)) : [ok];
    S.parts = S.parts || {}; S.tried = S.tried || {};
    const prevParts = (isOrig && nG > 1 && S.parts[T.origKey]) || [];
    const fresh = marks.map((m, i) => m && !prevParts[i]);
    const share = (cnt, triedBefore) => Math.max(1, Math.round(base * cnt / nG * (triedBefore ? 0.6 : 1)));
    T.partial = null;
    if (ok) {
      S.correct++; S.run = (S.run || 0) + 1; S.bestRun = Math.max(S.bestRun || 0, S.run);
      if (type === 'order' || type === 'guided') S.proofs++;
      // XP: oryginał za pierwszym razem — pełna pula (2–20), po pomyłce 60%; części liczone osobno.
      // Podobne: pierwsze 3 po 60% puli, każdy kolejny 1 XP.
      let xp;
      S.pc = S.pc || {};
      if (isOrig) {
        const prev = S.items[T.origKey];
        const first = !prev && !S.tried[T.origKey];
        if (!prev) S.items[T.origKey] = 'done';
        if (first && !T.usedW && !T.usedP) S.clean++;
        xp = prev ? 1 : share(fresh.filter(Boolean).length, !first);
        delete S.parts[T.origKey];
      } else {
        S.variants++;
        if (T.mode === 'var') {
          const k = S.pc[T.origKey] || 0;
          xp = k < 3 ? Math.max(1, Math.round(0.6 * base)) : 1;
          S.pc[T.origKey] = k + 1;
          S.practice = S.practice || {}; S.practice[T.origKey] = Math.min(3, k + 1);
          if (k + 1 === 3) setTimeout(() => { toast('Seria podobnych ukończona', 'Podpunkt ' + (T.task.items[T.idx].label || '') + ' opanowany', 'star'); SFX.star(); }, 900);
          if (!S.items[T.origKey]) { S.items[T.origKey] = 'done'; T.redeemed = true; if (S.parts) delete S.parts[T.origKey]; }
        } else { xp = Math.max(1, Math.round(0.6 * base)); T.quick.score++; }
      }
      gainXP(xp, $('#card .opt.picked') || $('#submitBtn') || $('#card'));
      SFX.correct();
      const r = $('#card') ? $('#card').getBoundingClientRect() : null;
      confetti(T.mode === 'quick' ? 30 : 55, r ? r.left + r.width / 2 : undefined, r ? r.top + 80 : undefined, 0.9);
    } else {
      // część odpowiedzi dobra: te części zostają zaliczone, przy kolejnym podejściu poprawia się tylko błędne
      if (isOrig && nG > 1 && !S.items[T.origKey]) {
        const nf = fresh.filter(Boolean).length;
        const merged = marks.map((m, i) => m || !!prevParts[i]);
        if (nf) { gainXP(share(nf, !!S.tried[T.origKey]), $('#card .mc') || $('#card')); S.parts[T.origKey] = merged; }
        T.partial = { done: merged.filter(Boolean).length, n: nG };
      } else if (!isOrig && nG > 1) {
        const nf = marks.filter(Boolean).length; // podobny przykład: XP za dobre części, ale seria się nie liczy
        if (nf && T.mode === 'var' && (S.pc[T.origKey] || 0) < 3) gainXP(Math.max(1, Math.round(0.6 * base * nf / nG)), $('#card .mc') || $('#card'));
      }
      if (isOrig) { T.tried = true; if (!S.items[T.origKey]) S.tried[T.origKey] = true; }
      S.run = 0;
      SFX.wrong();
    }
    const justDone = ok && T.mode !== 'quick' && !T.doneBefore && taskProgress(T.task).done;
    const bigTask = T.task.items.length > 1; // zadania z jednym podpunktem: bez okienka i bez przewijania
    if (justDone) { T.justDone = true; if (bigTask) cqHold = Date.now() + 1300; }
    checkBadges(); save();
    render();
    const fb = $('#feedback'), tpEl = $('.tprog');
    if (justDone && bigTask && tpEl) tpEl.scrollIntoView({ behavior: reduced() ? 'auto' : 'smooth', block: 'center' });
    else if (fb) fb.scrollIntoView({ behavior: reduced() ? 'auto' : 'smooth', block: 'nearest' });
    if (justDone && bigTask) { const p = taskProgress(T.task), tt = T; celebrate(500, () => taskDone(p, tt)); }
    else if (justDone) toast('Zadanie ' + tid(T.task) + ' zaliczone', '', 'star');
  }
  // następne zadanie z niezaliczonymi podpunktami w tej samej liście; gdy lista zrobiona — powrót do mapy
  function goNextTask(li, ti) {
    const L0 = LISTS[li];
    let hit = -1;
    for (let k = 1; k <= L0.tasks.length; k++) { const t2 = (ti + k) % L0.tasks.length, p = taskProgress(L0.tasks[t2]); if (p.solved < p.total) { hit = t2; break; } }
    if (hit < 0) { T = null; V = { view: 'list', list: li }; setHash(lhash(li)); render(); window.scrollTo({ top: 0, behavior: 'auto' }); return; }
    startTask(li, hit); SFX.whoosh();
    window.scrollTo({ top: 0, behavior: reduced() ? 'auto' : 'smooth' });
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
    if (next < 0) { goNextTask(T.li, T.ti); return; }
    T.idx = next; T.mode = 'orig'; T.item = task.items[next]; T.origKey = itemKey(task, next); T.redeemed = false; resetAttempt(); render(); SFX.whoosh();
    window.scrollTo({ top: 0, behavior: reduced() ? 'auto' : 'smooth' });
  }

  /* ---------------- modale ---------------- */
  // kolejka „świętowania”: odznaki (od najfajniejszej) → ukończone zadanie → nowy poziom
  const CQ = []; let cqBusy = false, cqTimer = null, cqSeq = 0, cqIn = false, cqHold = 0;
  function celebrate(prio, fn) { if (cqBusy && !cqIn && !document.querySelector('.modal')) cqBusy = false; if (prio === 400 && CQ.some(x => x.prio === 400)) return; CQ.push({ prio, fn, seq: cqSeq++ }); if (!cqBusy) { clearTimeout(cqTimer); cqTimer = setTimeout(cqNext, Math.max(750, cqHold - Date.now())); } }
  function cqNext() {
    if (!CQ.length) { cqBusy = false; return; }
    CQ.sort((a, b) => b.prio - a.prio || a.seq - b.seq);
    cqBusy = true; const it = CQ.shift();
    cqIn = true; try { it.fn(); } catch (e) { cqBusy = false; } cqIn = false;
    if (!document.querySelector('.modal')) setTimeout(cqNext, 300);
  }
  function closeOverlays() { const had = !!document.querySelector('.modal'); document.querySelectorAll('.scrim,.drawer,.modal').forEach(e => e.remove()); if (had && cqBusy) setTimeout(cqNext, 280); }
  function modal(content, onClose) {
    document.querySelectorAll('.scrim,.drawer,.modal').forEach(e => e.remove());
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
  function taskDone(p, tt) {
    tt = tt || T; if (!tt) return;
    const R = 58, Cc = 2 * Math.PI * R;
    const ring = h('div', { class: 'finring', html: `<svg viewBox="0 0 140 140"><defs><linearGradient id="fg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="var(--g3)"/><stop offset=".5" stop-color="var(--xp)"/><stop offset="1" stop-color="var(--g1)"/></linearGradient></defs><circle cx="70" cy="70" r="${R}" class="trk"/><circle cx="70" cy="70" r="${R}" class="arc" stroke-dasharray="${Cc}" stroke-dashoffset="${Cc}"/></svg><span class="rays"></span><span class="wave"></span><span class="wave w2"></span><b class="cnt">0</b><small>/ ${p.total}</small>` });
    const num = ring.querySelector('.cnt');
    if (reduced()) { ring.classList.add('boom'); num.textContent = p.total; ring.querySelector('.arc').style.strokeDashoffset = 0; }
    else {
      requestAnimationFrame(() => requestAnimationFrame(() => { ring.querySelector('.arc').style.strokeDashoffset = 0; }));
      const t0 = performance.now(), D = 700;
      const tick = now => { const k = Math.min(1, (now - t0) / D), e = 1 - Math.pow(1 - k, 3); num.textContent = Math.round(e * p.total); if (k < 1) requestAnimationFrame(tick); else { ring.classList.add('boom'); SFX.level(); confetti(220, innerWidth / 2, innerHeight / 2 - 60, 1.5, 'gold'); setTimeout(() => confetti(120, innerWidth / 2, innerHeight / 2 - 60, 1.1), 260); } };
      requestAnimationFrame(tick);
    }
    modal([h('div', { class: 'muted' }, 'Zadanie ' + tid(tt.task)), ring, h('h2', { class: 'fintitle' }, p.total === 1 ? 'Gotowe!' : 'Komplet!'),
      h('p', {}, (p.total === 1 ? 'Zadanie zaliczone' : 'Wszystkie ' + p.total + ' ' + (p.total % 10 >= 2 && p.total % 10 <= 4 && (p.total % 100 < 12 || p.total % 100 > 14) ? 'podpunkty zaliczone' : 'podpunktów zaliczonych')) + '. Podobne przykłady możesz dalej robić dla treningu i XP.'),
      h('div', { class: 'row' }, h('button', { class: 'btn primary', onclick: () => { closeOverlays(); goNextTask(tt.li, tt.ti); } }, 'Dalej', h('span', { html: IC.next })), h('button', { class: 'btn', onclick: () => { closeOverlays(); const li = tt.li; T = null; V = { view: 'list', list: li }; setHash(lhash(li)); render(); } }, 'Wróć do mapy'))]);
  }
  function quickDone() {
    const q = T.quick; S.quickBest = Math.max(S.quickBest || 0, q.score); checkBadges(); save();
    const li0 = T.li; celebrate(300, () => quickModal(q, li0));
  }
  function quickModal(q, li) {
    SFX.level(); confetti(80 + q.score * 8, innerWidth / 2, innerHeight / 3, 1.1);
    modal([h('div', { class: 'muted' }, 'Szybka runda — ' + (SUBJ.find(x => x.id === LISTS[li].subject) || SUBJ[0]).short + ', ' + LISTS[li].title), h('div', { class: 'big' }, String(q.score)), h('h2', {}, q.score === 1 ? 'rozwiązany przykład' : q.score >= 2 && q.score <= 4 ? 'rozwiązane przykłady' : 'rozwiązanych przykładów'),
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
    const orig = T.mode === 'quick' ? T.item : task.items[T.idx]; const gk = (orig && orig.gk) || T.item.gk;
    const list = A.wzoryFor(task, orig, gk, T.item);
    drawer('Wzory', IC.bulb, [
      h('p', { class: 'dnote' }, 'Wszystko, czego potrzeba do tego przykładu. Kliknij ', h('span', { class: 'qbtn mini' }, '?'), ', żeby zobaczyć, skąd bierze się wzór.'),
      ...list.map(w => {
        const d = h('div', { class: 'fwhy', hidden: true }, h('div', { class: 'glabel' }, 'Skąd to się bierze'), h('ol', {}, w.d.map(s => mdEl('li', s))));
        const b = h('button', { class: 'qbtn', 'aria-expanded': 'false', 'aria-label': 'Skąd ten wzór?', title: 'Skąd ten wzór?', onclick: () => {
          const open = d.hasAttribute('hidden'); if (open) d.removeAttribute('hidden'); else d.setAttribute('hidden', '');
          b.setAttribute('aria-expanded', String(open)); b.textContent = open ? '×' : '?'; SFX.key();
        } }, '?');
        return h('div', { class: 'formula' }, h('div', { class: 'frow' }, mdEl('div', w.f, { class: 'ftx' }), b), d);
      }),
    ]);
    renderActionsOnly();
  }
  function showPrzyklad() {
    if (!T.usedP && T.status === 'answering') { T.usedP = true; S.hints++; save(); }
    SFX.hint();
    const gk = T.item.gk || (T.mode === 'orig' ? T.task.items[T.idx].gk : undefined) || (T.task.items[0] && T.task.items[0].gk);
    let ex; for (let k = 0; k < 8; k++) { ex = T.task.gen(gk); if (ex.q !== T.item.q) break; }
    if (ex.methods) { const mi = Math.min((T.item && T.item._mi) || 0, ex.methods.length - 1); Object.assign(ex, ex.methods[mi]); }
    const type = ex.type || 'fields';
    const steps = type === 'guided' ? ex.steps.map(s => s.line) : (ex.steps || []).slice();
    const stepsBox = h('div', { style: 'display:grid;gap:8px' });
    let shown = 0;
    const answerEl = () => {
      if (type === 'order') return h('div', { class: 'exq' }, h('b', {}, 'Dowód w kolejności:'), h('ol', {}, ex.order.steps.map(s => mdEl('li', s))));
      if (type === 'guided') return h('div', { class: 'exq' }, 'Dowód zakończony. Zauważ, że plan jest ten sam — zmieniają się tylko liczby.');
      if (type === 'choice') return h('div', { class: 'exq' }, h('b', {}, 'Odpowiedź: '), ...ex.choice.correct.map(i => mdEl('div', ex.choice.opts[i])));
      if (ex.check) return mdEl('div', '<b>Odpowiedź:</b> ' + ex.showAns, { class: 'exq' });
      ex.gk = ex.gk || gk; const mc = A.buildMC(ex);
      return h('div', { class: 'exq' }, h('b', {}, 'Odpowiedź'), ...mc.groups.map(g => mdEl('div', (g.label ? A.mcLabel(g.label) + ': ' : '') + '$' + g.opts.find(o => o.ok).tex + '$')));
    };
    const btn = h('button', { class: 'btn primary', onclick: () => {
      if (shown < steps.length) { stepsBox.append(h('div', { class: 'exstep' }, h('span', { class: 'n' }, String(shown + 1)), mdEl('div', steps[shown]))); shown++; SFX.key(); }
      if (shown >= steps.length) { if (/^<b>Odpowied/.test(steps[steps.length - 1] || '')) btn.remove(); else btn.replaceWith(answerEl()); SFX.star(); }
      else btn.textContent = 'Następny krok (' + (shown + 1) + '/' + steps.length + ')';
    } }, 'Pokaż pierwszy krok');
    if (!steps.length) btn.textContent = 'Pokaż odpowiedź';
    drawer('Przykład', IC.book, [
      h('div', { class: 'exq' }, h('div', { class: 'glabel' }, 'Podobny przykład'), md(ex.q), type === 'choice' ? h('ul', { class: 'exopts' }, ex.choice.opts.map(o => mdEl('li', o))) : ''), ex.idea ? h('div', { class: 'gidea' }, h('div', { class: 'glabel' }, 'Pomysł'), mdEl('div', ex.idea)) : '', stepsBox, btn,
    ]);
    renderActionsOnly();
  }
  function helpBox() {
    return h('div', { class: 'help', html: 'Jak wpisywać: <code>2+3i</code>, <code>√3</code> lub <code>sqrt(3)</code>, <code>∛2</code>, <code>root(4, 2)</code>, <code>π</code> lub <code>pi</code>, potęga <code>^</code>, ułamek <code>/</code> lub <code>:</code>, ułamki dziesiętne z kropką lub przecinkiem (<code>0,75</code>). Mnożenie można pomijać: <code>2√3i</code>. Postać wykładnicza: <code>2e^(iπ/3)</code>, trygonometryczna: <code>2(cos(π/3)+i sin(π/3))</code>. Kąty w radianach lub stopniach (<code>15°</code>), liczone modulo 2π. Kilka rozwiązań oddziel <code>;</code> (albo przecinkiem); działa też <code>±(2-i)</code>. Gdy coś nie istnieje: <code>brak</code>, <code>nie istnieje</code> lub <code>-</code>. Każdy równoważny zapis jest akceptowany — ale tam, gdzie wymagana jest postać a+bi, nie przejdzie przepisany z treści iloczyn ani iloraz liczb zespolonych.' });
  }

  /* ---------------- Matura: zadania zamknięte z arkuszy CKE (formuła 2023) ---------------- */
  const MAT = () => A.MATURA || { dz: [], items: [] };
  const MWZ = () => A.MATURA_WZORY || [];
  // działy → rozdziały tablic CKE „Wybrane wzory matematyczne”
  const DZ_WZ = { I: [1, 2, 3], II: [6], III: [7], IV: [], V: [7], VI: [8], VII: [9, 17], VIII: [10], IX: [11], X: [12], XI: [4, 13], XII: [14, 15], XIII: [7] };
  const matState = id => (S.mat || {})[id];
  function matProgress(f) { const its = MAT().items.filter(f || (() => true)); return { done: its.filter(it => (matState(it.id) || {}).ok).length, total: its.length }; }
  function goMatura(dz, wz) { SFX.click(); T = null; V = { view: 'matura', dz: dz == null ? null : dz, wz: !!wz, list: V.list }; setHash(wz ? 'matura-wzory' : dz == null ? 'matura' : 'matura-' + (dz + 1)); render(); window.scrollTo({ top: 0, behavior: 'auto' }); }
  const mImg = (o, alt) => h('img', { src: 'matura/' + o.src, width: o.w, height: o.h, alt, loading: 'lazy', decoding: 'async' });
  function matZoom(title, imgs) {
    closeOverlays();
    const close = () => closeOverlays();
    document.body.append(h('div', { class: 'scrim', onclick: close }),
      h('div', { class: 'modal mview', role: 'dialog', 'aria-modal': 'true', 'aria-label': title },
        h('div', { class: 'mvhead' }, h('b', {}, title), h('button', { class: 'iconbtn', 'aria-label': 'Zamknij', html: IC.x, onclick: close })),
        h('div', { class: 'mvbody' }, ...imgs.map(([o, alt]) => mImg(o, alt)))));
  }
  function maturaView() {
    const M = MAT(), all = matProgress(), nS = new Set(M.items.map(it => it.id.split('-')[0])).size;
    const page = h('section', { class: 'matura' });
    page.append(h('div', { class: 'mhead' },
      h('div', { class: 'mtitle' }, h('span', { class: 'mico', html: IC.sheet }),
        h('div', {}, h('h1', {}, 'Matura'), h('p', {}, 'Matematyka · poziom podstawowy · formuła 2023. Zadania zamknięte z ' + nS + ' arkuszy CKE: maj, czerwiec i sierpień 2023–2026.'))),
      h('div', { class: 'mhr' },
        h('button', { class: 'iconbtn mdark', 'aria-label': S.matDark ? 'Jasny motyw' : 'Ciemny motyw', title: S.matDark ? 'Jasny motyw' : 'Ciemny motyw', html: S.matDark ? IC.sun : IC.moon, onclick: () => { S.matDark = !S.matDark; save(); render(); } }),
        h('div', { class: 'mstat', html: ringSVG(all.done / Math.max(1, all.total), 54, 5, 'var(--accent)') + `<span><b>${all.done}</b><small>/${all.total}</small></span>` }))));
    page.append(h('div', { class: 'mtabs', role: 'tablist' },
      h('button', { class: 'mtab' + (!V.wz ? ' on' : ''), role: 'tab', 'aria-selected': !V.wz ? 'true' : 'false', onclick: () => goMatura(null) }, 'Zadania zamknięte'),
      h('button', { class: 'mtab' + (V.wz ? ' on' : ''), role: 'tab', 'aria-selected': V.wz ? 'true' : 'false', onclick: () => goMatura(null, true) }, 'Tablice wzorów')));
    page.append(V.wz ? matWzory() : V.dz == null ? matDzialy() : matDzial(V.dz));
    return page;
  }
  function matDzialy() {
    const M = MAT(), g = h('div', { class: 'mgrid' });
    M.dz.forEach((d, i) => {
      const its = M.items.filter(it => it.dz === i); if (!its.length) return;
      const p = matProgress(it => it.dz === i);
      g.append(h('button', { class: 'mcard' + (p.done === p.total ? ' full' : ''), onclick: () => goMatura(i) },
        h('span', { class: 'mnum' }, String(i + 1)),
        h('span', { class: 'mbody' }, h('b', {}, d.name), h('small', {}, d.subs.filter((s, k) => its.some(it => it.sub === k)).join(' · ')),
          h('span', { class: 'mbar' }, h('i', { style: 'width:' + (100 * p.done / p.total).toFixed(1) + '%' })), h('span', { class: 'mcount' }, p.done + ' / ' + p.total + ' zadań'))));
    });
    return h('div', {}, h('p', { class: 'mlead' }, 'Działy idą w kolejności nauki — od liczb, przez funkcje i geometrię, do prawdopodobieństwa. W każdym dziale zadania są pogrupowane tematycznie i ułożone od podstawowych umiejętności.'), g);
  }
  function matDzial(i) {
    const M = MAT(), d = M.dz[i], its = M.items.filter(it => it.dz === i), p = matProgress(it => it.dz === i);
    const box = h('div', { class: 'mdz' });
    box.append(h('div', { class: 'mdzhead' },
      h('button', { class: 'iconbtn', 'aria-label': 'Wszystkie działy', html: IC.back, onclick: () => goMatura(null) }),
      h('div', { class: 'mdzt' }, h('small', {}, 'Dział ' + (i + 1) + ' z ' + M.dz.length), h('h2', {}, d.name)),
      h('span', { class: 'mcount' }, p.done + ' / ' + p.total)));
    const wz = (DZ_WZ[d.r] || []).map(n => MWZ().find(x => x.n === n)).filter(Boolean);
    if (wz.length) box.append(h('div', { class: 'mwzl' }, h('span', {}, 'Wzory z tablic:'), ...wz.map(w => h('button', { class: 'mchip', onclick: () => matZoom(w.n + '. ' + w.name, [[w.img, w.name]]) }, w.n + '. ' + w.name))));
    const subs = d.subs.map((s, k) => [s, its.filter(it => it.sub === k)]).filter(([, a]) => a.length);
    if (subs.length > 1) box.append(h('nav', { class: 'msubnav', 'aria-label': 'Tematy w dziale' }, ...subs.map(([s, a], k) => h('button', { class: 'mchip', onclick: () => { const el = document.getElementById('msub' + k); if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' }); } }, s, h('span', {}, String(a.filter(it => (matState(it.id) || {}).ok).length) + '/' + a.length)))));
    let n = 0;
    subs.forEach(([s, a], k) => { box.append(h('h3', { class: 'msub', id: 'msub' + k }, s)); a.forEach(it => box.append(matCard(it, ++n))); });
    const nx = M.dz.findIndex((x, j) => j > i && M.items.some(it => it.dz === j));
    box.append(h('div', { class: 'mfoot' }, h('button', { class: 'btn', onclick: () => goMatura(null) }, 'Wszystkie działy'), nx >= 0 ? h('button', { class: 'btn primary', onclick: () => goMatura(nx) }, 'Następny dział: ' + M.dz[nx].name, h('span', { html: IC.next })) : ''));
    return box;
  }
  // treść zadania przepisana na tekst (czytelna na telefonie); rysunki to wycinki z arkusza
  const srcKey = o => o.src.split('/').pop().replace(/\.webp$/, '');
  function matFig(o, c) {
    const [x0, y0, x1, y1] = c, cw = x1 - x0, ch = y1 - y0;
    const img = h('img', { src: 'matura/' + o.src, alt: 'Rysunek do zadania', loading: 'lazy', decoding: 'async', style: `position:absolute;width:${(100 * o.w / cw).toFixed(3)}%;left:${(-100 * x0 / cw).toFixed(3)}%;top:${(-100 * y0 / ch).toFixed(3)}%;max-width:none` });
    return h('div', { class: 'mtfig', style: `max-width:${cw}px` }, h('div', { class: 'mtfigi', style: `aspect-ratio:${cw}/${ch}` }, img));
  }
  function matTextBlocks(o) {
    const TX = A.MATURA_TXT || {}, bl = TX[srcKey(o)]; if (!bl) return null;
    const L = 'ABCDEFGH', out = [];
    for (const b of bl) {
      const k = Object.keys(b)[0], v = b[k];
      if (k === 't') out.push(mdEl('div', v, { class: 'mtp' + (/^\s*\$\$/.test(v) ? ' disp' : '') }));
      else if (k === 'fig') out.push(matFig(o, v));
      else if (k === 'opts' || k === 'multi') out.push(h('ol', { class: 'mtopts' }, ...v.map((x, i) => h('li', {}, h('b', {}, L[i] + '.'), mdEl('span', x)))));
      else if (k === 'pf') out.push(h('ol', { class: 'mtpf' }, ...v.map((x, i) => h('li', {}, h('b', {}, (i + 1) + '.'), mdEl('span', x), h('span', { class: 'mtpfpf' }, 'P / F')))));
      else if (k === 'table') out.push(h('div', { class: 'mttab' }, h('table', { class: 'mtab2' }, ...v.map((row, ri) => h('tr', {}, ...row.map((c, ci) => mdEl(ci === 0 && /[a-ząęółśżźćń]/i.test(String(c)) ? 'th' : 'td', String(c))))))));
      else if (k === 'why') out.push(h('div', { class: 'mtwhy' },
        v.lead ? mdEl('div', v.lead, { class: 'mtwl' }) : '',
        h('ol', { class: 'mtopts' }, ...(v.ab || []).map((x, i) => h('li', {}, h('b', {}, 'ABCD'[i] + '.'), mdEl('span', x)))),
        v.mid ? mdEl('div', v.mid, { class: 'mtwl' }) : '',
        h('ol', { class: 'mtopts' }, ...(v.n || []).map((x, i) => h('li', {}, h('b', {}, (i + 1) + '.'), mdEl('span', x))))));
    }
    return out;
  }
  function matText(it) {
    const parts = [];
    if (it.intro) { const a = matTextBlocks(it.intro); if (!a) return null; parts.push(h('div', { class: 'mtintro' }, ...a)); }
    const b = matTextBlocks(it.img); if (!b) return null;
    parts.push(...b);
    return h('div', { class: 'mtext' }, ...parts);
  }
  function matCard(it, n) {
    const st = matState(it.id);
    const card = h('article', { class: 'mtask' + (st ? (st.ok ? ' ok' : ' bad') : ''), id: 'm-' + it.id });
    const imgs = (it.intro ? [[it.intro, 'Wstęp do zadania ' + it.nr.split('.')[0]]] : []).concat([[it.img, 'Zadanie ' + it.nr + ' — matura ' + it.ses]]);
    card.append(h('div', { class: 'mmeta' }, h('span', { class: 'mn' }, String(n)), h('span', { class: 'mses' }, 'Matura ' + it.ses + ' · zad. ' + it.nr), h('span', { class: 'mpts' }, it.pts.split('-')[1] + ' pkt'),
      h('span', { class: 'mst' }, st ? (st.ok ? 'zrobione' : 'do powtórki') : '')),
      (txt => txt ? h('div', {}, txt, h('button', { class: 'mshow', onclick: () => matZoom('Matura ' + it.ses + ' · zadanie ' + it.nr, imgs) }, h('span', { html: IC.book }), 'Oryginał z arkusza CKE')) : h('button', { class: 'mpaper', 'aria-label': 'Powiększ zadanie', onclick: () => matZoom('Matura ' + it.ses + ' · zadanie ' + it.nr, imgs) }, ...imgs.map(([o, alt]) => mImg(o, alt))))(matText(it)),
      matAnswer(it, card), matTools(it));
    return card;
  }
  // wzory z tablic potrzebne do zadania + podobny przykład z generatora
  function matTools(it) {
    const SN = A.MATURA_SNIP || {}, G = A.MGEN, wz = (G ? G.wz(it.id) : []).filter(id => SN[id]);
    const box = h('div', { class: 'mtools' }), slot = h('div', {}), bar = h('div', { class: 'mtoolbar' });
    let open = null;
    const toggle = (k, make) => { slot.innerHTML = ''; open = open === k ? null : k; if (open) slot.append(make()); bar.querySelectorAll('.mtool, .mpd').forEach(b => b.classList.toggle('on', b.dataset.k === open)); };
    if (wz.length) bar.append(h('button', { class: 'mtool', 'data-k': 'wz', onclick: () => toggle('wz', () => h('div', { class: 'mwzbox' }, ...wz.map(id => matSnip(SN[id])))) }, h('span', { html: IC.book }), 'Wzory z tablic (' + wz.length + ')'));
    if (G && G.MAP[it.id]) {
      bar.append(h('button', { class: 'mtool', 'data-k': 'ex', onclick: () => toggle('ex', () => matExample(it)) }, h('span', { html: IC.book }), 'Podobny przykład'));
      const dots = () => { const n = Math.min(3, (S.matV || {})[it.id] || 0), go = () => { SFX.click(); toggle('var', () => matVariant(it, () => { const d = bar.querySelector('.pdots'); if (d) d.replaceWith(dots()); })); };
        return h('span', { class: 'pdots mpd' + (open === 'var' ? ' on' : ''), 'data-k': 'var' }, h('button', { class: 'plabel', onclick: go, title: 'Ćwicz na podobnych zadaniach' }, 'Podobne'),
          ...[0, 1, 2].map(i => h('button', { class: 'pdot' + (i < n ? ' on' : ''), onclick: go, title: (i < n ? 'Rozwiązane' : 'Spróbuj') + ' — podobne zadanie ' + (i + 1) + '/3', 'aria-label': 'Podobne zadanie ' + (i + 1) + ' z 3' + (i < n ? ', rozwiązane' : '') }, i < n ? h('span', { html: IC.check }) : String(i + 1)))); };
      bar.append(dots());
    }
    box.append(bar, slot);
    return bar.children.length ? box : '';
  }
  function matSnip(s) {
    const ex = h('div', { class: 'msnx', hidden: true }); ex.append(md(s.x));
    return h('div', { class: 'msnip' }, h('div', { class: 'msnh' }, h('b', {}, s.t),
      h('button', { class: 'mqbtn', 'aria-label': 'Wyjaśnij ten wzór', title: 'Wyjaśnij własnymi słowami', onclick: e => { ex.hidden = !ex.hidden; e.currentTarget.classList.toggle('on', !ex.hidden); } }, '?')),
      h('div', { class: 'mpaper' }, mImg(s.img, s.t)), ex);
  }
  // podobny przykład: tłumaczenie na innych liczbach — jak „Przykład” w części ze studiów (pomysł + kroki odsłaniane po kolei)
  function matExample(it) {
    const r = A.MGEN.gen(it.id), box = h('div', { class: 'mex' });
    if (!r) return h('p', { class: 'mq' }, 'Nie udało się wylosować przykładu — spróbuj jeszcze raz.');
    const all = (r.steps || []).slice(), ideaRaw = /^Pomysł:/.test(all[0] || '') ? all.shift().replace(/^Pomysł:\s*/, '').replace(/^./, ch => ch.toUpperCase()) : '';
    const ansRaw = all.length && /^Odpowiedź:/.test(all[all.length - 1]) ? all.pop() : null;
    const L = 'ABCDEF';
    const qBox = h('div', { class: 'exq' }, h('div', { class: 'glabel mexh' }, h('span', {}, 'Podobny przykład'), h('button', { class: 'btn small ghost', onclick: () => { SFX.click(); box.replaceWith(matExample(it)); } }, 'Inny przykład')), mdEl('div', r.q));
    const plotOpts = r.opts && r.opts.some(o => o.html);
    if (plotOpts) qBox.append(h('ul', { class: 'exopts' }, r.opts.map((o, k) => o.html ? h('li', {}, h('b', {}, L[k] + '. '), h('span', { class: 'mplotw', html: o.html })) : mdEl('li', '<b>' + L[k] + '.</b> $' + o.t + '$'))));
    else if (r.multi) qBox.append(h('ul', { class: 'exopts' }, r.multi.map((o, k) => mdEl('li', '<b>' + L[k] + '.</b> $' + o.t + '$'))));
    else if (r.pf) qBox.append(h('ul', { class: 'exopts' }, r.pf.map(([t], k) => mdEl('li', (k + 1) + '. ' + t + ' <b>P / F</b>'))));
    box.append(qBox);
    if (r.fig) box.append(h('div', { class: 'mplotw mfigw' , html: r.fig }));
    if (ideaRaw) box.append(h('div', { class: 'gidea' }, h('div', { class: 'glabel' }, 'Pomysł'), mdEl('div', ideaRaw)));
    const steps = all, stepsBox = h('div', { style: 'display:grid;gap:8px' }); let shown = 0;
    const answerEl = () => {
      if (r.pf) return mdEl('div', '<b>Odpowiedź:</b> ' + r.pf.map(([, ok], k) => (k + 1) + '. ' + (ok ? 'P' : 'F')).join(', '), { class: 'exq' });
      if (r.multi) return mdEl('div', '<b>Odpowiedź:</b> ' + r.multi.map((o, k) => o.ok ? L[k] : null).filter(Boolean).join(' oraz '), { class: 'exq' });
      const ok = (r.opts || []).findIndex(o => o.ok);
      return mdEl('div', '<b>Odpowiedź:</b> ' + (ok >= 0 ? (plotOpts || !r.opts[ok].t ? L[ok] + (r.opts[ok].t ? '. $' + r.opts[ok].t + '$' : '') : '$' + r.opts[ok].t + '$') : (ansRaw || '').replace(/^Odpowiedź:\s*/, '')), { class: 'exq' });
    };
    const btn = h('button', { class: 'btn primary', onclick: () => {
      if (shown < steps.length) { stepsBox.append(h('div', { class: 'exstep' }, h('span', { class: 'n' }, String(shown + 1)), mdEl('div', steps[shown]))); shown++; SFX.key(); }
      if (shown >= steps.length) { btn.replaceWith(answerEl()); SFX.star(); }
      else btn.textContent = 'Następny krok (' + (shown + 1) + '/' + steps.length + ')';
    } }, steps.length ? 'Pokaż pierwszy krok' : 'Pokaż odpowiedź');
    box.append(stepsBox, btn);
    return box;
  }
  function matVariant(it, onOk) {
    const r = A.MGEN.gen(it.id), box = h('div', { class: 'mvar' });
    if (!r) return h('p', { class: 'mq' }, 'Nie udało się wylosować przykładu — spróbuj jeszcze raz.');
    const again = () => box.replaceWith(matVariant(it, onOk));
    const steps = () => { const s = h('div', { class: 'mvsteps' }, h('small', {}, 'Rozwiązanie')); if (r.fig) s.append(h('div', { class: 'mplotw mfigw', html: r.fig })); (r.steps || []).forEach(x => s.append(mdEl('p', x))); return s; };
    const done = ok => { box.querySelectorAll('.mvopt, .mopt').forEach(b => { b.disabled = true; }); if (ok) { SFX.correct(); bumpDay(true); S.correct++; S.matV = S.matV || {}; const k = S.matV[it.id] || 0; S.matV[it.id] = k + 1; gainXP(k < 3 ? 5 : 1, box); if (onOk) setTimeout(onOk, 0); } else { SFX.wrong(); bumpDay(false); } save(); renderTop(); box.append(steps(), h('button', { class: 'btn small primary', onclick: again }, 'Kolejny przykład', h('span', { html: IC.dice }))); };
    box.append(h('div', { class: 'mvh' }, h('small', {}, 'Podobne zadanie · rozwiąż samodzielnie'), h('button', { class: 'btn small ghost', onclick: again }, 'Losuj')), mdEl('div', r.q, { class: 'mvq' }));
    if (r.opts) {
      const list = h('div', { class: 'mvopts' + (r.opts.some(o => o.html) ? ' pics' : '') });
      r.opts.forEach((o, i) => {
        const why = h('div', { class: 'mvwhy', hidden: true }); if (o.why) why.append(md(o.why));
        const b = h('button', { class: 'mvopt', onclick: () => { b.classList.add(o.ok ? 'good' : 'wrong'); if (!o.ok) { why.hidden = false; const g = list.children[r.opts.findIndex(x => x.ok)]; if (g) g.querySelector('.mvopt').classList.add('right'); } done(o.ok); } }, h('span', { class: 'letter' }, 'ABCD'[i]), o.html ? h('span', { class: 'txt', html: o.html }) : mdEl('span', '$' + o.t + '$', { class: 'txt' }));
        list.append(h('div', { class: 'mvo' }, b, why));
      });
      box.append(list);
    } else if (r.pf) {
      const ch = [];
      const rows = r.pf.map(([t], k) => { const rw = h('div', { class: 'mpfrow' }, mdEl('span', t, { class: 'mpft' }), ...['P', 'F'].map(v => h('button', { class: 'mopt', 'data-v': v, onclick: e => { ch[k] = v; rw.querySelectorAll('.mopt').forEach(x => x.classList.toggle('sel', x === e.currentTarget)); chk.disabled = ch.filter(Boolean).length < r.pf.length; } }, v))); return rw; });
      const chk = h('button', { class: 'btn primary small', disabled: true, onclick: () => { chk.remove(); let all = true; rows.forEach((rw, k) => { const want = r.pf[k][1] ? 'P' : 'F', ok = ch[k] === want; all = all && ok; rw.querySelector('.sel').classList.add(ok ? 'good' : 'wrong'); if (!ok) rw.querySelector(`.mopt[data-v="${want}"]`).classList.add('right'); }); done(all); } }, 'Sprawdź');
      box.append(...rows, chk);
    } else if (r.multi) {
      const set = new Set(), need = r.multi.filter(o => o.ok).length, list = h('div', { class: 'mvopts' });
      r.multi.forEach((o, i) => list.append(h('div', { class: 'mvo' }, h('button', { class: 'mvopt', onclick: () => { if (set.has(i)) set.delete(i); else if (set.size < need) set.add(i); list.querySelectorAll('.mvopt').forEach((x, j) => x.classList.toggle('sel', set.has(j))); chk.disabled = set.size !== need; } }, h('span', { class: 'letter' }, 'ABCDEF'[i]), mdEl('span', '$' + o.t + '$', { class: 'txt' })))));
      const chk = h('button', { class: 'btn primary small', disabled: true, onclick: () => { chk.remove(); let all = true; list.querySelectorAll('.mvopt').forEach((x, j) => { const o = r.multi[j]; if (set.has(j)) x.classList.add(o.ok ? 'good' : 'wrong'); else if (o.ok) x.classList.add('right'); if (set.has(j) !== o.ok) all = false; }); done(all); } }, 'Sprawdź');
      box.append(list, chk);
    }
    return box;
  }
  function matAnswer(it, card) {
    const box = h('div', { class: 'mans' });
    const rec = ok => {
      S.mat = S.mat || {}; const prev = S.mat[it.id];
      // czy zaczął od matury (bez żadnych zadań ze studiów) — tylko wtedy matura liczy się do paska w rankingu
      if (S.matFirst == null) S.matFirst = !Object.keys(S.items || {}).length && !Object.keys(S.tried || {}).length;
      S.mat[it.id] = { ok, d: today() };
      if (!prev) { bumpDay(ok); if (ok) { S.correct++; gainXP(8 * (+it.pts.split('-')[1] || 1), box); } }
      else if (ok && !prev.ok) gainXP(3 * (+it.pts.split('-')[1] || 1), box);
      if (ok) SFX.correct(); else SFX.wrong();
      save(); checkBadges(); renderTop();
      card.className = 'mtask ' + (ok ? 'ok' : 'bad');
      const ms = card.querySelector('.mst'); if (ms) ms.textContent = ok ? 'zrobione' : 'do powtórki';
    };
    const keyBox = (ok, again) => h('div', { class: 'mres ' + (ok == null ? '' : ok ? 'ok' : 'bad') },
      ok == null ? '' : h('b', { class: 'mverdict' }, ok ? 'Dobrze!' : 'Niestety nie.'),
      it.key ? h('div', { class: 'mkey' }, h('small', {}, 'Odpowiedź z klucza CKE (zasady oceniania)'), Object.assign(mImg(it.key, 'Klucz CKE do zadania ' + it.nr), { style: 'width:' + Math.min(100, it.key.w / it.img.w * 100).toFixed(1) + '%' })) : '',
      again ? h('button', { class: 'btn small ghost', onclick: () => box.replaceWith(matAnswer(it, card)) }, 'Spróbuj jeszcze raz') : '');
    const finish = (ok, mark) => { box.querySelectorAll('button.mopt').forEach(b => { b.disabled = true; }); if (mark) mark(); box.append(keyBox(ok, true)); rec(ok); };
    const row = (label, opts, cls, onpick) => h('div', { class: 'mrow' }, label ? h('span', { class: 'mlab' }, label) : '', ...opts.map(o => h('button', { class: 'mopt ' + (cls || ''), 'data-v': o, onclick: e => onpick(o, e.currentTarget) }, o)));
    const pickIn = (rw, btn) => { rw.querySelectorAll('.mopt').forEach(b => b.classList.toggle('sel', b === btn)); };
    if (it.type === 'abcd') {
      box.append(h('p', { class: 'mq' }, 'Twoja odpowiedź:'), row('', it.opts, 'big', (o, btn) => finish(o === it.ans, () => { btn.classList.add(o === it.ans ? 'good' : 'wrong'); if (o !== it.ans) { const g = box.querySelector(`.mopt[data-v="${it.ans}"]`); if (g) g.classList.add('right'); } })));
    } else if (it.type === 'pf') {
      const ch = [], rows = [...it.ans].map((_, k) => { const r = row((k + 1) + '.', ['P', 'F'], '', (o, btn) => { ch[k] = o; pickIn(r, btn); chk.disabled = ch.filter(Boolean).length < it.ans.length; }); return r; });
      const chk = h('button', { class: 'btn primary small', disabled: true, onclick: () => { chk.remove(); const ok = [...it.ans].every((a, k) => ch[k] === a); finish(ok, () => rows.forEach((r, k) => { const b = r.querySelector('.sel'); if (b) b.classList.add(ch[k] === it.ans[k] ? 'good' : 'wrong'); if (ch[k] !== it.ans[k]) { const g = r.querySelector(`.mopt[data-v="${it.ans[k]}"]`); if (g) g.classList.add('right'); } })); } }, 'Sprawdź');
      box.append(h('p', { class: 'mq' }, 'Oceń każde stwierdzenie: P — prawda, F — fałsz.'), ...rows, chk);
    } else if (it.type === 'why' || (it.type === 'seq' && it.ordered)) {
      const two = it.type === 'why' ? [['Odpowiedź', it.opts], ['Uzasadnienie', it.why || ['1', '2', '3']]] : [['Pierwsza luka', it.opts], ['Druga luka', it.opts]];
      const ch = [], rows = two.map(([lab, os], k) => { const r = row(lab, os, '', (o, btn) => { ch[k] = o; pickIn(r, btn); chk.disabled = !(ch[0] && ch[1]); }); return r; });
      const chk = h('button', { class: 'btn primary small', disabled: true, onclick: () => { chk.remove(); const ok = ch[0] === it.ans[0] && ch[1] === it.ans[1]; finish(ok, () => rows.forEach((r, k) => { const b = r.querySelector('.sel'); if (b) b.classList.add(ch[k] === it.ans[k] ? 'good' : 'wrong'); if (ch[k] !== it.ans[k]) { const g = r.querySelector(`.mopt[data-v="${it.ans[k]}"]`); if (g) g.classList.add('right'); } })); } }, 'Sprawdź');
      box.append(h('p', { class: 'mq' }, it.type === 'why' ? 'Wybierz odpowiedź i jej uzasadnienie.' : 'Wybierz literę do każdej luki.'), ...rows, chk);
    } else if (it.type === 'seq') {
      const set = new Set();
      const r = row('', it.opts, '', (o, btn) => { if (set.has(o)) set.delete(o); else if (set.size < it.ans.length) set.add(o); r.querySelectorAll('.mopt').forEach(b => b.classList.toggle('sel', set.has(b.dataset.v))); chk.disabled = set.size !== it.ans.length; });
      const chk = h('button', { class: 'btn primary small', disabled: true, onclick: () => { chk.remove(); const ok = [...it.ans].every(a => set.has(a)); finish(ok, () => r.querySelectorAll('.mopt').forEach(b => { const v = b.dataset.v; if (set.has(v)) b.classList.add(it.ans.includes(v) ? 'good' : 'wrong'); else if (it.ans.includes(v)) b.classList.add('right'); })); } }, 'Sprawdź');
      box.append(h('p', { class: 'mq' }, 'Wybierz ' + (it.ans.length === 2 ? 'dwie odpowiedzi' : it.ans.length + ' odpowiedzi') + '.'), r, chk);
    } else {
      const show = h('button', { class: 'btn small', onclick: () => {
        show.remove();
        const self = h('div', { class: 'mself' }, h('span', {}, 'Porównaj ze swoją odpowiedzią:'),
          h('button', { class: 'btn small primary', onclick: () => { self.remove(); rec(true); } }, 'Miałem dobrze'),
          h('button', { class: 'btn small', onclick: () => { self.remove(); rec(false); } }, 'Miałem źle'));
        box.append(keyBox(null, false), self);
      } }, 'Pokaż odpowiedź z klucza CKE');
      box.append(h('p', { class: 'mq' }, 'To zadanie z luką do uzupełnienia — rozwiąż je na kartce, a potem porównaj z kluczem.'), show);
    }
    return box;
  }
  function matWzory() {
    const W = MWZ();
    return h('div', { class: 'mwz' },
      h('p', { class: 'mlead' }, 'Oficjalne tablice CKE „Wybrane wzory matematyczne na egzamin maturalny z matematyki” — te same, które dostaniesz na egzaminie.'),
      h('nav', { class: 'msubnav' }, ...W.map(w => h('button', { class: 'mchip', onclick: () => { const el = document.getElementById('wz' + w.n); if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' }); } }, w.n + '. ' + w.name))),
      ...W.map(w => h('div', { class: 'mpaper wz', id: 'wz' + w.n }, mImg(w.img, w.n + '. ' + w.name))));
  }

  /* ---------------- routing ---------------- */
  function setHash(x) { S.last = x; save(); try { if (location.hash !== '#' + x) history.pushState(null, '', '#' + x); } catch (e) { /* ignoruj */ } }
  function fromHash() {
    const hs = (location.hash || '').slice(1);
    { const li = LISTS.findIndex(L => L.id === hs); if (li >= 0) { V = { view: 'list', list: li }; return; } }
    if (hs === 'home' || hs === '') { V = { view: 'home', list: V.list }; return; }
    { const sb = SUBJ.find(x => x.id === hs); if (sb) { V = { view: 'list', list: lastListOf(sb.id) }; return; } }
    if (hs === 'stats') { V = { view: 'stats', list: V.list }; return; }
    if (hs === 'matura-stats') { V = { view: 'stats', mat: true, list: V.list }; return; }
    if (hs === 'matura-ranking') { V = { view: 'rank', mat: true, list: V.list }; return; }
    if (hs === 'matura' || hs === 'matura-wzory') { V = { view: 'matura', dz: null, wz: hs === 'matura-wzory', list: V.list }; return; }
    { const mm = hs.match(/^matura-(\d+)$/); if (mm && MAT().dz[+mm[1] - 1]) { V = { view: 'matura', dz: +mm[1] - 1, wz: false, list: V.list }; return; } }
    if (hs === 'ranking') { V = { view: 'rank', list: V.list }; return; }
    const m = hs.match(/^t([PE]?\d+)-(\d+)$/);
    if (m) { const id = m[1] + '.' + m[2]; for (let li = 0; li < LISTS.length; li++) { const task = LISTS[li].tasks.findIndex(t => t.id === id); if (task >= 0) { startTask(li, task); return 'started'; } } }
    V = { view: 'home', list: 0 };
  }

  /* ---------------- renderowanie ---------------- */
  const app = () => $('#app');
  let lastPage = '', lastSub = null;
  const navSubj = () => (V.view === 'list' || V.view === 'task' ? subjOf(V.list) : V.view === 'subj' ? V.subj : null);
  function render() {
    const root = app(); root.innerHTML = '';
    const hue = ['stats', 'rank', 'home', 'subj', 'matura'].includes(V.view) ? 'st' : LISTS[V.list].hue;
    document.body.className = 'h-' + hue + (inMat() ? ' s-mat' + (S.matDark ? ' mat-dark' : '') : navSubj() && navSubj() !== 'alg' ? ' s-' + navSubj() : '');
    const pageKey = V.view + ':' + (V.view === 'subj' ? V.subj : V.view === 'list' ? V.list : V.view === 'task' && T ? T.ti : '');
    const page = V.view === 'home' ? homeView() : V.view === 'subj' ? subjView(V.subj) : V.view === 'list' ? listView() : V.view === 'stats' ? statsView() : V.view === 'rank' ? rankView() : V.view === 'matura' ? maturaView() : taskView();
    if (pageKey !== lastPage) page.classList.add('pagein');
    lastPage = pageKey;
    root.append(topBar(), h('div', { class: 'wrap' }, inMat() ? matNav() : navBar(), page));
    if (V.view === 'list') requestAnimationFrame(drawTrail);
    if (V.view === 'task') requestAnimationFrame(() => { if (T && T.status === 'answering') focusField(T.focus || 0, true); });
  }
  // szerokie wzory wyświetlane (treść, pytania, wzory) zmniejszamy, by mieściły się w szerokości ekranu
  function fitMath() {
    document.querySelectorAll('mjx-container[display="true"], .opt .txt mjx-container, .gq mjx-container, .question mjx-container, .stx mjx-container, .exq mjx-container, .ftx mjx-container, .solsteps mjx-container, .exstep mjx-container, .gl mjx-container, .fwhy mjx-container, .exl mjx-container, .gwhy mjx-container, .mvopt .txt mjx-container, .mvsteps mjx-container, .mvq mjx-container, .mvwhy mjx-container, .mpft mjx-container, .mtext mjx-container').forEach(c => {
      const svg = c.querySelector('svg'); if (!svg || !c.parentElement) return;
      c.style.fontSize = '';
      let box = c.getAttribute('display') === 'true' ? c.parentElement : (c.closest('.txt, .gq, .question, .stx, .exq, .ftx, .solsteps li, .exstep > div, .gl, .fwhy li, .exl, .gwhy, .mvsteps p, .mvq, .mvwhy, .mpft, .mtp, .mtopts li > span, .mtpf li > span') || c.parentElement);
      while (box && box.parentElement && getComputedStyle(box).display.startsWith('inline')) box = box.parentElement;
      const cs = getComputedStyle(box), avail = box.clientWidth - parseFloat(cs.paddingLeft || 0) - parseFloat(cs.paddingRight || 0), nat = svg.getBoundingClientRect().width;
      if (avail > 0 && nat > avail) c.style.fontSize = (Math.max(0.5, (avail / nat) * 0.97) * 100).toFixed(1) + '%';
    });
  }
  let fitQ = 0;
  const queueFit = () => { if (fitQ) return; fitQ = requestAnimationFrame(() => { fitQ = 0; fitMath(); }); };
  try { new MutationObserver(queueFit).observe(document.body, { childList: true, subtree: true }); } catch (e) { /* ignoruj */ }
  addEventListener('resize', queueFit);
  function renderTop() { const old = $('.top'); if (old) old.replaceWith(topBar()); }
  function renderActionsOnly() { const a = $('#actions'); if (a) a.replaceWith(actionsBar()); }

  function topBar() {
    const lv = levelInfo(S.xp);
    const top = h('header', { class: 'top' }, h('div', { class: 'wrap' },
      h('button', { class: 'logo', 'aria-label': 'Matematyka — strona główna', onclick: () => goHome() }, h('span', { html: logoSVG }), h('b', {}, 'Matematyka')),
      h('button', { class: 'matbtn' + (inMat() ? ' on' : ''), 'aria-label': 'Matura — zadania z arkuszy CKE', onclick: () => goMatura(null) }, h('span', { html: IC.sheet }), h('b', {}, 'Matura')),
      h('div', { class: 'spacer' }),
      h('div', { class: 'player' },
        h('div', { class: 'lvl', title: 'Poziom ' + lv.L, html: ringSVG(lv.into / lv.need, 42, 4, 'var(--xp)') + `<span style="position:relative">${lv.L}</span>` }),
        h('div', { class: 'xpbox' }, h('div', { class: 't' }, h('b', {}, lv.title), h('span', {}, xpText(lv))), h('div', { class: 'bar' }, h('i', { style: `width:${(100 * lv.into / lv.need).toFixed(1)}%` })))),
      h('span', { class: 'chip solved', title: 'Dobrze rozwiązane przykłady łącznie (dzisiaj: ' + ((S.days[today()] || {}).ok || 0) + ')', 'aria-label': 'Dobrze rozwiązane przykłady łącznie: ' + (S.correct || 0), html: IC.solved + '<span>' + (S.correct || 0) + '</span>' }),
      h('button', { class: 'iconbtn', 'aria-label': S.sound ? 'Wycisz dźwięki' : 'Włącz dźwięki', title: S.sound ? 'Dźwięk włączony' : 'Dźwięk wyłączony', html: S.sound ? IC.sound : IC.mute, onclick: () => { S.sound = !S.sound; save(); renderTop(); if (S.sound) SFX.correct(); } })));
    return top;
  }
  function goHome() { SFX.click(); T = null; V = { view: 'home', list: V.list }; setHash('home'); render(); window.scrollTo({ top: 0, behavior: 'auto' }); }
  const lastListOf = sid => { const m = S.subjList && S.subjList[sid]; return m != null && subjOf(m) === sid ? m : subjLists(sid)[0]; };
  function goSubject(sid) { SFX.click(); T = null; S.subj = sid; const li = lastListOf(sid); V = { view: 'list', list: li }; save(); setHash(lhash(li)); render(); window.scrollTo({ top: 0, behavior: 'auto' }); }
  function goList(i) { SFX.click(); T = null; V = { view: 'list', list: i }; S.tab = lhash(i); S.subj = LISTS[i].subject; S.subjList = Object.assign(S.subjList || {}, { [LISTS[i].subject]: i }); save(); setHash(lhash(i)); render(); window.scrollTo({ top: 0, behavior: 'auto' }); }
  // tryb matury: widok matury albo statystyki/ranking otwarte z zakładek matury
  const inMat = () => V.view === 'matura' || ((V.view === 'stats' || V.view === 'rank') && !!V.mat);
  function matNav() {
    const all = matProgress(), go = (v, hs) => { SFX.click(); T = null; V = { view: v, mat: true, list: V.list }; setHash(hs); render(); window.scrollTo({ top: 0, behavior: 'auto' }); };
    const nav = h('nav', { class: 'tabs main mnav', role: 'tablist', 'aria-label': 'Matura' });
    nav.append(h('button', { class: 'tab h-st', role: 'tab', 'aria-selected': V.view === 'matura' ? 'true' : 'false', onclick: () => { if (V.view === 'matura' && V.dz == null && !V.wz) return; goMatura(null); } },
      h('span', { class: 'ring', html: ringSVG(all.done / Math.max(1, all.total), 30, 4, 'var(--accent)') }),
      h('span', { class: 'lbl' }, h('b', {}, 'Matura'), h('small', {}, all.done + '/' + all.total + ' zadań'))));
    nav.append(h('button', { class: 'tab h-st', role: 'tab', 'aria-selected': V.view === 'stats' ? 'true' : 'false', onclick: () => go('stats', 'matura-stats') },
      h('span', { class: 'ring', html: IC.chart, style: 'color:var(--accent);display:grid;place-items:center' }), h('span', { class: 'lbl' }, h('b', {}, h('span', { class: 'full' }, 'Statystyki'), h('span', { class: 'short' }, 'Postęp')), h('small', {}, 'postępy i odznaki'))));
    nav.append(h('button', { class: 'tab h-st', role: 'tab', 'aria-selected': V.view === 'rank' ? 'true' : 'false', onclick: () => go('rank', 'matura-ranking') },
      h('span', { class: 'ring', html: IC.trophy, style: 'color:var(--accent);display:grid;place-items:center' }), h('span', { class: 'lbl' }, h('b', {}, 'Ranking'), h('small', {}, 'ze znajomymi'))));
    return h('div', { class: 'navbox' }, nav);
  }
  function navBar() {
    const cs = navSubj();
    const main = h('nav', { class: 'tabs main', role: 'tablist', 'aria-label': 'Przedmioty' });
    SUBJ.forEach(sb => {
      const p = subjProgress(sb.id), sel = cs === sb.id;
      main.append(h('button', { class: 'tab subjtab', 'data-s': sb.id, style: '--hue:' + sb.color, role: 'tab', 'aria-selected': sel ? 'true' : 'false', onclick: () => { if (V.view === 'list' && subjOf(V.list) === sb.id) return; goSubject(sb.id); } },
        h('span', { class: 'ring', html: ringSVG(p.solved / Math.max(1, p.total), 30, 4, sb.color) }),
        h('span', { class: 'lbl' }, h('b', {}, h('span', { class: 'full' }, sb.nav || sb.name), h('span', { class: 'short' }, sb.short)), h('small', {}, p.solved + '/' + p.total + ' podpunktów'))));
    });
    main.append(h('button', { class: 'tab h-st', role: 'tab', 'aria-selected': V.view === 'stats' ? 'true' : 'false', onclick: () => { SFX.click(); T = null; V = { view: 'stats', list: V.list }; S.tab = 'stats'; save(); setHash('stats'); render(); window.scrollTo({ top: 0, behavior: 'auto' }); } },
      h('span', { class: 'ring', html: IC.chart, style: 'color:var(--xp);display:grid;place-items:center' }), h('span', { class: 'lbl' }, h('b', {}, h('span', { class: 'full' }, 'Statystyki'), h('span', { class: 'short' }, 'Postęp')), h('small', {}, 'postępy i odznaki'))));
    main.append(h('button', { class: 'tab h-st', role: 'tab', 'aria-selected': V.view === 'rank' ? 'true' : 'false', onclick: () => { SFX.click(); T = null; V = { view: 'rank', list: V.list }; setHash('ranking'); render(); window.scrollTo({ top: 0, behavior: 'auto' }); } },
      h('span', { class: 'ring', html: IC.trophy, style: 'color:var(--xp);display:grid;place-items:center' }), h('span', { class: 'lbl' }, h('b', {}, 'Ranking'), h('small', {}, 'ze znajomymi'))));
    const box = h('div', { class: 'navbox' }, main);
    if (cs) {
      const sub = h('nav', { class: 'tabs sub' + (lastSub !== cs ? ' enter' : ''), role: 'tablist', 'aria-label': 'Listy przedmiotu' });
      subjLists(cs).forEach((i, k) => {
        const L = LISTS[i], p = listProgress(L), sel = (V.view === 'list' || V.view === 'task') && V.list === i;
        sub.append(h('button', { class: 'tab lt h-' + L.hue, style: `--k:${k}`, role: 'tab', 'aria-selected': sel ? 'true' : 'false', onclick: () => { if (V.view === 'list' && V.list === i) return; goList(i); } },
          h('span', { class: 'ring', html: ringSVG(p.solved / p.total, 26, 3.5, 'var(--hue)') }),
          h('span', { class: 'lbl' }, h('b', {}, h('span', { class: 'full' }, L.title), h('span', { class: 'short' }, subjLists(cs).length >= 4 ? L.title.replace(/^Lista\s*/, 'L') : L.title)), h('small', {}, L.name))));
      });
      box.append(sub);
    }
    lastSub = cs;
    return box;
  }
  // karta listy (strona główna i strona przedmiotu)
  function listCard(i, k) {
    const L = LISTS[i], p = listProgress(L);
    return h('button', { class: 'lcard h-' + L.hue, style: `--k:${k}`, onclick: () => goList(i) },
      h('span', { class: 'ring', html: ringSVG(p.solved / p.total, 52, 5, 'var(--hue)') + `<b>${Math.round(100 * p.solved / p.total)}%</b>` }),
      h('span', { class: 'lmeta' }, h('small', {}, L.title), mdEl('b', L.name), h('span', {}, `${p.solved}/${p.total} podpunktów · zadania ${p.done}/${p.tasks}`)),
      h('span', { class: 'chev', html: IC.next }));
  }
  function subjSection(sb, k0) {
    const p = subjProgress(sb.id);
    return h('div', { class: 'ssec', style: '--hue:' + sb.color },
      h('button', { class: 'shead2', onclick: () => goSubject(sb.id) }, h('b', {}, sb.name), h('span', {}, p.solved + '/' + p.total + ' · ', h('em', {}, Math.round(100 * p.solved / Math.max(1, p.total)) + '%')), h('span', { class: 'chev', html: IC.next })),
      h('div', { class: 'lcards' }, subjLists(sb.id).map((i, k) => listCard(i, k0 + k))));
  }
  function homeView() {
    const sec = h('section', { class: 'h-st home' });
    const sm = summary();
    sec.append(h('div', { class: 'hero' }, h('div', {}, h('h1', {}, 'Matematyka'), h('p', {}, 'Wybierz przedmiot i listę. Postęp: ' + sm.solved + '/' + sm.total + ' podpunktów.'))));
    let k = 0; SUBJ.forEach(sb => { sec.append(subjSection(sb, k)); k += subjLists(sb.id).length; });
    return sec;
  }
  function subjView(sid) {
    const sb = SUBJ.find(x => x.id === sid) || SUBJ[0];
    const sec = h('section', { class: 'h-st home' });
    sec.append(h('div', { class: 'hero' }, h('div', {}, h('div', { class: 'crumb' }, h('button', { class: 'iconbtn', 'aria-label': 'Strona główna', html: IC.back, onclick: () => goHome() }), h('span', {}, 'Matematyka')), h('h1', {}, h('span', { style: 'color:' + sb.color }, sb.name)), h('p', {}, 'Wybierz listę zadań.'))));
    sec.append(h('div', { class: 'lcards big' }, subjLists(sid).map((i, k) => listCard(i, k))));
    return sec;
  }

  function listView() {
    const L = LISTS[V.list]; const p = listProgress(L);
    const wrap = h('section', { class: 'h-' + L.hue });
    const hero = h('div', { class: 'hero' },
      h('div', {}, h('div', { class: 'crumb' }, h('button', { class: 'iconbtn', 'aria-label': 'Wszystkie przedmioty', html: IC.back, onclick: () => goHome() }), h('button', { class: 'eyebrow link', onclick: () => goHome() }, (SUBJ.find(x => x.id === L.subject) || SUBJ[0]).name)), h('h1', {}, L.title + ' · ', h('span', {}, L.name)), mdEl('p', L.blurb)),
      h('div', { class: 'acts' },
        h('button', { class: 'btn primary', onclick: () => { const ti = L.tasks.findIndex(t => taskProgress(t).solved < t.items.length); startTask(V.list, ti < 0 ? 0 : ti); } }, h('span', { html: IC.next }), p.solved ? 'Kontynuuj' : 'Zacznij'),
        h('button', { class: 'btn', onclick: () => startQuick(V.list), title: '10 losowych przykładów' }, h('span', { html: IC.bolt }), 'Szybka runda')));
    const lb = h('div', { class: 'listbar' }, h('span', {}, `${p.solved}/${p.total} podpunktów`), h('div', { class: 'bar' }, h('i', { style: 'width:0' })), h('span', {}, `ukończone zadania: ${p.done}/${p.tasks}`));
    requestAnimationFrame(() => { const i = lb.querySelector('.bar i'); if (i) i.style.width = (100 * p.solved / p.total) + '%'; });
    const path = h('div', { class: 'path', id: 'path' }, h('svg', { class: 'trail', id: 'trail', 'aria-hidden': 'true' }));
    const pos = ['left', 'mid', 'right', 'mid'];
    L.tasks.forEach((t, i) => {
      const tp = taskProgress(t);
      const node = h('button', { class: 'node ' + pos[i % 4] + (tp.solved === tp.total ? ' done' : ''), style: `animation-delay:${i * 45}ms`, onclick: () => { SFX.click(); startTask(V.list, i); } },
        h('span', { class: 'disc', html: ringSVG(tp.solved / tp.total, 64, 6, 'var(--hue)') + `<b>${tid(t)}</b>` }),
        h('span', { class: 'meta' }, mdEl('h3', t.name), h('small', {}, `${tp.solved}/${tp.total} podpunktów` + (t.proof ? ' · dowód' : '')), pbarEl(tp.solved, tp.total, { cls: 'mini' })));
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
      h('button', { class: 'iconbtn', 'aria-label': 'Wróć do mapy', html: IC.back, onclick: () => { SFX.click(); const li = T.li; T = null; V = { view: 'list', list: li }; setHash(lhash(li)); render(); } }),
      quick ? h('h2', {}, 'Szybka runda · ', h('span', {}, L.title)) : mdEl('h2', `<span>${tid(task)}</span> ` + task.name),
      h('div', { class: 'spacer' }),
      quick ? h('span', { class: 'chip' }, h('span', { html: IC.bolt }), String(T.quick.score)) : (() => {
        const tp = taskProgress(task), f = tp.solved / tp.total, burst = !!T.justDone; T.justDone = false;
        const from = T.prevFrac != null && T.prevFrac !== f ? T.prevFrac : null; T.prevFrac = f;
        return h('div', { class: 'tprog' + (tp.done ? ' isdone' : '') }, pbarEl(tp.solved, tp.total, { from, burst }), h('span', { class: 'tcount' }, tp.solved + '/' + tp.total));
      })());
    sec.append(head);
    if (quick) {
      const q = T.quick; const bar = h('div', { class: 'quickbar' }, h('span', { class: 'muted' }, (q.i + 1) + '/10'), h('div', { class: 'bar' }, h('i', { style: `width:${100 * q.i / 10}%` })));
      sec.append(bar);
    } else {

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
    sec.append(h('div', { class: 'statement' }, h('div', { class: 'slabel' }, 'Zadanie ' + tid(task) + ' · treść z listy'), mdEl('div', task.statement, { class: 'stx' })));
    // karta
    const card = h('article', { class: 'card', id: 'card' });
    const kick = h('div', { class: 'kicker' });
    if (quick) kick.append(h('span', { class: 'badge q' }, 'Zad. ' + tid(task)), mdEl('span', task.name));
    else if (T.mode === 'var') kick.append(h('span', { class: 'badge var' }, 'Podobny przykład'), md('do ' + (task.items[T.idx].label || tid(task))), pdots());
    else { const showLab = it.label && String(it.label).replace(/[()$]/g, '') !== tid(task); kick.append(h('span', { class: 'badge' }, tid(task) + (showLab ? ' · ' : '')), showLab ? md(it.label) : '', S.items[T.origKey] ? h('span', { class: 'badge', style: 'background:var(--ok-bg);color:var(--ok)' }, 'zaliczone') : '', !['order', 'guided'].includes(it.type || 'fields') && hasVar() ? pdots() : ''); }
    card.append(kick); if (it.q !== task.statement) card.append(mdEl('div', it.q, { class: 'question' }));
    const type = it.type || 'fields';
    if (type === 'fields') card.append(mcUI(it));
    else if (type === 'choice') card.append(choiceUI(it));
    else if (type === 'guided') card.append(guidedUI(it));
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
  // czy dla tego podpunktu generator daje coś innego niż oryginał (inaczej nie pokazujemy „Podobne” ani „Przykład”)
  const varCache = {};
  function hasVar() {
    const task = T && T.task; if (!task || !task.gen) return false;
    const orig = task.items[T.idx] || T.item, gk = orig && orig.gk, key = task.id + '|' + gk;
    if (key in varCache) return varCache[key];
    const sig = it => JSON.stringify([it.q, it.mcCorrect, it.choice && it.choice.opts]);
    let ok = false; try { for (let k = 0; k < 6 && !ok; k++) { const g = task.gen(gk); if (g && sig(g) !== sig(orig)) ok = true; } } catch (e) { ok = false; }
    return (varCache[key] = ok);
  }
  function pdots() {
    const n = practiceN();
    const go = () => { SFX.click(); startVariant(); };
    return h('span', { class: 'pdots' }, h('button', { class: 'plabel', onclick: go, title: 'Spróbuj podobnego przykładu' }, 'Podobne'),
      ...[0, 1, 2].map(i => h('button', { class: 'pdot' + (i < n ? ' on' : ''), onclick: go, title: (i < n ? 'Rozwiązany' : 'Spróbuj') + ' — podobny przykład ' + (i + 1) + '/3', 'aria-label': 'Podobny przykład ' + (i + 1) + ' z 3' + (i < n ? ', rozwiązany' : '') }, i < n ? h('span', { html: IC.check }) : String(i + 1))));
  }
  // dzieli zapis odpowiedzi na części tylko na najwyższym poziomie (nie wewnątrz nawiasów zbioru itp.)
  function topSplit(tex) {
    const sep = ',\\quad ', out = []; let depth = 0, last = 0;
    for (let i = 0; i < tex.length; i++) {
      if (tex.startsWith('\\left', i)) { depth++; i += 4; continue; }
      if (tex.startsWith('\\right', i)) { depth--; i += 5; continue; }
      const c = tex[i];
      if (c === '\\') { i++; if (tex[i] === '{' || tex[i] === '}') continue; continue; }
      if (c === '{') depth++; else if (c === '}') depth--;
      else if (depth === 0 && tex.startsWith(sep, i)) { out.push(tex.slice(last, i)); last = i + sep.length; i += sep.length - 1; }
    }
    out.push(tex.slice(last));
    return out;
  }
  const optTxt = tex => mdEl('span', topSplit(tex).map((x, k, all) => '<span class="part">$' + x + (k < all.length - 1 ? ',\\quad' : '') + '$</span>').join(''), { class: 'txt' });
  function mcUI(it) {
    const mc = A.buildMC(it);
    const box = h('div', { class: 'mc' });
    const single = mc.groups.length === 1;
    const done = T.status !== 'answering';
    const grpEl = (g, gi, reveal) => {
      const grp = h('div', { class: 'mcg', role: 'radiogroup' });
      if (g.label) grp.append(mdEl('div', A.mcLabel(g.label), { class: 'mcl' }));
      g.opts.forEach((o, oi) => {
        const sel = T.sel[gi] === oi;
        let cls = 'opt mcopt';
        if (reveal) cls += o.ok ? ' ok' : sel ? ' chosen' : ' dim'; else if (sel) cls += ' picked';
        const b = h('button', { class: cls, role: 'radio', 'aria-checked': sel ? 'true' : 'false', disabled: reveal, onclick: () => pick(gi, oi) },
          h('span', { class: 'letter' }, 'ABCD'[oi]), optTxt(o.tex));
        if (reveal && sel) b.classList.add('picked');
        grp.append(b);
      });
      return grp;
    };
    const pick = (gi, oi) => {
      if (T.status !== 'answering') return;
      T.sel[gi] = oi; SFX.key();
      if (single) { submit(); return; }
      // odpowiedzi po kolei: każda część osobno, z paskiem postępu
      const g = mc.groups[gi], ok = g.opts[oi].ok;
      T.mcRev = gi;
      if (ok) { SFX.click(); setTimeout(() => { if (T && T.mcRev === gi) advance(); }, 650); }
      else SFX.wrong();
      box.replaceWith(mcUI(it));
    };
    const advance = () => {
      T.mcRev = null; T.mcStep = (T.mcStep || 0) + 1;
      const pre2 = (T.mode === 'orig' && S.parts && S.parts[T.origKey]) || null;
      while (pre2 && pre2[T.mcStep] && T.mcStep < mc.groups.length) T.mcStep++;
      if (T.mcStep >= mc.groups.length) { submit(); return; }
      const nb = mcUI(it); const old = $('#card .mc'); if (old) old.replaceWith(nb);
      const cur = nb.querySelector('.mcstep'); if (cur) cur.scrollIntoView({ behavior: reduced() ? 'auto' : 'smooth', block: 'nearest' });
    };
    if (single) { box.append(grpEl(mc.groups[0], 0, done)); return box; }

    const pre = (T.mode === 'orig' && S.parts && S.parts[T.origKey]) || null;
    if (pre && !done) {
      mc.groups.forEach((g, k) => { if (pre[k] && T.sel[k] == null) T.sel[k] = g.opts.findIndex(o => o.ok); });
      while (pre[T.mcStep || 0] && (T.mcStep || 0) < mc.groups.length) T.mcStep = (T.mcStep || 0) + 1;
    }
    const n = mc.groups.length, step = done ? n : (T.mcStep || 0);
    const res = gi => T.sel[gi] != null && mc.groups[gi].opts[T.sel[gi]] && mc.groups[gi].opts[T.sel[gi]].ok;
    if (!done) box.append(h('div', { class: 'gprog' }, ...mc.groups.map((_, k) => h('i', { class: k < step || (k === step && T.mcRev === k) ? (res(k) ? 'on' : 'miss') : k === step ? 'cur' : '' }))));
    // zrobione części — krótko, jedna linijka każda
    const upto = done ? n : step;
    if (upto) {
      const list = h('div', { class: 'mcdone' });
      for (let k = 0; k < upto; k++) {
        const g = mc.groups[k], good = g.opts.find(o => o.ok), okk = res(k);
        const lab = (g.short || g.label) ? A.mcLabel(g.short || g.label) + ': ' : '';
        list.append(h('div', { class: 'mcd' + (okk ? '' : ' miss') }, h('span', { class: 'mi', html: okk ? IC.check : IC.x }),
          mdEl('span', lab + '$' + good.tex.replace(/,\\quad /g, ',\\ ') + '$' + (okk || T.sel[k] == null ? '' : ' <small>(wybrano: $' + g.opts[T.sel[k]].tex + '$)</small>') + (pre && pre[k] && !done ? ' <small class="pre">zaliczone wcześniej</small>' : ''), { class: 'mtx' })));
      }
      box.append(list);
    }
    if (!done && step < n) {
      const g = mc.groups[step], rev = T.mcRev === step;
      const cur = h('div', { class: 'mcstep' }, h('div', { class: 'mcpart' }, 'Część ' + (step + 1) + ' z ' + n), grpEl(g, step, rev));
      if (rev && !res(step)) cur.append(h('div', { class: 'row', style: 'margin-top:10px' }, h('button', { class: 'btn primary', onclick: advance }, step === n - 1 ? 'Zakończ' : 'Dalej', h('span', { html: IC.next }))));
      box.append(cur);
    }
    return box;
  }
  document.addEventListener('keydown', e => {
    if (!T || T.status !== 'answering' || (T.item.type || 'fields') !== 'fields' || e.target.tagName === 'INPUT') return;
    const k = e.key.toLowerCase(); const idx = '1234'.indexOf(k) >= 0 ? '1234'.indexOf(k) : 'abcd'.indexOf(k);
    if (idx < 0 || e.metaKey || e.ctrlKey || e.altKey) return;
    const mc = A.buildMC(T.item);
    if (mc.groups.length === 1) { if (!mc.groups[0].opts[idx]) return; T.sel[0] = idx; submit(); return; }
    if (T.mcRev != null) return;
    const b = document.querySelectorAll('#card .mcstep .mcopt')[idx]; if (b) b.click();
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
  // dowód z kilkoma metodami: wybór na początku, przełączanie w trakcie i po zakończeniu
  const methodItem = (base, i) => Object.assign({}, base, base.methods[i], { _base: base, _mi: i, methods: base.methods });
  function switchMethod(j) {
    const base = T.item._base || T.item; T.item = methodItem(base, j); T.gs = null; T.status = 'answering'; resetAttempt(); SFX.whoosh(); render();
    const c = $('#card'); if (c) c.scrollIntoView({ behavior: reduced() ? 'auto' : 'smooth', block: 'start' });
  }
  function methodPicker(it) {
    const box = h('div', { class: 'mpicker' }, h('div', { class: 'glabel hl' }, 'Wybierz metodę dowodu'), h('p', { class: 'mphint' }, 'Każda daje pełne punkty. Po przejściu jednej łatwo obejrzysz drugą.'));
    it.methods.forEach((m, i) => box.append(h('button', { class: 'mpick', onclick: () => { SFX.click(); T.item = methodItem(it, i); T.gs = null; render(); } },
      h('span', { class: 'mpn' }, String(i + 1)), h('span', { class: 'mpb' }, mdEl('b', m.name), mdEl('small', m.when), h('em', {}, m.steps.length + (m.steps.length < 5 ? ' kroki' : ' kroków'))), h('span', { class: 'mpa', html: IC.next }))));
    return box;
  }
  function guidedUI(it) {
    if (it.methods && it._mi == null) { if (it.methods.length > 1) return methodPicker(it); T.item = it = methodItem(it, 0); }
    if (!T.gs) T.gs = { i: 0, misses: 0, bad: {}, opts: it.steps.map(st => A.R.shuffle([{ t: st.a, ok: true }, ...st.w.map(([t, why]) => ({ t, why }))])) };
    const g = T.gs, n = it.steps.length, done = T.status !== 'answering';
    const box = h('div', { class: 'guided' });
    if (it.methods && it.methods.length > 1 && !done) box.append(h('div', { class: 'mswitch' }, h('span', {}, 'Metoda: '), mdEl('b', it.name), ...it.methods.map((m, j) => (j === it._mi ? '' : h('button', { class: 'btn small ghost', onclick: () => switchMethod(j) }, 'Zmień na: ', md(m.name))))));
    if (it.idea && !done) {
      if (g.showIdea) box.append(h('div', { class: 'gidea' }, h('div', { class: 'glabel' }, h('span', { html: IC.bulb }), 'Wskazówka · pomysł dowodu'), mdEl('div', it.idea)));
      else box.append(h('div', {}, h('button', { class: 'btn small hintbtn', onclick: () => { g.showIdea = true; SFX.hint(); box.replaceWith(guidedUI(it)); } }, h('span', { html: IC.bulb }), 'Wskazówka')));
    }
    if (!done) box.append(h('div', { class: 'gprog', 'aria-label': 'Krok ' + Math.min(g.i + 1, n) + ' z ' + n }, ...it.steps.map((_, k) => h('i', { class: k < g.i ? 'on' : k === g.i ? 'cur' : '' }))));
    const upto = done ? n : g.i;
    if (upto) {
      const chain = h('div', { class: 'gchain' + (done ? ' clean' : '') });
      for (let k = 0; k < upto; k++) {
        const st = it.steps[k];
        chain.append(h('div', { class: 'gline' + (k === upto - 1 && !done ? ' new' : '') }, h('span', { class: 'n' }, String(k + 1)),
          h('div', { class: 'gbody' }, mdEl('div', st.goal, { class: 'gg' }), mdEl('div', st.line, { class: 'gl' }), st.why ? mdEl('div', st.why, { class: 'gwhy' }) : '')));
      }
      box.append(h('div', { class: 'glabel' }, done ? (it.exam ? 'Cały tok rozumowania' : 'Gotowy dowód — tak zapisz go na kolokwium') : 'Twój dowód do tej pory'), chain);
    }
    if (g.i < n && !done) {
      const st = it.steps[g.i], cur = h('div', { class: 'gstep' });
      cur.append(h('div', { class: 'glabel hl' }, 'Krok ' + (g.i + 1) + ' z ' + n + ' · ', md(st.goal)));
      const eqs = it.steps.slice(0, g.i).filter(x => x.eq);
      if (eqs.length) cur.append(h('div', { class: 'geqs' }, h('div', { class: 'glabel' }, 'Oznaczone równania'), ...eqs.map(x => h('div', { class: 'geq' }, h('span', { class: 'en' }, '(' + x.eq.n + ')'), mdEl('span', '$' + x.eq.tex + '$')))));
      cur.append(mdEl('div', st.q, { class: 'gq' }));
      g.opts[g.i].forEach((o, oi) => {
        const bad = !!g.bad[oi];
        cur.append(h('button', { class: 'opt mcopt' + (bad ? ' chosen' : ''), disabled: bad, onclick: () => {
          if (o.ok) { g.i++; g.bad = {}; if (g.i === n) { submit(); return; } SFX.star(); }
          else { g.bad[oi] = true; g.misses++; SFX.wrong(); }
          const nb = guidedUI(it); box.replaceWith(nb);
          const tgt = nb.querySelector(o.ok ? '.gline.new' : '.why.hit'); if (tgt) tgt.scrollIntoView({ behavior: reduced() ? 'auto' : 'smooth', block: 'nearest' });
        } }, h('span', { class: 'letter' }, 'ABC'[oi]), mdEl('span', o.t, { class: 'txt' })));
        if (bad) cur.append(mdEl('div', '<b>Ten pomysł nie zadziała.</b> Spróbuj innej opcji.', { class: 'why hit' }));
      });
      box.append(cur);
    }
    return box;
  }
  function shuffleNotSorted(arr) { let a; let k = 0; do { a = A.R.shuffle(arr); k++; } while (k < 10 && a.every((x, i) => x.i === i)); return a; }

  function actionsBar() {
    const it = T.item;
    const bar = h('div', { class: 'actions', id: 'actions' });
    if (T.status === 'answering') {
      const ty = it.type || 'fields';
      const needBtn = ty === 'guided' ? false : ty !== 'fields';
      if (needBtn) bar.append(h('button', { class: 'btn primary', id: 'submitBtn', onclick: submit }, h('span', { html: IC.check }), 'Sprawdź'));
      bar.append(h('div', { class: 'spacer' }));
      bar.append(h('div', { class: 'life' },
        h('button', { class: 'btn small' + (T.usedW ? ' used' : ''), onclick: showWzory, title: 'Koło ratunkowe 1: wzory i definicje' }, h('span', { html: IC.bulb }), 'Wzory'),
        hasVar() ? h('button', { class: 'btn small' + (T.usedP ? ' used' : ''), onclick: showPrzyklad, title: 'Koło ratunkowe 2: podobny przykład z rozwiązaniem' }, h('span', { html: IC.book }), 'Przykład') : ''));
    }
    return bar;
  }
  function feedbackUI(it) {
    const ok = T.status === 'correct'; const type = it.type || 'fields';
    const fb = h('div', { class: 'feedback ' + (ok ? 'ok' : 'learn'), id: 'feedback', role: 'status' });
    const msgsOk = ['Świetnie!', 'Dokładnie tak!', 'Pięknie policzone!', 'Bezbłędnie!', 'Tak jest!', 'Znakomicie!'];
    if (ok) fb.append(h('h3', {}, h('span', { html: IC.check, style: 'width:22px;height:22px;display:grid' }), type === 'guided' ? 'Dowód kompletny!' : msgsOk[Math.floor(Math.random() * msgsOk.length)]));
    if (ok && type === 'guided' && !it.exam) fb.append(h('p', { style: 'margin:6px 0 0' }, 'Powyżej masz cały dowód w czystej postaci. Spróbuj odtworzyć go na kartce bez patrzenia.'));
    if (type === 'guided' && it.exam) {
      fb.append(h('div', { class: 'exam' }, h('div', { class: 'glabel' }, 'Wersja na kolokwium', it.name ? h('span', { class: 'exm' }, ' · ', md(it.name)) : ''),
        h('ol', {}, ...it.exam.map(([line, pt]) => h('li', {}, mdEl('div', line, { class: 'exl' }), pt ? h('span', { class: 'expt' }, h('span', { html: IC.check }), 'punkt: ', md(pt)) : '')))));
      if (it.traps && it.traps.length) fb.append(h('div', { class: 'traps' }, h('div', { class: 'glabel' }, 'Za to lecą punkty'), h('ul', {}, ...it.traps.map(t => mdEl('li', t)))));
      if (it.methods && it.methods.length > 1) fb.append(h('div', { class: 'row others' }, ...it.methods.map((m, j) => (j === it._mi ? '' : h('button', { class: 'btn', onclick: () => switchMethod(j) }, 'Zobacz inną metodę: ', md(m.name))))));
    }
    if (!ok) fb.append(h('h3', {}, h('span', { html: IC.bulb, style: 'width:22px;height:22px;display:grid' }), type === 'guided' ? 'Dowód kompletny' : 'Zobacz, jak to policzyć'));
    if (ok && T.redeemed) fb.append(h('p', { style: 'margin:6px 0 0' }, 'Podpunkt ' + (T.task.items[T.idx].label || '') + ' zaliczony.'));
    if (!ok) {
      if (T.partial) fb.append(h('p', { class: 'partial' }, h('b', {}, 'Zaliczone części: ' + T.partial.done + ' z ' + T.partial.n + '. '), 'Dobre odpowiedzi zostają zapisane — przy kolejnym podejściu odpowiadasz tylko na błędne.'));
      if (T.mode === 'orig' && hasVar() && type !== 'guided' && !T.partial) fb.append(h('p', { style: 'margin:6px 0 0' }, 'Rozwiąż podobny przykład — wtedy ten podpunkt się zaliczy.'));
      const ans = h('div', { class: 'ans' }, h('b', {}, 'Poprawna odpowiedź:'));
      if (type === 'fields') { /* zaznaczona na zielono */ } else if (false) {
        if (it.check) ans.append(mdEl('div', it.showAns));
        else it.fields.forEach(f => ans.append(mdEl('div', '$' + (f.label ? f.label + ' = ' : '') + A.ansTex(f) + '$')));
      } else if (type === 'choice') it.choice.correct.forEach(i => ans.append(mdEl('div', it.choice.opts[i])));
      else if (type === 'order') ans.append(h('ol', {}, it.order.steps.map(s => mdEl('li', s))));
      if (type !== 'fields' && type !== 'guided') fb.append(ans);
    }
    const sol = type === 'guided' ? null : (it.sol || it.steps);
    if (sol && sol.length && (!ok || type !== 'order')) {
      const det = h('details', { open: !ok ? '' : null }, h('summary', { style: 'cursor:pointer;font-weight:600' }, ok ? 'Rozwiązanie krok po kroku' : 'Rozwiązanie krok po kroku'), h('ol', { class: 'solsteps' }, sol.map(s => mdEl('li', s))));
      fb.append(det);
    }
    const row = h('div', { class: 'row' });
    if (T.mode === 'quick') row.append(h('button', { class: 'btn primary', onclick: goNext }, T.quick.i >= 9 ? 'Podsumowanie' : 'Dalej', h('span', { html: IC.next })));
    else {
      const n = practiceN(), canP = hasVar() && n < 3;
      const pBtn = cls => h('button', { class: 'btn ' + cls, onclick: startVariant }, h('span', { html: IC.dice }), 'Podobny przykład' + (canP ? ' (' + (n + 1) + '/3)' : ''));
      const nextBtn = cls => h('button', { class: 'btn ' + cls, onclick: goNext }, 'Dalej', h('span', { html: IC.next }));
      if (ok) { row.append(nextBtn('primary')); if (hasVar()) row.append(pBtn('')); }
      else if (type === 'guided') { row.append(h('button', { class: 'btn primary', onclick: () => { resetAttempt(); render(); } }, 'Spróbuj jeszcze raz')); row.append(nextBtn('')); }
      else if (T.partial) { row.append(h('button', { class: 'btn primary', onclick: () => { delete T.item._mc; resetAttempt(); render(); window.scrollTo({ top: 0, behavior: reduced() ? 'auto' : 'smooth' }); } }, 'Popraw ' + (T.partial.n - T.partial.done === 1 ? 'błędną część' : 'błędne części'))); if (T.task.gen) row.append(pBtn('')); row.append(nextBtn('')); }
      else { if (hasVar()) row.append(pBtn('primary')); row.append(nextBtn(hasVar() ? '' : 'primary')); }
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
      { id: 'd1', name: 'Kasia', xp: 3210, solved: 178, week: 410, streak: 12, spark: '12,40,40,95,130,160,210,250,251,290,330' }, { id: 'd2', name: 'Anon 3', xp: 2480, solved: 141, week: 95, streak: 2 },
      { id: 'd3', name: 'Bartek M.', xp: 1890, solved: 109, week: 520, streak: 5, spark: '30,30,30,60,61,90,150,190' }, { id: 'd4', name: 'Ola', xp: 1320, solved: 80, week: 260, spark: '50,90,120,130' },
      { id: 'd5', name: 'Anon 5', xp: 760, solved: 44, week: 0 }, { id: 'd6', name: 'Michał', xp: 540, solved: 33, week: 140 },
      { id: 'd7', name: 'Anon 2', xp: 210, solved: 12, week: 30 }, { id: 'd8', name: 'Zuza', xp: 95, solved: 6, week: 95, spark: '9' },
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
  // skumulowana liczba rozwiązanych przykładów dzień po dniu (od pierwszego dnia nauki), maks. 30 punktów
  function mySeries() {
    const dk = d => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
    const keys = Object.keys(S.days || {}).filter(k => (S.days[k].ok || 0) > 0).sort();
    if (!keys.length) return [];
    const [yy, mm, dd] = keys[0].split('-').map(Number); const f = new Date(yy, mm - 1, dd, 12), t = new Date(); t.setHours(12, 0, 0, 0);
    const n = Math.max(1, Math.round((t - f) / 864e5) + 1);
    const sumAll = keys.reduce((a, k) => a + (S.days[k].ok || 0), 0);
    let acc = Math.max(0, (S.correct || 0) - sumAll); const out = [];
    for (let k = 0; k < n; k++) { const d = new Date(f); d.setDate(f.getDate() + k); acc += (S.days[dk(d)] || {}).ok || 0; out.push(acc); }
    if (out.length <= 30) return out;
    return [...Array(30)].map((_, i) => out[Math.round(i * (out.length - 1) / 29)]);
  }
  function sparkSVG(series) {
    if (!series || !series.length) return '';
    if (series[0] > 0) series = [0, ...series]; // jak duży wykres: start od zera (dzień przed pierwszym dniem nauki)
    const W = 92, H = 30, pad = 4, n = series.length, max = Math.max(1, ...series);
    const x = i => n === 1 ? W - pad : pad + (W - 2 * pad) * i / (n - 1), y = v => H - pad - (H - 2 * pad) * v / max;
    const line = n === 1 ? `M${pad} ${y(0)} L${x(0)} ${y(series[0])}` : series.map((v, i) => (i ? 'L' : 'M') + x(i).toFixed(1) + ' ' + y(v).toFixed(1)).join(' ');
    const id = 'sg' + Math.random().toString(36).slice(2, 8);
    return `<svg class="spark" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" aria-hidden="true"><defs><linearGradient id="${id}" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="var(--accent)" stop-opacity=".35"/><stop offset="1" stop-color="var(--accent)" stop-opacity="0"/></linearGradient></defs>`
      + `<path class="sa" d="${line} L${x(n - 1).toFixed(1)} ${H - pad} L${n === 1 ? pad : x(0).toFixed(1)} ${H - pad} Z" fill="url(#${id})"/>`
      + `<path class="sl" pathLength="1" d="${line}" fill="none" stroke="var(--accent)" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round"/>`
      + `<circle class="sd" cx="${x(n - 1).toFixed(1)}" cy="${y(series[n - 1]).toFixed(1)}" r="2.6" fill="var(--accent)"/></svg>`;
  }
  const sparkOf = r => (r.me ? mySeries() : typeof r.spark === 'string' && r.spark ? r.spark.split(',').map(Number).filter(v => isFinite(v)) : Array.isArray(r.spark) ? r.spark : null);
  function rankRows() {
    const P = window.AQRank;
    const wk = weekKey();
    const others = P ? P.rows().filter(r => r.id !== P.uid && r.xp > 0).map(r => Object.assign({}, r, { week: r.weekKey === wk ? (r.week || 0) : 0, streak: liveStreak(r.streak, r.streakDay) })) : DEMO.others;
    const sm = summary();
    const me = { id: 'me', me: true, name: myName(), xp: S.xp, solved: sm.solved, week: myWeekXP(), streak: curStreak() };
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
  const streakPill = n => (n > 1 ? h('span', { class: 'rstreak', title: 'Seria: ' + n + (n === 1 ? ' dzień' : ' dni') + ' nauki z rzędu', html: IC.flame + '<span>' + n + '</span>' }) : '');
  function bigSparkSVG(series) {
    if (!series || !series.length) return '';
    if (series[0] > 0) series = [0, ...series];
    const W = 340, H = 96, padX = 12, top = 22, bot = 10, n = series.length, max = Math.max(1, ...series);
    const x = i => (n === 1 ? W - padX : padX + (W - 2 * padX) * i / (n - 1)), y = v => H - bot - (H - top - bot) * v / max;
    const line = series.map((v, i) => (i ? 'L' : 'M') + x(i).toFixed(1) + ' ' + y(v).toFixed(1)).join(' ');
    const id = 'bg' + Math.random().toString(36).slice(2, 8);
    // liczby nad kropkami: przy każdym przyroście, bez nachodzenia na siebie; ostatnia zawsze
    const show = new Set([n - 1]); let lastX = -99;
    for (let i = 0; i < n - 1; i++) { if (i > 0 && series[i] === series[i - 1]) continue; if (x(i) - lastX < 24 || x(n - 1) - x(i) < 24) continue; show.add(i); lastX = x(i); }
    const dots = series.map((v, i) => `<circle cx="${x(i).toFixed(1)}" cy="${y(v).toFixed(1)}" r="${i === n - 1 ? 3.6 : 2.4}" class="${i === n - 1 ? 'bd last' : 'bd'}" style="--i:${i}"/>`).join('');
    const labs = [...show].map(i => `<text x="${x(i).toFixed(1)}" y="${(y(series[i]) - 8).toFixed(1)}" text-anchor="${i === n - 1 ? 'end' : 'middle'}" class="${i === n - 1 ? 'bl last' : 'bl'}" style="--i:${i}">${series[i]}</text>`).join('');
    return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Łącznie rozwiązane przykłady dzień po dniu"><defs><linearGradient id="${id}" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="var(--accent)" stop-opacity=".32"/><stop offset="1" stop-color="var(--accent)" stop-opacity="0"/></linearGradient></defs>`
      + `<path d="${line} L${x(n - 1).toFixed(1)} ${H - bot} L${x(0).toFixed(1)} ${H - bot} Z" fill="url(#${id})"/>`
      + `<path class="bln" pathLength="1" d="${line}" fill="none" stroke="var(--accent)" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>${dots}${labs}</svg>`;
  }
  // podział zaliczonych podpunktów na przedmioty: wiersz rankingu albo ja
  function subjCounts(r) {
    if (r.me) { const o = Object.fromEntries(SUBJ.map(sb => [sb.id, subjProgress(sb.id).solved])); if (S.matFirst) o.mat = matProgress().done; return o; }
    const o = {};
    if (typeof r.subj === 'string' && r.subj) r.subj.split(',').forEach(kv => { const [k, v] = kv.split(':'); if (k && isFinite(+v)) o[k] = +v; });
    else o.alg = r.solved || 0; // starsze wpisy: przed proseminarium wszystko było algebrą
    return o;
  }
  const canHover = () => { try { return matchMedia('(hover: hover) and (pointer: fine)').matches; } catch (e) { return false; } };
  // wiersz rankingu: po najechaniu (komputer) albo dotknięciu (telefon) pasek dzieli się na przedmioty, a wykres się powiększa
  function rankRow(r, i, total, valTxt, valSub, extraCls) {
    const lv = levelInfo(r.xp), series = r.me ? mySeries() : sparkOf(r), sj = subjCounts(r);
    const hasMat = sj.mat != null;
    // kto zaczął od matury: w pasku tylko matura (i przedmioty ze studiów, jeśli coś z nich rozwiązał); pozostali — przedmioty ze studiów
    const matSeg = { sb: { id: 'mat', short: 'Matura', color: '#b98ae0' }, n: sj.mat };
    const segs = hasMat ? SUBJ.map(sb => ({ sb, n: sj[sb.id] || 0 })).filter(sg => sg.n > 0).concat([matSeg]) : SUBJ.map(sb => ({ sb, n: sj[sb.id] || 0 }));
    total = hasMat ? segs.reduce((a, sg) => a + (sg.sb.id === 'mat' ? MAT().items.length : subjProgress(sg.sb.id).total), 0) : summary().base;
    const solved = hasMat ? segs.reduce((a, sg) => a + sg.n, 0) : r.me ? summary().solved : r.solved;
    const split = h('div', { class: 'bar split', 'aria-hidden': 'true' }, ...segs.filter(sg => sg.n).map((sg, k) => h('i', { style: `width:${Math.min(100, 100 * sg.n / total)}%;background:${sg.sb.color};--k:${k}` })));
    const leg = h('div', { class: 'rsub' }, ...segs.map(sg => h('span', {}, h('i', { style: 'background:' + sg.sb.color }), sg.sb.short + ' ', h('b', {}, String(sg.n)))), h('span', { class: 'rof' }, 'z ' + total));
    const li = h('li', { class: 'rrow' + (r.me ? ' me' : '') + (extraCls || ''), style: `animation-delay:${i * 30}ms`, tabindex: '0', 'aria-expanded': 'false' },
      h('span', { class: 'rpos' }, i < 0 ? '–' : String(i + 1)), avatar(r.name),
      h('div', { class: 'rwho' }, h('b', {}, r.name, r.me ? h('span', { class: 'you' }, 'Ty') : '', streakPill(r.streak)), h('small', {}, lv.title + ' · ' + solved + '/' + total),
        h('div', { class: 'bar plain' }, h('i', { style: `width:${Math.min(100, 100 * solved / total)}%` })), split, leg),
      h('div', { class: 'rspark', html: sparkSVG(series), style: `--d:${Math.max(0, i) * 60}ms`, title: 'Łącznie rozwiązane przykłady dzień po dniu' }),
      h('div', { class: 'rxp' }, h('b', {}, valTxt), h('small', {}, valSub)),
      h('div', { class: 'rbig', html: series && series.length ? bigSparkSVG(series) : '' }));
    const set = on => { li.classList.toggle('open', on); li.setAttribute('aria-expanded', String(on)); };
    li.addEventListener('click', () => { const on = !li.classList.contains('open'); document.querySelectorAll('.rrow.open').forEach(x => x !== li && (x.classList.remove('open'), x.setAttribute('aria-expanded', 'false'))); set(on); SFX.click(); });
    li.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); set(!li.classList.contains('open')); } });
    return li;
  }
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
      list.append(rankRow({ me: true, name: nm, xp: S.xp, streak: 0 }, -1, sm.total, String(S.xp), 'XP'));
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
      h('div', { class: 'mewho' }, h('b', {}, me.name, streakPill(me.streak)), h('small', {}, lvMe.title)),
      h('button', { class: 'btn small', onclick: renameDialog }, 'Zmień nazwę'),
      h('div', { class: 'mepos' }, h('small', {}, rankMode === 'week' ? 'w tym tygodniu' : 'miejsce'), h('b', {}, pos + '.'))));
    const seg = h('div', { class: 'seg', role: 'tablist' },
      ...[['all', 'Od początku'], ['week', 'Ten tydzień']].map(([k, l]) => h('button', { role: 'tab', 'aria-selected': rankMode === k ? 'true' : 'false', onclick: () => { rankMode = k; SFX.click(); render(); } }, l)));
    sec.append(seg);
    const list = h('ol', { class: 'rlist' });
    const total = summary().total;
    rows.forEach((r, i) => list.append(rankRow(r, i, total, String(r[key]), rankMode === 'week' ? 'XP w tym tyg.' : 'XP')));
    sec.append(h('p', { class: 'rhint' }, (canHover() ? 'Kliknij' : 'Dotknij') + ' gracza, żeby zobaczyć podział na przedmioty i dokładny wykres.'));
    sec.append(list);
    if (!window.AQRank) sec.append(h('p', { class: 'demo-note' }, 'Podgląd: pozostali gracze to przykładowe dane. Twój wiersz liczy się na żywo.'));
    return sec;
  }

  /* ---- statystyki ---- */
  function matStatDz() {
    const M = MAT(), box = h('div', { class: 'lp' });
    M.dz.forEach((d, i) => {
      const p = matProgress(it => it.dz === i); if (!p.total) return;
      const bar = h('i', { style: 'width:0' }); requestAnimationFrame(() => requestAnimationFrame(() => { bar.style.width = (100 * p.done / p.total) + '%'; }));
      box.append(h('button', { class: 'subjcard mstatrow', onclick: () => goMatura(i) },
        h('div', { class: 'shead' }, h('b', {}, (i + 1) + '. ' + d.name), h('span', {}, p.done + '/' + p.total + ' zadań · ', h('b', {}, Math.round(100 * p.done / p.total) + '%'))),
        h('div', { class: 'mbar' }, bar)));
    });
    return box;
  }
  function statsView() {
    const lv = levelInfo(S.xp);
    const sec = h('section', { class: 'h-st' });
    const totalItems = LISTS.reduce((a, L) => a + listProgress(L).total, 0), solved = LISTS.reduce((a, L) => a + listProgress(L).solved, 0);
    sec.append(h('div', { class: 'hero' }, h('div', {}, h('h1', {}, 'Twoje ', h('span', {}, 'postępy')))));
    const kpi = (label, val, sub) => h('div', { class: 'kpi' }, h('small', {}, label), h('b', {}, val), h('span', {}, sub));
    sec.append(h('div', { class: 'kpis' },
      kpi('Poziom', String(lv.L), lv.title),
      kpi('Doświadczenie', S.xp + ' XP', lv.max ? 'poziom maksymalny' : (lv.need - lv.into) + ' XP do kolejnego'),
      inMat() ? (mp => kpi('Zadania maturalne', mp.done + '/' + mp.total, Math.round(100 * mp.done / mp.total) + '% zadań z arkuszy CKE'))(matProgress()) : kpi('Zaliczone podpunkty', solved + '/' + totalItems, Math.round(100 * solved / totalItems) + '% obu przedmiotów'),
      kpi('Rozwiązane przykłady', String(S.correct), 'łącznie z podobnymi'),
      inMat() ? (mv => kpi('Podobne przykłady', String(Object.values(mv).reduce((a, b) => a + b, 0)), Object.keys(mv).length ? 'ćwiczone przy ' + Object.keys(mv).length + (Object.keys(mv).length === 1 ? ' zadaniu' : ' zadaniach') : 'inne liczby, ten sam typ zadania'))(S.matV || {}) : kpi('Podobne przykłady', String(S.variants), (() => { const n = Object.values(S.practice || {}).filter(x => x > 0).length; return n ? 'ćwiczone w ' + n + (n === 1 ? ' podpunkcie' : ' podpunktach') : 'dodatkowe ćwiczenia do podpunktów'; })()),
      kpi('Dni nauki z rzędu', String(curStreak()), (() => { const n = (S.days[today()] || {}).ok || 0, m10 = n % 10, m100 = n % 100; return 'dzisiaj: ' + n + (n === 1 ? ' przykład' : m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14) ? ' przykłady' : ' przykładów'); })())));
    sec.append(h('h2', { class: 'sec' }, 'Rozwiązane przykłady'), activityChart());
    sec.append(h('h2', { class: 'sec' }, inMat() ? 'Działy matury' : 'Przedmioty i listy'));
    const lp = h('div', { class: 'lp' });
    SUBJ.forEach(sb => {
      const sp = subjProgress(sb.id), ids = subjLists(sb.id);
      const stack = h('div', { class: 'stack', role: 'img', 'aria-label': sb.name + ': ' + sp.solved + ' z ' + sp.total + ' podpunktów' });
      ids.forEach(i => { const p = listProgress(LISTS[i]); const seg = h('i', { class: 'h-' + LISTS[i].hue, title: LISTS[i].title + ': ' + p.solved + '/' + p.total, style: 'width:0' }); stack.append(seg); requestAnimationFrame(() => { seg.style.width = (100 * p.solved / Math.max(1, sp.total)) + '%'; }); });
      const legend = h('div', { class: 'legend' }, ids.map(i => { const p = listProgress(LISTS[i]); return h('span', { class: 'h-' + LISTS[i].hue }, h('i'), LISTS[i].title + ' ', h('b', {}, p.solved + '/' + p.total)); }));
      // listy przedmiotu chowają się pod kartą — rozwijane kliknięciem
      S.statOpen = S.statOpen || {};
      const open = !!S.statOpen[sb.id];
      const inner = h('div', { class: 'sdin' }); ids.forEach(i => inner.append(lrow(LISTS[i])));
      const det = h('div', { class: 'sdetail', id: 'sd-' + sb.id }, inner);
      const more = h('span', { class: 'smore' }, h('span', { class: 'mtxt' }, open ? 'Zwiń listy' : 'Pokaż ' + ids.length + (ids.length === 1 ? ' listę' : ids.length < 5 ? ' listy' : ' list')), h('span', { class: 'chev', html: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>' }));
      const card = h('div', { class: 'subjcard toggle' + (open ? ' open' : ''), role: 'button', tabindex: '0', 'aria-expanded': String(open), 'aria-controls': 'sd-' + sb.id },
        h('div', { class: 'shead' }, h('b', {}, sb.name), h('span', {}, sp.solved + '/' + sp.total + ' podpunktów · ', h('b', {}, Math.round(100 * sp.solved / Math.max(1, sp.total)) + '%'))), stack, h('div', { class: 'sfoot' }, legend, more));
      const flip = () => {
        const on = !card.classList.contains('open'); S.statOpen[sb.id] = on; save(); SFX.click();
        card.classList.toggle('open', on); det.classList.toggle('open', on); card.setAttribute('aria-expanded', String(on));
        more.querySelector('.mtxt').textContent = on ? 'Zwiń listy' : 'Pokaż ' + ids.length + (ids.length < 5 ? ' listy' : ' list');
        if (on) det.querySelectorAll('.lprow .bar i').forEach(i => { const w = i.dataset.w; i.style.width = '0'; requestAnimationFrame(() => requestAnimationFrame(() => { i.style.width = w; })); });
      };
      card.addEventListener('click', flip);
      card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); flip(); } });
      if (open) det.classList.add('open');
      lp.append(h('div', { class: 'sgroup' }, card, det));
    });
    function lrow(L) {
      const p = listProgress(L);
      const row = h('div', { class: 'lprow h-' + L.hue }, h('b', {}, L.title + ' · ' + L.name), h('span', { class: 'muted' }, `${p.solved}/${p.total} podpunktów · zadania ${p.done}/${p.tasks}`), h('div', { class: 'bar' }, h('i', { style: 'width:0' })),
        h('div', { class: 'tasks' }, L.tasks.map(t => { const tp = taskProgress(t); return h('button', { class: 'tpill' + (tp.done ? ' s3' : tp.solved ? ' s1' : ''), title: `Otwórz zadanie ${tid(t)} — ${tp.solved}/${tp.total} podpunktów`, onclick: e => { e.stopPropagation(); SFX.click(); startTask(LISTS.indexOf(L), L.tasks.indexOf(t)); window.scrollTo({ top: 0, behavior: 'auto' }); } }, tid(t) + (tp.done ? ' ✓' : '')); })));
      const bi = row.querySelector('.bar i'); bi.dataset.w = (100 * p.solved / p.total) + '%';
      requestAnimationFrame(() => { bi.style.width = bi.dataset.w; });
      return row;
    }
    if (inMat()) sec.append(matStatDz()); else sec.append(lp);
    sec.append(h('h2', { class: 'sec' }, 'Odznaki'));
    sec.append(h('div', { class: 'badges' }, BADGES.filter(b => !b.hidden).map(b => h('div', { class: 'bdg' + (S.badges[b.id] ? '' : ' locked') }, h('span', { class: 'ic', html: IC.trophy }), h('div', {}, h('b', {}, b.name), h('small', {}, b.desc))))));
    const HID = BADGES.filter(b => b.hidden), hidN = HID.filter(b => S.badges[b.id]).length;
    sec.append(h('h3', { class: 'sec hid' }, 'Ukryte odznaki', h('small', {}, ' ' + hidN + ' / ' + HID.length + ' · po 100 XP')));
    sec.append(h('div', { class: 'badges' }, HID.map(b => S.badges[b.id]
      ? h('div', { class: 'bdg hidden-on' }, h('span', { class: 'ic', html: IC.star }), h('div', {}, h('b', {}, b.name), h('small', {}, b.desc + ' · +100 XP')))
      : h('div', { class: 'bdg mystery' }, h('span', { class: 'ic q' }, '?'), h('div', {}, h('b', {}, '???'), h('small', {}, 'Ukryta — tylko dla wytrwałych'))))));
    const dz = h('div', { class: 'danger' });
    const resetBtn = h('button', { class: 'btn small ghost', onclick: () => {
      dz.innerHTML = ''; dz.append(h('span', {}, 'Na pewno wyzerować cały postęp? Tego nie da się cofnąć.'), h('button', { class: 'btn small', style: 'border-color:var(--bad);color:var(--bad)', onclick: () => { const snd = S.sound; S = blank(); S.sound = snd; save(); render(); toast('Postęp wyzerowany', 'Zaczynasz od nowa', 'flag'); } }, 'Tak, wyzeruj'), h('button', { class: 'btn small', onclick: () => render() }, 'Anuluj'));
    } }, 'Wyzeruj postęp');
    dz.append(resetBtn);
    sec.append(dz);
    return sec;
  }
  function activityChart() {
    // wykres liniowy: łączna liczba rozwiązanych przykładów; 8 dni, a gdy nauka trwa dłużej — cała historia
    const dk = d => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
    const keys = Object.keys(S.days || {}).filter(k => (S.days[k].ok || 0) > 0).sort();
    const d0 = new Date(); d0.setHours(12, 0, 0, 0);
    let n = 8;
    if (keys.length) { const [yy, mm, dd] = keys[0].split('-').map(Number); const f = new Date(yy, mm - 1, dd, 12); n = Math.max(8, Math.round((d0 - f) / 864e5) + 1); }
    const sumAll = keys.reduce((a, k) => a + (S.days[k].ok || 0), 0);
    let acc = Math.max(0, (S.correct || 0) - sumAll);
    const firstShown = new Date(d0); firstShown.setDate(d0.getDate() - (n - 1));
    keys.filter(k => k < dk(firstShown)).forEach(k => { acc += S.days[k].ok || 0; });
    const pts = [];
    for (let k = n - 1; k >= 0; k--) { const d = new Date(d0); d.setDate(d0.getDate() - k); const key = dk(d); const day = (S.days[key] || {}).ok || 0; acc += day; pts.push({ lab: d.getDate() + '.' + String(d.getMonth() + 1).padStart(2, '0'), v: acc, day }); }
    const max = Math.max(4, ...pts.map(p => p.v)); const step = Math.ceil(max / 4); const top = step * 4;
    const narrow = innerWidth < 640;
    const W = narrow ? 360 : 900, H = narrow ? 220 : 210, padL = 34, padR = 14, padB = 28, padT = 30;
    const x = i => padL + (W - padL - padR) * (n === 1 ? 0.5 : i / (n - 1));
    const y = v => padT + (H - padT - padB) * (1 - v / top);
    let svg = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Łączna liczba rozwiązanych przykładów"><defs><linearGradient id="cg" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="var(--accent)" stop-opacity=".28"/><stop offset="1" stop-color="var(--accent)" stop-opacity="0"/></linearGradient></defs>`;
    for (let g = 0; g <= 4; g++) { const v = step * g; svg += `<line x1="${padL}" x2="${W - padR}" y1="${y(v)}" y2="${y(v)}" stroke="var(--line)" stroke-width="1"/><text x="${padL - 8}" y="${y(v) + 4}" text-anchor="end" font-size="11" fill="var(--muted)" font-family="Inter">${v}</text>`; }
    const line = pts.map((p, i) => (i ? 'L' : 'M') + x(i).toFixed(1) + ' ' + y(p.v).toFixed(1)).join(' ');
    svg += `<path class="carea" d="${line} L${x(n - 1).toFixed(1)} ${y(0)} L${x(0).toFixed(1)} ${y(0)} Z" fill="url(#cg)"/>`;
    svg += `<line class="cguide" x1="0" x2="0" y1="${padT - 6}" y2="${y(0)}" stroke="var(--accent)" stroke-opacity=".35" stroke-dasharray="3 4"/>`;
    svg += `<path class="cline" pathLength="1" d="${line}" fill="none" stroke="var(--accent)" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>`;
    const every = Math.max(1, Math.ceil(n / (narrow ? 4 : 8)));
    const showDots = n <= (narrow ? 16 : 45);
    pts.forEach((p, i) => {
      const last = i === n - 1;
      svg += `<circle class="cdot${showDots || last ? '' : ' hid'}" data-i="${i}" cx="${x(i).toFixed(1)}" cy="${y(p.v).toFixed(1)}" r="6"/>`;
      if (last || ((n - 1 - i) % every === 0 && n - 1 - i >= every * 0.6)) svg += `<text x="${x(i)}" y="${H - 8}" text-anchor="${last ? 'end' : 'middle'}" font-size="11" fill="var(--muted)" font-family="Inter">${last ? 'dziś' : p.lab}</text>`;
    });
    svg += `<g class="clabel"><text class="cv" text-anchor="middle" y="-34" font-size="15" font-weight="700" fill="var(--accent)" font-family="Inter"></text><text class="cd" text-anchor="middle" y="-19" font-size="11" fill="var(--muted)" font-family="Inter"></text></g>`;
    svg += '</svg>';
    const legend = h('div', { style: 'font-size:12.5px;color:var(--muted);margin-top:6px' }, 'Łącznie rozwiązane przykłady' + (n > 8 ? ' — od pierwszego dnia nauki' : '') + (coarse() ? '' : ' · najedź na wykres, żeby zobaczyć dzień'));
    const holder = h('div', { html: svg });
    const el = holder.firstChild, dots = [...el.querySelectorAll('.cdot')], lab = el.querySelector('.clabel'), guide = el.querySelector('.cguide');
    const cv = lab.querySelector('.cv'), cd = lab.querySelector('.cd');
    let cur = -1;
    const setActive = k => {
      if (k === cur) return; cur = k;
      dots.forEach((d, i) => d.classList.toggle('on', i === k));
      const p = pts[k], px = x(k), py = y(p.v);
      const anchor = px > W - 60 ? 'end' : px < padL + 40 ? 'start' : 'middle';
      cv.setAttribute('text-anchor', anchor); cd.setAttribute('text-anchor', anchor);
      const dx = anchor === 'end' ? -10 : anchor === 'start' ? 10 : 0;
      cv.textContent = p.v;
      cd.textContent = p.day ? '+' + p.day : '';
      lab.style.transform = `translate(${(px + dx).toFixed(1)}px, ${Math.max(py, 48).toFixed(1)}px)`;
      guide.setAttribute('y1', (py + 9).toFixed(1));
      guide.style.transform = `translateX(${px.toFixed(1)}px)`;
      guide.style.opacity = k === n - 1 ? '0' : '1';
      lab.classList.remove('pop'); void lab.getBBox; requestAnimationFrame(() => lab.classList.add('pop'));
    };
    const pick = e => {
      const r = el.getBoundingClientRect(); if (!r.width) return;
      const vx = (e.clientX - r.left) / r.width * W;
      let k = Math.round((vx - padL) / ((W - padL - padR) / Math.max(1, n - 1)));
      setActive(Math.min(n - 1, Math.max(0, k)));
    };
    el.addEventListener('pointermove', pick);
    el.addEventListener('pointerdown', pick);
    let backT = 0;
    el.addEventListener('pointerleave', e => { clearTimeout(backT); if (e.pointerType === 'touch') backT = setTimeout(() => setActive(n - 1), 2500); else setActive(n - 1); });
    setActive(n - 1);
    return h('div', { class: 'chart' }, holder, legend);
  }

  /* ---------------- start ---------------- */
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeOverlays(); });
  addEventListener('hashchange', () => { const r = fromHash(); if (r !== 'started') render(); });
  let booted = false;
  function boot() {
    if (booted) return; booted = true;
    if (window.MathJax && MathJax.svgStylesheet) { try { document.head.appendChild(MathJax.svgStylesheet()); } catch (e) { /* ignoruj */ } }
    // ostatnio otwarty widok; przy pierwszym uruchomieniu — Lista 1
    const want = (location.hash || '').slice(1) || S.last || 'home';
    try { history.replaceState(null, '', '#' + want); } catch (e) { /* ignoruj */ }
    V = { view: 'list', list: 0 };
    const r = fromHash(); if (r !== 'started') render();
    setTimeout(() => { checkBadges(); save(); }, 1200);
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
    let solved = 0, total = 0;
    for (const L of LISTS) { const p = listProgress(L); solved += p.solved; total += p.total; }
    const base = total;
    // matura liczy się do postępu tylko u osób, które zaczęły od niej (zanim zrobiły cokolwiek ze studiów)
    const matStarted = !!S.matFirst, matOk = matStarted ? matProgress().done : 0;
    if (matStarted) { solved += matOk; total += MAT().items.length; }
    const subj = SUBJ.map(sb => sb.id + ':' + subjProgress(sb.id).solved).join(',') + (matStarted ? ',mat:' + matOk : '');
    return { xp: S.xp, level: levelInfo(S.xp).L, solved, total, base, subj, correct: S.correct, attempts: S.correct, best: 0 };
  }
  A.ui = { curItem: () => T && T.item, isDone: () => !!(T && (T.mode !== 'orig' || S.items[T.origKey])), mySeries, curStreak, weekKey, myWeekXP, myName, h, IC, md, toast, SFX, confetti, levelInfo, summary, getS: () => S, setS: ns => { S = Object.assign(blank(), ns); try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* ignoruj */ } }, render: () => { if (booted) render(); }, isRank: () => V.view === 'rank', closeOverlays, modal };
  if (window.AQRank && window.AQRank.init) window.AQRank.init();
  waitMJ();
})();
