// ينزّل بيانات المصحف المدني والتفسير الميسر ويحفظها في المستودع (app-data/qdata) لتدخل في التطبيق:
//   p/<n>.json  صفحات المصحف (٦٠٤) بنفس شكل quran.com مع حذف الترجمة والنطق اللاتيني
//   f/p<n>.woff2  خط مجمع الملك فهد لكل صفحة
//   t/<s>.json  التفسير الميسر لكل سورة {رقم_الآية: النص}
// بيكمّل الناقص بس، وبيتأكد من كل ملف. الاستخدام: node tools/fetch-quran-data.mjs
import fs from 'node:fs';
import path from 'node:path';
const OUT = path.resolve('app-data/qdata');
for (const d of ['p', 'f', 't']) fs.mkdirSync(path.join(OUT, d), { recursive: true });
const sleep = ms => new Promise(r => setTimeout(r, ms));
async function get(url, kind) {
  for (let i = 1; i <= 6; i++) {
    try {
      const r = await fetch(url, { headers: { 'user-agent': 'WirdApp/1.0 (+https://wird-azkar.pages.dev)' } });
      if (r.status === 429 || r.status >= 500) throw new Error('HTTP ' + r.status);
      if (!r.ok) throw new Error('HTTP ' + r.status + ' (final)');
      return kind === 'bin' ? Buffer.from(await r.arrayBuffer()) : await r.json();
    } catch (e) { if (/final/.test(e.message) || i === 6) throw new Error(url + ': ' + e.message); await sleep(1500 * i) }
  }
}
const have = f => fs.existsSync(f) && fs.statSync(f).size > 0;
const pool = async (n, items, fn) => { let k = 0; await Promise.all(Array.from({ length: n }, async () => { while (k < items.length) await fn(items[k++]) })) };
const PAGES = Array.from({ length: 604 }, (_, i) => i + 1);

await pool(6, PAGES, async n => {
  const f = path.join(OUT, 'p', n + '.json');
  if (!have(f)) {
    const j = await get(`https://api.quran.com/api/v4/verses/by_page/${n}?words=true&word_fields=code_v2,line_number,text_uthmani&fields=verse_key,juz_number,text_uthmani&per_page=60&mushaf=1`);
    if (!j.verses || !j.verses.length) throw new Error('page ' + n + ' empty');
    for (const v of j.verses) for (const w of v.words || []) { delete w.translation; delete w.transliteration }
    fs.writeFileSync(f, JSON.stringify(j));
  }
  const ff = path.join(OUT, 'f', 'p' + n + '.woff2');
  if (!have(ff)) {
    const b = await get(`https://static.qurancdn.com/fonts/quran/hafs/v2/woff2/p${n}.woff2`, 'bin');
    if (b.subarray(0, 4).toString('latin1') !== 'wOF2') throw new Error('font ' + n + ' not woff2');
    fs.writeFileSync(ff, b);
  }
});
console.log('pages + fonts ok');

// عدد آيات كل سورة من صفحات المصحف نفسها
const COUNT = {};
for (const n of PAGES) for (const v of JSON.parse(fs.readFileSync(path.join(OUT, 'p', n + '.json'))).verses) { const [s, a] = v.verse_key.split(':').map(Number); COUNT[s] = Math.max(COUNT[s] || 0, a) }
const strip = t => String(t || '').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
await pool(4, Array.from({ length: 114 }, (_, i) => i + 1), async s => {
  const f = path.join(OUT, 't', s + '.json');
  if (have(f) && Object.keys(JSON.parse(fs.readFileSync(f))).length === COUNT[s]) return;
  const out = {};
  for (let page = 1; ; page++) {
    const j = await get(`https://api.quran.com/api/v4/tafsirs/16/by_chapter/${s}?per_page=50&page=${page}`);
    for (const t of j.tafsirs || []) out[String(t.verse_key).split(':')[1]] = strip(t.text);
    const pg = j.pagination || {};
    if (!pg.next_page || page >= (pg.total_pages || 1)) break;
  }
  // أي آية ناقصة من الصفحات المجمّعة: نجيبها لوحدها
  for (let a = 1; a <= COUNT[s]; a++) if (!out[a]) {
    const j = await get(`https://api.quran.com/api/v4/tafsirs/16/by_ayah/${s}:${a}`);
    out[a] = strip(j.tafsir && j.tafsir.text);
  }
  const miss = Array.from({ length: COUNT[s] }, (_, i) => i + 1).filter(a => !out[a]);
  if (miss.length) throw new Error(`tafsir ${s}: no text for ayat ${miss.join(',')}`);
  fs.writeFileSync(f, JSON.stringify(out));
});
// تأكد نهائي: عدد آيات التفسير = عدد آيات المصحف
let ayat = 0, taf = 0;
for (const n of PAGES) ayat += JSON.parse(fs.readFileSync(path.join(OUT, 'p', n + '.json'))).verses.length;
for (let s = 1; s <= 114; s++) taf += Object.keys(JSON.parse(fs.readFileSync(path.join(OUT, 't', s + '.json')))).length;
console.log('ayat', ayat, 'tafsir', taf);
if (ayat !== 6236) throw new Error('expected 6236 ayat in pages, got ' + ayat);
if (taf !== 6236) throw new Error('tafsir incomplete: ' + taf);
