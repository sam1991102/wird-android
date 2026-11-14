// يبني ملفات موقع وِرد من المستودع: web/site + أجزاء ui.js من web/ui + أجزاء styles.css من web/css
// الترتيب والأنواع في web/manifest.json. الناتج: { name: [contentType, body] } بنفس شكل FILES في الـ Worker.
import fs from 'node:fs';

const W = new URL('.', import.meta.url).pathname;
const read = p => fs.readFileSync(W + p, 'utf8');

export function build() {
  const m = JSON.parse(read('manifest.json'));
  const F = {};
  for (const f of m.files) {
    if (f.name === 'ui.js') F[f.name] = [f.type, m.ui.map(p => read('ui/' + p)).join('')];
    else if (f.name === 'styles.css') F[f.name] = [f.type, m.css.map(p => read('css/' + p)).join('')];
    else F[f.name] = [f.type, read('site/' + f.name)];
  }
  return F;
}
