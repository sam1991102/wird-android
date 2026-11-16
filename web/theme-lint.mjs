// قفل الرموز: يعدّ في ملفات التنسيق، برّه تعريف الرموز (--اسم: قيمة)، القيم المكتوبة بإيدها بدل الرمز:
//   color  — ألوان (#hex / rgb / hsl)               ← استخدم var(--ink) ...
//   font   — font-size بـpx/rem                    ← استخدم var(--t-xs .. --t-4xl)
//   radius — border-radius بـpx/rem (غير 0 و50%)   ← استخدم var(--rd-2xs .. --rd-xl / --rd-pill)
// العدد لكل ملف ولكل نوع ما ينفعش يزيد عن المسجّل في theme-baseline.json.
// لما تنقل قيم قديمة للرموز، شغّل: node theme-lint.mjs --update  علشان العدد الجديد (الأقل) يتسجّل.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const HERE = path.dirname(fileURLToPath(import.meta.url));
const BASE = path.join(HERE, 'theme-baseline.json');
const RAW = /#[0-9a-fA-F]{3,8}\b|\b(?:rgba?|hsla?)\(/g;

const LEN = /(?:^|[\s,/])-?(?:\d*\.)?\d+(?:px|rem)\b/;
export function count(css) {
  const n = { color: 0, font: 0, radius: 0 };
  for (const m of css.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    for (const d of m[2].split(';')) {
      const i = d.indexOf(':'); if (i < 0) continue;
      const prop = d.slice(0, i).trim(); if (prop.startsWith('--')) continue; // تعريف رمز: مسموح
      const val = d.slice(i + 1).replace(/url\([^)]*\)/g, ''); // الصور المضمّنة مش ألوان واجهة
      n.color += (val.match(RAW) || []).length;
      if (/calc|clamp|min\(|max\(/.test(val)) continue; // قيم محسوبة عن قصد
      if (prop === 'font-size' && LEN.test(val)) n.font++;
      if (prop === 'border-radius' && LEN.test(val.replace(/\b0(px)?\b/g, ''))) n.radius++;
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
  const AR = { color: 'لون', font: 'حجم خط', radius: 'استدارة' };
  const bad = [];
  for (const [f, n] of Object.entries(now)) for (const k of Object.keys(n)) { const b = (base[f] || {})[k] ?? 0; if (n[k] > b) bad.push(`${f}: ${AR[k]} ${n[k]} (المسموح ${b})`) }
  return { ok: !bad.length, now, bad, msg: bad.length ? 'فيه قيم جديدة مكتوبة بإيدها — استخدم الرموز (الألوان var(--ink)…، الخط var(--t-md)…، الاستدارة var(--rd-s)…):\n  ' + bad.join('\n  ') : 'مفيش قيم جديدة مكتوبة بإيدها' };
}

if (import.meta.url === 'file://' + process.argv[1]) {
  const r = check({ update: process.argv.includes('--update') });
  const t = k => Object.values(r.now).reduce((a, b) => a + b[k], 0);
  console.log(r.msg, `| ألوان ${t('color')} · أحجام خط ${t('font')} · استدارة ${t('radius')}`);
  if (!r.ok) process.exit(1);
}
