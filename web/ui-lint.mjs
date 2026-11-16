// قفل الأداء: يعدّ في ui/ المراقبين والمؤقّتات المستقلّين. الطبيعي إن أي وحدة تستخدم المشترك من ui/00b-dom.js:
//   __wOnDom(fn)  بدل  new MutationObserver(fn).observe(document.body,{childList:true,subtree:true})
//   __wOnView(fn) بدل  مراقبة data-view
//   __wEverySec(fn) بدل setInterval(fn,1000)
// العدد لكل ملف ما ينفعش يزيد عن المسجّل في ui-baseline.json. لما تقلّله: node ui-lint.mjs --update
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const HERE = path.dirname(fileURLToPath(import.meta.url));
const BASE = path.join(HERE, 'ui-baseline.json');
const files = d => fs.readdirSync(d, { withFileTypes: true }).flatMap(e => e.isDirectory() ? files(path.join(d, e.name)) : e.name.endsWith('.js') ? [path.join(d, e.name)] : []);
export function count(src) { return { observer: (src.match(/new MutationObserver\(/g) || []).length, interval: (src.match(/\bsetInterval\(/g) || []).length } }
export function check({ update = false } = {}) {
  const dir = path.join(HERE, 'ui'), now = {};
  for (const f of files(dir).sort()) { if (f.endsWith('00b-dom.js')) continue; const c = count(fs.readFileSync(f, 'utf8')); if (c.observer || c.interval) now[path.relative(dir, f)] = c }
  if (update || !fs.existsSync(BASE)) { fs.writeFileSync(BASE, JSON.stringify(now, null, 1) + '\n'); return { ok: true, now, msg: 'اتسجّل العدد الحالي' } }
  const base = JSON.parse(fs.readFileSync(BASE, 'utf8')), bad = [];
  for (const [f, c] of Object.entries(now)) for (const k of Object.keys(c)) { const b = (base[f] || {})[k] ?? 0; if (c[k] > b) bad.push(`${f}: ${k === 'observer' ? 'مراقب' : 'مؤقّت'} ${c[k]} (المسموح ${b})`) }
  return { ok: !bad.length, now, msg: bad.length ? 'فيه مراقب/مؤقّت جديد مستقل — استخدم __wOnDom / __wOnView / __wEverySec من ui/00b-dom.js:\n  ' + bad.join('\n  ') : 'مفيش مراقبين أو مؤقّتات جديدة' };
}
if (import.meta.url === 'file://' + process.argv[1]) {
  const r = check({ update: process.argv.includes('--update') });
  const t = k => Object.values(r.now).reduce((a, b) => a + b[k], 0);
  console.log(r.msg, `| مراقبين ${t('observer')} · مؤقّتات ${t('interval')}`);
  if (!r.ok) process.exit(1);
}
