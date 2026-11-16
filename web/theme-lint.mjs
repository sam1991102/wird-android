// قفل الرموز: يعدّ في ملفات التنسيق، برّه تعريف الرموز (--اسم: قيمة)، القيم المكتوبة بإيدها بدل الرمز:
//   color  — ألوان (#hex / rgb / hsl)               ← استخدم var(--ink) ...
//   font   — font-size بـpx/rem                    ← استخدم var(--t-xs .. --t-4xl)
//   radius — border-radius بـpx/rem (غير 0 و50%)   ← استخدم var(--rd-2xs .. --rd-xl / --rd-pill)
//   space  — padding/margin/gap بـpx/rem (غير 0 و1px) ← استخدم var(--s2 .. --s48)
// العدد لكل ملف ولكل نوع ما ينفعش يزيد عن المسجّل في theme-baseline.json.
// لما تنقل قيم قديمة للرموز، شغّل: node theme-lint.mjs --update  علشان العدد الجديد (الأقل) يتسجّل.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const HERE = path.dirname(fileURLToPath(import.meta.url));
const BASE = path.join(HERE, 'theme-baseline.json');
const RAW = /#[0-9a-fA-F]{3,8}\b|\b(?:rgba?|hsla?)\(/g;

// أجزاء ليها ألوانها الخاصة عن قصد (ورق المصحف ووضعه الليلي، السما ورسوم الرئيسية حسب الوقت، ركن الأطفال،
// شاشة الأذان، شاشة البداية والمعالج، وضع التركيز الهادي، زرار المفضّلة، شريط الآيفون الشفاف). مش بتتعد في القفل.
export const EXEMPT = /mp-|sky-|\bsk-|\bda-|\bkd-|adhan|\baz-|#wSplash|\bsu-|\bwsu|calm|favorite-button|\.onb\b|\boa-|rd-fav|qx-|\.ios(\.dark)? \.(topbar|bottom-nav)\b|dr-ic\b|#fActs|tl-cel|\.lp-ov|\.focus|#focus|#fStage|pt-(dawn|day|sunset|night)|tl-medal|\.qx\b/;
const SPACE = /^(padding|margin|gap|row-gap|column-gap)(-[a-z-]+)?$/;
const LEN = /(?:^|[\s,/])-?(?:\d*\.)?\d+(?:px|rem)\b/;
export function count(css) {
  const n = { color: 0, font: 0, radius: 0, space: 0 };
  for (const m of css.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    const ex = EXEMPT.test(m[1]);
    for (const d of m[2].split(';')) {
      const i = d.indexOf(':'); if (i < 0) continue;
      const prop = d.slice(0, i).replace(/\/\*[\s\S]*?\*\//g, '').trim(); if (prop.startsWith('--') || /mask/.test(prop)) continue; // تعريف رمز، أو قناع (مش لون)
      const val = d.slice(i + 1).replace(/url\([^)]*\)/g, ''); // الصور المضمّنة مش ألوان واجهة
      if (!ex) n.color += (val.match(RAW) || []).length;
      if (/calc|clamp|min\(|max\(/.test(val)) continue; // قيم محسوبة عن قصد
      if (ex) continue; // الأجزاء المتصمّمة بمقاساتها كمان
      if (prop === 'font-size' && LEN.test(val)) n.font++;
      if (prop === 'border-radius' && LEN.test(val.replace(/\b0(px)?\b/g, ''))) n.radius++;
      if (SPACE.test(prop) && LEN.test(val.replace(/(^|\s)-?(0|1px)(?=\s|$)/g, ' '))) n.space++;
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
  const AR = { color: 'لون', font: 'حجم خط', radius: 'استدارة', space: 'مسافة' };
  const bad = [];
  for (const [f, n] of Object.entries(now)) for (const k of Object.keys(n)) { const b = (base[f] || {})[k] ?? 0; if (n[k] > b) bad.push(`${f}: ${AR[k]} ${n[k]} (المسموح ${b})`) }
  return { ok: !bad.length, now, bad, msg: bad.length ? 'فيه قيم جديدة مكتوبة بإيدها — استخدم الرموز (الألوان var(--ink)…، الخط var(--t-md)…، الاستدارة var(--rd-s)…، المسافات var(--s12)…):\n  ' + bad.join('\n  ') : 'مفيش قيم جديدة مكتوبة بإيدها' };
}

if (import.meta.url === 'file://' + process.argv[1]) {
  const r = check({ update: process.argv.includes('--update') });
  const t = k => Object.values(r.now).reduce((a, b) => a + b[k], 0);
  console.log(r.msg, `| ألوان ${t('color')} · أحجام خط ${t('font')} · استدارة ${t('radius')} · مسافات ${t('space')}`);
  if (!r.ok) process.exit(1);
}
