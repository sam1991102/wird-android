// يبني ملفات موقع وِرد من المستودع: web/site + أجزاء ui.js من web/ui + أجزاء styles.css من web/css
// الترتيب والأنواع في web/manifest.json. الناتج: { name: [contentType, body] } بنفس شكل FILES في الـ Worker.
import fs from 'node:fs';
import { check as themeCheck } from './theme-lint.mjs';
import { check as uiCheck } from './ui-lint.mjs';

const W = new URL('.', import.meta.url).pathname;
const read = p => fs.readFileSync(W + p, 'utf8');

export const isBin = t => /^(image\/(png|jpe?g|webp|gif|x-icon|vnd\.microsoft\.icon)|font\/|application\/(octet-stream|font|x-font))/.test(t);

export function build() {
  /* قفل الألوان: أي لون جديد مكتوب بقيمته في css/ بيوقف البناء (النشر وتطبيق أندرويد). التفاصيل: css/README.md */
  const tc = themeCheck();
  if (!tc.ok) throw new Error(tc.msg);
  /* قفل الأداء: مراقب أو مؤقّت مستقل جديد في ui/ بيوقف البناء. التفاصيل: ui-lint.mjs */
  const uc = uiCheck();
  if (!uc.ok) throw new Error(uc.msg);
  const m = JSON.parse(read('manifest.json'));
  const F = {};
  for (const f of m.files) {
    if (f.name === 'ui.js') F[f.name] = [f.type, m.ui.map(p => read('ui/' + p)).join('')];
    else if (f.name === 'styles.css') F[f.name] = [f.type, m.css.map(p => read('css/' + p)).join('')];
    // الصور والخطوط محفوظة base64؛ العنصر التالت (1) بيقول للـ Worker يفكّها لبايتات قبل ما يبعتها
    else F[f.name] = isBin(f.type) ? [f.type, read('site/' + f.name), 1] : [f.type, read('site/' + f.name)];
  }
  return F;
}
