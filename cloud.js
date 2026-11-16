/* Algebrownia — wspólny ranking (Firebase, darmowy plan Spark).
   Postęp zostaje w przeglądarce; do bazy trafia tylko wpis rankingu: nazwa, XP, zaliczone podpunkty. */
(function () {
  'use strict';
  const cfg = window.FIREBASE_CONFIG || {};
  const P = window.AQRank = { status: 'connecting', uid: null, meNo: null, _rows: [] };
  if (!cfg.apiKey || /WKLEJ/.test(cfg.apiKey) || !window.firebase) { P.status = 'error'; P.init = () => {}; P.queue = () => {}; P.rows = () => []; return; }

  let ui, db, pushT = null, lastSent = '', noP = null;
  P.rows = () => P._rows;

  P.init = function () {
    ui = window.AQ.ui;
    try { firebase.initializeApp(cfg); db = firebase.firestore(); } catch (e) { return fail(e); }
    // najpierw czekamy, aż Firebase odtworzy zapamiętane konto; nowe tworzymy tylko, gdy go nie ma
    let first = true;
    firebase.auth().onAuthStateChanged(u => {
      if (u) { if (P.uid !== u.uid) start(u.uid).catch(fail); }
      else if (first) firebase.auth().signInAnonymously().catch(fail);
      first = false;
    });
  };
  function fail(e) { console.error('Ranking:', e); P.status = 'error'; if (ui) ui.render(); }

  async function start(uid) {
    P.uid = uid;
    const ref = db.collection('board').doc(uid);
    const snap = await ref.get();
    const S = ui.getS();
    if (snap.exists && snap.data().no) P.meNo = snap.data().no;
    if (!S.name && snap.exists && snap.data().name && !/^Anon \d+$/.test(snap.data().name)) { S.name = snap.data().name; ui.setS(S); }
    await push(true);
    db.collection('board').orderBy('xp', 'desc').limit(200).onSnapshot(q => {
      P._rows = q.docs.map(d => Object.assign({ id: d.id }, d.data()));
      P.status = 'ready';
      if (ui.isRank()) ui.render();
    }, fail);
  }

  async function push(force) {
    if (!P.uid) return;
    const sm = ui.summary();
    if (!P.meNo) {
      if (sm.xp <= 0) return; // wpis powstaje dopiero po pierwszym rozwiązanym przykładzie
      const cRef = db.collection('meta').doc('counter');
      if (!noP) noP = db.runTransaction(async tx => { const d = await tx.get(cRef); const n = (d.exists ? d.data().n : 0) + 1; tx.set(cRef, { n }); return n; });
      P.meNo = await noP;
    }
    const doc = { no: P.meNo, name: ui.myName(), xp: sm.xp, solved: sm.solved, total: sm.total, week: ui.myWeekXP(), weekKey: ui.weekKey() };
    if (!P.oldRules) { doc.streak = ui.curStreak(); doc.streakDay = ui.getS().lastDay || ''; }
    const sig = JSON.stringify(doc);
    if (!force && sig === lastSent) return;
    lastSent = sig;
    try { await db.collection('board').doc(P.uid).set(Object.assign({}, doc, { updatedAt: firebase.firestore.FieldValue.serverTimestamp() })); }
    catch (e) { // stare reguły bez pola serii — zapisujemy bez niego
      if (P.oldRules || !('streak' in doc)) throw e;
      P.oldRules = true; delete doc.streak; delete doc.streakDay; lastSent = JSON.stringify(doc);
      await db.collection('board').doc(P.uid).set(Object.assign(doc, { updatedAt: firebase.firestore.FieldValue.serverTimestamp() }));
    }
  }
  P.queue = function () { if (!P.uid) return; clearTimeout(pushT); pushT = setTimeout(() => push().catch(fail), 1200); };
  P.rename = function () { P.queue(); };
})();
