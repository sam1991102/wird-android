// يجهّز نسخة الموقع اللي بتتحط جوه تطبيق الأندرويد (مجلد www/) عشان يفتح من غير إنترنت.
// - ملفات الموقع من build() (نفس اللي بيتنشر بالظبط).
// - صفحات المصحف وصور og والأيقونات من ملفات Cloudflare Pages الثابتة (web-deploy/assets.json)،
//   بتتنزّل من الموقع الحي، وكل ملف بيتأكد إنه سليم (JSON أو صورة).
// - www/app-files.json: قائمة كل اللي جوه التطبيق، كود الأندرويد بيستخدمها عشان يعرف إيه يتخدم من الجهاز.
// الاستخدام: node web/app-bundle.mjs   (من جذر المستودع، محتاج إنترنت للملفات الثابتة)
import fs from 'node:fs';
import path from 'node:path';
import { build } from './build.mjs';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const OUT = path.join(ROOT, 'www');
const SITE = 'https://wird-azkar.pages.dev';

fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });
const put = (rel, buf) => { const f = path.join(OUT, rel); fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, buf) };
const files = new Set();

// ١) ملفات الموقع
const site = build();
for (const [name, [, body, bin]] of Object.entries(site)) {
  put(name, bin ? Buffer.from(body, 'base64') : Buffer.from(body, 'utf8'));
  files.add('/' + name);
}

// ١أ) رقم نسخة التطبيق: نفس رقم البناء اللي بيتحط في versionCode واسم الإصدار v1.0.N، عشان «تحقق من التحديث» جوه التطبيق يقارنه بآخر إصدار على GitHub
put('app-version.json', Buffer.from(JSON.stringify({ code: +(process.env.GITHUB_RUN_NUMBER || 0) })));
files.add('/app-version.json');

// ١ب) المصحف المدني (صفحات + خطوط) والتفسير الميسر من المستودع نفسه: app-data/qdata (tools/fetch-quran-data.mjs)
const QD = path.join(ROOT, 'app-data/qdata');
if (!process.env.SKIP_STATIC) {
  const walk = d => fs.readdirSync(d, { withFileTypes: true }).flatMap(e => e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]);
  const q = fs.existsSync(QD) ? walk(QD) : [];
  const nP = q.filter(f => /\/p\/\d+\.json$/.test(f)).length, nF = q.filter(f => /\.woff2$/.test(f)).length, nT = q.filter(f => /\/t\/\d+\.json$/.test(f)).length;
  if (nP !== 604 || nF !== 604 || nT !== 114) { console.error(`app-data/qdata ناقص: صفحات ${nP}/604، خطوط ${nF}/604، تفسير ${nT}/114`); process.exit(1) }
  for (const f of q) { const rel = '/qdata/' + path.relative(QD, f).split(path.sep).join('/'); put(rel.slice(1), fs.readFileSync(f)); files.add(rel) }
  console.log('qdata:', q.length, 'files');
}

// ٢) الملفات الثابتة (المصحف وغيره) — بنحاول كل ملف ٣ مرات، ونتأكد إنه سليم
const assets = JSON.parse(fs.readFileSync(path.join(ROOT, 'web-deploy/assets.json'), 'utf8'));
// SKIP_STATIC=1 للتجربة المحلية من غير إنترنت (ملفات الموقع بس)
const want = process.env.SKIP_STATIC ? [] : Object.entries(assets);
let ok = 0; const failed = [];
// الأرقام في assets.json بصمات Cloudflare (مش md5)، فبنتأكد من الملف نفسه: JSON سليم، أو صورة بترويسة صحيحة
function check(p, b) {
  if (b.length < 16) throw new Error('empty');
  if (p.endsWith('.json')) JSON.parse(b.toString('utf8'));
  else if (p.endsWith('.png') && b.readUInt32BE(0) !== 0x89504e47) throw new Error('not png');
  else if (/\.jpe?g$/.test(p) && b.readUInt16BE(0) !== 0xffd8) throw new Error('not jpeg');
  else if (p.endsWith('.ico') && b.readUInt32BE(0) !== 0x00000100 && b.readUInt32BE(0) !== 0x89504e47) throw new Error('not ico'); // ico أو png بامتداد ico
}
async function get(p) {
  for (let i = 0; i < 3; i++) {
    try {
      const r = await fetch(SITE + p, { headers: { 'cache-control': 'no-cache' } });
      if (!r.ok) throw new Error('HTTP ' + r.status);
      const b = Buffer.from(await r.arrayBuffer());
      check(p, b);
      return b;
    } catch (e) { if (i === 2) throw e; await new Promise(r => setTimeout(r, 800 * (i + 1))) }
  }
}
const queue = want.slice();
await Promise.all(Array.from({ length: 8 }, async () => {
  for (let it; (it = queue.shift());) {
    const [p] = it;
    try { put(p.slice(1), await get(p)); files.add(p); ok++ } catch (e) { failed.push(p + ' (' + e.message + ')') }
  }
}));

// المصحف لازم يكون كامل؛ غير كده التطبيق هيقول إنه شغال من غير إنترنت وهو مش كده
const missingMushaf = failed.filter(f => f.startsWith('/mushaf/'));
if (missingMushaf.length) { console.error('mushaf files missing:\n' + missingMushaf.join('\n')); process.exit(1) }
if (failed.length) console.warn('static files skipped (served from the network at runtime):\n' + failed.join('\n'));

put('app-files.json', Buffer.from(JSON.stringify([...files].sort())));
let bytes = 0; for (const p of files) bytes += fs.statSync(path.join(OUT, p.slice(1))).size;
console.log(`www ready: ${Object.keys(site).length} site files + ${ok}/${want.length} static files, ${(bytes / 1048576).toFixed(1)} MB`);
