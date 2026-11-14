// ينشر موقع وِرد من المستودع (web/) على Worker «azkar» ومشروع Pages «wird-azkar».
// كود التوجيه في الـ Worker (ما بعد FILES) يُقرأ من النسخة المنشورة كما هو، والملفات تُبنى من web/.
// يحتاج CLOUDFLARE_API_TOKEN. مع --dry: يبني ويقارن ويحفظ النسخة بدون نشر.
import fs from 'node:fs';
import { build } from '../web/build.mjs';

const ACCT = '449a8fdc919c21ae6200bd06af5ab541';
const API = `https://api.cloudflare.com/client/v4/accounts/${ACCT}`;
const TOKEN = process.env.CLOUDFLARE_API_TOKEN;
if (!TOKEN) { console.error('::error::CLOUDFLARE_API_TOKEN secret is missing'); process.exit(1); }
const H = { Authorization: `Bearer ${TOKEN}` };
const DRY = process.argv.includes('--dry');
const here = new URL('.', import.meta.url).pathname;
const sleep = ms => new Promise(r => setTimeout(r, ms));

async function cf(path, init = {}) {
  const r = await fetch(API + path, { ...init, headers: { ...H, ...(init.headers || {}) } });
  const t = await r.text();
  let j; try { j = JSON.parse(t); } catch { throw new Error(`${path} → ${r.status}: ${t.slice(0, 300)}`); }
  if (!j.success) throw new Error(`${path} → ${JSON.stringify(j.errors)}`);
  return j.result;
}
async function retry(what, fn, ok = /10013|5\d\d|upstream/) {
  for (let a = 1; ; a++) {
    try { return await fn(); }
    catch (e) { if (a >= 5 || !ok.test(String(e.message))) throw e; console.log(`${what} failed (try ${a}): ${e.message.slice(0, 120)} — retrying in ${a * 20}s`); await sleep(a * 20000); }
  }
}

// 1) الـ Worker المنشور: ربط قاعدة البيانات + كود التوجيه + الملفات الحالية (للمقارنة فقط)
const settings = await cf('/workers/scripts/azkar/settings');
const d1 = (settings.bindings || []).find(b => b.type === 'd1');
if (!d1) throw new Error('D1 binding not found on worker azkar');
const res = await fetch(API + '/workers/scripts/azkar/content/v2', { headers: H });
if (!res.ok) throw new Error('content fetch ' + res.status + ' ' + (await res.text()).slice(0, 200));
let code;
if ((res.headers.get('content-type') || '').includes('multipart')) {
  for (const [k, v] of await res.formData()) if (typeof v !== 'string' && /\.m?js$/.test(v.name || k)) { code = await v.text(); break; }
} else code = await res.text();
if (!code || !code.startsWith('const FILES=')) throw new Error('unexpected worker content: ' + String(code).slice(0, 80));
const cut = code.indexOf(';\nconst ROUTES=');
if (cut < 0) throw new Error('ROUTES marker not found in worker');
const LIVE = JSON.parse(code.slice('const FILES='.length, cut));
const tail = code.slice(cut);

// 2) البناء من المستودع
const F = build();
const missing = Object.keys(LIVE).filter(k => !(k in F));
if (missing.length) throw new Error('files on the live site are missing from web/: ' + missing.join(', '));

// 3) المقارنة مع المنشور: أي ملف اتغيّر؟ (sw.js بنقارنه من غير رقم الإصدار)
const strip = s => s.replace(/wird-v\d+/g, 'wird-v');
const changed = Object.keys(F).filter(k => !LIVE[k] || LIVE[k][0] !== F[k][0] || strip(LIVE[k][1]) !== strip(F[k][1]));
const added = Object.keys(F).filter(k => !LIVE[k]);
console.log(changed.length ? 'changed: ' + changed.map(k => `${k} (${LIVE[k] ? LIVE[k][1].length : 0} → ${F[k][1].length})`).join(', ') : 'identical to the live site');
if (added.length) console.log('new files: ' + added.join(', '));

// 4) إصدار الكاش: يزيد فقط لو فيه تغيير، عشان المستخدمين ياخدوا النسخة الجديدة
const liveVer = +((LIVE['sw.js'][1].match(/wird-v(\d+)/) || [])[1] || 0);
const ver = changed.length ? liveVer + 1 : liveVer;
F['sw.js'][1] = F['sw.js'][1].replace(/wird-v\d+/g, 'wird-v' + ver);
console.log('sw.js: wird-v' + ver);

const out = 'const FILES=' + JSON.stringify(F) + tail;
await import('data:text/javascript;base64,' + Buffer.from(out).toString('base64')).catch(e => { if (e instanceof SyntaxError) throw new Error('built code does not parse: ' + e.message); console.log('note:', e.message); });
console.log('built', out.length, 'bytes');

// 5) نسخة من الملفات (المنشورة قبل + الجديدة) في site-source — ملفات الواجهة فقط
{
  const root = here + '../site-source/';
  const SECRET = /-----BEGIN [A-Z ]*PRIVATE KEY-----|\bsk_(live|test)_|\bghp_[A-Za-z0-9]{20,}|CLOUDFLARE_API_TOKEN|"privateKey"\s*:|\bVAPID_PRIVATE/;
  const skipped = [];
  const dump = (dir, files) => {
    const index = {};
    for (const [name, [type, text]] of Object.entries(files)) {
      if (SECRET.test(text)) { skipped.push(dir + name); continue; }
      const path = root + dir + name.replace(/^\/+/, '').replace(/\.\.+/g, '_');
      fs.mkdirSync(path.slice(0, path.lastIndexOf('/') + 1), { recursive: true });
      fs.writeFileSync(path, text);
      index[name] = { type, bytes: text.length };
    }
    fs.writeFileSync(root + dir + '_index.json', JSON.stringify(index, null, 1));
  };
  fs.rmSync(root, { recursive: true, force: true });
  dump('original/', LIVE);
  dump('live/', F);
  console.log('snapshot: site-source written', skipped.length ? '(skipped for safety: ' + skipped.join(', ') + ')' : '');
}
if (DRY) { console.log('dry run: nothing deployed'); process.exit(0); }
if (!changed.length) { console.log('nothing changed: skipping upload'); process.exit(0); }

// 6) Worker azkar
await retry('worker upload', async () => {
  const fd = new FormData();
  fd.append('metadata', new Blob([JSON.stringify({
    main_module: 'worker.js', compatibility_date: '2024-09-23', compatibility_flags: ['nodejs_compat'],
    bindings: [{ type: 'd1', name: d1.name, id: d1.id || d1.database_id }, { type: 'service', name: 'SELF', service: 'azkar' }],
    keep_bindings: ['secret_text'],
  })], { type: 'application/json' }));
  fd.append('worker.js', new Blob([out], { type: 'application/javascript+module' }), 'worker.js');
  return cf('/workers/scripts/azkar', { method: 'PUT', body: fd });
});
console.log('worker azkar: deployed');

// 7) Pages wird-azkar
const r = await retry('pages upload', () => {
  const fd = new FormData();
  fd.append('manifest', fs.readFileSync(here + 'assets.json', 'utf8'));
  fd.append('branch', 'main');
  fd.append('_worker.js', new Blob([out], { type: 'application/javascript+module' }), '_worker.js');
  return cf('/pages/projects/wird-azkar/deployments', { method: 'POST', body: fd });
});
console.log('pages: deployed', r.url || r.id);
