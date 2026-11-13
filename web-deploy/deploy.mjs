// ينشر موقع وِرد: يقرأ كود الـ Worker المنشور حاليًا، يطبّق التعديلات، ثم ينشره على Worker «azkar» ومشروع Pages «wird-azkar».
// يحتاج متغير CLOUDFLARE_API_TOKEN (من أسرار GitHub). التعديلات قابلة للتكرار: لا تُطبَّق مرتين.
import fs from 'node:fs';

const ACCT = '449a8fdc919c21ae6200bd06af5ab541';
const API = `https://api.cloudflare.com/client/v4/accounts/${ACCT}`;
const TOKEN = process.env.CLOUDFLARE_API_TOKEN;
if (!TOKEN) { console.error('::error::CLOUDFLARE_API_TOKEN secret is missing'); process.exit(1); }
const H = { Authorization: `Bearer ${TOKEN}` };
const DRY = process.argv.includes('--dry');
const here = new URL('.', import.meta.url).pathname;

async function cf(path, init = {}) {
  const r = await fetch(API + path, { ...init, headers: { ...H, ...(init.headers || {}) } });
  const t = await r.text();
  let j; try { j = JSON.parse(t); } catch { throw new Error(`${path} → ${r.status}: ${t.slice(0, 300)}`); }
  if (!j.success) throw new Error(`${path} → ${JSON.stringify(j.errors)}`);
  return j.result;
}

// 1) الكود الحالي + ربط قاعدة البيانات
const settings = await cf('/workers/scripts/azkar/settings');
const d1 = (settings.bindings || []).find(b => b.type === 'd1');
if (!d1) throw new Error('D1 binding not found on worker azkar');
const res = await fetch(API + '/workers/scripts/azkar/content/v2', { headers: H });
if (!res.ok) throw new Error('content fetch ' + res.status + ' ' + (await res.text()).slice(0, 200));
let code;
const ct = res.headers.get('content-type') || '';
if (ct.includes('multipart')) {
  const fd = await res.formData();
  for (const [k, v] of fd) if (typeof v !== 'string' && /\.m?js$/.test(v.name || k)) { code = await v.text(); break; }
} else code = await res.text();
if (!code || !code.startsWith('const FILES=')) throw new Error('unexpected worker content: ' + String(code).slice(0, 80));

const cut = code.indexOf(';\nconst ROUTES=');
const F = JSON.parse(code.slice('const FILES='.length, cut));
const tail = code.slice(cut);
const log = [];
const rep = (file, a, b) => {
  const s = F[file][1];
  if (s.includes(b)) return log.push(`${file}: already`);
  if (!s.includes(a)) throw new Error(`${file}: anchor not found: ${a.slice(0, 60)}`);
  F[file][1] = s.replace(a, b); log.push(`${file}: patched`);
};
const append = (file, mark, text) => {
  if (F[file][1].includes(mark)) return log.push(`${file}: ${mark} already`);
  F[file][1] += text; log.push(`${file}: + ${mark}`);
};

// يستبدل كتلة مُلحقة سابقًا (من علامتها حتى بداية الكتلة التالية) بالنسخة الجديدة
const upsert = (file, mark, text) => {
  const s = F[file][1], i = s.indexOf(mark);
  if (i < 0) { F[file][1] += text; return log.push(`${file}: + ${mark}`); }
  const start = s.lastIndexOf('\n', i);
  const re = /\n\/\*[a-z0-9-]+\*\//g; re.lastIndex = i + mark.length; const mm = re.exec(s); const end = mm ? mm.index : s.length;
  const old = s.slice(start, end);
  if (old.trim() === text.trim()) return log.push(`${file}: ${mark} same`);
  F[file][1] = s.slice(0, start) + text.replace(/\n$/, '') + s.slice(end); log.push(`${file}: ~ ${mark}`);
};

// 2) التعديلات
// مواقيت دقيقة: بدون دقيقة احتياط للظهر والمغرب
rep('app.js', 'dhuhr:m(y.dhuhr)+1/60', 'dhuhr:m(y.dhuhr)');
rep('app.js', 'maghrib:m(y.maghrib)+1/60', 'maghrib:m(y.maghrib)');
// تقريب الثواني كالتقويم: الشروق لأسفل، الظهر لأقرب دقيقة، والباقي لأعلى
const ADJ = 'for(const _k in _j)if(isFinite(_t[_k])&&+_j[_k])_t[_k]+=(+_j[_k])/60;';
rep('app.js', ADJ, ADJ + 'for(const _k in _t)if(isFinite(_t[_k])){const _m=_t[_k]*60,_r=_k==="sunrise"?Math.floor(_m+1e-6):_k==="dhuhr"?Math.round(_m):Math.ceil(_m-1e-6);_t[_k]=_r/60}');
// تطبيق أندرويد: أذان كل صلاة حسب اختيارها
rep('app.js', 'for(let t=0;t<2;t++){const t=t=>t/24;', 'for(let t=0;t<6;t++){const t=t=>t/24;');
rep('app.js', 'return $.isha=u.ishaMin?$.maghrib+u.ishaMin/60:m(y.isha),$}', 'var _im=u.ishaMin;try{if(_im===90&&new Intl.DateTimeFormat("en-u-ca-islamic-umalqura",{month:"numeric",timeZone:"UTC"}).format(new Date(Date.UTC(r,i-1,o,12)))==="9")_im=120}catch(_e){}$.isha=_im?$.maghrib+_im/60:m(y.isha);var _N=24-($.maghrib-$.sunrise);if(u.fajr){var _pf=u.fajr/60*_N;if(!isFinite($.fajr)||$.sunrise-$.fajr>_pf)$.fajr=$.sunrise-_pf}if(u.isha){var _pi=u.isha/60*_N;if(!isFinite($.isha)||$.isha-$.maghrib>_pi)$.isha=$.maghrib+_pi}return $}');
rep('ui.js', 'function addAll(){const $=s=>ov.querySelector(s)', 'function addAll(){const $=s=>ov.querySelector(s)||document.querySelector(s)');
rep('index.html', 'r="adhan"===e?c("adhan-fajr"===n):""',
  'r="adhan"===e?(window.__adhanFor?function(p){try{var S=JSON.parse(localStorage.getItem("wird-push")||"{}"),q=(S.cfg&&S.cfg[p]&&S.cfg[p].sound)||S.sound;return!q||"none"===q?"":window.__adhanFor(p,q)||""}catch(x){return c("fajr"===p)}}(n.slice(6)):c("adhan-fajr"===n)):""');
// صفحة الإعدادات الجديدة + مرآة بيانات الويدجت
{ const _u = fs.readFileSync(here + 'append-ui.js', 'utf8'); const _k = _u.indexOf('\n/*w-mirror*/');
  upsert('ui.js', '/*st-hub*/', _u.slice(0, _k)); upsert('ui.js', '/*w-mirror*/', _u.slice(_k)); }
// صفحات الإعدادات الفرعية (تذكير الصيام/الذكر): عنصر بديل بنفس المعرّف حتى لا يعيد كود الترتيب القسم إلى مكانه
rep('ui.js', 'var ph=document.createComment("sh");', 'var ph=sec.classList.contains("st-sub")?Object.assign(document.createElement("section"),{id:id,hidden:true,className:"st-sec st-sub sh-ph"}):document.createComment("sh");');
upsert('ui.js', '/*icons*/', fs.readFileSync(here + 'append-icons.js', 'utf8'));
upsert('styles.css', '/*icons*/', fs.readFileSync(here + 'append-icons.css', 'utf8'));
upsert('ui.js', '/*ios2*/', fs.readFileSync(here + 'append-ios2.js', 'utf8'));
upsert('styles.css', '/*ios2*/', fs.readFileSync(here + 'append-ios2.css', 'utf8'));
upsert('ui.js', '/*radio*/', fs.readFileSync(here + 'append-radio.js', 'utf8'));
upsert('styles.css', '/*radio*/', fs.readFileSync(here + 'append-radio.css', 'utf8'));
upsert('ui.js', '/*skin-ios*/', fs.readFileSync(here + 'append-skin.js', 'utf8'));
upsert('styles.css', '/*skin-ios*/', fs.readFileSync(here + 'append-ios.css', 'utf8'));
rep('index.html', '<script id="wird-native">', '<script>try{localStorage.getItem("wird-skin")==="ios"&&document.documentElement.classList.add("ios")}catch(e){}</script><script id="wird-native">');
rep('ui.js', '(st.s==="night"?moonSVG(d):', '(st.s==="night"?moonSVG(((Date.now()/864e5-10962.76)%29.530589+29.530589)%29.530589):');
upsert('ui.js', '/*nshare*/', fs.readFileSync(here + 'append-share.js', 'utf8'));
append('ui.js', '/*sh-seg*/', fs.readFileSync(here + 'append-seg.js', 'utf8'));
upsert('ui.js', '/*w-ongoing*/', fs.readFileSync(here + 'append-ongoing.js', 'utf8'));
append('styles.css', '/*st-hub*/', fs.readFileSync(here + 'append-styles.css', 'utf8'));
// إصدار الكاش
const m = F['sw.js'][1].match(/wird-v(\d+)/);
const ver = Math.max(+m[1] + 1, 287);
// سياسة الخصوصية: قسم تطبيق أندرويد والخدمات الخارجية
{ const k = F['privacy.html'] ? 'privacy.html' : null;
  if (k && !F[k][1].includes('id="android-app"')) {
    const sec = fs.readFileSync(here + 'privacy-android.html', 'utf8');
    const h = F[k][1], at = h.includes('</main>') ? '</main>' : h.includes('</article>') ? '</article>' : '</body>';
    F[k][1] = h.replace(at, sec + at); log.push('privacy.html: + android section');
  } else log.push('privacy.html: ' + (k ? 'already' : 'not in worker files (skipped)')); }
F['sw.js'][1] = F['sw.js'][1].replace(/wird-v\d+/, 'wird-v' + ver);
log.push('sw.js: wird-v' + ver);
console.log(log.join('\n'));

const out = 'const FILES=' + JSON.stringify(F) + tail;
await import('data:text/javascript;base64,' + Buffer.from(out).toString('base64')).catch(e => { if (e instanceof SyntaxError) throw new Error('built code does not parse: ' + e.message); console.log('note:', e.message); });
console.log('built', out.length, 'bytes');
if (DRY) process.exit(0);

// 3) Worker azkar
{
  const fd = new FormData();
  fd.append('metadata', new Blob([JSON.stringify({
    main_module: 'worker.js', compatibility_date: '2024-09-23', compatibility_flags: ['nodejs_compat'],
    bindings: [{ type: 'd1', name: d1.name, id: d1.id || d1.database_id }, { type: 'service', name: 'SELF', service: 'azkar' }],
    keep_bindings: ['secret_text'],
  })], { type: 'application/json' }));
  fd.append('worker.js', new Blob([out], { type: 'application/javascript+module' }), 'worker.js');
  await cf('/workers/scripts/azkar', { method: 'PUT', body: fd });
  console.log('worker azkar: deployed');
}
// 4) Pages wird-azkar
{
  const fd = new FormData();
  fd.append('manifest', fs.readFileSync(here + 'assets.json', 'utf8'));
  fd.append('branch', 'main');
  fd.append('_worker.js', new Blob([out], { type: 'application/javascript+module' }), '_worker.js');
  const r = await cf('/pages/projects/wird-azkar/deployments', { method: 'POST', body: fd });
  console.log('pages: deployed', r.url || r.id);
}
