// Story Time app: pickers, reader, read-aloud, favorites. Everything stays on this device.
(function () {
'use strict';
const E = window.StoryEngine, A = window.StoryArt;
const $ = s => document.querySelector(s), $$ = s => Array.from(document.querySelectorAll(s));
const LS = { get: (k, d) => { try { const v = localStorage.getItem('st-' + k); return v === null ? d : JSON.parse(v); } catch { return d; } },
             set: (k, v) => { try { localStorage.setItem('st-' + k, JSON.stringify(v)); } catch {} } };
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const picks = Object.assign({ hero: null, place: null, lesson: null }, LS.get('picks', {}));
const settings = Object.assign({ voice: '', rate: 0.8, auto: true, night: false, size: '1' }, LS.get('settings', {}));
const saveSettings = () => LS.set('settings', settings);
let step = 0, story = null, pageIdx = 0, fromFavs = false;

function toast(msg, ms = 2200) { const t = $('#toast'); t.textContent = msg; t.hidden = false; clearTimeout(toast.t); toast.t = setTimeout(() => t.hidden = true, ms); }

// ---------- favorites (IndexedDB) ----------
const DB = {
  db: null,
  open() {
    if (this.db) return Promise.resolve(this.db);
    return new Promise((res, rej) => {
      const r = indexedDB.open('story-time', 1);
      r.onupgradeneeded = () => r.result.createObjectStore('favorites', { keyPath: 'id' });
      r.onsuccess = () => { this.db = r.result; res(this.db); }; r.onerror = () => rej(r.error);
    });
  },
  async tx(mode, fn) { const db = await this.open(); return new Promise((res, rej) => { const t = db.transaction('favorites', mode), st = t.objectStore('favorites'); const q = fn(st); t.oncomplete = () => res(q && q.result); t.onerror = () => rej(t.error); }); },
  put(v) { return this.tx('readwrite', s => s.put(v)); },
  del(id) { return this.tx('readwrite', s => s.delete(id)); },
  get(id) { return this.tx('readonly', s => s.get(id)); },
  all() { return this.tx('readonly', s => s.getAll()); },
};
const favId = s => [s.hero, s.place, s.lesson, s.seed, s.listener || ''].join('|');

// ---------- picker ----------
function buildPickers() {
  $('#heroGrid').innerHTML = E.HEROES.map(h => `<button class="card" data-hero="${h.id}" aria-label="${esc(h.name + ' the ' + h.label)}"><div class="art">${A.hero(h.id)}</div>${esc(h.name)}<small>${esc(h.label)}</small></button>`).join('');
  $('#placeGrid').innerHTML = E.PLACES.map(p => `<button class="card" data-place="${p.id}"><div class="art">${A.placeThumb(p.id)}</div>${esc(p.label)}</button>`).join('');
  $('#lessonGrid').innerHTML = E.LESSONS.map(l => `<button class="card" data-lesson="${l.id}"><div class="art">${A.lessonIcon(l.id)}</div>${esc(l.label)}</button>`).join('');
  $('#heroGrid').onclick = e => choose('hero', e.target.closest('[data-hero]')?.dataset.hero);
  $('#placeGrid').onclick = e => choose('place', e.target.closest('[data-place]')?.dataset.place);
  $('#lessonGrid').onclick = e => choose('lesson', e.target.closest('[data-lesson]')?.dataset.lesson);
  $$('.step-chip').forEach(b => b.onclick = () => goStep(+b.dataset.go));
}
function choose(kind, id) {
  if (!id) return;
  picks[kind] = id; LS.set('picks', picks); markPicks();
  const next = ['hero', 'place', 'lesson'].indexOf(kind) + 1;
  setTimeout(() => goStep(firstMissing() ?? next), 220);
}
const firstMissing = () => { const i = ['hero', 'place', 'lesson'].findIndex(k => !picks[k]); return i < 0 ? null : i; };
function markPicks() {
  $$('[data-hero]').forEach(b => b.classList.toggle('sel', b.dataset.hero === picks.hero));
  $$('[data-place]').forEach(b => b.classList.toggle('sel', b.dataset.place === picks.place));
  $$('[data-lesson]').forEach(b => b.classList.toggle('sel', b.dataset.lesson === picks.lesson));
  $('#chipHero').innerHTML = picks.hero ? A.hero(picks.hero) : '';
  $('#chipPlace').innerHTML = picks.place ? A.placeThumb(picks.place) : '';
  $('#chipLesson').innerHTML = picks.lesson ? A.lessonIcon(picks.lesson) : '';
  $$('.step-chip').forEach((c, i) => c.classList.toggle('done', i < 3 && !!picks[['hero', 'place', 'lesson'][i]]));
}
function goStep(i) {
  if (i === 3 && firstMissing() !== null) i = firstMissing();
  step = i;
  $$('.step').forEach(s => s.hidden = +s.dataset.step !== i);
  $$('.step-chip').forEach((c, k) => c.classList.toggle('on', k === i));
  if (i === 3) renderSummary();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
function renderSummary() {
  const h = E.HEROES.find(x => x.id === picks.hero), p = E.PLACES.find(x => x.id === picks.place), l = E.LESSONS.find(x => x.id === picks.lesson);
  $('#summary').innerHTML = `<button class="sum card" data-go="0"><div class="art">${A.hero(h.id)}</div>${esc(h.name)}<small>${esc(h.label)}</small></button>
    <button class="sum card" data-go="1"><div class="art">${A.placeThumb(p.id)}</div>${esc(p.label)}</button>
    <button class="sum card" data-go="2"><div class="art">${A.lessonIcon(l.id)}</div>${esc(l.label)}</button>`;
  $$('#summary [data-go]').forEach(b => b.onclick = () => goStep(+b.dataset.go));
}

// ---------- reader ----------
function makeStory(seed) {
  const listener = $('#listener').value; LS.set('listener', listener);
  return E.generate({ hero: picks.hero, place: picks.place, lesson: picks.lesson, listener, seed: seed || E.newSeed() });
}
function openStory(s, opts = {}) {
  story = s; pageIdx = 0; fromFavs = !!opts.fromFavs;
  $('#maker').hidden = true; $('#favs').hidden = true; $('#reader').hidden = false; $('.top').hidden = true;
  $('#rTitle').textContent = s.title;
  $('#dots').innerHTML = s.pages.map(() => '<i></i>').join('');
  renderPage(); refreshFav(); wake(true);
}
function closeReader() {
  stopSpeech(); wake(false);
  $('#reader').hidden = true; $('.top').hidden = false;
  if (fromFavs) showFavs(); else { $('#maker').hidden = false; goStep(3); }
}
function renderPage() {
  const atEnd = pageIdx >= story.pages.length;
  $('#endBox').hidden = !atEnd;
  $('#sceneBox').style.visibility = atEnd ? 'hidden' : ''; $('#textBox').style.visibility = atEnd ? 'hidden' : '';
  $$('#dots i').forEach((d, i) => d.classList.toggle('on', i === pageIdx));
  $('#prevBtn').disabled = pageIdx === 0;
  $('#nextBtn').disabled = atEnd;
  $('#nextBtn').setAttribute('aria-label', pageIdx === story.pages.length - 1 ? 'The end' : 'Next page');
  if (atEnd) { $('#endBox p').textContent = `Sweet dreams. Story code ${story.seed}`; return; }
  const pg = story.pages[pageIdx];
  $('#sceneBox').innerHTML = A.scene(pg, story);
  let html = '', last = 0;
  pg.text.replace(/\S+/g, (w, i) => { html += esc(pg.text.slice(last, i)) + `<span class="w" data-s="${i}" data-e="${i + w.length}">${esc(w)}</span>`; last = i + w.length; return w; });
  $('#textBox').innerHTML = `<p>${html}</p>`;
}
function go(delta, keepSpeaking) {
  if (!story) return;
  const n = Math.max(0, Math.min(story.pages.length, pageIdx + delta));
  if (n === pageIdx) return;
  if (!keepSpeaking) stopSpeech();
  pageIdx = n; renderPage();
}

// ---------- read-aloud ----------
const synth = 'speechSynthesis' in window ? window.speechSynthesis : null;
let voices = [], reading = false, session = 0, curUtt = null;
function loadVoices() {
  if (!synth) return;
  voices = synth.getVoices().slice().sort((a, b) => score(b) - score(a) || a.name.localeCompare(b.name));
  const sel = $('#voiceSel');
  sel.innerHTML = `<option value="">Default voice</option>` + voices.map(v => `<option value="${esc(v.voiceURI)}">${esc(v.name)} (${esc(v.lang)})${v.localService ? '' : ' · online'}</option>`).join('');
  sel.value = voices.some(v => v.voiceURI === settings.voice) ? settings.voice : '';
  $('#voiceNote').textContent = voices.length ? 'Voices marked "online" may need internet. Offline voices are listed first.' : 'No voices found yet. Your device may still be loading them.';
}
function score(v) { const lang = (navigator.language || 'en').slice(0, 2); return (v.lang.startsWith(lang) ? 4 : 0) + (v.localService ? 2 : 0) + (/female|samantha|karen|moira|serena|zira|aria|jenny/i.test(v.name) ? 1 : 0); }
function pickVoice() { return voices.find(v => v.voiceURI === settings.voice) || voices.find(v => v.default && v.localService) || voices[0] || null; }
function setPlaying(on) { reading = on; $('#playBtn').setAttribute('aria-pressed', on ? 'true' : 'false'); $('#playBtn span').textContent = on ? 'Pause' : 'Read to me'; }
function clearHi() { $$('#textBox .w.hi').forEach(w => w.classList.remove('hi')); }
function speakPage() {
  if (!synth || !story || pageIdx >= story.pages.length) return setPlaying(false);
  const my = ++session, pg = story.pages[pageIdx];
  synth.cancel();
  const u = new SpeechSynthesisUtterance(pg.text.replace(/[“”]/g, ''));
  // quotes are removed without changing length-relevant offsets below: map offsets back
  const map = []; for (let i = 0, j = 0; i < pg.text.length; i++) { if (pg.text[i] !== '“' && pg.text[i] !== '”') map[j++] = i; }
  u.rate = settings.rate; u.pitch = 1.05; u.volume = 1;
  const v = pickVoice(); if (v) { u.voice = v; u.lang = v.lang; } else u.lang = 'en-US';
  u.onboundary = e => {
    if (my !== session || (e.name && e.name !== 'word')) return;
    const ci = map[e.charIndex] ?? e.charIndex; clearHi();
    const w = $$('#textBox .w').find(s => +s.dataset.s <= ci && ci < +s.dataset.e) || $$('#textBox .w').find(s => +s.dataset.s >= ci);
    if (w) w.classList.add('hi');
  };
  u.onend = () => {
    if (my !== session) return; clearHi();
    if (reading && settings.auto && pageIdx < story.pages.length - 1) setTimeout(() => { if (my === session && reading) { go(1, true); speakPage(); } }, 1100);
    else if (reading && settings.auto && pageIdx === story.pages.length - 1) setTimeout(() => { if (my === session && reading) { setPlaying(false); go(1, true); } }, 1400);
    else setPlaying(false);
  };
  u.onerror = e => { if (my === session && e.error !== 'interrupted' && e.error !== 'canceled') { setPlaying(false); toast('The voice could not read this page.'); } };
  curUtt = u; window.__lastUtterance = u;
  setPlaying(true);
  synth.speak(u);
}
function stopSpeech() { session++; if (synth) synth.cancel(); clearHi(); setPlaying(false); }
function togglePlay() {
  if (!synth) return toast('Read-aloud is not available in this browser.');
  if (reading) return stopSpeech();
  if (pageIdx >= story.pages.length) pageIdx = 0, renderPage();
  speakPage();
}

// ---------- wake lock (keeps the screen on while reading, where supported) ----------
let lock = null;
async function wake(on) { try { if (on && 'wakeLock' in navigator && !lock) { lock = await navigator.wakeLock.request('screen'); lock.addEventListener('release', () => lock = null); } else if (!on && lock) { await lock.release(); lock = null; } } catch {} }
document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible' && !$('#reader').hidden) wake(true); if (document.visibilityState === 'hidden') stopSpeech(); });

// ---------- favorites UI ----------
async function refreshFav() { let on = false; try { on = !!(await DB.get(favId(story))); } catch {} $('#favBtn').setAttribute('aria-pressed', on ? 'true' : 'false'); $('#favBtn span').textContent = on ? 'Saved' : 'Save'; }
async function toggleFav() {
  const id = favId(story);
  try {
    if (await DB.get(id)) { await DB.del(id); toast('Removed from favorites'); }
    else { await DB.put({ id, savedAt: Date.now(), story }); toast('Saved to favorites'); }
  } catch (e) { toast('Could not save on this device.'); }
  refreshFav();
}
async function showFavs() {
  stopSpeech();
  $('#maker').hidden = true; $('#reader').hidden = true; $('#favs').hidden = false; $('.top').hidden = false;
  let list = []; try { list = await DB.all(); } catch {}
  list.sort((a, b) => b.savedAt - a.savedAt);
  const P = id => E.PLACES.find(p => p.id === id)?.label || '', L = id => E.LESSONS.find(p => p.id === id)?.label || '';
  $('#favList').innerHTML = list.length ? list.map(f => `<div class="fav" data-id="${esc(f.id)}"><div class="art">${A.hero(f.story.hero)}</div>
    <div class="info"><b>${esc(f.story.title)}</b><small>${esc(P(f.story.place))} · ${esc(L(f.story.lesson))} · ${f.story.pages.length} pages<br>Saved ${new Date(f.savedAt).toLocaleDateString()}</small></div>
    <div class="acts"><button class="pill" data-read>Read</button><button class="pill del" data-del>Remove</button></div></div>`).join('')
    : `<div class="empty">No favorites yet.<br>Tap the heart while reading a story to keep it here.</div>`;
  $('#favList').onclick = async e => {
    const card = e.target.closest('.fav'); if (!card) return;
    const f = list.find(x => x.id === card.dataset.id);
    if (e.target.closest('[data-read]')) openStory(f.story, { fromFavs: true });
    if (e.target.closest('[data-del]')) {
      const b = e.target.closest('[data-del]');
      if (b.dataset.sure) { await DB.del(f.id); showFavs(); } else { b.dataset.sure = 1; b.textContent = 'Sure?'; setTimeout(() => { if (b.isConnected) { delete b.dataset.sure; b.textContent = 'Remove'; } }, 3000); }
    }
  };
}

// ---------- settings ----------
function applySettings() {
  document.documentElement.toggleAttribute('data-night', !!settings.night);
  document.querySelector('meta[name=theme-color]').content = settings.night ? '#1a1410' : '#2b2a4a';
  document.documentElement.style.setProperty('--scale', settings.size);
  $('#nightBtn').setAttribute('aria-pressed', settings.night ? 'true' : 'false');
  $('#rateIn').value = settings.rate; $('#rateVal').textContent = settings.rate <= .65 ? 'very slow' : settings.rate <= .85 ? 'slow and gentle' : settings.rate <= 1 ? 'normal' : 'quick';
  $('#autoIn').checked = !!settings.auto; $('#nightIn').checked = !!settings.night; $('#sizeSel').value = settings.size;
}
function wire() {
  $('#homeBtn').onclick = () => { stopSpeech(); $('#favs').hidden = true; $('#reader').hidden = true; $('#maker').hidden = false; goStep(0); };
  $('#favsBtn').onclick = showFavs; $('#favsBack').onclick = () => { $('#favs').hidden = true; $('#maker').hidden = false; goStep(step); };
  $('#nightBtn').onclick = () => { settings.night = !settings.night; saveSettings(); applySettings(); };
  $('#setBtn').onclick = () => { loadVoices(); $('#settings').showModal(); };
  $('#voiceSel').onchange = e => { settings.voice = e.target.value; saveSettings(); };
  $('#rateIn').oninput = e => { settings.rate = +e.target.value; saveSettings(); applySettings(); };
  $('#autoIn').onchange = e => { settings.auto = e.target.checked; saveSettings(); };
  $('#nightIn').onchange = e => { settings.night = e.target.checked; saveSettings(); applySettings(); };
  $('#sizeSel').onchange = e => { settings.size = e.target.value; saveSettings(); applySettings(); };
  $('#testVoice').onclick = () => { if (!synth) return toast('Read-aloud is not available in this browser.'); synth.cancel(); const u = new SpeechSynthesisUtterance('Once upon a time, there was a sleepy little fox.'); u.rate = settings.rate; const v = pickVoice(); if (v) { u.voice = v; u.lang = v.lang; } synth.speak(u); };
  $('#surpriseBtn').onclick = () => { const r = a => a[Math.floor(Math.random() * a.length)].id; picks.hero = r(E.HEROES); picks.place = r(E.PLACES); picks.lesson = r(E.LESSONS); LS.set('picks', picks); markPicks(); openStory(makeStory()); };
  $('#makeBtn').onclick = () => openStory(makeStory());
  $('#listener').onkeydown = e => { if (e.key === 'Enter') { e.preventDefault(); $('#makeBtn').click(); } };
  $('#codeBtn').onclick = () => { const c = parseInt($('#codeIn').value, 10); if (!(c > 0)) return toast('Type the number shown on the last page.'); openStory(makeStory(c)); };
  $('#closeBtn').onclick = closeReader; $('#endHomeBtn').onclick = closeReader;
  $('#prevBtn').onclick = () => go(-1); $('#nextBtn').onclick = () => go(1);
  $('#playBtn').onclick = togglePlay; $('#favBtn').onclick = toggleFav;
  $('#againBtn').onclick = () => { pageIdx = 0; renderPage(); };
  const shuffle = () => { stopSpeech(); const s = story; openStory(E.generate({ hero: s.hero, place: s.place, lesson: s.lesson, listener: s.listener, seed: E.newSeed() }), { fromFavs }); toast('A new story!'); };
  $('#shuffleBtn').onclick = shuffle; $('#newBtn').onclick = shuffle;
  document.addEventListener('keydown', e => {
    if ($('#reader').hidden || $('#settings').open) return;
    if (e.key === 'ArrowRight') go(1); else if (e.key === 'ArrowLeft') go(-1); else if (e.key === ' ') { e.preventDefault(); togglePlay(); } else if (e.key === 'Escape') closeReader();
  });
  // swipe to turn pages
  let sx = null, sy = null;
  $('#stage').addEventListener('pointerdown', e => { sx = e.clientX; sy = e.clientY; });
  $('#stage').addEventListener('pointerup', e => { if (sx === null) return; const dx = e.clientX - sx, dy = e.clientY - sy; sx = null; if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.4) go(dx < 0 ? 1 : -1); });
  if (!synth) $('#playBtn').classList.add('na');
  else { loadVoices(); synth.addEventListener ? synth.addEventListener('voiceschanged', loadVoices) : (synth.onvoiceschanged = loadVoices); }
}

// ---------- start ----------
buildPickers(); wire(); applySettings();
$('#listener').value = LS.get('listener', '');
markPicks(); goStep(0);
if ('serviceWorker' in navigator && location.protocol === 'https:') navigator.serviceWorker.register('sw.js').catch(() => {});
window.ST = { ready: true, E, DB, get story() { return story; }, get page() { return pageIdx; }, settings, picks, openStory, makeStory, showFavs };
})();
