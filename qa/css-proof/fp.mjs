// أداة «البصمة»: تثبت إن حذف قواعد CSS مش بيغيّر أي حاجة.
// لكل حالة (مظهر × مقاس × شاشة) بنسجّل الشكل النهائي لكل عنصر ظاهر (والـ ::before/::after)،
// وبعدين نجرّب نشيل مجموعات من التصريحات؛ لو البصمة اتغيّرت نقسم المجموعة لحد ما نلاقي المسؤول.
// الاستخدام: node fp.mjs <ملف أو أكتر من css/> [--imp] [--states=quick]
//   --imp : بدل حذف التصريح كله، نجرّب نشيل كلمة !important بس
import fs from 'node:fs';
const { chromium } = await import('/tmp/node_modules/playwright-core/index.mjs');
import { createRequire } from 'node:module'; const ct = createRequire(import.meta.url)('/tmp/node_modules/css-tree');
const W = '/home/claude/wird-android/web/', SITE = 'http://localhost:8787/';
const args = process.argv.slice(2), IMP = args.includes('--imp'), QUICK = args.includes('--states=quick');
const targets = args.filter(a => !a.startsWith('--'));
const M = JSON.parse(fs.readFileSync(W + 'manifest.json', 'utf8'));
const parts = M.css.map(p => [p, fs.readFileSync(W + 'css/' + p, 'utf8')]);
const FULL = parts.map(p => p[1]).join('');
// ── المرشّحين: كل تصريح في الملفات المطلوبة، بمكانه في النص الكامل
let off = 0; const cands = []; let skippedState = 0;
const STATE_RE = /st-open|wp-open|nav-off|ws-skip|\.in\b|\.open\b|\.show\b|\.is-open|\.closing|\.leav|\[hidden\]|:not\(\[hidden\]\)|\.splash|#wSplash|\.sh-ph|\.wp-noanim|\.l2-sh|--l2sh/;
for (const [name, txt] of parts) {
  if (targets.includes(name)) {
    const ast = ct.parse(txt, { positions: true });
    ct.walk(ast, { visit: 'Declaration', enter(d) {
      if (this.atrule && /keyframes/.test(this.atrule.name)) return;
      // ممنوع: الحركة والانتقال (البصمة بتوقفهم فمش هتشوف أثرهم)
      if (/^(transition|animation|will-change)/.test(d.property)) return;
      // ممنوع: قواعد لحظة الفتح/القفل — أثرها بيبان أثناء الانتقال بس، مش بعد ما الصفحة تستقر
      const sel = this.rule ? ct.generate(this.rule.prelude) : '';
      if (STATE_RE.test(sel)) { skippedState++; return; }
      if (IMP && !d.important) return;
      let s = d.loc.start.offset, e = d.loc.end.offset;
      if (IMP) { const seg = txt.slice(s, e); const k = seg.search(/\s*!\s*important\s*$/i); if (k < 0) return; s = s + k; }
      else { while (txt[e] === ' ') e++; if (txt[e] === ';') e++; }
      cands.push({ file: name, s: off + s, e: off + e, txt: txt.slice(IMP ? s : d.loc.start.offset, e) });
    } });
  }
  off += txt.length;
}
console.log('candidates:', cands.length, IMP ? '(!important flags)' : '(declarations)', ' skipped (open/close state rules):', skippedState);
// اختبار الأمان: القاعدة اللي عملت رعشة الإعدادات لازم ما تكونش مرشّحة
{ const canary = cands.filter(c => FULL.slice(Math.max(0, FULL.lastIndexOf('}', c.s) + 1), c.s).includes(':not(.st-open) .st')); if (canary.length) { console.log('CANARY FAILED: the settings anti-jump rule is a candidate'); process.exit(1) } else console.log('canary ok: anti-jump rule protected') }
const without = set => { const cs = [...set].map(i => cands[i]).sort((a, b) => b.s - a.s); let t = FULL; for (const c of cs) t = t.slice(0, c.s) + t.slice(c.e); return t };
// ── الحالات
const SK = { cl: ['classic', false], cd: ['classic', true], il: ['ios', false], id: ['ios', true] };
const VP = QUICK ? { m: [390, 844, true] } : { m: [390, 844, true], d: [1280, 860, false] };
const SET = ['notif', 'st-prayer', 'st-adhan', 'st-alarm', 'st-fast', 'st-dr', 'st-remind', 'st-look', 'st-qari', 'st-data', 'st-about'];
const SCREENS = [
  ['home', 'null'], ['home-scroll', 'scrollTo(0,900)'], ['library', '__wirdGo("library")'], ['list', '__wirdGo("library");setCategory("morning")'],
  ['mushaf', '__wirdGo("mushaf")'], ['prayer', '__wirdGo("prayer")'], ['prayer-scroll', '__wirdGo("prayer");scrollTo(0,800)'],
  ['radio', '__openRadio()'], ['settings', '__openSettings()'], ...SET.map(s => ['set:' + s, `__openSettingsPage("${s}")`]),
  ['drawer', '__openDrawer()'], ['search', '__openSearch()'], ['tools', '__openTools()'], ['kids', '__openKids()'], ['learn', '__openLearn()'],
  ['hajj', '__openHajj()'], ['hadith', '__openHadith()'], ['hijri', '__openHijri()'], ['qibla', '__openQibla()'], ['names', '__openNames&&__openNames()'],
  ['focus', '__wirdGo("library");setCategory("morning");document.querySelector("#adhkarList .dhikr-card, #adhkarList [data-id]")?.click()'],
  ['tasbih', '__wirdGo("tasbih")'], ['setup', '__openSetup&&__openSetup()'],
  ['adhan', 'window.__wirdAdhan&&__wirdAdhan.show?__wirdAdhan.show("dhuhr"):0'], ['alarm', 'window.__showAlarm&&__showAlarm()'],
];
const STATES = [];
for (const [sk, [skin, dark]] of Object.entries(SK)) for (const [vk, vp] of Object.entries(VP)) for (const [n, js] of SCREENS) STATES.push({ id: `${sk}-${vk}-${n}`, skin, dark, vp, js });
// ── البصمة (بتتنفّذ جوه الصفحة)
const FP = () => {
  const P = ['display', 'position', 'top', 'right', 'bottom', 'left', 'float', 'z-index', 'box-sizing', 'margin-top', 'margin-right', 'margin-bottom', 'margin-left',
    'padding-top', 'padding-right', 'padding-bottom', 'padding-left', 'border-top-width', 'border-right-width', 'border-bottom-width', 'border-left-width',
    'border-top-style', 'border-top-color', 'border-bottom-color', 'border-right-color', 'border-left-color', 'border-top-left-radius', 'border-top-right-radius', 'border-bottom-left-radius', 'border-bottom-right-radius',
    'color', 'background-color', 'background-image', 'background-size', 'background-position', 'box-shadow', 'opacity', 'visibility', 'transform', 'filter', 'backdrop-filter',
    'font-family', 'font-size', 'font-weight', 'font-style', 'line-height', 'letter-spacing', 'text-align', 'text-decoration-line', 'text-transform', 'white-space', 'text-overflow', 'direction',
    'overflow-x', 'overflow-y', 'flex-direction', 'flex-wrap', 'flex-grow', 'flex-shrink', 'flex-basis', 'justify-content', 'align-items', 'align-self', 'order', 'gap', 'row-gap', 'column-gap',
    'grid-template-columns', 'grid-template-rows', 'grid-column-start', 'grid-column-end', 'grid-row-start', 'grid-row-end', 'place-items',
    'width', 'height', 'min-width', 'min-height', 'max-width', 'max-height', 'aspect-ratio', 'object-fit', 'fill', 'stroke', 'stroke-width', 'outline-style', 'outline-color', 'outline-width',
    'cursor', 'pointer-events', 'user-select', 'content', 'clip-path', 'mask-image', '-webkit-line-clamp', 'scroll-snap-type', 'inset-inline-start', 'font-feature-settings', 'font-variant-numeric', 'touch-action', 'isolation', 'mix-blend-mode', 'writing-mode', 'vertical-align', 'list-style-type', 'text-shadow', 'word-break', 'hyphens', 'accent-color', 'appearance', 'scrollbar-width', 'will-change', 'contain'];
  const out = []; let i = 0;
  const walk = (el, path) => {
    for (const c of el.children) {
      const tag = c.tagName.toLowerCase(); if (tag === 'script' || tag === 'style' || tag === 'link' || tag === 'meta' || tag === 'head') continue;
      const p = path + '>' + tag + (c.id ? '#' + c.id : '') + '[' + (i++) + ']';
      const cs = getComputedStyle(c);
      if (cs.display === 'none') { out.push(p + '|none'); continue }
      const r = c.getBoundingClientRect();
      let s = p + '|' + Math.round(r.x) + ',' + Math.round(r.y) + ',' + Math.round(r.width) + ',' + Math.round(r.height) + '|' + P.map(k => cs.getPropertyValue(k)).join(';');
      for (const ps of ['::before', '::after', '::placeholder', '::marker']) { const q = getComputedStyle(c, ps); if (q.content && q.content !== 'none' && q.content !== 'normal') s += '|' + ps + P.map(k => q.getPropertyValue(k)).join(';') }
      out.push(s); walk(c, p);
    }
  };
  walk(document.documentElement, ''); out.push('html|' + getComputedStyle(document.documentElement).getPropertyValue('color-scheme') + '|' + scrollY);
  return out;
};
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--disable-gpu', '--font-render-hinting=none'] });
async function openState(st) {
  const c = await b.newContext({ viewport: { width: st.vp[0], height: st.vp[1] }, isMobile: st.vp[2], hasTouch: st.vp[2], colorScheme: st.dark ? 'dark' : 'light', reducedMotion: 'reduce' });
  await c.addInitScript(([skin, dark]) => {
    const S = (k, v) => localStorage.setItem(k, v);
    S('wird-setup-done', '1'); S('wird-onboarded', '1'); S('wird-skin', skin); S('wird-theme-mode', 'manual'); S('wird-dark', dark ? 'true' : 'false'); S('wird-theme-v2', '1');
    S('wird-welcome', String(Date.now())); S('wird-perm', '1'); window.__WIRD_NATIVE = 1;
  }, [st.skin, st.dark]);
  const p = await c.newPage();
  await p.clock.install({ time: new Date('2026-11-14T12:20:00+03:00') });
  await p.goto(SITE, { waitUntil: 'load' }); await p.clock.runFor(2500); await p.waitForTimeout(300);
  await p.evaluate(js => { try { (0, eval)(js) } catch (e) { } }, st.js).catch(() => { });
  await p.clock.runFor(1500); await p.waitForTimeout(200);
  await p.clock.pauseAt(new Date('2026-11-14T12:20:05+03:00')).catch(() => { });
  // نثبّت الصفحة: لا حركات، لا مؤشر كتابة، والـCSS بقى <style> نقدر نبدّله
  await p.evaluate(full => {
    const z = document.createElement('style'); z.id = 'fpz'; z.textContent = '*,*::before,*::after{transition:none!important;animation:none!important;caret-color:transparent!important}'; document.head.appendChild(z);
    const l = document.querySelector('link[href="/styles.css"]'); const f = document.createElement('style'); f.id = 'fpfont'; f.textContent = full[1]; l.after(f); const s = document.createElement('style'); s.id = 'fpcss'; s.textContent = full[0]; f.after(s); l.remove();
    document.activeElement && document.activeElement.blur && document.activeElement.blur();
  }, [FULL.replace(/@font-face\s*\{[^}]*\}/g, ''), (FULL.match(/@font-face\s*\{[^}]*\}/g) || []).join('\n')]);
  // نستنى الخطوط تخلص تحميل (غيرها عرض النص بيتغيّر بعد أول قياس)
  await p.evaluate(async () => { await document.fonts.ready; void document.body.offsetHeight });
  await p.waitForTimeout(150); await p.evaluate(async () => { await document.fonts.ready });
  return { c, p };
}
const FF = /@font-face\s*\{[^}]*\}/g, FONTS = (FULL.match(FF) || []).join('\n');
const setCSS = (p, t) => p.evaluate(t => { document.getElementById('fpcss').textContent = t; void document.body.offsetHeight }, t.replace(FF, ''));
const fp = p => p.evaluate(FP);
const eq = (a, b, mask) => { if (a.length !== b.length) return false; for (let i = 0; i < a.length; i++) if (a[i] !== b[i] && !mask.has(i)) return false; return true };
// ── التشغيل: لكل حالة نحتفظ بأكبر مجموعة آمنة «مع بعض» من اللي فضل آمن في الحالات اللي قبلها
const noisy = [], t0 = Date.now(); let tests = 0;
let pool = cands.map((_, i) => i);
async function runState(st, poolIn) {
  let o, c, p, base, mask;
  const boot = async () => {
    if (c) await c.close().catch(() => { });
    o = await openState(st); c = o.c; p = o.p;
    await setCSS(p, FULL); base = await fp(p); await p.waitForTimeout(300); await setCSS(p, FULL); const base2 = await fp(p);
    mask = new Set(); if (base.length !== base2.length) return false; base.forEach((x, i) => { if (x !== base2[i]) mask.add(i) }); return true;
  };
  try { if (!await boot()) { noisy.push(st.id); await c.close(); return poolIn } } catch (e) { console.log('skip', st.id, e.message.slice(0, 80)); return poolIn }
  let reboots = 0;
  const test = async set => {
    tests++; await setCSS(p, without(set)); const ok = eq(await fp(p), base, mask);
    if (!ok) { // نتأكد إن الصفحة رجعت زي ما كانت؛ لو لأ (كود اتفاعل وغيّرها) نعيد فتحها
      await setCSS(p, FULL); if (!eq(await fp(p), base, mask)) { reboots++; if (reboots > 25 || !await boot()) throw new Error('unstable') }
    }
    return ok };
  let acc = [];
  try {
    if (await test(poolIn)) acc = poolIn.slice();
    else { const add = async set => { if (!set.length) return; if (await test(acc.concat(set))) { acc = acc.concat(set); return } if (set.length === 1) return; const h = set.length >> 1; await add(set.slice(0, h)); await add(set.slice(h)) }; await add(poolIn) }
  } catch (e) { console.log('UNSTABLE', st.id, '— skipped, pool kept'); noisy.push(st.id); await c.close().catch(() => { }); return poolIn }
  if (reboots) console.log('  reboots', reboots);
  await c.close();
  process.stdout.write(`${st.id} mask=${mask.size} safe=${acc.length}/${cands.length} tests=${tests} ${((Date.now() - t0) / 1000) | 0}s\n`);
  return acc;
}
for (const st of STATES) pool = await runState(st, pool);
// لو الحذف المشترك أثّر على حالة اتعملت بدري، نعيد عليها لحد ما الكل يثبت
for (let round = 0; round < 3; round++) {
  let changed = false;
  for (const st of STATES) { const before = pool.length; pool = await runState(st, pool); if (pool.length !== before) changed = true }
  if (!changed) break;
}
const affecting = new Set(cands.map((_, i) => i).filter(i => !pool.includes(i)));
const ALL = cands.map((_, i) => i);
// ── تأكيد نهائي: نشيل كل الآمنين مرة واحدة ونعيد على كل الحالات
const safe = ALL.filter(i => !affecting.has(i));
console.log('\nsafe to remove:', safe.length, 'of', cands.length, ' noisy states:', noisy.join(',') || 'none');
const finalCSS = without(safe); let finalBad = [];
for (const st of STATES) {
  let o; try { o = await openState(st) } catch (e) { continue }
  await setCSS(o.p, FULL); const base = await fp(o.p); await o.p.waitForTimeout(300); await setCSS(o.p, FULL); const base2 = await fp(o.p); const mask = new Set(); base.forEach((x, i) => { if (x !== base2[i]) mask.add(i) });
  await setCSS(o.p, finalCSS); if (!eq(await fp(o.p), base, mask)) finalBad.push(st.id); await o.c.close();
}
console.log('final verification:', finalBad.length ? 'DIFF in ' + finalBad.join(',') : 'identical in all ' + STATES.length + ' states');
fs.writeFileSync('/tmp/fp/result.json', JSON.stringify({ imp: IMP, targets, safe: safe.map(i => cands[i]), affecting: [...affecting].map(i => cands[i]), finalBad }, null, 1));
await b.close();
