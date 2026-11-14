/* Algebrownia — wspólny ranking (Firebase, darmowy plan Spark).
   Postęp zostaje w przeglądarce; do bazy trafia tylko wpis rankingu: nazwa, XP, zaliczone podpunkty. */
(function () {
  'use strict';
  const cfg = window.FIREBASE_CONFIG || {};
  const P = window.AQRank = { status: 'connecting', uid: null, meNo: null, _rows: [] };
  if (!cfg.apiKey || /WKLEJ/.test(cfg.apiKey) || !window.firebase) { P.status = 'error'; P.init = () => {}; P.queue = () => {}; P.rows = () => []; return; }

  let ui, db, pushT = null, lastSent = '';
  P.rows = () => P._rows;

  P.init = function () {
    ui = window.AQ.ui;
    try { firebase.initializeApp(cfg); db = firebase.firestore(); } catch (e) { return fail(e); }
    firebase.auth().onAuthStateChanged(u => { if (u) start(u.uid).catch(fail); });
    firebase.auth().signInAnonymously().catch(fail);
  };
  function fail(e) { console.error('Ranking:', e); P.status = 'error'; if (ui) ui.render(); }

  async function start(uid) {
    P.uid = uid;
    const ref = db.collection('board').doc(uid);
    const snap = await ref.get();
    const S = ui.getS();
    if (snap.exists && snap.data().no) P.meNo = snap.data().no;
    else {
      // kolejny numer „Anon N”
      const cRef = db.collection('meta').doc('counter');
      P.meNo = await db.runTransaction(async tx => { const d = await tx.get(cRef); const n = (d.exists ? d.data().n : 0) + 1; tx.set(cRef, { n }); return n; });
    }
    if (!S.name && snap.exists && snap.data().name && !/^Anon \d+$/.test(snap.data().name)) { S.name = snap.data().name; ui.setS(S); }
    await push(true);
    db.collection('board').orderBy('xp', 'desc').limit(200).onSnapshot(q => {
      P._rows = q.docs.map(d => Object.assign({ id: d.id }, d.data()));
      P.status = 'ready';
      if (ui.isRank()) ui.render();
    }, fail);
  }

  async function push(force) {
    if (!P.uid || !P.meNo) return;
    const sm = ui.summary();
    const doc = { no: P.meNo, name: ui.myName(), xp: sm.xp, solved: sm.solved, total: sm.total, week: ui.myWeekXP(), weekKey: ui.weekKey() };
    const sig = JSON.stringify(doc);
    if (!force && sig === lastSent) return;
    lastSent = sig;
    await db.collection('board').doc(P.uid).set(Object.assign(doc, { updatedAt: firebase.firestore.FieldValue.serverTimestamp() }));
  }
  P.queue = function () { if (!P.uid) return; clearTimeout(pushT); pushT = setTimeout(() => push().catch(fail), 1200); };
  P.rename = function () { P.queue(); };
})();
