// قفل الألوان: يعدّ الألوان المكتوبة بقيمتها (#hex / rgb / rgba / hsl) في ملفات التنسيق، برّه تعريف الرموز (--اسم: قيمة).
// العدد لكل ملف ما ينفعش يزيد عن المسجّل في theme-baseline.json — يعني أي لون جديد لازم ييجي من الرموز.
// لما تنقل ألوان قديمة للرموز، شغّل: node theme-lint.mjs --update  علشان العدد الجديد (الأقل) يتسجّل.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const HERE = path.dirname(fileURLToPath(import.meta.url));
const BASE = path.join(HERE, 'theme-baseline.json');
const RAW = /#[0-9a-fA-F]{3,8}\b|\b(?:rgba?|hsla?)\(/g;

export function count(css) {
  let n = 0;
  for (const m of css.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    for (const d of m[2].split(';')) {
      const i = d.indexOf(':'); if (i < 0) continue;
      const prop = d.slice(0, i).trim(); if (prop.startsWith('--')) continue; // تعريف رمز: مسموح
      const val = d.slice(i + 1).replace(/url\([^)]*\)/g, ''); // الصور المضمّنة مش ألوان واجهة
      n += (val.match(RAW) || []).length;
    }
  }
  return n;
}

export function check({ update = false } = {}) {
  const dir = path.join(HERE, 'css');
  const now = {};
  for (const f of fs.readdirSync(dir).filter(f => f.endsWith('.css')).sort()) now[f] = count(fs.readFileSync(path.join(dir, f), 'utf8'));
  if (update || !fs.existsSync(BASE)) { fs.writeFileSync(BASE, JSON.stringify(now, null, 1) + '\n'); return { ok: true, now, msg: 'اتسجّل العدد الحالي' }; }
  const base = JSON.parse(fs.readFileSync(BASE, 'utf8'));
  const bad = Object.entries(now).filter(([f, n]) => n > (base[f] ?? 0)).map(([f, n]) => `${f}: ${n} (المسموح ${base[f] ?? 0})`);
  return { ok: !bad.length, now, bad, msg: bad.length ? 'فيه ألوان جديدة مكتوبة بقيمتها — استخدم الرموز (var(--ink)، var(--paper)، var(--primary)...):\n  ' + bad.join('\n  ') : 'مفيش ألوان جديدة مكتوبة بقيمتها' };
}

if (import.meta.url === 'file://' + process.argv[1]) {
  const r = check({ update: process.argv.includes('--update') });
  const total = Object.values(r.now).reduce((a, b) => a + b, 0);
  console.log(r.msg, '| الإجمالي:', total);
  if (!r.ok) process.exit(1);
}
